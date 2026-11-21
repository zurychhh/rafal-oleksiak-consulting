'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { analytics } from '../lib/analytics'

/* Pokaz Nawyko na ZMYSLONEJ marce. Nazwa sprawdzona w sieci 21.11.2026
   (agencja/research/marka-pokazowa.md) — to nie jest klient ani realna firma. */
export const DEMO_BRAND = 'Tovemi'

const STEPS = [
  {
    t: 'Confirm the pack',
    d: 'The customer scans the barcode on the box or the receipt. The app now knows a pack has been opened and when.',
  },
  {
    t: 'Scratch one card a day',
    d: 'After the daily dose there is one card to scratch. It takes a second, and the streak grows by a day — try it on the phone.',
  },
  {
    t: 'Build the streak',
    d: 'Every scratched card is a day in the grid. The customer sees how far the pack has gone and how close the next reward is.',
  },
  {
    t: 'Unlock a reward they saw coming',
    d: 'Twenty-four days out of thirty earns the stamp and a code for the next pack. The list of rewards was on screen from day one.',
  },
] as const

const START_DAY = 9
const GOAL_DAY = 24
const PACK_DAYS = 30

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const ease = (t: number) => 1 - Math.pow(1 - t, 3)

type Theme = 'paper' | 'plain' | 'night' | 'clay'

/* ── zdrapka ─────────────────────────────────────────────────────────────── */
function Scratch({ gone, onDone }: { gone: boolean; onDone: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const last = useRef<{ x: number; y: number } | null>(null)
  const moves = useRef(0)

  const paint = useCallback(() => {
    const c = ref.current
    if (!c) return
    const r = c.getBoundingClientRect()
    if (!r.width || !r.height) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    c.width = Math.round(r.width * dpr)
    c.height = Math.round(r.height * dpr)
    const g = c.getContext('2d')
    if (!g) return
    g.fillStyle = '#C9C7C0'
    g.fillRect(0, 0, c.width, c.height)
    g.strokeStyle = '#B4B2AB'
    g.lineWidth = dpr
    for (let x = -c.height; x < c.width; x += 7 * dpr) {
      g.beginPath()
      g.moveTo(x, 0)
      g.lineTo(x + c.height, c.height)
      g.stroke()
    }
    g.fillStyle = '#14161A'
    g.font = `600 ${Math.round(11 * dpr)}px "Instrument Sans", system-ui, sans-serif`
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    const label = 'S C R A T C H   H E R E'
    g.fillText(label, c.width / 2, c.height / 2)
  }, [])

  useEffect(() => {
    paint()
    const c = ref.current
    if (!c || typeof ResizeObserver === 'undefined') return
    let w = c.getBoundingClientRect().width
    const ro = new ResizeObserver(() => {
      const nw = c.getBoundingClientRect().width
      if (Math.abs(nw - w) > 1) {
        w = nw
        paint()
      }
    })
    ro.observe(c)
    return () => ro.disconnect()
  }, [paint])

  const cleared = () => {
    const c = ref.current
    const g = c?.getContext('2d')
    if (!c || !g) return 0
    const step = 8
    const d = g.getImageData(0, 0, c.width, c.height).data
    let n = 0
    let z = 0
    for (let y = 0; y < c.height; y += step)
      for (let x = 0; x < c.width; x += step) {
        n++
        if (d[(y * c.width + x) * 4 + 3] === 0) z++
      }
    return n ? z / n : 0
  }

  const at = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = e.currentTarget
    const r = c.getBoundingClientRect()
    return { x: ((e.clientX - r.left) / r.width) * c.width, y: ((e.clientY - r.top) / r.height) * c.height }
  }
  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = e.currentTarget
    const g = c.getContext('2d')
    if (!g) return
    const p = at(e)
    const from = last.current ?? p
    g.globalCompositeOperation = 'destination-out'
    g.lineCap = 'round'
    g.lineJoin = 'round'
    g.lineWidth = c.width * 0.16
    g.beginPath()
    g.moveTo(from.x, from.y)
    g.lineTo(p.x + 0.01, p.y + 0.01)
    g.stroke()
    g.globalCompositeOperation = 'source-over'
    last.current = p
    if (++moves.current % 10 === 0 && cleared() > 0.42) onDone()
  }

  return (
    <canvas
      ref={ref}
      className={'nk-canvas' + (gone ? ' is-gone' : '')}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        last.current = null
        draw(e)
      }}
      onPointerMove={(e) => {
        if (last.current) draw(e)
      }}
      onPointerUp={() => {
        last.current = null
        if (cleared() > 0.42) onDone()
      }}
      onPointerCancel={() => {
        last.current = null
      }}
    />
  )
}

