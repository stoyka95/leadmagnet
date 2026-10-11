// PDF attachment (D27): builds offline from the bundled fonts, two A4 pages, small enough for e-mail.
import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { buildPdf } from '../../src/lib/pdf';

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(async (input: string | URL) =>
    new Response(readFileSync(new URL(`../../public/fonts/${String(input).split('/fonts/')[1]}`, import.meta.url)))));
});
afterEach(() => vi.unstubAllGlobals());

describe('buildPdf', () => {
  it('creates a two-page A4 document under 100 kB', async () => {
    const bytes = await buildPdf({ onceCzk: 100_000, monthlyCzk: 3_000, years: 20 }, 'https://fingramo.test');
    expect(Buffer.from(bytes.subarray(0, 5)).toString()).toBe('%PDF-');
    expect(bytes.length).toBeLessThan(100_000);
    const doc = await PDFDocument.load(bytes);
    expect(doc.getPageCount()).toBe(2);
    const { width, height } = doc.getPage(0).getSize();
    expect(Math.round(width)).toBe(595);
    expect(Math.round(height)).toBe(842);
    expect(doc.getTitle()).toContain('Srovnání ETF');
  });

  it('fetches the fonts from the site it runs on', async () => {
    await buildPdf({ onceCzk: 0, monthlyCzk: 500, years: 5 }, 'https://fingramo.test');
    const urls = vi.mocked(fetch).mock.calls.map(([u]) => String(u));
    expect(urls).toEqual(['https://fingramo.test/fonts/NotoSans-Regular-latin.ttf', 'https://fingramo.test/fonts/NotoSans-Bold-latin.ttf']);
  });

  it('handles very large amounts without breaking the layout code', async () => {
    const bytes = await buildPdf({ onceCzk: 100_000_000, monthlyCzk: 10_000_000, years: 30 }, 'https://fingramo.test');
    expect((await PDFDocument.load(bytes)).getPageCount()).toBeGreaterThanOrEqual(2);
  });
});
