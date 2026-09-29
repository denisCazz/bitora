import { getPublicCaseStudies } from '../../data/caseStudies';
import { getPrisma, isDatabaseConfigured } from '../db';
import { ctaSpec } from './cta';
import { parseArticleContent } from './validate';
import { isPublicStatus } from './state';
import type { ArticleContent, ArticleStatus, CtaVariant } from './types';
import type { Article, Source } from '../../../generated/prisma/client';

export type PublicArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  topic: string;
  status: ArticleStatus;
  angle: string | null;
  abstract: string | null;
  seoTitle: string;
  seoDescription: string;
  coverImage: string | null;
  coverAlt: string | null;
  readTime: string | null;
  ctaVariant: CtaVariant;
  caseStudySlugs: string[];
  visualHints: string[];
  content: ArticleContent;
  publishedAt: Date | null;
  updatedAt: Date;
  createdAt: Date;
  generatedByAi: boolean;
  sources: Array<{ title: string; url: string; excerpt: string | null; domain: string | null }>;
  cases: ReturnType<typeof getPublicCaseStudies>;
};

function mapArticle(article: Article & { sources?: Source[] }): PublicArticle {
  const visualHints = Array.isArray(article.visualHints)
    ? article.visualHints.filter((item): item is string => typeof item === 'string')
    : [];
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category,
    topic: article.topic,
    status: article.status as ArticleStatus,
    angle: article.angle,
    abstract: article.abstract,
    seoTitle: article.seoTitle,
    seoDescription: article.seoDescription,
    coverImage: article.coverImage,
    coverAlt: article.coverAlt,
    readTime: article.readTime,
    ctaVariant: ctaSpec(article.ctaVariant, article.topic, article.category).variant,
    caseStudySlugs: article.caseStudySlugs,
    visualHints,
    content: parseArticleContent(article.content),
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    createdAt: article.createdAt,
    generatedByAi: article.generatedByAi,
    sources: (article.sources ?? []).map(source => ({
      title: source.title,
      url: source.url,
      excerpt: source.excerpt,
      domain: source.domain,
    })),
    cases: getPublicCaseStudies().filter(cs => article.caseStudySlugs.includes(cs.slug)),
  };
}

export async function listPublishedArticles(): Promise<PublicArticle[]> {
  if (!isDatabaseConfigured()) return [];
  const rows = await getPrisma().article.findMany({
    where: { status: 'PUBLISHED' },
    include: { sources: true },
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
  });
  return rows.flatMap(row => {
    try {
      return [mapArticle(row)];
    } catch {
      return [];
    }
  });
}

export async function listPublishedByCategory(): Promise<Record<string, PublicArticle[]>> {
  const articles = await listPublishedArticles();
  const grouped: Record<string, PublicArticle[]> = {};
  for (const article of articles) {
    grouped[article.category] ??= [];
    grouped[article.category].push(article);
  }
  return grouped;
}

export async function getArticleBySlug(
  slug: string,
  options: { preview?: boolean; allowStatuses?: ArticleStatus[] } = {}
): Promise<PublicArticle | null> {
  if (!isDatabaseConfigured()) return null;
  const article = await getPrisma().article.findUnique({
    where: { slug },
    include: { sources: true },
  });
  if (!article) return null;
  if (options.preview && options.allowStatuses?.includes(article.status as ArticleStatus)) {
    return mapArticle(article);
  }
  if (!isPublicStatus(article.status as ArticleStatus)) return null;
  return mapArticle(article);
}

export async function countEditorialStats() {
  if (!isDatabaseConfigured()) {
    return { drafts: 0, review: 0, published: 0, archived: 0, trends: 0, leads: 0 };
  }
  const prisma = getPrisma();
  const [drafts, review, published, archived, trends, leads] = await Promise.all([
    prisma.article.count({ where: { status: 'DRAFT' } }),
    prisma.article.count({ where: { status: 'IN_REVIEW' } }),
    prisma.article.count({ where: { status: 'PUBLISHED' } }),
    prisma.article.count({ where: { status: 'ARCHIVED' } }),
    prisma.trendCandidate.count({ where: { status: 'NEW' } }),
    prisma.lead.count(),
  ]);
  return { drafts, review, published, archived, trends, leads };
}

export function articleSnapshot(article: Article) {
  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category,
    topic: article.topic,
    status: article.status,
    angle: article.angle,
    abstract: article.abstract,
    seoTitle: article.seoTitle,
    seoDescription: article.seoDescription,
    coverImage: article.coverImage,
    coverAlt: article.coverAlt,
    readTime: article.readTime,
    ctaVariant: article.ctaVariant,
    caseStudySlugs: article.caseStudySlugs,
    visualHints: article.visualHints,
    content: article.content,
    publishedAt: article.publishedAt,
  };
}
