import { pillars } from './services';

export const SITE = 'https://bitora.it';
export const ORG_ID = `${SITE}/#organization`;
export const WEBSITE_ID = `${SITE}/#website`;
export const FOUNDER_ID = `${SITE}/#founder`;

export const geo = { latitude: 44.8477, longitude: 7.6833 };

export const address = {
  '@type': 'PostalAddress',
  addressLocality: 'Carmagnola',
  addressRegion: 'TO',
  postalCode: '10022',
  addressCountry: 'IT',
};

const city = (name: string, wikidata?: string) => ({
  '@type': 'City',
  name,
  ...(wikidata ? { sameAs: `https://www.wikidata.org/wiki/${wikidata}` } : {}),
});

export const areaServed = [
  city('Carmagnola'),
  city('Torino', 'Q495'),
  city('Carignano'),
  city('Racconigi'),
  city('Villastellone'),
  city('Poirino'),
  city('Moncalieri'),
  city('Bra'),
  city('Cuneo'),
  { '@type': 'AdministrativeArea', name: 'Piemonte', sameAs: 'https://www.wikidata.org/wiki/Q1216' },
  { '@type': 'Country', name: 'Italia', sameAs: 'https://www.wikidata.org/wiki/Q38' },
];

export const knowsAbout = [
  'Sviluppo siti web',
  'Web design',
  'SEO locale',
  'E-commerce',
  'Software gestionale su misura',
  'CRM',
  'Sviluppo app iOS e Android',
  'React Native',
  'Intelligenza artificiale per aziende',
  'Automazione dei processi aziendali',
  'RAG e ricerca documentale',
  'Controllo accessi e IoT',
  'MQTT',
  'NFC',
  'Google Business Profile',
];

export const sameAs = ['https://www.instagram.com/bitorait/', 'https://www.facebook.com/people/Bitora-Italia/'];

export function organizationNode() {
  return {
    '@type': 'ProfessionalService',
    '@id': ORG_ID,
    name: 'Bitora',
    legalName: 'Bitora di Denis Cazzulo',
    alternateName: ['Bitora Italia', 'Bitora Studio Digitale'],
    slogan: 'Siti che vendono. Software che lavora per te.',
    description:
      'Bitora è lo studio digitale di Carmagnola (TO) che progetta e sviluppa siti web, e-commerce, gestionali su misura, app mobile iOS e Android, automazioni con intelligenza artificiale e soluzioni NFC per aziende del Piemonte e di tutta Italia.',
    url: `${SITE}/`,
    logo: { '@type': 'ImageObject', url: `${SITE}/bitora.png`, width: 500, height: 500 },
    image: `${SITE}/og-bitora.jpg`,
    email: 'info@bitora.it',
    telephone: '+393514979670',
    taxID: '13359170019',
    vatID: 'IT13359170019',
    foundingDate: '2020',
    founder: { '@id': FOUNDER_ID },
    address,
    geo: { '@type': 'GeoCoordinates', ...geo },
    hasMap: `https://www.google.com/maps?q=${geo.latitude},${geo.longitude}`,
    areaServed,
    knowsAbout,
    knowsLanguage: 'it',
    priceRange: '€€',
    currenciesAccepted: 'EUR',
    paymentAccepted: 'Bonifico bancario, carta di credito',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        telephone: '+393514979670',
        email: 'info@bitora.it',
        url: `${SITE}/contattaci/`,
        areaServed: 'IT',
        availableLanguage: ['it'],
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Servizi Bitora',
      itemListElement: pillars.map(p => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          '@id': `${SITE}${p.href}#service`,
          name: p.title,
          description: p.short,
          url: p.href.startsWith('http') ? p.href : `${SITE}${p.href}`,
        },
      })),
    },
    sameAs,
  };
}

export function founderNode() {
  return {
    '@type': 'Person',
    '@id': FOUNDER_ID,
    name: 'Denis Cazzulo',
    jobTitle: 'Fondatore e sviluppatore',
    worksFor: { '@id': ORG_ID },
    url: `${SITE}/chi-siamo/`,
    homeLocation: { '@type': 'Place', name: 'Carmagnola, Piemonte, Italia' },
  };
}

export function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: 'Bitora',
    url: `${SITE}/`,
    inLanguage: 'it-IT',
    publisher: { '@id': ORG_ID },
  };
}

export type PageType = 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage' | 'ItemPage' | 'FAQPage';

export function webPageNode(opts: {
  url: string;
  title: string;
  description: string;
  image: string;
  type?: PageType;
  dateModified: string;
}) {
  return {
    '@type': opts.type ?? 'WebPage',
    '@id': `${opts.url}#webpage`,
    url: opts.url,
    name: opts.title,
    description: opts.description,
    inLanguage: 'it-IT',
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    primaryImageOfPage: { '@type': 'ImageObject', url: opts.image },
    dateModified: opts.dateModified,
  };
}
