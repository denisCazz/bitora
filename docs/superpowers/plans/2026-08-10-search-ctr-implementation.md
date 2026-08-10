# Organic Search CTR Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate Bitora's canonical URLs and reposition the homepage, website service page, and e-commerce page to improve qualified organic CTR for Piedmont SMEs.

**Architecture:** Astro remains the single source for page metadata, visible copy, canonical tags, sitemap URLs, structured data, and legacy path redirects. Coolify/Traefik owns the permanent host redirect from `www` to apex. Playwright and the post-build verifier lock the search-intent and canonical contracts before deployment.

**Tech Stack:** Astro 5, TypeScript, Playwright, Node.js 22, `@astrojs/sitemap`, Coolify with Traefik.

## Global Constraints

- The only indexable URL form is `https://bitora.it/<path>/`.
- The homepage prioritizes websites and e-commerce for Piedmont SMEs; field-service software remains a secondary linked offer.
- Use these title hypotheses exactly for the first 28-day cycle:
  - `Siti Web ed E-commerce per PMI in Piemonte | Bitora`
  - `Realizzazione Siti Web in Piemonte | Bitora`
  - `Realizzazione E-commerce in Piemonte | B2B e B2C | Bitora`
- Do not create city landing pages in this iteration.
- Do not describe capabilities as delivered results unless an existing case study supports the claim.
- Add no runtime or development dependencies.
- Preserve the existing page layouts and components; this is a copy and information-hierarchy change, not a redesign.
- Do not create a git commit unless the user explicitly requests one.
- Before editing application code, fast-forward the clean local branch from `origin/main`; it was three commits behind when this plan was written.

---

### Task 1: Reposition the homepage around websites and e-commerce

**Files:**

- Create: `tests/seo-search-intent.test.js`
- Modify: `tests/basic.test.js:6-17`
- Modify: `src/components/Header.astro:21-38`
- Modify: `src/layouts/Layout.astro:31-35, 150-196`
- Modify: `src/pages/index.astro:6-278`

**Interfaces:**

- Consumes: `Layout` props `title: string` and `description?: string`.
- Produces: homepage metadata, H1, primary CTA, and body-copy contract asserted by `expectSearchPage(page, expected)`.
- Preserves: `/gestione-interventi/` as the canonical software landing page.

- [ ] **Step 1: Synchronize the checkout without overwriting local work**

Run:

```powershell
git status --short --branch
git fetch origin
git pull --ff-only
```

Expected: a fast-forward to `origin/main`; the approved files under `docs/superpowers/` remain present. Stop if tracked application files are modified before the pull.

- [ ] **Step 2: Add the homepage search-intent test**

Create `tests/seo-search-intent.test.js`:

```javascript
import { test, expect } from '@playwright/test';

async function expectSearchPage(page, expected) {
  await page.goto(expected.path);
  await expect(page).toHaveTitle(expected.title);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    expected.description
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', expected.canonical);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toContainText(expected.h1);
}

test.describe('Organic search intent', () => {
  test('homepage prioritizes websites and e-commerce for Piedmont SMEs', async ({ page }) => {
    await expectSearchPage(page, {
      path: '/',
      title: 'Siti Web ed E-commerce per PMI in Piemonte | Bitora',
      description:
        'Bitora realizza siti web ed e-commerce su misura per PMI in Piemonte: SEO, performance, integrazioni e supporto. Guarda i progetti e richiedi un preventivo.',
      canonical: 'https://bitora.it/',
      h1: 'Siti web ed e-commerce su misura per PMI',
    });

    const primaryCta = page.locator('a[data-track="cta_click"][data-track-location="home_hero"]');
    await expect(primaryCta).toHaveAttribute('href', '/contattaci/?topic=sito');
    await expect(primaryCta).toContainText(/preventivo/i);
    await expect(page.getByRole('link', { name: /software per interventi/i })).toHaveAttribute(
      'href',
      '/gestione-interventi/'
    );
  });
});
```

- [ ] **Step 3: Update the existing homepage smoke test**

Replace the first test in `tests/basic.test.js` with:

```javascript
test('homepage loads with websites and e-commerce positioning', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Siti Web ed E-commerce per PMI in Piemonte/i);
  await expect(page.locator('#site-header')).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Navigazione principale' })).toBeVisible();
  await expect(page.locator('#main-content')).toBeVisible();
  await expect(page.locator('footer').last()).toBeVisible();
  await expect(page.locator('h1')).toContainText(/siti web ed e-commerce/i);
  await expect(page.locator('a[href="/contattaci/?topic=sito"]').first()).toBeVisible();
  await expect(page.locator('a[href="https://ai.bitora.it/"]')).toHaveCount(0);
});
```

