import crypto from 'node:crypto';
import type { AstroCookies } from 'astro';
import { env, isOpsConfigured, opsCronSecret, opsPassword, opsSessionSecret } from './env';

export const OPS_COOKIE = 'bitora_ops';
const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7;

function timingSafeEqualString(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) {
    if (aBuf.length > 0) crypto.timingSafeEqual(aBuf, aBuf);
    return false;
  }
  return crypto.timingSafeEqual(aBuf, bBuf);
}

export function verifyPassword(candidate: string): boolean {
  if (!isOpsConfigured()) return false;
  return timingSafeEqualString(candidate, opsPassword());
}

export function verifyCronSecret(candidate: string): boolean {
  const secret = opsCronSecret();
  if (!secret || !candidate) return false;
  return timingSafeEqualString(candidate, secret);
}

function sign(payload: string): string {
  return crypto.createHmac('sha256', opsSessionSecret()).update(payload).digest('base64url');
}

export function createSessionToken(): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SEC;
  const payload = String(exp);
  return `${payload}.${sign(payload)}`;
}

export function isValidSessionToken(token: string | undefined): boolean {
  if (!token || !opsSessionSecret()) return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  const expected = sign(payload);
  if (!timingSafeEqualString(sig, expected)) return false;
  const exp = Number(payload);
  if (!Number.isFinite(exp) || exp * 1000 < Date.now()) return false;
  return true;
}

export function isAuthenticated(cookies: AstroCookies): boolean {
  return isValidSessionToken(cookies.get(OPS_COOKIE)?.value);
}

export function setSessionCookie(cookies: AstroCookies, secure: boolean): void {
  cookies.set(OPS_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SEC,
  });
}

export function clearSessionCookie(cookies: AstroCookies): void {
  cookies.delete(OPS_COOKIE, { path: '/' });
}

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1);
  return pathname;
}

export function isOpsRoute(pathname: string): boolean {
  const path = normalizePath(pathname);
  return (
    path === '/ops' ||
    path.startsWith('/ops/') ||
    path === '/api/ops' ||
    path.startsWith('/api/ops/')
  );
}

export function isPublicOpsPath(pathname: string): boolean {
  const path = normalizePath(pathname);
  return (
    path === '/ops/login' ||
    path === '/api/ops/login' ||
    path === '/api/ops/cron' ||
    path === '/api/ops/vps' ||
    path === '/api/ops/watchdog'
  );
}

export function safeOpsNext(raw: string | null): string {
  if (!raw) return '/ops/';
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    return '/ops/';
  }
  if (!decoded.startsWith('/ops')) return '/ops/';
  if (decoded.startsWith('//') || decoded.includes('://')) return '/ops/';
  const normalized = normalizePath(decoded);
  if (normalized === '/ops/login') return '/ops/';
  if (normalized !== '/ops' && !normalized.startsWith('/ops/')) return '/ops/';
  return decoded.endsWith('/') ? decoded : `${decoded}/`;
}

export function extractBearerToken(request: Request): string {
  const header = request.headers.get('authorization') || '';
  if (header.toLowerCase().startsWith('bearer ')) return header.slice(7).trim();
  return (request.headers.get('x-ops-token') || '').trim();
}

export function isProduction(): boolean {
  return env('NODE_ENV') === 'production' || import.meta.env.PROD;
}
