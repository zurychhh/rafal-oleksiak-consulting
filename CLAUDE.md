# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run lint         # ESLint
npm start            # Run production build locally
```

**Stripe local testing:**
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

**Vercel:**
```bash
vercel dev           # Local Vercel environment
vercel env pull      # Pull environment variables
```

## Architecture Overview

### Tech Stack
- **Next.js 16** (App Router, React 19, Turbopack)
- **TypeScript 5.9** (strict mode)
- **CSS Modules** + Tailwind CSS 4
- **@react-pdf/renderer** for PDF generation
- **Cheerio** for HTML parsing in analyzers

### Project Structure

```
app/
├── api/
│   ├── lama/audit/route.ts      # Main LAMA audit orchestrator
│   ├── pdf-generator/route.ts   # PDF generation endpoint
│   ├── send-email/route.ts      # Contact form
│   └── stripe/
│       ├── create-checkout/     # Stripe session creation
│       └── webhook/             # Payment confirmation webhook
├── components/
│   ├── sections/                # Page sections (Navbar, Hero, FinalCTA, etc.)
│   └── ui/                      # Reusable UI components
├── lib/
│   ├── analytics.ts             # GA4 event tracking
│   ├── constants/               # Colors, copy text
│   └── lama/pro/                # PDF generation components
│       └── pdf/                 # React-PDF report components
└── HomeClient.tsx               # Main client component

lib/
├── lama/
│   ├── analyzers/               # 6 audit category analyzers
│   │   ├── visibility.ts        # Find (SEO)
│   │   ├── performance.ts       # Stay (PageSpeed)
│   │   ├── clarity.ts           # Understand (Claude AI)
│   │   ├── trust.ts             # Trust (SSL, privacy)
│   │   ├── conversion.ts        # Convert (forms, CTA)
│   │   └── engagement.ts        # Engage (CRM maturity)
│   ├── types.ts                 # TypeScript interfaces
│   ├── email-template.ts        # Audit result email HTML
│   ├── followup-email-template.ts
│   └── hubspot.ts               # HubSpot CRM integration
└── stripe.ts                    # Stripe client
```

### LAMA Audit System Flow

The core business logic lives in `/app/api/lama/audit/route.ts`:

1. **Request** → Validate URL, determine free/paid tier
2. **Analyze** → Run 6 analyzers in parallel (`Promise.allSettled`)
3. **Score** → Calculate weighted average (0-100)
4. **HubSpot** → Create/update contact, log activity
5. **PDF** → Generate 100+ page report (paid only)
6. **Email** → Send via Resend with PDF attachment

**Key types in `lib/lama/types.ts`:**
- `AuditRequest` - incoming audit request
- `CategoryScore` - individual analyzer result
- `AuditResult` - complete audit response

### Key Integrations

| Service | Purpose | Env Variable |
|---------|---------|--------------|
| Resend | Email delivery | `RESEND_API_KEY`, `FROM_EMAIL` |
| HubSpot | CRM | `HUBSPOT_ACCESS_TOKEN` |
| Anthropic | AI analysis (clarity) | `ANTHROPIC_API_KEY` |
| Stripe | Payments | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID` |
| GA4 | Analytics | `NEXT_PUBLIC_GA_MEASUREMENT_ID` |

## Important Patterns

### TypeScript Exclusions
Some files are excluded from type-checking in `tsconfig.json` due to React-PDF complexities:
- `app/lib/lama/pro/*` (PDF generation)
- `app/api/pdf-generator/*`
- `app/HomeClient.tsx`
- `app/components/ui/FinalSuccessScreen.tsx`
- `app/components/ui/useTypewriter.ts`

### Vercel Constraints
- **No internal HTTP fetches**: Use direct function imports instead of `fetch('/api/...')`
- **PDF generation**: Must use `runtime = 'nodejs'` (not edge)

### Runtime Configuration
API routes that need Node.js features (like PDF generation) must declare:
```typescript
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
```

### Path Alias
Use `@/*` for imports from project root:
```typescript
import { analyzeVisibility } from '@/lib/lama/analyzers/visibility';
```

## Documentation Workflow

This project uses 4 documentation files:

1. **STATUS.md** - Current state, blockers, recent changes
2. **CLAUDE.md** - This file (technical reference)
3. **ROADMAP.md** - Task tracking, decisions log
4. **PROJECT_SUMMARY.md** - Historical context

**Update docs after completing tasks. At 90% context usage, stop and commit a checkpoint.**

## Language

Project documentation uses Polish for business context, English for code/comments.