- [ ] **Step 4: Run the homepage tests and confirm the old positioning fails**

Run:

```powershell
npx playwright test tests/seo-search-intent.test.js tests/basic.test.js --grep "homepage"
```

Expected: FAIL on the old title, H1, and primary CTA.

- [ ] **Step 5: Make the homepage header CTA context-aware**

Add this branch at the start of `resolveHeaderCta()` in `src/components/Header.astro`:

```typescript
function resolveHeaderCta(path: string) {
  if (path === '/') {
    return { href: '/contattaci/?topic=sito', label: 'Richiedi preventivo' };
  }
  const topic = webTopicByPath[path];
  if (topic) {
    return {
      href: `/contattaci/?topic=${topic}`,
      label: topic === 'ecommerce' ? 'Preventivo e-commerce' : 'Richiedi preventivo',
    };
  }
  if (path === '/servizi') {
    return { href: '/contattaci/', label: 'Richiedi preventivo' };
  }
  if (informativePrefixes.some(p => path === p || path.startsWith(p + '/'))) {
    return { href: '/contattaci/', label: 'Contattaci' };
  }
  return { href: '/richiedi-demo/', label: 'Richiedi demo' };
}
```

- [ ] **Step 6: Align the global entity metadata with the approved positioning**

In `src/layouts/Layout.astro`, use:

```astro
const defaultDescription = 'Siti web ed e-commerce su misura per PMI in Piemonte, oltre a software
per interventi, ticket e rapportini. Progetti, integrazioni e supporto in Italia.';
```

Replace the Open Graph site name and the relevant Organization/WebSite fields with:

```astro
<meta property="og:site_name" content="Bitora" />
```

```javascript
"description": "Bitora realizza siti web ed e-commerce su misura per PMI e sviluppa piattaforme per interventi, ticket e rapportini. Sede a Carmagnola (TO), operativa in Piemonte e in Italia.",
```

```javascript
"name": "Bitora",
"url": `${siteOrigin}/`,
"dateModified": "2026-08-10",
```

- [ ] **Step 7: Replace the homepage metadata and hero copy**

Use this metadata and hero in `src/pages/index.astro`:

```astro
<Layout
  title="Siti Web ed E-commerce per PMI in Piemonte | Bitora"
  description="Bitora realizza siti web ed e-commerce su misura per PMI in Piemonte: SEO, performance, integrazioni e supporto. Guarda i progetti e richiedi un preventivo."
>
  <div class="home">
    <section class="hero">
      <div class="hero-media" aria-hidden="true">
        <img src="/programming.jpg" alt="" class="hero-img" fetchpriority="high" decoding="async" />
        <div class="hero-scrim"></div>
      </div>

      <div class="shell hero-copy">
        <p class="eyebrow hero-item">Siti web · E-commerce · Piemonte</p>
        <h1 class="display hero-item">
          Siti web ed e-commerce<br />su misura per PMI
        </h1>
        <p class="lede hero-item">
          Progettiamo esperienze veloci, credibili e misurabili: dal sito vetrina al negozio online,
          con SEO, contenuti, integrazioni e supporto dopo il lancio.
        </p>
        <div class="cta-row hero-item">
          <a
            href="/contattaci/?topic=sito"
            class="sl-btn-primary"
            data-track="cta_click"
            data-track-location="home_hero">Richiedi un preventivo</a
          >
          <a href="/lavori/" class="sl-btn-secondary">Guarda i progetti</a>
        </div>
        <p class="hero-alt hero-item">
          Cerchi una piattaforma operativa?
          <a href="/gestione-interventi/">Software per interventi, ticket e rapportini</a>
        </p>
      </div>

      <a href="#problema" class="hero-scroll" aria-label="Scorri">
        <span></span>
      </a>
    </section>
  </div></Layout
>
```

- [ ] **Step 8: Replace the homepage problem, process, audience, offer, and final CTA copy**

Keep the existing wrappers and classes, but replace the content and arrays with these exact values:

```astro
<!-- PROBLEMA -->
<p class="eyebrow">Il punto di partenza</p>
<h2 class="headline">
  Un sito deve essere<br />chiaro, veloce e<br />
  <span class="text-secondary">capace di convertire.</span>
</h2>
<p class="body-lg" data-reveal data-reveal-delay="1">
  Bitora parte dagli obiettivi commerciali e costruisce un percorso digitale coerente, dalla ricerca
  su Google fino alla richiesta di contatto o all'ordine.
</p>
```

