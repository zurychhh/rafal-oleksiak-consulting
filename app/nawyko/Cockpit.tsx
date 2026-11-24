'use client'

/* Spec 27 / 31 (R6 p1): przerywnik „dlaczego” (#why) i kokpit mechanik (#cockpit).
   Kokpit zastepuje dawne sceny „Four steps”, portfel, sciezki/apteke/zgody i „czego nie robi”.
   Lewa strona: ciemny ekran aplikacji klienta w marce i stylu z hero. Prawa: panel marki — jedno zdanie, jedna kontrolka,
   jedna liczba z podpisem „Example”. Wszystkie liczby przykladowe; zadna nie pochodzi od prawdziwej marki. */
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { inkOn, monogram, onColour, useBrand } from '../lib/brand-engine'

const PACK = 30
const SCREEN = '#111215'
const TILE = '#1B1D21'

/* ── przerywnik A: licznik dni zapasu 1 → 30, dzien 31 ── */
export function WhyInterlude() {
  const ref = useRef<HTMLElement>(null)
  const [day, setDay] = useState(PACK)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let still = false
    try {
      still = matchMedia('(prefers-reduced-motion: reduce)').matches
    } catch {
      /* bez matchMedia — stan statyczny */
    }
    if (still) return
    let raf = 0
    const tick = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      // przypieta (wysokosc > ekran): licznik biegnie, gdy sekcja stoi; inaczej — przy wjezdzie na ekran
      const run = r.height - innerHeight
      const t = run > 40 ? Math.min(1, Math.max(0, -r.top / (run * 0.85))) : Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight * 0.9)))
      setDay(Math.max(1, Math.round(1 + t * PACK)))
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    tick()
    addEventListener('scroll', on, { passive: true })
    addEventListener('resize', on)
    return () => {
      removeEventListener('scroll', on)
      removeEventListener('resize', on)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
  const { brand } = useBrand()
  const over = day > PACK
  return (
    <section className="nk-why" id="why" ref={ref} aria-labelledby="nk-why-h">
      <div className="nk-why-in">
        <p className="nk-caps nk-why-k" aria-hidden="true">
          <span className="nk-why-n">{over ? `Day ${PACK + 1}` : `Day ${day} of ${PACK}`}</span>
        </p>
        <h2 className="nk-why-h" id="nk-why-h">
          A pack lasts {PACK} days. On day {PACK + 1}, {brand}’s customer reorders or quietly disappears.
        </h2>
        <div className="nk-why-bar" aria-hidden="true">
          <i style={{ transform: `scaleX(${Math.min(day, PACK) / PACK})` }} />
        </div>
      </div>
    </section>
  )
}

/* ── kokpit ── (R6 p1: na atramencie jak final — recenzja 40 pkt 6) */
const INK_BG = '#0E0F12'
const TABS = [
  { id: 'card', label: 'Daily card' },
  { id: 'streak', label: 'Streak & stamps' },
  { id: 'cash', label: 'Cashback' },
  { id: 'points', label: 'Points & levels' },
  { id: 'paths', label: 'Lessons' },
  { id: 'pharmacy', label: 'Pharmacy purchases' },
  { id: 'consent', label: 'Consents' },
  { id: 'rules', label: 'Fixed rules' },
] as const
type TabId = (typeof TABS)[number]['id']

const LEVELS = [
  { name: 'Bronze', at: 100 },
  { name: 'Silver', at: 250 },
  { name: 'Gold', at: 500 },
] as const
const LOCKS = [
  { id: 'draw', label: 'Random prize draws', why: 'Stays off: rewards are fixed and shown in advance, never drawn at random.' },
  { id: 'claim', label: 'Health claims on cards', why: 'Stays off: the app makes no health claims.' },
  { id: 'swap', label: 'Swap a reward after scratching', why: 'Stays off: a scratched card keeps the reward it showed.' },
] as const

type Cfg = { ship: number; stamp: number; cash: number; pts: number; lessons: number; pharmacy: boolean; push: boolean }
const START: Cfg = { ship: 7, stamp: 24, cash: 2, pts: 10, lessons: 5, pharmacy: true, push: true }

