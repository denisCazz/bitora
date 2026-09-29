export const TAVILY_USD = {
  basic: 0.008,
  advanced: 0.016,
} as const;

export type TavilyDepth = 'basic' | 'advanced';

export function isWithinInterval(lastStartedAt: Date, now: Date, hours: number): boolean {
  if (hours <= 0) return false;
  return now.getTime() - lastStartedAt.getTime() < hours * 3_600_000;
}

export function nextRunAt(lastStartedAt: Date | null, hours: number, now = new Date()): Date {
  if (!lastStartedAt) return now;
  return new Date(lastStartedAt.getTime() + hours * 3_600_000);
}

export function rotateStartIndex(completedRuns: number, pillarCount: number): number {
  if (pillarCount <= 0) return 0;
  return ((completedRuns % pillarCount) + pillarCount) % pillarCount;
}

export function selectRotated<T>(items: T[], startIndex: number, count: number): T[] {
  if (!items.length || count <= 0) return [];
  const out: T[] = [];
  const n = Math.min(count, items.length);
  for (let i = 0; i < n; i += 1) {
    out.push(items[(startIndex + i) % items.length]);
  }
  return out;
}

export function budgetRemaining(spentUsd: number, capUsd: number): number {
  if (capUsd < 0) return Number.POSITIVE_INFINITY;
  return Math.max(0, capUsd - spentUsd);
}

export function tavilyCallCost(depth: TavilyDepth): { credits: number; costUsd: number } {
  if (depth === 'advanced') return { credits: 2, costUsd: TAVILY_USD.advanced };
  return { credits: 1, costUsd: TAVILY_USD.basic };
}

export function startOfUtcDay(now = new Date()): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}
