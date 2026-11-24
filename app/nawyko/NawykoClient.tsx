'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Enquiry } from './Enquiry'
import { FAQ } from './content'

/* Enquiry mieszka w ./Enquiry (przebieg 4): /work/genactiv importuje sam formularz, bez calej sceny. */
export { Enquiry }

/* Pokaz Nawyko na ZMYSLONEJ marce. Nazwa sprawdzona w sieci 21.11.2026
   (agencja/research/marka-pokazowa.md) — to nie jest klient ani realna firma. */
export const DEMO_BRAND = 'Tovemi'

const STEPS = [
  {
    t: 'Confirm the pack',
    d: 'Customers scan the box or receipt: you see each purchase date.',
  },
  {
    t: 'Scratch one card a day',
    d: 'A scratch card after each dose: your brand, seen daily.',
  },
  {
    t: 'Build the streak',
    d: 'Each card marks a day; the next reward stays in view.',
  },
  {
    t: 'Earn a reward they saw coming',
    d: 'Twenty-four of thirty days earns the stamp and a next-pack code.',
  },
] as const

const START_DAY = 9
const GOAL_DAY = 24
const PACK_DAYS = 30

const NOOP = () => {}
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const ease = (t: number) => 1 - Math.pow(1 - t, 3)

type Theme = 'paper' | 'night' | 'clay'

