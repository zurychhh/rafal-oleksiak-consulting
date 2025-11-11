# ROADMAP.md - Rafał Oleksiak Consulting Website

**Last Updated**: 2025-11-11  
**Project Phase**: Post-Launch Optimization  
**Current Focus**: Foundation (Week 1-2)

---

## 📊 Progress Tracking Convention

```markdown
[ ] = Todo (no timestamp)
[-] = In Progress (add 🏗️ YYYY-MM-DD when started)
[x] = Completed (add ✅ YYYY-MM-DD when finished)
```

**Timestamps**: Use `date +"%Y-%m-%d"` for consistency

---

## 🔥 IMMEDIATE (Before Next PR)

### Security & Setup
- [ ] **Rotate Resend API Key**
  - Reason: Best practice after project review
  - Action: 
    1. Generate new key in Resend dashboard
    2. Add to Vercel environment variables
    3. Update `.env.local` locally
    4. Test email sending
  - Owner: Rafał
  - Estimate: 10 minutes

- [ ] **Create .env.example**
  - Reason: Onboarding future developers
  - Content:
    ```
    # Email Service (Resend)
    RESEND_API_KEY=re_xxxxxxxxxxxxx
    ```
  - Owner: Rafał
  - Estimate: 5 minutes

---

## 📅 WEEK 1-2: Foundation

**Goal**: Data-driven decision making + Organic visibility  
**Success Metrics**: Analytics collecting data, SEO metadata live

### Analytics Implementation
- [ ] **Google Analytics 4 Setup**
  - Install `@next/third-parties`
  - Configure GA4 property
  - Add tracking to `app/layout.tsx`
  - Set up key events:
    - CTA button clicks (hero, footer)
    - Calendly link clicks
    - Form submissions
    - Scroll depth (25%, 50%, 75%, 100%)
  - Test in GA4 DebugView
  - **Business Value**: Understand user behavior, optimize conversion funnel
  - Owner: Rafał
  - Estimate: 2-3 hours

- [ ] **Hotjar Integration**
  - Sign up for Hotjar account (free tier: 35 sessions/day)
  - Add tracking code to `app/layout.tsx`
  - Configure:
    - Heatmaps (hero section, services section)
    - Session recordings (focus on mobile)
    - Surveys (exit intent: "What stopped you from booking?")
  - **Business Value**: Visual insights into UX issues, form abandonment reasons
  - Owner: Rafał
  - Estimate: 1-2 hours

- [ ] **Vercel Analytics Enhancement**
  - Enable Web Vitals tracking (already have Vercel)
  - Set up performance monitoring dashboard
  - Configure alerts for performance degradation
  - **Business Value**: Maintain 90+ Lighthouse score
  - Owner: Rafał
  - Estimate: 30 minutes

### SEO Foundation
- [ ] **Enhanced Metadata (app/layout.tsx)**
  - Title template: `%s | Rafal Oleksiak Consulting`
  - Description: 155 chars, keyword-rich
  - Open Graph tags (title, description, image)
  - Twitter Card tags
  - Canonical URL
  - Robots: `index, follow`
  - **Business Value**: 50-100% organic traffic increase in 6 months
  - Owner: Rafał
  - Estimate: 1 hour

- [ ] **Structured Data (JSON-LD)**
  - Schema.org types:
    - Organization
    - Person (Rafał)
    - Service (each consulting service)
    - Review (future case studies)
  - Test with Google Rich Results Test
  - **Business Value**: Rich snippets in Google, better CTR
  - Owner: Rafał
  - Estimate: 2 hours

- [ ] **XML Sitemap**
  - Create `app/sitemap.ts` (Next.js dynamic sitemap)
  - Include all pages/sections
  - Submit to Google Search Console
  - **Business Value**: Faster indexing, better crawl efficiency
  - Owner: Rafał
  - Estimate: 30 minutes

- [ ] **robots.txt Optimization**
  - Create `public/robots.txt`
  - Allow all, add sitemap reference
  - Block unnecessary paths (/_next/static)
  - **Business Value**: Efficient crawl budget
  - Owner: Rafał
  - Estimate: 15 minutes

### Project Management Setup
- [ ] **Linear MCP Integration**
  - Install: `claude mcp add --transport http linear https://mcp.linear.app/mcp`
  - Authenticate with Linear account
  - Create Linear project: "Rafał Consulting Website"
  - Set up labels:
    - Priority: High/Medium/Low
    - Type: Feature/Bug/Tech/Content
  - Test: "List all issues in Website project"
  - **Business Value**: Automated task management, zero context switching
  - Owner: Rafał
  - Estimate: 20 minutes

