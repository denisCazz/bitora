export function env(name: string): string {
  const fromMeta = import.meta.env[name as keyof ImportMetaEnv];
  const value = fromMeta ?? process.env[name];
  return typeof value === 'string' ? value.trim() : '';
}

export function envNumber(name: string, fallback: number): number {
  const raw = env(name);
  if (!raw) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

export function isOpsConfigured(): boolean {
  return Boolean(env('OPS_PASSWORD'));
}

export function opsPassword(): string {
  return env('OPS_PASSWORD');
}

export function opsSessionSecret(): string {
  return env('OPS_SESSION_SECRET') || env('OPS_PASSWORD');
}

export function opsCronSecret(): string {
  return env('OPS_CRON_SECRET');
}

export function opsStatePath(): string {
  return env('OPS_STATE_PATH') || '/tmp/bitora-ops-state.json';
}

export function opsVaultSeedPath(): string {
  return env('OPS_VAULT_SEED_PATH') || 'data/ops-vault.seed.json';
}

export const VPS_DISK_WARN = () => envNumber('OPS_VPS_DISK_WARN', 85);
export const VPS_MEM_WARN = () => envNumber('OPS_VPS_MEM_WARN', 90);
export const VPS_LOAD_WARN = () => envNumber('OPS_VPS_LOAD_WARN', 1);
export const SITE_TIMEOUT_MS = () => envNumber('OPS_SITE_TIMEOUT_MS', 12_000);
export const AGENT_STALE_MS = () => envNumber('OPS_AGENT_STALE_MS', 20 * 60_000);
export const ALERT_REMIND_MS = () => envNumber('OPS_ALERT_REMIND_MS', 6 * 60 * 60_000);
