import type { APIRoute } from 'astro';
import { submitBlogLead } from '../../../lib/editorial/leads';
import { checkSubmission, logBlocked } from '../../../lib/spamGuard';

export const prerender = false;

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const data = await request.formData();
  const pick = (key: string) => String(data.get(key) || '').trim();

  if (pick('_gotcha')) return json({ ok: true }, 200);

  const name = pick('name') || pick('nome');
  const email = pick('email');
  const company = pick('company') || pick('azienda');
  const message = pick('message') || pick('messaggio');

  const guard = checkSubmission({
    request,
    clientAddress,
    timestamp: pick('_ts'),
    name,
    email,
    phone: pick('phone') || pick('telefono'),
    texts: [message, company],
  });
  if (!guard.ok) {
    logBlocked('blog-lead', guard, email);
    return guard.rateLimited
      ? json({ ok: false, error: 'Troppi tentativi. Riprova più tardi.' }, 429)
      : json({ ok: true }, 200);
  }

  let answers: unknown;
  try {
    answers = pick('answers') ? JSON.parse(pick('answers')) : undefined;
  } catch {
    answers = undefined;
  }

  const result = await submitBlogLead({
    name,
    email,
    phone: pick('phone') || pick('telefono'),
    company,
    message,
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
    ip: guard.ip,
  });

  return json(result, result.ok ? 200 : 400);
};
