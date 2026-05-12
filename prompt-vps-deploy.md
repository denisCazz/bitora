# Prompt: Configurazione VPS per Deploy di un Progetto Web

Usa questo prompt per configurare il deploy su VPS (con Coolify o simili) di un nuovo progetto web.

---

## Istruzioni

Configura il deploy VPS per il mio progetto con le seguenti specifiche:

### 1. Framework e modalità di rendering

- **Framework**: `[Astro / Next.js / altro]`
- **Modalità output**: `[static / server (SSR) / hybrid]`
- **Node version**: `[22 / 20 / 18]`
- **Package manager**: `[npm / pnpm / yarn]`

> **Nota importante sulle differenze:**
>
> | | Static (SSG) | Server (SSR) |
> |---|---|---|
> | **Astro** | `output: 'static'` — genera HTML puro, servibile con nginx/caddy senza Node runtime. Non richiede adapter. | `output: 'server'` — richiede `@astrojs/node` adapter in modo `standalone`. Entry point: `node ./dist/server/entry.mjs` |
> | **Next.js** | `output: 'export'` in `next.config.js` — genera HTML puro in `out/`, servibile con nginx/caddy. | Default o `output: 'standalone'` — richiede Node runtime. Entry point: `node server.js` (standalone) o `next start` |
> | **Dockerfile** | Lo stage finale può essere **nginx/caddy** (nessun Node runtime necessario). Copia solo i file statici. | Lo stage finale deve essere **node:alpine**. Copia `node_modules` di produzione + build output. |
> | **Healthcheck** | Healthcheck HTTP su file statico (es. `curl -f http://localhost/index.html`) | Healthcheck HTTP su endpoint live (es. `curl -f http://localhost:PORT/`) |
> | **Port** | Definita dal web server (80/443) | Definita dall'app Node (`PORT` env var, tipicamente 3000 o 4321) |

---

### 2. Dockerfile multi-stage

Crea un Dockerfile ottimizzato con le seguenti caratteristiche:

```
Stage 1 (deps):      Installa TUTTE le dipendenze (servono per la build)
Stage 2 (build):     Copia node_modules da deps + source code → esegui build
Stage 3 (prod-deps): Installa solo dipendenze di produzione (--omit=dev)
Stage 4 (runtime):   Immagine minimale con solo ciò che serve per eseguire
```

**Requisiti:**
- Base image: `node:XX-alpine` (sostituisci XX con la versione Node scelta)
- **Utente non-root** per sicurezza (crea gruppo + utente dedicato, assegna ownership)
- Installa `curl` per healthcheck (solo se servono healthcheck HTTP)
- **Healthcheck** configurato per Coolify/Portainer:
  - `--interval=10s --timeout=5s --start-period=30s --retries=3`
  - Comando: `curl -f http://127.0.0.1:${PORT}/ || exit 1`
- Variabili d'ambiente: `HOST=0.0.0.0`, `PORT=XXXX`, `NODE_ENV=production`
- `EXPOSE` sulla porta corretta
- **CMD** appropriato al framework:
  - Astro SSR: `["node", "./dist/server/entry.mjs"]`
  - Astro static: non serve Node runtime — usa nginx
  - Next.js standalone: `["node", "server.js"]`
  - Next.js standard: `["npm", "start"]`

**Esempio struttura (SSR con Node):**

```dockerfile
# Stage 1: Install ALL dependencies
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Build
FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Production dependencies only
FROM node:22-alpine AS prod-deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Stage 4: Minimal runtime
FROM node:22-alpine AS runtime
WORKDIR /app
RUN apk add --no-cache curl
RUN addgroup -S appuser && adduser -S appuser -G appuser

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

RUN chown -R appuser:appuser /app
USER appuser

ENV HOST=0.0.0.0
ENV PORT=4321
ENV NODE_ENV=production
EXPOSE 4321

HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://127.0.0.1:${PORT:-4321}/ || exit 1

CMD ["node", "./dist/server/entry.mjs"]
```

**Esempio struttura (Static con nginx):**

```dockerfile
# Stage 1: Install dependencies
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Build
FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Serve static files
FROM nginx:alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
# Opzionale: custom nginx config
# COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://127.0.0.1/ || exit 1
```

---

### 3. .dockerignore

Crea un `.dockerignore` per escludere dal build context:

```
node_modules
dist
.git
.env
.env.*
*.log
.DS_Store
tests
playwright-report
test-results
.next
out
```

---

### 4. Configurazione framework

