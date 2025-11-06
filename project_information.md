# 📦 PEŁNA DOKUMENTACJA PROJEKTU - DEPLOYMENT NA VERCEL
## Domena: oleksiakconsulting.com

---

## 1. ✅ TECHNOLOGIA I STRUKTURA

**Framework:**
- **Next.js 16.0.1** (App Router + Turbopack)
- **React 19.2.0**
- **React DOM 19.2.0**

**Język:**
- **TypeScript 5.9.3** (strict mode)

**Struktura folderów:**
```
rafal-oleksiak-consulting/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   └── send-email/           # Email endpoint
│   │       └── route.ts
│   ├── components/               # React Components
│   │   ├── sections/             # Page sections (8 sections)
│   │   └── ui/                   # Reusable UI components
│   ├── lib/                      # Utilities
│   ├── types/                    # TypeScript types
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Global styles
├── assets/                       # Images/media
│   └── roc-bio.png
├── public/                       # Static files
│   └── images/
├── .env.local                    # Environment variables (local)
├── next.config.ts                # Next.js config
├── tailwind.config.ts            # Tailwind config
├── tsconfig.json                 # TypeScript config
├── postcss.config.mjs            # PostCSS config
└── package.json                  # Dependencies
```

---

## 2. ✅ BUILD I SKRYPTY

**Komendy build:**
```bash
npm run build          # Production build
npm run dev           # Development server
npm run start         # Production server
npm run lint          # ESLint check
```

**Output directory:**
- **`.next/`** - Next.js build output (statyczne + server-side)

**Build verification:**
```
✅ Build successful - Compiled in 2.0s
✅ TypeScript check passed
✅ Static pages generated (4/4)
✅ Routes:
   - / (Static)
   - /_not-found (Static)
   - /api/send-email (Dynamic API Route)
```

**Pre-build steps:**
- ❌ Brak - Next.js automatycznie instaluje dependencies

---

## 3. ✅ ZMIENNE ŚRODOWISKOWE

**Plik:** `.env.local` (lokalnie) → Vercel Environment Variables (production)

**Wymagane zmienne:**
```bash
RESEND_API_KEY=         # Resend API key
FROM_EMAIL=             # Sender email address
TO_EMAIL=               # Recipient email address
```

**Różnice dev/production:**
- ❌ Brak - te same zmienne dla obu środowisk

**Użycie w kodzie:**
- `app/api/send-email/route.ts:4` - `process.env.RESEND_API_KEY`
- `app/api/send-email/route.ts:48` - `process.env.FROM_EMAIL`
- `app/api/send-email/route.ts:49` - `process.env.TO_EMAIL`

**⚠️ WAŻNE dla Vercel:**
```
1. Settings → Environment Variables
2. Dodaj wszystkie 3 zmienne:
   - RESEND_API_KEY: re_W74iEMma_MVcq7UwadWFyKQqM4a6ixGD3
   - FROM_EMAIL: contact@oleksiakconsulting.com
   - TO_EMAIL: contact@oleksiakconsulting.com
3. Wybierz: Production, Preview, Development
```

---

## 4. ✅ RESEND API INTEGRATION

**Lokalizacja kodu:**
- **API Route:** `app/api/send-email/route.ts`
- **SDK:** `resend` v6.4.1

**Endpoint:**
```
POST /api/send-email
Content-Type: application/json
```

**Request body (formType: 'consultation'):**
```json
{
  "formType": "consultation",
  "fullName": "string",
  "email": "string",
  "website": "string",
  "challenge": "string",
  "consent": boolean
}
```

**Request body (formType: 'proposal'):**
```json
{
  "formType": "proposal",
  "email": "string",
  "website": "string",
  "needs": "string",
  "marketing": boolean
}
```

**Komponenty z formularzami:**
- `app/components/sections/FinalCTA.tsx:61-93` - Formularz konsultacji
- `app/components/sections/Collaboration.tsx:279-305` - Formularz custom proposal

