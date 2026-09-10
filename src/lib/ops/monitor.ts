import os from 'node:os';
import { statfsSync } from 'node:fs';
import { DEFAULT_OK_STATUSES, monitoredSites } from '../../data/monitoredTargets';
import { AGENT_STALE_MS, SITE_TIMEOUT_MS, VPS_DISK_WARN, VPS_LOAD_WARN, VPS_MEM_WARN } from './env';
import { formatPercent } from './format';
import { getOpsState, updateOpsState, type SiteCheckResult, type VpsMetrics } from './store';

export interface VpsIssue {
  id: string;
  severity: 'warn' | 'critical';
  label: string;
  detail: string;
}

export interface MonitorRun {
  sites: SiteCheckResult[];
  runtime: VpsMetrics;
  agent?: VpsMetrics;
  agentStale: boolean;
  vpsIssues: VpsIssue[];
  downCount: number;
  upCount: number;
  checkedAt: number;
}

function collectRuntimeMetrics(): VpsMetrics {
  const total = os.totalmem();
  const free = os.freemem();
  const load = os.loadavg();
  const metrics: VpsMetrics = {
    source: 'runtime',
    hostname: os.hostname(),
    load1: load[0] ?? 0,
    load5: load[1] ?? 0,
    load15: load[2] ?? 0,
    cpuCount: Math.max(1, os.cpus().length),
    memUsedBytes: Math.max(0, total - free),
    memTotalBytes: total,
    swapUsedBytes: undefined,
    swapTotalBytes: undefined,
    uptimeSec: os.uptime(),
    receivedAt: Date.now(),
  };

  try {
    const fs = statfsSync('/');
    const totalBytes = Number(fs.blocks) * Number(fs.bsize);
    const freeBytes = Number(fs.bavail) * Number(fs.bsize);
    metrics.diskTotalBytes = diskSafe(totalBytes);
    metrics.diskUsedBytes = totalBytes > 0 ? Math.max(0, totalBytes - freeBytes) : undefined;
  } catch {
    // container filesystem may be unavailable
  }

  return metrics;
}