/* ── telefon ─────────────────────────────────────────────────────────────── */
function Phone({
  step,
  t,
  theme,
  scratched,
  onScratched,
  interactive,
  fixedDays,
}: {
  step: number
  t: number
  theme: Theme
  scratched: boolean
  onScratched?: () => void
  interactive?: boolean
  fixedDays?: number
}) {
  const confirmed = step > 0 || t > 0.55
  const scan = step > 0 ? 1 : clamp(t / 0.5)
  const revealed = scratched || step > 1 || (step === 1 && t > 0.8)
  const days =
    fixedDays ?? (step < 2 ? START_DAY : step === 2 ? Math.round(START_DAY + (GOAL_DAY - START_DAY) * ease(clamp(t / 0.8))) : GOAL_DAY)
  const on = (i: number) => 'nk-view' + (step === i ? ' is-on' : '')

  return (
    <div className="nk-phone" data-theme={theme} aria-hidden="true">
      <div className="nk-screen">
        <div className="nk-pbar">
          <span>{DEMO_BRAND}</span>
          <span>Demo</span>
        </div>

        <div className={on(0)}>
          <div className="nk-pk">New pack</div>
          <div className="nk-pt">Scan the box to start.</div>
          <div className="nk-code">
            <div className="nk-scan" style={{ ['--scan' as string]: scan }} />
          </div>
          <div className={'nk-ok' + (confirmed ? ' is-on' : '')}>
            <div className="nk-okrow">
              <span className="nk-tick">✓</span>
              <span>Magnesium · {PACK_DAYS} capsules</span>
            </div>
            <div className="nk-ps">Pack confirmed. Day 1 starts today.</div>
          </div>
        </div>

        <div className={on(1)}>
          <div className="nk-pk">Today</div>
          <div className="nk-pt">Taken it? Scratch the card.</div>
          <div className="nk-card">
            <div>
              <b>Day {START_DAY}</b>
              <small>Done</small>
            </div>
            {interactive ? <Scratch gone={revealed} onDone={onScratched ?? (() => {})} /> : null}
          </div>
          <div className="nk-hint">{revealed ? 'Ticked. See you tomorrow.' : 'One card a day. Drag across it.'}</div>
          <div className={'nk-mini' + (revealed ? ' is-up' : '')}>
            <span>Streak</span>
            <span>
              <b>{revealed ? START_DAY : START_DAY - 1}</b> days
            </span>
          </div>
        </div>

        <div className={on(2)}>
          <div className="nk-pk">Your streak</div>
          <div className="nk-big">
            <b>{days}</b>
            <span>days</span>
            <em>of {PACK_DAYS}</em>
          </div>
          <div className="nk-grid">
            {Array.from({ length: PACK_DAYS }, (_, i) => (
              <i key={i} className={(i < days ? 'is-in' : '') + (i === GOAL_DAY - 1 ? ' is-goal' : '')} />
            ))}
          </div>
          <div className="nk-goal">
            <span>Stamp at day {GOAL_DAY}</span>
            <span>{Math.max(0, GOAL_DAY - days)} to go</span>
          </div>
        </div>

        <div className={on(3)}>
          <div className="nk-pk">Reward unlocked</div>
          <div className="nk-stampwrap">
            <div className="nk-stamp">
              <span>
                {GOAL_DAY}/{PACK_DAYS}
              </span>
            </div>
            <div className="nk-pt">Stamp earned.</div>
          </div>
          <div className="nk-coupon">
            <code>TOVEMI-NEXT-K7Q4</code>
            <small>Code for your next pack</small>
          </div>
          <ul className="nk-rw">
            <li>
              <span>Free shipping</span>
              <span>✓ earned</span>
            </li>
            <li>
              <span>Stamp · {GOAL_DAY} of {PACK_DAYS} days</span>
              <span>✓ earned</span>
            </li>
            <li>
              <span>Next-pack discount</span>
              <span>✓ earned</span>
            </li>
            <li>
              <span>Cashback on next order</span>
              <span>on reorder</span>
            </li>
          </ul>
        </div>

        <div className="nk-tabs">
          <span className={step < 2 ? 'is-on' : ''}>Today</span>
          <span className={step === 2 ? 'is-on' : ''}>Streak</span>
          <span className={step === 3 ? 'is-on' : ''}>Rewards</span>
        </div>
      </div>
    </div>
  )
}

