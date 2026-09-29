import { test, expect } from '@playwright/test';

test.describe('Radar editoriale', () => {
  test('blog hub loads unique radar experience', async ({ page }) => {
    await page.goto('/blog/');
    await expect(page.locator('h1')).toContainText(/segnale tech/i);
    await expect(page.locator('.radar-scope')).toBeVisible();
    await expect(page.locator('.radar-contacts')).toBeVisible();
    await expect(page.locator('link[rel="alternate"][type="application/rss+xml"]')).toHaveCount(1);
    await expect(page.locator('#site-header a[href="/blog/"]').first()).toBeVisible();
  });

  test('editorial admin is behind ops login', async ({ page }) => {
    const response = await page.goto('/ops/editoriale/');
    expect(response?.status()).toBeLessThan(400);
    await expect(page).toHaveURL(/\/ops\/login\/?/);
  });

  test('editorial cron rejects missing token', async ({ request }) => {
    const response = await request.post('/api/ops/editorial/run/');
    expect(response.status()).toBe(401);
  });
});
