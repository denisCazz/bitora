export const prerender = false;

import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import { mediaFilePath, safeStoredName } from '../../../lib/editorial/media';

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

export const GET: APIRoute = async ({ params }) => {
  const name = safeStoredName(params.name ?? '');
  if (!name) return new Response('Not found', { status: 404 });
  const filePath = mediaFilePath(name);
  if (!filePath) return new Response('Not found', { status: 404 });
  try {
    const data = await readFile(filePath);
    const ext = name.slice(name.lastIndexOf('.')).toLowerCase();
    return new Response(data, {
      headers: {
        'Content-Type': MIME[ext] || 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
};
