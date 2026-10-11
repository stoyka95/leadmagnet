// HTML + text e-mail with the comparison (sent via Resend from mail.stoyka.eu, D15).
import { buildReport, brokerQuestions, type ReportInput } from './report';
import { formatCzk } from './fees';
import { formatPct, formatDate, dataRetrieved } from './etf';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

// E-mail clients need inline colours; these mirror tokens.css (green-900, green-100, ink, ink-muted, line).
const C = { green: '#0c2e1f', greenSoft: '#e3efe8', ink: '#111813', muted: '#47524b', line: '#e2e6e3' };

export const buildEmail = (firstName: string, input: ReportInput, siteUrl: string) => {
  const rows = buildReport(input);
  const amount = `${formatCzk(input.onceCzk)} jednorázově + ${formatCzk(input.monthlyCzk)} měsíčně`;
  const subject = 'Vaše srovnání ETF: poplatky v korunách';

  const tableRows = rows
    .map(
      (r) => `
      <tr><td colspan="3" style="padding:16px 0 4px;font-weight:700;font-size:16px;color:${C.ink}">${esc(r.ticker)} · ${esc(r.index)}</td></tr>
      <tr>
        <td style="padding:4px 0;color:${C.muted}">Originál ${esc(r.ticker)} (${formatPct(r.ter)})</td>
        <td style="padding:4px 8px;text-align:right">${formatCzk(r.fees10)}</td>
        <td style="padding:4px 0;text-align:right">${formatCzk(r.fees20)}</td>
      </tr>
      <tr>
        <td style="padding:4px 0;color:${C.muted}">Evropská verze ${esc(r.euTicker)} (${formatPct(r.euTer)})<br><span style="font-size:12px">ISIN ${esc(r.euIsin)} · ${esc(r.euMatch)}</span></td>
        <td style="padding:4px 8px;text-align:right">${formatCzk(r.euFees10)}</td>
        <td style="padding:4px 0;text-align:right">${formatCzk(r.euFees20)}</td>
      </tr>`,
    )
    .join('');

  const html = `<!doctype html><html lang="cs"><body style="margin:0;background:#f3f5f2;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:${C.ink}">
  <div style="max-width:600px;margin:0 auto;padding:24px 16px">
    <p style="font-weight:700;color:${C.green};font-size:18px;margin:0 0 16px">Fingramo</p>
    <h1 style="font-size:22px;line-height:1.25;margin:0 0 8px">Dobrý den${firstName ? `, ${esc(firstName)}` : ''}, tady je vaše srovnání.</h1>
    <p style="color:${C.muted};margin:0 0 16px">Pro částku ${amount}. Poplatky fondu (TER) v korunách, bez růstu investice.</p>
    <table role="presentation" style="width:100%;border-collapse:collapse;font-size:14px;background:#fff;border-radius:12px;padding:8px 16px">
      <tr style="color:${C.muted};font-size:12px"><td></td><td style="text-align:right;padding:0 8px">10 let</td><td style="text-align:right">20 let</td></tr>
      ${tableRows}
    </table>
    <h2 style="font-size:16px;margin:24px 0 8px">Na co se zeptat brokera</h2>
    <ul style="margin:0;padding-left:20px;color:${C.muted}">${brokerQuestions.map((q) => `<li>${esc(q)}</li>`).join('')}</ul>
    <p style="margin:24px 0"><a href="${siteUrl}/#kalkulacka" style="background:${C.green};color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:600">Upravit výpočet</a></p>
    <p style="font-size:12px;color:${C.muted};border-top:1px solid ${C.line};padding-top:12px">
      Data ze stránek správců fondů, staženo ${formatDate(dataRetrieved)}. Zdroje: <a href="${siteUrl}/zdroje">${siteUrl.replace('https://', '')}/zdroje</a>.
      Nezahrnuje poplatky brokera, převod měny ani daně. Investování je spojeno s rizikem, hodnota investice může klesat i stoupat. Nejde o investiční doporučení.<br><br>
      Tento e-mail jste si vyžádali na ${siteUrl.replace('https://', '')}. Fingramo je ukázkový projekt; kontakt k osobním údajům: mykola@stoyka.eu.
    </p>
  </div></body></html>`;

  const text = [
    `Dobrý den${firstName ? `, ${firstName}` : ''}, tady je vaše srovnání pro ${amount}.`,
    '',
    ...rows.map(
      (r) =>
        `${r.ticker} (${formatPct(r.ter)}): 10 let ${formatCzk(r.fees10)}, 20 let ${formatCzk(r.fees20)} | evropská verze ${r.euTicker} ${r.euIsin} (${formatPct(r.euTer)}): 10 let ${formatCzk(r.euFees10)}, 20 let ${formatCzk(r.euFees20)}`,
    ),
    '',
    `Zdroje: ${siteUrl}/zdroje`,
    'Nejde o investiční doporučení. Investování je spojeno s rizikem.',
  ].join('\n');

  return { subject, html, text };
};
