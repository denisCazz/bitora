import type { APIRoute } from 'astro';
import type { AstroCookies } from 'astro';
import { extractBearerToken, isAuthenticated, verifyCronSecret } from '../../../../lib/ops/auth';
import { opsCronSecret } from '../../../../lib/ops/env';
import { isDatabaseConfigured } from '../../../../lib/db';
import { runEditorialPipeline } from '../../../../lib/editorial/pipeline';

export const prerender = false;

function authorize(request: Request, cookies: AstroCookies): boolean {
  if (isAuthenticated(cookies)) return true;
  return Boolean(opsCronSecret() && verifyCronSecret(extractBearerToken(request)));
}

async function handle(request: Request, cookies: AstroCookies, url: URL): Promise<Response> {
  if (!authorize(request, cookies)) {
    return new Response(JSON.stringify({ ok: false, error: 'Non autorizzato' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  }
  if (!isDatabaseConfigured()) {
    return new Response(JSON.stringify({ ok: false, error: 'DATABASE_URL mancante' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  }

  const isForm = Boolean(request.headers.get('content-type')?.includes('form'));
  const form = isForm ? await request.formData() : null;
  const generateDrafts = form
    ? form.get('generateDrafts') !== '0'
    : url.searchParams.get('generateDrafts') !== '0';
  const triggeredBy = isAuthenticated(cookies) ? 'admin' : 'cron';
  const result = await runEditorialPipeline({ triggeredBy, generateDrafts });

  if (form) {
    return new Response(null, {
      status: 303,
      headers: { Location: `/ops/editoriale/run/${result.runId}/` },
    });
  }

  return new Response(JSON.stringify(result), {
    status: result.ok ? 200 : 500,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

export const POST: APIRoute = async ({ request, cookies, url }) => handle(request, cookies, url);
export const GET: APIRoute = async ({ request, cookies, url }) => handle(request, cookies, url);
