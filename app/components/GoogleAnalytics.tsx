'use client'

import { GoogleAnalytics as NextGoogleAnalytics } from '@next/third-parties/google'
import { GA_MEASUREMENT_ID, isAnalyticsEnabled } from '@/app/lib/analytics'

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || ''

/**
 * Google Analytics component using @next/third-parties
 *
 * Fallback for when GTM is NOT configured.
 * When GTM is active, GA4 is loaded via GTM container instead.
 *
 * @see https://nextjs.org/docs/app/guides/third-party-libraries#google-analytics
 */
export default function GoogleAnalytics() {
  // Skip when GTM is active - GA4 is managed by GTM container
  if (GTM_ID) {
    return null
  }

  // Only render when analytics is enabled (not in development)
  if (!isAnalyticsEnabled()) {
    return null
  }

  return <NextGoogleAnalytics gaId={GA_MEASUREMENT_ID} />
}
