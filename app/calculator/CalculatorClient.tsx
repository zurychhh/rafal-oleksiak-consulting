'use client'

/* /calculator v2 — jedno pytanie, trzy pola, jeden suwak, jedna liczba.
   Nic, co wpisuje odwiedzajacy, nie opuszcza strony: ten plik nie wywoluje fetch,
   nie zapisuje do storage i nie wysyla zdarzen analitycznych. Formularz Enquiry
   wysyla wylacznie wlasne pola (adres sklepu, e-mail, zgody). */

import { useEffect, useRef, useState } from 'react'
import { Enquiry } from '../nawyko/NawykoClient'
import { YEAR, gapValue, orderDays, parseNum, targetRange } from './model'

// Wartosci startowe to PRZYKLAD (oznaczony na stronie), nie dane rynkowe.
const EX = { customers: '4,000', aov: '120', gap: '58', target: 50 }

const n0 = (v: number) => Math.round(v).toLocaleString('en-US')
const n2 = (v: number) => v.toLocaleString('en-US', { maximumFractionDigits: 2 })
const big = (v: number) => (Math.round(v) > 0 ? '+' : '') + n0(v)
/* Liczba pojedyncza tylko dla dokladnie "1" po sformatowaniu ("1.01 orders", "1.0 orders" zostaja w mnogiej). */
const per = (shown: string, one: string, many: string) => (shown === '1' ? one : many)

const EX_BIG = big(gapValue({ customers: 4000, aov: 120, gapNow: 58, gapTarget: EX.target }).extraRevenue)

type Check = { v: number | null; hint: string | null }

function check(raw: string, label: string, min: number, max: number, whole = false): Check {
  const p = parseNum(raw)
  if (raw.trim() === '') return { v: null, hint: `${label}: type a number.` }
  if (p === undefined) return { v: null, hint: `${label}: digits only.` }
  if (p < min) return { v: null, hint: min > 1 ? `${label}: ${min} or more.` : `${label}: more than zero.` }
  if (p > max) return { v: null, hint: `${label}: ${n0(max)} at most.` }
  return { v: whole ? Math.round(p) : p, hint: null }
}

function Ticks({ days, pool, base }: { days: number[]; pool: number; base: number }) {
  const out = []
  for (let k = 0; k < pool; k++) {
    const on = k < days.length
    const f = on ? days[k] / YEAR : 1 // schowane kreski czekaja na prawej krawedzi roku
    out.push(
      <i
        key={k}
        className={k >= base ? 'is-new' : undefined}
        style={{ transform: `translateX(calc(${(f * 100).toFixed(3)}cqw - 2px))`, opacity: on ? 1 : 0 }}
      />,
    )
  }
  return <>{out}</>
}

