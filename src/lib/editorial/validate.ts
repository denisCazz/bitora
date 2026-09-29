import { BLOCK_TYPES, CTA_VARIANTS, DEMO_KINDS, EDITORIAL_TOPICS } from './types';
import type {
  ArticleBlock,
  ArticleContent,
  CtaVariant,
  DemoKind,
  GeneratedArticleDraft,
  PublishCheck,
  SeoIssue,
} from './types';
import { isValidSlug } from './slug';
import { normalizeUrl } from './dedupe';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function asNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

export function parseArticleContent(raw: unknown): ArticleContent {
  if (!isRecord(raw)) throw new Error('Contenuto articolo non valido');
  const stagesRaw = Array.isArray(raw.stages) ? raw.stages : [];
  const blocksRaw = Array.isArray(raw.blocks) ? raw.blocks : [];
  const stages = stagesRaw
    .map(item => {
      if (!isRecord(item)) return null;
      const id = asString(item.id);
      const label = asString(item.label);
      if (!id || !label) return null;
      return { id, label };
    })
    .filter((item): item is { id: string; label: string } => Boolean(item));
  const blocks = blocksRaw.map(parseBlock);
  if (!blocks.length) throw new Error('L’articolo deve contenere almeno un blocco');
  return { stages: stages.length ? stages : [{ id: 'signal', label: 'Segnale' }], blocks };
}

export function parseBlock(raw: unknown): ArticleBlock {
  if (!isRecord(raw)) throw new Error('Blocco non valido');
  const type = asString(raw.type);
  if (!BLOCK_TYPES.includes(type as ArticleBlock['type'])) {
    throw new Error(`Tipo blocco sconosciuto: ${type || 'vuoto'}`);
  }
  const stageId = asString(raw.stageId) || undefined;

  switch (type) {
    case 'signal':
      return {
        type,
        heading: requiredText(raw.heading, 'heading segnale'),
        body: requiredText(raw.body, 'body segnale'),
        seconds: asNumber(raw.seconds) ?? 60,
        stageId,
      };
    case 'heading': {
      const level = raw.level === 3 ? 3 : 2;
      return { type, level, text: requiredText(raw.text, 'titolo'), stageId };
    }
    case 'paragraph':
      return { type, html: requiredText(raw.html, 'paragrafo'), stageId };
    case 'list': {
      const items = Array.isArray(raw.items)
        ? raw.items.map(item => asString(item)).filter(Boolean)
        : [];
      if (!items.length) throw new Error('Lista vuota');
      return { type, ordered: Boolean(raw.ordered), items, stageId };
    }
    case 'proof':
      return {
        type,
        title: requiredText(raw.title, 'titolo prova'),
        body: requiredText(raw.body, 'corpo prova'),
        sources: parseSourceRefs(raw.sources),
        stageId,
      };
    case 'case':
      return {
        type,
        slug: requiredText(raw.slug, 'slug case study'),
        lesson: requiredText(raw.lesson, 'lezione case study'),
        stageId,
      };
    case 'demo': {
      const kind = asString(raw.kind);
      if (!DEMO_KINDS.includes(kind as DemoKind)) {
        throw new Error(`Demo sconosciuta: ${kind}`);
      }
      return {
        type,
        kind: kind as DemoKind,
        title: requiredText(raw.title, 'titolo demo'),
        body: requiredText(raw.body, 'corpo demo'),
        stageId,
      };
    }
    case 'diagnostic': {
      const questions = Array.isArray(raw.questions) ? raw.questions.map(parseQuestion) : [];
      if (!questions.length) throw new Error('Diagnostico senza domande');
      return { type, questions, stageId };
    }
    case 'cta': {
      const variant = asString(raw.variant) as CtaVariant;
      if (!CTA_VARIANTS.includes(variant)) throw new Error(`CTA sconosciuta: ${variant}`);
      return {
        type,
        variant,
        headline: requiredText(raw.headline, 'titolo CTA'),
        body: requiredText(raw.body, 'corpo CTA'),
        stageId,
      };
    }
    case 'faq': {
      const items = Array.isArray(raw.items)
        ? raw.items
            .map(item => {
              if (!isRecord(item)) return null;
              const question = asString(item.question);
              const answer = asString(item.answer);
              if (!question || !answer) return null;
              return { question, answer };
            })
            .filter((item): item is { question: string; answer: string } => Boolean(item))
        : [];
      if (!items.length) throw new Error('FAQ vuota');
      return { type, items, stageId };
    }
    case 'quote':
      return {
        type,
        text: requiredText(raw.text, 'citazione'),
        attribution: asString(raw.attribution) || undefined,
        stageId,
      };
    case 'image':
      return {
        type,
        src: requiredText(raw.src, 'src immagine'),
        alt: requiredText(raw.alt, 'alt immagine'),
        caption: asString(raw.caption) || undefined,
        eyebrow: asString(raw.eyebrow) || undefined,
        stageId,
      };
    default:
      throw new Error(`Tipo blocco non gestito: ${type}`);
  }
}

function parseQuestion(raw: unknown) {
  if (!isRecord(raw)) throw new Error('Domanda diagnostico non valida');
  const options = Array.isArray(raw.options)
    ? raw.options
        .map(option => {
          if (!isRecord(option)) return null;
          const id = asString(option.id);
          const label = asString(option.label);
          if (!id || !label) return null;
          const cta = asString(option.cta);
          return {
            id,
            label,
            topic: asString(option.topic) || undefined,
            cta: CTA_VARIANTS.includes(cta as CtaVariant) ? (cta as CtaVariant) : undefined,
          };
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item))
    : [];
  if (options.length < 2) throw new Error('Ogni domanda serve almeno due opzioni');
  return {
    id: requiredText(raw.id, 'id domanda'),
    prompt: requiredText(raw.prompt, 'prompt domanda'),
    options,
  };
}

