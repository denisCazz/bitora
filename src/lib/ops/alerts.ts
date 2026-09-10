import crypto from 'node:crypto';
import { Resend } from 'resend';
import { renderOpsAlertEmail, type OpsAlertEvent } from '../../emails/opsAlert';
import { ALERT_REMIND_MS, env, opsAlertEmail } from './env';
import type { MonitorRun } from './monitor';
import { getOpsState, updateOpsState } from './store';

function eventKey(events: OpsAlertEvent[]): string {
  return events
    .map(e => `${e.kind}:${e.id}`)
    .sort()
    .join('|');
}

export function collectAlertEvents(run: MonitorRun): OpsAlertEvent[] {
  const prev = getOpsState();
  const now = Date.now();
  const remindAfter = ALERT_REMIND_MS();
  const events: OpsAlertEvent[] = [];

  for (const site of run.sites) {
    const previous = prev.sites[site.id];
    const lastAlert = prev.lastAlertAt[`site:${site.id}`] ?? 0;
    const wasOk = previous ? previous.ok : true;

    if (!site.ok && wasOk) {
      events.push({
        kind: 'down',
        id: site.id,
        title: site.name,
        detail: `${site.url} · ${site.error || 'non raggiungibile'}`,
      });
    } else if (!site.ok && !wasOk && now - lastAlert >= remindAfter) {
      events.push({
        kind: 'reminder',
        id: site.id,
        title: site.name,
        detail: `Ancora down · ${site.url} · ${site.error || 'non raggiungibile'}`,
      });
    } else if (site.ok && previous && !previous.ok) {
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

  return events;
}

export async function sendOpsAlerts(run: MonitorRun): Promise<{ sent: boolean; events: number }> {
  const events = collectAlertEvents(run);
  if (events.length === 0) return { sent: false, events: 0 };

  const apiKey = env('RESEND_API_KEY');
  const mailFrom = env('MAIL_FROM');
  const mailTo = opsAlertEmail();

  if (!apiKey || !mailFrom || !mailTo) {
    console.error('[ops] alert non inviato: configurazione email incompleta');
    return { sent: false, events: events.length };
  }

  const problems = events.filter(e => e.kind !== 'recovery').length;
  const subject =
    problems > 0
      ? `[Bitora Ops] ${problems} problem${problems === 1 ? 'a' : 'i'} rilevati`
      : '[Bitora Ops] Servizi tornati online';

  const minuteBucket = new Date().toISOString().slice(0, 16);
  const idempotencyKey = crypto
    .createHash('sha256')
    .update(`ops-alert|${minuteBucket}|${eventKey(events)}`)
    .digest('hex');

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send(
    {
      from: mailFrom,
      to: mailTo,
      subject,
      html: renderOpsAlertEmail(events, 'https://bitora.it/ops/'),
      headers: { 'Idempotency-Key': idempotencyKey },
    },
    { idempotencyKey }
  );

  if (error) {
    console.error('[ops] invio alert fallito:', error.message);
    return { sent: false, events: events.length };
  }

  const now = Date.now();
  updateOpsState(state => {
    state.lastDigestAt = now;
    for (const event of events) {
      if (event.kind === 'recovery') {
        delete state.lastAlertAt[`site:${event.id}`];
        delete state.lastAlertAt[`vps:${event.id}`];
      } else if (event.kind === 'vps') {
        state.lastAlertAt[`vps:${event.id}`] = now;
      } else {
        state.lastAlertAt[`site:${event.id}`] = now;
      }
    }
  });

  return { sent: true, events: events.length };
}
