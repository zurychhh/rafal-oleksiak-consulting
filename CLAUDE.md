# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Read This First: Repo Is Mid-Pivot

Two facts change what work is worth doing here. Check both before starting anything substantial.

**1. A large deletion is staged but not executed.** `scripts/purge-legacy.sh` removes ~46,600 lines
across `radar`, `lama`, `mcc`, `stripe`, `admin`, and `auto-publish` — the agreed end state is
*homepage + blog only*. It is dry-run by default (`--apply` to execute) and branches+commits first.
Do not invest in refactoring a subsystem on that list without confirming with the user; ask first.

**2. A new homepage exists outside Next.js.** `design/production/index.html` is a tested, standalone
version that has not been ported. The full brief, task order, and the exact prompt the user intends
to run live in `HANDOFF-CC.md` (Polish) and `design/production/HANDOVER.md`. Read both before
touching the homepage.

**3. This repository is public and has secrets in git history.** Verified: it clones anonymously.
Rotating is the user's call, not something to do unprompted — but never add a secret value to any
file, including examples, and flag before pushing. `.google-ads-token.json` and `.linkedin-token.json`
hold live OAuth tokens locally and are gitignored.

## Build & Development Commands

```bash
npm run dev          # Dev server (Next 16 → Turbopack by default)
npm run build        # Production build
npm run lint         # ESLint 9 flat config (`eslint .`)
npm run typecheck    # tsc --noEmit — NOT run by build; run it explicitly
npm start            # Run production build locally
ANALYZE=true npm run build   # Bundle analyzer
```

**There is no test framework.** No jest/vitest, no `test` script. "Testing" in this repo means:

```bash
node design/qa.js <html-file> --scroll   # Playwright visual QA: 9 viewports, checks
                                         # clipping, overlap, off-screen, contrast
npx tsx scripts/send-test-email.ts you@example.com   # Render + send a real audit email
npx tsx scripts/test-email-template.ts               # Email template only
node scripts/hubspot-setup.mjs [--apply]             # Idempotent HubSpot property setup
```

`design/qa.js` needs chromium — from `/opt/pw-browsers` or a local Playwright install.

**Database (Neon Postgres + Drizzle):**
```bash
npx drizzle-kit push       # Push lib/radar/db/schema.ts to POSTGRES_URL
npx drizzle-kit generate   # Emit SQL migrations to ./drizzle
```

