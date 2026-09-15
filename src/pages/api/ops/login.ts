import type { APIRoute } from 'astro';
import {
  getPendingPurpose,
  isProduction,
  safeOpsNext,
  clearPendingCookie,
  setPendingCookie,
  setSessionCookie,
  verifyPassword,
} from '../../../lib/ops/auth';
import { isOpsConfigured } from '../../../lib/ops/env';
import {
  beginTotpEnrollment,
  confirmTotpEnrollment,
  consumeLoginCode,
  isTotpEnabled,
} from '../../../lib/ops/totp';

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

function loginRedirect(next: string, error?: string): string {
  const params = new URLSearchParams({ next });
  if (error) params.set('errore', error);
  return `/ops/login/?${params.toString()}`;
}

export const POST: APIRoute = async ({ request, cookies, redirect, clientAddress }) => {
  const ip = clientAddress || request.headers.get('x-forwarded-for') || 'unknown';
  const data = await request.formData();
  const next = safeOpsNext(String(data.get('next') || ''));
  const action = String(data.get('action') || 'password');
  const secure = isProduction();

  if (!isOpsConfigured()) {
    return redirect(loginRedirect(next, 'config'));
  }

  if (action === 'cancel') {
    clearPendingCookie(cookies);
    return redirect(loginRedirect(next));
  }

  if (isRateLimited(String(ip))) {
    return redirect(loginRedirect(next, 'rate'));
  }

  if (action === 'otp') {
    if (getPendingPurpose(cookies) !== 'otp') {
      return redirect(loginRedirect(next, 'sessione'));
    }
    const code = String(data.get('code') || '');
    if (!consumeLoginCode(code)) {
      return redirect(loginRedirect(next, 'otp'));
    }
    setSessionCookie(cookies, secure);
    return redirect(next);
  }

  if (action === 'setup') {
    if (getPendingPurpose(cookies) !== 'setup') {
      return redirect(loginRedirect(next, 'sessione'));
    }
    const code = String(data.get('code') || '');
    if (!confirmTotpEnrollment(code)) {
      return redirect(loginRedirect(next, 'setup'));
    }
    setSessionCookie(cookies, secure);
    return redirect('/ops/sicurezza/?nuovo=1');
  }

  const password = String(data.get('password') || '');
  if (!verifyPassword(password)) {
    return redirect(loginRedirect(next, 'password'));
  }

  if (isTotpEnabled()) {
    setPendingCookie(cookies, 'otp', secure);
    return redirect(loginRedirect(next));
  }

  beginTotpEnrollment();
  setPendingCookie(cookies, 'setup', secure);
  return redirect(loginRedirect(next));
};
