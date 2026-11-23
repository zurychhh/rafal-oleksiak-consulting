'use client'

/* /lab/reminder — jedno pytanie, trzy pola, jeden dzien, jeden suwak, jeden krok.
   Liczby na ekranie licza sie WYLACZNIE z pol odwiedzajacego (model.ts). Nic, co wpisuje,
   nie opuszcza strony: zadnego fetch, storage ani zdarzen analitycznych. */

import { useEffect, useState } from 'react'
import { parseNum } from '../../calculator/model'
import { reminderDay, sendOn } from './model'

// Wartosci startowe to PRZYKLAD (oznaczony na stronie), nie dane rynkowe.
const EX = { pack: '30', delivery: '3', decide: '2' }

type Check = { v: number | null; hint: string | null }

function check(raw: string, label: string, max: number): Check {
  if (raw.trim() === '') return { v: null, hint: `${label}: type a number.` }
  const p = parseNum(raw)
  if (p === undefined) return { v: null, hint: `${label}: digits only.` }
  if (p <= 0) return { v: null, hint: `${label}: more than zero.` }
  if (!Number.isInteger(p)) return { v: null, hint: `${label}: whole days only.` }
  if (p > max) return { v: null, hint: `${label}: ${max} at most.` }
  return { v: p, hint: null }
}

const days = (n: number) => `${n} ${n === 1 ? 'day' : 'days'}`

