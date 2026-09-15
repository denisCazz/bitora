import {
  isMonitorGroup,
  monitoredSites,
  type MonitorGroup,
  type MonitoredSite,
} from '../../data/monitoredTargets';
import { getOpsState, updateOpsState, type OpsState, type TrackedSiteRecord } from './store';

const MAX_NAME = 80;
const MAX_URL = 300;
const MAX_TEXT = 120;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export interface TrackedSiteView extends MonitoredSite {
  source: 'default' | 'custom';
  overridden: boolean;
}

export interface TrackedSiteFields {
  name: string;
  url: string;
  group: MonitorGroup;
  expectedText?: string;
  healthUrl?: string;
  umamiWebsiteId?: string;
}

const DEFAULT_BY_ID = new Map(monitoredSites.map(site => [site.id, site]));

export function normalizeTrackedUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withProtocol);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    const host = url.hostname.replace(/\.$/, '').toLowerCase();
    if (!host || host === 'localhost' || !host.includes('.')) return null;
    url.hostname = host;
    url.hash = '';
    url.username = '';
    url.password = '';
    if (!url.pathname) url.pathname = '/';
    return url.toString();
  } catch {
    return null;
  }
}

function optionalHealthUrl(raw: string, siteUrl: string): string | undefined | null {
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith('/')) {
    try {
      return new URL(trimmed, siteUrl).toString();
    } catch {
      return null;
    }
  }
  return normalizeTrackedUrl(trimmed);
}

