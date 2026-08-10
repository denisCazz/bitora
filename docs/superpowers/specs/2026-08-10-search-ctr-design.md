# Design SEO per aumentare il CTR organico

Data: 2026-08-10  
Stato: approvato

## Obiettivo

Aumentare il CTR organico qualificato per l'offerta di siti web ed e-commerce rivolta a PMI piemontesi, senza sacrificare impressioni, posizione media o qualità dei lead.

Il primo ciclo punta a un CTR non-brand intorno all'1% sulle pagine prioritarie, misurato su 28 giorni. La media complessiva del dominio non sarà usata da sola perché mescola query, posizioni e intenti diversi.

## Contesto

I dati Search Console del 12 luglio–8 agosto 2026 mostrano:

- 1 clic e 588 impressioni sulla homepage apex;
- varianti `www` e apex, oltre a URL con e senza slash;
- 167 impressioni e posizione media 8 per `web development`, senza clic;
- 119 impressioni e posizione intorno a 31 per `ecommerce b2b piemonte`;
- vecchie URL ancora visibili, tra cui `/e-commerce-piemonte/`, `/siti-web-torino/` e `/tessere-nfc-torino/`.

Il sito live reindirizza attualmente `www` verso apex con 302. Astro usa canonical apex, slash finale e redirect dalle vecchie rotte, ma i segnali non sono ancora consolidati completamente nei risultati di ricerca.

## Strategia scelta

1. Consolidare host e URL prima di valutare gli snippet.
2. Rendere homepage, siti web ed e-commerce coerenti con intenti distinti.
3. Misurare un solo ciclo di title e description ogni 28 giorni.

Non verranno create nuove landing per città in questa iterazione. Il volume attuale non giustifica il rischio di pagine doorway o cannibalizzazione.

## Architettura URL

La sola forma indicizzabile è:

`https://bitora.it/<percorso>/`

### Redirect

- HTTP verso HTTPS con 301.
- `www.bitora.it` verso `bitora.it` con 301, preservando path e query.
- Le vecchie rotte mantengono redirect 301 verso la destinazione più pertinente.
- Le richieste senza slash vengono normalizzate verso la variante con slash.
- Quando possibile, ogni variante raggiunge la canonical in un solo salto.

Redirect prioritari:

- `/e-commerce-piemonte/` → `/e-commerce/`
- `/siti-web-torino/` → `/siti-web-professionali/`
- `/tessere-nfc-torino/` → `/nfc-ecosystem/`

Sitemap, canonical, structured data e link interni devono contenere solo URL apex correnti.

## Architettura dei contenuti

### Homepage

La homepage presenta siti web ed e-commerce come offerta primaria. Il software per interventi, ticket e rapportini resta accessibile come offerta secondaria, senza competere con il tema principale dell'apertura.

Ipotesi di title:

`Siti Web ed E-commerce per PMI in Piemonte | Bitora`

L'H1, il testo iniziale e i segnali di fiducia devono confermare la stessa promessa: sviluppo su misura, progetti pubblicati, supporto in Italia e risposta entro 24 ore.

### Siti web professionali

URL: `/siti-web-professionali/`

Intenti principali:

- realizzazione siti web;
- sviluppo web;
- siti web per PMI;
- siti web in Piemonte.

Ipotesi di title:

`Realizzazione Siti Web in Piemonte | Bitora`

La description deve unire beneficio, prove reali e invito al preventivo. Il contenuto deve usare terminologia italiana coerente con il pubblico; la query generica inglese `web development` non viene inseguita a scapito della qualità del traffico.

### E-commerce

URL: `/e-commerce/`

Intenti principali:

- realizzazione e-commerce in Piemonte;
- e-commerce B2B;
- e-commerce B2C;
- sviluppo WooCommerce, Shopify o custom.

Ipotesi di title:

`Realizzazione E-commerce in Piemonte | B2B e B2C | Bitora`

La pagina aggiunge una sezione B2B dedicata a cataloghi riservati, listini cliente, preventivi, ordini ricorrenti e integrazioni gestionali. Queste voci descrivono capacità offerte, senza presentarle come risultati già conseguiti se non supportate da un caso reale.

RicambiXStufe resta la prova concreta per catalogo, gestione ordini e sviluppo custom.

## Dati strutturati

I dati strutturati esistenti devono usare le URL canonical correnti e descrivere solo servizi e prove presenti nella pagina. Non si assume che FAQ o altri schema generino rich result: servono soprattutto a mantenere coerenza semantica.

## Verifica tecnica

Prima del deploy:

- sincronizzare il checkout locale, attualmente tre commit indietro rispetto a `origin/main`;
- eseguire build, type-check, test Playwright e verifica SEO;
- verificare sitemap, canonical, structured data e link interni;
- verificare che ogni URL rimossa risponda con redirect, non con 404.

Dopo il deploy:

- controllare dal vivo la matrice HTTP/HTTPS, `www`/apex, slash e vecchie rotte;
- inviare a Search Console solo la sitemap apex;
- richiedere una nuova scansione di homepage, `/siti-web-professionali/` e `/e-commerce/`.

## Misurazione

Prima del deploy viene esportato da Search Console il rapporto degli ultimi 28 giorni con dimensioni query e pagina, segmentato almeno per brand/non-brand, paese e dispositivo. La data di deploy viene annotata.

Metriche primarie:

- CTR non-brand per pagina prioritaria;
- clic non-brand;
- posizione media per cluster di intento.

Metriche di controllo:

- impressioni;
- stato di indicizzazione;
- presenza delle sole URL canonical;
- lead qualificati provenienti dalla ricerca organica.

La prima verifica serve a confermare scansione e indicizzazione. La valutazione del test avviene dopo 28 giorni. La query a posizione 8 può essere valutata principalmente sul CTR; l'e-commerce a posizione circa 31 va valutato prima sulla crescita di pertinenza e ranking.

Se posizione o impressioni cambiano sensibilmente, il risultato non viene attribuito al solo snippet. Title e description non vengono modificati nuovamente prima della chiusura del ciclo.

## Criteri di accettazione

- Il redirect `www` è permanente.
- Nessuna variante duplicata viene inclusa in sitemap o link interni.
- Le tre pagine prioritarie hanno title, description, H1 e contenuto coerenti.
- La pagina e-commerce tratta esplicitamente l'intento B2B senza dichiarazioni non dimostrate.
- Build e test SEO passano.
- Il baseline Search Console e la data di deploy sono registrati.
- Il risultato viene riesaminato dopo 28 giorni con dati query × pagina.

## Fuori ambito

- landing dedicate a singole città;
- campagne di link building;
- redesign completo;
- garanzie di posizione o rich result;
- ottimizzazioni basate soltanto sulla media CTR del dominio.
