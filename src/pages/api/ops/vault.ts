import type { APIRoute } from 'astro';
import { encryptSecret, mergeVaultSeed, readVaultFields } from '../../../lib/ops/vault';
import { updateOpsState } from '../../../lib/ops/store';

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
    headers: { Location: `/ops/password/${suffix}` },
  });
}

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  const action = String(form.get('action') || 'create');
  const id = String(form.get('id') || '');

  if (action === 'import') {
    const result = mergeVaultSeed(true);
    return redirectToList({
      importate: String(result.imported),
      aggiornate: String(result.updated),
    });
  }

  if (action === 'create') {
    const fields = readVaultFields(form, { secretRequired: true });
    if (!fields) return redirectToList({ errore: 'dati' });
    const now = Date.now();
    updateOpsState(state => {
      state.vault.push({
        id: crypto.randomUUID(),
        projectId: fields.projectId,
        title: fields.title,
        kind: fields.kind,
        username: fields.username,
        secret: encryptSecret(fields.secret),
        url: fields.url,
        notes: fields.notes,
        source: 'manual',
        createdAt: now,
        updatedAt: now,
      });
    });
    return redirectToList({ progetto: fields.projectId });
  }

  if (!id) return redirectToList({ errore: 'dati' });

  if (action === 'update') {
    const fields = readVaultFields(form, { secretRequired: false });
    if (!fields) return redirectToList({ errore: 'dati' });
    let found = false;
    updateOpsState(state => {
      const entry = state.vault.find(item => item.id === id);
      if (!entry) return;
      found = true;
      entry.projectId = fields.projectId;
      entry.title = fields.title;
      entry.kind = fields.kind;
      entry.username = fields.username;
      entry.url = fields.url;
      entry.notes = fields.notes;
      if (fields.secret.trim()) entry.secret = encryptSecret(fields.secret);
      entry.updatedAt = Date.now();
    });
    return found
      ? redirectToList({ progetto: fields.projectId })
      : redirectToList({ errore: 'mancante' });
  }

  if (action === 'delete') {
    updateOpsState(state => {
      state.vault = state.vault.filter(item => item.id !== id);
    });
    return redirectToList();
  }

  return redirectToList({ errore: 'dati' });
};
