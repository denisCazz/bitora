import type { OpsAlertEvent } from '../../emails/opsAlert';
import { collectDeadlineAlertEvents } from './deadlines';
import { ALERT_REMIND_MS, env } from './env';
import type { MonitorRun } from './monitor';
import { updateOpsState } from './store';

export function collectAlertEvents(run: MonitorRun): OpsAlertEvent[] {
  const prev = run.previousState;
  const now = Date.now();
  const remindAfter = ALERT_REMIND_MS();
  const events: OpsAlertEvent[] = [];

  for (const site of run.sites) {
    const lastAlert = prev.lastAlertAt[`site:${site.id}`] ?? 0;

    if (!site.ok && lastAlert === 0) {
      events.push({
        kind: 'down',
        id: site.id,
        title: site.name,
        detail: `${site.url} · ${site.error || 'non raggiungibile'}`,
      });
    } else if (!site.ok && now - lastAlert >= remindAfter) {
      events.push({
        kind: 'reminder',
        id: site.id,
        title: site.name,
        detail: `Ancora down · ${site.url} · ${site.error || 'non raggiungibile'}`,
      });
    } else if (site.ok && lastAlert > 0) {
      events.push({
        kind: 'recovery',
        id: site.id,
        title: site.name,
        detail: `${site.url} è di nuovo online (${site.statusCode ?? 'OK'})`,
      });
    }
  }

  for (const issue of run.vpsIssues) {
    const key = `vps:${issue.id}`;
    const lastAlert = prev.lastAlertAt[key] ?? 0;
    const alreadyOpen = lastAlert > 0 && now - lastAlert < remindAfter;
    if (!alreadyOpen) {
      events.push({
        kind: 'vps',
        id: issue.id,
        title: issue.label,
        detail: issue.detail,
      });
    }
  }

  const openVps = new Set(run.vpsIssues.map(i => `vps:${i.id}`));
  for (const key of Object.keys(prev.lastAlertAt)) {
    if (!key.startsWith('vps:')) continue;
    if (openVps.has(key)) continue;
    const id = key.slice(4);
    events.push({
      kind: 'recovery',
      id,
      title: `VPS ${id}`,
      detail: 'Soglia rientrata nei limiti',
    });
  }

  for (const deadline of collectDeadlineAlertEvents(prev.deadlines ?? [], prev.lastAlertAt, now)) {
    events.push({
      kind: 'deadline',
      id: deadline.id,
      title: deadline.title,
      detail: deadline.detail,
    });
  }

  return events.filter(event => {
    if (event.kind === 'deadline') return true;
    const resourceId = event.id;
    const window = prev.maintenance[resourceId] ?? prev.maintenance['*'];
    return !window || window.until <= now;
  });
}

function plainText(events: OpsAlertEvent[]): string {
  return events
    .map(event => {
      const icon =
        event.kind === 'recovery' ? '✅' : event.kind === 'reminder' ? '⏰' : event.kind === 'deadline' ? '📅' : '🚨';
      return `${icon} ${event.title}: ${event.detail}`;
    })
    .join('\n');
}

export async function sendOpsEvents(
  events: OpsAlertEvent[],
  persist = true
): Promise<{ sent: boolean; events: number; channels: string[] }> {
  if (events.length === 0) return { sent: false, events: 0, channels: [] };

  const telegramToken = env('OPS_TELEGRAM_BOT_TOKEN');
  const telegramChatId = env('OPS_TELEGRAM_CHAT_ID');

  const problems = events.filter(e => e.kind !== 'recovery').length;
  const subject =
    problems > 0
      ? `[Bitora Ops] ${problems} problem${problems === 1 ? 'a' : 'i'} rilevati`
      : '[Bitora Ops] Servizi tornati online';

  const channels: string[] = [];
  const text = `${subject}\n\n${plainText(events)}\n\nhttps://bitora.it/ops/`;
  if (telegramToken && telegramChatId) {
    try {
      const response = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: telegramChatId, text, disable_web_page_preview: true }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      channels.push('telegram');
    } catch (error) {
      console.error('[ops] invio Telegram fallito:', error);
    }
  }

  if (channels.length === 0) {
    console.error('[ops] alert non inviato: Telegram non configurato o non disponibile');
    return { sent: false, events: events.length, channels };
  }

  if (persist) {
    const now = Date.now();
    updateOpsState(state => {
      state.lastDigestAt = now;
      for (const event of events) {
        if (event.kind === 'recovery') {
          delete state.lastAlertAt[`site:${event.id}`];
          delete state.lastAlertAt[`vps:${event.id}`];
        } else if (event.kind === 'vps') {
          state.lastAlertAt[`vps:${event.id}`] = now;
        } else if (event.kind === 'deadline') {
          state.lastAlertAt[`deadline:${event.id}`] = now;
        } else {
          state.lastAlertAt[`site:${event.id}`] = now;
        }
      }
    });
  }

  return { sent: true, events: events.length, channels };
}

export async function sendOpsAlerts(
  run: MonitorRun
): Promise<{ sent: boolean; events: number; channels: string[] }> {
  return sendOpsEvents(collectAlertEvents(run));
}
