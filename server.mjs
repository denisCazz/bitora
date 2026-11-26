// Production entrypoint: wraps the Astro Node handler to add what the adapter
// does not do on its own, then listens on HOST/PORT.
//
// - /healthz answered without touching Astro (cheap Docker/Coolify healthcheck)
// - 301 www.bitora.it -> bitora.it, including prerendered pages that never
//   reach the Astro middleware
// - security headers on every response (astro.config `server.headers` only
//   applies to `astro dev` / `astro preview`, never to the production server)
// - long browser cache for files in public/ (the adapter sends max-age=0)
// - graceful shutdown on SIGTERM so a redeploy does not cut open requests
import http from 'node:http';

process.env.ASTRO_NODE_AUTOSTART = 'disabled';
const { handler } = await import('./dist/server/entry.mjs');

const PORT = Number(process.env.PORT || 4321);
const HOST = process.env.HOST || '0.0.0.0';
const CANONICAL_HOST = 'bitora.it';
const REDIRECT_HOSTS = new Set(['www.bitora.it']);
// Retired ai.bitora.it site. Kept here (not only in src/middleware.ts) because
// prerendered pages such as `/` are served before the Astro middleware runs.
const AI_HOSTS = new Set(['ai.bitora.it', 'www.ai.bitora.it']);
const AI_REDIRECTS = {
  '/': '/intelligenza-artificiale/',
  '/automazioni': '/intelligenza-artificiale/',
  '/formazione': '/intelligenza-artificiale/',
  '/piemonte': '/intelligenza-artificiale/',
  '/siti-web': '/siti-web-professionali/',
  '/gestionali': '/sistemi-aziendali/',
  '/casi-studio': '/lavori/',
  '/contatti': '/contattaci/?topic=ai',
};

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  // No includeSubDomains: other *.bitora.it services must opt in on their own.
  'Strict-Transport-Security': 'max-age=31536000',
};

// Files from public/ have stable names, so they get a long but not immutable
// cache. Hashed build output under /assets/ is already immutable via the adapter.
const PUBLIC_FILE = /\.(?:avif|webp|png|jpe?g|gif|svg|ico|woff2?|ttf|otf|mp4|webm|pdf)$/i;
const PUBLIC_CACHE = 'public, max-age=2592000, stale-while-revalidate=86400';

function firstHeader(value) {
  return String(Array.isArray(value) ? value[0] : (value ?? ''))
    .split(',')[0]
    .trim()
    .toLowerCase();
}

let shuttingDown = false;

const server = http.createServer((req, res) => {
  const url = req.url || '/';

  if (url === '/healthz' || url === '/healthz/') {
    res.writeHead(shuttingDown ? 503 : 200, {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-store',
    });
    res.end(shuttingDown ? 'stopping' : 'ok');
    return;
  }

  const host = firstHeader(req.headers['x-forwarded-host'] || req.headers.host).replace(
    /:\d+$/,
    ''
  );
  if (REDIRECT_HOSTS.has(host)) {
    res.writeHead(301, {
      Location: `https://${CANONICAL_HOST}${url}`,
      'Cache-Control': 'public, max-age=86400',
    });
    res.end();
    return;
  }

  if (AI_HOSTS.has(host)) {
    const path = url.split('?')[0].replace(/\/$/, '') || '/';
    const target = AI_REDIRECTS[path] ?? '/intelligenza-artificiale/';
    res.writeHead(301, {
      Location: `https://${CANONICAL_HOST}${target}`,
      'Cache-Control': 'public, max-age=86400',
    });
    res.end();
    return;
  }

  for (const [key, value] of Object.entries(SECURITY_HEADERS)) res.setHeader(key, value);
  // `send` keeps a Cache-Control that is already set; Astro routes overwrite it.
  if (PUBLIC_FILE.test(url.split('?')[0]) && !url.startsWith('/assets/')) {
    res.setHeader('Cache-Control', PUBLIC_CACHE);
  }

  handler(req, res);
});

server.keepAliveTimeout = 65_000;
server.headersTimeout = 66_000;

server.listen(PORT, HOST, () => {
  console.log(`[server] listening on http://${HOST}:${PORT}`);
});

function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`[server] ${signal} received, closing`);
  server.close(() => process.exit(0));
  server.closeIdleConnections?.();
  setTimeout(() => process.exit(0), 10_000).unref();
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
