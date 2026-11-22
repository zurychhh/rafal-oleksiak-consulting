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

type Theme = 'paper' | 'night' | 'clay'

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
/* Przykladowy harmonogram nagrod marki pokazowej; dni ustawia marka. */
const REWARD_ROWS = [
  { day: 7, name: 'Free shipping', note: 'on the next order' },
  { day: 24, name: `Stamp · ${GOAL_DAY} of ${PACK_DAYS} days`, note: 'six days of slack built in' },
  { day: 24, name: 'Next-pack discount', note: 'a code that only works on a reorder' },
  { day: 99, name: 'Cashback', note: 'counted toward the order after that' },
] as const

const FINISH_DAYS = 34
const SKIPPED = [6, 13, 21, 27]
const TAB_OF = [0, 0, 1, 2, 2, 0, 2]

function Phone({
  step,
  t,
  theme,
  scratched,
  onScratched,
  interactive,
  fixedDays,
  day = PACK_DAYS,
  brand = DEMO_BRAND,
}: {
  step: number
  t: number
  theme: Theme
  scratched: boolean
  onScratched?: () => void
  interactive?: boolean
  fixedDays?: number
  day?: number
  brand?: string
}) {
  const view = step === 6 ? 3 : step
  const confirmed = step > 0 || t > 0.55
  const scan = step > 0 ? 1 : clamp(t / 0.5)
  const revealed = scratched || step > 1 || (step === 1 && t > 0.8)
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
  const tab = TAB_OF[step] ?? 0

  return (
    <div className="nk-phone" data-theme={theme} aria-hidden="true">
      <div className="nk-screen">
        <div className="nk-pbar">
          <span>{brand}</span>
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
                <span>{r.day > PACK_DAYS ? 'on reorder' : day >= r.day ? '✓ earned' : `day ${r.day}`}</span>
              </li>
            ))}
          </ul>
          <div className={'nk-coupon nk-late' + (day >= GOAL_DAY ? ' is-on' : '')}>
            <code>{brand.toUpperCase()}-NEXT-K7Q4</code>
            <small>Code for your next pack</small>
          </div>
        </div>

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
      <div className="nk-caps nk-lab">Rewards</div>
      <h2 className="nk-h2" id={id}>
        Known in advance. Never random.
      </h2>
      <p className="nk-one">Drag the day. Every reward sits on a date the customer saw on day one.</p>
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
      <p className="nk-fine">Example schedule on a made-up brand. The brand sets the rewards and the days.</p>
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
  const shown = t >= 1 ? DIST_TOTAL : Math.round((DIST_TOTAL - 1) * clamp((t - 0.12) / 0.55))
  const marks = t > 0.72
  return (
    <div className="nk-panel nk-in">
      <div className="nk-caps nk-lab">For the brand</div>
      <h2 className="nk-h2" id={id}>
        One phone is a habit. All of them are your reorder date.
      </h2>
      <p className="nk-one">
        Each finished pack is a dot. Together they show the day a pack really ends — not the day the label assumes.
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
          <span className="nk-lg-label">Day {PACK_DAYS} · what the label assumes</span>
          <span className="nk-lg-peak">Day {DIST_PEAK} · where most packs end here</span>
          <span className="nk-lg-me">Day {FINISH_DAYS} · the phone on this page</span>
        </div>
      </div>
      <p className="nk-fine">
        Illustration, invented data. Your curve comes from your customers.{' '}
        <a href="/tool">Check your own gap today — free</a>.
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
      <div className="nk-caps nk-lab">White label</div>
      <h2 className="nk-h2" id={id}>
        Your name on it, not mine.
      </h2>
      <p className="nk-one">Type a brand name and pick a skin. The phone and this whole page follow.</p>
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
    </div>
  )
}

