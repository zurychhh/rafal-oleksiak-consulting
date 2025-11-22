# GA4 Implementation Brief - Rafał Oleksiak Consulting

**Project**: Google Analytics 4 Integration  
**Scope**: Basic GA4 Setup (Phase 1)  
**Timeline**: 2-3 hours  
**Priority**: HIGH  
**Status**: READY TO START

---

## 🎯 OBJECTIVE

Implement Google Analytics 4 (GA4) tracking for oleksiakconsulting.com using Next.js 16's official `@next/third-parties` package.

**Success Criteria:**
- ✅ GA4 tracks page views automatically
- ✅ Web Vitals (LCP, CLS, FID) are reported to GA4
- ✅ 5 custom events fire correctly (CTAs, form, scroll)
- ✅ Analytics ONLY load in production (not development)
- ✅ All events visible in GA4 DebugView
- ✅ No console errors or warnings

---

## 📋 SCOPE

### ✅ IN SCOPE (Do This)
1. Install `@next/third-parties@latest`
2. Create analytics utility library (`app/lib/analytics.ts`)
3. Create GoogleAnalytics component (`app/components/GoogleAnalytics.tsx`)
4. Create WebVitals component (`app/components/WebVitals.tsx`)
5. Update root layout (`app/layout.tsx`)
6. Add event tracking to 5 locations:
   - Hero CTA button
   - Footer CTA button
   - Calendly links (2 locations)
   - Contact form submission
7. Create `.env.example` file
8. Update `.gitignore` if needed
9. Test in development (should NOT fire events)
10. Document setup in comments

### ❌ OUT OF SCOPE (Don't Do This)
- Cookie consent / GDPR compliance (Phase 2)
- Google Tag Manager setup
- Custom GA4 dashboards
- A/B testing framework
- Hotjar integration
- Advanced conversion funnels
- E-commerce tracking
- Server-side tracking

---

## 📁 PROJECT STRUCTURE

```
rafal-oleksiak-consulting/
├── app/
│   ├── components/
│   │   ├── GoogleAnalytics.tsx    ← CREATE NEW
│   │   └── WebVitals.tsx          ← CREATE NEW
│   ├── lib/
│   │   └── analytics.ts           ← CREATE NEW
│   └── layout.tsx                 ← MODIFY
├── .env.local                     ← MODIFY (add GA ID)
├── .env.example                   ← CREATE NEW
└── package.json                   ← MODIFY (add dependency)
```

---

## 🔧 STEP-BY-STEP IMPLEMENTATION

### STEP 1: Install Dependencies

```bash
npm install @next/third-parties@latest
```

**Verify installation:**
```bash
npm list @next/third-parties
# Should show: @next/third-parties@16.x.x or later
```

---

### STEP 2: Create Analytics Utility Library

**File:** `app/lib/analytics.ts`

