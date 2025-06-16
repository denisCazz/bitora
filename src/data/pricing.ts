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
  benefits?: string[];
  useCases?: string[];
  roi?: string;
}

// Traditional Web Design Plans
export const webDesignPlans: PricingPlan[] = [
  {
    title: 'Sito Essenziale',
    price: '€20',
    period: 'mese',
    description:
      '🚀 Presenza digitale professionale che converte visitatori in clienti. Perfetto per iniziare a crescere online.',
    features: [
      'Fino a 5 pagine ottimizzate',
      'Design responsive mobile-first',
      'Dominio personalizzato professionale',
      'Hosting veloce e sicuro incluso',
      'SEO ottimizzato per Google',
      'Supporto dedicato via email',
    ],
    benefits: [
      'Aumenta la credibilità del tuo business',
      'Attira nuovi clienti 24/7',
      'Risparmia sui costi di marketing tradizionale'
    ],
    useCases: [
      'Piccole imprese locali',
      'Professionisti e freelance',
      'Startup in fase iniziale'
    ],
    roi: 'ROI medio: 300% in 6 mesi',
    buttonText: 'Inizia ora - Solo €20/mese',
    buttonUrl: 'https://buy.stripe.com/bIY28sfFw28M6ti289',
    highlighted: false,
    category: 'web',
  },
  {
    title: 'Sito Premium',
    price: '€500',
    description: '💎 Investimento una tantum per un sito web che lavora per te per anni. Nessun canone mensile, massimo impatto.',
    features: [
      'Fino a 5 pagine + landing page personalizzate',
      'Design unico su misura per il tuo brand',
      'Dominio premium (1° anno incluso)',
      'Hosting enterprise (1° anno incluso)',
      'SEO avanzato con monitoraggio performance',
      'Assistenza prioritaria e consulenza strategica',
    ],
    benefits: [
      'Distinguiti dalla concorrenza con design unico',
      'Massimizza le conversioni con UX ottimizzata',
      'Zero preoccupazioni: tutto incluso per il primo anno'
    ],
    useCases: [
      'Aziende consolidate',
      'E-commerce in crescita',
      'Servizi professionali premium'
    ],
    roi: 'Costo ammortizzato: meno di €10/mese nel primo biennio',
    buttonText: 'Investi nel tuo futuro digitale',
    buttonUrl: 'https://buy.stripe.com/14kbJ2fFwbJmg3S4gg',
    highlighted: false,
    category: 'web',
  },
];

// NFC Single Cards Plans
export const nfcSingleCardPlans: PricingPlan[] = [
  {
    title: 'Carta NFC Basic',
    price: '€15',
    description: '🎯 Carta NFC semplice ma efficace. Design essenziale per iniziare subito la rivoluzione digitale.',
    features: [
      'Carta NFC personalizzata con logo',
      'Design essenziale professionale',
      'Chip NFC di qualità premium',
      'Resistente ad acqua e urti',
      'Compatibile con tutti i dispositivi',
      'Setup rapido in 24h',
    ],
    benefits: [
      'Soluzione economica per testare la tecnologia NFC',
      'Perfetta per eventi e networking',
      'Prima impressione professionale garantita'
    ],
    useCases: [
      'Biglietti da visita digitali',
      'Menu semplici per bar',
      'Collegamenti rapidi ai social'
    ],
    roi: 'Investimento minimo, impatto massimo',
    buttonText: 'Ordina la tua carta NFC',
    buttonUrl: '/contattaci?product=nfc-basic',
    highlighted: false,
    category: 'nfc',
  },
  {
    title: 'Carte NFC Custom',
    price: 'Da €20',
    description: '✨ Carte NFC con grafica personalizzata. Design su misura che riflette perfettamente il tuo brand.',
    features: [
      'Design grafico completamente personalizzato',
      'Colori e stile coordinati al tuo brand',
      'Logo e informazioni in alta risoluzione',
      'Materiali premium di lunga durata',
      'Chip NFC ultima generazione',
      'Sconti su quantità (5+ carte)',
    ],
    benefits: [
      'Rivoluziona menu di ristoranti e bar',
      'Elimina costi di ristampa continui',
      'Aggiornamenti instant senza limiti'
    ],
    useCases: [
      'Menu digitali per ristoranti',
      'Cataloghi prodotti per negozi',
      'Presentazioni aziendali innovative',
      'Check-in automatico per hotel'
    ],
    roi: 'Ammortizza i costi in 2-3 mesi vs stampa tradizionale',
    buttonText: 'Personalizza le tue carte',
    buttonUrl: '/contattaci?product=nfc-custom',
    highlighted: true,
    category: 'nfc',
    badge: 'Personalizzabile',
  },
];

