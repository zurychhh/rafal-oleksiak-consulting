# Tech Stack - Architecture Decisions

**Last Updated**: 2025-11-11  
**Stack Version**: Next.js 16 + React 19 + TypeScript 5.9

---

## 🏗️ Core Framework

### Next.js 16 (App Router + Turbopack)
**Why chosen:**
- ✅ Server-side rendering (SSR) for SEO
- ✅ Static generation for performance
- ✅ Built-in image optimization
- ✅ App Router (modern, file-based routing)
- ✅ Turbopack (faster builds than Webpack)
- ✅ Zero-config TypeScript support

**Key features used:**
- App Router (`app/` directory)
- Server Components (default, no "use client")
- Client Components (with "use client" directive)
- API Routes (`app/api/`)
- Metadata API (SEO optimization)
- Image component (automatic optimization)

**Configuration:**
```typescript
// next.config.ts
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // Security
  compress: true, // Gzip compression
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
  }
};
```

---

## ⚛️ React 19

**Why React 19:**
- ✅ Latest stable version
- ✅ Improved performance (concurrent rendering)
- ✅ Better TypeScript support
- ✅ React Server Components ready
- ✅ Automatic batching improvements

**Patterns used:**
```typescript
// Server Components (default)
export default function Services() {
  // Runs on server, no JS sent to client
}

// Client Components (interactive)
"use client";
export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  // Interactive, requires JS
}
```

---

## 📘 TypeScript 5.9

**Configuration:**
```json
{
  "compilerOptions": {
    "strict": true,           // Strict type-checking
    "noEmit": true,          // Next.js handles compilation
    "esModuleInterop": true, // Better imports
    "skipLibCheck": true,    // Faster builds
    "jsx": "react-jsx",      // React 19 JSX
    "paths": {
      "@/*": ["./*"]         // Absolute imports
    }
  }
}
```

**Why TypeScript:**
- ✅ Catch errors at compile-time
- ✅ Better IDE autocomplete
- ✅ Self-documenting code
- ✅ Easier refactoring
- ✅ Industry standard for serious projects

**Usage rules:**
- No `any` types (use `unknown` if needed)
- Interfaces for props (not `type`)
- Explicit function return types
- Strict mode enabled

---

## 🎨 Styling: Hybrid Approach

### Tailwind CSS 4 + CSS Modules

**Why hybrid approach:**
- ✅ Tailwind = utilities (spacing, colors, responsive)
- ✅ CSS Modules = complex components (scoped, maintainable)
- ✅ Critical CSS = above-the-fold (fast FCP)
- ✅ Best of both worlds

**When to use each:**
```typescript
// CSS Modules (complex components)
import styles from "./Services.module.css";
<section className={styles.servicesSection}>
  <div className={styles.servicesContainer}>
    {/* Multiple nested elements, animations */}
  </div>
</section>

// Tailwind (utilities)
<div className="flex gap-4 mt-8 md:gap-8 lg:mt-12">
  <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700">
    {/* Simple utility classes */}
  </button>
</div>

// Critical CSS (above-fold only)
// app/critical.css - Inlined in <head>
```

**Tailwind config:**
```typescript
// tailwind.config.ts
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'moonlit-grey': {
          900: '#0D0D14',
          800: '#1A1A2E',
          700: '#16213E',
        },
        'vivid-purple': {
          600: '#7B2CBF',
          500: '#9D4EDD',
        },
        'electric-blue': {
          600: '#0066FF',
          500: '#00BFFF',
        },
      },
    },
  },
};
```

---

## 📧 Email Infrastructure

### Resend (Transactional Email)
**Why chosen:**
- ✅ Modern API (REST + SDK)
- ✅ Email template support
- ✅ Generous free tier (3,000 emails/month)
- ✅ Great developer experience
- ✅ Built-in analytics

**Usage:**
```typescript
// app/api/send-email/route.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'contact@oleksiakconsulting.com',
  to: 'hello@oleksiakconsulting.com',
  subject: 'New Contact Form Submission',
  html: emailTemplate,
});
```

