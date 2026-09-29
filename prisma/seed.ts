import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { SEED_ARTICLES } from '../src/lib/editorial/seedArticles';
import { domainFromUrl } from '../src/lib/editorial/dedupe';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL mancante');
  process.exit(1);
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });

async function main() {
  for (const article of SEED_ARTICLES) {
    const saved = await prisma.article.upsert({
      where: { slug: article.slug },
      update: {
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
        publishedAt: article.publishedAt ? new Date(article.publishedAt) : null,
        generatedByAi: Boolean(article.generatedByAi),
      },
      create: {
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
        publishedAt: article.publishedAt ? new Date(article.publishedAt) : null,
        generatedByAi: Boolean(article.generatedByAi),
      },
    });

    await prisma.source.deleteMany({ where: { articleId: saved.id } });
    if (article.sources.length) {
      await prisma.source.createMany({
        data: article.sources.map(source => ({
          articleId: saved.id,
          title: source.title,
          url: source.url,
          domain: domainFromUrl(source.url),
        })),
      });
    }

    const revisions = await prisma.articleRevision.count({ where: { articleId: saved.id } });
    if (revisions === 0) {
      await prisma.articleRevision.create({
        data: {
          articleId: saved.id,
          snapshot: {
            slug: saved.slug,
            title: saved.title,
            status: saved.status,
            content: saved.content,
          },
          note: 'Seed iniziale',
        },
      });
    }
  }

  console.log(`Seed editoriale: ${SEED_ARTICLES.length} articoli`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async error => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