```javascript
[
  {
    n: '01',
    t: 'Poche richieste',
    d: 'Il traffico arriva, ma il valore dell’offerta non è immediato.',
  },
  {
    n: '02',
    t: 'Immagine poco credibile',
    d: 'Design, contenuti e prove non raccontano la qualità reale.',
  },
  {
    n: '03',
    t: 'Gestione frammentata',
    d: 'Sito, catalogo, ordini e contatti non lavorano insieme.',
  },
];
```

```astro
<!-- FLUSSO -->
<p class="eyebrow">Come lavoriamo</p>
<h2 class="headline">Dal brief<br />al lancio.</h2>
<p class="body-lg" style="margin-top:1rem;max-width:40rem">
  Strategia, contenuti, sviluppo e misurazione restano nello stesso progetto, con un referente unico
  e obiettivi verificabili.
</p>
```

```javascript
[
  { n: '01', t: 'Strategia', d: 'Obiettivi, pubblico, struttura e priorità.' },
  { n: '02', t: 'Contenuti', d: 'Messaggi, prove, pagine e call to action.' },
  { n: '03', t: 'Sviluppo', d: 'Performance, mobile, SEO e integrazioni.' },
  { n: '04', t: 'Misurazione', d: 'Analytics, Search Console e miglioramenti.' },
];
```

Change the flow footer link to:

```astro
<a href="/siti-web-professionali/" class="text-link">
  Scopri come realizziamo i siti
  <span aria-hidden="true">→</span>
</a>
```

Use this audience content:

```astro
<p class="eyebrow">Per chi</p>
<h2 class="display-sm">
  PMI che vogliono<br />crescere online.
</h2>
<p class="lede audience-lede">
  Per aziende che cercano una presenza digitale credibile, più richieste qualificate e strumenti
  semplici da gestire.
</p>
<a
  href="/contattaci/?topic=sito"
  class="sl-btn-primary"
  data-track="cta_click"
  data-track-location="home_audience">Parlaci del progetto</a
>
```

Use this offer content:

```astro
<p class="eyebrow">Metodo</p>
<h2 class="headline">
  Un progetto chiaro.<br />Nessun pacchetto standard.
</h2>
<p class="body-lg offer-copy">
  Definiamo insieme obiettivi, contenuti, funzionalità e tempi. Il preventivo separa ciò che serve
  ora dalle evoluzioni successive.
</p>
<a
  href="/contattaci/"
  class="sl-btn-primary"
  data-track="cta_click"
  data-track-location="home_offer">Richiedi un confronto</a
>
```

```javascript
[
  { t: 'Analisi', d: 'Obiettivi, pubblico e priorità' },
  { t: 'Progetto', d: 'Design, contenuti e sviluppo' },
  { t: 'Lancio', d: 'Test, SEO, tracking e formazione' },
  { t: 'Supporto', d: 'Manutenzione ed evoluzioni concordate' },
];
```

Use this final CTA copy and links:

```astro
<p class="eyebrow">Inizia da qui</p>
<h2 class="display-cta">
  Raccontaci il progetto.<br />Prepariamo il percorso.
</h2>
<p class="lede cta-lede">
  Sito vetrina, e-commerce o restyle: partiamo dagli obiettivi e ti rispondiamo entro 24 ore.
</p>
```

```astro
<ol class="cta-steps">
  <li>
    <span class="cta-step-n">1</span>
    <div><strong>2 minuti</strong><span>Raccontaci azienda e obiettivi</span></div>
  </li>
  <li>
    <span class="cta-step-n">2</span>
    <div><strong>Entro 24 ore</strong><span>Ti ricontattiamo noi</span></div>
  </li>
  <li>
    <span class="cta-step-n">3</span>
    <div><strong>Proposta chiara</strong><span>Priorità, tempi e prossimi passi</span></div>
  </li>
</ol>
```

```astro
<a
  href="/contattaci/?topic=sito"
  class="sl-btn-primary sl-btn-lg"
  data-track="cta_click"
  data-track-location="home_final"
>
  Richiedi un preventivo
  <span aria-hidden="true">→</span>
</a>
<a
  href="https://wa.me/393514979670?text=Ciao%2C%20vorrei%20parlarvi%20di%20un%20sito%20web%20o%20e-commerce."
  class="sl-btn-whatsapp"
  data-track="whatsapp_click"
  data-track-location="home_final">Scrivici su WhatsApp</a
>
```

Remove the homepage `SoftwareApplication` JSON-LD block because the same entity is already described on `/gestione-interventi/`.