#### Se Astro (`astro.config.mjs`):

```javascript
// Per SSR:
import node from '@astrojs/node';
export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  // ...
});

// Per Static:
export default defineConfig({
  output: 'static',
  // Nessun adapter necessario
  // ...
});
```

#### Se Next.js (`next.config.js`):

```javascript
// Per SSR standalone (ottimale per Docker):
module.exports = {
  output: 'standalone',
  // ...
};

// Per Static export:
module.exports = {
  output: 'export',
  // ...
};
```

**Configurazioni comuni da includere:**

- **Compressione HTML**: abilitata (`compressHTML: true` in Astro)
- **Compressione assets**: gzip + brotli (via plugin `astro-compressor` o middleware Next.js)
- **CSS minification**: LightningCSS (via Vite config)
- **JS minification**: Terser (via Vite config)
- **Prefetch**: strategia `viewport` per precaricamento link visibili
- **Inline stylesheets**: `auto` per CSS critico inline
- **Assets hashing**: nomi file con hash per cache busting

```javascript
// Esempio Vite build config (valido per Astro):
vite: {
  build: {
    cssMinify: 'lightningcss',
    minify: 'terser',
  },
},
```

---

### 5. Security headers

Configura questi header di sicurezza nel framework o nel reverse proxy:

```javascript
server: {
  headers: {
    'Cache-Control': 'public, max-age=31536000, immutable',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  },
},
```

> **Nota:** Per siti static serviti con nginx, questi header vanno configurati nel blocco `server` di nginx.conf. Per SSR possono essere impostati nel config del framework.

---

### 6. CI/CD Pipeline (GitHub Actions)

Crea `.github/workflows/ci.yml` con tre job:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-and-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run check    # Type checking / diagnostics
      - run: npm run lint      # Prettier + ESLint

  build:
    runs-on: ubuntu-latest
    needs: lint-and-check
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build

  security:
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm audit --audit-level=high
        continue-on-error: true
```

---

### 7. Script package.json

Assicurati che questi script siano presenti:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "build:production": "npm run build && npm run optimize",
    "optimize": "echo Running post-build optimizations...",
    "preview": "astro preview",
    "check": "astro check",
    "lint": "prettier --check . && eslint .",
    "format": "prettier --write .",
    "test": "playwright test",
    "security-check": "npm audit && npm outdated"
  }
}
```

> **Per Next.js** sostituire con: `"dev": "next dev"`, `"build": "next build"`, `"start": "next start"`, `"lint": "next lint"`.

---

### 8. robots.txt

```
User-agent: *
Allow: /

Sitemap: https://DOMINIO/sitemap.xml

# Blocca aree admin
Disallow: /admin/
Disallow: /.well-known/

# Blocca query string per evitare contenuti duplicati
Disallow: /*?*
```

---

### 9. Dipendenze chiave per il deploy

**Astro SSR:**
```
@astrojs/node          # Adapter Node standalone
astro-compressor       # Gzip + Brotli compression
@astrojs/sitemap       # Sitemap automatico
terser                 # JS minification
lightningcss           # CSS minification (devDependency)
```

**Next.js:**
```
# Next.js ha compressione e ottimizzazione built-in
# Per standalone mode non servono dipendenze aggiuntive
next-sitemap           # Sitemap automatico (opzionale)
```

---

### 10. Checklist finale

- [ ] Dockerfile multi-stage con utente non-root
- [ ] .dockerignore configurato
- [ ] Security headers impostati
- [ ] Compressione gzip + brotli abilitata
- [ ] CSS/JS minification configurata
- [ ] CI/CD pipeline con lint + build + security audit
- [ ] Healthcheck per container orchestrator
- [ ] robots.txt con sitemap
- [ ] Sitemap generato automaticamente
- [ ] Cache headers per assets statici (1 anno immutable)
- [ ] HSTS con preload abilitato
- [ ] Variabili d'ambiente per HOST/PORT/NODE_ENV

---

## Come usare questo prompt

Copia questo prompt e compilalo sostituendo:
1. **Framework** e **modalità output** nella sezione 1
2. **Porta** dell'applicazione (4321 per Astro, 3000 per Next.js)
3. **Dominio** nel robots.txt e nella sitemap
4. **Comandi specifici** del framework negli script package.json
5. **Entry point** nel CMD del Dockerfile

Poi passa il prompt all'AI chiedendo: *"Configura il deploy VPS per il mio progetto seguendo queste specifiche"*.