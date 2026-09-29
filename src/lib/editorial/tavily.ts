import { env } from '../ops/env';
import { domainFromUrl, fingerprintUrl, isLikelyDuplicateTitle, normalizeUrl } from './dedupe';
import type { EditorialTopic } from './types';

export type TavilyHit = {
  title: string;
  url: string;
  content: string;
  score: number;
  publishedDate?: string;
};

export type TrendInput = {
  fingerprint: string;
  title: string;
  url: string;
  excerpt: string;
  topic: EditorialTopic;
  score: number;
  publishedAt: Date | null;
  raw: unknown;
};

export function tavilyConfigured(): boolean {
  return Boolean(env('TAVILY_API_KEY'));
}

export async function searchTavily(
  query: string,
  options?: { depth?: 'basic' | 'advanced'; maxResults?: number }
): Promise<TavilyHit[]> {
  const key = env('TAVILY_API_KEY');
  if (!key) throw new Error('TAVILY_API_KEY mancante');
  const depth = options?.depth === 'advanced' ? 'advanced' : 'basic';
  const maxResults = options?.maxResults ?? 3;
  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: key,
      query,
      search_depth: depth,
      include_answer: false,
      include_raw_content: false,
      max_results: maxResults,
      topic: 'news',
      days: 21,
    }),
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Tavily ${response.status}: ${body.slice(0, 280)}`);
  }
  const data = (await response.json()) as { results?: Array<Record<string, unknown>> };
  return (data.results ?? [])
    .map((item): TavilyHit | null => {
      const url = normalizeUrl(String(item.url ?? ''));
      if (!url) return null;
      const title = String(item.title ?? '').trim();
      if (!title) return null;
      const hit: TavilyHit = {
        title,
        url,
        content: String(item.content ?? '').trim(),
        score: typeof item.score === 'number' ? item.score : 0,
      };
      if (typeof item.published_date === 'string') hit.publishedDate = item.published_date;
      return hit;
    })
    .filter((item): item is TavilyHit => item !== null);
}

export function toTrendInput(
  hit: TavilyHit,
  topic: EditorialTopic,
  existingTitles: string[]
): TrendInput | null {
  const fingerprint = fingerprintUrl(hit.url);
  if (!fingerprint) return null;
  if (existingTitles.some(title => isLikelyDuplicateTitle(title, hit.title))) return null;
  const publishedAt = hit.publishedDate ? new Date(hit.publishedDate) : null;
  return {
    fingerprint,
    title: hit.title,
    url: hit.url,
    excerpt: hit.content.slice(0, 600),
    topic,
    score: hit.score,
    publishedAt: publishedAt && !Number.isNaN(publishedAt.getTime()) ? publishedAt : null,
    raw: { domain: domainFromUrl(hit.url), ...hit },
  };
}
