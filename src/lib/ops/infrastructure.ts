import tls from 'node:tls';
import type { MonitoredSite } from '../../data/monitoredTargets';
import type { CertificateCheck, DomainCheck, OpsState } from './store';

const CERT_REFRESH_MS = 6 * 60 * 60_000;
const DOMAIN_REFRESH_MS = 24 * 60 * 60_000;

function daysUntil(timestamp: number): number {
  return Math.floor((timestamp - Date.now()) / 86_400_000);
}

function rootDomain(hostname: string): string {
  const parts = hostname.split('.');
  return parts.length > 2 ? parts.slice(-2).join('.') : hostname;
}

async function checkCertificate(targetId: string, hostname: string): Promise<CertificateCheck> {
  const checkedAt = Date.now();
  return new Promise(resolve => {
    const socket = tls.connect(
      { host: hostname, port: 443, servername: hostname, rejectUnauthorized: true, timeout: 8_000 },
      () => {
        const cert = socket.getPeerCertificate();
        const validTo = Date.parse(cert.valid_to);
        socket.end();
        resolve({
          targetId,
          hostname,
          checkedAt,
          validTo: Number.isFinite(validTo) ? validTo : undefined,
          daysRemaining: Number.isFinite(validTo) ? daysUntil(validTo) : undefined,
          issuer: cert.issuer?.O || cert.issuer?.CN,
        });
      }
    );
    socket.once('timeout', () => socket.destroy(new Error('Timeout TLS')));
    socket.once('error', error => resolve({ targetId, hostname, checkedAt, error: error.message }));
  });
}

function registrarFromRdap(data: Record<string, unknown>): string | undefined {
  const entities = Array.isArray(data.entities) ? data.entities : [];
  for (const raw of entities) {
    if (!raw || typeof raw !== 'object') continue;
    const entity = raw as Record<string, unknown>;
    if (!Array.isArray(entity.roles) || !entity.roles.includes('registrar')) continue;
    const card = entity.vcardArray;
    if (!Array.isArray(card) || !Array.isArray(card[1])) continue;
    const fn = card[1].find(
      row => Array.isArray(row) && row[0] === 'fn' && typeof row[3] === 'string'
    );
    if (Array.isArray(fn)) return fn[3] as string;
  }
  return undefined;
}

async function checkDomain(domain: string): Promise<DomainCheck> {
  const checkedAt = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);
  try {
    const response = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`, {
      signal: controller.signal,
      headers: { Accept: 'application/rdap+json' },
    });
    if (!response.ok) throw new Error(`RDAP HTTP ${response.status}`);
    const data = (await response.json()) as Record<string, unknown>;
    const events = Array.isArray(data.events) ? data.events : [];
    const expiry = events.find(event => {
      if (!event || typeof event !== 'object') return false;
      const action = (event as Record<string, unknown>).eventAction;
      return action === 'expiration' || action === 'expiry';
    }) as Record<string, unknown> | undefined;
    const expiresAt =
      typeof expiry?.eventDate === 'string' ? Date.parse(expiry.eventDate) : Number.NaN;
    return {
      domain,
      checkedAt,
      expiresAt: Number.isFinite(expiresAt) ? expiresAt : undefined,
      daysRemaining: Number.isFinite(expiresAt) ? daysUntil(expiresAt) : undefined,
      registrar: registrarFromRdap(data),
    };
  } catch (error) {
    return {
      domain,
      checkedAt,
      error: error instanceof Error ? error.message : 'Errore RDAP',
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function refreshInfrastructure(
  targets: MonitoredSite[],
  previous: OpsState
): Promise<{
  certificates: Record<string, CertificateCheck>;
  domains: Record<string, DomainCheck>;
}> {
  const now = Date.now();
  const certificates = { ...previous.certificates };
  const domains = { ...previous.domains };
  const httpsTargets = targets.filter(target => {
    try {
      return new URL(target.url).protocol === 'https:';
    } catch {
      return false;
    }
  });

  await Promise.all(
    httpsTargets.map(async target => {
      const hostname = new URL(target.url).hostname;
      const cached = certificates[target.id];
      if (cached && now - cached.checkedAt < CERT_REFRESH_MS) return;
      certificates[target.id] = await checkCertificate(target.id, hostname);
    })
  );

  const uniqueDomains = [
    ...new Set(httpsTargets.map(target => rootDomain(new URL(target.url).hostname))),
  ];
  await Promise.all(
    uniqueDomains.map(async domain => {
      const cached = domains[domain];
      if (cached && now - cached.checkedAt < DOMAIN_REFRESH_MS) return;
      domains[domain] = await checkDomain(domain);
    })
  );

  const activeTargetIds = new Set(httpsTargets.map(target => target.id));
  for (const key of Object.keys(certificates)) {
    if (!activeTargetIds.has(key)) delete certificates[key];
  }
  const activeDomains = new Set(uniqueDomains);
  for (const key of Object.keys(domains)) {
    if (!activeDomains.has(key)) delete domains[key];
  }

  return { certificates, domains };
}
