import { getPublicCaseStudies, type CaseStudy } from './caseStudies';

export type WorkKind = 'siti' | 'ecommerce' | 'software' | 'app' | 'nfc';

export const workKindLabels: Record<WorkKind, string> = {
  siti: 'Siti web',
  ecommerce: 'E-commerce',
  software: 'Gestionali',
  app: 'App',
  nfc: 'NFC',
};

interface WorkMeta {
  shot?: string;
  mock?: 'dashboard' | 'phone' | 'access';
  og?: string;
  kinds: WorkKind[];
}

const meta: Record<string, WorkMeta> = {
  dalina: { shot: '/work/dalina.webp', kinds: ['siti'] },
  'garavella-7': { shot: '/work/garavella-7.webp', kinds: ['siti'] },
  'garavella-7-gestionale': { mock: 'dashboard', kinds: ['software'] },
  'mistral-gestionale': { mock: 'dashboard', kinds: ['software'] },
  'accessi-aziendali-franchina': { mock: 'access', og: '/og/accessi-aziendali-franchina.jpg', kinds: ['app', 'software'] },
  'tropini-service': { kinds: ['siti'] },
  'mistral-impianti': { shot: '/work/mistral-impianti.webp', kinds: ['siti', 'nfc'] },
  ricambixstufe: { shot: '/work/ricambixstufe.webp', kinds: ['ecommerce'] },
  'sergio-contegiacomo': { shot: '/work/sergio-contegiacomo.webp', kinds: ['siti', 'nfc'] },
  'simone-contegiacomo': { shot: '/work/simone-contegiacomo.webp', kinds: ['siti'] },
  'sartoria-kristina': { shot: '/work/sartoria-kristina.webp', kinds: ['siti', 'nfc'] },
  'speedy-pizza': { shot: '/work/speedy-pizza.webp', kinds: ['siti', 'nfc'] },
  'bar-chantilly': { shot: '/work/bar-chantilly.webp', kinds: ['siti', 'nfc'] },
  'agriturismo-la-natura': { shot: '/work/agriturismo-la-natura.webp', kinds: ['siti'] },
  'barbara-toffano': { kinds: ['siti', 'ecommerce'] },
};

export type WorkItem = CaseStudy & WorkMeta;

export function getWork(): WorkItem[] {
  return getPublicCaseStudies().map(cs => {
    const m = meta[cs.slug] ?? { kinds: ['siti'] };
    return { ...cs, ...m, og: m.og ?? m.shot?.replace('/work/', '/og/').replace(/\.webp$/, '.jpg') };
  });
}

export function getWorkBySlugs(slugs: string[]): WorkItem[] {
  const all = getWork();
  return slugs
    .map(s => all.find(w => w.slug === s))
    .filter((w): w is WorkItem => Boolean(w));
}

export const showcaseShots = [
  { src: '/work/garavella-7.webp', name: 'Garavella 7' },
  { src: '/work/dalina.webp', name: "D'Alina" },
  { src: '/work/mistral-impianti.webp', name: 'Mistral Impianti' },
  { src: '/work/ricambixstufe.webp', name: 'RicambiXStufe' },
  { src: '/work/sartoria-kristina.webp', name: 'Sartoria Kristina' },
  { src: '/work/agriturismo-la-natura.webp', name: 'La Natura' },
  { src: '/work/speedy-pizza.webp', name: 'Speedy Pizza' },
  { src: '/work/sergio-contegiacomo.webp', name: 'Sergio Contegiacomo' },
  { src: '/work/shopnfc.webp', name: 'Shop NFC Bitora' },
  { src: '/work/bar-chantilly.webp', name: 'Bar Chantilly' },
  { src: '/work/simone-contegiacomo.webp', name: 'Simone Contegiacomo' },
];
