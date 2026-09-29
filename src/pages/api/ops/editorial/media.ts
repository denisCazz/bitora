import type { APIRoute } from 'astro';
import { getPrisma } from '../../../../lib/db';
import { storeMediaFile } from '../../../../lib/editorial/media';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  const file = form.get('file');
  const articleId = String(form.get('articleId') || '');
  if (!(file instanceof File) || !file.size) {
    return new Response(null, {
      status: 303,
      headers: {
        Location: `/ops/editoriale/articoli/${articleId}/?errore=${encodeURIComponent('File mancante')}`,
      },
    });
  }
  try {
    const stored = await storeMediaFile(file);
    await getPrisma().mediaAsset.create({
      data: {
        filename: stored.filename,
        storedName: stored.storedName,
        mimeType: stored.mimeType,
        sizeBytes: stored.sizeBytes,
        url: stored.url,
        alt: String(form.get('alt') || stored.filename),
      },
    });
    return new Response(null, {
      status: 303,
      headers: {
        Location: `/ops/editoriale/articoli/${articleId}/?ok=media&url=${encodeURIComponent(stored.url)}`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'upload fallito';
    return new Response(null, {
      status: 303,
      headers: {
        Location: `/ops/editoriale/articoli/${articleId}/?errore=${encodeURIComponent(message)}`,
      },
    });
  }
};