function slugFromUrl(url: string): string {
  try {
    return new URL(url).hostname
      .replace(/^www\./, '')
      .replace(/[^a-z0-9]+/gi, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase()
      .slice(0, 60);
  } catch {
    return 'sito';
  }
}

function uniqueId(base: string, used: Set<string>): string {
  const root = base || 'sito';
  if (!used.has(root)) return root;
  let n = 2;
  while (used.has(`${root}-${n}`)) n += 1;
  return `${root}-${n}`;
}

function optionalText(raw: string, max = MAX_TEXT): string | undefined {
  const value = raw.trim().slice(0, max);
  return value || undefined;
}

function optionalUmamiId(raw: string): string | undefined | null {
  const value = raw.trim();
  if (!value) return undefined;
  if (!UUID_RE.test(value)) return null;
  return value.toLowerCase();
}

function toRecord(id: string, fields: TrackedSiteFields): TrackedSiteRecord {
  return {
    id,
    name: fields.name,
    url: fields.url,
    group: fields.group,
    expectedText: fields.expectedText ?? '',
    healthUrl: fields.healthUrl ?? '',
    umamiWebsiteId: fields.umamiWebsiteId ?? '',
  };
}

function applyRecord(base: MonitoredSite | undefined, record: TrackedSiteRecord): MonitoredSite {
  const group = isMonitorGroup(record.group) ? record.group : (base?.group ?? 'clienti');
  return {
    id: record.id,
    name: record.name,
    url: record.url,
    group,
    expectedText: record.expectedText || undefined,
    healthUrl: record.healthUrl || undefined,
    umamiWebsiteId: record.umamiWebsiteId || undefined,
    okStatuses: base?.okStatuses,
    healthStatuses: base?.healthStatuses,
  };
}

export function readTrackedSiteFields(form: FormData): TrackedSiteFields | null {
  const name = String(form.get('name') || '')
    .trim()
    .slice(0, MAX_NAME);
  const url = normalizeTrackedUrl(String(form.get('url') || '').slice(0, MAX_URL));
  const group = String(form.get('group') || 'clienti');
  if (!name || !url || !isMonitorGroup(group)) return null;

  const healthUrl = optionalHealthUrl(String(form.get('healthUrl') || '').slice(0, MAX_URL), url);
  if (healthUrl === null) return null;
  const umamiWebsiteId = optionalUmamiId(String(form.get('umamiWebsiteId') || ''));
  if (umamiWebsiteId === null) return null;

  return {
    name,
    url,
    group,
    expectedText: optionalText(String(form.get('expectedText') || '')),
    healthUrl,
    umamiWebsiteId,
  };
}

export function resolveTrackedSites(state: Pick<OpsState, 'trackedSites' | 'removedSiteIds'>): MonitoredSite[] {
  return resolveTrackedSiteViews(state);
}

export function resolveTrackedSiteViews(
  state: Pick<OpsState, 'trackedSites' | 'removedSiteIds'>
): TrackedSiteView[] {
  const removed = new Set(state.removedSiteIds ?? []);
  const records = Array.isArray(state.trackedSites) ? state.trackedSites : [];
  const overrides = new Map(records.map(record => [record.id, record]));
  const views: TrackedSiteView[] = [];

  for (const site of monitoredSites) {
    if (removed.has(site.id)) continue;
    const override = overrides.get(site.id);
    if (override) {
      views.push({ ...applyRecord(site, override), source: 'default', overridden: true });
    } else {
      views.push({ ...site, source: 'default', overridden: false });
    }
  }

  for (const record of records) {
    if (DEFAULT_BY_ID.has(record.id) || removed.has(record.id)) continue;
    if (!isMonitorGroup(record.group) || !record.name || !normalizeTrackedUrl(record.url)) continue;
    views.push({ ...applyRecord(undefined, record), source: 'custom', overridden: false });
  }

  return views;
}

export function getTrackedSites(): MonitoredSite[] {
  return resolveTrackedSites(getOpsState());
}

export function getTrackedSiteViews(): TrackedSiteView[] {
  return resolveTrackedSiteViews(getOpsState());
}

function pruneSiteArtifacts(state: OpsState, id: string): void {
  delete state.sites[id];
  delete state.certificates[id];
  delete state.maintenance[id];
  delete state.lastAlertAt[`site:${id}`];
}

export function createTrackedSite(fields: TrackedSiteFields): string {
  let id = '';
  updateOpsState(state => {
    const current = resolveTrackedSites(state);
    const used = new Set(current.map(site => site.id));
    for (const removed of state.removedSiteIds) used.add(removed);
    id = uniqueId(slugFromUrl(fields.url), used);
    state.trackedSites.push(toRecord(id, fields));
  });
  return id;
}

function matchesDefault(fields: TrackedSiteFields, site: MonitoredSite): boolean {
  return (
    fields.name === site.name &&
    fields.url === site.url &&
    fields.group === site.group &&
    (fields.expectedText || undefined) === (site.expectedText || undefined) &&
    (fields.healthUrl || undefined) === (site.healthUrl || undefined) &&
    (fields.umamiWebsiteId || undefined) === (site.umamiWebsiteId || undefined)
  );
}

export function updateTrackedSite(id: string, fields: TrackedSiteFields): boolean {
  let found = false;
  updateOpsState(state => {
    const current = resolveTrackedSites(state);
    const existing = current.find(site => site.id === id);
    if (!existing) return;
    found = true;
    const defaults = DEFAULT_BY_ID.get(id);
    state.removedSiteIds = state.removedSiteIds.filter(item => item !== id);
    if (defaults && matchesDefault(fields, defaults)) {
      state.trackedSites = state.trackedSites.filter(item => item.id !== id);
      if (existing.url !== fields.url) delete state.certificates[id];
      return;
    }
    const record = toRecord(id, fields);
    const index = state.trackedSites.findIndex(item => item.id === id);
    if (index >= 0) state.trackedSites[index] = record;
    else state.trackedSites.push(record);
    if (existing.url !== fields.url) delete state.certificates[id];
  });
  return found;
}

export function deleteTrackedSite(id: string): boolean {
  let found = false;
  updateOpsState(state => {
    const current = resolveTrackedSites(state);
    if (!current.some(site => site.id === id)) return;
    found = true;
    state.trackedSites = state.trackedSites.filter(item => item.id !== id);
    if (DEFAULT_BY_ID.has(id) && !state.removedSiteIds.includes(id)) {
      state.removedSiteIds.push(id);
    }
    pruneSiteArtifacts(state, id);
  });
  return found;
}
