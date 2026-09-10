import { defineMiddleware } from 'astro:middleware';
import { isAuthenticated, isOpsRoute, isPublicOpsPath } from './lib/ops/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const path = context.url.pathname;
  const ops = isOpsRoute(path);

  if (ops && !isPublicOpsPath(path) && !isAuthenticated(context.cookies)) {
    if (path.startsWith('/api/')) {
      return new Response(JSON.stringify({ ok: false, error: 'Non autorizzato' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
          'X-Robots-Tag': 'noindex, nofollow',
        },
      });
    }

    const nextPath = encodeURIComponent(path);
    return context.redirect(`/ops/login/?next=${nextPath}`);
  }

  const response = await next();
  if (ops) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    response.headers.set('Cache-Control', 'no-store, max-age=0');
  }
  return response;
});
