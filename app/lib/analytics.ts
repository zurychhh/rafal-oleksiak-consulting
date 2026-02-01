/**
 * Analytics & Conversion Tracking
 *
 * Dual-mode: Works with both GTM (dataLayer) and direct gtag.
 * - If GTM is configured: events go to dataLayer → GTM routes to GA4/Google Ads
 * - If only GA4: events go via @next/third-parties sendGAEvent
 *
 * Google Ads conversion tracking:
 * - form_submission → Google Ads "Lead" conversion
 * - calendly_click → Google Ads "Schedule" conversion
 * - Enhanced conversions: hashed email sent with conversion events
 */
import { sendGAEvent } from '@next/third-parties/google'

// Environment variables
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || ''
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || ''
const GOOGLE_ADS_CONVERSION_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL || ''

/**
 * Check if analytics should be enabled
 */
export const isAnalyticsEnabled = (): boolean => {
  return (
    process.env.NODE_ENV !== 'development' &&
    (Boolean(GA_MEASUREMENT_ID) || Boolean(GTM_ID))
  )
}

/**
 * Check if GTM is configured (preferred path)
 */
const isGTMEnabled = (): boolean => {
  return Boolean(GTM_ID) && typeof window !== 'undefined'
}

// ---------------------------------------------------------------------------
// Core event dispatch
// ---------------------------------------------------------------------------

/**
 * Push event to dataLayer (for GTM) or send via sendGAEvent
 */
function pushEvent(eventName: string, params: Record<string, unknown> = {}) {
  if (!isAnalyticsEnabled()) {
    console.log('Event (dev):', eventName, params)
    return
  }

  if (isGTMEnabled()) {
    // GTM path: push to dataLayer
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any
    w.dataLayer = w.dataLayer || []
    w.dataLayer.push({
      event: eventName,
      ...params,
    })
  } else {
    // Direct GA4 path
    sendGAEvent({
      event_name: eventName,
      ...params,
    })
  }
}

/**
 * Send Google Ads conversion event
 * Works with both GTM (via dataLayer) and direct gtag
 */
function trackGoogleAdsConversion(params: {
  conversionLabel?: string;
  value?: number;
  currency?: string;
  transactionId?: string;
  enhancedConversions?: { email?: string; phone?: string };
}) {
  if (!GOOGLE_ADS_ID) return

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any
  if (typeof w.gtag !== 'function') return

  const conversionData: Record<string, unknown> = {
    send_to: `${GOOGLE_ADS_ID}/${params.conversionLabel || GOOGLE_ADS_CONVERSION_LABEL}`,
  }

  if (params.value !== undefined) {
    conversionData.value = params.value
    conversionData.currency = params.currency || 'PLN'
  }

  if (params.transactionId) {
    conversionData.transaction_id = params.transactionId
  }

  // Enhanced conversions - hashed user data for better attribution
  if (params.enhancedConversions?.email) {
    w.gtag('set', 'user_data', {
      email: params.enhancedConversions.email,
      ...(params.enhancedConversions.phone
        ? { phone_number: params.enhancedConversions.phone }
        : {}),
    })
  }

  w.gtag('event', 'conversion', conversionData)
}

// ---------------------------------------------------------------------------
// Web Vitals
// ---------------------------------------------------------------------------

export interface WebVitalsMetric {
  id: string
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
}

export function reportWebVitals(metric: WebVitalsMetric): void {
  const value = Math.round(
    metric.name === 'CLS' ? metric.value * 1000 : metric.value
  )

  pushEvent('web_vitals', {
    event_category: 'Web Vitals',
    event_label: metric.name,
    value,
    metric_id: metric.id,
    metric_rating: metric.rating,
    metric_delta: metric.delta,
  })
}

// ---------------------------------------------------------------------------
// Custom event types
// ---------------------------------------------------------------------------

export interface GAEvent {
  action: string
  category?: string
  label?: string
  value?: number
}

export function trackEvent(event: GAEvent): void {
  pushEvent(event.action, {
    event_category: event.category || 'engagement',
    event_label: event.label,
    value: event.value,
  })
}

// ---------------------------------------------------------------------------
// Pre-configured event trackers
// ---------------------------------------------------------------------------

export const analytics = {
  /** Hero CTA click */
  trackHeroCTA: () => {
    pushEvent('cta_hero_click', { event_category: 'conversion', event_label: 'hero_section' })
  },

  /** Footer CTA click */
  trackFooterCTA: () => {
    pushEvent('cta_footer_click', { event_category: 'conversion', event_label: 'footer_section' })
  },

  /**
   * Calendly click - tracked as Google Ads conversion
   */
  trackCalendlyClick: (location: string) => {
    pushEvent('calendly_click', { event_category: 'conversion', event_label: location })

    // Google Ads: schedule conversion
    trackGoogleAdsConversion({
      conversionLabel: process.env.NEXT_PUBLIC_GOOGLE_ADS_CALENDLY_LABEL,
    })
  },

  /**
   * Form submission - tracked as Google Ads lead conversion
   * Includes enhanced conversions (hashed email)
   */
  trackFormSubmission: (formName: string, success: boolean, email?: string) => {
    pushEvent('form_submission', {
      event_category: 'conversion',
      event_label: formName,
      value: success ? 1 : 0,
    })

    // GA4 recommended event for lead gen
    if (success) {
      pushEvent('generate_lead', {
        event_category: 'conversion',
        event_label: formName,
        value: 1,
        currency: 'PLN',
      })

      // Google Ads: lead conversion with enhanced conversions
      trackGoogleAdsConversion({
        value: 1,
        currency: 'PLN',
        enhancedConversions: email ? { email } : undefined,
      })
    }
  },

  /** Scroll depth milestone */
  trackScrollDepth: (percentage: number) => {
    pushEvent('scroll_milestone', {
      event_category: 'engagement',
      event_label: `${percentage}%`,
      value: percentage,
    })
  },

  /** LAMA audit started */
  trackAuditStarted: (url: string) => {
    pushEvent('audit_started', {
      event_category: 'conversion',
      event_label: url,
    })
  },

  /** LAMA audit completed */
  trackAuditCompleted: (url: string, score: number) => {
    pushEvent('audit_completed', {
      event_category: 'conversion',
      event_label: url,
      value: score,
    })
  },

  /** Paid audit checkout (archived but preserved) */
  trackPaidAuditCheckout: (url: string) => {
    pushEvent('paid_audit_checkout_started', {
      event_category: 'conversion',
      event_label: url,
    })
  },
}
