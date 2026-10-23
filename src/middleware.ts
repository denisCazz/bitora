import { defineMiddleware } from 'astro:middleware';
import { isAuthenticated, isOpsRoute, isPublicOpsPath } from './lib/ops/auth';

const HIDDEN_PUBLIC_PREFIXES = ['/landing'];

const AI_SUBDOMAIN_REDIRECTS: Record<string, string> = {
  '/': 'https://bitora.it/intelligenza-artificiale/',
  '/automazioni': 'https://bitora.it/intelligenza-artificiale/',
  '/formazione': 'https://bitora.it/intelligenza-artificiale/',
  '/piemonte': 'https://bitora.it/intelligenza-artificiale/',
  '/siti-web': 'https://bitora.it/siti-web-professionali/',
  '/gestionali': 'https://bitora.it/sistemi-aziendali/',
  '/casi-studio': 'https://bitora.it/lavori/',
  '/contatti': 'https://bitora.it/contattaci/?topic=ai',
};

function isHiddenPublicPath(path: string) {
  const normalized = path.replace(/\/$/, '') || '/';
  return HIDDEN_PUBLIC_PREFIXES.some(
    prefix => normalized === prefix || normalized.startsWith(`${prefix}/`)
  );
}

export const onRequest = defineMiddleware(async (context, next) => {
  const host = (
    context.request.headers.get('x-forwarded-host') ||
    context.request.headers.get('host') ||
    context.url.hostname
  )
    .split(',')[0]
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, '');

  if (host === 'ai.bitora.it' || host === 'www.ai.bitora.it') {
    const cleanPath = context.url.pathname.replace(/\/$/, '') || '/';
    const target =
      AI_SUBDOMAIN_REDIRECTS[cleanPath] ?? 'https://bitora.it/intelligenza-artificiale/';
    return new Response(null, {
      status: 301,
      headers: { Location: target },
    });
  }

  const path = context.url.pathname;
  const ops = isOpsRoute(path);
  const hiddenPublic = isHiddenPublicPath(path);

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
  } else if (hiddenPublic) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  }
  return response;
});
