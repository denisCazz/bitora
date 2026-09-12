import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
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

export interface HistoryPoint {
  at: number;
  sites: Record<string, { ok: boolean; latencyMs: number | null }>;
  host?: {
    memPct: number | null;
    diskPct: number | null;
    loadRatio: number;
  };
}

export interface OpsIncident {
  id: string;
  resourceId: string;
  resourceType: 'site' | 'vps' | 'watchdog';
  title: string;
  detail: string;
  severity: 'warn' | 'critical';
  openedAt: number;
  resolvedAt?: number;
  acknowledgedAt?: number;
  note?: string;
}

export interface MaintenanceWindow {
  resourceId: string;
  until: number;
  reason?: string;
  createdAt: number;
}

export interface CertificateCheck {
  targetId: string;
  hostname: string;
  checkedAt: number;
  validTo?: number;
  daysRemaining?: number;
  issuer?: string;
  error?: string;
}

export interface DomainCheck {
  domain: string;
  checkedAt: number;
  expiresAt?: number;
  daysRemaining?: number;
  registrar?: string;
  error?: string;
}

export interface BackupReport {
  id: string;
  name: string;
  path?: string;
  ok: boolean;
  lastBackupAt?: number;
  sizeBytes?: number;
  restoreVerifiedAt?: number;
  detail?: string;
  receivedAt: number;
}

export interface ServiceReport {
  id: string;
  name: string;
  status: string;
  image?: string;
  createdAt?: number;
  restartCount?: number;
  receivedAt: number;
}

export interface OpsState {
  sites: Record<string, SiteCheckResult>;
  runtime?: VpsMetrics;
  agent?: VpsMetrics;
  lastCronAt?: number;
  lastManualCheckAt?: number;
  lastWatchdogAlertAt?: number;
  lastAlertAt: Record<string, number>;
  lastDigestAt?: number;
  history: HistoryPoint[];
  incidents: OpsIncident[];
  maintenance: Record<string, MaintenanceWindow>;
  certificates: Record<string, CertificateCheck>;
  domains: Record<string, DomainCheck>;
  backups: Record<string, BackupReport>;
  services: Record<string, ServiceReport>;
}

const EMPTY_STATE: OpsState = {
  sites: {},
  lastAlertAt: {},
  history: [],
  incidents: [],
  maintenance: {},
  certificates: {},
  domains: {},
  backups: {},
  services: {},
};

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
      lastWatchdogAlertAt: parsed.lastWatchdogAlertAt,
      lastAlertAt: parsed.lastAlertAt ?? {},
      lastDigestAt: parsed.lastDigestAt,
      history: parsed.history ?? [],
      incidents: parsed.incidents ?? [],
      maintenance: parsed.maintenance ?? {},
      certificates: parsed.certificates ?? {},
      domains: parsed.domains ?? {},
      backups: parsed.backups ?? {},
      services: parsed.services ?? {},
    };
  } catch {
    return clone(EMPTY_STATE);
  }
}

function persist(state: OpsState): void {
  const path = opsStatePath();
  try {
    mkdirSync(dirname(path), { recursive: true });
    const temporary = `${path}.${process.pid}.tmp`;
    writeFileSync(temporary, JSON.stringify(state), 'utf8');
    renameSync(temporary, path);
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
