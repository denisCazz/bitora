import type { APIRoute } from 'astro';
import { sendOpsEvents } from '../../../lib/ops/alerts';
import { extractBearerToken, verifyCronSecret } from '../../../lib/ops/auth';
import { envNumber, opsCronSecret } from '../../../lib/ops/env';
import { getOpsState, updateOpsState } from '../../../lib/ops/store';

export const prerender = false;

async function handle(request: Request): Promise<Response> {
  if (!opsCronSecret() || !verifyCronSecret(extractBearerToken(request))) {
    return Response.json({ ok: false, error: 'Non autorizzato' }, { status: 401 });
  }

  const now = Date.now();
  const state = getOpsState();
  const staleAfter = envNumber('OPS_CRON_STALE_MS', 12 * 60_000);
  const remindAfter = envNumber('OPS_ALERT_REMIND_MS', 6 * 60 * 60_000);
  const stale = !state.lastCronAt || now - state.lastCronAt > staleAfter;
  let alerts = { sent: false, events: 0, channels: [] as string[] };

  if (stale && now - (state.lastWatchdogAlertAt ?? 0) >= remindAfter) {
    alerts = await sendOpsEvents([
      {
        kind: 'vps',
        id: 'watchdog-cron',
        title: 'Cron monitor',
        detail: state.lastCronAt
          ? `Nessun check da ${Math.round((now - state.lastCronAt) / 60_000)} minuti`
          : 'Cron principale mai registrato',
      },
    ]);
    if (alerts.sent) {
      updateOpsState(current => {
        current.lastWatchdogAlertAt = now;
      });
    }
  } else if (!stale && state.lastWatchdogAlertAt) {
    alerts = await sendOpsEvents([
      {
        kind: 'recovery',
        id: 'watchdog-cron',
        title: 'Cron monitor',
        detail: 'Check automatici nuovamente regolari',
      },
    ]);
    if (alerts.sent) {
      updateOpsState(current => {
        delete current.lastWatchdogAlertAt;
      });
    }
  }

  return Response.json(
    { ok: true, stale, lastCronAt: state.lastCronAt ?? null, alerts },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}

export const GET: APIRoute = ({ request }) => handle(request);
export const POST: APIRoute = ({ request }) => handle(request);
