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

// Updated Web Design Plans
export const webDesignPlans: PricingPlan[] = [
  {
    title: 'Sito Essenziale',
    price: '€20',
    period: 'mese',
    description:
      '🚀 Presenza digitale professionale che converte visitatori in clienti. Perfetto per iniziare a crescere online in Piemonte.',
    features: [
      'Fino a 5 pagine ottimizzate',
      'Design responsive mobile-first',
      'Dominio .it personalizzato',
      'Hosting veloce e sicuro incluso',
      'SEO ottimizzato per ricerche locali',
      'Certificato SSL e backup automatici',
      'Supporto dedicato via email',
    ],
    benefits: [
      'Aumenta la credibilità del tuo business',
      'Attrai nuovi clienti 24/7',
      'Risultati misurabili con analytics inclusi'
    ],
    useCases: [
      'Piccole imprese locali',
      'Professionisti e freelance',
      'Attività commerciali in Piemonte'
    ],
    roi: 'ROI medio: 300% in 6 mesi',
    buttonText: 'Inizia ora',
    buttonUrl: '/contattaci?plan=WebEssenziale',
    highlighted: false,
    category: 'web',
  },
  {
    title: 'Sito Business',
    price: '€49',
    period: 'mese',
    description: '� Soluzione completa per aziende che vogliono dominare online. E-commerce, automazioni e lead generation.',
    features: [
      'Pagine illimitate + blog integrato',
      'E-commerce con pagamenti Stripe/PayPal',
      'Sistema prenotazioni/appuntamenti',
      'Integrazione CRM e email marketing',
      'SEO avanzato + Google Ads',
      'Analytics e reportistica dettagliata',
      'Supporto prioritario e consulenza',
    ],
    benefits: [
      'Vendi online H24 senza limitazioni',
      'Automatizza acquisizione clienti',
      'Domina i risultati di ricerca locali'
    ],
    useCases: [
      'E-commerce e negozi online',
      'Aziende con servizi complessi',
      'Attività con team commerciale'
    ],
    roi: 'ROI medio: 400% primi 12 mesi',
    buttonText: 'Potenzia il business',
    buttonUrl: '/contattaci?plan=WebBusiness',
    highlighted: true,
    category: 'web',
  },
  {
    title: 'Sito Premium',
    price: 'Su misura',
    description: '💎 Soluzione enterprise completamente personalizzata. Design unico, funzioni avanzate, supporto dedicato.',
    features: [
      'Design 100% su misura per il brand',
      'Funzionalità custom sviluppate ad hoc',
      'Integrazioni API avanzate',
      'Sistema multi-utente e permessi',
      'Backup e sicurezza enterprise',
      'Consulenza strategica digitale',
      'Account manager dedicato',
    ],
    benefits: [
      'Distinguiti completamente dalla concorrenza',
      'Funzionalità uniche per il tuo settore',
      'Crescita digitale strategica assistita'
    ],
    useCases: [
      'Grandi aziende e franchising',
      'Portali complessi multi-utente',
      'Progetti con esigenze specifiche'
    ],
    roi: 'ROI personalizzato basato su obiettivi',
    buttonText: 'Richiedi preventivo',
    buttonUrl: '/contattaci?plan=WebPremium',
    highlighted: false,
    category: 'web',
  },
];



// NFC Ecosystem Plans
export const nfcEcosystemPlans: PricingPlan[] = [
  {
    title: 'NFC Start',
    price: '€49',
    description: '⚡ Inizia subito con l\'ecosistema NFC. Una tessera intelligente che apre un mondo di possibilità.',
    features: [
      '1 tessera NFC personalizzata premium',
      'Mini landing page mobile-optimized',
      'Setup completo in 24h',
      'Dashboard semplice e intuitiva',
      'QR code di backup incluso',
      'Supporto email per configurazione',
    ],
    benefits: [
      'Wow effect garantito sui clienti',
      'Setup rapido e senza complicazioni',
      'Prima impressione digitale professionale'
    ],
    useCases: [
      'Biglietti da visita intelligenti',
      'Menu base per bar e locali',
      'Info point per piccole attività'
    ],
    roi: 'Si ripaga con 3-5 nuovi contatti',
    buttonText: 'Inizia con NFC',
    buttonUrl: '/contattaci?plan=NFCStart',
    highlighted: false,
    category: 'nfc',
  },
  {
    title: 'NFC Pro',
    price: '€29',
    period: 'mese',
    description: '🚀 Ecosistema NFC completo con automazioni AI. Il futuro del customer engagement è qui.',
    features: [
      '3 tessere NFC personalizzate incluse',
      'Landing dinamiche con chatbot AI',
      'Sistema prenotazioni integrato',
      'Raccolta recensioni automatica',
      'Analytics avanzate e reportistica',
      'Integrazioni social e WhatsApp',
      'Supporto prioritario specializzato',
    ],
    benefits: [
      'Automatizza acquisizione clienti',
      'Incrementa recensioni e rating',
      'Dati e insights per crescere'
    ],
    useCases: [
      'Ristoranti e locali',
      'Hotel e strutture ricettive',
      'Professionisti con clientela'
    ],
    roi: 'ROI medio: +35% fatturato in 6 mesi',
    buttonText: 'Attiva NFC Pro',
    buttonUrl: '/contattaci?plan=NFCPro',
    highlighted: true,
    category: 'nfc',
  },
  {
    title: 'NFC Business',
    price: 'Su misura',
    description: '💎 Soluzione NFC enterprise su misura. Integrazioni avanzate, multi-location, dashboard personalizzata.',
    features: [
      'Tessere NFC illimitate',
      'Integrazioni ERP/CRM custom',
      'Multi-location e multi-utente',
      'Branding completo white-label',
      'API custom per sviluppatori',
      'Training team e consulenza',
      'Account manager dedicato',
    ],
    benefits: [
      'Soluzione scalabile per growth',
      'Integrazione perfetta con sistemi esistenti',
      'Controllo totale dell\'esperienza'
    ],
    useCases: [
      'Catene e franchising',
      'Grandi eventi e fiere',
      'Aziende con esigenze specifiche'
    ],
    roi: 'ROI personalizzato su KPI aziendali',
    buttonText: 'Richiedi demo',
    buttonUrl: '/contattaci?plan=NFCBusiness',
    highlighted: false,
    category: 'nfc',
  },
];

