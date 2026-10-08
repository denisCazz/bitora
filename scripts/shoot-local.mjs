import { chromium } from '@playwright/test';

const [, , path = '/', out = '/tmp/local.png', width = '1440', full = '1'] = process.argv;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: Number(width), height: 900 } });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console', m => m.type() === 'error' && errors.push(m.text()));
await page.goto(`http://localhost:${process.env.PORT || 4322}${path}`, { waitUntil: 'networkidle' });
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) {
    window.scrollTo(0, y);
    await new Promise(r => setTimeout(r, 60));
  }
  window.scrollTo(0, 0);
  document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-in'));
  document.getElementById('cookie-banner')?.remove();
});
await page.waitForTimeout(1200);
await page.screenshot({ path: out, fullPage: full === '1' });
console.log(errors.length ? errors.join('\n') : 'no errors');
await browser.close();
