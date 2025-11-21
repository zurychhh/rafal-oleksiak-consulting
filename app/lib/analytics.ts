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
