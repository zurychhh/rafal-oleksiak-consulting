'use client'

import { useEffect } from 'react'
import { analytics } from '@/app/lib/analytics'
import { EMAIL_RE, arrived, busy, clearError, showError, wording } from '@/app/design/LeadBridge'

/**
 * Most miedzy formularzem w /tool a /api/lead. PISANE RECZNIE — ship-tool.mjs
 * tego nie dotyka; zalezy tylko od kontraktu znacznikow z tool-index.html (v12):
 *
 *   form#tool-enquiry
 *     data-interval, data-label-day, data-sample-n, data-window-days, data-bimodal
 *     (opcjonalnie data-interval-low, data-interval-high — bez nich mail przy
 *      malej probie nie ma czego podac zamiast mediany)
 *     — puste stringi, dopoki wyniku nie ma
 *   input#url-tool, input#email-tool
 *   input#consent-contact-tool, input#consent-marketing-tool — OBIE opcjonalne:
 *     wyslanie analizy na podany adres to wykonanie prosby, nie kontakt handlowy,
 *     wiec nie uzalezniamy go od zgody (to bylby ten sam blad co bramkowanie wyniku).
 *
 * Jak w LeadBridge strony glownej: nasluch `submit` w fazie capture, wlasny POST,
 * a dopiero po 2xx syntetyczny `submit` do skryptu narzedzia (jesli ma wlasny stan
 * „wyslane") plus zdarzenie `lead:sent` na formularzu. Blad → komunikat w formularzu.
 */

const approved = new WeakSet<HTMLFormElement>()

/** "" albo brak → undefined; cokolwiek, co nie jest liczba calkowita → undefined.
    Zod i tak odrzuci zle wartosci, ale wtedy przepadloby cale zgloszenie —
    lepiej wyslac lead bez wyniku niz zadnego. */
function int(v: string | undefined): number | undefined {
  if (v == null || v.trim() === '') return undefined
  const n = Number(v)
  return Number.isInteger(n) ? n : undefined
}
function bool(v: string | undefined): boolean | undefined {
  if (v === 'true') return true
  if (v === 'false') return false
  return undefined
}

/** Wynik z data-* formularza. Zakres tylko, gdy jest spojny — inaczej bez niego. */
export function resultOf(f: HTMLFormElement) {
  const d = f.dataset
  const r: Record<string, number | boolean> = {}
  const put = (k: string, v: number | boolean | undefined) => { if (v !== undefined) r[k] = v }
  put('interval', int(d.interval))
  put('labelDay', int(d.labelDay))
  put('sampleN', int(d.sampleN))
  put('windowDays', int(d.windowDays))
  put('bimodal', bool(d.bimodal))
  const lo = int(d.intervalLow), hi = int(d.intervalHigh), med = r.interval as number | undefined
  if (lo !== undefined && hi !== undefined && lo <= hi && (med === undefined || (lo <= med && med <= hi))) {
    r.intervalLow = lo
    r.intervalHigh = hi
  }
  return r
}

async function send(f: HTMLFormElement) {
  const url = f.querySelector<HTMLInputElement>('#url-tool')
  const emailEl = f.querySelector<HTMLInputElement>('#email-tool')
  const contact = f.querySelector<HTMLInputElement>('#consent-contact-tool')
  const marketing = f.querySelector<HTMLInputElement>('#consent-marketing-tool')
  if (!emailEl) return
  const email = (emailEl.value || '').trim()
  const store = (url?.value || '').trim().slice(0, 300).replace(/[\r\n]+/g, ' ')

  clearError(f)
  if (!EMAIL_RE.test(email)) {
    showError(f, 'That email address does not look right.')
    emailEl.focus()
    return
  }

  busy(f, true)
  const ctrl = typeof AbortController === 'function' ? new AbortController() : null
  const killer = setTimeout(() => ctrl?.abort(), 12000)
  try {
    const res = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: ctrl?.signal,
      body: JSON.stringify({
        email,
        ...(store ? { storeUrl: store } : {}),
        consentContact: !!contact?.checked,
        consentMarketing: !!marketing?.checked,
        consentText: [wording(contact, 'contact'), wording(marketing, 'marketing')]
          .filter(Boolean)
          .join(' · ')
          .slice(0, 400),
        form: 'tool',
        ...resultOf(f),
        source: { ...arrived(), page: location.pathname },
      }),
    })
    clearTimeout(killer)
    if (!res.ok) {
      showError(
        f,
        res.status === 429
          ? 'Too many attempts from this connection.'
          : res.status === 422
            ? 'Something in the form did not pass — check the email address.'
            : 'That did not go through.',
      )
      return
    }
    busy(f, false)
    f.dataset.leadSent = '1'
    f.dispatchEvent(new CustomEvent('lead:sent', { bubbles: true }))
    approved.add(f)
    f.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    analytics.trackLeadSubmitted('tool', email)
  } catch {
    clearTimeout(killer)
    showError(f, 'That did not go through.')
  } finally {
    if (f.isConnected) busy(f, false)
  }
}

export default function ToolLeadBridge() {
  useEffect(() => {
    const onSubmit = (ev: Event) => {
      const f = ev.target
      if (!(f instanceof HTMLFormElement) || f.id !== 'tool-enquiry') return
      if (approved.has(f)) { approved.delete(f); return } // przepuszczony po 2xx
      ev.preventDefault()
      ev.stopImmediatePropagation()
      if (f.dataset.leadBusy) return
      void send(f)
    }
    document.addEventListener('submit', onSubmit, true)
    return () => document.removeEventListener('submit', onSubmit, true)
  }, [])

  return null
}
