export type MonitorGroup = 'infrastruttura' | 'clienti';

export interface MonitoredSite {
  id: string;
  name: string;
  url: string;
  group: MonitorGroup;
  /** HTTP status codes considered healthy. */
  okStatuses?: number[];
}

export const DEFAULT_OK_STATUSES = [200, 201, 204, 301, 302, 303, 307, 308];

export const monitoredSites: MonitoredSite[] = [
  {
    id: 'bitora',
    name: 'Bitora',
    url: 'https://bitora.it/',
    group: 'infrastruttura',
  },
  {
    id: 'umami',
    name: 'Umami Analytics',
    url: 'https://umami.bitora.it/',
    group: 'infrastruttura',
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
  },
  {
    id: 'mistral',
    name: 'Mistral Impianti',
    url: 'https://mistralimpianti.it/',
    group: 'clienti',
  },
  {
    id: 'ricambixstufe',
    name: 'RicambiXStufe',
    url: 'https://ricambixstufe.it/',
    group: 'clienti',
  },
  {
    id: 'sartoria-kristina',
    name: 'Sartoria Kristina',
    url: 'https://sartoriakristina.it/',
    group: 'clienti',
  },
  {
    id: 'sergio-contegiacomo',
    name: 'Sergio Contegiacomo',
    url: 'https://sergiocontegiacomo.it/',
    group: 'clienti',
  },
  {
    id: 'simone-contegiacomo',
    name: 'Simone Contegiacomo',
    url: 'https://simonecontegiacomo.it/',
    group: 'clienti',
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
  },
  {
    id: 'la-natura',
    name: 'Agriturismo La Natura',
    url: 'https://lanaturasavigliano.it/',
    group: 'clienti',
  },
];
