# Marketing Command Center (MCC) - Architektura

## Wizja

MCC to centralny hub decyzji i akcji marketingowych, z Claude jako AI agentem podejmującym decyzje.
System łączy się z platformami reklamowymi (Google Ads, Meta Ads, LinkedIn Ads) i zarządza kampaniami,
optymalizacją, tworzeniem kreacji i monitoringiem konkurencji z jednego miejsca.

## Architektura Systemu

```
┌──────────────────────────────────────────────────────────────────┐
│                     ADMIN UI (Next.js)                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ Dashboard │ │ Kampanie │ │ Kreacje  │ │ Konkur.  │           │
│  │           │ │          │ │    AI    │ │ Monitor  │           │
│  └─────┬────┘ └─────┬────┘ └─────┬────┘ └─────┬────┘           │
│        └──────────┬──┴──────────┬─┴────────────┘                │
│                   ▼             ▼                                │
│            ┌─────────────────────────┐                          │
│            │      API Routes         │                          │
│            │  /api/mcc/*             │                          │
│            └────────┬────────────────┘                          │
└─────────────────────┼────────────────────────────────────────────┘
                      │
┌─────────────────────┼────────────────────────────────────────────┐
│                     ▼         LIB/MCC ENGINE                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    CAMPAIGN MANAGER                       │   │
│  │  • Tworzenie kampanii   • Lifecycle (launch/pause/stop)  │   │
│  │  • Budget management    • Metrics sync                   │   │
│  └───────────────────────────┬──────────────────────────────┘   │
│                              │                                   │
│  ┌───────────────────────────┼──────────────────────────────┐   │
│  │                   OPTIMIZER                               │   │
│  │  • Rule engine       • Budget efficiency check           │   │
│  │  • Creative perf     • Targeting opportunities           │   │
│  │  • Bid strategy      • Auto-apply recommendations        │   │
│  └───────────────────────────┬──────────────────────────────┘   │
│                              │                                   │
│  ┌─────────┐  ┌─────────┐  ┌┴────────┐  ┌────────────────┐    │
│  │ CREATIVE │  │ INTELL. │  │ANALYTICS│  │  PLATFORM      │    │
│  │ ENGINE   │  │ MODULE  │  │ AGGR.   │  │  REGISTRY      │    │
│  │          │  │         │  │         │  │                │    │
│  │ Claude   │  │ Scraper │  │ Cross-  │  │ ┌────────────┐│    │
│  │ Sonnet   │  │ AI      │  │ platf.  │  │ │Google Ads  ││    │
│  │ Copy Gen │  │ Alerts  │  │ metrics │  │ │Meta Ads    ││    │
│  │ A/B Test │  │ Strategy│  │ compare │  │ │LinkedIn    ││    │
│  └─────────┘  └─────────┘  └─────────┘  │ └────────────┘│    │
│                                           └────────┬───────┘    │
└───────────────────────────────────────────────────┬─────────────┘
                                                    │
                      ┌─────────────────────────────┼─────┐
                      │      EXTERNAL APIs                 │
                      │  • Google Ads API v18               │
                      │  • Meta Marketing API v21.0         │
                      │  • LinkedIn Marketing API v2        │
                      │  • Anthropic Claude (copy gen)      │
                      └────────────────────────────────────┘
```

## Struktura Plików

