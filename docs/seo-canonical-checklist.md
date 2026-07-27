# Checklist SEO esterna — Bitora

Operazioni **non** gestite dal repository. Completarle dopo il deploy del codice apex.

## 1. Proxy / Coolify (obbligatorio)

Configurare sul reverse proxy (Caddy, Traefik o Nginx), **non** in Astro:

1. `http://*` → `https://*` con **301**
2. `https://www.bitora.it/:path*` → `https://bitora.it/:path*` con **301**
3. Preservare path e query string
4. Un solo salto (niente catene www→apex→slash)

Verifica rapida:

```bash
curl -I https://www.bitora.it/rapportini/
# Atteso: 301 Location: https://bitora.it/rapportini/

curl -I http://bitora.it/
# Atteso: 301 Location: https://bitora.it/
```

## 2. Search Console

1. Inviare **solo** `https://bitora.it/sitemap-index.xml`
2. Controllare che l’indice punti a `https://bitora.it/sitemap-0.xml` (o figlio apex)
3. Dopo lettura riuscita, rimuovere:
   - `https://www.bitora.it/sitemap.xml`
   - `https://www.bitora.it/sitemap-0.xml`
   - eventuali altre sitemap www
4. Ispezionare e richiedere indicizzazione di:
   - `https://bitora.it/`
   - `https://bitora.it/gestione-interventi/`
   - `https://bitora.it/rapportini/`
   - `https://bitora.it/ticketing/`
   - `https://bitora.it/richiedi-demo/`
5. Aprire il rapporto “Pagine non indicizzate”, annotare le sette motivazioni e classificarle in: corretta / redirect-legacy / errore

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

## 4. Monitoraggio post-deploy

Annotare la data del deploy. Dopo 4–6 settimane confrontare:

- pagine prioritarie indicizzate
- clic su “Richiedi demo” / preventivo
- form iniziati e completati
- lead qualificati

Non interpretare variazioni di pochi clic come trend.
