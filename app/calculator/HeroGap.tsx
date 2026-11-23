'use client'

/* Mini-kalkulator do hero (/nawyko, /lab/home) — spec agencja/specs/08-mini-kalkulator-hero.md.
   Ten sam model co /calculator (gapValue). Nic, co wpisuje odwiedzajacy, nie opuszcza strony:
   zadnego fetch, storage ani zdarzen analitycznych. */

import Link from 'next/link'
import { useId, useState } from 'react'
import { YEAR, gapValue, parseNum } from './model'
import './hero-gap.css'

// Wartosci startowe to PRZYKLAD (oznaczony na ekranie przy polach i przy liczbie), nie dane rynkowe.
const EX = { gap: '58', pack: '30', rev: '480,000' }

const n0 = (v: number) => Math.round(v).toLocaleString('en-US')
const days = (d: number) => `${d} ${d === 1 ? 'day' : 'days'}`

export function HeroGap({ className = '' }: { className?: string }) {
  const id = useId()
  const [g, setG] = useState(EX.gap)
  const [k, setK] = useState(EX.pack)
  const [r, setR] = useState(EX.rev)
  const own = g !== EX.gap || r !== EX.rev || k !== EX.pack

  const whole = (raw: string) => {
    const p = parseNum(raw)
    return p !== undefined ? Math.round(p) : undefined
  }
  const gap = whole(g)
  const pack = whole(k)
  const rp = parseNum(r)
  let hint: string | null = null
  let bad: 'gap' | 'pack' | 'rev' | null = null
  if (gap === undefined || gap < 1) [hint, bad] = ['Days between orders: type a number.', 'gap']
  else if (gap > YEAR) [hint, bad] = [`Days between orders: ${YEAR} at most.`, 'gap']
  else if (pack === undefined || pack < 1) [hint, bad] = ['Pack lasts: type a number of days.', 'pack']
  else if (pack > YEAR) [hint, bad] = [`Pack lasts: ${YEAR} days at most.`, 'pack']
  else if (rp === undefined || rp <= 0) [hint, bad] = ['Revenue from reorders: type a number above zero.', 'rev']
  else if (rp > 1e12) [hint, bad] = ['Revenue from reorders: that number is too large.', 'rev']

  const short = !hint && gap! <= pack!
  const ok = !hint && !short
  // przychod = klienci × zamowienie × 365 / odstep  →  klienci × zamowienie = przychod × odstep / 365
  const value = ok ? gapValue({ customers: 1, aov: (rp! * gap!) / YEAR, gapNow: gap!, gapTarget: pack! }).extraRevenue : null
  const empty = ok ? gap! - pack! : 0
  const p = pack && pack > 0 ? pack : 30
  const cycle = ok ? gap! : p
  const tag = own ? 'Your numbers' : 'Example'
  const say = ok
    ? `${tag}: plus ${n0(value!)} a year if customers reorder when the ${p}-day pack runs out instead of after ${days(gap!)}.`
    : short
      ? 'No gap: customers reorder before the pack runs out.'
      : (hint ?? '')

  const field = (label: string, v: string, set: (s: string) => void, key: typeof bad, unit?: string, mode = 'numeric') => (
    <label className="hg-f">
      <span>{label}</span>
      <span className="hg-in">
        <input
          inputMode={mode as 'numeric' | 'decimal'}
          autoComplete="off"
          value={v}
          aria-invalid={bad === key || undefined}
          onChange={(e) => set(e.target.value)}
        />
        {unit && <em>{unit}</em>}
      </span>
    </label>
  )

  return (
    <section className={'hg ' + className} aria-labelledby={id + 'h'}>
      <h2 className="hg-k" id={id + 'h'}>
        What the gap between packs costs you
      </h2>
      <div className="hg-row">
        {field('Customers reorder every', g, setG, 'gap', 'days')}
        {field('Pack lasts', k, setK, 'pack', 'days')}
        {field('Revenue from reorders a year', r, setR, 'rev', undefined, 'decimal')}
      </div>

      <div className="hg-bar" aria-hidden="true">
        <i className="hg-pack" style={{ transform: `scaleX(${(Math.min(p, cycle) / cycle).toFixed(4)})` }} />
        <i className="hg-gap" style={{ transform: `scaleX(${(empty / cycle).toFixed(4)})` }} />
      </div>
      <div className="hg-cap" aria-hidden="true">
        <span>{p}-day pack</span>
        <span className={ok ? 'is-red' : undefined}>{ok ? `${days(empty)} without your product` : 'No gap'}</span>
      </div>

      <div className="hg-out">
        <div className="hg-tag">{own ? 'Your numbers' : 'Example — type your own'}</div>
        <div className={'hg-num' + (ok ? '' : ' is-off')} aria-hidden="true">
          {ok ? '+' + n0(value!) : '—'}
        </div>
        <p className="hg-why" aria-hidden="true">
          {ok
            ? 'Extra revenue a year, in your currency, if every customer reorders when the pack runs out. Upper limit.'
            : short
              ? 'No gap: customers reorder before the pack runs out.'
              : hint}
        </p>
        <p className="hg-live" aria-live="polite">
          {say}
        </p>
        <Link className="hg-more" href="/calculator">
          Run the full calculator →
        </Link>
      </div>
    </section>
  )
}
