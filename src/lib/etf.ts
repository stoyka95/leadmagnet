// Single source of fund data: data/etf.json (every value has a source in data/SOURCES.md).
import raw from '../../data/etf.json';

export type UsEtf = (typeof raw.us)[number];
export type UcitsEtf = (typeof raw.ucits)[number];

export const usEtfs: UsEtf[] = raw.us;
export const ucitsEtfs: UcitsEtf[] = raw.ucits;
export const dataRetrieved: string = raw._meta.retrieved;

export const ucitsFor = (etf: UsEtf): UcitsEtf => {
  const match = ucitsEtfs.find((u) => u.isin === etf.ucits);
  if (!match) throw new Error(`Missing UCITS counterpart for ${etf.ticker}`);
  return match;
};

export const etfByTicker = (ticker: string): UsEtf => {
  const match = usEtfs.find((e) => e.ticker === ticker);
  if (!match) throw new Error(`Unknown ETF ${ticker}`);
  return match;
};

// What the visitor wants – groups for the comparison switcher (CONTENT.md §3.3)
export const groups = [
  { id: 'sp500', label: 'S&P 500', tickers: ['SPY', 'IVV', 'VOO'] },
  { id: 'usa', label: 'Celé USA', tickers: ['VTI'] },
  { id: 'world', label: 'Celý svět', tickers: ['VT'] },
  { id: 'dividend', label: 'Dividendy', tickers: ['SCHD'] },
] as const;

const czNumber = new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 4 });
const czDate = new Intl.DateTimeFormat('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric' });

// Text review 12. 10.: "verze" only where the European fund tracks the same index; otherwise it is an alternative
export const euLabel = (match: string): string => (match === 'stejný index' ? 'Evropská verze' : 'Evropská alternativa');

export const formatPct = (value: number): string => `${czNumber.format(value)} %`;
export const formatDate = (iso: string): string => czDate.format(new Date(`${iso}T12:00:00`));

// 896439871787 -> "896 mld. USD"; 1.0e12 -> "1,0 bil. USD"
export const formatUsdBig = (value: number): string => {
  if (value >= 1e12) return `${new Intl.NumberFormat('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value / 1e12)} bil. USD`;
  return `${new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 }).format(value / 1e9)} mld. USD`;
};
