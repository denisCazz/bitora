import type {
  DeadlineCategory,
  DeadlineRecurrence,
  OpsDeadline,
  OpsState,
} from './store';

export const DEADLINE_CATEGORIES = [
  'dominio',
  'hosting',
  'certificato',
  'contratto',
  'fattura',
  'licenza',
  'fiscale',
  'altro',
] as const satisfies readonly DeadlineCategory[];

export const DEADLINE_CATEGORY_LABELS: Record<DeadlineCategory, string> = {
  dominio: 'Dominio',
  hosting: 'Hosting',
  certificato: 'Certificato',
  contratto: 'Contratto',
  fattura: 'Fattura',
  licenza: 'Licenza',
  fiscale: 'Fiscale',
  altro: 'Altro',
};

export const DEADLINE_RECURRENCES = ['none', 'monthly', 'yearly'] as const satisfies readonly DeadlineRecurrence[];

export const DEADLINE_RECURRENCE_LABELS: Record<DeadlineRecurrence, string> = {
  none: 'Nessuna',
  monthly: 'Mensile',
  yearly: 'Annuale',
};

export type DeadlineUrgency = 'overdue' | 'week' | 'month' | 'later' | 'done';

export interface DeadlineView {
  id: string;
  title: string;
  category: DeadlineCategory;
  dueOn?: string;
  daysRemaining: number | null;
  amount?: number;
  client?: string;
  notes?: string;
  recurrence: DeadlineRecurrence;
  remindDays: number;
  source: 'manual' | 'dominio' | 'certificato';
  doneAt?: number;
  editable: boolean;
  urgency: DeadlineUrgency;
}

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const DEADLINE_ALERT_COOLDOWN_MS = 20 * 60 * 60_000;

export function todayRome(now = Date.now()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Rome',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(now));
}

