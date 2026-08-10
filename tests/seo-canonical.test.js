/**
 * SEO canonicalization, CTA context, headings and tracking smoke tests
 */
import { test, expect } from '@playwright/test';

const SITE = 'https://bitora.it';

const samplePages = [
  '/',
  '/gestione-interventi/',
  '/rapportini/',
  '/ticketing/',
  '/richiedi-demo/',
  '/siti-web-professionali/',
  '/e-commerce/',
  '/lavori/',
];

test.describe('Canonical apex and robots', () => {
  for (const path of samplePages) {
    test(`${path} uses apex canonical with trailing slash`, async ({ page }) => {
      await page.goto(path);
      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveAttribute('href', `${SITE}${path === '/' ? '/' : path}`);
      const robots = await page.locator('meta[name="robots"]').getAttribute('content');
      expect(robots).toMatch(/index/i);
      expect(robots).not.toMatch(/noindex/i);
    });
  }

  test('404 is noindex', async ({ page }) => {
    const response = await page.goto('/pagina-inesistente-seo-test/');
    expect(response?.status()).toBe(404);
    const robots = await page.locator('meta[name="robots"]').getAttribute('content');
    expect(robots).toMatch(/noindex/i);
  });

  test('pages expose bitoraTrack helper', async ({ page }) => {
    await page.goto('/');
    const hasTracker = await page.evaluate(() => typeof window.bitoraTrack === 'function');
    expect(hasTracker).toBe(true);
  });
});

test.describe('Contextual CTAs', () => {
  test('product pages keep demo CTA in header', async ({ page }) => {
    await page.goto('/gestione-interventi/');
    const headerCta = page.locator('header a[data-track="cta_click"]').first();
    await expect(headerCta).toBeVisible();
    await expect(headerCta).toHaveAttribute('href', /richiedi-demo/);
  });

  test('web service pages use contact CTA with topic', async ({ page }) => {
    await page.goto('/siti-web-professionali/');
    const headerCta = page.locator('header a[data-track="cta_click"]').first();
    await expect(headerCta).toBeVisible();
    await expect(headerCta).toHaveAttribute('href', /contattaci\/?\?topic=sito/);
    await expect(headerCta).toContainText(/preventivo|contatt/i);
  });

  test('footer CTA on web pages is not ticketing-demo copy', async ({ page }) => {
    await page.goto('/e-commerce/');
    const footerBanner = page
      .locator('section')
      .filter({ hasText: /preventivo|e-commerce|contatt/i })
      .first();
    await expect(footerBanner).toBeVisible();
    await expect(page.locator('text=Pronto a vedere il flusso sulla tua azienda?')).toHaveCount(0);
  });
});

test.describe('Heading hierarchy', () => {
  for (const path of ['/', '/gestione-interventi/', '/rapportini/', '/ticketing/', '/lavori/']) {
    test(`${path} has a single H1`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('h1')).toHaveCount(1);
    });
  }
});

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

test.describe('Legacy redirects', () => {
  test('cmms redirects to gestione-interventi', async ({ page }) => {
    const response = await page.goto('/cmms/');
    expect(response?.status()).toBeLessThan(400);
    await expect(page).toHaveURL(/gestione-interventi\/?$/);
  });

  test('services redirects to servizi', async ({ page }) => {
    const response = await page.goto('/services/');
    expect(response?.status()).toBeLessThan(400);
    await expect(page).toHaveURL(/servizi\/?$/);
  });

  test('progetti/kristina redirects to sartoria-kristina', async ({ page }) => {
    const response = await page.goto('/progetti/kristina/');
    expect(response?.status()).toBeLessThan(400);
    await expect(page).toHaveURL(/progetti\/sartoria-kristina\/?$/);
  });
});
