export type MonitorGroup = 'infrastruttura' | 'gestionali' | 'clienti';

export const UMAMI_ORIGIN = 'https://umami.bitora.it';

export interface MonitoredSite {
  id: string;
  name: string;
  url: string;
  group: MonitorGroup;
  /** Optional text that must be present in the response body. */
  expectedText?: string;
  /** HTTP status codes considered healthy. */
  okStatuses?: number[];
  /** Safe application endpoint checked after the public page. */
  healthUrl?: string;
  healthStatuses?: number[];
  /** Umami website UUID used by the live site, if tracking is installed. */
  umamiWebsiteId?: string;
}

export function umamiDashboardUrl(websiteId: string): string {
  return `${UMAMI_ORIGIN}/websites/${websiteId}`;
}

export const DEFAULT_OK_STATUSES = [200, 201, 204, 301, 302, 303, 307, 308];

export const monitoredSites: MonitoredSite[] = [
  {
    id: 'bitora',
    name: 'Bitora',
    url: 'https://bitora.it/',
    group: 'infrastruttura',
    expectedText: 'Bitora',
    umamiWebsiteId: 'a078fba7-a632-4f51-826e-986e1d8fa5c4',
  },
  {
    id: 'umami',
    name: 'Umami Analytics',
    url: `${UMAMI_ORIGIN}/`,
    group: 'infrastruttura',
  },
  {
    id: 'shopnfc',
    name: 'Shop NFC Bitora',
    url: 'https://shopnfc.bitora.it/',
    group: 'infrastruttura',
  },
  {
    id: 'rapportini',
    name: 'Bitora Rapportini',
    url: 'https://rapportini.bitora.it/',
    group: 'gestionali',
    healthUrl: 'https://rapportini.bitora.it/api/auth/session',
    healthStatuses: [200, 401],
  },
  {
    id: 'mistral-gestionale',
    name: 'Gestionale Mistral',
    url: 'https://mistral.bitora.it/',
    group: 'gestionali',
    healthUrl: 'https://mistral.bitora.it/api/auth/session',
    healthStatuses: [200],
  },
  {
    id: 'eva-service',
    name: 'Eva Service HD',
    url: 'https://evaservice-hd.bitora.it/',
    group: 'gestionali',
    healthUrl: 'https://evaservice-hd.bitora.it/api/auth/session',
    healthStatuses: [200],
  },
  {
    id: 'garavella-gestionale',
    name: 'Gestionale Garavella 7',
    url: 'https://gestionalegaravella7.bitora.it/',
    group: 'gestionali',
    healthUrl: 'https://gestionalegaravella7.bitora.it/api/auth/session',
    healthStatuses: [200, 401],
    umamiWebsiteId: 'dee3e962-5742-4b5d-ba76-1d2b010a7ccc',
  },
  {
    id: 'planner',
    name: 'Planner Bitora',
    url: 'https://planner.bitora.it/',
    group: 'gestionali',
    healthUrl: 'https://planner.bitora.it/api/auth/session',
    healthStatuses: [200, 401],
  },
  {
    id: 'dalina',
    name: "D'Alina",
    url: 'https://dalina.bitora.it/',
    group: 'clienti',
  },
  {
    id: 'garavella-7',
    name: 'Garavella 7',
    url: 'https://garavella7.it/',
    group: 'clienti',
    umamiWebsiteId: '82d357bd-bcd8-4112-b7bd-530affc332c4',
  },
  {
    id: 'mistral',
    name: 'Mistral Impianti',
    url: 'https://mistralimpianti.it/',
    group: 'clienti',
    umamiWebsiteId: 'c125b3b3-6ffa-4cd1-bd2d-930b7692492a',
  },
  {
    id: 'ricambixstufe',
    name: 'RicambiXStufe',
    url: 'https://ricambixstufe.it/',
    group: 'clienti',
    umamiWebsiteId: '68ffa1b9-4b3c-4f7b-9962-0e592c4e7ad9',
  },
  {
    id: 'sartoria-kristina',
    name: 'Sartoria Kristina',
    url: 'https://sartoriakristina.it/',
    group: 'clienti',
    umamiWebsiteId: '5da18896-eebf-432b-b43e-1835fdd85a03',
  },
  {
    id: 'sergio-contegiacomo',
    name: 'Sergio Contegiacomo',
    url: 'https://sergiocontegiacomo.it/',
    group: 'clienti',
    umamiWebsiteId: '3c0958d9-8d27-46ba-b14e-cc28bb7dd035',
  },
  {
    id: 'simone-contegiacomo',
    name: 'Simone Contegiacomo',
    url: 'https://simonecontegiacomo.it/',
    group: 'clienti',
    umamiWebsiteId: 'eae4a75a-7cc9-40db-8aea-3b5607006ac4',
  },
  {
    id: 'chantilly',
    name: 'Bar Tabacchi Chantilly',
    url: 'https://www.bartabacchichantilly.it/',
    group: 'clienti',
  },
  {
    id: 'speedy-pizza',
    name: 'Speedy Pizza',
    url: 'https://www.speedy-pizza.it/',
    group: 'clienti',
  },
  {
    id: 'barbara-toffano',
    name: 'Barbara Toffano',
    url: 'https://barbaratoffano.it/',
    group: 'clienti',
    umamiWebsiteId: '2aa8f361-6252-4f20-90d1-1a261ecbb260',
  },
  {
    id: 'la-natura',
    name: 'Agriturismo La Natura',
    url: 'https://lanaturasavigliano.it/',
    group: 'clienti',
    umamiWebsiteId: 'c71f00ea-ec5c-4f57-96aa-13be98c0ec70',
  },
];
