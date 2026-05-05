export interface CustomerReplyData {
  nome: string;
  email: string;
  argomento?: string;
  messaggio: string;
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

export function renderCustomerReplyEmail(data: CustomerReplyData): string {
  const siteUrl = data.siteUrl ?? 'https://www.bitora.it';
  const argomento = (data.argomento ?? '').trim();
  const preheader = 'Abbiamo ricevuto la tua richiesta. Risposta entro 24 ore.';

  return `<!doctype html>
<html lang="it">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>Bitora · Conferma richiesta</title>
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
                <div style="font-size:12px;opacity:0.85;margin-top:4px;">Abbiamo ricevuto la tua richiesta</div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;color:#0F172A;">
                <h2 style="margin:0 0 10px 0;font-size:18px;line-height:1.35;">Ciao ${esc(data.nome)}, grazie.</h2>
                <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#334155;">
                  Il tuo messaggio è arrivato correttamente. Ti rispondiamo <strong>entro 24 ore</strong> con una proposta chiara e modulare.
                </p>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:14px;padding:16px 16px 14px 16px;">
                  <tr>
                    <td style="color:#64748B;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;padding-bottom:8px;">
                      Riepilogo richiesta${argomento ? ` · ${esc(argomento)}` : ''}
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size:14px;line-height:1.6;color:#0F172A;">
                      ${esc(data.messaggio).replace(/\\n/g, '<br/>')}
                    </td>
                  </tr>
                </table>

                <div style="margin-top:18px;">
                  <a href="https://wa.me/393514979670?text=Ciao%2C%20ho%20appena%20inviato%20una%20richiesta%20dal%20sito%20bitora.it" style="display:inline-block;background:#0369A1;color:#ffffff;text-decoration:none;font-weight:800;border-radius:999px;padding:12px 18px;font-size:13px;">
                    Scrivici su WhatsApp
                  </a>
                  <a href="${esc(siteUrl)}" style="display:inline-block;margin-left:10px;color:#0369A1;text-decoration:none;font-weight:800;font-size:13px;">
                    Visita il sito
                  </a>
                </div>

                <p style="margin:18px 0 0 0;font-size:13px;line-height:1.6;color:#64748B;">
                  Se non hai richiesto tu questa email, puoi ignorarla.
                </p>
              </td>
            </tr>
            <tr>
              <td style="background:#F8FAFC;padding:18px 28px;font-size:12px;line-height:1.5;color:#64748B;">
                Bitora · Carmagnola (TO) · <a href="mailto:info@bitora.it" style="color:#0369A1;text-decoration:none;">info@bitora.it</a> · +39 351 497 9670<br/>
                <a href="${esc(siteUrl)}/privacy-policy" style="color:#0369A1;text-decoration:none;">Privacy</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
