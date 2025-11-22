# LAMA Testing Checklist
**How to test each stage of LAMA implementation**

**Last Updated**: 2025-11-17

---

## 🧪 STAGE 1: Proof of Concept (2 Categories)

### Pre-Testing Setup
- [ ] `.env.local` has `RESEND_API_KEY` ✅
- [ ] `.env.local` has `HUBSPOT_ACCESS_TOKEN` ✅
- [ ] Dependencies installed: `npm install anthropic cheerio`
- [ ] Dev server running: `npm run dev`
- [ ] Check http://localhost:3000 contact form loads

### Form Testing (`FinalCTA` component)
- [ ] **Checkbox Visible:**
  - [ ] New checkbox appears: "☐ Wyślij mi darmowy audit strony"
  - [ ] Checkbox below email/company fields
  - [ ] Mobile responsive (44px+ touch target)

- [ ] **Form Validation:**
  - [ ] Can submit WITHOUT checkbox (normal flow)
  - [ ] Can submit WITH checkbox (triggers LAMA)
  - [ ] Company URL field validates format
  - [ ] Email field validates format

- [ ] **Loading State:**
  - [ ] Shows "Wysyłam..." when submitted
  - [ ] If checkbox checked: "Przygotowuję audit..."
  - [ ] Success message mentions audit: "Raport wysłany na email"

### API Testing (`/api/lama/audit`)

**Test via Form (Recommended):**
1. Go to http://localhost:3000 (scroll to contact form)
2. Fill: Name, Email, Company (URL), Message
3. Check: "☐ Wyślij mi darmowy audit strony"
4. Submit
5. Wait 30-60s for email

**Test URL 1: Your Own Site (Direct API)**
```bash
curl -X POST http://localhost:3000/api/lama/audit \
  -H "Content-Type: application/json" \
  -d '{"url":"https://oleksiakconsulting.com","email":"your-email@test.com","name":"Test User"}'
```

Expected:
- [ ] Response 200 OK
- [ ] Overall score returned (0-100)
- [ ] `visibility` category score present
- [ ] `performance` category score present
- [ ] Response time < 90 seconds

**Test URL 2: Simple Site (Example.com)**
```bash
curl -X POST http://localhost:3000/api/lama/audit \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com","email":"your-email@test.com"}'
```

Expected:
- [ ] Works without errors
- [ ] Scores make sense (should be decent)

**Test URL 3: Broken Site (Missing Meta)**
```bash
curl -X POST http://localhost:3000/api/lama/audit \
  -H "Content-Type: application/json" \
  -d '{"url":"https://httpstat.us/200","email":"your-email@test.com"}'
```

Expected:
- [ ] Visibility score low (missing meta tags)
- [ ] Doesn't crash on missing data
- [ ] Error handling works

**Test URL 4: Invalid URL**
```bash
curl -X POST http://localhost:3000/api/lama/audit \
  -H "Content-Type: application/json" \
  -d '{"url":"not-a-url","email":"your-email@test.com"}'
```

Expected:
- [ ] Returns 400 error
- [ ] Clear error message
- [ ] Doesn't crash server

### HubSpot Testing (NEW)
- [ ] **Contact Creation:**
  - [ ] Go to HubSpot → Contacts
  - [ ] Search for test email
  - [ ] Contact exists (created or updated)
  - [ ] Company URL saved in "Website" field
  - [ ] All form fields populated

- [ ] **Activity Timeline:**
  - [ ] Open contact in HubSpot
  - [ ] Check timeline/activity feed
  - [ ] See: "LAMA Audit sent | Score: XX/100"
  - [ ] Timestamp correct
  - [ ] Can click to see details

### Email Testing
- [ ] Email received in inbox (check spam folder)
- [ ] Subject line correct: "📊 Twój Audit LAMA - [domain] | Score: XX/100"
- [ ] From: Rafał Oleksiak Consulting (via Resend)
- [ ] **Content Check:**
  - [ ] Overall score visible (large, prominent)
  - [ ] Visibility category with progress bar
  - [ ] Performance category with progress bar
  - [ ] Specific issues listed (e.g., "Brak meta description")
  - [ ] CTA button: "Umów Konsultację" clickable
  - [ ] CTA links to Calendly

