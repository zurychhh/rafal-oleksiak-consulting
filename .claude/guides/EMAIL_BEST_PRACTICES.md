# EMAIL BEST PRACTICES - Rafał Oleksiak Consulting
**Comprehensive Email Marketing Guide for Claude Code**

**Last Updated**: 2025-11-21  
**Project**: oleksiakconsulting.com  
**Purpose**: Standardy tworzenia wszystkich emaili w projekcie (transakcyjne, marketing, LAMA)

---

## 📋 TABLE OF CONTENTS

1. [Project Context](#project-context)
2. [B2B Email Marketing Principles](#b2b-email-marketing-principles)
3. [Technical Implementation](#technical-implementation)
4. [HTML Email Best Practices](#html-email-best-practices)
5. [Mobile-First Design](#mobile-first-design)
6. [Email Copywriting](#email-copywriting)
7. [Subject Lines](#subject-lines)
8. [Call-to-Action (CTA) Best Practices](#call-to-action-cta-best-practices)
9. [Email Types in This Project](#email-types-in-this-project)
10. [HubSpot Integration Guidelines](#hubspot-integration-guidelines)
11. [Deliverability & Compliance](#deliverability--compliance)
12. [Testing & QA Checklist](#testing--qa-checklist)
13. [Performance Benchmarks](#performance-benchmarks)
14. [Email Templates](#email-templates)

---

## 🎯 PROJECT CONTEXT

### Business Model
**Rafał Oleksiak Consulting** = B2B consulting firm specializing in:
- CRM strategy & optimization
- Email marketing automation
- Marketing automation

**Target Audience:**
- C-level executives (CFO, CMO, CTO)
- Marketing Directors
- Business Owners (młode firmy + established corporations)

**Core Methodology**: "Zawsze syntezuj" (Always Synthesize)
- Provide actionable solutions, not just analysis
- Focus on ROI and measurable outcomes
- Professional, data-driven approach

### Brand Identity (from Design System)

**Colors:**
- Primary: Vivid Purple `#7B2CBF` / `#9D4EDD`
- Accent: Electric Blue `#0066FF` / `#00BFFF`
- Background: Moonlit Grey `#1A1A2E`
- Text: White `#FFFFFF` / Gray `#E0E0E0`

**Typography:**
- Headings: **Poppins** (bold, 600-700 weight)
- Body: **DM Sans** (regular, 400-500 weight)

**Tone of Voice:**
- Professional but approachable
- Data-driven (include metrics, ROI)
- Clear and concise (no fluff)
- Action-oriented (focus on "what next?")

---

## 📈 B2B EMAIL MARKETING PRINCIPLES

### Core Statistics (Industry Benchmarks 2025)

**ROI & Performance:**
- Email ROI: $36-42 for every $1 spent (highest of all channels)
- B2B executives prefer email: 59% say it's their #1 communication channel
- Mobile opens: 71.5% of emails opened on mobile devices
- Personalization boost: 202% better conversion than generic emails

**Engagement Benchmarks:**
- B2B Open Rate: 21-24% average
- B2B Click Rate: 2.5-3.5% average
- B2B Conversion Rate: 2-5% average
- Nurture campaigns: 3x faster conversions

### Key Principles for B2B Consulting

#### 1. **Permission-First Approach**
- ALWAYS honor GDPR/CAN-SPAM compliance
- Explicit opt-in required for marketing
- Clear unsubscribe mechanism
- Document consent timestamps (HubSpot handles this)

#### 2. **Segmentation Over Blasting**
- Segment by:
  - Job role (C-level, Director, Manager)
  - Company size (SMB vs Enterprise)
  - Industry vertical
  - Buyer journey stage (Awareness, Consideration, Decision)
- 760% increase in revenue from segmented campaigns

#### 3. **Value-First Content**
- Lead with insights, NOT sales pitch
- Educational content performs 40% better than promotional
- Include case studies, data, frameworks
- "So What?" test: Every claim must answer business value

#### 4. **Personalization Beyond {FirstName}**
- Reference specific challenges (from form submission)
- Industry-specific examples
- Company-level personalization
- Behavioral triggers (downloaded guide, attended webinar)

#### 5. **Nurture, Don't Push**
- B2B sales cycles: 3-6 months average
- Multiple touchpoints required (7-13 touches before conversion)
- Focus on relationship building
- Consultation-first approach (not hard sell)

---

## 🔧 TECHNICAL IMPLEMENTATION

### Current Tech Stack

**Email Service:** Resend API
- Provider: `resend.com`
- FREE tier: 3,000 emails/month
- Already configured in `/app/api/send-email/route.ts`

**CRM:** HubSpot
- FREE tier with contact management
- Timeline activity logging
- Marketing consent tracking (GDPR compliant)

**Dependencies:**
```json
{
  "resend": "^3.0.0",
  "anthropic": "^0.18.0" // For LAMA email generation
}
```

**Environment Variables:**
```env
RESEND_API_KEY=re_xxxxx
HUBSPOT_ACCESS_TOKEN=pat-xxxxx
FROM_EMAIL=rafal@oleksiakconsulting.com
TO_EMAIL=rafal@oleksiakconsulting.com
```

### Email Sending Pattern

```typescript
// Standard Resend email structure
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const { data, error } = await resend.emails.send({
  from: 'Rafał Oleksiak <rafal@oleksiakconsulting.com>',
  to: ['recipient@example.com'],
  subject: 'Subject line here',
  html: htmlContent, // HTML template
  replyTo: 'rafal@oleksiakconsulting.com' // Optional
});
```

---

## 📧 HTML EMAIL BEST PRACTICES

### Critical Technical Rules

#### 1. **Email Client Compatibility**

**Problem:** Email clients render HTML differently
- Gmail: Limited CSS support, clips emails >102KB
- Outlook: Uses Microsoft Word rendering engine (2007-2024)
- Apple Mail: Full CSS support but inconsistent
- Mobile clients: Various WebKit/Blink engines

**Solution:**
- Table-based layouts (NOT div + CSS Grid/Flexbox)
- Inline CSS (email clients block external stylesheets)
- Simple, flat structure

#### 2. **Table-Based Structure**

```html
<!-- CORRECT: Table-based layout -->
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">
  <tr>
    <td style="padding: 20px; background-color: #f5f5f5;">
      <h1 style="font-family: 'Poppins', Arial, sans-serif; color: #1A1A2E; margin: 0;">
        Heading Here
      </h1>
    </td>
  </tr>
  <tr>
    <td style="padding: 20px;">
      <p style="font-family: 'DM Sans', Arial, sans-serif; color: #333; line-height: 1.6; margin: 0 0 16px 0;">
        Body content here.
      </p>
    </td>
  </tr>
</table>
```

**Key Points:**
- `role="presentation"` for accessibility
- `cellspacing="0" cellpadding="0" border="0"` for consistent rendering
- `width="100%"` with `max-width: 600px` for desktop/mobile
- Inline styles on EVERY element

#### 3. **Width & Sizing Guidelines**

**Desktop:**
- Max width: 600-640px (fits most preview panes)
- Padding: 20-40px sides (mobile: 16-20px)

**Mobile:**
- Single-column layout
- Font size: 16px minimum (body text)
- Touch targets: 44x44px minimum (buttons, links)

**File Size:**
- Total HTML: < 100KB (Gmail clips larger emails)
- Images: Compress to < 1MB total
- Inline CSS only (no external stylesheets)

#### 4. **Inline CSS Only**

```typescript
// CORRECT: Inline CSS helper function
function inlineStyles(tag: string, styles: Record<string, string>, content: string): string {
  const styleString = Object.entries(styles)
    .map(([key, value]) => `${key}: ${value}`)
    .join('; ');
  
  return `<${tag} style="${styleString}">${content}</${tag}>`;
}

// Usage:
const heading = inlineStyles('h2', {
  'font-family': "'Poppins', Arial, sans-serif",
  'color': '#7B2CBF',
  'font-size': '24px',
  'font-weight': '600',
  'margin': '0 0 16px 0'
}, 'Your Heading');
```

#### 5. **Safe Fonts**

**Email-Safe Fonts** (no web font support in most clients):
- Arial (sans-serif)
- Georgia (serif)
- Times New Roman (serif)
- Courier New (monospace)
- Verdana (sans-serif)

**Fallback Chain:**
```css
font-family: 'Poppins', Arial, Helvetica, sans-serif;
font-family: 'DM Sans', Arial, Helvetica, sans-serif;
```

**Note:** Poppins/DM Sans won't load in emails, but fallback to Arial is acceptable.

#### 6. **Images Best Practices**

**Assume Images Will Be Blocked:**
- Gmail, Outlook, Yahoo block images by default
- 43% of users have images disabled

**Solutions:**
```html
<!-- ALWAYS include alt text -->
<img 
  src="https://oleksiakconsulting.com/logo.png" 
  alt="Rafał Oleksiak Consulting Logo"
  width="200" 
  height="50"
  style="display: block; max-width: 100%; height: auto;"
/>

<!-- Critical text as HTML, not image -->
<h1 style="font-family: Arial, sans-serif; color: #7B2CBF;">
  Your CRM Audit Results
</h1>
<!-- NOT: <img src="heading.png" alt="Your CRM Audit Results"> -->
```

**Image Optimization:**
- Format: PNG (logos), JPEG (photos)
- Compression: TinyPNG, ImageOptim
- Hosting: Use absolute URLs (https://...)
- Max dimensions: 600px wide

#### 7. **Color Contrast (Accessibility)**

**WCAG 2.1 AA Standard:**
- Normal text (< 18px): 4.5:1 contrast ratio
- Large text (≥ 18px): 3:1 contrast ratio

**Your Brand Colors:**
- `#7B2CBF` (purple) on `#FFFFFF` (white): ✅ 5.8:1 (pass)
- `#0066FF` (blue) on `#FFFFFF` (white): ✅ 4.5:1 (pass)
- `#FFFFFF` (white) on `#1A1A2E` (dark gray): ✅ 15.2:1 (pass)

**Testing Tool:** https://webaim.org/resources/contrastchecker/

---

## 📱 MOBILE-FIRST DESIGN

### Statistics
- 71.5% of emails opened on mobile (2025)
- 80% delete emails that don't display properly on mobile
- Mobile-responsive emails get 15% higher click rates

### Responsive Email Structure

```html
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Email Title</title>
  <style type="text/css">
    /* Media query for mobile */
    @media only screen and (max-width: 600px) {
      .container {
        width: 100% !important;
        padding: 16px !important;
      }
      .heading {
        font-size: 20px !important;
        line-height: 1.3 !important;
      }
      .body-text {
        font-size: 16px !important;
      }
      .cta-button {
        width: 100% !important;
        padding: 16px 24px !important;
      }
      /* Stack columns on mobile */
      .two-column {
        width: 100% !important;
        display: block !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr>
      <td style="padding: 20px 0;">
        <table class="container" role="presentation" cellspacing="0" cellpadding="0" border="0" 
               width="600" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Email content here -->
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

### Mobile-Specific Guidelines

**Typography:**
- Heading: 20-24px mobile, 28-32px desktop
- Body: 16px minimum (never smaller)
- Line height: 1.5-1.6 for readability

**Spacing:**
- Padding: 16-20px sides (mobile), 30-40px (desktop)
- Between elements: 16-24px vertical

**Buttons:**
- Minimum size: 44x44px (Apple HIG standard)
- Full-width on mobile preferred
- Clear tap targets (avoid tiny links)

**Links:**
- Make entire button clickable (not just text)
- Avoid links too close together (< 8px)

---

## ✍️ EMAIL COPYWRITING

### The AIDA Framework (B2B Adaptation)

**A**ttention → **I**nterest → **D**esire → **A**ction

#### 1. **Attention (Subject Line + Preheader)**
- Subject: Short, specific, curiosity-driven
- Preheader: Expand on subject, add context

**Example:**
```
Subject: Your CRM is costing you €50K/year
Preheader: Here's the 3-minute audit that proves it (+ fix)
```

#### 2. **Interest (Opening Paragraph)**
- Hook with problem they recognize
- Use "you" language (not "we")
- Specific, not generic

**Example:**
```
Hi {{FirstName}},

I analyzed 47 CRM implementations last quarter. 
The average company loses €50,000 yearly on:
• Poor lead scoring (38% of qualified leads ignored)
• Manual data entry (15 hours/week per sales rep)
• Disconnected tools (3-5 platforms that don't talk)

Does this sound familiar?
```

#### 3. **Desire (Body Content)**
- Paint picture of solution
- Include social proof (case study, stat)
- Emphasize benefit over feature

**Example:**
```
We helped Allegro cut their lead response time from 
48 hours to 4 hours. Result? 127% increase in demos booked.

The fix took 6 weeks, not 6 months.
```

#### 4. **Action (CTA)**
- Single, clear action
- Remove friction
- Low-commitment first step

**Example:**
```
[Schedule 20-Minute Audit Call] ← Calendly link
No pitch. Just specific recommendations for YOUR CRM.
```

### Copywriting Principles

#### **Principle 1: Value-First, Not Feature-First**

**BAD (Feature-first):**
> "Our CRM integration connects to 50+ tools including Salesforce, HubSpot, and Zapier."

**GOOD (Value-first):**
> "Stop copying data between 5 different tools. One integration = 10 hours saved per week."

#### **Principle 2: Specificity Beats Vagueness**

**BAD (Vague):**
> "We help companies improve their marketing."

**GOOD (Specific):**
> "We helped Booksy increase email open rates from 18% to 34% in 90 days using behavioral segmentation."

#### **Principle 3: Show Don't Tell**

**BAD (Tell):**
> "We're experts in CRM optimization."

**GOOD (Show):**
> "Last quarter: 12 CRM audits → avg. ROI of 340% in first year."

#### **Principle 4: "So What?" Test**

Every sentence should pass the "So What?" test:

**CLAIM:** "We use AI-powered lead scoring."  
**SO WHAT?** → "You'll focus on the 20% of leads that close 80% of deals."

**CLAIM:** "Our automation sequences run 24/7."  
**SO WHAT?** → "Your team stops chasing cold leads and focuses on closing warm ones."

#### **Principle 5: Scannable Structure**

**Format for B2B readers who skim:**
- Short paragraphs (2-3 sentences max)
- Bullet points for lists
- Bold key phrases
- White space between sections

**Example:**
```
Here's what we found in your CRM:

✅ Strong: Lead capture forms (8% conversion)
⚠️ Needs work: Email automation (only 2 sequences)
❌ Critical: Lead scoring (not configured)

The fix? 3 weeks, not 3 months.
```

---

## 📬 SUBJECT LINES

### Research-Backed Guidelines (2025)

**Length:**
- Optimal: 6-10 words (40-60 characters)
- Mobile preview: 30-40 characters visible
- Desktop preview: 60-70 characters visible

**Structure:**
- Put critical info first (mobile truncation)
- Avoid ALL CAPS (spam trigger)
- Max 3 punctuation marks (avoid "!!!" or "???")
- Emoji: Use sparingly (1 max for B2B)

### Subject Line Formulas

#### **Formula 1: Problem + Promise**
```
"Your CRM is bleeding leads (here's the fix)"
"3 automation mistakes costing you €10K/month"
"Why your sales team ignores your CRM"
```

#### **Formula 2: Question + Curiosity**
```
"Is your CRM tracking this metric?"
"How much is bad data costing you?"
"Ready to 2x your conversion rate?"
```

#### **Formula 3: Urgency + Specificity**
```
"Last chance: Free CRM audit (48 hours left)"
"3 days left to optimize before Q4"
"Your competitor just automated this process"
```

#### **Formula 4: Social Proof + Relevance**
```
"How Allegro doubled their pipeline in 90 days"
"The CRM strategy that 12 SaaS companies copied"
"Case study: €2M revenue from email automation"
```

#### **Formula 5: Personalization + Value**
```
"{{FirstName}}, your CRM health score: 47/100"
"For {{Company}}: 5-minute audit + 3 quick wins"
"{{FirstName}}, spotted 3 issues in your CRM"
```

### Subject Line Testing Framework

**A/B Test Variables:**
1. Length (short vs medium)
2. Tone (professional vs casual)
3. Personalization (with/without name)
4. Question vs statement
5. Numbers vs no numbers

**Example Test:**
- **A:** "Your CRM audit results are ready"
- **B:** "{{FirstName}}, your CRM scores 47/100"
- Winner: **B** (+18% open rate)

### Subject Lines to AVOID

**Spam Triggers:**
- "FREE" / "100% FREE" / "FREE MONEY"
- "Act now" / "Urgent" / "Limited time"
- ALL CAPS WORDS
- Multiple "!!!" or "???"
- "Dear Friend" / "Hello Sir/Madam"

**Misleading:**
- "Re:" when it's not a reply
- "Fwd:" when it's not forwarded
- False urgency ("Last chance!" when it's not)

**Generic:**
- "Newsletter #47"
- "Update from Rafał"
- "Check this out"

---

## 🎯 CALL-TO-ACTION (CTA) BEST PRACTICES

### CTA Hierarchy

**Primary CTA** (one per email):
- Clear, specific action
- Visually prominent button
- Above the fold if possible

**Secondary CTA** (optional):
- Less prominent (text link)
- Alternative action
- Below primary CTA

### Button Design Guidelines

**Visual Style:**
```html
<table role="presentation" cellspacing="0" cellpadding="0" border="0">
  <tr>
    <td style="border-radius: 8px; background-color: #7B2CBF;">
      <a href="https://calendly.com/rafal-oleksiak" 
         style="display: inline-block; 
                padding: 16px 32px; 
                font-family: 'Poppins', Arial, sans-serif; 
                font-size: 16px; 
                font-weight: 600;
                color: #ffffff; 
                text-decoration: none; 
                border-radius: 8px;">
        Schedule Free Consultation
      </a>
    </td>
  </tr>
</table>
```

**Button Specs:**
- Background: `#7B2CBF` (purple) or `#0066FF` (blue)
- Text: White `#FFFFFF`, bold (600 weight)
- Padding: 16px vertical, 32px horizontal
- Border-radius: 8px
- Font: 16-18px
- Hover state: Darken 10% (use `#6A249F`)

### CTA Copy Principles

#### **Principle 1: Action-Oriented Verbs**

**BAD (Passive):**
- "Learn more"
- "Click here"
- "Read our guide"

**GOOD (Action verbs):**
- "Schedule Your Audit"
- "Download Free Guide"
- "Get Your CRM Score"
- "Book 20-Minute Call"
- "Start Optimization"

#### **Principle 2: Remove Friction**

**High Friction:**
> "Fill out this 10-field form to request a demo"

**Low Friction:**
> "Book your calendar slot now (takes 30 seconds)"

#### **Principle 3: Clarify the Outcome**

**Vague:**
> "Get Started"

**Clear:**
> "Get Your Free CRM Audit (90 seconds)"

#### **Principle 4: Match Stage to Ask**

**Cold Lead (low commitment):**
```
Download: "Get 5-Page CRM Guide (PDF)"
View: "Watch 3-Minute Video"
```

**Warm Lead (medium commitment):**
```
Attend: "Register for Wednesday Webinar"
Read: "View Full Case Study"
```

**Hot Lead (high commitment):**
```
Book: "Schedule Strategy Call"
Start: "Begin Free Trial"
```

### CTA Placement

**Multiple CTA Strategy:**
- Top: Primary CTA (hero section)
- Middle: Reinforce after value prop
- Bottom: Final CTA before footer

**Example:**
```
[Email Structure]

→ Hero + CTA #1: "Schedule Audit"
   ↓
→ Value Prop + Social Proof
   ↓
→ CTA #2: "See Case Study"
   ↓
→ Objection Handling
   ↓
→ CTA #3: "Book Free Call"
```

---

## 📨 EMAIL TYPES IN THIS PROJECT

### 1. **Consultation Request Confirmation**

**Sent when:** User submits consultation form  
**Goal:** Confirm receipt, set expectations, provide next steps

**Template Structure:**
```
Subject: "Consultation Request Received - Next Steps"
Preheader: "We'll respond within 24 hours with 3 time slots"

Body:
- Greeting with name
- Confirmation of submission
- What happens next (response time)
- Calendar link (if applicable)
- Additional resources
- Signature
```

**Example:**
```html
<p>Hi {{FirstName}},</p>

<p>Thanks for reaching out. Your consultation request has been received.</p>

<h3>What happens next:</h3>
<ul>
  <li>We'll review your challenge within 24 hours</li>
  <li>Rafał will send you 3 calendar slots</li>
  <li>The call typically takes 20-30 minutes</li>
</ul>

<p>In the meantime, here's a case study similar to your situation:</p>
[CTA: "Read Allegro Case Study"]

<p>Looking forward to our conversation!</p>
```

### 2. **LAMA Audit Report Email** ⭐ Most Important

**Sent when:** User checks "Send me free audit" on form  
**Goal:** Deliver value immediately, drive consultation booking

**Template Structure:**
```
Subject: "Your Website Audit Results: {{Score}}/100"
Preheader: "5 categories analyzed + specific recommendations"

Header:
- Logo
- Overall score (large, prominent)
- Intro paragraph

Body:
- 5 category breakdowns with progress bars:
  1. Visibility (SEO)
  2. Performance (Speed)
  3. Clarity (Messaging)
  4. Trust (Credibility)
  5. Conversion (CTAs)
- Each category: Score + Key finding + Business impact

CTA Section:
- Primary: "Schedule Strategy Call"
- Secondary: "Download Full Report (PDF)"

Footer:
- Contact info
- Unsubscribe link
- Social links
```

**Key Elements:**
```html
<!-- Overall Score (Hero) -->
<table style="text-align: center; padding: 40px 20px; background: linear-gradient(135deg, #7B2CBF 0%, #9D4EDD 100%);">
  <tr>
    <td>
      <h1 style="color: #ffffff; font-size: 48px; margin: 0;">
        {{overallScore}}<span style="font-size: 24px;">/100</span>
      </h1>
      <p style="color: #ffffff; font-size: 18px; margin: 8px 0 0 0;">
        Overall Website Health Score
      </p>
    </td>
  </tr>
</table>

<!-- Category Score (Progress Bar) -->
<table style="width: 100%; margin: 24px 0;">
  <tr>
    <td>
      <strong style="font-size: 18px; color: #1A1A2E;">
        🎯 Visibility (SEO)
      </strong>
      <div style="width: 100%; height: 8px; background: #e0e0e0; border-radius: 4px; margin: 8px 0;">
        <div style="width: {{visibilityScore}}%; height: 8px; background: #7B2CBF; border-radius: 4px;"></div>
      </div>
      <p style="font-size: 14px; color: #666;">
        Score: {{visibilityScore}}/100
      </p>
      <p style="font-size: 16px; color: #333; line-height: 1.6;">
        {{keyFinding}}
      </p>
      <p style="background: #FFF3E0; padding: 12px; border-left: 4px solid #FF9800; font-size: 14px; color: #E65100;">
        💰 Business Impact: {{impact}}
      </p>
    </td>
  </tr>
</table>
```

**Copywriting for LAMA Email:**
- Use "you" language (not "your website")
- Specific findings (not generic)
- Quantify business impact ("losing 30% of mobile traffic")
- Frame as opportunity ("quick win: add 3 meta tags = 15% more organic traffic")

### 3. **Nurture Sequence (5 emails over 21 days)**

**Email 1: Welcome + Value (Day 0)**
```
Subject: "Thanks for the audit - Here's what we found"
Goal: Reinforce value, share quick win
CTA: "Read Full Methodology"
```

**Email 2: Case Study (Day 3)**
```
Subject: "How we fixed the same issues for Allegro"
Goal: Social proof, show before/after
CTA: "View Case Study"
```

**Email 3: Educational (Day 7)**
```
Subject: "3 CRM mistakes costing you leads"
Goal: Position as expert, educate
CTA: "Download Guide (PDF)"
```

**Email 4: Soft Ask (Day 14)**
```
Subject: "Ready to optimize? Here's how we work"
Goal: Explain process, remove friction
CTA: "See Our Process"
```

**Email 5: Final Ask (Day 21)**
```
Subject: "{{FirstName}}, let's talk about your CRM"
Goal: Direct ask for consultation
CTA: "Book 20-Minute Call"
```

### 4. **Newsletter (Monthly)**

**Structure:**
```
- Industry insight (1 paragraph)
- Quick tip (actionable)
- Case study snippet
- CTA: "Read Full Article"
```

---

## 🔗 HUBSPOT INTEGRATION GUIDELINES

### Contact Creation Flow

**When creating HubSpot contact:**
```typescript
import { createHubSpotContact } from '@/app/lib/hubspot';

const hubspotResult = await createHubSpotContact({
  email: formData.email,
  fullName: formData.fullName,
  website: formData.website,
  challenge: formData.challenge,
  marketingConsent: formData.consent // CRITICAL: GDPR compliance
});
```

### Timeline Activity Logging

**After sending email:**
```typescript
// Log to HubSpot timeline
await logHubSpotActivity({
  contactEmail: formData.email,
  activityType: 'EMAIL_SENT',
  subject: 'LAMA Audit Report Delivered',
  body: `Overall Score: ${auditResult.overallScore}/100`,
  timestamp: new Date().toISOString()
});
```

### Marketing Consent Tracking

**GDPR Compliance:**
- Field: `marketingConsent` (boolean)
- HubSpot field: `hs_legal_basis`
- Values:
  - `true` → "Legitimate interest - contact"
  - `false` → No marketing emails (transactional only)

**Implementation:**
```typescript
// In email send logic
if (!marketingConsent && emailType === 'marketing') {
  console.log('Skipping marketing email - no consent');
  return; // Don't send marketing emails
}

// Transactional emails (LAMA audit, confirmation) = always send
if (emailType === 'transactional') {
  // Send regardless of consent
}
```

---

## 📊 DELIVERABILITY & COMPLIANCE

### Email Authentication (Already Configured)

**SPF, DKIM, DMARC:**
- Configured via Resend
- Improves inbox placement (vs spam folder)
- Trust signal to email providers

### CAN-SPAM Compliance Checklist

✅ **Required elements in EVERY email:**
- [ ] Physical address in footer
- [ ] Clear "From" name (Rafał Oleksiak)
- [ ] Honest subject line (no bait-and-switch)
- [ ] Unsubscribe link (prominent)
- [ ] Honor unsubscribe within 10 days

**Footer Template:**
```html
<table style="width: 100%; padding: 20px; background: #f5f5f5; border-top: 1px solid #e0e0e0;">
  <tr>
    <td style="text-align: center; font-size: 12px; color: #666;">
      <p style="margin: 0 0 8px 0;">
        Rafał Oleksiak Consulting<br>
        ul. Przykładowa 123, 00-001 Warszawa, Poland
      </p>
      <p style="margin: 0 0 8px 0;">
        <a href="{{unsubscribeUrl}}" style="color: #7B2CBF; text-decoration: underline;">
          Unsubscribe
        </a> | 
        <a href="https://oleksiakconsulting.com/privacy" style="color: #7B2CBF; text-decoration: underline;">
          Privacy Policy
        </a>
      </p>
      <p style="margin: 0; font-size: 11px; color: #999;">
        You received this email because you submitted a form at oleksiakconsulting.com
      </p>
    </td>
  </tr>
</table>
```

### GDPR Compliance (EU Market)

**Requirements:**
- Explicit consent for marketing emails
- Easy unsubscribe mechanism
- Data retention policy (HubSpot handles deletion)
- Right to access data (provide upon request)

**Consent Language:**
```
☐ I agree to receive marketing emails from Rafał Oleksiak Consulting 
about CRM optimization, case studies, and industry insights. 
You can unsubscribe anytime.
```

---

## ✅ TESTING & QA CHECKLIST

### Pre-Send Checklist

**Content Review:**
- [ ] Subject line < 60 characters
- [ ] Preheader text present
- [ ] No spelling/grammar errors
- [ ] All links working (test each one)
- [ ] Personalization tokens correct ({{FirstName}}, {{Company}})
- [ ] CTA button present and prominent
- [ ] Footer includes unsubscribe + address

**Technical Review:**
- [ ] Mobile responsive (test on real device)
- [ ] Images load (check URLs)
- [ ] Alt text on all images
- [ ] Inline CSS on all elements
- [ ] Max width 600-640px
- [ ] File size < 100KB
- [ ] No external CSS/fonts

**Deliverability:**
- [ ] SPF/DKIM passing (check Resend dashboard)
- [ ] No spam trigger words (FREE, URGENT, !!!)
- [ ] Sender name clear ("Rafał Oleksiak")
- [ ] Reply-to address set

### Testing Tools

**Email Preview:**
- Litmus (paid, $99/month)
- Email on Acid (paid, $99/month)
- Mail Tester (free, spam score)

**Manual Testing:**
1. Send test to yourself
2. Check on Gmail (web + mobile app)
3. Check on Outlook (web + desktop)
4. Check on Apple Mail (iPhone + Mac)
5. Verify all links click through correctly
6. Test unsubscribe link

### Post-Send Monitoring

**First 24 hours:**
- Open rate (target: 21-24%)
- Click rate (target: 2.5-3.5%)
- Bounce rate (< 2% good)
- Unsubscribe rate (< 0.5% good)
- Spam complaints (< 0.1% acceptable)

**Investigate if:**
- Open rate < 15% → Subject line issue
- Click rate < 1% → CTA or content issue
- Bounce rate > 5% → List quality issue
- Spam rate > 0.5% → Deliverability problem

---

## 📈 PERFORMANCE BENCHMARKS

### B2B Consulting Industry Averages (2025)

| Metric | Good | Average | Poor |
|--------|------|---------|------|
| Open Rate | 25%+ | 18-24% | <15% |
| Click-Through Rate | 3%+ | 2-3% | <1.5% |
| Conversion Rate | 5%+ | 2-4% | <1% |
| Bounce Rate | <2% | 2-5% | >5% |
| Unsubscribe Rate | <0.3% | 0.3-0.5% | >1% |

### Email Type Benchmarks

**Transactional (Confirmation, Receipt):**
- Open Rate: 70-90%
- Click Rate: 10-15%
- Highest engagement

**LAMA Audit Report:**
- Target Open Rate: 60%+ (high value content)
- Target Click Rate: 20%+ (strong CTA)
- Goal: 10% book consultation

**Nurture Sequence:**
- Email 1 (Day 0): 50-60% open
- Email 2 (Day 3): 30-40% open
- Email 5 (Day 21): 15-25% open
- Overall sequence: 5-10% convert to call

**Newsletter:**
- Open Rate: 20-25%
- Click Rate: 2-3%
- Maintenance mode (stay top of mind)

---

## 📝 EMAIL TEMPLATES

### Template 1: Consultation Confirmation

```html
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Consultation Request Received</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr>
      <td style="padding: 20px 0;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" 
               width="600" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #7B2CBF 0%, #9D4EDD 100%);">
              <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: 600;">
                Thanks for Reaching Out
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 0 0 16px 0;">
                Hi {{FirstName}},
              </p>
              <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 0 0 16px 0;">
                Your consultation request has been received. I've reviewed your challenge 
                regarding <strong>{{challenge}}</strong>.
              </p>
              
              <h3 style="font-size: 20px; color: #7B2CBF; margin: 32px 0 16px 0;">
                What happens next:
              </h3>
              <ul style="font-size: 16px; line-height: 1.8; color: #333; padding-left: 20px;">
                <li>I'll send you 3 calendar slots within 24 hours</li>
                <li>Our call typically takes 20-30 minutes</li>
                <li>I'll prepare specific recommendations for {{website}}</li>
              </ul>

              <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 24px 0 0 0;">
                In the meantime, here's a case study similar to your situation:
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 24px 0;">
                <tr>
                  <td style="border-radius: 8px; background-color: #7B2CBF;">
                    <a href="https://oleksiakconsulting.com/case-studies/allegro" 
                       style="display: inline-block; padding: 16px 32px; font-size: 16px; 
                              font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px;">
                      Read Allegro Case Study
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 32px 0 0 0;">
                Looking forward to our conversation!<br><br>
                Rafał
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background: #f5f5f5; border-top: 1px solid #e0e0e0;">
              <p style="font-size: 12px; color: #666; text-align: center; margin: 0;">
                Rafał Oleksiak Consulting<br>
                ul. Przykładowa 123, 00-001 Warszawa, Poland<br>
                <a href="{{unsubscribeUrl}}" style="color: #7B2CBF; text-decoration: underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

### Template 2: LAMA Audit Report (Simplified Structure)

```typescript
// lib/lama/email-template.ts
export function generateLAMAEmail(auditResult: AuditResult): string {
  return `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Website Audit Results</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr>
      <td style="padding: 20px 0;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" 
               width="600" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          
          <!-- Hero Score -->
          <tr>
            <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #7B2CBF 0%, #9D4EDD 100%);">
              <h1 style="color: #ffffff; font-size: 48px; margin: 0; font-weight: 700;">
                ${auditResult.overallScore}<span style="font-size: 24px;">/100</span>
              </h1>
              <p style="color: #ffffff; font-size: 18px; margin: 8px 0 0 0;">
                Overall Website Health Score
              </p>
            </td>
          </tr>

          <!-- Intro -->
          <tr>
            <td style="padding: 30px;">
              <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 0 0 16px 0;">
                Hi ${auditResult.contactName},
              </p>
              <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 0 0 16px 0;">
                We analyzed <strong>${auditResult.url}</strong> across 5 key categories. 
                Here's what we found (and how to fix it):
              </p>
            </td>
          </tr>

          <!-- Category: Visibility -->
          ${renderCategory('Visibility', auditResult.visibility)}

          <!-- Category: Performance -->
          ${renderCategory('Performance', auditResult.performance)}

          <!-- Category: Clarity -->
          ${renderCategory('Clarity', auditResult.clarity)}

          <!-- Category: Trust -->
          ${renderCategory('Trust', auditResult.trust)}

          <!-- Category: Conversion -->
          ${renderCategory('Conversion', auditResult.conversion)}

          <!-- CTA Section -->
          <tr>
            <td style="padding: 40px 30px; background: #F3E8FF; text-align: center;">
              <h3 style="font-size: 24px; color: #7B2CBF; margin: 0 0 16px 0;">
                Ready to Optimize?
              </h3>
              <p style="font-size: 16px; color: #333; margin: 0 0 24px 0;">
                Book a 20-minute strategy call. We'll show you exactly how to implement these fixes.
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                <tr>
                  <td style="border-radius: 8px; background-color: #7B2CBF;">
                    <a href="https://calendly.com/rafal-oleksiak" 
                       style="display: inline-block; padding: 18px 36px; font-size: 18px; 
                              font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px;">
                      Schedule Free Consultation
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background: #f5f5f5; border-top: 1px solid #e0e0e0;">
              <p style="font-size: 12px; color: #666; text-align: center; margin: 0;">
                Rafał Oleksiak Consulting<br>
                CRM & Marketing Automation Expert<br>
                <a href="{{unsubscribeUrl}}" style="color: #7B2CBF;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

function renderCategory(name: string, category: CategoryResult): string {
  const scoreColor = category.score >= 70 ? '#4CAF50' : category.score >= 40 ? '#FF9800' : '#F44336';
  
  return `
    <tr>
      <td style="padding: 30px; border-top: 1px solid #e0e0e0;">
        <h3 style="font-size: 20px; color: #1A1A2E; margin: 0 0 12px 0;">
          ${getIcon(name)} ${name}
        </h3>
        
        <!-- Progress Bar -->
        <div style="width: 100%; height: 8px; background: #e0e0e0; border-radius: 4px; margin: 12px 0;">
          <div style="width: ${category.score}%; height: 8px; background: ${scoreColor}; border-radius: 4px;"></div>
        </div>
        <p style="font-size: 14px; color: #666; margin: 4px 0 16px 0;">
          Score: ${category.score}/100
        </p>

        <!-- Key Finding -->
        <p style="font-size: 16px; color: #333; line-height: 1.6; margin: 0 0 12px 0;">
          <strong>Key Finding:</strong> ${category.keyFinding}
        </p>

        <!-- Business Impact -->
        <div style="background: #FFF3E0; padding: 12px; border-left: 4px solid #FF9800; margin: 16px 0 0 0;">
          <p style="font-size: 14px; color: #E65100; margin: 0;">
            💰 <strong>Business Impact:</strong> ${category.businessImpact}
          </p>
        </div>
      </td>
    </tr>
  `;
}

function getIcon(category: string): string {
  const icons: Record<string, string> = {
    'Visibility': '🎯',
    'Performance': '⚡',
    'Clarity': '💬',
    'Trust': '🔒',
    'Conversion': '🚀'
  };
  return icons[category] || '📊';
}
```

---

## 🎯 QUICK REFERENCE CARD

### Email Checklist (Print This!)

**Before Hitting Send:**
- [ ] Subject line < 60 chars
- [ ] Preheader text present
- [ ] Mobile responsive (test!)
- [ ] CTA button prominent
- [ ] All links working
- [ ] Footer with unsubscribe
- [ ] No spam trigger words
- [ ] Personalization correct
- [ ] Sent test to yourself

**Email Anatomy:**
```
1. Subject Line (40-60 chars)
2. Preheader (80-100 chars)
3. Header/Hero (logo + hook)
4. Body Content (value + proof)
5. CTA Button (primary action)
6. Footer (address + unsubscribe)
```

**Color Palette:**
- Purple: `#7B2CBF` (CTA, headings)
- Blue: `#0066FF` (links, accents)
- Dark: `#1A1A2E` (text)
- Light: `#f5f5f5` (background)

---

## 📚 FURTHER READING

**Official Docs:**
- Resend: https://resend.com/docs
- HubSpot: https://developers.hubspot.com/docs/api
- GDPR: https://gdpr.eu/

**Testing Tools:**
- Mail Tester: https://www.mail-tester.com/ (FREE)
- Litmus: https://www.litmus.com/ ($99/month)
- Email on Acid: https://www.emailonacid.com/ ($99/month)

**Inspiration:**
- Really Good Emails: https://reallygoodemails.com/
- Milled: https://milled.com/

---

**Last Updated**: 2025-11-21  
**Maintained by**: Rafał Oleksiak  
**For Claude Code**: Read this before implementing ANY email functionality

---

END OF DOCUMENT
