# LAMA - Implementation Brief for Claude Code
**Lead Acquisition Maturity Agent - MVP Implementation**

**Last Updated**: 2025-11-21 (v3 - Stage 2 Complete)
**Status**: Stage 2 Complete ✅ | Stage 3 Pending
**Estimated Time**: 5-6 hours (3 stages)
**Integration**: Existing form + HubSpot CRM + Resend email

---

## 🎯 WHAT ARE WE BUILDING?

**LAMA** = Darmowy, automatyczny audit strony (90 sekund) → Email z raportem → Lead generation tool

**Business Model:**
- FREE audit (koszt: €0.02) → zbierasz email
- Email zawiera CTA → konsultacja (€500-5000)
- ROI potencjalny: 250,000%+ 🚀

---

## 📦 DELIVERABLES - Co powstanie

### 1. Enhanced Form (`FinalCTA.tsx`)
Dodajemy checkbox do istniejącego formularza:
- ✅ Checkbox: "☐ Wyślij mi darmowy audit strony"
- Input URL strony (już jest pole "company")
- Email (już jest)
- Submit → trigger LAMA + HubSpot

### 2. API Endpoint (`/api/lama/audit`)
Backend który:
- Przyjmuje URL + email + form data
- Analizuje stronę (5 kategorii)
- Zapisuje/updatuje contact w HubSpot
- Generuje raport HTML
- Wysyła email (Resend)
- Loguje aktywność w HubSpot timeline

### 3. Email Report Template
HTML email z:
- Overall score (0-100)
- 5 kategorii z progress barami
- Konkretne problemy
- Koszt biznesowy ("Tracisz X% ruchu")
- CTA: "Umów konsultację" (Calendly link)
- HubSpot tracking pixel

---

## 🏗️ ARCHITECTURE - Zintegrowane z istniejącym flow

```
User Flow:
┌──────────────────────────┐
│ FinalCTA Form (existing) │
│ + Checkbox: "Audit"      │
└────────┬─────────────────┘
         │ POST /api/send-email
         │ (if audit checked)
         ↓
┌──────────────────────────────────┐
│ /api/lama/audit (NEW endpoint)   │
│ 1. Analyze 5 categories          │
│ 2. Create/update HubSpot contact │
│ 3. Generate HTML report          │
│ 4. Send email (Resend)           │
│ 5. Log to HubSpot timeline       │
└──────────┬───────────────────────┘
           │
           ├─→ HubSpot CRM (lead saved)
           └─→ User Email (report)
```

**Technologie:**
- Next.js 16 API Routes (już znasz)
- TypeScript (już używasz)
- HubSpot API (już masz setup w /api/send-email)
- Resend API (już masz setup)
- Google PageSpeed API (FREE)
- Claude API (~€0.01 per audit)

---

## 📋 IMPLEMENTATION STAGES (Start małe!)

### **STAGE 1: Proof of Concept (1.5-2h)** ✅ 2025-11-21
**Goal:** Sprawdzić czy flow działa end-to-end

**Scope:**
- [x] Modify `FinalCTA.tsx`: Add checkbox "Wyślij mi audit" ✅
- [x] Modify `/api/send-email`: Detect audit checkbox → call LAMA ✅
- [x] Create `/api/lama/audit` with 2 kategorie: ✅
  - **Visibility** (SEO - meta tags, h1, robots.txt)
  - **Performance** (PageSpeed API - LCP, CLS, mobile score)
- [x] HubSpot integration: Create contact + log activity ✅
- [x] Email template z wynikami (2 kategorie) ✅

**Output:** Działający audit z 2 kategoriami, zapisany w HubSpot, email wysłany ✅

**Files to create/modify:**
```
app/components/sections/FinalCTA.tsx  # MODIFY: Add audit checkbox
app/api/send-email/route.ts           # MODIFY: Trigger LAMA if checked
app/api/lama/audit/route.ts           # CREATE: Main audit endpoint
lib/lama/analyzers/visibility.ts      # CREATE: Visibility analysis
lib/lama/analyzers/performance.ts     # CREATE: Performance analysis
lib/lama/email-template.ts            # CREATE: HTML email generator
lib/lama/hubspot.ts                    # CREATE: HubSpot integration
```

---

### **STAGE 2: Full Audit (2-3h)** ✅ 2025-11-21
**Goal:** Dodać 3 pozostałe kategorie

