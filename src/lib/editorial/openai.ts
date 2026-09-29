import { getPublicCaseStudies } from '../../data/caseStudies';
import { env } from '../ops/env';
import { parseGeneratedDraft } from './validate';
import { TOPIC_PILLARS } from './topics';
import type { GeneratedArticleDraft } from './types';
import type { TavilyHit } from './tavily';

export type OpenAiUsage = {
  tokensIn: number;
  tokensOut: number;
  costUsd: number;
};

const INPUT_COST_PER_M = 0.15;
const OUTPUT_COST_PER_M = 0.6;

export function openaiConfigured(): boolean {
  return Boolean(env('OPENAI_API_KEY'));
}

function modelName(): string {
  return env('OPENAI_MODEL') || 'gpt-4.1-mini';
}

export async function generateArticleDraft(input: {
  topic: string;
  trendTitle: string;
  trendUrl: string;
  trendExcerpt: string;
  sources: TavilyHit[];
}): Promise<{ draft: GeneratedArticleDraft; usage: OpenAiUsage; raw: string }> {
  const key = env('OPENAI_API_KEY');
  if (!key) throw new Error('OPENAI_API_KEY mancante');

  const cases = getPublicCaseStudies().map(cs => ({
    slug: cs.slug,
    title: cs.title,
    subtitle: cs.subtitle,
    category: cs.category,
    location: cs.location,
    problema: cs.problema,
    risultati: cs.risultati,
    tecnologie: cs.tecnologie,
  }));
  const pillar = TOPIC_PILLARS.find(item => item.id === input.topic);

  const system = `Sei l'editor capo di Bitora, studio digitale a Carmagnola/Piemonte.
Scrivi articoli magazine in italiano, concreti, senza hype.
Regole:
- Usa SOLO fatti presenti nelle fonti esterne o nei case study Bitora.
- Separa esplicitamente "segnale esterno" e "esperienza Bitora".
- Vietato inventare metriche, percentuali, ricavi, recensioni o nomi clienti non forniti.
- Se un numero non è nelle fonti, non citarlo.
- Collega 1-3 case study Bitora pertinenti tramite slug.
- Output JSON valido, niente markdown.
- content.blocks deve iniziare con type:"signal" (apertura 60 secondi).
- Includi heading, paragraph, proof, case, demo, diagnostic, cta, faq.
- Le fonti in sources devono avere URL delle fonti passate, mai URL inventati.
- inventedMetrics deve essere esattamente "none".`;

  const user = JSON.stringify({
    trend: {
      title: input.trendTitle,
      url: input.trendUrl,
      excerpt: input.trendExcerpt,
      topic: input.topic,
      category: pillar?.category,
      ctaVariant: pillar?.cta,
    },
    sources: input.sources,
    caseStudies: cases,
    schema: {
      title: 'string',
      slug: 'kebab-case',
      excerpt: 'string',
      category: pillar?.category,
      topic: input.topic,
      angle: 'string',
      abstract: 'string 80-140 parole',
      seoTitle: '30-70 chars',
      seoDescription: '70-160 chars',
      coverAlt: 'string',
      readTime: 'es. 7 min',
      ctaVariant: pillar?.cta,
      caseStudySlugs: ['slug'],
      visualHints: ['string'],
      inventedMetrics: 'none',
      sources: [{ title: 'string', url: 'https://...' }],
      content: {
        stages: [{ id: 'signal', label: 'Segnale' }],
        blocks: [
          { type: 'signal', heading: 'string', body: 'string', seconds: 60, stageId: 'signal' },
        ],
      },
    },
  });

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: modelName(),
      temperature: 0.4,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenAI ${response.status}: ${body.slice(0, 400)}`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    usage?: { prompt_tokens?: number; completion_tokens?: number };
  };
  const raw = payload.choices?.[0]?.message?.content ?? '';
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('OpenAI ha restituito JSON non valido');
  }
  const draft = parseGeneratedDraft(parsed);
  const tokensIn = payload.usage?.prompt_tokens ?? 0;
  const tokensOut = payload.usage?.completion_tokens ?? 0;
  const costUsd =
    (tokensIn / 1_000_000) * INPUT_COST_PER_M + (tokensOut / 1_000_000) * OUTPUT_COST_PER_M;
  return { draft, usage: { tokensIn, tokensOut, costUsd }, raw };
}