function diskSafe(n: number): number | undefined {
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

async function checkSite(id: string): Promise<SiteCheckResult> {
  const site = monitoredSites.find(s => s.id === id);
  if (!site) {
    return {
      id,
      name: id,
      url: '',
      group: '',
      ok: false,
      statusCode: null,
      latencyMs: null,
      error: 'Target sconosciuto',
      checkedAt: Date.now(),
    };
  }

  const okStatuses = site.okStatuses ?? DEFAULT_OK_STATUSES;
  const started = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SITE_TIMEOUT_MS());

  try {
    const response = await fetch(site.url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'BitoraOpsMonitor/1.0 (+https://bitora.it)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    const latencyMs = Date.now() - started;
    const ok = okStatuses.includes(response.status);
    return {
      id: site.id,
      name: site.name,
      url: site.url,
      group: site.group,
      ok,
      statusCode: response.status,
      latencyMs,
      error: ok ? undefined : `HTTP ${response.status}`,
      checkedAt: Date.now(),
    };
  } catch (err) {
    const latencyMs = Date.now() - started;
    const aborted = err instanceof Error && err.name === 'AbortError';
    return {
      id: site.id,
      name: site.name,
      url: site.url,
      group: site.group,
      ok: false,
      statusCode: null,
      latencyMs,
      error: aborted
        ? `Timeout ${SITE_TIMEOUT_MS() / 1000}s`
        : err instanceof Error
          ? err.message
          : 'Errore di rete',
      checkedAt: Date.now(),
    };
  } finally {
    clearTimeout(timeout);
  }
}

export function evaluateVps(metrics: VpsMetrics, sourceLabel: string): VpsIssue[] {
  const issues: VpsIssue[] = [];
  const memPct = formatPercent(metrics.memUsedBytes, metrics.memTotalBytes);
  const diskPct = formatPercent(metrics.diskUsedBytes, metrics.diskTotalBytes);
  const loadRatio = metrics.cpuCount > 0 ? metrics.load1 / metrics.cpuCount : metrics.load1;
  const memWarn = VPS_MEM_WARN();
  const diskWarn = VPS_DISK_WARN();
  const loadWarn = VPS_LOAD_WARN();

  if (memPct != null && !(metrics.source === 'runtime' && process.platform === 'darwin')) {
    if (memPct >= memWarn + 5) {
      issues.push({
        id: `${metrics.source}-mem`,
        severity: 'critical',
        label: `RAM ${sourceLabel}`,
        detail: `${memPct.toFixed(0)}% usata (soglia ${memWarn}%)`,
      });
    } else if (memPct >= memWarn) {
      issues.push({
        id: `${metrics.source}-mem`,
        severity: 'warn',
        label: `RAM ${sourceLabel}`,
        detail: `${memPct.toFixed(0)}% usata (soglia ${memWarn}%)`,
      });
    }
  }

  if (diskPct != null) {
    if (diskPct >= diskWarn + 8) {
      issues.push({
        id: `${metrics.source}-disk`,
        severity: 'critical',
        label: `Disco ${sourceLabel}`,
        detail: `${diskPct.toFixed(0)}% usato (soglia ${diskWarn}%)`,
      });
    } else if (diskPct >= diskWarn) {
      issues.push({
        id: `${metrics.source}-disk`,
        severity: 'warn',
        label: `Disco ${sourceLabel}`,
        detail: `${diskPct.toFixed(0)}% usato (soglia ${diskWarn}%)`,
      });
    }
  }

  if (loadRatio >= loadWarn * 1.5) {
    issues.push({
      id: `${metrics.source}-load`,
      severity: 'critical',
      label: `Load ${sourceLabel}`,
      detail: `load1 ${metrics.load1.toFixed(2)} su ${metrics.cpuCount} CPU (soglia ${loadWarn})`,
    });
  } else if (loadRatio >= loadWarn) {
    issues.push({
      id: `${metrics.source}-load`,
      severity: 'warn',
      label: `Load ${sourceLabel}`,
      detail: `load1 ${metrics.load1.toFixed(2)} su ${metrics.cpuCount} CPU (soglia ${loadWarn})`,
    });
  }

  return issues;
}

export async function runMonitor(kind: 'cron' | 'manual' = 'manual'): Promise<MonitorRun> {
  const checkedAt = Date.now();
  const results = await Promise.all(monitoredSites.map(site => checkSite(site.id)));
  const runtime = collectRuntimeMetrics();
  const previous = getOpsState();
  const agent = previous.agent;
  const agentStale = Boolean(agent && checkedAt - agent.receivedAt > AGENT_STALE_MS());

  const vpsIssues = [
    ...evaluateVps(runtime, 'container'),
    ...(agent && !agentStale ? evaluateVps(agent, 'VPS') : []),
  ];

  if (agent && agentStale) {
    vpsIssues.push({
      id: 'agent-stale',
      severity: 'warn',
      label: 'Agent VPS',
      detail: 'Nessun dato host da più di 20 minuti',
    });
  }

  const sitesMap: Record<string, SiteCheckResult> = {};
  for (const result of results) sitesMap[result.id] = result;

  updateOpsState(state => {
    state.sites = sitesMap;
    state.runtime = runtime;
    if (kind === 'cron') state.lastCronAt = checkedAt;
    if (kind === 'manual') state.lastManualCheckAt = checkedAt;
  });

  return {
    sites: results,
    runtime,
    agent,
    agentStale,
    vpsIssues,
    downCount: results.filter(s => !s.ok).length,
    upCount: results.filter(s => s.ok).length,
    checkedAt,
  };
}

export function ingestAgentMetrics(payload: Record<string, unknown>): VpsMetrics {
  const num = (key: string): number | undefined => {
    const v = payload[key];
    return typeof v === 'number' && Number.isFinite(v) ? v : undefined;
  };

  const metrics: VpsMetrics = {
    source: 'agent',
    hostname:
      typeof payload.hostname === 'string' && payload.hostname.trim() ? payload.hostname : 'vps',
    load1: num('load1') ?? 0,
    load5: num('load5') ?? 0,
    load15: num('load15') ?? 0,
    cpuCount: Math.max(1, Math.round(num('cpuCount') ?? 1)),
    memUsedBytes: num('memUsedBytes') ?? 0,
    memTotalBytes: num('memTotalBytes') ?? 0,
    diskUsedBytes: num('diskUsedBytes'),
    diskTotalBytes: num('diskTotalBytes'),
    swapUsedBytes: num('swapUsedBytes'),
    swapTotalBytes: num('swapTotalBytes'),
    uptimeSec: num('uptimeSec') ?? 0,
    receivedAt: Date.now(),
  };

  updateOpsState(state => {
    state.agent = metrics;
  });

  return metrics;
}

export function currentSnapshot(): MonitorRun {
  const state = getOpsState();
  const sites = Object.values(state.sites);
  const runtime = state.runtime ?? collectRuntimeMetrics();
  const agent = state.agent;
  const agentStale = Boolean(agent && Date.now() - agent.receivedAt > AGENT_STALE_MS());
  const vpsIssues = [
    ...evaluateVps(runtime, 'container'),
    ...(agent && !agentStale ? evaluateVps(agent, 'VPS') : []),
  ];
  if (agent && agentStale) {
    vpsIssues.push({
      id: 'agent-stale',
      severity: 'warn',
      label: 'Agent VPS',
      detail: 'Nessun dato host da più di 20 minuti',
    });
  }

  return {
    sites,
    runtime,
    agent,
    agentStale,
    vpsIssues,
    downCount: sites.filter(s => !s.ok).length,
    upCount: sites.filter(s => s.ok).length,
    checkedAt: state.lastCronAt ?? state.lastManualCheckAt ?? 0,
  };
}
