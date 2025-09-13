# Bitora.it Copilot Instructions

## Project Overview
Bitora.it is a high-performance Astro static site for a web design and NFC solutions business serving the Piemonte region (Italy). The site emphasizes local SEO, performance optimization, and conversion-focused design for restaurants, hotels, and professionals in Carmagnola, Torino, and surrounding areas.

## Architecture & Tech Stack
- **Framework**: Astro 5.x with static site generation
- **Styling**: Tailwind CSS with custom design system
- **Performance**: LightningCSS, Terser, compression (gzip/brotli)
- **SEO**: Sitemap generation, robots.txt, structured data (Schema.org)
- **Analytics**: Cookie-consent based analytics with GDPR compliance
- **Testing**: Playwright for E2E testing
- **TypeScript**: Full type safety with Astro's built-in support

## Key Patterns

### Component Structure
- **Layout.astro**: Main layout with performance optimizations, analytics, and cookie consent
- **Header.astro**: Sticky navigation with dropdown menus and mobile hamburger
- **PerformanceOptimizer.astro**: Critical resource preloading and above-the-fold CSS
- **Analytics.astro**: Conditional analytics loading based on cookie consent

### Content Management
- Static data in `/src/data/`: pricing plans, testimonials, FAQ
- TypeScript interfaces for type-safe content (see `PricingPlan` interface)
- Italian content with local Piemonte geographic targeting

### Performance Optimizations
- Critical CSS inlined in components
- Resource hints (dns-prefetch, preconnect) for external resources
- Image lazy loading and proper sizing
- Bundle splitting with hash-based filenames
- Prefetch strategy: `viewport` for all pages

### Development Workflows

#### Essential Commands
```bash
npm run dev          # Start dev server (localhost:4321)
npm run build        # Production build
npm run build:production  # Build + post-build optimizations
npm run check        # Astro diagnostics + TypeScript
npm run lint         # ESLint + Prettier checks
npm run test         # Playwright E2E tests
npm run analyze      # Bundle size analysis
```

#### Development Guidelines
- All text content in Italian with geographic keywords (Carmagnola, Piemonte, Torino)
- Mobile-first responsive design approach
- Maintain 100% Lighthouse performance scores
- Use semantic HTML and proper ARIA labels
- Follow the established color system: `primary` (orange), `secondary` (indigo), `accent` (pink)

### Local SEO Focus
- Geographic targeting: Carmagnola, Provincia di Torino, Piemonte
- LocalBusiness schema markup in Layout.astro
- Location-specific meta tags and content
- Sitemap includes geographic coordinates

### Cookie Consent & Privacy
- GDPR-compliant cookie banner (`CookieBanner.astro`)
- Analytics load conditionally based on user consent
- Security headers configured in astro.config.mjs
- Cookie consent stored as `bitora_cookie_consent`

### File Organization
- **Pages**: File-based routing in `/src/pages/`
- **Components**: Reusable Astro components in `/src/components/`
- **Data**: Static content in `/src/data/` with TypeScript interfaces
- **Layouts**: Main layout template in `/src/layouts/`
- **Assets**: Static files in `/public/` (images, sitemap, robots.txt)

### Testing Strategy
- Playwright for E2E testing across major browsers
- Base URL: `http://localhost:4321`
- Tests in `/tests/` directory
- CI configuration for retries and parallel execution

## Common Tasks

### Adding New Pages
1. Create `.astro` file in `/src/pages/`
2. Use Layout.astro with Italian title/description
3. Include relevant structured data for local SEO
4. Add navigation link to Header.astro if needed

### Performance Changes
- Always test with `npm run analyze` after changes
- Check Core Web Vitals impact
- Ensure critical CSS remains inline
- Verify resource hints are still relevant

### Content Updates
- Update data files in `/src/data/` for pricing, testimonials, FAQ
- Maintain Italian language and local keywords
- Keep geographic references (Piemonte region focus)
- Update structured data if business information changes

When making changes, prioritize performance, local SEO compliance, and mobile-first responsive design.