'use client'

/* /lab/reward — jedno pytanie, trzy pola, jedna liczba, jeden suwak, jeden krok.
   Liczby na ekranie licza sie WYLACZNIE z pol odwiedzajacego (model.ts). Nic, co wpisuje,
   nie opuszcza strony: zadnego fetch, storage ani zdarzen analitycznych. */

import { useEffect, useState } from 'react'
import { parseNum } from '../../calculator/model'
import { rewardCeiling, verdict } from './model'

// Wartosci startowe to PRZYKLAD (oznaczony na stronie), nie dane rynkowe.
const EX = { aov: '120', margin: '48', extra: '2', share: 50 }

const fmt = (v: number) => v.toLocaleString('en-US', { maximumFractionDigits: Math.abs(v) < 100 ? 2 : 0 })

type Check = { v: number | null; hint: string | null }

function check(raw: string, label: string, max: number): Check {
  if (raw.trim() === '') return { v: null, hint: `${label}: type a number.` }
  const p = parseNum(raw)
  if (p === undefined) return { v: null, hint: `${label}: digits only.` }
  if (p <= 0) return { v: null, hint: `${label}: more than zero.` }
  if (p > max) return { v: null, hint: `${label}: ${fmt(max)} at most.` }
  return { v: p, hint: null }
}

export function Reward() {
  const [a, setA] = useState(EX.aov)
  const [m, setM] = useState(EX.margin)
  const [x, setX] = useState(EX.extra)
  const [share, setShare] = useState(EX.share) // koszt nagrody jako % sufitu, 0–200 (tylko pozycja suwaka)
  const [edited, setEdited] = useState(false)
  const [said, setSaid] = useState('')

  const ca = check(a, 'Order value', 1_000_000)
  const cm = check(m, 'Margin', 1_000_000)
  const cx = check(x, 'Extra orders', 365)
  const res = rewardCeiling({ aov: ca.v ?? NaN, margin: cm.v ?? NaN, extraOrders: cx.v ?? NaN })
  const hint = ca.hint || cm.hint || cx.hint || (res.marginOverAov ? 'Margin: no more than the order value.' : null)

  const ceiling = res.ok ? res.ceiling : 0
  const cost = res.ok ? Math.round((ceiling * share) / 100) : 0
  const v = verdict(ceiling, cost)
  const scale = res.ok ? Math.max(res.extraSales, cost) : 1
  const pct = (n: number) => `${Math.min(100, (n / scale) * 100).toFixed(2)}%`

  const say = res.ok
    ? `Your reward can cost up to ${fmt(ceiling)} per customer a year. At ${fmt(cost)}: ${v.paysOff ? 'pays off' : 'does not pay off'}.`
    : ''
  useEffect(() => {
    const id = window.setTimeout(() => setSaid(say), 700)
    return () => window.clearTimeout(id)
  }, [say])

  const field = (set: (s: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    set(e.target.value)
    setEdited(true)
  }

  return (
    <section className="rw" aria-labelledby="rw-h1">
      <div className="rw-a">
        <div className="nk-caps nk-lab">Tool · 30 seconds</div>
        <h1 className="rw-h1" id="rw-h1">
          What can a loyalty reward cost and still pay off?
        </h1>

        <div className="rw-out">
          <div className="nk-caps rw-k">Break-even reward cost, per customer a year</div>
          <div className={res.ok ? 'rw-num' : 'rw-num is-off'}>
            {res.ok ? fmt(ceiling) : '—'}
            <span className="rw-cur">in your currency</span>
          </div>
          <p className="rw-why">
            {res.ok ? (
              <>
                {fmt(cm.v!)} margin per order × {fmt(cx.v!)} extra orders
              </>
            ) : (
              hint ?? 'Fill in the three fields to see it.'
            )}
          </p>
          <p className="rw-do">Set one fixed reward below this and announce it up front.</p>
          <p className="rw-live" aria-live="polite">
            {said}
          </p>
        </div>
      </div>

      <div className="rw-b">
        <div className={edited ? 'rw-tag is-own' : 'rw-tag'}>
          <span className="nk-caps">{edited ? 'Your numbers' : 'Example — type your own'}</span>
        </div>
        <div className="rw-fields">
          <label className="rw-f" htmlFor="rw-a">
            <span>Average order value</span>
            <input id="rw-a" type="text" inputMode="decimal" autoComplete="off" value={a} onChange={field(setA)} aria-invalid={ca.hint || res.marginOverAov ? true : undefined} aria-describedby="rw-hint" />
          </label>
          <label className="rw-f" htmlFor="rw-m">
            <span>Gross margin per order (amount, not %)</span>
            <input id="rw-m" type="text" inputMode="decimal" autoComplete="off" value={m} onChange={field(setM)} aria-invalid={cm.hint || res.marginOverAov ? true : undefined} aria-describedby="rw-hint" />
          </label>
          <label className="rw-f" htmlFor="rw-x">
            <span>
              Extra orders a year the reward brings, per customer <em>your assumption</em>
            </span>
            <input id="rw-x" type="text" inputMode="decimal" autoComplete="off" value={x} onChange={field(setX)} aria-invalid={cx.hint ? true : undefined} aria-describedby="rw-hint" />
          </label>
        </div>
        <p className="rw-hint" id="rw-hint">
          {hint ? <strong>{hint}</strong> : 'Nothing you type leaves this page.'}
        </p>

        <div className="rw-try">
          <label className="rw-tl" htmlFor="rw-c">
            <span className="nk-caps">Try a reward cost per customer a year</span>
            <b className={res.ok && !v.paysOff ? 'is-over' : undefined}>
              {res.ok ? (v.paysOff ? `Pays off · ${fmt(v.left)} margin left` : `Doesn’t pay off · ${fmt(-v.left)} short`) : '—'}
            </b>
          </label>
          <input
            id="rw-c"
            className="rw-range"
            type="range"
            min={0}
            max={200}
            step={1}
            value={share}
            disabled={!res.ok}
            onChange={(e) => setShare(Number(e.target.value))}
            aria-valuetext={res.ok ? `${fmt(cost)} per customer a year, ${v.paysOff ? 'pays off' : 'does not pay off'}` : 'Fill in the three fields first'}
          />
          <div className="rw-bars" aria-hidden="true">
            <div className="rw-bar is-sales">
              <span>Revenue from extra orders</span>
              <b>{res.ok ? fmt(res.extraSales) : '—'}</b>
              <i style={{ width: res.ok ? pct(res.extraSales) : '0%' }} />
            </div>
            <div className="rw-bar is-margin">
              <span>Margin from extra orders</span>
              <b>{res.ok ? fmt(ceiling) : '—'}</b>
              <i style={{ width: res.ok ? pct(ceiling) : '0%' }} />
            </div>
            <div className={res.ok && !v.paysOff ? 'rw-bar is-cost is-over' : 'rw-bar is-cost'}>
              <span>Reward cost</span>
              <b>{res.ok ? fmt(cost) : '—'}</b>
              <i style={{ width: res.ok ? pct(cost) : '0%' }} />
              {res.ok ? <u style={{ left: pct(ceiling) }} /> : null}
            </div>
          </div>
        </div>

        <p className="rw-act">
          <a href="/nawyko">See a fixed reward in an app under your brand →</a>
        </p>
      </div>
    </section>
  )
}
