# STATUS.md - Aktualny Stan Projektu

**Projekt**: oleksiakconsulting.com
**Ostatnia Aktualizacja**: 2026-02-13
**Wersja**: Next.js 16.0.8 | React 19 | TypeScript 5.9
**URL Produkcji**: https://oleksiakconsulting.com

---

## Stan na 4 wrzesnia 2026 — nowa strona i petla dzienna

**PILNE — repozytorium jest publiczne.** Sprawdzone: klonuje sie anonimowo.
Do uniewaznienia i wygenerowania od nowa: Google Ads Developer Token (byl jawny
w tym pliku, wartosc usunieta, ale zostaje w historii i na GitHubie) oraz klucz
API w `generate-all-notion-assets.sh` i `generate-notion-assets-v2.sh`, linia 9
w obu. `.env.example` ma same wypelniacze — tam czysto.

**Nowa strona glowna i trzy narzedzia** leza w `design/`. Pelny brief i gotowy
prompt dla Claude Code: `HANDOFF-CC.md`. Commit stoi na galezi `tools/daily`,
lokalnie, niewypchniety.

**Codzienna petla** chodzi w chmurze jako zaplanowane zadanie i nie dotyka repo
ani produkcji — chmura nie ma prawa zapisu do tego repozytorium. Ocenia jedna
z czterech pozycji dziennie w trzech wymiarach (AI, uzytecznosc biznesowa, UX),
wprowadza najwyzej dwie zmiany i zapisuje do artefaktow roboczych. Wypuszczanie
na produkcje dzieje sie recznie, z Claude Code w terminalu.

**Otwarte decyzje:** cena na stronie (widelki 8–12 tys. netto, stala `PRICE`
w skrypcie) — sprawdzic, czy nie podcina obecnego klienta; dowod dla paid
i search albo zawezenie obietnicy; adres LinkedIna w JSON-LD; `og.png`
i strona `/stop`.

---

## 🚀 Funkcjonalności LIVE

| Funkcja | Status | Opis |
|---------|--------|------|
| **Main Website** | ✅ LIVE | Responsive, 90+ Lighthouse, SEO-optimized |
| **LAMA Audit (Free)** | ✅ LIVE | 6-kategoriowy audit strony → konsultacja |
| **LAMA Audit (Paid)** | 📦 ARCHIVED | Stripe Checkout €99 - tymczasowo wyłączone |
| **CRT Success Screen** | ✅ LIVE | Typewriter animation po audycie |
| **Follow-up Email** | ✅ READY | Template 3-dniowego retargetingu |
| **HubSpot Integration** | ✅ LIVE | Automatyczne tworzenie kontaktów |
| **GA4 Analytics** | ✅ LIVE | Via GTM (GTM-PTPCV5FD), event tracking + Web Vitals |
| **PDF Generation** | ✅ LIVE | 100+ stron raportu (tylko dla paid - backend ready) |
| **Blog + Admin Panel** | ✅ LIVE | Blog z Railway backend, panel administracyjny |
| **Auto-Publish** | ✅ LIVE | Strona produktowa z formularzem trial |
| **RADAR AI** | ✅ LIVE | Competitor Intelligence informational page |
| **GTM (Google Tag Manager)** | ✅ LIVE | Kontener GTM-PTPCV5FD z GA4 + Google Ads tags |
| **Consent Mode v2** | ✅ LIVE | GDPR-compliant, 31 krajów EEA domyślnie denied |
| **Schema.org JSON-LD** | ✅ LIVE | Organization, Person, ProfessionalService, WebSite |
| **Google Ads Remarketing** | ✅ LIVE | Tag remarketing + Conversion Linker w GTM |
| **Google Ads Conversion** | ✅ LIVE | form_submission_lead event → GA4 → Google Ads |

---

## 🔌 Integracje Aktywne

| Serwis | Status | Klucz Env | Notatki |
|--------|--------|-----------|---------|
| **Resend** | ✅ OK | `RESEND_API_KEY` | Email delivery |
| **HubSpot** | ✅ OK | `HUBSPOT_ACCESS_TOKEN` | CRM integration |
| **Anthropic Claude** | ✅ OK | `ANTHROPIC_API_KEY` | AI analysis (Clarity category) |
| **Google PageSpeed** | ✅ OK | - | Wbudowany (no key needed) |
| **Stripe** | ✅ OK | `STRIPE_SECRET_KEY` etc. | Payment processing |
| **Google Analytics 4** | ✅ OK | `G-WZWCGQLQ2Y` | Via GTM, event tracking |
| **Google Tag Manager** | ✅ OK | `GTM-PTPCV5FD` | 3 tagi: GA4, Remarketing, Conversion Linker |
| **Google Ads** | ✅ OK | `AW-17922704201` | Remarketing + Conversions via GTM |
| **Google Ads API** | ✅ OK | `GOOGLE_ADS_DEVELOPER_TOKEN` | Explorer Access (sufficient for our needs) |
| **LinkedIn Ads** | ⏳ PENDING | `LINKEDIN_CLIENT_ID` etc. | OAuth2 built, waiting for API access approval |

