export interface Testimonial {
  quote: string;
  author: string;
  company: string;
  image: string;
  site: string;
  role?: string;
  results?: string;
  rating?: number;
  videoUrl?: string;
  category?: 'web' | 'nfc' | 'combo';
}

export const testimonials: Testimonial[] = [
  {
    quote:
      'La realizzazione del sito web è stata eseguita in modo puntuale, professionale e con elevata attenzione ai dettagli. Il risultato finale rispecchia pienamente le aspettative. Servizio altamente consigliato.',
    author: 'Lello Bottero',
    company: 'Mistral Impianti',
    role: 'CEO',
    image: '/mistral.jpg',
    site: 'https://mistralimpianti.it',
    results: 'Sito web professionale',
    rating: 5,
    category: 'web'
  },
  {
    quote:
      'Ottima persona, competente ed affidabile. Consiglio vivamente per qualsiasi progetto grafico.',
    author: 'Barbara Toffano',
    company: 'Barbara Toffano',
    role: 'Cliente Grafica',
    image: '/btoffano.jpg',
    site: '#',
    results: 'Progetto grafico completato',
    rating: 5,
    category: 'web'
  },
  {
    quote:
      'I miei clienti adorano poter vedere le mie creazioni online prima di venire in atelier. Il sito rispecchia perfettamente l\'eleganza del mio lavoro e mi ha aiutato a farmi conoscere anche fuori Carmagnola.',
    author: 'Kristina',
    company: 'Sartoria Kristina',
    role: 'Titolare',
    image: '/sartoria_kristina.png',
    site: 'https://sartoriakristina.it',
    results: '+35% prenotazioni in 3 mesi',
    rating: 5,
    category: 'web'
  },
  {
    quote:
      'Il sistema di ordini via WhatsApp integrato nel sito ci ha cambiato la vita. Niente più errori telefonici e clienti molto più felici. Una soluzione pratica che funziona davvero.',
    author: 'Adele',
    company: 'Speedy Pizza',
    role: 'Responsabile',
    image: 'https://www.speedy-pizza.it/logo.jpeg',
    site: 'https://speedy-pizza.it',
    results: 'Ordini WhatsApp automatizzati',
    rating: 5,
    category: 'web'
  },
  {
    quote:
      'Cercavamo una presenza digitale sobria ma moderna. Bitora ha capito subito le nostre esigenze, creando un sito che trasmette autorevolezza e competenza. Ottimo anche il supporto post-lancio.',
    author: 'Avv. Marco G.',
    company: 'Studio Legale Associato',
    role: 'Partner',
    image: '/client.jpg',
    site: '#',
    results: 'Presenza digitale professionale',
    rating: 5,
    category: 'web'
  },
  {
    quote:
      'Il nuovo percorso digitale di Bar Chantilly racconta la nostra storia e permette ai clienti di lasciare recensioni con un tap grazie alle tessere NFC. Abbiamo raddoppiato le richieste per eventi privati e la visibilità locale cresce ogni settimana.',
    author: 'Federica',
    company: 'Bar Chantilly Carmagnola',
    role: 'Responsabile marketing',
    image: '/client.jpg',
    site: 'https://www.barchantilly.it',
    results: '2× richieste eventi in 3 mesi',
    rating: 5,
    category: 'nfc'
  },
  {
    quote:
      'Sito consegnato in tempi record! Design minimale e perfettamente mirato alla mia clientela. Interfaccia intuitiva che rende l\'ordinazione semplice per tutti i clienti, dalle nonne ai giovani. Ordini online aumentati del 60%!',
    author: 'Adele',
    company: 'Speedy Pizza',
    role: 'Proprietario',
    image: 'https://www.speedy-pizza.it/logo.jpeg',
    site: 'https://speedy-pizza.it',
    results: '+60% ordini online',
    rating: 5,
    category: 'web'
  },
  {
    quote:
      'Il portfolio sviluppato da bitora.it ha trasformato completamente la mia presenza online. Design elegante, performance eccellenti e perfetta ottimizzazione SEO. Ora i clienti mi trovano facilmente e il mio lavoro parla da solo.',
    author: 'Denis Cazzulo',
    company: 'Portfolio Professionale',
    role: 'Creative Developer',
    image: '/code.jpg',
    site: 'https://aboutdenis.eu',
    results: '+80% visibilità online',
    rating: 5,
    category: 'web'
  }
];

// Testimonianze per categoria
export const webTestimonials = testimonials.filter(t => t.category === 'web');
export const nfcTestimonials = testimonials.filter(t => t.category === 'nfc');
export const comboTestimonials = testimonials.filter(t => t.category === 'combo');
