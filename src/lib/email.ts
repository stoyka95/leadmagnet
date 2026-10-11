// HTML + text e-mail with the comparison (sent via Resend from mail.stoyka.eu, D15). Design follows the page (D19, D26, D27).
// Most clients ignore SVG and many ignore <style>, so the layout is inline and table-based, the logo is a PNG and the
// chart is drawn with table cells. The <style> block only tightens spacing on phones where it is supported.
import { buildReport, buildGrowth, brokerQuestions, SCENARIO_COLOURS, PAID_COLOUR, type ReportInput } from './report';
import { formatCzk } from './fees';
import { formatPct, formatDate, dataRetrieved } from './etf';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

// Inline colours mirror src/styles/tokens.css (palette A, D19). Line = --c-line flattened on white.
const C = {
  navy: '#0f1d45', navyLink: '#1e3a8a', navySoft: '#e8effb',
  green: '#0a7a55', greenDark: '#064e36', greenSoft: '#e1f4ea',
  ink: '#0f1b33', muted: '#46506a', faint: '#69728a',
  line: '#e3e7ef', bg: '#f4f6fa', white: '#ffffff', track: '#eaeff6',
};
const FONT = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif`;
const signed = (v: number) => `${v > 0 ? '+' : ''}${formatPct(v)}`;

export interface EmailOptions {
  hasPdf?: boolean; // the comparison is attached as PDF (D27)
}

export const buildEmail = (firstName: string, input: ReportInput & { years: number }, siteUrl: string, opts: EmailOptions = {}) => {
  const rows = buildReport(input);
  const growth = buildGrowth(input);
  const amount = `${formatCzk(input.onceCzk)} jednorázově + ${formatCzk(input.monthlyCzk)} měsíčně`;
  const subject = 'Vaše srovnání ETF: poplatky v korunách';
  const host = siteUrl.replace(/^https?:\/\//, '');
  const hello = `Dobrý den${firstName ? `, ${esc(firstName)}` : ''},`;
  const helloText = `Dobrý den${firstName ? `, ${firstName}` : ''},`;

  // The headline number, computed from the same report rows as the table (never typed in)
  const spy = rows.find((r) => r.ticker === 'SPY');
  const voo = rows.find((r) => r.ticker === 'VOO');
  const highlight = spy && voo
    ? `SPY a VOO sledují stejný index S&amp;P&nbsp;500. Za 20 let je rozdíl v&nbsp;poplatcích <strong style="white-space:nowrap">${formatCzk(spy.fees20 - voo.fees20)}</strong>.`
    : '';

  const label = `font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:${C.faint}`;
  const box = (bg: string, fg: string, inner: string, top = 12) =>
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:${top}px;background:${bg};border-radius:12px"><tr><td class="pad-s" style="padding:14px 16px;font-size:15px;line-height:1.5;color:${fg}">${inner}</td></tr></table>`;
  const h2 = (t: string, top = 36) => `<h2 style="margin:${top}px 0 6px;font-size:19px;line-height:1.3;color:${C.navy}">${t}</h2>`;
  const note = (t: string) => `<p style="margin:0 0 16px;font-size:14px;line-height:1.5;color:${C.muted}">${t}</p>`;

  // Fee table: the fund name gets its own full-width line, so the numbers never squeeze it on a phone
  const num = `padding:4px 0 4px 12px;text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums;color:${C.ink}`;
  const fundBlocks = rows
    .map(
      (r, i) => `
      <tr><td colspan="3" style="padding:${i ? '18px' : '12px'} 0 4px;border-top:${i ? `1px solid ${C.line}` : '0'}">
        <span style="font-size:17px;font-weight:700;color:${C.navy}">${esc(r.ticker)}</span>
        <span style="font-size:13px;color:${C.faint}">&nbsp;·&nbsp;${esc(r.index)}</span>
      </td></tr>
      <tr>
        <td style="padding:4px 0;color:${C.muted}">Originál z NYSE<br><span style="font-size:13px;color:${C.faint};white-space:nowrap">poplatek ${formatPct(r.ter)}</span></td>
        <td style="${num}">${formatCzk(r.fees10)}</td>
        <td style="${num}">${formatCzk(r.fees20)}</td>
      </tr>
      <tr>
        <td style="padding:6px 0 4px;color:${C.greenDark}"><strong>Evropská verze ${esc(r.euTicker)}</strong><br><span style="font-size:13px;color:${C.faint};white-space:nowrap">poplatek ${formatPct(r.euTer)}</span></td>
        <td style="${num}">${formatCzk(r.euFees10)}</td>
        <td style="${num}">${formatCzk(r.euFees20)}</td>
      </tr>
      <tr><td colspan="3" style="padding:2px 0 0;font-size:12px;line-height:1.4;color:${C.faint}">ISIN ${esc(r.euIsin)} · ${esc(r.euMatch)}</td></tr>`,
    )
    .join('');

  // Bar chart from table cells: works in every client, no image and no third-party chart service
  const max = Math.max(growth.paidIn, ...growth.scenarios.map((s) => s.end), 1);
  const bar = (value: number, colour: string) => {
    const pct = Math.max(2, Math.round((value / max) * 100));
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.track};border-radius:6px"><tr>
      <td width="${pct}%" style="background:${colour};height:12px;border-radius:6px;font-size:1px;line-height:1px">&nbsp;</td>${pct < 100 ? `<td style="font-size:1px;line-height:1px">&nbsp;</td>` : ''}
    </tr></table>`;
  };
  const chartRow = (name: string, sub: string, value: number, colour: string) => `
      <tr>
        <td style="padding:12px 0 6px;font-size:15px;color:${C.ink}">${name} <span style="font-size:13px;color:${C.faint};white-space:nowrap">${sub}</span></td>
        <td style="padding:12px 0 6px 12px;text-align:right;white-space:nowrap;font-size:15px;font-weight:700;color:${C.navy}">${formatCzk(value)}</td>
      </tr>
      <tr><td colspan="2">${bar(value, colour)}</td></tr>`;
  const chart = [
    chartRow('Vloženo', 'vaše vklady', growth.paidIn, PAID_COLOUR),
    ...growth.scenarios.map((s) => chartRow(`${esc(s.label)} scénář`, `(${signed(s.avgAnnualPct)} ročně)`, s.end, SCENARIO_COLOURS[s.id] ?? C.navy)),
  ].join('');

  const h = growth.history;
  const histCell = (title: string, value: number, sub: string) =>
    `<td width="33%" valign="top" style="padding:0 6px 0 0"><div style="font-size:12px;color:${C.muted}">${title}</div><div style="font-size:20px;font-weight:700;color:${C.navy};white-space:nowrap">${signed(value)}</div><div style="font-size:12px;color:${C.faint}">${sub}</div></td>`;

  const steps = [
    `<strong style="color:${C.navy}">Vyberte brokera</strong> a zeptejte se ho:<ul style="margin:6px 0 0;padding-left:18px">${brokerQuestions.map((q) => `<li style="margin:0 0 4px">${esc(q)}</li>`).join('')}</ul>`,
    `<strong style="color:${C.navy}">Ověřte, že nabízí zvolený fond</strong>: hledejte podle ISIN evropské verze.`,
    `<strong style="color:${C.navy}">Přečtěte si dokument KID</strong> fondu, než nakoupíte.`,
  ];
  const stepRows = steps
    .map(
      (s, i) => `
      <tr>
        <td style="width:28px;padding:0 12px 14px 0;vertical-align:top">
          <div style="width:26px;height:26px;line-height:26px;border-radius:13px;background:${C.navySoft};color:${C.navy};font-size:13px;font-weight:700;text-align:center">${i + 1}</div>
        </td>
        <td style="padding:3px 0 14px;font-size:15px;line-height:1.5;color:${C.muted}">${s}</td>
      </tr>`,
    )
    .join('');

  const html = `<!doctype html>