```typescript
/**
 * Google Analytics 4 utilities for Next.js 16
 * Standardized implementation using @next/third-parties
 * 
 * @see https://nextjs.org/docs/app/guides/third-party-libraries#google-analytics
 */
import { sendGAEvent } from '@next/third-parties/google'

// Environment variables
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''

/**
 * Check if GA should be enabled (not in development)
 * @returns boolean - true if GA should load
 */
export const isAnalyticsEnabled = (): boolean => {
  return (
    process.env.NODE_ENV !== 'development' &&
    Boolean(GA_MEASUREMENT_ID) &&
    GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX'
  )
}

/**
 * Web Vitals metric interface
 * Core Web Vitals: LCP, FID, CLS
 * Other metrics: FCP, TTFB, INP
 */
export interface WebVitalsMetric {
  id: string
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
}

/**
 * Custom Google Analytics event interface
 */
export interface GAEvent {
  action: string          // Event name (snake_case)
  category?: string       // Event category (e.g., 'conversion', 'engagement')
  label?: string          // Event label (additional context)
  value?: number          // Numeric value (optional)
}

/**
 * Reports Web Vitals metrics to Google Analytics
 * Automatically converts CLS to milliseconds for consistency
 * 
 * @param metric - Web Vitals metric object
 */
export function reportWebVitals(metric: WebVitalsMetric): void {
  if (!isAnalyticsEnabled()) {
    // Log to console in development
    console.log('Web Vitals (dev):', {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
    })
    return
  }

  // Convert metric values to proper format
  // CLS is multiplied by 1000 for better readability in GA4
  const value = Math.round(
    metric.name === 'CLS' ? metric.value * 1000 : metric.value
  )

  // Send to GA4 using @next/third-parties
  sendGAEvent({
    event_name: 'web_vitals',
    event_category: 'Web Vitals',
    event_label: metric.name,
    value: value,
    metric_id: metric.id,
    metric_rating: metric.rating,
    metric_delta: metric.delta,
  })
}

/**
 * Sends custom events to Google Analytics
 * Use this for tracking user interactions
 * 
 * @param event - Custom event object
 */
export function trackEvent(event: GAEvent): void {
  if (!isAnalyticsEnabled()) {
    // Log to console in development
    console.log('Event (dev):', event)
    return
  }

  sendGAEvent({
    event_name: event.action,
    event_category: event.category || 'engagement',
    event_label: event.label,
    value: event.value,
  })
}

/**
 * Common event trackers for Rafał Oleksiak Consulting website
 * Pre-configured events for easy implementation
 */
export const analytics = {
  /**
   * Track hero section CTA click
   * Event: cta_hero_click
   */
  trackHeroCTA: () => {
    trackEvent({
      action: 'cta_hero_click',
      category: 'conversion',
      label: 'hero_section',
    })
  },

  /**
   * Track footer CTA click
   * Event: cta_footer_click
   */
  trackFooterCTA: () => {
    trackEvent({
      action: 'cta_footer_click',
      category: 'conversion',
      label: 'footer_section',
    })
  },

  /**
   * Track Calendly link click
   * Event: calendly_click
   * @param location - Where the Calendly link was clicked (e.g., 'footer', 'hero')
   */
  trackCalendlyClick: (location: string) => {
    trackEvent({
      action: 'calendly_click',
      category: 'conversion',
      label: location,
    })
  },

  /**
   * Track contact form submission
   * Event: form_submission
   * @param formName - Name of the form (e.g., 'contact_form')
   * @param success - Whether submission was successful
   */
  trackFormSubmission: (formName: string, success: boolean) => {
    trackEvent({
      action: 'form_submission',
      category: 'conversion',
      label: formName,
      value: success ? 1 : 0,
    })
  },

  /**
   * Track scroll depth milestones
   * Event: scroll_milestone
   * @param percentage - Scroll depth percentage (25, 50, 75, 100)
   */
  trackScrollDepth: (percentage: number) => {
    trackEvent({
      action: 'scroll_milestone',
      category: 'engagement',
      label: `${percentage}%`,
      value: percentage,
    })
  },
}
```

---

### STEP 3: Create GoogleAnalytics Component

**File:** `app/components/GoogleAnalytics.tsx`

```typescript
'use client'

import { GoogleAnalytics as NextGoogleAnalytics } from '@next/third-parties/google'
import { GA_MEASUREMENT_ID, isAnalyticsEnabled } from '@/app/lib/analytics'

/**
 * Google Analytics component using @next/third-parties
 * 
 * Features:
 * - Automatically tracks page views on route changes
 * - Loads asynchronously after hydration
 * - Only loads in production (not development)
 * 
 * @see https://nextjs.org/docs/app/guides/third-party-libraries#google-analytics
 */
export default function GoogleAnalytics() {
  // Only render when analytics is enabled (not in development)
  if (!isAnalyticsEnabled()) {
    return null
  }

  return <NextGoogleAnalytics gaId={GA_MEASUREMENT_ID} />
}
```

---

### STEP 4: Create WebVitals Component

**File:** `app/components/WebVitals.tsx`

```typescript
'use client'

import { useReportWebVitals } from 'next/web-vitals'
import { reportWebVitals } from '@/app/lib/analytics'

/**
 * Web Vitals tracking component
 * 
 * Automatically reports Core Web Vitals to Google Analytics:
 * - LCP (Largest Contentful Paint): < 2.5s
 * - FID (First Input Delay): < 100ms
 * - CLS (Cumulative Layout Shift): < 0.1
 * 
 * Also reports:
 * - FCP (First Contentful Paint)
 * - TTFB (Time to First Byte)
 * - INP (Interaction to Next Paint)
 * 
 * @see https://nextjs.org/docs/app/api-reference/functions/use-report-web-vitals
 */
export function WebVitals() {
  useReportWebVitals((metric) => {
    reportWebVitals(metric)
  })

  return null
}
```

