import type { APIRoute } from 'astro';
import { getPrisma } from '../../../../lib/db';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  const id = String(form.get('id') || '');
  const status = String(form.get('status') || 'DISMISSED');
  if (id && (status === 'DISMISSED' || status === 'NEW' || status === 'USED')) {
    await getPrisma().trendCandidate.update({
      where: { id },
      data: { status: status as 'DISMISSED' | 'NEW' | 'USED' },
    });
  }
  return new Response(null, { status: 303, headers: { Location: '/ops/editoriale/trend/' } });
};