- [ ] **Sync ROADMAP.md ↔ Linear**
  - Strategy:
    - Linear = high-level milestones (client-facing)
    - ROADMAP.md = implementation details (technical)
  - Workflow:
    1. New Linear issue created
    2. Technical breakdown added to ROADMAP.md
    3. Claude Code implements
    4. Update both Linear + ROADMAP.md status
  - **Business Value**: Single source of truth, audit trail
  - Owner: Rafał
  - Estimate: 1 hour (setup + documentation)

---

## 📅 WEEK 3-4: Optimization & Lead Gen

**Goal**: Convert traffic into leads  
**Success Metrics**: 30-50% increase in conversion rate

### Lead Magnet Creation
- [ ] **CRM ROI Calculator (Interactive Tool)**
  - Tech stack:
    - React Hook Form (form handling)
    - Tailwind (styling)
    - Recharts (visualization)
    - Resend (email delivery)
    - Vercel KV (persist results)
  - Features:
    - Input: Current marketing spend, conversion rate, avg deal size
    - Output: ROI projection with CRM automation
    - Generate PDF report
    - Email report + capture lead
  - Design: Matches Tech-Forward Innovator theme
  - **Business Value**: 40% of visitors engage with calculators (industry avg)
  - Owner: Rafał
  - Estimate: 8-10 hours

- [ ] **Lead Magnet Landing Page**
  - URL: `/calculator` or `/crm-roi`
  - SEO optimized
  - Clear value proposition
  - Social proof (testimonial)
  - CTA: "Calculate Your ROI"
  - **Business Value**: Dedicated conversion funnel
  - Owner: Rafał
  - Estimate: 3-4 hours

### Email Automation
- [ ] **Resend Email Sequences**
  - Sequence 1: Calculator Download
    - Day 0: Welcome + PDF playbook
    - Day 3: Case study (Allegro/Booksy)
    - Day 7: Calendly invitation (soft CTA)
    - Day 14: "How we work" process overview
  - Sequence 2: Contact Form Submission
    - Immediate: Confirmation email
    - Day 1: "What to expect" email
    - Day 3: Case study relevant to their query
  - **Business Value**: 30% increase in consultation bookings
  - Owner: Rafał
  - Estimate: 4-5 hours

- [ ] **Email Templates (react-email)**
  - Install `@react-email/components`
  - Create branded templates:
    - Welcome email
    - Case study email
    - Consultation reminder
  - Preview locally with `email dev`
  - **Business Value**: Professional brand consistency
  - Owner: Rafał
  - Estimate: 3-4 hours

### Code Quality Improvements
- [ ] **Refactor Floating Labels (FinalCTA.tsx)**
  - Current: Uses `querySelector` (anti-pattern)
  - New: React state + refs
  - Pattern:
    ```typescript
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    ```
  - Test: All form states work correctly
  - **Business Value**: Better maintainability, React best practices
  - Owner: Rafał
  - Estimate: 1 hour

- [ ] **Add Error Boundaries**
  - Create `app/error.tsx` (page-level errors)
  - Create `app/global-error.tsx` (layout errors)
  - Sentry integration (optional, Month 2)
  - Test: Throw error, verify fallback UI
  - **Business Value**: Better UX, no white screen of death
  - Owner: Rafał
  - Estimate: 1-2 hours

- [ ] **Email Validation Enhancement**
  - Current: Basic regex
  - New: 
    - Email syntax validation
    - Disposable email detection
    - (Optional) DNS MX record check
  - Library: `email-validator` or `validator.js`
  - **Business Value**: Reduce fake/spam submissions
  - Owner: Rafał
  - Estimate: 1 hour

---

## 📅 MONTH 2: Content & Authority

**Goal**: LinkedIn thought leadership + case studies  
**Success Metrics**: 10+ inbound leads from LinkedIn, 3 published case studies

### Case Studies
- [ ] **Case Study #1: Jameel Motors**
  - Template: Challenge → Solution (zawsze syntezuj!) → Results
  - Hard numbers: Marketing automation % revenue contribution
  - Testimonial + photo
  - Format: Dedicated page + PDF download
  - Distribution: LinkedIn carousel, email sequence
  - **Business Value**: Social proof = 30-50% conversion boost
  - Owner: Rafał
  - Estimate: 6-8 hours

- [ ] **Case Study #2: [Previous Client]**
  - Same template as above
  - Focus on different metric (e.g., time saved, ROI)
  - **Business Value**: Multiple proof points
  - Owner: Rafał
  - Estimate: 4-6 hours (reuse template)

- [ ] **Case Study #3: [Previous Client]**
  - Focus on industry-specific challenge
  - **Business Value**: Industry authority
  - Owner: Rafał
  - Estimate: 4-6 hours

