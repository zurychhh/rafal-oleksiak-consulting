'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { YEAR, gapScenario, orderDays, parseNum, secondScenario } from './model'

/* Kalkulator: ile jest wart krotszy odstep miedzy zamowieniami.
   Wynik liczy sie wylacznie z pol na ekranie. Wartosci startowe to PRZYKLAD,
   opisany jako przyklad przy kazdym polu i przy wyniku, dopoki odwiedzajacy ich
   nie zmieni. Nic z tych pol nie jest nigdzie wysylane (brak fetch w tym pliku). */

const EXAMPLE = { customers: '4 000', aov: '120', gapNow: '58', packDays: '30', margin: '', target: 45 }
const EXAMPLE_B = { newCustomers: '6 000', rateNow: '22', target: 27 }

const nf0 = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
const nf1 = new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
const money = (v: number) => nf0.format(Math.round(v))
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

function capFor(done: number, all: number) {
  return done === 0
    ? 'Example numbers — replace them with yours'
    : done < all
      ? 'Partly example numbers — replace the rest'
      : 'From the numbers you typed'
}

function bigClass(text: string) {
  return 'gc-big' + (text.length > 13 ? ' is-xl' : text.length > 9 ? ' is-long' : '')
}

function reducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

type FieldProps = {
  label: string
  help: string
  value: string
  onChange: (v: string) => void
  example: boolean
  unit?: string
  invalid?: boolean
  optional?: boolean
  error?: string
  max?: number
}

function Field({ label, help, value, onChange, example, unit, invalid, optional, error, max = 9 }: FieldProps) {
  const id = useId()
  return (
    <div className={'gc-field' + (invalid ? ' is-bad' : '')}>
      <label htmlFor={id}>
        {label}
        {optional ? <em> · optional</em> : null}
      </label>
      <div className="gc-inp">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          maxLength={max}
          aria-describedby={example ? id + 'e ' + id + 'h' : id + 'h'}
          aria-invalid={invalid || undefined}
          onChange={(e) => onChange(e.target.value)}
          onFocus={(e) => e.currentTarget.select()}
        />
        {unit ? <span className="gc-unit">{unit}</span> : null}
        <span className="gc-ex" id={id + 'e'}>
          {example ? 'example' : ''}
        </span>
      </div>
      <p id={id + 'h'} className="gc-help">
        {invalid ? (error ?? 'Needs a number above zero.') + ' ' : ''}
        {help}
      </p>
    </div>
  )
}

/* Jeden klient, jeden rok. Kreska = zamowienie, pelny pasek = dni z produktem,
   pusta przerwa = dni, w ktorych produkt sie skonczyl, a zamowienia jeszcze nie ma. */
function YearRow({ gap, pack, label, tone }: { gap: number; pack: number | null; label: string; tone: 'now' | 'next' }) {
  const days = orderDays(gap)
  return (
    <div className={'gc-row is-' + tone}>
      <div className="gc-rowhead">
        <span>{label}</span>
        <span>
          every <b>{nf0.format(gap)}</b> days · <b>{nf1.format(YEAR / gap)}</b> orders a year
        </span>
      </div>
      <div className={'gc-track' + (days.length > 30 ? ' is-dense' : '')} aria-hidden="true">
        {days.map((d, i) => {
          const run = Math.min(gap, YEAR - d)
          const cover = pack === null ? 0 : Math.min(pack, run)
          return (
            <i
              key={i}
              className="gc-order"
              style={{ left: (d / YEAR) * 100 + '%', width: (run / YEAR) * 100 + '%' }}
            >
              <u style={{ width: run > 0 ? (cover / run) * 100 + '%' : 0 }} />
            </i>
          )
        })}
      </div>
    </div>
  )
}