- [ ] **Step 9: Format and run the homepage tests**

Run:

```powershell
npx prettier --write src/pages/index.astro src/components/Header.astro src/layouts/Layout.astro tests/basic.test.js tests/seo-search-intent.test.js
npx playwright test tests/seo-search-intent.test.js tests/basic.test.js --grep "homepage"
```

Expected: PASS for the homepage title, description, canonical, H1, CTA, navigation, and smoke assertions.

---

### Task 2: Align the website service landing page with local search intent

**Files:**

- Modify: `tests/seo-search-intent.test.js`
- Modify: `src/pages/siti-web-professionali.astro:40-81`

**Interfaces:**

- Consumes: `expectSearchPage(page, expected)` from Task 1.
- Produces: a canonical landing page for Italian website-development intent in Piedmont.

- [ ] **Step 1: Add the failing website landing test**

Append inside the existing `test.describe()`:

```javascript
test('website service page targets Italian development intent in Piedmont', async ({ page }) => {
  await expectSearchPage(page, {
    path: '/siti-web-professionali/',
    title: 'Realizzazione Siti Web in Piemonte | Bitora',
    description:
      'Realizziamo siti web professionali per PMI in Piemonte: veloci, mobile-first e ottimizzati SEO, con progetti reali e supporto in Italia. Preventivo gratuito.',
    canonical: 'https://bitora.it/siti-web-professionali/',
    h1: 'Il sito giusto porta clienti, non solo visite.',
  });

  await expect(page.getByText(/sviluppo web per PMI in Piemonte/i).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /progetti reali/i }).first()).toBeVisible();
});
```

- [ ] **Step 2: Run the focused test and confirm the old title fails**

Run:

```powershell
npx playwright test tests/seo-search-intent.test.js --grep "website service"
```

Expected: FAIL on title, description, and the missing local-intent sentence.

- [ ] **Step 3: Update metadata, hero eyebrow, and introductory copy**

In `src/pages/siti-web-professionali.astro`, use:

```astro
<Layout
  title="Realizzazione Siti Web in Piemonte | Bitora"
  description="Realizziamo siti web professionali per PMI in Piemonte: veloci, mobile-first e ottimizzati SEO, con progetti reali e supporto in Italia. Preventivo gratuito."
  image="https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1600&q=80"
/>
```

Update the hero:

```astro
<VideoHero
  variant="split"
  eyebrow="Sviluppo web per PMI in Piemonte"
  title="Il sito giusto"
  highlight="porta clienti, non solo visite."
  description="Progettiamo siti veloci, mobile-first e ottimizzati per la ricerca locale. Ogni progetto parte dai tuoi obiettivi e si misura in contatti, recensioni e prenotazioni."
  primaryCta={{ label: 'Richiedi preventivo', href: '/contattaci/?topic=sito' }}
  secondaryCta={{ label: 'Guarda i progetti reali', href: '#progetti' }}
  posterSrc="https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1600&q=80"
  videoLabel="Sviluppo siti web professionali"
/>
```

Replace the first explanatory paragraph under “Più di una vetrina” with:

```astro
<p class="mt-4 text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
  Sviluppo web per PMI in Piemonte: siti veloci, indicizzati, mobile-first, con contenuti chiari,
  CTA misurabili e supporto in Italia.
</p>
```

- [ ] **Step 4: Format and verify the website landing**

Run:

```powershell
npx prettier --write src/pages/siti-web-professionali.astro tests/seo-search-intent.test.js
npx playwright test tests/seo-search-intent.test.js --grep "website service"
```

Expected: PASS.

---

### Task 3: Add explicit B2B relevance to the e-commerce landing page

**Files:**

- Modify: `tests/seo-search-intent.test.js`
- Modify: `src/pages/e-commerce.astro:17-430`

**Interfaces:**

- Consumes: `expectSearchPage(page, expected)` from Task 1.
- Produces: one e-commerce landing page that covers both B2B and B2C without inventing delivery claims.
- Preserves: RicambiXStufe as the concrete B2C/custom proof.

- [ ] **Step 1: Add the failing e-commerce intent test**

Append inside the existing `test.describe()`:

