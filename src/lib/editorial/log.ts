import type { Prisma } from '../../../generated/prisma/client';
import { getPrisma } from '../db';

export type EditorialLogLevel = 'info' | 'warn' | 'error' | 'skip' | 'cost';

export async function logRun(
  runId: string,
  level: EditorialLogLevel,
  step: string,
  message: string,
  data?: Prisma.InputJsonValue
): Promise<void> {
  const suffix = data ? ` ${safePreview(data)}` : '';
  console.log(`[editorial ${level}] ${step}: ${message}${suffix}`);
  await getPrisma().editorialRunEvent.create({
    data: {
      runId,
      level,
      step,
      message,
      data: data ?? undefined,
    },
  });
}

function safePreview(data: Prisma.InputJsonValue): string {
  try {
    return JSON.stringify(data).slice(0, 280);
  } catch {
    return '';
  }
}
