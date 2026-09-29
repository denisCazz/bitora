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
    caseStudySlugs: ['garavella-7-gestionale', 'tropini-service'],
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
];