```
lib/mcc/                                    # Core engine
├── index.ts                                # Re-exports
├── types.ts                                # 50+ TypeScript interfaces
├── platforms/
│   ├── index.ts                            # Platform registry (singleton)
│   ├── types.ts                            # PlatformConnector interface
│   ├── google-ads.ts                       # Google Ads API v18 connector
│   ├── meta-ads.ts                         # Meta Marketing API v21 connector
│   └── linkedin-ads.ts                     # LinkedIn Marketing API v2 connector
├── campaign/
│   ├── manager.ts                          # Campaign lifecycle management
│   └── optimizer.ts                        # AI-driven optimization engine
├── creative/
│   └── copy-generator.ts                   # Claude-powered ad copy generation
├── intelligence/
│   └── competitor-monitor.ts               # Competitor scraping + AI analysis
└── analytics/
    └── aggregator.ts                       # Cross-platform metrics aggregation

app/api/mcc/                                # REST API endpoints
├── campaigns/route.ts                      # Campaign CRUD + lifecycle actions
├── creative/route.ts                       # AI copy generation
├── intelligence/route.ts                   # Competitor management + analysis
├── analytics/route.ts                      # Cross-platform metrics
└── platforms/
    ├── google/route.ts                     # Google Ads connection
    ├── meta/route.ts                       # Meta Ads connection
    └── linkedin/route.ts                   # LinkedIn Ads connection

app/admin/(authenticated)/[projectId]/mcc/  # Admin UI
└── page.tsx                                # Full MCC dashboard (tabbed)
```

## Moduły

### 1. Platform Connectors (`lib/mcc/platforms/`)

Każda platforma implementuje interfejs `PlatformConnector`:

```typescript
interface PlatformConnector {
  connect(credentials): Promise<PlatformConnection>
  createCampaign(input): Promise<string>
  setCampaignStatus(id, status): Promise<void>
  getCampaignMetrics(id, period): Promise<CampaignMetrics>
  createCreative(campaignId, creative): Promise<string>
  getAudiences(): Promise<AudienceTarget[]>
  // ... (13 metod)
}
```

**Status:**
- Google Ads - pełna implementacja (REST API v18)
- Meta Ads - pełna implementacja (Graph API v21.0)
- LinkedIn Ads - pełna implementacja (REST API v2)

### 2. Campaign Manager (`lib/mcc/campaign/manager.ts`)

Zarządza cyklem życia kampanii cross-platformowo:

- `createCampaign()` → tworzy kampanię w MCC (draft)
- `launchCampaign()` → pushuje na wszystkie wybrane platformy
- `pauseCampaign()` / `resumeCampaign()` → zmiana statusu
- `adjustBudget()` → realokacja budżetu między platformami
- `syncCampaignMetrics()` → pobiera metryki ze wszystkich platform

### 3. Optimizer (`lib/mcc/campaign/optimizer.ts`)

AI-driven engine optymalizacji:

**Automatyczne sprawdzenia:**
- Budget efficiency (ROAS > 3x → zwiększ, < 0.5x → pauza)
- Creative performance (nski CTR → odśwież, top creative → skaluj)
- Targeting opportunities (wysoka konwersja + niski reach → rozszerz)
- Bid strategy (>30 konwersji → przejdź na auto-bidding)

**Rule engine:**
- Definiowalne reguły z warunkami i cooldownem
- Auto-apply dla bezpiecznych akcji
- Wymagaj approval dla ryzykownych zmian

### 4. Creative Engine (`lib/mcc/creative/copy-generator.ts`)

Claude-powered generator kreacji reklamowych:

- `generateCopy()` → 3 warianty z reasoning i QS estimate
- `generateVariants()` → A/B test variants (emocjonalny/racjonalny/pilny)
- `optimizeCopy()` → optymalizacja na podstawie metryk

**Respektuje limity platform:**
- Google Ads: 30 znaków nagłówek, 90 znaków opis
- Meta Ads: 40/125 znaków
- LinkedIn Ads: 70/600 znaków

### 5. Competitor Intelligence (`lib/mcc/intelligence/competitor-monitor.ts`)

Monitoring i analiza konkurencji:

- Website scraping (Cheerio) → messaging, CTA, positioning
- Meta Ad Library search → aktywne reklamy konkurenta
- Claude AI analysis → strengths/weaknesses/opportunities
- Change detection → alerty o nowych kampaniach/zmianach
- Strategic recommendations → actionable insights

### 6. Analytics Aggregator (`lib/mcc/analytics/aggregator.ts`)

Zunifikowany widok metrryk:

