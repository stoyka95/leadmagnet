// The value-over-5-years line chart (D21), shared by the calculator and /dekujeme, so both show the same picture.
// Drawn in real pixels so the axis labels stay readable on phones. Browser only (needs the SVG element's width).
import { kidScenarios, KID_YEARS, valuePath, paidInPath } from './growth';

const SVGNS = 'http://www.w3.org/2000/svg';
const nf = new Intl.NumberFormat('cs-CZ');
const pf = new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 2 });

const el = (tag: string, attrs: Record<string, string | number>) => {
  const n = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, String(v));
  return n;
};

export interface GrowthSeries { id: string; pts: number[] }

export const drawGrowthChart = (
  svg: SVGSVGElement,
  onceCzk: number,
  monthlyCzk: number,
  colourOf: (scenarioId: string) => string,
): { paid: number[]; series: GrowthSeries[] } => {
  const W = Math.max(300, Math.round(svg.getBoundingClientRect().width) || 600);
  const H = W < 480 ? 220 : 260, L = 52, R = 28, T = 12, B = 28;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  const series = kidScenarios.map((k) => ({ id: k.id, pts: valuePath(onceCzk, monthlyCzk, k.avgAnnualPct) }));
  const paid = paidInPath(onceCzk, monthlyCzk);
  const max = Math.max(...series.flatMap((x) => x.pts), ...paid, 1);
  const x = (i: number) => L + (i / KID_YEARS) * (W - L - R);
  const y = (v: number) => T + (1 - v / max) * (H - T - B);
  const line = (pts: number[]) => pts.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');

  svg.querySelectorAll('g').forEach((g) => g.remove());
  const g = el('g', {});
  for (let i = 0; i <= 4; i++) {
    const v = (max / 4) * i;
    g.appendChild(el('line', { x1: L, x2: W - R, y1: y(v), y2: y(v), stroke: 'currentColor', 'stroke-opacity': 0.12 }));
    const t = el('text', { x: L - 8, y: y(v) + 4, 'text-anchor': 'end', 'font-size': 12, fill: 'currentColor', 'fill-opacity': 0.6 });
    t.textContent = v >= 1e6 ? `${pf.format(v / 1e6)} mil.` : `${nf.format(Math.round(v / 1000))} tis.`;
    g.appendChild(t);
  }
  for (let i = 0; i <= KID_YEARS; i++) {
    const t = el('text', { x: x(i), y: H - 8, 'text-anchor': 'middle', 'font-size': 12, fill: 'currentColor', 'fill-opacity': 0.6 });
    t.textContent = i === 0 ? 'dnes' : W < 480 ? `${i}.` : `${i}. rok`;
    g.appendChild(t);
  }
  g.appendChild(el('path', { d: line(paid), fill: 'none', stroke: 'currentColor', 'stroke-opacity': 0.55, 'stroke-width': 2, 'stroke-dasharray': '6 5' }));
  for (const sr of series) {
    g.appendChild(el('path', { d: line(sr.pts), fill: 'none', stroke: colourOf(sr.id), 'stroke-width': sr.id === 'moderate' ? 3 : 2.25, 'stroke-linecap': 'round' }));
  }
  svg.appendChild(g);
  return { paid, series };
};
