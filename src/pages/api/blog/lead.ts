import type { APIRoute } from 'astro';
import { submitBlogLead } from '../../../lib/editorial/leads';
import { isLeadRateLimited } from '../../../lib/editorial/leads';

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ip = clientAddress || request.headers.get('x-forwarded-for') || 'unknown';
  if (isLeadRateLimited(String(ip))) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Troppi tentativi. Riprova tra un minuto.' }),
      {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const data = await request.formData();
  const pick = (key: string) => String(data.get(key) || '').trim();
  let answers: unknown;
  try {
    answers = pick('answers') ? JSON.parse(pick('answers')) : undefined;
  } catch {
    answers = undefined;
  }

  const result = await submitBlogLead({
    name: pick('name') || pick('nome'),
    email: pick('email'),
    phone: pick('phone') || pick('telefono'),
    company: pick('company') || pick('azienda'),
    message: pick('message') || pick('messaggio'),
    consent: data.get('consent') === '1' || data.get('consent') === 'on',
    articleId: pick('articleId') || undefined,
    articleSlug: pick('articleSlug') || undefined,
    cta: pick('cta') || 'contact',
    topic: pick('topic') || undefined,
    answers,
    magnet: pick('magnet') || undefined,
    landingPage: pick('landingPage') || undefined,
    referrer: request.headers.get('referer') || undefined,
    utmSource: pick('utm_source'),
    utmMedium: pick('utm_medium'),
    utmCampaign: pick('utm_campaign'),
    utmContent: pick('utm_content'),
    utmTerm: pick('utm_term'),
    gclid: pick('gclid'),
    fbclid: pick('fbclid'),
    honeypot: pick('_gotcha'),
    ip: String(ip),
  });

  return new Response(JSON.stringify(result), {
    status: result.ok ? 200 : 400,
    headers: { 'Content-Type': 'application/json' },
  });
};
