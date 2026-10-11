// The full comparison the visitor gets (lead magnet, D2): same numbers on /dekujeme and in the e-mail.
import { usEtfs, ucitsFor } from './etf';
import { feesForTer } from './fees';
import { kidMeta, kidScenarios, KID_YEARS, valuePath, paidInPath, historyFor, historyMeta, type HistoryRange } from './growth';

export interface ReportInput {
  onceCzk: number;
  monthlyCzk: number;
}

export interface ReportRow {
  ticker: string;
  name: string;
  index: string;
  ter: number;
  fees10: number;
  fees20: number;
  euTicker: string;
  euName: string;
  euIsin: string;
  euTer: number;
  euMatch: string;
  euFees10: number;
  euFees20: number;
  usSource: string;
  euSource: string;
}

export const buildReport = (input: ReportInput): ReportRow[] =>
  usEtfs.map((e) => {
    const eu = ucitsFor(e);
    const at = (ter: number, years: number) => feesForTer(ter, { ...input, years }).feesCzk;
    return {
      ticker: e.ticker,
      name: e.name,
      index: e.index,
      ter: e.expenseRatioPct,
      fees10: at(e.expenseRatioPct, 10),
      fees20: at(e.expenseRatioPct, 20),
      euTicker: eu.ticker.split(' ')[0],
      euName: eu.name,
      euIsin: eu.isin,
      euTer: eu.terPct,
      euMatch: eu.match,
      euFees10: at(eu.terPct, 10),
      euFees20: at(eu.terPct, 20),
      usSource: e.source,
      euSource: eu.source,
    };
  });

// The part the gate (D25) unlocks: KID scenarios over 5 years + the S&P 500 history for the chosen horizon (D21, D27).
// Same functions as the calculator, so the e-mail, PDF and thank-you page show the same numbers as the page.
export interface GrowthReport {
  kidYears: number;
  paidIn: number;
  scenarios: { id: string; label: string; avgAnnualPct: number; end: number }[];
  history: HistoryRange;
  kid: { ticker: string; date: string; source: string };
  historySource: { url: string; years: string };
}

export const buildGrowth = (input: ReportInput & { years: number }): GrowthReport => ({
  kidYears: KID_YEARS,
  paidIn: paidInPath(input.onceCzk, input.monthlyCzk)[KID_YEARS],
  scenarios: kidScenarios.map((s) => ({
    id: s.id,
    label: s.label,
    avgAnnualPct: s.avgAnnualPct,
    end: valuePath(input.onceCzk, input.monthlyCzk, s.avgAnnualPct)[KID_YEARS],
  })),
  history: historyFor(input.years),
  kid: { ticker: kidMeta.ticker, date: kidMeta.kidDate, source: kidMeta.source },
  historySource: { url: historyMeta.url, years: historyMeta.years },
});

// Colours of the four scenarios – the same tokens as the chart legend on the page (Calculator.astro)
export const SCENARIO_COLOURS: Record<string, string> = {
  stress: '#69728a', unfavourable: '#3b5bb5', moderate: '#12a16b', favourable: '#064e36',
};
// "Paid in" bar – lighter than the stress scenario, so the two are never confused
export const PAID_COLOUR = '#c3cad8';

// Questions for the broker (CONTENT.md §4)
export const brokerQuestions = [
  'Nabízíte tento konkrétní fond (ISIN) drobným investorům?',
  'Kolik stojí nákup a kolik převod korun na dolary nebo eura?',
  'Je k fondu dostupný dokument KID v češtině nebo angličtině?',
];
