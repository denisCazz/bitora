import { Resend } from 'resend';
import crypto from 'node:crypto';
import { renderAdminEmail } from '../../emails/adminNotification';
import { renderCustomerReplyEmail } from '../../emails/customerReply';
import { getPrisma, isDatabaseConfigured } from '../db';

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 5;

export function isLeadRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export type BlogLeadInput = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  consent: boolean;
  articleId?: string;
  articleSlug?: string;
  cta: string;
  topic?: string;
  answers?: unknown;
  magnet?: string;
  landingPage?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
  fbclid?: string;
  honeypot?: string;
  ip?: string;
};

export async function submitBlogLead(
  input: BlogLeadInput
): Promise<{ ok: boolean; error?: string }> {
  if (input.honeypot) return { ok: true };
  if (!input.consent) return { ok: false, error: 'Serve il consenso privacy' };
  if (!input.name.trim() || !input.email.trim()) {
    return { ok: false, error: 'Nome e email sono obbligatori' };
  }
  if (!isValidEmail(input.email))
    return { ok: false, error: 'Inserisci un indirizzo email valido' };

  if (isDatabaseConfigured()) {
    await getPrisma().lead.create({
      data: {
        name: input.name.trim(),
        email: input.email.trim(),
        phone: input.phone?.trim() || null,
        company: input.company?.trim() || null,
        message: input.message?.trim() || null,
        consent: true,
        articleId: input.articleId || null,
        articleSlug: input.articleSlug || null,
        cta: input.cta,
        topic: input.topic || null,
        answers: input.answers ? JSON.parse(JSON.stringify(input.answers)) : undefined,
        magnet: input.magnet || null,
        landingPage: input.landingPage || null,
        referrer: input.referrer || null,
        utmSource: input.utmSource || null,
        utmMedium: input.utmMedium || null,
        utmCampaign: input.utmCampaign || null,
        utmContent: input.utmContent || null,
        utmTerm: input.utmTerm || null,
        gclid: input.gclid || null,
        fbclid: input.fbclid || null,
      },
    });
  }

  const apiKey = import.meta.env.RESEND_API_KEY ?? process.env.RESEND_API_KEY;
  const mailFrom = import.meta.env.MAIL_FROM ?? process.env.MAIL_FROM;
  const mailTo = import.meta.env.MAIL_TO ?? process.env.MAIL_TO;
  const mailCc = import.meta.env.MAIL_CC ?? process.env.MAIL_CC;
  if (!apiKey || !mailFrom || !mailTo) return { ok: true };

  const resend = new Resend(apiKey);
  const minuteBucket = Math.floor(Date.now() / 60_000);
  const idempotencyKey = crypto
    .createHash('sha256')
    .update(`${input.email}|${minuteBucket}|${input.articleSlug}|${input.cta}`.toLowerCase())
    .digest('hex');
  const messaggio = [
    input.message?.trim() || 'Richiesta dal Radar Bitora',
    input.magnet ? `Lead magnet: ${input.magnet}` : '',
    input.answers ? `Diagnostico: ${JSON.stringify(input.answers)}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const [adminResult, customerResult] = await Promise.all([
    resend.emails.send({
      from: mailFrom,
      to: mailTo,
      cc: mailCc || undefined,
      replyTo: input.email,
      subject: `[Bitora Blog] ${input.name} · ${input.cta}`,
      html: renderAdminEmail({
        nome: input.name,
        email: input.email,
        telefono: input.phone,
        argomento: input.topic || input.cta,
        messaggio,
        siteUrl: 'https://bitora.it',
        ip: input.ip,
        formType: 'blog-lead',
        azienda: input.company,
        landingPage: input.landingPage,
        referrer: input.referrer,
        utmSource: input.utmSource,
        utmMedium: input.utmMedium,
        utmCampaign: input.utmCampaign,
        utmContent: input.utmContent,
        utmTerm: input.utmTerm,
        gclid: input.gclid,
        fbclid: input.fbclid,
      }),
      headers: { 'Idempotency-Key': idempotencyKey },
    }),
    resend.emails.send({
      from: mailFrom,
      to: input.email,
      replyTo: mailTo,
      subject: 'Bitora · Abbiamo ricevuto la tua richiesta',
      html: renderCustomerReplyEmail({
        nome: input.name,
        email: input.email,
        argomento: input.topic || input.cta,
        messaggio,
        siteUrl: 'https://bitora.it',
      }),
      headers: { 'Idempotency-Key': `${idempotencyKey}-reply` },
    }),
  ]);

  if (adminResult.error) console.error('Errore notifica lead blog:', adminResult.error);
  if (customerResult.error) console.error('Errore conferma lead blog:', customerResult.error);

  return { ok: true };
}
