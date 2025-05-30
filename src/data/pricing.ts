export interface PricingPlan {
  title: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonUrl: string;
  highlighted: boolean;
}

export const pricingPlans: PricingPlan[] = [
  {
    title: 'Sito Essenziale',
    price: '€20',
    period: 'mese',
    description:
      'La soluzione ideale per piccole imprese che cercano una presenza professionale online.',
    features: [
      'Fino a 5 pagine',
      'Design responsive',
      'Dominio personalizzato',
      'Hosting incluso',
      'SEO base',
      'Supporto via email',
    ],
    buttonText: 'Inizia ora',
    buttonUrl: 'https://buy.stripe.com/bIY28sfFw28M6ti289',
    highlighted: false,
  },
  {
    title: 'Sito Premium',
    price: '€500',
    description: 'Pagamento unico per un sito web sofisticato ed elegante, senza canoni mensili.',
    features: [
      'Fino a 5 pagine',
      'Design personalizzato',
      'Dominio (1° anno incluso)',
      'Hosting (1° anno incluso)',
      'SEO avanzato',
      'Assistenza prioritaria',
    ],
    buttonText: 'Scegli questo piano',
    buttonUrl: 'https://buy.stripe.com/14kbJ2fFwbJmg3S4gg',
    highlighted: true,
  },
  {
    title: 'Soluzione Business',
    price: 'Su misura',
    description: 'Per progetti complessi che richiedono funzionalità e personalizzazione avanzate.',
    features: [
      'Pagine illimitate',
      'Design esclusivo',
      'Funzionalità avanzate',
      'E-commerce opzionale',
      'Strategia SEO completa',
      'Account manager dedicato',
    ],
    buttonText: 'Richiedi preventivo',
    buttonUrl: '/contattaci?plan=Soluzione%20Business',
    highlighted: false,
  },
];
