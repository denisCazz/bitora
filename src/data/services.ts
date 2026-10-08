export type PillarId = 'siti' | 'ecommerce' | 'software' | 'app' | 'ai' | 'nfc';

export interface Pillar {
  id: PillarId;
  n: string;
  title: string;
  kicker: string;
  short: string;
  href: string;
  bullets: string[];
  icon: string;
  external?: boolean;
}

export const pillars: Pillar[] = [
  {
    id: 'siti',
    n: '01',
    title: 'Siti web',
    kicker: 'Farsi trovare e contattare',
    short: 'Siti veloci, curati e scritti per convertire. SEO locale, Google Business e WhatsApp inclusi.',
    href: '/siti-web-professionali/',
    bullets: ['Design su misura', 'SEO locale', 'Caricamento < 1s', 'Menu e prenotazioni'],
    icon: 'M3 5h18v14H3zM3 9h18M7 7h.01M10 7h.01',
  },
  {
    id: 'ecommerce',
    n: '02',
    title: 'E-commerce',
    kicker: 'Vendere online, davvero',
    short: 'Negozi B2C e B2B con catalogo, pagamenti, spedizioni e listini. Integrati con il tuo gestionale.',
    href: '/e-commerce/',
    bullets: ['Stripe e PayPal', 'Listini B2B', 'Spedizioni', 'Google Shopping'],
    icon: 'M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6M9 21h.01M18 21h.01',
  },
  {
    id: 'software',
    n: '03',
    title: 'Gestionali su misura',
    kicker: 'Basta Excel e WhatsApp sparsi',
    short: 'CRM, magazzino, preventivi, interventi, ticket e rapportini. Il software si adatta al tuo processo.',
    href: '/sistemi-aziendali/',
    bullets: ['CRM e preventivi', 'Magazzino barcode', 'Rapportini e firme', 'Ticketing'],
    icon: 'M4 5h16v4H4zM4 13h7v6H4zM15 13h5v6h-5z',
  },
  {
    id: 'app',
    n: '04',
    title: 'App mobile',
    kicker: 'Sul telefono dei tuoi clienti',
    short: 'App iOS e Android per clienti, tecnici e dipendenti. Pubblicazione sugli store inclusa.',
    href: '/app-mobile/',
    bullets: ['iOS e Android', 'Notifiche push', 'Offline', 'IoT e dispositivi'],
    icon: 'M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 18h2',
  },
  {
    id: 'ai',
    n: '05',
    title: 'AI & automazioni',
    kicker: 'Ore restituite al team',
    short: 'Assistenti AI sui tuoi documenti, preventivi automatici, lead generation e flussi che lavorano da soli.',
    href: '/intelligenza-artificiale/',
    bullets: ['Assistenti sui documenti', 'Preventivi AI', 'Lead finder', 'Automazioni email'],
    icon: 'M12 3l1.8 4.6L18.5 9l-4.7 1.4L12 15l-1.8-4.6L5.5 9l4.7-1.4zM18 15l.9 2.1L21 18l-2.1.9L18 21l-.9-2.1L15 18l2.1-.9z',
  },
  {
    id: 'nfc',
    n: '06',
    title: 'NFC & Shop NFC',
    kicker: 'Dal fisico al digitale, con un tap',
    short: 'Tessere, tag e espositori per recensioni, menu e contatti. Shop online con programmazione inclusa.',
    href: '/nfc-ecosystem/',
    bullets: ['Recensioni Google', 'Biglietti da visita', 'Tag industriali', 'Shop online'],
    icon: 'M6 8.5a6 6 0 0 1 0 7M9.5 6a10 10 0 0 1 0 12M13 3.5a14 14 0 0 1 0 17',
  },
];

export const whatsappNumber = '393514979670';
export const phoneDisplay = '+39 351 497 9670';
export const phoneHref = 'tel:+393514979670';
export const email = 'info@bitora.it';

export function whatsappLink(text: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
}
