# STATUS.md - Aktualny Stan Projektu

**Projekt**: oleksiakconsulting.com
**Ostatnia Aktualizacja**: 2026-09-09
**Wersja**: Next.js 16.0.8 | React 19 | TypeScript 5.9
**URL Produkcji**: https://oleksiakconsulting.com

---

## Stan na 9 wrzesnia 2026 — nowa strona NA PRODUKCJI

Wypuszczona na produkcje 9 wrzesnia (`vercel deploy --prod` z `feature/new-site`).
oleksiakconsulting.com serwuje nowa strone; www przekierowuje na apex 307. Stara strona, LAMA, RADAR, MCC, Stripe,
panel admina i Auto-Publish sa **wyciete** — 203 pliki, ~65 900 linii. Zostaje
strona glowna "The Audit", blog, `/privacy` i `/stop`.

**PILNE — repozytorium jest publiczne** i klonuje sie anonimowo. Do uniewaznienia:
Google Ads Developer Token (jawny w historii i w `STATUS.md` w HEAD) oraz klucz API
w `generate-all-notion-assets.sh` i `generate-notion-assets-v2.sh`, linia 9 w obu.
Push jest wstrzymany do czasu rotacji.

### Zrobione (zadania 1-3, 5, 6, 8 z HANDOFF-CC.md)

| Zadanie | Stan |
|---|---|
| 1. Zaleznosci | zod 4.5.4, flat config ESLint 9 |
| 2. Port strony glownej | `app/AuditClient.tsx` + `app/audit-runtime.js` + `app/audit.css` |
| 3. `/api/lead` + helpery | walidacja zodem, origin check, limiter |
| 5. Wyciecie starego kodu | 203 pliki, trasy 24 → 10 |
| 6. og.png, `/stop`, banner zgody, sprzatanie | lint na zerze |
| 8. `npm run ship` | `scripts/ship.mjs` + `scripts/ship-compare.mjs` |

Bramka po kazdym etapie: `npm run build`, `npx tsc --noEmit`, `npm run lint`
(zero bledow), `node design/qa.js <url> --scroll` na `/` i `/stop`, oraz
`node scripts/ship-compare.mjs` — porownanie stylow obliczonych wobec zrodla.

### STAN ZADAN 4 i 7

**Zadanie 4 — HubSpot: ZROBIONE 8 wrzesnia 2026.** Dziesiec wlasciwosci kontaktu
zalozonych przez `node scripts/hubspot-setup.mjs --apply`, zweryfikowanych
odczytem z `/crm/v3/properties/contacts`. Drugi przebieg: 0 utworzonych,
10 pominietych — skrypt jest idempotentny.

Klucz: **klucz uslugi** (service key, funkcja w wersji beta), nie aplikacja
prywatna. Nazwa `ROC_CLAUDE_CODE`, portal **149284039**, region `eu1`.
Panel: Settings → Integracje → Klucze uslugi. Ma opcje `Rotacja`.

Test sciezki szczesliwej end-to-end przeszedl: HTTP 200, kontakt `863193178318`,
**10/10 wlasciwosci wypelnionych poprawnie**, w tym atrybucja first touch
(`first_touch_source=linkedin`, `first_touch_campaign=e2e-test`) z parametrow UTM.
Oba maile wyszly, zero bledow w logu.

**Dlaczego stary klucz nie dzialal — ustalone.** Nowy portal ma numer 149284039
i w chwili podlaczenia mial **dwa kontakty, oba przykladowe `@hubspot.com`,
utworzone tego samego dnia**. To jest swieze, puste konto. Stary token nalezal
wiec do **innego portalu**, do ktorego nie ma juz dostepu — stad 401
nieodrozniulny od tokena calkowicie zmyslonego. Sprawdzone tez: stary token
**nigdy nie byl commitowany** (0 trafien w calej historii gita przy szukaniu
dokladnej wartosci), wiec wyciek i automatyczne uniewaznienie odpadaja.

