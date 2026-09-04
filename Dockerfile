# syntax=docker/dockerfile:1

# Stage 1: Install ALL dependencies (needed for build)
FROM node:22-alpine AS deps
WORKDIR /app
ENV NPM_CONFIG_UPDATE_NOTIFIER=false
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

# Stage 2: Build the Astro site
FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Drop devDependencies from the already-installed tree
FROM node:22-alpine AS prod-deps
WORKDIR /app
COPY package.json package-lock.json* ./
COPY --from=deps /app/node_modules ./node_modules
RUN npm prune --omit=dev --no-audit --no-fund

# Stage 4: Minimal runtime image
FROM node:22-alpine AS runtime
WORKDIR /app

# Install curl for Coolify healthcheck
RUN apk add --no-cache curl

# Security: run as non-root user
RUN addgroup -S astro && adduser -S astro -G astro

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

# Set ownership
RUN chown -R astro:astro /app
USER astro

ENV HOST=0.0.0.0
ENV PORT=4321
ENV NODE_ENV=production
EXPOSE 4321

HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://127.0.0.1:${PORT:-4321}/ || exit 1

CMD ["node", "./dist/server/entry.mjs"]
