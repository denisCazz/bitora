import type { APIRoute } from 'astro';
import {
  createTrackedSite,
  deleteTrackedSite,
  readTrackedSiteFields,
  updateTrackedSite,
} from '../../../lib/ops/trackedSites';

export const prerender = false;

function redirectToList(query?: Record<string, string>): Response {
  const params = new URLSearchParams();
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value) params.set(key, value);
    }
  }
  const suffix = params.toString() ? `?${params.toString()}` : '';
  return new Response(null, {
    status: 303,
    headers: { Location: `/ops/siti/${suffix}` },
  });
}

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  const action = String(form.get('action') || 'create');
  const id = String(form.get('id') || '').trim();

  if (action === 'create') {
    const fields = readTrackedSiteFields(form);
    if (!fields) return redirectToList({ errore: 'dati' });
    createTrackedSite(fields);
    return redirectToList();
  }

  if (!id) return redirectToList({ errore: 'dati' });

  if (action === 'update') {
    const fields = readTrackedSiteFields(form);
    if (!fields) return redirectToList({ errore: 'dati' });
    return updateTrackedSite(id, fields) ? redirectToList() : redirectToList({ errore: 'mancante' });
  }

  if (action === 'delete') {
    return deleteTrackedSite(id) ? redirectToList() : redirectToList({ errore: 'mancante' });
  }

  return redirectToList({ errore: 'dati' });
};