**Scope:**
- [x] **Clarity** - AI analysis (Claude API) ✅
  - H1 clarity check
  - Value proposition detection
  - Navigation structure
  - Readability score
- [x] **Trust** - Credibility signals ✅
  - SSL certificate check
  - Privacy policy detection
  - Contact info presence
  - Testimonials detection
- [x] **Conversion** - Lead capture ✅
  - Form presence
  - CTA buttons count
  - Email/phone links
  - Chat widget detection
- [x] **TypeScript ES2018 upgrade** (regex `/s` support) ✅
- [x] **Google PageSpeed API key configured** ✅

**Output:** Pełny audit z 5 kategoriami ✅

**Files to add:**
```
lib/lama/analyzers/clarity.ts
lib/lama/analyzers/trust.ts
lib/lama/analyzers/conversion.ts
lib/lama/scoring.ts                  # Overall score calculator
```

---

### **STAGE 3: Polish & Testing (2h)**
**Goal:** Production-ready

**Scope:**
- [ ] Better email design (purple gradient, brand colors)
- [ ] Error handling (timeout, invalid URL, rate limiting)
- [ ] Loading UX (progress updates during 90s)
- [ ] Basic analytics (log audits to file/Google Sheets)
- [ ] Testing checklist (10+ real websites)

**Output:** Production-ready LAMA ✅

---

## 🔧 TECH DETAILS - Co musisz wiedzieć

### 1. Dependencies (już masz lub FREE):

```json
{
  "resend": "^3.0.0",           // Already installed ✅
  "anthropic": "^0.18.0",        // Need to add (~€0.01 per audit)
  "cheerio": "^1.0.0-rc.12"      // HTML parsing (FREE)
}
```

### 2. API Keys Needed:

```env
# .env.local
RESEND_API_KEY=re_xxxxx                    # Already have ✅
HUBSPOT_ACCESS_TOKEN=pat-xxxxx             # Already have ✅
ANTHROPIC_API_KEY=sk-ant-xxxxx             # Need to add
GOOGLE_PAGESPEED_API_KEY=optional          # FREE tier (25k/day)
```

### 3. External APIs Used:

| API | Purpose | Cost | Limit |
|-----|---------|------|-------|
| Google PageSpeed Insights | Performance + Mobile + SEO basics | FREE | 25,000/day |
| Anthropic Claude | Clarity analysis (H1, value prop) | ~€0.01 | Pay-as-go |
| HubSpot | CRM contact management | FREE | Free tier ✅ |
| Resend | Email delivery | FREE | 3,000/month ✅ |
| **Total per audit** | - | **€0.02** | - |

---

## 📐 FILE STRUCTURE - Gdzie co tworzymy

```
rafal-oleksiak-consulting/
│
├── app/
│   ├── components/
│   │   └── sections/
│   │       └── FinalCTA.tsx         # MODIFY: Add audit checkbox
│   │
│   └── api/
│       ├── send-email/
│       │   └── route.ts             # MODIFY: Trigger LAMA
│       └── lama/
│           └── audit/
│               └── route.ts         # STAGE 1: Main audit endpoint
│
├── lib/
│   └── lama/
│       ├── analyzers/               # Analysis functions
│       │   ├── visibility.ts        # STAGE 1
│       │   ├── performance.ts       # STAGE 1
│       │   ├── clarity.ts           # STAGE 2
│       │   ├── trust.ts             # STAGE 2
│       │   └── conversion.ts        # STAGE 2
│       │
│       ├── email-template.ts        # STAGE 1: HTML email generator
│       ├── hubspot.ts               # STAGE 1: HubSpot integration
│       ├── scoring.ts               # STAGE 2: Score calculator
│       └── types.ts                 # TypeScript types
│
└── LAMA_TESTING_CHECKLIST.md       # Testing guide
```

---

## 🎨 DESIGN GUIDELINES - Match your brand

**Colors (from your brand):**
- Moonlit Grey: `#1A1A2E` (background)
- Vivid Purple: `#7B2CBF` (primary CTA, progress bars)
- Electric Blue: `#0066FF` (accents, links)

**Typography:**
- Headings: Poppins (already loaded)
- Body: DM Sans (already loaded)

**Email Design:**
- Purple gradient header (like your hero section)
- Progress bars for each category (0-100)
- Clear CTA button (same style as website)
- Professional but friendly tone

