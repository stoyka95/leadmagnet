// POST /api/lead – validates, stores the lead in Supabase (insert only, D10) and sends the comparison e-mail.
import type { APIRoute } from 'astro';
import { buildEmail } from '../../lib/email';
import { buildPdf } from '../../lib/pdf';

export const prerender = false;

const env = (key: string): string => process.env[key] ?? (import.meta.env[key] as string | undefined) ?? '';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LOCATIONS = new Set(['calculator', 'compare', 'footer']);

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const str = (v: unknown, max: number): string | null => {
  if (typeof v !== 'string') return null;
  const t = v.trim();
  return t ? t.slice(0, max) : null;
};
const int = (v: unknown, min: number, max: number): number | null =>
  typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max ? Math.round(v) : null;

export const POST: APIRoute = async ({ request, url }) => {
  if (Number(request.headers.get('content-length') ?? 0) > 20_000) return json(413, { ok: false });

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json(400, { ok: false, error: 'bad_json' });
  }

  // Honeypot filled → pretend success, store nothing
  if (str(body.company, 100)) return json(200, { ok: true });

  // D25: only the e-mail is required; a one-letter name is dropped rather than rejected
  const nameRaw = str(body.full_name, 120);
  const fullName = nameRaw && nameRaw.length >= 2 ? nameRaw : null;
  const email = str(body.email, 254)?.toLowerCase() ?? null;
  const phoneRaw = str(body.phone, 30);
  const phone = phoneRaw && /^\+?\d{6,15}$/.test(phoneRaw.replace(/[\s()-]/g, '')) ? phoneRaw : null;
  const location = str(body.form_location, 20);
  const consentVersion = str(body.consent_version, 40);

  if (!email || !EMAIL_RE.test(email) || !location || !LOCATIONS.has(location) || !consentVersion) {
    return json(422, { ok: false, error: 'validation' });
  }

  const calc = (body.calc ?? {}) as Record<string, unknown>;
  const utm = (body.utm ?? {}) as Record<string, unknown>;
  const onceCzk = int(calc.onceCzk, 0, 100_000_000) ?? 100_000;
  const monthlyCzk = int(calc.monthlyCzk, 0, 10_000_000) ?? 3_000;
  const years = int(calc.years, 1, 50);

  const row = {
    full_name: fullName,
    email,
    phone,
    marketing_consent: body.marketing_consent === true,
    consent_version: consentVersion,
    form_location: location,
    amount_once_czk: onceCzk,
    amount_monthly_czk: monthlyCzk,
    years,
    utm_source: str(utm.utm_source, 100),
    utm_medium: str(utm.utm_medium, 100),
    utm_campaign: str(utm.utm_campaign, 100),
    utm_content: str(utm.utm_content, 100),
    analytics_id: str(body.analytics_id, 100),
  };

  const supabaseUrl = env('SUPABASE_URL');
  const supabaseKey = env('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !supabaseKey) {
    console.error('lead: Supabase env missing');
    return json(503, { ok: false, error: 'not_configured' });
  }

  const insert = await fetch(`${supabaseUrl}/rest/v1/leads`, {
    method: 'POST',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal', // nothing comes back – keeps egress minimal (D10)
    },
    body: JSON.stringify(row),
  });
  if (!insert.ok) {
    console.error('lead: insert failed', insert.status, await insert.text());
    return json(502, { ok: false, error: 'store_failed' });
  }

  // The lead is stored; a failed e-mail must not fail the request (the thank-you page shows the comparison anyway)
  const resendKey = env('RESEND_API_KEY');
  let emailSent = false;
  if (resendKey) {
    const input = { onceCzk, monthlyCzk, years: years ?? 20 };
    // D27: the comparison as a PDF attachment; if it cannot be built, the e-mail still goes out without it
    let pdfBase64: string | null = null;
    try {
      pdfBase64 = Buffer.from(await buildPdf(input, url.origin)).toString('base64');
    } catch (err) {
      console.error('lead: PDF failed', err);
    }
    const { subject, html, text } = buildEmail(fullName?.split(/\s+/)[0] ?? '', input, url.origin, { hasPdf: Boolean(pdfBase64) });
    const send = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: env('EMAIL_FROM'), to: [email], subject, html, text,
        ...(pdfBase64 && { attachments: [{ filename: 'fingramo-srovnani-etf.pdf', content: pdfBase64 }] }),
      }),
    });
    emailSent = send.ok;
    if (!send.ok) console.error('lead: e-mail failed', send.status, await send.text());
  } else {
    console.error('lead: RESEND_API_KEY missing');
  }

  return json(200, { ok: true, emailSent });
};