export function isDueOn(value: string): boolean {
  const match = DATE_RE.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

export function daysUntil(dueOn: string, today = todayRome()): number | null {
  if (!isDueOn(dueOn) || !isDueOn(today)) return null;
  const from = Date.parse(`${today}T00:00:00Z`);
  const to = Date.parse(`${dueOn}T00:00:00Z`);
  return Math.round((to - from) / 86_400_000);
}

export function urgencyFromDays(days: number | null, done = false): DeadlineUrgency {
  if (done) return 'done';
  if (days == null) return 'later';
  if (days < 0) return 'overdue';
  if (days <= 7) return 'week';
  if (days <= 30) return 'month';
  return 'later';
}

function lastDayOfMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function addMonths(dueOn: string, months: number): string {
  const match = DATE_RE.exec(dueOn);
  if (!match) return dueOn;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const total = year * 12 + (month - 1) + months;
  const nextYear = Math.floor(total / 12);
  const nextMonth = (total % 12) + 1;
  const nextDay = Math.min(day, lastDayOfMonth(nextYear, nextMonth));
  return `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(nextDay).padStart(2, '0')}`;
}

export function advanceDueOn(dueOn: string, recurrence: DeadlineRecurrence, today = todayRome()): string {
  if (recurrence === 'none') return dueOn;
  const step = recurrence === 'monthly' ? 1 : 12;
  let next = addMonths(dueOn, step);
  while (next < today) next = addMonths(next, step);
  return next;
}

function timestampToDueOn(ts: number | undefined): string | undefined {
  if (!ts) return undefined;
  return todayRome(ts);
}

function viewFromManual(deadline: OpsDeadline, today: string): DeadlineView {
  const daysRemaining = daysUntil(deadline.dueOn, today);
  return {
    id: deadline.id,
    title: deadline.title,
    category: deadline.category,
    dueOn: deadline.dueOn,
    daysRemaining,
    amount: deadline.amount,
    client: deadline.client,
    notes: deadline.notes,
    recurrence: deadline.recurrence,
    remindDays: deadline.remindDays,
    source: 'manual',
    doneAt: deadline.doneAt,
    editable: true,
    urgency: urgencyFromDays(daysRemaining, Boolean(deadline.doneAt)),
  };
}

export function collectDeadlineViews(state: OpsState, today = todayRome()): DeadlineView[] {
  const items: DeadlineView[] = state.deadlines.map(deadline => viewFromManual(deadline, today));
  const covered = new Set(
    items
      .filter(item => !item.doneAt && (item.category === 'dominio' || item.category === 'certificato'))
      .map(item => `${item.category}:${(item.title || item.client || '').toLowerCase()}`)
  );

  for (const domain of Object.values(state.domains)) {
    const key = `dominio:${domain.domain.toLowerCase()}`;
    if (covered.has(key)) continue;
    const dueOn = timestampToDueOn(domain.expiresAt);
    const daysRemaining = domain.daysRemaining ?? (dueOn ? daysUntil(dueOn, today) : null);
    items.push({
      id: `auto:dominio:${domain.domain}`,
      title: domain.domain,
      category: 'dominio',
      dueOn,
      daysRemaining,
      notes: domain.registrar ? `Registrar: ${domain.registrar}` : domain.error,
      recurrence: 'yearly',
      remindDays: 45,
      source: 'dominio',
      editable: false,
      urgency: urgencyFromDays(daysRemaining),
    });
  }

  for (const cert of Object.values(state.certificates)) {
    const key = `certificato:${cert.hostname.toLowerCase()}`;
    if (covered.has(key)) continue;
    const dueOn = timestampToDueOn(cert.validTo);
    const daysRemaining = cert.daysRemaining ?? (dueOn ? daysUntil(dueOn, today) : null);
    items.push({
      id: `auto:certificato:${cert.targetId}`,
      title: cert.hostname,
      category: 'certificato',
      dueOn,
      daysRemaining,
      notes: cert.issuer ? `Issuer: ${cert.issuer}` : cert.error,
      recurrence: 'yearly',
      remindDays: 21,
      source: 'certificato',
      editable: false,
      urgency: urgencyFromDays(daysRemaining),
    });
  }

  return items.sort((a, b) => {
    if (Boolean(a.doneAt) !== Boolean(b.doneAt)) return a.doneAt ? 1 : -1;
    const aDays = a.daysRemaining ?? 99999;
    const bDays = b.daysRemaining ?? 99999;
    if (aDays !== bDays) return aDays - bDays;
    return a.title.localeCompare(b.title, 'it');
  });
}

export function deadlineSummary(items: DeadlineView[]) {
  const open = items.filter(item => !item.doneAt);
  return {
    open: open.length,
    overdue: open.filter(item => item.urgency === 'overdue').length,
    week: open.filter(item => item.urgency === 'week').length,
    month: open.filter(item => item.urgency === 'week' || item.urgency === 'month').length,
  };
}

export function collectDeadlineAlertEvents(
  deadlines: OpsDeadline[],
  lastAlertAt: Record<string, number>,
  now = Date.now()
): Array<{ id: string; title: string; detail: string }> {
  const today = todayRome(now);
  const events: Array<{ id: string; title: string; detail: string }> = [];

  for (const deadline of deadlines) {
    if (deadline.doneAt) continue;
    const days = daysUntil(deadline.dueOn, today);
    if (days == null || days > deadline.remindDays) continue;
    const key = `deadline:${deadline.id}`;
    const lastAlert = lastAlertAt[key] ?? 0;
    if (now - lastAlert < DEADLINE_ALERT_COOLDOWN_MS) continue;

    const who = deadline.client ? ` · ${deadline.client}` : '';
    const detail =
      days < 0
        ? `Scaduta da ${Math.abs(days)} ${Math.abs(days) === 1 ? 'giorno' : 'giorni'}${who}`
        : days === 0
          ? `Scade oggi${who}`
          : `Scade tra ${days} ${days === 1 ? 'giorno' : 'giorni'}${who}`;

    events.push({
      id: deadline.id,
      title: deadline.title,
      detail,
    });
  }

  return events;
}

export function isDeadlineCategory(value: string): value is DeadlineCategory {
  return (DEADLINE_CATEGORIES as readonly string[]).includes(value);
}

export function isDeadlineRecurrence(value: string): value is DeadlineRecurrence {
  return (DEADLINE_RECURRENCES as readonly string[]).includes(value);
}
