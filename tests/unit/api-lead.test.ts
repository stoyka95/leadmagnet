// POST /api/lead (D5, D10, D13, D25, D27): validation, honeypot, insert-only storage, e-mail with PDF.
// Supabase, Resend and the font files are replaced by a fake fetch, so nothing leaves the machine.
import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from '../../src/pages/api/lead';

const SITE = 'https://fingramo.test';
const font = (name: string) => readFileSync(new URL(`../../public/fonts/${name}`, import.meta.url));

type Call = { url: string; init: RequestInit };
let calls: Call[];
let supabaseStatus: number;
let resendStatus: number;
let fontsOk: boolean;

beforeEach(() => {
  calls = [];
  supabaseStatus = 201;
  resendStatus = 200;
  fontsOk = true;
  process.env.SUPABASE_URL = 'https://db.example';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key';
  process.env.RESEND_API_KEY = 'resend-key';
  process.env.EMAIL_FROM = 'Fingramo <srovnani@example.test>';
  vi.stubGlobal('fetch', vi.fn(async (input: string | URL, init: RequestInit = {}) => {
    const url = String(input);
    calls.push({ url, init });
    if (url.includes('/fonts/')) {
      return fontsOk ? new Response(font(url.split('/fonts/')[1])) : new Response('missing', { status: 404 });
    }
    if (url.startsWith('https://db.example')) return new Response(null, { status: supabaseStatus });
    if (url.startsWith('https://api.resend.com')) return new Response('{}', { status: resendStatus });
    throw new Error(`unexpected fetch ${url}`);
  }));
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const VALID = {
  email: '  Jana.Novak@Example.CZ ',
  full_name: 'Jana Nováková',
  phone: '',
  marketing_consent: false,
  consent_version: 'v3-2026-10-11',
  form_location: 'calculator',
  website: '',
  calc: { onceCzk: 100_000, monthlyCzk: 3_000, years: 20 },
  utm: { utm_source: 'meta', utm_medium: 'paid_social', utm_campaign: 'x', utm_content: 'b' },
  analytics_id: 'ph-123',
};

const post = (body: unknown, headers: Record<string, string> = {}) => {
  const request = new Request(`${SITE}/api/lead`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
  return POST({ request, url: new URL(request.url) } as Parameters<typeof POST>[0]);
};
const stored = () => JSON.parse(String(calls.find((c) => c.url.startsWith('https://db.example'))!.init.body));
const sent = () => JSON.parse(String(calls.find((c) => c.url.startsWith('https://api.resend.com'))!.init.body));

describe('validation', () => {
  it('rejects broken JSON', async () => {
    expect((await post('{nope')).status).toBe(400);
    expect(calls).toHaveLength(0);
  });

  it('rejects an oversized body', async () => {
    expect((await post(VALID, { 'content-length': '50000' })).status).toBe(413);
  });

  it.each([
    ['missing e-mail', { ...VALID, email: '' }],
    ['invalid e-mail', { ...VALID, email: 'jana@novak' }],
    ['unknown form location', { ...VALID, form_location: 'popup' }],
    ['missing consent version', { ...VALID, consent_version: '' }],
  ])('rejects %s with 422 and stores nothing', async (_, body) => {
    expect((await post(body)).status).toBe(422);
    expect(calls).toHaveLength(0);
  });

  it('accepts a bot-filled honeypot silently and stores nothing', async () => {
    const res = await post({ ...VALID, website: 'https://spam.example' });
    expect(res.status).toBe(200);
    expect(calls).toHaveLength(0);
  });
});

describe('storing the lead', () => {
  it('stores only the e-mail when the rest is empty (D25) and normalises it', async () => {
    const res = await post({ email: 'a@b.cz', form_location: 'footer', consent_version: 'v3-2026-10-11' });
    expect(res.status).toBe(200);
    const row = stored();
    expect(row).toMatchObject({ email: 'a@b.cz', full_name: null, phone: null, marketing_consent: false, amount_once_czk: 100_000, amount_monthly_czk: 3_000 });
  });

  it('lower-cases and trims the e-mail, keeps UTM and the analytics id', async () => {
    await post(VALID);
    expect(stored()).toMatchObject({ email: 'jana.novak@example.cz', full_name: 'Jana Nováková', utm_content: 'b', analytics_id: 'ph-123', years: 20 });
  });

  it('inserts with return=minimal (egress, D10) and the server key', async () => {
    await post(VALID);
    const insert = calls.find((c) => c.url.startsWith('https://db.example'))!;
    expect(insert.url).toBe('https://db.example/rest/v1/leads');
    expect((insert.init.headers as Record<string, string>).Prefer).toBe('return=minimal');
  });

  it('drops a one-letter name and an invalid phone instead of rejecting the lead', async () => {
    await post({ ...VALID, full_name: 'J', phone: '12ab' });
    expect(stored()).toMatchObject({ full_name: null, phone: null });
  });

  it('keeps a valid phone and an explicit marketing consent only when ticked', async () => {
    await post({ ...VALID, phone: '+420 777 123 456', marketing_consent: true });
    expect(stored()).toMatchObject({ phone: '+420 777 123 456', marketing_consent: true });
    calls = [];
    await post({ ...VALID, marketing_consent: 'yes' });
    expect(stored().marketing_consent).toBe(false); // only a real boolean true counts
  });

  it('stores the phone consent separately, and only together with a phone number (D35)', async () => {
    await post({ ...VALID, phone: '+420 777 123 456', marketing_consent: false, phone_consent: true });
    expect(stored()).toMatchObject({ marketing_consent: false, phone_consent: true });
    calls = [];
    await post({ ...VALID, phone: '', phone_consent: true });
    expect(stored().phone_consent).toBe(false); // nothing to call
    calls = [];
    await post({ ...VALID, phone: '+420 777 123 456', marketing_consent: true });
    expect(stored()).toMatchObject({ marketing_consent: true, phone_consent: false });
  });

  it('D38: with consents offered after the form (ad A) the form never carries a consent', async () => {
    await post({ ...VALID, phone: '+420 777 123 456', marketing_consent: true, phone_consent: true, consent_flow: 'after' });
    expect(stored()).toMatchObject({ marketing_consent: false, phone_consent: false, consent_source: 'thank_you' });
    calls = [];
    await post({ ...VALID, marketing_consent: true });
    expect(stored()).toMatchObject({ marketing_consent: true, consent_source: 'form' });
  });

  it('replaces out-of-range amounts with the defaults', async () => {
    await post({ ...VALID, calc: { onceCzk: -5, monthlyCzk: 1e12, years: 900 } });
    expect(stored()).toMatchObject({ amount_once_czk: 100_000, amount_monthly_czk: 3_000, years: null });
  });

  it('cuts over-long UTM values', async () => {
    await post({ ...VALID, utm: { utm_source: 'x'.repeat(500) } });
    expect(stored().utm_source).toHaveLength(100);
  });

  it('answers 502 when the database refuses, and sends no e-mail', async () => {
    supabaseStatus = 500;
    expect((await post(VALID)).status).toBe(502);
    expect(calls.some((c) => c.url.startsWith('https://api.resend.com'))).toBe(false);
  });

  it('passes on the database rate limit (3 per address in 24 h) and sends no e-mail', async () => {
    supabaseStatus = 429;
    const res = await post(VALID);
    expect(res.status).toBe(429);
    expect(await res.json()).toEqual({ ok: false, error: 'rate_limited' });
    expect(calls.some((c) => c.url.startsWith('https://api.resend.com'))).toBe(false);
  });

  it('answers 503 when the server is not configured', async () => {
    delete process.env.SUPABASE_URL;
    expect((await post(VALID)).status).toBe(503);
  });
});

describe('the e-mail', () => {
  it('goes to the visitor with the PDF attached', async () => {
    const res = await post(VALID);
    expect(await res.json()).toEqual({ ok: true, emailSent: true });
    const mail = sent();
    expect(mail.to).toEqual(['jana.novak@example.cz']);
    expect(mail.html).toContain('Dobrý den, Jana,');
    expect(mail.attachments).toHaveLength(1);
    expect(mail.attachments[0]).toMatchObject({ filename: 'fingramo-srovnani-etf.pdf', content_type: 'application/pdf' });
    expect(Buffer.from(mail.attachments[0].content, 'base64').subarray(0, 5).toString()).toBe('%PDF-');
  });

  it('still goes out, without attachment, when the PDF cannot be built', async () => {
    fontsOk = false;
    const res = await post(VALID);
    expect(res.status).toBe(200);
    const mail = sent();
    expect(mail.attachments).toBeUndefined();
    expect(mail.html).not.toContain('příloze');
  });

  it('does not fail the request when the e-mail service fails (the lead is already stored)', async () => {
    resendStatus = 500;
    const res = await post(VALID);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, emailSent: false });
  });
});
