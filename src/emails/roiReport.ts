export interface RoiReportData {
  nome: string;
  email: string;
  savedHours: string;
  grossSaving: string;
  netMonthly: string;
  netYearly: string;
  roiMonthly: string;
  payback: string;
  siteUrl?: string;
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function renderRoiReportEmail(data: RoiReportData): string {
  const siteUrl = data.siteUrl ?? 'https://www.bitora.it';

  return `<!doctype html>
<html lang="it">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Bitora · Report ROI Gestionale</title>
  </head>
  <body style="margin:0;padding:0;background:#F8FAFC;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;">
      <tr>
        <td align="center" style="padding:0 16px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:16px;border:1px solid #E2E8F0;">
            <tr>
              <td style="background:#0F172A;color:#ffffff;padding:22px 28px;">
                <div style="font-size:16px;font-weight:800;">Bitora</div>
                <div style="font-size:12px;opacity:0.85;margin-top:4px;">Report ROI · Calcolatore gestionale</div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;color:#0F172A;">
                <h2 style="margin:0 0 12px 0;font-size:18px;">Ciao ${esc(data.nome)}, ecco la tua stima ROI</h2>
                <p style="margin:0 0 20px 0;font-size:14px;line-height:1.6;color:#334155;">
                  Risultati calcolati con il tool Bitora. Valori indicativi sui parametri inseriti.
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:14px;">
                  <tr><td style="padding:12px 16px;font-size:13px;color:#64748B;">Ore risparmiate / mese</td><td style="padding:12px 16px;font-size:14px;font-weight:700;text-align:right;">${esc(data.savedHours)}</td></tr>
                  <tr><td style="padding:12px 16px;font-size:13px;color:#64748B;border-top:1px solid #E2E8F0;">Risparmio lordo / mese</td><td style="padding:12px 16px;font-size:14px;font-weight:700;text-align:right;border-top:1px solid #E2E8F0;">${esc(data.grossSaving)}</td></tr>
                  <tr><td style="padding:12px 16px;font-size:13px;color:#64748B;border-top:1px solid #E2E8F0;">Beneficio netto / mese</td><td style="padding:12px 16px;font-size:14px;font-weight:700;text-align:right;border-top:1px solid #E2E8F0;">${esc(data.netMonthly)}</td></tr>
                  <tr><td style="padding:12px 16px;font-size:13px;color:#64748B;border-top:1px solid #E2E8F0;">Beneficio netto / anno</td><td style="padding:12px 16px;font-size:14px;font-weight:700;text-align:right;border-top:1px solid #E2E8F0;">${esc(data.netYearly)}</td></tr>
                  <tr><td style="padding:12px 16px;font-size:13px;color:#64748B;border-top:1px solid #E2E8F0;">ROI mensile</td><td style="padding:12px 16px;font-size:14px;font-weight:700;text-align:right;border-top:1px solid #E2E8F0;">${esc(data.roiMonthly)}</td></tr>
                  <tr><td style="padding:12px 16px;font-size:13px;color:#64748B;border-top:1px solid #E2E8F0;">Payback avvio</td><td style="padding:12px 16px;font-size:14px;font-weight:700;text-align:right;border-top:1px solid #E2E8F0;">${esc(data.payback)}</td></tr>
                </table>
                <div style="margin-top:20px;">
                  <a href="${esc(siteUrl)}/contattaci?topic=crm" style="display:inline-block;background:#0369A1;color:#ffffff;text-decoration:none;font-weight:800;border-radius:999px;padding:12px 18px;font-size:13px;">
                    Richiedi analisi dedicata
                  </a>
                </div>
              </td>
            </tr>
            <tr>
              <td style="background:#F8FAFC;padding:18px 28px;font-size:12px;color:#64748B;">
                Bitora · Carmagnola (TO) · info@bitora.it · +39 351 497 9670
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
