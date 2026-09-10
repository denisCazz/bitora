import type { APIRoute } from 'astro';
import { extractBearerToken, verifyCronSecret } from '../../../lib/ops/auth';
import { opsCronSecret } from '../../../lib/ops/env';
import { ingestAgentMetrics } from '../../../lib/ops/monitor';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  if (!opsCronSecret() || !verifyCronSecret(extractBearerToken(request))) {
    return new Response(JSON.stringify({ ok: false, error: 'Non autorizzato' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  }

  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'JSON non valido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const metrics = ingestAgentMetrics(payload);
  return new Response(JSON.stringify({ ok: true, receivedAt: metrics.receivedAt }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
};