**Email templates:**
- HTML z inline styles
- Brand colors (#7B2CBF purple accent)
- Responsywne max-width: 600px

---

## 5. ✅ GITHUB REPOSITORY

**URL:**
```
https://github.com/zurychhh/rafal-oleksiak-consulting.git
```

**Branching:**
- `main` - branch główny (✅ istnieje)
- `development` - branch deweloperski
- `claude/init-consulting-website-011CUbrmquMVjnfDzpdSEgSJ` - current working branch

**⚠️ Status:**
```
❌ NIE WSZYSTKO SPUSHOWANE
- 14 modified files
- 9 untracked files (nowe sekcje: AchievementsTicker, FinalCTA, Footer, ProcessTimeline, API route)
```

**Przed deploymentem na Vercel:**
```bash
git add .
git commit -m "Add final sections: AchievementsTicker, FinalCTA, Footer, ProcessTimeline + Resend integration"
git push origin main
```

**.gitignore - prawidłowo skonfigurowany:**
```
✅ /node_modules
✅ /.next/
✅ /out/
✅ .env*.local
✅ .env
✅ .vercel
```

---

## 6. ✅ DEPENDENCJE

**Dependencies (production):**
```json
{
  "next": "^16.0.1",           // Framework
  "react": "^19.2.0",          // UI library
  "react-dom": "^19.2.0",      // React DOM
  "resend": "^6.4.1"           // Email service SDK
}
```

**DevDependencies:**
```json
{
  "@tailwindcss/postcss": "^4.1.16",
  "@types/node": "^24.9.2",
  "@types/react": "^19.2.2",
  "@types/react-dom": "^19.2.2",
  "autoprefixer": "^10.4.21",
  "eslint": "^9.38.0",
  "eslint-config-next": "^16.0.1",
  "postcss": "^8.5.6",
  "tailwindcss": "^4.1.16",
  "typescript": "^5.9.3"
}
```

**Peer dependencies:**
- ❌ Brak

**Node.js version:**
```
Testowane: v24.9.0
Minimalna: >=18.17.0 (Next.js 16 requirement)
Zalecana dla Vercel: 20.x LTS
```

**⚠️ Vercel Node.js Settings:**
```
Settings → General → Node.js Version: 20.x (zalecane)
```

---

## 7. ✅ ROUTING I NAWIGACJA

**Typ:** Single Page Application (SPA)

**Routes:**
```
/ (homepage)              - Static pre-rendered
/api/send-email          - API route (dynamic)
/_not-found              - 404 page (static)
```

**Nawigacja:**
- **Client-side:** Scroll-to-section (#id anchors)
- **Sections:**
  - `#bio`
  - `#services`
  - `#collaboration`
  - `#case-studies`
  - `#process`
  - `#contact`

**Navbar links (app/components/sections/Navbar.tsx):**
```tsx
<a href="#bio">About</a>
<a href="#services">Services</a>
<a href="#collaboration">Work With Me</a>
<a href="#case-studies">Case Studies</a>
<a href="#contact">Contact</a>
```

**External links:**
- Calendly: `https://calendly.com/rafaloleksiakconsulting/30min`
- LinkedIn: `https://www.linkedin.com/in/rafal-oleksiak`
- Email: `contact@oleksiakconsulting.com`

---

## 8. ✅ PLIKI STATYCZNE

**Lokalizacja assets:**
```
/assets/roc-bio.png          - Bio section photo
/public/images/              - Future static images
```

**External resources:**
```css
/* Google Fonts - app/layout.tsx */
- Poppins (headlines): weights 400, 500, 600, 700, 800
- DM Sans (body): weights 400, 500, 600, 700
```

**Logo:**
- **Kod SVG** (inline w `app/components/ui/Logo.tsx`)
- ❌ Brak pliku graficznego

**Obrazy w projekcie:**
- `roc-bio.png` - imported w `Bio.tsx`

**⚠️ Optymalizacja dla Vercel:**
- Wszystkie obrazy przez Next.js `<Image>` component (auto-optimization)
- Brak CDN dependencies

---

## 9. ✅ KONFIGURACJA SPECJALNA

**next.config.ts:**
```typescript
const nextConfig: NextConfig = {
  reactStrictMode: true,  // React strict mode enabled
};
```

**Custom headers/redirects:**
- ❌ Brak

**Production-specific settings:**
- ❌ Brak - defaultowe Next.js settings

**tailwind.config.ts:**
```typescript
// Custom color palette
colors: {
  "moonlit-grey": "#2D3142",
  "vivid-purple": "#7B2CBF",
  "electric-blue": "#0066FF",
  white: "#FFFFFF",
  "soft-lavender": "#E8E3F7",
}

// Custom fonts
fontFamily: {
  poppins: ["var(--font-poppins)", "sans-serif"],
  "dm-sans": ["var(--font-dm-sans)", "sans-serif"],
}
```

**TypeScript config (tsconfig.json):**
- Strict mode enabled
- Path aliases: `@/*` → `./app/*`

---

## 10. ✅ TESTY I WERYFIKACJA

**Build lokalnie:**
```bash
✅ npm run build - SUKCES
✅ Compiled successfully in 2.0s
✅ TypeScript check - PASSED
✅ Static pages generated: 4/4
✅ No errors
```

**Build output:**
```
Route (app)
┌ ○ /                    [Static - 0.3s generation]
├ ○ /_not-found          [Static]
└ ƒ /api/send-email      [Dynamic API Route]

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

**Dev server:**
```
✅ Running bez błędów
✅ GET / 200 responses
⚠️ Warning: Tailwind utility class 'font-dm-sans' (minor, nie blokujące)
⚠️ Warning: Workspace root inference (nie blokujące)
```

**Console errors:**
- ❌ Brak błędów runtime
- ❌ Brak błędów TypeScript
- ❌ Brak błędów ESLint

---

## 🚀 INSTRUKCJE DEPLOYMENT NA VERCEL

### Krok 1: Commit i Push do GitHub
```bash
cd ~/projects/rafal-oleksiak-consulting
git add .
git commit -m "Production-ready: All sections + Resend integration"
git push origin main
```

### Krok 2: Import projektu do Vercel
1. Wejdź na **vercel.com**
2. Kliknij **"Add New Project"**
3. Import z GitHub: `zurychhh/rafal-oleksiak-consulting`
4. Branch: `main`
5. Framework Preset: **Next.js** (auto-detected)

### Krok 3: Konfiguracja Build Settings
```
Build Command: npm run build (default)
Output Directory: .next (default)
Install Command: npm install (default)
Root Directory: ./ (default)
```

### Krok 4: Environment Variables
Dodaj w **Settings → Environment Variables**:
```
RESEND_API_KEY=re_W74iEMma_MVcq7UwadWFyKQqM4a6ixGD3
FROM_EMAIL=contact@oleksiakconsulting.com
TO_EMAIL=contact@oleksiakconsulting.com
```
✅ Apply to: Production, Preview, Development

### Krok 5: Custom Domain
1. **Settings → Domains**
2. Dodaj: `oleksiakconsulting.com`
3. Dodaj: `www.oleksiakconsulting.com` (redirect → oleksiakconsulting.com)
4. Skonfiguruj DNS:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21 (Vercel IP)

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### Krok 6: Deploy
1. Kliknij **"Deploy"**
2. Poczekaj ~2-3 minuty
3. Sprawdź deployment URL
4. Test formularza kontaktowego

### Krok 7: Weryfikacja
```bash
✅ Sprawdź: https://oleksiakconsulting.com
✅ Test formularza: FinalCTA section
✅ Test formularza: Collaboration section
✅ Sprawdź Resend Dashboard: https://resend.com/emails
✅ Sprawdź SSL: Powinien być auto-provisioned przez Vercel
```

---

## 📋 CHECKLIST PRZED DEPLOYMENT

- [ ] `git add .` - dodanie wszystkich zmian
- [ ] `git commit` - commit zmian
- [ ] `git push origin main` - push do GitHub
- [ ] Import projektu do Vercel
- [ ] Dodanie 3 environment variables
- [ ] Konfiguracja custom domain
- [ ] Deploy projektu
- [ ] Test formularzy kontaktowych
- [ ] Weryfikacja emaili w Resend Dashboard
- [ ] Sprawdzenie SSL certificate

---

## ⚠️ POTENCJALNE PROBLEMY

**1. Email nie wysyła się:**
- Sprawdź Resend API key w Vercel Environment Variables
- Sprawdź czy `contact@oleksiakconsulting.com` jest zweryfikowany w Resend
- Sprawdź Resend Dashboard → Logs

**2. Build fails:**
- Sprawdź czy wszystkie pliki są spushowane do GitHub
- Sprawdź czy `.env.local` NIE jest w repo (gitignore)
- Sprawdź Node.js version w Vercel (20.x)

**3. Formularz nie działa:**
- Sprawdź Network tab w DevTools
- Sprawdź czy `/api/send-email` endpoint zwraca 200
- Sprawdź console errors

---

## 📞 KONTAKT TECHNICZNY

**Repository:** https://github.com/zurychhh/rafal-oleksiak-consulting
**Vercel Dashboard:** https://vercel.com/dashboard
**Resend Dashboard:** https://resend.com/emails
**Domain:** oleksiakconsulting.com

**Next steps po deployment:**
1. ✅ Test wszystkich formularzy
2. ✅ Weryfikacja emaili w Resend
3. ✅ Test Calendly integration (4 CTA buttons)
4. ✅ Mobile responsiveness check
5. ✅ Performance audit (Lighthouse)
