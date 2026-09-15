import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  createHash,
  randomBytes,
  timingSafeEqual,
} from 'node:crypto';
import { env, opsSessionSecret } from './env';
import { getOpsState, updateOpsState, type OpsTotp } from './store';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const ISSUER = 'Bitora Ops';
const PERIOD_SEC = 30;
const DIGITS = 6;
const BACKUP_COUNT = 8;

export function opsTotpSecretEnv(): string {
  return env('OPS_TOTP_SECRET').replace(/\s+/g, '').toUpperCase();
}

function emptyTotp(): OpsTotp {
  return { version: 0, backupHashes: [] };
}

function totpKey(): Buffer {
  const secret = opsSessionSecret() || 'bitora-ops-totp';
  return createHash('sha256').update(`totp:${secret}`).digest();
}

function seal(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', totpKey(), iv);
  const enc = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `v1.${iv.toString('base64url')}.${tag.toString('base64url')}.${enc.toString('base64url')}`;
}

function open(stored: string | undefined): string {
  if (!stored) return '';
  if (!stored.startsWith('v1.')) return stored;
  const parts = stored.split('.');
  if (parts.length !== 4) return '';
  try {
    const iv = Buffer.from(parts[1], 'base64url');
    const tag = Buffer.from(parts[2], 'base64url');
    const data = Buffer.from(parts[3], 'base64url');
    const decipher = createDecipheriv('aes-256-gcm', totpKey(), iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
  } catch {
    return '';
  }
}

export function toBase32(bytes: Buffer): string {
  let bits = 0;
  let value = 0;
  let out = '';
  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += ALPHABET[(value << (5 - bits)) & 31];
  return out;
}

export function fromBase32(input: string): Buffer {
  const clean = input.toUpperCase().replace(/[^A-Z2-7]/g, '');
  let bits = 0;
  let value = 0;
  const out: number[] = [];
  for (const ch of clean) {
    const idx = ALPHABET.indexOf(ch);
    if (idx < 0) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(out);
}

export function generateTotpSecret(): string {
  return toBase32(randomBytes(20));
}

export function formatTotpSecret(secret: string): string {
  return secret.replace(/(.{4})/g, '$1 ').trim();
}

function totpCounter(at = Date.now()): number {
  return Math.floor(at / 1000 / PERIOD_SEC);
}

export function generateTotp(secret: string, counter = totpCounter()): string {
  const key = fromBase32(secret);
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(counter));
  const hmac = createHmac('sha1', key).update(buf).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const bin =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);
  return String(bin % 10 ** DIGITS).padStart(DIGITS, '0');
}

function codesEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) {
    if (aBuf.length > 0) timingSafeEqual(aBuf, aBuf);
    return false;
  }
  return timingSafeEqual(aBuf, bBuf);
}

export function otpauthUrl(secret: string): string {
  const label = encodeURIComponent(ISSUER);
  const params = new URLSearchParams({
    secret,
    issuer: ISSUER,
    algorithm: 'SHA1',
    digits: String(DIGITS),
    period: String(PERIOD_SEC),
  });
  return `otpauth://totp/${label}?${params.toString()}`;
}

function hashBackup(code: string): string {
  return createHash('sha256').update(code.toLowerCase()).digest('hex');
}

export function generateBackupCodes(count = BACKUP_COUNT): string[] {
  return Array.from({ length: count }, () => {
    const hex = randomBytes(5).toString('hex');
    return `${hex.slice(0, 5)}-${hex.slice(5)}`;
  });
}

export function currentTotpSecret(): string {
  const fromEnv = opsTotpSecretEnv();
  if (fromEnv) return fromEnv;
  return open(getOpsState().totp?.secret);
}

export function isTotpEnabled(): boolean {
  return Boolean(currentTotpSecret());
}

export function totpManagedByEnv(): boolean {
  return Boolean(opsTotpSecretEnv());
}

export function totpVersion(): number {
  if (!isTotpEnabled()) return 0;
  return getOpsState().totp?.version || 1;
}

export function totpBackupRemaining(): number {
  return getOpsState().totp?.backupHashes.length ?? 0;
}

export function beginTotpEnrollment(): { secret: string; otpauth: string } {
  const secret = generateTotpSecret();
  updateOpsState(state => {
    state.totp = state.totp ?? emptyTotp();
    state.totp.pendingSecret = seal(secret);
  });
  return { secret, otpauth: otpauthUrl(secret) };
}

export function pendingEnrollmentSecret(): string {
  return open(getOpsState().totp?.pendingSecret);
}

export function confirmTotpEnrollment(code: string): boolean {
  const pending = pendingEnrollmentSecret();
  const digits = normalizeCode(code);
  if (!pending || !/^\d{6}$/.test(digits) || !verifyTotpWindow(pending, digits)) {
    return false;
  }
  const backupCodes = generateBackupCodes();
  updateOpsState(state => {
    state.totp = state.totp ?? emptyTotp();
    state.totp.secret = seal(pending);
    state.totp.pendingSecret = undefined;
    state.totp.enabledAt = Date.now();
    state.totp.version = (state.totp.version || 0) + 1;
    state.totp.backupHashes = backupCodes.map(hashBackup);
    state.totp.backupCodesOnce = backupCodes;
  });
  return true;
}

function verifyTotpWindow(secret: string, digits: string): boolean {
  const counter = totpCounter();
  const last = getOpsState().totp?.lastCounter;
  for (const delta of [-1, 0, 1]) {
    const step = counter + delta;
    if (last != null && step === last) continue;
    if (codesEqual(generateTotp(secret, step), digits)) {
      updateOpsState(state => {
        state.totp = state.totp ?? emptyTotp();
        state.totp.lastCounter = step;
      });
      return true;
    }
  }
  return false;
}

export function normalizeCode(raw: string): string {
  return raw.trim().replace(/[\s-]/g, '').toLowerCase();
}

export function consumeLoginCode(code: string): boolean {
  const secret = currentTotpSecret();
  if (!secret) return false;
  const digits = normalizeCode(code);
  if (/^\d{6}$/.test(digits)) return verifyTotpWindow(secret, digits);
  return consumeBackupCode(digits);
}

function consumeBackupCode(code: string): boolean {
  const hashed = hashBackup(code);
  const hashes = getOpsState().totp?.backupHashes ?? [];
  const match = hashes.find(item => codesEqual(item, hashed));
  if (!match) return false;
  updateOpsState(state => {
    state.totp = state.totp ?? emptyTotp();
    state.totp.backupHashes = state.totp.backupHashes.filter(item => item !== match);
  });
  return true;
}

export function takeBackupCodesOnce(): string[] {
  const codes = getOpsState().totp?.backupCodesOnce;
  if (!codes?.length) return [];
  updateOpsState(state => {
    if (state.totp) delete state.totp.backupCodesOnce;
  });
  return codes;
}

export function regenerateBackupCodes(code: string): string[] | null {
  if (!consumeLoginCode(code)) return null;
  const backupCodes = generateBackupCodes();
  updateOpsState(state => {
    state.totp = state.totp ?? emptyTotp();
    state.totp.backupHashes = backupCodes.map(hashBackup);
    state.totp.backupCodesOnce = backupCodes;
  });
  return backupCodes;
}

export function resetTotp(code: string): boolean {
  if (totpManagedByEnv()) return false;
  if (!consumeLoginCode(code)) return false;
  updateOpsState(state => {
    state.totp = {
      version: (state.totp?.version || 1) + 1,
      backupHashes: [],
    };
  });
  return true;
}