---

## 📊 Google Ads & Tracking Infrastructure

### Konta Google Ads

| Konto | ID | Typ | Status |
|-------|-----|-----|--------|
| Oleksiak Consulting MCC | 759-448-7243 | Manager | ✅ Active |
| Rafał Oleksiak Consulting | 544-648-7427 | Client (own) | ✅ Linked to MCC |

### GTM Tags (Version 2, Published)

| Tag | Typ | Trigger |
|-----|-----|---------|
| GA4 Configuration | Google Tag | All Pages |
| Google Ads Remarketing | Google Ads Remarketing | All Pages |
| Conversion Linker (Tag łączący konwersje) | Conversion Linker | All Pages |

### Google Ads API Access

- **OAuth2**: ✅ Configured (OAuth client `236619926081-...`)
- **Developer Token**: `<w .env.local — ZROTUJ, byl jawny w publicznym repo>`
- **Access Level**: ✅ Explorer Access (sufficient — 2,880 ops/day)
- **Basic Access**: ❌ Withdrawn — Explorer Access wystarczający dla naszego use case
- **Token Refresh**: ✅ Auto-refresh działa, tokeny w `.google-ads-token.json`

### LinkedIn Ads Integration

- **Developer App**: ✅ Created (Client ID: `77qsptldxbru79`)
- **Company Page**: ✅ Verified ("Oleksiak Consulting")
- **OAuth2 Routes**: ✅ Built (`/api/mcc/linkedin/auth/*`)
- **Token Management**: ✅ Built (`lib/mcc/linkedin-auth.ts`)
- **API Products**: ⏳ Waiting for approval:
  - Advertising API (requested)
  - Share on LinkedIn (requested)
- **First Campaign**: ✅ Live ("Thought Leader - Post Promotion - Feb 2026")
- **Payment**: ⚠️ Need to add payment card in LinkedIn Billing Center

### Consent Mode v2

- Defaults: `denied` dla ad_storage, analytics_storage, ad_personalization, ad_user_data
- 31 krajów EEA + UK automatycznie `denied`
- Reszta świata: `granted`
- Cookie consent banner aktualizuje consent mode dynamicznie

---

## 📂 Struktura API

```
app/api/
├── lama/
│   └── audit/route.ts          # Główny endpoint audytu (free + paid)
├── pdf-generator/route.ts      # Generowanie PDF (Vercel-safe)
├── send-email/route.ts         # Formularz kontaktowy
├── stripe/
│   ├── create-checkout/route.ts # Tworzenie sesji Stripe
│   └── webhook/route.ts         # Webhook dla płatności
└── mcc/                         # Marketing Command Center
    ├── auth/route.ts            # Google OAuth2 initiation
    ├── auth/callback/route.ts   # Google OAuth2 callback
    ├── auth/status/route.ts     # Google auth status
    ├── linkedin/
    │   ├── auth/route.ts        # LinkedIn OAuth2 initiation
    │   ├── auth/callback/route.ts # LinkedIn OAuth2 callback
    │   └── auth/status/route.ts # LinkedIn auth status
    ├── campaigns/route.ts       # Campaign management
    ├── creative/route.ts        # Ad creative generation
    ├── intelligence/route.ts    # Competitor monitoring
    ├── analytics/route.ts       # Cross-platform analytics
    └── platforms/
        ├── google/route.ts      # Google Ads connector
        ├── meta/route.ts        # Meta Ads connector (planned)
        └── linkedin/route.ts    # LinkedIn Ads connector

lib/mcc/                         # MCC shared code
├── google-auth.ts               # Google OAuth2 token management
├── linkedin-auth.ts             # LinkedIn OAuth2 token management
├── types.ts                     # MCC TypeScript interfaces
├── index.ts                     # Main MCC orchestrator
├── GOOGLE_ADS_OAUTH_SETUP.md    # Google OAuth2 setup guide
├── LINKEDIN_OAUTH_SETUP.md      # LinkedIn OAuth2 setup guide
├── platforms/
│   ├── types.ts                 # Platform connector interfaces
│   ├── index.ts                 # Platform registry
│   ├── google-ads.ts            # Google Ads platform connector
│   ├── meta-ads.ts              # Meta Ads connector (planned)
│   └── linkedin-ads.ts          # LinkedIn Ads connector
├── campaign/
│   ├── manager.ts               # Campaign CRUD operations
│   └── optimizer.ts             # Budget/bid optimization
├── creative/
│   └── copy-generator.ts        # AI-powered ad copy generation
├── intelligence/
│   └── competitor-monitor.ts    # Competitor tracking
└── analytics/
    └── aggregator.ts            # Cross-platform reporting
```

