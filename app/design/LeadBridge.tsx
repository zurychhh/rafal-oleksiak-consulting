'use client'

import { useEffect } from 'react'
import { analytics } from '@/app/lib/analytics'

/**
 * Most miedzy formularzami strony z Claude Design a /api/lead.
 *
 * PISANE RECZNIE i niezalezne od wersji strony — scripts/ship-design.mjs tego
 * nie dotyka, a jedynie sprawdza, ze nowa wersja ma formularz o tym samym
 * ksztalcie: input[inputmode="url"] + input[type="email"] + checkbox zgody.
 *
 * Jak to dziala, bez ruszania logiki komponentu:
 *   1. Nasluch `submit` na document w fazie CAPTURE — odpala sie przed React 18
 *      z runtime'u Claude Design (ten slucha na #dc-root). Zatrzymujemy zdarzenie,
 *      wiec komponent jeszcze nie przechodzi w stan „wyslane".
 *   2. POST do /api/lead w ksztalcie schematu zod z app/api/lead/route.ts —
 *      z obiema zgodami (kontakt = checkbox `required`, marketing = drugi)
 *      i ich brzmieniem odczytanym z etykiet.
 *   3. Dopiero po 2xx wypuszczamy do komponentu syntetyczny `submit` na tym samym
 *      formularzu — jego wlasny handler robi to, co robil w projekcie (stan
 *      „Enquiry received", echo adresu sklepu). Wszystko inne → czytelny blad
 *      w formularzu, stan sie nie zmienia.
 *   4. Po 2xx zdarzenia konwersji (generate_lead + form_submission_lead) przez
 *      bufor zgody z app/lib/analytics.ts.
 *
 * Formularz z samym polem adresu (waski pasek na desktopie) nie ma e-maila, wiec
 * nie ma czego wyslac: przenosimy adres do najblizszego pelnego formularza,
 * przewijamy do niego i ustawiamy kursor w polu e-mail.
 *
 * Walidacja pol zostaje natywna (required na polach i na checkboxie zgody);
 * `submit` przychodzi dopiero po jej przejsciu.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const CONTACT = 'rafal@oleksiakconsulting.com'
const approved = new WeakSet<HTMLFormElement>()

function arrived(): Record<string, string> {
  const out: Record<string, string> = {}
  try {
    const q = new URLSearchParams(location.search)
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']) {
      const v = q.get(k)
      if (v) out[k] = v.slice(0, 300)
    }
  } catch { /* stary silnik bez URLSearchParams */ }
  if (document.referrer && !document.referrer.startsWith(location.origin)) {
    out.referrer = document.referrer.slice(0, 300)
  }
  return out
}

const q = <T extends Element>(root: ParentNode, sel: string) => root.querySelector<T>(sel)
const isFull = (f: HTMLFormElement) =>
  !!q(f, 'input[inputmode="url"]') && !!q(f, 'input[type="email"]') && !!q(f, 'input[type="checkbox"]')
const visible = (el: Element) => (el as HTMLElement).getClientRects().length > 0

function formKey(f: HTMLFormElement): string {
  if (f.id) return f.id
  return f.closest('[data-bar]') || f.dataset.barForm ? 'bar' : 'form'
}

function clearError(f: HTMLFormElement) {
  q(f, '[data-lead-error]')?.remove()
}

function showError(f: HTMLFormElement, text: string) {
  clearError(f)
  const p = document.createElement('p')
  p.dataset.leadError = '1'
  p.setAttribute('role', 'alert')
  p.style.cssText = 'margin:0;font-size:13px;line-height:1.45;font-weight:600;color:#9B1C1C'
  p.append(text + ' Write to ')
  const a = document.createElement('a')
  a.href = 'mailto:' + CONTACT
  a.textContent = CONTACT
  a.style.color = 'inherit'
  p.append(a, ' instead.')
  f.appendChild(p)
}

function busy(f: HTMLFormElement, on: boolean) {
  const btn = q<HTMLButtonElement>(f, 'button[type="submit"]')
  if (on) f.dataset.leadBusy = '1'
  else delete f.dataset.leadBusy
  if (!btn) return
  btn.disabled = on
  btn.style.opacity = on ? '0.6' : ''
  if (on) btn.setAttribute('aria-busy', 'true')
  else btn.removeAttribute('aria-busy')
}

/** Formularz bez e-maila → adres do najblizszego pelnego, kursor w e-mail. */
function handOver(from: HTMLFormElement, store: string) {
  const forms = [...document.querySelectorAll<HTMLFormElement>('#dc-page form')]
    .filter((f) => f !== from && isFull(f) && visible(f) && !f.closest('[data-bar]') && !f.dataset.barForm)
  if (!forms.length) return
  const mid = window.innerHeight / 2
  const dist = (f: HTMLFormElement) => {
    const r = f.getBoundingClientRect()
    return Math.abs(r.top + r.height / 2 - mid)
  }
  const target = forms.sort((a, b) => dist(a) - dist(b))[0]
  const url = q<HTMLInputElement>(target, 'input[inputmode="url"]')
  const email = q<HTMLInputElement>(target, 'input[type="email"]')
  if (url && store && !url.value) {
    url.value = store
    // echo adresu w komponencie slucha na `input`
    url.dispatchEvent(new Event('input', { bubbles: true }))
  }
  let reduce = false
  try { reduce = matchMedia('(prefers-reduced-motion: reduce)').matches } catch { /* */ }
  target.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' })
  email?.focus({ preventScroll: true })
}

