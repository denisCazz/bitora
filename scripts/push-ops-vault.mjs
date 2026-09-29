import 'dotenv/config';
import { readFileSync } from 'node:fs';

const secret = process.env.OPS_CRON_SECRET || '';
const url = process.env.OPS_VAULT_IMPORT_URL || 'https://bitora.it/api/ops/vault-import/';
const seedPath = process.env.OPS_VAULT_SEED_PATH || 'data/ops-vault.seed.json';

if (!secret) {
  console.error('OPS_CRON_SECRET mancante');
  process.exit(1);
}

const parsed = JSON.parse(readFileSync(seedPath, 'utf8'));
const entries = Array.isArray(parsed.entries) ? parsed.entries : [];
if (!entries.length) {
  console.error('Seed vuoto');
  process.exit(1);
}

const response = await fetch(url, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${secret}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ entries }),
});

let body = {};
try {
  body = await response.json();
} catch {
  body = {};
}

if (!response.ok) {
  console.error(`Import fallito (${response.status})`, body.error || 'errore');
  process.exit(1);
}

console.log(
  `Importate ${body.imported ?? 0}, aggiornate ${body.updated ?? 0}, disponibili ${body.available ?? entries.length}`
);
