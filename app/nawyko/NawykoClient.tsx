'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Enquiry, NextSteps, QuickEnquiry } from './Enquiry'
import { FAQ, NK_CHAPTERS } from './content'
import { DEMO_BRAND, contrast, inkOn, mix, monogram, onColour, useBrand } from '../lib/brand-engine'
import './cockpit-scroll.css'
import './step-pin.css'
import { useStepPin } from './step-pin'

/* Enquiry mieszka w ./Enquiry (przebieg 4): /work/genactiv importuje sam formularz, bez calej sceny. */
export { Enquiry }

/* Pokaz Nawyko na ZMYSLONEJ marce. Nazwa sprawdzona w sieci 21.11.2026
   (agencja/research/marka-pokazowa.md) — to nie jest klient ani realna firma. */
/* DEMO_BRAND mieszka w app/lib/brand-engine.ts (silnik marki, spec 26). */

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
function Scratch({ gone, onDone, auto, foil }: { gone: boolean; onDone: () => void; auto?: boolean; foil?: string }) {
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
    if (foil) {
      /* Spec 26: folia w kolorze marki — metaliczny gradient z odblaskiem. */
      const lg = g.createLinearGradient(0, 0, c.width, c.height)
      lg.addColorStop(0, mix(foil, '#FFFFFF', 0.35))
      lg.addColorStop(0.45, foil)
      lg.addColorStop(0.55, mix(foil, '#FFFFFF', 0.5))
      lg.addColorStop(1, mix(foil, '#000000', 0.3))
      g.fillStyle = lg
    } else g.fillStyle = '#C9C7C0'
    g.fillRect(0, 0, c.width, c.height)
    g.strokeStyle = foil ? 'rgba(255,255,255,.16)' : '#B4B2AB'
    g.lineWidth = dpr
    for (let x = -c.height; x < c.width; x += 7 * dpr) {
      g.beginPath()
      g.moveTo(x, 0)
      g.lineTo(x + c.height, c.height)
      g.stroke()
    }
    g.fillStyle = foil ? onColour(foil) : '#14161A'
    g.font = `600 ${Math.round(11 * dpr)}px "NK Instrument Sans", "Instrument Sans", system-ui, sans-serif`
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    const label = 'S C R A T C H   H E R E'
    g.fillText(label, c.width / 2, c.height / 2)
  }, [foil])

  /* PILNE 2 pkt 1 (Rafal 28.11): karta wraca po zmianie marki — nowa folia, zdrapka znow reaguje na przeciaganie. */
  const wasGone = useRef(gone)
  useEffect(() => {
    if (wasGone.current && !gone) {
      userTook.current = false
      last.current = null
      moves.current = 0
      paint()
    }
    wasGone.current = gone
  }, [gone, paint])

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
      /* PILNE 2 pkt 1: pelne krycie pedzla — paint() zostawia strokeStyle prazkow folii (alfa .16), a destination-out
         z alfa .16 zdejmowal tylko 16 % folii: karta w kolorze marki nie dawala sie zdrapac do konca. */
      g.strokeStyle = '#000'
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
    g.strokeStyle = '#000'
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
  brand,
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
  brand: string
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
  // R6' q5 A: licznik liniowo przez caly czas animacji, ostatnia wartosc (34) dopiero przy t = 1
  const took =
    step === 5 && t < 1
      ? PACK_DAYS + Math.min(FINISH_DAYS - PACK_DAYS - 1, Math.floor((FINISH_DAYS - PACK_DAYS) * clamp(t)))
      : FINISH_DAYS
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
          <span>Sample data</span>
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
  const shown = t >= 1 ? DIST_TOTAL : Math.round((DIST_TOTAL - 1) * clamp((t - 0.25) / 0.55))
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

/* ── styl strony (spec 36 A): wybierany w konfiguratorze hero, przemalowuje cala strone i kazdy telefon ──
   Hero i Story to rodzenstwo w page.tsx, wiec styl zyje we wspolnym malym magazynie (jak nazwa i kolor marki),
   nie w stanie Story. Nie jest zapisywany ani wysylany. */
type Skin = 'paper' | 'night' | 'clay'
const SKINS: { id: Skin; name: string; sw: string; on: string }[] = [
  { id: 'paper', name: 'Paper', sw: '#F7F5F0', on: '#14161A' },
  { id: 'night', name: 'Night', sw: '#14161A', on: '#F2F0EA' },
  { id: 'clay', name: 'Clay', sw: '#EFE6DA', on: '#2A201A' },
]
let skinNow: Skin = 'paper'
const skinSubs = new Set<() => void>()
const skinSub = (f: () => void) => {
  skinSubs.add(f)
  return () => {
    skinSubs.delete(f)
  }
}
const skinSnap = () => skinNow
const skinServer = (): Skin => 'paper'
function setSkin(v: Skin) {
  if (v === skinNow) return
  skinNow = v
  skinSubs.forEach((f) => f())
}
function useSkin() {
  return useSyncExternalStore(skinSub, skinSnap, skinServer)
}