---

### STEP 5: Update Root Layout

**File:** `app/layout.tsx`

**IMPORTANT:** Add components AFTER `{children}` for optimal performance.

Add these imports at the top:
```typescript
import GoogleAnalytics from "./components/GoogleAnalytics";
import { WebVitals } from "./components/WebVitals";
```

Add components AFTER {children} in return statement:
```typescript
<body className="antialiased">
  {children}
  
  {/* Google Analytics - loaded AFTER children for optimal performance */}
  <GoogleAnalytics />
  <WebVitals />
</body>
```

---

### STEP 6: Add Event Tracking

#### 6.1 Hero CTA
**File:** `app/components/sections/Hero.tsx`

Add imports:
```typescript
'use client'
import { analytics } from '@/app/lib/analytics'
```

Add to button:
```typescript
onClick={() => analytics.trackHeroCTA()}
```

#### 6.2 Footer Calendly Links
**File:** `app/components/sections/Footer.tsx`

Add imports:
```typescript
'use client'
import { analytics } from '@/app/lib/analytics'
```

Add to Calendly links:
```typescript
onClick={() => analytics.trackCalendlyClick('footer')}
```

#### 6.3 Form Submission
**File:** `app/components/sections/FinalCTA.tsx`

Add import:
```typescript
import { analytics } from '@/app/lib/analytics'
```

Add to handleSubmit:
```typescript
if (response.ok) {
  analytics.trackFormSubmission('contact_form', true)
  // ... rest
} else {
  analytics.trackFormSubmission('contact_form', false)
  // ... rest
}
```

#### 6.4 Scroll Tracker (Optional)
**File:** `app/components/ScrollTracker.tsx`

```typescript
'use client'

import { useEffect, useRef } from 'react'
import { analytics } from '@/app/lib/analytics'

export function ScrollTracker() {
  const milestones = useRef(new Set<number>())

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const clientHeight = window.innerHeight
      const scrollPercentage = Math.round(
        (scrollTop / (scrollHeight - clientHeight)) * 100
      )

      const checkpoints = [25, 50, 75, 100]
      checkpoints.forEach((checkpoint) => {
        if (
          scrollPercentage >= checkpoint &&
          !milestones.current.has(checkpoint)
        ) {
          milestones.current.add(checkpoint)
          analytics.trackScrollDepth(checkpoint)
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return null
}
```

Add to layout.tsx:
```typescript
import { ScrollTracker } from './components/ScrollTracker'

// Inside body:
<GoogleAnalytics />
<WebVitals />
<ScrollTracker />
```

---

### STEP 7: Create .env.example

**File:** `.env.example`

```bash
# Google Analytics 4 Measurement ID
# Get from: https://analytics.google.com/analytics/web/
# Admin → Data Streams → Select your stream → Measurement ID
# Format: G-XXXXXXXXXX
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Email Service (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

---

### STEP 8: Update .env.local

Add placeholder (user will provide real ID later):

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-PLACEHOLDER
```

---

## 🧪 TESTING

### Development:
```bash
npm run dev
# Should see console logs, NO network requests
```

### Production Build:
```bash
npm run build
npm start
# Should see network requests (if real GA ID provided)
```

---

## ✅ ACCEPTANCE CRITERIA

- [ ] All files created/modified
- [ ] Code compiles without errors
- [ ] TypeScript types are correct
- [ ] Console logs work in dev mode
- [ ] No errors or warnings
- [ ] Follows existing code style
- [ ] Comments added where needed
- [ ] `.env.local` NOT committed

---

## 🚀 NEXT STEPS

After implementation:
1. Test in dev mode
2. Test production build
3. User will provide real GA4 Measurement ID
4. User will test with GA4 DebugView

---

**Last Updated:** 2025-11-21  
**Version:** 1.0  
**Status:** READY TO IMPLEMENT
