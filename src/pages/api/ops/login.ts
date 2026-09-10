import type { APIRoute } from 'astro';
import { isProduction, safeOpsNext, setSessionCookie, verifyPassword } from '../../../lib/ops/auth';
import { isOpsConfigured } from '../../../lib/ops/env';

export const prerender = false;

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 15 * 60_000;
const RATE_LIMIT_MAX = 8;

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

function loginRedirect(next: string, error: string) {
  const params = new URLSearchParams({ next, errore: error });
  return `/ops/login/?${params.toString()}`;
}

export const POST: APIRoute = async ({ request, cookies, redirect, clientAddress }) => {
  const ip = clientAddress || request.headers.get('x-forwarded-for') || 'unknown';
  const data = await request.formData();
  const next = safeOpsNext(String(data.get('next') || ''));

  if (!isOpsConfigured()) {
    return redirect(loginRedirect(next, 'config'));
  }

  if (isRateLimited(String(ip))) {
    return redirect(loginRedirect(next, 'rate'));
  }

  const password = String(data.get('password') || '');
  if (!verifyPassword(password)) {
    return redirect(loginRedirect(next, 'password'));
  }

  setSessionCookie(cookies, isProduction());
  return redirect(next);
};
