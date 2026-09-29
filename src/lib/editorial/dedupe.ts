const TRACKING_PARAMS = new Set([
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'gclid',
  'fbclid',
  'mc_cid',
  'mc_eid',
]);

export function normalizeUrl(raw: string): string | null {
  try {
    const url = new URL(raw.trim());
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    url.hash = '';
    url.hostname = url.hostname.toLowerCase().replace(/^www\./, '');
    const params = [...url.searchParams.entries()].filter(
      ([key]) => !TRACKING_PARAMS.has(key.toLowerCase())
    );
    params.sort(([a], [b]) => a.localeCompare(b));
    url.search = '';
    for (const [key, value] of params) url.searchParams.append(key, value);
    if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
      url.pathname = url.pathname.slice(0, -1);
    }
    return url.toString();
  } catch {
    return null;
  }
}

export function fingerprintUrl(raw: string): string | null {
  const normalized = normalizeUrl(raw);
  return normalized ? normalized.toLowerCase() : null;
}

export function domainFromUrl(raw: string): string | null {
  try {
    return new URL(raw).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

export function isLikelyDuplicateTitle(a: string, b: string): boolean {
  const left = tokenize(a);
  const right = tokenize(b);
  if (!left.length || !right.length) return false;
  const shared = left.filter(token => right.includes(token));
  const ratio = (2 * shared.length) / (left.length + right.length);
  return ratio >= 0.72;
}

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9àèéìòù\s]/gi, ' ')
    .split(/\s+/)
    .filter(token => token.length > 2);
}
