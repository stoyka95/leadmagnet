// Fee and growth maths (D16, D21): the numbers the visitor sees, the e-mail and the PDF all come from here.
import { describe, expect, it } from 'vitest';
import { feesForTer, formatCzk, amountText } from '../../src/lib/fees';
import { valuePath, paidInPath, historyFor, kidScenarios, KID_YEARS } from '../../src/lib/growth';
import { etfByTicker } from '../../src/lib/etf';

const DEFAULTS = { onceCzk: 100_000, monthlyCzk: 3_000, years: 20 };

describe('feesForTer', () => {
  it('charges nothing at 0 % and counts deposits at the start of every month', () => {
    const r = feesForTer(0, DEFAULTS);
    expect(r.feesCzk).toBe(0);
    expect(r.paidInCzk).toBe(100_000 + 3_000 * 12 * 20);
  });

  it('matches the closed form for a lump sum without growth', () => {
    // balance after 12 months = P·(1 − f)^12, fees = P − that; f = TER/12
    const f = 0.12 / 100 / 12;
    const expected = 100_000 * (1 - Math.pow(1 - f, 12));
    expect(feesForTer(0.12, { onceCzk: 100_000, monthlyCzk: 0, years: 1 }).feesCzk).toBeCloseTo(expected, 6);
  });

  it('grows with the fee, with time and with an assumed return', () => {
    const low = feesForTer(0.03, DEFAULTS).feesCzk;
    const high = feesForTer(0.0945, DEFAULTS).feesCzk;
    expect(high).toBeGreaterThan(low);
    expect(feesForTer(0.03, { ...DEFAULTS, years: 30 }).feesCzk).toBeGreaterThan(low);
    expect(feesForTer(0.03, { ...DEFAULTS, annualReturnPct: 7 }).feesCzk).toBeGreaterThan(low);
  });

  it('keeps the SPY/VOO numbers shown on the page and in the e-mail (regression)', () => {
    expect(Math.round(feesForTer(etfByTicker('SPY').expenseRatioPct, DEFAULTS).feesCzk)).toBe(8_662);
    expect(Math.round(feesForTer(etfByTicker('VOO').expenseRatioPct, DEFAULTS).feesCzk)).toBe(2_763);
  });

  it('handles zero amounts without NaN', () => {
    const r = feesForTer(0.07, { onceCzk: 0, monthlyCzk: 0, years: 5 });
    expect(r.feesCzk).toBe(0);
    expect(r.paidInCzk).toBe(0);
  });
});

describe('formatCzk', () => {
  it('formats Czech style with rounding', () => {
    expect(formatCzk(1964.6).replace(/\s/g, ' ')).toBe('1 965 Kč');
    expect(formatCzk(0).replace(/\s/g, ' ')).toBe('0 Kč');
  });
});

describe('amountText', () => {
  it('leaves out a zero amount and never comes back empty', () => {
    expect(amountText(100_000, 3_000)).toBe(`${formatCzk(100_000)} jednorázově + ${formatCzk(3_000)} měsíčně`);
    expect(amountText(0, 3_000)).toBe(`${formatCzk(3_000)} měsíčně`);
    expect(amountText(50_000, 0)).toBe(`${formatCzk(50_000)} jednorázově`);
    expect(amountText(0, 0)).toBe(formatCzk(0));
  });
});

describe('growth (D21)', () => {
  it('equals the money paid in at 0 % return', () => {
    expect(valuePath(100_000, 3_000, 0)).toEqual(paidInPath(100_000, 3_000));
  });

  it('has one point per year of the KID holding period', () => {
    expect(valuePath(100_000, 3_000, 14.8)).toHaveLength(KID_YEARS + 1);
    expect(KID_YEARS).toBe(5);
  });

  it('orders the four KID scenarios from stress to favourable', () => {
    const ends = kidScenarios.map((s) => valuePath(100_000, 3_000, s.avgAnnualPct)[KID_YEARS]);
    expect(kidScenarios.map((s) => s.id)).toEqual(['stress', 'unfavourable', 'moderate', 'favourable']);
    expect([...ends].sort((a, b) => a - b)).toEqual(ends);
  });

  it('clamps the history horizon to the 5–30 years we have data for', () => {
    expect(historyFor(1).years).toBe(5);
    expect(historyFor(99).years).toBe(30);
    expect(historyFor(20)).toMatchObject({ years: 20, worstPct: 2.37, medianPct: 10.91, bestPct: 17.7 });
  });
});
