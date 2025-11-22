# HubSpot Integration - Quick Start Guide

## 📋 For Rafał (Manual Setup)

### Step 1: Create HubSpot Account (10 min)
1. Go to https://www.hubspot.com/products/crm
2. Click "Get started free"
3. Use email: rafal@oleksiakconsulting.com
4. Complete signup and skip the tour

### Step 2: Get Credentials (5 min)
1. Settings (top right) → Account Defaults → Account Information
2. Copy **Portal ID** (7-digit number)
3. Add to `.env.local`:
```bash
NEXT_PUBLIC_HUBSPOT_PORTAL_ID=your_portal_id_here
```

### Step 3: Create Form in HubSpot (15 min)
1. Marketing → Lead Capture → Forms
2. Click "Create form" → "Embedded form"
3. Add fields:
   - First Name
   - Last Name  
   - Email
   - Company Name
   - Phone (optional)
   - Message (multi-line text)
4. Copy **Form ID** (looks like: `12a34b56-78cd-90ef-1234-567890abcdef`)
5. Add to `.env.local`:
```bash
NEXT_PUBLIC_HUBSPOT_FORM_ID=your_form_id_here
```

---

## 🤖 For Claude Code (Automated Implementation)

**Once you have Portal ID and Form ID from above, run:**

```bash
cd /Users/user/projects/rafal-oleksiak-consulting

# Option 1: Full implementation
"Claude Code, implement the complete HubSpot integration following HUBSPOT_INTEGRATION_PLAN.md Phase 2 (Website Integration). Create all components, update layout.tsx, style the form to match Tech-Forward Innovator theme, and test the integration."

# Option 2: Step-by-step
"Claude Code, start with Phase 2 Task 2.1-2.4 from HUBSPOT_INTEGRATION_PLAN.md: install next-hubspot, create HubSpot components, and add tracking code."
```

**Claude Code will:**
1. Install `next-hubspot` package
2. Create `app/components/tracking/HubSpotTracking.tsx`
3. Create `app/components/forms/HubSpotContactForm.tsx`
4. Update `app/layout.tsx` to add tracking
5. Replace form in `app/components/sections/FinalCTA.tsx`
6. Add CSS styling to `app/globals.css`

---

## ✅ Testing Checklist (After Implementation)

### Desktop Testing (5 min)
- [ ] Visit localhost:3000
- [ ] Scroll to contact form
- [ ] Fill out form
- [ ] Submit
- [ ] Check HubSpot dashboard → Contacts → New contact appears

### Mobile Testing (5 min)
- [ ] Test on iPhone Safari
- [ ] Test on Android Chrome
- [ ] Form should match desktop functionality

### Email Testing (5 min)
- [ ] Submit form
- [ ] Check rafal@oleksiakconsulting.com inbox
- [ ] Welcome email received within 5 min

---

## 🚨 If Something Breaks

**Quick Rollback:**
```bash
# Revert to Resend form
git checkout HEAD~1 -- app/components/sections/FinalCTA.tsx
npm run dev
```

**Full rollback instructions:** See `HUBSPOT_INTEGRATION_PLAN.md` Phase 5, Task 5.3

---

## 📊 After Launch - Email Automation Setup (Manual in HubSpot)

**Follow Phase 3 of `HUBSPOT_INTEGRATION_PLAN.md`:**
1. Create welcome email sequence (30 min)
2. Set up lead scoring (30 min)
3. Create nurture campaign (60 min)

**Time**: 2-3 hours (one-time setup)

---

## 📈 Success Metrics to Track

**Week 1:**
- Forms submitted: Target 5+
- Emails sent automatically: 100%
- Contact creation: 100%

**Week 2-4:**
- Lead-to-consultation conversion: Target +30%
- Email open rate: Target 25%+
- Average response time: Target <24h

---

## 🆘 Need Help?

1. **Technical issues**: Check `HUBSPOT_INTEGRATION_PLAN.md` Phase 5 (Troubleshooting)
2. **HubSpot questions**: https://community.hubspot.com/
3. **Claude Code errors**: Review console logs, check .env.local variables

---

**Files Created by This Integration:**
- `HUBSPOT_INTEGRATION_PLAN.md` - Full implementation guide (6-8 hours)
- `HUBSPOT_QUICKSTART.md` - This file (quick reference)
- Updated: `ROADMAP.md`, `.env.example`

**Estimated Total Time**: 
- Manual setup (Rafał): 30 min
- Claude Code implementation: 2-3 hours
- Email automation setup: 2-3 hours
- Testing: 30 min
- **Total: 6-7 hours**

**Business Value**: 
- 30-50% increase in conversion rate
- Automated lead nurturing (2-5x response rate)
- Full CRM visibility and attribution

---

Last Updated: 2025-11-12
