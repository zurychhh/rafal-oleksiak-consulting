# Centralny Panel Administracyjny — Specyfikacja Handoff

## Spis treści

1. [Kontekst i cel](#1-kontekst-i-cel)
2. [Dostęp do infrastruktury (CLI/API)](#2-dostep-do-infrastruktury)
3. [Architektura obecna (stan faktyczny)](#3-architektura-obecna)
4. [Architektura docelowa](#4-architektura-docelowa)
5. [KROK A: Railway Backend — multi-tenancy](#5-krok-a-railway-backend)
6. [KROK B: Legitio — minimalna zmiana (ZROBIONE)](#6-krok-b-legitio)
7. [KROK C: Next.js oleksiakconsulting.com](#7-krok-c-nextjs)
8. [Kompletny kontrakt API Railway](#8-kontrakt-api)
9. [Modele danych](#9-modele-danych)
10. [Kolejność implementacji](#10-kolejnosc)

---

## 1. Kontekst i cel

### Co istnieje

- **Legitio** (legitio.pl) — SvelteKit 4 app, self-hosted VPS
  - Blog publiczny: `/blog`, `/blog/[slug]`
  - Panel admina: `/admin` (login), `/admin/posts`, `/admin/schedules`
  - Blog API na Railway (Python/FastAPI): generowanie artykułów AI, auto-publishing

- **oleksiakconsulting.com** — Next.js App Router, hostowane na Vercel
  - Landing page consulting
  - Bez bloga, bez admina

### Cel

Zbudować na oleksiakconsulting.com:

1. **Centralny panel admina** (`/admin`) — zarządzanie blogami wszystkich projektów (Legitio + oleksiak + przyszłe)
2. **Blog oleksiakconsulting.com** (`/blog`) — artykuły consulting (osobne od Legitio)
3. **Multi-tenant** — super-admin widzi wszystko, admin projektu widzi tylko swój projekt

### Kto to robi

**Jeden developer** realizuje całość (KROK A + C). Cała praca odbywa się przez CLI/API — zero pracy ręcznej, zero logowania do paneli webowych.

- **KROK A** — zmiany w Railway backend (Python/FastAPI) — deploy przez Railway CLI
- **KROK B** — minimalna zmiana w Legitio — **ZROBIONE** (agent_id filtr w blog.ts, zdeployowane na dev.legitio.pl)
- **KROK C** — nowy kod w oleksiakconsulting.com (Next.js) — deploy przez Vercel/GitHub

### Czego NIE robimy

- NIE usuwamy admina z Legitio (zostaje, ale nie będzie rozwijany)
- NIE ruszamy kodu Legitio (KROK B jest już zrobiony i zdeployowany)
- Legitio admin nadal działa równolegle — to duplikacja, nie migracja

---

## 2. Dostęp do infrastruktury (CLI/API)

> Cała praca przez terminal. Żadnych paneli webowych, żadnej pracy ręcznej.

### Railway (Backend Python/FastAPI)

```bash
# Instalacja CLI
npm install -g @railway/cli

# Login (interaktywny — jednorazowo)
railway login

# Lub przez token (nieinteraktywny, do CI/CD):
export RAILWAY_TOKEN=<token-z-railway-dashboard>
```

**Dostęp do projektu:**
```bash
# Link do istniejącego projektu Railway
railway link

# Deploy (z katalogu repo)
railway up

# Zmienne środowiskowe
railway variables set KEY=VALUE
railway variables list

# Logi
railway logs --follow

# Uruchom komendę na Railway (np. migracja DB)
railway run python manage.py migrate
railway run python -c "from app.seed import seed_agents; seed_agents()"
```

**Railway repo** — developer dostaje dostęp do GitHub repo z backendem FastAPI. Workflow:
```bash
git clone <railway-backend-repo>
# ... zmiany w kodzie ...
git push origin main          # Railway auto-deploy z GitHub (jeśli skonfigurowane)
# LUB:
railway up                    # Ręczny deploy z CLI
```

### Vercel (oleksiakconsulting.com — Next.js)

```bash
# Instalacja CLI
npm install -g vercel

# Login
vercel login

# Lub przez token:
export VERCEL_TOKEN=<token>
```

**Workflow:**
```bash
# oleksiakconsulting.com jest podpięte do GitHub repo
# Deploy = git push (Vercel auto-deploy)
git clone <oleksiak-consulting-repo>
cd oleksiak-consulting

# Dev lokalnie
npm run dev

# Deploy preview
git push origin feature/admin-panel    # Vercel tworzy preview URL

# Deploy production
git push origin main                   # Vercel deploy na oleksiakconsulting.com

# Lub ręczny deploy z CLI
vercel --prod

# Zmienne środowiskowe (zamiast klikania w panel)
vercel env add BLOG_API_URL production
vercel env add NEXT_PUBLIC_BLOG_AGENT_ID production
vercel env ls
```

### GitHub

```bash
# Repo Railway backend
git clone <url-railway-repo>

# Repo oleksiakconsulting.com
git clone <url-oleksiak-repo>

# NIGDY nie ruszamy repo Legitio (github.com/xenstats-official/legitio)
# KROK B jest już zdeployowany — zero dalszych zmian
```

### Baza danych Railway

Railway backend używa swojej bazy (prawdopodobnie PostgreSQL lub MongoDB na Railway). Dostęp:
```bash
# Sprawdź connection string
railway variables list | grep DATABASE

# Jeśli PostgreSQL:
railway run psql $DATABASE_URL

# Jeśli MongoDB:
railway run mongosh $MONGODB_URI
```

---

## 3. Architektura obecna

### Railway Backend (Python/FastAPI)

```
URL: https://api-production-8286.up.railway.app/api/v1
```

Backend obsługuje jednego "agenta" (Legitio) z hardcoded `agent_id`:
```
AGENT_ID = "536c52f2-2d17-46bb-862a-de618a83ad72"
```

**Problem:** Publiczne endpointy (`/public/posts`, `/public/posts/featured`) zwracają posty WSZYSTKICH agentów bez filtrowania. Dodanie drugiego agenta (oleksiak) spowoduje mieszanie artykułów prawnych z consultingowymi na obu stronach.

### Legitio Admin Panel (SvelteKit)

- Login: `POST /auth/login` → JWT token w `localStorage`
- Posty: CRUD z hardcoded `AGENT_ID`
- Harmonogramy: CRUD z hardcoded `AGENT_ID`
- Brak ról, brak multi-tenancy, jedno konto admina

### Obecny auth flow

```
1. Admin wchodzi na /admin (Legitio)
2. Wpisuje email + hasło (admin@legitio.pl / Admin123!)
3. POST /auth/login → { access_token: "JWT..." }
4. Token w localStorage.admin_token
5. Każdy request: Authorization: Bearer {token}
6. 401 → redirect do /admin login
```

JWT payload (obecny):
```json
{
  "sub": "user_id_string",
  "email": "admin@legitio.pl",
  "exp": 1234567890
}
```

---

## 4. Architektura docelowa

```
┌─────────────────────────────────────────────────────────┐
│                   Railway Backend (FastAPI)              │
│                                                         │
│  Istniejące:              Nowe:                         │
│  ├── /auth/login          ├── /auth/register            │
│  ├── /posts (CRUD)        ├── /agents (CRUD)            │
│  ├── /posts/generate      ├── /agents/me                │
│  ├── /posts/format        │                             │
│  ├── /schedules (CRUD)    Zmienione:                    │
│  ├── /public/posts        ├── /public/posts + ?agent_id │
│  ├── /public/posts/feat.  ├── /public/posts/featured    │
│  └── /public/posts/slug/  │     + ?agent_id             │
│                           ├── JWT + role + agent_ids    │
│                           └── users + role/agent_ids    │
└────────────┬──────────────────────────┬─────────────────┘
             │                          │
    ┌────────┴────────┐       ┌────────┴────────┐
    │   Legitio.pl    │       │ oleksiakconsulting│
    │   (SvelteKit)   │       │    (Next.js)     │
    │                 │       │                  │
    │ /blog (public)  │       │ /blog (public)   │
    │ /admin (legacy) │       │ /admin (nowy!)   │
    │                 │       │  - dashboard     │
    │ agent_id filtr  │       │  - [proj]/posts  │
    │ w blog.ts       │       │  - [proj]/sched. │
    └─────────────────┘       └──────────────────┘
```

---

## 5. KROK A: Railway Backend — multi-tenancy

> Fundament całej architektury — bez tego nic innego nie zadziała.
> Developer klonuje repo Railway backend, wprowadza zmiany, deploy przez `railway up` lub `git push`.
>
> **KRYTYCZNE: backward compatibility.** Legitio SvelteKit app (dev.legitio.pl / legitio.pl) korzysta z tego samego Railway API. Po każdej zmianie Legitio admin (/admin/posts, /admin/schedules) i blog publiczny (/blog) MUSZĄ działać bez zmian. Poniżej dokładne reguły.

### A1. Nowa tabela/kolekcja `agents`

```python
class Agent:
    id: UUID                    # agent_id (istniejący UUID Legitio = 536c52f2-...)
    name: str                   # "Legitio", "Oleksiak Consulting"
    slug: str                   # "legitio", "oleksiak-consulting"
    domain: str                 # "legitio.pl", "oleksiakconsulting.com"
    owner_email: str            # email właściciela (opcjonalnie)
    ai_context: str             # kontekst dla AI generatora
    ai_prompt_template: str     # bazowy prompt per agent
    created_at: datetime
    updated_at: datetime
```

**Pierwszy agent (Legitio) — insert ręczny:**
```json
{
  "id": "536c52f2-2d17-46bb-862a-de618a83ad72",
  "name": "Legitio",
  "slug": "legitio",
  "domain": "legitio.pl",
  "ai_context": "Polish law information portal...",
  "ai_prompt_template": "(istniejący prompt)"
}
```

**Drugi agent (Oleksiak) — nowy UUID:**
```json
{
  "id": "<nowy-uuid>",
  "name": "Oleksiak Consulting",
  "slug": "oleksiak-consulting",
  "domain": "oleksiakconsulting.com",
  "ai_context": "Business consulting, technology advisory...",
  "ai_prompt_template": "(nowy prompt consulting)"
}
```

### A2. Rozszerzenie tabeli `users`

Dodać pola:
```python
role: str           # "super_admin" | "admin" | "editor"
agent_ids: List[UUID]  # lista agentów do których user ma dostęp
```

**Role:**

| Rola | Widzi agentów | Może tworzyć agentów | Może tworzyć userów | Posty | Harmonogramy |
|------|---------------|---------------------|--------------------|----|---|
| `super_admin` | Wszystkich | Tak | Tak | CRUD wszystkich | CRUD wszystkich |
| `admin` | Tylko swoje (agent_ids) | Nie | Nie | CRUD swoich | CRUD swoich |
| `editor` | Tylko swoje (agent_ids) | Nie | Nie | CRUD swoich | Tylko read |

**Istniejący user (admin@legitio.pl) — aktualizacja:**
```json
{
  "email": "admin@legitio.pl",
  "role": "admin",
  "agent_ids": ["536c52f2-2d17-46bb-862a-de618a83ad72"]
}
```

**Nowy super-admin (Rafał):**
```json
{
  "email": "rafal@oleksiakconsulting.com",
  "role": "super_admin",
  "agent_ids": ["536c52f2-...", "<oleksiak-uuid>"]
}
```

### A3. Zmiana JWT payload

**Nowy format JWT:**
```json
{
  "sub": "user_id",
  "email": "rafal@oleksiakconsulting.com",
  "role": "super_admin",
  "agent_ids": ["536c52f2-...", "<oleksiak-uuid>"],
  "exp": 1234567890
}
```

### A3.1 BACKWARD COMPATIBILITY — szczegółowe reguły

Legitio SvelteKit admin (`dev.legitio.pl/admin`) loguje się tym samym `POST /auth/login` i korzysta z tego samego JWT. **Musi działać bez żadnych zmian w kodzie Legitio.**

**Reguła 1: Istniejący user `admin@legitio.pl` musi dostać nowe pola automatycznie**
```python
# Przy aktualizacji tabeli users, istniejący user MUSI dostać:
{
  "email": "admin@legitio.pl",
  "role": "admin",                                        # NOWE — domyślna rola
  "agent_ids": ["536c52f2-2d17-46bb-862a-de618a83ad72"]   # NOWE — dostęp do Legitio
}
# Hasło, id i reszta pól — bez zmian
```

**Reguła 2: JWT z nowymi polami nie psuje Legitio**
Legitio admin IGNORUJE nieznane pola w JWT. Kod Legitio robi tylko:
```javascript
// Legitio czyta z JWT TYLKO token string — nie parsuje payload
localStorage.setItem('admin_token', data.access_token);
// Potem wysyła jako header:
headers: { Authorization: `Bearer ${token}` }
```
Legitio **nie czyta** `role`, `agent_ids` z tokenu — więc ich dodanie jest bezpieczne.

**Reguła 3: Istniejące endpointy muszą zwracać te same dane dla tego samego tokenu**

| Endpoint | Legitio wysyła | Musi zwracać | Dlaczego |
|----------|---------------|-------------|---------|
| `POST /auth/login` | `{email, password}` | `{access_token}` — **ten sam format** | Legitio czyta `data.access_token` |
| `GET /posts?page_size=50` | Bearer token | `{items: Post[]}` — **te same posty co teraz** | Legitio wyświetla listę. Jeśli user ma `agent_ids: [legitio-uuid]`, filtruj posty po tym agent_id |
| `POST /posts` | `{agent_id, title, content, status}` | Post | Legitio wysyła `agent_id` w body — waliduj że jest w user.agent_ids |
| `POST /posts/format` | `{content, title}` | `{formatted_content}` | Bez zmian — nie zależy od agenta |
| `POST /posts/generate` | `{agent_id, topic, target_keyword}` | Post | Jak wyżej — waliduj agent_id |
| `PUT /posts/:id` | `{status}` | Post | Sprawdź czy post należy do agenta usera |
| `DELETE /posts/:id` | - | 204 | Jak wyżej |
| `GET /schedules` | Bearer token | `{items: Schedule[]}` | Filtruj po agent_ids usera |
| `POST /schedules` | `{agent_id, ...}` | Schedule | Waliduj agent_id |
| `PUT /schedules/:id` | `{...}` | Schedule | Sprawdź ownership |
| `DELETE /schedules/:id` | - | 204 | Sprawdź ownership |
| `POST /schedules/:id/toggle` | - | `{id, is_active}` | Sprawdź ownership |
| `POST /schedules/:id/run` | - | `{task_id}` | Sprawdź ownership |

**Reguła 4: Publiczne endpointy — `agent_id` jest OPCJONALNY**
```
GET /public/posts?page=1&page_size=20
  → Zwraca WSZYSTKIE posty (jak teraz — backward compatible)

GET /public/posts?page=1&page_size=20&agent_id=536c52f2-...
  → Zwraca TYLKO posty tego agenta (nowa funkcjonalność)
```
Legitio od teraz wysyła `&agent_id=536c52f2-...` ale backend jeszcze tego nie filtruje (ignoruje). Po wdrożeniu filtrowania — Legitio automatycznie dostanie TYLKO swoje posty.

**Reguła 5: Nowe endpointy NIE kolidują z istniejącymi**
```
/agents        — nowa ścieżka, nie istniała wcześniej
/agents/:id    — nowa ścieżka
/agents/me     — nowa ścieżka
/auth/register — nowa ścieżka (istniejący /auth/login — bez zmian)
```
Legitio nie wysyła requestów na te ścieżki — zero ryzyka kolizji.

### A3.2 Jak przetestować backward compatibility

Po każdym deploy na Railway:

```bash
# 1. Test logowania Legitio (musi zwracać access_token)
curl -s -X POST https://api-production-8286.up.railway.app/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@legitio.pl","password":"Admin123!"}' \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print('LOGIN OK' if 'access_token' in d else 'FAIL:', d)"

# 2. Test postów (musi zwracać items)
TOKEN=$(curl -s -X POST https://api-production-8286.up.railway.app/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@legitio.pl","password":"Admin123!"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")

curl -s https://api-production-8286.up.railway.app/api/v1/posts?page_size=5 \
  -H "Authorization: Bearer $TOKEN" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'POSTS OK: {len(d[\"items\"])} items')"

# 3. Test harmonogramów
curl -s https://api-production-8286.up.railway.app/api/v1/schedules \
  -H "Authorization: Bearer $TOKEN" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'SCHEDULES OK: {len(d.get(\"items\",[]))} items')"

# 4. Test publicznych endpointów (bez agent_id — jak teraz)
curl -s "https://api-production-8286.up.railway.app/api/v1/public/posts?page=1&page_size=3" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'PUBLIC OK: {d[\"total\"]} total')"

# 5. Test publicznych endpointów (z agent_id — nowa funkcja)
curl -s "https://api-production-8286.up.railway.app/api/v1/public/posts?page=1&page_size=3&agent_id=536c52f2-2d17-46bb-862a-de618a83ad72" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'FILTERED OK: {d[\"total\"]} total')"

# 6. Smoke test dev.legitio.pl (Legitio frontend)
curl -s -o /dev/null -w 'LEGITIO HOMEPAGE: HTTP %{http_code}\n' https://dev.legitio.pl/
curl -s -o /dev/null -w 'LEGITIO BLOG: HTTP %{http_code}\n' https://dev.legitio.pl/blog
curl -s -o /dev/null -w 'LEGITIO ADMIN: HTTP %{http_code}\n' https://dev.legitio.pl/admin
```

**Jeśli WSZYSTKIE 6 testów przechodzą — deploy jest bezpieczny.**

### A4. Filtr `?agent_id=` na publicznych endpointach

**`GET /public/posts`** — dodać opcjonalny query param:
```
GET /public/posts?page=1&page_size=20                    → wszystkie (jak teraz)
GET /public/posts?page=1&page_size=20&agent_id=536c52f2  → tylko Legitio
```

**`GET /public/posts/featured`** — analogicznie:
```
GET /public/posts/featured?limit=3                       → wszystkie (jak teraz)
GET /public/posts/featured?limit=3&agent_id=536c52f2     → tylko Legitio
```

**`GET /public/posts/slug/{slug}`** — bez zmian (slug jest unikalny globalnie).

### A5. Nowe endpointy

```
POST   /auth/register              # Tworzenie użytkownika (wymaga: super_admin)
                                   # Body: { email, password, role, agent_ids }

GET    /agents                     # Lista agentów
                                   # super_admin: wszystkie
                                   # admin/editor: tylko swoje (z agent_ids)
                                   # Response: { items: Agent[] }

POST   /agents                     # Tworzenie agenta (wymaga: super_admin)
                                   # Body: { name, slug, domain, ai_context, ai_prompt_template }
                                   # Response: Agent (z wygenerowanym UUID)

GET    /agents/:id                 # Szczegóły agenta (wymaga: dostęp do tego agenta)
PUT    /agents/:id                 # Edycja agenta (wymaga: super_admin)

GET    /agents/me                  # Agenty zalogowanego usera
                                   # Response: { items: Agent[] } (filtrowane po agent_ids z JWT)
```

### A6. Scope na istniejących endpointach

Obecne endpointy `/posts` i `/schedules` są już scoped po `agent_id` w body/query. Dodać walidację:

```python
# Middleware sprawdzający:
# 1. Weź agent_id z request body lub query
# 2. Sprawdź czy agent_id jest w user.agent_ids (z JWT)
# 3. super_admin pomija ten check
# 4. Jeśli brak dostępu → 403 Forbidden
```

---

## 6. KROK B: Legitio — minimalna zmiana (ZROBIONE)

> **STATUS: ZROBIONE i zdeployowane na dev.legitio.pl (2026-01-31)**
> Jedna zmiana w jednym pliku. NIE wymaga żadnych dalszych prac.

### Plik: `src/lib/api/blog.ts`

**Obecny kod (linia 6-9):**
```typescript
const API_BASE_URL = PUBLIC_BLOG_API_URL || 'https://api-production-8286.up.railway.app/api/v1';
```

**Nowy kod:**
```typescript
import { PUBLIC_BLOG_API_URL, PUBLIC_BLOG_AGENT_ID } from '$env/static/public';

const API_BASE_URL = PUBLIC_BLOG_API_URL || 'https://api-production-8286.up.railway.app/api/v1';
const AGENT_ID = PUBLIC_BLOG_AGENT_ID || '536c52f2-2d17-46bb-862a-de618a83ad72';
```

**Zmiana w `getFeaturedPosts()` (linia 163):**
```typescript
// PRZED:
const response = await fetch(`${API_BASE_URL}/public/posts/featured?limit=${limit}`, {

// PO:
const response = await fetch(`${API_BASE_URL}/public/posts/featured?limit=${limit}&agent_id=${AGENT_ID}`, {
```

**Zmiana w `getPosts()` (linia 190-191):**
```typescript
// PRZED:
const response = await fetch(
    `${API_BASE_URL}/public/posts?page=${page}&page_size=${pageSize}`,

// PO:
const response = await fetch(
    `${API_BASE_URL}/public/posts?page=${page}&page_size=${pageSize}&agent_id=${AGENT_ID}`,
```

**`getPostBySlug()`** — bez zmian (slug jest unikalny).

### .env na VPS

Dodać do `/home/debian/legitio-dev/.env` i `/home/debian/legitio/.env`:
```
PUBLIC_BLOG_AGENT_ID=536c52f2-2d17-46bb-862a-de618a83ad72
```

Potem rebuild (`npm run build`) i restart serwisu (compile-time env!).

---

## 7. KROK C: Next.js oleksiakconsulting.com

> Ten sam developer co KROK A. Repo oleksiakconsulting.com na GitHub, deploy na Vercel.
> Wymaga ukończenia KROKU A. KROK B jest już zrobiony.

### C1. Zmienne środowiskowe (.env.local)

```bash
# Railway Blog API
NEXT_PUBLIC_BLOG_API_URL=https://api-production-8286.up.railway.app/api/v1
NEXT_PUBLIC_BLOG_AGENT_ID=<oleksiak-uuid>    # UUID agenta oleksiak-consulting

# Admin API (ten sam Railway, ale server-side)
BLOG_API_URL=https://api-production-8286.up.railway.app/api/v1
```

### C2. Struktura plików

```
src/app/
├── admin/
│   ├── page.tsx                          # Login page
│   ├── layout.tsx                        # Auth guard + sidebar
│   ├── dashboard/
│   │   └── page.tsx                      # Super-admin: grid projektów
│   ├── [projectId]/
│   │   ├── layout.tsx                    # Nagłówek projektu
│   │   ├── posts/
│   │   │   └── page.tsx                  # Lista postów + tworzenie
│   │   └── schedules/
│   │       └── page.tsx                  # Harmonogramy
│   └── settings/
│       └── agents/
│           └── page.tsx                  # Super-admin: CRUD agentów
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
│   ├── blog-api.ts                       # Public blog client (server-side fetch)
│   └── admin-api.ts                      # Admin API client (authenticated)
├── auth/
│   ├── middleware.ts                      # Cookie-based auth guard
│   └── session.ts                        # JWT decode, cookie helpers
└── types/
    └── index.ts                          # TypeScript interfaces
```

### C3. Auth flow — szczegóły

```
1. User wchodzi na /admin
2. Wpisuje email + hasło
3. Client-side POST do /api/auth (Next.js API route)
4. Next.js API route proxy do Railway: POST /auth/login { email, password }
5. Railway zwraca: { access_token: "eyJ..." }
6. Next.js API route ustawia httpOnly cookie:
   Set-Cookie: admin_token=eyJ...; HttpOnly; Secure; SameSite=Strict; Path=/admin; Max-Age=86400
7. Redirect do /admin/dashboard
8. Next.js middleware na /admin/* sprawdza cookie
9. Dekoduje JWT → wyciąga role, agent_ids
10. Render warunkowy na podstawie roli
```

**Middleware (`middleware.ts`):**
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;

  // /admin (login page) - jeśli zalogowany, redirect do dashboard
  if (request.nextUrl.pathname === '/admin') {
    if (token) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // /admin/* - wymagaj tokenu
  if (request.nextUrl.pathname.startsWith('/admin/')) {
    if (!token) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
```

### C4. Strona `/admin` — Login

Prosty formularz: email + hasło → POST do `/api/auth` → cookie → redirect.

**Pola:**
- Email (input type="email", required)
- Hasło (input type="password", required)
- Button "Zaloguj się"
- Error message (czerwony box)

### C5. Strona `/admin/dashboard` — Dashboard

Po zalogowaniu:

**Super-admin widzi:**
- Grid kart z projektami (pobrane z `GET /agents`)
- Każda karta: nazwa agenta, domena, liczba postów, status harmonogramu
- Kliknięcie → `/admin/{agent_id}/posts`
- Button "Dodaj projekt" → `/admin/settings/agents`

**Admin widzi:**
- Automatyczny redirect do `/admin/{swój_agent_id}/posts`
- (Albo: widzi tylko kartę swojego projektu)

### C6. Strona `/admin/[projectId]/posts` — Zarządzanie postami

**Identyczne funkcjonalności jak obecny Legitio admin:**

1. **Lista postów** — tabela z kolumnami:
   - Tytuł (link do /blog/{slug} w nowym oknie)
   - Status (published/draft — kliknięcie toggle'uje)
   - Liczba słów
   - Data (published_at lub created_at, format: dd MMM yyyy, HH:mm, timezone Warsaw)
   - Akcje: Zobacz (eye icon), Usuń (trash icon z confirm())

2. **Tworzenie posta** — dwa tryby (toggle):

   a) **Ręczny:**
   - Input: Tytuł (required)
   - Textarea: Treść (required, Markdown)
   - Flow: treść → POST /posts/format (formatowanie) → POST /posts (tworzenie ze status: published)
   - Info: "Pisz używając Markdown. System automatycznie sformatuje treść."

   b) **AI:**
   - Input: Temat artykułu (required)
   - Input: Słowo kluczowe SEO (optional)
   - Info: "AI wygeneruje artykuł. Generowanie trwa ok. 30-60 sekund."
   - Flow: POST /posts/generate { agent_id, topic, target_keyword } → response z postem → PUT /posts/{id} { status: published }

**API calls:**

```typescript
// Pobierz posty
GET /posts?page_size=50
Headers: Authorization: Bearer {token}
Response: { items: Post[] }

// Utwórz post ręcznie
POST /posts/format   { content, title }        → { formatted_content }
POST /posts          { agent_id, title, content, status: "published" }

// Generuj AI post
POST /posts/generate { agent_id, topic, target_keyword }   → Post (30-60s!)
PUT  /posts/{id}     { status: "published" }

// Toggle status
PUT  /posts/{id}     { status: "published" | "draft" }

// Usuń
DELETE /posts/{id}
```

### C7. Strona `/admin/[projectId]/schedules` — Harmonogramy

**Identyczne funkcjonalności jak obecny Legitio admin:**

1. **Info box:** Wyjaśnienie jak działa auto-publishing:
   - AI przeszukuje portale tematyczne
   - Wybiera temat, generuje artykuł SEO
   - Celery Beat sprawdza harmonogramy co godzinę
   - Posty z SEO score >= 70 → auto-publish, < 70 → draft

2. **Lista harmonogramów** — tabela:
   - Status (aktywny/nieaktywny — kliknięcie toggle'uje via `POST /schedules/{id}/toggle`)
   - Częstotliwość (z labeli poniżej)
   - Godzina publikacji (HH:00, timezone Warsaw)
   - Następna publikacja (obliczona z next_run_at)
   - Statystyki: total / published / drafts / errors
   - Akcje: Uruchom teraz (play), Edytuj (edit), Usuń (trash)

3. **Formularz (tworzenie/edycja):**

   | Pole | Typ | Opcje | Default |
   |------|-----|-------|---------|
   | Częstotliwość | select | daily, every_3_days, weekly, biweekly | daily |
   | Godzina | select | 00:00 - 23:00 | 10:00 |
   | Długość artykułu | select | short (~500), medium (~1000), long (~1500), very_long (~2000+) | long |
   | Auto-publikacja | checkbox | on/off | on |
   | Słowa kluczowe | text input | comma-separated | empty |
   | Wykluczenia | text input | comma-separated | empty |

   **Labele częstotliwości (do UI):**
   ```
   daily        → "Codziennie"
   every_3_days → "Co 3 dni"
   weekly       → "Co tydzień (poniedziałki)"
   biweekly     → "Co 2 tygodnie (1 i 15 dnia)"
   ```

4. **"Uruchom teraz"** — ważna funkcja:
   - `POST /schedules/{id}/run` → `{ task_id }`
   - Polling co 2 sekundy: `GET /schedules` i porównanie `total_posts_generated`
   - Timeout: 3 minuty
   - Po zakończeniu: komunikat sukces/szkic

**API calls:**

```typescript
// Lista
GET /schedules
Headers: Authorization: Bearer {token}
Response: { items: Schedule[] }

// Utwórz
POST /schedules {
  agent_id,
  interval: "daily" | "every_3_days" | "weekly" | "biweekly",
  publish_hour: 0-23,
  auto_publish: boolean,
  target_keywords: string[],
  exclude_keywords: string[],
  post_length: "short" | "medium" | "long" | "very_long"
}

// Edytuj
PUT /schedules/{id}  { ...same as POST body }

// Toggle aktywność
POST /schedules/{id}/toggle → { id, is_active }

// Uruchom natychmiast
POST /schedules/{id}/run → { task_id }

// Usuń
DELETE /schedules/{id}
```

### C8. Blog publiczny `/blog`

**Strona `/blog` — lista artykułów:**
- Server-side fetch (SSR/ISR): `GET /public/posts?agent_id={OLEKSIAK_AGENT_ID}&page=1&page_size=20`
- Grid kart z artykułami
- Paginacja
- SEO: meta title, description, OG tags

**Strona `/blog/[slug]` — artykuł:**
- Server-side fetch: `GET /public/posts/slug/{slug}`
- Renderowanie HTML content (artykuł jest w formacie HTML z komponentami wizualnymi)
- SEO: meta_title, meta_description z API, structured data (Article schema)

**Blog API Client (`lib/blog-api.ts`):**

```typescript
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
    { next: { revalidate: 60 } }  // 1 min cache
  );
  if (!res.ok) return null;
  return res.json();
}
```

### C9. Design system — wymagania

oleksiakconsulting.com używa:
```
Fonty:     Poppins (nagłówki, weight 600-700) + DM Sans (body, weight 400-500)
Kolory:    Navy/dark (tło), biały tekst, minimalistyczna paleta
           Akcent: jasne elementy na ciemnym tle
Karty:     Duży white space, subtelne cienie, rounded corners
Przyciski: Ze strzałkami (→), ciemne tło, hover efekty
Layout:    CSS Modules (nie Tailwind) — dopasuj do istniejącego systemu
```

Blog powinien pasować wizualnie do reszty strony oleksiakconsulting.com.
Admin panel może mieć prostszy design (nie musi pasować do landing page).

---

## 8. Kompletny kontrakt API Railway

### Endpointy z autoryzacją (Bearer token)

| # | Metoda | Endpoint | Body/Query | Response | Notatki |
|---|--------|----------|-----------|----------|---------|
| 1 | POST | `/auth/login` | `{ email, password }` | `{ access_token }` | JWT, bez wygaśnięcia info |
| 2 | POST | `/auth/register` | `{ email, password, role, agent_ids }` | User | **NOWY**, wymaga super_admin |
| 3 | GET | `/agents` | - | `{ items: Agent[] }` | **NOWY**, scoped po roli |
| 4 | POST | `/agents` | `{ name, slug, domain, ai_context, ai_prompt_template }` | Agent | **NOWY**, wymaga super_admin |
| 5 | GET | `/agents/:id` | - | Agent | **NOWY** |
| 6 | PUT | `/agents/:id` | `{ name?, domain?, ai_context?, ... }` | Agent | **NOWY**, wymaga super_admin |
| 7 | GET | `/agents/me` | - | `{ items: Agent[] }` | **NOWY**, filtr po JWT agent_ids |
| 8 | GET | `/posts` | `?page_size=50` | `{ items: Post[] }` | Istniejący, scoped po agent_ids |
| 9 | POST | `/posts` | `{ agent_id, title, content, status }` | Post | Istniejący |
| 10 | POST | `/posts/format` | `{ content, title }` | `{ formatted_content }` | Istniejący, Markdown→HTML |
| 11 | POST | `/posts/generate` | `{ agent_id, topic, target_keyword? }` | Post | Istniejący, **30-60s!** |
| 12 | PUT | `/posts/:id` | `{ status }` | Post | Istniejący |
| 13 | DELETE | `/posts/:id` | - | 204 | Istniejący |
| 14 | GET | `/schedules` | - | `{ items: Schedule[] }` | Istniejący, scoped |
| 15 | POST | `/schedules` | `{ agent_id, interval, publish_hour, auto_publish, target_keywords, exclude_keywords, post_length }` | Schedule | Istniejący |
| 16 | PUT | `/schedules/:id` | same as POST | Schedule | Istniejący |
| 17 | DELETE | `/schedules/:id` | - | 204 | Istniejący |
| 18 | POST | `/schedules/:id/toggle` | - | `{ id, is_active }` | Istniejący |
| 19 | POST | `/schedules/:id/run` | - | `{ task_id }` | Istniejący, async |

### Endpointy publiczne (bez autoryzacji)

| # | Metoda | Endpoint | Query | Response | Notatki |
|---|--------|----------|-------|----------|---------|
| 20 | GET | `/public/posts` | `?page=1&page_size=20&agent_id=UUID` | `PostListResponse` | agent_id **NOWY** (opcjonalny) |
| 21 | GET | `/public/posts/featured` | `?limit=3&agent_id=UUID` | `Post[]` | agent_id **NOWY** (opcjonalny) |
| 22 | GET | `/public/posts/slug/{slug}` | - | Post | Bez zmian |

---

## 9. Modele danych

### Post

```typescript
interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;           // HTML content (sformatowany)
  html_content?: string;
  meta_title?: string;
  meta_description?: string;
  keywords?: string[];
  status: 'draft' | 'published' | 'scheduled';
  published_at?: string;     // ISO 8601, UTC
  created_at: string;        // ISO 8601, UTC
  updated_at: string;
  agent_id: string;          // UUID agenta
  publisher_id?: string;
  word_count: number;
}
```

### PostListResponse

```typescript
interface PostListResponse {
  items: Post[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
```

### Schedule

```typescript
interface Schedule {
  id: string;
  agent_id: string;              // UUID agenta
  interval: 'daily' | 'every_3_days' | 'weekly' | 'biweekly';
  publish_hour: number;          // 0-23 (timezone: Europe/Warsaw)
  timezone: string;              // "Europe/Warsaw"
  is_active: boolean;
  auto_publish: boolean;
  target_keywords: string[];
  exclude_keywords: string[];
  post_length: 'short' | 'medium' | 'long' | 'very_long';
  last_run_at: string | null;    // ISO 8601, UTC
  next_run_at: string | null;    // ISO 8601, UTC
  total_posts_generated: number;
  successful_posts: number;
  failed_posts: number;
  created_at: string;
}
```

### Agent (NOWY)

```typescript
interface Agent {
  id: string;                    // UUID
  name: string;
  slug: string;
  domain: string;
  owner_email?: string;
  ai_context: string;
  ai_prompt_template: string;
  created_at: string;
  updated_at: string;
}
```

### User (rozszerzony)

```typescript
interface User {
  id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor';
  agent_ids: string[];           // UUIDs agentów
  created_at: string;
}
```

### JWT Payload (rozszerzony)

```typescript
interface JWTPayload {
  sub: string;                   // user_id
  email: string;
  role: 'super_admin' | 'admin' | 'editor';
  agent_ids: string[];           // UUIDs agentów
  exp: number;                   // expiration timestamp
}
```

---

## 10. Kolejność implementacji

> Jeden developer robi wszystko. Deploy przez CLI — zero pracy ręcznej.

### Krok 1: Railway Backend — multi-tenancy (KROK A)

**Narzędzia:** `git`, `railway` CLI
**Deploy:** `railway up` lub `git push` (auto-deploy)
**Repo:** Railway backend (Python/FastAPI)

- [ ] Tabela `agents` + seed dla Legitio (UUID `536c52f2-2d17-46bb-862a-de618a83ad72`)
- [ ] Rozszerzenie `users` o `role` + `agent_ids`
- [ ] Aktualizacja JWT payload (dodać role, agent_ids)
- [ ] Filtr `?agent_id=` na `GET /public/posts` i `GET /public/posts/featured`
- [ ] Nowe endpointy: `/agents` (CRUD), `/agents/me`, `/auth/register`
- [ ] Middleware scope: walidacja agent_id w `/posts` i `/schedules` vs JWT agent_ids
- [ ] Nowy agent: seed dla oleksiak-consulting (nowy UUID)
- [ ] Nowy super-admin user: rafal@oleksiakconsulting.com
- [ ] **Testy backward compatibility (sekcja A3.2) — MUSZĄ przejść po każdym deploy**

### Krok 2: Legitio minimalna zmiana — ZROBIONE

- [x] ~~Dodać `PUBLIC_BLOG_AGENT_ID` do .env na VPS~~ (zrobione 2026-01-31)
- [x] ~~Dodać agent_id filtr w `src/lib/api/blog.ts`~~ (zrobione 2026-01-31)
- [x] ~~Deploy na dev.legitio.pl~~ (zrobione 2026-01-31)
- [ ] Deploy na produkcję (legitio.pl) — po ukończeniu Kroku 1 (kiedy backend faktycznie filtruje)

### Krok 3: Next.js Admin Panel (KROK C)

**Narzędzia:** `git`, `vercel` CLI
**Deploy:** `git push origin main` (Vercel auto-deploy) lub `vercel --prod`
**Repo:** oleksiakconsulting.com (Next.js)

```bash
# Setup env na Vercel (jednorazowo, przez CLI):
vercel env add BLOG_API_URL production                # wartość: https://api-production-8286.up.railway.app/api/v1
vercel env add NEXT_PUBLIC_BLOG_API_URL production     # wartość: https://api-production-8286.up.railway.app/api/v1
vercel env add NEXT_PUBLIC_BLOG_AGENT_ID production    # wartość: <oleksiak-uuid z Kroku 1>
```

- [ ] `/admin` login page + `/api/auth` proxy route
- [ ] Auth middleware (cookie-based JWT)
- [ ] JWT decode helper (wyciąganie role, agent_ids z tokenu)
- [ ] `/admin/dashboard` — lista projektów (`GET /agents/me`)
- [ ] `/admin/[projectId]/posts` — CRUD postów (przepisanie z Svelte → React)
- [ ] `/admin/[projectId]/schedules` — CRUD harmonogramów (przepisanie z Svelte → React)
- [ ] Layout z sidebar: dynamiczna lista projektów, nawigacja, logout
- [ ] Role-based rendering: super_admin widzi dashboard, admin widzi tylko swój projekt

### Krok 4: Blog na oleksiakconsulting.com (KROK C cd.)

**Ten sam repo, ten sam deploy.**

- [ ] Blog API client (`lib/blog-api.ts`) z agent_id filtering
- [ ] `/blog` — listing page (ISR, grid kart, paginacja)
- [ ] `/blog/[slug]` — artykuł (ISR, HTML rendering, SEO)
- [ ] Homepage sekcja "Latest Insights" z `getFeaturedPosts()`
- [ ] SEO: sitemap, structured data, meta tags
- [ ] Design: dopasowanie do identyfikacji wizualnej oleksiakconsulting.com

### Krok 5: Super-admin features (opcjonalne)

- [ ] `/admin/settings/agents` — CRUD agentów (tworzenie nowych projektów)
- [ ] Dashboard ze statystykami per agent (post count, schedule status)
- [ ] Monitoring integration

---

## Uwagi końcowe

1. **Jeden developer robi KROK A + C.** Railway backend + oleksiakconsulting.com. Deploy przez `railway up` i `git push`. Zero pracy ręcznej, zero paneli webowych.
2. **KROK B jest ZROBIONY.** Legitio nie wymaga żadnych dalszych zmian. Nie dotykamy tego repo.
3. **Backward compatibility jest krytyczna.** Po każdym deploy na Railway uruchom testy z sekcji A3.2. Jeśli Legitio admin lub blog przestanie działać — rollback natychmiast.
4. **Token w cookie, nie localStorage** — Na oleksiakconsulting.com używamy httpOnly cookies (bezpieczniej). Legitio nadal używa localStorage (nie ruszamy).
5. **POST /posts/generate trwa 30-60s** — UI musi pokazywać loading spinner i nie timeout-ować fetch.
6. **Celery Beat** — Harmonogramy działają bo Celery worker na Railway sprawdza je co godzinę. Nowy agent automatycznie będzie obsługiwany (agent_id w schedule payload).
7. **Design** — Admin panel nie musi ściśle pasować do landing page oleksiakconsulting.com. Blog publiczny — tak.
8. **Żadnych credentiali do Legitio VPS.** Developer nie potrzebuje i nie powinien mieć dostępu do VPS Legitio.
