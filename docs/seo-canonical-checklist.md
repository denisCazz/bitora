# Checklist SEO esterna — Bitora

Operazioni **non** gestite dal repository. Completarle dopo il deploy del codice apex.

## 1. Proxy / Coolify (obbligatorio)

Responsabilità del proxy (**Coolify / Traefik**, non Astro):

- `http://*` → `https://*` con **301**
- `https://www.bitora.it/:path*` → `https://bitora.it/:path*` con **301**, path e query preservati
- un solo salto (niente catene www→apex→slash)

Responsabilità di **Astro** (non Coolify):

- trailing slash canonico (`/e-commerce` → `/e-commerce/`)
- redirect legacy di percorso (`/e-commerce-piemonte/` → `/e-commerce/`, ecc.)

### Stato live attuale (2026-08-10)

Prima dell’applicazione dei middleware permanenti, la produzione risponde con **302** sui redirect host/proxy.

#### HTTPS www → apex (302, un salto)

```powershell
curl.exe -sS -o NUL -D - https://www.bitora.it/
# HTTP/1.1 302 Found
# Location: https://bitora.it/

curl.exe -sS -o NUL -D - https://www.bitora.it/e-commerce/
# HTTP/1.1 302 Found
# Location: https://bitora.it/e-commerce/

curl.exe -sS -o NUL -D - "https://www.bitora.it/contattaci/?topic=sito"
# HTTP/1.1 302 Found
# Location: https://bitora.it/contattaci/?topic=sito
```

#### HTTP apex → HTTPS apex (302, un salto)

```powershell
curl.exe -sS -o NUL -D - http://bitora.it/
# HTTP/1.1 302 Found
# Location: https://bitora.it/
```

#### HTTP www → catena temporanea a due salti (302 + 302)

Primo salto — upgrade HTTP→HTTPS **senza** normalizzazione host:

```powershell
curl.exe -sS -o NUL -D - http://www.bitora.it/
# HTTP/1.1 302 Found
# Location: https://www.bitora.it/
```

Seguendo i redirect (`-L`), la catena completa è:

```powershell
curl.exe -sS -L -o NUL -D - http://www.bitora.it/
# 1) HTTP/1.1 302 Found → Location: https://www.bitora.it/
# 2) HTTP/1.1 302 Found → Location: https://bitora.it/
# 3) HTTP/1.1 200 OK
```

Stesso schema su percorso interno:

```powershell
curl.exe -sS -L -o NUL -D - http://www.bitora.it/e-commerce/
# 1) HTTP/1.1 302 Found → Location: https://www.bitora.it/e-commerce/
# 2) HTTP/1.1 302 Found → Location: https://bitora.it/e-commerce/
# 3) HTTP/1.1 200 OK
```

#### Astro — trailing slash e legacy (301, già attivi)

```powershell
curl.exe -sS -o NUL -D - https://bitora.it/e-commerce
# HTTP/1.1 301 Moved Permanently → Location: /e-commerce/

curl.exe -sS -o NUL -D - https://bitora.it/e-commerce-piemonte/
# HTTP/1.1 301 Moved Permanently → Location: /e-commerce/
```

Obiettivo post-Coolify: tutti i redirect proxy/host con **301** e un solo salto verso `https://bitora.it/<path>/` (eventuale secondo salto Astro solo per slash/legacy su apex HTTPS).

### Passi da eseguire in Coolify (operatore)

> **Azione esterna ancora da completare:** questi passi vanno applicati manualmente in Coolify. Il repository documenta solo baseline live e configurazione target; non può confermare l’applicazione finché l’operatore non ridistribuisce.

Bitora è un’**applicazione Standard con Dockerfile** (non Docker Compose). I middleware Traefik vanno **definiti** come etichette e poi **collegati ai router generati** visibili in **Container Labels**. **Non** usare `coolify.traefik.middlewares`: quello è lo shorthand per servizi Docker Compose.

1. Aprire l’applicazione Bitora in Coolify.
2. In **Direction**, impostare **Allow both** con **Readonly labels** abilitato → **Salvare**.
3. Disabilitare **Readonly labels** per aggiungere etichette manuali.
4. Mantenere entrambi i domini HTTPS sulla stessa risorsa: `https://bitora.it` e `https://www.bitora.it`.
5. Mantenere apex come dominio canonico dell’applicazione.
6. In **Container Labels**, individuare i nomi router generati da Coolify (es. `http-0-…`, `https-0-…`). I placeholder `<ROUTER_*>` sotto vanno sostituiti con quei nomi reali.
7. Aggiungere le definizioni middleware e i collegamenti router tramite l’editor etichette personalizzate (**non** modificare i file proxy generati). Ordine host-first: prima normalizzazione www→apex, poi upgrade HTTP→HTTPS su apex (sicuro anche su HTTPS):