/* Grupa stylu w hero: natywne radio (strzalki zmieniaja wybor, Tab wchodzi raz), role="radiogroup" z widoczna etykieta. */
function SkinPick() {
  const skin = useSkin()
  return (
    <fieldset className="nk-bcol nk-skins" role="radiogroup" aria-labelledby="nk-skins-lab">
      <legend className="nk-caps" id="nk-skins-lab">
        Page style
      </legend>
      <div className="nk-skins-row">
        {SKINS.map((s) => (
          <label key={s.id} className="nk-skin" style={{ ['--tile' as string]: s.sw, ['--tile-on' as string]: s.on }}>
            <input type="radio" name="nk-skin" value={s.id} checked={skin === s.id} onChange={() => setSkin(s.id)} />
            <span>{s.name}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

/* ── scena przypieta do przewijania ──────────────────────────────────────── */
/* Spec 36 A: akt 7 „Your branding” usuniety — wybor marki i stylu jest tylko w hero.
   R6' q3 B: akt 6 „Pack rhythm” (widok marki „See the day each pack really runs out.”) przeniesiony do kokpitu jako szosta zakladka. */
const ACTS = 5
/* Akt zdrapki trwa dluzej niz inne: to najwazniejszy moment strony. */
const ACT_W = [1, 1.9, 1, 1, 1]
const ACT_AT = ACT_W.map((_, i) => ACT_W.slice(0, i).reduce((a, b) => a + b, 0))
const ACT_TOT = ACT_W.reduce((a, b) => a + b, 0)
const ACT_NAMES = ['Purchase', 'Daily card', 'Streak', 'Reward', 'Reward calendar'] as const

/* PILNE 2 pkt 1 (Rafal 28.11.2026): po zmianie nazwy, koloru albo stylu marki karta dnia jest znowu do zdrapania
   (nowa karta w nowej marce), a „Reveal without scratching” znowu ja odslania. Wczesniej raz odslonieta karta zostawala
   odslonieta, a przycisk martwy. Zmiana stanu w czasie renderu (wzorzec React „adjusting state when a prop changes”). */
function useBrandChanged(): boolean {
  const { name, colour } = useBrand()
  const skin = useSkin()
  const key = `${name.trim()}|${colour}|${skin}`
  const [seen, setSeen] = useState(key)
  if (seen !== key) {
    setSeen(key)
    return true
  }
  return false
}

function Scene({ skin }: { skin: Skin }) {
  const { brand, own } = useBrand()
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
  const brandChanged = useBrandChanged()
  if (brandChanged && scratched) setScratched(false)

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
  /* R6' q4 B: po przeniesieniu aktu 6 do kokpitu scena ma jeden rozdzial — przejazd telefonu (--sw, data-ch, data-swung)
     usuniety. SW_LEN zostaje jako opoznienie wejscia tekstu aktu (bez zmiany zachowania). */
  const SW_LEN = 0.45
  const local = x - ACT_AT[step]
  const inK = ease(step === 4 ? clamp(local / 0.12) : clamp((local - SW_LEN + 0.06) / 0.2))
  // Zdrapka: jesli odwiedzajacy nie zdrapie sam w ok. 1,5 s od wejscia w akt, karta zdrapuje sie sama.
  // Kto przewija szybko (polowa aktu), dostaje animacje od razu.
  const [autoS, setAutoS] = useState(false)
  if (brandChanged && autoS) setAutoS(false)
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

  // Pozycja przewijania, w ktorej akt i jest aktywny — odwrotnosc mapowania przewijanie -> akt z read() (p * ACT_TOT).
  const actTop = (i: number) => {
    const el = wrap.current
    if (!el) return null
    const top = el.getBoundingClientRect().top + window.scrollY
    const total = el.offsetHeight - window.innerHeight
    return top + (total * (ACT_AT[i] + (i === 1 ? 0.25 : 0.6) * ACT_W[i])) / ACT_TOT
  }
  const go = (i: number) => {
    if (!scroll) {
      setManual(i)
      return
    }
    const el = wrap.current
    const y = actTop(i)
    if (!el || y === null) return
    window.scrollTo({ top: y, behavior: 'smooth' })
    if (i === 1) setHold('pending')
    // Akty 5–6: po dojechaniu fokus trafia do kontrolki aktu (os dni, link), zeby byla osiagalna z klawiatury.
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

  /* Spec 26 A2 (WCAG 2.4.3/2.4.7/2.4.11): Tab na kroku N przewija scene do pozycji, w ktorej krok N jest aktywny —
     inaczej fokus stal na „04”, a opis i telefon zostawaly na 01 (przewijanie przypietej sceny nie rusza sie, bo
     przycisk juz jest w oknie). Tylko fokus z klawiatury (:focus-visible): klik mysza i dotyk bez zmian. Bez
     przenoszenia fokusu i bez samozdrapki (timer zdrapki i tak czeka, gdy fokus z klawiatury jest w scenie). */
  const onStepFocus = (i: number, b: HTMLElement) => {
    if (!scroll || i === step || !b.matches(':focus-visible')) return
    const y = actTop(i)
    if (y === null) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' })
  }

  const steps = (
    <div className="nk-in">
      <div className="nk-caps nk-lab">
        <span className="nk-who">For your customer</span>
        <span className="nk-labrest">{own ? 'How it works · sample data' : 'How it works · made-up brand'}</span>
      </div>
      <h2 className="nk-h2">Four steps that bring the customer back for the next pack.</h2>
      <ol className="nk-steps">
        {STEPS.map((s, i) => (
          <li key={s.t} className={'nk-step' + (i === step ? ' is-on' : '')}>
            <button
              type="button"
              className="nk-stepbtn"
              aria-current={i === step ? 'step' : undefined}
              onClick={() => go(i)}
              onFocus={(e) => onStepFocus(i, e.currentTarget)}
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
      <p className="nk-next" hidden={!(scroll && step >= 2)}>
        <a className="nk-link" href="#enquiry">
          Ask how {own ? brand : 'your brand'} gets its own app
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
    >
      <div className="nk-stage">
        <div className="nk-scenehead">
          {!scroll || step < 4 ? steps : null}
          {scroll && step >= 4 ? (
            /* Regula R2 (Chrome „Scrollytelling”): tekst aktu wchodzi wedlug postepu przewijania, nie zegara. */
            <div className="nk-actin" style={{ opacity: inK, transform: `translateY(${(1 - inK) * 18}px)` }}>
              {step === 4 ? <RewardsPanel day={day} onDay={pickDay} id="nk-rewards" /> : null}
            </div>
          ) : null}
          <DemoNote />
        </div>
        <div className="nk-phonecol">
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
        </>
      )}
    </div>
  )
}

/* ── runda 5 p2 cz. 2 (spec 29): portfel — trzy prawdziwe ciemne ekrany aplikacji w jednej sekcji (bento) ──
   Zastepuje trzy sceny „tekst + telefon obok”. Powierzchnia: gleboki atrament, trzeci kafel w kolorze marki.
   Jeden stan portfela: zamowienia → cashback, dzienne karty → punkty i poziomy, kurs z panelu marki → wartosc punktow.
   Stan domyslny (bez JS, reduced-motion) jest kompletny; kontrolki to zwykle przyciski i natywny suwak. */
const WAL_MAX = 6

/* spec 53 pkt 2: pasek kroków przypiętej sceny — licznik „1 of 3”, podziałka jak .nk-ck-prog, nazwy kroków jako skróty.
   Widoczny tylko w przypiętej scenie (step-pin.css); bez przypięcia wszystkie opcje stoją pod sobą i pasek jest zbędny. */
function StepNav({
  names,
  step,
  go,
  progRef,
  label,
}: {
  names: readonly string[]
  step: number
  go: (i: number) => boolean
  progRef: React.RefObject<HTMLDivElement | null>
  label: string
}) {
  return (
    <nav className="nk-sp-nav" aria-label={label}>
      <span className="nk-sp-count" aria-live="polite">
        {step + 1} of {names.length}
      </span>
      <ol className="nk-sp-steps">
        {names.map((n, i) => (
          <li key={n}>
            <button type="button" aria-current={i === step ? 'step' : undefined} onClick={() => go(i)}>
              {n}
            </button>
          </li>
        ))}
      </ol>
      <div className="nk-sp-prog" ref={progRef} aria-hidden="true">
        {names.map((n, i) => (
          <i key={n} className={i < step ? 'is-past' : i === step ? 'is-on' : ''}>
            <b />
          </i>
        ))}
      </div>
    </nav>
  )
}

const LOY_STEPS = ['Cashback wallet', 'Points and levels', 'Point value'] as const

function Loyalty({ brand }: { skin: Skin; brand: string }) {
  const { colour } = useBrand()
  const [orders, setOrders] = useState(3)
  const [pts, setPts] = useState(240)
  const [kept, setKept] = useState(false)
  const [rate, setRate] = useState(100)
  const [useOn, setUseOn] = useState<'order' | 'delivery'>('order')
  const [coin, setCoin] = useState(0)
  const level = [...LEVELS].reverse().find((l) => pts >= l.at)
  const next = LEVELS.find((l) => pts < l.at)
  const prevAt = level ? level.at : 0
  const toNext = next ? (pts - prevAt) / (next.at - prevAt) : 1
  const monthCost = ((PACK_DAYS * PTS_PER_DAY) / rate).toFixed(2)
  const ptsCash = (pts / rate).toFixed(2)
  const wallet = orders * CASHBACK_PER_ORDER
  const ink = inkOn(colour, '#1B1D21')
  const vars = {
    ['--brand' as string]: colour,
    ['--brand-on' as string]: onColour(colour),
    ['--hi' as string]: ink,
  }
  const order = () => {
    if (orders >= WAL_MAX) {
      setOrders(1)
      return
    }
    setOrders((n) => n + 1)
    setCoin((c) => c + 1)
  }
  const R = 42
  const C = 2 * Math.PI * R
  // spec 53 pkt 2 A: przypięta scena — krok k odsłania kafel k (kumulatywnie, na końcu całe bento; nic nie znika)
  const sp = useStepPin(LOY_STEPS.length)
  const later = (k: number) => (k > sp.step ? ' is-later' : '')

  return (
    <section
      className="nk-wallet nk-sp nk-sp-loy"
      id="loyalty"
      aria-labelledby="nk-wal-h"
      style={vars}
      ref={sp.sec}
      data-pin={sp.pinned ? '' : undefined}
      onFocusCapture={sp.onFocusCapture}
    >
      <div className="nk-sp-pin" ref={sp.pin}>
      <div className="nk-sp-fit" data-sp-fit="">
      <div className="nk-wal-head">
        <div className="nk-caps nk-lab nk-lab-inv">
          <span className="nk-who">For your customer</span>
          <span className="nk-labrest">Rewards in the app</span>
        </div>
        <h2 className="nk-h2" id="nk-wal-h">
          Cashback grows with every <span className="nk-wal-b">{brand}</span> order.
        </h2>
        <p className="nk-one">Two screens from {brand}&rsquo;s app, one from your panel. Tap to try them.</p>
      </div>
      <StepNav names={LOY_STEPS} step={sp.step} go={sp.go} progRef={sp.prog} label="Rewards, step by step" />

      <div className="nk-bento">
        <article className={'nk-tile nk-tile-cash' + later(0)} id="cashback" aria-labelledby="nk-cash" data-sp-step="0">
          <div className="nk-thead">
            <span className="nk-hmono" aria-hidden="true">
              {monogram(brand)}
            </span>
            <span className="nk-hname">{brand}</span>
            <span className="nk-hpill">Sample data</span>
          </div>
          <h3 className="nk-tk" id="nk-cash">
            Cashback wallet
          </h3>
          <div className="nk-wbig" aria-live="polite">
            <b key={coin} className={coin ? 'is-up' : ''}>
              {CURRENCY}
              {wallet.toFixed(2)}
            </b>
            <span>
              {useOn === 'order' ? 'off the next one-off order' : 'off the next subscription delivery'} · earned in {orders}{' '}
              {orders === 1 ? 'order' : 'orders'}
            </span>
          </div>
          <ol className="nk-wrows" role="img" aria-label={`${orders} of ${WAL_MAX} orders placed`}>
            {Array.from({ length: WAL_MAX }, (_, i) => (
              <li key={i} className={i < orders ? 'is-got' : ''}>
                <i />
              </li>
            ))}
          </ol>
          <div className="nk-tacts">
            <button type="button" className="nk-tbtn nk-tbtn-pri" onClick={order}>
              {orders >= WAL_MAX ? 'Start again' : `Place order ${orders + 1}`}
            </button>
          </div>
          <div className="nk-tseg" role="group" aria-label="Spend the cashback">
            <button type="button" aria-pressed={useOn === 'order'} onClick={() => setUseOn('order')}>
              One-off order
            </button>
            <button type="button" aria-pressed={useOn === 'delivery'} onClick={() => setUseOn('delivery')}>
              Subscription
            </button>
          </div>
          <p className="nk-tfine">
            <b className="nk-tex">Example</b> {CURRENCY}
            {CASHBACK_PER_ORDER} back per order. You set the rate.
          </p>
        </article>

        <article className={'nk-tile nk-tile-pts' + later(1)} id="levels" aria-labelledby="nk-lvl" data-sp-step="1">
          <h3 className="nk-tk" id="nk-lvl">
            Points and levels
          </h3>
          <div className="nk-pring">
            <svg viewBox="0 0 100 100" aria-hidden="true">
              <circle cx="50" cy="50" r={R} className="nk-pring-bg" />
              <circle
                cx="50"
                cy="50"
                r={R}
                className="nk-pring-fg"
                style={{ strokeDasharray: C, strokeDashoffset: C * (1 - toNext) }}
              />
            </svg>
            <div className="nk-pring-in" aria-live="polite">
              <b>{pts}</b>
              <span>points</span>
            </div>
          </div>
          <ul className="nk-hexes" aria-label="Levels">
            {LEVELS.map((l) => (
              <li key={l.name} className={pts >= l.at ? 'is-got' : ''}>
                <i aria-hidden="true">{l.name[0]}</i>
                <span>
                  {l.name} <small>{l.at}</small>
                </span>
              </li>
            ))}
          </ul>
          <div className="nk-tacts">
            <button
              type="button"
              className="nk-tbtn nk-tbtn-pri"
              onClick={() => {
                setPts((v) => v + PTS_PER_DAY)
                setKept(false)
              }}
            >
              Scratch today +{PTS_PER_DAY}
            </button>
            <button type="button" className="nk-tbtn" onClick={() => setKept(true)}>
              Skip a day
            </button>
          </div>
          <p className="nk-tfine" aria-live="polite">
            <b className="nk-tex">Example</b>{' '}
            {kept ? 'Day skipped. Level kept.' : next ? `${next.at - pts} points to ${next.name}.` : 'Top level reached.'} {pts} points = {CURRENCY}
            {ptsCash} at {brand}&rsquo;s rate.
          </p>
        </article>

        <article className={'nk-tile nk-tile-rate' + later(2)} id="exchange" aria-labelledby="nk-xch" data-sp-step="2">
          <div className="nk-rate-copy">
            <div className="nk-caps nk-rate-lab">For you · {brand} brand panel</div>
            <h3 className="nk-rate-h" id="nk-xch">
              You set what each point is worth.
            </h3>
            <p className="nk-rate-one">Move the rate. The customer&rsquo;s points change value at once.</p>
          </div>
          <div className="nk-rate-ctl">
            <label className="nk-rate" htmlFor="nk-rate">
              <span>Points for {CURRENCY}1 of cashback</span>
              <output htmlFor="nk-rate">{rate}</output>
            </label>
            <input
              id="nk-rate"
              className="nk-slider nk-slider-inv"
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
              <b className="nk-tex">Example</b> {pts} points now = <b>{CURRENCY}{ptsCash}</b>. A month of daily cards: <b>{CURRENCY}{monthCost}</b> in points per customer.
            </p>
          </div>
        </article>
      </div>
      </div>
      </div>
    </section>
  )
}

/* ── runda 4 (d–f): sciezka wiedzy z prezentem, zakup w aptece, prywatnosc od projektu ── */
/* Ten sam uklad „nk-still”. Stan domyslny (bez JS, reduced-motion) jest kompletny: sciezka w polowie z widocznym
   prezentem na mecie, zakup potwierdzony, funkcje zablokowane z przyciskiem. */
function MoreScenes({ brand, panel }: { brand: string; panel: PanelOf }) {
  const [lesson, setLesson] = useState(3)
  const [scanN, setScanN] = useState(0)
  const [bought, setBought] = useState(false)
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

  const shown = Math.min(lesson, LESSONS)

  return (
    <>
      {/* spec 30: poziomy pas lekcji (papier) — bez telefonu; karty lekcji wygladaja jak karty aplikacji */}
      <section className="nk-paths" id="paths" {...panel('paths')}>
        <div className="nk-pathhead">
          <div className="nk-caps nk-lab">
            <span className="nk-who">For you</span>
            <span className="nk-labrest">Learning paths</span>
          </div>
          <h2 className="nk-h2" id="nk-path">
            A second product, earned in five short lessons.
          </h2>
          <p className="nk-one">When the path is done, a gift code adds a matching product to the next order.</p>
        </div>
        <div className="nk-rail" aria-hidden="true">
          <i style={{ transform: `scaleX(${shown / LESSONS})` }} />
        </div>
        <ol className="nk-lessons" aria-label={`${brand} learning path`}>
          {Array.from({ length: LESSONS }, (_, i) => {
            const st = i < shown ? 'is-got' : i === shown ? 'is-now' : ''
            return (
              <li key={i} className={st}>
                <button
                  type="button"
                  className="nk-lcard"
                  aria-pressed={i < shown}
                  onClick={() => setLesson(i < shown && i === shown - 1 ? i : i + 1)}
                >
                  <span className="nk-lmono" aria-hidden="true">
                    {i < shown ? '✓' : i + 1}
                  </span>
                  <span className="nk-lname">Lesson {i + 1}</span>
                  <span className="nk-lst">{i < shown ? 'Done' : i === shown ? 'Up next' : 'Later'}</span>
                </button>
              </li>
            )
          })}
          <li className={'nk-lgift' + (done ? ' is-on' : '')}>
            <span className="nk-lmono" aria-hidden="true">
              {monogram(brand)}
            </span>
            <b>{done ? 'Gift code ready' : 'Gift at the finish'}</b>
            <span>Free product on the next {brand} order.</span>
          </li>
        </ol>
        <p className="nk-fine" aria-live="polite">
          <b className="nk-ex">Example</b> {done ? 'All lessons done · gift code ready' : `Lesson ${shown} of ${LESSONS} done`}. Tap a lesson. {brand} picks
          the lessons and gift.
        </p>
      </section>

      {/* spec 30: pelnoekranowe przejecie w kolorze marki — telefon na srodku, dwa zrodla zakupu po bokach */}
      <section className="nk-pharm" id="pharmacy" {...panel('pharmacy')}>
        <div className="nk-pharmhead">
          <div className="nk-caps nk-lab">
            <span className="nk-who">For you</span>
            <span className="nk-labrest">Pharmacy purchases</span>
          </div>
          <h2 className="nk-h2" id="nk-pharm">
            Pharmacy buyers show up in your data after one scan.
          </h2>
          <p className="nk-one">A pack bought offline starts the daily card, just like an online order.</p>
        </div>
        <div className="nk-pharmstage">
          <div className="nk-src">
            <span>Bought online</span>
            <b>Added automatically</b>
          </div>
          <div className="nk-phonecol">
            <Phone step={11} t={1} theme="night" scratched brand={brand} scanN={scanN} bought={bought} />
          </div>
          <div className={'nk-src' + (bought ? ' is-on' : '')}>
            <span>Bought in a pharmacy</span>
            <b>{bought ? 'Box scanned' : scanN > 0 ? 'Scanning…' : 'Not scanned yet'}</b>
          </div>
        </div>
        <div className="nk-pharmfoot">
          <button type="button" className="nk-scanbtn" onClick={scan}>
            Scan the box
          </button>
          <p className="nk-fine" aria-live="polite">
            <b className="nk-ex">Example</b> {bought ? 'Pack registered · bought offline.' : scanN > 0 ? 'Scanning the box code…' : 'Tap “Scan the box”.'} The box code
            registers the pack; a receipt confirms where it was bought.
          </p>
        </div>
      </section>

      {/* spec 30: wielkie zdanie typograficzne w atramencie; pod nim przelacznik, zapis danych i telefon w trzech kolumnach */}
      <section className="nk-priv" id="privacy" {...panel('privacy')}>
        <div className="nk-caps nk-lab">
          <span className="nk-who">For you</span>
          <span className="nk-labrest">Privacy</span>
        </div>
        <h2 className="nk-privbig" id="nk-priv">
          Health data never reaches your marketing.
        </h2>
        <div className="nk-privrow">
          <div className="nk-privctl">
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
              <b className="nk-ex">Example</b> {consent ? 'Daily card and streak on.' : 'Daily card and streak locked.'}
            </p>
          </div>
          <dl className={'nk-ledger' + (consent ? ' is-on' : '')}>
            <div>
              <dt>Stored</dt>
              <dd>{consent ? 'Tick date only.' : 'Nothing.'}</dd>
            </div>
            <div>
              <dt>Never sent to</dt>
              <dd>
                <s>Ads</s> <s>Analytics</s> <s>Push messages</s>
              </dd>
            </div>
          </dl>
          <div className="nk-phonecol">
            <Phone step={12} t={1} theme="night" scratched brand={brand} consent={consent} onUnlock={() => setConsent(true)} />
          </div>
        </div>
      </section>
    </>
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

/* ── R6' (spec 33, przeniesione z agencja/r6p2-odrzucone): #integrations jako „Your store” — gosc wybiera silnik sklepu
   (tekst, bez logo), schemat sklep ↔ adapter ↔ aplikacja. Uczciwie: gotowy jest tylko Shopify; reszta per marka przez adapter.
   Bez liczb i bez terminow. ── */
const ENGINES = [
  { id: 'shopify', n: 'Shopify', a: 'Shopify app: orders in, discount codes out', ready: true },
  { id: 'woo', n: 'WooCommerce', a: 'WooCommerce REST API and webhooks', ready: false },
  { id: 'shoper', n: 'Shoper', a: 'Shoper REST API and webhooks', ready: false },
  { id: 'idosell', n: 'IdoSell', a: 'IdoSell Admin API', ready: false },
  { id: 'presta', n: 'PrestaShop', a: 'PrestaShop Webservice', ready: false },
  { id: 'magento', n: 'Magento / Adobe Commerce', a: 'Adobe Commerce REST API', ready: false },
  { id: 'own', n: 'Custom store', a: 'Your own API and webhooks', ready: false },
] as const

function StoreMap({ brand, pinned, step, go }: { brand: string; pinned: boolean; step: number; go: (i: number) => boolean }) {
  const { colour } = useBrand()
  const [picked, setPick] = useState(0)
  // spec 53 pkt 2 B: w przypiętej scenie silnik wybiera przewijanie; klik pigułki = skrót do jej kroku
  const pick = pinned ? Math.min(step, ENGINES.length - 1) : picked
  const e = ENGINES[pick]
  const vars = {
    ['--brand' as string]: colour,
    ['--brand-on' as string]: onColour(colour),
    ['--hi' as string]: inkOn(colour, '#0E0F12'),
  }
  return (
    <div className="nk-store" style={vars}>
      <div className="nk-store-pick" role="group" aria-label="Your store engine">
        {ENGINES.map((x, i) => (
          <button key={x.id} type="button" className="nk-store-chip" aria-pressed={i === pick} data-sp-step={i} onClick={() => {
            setPick(i)
            go(i)
          }}>
            {x.n}
          </button>
        ))}
      </div>
      <div className="nk-store-map">
        <div className="nk-store-node">
          <small className="nk-caps">Your store</small>
          <b>{e.n}</b>
          <span>Orders, stock and customers stay here.</span>
        </div>
        <div className="nk-store-wire" aria-hidden="true">
          <span>Orders</span>
          <i />
          <span>Codes</span>
        </div>
        <div className="nk-store-node nk-store-ad" aria-live="polite">
          <small className="nk-caps">Adapter</small>
          <b>{e.a}</b>
          <span className={'nk-store-pill' + (e.ready ? ' is-ready' : '')}>
            {e.ready ? 'Ready' : 'Connected per brand via an adapter'}
          </span>
        </div>
        <div className="nk-store-wire" aria-hidden="true">
          <span>Purchases</span>
          <i />
          <span>Rewards</span>
        </div>
        <div className="nk-store-node nk-store-app">
          <span className="nk-store-mono" aria-hidden="true">
            {monogram(brand)}
          </span>
          <small className="nk-caps">The app</small>
          <b>{brand}</b>
          <span>App Store · Google Play</span>
        </div>
      </div>
      <ul className="nk-store-facts">
        <li>
          <b>Codes</b>Single-use, redeemed in {brand}&rsquo;s own store.
        </li>
        <li>
          <b>Store</b>Orders confirm a purchase; rewards arrive as single-use codes.
        </li>
        <li>
          <b>Subscriptions</b>Cashback can come off the next delivery.
        </li>
        <li>
          <b>Loyalty</b>Points can sit beside a programme already running.
        </li>
        <li>
          <b>Email and CRM</b>Reorder reminders go out without any health data.
        </li>
        <li>
          <b>App stores</b>The app is listed under your brand name.
        </li>
      </ul>
    </div>
  )
}

function ProofPanel({ brand, panel }: { brand: string; panel: PanelOf }) {
  const [held, setHeld] = useState(6)
  const wc = SPREAD / Math.sqrt(held)
  const wa = SPREAD / Math.sqrt(CROWD - held)
  const last = LIFT_APP.length - 1
  const apart = LIFT_APP[last] - wa > LIFT_CTRL[last] + wc

  return (
    <section className="nk-still nk-proof" id="proof" {...panel('proof')}>
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
  )
}

function Evidence({ brand }: { brand: string }) {
  const sp = useStepPin(ENGINES.length)
  return (
    <div className="nk-r4" id="evidence">
      <section
        className="nk-still nk-int nk-sp nk-sp-int"
        id="integrations"
        aria-labelledby="nk-intg"
        ref={sp.sec}
        data-pin={sp.pinned ? '' : undefined}
      >
        <div className="nk-sp-pin" ref={sp.pin}>
        <div className="nk-sp-fit" data-sp-fit="">
        <div className="nk-panel">
          <div className="nk-caps nk-lab">
            <span className="nk-who">For you</span>
            <span className="nk-labrest">Integrations</span>
          </div>
          <h2 className="nk-h2" id="nk-intg">
            Any store engine: pick yours, from Shopify to a custom build.
          </h2>
          <p className="nk-one">Rewards arrive as Shopify codes; subscription, loyalty and email tools are matched to your stack. The app is listed in both stores under your brand.</p>
          <p className="nk-fine">Pick your store engine. Shopify is ready; every other engine connects per brand through an adapter.</p>
        </div>
        <div className="nk-sp-count nk-sp-count-int" aria-hidden="true">
          {Math.min(sp.step, ENGINES.length - 1) + 1} of {ENGINES.length}
          <span className="nk-sp-prog" ref={sp.prog}>
            {ENGINES.map((x, i) => (
              <i key={x.id} className={i < sp.step ? 'is-past' : i === sp.step ? 'is-on' : ''}>
                <b />
              </i>
            ))}
          </span>
        </div>
        <StoreMap brand={brand} pinned={sp.pinned} step={sp.step} go={sp.go} />
        <p className="nk-fine nk-int-fine">
          Which app in each category connects to your store is mapped in the first call.{' '}
          <a className="nk-link" href="#enquiry">
            Ask which apps connect to your store →
          </a>
        </p>
        </div>
        </div>
      </section>
    </div>
  )
}
function RX(day: number) {
  return 16 + ((day - 25) / 14) * 328
}

/* ── runda 4 (j) → R6': FAQ kupujacego jako chipy; odpowiedz jako dymek wiadomosci. Pelna lista w <details> ukrytych wizualnie. ── */
function Faq() {
  const [at, setAt] = useState(0)
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
      <div className="nk-qa-chips" role="group" aria-label="Pick a question">
        {FAQ.map((f, i) => (
          <button
            key={f.q}
            type="button"
            className="nk-qa-chip"
            aria-pressed={at === i}
            aria-controls="nk-qa-ans"
            onClick={() => setAt(i)}
          >
            {f.q}
          </button>
        ))}
      </div>
      <div className="nk-qa-ans" id="nk-qa-ans" aria-live="polite">
        <div className="nk-qa-thread" key={at}>
          <p className="nk-qa-q">{FAQ[at].q}</p>
          <div className="nk-qa-msg">
            <span className="nk-qa-av" aria-hidden="true">
              R
            </span>
            <div>
              <small>Rafał</small>
              <p>{FAQ[at].a}</p>
            </div>
          </div>
        </div>
      </div>
      {/* pelna lista pytan i odpowiedzi (czytniki, wyszukiwarki, FAQPage JSON-LD, bramka inwentarza czyta summary) */}
      <div className="nk-qa-sr">
        {FAQ.map((f) => (
          <details key={f.q} open>
            <summary tabIndex={-1}>{f.q}</summary>
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

function NeverScene({ skin, brand, panel }: { skin: Skin; brand: string; panel: PanelOf }) {
  const [last, setLast] = useState<number | null>(null)
  const [tries, setTries] = useState<number[]>(() => NEVER.map(() => 0))
  const press = (i: number) => {
    setLast(i)
    setTries((t) => t.map((n, k) => (k === i ? n + 1 : n)))
  }
  return (
    <section className="nk-still nk-never" id="never" {...panel('never')}>
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

/* ── spec 35 (R6'): jeden kokpit „For you” zaraz po portfelu ──
   Piec dotychczasowych widokow marki jako zakladki jednej sekcji (WAI-ARIA APG Tabs, aktywacja automatyczna).
   Nieaktywne panele maja `hidden`, ale zostaja w DOM (stan i tresc). Kotwice #paths… aktywuja zakladke i przewijaja do kokpitu. */
type PanelOf = (id: string) => { role: 'tabpanel'; 'aria-labelledby': string; hidden: boolean; tabIndex: number }
const CK_TABS = [
  { id: 'paths', label: 'Learning paths' },
  { id: 'pharmacy', label: 'Pharmacy purchases' },
  { id: 'privacy', label: 'Privacy' },
  { id: 'proof', label: 'Proof of results' },
  { id: 'never', label: 'What it never does' },
  { id: 'rhythm', label: 'Pack rhythm' },
] as const

/* aktywna zakladka widoczna w przewijanym rzedzie (bez przewijania strony) */
function revealTab(row: HTMLElement | null, i: number) {
  const tab = row?.children[i] as HTMLElement | undefined
  if (!row || !tab) return
  const l = tab.offsetLeft - 44 // R6' q3 B: poza maska wygaszenia krawedzi
  const r = tab.offsetLeft + tab.offsetWidth + 84 - row.clientWidth
  if (l < row.scrollLeft) row.scrollLeft = l
  else if (r > row.scrollLeft) row.scrollLeft = r
}
const rowAtEnd = (row: HTMLElement | null) => !row || row.scrollLeft + row.clientWidth >= row.scrollWidth - 2
const rowAtStart = (row: HTMLElement | null) => !row || row.scrollLeft <= 8

/* spec 36 B: na desktopie (ten sam warunek co w cockpit-scroll.css) kokpit jest przypieta scena z torem 6 x 45svh (R6' q3 B: szosta zakladka „Pack rhythm”),
   zakladka = funkcja przewiniecia, klik/klawiatura = plynny skok do odcinka. Bez JS: wszystkie panele jeden pod drugim. */
const CK_PIN_Q = '(min-width:900px) and (min-height:600px) and (prefers-reduced-motion: no-preference)'

function BrandCockpit({ skin, brand }: { skin: Skin; brand: string }) {
  const [cur, setCur] = useState(0)
  const [end, setEnd] = useState(false)
  const [start, setStart] = useState(true)
  // przed hydratacja (i bez JS) zadnego `hidden` — wszystkie panele widoczne; ten sam HTML na serwerze i w 1. renderze
  const [ready, setReady] = useState(false)
  const [pinned, setPinned] = useState(false)
  const list = useRef<HTMLDivElement>(null)
  const sec = useRef<HTMLElement>(null)
  const pin = useRef<HTMLDivElement>(null)
  const prog = useRef<HTMLDivElement>(null)
  const at = useRef(0) // lustro `cur` dla nasluchu przewijania
  const isPin = useRef(false)
  const lock = useRef<{ i: number; until: number } | null>(null) // klik → plynny skok bez migania posrednich zakladek
  const goHash = useRef<(() => void) | null>(null)

  const { colour } = useBrand()
  const vars = {
    ['--brand' as string]: colour,
    ['--brand-on' as string]: onColour(colour),
    ['--hi' as string]: inkOn(colour, '#0E0F12'),
  }

  /* geometria toru: odcinek i = [top + i*seg, top + (i+1)*seg) */
  const track = () => {
    const s = sec.current
    const p = pin.current
    if (!s || !p) return null
    const r = s.getBoundingClientRect()
    const run = r.height - p.offsetHeight
    return run > 40 ? { top: r.top + window.scrollY, r, seg: run / CK_TABS.length } : null
  }
  const clearHash = (i: number) => {
    // recenzja 43 W3: stary #hash w adresie blokowalby ponowny skok z menu (brak hashchange)
    try {
      if (location.hash && location.hash !== '#' + CK_TABS[i].id) history.replaceState(history.state, '', location.pathname + location.search)
    } catch {
      /* bez history — bez zmian */
    }
  }
  const show = (i: number) => {
    at.current = i
    setCur(i)
    revealTab(list.current, i)
  }
  /* w przypietej scenie: przewiniecie okna na poczatek odcinka zakladki (+1 px) */
  const scrollToSeg = (i: number, smooth: boolean) => {
    const t = track()
    if (!t) return
    lock.current = smooth ? { i, until: performance.now() + 1600 } : null
    // recenzja 47: cel w glebi odcinka (nie +1 px na jego poczatku) — zmiana geometrii w trakcie skoku (pasek cookies
    // zmienia --consent-h) nie przerzuca juz na poprzednia zakladke; dla zakladki 0 bez zmian
    const into = i > 0 ? Math.min(t.seg * 0.25, 120) : 1
    window.scrollTo({ top: Math.round(t.top + i * t.seg + into), behavior: smooth ? 'smooth' : 'auto' })
  }

  const pick = (i: number, focus = false) => {
    show(i)
    clearHash(i)
    if (isPin.current) scrollToSeg(i, true)
    if (focus) (list.current?.children[i] as HTMLElement | undefined)?.focus({ preventScroll: true })
  }
  const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const n = CK_TABS.length
    const k = e.key
    const i = k === 'ArrowRight' ? (cur + 1) % n : k === 'ArrowLeft' ? (cur - 1 + n) % n : k === 'Home' ? 0 : k === 'End' ? n - 1 : -1
    if (i < 0) return
    e.preventDefault()
    pick(i, true)
  }
  const onRow = () => {
    setEnd(rowAtEnd(list.current))
    setStart(rowAtStart(list.current))
  }
  /* R6' q3 B: widoczna podpowiedz przewijania rzedu zakladek (telefon) — przycisk ze strzalka przesuwa rzad o ~2/3 szerokosci */
  const more = () => {
    const row = list.current
    if (!row) return
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    row.scrollBy({ left: Math.round(row.clientWidth * 0.66), behavior: still ? 'auto' : 'smooth' })
  }

  /* niskie okno (np. 900x600): panel, ktory mimo ciasnego CSS nie miesci sie w scenie, dostaje `zoom` < 1 przed malowaniem —
     nic nie wystaje poza scene i nie ma przesuniecia ukladu (pomiar w useLayoutEffect, tylko przy zmianie zakladki/okna) */
  const [vw, setVw] = useState(0)
  useLayoutEffect(() => {
    const el = document.getElementById(CK_TABS[cur].id)
    if (!el) return
    el.style.zoom = ''
    if (!pinned) return
    let z = 1
    for (let k = 0; k < 3 && el.scrollHeight > el.clientHeight + 1; k++) {
      z = Math.max(0.7, Math.floor(z * (el.clientHeight / el.scrollHeight) * 98) / 100)
      el.style.zoom = String(z)
    }
    return () => {
      el.style.zoom = ''
    }
  }, [cur, pinned, vw])

  /* przypiecie + zakladka z przewijania (rAF, setState tylko przy zmianie zakladki) + kotwice /nawyko#paths itd. */
  useEffect(() => {
    const row = list.current
    let mq: MediaQueryList | null = null
    try {
      mq = window.matchMedia(CK_PIN_Q)
    } catch {
      /* bez matchMedia — zakladki na klik */
    }
    let raf = 0
    const tick = () => {
      raf = 0
      if (!isPin.current) return
      const t = track()
      if (!t) return
      const pos = Math.min(CK_TABS.length - 0.0001, Math.max(0, -t.r.top / t.seg))
      const i = Math.floor(pos)
      // spec 41 C: postep od punktu ladowania skoku (cel w glebi odcinka), nie od poczatku odcinka — po kliku pasek startuje od 0
      const a = i > 0 ? Math.min(t.seg * 0.25, 120) / t.seg : 0
      prog.current?.style.setProperty('--f', Math.max(0, (pos - i - a) / (1 - a)).toFixed(3))
      const l = lock.current
      if (l) {
        if (i !== l.i && performance.now() < l.until) return
        lock.current = null
      }
      if (i !== at.current) {
        show(i)
        clearHash(i)
      }
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const stop = () => {
      lock.current = null
      on()
    }
    const fit = () => {
      setEnd(rowAtEnd(row))
      setStart(rowAtStart(row))
      setVw(window.innerWidth * 10000 + window.innerHeight)
      on()
    }
    const go = (hash = window.location.hash) => {
      const id = decodeURIComponent(hash.slice(1))
      const i = CK_TABS.findIndex((t) => t.id === id)
      if (i < 0) return
      show(i)
      const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      requestAnimationFrame(() => {
        if (isPin.current) scrollToSeg(i, false)
        else sec.current?.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' })
      })
    }
    // ta sama straz co w scenie hero: pod automatyzacja (qa.js, WebKit) uklad statyczny
    const sync = () => {
      const p = !!mq?.matches && !navigator.webdriver
      isPin.current = p
      setPinned(p)
      on()
    }
    // kotwica z wejscia: zapamietana teraz, bo pierwszy odczyt przewijania (pozycja z natywnego skoku do #id w ukladzie
    // bez JS) wskazalby inna zakladke i wyczyscil adres; blokada trzyma zakladke do skoku na jej odcinek
    const first = window.location.hash
    const fi = CK_TABS.findIndex((t) => '#' + t.id === decodeURIComponent(first))
    if (fi >= 0) {
      show(fi)
      lock.current = { i: fi, until: performance.now() + 3000 }
    }
    goHash.current = () => go(first)
    setReady(true)
    sync()
    fit()
    mq?.addEventListener('change', sync)
    const onHash = () => go()
    window.addEventListener('hashchange', onHash)
    window.addEventListener('resize', fit)
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('scrollend', stop)
    return () => {
      mq?.removeEventListener('change', sync)
      window.removeEventListener('hashchange', onHash)
      window.removeEventListener('resize', fit)
      window.removeEventListener('scroll', on)
      window.removeEventListener('scrollend', stop)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  /* kotwica z adresu dopiero po renderze z `hidden` i [data-pin] — wtedy wysokosc toru jest juz docelowa */
  useEffect(() => {
    if (!ready) return
    const id = requestAnimationFrame(() => goHash.current?.())
    return () => cancelAnimationFrame(id)
  }, [ready])

  const panel: PanelOf = (id) => ({
    role: 'tabpanel',
    'aria-labelledby': 'nk-ck-t-' + id,
    hidden: ready && CK_TABS[cur].id !== id,
    tabIndex: 0,
  })

  return (
    <section className="nk-cockpit" id="cockpit" aria-labelledby="nk-ck-h" style={vars} ref={sec} data-pin={pinned ? '' : undefined}>
      <div className="nk-ck-pin" ref={pin}>
        <div className="nk-ck-head">
          <div className="nk-caps nk-lab">
            <span className="nk-who">For you</span>
            <span className="nk-labrest">{brand} · brand side</span>
          </div>
          <h2 className="nk-h2" id="nk-ck-h">
            Now the same app from your side: what you set, what you see.
          </h2>
        </div>
        <div className="nk-ck-rowwrap" data-end={end ? '' : undefined} data-start={start ? '' : undefined}>
          <div className="nk-ck-tabs" id="nk-ck-tabs" role="tablist" aria-label={`${brand} brand views`} ref={list} onKeyDown={onKey} onScroll={onRow}>
            {CK_TABS.map((t, i) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                id={'nk-ck-t-' + t.id}
                aria-selected={i === cur}
                aria-controls={t.id}
                tabIndex={i === cur ? 0 : -1}
                className="nk-ck-tab"
                onClick={() => pick(i)}
              >
                <span className="nk-ck-n" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {t.label}
              </button>
            ))}
          </div>
          <button type="button" className="nk-ck-more" aria-label="Show more brand views" aria-controls="nk-ck-tabs" hidden={!ready || end} onClick={more}>
            <span aria-hidden="true">›</span>
          </button>
        </div>
        <div className="nk-ck-prog" ref={prog} aria-hidden="true">
          {CK_TABS.map((t, i) => (
            <i key={t.id} className={i === cur ? 'is-on' : i < cur ? 'is-past' : undefined}>
              <b />
            </i>
          ))}
        </div>
        <div className="nk-ck-stage nk-r4 nk-r5c" data-dark={contrast(colour, '#0E0F12') < 2 ? '' : undefined}>
          <MoreScenes brand={brand} panel={panel} />
          <ProofPanel brand={brand} panel={panel} />
          <NeverScene skin={skin} brand={brand} panel={panel} />
          <RhythmScene skin={skin} brand={brand} panel={panel} />
        </div>
      </div>
    </section>
  )
}

/* R6' q3 B: dawny akt 6 sceny („Pack rhythm”) jako szosta zakladka kokpitu — tresc 1:1 (BrandPanel + telefon marki).
   R6' q4 B: animacja wejscia przy kazdym pokazaniu panelu (zakladka, odcinek przypietego toru albo wjazd wykresu na ekran
   przy przewijaniu) — kropki dosypywane, ok. 1,2 s, raz na pokazanie. SSR, bez JS i reduced motion:
   stan koncowy (t = 1). Panel ukryty albo poza ekranem zawsze w stanie koncowym. Zmieniaja sie tylko klasy kropek
   (opacity/transform) i cyfry licznika — stale wymiary, bez przesuniec ukladu.
   R6' q5 A (spec 39 A1): licznik 30→34 w telefonie ma osobny zegar i wyzwalacz — telefon >= 35 % na ekranie
   (na 390 stoi ~490 px pod wykresem, wiec wspolny wyzwalacz konczyl licznik, zanim telefon byl widoczny). Licznik idzie
   liniowo przez cale 1,2 s, 34 dopiero na koncu. W przypietym kokpicie (>= 900 px, wykres i telefon razem na ekranie)
   oba zegary startuja w tej samej chwili (startChart). Telefon czesciowo na ekranie (< 35 %) czeka na 30, zeby nie mignelo 34 → 30. */
const RHYTHM_MS = 1200
const RHYTHM_IN = 0.35 // jaka czesc wykresu / telefonu musi byc na ekranie, zeby animacja ruszyla
function partInView(el: Element | null | undefined) {
  if (!el) return 0
  const r = el.getBoundingClientRect()
  if (!r.height) return 0
  return Math.max(0, Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0)) / r.height
}
function stillMotion() {
  try {
    return matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return true
  }
}
/* jeden zegar wejscia: t 0→1 w RHYTHM_MS, raz na pokazanie (rest = koniec pokazania, stan koncowy) */
function useEntrance() {
  const [t, setT] = useState(1)
  const played = useRef(false)
  const raf = useRef(0)
  const play = useCallback(() => {
    if (played.current) return
    played.current = true
    if (stillMotion()) return
    cancelAnimationFrame(raf.current)
    const t0 = performance.now()
    setT(0)
    const frame = (now: number) => {
      const k = Math.min(1, (now - t0) / RHYTHM_MS)
      setT(k)
      raf.current = k < 1 ? requestAnimationFrame(frame) : 0
    }
    raf.current = requestAnimationFrame(frame)
  }, [])
  // stan poczatkowy bez startu (telefon wchodzi na ekran, jeszcze < 35 %)
  const arm = useCallback(() => {
    if (played.current || raf.current || stillMotion()) return
    setT(0)
  }, [])
  const rest = useCallback(() => {
    played.current = false
    if (raf.current) cancelAnimationFrame(raf.current)
    raf.current = 0
    setT(1)
  }, [])
  useEffect(() => () => cancelAnimationFrame(raf.current), [])
  return { t, play, arm, rest }
}
function RhythmScene({ skin, brand, panel }: { skin: Skin; brand: string; panel: PanelOf }) {
  const props = panel('rhythm')
  const shown = !props.hidden
  const ref = useRef<HTMLElement>(null)
  const chart = useEntrance()
  const phone = useEntrance()
  const { play: playChart, rest: restChart } = chart
  const { play: playPhone, arm: armPhone, rest: restPhone } = phone
  const startChart = useCallback(() => {
    playChart()
    if (ref.current?.closest('.nk-cockpit[data-pin]')) playPhone() // przypiety kokpit: kropki i licznik razem
  }, [playChart, playPhone])
  const seePhone = useCallback(
    (part: number) => {
      if (ref.current?.closest('.nk-cockpit[data-pin]')) return // tu telefon idzie z wykresem
      if (part >= RHYTHM_IN) playPhone()
      else if (part > 0) armPhone()
      else restPhone()
    },
    [playPhone, armPhone, restPhone],
  )
  // zakladka wybrana (klik, klawiatura, odcinek toru): start przed malowaniem, zeby nie mignal stan koncowy
  useLayoutEffect(() => {
    if (!shown) {
      restChart()
      restPhone()
      return
    }
    if (partInView(ref.current?.querySelector('.nk-chart')) >= RHYTHM_IN) startChart()
    seePhone(partInView(ref.current?.querySelector('.nk-phone')))
  }, [shown, startChart, seePhone, restChart, restPhone])
  // wjazd na ekran przy przewijaniu (uklad bez przypiecia) i zjazd z ekranu = koniec pokazania — osobno wykres i telefon
  useEffect(() => {
    const c = ref.current?.querySelector('.nk-chart')
    const ph = ref.current?.querySelector('.nk-phone')
    if (!c || !ph || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (es) => {
        for (const e of es) {
          const part = e.isIntersecting ? e.intersectionRatio : 0
          if (e.target === c) {
            if (part >= RHYTHM_IN) startChart()
            else if (!e.isIntersecting) {
              restChart()
              if (ref.current?.closest('.nk-cockpit[data-pin]')) restPhone()
            }
          } else seePhone(part)
        }
      },
      { threshold: [0, 0.01, RHYTHM_IN] },
    )
    io.observe(c)
    io.observe(ph)
    return () => io.disconnect()
  }, [startChart, restChart, restPhone, seePhone])
  return (
    <section className="nk-still nk-rhythm" id="rhythm" ref={ref} {...props}>
      <BrandPanel t={chart.t} id="nk-brand" />
      <div className="nk-phonecol">
        <Phone step={5} t={phone.t} theme={skin} scratched brand={brand} />
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

function BrandColour({ value, onPick, group }: { value: string; onPick: (hex: string) => void; group: string }) {
  const preset = BRAND_COLS.find((c) => c.hex.toLowerCase() === value.toLowerCase())
  return (
    <fieldset className="nk-bcol">
      <legend className="nk-caps">Brand colour</legend>
      <div className="nk-bcol-row">
        {BRAND_COLS.map((c) => (
          <label key={c.id} className="nk-bcol-sw" title={c.name}>
            <input
              type="radio"
              name={group}
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

/* Spec 26: jedna notka zamiast nazwy demo na sztywno. Bez wlasnej nazwy — ze to marka zmyslona; z wlasna — ze dane sa przykladowe. */
function DemoNote({ className = 'nk-demo' }: { className?: string }) {
  const { name, own } = useBrand()
  return (
    <p className={className}>
      {own ? `Showing your brand: ${name.trim()} · sample data.` : `${DEMO_BRAND} is a made-up demo brand, not a client.`}
    </p>
  )
}

const PAGE_BG: Record<Skin, string> = { paper: '#F7F5F0', night: '#14161A', clay: '#EFE6DA' }
const HERO_TILE = '#1B1D21' // najjasniejsze tlo pod akcentem w telefonie hero (recenzja 31: 4,45:1 liczone od #111215)
const RING = 30
const HERO_DAY = 9

/* ── PILNE 2 pkt 3 (Rafal 28.11.2026): przerywnik rozdzialu ──
   Pelna szerokosc przed kazda sekcja: „03 / 08”, nazwa (ta sama w pasku rozdzialow) i jedno zdanie, dlaczego teraz.
   Reaguje na odwiedzajacego: nazwa marki w zdaniu, numer i podzialka rozdzialow w kolorze marki. */
type ChapterId = (typeof NK_CHAPTERS)[number]['id']
export function Interlude({ id }: { id: ChapterId }) {
  const { colour, brand } = useBrand()
  const i = NK_CHAPTERS.findIndex((c) => c.id === id)
  const c = NK_CHAPTERS[i]
  const n = NK_CHAPTERS.length
  const pad = (v: number) => String(v).padStart(2, '0')
  return (
    <div
      className="nk-ch"
      id={c.id}
      style={{ ['--brand' as string]: colour, ['--hi' as string]: inkOn(colour, '#F4F1EA') }}
    >
      <p className="nk-ch-num" aria-label={`Chapter ${i + 1} of ${n}`}>
        <b>{pad(i + 1)}</b>
        <span aria-hidden="true"> / {pad(n)}</span>
      </p>
      <ol className="nk-ch-ticks" aria-hidden="true">
        {NK_CHAPTERS.map((x, k) => (
          <li key={x.id} className={k < i ? 'is-past' : k === i ? 'is-on' : ''} />
        ))}
      </ol>
      <p className="nk-ch-name">{c.label}</p>
      <p className="nk-ch-why">
        <span className="nk-caps">Why now</span> {c.why.replace(/\{b\}/g, brand)}
      </p>
    </div>
  )
}

/* ── spec 26 p1: hero z zywym ekranem aplikacji w marce odwiedzajacego ──
   Ciemny ekran „Today” jak w prawdziwej aplikacji (bez zrzutow z prywatnego repo): naglowek z monogramem i nazwa,
   tarcza 30 dni wokol opakowania, trzy kafelki, karta dnia do zdrapania w kolorze marki. Pod telefonem: nazwa + kolor
   = silnik marki dla calej strony. */
export function HeroApp() {
  const { name, colour, brand, own, setName, setColour } = useBrand()
  const [done, setDone] = useState(false)
  const [auto, setAuto] = useState(false)
  /* Kto zmienil marke, sam zdrapuje albo klika „Reveal” — bez ponownej samozdrapki. */
  const [touched, setTouched] = useState(false)
  if (useBrandChanged()) {
    if (done) setDone(false)
    if (auto) setAuto(false)
    if (!touched) setTouched(true)
  }
  const reveal = useCallback(() => setDone(true), [])
  useEffect(() => {
    if (done || touched) return
    let reduce = false
    try {
      reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    } catch {
      /* bez matchMedia — bez samozdrapki */
    }
    if (reduce || navigator.webdriver) return
    /* Samozdrapka tylko dla kogos, kto zostal na pierwszym ekranie — w trakcie przewijania animacja plotna dawala dlugie klatki (scroll-perf 1440). */
    const id = window.setTimeout(() => {
      if (window.scrollY < 120) setAuto(true)
    }, 3200)
    return () => window.clearTimeout(id)
  }, [done, touched])
  const day = done ? HERO_DAY : HERO_DAY - 1
  const ink = inkOn(colour, HERO_TILE)
  const vars = {
    ['--brand' as string]: colour,
    ['--brand-on' as string]: onColour(colour),
    ['--hi' as string]: ink,
  }
  const R = 44
  return (
    <div className="nk-happ" style={vars}>
      <div className="nk-hphone" aria-hidden="true">
        <div className="nk-hscreen">
          <div className="nk-hhead">
            <span className="nk-hmono">{monogram(brand)}</span>
            <b className="nk-hname">{brand}</b>
            <span className="nk-hpill">Sample data</span>
          </div>
          <div className="nk-hring">
            <svg viewBox="0 0 100 100" aria-hidden="true">
              {Array.from({ length: RING }, (_, i) => {
                const a = (i / RING) * Math.PI * 2 - Math.PI / 2
                const x1 = 50 + Math.cos(a) * (R - 4)
                const y1 = 50 + Math.sin(a) * (R - 4)
                const x2 = 50 + Math.cos(a) * R
                const y2 = 50 + Math.sin(a) * R
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    className={i < day ? 'is-in' : i === day && !done ? 'is-now' : ''}
                  />
                )
              })}
            </svg>
            <div className="nk-hbottle">
              <i />
              <span>{monogram(brand)}</span>
            </div>
            <span className={'nk-hday' + (done ? ' is-up' : '')} key={done ? 'y' : 'n'}>
              {done ? `Day ${HERO_DAY} ticked` : `Day ${HERO_DAY} of ${RING}`}
            </span>
          </div>
          <div className="nk-htiles">
            <span>
              <b key={day}>{day}</b>day streak
            </span>
            <span>
              <b key={day}>{day}</b>ticked
            </span>
            <span>
              <b key={day}>{RING - day}</b>days left
            </span>
          </div>
          <div className="nk-hcard">
            <div className="nk-hcard-in">
              <b>{done ? '✓ Ticked' : 'Card of the day'}</b>
              <small>{done ? 'Next card tomorrow' : 'Taken it? Scratch.'}</small>
            </div>
            <Scratch gone={done} auto={auto} foil={colour} onDone={reveal} />
          </div>
          <div className="nk-hnext">
            <span className="nk-hlock" aria-hidden="true" />
            <span>
              <small>Next reward</small>
              <b>Stamp at day {GOAL_DAY}</b>
            </span>
            <i style={{ ['--w' as string]: `${(day / GOAL_DAY) * 100}%` }} />
          </div>
          <div className="nk-htabs">
            <span className="is-on">Today</span>
            <span>Rewards</span>
            <span>Shop</span>
            <span>Account</span>
          </div>
        </div>
      </div>
      <div className="nk-hbrand">
        <button type="button" className="nk-link" onClick={reveal} aria-disabled={done || undefined}>
          Reveal without scratching
        </button>
        <p className="nk-fine nk-hstatus" aria-live="polite">
          {done ? `Day ${HERO_DAY} ticked: the streak grew to ${HERO_DAY}.` : ''}
        </p>
        <p className="nk-fine nk-hhint">Type your brand name, pick a colour and a style. Every phone follows.</p>
        <label className="nk-name">
          <span className="nk-caps">Your brand name</span>
          <input
            type="text"
            value={name}
            maxLength={14}
            placeholder="Type it here"
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setName(e.currentTarget.value)}
          />
        </label>
        <BrandColour value={colour} onPick={setColour} group="nk-hero-colour" />
        <SkinPick />
        <p className="nk-fine">{own ? 'Every phone below now shows your brand. Nothing is sent.' : 'Stays on this page. Nothing is sent.'}</p>
      </div>
    </div>
  )
}

/* R6'q14-A (Rafal 28.11.2026 10:37): krotki formularz zaraz pod hero — adres sklepu + e-mail jak pasek na /,
   trzy kroki „co dalej” i forma rozliczenia. Akcent i etykieta w kolorze i nazwie marki odwiedzajacego (silnik marki). */
export function QuickAsk() {
  const { colour, brand, own } = useBrand()
  return (
    <section
      className="nk-quick"
      id="ask"
      aria-labelledby="nk-quick-h"
      style={{ ['--brand' as string]: colour, ['--brand-on' as string]: onColour(colour) }}
    >
      <div className="nk-quick-copy">
        <div className="nk-caps nk-lab">
          <span className="nk-brandtag">{own ? `For ${brand}` : 'Ask about Nawyko'}</span>
        </div>
        <h2 className="nk-h2" id="nk-quick-h">
          See what Nawyko would do for your store.
        </h2>
        <NextSteps id="nk-next-top" />
      </div>
      <QuickEnquiry />
    </section>
  )
}

export function Story() {
  const root = useRef<HTMLDivElement>(null)
  const { colour, name, own } = useBrand()
  const skin = useSkin()
  const [store, setStore] = useState('')

  useEffect(() => {
    const host = root.current?.closest<HTMLElement>('.nk')
    if (!host) return
    if (skin === 'paper') delete host.dataset.skin
    else host.dataset.skin = skin
  }, [skin])

  /* Silnik marki: kolor odwiedzajacego jest akcentem calej strony i kazdego telefonu (kontrast AA na kazdym tle). */
  useEffect(() => {
    const host = root.current?.closest<HTMLElement>('.nk')
    if (!host) return
    const st = host.style
    st.setProperty('--brand', colour)
    st.setProperty('--brand-on', onColour(colour))
    st.setProperty('--red', inkOn(colour, PAGE_BG[skin]))
    st.setProperty('--bi-p', inkOn(colour, PHONE_BG.paper))
    st.setProperty('--bi-n', inkOn(colour, PHONE_BG.night))
    st.setProperty('--bi-c', inkOn(colour, PHONE_BG.clay))
    host.dataset.brand = ''
  }, [colour, skin])

  /* Lekcja R23 (react.dev useSyncExternalStore: hydratacja zawsze ze stanu serwera): powracajacy gosc z zapisana marka
     widzialby przez chwile nazwe demo. Inline-skrypt w page.tsx chowa nazwy w telefonach (visibility, bez przesuniec);
     odslaniamy je, gdy wyrenderowany stan = zapisany. */
  useEffect(() => {
    let stored = ''
    try {
      stored = (JSON.parse(localStorage.getItem('oc-brand-v1') || '{}') as { name?: string }).name ?? ''
    } catch {
      stored = name
    }
    if (stored === name) document.documentElement.removeAttribute('data-brand-wait')
  }, [name])

  const typed = brandFrom(store)
  const shown = own ? name.trim() : typed

  return (
    <div ref={root}>
      <Interlude id="ch-how" />
      <Scene skin={skin} />
      <DemoNote className="nk-demo nk-demo-after" />

      <Interlude id="ch-rewards" />
      <Loyalty skin={skin} brand={own ? name.trim() : DEMO_BRAND} />
      <Interlude id="ch-side" />
      <BrandCockpit skin={skin} brand={own ? name.trim() : DEMO_BRAND} />
      <Interlude id="ch-engine" />
      <Evidence brand={own ? name.trim() : DEMO_BRAND} />

      <Interlude id="ch-faq" />
      <Faq />

      <Interlude id="ch-morning" />
      <Finale />

      <Interlude id="ch-next" />
      <section
        className="nk-final nk-final-solo"
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
            <span className="nk-brandtag">{shown ? `For ${shown}` : 'Your next step'}</span>
          </div>
          <h2 className="nk-h2" id="nk-ask">
            {shown ? `Build ${shown}’s app.` : 'Build your brand’s app.'}
          </h2>
          <p className="nk-one">Send your store address. The first call covers rewards and setup.</p>
          <NextSteps id="nk-next-end" />
        </div>
        <div className="nk-final-form">
          <Enquiry onStore={setStore} />
        </div>
      </section>
    </div>
  )
}

/* ── spec 28 (R5 p2): wielki final — przewijanie odslania aplikacje odwiedzajacego ──
   Piec chwil jednego poranka klienta: ikona marki na ekranie glownym → powiadomienie → zdrapka w kolorach marki
   (do zdrapania albo „Reveal without scratching”) → dzien 24 i odblokowana pieczatka → kod na kolejne opakowanie,
   tlo przechodzi w kolor marki i plynnie wchodzi formularz („Build {marka}’s app.”). Bez JS i przed hydratacja: chwila 3
   (karta dnia) — najwiecej tresci. Przewijanie zmienia tylko stan liczbowy (setState przy zmianie chwili) i transformy. */
const FZ_N = 5
const FZ_DAY = 24
const FZ_ICONS = ['Mail', 'Maps', 'Photos', 'Music', 'Notes', 'Chat', 'Bank', 'Clock', 'News', 'Shop', 'Books']
function fzMoments(brand: string) {
  return [
    { k: '07:30', h: 'Your icon on their home screen.', p: 'Between the apps they open every morning.' },
    { k: '07:31', h: `A daily reminder from ${brand}.`, p: 'Always the same words: “Your card of the day is ready.”' },
    { k: '07:32', h: 'One scratch after the dose.', p: 'Try it here: scratch the card, or press the button below.' },
    { k: `Day ${FZ_DAY} of 30`, h: `The stamp unlocks on day ${FZ_DAY}.`, p: 'The reward they saw coming from day one.' },
    { k: 'Next order', h: `A next-pack code from ${brand}.`, p: 'Single use, redeemed in your online store.' },
  ]
}

const FZ_LOW = '(max-height: 599px)'

export function Finale() {
  const { colour, brand } = useBrand()
  const root = useRef<HTMLElement>(null)
  const [at, setAt] = useState(2)
  const [done, setDone] = useState(false)
  const atRef = useRef(2)
  if (useBrandChanged() && done) setDone(false)
  const reveal = useCallback(() => setDone(true), [])

  useEffect(() => {
    const el = root.current
    if (!el) return
    let raf = 0
    /* spec 50: niskie okno (< 600 px, ten sam warunek co PIN_JS) — final nie jest przypiety, chwile ustawiaja kropki. */
    const low = window.matchMedia(FZ_LOW)
    const read = () => {
      raf = 0
      if (low.matches) return
      const r = el.getBoundingClientRect()
      const run = Math.max(1, r.height - window.innerHeight)
      const p = clamp(-r.top / run)
      const n = Math.min(FZ_N - 1, Math.floor(p * FZ_N))
      if (n !== atRef.current) {
        atRef.current = n
        setAt(n)
      }
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(read)
    }
    /* recenzja 56 a): bez przewijania opowiesc zaczyna sie od pierwszej chwili, nie od trzeciej (stan bez JS) */
    if (low.matches) {
      atRef.current = 0
      setAt(0)
    }
    read()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    low.addEventListener('change', on)
    return () => {
      window.removeEventListener('scroll', on)
      window.removeEventListener('resize', on)
      low.removeEventListener('change', on)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  /* Kto przewinie dalej bez zdrapania, widzi odsloniety dzien — opowiesc idzie do przodu. */
  /* PILNE 2 pkt 1: tylko przy zmianie chwili (przewiniecie dalej), nie po zmianie marki — inaczej nowa karta
     odslanialaby sie sama w tej samej klatce i „Reveal” nie mialby czego odslonic. */
  const prevAt = useRef(at)
  useEffect(() => {
    if (at !== prevAt.current && at >= 3) setDone(true)
    prevAt.current = at
  }, [at])

  const go = (n: number) => {
    const el = root.current
    if (!el) return
    if (window.matchMedia(FZ_LOW).matches) {
      atRef.current = n
      setAt(n)
      return
    }
    const run = el.offsetHeight - window.innerHeight
    const top = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: top + run * ((n + 0.5) / FZ_N), behavior: 'auto' })
  }

  const moments = fzMoments(brand)
  /* recenzja bramki qa 1280x520: --hi stoi tez na kaflach #1B1D21 (najjasniejsza ciemna powierzchnia finalu), nie tylko na #111215 */
  const ink = inkOn(colour, '#1B1D21')
  const vars = {
    ['--brand' as string]: colour,
    ['--brand-on' as string]: onColour(colour),
    ['--hi' as string]: ink,
  }
  const streak = done ? FZ_DAY : FZ_DAY - 1
  const stamp = done && at >= 3
  const mono = monogram(brand)

  return (
    <section
      ref={root}
      className={'nk-fz' + (at === FZ_N - 1 ? ' is-brand' : '')}
      id="finale"
      aria-labelledby="nk-fz-h"
      data-at={at}
      style={vars}
    >
      <div className="nk-fz-stick">
        <div className="nk-fz-copy">
          <h2 className="nk-caps nk-fz-lab" id="nk-fz-h">
            One morning with {brand}
          </h2>
          <ol className="nk-fz-list">
            {moments.map((m, i) => (
              <li key={i} className={i === at ? 'is-on' : i < at ? 'is-past' : ''} aria-current={i === at ? 'step' : undefined}>
                <span className="nk-caps nk-fz-k">{m.k}</span>
                <b className="nk-fz-h">{m.h}</b>
                <span className="nk-fz-p">{m.p}</span>
              </li>
            ))}
          </ol>
          <div className="nk-fz-dots" role="group" aria-label="Moments">
            {moments.map((m, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Moment ${i + 1}: ${m.h}`}
                aria-pressed={i === at}
                onClick={() => go(i)}
              >
                <i />
              </button>
            ))}
          </div>
          <div className="nk-fz-act">
            <button type="button" className="nk-link" onClick={reveal} aria-disabled={done || undefined}>
              Reveal without scratching
            </button>
            <p className="nk-fine nk-fz-status" aria-live="polite">
              {done ? `Day ${FZ_DAY} done. Streak: ${FZ_DAY} days.` : ''}
            </p>
          </div>
        </div>

        <div className="nk-fz-phone" aria-hidden="true">
          <div className="nk-fz-screen">
            {/* ekran glowny */}
            <div className="nk-fz-home">
              <div className="nk-fz-sb">
                <b>7:3{Math.min(at, 2)}</b>
              </div>
              <div className="nk-fz-grid">
                {FZ_ICONS.slice(0, 7).map((l) => (
                  <span key={l} className="nk-fz-ic">
                    <i />
                    <small>{l}</small>
                  </span>
                ))}
                <span className="nk-fz-ic nk-fz-mine">
                  <i>{mono}</i>
                  <small>{brand}</small>
                </span>
                {FZ_ICONS.slice(7).map((l) => (
                  <span key={l} className="nk-fz-ic">
                    <i />
                    <small>{l}</small>
                  </span>
                ))}
              </div>
              <div className="nk-fz-dock">
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className="nk-fz-note">
                <span className="nk-fz-nmono">{mono}</span>
                <span className="nk-fz-ntext">
                  <small>
                    <b>{brand}</b> · now
                  </small>
                  Your card of the day is ready.
                </span>
              </div>
            </div>

            {/* aplikacja */}
            <div className="nk-fz-app">
              <div className="nk-hhead">
                <span className="nk-hmono">{mono}</span>
                <b className="nk-hname">{brand}</b>
                <span className="nk-hpill">Sample data</span>
              </div>
              <div className="nk-htiles nk-fz-tiles">
                <span>
                  <b key={streak}>{streak}</b>day streak
                </span>
                <span>
                  <b>{30 - streak}</b>days left
                </span>
              </div>
              <div className="nk-hcard nk-fz-card">
                <div className="nk-hcard-in">
                  <b>{done ? `✓ Day ${FZ_DAY} ticked` : 'Card of the day'}</b>
                  <small>{done ? 'Next card tomorrow' : 'Taken it? Scratch.'}</small>
                </div>
                <Scratch gone={done} foil={colour} onDone={reveal} />
              </div>
              <div className="nk-fz-stamps">
                <small>Stamps · free pack at 3</small>
                <div>
                  {[0, 1, 2].map((i) => (
                    <i key={i} className={i === 0 || (i === 1 && stamp) ? 'is-got' : ''} />
                  ))}
                  <span>{stamp ? '2 of 3' : '1 of 3'}</span>
                </div>
              </div>
              <div className={'nk-fz-code' + (at >= FZ_N - 1 ? ' is-on' : '')}>
                <small>Next-pack code</small>
                <b>{at >= FZ_N - 1 ? `${mono}-NEXT24` : '••••••••'}</b>
                <span className="nk-fz-use">Use in the {brand} store</span>
              </div>
              <div className="nk-htabs">
                <span className={at < FZ_N - 1 ? 'is-on' : ''}>Today</span>
                <span className={at >= FZ_N - 1 ? 'is-on' : ''}>Rewards</span>
                <span>Shop</span>
                <span>Account</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
