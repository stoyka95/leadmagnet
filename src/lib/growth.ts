// D21: illustration of value over the KID's 5-year holding period + historical S&P 500 range for longer horizons.
import kid from '../../data/kid_scenarios.json';
import rolling from '../../data/sp500_rolling.json';

export const kidMeta = kid._meta;
export const kidScenarios = kid.scenarios;
export const KID_YEARS = kid._meta.recommendedHoldingYears;
export const historyMeta = rolling._meta;

export interface HistoryRange {
  years: number;
  worstPct: number;
  worstPeriod: string;
  medianPct: number;
  bestPct: number;
  bestPeriod: string;
}

export const historyFor = (years: number): HistoryRange => {
  const clamped = Math.min(30, Math.max(5, Math.round(years)));
  const row = (rolling.byYears as Record<string, Omit<HistoryRange, 'years'> & { windows: number }>)[String(clamped)];
  return { years: clamped, ...row };
};

// Value path (one point per year, 0..years) with a lump sum, a deposit at the start of every month,
// and a constant average annual return. Fund costs are already inside the KID's "after costs" figures.
export const valuePath = (onceCzk: number, monthlyCzk: number, annualPct: number, years = KID_YEARS): number[] => {
  const g = Math.pow(1 + annualPct / 100, 1 / 12) - 1;
  const points = [onceCzk];
  let balance = onceCzk;
  for (let m = 1; m <= years * 12; m++) {
    balance = (balance + monthlyCzk) * (1 + g);
    if (m % 12 === 0) points.push(balance);
  }
  return points;
};

export const paidInPath = (onceCzk: number, monthlyCzk: number, years = KID_YEARS): number[] =>
  Array.from({ length: years + 1 }, (_, y) => onceCzk + monthlyCzk * 12 * y);
