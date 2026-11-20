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
      title: 'Web agency a Carmagnola: siti web ed e-commerce | Bitora',
      description:
        'Siti web ed e-commerce B2B in Piemonte: Carmagnola, Carignano, Racconigi e Torino. Gestionali, app e AI su misura. Preventivo gratuito in 24 ore.',
      canonical: 'https://bitora.it/',
      h1: 'Siti web ed e-commerce',
    });

    const primaryCta = page.locator('a[data-track="cta_click"][data-track-location="home_hero"]');
    await expect(primaryCta).toHaveAttribute('href', '/contattaci/?topic=sito');
    await expect(primaryCta).toContainText(/preventivo/i);
    await expect(page.getByRole('link', { name: /software per interventi/i })).toHaveAttribute(
      'href',
      '/gestione-interventi/'
    );
  });

  test('homepage structured data shares organization ID and web-first description', async ({
    page,
  }) => {
    await page.goto('/');

    const scripts = page.locator('script[type="application/ld+json"]');
    const count = await scripts.count();
    let professionalService = null;

    for (let i = 0; i < count; i++) {
      const data = JSON.parse((await scripts.nth(i).textContent()) || '{}');
      const nodes = Array.isArray(data['@graph']) ? data['@graph'] : [data];
      const match = nodes.find(n => n && n['@type'] === 'ProfessionalService');
      if (match) {
        professionalService = match;
        break;
      }
    }

    expect(professionalService).not.toBeNull();
    expect(professionalService['@id']).toBe('https://bitora.it/#organization');
    expect(professionalService.description).toMatch(/siti web ed e-commerce/i);
    expect(professionalService.description).toMatch(
      /interventi|ticket|rapportini|software operativ/i
    );
  });

  test('website service page targets Italian development intent in Piedmont', async ({ page }) => {
    await expectSearchPage(page, {
      path: '/siti-web-professionali/',
      title: 'Realizzazione siti web Carmagnola e Carignano | Bitora',
      description:
        'Realizzazione siti web a Carmagnola, Carignano e Racconigi: veloci, ottimizzati SEO e pensati per portare chiamate e richieste. Preventivo gratuito in 24 ore.',
      canonical: 'https://bitora.it/siti-web-professionali/',
      h1: 'porta clienti',
    });

    await expect(page.getByText(/sviluppo web per PMI in Piemonte/i).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /progetti reali/i }).first()).toBeVisible();
  });

  test('e-commerce page targets local shop intent and links to the B2B page', async ({ page }) => {
    await expectSearchPage(page, {
      path: '/e-commerce/',
      title: 'Realizzazione e-commerce a Carmagnola e Carignano | Bitora',
      description:
        'Realizzazione e-commerce e negozi online a Carmagnola, Carignano e in Piemonte: catalogo, pagamenti, spedizioni e gestionale collegato. Preventivo gratuito.',
      canonical: 'https://bitora.it/e-commerce/',
      h1: 'Realizzazione e-commerce',
    });

    await expect(page.getByRole('heading', { name: /vendita online per aziende/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /e-commerce B2B per aziende/i })).toHaveAttribute(
      'href',
      '/e-commerce-b2b/'
    );
  });

  test('dedicated e-commerce B2B landing page exposes lead capture form and B2B value', async ({
    page,
  }) => {
    await expectSearchPage(page, {
      path: '/e-commerce-b2b/',
      title: 'E-commerce B2B Piemonte: portali su misura | Bitora',
      description:
        'E-commerce B2B in Piemonte per produttori, grossisti e distributori: listini per cliente, catalogo riservato P.IVA, riordino rapido e gestionale collegato.',
      canonical: 'https://bitora.it/e-commerce-b2b/',
      h1: 'E-commerce B2B',
    });

    await expect(page.locator('#b2b-landing-form')).toBeVisible();
    await expect(page.getByText(/zero commissioni/i).first()).toBeVisible();
  });

  test('Sbarre Franchina case study exposes step-by-step promotional walkthrough without tokens or subscriptions', async ({
    page,
  }) => {
    await page.goto('/progetti/accessi-aziendali-franchina/');
    await expect(page.locator('h1')).toContainText(/accessi aziendali/i);
    await expect(page.locator('#passo-dopo-passo')).toBeVisible();
    await expect(page.locator('#zero-token')).toBeVisible();
    await expect(page.getByText(/senza comprare token e senza abbonamenti/i).first()).toBeVisible();
  });
});
