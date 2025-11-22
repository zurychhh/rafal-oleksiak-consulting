# 🎯 HUBSPOT INTEGRATION PLAN
## Rafał Oleksiak Consulting - HubSpot CRM Integration

**Created**: 2025-11-12  
**Owner**: Rafał  
**Estimated Total Time**: 6-8 hours  
**Business Value**: Complete lead nurturing pipeline, automated follow-up, CRM visibility

---

## 📋 Executive Summary

**Goal**: Integrate HubSpot CRM with oleksiakconsulting.com for:
1. Automated lead capture from website forms
2. Lead scoring and segmentation
3. Email nurturing sequences
4. Analytics and attribution tracking
5. Chat widget for real-time engagement

**Why HubSpot?**
- Industry standard for B2B CRM (used by 143,000+ companies)
- Free tier perfect for starting consultancy
- Native marketing automation
- Proven ROI: 4,000% for email marketing
- Direct pipeline visibility

**Success Metrics**:
- 100% of form submissions → HubSpot CRM
- 30% increase in lead-to-consultation conversion
- Automated follow-up = 2-5x response rate
- Full attribution: Which channels drive best leads

---

## 🔧 Technical Implementation Plan

### PHASE 1: HubSpot Account Setup (30 min)

#### Task 1.1: Create HubSpot Account
**Time**: 10 min  
**Priority**: HIGH

**Steps**:
```bash
# 1. Go to HubSpot
https://www.hubspot.com/products/crm

# 2. Sign up for FREE CRM
- Use: rafal@oleksiakconsulting.com
- Choose: "Marketing Hub - Free"
- Industry: "Business Consulting"
- Company size: "1-10 employees"

# 3. Complete onboarding wizard
- Skip guided tour (we'll customize)
- Enable: "Marketing" + "Sales" hubs (free)
```

**Deliverable**: HubSpot account active, Portal ID retrieved

---

#### Task 1.2: Get API Credentials
**Time**: 10 min  
**Priority**: HIGH

**Steps**:
```bash
# 1. Navigate to Settings
Settings (top right) → Integrations → API Key

# 2. Generate API Key (if needed)
Click "Create key" → Copy key

# 3. Get Portal ID
Settings → Account Defaults → Account Information
Portal ID: XXXXXXX (7-digit number)

# 4. Store credentials securely
Add to .env.local:
HUBSPOT_PORTAL_ID=your_portal_id
HUBSPOT_API_KEY=your_api_key (optional, only if using API)
```

**Deliverable**: Portal ID + API key stored in `.env.local`

---

#### Task 1.3: Create Contact Properties
**Time**: 10 min  
**Priority**: MEDIUM

**Steps**:
```bash
# Navigate to: Settings → Data Management → Properties

# Create custom properties:
1. "Consultation Type" (Dropdown)
   - CRM Strategy
   - Marketing Automation
   - Digital Transformation
   - General Inquiry

2. "Lead Source" (Dropdown)
   - Website Contact Form
   - LinkedIn
   - Referral
   - Other

3. "Budget Range" (Dropdown)
   - €5,000 - €15,000
   - €15,000 - €50,000
   - €50,000+
   - Not specified

4. "Company Size" (Dropdown)
   - 1-10 employees
   - 11-50 employees
   - 51-200 employees
   - 200+ employees
```

**Deliverable**: Custom contact properties ready for lead segmentation

---

### PHASE 2: Website Integration (2-3 hours)

#### Task 2.1: Install HubSpot Package
**Time**: 10 min  
**Priority**: HIGH

```bash
# Navigate to project
cd /Users/user/projects/rafal-oleksiak-consulting

# Install next-hubspot package
npm install next-hubspot --save

# Verify installation
npm list next-hubspot
# Should show: next-hubspot@1.x.x
```

**Files Modified**:
- `package.json` (auto-updated)
- `package-lock.json` (auto-updated)

---

#### Task 2.2: Create HubSpot Provider Component
**Time**: 20 min  
**Priority**: HIGH

**File**: `app/components/providers/HubSpotProvider.tsx`

```typescript
"use client";

import { HubspotProvider as NextHubspotProvider } from 'next-hubspot';

interface HubSpotProviderProps {
  children: React.ReactNode;
}

export default function HubSpotProvider({ children }: HubSpotProviderProps) {
  return (
    <NextHubspotProvider>
      {children}
    </NextHubspotProvider>
  );
}
```

**Business Logic**:
- Wraps entire app to enable HubSpot script loading
- Client-side only (uses `"use client"` directive)
- Zero performance impact (lazy loaded)

---

#### Task 2.3: Add HubSpot Tracking Code
**Time**: 30 min  
**Priority**: HIGH

