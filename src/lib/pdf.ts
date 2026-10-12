// The comparison as a PDF attachment of the e-mail (D27). Same data as the e-mail and /dekujeme (report.ts).
// pdf-lib runs in the serverless function without a browser. Noto Sans (OFL, public/fonts) carries the Czech diacritics;
// it is pre-subset to Latin + Latin Extended-A with fontTools and embedded whole, because pdf-lib's own subsetting
// drops glyphs of this font (letters went missing in the first test).
import { PDFDocument, rgb, type PDFFont, type PDFPage, type RGB } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { buildReport, buildGrowth, brokerQuestions, SCENARIO_COLOURS, type ReportInput } from './report';
import { formatCzk } from './fees';
import { formatPct, formatDate, dataRetrieved } from './etf';
import { kidScenarios, KID_YEARS, valuePath, paidInPath } from './growth';

// Colours mirror src/styles/tokens.css (palette A, D19)
const hex = (h: string): RGB => rgb(parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255);
const C = {
  navy: hex('#0f1d45'), navySoft: hex('#e8effb'), green: hex('#12a16b'), greenDark: hex('#064e36'), greenSoft: hex('#e1f4ea'),
  ink: hex('#0f1b33'), muted: hex('#46506a'), faint: hex('#5f6880'), line: hex('#e3e7ef'), track: hex('#eaeff6'), white: rgb(1, 1, 1),
};
// The logo (D26), same paths as src/components/Logo.astro
const LOGO_STEM = 'M6 26h10v8h12v8H16v12H6z';
const LOGO_ARROW = 'M6 26V15L29.7 7.3 28.2 2.8 45.3 6.7 33.8 19.9 32.3 15.4 21 19Q16 20.6 16 24V26z';

const A4: [number, number] = [595.28, 841.89];
const M = 44; // page margin
const W = A4[0] - 2 * M;
const signed = (v: number) => `${v > 0 ? '+' : ''}${formatPct(v)}`;

