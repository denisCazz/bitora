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
  site: 'https://www.bitora.it/',
  base: '/',
  trailingSlash: 'ignore',
  output: 'server',
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
