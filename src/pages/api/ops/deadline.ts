import type { APIRoute } from 'astro';
import { randomUUID } from 'node:crypto';
import {
  advanceDueOn,
  isDeadlineCategory,
  isDeadlineRecurrence,
  isDueOn,
  todayRome,
} from '../../../lib/ops/deadlines';
import type { OpsDeadline } from '../../../lib/ops/store';
import { updateOpsState } from '../../../lib/ops/store';

export const prerender = false;

const MAX_TITLE = 120;
const MAX_CLIENT = 80;
const MAX_NOTES = 1000;

function parseAmount(raw: string): number | undefined {
  const cleaned = raw.trim().replace(/\s/g, '').replace(',', '.');
  if (!cleaned) return undefined;
  const n = Number(cleaned);
  if (!Number.isFinite(n) || n < 0 || n > 1_000_000) return undefined;
  return Math.round(n * 100) / 100;
}

function parseRemindDays(raw: string): number {
  const n = Number(raw);
  if (!Number.isFinite(n)) return 14;
  return Math.min(365, Math.max(0, Math.round(n)));
}

function readFields(form: FormData): Omit<OpsDeadline, 'id' | 'createdAt' | 'updatedAt' | 'doneAt'> | null {
  const title = String(form.get('title') || '')
    .trim()
    .slice(0, MAX_TITLE);
  const category = String(form.get('category') || 'altro');
  const dueOn = String(form.get('dueOn') || '').trim();
  const recurrence = String(form.get('recurrence') || 'none');
  if (!title || !isDeadlineCategory(category) || !isDueOn(dueOn) || !isDeadlineRecurrence(recurrence)) {
    return null;
  }

  const client = String(form.get('client') || '')
    .trim()
    .slice(0, MAX_CLIENT);
  const notes = String(form.get('notes') || '')
    .trim()
    .slice(0, MAX_NOTES);

  return {
    title,
    category,
    dueOn,
    recurrence,
    remindDays: parseRemindDays(String(form.get('remindDays') || '14')),
    amount: parseAmount(String(form.get('amount') || '')),
    client: client || undefined,
    notes: notes || undefined,
  };
}

function redirectToList(error?: string): Response {
  const path = error ? `/ops/scadenze/?errore=${encodeURIComponent(error)}` : '/ops/scadenze/';
  return new Response(null, {
    status: 303,
    headers: { Location: path },
  });
}

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  const action = String(form.get('action') || 'create');
  const id = String(form.get('id') || '');

  if (action === 'create') {
    const fields = readFields(form);
    if (!fields) return redirectToList('dati');
    const now = Date.now();
    updateOpsState(state => {
      state.deadlines.push({
        ...fields,
        id: randomUUID(),
        createdAt: now,
        updatedAt: now,
      });
    });
    return redirectToList();
  }

  if (!id) return redirectToList('dati');

  if (action === 'update') {
    const fields = readFields(form);
    if (!fields) return redirectToList('dati');
    let found = false;
    updateOpsState(state => {
      const deadline = state.deadlines.find(item => item.id === id);
      if (!deadline) return;
      found = true;
      Object.assign(deadline, fields, { updatedAt: Date.now() });
    });
    return found ? redirectToList() : redirectToList('mancante');
  }

  if (action === 'complete') {
    let found = false;
    updateOpsState(state => {
      const deadline = state.deadlines.find(item => item.id === id);
      if (!deadline || deadline.doneAt) return;
      found = true;
      const now = Date.now();
      if (deadline.recurrence === 'none') {
        deadline.doneAt = now;
      } else {
        deadline.dueOn = advanceDueOn(deadline.dueOn, deadline.recurrence, todayRome(now));
        deadline.doneAt = undefined;
        delete state.lastAlertAt[`deadline:${deadline.id}`];
      }
      deadline.updatedAt = now;
    });
    return found ? redirectToList() : redirectToList('mancante');
  }

  if (action === 'reopen') {
    let found = false;
    updateOpsState(state => {
      const deadline = state.deadlines.find(item => item.id === id);
      if (!deadline) return;
      found = true;
      deadline.doneAt = undefined;
      deadline.updatedAt = Date.now();
    });
    return found ? redirectToList() : redirectToList('mancante');
  }

  if (action === 'delete') {
    updateOpsState(state => {
      state.deadlines = state.deadlines.filter(item => item.id !== id);
      delete state.lastAlertAt[`deadline:${id}`];
    });
    return redirectToList();
  }

  return redirectToList('dati');
};
