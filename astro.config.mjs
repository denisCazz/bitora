// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import node from '@astrojs/node';
import compressor from 'astro-compressor';

// https://astro.build/config
export default defineConfig({
  adapter: node({ mode: 'standalone' }),
  integrations: [
    tailwind(),
    sitemap(),
    react(),
    compressor({
      gzip: true,
      brotli: true,
    }),
  ],
  // Canonical production origin (affects sitemap, etc.)
  site: 'https://www.bitora.it/',
  base: '/',
  trailingSlash: 'ignore',
  output: 'server',
  redirects: {
    '/cmms': '/gestione-interventi',
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
