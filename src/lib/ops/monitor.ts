import os from 'node:os';
import { statfsSync } from 'node:fs';
import { DEFAULT_OK_STATUSES, monitoredSites } from '../../data/monitoredTargets';
import { AGENT_STALE_MS, SITE_TIMEOUT_MS, VPS_DISK_WARN, VPS_LOAD_WARN, VPS_MEM_WARN } from './env';
import { formatPercent } from './format';
import { refreshInfrastructure } from './infrastructure';
import {
  getOpsState,
  updateOpsState,
  type BackupReport,
  type OpsIncident,
  type OpsState,
  type ServiceReport,
  type SiteCheckResult,
  type VpsMetrics,
} from './store';

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
  previousState: OpsState;
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
    let ok = okStatuses.includes(response.status);
    let error = ok ? undefined : `HTTP ${response.status}`;
    if (ok && site.expectedText) {
      const body = await response.text();
      if (!body.toLocaleLowerCase().includes(site.expectedText.toLocaleLowerCase())) {
        ok = false;
        error = `Testo atteso assente: ${site.expectedText}`;
      }
    }
    if (ok && site.healthUrl) {
      const health = await fetch(site.healthUrl, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
        headers: {
          'User-Agent': 'BitoraOpsMonitor/1.0 (+https://bitora.it)',
          Accept: 'application/json,*/*;q=0.8',
        },
      });
      const healthStatuses = site.healthStatuses ?? [200, 204];
      if (!healthStatuses.includes(health.status)) {
        ok = false;
        error = `Health check HTTP ${health.status}`;
      }
    }
    const latencyMs = Date.now() - started;
    return {
      id: site.id,
      name: site.name,
      url: site.url,
      group: site.group,
      ok,
      statusCode: response.status,
      latencyMs,
      error,
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

function evaluateInfrastructure(state: OpsState): VpsIssue[] {
  const issues: VpsIssue[] = [];
  for (const cert of Object.values(state.certificates)) {
    if (cert.error) {
      issues.push({
        id: `cert-${cert.targetId}`,
        severity: 'critical',
        label: `TLS ${cert.hostname}`,
        detail: cert.error,
      });
    } else if (cert.daysRemaining != null && cert.daysRemaining < 21) {
      issues.push({
        id: `cert-${cert.targetId}`,
        severity: cert.daysRemaining < 7 ? 'critical' : 'warn',
        label: `TLS ${cert.hostname}`,
        detail: `Certificato in scadenza tra ${cert.daysRemaining} giorni`,
      });
    }
  }
  for (const domain of Object.values(state.domains)) {
    if (domain.daysRemaining != null && domain.daysRemaining < 45) {
      issues.push({
        id: `domain-${domain.domain}`,
        severity: domain.daysRemaining < 15 ? 'critical' : 'warn',
        label: `Dominio ${domain.domain}`,
        detail: `Scadenza tra ${domain.daysRemaining} giorni`,
      });
    }
  }
  for (const backup of Object.values(state.backups)) {
    const stale = !backup.lastBackupAt || Date.now() - backup.lastBackupAt > 26 * 60 * 60_000;
    if (!backup.ok || stale) {
      issues.push({
        id: `backup-${backup.id}`,
        severity: stale && backup.lastBackupAt ? 'warn' : 'critical',
        label: `Backup ${backup.name}`,
        detail:
          backup.detail ||
          (backup.lastBackupAt ? 'Backup più vecchio di 26 ore' : 'Backup assente'),
      });
    }
  }
  for (const service of Object.values(state.services)) {
    if (service.status.toLowerCase() !== 'running') {
      issues.push({
        id: `service-${service.id}`,
        severity: 'critical',
        label: `Servizio ${service.name}`,
        detail: `Stato container: ${service.status}`,
      });
    }
  }
  return issues;
}

export async function runMonitor(kind: 'cron' | 'manual' = 'manual'): Promise<MonitorRun> {
  const checkedAt = Date.now();
  const previous = getOpsState();
  const results = await Promise.all(monitoredSites.map(site => checkSite(site.id)));
  const runtime = collectRuntimeMetrics();
  const agent = previous.agent;
  const agentStale = Boolean(agent && checkedAt - agent.receivedAt > AGENT_STALE_MS());
  const infrastructure = await refreshInfrastructure(monitoredSites, previous);
  const infrastructureState = {
    ...previous,
    certificates: infrastructure.certificates,
    domains: infrastructure.domains,
  };

  const vpsIssues = [
    ...evaluateVps(runtime, 'container'),
    ...(agent && !agentStale ? evaluateVps(agent, 'VPS') : []),
    ...evaluateInfrastructure(infrastructureState),
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
  const activeResources = new Map<
    string,
    {
      type: OpsIncident['resourceType'];
      title: string;
      detail: string;
      severity: OpsIncident['severity'];
    }
  >();
  for (const site of results) {
    if (!site.ok) {
      activeResources.set(`site:${site.id}`, {
        type: 'site',
        title: site.name,
        detail: site.error || 'Non raggiungibile',
        severity: 'critical',
      });
    }
  }
  for (const issue of vpsIssues) {
    activeResources.set(`vps:${issue.id}`, {
      type: 'vps',
      title: issue.label,
      detail: issue.detail,
      severity: issue.severity,
    });
  }

  updateOpsState(state => {
    state.sites = sitesMap;
    state.runtime = runtime;
    state.certificates = infrastructure.certificates;
    state.domains = infrastructure.domains;
    if (kind === 'cron') state.lastCronAt = checkedAt;
    if (kind === 'manual') state.lastManualCheckAt = checkedAt;
    state.history.push({
      at: checkedAt,
      sites: Object.fromEntries(
        results.map(site => [site.id, { ok: site.ok, latencyMs: site.latencyMs }])
      ),
      host: {
        memPct: formatPercent(agent?.memUsedBytes, agent?.memTotalBytes),
        diskPct: formatPercent(agent?.diskUsedBytes, agent?.diskTotalBytes),
        loadRatio: agent ? agent.load1 / Math.max(1, agent.cpuCount) : 0,
      },
    });
    const oldest = checkedAt - 30 * 24 * 60 * 60_000;
    state.history = state.history.filter(point => point.at >= oldest).slice(-9_000);
    for (const [id, window] of Object.entries(state.maintenance)) {
      if (window.until <= checkedAt) delete state.maintenance[id];
    }

    const open = new Map(
      state.incidents
        .filter(incident => !incident.resolvedAt)
        .map(incident => [`${incident.resourceType}:${incident.resourceId}`, incident])
    );
    for (const [key, resource] of activeResources) {
      if (open.has(key)) continue;
      const resourceId = key.slice(key.indexOf(':') + 1);
      state.incidents.push({
        id: `${key}:${checkedAt}`,
        resourceId,
        resourceType: resource.type,
        title: resource.title,
        detail: resource.detail,
        severity: resource.severity,
        openedAt: checkedAt,
      });
    }
    for (const [key, incident] of open) {
      if (!activeResources.has(key)) incident.resolvedAt = checkedAt;
    }
    state.incidents = state.incidents.slice(-500);
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
    previousState: previous,
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

  const backups: BackupReport[] = Array.isArray(payload.backups)
    ? payload.backups.flatMap(raw => {
        if (!raw || typeof raw !== 'object') return [];
        const item = raw as Record<string, unknown>;
        if (typeof item.id !== 'string' || typeof item.name !== 'string') return [];
        return [
          {
            id: item.id,
            name: item.name,
            path: typeof item.path === 'string' ? item.path : undefined,
            ok: item.ok === true,
            lastBackupAt: typeof item.lastBackupAt === 'number' ? item.lastBackupAt : undefined,
            sizeBytes: typeof item.sizeBytes === 'number' ? item.sizeBytes : undefined,
            restoreVerifiedAt:
              typeof item.restoreVerifiedAt === 'number' ? item.restoreVerifiedAt : undefined,
            detail: typeof item.detail === 'string' ? item.detail : undefined,
            receivedAt: metrics.receivedAt,
          },
        ];
      })
    : [];
  const services: ServiceReport[] = Array.isArray(payload.services)
    ? payload.services.flatMap(raw => {
        if (!raw || typeof raw !== 'object') return [];
        const item = raw as Record<string, unknown>;
        if (
          typeof item.id !== 'string' ||
          typeof item.name !== 'string' ||
          typeof item.status !== 'string'
        )
          return [];
        return [
          {
            id: item.id,
            name: item.name,
            status: item.status,
            image: typeof item.image === 'string' ? item.image : undefined,
            createdAt: typeof item.createdAt === 'number' ? item.createdAt : undefined,
            restartCount: typeof item.restartCount === 'number' ? item.restartCount : undefined,
            receivedAt: metrics.receivedAt,
          },
        ];
      })
    : [];

  updateOpsState(state => {
    state.agent = metrics;
    if (Array.isArray(payload.backups)) {
      state.backups = Object.fromEntries(backups.map(backup => [backup.id, backup]));
    }
    if (Array.isArray(payload.services)) {
      state.services = Object.fromEntries(services.map(service => [service.id, service]));
    }
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
    ...evaluateInfrastructure(state),
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
    previousState: state,
  };
}
