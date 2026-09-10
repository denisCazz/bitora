export interface OpsAlertEvent {
  kind: 'down' | 'recovery' | 'vps' | 'reminder';
  id: string;
  title: string;
  detail: string;
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function row(event: OpsAlertEvent): string {
  const colors: Record<OpsAlertEvent['kind'], string> = {
    down: '#B91C1C',
    reminder: '#B45309',
    vps: '#B45309',
    recovery: '#047857',
  };
  const labels: Record<OpsAlertEvent['kind'], string> = {
    down: 'DOWN',
    reminder: 'ANCORA DOWN',
    vps: 'VPS',
    recovery: 'RECOVERY',
  };
  const color = colors[event.kind];
  return `<tr>
    <td style="padding:10px 0;vertical-align:top;">
      <span style="display:inline-block;background:${color};color:#fff;font-size:10px;font-weight:800;letter-spacing:0.08em;padding:4px 8px;border-radius:999px;">${labels[event.kind]}</span>
    </td>
    <td style="padding:10px 0 10px 12px;">
      <div style="font-size:14px;font-weight:700;color:#0F172A;">${esc(event.title)}</div>
      <div style="font-size:13px;color:#475569;margin-top:4px;line-height:1.5;">${esc(event.detail)}</div>
    </td>
  </tr>`;
}

export function renderOpsAlertEmail(events: OpsAlertEvent[], dashboardUrl: string): string {
  const down = events.filter(
    e => e.kind === 'down' || e.kind === 'reminder' || e.kind === 'vps'
  ).length;
  const recovery = events.filter(e => e.kind === 'recovery').length;
  const header = down > 0 ? 'Bitora Ops · Problemi rilevati' : 'Bitora Ops · Recupero servizi';
  const preheader =
    down > 0 ? `${down} problemi, ${recovery} recovery` : `${recovery} servizi tornati online`;

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
                <div style="font-size:16px;font-weight:800;letter-spacing:0.2px;">Bitora Ops</div>
                <div style="font-size:12px;opacity:0.85;margin-top:4px;">Monitoraggio siti e VPS</div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;color:#0F172A;">
                <h2 style="margin:0 0 8px 0;font-size:18px;line-height:1.35;">${esc(header)}</h2>
                <p style="margin:0 0 18px 0;font-size:14px;color:#475569;">${esc(preheader)}</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${events.map(row).join('')}</table>
                <div style="margin-top:22px;">
                  <a href="${esc(dashboardUrl)}" style="display:inline-block;background:#0369A1;color:#ffffff;text-decoration:none;font-weight:800;border-radius:999px;padding:12px 18px;font-size:13px;">
                    Apri area privata
                  </a>
                </div>
              </td>
            </tr>
            <tr>
              <td style="background:#F8FAFC;padding:18px 28px;font-size:12px;line-height:1.5;color:#64748B;">
                Alert automatico da bitora.it · cron monitoraggio
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
