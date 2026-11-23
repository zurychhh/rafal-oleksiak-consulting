'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Enquiry } from '../../nawyko/NawykoClient'

/* /work/genactiv — przebieg 1: akty 0–4, przebieg 2: akty 5–8 (cashback, poziomy, zgoda, jak to powstalo), przebieg 3: akty 9–10 (wyniki zablokowane, final z kolorem marki i formularzem). Jeden telefon jako nic strony.
   Stan domyslny DOM (SSR, bez JS, prefers-reduced-motion, navigator.webdriver, okno < 600 px) = uklad statyczny:
   kazdy akt z wlasnym rysunkiem w stanie koncowym. Tryb 'scroll' = przypieta scena, postep z przewijania (rAF),
   bez zegara (R2) i bez transition na elementach sterowanych przewijaniem (R4). Jedyny zegar: samozdrapka po 1,5 s
   (wymog specu) i jednorazowe drgniecie pieczatki. Wszystkie liczby na ekranach sa rysunkiem (aria-hidden) z podpisem „Example”. */

const ACTS = 11
const DAYS = 30
const STAMP_DAY = 24 // rysunek, podpisany „Example”
const MID_DAY = 15 // rysunek, podpisany „Example”

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const smooth = (v: number) => {
  const x = clamp(v)
  return x * x * (3 - 2 * x)
}

type Copy = { kicker: string; title: string; sub: string; cap?: string }
const CAP = 'Recreated screen for illustration.'
const NUM = 'Example screen. Numbers are placeholders.'
const COPY: Copy[] = [
  {
    kicker: 'GENACTIV · Polish colostrum brand',
    title: 'GENACTIV turns every box into a daily reason to come back.',
    sub: 'The GENACTIV app for its customers: confirm the purchase, scratch one card a day, collect rewards known in advance.',
  },
  {
    kicker: 'The problem',
    title: 'The risk: the habit fades halfway through the pack.',
    sub: 'Without a daily reason, the second order never comes.',
    cap: NUM,
  },
  {
    kicker: 'Step 1 · Proof of purchase',
    title: 'Proof of purchase from the box or the receipt.',
    sub: 'The customer scans the box code or the shop receipt. The receipt photo stays on the phone.',
  },
  {
    kicker: 'Step 2 · Card of the day',
    title: 'One card a day, after the daily dose.',
    sub: 'The foil is in GENACTIV colours. Scratch it with a finger or a mouse.',
  },
  {
    kicker: 'Step 3 · The month',
    title: 'Rewards are set before day one.',
    sub: 'Every ticked day fills the ring. The stamp lands on a day the customer knew in advance, never by chance.',
    cap: NUM,
  },
  {
    kicker: 'Step 4 · Cashback',
    title: 'Cashback grows with every repeat order.',
    sub: 'Each repeat order raises cashback by one fixed step. The brand sets every step before launch.',
    cap: NUM,
  },
  {
    kicker: 'Step 5 · Points and levels',
    title: 'Points and levels: earned once, never taken away.',
    sub: 'Points build levels. Short in-app lessons end with a medal and a fixed gift.',
    cap: NUM,
  },
  {
    kicker: 'Step 6 · Consent',
    title: 'Consent off: every card stays visible.',
    sub: 'The daily card and streak show as locked, with one button to turn them on. No reward depends on push or email consent.',
  },
  {
    kicker: 'How it was built',
    title: 'Every build passes security, data and copy checks.',
    sub: 'AI agents write the code; a person signs off each check before the next step.',
    cap: 'Build stages in order.',
  },
  {
    kicker: 'Results',
    title: 'Success means more reorders than customers without the app.',
    sub: 'Measured against a control group that never gets the app; first read 90 days after it goes live.',
    cap: 'Locked screen. No results shown yet.',
  },
  {
    kicker: 'Your brand',
    title: 'See it with your brand: pick a colour.',
    sub: 'The phone repaints in the picked colour, and the text colour adjusts to stay readable.',
    cap: 'Example screen in the picked colour.',
  },
]

