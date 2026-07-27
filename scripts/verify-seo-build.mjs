#!/usr/bin/env node
/**
 * Post-build SEO checks: apex-only sitemap/robots, no redirect/404 URLs.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const CLIENT = join(ROOT, 'dist', 'client');
const errors = [];

function fail(msg) {
  errors.push(msg);
}

function read(path) {
  return readFileSync(path, 'utf8');
}

if (!existsSync(CLIENT)) {
  console.error('dist/client missing — run npm run build first');
  process.exit(1);
}

const robotsPath = join(CLIENT, 'robots.txt');
if (!existsSync(robotsPath)) {
  fail('robots.txt missing in dist/client');
} else {
  const robots = read(robotsPath);
  if (robots.includes('www.bitora.it')) fail('robots.txt still references www.bitora.it');
  if (!robots.includes('Sitemap: https://bitora.it/sitemap-index.xml')) {
    fail('robots.txt must declare Sitemap: https://bitora.it/sitemap-index.xml');
  }
}

const sitemapIndex = join(CLIENT, 'sitemap-index.xml');
if (!existsSync(sitemapIndex)) {
  fail('sitemap-index.xml missing');
} else {
  const indexXml = read(sitemapIndex);
  if (indexXml.includes('www.bitora.it')) fail('sitemap-index.xml contains www.bitora.it');
  if (!indexXml.includes('https://bitora.it/sitemap-')) {
    fail('sitemap-index.xml must point to apex child sitemaps');
  }
}

const sitemapFiles = readdirSync(CLIENT).filter(
  (f) => f.startsWith('sitemap-') && f.endsWith('.xml') && f !== 'sitemap-index.xml'
);

const bannedPaths = ['/services/', '/404/', '/landing/', '/cmms/', '/shop/', '/demo/'];
let urlCount = 0;

for (const file of sitemapFiles) {
  const xml = read(join(CLIENT, file));
  if (xml.includes('www.bitora.it')) fail(`${file} contains www.bitora.it`);

  const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  urlCount += locs.length;

  for (const loc of locs) {
    if (!loc.startsWith('https://bitora.it/')) {
      fail(`Non-apex URL in sitemap: ${loc}`);
      continue;
    }
    const path = new URL(loc).pathname;
    if (path !== '/' && !path.endsWith('/')) {
      fail(`Missing trailing slash in sitemap: ${loc}`);
    }
    if (bannedPaths.some((b) => path === b)) {
      fail(`Banned path in sitemap: ${loc}`);
    }
  }
}

if (urlCount === 0) fail('No page URLs found in child sitemaps');

const llmsPath = join(CLIENT, 'llms.txt');
if (existsSync(llmsPath)) {
  const llms = read(llmsPath);
  if (llms.includes('www.bitora.it')) fail('llms.txt still references www.bitora.it');
}

if (errors.length) {
  console.error('SEO build verification failed:\n' + errors.map((e) => ` - ${e}`).join('\n'));
  process.exit(1);
}

console.log(`SEO build verification OK (${urlCount} canonical URLs in sitemap).`);
