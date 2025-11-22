# GA4 Setup Guide - Step by Step for Rafał

**Goal:** Create GA4 property and get Measurement ID ready for Claude Code implementation  
**Time:** 15-20 minutes  
**Status:** PRE-IMPLEMENTATION SETUP

---

## 📋 CHECKLIST

Complete these steps in order:

- [ ] Step 1: Create Google Analytics 4 Property
- [ ] Step 2: Create Web Data Stream
- [ ] Step 3: Enable Enhanced Measurement
- [ ] Step 4: Copy Measurement ID
- [ ] Step 5: Add to .env.local
- [ ] Step 6: Install Google Analytics Debugger Extension
- [ ] Step 7: Bookmark Important GA4 Pages
- [ ] Step 8: (Later) Add to Vercel Environment Variables

---

## 🚀 STEP 1: Create Google Analytics 4 Property

### 1.1 Go to Google Analytics

**URL:** https://analytics.google.com/

**Login with:** Your Google account (recommendation: use business/work account)

---

### 1.2 Access Admin Panel

1. Look for **"Admin"** icon (⚙️ gear icon) in the **bottom left** corner
2. Click on it

**You should see 3 columns:**
- Account
- Property  
- Data Streams (might be empty for now)

---

### 1.3 Create New Property

**In the "Property" column (middle column):**

1. Click **"+ Create Property"** button at the top
2. You'll see a form with these fields:

**Fill in:**
- **Property name:** `Rafał Oleksiak Consulting` (or `oleksiakconsulting.com`)
- **Reporting time zone:** `(GMT+01:00) Central European Time - Warsaw`
- **Currency:** `Polish zloty (PLN)` or `Euro (EUR)` (your choice)

**Click:** "Next" button at the bottom

---

### 1.4 About Your Business

**You'll see another form with questions:**

**Fill in:**
- **Industry category:** `Professional Services` or `Business Services`
- **Business size:** Choose appropriate (e.g., `Small` if solo, `Medium` if you have team)

**Business objectives** (select all that apply):
- ✅ Get baseline reports (understand my website traffic)
- ✅ Measure customer actions (understand customer behavior)
- ✅ Examine user behavior (understand user journeys)

**Click:** "Create" button

---

### 1.5 Accept Terms of Service

1. **Select country:** Poland
2. **Check boxes:**
   - ✅ I accept the Google Analytics Terms of Service Agreement
   - ✅ I accept the Measurement Controller-Controller Data Protection Terms
3. **IMPORTANT:** Read "Data Processing Amendment" checkbox
4. **Click:** "I Accept"

---

### 1.6 Email Communications (Optional)

You'll see a page asking about email preferences.

**Recommendation:** Uncheck all boxes (you can enable later if needed)

**Click:** "Save"

---

## 🌐 STEP 2: Create Web Data Stream

You should now see a page: **"Choose a platform to get started"**

### 2.1 Select Web Platform

**Click on:** "Web" (globe icon 🌐)

---

### 2.2 Set Up Web Stream

**Fill in the form:**

**Website URL:**
```
https://oleksiakconsulting.com
```

**Important:**
- ✅ Include `https://`
- ❌ Do NOT include `www.` if your site doesn't use it
- ❌ Do NOT include trailing slash `/`

**Stream name:**
```
oleksiakconsulting.com - Production
```

**Recommendation:** Add "Production" to distinguish from future test streams

---

### 2.3 Enhanced Measurement (CRITICAL!)

You'll see a toggle switch: **"Enhanced measurement"**

**Make sure it's ON (blue/enabled)** ✅

**What it does:**
- Automatically tracks page views
- Tracks scrolls
- Tracks outbound clicks
- Tracks site search
- Tracks video engagement
- Tracks file downloads

**Click:** "Create stream" button at the bottom

---

## ✅ STEP 3: Enable Enhanced Measurement Settings

After creating the stream, you'll see **"Web stream details"** page.

### 3.1 Verify Enhanced Measurement

**Look for section:** "Enhanced measurement"

**Click on:** ⚙️ Settings icon (gear) next to "Enhanced measurement"

---

### 3.2 Recommended Settings

**You'll see a popup with checkboxes. Enable these:**

