'use client'

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'

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

/** Becomes true once the element is in view (immediately true without motion). */
function useInView(ref: RefObject<Element | null>, motion: boolean) {
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    if (!motion || !ref.current) return
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [ref, motion])
  return seen || !motion
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
  const t = useTween(true, motion, 2200, 900)
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

/* ── consulting ───────────────────────────────────────────────────────── */
const PROOF = [
  { name: 'GenActiv', status: 'In production', line: 'Current client. Colostrum, Shopify: strategy and build.' },
  { name: 'Allegro', status: 'Closed', line: 'Worked with a data science team on predicting a customer’s next purchase.' },
  { name: 'Accenture', status: 'Closed', line: 'Lifecycle marketing for cosmetics and drugstore brands: the same repeat-purchase problem at retail scale.' },
  { name: 'mBank', status: 'Closed', line: 'Built a retention programme around consumables: coffee, detergents, lenses.' },
  { name: 'Booksy', status: 'Closed', line: 'The same recurring problem on the service side, where the cycle is an appointment rather than a pack.' },
] as const

function Consulting({ motion }: { motion: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInView(ref, motion)
  const t = useTween(seen, motion, 2000, 150)
  return (
    <section id="consulting" className="lh-sec" aria-labelledby="lh-h-con">
      <div className="lh-grid2">
        <div>
          <div className="lh-caps lh-lab">Consulting</div>
          <h2 className="lh-h2" id="lh-h-con">
            Consulting for brands built on repeat orders.
          </h2>
          <div className="lh-fee">
            <p className="lh-price">EUR 2,500 net per month.</p>
            <ul>
              <li>No setup fee. No minimum term.</li>
              <li>Two clients at a time.</li>
              <li>The first month is an as-is audit and the quick wins that come out of it.</li>
            </ul>
          </div>
          <div className="lh-row">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a className="lh-cta" href="/#enquiry">
              Send an enquiry
            </a>
            <a className="lh-cta lh-ghost" href={`mailto:${EMAIL}`}>
              Write an email
            </a>
          </div>
        </div>
        <div ref={ref} className="lh-evidence">
          <div className="lh-caps lh-dim">Source — a real supplement shop, anonymised</div>
          <p className="lh-big">
            The label says {LABEL_DAY} days. The order data says <span className="lh-red">{ACTUAL_DAY}</span>.
          </p>
          <GapAxis t={t} />
        </div>
      </div>
      <div className="lh-proof">
        <div className="lh-caps lh-dim">Record of work</div>
        <ul>
          {PROOF.map((p) => (
            <li key={p.name}>
              <span className="lh-pn">{p.name}</span>
              <span className="lh-ps">{p.status}</span>
              <span className="lh-pl">{p.line}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ── tools ────────────────────────────────────────────────────────────── */
function ExportScene({ t }: { t: number }) {
  // Order rows arrive one by one, then the interval bracket appears.
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

function Tools({ motion }: { motion: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInView(ref, motion)
  const t1 = useTween(seen, motion, 1600, 100)
  const t2 = useTween(seen, motion, 2200, 500)
  return (
    <section id="tools" className="lh-sec lh-tint" aria-labelledby="lh-h-tools">
      <div className="lh-caps lh-lab">Free tools</div>
      <h2 className="lh-h2" id="lh-h-tools">
        Reorder gap and its cost, from store data.
      </h2>
      <div ref={ref} className="lh-tools">
        <article className="lh-tool" aria-labelledby="lh-t1">
          <ExportScene t={t1} />
          <h3 className="lh-h3" id="lh-t1">
            Reorder gap, measured from an order export.
          </h3>
          <p className="lh-sub">
            Paste the order export and the label, and the tool reads both numbers off the data.
          </p>
          <a className="lh-cta lh-ghost" href="/tool">
            Open the tool
          </a>
        </article>
        <article className="lh-tool" aria-labelledby="lh-t2">
          <ShrinkBar t={t2} />
          <h3 className="lh-h3" id="lh-t2">
            What one day between orders is worth.
          </h3>
          <p className="lh-sub">
            Type three numbers from the store and drag the gap between orders.
          </p>
          <a className="lh-cta lh-ghost" href="/calculator">
            Open the calculator
          </a>
        </article>
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
            <p className="lh-lead">Consulting for brands built on repeat orders.</p>
          </div>
          <div className="lh-trio">
            <HeroNawyko motion={motion} />
            <HeroConsulting motion={motion} />
            <HeroTools motion={motion} />
          </div>
        </section>

        <NawykoScene motion={motion} />
        <Consulting motion={motion} />
        <Tools motion={motion} />

        <section id="enquiry" className="lh-sec lh-enq" aria-labelledby="lh-h-enq">
          <div className="lh-caps lh-lab">Enquiry</div>
          <h2 className="lh-h2" id="lh-h-enq">
            Start with the app or a store review.
          </h2>
          <div className="lh-enqgrid">
            <div className="lh-enqcol">
              <div className="lh-caps lh-dim">Nawyko</div>
              <p className="lh-sub">A white-label app for brands whose customers buy again.</p>
              <a className="lh-cta" href="/nawyko#enquiry">
                Ask about Nawyko
              </a>
            </div>
            <div className="lh-enqcol">
              <div className="lh-caps lh-dim">Consulting</div>
              <p className="lh-sub">Reply in 24 hours, with a first observation about the store.</p>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a className="lh-cta" href="/#enquiry">
                Send an enquiry
              </a>
            </div>
          </div>
        </section>
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