**Konsekwencja dla danych: leadow ze starej strony NIE MA w tym portalu.**
Jesli gdzies sa, to w tamtym, starym koncie. Jedyny pewny rejestr zgloszen
to skrzynka `TO_EMAIL` — stara strona polykala blad HubSpota po cichu
(`console.error` z komentarzem „don't fail the request"), wiec odwiedzajacy
widzial sukces, mail wychodzil, a kontakt nie powstawal.

**Klucz na Vercelu: PODMIENIONY 8 wrzesnia.** Nowy klucz uslugi jest we
wszystkich trzech srodowiskach (Production, Preview, Development). Zweryfikowane
nie deklaracja, tylko pobraniem kazdego srodowiska i uderzeniem pobrana wartoscia
w `/account-info/v3/details` — wszystkie trzy zwracaja 200.

**UWAGA: zmiana zmiennej na Vercelu nie dziala na juz uruchomionym wdrozeniu.**
Wchodzi dopiero przy nastepnym buildzie. Do czasu redeploya produkcja nadal
chodzi na starym kluczu i nadal po cichu nie zapisuje kontaktow.

**Zadanie 7 — zmienne na Vercelu: ZROBIONE.** Sprawdzone 8 wrzesnia 2026 przez
`vercel env ls production`. Wszystkie cztery wymagane sa ustawione w srodowisku
Production: `RESEND_API_KEY`, `FROM_EMAIL`, `TO_EMAIL`, `HUBSPOT_API_KEY`.
Dolozone 8 wrzesnia: `NEXT_PUBLIC_SITE_URL` = https://oleksiakconsulting.com (Production).
Opcjonalnego `LEAD_MAX_PER_HOUR` nie ma i nie musi byc:
origin check porownuje `origin.host` z `host` z zadania, wiec produkcja i deploye
preview dzialaja bez nich, a limiter stoi na domyslnej piatce.

Wyczyszczone 8 wrzesnia z Production, bo kod ich uzywajacy juz nie istnieje:
`STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`, `STRIPE_WEBHOOK_SECRET`, `POSTGRES_URL`,
`RADAR_BASE_URL`. Zostawione swiadomie do uzytku poza tym repo:
`SERPER_API_KEY`, `GOOGLE_PAGESPEED_API_KEY`.

**Test sciezki szczesliwej: przeszedl 8 wrzesnia** — szczegoly przy zadaniu 4.

---

## NA JUTRO

### 1. Dowody pod RTB maja nazwac dyscypline (zlecone 9 wrzesnia)

Cztery dowody pod blokiem zakresu sa dzis **retencyjne**, a obietnica nad nimi
obejmuje paid i search. Kazdy dowod ma nazwac dyscypline, ktora realnie
potwierdza — **bez przyrostu slow**. Stan wyjsciowy: 1582 slowa widoczne.

Dzis brzmia tak:

| Dowod | Tresc | Co realnie potwierdza |
|---|---|---|
| Allegro | FMCG and recurring team, five data scientists, next-pack prediction. CRM from 0.5% to 12% of revenue. | CRM + model danych |
| mBank / mOkazje | Retention strategy across consumables. | retencja |
| Genactiv | Colostrum, category leader. Storefront, search, lifecycle. Current. | storefront + search + lifecycle |
| Booksy | Same arithmetic where the pack is an appointment. | przenoszalnosc modelu |

Luka: **paid** nie ma zadnego dowodu, a stoi jako pierwsza pozycja w bloku
zakresu. Do rozstrzygniecia z Rafalem, czy jest czym ja obsadzic.

Edycja idzie przez `design/production/index.html`, potem `npm run ship`.
Bilans slow musi wyjsc zero; jesli nowa tresc potrzebuje miejsca, tnij
w opisach dowodow, nie w mechanizmach.

### 2. Stare JSON-LD na produkcji — ZNALEZIONE 9 wrzesnia, NIENAPRAWIONE

Strona wizualnie jest nowa, ale **trzy z czterech encji danych strukturalnych
opisuja stary biznes**. Google to czyta.

`app/components/SchemaOrg.tsx` renderuje `Organization`, `ProfessionalService`
i `WebSite` z trescia sprzed przepozycjonowania:

- `Organization.knowsAbout` = `["Ecommerce Conversion Optimization","CRM Strategy",
  "Marketing Automation","Customer Retention","UX Optimization","Traffic Quality",
  "A/B Testing","Data Analytics"]` — stare pozycjonowanie, zero FMCG.
- `ProfessionalService` (linia ~86) oferuje **`"Free Website Audit"` z opisem
  „AI-powered LAMA audit analyzing 6 key areas"**. LAMA zostala usunieta
  w zadaniu 5, a `/api/lama/audit` zwraca 404. To jest **obietnica produktu,
  ktory nie istnieje**, wystawiona w danych strukturalnych.
- `WebSite.description` = „Ecommerce conversion & CRM consulting".

Do tego `app/layout.tsx` (linie 35, 42, 51) ma domyslny tytul
„Rafał Oleksiak — Ecommerce Conversion & CRM Consultant". Na `/` jest
nadpisany przez `app/page.tsx`, ale zostaje jako zapasowy dla pozostalych tras.

Encja `Person` ze strony glownej jest poprawna i zgodna z nowa rama.

Naprawa to zmiana tresci marketingowej, wiec czeka na decyzje Rafala.
Priorytet: **usuniecie oferty „Free Website Audit" jest pilniejsze niz
przepisanie pozycjonowania** — obietnica nieistniejacego produktu w rich
results szkodzi bardziej niz nieaktualny opis.

### Otwarte decyzje tresciowe, nie techniczne

Cena na stronie (widelki 8-12 tys. netto, stala `PRICE` w `app/audit-runtime.js`)
— sprawdzic, czy nie podcina obecnego klienta. RTB mowi wylacznie o retencji,
a plan obiecuje tez paid i search: albo dosypac dowod, albo zawezic obietnice.

---

## Funkcjonalnosci

| Funkcja | Status | Opis |
|---------|--------|------|
| Strona glowna "The Audit" | **NA PRODUKCJI** | FMCG, dwa ekrany, formularz do `/api/lead` |
| Blog | dziala | Railway backend, filtr `agent_id` + off-topic |
| `/privacy` | dziala | |
| `/stop` | **NA PRODUKCJI** | wypis, powiadomienie do wlasciciela, `noindex` |
| GTM + Consent Mode v2 | dziala | GTM-PTPCV5FD, domyslnie `denied` dla EOG |
| Banner zgody | **NA PRODUKCJI** | paleta strony, rezerwuje wlasna wysokosc |
| Schema.org JSON-LD | dziala | Organization, ProfessionalService, WebSite + jedna encja Person ze strony |
| LAMA, RADAR, MCC, Stripe, Auto-Publish, panel admina | **USUNIETE** | zadanie 5 |

---

## Integracje

| Serwis | Status | Klucz Env | Notatki |
|--------|--------|-----------|---------|
| Resend | uzywany | `RESEND_API_KEY`, `FROM_EMAIL`, `TO_EMAIL` | `/api/lead` i `/api/stop` |
| HubSpot | dziala | `HUBSPOT_API_KEY` | klucz uslugi ROC_CLAUDE_CODE, portal 149284039; wszystkie 3 srodowiska Vercela zweryfikowane (200) |
| GA4 / GTM / Google Ads | dziala | `NEXT_PUBLIC_*` | przez GTM |
| Anthropic, Stripe, Neon, Google Ads API, LinkedIn Ads | **odinstalowane** | — | razem z kodem, ktory ich uzywal |

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

## /tool — ZROBIONE 13.09.2026

Trasa stoi, bramka zielona na `/`, `/stop` i `/tool` (9 szerokości), `ship-compare`
bez różnic. Mechanika przeniesienia opisana w `CLAUDE.md` → „`/tool` — druga strona
przenoszona ze źródła". Oba warunki z poprzedniej notatki zamknięte:

1. `ship-tool.mjs --yes` przed buildem — zapisane w `CLAUDE.md`, w bloku komend
   i w opisie trasy.
2. Archivo zhostowany lokalnie: `public/fonts/archivo-400-800-latin{,-ext}.woff2`,
   font zmienny, jeden plik na podzbiór na cały zakres 400–800. Sprawdzone
   przechwyceniem ruchu: **zero żądań do Google** na `/tool`, a
   `document.fonts.check('800 58px Archivo')` daje `true`.

`ANTHROPIC_MODEL` stoi teraz na `claude-opus-5` (aktualne ID z dokumentacji; bez
sufiksu daty). `max_tokens` podniesione 2000 → 4000, bo na tym modelu myślenie jest
domyślnie włączone i dzieli sufit z odpowiedzią. `ANTHROPIC_API_KEY` ustawiony
w Vercelu dla Production i Preview; w repo go nie ma.

### Co zostaje otwarte

- **Konto Anthropic nie ma środków.** `POST /api/label` z prawidłowym kluczem wraca
  `{"code":"refused"}` / 502, bo API odpowiada `Your credit balance is too low`.
  Ścieżki bez klucza są sprawdzone i działają; **ścieżki ze szczęśliwym zakończeniem
  nie dało się zweryfikować end-to-end** — kontrola środków w API biegnie PRZED
  walidacją ciała żądania, więc żadnej odpowiedzi 200 nie da się dziś uzyskać.
  Po doładowaniu konta trzeba to przejść ponownie.
- **Sonda `GET /api/label` sprawdza tylko obecność klucza, nie środki.** Skutek na
  produkcji: panele AI się pokażą i każde kliknięcie zwróci błąd. Gdyby to miało
  przeszkadzać, sondę trzeba zmienić na realny ping — kosztem tokenów przy każdym
  wejściu na `/tool`.
- **Limiter na IP nadal siedzi w pamięci procesu.** Warunek z briefu („jeżeli strona
  ma ruch") nie jest spełniony: GA4 za ostatnie 28 dni pokazuje **1 sesję** (12.09,
  najpewniej test instalacji). KV/Upstash to nowa usługa i nowy sekret — do zrobienia,
  gdy ruch faktycznie ruszy.
- **Kontrast w źródle narzędzia.** `.ai .hd b` szedł `var(--acc)`, co przy 10.5px daje
  4.45:1. Poprawione w `tool-index.html` na `#B53707` (ten sam wariant, którego plik
  już używa dla daty w dzienniku). Umknęło, bo panele AI chowają się bez klucza —
  **bramkę na `/tool` trzeba puszczać z ustawionym `ANTHROPIC_API_KEY`.**
  Przy nowej wersji narzędzia z pętli ta poprawka przepadnie i bramka znów zaświeci
  na czerwono — to jest zamierzone, ma się o siebie upomnieć.
