import { Prisma } from '../../../generated/prisma/client';
import { getPrisma, isDatabaseConfigured } from '../db';
import { articleSnapshot } from './articles';
import {
  budgetRemaining,
  isWithinInterval,
  nextRunAt,
  rotateStartIndex,
  selectRotated,
  startOfUtcDay,
  tavilyCallCost,
} from './budget';
import { editorialConfig, editorialCronEnabled } from './config';
import { domainFromUrl } from './dedupe';
import { logRun } from './log';
import { generateArticleDraft, openaiConfigured } from './openai';
import { searchTavily, tavilyConfigured, toTrendInput } from './tavily';
import { TOPIC_PILLARS } from './topics';
import { parseArticleContent } from './validate';

export { editorialCronEnabled } from './config';

export type PipelineResult = {
  ok: boolean;
  skipped?: boolean;
  error?: string;
  trendsCreated: number;
  draftsCreated: number;
  runId: string;
  costUsd: number;
  reason?: string;
};

export type EditorialScheduleStatus = {
  cronEnabled: boolean;
  intervalHours: number;
  lastCronAt: Date | null;
  nextCronAt: Date | null;
  due: boolean;
  spentTodayUsd: number;
  dailyBudgetUsd: number;
  openDrafts: number;
  unusedTrends: number;
  tavilyReady: boolean;
  openaiReady: boolean;
  model: string;
  topicsPerRun: number;
  queriesPerTopic: number;
  tavilyDepth: string;
  maxDraftsPerRun: number;
  maxOpenDrafts: number;
};

async function finishRun(
  id: string,
  data: {
    status: 'SUCCESS' | 'FAILED' | 'SKIPPED';
    error?: string;
    costUsd?: number;
    tokensIn?: number;
    tokensOut?: number;
    meta?: Prisma.InputJsonValue;
  }
) {
  await getPrisma().editorialRun.update({
    where: { id },
    data: {
      status: data.status,
      error: data.error,
      costUsd: data.costUsd,
      tokensIn: data.tokensIn,
      tokensOut: data.tokensOut,
      meta: data.meta,
      finishedAt: new Date(),
    },
  });
}

async function spentTodayUsd(): Promise<number> {
  const sum = await getPrisma().editorialRun.aggregate({
    where: { startedAt: { gte: startOfUtcDay() } },
    _sum: { costUsd: true },
  });
  return Number(sum._sum.costUsd ?? 0);
}

export async function getEditorialScheduleStatus(): Promise<EditorialScheduleStatus> {
  const cfg = editorialConfig();
  const empty: EditorialScheduleStatus = {
    cronEnabled: cfg.cronEnabled,
    intervalHours: cfg.intervalHours,
    lastCronAt: null,
    nextCronAt: cfg.cronEnabled ? new Date() : null,
    due: cfg.cronEnabled,
    spentTodayUsd: 0,
    dailyBudgetUsd: cfg.dailyBudgetUsd,
    openDrafts: 0,
    unusedTrends: 0,
    tavilyReady: tavilyConfigured(),
    openaiReady: openaiConfigured(),
    model: cfg.model,
    topicsPerRun: cfg.topicsPerRun,
    queriesPerTopic: cfg.queriesPerTopic,
    tavilyDepth: cfg.tavilyDepth,
    maxDraftsPerRun: cfg.maxDraftsPerRun,
    maxOpenDrafts: cfg.maxOpenDrafts,
  };
  if (!isDatabaseConfigured()) return empty;

  const prisma = getPrisma();
  const lastCron = await prisma.editorialRun.findFirst({
    where: { triggeredBy: 'cron' },
    orderBy: { startedAt: 'desc' },
  });
  const [openDrafts, unusedTrends, spent] = await Promise.all([
    prisma.article.count({ where: { status: { in: ['DRAFT', 'IN_REVIEW'] } } }),
    prisma.trendCandidate.count({ where: { status: 'NEW' } }),
    spentTodayUsd(),
  ]);
  const due = Boolean(
    cfg.cronEnabled &&
    (!lastCron || !isWithinInterval(lastCron.startedAt, new Date(), cfg.intervalHours))
  );
  return {
    ...empty,
    lastCronAt: lastCron?.startedAt ?? null,
    nextCronAt: cfg.cronEnabled ? nextRunAt(lastCron?.startedAt ?? null, cfg.intervalHours) : null,
    due,
    spentTodayUsd: spent,
    openDrafts,
    unusedTrends,
  };
}

