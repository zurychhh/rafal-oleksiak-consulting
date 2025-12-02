# CLAUDE.md - Rafał Oleksiak Consulting Website

**Project Context**: B2B consulting website for CRM & Marketing Automation services
**Stack**: Next.js 16 + React 19 + TypeScript 5.9 + Tailwind 4 + CSS Modules
**Status**: Production-ready (deployed on Vercel)
**Last Updated**: 2025-12-02

---

## 🎯 Project Overview

### Business Context
- **Target Audience**: 
  - Large corporations (steady consulting partnerships)
  - Young entrepreneurs (digital marketing guidance)
- **Core Methodology**: "Zawsze syntezuj" (Always Synthesize)
  - Create new frameworks and actionable solutions
  - NOT just audits or analyses
  - Focus on "So What?" and "What next?"
- **Key Differentiator**: ROI-driven approach with proven results (Allegro, Booksy, Accenture)

### Design System: Tech-Forward Innovator
- **Colors**:
  - Moonlit Grey: `#1A1A2E` (backgrounds)
  - Vivid Purple: `#7B2CBF`, `#9D4EDD` (accents, CTAs)
  - Electric Blue: `#0066FF`, `#00BFFF` (highlights)
- **Typography**:
  - Primary: Poppins (headings, bold statements)
  - Secondary: DM Sans (body text, descriptions)
- **Aesthetic**: Sophisticated dark theme, minimalist, no "90s-style" flashy effects

---

## 📁 Project Structure

```
rafal-oleksiak-consulting/
├── app/
│   ├── components/
│   │   ├── sections/           # Page sections (12 components)
│   │   │   ├── Navbar.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── Bio.tsx
│   │   │   ├── CaseStudiesSection.tsx
│   │   │   ├── ProcessTimeline.tsx
│   │   │   ├── Collaboration.tsx
│   │   │   ├── ExpertiseBreaker.tsx
│   │   │   ├── AchievementsTicker.tsx
│   │   │   ├── LamaAuditSection.tsx
│   │   │   ├── FinalCTA.tsx
│   │   │   └── Footer.tsx
│   │   ├── ui/                 # Reusable UI components (8 components)
│   │   │   ├── Logo.tsx
│   │   │   ├── CompanyCarousel.tsx
│   │   │   ├── GradientBreaker.tsx
│   │   │   └── ...
│   │   ├── LazySection.tsx     # IntersectionObserver wrapper
│   │   └── FontAwesomeLoader.tsx
│   ├── api/
│   │   └── send-email/
│   │       └── route.ts        # Email endpoint (Resend)
│   ├── lib/                    # Utilities
│   ├── types/                  # TypeScript definitions
│   ├── critical.css            # Above-the-fold critical CSS
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout + metadata
│   └── page.tsx                # Main page composition
├── public/                     # Static assets
├── .claude/                    # Claude Code configuration
│   ├── context/                # Project context files
│   └── commands/               # Custom commands
├── CLAUDE.md                   # This file
├── ROADMAP.md                  # Project roadmap
└── PROJECT_SUMMARY.md          # Complete project documentation
```

---

## 🔧 Tech Stack & Dependencies

### Core
- **Next.js**: 16.0.1 (App Router + Turbopack)
- **React**: 19.2.0
- **TypeScript**: 5.9.3 (strict mode)
- **Tailwind CSS**: 4.1.16

### Integrations
- **Resend**: Email delivery (API: `/api/send-email`)
- **Font Awesome**: Icons (CDN with SRI hash)
- **Calendly**: Booking system
- **Google Fonts**: Poppins + DM Sans (preloaded)

### Dev Tools
- **ESLint**: `next/core-web-vitals` + `next/typescript`
- **Bundle Analyzer**: `@next/bundle-analyzer`

---

## 📐 Coding Standards

### Component Architecture

#### 1. Naming Conventions
```typescript
// Components: PascalCase
export default function Navbar() { }
export default function CompanyCarousel() { }

// Files: Match component name
Navbar.tsx
CompanyCarousel.tsx

// CSS Modules: ComponentName.module.css
Navbar.module.css
Services.module.css
```

#### 2. CSS Strategy: **Hybrid Approach**

**⚠️ IMPORTANT**: Project uses Tailwind 4 + CSS Modules intentionally. DO NOT migrate to single system.

