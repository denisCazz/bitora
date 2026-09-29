/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />
/// <reference path="./types/global.d.ts" />

interface ImportMetaEnv {
  readonly RESEND_API_KEY?: string;
  readonly MAIL_FROM?: string;
  readonly MAIL_TO?: string;
  readonly MAIL_CC?: string;
  readonly UMAMI_WEBSITE_ID?: string;
  readonly UMAMI_API_TOKEN?: string;
  readonly OPS_PASSWORD?: string;
  readonly OPS_SESSION_SECRET?: string;
  readonly OPS_TOTP_SECRET?: string;
  readonly OPS_CRON_SECRET?: string;
  readonly OPS_STATE_PATH?: string;
  readonly OPS_VAULT_SEED_PATH?: string;
  readonly OPS_TELEGRAM_BOT_TOKEN?: string;
  readonly OPS_TELEGRAM_CHAT_ID?: string;
  readonly OPS_COOLIFY_URL?: string;
  readonly OPS_VPS_DISK_WARN?: string;
  readonly OPS_VPS_MEM_WARN?: string;
  readonly OPS_VPS_LOAD_WARN?: string;
  readonly OPS_SITE_TIMEOUT_MS?: string;
  readonly OPS_AGENT_STALE_MS?: string;
  readonly OPS_ALERT_REMIND_MS?: string;
  readonly OPS_CRON_STALE_MS?: string;
  readonly DATABASE_URL?: string;
  readonly TAVILY_API_KEY?: string;
  readonly OPENAI_API_KEY?: string;
  readonly OPENAI_MODEL?: string;
  readonly EDITORIAL_CRON_ENABLED?: string;
  readonly EDITORIAL_CRON_INTERVAL_HOURS?: string;
  readonly EDITORIAL_TOPICS_PER_RUN?: string;
  readonly EDITORIAL_QUERIES_PER_TOPIC?: string;
  readonly EDITORIAL_TAVILY_DEPTH?: string;
  readonly EDITORIAL_TAVILY_MAX_RESULTS?: string;
  readonly EDITORIAL_MAX_DRAFTS_PER_RUN?: string;
  readonly EDITORIAL_MAX_OPEN_DRAFTS?: string;
  readonly EDITORIAL_DAILY_BUDGET_USD?: string;
  readonly EDITORIAL_MEDIA_PATH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
