# 🌟 Bitora.it - Web Design & Digital Solutions

Bitora.it is a modern, high-performance static website built with Astro, offering professional web design services, digital solutions, and innovative NFC business cards.

## 🚀 Features

- **Modern Web Design Services** - Comprehensive web development solutions
- **Competitive Pricing Plans** - Transparent pricing for different business needs
- **NFC Business Cards** - Innovative digital business card solutions
- **Client Testimonials** - Showcase of successful projects and satisfied clients
- **Responsive Design** - Optimized for all devices and screen sizes
- **SEO Optimized** - Built with performance and search engine optimization in mind
- **Accessibility First** - WCAG compliant design and navigation

## 🛠️ Tech Stack

- **[Astro](https://astro.build)** - Static Site Generator
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework
- **[TypeScript](https://www.typescriptlang.org)** - Type-safe JavaScript
- **[LightningCSS](https://lightningcss.dev)** - CSS optimization and bundling
- **SEO & Performance** - Sitemap generation, robots.txt, optimized images

## 📁 Project Structure

```text
/
├── public/                    # Static assets
│   ├── favicon.ico
│   ├── sitemap.xml           # Auto-generated sitemap
│   └── robots.txt            # Auto-generated robots.txt
├── src/
│   ├── assets/               # Images and media files
│   ├── components/           # Reusable Astro components
│   │   ├── Footer.astro
│   │   ├── Header.astro      # Mobile-responsive navigation
│   │   ├── Testimonials.astro
│   │   └── ...
│   ├── content/              # Content collections
│   ├── data/                 # Static data files
│   ├── layouts/              # Page layouts
│   │   └── Layout.astro      # Main layout template
│   ├── pages/                # File-based routing
│   │   ├── index.astro       # Homepage
│   │   ├── chi-siamo.astro   # About page
│   │   ├── contattaci.astro  # Contact page with form
│   │   ├── prezzi.astro      # Pricing page
│   │   ├── services.astro    # Services page
│   │   ├── shop.astro        # NFC products
│   │   └── ...
│   └── styles/               # Global CSS styles
├── .eslintrc.js              # ESLint configuration
├── .prettierrc.json          # Prettier configuration
├── astro.config.mjs          # Astro configuration
├── tailwind.config.mjs       # Tailwind CSS configuration
└── package.json
```

## 🧞 Commands

All commands are run from the root of the project:

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm install`     | Install dependencies                         |
| `npm run dev`     | Start development server at `localhost:4321` |
| `npm run build`   | Build production site to `./dist/`           |
| `npm run preview` | Preview build locally before deploying       |
| `npm run check`   | Run Astro diagnostics and type checking      |
| `npm run lint`    | Run ESLint and Prettier checks               |
| `npm run format`  | Format code with Prettier                    |
| `npm run analyze` | Analyze bundle size and performance          |

## 🎨 Development

### Code Quality Tools

- **ESLint** - Configured with Astro-specific rules and TypeScript support
- **Prettier** - Automatic code formatting with Astro plugin
- **TypeScript** - Type safety and better development experience

### Mobile-First Approach

The site is built with a mobile-first approach featuring:

- Responsive navigation with animated hamburger menu
- Touch-friendly interfaces and button sizing
- Optimized images with lazy loading
- Performance-focused CSS and JavaScript

### Form Handling

The contact page includes:

- Real-time form validation
- Loading states with visual feedback
- Accessibility features (ARIA labels, focus management)
- Error handling and success messaging

## 🚀 Performance Features

- **Optimized Images** - Lazy loading and proper sizing
- **Critical CSS** - Above-the-fold optimization
- **Bundle Analysis** - Performance monitoring tools
- **SEO Optimization** - Structured data and meta tags
- **Lighthouse Score** - Optimized for Core Web Vitals

## 📱 Pages Overview

- **Homepage (`/`)** - Hero section, services overview, testimonials
- **About (`/chi-siamo`)** - Company information and team
- **Services (`/services`)** - Detailed service offerings
- **Pricing (`/prezzi`)** - Transparent pricing plans
- **Portfolio (`/lavori`)** - Showcase of completed projects
- **Shop (`/shop`)** - NFC business card products
- **Contact (`/contattaci`)** - Contact form and information
- **Landing (`/landing`)** - Dedicated landing page for campaigns

## 🌐 SEO & Analytics

- Automatic sitemap generation
- Robots.txt configuration
- Structured data markup (Schema.org)
- Meta tags optimization
- Social media sharing optimization

## 🚀 Deployment

The site is optimized for static hosting platforms:

- **Netlify** - Recommended for automatic deployments
- **Vercel** - Alternative with excellent performance
- **GitHub Pages** - Free hosting option
- **Traditional hosting** - Can be deployed to any static host

Build the site and deploy the `dist/` folder to your hosting provider.

## 📄 License

© 2024 Bitora.it - All rights reserved.
