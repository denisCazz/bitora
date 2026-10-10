import test from 'node:test';
import assert from 'node:assert/strict';
import { checkSubmission } from './spamGuard';

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