/* ── pasek 30 dni na pierwszym ekranie ───────────────────────────────────── */
export function DayStrip() {
  const [go, setGo] = useState(false)
  useEffect(() => {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches || navigator.webdriver
    if (!still) setGo(true)
  }, [])
  return (
    <div className={'nk-strip' + (go ? ' nk-go' : '')}>
      <div className="nk-cells" role="img" aria-label={`${GOAL_DAY} of ${PACK_DAYS} days ticked`}>
        {Array.from({ length: PACK_DAYS }, (_, i) => (
          <span
            key={i}
            className={'nk-cell' + (i >= GOAL_DAY ? ' is-open' : '') + (i === GOAL_DAY - 1 ? ' is-stamp' : '')}
            style={{ ['--i' as string]: i }}
          />
        ))}
      </div>
      <div className="nk-stripcap">
        <span>One pack, {PACK_DAYS} days</span>
        <span>
          Day {GOAL_DAY}: the stamp
        </span>
      </div>
    </div>
  )
}

/* ── scena przypieta do przewijania ──────────────────────────────────────── */
export function Scene() {
  const wrap = useRef<HTMLDivElement>(null)
  // Stan domyslny DOM = stan koncowy (krok 4, bez przypiecia): tak wyglada strona
  // bez JS, w prefers-reduced-motion i pod navigator.webdriver (bramka qa.js).
  const [mode, setMode] = useState<'still' | 'scroll'>('still')
  const [p, setP] = useState(1)
  const [manual, setManual] = useState(3)
  const [scratched, setScratched] = useState(false)
  const [enter, setEnter] = useState(1)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    // Niskie okno (telefon poziomo, okno 1440x600): scena nie zmiesci telefonu i tekstu
    // w jednym ekranie, wiec zostaje w ukladzie statycznym.
    if (mq.matches || navigator.webdriver || window.innerHeight < 600) return
    setMode('scroll')
    let raf = 0
    let lastP = -1
    let lastE = -1
    const read = () => {
      raf = 0
      const el = wrap.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const total = Math.max(1, r.height - vh)
      const np = clamp(-r.top / total)
      const ne = clamp((vh - r.top) / vh)
      if (Math.abs(np - lastP) > 0.002) {
        lastP = np
        setP(np)
      }
      if (Math.abs(ne - lastE) > 0.01) {
        lastE = ne
        setEnter(ne)
      }
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(read)
    }
    read()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => {
      window.removeEventListener('scroll', on)
      window.removeEventListener('resize', on)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const scroll = mode === 'scroll'
  const x = p * STEPS.length
  const step = scroll ? Math.min(STEPS.length - 1, Math.floor(x)) : manual
  const t = scroll ? clamp(x - step) : 1

  const go = (i: number) => {
    if (!scroll) {
      setManual(i)
      return
    }
    const el = wrap.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const total = el.offsetHeight - window.innerHeight
    window.scrollTo({ top: top + (total * (i + 0.6)) / STEPS.length, behavior: 'smooth' })
  }

  return (
    <div
      ref={wrap}
      className={'nk-scene ' + (scroll ? 'is-scroll' : 'is-still')}
      id="how"
      style={{ ['--p' as string]: scroll ? p : 1 }}
    >
      <div className="nk-stage">
        <div className="nk-scenehead">
          <div className="nk-caps nk-lab">How it works · shown on a made-up brand</div>
          <h2 className="nk-h2">Four moves, one pack.</h2>
          <ol className="nk-steps">
            {STEPS.map((s, i) => (
              <li key={s.t} className={'nk-step' + (i === step ? ' is-on' : '')}>
                <button
                  type="button"
                  className="nk-stepbtn"
                  aria-current={i === step ? 'step' : undefined}
                  onClick={() => go(i)}
                >
                  <span className="nk-n">0{i + 1}</span>
                  <span className="nk-t">{s.t}</span>
                  <span className="nk-d">
                    <span>{s.d}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
          {scroll ? (
            <div className="nk-bar" aria-hidden="true">
              <i />
            </div>
          ) : null}
          <p className="nk-alt" hidden={!(step === 1 && !scratched)}>
            No pointer?{' '}
            <button type="button" className="nk-link" onClick={() => setScratched(true)}>
              Scratch today&rsquo;s card
            </button>
          </p>
          <p className="nk-demo">
            {DEMO_BRAND} is a fictional brand invented for this demo. The screens show the mechanics, not a client.
          </p>
        </div>
        <div className="nk-phonecol">
          <div
            style={{
              display: 'contents',
              ['--ty' as string]: scroll ? `${(1 - ease(enter)) * 56}px` : '0px',
              ['--sc' as string]: scroll ? 0.94 + 0.06 * ease(enter) : 1,
            }}
          >
            <Phone
              step={step}
              t={t}
              theme="paper"
              scratched={scratched}
              onScratched={() => setScratched(true)}
              interactive
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── white label: ten sam ekran, inna skora ──────────────────────────────── */
const THEMES: { id: Theme; name: string; sw: string }[] = [
  { id: 'night', name: 'Night', sw: '#14161A' },
  { id: 'clay', name: 'Clay', sw: '#EFE6DA' },
  { id: 'plain', name: 'Paper', sw: '#F7F5F0' },
]

export function WhiteLabel() {
  const [theme, setTheme] = useState<Theme>('night')
  return (
    <div className="nk-wl">
      <div>
        <div className="nk-caps nk-lab">White label</div>
        <h2 className="nk-h2">Your name on it, not mine.</h2>
        <p className="nk-body">
          Colors, type, wording and the reward list are settings, not a rebuild. The customer installs your
          app; Nawyko is the engine underneath.
        </p>
        <div className="nk-swatches" role="group" aria-label="Preview a theme">
          {THEMES.map((th) => (
            <button
              key={th.id}
              type="button"
              className="nk-sw"
              aria-pressed={theme === th.id}
              onClick={() => setTheme(th.id)}
            >
              <i style={{ background: th.sw }} />
              {th.name}
            </button>
          ))}
        </div>
      </div>
      <div className="nk-phonecol">
        <Phone step={2} t={1} theme={theme} scratched fixedDays={17} />
      </div>
    </div>
  )
}

/* ── zapytanie → istniejace /api/lead ────────────────────────────────────── */
const CONSENT_CONTACT = 'I agree to be contacted about this enquiry'
const CONSENT_MARKETING =
  'Occasional email from me — notes on reorder timing, new tools I build, and what I learn working on FMCG stores. Unsubscribe any time.'

export function Enquiry() {
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle')
  const errRef = useRef<HTMLParagraphElement>(null)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (state === 'busy') return
    const f = new FormData(e.currentTarget)
    const email = String(f.get('email') || '').trim()
    const marketing = f.get('marketing') === 'on'
    const q = new URLSearchParams(window.location.search)
    const source: Record<string, string> = { page: '/nawyko' }
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
      <div className="nk-form nk-done" role="status">
        <h3>Enquiry received.</h3>
        <p>I reply personally within 24 hours.</p>
      </div>
    )
  }

  return (
    <form className="nk-form" id="nawyko-enquiry" onSubmit={submit}>
      <div className="nk-caps">Ask about Nawyko</div>
      <label className="nk-f" htmlFor="nk-store">
        Your store URL
      </label>
      <input id="nk-store" name="store" type="text" inputMode="url" autoComplete="url" placeholder="yourstore.com" required maxLength={300} />
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
        Sent with this form: the two fields above, your consent choices, and the page and campaign link you came
        from. I reply personally — not a calendar link.
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
