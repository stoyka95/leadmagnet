// HTML + text e-mail with the comparison (sent via Resend from mail.stoyka.eu, D15). Design follows the page (D19, D26).
// E-mail clients ignore <style> and SVG, so everything is inline and table-based, and the logo is a PNG.
import { buildReport, brokerQuestions, type ReportInput } from './report';
import { formatCzk } from './fees';
import { formatPct, formatDate, dataRetrieved } from './etf';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

// Inline colours mirror src/styles/tokens.css (palette A, D19). Line = --c-line flattened on white.
const C = {
  navy: '#0f1d45', navyLink: '#1e3a8a', navySoft: '#e8effb',
  green: '#0a7a55', greenDark: '#064e36', greenSoft: '#e1f4ea',
  ink: '#0f1b33', muted: '#46506a', faint: '#69728a',
  line: '#e3e7ef', bg: '#f4f6fa', white: '#ffffff',
};
const FONT = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif`;

export const buildEmail = (firstName: string, input: ReportInput, siteUrl: string) => {
  const rows = buildReport(input);
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

  const num = `padding:6px 0 6px 12px;text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums`;
  const fundBlocks = rows
    .map(
      (r, i) => `
      <tr><td colspan="3" style="padding:${i ? '20px' : '4px'} 0 6px;border-top:${i ? `1px solid ${C.line}` : '0'}">
        <span style="font-size:17px;font-weight:700;color:${C.navy}">${esc(r.ticker)}</span>
        <span style="font-size:13px;color:${C.faint}">&nbsp;·&nbsp;${esc(r.index)}</span>
      </td></tr>
      <tr>
        <td style="padding:6px 0;color:${C.muted}">Originál z NYSE <span style="color:${C.faint};white-space:nowrap">(${formatPct(r.ter)})</span></td>
        <td style="${num};color:${C.ink}">${formatCzk(r.fees10)}</td>
        <td style="${num};color:${C.ink}">${formatCzk(r.fees20)}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;color:${C.greenDark}">
          <strong style="white-space:nowrap">Evropská verze ${esc(r.euTicker)}</strong> <span style="color:${C.faint};white-space:nowrap">(${formatPct(r.euTer)})</span><br>
          <span style="font-size:12px;color:${C.faint}">ISIN ${esc(r.euIsin)} · ${esc(r.euMatch)}</span>
        </td>
        <td style="${num};color:${C.ink}">${formatCzk(r.euFees10)}</td>
        <td style="${num};color:${C.ink}">${formatCzk(r.euFees20)}</td>
      </tr>`,
    )
    .join('');

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
<html lang="cs"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:${C.bg};font-family:${FONT};color:${C.ink};-webkit-text-size-adjust:100%">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0">Poplatky 6 ETF z NYSE a jejich evropských verzí v korunách pro vaši částku.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg}">
    <tr><td align="center" style="padding:28px 12px 40px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px">

        <tr><td style="padding:0 8px 20px">
          <a href="${siteUrl}/" style="text-decoration:none"><img src="${siteUrl}/email-logo.png" width="167" height="44" alt="Fingramo" style="display:block;border:0;width:167px;height:44px"></a>
        </td></tr>

        <tr><td style="background:${C.white};border-radius:16px;padding:28px 20px">
          <p style="margin:0 0 6px;font-size:16px;color:${C.muted}">${hello}</p>
          <h1 style="margin:0 0 16px;font-size:24px;line-height:1.25;font-weight:700;color:${C.navy}">tady je vaše srovnání ETF v korunách</h1>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.navySoft};border-radius:12px">
            <tr><td style="padding:14px 16px;font-size:15px;line-height:1.5;color:${C.navy}">
              <span style="font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:${C.navyLink}">Vaše zadání</span><br>
              <strong>${amount}</strong>
            </td></tr>
          </table>

          ${highlight ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;background:${C.greenSoft};border-radius:12px">
            <tr><td style="padding:14px 16px;font-size:15px;line-height:1.5;color:${C.greenDark}">${highlight}</td></tr>
          </table>` : ''}

          <h2 style="margin:32px 0 4px;font-size:18px;color:${C.navy}">Kolik zaplatíte na poplatcích fondu</h2>
          <p style="margin:0 0 16px;font-size:14px;line-height:1.5;color:${C.muted}">Roční poplatek fondu (TER) přepočtený na koruny pro vaši částku, bez růstu investice. Pod každým fondem je jeho evropská verze (UCITS), která sleduje stejný nebo podobný index. Její poplatek může být nižší i vyšší.</p>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;line-height:1.4">
            <tr>
              <td style="padding:0 0 8px;font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:${C.faint};border-bottom:2px solid ${C.line}">Fond</td>
              <td style="padding:0 0 8px 12px;text-align:right;font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:${C.faint};border-bottom:2px solid ${C.line};white-space:nowrap">10 let</td>
              <td style="padding:0 0 8px 12px;text-align:right;font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:${C.faint};border-bottom:2px solid ${C.line};white-space:nowrap">20 let</td>
            </tr>
            ${fundBlocks}
          </table>

          <h2 style="margin:36px 0 14px;font-size:18px;color:${C.navy}">Co dál</h2>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${stepRows}</table>

          <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:12px">
            <tr><td style="border-radius:999px;background:${C.green}">
              <a href="${siteUrl}/#kalkulacka" style="display:inline-block;padding:14px 28px;font-size:16px;font-weight:600;color:${C.white};text-decoration:none;border-radius:999px">Upravit výpočet</a>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:24px 8px 0;font-size:12px;line-height:1.6;color:${C.faint}">
          <p style="margin:0 0 10px"><strong style="color:${C.muted}">Upozornění na riziko:</strong> Investování do ETF je spojeno s rizikem. Hodnota investice může klesat i stoupat a není zaručena návratnost vložených prostředků. Nejde o investiční doporučení ani daňové poradenství. Výpočet nezahrnuje poplatky brokera, převod měny ani daně.</p>
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
    '',
    'Poplatky fondu (TER) v Kč, 10 let / 20 let, bez růstu investice:',
    ...rows.map(
      (r) =>
        `- ${r.ticker} (${formatPct(r.ter)}): ${formatCzk(r.fees10)} / ${formatCzk(r.fees20)}\n  evropská verze ${r.euTicker}, ISIN ${r.euIsin} (${formatPct(r.euTer)}): ${formatCzk(r.euFees10)} / ${formatCzk(r.euFees20)}`,
    ),
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
