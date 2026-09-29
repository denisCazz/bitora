import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { fingerprintUrl, isLikelyDuplicateTitle, normalizeUrl } from './dedupe.ts';
import { isValidSlug, slugify } from './slug.ts';
import { canTransition } from './state.ts';
import { evaluatePublishReadiness, parseGeneratedDraft } from './validate.ts';
import {
  budgetRemaining,
  isWithinInterval,
  rotateStartIndex,
  selectRotated,
  tavilyCallCost,
} from './budget.ts';

describe('dedupe', () => {
  it('normalizes tracking params and www', () => {
    const left = normalizeUrl('https://www.Example.com/path/?utm_source=x&b=2&a=1');
    const right = normalizeUrl('https://example.com/path?a=1&b=2');
    assert.equal(left, right);
    assert.equal(fingerprintUrl('https://WWW.example.com/path/'), 'https://example.com/path');
  });

  it('detects near-duplicate titles', () => {
    assert.equal(
      isLikelyDuplicateTitle(
        'NFC restaurant reviews in 2026',
        'NFC restaurant reviews during 2026'
      ),
      true
    );
    assert.equal(isLikelyDuplicateTitle('CRM prezzi PMI', 'Tessere NFC ristoranti'), false);
  });
});

describe('slug and state', () => {
  it('slugifies italian text', () => {
    assert.equal(slugify('Tessere NFC per ristoranti'), 'tessere-nfc-per-ristoranti');
    assert.equal(isValidSlug('tessere-nfc-ristoranti'), true);
    assert.equal(isValidSlug('Hello World'), false);
  });

  it('blocks illegal transitions and publishing from archived without draft', () => {
    assert.equal(canTransition('DRAFT', 'PUBLISHED'), true);
    assert.equal(canTransition('DRAFT', 'ARCHIVED'), true);
    assert.equal(canTransition('ARCHIVED', 'PUBLISHED'), false);
    assert.equal(canTransition('PUBLISHED', 'DRAFT'), true);
  });
});

describe('AI draft validation', () => {
  it('rejects invented metrics and missing signal', () => {
    assert.throws(() =>
      parseGeneratedDraft({
        title: 'Titolo abbastanza lungo',
        slug: 'titolo-abbastanza-lungo',
        excerpt: 'Excerpt di prova abbastanza lungo per passare',
        category: 'AI',
        topic: 'ai',
        angle: 'Angle',
        abstract: 'Abstract',
        seoTitle: 'SEO title abbastanza lungo per i limiti',
        seoDescription:
          'Meta description abbastanza lunga da superare i settanta caratteri minimi richiesti dal validatore.',
        readTime: '5 min',
        ctaVariant: 'contact',
        caseStudySlugs: ['dalina'],
        visualHints: [],
        inventedMetrics: '40% conversion',
        sources: [{ title: 'Bitora', url: 'https://bitora.it/' }],
        content: {
          stages: [{ id: 'signal', label: 'Segnale' }],
          blocks: [{ type: 'paragraph', html: 'Ciao' }],
        },
      })
    );
  });

  it('accepts a structured draft', () => {
    const draft = parseGeneratedDraft({
      title: 'Siti AI per PMI sul territorio',
      slug: 'siti-ai-pmi-territorio',
      excerpt: 'Come usare l’AI sui siti senza vendere magia alle PMI piemontesi.',
      category: 'AI',
      topic: 'ai',
      angle: 'L’AI toglie passaggi, non sostituisce il territorio.',
      abstract:
        'Abstract editoriale sul confine tra builder automatici e siti che generano richieste.',
      seoTitle: 'Siti AI per PMI: cosa funziona davvero',
      seoDescription:
        'Valutare siti e automazioni AI per PMI senza hype, con casi Bitora e pubblicazione solo dopo review umana.',
      readTime: '6 min',
      ctaVariant: 'contact',
      caseStudySlugs: ['dalina'],
      visualHints: ['editor'],
      inventedMetrics: 'none',
      sources: [{ title: 'Bitora', url: 'https://bitora.it/ticketing/' }],
      content: {
        stages: [{ id: 'signal', label: 'Segnale' }],
        blocks: [
          { type: 'signal', heading: 'Segnale', body: 'Corpo del segnale iniziale', seconds: 60 },
          { type: 'paragraph', html: 'Lettura profonda' },
        ],
      },
    });
    assert.equal(draft.topic, 'ai');
    assert.equal(draft.content.blocks[0].type, 'signal');
  });
});

describe('publish checks', () => {
  it('requires explicit confirmation and sources or cases', () => {
    const content = {
      stages: [{ id: 'signal', label: 'Segnale' }],
      blocks: [
        { type: 'signal', heading: 'Segnale', body: 'Corpo' },
        { type: 'paragraph', html: 'Testo' },
      ],
    };
    const denied = evaluatePublishReadiness({
      slug: 'articolo-di-prova-ok',
      title: 'Titolo articolo di prova Bitora',
      seoTitle: 'Titolo SEO abbastanza lungo per i limiti',
      seoDescription:
        'Meta description abbastanza lunga da superare i settanta caratteri minimi richiesti dal validatore SEO.',
      excerpt: 'Excerpt abbastanza lungo da non far scattare l’avviso più serio.',
      coverImage: '/editorial/crm.png',
      coverAlt: 'Cover',
      content,
      sourceCount: 0,
      caseStudySlugs: [],
      confirm: false,
    });
    assert.equal(denied.ok, false);
    assert.ok(denied.errors.some(item => item.includes('conferma')));

    const ok = evaluatePublishReadiness({
      slug: 'articolo-di-prova-ok',
      title: 'Titolo articolo di prova Bitora',
      seoTitle: 'Titolo SEO abbastanza lungo per i limiti',
      seoDescription:
        'Meta description abbastanza lunga da superare i settanta caratteri minimi richiesti dal validatore SEO.',
      excerpt: 'Excerpt abbastanza lungo da non far scattare l’avviso più serio.',
      coverImage: '/editorial/crm.png',
      coverAlt: 'Cover',
      content,
      sourceCount: 1,
      caseStudySlugs: ['dalina'],
      confirm: true,
    });
    assert.equal(ok.ok, true);
  });
});

describe('budget / schedule helpers', () => {
  it('rotates pillars without repeating until a full cycle', () => {
    const items = ['nfc', 'web', 'ai'];
    assert.deepEqual(
      [0, 1, 2, 3].map(run => {
        const start = rotateStartIndex(run, items.length);
        return selectRotated(items, start, 1)[0];
      }),
      ['nfc', 'web', 'ai', 'nfc']
    );
  });

  it('throttles cron inside the interval window', () => {
    const last = new Date('2026-09-16T10:00:00Z');
    assert.equal(isWithinInterval(last, new Date('2026-09-16T11:00:00Z'), 48), true);
    assert.equal(isWithinInterval(last, new Date('2026-09-18T11:00:00Z'), 48), false);
  });

  it('keeps leftover budget non-negative', () => {
    assert.equal(Number(budgetRemaining(0.1, 0.4).toFixed(4)), 0.3);
    assert.equal(budgetRemaining(0.5, 0.4), 0);
    assert.equal(tavilyCallCost('basic').credits, 1);
    assert.equal(tavilyCallCost('advanced').credits, 2);
  });
});
