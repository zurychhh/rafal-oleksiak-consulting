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
