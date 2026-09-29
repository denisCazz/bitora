import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { env } from './ops/env';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export function databaseUrl(): string {
  return env('DATABASE_URL');
}

export function isDatabaseConfigured(): boolean {
  return Boolean(databaseUrl());
}

function createPrismaClient(): PrismaClient {
  const url = databaseUrl();
  if (!url) {
    throw new Error('DATABASE_URL mancante');
  }
  const adapter = new PrismaPg({ connectionString: url });
  return new PrismaClient({ adapter });
}

export function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

export async function withPrisma<T>(fn: (prisma: PrismaClient) => Promise<T>): Promise<T | null> {
  if (!isDatabaseConfigured()) return null;
  try {
    return await fn(getPrisma());
  } catch (error) {
    console.error('Prisma error', error);
    return null;
  }
}
