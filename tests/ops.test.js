import { test, expect } from '@playwright/test';

test.describe('Area privata ops', () => {
  test('unauthenticated visitors are sent to login', async ({ page }) => {
    const response = await page.goto('/ops/');
    expect(response?.status()).toBeLessThan(400);
    await expect(page).toHaveURL(/\/ops\/login\/?/);
    await expect(page.locator('h1')).toContainText(/area privata/i);
    const robots = await page.locator('meta[name="robots"]').getAttribute('content');
    expect(robots).toMatch(/noindex/i);
  });

  test('robots.txt disallows /ops/', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.ok()).toBeTruthy();
    const body = await response.text();
    expect(body).toContain('Disallow: /ops/');
  });
});
