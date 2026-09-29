export const prerender = false;

import type { APIRoute } from 'astro';
import { listPublishedArticles } from '../../lib/editorial/articles';

export const GET: APIRoute = async ({ site }) => {
  const origin = (site?.origin ?? 'https://bitora.it').replace(/\/$/, '');
  const articles = await listPublishedArticles();
  const items = articles
    .map(article => {
      const url = `${origin}/blog/${article.slug}/`;
      const date = (article.publishedAt ?? article.updatedAt).toUTCString();
      return `<item>
        <title><![CDATA[${article.title}]]></title>
        <link>${url}</link>
        <guid>${url}</guid>
        <pubDate>${date}</pubDate>
        <description><![CDATA[${article.excerpt}]]></description>
      </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Radar Bitora</title>
    <link>${origin}/blog/</link>
    <description>Tendenze tech tradotte in lavori reali.</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=600',
    },
  });
};
