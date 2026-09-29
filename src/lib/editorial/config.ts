import { env, envNumber } from '../ops/env';
import type { TavilyDepth } from './budget';

export type EditorialConfig = {
  cronEnabled: boolean;
  intervalHours: number;
  topicsPerRun: number;
  queriesPerTopic: number;
  tavilyDepth: TavilyDepth;
  tavilyMaxResults: number;
  maxDraftsPerRun: number;
  maxOpenDrafts: number;
  dailyBudgetUsd: number;
  model: string;
};

export function editorialConfig(): EditorialConfig {
  const depthRaw = env('EDITORIAL_TAVILY_DEPTH').toLowerCase();
  return {
    cronEnabled: env('EDITORIAL_CRON_ENABLED') === 'true',
    intervalHours: Math.max(1, envNumber('EDITORIAL_CRON_INTERVAL_HOURS', 48)),
    topicsPerRun: Math.max(1, envNumber('EDITORIAL_TOPICS_PER_RUN', 1)),
    queriesPerTopic: Math.max(1, envNumber('EDITORIAL_QUERIES_PER_TOPIC', 1)),
    tavilyDepth: depthRaw === 'advanced' ? 'advanced' : 'basic',
    tavilyMaxResults: Math.max(1, envNumber('EDITORIAL_TAVILY_MAX_RESULTS', 3)),
    maxDraftsPerRun: Math.max(0, envNumber('EDITORIAL_MAX_DRAFTS_PER_RUN', 1)),
    maxOpenDrafts: Math.max(1, envNumber('EDITORIAL_MAX_OPEN_DRAFTS', 1)),
    dailyBudgetUsd: envNumber('EDITORIAL_DAILY_BUDGET_USD', 0.4),
    model: env('OPENAI_MODEL') || 'gpt-4.1-mini',
  };
}

export function editorialCronEnabled(): boolean {
  return editorialConfig().cronEnabled;
}
