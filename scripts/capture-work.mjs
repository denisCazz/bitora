import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const targets = [
  ['dalina', 'https://ristorantedalina.it'],
  ['garavella-7', 'https://garavella7.it'],
  ['mistral-impianti', 'https://mistralimpianti.it'],
  ['ricambixstufe', 'https://ricambixstufe.it'],
  ['sergio-contegiacomo', 'https://sergiocontegiacomo.it'],
  ['simone-contegiacomo', 'https://simonecontegiacomo.it'],
  ['sartoria-kristina', 'https://sartoriakristina.it'],
  ['speedy-pizza', 'https://speedy-pizza.it'],
  ['bar-chantilly', 'https://bartabacchichantilly.it'],
  ['agriturismo-la-natura', 'https://lanaturasavigliano.it'],
  ['barbara-toffano', 'https://barbaratoffano.it'],
  ['shopnfc', 'https://shopnfc.bitora.it'],
];

const only = process.argv.slice(2);
const outDir = new URL('../public/work/', import.meta.url);
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  locale: 'it-IT',
});

for (const [slug, url] of targets) {
  if (only.length && !only.includes(slug)) continue;
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(slug === "barbara-toffano" ? 6000 : 1500);
    await page.evaluate(() => {
      const consent = /^(accett|accetto|accetta|accept|ok|ho capito|rifiuta)/i;
      for (const btn of document.querySelectorAll('button, a[role="button"]')) {
        if (consent.test((btn.textContent || '').trim())) {
          btn.click();
          break;
        }
      }
    });
    await page.waitForTimeout(800);
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      for (const el of document.querySelectorAll('[id*="cookie" i], [class*="cookie" i], [id*="consent" i], [class*="consent" i]')) {
        if (getComputedStyle(el).position === 'fixed') el.remove();
      }
    });
    await page.screenshot({ path: new URL(`${slug}.jpg`, outDir).pathname, type: 'jpeg', quality: 82 });
    console.log('ok', slug);
  } catch (err) {
    console.log('fail', slug, err.message.split('\n')[0]);
  }
  await page.close();
}

await browser.close();