/* ── scena przypieta do przewijania ──────────────────────────────────────── */
const ACTS = 7
const ACT_NAMES = ['Confirm', 'Scratch', 'Streak', 'Reward', 'Rewards by day', 'Brand view', 'Your name'] as const

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
    }
  }, [])

  const scroll = mode === 'scroll'
  const x = p * ACTS
  const step = scroll ? Math.min(ACTS - 1, Math.floor(x)) : manual
  const t = scroll ? clamp(x - step) : 1

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
    window.scrollTo({ top: top + (total * (i + 0.6)) / ACTS, behavior: 'smooth' })
    // Akty 5–7: po dojechaniu fokus trafia do kontrolki aktu (os dni, nazwa marki), zeby byla osiagalna z klawiatury.
    if (i >= 4)
      window.setTimeout(() => {
        el.querySelector<HTMLElement>('.nk-panel input, .nk-panel a')?.focus({ preventScroll: true })
      }, 900)
  }

  const steps = (
    <div className="nk-in">
      <div className="nk-caps nk-lab">How it works · shown on a made-up brand</div>
      <h2 className="nk-h2">Four moves, one pack.</h2>
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
      style={{ ['--p' as string]: scroll ? p : 1 }}
    >
      <div className="nk-stage">
        <div className="nk-scenehead">
          {!scroll || step < 4 ? steps : null}
          {scroll && step === 4 ? <RewardsPanel day={day} onDay={pickDay} id="nk-rewards" /> : null}
          {scroll && step === 5 ? <BrandPanel t={t} id="nk-brand" /> : null}
          {scroll && step === 6 ? <SkinPanel skin={skin} onSkin={onSkin} id="nk-wl" name={name} onName={onName} /> : null}
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
              <i />
            </div>
          ) : null}
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
              theme={skin}
              scratched={scratched}
              onScratched={() => setScratched(true)}
              interactive
              day={day}
              brand={brand}
            />
          </div>
        </div>
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

/* ── calosc pod pierwszym ekranem: scena, „czego nie robi”, final z formularzem ── */
const NEVER = ['No random rewards.', 'No health claims.', 'No hidden rules.'] as const

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

export function Story() {
  const root = useRef<HTMLDivElement>(null)
  const never = useRef<HTMLElement>(null)
  const [skin, setSkin] = useState<Skin>('paper')
  const [store, setStore] = useState('')
  const [name, setName] = useState('')
  const [seen, setSeen] = useState(true)

  useEffect(() => {
    const host = root.current?.closest<HTMLElement>('.nk')
    if (!host) return
    if (skin === 'paper') delete host.dataset.skin
    else host.dataset.skin = skin
  }, [skin])

  useEffect(() => {
    const el = never.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || navigator.webdriver) return
    if (el.getBoundingClientRect().top < window.innerHeight) return
    setSeen(false)
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const typed = brandFrom(store)

  return (
    <div ref={root}>
      <Scene skin={skin} onSkin={setSkin} name={name} onName={setName} />
      <p className="nk-demo nk-demo-after">
        {DEMO_BRAND} is a fictional brand invented for this demo. The screens show the mechanics, not a client.
      </p>

      <section ref={never} className={'nk-never' + (seen ? ' is-in' : '')} aria-labelledby="nk-never">
        <div className="nk-caps nk-lab">What it never does</div>
        <h2 className="nk-never-h" id="nk-never">
          {NEVER.map((line, i) => (
            <span key={line} style={{ ['--i' as string]: i }}>
              {line}
            </span>
          ))}
        </h2>
        <p className="nk-one">Every reward is fixed before the customer starts. The app counts days and nothing else.</p>
      </section>

      <section className="nk-final" id="enquiry" aria-labelledby="nk-ask">
        <div className="nk-final-copy">
          <div className="nk-caps nk-lab">Enquiry</div>
          <h2 className="nk-h2" id="nk-ask">
            Would this fit your product?
          </h2>
          <p className="nk-one">
            Supplements, skincare, pet food, coffee — anything bought again on a rhythm.{' '}
            <span className="nk-desk">Type your store and watch the phone.</span>
          </p>
          <Enquiry onStore={setStore} />
        </div>
        <div className="nk-phonecol nk-final-phone">
          <Phone step={3} t={1} theme={skin} scratched brand={typed || name.trim().slice(0, 14) || 'Your brand'} />
          <p className="nk-fine">
            {typed
              ? 'That name comes from the field you just typed in. Nothing is sent until you press Send.'
              : 'The name on the phone is a placeholder until you type your store.'}
          </p>
        </div>
      </section>
    </div>
  )
}

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
