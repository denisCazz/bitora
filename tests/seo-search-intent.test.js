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
      title: 'Siti web ed e-commerce in Piemonte | Bitora, Carmagnola (TO)',
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
      if (data['@type'] === 'ProfessionalService') {
        professionalService = data;
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
      title: 'Realizzazione siti web a Carmagnola, Carignano e Racconigi | Bitora',
      description:
        'Realizzazione siti web a Carmagnola, Carignano, Racconigi e in Piemonte: veloci, ottimizzati SEO e pensati per portare chiamate, prenotazioni e richieste. Preventivo gratuito in 24 ore.',
      canonical: 'https://bitora.it/siti-web-professionali/',
      h1: 'porta clienti',
    });

    await expect(page.getByText(/sviluppo web per PMI in Piemonte/i).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /progetti reali/i }).first()).toBeVisible();
  });

  test('e-commerce page covers B2B and B2C intent in Piedmont', async ({ page }) => {
    await expectSearchPage(page, {
      path: '/e-commerce/',
      title: 'E-commerce B2B in Piemonte | Negozi online B2B e B2C | Bitora',
      description:
        'E-commerce B2B in Piemonte per produttori e distributori: listini per cliente, cataloghi riservati, pagamenti e integrazioni gestionali. Anche shop B2C. Preventivo gratuito.',
      canonical: 'https://bitora.it/e-commerce/',
      h1: 'E-commerce B2B in Piemonte',
    });

    await expect(page.getByRole('heading', { name: /vendita online per aziende/i })).toBeVisible();
    await expect(page.getByText(/cataloghi riservati/i).first()).toBeVisible();
    await expect(page.getByText(/listini per cliente/i).first()).toBeVisible();
    await expect(page.getByText(/integrazioni gestionali/i).first()).toBeVisible();
  });
});
