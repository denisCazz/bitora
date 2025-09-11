/**
 * Basic site functionality tests
 * These tests verify that key pages load correctly and contain expected content
 */

import { test, expect } from '@playwright/test';

test.describe('Bitora.it Basic Functionality', () => {
  test('homepage loads and contains key elements', async ({ page }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle(/Bitora/);

    // Check navigation is present
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();

    // Check main content areas
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();

    // Check hero section
    await expect(page.locator('h1')).toBeVisible();
  });

  test('navigation works on desktop', async ({ page }) => {
    await page.goto('/');

    // Test navigation links (aggiornati)
    await page.click('a[href="/settori"]');
    await expect(page).toHaveURL(/.*settori/);

    await page.click('a[href="/prezzi"]');
    await expect(page).toHaveURL(/.*prezzi/);

    await page.click('a[href="/contattaci"]');
    await expect(page).toHaveURL(/.*contattaci/);
  });

  test('mobile navigation works', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check mobile menu button is visible
    await expect(page.locator('#menu-toggle')).toBeVisible();

    // Open mobile menu
    await page.click('#menu-toggle');
    await expect(page.locator('#mobile-menu')).toBeVisible();

    // Test mobile navigation
    await page.click('a[href="/contattaci"]');
    await expect(page).toHaveURL(/.*contattaci/);
  });

  test('contact form is accessible', async ({ page }) => {
    await page.goto('/contattaci');

    // Check form elements
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[name="nome"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('textarea[name="messaggio"]')).toBeVisible();

    // Test form validation
    await page.click('button[type="submit"]');
    // Should show validation errors
  });

  test('accessibility features work', async ({ page }) => {
    await page.goto('/');

    // Test skip link
    await page.keyboard.press('Tab');
    const skipLink = page.locator('.skip-link:focus');
    await expect(skipLink).toBeVisible();

    // Test keyboard navigation
    await page.keyboard.press('Enter'); // Should skip to main content
    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeFocused();
  });

  test('structured data is present', async ({ page }) => {
    await page.goto('/');

    // Check for structured data scripts
    const structuredData = page.locator('script[type="application/ld+json"]');
    await expect(structuredData).toHaveCount(3); // 2 in Layout + 1 su Home
  });

  test('images have proper attributes', async ({ page }) => {
    await page.goto('/chi-siamo');

    // Check images have alt text and loading attributes
    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      await expect(img).toHaveAttribute('alt');
      await expect(img).toHaveAttribute('loading');
    }
  });
});
