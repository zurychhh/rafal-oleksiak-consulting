# Product Page Plan: SEO Auto-Publish Tool
## Route: `/auto-publish` (oleksiakconsulting.com/auto-publish)

---

## Architecture

- **Route:** `app/auto-publish/page.tsx` (server component wrapper)
- **Client component:** `app/auto-publish/AutoPublishClient.tsx` ("use client")
- **CSS Module:** `app/auto-publish/auto-publish.module.css`
- **Layout:** Uses the same root layout (Poppins + DM Sans fonts, critical.css + globals.css) — no custom layout needed. The page gets its own Navbar at top and Footer at bottom (same pattern as blog layout but with the main site's design language).

---

## Page Sections (Top → Bottom)

### 1. HERO — "Your SEO Engine on Autopilot"
- Dark background (#2D3142) with 3 floating gradient shapes (same pattern as FinalCTA)
- Badge: "AI-POWERED SEO TOOL" (gradient border pill, 11px uppercase)
- Headline: gradient text (Poppins 900, clamp 36-60px)
  - "Stop Writing Blog Posts."
  - "Let AI Publish Content That Ranks."
- Subheadline (DM Sans 400, 18-20px, rgba white 0.85):
  - "Automated SEO content engine for ecommerce brands. AI writes, optimizes, and publishes — you get organic traffic growth without lifting a finger."
- Two CTAs side by side:
  - Primary: "Start Free Trial →" (gradient button, same as navbar-button style)
  - Secondary: "See How It Works ↓" (ghost button, scroll to demo section)
- Trust line below: "Trusted by 15+ ecommerce brands · 500+ posts published · Avg. 34% organic traffic increase"

### 2. PROBLEM/SOLUTION — "The SEO Content Problem"
- 3-column grid of "pain point" cards (glassmorphism, same pattern as Services.tsx)
- Each card: red/amber icon + title + description
  - Card 1: "Content Is Expensive" — "Hiring writers costs €500-2000/article. Most ecommerce teams can't sustain weekly publishing."
  - Card 2: "Consistency Is Hard" — "Publishing once, then silence for months. Google rewards consistent freshness signals."
  - Card 3: "SEO Knowledge Gap" — "Writing content is one thing. Writing content that ranks requires technical SEO expertise."
- Below cards: gradient breaker line
- Solution statement (centered, gradient text): "What if your blog wrote itself — and actually drove traffic?"

### 3. LIVE DEMO — Interactive Dashboard Preview
- Glassmorphism card (large, full-width, backdrop-filter blur)
- Animated "fake dashboard" showing:
  - Left panel: Agent config (name, expertise tags, tone selector)
  - Right panel: Preview of generated article with title, meta description, keywords
  - Bottom bar: Schedule indicator ("Next post: 3 days · Published: 47 articles · Avg. 1,200 words")
- Uses CSS animations: typewriter for article title, counter animations for stats
- Interaction: 3 tabs at top to switch between "Configure Agent → Generate Content → Auto-Publish" — each tab shows different dashboard state
- Subtle scan-line overlay (same pattern as FinalSuccessScreen CRT)

### 4. FEATURES — "How It Works"
- 4-step vertical timeline (same pattern as ProcessTimeline but vertical, always)
- IntersectionObserver sequential reveal (350ms stagger)
- Steps:
  1. **Configure Your AI Agent** — "Set expertise, tone, target keywords. The AI learns your brand voice."
  2. **Smart Content Generation** — "Claude AI researches topics, writes 1,500+ word articles with proper H-tags, internal links, and schema markup."
  3. **Automatic Publishing** — "Set a schedule (daily, every 3 days, weekly). Posts go live on your blog automatically."
  4. **SEO Optimization Built-In** — "Meta titles, descriptions, keyword density, readability scores — all optimized before publish."

### 5. CAPABILITIES GRID — "What You Get"
- 3-column grid (same as Services.tsx pattern)
- 6 feature cards with gradient icons:
  - AI Content Writer (purple gradient icon)
  - Smart Scheduling (cyan gradient icon)
  - SEO Optimization (green gradient icon)
  - Multi-Agent Support (amber gradient icon)
  - Analytics Dashboard (red gradient icon)
  - WordPress/Custom Integration (violet gradient icon)
- Each card: icon + title + 3-4 bullet points with checkmarks

### 6. SOCIAL PROOF — Metrics Ticker
- Infinite scrolling ticker (same as AchievementsTicker pattern)
- Items: "500+ Posts Published · 15+ Active Brands · 34% Avg Traffic Growth · 1,247 Avg Words/Post · 92% SEO Score Average · €0.03/word vs €0.30 agency"

### 7. ROADMAP — "What's Coming Next"
- Interactive timeline with phases (horizontal desktop, vertical mobile)
- 4 phases with status indicators:
  - Phase 1: ✅ LIVE — "AI Content Generation + Auto-Publishing"
  - Phase 2: 🔨 IN PROGRESS — "WordPress Plugin + Shopify Integration"
  - Phase 3: 📋 PLANNED — "Competitor Analysis + Content Gap Detection"
  - Phase 4: 🔮 VISION — "Multi-language Support + A/B Testing"
- Each phase expandable with detail items
- Glassmorphism cards with gradient left border (purple for live, cyan for in-progress, white/muted for planned)

### 8. PRICING — "Simple, Transparent Pricing"
- 3 pricing cards side by side (glassmorphism)
  - Starter: "€99/mo" — 1 agent, 10 posts/month, basic SEO
  - Growth: "€249/mo" (RECOMMENDED badge) — 3 agents, 30 posts/month, advanced SEO, analytics
  - Enterprise: "Custom" — Unlimited agents, custom integrations, dedicated support
- Each card: price, features list with checkmarks, CTA button
- Growth card slightly elevated/highlighted with gradient border active

### 9. FAQ — Collapsible Accordion
- 6-8 questions with expand/collapse animation
- Questions like:
  - "How does the AI generate content?"
  - "Will Google penalize AI content?"
  - "Can I edit posts before publishing?"
  - "What CMS platforms are supported?"
  - "How does scheduling work?"
  - "Is there a free trial?"

### 10. FINAL CTA — "Ready to Put Your SEO on Autopilot?"
- Same visual pattern as main site FinalCTA but simpler (no form, just CTA)
- Headline with gradient text
- Subheadline: "Start publishing SEO-optimized content today. No credit card required."
- Primary CTA: "Start Free Trial →"
- Secondary: "Book a Demo" (links to Calendly)
- Floating gradient shapes in background

---

## Navigation

- **Own header** (same pattern as blog layout): Logo (link to /) + nav links (Home, Features → #features, Pricing → #pricing, Blog → /blog) + CTA button "Start Free Trial"
- **Footer**: Simple, same as blog footer
- **Link from main Navbar**: Add to navbar-cta alongside BLOG ghost button (or update BLOG to dropdown later)

---

## Technical Notes

- Pure CSS + React hooks for all animations (no external libraries, matching existing patterns)
- CSS Module for all styles (`.module.css`)
- IntersectionObserver for scroll-triggered reveals
- `useState` for tabs, accordion, roadmap interactions
- Responsive: 1024px → tablet, 768px → mobile, 480px → small mobile
- `prefers-reduced-motion` support on all animations
- SEO: full metadata, OpenGraph, JSON-LD Product schema

---

## Files to Create

1. `app/auto-publish/page.tsx` — Server component with metadata
2. `app/auto-publish/AutoPublishClient.tsx` — Main client component
3. `app/auto-publish/auto-publish.module.css` — All styles

## Files to Modify

1. `app/components/sections/Navbar.tsx` — Add "AUTO-PUBLISH" or link to product page