```javascript
test('e-commerce page covers B2B and B2C intent in Piedmont', async ({ page }) => {
  await expectSearchPage(page, {
    path: '/e-commerce/',
    title: 'Realizzazione E-commerce in Piemonte | B2B e B2C | Bitora',
    description:
      'Realizziamo e-commerce B2B e B2C in Piemonte con WooCommerce, Shopify o sviluppo custom: cataloghi, pagamenti e integrazioni. Preventivo gratuito.',
    canonical: 'https://bitora.it/e-commerce/',
    h1: 'Il tuo e-commerce B2B o B2C, chiavi in mano.',
  });

  await expect(page.getByRole('heading', { name: /vendita online per aziende/i })).toBeVisible();
  await expect(page.getByText(/cataloghi riservati/i).first()).toBeVisible();
  await expect(page.getByText(/listini per cliente/i).first()).toBeVisible();
  await expect(page.getByText(/integrazioni gestionali/i).first()).toBeVisible();
});
```

- [ ] **Step 2: Run the focused test and confirm it fails**

Run:

```powershell
npx playwright test tests/seo-search-intent.test.js --grep "B2B and B2C"
```

Expected: FAIL on metadata, H1, and the missing B2B section.

- [ ] **Step 3: Update metadata and hero**

Use:

```astro
<Layout
  title="Realizzazione E-commerce in Piemonte | B2B e B2C | Bitora"
  description="Realizziamo e-commerce B2B e B2C in Piemonte con WooCommerce, Shopify o sviluppo custom: cataloghi, pagamenti e integrazioni. Preventivo gratuito."
  image="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80"
/>
```

```astro
<VideoHero
  variant="background"
  overlay="light"
  eyebrow="E-commerce B2B e B2C · Piemonte"
  title="Il tuo e-commerce B2B o B2C,"
  highlight="chiavi in mano."
  description="WooCommerce, Shopify o sviluppo custom. Dalla strategia al lancio: catalogo, pagamenti, spedizioni, SEO e integrazioni incluse."
  primaryCta={{ label: 'Richiedi preventivo', href: '/contattaci/?topic=ecommerce' }}
  secondaryCta={{ label: 'Come funziona', href: '#come' }}
  posterSrc="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80"
  videoSrc="https://videos.pexels.com/video-files/7855449/7855449-uhd_2560_1440_25fps.mp4"
  videoLabel="Team prepara e imballa ordini e-commerce"
/>
```

- [ ] **Step 4: Add the B2B capability section before the RicambiXStufe case study**

Insert:

```astro
<section
  id="b2b"
  class="py-20 md:py-24 px-6 md:px-12 lg:px-20 border-b border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02]"
>
  <div class="max-w-6xl mx-auto">
    <div class="max-w-3xl">
      <p
        class="text-sm font-semibold tracking-widest uppercase text-slate-500 dark:text-slate-400 mb-3"
      >
        E-commerce B2B
      </p>
      <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">
        Vendita online per aziende, con regole commerciali reali.
      </h2>
      <p class="mt-4 text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
        Realizziamo e-commerce B2B in Piemonte su WooCommerce, Shopify o stack custom. La
        configurazione parte dal processo commerciale esistente e dalle integrazioni necessarie.
      </p>
    </div>

    <div class="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {
        [
          {
            title: 'Cataloghi riservati',
            text: 'Prodotti, assortimenti e contenuti visibili in base al cliente o al gruppo.',
          },
          {
            title: 'Listini per cliente',
            text: 'Prezzi, sconti, quantità minime e condizioni commerciali differenziate.',
          },
          {
            title: 'Preventivi e riordini',
            text: 'Richieste di offerta, ordini ricorrenti e storico acquisti nello stesso flusso.',
          },
          {
            title: 'Accessi aziendali',
            text: 'Account approvati, ruoli, referenti e indirizzi multipli per ogni cliente.',
          },
          {
            title: 'Pagamenti e fatture',
            text: 'Bonifico, carte, condizioni concordate e collegamenti alla fatturazione.',
          },
          {
            title: 'Integrazioni gestionali',
            text: 'Sincronizzazione di prodotti, disponibilità, clienti e ordini tramite API.',
          },
        ].map(item => (
          <article class="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-6">
            <h3 class="text-lg font-extrabold tracking-tight text-slate-950 dark:text-white">
              {item.title}
            </h3>
            <p class="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {item.text}
            </p>
          </article>
        ))
      }
    </div>

    <p class="mt-8 text-sm text-slate-500 dark:text-slate-400">
      Le funzionalità vengono definite nel preventivo in base al flusso commerciale e ai sistemi già
      presenti in azienda.
    </p>
  </div>
</section>
```

- [ ] **Step 5: Align Service schema and FAQ with the visible B2B content**

Change `serviceType` to:

```astro
serviceType={['E-commerce B2B', 'E-commerce B2C', 'WooCommerce', 'Shopify', 'Negozi Online']}
```

Add this item to both the visible `FAQ` and `FAQPageSchema` arrays:

