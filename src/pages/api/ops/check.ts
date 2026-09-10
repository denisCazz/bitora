import type { APIRoute } from 'astro';
import { runMonitor } from '../../../lib/ops/monitor';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const run = await runMonitor('manual');
  const accept = request.headers.get('accept') || '';
  const wantsJson = accept.includes('application/json') && !accept.includes('text/html');

  if (wantsJson) {
    return new Response(
      JSON.stringify({
        ok: true,
        checkedAt: run.checkedAt,
        sites: { up: run.upCount, down: run.downCount, total: run.sites.length },
        vpsIssues: run.vpsIssues.length,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } }
    );
  }

  const referer = request.headers.get('referer') || '';
  let dest = '/ops/';
  try {
    const url = new URL(referer);
    if (url.pathname.startsWith('/ops'))
      dest = url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
  } catch {
    dest = '/ops/';
  }
  return redirect(dest);
};