// NFC Ecosystem Plans
export const nfcEcosystemPlans: PricingPlan[] = [
  {
    title: 'NFC Starter',
    price: '€99',
    period: 'setup + €29/mese',
    description: '⚡ Entra nel futuro del business digitale. La tecnologia NFC che sorprende i clienti e ti fa ricordare.',
    features: [
      '1 carta NFC intelligente personalizzata',
      'Mini landing page mobile-optimized',
      'Chatbot AI sempre disponibile',
      'Analytics in tempo reale',
      'Dashboard intuitiva self-service',
      'Supporto specializzato NFC',
    ],
    benefits: [
      'Wow effect garantito sui clienti',
      'Genera lead qualificati istantaneamente',
      'Tracking preciso delle interazioni'
    ],
    useCases: [
      'Agenti immobiliari',
      'Consulenti e professionisti',
      'Piccoli negozi fisici'
    ],
    roi: 'Recuperi l\'investimento con soli 3 nuovi clienti',
    buttonText: 'Inizia la rivoluzione NFC',
    buttonUrl: '/contattaci?plan=NFC%20Starter',
    highlighted: false,
    category: 'nfc',
  },
  {
    title: 'NFC Professional',
    price: '€199',
    period: 'setup + €59/mese',
    description: '🏆 L\'ecosistema completo per business innovativi. Tecnologia avanzata che accelera la crescita aziendale.',
    features: [
      '3 carte NFC intelligenti multi-scenario',
      'Landing page settoriale high-converting',
      'AI chatbot 24/7 addestrato per il tuo business',
      'Analytics avanzate con insights predittivi',
      'Integrazioni API con i tuoi sistemi',
      'Gestione team multi-utente',
      'Supporto prioritario con consulenza strategica',
    ],
    benefits: [
      'Automatizza la generazione di lead',
      'Aumenta il tasso di conversione del 40%+',
      'Insights actionable per decisioni data-driven'
    ],
    useCases: [
      'Ristoranti e hotel',
      'Centri estetici e wellness',
      'Aziende B2B innovative'
    ],
    roi: 'ROI medio 250% in 12 mesi documentato',
    buttonText: 'Scelgo il Professional - ROI garantito',
    buttonUrl: '/contattaci?plan=NFC%20Professional',
    highlighted: true,
    category: 'nfc',
    badge: 'Più richiesto',
  },
  {
    title: 'NFC Enterprise',
    price: 'Su misura',
    description: '🌟 Soluzione enterprise per aziende visionarie. Ecosistema NFC white-label completamente personalizzato.',    features: [
      'Carte NFC illimitate + design custom',
      'Piattaforma brandizzata white-label',
      'AI personalizzata per settore specifico',
      'Dashboard analytics enterprise completa',
      'Integrazioni custom con qualsiasi sistema',
      'White-label completo con il tuo brand',
      'Account manager dedicato H24',
      'SLA garantito 99.9% uptime',
    ],
    benefits: [
      'Differenziazione totale dalla concorrenza',
      'Scalabilità illimitata per crescita aziendale',
      'Control room completo delle performance digitali'
    ],
    useCases: [
      'Catene e franchising',
      'Aziende multinazionali',
      'Grandi strutture ricettive'
    ],
    roi: 'ROI personalizzato: analisi gratuita pre-vendita',
    buttonText: 'Richiedi demo enterprise esclusiva',
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
    description: '🎯 La formula vincente: sito professionale + rivoluzione NFC. Il meglio di entrambi i mondi per dominare il mercato.',
    features: [
      'Sito web professionale (5-10 pagine) + SEO avanzato',
      '2 carte NFC intelligenti strategiche',
      'Landing page NFC perfettamente integrata',
      'AI chatbot trained sul tuo business',
      'Dashboard unificata web + NFC',
      'Analytics complete con cross-tracking',
      'SEO avanzato con local optimization',
      'Supporto prioritario + consulenza mensile',
    ],
    benefits: [
      'Presenza digitale completa e professionale',
      'Lead generation automatizzata 24/7',
      'Sinergia perfetta tra online e offline'
    ],
    useCases: [
      'Ristoranti moderni',
      'Hotel boutique',
      'Centri benessere premium',
      'Negozi di design'
    ],
    roi: 'ROI medio 350% in 12 mesi - Caso studio disponibile',
    buttonText: 'Soluzione Completa - Domina il mercato',
    buttonUrl: '/contattaci?plan=Ecosistema%20Completo',
    highlighted: true,
    category: 'combo',
    badge: 'Miglior valore',
  },
];

// All plans combined for backward compatibility
export const pricingPlans: PricingPlan[] = [
  ...nfcSingleCardPlans,
  ...nfcEcosystemPlans,
  ...comboPlans,
  ...webDesignPlans,
];