```javascript
{
  question: 'Realizzate e-commerce B2B?',
  answer:
    'Sì. Possiamo configurare accessi approvati, cataloghi riservati, listini per cliente, preventivi, riordini e integrazioni con gestionali tramite API.',
},
```

- [ ] **Step 6: Format and verify the e-commerce landing**

Run:

```powershell
npx prettier --write src/pages/e-commerce.astro tests/seo-search-intent.test.js
npx playwright test tests/seo-search-intent.test.js --grep "B2B and B2C"
```

Expected: PASS.

---

### Task 4: Lock canonical URLs and legacy redirects in automated checks

**Files:**

- Modify: `tests/seo-canonical.test.js:6-96`
- Modify: `scripts/verify-seo-build.mjs:44-69`
- Modify: `.github/workflows/ci.yml:23-34`

**Interfaces:**

- Consumes: Astro redirects from `astro.config.mjs`.
- Produces: regression checks for 301 status, apex canonical, trailing slash, and sitemap exclusion.

- [ ] **Step 1: Add the current e-commerce page to canonical coverage**

Add `'/e-commerce/',` after `'/siti-web-professionali/',` in `samplePages`.

- [ ] **Step 2: Replace the priority legacy redirect smoke test with status-preserving tests**

Add this data and test block:

```javascript
const priorityLegacyRedirects = [
  ['/e-commerce-piemonte/', '/e-commerce/'],
  ['/siti-web-torino/', '/siti-web-professionali/'],
  ['/tessere-nfc-torino/', '/nfc-ecosystem/'],
];

test.describe('Priority legacy redirects', () => {
  for (const [source, destination] of priorityLegacyRedirects) {
    test(`${source} returns a permanent redirect to ${destination}`, async ({ request }) => {
      const response = await request.get(source, { maxRedirects: 0 });
      expect(response.status()).toBe(301);

      const location = response.headers().location;
      expect(location).toBeTruthy();
      expect(new URL(location, 'https://bitora.it').pathname).toBe(destination);
    });
  }
});
```

Keep the existing redirect coverage for `/cmms/`, `/services/`, and `/progetti/kristina/`.

- [ ] **Step 3: Run the redirect characterization tests**

Run:

```powershell
npx playwright test tests/seo-canonical.test.js --grep "permanent redirect"
```

Expected: PASS because the deployed Astro configuration already contains these redirects. If Astro returns 308 locally, verify framework behavior and explicitly configure 301 before changing the assertion; do not weaken it to “less than 400.”

- [ ] **Step 4: Expand the post-build sitemap denylist**

Replace `bannedPaths` in `scripts/verify-seo-build.mjs` with:

```javascript
const bannedPaths = [
  '/services/',
  '/404/',
  '/landing/',
  '/cmms/',
  '/shop/',
  '/demo/',
  '/soluzioni/',
  '/siti-web-piemonte/',
  '/e-commerce-piemonte/',
  '/siti-web-torino/',
  '/carmagnola/',
  '/grafica-digitale-social-media/',
  '/prezzi/',
  '/progetto-fuoco/',
  '/settori/',
  '/settori/ristoranti/',
  '/settori/turismo/',
  '/settori/professionisti/',
  '/tessere-nfc-torino/',
];
```

- [ ] **Step 5: Make CI execute the SEO verifier**

In `.github/workflows/ci.yml`, append this step after `npm run build` in the `build` job:

```yaml
- run: npm run verify:seo
```

Do not add Playwright to CI in this task; the current workflow does not install browser binaries. Keep browser tests as a required local pre-deploy gate.

- [ ] **Step 6: Build and verify canonical output**

Run:

```powershell
npm run build
npm run verify:seo
npx playwright test tests/seo-canonical.test.js
```

Expected:

```text
SEO build verification OK (<positive number> canonical URLs in sitemap).
```

All canonical and redirect Playwright tests pass.

---

### Task 5: Configure permanent host redirects in Coolify (Standard Application)

**Files:**

- Modify: `docs/seo-canonical-checklist.md` §1 (proxy / Coolify runbook)

**Interfaces:**

- Consumes: Coolify Standard Application (Dockerfile) with domains `https://bitora.it` and `https://www.bitora.it`.
- Produces: permanent **301** redirects — www→apex on all `www` hosts, HTTP→HTTPS on apex HTTP; single-hop `http://www` → `https://bitora.it`.
- External dependency: Coolify/Traefik configuration; this cannot be enforced by Astro.

> Bitora uses a **Standard Application with Dockerfile**, not Docker Compose. Define middleware labels, then attach them to the **generated router names** in **Container Labels**. **Do not** use `coolify.traefik.middlewares` — that shorthand is for Docker Compose services only.

