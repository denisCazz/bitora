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
    name: 'Mistral Impianti',
    logo: '/mistral.jpg',
    tier: 'premium',
    url: 'https://mistralimpianti.it',
    location: 'Roreto di Cherasco'
  },
  {
    name: 'Sartoria Kristina',
    logo: '/sartoria_kristina.png',
    tier: 'premium',
    url: 'https://sartoriakristina.it',
    location: 'Carmagnola'
  },
  {
    name: 'Wine Café',
    logo: '/wine.png',
    tier: 'gold',
    url: 'https://winecafe.it',
    location: 'Carmagnola'
  },
  {
    name: 'Sergio Contegiacomo',
    logo: '/logo_sergio.png',
    tier: 'premium',
    url: 'https://sergiocontegiacomo.it',
    location: 'Bra'
  },
  {
    name: 'Bar Tabacchi Chantilly',
    logo: '/chanty.JPG',
    tier: 'gold',
    url: 'https://www.bartabacchichantilly.it',
    location: 'Carmagnola'
  },
  {
    name: 'Speedy Pizza',
    logo: 'https://www.speedy-pizza.it/logo.jpeg',
    tier: 'gold',
    url: 'https://www.speedy-pizza.it',
    location: 'Carmagnola'
  }
];