---

## 🧪 TESTING STRATEGY - Jak sprawdzić że działa

### Stage 1 Testing (2 categories):
**Test flow:**
1. Go to oleksiakconsulting.com contact form
2. Fill form + check "Wyślij mi audit"
3. Submit
4. Check HubSpot: Contact created/updated ✅
5. Check email: Report received ✅
6. Check HubSpot timeline: "LAMA Audit sent" logged ✅

Test on 5 different URLs:
1. oleksiakconsulting.com (your site)
2. Example.com (basic site)
3. Large ecommerce (allegro.pl)
4. Broken site (missing meta tags)
5. Slow site (bad performance)

### Stage 2 Testing (all 5 categories):
Test edge cases:
- Site bez SSL
- Site bez contact info
- Site bez formularza
- Site z dużą ilością CTAs

### Stage 3 Testing (production):
- Load testing (10 concurrent audits)
- Error handling (invalid URLs, timeouts)
- Email deliverability (spam check)

---

## 🚀 DEPLOYMENT - Vercel (już masz setup)

**Vercel Setup:**
1. Push code to GitHub (already connected)
2. Vercel auto-deploys
3. Add env variable: ANTHROPIC_API_KEY (others already there)
4. Test live URL at oleksiakconsulting.com

**No Railway needed** - Vercel serverless FREE tier wystarczy

---

## 📊 SUCCESS CRITERIA - Jak sprawdzić że MVP działa

### Technical:
- [ ] Audit completes in < 90 seconds
- [ ] Email delivered within 30 seconds
- [ ] No crashes on invalid URLs
- [ ] Works on mobile

### Business:
- [ ] Report looks professional
- [ ] Score makes sense (test on 10 sites)
- [ ] CTA is clear and clickable
- [ ] User understands next steps

### Code Quality:
- [ ] TypeScript strict mode (no `any`)
- [ ] Error handling for all external calls
- [ ] Follows CLAUDE.md standards
- [ ] No console.errors in production

---

## ⚠️ IMPORTANT NOTES - Co zapamiętać

### DO's ✅
- Start with Stage 1 (tylko 2 kategorie)
- Test on real sites after each stage
- Use existing Resend setup (nie rób nowego)
- Follow CLAUDE.md coding standards
- Keep it simple - no database for MVP
- Log errors to console/file for debugging

### DON'Ts ❌
- Don't build all 5 categories at once (risk zakopania się)
- Don't optimize prematurely (najpierw sprawdź czy działa)
- Don't add database (not needed for MVP)
- Don't worry about rate limiting for MVP (add later)
- Don't overthink scoring algorithm (simple average OK)

---

## 🔗 RELATED FILES - Co przeczytać przed startem

1. **CLAUDE.md** - Coding standards (TypeScript, file structure)
2. **ROADMAP.md** - Overall project context
3. **PROJECT_SUMMARY.md** - What's already built
4. **LAMA_TESTING_CHECKLIST.md** - How to test each stage

---

## 🎯 READY TO START?

### Quick Start Command (for Rafał):

```bash
# 1. Create feature branch
git checkout -b feature/lama-audit-integration

# 2. Install new dependencies
npm install anthropic cheerio

# 3. Add Claude API key to .env.local
echo "ANTHROPIC_API_KEY=sk-ant-xxxxx" >> .env.local

# 4. Start implementation with Claude Code
# "Hey Claude, implement LAMA Stage 1 following LAMA_IMPLEMENTATION_BRIEF.md
#  Modify existing FinalCTA form to add audit checkbox.
#  Integrate with existing HubSpot setup in /api/send-email."
```

---

## 💡 TIPS FOR CLAUDE CODE

When implementing:
1. **Read this brief first** - wszystko tu jest
2. **Follow stages sequentially** - nie skip ahead
3. **Test after each file** - nie czekaj do końca
4. **Ask if unclear** - lepiej spytać niż założyć
5. **Keep PRs small** - 1 stage = 1 PR

**Expected PR sequence:**
- PR #1: LAMA Stage 1 (2 categories + email)
- PR #2: LAMA Stage 2 (3 more categories)
- PR #3: LAMA Stage 3 (polish + testing)

---

**Last Updated**: 2025-11-17
**Questions?** Check LAMA_TESTING_CHECKLIST.md or ask Rafał.