- [ ] **Step 1: Record the current failing live behavior**

Run:

```powershell
curl.exe -sS -o NUL -D - http://bitora.it/
curl.exe -sS -o NUL -D - http://www.bitora.it/
curl.exe -sS -L -o NUL -D - http://www.bitora.it/
curl.exe -sS -o NUL -D - https://www.bitora.it/
curl.exe -sS -o NUL -D - https://www.bitora.it/e-commerce/
```

Expected before the fix:

- HTTP apex: `HTTP/1.1 302 Found` → `https://bitora.it/`
- HTTP www first hop: `HTTP/1.1 302 Found` → `https://www.bitora.it/` (two-hop chain to apex with `-L`)
- HTTPS www: `HTTP/1.1 302 Found` → `https://bitora.it/`

- [ ] **Step 2: Add middleware and router attachments in Coolify**

In the Bitora application:

1. Open the Bitora application in Coolify.
2. In **Direction**, set **Allow both** with **Readonly labels** enabled → **Save**.
3. Disable **Readonly labels** to add manual labels.
4. Keep both HTTPS domains on the same resource: `https://bitora.it` and `https://www.bitora.it`.
5. Keep apex as the canonical application domain.
6. In **Container Labels**, identify the generated router names by **Host rule** and **entrypoint** (e.g. `http-0-…`, `https-0-…`). Replace the `<ROUTER_*>` placeholders below with those real names.
7. Add middleware definitions and per-router attachments through the custom-label editor (**do not** edit generated proxy files). Preserve existing middleware such as `gzip`. Host-first order: www→apex normalization, then HTTP→HTTPS on apex:

```text
traefik.http.middlewares.bitora-to-apex.redirectregex.regex=^https?://www\.(.+)
traefik.http.middlewares.bitora-to-apex.redirectregex.replacement=https://${1}
traefik.http.middlewares.bitora-to-apex.redirectregex.permanent=true
traefik.http.middlewares.bitora-to-https.redirectscheme.scheme=https
traefik.http.middlewares.bitora-to-https.redirectscheme.permanent=true
traefik.http.routers.<ROUTER_HTTP_WWW>.middlewares=gzip,bitora-to-apex
traefik.http.routers.<ROUTER_HTTPS_WWW>.middlewares=gzip,bitora-to-apex
traefik.http.routers.<ROUTER_HTTP_APEX>.middlewares=gzip,bitora-to-https
traefik.http.routers.<ROUTER_HTTPS_APEX>.middlewares=gzip
```

**Router attachments (replace placeholders with names from Container Labels):**

| Generated router (`Host` rule)                   | Middleware (after `gzip`)     |
| ------------------------------------------------ | ----------------------------- |
| `<ROUTER_HTTP_WWW>` — `Host(\`www.bitora.it\`)`  | `bitora-to-apex`              |
| `<ROUTER_HTTPS_WWW>` — `Host(\`www.bitora.it\`)` | `bitora-to-apex`              |
| `<ROUTER_HTTP_APEX>` — `Host(\`bitora.it\`)`     | `bitora-to-https`             |
| `<ROUTER_HTTPS_APEX>` — `Host(\`bitora.it\`)`    | _(no redirect — `gzip` only)_ |

Why two middleware: `redirectregex` www does not cover `http://bitora.it/`; `redirectscheme` completes HTTP→HTTPS on apex. With `bitora-to-apex` on www routers, `http://www.bitora.it/...` goes directly to `https://bitora.it/...` in a single **301** (host-first: the www→apex regex already targets `https` in the replacement).

8. If the label editor escapes `$`, use `$${1}` as shown by the Coolify UI.
9. **Redeploy** the application so Traefik regenerates the active router configuration.

- [ ] **Step 3: Verify the permanent host redirect**

Run:

```powershell
curl.exe -sS -o NUL -D - http://bitora.it/
curl.exe -sS -o NUL -D - http://www.bitora.it/
curl.exe -sS -o NUL -D - https://www.bitora.it/
curl.exe -sS -o NUL -D - https://www.bitora.it/e-commerce/
curl.exe -sS -o NUL -D - "https://www.bitora.it/contattaci/?topic=sito"
```

Expected for each Coolify/Traefik check:

```text
HTTP/1.1 301 Moved Permanently
Location: https://bitora.it/<same-path-and-query>
```

Verify `http://www.bitora.it/...` no longer produces the two-hop `http→https://www→https://apex` chain with **302**.

Also run (Astro — trailing slash and legacy):

