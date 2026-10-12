// POST /api/consent (D38): the optional consents given on the thank-you page by visitors from ad A.
// Supabase is replaced by a fake fetch, so nothing leaves the machine.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from '../../src/pages/api/consent';

type Call = { url: string; init: RequestInit };
let calls: Call[];
let rows: unknown[];
let status: number;

beforeEach(() => {
  calls = [];
  rows = [{ id: 'x' }];
  status = 200;
  process.env.SUPABASE_URL = 'https://db.example';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key';
  vi.stubGlobal('fetch', vi.fn(async (input: string | URL, init: RequestInit = {}) => {
    calls.push({ url: String(input), init });
    return new Response(JSON.stringify(rows), { status });
  }));
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const REF = '0b6e4c1e-7a59-4a8e-9f3b-2c1d5e6f7a8b';
const post = (body: unknown) =>
  POST({ request: new Request('https://fingramo.test/api/consent', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }) } as never);

describe('validation', () => {
  it.each([
    ['no reference', { kind: 'email' }],
    ['a reference that is not a UUID', { lead_ref: 'ph-123', kind: 'email' }],
    ['an unknown kind', { lead_ref: REF, kind: 'sms' }],
  ])('rejects %s with 422 and touches nothing', async (_, body) => {
    expect((await post(body)).status).toBe(422);
    expect(calls).toHaveLength(0);
  });
});

describe('updating the lead', () => {
  it('switches on the e-mail consent only for a lead that was offered it on the thank-you page within 24 h', async () => {
    const res = await post({ lead_ref: REF, kind: 'email' });
    expect(res.status).toBe(200);
    const url = new URL(calls[0].url);
    expect(calls[0].init.method).toBe('PATCH');
    expect(url.pathname).toBe('/rest/v1/leads');
    expect(url.searchParams.get('analytics_id')).toBe(`eq.${REF}`);
    expect(url.searchParams.get('consent_source')).toBe('eq.thank_you');
    expect(url.searchParams.get('created_at')).toMatch(/^gte\.\d{4}-/);
    expect(url.searchParams.get('phone')).toBeNull();
    expect(JSON.parse(String(calls[0].init.body))).toMatchObject({ marketing_consent: true });
  });

  it('a call needs a phone number on the lead', async () => {
    await post({ lead_ref: REF, kind: 'phone' });
    const url = new URL(calls[0].url);
    expect(url.searchParams.get('phone')).toBe('not.is.null');
    expect(JSON.parse(String(calls[0].init.body))).toMatchObject({ phone_consent: true });
  });

  it('answers 404 when no lead matched (wrong reference, older than 24 h, consents given in the form)', async () => {
    rows = [];
    expect((await post({ lead_ref: REF, kind: 'email' })).status).toBe(404);
  });

  it('answers 502 when the database fails', async () => {
    status = 500;
    expect((await post({ lead_ref: REF, kind: 'email' })).status).toBe(502);
  });
});