---

## 🎯 LAMA Audit - 6 Kategorii

| # | Kategoria | Analizator | Opis | Weight |
|---|-----------|------------|------|--------|
| 1 | **ATTRACT** | `visibility.ts` | SEO, meta tagi, robots.txt, sitemap | 20% |
| 2 | **ENGAGE** | `performance.ts` | PageSpeed, LCP, CLS, FCP | 20% |
| 3 | **CONVERT** | `conversion.ts` | Formularze, CTA, kontakt | 15% |
| 4 | **EXPAND** | `clarity.ts` | AI-powered content analysis (Claude) | 20% |
| 5 | **ANALYZE** | `trust.ts` | SSL, polityka prywatności, testimoniale | 15% |
| 6 | **RETAIN** | `engagement.ts` | Newsletter, social media | 10% |

**Całkowity Score:** 0-100 (weighted average)

---

## 📅 Ostatnie Zmiany

### 2026-02-13 ✅
- ✅ **LinkedIn Ads Campaign (Manual)**
  - Thought Leader Ad campaign live
  - Campaign: "Thought Leader - Post Promotion - Feb 2026"
  - Status: Aktywna
  - ⚠️ Needs: Payment card in LinkedIn Billing Center
- ✅ **LinkedIn Developer App**
  - App: "Oleksiak Consulting MCC" (Client ID: `77qsptldxbru79`)
  - Company Page verified
  - OAuth2 redirect URLs configured
  - Products requested: Advertising API, Share on LinkedIn
- ✅ **LinkedIn OAuth2 Infrastructure**
  - `lib/mcc/linkedin-auth.ts` — Token management (auto-refresh, file storage)
  - `app/api/mcc/linkedin/auth/route.ts` — OAuth2 initiation
  - `app/api/mcc/linkedin/auth/callback/route.ts` — OAuth2 callback
  - `app/api/mcc/linkedin/auth/status/route.ts` — Status check
  - `.linkedin-token.json` added to `.gitignore`
  - `lib/mcc/LINKEDIN_OAUTH_SETUP.md` — Setup documentation
- ✅ **Google Ads API — Explorer Access Sufficient**
  - After review: Explorer Access (2,880 ops/day) is enough for our use case
  - Withdrew Basic Access application
  - No need for account creation, user management, or billing APIs

### 2026-02-02 ✅
- ✅ **Kompletna infrastruktura trackingowa Google Ads**
  - Consent Mode v2 (GDPR, 31 krajów EEA)
  - GTM Container GTM-PTPCV5FD z 3 tagami (GA4, Remarketing, Conversion Linker)
  - Schema.org JSON-LD (Organization, Person, ProfessionalService, WebSite)
  - Preconnect do GTM/Google Ads domains
  - GoogleAnalytics.tsx → fallback mode (skip when GTM active)
  - **Files:** `ConsentMode.tsx`, `GTMScript.tsx`, `SchemaOrg.tsx`, `layout.tsx`, `GoogleAnalytics.tsx`
- ✅ **Google Ads Account Setup**
  - Konto Google Ads: 544-648-7427
  - Manager Account (MCC): 759-448-7243
  - GA4 linked z Google Ads
  - Conversion: `form_submission_lead` (Active)
  - Remarketing tag deployed via GTM
- ✅ **Google Ads API OAuth2 Flow**
  - OAuth2 consent screen + client credentials
  - 3 API routes: auth initiation, callback, status check
  - Token management: auto-refresh, file storage, in-memory cache
  - **Blocker:** Developer token = test access only. Basic Access application submitted.
  - **Files:** `app/api/mcc/auth/*`, `lib/mcc/google-auth.ts`
