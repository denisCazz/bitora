import type { ArticleContent, CtaVariant, EditorialTopic } from './types';

export type SeedArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  topic: EditorialTopic;
  status: 'DRAFT' | 'PUBLISHED';
  angle: string;
  abstract: string;
  seoTitle: string;
  seoDescription: string;
  coverImage: string;
  coverAlt: string;
  readTime: string;
  ctaVariant: CtaVariant;
  caseStudySlugs: string[];
  visualHints: string[];
  publishedAt?: string;
  generatedByAi?: boolean;
  sources: Array<{ title: string; url: string }>;
  content: ArticleContent;
};

const stages = [
  { id: 'signal', label: 'Segnale' },
  { id: 'deep', label: 'Lettura' },
  { id: 'proof', label: 'Prove' },
  { id: 'field', label: 'Sul campo' },
  { id: 'act', label: 'Azione' },
];

export const SEED_ARTICLES: SeedArticle[] = [
  {
    slug: 'quanto-costa-crm-pmi',
    title: 'Quanto costa un CRM per PMI nel 2026',
    excerpt:
      'Fasce di prezzo CRM per PMI: SaaS vs su misura, tempi di implementazione e criteri per scegliere senza sprechi.',
    category: 'CRM',
    topic: 'crm',
    status: 'PUBLISHED',
    angle: 'Il prezzo non è la licenza: è il lavoro che il CRM toglie o aggiunge.',
    abstract:
      'Il costo di un CRM per PMI dipende da utenti, moduli e integrazioni. Le soluzioni SaaS partono da fasce contenute, i gestionali su misura chiedono un preventivo dopo l’analisi. Questa guida smonta le fasce e collega il prezzo al processo reale.',
    seoTitle: 'Quanto costa un CRM per PMI nel 2026 | Bitora',
    seoDescription:
      'Guida 2026 ai prezzi CRM per PMI: SaaS vs su misura, tempi di implementazione, errori da evitare e audit gratuito Bitora.',
    coverImage: '/editorial/crm.png',
    coverAlt: 'Panoramica visuale di un CRM con pipeline, contatti ed email',
    readTime: '6 min',
    ctaVariant: 'demo',
    caseStudySlugs: ['garavella-7-gestionale', 'ricambixstufe'],
    visualHints: ['pipeline', 'whatsapp'],
    publishedAt: '2026-06-13T08:00:00.000Z',
    sources: [{ title: 'CRM Bitora', url: 'https://bitora.it/bitora-crm/' }],
    content: {
      stages,
      blocks: [
        {
          type: 'signal',
          heading: 'Il costo vero è il follow-up perso',
          body: 'SaaS da poche decine di euro al mese o su misura dopo un audit: la differenza è se il CRM chiude il cerchio tra lead, WhatsApp e lavoro sul campo.',
          seconds: 60,
          stageId: 'signal',
        },
        {
          type: 'image',
          src: '/editorial/crm.png',
          alt: 'Flusso CRM con anagrafica, pipeline e attività',
          eyebrow: 'Un unico flusso',
          caption: 'Contatti, opportunità e prossime azioni nello stesso posto.',
          stageId: 'signal',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Fasce di prezzo CRM',
          stageId: 'deep',
        },
        {
          type: 'list',
          items: [
            'SaaS entry-level: €50–150/mese per 1–5 utenti, pipeline e contatti.',
            'SaaS avanzato: €150–400/mese con automazioni, report e integrazioni.',
            'Su misura Bitora: preventivo modulare dopo analisi di processi e integrazioni.',
            'Setup iniziale: €0 per SaaS, variabile per sviluppo custom (audit gratuito).',
          ],
          stageId: 'deep',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Cosa influenza il prezzo',
          stageId: 'deep',
        },
        {
          type: 'paragraph',
          html: 'Numero utenti, automazioni, integrazioni (email, WhatsApp, fatturazione), report custom, app mobile per operatori sul campo. Più processi unici hai, più conviene una <a href="/sistemi-aziendali/">soluzione su misura</a>.',
          stageId: 'deep',
        },
        {
          type: 'proof',
          title: 'Esperienza Bitora, non benchmark inventati',
          body: 'Non pubblichiamo percentuali di ROI generiche. Misuriamo ore sottratte a chase email e file sparsi, progetto per progetto.',
          stageId: 'proof',
        },
        {
          type: 'case',
          slug: 'garavella-7-gestionale',
          lesson:
            'Magazzino, menu e cassa nello stesso sistema: il CRM ha senso solo se parla con l’operatività reale.',
          stageId: 'field',
        },
        {
          type: 'demo',
          kind: 'pipeline',
          title: 'Pipeline in tre stati',
          body: 'Lead → conversazione → azione. Se un passaggio vive su un foglio, il CRM sta mentendo.',
          stageId: 'field',
        },
        {
          type: 'heading',
          level: 2,
          text: 'ROI: quando si ripaga',
          stageId: 'act',
        },
        {
          type: 'paragraph',
          html: 'Un CRM ben configurato riduce lavoro manuale su lead, follow-up e reportistica. Usa il <a href="/tools/calcolatore-roi-gestionale/">calcolatore ROI gestionale</a> e leggi anche <a href="/blog/gestionale-pmi-2026/">come scegliere un gestionale</a>.',
          stageId: 'act',
        },
        {
          type: 'diagnostic',
          stageId: 'act',
          questions: [
            {
              id: 'stack',
              prompt: 'Oggi i lead dove vivono?',
              options: [
                { id: 'sheets', label: 'Fogli, chat e testa', cta: 'demo' },
                { id: 'saas', label: 'Un SaaS poco usato', cta: 'roi' },
                { id: 'custom', label: 'Serve qualcosa di nostro', cta: 'demo' },
              ],
            },
          ],
        },
        {
          type: 'faq',
          stageId: 'act',
          items: [
            {
              question: 'Quanto costa un CRM per una PMI in Italia nel 2026?',
              answer:
                'Dipende da utenti, moduli e integrazioni. SaaS in fasce contenute; su misura dopo analisi del processo.',
            },
            {
              question: 'Conviene un CRM a pacchetto o su misura?',
              answer:
                'Pacchetto per processi standard. Su misura per flussi, integrazioni e automazioni specifiche.',
            },
            {
              question: 'Un CRM si integra con email e WhatsApp?',
              answer: 'Sì. Bitora integra email, WhatsApp, fogli, fatturazione e API REST.',
            },
          ],
        },
        {
          type: 'cta',
          variant: 'demo',
          headline: 'Vuoi vedere la pipeline sul tuo processo?',
          body: 'Una demo breve, sui tuoi lead, senza slide decorative.',
          stageId: 'act',
        },
      ],
    },
  },
  {
    slug: 'quanto-costa-sito-web-pmi',
    title: 'Quanto costa un sito web per PMI nel 2026',
    excerpt:
      'Guida prezzi siti web PMI: fasce da €20/mese, tempi di consegna, cosa include un sito professionale e errori da evitare.',
    category: 'Siti Web',
    topic: 'web',
    status: 'PUBLISHED',
    angle: 'Il sito costa poco se deve esistere, di più se deve portare richieste.',
    abstract:
      'Un sito professionale per PMI parte da circa €20/mese. Business e su misura salgono quando servono catalogo, CRM e SEO locale vera. Ecco fasce, tempi e cosa non tagliare.',
    seoTitle: 'Quanto costa un sito web per PMI nel 2026 | Bitora',
    seoDescription:
      'Prezzi siti web PMI 2026: fasce da €20/mese, tempi di consegna, inclusioni e errori da evitare. Preventivo Bitora Piemonte.',
    coverImage: '/editorial/web-offer.png',
    coverAlt: 'Sito professionale mostrato su computer e smartphone',
    readTime: '6 min',
    ctaVariant: 'site-audit',
    caseStudySlugs: ['dalina', 'agriturismo-la-natura'],
    visualHints: ['responsive', 'seo-locale'],
    publishedAt: '2026-06-13T09:00:00.000Z',
    sources: [
      { title: 'Siti web professionali Bitora', url: 'https://bitora.it/siti-web-professionali/' },
    ],
    content: {
      stages,
      blocks: [
        {
          type: 'signal',
          heading: '€20/mese non è un sito: è il piano minimo per esserci',
          body: 'Landing in due settimane o vetrina con SEO locale: il prezzo segue l’obiettivo, non il numero di pagine decorative.',
          seconds: 60,
          stageId: 'signal',
        },
        {
          type: 'image',
          src: '/editorial/web-offer.png',
          alt: 'Sito professionale su computer e smartphone',
          eyebrow: 'Sito professionale',
          caption:
            'Design, contenuti, SEO e supporto: il prezzo cambia con ciò che il sito deve ottenere.',
          stageId: 'signal',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Fasce di prezzo',
          stageId: 'deep',
        },
        {
          type: 'list',
          items: [
            'Essenziale: da €20/mese — fino a 5 pagine, hosting, SSL, SEO base.',
            'Business: da €49/mese — pagine illimitate, blog, e-commerce, CRM.',
            'Premium su misura: preventivo per design e funzioni custom.',
          ],
          stageId: 'deep',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Tempi di consegna',
          stageId: 'deep',
        },
        {
          type: 'paragraph',
          html: 'Landing page: 7–14 giorni. Sito vetrina: 2–4 settimane. E-commerce o integrazioni: 3–6 settimane. I tempi dipendono da testi, foto e feedback.',
          stageId: 'deep',
        },
        {
          type: 'proof',
          title: 'Cosa non risparmiare',
          body: 'Performance (LCP sotto 2.5s), SEO tecnico, mobile-first e CTA chiare convertono più di effetti grafici costosi.',
          stageId: 'proof',
        },
        {
          type: 'case',
          slug: 'dalina',
          lesson:
            'Menu digitale + SEO locale Roero: il sito serve a farsi trovare e a far prenotare, non a “esserci”.',
          stageId: 'field',
        },
        {
          type: 'demo',
          kind: 'site-audit',
          title: ' tre domande da audit',
          body: 'Si trova su Google? Si capisce in 5 secondi? Si chiama o si scrive senza caccia al recapito?',
          stageId: 'field',
        },
        {
          type: 'paragraph',
          html: 'Per il territorio piemontese valuta la <a href="/siti-web-professionali/">SEO locale</a> e la guida <a href="/blog/web-design-carmagnola-2025/">web design Carmagnola</a>.',
          stageId: 'act',
        },
        {
          type: 'diagnostic',
          stageId: 'act',
          questions: [
            {
              id: 'goal',
              prompt: 'Cosa deve fare il sito nei prossimi 90 giorni?',
              options: [
                { id: 'find', label: 'Farsi trovare in zona', cta: 'site-audit' },
                { id: 'sell', label: 'Vendere o prendere ordini', cta: 'ecommerce' },
                { id: 'trust', label: 'Sembrare all’altezza del lavoro', cta: 'site-audit' },
              ],
            },
          ],
        },
        {
          type: 'faq',
          stageId: 'act',
          items: [
            {
              question: 'Quanto costa un sito web professionale per una PMI nel 2026?',
              answer:
                'Da circa €20/mese per l’essenziale fino a €49+/mese per business. Su misura ha preventivo dedicato.',
            },
            {
              question: 'Quanto tempo serve per realizzare un sito web?',
              answer:
                'Landing 7–14 giorni. Sito completo 2–6 settimane, in base a contenuti e revisioni.',
            },
          ],
        },
        {
          type: 'cta',
          variant: 'site-audit',
          headline: 'Vuoi un audit onesto del sito attuale?',
          body: 'Ti diciamo cosa frena le richieste, senza report di 40 pagine.',
          stageId: 'act',
        },
      ],
    },
  },
  {
    slug: 'gestionale-pmi-2026',
    title: 'Come scegliere un gestionale per PMI nel 2026',
    excerpt:
      'Guida completa alla scelta del gestionale aziendale giusto per la tua PMI. Criteri di valutazione, errori da evitare e consigli pratici per il 2026.',
    category: 'Gestionali',
    topic: 'gestionali',
    status: 'PUBLISHED',
    angle: 'Il gestionale giusto è quello che toglie Excel, non quello con più moduli.',
    abstract:
      'Scegliere un gestionale nel 2026 significa capire processi, integrazioni e chi lo userà davvero. Questa guida mette i criteri prima del catalogo funzioni.',
    seoTitle: 'Come scegliere un gestionale per PMI nel 2026 | Bitora',
    seoDescription:
      'Criteri per scegliere un gestionale PMI nel 2026: processi, errori da evitare, confronto soluzioni e approccio Bitora.',
    coverImage: '/editorial/digital-process.png',
    coverAlt: 'Passaggio da documenti sparsi a un gestionale organizzato',
    readTime: '8 min',
    ctaVariant: 'roi',
    caseStudySlugs: ['garavella-7-gestionale', 'mistral-gestionale'],
    visualHints: ['processo', 'magazzino'],
    publishedAt: '2026-03-15T08:00:00.000Z',
    sources: [{ title: 'Sistemi aziendali Bitora', url: 'https://bitora.it/sistemi-aziendali/' }],
    content: {
      stages,
      blocks: [
        {
          type: 'signal',
          heading: 'Guidare senza cruscotto',
          body: 'Se ordini, magazzino e cassa vivono su fogli diversi, non hai un problema software: hai un problema di visione. Il gestionale è il cruscotto, non un altro file.',
          seconds: 60,
          stageId: 'signal',
        },
        {
          type: 'image',
          src: '/editorial/digital-process.png',
          alt: 'Da documenti sparsi a sistema organizzato',
          eyebrow: 'Prima → dopo',
          caption: 'Il valore non è aggiungere uno strumento: è riunire dati e attività.',
          stageId: 'signal',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Perché un gestionale è fondamentale nel 2026',
          stageId: 'deep',
        },
        {
          type: 'paragraph',
          html: 'Un gestionale automatizza processi ripetitivi, riduce errori e centralizza informazioni. Non è un lusso da grande impresa: è tempo e denaro che smettono di disperdersi.',
          stageId: 'deep',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Criteri di scelta',
          stageId: 'deep',
        },
        {
          type: 'list',
          items: [
            'Chi lo usa ogni giorno: titolare, banco, tecnici.',
            'Quali dati devono stare insieme: scorte, menu, cassa, interventi.',
            'Integrazioni vere, non “connettori” da brochure.',
            'Tempo di adozione: se serve un corso di tre mesi, non partirà.',
          ],
          stageId: 'deep',
        },
        {
          type: 'proof',
          title: 'Segnale di mercato vs. campo Bitora',
          body: 'I report di settore parlano ancora di PMI su Excel. Sul campo, a Carmagnola e nel Roero, vediamo lo stesso schema: fogli, WhatsApp, cassa staccata dal magazzino.',
          stageId: 'proof',
        },
        {
          type: 'case',
          slug: 'garavella-7-gestionale',
          lesson:
            'Se un ingrediente finisce, la voce sparisce dal menu pubblico. Questo è un gestionale collegato al reale, non un ERP da scaffale.',
          stageId: 'field',
        },
        {
          type: 'demo',
          kind: 'roi',
          title: 'Quanto tempo perdi in riconciliazioni?',
          body: 'Ore/settimana su scorte, fogli e messaggi. Il calcolatore ROI traduce quelle ore in euro.',
          stageId: 'act',
        },
        {
          type: 'cta',
          variant: 'roi',
          headline: 'Stima il risparmio prima di scegliere il software',
          body: 'Poi, se i numeri reggono, si parla di demo sul tuo flusso.',
          stageId: 'act',
        },
      ],
    },
  },
  {
    slug: 'web-design-carmagnola-2025',
    title: 'Web design a Carmagnola: guida completa',
    excerpt:
      'Tutto quello che devi sapere per realizzare un sito web professionale a Carmagnola e dintorni. SEO locale, design moderno e strategie per farsi trovare.',
    category: 'Siti Web',
    topic: 'web',
    status: 'PUBLISHED',
    angle: 'A Carmagnola chi non è su Google non è in città.',
    abstract:
      'Artigiani, ristoratori e professionisti di Carmagnola si fanno trovare — o spariscono. Questa guida copre design, SEO locale e il percorso dalla ricerca al contatto.',
    seoTitle: 'Web design a Carmagnola: guida completa | Bitora',
    seoDescription:
      'Guida al web design a Carmagnola: sito professionale, SEO locale, costi e strategie per farsi trovare da clienti della zona.',
    coverImage: '/editorial/web-offer.png',
    coverAlt: 'Esperienza web coordinata su computer e smartphone',
    readTime: '7 min',
    ctaVariant: 'site-audit',
    caseStudySlugs: ['sartoria-kristina', 'bar-chantilly', 'speedy-pizza'],
    visualHints: ['carmagnola', 'maps'],
    publishedAt: '2025-11-20T08:00:00.000Z',
    sources: [
      { title: 'Siti web professionali', url: 'https://bitora.it/siti-web-professionali/' },
    ],
    content: {
      stages,
      blocks: [
        {
          type: 'signal',
          heading: '“Idraulico Carmagnola” non perdona',
          body: 'Chi cerca in zona apre tre risultati. Se il tuo sito è vecchio o assente, il lavoro va a chi ha investito nella presenza locale.',
          seconds: 60,
          stageId: 'signal',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Perché un sito web è essenziale a Carmagnola',
          stageId: 'deep',
        },
        {
          type: 'paragraph',
          html: 'Carmagnola ha un tessuto ricco: artigiani, commercianti, ristoratori, professionisti. Molte attività hanno ancora un sito obsoleto o nessuno. Il sito è il commerciale che lavora sempre: servizi, domande, richieste, reputazione.',
          stageId: 'deep',
        },
        {
          type: 'proof',
          title: 'SEO locale, non slogan',
          body: 'Orari, mappa, recensioni, schema e pagine chiare. Senza questi pezzi il design resta una cartolina.',
          stageId: 'proof',
        },
        {
          type: 'case',
          slug: 'sartoria-kristina',
          lesson:
            'Portfolio + NFC recensioni: il sito racconta il lavoro, il tap raccoglie la prova sociale in negozio.',
          stageId: 'field',
        },
        {
          type: 'case',
          slug: 'speedy-pizza',
          lesson: 'Menu e recensioni devono stare a un gesto, non a una ricerca.',
          stageId: 'field',
        },
        {
          type: 'cta',
          variant: 'site-audit',
          headline: 'Vuoi farti trovare a Carmagnola e dintorni?',
          body: 'Partiamo da come ti cercano oggi, non da una homepage nuova per vanità.',
          stageId: 'act',
        },
      ],
    },
  },
  {
    slug: 'tessere-nfc-ristoranti',
    title: 'Tessere NFC per ristoranti: come funzionano',
    excerpt:
      'Come le tessere NFC stanno rivoluzionando la raccolta recensioni nei ristoranti. Funzionamento, vantaggi e casi reali di utilizzo.',
    category: 'NFC',
    topic: 'nfc',
    status: 'PUBLISHED',
    angle: 'La recensione non si chiede: si tap.',
    abstract:
      'I clienti felici raramente recensiscono da soli. Una tessera NFC sul tavolo apre Google in un gesto, senza app e senza imbarazzo. Ecco come funziona nei ristoranti e cosa abbiamo visto sul campo.',
    seoTitle: 'Tessere NFC per ristoranti: come funzionano | Bitora',
    seoDescription:
      'Guida alle tessere NFC per ristoranti: come funzionano, recensioni Google, vantaggi concreti e casi Bitora nel food.',
    coverImage: '/editorial/nfc-restaurant.png',
    coverAlt: 'Uso di una tessera NFC al tavolo di un ristorante',
    readTime: '6 min',
    ctaVariant: 'nfc',
    caseStudySlugs: ['speedy-pizza', 'bar-chantilly', 'sartoria-kristina'],
    visualHints: ['tap', 'nfc'],
    publishedAt: '2025-10-05T08:00:00.000Z',
    sources: [
      { title: 'Ecosistema NFC Bitora', url: 'https://bitora.it/nfc-ecosystem/' },
      { title: 'Shop NFC Bitora', url: 'https://shopnfc.bitora.it/' },
    ],
    content: {
      stages,
      blocks: [
        {
          type: 'signal',
          heading: 'Dieci secondi, zero ricerca',
          body: 'Il cliente avvicina il telefono, si apre la scheda Google, lascia le stelle. Niente QR storti, niente “ci lasci una recensione?” a voce.',
          seconds: 60,
          stageId: 'signal',
        },
        {
          type: 'image',
          src: '/editorial/nfc-restaurant.png',
          alt: 'Cliente avvicina lo smartphone a una tessera NFC sul tavolo',
          eyebrow: 'Tap → azione',
          caption: 'Nessuna app, nessuna ricerca manuale.',
          stageId: 'signal',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Il problema delle recensioni nei ristoranti',
          stageId: 'deep',
        },
        {
          type: 'paragraph',
          html: 'I clienti soddisfatti recensiscono poco, quelli insoddisfatti quasi sempre. Il rating non riflette la sala. Chiedere a voce è imbarazzante. L’NFC toglie la frizione.',
          stageId: 'deep',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Cos’è l’NFC e come funziona',
          stageId: 'deep',
        },
        {
          type: 'paragraph',
          html: 'Near Field Communication, la stessa tecnologia del pagamento contactless. Il chip invia un link: recensione Google, menu, WhatsApp. iPhone dal 7 in poi e Android moderni, senza app.',
          stageId: 'deep',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'Posizionamento: tavolo, cassa o porta-conto, con logo del locale.',
            'Il cliente avvicina il telefono a fine pasto.',
            'Si apre la scheda Google già pronta.',
            'Stelle e due righe in pochi secondi.',
          ],
          stageId: 'deep',
        },
        {
          type: 'proof',
          title: 'Cosa non diciamo',
          body: 'Non inventiamo un +300% recensioni universale. Nei locali che seguiamo, il tap riduce la fatica: i numeri arrivano dal profilo Google del singolo ristorante.',
          stageId: 'proof',
        },
        {
          type: 'case',
          slug: 'bar-chantilly',
          lesson:
            'Tessere sui tavoli di un bar-tabacchi storico: il tap è discreto e sta nel rito del caffè, non in una campagna.',
          stageId: 'field',
        },
        {
          type: 'demo',
          kind: 'nfc-tap',
          title: 'Simula il tap',
          body: 'Avvicina (o clicca) il telefono alla tessera: il link parte. In sala succede lo stesso, senza spiegazioni lunghe.',
          stageId: 'field',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Oltre le recensioni',
          stageId: 'field',
        },
        {
          type: 'list',
          items: [
            'Menu digitale aggiornato.',
            'WhatsApp e social.',
            'Fedeltà a punti.',
            'Destinazione del chip cambiabile senza sostituire la tessera.',
          ],
          stageId: 'field',
        },
        {
          type: 'faq',
          stageId: 'act',
          items: [
            {
              question: 'Funziona con tutti i telefoni?',
              answer: 'Smartphone moderni: iPhone dal 7 e Android recenti. Nessuna app.',
            },
            {
              question: 'La tessera ha bisogno di batteria?',
              answer: 'No. È passiva, prende energia dal telefono, dura anni.',
            },
            {
              question: 'Posso personalizzarla con il mio logo?',
              answer: 'Sì: brand, colori, logo e pellicole intercambiabili.',
            },
          ],
        },
        {
          type: 'cta',
          variant: 'nfc',
          headline: 'Vuoi le tessere NFC per il tuo locale?',
          body: 'Personalizzate, programmate, pronte da mettere in sala. Oppure le prendi sullo shop.',
          stageId: 'act',
        },
      ],
    },
  },
  {
    slug: 'ai-siti-pmi-senza-hype',
    title: 'Siti AI per PMI: cosa tiene e cosa è teatro',
    excerpt:
      'Bozza AI: come Bitora usa l’intelligenza artificiale sui siti e sui processi, senza vendere magia e senza metriche inventate.',
    category: 'AI',
    topic: 'ai',
    status: 'DRAFT',
    angle:
      'L’AI utile è quella che toglie un passaggio ripetitivo, non quella che riscrive l’homepage ogni settimana.',
    abstract:
      'I tool “sito in 5 minuti” accelerano la prima bozza e lasciano scoperti SEO locale, integrazioni e contenuti veri. Questa bozza, generata in pipeline e non pubblicata, inquadra il segnale e lo riporta ai lavori Bitora.',
    seoTitle: 'Siti AI per PMI: cosa funziona davvero | Bitora',
    seoDescription:
      'Come valutare siti e automazioni AI per PMI senza hype: limiti dei builder, processi Bitora e casi sul territorio.',
    coverImage: '/editorial/operations.png',
    coverAlt: 'Flusso operativo digitale con automazioni discrete',
    readTime: '7 min',
    ctaVariant: 'contact',
    caseStudySlugs: ['ricambixstufe', 'simone-contegiacomo'],
    visualHints: ['ai-doc', 'editor'],
    generatedByAi: true,
    sources: [{ title: 'Ticketing Bitora', url: 'https://bitora.it/ticketing/' }],
    content: {
      stages,
      blocks: [
        {
          type: 'signal',
          heading: 'Un sito generato non è un sistema',
          body: 'L’AI scrive testi e layout in minuti. Non conosce il magazzino, le zone di intervento, né come un cliente di Carmagnola cerca su Maps.',
          seconds: 60,
          stageId: 'signal',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Segnale esterno vs. lavoro Bitora',
          stageId: 'deep',
        },
        {
          type: 'paragraph',
          html: 'I builder AI vanno bene per una bozza. Sul campo servono dati strutturati, CTA, performance e un umano che decide cosa pubblicare — lo stesso principio di questo magazine: l’AI propone, l’admin pubblica.',
          stageId: 'deep',
        },
        {
          type: 'proof',
          title: 'Niente metriche da comunicato',
          body: 'Questa bozza non cita aumenti di fatturato o ranking. Resta in DRAFT finché un admin non verifica fonti, casi e tono.',
          stageId: 'proof',
        },
        {
          type: 'case',
          slug: 'ricambixstufe',
          lesson:
            'Un catalogo ricambi non si improvvisa con un prompt: serve identificazione del componente, admin e ordini.',
          stageId: 'field',
        },
        {
          type: 'cta',
          variant: 'contact',
          headline: 'Vuoi AI sul processo, non sulla brochure?',
          body: 'Partiamo da un passaggio ripetitivo (documenti, ticket, copy) e lo misuriamo.',
          stageId: 'act',
        },
      ],
    },
  },
  {
    slug: 'quanto-costa-ecommerce-b2b',
    title: 'Quanto costa un e-commerce B2B nel 2026',
    excerpt:
      'Le voci che decidono il prezzo di un portale B2B: catalogo, listini per cliente, ordini, pagamenti e integrazione con il gestionale.',
    category: 'E-commerce',
    topic: 'ecommerce',
    status: 'DRAFT',
    angle: 'In un portale B2B la vetrina costa poco: il prezzo lo fanno listini e gestionale.',
    abstract:
      'Un e-commerce B2B non ha un prezzo di listino. Costano soprattutto i listini per cliente, le regole di ordine e la sincronizzazione con il gestionale. Un portale essenziale è operativo in 4–6 settimane; le integrazioni si aggiungono per fasi.',
    seoTitle: 'Quanto costa un e-commerce B2B nel 2026 | Bitora',
    seoDescription:
      'Cosa decide il prezzo di un e-commerce B2B: catalogo, listini per cliente, ordini, pagamenti e gestionale. Guida per aziende in Piemonte.',
    coverImage: '/editorial/ecommerce.png',
    coverAlt: 'Portale e-commerce B2B con catalogo riservato e listini per cliente',
    readTime: '7 min',
    ctaVariant: 'ecommerce',
    caseStudySlugs: ['ricambixstufe'],
    visualHints: ['listini', 'gestionale'],
    publishedAt: '2026-11-20T08:00:00.000Z',
    sources: [
      { title: 'E-commerce B2B Bitora', url: 'https://bitora.it/e-commerce-b2b/' },
      { title: 'Caso RicambiXStufe', url: 'https://bitora.it/progetti/ricambixstufe/' },
    ],
    content: {
      stages,
      blocks: [
        {
          type: 'signal',
          heading: 'Il prezzo lo decide il gestionale, non il carrello',
          body: 'Catalogo e carrello sono la parte facile. Listini per cliente, sconti a scaglioni e sincronizzazione con il gestionale sono le voci che separano un preventivo dall’altro.',
          seconds: 60,
          stageId: 'signal',
        },
        {
          type: 'image',
          src: '/editorial/ecommerce.png',
          alt: 'Schermata di un portale e-commerce B2B con catalogo e ordini',
          eyebrow: 'E-commerce B2B',
          caption: 'Catalogo riservato, listini dedicati e ordini che arrivano già nel gestionale.',
          stageId: 'signal',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Quanto costa un e-commerce B2B: la risposta breve',
          stageId: 'deep',
        },
        {
          type: 'paragraph',
          html: 'Un e-commerce B2B costa in base a quanti prodotti e listini gestisci, a come ordinano i tuoi clienti e a quanto il portale deve parlare con il gestionale. Un portale essenziale, con catalogo riservato alle Partite IVA e listini per cliente, è operativo in 4–6 settimane. Le integrazioni con ERP, magazzino e fatturazione si aggiungono per fasi, quando il canale porta già ordini.',
          stageId: 'deep',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Le sei voci che spostano il preventivo',
          stageId: 'deep',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'Catalogo: numero di articoli, varianti, schede tecniche e compatibilità (per esempio ricambi per modello).',
            'Listini: uno unico costa poco; listini per cliente, per gruppo o a scaglioni di quantità richiedono più logica.',
            'Accesso: area riservata alle Partite IVA, approvazione degli account, più utenti per la stessa azienda.',
            'Ordini: riordino rapido, ordine da codice articolo o da file, richiesta di preventivo al posto del pagamento.',
            'Pagamenti: bonifico, RiBa, fido cliente e pagamento a 30 o 60 giorni oltre alla carta.',
            'Integrazione con il gestionale: import ed export manuale, sincronizzazione notturna o in tempo reale. Di solito è la voce più pesante.',
          ],
          stageId: 'deep',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Piattaforma pronta o portale su misura?',
          stageId: 'deep',
        },
        {
          type: 'paragraph',
          html: 'Le piattaforme in abbonamento con un modulo B2B partono prima, ma si pagano ogni mese, spesso in proporzione al fatturato o ai clienti attivi, e gestiscono male i listini complessi. Un portale su misura costa di più all’inizio, poi non ha commissioni sulle vendite né canoni per numero di clienti. Con pochi listini e un catalogo semplice una piattaforma pronta può bastare. Se il tuo vantaggio sta proprio in come gestisci prezzi e clienti, conviene il su misura.',
          stageId: 'deep',
        },
        {
          type: 'proof',
          title: 'Dove si risparmia davvero',
          body: 'Non sul design, ma sui dati. Un catalogo pulito (codici, descrizioni, immagini) e listini già definiti in un foglio condiviso prima dello sviluppo tagliano settimane di lavoro e rifacimenti.',
          stageId: 'proof',
        },
        {
          type: 'case',
          slug: 'ricambixstufe',
          lesson:
            'Catalogo di ricambi con compatibilità per modello: il budget è andato nella ricerca e nella qualità dei dati, non nella grafica.',
          stageId: 'field',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Come leggere un preventivo e-commerce B2B',
          stageId: 'act',
        },
        {
          type: 'list',
          items: [
            'Chiedi un prezzo fisso per ogni fase, non un monte ore aperto.',
            'Verifica di chi restano codice, dominio e dati.',
            'Chiedi se ci sono commissioni sulle vendite o canoni per numero di clienti.',
            'Fatti spiegare cosa succede se un domani cambi gestionale.',
          ],
          stageId: 'act',
        },
        {
          type: 'paragraph',
          html: 'Per vedere come lavoriamo su questi progetti guarda la pagina <a href="/e-commerce-b2b/">e-commerce B2B in Piemonte</a> e il caso <a href="/progetti/ricambixstufe/">RicambiXStufe</a>. Se vendi anche ai privati, parti da <a href="/e-commerce/">realizzazione e-commerce</a>.',
          stageId: 'act',
        },
        {
          type: 'faq',
          stageId: 'act',
          items: [
            {
              question: 'Quanto costa realizzare un e-commerce B2B?',
              answer:
                'Dipende da catalogo, listini e integrazione con il gestionale. Bitora lavora a prezzo fisso per fasi: prima il portale essenziale con catalogo riservato e listini per cliente, poi le integrazioni.',
            },
            {
              question: 'Quanto tempo serve per un e-commerce B2B?',
              answer:
                'Un portale essenziale è operativo in 4–6 settimane. Le integrazioni con ERP e magazzino si aggiungono dopo, a canale avviato.',
            },
            {
              question: 'Un e-commerce B2B su misura ha commissioni sulle vendite?',
              answer:
                'No: con un portale su misura non ci sono commissioni sulle vendite né canoni per numero di clienti B2B. Molte piattaforme in abbonamento legano invece il costo al fatturato o ai clienti attivi.',
            },
          ],
        },
        {
          type: 'cta',
          variant: 'ecommerce',
          headline: 'Vuoi una stima sul tuo catalogo?',
          body: 'Analizziamo gratis catalogo e listini e ti diamo un preventivo a fasi, a prezzo fisso.',
          stageId: 'act',
        },
      ],
    },
  },
  {
    slug: 'quanto-costa-gestionale-su-misura',
    title: 'Quanto costa un gestionale su misura per PMI',
    excerpt:
      'Moduli, utenti, integrazioni e migrazione dei dati: cosa decide il prezzo di un gestionale su misura e come partire per fasi.',
    category: 'Gestionali',
    topic: 'gestionali',
    status: 'DRAFT',
    angle: 'Il gestionale più caro è quello che il team non usa.',
    abstract:
      'Il costo di un gestionale su misura dipende da quanti processi copre, da chi lo usa e da quali sistemi deve collegare. Partire dal modulo che oggi fa perdere più tempo porta il primo risultato in 3–6 settimane e limita il rischio.',
    seoTitle: 'Quanto costa un gestionale su misura per PMI | Bitora',
    seoDescription:
      'Da cosa dipende il prezzo di un gestionale su misura: moduli, utenti, integrazioni e migrazione dati. Come partire per fasi senza sprecare budget.',
    coverImage: '/editorial/operations.png',
    coverAlt: 'Gestionale su misura con preventivi, magazzino e interventi',
    readTime: '7 min',
    ctaVariant: 'roi',
    caseStudySlugs: ['mistral-gestionale', 'garavella-7-gestionale'],
    visualHints: ['moduli', 'roi'],
    publishedAt: '2026-11-20T09:00:00.000Z',
    sources: [
      { title: 'Gestionali su misura Bitora', url: 'https://bitora.it/sistemi-aziendali/' },
      {
        title: 'Calcolatore ROI gestionale',
        url: 'https://bitora.it/tools/calcolatore-roi-gestionale/',
      },
    ],
    content: {
      stages,
      blocks: [
        {
          type: 'signal',
          heading: 'Il gestionale più caro è quello che nessuno usa',
          body: 'Un software da pochi euro al mese che costringe a tenere ancora Excel costa più di un gestionale su misura che lo elimina. Il prezzo si misura nelle ore che toglie al team.',
          seconds: 60,
          stageId: 'signal',
        },
        {
          type: 'image',
          src: '/editorial/operations.png',
          alt: 'Dashboard di un gestionale con preventivi, magazzino e interventi',
          eyebrow: 'Gestionale su misura',
          caption: 'Un solo posto per preventivi, ordini, magazzino e interventi.',
          stageId: 'signal',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Quanto costa un gestionale su misura: la risposta breve',
          stageId: 'deep',
        },
        {
          type: 'paragraph',
          html: 'Un gestionale su misura costa in base a quanti processi copre, quante persone lo usano e con quali sistemi deve parlare. Il modo più sicuro per spendere bene è partire dal modulo che oggi fa perdere più tempo, per esempio interventi, magazzino o preventivi. Il primo modulo operativo arriva in 3–6 settimane; il resto si aggiunge solo se i numeri lo giustificano.',
          stageId: 'deep',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Cosa fa salire il prezzo',
          stageId: 'deep',
        },
        {
          type: 'list',
          items: [
            'Numero di moduli: anagrafiche, preventivi, ordini, magazzino, interventi, fatturazione.',
            'Ruoli e permessi: titolare, ufficio, tecnici sul campo, clienti con accesso.',
            'Uso da smartphone, anche offline, per chi lavora fuori sede.',
            'Integrazioni: fatturazione elettronica, e-commerce, contabilità, dispositivi.',
            'Migrazione dei dati da Excel o dal vecchio software.',
            'Documenti generati: PDF, rapportini firmati, report per la direzione.',
          ],
          stageId: 'deep',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Su misura o software pronto?',
          stageId: 'deep',
        },
        {
          type: 'paragraph',
          html: 'Un gestionale pronto in abbonamento costa poco per utente e parte subito, ma sei tu ad adattarti al software. Il su misura chiede un investimento iniziale e si adatta al tuo processo. Regola pratica: se lavori in modo standard, prova prima un software pronto. Se il tuo vantaggio sta proprio nel processo, o se ogni giorno lavori “intorno” al software, il su misura si ripaga.',
          stageId: 'deep',
        },
        {
          type: 'proof',
          title: 'Il calcolo che conta',
          body: 'Ore perse a settimana × persone coinvolte × costo orario. Se tre persone perdono quattro ore a settimana a riconciliare fogli e messaggi, sono più di 600 ore l’anno. Quel numero è il tetto ragionevole dell’investimento.',
          stageId: 'proof',
        },
        {
          type: 'case',
          slug: 'mistral-gestionale',
          lesson:
            'Preventivi, clienti e interventi in un unico gestionale, con l’AI che prepara le bozze dei preventivi: si è partiti dal processo che rubava più ore.',
          stageId: 'field',
        },
        {
          type: 'demo',
          kind: 'roi',
          title: 'Quanto ti costa non averlo?',
          body: 'Inserisci ore perse e persone coinvolte: il calcolatore ROI ti restituisce il risparmio annuo in euro.',
          stageId: 'act',
        },
        {
          type: 'paragraph',
          html: 'Approfondisci con la guida <a href="/blog/gestionale-pmi-2026/">come scegliere un gestionale per PMI</a>, prova il <a href="/tools/calcolatore-roi-gestionale/">calcolatore ROI</a> o guarda come lavoriamo sui <a href="/sistemi-aziendali/">gestionali su misura</a>.',
          stageId: 'act',
        },
        {
          type: 'faq',
          stageId: 'act',
          items: [
            {
              question: 'Quanto costa un gestionale su misura per una PMI?',
              answer:
                'Dipende da moduli, utenti e integrazioni. Bitora definisce con un’analisi gratuita una roadmap a fasi con prezzo fisso: si parte dal modulo con più impatto e si investe nel resto solo se i risultati ci sono.',
            },
            {
              question: 'Quanto tempo serve per avere un gestionale su misura?',
              answer:
                'Il primo modulo operativo arriva in 3–6 settimane. Poi il software cresce per fasi, con il team che lo usa e dà feedback.',
            },
            {
              question: 'Il codice del gestionale resta mio?',
              answer:
                'Sì: con Bitora dominio, codice e dati restano del cliente, senza vincoli di licenza sul software sviluppato.',
            },
          ],
        },
        {
          type: 'cta',
          variant: 'roi',
          headline: 'Prima i numeri, poi il software',
          body: 'Stima le ore che recuperi. Se il conto torna, prepariamo una demo sul tuo flusso.',
          stageId: 'act',
        },
      ],
    },
  },
  {
    slug: 'quanto-costa-ecommerce-piccola-azienda',
    title: 'Quanto costa un e-commerce per una piccola azienda',
    excerpt:
      'Costi iniziali e ricorrenti di un negozio online: piattaforma, catalogo, pagamenti, spedizioni e manutenzione. Shopify, WooCommerce o su misura.',
    category: 'E-commerce',
    topic: 'ecommerce',
    status: 'DRAFT',
    angle: 'Un negozio online costa due volte: per farlo e per farlo funzionare.',
    abstract:
      'Il prezzo di un e-commerce per piccole aziende si divide in costi iniziali (progetto, catalogo, configurazione) e ricorrenti (piattaforma, commissioni, manutenzione, promozione). Scegliere la piattaforma in base al catalogo e a come vendi evita di pagare due volte.',
    seoTitle: 'Quanto costa un e-commerce per piccole aziende | Bitora',
    seoDescription:
      'Costi iniziali e ricorrenti di un e-commerce per piccole aziende: piattaforma, catalogo, pagamenti, spedizioni. Shopify, WooCommerce o su misura.',
    coverImage: '/editorial/ecommerce.png',
    coverAlt: 'Negozio online visto da smartphone con carrello e checkout',
    readTime: '6 min',
    ctaVariant: 'ecommerce',
    caseStudySlugs: ['shopnfc'],
    visualHints: ['checkout', 'mobile'],
    publishedAt: '2026-11-20T10:00:00.000Z',
    sources: [
      { title: 'Realizzazione e-commerce Bitora', url: 'https://bitora.it/e-commerce/' },
      { title: 'Caso Shop NFC Bitora', url: 'https://bitora.it/progetti/shopnfc/' },
    ],
    content: {
      stages,
      blocks: [
        {
          type: 'signal',
          heading: 'Il negozio online costa due volte',
          body: 'Una volta per costruirlo e ogni mese per farlo funzionare. Chi guarda solo il preventivo iniziale si ritrova con canoni, plugin e commissioni che non aveva messo in conto.',
          seconds: 60,
          stageId: 'signal',
        },
        {
          type: 'image',
          src: '/editorial/ecommerce.png',
          alt: 'Negozio online con catalogo prodotti e carrello',
          eyebrow: 'E-commerce',
          caption: 'Catalogo chiaro, checkout veloce, spedizioni senza sorprese.',
          stageId: 'signal',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Quanto costa un e-commerce: la risposta breve',
          stageId: 'deep',
        },
        {
          type: 'paragraph',
          html: 'Il costo di un e-commerce per una piccola azienda si divide in due parti: quello iniziale (progetto, grafica, caricamento del catalogo, configurazione di pagamenti e spedizioni) e quello ricorrente (piattaforma o hosting, commissioni sui pagamenti, estensioni, manutenzione e promozione). Un negozio con un catalogo semplice è online in 3–8 settimane; più prodotti, varianti e integrazioni significano più tempo e più budget.',
          stageId: 'deep',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Costi iniziali',
          stageId: 'deep',
        },
        {
          type: 'list',
          items: [
            'Progetto e grafica del negozio, pensati prima per lo smartphone.',
            'Catalogo: schede prodotto, varianti, foto e testi. Se non sono pronti, prepararli è spesso la voce più sottovalutata.',
            'Pagamenti: carta, PayPal, Satispay o bonifico, con le relative configurazioni.',
            'Spedizioni: tariffe per zona o peso, ritiro in negozio, integrazione con il corriere.',
            'Aspetti legali: privacy, cookie, condizioni di vendita e diritto di recesso.',
          ],
          stageId: 'deep',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Costi ricorrenti da mettere in conto',
          stageId: 'deep',
        },
        {
          type: 'list',
          items: [
            'Canone della piattaforma o hosting del sito.',
            'Commissioni su ogni pagamento, applicate dai gateway.',
            'App e plugin a pagamento per funzioni extra.',
            'Manutenzione, aggiornamenti e sicurezza.',
            'Promozione: SEO, Google Shopping e campagne.',
          ],
          stageId: 'deep',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Shopify, WooCommerce o su misura?',
          stageId: 'deep',
        },
        {
          type: 'paragraph',
          html: 'Shopify parte in fretta e scarica su di sé hosting e sicurezza, ma ha un canone mensile e molte funzioni passano da app a pagamento. WooCommerce non ha canone di piattaforma ma richiede hosting e manutenzione costante. Il su misura ha senso quando il negozio deve fare cose che le piattaforme non fanno bene: listini B2B, configuratori, integrazione stretta con il gestionale. Per questi casi c’è la guida su <a href="/blog/quanto-costa-ecommerce-b2b/">quanto costa un e-commerce B2B</a>.',
          stageId: 'deep',
        },
        {
          type: 'proof',
          title: 'Dove non risparmiare',
          body: 'Foto e schede prodotto, velocità da smartphone e un checkout in pochi passaggi vendono più di qualsiasi effetto grafico. Sono anche le prime cose che Google e i clienti notano.',
          stageId: 'proof',
        },
        {
          type: 'case',
          slug: 'shopnfc',
          lesson:
            'Catalogo per privati e aziende con prezzi a scaglioni, pagamento immediato e programmazione inclusa: il negozio segue il modo in cui i clienti ordinano davvero.',
          stageId: 'field',
        },
        {
          type: 'paragraph',
          html: 'Se sei a Carmagnola, Carignano o in provincia di Torino, guarda come lavoriamo sulla <a href="/e-commerce/">realizzazione di e-commerce</a>.',
          stageId: 'act',
        },
        {
          type: 'faq',
          stageId: 'act',
          items: [
            {
              question: 'Quanto costa aprire un e-commerce per una piccola azienda?',
              answer:
                'Dipende da catalogo, piattaforma e integrazioni. Oltre al costo iniziale vanno messi in conto canone o hosting, commissioni sui pagamenti, manutenzione e promozione.',
            },
            {
              question: 'Quanto tempo serve per mettere online un e-commerce?',
              answer:
                'Con catalogo e contenuti pronti, un negozio online è attivo in 3–8 settimane. Il tempo cresce con prodotti, varianti e integrazioni.',
            },
            {
              question: 'Meglio Shopify o WooCommerce per una piccola azienda?',
              answer:
                'Shopify è più semplice da gestire ma ha canone e app a pagamento; WooCommerce costa meno di piattaforma ma richiede hosting e manutenzione. La scelta dipende da catalogo, budget e da chi seguirà il negozio.',
            },
          ],
        },
        {
          type: 'cta',
          variant: 'ecommerce',
          headline: 'Vuoi sapere quanto costerebbe il tuo negozio?',
          body: 'Raccontaci cosa vendi e a chi: ricevi un preventivo modulare a prezzo fisso.',
          stageId: 'act',
        },
      ],
    },
  },
  {
    slug: 'excel-o-gestionale-pmi',
    title: 'Excel o gestionale? 7 segnali che è ora di cambiare',
    excerpt:
      'Errori di versione, dati doppi, ore perse a riconciliare: i segnali concreti che indicano quando Excel non basta più a una PMI.',
    category: 'Gestionali',
    topic: 'gestionali',
    status: 'DRAFT',
    angle: 'Excel non è il problema: lo diventa quando è l’unico posto dove vive l’azienda.',
    abstract:
      'Excel funziona finché una persona sola gestisce pochi dati. Quando più persone aggiornano gli stessi fogli, i dati si duplicano e servono ore per riconciliarli, un gestionale fa risparmiare tempo ed errori. Ecco sette segnali per capire se è il momento.',
    seoTitle: 'Excel o gestionale? 7 segnali per PMI | Bitora',
    seoDescription:
      'Sette segnali concreti per capire quando Excel non basta più alla tua PMI e come passare a un gestionale senza fermare il lavoro.',
    coverImage: '/editorial/digital-process.png',
    coverAlt: 'Passaggio da fogli Excel sparsi a un gestionale organizzato',
    readTime: '5 min',
    ctaVariant: 'roi',
    caseStudySlugs: ['garavella-7-gestionale'],
    visualHints: ['excel', 'processo'],
    publishedAt: '2026-11-20T11:00:00.000Z',
    sources: [{ title: 'Sistemi aziendali Bitora', url: 'https://bitora.it/sistemi-aziendali/' }],
    content: {
      stages,
      blocks: [
        {
          type: 'signal',
          heading: 'Excel non è il problema',
          body: 'Lo diventa quando è l’unico posto in cui vivono ordini, clienti e magazzino, e ogni persona ne ha una copia diversa.',
          seconds: 60,
          stageId: 'signal',
        },
        {
          type: 'image',
          src: '/editorial/digital-process.png',
          alt: 'Fogli di calcolo sparsi che confluiscono in un gestionale',
          eyebrow: 'Prima → dopo',
          caption: 'Dai fogli sparsi a un unico archivio aggiornato.',
          stageId: 'signal',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Quando passare da Excel a un gestionale',
          stageId: 'deep',
        },
        {
          type: 'paragraph',
          html: 'Excel basta finché una persona gestisce pochi dati. Conviene passare a un gestionale quando più persone aggiornano gli stessi fogli, quando servono ore per capire qual è la versione giusta o quando un errore di copia finisce in un preventivo o in un ordine. Se riconosci almeno tre dei segnali qui sotto, il gestionale ti fa già risparmiare.',
          stageId: 'deep',
        },
        {
          type: 'heading',
          level: 2,
          text: 'I sette segnali',
          stageId: 'deep',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'Esistono più versioni dello stesso file e nessuno è sicuro di quale sia aggiornata.',
            'Gli stessi dati vengono copiati a mano da un foglio all’altro.',
            'Per sapere quanto hai in magazzino devi chiedere a qualcuno.',
            'Preventivi e ordini si preparano rifacendo ogni volta gli stessi conti.',
            'Le informazioni dei tecnici o del banco arrivano via WhatsApp e vanno ricopiate.',
            'Se la persona che “sa come funziona il file” è in ferie, il lavoro rallenta.',
            'A fine mese servono giorni per avere numeri affidabili.',
          ],
          stageId: 'deep',
        },
        {
          type: 'proof',
          title: 'Il costo nascosto',
          body: 'Le ore spese a riconciliare fogli non compaiono in nessun bilancio, ma si pagano ogni settimana. Moltiplicale per le persone coinvolte e per il costo orario: è il budget che stai già spendendo.',
          stageId: 'proof',
        },
        {
          type: 'case',
          slug: 'garavella-7-gestionale',
          lesson:
            'Scorte, menu, cassa e presenze erano su strumenti diversi. Collegati in un gestionale, quando un ingrediente finisce la voce sparisce da sola dal menu pubblico.',
          stageId: 'field',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Come passare senza fermare il lavoro',
          stageId: 'act',
        },
        {
          type: 'list',
          items: [
            'Parti dal processo che fa perdere più tempo, non da tutto insieme.',
            'Importa i dati esistenti da Excel invece di ricominciare da zero.',
            'Fai usare il primo modulo al team per qualche settimana prima di aggiungere il resto.',
            'Tieni Excel per le analisi: il gestionale diventa la fonte dei dati, il foglio lo strumento per leggerli.',
          ],
          stageId: 'act',
        },
        {
          type: 'paragraph',
          html: 'Per i costi leggi <a href="/blog/quanto-costa-gestionale-su-misura/">quanto costa un gestionale su misura</a>; per scegliere, la guida <a href="/blog/gestionale-pmi-2026/">come scegliere un gestionale per PMI</a>. Qui trovi i nostri <a href="/sistemi-aziendali/">gestionali su misura</a>.',
          stageId: 'act',
        },
        {
          type: 'faq',
          stageId: 'act',
          items: [
            {
              question: 'Quando una PMI dovrebbe passare da Excel a un gestionale?',
              answer:
                'Quando più persone aggiornano gli stessi fogli, i dati vengono ricopiati a mano e servono ore per avere numeri affidabili. Sono segnali che il tempo perso costa già più del software.',
            },
            {
              question: 'Si possono importare i dati da Excel nel gestionale?',
              answer:
                'Sì. Anagrafiche, articoli e storico si importano dai fogli esistenti, così il team non riparte da zero.',
            },
          ],
        },
        {
          type: 'cta',
          variant: 'roi',
          headline: 'Quante ore ti costa Excel?',
          body: 'Il calcolatore ROI te lo dice in due minuti, in euro.',
          stageId: 'act',
        },
      ],
    },
  },
];
