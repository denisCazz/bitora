export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  client?: string;
  category: string;
  location: string;
  imageUrl: string;
  siteUrl: string;
  featured: boolean;
  isWip?: boolean;
  hidden?: boolean;

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
    id: 'accessi-aziendali-franchina',
    slug: 'accessi-aziendali-franchina',
    title: 'Automazione e centralizzazione accessi aziendali',
    subtitle: 'Società Agricola Franchina · App sbarre senza token né abbonamenti',
    client: 'Società Agricola Franchina',
    category: 'Automazione Varchi • App Aziendale',
    location: 'Carmagnola (TO)',
    imageUrl: '/work/franchina-logo.webp',
    siteUrl: '#',
    featured: true,
    isWip: false,

    clientDescription: `Società Agricola Franchina, a Carmagnola (TO), gestisce più ingressi e varchi carrabili regolati da sbarre motorizzate FAAC, attraversati ogni giorno da dipendenti, collaboratori, mezzi agricoli, trasportatori e fornitori con orari e necessità diverse.`,

    problema: `Gestire gli ingressi con i telecomandi fisici significava acquistarli continuamente, consegnarli, recuperarli a fine turno e non sapere mai chi fosse entrato e a che ora. Dare accesso temporaneo a un corriere o a un fornitore richiedeva la consegna fisica di un telecomando o l’intervento manuale di qualcuno in azienda. Allo stesso tempo, molte soluzioni commerciali sul mercato obbligano le aziende a comprare pacchetti di gettoni ("token") per ogni invito o a pagare abbonamenti mensili per singolo utente o varco.`,

    soluzione: [
      {
        titolo: 'Passo 1 · Partiamo dalle sbarre che hai già',
        descrizione:
          'Nessuna sostituzione di motori, sbarre o fotocellule: abbiamo mantenuto intatto l’impianto FAAC esistente e tutte le sue sicurezze originali, affiancando il comando digitale ai sistemi già presenti.',
      },
      {
        titolo: 'Passo 2 · Colleghiamo i varchi a un’unica centrale aziendale',
        descrizione:
          'All’interno della centralina di ogni sbarra abbiamo installato un piccolo modulo sicuro connesso alla rete aziendale. Da quel momento tutte le sbarre rispondono a un solo pannello di controllo, espandibile a nuovi varchi o nuove sedi.',
      },
      {
        titolo: 'Passo 3 · La tua App aziendale su iOS e Android',
        descrizione:
          'Abbiamo realizzato l’applicazione mobile su misura dell’azienda: dipendenti e responsabili vedono sul proprio telefono solo le sbarre a cui sono abilitati e le aprono con un semplice tocco, sia davanti al varco sia a distanza.',
      },
      {
        titolo: 'Passo 4 · Automazione di orari, permessi e inviti temporanei',
        descrizione:
          'Dal pannello si decide in pochi clic chi può entrare, da quale sbarra e in quali giorni e fasce orarie, oppure si programmano aperture automatiche. Per fornitori, trasportatori e ospiti si invia un link temporaneo a scadenza (es. valido per 7 giorni o per una singola consegna), senza installare nulla.',
      },
      {
        titolo: 'Passo 5 · Storico completo, zero token e zero abbonamenti',
        descrizione:
          'Ogni apertura resta registrata con data, ora, varco e persona. Soprattutto, l’applicazione e la centrale sono di proprietà dell’azienda: nessun token da ricaricare per far entrare i fornitori e nessun canone o abbonamento per numero di utenti.',
      },
    ],

    risultati: [
      'Tutte le sbarre aziendali comandate e automatizzate dalla propria App su misura',
      'Zero token da comprare e zero abbonamenti mensili per utente o per apertura',
      'Fine dei telecomandi fisici da acquistare, duplicare o recuperare',
      'Inviti temporanei per trasportatori, fornitori e ospiti creati in pochi secondi',
      'Impianto, motori e fotocellule originali FAAC mantenuti senza modifiche invasive',
      'Registro in tempo reale di ogni ingresso con backup automatico giornaliero',
    ],

    tecnologie: [
      'App iOS e Android su misura',
      'Comando sbarre e cancelli',
      'Zero token e abbonamenti',
      'Automazione orari e turni',
      'Inviti temporanei fornitori',
      'Compatibile FAAC e impianti esistenti',
    ],

    metricsPreview: ['Zero token o abbonamenti', 'App sbarre su misura'],

    fonti: [],
  },

  {
    id: 'shopnfc',
    slug: 'shopnfc',
    title: 'Shop NFC Bitora',
    subtitle: 'E-commerce B2B e B2C per tessere, tag e lettori NFC',
    client: 'Bitora',
    category: 'E-commerce • B2B & NFC',
    location: 'Carmagnola (TO) · Italia',
    imageUrl: '/shop-nfc-products.jpg',
    siteUrl: 'https://shopnfc.bitora.it',
    featured: true,
    isWip: false,

    clientDescription: `Shop NFC Bitora (shopnfc.bitora.it) è l’e-commerce proprietario sviluppato da Bitora per la vendita diretta a imprese, agenzie, rivenditori e professionisti di tessere NFC per recensioni Google, espositori da banco, sticker NTAG213/215/216, tag industriali schermati per metallo, braccialetti e lettori NFC, con programmazione inclusa da 10 a 100.000 pezzi.`,

    problema: `Le aziende e le agenzie che cercano forniture NFC si scontrano spesso con cataloghi poco chiari sui chip compatibili, assenza di listini a scaglioni per quantità, necessità di programmare manualmente ogni tessera e passaggi lenti tra pagamento, preparazione e spedizione.`,

    soluzione: [
      {
        titolo: 'Catalogo B2B e B2C con scaglioni e area dealer',
        descrizione:
          'Piattaforma e-commerce veloce con schede tecniche per chip NFC, prezzi per quantità da piccole tirature a forniture industriali e area riservata per clienti B2B e rivenditori (dealer) con condizioni dedicate.',
      },
      {
        titolo: 'Pannello admin completo e logistica automatizzata',
        descrizione:
          'Area amministrativa su misura per gestire prodotti, categorie, specifiche dei chip NFC, clienti B2B, ordini e avvisi, con integrazione diretta a SpedirePRO e webhook automatici per etichette e stato delle spedizioni.',
      },
      {
        titolo: 'Pagamenti immediati e programmazione inclusa',
        descrizione:
          'Checkout rapido con Stripe e raccolta dei dati di configurazione per consegnare tessere e tag già programmati e pronti all’uso appena estratti dalla scatola.',
      },
    ],

    risultati: [
      'E-commerce B2B e B2C attivo su shopnfc.bitora.it con catalogo completo NFC',
      'Gestione clienti B2B (dealer), listini a scaglioni e ordini da 10 a 100.000 pezzi',
      'Spedizioni e tracking automatizzati tramite integrazione API e webhook SpedirePRO',
      'Pannello amministrativo proprietario senza commissioni di marketplace esterni',
    ],

    tecnologie: [
      'Next.js',
      'PostgreSQL',
      'Stripe',
      'SpedirePRO API',
      'Area B2B Dealer',
      'NFC NTAG',
    ],

    metricsPreview: ['E-commerce B2B & B2C', 'Logistica automatizzata'],

    fonti: [{ testo: 'Shop NFC Bitora', url: 'https://shopnfc.bitora.it' }],
  },

  {
    id: 'ricambixstufe',
    slug: 'ricambixstufe',
    title: 'RicambiXStufe',
    subtitle: 'E-commerce verticale e B2B per ricambi stufe',
    category: 'E-commerce • B2B',
    location: 'Italia',
    imageUrl: '/logo_eva.png',
    siteUrl: 'https://ricambixstufe.it',
    featured: true,
    isWip: false,

    clientDescription: `RicambiXStufe è una piattaforma e-commerce specializzata nella vendita online di ricambi, componenti e accessori per stufe a pellet e a legna, sviluppata da Bitora. Il catalogo copre i principali produttori — Eva Calor, Extraflame e decine di altri marchi — con motoriduttori, ventilatori, resistenze, schede elettroniche e guarnizioni. Il progetto nasce con l'obiettivo di trasformare un'attività tradizionale di vendita di ricambi in un sistema digitale strutturato per clienti finali, manutentori e rivenditori.`,

    problema: `Nel settore dei ricambi per stufe, uno dei principali problemi è l'identificazione del componente corretto. I clienti e i tecnici spesso cercano per codice componente, modello della stufa o compatibilità tra marchi. Serviva quindi una piattaforma che permettesse di trovare e ordinare rapidamente il ricambio giusto, riducendo richieste manuali, telefonate ed errori d’ordine, e che consentisse all'azienda di gestire autonomamente prodotti, listini, ordini, clienti e API partner.`,

    soluzione: [
      {
        titolo: 'Catalogo tecnico ricercabile per modello e codice',
        descrizione:
          'Catalogo consultabile con immagini, descrizioni tecniche, prezzi, ricerca rapida e navigazione per categorie, marchi e modelli compatibili. Utenti e installatori verificano subito la compatibilità e completano l’ordine online da computer, smartphone o tablet.',
      },
      {
        titolo: 'Pannello amministrativo e API partner B2B',
        descrizione:
          'Area admin dedicata per gestire prodotti, prezzi, disponibilità, categorie, marchi, ordini e clienti in autonomia, affiancata da API partner per collegare rivenditori e centri assistenza.',
      },
      {
        titolo: 'Canale commerciale proprietario senza commissioni',
        descrizione:
          'La piattaforma centralizza catalogo, clienti e ordini, permette di vendere in tutta Italia 24/7 e costruisce un archivio digitale dei ricambi indipendente dai marketplace esterni.',
      },
    ],

    risultati: [
      'E-commerce verticale per ricambi stufe con ricerca per marca, modello e compatibilità',
      'Piattaforma operativa con gestione ordini, pagamenti online e API per partner B2B',
      'Autonomia completa su catalogo, prezzi, scorte e clienti dal pannello admin',
      'Canale di vendita proprietario indipendente dai marketplace',
    ],

    tecnologie: [
      'E-commerce B2B & B2C',
      'Catalogo tecnico',
      'API Partner',
      'Pannello amministrativo',
      'Pagamenti online',
    ],

    metricsPreview: ['E-commerce verticale B2B', 'Ricerca per compatibilità'],

    fonti: [{ testo: 'Sito ufficiale RicambiXStufe', url: 'https://ricambixstufe.it' }],
  },

  {
    id: 'garavella-7-gestionale',
    slug: 'garavella-7-gestionale',
    title: 'Gestionale Garavella 7',
    client: 'Garavella 7',
    subtitle: 'Gestionale bar, menu live, cassa e presenze GPS',
    category: 'Software • Food',
    location: 'Carmagnola (TO)',
    imageUrl: '/logo_garavella.png',
    siteUrl: '#',
    featured: true,
    isWip: false,

    clientDescription: `Garavella 7 è anche il gestionale interno del Bar Dai Ragazzi, pensato per il lavoro di ogni giorno in Piazza Garavella 7 a Carmagnola: magazzino, menu, promozioni, dipendenti con timbratura presenze e cassa in un’unica piattaforma collegata in tempo reale al sito pubblico.`,

    problema: `Magazzino, carta del bar, promozioni, presenze del personale e movimenti di cassa vivevano su fogli, appunti e strumenti separati. Serviva un sistema unico, usabile dallo smartphone dietro al banco, che tenesse allineati scorte, orari del personale e menu — compreso il menu pubblico e il PDF scaricabile dai clienti.`,

    soluzione: [
      {
        titolo: 'Magazzino con scanner barcode da telefono',
        descrizione:
          'Articoli con codice ed EAN, soglie di scorta e movimenti di entrata, uscita e rettifica. Dietro al banco si scansiona il prodotto con la fotocamera dello smartphone per caricare o scaricare merce in pochi secondi.',
      },
      {
        titolo: 'Menu operativo, PDF automatico e promozioni live',
        descrizione:
          'Le voci della carta usano gli ingredienti del magazzino: se un prodotto finisce, i piatti che lo richiedono spariscono da soli dal menu sul sito. Dal gestionale si aggiornano anche foto, promozioni dinamiche e il menu esportabile in PDF.',
      },
      {
        titolo: 'Cassa e registro presenze dipendenti con verifica IP/GPS',
        descrizione:
          'Registro entrate e uscite (vendite banco, aperitivo, fornitori, stipendi) e timbratura presenze dei dipendenti con controllo perimetro IP/GPS, avvisi automatici, calendario ferie/malattia e calcolo del totale ore lavorate.',
      },
    ],

    risultati: [
      'Gestionale unico per magazzino, menu, promozioni, cassa e presenze del personale',
      'Scorte, carta online e PDF del menu sempre allineati senza doppio lavoro',
      'Timbratura presenze dipendenti con verifica perimetro GPS/IP e calcolo ore',
      'Carico e scarico merce immediato via scanner barcode da smartphone',
    ],

    tecnologie: [
      'Next.js',
      'Prisma',
      'Scanner barcode',
      'Presenze GPS/IP',
      'API menu & PDF live',
      'Dashboard operativa',
    ],

    metricsPreview: ['Menu live & PDF', 'Magazzino, cassa e presenze GPS'],

    fonti: [
      {
        testo: 'Sito pubblico Garavella 7',
        url: 'https://garavella7.it',
      },
    ],
  },

  {
    id: 'garavella-7',
    slug: 'garavella-7',
    title: 'Garavella 7',
    subtitle: 'Sito web, menu digitale live e promozioni',
    category: 'Food & Beverage',
    location: 'Carmagnola (TO)',
    imageUrl: '/logo_garavella.png',
    siteUrl: 'https://garavella7.it',
    featured: true,
    isWip: false,

    clientDescription: `Garavella 7 è il progetto digitale del Bar Dai Ragazzi, in Piazza Garavella 7 a Carmagnola. Il locale è un punto di riferimento per colazioni, tavola calda, panini, hamburger e aperitivi, con tagline “Less stress, more spritz!”: aperto dal lunedì al sabato 06:30–21:00 e la domenica 08:30–12:30 e 17:00–21:00.`,

    problema: `Il bar aveva bisogno di una vetrina online chiara, bilingue e allineata al brand Garavella 7, che facesse trovare il locale in centro a Carmagnola e mostrasse in tempo reale quello che c’è davvero al banco — tra piatti del giorno, aperitivi e promozioni — senza dover modificare il sito a mano.`,

    soluzione: [
      {
        titolo: 'Sito vetrina bilingue con identità Garavella 7',
        descrizione:
          'Bitora ha realizzato un sito veloce e mobile-first in italiano e inglese che racconta il locale, gli aperitivi, la gallery e i recapiti (telefono, WhatsApp, mappa), in linea con il marchio del locale.',
      },
      {
        titolo: 'Menu digitale e promozioni collegati al gestionale',
        descrizione:
          'Il menu, le immagini dei piatti, la gallery e le promozioni del sito si aggiornano direttamente dal gestionale interno: se un ingrediente finisce in magazzino, le voci che lo usano vengono nascoste automaticamente.',
      },
      {
        titolo: 'SEO locale e conversioni via WhatsApp',
        descrizione:
          'Il sito è ottimizzato per le ricerche locali su Carmagnola, con dati strutturati, orari aggiornati, recensioni in evidenza e call-to-action dirette su WhatsApp e telefono.',
      },
    ],

    risultati: [
      'Presenza digitale bilingue IT/EN attiva su garavella7.it',
      'Menu pubblico e promozioni allineati al magazzino senza interventi manuali',
      'Percorso di contatto immediato: chiamata, WhatsApp e indicazioni stradali',
      'Identità visiva coordinata con il locale in Piazza Garavella',
    ],

    tecnologie: [
      'Astro',
      'Coolify',
      'Menu digitale live',
      'Multilingua IT/EN',
      'SEO locale',
      'WhatsApp CTA',
    ],

    metricsPreview: ['Menu live dal gestionale', 'SEO locale Carmagnola'],

    fonti: [
      {
        testo: 'Sito ufficiale Garavella 7',
        url: 'https://garavella7.it',
      },
    ],
  },

  {
    id: 'mistral-gestionale',
    slug: 'mistral-gestionale',
    title: 'Gestionale Mistral Impianti',
    client: 'Mistral Impianti',
    subtitle: 'Gestionale unificato con preventivi AI',
    category: 'Software • AI',
    location: 'Roreto di Cherasco (CN)',
    imageUrl: '/mistral.jpg',
    siteUrl: '#',
    featured: true,
    isWip: false,

    clientDescription: `Mistral Impianti progetta, installa e manutiene impianti elettrici, speciali e antincendio dal 1988. Oltre al sito istituzionale, Bitora ha sviluppato il gestionale interno che usa ogni giorno l’ufficio tecnico e amministrativo.`,

    problema: `Preventivi scritti partendo da zero, documenti e certificazioni sparsi tra cartelle, scadenze controllate a memoria, presenze e costi del personale su fogli separati, magazzino senza codici. Ogni informazione esisteva, ma nessuno strumento la teneva insieme.`,

    soluzione: [
      {
        titolo: 'Preventivi generati con l’AI',
        descrizione:
          'L’AI prepara una bozza di preventivo partendo dai documenti aziendali e dai lavori simili già fatti. L’ufficio la rivede, la versiona e la esporta in PDF o Word con un clic.',
      },
      {
        titolo: 'Archivio documenti interrogabile',
        descrizione:
          'Documenti caricati in cloud, testo estratto e indicizzato: si cerca per contenuto e si fanno domande in linguaggio naturale all’archivio, invece di aprire cartella per cartella.',
      },
      {
        titolo: 'Scadenze, persone, magazzino e rapportini',
        descrizione:
          'Scadenze lette da nomi file e cartelle con avvisi email automatici. Anagrafica dipendenti con presenze e costi, magazzino con codici EAN e scanner barcode da smartphone, rapportini d’intervento con firma.',
      },
    ],

    risultati: [
      'Un solo gestionale per preventivi, documenti, scadenze, personale e magazzino',
      'Bozze di preventivo pronte in pochi minuti invece che da scrivere da zero',
      'Avvisi automatici sulle scadenze, senza controlli a memoria',
      'Ruoli separati per amministrazione e operatori tecnici',
    ],

    tecnologie: [
      'Next.js',
      'PostgreSQL',
      'Prisma',
      'OpenAI',
      'RAG',
      'Cloudflare R2',
      'Scanner barcode',
    ],

    metricsPreview: ['Preventivi con AI', 'Archivio interrogabile'],

    fonti: [],
  },

  {
    id: 'tropini-service',
    slug: 'tropini-service',
    title: 'Tropini Service',
    subtitle: 'Sito interattivo diagnosi stufe e area admin clienti',
    category: 'B2B & Privati • Assistenza tecnica',
    location: 'Cavallermaggiore (CN)',
    imageUrl: '/logo_tropini.png',
    siteUrl: '#',
    featured: true,
    isWip: false,

    clientDescription: `Tropini Service di Gianfranco Tropini è un centro di assistenza tecnica specializzato in stufe a pellet e a legna a Cavallermaggiore (CN). Da oltre vent'anni opera sul territorio piemontese con oltre 4.000 impianti seguiti, ricambi originali e intervento rapido su Extraflame, Eva Calor e decine di altri marchi.`,

    problema: `Chi chiama per una stufa bloccata spesso non sa comunicare subito tipo di apparecchio, sintomo e comune di intervento, mentre in ufficio le richieste telefoniche e via mail andavano ricopiate a mano nell’anagrafica dei clienti e nello storico interventi.`,

    soluzione: [
      {
        titolo: 'Percorso guidato di richiesta in 4 passi',
        descrizione:
          'Sul sito il cliente indica in pochi secondi il tipo di stufa (pellet o legna), il problema (non parte, si spegne, fumo, codice errore, ricambio o manutenzione) e clicca la propria zona sulla mappa interattiva del Piemonte prima di chiamare o inviare la richiesta.',
      },
      {
        titolo: 'Area admin clienti e storico interventi integrata',
        descrizione:
          'Ogni richiesta inviata dal sito viene abbinata automaticamente al cliente già presente (per numero di telefono o email) oppure crea una nuova scheda cliente con l’intervento già aperto e pronto da programmare in officina.',
      },
      {
        titolo: 'SEO locale e contatto immediato per tutto il Piemonte',
        descrizione:
          'Se il cliente sceglie di telefonare su cellulare o fisso, il riepilogo di stufa, problema e comune resta visibile sullo schermo così da guidare la chiamata in modo chiaro e veloce.',
      },
    ],

    risultati: [
      'Richieste di assistenza già qualificate con tipo stufa, sintomo e comune',
      'Anagrafica clienti e storico interventi alimentati automaticamente dal sito',
      'Mappa interattiva del Piemonte per verificare subito la copertura di zona',
      'Passaggio diretto tra sito pubblico e gestione operativa d’officina',
    ],

    tecnologie: [
      'Astro',
      'Node.js',
      'PostgreSQL',
      'Area Admin Clienti',
      'Mappa Piemonte interattiva',
      'SEO locale',
    ],

    metricsPreview: ['Diagnosi guidata in 4 passi', 'Area admin clienti integrata'],

    fonti: [],
  },

  {
    id: 'dalina',
    slug: 'dalina',
    title: "D'Alina",
    subtitle: 'Sito web & menu digitale',
    category: 'Food & Beverage',
    location: 'Sommariva del Bosco (CN)',
    imageUrl: '/logo_dalina.png',
    siteUrl: 'https://ristorantedalina.it',
    featured: true,
    isWip: false,

    clientDescription: `D'Alina è ristorante e pizzeria in Via Canale 48 a Sommariva del Bosco, nel Roero. Pizza al forno, cucina e serate in compagnia: un locale per restare a tavola, non solo per un asporto veloce. Aperto mercoledì–domenica dalle 18:30 all’1:00.`,

    problema: `Il locale aveva bisogno di una vetrina online chiara per farsi trovare nel Roero, mostrare pizza e cucina, e far prenotare un tavolo senza passaggi inutili — telefono, WhatsApp, orari e mappa in un colpo d’occhio.`,

    soluzione: [
      {
        titolo: 'Sito vetrina con identità D’Alina',
        descrizione:
          'Bitora ha realizzato un sito veloce e mobile-first che racconta forno, tavola e serate. Design allineato al marchio, con logo, tono e colori del locale, pensato per smartphone prima di tutto.',
      },
      {
        titolo: 'Menu digitale pizza e cucina',
        descrizione:
          'La carta è online: pizze classiche e speciali, cucina e dolci, con prezzi e descrizioni. Il cliente vede cosa c’è in tavola prima di arrivare; il menu si aggiorna dal codice, senza un CMS da gestire in sala.',
      },
      {
        titolo: 'SEO locale e prenotazione diretta',
        descrizione:
          'Il sito è ottimizzato per le ricerche su Sommariva del Bosco e il Roero, con schemi strutturati, FAQ, orari, mappa e call-to-action su telefono e WhatsApp.',
      },
    ],

    risultati: [
      'Presenza digitale live su ristorantedalina.it con brand D’Alina',
      'Menu pubblico di pizza e cucina, consultabile da mobile',
      'Percorso di contatto immediato: chiamata, WhatsApp e indicazioni stradali',
      'Visibilità locale strutturata per Sommariva del Bosco e il Roero',
    ],

    tecnologie: [
      'Astro',
      'Coolify',
      'Menu digitale',
      'SEO locale',
      'WhatsApp CTA',
      'Responsive design',
    ],

    metricsPreview: ['Menu pizza e cucina', 'SEO locale Roero'],

    fonti: [
      {
        testo: 'Sito ufficiale D’Alina',
        url: 'https://ristorantedalina.it',
      },
    ],
  },

  {
    id: 'simone-contegiacomo',
    slug: 'simone-contegiacomo',
    title: 'Simone Contegiacomo',
    subtitle: 'Personal Brand & Finanza',
    category: 'Finance • Consulenza',
    location: 'Bra (CN)',
    imageUrl: '/simone.jpg',
    siteUrl: 'https://simonecontegiacomo.it',
    featured: true,
    isWip: false,

    clientDescription: `Simone Contegiacomo è un giovane professionista della finanza di Bra, erede della tradizione di Sergio Contegiacomo. Unisce i valori di fiducia, visione e integrità tramandati in famiglia a una prospettiva moderna sui mercati, con focus su gestione patrimoniale, educazione finanziaria e strumenti digitali per i più giovani.`,

    problema: `Serviva un sito dedicato che presentasse Simone con un'identità autonoma rispetto al padre, raccontando l'eredità familiare, i pilastri professionali e le iniziative rivolte ai giovani — senza diluire la credibilità del brand di famiglia.`,

    soluzione: [
      {
        titolo: 'Sito personal brand',
        descrizione:
          'Progettato un sito che valorizza la storia di famiglia, i pilastri (integrità, innovazione, territorio) e il posizionamento di Simone verso nuovi orizzonti finanziari, con CTA chiare per contatto e approfondimento.',
      },
      {
        titolo: 'Contenuti e strumenti verticali',
        descrizione:
          'Sezione dedicata all’eredità professionale di Sergio, area “Per i Giovani” con Conto Vedo Giovani e brochure scaricabile, più calcolatore TFR integrato e collegamenti social (Instagram e LinkedIn).',
      },
      {
        titolo: 'Coerenza con il progetto di famiglia',
        descrizione:
          'Identità visiva e tono distinti ma allineati al contesto Contegiacomo, con bridge naturale verso sergiocontegiacomo.it.',
      },
    ],

    risultati: [
      'Presenza digitale autonoma e riconoscibile su simonecontegiacomo.it',
      'Narrativa familiare chiara: eredità del passato e visione verso il futuro',
      'Strumenti utili online: brochure giovani, calcolatore TFR e canali social',
      'Separazione netta tra il profilo di Sergio e quello di Simone',
    ],

    tecnologie: [
      'Astro',
      'Coolify',
      'Copywriting',
      'Personal branding',
      'Calcolatore TFR',
      'Lead magnet PDF',
    ],

    metricsPreview: ['Personal brand online', 'Calcolatore TFR'],

    fonti: [{ testo: 'Sito ufficiale Simone Contegiacomo', url: 'https://simonecontegiacomo.it' }],
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

    clientDescription: `Sergio Contegiacomo è un consulente patrimoniale affiliato ad Allianz Bank e opera nel settore dal 1991. Ha iniziato questa professione a 23 anni. Il suo valore aggiunto consiste nell'interessarsi delle persone e delle famiglie oltre che dei loro patrimoni: aiuta i clienti con educazione finanziaria, consulenza previdenziale e pianificazione successoria, applicando i principi del kaizen, il miglioramento continuo.`,

    problema: `Sergio necessitava di una presenza digitale moderna e coerente con il suo posizionamento professionale. Servivano un sito autorevole, strumenti immediati per condividere i contatti durante incontri ed eventi e una base solida per i contenuti di educazione finanziaria.`,

    soluzione: [
      {
        titolo: 'Sito personal brand autorevole',
        descrizione:
          'Bitora ha progettato un sito che valorizza oltre trent’anni di storia professionale di Sergio, i suoi servizi e il suo approccio orientato alle persone e alle famiglie.',
      },
      {
        titolo: 'Tessere NFC e biglietti digitali',
        descrizione:
          'Tessere NFC personalizzate per condividere contatti, recapiti e sito ufficiale con un semplice gesto dello smartphone durante incontri, seminari ed eventi.',
      },
      {
        titolo: 'Piano editoriale e presenza continuativa',
        descrizione:
          'Struttura di comunicazione pensata per divulgare contenuti educativi su previdenza, tutela patrimoniale e passaggio generazionale.',
      },
    ],

    risultati: [
      'Presenza digitale autorevole e allineata a oltre trent’anni di carriera',
      'Condivisione immediata dei contatti tramite sito e tessere NFC',
      'Collegamento coordinato con il progetto generazionale di Simone Contegiacomo',
    ],

    tecnologie: [
      'Astro',
      'Coolify',
      'Tessere NFC personalizzate',
      'Personal branding',
      'Copywriting',
    ],

    metricsPreview: ['Personal brand online', 'Sito & NFC attivi'],

    fonti: [{ testo: 'Sito ufficiale Sergio Contegiacomo', url: 'https://sergiocontegiacomo.it' }],
  },

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
          "Bitora ha progettato un nuovo sito web che mette in risalto la storia, i valori e i servizi dell'azienda. Il sito è realizzato con tecnologie moderne (Astro, Coolify) e ottimizzato per i motori di ricerca locali.",
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
      'Coolify',
      'Tessere NFC personalizzate',
      'SEO locale',
      'Copywriting professionale',
    ],

    metricsPreview: ['Percorso di contatto semplificato', 'SEO locale strutturata'],

    fonti: [{ testo: 'Sito ufficiale Mistral Impianti', url: 'https://mistralimpianti.it' }],
  },

  {
    id: 'agriturismo-la-natura',
    slug: 'agriturismo-la-natura',
    title: 'Agriturismo La Natura',
    subtitle: 'Sito vetrina multilanguage',
    category: 'Food & Hospitality',
    location: 'Savigliano (CN)',
    imageUrl: '/logo_natura.png',
    siteUrl: 'https://lanaturasavigliano.it',
    featured: true,
    isWip: false,

    clientDescription: `Agriturismo La Natura è un agriturismo a Savigliano gestito da Alfred e Silvana. Tra campagna cuneese e giardino, offre cucina di campagna con sapori piemontesi, prodotti dell'orto e sola carne italiana: pranzi di lavoro, cene e tavolate conviviali in un ambiente familiare.`,

    problema: `Serviva una presenza digitale chiara e credibile per far trovare l'agriturismo online, comunicare orari, prezzi e posizione, e semplificare le prenotazioni — anche per ospiti che parlano inglese o francese.`,

    soluzione: [
      {
        titolo: 'Sito vetrina orientato alle prenotazioni',
        descrizione:
          'Bitora ha realizzato un sito che presenta cucina, luogo e info pratiche (orari, prezzi, mappa) con call-to-action dirette per chiamare o prenotare su WhatsApp.',
      },
      {
        titolo: 'Esperienza multilanguage e mobile-first',
        descrizione:
          'Il sito è disponibile in italiano, inglese e francese, ottimizzato per smartphone e per la ricerca locale su Savigliano e dintorni.',
      },
    ],

    risultati: [
      'Presenza digitale che racconta cucina di campagna e accoglienza dell’agriturismo',
      'Prenotazioni facilitate con telefono e WhatsApp in evidenza',
      'Contenuti accessibili a ospiti IT, EN e FR',
      'Visibilità locale strutturata per Savigliano (CN)',
    ],

    tecnologie: [
      'Astro',
      'Coolify',
      'Multilingua IT/EN/FR',
      'SEO locale',
      'WhatsApp booking',
      'Responsive design',
    ],

    metricsPreview: ['Prenotazioni più dirette', 'Sito multilanguage'],

    fonti: [
      { testo: 'Sito ufficiale Agriturismo La Natura', url: 'https://lanaturasavigliano.it' },
    ],
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
      'Coolify',
      'Portfolio fotografico',
      'Tessere NFC per recensioni',
      'SEO locale',
    ],

    metricsPreview: ['Canale digitale per richieste', 'Percorso verso il contatto'],

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

    tecnologie: ['Astro', 'Coolify', 'Menù digitale', 'Tessere NFC per recensioni', 'SEO locale'],

    metricsPreview: ['Visibilità locale strutturata', 'Contatto e menù più diretti'],

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

    tecnologie: ['Astro', 'Coolify', 'Menù digitale', 'Tessere NFC per recensioni', 'SEO locale'],

    metricsPreview: ['Identità digitale rafforzata', 'Presenza online ordinata'],

    fonti: [
      { testo: 'Sito ufficiale Bar Tabacchi Chantilly', url: 'https://bartabacchichantilly.it' },
    ],
  },

  {
    id: 'barbara-toffano',
    slug: 'barbara-toffano',
    title: 'Barbara Toffano',
    subtitle: 'Sito web & Brand Identity',
    category: 'Web • Branding',
    location: 'Piemonte',
    imageUrl: '/btoffano.jpg',
    siteUrl: 'https://barbaratoffano.it',
    featured: true,
    isWip: false,

    clientDescription: `Barbara Toffano è una professionista che aveva bisogno di un'identità visiva professionale e di un sito web coerente per presentare la propria attività online.`,

    problema: `Necessità di un'immagine coordinata professionale e di una presenza digitale aggiornata, con sito web e materiali grafici allineati, che rispecchiassero qualità e affidabilità del servizio offerto.`,

    soluzione: [
      {
        titolo: 'Brand Identity',
        descrizione:
          "Sviluppo di un'identità visiva completa e coerente, dal logo ai materiali di comunicazione.",
      },
      {
        titolo: 'Sito web professionale',
        descrizione:
          'Realizzazione del sito barbaratoffano.it: vetrina digitale chiara, responsive e allineata al brand, con percorsi di contatto e presentazione dei servizi.',
      },
      {
        titolo: 'Materiali Grafici',
        descrizione:
          'Creazione di materiali grafici professionali per la comunicazione online e offline.',
      },
    ],

    risultati: [
      'Identità visiva professionale e riconoscibile',
      'Sito web online su barbaratoffano.it, coerente con il brand',
      'Materiali di comunicazione allineati online e offline',
      'Immagine che trasmette affidabilità e competenza',
    ],

    tecnologie: [
      'Astro',
      'Coolify',
      'Adobe Illustrator',
      'Brand Design',
      'Graphic Design',
      'Web design',
    ],

    metricsPreview: ['Sito web', 'Brand Identity'],

    fonti: [{ testo: 'Sito ufficiale Barbara Toffano', url: 'https://barbaratoffano.it' }],
  },

  {
    id: 'wine-cafe',
    slug: 'wine-cafe',
    title: 'Bar Wine Café',
    subtitle: 'Sito in manutenzione',
    category: 'Food & Beverage',
    location: 'Carmagnola (TO)',
    imageUrl: '/wine.png',
    siteUrl: '#',
    featured: true,
    isWip: false,
    hidden: true,

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

    tecnologie: ['Astro', 'Coolify', 'Pagina manutenzione', 'Presidio dominio'],

    metricsPreview: ['Sito in manutenzione', 'Dominio presidiato'],

    fonti: [
      { testo: 'Corriere di Carmagnola', url: 'https://corrieredicarmagnola.it' },
      { testo: 'Pagine Gialle', url: 'https://paginegialle.it' },
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
    siteUrl: '#',
    featured: true,
    isWip: false,
    hidden: true,

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

    tecnologie: ['Astro', 'Coolify', 'Copywriting', 'Web design'],

    metricsPreview: ['Nuovo progetto', 'Settore immobiliare'],

    fonti: [],
  },
];

export function isPublicCaseStudy(cs: CaseStudy): boolean {
  return !cs.hidden;
}

export function getPublicCaseStudies(): CaseStudy[] {
  return caseStudies.filter(isPublicCaseStudy);
}

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return getPublicCaseStudies().find(cs => cs.slug === slug);
}

export function getFeaturedCaseStudies(): CaseStudy[] {
  return getPublicCaseStudies().filter(cs => cs.featured);
}

export function getCompletedCaseStudies(): CaseStudy[] {
  return getPublicCaseStudies().filter(cs => !cs.isWip);
}
