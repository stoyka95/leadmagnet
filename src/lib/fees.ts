// Fee calculator (D16): cost of the fund's annual fee (TER) in CZK.
// Main result: no growth – only the money paid in. Optional: the visitor's own assumed return.
// TER is a percentage of the holding's value, so the result does not depend on the USD/CZK rate.

export interface FeeInput {
  onceCzk: number;
  monthlyCzk: number;
  years: number;
  annualReturnPct?: number; // visitor's assumption, default 0
}

export interface FeeResult {
  feesCzk: number;
  paidInCzk: number;
}

export const feesForTer = (terPct: number, input: FeeInput): FeeResult => {
  const months = Math.round(input.years * 12);
  const monthlyFee = terPct / 100 / 12;
  const monthlyGrowth = Math.pow(1 + (input.annualReturnPct ?? 0) / 100, 1 / 12) - 1;

  let balance = input.onceCzk;
  let fees = 0;
  for (let m = 0; m < months; m++) {
    balance += input.monthlyCzk; // deposit at the start of every month (12 × years deposits)
    balance *= 1 + monthlyGrowth;
    const fee = balance * monthlyFee;
    balance -= fee;
    fees += fee;
  }
  const paidIn = input.onceCzk + input.monthlyCzk * months;
  return { feesCzk: fees, paidInCzk: paidIn };
};

const czk = new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 });
export const formatCzk = (value: number): string => czk.format(Math.round(value));
