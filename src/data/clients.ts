export type PartnerTier = 'premium' | 'gold';

export interface ClientLogo {
  name: string;
  logo: string;
  tier: PartnerTier;
  url?: string;
  location?: string;
}

export const clientLogos: ClientLogo[] = [
  {
    name: 'Tropini Service',
    logo: '/logo_tropini.png',
    tier: 'premium',
    location: 'Cavallermaggiore',
  },
  {
    name: 'Mistral Impianti',
    logo: '/mistral.jpg',
    tier: 'premium',
    url: 'https://mistralimpianti.it',
    location: 'Roreto di Cherasco',
  },
  {
    name: 'RicambiXStufe',
    logo: '/logo_eva.png',
    tier: 'premium',
    url: 'https://ricambixstufe.it',
    location: 'Italia',
  },
  {
    name: 'Sartoria Kristina',
    logo: '/sartoria_kristina.png',
    tier: 'premium',
    url: 'https://sartoriakristina.it',
    location: 'Carmagnola',
  },
  {
    name: 'Sergio Contegiacomo',
    logo: '/logo_sergio.png',
    tier: 'premium',
    url: 'https://sergiocontegiacomo.it',
    location: 'Bra',
  },
  {
    name: 'Simone Contegiacomo',
    logo: '/simone.jpg',
    tier: 'premium',
    url: 'https://simonecontegiacomo.it',
    location: 'Bra',
  },
  {
    name: 'Bar Tabacchi Chantilly',
    logo: '/chanty.JPG',
    tier: 'gold',
    url: 'https://www.bartabacchichantilly.it',
    location: 'Carmagnola',
  },
  {
    name: 'Speedy Pizza',
    logo: 'https://www.speedy-pizza.it/logo.jpeg',
    tier: 'gold',
    url: 'https://www.speedy-pizza.it',
    location: 'Carmagnola',
  },
  {
    name: 'Barbara Toffano',
    logo: '/btoffano.jpg',
    tier: 'gold',
    url: 'https://barbaratoffano.it',
    location: 'Piemonte',
  },
  {
    name: 'Agriturismo La Natura',
    logo: '/logo_natura.png',
    tier: 'gold',
    url: 'https://lanaturasavigliano.it',
    location: 'Savigliano',
  },
  {
    name: 'Bar Wine Café',
    logo: '/wine.png',
    tier: 'gold',
    location: 'Carmagnola',
  },
];
