'use client'

import { useState, useEffect } from 'react'

/**
 * GDPR Cookie Consent Banner - Integrated with Google Consent Mode v2
 *
 * Flow:
 * 1. ConsentMode.tsx sets defaults to 'denied' (loads before this)
 * 2. This banner appears after 1.5s if no prior consent
 * 3. On Accept: gtag('consent', 'update') → granted → tags fire
 * 4. On Decline: gtag('consent', 'update') → stays denied → no cookies
 *
 * Consent is persisted in localStorage and restored on return visits.
 */
export default function CookieConsent() {
  const [hidden, setHidden] = useState(true)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')

    if (consent === 'accepted') {
      // Returning visitor who accepted - restore consent
      updateConsentState(true)
      return
    }

    if (consent === 'declined') {
      // Returning visitor who declined - keep denied
      updateConsentState(false)
      return
    }

    // New visitor - show banner after delay
    const timer = setTimeout(() => setHidden(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  function updateConsentState(granted: boolean) {
    if (typeof window === 'undefined') return

    // Ensure dataLayer and gtag exist
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any
    w.dataLayer = w.dataLayer || []
    if (typeof w.gtag !== 'function') {
      w.gtag = function () {
        w.dataLayer.push(arguments)
      }
    }

    const state = granted ? 'granted' : 'denied'

    w.gtag('consent', 'update', {
      'ad_storage': state,
      'ad_user_data': state,
      'ad_personalization': state,
      'analytics_storage': state,
      'functionality_storage': state,
      'personalization_storage': state,
    })

    // Push consent event to dataLayer for GTM triggers
    w.dataLayer.push({
      event: 'consent_update',
      consent_granted: granted,
    })
  }

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    updateConsentState(true)
    setHidden(true)
  }

  const decline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    updateConsentState(false)
    setHidden(true)
  }

  return (
    <div
      role="dialog"
      aria-label="Cookie consent banner"
      data-gdpr-consent="cookie-banner"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: 'rgba(20, 20, 30, 0.97)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(123, 44, 191, 0.3)',
        padding: '16px 24px',
        display: hidden ? 'none' : 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        flexWrap: 'wrap' as const,
      }}
    >
      <p style={{ color: '#ccc', fontSize: '14px', margin: 0, maxWidth: '600px' }}>
        This site uses cookies for analytics and advertising. By accepting, you consent
        to Google Analytics, Google Ads tracking, and remarketing cookies.
        See our <a href="/privacy" style={{ color: '#9D4EDD', textDecoration: 'underline' }}>Privacy Policy</a>.
      </p>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={accept}
          style={{
            background: 'linear-gradient(135deg, #7B2CBF, #0066FF)',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 20px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Accept
        </button>
        <button
          onClick={decline}
          style={{
            background: 'transparent',
            color: '#999',
            border: '1px solid #444',
            borderRadius: '6px',
            padding: '8px 20px',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          Decline
        </button>
      </div>
    </div>
  )
}
