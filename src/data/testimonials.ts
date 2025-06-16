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
      'Il mio sito è stato consegnato in soli 3 giorni! Design elegante e professionale che rispecchia perfettamente la mia attività. Clienti mi fanno sempre complimenti e ho visto un aumento delle prenotazioni del 35%.',
    author: 'Kristina',
    company: 'Sartoria Kristina',
    role: 'Founder & Designer',
    image: '/sartoria_kristina.png',
    site: 'https://sartoriakristina.it',
    results: '+35% prenotazioni in 3 mesi',
    rating: 5,
    category: 'web'
  },  {
    quote:
      'Mistral Impianti SRL ha scelto bitora.it per il nostro sito web e non potremmo essere più soddisfatti! Professionalità, velocità e risultati concreti. Il nostro sito ora genera lead qualificati ogni settimana.',
    author: 'Gabriele',
    company: 'Mistral Impianti SRL',
    role: 'CEO',
    image: '/mistral.jpg',
    site: 'https://mistralimpianti.it',
    results: '12 lead qualificati/mese',
    rating: 5,
    category: 'web'
  },
  {
    quote:
      'Sito consegnato in tempi record! Design minimale e perfettamente mirato alla mia clientela. Interfaccia intuitiva che rende l\'ordinazione semplice per tutti i clienti, dalle nonne ai giovani. Ordini online aumentati del 60%!',
    author: 'Adele',
    company: 'Speedy Pizza',
    role: 'Proprietario',
    image: 'https://www.speedy-pizza.it/logo.jpeg',
    site: 'https://speedypizza.it',
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
