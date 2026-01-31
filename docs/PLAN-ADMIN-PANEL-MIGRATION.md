# Centralny Panel Administracyjny — Specyfikacja Handoff v2

> **v2 (2026-01-31):** Zaktualizowano po analizie faktycznego OpenAPI Railway backend.
> Poprzednia wersja zakładała prostszy backend — rzeczywistość jest dużo bardziej zaawansowana.

## Spis treści

1. [Kontekst i cel](#1-kontekst-i-cel)
2. [Dostęp do infrastruktury (CLI/API)](#2-dostep-do-infrastruktury)
3. [Architektura faktyczna Railway backend](#3-architektura-faktyczna)
4. [Architektura docelowa](#4-architektura-docelowa)
5. [KROK A: Railway Backend — co faktycznie trzeba zrobić](#5-krok-a)
6. [KROK B: Legitio — ZROBIONE](#6-krok-b)
7. [KROK C: Next.js oleksiakconsulting.com](#7-krok-c)
8. [Kompletny kontrakt API Railway (faktyczny)](#8-kontrakt-api)
9. [Modele danych (faktyczne)](#9-modele-danych)
10. [Kolejność implementacji](#10-kolejnosc)

---

## 1. Kontekst i cel

### Co istnieje

- **Railway Backend** ("Auto-Blog SEO Monster") — Python/FastAPI z pełną multi-tenancy:
  - Tenants, Agents (AI writing agents), Sources (RSS), Publishers
  - User roles (superadmin/admin/editor)
  - Posts CRUD + AI generation + scheduling
  - URL: `https://api-production-8286.up.railway.app/api/v1`
  - OpenAPI docs: `https://api-production-8286.up.railway.app/openapi.json`

- **Legitio** (legitio.pl) — SvelteKit 4 app, self-hosted VPS
  - Używa MAŁEGO podzbioru Railway API (hardcoded agent_id, brak ról)
  - Blog publiczny: `/blog`, `/blog/[slug]`
  - Panel admina: `/admin/posts`, `/admin/schedules`

- **oleksiakconsulting.com** — Next.js App Router, Vercel
  - Landing page consulting
  - Bez bloga, bez admina

### Cel

Zbudować na oleksiakconsulting.com:

1. **Centralny panel admina** (`/admin`) — zarządzanie blogami wszystkich projektów
2. **Blog oleksiakconsulting.com** (`/blog`) — artykuły consulting
3. Wykorzystać **istniejącą multi-tenancy** Railway backend (tenant_id model)

### Kto to robi

**Jeden developer** realizuje całość (KROK A + C). Deploy przez CLI/API — zero pracy ręcznej.

### Czego NIE robimy

- NIE usuwamy admina z Legitio (zostaje, nie będzie rozwijany)
- NIE ruszamy kodu Legitio (KROK B jest już zrobiony i zdeployowany)
- NIE przebudowujemy modelu auth backendu — używamy istniejącego `tenant_id`

---

## 2. Dostęp do infrastruktury (CLI/API)

> Cała praca przez terminal. Żadnych paneli webowych, żadnej pracy ręcznej.

### Railway (Backend Python/FastAPI)

```bash
# Instalacja CLI
npm install -g @railway/cli

# Login (jednorazowo)
railway login

# Lub przez token (nieinteraktywny):
export RAILWAY_TOKEN=<token>

# Podstawowe komendy
railway link              # Podłącz do projektu
railway up                # Deploy
railway variables set KEY=VALUE
railway variables list
railway logs --follow
railway run <command>      # Uruchom komendę na Railway (np. seed DB)
```

**Railway repo** — developer klonuje GitHub repo z backendem FastAPI:
```bash
git clone <railway-backend-repo>
git push origin main       # Auto-deploy na Railway (jeśli podpięte)
# LUB: railway up          # Ręczny deploy
```

### Vercel (oleksiakconsulting.com)

```bash
npm install -g vercel
vercel login

# Deploy = git push (Vercel auto-deploy)
git push origin main                    # Production
git push origin feature/admin-panel     # Preview URL

# Lub ręcznie
vercel --prod

# Env vars przez CLI
vercel env add BLOG_API_URL production
vercel env add NEXT_PUBLIC_BLOG_AGENT_ID production
```

### GitHub

```bash
git clone <url-railway-repo>       # Backend
git clone <url-oleksiak-repo>      # Frontend Next.js
# NIGDY nie ruszamy github.com/xenstats-official/legitio
```

### Baza danych Railway

```bash
railway variables list | grep DATABASE
railway run psql $DATABASE_URL     # PostgreSQL
railway run mongosh $MONGODB_URI   # MongoDB
```

---

## 3. Architektura faktyczna Railway backend

> Odkryta przez OpenAPI docs. Backend jest znacznie bardziej zaawansowany niż Legitio frontend wykorzystuje.

### Model danych (faktyczny)

```
Tenant (multi-tenancy root)
│   id, name, slug, is_active
│   tokens_limit, tokens_used, posts_limit, posts_used
│   settings: {}
│
├── User (belongs to 1 tenant)
│   id, email, role (superadmin|admin|editor), tenant_id, is_active
│
├── Agent (AI writing agent, belongs to tenant)
│   id, tenant_id, name, expertise, persona, tone
│   post_length, schedule_cron, workflow, is_active, settings
│   │
│   ├── Source[] (RSS feeds / scrapers per agent)
│   │   id, agent_id, type, name, url, config, is_active
│   │
│   └── Publisher[] (output channels per agent)
│       id, agent_id, type, name, config, is_active
│
├── Post (belongs to agent)
│   id, agent_id, publisher_id, title, slug, content, excerpt
│   meta_title, meta_description, keywords, schema_markup
│   og_image_url, canonical_url, readability_score, keyword_density
│   word_count, status, scheduled_at, published_at, published_url
│   source_urls, tokens_used
│
└── Schedule (belongs to agent)
    id, agent_id, interval, publish_hour, timezone, cron_expression
    is_active, auto_publish, target_keywords, exclude_keywords, post_length
    last_run_at, next_run_at, total_posts_generated, successful_posts, failed_posts
```

### Kluczowa różnica vs stara spec

| Stara spec (v1) | Rzeczywistość (v2) |
|------------------|--------------------|
| User → `agent_ids[]` (user ma dostęp do wielu agentów) | User → `tenant_id` (user należy do 1 tenanta) |
| "Agent" = projekt (Legitio, Oleksiak) | **Tenant** = projekt. **Agent** = AI writing expert |
| Brak sources, publishers | Sources (RSS feeds) + Publishers (output channels) per agent |
| Prosty JWT `{sub, email}` | JWT `{sub, tenant_id, role, exp}` |
| Brak limitów | Tenant ma `tokens_limit`, `posts_limit` |
| 16 endpointów | **50+ endpointów** |

### Co Legitio frontend faktycznie używa (mały podzbiór)

```
POST /auth/login                    → {access_token}
GET  /posts?page_size=50            → {items: Post[]}
POST /posts                         → Post
POST /posts/format                  → {formatted_content}
POST /posts/generate                → Post (30-60s)
PUT  /posts/{id}                    → Post
DELETE /posts/{id}                  → 204
GET  /schedules                     → {items: Schedule[]}
POST /schedules                     → Schedule
PUT  /schedules/{id}                → Schedule
DELETE /schedules/{id}              → 204
POST /schedules/{id}/toggle         → Schedule
POST /schedules/{id}/run            → {task_id}
GET  /public/posts                  → PostListResponse
GET  /public/posts/featured         → Post[]
GET  /public/posts/slug/{slug}      → Post
```

Legitio hardcoduje `AGENT_ID = '536c52f2-2d17-46bb-862a-de618a83ad72'` i wysyła go w body POST /posts, POST /schedules itd. Token w `localStorage`.

---

## 4. Architektura docelowa

```
┌──────────────────────────────────────────────────────────────┐
│                Railway Backend (Auto-Blog SEO Monster)        │
│                                                              │
│  Tenant: "Legitio"              Tenant: "Oleksiak Consulting"│
│  ├── Agent (prawo PL)           ├── Agent (consulting/tech)  │
│  │   ├── Sources (prawo.pl)     │   ├── Sources (TBD)        │
│  │   └── Publishers             │   └── Publishers            │
│  ├── Posts (35+)                ├── Posts (0 → nowe)          │
│  └── Schedules                  └── Schedules                 │
│                                                              │
│  Users:                                                      │
│  ├── admin@legitio.pl      (role:admin, tenant:Legitio)      │
│  ├── rafal@oleksiak...     (role:superadmin, tenant:null?)   │
│  └── ...                                                     │
│                                                              │
│  ZMIANA: ?agent_id= filtr na /public/posts i /featured       │
└──────────┬────────────────────────────────┬──────────────────┘
           │                                │
  ┌────────┴─────────┐           ┌─────────┴─────────┐
  │   Legitio.pl     │           │ oleksiakconsulting  │
  │   (SvelteKit)    │           │    (Next.js)        │
  │                  │           │                     │
  │ /blog (public)   │           │ /blog (public)      │
  │ /admin (legacy)  │           │ /admin (nowy!)      │
  │                  │           │  - dashboard        │
  │ agent_id filtr   │           │  - posts CRUD       │
  │ ZROBIONE         │           │  - schedules CRUD   │
  └──────────────────┘           └─────────────────────┘
```

---

## 5. KROK A: Railway Backend — co faktycznie trzeba zrobić

> Scope jest MNIEJSZY niż stara spec zakładała. Backend już ma multi-tenancy.

### A1. Naprawić `?agent_id=` filtr na publicznych endpointach (KRYTYCZNE)

**Problem:** Publiczne endpointy akceptują `agent_id` w URL ale go ignorują. Fake UUID zwraca 35 postów zamiast 0.

**Zweryfikowane:**
```bash
# Ten request powinien zwrócić 0 postów, ale zwraca 35:
curl -s "https://api-production-8286.up.railway.app/api/v1/public/posts?agent_id=00000000-0000-0000-0000-000000000000" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['total'])"
# Output: 35 (BŁĄD — powinno być 0)
```

**Co zrobić:**

`GET /public/posts` — dodać opcjonalny query param `agent_id`:
```python
# Pseudo-kod zmiany:
@router.get("/public/posts")
async def list_public_posts(
    page: int = 1,
    page_size: int = 20,
    agent_id: Optional[UUID] = None,    # ← DODAĆ
):
    query = {"status": "published"}
    if agent_id:
        query["agent_id"] = str(agent_id)  # ← FILTRUJ
    # ... reszta bez zmian
```

`GET /public/posts/featured` — analogicznie:
```python
@router.get("/public/posts/featured")
async def get_featured_posts(
    limit: int = 3,
    agent_id: Optional[UUID] = None,    # ← DODAĆ
):
    query = {"status": "published"}
    if agent_id:
        query["agent_id"] = str(agent_id)  # ← FILTRUJ
    # ... reszta bez zmian
```

**Backward compatibility:** Bez `agent_id` zwraca wszystko jak teraz. Legitio wysyła `agent_id` (KROK B zrobiony) — po tej zmianie automatycznie dostanie TYLKO swoje posty.

### A2. Stworzyć tenanta "Oleksiak Consulting"

```bash
# Przez API (po zalogowaniu jako superadmin):
curl -X POST https://api-production-8286.up.railway.app/api/v1/tenants \
  -H 'Authorization: Bearer {superadmin_token}' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Oleksiak Consulting",
    "slug": "oleksiak-consulting",
    "tokens_limit": 100000,
    "posts_limit": 1000,
    "settings": {}
  }'

# LUB przez Railway CLI + seed script:
railway run python -c "from app.seed import create_tenant; create_tenant('Oleksiak Consulting', 'oleksiak-consulting')"
```

### A3. Stworzyć agenta dla Oleksiak

```bash
curl -X POST https://api-production-8286.up.railway.app/api/v1/agents \
  -H 'Authorization: Bearer {superadmin_token}' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Oleksiak Blog Writer",
    "expertise": "Business consulting, technology advisory, digital transformation",
    "persona": "Professional business consultant",
    "tone": "professional",
    "post_length": "long",
    "workflow": "research_write_review",
    "settings": {}
  }'
```

### A4. Stworzyć super-admin usera (Rafał)

```bash
curl -X POST https://api-production-8286.up.railway.app/api/v1/auth/register \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "rafal@oleksiakconsulting.com",
    "password": "<silne-haslo>",
    "role": "superadmin"
  }'
```

> Uwaga: `superadmin` (bez podkreślenia) — tak jest w backend. User `superadmin` prawdopodobnie nie ma `tenant_id` lub ma dostęp do wszystkich tenantów. Zweryfikuj w kodzie backendu.

### A5. Backward compatibility — testy po KAŻDYM deploy

```bash
# 1. Login Legitio (musi zwracać access_token)
curl -s -X POST https://api-production-8286.up.railway.app/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@legitio.pl","password":"Admin123!"}' \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print('LOGIN OK' if 'access_token' in d else 'FAIL:', d)"

# 2. Posty (musi zwracać items)
TOKEN=$(curl -s -X POST https://api-production-8286.up.railway.app/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@legitio.pl","password":"Admin123!"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")

curl -s https://api-production-8286.up.railway.app/api/v1/posts?page_size=5 \
  -H "Authorization: Bearer $TOKEN" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'POSTS OK: {len(d[\"items\"])} items')"

# 3. Harmonogramy
curl -s https://api-production-8286.up.railway.app/api/v1/schedules \
  -H "Authorization: Bearer $TOKEN" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'SCHEDULES OK: {len(d.get(\"items\",[]))} items')"

# 4. Publiczne endpointy — BEZ agent_id (musi zwracać wszystko jak teraz)
curl -s "https://api-production-8286.up.railway.app/api/v1/public/posts?page=1&page_size=3" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'PUBLIC OK: {d[\"total\"]} total')"

# 5. Publiczne endpointy — Z agent_id (musi filtrować)
curl -s "https://api-production-8286.up.railway.app/api/v1/public/posts?page=1&page_size=3&agent_id=536c52f2-2d17-46bb-862a-de618a83ad72" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'FILTERED OK: {d[\"total\"]} total')"

# 6. Publiczne endpointy — Z FAKE agent_id (MUSI zwracać 0!)
curl -s "https://api-production-8286.up.railway.app/api/v1/public/posts?agent_id=00000000-0000-0000-0000-000000000000" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'FAKE FILTER: {d[\"total\"]} total (should be 0)')"

# 7. Smoke test Legitio frontend
curl -s -o /dev/null -w 'LEGITIO HOMEPAGE: HTTP %{http_code}\n' https://dev.legitio.pl/
curl -s -o /dev/null -w 'LEGITIO BLOG: HTTP %{http_code}\n' https://dev.legitio.pl/blog
curl -s -o /dev/null -w 'LEGITIO ADMIN: HTTP %{http_code}\n' https://dev.legitio.pl/admin
```

**Jeśli WSZYSTKIE 7 testów przechodzą — deploy jest bezpieczny.**

---

## 6. KROK B: Legitio — ZROBIONE

> **STATUS: ZROBIONE i zdeployowane na dev.legitio.pl (2026-01-31)**
> NIE wymaga żadnych dalszych prac. NIE dotykać repo Legitio.

Zmienione pliki:
- `src/lib/api/blog.ts` — dodano `&agent_id=${AGENT_ID}` do fetch URL-i
- `.env` — dodano `PUBLIC_BLOG_AGENT_ID = '536c52f2-2d17-46bb-862a-de618a83ad72'`

---

## 7. KROK C: Next.js oleksiakconsulting.com

> Ten sam developer co KROK A. Deploy przez `git push` (Vercel auto-deploy).
> Wymaga ukończenia KROKU A (przynajmniej A1 — filtr agent_id).

### C1. Zmienne środowiskowe (.env.local / Vercel)

```bash
# Railway Blog API
NEXT_PUBLIC_BLOG_API_URL=https://api-production-8286.up.railway.app/api/v1
NEXT_PUBLIC_BLOG_AGENT_ID=<oleksiak-agent-uuid>   # UUID z KROKU A3

# Server-side only
BLOG_API_URL=https://api-production-8286.up.railway.app/api/v1

# Vercel CLI:
vercel env add NEXT_PUBLIC_BLOG_API_URL production
vercel env add NEXT_PUBLIC_BLOG_AGENT_ID production
vercel env add BLOG_API_URL production
```

### C2. Struktura plików

```
src/app/
├── admin/
│   ├── page.tsx                          # Login page
│   ├── layout.tsx                        # Auth guard + sidebar
│   ├── dashboard/
│   │   └── page.tsx                      # Super-admin: grid projektów (tenantów)
│   ├── [projectId]/
│   │   ├── layout.tsx                    # Nagłówek projektu
│   │   ├── posts/
│   │   │   └── page.tsx                  # Lista postów + tworzenie
│   │   └── schedules/
│   │       └── page.tsx                  # Harmonogramy
│   └── settings/
│       └── agents/
│           └── page.tsx                  # Zarządzanie agentami (AI experts)
│
├── blog/
│   ├── page.tsx                          # Lista artykułów
│   ├── [slug]/
│   │   └── page.tsx                      # Artykuł
│   └── layout.tsx                        # Blog layout
│
└── api/
    └── auth/
        └── route.ts                      # Proxy do Railway /auth/login

src/lib/
├── api/
│   ├── blog-api.ts                       # Public blog client (server-side)
│   └── admin-api.ts                      # Admin API client (authenticated)
├── auth/
│   ├── middleware.ts                      # Cookie-based auth guard
│   └── session.ts                        # JWT decode, cookie helpers
└── types/
    └── index.ts                          # TypeScript interfaces
```

### C3. Auth flow

```
1. User wchodzi na /admin
2. Wpisuje email + hasło
3. Client-side POST do /api/auth (Next.js API route)
4. Next.js proxy do Railway: POST /auth/login { email, password }
5. Railway zwraca: { access_token, token_type: "bearer" }
6. Next.js ustawia httpOnly cookie:
   Set-Cookie: admin_token=eyJ...; HttpOnly; Secure; SameSite=Strict; Path=/admin; Max-Age=86400
7. Redirect do /admin/dashboard
8. Next.js middleware na /admin/* sprawdza cookie
9. Dekoduje JWT → wyciąga tenant_id, role
10. Render warunkowy na podstawie roli
```

**JWT payload (faktyczny format):**
```json
{
  "sub": "user-uuid",
  "tenant_id": "tenant-uuid-or-null",
  "role": "superadmin",
  "exp": 1234567890
}
```

**Middleware (`middleware.ts`):**
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;

  if (request.nextUrl.pathname === '/admin') {
    if (token) return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith('/admin/')) {
    if (!token) return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = { matcher: '/admin/:path*' };
```

### C4. Dashboard

**Superadmin widzi:**
- `GET /tenants` → grid kart z tenantami (Legitio, Oleksiak, ...)
- Każda karta: nazwa, slug, posts_used/posts_limit, tokens_used/tokens_limit
- `GET /tenants/{id}/usage` → szczegóły użycia
- Kliknięcie → `/admin/{tenant_slug}/posts`

**Admin (np. admin@legitio.pl) widzi:**
- `GET /tenants/me` → tylko swój tenant
- Auto-redirect do `/admin/{swój_tenant}/posts`

### C5. Posts CRUD (`/admin/[projectId]/posts`)

Identyczne funkcje jak Legitio admin. Używa tych endpointów:

```typescript
// Lista postów
GET /posts?page_size=50&status=published
Headers: Authorization: Bearer {token}
Response: PostListResponse { items, total, page, page_size, total_pages }

// Utwórz post ręcznie
POST /posts/format   { content, title }                              → { formatted_content }
POST /posts          { agent_id, title, content, status: "published" }

// Generuj AI post (30-60s!)
POST /posts/generate { agent_id, topic, target_keyword }             → PostResponse
POST /posts/{id}/publish { publisher_id }                            → opcjonalnie

// Aktualizuj
PUT  /posts/{id}     { status: "published" | "draft" }

// Usuń
DELETE /posts/{id}

// NOWE (nie ma w Legitio):
POST /posts/{id}/schedule  { scheduled_at, publisher_id }            → zaplanuj publikację
```

**Dwa tryby tworzenia posta:**
1. **Ręczny:** Tytuł + Treść (Markdown) → format → publish
2. **AI:** Temat + Słowo kluczowe SEO → generate (30-60s) → publish

### C6. Schedules CRUD (`/admin/[projectId]/schedules`)

```typescript
GET  /schedules                                                      → ScheduleListResponse
POST /schedules { agent_id, interval, publish_hour, timezone, auto_publish,
                  target_keywords, exclude_keywords, post_length, is_active }
PUT  /schedules/{id} { interval, publish_hour, ... }
DELETE /schedules/{id}
POST /schedules/{id}/toggle                                          → ScheduleResponse
POST /schedules/{id}/run                                             → { task_id, post_id? }

// NOWE (nie ma w Legitio):
GET  /schedules/stats                                                → ScheduleStats
```

**Interval options:**
```
daily        → "Codziennie"
every_3_days → "Co 3 dni"
weekly       → "Co tydzień"
biweekly     → "Co 2 tygodnie"
```

**Post length options:** `short`, `medium`, `long`, `very_long`

**"Uruchom teraz":** POST /schedules/{id}/run → polling co 2s na GET /schedules, porównanie total_posts_generated. Timeout 3 min.

### C7. Blog publiczny `/blog`

```typescript
// lib/blog-api.ts
const API_URL = process.env.BLOG_API_URL;
const AGENT_ID = process.env.NEXT_PUBLIC_BLOG_AGENT_ID;

export async function getPosts(page = 1, pageSize = 20) {
  const res = await fetch(
    `${API_URL}/public/posts?agent_id=${AGENT_ID}&page=${page}&page_size=${pageSize}`,
    { next: { revalidate: 300 } }  // ISR: 5 min cache
  );
  if (!res.ok) return { items: [], total: 0, page: 1, page_size: pageSize, total_pages: 0 };
  return res.json();
}

export async function getFeaturedPosts(limit = 3) {
  const res = await fetch(
    `${API_URL}/public/posts/featured?agent_id=${AGENT_ID}&limit=${limit}`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) return [];
  return res.json();
}

export async function getPostBySlug(slug: string) {
  const res = await fetch(
    `${API_URL}/public/posts/slug/${slug}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return null;
  return res.json();
}
```

**`/blog`** — listing z ISR, grid kart, paginacja, SEO
**`/blog/[slug]`** — artykuł (HTML rendering), meta_title, meta_description, structured data

### C8. BONUS: Funkcje których Legitio nie używa

Backend oferuje dodatkowe endpointy które warto wykorzystać:

```
GET  /auth/me                              → UserResponse (aktualny user)
POST /auth/refresh                         → Token (odświeżenie JWT)
GET  /tenants/me                           → TenantResponse (aktualny tenant)
GET  /tenants/{id}/usage                   → TenantUsageResponse (limity/zużycie)
GET  /agents/{id}/sources                  → Source[] (źródła RSS per agent)
POST /agents/{id}/sources                  → Source (dodaj źródło)
GET  /agents/{id}/publishers               → Publisher[] (kanały publikacji)
POST /agents/{id}/publishers               → Publisher
POST /agents/{id}/run { topic }            → uruchom agenta
GET  /schedules/stats                      → ScheduleStats (statystyki)
GET  /tasks/active                         → aktywne zadania Celery
GET  /tasks/status/{task_id}               → status konkretnego taska
GET  /tasks/health                         → health check Celery
POST /posts/{id}/publish { publisher_id }  → opublikuj przez publisher
POST /posts/{id}/schedule { scheduled_at } → zaplanuj publikację
```

### C9. Design system

oleksiakconsulting.com:
```
Fonty:     Poppins (nagłówki, 600-700) + DM Sans (body, 400-500)
Kolory:    Navy/dark tło, minimalistyczna paleta
Karty:     Duży white space, subtelne cienie, rounded corners
Przyciski: Ze strzałkami (→), ciemne tło
Layout:    CSS Modules (nie Tailwind)
```

Blog pasuje do reszty strony. Admin panel — prostszy design (nie musi pasować do landing).

---

## 8. Kompletny kontrakt API Railway (faktyczny)

> Źródło: `https://api-production-8286.up.railway.app/openapi.json`

### Auth

| Metoda | Endpoint | Body | Response | Uwagi |
|--------|----------|------|----------|-------|
| POST | `/auth/login` | `UserLogin {email, password}` | `Token {access_token, token_type}` | |
| POST | `/auth/register` | `UserRegister {email, password, role, tenant_id?}` | `UserResponse` | Roles: superadmin/admin/editor |
| GET | `/auth/me` | - | `UserResponse` | Aktualny user |
| POST | `/auth/refresh` | - | `Token` | Odświeżenie JWT |

### Tenants

| Metoda | Endpoint | Body | Response |
|--------|----------|------|----------|
| GET | `/tenants` | - | `TenantResponse[]` |
| POST | `/tenants` | `TenantCreate {name, slug, tokens_limit, posts_limit, settings}` | `TenantResponse` |
| GET | `/tenants/me` | - | `TenantResponse` |
| GET | `/tenants/{id}` | - | `TenantResponse` |
| PUT | `/tenants/{id}` | `TenantUpdate {name?, is_active?, tokens_limit?, posts_limit?}` | `TenantResponse` |
| DELETE | `/tenants/{id}` | - | 204 |
| GET | `/tenants/{id}/usage` | - | `TenantUsageResponse` |

### Agents (AI writing agents, per tenant)

| Metoda | Endpoint | Body | Response |
|--------|----------|------|----------|
| GET | `/agents` | - | `AgentResponse[]` |
| POST | `/agents` | `AgentCreate {name, expertise, persona, tone, post_length, workflow, settings}` | `AgentResponse` |
| GET | `/agents/{id}` | - | `AgentResponse` |
| PUT | `/agents/{id}` | `AgentUpdate` | `AgentResponse` |
| DELETE | `/agents/{id}` | - | 204 |
| POST | `/agents/{id}/run` | `{topic}` | - |

### Sources (per agent)

| Metoda | Endpoint | Body | Response |
|--------|----------|------|----------|
| GET | `/agents/{id}/sources` | - | `SourceResponse[]` |
| POST | `/agents/{id}/sources` | `SourceCreate {type, name, url, config}` | `SourceResponse` |
| POST | `/agents/{id}/sources/test` | `SourceTestRequest` | `SourceTestResponse` |
| PUT | `/agents/{id}/sources/{sid}` | `SourceUpdate` | `SourceResponse` |
| DELETE | `/agents/{id}/sources/{sid}` | - | 204 |

### Publishers (per agent)

| Metoda | Endpoint | Body | Response |
|--------|----------|------|----------|
| GET | `/agents/{id}/publishers` | - | `PublisherResponse[]` |
| POST | `/agents/{id}/publishers` | `PublisherCreate {type, name, config}` | `PublisherResponse` |
| POST | `/agents/{id}/publishers/test` | `PublisherTestRequest` | `PublisherTestResponse` |
| PUT | `/agents/{id}/publishers/{pid}` | `PublisherUpdate` | `PublisherResponse` |
| DELETE | `/agents/{id}/publishers/{pid}` | - | 204 |

### Posts

| Metoda | Endpoint | Body | Response |
|--------|----------|------|----------|
| GET | `/posts` | query: page, page_size, status | `PostListResponse` |
| POST | `/posts` | `PostCreate {agent_id, title, slug?, content, ...}` | `PostResponse` |
| GET | `/posts/{id}` | - | `PostResponse` |
| PUT | `/posts/{id}` | `PostUpdate {title?, content?, status?, ...}` | `PostResponse` |
| DELETE | `/posts/{id}` | - | 204 |
| POST | `/posts/generate` | `{agent_id, topic, target_keyword}` | `PostResponse` |
| POST | `/posts/format` | `{content, title}` | formatted content |
| POST | `/posts/{id}/publish` | `{publisher_id}` | - |
| POST | `/posts/{id}/schedule` | `{scheduled_at, publisher_id}` | - |

### Schedules

| Metoda | Endpoint | Body | Response |
|--------|----------|------|----------|
| GET | `/schedules` | - | `ScheduleListResponse` |
| POST | `/schedules` | `ScheduleCreate {agent_id, interval, publish_hour, ...}` | `ScheduleResponse` |
| GET | `/schedules/{id}` | - | `ScheduleResponse` |
| PUT | `/schedules/{id}` | `ScheduleUpdate` | `ScheduleResponse` |
| DELETE | `/schedules/{id}` | - | 204 |
| POST | `/schedules/{id}/run` | - | `ScheduleRunResponse {task_id, post_id?}` |
| POST | `/schedules/{id}/toggle` | - | `ScheduleResponse` |
| GET | `/schedules/stats` | - | `ScheduleStats` |

### Public (bez autoryzacji)

| Metoda | Endpoint | Query | Response | Uwagi |
|--------|----------|-------|----------|-------|
| GET | `/public/posts` | page, page_size, **agent_id** (po fix) | `PostListResponse` | agent_id MUSI działać po KROK A1 |
| GET | `/public/posts/featured` | limit, **agent_id** (po fix) | `PostResponse[]` | agent_id MUSI działać po KROK A1 |
| GET | `/public/posts/slug/{slug}` | - | `PostResponse` | Bez zmian |

### Tasks (Celery)

| Metoda | Endpoint | Body | Response |
|--------|----------|------|----------|
| GET | `/tasks/active` | - | `TaskListResponse` |
| GET | `/tasks/status/{task_id}` | - | `TaskStatusResponse` |
| GET | `/tasks/health` | - | health check |

---

## 9. Modele danych (faktyczne)

### TenantResponse

```typescript
interface TenantResponse {
  id: string;              // UUID
  name: string;
  slug: string;
  is_active: boolean;
  tokens_limit: number;
  tokens_used: number;
  posts_limit: number;
  posts_used: number;
  settings: Record<string, any>;
  created_at: string;      // ISO 8601
  updated_at: string;
}
```

### UserResponse

```typescript
interface UserResponse {
  id: string;              // UUID
  email: string;
  role: 'superadmin' | 'admin' | 'editor';
  tenant_id: string | null;   // UUID or null (superadmin)
  is_active: boolean;
}
```

### AgentResponse

```typescript
interface AgentResponse {
  id: string;              // UUID
  tenant_id: string;       // UUID
  name: string;
  expertise: string;
  persona: string | null;
  tone: string;
  post_length: string;
  schedule_cron: string | null;
  workflow: string;
  is_active: boolean;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}
```

### PostResponse

```typescript
interface PostResponse {
  id: string;
  agent_id: string;
  publisher_id: string | null;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  meta_title: string | null;
  meta_description: string | null;
  keywords: string[];
  schema_markup: string | null;
  og_image_url: string | null;
  canonical_url: string | null;
  readability_score: number | null;
  keyword_density: number | null;
  word_count: number;
  status: 'draft' | 'published' | 'scheduled';
  scheduled_at: string | null;
  published_at: string | null;
  published_url: string | null;
  source_urls: string[];
  tokens_used: number;
  created_at: string;
  updated_at: string;
}
```

### PostListResponse

```typescript
interface PostListResponse {
  items: PostResponse[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
```

### ScheduleResponse

```typescript
interface ScheduleResponse {
  id: string;
  agent_id: string;
  interval: 'daily' | 'every_3_days' | 'weekly' | 'biweekly';
  interval_display: string;    // "Codziennie", "Co 3 dni", etc.
  publish_hour: number;        // 0-23
  timezone: string;            // "Europe/Warsaw"
  cron_expression: string;
  is_active: boolean;
  auto_publish: boolean;
  target_keywords: string[];
  exclude_keywords: string[];
  post_length: string;
  last_run_at: string | null;
  next_run_at: string | null;
  total_posts_generated: number;
  successful_posts: number;
  failed_posts: number;
  created_at: string;
  updated_at: string;
}
```

### ScheduleStats

```typescript
interface ScheduleStats {
  total_schedules: number;
  active_schedules: number;
  total_posts_generated: number;
  successful_posts: number;
  failed_posts: number;
  success_rate: number;
  posts_last_7_days: number;
  posts_last_30_days: number;
  upcoming_posts: any[];
}
```

### TenantUsageResponse

```typescript
interface TenantUsageResponse {
  tenant_id: string;
  tokens_used: number;
  tokens_limit: number;
  tokens_percentage: number;
  posts_used: number;
  posts_limit: number;
  posts_percentage: number;
}
```

### SourceResponse

```typescript
interface SourceResponse {
  id: string;
  agent_id: string;
  type: string;
  name: string;
  url: string;
  config: Record<string, any>;
  is_active: boolean;
  last_fetched_at: string | null;
  created_at: string;
}
```

### PublisherResponse

```typescript
interface PublisherResponse {
  id: string;
  agent_id: string;
  type: string;
  name: string;
  config: Record<string, any>;
  is_active: boolean;
  created_at: string;
}
```

### Token

```typescript
interface Token {
  access_token: string;
  token_type: string;    // "bearer"
}
```

### JWT Payload (faktyczny)

```typescript
interface JWTPayload {
  sub: string;             // user UUID
  tenant_id: string | null; // tenant UUID or null (superadmin)
  role: 'superadmin' | 'admin' | 'editor';
  exp: number;
}
```

---

## 10. Kolejność implementacji

> Jeden developer. Deploy przez CLI.

### Krok 1: Railway Backend — naprawić filtr (KROK A)

**Scope: MAŁY — backend już ma multi-tenancy.**

- [ ] A1: Naprawić `?agent_id=` filtr na `/public/posts` i `/public/posts/featured`
- [ ] A2: Stworzyć tenanta "Oleksiak Consulting"
- [ ] A3: Stworzyć agenta dla Oleksiak (AI writing expert)
- [ ] A4: Stworzyć super-admin usera (rafal@oleksiakconsulting.com)
- [ ] A5: **Testy backward compatibility — MUSZĄ przejść**
- [ ] A5 test 6: Fake agent_id zwraca 0 postów (weryfikacja filtra)

### Krok 2: Legitio — ZROBIONE

- [x] ~~agent_id filtr w blog.ts~~ (2026-01-31)
- [x] ~~Deploy na dev.legitio.pl~~ (2026-01-31)
- [ ] Deploy na produkcję (legitio.pl) — po Kroku 1

### Krok 3: Next.js Admin Panel (KROK C)

```bash
vercel env add NEXT_PUBLIC_BLOG_API_URL production
vercel env add NEXT_PUBLIC_BLOG_AGENT_ID production
vercel env add BLOG_API_URL production
```

- [ ] `/admin` login + `/api/auth` proxy
- [ ] Auth middleware (cookie-based JWT, dekodowanie tenant_id + role)
- [ ] `/admin/dashboard` — superadmin: grid tenantów, admin: redirect do swoich postów
- [ ] `/admin/[projectId]/posts` — CRUD postów
- [ ] `/admin/[projectId]/schedules` — CRUD harmonogramów
- [ ] Layout z sidebar, nawigacja, logout
- [ ] Role-based rendering

### Krok 4: Blog (KROK C cd.)

- [ ] Blog API client z agent_id
- [ ] `/blog` — listing (ISR)
- [ ] `/blog/[slug]` — artykuł (ISR, SEO)
- [ ] Homepage "Latest Insights"
- [ ] SEO: sitemap, structured data

### Krok 5: Rozszerzone features (opcjonalne)

- [ ] Sources management (RSS feeds per agent)
- [ ] Publishers management (kanały publikacji)
- [ ] Tenant usage dashboard (limity, zużycie tokenów)
- [ ] Schedule stats dashboard
- [ ] Task monitoring (Celery health, active tasks)

---

## Uwagi końcowe

1. **KROK A jest MAŁY.** Backend już ma multi-tenancy. Jedyna krytyczna zmiana to filtr `?agent_id=` na publicznych endpointach + seed danych.
2. **KROK B jest ZROBIONY.** Nie dotykać repo Legitio.
3. **Backward compatibility po każdym Railway deploy.** 7 testów z sekcji A5.
4. **tenant_id, nie agent_ids[].** Używamy istniejącego modelu. User należy do 1 tenanta.
5. **superadmin (bez podkreślenia)** — tak jest w backend. Nie `super_admin`.
6. **POST /posts/generate trwa 30-60s** — UI musi mieć loading spinner.
7. **Token w cookie (httpOnly)** na oleksiakconsulting.com. Legitio zostaje na localStorage.
8. **Developer nie potrzebuje dostępu do VPS Legitio.**
9. **OpenAPI docs dostępne:** `https://api-production-8286.up.railway.app/openapi.json`
