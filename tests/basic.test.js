/**
 * Basic site functionality tests for repositioned Bitora funnel
 */
import { test, expect } from '@playwright/test';

test.describe('Bitora.it FSM repositioning', () => {
  test('homepage loads with FSM positioning', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/gestione interventi|rapportini|Bitora/i);
    await expect(page.locator('header')).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Navigazione principale' })).toBeVisible();
    await expect(page.locator('#main-content')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('h1')).toContainText(/interventi|tecnici|rapportini/i);
    await expect(page.locator('a[href="/richiedi-demo"]').first()).toBeVisible();
    await expect(page.locator('a[href="https://ai.bitora.it/"]')).toHaveCount(0);
  });

  test('navigation includes ecosystem, rapportini, ticketing and demo', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header a[href="/gestione-interventi"]').first()).toBeVisible();
    await expect(page.locator('header a[href="/rapportini"]').first()).toBeVisible();
    await expect(page.locator('header a[href="/ticketing"]').first()).toBeVisible();
    await page.click('header a[href="/gestione-interventi"]');
    await expect(page).toHaveURL(/gestione-interventi/);
  });

  test('product pages and demo form are available', async ({ page }) => {
    await page.goto('/gestione-interventi');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('a[href="/richiedi-demo"]').first()).toBeVisible();

    await page.goto('/rapportini');
    await expect(page.locator('h1')).toContainText(/rapportini/i);
    await expect(page.locator('a[href="/richiedi-demo"]').first()).toBeVisible();

    await page.goto('/ticketing');
    await expect(page.locator('h1')).toContainText(/richiesta|pratica/i);
    await expect(page.locator('a[href="/richiedi-demo"]').first()).toBeVisible();

    await page.goto('/richiedi-demo');
    await expect(page.locator('#demo-form')).toBeVisible();
    await expect(page.locator('input[name="azienda"]')).toBeVisible();
    await expect(page.locator('select[name="tecnici"]')).toBeVisible();
    await expect(page.locator('input[name="utm_source"]')).toHaveAttribute('type', 'hidden');
  });

  test('cmms redirects to gestione-interventi', async ({ page }) => {
    const response = await page.goto('/cmms');
    expect(response?.status()).toBeLessThan(400);
    await expect(page).toHaveURL(/gestione-interventi/);
  });

  test('contact form includes gestione interventi topics', async ({ page }) => {
    await page.goto('/contattaci');
    await expect(page.locator('form#contact-form')).toBeVisible();
    await expect(page.locator('select#argomento option[value="gestione-interventi"]')).toHaveCount(1);
    await expect(page.locator('select#argomento option[value="demo-gestione-interventi"]')).toHaveCount(1);
  });

  test('cookie banner exposes marketing preference', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#cookie-banner', { state: 'attached' });
    await page.evaluate(() => {
      document.getElementById('cookie-banner')?.classList.remove('translate-y-full');
    });
    await page.click('#cookie-settings-btn');
    await expect(page.locator('#cookie-settings-modal')).not.toHaveClass(/hidden/);
    await expect(page.locator('#marketing-cookies')).toBeVisible();
    await expect(page.locator('#analytics-cookies')).toBeVisible();
  });

  test('skip link exists', async ({ page }) => {
    await page.goto('/');
    const skipLink = page.locator('a.skip-link');
    await expect(skipLink).toHaveCount(1);
    await expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  test('no public ai.bitora.it links on key pages', async ({ page }) => {
    for (const path of ['/', '/servizi', '/gestione-interventi']) {
      await page.goto(path);
      await expect(page.locator('a[href*="ai.bitora.it"]')).toHaveCount(0);
    }
  });

  test('lavori page opens individual projects', async ({ page }) => {
    await page.goto('/lavori');
    await expect(page.locator('h1')).toContainText(/lavori/i);

    const projectLink = page.locator('a[href^="/progetti/"]').first();
    await expect(projectLink).toBeVisible();

    const href = await projectLink.getAttribute('href');
    expect(href).toMatch(/^\/progetti\/[a-z0-9-]+$/);

    await projectLink.click();
    await expect(page).toHaveURL(href);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('a[href="/lavori"]').first()).toBeVisible();
  });
});
