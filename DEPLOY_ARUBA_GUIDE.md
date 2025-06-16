# 🚀 Deploy Bitora su Aruba Hosting - Guida Completa

## 📋 Pre-Deploy Checklist

### ✅ 1. Configurazione Analytics
Prima del deploy, sostituisci i placeholder con i tuoi veri ID:

**File: `src/components/Analytics.astro`**
```javascript
// Sostituisci questi ID con i tuoi
const GA_ID = 'G-XXXXXXXXXX'; // Il tuo Google Analytics 4 ID
const GTAG_ID = 'GT-XXXXXXXXX'; // Il tuo Google Tag Manager ID (opzionale)
```

**File: `src/components/Analytics.astro`**
```html
<!-- Sostituisci con il tuo codice Search Console -->
<meta name="google-site-verification" content="IL_TUO_CODICE_SEARCH_CONSOLE" />
```

### ✅ 2. Build per Aruba
```bash
npm run build:aruba
```
Questo comando:
- Fa il build ottimizzato di Astro
- Copia il file `.htaccess` specifico per Aruba nella cartella `dist/`

## 🔧 Upload su Aruba

### Metodo 1: FileZilla/FTP
1. **Connetti al tuo spazio Aruba** via FTP
2. **Naviga alla cartella** del tuo dominio (es. `/public_html/`)
3. **Upload tutto il contenuto** della cartella `dist/` 
4. **Verifica che il file `.htaccess`** sia stato caricato correttamente

### Metodo 2: File Manager Aruba
1. **Accedi al pannello Aruba**
2. **Apri File Manager**
3. **Vai nella directory del sito** (es. `public_html`)
4. **Upload/sostituisci tutti i file** dalla cartella `dist/`
5. **Verifica permessi file** (644 per file, 755 per cartelle)

## ⚙️ Configurazione Aruba Specifica

### SSL/HTTPS
Su Aruba, assicurati che:
1. **SSL è attivato** nel pannello di controllo
2. **Redirect HTTP→HTTPS** è configurato (già nel .htaccess)
3. **Certificato Let's Encrypt** è rinnovato automaticamente

### PHP Version (se necessario)
- Imposta PHP 8.1+ per compatibilità massima
- Non necessario per questo sito statico, ma utile per form

### Database (opzionale)
Se in futuro vuoi aggiungere funzioni dinamiche:
- MySQL disponibile su piani Aruba superiori
- Configurazione database nel pannello

## 🔍 Verifica Post-Deploy

### 1. Test Funzionalità Base
- [ ] Sito carica correttamente su `https://tuodominio.it`
- [ ] Tutte le pagine sono accessibili
- [ ] Menu di navigazione funziona
- [ ] Form contatti funziona

### 2. Test Performance
- [ ] **PageSpeed Insights**: https://pagespeed.web.dev/
- [ ] **GTmetrix**: https://gtmetrix.com/
- [ ] **Test su mobile** con diversi dispositivi

### 3. Test Analytics
- [ ] **Google Analytics** riceve traffico
- [ ] **Search Console** indicizza le pagine
- [ ] **Events tracking** funziona (click CTA, scroll, ecc.)

### 4. Test Sicurezza
- [ ] **Headers sicurezza** presenti (usa https://securityheaders.com/)
- [ ] **SSL Labs** test: https://www.ssllabs.com/ssltest/
- [ ] **404 page** funziona correttamente

## 📊 Monitoring & Manutenzione

### Setup Google Analytics 4
1. Vai su https://analytics.google.com/
2. **Crea proprietà** per bitora.it
3. **Copia l'ID** (formato G-XXXXXXXXXX)
4. **Sostituisci nel codice** e rideploya

### Setup Google Search Console
1. Vai su https://search.google.com/search-console/
2. **Aggiungi proprietà** per https://bitora.it
3. **Verifica dominio** con meta tag o DNS
4. **Carica sitemap**: https://bitora.it/sitemap-index.xml

### Monitoring Performance
Il sito ora include monitoraggio automatico di:
- **Core Web Vitals** (LCP, FID, CLS)
- **Errori JavaScript**
- **Performance custom metrics**
- **User behavior** (scroll, click, engagement)

## 🛠️ Troubleshooting Aruba

### Problema: .htaccess non funziona
**Soluzione**: Verifica che mod_rewrite sia attivo
```
# Contatta supporto Aruba per abilitare mod_rewrite se necessario
```

### Problema: Headers sicurezza mancanti
**Soluzione**: Alcuni header potrebbero essere limitati su hosting condiviso
- Headers principali dovrebbero funzionare
- CSP potrebbe essere limitato - verifica con supporto

### Problema: Compressione Gzip
**Soluzione**: Se Gzip non funziona automaticamente
```apache
# Aggiungi al .htaccess
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>
```

### Problema: Cache non funziona
**Soluzione**: Verifica mod_expires e mod_headers
- Su hosting condiviso potrebbero essere limitati
- Testare con browser dev tools

## 📈 Ottimizzazioni Aruba-Specific

### 1. CDN (opzionale)
Aruba offre CDN CloudFlare:
- Attivabile dal pannello di controllo
- Migliora velocità globale
- Cache automatica degli assets

### 2. Backup Automatico
- Configura backup automatici settimanali
- Aruba offre backup inclusi nei piani

### 3. Monitoring Uptime
- Imposta notifiche downtime dal pannello Aruba
- Considera servizi esterni come UptimeRobot

## 📞 Supporto

### Aruba Support
- **Telefono**: 0575 862 000
- **Email**: supporto@aruba.it
- **Ticket**: Dal pannello di controllo

### Documentazione Utile
- [Guida Aruba Hosting](https://guide.aruba.it/)
- [Configurazione DNS](https://help.aruba.it/hosting/)
- [SSL e HTTPS](https://help.aruba.it/hosting/ssl/)

---

## 🎯 Checklist Deploy Finale

Prima di lanciare in produzione:

- [ ] **Analytics ID configurati**
- [ ] **Search Console verificato**
- [ ] **SSL attivo e funzionante**
- [ ] **Performance test > 90 su mobile**
- [ ] **404 page personalizzata attiva**
- [ ] **Sitemap XML funzionante**
- [ ] **robots.txt configurato**
- [ ] **Backup configurato**

## 🚀 Go Live!

Una volta completata la checklist, il sito Bitora sarà live su Aruba con:

✅ **Performance ottimizzate** per Core Web Vitals  
✅ **Sicurezza enterprise-grade**  
✅ **Analytics e tracking avanzati**  
✅ **SEO ottimizzato**  
✅ **Mobile-first responsive**  

**Congratulazioni! 🎉 Il sito è pronto per conquistare il mercato digitale!**
