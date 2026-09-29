import type { CtaVariant, EditorialTopic } from './types';

export type TopicPillar = {
  id: EditorialTopic;
  label: string;
  category: string;
  searchQueries: string[];
  cta: CtaVariant;
  href: string;
  magnet: string;
};

export const TOPIC_PILLARS: TopicPillar[] = [
  {
    id: 'nfc',
    label: 'NFC & recensioni',
    category: 'NFC',
    searchQueries: [
      'NFC restaurant Google reviews 2026',
      'NFC business cards vs QR code hospitality',
      'near field communication retail Italy',
    ],
    cta: 'nfc',
    href: '/contattaci/?topic=nfc',
    magnet: 'Checklist tap NFC → recensione',
  },
  {
    id: 'web',
    label: 'Siti & SEO locale',
    category: 'Siti Web',
    searchQueries: [
      'local SEO small business website 2026',
      'AI website builders vs custom agency PMI',
      'Core Web Vitals local business sites',
    ],
    cta: 'site-audit',
    href: '/contattaci/?topic=sito',
    magnet: 'Audit sito in 10 punti',
  },
  {
    id: 'ai',
    label: 'AI applicata',
    category: 'AI',
    searchQueries: [
      'AI document processing field service 2026',
      'practical AI for Italian SMEs websites',
      'AI customer intake ticketing without hype',
    ],
    cta: 'contact',
    href: '/contattaci/?topic=sistemi',
    magnet: 'Mappa AI operativa PMI',
  },
  {
    id: 'crm',
    label: 'CRM',
    category: 'CRM',
    searchQueries: [
      'CRM pricing SME 2026',
      'custom CRM vs Salesforce for small teams',
      'WhatsApp CRM pipeline Italy',
    ],
    cta: 'demo',
    href: '/richiedi-demo/',
    magnet: 'Schema pipeline lead',
  },
  {
    id: 'gestionali',
    label: 'Gestionali',
    category: 'Gestionali',
    searchQueries: [
      'ERP vs custom operations software SME 2026',
      'inventory linked digital menu restaurant',
      'operations software bar restaurant Italy',
    ],
    cta: 'roi',
    href: '/tools/calcolatore-roi-gestionale/',
    magnet: 'Report ROI gestionale',
  },
  {
    id: 'ecommerce',
    label: 'E-commerce',
    category: 'E-commerce',
    searchQueries: [
      'vertical ecommerce spare parts 2026',
      'custom ecommerce vs marketplace SME Italy',
      'product finder UX technical catalog',
    ],
    cta: 'ecommerce',
    href: '/contattaci/?topic=ecommerce',
    magnet: 'Check list catalogo verticale',
  },
  {
    id: 'field',
    label: 'Field service',
    category: 'Field',
    searchQueries: [
      'field service management software technicians 2026',
      'digital work reports PDF signature Italy',
      'ticketing practices field technicians',
    ],
    cta: 'demo',
    href: '/richiedi-demo/',
    magnet: 'Demo rapportini e ticket',
  },
];

export function pillarByTopic(topic: string): TopicPillar {
  return TOPIC_PILLARS.find(p => p.id === topic) ?? TOPIC_PILLARS[1];
}

export function pillarByCategory(category: string): TopicPillar {
  return (
    TOPIC_PILLARS.find(p => p.category.toLowerCase() === category.toLowerCase()) ?? TOPIC_PILLARS[1]
  );
}

export const DEFAULT_STAGES = [
  { id: 'signal', label: 'Segnale' },
  { id: 'deep', label: 'Lettura' },
  { id: 'proof', label: 'Prove' },
  { id: 'field', label: 'Sul campo' },
  { id: 'act', label: 'Azione' },
];
