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
  },
  {
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
  }
];

// Testimonianze per categoria
export const webTestimonials = testimonials.filter(t => t.category === 'web');
export const nfcTestimonials = testimonials.filter(t => t.category === 'nfc');
export const comboTestimonials = testimonials.filter(t => t.category === 'combo');
