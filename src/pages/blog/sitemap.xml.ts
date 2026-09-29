export const prerender = false;

import type { APIRoute } from 'astro';
import { listPublishedArticles } from '../../lib/editorial/articles';

export const GET: APIRoute = async ({ site }) => {
  const origin = (site?.origin ?? 'https://bitora.it').replace(/\/$/, '');
  const articles = await listPublishedArticles();
  const urls = [
    `<url><loc>${origin}/blog/</loc><changefreq>daily</changefreq></url>`,
    ...articles.map(article => {
      const lastmod = (article.updatedAt ?? article.publishedAt)?.toISOString().slice(0, 10);
      return `<url><loc>${origin}/blog/${article.slug}/</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`;
    }),
  ].join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=600',
    },
  });
};