- ✅ **MCC Design Document** — wygenerowano dla Google Ads API Basic Access application
- ✅ **Deployed to Vercel** — env vars: NEXT_PUBLIC_GTM_ID, NEXT_PUBLIC_GOOGLE_ADS_ID

### 2026-01-17 → 2026-02-01
- ✅ **Blog + Admin Panel** — overview dashboard, post editor, topic suggestions, SEO scores
- ✅ **Auto-Publish product page** — /auto-publish z formularzem trial
- ✅ **RADAR AI Competitor Intelligence** — informational product page
- ✅ **Accelerators Section** — 3 tool cards on homepage

### 2026-01-17 ✅
- ✅ **Archived Paid Audit Feature** - tymczasowo wyłączono z UI
  - **Impact:** Strona gotowa do reklamowania z prostym flow: free audit → konsultacja

### 2026-01-07 ✅
- ✅ **PDF Cleanup: Usunięto placeholder/fake data z raportu**
  - **Impact:** PDF jest teraz 100% production-ready, bez wprowadzających w błąd danych

### 2025-12-21 ✅
- ✅ Naprawiono generowanie PDF (bezpośrednie wywołanie zamiast HTTP fetch)
- ✅ Utworzono dokumentację projektową

### 2025-12-20 ✅
- ✅ Naprawiono mobile email layout (single column + dark theme)

### 2025-12-11 ✅
- ✅ Zaimplementowano Stripe Paid Audit + Follow-up Email Template

### 2025-12-10 ✅
- ✅ Nawigacja: WHO/WHAT/HOW/WHY/WHEN, Next.js 16.0.8 security fix

### 2025-12-08 ✅
- ✅ CRT Success Screen z typewriter animation

---

## 🔄 Flow Użytkownika

### Free Audit Flow (Current - Active)
```
User wypełnia formularz → Zaznacza "Send audit" →
Backend scrape website → Claude AI analysis →
Email z wynikami audytu → HubSpot contact created →
CRT Success Screen (rekomendacja: zarezerwuj konsultację)
```

### Google Ads Conversion Flow
```
User trafia na stronę (z reklamy lub organicznie) →
GTM ładuje: GA4 + Remarketing + Conversion Linker →
User wypełnia formularz → form_submission_lead event →
GA4 → Google Ads Conversion (imported) →
Enhanced Conversion z hashed email
```

### Paid Audit Flow (📦 ARCHIVED - patrz PAID_AUDIT_ARCHIVE.md)
```
[WYŁĄCZONE] Backend infrastructure zachowany dla przyszłego przywrócenia.
```

---

## 📁 Pliki Kluczowe

### Frontend
```
app/
├── HomeClient.tsx                        # Główny klient strony
├── layout.tsx                            # Root layout (ConsentMode, GTM, SchemaOrg)
├── components/
│   ├── sections/
│   │   ├── Navbar.tsx                    # Navigation
│   │   ├── Hero.tsx                      # Hero section
│   │   ├── Services.tsx                  # Services showcase
│   │   ├── CaseStudiesSection.tsx        # Case studies
│   │   ├── ProcessTimeline.tsx           # How we work
│   │   ├── FinalCTA.tsx                  # Formularz z LAMA audit + enhanced conversions
│   │   └── Footer.tsx                    # Footer
│   ├── ui/
│   │   ├── FinalSuccessScreen.tsx        # CRT animation
│   │   ├── CookieConsent.tsx             # GDPR cookie consent banner
│   │   ├── Logo.tsx                      # Logo component
│   │   └── CompanyCarousel.tsx           # Company logos
│   ├── ConsentMode.tsx                   # Google Consent Mode v2 defaults
│   ├── GTMScript.tsx                     # GTM container script + noscript
│   ├── SchemaOrg.tsx                     # 4x JSON-LD structured data
│   └── GoogleAnalytics.tsx               # GA4 fallback (skip when GTM active)
├── blog/                                 # Blog pages
├── admin/                                # Admin panel
└── auto-publish/                         # Auto-Publish product page
```

