/**
 * GA4 — bezposrednio, bez GTM, wylacznie po zgodzie.
 *
 * Dlaczego bez GTM: kontener gtm.js wazyl 427 KB i pobieral sie
 * z googletagmanager.com przy kazdym wejsciu, PRZED jakakolwiek zgoda.
 * Wozil trzy tagi, z czego dwa (remarketing Google Ads, Conversion Linker)
 * obslugiwaly ruch platny, ktorego nie prowadzimy.
 *
 * Kolejnosc teraz:
 *   1. ConsentMode ustawia domyslne 'denied' (inline, zero zadan sieciowych)
 *   2. Zdarzenia sprzed decyzji ladują w BUFORZE w pamieci — nic nie wychodzi
 *   3. Odmowa  → bufor kasowany, gtag.js NIGDY sie nie laduje
 *   4. Zgoda   → laduje sie gtag.js, bufor jest oprozniany
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''

/** Nazwa zdarzenia rozglaszanego po udzieleniu zgody. */
export const CONSENT_GRANTED_EVENT = 'roc:consent-granted'

export const isAnalyticsEnabled = (): boolean => {
  return (
    process.env.NODE_ENV === 'production' &&
    Boolean(GA_MEASUREMENT_ID) &&
    typeof window !== 'undefined'
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const win = (): any => window as any

/**
 * Bufor zdarzen sprzed decyzji o zgodzie.
 *
 * scroll_milestone i web_vitals potrafia paść w pierwszych sekundach, czyli
 * zanim odwiedzajacy kliknie cokolwiek w bannerze. Trzymamy je w pamieci:
 * po zgodzie wysylamy, po odmowie kasujemy. Nic nie opuszcza przegladarki
 * przed decyzja. Limit chroni przed rozrostem, gdy nikt nie klika.
 */
const BUFFER: Array<{ name: string; params: Record<string, unknown> }> = []
const BUFFER_LIMIT = 50

function gtagReady(): boolean {
  return typeof window !== 'undefined' && typeof win().gtag === 'function' && win().__rocGtagLoaded === true
}

function pushEvent(eventName: string, params: Record<string, unknown> = {}) {
  if (!isAnalyticsEnabled()) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[analytics:dev]', eventName, params)
    }
    return
  }
  if (gtagReady()) {
    win().gtag('event', eventName, params)
    return
  }
  if (BUFFER.length < BUFFER_LIMIT) BUFFER.push({ name: eventName, params })
}

/** Wywolywane po zaladowaniu gtag.js — wysyla to, co czekalo. */
export function flushAnalyticsBuffer(): void {
  if (!gtagReady()) return
  while (BUFFER.length) {
    const e = BUFFER.shift()!
    win().gtag('event', e.name, e.params)
  }
}

/** Wywolywane przy odmowie — bufor przepada, nic nie wychodzi. */
export function discardAnalyticsBuffer(): void {
  BUFFER.length = 0
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
// Zdarzenia
// ---------------------------------------------------------------------------

export const analytics = {
  /** Kamienie milowe przewijania: 25 / 50 / 75 / 100%. */
  trackScrollDepth: (percentage: number) => {
    pushEvent('scroll_milestone', {
      event_category: 'engagement',
      event_label: `${percentage}%`,
      value: percentage,
    })
  },

  /**
   * Zgloszenie formularza leadowego — wolane przez app/design/LeadBridge.tsx
   * dopiero po odpowiedzi 2xx z /api/lead, nigdy na samo klikniecie.
   *
   * Dwa zdarzenia: `generate_lead` (rekomendowane GA4) i `form_submission_lead`
   * (nazwa, pod ktora konwersja byla importowana do Google Ads). Oba ida przez
   * bufor zgody: przed decyzja czekaja w pamieci, po odmowie przepadaja.
   *
   * Enhanced conversions: adres idzie do `user_data` WYLACZNIE, gdy gtag.js jest
   * juz zaladowany, a laduje sie on tylko po zgodzie. Przed zgoda e-mail nie
   * trafia nigdzie — takze nie do bufora.
   */
  trackLeadSubmitted: (intent: string, email?: string) => {
    if (email && isAnalyticsEnabled() && gtagReady()) {
      win().gtag('set', 'user_data', { email: email.trim().toLowerCase() })
    }
    pushEvent('generate_lead', {
      event_category: 'conversion',
      event_label: intent,
    })
    pushEvent('form_submission_lead', {
      event_category: 'conversion',
      event_label: intent,
    })
  },
}