- ✅ **Page views** (already on, don't touch)
- ✅ **Scrolls** (tracks 90% scroll depth)
- ✅ **Outbound clicks** (clicks to external websites)
- ❌ **Site search** (only if you have search functionality - you don't)
- ✅ **Video engagement** (tracks YouTube embeds if you have any)
- ✅ **File downloads** (tracks PDF, documents)

**Our custom events will handle:** Form submissions, CTA clicks, Calendly clicks

**Click:** "Save"

---

## 🔑 STEP 4: Copy Measurement ID

### 4.1 Find Measurement ID

**On the "Web stream details" page, look at the top right:**

You'll see a section with:
- **Stream name:** oleksiakconsulting.com - Production
- **Stream URL:** https://oleksiakconsulting.com
- **Stream ID:** (long number)
- **Measurement ID:** **G-XXXXXXXXXX** ← THIS IS WHAT YOU NEED!

---

### 4.2 Copy the ID

**The Measurement ID format:**
```
G-XXXXXXXXXX
```

Where `XXXXXXXXXX` is a 10-character alphanumeric code.

**Example:** `G-1A2B3C4D5E`

**COPY THIS ID** - you'll need it in the next step!

**Tip:** Click the 📋 copy icon next to the Measurement ID

---

## 💾 STEP 5: Add to .env.local

### 5.1 Open Project in Editor

```bash
cd /Users/user/projects/rafal-oleksiak-consulting
code .env.local
```

**Or open with any text editor**

---

### 5.2 Add/Update GA4 Measurement ID

**Find this line (or add it if doesn't exist):**

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-PLACEHOLDER
```

**Replace with your actual ID:**

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Example:**
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-1A2B3C4D5E
```

**IMPORTANT:**
- ✅ Keep the prefix `NEXT_PUBLIC_`
- ✅ No spaces around `=`
- ✅ No quotes around the value
- ✅ Must start with `G-`

---

### 5.3 Verify .env.local Content

Your `.env.local` should now look like:

```bash
# Google Analytics 4 Measurement ID
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-1A2B3C4D5E

# Email Service (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

**Save the file** ✅

---

### 5.4 Verify .gitignore

**CRITICAL:** Make sure `.env.local` is in `.gitignore`

```bash
# Check if it's there:
cat .gitignore | grep ".env.local"
```

**Should output:**
```
.env.local
```

**If NOT there, add it:**
```bash
echo ".env.local" >> .gitignore
```

---

## 🔌 STEP 6: Install Google Analytics Debugger Extension

This is **ESSENTIAL** for testing!

### 6.1 Install Extension (Chrome/Edge)

**Go to:**
https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna

**Click:** "Add to Chrome" or "Add to Edge"

---

### 6.2 Verify Installation

1. Look for extension icon in browser toolbar (usually top-right)
2. Icon looks like: 📊 or "GA" letters
3. **Click on the icon**

**States:**
- **Gray/Disabled:** Extension is OFF (normal state)
- **Blue/Colored:** Extension is ON (debug mode active)

**Keep it OFF for now** - you'll turn it ON when testing

---

## 📚 STEP 7: Bookmark Important GA4 Pages

Open these in new tabs and bookmark them:

### 7.1 GA4 Home
```
https://analytics.google.com/
```
**Bookmark as:** "GA4 - Home"

---

### 7.2 Realtime Report
```
https://analytics.google.com/analytics/web/#/
```
Then navigate: **Reports → Realtime**

**Bookmark as:** "GA4 - Realtime"

**What you'll see here:**
- Active users right now
- Page views in last 30 minutes
- Events in last 30 minutes
- User locations
- Traffic sources

---

### 7.3 DebugView
```
https://analytics.google.com/analytics/web/#/
```
Then navigate: **Admin → DebugView**

**Bookmark as:** "GA4 - DebugView"

**What you'll see here:**
- Real-time events from devices in debug mode
- Event parameters
- User properties
- Detailed event information

**This is where you'll test the implementation!**

---

### 7.4 Events Report
```
https://analytics.google.com/analytics/web/#/
```
Then navigate: **Reports → Engagement → Events**

**Bookmark as:** "GA4 - Events"

**What you'll see here:**
- All events that fired
- Event count
- Total users
- Event count per user
- Total revenue (if applicable)

---

### 7.5 Data Streams
```
https://analytics.google.com/analytics/web/#/
```
Then navigate: **Admin → Data Streams**

**Bookmark as:** "GA4 - Data Streams"

**What you'll see here:**
- Your web stream
- Measurement ID
- Enhanced Measurement settings
- Debug mode settings

---

## ☁️ STEP 8: Add to Vercel (DO THIS AFTER CLAUDE CODE IMPLEMENTATION)

**SKIP THIS FOR NOW** - Do this AFTER Claude Code finishes implementation

### 8.1 When You're Ready to Deploy

1. Go to: https://vercel.com/your-username/rafal-oleksiak-consulting/settings/environment-variables
2. Click: "Add New" button
3. Fill in:
   - **Key:** `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - **Value:** `G-XXXXXXXXXX` (your actual ID)
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development
4. Click: "Save"

**Why all environments?**
- Production: Real tracking
- Preview: Test on preview deployments
- Development: Optional (our code disables it anyway)

---

## ✅ PRE-IMPLEMENTATION CHECKLIST

Before starting Claude Code implementation, verify:

- [ ] GA4 property created
- [ ] Web data stream configured
- [ ] Enhanced Measurement enabled
- [ ] Measurement ID copied (format: G-XXXXXXXXXX)
- [ ] `.env.local` updated with real Measurement ID
- [ ] `.env.local` in `.gitignore`
- [ ] Google Analytics Debugger extension installed
- [ ] Important GA4 pages bookmarked
- [ ] Can access GA4 Realtime report
- [ ] Can access GA4 DebugView

---

## 📊 WHAT YOU SHOULD SEE NOW

### In GA4 Realtime (Right Now)
- **Active users:** 0 (normal - no tracking code yet)
- **Events:** Empty (normal - no tracking code yet)

### After Claude Code Implementation
- **Active users:** 1+ (when you visit the site)
- **Events:** page_view, session_start, etc.

### After Deployment
- **Active users:** Real traffic count
- **Events:** All custom events firing

---

## 🧪 TESTING PLAN (AFTER IMPLEMENTATION)

### Phase 1: Development Testing
```bash
npm run dev
# Open http://localhost:3000
# Check console for: "Web Vitals (dev): ..."
# Check console for: "Event (dev): ..."
# Verify NO network requests to google-analytics.com
```

### Phase 2: Production Build Testing
```bash
npm run build
npm start
# Open http://localhost:3000
# Enable Google Analytics Debugger extension (click icon → should turn blue)
# Open GA4 DebugView in another tab
# Interact with site (click CTAs, submit form, scroll)
# Wait 10-30 seconds
# Check DebugView for events
```

### Phase 3: Live Site Testing (After Vercel Deployment)
```bash
# Open https://oleksiakconsulting.com
# Enable Google Analytics Debugger extension
# Open GA4 DebugView
# Interact with site
# Verify events appear
```

---

## 🔍 TROUBLESHOOTING

### Issue: Can't find Measurement ID

**Solution:**
1. Go to: Admin → Data Streams
2. Click on your stream name
3. Look at top-right section for "Measurement ID"

---

### Issue: DebugView is empty

**Possible causes:**
1. Google Analytics Debugger extension is OFF
2. Running in development mode (use `npm start`, not `npm run dev`)
3. Wrong Measurement ID in `.env.local`
4. Ad blocker is blocking requests

**Solutions:**
- Enable extension (icon should be blue/colored)
- Run production build: `npm run build && npm start`
- Verify ID format: G-XXXXXXXXXX
- Disable ad blockers temporarily

---

### Issue: Enhanced Measurement not working

**Solution:**
1. Go to: Admin → Data Streams → Your stream
2. Scroll to "Enhanced measurement"
3. Click ⚙️ settings icon
4. Ensure toggle is ON (blue)
5. Enable recommended checkboxes
6. Click "Save"

---

## 📝 NOTES

### GA4 Property Naming Convention

**Good names:**
- `Rafał Oleksiak Consulting`
- `oleksiakconsulting.com`
- `ROC - Production`

**Bad names:**
- `My Website`
- `Test`
- `GA4 Property 1`

**Why?** Clear names help when you have multiple properties.

---

### Data Stream Naming Convention

**Good names:**
- `oleksiakconsulting.com - Production`
- `oleksiakconsulting.com - Staging`
- `oleksiakconsulting.com - Development`

**Why?** You might add test streams later.

---

### Measurement ID Format

**Valid:**
- `G-XXXXXXXXXX` (10 alphanumeric characters after G-)
- Example: `G-1A2B3C4D5E`

**Invalid:**
- `UA-XXXXXXXXX` (old Universal Analytics, won't work)
- `GTM-XXXXXXX` (Google Tag Manager, different tool)
- `AW-XXXXXXXXX` (Google Ads, different tool)

---

## 🎯 SUCCESS CRITERIA

You're ready for Claude Code implementation when:

- ✅ You have a valid G-XXXXXXXXXX Measurement ID
- ✅ `.env.local` contains the real ID
- ✅ You can access GA4 DebugView
- ✅ Google Analytics Debugger extension is installed
- ✅ You understand how to test (dev vs production mode)

---

## 🚀 NEXT STEP

Once you complete this checklist:

**Say:** "READY FOR CLAUDE CODE"

**I'll confirm:**
- Your setup is complete
- Claude Code brief is ready
- You can start implementation

---

## 💡 PRO TIPS

### Tip 1: Use Chrome Incognito for Testing
- No ad blockers
- No extensions interfering
- Clean session every time

### Tip 2: Keep DebugView Open
- Open in separate window
- Keep visible while testing
- Events appear within 10-30 seconds

### Tip 3: Test Mobile Too
- Use Chrome DevTools device emulation
- Or test on real mobile device
- Events should work the same

### Tip 4: Document Your Setup
- Keep a note with your Measurement ID
- Screenshot your Enhanced Measurement settings
- Note any custom configuration

---

**Last Updated:** 2025-11-21  
**Version:** 1.0  
**Status:** PRE-IMPLEMENTATION SETUP GUIDE