export const buildPdf = async (input: ReportInput & { years: number }, siteUrl: string): Promise<Uint8Array> => {
  const [regBytes, boldBytes] = await Promise.all(
    ['NotoSans-Regular-latin.ttf', 'NotoSans-Bold-latin.ttf'].map(async (f) => {
      const res = await fetch(`${siteUrl}/fonts/${f}`);
      if (!res.ok) throw new Error(`font ${f}: HTTP ${res.status}`);
      return res.arrayBuffer();
    }),
  );

  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  const reg = await doc.embedFont(regBytes, { subset: false });
  const bold = await doc.embedFont(boldBytes, { subset: false });
  doc.setTitle('Srovnání ETF v korunách – Fingramo');
  doc.setAuthor('Fingramo (ukázkový projekt)');
  doc.setLanguage('cs-CZ');

  let page: PDFPage = doc.addPage(A4);
  let y = A4[1] - M; // cursor, top-down

  const newPage = () => { page = doc.addPage(A4); y = A4[1] - M; };
  const ensure = (h: number) => { if (y - h < M + 20) newPage(); };

  // Wrap text to a width; returns the lines
  const wrap = (text: string, font: PDFFont, size: number, width: number): string[] => {
    const lines: string[] = [];
    let line = '';
    for (const word of text.split(' ')) {
      const next = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(next, size) > width && line) { lines.push(line); line = word; } else line = next;
    }
    if (line) lines.push(line);
    return lines;
  };
  const para = (text: string, o: { font?: PDFFont; size?: number; color?: RGB; x?: number; width?: number; gap?: number } = {}) => {
    const font = o.font ?? reg, size = o.size ?? 10, lh = size * 1.45;
    const lines = wrap(text, font, size, o.width ?? W);
    ensure(lines.length * lh);
    for (const l of lines) { y -= lh; page.drawText(l, { x: o.x ?? M, y: y + size * 0.3, size, font, color: o.color ?? C.muted }); }
    y -= o.gap ?? 0;
  };
  const right = (text: string, xRight: number, yy: number, font: PDFFont, size: number, color: RGB) =>
    page.drawText(text, { x: xRight - font.widthOfTextAtSize(text, size), y: yy, size, font, color });
  const heading = (text: string, top = 22) => {
    ensure(top + 40);
    y -= top;
    page.drawText(text, { x: M, y: y - 14, size: 14, font: bold, color: C.navy });
    y -= 22;
  };
  const paraHeight = (text: string, font: PDFFont, size: number, width: number) => wrap(text, font, size, width).length * size * 1.45;
  // A coloured box: the content height is measured first, so the box is drawn once, under the text
  const panel = (bg: RGB, contentHeight: number, draw: () => void, pad = 12) => {
    ensure(contentHeight + 2 * pad);
    page.drawRectangle({ x: M, y: y - contentHeight - 2 * pad, width: W, height: contentHeight + 2 * pad, color: bg });
    y -= pad;
    draw();
    y -= pad;
  };

  const rows = buildReport(input);
  const growth = buildGrowth(input);

  // Header: logo + date
  page.drawSvgPath(LOGO_STEM, { x: M, y, scale: 0.5, color: C.navy });
  page.drawSvgPath(LOGO_ARROW, { x: M, y, scale: 0.5, color: C.green });
  page.drawText('fingramo', { x: M + 30, y: y - 25, size: 18, font: bold, color: C.navy });
  right(`Vytvořeno ${formatDate(new Date().toISOString().slice(0, 10))}`, A4[0] - M, y - 22, reg, 9, C.faint);
  y -= 50;

  page.drawText('Vaše srovnání ETF v korunách', { x: M, y: y - 20, size: 20, font: bold, color: C.navy });
  y -= 34;

  const amountText = `${formatCzk(input.onceCzk)} jednorázově + ${formatCzk(input.monthlyCzk)} měsíčně`;
  panel(C.navySoft, paraHeight('VAŠE ZADÁNÍ', bold, 8, W - 28) + paraHeight(amountText, bold, 11, W - 28), () => {
    para('VAŠE ZADÁNÍ', { font: bold, size: 8, color: C.navy, x: M + 14, width: W - 28 });
    para(amountText, { font: bold, size: 11, color: C.navy, x: M + 14, width: W - 28 });
  });
  const spy = rows.find((r) => r.ticker === 'SPY'), voo = rows.find((r) => r.ticker === 'VOO');
  if (spy && voo) {
    y -= 8;
    const diff = `SPY a VOO sledují stejný index S&P 500. Za 20 let je rozdíl v poplatcích ${formatCzk(spy.fees20 - voo.fees20)}.`;
    panel(C.greenSoft, paraHeight(diff, reg, 10.5, W - 28), () => para(diff, { size: 10.5, color: C.greenDark, x: M + 14, width: W - 28 }));
  }

  // Fee table
  heading('Kolik zaplatíte na poplatcích fondu');
  para('Roční poplatek fondu (TER) přepočtený na koruny pro vaši částku, bez růstu investice. Pod každým fondem je jeho evropská verze (UCITS), která sleduje stejný nebo podobný index. Její poplatek může být nižší i vyšší.', { size: 9.5, gap: 8 });
  const colTer = M + W - 190, col10 = M + W - 90, col20 = M + W;
  const tableHead = () => {
    ensure(20);
    y -= 12;
    page.drawText('FOND', { x: M, y, size: 8, font: bold, color: C.faint });
    right('POPLATEK', colTer, y, bold, 8, C.faint);
    right('10 LET', col10, y, bold, 8, C.faint);
    right('20 LET', col20, y, bold, 8, C.faint);
    y -= 6;
    page.drawLine({ start: { x: M, y }, end: { x: M + W, y }, thickness: 1.2, color: C.line });
  };
  tableHead();
  for (const r of rows) {
    if (y - 70 < M + 20) { newPage(); tableHead(); }
    y -= 18;
    page.drawText(r.ticker, { x: M, y, size: 11.5, font: bold, color: C.navy });
    page.drawText(r.index, { x: M + bold.widthOfTextAtSize(r.ticker, 11.5) + 8, y, size: 8.5, font: reg, color: C.faint });
    y -= 16;
    page.drawText('Originál z NYSE', { x: M, y, size: 9.5, font: reg, color: C.muted });
    right(formatPct(r.ter), colTer, y, reg, 9.5, C.muted);
    right(formatCzk(r.fees10), col10, y, reg, 9.5, C.ink);
    right(formatCzk(r.fees20), col20, y, reg, 9.5, C.ink);
    y -= 15;
    page.drawText(`${r.euLabel} ${r.euTicker}`, { x: M, y, size: 9.5, font: bold, color: C.greenDark });
    right(formatPct(r.euTer), colTer, y, reg, 9.5, C.muted);
    right(formatCzk(r.euFees10), col10, y, reg, 9.5, C.ink);
    right(formatCzk(r.euFees20), col20, y, reg, 9.5, C.ink);
    y -= 2;
    para(`ISIN ${r.euIsin} · ${r.euMatch}`, { size: 7.5, color: C.faint, width: W - 200 });
    y -= 6;
    page.drawLine({ start: { x: M, y }, end: { x: M + W, y }, thickness: 0.6, color: C.line });
  }

  // Scenarios (D21): the same line chart as on the page and /dekujeme, the bars below are its legend with the amounts
  heading(`Jak by mohla investice vypadat za ${growth.kidYears} let`, 26);
  para(`Čtyři scénáře z dokumentu KID fondu ${growth.kid.ticker} (S&P 500, evropská verze) pro vaši částku.`, { size: 9.5, gap: 6 });
  {
    const chartH = 115, cL = M + 46, cR = M + W - 16;
    ensure(chartH + 30);
    const top = y - 8, bottom = top - chartH;
    const paidPts = paidInPath(input.onceCzk, input.monthlyCzk);
    const series = kidScenarios.map((k) => ({ id: k.id, pts: valuePath(input.onceCzk, input.monthlyCzk, k.avgAnnualPct) }));
    const cMax = Math.max(...series.flatMap((sr) => sr.pts), ...paidPts, 1);
    const cx = (i: number) => cL + (i / KID_YEARS) * (cR - cL);
    const cy = (v: number) => bottom + (v / cMax) * chartH;
    const axisNum = new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 2 });
    for (let i = 0; i <= 4; i++) {
      const v = (cMax / 4) * i;
      page.drawLine({ start: { x: cL, y: cy(v) }, end: { x: cR, y: cy(v) }, thickness: 0.5, color: C.line });
      const label = v >= 1e6 ? `${axisNum.format(v / 1e6)} mil.` : `${axisNum.format(Math.round(v / 1000))} tis.`;
      right(label, cL - 6, cy(v) - 2.5, reg, 7.5, C.faint);
    }
    for (let i = 0; i <= KID_YEARS; i++) {
      const label = i === 0 ? 'dnes' : `${i}. rok`;
      page.drawText(label, { x: cx(i) - reg.widthOfTextAtSize(label, 7.5) / 2, y: bottom - 12, size: 7.5, font: reg, color: C.faint });
    }
    const polyline = (pts: number[], colour: RGB, thickness: number, dashArray?: number[]) => {
      for (let i = 1; i < pts.length; i++) {
        page.drawLine({ start: { x: cx(i - 1), y: cy(pts[i - 1]) }, end: { x: cx(i), y: cy(pts[i]) }, thickness, color: colour, dashArray, lineCap: 1 });
      }
    };
    polyline(paidPts, C.faint, 1.3, [4, 3]);
    for (const sr of series) polyline(sr.pts, hex(SCENARIO_COLOURS[sr.id] ?? '#0f1d45'), sr.id === 'moderate' ? 2.4 : 1.8);
    y = bottom - 16;
  }
  // Legend with the amounts after 5 years: a short line in the chart colour (dashed for the deposits)
  const legendRow = (name: string, sub: string, value: number, colour: RGB, dashed = false) => {
    ensure(16);
    y -= 14;
    page.drawLine({ start: { x: M, y: y + 3 }, end: { x: M + 18, y: y + 3 }, thickness: dashed ? 1.3 : 2.4, color: colour, dashArray: dashed ? [4, 3] : undefined, lineCap: 1 });
    page.drawText(name, { x: M + 26, y, size: 9.5, font: bold, color: C.ink });
    page.drawText(sub, { x: M + 26 + bold.widthOfTextAtSize(name, 9.5) + 6, y, size: 8, font: reg, color: C.faint });
    right(formatCzk(value), M + W, y, bold, 9.5, C.navy);
    y -= 3;
    page.drawLine({ start: { x: M, y }, end: { x: M + W, y }, thickness: 0.5, color: C.line });
  };
  legendRow('Vloženo', 'vaše vklady', growth.paidIn, C.faint, true);
  for (const s of growth.scenarios) legendRow(`${s.label} scénář`, `(${signed(s.avgAnnualPct)} ročně)`, s.end, hex(SCENARIO_COLOURS[s.id] ?? '#0f1d45'));
  y -= 6;
  para(`Nejde o předpověď. Ilustrace podle průměrných ročních výnosů po nákladech z KID ze dne ${formatDate(growth.kid.date)}. Hodnota investice může klesnout a můžete přijít o část vložených peněz. KID počítá s jednorázovou investicí, my průměrné výnosy používáme i na měsíční vklady. Zdroj: ${growth.kid.source}`, { size: 8, color: C.muted });

  // History
  const h = growth.history;
  heading(`Historie S&P 500 za ${h.years} let`, 22);
  panel(C.navySoft, 44, () => {
    const top = y;
    const cell = (i: number, title: string, v: number, sub: string) => {
      const x = M + 14 + i * ((W - 28) / 3);
      page.drawText(title, { x, y: top - 10, size: 8.5, font: reg, color: C.muted });
      page.drawText(signed(v), { x, y: top - 28, size: 15, font: bold, color: C.navy });
      page.drawText(sub, { x, y: top - 40, size: 8, font: reg, color: C.faint });
    };
    cell(0, 'Nejhorší', h.worstPct, h.worstPeriod);
    cell(1, 'Medián', h.medianPct, 'všech období');
    cell(2, 'Nejlepší', h.bestPct, h.bestPeriod);
    y = top - 44;
  });
  y -= 4;
  para(`Průměrný roční výnos za všechna stejně dlouhá období v letech ${growth.historySource.years}. Historie, ne předpověď. V amerických dolarech, včetně dividend, bez daní a poplatků. Zdroj: A. Damodaran, NYU Stern, ${growth.historySource.url}`, { size: 8 });

  // Next steps
  heading('Co dál', 22);
  para('1. Vyberte brokera a zeptejte se ho:', { font: bold, size: 10, color: C.navy });
  for (const q of brokerQuestions) para(`•  ${q}`, { size: 9.5, x: M + 14, width: W - 14 });
  para('2. Ověřte, že nabízí zvolený fond: hledejte podle ISIN evropského fondu.', { font: bold, size: 10, color: C.navy, gap: 2 });
  para('3. Přečtěte si dokument KID fondu, než nakoupíte.', { font: bold, size: 10, color: C.navy, gap: 14 });

  // Legal footer
  ensure(70);
  page.drawLine({ start: { x: M, y }, end: { x: M + W, y }, thickness: 0.6, color: C.line });
  y -= 4;
  para('Upozornění na riziko: Investování do ETF je spojeno s rizikem. Hodnota investice může klesat i stoupat a není zaručena návratnost vložených prostředků. Minulá výkonnost není zárukou budoucích výnosů. Nejde o investiční doporučení ani daňové poradenství. Výpočet nezahrnuje poplatky brokera, převod měny ani daně.', { size: 7.5, color: C.faint });
  para(`Data ze stránek správců fondů, staženo ${formatDate(dataRetrieved)}. Zdroje: ${siteUrl}/zdroje. Fingramo je ukázkový projekt; kontakt k osobním údajům: mykola@stoyka.eu.`, { size: 7.5, color: C.faint });

  // Page numbers
  const pages = doc.getPages();
  pages.forEach((p, i) => {
    const t = `${i + 1} / ${pages.length}`;
    p.drawText(t, { x: A4[0] - M - reg.widthOfTextAtSize(t, 8), y: 24, size: 8, font: reg, color: C.faint });
  });

  return doc.save();
};
