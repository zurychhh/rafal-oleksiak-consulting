'use client'

/* Formularz zapytania → /api/lead, wspolny dla /nawyko, /work/genactiv i /calculator.
   Osobny modul (przebieg 4 realizacji GENACTIV): trasa importujaca sam formularz nie ciagnie sceny /nawyko. */
import { useRef, useState } from 'react'
import { analytics } from '../lib/analytics'

/* ── zapytanie → istniejace /api/lead ────────────────────────────────────── */
const CONSENT_CONTACT = 'I agree to be contacted about this enquiry'
const CONSENT_MARKETING =
  'Occasional email from me — notes on reorder timing, new tools I build, and what I learn working on FMCG stores. Unsubscribe any time.'

export function Enquiry({
  form = 'nawyko',
  page = '/nawyko',
  title = 'Ask about Nawyko',
  onStore,
}: { form?: string; page?: string; title?: string; onStore?: (v: string) => void } = {}) {
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle')
  const errRef = useRef<HTMLParagraphElement>(null)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (state === 'busy') return
    const f = new FormData(e.currentTarget)
    const email = String(f.get('email') || '').trim()
    const marketing = f.get('marketing') === 'on'
    const q = new URLSearchParams(window.location.search)
    const source: Record<string, string> = { page }
    if (document.referrer) source.referrer = document.referrer.slice(0, 300)
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
      const v = q.get(k)
      if (v) source[k] = v.slice(0, 300)
    }
    setState('busy')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          storeUrl: String(f.get('store') || '').trim().slice(0, 300),
          consentContact: f.get('contact') === 'on',
          consentMarketing: marketing,
          consentText: (CONSENT_CONTACT + (marketing ? ' | ' + CONSENT_MARKETING : '')).slice(0, 400),
          form,
          source,
        }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setState('done')
      analytics.trackLeadSubmitted(form, email)
    } catch {
      setState('error')
      requestAnimationFrame(() => errRef.current?.focus())
    }
  }

  if (state === 'done') {
    return (
      <div className="nk-form nk-done" role="status">
        <h3>Enquiry received.</h3>
        <p>I reply personally.</p>
      </div>
    )
  }

  return (
    <form className="nk-form" id="nawyko-enquiry" onSubmit={submit}>
      <div className="nk-caps">{title}</div>
      <label className="nk-f" htmlFor="nk-store">
        Your store URL
      </label>
      <input id="nk-store" name="store" type="text" inputMode="url" autoComplete="url" placeholder="yourstore.com" required maxLength={300} onChange={onStore ? (e) => onStore(e.currentTarget.value) : undefined} />
      <label className="nk-f" htmlFor="nk-email">
        Your email
      </label>
      <input id="nk-email" name="email" type="email" autoComplete="email" placeholder="you@yourstore.com" required maxLength={254} />
      <label className="nk-ck">
        <input type="checkbox" name="contact" required />
        <span>
          {CONSENT_CONTACT} <em>(required)</em>
        </span>
      </label>
      <label className="nk-ck">
        <input type="checkbox" name="marketing" />
        <span>
          {CONSENT_MARKETING} <em>(optional)</em>
        </span>
      </label>
      {/* Sprawdzone w kodzie 21.11.2026: zadanie do /api/lead niesie adres sklepu, e-mail,
          obie zgody z brzmieniem, nazwe formularza, sciezke strony, referrer i parametry utm. */}
      <p className="nk-note">
        This form sends the two fields above, your consent choices, and the page and campaign link you came from.
        I reply personally by e-mail.
      </p>
      {state === 'error' ? (
        <p className="nk-err" role="alert" tabIndex={-1} ref={errRef}>
          That did not go through. Write to <a href="mailto:rafal@oleksiakconsulting.com">rafal@oleksiakconsulting.com</a> instead.
        </p>
      ) : null}
      <button className="nk-cta" type="submit" disabled={state === 'busy'}>
        {state === 'busy' ? 'Sending…' : 'Send'}
      </button>
    </form>
  )
}

