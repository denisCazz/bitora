import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { env, opsSessionSecret, opsVaultSeedPath } from './env';
import type { OpsVaultEntry, VaultKind, VaultSource } from './store';
import { getTrackedSites } from './trackedSites';
import { updateOpsState } from './store';

export const VAULT_KINDS = [
  'login',
  'database',
  'api',
  'email',
  'hosting',
  'pagamento',
  'altro',
] as const satisfies readonly VaultKind[];

export const VAULT_KIND_LABELS: Record<VaultKind, string> = {
  login: 'Login',
  database: 'Database',
  api: 'API / secret',
  email: 'Email',
  hosting: 'Hosting / storage',
  pagamento: 'Pagamenti',
  altro: 'Altro',
};

export type VaultGroup = 'infrastruttura' | 'gestionali' | 'clienti' | 'altro';

export interface VaultProject {
  id: string;
  name: string;
  group: VaultGroup;
  url?: string;
}

const EXTRA_PROJECTS: VaultProject[] = [
  { id: 'desy-nails', name: 'Desy Nails', group: 'clienti' },
  { id: 'tropini', name: 'Tropini Service', group: 'clienti' },
  { id: 'planner-tropini', name: 'Planner Tropini', group: 'gestionali' },
  { id: 'dai-ragazzi', name: 'Gestionale Dai Ragazzi', group: 'gestionali' },
];

const GROUP_ORDER: VaultGroup[] = ['infrastruttura', 'gestionali', 'clienti', 'altro'];

export const VAULT_GROUP_LABELS: Record<VaultGroup, string> = {
  infrastruttura: 'Infrastruttura',
  gestionali: 'Gestionali',
  clienti: 'Clienti',
  altro: 'Altri progetti',
};

export function vaultProjects(): VaultProject[] {
  const tracked = getTrackedSites().map(site => ({
    id: site.id,
    name: site.name,
    group: site.group as VaultGroup,
    url: site.url,
  }));
  return [
    ...tracked,
    ...EXTRA_PROJECTS.filter(project => !tracked.some(site => site.id === project.id)),
  ];
}

export interface VaultSeedEntry {
  projectId: string;
  title: string;
  kind: VaultKind;
  username?: string;
  secret: string;
  url?: string;
  notes?: string;
}

export interface VaultView extends OpsVaultEntry {
  projectName: string;
  projectUrl?: string;
  group: VaultGroup;
  kindLabel: string;
  plaintext: string;
}

const MAX_TITLE = 120;
const MAX_USERNAME = 200;
const MAX_SECRET = 20_000;
const MAX_URL = 500;
const MAX_NOTES = 1_000;

export function isVaultKind(value: string): value is VaultKind {
  return (VAULT_KINDS as readonly string[]).includes(value);
}

export function vaultProject(id: string): VaultProject | undefined {
  return vaultProjects().find(project => project.id === id);
}

export function resolveVaultProject(id: string): VaultProject {
  return (
    vaultProject(id) ?? {
      id,
      name: id,
      group: 'altro',
    }
  );
}

function vaultKey(): Buffer {
  const secret = opsSessionSecret() || env('OPS_PASSWORD') || 'bitora-ops-vault';
  return createHash('sha256').update(secret).digest();
}

export function encryptSecret(plain: string): string {
  if (!plain) return '';
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', vaultKey(), iv);
  const enc = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `v1.${iv.toString('base64url')}.${tag.toString('base64url')}.${enc.toString('base64url')}`;
}