**Stripe / Vercel:**
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
vercel dev
vercel env pull
```

## Architecture Overview

### Tech Stack
Next.js 16 (App Router, React 19, Turbopack) · TypeScript 5.9 strict · CSS Modules + Tailwind 4 ·
Drizzle ORM + `@neondatabase/serverless` · `@react-pdf/renderer` · Cheerio.

### Four products in one Next app

| Product | Routes | Backing store |
|---|---|---|
| **Marketing site** | `/`, `/privacy`, `/auto-publish` | none |
| **LAMA** — website audit → lead | `/api/lama/audit`, `/audit-success` | HubSpot |
| **RADAR** — competitor intelligence SaaS | `/radar/*`, `/api/radar/*` | Neon Postgres |
| **Blog + admin** | `/blog/*`, `/admin/*`, `/api/auth` | Railway backend (external) |
| **MCC** — ad platform automation | `/api/mcc/*` | OAuth token files on disk |

### The two `lib/` directories

This trips people up constantly. There are two, and they are **not** a hierarchy:

- `lib/` (repo root) — LAMA analyzers, RADAR, MCC, blog API clients, Stripe.
- `app/lib/` — client-side analytics, constants, `hubspot.ts`, and all React-PDF report components.

Both are reachable via `@/*` (aliased to repo root), so imports read `@/lib/radar/db` vs
`@/app/lib/hubspot`. **HubSpot is duplicated across both** (`lib/lama/hubspot.ts` for audit contacts,
`app/lib/hubspot.ts` for generic lead upserts) — check which one a route already uses before adding
a third path.

### LAMA audit flow — `app/api/lama/audit/route.ts`

1. Validate URL/email.
2. **Own-domain short circuit:** URLs matching `oleksiakconsulting.com` return curated hardcoded
   scores instead of running analyzers. Expect this when testing against the live site.
3. Run 6 analyzers in parallel via `Promise.allSettled` — `lib/lama/analyzers/`:
   visibility (Find/SEO), performance (Stay/PageSpeed), clarity (Understand/Claude AI),
   trust (SSL, privacy), conversion (forms, CTA), engagement (CRM maturity).
4. Weighted 0–100 score → HubSpot contact + activity → email via Resend.
5. **Paid tier is dormant.** The Stripe imports in the route are commented out; the `paid` request
   flag and the 100+ page PDF branch still exist and work, but nothing sells them. Don't assume
   `/api/stripe/*` is wired to the audit.

### RADAR — the only part with a database

Passwordless SaaS. Undocumented anywhere else, so in detail:

**Auth** (`lib/radar/auth/session.ts`): magic link → session cookie.
- Magic links expire in 15 min, single-use, max 3 active per user (rate limit).
- Sessions last 7 days, cookie `radar_session`, 64-char hex tokens from `randomBytes(32)`.
- `getRadarSession()` is the server-side accessor every `/api/radar/*` route calls first.

**Schema** (`lib/radar/db/schema.ts`, 5 tables): `radar_users`, `radar_magic_links`,
`radar_sessions`, `radar_reports` (full report as `jsonb` + denormalized counts for list views),
`radar_competitors`. All child tables cascade-delete from their parent.

**Two analyzer generations coexist — pick deliberately:**
- `lib/radar/analyzer.ts` (v1) — used by `/api/radar/scan` and the unauthenticated
  `/api/radar/analyze` (email-a-report lead magnet).
- `lib/radar/analyzer-v2.ts` (v2) — used by `/api/radar/scan-v2`. Orchestrates 6 independent
  providers in `lib/radar/providers/`, each returning a uniform `ProviderResult<T>` so one failing
  provider degrades the report instead of killing the scan.

**Provider cost model** — v2 was built free-first, which is why `quickScan` exists:

| Provider | Cost | Notes |
|---|---|---|
| `content`, `schema`, `sitemap`, `techstack` | free, unlimited | pure HTML/header parsing |
| `pagespeed` | free | slow; 60s timeout. `skipPageSpeed` to bypass |
| `serper` | **2,500 queries/month free tier** | quota-bearing. `skipSerper` to bypass |

`opportunity-finder.ts` layers Claude analysis on top (`includeAiAnalysis`, default true).
Route timeouts are explicit: `maxDuration = 120` (v1) / `180` (v2).

### Blog + admin — thin proxy over an external backend

No blog data lives here. `lib/blog/blog-api.ts` (public) and `lib/blog/admin-api.ts` (authenticated)
call a Railway service via `BLOG_API_URL`. Admin auth is a JWT from that backend stored in an
`admin_token` httpOnly cookie; `lib/blog/session.ts` decodes it client-agnostically without
verifying the signature — the backend is the real gate.

**`filterPosts()` in `blog-api.ts` is load-bearing, not decoration.** The shared backend previously
fed Polish legal content into this tenant. All three public read functions filter by `agent_id` plus
an on/off-topic keyword check, defaulting to reject. If posts vanish from the blog, suspect this
filter before suspecting the API.

Admin routes are multi-tenant: `app/admin/(authenticated)/[projectId]/...`.

### MCC — OAuth against ad platforms

`lib/mcc/google-auth.ts` and `lib/mcc/linkedin-auth.ts` persist tokens to `.google-ads-token.json` /
`.linkedin-token.json` at `process.cwd()`, with a 5s in-memory cache and auto-refresh. **File-backed
token storage does not survive Vercel's ephemeral filesystem** — this works locally; treat production
MCC as unfinished. Google Ads has Explorer Access; LinkedIn Ads is awaiting API approval.

### Auth topology — `middleware.ts`

Two independent cookie realms, one matcher (`/admin/:path*`, `/radar/dashboard/:path*`):

- `admin_token` absent → `/admin/*` redirects to `/admin`; present on `/admin` → redirect to dashboard.
- `radar_session` absent → `/radar/dashboard/*` redirects to `/radar/login`.

Middleware only checks *presence*. Actual validation happens in the route handlers
(`getRadarSession()`, backend JWT check). Never treat middleware as authorization.

## Environment Variables

`.env.example` is stale — it covers only the marketing site. Actual usage across the codebase:

| Service | Variables |
|---|---|
| Resend | `RESEND_API_KEY`, `FROM_EMAIL`, `TO_EMAIL` |
| HubSpot | `HUBSPOT_API_KEY` ← *not* `HUBSPOT_ACCESS_TOKEN` |
| Anthropic | `ANTHROPIC_API_KEY` |
| Neon (RADAR) | `POSTGRES_URL` |
| RADAR | `RADAR_BASE_URL` (magic-link URLs), `SERPER_API_KEY`, `GOOGLE_PAGESPEED_API_KEY` (optional) |
| Blog | `BLOG_API_URL` / `NEXT_PUBLIC_BLOG_API_URL`, `NEXT_PUBLIC_BLOG_AGENT_ID` |
| Stripe | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID` |
| Google Ads API | `GOOGLE_ADS_DEVELOPER_TOKEN`, `GOOGLE_ADS_CUSTOMER_ID`, `GOOGLE_ADS_MANAGER_CUSTOMER_ID`, `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_OAUTH_REDIRECT_URI` |
| LinkedIn / Meta | `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, `LINKEDIN_AD_ACCOUNT_ID`, `LINKEDIN_ORGANIZATION_ID`, `META_ACCESS_TOKEN`, `META_PIXEL_ID` |
| Tracking | `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_GOOGLE_ADS_ID`, `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL`, `NEXT_PUBLIC_GOOGLE_ADS_CALENDLY_LABEL` |
| Misc | `NEXT_PUBLIC_SITE_URL`, `VERCEL_URL` |

## Tracking Load Order (layout.tsx)

Order is a correctness requirement, not a style choice: ConsentMode sets GDPR defaults to *denied*
and must execute before any tag can fire.

```
<head>   1. ConsentMode  →  2. Preconnect (GTM + Google Ads)  →  3. SchemaOrg (4× JSON-LD)
<body>   4. GTMNoScript  →  5. {children}  →  6. GTMScript  →  7. GoogleAnalytics (returns null
         when GTM is active)  →  8. WebVitals  →  9. ScrollTracker
```

## Important Patterns

### ESLint: two config files, only one is read
`eslint.config.mjs` (flat, ESLint 9) is authoritative. `.eslintrc.json` is a leftover — Next 16
removed `next lint` and no longer reads it. Note the flat config **ignores `scripts/**`**, so lint
passing says nothing about files there.

### TypeScript exclusions
`tsconfig.json` excludes these from type-checking (React-PDF's types are unworkable); they compile
at runtime but `npm run typecheck` will not catch errors in them:
`api/`, `app/lib/lama/pro/*`, `app/api/pdf-generator/*`, `app/HomeClient.tsx`,
`app/components/ui/FinalSuccessScreen.tsx`, `app/components/ui/useTypewriter.ts`.

`api/` at repo root is a legacy standalone Vercel function — gitignored *and* excluded. Ignore it.

### Vercel constraints
- **No internal HTTP fetches.** Import the function directly instead of `fetch('/api/...')`.
- PDF generation and anything touching `fs` needs `runtime = 'nodejs'`, never edge.

### Route runtime declarations
Any route using Node APIs, a DB connection, or cookies:
```typescript
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;  // long-running scans/audits only
```

### Path alias
`@/*` maps to the repo root: `import { db } from '@/lib/radar/db'`.

## `design/` — new site and tools (September 2026)

Holds work produced outside the Next app and not yet ported. `design/production/` is the new
homepage plus a `/api/lead` endpoint and two helpers; `design/tools/` is three FMCG tools with AI
calls; `design/qa.js` is the Playwright checker described above.

A daily improvement loop runs **in the cloud** and writes to working artifacts, never to this repo —
the cloud environment has no write access here, and push works only from this machine. Do not
recreate that scheduler locally.

## Documentation Workflow

Four files, kept current: **STATUS.md** (state, blockers, recent changes) · **CLAUDE.md** (this
technical reference) · **ROADMAP.md** (tasks, decisions log) · **PROJECT_SUMMARY.md** (history).
Update after completing tasks. At 90% context usage, stop and commit a checkpoint.

## Language

Documentation uses Polish for business context, English for code and comments. Several root-level
docs (`HANDOFF-CC.md`, `STATUS.md`, `ROADMAP.md`, `scripts/*.sh`) are written in Polish.
