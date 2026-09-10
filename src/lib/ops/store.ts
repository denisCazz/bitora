import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { opsStatePath } from './env';

export interface SiteCheckResult {
  id: string;
  name: string;
  url: string;
  group: string;
  ok: boolean;
  statusCode: number | null;
  latencyMs: number | null;
  error?: string;
  checkedAt: number;
}

export interface VpsMetrics {
  source: 'runtime' | 'agent';
  hostname: string;
  load1: number;
  load5: number;
  load15: number;
  cpuCount: number;
  memUsedBytes: number;
  memTotalBytes: number;
  diskUsedBytes?: number;
  diskTotalBytes?: number;
  swapUsedBytes?: number;
  swapTotalBytes?: number;
  uptimeSec: number;
  receivedAt: number;
}

export interface OpsState {
  sites: Record<string, SiteCheckResult>;
  runtime?: VpsMetrics;
  agent?: VpsMetrics;
  lastCronAt?: number;
  lastManualCheckAt?: number;
  lastAlertAt: Record<string, number>;
  lastDigestAt?: number;
}

const EMPTY_STATE: OpsState = { sites: {}, lastAlertAt: {} };

let memory: OpsState | null = null;

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function readFromDisk(): OpsState {
  try {
    const raw = readFileSync(opsStatePath(), 'utf8');
    const parsed = JSON.parse(raw) as Partial<OpsState>;
    return {
      sites: parsed.sites ?? {},
      runtime: parsed.runtime,
      agent: parsed.agent,
      lastCronAt: parsed.lastCronAt,
      lastManualCheckAt: parsed.lastManualCheckAt,
      lastAlertAt: parsed.lastAlertAt ?? {},
      lastDigestAt: parsed.lastDigestAt,
    };
  } catch {
    return clone(EMPTY_STATE);
  }
}

function persist(state: OpsState): void {
  const path = opsStatePath();
  try {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, JSON.stringify(state), 'utf8');
  } catch (err) {
    console.error('[ops] impossibile salvare lo stato:', err);
  }
}

export function getOpsState(): OpsState {
  if (!memory) memory = readFromDisk();
  return clone(memory);
}

export function updateOpsState(mutator: (state: OpsState) => void): OpsState {
  const state = getOpsState();
  mutator(state);
  memory = clone(state);
  persist(memory);
  return clone(memory);
}