**When to use CSS Modules:**
- ✅ Complex components (3+ nested elements)
- ✅ Animation-heavy sections (ProcessTimeline, AchievementsTicker)
- ✅ Components with multiple states
- ✅ Scoped styles that won't be reused

```typescript
// Example: Services.tsx
import styles from "./Services.module.css";

export default function Services() {
  return (
    <section className={styles.servicesSection}>
      <div className={styles.servicesContainer}>
        <h2 className={styles.headline}>Title</h2>
      </div>
    </section>
  );
}
```

**When to use Tailwind:**
- ✅ Simple utilities (spacing, colors)
- ✅ Responsive variants (`md:`, `lg:`)
- ✅ Quick prototyping
- ✅ Global utilities

```typescript
// Example: Simple utility classes
<div className="flex gap-4 mt-8 md:gap-8 lg:mt-12">
  <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700">
    CTA
  </button>
</div>
```

**When to use Critical CSS:**
- ✅ Above-the-fold ONLY (Navbar, Hero)
- ✅ Inlined in `<head>` for fast FCP
- ✅ File: `app/critical.css`

**Design Tokens Source of Truth:**
- All colors, spacing, typography → `tailwind.config.ts`
- CSS Modules use CSS variables from Tailwind
- Never hardcode colors/spacing in CSS Modules

#### 3. TypeScript Standards
```typescript
// Strict mode enabled ✅
"strict": true

// Function components: Default export
export default function ComponentName() { }

// Props: Interface, not Type
interface NavbarProps {
  isOpen: boolean;
  onToggle: () => void;
}

// Event handlers: Explicit types
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => { }

// No any types (use unknown if needed)
❌ const data: any = fetchData();
✅ const data: unknown = fetchData();
```

#### 4. React Patterns
```typescript
// Client components: Explicit directive
"use client";

// Server components: No directive (default in App Router)

// State management: useState for simple, useReducer for complex
const [isOpen, setIsOpen] = useState(false);

// Effects: Minimal use, prefer server components
useEffect(() => {
  // Only for browser APIs, event listeners
}, []);

// Refs: useRef for DOM access (avoid querySelector!)
❌ document.querySelector('.element')
✅ const ref = useRef<HTMLDivElement>(null);
```

#### 5. Performance Patterns
```typescript
// Dynamic imports for heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
  ssr: false // if client-only
});

// Lazy loading with IntersectionObserver
<LazySection>
  <Bio />
</LazySection>

// Image optimization: Always use Next.js Image
import Image from 'next/image';
<Image src="/logo.png" alt="Logo" width={200} height={50} priority />
```

---

## 🎨 Design Guidelines

### Responsive Breakpoints
```css
/* Mobile-first approach */
/* Base: 320px - 768px (mobile) */
.element { /* mobile styles */ }

/* Tablet: 769px - 1024px */
@media (min-width: 769px) { }

/* Desktop: 1025px+ */
@media (min-width: 1025px) { }

/* Large Desktop: 1440px+ */
@media (min-width: 1440px) { }
```

### Accessibility (WCAG 2.1 AA)
- ✅ Touch targets: Minimum 44x44px on mobile
- ✅ Color contrast: Minimum 4.5:1 for text
- ✅ Semantic HTML: `<nav>`, `<section>`, `<article>`, `<button>`
- ✅ ARIA labels where needed
- ✅ Keyboard navigation: All interactive elements focusable

### Content Principles
- **"Zawsze syntezuj"**: Every content piece should create new insights
- **"So What?" test**: Every claim must answer "what's the business value?"
- **ROI-driven**: Always quantify results (percentages, revenue impact)
- **No fluff**: Avoid marketing jargon, be specific and actionable

---

## 🚀 Development Workflow

### Local Development
```bash
# Install dependencies
npm install

# Start dev server (Turbopack)
npm run dev
# → http://localhost:3000

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint
```

### Environment Variables
```bash
# .env.local (NEVER commit!)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Vercel deployment (set in dashboard)
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

⚠️ **SECURITY**: 
- `.env.local` is in `.gitignore` ✅
- Never commit API keys
- Rotate keys if exposed
- Use Vercel env variables for production

### Git Workflow
```bash
# Branch naming convention
feature/hero-optimization
fix/mobile-nav-scroll
perf/lazy-loading
docs/api-documentation