export function GapCalculator() {
  const [f, setF] = useState(EXAMPLE)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [live, setLive] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const played = useRef(false)
  const userMoved = useRef(false)

  const set = (k: keyof typeof EXAMPLE) => (v: string) => {
    userMoved.current = true
    setF((p) => ({ ...p, [k]: v }))
    setTouched((p) => ({ ...p, [k]: true }))
  }

  const customers = parseNum(f.customers)
  const aov = parseNum(f.aov)
  const gapNow = parseNum(f.gapNow)
  const packDays = parseNum(f.packDays)
  const margin = parseNum(f.margin)

  const t0 = gapNow && gapNow > 0 ? Math.round(gapNow) : 0
  const pack = packDays && packDays > 0 ? Math.round(packDays) : null
  // Suwak: od dnia, w ktorym konczy sie opakowanie (albo 1/3 odstepu, gdy go nie znamy), do dzisiejszego odstepu.
  const lo = t0 ? (pack !== null && pack < t0 ? pack : pack !== null ? t0 : Math.max(1, Math.ceil(t0 / 3))) : 1
  const hi = Math.max(lo, t0 || 1)
  const t1 = clamp(f.target, lo, hi)
  const locked = !t0 || lo >= hi

  const r = useMemo(
    () => gapScenario({ customers: customers ?? 0, aov: aov ?? 0, gapNow: t0, gapTarget: t1, packDays: pack ?? undefined, marginPct: margin }),
    [customers, aov, t0, t1, pack, margin],
  )

  const cap = capFor(['customers', 'aov', 'gapNow'].filter((k) => touched[k]).length, 3)
  const noSlack = r.ok && r.notes.includes('no-slack')

  // Pierwsze wejscie w kadr: suwak sam przejezdza od dzisiejszego odstepu do docelowego —
  // pokazuje, co robi, zanim ktokolwiek go dotknie. Raz, nigdy po dotknieciu, nigdy przy reduced-motion.
  useEffect(() => {
    const el = rootRef.current
    if (!el || played.current || reducedMotion() || !('IntersectionObserver' in window)) return
    let raf = 0
    const io = new IntersectionObserver(
      (es) => {
        if (!es.some((e) => e.isIntersecting) || played.current) return
        played.current = true
        io.disconnect()
        if (userMoved.current) return
        const from = Number(parseNum(EXAMPLE.gapNow))
        const to = EXAMPLE.target
        const t = performance.now()
        const step = (now: number) => {
          if (userMoved.current) return
          const p = clamp((now - t - 250) / 1500, 0, 1)
          const e = 1 - Math.pow(1 - p, 3)
          setF((prev) => ({ ...prev, target: Math.round(from + (to - from) * e) }))
          if (p < 1) raf = requestAnimationFrame(step)
        }
        setF((prev) => ({ ...prev, target: from }))
        raf = requestAnimationFrame(step)
      },
      { threshold: 0.45 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])

  // Czytnik ekranu dostaje jedno zdanie po zatrzymaniu zmian, nie kazda klatke suwaka.
  useEffect(() => {
    if (!userMoved.current) return
    const id = setTimeout(() => {
      setLive(
        r.ok
          ? `Reordering every ${t1} days instead of ${t0}: ${money(r.extraRevenue)} more revenue a year, in your currency.`
          : 'Fill in customers, order value and the current gap to see a result.',
      )
    }, 700)
    return () => clearTimeout(id)
  }, [r.ok, r.extraRevenue, t0, t1])

  const bad = (k: 'customers' | 'aov' | 'gapNow') => !!touched[k] && r.missing.includes(k)

  return (
    <div className="gc" ref={rootRef}>
      <div className="gc-inputs">
        <Field
          label="Customers who reorder"
          help="Customers with two or more orders in the last 12 months."
          value={f.customers}
          onChange={set('customers')}
          example={!touched.customers}
          invalid={bad('customers')}
        />
        <Field
          label="Average order value"
          help="Net revenue divided by orders. Any currency."
          value={f.aov}
          onChange={set('aov')}
          example={!touched.aov}
          invalid={bad('aov')}
        />
        <Field
          label="Days between orders today"
          help="Average days between two orders from the same customer. Whole days."
          value={f.gapNow}
          onChange={set('gapNow')}
          example={!touched.gapNow}
          unit="days"
          max={5}
          error="Needs at least one whole day."
          invalid={bad('gapNow')}
        />
        <Field
          label="Days one order lasts"
          help="Servings ÷ servings a day × packs in a typical order. From your own label."
          value={f.packDays}
          onChange={set('packDays')}
          example={!touched.packDays}
          unit="days"
          max={5}
          optional
        />
        <Field
          label="Gross margin"
          help="Leave empty to see revenue only."
          value={f.margin}
          onChange={set('margin')}
          example={false}
          unit="%"
          max={5}
          optional
        />
      </div>

      <div className="gc-inst">
        <div className="gc-instcap nk-caps">One customer · one year</div>
        {t0 ? (
          <>
            <YearRow gap={t0} pack={pack} label="Today" tone="now" />
            <YearRow gap={t1} pack={pack} label="Target" tone="next" />
          </>
        ) : (
          <p className="gc-empty">Type the days between orders to draw the year.</p>
        )}
        <div className="gc-axis" aria-hidden="true">
          <span>day 1</span>
          <span>day 365</span>
        </div>
        <ul className="gc-key" aria-hidden="true">
          <li>
            <i className="k-order" /> an order
          </li>
          {pack !== null ? (
            <>
              <li>
                <i className="k-cover" /> days with product
              </li>
              <li>
                <i className="k-gap" /> ran out, not reordered yet
              </li>
            </>
          ) : null}
        </ul>

        <div className="gc-slide">
          <label htmlFor="gc-t1">
            <span className="nk-caps">Target gap</span>
            <output htmlFor="gc-t1">
              <b>{t0 ? t1 : '–'}</b> days
            </output>
          </label>
          <input
            id="gc-t1"
            type="range"
            min={lo}
            max={hi}
            step={1}
            value={hi + lo - t1}
            disabled={locked}
            aria-describedby="gc-t1d"
            aria-valuetext={`${t1} days between orders`}
            style={{ ['--f' as string]: hi > lo ? (hi - t1) / (hi - lo) : 0 }}
            onChange={(e) => {
              userMoved.current = true
              const v = hi + lo - Number(e.target.value)
              setF((p) => ({ ...p, target: v }))
            }}
          />
          <span id="gc-t1d" hidden>
            Right is a shorter gap.
          </span>
          <div className="gc-ends">
            <span>{t0 ? `${hi} · today` : ''}</span>
            <span>{t0 ? (pack !== null && pack < t0 ? `${lo} · the day the pack ends` : `${lo}`) : ''}</span>
          </div>
        </div>
      </div>

      <div className="gc-out">
        <div className="nk-caps gc-outcap">
          {cap}
        </div>
        {noSlack ? (
          <p className="gc-empty gc-flat">
            Customers already reorder as fast as one order runs out, so there is no gap to shorten.{' '}
            <a href="#second">Look at the second order instead.</a>
            <span className="gc-after">
              <a className="nk-cta nk-ghost" href="#enquiry">
                Talk these numbers through
              </a>
            </span>
          </p>
        ) : r.ok ? (
          <>
            <p className={bigClass(money(r.extraRevenue))}>
              <span className="gc-plus">+</span>
              <b>{money(r.extraRevenue)}</b>
            </p>
            <p className="gc-bigcap">more revenue a year from the same customers, in your currency</p>
            <dl className="gc-facts">
              <div>
                <dt>Uplift</dt>
                <dd>+{nf1.format(r.upliftPct)}%</dd>
              </div>
              <div>
                <dt>One day shorter is worth</dt>
                <dd>{r.perDay > 0 ? money(r.perDay) : '–'}</dd>
              </div>
              <div>
                <dt>{r.extraMargin === null ? 'Revenue today → target' : 'Extra gross margin'}</dt>
                <dd>
                  {r.extraMargin === null ? `${money(r.revenueNow)} → ${money(r.revenueTarget)}` : `+${money(r.extraMargin)}`}
                </dd>
              </div>
              <div>
                <dt>Reorder discount you can afford</dt>
                <dd>
                  up to {nf1.format(r.breakEvenDiscountMargin ?? r.breakEvenDiscountRevenue)}%
                  <small>{r.breakEvenDiscountMargin === null ? 'before revenue drops' : 'before margin drops'}</small>
                </dd>
              </div>
            </dl>
            <ul className="gc-notes">
              {r.daysWithout !== null && r.daysWithout > 0 ? (
                <li>
                  Today a customer spends about <b>{nf0.format(r.daysWithout)} days</b> of every cycle with an empty pack.
                  {r.ceilingRevenue !== null ? (
                    <>
                      {' '}
                      Closing all of them would be worth {money(r.ceilingRevenue)} a year — the ceiling, not a forecast.
                    </>
                  ) : null}
                </li>
              ) : null}
              {r.notes.includes('no-pack') ? (
                <li>Without the days one order lasts there is no ceiling: the slider cannot tell real use from stockpiling.</li>
              ) : null}
              {r.notes.includes('rare') ? (
                <li>More than a year between orders: “customers who reorder” may be the wrong base for this product.</li>
              ) : null}
            </ul>
            <p className="gc-after">
              <a className="nk-cta nk-ghost" href="#enquiry">
                Talk these numbers through
              </a>
              <span>Your numbers stay here. The form sends only what you type into it.</span>
            </p>
          </>
        ) : (
          <p className="gc-empty">Fill in customers, order value and the current gap. The result appears here.</p>
        )}
      </div>
      <p className="gc-sr" aria-live="polite">
        {live}
      </p>
    </div>
  )
}

export function SecondOrder() {
  const [f, setF] = useState({ ...EXAMPLE_B, aov: EXAMPLE.aov })
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const set = (k: 'newCustomers' | 'rateNow' | 'aov') => (v: string) => {
    moved.current = true
    setF((p) => ({ ...p, [k]: v }))
    setTouched((p) => ({ ...p, [k]: true }))
  }
  const c = parseNum(f.newCustomers)
  const aov = parseNum(f.aov)
  const r0raw = parseNum(f.rateNow)
  const r0ok = r0raw !== undefined && r0raw >= 0 && r0raw <= 100
  const r0 = r0ok ? Math.round(r0raw) : 0 // do siatki i suwaka; wzor liczy z wartosci dokladnej
  const r1 = r0ok ? clamp(f.target, Math.ceil(r0raw), 100) : 0
  const s = secondScenario({ newCustomers: c ?? 0, aov: aov ?? 0, rateNow: r0ok ? r0raw : NaN, rateTarget: r1 })
  const [live, setLive] = useState('')
  const moved = useRef(false)
  useEffect(() => {
    if (!moved.current) return
    const id = setTimeout(
      () => setLive(s.ok ? `${r1} percent instead of ${f.rateNow}: ${money(s.extraRevenue)} more from second orders.` : ''),
      700,
    )
    return () => clearTimeout(id)
  }, [s.ok, s.extraRevenue, r1, f.rateNow])
  const cap = capFor(['newCustomers', 'aov', 'rateNow'].filter((k) => touched[k]).length, 3)
  const full = r0ok && r0raw >= 100

  return (
    <div className="gc gc-b">
      <div className="gc-inputs">
        <Field
          label="New customers a year"
          help="Customers whose first order was in the last 12 months."
          value={f.newCustomers}
          onChange={set('newCustomers')}
          example={!touched.newCustomers}
          invalid={!!touched.newCustomers && s.missing.includes('newCustomers')}
        />
        <Field
          label="Average order value"
          help="Same definition as above."
          value={f.aov}
          onChange={set('aov')}
          example={!touched.aov}
          invalid={!!touched.aov && s.missing.includes('aov')}
        />
        <Field
          label="Come back for a second order"
          help="Share of new customers who order again, in the window you normally use."
          value={f.rateNow}
          onChange={set('rateNow')}
          example={!touched.rateNow}
          unit="%"
          max={5}
          error="Needs a percentage from 0 to 100."
          invalid={!!touched.rateNow && !r0ok}
        />
      </div>

      <div className="gc-inst">
        <div className="gc-instcap nk-caps">Out of every 100 new customers</div>
        <div className="gc-hundred" aria-hidden="true">
          {Array.from({ length: 100 }, (_, i) => (
            <i key={i} className={i < r0 ? 'is-in' : i < r1 ? 'is-gain' : ''} />
          ))}
        </div>
        <ul className="gc-key" aria-hidden="true">
          <li>
            <i className="k-cover" /> order again today
          </li>
          <li>
            <i className="k-gain" /> added at the target
          </li>
          <li>
            <i className="k-gap" /> buy once
          </li>
        </ul>
        <div className="gc-slide">
          <label htmlFor="gc-r1">
            <span className="nk-caps">Target share</span>
            <output htmlFor="gc-r1">
              <b>{r0ok ? r1 : '–'}</b>%
            </output>
          </label>
          <input
            id="gc-r1"
            type="range"
            min={r0}
            max={Math.min(100, Math.max(r0 + 1, r0 + 30))}
            step={1}
            value={r1}
            disabled={!r0ok || full}
            aria-valuetext={`${r1} percent place a second order`}
            style={{ ['--f' as string]: clamp((r1 - r0) / Math.max(1, Math.min(100, r0 + 30) - r0), 0, 1) }}
            onChange={(e) => {
              moved.current = true
              const v = Number(e.target.value)
              setF((p) => ({ ...p, target: v }))
            }}
          />
          <div className="gc-ends">
            <span>{r0ok ? `${f.rateNow.trim().replace(',', '.')}% · today` : ''}</span>
            <span>{r0ok ? `${Math.min(100, r0 + 30)}%` : ''}</span>
          </div>
        </div>
      </div>

      <div className="gc-out">
        <div className="nk-caps gc-outcap">
          {cap}
        </div>
        {full ? (
          <p className="gc-empty gc-flat">Every new customer already comes back. There is nothing to add here.</p>
        ) : s.ok ? (
          <>
            <p className={bigClass(money(s.extraRevenue))}>
              <span className="gc-plus">+</span>
              <b>{money(s.extraRevenue)}</b>
            </p>
            <p className="gc-bigcap">from second orders alone, per yearly cohort of new customers, in your currency</p>
            <dl className="gc-facts">
              <div>
                <dt>More customers with a second order</dt>
                <dd>+{nf0.format(s.extraCustomers)}</dd>
              </div>
              <div>
                <dt>Counted</dt>
                <dd>
                  one extra order each
                  <small>third and later orders are left out</small>
                </dd>
              </div>
            </dl>
            <p className="gc-after">
              <a className="nk-cta nk-ghost" href="#enquiry">
                Talk these numbers through
              </a>
            </p>
          </>
        ) : (
          <p className="gc-empty">Fill in the three fields. The result appears here.</p>
        )}
      </div>
      <p className="gc-sr" aria-live="polite">
        {live}
      </p>
    </div>
  )
}
