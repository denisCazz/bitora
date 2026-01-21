// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';
import react from '@astrojs/react';

import compressor from 'astro-compressor';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(), 
    sitemap(), 
    robotsTxt({
      sitemap: true,
      host: 'www.bitora.it',
    }), 
    react(),    compressor({
      gzip: true,
      brotli: true
    })
  ],
  site: 'https://www.bitora.it/',
  base: '/',
  trailingSlash: 'ignore',
  output: 'static',
  compressHTML: true,
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport'
  },  build: {
    inlineStylesheets: 'auto',
    assets: 'assets'
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
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
    }
  },
  vite: {
    build: {
      cssMinify: 'lightningcss',
      minify: 'terser',
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name].[hash][extname]',
          chunkFileNames: 'assets/[name].[hash].js',
          entryFileNames: 'assets/[name].[hash].js'
        },
      },
    },
    ssr: {
      noExternal: ['react-icons']
    }
  },
});