export function Calculator() {
  const [c, setC] = useState(EX.customers)
  const [a, setA] = useState(EX.aov)
  const [g, setG] = useState(EX.gap)
  const [ratio, setRatio] = useState(EX.target / Number(EX.gap))
  const [edited, setEdited] = useState(false)
  const [said, setSaid] = useState('')
  const [open, setOpen] = useState(false)
  /* Podpowiedz gestu (Rafal 22.11 18:20: ma byc widac, ze suwakiem sie kreci): znika po pierwszym ruchu. */
  const [touched, setTouched] = useState(false)
  const [nudge, setNudge] = useState(false)
  const slideRef = useRef<HTMLDivElement>(null)

  const cc = check(c, 'Repeat customers', 1, 100_000_000)
  const ca = check(a, 'Order value', 0, 1_000_000)
  const cg = check(g, 'Days between orders', 7, YEAR, true)
  if (ca.v === 0) {
    ca.v = null
    ca.hint = 'Order value: more than zero.'
  }
  const hint = cc.hint || ca.hint || cg.hint
  const valid = cc.v !== null && ca.v !== null && cg.v !== null

  const gapNow = cg.v ?? Number(EX.gap)
  const range = targetRange(gapNow)
  const target = Math.min(range.max, Math.max(range.min, Math.round(gapNow * ratio)))
  const cut = gapNow - target

  const res = valid ? gapValue({ customers: cc.v!, aov: ca.v!, gapNow, gapTarget: target }) : null
  const value = res && res.ok ? res.extraRevenue : null
  const top = valid ? gapValue({ customers: cc.v!, aov: ca.v!, gapNow, gapTarget: range.min }).extraRevenue : 0
  const chars = Math.max(6, big(top).length)

  const daysNow = valid ? orderDays(gapNow) : []
  const daysTarget = valid ? orderDays(target) : []
  const pool = Math.max(orderDays(range.min).length, 1)

  useEffect(() => {
    const el = slideRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setNudge(true)
          io.disconnect()
        }
      },
      { threshold: 0.9 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  /* Liczba: plynne dojscie do nowej wartosci (rAF), bez tweenu przy prefers-reduced-motion. */
  const numRef = useRef<HTMLSpanElement>(null)
  const shown = useRef(value ?? 0)
  useEffect(() => {
    const el = numRef.current
    if (!el) return
    if (value === null) {
      shown.current = 0
      el.textContent = '—'
      return
    }
    const from = shown.current
    const to = value
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (still || Math.round(from) === Math.round(to)) {
      shown.current = to
      el.textContent = big(to)
      return
    }
    let id = 0
    const t0 = performance.now()
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / 260)
      const v = from + (to - from) * (1 - Math.pow(1 - p, 3))
      shown.current = v
      el.textContent = big(v)
      if (p < 1) id = requestAnimationFrame(step)
    }
    id = requestAnimationFrame(step)
    return () => cancelAnimationFrame(id)
  }, [value])

  /* Czytnik ekranu dostaje wynik dopiero, gdy suwak albo pole odpocznie. */
  const say =
    value === null
      ? ''
      : cut > 0
        ? `Extra revenue a year: ${n0(value)}. Gap ${target} days instead of ${gapNow}.`
        : 'Same gap as today. Extra revenue: zero.'
  useEffect(() => {
    const id = window.setTimeout(() => setSaid(say), 700)
    return () => window.clearTimeout(id)
  }, [say])

  /* Link "Talk it through" w naglowku prowadzi do #enquiry: otwiera formularz. */
  useEffect(() => {
    const sync = () => {
      if (window.location.hash === '#enquiry') setOpen(true)
    }
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  const field = (set: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    set(e.target.value)
    setEdited(true)
  }

  return (
    <>
      <section className="gc" aria-labelledby="gc-h1">
        <div className="gc-in">
          <div className="nk-caps nk-lab">Calculator · 30 seconds · no data</div>
          <h1 className="gc-h1" id="gc-h1">
            What is one day between orders worth?
          </h1>
          <p className="gc-lede">Type three numbers, then drag the gap shorter.</p>

          <div className={edited ? 'gc-tag is-own' : 'gc-tag'}>
            <span className="nk-caps">{edited ? 'Your numbers' : 'Example — type your own'}</span>
          </div>
          <div className="gc-fields">
            <label className="gc-f" htmlFor="gc-c">
              <span>Repeat customers</span>
              <input id="gc-c" type="text" inputMode="numeric" autoComplete="off" value={c} onChange={field(setC)} aria-invalid={cc.hint ? true : undefined} aria-describedby="gc-hint" />
            </label>
            <label className="gc-f" htmlFor="gc-a">
              <span>Average order value</span>
              <input id="gc-a" type="text" inputMode="decimal" autoComplete="off" value={a} onChange={field(setA)} aria-invalid={ca.hint ? true : undefined} aria-describedby="gc-hint" />
            </label>
            <label className="gc-f" htmlFor="gc-g">
              <span>Days between orders</span>
              <input id="gc-g" type="text" inputMode="numeric" autoComplete="off" value={g} onChange={field(setG)} aria-invalid={cg.hint ? true : undefined} aria-describedby="gc-hint" />
            </label>
          </div>
          <p className="gc-hint" id="gc-hint">
            {hint ? <strong>{hint}</strong> : 'Nothing you type here leaves this page.'}
          </p>
        </div>

        <div className="gc-out" style={{ ['--ch' as string]: chars }}>
          <div className="nk-caps gc-k">Extra revenue a year</div>
          <div className={value === null ? 'gc-num is-off' : 'gc-num'}>
            <span ref={numRef}>{EX_BIG}</span>
          </div>
          <p className="gc-why">
            {!res ? (
              'Fill in the three fields to see it.'
            ) : cut > 0 ? (
              <>
                <b>+{n2(res.extraOrders)} {per(n2(res.extraOrders), 'order', 'orders')}</b> × {n2(ca.v!)} × {n0(cc.v!)}{' '}
                {per(n0(cc.v!), 'customer', 'customers')}
              </>
            ) : (
              'Same gap as today, so nothing changes. Drag left.'
            )}
          </p>
          <p className="gc-cap">
            {res && cut > 0 ? (
              <>
                One day shorter is worth about <b>{n0(res.extraRevenue / cut)}</b> a year. A ceiling, not a forecast:
                it assumes every repeat customer shifts.
              </>
            ) : (
              'A ceiling, not a forecast: it assumes every repeat customer shifts.'
            )}
          </p>
          <p className="gc-live" aria-live="polite">
            {said}
          </p>

          <div className={`gc-slide${touched ? ' is-touched' : ''}${nudge && !touched ? ' is-nudge' : ''}`} ref={slideRef}>
            <label className="gc-sl" htmlFor="gc-t">
              <span className="nk-caps">Target gap</span>
              <span className="gc-tv">
                <b>{target}</b> days
                {valid && cut > 0 ? <em> −{cut}</em> : null}
              </span>
            </label>
            <input
              id="gc-t"
              className="gc-range"
              type="range"
              min={range.min}
              max={range.max}
              step={1}
              value={target}
              disabled={!valid || range.min === range.max}
              onChange={(e) => {
                setTouched(true)
                setRatio(Number(e.target.value) / gapNow)
              }}
              onPointerDown={() => setTouched(true)}
              aria-valuetext={cut > 0 ? `${target} days between orders, ${cut} fewer than today` : `${target} days between orders, same as today`}
            />
            <p className="gc-gesture" aria-hidden="true">
              <span className="gc-arrow">←</span> Drag to close the gap
            </p>
            <div className="gc-ends">
              <span>{range.min} days</span>
              <span>{range.max} days · today</span>
            </div>
          </div>

          <div className="gc-year" role="img" aria-label={valid ? `One customer, one year: ${daysNow.length} ${per(String(daysNow.length), 'reorder', 'reorders')} today, ${daysTarget.length} at the target gap.` : 'One customer, one year.'}>
            <div className="gc-rowcap">
              <span>Today</span>
              <span>{res ? `${res.ordersNow.toFixed(1)} orders a year` : '—'}</span>
            </div>
            <div className="gc-row is-now">
              <Ticks days={daysNow} pool={Math.max(daysNow.length, 1)} base={999} />
            </div>
            <div className="gc-row">
              <Ticks days={daysTarget} pool={pool} base={daysNow.length} />
            </div>
            <div className="gc-rowcap">
              <span>Target · one customer, 365 days</span>
              <span>
                {valid ? (
                  <>
                    {res ? res.ordersNow.toFixed(1) : '—'} → <b className={cut > 0 ? 'is-new' : undefined}>{res ? res.ordersTarget.toFixed(1) : '—'} orders</b>
                  </>
                ) : (
                  '—'
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="gc-act" id="enquiry">
          <details className="gc-talk" open={open} onToggle={(e) => setOpen(e.currentTarget.open)}>
            <summary className="nk-cta">Talk these numbers through</summary>
            <Enquiry form="calculator" page="/calculator" title="Talk these numbers through" />
          </details>
          <p className="gc-alt">
            Want the exact number from your own orders? <a href="/tool">Measure it — free</a>
          </p>
        </div>
      </section>

      <details className="gc-how">
        <summary>How this is counted</summary>
        <p>
          It is arithmetic on your own numbers: orders a year are 365 divided by the gap. It assumes every repeat
          customer shifts to the target gap, so real results are a fraction of this. The strip shows whole orders
          inside one year; the number uses the average, so part-orders count. The currency is whatever you typed.
        </p>
      </details>
    </>
  )
}
