import { pillarByCategory, pillarByTopic } from './topics';
import type { CtaVariant } from './types';

export type CtaSpec = {
  variant: CtaVariant;
  href: string;
  label: string;
  secondaryHref: string;
  secondaryLabel: string;
  magnet: string;
};

const SPECS: Record<CtaVariant, Omit<CtaSpec, 'variant' | 'magnet'>> = {
  'site-audit': {
    href: '/contattaci/?topic=sito',
    label: 'Richiedi audit sito',
    secondaryHref: '/siti-web-professionali/',
    secondaryLabel: 'Vedi siti professionali',
  },
  demo: {
    href: '/richiedi-demo/',
    label: 'Richiedi demo',
    secondaryHref: '/gestione-interventi/',
    secondaryLabel: 'Ecosistema interventi',
  },
  nfc: {
    href: '/contattaci/?topic=nfc',
    label: 'Consulenza NFC',
    secondaryHref:
      'https://shopnfc.bitora.it/?utm_source=blog&utm_medium=cta&utm_campaign=editorial',
    secondaryLabel: 'Shop NFC',
  },
  roi: {
    href: '/tools/calcolatore-roi-gestionale/',
    label: 'Calcola il ROI',
    secondaryHref: '/richiedi-demo/',
    secondaryLabel: 'Prenota una demo',
  },
  contact: {
    href: '/contattaci/',
    label: 'Parliamone',
    secondaryHref: '/lavori/',
    secondaryLabel: 'Vedi i lavori',
  },
  ecommerce: {
    href: '/contattaci/?topic=ecommerce',
    label: 'Preventivo e-commerce',
    secondaryHref: '/e-commerce/',
    secondaryLabel: 'Come lavoriamo',
  },
};

export function ctaSpec(variant: string, topic?: string, category?: string): CtaSpec {
  const pillar = topic ? pillarByTopic(topic) : category ? pillarByCategory(category) : undefined;
  const key = (variant in SPECS ? variant : (pillar?.cta ?? 'contact')) as CtaVariant;
  const base = SPECS[key];
  return {
    variant: key,
    magnet: pillar?.magnet ?? 'Brief operativo Bitora',
    ...base,
  };
}

export function ctaHrefWithArticle(href: string, slug: string): string {
  const joiner = href.includes('?') ? '&' : '?';
  if (href.startsWith('http')) return href;
  return `${href}${joiner}utm_source=blog&utm_medium=article&utm_campaign=${encodeURIComponent(slug)}`;
}
