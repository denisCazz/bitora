import { Prisma } from '../../../generated/prisma/client';
import { getPrisma } from '../db';
import { articleSnapshot } from './articles';
import { domainFromUrl, normalizeUrl } from './dedupe';
import { isValidSlug } from './slug';
import { assertTransition } from './state';
import type { ArticleStatus } from './types';
import { evaluatePublishReadiness, parseArticleContent } from './validate';

export type ArticleInput = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  topic: string;
  angle?: string;
  abstract?: string;
  seoTitle: string;
  seoDescription: string;
  coverImage?: string;
  coverAlt?: string;
  readTime?: string;
  ctaVariant: string;
  caseStudySlugs: string[];
  visualHints?: string[];
  content: unknown;
  sources: Array<{ title: string; url: string; excerpt?: string }>;
};

function parseInput(form: FormData): ArticleInput {
  const contentRaw = String(form.get('content') || '').trim();
  let content: unknown = {};
  try {
    content = JSON.parse(contentRaw || '{}');
  } catch {
    throw new Error('JSON blocchi non valido');
  }
  const sourcesRaw = String(form.get('sources') || '').trim();
  let sources: ArticleInput['sources'] = [];
  if (sourcesRaw) {
    try {
      const parsed = JSON.parse(sourcesRaw);
      if (Array.isArray(parsed)) {
        sources = parsed
          .map(item => ({
            title: String(item.title || '').trim(),
            url: normalizeUrl(String(item.url || '')) ?? '',
            excerpt: String(item.excerpt || '').trim() || undefined,
          }))
          .filter(item => item.title && item.url);
      }
    } catch {
      throw new Error('JSON fonti non valido');
    }
  }
  const hintsRaw = String(form.get('visualHints') || '')
    .split('\n')
    .map(item => item.trim())
    .filter(Boolean);
  return {
    slug: String(form.get('slug') || '').trim(),
    title: String(form.get('title') || '').trim(),
    excerpt: String(form.get('excerpt') || '').trim(),
    category: String(form.get('category') || '').trim(),
    topic: String(form.get('topic') || '').trim(),
    angle: String(form.get('angle') || '').trim() || undefined,
    abstract: String(form.get('abstract') || '').trim() || undefined,
    seoTitle: String(form.get('seoTitle') || '').trim(),
    seoDescription: String(form.get('seoDescription') || '').trim(),
    coverImage: String(form.get('coverImage') || '').trim() || undefined,
    coverAlt: String(form.get('coverAlt') || '').trim() || undefined,
    readTime: String(form.get('readTime') || '').trim() || undefined,
    ctaVariant: String(form.get('ctaVariant') || 'contact').trim(),
    caseStudySlugs: String(form.get('caseStudySlugs') || '')
      .split(',')
      .map(item => item.trim())
      .filter(Boolean),
    visualHints: hintsRaw,
    content,
    sources,
  };
}

export function readArticleForm(form: FormData): ArticleInput {
  const input = parseInput(form);
  if (!isValidSlug(input.slug)) throw new Error('Slug non valido');
  parseArticleContent(input.content);
  return input;
}

export async function saveArticle(id: string | null, input: ArticleInput, note: string) {
  const prisma = getPrisma();
  const clash = await prisma.article.findUnique({ where: { slug: input.slug } });
  if (clash && clash.id !== id) throw new Error('Slug già in uso');

  const data = {
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt,
    category: input.category,
    topic: input.topic,
    angle: input.angle,
    abstract: input.abstract,
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
    coverImage: input.coverImage,
    coverAlt: input.coverAlt,
    readTime: input.readTime,
    ctaVariant: input.ctaVariant,
    caseStudySlugs: input.caseStudySlugs,
    visualHints: (input.visualHints ?? []) as Prisma.InputJsonValue,
    content: input.content as Prisma.InputJsonValue,
  };

  if (!id) {
    const article = await prisma.article.create({
      data: {
        ...data,
        status: 'DRAFT',
        sources: {
          create: input.sources.map(source => ({
            title: source.title,
            url: source.url,
            excerpt: source.excerpt,
            domain: domainFromUrl(source.url),
          })),
        },
      },
    });
    await prisma.articleRevision.create({
      data: {
        articleId: article.id,
        snapshot: articleSnapshot(article) as Prisma.InputJsonValue,
        note: note || 'Creazione',
      },
    });
    return article;
  }

  const existing = await prisma.article.findUnique({ where: { id } });
  if (!existing) throw new Error('Articolo non trovato');
  if (existing.status === 'PUBLISHED') {
    // keep published unless explicit status change
  }

  const article = await prisma.article.update({
    where: { id },
    data,
  });
  await prisma.source.deleteMany({ where: { articleId: id } });
  if (input.sources.length) {
    await prisma.source.createMany({
      data: input.sources.map(source => ({
        articleId: id,
        title: source.title,
        url: source.url,
        excerpt: source.excerpt,
        domain: domainFromUrl(source.url),
      })),
    });
  }
  await prisma.articleRevision.create({
    data: {
      articleId: id,
      snapshot: articleSnapshot(article) as Prisma.InputJsonValue,
      note: note || 'Modifica admin',
    },
  });
  return article;
}

export async function changeStatus(id: string, to: ArticleStatus, confirmPublish = false) {
  const prisma = getPrisma();
  const article = await prisma.article.findUnique({
    where: { id },
    include: { sources: true },
  });
  if (!article) throw new Error('Articolo non trovato');
  assertTransition(article.status as ArticleStatus, to);

  if (to === 'PUBLISHED') {
    const check = evaluatePublishReadiness({
      slug: article.slug,
      title: article.title,
      seoTitle: article.seoTitle,
      seoDescription: article.seoDescription,
      excerpt: article.excerpt,
      coverImage: article.coverImage,
      coverAlt: article.coverAlt,
      content: article.content,
      sourceCount: article.sources.length,
      caseStudySlugs: article.caseStudySlugs,
      confirm: confirmPublish,
    });
    if (!check.ok) {
      throw new Error(check.errors.join(' · '));
    }
  }

  const updated = await prisma.article.update({
    where: { id },
    data: {
      status: to,
      publishedAt: to === 'PUBLISHED' ? (article.publishedAt ?? new Date()) : article.publishedAt,
    },
  });
  await prisma.articleRevision.create({
    data: {
      articleId: id,
      snapshot: articleSnapshot(updated) as Prisma.InputJsonValue,
      note: `Stato: ${article.status} → ${to}`,
    },
  });
  return updated;
}
