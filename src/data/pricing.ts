export interface PricingPlan {
  title: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonUrl: string;
  highlighted: boolean;
  category: 'web' | 'nfc' | 'combo';
  badge?: string;
}

// Traditional Web Design Plans
export const webDesignPlans: PricingPlan[] = [
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
    category: 'web',
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
    highlighted: false,
    category: 'web',
  },
];

// NFC Ecosystem Plans
export const nfcEcosystemPlans: PricingPlan[] = [
  {
    title: 'NFC Starter',
    price: '€99',
    period: 'setup + €29/mese',
    description: 'Il tuo primo passo nell\'ecosistema digitale NFC. Perfetto per iniziare.',
    features: [
      '1 carta NFC intelligente',
      'Mini landing page personalizzata',
      'Chatbot AI integrato',
      'Analytics di base',
      'Dashboard self-service',
      'Supporto email',
    ],
    buttonText: 'Inizia con NFC',
    buttonUrl: '/contattaci?plan=NFC%20Starter',
    highlighted: false,
    category: 'nfc',
  },
  {
    title: 'NFC Professional',
    price: '€199',
    period: 'setup + €59/mese',
    description: 'Soluzione completa per business che vogliono distinguersi con l\'innovazione NFC.',
    features: [
      '3 carte NFC intelligenti',
      'Landing page settoriale avanzata',
      'AI chatbot 24/7 personalizzato',
      'Analytics avanzate',
      'Integrazioni API',
      'Gestione multi-utente',
      'Supporto prioritario',
    ],
    buttonText: 'Scegli Professional',
    buttonUrl: '/contattaci?plan=NFC%20Professional',
    highlighted: true,
    category: 'nfc',
    badge: 'Più richiesto',
  },
  {
    title: 'NFC Enterprise',
    price: 'Su misura',
    description: 'Ecosistema NFC completo per aziende che vogliono la massima personalizzazione.',
    features: [
      'Carte NFC illimitate',
      'Piattaforma brandizzata',
      'AI personalizzata per settore',
      'Dashboard analytics completa',
      'Integrazioni custom',
      'White-label disponibile',
      'Account manager dedicato',
      'SLA garantito',
    ],
    buttonText: 'Richiedi demo',
    buttonUrl: '/contattaci?plan=NFC%20Enterprise',
    highlighted: false,
    category: 'nfc',
  },
];

// Combo Plans (Web + NFC)
export const comboPlans: PricingPlan[] = [
  {
    title: 'Ecosistema Completo',
    price: '€399',
    period: 'setup + €49/mese',
    description: 'La soluzione definitiva: sito web professionale + ecosistema NFC integrato.',
    features: [
      'Sito web professionale (5-10 pagine)',
      '2 carte NFC intelligenti',
      'Landing page NFC integrata',
      'AI chatbot personalizzato',
      'Dashboard unificata',
      'Analytics complete',
      'SEO avanzato',
      'Supporto prioritario',
    ],
    buttonText: 'Soluzione Completa',
    buttonUrl: '/contattaci?plan=Ecosistema%20Completo',
    highlighted: true,
    category: 'combo',
    badge: 'Miglior valore',
  },
];

// All plans combined for backward compatibility
export const pricingPlans: PricingPlan[] = [
  ...nfcEcosystemPlans,
  ...comboPlans,
  ...webDesignPlans,
];
