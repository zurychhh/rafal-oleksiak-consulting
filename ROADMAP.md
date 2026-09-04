# 🗺️ ROADMAP - Rafał Oleksiak Consulting
## Project Status & Progress Tracker

**Last Updated:** 2026-02-13
**Current Phase:** Phase 3 - Advertising Infrastructure + Growth
**Overall Progress:** 85% (Website ✅, LAMA ✅, Tracking ✅, Blog ✅, Ads 🚧)

---

## 📊 QUICK STATUS

| Component | Status | Progress | Priority | Last Updated |
|-----------|--------|----------|----------|--------------|
| Main Website | ✅ Live | 100% | - | 2025-11-09 |
| LAMA Free Audit | ✅ Live | 100% | - | 2025-12-11 |
| LAMA Paid Audit (Stripe) | 📦 Archived | 100% | LOW | 2026-01-17 |
| PDF Report | ✅ Production-Ready | 100% | - | 2026-01-07 |
| Blog + Admin Panel | ✅ Live | 100% | - | 2026-02-01 |
| Auto-Publish | ✅ Live | 100% | - | 2026-02-01 |
| RADAR AI | ✅ Live | 100% | - | 2026-02-01 |
| GTM + Consent Mode v2 | ✅ Live | 100% | - | 2026-02-02 |
| Schema.org JSON-LD | ✅ Live | 100% | - | 2026-02-02 |
| Google Ads (Remarketing + Conversions) | ✅ Live (via GTM) | 100% | - | 2026-02-02 |
| Google Ads API (MCC) | ✅ Explorer Access | 100% | - | 2026-02-13 |
| LinkedIn Ads Integration | ✅ Campaign Live | 90% | HIGH | 2026-02-13 |
| LinkedIn API (OAuth2) | ⏳ Waiting Approval | 80% | HIGH | 2026-02-13 |
| Follow-up Automation | 🚧 Template Ready | 50% | MEDIUM | 2025-12-21 |

---

## 🔄 RESUME POINT (dla Claude Code)

**Exact State:**
- Projekt: Full tracking + LinkedIn Ads deployed
- Aktualny fokus: Wait for LinkedIn API approval, then first Google Ads Search campaign
- Status: LinkedIn campaign live, API infrastructure ready

**Co działa:**
- ✅ Main website deployed (90+ Lighthouse scores)
- ✅ LAMA Free Audit (6 categories, email delivery, CTA do konsultacji)
- ✅ HubSpot CRM integration (auto contact creation)
- ✅ Blog + Admin Panel (Railway backend, post editor, SEO scores)
- ✅ Auto-Publish product page + RADAR AI competitor intelligence
- ✅ GTM (GTM-PTPCV5FD) z GA4, Google Ads Remarketing, Conversion Linker
- ✅ Consent Mode v2 (GDPR-compliant, 31 krajów EEA)
- ✅ Schema.org JSON-LD (4 blocks: Organization, Person, ProfessionalService, WebSite)
- ✅ Google Ads conversions: form_submission_lead → GA4 → Google Ads (imported)
- ✅ Google Ads API OAuth2 (Explorer Access — 2,880 ops/day sufficient)
- ✅ LinkedIn Ads campaign live ("Thought Leader - Post Promotion - Feb 2026")
- ✅ LinkedIn OAuth2 infrastructure built (`/api/mcc/linkedin/auth/*`)
- ✅ LinkedIn Developer App ("Oleksiak Consulting MCC", Client ID: `77qsptldxbru79`)

**Co jest Archived:**
- 📦 LAMA Paid Audit (Stripe integration, €99) — patrz `PAID_AUDIT_ARCHIVE.md`

**Co jest In Progress / Blocked:**
- ⏳ LinkedIn API products — waiting for Advertising API + Share on LinkedIn approval
- ⏳ LinkedIn Ads payment — need to add card in Billing Center
- ⏳ Remarketing audience — zbiera dane (min 1000 users required)
- ⏳ Follow-up email automation (template ready, needs scheduling implementation)

**Next Immediate Steps:**
1. Add payment card to LinkedIn Billing Center
2. Wait for LinkedIn API approval (1-3 days)
3. Pierwsza Google Ads Search campaign
4. Follow-up email automation