### LinkedIn Authority Building
- [ ] **90-Day Content Calendar**
  - Content pillars:
    1. Methodology (2x/week): "Zawsze syntezuj" framework
    2. Case study snippets (1x/week): Before/after screenshots
    3. Industry commentary (1x/week): Martech trends
  - Tools: Taplio/Shield for scheduling
  - Design: Canva templates (brand consistency)
  - **Business Value**: Inbound C-suite leads
  - Owner: Rafał
  - Estimate: 4 hours (initial setup) + 2 hours/week (content creation)

- [ ] **LinkedIn Profile Optimization**
  - Headline: "CRM & Marketing Automation Consultant | 2-5x Revenue Growth"
  - Featured: Case studies, calculator link
  - About: "Zawsze syntezuj" methodology
  - **Business Value**: First impression for inbound leads
  - Owner: Rafał
  - Estimate: 2 hours

### Blog Setup
- [ ] **Next.js MDX Blog**
  - Install `@next/mdx`
  - Create `app/blog/` directory
  - Blog post template
  - RSS feed
  - Syntax highlighting for code examples
  - **Business Value**: Long-term SEO, thought leadership
  - Owner: Rafał
  - Estimate: 4-6 hours

- [ ] **First 2 Blog Posts**
  - Post 1: "5 Signs Your CRM Is Costing You Money"
  - Post 2: "Marketing Automation ROI Calculator Guide"
  - Target: 1500-2000 words each
  - SEO optimized (keywords, meta, internal links)
  - **Business Value**: Organic long-tail traffic
  - Owner: Rafał
  - Estimate: 6-8 hours per post

---

## 📅 MONTH 3: Partnerships & Scale

**Goal**: Exponential lead gen via partnerships  
**Success Metrics**: 5 active partners, 10+ referral leads

### Partnership Program
- [ ] **Partner One-Pager**
  - Value proposition: Co-branded projects, 20% rev share
  - Target partners:
    - Web dev agencies (lack CRM expertise)
    - ERP implementers (Salesforce, MS Dynamics)
    - Management consultancies
  - Success stories
  - **Business Value**: Zero CAC leads
  - Owner: Rafał
  - Estimate: 3-4 hours

- [ ] **Referral Agreement Template**
  - Legal review (optional)
  - Commission structure
  - Terms & conditions
  - **Business Value**: Clear partnership terms
  - Owner: Rafał
  - Estimate: 2-3 hours

- [ ] **Partner Outreach (10 targets)**
  - Personalized emails
  - LinkedIn InMails
  - Coffee meetings
  - **Business Value**: 10 partners × 2 leads/year = 20 qualified leads
  - Owner: Rafał
  - Estimate: 1 hour per partner (10 hours total)

### Advanced Features
- [ ] **Chatbot Integration (Crisp/Intercom)**
  - 24/7 FAQ answering
  - Lead qualification
  - Calendly booking from chat
  - **Business Value**: 15-20% more consultations booked
  - Owner: Rafał
  - Estimate: 3-4 hours

- [ ] **Personalization Engine**
  - Dynamic content based on:
    - Traffic source (LinkedIn vs Google)
    - Industry (if detectable)
    - Page scroll behavior
  - A/B test hero CTAs
  - **Business Value**: 10-20% conversion rate increase
  - Owner: Rafał
  - Estimate: 6-8 hours

---

## 📅 MONTH 4+: Testing & Automation

**Goal**: Bulletproof quality, CI/CD automation  
**Success Metrics**: 90% test coverage, zero regression bugs

### Testing Infrastructure
- [ ] **Jest + React Testing Library**
  - Unit tests for components
  - Test critical user flows
  - Coverage target: 80%+
  - **Business Value**: Prevent regressions
  - Owner: Rafał
  - Estimate: 8-10 hours

- [ ] **Playwright E2E Tests**
  - Test scenarios:
    - Navigation flow (desktop + mobile)
    - Contact form submission
    - Calendly booking click
  - Run on: Chrome, Safari, Firefox, Mobile Safari
  - **Business Value**: Catch cross-browser bugs
  - Owner: Rafał
  - Estimate: 6-8 hours

### CI/CD Automation
- [ ] **GitHub Actions Workflow**
  - On PR:
    - Run ESLint
    - Run TypeScript check
    - Run tests
    - Build preview
    - Lighthouse audit
  - On merge to main:
    - Deploy to Vercel
    - Run E2E tests
  - **Business Value**: No manual QA, faster shipping
  - Owner: Rafał
  - Estimate: 4-6 hours

- [ ] **Automated Dependency Updates (Dependabot)**
  - Weekly PRs for updates
  - Auto-merge patch versions
  - Security alerts
  - **Business Value**: Stay secure, up-to-date
  - Owner: Rafał
  - Estimate: 1 hour

