import type { APIRoute } from 'astro';
import { extractBearerToken, verifyCronSecret } from '../../../lib/ops/auth';
import { opsCronSecret } from '../../../lib/ops/env';
import { importVaultEntries, isVaultKind, type VaultSeedEntry } from '../../../lib/ops/vault';

export const prerender = false;

const MAX_BYTES = 2_000_000;
const MAX_ENTRIES = 400;

function json(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

function unauthorized(): Response {
  return json({ ok: false, error: 'Non autorizzato' }, 401);
}

function authorize(request: Request): Response | null {
  if (!opsCronSecret() || !verifyCronSecret(extractBearerToken(request))) return unauthorized();
  return null;
}

export const GET: APIRoute = async ({ request }) => {
  const denied = authorize(request);
  if (denied) return denied;
  return json({ ok: false, error: 'Usa POST' }, 405);
};

export const POST: APIRoute = async ({ request }) => {
  const denied = authorize(request);
  if (denied) return denied;

  const length = Number(request.headers.get('content-length') || 0);
  if (Number.isFinite(length) && length > MAX_BYTES) {
    return json({ ok: false, error: 'Payload troppo grande' }, 413);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'JSON non valido' }, 400);
  }

  const raw =
    body && typeof body === 'object' && Array.isArray((body as { entries?: unknown }).entries)
      ? (body as { entries: unknown[] }).entries
      : null;
  if (!raw || raw.length === 0 || raw.length > MAX_ENTRIES) {
    return json({ ok: false, error: 'Elenco credenziali non valido' }, 400);
  }

  const entries: VaultSeedEntry[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const row = item as Record<string, unknown>;
    const kind = typeof row.kind === 'string' ? row.kind : '';
    if (
      typeof row.projectId !== 'string' ||
      typeof row.title !== 'string' ||
      typeof row.secret !== 'string' ||
      !isVaultKind(kind)
    ) {
      continue;
    }
    entries.push({
      projectId: row.projectId,
      title: row.title,
      kind,
      secret: row.secret,
      username: typeof row.username === 'string' ? row.username : undefined,
      url: typeof row.url === 'string' ? row.url : undefined,
      notes: typeof row.notes === 'string' ? row.notes : undefined,
    });
  }

  if (!entries.length) return json({ ok: false, error: 'Nessuna credenziale valida' }, 400);

  const result = importVaultEntries(entries, true);
  return json(
    {
      ok: true,
      imported: result.imported,
      updated: result.updated,
      available: result.available,
    },
    200
  );
};
