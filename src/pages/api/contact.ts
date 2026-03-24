import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

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

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ip = clientAddress || request.headers.get('x-forwarded-for') || 'unknown';

  if (isRateLimited(ip)) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Troppi tentativi. Riprova tra un minuto.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const host = import.meta.env.SMTP_HOST ?? process.env.SMTP_HOST;
  const port = Number(import.meta.env.SMTP_PORT ?? process.env.SMTP_PORT) || 587;
  const user = import.meta.env.SMTP_USER ?? process.env.SMTP_USER;
  const pass = import.meta.env.SMTP_PASS ?? process.env.SMTP_PASS;
  const from = import.meta.env.SMTP_FROM ?? process.env.SMTP_FROM;

  if (!host || !user || !pass || !from) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Configurazione SMTP incompleta' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const data = await request.formData();

    const honeypot = (data.get('_gotcha') as string)?.trim() || '';
    if (honeypot) {
      return new Response(
        JSON.stringify({ ok: true }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const nome = (data.get('nome') as string)?.trim() || '';
    const email = (data.get('email') as string)?.trim() || '';
    const telefono = (data.get('telefono') as string)?.trim() || '';
    const argomento = (data.get('argomento') as string)?.trim() || '';
    const messaggio = (data.get('messaggio') as string)?.trim() || '';

    if (!nome || !email || !messaggio) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Nome, email e messaggio sono obbligatori' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!isValidEmail(email)) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Inserisci un indirizzo email valido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      requireTLS: port === 587,
      auth: { user, pass },
    });

    const html = `
      <h2>Nuovo messaggio da bitora.it</h2>
      <p><strong>Nome:</strong> ${escapeHtml(nome)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Telefono:</strong> ${escapeHtml(telefono || '-')}</p>
      <p><strong>Argomento:</strong> ${escapeHtml(argomento || '-')}</p>
      <p><strong>Messaggio:</strong></p>
      <p>${escapeHtml(messaggio).replace(/\n/g, '<br>')}</p>
    `;

    await transporter.sendMail({
      from,
      to: from,
      replyTo: email,
      subject: `[Bitora] Contatto da ${escapeHtml(nome)}${argomento ? ` - ${escapeHtml(argomento)}` : ''}`,
      text: `Nome: ${nome}\nEmail: ${email}\nTelefono: ${telefono || '-'}\nArgomento: ${argomento || '-'}\n\nMessaggio:\n${messaggio}`,
      html,
    });

    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Errore invio email:', err);
    return new Response(
      JSON.stringify({ ok: false, error: 'Errore durante l\'invio del messaggio' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
