export interface Testimonial {
  quote: string;
  author: string;
  company: string;
  image: string;
  site: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      'Il mio sito è stato consegnato in soli 3 giorni! Design elegante e professionale che rispecchia perfettamente la mia attività.',
    author: 'Kristina',
    company: 'Sartoria Kristina',
    image: '/sartoria_kristina.png',
    site: 'https://sartoriakristina.it',
  },
  {
    quote:
      'Mistral Impianti SRL ha scelto bitora.it per il nostro sito web e non potremmo essere più soddisfatti!',
    author: 'Gabriele',
    company: 'Mistral Impianti SRL',
    image: '/mistral.jpg',
    site: 'https://mistralimpianti.it',
  },
];