/* ---------- Kolor marki odwiedzajacego (akt 10): kontrast tekstu liczony (WCAG 2.x) ---------- */
const GA_RED = '#f5333f'
const SWATCHES: { c: string; n: string }[] = [
  { c: GA_RED, n: 'GENACTIV red' },
  { c: '#1f8f5a', n: 'Forest green' },
  { c: '#2f6fde', n: 'Ocean blue' },
  { c: '#f5c400', n: 'Amber' },
  { c: '#8b5cf6', n: 'Plum' },
]
const DEFAULT_PICK = '#2f6fde'
const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const hex = (c: number[]) => '#' + c.map((v) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join('')
const mix = (a: string, b: string, t: number) => {
  const x = rgb(a)
  const y = rgb(b)
  return hex(x.map((v, i) => v + (y[i] - v) * t))
}
const lum = (h: string) => {
  const [r, g, b] = rgb(h).map((v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const ratio = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m)
  return (x + 0.05) / (y + 0.05)
}
// bialy albo czarny: wyzszy kontrast z dwoch; dla dowolnego koloru minimum to ok. 4,58:1
const inkOn = (c: string) => (ratio('#ffffff', c) >= ratio('#000000', c) ? '#ffffff' : '#000000')
const safeHex = (v: string) => (/^#[0-9a-f]{6}$/i.test(v) ? v.toLowerCase() : DEFAULT_PICK)

/* Etapy budowy: same kroki, bez liczb (liczby dolozy doradca z agencja/dane/realizacja-genactiv.json). */
const GATES: { t: string; gate?: boolean }[] = [
  { t: 'Green light from the brand' },
  { t: 'Security review', gate: true },
  { t: 'Tests that no customer sees another\u2019s data', gate: true },
  { t: 'GDPR art. 9: a dose is stored only as \u201cticked on date\u201d', gate: true },
  { t: 'Copy review', gate: true },
  { t: 'Rewards check: fixed and shown in advance', gate: true },
  { t: 'Store release only after the brand signs off' },
]

/* ---------- Pierscien 30 dni ---------- */
function Ring({ lit, dim = 0, stampOn = false }: { lit: number; dim?: number; stampOn?: boolean }) {
  return (
    <svg className="ga-ring" viewBox="0 0 200 200" aria-hidden="true">
      {Array.from({ length: DAYS }, (_, i) => {
        const day = i + 1
        const on = day <= lit
        const stamp = day === STAMP_DAY
        const fill = on ? (stamp ? '#ff8a91' : '#f5333f') : stamp ? '#5a2a30' : '#3a2a2d'
        return (
          <rect
            key={day}
            x="96"
            y="8"
            width="8"
            height="22"
            rx="4"
            fill={fill}
            opacity={on ? 1 - dim * 0.72 : 1}
            transform={`rotate(${i * 12} 100 100)`}
          />
        )
      })}
      {stampOn ? <circle cx="100" cy="100" r="50" fill="none" stroke="#ff8a91" strokeWidth="1" opacity="0.5" /> : null}
    </svg>
  )
}

/* ---------- Zdrapka w folii marki ---------- */
const FOIL = ['#ffd2d5', '#f5333f', '#9e1520', '#ff9aa0', '#c41a26', '#ff6a72', '#7a0f18']

function Scratch({ auto, revealed, onDone }: { auto: boolean; revealed: boolean; onDone: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const userTook = useRef(false)
  const last = useRef<{ x: number; y: number } | null>(null)
  const strokes = useRef(0)
  const doneRef = useRef(false)

  const finish = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    onDone()
  }, [onDone])

  const paint = useCallback(() => {
    const c = ref.current
    if (!c || doneRef.current) return
    const r = c.getBoundingClientRect()
    if (!r.width || !r.height) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    c.width = Math.round(r.width * dpr)
    c.height = Math.round(r.height * dpr)
    const g = c.getContext('2d')
    if (!g) return
    const grad = g.createLinearGradient(0, 0, c.width, c.height)
    FOIL.forEach((col, i) => grad.addColorStop(i / (FOIL.length - 1), col))
    g.fillStyle = grad
    g.fillRect(0, 0, c.width, c.height)
    // drobny polysk folii
    g.globalAlpha = 0.12
    g.strokeStyle = '#ffffff'
    g.lineWidth = dpr
    for (let x = -c.height; x < c.width; x += 5 * dpr) {
      g.beginPath()
      g.moveTo(x, 0)
      g.lineTo(x + c.height, c.height)
      g.stroke()
    }
    g.globalAlpha = 1
    g.fillStyle = '#ffffff'
    g.font = `700 ${Math.round(12 * dpr)}px Montserrat, system-ui, sans-serif`
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.fillText('DRAG TO SCRATCH', c.width / 2, c.height / 2)
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
    if (!c || !g || !c.width) return 0
    const d = g.getImageData(0, 0, c.width, c.height).data
    let clear = 0
    let n = 0
    for (let i = 3; i < d.length; i += 4 * 24) {
      n++
      if (d[i] < 40) clear++
    }
    return n ? clear / n : 0
  }

  const line = (a: { x: number; y: number }, b: { x: number; y: number }, w: number) => {
    const g = ref.current?.getContext('2d')
    if (!g) return
    g.globalCompositeOperation = 'destination-out'
    g.lineCap = 'round'
    g.lineJoin = 'round'
    g.lineWidth = w
    g.beginPath()
    g.moveTo(a.x, a.y)
    g.lineTo(b.x + 0.01, b.y + 0.01)
    g.stroke()
    g.globalCompositeOperation = 'source-over'
  }

  // Samozdrapka: 1,5 s po wejsciu aktu w kadr, jesli odwiedzajacy nie zaczal sam. Wlasne zdrapanie ma pierwszenstwo.
  useEffect(() => {
    if (!auto || revealed || doneRef.current) return
    let raf = 0
    const timer = window.setTimeout(() => {
      if (userTook.current || doneRef.current) return
      const c = ref.current
      if (!c) return
      const W = c.width
      const H = c.height
      const pts: { x: number; y: number }[] = []
      for (let i = 0; i <= 5; i++) pts.push({ x: W * (i % 2 ? 0.92 : 0.08), y: H * (0.12 + (0.76 * i) / 5) })
      const seg = pts.slice(1).map((q, i) => Math.hypot(q.x - pts[i].x, q.y - pts[i].y))
      const len = seg.reduce((a, b) => a + b, 0)
      const at = (u: number) => {
        let d = u * len
        for (let i = 0; i < seg.length; i++) {
          if (d <= seg[i] || i === seg.length - 1) {
            const f = seg[i] ? Math.min(1, d / seg[i]) : 0
            return { x: pts[i].x + (pts[i + 1].x - pts[i].x) * f, y: pts[i].y + (pts[i + 1].y - pts[i].y) * f }
          }
          d -= seg[i]
        }
        return pts[pts.length - 1]
      }
      const t0 = performance.now()
      let prev = at(0)
      const frame = (now: number) => {
        if (userTook.current) return
        const u = Math.min(1, (now - t0) / 1200)
        const pos = at(u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2)
        line(prev, pos, H * 0.42)
        prev = pos
        if (u < 1) raf = requestAnimationFrame(frame)
        else finish()
      }
      raf = requestAnimationFrame(frame)
    }, 1500)
    return () => {
      window.clearTimeout(timer)
      cancelAnimationFrame(raf)
    }
  }, [auto, revealed, finish])

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = e.currentTarget
    const r = c.getBoundingClientRect()
    return { x: ((e.clientX - r.left) / r.width) * c.width, y: ((e.clientY - r.top) / r.height) * c.height }
  }

  return (
    <canvas
      ref={ref}
      className={'ga-foil' + (revealed ? ' ga-gone' : '')}
      aria-hidden="true"
      onPointerDown={(e) => {
        userTook.current = true
        e.currentTarget.setPointerCapture(e.pointerId)
        last.current = pos(e)
        line(last.current, last.current, e.currentTarget.height * 0.36)
      }}
      onPointerMove={(e) => {
        if (!last.current) return
        const p = pos(e)
        line(last.current, p, e.currentTarget.height * 0.36)
        last.current = p
        if (++strokes.current % 8 === 0 && cleared() > 0.5) finish()
      }}
      onPointerUp={() => {
        last.current = null
        if (cleared() > 0.45) finish()
      }}
      onPointerCancel={() => {
        last.current = null
      }}
    />
  )
}

/* ---------- Ekrany telefonu (rysunek; liczby = Example) ---------- */
const BARS = [3, 1, 2, 1, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 1, 2]

function ScreenHome() {
  return (
    <div className="ga-scr ga-scr-home" aria-hidden="true">
      <div className="ga-word">GENACTIV</div>
      <div className="ga-home-card">
        <span>Today&apos;s card</span>
        <div className="ga-home-foil" />
      </div>
      <div className="ga-home-row">
        <span>Rewards</span>
        <i />
        <i />
        <i />
      </div>
    </div>
  )
}

function ScreenFade({ p }: { p: number }) {
  const lit = Math.round(smooth(p / 0.5) * MID_DAY)
  const dim = smooth((p - 0.5) / 0.4)
  return (
    <div className="ga-scr" aria-hidden="true">
      <div className="ga-scr-top">
        <div className="ga-scr-h">This month</div>
        <Chip />
      </div>
      <div className="ga-ring-wrap">
        <Ring lit={lit} dim={dim} />
        <div className="ga-ring-mid">
          <b>{lit}</b>
          <span>of {DAYS} days</span>
        </div>
      </div>
      <div className="ga-reorder" style={{ opacity: 0.35 + 0.65 * dim }}>
        <span>Next-order reward</span>
        <b>not yet</b>
      </div>
    </div>
  )
}

function ScreenScan({ p }: { p: number }) {
  const scan = smooth(p / 0.7)
  return (
    <div className="ga-scr" aria-hidden="true">
      <div className="ga-scr-h">Confirm purchase</div>
      <div className="ga-finder">
        <div className="ga-bars">
          {BARS.map((w, i) => (
            <i key={i} style={{ width: `${(w * 0.16).toFixed(2)}em` }} />
          ))}
        </div>
        <div className="ga-beam" style={{ backgroundPosition: `0 ${(scan * 100).toFixed(1)}%` }} />
      </div>
      <div className="ga-receipt">
        <i />
        <i />
        <i className="s" />
        <i />
      </div>
      <div className="ga-lock" style={{ opacity: smooth((p - 0.55) / 0.3) }}>
        <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
          <path d="M4 7V5a4 4 0 0 1 8 0v2h1v8H3V7h1zm2 0h4V5a2 2 0 0 0-4 0v2z" fill="currentColor" />
        </svg>
        Stays on this phone
      </div>
    </div>
  )
}

function ScreenScratch({
  auto,
  revealed,
  onDone,
}: {
  auto: boolean
  revealed: boolean
  onDone: () => void
}) {
  return (
    <div className="ga-scr">
      <div className="ga-scr-h" aria-hidden="true">
        Today
      </div>
      <div className="ga-card">
        <div className="ga-card-under" aria-live="polite">
          {revealed ? (
            <>
              <b>Day ticked</b>
              <span>One step closer to the stamp</span>
            </>
          ) : (
            <span className="ga-sr">Card not scratched yet</span>
          )}
        </div>
        <Scratch auto={auto} revealed={revealed} onDone={onDone} />
      </div>
      <div className={'ga-hint' + (revealed ? ' ga-hint-off' : '')} aria-hidden="true">
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path d="M9 11V5a1.5 1.5 0 0 1 3 0v5h.5V8.5a1.5 1.5 0 0 1 3 0V11h.5v-1a1.5 1.5 0 0 1 3 0v5c0 3.3-2.7 6-6 6h-1.2a6 6 0 0 1-4.8-2.4L3.6 14.4a1.5 1.5 0 0 1 2.3-1.9L9 15V11z" fill="currentColor" />
        </svg>
        Drag to scratch
      </div>
    </div>
  )
}

function ScreenMonth({ p, live, from = 0 }: { p: number; live: boolean; from?: number }) {
  // od dnia zdrapanego w akcie 3 (+1) do 24, przytrzymanie ~0,4 ekranu na pieczatce, potem do 30
  const lit = !live
    ? DAYS
    : p < 0.32
      ? Math.round(from + smooth(p / 0.32) * (STAMP_DAY - from))
      : p < 0.72
        ? STAMP_DAY
        : Math.round(STAMP_DAY + smooth((p - 0.72) / 0.2) * (DAYS - STAMP_DAY))
  const stamp = lit >= STAMP_DAY
  return (
    <div className="ga-scr" aria-hidden="true">
      <div className="ga-scr-top">
        <div className="ga-scr-h">This month</div>
        <Chip />
      </div>
      <div className="ga-ring-wrap">
        <Ring lit={lit} stampOn={stamp} />
        <div className="ga-ring-mid">
          <b>{lit}</b>
          <span>of {DAYS} days</span>
        </div>
        <div className={'ga-stamp' + (stamp ? ' ga-on' : '')}>
          <span>Stamp</span>
          <i />
        </div>
      </div>
      <div className="ga-reorder ga-reorder-on" style={{ opacity: stamp ? 1 : 0.35 }}>
        <span>Day {STAMP_DAY}</span>
        <b>stamp</b>
      </div>
    </div>
  )
}

function Chip() {
  return <span className="ga-chip">Example</span>
}

const STAIRS = [0.3, 0.48, 0.68, 0.92] // ksztalt schodow, bez stawek
function ScreenCash({ p }: { p: number }) {
  return (
    <div className="ga-scr" aria-hidden="true">
      <div className="ga-scr-top">
        <div className="ga-scr-h">Cashback</div>
        <Chip />
      </div>
      <div className="ga-stairs">
        {STAIRS.map((h, i) => {
          const g = smooth((p - i * 0.12) / 0.2)
          return (
            <div className="ga-step" key={i}>
              <div className="ga-step-col">
                <i style={{ transform: `scaleY(${(h * (0.12 + 0.88 * g)).toFixed(3)})`, opacity: 0.35 + 0.65 * g }} />
              </div>
              <span>Order {i + 1}</span>
            </div>
          )
        })}
      </div>
      <div className="ga-reorder">
        <span>Next order</span>
        <b>one step up</b>
      </div>
    </div>
  )
}

function ScreenLevels({ p }: { p: number }) {
  const fill = smooth(p / 0.45)
  const third = p > 0.6
  const end = smooth((p - 0.6) / 0.12)
  return (
    <div className="ga-scr" aria-hidden="true">
      <div className="ga-scr-top">
        <div className="ga-scr-h">Level 2</div>
        <Chip />
      </div>
      <div className="ga-meter">
        <i style={{ transform: `scaleX(${(0.18 + 0.82 * fill).toFixed(3)})` }} />
      </div>
      <div className="ga-meter-note">Points to the next level · never lost</div>
      <div className="ga-path">
        <div className="ga-path-h">Path 1</div>
        {['Lesson 1', 'Lesson 2', 'Lesson 3'].map((l, i) => {
          const done = i < 2 || third
          return (
            <div key={l} className={'ga-lesson' + (done ? ' ga-done' : '')}>
              <span>{l}</span>
              <b>{done ? '\u2713 done' : 'next'}</b>
            </div>
          )
        })}
        <div className="ga-path-end">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" style={{ opacity: 0.35 + 0.65 * end }}>
            <path d="M7 2h4l1 4 1-4h4l-3 7a6 6 0 1 1-4 0L7 2z" fill="#ff8a91" />
            <circle cx="12" cy="15" r="3.2" fill="#c41a26" />
          </svg>
          <span>Medal and gift at the finish</span>
        </div>
      </div>
    </div>
  )
}

function Lock() {
  return (
    <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
      <path d="M4 7V5a4 4 0 0 1 8 0v2h1v8H3V7h1zm2 0h4V5a2 2 0 0 0-4 0v2z" fill="currentColor" />
    </svg>
  )
}

function ScreenConsent({ on, onToggle, onFocus }: { on: boolean; onToggle: () => void; onFocus?: () => void }) {
  return (
    <div className="ga-scr">
      <div className="ga-scr-h" aria-hidden="true">
        Health data consent
      </div>
      <div className="ga-toggle-row" aria-hidden="true">
        <span>{on ? 'Consent on' : 'Consent off'}</span>
        <i className={'ga-toggle' + (on ? ' ga-on' : '')} />
      </div>
      {['Daily card', 'Streak'].map((c) => (
        <div key={c} className={'ga-cardrow' + (on ? '' : ' ga-locked')} aria-hidden="true">
          <span>{c}</span>
          <b>
            {on ? (
              '\u2713 on'
            ) : (
              <>
                <Lock /> locked
              </>
            )}
          </b>
        </div>
      ))}
      <button
        type="button"
        className={'ga-fakebtn' + (on ? ' ga-done' : '')}
        aria-pressed={on}
        onClick={onToggle}
        onFocus={onFocus}
      >
        Agree and turn on
      </button>
    </div>
  )
}

function ScreenBuild({ p }: { p: number }) {
  const lit = Math.floor(clamp(p / 0.8) * (GATES.length - 1) + 0.0001)
  return (
    <div className="ga-scr ga-scr-build">
      <div className="ga-scr-h">Build path</div>
      <ol className="ga-gates">
        {GATES.map((g, i) => (
          <li key={i} className={i <= lit ? 'ga-on' : ''}>
            <i aria-hidden="true" />
            <span>
              {g.t}
              {g.gate ? <em>human sign-off</em> : null}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function ScreenResults() {
  return (
    <div className="ga-scr" aria-hidden="true">
      <div className="ga-scr-top">
        <div className="ga-scr-h">Results</div>
        <span className="ga-chip ga-chip-lock">
          <Lock /> Locked
        </span>
      </div>
      <div className="ga-skel">
        {['With the app', 'Control group'].map((g) => (
          <div className="ga-skel-g" key={g}>
            <div className="ga-skel-bars">
              <i />
              <i />
              <i />
            </div>
            <span>{g}</span>
          </div>
        ))}
      </div>
      <div className="ga-cardrow ga-locked">
        <span>Reorder lift</span>
        <b>
          <Lock /> no data yet
        </b>
      </div>
    </div>
  )
}

function ScreenBrand({ c }: { c: string }) {
  const ink = inkOn(c)
  return (
    <div className="ga-scr ga-scr-brand" aria-hidden="true" style={{ ['--b' as string]: c, ['--bi' as string]: ink }}>
      <div className="ga-brand-bar">Your brand</div>
      <div className="ga-home-card">
        <span>Today&apos;s card</span>
        <div className="ga-brand-foil" />
      </div>
      <div className="ga-home-row ga-brand-row">
        <span>Rewards</span>
        <i />
        <i />
        <i />
      </div>
      <div className="ga-brand-btn">Scratch today&apos;s card</div>
    </div>
  )
}

function Picker({ pick, onPick, onFocus }: { pick: string; onPick: (c: string) => void; onFocus?: () => void }) {
  const known = SWATCHES.some((s) => s.c === pick)
  return (
    <fieldset className="ga-pick">
      <legend>Brand colour</legend>
      <div className="ga-pick-row">
        {SWATCHES.map((s) => (
          <label key={s.c} className="ga-sw" title={s.n}>
            <input
              type="radio"
              name="ga-brand"
              value={s.c}
              checked={pick === s.c}
              onChange={() => onPick(s.c)}
              onFocus={onFocus}
              aria-label={s.n}
            />
            <span style={{ background: s.c }} />
          </label>
        ))}
        <label className={'ga-any' + (known ? '' : ' ga-on')}>
          <input type="color" value={pick} onChange={(e) => onPick(safeHex(e.currentTarget.value))} onFocus={onFocus} />
          <span>Any colour</span>
        </label>
      </div>
      <p className="ga-pick-note">Your colour is never sent. Only the form fields go with Send.</p>
    </fieldset>
  )
}

function Final({ inScene = false }: { inScene?: boolean }) {
  return (
    <div className={'ga-final' + (inScene ? ' ga-final-in' : '')} id="enquiry">
      <Enquiry form="work" page="/work/genactiv" title="Ask about an app for your brand" />
      <a className="ga-link" href="/nawyko">
        See the full product page →
      </a>
    </div>
  )
}

function Box() {
  return (
    <div className="ga-box" aria-hidden="true">
      <div className="ga-box-front">
        <span>GENACTIV</span>
      </div>
    </div>
  )
}

/* ---------- Strona ---------- */
export function GenactivStory() {
  const track = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<'still' | 'scroll'>('still')
  const [f, setF] = useState(0) // postep 0..ACTS w trybie przewijania
  const [revealed, setRevealed] = useState(false)
  const [robot, setRobot] = useState(false)
  const [consent, setConsent] = useState(false)
  const flipConsent = useCallback(() => setConsent((v) => !v), [])
  const [pick, setPick] = useState(DEFAULT_PICK)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (navigator.webdriver) {
      setRobot(true)
      setRevealed(true)
    }
    if (mq.matches || navigator.webdriver || window.innerHeight < 600) return
    setMode('scroll')
    let raf = 0
    let lastF = -1
    const read = () => {
      raf = 0
      const el = track.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const span = Math.max(1, r.height - window.innerHeight)
      const nf = clamp(-r.top / span) * ACTS
      if (Math.abs(nf - lastF) > 0.001) {
        lastF = nf
        setF(nf)
      }
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(read)
    }
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    read()
    return () => {
      window.removeEventListener('scroll', on)
      window.removeEventListener('resize', on)
      cancelAnimationFrame(raf)
    }
  }, [])

  const done = useCallback(() => setRevealed(true), [])
  const heroLink = (
    <a className="ga-link" href="/nawyko">
      See it with your brand →
    </a>
  )
  // Przycisk osiagalny Tabem w kazdym trybie: fokus przewija scene do aktu zdrapki.
  const toScratch = () => {
    const el = track.current
    if (mode !== 'scroll' || !el) return
    const r = el.getBoundingClientRect()
    const span = r.height - window.innerHeight
    const y = window.scrollY + r.top + (3.4 / ACTS) * span
    if (Math.abs(window.scrollY - y) > span / ACTS / 3) window.scrollTo({ top: y })
  }
  // Przycisk zgody w makiecie aktu 7: fokus przewija scene do aktu 7 (wzorzec jak przy zdrapce).
  const toConsent = () => {
    const el = track.current
    if (mode !== 'scroll' || !el) return
    const r = el.getBoundingClientRect()
    const span = r.height - window.innerHeight
    const y = window.scrollY + r.top + (7.4 / ACTS) * span
    if (Math.abs(window.scrollY - y) > span / ACTS / 3) window.scrollTo({ top: y })
  }
  // Probki koloru w akcie 10: fokus przewija scene do aktu 10.
  const toBrand = () => {
    const el = track.current
    if (mode !== 'scroll' || !el) return
    const r = el.getBoundingClientRect()
    const span = r.height - window.innerHeight
    const y = window.scrollY + r.top + (10.5 / ACTS) * span
    if (Math.abs(window.scrollY - y) > span / ACTS / 3) window.scrollTo({ top: y })
  }
  const reveal = (
    <button type="button" className="ga-btn" onClick={done} onFocus={toScratch} aria-disabled={revealed}>
      {revealed ? 'Card revealed' : 'Reveal without scratching'}
    </button>
  )

  if (mode === 'still') {
    return (
      <div className="ga-still" key="still">
        {COPY.map((c, i) => (
          <section key={i} className={'ga-act ga-act-' + i} aria-labelledby={'ga-t' + i}>
            <div className="ga-copy-in">
              <p className="ga-kicker">{c.kicker}</p>
              {i === 0 ? (
                <h1 id={'ga-t' + i}>{c.title}</h1>
              ) : (
                <h2 id={'ga-t' + i}>{c.title}</h2>
              )}
              <p className="ga-sub">{c.sub}</p>
              {i === 0 ? heroLink : null}
              {i === 3 ? reveal : null}
              {i === 10 ? <Picker pick={pick} onPick={setPick} /> : null}
              {i === 10 ? <Final inScene /> : null}
            </div>
            <figure className="ga-fig">
              <div className={'ga-phone-slot' + (i === 0 ? ' ga-out' : '')}>
                {i === 0 ? <div className="ga-glow" /> : null}
                <div className="ga-phone">
                  <div className="ga-notch" />
                  {i === 0 ? <ScreenHome /> : null}
                  {i === 1 ? <ScreenFade p={1} /> : null}
                  {i === 2 ? <ScreenScan p={1} /> : null}
                  {i === 3 ? <ScreenScratch auto={false} revealed={revealed || robot} onDone={done} /> : null}
                  {i === 4 ? <ScreenMonth p={1} live={false} /> : null}
                  {i === 5 ? <ScreenCash p={1} /> : null}
                  {i === 6 ? <ScreenLevels p={1} /> : null}
                  {i === 7 ? <ScreenConsent on={consent} onToggle={flipConsent} /> : null}
                  {i === 8 ? <ScreenBuild p={1} /> : null}
                  {i === 9 ? <ScreenResults /> : null}
                  {i === 10 ? <ScreenBrand c={pick} /> : null}
                </div>
                {i === 0 ? (
                  <div className="ga-box-wrap">
                    <Box />
                  </div>
                ) : null}
              </div>
              <figcaption>{c.cap ?? CAP}</figcaption>
            </figure>
          </section>
        ))}
      </div>
    )
  }

  const act = Math.min(ACTS - 1, Math.floor(f))
  const local = f - act
  // przenikanie tekstow i ekranow: wejscie w pierwszych 12% aktu, wyjscie w ostatnich 12%
  const vis = (i: number) => {
    if (i === 0) return 1 - smooth((f - 0.88) / 0.12)
    if (i === ACTS - 1) return smooth((f - i) / 0.12)
    return Math.min(smooth((f - i) / 0.12), 1 - smooth((f - (i + 0.88)) / 0.12))
  }
  const p0 = smooth(f / 0.8) // telefon wysuwa sie z pudelka
  const boxOut = smooth((f - 0.75) / 0.35)

  return (
    <>
    <div className="ga-track" key="track" ref={track}>
      <div className="ga-stage">
        <div className="ga-copy">
          {COPY.map((c, i) => {
            // Jeden aktywny tekst na klatke (krycie 1), wejscie samym przesunieciem: zawsze jeden naglowek >= 0,9.
            const on = i === act
            const enter = on && i > 0 ? 1 - smooth(local / 0.1) : 0
            return (
              <article
                key={i}
                className="ga-copy-in"
                aria-labelledby={'ga-t' + i}
                inert={!on && i !== 3 && i !== 10}
                style={{
                  opacity: on ? 1 : 0,
                  transform: `translateY(${(enter * 18).toFixed(1)}px)`,
                }}
              >
                <p className="ga-kicker">{c.kicker}</p>
                {i === 0 ? <h1 id={'ga-t' + i}>{c.title}</h1> : <h2 id={'ga-t' + i}>{c.title}</h2>}
                <p className="ga-sub">{c.sub}</p>
                {i === 0 ? heroLink : null}
                {i === 3 ? reveal : null}
                {i === 10 ? <Picker pick={pick} onPick={setPick} onFocus={toBrand} /> : null}
              </article>
            )
          })}
        </div>
        <figure className="ga-fig">
          <div className="ga-phone-slot" style={{ transform: `translateY(${(-(1 - p0) * 16).toFixed(2)}%)` }}>
            <div className="ga-glow" style={{ opacity: 1 - 0.55 * boxOut }} />
            <div className="ga-phone" style={{ transform: `translateY(${((1 - p0) * 50).toFixed(2)}%)` }}>
              <div className="ga-notch" />
              {COPY.map((_, i) => (
                <div
                  key={i}
                  className="ga-layer"
                  inert={vis(i) < 0.5 && i !== 7}
                  style={{ opacity: vis(i), pointerEvents: vis(i) < 0.5 ? 'none' : undefined }}
                >
                  {i === 0 ? <ScreenHome /> : null}
                  {i === 1 ? <ScreenFade p={act === 1 ? local : act > 1 ? 1 : 0} /> : null}
                  {i === 2 ? <ScreenScan p={act === 2 ? local : act > 2 ? 1 : 0} /> : null}
                  {i === 3 ? <ScreenScratch auto={act === 3} revealed={revealed} onDone={done} /> : null}
                  {i === 4 ? <ScreenMonth p={act === 4 ? local : 0} live from={revealed ? 1 : 0} /> : null}
                  {i === 5 ? <ScreenCash p={act === 5 ? local : act > 5 ? 1 : 0} /> : null}
                  {i === 6 ? <ScreenLevels p={act === 6 ? local : act > 6 ? 1 : 0} /> : null}
                  {i === 7 ? <ScreenConsent on={consent} onToggle={flipConsent} onFocus={toConsent} /> : null}
                  {i === 8 ? <ScreenBuild p={act === 8 ? local : 0} /> : null}
                  {i === 9 ? <ScreenResults /> : null}
                  {/* przemalowanie z palety GENACTIV na wybrany kolor w pierwszych 40% aktu */}
                  {i === 10 ? <ScreenBrand c={act === 10 ? mix(GA_RED, pick, smooth(local / 0.4)) : GA_RED} /> : null}
                </div>
              ))}
            </div>
            <div
              className="ga-box-wrap"
              style={{ transform: `translateY(${(boxOut * 40).toFixed(1)}%)`, opacity: 1 - boxOut }}
            >
              <Box />
            </div>
          </div>
          {/* podpis jedzie razem z telefonem (transform), tekst zmienia sie z aktem w jednej linii: bez CLS */}
          <figcaption style={{ transform: `translateY(calc(var(--ph) * ${(-(1 - p0) * 0.16).toFixed(4)}))` }}>
            {COPY[act].cap ?? CAP}
          </figcaption>
        </figure>
      </div>
    </div>
    <Final />
    </>
  )
}