function Range({ label, value, min, max, onChange, unit = '' }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void; unit?: string }) {
  return (
    <label className="nk-kp-ctl">
      <span className="nk-kp-ctl-l">
        {label} <b>{unit}{value}</b>
      </span>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.currentTarget.value))} />
    </label>
  )
}
function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={on} className="nk-kp-sw" onClick={() => onChange(!on)}>
      <span className="nk-kp-sw-t" aria-hidden="true" />
      {label}
    </button>
  )
}

function Screen({ tab, cfg, brand }: { tab: TabId; cfg: Cfg; brand: string }) {
  const day = 18
  const total = cfg.pts * PACK
  const level = [...LEVELS].reverse().find((l) => total >= l.at)
  switch (tab) {
    case 'card':
      return (
        <>
          <p className="nk-kp-k">Today · day {day}</p>
          <div className="nk-kp-card">
            <b>✓ Ticked</b>
            <small>Next card tomorrow</small>
          </div>
          <div className="nk-kp-row">
            <span>Free shipping</span>
            <b>day {cfg.ship}</b>
          </div>
          <div className="nk-kp-meter">
            <i style={{ transform: `scaleX(${Math.min(1, day / cfg.ship)})` }} />
          </div>
          <p className="nk-kp-s">{day >= cfg.ship ? 'Free shipping waiting in the shop' : `${cfg.ship - day} cards to free shipping`}</p>
        </>
      )
    case 'streak':
      return (
        <>
          <p className="nk-kp-k">Stamp after {cfg.stamp} of {PACK} days</p>
          <div className="nk-kp-dots">
            {Array.from({ length: PACK }, (_, i) => (
              <i key={i} className={(i < day ? 'is-in' : '') + (i === cfg.stamp - 1 ? ' is-goal' : '')} />
            ))}
          </div>
          <div className="nk-kp-row">
            <span>Ticked so far</span>
            <b>{day}</b>
          </div>
          <p className="nk-kp-s">{PACK - cfg.stamp > 0 ? `Miss up to ${PACK - cfg.stamp} ${PACK - cfg.stamp === 1 ? 'day' : 'days'} and the stamp stays in reach.` : 'Every day of the pack counts for the stamp.'}</p>
        </>
      )
    case 'cash':
      return (
        <>
          <p className="nk-kp-k">Wallet</p>
          <div className="nk-kp-big">€{(cfg.cash * 3).toFixed(2)}</div>
          <p className="nk-kp-s">After 3 orders · €{cfg.cash} back per order</p>
          <div className="nk-kp-card">
            <b>Use on the next order</b>
            <small>Online shop only</small>
          </div>
        </>
      )
    case 'points':
      return (
        <>
          <p className="nk-kp-k">Points this pack</p>
          <div className="nk-kp-big">{total}</div>
          <p className="nk-kp-s">{cfg.pts} points per ticked day</p>
          {LEVELS.map((l) => (
            <div key={l.name} className={'nk-kp-row' + (total >= l.at ? ' is-on' : '')}>
              <span>{l.name}</span>
              <b>{total >= l.at ? '✓' : `${l.at}`}</b>
            </div>
          ))}
          <p className="nk-kp-s">{level ? `${level.name} level reached` : 'Bronze at 100 points'}</p>
        </>
      )
    case 'paths':
      return (
        <>
          <p className="nk-kp-k">How to use {brand}</p>
          {Array.from({ length: cfg.lessons }, (_, i) => (
            <div key={i} className={'nk-kp-row' + (i < 2 ? ' is-on' : '')}>
              <span>Lesson {i + 1}</span>
              <b>{i < 2 ? '✓' : i === 2 ? 'Next' : ''}</b>
            </div>
          ))}
          <p className="nk-kp-s">One short lesson a day.</p>
        </>
      )
    case 'pharmacy':
      return cfg.pharmacy ? (
        <>
          <p className="nk-kp-k">Bought elsewhere?</p>
          <div className="nk-kp-scan" aria-hidden="true">
            <i />
          </div>
          <div className="nk-kp-card">
            <b>Scan the receipt</b>
            <small>The photo stays on this phone</small>
          </div>
          <p className="nk-kp-s">The streak keeps counting after a pharmacy purchase.</p>
        </>
      ) : (
        <>
          <p className="nk-kp-k">Purchases</p>
          <div className="nk-kp-card">
            <b>Online orders only</b>
            <small>Confirmed from the shop</small>
          </div>
          <p className="nk-kp-s">Receipt scanning is off.</p>
        </>
      )
    case 'consent':
      return (
        <>
          <p className="nk-kp-k">Reminders</p>
          <div className="nk-kp-card">
            <b>{cfg.push ? 'Daily reminder: on' : 'No push questions'}</b>
            <small>{cfg.push ? 'Asked once, change any time' : 'The app never asks'}</small>
          </div>
          <div className="nk-kp-row is-on">
            <span>Rewards</span>
            <b>Same either way</b>
          </div>
          <p className="nk-kp-s">Saying no costs the customer nothing.</p>
        </>
      )
    case 'rules':
      return (
        <>
          <p className="nk-kp-k">Rewards, known up front</p>
          <div className="nk-kp-row is-on">
            <span>Free shipping</span>
            <b>day {cfg.ship}</b>
          </div>
          <div className="nk-kp-row is-on">
            <span>Stamp</span>
            <b>day {cfg.stamp}</b>
          </div>
          <div className="nk-kp-row is-on">
            <span>Next-pack code</span>
            <b>day {cfg.stamp}</b>
          </div>
          <p className="nk-kp-s">Nothing here is drawn at random.</p>
        </>
      )
  }
}