**API endpoint:**
- `POST /api/send-email`
- Validation: email, name, message
- Rate limiting: TODO (Month 2)

---

## 🔧 Developer Tools

### ESLint
**Config:**
```json
{
  "extends": [
    "next/core-web-vitals",
    "next/typescript"
  ]
}
```

**Why:**
- ✅ Catch common mistakes
- ✅ Enforce code style
- ✅ TypeScript-aware
- ✅ Next.js best practices

### Bundle Analyzer
**Usage:**
```bash
npm run build -- --analyze
```

**Why:**
- ✅ Identify large dependencies
- ✅ Optimize bundle size
- ✅ Debug code splitting

---

## 📦 Dependencies

### Production Dependencies
```json
{
  "next": "^16.0.1",         // Framework
  "react": "^19.2.0",        // UI library
  "react-dom": "^19.2.0",    // DOM rendering
  "resend": "^6.4.1"         // Email service
}
```

### Dev Dependencies
```json
{
  "@next/bundle-analyzer": "^16.0.1",  // Bundle analysis
  "@tailwindcss/postcss": "^4.1.16",   // Tailwind PostCSS
  "@types/node": "^24.9.2",            // Node types
  "@types/react": "^19.2.2",           // React types
  "@types/react-dom": "^19.2.2",       // React DOM types
  "autoprefixer": "^10.4.21",          // CSS prefixing
  "eslint": "^9.38.0",                 // Linting
  "eslint-config-next": "^16.0.1",     // Next.js ESLint
  "postcss": "^8.5.6",                 // CSS processing
  "tailwindcss": "^4.1.16",            // Utility CSS
  "typescript": "^5.9.3"               // Type checking
}
```

**Dependency management:**
- Keep dependencies updated (security patches)
- Use exact versions in production
- Test updates in dev before deploying
- No unnecessary dependencies (bundle bloat)

---

## 🚀 Deployment

### Vercel (Platform)
**Why chosen:**
- ✅ Made by Next.js creators
- ✅ Zero-config deployment
- ✅ Automatic preview deployments
- ✅ Edge functions
- ✅ Built-in analytics
- ✅ 99.9% uptime SLA

**Deployment workflow:**
1. Push to `main` → Automatic production deploy
2. Create PR → Automatic preview deploy
3. Vercel checks: Build, TypeScript, ESLint
4. Deploy completes → URL available

**Environment variables:**
```bash
# Set in Vercel dashboard
RESEND_API_KEY=re_xxxxxxxxxxxxx
# More to be added (GA4, Hotjar)
```

**Performance:**
- CDN: Global edge network
- SSR: Automatic caching
- Images: Automatic optimization
- Fonts: Automatic subsetting

---

## 🔗 Third-Party Integrations

### Font Awesome (Icons)
**Implementation:**
```html
<!-- CDN with SRI hash (security) -->
<link 
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
  rel="stylesheet"
  integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
  crossorigin="anonymous"
/>
```

**Why:**
- ✅ 2,000+ icons
- ✅ CDN delivery (fast)
- ✅ SRI hash (secure)
- ✅ Industry standard

### Google Fonts (Typography)
**Fonts:**
- Poppins (headings)
- DM Sans (body text)

**Optimization:**
```html
<!-- Preload critical fonts -->
<link rel="preload" as="font" href="/fonts/Poppins-Bold.woff2" crossorigin />
<link rel="preload" as="font" href="/fonts/DMSans-Regular.woff2" crossorigin />
```

**Why local hosting:**
- ✅ 70% smaller file size (subsetting)
- ✅ No external requests
- ✅ GDPR compliance (no Google cookies)
- ✅ Faster load time

### Calendly (Booking)
**Integration:**
```html
<a 
  href="https://calendly.com/rafaloleksiakconsulting/30min"
  target="_blank"
  rel="noopener noreferrer"
>
  Book Consultation
</a>
```

**Why:**
- ✅ No development needed
- ✅ Calendar sync (Google/Outlook)
- ✅ Automated reminders
- ✅ Time zone handling
- ✅ Free tier sufficient

