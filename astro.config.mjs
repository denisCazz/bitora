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
  'https://bitora.it/cmms/',
  'https://bitora.it/shop/',
  'https://bitora.it/demo/',
  'https://bitora.it/progetti/hololux/',
  'https://bitora.it/progetti/kristina/',
]);

// https://astro.build/config
export default defineConfig({
  adapter: node({ mode: 'standalone' }),
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) => !SITEMAP_EXCLUDE.has(page),
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
  },
  // Production fix: prevent false-positive CSRF blocks behind proxies/CDNs
  // (e.g. apex vs www, https termination). If you later ensure correct
  // X-Forwarded-* headers, you can re-enable this.
  security: {
    checkOrigin: false,
    allowedDomains: [
      { hostname: 'bitora.it', protocol: 'https' },
      { hostname: 'www.bitora.it', protocol: 'https' },
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
    },
  },
});
