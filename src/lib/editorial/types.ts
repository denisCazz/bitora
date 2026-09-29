export const ARTICLE_STATUSES = ['DRAFT', 'IN_REVIEW', 'PUBLISHED', 'ARCHIVED'] as const;
export type ArticleStatus = (typeof ARTICLE_STATUSES)[number];

export const BLOCK_TYPES = [
  'signal',
  'heading',
  'paragraph',
  'list',
  'proof',
  'case',
  'demo',
  'diagnostic',
  'cta',
  'faq',
  'quote',
  'image',
] as const;
export type BlockType = (typeof BLOCK_TYPES)[number];

export const DEMO_KINDS = ['nfc-tap', 'roi', 'site-audit', 'pipeline'] as const;
export type DemoKind = (typeof DEMO_KINDS)[number];

export const CTA_VARIANTS = ['site-audit', 'demo', 'nfc', 'roi', 'contact', 'ecommerce'] as const;
export type CtaVariant = (typeof CTA_VARIANTS)[number];

export const EDITORIAL_TOPICS = [
  'nfc',
  'web',
  'ai',
  'crm',
  'gestionali',
  'ecommerce',
  'field',
] as const;
export type EditorialTopic = (typeof EDITORIAL_TOPICS)[number];

export type SourceRef = {
  title: string;
  url: string;
};

export type DiagnosticOption = {
  id: string;
  label: string;
  topic?: string;
  cta?: CtaVariant;
};

export type DiagnosticQuestion = {
  id: string;
  prompt: string;
  options: DiagnosticOption[];
};

export type ArticleBlock =
  | { type: 'signal'; heading: string; body: string; seconds?: number; stageId?: string }
  | { type: 'heading'; level: 2 | 3; text: string; stageId?: string }
  | { type: 'paragraph'; html: string; stageId?: string }
  | { type: 'list'; ordered?: boolean; items: string[]; stageId?: string }
  | { type: 'proof'; title: string; body: string; sources?: SourceRef[]; stageId?: string }
  | { type: 'case'; slug: string; lesson: string; stageId?: string }
  | { type: 'demo'; kind: DemoKind; title: string; body: string; stageId?: string }
  | { type: 'diagnostic'; questions: DiagnosticQuestion[]; stageId?: string }
  | { type: 'cta'; variant: CtaVariant; headline: string; body: string; stageId?: string }
  | { type: 'faq'; items: { question: string; answer: string }[]; stageId?: string }
  | { type: 'quote'; text: string; attribution?: string; stageId?: string }
  | {
      type: 'image';
      src: string;
      alt: string;
      caption?: string;
      eyebrow?: string;
      stageId?: string;
    };

export type JourneyStage = {
  id: string;
  label: string;
};

export type ArticleContent = {
  stages: JourneyStage[];
  blocks: ArticleBlock[];
};

export type GeneratedArticleDraft = {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  topic: EditorialTopic;
  angle: string;
  abstract: string;
  seoTitle: string;
  seoDescription: string;
  coverImage?: string;
  coverAlt?: string;
  readTime: string;
  ctaVariant: CtaVariant;
  caseStudySlugs: string[];
  visualHints: string[];
  content: ArticleContent;
  sources: SourceRef[];
};

export type SeoIssue = {
  field: string;
  message: string;
  level: 'error' | 'warning';
};

export type PublishCheck = {
  ok: boolean;
  errors: string[];
  warnings: string[];
};
