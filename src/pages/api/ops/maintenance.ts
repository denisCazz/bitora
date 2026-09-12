import type { APIRoute } from 'astro';
import { monitoredSites } from '../../../data/monitoredTargets';
import { updateOpsState } from '../../../lib/ops/store';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const resourceId = String(form.get('resourceId') || '');
  const action = String(form.get('action') || 'set');
  const allowed = new Set(['*', ...monitoredSites.map(site => site.id)]);
  if (!allowed.has(resourceId)) {
    return Response.json({ ok: false, error: 'Risorsa non valida' }, { status: 400 });
  }

  updateOpsState(state => {
    if (action === 'clear') {
      delete state.maintenance[resourceId];
      return;
    }
    const hours = Math.min(168, Math.max(1, Number(form.get('hours')) || 1));
    state.maintenance[resourceId] = {
      resourceId,
      until: Date.now() + hours * 60 * 60_000,
      reason:
        String(form.get('reason') || '')
          .trim()
          .slice(0, 200) || undefined,
      createdAt: Date.now(),
    };
  });

  return redirect('/ops/siti/');
};
