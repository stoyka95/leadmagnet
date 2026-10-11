// The full comparison the visitor gets (lead magnet, D2): same numbers on /dekujeme and in the e-mail.
import { usEtfs, ucitsFor } from './etf';
import { feesForTer } from './fees';

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

// Questions for the broker (CONTENT.md §4)
export const brokerQuestions = [
  'Nabízíte tento konkrétní fond (ISIN) drobným investorům?',
  'Kolik stojí nákup a kolik převod korun na dolary nebo eura?',
  'Je k fondu dostupný dokument KID v češtině nebo angličtině?',
];
