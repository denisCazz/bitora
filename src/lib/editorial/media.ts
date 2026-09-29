import { randomBytes } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { env } from '../ops/env';

const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]);
const MAX_BYTES = 4 * 1024 * 1024;

export function mediaRoot(): string {
  return env('EDITORIAL_MEDIA_PATH') || '/tmp/bitora-editorial-media';
}

export function publicMediaUrl(storedName: string): string {
  return `/media/editorial/${storedName}`;
}

export function safeStoredName(name: string): string | null {
  if (!/^[a-zA-Z0-9._-]+$/.test(name)) return null;
  if (name.includes('..')) return null;
  return name;
}

function extensionFor(mime: string, filename: string): string {
  const fromName = path.extname(filename).toLowerCase();
  if (['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(fromName)) return fromName;
  if (mime === 'image/jpeg') return '.jpg';
  if (mime === 'image/png') return '.png';
  if (mime === 'image/webp') return '.webp';
  if (mime === 'image/gif') return '.gif';
  if (mime === 'image/svg+xml') return '.svg';
  return '.bin';
}

export async function storeMediaFile(file: File): Promise<{
  filename: string;
  storedName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
}> {
  const mimeType = file.type || 'application/octet-stream';
  if (!ALLOWED_MIME.has(mimeType)) {
    throw new Error('Formato file non consentito');
  }
  if (file.size > MAX_BYTES) {
    throw new Error('File troppo grande (max 4MB)');
  }
  const storedName = `${Date.now().toString(36)}-${randomBytes(8).toString('hex')}${extensionFor(mimeType, file.name)}`;
  const root = mediaRoot();
  await mkdir(root, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(root, storedName), buffer);
  return {
    filename: file.name,
    storedName,
    mimeType,
    sizeBytes: file.size,
    url: publicMediaUrl(storedName),
  };
}

export function mediaFilePath(storedName: string): string | null {
  const safe = safeStoredName(storedName);
  if (!safe) return null;
  return path.join(mediaRoot(), safe);
}