- `getCrossPlatformMetrics()` → blended CPA/ROAS, platform breakdown
- `comparePlatforms()` → wydajność per platforma z rekomendacjami
- `getBudgetInsights()` → utilizacja budżetu i optymalizacja
- `getPerformanceTrend()` → time series dla dashboardu

## Zmienne Środowiskowe (nowe)

```env
# Google Ads
GOOGLE_ADS_DEVELOPER_TOKEN=        # Google Ads API developer token
GOOGLE_ADS_CLIENT_ID=              # OAuth client ID
GOOGLE_ADS_CLIENT_SECRET=          # OAuth client secret
GOOGLE_ADS_REFRESH_TOKEN=          # OAuth refresh token
GOOGLE_ADS_CUSTOMER_ID=            # Target customer ID

# Meta Ads
META_ADS_ACCESS_TOKEN=             # Long-lived access token
META_ADS_AD_ACCOUNT_ID=            # Ad account ID (without act_ prefix)
META_ADS_APP_ID=                   # Facebook App ID
META_ADS_APP_SECRET=               # Facebook App Secret
META_ADS_PAGE_ID=                  # Facebook Page ID
META_ADS_PIXEL_ID=                 # Facebook Pixel ID

# LinkedIn Ads
LINKEDIN_ACCESS_TOKEN=             # OAuth access token
LINKEDIN_AD_ACCOUNT_ID=            # Ad account ID
LINKEDIN_ORGANIZATION_ID=         # Company page ID

# Already configured
ANTHROPIC_API_KEY=                 # Claude for copy generation + intelligence
```

## API Endpoints

| Method | Endpoint | Opis |
|--------|----------|------|
| GET | `/api/mcc/campaigns` | Lista kampanii (filtry: status, platform, search) |
| POST | `/api/mcc/campaigns` | Akcje: create, launch, pause, resume, optimize |
| DELETE | `/api/mcc/campaigns?id=` | Usuń kampanię |
| POST | `/api/mcc/creative` | Akcje: generate, variants, optimize |
| GET | `/api/mcc/intelligence` | Competitors, insights, alerts, recommendations |
| POST | `/api/mcc/intelligence` | Akcje: add/remove competitor, analyze, acknowledge |
| GET | `/api/mcc/analytics` | Overview, trend, comparison, budget, connections |
| POST | `/api/mcc/platforms/google` | Google Ads: connect, disconnect, keywords |
| POST | `/api/mcc/platforms/meta` | Meta Ads: connect, disconnect, audiences |
| POST | `/api/mcc/platforms/linkedin` | LinkedIn: connect, disconnect, audiences |

## Roadmap Rozwoju

### Phase 1 - Foundation (DONE)
- [x] Core types (50+ interfaces)
- [x] Platform connectors (Google, Meta, LinkedIn)
- [x] Campaign manager + optimizer
- [x] Creative engine (Claude copy gen)
- [x] Competitor intelligence
- [x] Analytics aggregator
- [x] API routes
- [x] Admin UI (tabbed dashboard)

### Phase 2 - Integracje API
- [ ] Podłączyć prawdziwe konta Google Ads
- [ ] Podłączyć Meta Ads (Facebook/Instagram)
- [ ] Podłączyć LinkedIn Ads
- [ ] OAuth flow dla każdej platformy
- [ ] Persistent storage (database zamiast in-memory)

### Phase 3 - Zaawansowana optymalizacja
- [ ] Automatyczny day-parting na podstawie danych
- [ ] Predictive budget allocation (ML)
- [ ] Automated A/B testing framework
- [ ] Real-time alerting (webhooks)
- [ ] Scheduled optimization runs (cron)

### Phase 4 - Kreacje
- [ ] Image generation (DALL-E / Midjourney API)
- [ ] Video ad templates
- [ ] Brand guideline enforcement
- [ ] Multi-language copy generation
- [ ] Landing page builder

### Phase 5 - Scale
- [ ] Multi-client management
- [ ] White-label dashboard
- [ ] Custom reporting (PDF export)
- [ ] API for external tools
- [ ] Slack/Teams notifications
