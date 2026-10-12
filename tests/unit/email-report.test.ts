// What the visitor receives (D2, D26, D27): the report rows, the unlocked growth part and the e-mail built from them.
import { describe, expect, it } from 'vitest';
import { buildReport, buildGrowth } from '../../src/lib/report';
import { buildEmail } from '../../src/lib/email';
import { formatCzk } from '../../src/lib/fees';

const INPUT = { onceCzk: 100_000, monthlyCzk: 3_000, years: 20 };
const SITE = 'https://fingramo.vercel.app';
const plain = (s: string) => s.replace(/\s/g, ' ');

describe('buildReport', () => {
  const rows = buildReport(INPUT);
  it('has all six funds with their European counterpart', () => {
    expect(rows.map((r) => r.ticker)).toEqual(['SPY', 'IVV', 'VOO', 'VTI', 'VT', 'SCHD']);
    for (const r of rows) {
      expect(r.euIsin).toMatch(/^IE/);
      expect(r.fees20).toBeGreaterThan(r.fees10);
      expect(r.euFees20).toBeGreaterThan(r.euFees10);
    }
  });
});

describe('buildGrowth', () => {
  const g = buildGrowth(INPUT);
  it('uses the KID period and the chosen horizon for history', () => {
    expect(g.kidYears).toBe(5);
    expect(g.paidIn).toBe(100_000 + 3_000 * 60);
    expect(g.history.years).toBe(20);
    expect(g.scenarios.map((s) => s.id)).toEqual(['stress', 'unfavourable', 'moderate', 'favourable']);
  });
});

describe('buildEmail', () => {
  it('escapes the visitor’s name (no HTML injection)', () => {
    const { html, text } = buildEmail('<img src=x onerror=alert(1)>', INPUT, SITE);
    expect(html).not.toContain('<img src=x');
    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;');
    expect(text).toContain('<img src=x'); // plain-text part shows it as typed
  });

  it('greets neutrally without a name', () => {
    const { html, text } = buildEmail('', INPUT, SITE);
    expect(html).toContain('Dobrý den,</p>');
    expect(text.startsWith('Dobrý den, tady je')).toBe(true);
  });

  it('contains every promised part: logo, 6 funds, 4 scenarios, history, next steps, risk warning', () => {
    const { html } = buildEmail('Jana', INPUT, SITE);
    expect(html).toContain(`${SITE}/email-logo.png`);
    for (const t of ['SPY', 'IVV', 'VOO', 'VTI', 'VT', 'SCHD', 'SPYL', 'CSPX', 'VUAA', 'XD9U', 'VWCE', 'SPYD']) expect(html).toContain(t);
    for (const s of ['Stresový', 'Nepříznivý', 'Umírněný', 'Příznivý']) expect(html).toContain(`${s} scénář`);
    expect(html).toContain('Historie S&amp;P 500 za 20 let');
    expect(html).toContain('Nejde o předpověď.');
    expect(html).toContain('Upozornění na riziko:');
    expect(html).toContain(`${SITE}/zasady`);
  });

  it('states the SPY vs VOO difference computed from the same rows', () => {
    const rows = buildReport(INPUT);
    const diff = rows.find((r) => r.ticker === 'SPY')!.fees20 - rows.find((r) => r.ticker === 'VOO')!.fees20;
    expect(plain(buildEmail('', INPUT, SITE).html)).toContain(plain(formatCzk(diff)));
  });

  it('mentions the PDF only when it is attached', () => {
    expect(buildEmail('', INPUT, SITE, { hasPdf: true }).html).toContain('v&nbsp;příloze');
    expect(buildEmail('', INPUT, SITE).html).not.toContain('příloze');
  });

  it('has a plain-text part without HTML tags', () => {
    const { text } = buildEmail('Jana', INPUT, SITE);
    expect(text).not.toMatch(/<\/?[a-z][^>]*>/i);
    expect(text).toContain('Upravit výpočet: https://fingramo.vercel.app/#kalkulacka');
  });
});

describe('European fund label (text review 12. 10.)', () => {
  it('says “verze” only for the same index and “alternativa” otherwise – in the report and the e-mail', () => {
    const byTicker = Object.fromEntries(buildReport(INPUT).map((r) => [r.ticker, r]));
    for (const t of ['SPY', 'IVV', 'VOO']) expect(byTicker[t].euLabel).toBe('Evropská verze');
    for (const t of ['VTI', 'VT', 'SCHD']) expect(byTicker[t].euLabel).toBe('Evropská alternativa');
    const { html } = buildEmail('Jana', { ...INPUT, years: 20 }, 'https://fingramo.test', { hasPdf: true });
    expect(html).toContain('Evropská verze SPYL');
    expect(html).toContain('Evropská alternativa XD9U');
    expect(html).not.toContain('Evropská verze XD9U');
  });
});