export async function maybeRunEditorialFromOpsCron(): Promise<{
  ran: boolean;
  reason: string;
  result?: PipelineResult;
}> {
  const cfg = editorialConfig();
  if (!cfg.cronEnabled) return { ran: false, reason: 'disabled' };
  if (!isDatabaseConfigured()) return { ran: false, reason: 'no-db' };
  if (!tavilyConfigured() || !openaiConfigured()) {
    console.log('[editorial skip] cron: mancano TAVILY_API_KEY o OPENAI_API_KEY');
    return { ran: false, reason: 'missing-keys' };
  }

  const lastCron = await getPrisma().editorialRun.findFirst({
    where: { triggeredBy: 'cron' },
    orderBy: { startedAt: 'desc' },
  });
  if (lastCron && isWithinInterval(lastCron.startedAt, new Date(), cfg.intervalHours)) {
    return { ran: false, reason: 'interval' };
  }

  const result = await runEditorialPipeline({ triggeredBy: 'cron', generateDrafts: true });
  return { ran: true, reason: result.skipped ? 'skipped' : result.ok ? 'ran' : 'failed', result };
}

export async function runEditorialPipeline(options: {
  triggeredBy: 'cron' | 'admin';
  generateDrafts?: boolean;
}): Promise<PipelineResult> {
  const prisma = getPrisma();
  const cfg = editorialConfig();
  const generateDrafts = options.generateDrafts ?? true;
  const run = await prisma.editorialRun.create({
    data: {
      kind: generateDrafts ? 'DRAFT_GENERATE' : 'TREND_SCAN',
      status: 'RUNNING',
      triggeredBy: options.triggeredBy,
    },
  });

  if (options.triggeredBy === 'cron' && !editorialCronEnabled()) {
    await logRun(run.id, 'skip', 'cron', 'EDITORIAL_CRON_ENABLED≠true');
    await finishRun(run.id, {
      status: 'SKIPPED',
      meta: { reason: 'EDITORIAL_CRON_ENABLED is not true' },
    });
    return {
      ok: true,
      skipped: true,
      reason: 'cron-disabled',
      trendsCreated: 0,
      draftsCreated: 0,
      runId: run.id,
      costUsd: 0,
    };
  }

  try {
    let trendsCreated = 0;
    let draftsCreated = 0;
    let tokensIn = 0;
    let tokensOut = 0;
    let costUsd = 0;
    let tavilyCredits = 0;
    const createdTrendIds: string[] = [];

    const [openDrafts, unusedTrends, spent] = await Promise.all([
      prisma.article.count({ where: { status: { in: ['DRAFT', 'IN_REVIEW'] } } }),
      prisma.trendCandidate.count({ where: { status: 'NEW' } }),
      spentTodayUsd(),
    ]);
    const remaining = budgetRemaining(spent, cfg.dailyBudgetUsd);

    await logRun(run.id, 'info', 'start', 'Pipeline avviata in modalità low-credit', {
      triggeredBy: options.triggeredBy,
      generateDrafts,
      model: cfg.model,
      tavilyDepth: cfg.tavilyDepth,
      topicsPerRun: cfg.topicsPerRun,
      queriesPerTopic: cfg.queriesPerTopic,
      maxDraftsPerRun: cfg.maxDraftsPerRun,
      openDrafts,
      unusedTrends,
      spentTodayUsd: Number(spent.toFixed(4)),
      dailyBudgetUsd: cfg.dailyBudgetUsd,
      remainingUsd: Number((remaining === Infinity ? 0 : remaining).toFixed(4)),
    });

    if (options.triggeredBy === 'cron' && openDrafts >= cfg.maxOpenDrafts) {
      await logRun(
        run.id,
        'skip',
        'queue',
        `Bozze aperte ${openDrafts} ≥ ${cfg.maxOpenDrafts}: zero chiamate API, pubblica o archivia prima.`,
        { openDrafts }
      );
      await finishRun(run.id, {
        status: 'SKIPPED',
        meta: { reason: 'open-drafts', openDrafts },
      });
      return {
        ok: true,
        skipped: true,
        reason: 'open-drafts',
        trendsCreated: 0,
        draftsCreated: 0,
        runId: run.id,
        costUsd: 0,
      };
    }

    if (remaining !== Infinity && remaining <= 0) {
      await logRun(
        run.id,
        'skip',
        'budget',
        `Budget giornaliero $${cfg.dailyBudgetUsd} esaurito (speso $${spent.toFixed(4)}).`,
        { spentTodayUsd: spent, dailyBudgetUsd: cfg.dailyBudgetUsd }
      );
      await finishRun(run.id, {
        status: 'SKIPPED',
        costUsd: 0,
        meta: { reason: 'budget', spentTodayUsd: spent },
      });
      return {
        ok: true,
        skipped: true,
        reason: 'budget',
        trendsCreated: 0,
        draftsCreated: 0,
        runId: run.id,
        costUsd: 0,
      };
    }

    const doTavily = unusedTrends === 0;
    if (!doTavily) {
      await logRun(
        run.id,
        'skip',
        'tavily',
        `Trend NEW già in coda (${unusedTrends}): niente ricerca Tavily.`,
        { unusedTrends }
      );
    } else {
      if (!tavilyConfigured()) {
        await logRun(run.id, 'error', 'tavily', 'TAVILY_API_KEY mancante');
        await finishRun(run.id, { status: 'FAILED', error: 'TAVILY_API_KEY mancante' });
        return {
          ok: false,
          error: 'TAVILY_API_KEY mancante',
          trendsCreated: 0,
          draftsCreated: 0,
          runId: run.id,
          costUsd: 0,
        };
      }

      const cronCount = await prisma.editorialRun.count({
        where: { triggeredBy: options.triggeredBy, status: { in: ['SUCCESS', 'SKIPPED'] } },
      });
      const startIndex = rotateStartIndex(cronCount, TOPIC_PILLARS.length);
      const pillars = selectRotated(TOPIC_PILLARS, startIndex, cfg.topicsPerRun);
      await logRun(
        run.id,
        'info',
        'rotate',
        `Topic di questo run: ${pillars.map(item => item.id).join(', ')}`,
        { startIndex, topics: pillars.map(item => item.id) }
      );

      for (const pillar of pillars) {
        const existing = await prisma.trendCandidate.findMany({
          where: { topic: pillar.id },
          select: { title: true, fingerprint: true },
        });
        const titles = existing.map(item => item.title);
        const fingerprints = new Set(existing.map(item => item.fingerprint));
        const queries = pillar.searchQueries.slice(0, cfg.queriesPerTopic);

        for (const query of queries) {
          const callCost = tavilyCallCost(cfg.tavilyDepth);
          if (remaining !== Infinity && costUsd + callCost.costUsd > remaining) {
            await logRun(run.id, 'skip', 'tavily', 'Stop Tavily: supererebbe il budget di oggi.', {
              query,
              remainingUsd: remaining,
              nextCallUsd: callCost.costUsd,
            });
            break;
          }
          await logRun(run.id, 'info', 'tavily', `Search «${query}»`, {
            topic: pillar.id,
            depth: cfg.tavilyDepth,
            maxResults: cfg.tavilyMaxResults,
            credits: callCost.credits,
            costUsd: callCost.costUsd,
          });
          const hits = await searchTavily(query, {
            depth: cfg.tavilyDepth,
            maxResults: cfg.tavilyMaxResults,
          });
          tavilyCredits += callCost.credits;
          costUsd += callCost.costUsd;
          await logRun(
            run.id,
            'cost',
            'tavily',
            `${hits.length} hit, +${callCost.credits} credit`,
            {
              topic: pillar.id,
              hits: hits.map(hit => ({ title: hit.title, url: hit.url, score: hit.score })),
            }
          );

          for (const hit of hits) {
            const input = toTrendInput(hit, pillar.id, titles);
            if (!input) continue;
            if (fingerprints.has(input.fingerprint)) {
              await logRun(run.id, 'skip', 'dedupe', `URL già visto: ${input.url}`);
              continue;
            }
            fingerprints.add(input.fingerprint);
            titles.push(input.title);
            const trend = await prisma.trendCandidate.create({
              data: {
                fingerprint: input.fingerprint,
                title: input.title,
                url: input.url,
                excerpt: input.excerpt,
                topic: input.topic,
                score: input.score,
                publishedAt: input.publishedAt,
                raw: input.raw as Prisma.InputJsonValue,
                sources: {
                  create: {
                    url: input.url,
                    title: input.title,
                    excerpt: input.excerpt,
                    domain: domainFromUrl(input.url),
                    publishedAt: input.publishedAt,
                  },
                },
              },
            });
            createdTrendIds.push(trend.id);
            trendsCreated += 1;
            await logRun(run.id, 'info', 'trend', `Nuovo trend: ${trend.title}`, {
              id: trend.id,
              topic: trend.topic,
              score: trend.score,
              url: trend.url,
            });
          }
        }
      }
    }

    const wantDraft =
      generateDrafts && draftsCreated < cfg.maxDraftsPerRun && openDrafts < cfg.maxOpenDrafts;

    if (!generateDrafts) {
      await logRun(run.id, 'skip', 'openai', 'Richiesto solo scan trend, nessuna bozza.');
    } else if (openDrafts >= cfg.maxOpenDrafts) {
      await logRun(
        run.id,
        'skip',
        'openai',
        `Bozze aperte ${openDrafts} ≥ ${cfg.maxOpenDrafts}: niente OpenAI.`
      );
    } else if (remaining !== Infinity && remaining - costUsd < 0.01) {
      await logRun(run.id, 'skip', 'openai', 'Budget residuo troppo basso per una bozza.', {
        remainingUsd: Number((remaining - costUsd).toFixed(4)),
      });
    } else if (wantDraft) {
      if (!openaiConfigured()) {
        throw new Error('OPENAI_API_KEY mancante');
      }
      const unused = await prisma.trendCandidate.findMany({
        where: { status: 'NEW' },
        include: { sources: true },
        orderBy: { score: 'desc' },
        take: cfg.maxDraftsPerRun,
      });
      if (!unused.length) {
        await logRun(run.id, 'skip', 'openai', 'Nessun trend NEW: niente bozza.');
      }

      for (const trend of unused) {
        await logRun(run.id, 'info', 'openai', `Genero bozza da «${trend.title}»`, {
          model: cfg.model,
          topic: trend.topic,
          trendId: trend.id,
          sources: trend.sources.length,
        });
        const { draft, usage } = await generateArticleDraft({
          topic: trend.topic,
          trendTitle: trend.title,
          trendUrl: trend.url,
          trendExcerpt: trend.excerpt,
          sources: trend.sources.map(source => ({
            title: source.title,
            url: source.url,
            content: source.excerpt ?? '',
            score: trend.score,
          })),
        });
        tokensIn += usage.tokensIn;
        tokensOut += usage.tokensOut;
        costUsd += usage.costUsd;
        parseArticleContent(draft.content);
        await logRun(
          run.id,
          'cost',
          'openai',
          `Bozza OK · ${usage.tokensIn}+${usage.tokensOut} tok`,
          {
            costUsd: Number(usage.costUsd.toFixed(4)),
            tokensIn: usage.tokensIn,
            tokensOut: usage.tokensOut,
            title: draft.title,
            slug: draft.slug,
          }
        );

        let slug = draft.slug;
        const clash = await prisma.article.findUnique({ where: { slug } });
        if (clash) slug = `${slug}-${Date.now().toString(36)}`;

        const article = await prisma.article.create({
          data: {
            slug,
            title: draft.title,
            excerpt: draft.excerpt,
            category: draft.category,
            topic: draft.topic,
            status: 'DRAFT',
            angle: draft.angle,
            abstract: draft.abstract,
            seoTitle: draft.seoTitle,
            seoDescription: draft.seoDescription,
            coverImage: draft.coverImage ?? coverForTopic(draft.topic),
            coverAlt: draft.coverAlt ?? draft.title,
            readTime: draft.readTime,
            ctaVariant: draft.ctaVariant,
            caseStudySlugs: draft.caseStudySlugs,
            visualHints: draft.visualHints as Prisma.InputJsonValue,
            content: draft.content as unknown as Prisma.InputJsonValue,
            generatedByAi: true,
            trendId: trend.id,
            sources: {
              create: draft.sources.map(source => ({
                url: source.url,
                title: source.title,
                domain: domainFromUrl(source.url),
              })),
            },
          },
        });
        await prisma.articleRevision.create({
          data: {
            articleId: article.id,
            snapshot: articleSnapshot(article) as Prisma.InputJsonValue,
            note: `Bozza AI da trend: ${trend.title}`,
          },
        });
        await prisma.trendCandidate.update({
          where: { id: trend.id },
          data: { status: 'USED' },
        });
        draftsCreated += 1;
        await logRun(run.id, 'info', 'draft', `Salvata bozza ${article.slug} (mai pubblicata)`, {
          articleId: article.id,
          slug: article.slug,
        });
      }
    }

    await logRun(run.id, 'info', 'done', 'Run completato', {
      trendsCreated,
      draftsCreated,
      tavilyCredits,
      tokensIn,
      tokensOut,
      costUsd: Number(costUsd.toFixed(4)),
    });
    await finishRun(run.id, {
      status: 'SUCCESS',
      costUsd,
      tokensIn,
      tokensOut,
      meta: { trendsCreated, draftsCreated, createdTrendIds, tavilyCredits },
    });
    return { ok: true, trendsCreated, draftsCreated, runId: run.id, costUsd };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Errore pipeline';
    await logRun(run.id, 'error', 'fail', message);
    await finishRun(run.id, { status: 'FAILED', error: message });
    return {
      ok: false,
      error: message,
      trendsCreated: 0,
      draftsCreated: 0,
      runId: run.id,
      costUsd: 0,
    };
  }
}

function coverForTopic(topic: string): string {
  if (topic === 'nfc') return '/editorial/nfc-restaurant.png';
  if (topic === 'crm' || topic === 'gestionali' || topic === 'field')
    return '/editorial/digital-process.png';
  if (topic === 'ecommerce') return '/editorial/ecommerce.png';
  return '/editorial/web-offer.png';
}
