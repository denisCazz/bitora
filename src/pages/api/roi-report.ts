import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import crypto from 'node:crypto';
import { renderRoiReportEmail } from '../../emails/roiReport';
import { renderAdminEmail } from '../../emails/adminNotification';

export const prerender = false;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 3;

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

  const apiKey = import.meta.env.RESEND_API_KEY ?? process.env.RESEND_API_KEY;
  const mailFrom = import.meta.env.MAIL_FROM ?? process.env.MAIL_FROM;
  const mailTo = import.meta.env.MAIL_TO ?? process.env.MAIL_TO;

  if (!apiKey || !mailFrom || !mailTo) {
    return new Response(JSON.stringify({ ok: false, error: 'Configurazione email incompleta' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const honeypot = (body._gotcha as string)?.trim() || '';
    if (honeypot) {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const nome = (body.nome as string)?.trim() || '';
    const email = (body.email as string)?.trim() || '';

    if (!nome || !email) {
      return new Response(JSON.stringify({ ok: false, error: 'Nome e email sono obbligatori' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!isValidEmail(email)) {
      return new Response(JSON.stringify({ ok: false, error: 'Inserisci un indirizzo email valido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const report = {
      savedHours: String(body.savedHours ?? '—'),
      grossSaving: String(body.grossSaving ?? '—'),
      netMonthly: String(body.netMonthly ?? '—'),
      netYearly: String(body.netYearly ?? '—'),
      roiMonthly: String(body.roiMonthly ?? '—'),
      payback: String(body.payback ?? '—'),
    };

    const resend = new Resend(apiKey);
    const siteUrl = 'https://www.bitora.it';
    const minuteBucket = Math.floor(Date.now() / 60_000);
    const idempotencyKey = crypto
      .createHash('sha256')
      .update(`roi|${email}|${minuteBucket}`.toLowerCase())
      .digest('hex');

    const messaggio = `Lead magnet ROI calcolatore:
- Ore risparmiate/mese: ${report.savedHours}
- Risparmio lordo/mese: ${report.grossSaving}
- Beneficio netto/mese: ${report.netMonthly}
- Beneficio netto/anno: ${report.netYearly}
- ROI mensile: ${report.roiMonthly}
- Payback: ${report.payback}`;

    await Promise.all([
      resend.emails.send({
        from: mailFrom,
        to: email,
        replyTo: mailTo,
        subject: 'Bitora · Il tuo report ROI gestionale',
        html: renderRoiReportEmail({ nome, email, ...report, siteUrl }),
        headers: { 'Idempotency-Key': idempotencyKey },
      }),
      resend.emails.send({
        from: mailFrom,
        to: mailTo,
        replyTo: email,
        subject: `[Bitora] Lead ROI calcolatore - ${nome}`,
        html: renderAdminEmail({
          nome,
          email,
          telefono: '',
          argomento: 'lead-magnet-roi',
          messaggio,
          siteUrl,
          ip: typeof ip === 'string' ? ip : String(ip),
        }),
        headers: { 'Idempotency-Key': `${idempotencyKey}-admin` },
      }),
    ]);

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Errore invio report ROI:', err);
    return new Response(JSON.stringify({ ok: false, error: "Errore durante l'invio del report" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
