# 🔒 STRIPE PAID AUDIT - Implementation Brief for Claude Code

**Project**: Rafał Oleksiak Consulting - oleksiakconsulting.com
**Feature**: Paid Full Audit with Stripe Checkout
**Created**: 2025-12-11
**Priority**: HIGH
**Estimated Time**: 4-6 hours

---

## 📋 Table of Contents

1. [Business Context](#business-context)
2. [Current State](#current-state)
3. [Target State](#target-state)
4. [Prerequisites - What Rafał Must Provide](#prerequisites---what-rafał-must-provide)
5. [Technical Architecture](#technical-architecture)
6. [Implementation Tasks for Claude Code](#implementation-tasks-for-claude-code)
7. [File Structure](#file-structure)
8. [Detailed Implementation Steps](#detailed-implementation-steps)
9. [Testing Checklist](#testing-checklist)
10. [Deployment Checklist](#deployment-checklist)

---

## 🎯 Business Context

### Current Flow (FREE)
1. User fills form with website URL + email + audit checkbox ✓
2. LAMA runs 6-category analysis
3. PDF report generated automatically
4. Email with PDF sent via Resend
5. Contact created in HubSpot

### New Flow (PAID)
1. User fills form with website URL + email
2. User clicks "Get Full Audit" (€99/199 - TBD)
3. **→ Stripe Checkout Session opens**
4. **→ User pays via Stripe**
5. **→ Webhook confirms payment**
6. **→ THEN PDF generated and emailed**
7. Contact updated in HubSpot with "paid_audit: true"

### Revenue Model
- **Price**: €99-199 per audit (Rafał to decide)
- **Cost**: ~€0.50 (Claude API + PDF generation)
- **Margin**: 98%+
- **Potential**: 10-50 paid audits/month = €1,000-10,000/month

---

## 🔄 Current State

### Existing Integrations (Already Working)
- ✅ **Resend API** - Email delivery (`RESEND_API_KEY`)
- ✅ **HubSpot API** - CRM integration (`HUBSPOT_ACCESS_TOKEN`)
- ✅ **Claude API** - AI analysis (`ANTHROPIC_API_KEY`)
- ✅ **Google PageSpeed API** - Performance analysis
- ✅ **PDF Generation** - `/api/pdf-generator`
- ✅ **LAMA Audit** - `/api/lama/audit`

### Existing Files
```
app/api/
├── lama/audit/route.ts      # Main audit endpoint
├── pdf-generator/route.ts   # PDF generation
└── send-email/route.ts      # Email sending

lib/lama/
├── types.ts                 # TypeScript types
├── email-template.ts        # HTML email template
├── hubspot.ts              # HubSpot integration
└── analyzers/              # 6 category analyzers
    ├── visibility.ts
    ├── performance.ts
    ├── clarity.ts
    ├── trust.ts
    ├── conversion.ts
    └── engagement.ts

app/components/sections/
└── FinalCTA.tsx            # Contact form with audit option
```

---

## 🎯 Target State

### New Endpoints to Create
```
app/api/
├── stripe/
│   ├── create-checkout/route.ts   # Create Stripe Checkout Session
│   ├── webhook/route.ts           # Handle Stripe webhooks
│   └── verify-payment/route.ts    # Verify payment status (optional)
```

### Updated Endpoints
```
app/api/
├── lama/audit/route.ts            # Add payment verification check
```

### New Environment Variables
```env
# Stripe (Rafał must provide)
STRIPE_SECRET_KEY=sk_live_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PRICE_ID=price_xxxxx
```

---

## ⚠️ Prerequisites - What Rafał Must Provide

### BEFORE Claude Code Can Start:

#### 1. Stripe Account Setup (Rafał - 15 min)
- [ ] **Create Stripe Account** (if not exists): https://dashboard.stripe.com/register
- [ ] **Activate Live Mode** (complete business verification)
- [ ] **Or use Test Mode** first for development

#### 2. Stripe API Keys (Rafał - 5 min)
From Stripe Dashboard → Developers → API Keys:
- [ ] **Secret Key**: `sk_test_xxxxx` or `sk_live_xxxxx`
- [ ] **Publishable Key**: `pk_test_xxxxx` or `pk_live_xxxxx`

#### 3. Create Product + Price (Rafał - 10 min)
From Stripe Dashboard → Products → Add Product:
- [ ] **Product Name**: "Full Website Audit Report"
- [ ] **Description**: "Comprehensive 100+ page website audit with actionable recommendations"
- [ ] **Price**: €99 or €199 (one-time payment)
- [ ] **Copy Price ID**: `price_xxxxx` (needed for checkout)

#### 4. Webhook Endpoint Setup (Rafał - 5 min)
From Stripe Dashboard → Developers → Webhooks → Add Endpoint:
- [ ] **Endpoint URL**: `https://oleksiakconsulting.com/api/stripe/webhook`
- [ ] **Events to listen**:
  - `checkout.session.completed`
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
- [ ] **Copy Webhook Secret**: `whsec_xxxxx`

#### 5. Add to Vercel Environment Variables (Rafał - 5 min)
Vercel Dashboard → Settings → Environment Variables:
```
STRIPE_SECRET_KEY=sk_live_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PRICE_ID=price_xxxxx
```

#### 6. Add to Local `.env.local` (Rafał - 2 min)
```env
# Add to existing .env.local
STRIPE_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PRICE_ID=price_xxxxx
```

---

## 🏗️ Technical Architecture

### Payment Flow Diagram
```
┌─────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY                            │
└─────────────────────────────────────────────────────────────────┘

[1] User fills form                [2] Clicks "Get Full Audit"
     ↓                                  ↓
┌─────────────┐                   ┌─────────────────────────┐
│ FinalCTA.tsx│ ──────────────→   │ /api/stripe/create-     │
│ (Form)      │    POST request   │ checkout                │
└─────────────┘                   └─────────────────────────┘
                                         ↓
                                  Creates Stripe Session
                                  Returns session.url
                                         ↓
[3] Redirect to Stripe           ┌─────────────────────────┐
    Checkout Page                │ checkout.stripe.com     │
                                 │ (Stripe hosted)         │
                                 └─────────────────────────┘
                                         ↓
                                  User completes payment
                                         ↓
[4] Stripe sends webhook         ┌─────────────────────────┐
                                 │ /api/stripe/webhook     │
                                 │ Event: checkout.session │
                                 │ .completed              │
                                 └─────────────────────────┘
                                         ↓
[5] Webhook triggers audit       ┌─────────────────────────┐
                                 │ /api/lama/audit         │
                                 │ (with paid=true flag)   │
                                 └─────────────────────────┘
                                         ↓
[6] PDF + Email sent             ┌─────────────────────────┐
    Contact updated in           │ Resend + HubSpot        │
    HubSpot                      │ (existing integrations) │
                                 └─────────────────────────┘
                                         ↓
[7] User redirected to           ┌─────────────────────────┐
    success page                 │ /audit-success          │
                                 │ (thank you page)        │
                                 └─────────────────────────┘
```

### Security Considerations
- ✅ Never expose `STRIPE_SECRET_KEY` to client
- ✅ Validate webhook signature with `STRIPE_WEBHOOK_SECRET`
- ✅ Use Stripe Checkout (PCI compliant, no card data touches our server)
- ✅ Store payment references in metadata for audit trail

---

## 📝 Implementation Tasks for Claude Code

### Task 1: Install Dependencies
```bash
npm install stripe @stripe/stripe-js
```

### Task 2: Create Stripe Client Library
**File**: `lib/stripe.ts`
```typescript
import Stripe from 'stripe';

// Server-side Stripe instance (never expose to client)
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia', // Latest stable
  typescript: true,
});

// Audit product configuration
export const AUDIT_PRODUCT = {
  priceId: process.env.STRIPE_PRICE_ID!,
  name: 'Full Website Audit Report',
  description: 'Comprehensive 100+ page website audit with actionable recommendations',
};
```

### Task 3: Create Checkout Session API
**File**: `app/api/stripe/create-checkout/route.ts`

**Requirements**:
- Accept: `{ url, email, fullName, company }`
- Create Stripe Checkout Session
- Store form data in session metadata (for webhook retrieval)
- Return: `{ sessionId, url }` for redirect

**Key Implementation Details**:
```typescript
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [
    {
      price: process.env.STRIPE_PRICE_ID,
      quantity: 1,
    },
  ],
  mode: 'payment',
  success_url: `${origin}/audit-success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${origin}/#contact`,
  customer_email: email, // Pre-fill customer email
  metadata: {
    // Store audit data for webhook
    audit_url: url,
    full_name: fullName,
    company: company,
  },
  // Optional: Collect billing address for invoices
  billing_address_collection: 'auto',
});
```

### Task 4: Create Webhook Handler
**File**: `app/api/stripe/webhook/route.ts`

**Requirements**:
- Verify Stripe signature (CRITICAL for security)
- Handle `checkout.session.completed` event
- Extract metadata (url, email, fullName, company)
- Trigger LAMA audit with `paid: true` flag
- Log payment to HubSpot

**Key Implementation Details**:
```typescript
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get('stripe-signature')!;
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('[Stripe Webhook] Signature verification failed');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Extract audit data from metadata
    const { audit_url, full_name, company } = session.metadata!;
    const email = session.customer_email!;
    
    // Trigger LAMA audit
    await triggerPaidAudit({
      url: audit_url,
      email,
      fullName: full_name,
      company,
      paymentId: session.payment_intent as string,
    });
  }
  
  return NextResponse.json({ received: true });
}
```

### Task 5: Create Success Page
**File**: `app/audit-success/page.tsx`

**Requirements**:
- Show confirmation message
- Display order details (from session_id query param)
- Explain next steps (audit coming via email in 5 min)
- Clear CTA to book consultation

### Task 6: Update FinalCTA Component
**File**: `app/components/sections/FinalCTA.tsx`

**Changes Needed**:
1. Add "Get Full Audit" button alongside existing form
2. On click → call `/api/stripe/create-checkout`
3. Redirect to Stripe Checkout URL
4. Keep existing free audit checkbox for consultation flow

**UI Proposal**:
```
┌─────────────────────────────────────────────────────────────┐
│ Your CRM Has Blind Spots. Let's Find Them.                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Form Fields: Name, Email, Website URL, Company]           │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ☐ Send me a FREE quick audit (email only)           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [Book Free Consultation]  ←── Primary CTA                  │
│                                                             │
│  ─────────────── or ───────────────                        │
│                                                             │
│  [Get Full 100+ Page Audit - €99]  ←── NEW Stripe CTA      │
│  📄 Comprehensive PDF report                                │
│  🎯 Actionable recommendations                              │
│  ⏰ Delivered in 5 minutes                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Task 7: Update HubSpot Integration
**File**: `lib/lama/hubspot.ts`

**Add Properties**:
- `paid_audit`: boolean
- `payment_id`: string (Stripe payment_intent ID)
- `audit_price`: number

### Task 8: Update LAMA Audit Types
**File**: `lib/lama/types.ts`

**Add to AuditRequest**:
```typescript
export interface AuditRequest {
  url: string;
  email: string;
  fullName?: string;
  company?: string;
  // NEW: Payment data
  paid?: boolean;
  paymentId?: string;
}
```

### Task 9: Update Environment Files
**File**: `.env.example`

Add Stripe variables documentation.

---

## 📁 File Structure After Implementation

```
rafal-oleksiak-consulting/
├── app/
│   ├── api/
│   │   ├── lama/audit/route.ts          # Updated (payment check)
│   │   ├── pdf-generator/route.ts       # Unchanged
│   │   ├── send-email/route.ts          # Unchanged
│   │   └── stripe/                      # NEW
│   │       ├── create-checkout/route.ts # NEW - Create session
│   │       ├── webhook/route.ts         # NEW - Handle events
│   │       └── verify-payment/route.ts  # NEW - Verify status (optional)
│   ├── audit-success/                   # NEW
│   │   └── page.tsx                     # NEW - Success page
│   └── components/sections/
│       └── FinalCTA.tsx                 # Updated (add Stripe button)
│
├── lib/
│   ├── stripe.ts                        # NEW - Stripe client
│   └── lama/
│       ├── types.ts                     # Updated (payment fields)
│       └── hubspot.ts                   # Updated (payment props)
│
└── .env.example                         # Updated (Stripe vars)
```

---

## 🔍 Detailed Implementation Steps

### Step 1: Setup & Dependencies (5 min)
```bash
# Install Stripe packages
npm install stripe @stripe/stripe-js

# Verify installation
npm ls stripe @stripe/stripe-js
```

### Step 2: Create lib/stripe.ts (10 min)
```typescript
// lib/stripe.ts
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

// Configuration
export const STRIPE_CONFIG = {
  priceId: process.env.STRIPE_PRICE_ID!,
  currency: 'eur',
  productName: 'Full Website Audit Report',
  successUrl: '/audit-success',
  cancelUrl: '/#contact',
};
```

### Step 3: Create Checkout API (30 min)
```typescript
// app/api/stripe/create-checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe, STRIPE_CONFIG } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, email, fullName, company } = body;

    // Validation
    if (!url || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: url and email' },
        { status: 400 }
      );
    }

    // Get origin for redirect URLs
    const origin = request.headers.get('origin') || 'https://oleksiakconsulting.com';

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: STRIPE_CONFIG.priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}${STRIPE_CONFIG.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${STRIPE_CONFIG.cancelUrl}`,
      customer_email: email,
      metadata: {
        audit_url: url,
        full_name: fullName || '',
        company: company || '',
        source: 'website_paid_audit',
      },
      billing_address_collection: 'auto',
      // Polish locale
      locale: 'pl',
    });

    console.log(`[Stripe] Checkout session created: ${session.id}`);

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('[Stripe] Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
```

### Step 4: Create Webhook Handler (45 min)
```typescript
// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

// Disable body parsing - we need raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    console.error('[Stripe Webhook] Missing signature');
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('[Stripe Webhook] Signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  console.log(`[Stripe Webhook] Received event: ${event.type}`);

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleSuccessfulPayment(session);
      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`[Stripe Webhook] Payment failed: ${paymentIntent.id}`);
      // Optional: Send failure email or log to HubSpot
      break;
    }
    default:
      console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  const { audit_url, full_name, company } = session.metadata!;
  const email = session.customer_email!;
  const paymentId = session.payment_intent as string;

  console.log(`[Stripe Webhook] Processing paid audit for ${email}`);
  console.log(`[Stripe Webhook] URL: ${audit_url}, Payment: ${paymentId}`);

  // Trigger LAMA audit via internal API call
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

  try {
    const response = await fetch(`${baseUrl}/api/lama/audit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: audit_url,
        email,
        fullName: full_name,
        company,
        paid: true,
        paymentId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Audit API returned ${response.status}`);
    }

    console.log(`[Stripe Webhook] Paid audit triggered successfully`);
  } catch (error) {
    console.error('[Stripe Webhook] Failed to trigger audit:', error);
    // TODO: Add retry logic or alert system
  }
}
```

### Step 5: Create Success Page (30 min)
```typescript
// app/audit-success/page.tsx
import { Suspense } from 'react';
import { Metadata } from 'next';
import SuccessContent from './SuccessContent';

export const metadata: Metadata = {
  title: 'Audit Ordered Successfully | Rafał Oleksiak Consulting',
  description: 'Your full website audit report is being generated and will be sent to your email shortly.',
};

export default function AuditSuccessPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <SuccessContent />
    </Suspense>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
      <div className="animate-pulse text-white">Loading...</div>
    </div>
  );
}
```

```typescript
// app/audit-success/SuccessContent.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <main className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#7B2CBF] to-[#9D4EDD] flex items-center justify-center">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Payment Successful!
        </h1>

        {/* Description */}
        <p className="text-gray-400 text-lg mb-8">
          Your comprehensive website audit is being generated. 
          You'll receive the full 100+ page PDF report in your inbox within <strong className="text-white">5 minutes</strong>.
        </p>

        {/* What's Next */}
        <div className="bg-[#1A1A2E] rounded-xl p-6 mb-8 text-left">
          <h2 className="text-white font-semibold mb-4">What happens next?</h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <span className="text-[#9D4EDD] mr-3">1.</span>
              Our AI is analyzing your website across 6 key categories
            </li>
            <li className="flex items-start">
              <span className="text-[#9D4EDD] mr-3">2.</span>
              A comprehensive PDF report is being generated
            </li>
            <li className="flex items-start">
              <span className="text-[#9D4EDD] mr-3">3.</span>
              Check your email (and spam folder) in 5 minutes
            </li>
            <li className="flex items-start">
              <span className="text-[#9D4EDD] mr-3">4.</span>
              Book a free strategy call to discuss findings
            </li>
          </ul>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="https://calendly.com/rafal-oleksiak/30min"
            className="px-8 py-4 bg-gradient-to-r from-[#7B2CBF] to-[#9D4EDD] text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
          >
            Book Strategy Call
          </Link>
          <Link
            href="/"
            className="px-8 py-4 border border-gray-600 text-white font-medium rounded-xl hover:bg-white/5 transition-colors"
          >
            Back to Homepage
          </Link>
        </div>

        {/* Session ID (for debugging) */}
        {sessionId && (
          <p className="mt-8 text-xs text-gray-600">
            Order ID: {sessionId.slice(0, 20)}...
          </p>
        )}
      </div>
    </main>
  );
}
```

### Step 6: Update FinalCTA Component (45 min)
Add Stripe checkout button to existing form. Keep existing functionality, add new CTA.

```typescript
// Add to FinalCTA.tsx - new function
const handlePaidAudit = async () => {
  if (!formData.url || !formData.email) {
    setError('Please fill in your email and website URL');
    return;
  }

  setIsSubmitting(true);
  setError('');

  try {
    const response = await fetch('/api/stripe/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: formData.url,
        email: formData.email,
        fullName: formData.fullName,
        company: formData.company,
      }),
    });

    const data = await response.json();

    if (data.url) {
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } else {
      throw new Error(data.error || 'Failed to create checkout session');
    }
  } catch (err) {
    console.error('Stripe checkout error:', err);
    setError('Failed to initiate payment. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};
```

### Step 7: Update lib/lama/types.ts (10 min)
```typescript
// Add to existing AuditRequest interface
export interface AuditRequest {
  url: string;
  email: string;
  fullName?: string;
  company?: string;
  // Payment data (new)
  paid?: boolean;
  paymentId?: string;
}
```

### Step 8: Update HubSpot Integration (15 min)
```typescript
// lib/lama/hubspot.ts - add new properties
properties: {
  // ... existing properties
  paid_audit: paid ? 'true' : 'false',
  stripe_payment_id: paymentId || '',
  audit_revenue: paid ? '99' : '0', // or actual price
}
```

### Step 9: Update LAMA Audit Route (15 min)
```typescript
// app/api/lama/audit/route.ts - add at the start
const { url, email, fullName, company, paid, paymentId } = body;

// Log payment info
if (paid) {
  console.log(`[LAMA] Processing PAID audit (${paymentId})`);
}

// Later, pass to HubSpot
await createOrUpdateLAMAContact({
  email,
  fullName,
  company,
  auditUrl: validUrl,
  paid,
  paymentId,
});
```

---

## ✅ Testing Checklist

### Local Development Testing
- [ ] Start dev server: `npm run dev`
- [ ] Test Stripe test mode keys work
- [ ] Create test checkout session
- [ ] Redirect to Stripe Checkout works
- [ ] Test card: `4242 4242 4242 4242`
- [ ] Success page loads after payment
- [ ] Webhook receives events (use Stripe CLI)

### Stripe CLI for Local Webhook Testing
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook

# In another terminal, trigger test events
stripe trigger checkout.session.completed
```

### Production Testing
- [ ] Deploy to Vercel
- [ ] Add production env vars
- [ ] Test with real Stripe test mode
- [ ] Verify webhook endpoint receives events
- [ ] Complete end-to-end purchase flow
- [ ] Verify email with PDF is sent
- [ ] Check HubSpot contact updated

---

## 🚀 Deployment Checklist

### Before Deployment
- [ ] All env vars set in Vercel
- [ ] Stripe webhook URL configured
- [ ] Test mode verified working
- [ ] Error handling tested
- [ ] Logging in place

### After Deployment
- [ ] Verify production webhooks work
- [ ] Monitor Stripe Dashboard for events
- [ ] Check Vercel logs for errors
- [ ] Test complete purchase flow
- [ ] Switch to live mode when ready

### Go Live Checklist
1. [ ] Change `STRIPE_SECRET_KEY` to live key
2. [ ] Change `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to live key
3. [ ] Update webhook to use live endpoint secret
4. [ ] Remove test data from HubSpot
5. [ ] Test one real transaction (refund after)
6. [ ] Announce paid audit availability

---

## 📞 Support & Troubleshooting

### Common Issues

**1. Webhook signature verification failed**
- Check `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard
- Ensure using raw request body (not parsed JSON)

**2. Checkout session not created**
- Verify `STRIPE_PRICE_ID` exists in Stripe
- Check API key has correct permissions

**3. Email not sent after payment**
- Check Vercel logs for errors
- Verify RESEND_API_KEY still valid
- Check spam folder

**4. HubSpot contact not updated**
- Verify HUBSPOT_ACCESS_TOKEN valid
- Check rate limits not exceeded

---

## 📝 Notes for Claude Code

### DO:
- ✅ Use existing project patterns (see CLAUDE.md)
- ✅ Follow TypeScript strict mode
- ✅ Add proper error handling with logging
- ✅ Test locally with Stripe CLI before deployment
- ✅ Keep existing free audit flow working

### DON'T:
- ❌ Don't expose STRIPE_SECRET_KEY to client
- ❌ Don't skip webhook signature verification
- ❌ Don't hardcode prices (use STRIPE_PRICE_ID)
- ❌ Don't break existing form functionality

---

**Document Version**: 1.0
**Created for**: Claude Code implementation
**Author**: AI Project Manager (Claude Desktop)