```powershell
curl.exe -sS -o NUL -D - https://bitora.it/e-commerce
curl.exe -sS -o NUL -D - https://bitora.it/e-commerce-piemonte/
```

Expected:

- no-slash e-commerce URL: 301 to `/e-commerce/`;
- old e-commerce URL: 301 to `/e-commerce/`.

- [ ] **Step 4: Update the repository runbook**

Align `docs/seo-canonical-checklist.md` §1 with the Standard Application procedure above: live **302** baseline, Direction/Readonly workflow, middleware definitions, router attachment table with `<ROUTER_*>` placeholders, target configuration block (not yet applied live), and post-modifica verification matrix. Do **not** document `coolify.traefik.middlewares`.

Format the Markdown:

```powershell
npx prettier --write docs/seo-canonical-checklist.md
```

---

### Task 6: Run the full pre-deploy verification gate

**Files:**

- Verify only; fix failures only in files touched by Tasks 1–5 unless a pre-existing blocker is proven.

**Interfaces:**

- Consumes: all repository changes from Tasks 1–5.
- Produces: a build artifact and test evidence ready for deployment.

- [ ] **Step 1: Run static checks**

Run:

```powershell
npm run check
npm run lint
```

Expected: both exit with code 0.

- [ ] **Step 2: Build and verify generated SEO assets**

Run:

```powershell
npm run build
npm run verify:seo
```

Expected: build exits with code 0 and the verifier reports a positive canonical URL count.

- [ ] **Step 3: Run the complete browser suite**

Run:

```powershell
npm test
```

Expected: all Playwright tests pass in Chromium.

- [ ] **Step 4: Review the final diff**

Run:

```powershell
git status --short
git diff --check
git diff -- src/pages/index.astro src/pages/siti-web-professionali.astro src/pages/e-commerce.astro src/layouts/Layout.astro src/components/Header.astro tests scripts docs .github/workflows/ci.yml
```

Expected: no whitespace errors, no unrelated files, no city landing pages, and no unrequested dependency changes.

---

### Task 7: Deploy and start the 28-day Search Console experiment

**Files:**

- External: Google Search Console property for `bitora.it`.
- External: deployment annotation in the team's analytics notes.

**Interfaces:**

- Consumes: verified production deployment and permanent redirects.
- Produces: a query-by-page baseline and one interpretable 28-day CTR experiment.

- [ ] **Step 1: Export the pre-deploy baseline**

In Search Console, export the **28-day pre-deploy window** anchored to deploy date **D**:

- **Pre window:** **D−28** through **D−1** (deploy day **D** excluded);
- dimensions: query and page;
- filters/segments: brand versus non-brand, country, and device;
- metrics: clicks, impressions, CTR, and average position.

Retain the raw export unchanged. The known reference values are:

- `web development`: 0 clicks, 167 impressions, position 8;
- `ecommerce b2b piemonte`: 0 clicks, 119 impressions, position about 31;
- combined apex/`www` homepage rows shown: 1 click from 621 impressions;
- branded `bitora`: 1 click from 8 impressions.

- [ ] **Step 2: Deploy the verified revision and record the exact ISO date**

Record the production date in the analytics experiment notes on the same day the new HTML and redirect middleware become live. Do not compare mixed pre/post-deploy ranges.

- [ ] **Step 3: Submit only the apex sitemap**

In Search Console:

1. Submit `https://bitora.it/sitemap-index.xml`.
2. Remove old `www` sitemap submissions.
3. Request indexing for:
   - `https://bitora.it/`
   - `https://bitora.it/siti-web-professionali/`
   - `https://bitora.it/e-commerce/`

- [ ] **Step 4: Confirm technical consolidation after recrawl**

Check that Google-selected canonical matches the declared apex canonical for all three pages and that old URL variants move into redirected or duplicate/canonicalized states rather than indexed states.

- [ ] **Step 5: Evaluate after 28 complete post-deploy days**

Compare equal 28-day windows (deploy day **D** excluded from both):

| Window      | Period             |
| ----------- | ------------------ |
| Pre-deploy  | **D−28** → **D−1** |
| Post-deploy | **D+1** → **D+28** |

- primary: non-brand CTR and clicks for each priority page;
- controls: impressions, average position, indexing, and qualified organic leads;
- target: non-brand CTR around or above 1% on priority pages without a material loss of impressions or position.

Interpret `web development` primarily as a CTR/intent test while it remains near position 8. Interpret the e-commerce B2B cluster primarily as a relevance/ranking test until it approaches page one. Do not start a second title/description cycle before this comparison is complete.
