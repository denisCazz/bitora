// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import node from '@astrojs/node';
import compressor from 'astro-compressor';

const SITEMAP_EXCLUDE = new Set([
  'https://bitora.it/services/',
  'https://bitora.it/404/',
  'https://bitora.it/landing/',
  'https://bitora.it/tools/',
  'https://bitora.it/cmms/',
  'https://bitora.it/shop/',
  'https://bitora.it/demo/',
  'https://bitora.it/progetti/hololux/',
  'https://bitora.it/progetti/kristina/',
  'https://bitora.it/progetti/wine-cafe/',
  'https://bitora.it/progetti/myzone/',
  'https://bitora.it/automazioni/',
  'https://bitora.it/formazione/',
  'https://bitora.it/piemonte/',
  'https://bitora.it/siti-web/',
  'https://bitora.it/gestionali/',
  'https://bitora.it/casi-studio/',
  'https://bitora.it/contatti/',
]);

// https://astro.build/config
export default defineConfig({
  adapter: node({ mode: 'standalone' }),
  integrations: [
    tailwind(),
    sitemap({
      filter: page => {
        if (SITEMAP_EXCLUDE.has(page)) return false;
        if (page.includes('/ops/')) return false;
        return true;
      },
      customPages: [
        'https://bitora.it/blog/',
        'https://bitora.it/blog/quanto-costa-crm-pmi/',
        'https://bitora.it/blog/quanto-costa-sito-web-pmi/',
        'https://bitora.it/blog/gestionale-pmi-2026/',
        'https://bitora.it/blog/web-design-carmagnola-2025/',
        'https://bitora.it/blog/tessere-nfc-ristoranti/',
      ],
      serialize: item => {
        const path = new URL(item.url).pathname;
        const priority =
          path === '/'
            ? 1
            : /^\/(siti-web-professionali|e-commerce|sistemi-aziendali|app-mobile|intelligenza-artificiale|nfc-ecosystem|servizi|contattaci)\/$/.test(
                  path
                )
              ? 0.9
              : path.startsWith('/progetti/') || path === '/lavori/' || path.startsWith('/blog/')
                ? 0.7
                : /privacy|cookie/.test(path)
                  ? 0.2
                  : 0.6;
        return { ...item, lastmod: new Date().toISOString(), priority };
      },
    }),
    react(),
    compressor({
      gzip: true,
      brotli: true,
    }),
  ],
  // Canonical production origin (affects sitemap, etc.)
  site: 'https://bitora.it/',
  base: '/',
  trailingSlash: 'always',
  output: 'server',
  redirects: {
    '/cmms/': '/gestione-interventi/',
    '/services/': '/servizi/',
    '/shop/': '/e-commerce/',
    '/demo/': '/richiedi-demo/',
    '/progetti/hololux/': '/lavori/',
    '/progetti/kristina/': '/progetti/sartoria-kristina/',
    // Consolidated pages — preserve SEO equity
    '/soluzioni/': '/servizi/',
    '/siti-web-piemonte/': '/siti-web-professionali/',
    '/e-commerce-piemonte/': '/e-commerce/',
    '/siti-web-torino/': '/siti-web-professionali/',
    '/carmagnola/': '/siti-web-professionali/',
    '/grafica-digitale-social-media/': '/servizi/',
    '/prezzi/': '/servizi/',
    '/progetto-fuoco/': '/chi-siamo/',
    '/settori/': '/contattaci/',
    '/settori/ristoranti/': '/nfc-ecosystem/',
    '/settori/turismo/': '/contattaci/',
    '/settori/professionisti/': '/contattaci/',
    '/tessere-nfc-torino/': '/nfc-ecosystem/',
    '/progetti/wine-cafe/': '/lavori/',
    '/progetti/myzone/': '/lavori/',
    // Legacy ai.bitora.it paths (prerendered fallback does not run middleware)
    '/automazioni/': '/intelligenza-artificiale/',
    '/formazione/': '/intelligenza-artificiale/',
    '/piemonte/': '/intelligenza-artificiale/',
    '/siti-web/': '/siti-web-professionali/',
    '/gestionali/': '/sistemi-aziendali/',
    '/casi-studio/': '/lavori/',
    '/contatti/': '/contattaci/',
  },
  // Production fix: prevent false-positive CSRF blocks behind proxies/CDNs
  // (e.g. apex vs www, https termination). If you later ensure correct
  // X-Forwarded-* headers, you can re-enable this.
  security: {
    checkOrigin: false,
    allowedDomains: [
      { hostname: 'bitora.it', protocol: 'https' },
      { hostname: 'www.bitora.it', protocol: 'https' },
      { hostname: 'ai.bitora.it', protocol: 'https' },
    ],
  },
  compressHTML: true,
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  build: {
    inlineStylesheets: 'auto',
    assets: 'assets',
  },
  publicDir: './public',
  outDir: './dist',
  server: {
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    },
  },
  vite: {
    server: {
      // Dev-only: allow POSTs when accessing via non-localhost hostnames/tunnels.
      // This prevents Vite's CSRF protection from rejecting cross-site form posts.
      cors: true,
      allowedHosts: true,
      hmr: {
        host: 'localhost',
        port: 4321,
        protocol: 'ws',
      },
    },
    build: {
      cssMinify: 'lightningcss',
      minify: 'terser',
    },
    ssr: {
      noExternal: ['react-icons'],
      external: ['@prisma/adapter-pg', '@prisma/client', 'pg'],
    },
  },
});
