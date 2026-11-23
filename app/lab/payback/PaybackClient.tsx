'use client'

/* /lab/payback — jedno pytanie, trzy pola, jedna liczba, jeden suwak, jeden krok.
   Liczby na ekranie licza sie WYLACZNIE z pol odwiedzajacego (model.ts). Nic, co wpisuje,
   nie opuszcza strony: zadnego fetch, storage ani zdarzen analitycznych. */

import { useEffect, useState } from 'react'
import { parseNum } from '../../calculator/model'
import { balanceAfter, payback } from './model'

// Wartosci startowe to PRZYKLAD (oznaczony na stronie), nie dane rynkowe.
const EX = { cac: '90', margin: '36', gap: '45', stop: 2 }
const MAX_LADDER = 12

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

export function Payback() {
  const [c, setC] = useState(EX.cac)
  const [m, setM] = useState(EX.margin)
  const [g, setG] = useState(EX.gap)
  const [stop, setStop] = useState(EX.stop) // po ilu zamowieniach klient odchodzi (tylko pozycja suwaka)
  const [edited, setEdited] = useState(false)
  const [said, setSaid] = useState('')

  const cc = check(c, 'Cost to win a customer', 1_000_000)
  const cm = check(m, 'Margin', 1_000_000)
  const cg = check(g, 'Days between orders', 365)
  const res = payback({ cac: cc.v ?? NaN, margin: cm.v ?? NaN, gap: cg.v ?? NaN })
  const hint = cc.hint || cm.hint || cg.hint

  const ladder = res.ok ? Math.min(MAX_LADDER, Math.max(4, res.order + 2)) : 4
  const n = Math.min(stop, ladder)
  const bal = res.ok ? balanceAfter(n, cc.v!, cm.v!) : 0
  const over = res.ok && res.order > MAX_LADDER

  const say = res.ok
    ? `Order ${res.order}, day ${res.day}. A customer who stops after ${n} ${n === 1 ? 'order' : 'orders'}: ${bal >= 0 ? 'paid back' : `${fmt(-bal)} short`}.`
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
    <section className="rw pb" aria-labelledby="pb-h1">
      <div className="rw-a">
        <div className="nk-caps nk-lab">Tool · 30 seconds</div>
        <h1 className="rw-h1" id="pb-h1">
          Which order pays back the cost of a new customer?
        </h1>

        <div className="rw-out">
          <div className="nk-caps rw-k">A new customer pays back on</div>
          <div className={res.ok ? 'rw-num' : 'rw-num is-off'}>
            {res.ok ? (
              <>
                <span className="pb-word">Order</span>
                {res.order}
              </>
            ) : (
              '—'
            )}
            {res.ok ? <span className="rw-cur">{res.order === 1 ? 'the first order' : `day ${fmt(res.day)} · orders ${fmt(cg.v!)} days apart`}</span> : <span className="rw-cur">{'\u00a0'}</span>}
          </div>
          <p className="rw-why">
            {res.ok ? (
              <>
                {fmt(cc.v!)} to win ÷ {fmt(cm.v!)} margin per order = {fmt(Math.round((cc.v! / cm.v!) * 100) / 100)} → order {res.order}
              </>
            ) : (
              hint ?? 'Fill in the three fields to see it.'
            )}
          </p>
          <p className="rw-do">
            {res.ok
              ? res.order === 1
                ? 'The first order covers it. Each reorder adds margin.'
                : `Every customer who stops before order ${res.order} costs money. Build the habit before the first pack runs out.`
              : 'Build the habit before the first pack runs out.'}
          </p>
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
          <label className="rw-f" htmlFor="pb-c">
            <span>Cost to win one customer (ads, offers, fees)</span>
            <input id="pb-c" type="text" inputMode="decimal" autoComplete="off" value={c} onChange={field(setC)} aria-invalid={cc.hint ? true : undefined} aria-describedby="pb-hint" />
          </label>
          <label className="rw-f" htmlFor="pb-m">
            <span>Gross margin per order (amount, not %)</span>
            <input id="pb-m" type="text" inputMode="decimal" autoComplete="off" value={m} onChange={field(setM)} aria-invalid={cm.hint ? true : undefined} aria-describedby="pb-hint" />
          </label>
          <label className="rw-f" htmlFor="pb-g">
            <span>Average days between a customer’s orders</span>
            <input id="pb-g" type="text" inputMode="decimal" autoComplete="off" value={g} onChange={field(setG)} aria-invalid={cg.hint ? true : undefined} aria-describedby="pb-hint" />
          </label>
        </div>
        <p className="rw-hint" id="pb-hint">
          {hint ? <strong>{hint}</strong> : 'Nothing you type leaves this page.'}
        </p>

        <div className="rw-try">
          <label className="rw-tl" htmlFor="pb-s">
            <span className="nk-caps">A customer who stops after {n} {n === 1 ? 'order' : 'orders'}</span>
            <b className={res.ok && bal < 0 ? 'is-over' : undefined}>
              {res.ok ? (bal === 0 ? 'Breaks even' : bal > 0 ? `+${fmt(bal)} · paid back` : `−${fmt(-bal)} · not paid back`) : '—'}
            </b>
          </label>
          <input
            id="pb-s"
            className="rw-range"
            type="range"
            min={1}
            max={ladder}
            step={1}
            value={n}
            disabled={!res.ok}
            onChange={(e) => setStop(Number(e.target.value))}
            aria-valuetext={res.ok ? `Stops after ${n} ${n === 1 ? 'order' : 'orders'}: ${bal === 0 ? 'breaks even' : bal > 0 ? `paid back, ${fmt(bal)} ahead` : `not paid back, ${fmt(-bal)} short`}` : 'Fill in the three fields first'}
          />
          <ol className="pb-steps" aria-hidden="true" style={{ gridTemplateColumns: `repeat(${ladder}, minmax(0,1fr))` }}>
            {Array.from({ length: ladder }, (_, k) => {
              const i = k + 1
              const cls = [
                'pb-step',
                res.ok && i >= res.order ? 'is-paid' : '',
                res.ok && i === res.order ? 'is-even' : '',
                i > n ? 'is-gone' : '',
              ]
                .filter(Boolean)
                .join(' ')
              return (
                <li key={i} className={cls}>
                  <i />
                  <span>{i}</span>
                </li>
              )
            })}
          </ol>
          <p className="pb-legend" aria-hidden="true">
            {over ? `Orders 1–${MAX_LADDER} shown; payback comes later.` : 'Outline = ordered, not paid back · black = paid back · faint = never ordered'}
          </p>
        </div>

        <p className="rw-act">
          <a href="/nawyko">{res.ok && res.order > 1 ? `How to get customers to order ${res.order} →` : 'How to get customers to reorder →'}</a>
        </p>
      </div>
    </section>
  )
}