// Combo Plans (Web + NFC)
export const comboPlans: PricingPlan[] = [
  {
    title: 'Combo Start',
    price: '€39',
    period: 'mese',
    description: '🔥 La combinazione vincente: sito web + NFC in un unico pacchetto conveniente.',
    features: [
      'Sito web essenziale 5 pagine',
      '1 tessera NFC personalizzata',
      'Integrazione automatica web-NFC',
      'Dashboard unificata',
      'SEO locale ottimizzato',
      'Analytics cross-platform',
      'Supporto prioritario',
    ],
    benefits: [
      'Risparmi €10/mese vs piani separati',
      'Esperienza cliente omnichannel',
      'Gestione semplificata in unica dashboard'
    ],
    useCases: [
      'Piccole attività locali',
      'Professionisti innovativi',
      'Negozi con presenza online e offline'
    ],
    roi: 'ROI combinato: +40% vs singole soluzioni',
    buttonText: 'Attiva Combo',
    buttonUrl: '/contattaci?plan=ComboStart',
    highlighted: false,
    category: 'combo',
  },
  {
    title: 'Combo Pro',
    price: '€59',
    period: 'mese',
    description: '💎 Il massimo dell\'innovazione: sito business + ecosistema NFC completo.',
    features: [
      'Sito web business completo',
      '3 tessere NFC personalizzate',
      'E-commerce integrato con NFC',
      'Chatbot AI unificato',
      'Sistema prenotazioni cross-channel',
      'Automazioni marketing avanzate',
      'Account manager dedicato',
    ],
    benefits: [
      'Risparmi €120/anno vs piani separati',
      'Massima efficacia: online + offline',
      'Automazioni che lavorano 24/7'
    ],
    useCases: [
      'Ristoranti e hotel',
      'Aziende innovative',
      'Attività con alto volume clienti'
    ],
    roi: 'ROI documentato: +50% fatturato in 12 mesi',
    buttonText: 'Scegli Pro - Più richiesto',
    buttonUrl: '/contattaci?plan=ComboPro',
    highlighted: true,
    category: 'combo',
    badge: 'Più conveniente',
  },
];

// Single NFC Cards (Products)
export const nfcSingleCardPlans: PricingPlan[] = [
  {
    title: 'Tessera NFC Basic',
    price: '€15',
    description: '🎯 Tessera NFC semplice ma efficace. Design essenziale per iniziare subito la rivoluzione digitale.',
    features: [
      'Tessera NFC personalizzata con logo',
      'Design essenziale professionale',
      'Chip NFC di qualità premium',
      'Resistente ad acqua e urti',
      'Compatibile con tutti i dispositivi',
      'Setup rapido in 24h',
    ],
    benefits: [
      'Soluzione economica per testare NFC',
      'Perfetta per eventi e networking',
      'Prima impressione professionale'
    ],
    useCases: [
      'Biglietti da visita digitali',
      'Menu semplici per bar',
      'Collegamenti rapidi ai social'
    ],
    roi: 'Investimento minimo, impatto massimo',
    buttonText: 'Ordina tessera',
    buttonUrl: '/shop?product=nfc-basic',
    highlighted: false,
    category: 'nfc',
  },
  {
    title: 'Tessera NFC Custom',
    price: 'Da €20',
    description: '✨ Tessere NFC con grafica personalizzata. Design su misura che riflette perfettamente il tuo brand.',
    features: [
      'Design grafico completamente personalizzato',
      'Colori e stile coordinati al brand',
      'Logo e informazioni in alta risoluzione',
      'Materiali premium di lunga durata',
      'Chip NFC ultima generazione',
      'Sconti su quantità (5+ tessere)',
    ],
    benefits: [
      'Design unico che rappresenta il brand',
      'Qualità premium per durare nel tempo',
      'Sconti vantaggiosi per quantità'
    ],
    useCases: [
      'Menu digitali per ristoranti',
      'Cataloghi prodotti per negozi',
      'Presentazioni aziendali innovative'
    ],
    roi: 'Si ammortizza in 2-3 mesi vs stampa tradizionale',
    buttonText: 'Personalizza tessere',
    buttonUrl: '/shop?product=nfc-custom',
    highlighted: true,
    category: 'nfc',
    badge: 'Personalizzabile',
  },
];

// All plans combined for backward compatibility
export const pricingPlans: PricingPlan[] = [
  ...nfcSingleCardPlans,
  ...nfcEcosystemPlans,
  ...comboPlans,
  ...webDesignPlans,
];
