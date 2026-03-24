export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  location: string;
  imageUrl: string;
  siteUrl: string;
  featured: boolean;
  isWip?: boolean;

  // Dettagli completi
  clientDescription: string;
  problema: string;
  soluzione: {
    titolo: string;
    descrizione: string;
  }[];
  risultati: string[];
  tecnologie: string[];

  // Metriche per la card preview
  metricsPreview: string[];

  // Citazioni/fonti
  fonti?: {
    testo: string;
    url: string;
  }[];
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'mistral-impianti',
    slug: 'mistral-impianti',
    title: 'Mistral Impianti',
    subtitle: 'Digitalizzazione & NFC',
    category: 'B2B • Impianti',
    location: 'Roreto di Cherasco (CN)',
    imageUrl: '/mistral.jpg',
    siteUrl: 'https://mistralimpianti.it',
    featured: true,
    isWip: false,

    clientDescription: `Mistral Impianti S.R.L. è un'azienda piemontese che opera nel settore dell'impiantistica tecnologica e speciale da oltre trent'anni. La società è nata nel 1988 e nel tempo si è concentrata sulla progettazione, installazione e manutenzione di impianti elettrici, speciali e antincendio. Oggi conta un organico di circa 18 tecnici e programmatori specializzati, è certificata ISO 9001 e vanta una storica partnership con Siemens. La lunga esperienza, la competenza artigiana e l'orientamento al problem solving sono considerati i suoi punti di forza.`,

    problema: `Prima della collaborazione con Bitora, Mistral Impianti non aveva un sito moderno né strumenti rapidi per condividere contatti e informazioni. La comunicazione online non rendeva giustizia a un'azienda che lavora con standard elevati da oltre trent'anni.`,

    soluzione: [
      {
        titolo: 'Sito vetrina professionale',
        descrizione:
          "Bitora ha progettato un nuovo sito web che mette in risalto la storia, i valori e i servizi dell'azienda. Il sito è realizzato con tecnologie moderne (Astro, Vercel) e ottimizzato per i motori di ricerca locali.",
      },
      {
        titolo: 'Tessere NFC per contatti e presentazioni',
        descrizione:
          'Sono state create tessere NFC personalizzate con logo e colori aziendali. Al semplice tap, il cliente o il partner apre automaticamente la pagina dei contatti di Mistral Impianti, semplificando la raccolta di richieste.',
      },
    ],

    risultati: [
      "Presenza digitale che riflette l'affidabilità e la qualità artigiana dell'azienda",
      'Reputazione online rafforzata grazie alla visibilità di esperienza e certificazioni',
      'Tessere NFC che facilitano la condivisione dei contatti durante fiere e sopralluoghi',
      'Efficienza commerciale migliorata',
    ],

    tecnologie: [
      'Astro',
      'Vercel',
      'Tessere NFC personalizzate',
      'SEO locale',
      'Copywriting professionale',
    ],

    metricsPreview: ['+25% Richieste qualificate', 'Top 5 Ranking locale'],

    fonti: [{ testo: 'Sito ufficiale Mistral Impianti', url: 'https://mistralimpianti.it' }],
  },

  {
    id: 'wine-cafe',
    slug: 'wine-cafe',
    title: 'Bar Wine Café',
    subtitle: 'Sito in manutenzione',
    category: 'Food & Beverage',
    location: 'Carmagnola (TO)',
    imageUrl: '/wine.png',
    siteUrl: 'https://barwinecafe.it',
    featured: true,
    isWip: false,

    clientDescription: `Bar Wine Café è un locale di Carmagnola con proposta bar e aperitivi. In questa fase il progetto web resta online in forma ridotta, con il dominio presidiato e una comunicazione chiara verso i visitatori.`,

    problema: `Al momento il progetto non è attivo come in precedenza e non ha senso mantenere un sito completo. Serviva quindi una soluzione semplice: tenere il dominio corretto online e comunicare chiaramente che il sito è in manutenzione.`,

    soluzione: [
      {
        titolo: 'Pagina di manutenzione',
        descrizione:
          "Il progetto viene gestito con una presenza essenziale che informa subito l'utente sullo stato attuale del sito.",
      },
      {
        titolo: 'Dominio aggiornato e presidiato',
        descrizione:
          'Il riferimento corretto diventa `barwinecafe.it`, così il brand mantiene una presenza ordinata e facilmente recuperabile in futuro.',
      },
    ],

    risultati: [
      'Comunicazione immediata dello stato di manutenzione',
      'Dominio corretto mantenuto online',
      'Presenza digitale pulita, senza contenuti non aggiornati',
    ],

    tecnologie: ['Astro', 'Vercel', 'Pagina manutenzione', 'Presidio dominio'],

    metricsPreview: ['Sito in manutenzione', 'Dominio presidiato'],

    fonti: [
      { testo: 'Corriere di Carmagnola', url: 'https://corrieredicarmagnola.it' },
      { testo: 'Pagine Gialle', url: 'https://paginegialle.it' },
    ],
  },

  {
    id: 'sergio-contegiacomo',
    slug: 'sergio-contegiacomo',
    title: 'Sergio Contegiacomo',
    subtitle: 'Personal Brand & NFC',
    category: 'Finance • Consulenza',
    location: 'Bra (CN)',
    imageUrl: '/logo_sergio.png',
    siteUrl: 'https://sergiocontegiacomo.it',
    featured: true,
    isWip: false,

    clientDescription: `Sergio Contegiacomo è un consulente patrimoniale affiliato ad Allianz Bank e opera nel settore dal 1991. Ha iniziato questa professione a 23 anni. Il suo valore aggiunto consiste nell'interessarsi delle persone e delle famiglie oltre che dei loro patrimoni: aiuta i clienti con educazione finanziaria, consulenza previdenziale e pianificazione successoria. Ritiene che "fare la differenza è la vera differenza" e applica i principi del kaizen, miglioramento continuo. Dopo quasi tre decenni di lavoro, afferma di amare la professione e di voler soddisfare i clienti con soluzioni d'investimento adatte.`,

    problema: `Sergio necessitava di una presenza digitale moderna e coerente con il suo posizionamento professionale. Servivano un sito aggiornato, strumenti per condividere i contatti in modo elegante e una base solida per i contenuti di personal branding.`,

    soluzione: [
      {
        titolo: 'Sito personal brand',
        descrizione:
          'Bitora ha progettato un sito che valorizza la storia professionale di Sergio, i suoi servizi e il suo approccio orientato alle persone e alle famiglie.',
      },
      {
        titolo: 'Tessere NFC e biglietti digitali',
        descrizione:
          'Bitora sta realizzando tessere NFC che permetteranno di condividere i contatti e i siti con un semplice gesto. Utile durante seminari ed eventi.',
      },
      {
        titolo: 'Gestione social e supporto continuativo',
        descrizione:
          'È stato impostato un piano di pubblicazione sui social con contenuti educativi coerenti con la missione di aiutare le famiglie a 360 gradi. Bitora fornirà assistenza costante a partire da gennaio.',
      },
    ],

    risultati: [
      'Struttura digitale che permette una presentazione coerente e autorevole',
      'Sito e tessere NFC che faciliteranno la condivisione di contenuti e contatti',
      "Gestione professionale dei social che rafforzerà la reputazione costruita in oltre trent'anni",
    ],

    tecnologie: [
      'Astro',
      'Vercel',
      'Tessere NFC personalizzate',
      'Social media management',
      'Copywriting',
    ],

    metricsPreview: ['Personal brand online', 'Lancio Q1 2025'],

    fonti: [{ testo: 'Sito ufficiale Sergio Contegiacomo', url: 'https://sergiocontegiacomo.it' }],
  },

  {
    id: 'simone-contegiacomo',
    slug: 'simone-contegiacomo',
    title: 'Simone Contegiacomo',
    subtitle: 'Personal Brand',
    category: 'Finance • Consulenza',
    location: 'Bra (CN)',
    imageUrl: '/simone.jpg',
    siteUrl: 'https://simonecontegiacomo.it',
    featured: true,
    isWip: true,

    clientDescription: `Simone Contegiacomo è il figlio di Sergio Contegiacomo e sta costruendo una presenza digitale professionale coordinata ma distinta, pensata per presentarsi online con credibilità fin dal primo contatto.`,

    problema: `Serviva un sito dedicato che permettesse a Simone di avere uno spazio proprio, separato dal brand del padre ma coerente nel tono, nella qualità percepita e nella struttura di presentazione.`,

    soluzione: [
      {
        titolo: 'Sito personal brand dedicato',
        descrizione:
          'Bitora ha impostato un progetto web dedicato a Simone, con struttura chiara, presentazione professionale e base pronta per evoluzioni future.',
      },
      {
        titolo: 'Immagine coordinata con il progetto di famiglia',
        descrizione:
          "Il sito mantiene coerenza con il contesto professionale della famiglia Contegiacomo, lasciando comunque spazio a un'identita autonoma.",
      },
    ],

    risultati: [
      'Presenza digitale dedicata e più riconoscibile',
      'Separazione chiara tra il profilo di Sergio e quello di Simone',
      'Base pronta per contenuti, contatti e crescita del personal brand',
    ],

    tecnologie: ['Astro', 'Vercel', 'Copywriting', 'Personal branding'],

    metricsPreview: ['Nuovo progetto', 'In sviluppo'],

    fonti: [{ testo: 'Sito ufficiale Simone Contegiacomo', url: 'https://simonecontegiacomo.it' }],
  },

  {
    id: 'sartoria-kristina',
    slug: 'sartoria-kristina',
    title: 'Sartoria Kristina',
    subtitle: 'Portfolio & NFC',
    category: 'Artigianato',
    location: 'Carmagnola (TO)',
    imageUrl: '/sartoria_kristina.png',
    siteUrl: 'https://sartoriakristina.it',
    featured: true,
    isWip: false,

    clientDescription: `Sartoria Kristina è una sartoria artigianale situata in via Ferruccio Valobra 93, a Carmagnola. Secondo il portale Sartist, ha una valutazione di 5/5 basata su cinque recensioni positive. I clienti elogiano la cortesia e la competenza del personale: "mi sono trovata molto bene, sono gentili e pazienti"; altri sottolineano professionalità, simpatia e un servizio eccellente.`,

    problema: `La sartoria necessitava di una vetrina digitale che raccontasse la qualità del lavoro artigianale e permettesse ai clienti di lasciare recensioni facilmente. Prima di Bitora, l'azienda non aveva un sito curato né strumenti per raccogliere feedback rapidi.`,

    soluzione: [
      {
        titolo: 'Sito elegante e portfolio online',
        descrizione:
          'Bitora ha progettato un sito che presenta i servizi di sartoria, mette in risalto le recensioni e include un portfolio fotografico dei capi realizzati. Il design è minimalista per lasciare spazio alle immagini.',
      },
      {
        titolo: 'Tessere NFC per recensioni',
        descrizione:
          'Sono state create tessere NFC che indirizzano direttamente alla sezione "lascia una recensione" del sito. In negozio, la tessera consente ai clienti di esprimere la propria opinione con un solo gesto.',
      },
    ],

    risultati: [
      'Visibilità alla professionalità e alle recensioni eccellenti della sartoria',
      'Aumento del numero di feedback raccolti grazie alle tessere NFC',
      'Nuovi contatti locali attratti dalla vetrina online',
      'Clienti che possono testimoniare facilmente la qualità del servizio',
    ],

    tecnologie: [
      'Astro',
      'Vercel',
      'Portfolio fotografico',
      'Tessere NFC per recensioni',
      'SEO locale',
    ],

    metricsPreview: ['+3 Clienti/mese', '60% Conversione'],

    fonti: [{ testo: 'Sartist - Portale Sartorie', url: 'https://sartist.it' }],
  },

  {
    id: 'speedy-pizza',
    slug: 'speedy-pizza',
    title: 'Speedy Pizza',
    subtitle: 'Sito & NFC Recensioni',
    category: 'Food',
    location: 'Carmagnola (TO)',
    imageUrl: 'https://www.speedy-pizza.it/logo.jpeg',
    siteUrl: 'https://speedy-pizza.it',
    featured: true,
    isWip: false,

    clientDescription: `Speedy Pizza è una pizzeria situata in via Valobra 117/119 a Carmagnola. Il sito ufficiale spiega che nasce dalla passione per la vera pizza italiana, utilizzando ingredienti freschi e di alta qualità. Le pizze sono cotte alla perfezione e l'attività offre consegna a domicilio e asporto. Un menù vario va dalla classica Margherita alle specialità della casa.`,

    problema: `Speedy Pizza aveva bisogno di un sito moderno che mostrasse il menù, mettesse in evidenza la qualità degli ingredienti e semplificasse la raccolta di recensioni. Mancava uno strumento rapido per indirizzare i clienti alla pagina di valutazione.`,

    soluzione: [
      {
        titolo: 'Sito con menù interattivo',
        descrizione:
          "Bitora ha creato un sito chiaro e veloce. L'utente può consultare il menù completo, leggere descrizioni dettagliate e ordinare telefonicamente. L'homepage riprende i valori della pizzeria: ingredienti freschi e passione per la pizza.",
      },
      {
        titolo: 'Tessere NFC per recensioni',
        descrizione:
          'Bitora ha sviluppato tessere NFC da consegnare con le pizze o da esporre in pizzeria. Scansionandole, i clienti accedono direttamente alla pagina dove possono lasciare una recensione.',
      },
    ],

    risultati: [
      'Presenza digitale che rispecchia la qualità del prodotto',
      'Clienti che trovano facilmente menù e informazioni di consegna',
      'Feedback facile con un semplice gesto grazie alle tessere NFC',
      'Visibilità aumentata e reputazione consolidata come pizzeria rapida e gustosa',
    ],

    tecnologie: ['Astro', 'Vercel', 'Menù digitale', 'Tessere NFC per recensioni', 'SEO locale'],

    metricsPreview: ['+30% Visibilità', '-15min Gestione telefonate'],

    fonti: [{ testo: 'Sito ufficiale Speedy Pizza', url: 'https://speedy-pizza.it' }],
  },

  {
    id: 'bar-chantilly',
    slug: 'bar-chantilly',
    title: 'Bar Tabacchi Chantilly',
    subtitle: 'Rebranding Digitale & NFC',
    category: 'Food & Servizi',
    location: 'Carmagnola (TO)',
    imageUrl: '/chanty.JPG',
    siteUrl: 'https://bartabacchichantilly.it',
    featured: true,
    isWip: false,

    clientDescription: `Il Bar Tabacchi Chantilly è un bar–tabaccheria storico di Carmagnola. Dal 1988 è considerato un punto di riferimento per la comunità, offrendo colazioni, aperitivi, servizi di tabaccheria e un ambiente accogliente. Il sito ufficiale descrive la caffetteria come un luogo dove vengono serviti caffè di alta qualità e snack, e sottolinea che il bar è anche un punto Sisal/Lottomatica e un punto ritiro Amazon. La filosofia del locale è essere più di un semplice bar: "un punto di ritrovo della comunità, dove tradizione e modernità si incontrano".`,

    problema: `Il Bar Chantilly necessitava di una presenza digitale in linea con la propria storia. Prima della collaborazione, non esisteva un sito con menù e servizi integrati, né un modo rapido per invogliare i clienti a lasciare recensioni.`,

    soluzione: [
      {
        titolo: 'Sito vetrina e menù digitale',
        descrizione:
          'Bitora ha sviluppato un sito che racconta la storia del locale e presenta i servizi (bar, tabacchi, Sisal, MoneyGram e punto ritiro). Il menù digitale permette ai clienti di consultare colazioni, aperitivi e snack in modo rapido.',
      },
      {
        titolo: 'Tessere NFC per recensioni',
        descrizione:
          'Sono state create tessere NFC posizionate sui tavoli. Con un semplice tap si apre la pagina delle recensioni, incentivando il feedback dei clienti.',
      },
    ],

    risultati: [
      'Sito che valorizza la tradizione del bar e i servizi moderni come punto Sisal e ritiro Amazon',
      'Presenza digitale che rafforza il ruolo di punto di ritrovo della comunità',
      'Clienti che consultano il menù e lasciano recensioni in modo semplice',
      "Tessere NFC che hanno incrementato il numero di feedback e migliorato l'interazione",
    ],

    tecnologie: ['Astro', 'Vercel', 'Menù digitale', 'Tessere NFC per recensioni', 'SEO locale'],

    metricsPreview: ['+25% Brand Awareness', '150+ Visite organiche'],

    fonti: [
      { testo: 'Sito ufficiale Bar Tabacchi Chantilly', url: 'https://bartabacchichantilly.it' },
    ],
  },
  {
    id: 'myzone',
    slug: 'myzone',
    title: 'MyZone',
    subtitle: 'Sito Immobiliare',
    category: 'Immobiliare',
    location: 'Italia',
    imageUrl: '/myzone.jpg',
    siteUrl: 'https://immobiliaremyzone.it',
    featured: true,
    isWip: false,

    clientDescription: `MyZone è un progetto immobiliare pensato per presentare immobili e opportunità in modo chiaro, ordinato e professionale, con una presenza digitale coerente con il settore.`,

    problema: `Serviva una vetrina online credibile per il progetto MyZone, capace di trasmettere affidabilità, valorizzare il brand e offrire un punto di contatto immediato ai visitatori.`,

    soluzione: [
      {
        titolo: 'Sito vetrina immobiliare',
        descrizione:
          'Bitora ha inserito MyZone nel portfolio come progetto dedicato al settore immobiliare, con impostazione orientata a chiarezza, fiducia e presentazione professionale.',
      },
      {
        titolo: 'Base pronta per evoluzioni future',
        descrizione:
          'La presenza digitale è pronta per essere completata con contenuti, copertine e ulteriori materiali visivi del brand.',
      },
    ],

    risultati: [
      'Brand MyZone presente online con una base professionale',
      'Progetto facilmente espandibile con nuovi contenuti',
      'Identità digitale ordinata e coerente con il settore immobiliare',
    ],

    tecnologie: ['Astro', 'Vercel', 'Copywriting', 'Web design'],

    metricsPreview: ['Nuovo progetto', 'Settore immobiliare'],

    fonti: [{ testo: 'Sito ufficiale MyZone', url: 'https://immobiliaremyzone.it' }],
  },

  {
    id: 'barbara-toffano',
    slug: 'barbara-toffano',
    title: 'Barbara Toffano',
    subtitle: 'Grafica & Brand Identity',
    category: 'Grafica • Branding',
    location: 'Piemonte',
    imageUrl: '/btoffano.jpg',
    siteUrl: '#',
    featured: false,
    isWip: false,

    clientDescription: `Barbara Toffano è una professionista che aveva bisogno di un'identità visiva professionale e coerente per la propria attività.`,

    problema: `Necessità di un'immagine coordinata professionale che rispecchiasse la qualità e l'affidabilità del servizio offerto.`,

    soluzione: [
      {
        titolo: 'Brand Identity',
        descrizione:
          "Sviluppo di un'identità visiva completa e coerente, dal logo ai materiali di comunicazione.",
      },
      {
        titolo: 'Materiali Grafici',
        descrizione:
          'Creazione di materiali grafici professionali per la comunicazione online e offline.',
      },
    ],

    risultati: [
      'Identità visiva professionale e riconoscibile',
      'Materiali di comunicazione coerenti',
      'Immagine che trasmette affidabilità e competenza',
    ],

    tecnologie: ['Adobe Illustrator', 'Brand Design', 'Graphic Design'],

    metricsPreview: ['Brand Identity', 'Grafica Professionale'],

    fonti: [],
  },
];

// Funzione helper per ottenere un case study per slug
export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find(cs => cs.slug === slug);
}

// Funzione helper per ottenere i case study featured
export function getFeaturedCaseStudies(): CaseStudy[] {
  return caseStudies.filter(cs => cs.featured);
}

// Funzione helper per ottenere i case study completati (non WIP)
export function getCompletedCaseStudies(): CaseStudy[] {
  return caseStudies.filter(cs => !cs.isWip);
}
