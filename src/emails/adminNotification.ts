export interface ContactEmailData {
  nome: string;
  email: string;
  telefono?: string;
  argomento?: string;
  messaggio: string;
  siteUrl?: string;
  ip?: string;
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function renderAdminEmail(data: ContactEmailData): string {
  const siteUrl = data.siteUrl ?? 'https://www.bitora.it';
  const telefono = (data.telefono ?? '').trim() || '-';
  const argomento = (data.argomento ?? '').trim() || '-';
  const ip = (data.ip ?? '').trim();

  const header = 'Bitora · Nuovo contatto';
  const preheader = `Nuovo messaggio da ${data.nome} (${data.email})`;

  return `<!doctype html>
<html lang="it">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>${esc(header)}</title>
  </head>
  <body style="margin:0;padding:0;background:#F8FAFC;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(preheader)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:32px 0;font-family:Arial,Helvetica,sans-serif;">
      <tr>
        <td align="center" style="padding:0 16px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #E2E8F0;">
            <tr>
              <td style="background:#0F172A;color:#ffffff;padding:22px 28px;">
                <div style="font-size:16px;font-weight:800;letter-spacing:0.2px;">Bitora</div>
                <div style="font-size:12px;opacity:0.85;margin-top:4px;">Nuovo messaggio da bitora.it</div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;color:#0F172A;">
                <h2 style="margin:0 0 14px 0;font-size:18px;line-height:1.35;">Dettagli richiesta</h2>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:0 10px;">
                  <tr>
                    <td style="width:130px;color:#64748B;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">Nome</td>
                    <td style="font-size:14px;">${esc(data.nome)}</td>
                  </tr>
                  <tr>
                    <td style="width:130px;color:#64748B;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">Email</td>
                    <td style="font-size:14px;"><a href="mailto:${esc(data.email)}" style="color:#0369A1;text-decoration:none;font-weight:700;">${esc(data.email)}</a></td>
                  </tr>
                  <tr>
                    <td style="width:130px;color:#64748B;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">Telefono</td>
                    <td style="font-size:14px;">${esc(telefono)}</td>
                  </tr>
                  <tr>
                    <td style="width:130px;color:#64748B;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">Argomento</td>
                    <td style="font-size:14px;">${esc(argomento)}</td>
                  </tr>
                  ${ip ? `<tr><td style="width:130px;color:#64748B;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">IP</td><td style="font-size:14px;">${esc(ip)}</td></tr>` : ''}
                </table>

                <div style="margin-top:10px;border-top:1px solid #E2E8F0;padding-top:18px;">
                  <div style="color:#64748B;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:10px;">Messaggio</div>
                  <div style="font-size:14px;line-height:1.6;color:#0F172A;">${esc(data.messaggio).replace(/\\n/g, '<br/>')}</div>
                </div>

                <div style="margin-top:22px;">
                  <a href="${esc(siteUrl)}/contattaci" style="display:inline-block;background:#0369A1;color:#ffffff;text-decoration:none;font-weight:800;border-radius:999px;padding:12px 18px;font-size:13px;">
                    Apri contatti
                  </a>
                </div>
              </td>
            </tr>
            <tr>
              <td style="background:#F8FAFC;padding:18px 28px;font-size:12px;line-height:1.5;color:#64748B;">
                Bitora · Carmagnola (TO) · <a href="mailto:info@bitora.it" style="color:#0369A1;text-decoration:none;">info@bitora.it</a> · +39 351 497 9670
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
