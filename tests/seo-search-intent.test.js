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
      title: 'Realizzazione Siti Web in Piemonte | Bitora',
      description:
        'Realizziamo siti web professionali per PMI in Piemonte: veloci, mobile-first e ottimizzati SEO, con progetti reali e supporto in Italia. Preventivo gratuito.',
      canonical: 'https://bitora.it/siti-web-professionali/',
      h1: 'Il sito giusto porta clienti, non solo visite.',
    });

    await expect(page.getByText(/sviluppo web per PMI in Piemonte/i).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /progetti reali/i }).first()).toBeVisible();
  });

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
});
