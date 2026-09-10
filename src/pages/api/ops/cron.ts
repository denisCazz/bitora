import type { APIRoute } from 'astro';
import { sendOpsAlerts } from '../../../lib/ops/alerts';
import { extractBearerToken, verifyCronSecret } from '../../../lib/ops/auth';
import { opsCronSecret } from '../../../lib/ops/env';
import { runMonitor } from '../../../lib/ops/monitor';

export const prerender = false;

async function handle(request: Request): Promise<Response> {
  if (!opsCronSecret() || !verifyCronSecret(extractBearerToken(request))) {
    return new Response(JSON.stringify({ ok: false, error: 'Non autorizzato' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  }

  const run = await runMonitor('cron');
  const alerts = await sendOpsAlerts(run);

  return new Response(
    JSON.stringify({
      ok: true,
      checkedAt: run.checkedAt,
      sites: { up: run.upCount, down: run.downCount, total: run.sites.length },
      vpsIssues: run.vpsIssues.length,
      alerts,
    }),
    { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } }
  );
}

export const POST: APIRoute = async ({ request }) => handle(request);
export const GET: APIRoute = async ({ request }) => handle(request);