/* ── zdrapka ─────────────────────────────────────────────────────────────── */
function Scratch({ gone, onDone, auto }: { gone: boolean; onDone: () => void; auto?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const crumbs = useRef<HTMLCanvasElement>(null)
  const finger = useRef<HTMLDivElement>(null)
  const userTook = useRef(false)
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
    g.font = `600 ${Math.round(11 * dpr)}px "NK Instrument Sans", "Instrument Sans", system-ui, sans-serif`
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

  /* Zdrapuje sie sama, jesli odwiedzajacy nie zrobi tego pierwszy: slad palca zygzakiem,
     opadajace drobiny, potem licznik serii. Wlasne zdrapanie przerywa animacje. */
  useEffect(() => {
    if (!auto || gone || userTook.current) return
    const c = ref.current
    const k = crumbs.current
    const g = c?.getContext('2d')
    const kg = k?.getContext('2d')
    if (!c || !g || !k || !kg) return
    const r = c.getBoundingClientRect()
    const sx = c.width / Math.max(1, r.width)
    k.width = c.width
    k.height = Math.round(c.height * 1.7)
    const W = c.width
    const H = c.height
    const pts: { x: number; y: number }[] = []
    const rows = 5
    for (let i = 0; i <= rows; i++) {
      const y = H * (0.14 + (0.72 * i) / rows)
      pts.push({ x: W * (i % 2 ? 0.9 : 0.1), y })
    }
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
    type Crumb = { x: number; y: number; vx: number; vy: number; s: number; a: number }
    const bits: Crumb[] = []
    const DUR = 1250
    const t0 = performance.now()
    let prev = at(0)
    let raf = 0
    let done = false
    let doneAt = 0
    const fg = finger.current
    const frame = (now: number) => {
      if (userTook.current) {
        if (fg) fg.style.opacity = '0'
        return
      }
      const u = Math.min(1, (now - t0) / DUR)
      const e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2
      const pos = at(e)
      g.globalCompositeOperation = 'destination-out'
      g.lineCap = 'round'
      g.lineJoin = 'round'
      g.lineWidth = W * 0.22
      g.beginPath()
      g.moveTo(prev.x, prev.y)
      g.lineTo(pos.x + 0.01, pos.y + 0.01)
      g.stroke()
      g.globalCompositeOperation = 'source-over'
      if (u < 1)
        for (let j = 0; j < 3; j++)
          bits.push({ x: pos.x, y: pos.y, vx: (Math.random() - 0.5) * 3 * sx, vy: -Math.random() * 2 * sx, s: (1.5 + Math.random() * 2.5) * sx, a: 1 })
      prev = pos
      kg.clearRect(0, 0, k.width, k.height)
      for (const b of bits) {
        b.vy += 0.35 * sx
        b.x += b.vx
        b.y += b.vy
        b.a -= 0.012
        if (b.a <= 0) continue
        kg.globalAlpha = b.a
        kg.fillStyle = '#A9A79F'
        kg.fillRect(b.x, b.y, b.s, b.s)
      }
      kg.globalAlpha = 1
      if (fg) {
        fg.style.opacity = u < 1 ? '1' : '0'
        fg.style.transform = `translate(${pos.x / sx}px, ${pos.y / sx}px)`
      }
      if (u >= 1 && !done) {
        done = true
        doneAt = now
      }
      if (done && now - doneAt > 380) {
        onDone()
        return
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      kg.clearRect(0, 0, k.width, k.height)
      if (fg) fg.style.opacity = '0'
    }
  }, [auto, gone, onDone])

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
    <>
    <canvas
      ref={ref}
      className={'nk-canvas' + (gone ? ' is-gone' : '')}
      onPointerDown={(e) => {
        userTook.current = true
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
    <canvas ref={crumbs} className="nk-crumbs" aria-hidden="true" />
    <div ref={finger} className="nk-finger" aria-hidden="true" />
    </>
  )
}

/* ── telefon ─────────────────────────────────────────────────────────────── */
/* Przykladowy harmonogram nagrod marki pokazowej; dni ustawia marka. */
const REWARD_ROWS = [
  { day: 7, name: 'Free shipping', note: 'on the next order' },
  { day: 24, name: `Stamp · ${GOAL_DAY} of ${PACK_DAYS} days`, note: 'six days of slack built in' },
  { day: 24, name: 'Next-pack discount', note: 'valid on a reorder only' },
  { day: 99, name: 'Cashback', note: 'toward the next order' },
] as const

const FINISH_DAYS = 34
const SKIPPED = [6, 13, 21, 27]
const TAB_OF = [0, 0, 1, 2, 2, 0, 2, 2, 1, 2, 2, 0, 0]

/* Runda 4: cashback, punkty, poziomy, wymiana. WSZYSTKIE liczby przykladowe (podpis „Example” w scenie),
   ustawia je marka; zadna nie pochodzi od prawdziwej marki. */
const CURRENCY = '€'
const CASHBACK_PER_ORDER = 2
const PTS_PER_DAY = 10
const LEVELS = [
  { name: 'Bronze', at: 100 },
  { name: 'Silver', at: 250 },
  { name: 'Gold', at: 500 },
] as const
const EX_POINTS = 300
/* Runda 4 (d–f): sciezka wiedzy, skan z apteki, prywatnosc. Liczby to przyklad (podpis „Example”). */
const LESSONS = 5
/* Generyczny kod kreskowy: szerokosci kresek, bez prawdziwego numeru EAN. */
const BARS = [2, 1, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 1, 2, 2, 1]
const BAR_UNIT = 92 / BARS.reduce((a, b) => a + b, 0)
/* [x, szerokosc] czarnych kresek; parzyste pozycje to kreski, nieparzyste to przerwy */
const BAR_RECTS = BARS.reduce<{ x: number; out: [number, number][] }>(
  (acc, w, i) => {
    if (i % 2 === 0) acc.out.push([+acc.x.toFixed(2), +(w * BAR_UNIT).toFixed(2)])
    acc.x += w * BAR_UNIT
    return acc
  },
  { x: 4, out: [] },
).out
const LOCKED = ['Daily card', 'Streak'] as const

function Phone({
  step,
  t,
  theme,
  scratched,
  onScratched,
  interactive,
  autoScratch,
  fixedDays,
  day = PACK_DAYS,
  brand = DEMO_BRAND,
  orders = 3,
  pts = 240,
  kept = false,
  rate = 100,
  lesson = 3,
  scanN = 0,
  bought = true,
  consent = false,
  onUnlock,
}: {
  step: number
  t: number
  theme: Theme
  scratched: boolean
  onScratched?: () => void
  interactive?: boolean
  autoScratch?: boolean
  fixedDays?: number
  day?: number
  brand?: string
  orders?: number
  pts?: number
  kept?: boolean
  rate?: number
  lesson?: number
  scanN?: number
  bought?: boolean
  consent?: boolean
  onUnlock?: () => void
}) {
  const view = step === 6 ? 3 : step
  const confirmed = step > 0 || t > 0.55
  const scan = step > 0 ? 1 : clamp(t / 0.5)
  const revealed = scratched || step > 1 || (step === 1 && t > 0.94)
  const days =
    fixedDays ??
    (step === 6
      ? 17
      : step < 2
        ? START_DAY
        : step === 2
          ? Math.round(START_DAY + (GOAL_DAY - START_DAY) * ease(clamp(t / 0.8)))
          : GOAL_DAY)
  const took = step === 5 ? Math.round(PACK_DAYS + (FINISH_DAYS - PACK_DAYS) * ease(clamp(t / 0.45))) : FINISH_DAYS
  const on = (i: number) => `nk-view nk-v${i}` + (view === i ? ' is-on' : '')
  /* Telefony statyczne rysuja tylko widoczny ekran; animowany potrzebuje wszystkich do przejsc. */
  const has = (i: number) => interactive || view === i
  const tab = TAB_OF[step] ?? 0

  return (
    /* Telefon z przyciskiem (scena prywatnosci) nie moze byc aria-hidden — przycisk musi byc osiagalny. */
    <div className="nk-phone" data-theme={theme} aria-hidden={onUnlock ? undefined : 'true'}>
      <div className="nk-screen">
        <div className="nk-pbar">
          <span>{brand}</span>
          <span>Demo</span>
        </div>

        {has(0) ? (
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
        ) : null}

        {has(1) ? (
        <div className={on(1)}>
          <div className="nk-pk">Today</div>
          <div className="nk-pt">Taken it? Scratch the card.</div>
          <div className="nk-card">
            <div>
              <b>Day {START_DAY}</b>
              <small>Done</small>
            </div>
            {interactive ? <Scratch gone={revealed} auto={autoScratch} onDone={onScratched ?? NOOP} /> : null}
          </div>
          <div className="nk-hint">{revealed ? 'Ticked. See you tomorrow.' : 'One card a day. Drag across it.'}</div>
          <div className={'nk-mini' + (revealed ? ' is-up' : '')}>
            <span>Streak</span>
            {/* A1 R4p12: tekst zmieniajacy szerokosc w miejscu = nowy wezel (nowy wezel nie jest przesunieciem w CLS) */}
            <span key={revealed ? 'y' : 'n'}>
              <b key={revealed ? 'y' : 'n'}>{revealed ? START_DAY : START_DAY - 1}</b> days
              {revealed ? <i className="nk-plus">+1</i> : null}
            </span>
          </div>
        </div>
        ) : null}

        {has(2) ? (
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
            <span key={Math.max(0, GOAL_DAY - days)}>{Math.max(0, GOAL_DAY - days)} to go</span>
          </div>
        </div>
        ) : null}

        {has(3) ? (
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
            <code>{brand.toUpperCase()}-NEXT-K7Q4</code>
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
        ) : null}

        {has(4) ? (
        <div className={on(4)}>
          <div className="nk-pk">Rewards · listed from day 1</div>
          <div className="nk-big">
            <b>{day}</b>
            <span>day</span>
            <em>of {PACK_DAYS}</em>
          </div>
          <ul className="nk-rw nk-rwd">
            {REWARD_ROWS.map((r) => (
              <li key={r.name} className={day >= r.day ? 'is-got' : ''}>
                <span>{r.name}</span>
                <span key={day >= r.day ? 'y' : 'n'}>{r.day > PACK_DAYS ? 'on reorder' : day >= r.day ? '✓ earned' : `day ${r.day}`}</span>
              </li>
            ))}
          </ul>
          <div className={'nk-coupon nk-late' + (day >= GOAL_DAY ? ' is-on' : '')}>
            <code>{brand.toUpperCase()}-NEXT-K7Q4</code>
            <small>Code for your next pack</small>
          </div>
        </div>
        ) : null}

        {has(5) ? (
        <div className={on(5)}>
          <div className="nk-pk">Pack finished</div>
          <div className="nk-big">
            <b>{took}</b>
            <span>days</span>
          </div>
          <div className="nk-pt nk-pt2">{PACK_DAYS} doses ticked.</div>
          <div className="nk-ps">
            The label says {PACK_DAYS} days. This pack took {FINISH_DAYS}.
          </div>
          <div className="nk-grid nk-g34">
            {Array.from({ length: FINISH_DAYS }, (_, i) => (
              <i key={i} className={SKIPPED.includes(i) ? '' : 'is-in'} />
            ))}
          </div>
          <div className="nk-goal">
            <span>{PACK_DAYS} ticked</span>
            <span>{FINISH_DAYS - PACK_DAYS} skipped</span>
          </div>
        </div>
        ) : null}

        {has(7) ? (
        <div className={on(7)}>
          <div className="nk-pk">Cashback wallet</div>
          <div className="nk-big">
            <b>
              {CURRENCY}
              {orders * CASHBACK_PER_ORDER}
            </b>
            <span>to spend</span>
          </div>
          <ul className="nk-rw nk-wal">
            {[1, 2, 3].map((n) => (
              <li key={n} className={n <= orders ? 'is-got' : ''}>
                <span>Order {n}</span>
                <span>{n <= orders ? `+${CURRENCY}${CASHBACK_PER_ORDER}` : 'next'}</span>
              </li>
            ))}
          </ul>
          <div className="nk-use">
            <span>Use on next order</span>
            <span>Take off next delivery</span>
          </div>
        </div>
        ) : null}

        {has(8) ? (
        <div className={on(8)}>
          <div className="nk-pk">Points · levels</div>
          <div className="nk-big">
            <b>{pts}</b>
            <span>points</span>
          </div>
          <div className="nk-medals">
            {LEVELS.map((l) => (
              <div key={l.name} className={'nk-medal' + (pts >= l.at ? ' is-got' : '')}>
                <i>{l.name[0]}</i>
                <span>{l.name}</span>
                <small>{l.at}</small>
              </div>
            ))}
          </div>
          <div className="nk-ps">{kept ? 'Day skipped. Level kept.' : `+${PTS_PER_DAY} points for today’s card.`}</div>
        </div>
        ) : null}

        {has(9) ? (
        <div className={on(9)}>
          <div className="nk-pk">Exchange points</div>
          <div className="nk-big">
            <b>{EX_POINTS}</b>
            <span>points</span>
          </div>
          <div className="nk-pt nk-pt2">
            = {CURRENCY}
            {(EX_POINTS / rate).toFixed(2)} cashback
          </div>
          <div className="nk-coupon">
            <code>
              {rate} pts = {CURRENCY}1
            </code>
            <small>Rate set by {brand}</small>
          </div>
          <div className="nk-use nk-use1">
            <span>Move to wallet</span>
          </div>
        </div>
        ) : null}

        {has(10) ? (
        <div className={on(10)}>
          <div className="nk-pk">Learning path</div>
          <div className="nk-pbars" aria-hidden="true">
            {Array.from({ length: LESSONS }, (_, i) => (
              <i key={i} className={i < lesson ? 'is-in' : ''} />
            ))}
          </div>
          <ul className="nk-rw nk-les">
            {Array.from({ length: LESSONS }, (_, i) => (
              <li key={i} className={i < lesson ? 'is-got' : i === lesson ? 'is-now' : ''}>
                <span>
                  Lesson {i + 1} of {LESSONS}
                </span>
                <span>{i < lesson ? '✓ done' : i === lesson ? 'now' : 'next'}</span>
              </li>
            ))}
          </ul>
          <div className={'nk-gift' + (lesson >= LESSONS ? ' is-on' : '')}>
            <div className="nk-gmedal">
              <span>✓</span>
            </div>
            <div>
              <b>{lesson >= LESSONS ? 'Gift code ready for your next order' : 'Gift at the finish'}</b>
              <small>A matching product from {brand}</small>
            </div>
          </div>
        </div>
        ) : null}

        {has(11) ? (
        <div className={on(11)}>
          <div className="nk-pk">Bought in a pharmacy?</div>
          <div className="nk-pt">Scan the box.</div>
          <div className="nk-bc">
            <svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
              {BAR_RECTS.map(([x, w]) => (
                <rect key={x} x={x} y={0} width={w} height={40} />
              ))}
            </svg>
            <div key={scanN} className={'nk-beam' + (scanN > 0 ? ' is-run' : '')} />
          </div>
          <div className={'nk-ok' + (bought ? ' is-on' : '')}>
            <div className="nk-okrow">
              <span className="nk-tick">✓</span>
              <span>Pack registered · bought offline</span>
            </div>
            <div className="nk-ps">The daily card starts today.</div>
          </div>
        </div>
        ) : null}

        {has(12) ? (
        <div className={on(12)}>
          <div className="nk-pk">Health data consent · {consent ? 'on' : 'off'}</div>
          <div className="nk-pt nk-pt3">{consent ? 'Everything is on.' : 'Visible. Locked until you agree.'}</div>
          <ul className="nk-rw nk-lock">
            {LOCKED.map((f) => (
              <li key={f} className={consent ? 'is-got' : ''}>
                <span>{f}</span>
                <span>{consent ? '✓ on' : 'locked'}</span>
              </li>
            ))}
          </ul>
          {consent ? (
            <div className="nk-ps">A tick records the date only.</div>
          ) : onUnlock ? (
            <button type="button" className="nk-unlock" onClick={onUnlock}>
              Agree and turn on
            </button>
          ) : (
            <div className="nk-use nk-use1">
              <span>Agree and turn on</span>
            </div>
          )}
        </div>
        ) : null}

        <div className="nk-tabs">
          <span className={tab === 0 ? 'is-on' : ''}>Today</span>
          <span className={tab === 1 ? 'is-on' : ''}>Streak</span>
          <span className={tab === 2 ? 'is-on' : ''}>Rewards</span>
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

/* ── akt 5: nagrody na osi 30 dni ────────────────────────────────────────── */
function RewardsPanel({ day, onDay, id }: { day: number; onDay: (d: number) => void; id: string }) {
  return (
    <div className="nk-panel nk-in">
      <div className="nk-caps nk-lab">
        <span className="nk-who">For your customer</span>
        <span className="nk-labrest">Rewards</span>
      </div>
      <h2 className="nk-h2" id={id}>
        Every reward is listed from day one.
      </h2>
      <p className="nk-one">Drag the day to see each reward arrive.</p>
      <div className="nk-axis">
        <div className="nk-flags" aria-hidden="true">
          <span style={{ ['--d' as string]: 7 }} className={day >= 7 ? 'is-got' : ''}>
            7
          </span>
          <span style={{ ['--d' as string]: 24 }} className={day >= 24 ? 'is-got' : ''}>
            24
          </span>
          <em>Example</em>
        </div>
        <div className="nk-track">
          <div className="nk-cells" aria-hidden="true">
            {Array.from({ length: PACK_DAYS }, (_, i) => (
              <span
                key={i}
                className={'nk-cell' + (i >= day ? ' is-open' : '') + (i === 6 || i === GOAL_DAY - 1 ? ' is-stamp' : '')}
              />
            ))}
          </div>
          <i className="nk-knob" aria-hidden="true" style={{ ['--d' as string]: day }} />
          <input
            className="nk-range"
            type="range"
            min={1}
            max={PACK_DAYS}
            step={1}
            value={day}
            aria-label="Day of the pack"
            aria-valuetext={`Day ${day} of ${PACK_DAYS}`}
            onChange={(e) => onDay(Number(e.currentTarget.value))}
          />
        </div>
      </div>
      <ul className="nk-earn">
        {REWARD_ROWS.map((r) => (
          <li key={r.name} className={day >= r.day ? 'is-got' : ''}>
            <span className="nk-when">{r.day > PACK_DAYS ? 'Reorder' : `Day ${r.day}`}</span>
            <span className="nk-what">
              {r.name.replace(/ · .*/, '')} <em>{r.note}</em>
            </span>
            <span className="nk-st">{r.day > PACK_DAYS ? '→' : day >= r.day ? '✓' : ''}</span>
          </li>
        ))}
      </ul>
      <p className="nk-fine">Example schedule. You set the rewards and the days.</p>
    </div>
  )
}

/* ── akt 6: widok marki — z wielu telefonow sklada sie rozklad ───────────── */
/* ZMYSLONE dane ilustracyjne: ile opakowan konczy sie w dniach 28–42. */
const DIST_FROM = 28
const DIST = [1, 2, 4, 7, 10, 13, 11, 8, 6, 4, 3, 2, 1, 1, 1]
const DIST_TOTAL = DIST.reduce((a, b) => a + b, 0)
const DIST_PEAK = DIST_FROM + DIST.indexOf(Math.max(...DIST))
const ME_COL = FINISH_DAYS - DIST_FROM
const DOT_ORDER: number[][] = (() => {
  let n = 0
  const rank = DIST.map((c) => Array.from({ length: c }, () => (n++ * 37) % DIST_TOTAL))
  // kropka z telefonu pojawia sie pierwsza
  rank[ME_COL][0] = -1
  return rank
})()

function BrandPanel({ t, id }: { t: number; id: string }) {
  const shown = t >= 1 ? DIST_TOTAL : Math.round((DIST_TOTAL - 1) * clamp((t - 0.3) / 0.45))
  const marks = t > 0.8
  return (
    <div className="nk-panel nk-in">
      <div className="nk-caps nk-lab">
        <span className="nk-who">For you</span>
        <span className="nk-labrest">What the brand sees</span>
      </div>
      <h2 className="nk-h2" id={id}>
        See the day each pack really runs out.
      </h2>
      <p className="nk-one">
        Each dot: a pack&rsquo;s real last day, not the label&rsquo;s.
      </p>
      <div
        className={'nk-chart' + (marks ? ' is-marked' : '')}
        role="img"
        aria-label={`Illustration with invented data: finished packs by day. The label assumes day ${PACK_DAYS}; most packs in this illustration end on day ${DIST_PEAK}.`}
      >
        <div className="nk-tag" aria-hidden="true">
          Illustration · invented data
        </div>
        <div className="nk-cols">
          {DIST.map((c, ci) => {
            const d = DIST_FROM + ci
            return (
              <div
                key={d}
                className={'nk-col' + (d === PACK_DAYS ? ' is-label' : '') + (d === DIST_PEAK ? ' is-peak' : '')}
              >
                {Array.from({ length: c }, (_, ri) => (
                  <i
                    key={ri}
                    className={
                      (DOT_ORDER[ci][ri] < shown ? 'is-in' : '') + (ci === ME_COL && ri === 0 ? ' is-me' : '')
                    }
                  />
                ))}
                <b>{d === DIST_FROM || d === PACK_DAYS || d === DIST_PEAK || d === FINISH_DAYS || d === 42 ? d : ''}</b>
              </div>
            )
          })}
        </div>
        <div className="nk-legend" aria-hidden="true">
          <span className="nk-lg-label">Day {PACK_DAYS} · the label</span>
          <span className="nk-lg-peak">Day {DIST_PEAK} · most packs end</span>
          <span className="nk-lg-me">Day {FINISH_DAYS} · the demo customer above</span>
        </div>
      </div>
      <p className="nk-fine">
        Your curve comes from your own orders. <a href="/tool">Check your gap for free</a>.
      </p>
    </div>
  )
}

/* ── akt 7: white label — skora przemalowuje cala strone ─────────────────── */
type Skin = 'paper' | 'night' | 'clay'
const SKINS: { id: Skin; name: string; sw: string }[] = [
  { id: 'paper', name: 'Paper', sw: '#F7F5F0' },
  { id: 'night', name: 'Night', sw: '#14161A' },
  { id: 'clay', name: 'Clay', sw: '#EFE6DA' },
]

function SkinPanel({
  skin,
  onSkin,
  id,
  name,
  onName,
}: {
  skin: Skin
  onSkin: (s: Skin) => void
  id: string
  name: string
  onName: (v: string) => void
}) {
  return (
    <div className="nk-panel nk-in">
      <div className="nk-caps nk-lab">
        <span className="nk-who">Under your brand</span>
        <span className="nk-labrest">White label</span>
      </div>
      <h2 className="nk-h2" id={id}>
        Your brand. Your colours. Your app.
      </h2>
      <p className="nk-one">Type a brand name, pick a style: the whole page adapts.</p>
      <label className="nk-name">
        <span className="nk-caps">Brand name</span>
        <input
          type="text"
          value={name}
          maxLength={14}
          placeholder={DEMO_BRAND}
          autoComplete="off"
          spellCheck={false}
          onChange={(e) => onName(e.currentTarget.value)}
        />
      </label>
      <div className="nk-swatches" role="group" aria-label="Repaint this page">
        {SKINS.map((s) => (
          <button key={s.id} type="button" className="nk-sw" aria-pressed={skin === s.id} onClick={() => onSkin(s.id)}>
            <i style={{ background: s.sw }} />
            {s.name}
          </button>
        ))}
      </div>
      <p className="nk-fine">The name stays in this page. Nothing is sent.</p>
      <p className="nk-next">
        <a className="nk-link" href="#enquiry">
          Ask how {name.trim().slice(0, 14) || 'your brand'} gets its own app
        </a>
      </p>
    </div>
  )
}

/* ── scena przypieta do przewijania ──────────────────────────────────────── */
const ACTS = 7
/* Akt zdrapki trwa dluzej niz inne: to najwazniejszy moment strony. */
const ACT_W = [1, 1.9, 1, 1, 1, 1.5, 1.3]
const ACT_AT = ACT_W.map((_, i) => ACT_W.slice(0, i).reduce((a, b) => a + b, 0))
const ACT_TOT = ACT_W.reduce((a, b) => a + b, 0)
/* Rozdzialy: jak to dziala (klient) → dla marki → pod Twoja marka. Telefon zmienia strone miedzy rozdzialami. */
const CH_OF = [0, 0, 0, 0, 0, 1, 2]
const ACT_NAMES = ['Purchase', 'Daily card', 'Streak', 'Reward', 'Reward calendar', 'Pack rhythm', 'Your branding'] as const

function Scene({
  skin,
  onSkin,
  name,
  onName,
}: {
  skin: Skin
  onSkin: (s: Skin) => void
  name: string
  onName: (v: string) => void
}) {
  const brand = name.trim().slice(0, 14) || DEMO_BRAND
  const wrap = useRef<HTMLDivElement>(null)
  // Stan domyslny DOM = uklad statyczny ze stanami koncowymi: tak wyglada strona
  // bez JS, w prefers-reduced-motion i pod navigator.webdriver (bramka qa.js).
  const [mode, setMode] = useState<'still' | 'scroll'>('still')
  const [p, setP] = useState(1)
  const [manual, setManual] = useState(3)
  const [scratched, setScratched] = useState(false)
  const [enter, setEnter] = useState(1)
  const [dayPick, setDayPick] = useState<{ d: number; p: number } | null>(null)
  const onScratched = useCallback(() => setScratched(true), [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    // Niskie okno (telefon poziomo, okno 1440x600): scena nie zmiesci telefonu i tekstu
    // w jednym ekranie, wiec zostaje w ukladzie statycznym.
    // Reduced motion: uklad statyczny startuje na akcie zdrapki (karta do zdrapania palcem albo przyciskiem
    // „Scratch today's card”), bez samozdrapki — zamiast od razu na nagrodzie. Bramka qa.js (webdriver) bez zmian.
    if (mq.matches && !navigator.webdriver) setManual(1)
    // Spec 13: inline-skrypt w page.tsx ustawia data-nk-pin (rezerwa 780vh) przy tym samym warunku.
    const html = document.documentElement
    if (mq.matches || navigator.webdriver || window.innerHeight < 600) {
      html.removeAttribute('data-nk-pin')
      return
    }
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
      if (Math.abs(np - lastP) > 0.0012) {
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
      html.removeAttribute('data-nk-pin')
    }
  }, [])

  const scroll = mode === 'scroll'
  const x = p * ACT_TOT
  let found = 0
  for (let i = 0; i < ACTS; i++) if (x >= ACT_AT[i]) found = i
  const step = scroll ? found : manual
  // Uklad statyczny na akcie zdrapki: t=0, zeby karta czekala na odwiedzajacego (Phone odkrywa ja przy t>0,94).
  const t = scroll ? clamp((x - ACT_AT[found]) / ACT_W[found]) : step === 1 ? 0 : 1
  const ch = CH_OF[step] ?? 0
  /* Przejazd telefonu miedzy rozdzialami sterowany przewijaniem (regula R2), nie zegarem: wjazd w rozdzial „For you”
     przez pierwsze 0,3 aktu, powrot przez pierwsze 0,3 aktu „Under your brand”. Tekst aktu wchodzi dopiero po przejezdzie. */
  /* Runda 3, przebieg 3: przejazd dluzszy (0,45 aktu) i symetryczny (smoothstep zamiast ease-out) — przy kolku 120 px
     telefon przesuwal sie o ~0,6 drogi na jeden ruch; teraz o ~0,25. */
  const SW_LEN = 0.45
  const smooth = (v: number) => v * v * (3 - 2 * v)
  const sw = !scroll ? 0 : x < ACT_AT[6] ? smooth(clamp((x - ACT_AT[5]) / SW_LEN)) : 1 - smooth(clamp((x - ACT_AT[6]) / SW_LEN))
  const local = x - ACT_AT[step]
  const inK = ease(step === 4 ? clamp(local / 0.12) : clamp((local - SW_LEN + 0.06) / 0.2))
  const [swung, setSwung] = useState(false)
  const lastCh = useRef(0)
  useEffect(() => {
    if (ch !== lastCh.current) {
      lastCh.current = ch
      setSwung(true)
    }
  }, [ch])

  // Zdrapka: jesli odwiedzajacy nie zdrapie sam w ok. 1,5 s od wejscia w akt, karta zdrapuje sie sama.
  // Kto przewija szybko (polowa aktu), dostaje animacje od razu.
  const [autoS, setAutoS] = useState(false)
  // Kto sam wybral akt zdrapki (nawigacja scen), dostaje karte do zdrapania — bez samozdrapki, dopoki jest w akcie.
  const [hold, setHold] = useState<false | 'pending' | 'on'>(false)
  useEffect(() => {
    if (step === 1 && hold === 'pending') setHold('on')
    else if (step !== 1 && hold === 'on') setHold(false)
  }, [step, hold])
  useEffect(() => {
    if (!scroll || step !== 1 || scratched || autoS || hold) return
    const id = window.setTimeout(() => {
      // Kto przechodzi scene klawiatura, sam decyduje: przycisk zastepczy nie znika mu spod fokusu.
      const a = document.activeElement
      if (a && a !== document.body && wrap.current?.contains(a) && a.matches(':focus-visible')) return
      setAutoS(true)
    }, 1500)
    return () => window.clearTimeout(id)
  }, [scroll, step, scratched, autoS, hold])
  const autoNow = !hold && (autoS || (scroll && step === 1 && t > 0.45))

  // Dzien na osi: z przewijania, chyba ze odwiedzajacy sam go przeciagnal (do nastepnego ruchu strony).
  const picked = dayPick && (!scroll || Math.abs(dayPick.p - p) < 0.012) ? dayPick.d : null
  const scrollDay = step < 4 ? 1 : step > 4 ? PACK_DAYS : Math.round(1 + (PACK_DAYS - 1) * clamp((t - 0.08) / 0.8))
  const day = picked ?? (scroll ? scrollDay : PACK_DAYS)
  const pickDay = (d: number) => setDayPick({ d, p })

  const go = (i: number) => {
    if (!scroll) {
      setManual(i)
      return
    }
    const el = wrap.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const total = el.offsetHeight - window.innerHeight
    window.scrollTo({ top: top + (total * (ACT_AT[i] + (i === 1 ? 0.25 : 0.6) * ACT_W[i])) / ACT_TOT, behavior: 'smooth' })
    if (i === 1) setHold('pending')
    // Akty 5–7: po dojechaniu fokus trafia do kontrolki aktu (os dni, nazwa marki), zeby byla osiagalna z klawiatury.
    if (i === 1 && !scratched)
      for (const ms of [700, 1200, 1800])
        window.setTimeout(() => {
          const b = el.querySelector<HTMLElement>('.nk-alt:not([hidden]) .nk-link')
          if (b && document.activeElement !== b) b.focus({ preventScroll: true })
        }, ms)
    if (i >= 4)
      window.setTimeout(() => {
        el.querySelector<HTMLElement>('.nk-panel input, .nk-panel a')?.focus({ preventScroll: true })
      }, 900)
  }

  /* --sw i --p ustawiane na elementach, ktore ich uzywaja (nie na korzeniu sceny) i zadeklarowane @property
     z inherits:false: zmiana przy kazdym przewinieciu nie uniewaznia stylow calego poddrzewa sceny. */
  const swStyle = { ['--sw' as string]: sw }
  const steps = (
    <div className="nk-in">
      <div className="nk-caps nk-lab">
        <span className="nk-who">For your customer</span>
        <span className="nk-labrest">How it works · made-up brand</span>
      </div>
      <h2 className="nk-h2">Four steps that bring the customer back for the next pack.</h2>
      <ol className="nk-steps">
        {STEPS.map((s, i) => (
          <li key={s.t} className={'nk-step' + (i === step ? ' is-on' : '')}>
            <button type="button" className="nk-stepbtn" aria-current={i === step ? 'step' : undefined} onClick={() => go(i)}>
              <span className="nk-n">0{i + 1}</span>
              <span className="nk-t">{s.t}</span>
              <span className="nk-d">
                <span>{s.d}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
      <p className="nk-next" hidden={!(scroll && step >= 2)}>
        <a className="nk-link" href="#enquiry">
          Ask how {name.trim().slice(0, 14) || 'your brand'} gets its own app
        </a>
      </p>
      <p className="nk-alt" hidden={!(step === 1 && !scratched)}>
        No pointer?{' '}
        <button type="button" className="nk-link" onClick={() => setScratched(true)}>
          Scratch today&rsquo;s card
        </button>
      </p>
    </div>
  )

  return (
    <div
      ref={wrap}
      className={'nk-scene ' + (scroll ? 'is-scroll' : 'is-still')}
      id="how"
      data-act={scroll ? step : undefined}
      data-ch={scroll ? ch : undefined}
      data-swung={scroll && swung ? '' : undefined}
    >
      <div className="nk-stage">
        <div className="nk-scenehead" style={swStyle}>
          {!scroll || step < 4 ? steps : null}
          {scroll && step >= 4 ? (
            /* Regula R2 (Chrome „Scrollytelling”): tekst aktu wchodzi wedlug postepu przewijania, nie zegara. */
            <div className="nk-actin" style={{ opacity: inK, transform: `translateY(${(1 - inK) * 18}px)` }}>
              {step === 4 ? <RewardsPanel day={day} onDay={pickDay} id="nk-rewards" /> : null}
              {step === 5 ? <BrandPanel t={t} id="nk-brand" /> : null}
              {step === 6 ? <SkinPanel skin={skin} onSkin={onSkin} id="nk-wl" name={name} onName={onName} /> : null}
            </div>
          ) : null}
          <p className="nk-demo">
            {DEMO_BRAND} is a made-up demo brand, not a client.
          </p>
        </div>
        <div className="nk-phonecol" style={swStyle}>
          <div
            style={{
              display: 'contents',
              ['--ty' as string]: scroll ? `${(1 - ease(enter)) * 140}px` : '0px',
              ['--sc' as string]: scroll ? 0.8 + 0.2 * ease(enter) : 1,
            }}
          >
            <div className="nk-swing">
            <Phone
              step={step}
              t={t}
              theme={skin}
              scratched={scratched}
              onScratched={onScratched}
              interactive
              autoScratch={autoNow}
              day={day}
              brand={brand}
            />
            </div>
          </div>
        </div>
          {scroll ? (
          <nav className="nk-acts" aria-label="Scenes">
            {ACT_NAMES.map((n, i) => (
              <button key={n} type="button" aria-current={step === i ? 'step' : undefined} onClick={() => go(i)}>
                {n}
              </button>
            ))}
          </nav>
        ) : null}
        {scroll ? (
          <div className="nk-bar" aria-hidden="true">
            <i style={{ ['--p' as string]: p }} />
          </div>
        ) : null}
      </div>
      {scroll ? null : (
        <>
          <section className="nk-still" aria-labelledby="nk-rewards">
            <RewardsPanel day={day} onDay={pickDay} id="nk-rewards" />
            <div className="nk-phonecol">
              <Phone step={4} t={1} theme={skin} scratched day={day} brand={brand} />
            </div>
          </section>
          <section className="nk-still" aria-labelledby="nk-brand">
            <BrandPanel t={1} id="nk-brand" />
            <div className="nk-phonecol">
              <Phone step={5} t={1} theme={skin} scratched brand={brand} />
            </div>
          </section>
          <section className="nk-still" aria-labelledby="nk-wl">
            <SkinPanel skin={skin} onSkin={onSkin} id="nk-wl" name={name} onName={onName} />
            <div className="nk-phonecol">
              <Phone step={6} t={1} theme={skin} scratched brand={brand} />
            </div>
          </section>
        </>
      )}
    </div>
  )
}

/* ── runda 4: lojalnosc — cashback, punkty i poziomy, wymiana z panelem marki ── */
/* Trzy sceny w ukladzie „nk-still” (tekst + telefon), ten sam w kazdym trybie: bez JS, w reduced-motion
   i przy przewijaniu stan domyslny jest kompletny, a kontrolki to zwykle przyciski i natywny suwak. */
const ORDER_LABEL = ['1st order', '2nd order', '3rd order'] as const

function Loyalty({ skin, brand }: { skin: Skin; brand: string }) {
  const [orders, setOrders] = useState(3)
  const [pts, setPts] = useState(240)
  const [kept, setKept] = useState(false)
  const [rate, setRate] = useState(100)
  const level = [...LEVELS].reverse().find((l) => pts >= l.at)
  const monthCost = ((PACK_DAYS * PTS_PER_DAY) / rate).toFixed(2)

  return (
    <div className="nk-r4" id="loyalty">
      <section className="nk-still" id="cashback" aria-labelledby="nk-cash">
        <div className="nk-panel">
          <div className="nk-caps nk-lab">
            <span className="nk-who">For your customer</span>
            <span className="nk-labrest">Cashback</span>
          </div>
          <h2 className="nk-h2" id="nk-cash">
            Cashback grows with every order.
          </h2>
          <p className="nk-one">It pays for the next order or comes off a subscription delivery.</p>
          <div className="nk-seg" role="group" aria-label="Show the wallet after">
            {ORDER_LABEL.map((l, i) => (
              <button key={l} type="button" className="nk-sw" aria-pressed={orders === i + 1} onClick={() => setOrders(i + 1)}>
                {l}
              </button>
            ))}
          </div>
          <p className="nk-fine">
            <b className="nk-ex">Example</b> {CURRENCY}
            {CASHBACK_PER_ORDER} back on each order. You set the rate.
          </p>
        </div>
        <div className="nk-phonecol">
          <Phone step={7} t={1} theme={skin} scratched brand={brand} orders={orders} />
        </div>
      </section>

      <section className="nk-still" id="levels" aria-labelledby="nk-lvl">
        <div className="nk-panel">
          <div className="nk-caps nk-lab">
            <span className="nk-who">For your customer</span>
            <span className="nk-labrest">Points and levels</span>
          </div>
          <h2 className="nk-h2" id="nk-lvl">
            Points every day. Levels that never drop.
          </h2>
          <p className="nk-one">Each scratched card adds points, and a missed day never costs a level.</p>
          <div className="nk-seg">
            <button
              type="button"
              className="nk-sw"
              onClick={() => {
                setPts((v) => v + PTS_PER_DAY)
                setKept(false)
              }}
            >
              Scratch a day +{PTS_PER_DAY}
            </button>
            <button type="button" className="nk-sw" onClick={() => setKept(true)}>
              Skip a day
            </button>
          </div>
          <p className="nk-fine" aria-live="polite">
            <b className="nk-ex">Example</b> {pts} points · {level ? `${level.name} level` : 'no level yet'}
            {kept ? ' · kept after a skipped day' : ''}. Levels at {LEVELS.map((l) => l.at).join(', ')} points; you set them.
          </p>
        </div>
        <div className="nk-phonecol">
          <Phone step={8} t={1} theme={skin} scratched brand={brand} pts={pts} kept={kept} />
        </div>
      </section>

      <section className="nk-still nk-flip" id="exchange" aria-labelledby="nk-xch">
        <div className="nk-panel">
          <div className="nk-caps nk-lab">
            <span className="nk-who">For you</span>
            <span className="nk-labrest">Points to cashback</span>
          </div>
          <h2 className="nk-h2" id="nk-xch">
            You set what the programme costs.
          </h2>
          <p className="nk-one">Move the rate and the customer&rsquo;s app shows it at once.</p>
          <div className="nk-desk2">
            <div className="nk-caps nk-deskh">
              <span>{brand} · brand panel</span>
              <b className="nk-ex">Example</b>
            </div>
            <label className="nk-rate" htmlFor="nk-rate">
              <span>Points for {CURRENCY}1 of cashback</span>
              <output htmlFor="nk-rate">{rate}</output>
            </label>
            <input
              id="nk-rate"
              className="nk-slider"
              type="range"
              min={50}
              max={200}
              step={10}
              value={rate}
              aria-valuetext={`${rate} points for ${CURRENCY}1 of cashback`}
              onChange={(e) => setRate(Number(e.currentTarget.value))}
            />
            <div className="nk-ends" aria-hidden="true">
              <span>50 · richer for customers</span>
              <span>200 · cheaper for you</span>
            </div>
            <p className="nk-cost" aria-live="polite">
              A month of daily cards costs you <b>{CURRENCY}{monthCost}</b> per customer.
            </p>
          </div>
        </div>
        <div className="nk-phonecol">
          <Phone step={9} t={1} theme={skin} scratched brand={brand} rate={rate} />
        </div>
      </section>
    </div>
  )
}

/* ── runda 4 (d–f): sciezka wiedzy z prezentem, zakup w aptece, prywatnosc od projektu ── */
/* Ten sam uklad „nk-still”. Stan domyslny (bez JS, reduced-motion) jest kompletny: sciezka w polowie z widocznym
   prezentem na mecie, zakup potwierdzony, funkcje zablokowane z przyciskiem. */
function MoreScenes({ skin, brand }: { skin: Skin; brand: string }) {
  const [lesson, setLesson] = useState(3)
  const [scanN, setScanN] = useState(0)
  const [bought, setBought] = useState(true)
  const [consent, setConsent] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const scan = () => {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.clearTimeout(timer.current)
    setBought(false)
    setScanN((n) => n + 1)
    timer.current = window.setTimeout(() => setBought(true), still ? 0 : 1300)
  }
  const done = lesson >= LESSONS

  return (
    <div className="nk-r4" id="more">
      <section className="nk-still" id="paths" aria-labelledby="nk-path">
        <div className="nk-panel">
          <div className="nk-caps nk-lab">
            <span className="nk-who">For you</span>
            <span className="nk-labrest">Learning paths</span>
          </div>
          <h2 className="nk-h2" id="nk-path">
            A second product, earned in five short lessons.
          </h2>
          <p className="nk-one">When the path is done, a gift code adds a matching product to the next order.</p>
          <div className="nk-seg">
            <button
              type="button"
              className="nk-sw"
              onClick={() => setLesson((v) => (v >= LESSONS ? 1 : v + 1))}
            >
              {done ? 'Start again' : 'Next lesson'}
            </button>
          </div>
          <p className="nk-fine" aria-live="polite">
            <b className="nk-ex">Example</b> Lesson {Math.min(lesson + (done ? 0 : 1), LESSONS)} of {LESSONS}
            {done ? ' · gift code ready' : ''}. You pick the lessons and the gift.
          </p>
        </div>
        <div className="nk-phonecol">
          <Phone step={10} t={1} theme={skin} scratched brand={brand} lesson={lesson} />
        </div>
      </section>

      <section className="nk-still nk-flip" id="pharmacy" aria-labelledby="nk-pharm">
        <div className="nk-panel">
          <div className="nk-caps nk-lab">
            <span className="nk-who">For you</span>
            <span className="nk-labrest">Pharmacy purchases</span>
          </div>
          <h2 className="nk-h2" id="nk-pharm">
            Pharmacy buyers show up in your data after one scan.
          </h2>
          <p className="nk-one">A pack bought offline starts the daily card, just like an online order.</p>
          <div className="nk-seg">
            <button type="button" className="nk-sw" onClick={scan}>
              Scan the box
            </button>
          </div>
          <p className="nk-fine" aria-live="polite">
            <b className="nk-ex">Example</b> {bought ? 'Pack registered · bought offline.' : 'Scanning the box code…'} The box code
            registers the pack; a receipt confirms where it was bought.
          </p>
        </div>
        <div className="nk-phonecol">
          <Phone step={11} t={1} theme={skin} scratched brand={brand} scanN={scanN} bought={bought} />
        </div>
      </section>

      <section className="nk-still" id="privacy" aria-labelledby="nk-priv">
        <div className="nk-panel">
          <div className="nk-caps nk-lab">
            <span className="nk-who">For you</span>
            <span className="nk-labrest">Privacy</span>
          </div>
          <h2 className="nk-h2" id="nk-priv">
            Health data never reaches your marketing.
          </h2>
          <p className="nk-one">Without consent, the daily card and streak stay visible but locked, with one button to turn them on.</p>
          <div className="nk-seg" role="group" aria-label="Show the app">
            <button type="button" className="nk-sw" aria-pressed={!consent} onClick={() => setConsent(false)}>
              Without consent
            </button>
            <button type="button" className="nk-sw" aria-pressed={consent} onClick={() => setConsent(true)}>
              With consent
            </button>
          </div>
          <p className="nk-fine" aria-live="polite">
            <b className="nk-ex">Example</b> {consent ? 'Daily card and streak on.' : 'Daily card and streak locked.'} A tick is stored as a date,
            never sent to ads, analytics or push messages.
          </p>
        </div>
        <div className="nk-phonecol">
          <Phone step={12} t={1} theme={skin} scratched brand={brand} consent={consent} onUnlock={() => setConsent(true)} />
        </div>
      </section>
    </div>
  )
}

/* ── runda 4 (g, h): dowod wynikow z grupa kontrolna, pas integracji ── */
/* WSZYSTKIE liczby i krzywe ponizej to przyklad (znaczek „Example” przy samym rysunku), nie wynik zadnej marki.
   Krzywe: udzial klientow, ktorzy nadal zamawiaja, miesiac 0–6. Bez procentow w tresci. */
const CROWD = 24
const LIFT_APP = [1, 0.82, 0.7, 0.62, 0.56, 0.52, 0.49]
const LIFT_CTRL = [1, 0.74, 0.58, 0.48, 0.41, 0.36, 0.33]
/* zakres niepewnosci maleje z pierwiastkiem z liczebnosci grupy (przyklad, stala dobrana do rysunku) */
const SPREAD = 0.18
/* dzien, w ktorym skonczylo sie opakowanie (ostatni ptaszek przed nastepnym), liczba telefonow na dzien */
const RUNOUT: [number, number][] = [
  [26, 1], [27, 1], [28, 2], [29, 3], [30, 5], [31, 7], [32, 9], [33, 8], [34, 6], [35, 4], [36, 3], [37, 2], [38, 1],
]
const RUN_PEAK = RUNOUT.reduce((a, b) => (b[1] > a[1] ? b : a))[0]

const LX = (i: number) => 40 + i * 50
const LY = (v: number) => 12 + (1 - v) * 150
function curve(vals: readonly number[], d = 0) {
  return vals.map((v, i) => `${i ? 'L' : 'M'}${LX(i)} ${LY(clamp(v + d)).toFixed(1)}`).join(' ')
}
function band(vals: readonly number[], w: number) {
  const top = vals.map((v, i) => `${i ? 'L' : 'M'}${LX(i)} ${LY(clamp(v + (i ? w : 0))).toFixed(1)}`).join(' ')
  const bot = [...vals]
    .map((v, i) => [i, v] as const)
    .reverse()
    .map(([i, v]) => `L${LX(i)} ${LY(clamp(v - (i ? w : 0))).toFixed(1)}`)
    .join(' ')
  return `${top} ${bot} Z`
}

const LINKS = [
  { k: 'Store', n: 'Shopify', d: 'Orders confirm a purchase; rewards arrive as single-use codes.' },
  { k: 'Subscriptions', n: 'Subscription apps', d: 'Cashback can come off the next delivery.' },
  { k: 'Loyalty', n: 'Loyalty apps', d: 'Points can sit beside a programme already running.' },
  { k: 'Email and CRM', n: 'Your email tool', d: 'Reorder reminders go out without any health data.' },
  { k: 'App stores', n: 'App Store · Google Play', d: 'The app is listed under your brand name.' },
] as const

function Evidence({ brand }: { brand: string }) {
  const [held, setHeld] = useState(6)
  const wc = SPREAD / Math.sqrt(held)
  const wa = SPREAD / Math.sqrt(CROWD - held)
  const last = LIFT_APP.length - 1
  const apart = LIFT_APP[last] - wa > LIFT_CTRL[last] + wc

  return (
    <div className="nk-r4" id="evidence">
      <section className="nk-still nk-proof" id="proof" aria-labelledby="nk-prf">
        <div className="nk-panel">
          <div className="nk-caps nk-lab">
            <span className="nk-who">For you</span>
            <span className="nk-labrest">Proof of results</span>
          </div>
          <h2 className="nk-h2" id="nk-prf">
            Reorder lift, measured against customers who never get the app.
          </h2>
          <p className="nk-one">A control group goes without the app, so the gap between the two curves is the app&rsquo;s effect.</p>
          <figure className="nk-desk2 nk-lift">
            <figcaption className="nk-caps nk-deskh">
              <span>{brand} · results panel</span>
              <b className="nk-ex">Example</b>
            </figcaption>
            <div className="nk-crowd" aria-hidden="true">
              {Array.from({ length: CROWD }, (_, i) => (
                <i key={i} className={i >= CROWD - held ? 'is-ctrl' : ''} />
              ))}
            </div>
            <label className="nk-rate" htmlFor="nk-held">
              <span>Customers held out as control, out of 24 in this example</span>
              <output htmlFor="nk-held">
                {held} of {CROWD}
              </output>
            </label>
            <input
              id="nk-held"
              className="nk-slider"
              type="range"
              min={2}
              max={12}
              step={1}
              value={held}
              aria-valuetext={`${held} of ${CROWD} customers held out without the app`}
              onChange={(e) => setHeld(Number(e.currentTarget.value))}
            />
            <svg className="nk-plot" viewBox="0 0 360 206" role="img" aria-labelledby="nk-lift-t">
              <title id="nk-lift-t">
                Example chart: customers still reordering over six months, app group above control group.
              </title>
              <line x1="40" y1="162" x2="340" y2="162" className="nk-axis" />
              <path d={band(LIFT_CTRL, wc)} className="nk-band nk-band-c" />
              <path d={band(LIFT_APP, wa)} className="nk-band nk-band-a" />
              <path d={curve(LIFT_CTRL)} className="nk-cv nk-cv-c" />
              <path d={curve(LIFT_APP)} className="nk-cv nk-cv-a" />
              {LIFT_APP.map((_, i) => (
                <text key={i} x={LX(i)} y="182" className="nk-tick">
                  {i === 0 ? 'Start' : i}
                </text>
              ))}
              <text x="190" y="200" className="nk-tick">
                Month
              </text>
              <text x="40" y="8" className="nk-tick nk-tick-l">
                Still reordering
              </text>
            </svg>
            <div className="nk-key" aria-hidden="true">
              <span className="nk-key-a">With the app</span>
              <span className="nk-key-c">Control group</span>
            </div>
            <p className="nk-cost" aria-live="polite">
              {apart ? (
                <>
                  <b>By month six the two bands no longer overlap.</b> That gap is what the app adds.
                </>
              ) : (
                <>
                  <b>Ranges overlap:</b> too few customers held out to tell.
                </>
              )}
            </p>
          </figure>
          <p className="nk-fine">A bigger control group gives a clearer answer; fewer customers get the app meanwhile. You choose the split.</p>
        </div>
        <div className="nk-phonecol">
          <figure className="nk-desk2 nk-runout">
            <figcaption className="nk-caps nk-deskh">
              <span>Real pack length, from daily ticks</span>
              <b className="nk-ex">Example</b>
            </figcaption>
            <svg className="nk-plot" viewBox="0 0 360 210" role="img" aria-labelledby="nk-run-t">
              <title id="nk-run-t">
                {`Example chart: each dot is one customer's last daily tick before the next pack. The label says ${PACK_DAYS} days; most packs last to day ${RUN_PEAK}.`}
              </title>
              <line x1="16" y1="178" x2="344" y2="178" className="nk-axis" />
              <line x1={RX(PACK_DAYS)} y1="14" x2={RX(PACK_DAYS)} y2="178" className="nk-label-line" />
              <text x={RX(PACK_DAYS) - 6} y="22" className="nk-tick nk-tick-r">
                Label: {PACK_DAYS} days
              </text>
              {RUNOUT.flatMap(([day, n]) =>
                Array.from({ length: n }, (_, k) => (
                  <circle key={`${day}-${k}`} cx={RX(day)} cy={170 - k * 17} r="7" className={day === RUN_PEAK ? 'nk-dot is-peak' : 'nk-dot'} />
                )),
              )}
              {RUNOUT.filter(([d]) => d % 2 === 0).map(([d]) => (
                <text key={d} x={RX(d)} y="198" className="nk-tick">
                  {d}
                </text>
              ))}
            </svg>
            <p className="nk-cost">
              Each dot is one customer&rsquo;s last daily tick before the next pack. In this example most packs last to <b>day {RUN_PEAK}</b>, so the
              reorder reminder is set for day {RUN_PEAK}, from totals across customers.
            </p>
          </figure>
        </div>
      </section>

      <section className="nk-still nk-int" id="integrations" aria-labelledby="nk-intg">
        <div className="nk-panel">
          <div className="nk-caps nk-lab">
            <span className="nk-who">For you</span>
            <span className="nk-labrest">Integrations</span>
          </div>
          <h2 className="nk-h2" id="nk-intg">
            Runs on Shopify; your other tools connect per brand.
          </h2>
          <p className="nk-one">
            Rewards arrive as Shopify codes; subscription, loyalty and email tools are matched to your stack. The app is listed in both
            stores under your brand.
          </p>
        </div>
        <ul className="nk-band5">
          {LINKS.map((l) => (
            <li key={l.k}>
              <span className="nk-caps">{l.k}</span>
              <b>{l.n}</b>
              <p>{l.d}</p>
            </li>
          ))}
        </ul>
        <p className="nk-fine nk-int-fine">
          Which app in each category connects to your store is mapped in the first call.{' '}
          <a className="nk-link" href="#enquiry">
            Ask which apps connect to your store →
          </a>
        </p>
      </section>
    </div>
  )
}
function RX(day: number) {
  return 16 + ((day - 25) / 14) * 328
}

/* ── runda 4 (j): FAQ kupujacego, natywne <details> (klawiatura i bez JS za darmo) ── */
function Faq() {
  return (
    <section className="nk-faq" id="faq" aria-labelledby="nk-faq-h">
      <div className="nk-caps nk-lab">
        <span className="nk-who">For you</span>
        <span className="nk-labrest">Questions</span>
      </div>
      <h2 className="nk-h2" id="nk-faq-h">
        FAQ: six answers you need before the first call.
      </h2>
      <p className="nk-one">Daily use, health data, reward cost, setup, pharmacy purchases, consent.</p>
      <div className="nk-qs">
        {FAQ.map((f) => (
          <details key={f.q} className="nk-q">
            <summary>
              <span>{f.q}</span>
              <i aria-hidden="true" />
            </summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

/* ── calosc pod pierwszym ekranem: scena, „czego nie robi”, final z formularzem ── */
/* spec 15 A: trzy przelaczniki, ktore marka chcialaby wlaczyc. Kazdy wraca do „off” i mowi dlaczego.
   aria-checked zostaje "false" przez caly czas — przelacznik naprawde nigdy sie nie wlacza. */
const NEVER = [
  { id: 'draw', label: 'Random prize draw', why: 'Stays off: rewards are fixed and shown in advance, never drawn at random.' },
  { id: 'claim', label: 'Add a health claim to a card', why: 'Stays off: the app makes no health claims.' },
  {
    id: 'swap',
    label: 'Swap the reward after scratching',
    why: 'Stays off: a scratched card keeps the reward it showed.',
  },
] as const

function NeverScene({ skin, brand }: { skin: Skin; brand: string }) {
  const [last, setLast] = useState<number | null>(null)
  const [tries, setTries] = useState<number[]>(() => NEVER.map(() => 0))
  const press = (i: number) => {
    setLast(i)
    setTries((t) => t.map((n, k) => (k === i ? n + 1 : n)))
  }
  return (
    <section className="nk-still nk-never" id="never" aria-labelledby="nk-never">
      <div className="nk-panel">
        <div className="nk-caps nk-lab">
          <span className="nk-who">For you</span>
          <span className="nk-labrest">What it never does</span>
        </div>
        <h2 className="nk-h2" id="nk-never">
          Nothing a regulator or customer could hold against your brand.
        </h2>
        <p className="nk-one">Try a switch: it turns back off and the panel says why.</p>
        <div className="nk-desk2 nk-nv">
          <div className="nk-caps nk-deskh">
            <span>{brand} · brand panel</span>
            <b className="nk-ex">Example</b>
          </div>
          <ul className="nk-nv-list">
            {NEVER.map((n, i) => (
              <li key={n.id}>
                <span id={'nk-nv-' + n.id}>{n.label}</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked="false"
                  aria-labelledby={'nk-nv-' + n.id}
                  aria-describedby="nk-nv-why"
                  className="nk-tg"
                  onClick={() => press(i)}
                >
                  <i key={tries[i]} className={tries[i] ? 'is-try' : undefined} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
          <p className="nk-nv-why" id="nk-nv-why" aria-live="polite">
            {last === null ? 'All three are off.' : NEVER[last].why}
          </p>
        </div>
        <p className="nk-fine nk-nv-end">Each tick stores only the date. Health data never reaches ads, analytics, push or email.</p>
      </div>
      <div className="nk-phonecol">
        <Phone step={4} t={1} theme={skin} scratched brand={brand} day={17} />
      </div>
    </section>
  )
}

function brandFrom(raw: string) {
  const m = raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .split(/[/?#:\s]/)[0]
    .split('.')
    .filter((l, i, all) => !(i < all.length - 1 && /^(www|shop|store|sklep|m)$/.test(l)))[0]
    ?.replace(/[^a-z0-9-]/g, '')
    .slice(0, 12)
  return m ? m[0].toUpperCase() + m.slice(1) : ''
}

/* ── spec 13 (k): final „See it with your brand” — kolor marki przemalowuje telefon i akcent sekcji ── */
/* Kolor zostaje na stronie: nie jest polem formularza i nie idzie do /api/lead. */
const BRAND_COLS = [
  { id: 'red', name: 'Signal red', hex: '#D6202B' },
  { id: 'green', name: 'Forest green', hex: '#1F6B4A' },
  { id: 'blue', name: 'Ocean blue', hex: '#1D5FA8' },
  { id: 'plum', name: 'Plum', hex: '#7A2E8C' },
  { id: 'amber', name: 'Amber', hex: '#E8A317' },
  { id: 'teal', name: 'Teal', hex: '#0F7C80' },
] as const
const PHONE_BG: Record<Skin, string> = { paper: '#F7F5F0', night: '#14161A', clay: '#EFE6DA' }

function rgbOf(hex: string): [number, number, number] {
  const h = /^#?([0-9a-f]{6})$/i.exec(hex.trim())?.[1] ?? 'D6202B'
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number]
}
function lum([r, g, b]: [number, number, number]) {
  const f = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}
function contrast(a: string, b: string) {
  const [x, y] = [lum(rgbOf(a)), lum(rgbOf(b))].sort((m, n) => n - m)
  return (x + 0.05) / (y + 0.05)
}
const hexOf = (c: number[]) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')
/* Tekst na kolorze marki: czarny albo bialy, ktory ma wyzszy kontrast (zawsze >= 4,58:1). */
function onColour(hex: string) {
  return contrast(hex, '#FFFFFF') >= contrast(hex, '#000000') ? '#FFFFFF' : '#000000'
}
/* Kolor marki jako tekst na tle telefonu: przyciemniany (albo rozjasniany na Night), az da >= 4,5:1. */
function inkOn(hex: string, bg: string) {
  const c = rgbOf(hex)
  const to = lum(rgbOf(bg)) > 0.4 ? 0 : 255
  for (let k = 0; k <= 1.0001; k += 0.04) {
    const m = hexOf(c.map((v) => v + (to - v) * k))
    if (contrast(m, bg) >= 4.5) return m
  }
  return to ? '#FFFFFF' : '#000000'
}

function BrandColour({ value, onPick }: { value: string; onPick: (hex: string) => void }) {
  const preset = BRAND_COLS.find((c) => c.hex.toLowerCase() === value.toLowerCase())
  return (
    <fieldset className="nk-bcol">
      <legend className="nk-caps">Brand colour</legend>
      <div className="nk-bcol-row">
        {BRAND_COLS.map((c) => (
          <label key={c.id} className="nk-bcol-sw" title={c.name}>
            <input
              type="radio"
              name="nk-brand-colour"
              value={c.hex}
              aria-label={c.name}
              checked={preset?.id === c.id}
              onChange={() => onPick(c.hex)}
            />
            <i style={{ background: c.hex }} aria-hidden="true" />
          </label>
        ))}
        <label className="nk-bcol-own">
          <input type="color" value={value} aria-label="Your own colour" onChange={(e) => onPick(e.currentTarget.value)} />
          <span>Your own</span>
        </label>
      </div>
    </fieldset>
  )
}

export function Story() {
  const root = useRef<HTMLDivElement>(null)
  const [colour, setColour] = useState<string>(BRAND_COLS[0].hex)
  const [skin, setSkin] = useState<Skin>('paper')
  const [store, setStore] = useState('')
  const [name, setName] = useState('')

  useEffect(() => {
    const host = root.current?.closest<HTMLElement>('.nk')
    if (!host) return
    if (skin === 'paper') delete host.dataset.skin
    else host.dataset.skin = skin
  }, [skin])

  const typed = brandFrom(store)

  return (
    <div ref={root}>
      <Scene skin={skin} onSkin={setSkin} name={name} onName={setName} />
      <p className="nk-demo nk-demo-after">
        {DEMO_BRAND} is a made-up demo brand, not a client.
      </p>

      <Loyalty skin={skin} brand={name.trim().slice(0, 14) || DEMO_BRAND} />
      <MoreScenes skin={skin} brand={name.trim().slice(0, 14) || DEMO_BRAND} />
      <Evidence brand={name.trim().slice(0, 14) || DEMO_BRAND} />

      <NeverScene skin={skin} brand={name.trim().slice(0, 14) || DEMO_BRAND} />

      <Faq />

      <section
        className="nk-final"
        id="enquiry"
        aria-labelledby="nk-ask"
        style={{
          ['--brand' as string]: colour,
          ['--brand-on' as string]: onColour(colour),
          ['--brand-ink' as string]: inkOn(colour, PHONE_BG[skin]),
        }}
      >
        <div className="nk-final-copy">
          <div className="nk-caps nk-lab">
            <span className="nk-brandtag">See it with your brand</span>
          </div>
          <h2 className="nk-h2" id="nk-ask">
            Your customers&apos; daily app, in your brand colour.
          </h2>
          <p className="nk-one">Type your store name, pick its colour; the phone repaints live.</p>
          <BrandColour value={colour} onPick={setColour} />
          <p className="nk-fine">Your colour is never sent. Only the form fields go with Send.</p>
        </div>
        <div className="nk-phonecol nk-final-phone">
          <Phone step={3} t={1} theme={skin} scratched brand={typed || name.trim().slice(0, 14) || 'Your brand'} />
          <p className="nk-fine">
            {typed
              ? 'Your typed name, shown only on this page.'
              : 'A placeholder until you type your store name.'}
          </p>
        </div>
        <div className="nk-final-form">
          <Enquiry onStore={setStore} />
        </div>
      </section>
    </div>
  )
}
