'use client'

import { Fragment, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'

/* /lab/home — proposal for a new homepage. Hand-written, plain CSS (home.css, prefix lh-).
   Every scene renders its FINAL state on the server, under prefers-reduced-motion and
   under navigator.webdriver (QA relies on a static page). Motion only starts on the client.
   Demo brand in the app is the fictional "Tovemi" (agencja/research/marka-pokazowa.md). */

const BRAND = 'Tovemi'
const GOAL = 24
const PACK = 30
const LABEL_DAY = 45
const ACTUAL_DAY = 69
const AXIS_END = 70

const EMAIL = 'rafal@oleksiakconsulting.com'
const LINKEDIN = 'https://www.linkedin.com/in/rafa%C5%82-oleksiak-3b322981/'

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const ease = (t: number) => 1 - Math.pow(1 - t, 3)
const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect

/** true only on the client, when motion is allowed. */
function useMotion() {
  const [m, setM] = useState(false)
  useIso(() => {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches || navigator.webdriver
    if (!still) setM(true)
  }, [])
  return m
}

/** Time-based tween 0..1 once `active` turns true. Without motion: always 1. */
function useTween(active: boolean, motion: boolean, dur = 1800, delay = 0) {
  const [t, setT] = useState(1)
  useIso(() => {
    if (!motion) {
      setT(1)
      return
    }
    setT(0)
    if (!active) return
    let raf = 0
    const start = performance.now() + delay
    const tick = (now: number) => {
      const p = clamp((now - start) / dur)
      setT(p)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, motion, dur, delay])
  return t
}

/** Scroll progress 0..1 of a tall section through the viewport (sticky stage). */
function useScrollProgress(ref: RefObject<HTMLElement | null>, motion: boolean) {
  const [p, setP] = useState(1)
  useEffect(() => {
    if (!motion) {
      setP(1)
      return
    }
    let raf = 0
    const read = () => {
      raf = 0
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const span = r.height - window.innerHeight
      setP(span > 0 ? clamp(-r.top / span) : 1)
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
  }, [ref, motion])
  return p
}

/* ── phone drawing ─────────────────────────────────────────────────────── */
function Phone({ day, size = 'sm' }: { day: number; size?: 'sm' | 'lg' }) {
  const stamped = day >= GOAL
  return (
    <div className={'lh-phone lh-phone-' + size} role="img" aria-label={`${BRAND} app: day ${day} of ${PACK}, streak of ${day} days`}>
      <div className="lh-screen" aria-hidden="true">
        <div className="lh-pbar">
          <span>{BRAND}</span>
          <span>
            Day {day}/{PACK}
          </span>
        </div>
        <div className="lh-pbody">
          <div className="lh-pk">Streak</div>
          <div className="lh-count">
            <b>{day}</b>
            <span>days</span>
          </div>
          <div className="lh-pcells">
            {Array.from({ length: PACK }, (_, i) => (
              <i key={i} className={(i < day ? 'is-on' : '') + (i === GOAL - 1 ? ' is-goal' : '')} />
            ))}
          </div>
          <div className={'lh-pstamp' + (stamped ? ' is-on' : '')}>
            <span>Stamp</span>
            <span>{stamped ? 'Earned' : `Day ${GOAL}`}</span>
          </div>
          <div className="lh-pcard">
            <span className="lh-pk">Today</span>
            <span className="lh-pscratch">{stamped ? 'Next-pack discount' : 'Scratch the card'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── hero scenes ───────────────────────────────────────────────────────── */
function HeroNawyko({ motion }: { motion: boolean }) {
  const t = useTween(true, motion, 2600, 300)
  const day = Math.max(1, Math.round(ease(t) * GOAL))
  return (
    <article className="lh-card lh-card-app" aria-labelledby="lh-c1">
      <div className="lh-cardtext">
        <div className="lh-caps lh-lab">Nawyko · white-label app</div>
        <h2 className="lh-h3" id="lh-c1">
          A branded app for daily product use.
        </h2>
        <p className="lh-sub">
          The customer scratches one card a day. The brand sees the real rhythm of use.
        </p>
        <a className="lh-more" href="#nawyko">
          See how it works
        </a>
      </div>
      <div className="lh-cardart">
        <Phone day={day} />
      </div>
    </article>
  )
}

function GapAxis({ t, compact }: { t: number; compact?: boolean }) {
  const actual = ease(t)
  const pos = (d: number) => `${(d / AXIS_END) * 100}%`
  return (
    <div className={'lh-axis' + (compact ? ' is-compact' : '')} role="img" aria-label={`Label: ${LABEL_DAY} days. Actual gap to the second order: ${ACTUAL_DAY} days.`}>
      <div className="lh-axisrow" aria-hidden="true">
        <span className="lh-axislab">Label</span>
        <div className="lh-track">
          <i className="lh-fill lh-fill-ink" style={{ width: pos(LABEL_DAY) }} />
          <em style={{ left: pos(LABEL_DAY) }}>{LABEL_DAY}</em>
        </div>
      </div>
      <div className="lh-axisrow" aria-hidden="true">
        <span className="lh-axislab">Orders</span>
        <div className="lh-track">
          <i className="lh-fill lh-fill-red" style={{ width: `calc(${pos(ACTUAL_DAY)} * ${actual})` }} />
          <em className="lh-red" style={{ left: `calc(${pos(ACTUAL_DAY)} * ${actual})`, opacity: t > 0.85 ? 1 : 0 }}>
            {ACTUAL_DAY}
          </em>
        </div>
      </div>
      <div className="lh-ticks" aria-hidden="true">
        <span>1</span>
        <span>{AXIS_END}</span>
      </div>
    </div>
  )
}

function HeroConsulting({ motion }: { motion: boolean }) {
  const t = useTween(true, motion, 900, 100)
  return (
    <article className="lh-card" aria-labelledby="lh-c2">
      <div className="lh-caps lh-lab">Consulting · repeat-purchase brands</div>
      <h2 className="lh-h3" id="lh-c2">
        The reorder date, measured from real orders.
      </h2>
      <GapAxis t={t} compact />
      <a className="lh-more" href="#consulting">
        See consulting terms
      </a>
    </article>
  )
}

function ShrinkBar({ t }: { t: number }) {
  // Empty days between the label date and the actual reorder shrink as the gap closes.
  const gap = ACTUAL_DAY - LABEL_DAY
  const left = Math.round(gap - (gap - 4) * ease(t))
  return (
    <div className="lh-shrink" role="img" aria-label="The empty days between the label date and the next order shrink">
      <div className="lh-shrinkrow" aria-hidden="true">
        <i className="lh-shrinkfull" />
        {Array.from({ length: gap }, (_, i) => (
          <i key={i} className={'lh-shrinkday' + (i < left ? '' : ' is-gone')} />
        ))}
      </div>
      <div className="lh-shrinkcap" aria-hidden="true">
        <span>Pack in use</span>
        <span>Days without the product</span>
      </div>
    </div>
  )
}

function HeroTools({ motion }: { motion: boolean }) {
  const t = useTween(true, motion, 2400, 1500)
  return (
    <article className="lh-card" aria-labelledby="lh-c3">
      <div className="lh-caps lh-lab">Free tools</div>
      <h2 className="lh-h3" id="lh-c3">
        Measure the gap between orders.
      </h2>
      <ShrinkBar t={t} />
      <div className="lh-links">
        <a className="lh-more" href="/tool">
          Measure from an order export
        </a>
        <a className="lh-more" href="/calculator">
          Price one day between orders
        </a>
      </div>
    </article>
  )
}

/* ── Nawyko scroll scene ──────────────────────────────────────────────── */
const STEPS = [
  { t: 'Confirm the pack', d: 'The customer scans the barcode on the box or the receipt.', from: 0 },
  { t: 'Scratch one card a day', d: 'After the daily dose there is one card to scratch.', from: 2 },
  { t: 'Build the streak', d: 'Every scratched card is a day in the grid.', from: 8 },
  { t: 'Unlock a reward they saw coming', d: 'The list of rewards is on screen from day one.', from: 20 },
] as const

const REWARDS = [
  { name: 'Free shipping', note: 'on the next order', at: 7 },
  { name: `Stamp · ${GOAL} of ${PACK} days`, note: 'six days of slack built in', at: GOAL },
  { name: 'Next-pack discount', note: 'a code that only works on a reorder', at: GOAL },
] as const

function NawykoScene({ motion }: { motion: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const p = useScrollProgress(ref, motion)
  const day = Math.max(1, Math.round(clamp((p - 0.06) / 0.82) * (GOAL - 1)) + 1)
  const active = STEPS.reduce((a, s, i) => (day >= s.from + 1 ? i : a), 0)
  return (
    <section ref={ref} id="nawyko" className={'lh-app' + (motion ? ' is-scroll' : '')} aria-labelledby="lh-h-app">
      <div className="lh-stage">
        <div className="lh-apptext">
          <div className="lh-caps lh-lab">Nawyko · for brands whose customers buy again</div>
          <h2 className="lh-h2" id="lh-h-app">
            Daily use, tracked in the brand&rsquo;s own app.
          </h2>
          <ol className="lh-steps">
            {STEPS.map((s, i) => (
              <li key={s.t} className={i <= active ? 'is-on' : ''}>
                <span className="lh-n">0{i + 1}</span>
                <span className="lh-st">{s.t}</span>
                <span className="lh-sd">{s.d}</span>
              </li>
            ))}
          </ol>
          <ul className="lh-rewards" aria-label="Rewards known in advance">
            {REWARDS.map((r) => (
              <li key={r.name} className={day >= r.at ? 'is-got' : ''}>
                <span className="lh-rn">{r.name}</span>
                <span className="lh-rnote">{r.note}</span>
              </li>
            ))}
          </ul>
          <p className="lh-sub lh-appline">The brand gets a reason for the next order and the real rhythm of use.</p>
          <div className="lh-row">
            <a className="lh-cta" href="/nawyko#enquiry">
              Ask about Nawyko
            </a>
            <a className="lh-cta lh-ghost" href="/nawyko">
              See it work
            </a>
          </div>
        </div>
        <div className="lh-appart">
          <Phone day={day} size="lg" />
          <div className="lh-strip" aria-hidden="true">
            {Array.from({ length: PACK }, (_, i) => (
              <i key={i} className={(i < day ? 'is-on' : '') + (i === GOAL - 1 ? ' is-goal' : '')} />
            ))}
          </div>
          <div className="lh-stripcap" aria-hidden="true">
            <span>One pack, {PACK} days</span>
            <span>Day {GOAL}: the stamp</span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── second half: one thought = one scene ─────────────────────────────── */
/** Progress 0..1 while an element travels from the bottom edge to ~35% of the viewport. */
function useViewProgress(ref: RefObject<HTMLElement | null>, motion: boolean) {
  const [p, setP] = useState(1)
  useEffect(() => {
    if (!motion) {
      setP(1)
      return
    }
    let raf = 0
    const read = () => {
      raf = 0
      const el = ref.current
      if (!el) return
      const vh = window.innerHeight
      setP(clamp((vh - el.getBoundingClientRect().top) / (vh * 0.65)))
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
  }, [ref, motion])
  return p
}

/** Fades and lifts a block in as `t` goes from `a` to `b` (transform + opacity only). */
const rise = (t: number, a = 0, b = 1) => {
  const k = ease(clamp((t - a) / (b - a)))
  return { opacity: k, transform: `translate3d(0,${(1 - k) * 24}px,0)` }
}

/* scene 1 — the evidence, drawn by scroll */
function GapScene({ motion }: { motion: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const p = useViewProgress(ref, motion)
  return (
    <section ref={ref} id="consulting" className="lh-sec lh-scene" aria-labelledby="lh-h-gap">
      <div className="lh-caps lh-lab">Consulting</div>
      <h2 className="lh-h2 lh-wide" id="lh-h-gap" style={rise(p, 0, 0.35)}>
        Stop buying back customers who were already coming back.
      </h2>
      <div className="lh-evidence" style={rise(p, 0.2, 0.5)}>
        <p className="lh-big">
          The label says {LABEL_DAY} days. The order data says <span className="lh-red">{ACTUAL_DAY}</span>.
        </p>
        <GapAxis t={clamp((p - 0.35) / 0.65)} />
      </div>
    </section>
  )
}

/* scene 2 — the terms, one line at a time */
const TERMS = ['No setup fee. No minimum term.', 'Two clients at a time.', 'Month one: your store as it is, and the fixes to ship first.'] as const

function TermsScene({ motion }: { motion: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const p = useViewProgress(ref, motion)
  return (
    <section ref={ref} className="lh-sec lh-tint lh-scene" aria-labelledby="lh-h-terms">
      <div className="lh-terms">
        <h2 className="lh-h2" id="lh-h-terms" style={rise(p, 0, 0.3)}>
          Your store reviewed and fixes listed, for one flat fee.
        </h2>
        <div>
          <p className="lh-price" style={rise(p, 0.15, 0.45)}>
            EUR 2,500 net per month.
          </p>
          <ul className="lh-termlist">
            {TERMS.map((x, i) => (
              <li key={x} style={rise(p, 0.3 + i * 0.15, 0.55 + i * 0.15)}>
                {x}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* scene 3 — record of work, rows slide in on scroll (lines verbatim) */
const PROOF = [
  { name: 'GenActiv', status: 'In production', line: 'Current client. Colostrum, Shopify: strategy and build.' },
  { name: 'Allegro', status: 'Closed', line: 'Worked with a data science team on predicting a customer’s next purchase.' },
  { name: 'Accenture', status: 'Closed', line: 'Lifecycle marketing for cosmetics and drugstore brands: the same repeat-purchase problem at retail scale.' },
  { name: 'mBank', status: 'Closed', line: 'Built a retention programme around consumables: coffee, detergents, lenses.' },
  { name: 'Booksy', status: 'Closed', line: 'The same recurring problem on the service side, where the cycle is an appointment rather than a pack.' },
] as const

function ProofScene({ motion }: { motion: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const p = useViewProgress(ref, motion)
  return (
    <section ref={ref} className="lh-sec lh-scene" aria-labelledby="lh-h-proof">
      <div className="lh-caps lh-lab">Record of work</div>
      <h2 className="lh-h2 lh-wide" id="lh-h-proof" style={rise(p, 0, 0.3)}>
        Brands like yours that already work this way.
      </h2>
      <ul className="lh-proof">
        {PROOF.map((x, i) => {
          const k = ease(clamp((p - 0.15 - i * 0.12) / 0.3))
          return (
            <li key={x.name} style={{ opacity: k, transform: `translate3d(${(1 - k) * -32}px,0,0)` }}>
              <span className="lh-pn">{x.name}</span>
              <span className="lh-ps">{x.status}</span>
              <span className="lh-pl">{x.line}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

/* scene 4 — tools: order rows arrive, the empty days shrink */
function ExportScene({ t }: { t: number }) {
  const rows = ['Order', 'Order', 'Order', 'Order']
  const shown = Math.ceil(ease(t) * rows.length)
  return (
    <div className="lh-export" role="img" aria-label="Order rows from an export turn into the gap between orders">
      <div className="lh-rows" aria-hidden="true">
        {rows.map((r, i) => (
          <span key={i} className={i < shown ? 'is-on' : ''}>
            <b>{r}</b>
            <i />
          </span>
        ))}
      </div>
      <div className={'lh-bracket' + (t > 0.9 ? ' is-on' : '')} aria-hidden="true">
        <span>Gap between orders</span>
      </div>
    </div>
  )
}

function ToolsScene({ motion }: { motion: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const p = useViewProgress(ref, motion)
  return (
    <section ref={ref} id="tools" className="lh-sec lh-tint lh-scene" aria-labelledby="lh-h-tools">
      <div className="lh-caps lh-lab">Free tools</div>
      <h2 className="lh-h2 lh-wide" id="lh-h-tools" style={rise(p, 0, 0.3)}>
        See the days your customers go without your product.
      </h2>
      <p className="lh-sub lh-scenesub" style={rise(p, 0.1, 0.4)}>
        Paste your order export: see the gap and what it costs you.
      </p>
      <div className="lh-tools">
        <article className="lh-tool" aria-label="Gap tool" style={rise(p, 0.2, 0.5)}>
          <ExportScene t={clamp((p - 0.3) / 0.5)} />
          <a className="lh-cta lh-ghost" href="/tool">
            Open the tool
          </a>
        </article>
        <article className="lh-tool" aria-label="Calculator" style={rise(p, 0.3, 0.6)}>
          <ShrinkBar t={clamp((p - 0.45) / 0.55)} />
          <a className="lh-cta lh-ghost" href="/calculator">
            Open the calculator
          </a>
        </article>
      </div>
    </section>
  )
}

/* finale — the closing sentence from production, revealed word by word by scroll */
const FINALE = "You don't pay twice for the same customer.".split(' ')

function Finale({ motion }: { motion: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const p = useScrollProgress(ref, motion)
  const n = FINALE.length
  return (
    <section ref={ref} id="enquiry" className={'lh-fin' + (motion ? ' is-scroll' : '')} aria-labelledby="lh-h-fin">
      <div className="lh-finstage">
        <h2 className="lh-fintext" id="lh-h-fin" aria-label={FINALE.join(' ')}>
          {FINALE.map((w, i) => {
            const k = ease(clamp((p - 0.08 - (i * 0.6) / n) / 0.14))
            return (
              <Fragment key={i}>
                <span className="lh-w" aria-hidden="true">
                  <span style={{ transform: `translate3d(0,${(1 - k) * 105}%,0)` }}>{w}</span>
                </span>{' '}
              </Fragment>
            )
          })}
        </h2>
        <div className="lh-finfoot" style={rise(p, 0.72, 0.9)}>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a className="lh-cta" href="/#enquiry">
            Ask how to bring customers back sooner
          </a>
        </div>
      </div>
    </section>
  )
}

/* ── page ─────────────────────────────────────────────────────────────── */
export function HomeLab() {
  const motion = useMotion()
  return (
    <div className="lh">
      <a className="lh-skip" href="#main">
        Skip to content
      </a>
      <header className="lh-top">
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a className="lh-caps lh-home" href="/">
          Rafał Oleksiak
        </a>
        <nav className="lh-nav" aria-label="Main">
          <a href="/nawyko">Nawyko</a>
          <a href="/calculator">Calculator</a>
          <a href="/tool">Gap tool</a>
          <a className="lh-u" href="#enquiry">
            Enquire
          </a>
        </nav>
      </header>

      <main id="main">
        <section className="lh-hero" aria-labelledby="lh-h1">
          <div className="lh-herohead">
            <h1 className="lh-h1" id="lh-h1">
              You don&rsquo;t pay twice for the same customer.
            </h1>
            <p className="lh-lead">Keep customers reordering: an app under your brand, consulting, free tools.</p>
          </div>
          <div className="lh-trio">
            <HeroNawyko motion={motion} />
            <HeroConsulting motion={motion} />
            <HeroTools motion={motion} />
          </div>
        </section>

        <NawykoScene motion={motion} />
        <GapScene motion={motion} />
        <TermsScene motion={motion} />
        <ProofScene motion={motion} />
        <ToolsScene motion={motion} />
        <Finale motion={motion} />
      </main>

      <footer className="lh-foot">
        <span>Rafał Oleksiak · Oleksiak Consulting · Warsaw</span>
        <nav aria-label="Footer">
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <a href={LINKEDIN} rel="noopener">
            LinkedIn
          </a>
          <a href="/cv">CV</a>
          <a href="/privacy">Privacy</a>
        </nav>
      </footer>
    </div>
  )
}