```text
traefik.http.middlewares.bitora-to-apex.redirectregex.regex=^https?://www\.(.+)
traefik.http.middlewares.bitora-to-apex.redirectregex.replacement=https://${1}
traefik.http.middlewares.bitora-to-apex.redirectregex.permanent=true
traefik.http.middlewares.bitora-to-https.redirectscheme.scheme=https
traefik.http.middlewares.bitora-to-https.redirectscheme.permanent=true
traefik.http.routers.<ROUTER_HTTP_WWW>.middlewares=gzip,bitora-to-apex
traefik.http.routers.<ROUTER_HTTPS_WWW>.middlewares=gzip,bitora-to-apex
traefik.http.routers.<ROUTER_HTTP_APEX>.middlewares=gzip,bitora-to-https
traefik.http.routers.<ROUTER_HTTPS_APEX>.middlewares=gzip
```

8. Se l’editor Coolify richiede escape di `$`, usare `$${1}` come indicato dall’interfaccia.
9. **Ridistribuire** l’applicazione così Traefik rigenera la configurazione attiva del router.

**Collegamenti router (sostituire i placeholder):**

| Router generato (regola `Host`)                  | Middleware (dopo `gzip`)          |
| ------------------------------------------------ | --------------------------------- |
| `<ROUTER_HTTP_WWW>` — `Host(\`www.bitora.it\`)`  | `bitora-to-apex`                  |
| `<ROUTER_HTTPS_WWW>` — `Host(\`www.bitora.it\`)` | `bitora-to-apex`                  |
| `<ROUTER_HTTP_APEX>` — `Host(\`bitora.it\`)`     | `bitora-to-https`                 |
| `<ROUTER_HTTPS_APEX>` — `Host(\`bitora.it\`)`    | _(nessun redirect — solo `gzip`)_ |

Perché due middleware: il solo `redirectregex` www non copre `http://bitora.it/`; `redirectscheme` completa l’upgrade HTTP→HTTPS su apex. Con `bitora-to-apex` sui router www, `http://www.bitora.it/...` va direttamente a `https://bitora.it/...` in un solo **301** (host-first: regex www→apex include già lo schema `https` in destinazione).

### Configurazione Coolify target (non ancora applicata)

Configurazione **attesa** dopo deploy operatore — **non** verificata live al 2026-08-10. Sostituire `<ROUTER_*>` con i nomi reali da Container Labels:

```text
traefik.http.middlewares.bitora-to-apex.redirectregex.regex=^https?://www\.(.+)
traefik.http.middlewares.bitora-to-apex.redirectregex.replacement=https://${1}
traefik.http.middlewares.bitora-to-apex.redirectregex.permanent=true
traefik.http.middlewares.bitora-to-https.redirectscheme.scheme=https
traefik.http.middlewares.bitora-to-https.redirectscheme.permanent=true
traefik.http.routers.<ROUTER_HTTP_WWW>.middlewares=gzip,bitora-to-apex
traefik.http.routers.<ROUTER_HTTPS_WWW>.middlewares=gzip,bitora-to-apex
traefik.http.routers.<ROUTER_HTTP_APEX>.middlewares=gzip,bitora-to-https
traefik.http.routers.<ROUTER_HTTPS_APEX>.middlewares=gzip
```

Dopo ogni modifica ai domini o al proxy, rieseguire la matrice sotto con `curl.exe -D -`.

### Matrice di verifica post-modifica (target — non live)

Eseguire **solo dopo** il redeploy Coolify. Gli esiti sotto sono **attesi**, non lo stato attuale della produzione.

#### Coolify / Traefik — host e schema

| Comando                                                                   | Atteso                                               |
| ------------------------------------------------------------------------- | ---------------------------------------------------- |
| `curl.exe -sS -o NUL -D - http://bitora.it/`                              | **301** → `https://bitora.it/`                       |
| `curl.exe -sS -o NUL -D - http://www.bitora.it/`                          | **301** → `https://bitora.it/` (un salto)            |
| `curl.exe -sS -o NUL -D - https://www.bitora.it/`                         | **301** → `https://bitora.it/`                       |
| `curl.exe -sS -o NUL -D - https://www.bitora.it/e-commerce/`              | **301** → `https://bitora.it/e-commerce/`            |
| `curl.exe -sS -o NUL -D - "https://www.bitora.it/contattaci/?topic=sito"` | **301** → `https://bitora.it/contattaci/?topic=sito` |

