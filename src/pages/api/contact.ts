import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import crypto from 'node:crypto';
import { renderAdminEmail } from '../../emails/adminNotification';
import { renderCustomerReplyEmail } from '../../emails/customerReply';

export const prerender = false;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

function pick(data: FormData, key: string): string {
  return ((data.get(key) as string) || '').trim();
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ip = clientAddress || request.headers.get('x-forwarded-for') || 'unknown';

  if (isRateLimited(ip)) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Troppi tentativi. Riprova tra un minuto.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const apiKey = import.meta.env.RESEND_API_KEY ?? process.env.RESEND_API_KEY;
  const mailFrom = import.meta.env.MAIL_FROM ?? process.env.MAIL_FROM;
  const mailTo = import.meta.env.MAIL_TO ?? process.env.MAIL_TO;
  const mailCc = import.meta.env.MAIL_CC ?? process.env.MAIL_CC;

  if (!apiKey || !mailFrom || !mailTo) {
    return new Response(JSON.stringify({ ok: false, error: 'Configurazione email incompleta' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const data = await request.formData();

    const honeypot = pick(data, '_gotcha');
    if (honeypot) {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const nome = pick(data, 'nome');
    const email = pick(data, 'email');
    const telefono = pick(data, 'telefono');
    const argomento = pick(data, 'argomento');
    const messaggio = pick(data, 'messaggio');
    const formType = pick(data, 'form_type') || 'contact';
    const azienda = pick(data, 'azienda');
    const ruolo = pick(data, 'ruolo');
    const tecnici = pick(data, 'tecnici');
    const interventiMensili = pick(data, 'interventi_mensili');
    const strumentiAttuali = pick(data, 'strumenti_attuali');
    const esigenza = pick(data, 'esigenza');
    const landingPage = pick(data, 'landing_page');
    const referrer = pick(data, 'referrer');
    const utmSource = pick(data, 'utm_source');
    const utmMedium = pick(data, 'utm_medium');
    const utmCampaign = pick(data, 'utm_campaign');
    const utmContent = pick(data, 'utm_content');
    const utmTerm = pick(data, 'utm_term');
    const gclid = pick(data, 'gclid');
    const fbclid = pick(data, 'fbclid');

    if (!nome || !email || !messaggio) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Nome, email e messaggio sono obbligatori' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (formType === 'demo') {
      if (!azienda || !telefono || !ruolo || !tecnici || !interventiMensili || !strumentiAttuali || !esigenza) {
        return new Response(
          JSON.stringify({ ok: false, error: 'Compila tutti i campi obbligatori della demo' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    if (!isValidEmail(email)) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Inserisci un indirizzo email valido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const resend = new Resend(apiKey);
    const argomentoClean = argomento || (formType === 'demo' ? 'demo-gestione-interventi' : '');
    const subjectPrefix = formType === 'demo' ? '[Bitora Demo]' : '[Bitora]';
    const subject = `${subjectPrefix} Contatto da ${escapeHtml(nome)}${argomentoClean ? ` - ${escapeHtml(argomentoClean)}` : ''}`;

    const minuteBucket = Math.floor(Date.now() / 60_000);
    const idempotencyKey = crypto
      .createHash('sha256')
      .update(`${email}|${minuteBucket}|${nome}|${argomentoClean}|${formType}`.toLowerCase())
      .digest('hex');

    const siteUrl = 'https://www.bitora.it';

    const adminHtml = renderAdminEmail({
      nome,
      email,
      telefono,
      argomento: argomentoClean,
      messaggio,
      siteUrl,
      ip: typeof ip === 'string' ? ip : String(ip),
      formType,
      azienda,
      ruolo,
      tecnici,
      interventiMensili,
      strumentiAttuali,
      esigenza,
      landingPage,
      referrer,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
      gclid,
      fbclid,
    });

    const customerHtml = renderCustomerReplyEmail({
      nome,
      email,
      argomento: argomentoClean,
      messaggio,
      siteUrl,
    });

    await Promise.all([
      resend.emails.send({
        from: mailFrom,
        to: mailTo,
        cc: mailCc || undefined,
        replyTo: email,
        subject,
        html: adminHtml,
        headers: { 'Idempotency-Key': idempotencyKey },
      }),
      resend.emails.send({
        from: mailFrom,
        to: email,
        replyTo: mailTo,
        subject:
          formType === 'demo'
            ? 'Bitora · Richiesta demo ricevuta'
            : 'Bitora · Abbiamo ricevuto la tua richiesta',
        html: customerHtml,
        headers: { 'Idempotency-Key': `${idempotencyKey}-reply` },
      }),
    ]);

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Errore invio email:', err);
    return new Response(
      JSON.stringify({ ok: false, error: "Errore durante l'invio del messaggio" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