# Commit messages (descriptive, present tense)
✅ "Add analytics tracking to CTA buttons"
✅ "Fix mobile navigation overlay z-index"
❌ "changes"
❌ "updated stuff"
```

### Deployment (Vercel)
- **Automatic**: Push to `main` → Auto-deploy
- **Preview**: PR → Preview URL
- **Rollback**: Vercel dashboard → Redeploy previous version

---

## 🧪 Testing Guidelines

### Manual Testing Checklist
- [ ] Desktop: Chrome, Safari, Firefox
- [ ] Mobile: iPhone (Safari), Android (Chrome)
- [ ] Tablets: iPad
- [ ] Performance: Lighthouse (90+ score target)
- [ ] Accessibility: WAVE, axe DevTools
- [ ] Forms: Submit, validation, error states
- [ ] Links: All CTAs, navigation, external links

### Key User Flows
1. **First Visit → Book Consultation**
   - Land on hero → Read services → View case study → Click CTA
2. **Mobile Navigation**
   - Open menu → Navigate to section → Close menu
3. **Contact Form**
   - Fill form → Submit → Receive confirmation

---

## 📊 Performance Targets

### Core Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s ✅
- **FID** (First Input Delay): < 100ms ✅
- **CLS** (Cumulative Layout Shift): < 0.1 ✅

### Lighthouse Scores (Mobile)
- **Performance**: 90+ ✅
- **Accessibility**: 95+ ✅
- **Best Practices**: 100 ✅
- **SEO**: 90+ (⚠️ needs improvement - see ROADMAP.md)

---

## 🔗 Key File Locations

### Critical Files
- **Main page**: `app/page.tsx`
- **Layout**: `app/layout.tsx`
- **Critical CSS**: `app/critical.css`
- **Email API**: `app/api/send-email/route.ts`

### Configuration
- **Next.js**: `next.config.ts`
- **TypeScript**: `tsconfig.json`
- **Tailwind**: `tailwind.config.ts`
- **ESLint**: `.eslintrc.json`

### Documentation
- **Project summary**: `PROJECT_SUMMARY.md`
- **Project info**: `project_information.md`
- **Roadmap**: `ROADMAP.md`

---

## 🐛 Known Issues & TODOs

### High Priority (Week 1-2)
- [ ] **SEO**: Add metadata, Open Graph tags, sitemap.xml
- [x] **Analytics - GA4**: ✅ Implemented 2025-11-21 (see `app/lib/analytics.ts`)
- [ ] **Analytics - Hotjar**: Add heatmaps and session recordings
- [ ] **API Security**: Rotate Resend API key (if exposed)

### Medium Priority (Week 3-4)
- [ ] **Floating labels**: Refactor FinalCTA.tsx to use React state (no querySelector)
- [ ] **Error boundaries**: Add app/error.tsx and app/global-error.tsx
- [ ] **Email validation**: Strengthen validation in send-email API

### Low Priority (Month 2+)
- [ ] **Testing**: Add Jest + Playwright
- [ ] **Root README**: Create setup instructions
- [ ] **Key props**: Replace key={index} in CompanyCarousel with unique IDs

---

## 💡 Best Practices Reminders

### DO ✅
- Read ROADMAP.md before starting new tasks
- Use CSS Modules for complex components
- Test on real mobile devices (not just DevTools)
- Optimize images (WebP, proper sizing)
- Measure performance impact of changes
- Document breaking changes in git commits
- Keep dependencies updated (security patches)

### DON'T ❌
- Don't use `any` type in TypeScript
- Don't hardcode colors/spacing (use Tailwind tokens)
- Don't use `querySelector` (use React refs)
- Don't commit `.env.local`
- Don't add new dependencies without discussing
- Don't break mobile responsiveness
- Don't add flashy animations (goes against design system)

---

## 📞 Quick Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run build           # Production build
npm run lint            # Check code quality

# Git
git log --oneline -10   # Recent commits
git status              # Check changes

# Performance
npm run build -- --analyze  # Bundle analysis
```

---

## 🔄 Integration with ROADMAP.md

**Workflow:**
1. Check `ROADMAP.md` for current priorities
2. Move task to "In Progress" (add 🏗️ timestamp)
3. Create feature branch
4. Implement following standards in this file
5. Test thoroughly
6. Create PR
7. After merge, move task to "Completed" (add ✅ timestamp)

**Linear Integration:**
- High-level tasks → Linear (client-facing, milestones)
- Technical tasks → ROADMAP.md (implementation details)
- Sync: Linear issue → GitHub PR → ROADMAP.md update

---

**Questions?** Check PROJECT_SUMMARY.md for detailed implementation history.
