# Plan implementacji: Admin Panel + Blog — oleksiakconsulting.com

## Kontekst

- **Railway backend** (`automatic-seo-blog`): Python/FastAPI, PostgreSQL, Celery, Redis
- **Frontend** (`rafal-oleksiak-consulting`): Next.js 16, App Router, CSS Modules, Vercel
- **Podejście**: Pragmatyczne — istniejący model `tenant_id`, bez przebudowy na `agent_ids[]`

---

## KROK A: Railway Backend — zmiany (3 zmiany)

### A1. Dodać `?agent_id=` filtr na publicznych endpointach

**Plik:** `backend/app/api/public.py`

Trzy endpointy do zmiany:

1. `GET /public/posts` — dodać opcjonalny `agent_id: Optional[UUID] = Query(None)`:
   ```python
   if agent_id:
       query = query.where(Post.agent_id == agent_id)
   ```

2. `GET /public/posts/featured` — analogicznie

3. `GET /public/posts/slug/{slug}` — bez zmian (slug jest globalnie unikalny)

**Backward compatibility:** Bez `agent_id` → zwraca wszystkie posty (jak teraz). Z `agent_id` → filtruje. Legitio już wysyła `agent_id` w query (KROK B zrobiony) — po deploy zacznie dostawać tylko swoje posty.

### A2. Stworzyć tenanta Oleksiak Consulting + agenta + super-admin usera

Skrypt seed (uruchomiony raz po deploy):

```python
# 1. Stworzyć tenant "Oleksiak Consulting"
#    slug: "oleksiak-consulting"
#    domain: "oleksiakconsulting.com"

# 2. Stworzyć agenta dla tego tenanta
#    name: "Oleksiak Blog Agent"
#    expertise: "ecommerce, CRM, marketing automation"

# 3. Stworzyć super-admin usera
#    email: rafal@oleksiakconsulting.com
#    role: superadmin
#    tenant_id: None (superadmin nie jest bound do tenanta)
```

Alternatywnie: przez istniejące API endpointy (POST /tenants, POST /agents, POST /auth/register) po zalogowaniu jako superadmin.

### A3. Dodać `tenant_id` do GET /agents/me (lub stworzyć endpoint)

Sprawdzić czy `/agents/me` istnieje. Spec go wymaga. Aktualnie istnieje `/tenants/me` i `GET /agents` (filtruje po tenant). Jeśli `/agents/me` nie istnieje — dodać jako alias do `GET /agents` z filtrem po user's tenant.

### A3.2. Testy backward compatibility (po KAŻDYM deploy)

6 curl testów z sekcji A3.2 specyfikacji — uruchomić po każdym push do Railway.

---

## KROK C: Next.js — Admin Panel + Blog

### C1. Env variables (Vercel + .env.local)

```
BLOG_API_URL=https://api-production-8286.up.railway.app/api/v1
NEXT_PUBLIC_BLOG_API_URL=https://api-production-8286.up.railway.app/api/v1
NEXT_PUBLIC_BLOG_AGENT_ID=<oleksiak-agent-uuid>
```

### C2. Auth system

**Pliki nowe:**
- `middleware.ts` — auth guard na `/admin/*`
- `app/api/auth/route.ts` — proxy do Railway `/auth/login`, ustawia httpOnly cookie
- `app/lib/auth/session.ts` — JWT decode helper, cookie helpers

**Flow:**
1. User → `/admin` (login page)
2. POST `/api/auth` → proxy do Railway → JWT w httpOnly cookie
3. Middleware sprawdza cookie na `/admin/*`
4. JWT dekodowany → role, tenant_id dostępne w server components

### C3. Admin panel — struktura plików

```
app/admin/
├── page.tsx                     # Login page
├── layout.tsx                   # Auth guard wrapper + sidebar
├── dashboard/
│   └── page.tsx                 # Grid projektów (GET /agents lub /tenants)
├── [projectId]/
│   ├── layout.tsx               # Nagłówek projektu
│   ├── posts/
│   │   └── page.tsx             # Lista postów + tworzenie (ręczne + AI)
│   └── schedules/
│       └── page.tsx             # CRUD harmonogramów
└── lib/
    └── admin-api.ts             # Authenticated API client
```

### C4. Admin pages — szczegóły

#### `/admin` — Login
- Email + hasło → POST `/api/auth` → cookie → redirect `/admin/dashboard`
- Prosty design (nie musi pasować do landing page)

#### `/admin/dashboard`
- Super-admin: grid kart z projektami (z GET /agents lub /tenants)
- Admin: redirect do `/admin/{agent_id}/posts`
- Każda karta: nazwa, domena, stats

#### `/admin/[projectId]/posts`
- Tabela: tytuł, status (toggle), word count, data, akcje
- Tworzenie: toggle ręczny/AI
  - Ręczny: tytuł + markdown → POST /posts/format → POST /posts
  - AI: temat + keyword → POST /posts/generate (30-60s, spinner!)
- Toggle status: PUT /posts/{id} {status}
- Usunięcie: DELETE /posts/{id} z confirm()

#### `/admin/[projectId]/schedules`
- Tabela harmonogramów z toggle aktywności
- Formularz: interval, hour, post_length, auto_publish, keywords
- "Uruchom teraz": POST /schedules/{id}/run → polling

### C5. Blog publiczny

**Pliki nowe:**
```
app/blog/
├── page.tsx           # Lista artykułów (ISR 5min)
├── [slug]/
│   └── page.tsx       # Artykuł (ISR 1min)
└── layout.tsx         # Blog layout (nawigacja, breadcrumbs)

app/lib/
└── blog-api.ts        # Public blog API client z agent_id filtering
```

#### `/blog` — listing
- SSR/ISR: `GET /public/posts?agent_id={AGENT_ID}&page=1&page_size=20`
- Grid kart (thumbnail, tytuł, excerpt, data)
- Paginacja
- Design: dopasowany do landing page (CSS Modules, fonty Poppins/DM Sans)

#### `/blog/[slug]` — artykuł
- SSR/ISR: `GET /public/posts/slug/{slug}`
- Renderowanie HTML content
- SEO: meta_title, meta_description, structured data (Article schema)
- Design: ciemne tło, biały tekst, gradient accenty

### C6. Design system

- **Admin panel:** Prosty, funkcjonalny. Ciemne sidebar, jasna treść. CSS Modules.
- **Blog publiczny:** Pasuje do landing page:
  - Tło: `#2D3142` (moonlit grey)
  - Gradient: `#7B2CBF` → `#0066FF`
  - Fonty: Poppins (nagłówki), DM Sans (body)
  - CSS Modules (jak reszta projektu)

---

## Kolejność implementacji

1. **Railway: agent_id filter** → deploy → testy backward compat
2. **Railway: seed data** (tenant, agent, super-admin) → testy
3. **Next.js: auth** (middleware, login, cookie, JWT decode)
4. **Next.js: admin layout** (sidebar, guard, routing)
5. **Next.js: admin posts** (CRUD, tabela, tworzenie)
6. **Next.js: admin schedules** (CRUD, toggle, run)
7. **Next.js: blog API client** (z agent_id)
8. **Next.js: blog listing** (/blog)
9. **Next.js: blog article** (/blog/[slug])
10. **Next.js: dashboard** (grid projektów)
11. **Vercel env vars** + deploy produkcyjny