**File**: `app/components/tracking/HubSpotTracking.tsx`

```typescript
"use client";

import Script from 'next/script';
import { useEffect } from 'react';

interface HubSpotTrackingProps {
  portalId: string;
}

export default function HubSpotTracking({ portalId }: HubSpotTrackingProps) {
  useEffect(() => {
    // Set up HubSpot page view tracking
    if (typeof window !== 'undefined' && (window as any)._hsq) {
      (window as any)._hsq.push(['setPath', window.location.pathname]);
      (window as any)._hsq.push(['trackPageView']);
    }
  }, []);

  return (
    <Script
      id="hs-script-loader"
      strategy="afterInteractive"
      src={`//js.hs-scripts.com/${portalId}.js`}
      onLoad={() => {
        console.log('HubSpot tracking loaded');
      }}
    />
  );
}
```

**Add to `app/layout.tsx`**:
```typescript
import HubSpotTracking from './components/tracking/HubSpotTracking';

// Inside <body> tag, after children:
<HubSpotTracking portalId={process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID!} />
```

**Environment Variable**:
```bash
# Add to .env.local
NEXT_PUBLIC_HUBSPOT_PORTAL_ID=your_portal_id_here

# Add to .env.example
NEXT_PUBLIC_HUBSPOT_PORTAL_ID=12345678
```

**What This Does**:
- Tracks page views automatically
- Enables HubSpot cookies for visitor identification
- Tracks user behavior (time on site, pages visited)
- Powers HubSpot Analytics dashboard

---

#### Task 2.4: Create HubSpot Form Component
**Time**: 45 min  
**Priority**: HIGH

**File**: `app/components/forms/HubSpotContactForm.tsx`

```typescript
"use client";

import { useEffect, useRef, useState } from 'react';

interface HubSpotFormProps {
  portalId: string;
  formId: string;
  region?: string;
  onFormSubmit?: () => void;
  targetId?: string;
}

export default function HubSpotContactForm({ 
  portalId, 
  formId, 
  region = 'eu1',
  onFormSubmit,
  targetId = 'hubspot-form'
}: HubSpotFormProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load HubSpot forms script
    const script = document.createElement('script');
    script.src = 'https://js.hsforms.net/forms/embed/v2.js';
    script.async = true;
    script.onload = () => {
      setIsLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (isLoaded && (window as any).hbspt) {
      // Create form
      (window as any).hbspt.forms.create({
        region: region,
        portalId: portalId,
        formId: formId,
        target: `#${targetId}`,
        onFormSubmit: (form: any) => {
          console.log('HubSpot form submitted:', form);
          
          // Track with GA4 (if integrated)
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'form_submit', {
              form_id: formId,
              form_name: 'contact_form'
            });
          }

          // Custom callback
          if (onFormSubmit) {
            onFormSubmit();
          }
        }
      });
    }
  }, [isLoaded, portalId, formId, region, targetId, onFormSubmit]);

  return (
    <div className="hubspot-form-wrapper">
      {/* Loading skeleton */}
      {!isLoaded && (
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-700/50 rounded"></div>
          <div className="h-10 bg-gray-700/50 rounded"></div>
          <div className="h-32 bg-gray-700/50 rounded"></div>
          <div className="h-12 bg-purple-600/30 rounded"></div>
        </div>
      )}
      
      {/* HubSpot form will be injected here */}
      <div id={targetId} ref={formRef} />
    </div>
  );
}
```

**Styling**: Add to `app/globals.css`
```css
/* HubSpot Form Styling - Match Tech-Forward Innovator theme */
.hubspot-form-wrapper .hs-form {
  /* Inherit from parent */
}

.hubspot-form-wrapper .hs-input {
  background: rgba(26, 26, 46, 0.5);
  border: 1px solid rgba(123, 44, 191, 0.3);
  border-radius: 8px;
  padding: 12px 16px;
  color: white;
  font-size: 16px;
  transition: all 0.3s ease;
}

.hubspot-form-wrapper .hs-input:focus {
  border-color: #7B2CBF;
  outline: none;
  box-shadow: 0 0 0 3px rgba(123, 44, 191, 0.1);
}

