import type { ArticleStatus } from './types';

const ALLOWED: Record<ArticleStatus, ArticleStatus[]> = {
  DRAFT: ['IN_REVIEW', 'PUBLISHED', 'ARCHIVED'],
  IN_REVIEW: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
  PUBLISHED: ['ARCHIVED', 'DRAFT'],
  ARCHIVED: ['DRAFT'],
};

export function canTransition(from: ArticleStatus, to: ArticleStatus): boolean {
  if (from === to) return true;
  return ALLOWED[from].includes(to);
}

export function assertTransition(from: ArticleStatus, to: ArticleStatus): void {
  if (!canTransition(from, to)) {
    throw new Error(`Transizione non consentita: ${from} → ${to}`);
  }
}

export function isPublicStatus(status: ArticleStatus): boolean {
  return status === 'PUBLISHED';
}