/* Dwie zgody, rozpoznawane po atrybucie, nie po kolejnosci: kontakt jest
   `required`, marketing nie. Wczesniej brany byl pierwszy checkbox, wiec przy
   dwoch zgoda marketingowa nigdy nie wychodzila z przegladarki. */
function consents(f: HTMLFormElement) {
  const boxes = [...f.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')]
  const contact = boxes.find((b) => b.required) ?? boxes[0] ?? null
  const marketing = boxes.find((b) => b !== contact) ?? null
  return { contact, marketing }
}

/** Brzmienie zgody, ktore odwiedzajacy faktycznie widzial — z etykiety, nie z kodu.
    Sama flaga nie mowi, na co ktos sie zgodzil. */
function wording(box: HTMLInputElement | null, tag: string): string {
  const label = box?.closest('label') ?? (box?.id ? document.querySelector(`label[for="${box.id}"]`) : null)
  const t = (label?.textContent ?? '').replace(/\s+/g, ' ').trim()
  return t ? `${tag}: ${t}` : ''
}

/** LeadSchema przyjmuje w `form` tylko [a-z]+; id formularzy maja myslniki. */
const formSlug = (key: string) => key.toLowerCase().replace(/[^a-z]/g, '').slice(0, 40) || 'form'

async function send(f: HTMLFormElement) {
  const url = q<HTMLInputElement>(f, 'input[inputmode="url"]')!
  const emailEl = q<HTMLInputElement>(f, 'input[type="email"]')!
  const { contact: consent, marketing } = consents(f)
  const store = (url.value || '').trim().slice(0, 300)
  const email = (emailEl.value || '').trim()

  clearError(f)
  if (!EMAIL_RE.test(email)) {
    showError(f, 'That email address does not look right.')
    emailEl.focus()
    return
  }
  if (consent && !consent.checked) {
    showError(f, 'Tick the box to agree to be contacted about this enquiry.')
    consent.focus()
    return
  }

  busy(f, true)
  const key = formKey(f)
  const ctrl = typeof AbortController === 'function' ? new AbortController() : null
  const killer = setTimeout(() => ctrl?.abort(), 12000)
  try {
    const res = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: ctrl?.signal,
      // Ksztalt LeadSchema. Zgody ida wlasnymi polami — znacznik czasu i IP
      // dopisuje serwer, bo zapis, ktory ma cokolwiek dowodzic, nie moze
      // pochodzic od strony, ktorej dotyczy. `source` niesie juz tylko atrybucje.
      body: JSON.stringify({
        email,
        storeUrl: store.replace(/[\r\n]+/g, ' '),
        consentContact: !!consent?.checked,
        consentMarketing: !!marketing?.checked,
        consentText: [wording(consent, 'contact'), wording(marketing, 'marketing')]
          .filter(Boolean)
          .join(' · ')
          .slice(0, 400),
        form: formSlug(key),
        source: {
          ...arrived(),
          page: location.pathname,
        },
      }),
    })
    clearTimeout(killer)
    if (!res.ok) {
      showError(
        f,
        res.status === 429
          ? 'Too many attempts from this connection.'
          : res.status === 422
            ? 'Something in the form did not pass — check the store address and email.'
            : 'That did not go through.',
      )
      return
    }
    busy(f, false)
    // Teraz komponent moze przejsc w stan „wyslane" wlasnym handlerem.
    approved.add(f)
    f.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    analytics.trackLeadSubmitted('home-' + key, email)
  } catch {
    clearTimeout(killer)
    showError(f, 'That did not go through.')
  } finally {
    if (f.isConnected) busy(f, false)
  }
}

export default function LeadBridge() {
  useEffect(() => {
    const onSubmit = (ev: Event) => {
      const f = ev.target
      if (!(f instanceof HTMLFormElement) || !f.closest('#dc-page')) return
      // Formularz z prerenderu (sekunda przed startem runtime'u): nie wysylamy —
      // runtime zaraz go zastapi, a wpisane wartosci przeniesie DcBoot.
      if (f.closest('.dc-pre')) { ev.preventDefault(); ev.stopPropagation(); return }
      if (approved.has(f)) { approved.delete(f); return } // przepuszczony po 2xx
      const url = q<HTMLInputElement>(f, 'input[inputmode="url"]')
      if (!url) return // nie ten ksztalt — nie nasz formularz
      ev.preventDefault()
      ev.stopPropagation()
      if (f.dataset.leadBusy) return
      if (!q(f, 'input[type="email"]')) { handOver(f, url.value.trim()); return }
      void send(f)
    }
    document.addEventListener('submit', onSubmit, true)
    return () => document.removeEventListener('submit', onSubmit, true)
  }, [])

  return null
}
