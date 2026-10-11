// The visitor's calculator inputs, shared by the calculator, the forms and the thank-you page.
// Kept in sessionStorage – never in the URL (no personal data in query strings).
export interface CalcState {
  onceCzk: number;
  monthlyCzk: number;
  years: number;
  annualReturnPct: number;
  touched: boolean; // false = defaults, the visitor did not use the calculator
}

export const DEFAULT_CALC: CalcState = { onceCzk: 100000, monthlyCzk: 3000, years: 20, annualReturnPct: 0, touched: false };

export const readCalc = (): CalcState => {
  try {
    return { ...DEFAULT_CALC, ...(JSON.parse(sessionStorage.getItem('fg:calc') ?? '{}') as Partial<CalcState>) };
  } catch {
    return DEFAULT_CALC;
  }
};

export const writeCalc = (state: CalcState): void => {
  try {
    sessionStorage.setItem('fg:calc', JSON.stringify(state));
  } catch {
    /* ignore */
  }
};
