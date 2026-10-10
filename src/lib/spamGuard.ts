const MIN_FILL_MS = 3_000;
const MAX_FILL_MS = 24 * 60 * 60_000;

const ALLOWED_HOSTS = new Set(['bitora.it', 'www.bitora.it', 'localhost', '127.0.0.1']);

const SPAM_PATTERNS: RegExp[] = [
  /\bbacklinks?\b/i,
  /\bguest\s*post/i,
  /\bseo\s+(services?|agency|expert|package|optimi[sz]ation)\b/i,
  /\b(rank|ranking)\s+(your|on)\s+(website|site|google)/i,
  /\bfirst\s+page\s+(of|on)\s+google\b/i,
  /\b(crypto|bitcoin|forex|binance|casino|betting|viagra|cialis|porn|xxx|escort|loan offer)\b/i,
  /\bweb\s*traffic\b/i,
  /\bunsubscribe\b/i,
  /\b(dear|hello)\s+(sir|madam|business owner|website owner)\b/i,
  /\bwe\s+(are|can)\s+(a|an)?\s*(offshore|outsourc)/i,
  /\[url=|<a\s+href|\[link=/i,
  /\b(know|ask(ed)?\s+about|wrote\s+about)\s+(your|the)\s+(the\s+)?prices?\b/i,
  /\bquer[ií]a\s+saber\s+(tu|su)\s+precio/i,
  /\bwollte\s+(ihren|deinen)\s+preis/i,
  /\bvoulais\s+conna[iî]tre\s+votre\s+prix/i,
  /\bqueria\s+saber\s+o\s+seu\s+pre[cç]o/i,
];

const DEFAULT_BLOCKED_IP_PREFIXES = ['80.94.95.'];

const URL_PATTERN = /(https?:\/\/|www\.)\S+/gi;
const NON_LATIN =
  /[\u0400-\u04FF\u0590-\u06FF\u0E00-\u0E7F\u3040-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF]/;

const ipHits = new Map<string, number[]>();
const emailHits = new Map<string, number[]>();
let globalHits: number[] = [];

const ipDailyHits = new Map<string, number[]>();

const IP_WINDOW_MS = 10 * 60_000;
const IP_MAX = 3;
const IP_DAY_WINDOW_MS = 24 * 60 * 60_000;
const IP_DAY_MAX = 5;
const EMAIL_WINDOW_MS = 60 * 60_000;
const EMAIL_MAX = 2;
const GLOBAL_WINDOW_MS = 60 * 60_000;
const GLOBAL_MAX = 20;

export type SpamCheckInput = {
  request: Request;
  clientAddress?: string;
  timestamp?: string | number | null;
  name?: string;
  email?: string;
  phone?: string;
  texts?: Array<string | undefined>;
};

export type SpamCheckResult = {
  ok: boolean;
  ip: string;
  reason?: string;
  rateLimited?: boolean;
};

export function getClientIp(request: Request, clientAddress?: string): string {
  const realIp = request.headers.get('x-real-ip')?.trim();
  if (realIp) return realIp;
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  if (forwarded) return forwarded;
  return clientAddress || 'unknown';
}

function isBlockedIp(ip: string): boolean {
  const extra = (process.env.SPAM_BLOCKED_IPS || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  return [...DEFAULT_BLOCKED_IP_PREFIXES, ...extra].some(prefix => ip.startsWith(prefix));
}

/** Accepts Italian numbers (3xx mobile, 0x landline) and explicit international ones (+ / 00). */
export function isPlausiblePhone(phone: string): boolean {
  const compact = phone.replace(/[\s().\-/]/g, '');
  if (!/^\+?\d+$/.test(compact)) return false;
  const digits = compact.replace(/^\+/, '');
  if (digits.length < 6 || digits.length > 15) return false;
  if (compact.startsWith('+') || digits.startsWith('00')) return true;
  return /^[03]/.test(digits);
}

function hostOf(value: string | null): string | null {
  if (!value) return null;
  try {
    return new URL(value).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function isAllowedOrigin(request: Request): boolean {
  const ownHost = hostOf(request.url);
  const host = hostOf(request.headers.get('origin')) ?? hostOf(request.headers.get('referer'));
  if (!host) return false;
  return host === ownHost || ALLOWED_HOSTS.has(host);
}

function hitLimit(
  map: Map<string, number[]>,
  key: string,
  windowMs: number,
  max: number,
  now: number
): boolean {
  const recent = (map.get(key) || []).filter(t => now - t < windowMs);
  recent.push(now);
  map.set(key, recent);
  if (map.size > 5_000) {
    for (const [k, times] of map) {
      if (!times.some(t => now - t < windowMs)) map.delete(k);
    }
  }
  return recent.length > max;
}

function contentReason(name: string, texts: string[]): string | null {
  if (name.length > 80) return 'name-too-long';
  if (/https?:\/\/|www\./i.test(name)) return 'url-in-name';

  const all = [name, ...texts].join('\n');
  if (NON_LATIN.test(all)) return 'non-latin-script';

  const urls = all.match(URL_PATTERN) || [];
  if (urls.length > 2) return 'too-many-links';

  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(all)) return `pattern:${pattern.source.slice(0, 30)}`;
  }
  return null;
}

/**
 * Bot submissions get `ok: false` without `rateLimited`: callers should answer 200 so the bot
 * cannot tell it was filtered. Rate-limited submissions should get a 429.
 */
export function checkSubmission(input: SpamCheckInput): SpamCheckResult {
  const ip = getClientIp(input.request, input.clientAddress);
  const now = Date.now();

  if (isBlockedIp(ip)) return { ok: false, ip, reason: 'blocked-ip' };
  if (!isAllowedOrigin(input.request)) return { ok: false, ip, reason: 'bad-origin' };

  const ts = Number(input.timestamp);
  if (!Number.isFinite(ts) || ts <= 0) return { ok: false, ip, reason: 'missing-timestamp' };
  const elapsed = now - ts;
  if (elapsed < MIN_FILL_MS) return { ok: false, ip, reason: 'too-fast' };
  if (elapsed > MAX_FILL_MS) return { ok: false, ip, reason: 'stale-form' };

  const reason = contentReason(
    (input.name || '').trim(),
    (input.texts || []).map(t => (t || '').trim()).filter(Boolean)
  );
  if (reason) return { ok: false, ip, reason };

  const phone = (input.phone || '').trim();
  if (phone && !isPlausiblePhone(phone)) return { ok: false, ip, reason: 'bad-phone' };

  if (hitLimit(ipHits, ip, IP_WINDOW_MS, IP_MAX, now)) {
    return { ok: false, ip, reason: 'ip-rate-limit', rateLimited: true };
  }
  if (hitLimit(ipDailyHits, ip, IP_DAY_WINDOW_MS, IP_DAY_MAX, now)) {
    return { ok: false, ip, reason: 'ip-daily-limit', rateLimited: true };
  }
  const email = (input.email || '').trim().toLowerCase();
  if (email && hitLimit(emailHits, email, EMAIL_WINDOW_MS, EMAIL_MAX, now)) {
    return { ok: false, ip, reason: 'email-rate-limit', rateLimited: true };
  }
  globalHits = globalHits.filter(t => now - t < GLOBAL_WINDOW_MS);
  if (globalHits.length >= GLOBAL_MAX) {
    return { ok: false, ip, reason: 'global-rate-limit', rateLimited: true };
  }
  globalHits.push(now);

  return { ok: true, ip };
}

export function logBlocked(source: string, result: SpamCheckResult, email?: string): void {
  console.warn(
    `[spam-guard] ${source} bloccato: ${result.reason} ip=${result.ip} email=${email || '-'}`
  );
}
