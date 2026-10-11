// "Never invent data" (CLAUDE.md §0.5): every fund has a source and a date, every fund is listed in SOURCES.md,
// and the S&P 500 history range is recomputed here from the raw Damodaran returns.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import etf from '../../data/etf.json';
import kid from '../../data/kid_scenarios.json';
import rolling from '../../data/sp500_rolling.json';

const sources = readFileSync(new URL('../../data/SOURCES.md', import.meta.url), 'utf8');
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

describe('data/etf.json', () => {
  it('has a retrieval date and a CNB rate', () => {
    expect(etf._meta.retrieved).toMatch(ISO_DATE);
    expect(etf._meta.fx).toBeTruthy();
  });

  it.each(etf.us)('$ticker has fee, source and a European counterpart', (e) => {
    expect(e.expenseRatioPct).toBeGreaterThan(0);
    expect(e.expenseRatioPct).toBeLessThan(1);
    expect(e.source).toMatch(/^https:\/\//);
    // Some issuers (iShares, Schwab) state the fee without a date; /zdroje then shows "stav ke dni stažení"
    const asOf = (e as { expenseRatioAsOf?: string }).expenseRatioAsOf;
    if (asOf !== undefined) expect(asOf).toMatch(ISO_DATE);
    expect(etf.ucits.some((u) => u.isin === e.ucits)).toBe(true);
    expect(sources).toContain(e.ticker);
  });

  it.each(etf.ucits)('$ticker ($isin) has fee, source and is listed in SOURCES.md', (u) => {
    expect(u.isin).toMatch(/^IE[0-9A-Z]{10}$/);
    expect(u.terPct).toBeGreaterThan(0);
    expect(u.source).toMatch(/^https:\/\//);
    expect(sources).toContain(u.isin);
  });
});

describe('data/kid_scenarios.json', () => {
  it('names the KID it comes from', () => {
    expect(kid._meta.source).toMatch(/^https:\/\//);
    expect(kid._meta.kidDate).toMatch(ISO_DATE);
    expect(sources).toContain(kid._meta.isin);
    expect(kid.scenarios).toHaveLength(4);
  });
});

describe('data/sp500_rolling.json', () => {
  // Recompute every rolling window from the raw annual returns (geometric average, as published)
  const rows = readFileSync(new URL('../../data/sp500_annual_returns.csv', import.meta.url), 'utf8')
    .trim().split(/\r?\n/).slice(1)
    .map((l) => l.split(',')).map(([y, r]) => ({ year: Number(y), r: Number(r) / 100 }));

  const windowsFor = (n: number) => {
    const out: { from: number; to: number; pct: number }[] = [];
    for (let i = 0; i + n <= rows.length; i++) {
      const slice = rows.slice(i, i + n);
      const growth = slice.reduce((acc, x) => acc * (1 + x.r), 1);
      out.push({ from: slice[0].year, to: slice[n - 1].year, pct: (Math.pow(growth, 1 / n) - 1) * 100 });
    }
    return out;
  };

  it('has the raw data and a source', () => {
    expect(rows[0].year).toBe(1928);
    expect(rolling._meta.url).toMatch(/^https:\/\//);
  });

  it.each([5, 10, 15, 20, 25, 30])('%i-year worst, median and best match the raw returns', (n) => {
    const w = windowsFor(n);
    const sorted = [...w].sort((a, b) => a.pct - b.pct);
    const mid = sorted.length % 2 ? sorted[(sorted.length - 1) / 2].pct : (sorted[sorted.length / 2 - 1].pct + sorted[sorted.length / 2].pct) / 2;
    const row = (rolling.byYears as Record<string, { worstPct: number; worstPeriod: string; medianPct: number; bestPct: number; bestPeriod: string; windows: number }>)[String(n)];
    expect(row.windows).toBe(w.length);
    expect(row.worstPct).toBeCloseTo(sorted[0].pct, 1);
    expect(row.bestPct).toBeCloseTo(sorted[sorted.length - 1].pct, 1);
    expect(row.medianPct).toBeCloseTo(mid, 1);
    expect(row.worstPeriod).toBe(`${sorted[0].from}–${sorted[0].to}`);
    expect(row.bestPeriod).toBe(`${sorted[sorted.length - 1].from}–${sorted[sorted.length - 1].to}`);
  });
});