Verificare che `http://www.bitora.it/...` **non** produca più la catena `http→https://www→https://apex` con due **302**.

#### Astro — trailing slash e legacy (apex HTTPS)

| Comando                                                           | Atteso                                    |
| ----------------------------------------------------------------- | ----------------------------------------- |
| `curl.exe -sS -o NUL -D - https://bitora.it/e-commerce`           | **301** → `https://bitora.it/e-commerce/` |
| `curl.exe -sS -o NUL -D - https://bitora.it/e-commerce-piemonte/` | **301** → `https://bitora.it/e-commerce/` |
| `curl.exe -sS -o NUL -D - https://bitora.it/siti-web-torino/`     | **301** → destinazione legacy canonica    |
| `curl.exe -sS -o NUL -D - https://bitora.it/tessere-nfc-torino/`  | **301** → destinazione legacy canonica    |

Comandi rapidi (Coolify):

```powershell
curl.exe -sS -o NUL -D - http://bitora.it/
curl.exe -sS -o NUL -D - http://www.bitora.it/
curl.exe -sS -o NUL -D - https://www.bitora.it/
curl.exe -sS -o NUL -D - https://www.bitora.it/e-commerce/
curl.exe -sS -o NUL -D - "https://www.bitora.it/contattaci/?topic=sito"
```

Comandi rapidi (Astro):

```powershell
curl.exe -sS -o NUL -D - https://bitora.it/e-commerce
curl.exe -sS -o NUL -D - https://bitora.it/e-commerce-piemonte/
```

## 2. Search Console — esperimento CTR 28 giorni

> **Azioni esterne ancora da completare:** il repository non ha integrazione con Search Console né con il deploy. Nessun passo sotto è stato avviato o verificato dal codice. L’operatore esegue manualmente baseline, deploy annotato, sitemap, richieste di indicizzazione e valutazione post-28-giorni.

### Baseline pre-deploy (Step 1 — prima del deploy)

Esportare da Search Console **prima** che HTML aggiornato e middleware Coolify §1 siano live in produzione, **ancorato alla data ISO di deploy** registrata in Step 2.

**Finestra (identica alla pre-deploy §4):** esattamente **28 giorni** consecutivi da **D−28** a **D−1** (data ISO di deploy = **D**; il giorno D è **escluso**). Annotare date inizio/fine ISO — es. se deploy = `2026-09-01`, baseline = `2026-08-04` → `2026-08-31`.

Se esiste già un export di riferimento anticipato (es. valori tabella sotto), l’operatore **deve** riesportare il baseline ancorato al deploy **al go-live o immediatamente prima**, con la stessa finestra sopra. Solo quell’export è confrontabile con la finestra post §4 (**D+1** → **D+28**, deploy escluso).

**Dimensioni export:** **query × pagina** (query and page).

**Segmenti/filtri** da includere nell’export o in export separati coerenti:

- brand vs non-brand;
- paese (country);
- dispositivo (device).

**Metriche:** clic, impression, CTR, posizione media.

Conservare l’export grezzo **invariato** (non arrotondare o aggregare manualmente prima del confronto).

**Valori di riferimento noti** (baseline di riferimento — non sostituiscono l’export grezzo):

| Query / cluster                                         | Clic | Impression | Posizione media | Ruolo nell’esperimento                                                                                       |
| ------------------------------------------------------- | ---: | ---------: | --------------: | ------------------------------------------------------------------------------------------------------------ |
| `web development`                                       |    0 |        167 |               8 | **Test CTR/intent** — posizione vicina alla prima pagina (~8); variazioni di clic/CTR pesano più del ranking |
| cluster e-commerce B2B (`ecommerce b2b piemonte`, ecc.) |    0 |        119 |             ~31 | **Test rilevanza/ranking** — finché resta lontano dalla pagina 1, impression e posizione contano più del CTR |
| homepage (righe apex + `www` combinate)                 |    1 |        621 |               — | pagina prioritaria                                                                                           |
| branded `bitora`                                        |    1 |          8 |               — | controllo brand                                                                                              |

### Deploy e data di riferimento (Step 2 — stesso giorno del go-live)

> **Azione esterna:** registrare la **data ISO esatta** del deploy (giorno in cui HTML aggiornato e redirect proxy **301** §1 sono live) nelle note analytics del team. **Non** confrontare range misti pre/post-deploy. **Non** inserire qui una data finché l’operatore non la registra dopo il deploy reale.

