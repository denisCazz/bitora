import type { APIRoute } from 'astro';
import { updateOpsState } from '../../../lib/ops/store';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const id = String(form.get('id') || '');
  const note = String(form.get('note') || '')
    .trim()
    .slice(0, 500);
  let found = false;

  updateOpsState(state => {
    const incident = state.incidents.find(item => item.id === id);
    if (!incident) return;
    found = true;
    incident.acknowledgedAt = Date.now();
    incident.note = note || undefined;
  });

  if (!found) return Response.json({ ok: false, error: 'Incidente non trovato' }, { status: 404 });
  return redirect('/ops/incidenti/');
};