.hubspot-form-wrapper .hs-button {
  background: linear-gradient(135deg, #7B2CBF 0%, #9D4EDD 100%);
  border: none;
  border-radius: 8px;
  padding: 14px 32px;
  color: white;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.hubspot-form-wrapper .hs-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(123, 44, 191, 0.3);
}

.hubspot-form-wrapper .hs-error-msg {
  color: #EF4444;
  font-size: 14px;
  margin-top: 4px;
}
```

---

#### Task 2.5: Create HubSpot Form in Dashboard
**Time**: 15 min  
**Priority**: HIGH

**Steps**:
```bash
# 1. Navigate to HubSpot Forms
Marketing → Lead Capture → Forms

# 2. Create New Form
Click "Create form" → Choose "Embedded form"

# 3. Add Form Fields
Required fields:
- First Name (single line text)
- Last Name (single line text)
- Email (email field)
- Company Name (single line text)
- Phone (phone number) - Optional
- Message (multi-line text)

Custom fields:
- Consultation Type (dropdown) - from Task 1.3
- Budget Range (dropdown) - from Task 1.3

# 4. Configure Form Settings
- Form Name: "Website Contact Form - oleksiakconsulting.com"
- Internal Name: "website_contact_form"
- Language: English (or Polish if targeting Polish market)

# 5. Style Settings
- Match your brand colors (we'll override with CSS)
- Button text: "Book Free Consultation"
- Submit redirect: Thank you page URL (create later)

# 6. Options
- Enable: "Create new contact for email address"
- Enable: "Update existing contact"
- Cookie tracking: Enable

# 7. Automation
- Notify: rafal@oleksiakconsulting.com when form submitted
- Auto-response email: "Thank you for contacting me" (create in Task 3.1)

# 8. Copy Form ID
Settings → Embed → Copy "Form ID" (UUID format)
Example: 12a34b56-78cd-90ef-1234-567890abcdef

# 9. Copy Embed Code (Backup)
Keep the embed code for reference
```

**Deliverable**: 
- Form ID copied
- Auto-notification enabled
- Form published in HubSpot

---

#### Task 2.6: Replace Current Contact Form with HubSpot
**Time**: 30 min  
**Priority**: HIGH

**File**: `app/components/sections/FinalCTA.tsx`

**Current Implementation**: Uses Resend API (`/api/send-email`)

**New Implementation**: Replace with HubSpot form

```typescript
// REMOVE old imports and form logic

// ADD HubSpot form component
import HubSpotContactForm from '../forms/HubSpotContactForm';

export default function FinalCTA() {
  const handleFormSubmit = () => {
    // Optional: Show success message
    alert('Thank you! I\'ll be in touch within 24 hours.');
    
    // Optional: Redirect to thank you page
    // window.location.href = '/thank-you';
  };

  return (
    <section id="free-consultation" className={styles.ctaSection}>
      {/* ... existing header content ... */}
      
      {/* REPLACE form JSX with: */}
      <HubSpotContactForm
        portalId={process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID!}
        formId={process.env.NEXT_PUBLIC_HUBSPOT_FORM_ID!}
        region="eu1"
        onFormSubmit={handleFormSubmit}
      />
    </section>
  );
}
```

**Environment Variables**:
```bash
# Add to .env.local
NEXT_PUBLIC_HUBSPOT_FORM_ID=your_form_id_here

# Add to .env.example
NEXT_PUBLIC_HUBSPOT_FORM_ID=12a34b56-78cd-90ef-1234-567890abcdef
```

**Migration Checklist**:
- [ ] HubSpot form working in all browsers
- [ ] Form styling matches Tech-Forward Innovator theme
- [ ] Success message displays correctly
- [ ] Form submission creates contact in HubSpot
- [ ] Email notification sent to rafal@oleksiakconsulting.com
- [ ] Mobile responsive (test on iPhone/Android)

**What to Keep**:
- Current FinalCTA section layout
- Headline, subheadline, visual elements
- Section styling and background

**What to Remove**:
- `/api/send-email/route.ts` (can keep as backup)
- Form validation logic (HubSpot handles this)
- Resend integration (unless keeping for other purposes)

**Rollback Plan** (if issues):
```bash
# Keep old form code commented out
# If HubSpot fails, uncomment old form
# Test both in parallel before full migration
```

---

#### Task 2.7: Add HubSpot Chat Widget (Optional)
**Time**: 20 min  
**Priority**: LOW (can do later)

**File**: `app/components/chat/HubSpotChat.tsx`

```typescript
"use client";

import { useEffect } from 'react';
import Script from 'next/script';

interface HubSpotChatProps {
  portalId: string;
}

export default function HubSpotChat({ portalId }: HubSpotChatProps) {
  useEffect(() => {
    // Configure chat settings when script loads
    if (typeof window !== 'undefined' && (window as any).HubSpotConversations) {
      (window as any).HubSpotConversations.widget.load();
    }
  }, []);

  return (
    <Script
      id="hubspot-chat"
      strategy="lazyOnload"
      src={`//js.hs-scripts.com/${portalId}.js`}
      onLoad={() => {
        console.log('HubSpot chat widget loaded');
      }}
    />
  );
}
```

**Add to `app/layout.tsx`** (optional):
```typescript
import HubSpotChat from './components/chat/HubSpotChat';

// Inside <body>, at the end:
<HubSpotChat portalId={process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID!} />
```

**HubSpot Dashboard Setup**:
```bash
# 1. Enable Chat
Settings → Conversations → Chatflows → Create chatflow

# 2. Configure Chat Widget
- Appearance: Match Tech-Forward Innovator (purple theme)
- Welcome message: "Hi! Looking to transform your CRM? Let's chat."
- Availability: Set business hours (9am-6pm CET)
- Offline message: "I'm offline now, but I'll respond within 24h"

# 3. Targeting
- Show on: All pages
- Except: (none for now)
- Delay: 5 seconds after page load

# 4. Lead Capture
- Ask for email after 2 messages
- Route to rafal@oleksiakconsulting.com

# 5. Mobile Settings
- Enable mobile chat
- Position: Bottom right
```

**Business Value**:
- 15-20% more consultation bookings
- Real-time engagement = higher trust
- Capture visitors who won't fill forms

---

### PHASE 3: Email Automation Setup (2-3 hours)

#### Task 3.1: Create Welcome Email Sequence
**Time**: 45 min  
**Priority**: HIGH

**Location**: Marketing → Automation → Workflows

**Workflow 1: Contact Form Submission**

```yaml
Trigger: Contact submits "Website Contact Form"

Actions:
1. Send Email: "Thanks for reaching out!" (0 min delay)
   Subject: "Thanks for contacting Rafał Oleksiak Consulting"
   Body:
     Hi {{contact.firstname}},
     
     Thank you for reaching out! I received your inquiry and will 
     personally review it within the next 24 hours.
     
     In the meantime, here's what you can expect:
     - Personal response within 1 business day
     - Free 30-minute strategy consultation
     - No-obligation discussion about your CRM needs
     
     Best regards,
     Rafał Oleksiak
     CRM & Marketing Automation Consultant
     
     P.S. While you wait, check out my case study with Allegro: 
     [Link to case study]

2. Set Property: Lead Status = "New Lead" (0 min delay)

3. Create Task: "Follow up with {{contact.firstname}}" (0 min delay)
   Assigned to: Rafał
   Due: Tomorrow 10am
   Note: "Review contact form submission and schedule consultation"

4. If No Response After 3 Days → Send Follow-up Email
   Subject: "Quick follow-up on your CRM inquiry"
   Body:
     Hi {{contact.firstname}},
     
     I wanted to follow up on your inquiry from {{contact.createdate}}.
     
     I'm here to help with:
     - CRM strategy & implementation
     - Marketing automation setup
     - Revenue transformation (2-5x ROI)
     
     Book your free consultation here: [Calendly link]
     
     Or simply reply to this email with your availability.
     
     Best,
     Rafał

5. If Still No Response After 7 Days → Final Follow-up
   Subject: "Last chance to chat about {{contact.consultation_type}}"
   Body:
     Hi {{contact.firstname}},
     
     I haven't heard back from you, so I assume you're still evaluating 
     your options. No worries!
     
     If your priorities change and you'd like to discuss 
     {{contact.consultation_type}}, I'm just one email away.
     
     Here's a quick resource that might help:
     [Link to relevant blog post or guide]
     
     Best of luck with your projects,
     Rafał

6. If Meeting Booked → Remove from workflow
```

**Email Templates Design**:
- Plain text (more personal, higher open rates)
- Minimal HTML (if needed, match website branding)
- Clear CTAs
- Personal tone (no corporate jargon)

---

#### Task 3.2: Create Lead Scoring System
**Time**: 30 min  
**Priority**: MEDIUM

**Location**: Settings → Properties → Lead Scoring

**Scoring Rules**:

```yaml
Positive Criteria:
+20: Submitted contact form
+15: Visited pricing/services page 3+ times
+10: Downloaded lead magnet (future)
+15: Opened 3+ emails
+25: Clicked "Book Consultation" link
+30: Visited 5+ pages in one session
+10: Returned to site 3+ times
+20: LinkedIn profile matched (if enriched)

Negative Criteria:
-5: No email opens in 30 days
-10: Bounced email
-15: Unsubscribed from emails

Lead Score Thresholds:
0-24: Cold Lead (low priority)
25-49: Warm Lead (medium priority)
50-74: Hot Lead (high priority - follow up within 24h)
75+: Very Hot Lead (call immediately)
```

**Workflow Integration**:
```yaml
Trigger: Contact score reaches 50+

Actions:
1. Send Internal Notification
   To: rafal@oleksiakconsulting.com
   Subject: "🔥 Hot Lead Alert: {{contact.firstname}} {{contact.lastname}}"
   Body:
     Score: {{contact.hubspotscore}}
     Company: {{contact.company}}
     Interest: {{contact.consultation_type}}
     
     Recent Activity:
     - {{contact.recent_conversion}}
     
     Action Required: Call or email within 24 hours

2. Create High-Priority Task
   Assigned to: Rafał
   Due: Today 5pm
   Type: "Follow up with hot lead"
```

---

#### Task 3.3: Create Lead Segmentation Lists
**Time**: 30 min  
**Priority**: MEDIUM

**Location**: Contacts → Lists → Create list

**List 1: "Hot Leads - Needs Immediate Follow-up"**
```yaml
Criteria:
- Lead Score ≥ 50
- Contact Owner = None OR Last Contact Date > 3 days ago
- Lifecycle Stage ≠ Customer

Purpose: Daily review list for Rafał
```

**List 2: "CRM Strategy Inquiries"**
```yaml
Criteria:
- Consultation Type = "CRM Strategy"
- Form Submission Date ≤ 30 days

Purpose: Targeted email campaign about CRM transformation
```

**List 3: "Marketing Automation Inquiries"**
```yaml
Criteria:
- Consultation Type = "Marketing Automation"
- Form Submission Date ≤ 30 days

Purpose: Targeted email campaign about automation ROI
```

**List 4: "Unengaged Leads (Nurture Campaign)"**
```yaml
Criteria:
- Form Submission Date > 30 days ago
- Last Email Open Date > 14 days OR Never opened
- Lifecycle Stage = Lead

Purpose: Re-engagement campaign with case studies
```

---

#### Task 3.4: Create Nurture Email Campaign
**Time**: 60 min  
**Priority**: MEDIUM

**Campaign**: "CRM Transformation Nurture Series"

**Email 1: Day 0 - Welcome (created in Task 3.1)**

**Email 2: Day 3 - Case Study**
```yaml
Subject: "How Allegro increased revenue with CRM automation"
Preview: "Real results from a real client..."

Body:
Hi {{contact.firstname}},

I wanted to share a success story that might resonate with your 
{{contact.consultation_type}} goals.

[Case Study: Allegro]
- Challenge: Manual CRM processes, low adoption
- Solution: Automated workflows, sales enablement
- Results: 2x revenue in 6 months

Key Takeaways:
1. Start with high-impact processes first
2. Focus on user adoption (not just features)
3. Measure ROI continuously

Want to discuss how this applies to your business?
Book a free consultation: [Calendly link]

Best,
Rafał

P.S. Download the full case study here: [PDF link]
```

**Email 3: Day 7 - Methodology**
```yaml
Subject: "The 'Zawsze Syntezuj' Framework Explained"
Preview: "How I transform CRM from cost center to revenue driver..."

Body:
Hi {{contact.firstname}},

Most consultants audit your CRM and hand you a 50-page report.

I do the opposite.

My "Zawsze Syntezuj" (Always Synthesize) approach:
1. Identify revenue-driving actions (not everything)
2. Create ready-to-implement solutions
3. Focus on "So What?" and "What Next?"

No fluff. Just results.

Example: Client had 100 automation opportunities.
We implemented 5 high-impact ones.
Result: 3x ROI in 3 months.

Read more about the methodology: [Blog link]

Ready to apply this to your business?
Let's chat: [Calendly link]

Best,
Rafał
```

**Email 4: Day 14 - Free Resource**
```yaml
Subject: "Free CRM Audit Checklist (15 minutes to completion)"
Preview: "Evaluate your CRM's ROI potential..."

Body:
Hi {{contact.firstname}},

I created a quick CRM audit checklist you can complete in 15 minutes.

It will help you identify:
✓ Revenue leaks in your current CRM
✓ Automation opportunities (quick wins)
✓ Where to start for maximum ROI

Download the checklist: [Link]

After completing it, I'm happy to review your results on a free call.

Book here: [Calendly link]

Best,
Rafał
```

**Email 5: Day 21 - Offer Expiry (Soft)**
```yaml
Subject: "Last call for free consultation"
Preview: "Spots filling up for January..."

Body:
Hi {{contact.firstname}},

Quick note: My consultation calendar is filling up for January.

If you're serious about transforming your CRM in 2025, 
let's get something on the books.

Book your free 30-min consultation: [Calendly link]

No obligation. Just a conversation about your goals.

Best,
Rafał

P.S. If you're not ready, no worries! You can always reach out 
when the time is right.
```

**Workflow Settings**:
- Delay between emails: 3-4 days
- Send time: 10am CET (best open rates)
- Exclude: Contacts who booked consultation
- Exclude: Contacts who replied to previous email

---

### PHASE 4: Analytics & Reporting Setup (1-2 hours)

#### Task 4.1: Create HubSpot Dashboard
**Time**: 30 min  
**Priority**: HIGH

**Location**: Reports → Dashboards → Create dashboard

**Dashboard**: "Website Performance & Leads"

**Metrics to Track**:

```yaml
Row 1: Lead Generation
- New Contacts (This Month vs Last Month)
- Form Submissions (This Month)
- Form Conversion Rate
- Lead Score Distribution (bar chart)

Row 2: Lead Quality
- Hot Leads (Score 50+) - This Week
- Consultations Booked (This Month)
- Average Time to First Response
- Lead-to-Customer Conversion Rate

Row 3: Email Performance
- Email Open Rate (Last 30 Days)
- Email Click-Through Rate
- Most Opened Email (by subject)
- Unsubscribe Rate

Row 4: Website Analytics
- Page Views (This Month)
- Most Visited Pages
- Traffic Sources (Organic, Direct, Referral, Social)
- Bounce Rate by Page

Row 5: Pipeline
- Deals Created (This Month)
- Deal Value (This Month)
- Average Deal Size
- Close Rate
```

**Auto-Refresh**: Daily at 6am CET

**Email Report**: Send to rafal@oleksiakconsulting.com every Monday 9am

---

#### Task 4.2: Set Up Attribution Reporting
**Time**: 30 min  
**Priority**: MEDIUM

**Location**: Reports → Analytics Tools → Attribution

**Goal**: Understand which channels drive best leads

**Attribution Model**: First Touch + Last Touch

**Report 1: "Which channels bring the most leads?"**
```yaml
Dimensions:
- Original Source
- Original Source Drill-Down 1 (e.g., LinkedIn post, Google Organic)

Metrics:
- Contacts Created
- Form Submissions
- Consultations Booked
- Deals Closed
- Revenue Generated

Filters:
- Date Range: Last 90 days
- Contact Lifecycle Stage: Lead, MQL, SQL, Opportunity, Customer

Group By: Original Source
```

**Report 2: "Which pages convert best?"**
```yaml
Dimensions:
- Landing Page URL

Metrics:
- Sessions
- Form Submissions
- Conversion Rate
- Average Time on Page

Filters:
- Date Range: Last 30 days
- Min Sessions: 10

Sort By: Conversion Rate (highest first)
```

**Insights to Track**:
- Best performing blog posts (future content strategy)
- Best converting CTAs (A/B test opportunities)
- Traffic sources with highest lead score (prioritize marketing)

---

#### Task 4.3: Create Weekly Review Routine
**Time**: 10 min (one-time setup)  
**Priority**: LOW

**Recurring Task in HubSpot**:
```yaml
Task: "Weekly Lead Review"
Frequency: Every Monday 9am CET
Assigned to: Rafał
Checklist:
□ Review dashboard (5 min)
□ Follow up with hot leads (10 min)
□ Reply to new form submissions (15 min)
□ Adjust email subject lines based on open rates (5 min)
□ Check for any system issues (3 min)

Total Time: ~40 min/week
```

**Monthly Review**:
```yaml
Task: "Monthly Marketing Performance Review"
Frequency: First Monday of month, 10am CET
Checklist:
□ Review attribution report (10 min)
□ Analyze email campaign performance (10 min)
□ Identify top 3 traffic sources (5 min)
□ Plan next month's content based on data (20 min)
□ Update lead scoring rules if needed (10 min)

Total Time: ~55 min/month
```

---

### PHASE 5: Testing & Quality Assurance (1 hour)

#### Task 5.1: End-to-End Testing
**Time**: 30 min  
**Priority**: HIGH

**Test Checklist**:

```yaml
Form Submission Flow:
□ Desktop Chrome: Submit form → Verify contact created in HubSpot
□ Desktop Safari: Submit form → Verify contact created
□ Mobile Chrome (Android): Submit form → Verify contact created
□ Mobile Safari (iPhone): Submit form → Verify contact created
□ Test validation: Submit with invalid email → Error shown
□ Test success message: Form submits → Success message displays

Email Automation:
□ Submit form → Receive welcome email within 5 min
□ Check email content: Correct personalization ({{firstname}})
□ Check email links: All CTAs work (Calendly, case study)
□ Check internal notification: Email sent to rafal@oleksiakconsulting.com

Lead Scoring:
□ Submit form → Lead score = 20 ✓
□ Open email → Lead score increases to 35 ✓
□ Visit 3+ pages → Lead score increases to 50+ ✓
□ Hot lead notification sent ✓

Tracking:
□ Visit homepage → HubSpot tracks page view ✓
□ Navigate to services → HubSpot tracks page view ✓
□ Submit form → HubSpot tracks conversion ✓
□ Check Analytics: Sessions, form submissions visible in dashboard

Chat Widget (if enabled):
□ Load website → Chat widget appears after 5 sec ✓
□ Send test message → Notification sent to rafal@oleksiakconsulting.com ✓
□ Test mobile → Chat widget works on mobile ✓
```

---

#### Task 5.2: Performance Testing
**Time**: 20 min  
**Priority**: MEDIUM

**Test Impact on Website Performance**:

```bash
# 1. Run Lighthouse audit BEFORE HubSpot
npm run build
npm start
# Open Chrome DevTools → Lighthouse → Run audit
# Note scores:
- Performance: ___
- Accessibility: ___
- Best Practices: ___
- SEO: ___

# 2. Run Lighthouse audit AFTER HubSpot integration
# (With all HubSpot scripts loaded)
# Open Chrome DevTools → Lighthouse → Run audit
# Compare scores:
- Performance: ___ (expect 5-10 point drop - acceptable)
- Accessibility: ___ (should be same)
- Best Practices: ___ (should be same)
- SEO: ___ (should be same)

# 3. Check bundle size
npm run build -- --analyze
# Note: HubSpot scripts are external (not in bundle)
# Main bundle should NOT increase significantly
```

**Acceptance Criteria**:
- Performance score: Still 85+ (mobile)
- No layout shifts (CLS < 0.1)
- Form loads within 2 seconds
- Chat widget doesn't block page load

---

#### Task 5.3: Rollback Plan Documentation
**Time**: 10 min  
**Priority**: HIGH

**File**: `HUBSPOT_ROLLBACK.md`

```markdown
# HubSpot Integration Rollback Plan

## If HubSpot Integration Fails

### Quick Rollback (10 minutes)

1. **Restore Old Contact Form**
```bash
# Revert FinalCTA.tsx to use Resend
git checkout HEAD~1 -- app/components/sections/FinalCTA.tsx

# Remove HubSpot components (don't delete, just comment out in layout.tsx)
# Comment out: <HubSpotTracking />
# Comment out: <HubSpotChat /> (if enabled)
```

2. **Verify Old Form Works**
```bash
npm run dev
# Test form submission → Email sent via Resend ✓
```

3. **Deploy Rollback**
```bash
git add .
git commit -m "fix: rollback to Resend form (HubSpot issues)"
git push origin main
# Vercel auto-deploys in ~2 min
```

### Partial Rollback (Keep HubSpot Tracking, Remove Form)

- Keep: HubSpot tracking code (analytics)
- Remove: HubSpot form (use Resend)
- Benefit: Still get visitor analytics + reliable form

### Complete Removal

```bash
# Uninstall package
npm uninstall next-hubspot

# Remove components
rm -rf app/components/tracking/HubSpotTracking.tsx
rm -rf app/components/forms/HubSpotContactForm.tsx
rm -rf app/components/chat/HubSpotChat.tsx

# Remove env vars
# Remove NEXT_PUBLIC_HUBSPOT_* from .env.local

# Revert layout.tsx
git checkout HEAD~1 -- app/layout.tsx
```

## Common Issues & Fixes

### Issue 1: Form Not Loading
**Symptom**: Empty div, no HubSpot form appears
**Fix**:
```bash
# Check browser console for errors
# Common causes:
- Wrong Portal ID or Form ID
- AdBlocker enabled (test in incognito)
- CORS issues (check HubSpot domain whitelist)
```

### Issue 2: Performance Drop
**Symptom**: Lighthouse score < 85
**Fix**:
```typescript
// Use lazyOnload strategy for chat widget
<HubSpotChat strategy="lazyOnload" />

// Defer form loading until user scrolls
const [showForm, setShowForm] = useState(false);
useEffect(() => {
  const observer = new IntersectionObserver(/* ... */);
}, []);
```

### Issue 3: Styling Issues
**Symptom**: HubSpot form doesn't match design
**Fix**:
```css
/* Add more specific selectors in globals.css */
.hubspot-form-wrapper .hs-form-field {
  margin-bottom: 1.5rem !important;
}
```
```

---

## 📅 Implementation Timeline

### Day 1 (2-3 hours)
- ✅ Phase 1: HubSpot Account Setup (30 min)
- ✅ Phase 2: Tasks 2.1-2.4 (Website Integration - Tracking + Basic Components) (1.5h)
- ✅ Phase 2: Task 2.5 (Create form in HubSpot Dashboard) (15 min)

**Checkpoint**: HubSpot tracking active, form created in dashboard

---

### Day 2 (2-3 hours)
- ✅ Phase 2: Task 2.6 (Replace contact form) (30 min)
- ✅ Phase 3: Tasks 3.1-3.2 (Email automation + Lead scoring) (1.5h)
- ✅ Phase 5: Task 5.1 (End-to-end testing) (30 min)

**Checkpoint**: Form working, emails sending, leads scoring

---

### Day 3 (1-2 hours)
- ✅ Phase 3: Tasks 3.3-3.4 (Lists + Nurture campaign) (1.5h)
- ✅ Phase 4: Tasks 4.1-4.3 (Dashboard + Attribution) (1h)
- ✅ Phase 5: Tasks 5.2-5.3 (Performance testing + Rollback plan) (30 min)

**Checkpoint**: Full system operational, analytics dashboard live

---

### Optional (Later)
- ⏳ Phase 2: Task 2.7 (Chat widget) - 20 min
- ⏳ Advanced workflows (lead nurturing campaigns)
- ⏳ HubSpot Sales integration (pipeline management)

---

## 🎯 Success Criteria

### Week 1 (After Launch)
- [ ] 100% of form submissions → HubSpot CRM ✅
- [ ] Welcome email sent within 5 min ✅
- [ ] Lead scoring working correctly ✅
- [ ] Dashboard showing accurate data ✅

### Week 2-4 (Optimization)
- [ ] 30% increase in lead-to-consultation conversion
- [ ] Average response time < 24 hours
- [ ] Email open rate > 25% (industry avg: 21%)
- [ ] Hot lead follow-up < 4 hours

### Month 2-3 (Scale)
- [ ] 50+ leads captured in HubSpot
- [ ] 10+ consultations booked via automation
- [ ] Attribution data shows top 3 channels
- [ ] Nurture campaign running automatically

---

## 🚨 Critical Reminders

### Security
```bash
# NEVER commit API keys to Git
# Always use .env.local
# Verify .gitignore includes:
.env.local
.env*.local
```

### Data Privacy (GDPR)
```yaml
Required:
- [ ] Add GDPR checkbox to form: "I agree to receive emails"
- [ ] Privacy policy link on website
- [ ] Cookie consent banner (if targeting EU)
- [ ] "Unsubscribe" link in all emails (HubSpot adds automatically)
```

### Backup
```bash
# Before replacing contact form:
1. Create Git branch: hubspot-integration
2. Commit working Resend form
3. Test HubSpot form
4. If issues → rollback to Resend

# Keep Resend endpoint for:
- Internal notifications
- Transactional emails
- Backup if HubSpot fails
```

---

## 📞 Support & Troubleshooting

### HubSpot Support
- Documentation: https://developers.hubspot.com/docs
- Community: https://community.hubspot.com/
- Support: https://help.hubspot.com/

### Common Questions

**Q: Can I use both Resend AND HubSpot?**
A: Yes! Use HubSpot for lead capture + CRM, Resend for transactional emails.

**Q: Will HubSpot slow down my website?**
A: Minimal impact (~5-10 Lighthouse points). Use `lazyOnload` strategy for non-critical scripts.

**Q: Do I need HubSpot paid plan?**
A: No! Free CRM tier is perfect for starting consultancy (up to 1M contacts).

**Q: Can I export leads from HubSpot?**
A: Yes! Contacts → Actions → Export (CSV format).

**Q: What if I switch CRM later?**
A: HubSpot has API access + integrations with most CRMs (easy migration).

---

## 🎓 Next Steps After Integration

### Week 1-2: Content Creation
- [ ] Write 3 case studies (Allegro, Booksy, Jameel Motors)
- [ ] Create CRM Audit Checklist (lead magnet)
- [ ] Write 2 blog posts (SEO + lead nurturing)

### Week 3-4: Advanced Automation
- [ ] Set up LinkedIn integration (auto-import leads)
- [ ] Create deal pipeline (track consultations → closed deals)
- [ ] Set up sequences (automated follow-up cadences)

### Month 2: Optimization
- [ ] A/B test email subject lines
- [ ] Analyze top-performing CTAs
- [ ] Optimize lead scoring based on data
- [ ] Create retargeting lists for ads

---

## ✅ One-Command Implementation

**For Claude Code** (when you're ready):

```bash
"Claude Code, implement the HubSpot integration following the plan in HUBSPOT_INTEGRATION_PLAN.md. 
Start with Phase 1 (HubSpot setup instructions for me) and Phase 2 (code implementation). 
Create all necessary components, update environment variables, and test the integration. 
Stop before Phase 3 (email automation - I'll do manually in HubSpot dashboard)."
```

---

**Questions or Issues?** 
- Check `HUBSPOT_ROLLBACK.md` for troubleshooting
- Consult HubSpot documentation
- Test in isolation before full deployment

**Last Updated**: 2025-11-12  
**Version**: 1.0  
**Status**: Ready for Implementation