---

## 📊 Success Metrics Dashboard

### Week 2 Baseline (to establish)
- [ ] Bounce rate (mobile vs desktop)
- [ ] Average time on page
- [ ] CTA click-through rate
- [ ] Form submission rate
- [ ] Form abandonment rate
- [ ] Traffic sources
- [ ] Device breakdown

### Month 2-3 Targets (vs baseline)
- [ ] Bounce rate: -20%
- [ ] Conversion rate: +30% (case studies impact)
- [ ] Time on site: +25%
- [ ] Organic traffic: +50%
- [ ] LinkedIn inbound leads: 10+
- [ ] Partner referrals: 5+

---

## 🎯 Currently In Progress

(Move tasks here when starting work, add 🏗️ timestamp)

**Example:**
- [-] **Google Analytics 4 Setup** 🏗️ 2025-11-11
  - Status: GA4 property created, installing @next/third-parties
  - Blocker: None
  - Next: Add tracking code to layout.tsx

---

## ✅ Recently Completed

- [x] **Project Structure Documentation** ✅ 2025-11-11
  - Created CLAUDE.md with all coding standards
  - Created ROADMAP.md with prioritized tasks
  - Set up .claude/ directory structure

- [x] **Complete Mobile RWD Optimization** ✅ 2025-11-09
  - 20+ components made responsive
  - Lighthouse mobile score: 90+
  - See PROJECT_SUMMARY.md for details

- [x] **Hero Section Simplification** ✅ 2025-11-09
  - Removed gradient text, tag badge
  - Improved white space, visual hierarchy
  - 15% reduction in cognitive load (estimated)

- [x] **Mobile Navigation Fix** ✅ 2025-11-09
  - 8 iterations to solve scroll issue
  - Removed lazy loading from navigable sections
  - 100% reliable anchor navigation

- [x] **Performance Optimization** ✅ 2025-11-07
  - Local font hosting (70% size reduction)
  - Dynamic imports + code splitting
  - Critical CSS inlining
  - LCP < 2.5s ✅

---

## 🔗 Integration with Linear

### Workflow
1. **High-level planning in Linear**
   - Milestones: "Q4 2025 - Foundation"
   - Epics: "Analytics Implementation", "SEO Foundation"
   - Labels: Priority (High/Medium/Low), Type (Feature/Bug/Tech)

2. **Technical breakdown in ROADMAP.md**
   - Linear issue: "Implement analytics"
   - ROADMAP.md: Detailed subtasks (GA4, Hotjar, Vercel)

3. **Claude Code implementation**
   - Read Linear issue via MCP: `"Show issue WEB-123"`
   - Read ROADMAP.md for technical details
   - Implement + create PR

4. **Sync status**
   - Update ROADMAP.md: Move to In Progress (🏗️ timestamp)
   - Update Linear: Change status to "In Progress"
   - On completion: Update both (✅ timestamp + "Done")

### Example Command (Claude Code + Linear MCP)
```bash
claude
"List all issues in 'Website' project with label 'Priority: High' and status 'Ready to Dev'"
# Returns: 3 issues
# 1. WEB-45: Implement GA4 tracking
# 2. WEB-46: Add SEO metadata
# 3. WEB-47: Create .env.example

"Implement WEB-45 following the plan in ROADMAP.md"
# Claude reads ROADMAP.md → implements → creates PR → updates Linear
```

---

## 📝 Notes & Decisions

### 2025-11-11: Hybrid CSS Strategy
- **Decision**: Keep Tailwind 4 + CSS Modules (no migration)
- **Rationale**: 
  - Performance optimized (tree-shaking)
  - Maintainability (clear separation)
  - Zero risk (no breaking changes)
- **Rule**: See CLAUDE.md for "when to use which"

### 2025-11-11: API Key Security
- **Action**: Rotate Resend API key (best practice)
- **Verified**: Key never committed to Git ✅
- **Status**: Needs rotation (high priority)

---

## 🤝 How to Use This Roadmap

### For Rafał:
1. **Daily**: Check "Currently In Progress" section
2. **Weekly**: Review priorities, adjust based on business needs
3. **Monthly**: Assess success metrics, plan next month

### For Claude Code:
1. **Before starting task**: Read CLAUDE.md (standards) + ROADMAP.md (context)
2. **During task**: Update "Currently In Progress"
3. **After task**: Move to "Recently Completed" (add ✅ timestamp)

### For Linear:
- **High-level milestones**: Create Linear issues
- **Technical details**: Add to ROADMAP.md
- **Status sync**: Keep both updated

---

**Questions?** Check CLAUDE.md for technical standards, PROJECT_SUMMARY.md for implementation history.