export function decryptSecret(stored: string): string {
  if (!stored) return '';
  if (!stored.startsWith('v1.')) return stored;
  const parts = stored.split('.');
  if (parts.length !== 4) return stored;
  try {
    const iv = Buffer.from(parts[1], 'base64url');
    const tag = Buffer.from(parts[2], 'base64url');
    const data = Buffer.from(parts[3], 'base64url');
    const decipher = createDecipheriv('aes-256-gcm', vaultKey(), iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
  } catch {
    return '';
  }
}

export function importId(projectId: string, title: string): string {
  return `imp-${createHash('sha256').update(`vault:${projectId}:${title}`).digest('hex').slice(0, 16)}`;
}

function loadSeedFile(): VaultSeedEntry[] {
  try {
    const raw = readFileSync(opsVaultSeedPath(), 'utf8');
    const parsed = JSON.parse(raw) as { entries?: VaultSeedEntry[] };
    if (!Array.isArray(parsed.entries)) return [];
    return parsed.entries.filter(
      entry =>
        entry &&
        typeof entry.projectId === 'string' &&
        typeof entry.title === 'string' &&
        typeof entry.secret === 'string' &&
        isVaultKind(entry.kind)
    );
  } catch {
    return [];
  }
}

function toStoredEntry(seed: VaultSeedEntry, now: number, source: VaultSource): OpsVaultEntry {
  return {
    id: importId(seed.projectId, seed.title),
    projectId: seed.projectId.trim(),
    title: seed.title.trim().slice(0, MAX_TITLE),
    kind: seed.kind,
    username: seed.username?.trim().slice(0, MAX_USERNAME) || undefined,
    secret: encryptSecret(seed.secret),
    url: seed.url?.trim().slice(0, MAX_URL) || undefined,
    notes: seed.notes?.trim().slice(0, MAX_NOTES) || undefined,
    source,
    createdAt: now,
    updatedAt: now,
  };
}

export function mergeVaultSeed(force = false): { imported: number; updated: number; available: number } {
  const seed = loadSeedFile();
  if (!seed.length) return { imported: 0, updated: 0, available: 0 };
  let imported = 0;
  let updated = 0;
  updateOpsState(state => {
    if (!Array.isArray(state.vault)) state.vault = [];
    if (!force && state.vaultImportedAt) return;
    const now = Date.now();
    for (const item of seed) {
      const entry = toStoredEntry(item, now, 'import');
      const existing = state.vault.find(current => current.id === entry.id);
      if (!existing) {
        state.vault.push(entry);
        imported += 1;
        continue;
      }
      if (existing.source !== 'import') continue;
      existing.title = entry.title;
      existing.kind = entry.kind;
      existing.username = entry.username;
      existing.secret = entry.secret;
      existing.url = entry.url;
      existing.notes = entry.notes;
      existing.updatedAt = now;
      updated += 1;
    }
    state.vaultImportedAt = now;
  });
  return { imported, updated, available: seed.length };
}

export function ensureVaultSeeded(): { imported: number; updated: number; available: number } {
  return mergeVaultSeed(false);
}

export function revealVault(entries: OpsVaultEntry[]): VaultView[] {
  return entries.map(entry => {
    const project = resolveVaultProject(entry.projectId);
    return {
      ...entry,
      projectName: project.name,
      projectUrl: project.url,
      group: project.group,
      kindLabel: VAULT_KIND_LABELS[entry.kind] ?? entry.kind,
      plaintext: decryptSecret(entry.secret),
    };
  });
}

export function vaultSummary(entries: OpsVaultEntry[]): { count: number; projects: number } {
  const projects = new Set(entries.map(entry => entry.projectId));
  return { count: entries.length, projects: projects.size };
}

export interface VaultProjectGroup {
  project: VaultProject;
  entries: VaultView[];
}

export function groupVaultByProject(views: VaultView[]): VaultProjectGroup[] {
  const byId = new Map<string, VaultView[]>();
  for (const view of views) {
    const list = byId.get(view.projectId) ?? [];
    list.push(view);
    byId.set(view.projectId, list);
  }

  const groups: VaultProjectGroup[] = [];
  for (const project of vaultProjects()) {
    const entries = byId.get(project.id);
    if (!entries?.length) continue;
    groups.push({
      project,
      entries: entries.sort((a, b) => a.title.localeCompare(b.title, 'it')),
    });
    byId.delete(project.id);
  }

  for (const [id, entries] of byId) {
    groups.push({
      project: resolveVaultProject(id),
      entries: entries.sort((a, b) => a.title.localeCompare(b.title, 'it')),
    });
  }

  return groups.sort((a, b) => {
    const groupDiff = GROUP_ORDER.indexOf(a.project.group) - GROUP_ORDER.indexOf(b.project.group);
    if (groupDiff !== 0) return groupDiff;
    return a.project.name.localeCompare(b.project.name, 'it');
  });
}

export function emptyVaultProjects(entries: OpsVaultEntry[]): VaultProject[] {
  const used = new Set(entries.map(entry => entry.projectId));
  return vaultProjects().filter(project => !used.has(project.id));
}

export interface VaultFields {
  projectId: string;
  title: string;
  kind: VaultKind;
  username?: string;
  secret: string;
  url?: string;
  notes?: string;
}

export function readVaultFields(
  form: FormData,
  options: { secretRequired: boolean }
): VaultFields | null {
  const projectId = String(form.get('projectId') || '')
    .trim()
    .slice(0, 80);
  const title = String(form.get('title') || '')
    .trim()
    .slice(0, MAX_TITLE);
  const kind = String(form.get('kind') || 'altro');
  const secret = String(form.get('secret') || '').slice(0, MAX_SECRET);
  if (!projectId || !title || !isVaultKind(kind)) return null;
  if (options.secretRequired && !secret.trim()) return null;

  const username = String(form.get('username') || '')
    .trim()
    .slice(0, MAX_USERNAME);
  const url = String(form.get('url') || '')
    .trim()
    .slice(0, MAX_URL);
  const notes = String(form.get('notes') || '')
    .trim()
    .slice(0, MAX_NOTES);

  return {
    projectId,
    title,
    kind,
    secret,
    username: username || undefined,
    url: url || undefined,
    notes: notes || undefined,
  };
}