- [ ] **Email Design:**
  - [ ] Purple gradient header (#7B2CBF)
  - [ ] Progress bars colored correctly
  - [ ] Professional appearance
  - [ ] Mobile-friendly (test on phone)

### Performance Check
- [ ] Submit form 3 times back-to-back (different URLs)
- [ ] All 3 contacts created in HubSpot
- [ ] All 3 emails delivered
- [ ] Server doesn't crash
- [ ] Memory doesn't leak
- [ ] Response times consistent (<90s each)

---

## 🧪 STAGE 2: Full Audit (5 Categories)

### New Categories Testing

**Test URL: Your Own Site (via form)**
Submit form with checkbox checked, verify all 5 categories:

- [ ] **Visibility** (SEO): 
  - [ ] Meta title present/missing
  - [ ] Meta description present/missing
  - [ ] H1 tag check
  - [ ] robots.txt check
  - [ ] Sitemap.xml check

- [ ] **Performance**:
  - [ ] PageSpeed score (mobile)
  - [ ] LCP value (< 2.5s good)
  - [ ] CLS value (< 0.1 good)
  - [ ] Mobile-friendly check

- [ ] **Clarity** (NEW):
  - [ ] H1 clarity score (AI analysis)
  - [ ] Value proposition detected
  - [ ] Navigation item count
  - [ ] CTA buttons counted

- [ ] **Trust** (NEW):
  - [ ] SSL certificate grade
  - [ ] Privacy policy detected
  - [ ] Contact info found (email/phone)
  - [ ] Testimonials detected

- [ ] **Conversion** (NEW):
  - [ ] Contact form detected
  - [ ] Form fields count
  - [ ] CTA buttons count
  - [ ] Email/phone links found

### Edge Cases

**Test: No SSL (HTTP site)**
```bash
# Find an HTTP-only site to test
curl -X POST http://localhost:3000/api/lama/audit \
  -H "Content-Type: application/json" \
  -d '{"url":"http://insecure-site.com","email":"test@test.com"}'
```
Expected:
- [ ] Trust score is low
- [ ] "No SSL certificate" flagged

**Test: No Contact Info**
Expected:
- [ ] Trust score reduced
- [ ] "Brak kontaktu" flagged

**Test: No Forms**
Expected:
- [ ] Conversion score low
- [ ] "Brak formularza kontaktowego" flagged

### Overall Score Testing
- [ ] Overall score = average of 5 categories
- [ ] Score rounds correctly (0-100)
- [ ] Score makes intuitive sense (test on 10 sites)
- [ ] Score logged to HubSpot timeline

### Email Template (Full)
- [ ] All 5 categories show in email
- [ ] Progress bars for each
- [ ] Financial impact section present
- [ ] "Quick Wins" section (top 3 issues)
- [ ] CTA prominent and clickable
- [ ] HubSpot can track email opens (if configured)

---

## 🧪 STAGE 3: Polish & Production

### Error Handling
- [ ] **Invalid URL Handling:**
  - [ ] Malformed URL returns 400
  - [ ] Non-existent domain returns error
  - [ ] Timeout after 90s (doesn't hang)

- [ ] **API Failures:**
  - [ ] PageSpeed API down → graceful fallback
  - [ ] Claude API down → skip Clarity analysis
  - [ ] Resend API down → log error, return 500

- [ ] **Rate Limiting:**
  - [ ] Can't submit same URL twice in 5 minutes
  - [ ] Clear message: "Audit already requested"

### Loading UX
- [ ] Progress updates during audit:
  - [ ] "Analyzing SEO..." (10s)
  - [ ] "Checking performance..." (20s)
  - [ ] "Evaluating clarity..." (30s)
  - [ ] "Verifying trust..." (40s)
  - [ ] "Assessing conversion..." (50s)
  - [ ] "Generating report..." (60s)

### Analytics Logging
- [ ] Audit requests logged to file/sheet:
  - [ ] Timestamp
  - [ ] URL audited
  - [ ] Email
  - [ ] Overall score
  - [ ] Category scores

### Production Testing

**Test on 10+ Real Sites (via form submission):**
1. [ ] oleksiakconsulting.com (your site)
2. [ ] allegro.pl (large ecommerce)
3. [ ] example.com (basic)
4. [ ] medium.com (blog)
5. [ ] github.com (tech)
6. [ ] amazon.com (ecommerce)
7. [ ] wikipedia.org (content)
8. [ ] startup-site.com (small business)
9. [ ] broken-site.com (poorly built)
10. [ ] slow-site.com (bad performance)

For each site, verify:
- [ ] Audit completes without errors
- [ ] Contact created in HubSpot
- [ ] Activity logged in HubSpot timeline
- [ ] Scores make intuitive sense
- [ ] Email delivered successfully
- [ ] Response time < 90 seconds

### Stress Testing
- [ ] 5 concurrent audits don't crash server
- [ ] Memory usage stays reasonable
- [ ] Response times don't degrade

### Email Spam Check
- [ ] Test email doesn't go to spam (Gmail, Outlook)
- [ ] SPF/DKIM records configured (Resend)
- [ ] Unsubscribe link works (if added)

---

## 📊 Acceptance Criteria (All Stages)

### ✅ Stage 1 is DONE when:
- [ ] Checkbox appears in contact form
- [ ] Form submission triggers LAMA when checked
- [ ] Contact created/updated in HubSpot
- [ ] API analyzes 2 categories (Visibility, Performance)
- [ ] Activity logged in HubSpot timeline
- [ ] Email sent with results
- [ ] Tested on 5 different sites
- [ ] No crashes on invalid input

### ✅ Stage 2 is DONE when:
- [ ] All 5 categories implemented
- [ ] Overall score calculated correctly
- [ ] Email shows all 5 categories
- [ ] Tested on 10 different sites
- [ ] Edge cases handled

### ✅ Stage 3 is DONE when:
- [ ] Email design polished (brand colors)
- [ ] Error handling comprehensive
- [ ] Loading UX smooth
- [ ] Analytics logging works
- [ ] Stress tested (5 concurrent audits)
- [ ] Ready for production deploy

---

## 🐛 Bug Tracking Template

```markdown
### Bug: [Brief description]
**Stage**: 1 / 2 / 3
**Severity**: Critical / High / Medium / Low
**Test URL**: [URL that caused bug]
**Steps to reproduce**:
1. 
2. 
3. 

**Expected**: 
**Actual**: 
**Error logs**: 
**Fix**: 
```

---

## 📝 Testing Checklist Summary

**Before Stage 1 PR:**
- [ ] All Stage 1 tests pass
- [ ] Email delivered successfully
- [ ] Tested on 5 sites

**Before Stage 2 PR:**
- [ ] All 5 categories work
- [ ] Tested on 10 sites
- [ ] Edge cases handled

**Before Stage 3 PR:**
- [ ] Production-ready
- [ ] Stress tested
- [ ] Deployment tested (Railway/Vercel)

---

**Last Updated**: 2025-11-17
**Questions?** Check LAMA_IMPLEMENTATION_BRIEF.md