---

## 🎯 Performance Optimizations

### Critical CSS
**Location:** `app/critical.css`
**Contents:** Only above-the-fold styles (Navbar, Hero)
**Delivery:** Inlined in `<head>` (no blocking request)

### Dynamic Imports
```typescript
// Lazy load heavy components
const HeavySection = dynamic(() => import('./HeavySection'), {
  loading: () => <LoadingSpinner />,
  ssr: false, // Client-only if needed
});
```

### Image Optimization
```typescript
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={50}
  priority // Above-fold images
  quality={90} // Default: 75
/>
```

### Font Display
```css
@font-face {
  font-family: 'Poppins';
  src: url('/fonts/Poppins-Bold.woff2') format('woff2');
  font-display: swap; /* Avoid FOIT */
  font-weight: 700;
}
```

### Code Splitting
- Automatic route-based splitting (Next.js)
- Manual component splitting (dynamic imports)
- Shared chunks optimization

---

## 📊 Monitoring (To Be Added)

### Planned Integrations

**Google Analytics 4:**
- Pageviews, events, conversions
- User demographics
- Traffic sources

**Hotjar:**
- Heatmaps (click, scroll)
- Session recordings
- Surveys (exit intent)

**Vercel Analytics:**
- Web Vitals (LCP, FID, CLS)
- Performance monitoring
- Error tracking

**Sentry (Month 3+):**
- Error reporting
- Performance tracing
- User feedback

---

## 🔒 Security

### Current Measures
- ✅ HTTPS only (Vercel)
- ✅ SRI hashes (Font Awesome)
- ✅ CORS headers
- ✅ Content Security Policy (basic)
- ✅ Environment variables (not in Git)
- ✅ `X-Frame-Options: DENY`
- ✅ `X-Content-Type-Options: nosniff`

### To Be Added
- [ ] Rate limiting (API routes)
- [ ] CAPTCHA (contact form)
- [ ] Email validation hardening
- [ ] WAF rules (Vercel)

---

## 🧪 Testing (To Be Added)

### Planned Setup

**Jest + React Testing Library:**
- Unit tests (components)
- Integration tests (user flows)
- Coverage: 80%+ target

**Playwright:**
- E2E tests (critical paths)
- Cross-browser (Chrome, Safari, Firefox)
- Mobile testing

**Lighthouse CI:**
- Automated performance audits
- Block PRs if score drops below 90
- Track performance over time

---

## 📚 Documentation

### Key Files
- `CLAUDE.md` - Coding standards, workflow
- `ROADMAP.md` - Feature roadmap, priorities
- `PROJECT_SUMMARY.md` - Complete implementation history
- `.claude/context/` - Business context, design system

### Code Comments
```typescript
// Complex logic: Explain WHY, not WHAT
// Good: "Prevent scroll on mobile menu open (iOS Safari bug fix)"
// Bad: "Set overflow to hidden"
```

---

## 🔄 Update Strategy

### Dependencies
```bash
# Check outdated packages
npm outdated

# Update (test first!)
npm update

# Security audit
npm audit
npm audit fix
```

**Update schedule:**
- Security patches: Immediate
- Minor versions: Monthly
- Major versions: Quarterly (test thoroughly)

---

## 🚫 What We DON'T Use (and Why)

**Redux / Zustand:**
- ❌ No global state needed (page is mostly static)
- ✅ React state sufficient for forms, mobile nav

**GraphQL:**
- ❌ No complex data fetching
- ✅ REST API sufficient (Resend)

**UI Component Libraries (MUI, Chakra):**
- ❌ Too heavy, generic styling
- ✅ Custom components for brand consistency

**jQuery:**
- ❌ Outdated, conflicts with React
- ✅ React handles DOM manipulation

**CSS-in-JS (Styled Components, Emotion):**
- ❌ Runtime overhead
- ✅ CSS Modules + Tailwind = faster

---

**Questions?** See CLAUDE.md for usage guidelines
