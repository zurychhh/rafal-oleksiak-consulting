'use client'

import { useState, useEffect, useRef } from 'react'
import { CONSENT_GRANTED_EVENT, discardAnalyticsBuffer } from '@/app/lib/analytics'

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
  const box = useRef<HTMLDivElement>(null)

  // Pasek stoi na `position:fixed`, więc bez rezerwacji miejsca kładzie się na
  // treści. Na krótkich viewportach przykrywał przycisk „Run the audit" —
  // złapała to bramka wizualna, bo klik nie miał jak dojść. Rezerwujemy
  // wysokość paska na <html>: strona skraca się o tyle, ile pasek zajmuje,
  // zamiast chować pod nim swój własny CTA.
  useEffect(() => {
    const el = box.current
    const root = document.documentElement
    if (hidden || !el) {
      root.style.removeProperty('--consent-h')
      root.style.removeProperty('padding-bottom')
      return
    }
    const apply = () => {
      const h = el.offsetHeight
      root.style.setProperty('--consent-h', h + 'px')
      root.style.paddingBottom = h + 'px'
    }
    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(el)
    window.addEventListener('resize', apply)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', apply)
      root.style.removeProperty('--consent-h')
      root.style.removeProperty('padding-bottom')
    }
  }, [hidden])

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
      // Musi zostać `arguments`, nie rest params: gtag rozpoznaje komendy po
      // tym, że do dataLayer trafił obiekt Arguments. Zwykła tablica zostanie
      // zignorowana i zgoda nigdy się nie zaktualizuje. Ten sam shim co
      // w ConsentMode.tsx.
      // eslint-disable-next-line prefer-rest-params
      w.gtag = function () { w.dataLayer.push(arguments) }
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

    // Bez GTM nie ma po co pchac zdarzenia wyzwalajacego tagi — zostaje
    // samo gtag('consent','update') powyzej, ktore czyta GA4 po zaladowaniu.
  }

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    updateConsentState(true)
    // Dopiero to pozwala GoogleAnalytics zaladowac gtag.js. Przed kliknieciem
    // nie poszlo ani jedno zadanie do Google.
    window.dispatchEvent(new Event(CONSENT_GRANTED_EVENT))
    setHidden(true)
  }

  const decline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    updateConsentState(false)
    // Zdarzenia zebrane przed decyzja przepadaja. gtag.js nie zaladuje sie
    // nigdy, wiec nie ma dokad ich wyslac — i o to chodzi.
    discardAnalyticsBuffer()
    setHidden(true)
  }

  /* Swiat DOSAGE: papier, atrament, kreska 1 px u gory. ZERO bursztynu — na tej
     stronie bursztyn znaczy wylacznie luke miedzy dniem z etykiety a dniem
     realnym, a pomaranczowy przycisk zgody byl ostatnim sladem starej ciemnej
     strony, ktory widzial kazdy nowy odwiedzajacy. Akceptacja = atramentowy
     prostokat jak reszta przyciskow; odmowa = zwykly link tekstowy.
     Jeden rzad tez na telefonie: kazda dodatkowa linia to wyzszy pasek, a on
     lezy na dole pierwszego ekranu, tam gdzie przycisk Send. */
  const INK = '#14161A'
  const caps = {
    fontFamily: 'inherit',
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '.08em',
    textTransform: 'uppercase' as const,
    cursor: 'pointer',
    borderRadius: 0,
  }

  return (
    <div
      ref={box}
      role="dialog"
      aria-label="Cookie consent banner"
      data-gdpr-consent="cookie-banner"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: '#F7F5F0',
        color: INK,
        borderTop: `1px solid ${INK}`,
        padding: '6px 16px',
        display: hidden ? 'none' : 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px 12px',
        fontFamily: '"Instrument Sans", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <p style={{ fontSize: '12px', lineHeight: 1.35, margin: 0, maxWidth: '60ch', flex: '0 1 auto', minWidth: 0 }}>
        Analytics cookies, so I can tell whether this page worked. Decline and nothing is set.{' '}
        <a href="/privacy" style={{ color: INK, textDecoration: 'underline', textUnderlineOffset: '3px' }}>Privacy</a>.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <button
          onClick={accept}
          style={{ ...caps, background: INK, color: '#FFFFFF', border: 0, padding: '8px 12px' }}
        >
          Accept
        </button>
        <button
          onClick={decline}
          style={{
            ...caps,
            background: 'none',
            color: INK,
            border: 0,
            padding: '9px 0',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
          }}
        >
          Decline
        </button>
      </div>
    </div>
  )
}