### Sitemap e pagine prioritarie (Step 3 — dopo deploy verificato)

Eseguire **solo** dopo deploy produzione e matrice Coolify §1 verificata.

1. Inviare **solo** `https://bitora.it/sitemap-index.xml`.
2. Verificare che l’indice punti a `https://bitora.it/sitemap-0.xml` (o figlio apex).
3. Dopo lettura riuscita, rimuovere:
   - `https://www.bitora.it/sitemap.xml`
   - `https://www.bitora.it/sitemap-0.xml`
   - eventuali altre sitemap `www`
4. Ispezionare URL e richiedere indicizzazione **solo** delle tre pagine prioritarie dell’esperimento CTR:
   - `https://bitora.it/`
   - `https://bitora.it/siti-web-professionali/`
   - `https://bitora.it/e-commerce/`

### Consolidamento tecnico post-recrawl (Step 4)

Dopo che Google ricrawl le tre pagine prioritarie, verificare:

- canonical selezionato da Google = canonical apex dichiarato in HTML per ciascuna pagina;
- varianti URL legacy (`www`, slash mancante, path legacy) in stato **redirect** o **duplicato/canonicalizzato**, non indicizzate come URL principali.

Aprire il rapporto “Pagine non indicizzate”, annotare le motivazioni e classificarle: corretta / redirect-legacy / errore.

## 3. Analytics

### Umami (`umami.bitora.it`)

Creare obiettivi sugli eventi:

- `cta_click`
- `demo_form_view`
- `demo_form_start`
- `lead_form_submit`
- `whatsapp_click`
- `phone_click`
- `page_404`

### Google Ads

Prima di aggiornare il codice `send_to`, creare una conversion action con **label** specifica. Solo dopo sostituire il send_to generico `AW-17047013851`.

### Meta Pixel

Verificare in Events Manager gli eventi `PageView` e `Lead` dopo consenso marketing.

## 4. Monitoraggio post-deploy — valutazione 28 giorni (Step 5)

> **Azione esterna:** avviare il contatore **solo** dopo **28 giorni completi** dalla data ISO di deploy registrata in §2 (**D+1** → **D+28**; il giorno D è escluso). Il repository non avvia né monitora l’esperimento.

### Regola delle finestre uguali

Confrontare **due finestre da 28 giorni ciascuna**, stesse dimensioni e segmenti del baseline §2. Il giorno di deploy **D** non entra in nessuna delle due:

| Finestra    | Periodo                                                              |
| ----------- | -------------------------------------------------------------------- |
| Pre-deploy  | **D−28** → **D−1** (28 giorni consecutivi prima del deploy)          |
| Post-deploy | **D+1** → **D+28** (28 giorni consecutivi dopo il deploy; D escluso) |

**Non** sovrapporre o mescolare giorni pre e post. **Non** abbreviare il post-deploy sotto 28 giorni completi. **Non** avviare un secondo ciclo title/description prima che questo confronto sia chiuso.

Export post-deploy: stesse dimensioni (**query × pagina**), segmenti (brand/non-brand, paese, dispositivo) e metriche del baseline.

### Metriche primarie e controlli

**Primarie** (non-brand, per ciascuna pagina prioritaria: `/`, `/siti-web-professionali/`, `/e-commerce/`):

- CTR non-brand;
- clic non-brand.

**Controlli:**

- impression;
- posizione media;
- stato indicizzazione delle tre pagine prioritarie;
- lead organici qualificati (Umami §3: `lead_form_submit`, demo/preventivo).

**Target interpretativo:** CTR non-brand intorno o sopra **~1%** sulle pagine prioritarie **senza** perdita materiale di impression o posizione.

### Interpretazione per query/cluster

- **`web development` (~pos. 8):** interpretare soprattutto come **test CTR/intent**. Con posizione stabile vicino alla pagina 1, un aumento di CTR/clic non-brand è segnale positivo primario; piccole oscillazioni di posizione sono secondarie.
- **Cluster e-commerce B2B (~pos. 31, es. `ecommerce b2b piemonte`):** interpretare soprattutto come **test rilevanza/ranking**. Fino a avvicinamento alla pagina 1, monitorare impression e posizione prima del CTR; miglioramenti di ranking precedono spesso miglioramenti sostenuti di CTR.
- **Brand (`bitora`):** controllo separato; non confondere con le metriche non-brand delle pagine prioritarie.

Non interpretare variazioni di pochi clic come trend. Non dichiarare esito positivo/negativo finché la finestra post-deploy da 28 giorni non è completa e confrontata con il baseline grezzo.
