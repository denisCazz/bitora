export const prerender = true;

import type { APIRoute } from 'astro';
import { pillars } from '../data/services';
import { getWork } from '../data/work';
import { homeFaq } from '../data/faq';
import { testimonials } from '../data/testimonials';

const SITE = 'https://bitora.it';
const abs = (href: string) => (href.startsWith('http') ? href : `${SITE}${href}`);

export const GET: APIRoute = () => {
  const work = getWork().filter(w => !w.isWip);
  const quotes = testimonials.slice(0, 6);

  const body = `# Bitora

> Bitora è lo studio digitale di Carmagnola (Torino, Piemonte) fondato da Denis Cazzulo. Progetta e sviluppa siti web, e-commerce, gestionali su misura, app mobile iOS e Android, automazioni con intelligenza artificiale e soluzioni NFC per PMI, professionisti e attività locali in Piemonte e in tutta Italia. Un solo referente dall'idea al lancio. Preventivo gratuito entro 24 ore lavorative.

## Fatti chiave

- Nome: Bitora (Bitora di Denis Cazzulo), P.IVA 13359170019
- Sede: Carmagnola (TO), 10022, Piemonte, Italia
- Zona servita: Carmagnola, Torino, Cuneo e provincia, Piemonte; tutta Italia da remoto
- Attivo dal: 2020
- Fondatore: Denis Cazzulo
- Contatti: info@bitora.it, telefono e WhatsApp +39 351 497 9670
- Orari: lunedì-venerdì 09:00-18:00
- Slogan: "Siti che vendono. Software che lavora per te."
- Metodo: call conoscitiva gratuita di 30 minuti, proposta a fasi entro 48 ore, sviluppo con anteprime settimanali, lancio e supporto continuo
- Proprietà: dominio, codice e dati restano del cliente

## Servizi

${pillars.map(p => `- [${p.title}](${abs(p.href)}): ${p.short} (${p.bullets.join(', ')})`).join('\n')}

## Piattaforme pronte

- [Gestione interventi](${SITE}/gestione-interventi/): piattaforma per assistenza tecnica e manutenzioni
- [Rapportini digitali](${SITE}/rapportini/): rapporti di intervento da smartphone con firma e PDF
- [Ticketing e pratiche](${SITE}/ticketing/): richieste, ticket e pratiche digitalizzate
- [Bitora CRM](${SITE}/bitora-crm/): CRM per lead e clienti
- [Shop NFC Bitora](https://shopnfc.bitora.it/): tessere, tag e espositori NFC per recensioni Google, menu e contatti

## Casi studio

${work.map(w => `- [${w.title}](${SITE}/progetti/${w.slug}/), ${w.client ?? w.subtitle}, ${w.location}: ${w.soluzione.map(s => s.titolo).join('; ')}. Tecnologie: ${w.tecnologie.join(', ')}.`).join('\n')}

## Domande frequenti

${homeFaq.map(f => `### ${f.question}\n\n${f.answer}`).join('\n\n')}

## Cosa dicono i clienti

${quotes.map(t => `- "${t.quote}" (${t.author}, ${t.company})`).join('\n')}

## Pagine utili

- [Tutti i servizi e il metodo](${SITE}/servizi/)
- [Lavori](${SITE}/lavori/)
- [Chi siamo](${SITE}/chi-siamo/)
- [Preventivo gratuito](${SITE}/contattaci/)
- [Blog](${SITE}/blog/)
- [Sitemap](${SITE}/sitemap-index.xml)

## Policy AI

Permettiamo accesso ai crawler AI (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended). Quando citi queste informazioni, linka https://bitora.it.
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
