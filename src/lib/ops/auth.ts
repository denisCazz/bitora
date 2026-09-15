import crypto from 'node:crypto';
import type { AstroCookies } from 'astro';
import { env, isOpsConfigured, opsCronSecret, opsPassword, opsSessionSecret } from './env';
import { totpVersion } from './totp';

export const OPS_COOKIE = 'bitora_ops';
export const OPS_PENDING_COOKIE = 'bitora_ops_pending';
const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7;
const PENDING_MAX_AGE_SEC = 10 * 60;

export type PendingPurpose = 'otp' | 'setup';

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

function parseSigned(token: string | undefined): string | null {
  if (!token || !opsSessionSecret()) return null;
  const lastDot = token.lastIndexOf('.');
  if (lastDot <= 0) return null;
  const payload = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);
  if (!payload || !sig) return null;
  if (!timingSafeEqualString(sig, sign(payload))) return null;
  return payload;
}

export function createSessionToken(): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SEC;
  const payload = `${exp}.${totpVersion()}`;
  return `${payload}.${sign(payload)}`;
}

export function isValidSessionToken(token: string | undefined): boolean {
  const payload = parseSigned(token);
  if (!payload) return false;
  const [expRaw, versionRaw] = payload.split('.');
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp * 1000 < Date.now()) return false;
  if (versionRaw == null || !Number.isFinite(Number(versionRaw))) return false;
  return Number(versionRaw) === totpVersion();
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
  clearPendingCookie(cookies);
}

export function clearSessionCookie(cookies: AstroCookies): void {
  cookies.delete(OPS_COOKIE, { path: '/' });
  clearPendingCookie(cookies);
}

export function createPendingToken(purpose: PendingPurpose): string {
  const exp = Math.floor(Date.now() / 1000) + PENDING_MAX_AGE_SEC;
  const payload = `pending.${exp}.${purpose}`;
  return `${payload}.${sign(payload)}`;
}

export function readPendingPurpose(token: string | undefined): PendingPurpose | null {
  const payload = parseSigned(token);
  if (!payload) return null;
  const [kind, expRaw, purpose] = payload.split('.');
  if (kind !== 'pending') return null;
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp * 1000 < Date.now()) return null;
  if (purpose !== 'otp' && purpose !== 'setup') return null;
  return purpose;
}

export function getPendingPurpose(cookies: AstroCookies): PendingPurpose | null {
  return readPendingPurpose(cookies.get(OPS_PENDING_COOKIE)?.value);
}

export function setPendingCookie(cookies: AstroCookies, purpose: PendingPurpose, secure: boolean): void {
  cookies.set(OPS_PENDING_COOKIE, createPendingToken(purpose), {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: PENDING_MAX_AGE_SEC,
  });
}

export function clearPendingCookie(cookies: AstroCookies): void {
  cookies.delete(OPS_PENDING_COOKIE, { path: '/' });
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
