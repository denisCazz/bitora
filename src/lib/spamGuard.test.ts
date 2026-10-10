import test from 'node:test';
import assert from 'node:assert/strict';
import { checkSubmission, isPlausiblePhone } from './spamGuard';

let ipCounter = 0;
const req = (headers: Record<string, string> = { origin: 'https://bitora.it' }) =>
  new Request('https://bitora.it/api/contact/', {
    method: 'POST',
    headers: { 'x-forwarded-for': `10.0.0.${++ipCounter}`, ...headers },
  });
const ago = (ms: number) => Date.now() - ms;

test('accetta un invio legittimo', () => {
  const r = checkSubmission({
    request: req(),
    timestamp: ago(20_000),
    name: 'Mario Rossi',
    email: 'mario@example.it',
    texts: ['Vorrei un preventivo per un sito e-commerce, vedi www.miosito.it'],
  });
  assert.equal(r.ok, true);
});

test('blocca origin esterno o assente', () => {
  const external = checkSubmission({
    request: req({ origin: 'https://spam.example' }),
    timestamp: ago(20_000),
    name: 'A',
  });
  const missing = checkSubmission({ request: req({}), timestamp: ago(20_000), name: 'A' });
  assert.equal(external.ok, false);
  assert.equal(missing.ok, false);
});

test('blocca invii senza timestamp o troppo veloci', () => {
  assert.equal(checkSubmission({ request: req(), name: 'A' }).ok, false);
  assert.equal(checkSubmission({ request: req(), timestamp: ago(500), name: 'A' }).ok, false);
});

test('blocca contenuti spam', () => {
  const cases = [
    { name: 'Visit https://spam.example', texts: [] },
    { name: 'Иван', texts: ['Привет'] },
    { name: 'John', texts: ['We offer SEO services to rank your website on Google'] },
    { name: 'John', texts: ['http://a.com http://b.com http://c.com'] },
  ];
  for (const c of cases) {
    const r = checkSubmission({ request: req(), timestamp: ago(20_000), ...c });
    assert.equal(r.ok, false, c.name);
    assert.ok(!r.ok && !r.rateLimited);
  }
});

test('limita invii ripetuti dalla stessa email', () => {
  const send = () =>
    checkSubmission({
      request: req(),
      timestamp: ago(20_000),
      name: 'Luca',
      email: 'luca@example.it',
    });
  assert.equal(send().ok, true);
  assert.equal(send().ok, true);
  const third = send();
  assert.equal(third.ok, false);
  assert.ok(!third.ok && third.rateLimited);
});

test('blocca lo schema "Robertbeata" (IP noto, telefono casuale, domanda sul prezzo)', () => {
  const base = { timestamp: ago(20_000), name: 'Robertbeata', email: 'dstewen@t-online.de' };
  const blockedIp = checkSubmission({
    request: req({ origin: 'https://bitora.it', 'x-forwarded-for': '80.94.95.202' }),
    ...base,
  });
  assert.equal(blockedIp.reason, 'blocked-ip');
  const badPhone = checkSubmission({ request: req(), ...base, phone: '82665632744' });
  assert.equal(badPhone.reason, 'bad-phone');
  const price = checkSubmission({
    request: req(),
    ...base,
    texts: ['Hi, I wanted to know your price.'],
  });
  assert.equal(price.ok, false);
});

test('riconosce telefoni plausibili', () => {
  for (const p of [
    '333 123 4567',
    '+39 333 1234567',
    '011 1234567',
    '+49 30 123456',
    '0049301234',
  ]) {
    assert.equal(isPlausiblePhone(p), true, p);
  }
  for (const p of ['82665632744', '87474919667', '123', 'chiamami']) {
    assert.equal(isPlausiblePhone(p), false, p);
  }
});

test('limite per IP anche cambiando email', () => {
  const ip = '9.9.9.9';
  const results: boolean[] = [];
  for (let i = 0; i < 6; i++) {
    const r = checkSubmission({
      request: req({ origin: 'https://bitora.it', 'x-real-ip': ip }),
      timestamp: ago(20_000),
      name: 'Utente',
      email: `u${i}@example.it`,
    });
    results.push(r.ok);
  }
  assert.equal(results.filter(Boolean).length, 3);
});