/* ── R6'q14-A (Rafal 28.11.2026 10:37): trzy kroki „co dalej” + forma rozliczenia bez kwoty, przy kazdym formularzu /nawyko.
   Tylko fakty, ktore juz sa na stronie: odpowiedz w 24 h (jak na /), odpisuje Rafal osobiscie (imie + LinkedIn ze stopki),
   pierwsza rozmowa o sklepie i rytmie zakupow. Zdanie o rozliczeniu zatwierdzone przez Rafala. ── */
const LINKEDIN = 'https://www.linkedin.com/in/rafa%C5%82-oleksiak-3b322981/'
export function NextSteps({ id }: { id: string }) {
  return (
    <div className="nk-next" aria-labelledby={id}>
      <h3 className="nk-caps nk-next-h" id={id}>
        What happens next
      </h3>
      <ol className="nk-next-list">
        <li>
          <span>You send your store address.</span>
        </li>
        <li>
          <span>
            Within 24 hours,{' '}
            <a href={LINKEDIN} rel="noopener">
              Rafał Oleksiak
            </a>{' '}
            replies to you personally.
          </span>
        </li>
        <li>
          <span>First call: your store and how often your customers reorder.</span>
        </li>
      </ol>
      <p className="nk-next-fee">One setup fee plus a monthly fee. Your quote comes after the first call.</p>
    </div>
  )
}

/* Krotki formularz pod hero: ten sam ksztalt co pasek na / (adres sklepu + e-mail + zgoda kontaktowa), ta sama wysylka
   co Enquiry (/api/lead, form "nawyko", zgoda tym samym brzmieniem). Bez zgody marketingowej — formularz ma byc krotki. */
export function QuickEnquiry({ page = '/nawyko' }: { page?: string } = {}) {
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle')
  const errRef = useRef<HTMLParagraphElement>(null)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (state === 'busy') return
    const f = new FormData(e.currentTarget)
    const email = String(f.get('email') || '').trim()
    const q = new URLSearchParams(window.location.search)
    const source: Record<string, string> = { page: page + '#ask' }
    if (document.referrer) source.referrer = document.referrer.slice(0, 300)
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
      const v = q.get(k)
      if (v) source[k] = v.slice(0, 300)
    }
    setState('busy')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          storeUrl: String(f.get('store') || '').trim().slice(0, 300),
          consentContact: f.get('contact') === 'on',
          consentMarketing: false,
          consentText: CONSENT_CONTACT,
          form: 'nawyko',
          source,
        }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setState('done')
      analytics.trackLeadSubmitted('nawyko', email)
    } catch {
      setState('error')
      requestAnimationFrame(() => errRef.current?.focus())
    }
  }

  if (state === 'done') {
    return (
      <div className="nk-qf nk-done" role="status">
        <h3>Enquiry received.</h3>
        <p>Rafał replies personally within 24 hours.</p>
      </div>
    )
  }

  return (
    <form className="nk-qf" id="nawyko-quick" onSubmit={submit}>
      <div className="nk-qf-row">
        <div className="nk-qf-field">
          <label className="nk-f" htmlFor="nk-q-store">
            Your store URL <em>(required)</em>
          </label>
          <input id="nk-q-store" name="store" type="text" inputMode="url" autoComplete="url" placeholder="yourstore.com" required maxLength={300} />
        </div>
        <div className="nk-qf-field">
          <label className="nk-f" htmlFor="nk-q-email">
            Your email <em>(required)</em>
          </label>
          <input id="nk-q-email" name="email" type="email" autoComplete="email" placeholder="you@yourstore.com" required maxLength={254} />
        </div>
        <button className="nk-cta nk-qf-send" type="submit" disabled={state === 'busy'}>
          {state === 'busy' ? 'Sending…' : 'Send'}
        </button>
      </div>
      <label className="nk-ck">
        <input type="checkbox" name="contact" required />
        <span>
          {CONSENT_CONTACT} <em>(required)</em>
        </span>
      </label>
      {state === 'error' ? (
        <p className="nk-err" role="alert" tabIndex={-1} ref={errRef}>
          That did not go through. Write to <a href="mailto:rafal@oleksiakconsulting.com">rafal@oleksiakconsulting.com</a> instead.
        </p>
      ) : null}
    </form>
  )
}