function parseSourceRefs(raw: unknown) {
  if (!Array.isArray(raw)) return undefined;
  const sources = raw
    .map(item => {
      if (!isRecord(item)) return null;
      const title = asString(item.title);
      const url = normalizeUrl(asString(item.url));
      if (!title || !url) return null;
      return { title, url };
    })
    .filter((item): item is { title: string; url: string } => Boolean(item));
  return sources.length ? sources : undefined;
}

function requiredText(value: unknown, label: string): string {
  const text = asString(value);
  if (!text) throw new Error(`Campo obbligatorio: ${label}`);
  return text;
}

export function parseGeneratedDraft(raw: unknown): GeneratedArticleDraft {
  if (!isRecord(raw)) throw new Error('Bozza AI non è un oggetto JSON');
  const topic = asString(raw.topic);
  if (!EDITORIAL_TOPICS.includes(topic as GeneratedArticleDraft['topic'])) {
    throw new Error(`Topic non consentito: ${topic || 'vuoto'}`);
  }
  const ctaVariant = asString(raw.ctaVariant) as CtaVariant;
  if (!CTA_VARIANTS.includes(ctaVariant)) throw new Error(`CTA non consentita: ${ctaVariant}`);
  const caseStudySlugs = Array.isArray(raw.caseStudySlugs)
    ? raw.caseStudySlugs.map(item => asString(item)).filter(Boolean)
    : [];
  const visualHints = Array.isArray(raw.visualHints)
    ? raw.visualHints.map(item => asString(item)).filter(Boolean)
    : [];
  const sources = parseSourceRefs(raw.sources) ?? [];
  const invented = asString(raw.inventedMetrics);
  if (invented && invented !== 'none') {
    throw new Error('La bozza contiene metriche non verificabili');
  }
  const content = parseArticleContent(raw.content);
  const hasSignal = content.blocks.some(block => block.type === 'signal');
  if (!hasSignal) throw new Error('La bozza deve aprire con un blocco segnale');
  return {
    title: requiredText(raw.title, 'title'),
    slug: slugOrThrow(raw.slug),
    excerpt: requiredText(raw.excerpt, 'excerpt'),
    category: requiredText(raw.category, 'category'),
    topic: topic as GeneratedArticleDraft['topic'],
    angle: requiredText(raw.angle, 'angle'),
    abstract: requiredText(raw.abstract, 'abstract'),
    seoTitle: requiredText(raw.seoTitle, 'seoTitle'),
    seoDescription: requiredText(raw.seoDescription, 'seoDescription'),
    coverImage: asString(raw.coverImage) || undefined,
    coverAlt: asString(raw.coverAlt) || undefined,
    readTime: asString(raw.readTime) || '6 min',
    ctaVariant,
    caseStudySlugs,
    visualHints,
    content,
    sources,
  };
}

function slugOrThrow(value: unknown): string {
  const slug = asString(value);
  if (!isValidSlug(slug)) throw new Error('Slug non valido');
  return slug;
}

export function collectSeoIssues(input: {
  title: string;
  seoTitle: string;
  seoDescription: string;
  slug: string;
  coverImage?: string | null;
  coverAlt?: string | null;
  excerpt: string;
}): SeoIssue[] {
  const issues: SeoIssue[] = [];
  if (!isValidSlug(input.slug))
    issues.push({ field: 'slug', message: 'Slug kebab-case obbligatorio', level: 'error' });
  if (input.seoTitle.length < 30 || input.seoTitle.length > 70) {
    issues.push({ field: 'seoTitle', message: 'Title SEO tra 30 e 70 caratteri', level: 'error' });
  }
  if (input.seoDescription.length < 70 || input.seoDescription.length > 160) {
    issues.push({
      field: 'seoDescription',
      message: 'Meta description tra 70 e 160 caratteri',
      level: 'error',
    });
  }
  if (input.title.length < 12) {
    issues.push({ field: 'title', message: 'Titolo troppo corto', level: 'error' });
  }
  if (input.excerpt.length < 40) {
    issues.push({ field: 'excerpt', message: 'Excerpt troppo corto', level: 'warning' });
  }
  if (input.coverImage && !input.coverAlt) {
    issues.push({
      field: 'coverAlt',
      message: 'Alt cover obbligatorio per accessibilità',
      level: 'error',
    });
  }
  if (!input.coverImage) {
    issues.push({ field: 'coverImage', message: 'Cover mancante', level: 'warning' });
  }
  return issues;
}

export function evaluatePublishReadiness(input: {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  excerpt: string;
  coverImage?: string | null;
  coverAlt?: string | null;
  content: unknown;
  sourceCount: number;
  caseStudySlugs: string[];
  confirm: boolean;
}): PublishCheck {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (!input.confirm) errors.push('La pubblicazione richiede conferma esplicita');
  try {
    const content = parseArticleContent(input.content);
    if (!content.blocks.some(block => block.type === 'signal')) {
      errors.push('Manca il blocco segnale di apertura');
    }
    if (!content.blocks.some(block => block.type === 'paragraph' || block.type === 'heading')) {
      errors.push('Manca la lettura profonda');
    }
  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'Contenuto non valido');
  }
  if (input.sourceCount < 1 && input.caseStudySlugs.length < 1) {
    errors.push('Serve almeno una fonte o un case study Bitora');
  }
  for (const issue of collectSeoIssues(input)) {
    if (issue.level === 'error') errors.push(issue.message);
    else warnings.push(issue.message);
  }
  return { ok: errors.length === 0, errors, warnings };
}

export function stripInventedClaims(text: string): string {
  return text.replace(/\b(\d{2,3}%|\+\d{2,}%)\b/g, '[dato da verificare]');
}