### Backend
```
app/api/
├── lama/audit/route.ts                   # Core audit logic
├── pdf-generator/route.ts                # PDF generation
├── stripe/                               # Payment processing
└── mcc/                                  # Marketing Command Center
    ├── auth/                             # OAuth2 flow (Google Ads API)
    └── platforms/                        # Ad platform connectors

lib/
├── lama/                                 # Audit system
│   ├── analyzers/                        # 6 kategorii audytu
│   ├── email-template.ts                 # HTML email template
│   └── hubspot.ts                        # HubSpot integration
├── mcc/                                  # MCC shared code
│   ├── google-auth.ts                    # OAuth2 token management
│   ├── platforms/                        # Platform connectors
│   ├── campaign/                         # Campaign management
│   ├── creative/                         # AI ad copy generation
│   ├── intelligence/                     # Competitor monitoring
│   └── analytics/                        # Cross-platform reporting
└── stripe.ts                             # Stripe client
```

### Konfiguracja
```
CLAUDE.md              # Standardy kodowania
ROADMAP.md             # Plan rozwoju + decisions
PROJECT_SUMMARY.md     # Pełna historia implementacji
STATUS.md              # Ten plik - current state
```

---

## 🚫 CURRENT BLOCKERS & ISSUES

### Active Blockers:

**[2026-02-13] LinkedIn Advertising API — Access Pending**
- **Issue:** OAuth2 infrastructure built, but API products not yet approved
- **Root Cause:** LinkedIn requires review for Advertising API access
- **Workaround:** Manual campaign management via Campaign Manager UI
- **Resolution:** Wait for LinkedIn approval (typically 1-3 business days)
- **Impact:** Can't programmatically manage campaigns until approval

**[2026-02-13] LinkedIn Ads — Payment Required**
- **Issue:** Campaign is "Aktywna" but won't actually run without payment method
- **Root Cause:** No payment card in LinkedIn Billing Center
- **Resolution:** Add payment card at https://www.linkedin.com/campaignmanager
- **Impact:** Campaign won't deliver impressions until payment added

**[2026-02-02] Remarketing Audience — Zbyt mała**
- **Issue:** Remarketing audience wymaga 1000+ użytkowników
- **Root Cause:** Tag remarketing dopiero zainstalowany, brak wystarczającej ilości danych
- **Resolution:** Automatycznie się rozwiąże wraz ze wzrostem ruchu
- **Impact:** Nie można targetować audience remarketing w kampaniach (jeszcze)

### Recently Resolved:

**[2026-02-13] Google Ads API — Basic Access Not Needed**
- **Issue:** Applied for Basic Access, but Google asked for justification
- **Root Cause:** Explorer Access (2,880 ops/day) is actually sufficient for our use case
- **Solution:** Withdrew Basic Access application, will use Explorer Access
- **Status:** ✅ Resolved (no longer a blocker)

**[2026-02-02] GTM Preview "nie znaleziono elementu"**
- **Issue:** GTM Preview mode nie wykrywał kontenera
- **Root Cause:** Prawdopodobnie ad blocker
- **Solution:** Zweryfikowano via curl że GTM jest poprawnie osadzony w HTML
- **Status:** ✅ Resolved (GTM działa, opublikowano Version 2)

**[2026-02-02] OAuth "Dostęp zablokowany"**
- **Issue:** OAuth consent screen blokował autoryzację
- **Root Cause:** Email nie był dodany jako test user
- **Solution:** Dodano `rafaloleksiakconsulting@gmail.com` jako test user w Google Cloud Console
- **Status:** ✅ Resolved

---

## 📋 TO-DO (Priorytetyzowane)

### 🔴 HIGH PRIORITY

- [x] **LinkedIn Ads Integration** — ✅ DONE
  - [x] LinkedIn Developer App created (Client ID: `77qsptldxbru79`)
  - [x] OAuth2 flow built (`/api/mcc/linkedin/auth/*`)
  - [x] Token management (`lib/mcc/linkedin-auth.ts`)
  - [x] First campaign live ("Thought Leader - Post Promotion - Feb 2026")
  - [ ] **Waiting:** LinkedIn API products approval
  - [ ] **Action needed:** Add payment card to LinkedIn Billing Center

- [ ] **Google Ads — Pierwsza kampania Search**
  - ✅ Explorer Access sufficient (2,880 ops/day)
  - [ ] Keyword research dla CRM consulting
  - [ ] Ustawienie campaign budgets
  - [ ] Ad copy creation
  - Cel: Lead generation via Google Search

- [ ] **Automatyczny 3-day follow-up email**
  - Implementacja: Klaviyo lub cron job
  - Cel: Zwiększyć conversion rate z free audit → konsultacja

### 🟡 MEDIUM PRIORITY

- [ ] **Analytics Enhancement**
  - [ ] Hotjar integration (heatmaps, recordings)
  - [ ] Funnel analysis (form start → completion)
  - [ ] A/B testing setup (hero section variants)

