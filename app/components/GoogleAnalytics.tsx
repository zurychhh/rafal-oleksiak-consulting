'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import {
  GA_MEASUREMENT_ID,
  isAnalyticsEnabled,
  flushAnalyticsBuffer,
  CONSENT_GRANTED_EVENT,
} from '@/app/lib/analytics'

/**
 * GA4 ladowany WYLACZNIE po zgodzie.
 *
 * Dopoki odwiedzajacy nie kliknie „Accept", ten komponent nie renderuje
 * niczego — a wiec nie powstaje ani jedno zadanie do googletagmanager.com.
 * Odmowa oznacza, ze skrypt nie zaladuje sie nigdy, takze przy powrocie.
 *
 * Zgoda z poprzedniej wizyty jest odczytywana z localStorage przy montowaniu,
 * zeby powracajacy nie musial klikac drugi raz.
 */
export default function GoogleAnalytics() {
  const [granted, setGranted] = useState(false)

  useEffect(() => {
    if (!isAnalyticsEnabled()) return
    try {
      if (localStorage.getItem('cookie-consent') === 'accepted') setGranted(true)
    } catch { /* tryb prywatny — traktujemy jak brak zgody */ }

    const onGrant = () => setGranted(true)
    window.addEventListener(CONSENT_GRANTED_EVENT, onGrant)
    return () => window.removeEventListener(CONSENT_GRANTED_EVENT, onGrant)
  }, [])

  if (!granted || !isAnalyticsEnabled()) return null

  return (
    <>
      <Script
        id="ga4-lib"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        onLoad={() => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const w = window as any
          w.__rocGtagLoaded = true
          flushAnalyticsBuffer()
        }}
      />
      <Script id="ga4-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: true });
        `}
      </Script>
    </>
  )
}
