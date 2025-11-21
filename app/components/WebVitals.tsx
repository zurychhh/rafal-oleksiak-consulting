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