<html lang="cs"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(subject)}</title>
<style>
  @media (max-width:480px) {
    .outer { padding:16px 8px 28px !important; }
    .card { padding:24px 16px !important; border-radius:14px !important; }
    .h1 { font-size:21px !important; }
    .pad-s { padding:12px 14px !important; }
  }
</style></head>
<body style="margin:0;padding:0;background:${C.bg};font-family:${FONT};color:${C.ink};-webkit-text-size-adjust:100%">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0">Poplatky 6 ETF v korunách, 4 scénáře vývoje investice a historie S&amp;P 500 pro vaši částku.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg}">
    <tr><td class="outer" align="center" style="padding:28px 12px 40px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px">

        <tr><td style="padding:0 8px 18px">
          <a href="${siteUrl}/" style="text-decoration:none"><img src="${siteUrl}/email-logo.png" width="167" height="44" alt="Fingramo" style="display:block;border:0;width:167px;height:44px"></a>
        </td></tr>

        <tr><td class="card" style="background:${C.white};border-radius:16px;padding:32px 28px">
          <p style="margin:0 0 4px;font-size:16px;color:${C.muted}">${hello}</p>
          <h1 class="h1" style="margin:0 0 16px;font-size:24px;line-height:1.25;font-weight:700;color:${C.navy}">tady je vaše srovnání ETF v korunách</h1>

          ${box(C.navySoft, C.navy, `<span style="${label};color:${C.navyLink}">Vaše zadání</span><br><strong>${amount}</strong>`, 0)}
          ${highlight ? box(C.greenSoft, C.greenDark, highlight) : ''}
          ${opts.hasPdf ? `<p style="margin:14px 0 0;font-size:14px;line-height:1.5;color:${C.muted}">Celé srovnání máte i v&nbsp;příloze jako <strong style="color:${C.navy}">PDF</strong> k&nbsp;uložení nebo vytištění.</p>` : ''}

          ${h2('Kolik zaplatíte na poplatcích fondu', 32)}
          ${note('Roční poplatek fondu (TER) přepočtený na koruny pro vaši částku, bez růstu investice. Pod každým fondem je jeho evropská verze (UCITS), která sleduje stejný nebo podobný index. Její poplatek může být nižší i vyšší.')}
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;line-height:1.4">
            <tr>
              <td style="padding:0 0 8px;${label};border-bottom:2px solid ${C.line}">Fond</td>
              <td style="padding:0 0 8px 12px;text-align:right;${label};border-bottom:2px solid ${C.line};white-space:nowrap">10 let</td>
              <td style="padding:0 0 8px 12px;text-align:right;${label};border-bottom:2px solid ${C.line};white-space:nowrap">20 let</td>
            </tr>
            ${fundBlocks}
          </table>

          ${h2(`Jak by mohla investice vypadat za ${growth.kidYears} let`)}
          ${note(`Čtyři scénáře z dokumentu KID fondu ${esc(growth.kid.ticker)} (S&amp;P 500, evropská verze) pro vaši částku.`)}
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${chart}</table>
          <p style="margin:14px 0 0;font-size:13px;line-height:1.5;color:${C.muted}"><strong style="color:${C.navy}">Nejde o předpověď.</strong> Ilustrace podle průměrných ročních výnosů po nákladech z KID ze dne ${formatDate(growth.kid.date)}. Hodnota investice může klesnout a můžete přijít o část vložených peněz. KID počítá s jednorázovou investicí, my průměrné výnosy používáme i na měsíční vklady. <a href="${esc(growth.kid.source)}" style="color:${C.navyLink}">KID (PDF)</a></p>

          ${h2(`Historie S&amp;P 500 za ${h.years} let`)}
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.navySoft};border-radius:12px"><tr><td class="pad-s" style="padding:16px">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
              ${histCell('Nejhorší', h.worstPct, esc(h.worstPeriod))}
              ${histCell('Medián', h.medianPct, 'všech období')}
              ${histCell('Nejlepší', h.bestPct, esc(h.bestPeriod))}
            </tr></table>
          </td></tr></table>
          <p style="margin:12px 0 0;font-size:13px;line-height:1.5;color:${C.muted}">Průměrný roční výnos za všechna stejně dlouhá období v letech ${esc(growth.historySource.years)}. <strong style="color:${C.navy}">Historie, ne předpověď.</strong> V&nbsp;amerických dolarech, včetně dividend, bez daní a poplatků. Zdroj: <a href="${esc(growth.historySource.url)}" style="color:${C.navyLink}">A. Damodaran, NYU Stern</a>.</p>

          ${h2('Co dál')}
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px">${stepRows}</table>

          <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:8px">
            <tr><td style="border-radius:999px;background:${C.green}">
              <a href="${siteUrl}/#kalkulacka" style="display:inline-block;padding:14px 28px;font-size:16px;font-weight:600;color:${C.white};text-decoration:none;border-radius:999px">Upravit výpočet</a>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:24px 8px 0;font-size:12px;line-height:1.6;color:${C.faint}">
          <p style="margin:0 0 10px"><strong style="color:${C.muted}">Upozornění na riziko:</strong> Investování do ETF je spojeno s rizikem. Hodnota investice může klesat i stoupat a není zaručena návratnost vložených prostředků. Minulá výkonnost není zárukou budoucích výnosů. Nejde o investiční doporučení ani daňové poradenství. Výpočet nezahrnuje poplatky brokera, převod měny ani daně.</p>
          <p style="margin:0 0 10px">Data ze stránek správců fondů, staženo ${formatDate(dataRetrieved)}. <a href="${siteUrl}/zdroje" style="color:${C.navyLink}">Zdroje dat</a> · <a href="${siteUrl}/zasady" style="color:${C.navyLink}">Zásady ochrany osobních údajů</a></p>
          <p style="margin:0">E-mail jste si vyžádali na ${esc(host)}. Fingramo je ukázkový projekt; kontakt k osobním údajům: <a href="mailto:mykola@stoyka.eu" style="color:${C.navyLink}">mykola@stoyka.eu</a>.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`;

  const text = [
    `${helloText} tady je vaše srovnání ETF v korunách.`,
    `Vaše zadání: ${amount}`,
    spy && voo ? `SPY a VOO sledují stejný index S&P 500. Za 20 let je rozdíl v poplatcích ${formatCzk(spy.fees20 - voo.fees20)}.` : '',
    opts.hasPdf ? 'Celé srovnání máte i v příloze jako PDF.' : '',
    '',
    'Poplatky fondu (TER) v Kč, 10 let / 20 let, bez růstu investice:',
    ...rows.map(
      (r) =>
        `- ${r.ticker} (${formatPct(r.ter)}): ${formatCzk(r.fees10)} / ${formatCzk(r.fees20)}\n  evropská verze ${r.euTicker}, ISIN ${r.euIsin} (${formatPct(r.euTer)}): ${formatCzk(r.euFees10)} / ${formatCzk(r.euFees20)}`,
    ),
    '',
    `Jak by mohla investice vypadat za ${growth.kidYears} let (scénáře z KID fondu ${growth.kid.ticker}, nejde o předpověď):`,
    `- Vloženo: ${formatCzk(growth.paidIn)}`,
    ...growth.scenarios.map((s) => `- ${s.label} scénář (${signed(s.avgAnnualPct)} ročně): ${formatCzk(s.end)}`),
    '',
    `Historie S&P 500 za ${h.years} let (historie, ne předpověď; v USD, bez daní a poplatků): nejhorší ${signed(h.worstPct)} (${h.worstPeriod}), medián ${signed(h.medianPct)}, nejlepší ${signed(h.bestPct)} (${h.bestPeriod}).`,
    '',
    'Co dál:',
    `1. Vyberte brokera a zeptejte se ho: ${brokerQuestions.join(' ')}`,
    '2. Ověřte, že nabízí zvolený fond: hledejte podle ISIN evropské verze.',
    '3. Přečtěte si dokument KID fondu, než nakoupíte.',
    '',
    `Upravit výpočet: ${siteUrl}/#kalkulacka`,
    `Zdroje dat (staženo ${formatDate(dataRetrieved)}): ${siteUrl}/zdroje`,
    'Investování je spojeno s rizikem. Nejde o investiční doporučení.',
  ]
    .filter((l, i, a) => l !== '' || a[i - 1] !== '')
    .join('\n');

  return { subject, html, text };
};
