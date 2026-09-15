export function formatBytes(bytes: number | undefined): string {
  if (bytes == null || !Number.isFinite(bytes)) return '—';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = bytes;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }
  const digits = value >= 10 || i === 0 ? 0 : 1;
  return `${value.toFixed(digits)} ${units[i]}`;
}

export function formatPercent(used: number | undefined, total: number | undefined): number | null {
  if (used == null || total == null || total <= 0) return null;
  return Math.min(100, Math.max(0, (used / total) * 100));
}

export function formatDuration(seconds: number | undefined): string {
  if (seconds == null || !Number.isFinite(seconds)) return '—';
  const s = Math.floor(seconds);
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const mins = Math.floor((s % 3600) / 60);
  if (days > 0) return `${days}g ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  if (mins > 0) return `${mins} min`;
  return `${s}s`;
}

export function formatRelative(ts: number | undefined): string {
  if (!ts) return 'mai';
  const delta = Date.now() - ts;
  if (delta < 0) return 'adesso';
  const s = Math.round(delta / 1000);
  if (s < 10) return 'adesso';
  if (s < 60) return `${s}s fa`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min fa`;
  const h = Math.round(m / 60);
  if (h < 48) return `${h}h fa`;
  const d = Math.round(h / 24);
  return `${d}g fa`;
}

export function formatClock(ts: number | undefined): string {
  if (!ts) return '—';
  return new Intl.DateTimeFormat('it-IT', {
    dateStyle: 'short',
    timeStyle: 'medium',
    timeZone: 'Europe/Rome',
  }).format(new Date(ts));
}

export function formatDate(dueOn: string | number | undefined): string {
  if (dueOn == null || dueOn === '') return '—';
  if (typeof dueOn === 'number') {
    return new Intl.DateTimeFormat('it-IT', {
      dateStyle: 'medium',
      timeZone: 'Europe/Rome',
    }).format(new Date(dueOn));
  }
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dueOn);
  if (!match) return dueOn;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  return new Intl.DateTimeFormat('it-IT', {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function formatEuro(amount: number | undefined): string {
  if (amount == null || !Number.isFinite(amount)) return '—';
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount);
}

export function formatMs(ms: number | null | undefined): string {
  if (ms == null) return '—';
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${(ms / 1000).toFixed(1)} s`;
}