export function Reminder() {
  const [p, setP] = useState(EX.pack)
  const [d, setD] = useState(EX.delivery)
  const [k, setK] = useState(EX.decide)
  const [send, setSend] = useState<number | null>(null) // null = suwak idzie za wynikiem
  const [said, setSaid] = useState('')

  const cp = check(p, 'Days one pack lasts', 365)
  const cd = check(d, 'Days to the doorstep', 90)
  const ck = check(k, 'Days to reorder', 90)
  const input = { pack: cp.v ?? NaN, delivery: cd.v ?? NaN, decide: ck.v ?? NaN }
  const res = reminderDay(input)
  const hint = cp.hint || cd.hint || ck.hint
  const isEx = p.trim() === EX.pack && d.trim() === EX.delivery && k.trim() === EX.decide

  const n = res.ok ? Math.min(send ?? res.day, input.pack) : 1
  const out = res.ok ? sendOn(n, input) : { arrives: 0, without: 0, left: 0 }
  const scale = res.ok ? input.pack + input.delivery + input.decide : 1
  const pct = (v: number) => `${(v / scale) * 100}%`

  const result = !res.ok
    ? '—'
    : out.without > 0
      ? `${days(out.without)} without the product`
      : out.left > 0
        ? `${days(out.left)} of product left when the new pack lands`
        : 'The new pack lands on the last day of the old one'

  const say = res.ok ? `Day ${res.day}. Reminder on day ${n}: ${result}.` : ''
  useEffect(() => {
    const id = window.setTimeout(() => setSaid(say), 700)
    return () => window.clearTimeout(id)
  }, [say])

  // Nowe liczby = nowa odpowiedz: suwak wraca do wyliczonego dnia (inaczej opis dla czytnikow i os pokazuja stary dzien).
  const field = (set: (s: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    set(e.target.value)
    setSend(null)
  }

  return (
    <section className="rw rm" aria-labelledby="rm-h1">
      <div className="rw-a">
        <div className="nk-caps nk-lab">Tool · 30 seconds</div>
        <h1 className="rw-h1" id="rm-h1">
          Which day should the reorder reminder go out?
        </h1>

        <div className="rw-out">
          <div className="nk-caps rw-k">Send the reminder on day of the pack</div>
          <div className={res.ok ? 'rw-num' : 'rw-num is-off'}>
            {res.ok ? (
              <>
                <span className="pb-word">Day</span>
                {res.day}
              </>
            ) : (
              '—'
            )}
            <span className="rw-cur">
              <span className={isEx ? 'rm-ex' : 'rm-ex is-own'}>{isEx ? 'Example — type your own' : 'Your numbers'}</span>
            </span>
          </div>
          <p className="rw-why">
            {res.ok ? (
              <>
                {cp.v}-day pack − {days(cd.v!)} delivery − {days(ck.v!)} to reorder ={' '}
                {res.tooLate
                  ? 'no day left in the pack'
                  : `day ${res.day} of the pack (day ${res.day + cd.v!} after the order, if opened on arrival)`}
              </>
            ) : (
              hint ?? 'Fill in the three fields to see it.'
            )}
          </p>
          <p className="rw-do">
            {res.ok && res.tooLate
              ? 'Too late for a reminder: delivery and reorder take longer than one pack. Offer a subscription or a two-pack at checkout.'
              : 'Too early: the customer still has plenty at home. Too late: days without the product.'}
          </p>
          <p className="rw-live" aria-live="polite">
            {said}
          </p>
        </div>
      </div>

      <div className="rw-b">
        <div className="rw-fields">
          <label className="rw-f" htmlFor="rm-p">
            <span>Days one pack lasts (servings ÷ servings per day)</span>
            <input id="rm-p" type="text" inputMode="numeric" autoComplete="off" value={p} onChange={field(setP)} aria-invalid={cp.hint ? true : undefined} aria-describedby="rm-hint" />
          </label>
          <label className="rw-f" htmlFor="rm-d">
            <span>Days from order to doorstep</span>
            <input id="rm-d" type="text" inputMode="numeric" autoComplete="off" value={d} onChange={field(setD)} aria-invalid={cd.hint ? true : undefined} aria-describedby="rm-hint" />
          </label>
          <label className="rw-f" htmlFor="rm-k">
            <span>Days a customer takes to reorder after the reminder</span>
            <input id="rm-k" type="text" inputMode="numeric" autoComplete="off" value={k} onChange={field(setK)} aria-invalid={ck.hint ? true : undefined} aria-describedby="rm-hint" />
          </label>
        </div>
        <p className="rw-hint" id="rm-hint">
          {hint ? <strong>{hint}</strong> : 'One average customer. Nothing you type leaves this page.'}
        </p>

        <div className="rw-try">
          <label className="rw-tl" htmlFor="rm-s">
            <span className="nk-caps">If the reminder goes out on day {res.ok ? n : '—'}</span>
            <b>{res.ok ? `New pack lands on day ${out.arrives}` : '—'}</b>
          </label>
          <input
            id="rm-s"
            className="rw-range"
            type="range"
            min={1}
            max={res.ok ? input.pack : 1}
            step={1}
            value={n}
            disabled={!res.ok}
            // Suwak na tej samej skali co os ponizej: srodek uchwytu (30 px) nad dniem 1 i nad ostatnim dniem opakowania.
            style={res.ok ? { marginLeft: `calc(${pct(1)} - 15px)`, width: `calc(${pct(input.pack - 1)} + 30px)` } : undefined}
            onChange={(e) => setSend(Number(e.target.value))}
            aria-valuetext={res.ok ? `Day ${n}: ${result}` : 'Fill in the three fields first'}
          />
          <div className="rm-line" aria-hidden="true">
            {res.ok && (
              <>
                <i className="rm-pack" style={{ left: 0, width: pct(input.pack) }} />
                {out.without > 0 && <i className="rm-gap" style={{ left: pct(input.pack), width: pct(out.without) }} />}
                <u className="rm-send" style={{ left: pct(n) }} />
                <u className="rm-new" style={{ left: pct(out.arrives) }} />
              </>
            )}
          </div>
          <p className={res.ok && out.without > 0 ? 'rm-res is-over' : 'rm-res'}>{result}</p>
          <p className="pb-legend" aria-hidden="true">
            Black = product at home · red stripes = days without · thin line = reminder · thick line = new pack
          </p>
        </div>

        <p className="rw-act">
          <a href="/nawyko">Time it for each customer from the day they open the pack →</a>
        </p>
      </div>
    </section>
  )
}