**Blockers:**
- LinkedIn API approval pending (can manage campaigns manually in meantime)
- LinkedIn payment card needed (campaign won't deliver without it)

**Context:** LinkedIn Ads Thought Leader campaign is live. OAuth2 infrastructure for both Google and LinkedIn is complete. Explorer Access for Google Ads API is sufficient (no need for Basic Access). Waiting for LinkedIn API product approval to enable programmatic management.

---

## ✅ RECENTLY COMPLETED (Last 15 items)

### 2026-02-13
- ✅ **LinkedIn Ads Campaign (Manual)**
  - Created Thought Leader Ad campaign via Campaign Manager
  - Campaign: "Thought Leader - Post Promotion - Feb 2026"
  - Targeting: B2B decision makers (CMO, Director, VP, C-level)
  - Budget: Manual bidding, awareness objective
  - Status: Aktywna (pending payment method)

- ✅ **LinkedIn Developer App Setup**
  - App: "Oleksiak Consulting MCC"
  - Client ID: `77qsptldxbru79`
  - Company Page: "Oleksiak Consulting" (verified)
  - OAuth2 redirect URLs configured (localhost + production)
  - Products requested: Advertising API, Share on LinkedIn

- ✅ **LinkedIn OAuth2 Infrastructure**
  - `lib/mcc/linkedin-auth.ts` — Token management with auto-refresh
  - `app/api/mcc/linkedin/auth/route.ts` — Initiate OAuth flow
  - `app/api/mcc/linkedin/auth/callback/route.ts` — Exchange code for tokens
  - `app/api/mcc/linkedin/auth/status/route.ts` — Check auth status
  - `lib/mcc/LINKEDIN_OAUTH_SETUP.md` — Setup documentation
  - `.linkedin-token.json` added to `.gitignore`
  - Files: 4 new API routes + 1 auth helper + 1 setup guide

- ✅ **Google Ads API — Explorer Access Confirmed**
  - Reviewed Google's response about Basic Access
  - Confirmed Explorer Access (2,880 ops/day) is sufficient
  - Withdrew Basic Access application
  - No longer a blocker for MCC development

### 2026-02-02
- ✅ **Google Ads Tracking Infrastructure (Complete)**
  - Consent Mode v2 — GDPR defaults `denied` for 31 EEA countries
  - GTM Container GTM-PTPCV5FD — 3 tags: GA4, Remarketing, Conversion Linker
  - Schema.org JSON-LD — 4 blocks (Organization, Person, ProfessionalService, WebSite)
  - Preconnect to GTM/Google Ads domains in layout.tsx
  - GoogleAnalytics.tsx updated to fallback mode (skip when GTM active)
  - CookieConsent banner integrated with Consent Mode v2
  - Files: `ConsentMode.tsx`, `GTMScript.tsx`, `SchemaOrg.tsx`, `CookieConsent.tsx`, `layout.tsx`
  - Impact: Full Google Ads campaign readiness

- ✅ **Google Ads Account Setup**
  - Created Google Ads account (544-648-7427)
  - Created Manager Account (MCC): 759-448-7243
  - Linked accounts (manager → client)
  - GA4 auto-linked with Google Ads
  - Created conversion event: `form_submission_lead` (Active in Google Ads)
  - Deployed Remarketing tag + Conversion Linker via GTM (Version 2 published)
  - Impact: Ready for Search, Display, and Remarketing campaigns

- ✅ **Google Ads API OAuth2 Flow**
  - Enabled 3 APIs: Google Ads API, Tag Manager API, Google Analytics Admin API
  - Created OAuth2 client credentials in Google Cloud Console
  - Built 3 API routes: auth initiation, callback, status check
  - Built token management: auto-refresh, file storage, in-memory cache (5s TTL)
  - No external OAuth libraries — pure fetch()
  - Files: `app/api/mcc/auth/*`, `lib/mcc/google-auth.ts`
  - Impact: OAuth2 working, tokens refreshing

- ✅ **Google Ads API Basic Access Application**
  - Generated MCC-Design-Document.rtf for application
  - Submitted application form with: MCC ID, business description, API capabilities
  - Status: Pending Google review
  - Impact: Will unlock programmatic campaign management

- ✅ **Vercel Deployment Update**
  - Added env vars: NEXT_PUBLIC_GTM_ID, NEXT_PUBLIC_GOOGLE_ADS_ID
  - Deployed to production via `npx vercel --prod`
  - Verified: GTM 2x in HTML (script + noscript), Consent Mode, Schema.org

### 2026-01-17 → 2026-02-01
- ✅ **Blog + Admin Panel**
  - Railway backend, post editor, topic suggestions, SEO scores, visual analytics
  - Overview dashboard with tenant-specific stats
  - Files: `app/blog/`, `app/admin/`

- ✅ **Auto-Publish Product Page**
  - /auto-publish with trial form + CSS styles
  - Files: `app/auto-publish/`

- ✅ **RADAR AI Competitor Intelligence**
  - Informational product page, added to Accelerators section
  - Files: various

- ✅ **Accelerators Section**
  - 3 tool cards on homepage (Auto-Publish, RADAR, LAMA Pro)

### 2026-01-17
- ✅ **Paid Audit Feature Archived**
  - Clean free audit flow ready for ads, easy to restore later
  - See `PAID_AUDIT_ARCHIVE.md`

### 2026-01-07
- ✅ **PDF Placeholder Data Removal**
  - PDF now 100% production-ready, no misleading data

### 2025-12-21
- ✅ Documentation Setup + PDF Generation Fix + TypeScript Build Fixes

### 2025-12-20
- ✅ Mobile Email Layout Fix + Client-side Audit Popup

### 2025-12-11
- ✅ Stripe Paid Audit + Follow-up Email Template + Content Updates

### 2025-12-10
- ✅ Navigation WHO/WHAT/HOW/WHY/WHEN + Next.js 16.0.8 security fix

### 2025-12-08
- ✅ CRT Success Screen + PDF Port Detection Fix

### 2025-11-09 (Website Launch)
- ✅ PR #14 - Hero Section Simplification

---

## 🚧 CURRENTLY IN PROGRESS

### Phase 3: Advertising Infrastructure + Growth

**Current Sprint:** LinkedIn API Approval + Google Ads Search Campaign

**Active Tasks:**

- [x] **LinkedIn Ads Integration** (✅ MOSTLY DONE)
  - [x] LinkedIn Developer App created
  - [x] OAuth2 flow built and working
  - [x] First campaign live (Thought Leader Ad)
  - [ ] Add payment card to Billing Center ← **ACTION NEEDED**
  - [ ] Wait for API products approval (1-3 days)
  - Impact: Paid social media lead generation

- [ ] **Google Ads Search Campaign** (HIGH PRIORITY — NEXT)
  - [x] Explorer Access confirmed (sufficient)
  - [x] OAuth2 flow working
  - [ ] Keyword research for CRM consulting
  - [ ] Campaign setup + ad copy
  - Impact: Lead generation via Google Search

- [ ] **Follow-up Email Automation** (MEDIUM PRIORITY)
  - [ ] Choose solution (Klaviyo vs cron job)
  - [ ] Implement 3-day delay trigger
  - Template: Ready ✅
  - Impact: +10-15% conversion rate

---

## 📋 NEXT UP (Priorytetyzowane)

### 🔴 HIGH PRIORITY

1. **LinkedIn Ads Integration** — Promote existing LinkedIn post
2. **Google Ads Search Campaign** — First keyword campaign (after Basic Access)
3. **Follow-up Email Automation** — 3-day retargeting
4. **Error Boundaries** — app/error.tsx

### 🟡 MEDIUM PRIORITY

5. **Analytics Enhancement** — Hotjar, funnel analysis, A/B testing
6. **Case Studies Detailed Pages** — Social proof, trust building
7. **Performance Monitoring** — Lighthouse CI, budgets

### 🟢 LOW PRIORITY

8. **Multi-language Support** — Polish + English
9. **Chatbot Integration** — AI-powered FAQ
10. **White-label LAMA** — For agencies

---

## 🧠 ARCHITECTURAL DECISIONS LOG

### Decision: 6 Categories (Not 5) for LAMA Audit
**Date:** 2025-12-08  
**Category:** Business / Product  

**Context:**  
Original plan had 5 categories. During implementation realized we needed to separate "clarity" from "engagement" for better analysis.

**Decision:**  
Expanded to 6 categories:
1. ATTRACT (Visibility/SEO) - 20%
2. ENGAGE (Performance) - 20%
3. CONVERT (Forms/CTA) - 15%
4. EXPAND (Clarity/AI) - 20%
5. ANALYZE (Trust) - 15%
6. RETAIN (Engagement) - 10%

**Impact:**  
- More comprehensive audit
- Better segmentation of issues
- Clearer actionable insights for users
- Slightly higher Claude API costs (~€0.02 vs €0.015 per audit)

**Status:** ✅ Implemented

---

### Decision: Stripe Over Custom Payment Solution
**Date:** 2025-12-10  
**Category:** Tech Stack  

**Context:**  
Need to monetize LAMA audits. Options: Stripe, PayPal, or Polish providers (Przelewy24, PayU).

**Options:**
1. **Stripe** - €0.25 + 1.4% per transaction, global, great DX
2. **PayPal** - Lower fees in Poland, but poor UX
3. **Przelewy24** - Local, lower fees, but integration complexity

**Decision:**  
Chose Stripe because:
- Best developer experience (webhooks, docs, testing)
- Future-proof (can expand internationally)
- Professional checkout experience
- Easy refunds / disputes handling
- Already using for other projects

**Trade-offs:**  
Higher fees (€1.40 on €99 vs €0.80 with local), but worth it for time saved + better UX.

**Status:** ✅ Implemented

---

### Decision: Resend Over SendGrid for LAMA Emails
**Date:** 2025-12-11  
**Category:** Tech Stack  

**Context:**  
Need reliable email delivery for audit reports. Already using Resend for contact forms.

**Decision:**  
Use Resend (not SendGrid) because:
- Already integrated in project
- Better deliverability in our tests
- Cleaner API
- Same pricing for our volume

**Note:**  
This changed from original plan (which suggested SendGrid). Resend proved more reliable.

**Status:** ✅ Implemented

---

### Decision: PDF Generation in Vercel (Not External Service)
**Date:** 2025-12-21  
**Category:** Architecture  

**Context:**  
PDF reports weren't working on Vercel production. Options: fix current approach vs use external service (like PDFMonkey, DocRaptor).

**Decision:**  
Fix in-house generation:
- Direct function call instead of HTTP fetch
- Puppeteer on Vercel Edge
- No external dependencies

**Why:**  
- €0 cost (vs €0.01-0.05 per PDF externally)
- Full control over template
- Faster generation
- No API rate limits

**Impact:**  
PDF generation now works perfectly in production. Cost savings: €300-500/month at scale.

**Status:** ✅ Implemented

---

### Decision: GTM-Centralized Tracking Over Direct Scripts
**Date:** 2026-02-02
**Category:** Architecture / Marketing

**Context:**
Need tracking infrastructure for Google Ads campaigns (remarketing, conversions). Options: direct script tags in HTML vs GTM container.

**Options:**
1. **Direct scripts** — GA4, Google Ads tags directly in layout.tsx
2. **GTM container** — All tags managed via GTM, single script in HTML

**Decision:**
GTM container (GTM-PTPCV5FD) because:
- Single point of management for all marketing tags
- Non-dev can add/modify tags without deployment
- Built-in consent mode integration
- Tag firing rules and triggers manageable via UI
- Versioning and preview mode for safe changes

**Loading order in layout.tsx:**
1. ConsentMode (first in `<head>` — sets defaults BEFORE any tags load)
2. Preconnect to GTM/Google Ads domains
3. SchemaOrg JSON-LD
4. GTMNoScript (first in `<body>`)
5. GTMScript (loads container)
6. GoogleAnalytics (fallback — returns null when GTM is active)

**Trade-offs:**
- Slight additional load from GTM container (~30KB)
- Need to manage two places (code + GTM UI)
- But flexibility and ease of adding new tags outweighs

**Status:** ✅ Implemented

---

### Decision: OAuth2 Without External Libraries
**Date:** 2026-02-02
**Category:** Architecture / Security

**Context:**
Need OAuth2 flow for Google Ads API. Options: use passport.js/next-auth vs build custom.

**Decision:**
Custom implementation with plain fetch() because:
- Single user (company owner) — no need for complex auth framework
- File-based token storage (`.google-ads-token.json`)
- In-memory cache with 5s TTL for performance
- Auto-refresh with 5-minute buffer before expiration
- Zero external dependencies

**Implementation:**
- `lib/mcc/google-auth.ts` — getAccessToken(), getAuthHeaders(), auto-refresh
- `app/api/mcc/auth/route.ts` — Redirect to Google OAuth2 consent screen
- `app/api/mcc/auth/callback/route.ts` — Exchange code for tokens, save to file
- `app/api/mcc/auth/status/route.ts` — Check auth status

**Status:** ✅ Implemented

---

### Decision: Documentation Structure (4 Files)
**Date:** 2025-12-21
**Category:** Project Management  

**Context:**  
Too many docs (6 files) = hard to maintain. Need simplification.

**Original:**
- CLAUDE.md
- ROADMAP.md  
- STATUS.md
- PROJECT_SUMMARY.md
- DECISIONS.md ← Separate
- BLOCKERS.md ← Separate

**Decision:**  
Consolidate to **4 files**:
1. **STATUS.md** - Current state + blockers
2. **CLAUDE.md** - Coding standards
3. **ROADMAP.md** - Plan + completed + decisions ← Merged DECISIONS here
4. **PROJECT_SUMMARY.md** - Full history

**Rationale:**  
- Fewer files = less context switching
- DECISIONS natural fit in ROADMAP
- BLOCKERS natural fit in STATUS
- Easier for new developers to onboard

**Status:** ✅ Implemented (this session)

---

### Decision: PDF Placeholder Data Handling
**Date:** 2026-01-07
**Category:** Product / UX

**Context:**
PDF report contained placeholder/fake data in FIND Section:
- Keyword volume/difficulty: hardcoded `1000, 700, 400` and `50, 60, 70`
- Backlink counts: all zeros for site + 3 competitors
- Local SEO citations/reviews: hardcoded zeros

**Options Considered:**
1. **Remove entire pages** (-3 pages, lose valuable content)
2. **Show "Data Not Available"** (honest but looks incomplete)
3. **Integrate Ahrefs/SEMrush API** (8-16h dev + €99-199/month API costs)
4. **Replace with guidance** (how to get real data) ← CHOSEN

**Decision:**
Option 4 - Replace fake metrics with actionable guidance:
- Remove specific fake numbers
- Keep educational content (tactics, strategies, templates)
- Add instructions on how to obtain real data using external tools
- Maintain GMB detection (which uses real audit data)

**Rationale:**
- No misleading data for customers
- No additional API costs
- Empowers users to find their own data
- Maintains report value (strategies, templates still useful)
- Report stays ~59 pages (no page reduction)

**Impact:**
PDF is now 100% production-ready with honest, actionable content.

**Status:** ✅ Implemented

---

## 🎯 MILESTONES & PHASES

### ✅ Phase 0: Main Website (COMPLETE - Nov 2025)
- Complete mobile responsiveness, 90+ Lighthouse, navigation

### ✅ Phase 1: LAMA MVP (COMPLETE - Dec 2025)
- 6-category audit, PDF, email, free audit flow, HubSpot

### ✅ Phase 1.5: LAMA Paid (COMPLETE - Dec 2025, ARCHIVED Jan 2026)
- Stripe, €99 pricing, webhook, paid audit flow — backend preserved

### ✅ Phase 2: Content & SEO (COMPLETE - Jan-Feb 2026)
- ✅ Blog + Admin Panel (Railway backend)
- ✅ Auto-Publish product page
- ✅ RADAR AI Competitor Intelligence
- ✅ Accelerators section
- ✅ Schema.org structured data (4 JSON-LD blocks)
- ✅ Documentation updates

### ✅ Phase 2.5: Tracking Infrastructure (COMPLETE - Feb 2026)
- ✅ GTM Container (GA4, Remarketing, Conversion Linker)
- ✅ Consent Mode v2 (GDPR, 31 EEA countries)
- ✅ Google Ads account setup + Manager Account (MCC)
- ✅ Conversion tracking: form_submission_lead → GA4 → Google Ads
- ✅ Google Ads API OAuth2 flow
- ⏳ Basic Access pending

### 🚧 Phase 3: Advertising & Growth (IN PROGRESS - Feb 2026)
- ⏳ LinkedIn Ads integration (promote existing post)
- ⏳ Google Ads Search campaign (after Basic Access)
- ⏳ Follow-up email automation
- ⏳ Error boundaries

### ⏳ Phase 4: Scale & Optimization (FUTURE)
- Analytics deep dive (Hotjar, funnel analysis)
- A/B testing
- Multi-language support
- White-label LAMA for agencies

---

## 💡 LESSONS LEARNED

### From Website Development (Nov 2025):
1. **Simplicity Wins** - 8 attempts at mobile nav, simplest solution won
2. **Mobile-First Essential** - 60%+ traffic from mobile
3. **Performance = UX** - Lazy loading can break features
4. **Documentation Critical** - Update after every task

### From LAMA Development (Dec 2025):
1. **Vercel HTTP Limits** - Internal API calls fail, use direct imports
2. **Email Testing** - Always test on real mobile devices
3. **PDF Generation** - In-house cheaper than external services
4. **Stripe Integration** - Worth higher fees for better DX
5. **"Zawsze Syntezuj"** - Users pay for solutions, not analysis

### From Tracking & Google Ads Setup (Feb 2026):
1. **Tracking before campaigns** - Zainstaluj tracking zanim wydasz budżet na reklamy
2. **Google Ads API Explorer Access** - 2,880 ops/day usually sufficient for small businesses
3. **GTM Polish UI** - "Conversion Linker" = "Tag łączący konwersje" po polsku
4. **OAuth2 without libraries** - Czysty fetch() wystarczy, nie trzeba external packages
5. **Consent Mode ordering** - Musi być FIRST w `<head>`, przed GTM i GA4
6. **File-based token storage** - Prosty pattern: `.google-ads-token.json` + `.gitignore`
7. **GTM Preview + ad blocker** - Preview może nie działać z ad blockerem, ale tag działa

### From LinkedIn Ads Setup (Feb 2026):
8. **LinkedIn requires Company Page** - Personal profile alone can't run ads
9. **Thought Leader Ads** - Promote personal posts via Company Page sponsorship
10. **LinkedIn API verification** - Must verify app association with Company Page first
11. **UTM parameters** - LinkedIn doesn't support custom parameters like `utm_account`
12. **Don't target connections** - Connections see organic posts free, paid for new audience
13. **LinkedIn OAuth same pattern** - Same OAuth2 pattern as Google, file-based token storage

---

**END OF ROADMAP**

*Update after each completed task. At 90% context → document → commit → alert user.*

**Next Update:** After LinkedIn API approval or first Google Ads Search campaign

**See Also:**
- STATUS.md - Current snapshot, integrations, blockers
- CLAUDE.md - Coding standards
- PROJECT_SUMMARY.md - Full implementation history


---

## Nowa strona + petla dzienna (4 wrzesnia 2026)

Kolejnosc jest wymuszona. Szczegoly i gotowy prompt: `HANDOFF-CC.md`.

- [ ] Uniewaznic trzy klucze — repo jest publiczne, historia je pamieta
- [ ] `npm i zod` + zaleznosci lintu
- [ ] Port `design/production/index.html` na strone glowna (CSS module + komponent kliencki)
- [ ] `app/api/lead/route.ts` + `app/lib/sheet-email.ts` + `app/lib/lead-hubspot.ts`
- [ ] `node scripts/hubspot-setup.mjs --apply` — dziesiec wlasciwosci kontaktu
- [ ] `bash scripts/purge-legacy.sh --apply` — 175 plikow legacy
- [ ] Naprawic `FinalCTA.tsx` (na `/api/lead`) i `Accelerators.tsx` (kafel radaru)
- [ ] `public/og.png` 1200x630 — bez tego link na LinkedInie jest martwy
- [ ] Strona `/stop` — stopka kazdego maila ja obiecuje
- [ ] Zmienne w srodowisku Production na Vercelu
- [ ] Polecenie „ship" — staging do repo, recznie, nie z crona
- [ ] Decyzja: cena na stronie vs stawki obecnych klientow
- [ ] Decyzja: dowod dla paid i search albo zawezenie obietnicy do retencji
- [ ] LinkedIn w `sameAs` w JSON-LD
