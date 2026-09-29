import type { APIRoute } from 'astro';
import { changeStatus, readArticleForm, saveArticle } from '../../../../lib/editorial/mutations';
import type { ArticleStatus } from '../../../../lib/editorial/types';

export const prerender = false;

function redirect(path: string): Response {
  return new Response(null, { status: 303, headers: { Location: path } });
}

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  const action = String(form.get('action') || 'save');
  const id = String(form.get('id') || '').trim() || null;

  try {
    if (action === 'status') {
      if (!id) return redirect('/ops/editoriale/articoli/?errore=mancante');
      const to = String(form.get('status') || '') as ArticleStatus;
      const confirm = form.get('confirm') === '1';
      const updated = await changeStatus(id, to, confirm);
      return redirect(`/ops/editoriale/articoli/${updated.id}/?ok=stato`);
    }

    const input = readArticleForm(form);
    const saved = await saveArticle(id, input, String(form.get('note') || 'Modifica admin'));
    return redirect(`/ops/editoriale/articoli/${saved.id}/?ok=salvato`);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'errore';
    const target = id ? `/ops/editoriale/articoli/${id}/` : '/ops/editoriale/articoli/nuovo/';
    return redirect(`${target}?errore=${encodeURIComponent(message)}`);
  }
};