- [ ] **Error Boundaries**
  - [ ] app/error.tsx (global error boundary)
  - [ ] Graceful error handling dla API failures

- [ ] **Case Studies Expansion**
  - [ ] Dedicated pages dla każdego case study
  - [ ] Before/after metrics visualization

### 🟢 LOW PRIORITY

- [ ] **Multi-language Support** — Polish + English
- [ ] **Chatbot Integration** — AI-powered FAQ
- [ ] **White-label LAMA** — dla agencji

---

## 💻 Komendy Dev

### Development
```bash
npm run dev           # Start dev server (Turbopack)
npm run build         # Production build
npm run lint          # ESLint check
npm run type-check    # TypeScript check
```

### Git
```bash
git log --oneline -10 # Recent commits
git status            # Check changes
git diff              # See unstaged changes
```

### Stripe (Local Testing)
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
# Test webhook locally
```

### Vercel
```bash
vercel dev            # Local Vercel environment
vercel logs           # Production logs
vercel env pull       # Pull environment variables
```

---

## 📊 Metryki Sukcesu (Do Trackowania)

### Website Performance
- **Mobile PageSpeed:** 90+ ✅
- **Desktop PageSpeed:** 95+ ✅
- **Core Web Vitals:**
  - LCP: <2.5s ✅
  - FID: <100ms ✅
  - CLS: <0.1 ✅

### LAMA System (Docelowe)
- **Audits/miesiąc:** Target 1000
- **Email open rate:** Target >30%
- **Email click rate:** Target >15%
- **Free → Paid conversion:** Target >10%
- **Paid → Consultation:** Target >5%

### Business Metrics (Do Implementacji)
- Monthly visitors: [To be tracked]
- Bounce rate: [To be tracked]
- Average session duration: [To be tracked]
- Form submissions: [To be tracked]
- Consultation bookings: [To be tracked]

---

## 🔐 Environment Variables

### Production (Vercel)
```bash
# Core Services
RESEND_API_KEY=re_...
HUBSPOT_ACCESS_TOKEN=pat-eu1-...
ANTHROPIC_API_KEY=sk-ant-...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...

# Tracking & Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-WZWCGQLQ2Y
NEXT_PUBLIC_GTM_ID=GTM-PTPCV5FD
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-17922704201

# Google Ads API (server-side only)
GOOGLE_OAUTH_CLIENT_ID=236619926081-...
GOOGLE_OAUTH_CLIENT_SECRET=GOCSPX-...
GOOGLE_ADS_DEVELOPER_TOKEN=<w .env.local — token zrotowany>
GOOGLE_ADS_MANAGER_CUSTOMER_ID=759-448-7243
GOOGLE_ADS_CUSTOMER_ID=544-648-7427
```

### Development (Local)
```bash
# Jak production + ewentualne test keys dla Stripe
# Google Ads tokeny w .google-ads-token.json (gitignored)
```

---

## 📞 Kontakt

- **Rafał Oleksiak** - właściciel projektu
- **Email**: rafaloleksiakconsulting@gmail.com
- **Calendly**: https://calendly.com/rafal-oleksiak/30min

---

## 🎓 Lessons Learned

### Technical
1. **Vercel HTTP Limits** - Internal API calls don't work, use direct function imports
2. **Mobile Email** - Always test on actual mobile devices, not just desktop preview
3. **Lazy Loading** - Can break navigation if sections aren't in DOM
4. **PDF Generation** - Use server-side libraries, not browser-based solutions
5. **Google Ads API** - Test access tokens nie działają z production accounts. Trzeba Basic Access.
6. **GTM Polish UI** - "Conversion Linker" to po polsku "Tag łączący konwersje"
7. **OAuth2 file-based tokens** - Prosty pattern bez zewnętrznych bibliotek, wystarczy fetch()

### Business
1. **"Zawsze syntezuj"** - Deliver actionable solutions, not just analysis
2. **ROI-driven** - Every feature should have clear business impact
3. **Mobile-first** - 60%+ traffic expected from mobile
4. **Fast iteration** - Better to ship and iterate than perfect on first try
5. **Tracking first** - Zainstaluj tracking zanim odpalasz kampanie reklamowe

---

**Uwaga**: Ten plik jest źródłem prawdy o aktualnym stanie projektu. Aktualizuj go po każdej większej zmianie lub na końcu każdej sesji.

**Następna aktualizacja:** Po LinkedIn API approval lub pierwszej Google Ads Search campaign