export function Cockpit() {
  const { brand, colour } = useBrand()
  const [at, setAt] = useState(0)
  const [cfg, setCfg] = useState<Cfg>(START)
  const [last, setLast] = useState<number | null>(null)
  const [tries, setTries] = useState<number[]>(() => LOCKS.map(() => 0))
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const set = <K extends keyof Cfg>(k: K, v: Cfg[K]) => setCfg((c) => ({ ...c, [k]: v }))
  const tab = TABS[at].id

  const go = (i: number) => {
    const n = (i + TABS.length) % TABS.length
    setAt(n)
    tabs.current[n]?.focus()
  }
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const k = e.key
    if (k === 'ArrowRight' || k === 'ArrowDown') go(at + 1)
    else if (k === 'ArrowLeft' || k === 'ArrowUp') go(at - 1)
    else if (k === 'Home') go(0)
    else if (k === 'End') go(TABS.length - 1)
    else return
    e.preventDefault()
  }

  const total = cfg.pts * PACK
  /* zdanie dla klienta · kontrolka marki · jedna liczba „Example” */
  const copy: Record<TabId, { feel: string; ctl: React.ReactNode; num: string }> = {
    card: {
      feel: 'One small, satisfying moment after each dose.',
      ctl: <Range label="Free shipping on day" value={cfg.ship} min={3} max={14} onChange={(v) => set('ship', v)} />,
      num: `Example: ${PACK} visits to ${brand} per pack instead of one.`,
    },
    streak: {
      feel:
        cfg.stamp < PACK
          ? `Missed days are allowed: the stamp needs ${cfg.stamp} of ${PACK}, not all ${PACK}.`
          : 'Every day of the pack counts toward the stamp.',
      ctl: <Range label="Stamp after days" value={cfg.stamp} min={20} max={PACK} onChange={(v) => set('stamp', v)} />,
      num: `Example: ${PACK - cfg.stamp} missed ${PACK - cfg.stamp === 1 ? 'day' : 'days'} allowed per pack.`,
    },
    cash: {
      feel: 'Money waiting in the wallet that only works in your shop.',
      ctl: <Range label="Cashback per order" unit="€" value={cfg.cash} min={1} max={5} onChange={(v) => set('cash', v)} />,
      num: `Example: €${cfg.cash * 3} goes back into ${brand}’s next orders, not to a marketplace.`,
    },
    points: {
      feel: 'Progress they can see, a level they do not want to lose.',
      ctl: <Range label="Points per ticked day" value={cfg.pts} min={5} max={20} onChange={(v) => set('pts', v)} />,
      num: `Example: ${total} points in a full pack.`,
    },
    paths: {
      feel: 'Short lessons on how to take and store the product, in your voice.',
      ctl: <Range label="Lessons in the path" value={cfg.lessons} min={3} max={7} onChange={(v) => set('lessons', v)} />,
      num: `Example: ${cfg.lessons} reasons to open the app in the first week.`,
    },
    pharmacy: {
      feel: 'Bought at a pharmacy? The streak still counts.',
      ctl: <Toggle label="Accept pharmacy receipts" on={cfg.pharmacy} onChange={(v) => set('pharmacy', v)} />,
      num: cfg.pharmacy ? 'Example: purchases outside the shop become visible to you.' : 'Example: only online orders count.',
    },
    consent: {
      feel: 'Asked once, plainly. A no changes nothing.',
      ctl: <Toggle label="Ask for daily reminders" on={cfg.push} onChange={(v) => set('push', v)} />,
      num: 'Fixed: rewards never depend on push or e-mail consent.',
    },
    rules: {
      feel: 'Trust: what the card promises is what they get.',
      ctl: (
        <div className="nk-kp-locks">
          {LOCKS.map((l, i) => (
            <button
              key={l.id}
              type="button"
              role="switch"
              aria-checked="false"
              aria-describedby="nk-kp-why"
              className={'nk-kp-sw is-locked' + (tries[i] ? ' is-snap' : '')}
              data-n={tries[i] % 2}
              onClick={() => {
                setLast(i)
                setTries((t) => t.map((n, k) => (k === i ? n + 1 : n)))
              }}
            >
              <span className="nk-kp-sw-t" aria-hidden="true" />
              {l.label}
            </button>
          ))}
          <p className="nk-fine" id="nk-kp-why" aria-live="polite">
            {last === null ? 'Locked for every brand.' : LOCKS[last].why}
          </p>
        </div>
      ),
      num: 'Fixed: 0 random draws, 0 health claims.',
    },
  }
  const c = copy[tab]
  const bg = INK_BG
  const vars = {
    ['--brand' as string]: colour,
    ['--brand-on' as string]: onColour(colour),
    ['--hi' as string]: inkOn(colour, TILE),
    ['--ck-ink' as string]: inkOn(colour, bg),
  }

  return (
    <section className="nk-kp" id="cockpit" aria-labelledby="nk-kp-h" style={vars}>
      <div className="nk-kp-head">
        <p className="nk-caps nk-lab">How it works</p>
        <h2 className="nk-h2" id="nk-kp-h">
          What {brand}’s customers see, and what {brand} sets.
        </h2>
      </div>
      <div className="nk-kp-tabs" role="tablist" aria-label="Mechanics" onKeyDown={onKey}>
        {TABS.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              tabs.current[i] = el
            }}
            type="button"
            role="tab"
            id={`nk-kp-t-${t.id}`}
            aria-selected={i === at}
            aria-controls="nk-kp-panel"
            tabIndex={i === at ? 0 : -1}
            className="nk-kp-tab"
            onClick={() => setAt(i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="nk-kp-stage" role="tabpanel" id="nk-kp-panel" aria-labelledby={`nk-kp-t-${tab}`} tabIndex={0}>
        <div className="nk-kp-phone" aria-label={`${brand} app, ${TABS[at].label} screen, sample data`} role="img">
          <div className="nk-kp-screen" style={{ background: SCREEN }}>
            <div className="nk-hhead">
              <span className="nk-hmono">{monogram(brand)}</span>
              <b className="nk-hname">{brand}</b>
              <span className="nk-hpill">Sample data</span>
            </div>
            <div className="nk-kp-body" key={tab}>
              <Screen tab={tab} cfg={cfg} brand={brand} />
            </div>
          </div>
        </div>
        <div className="nk-kp-panel">
          <p className="nk-caps nk-kp-who">The customer feels</p>
          <p className="nk-kp-feel">{c.feel}</p>
          <p className="nk-caps nk-kp-who">{brand} sets</p>
          {c.ctl}
          <p className="nk-kp-num">{c.num}</p>
        </div>
      </div>
    </section>
  )
}
