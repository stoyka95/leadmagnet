// POST /api/consent – D38: visitors from ad A give the optional consents on the thank-you page, after the form.
// The lead is found by its random lead_ref (only in the visitor's own tab). Only a lead that was offered the
// consents there (consent_source = thank_you), within 24 h, can switch them on; a call needs a phone number.
import type { APIRoute } from 'astro';

export const prerender = false;

const env = (key: string): string => process.env[key] ?? (import.meta.env[key] as string | undefined) ?? '';
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const KINDS = { email: 'marketing_consent', phone: 'phone_consent' } as const;

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export const POST: APIRoute = async ({ request }) => {
  if (Number(request.headers.get('content-length') ?? 0) > 2_000) return json(413, { ok: false });

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json(400, { ok: false, error: 'bad_json' });
  }

  const ref = typeof body.lead_ref === 'string' ? body.lead_ref.toLowerCase() : '';
  const kind = body.kind as keyof typeof KINDS;
  if (!UUID_RE.test(ref) || !(kind in KINDS)) return json(422, { ok: false, error: 'validation' });

  const supabaseUrl = env('SUPABASE_URL');
  const supabaseKey = env('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !supabaseKey) {
    console.error('consent: Supabase env missing');
    return json(503, { ok: false, error: 'not_configured' });
  }

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const filter = new URLSearchParams({
    analytics_id: `eq.${ref}`,
    consent_source: 'eq.thank_you',
    created_at: `gte.${since}`,
    select: 'id',
  });
  if (kind === 'phone') filter.set('phone', 'not.is.null');

  const res = await fetch(`${supabaseUrl}/rest/v1/leads?${filter}`, {
    method: 'PATCH',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation', // only the id comes back, to know whether a lead matched
    },
    body: JSON.stringify({ [KINDS[kind]]: true, consent_updated_at: new Date().toISOString() }),
  });
  if (!res.ok) {
    console.error('consent: update failed', res.status, await res.text());
    return json(502, { ok: false, error: 'store_failed' });
  }
  const rows = (await res.json()) as unknown[];
  if (!rows.length) return json(404, { ok: false, error: 'not_found' });
  return json(200, { ok: true });
};
