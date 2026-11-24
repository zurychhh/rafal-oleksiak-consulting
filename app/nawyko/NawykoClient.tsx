'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Enquiry } from './Enquiry'
import { FAQ } from './content'
import { DEMO_BRAND, inkOn, mix, monogram, onColour, useBrand, type Skin } from '../lib/brand-engine'
import { Cockpit, WhyInterlude } from './Cockpit'

/* Enquiry mieszka w ./Enquiry (przebieg 4): /work/genactiv importuje sam formularz, bez calej sceny. */
export { Enquiry }

/* Pokaz Nawyko na ZMYSLONEJ marce. Nazwa sprawdzona w sieci 21.11.2026
   (agencja/research/marka-pokazowa.md) — to nie jest klient ani realna firma. */
/* DEMO_BRAND mieszka w app/lib/brand-engine.ts (silnik marki, spec 26). */

const GOAL_DAY = 24
const PACK_DAYS = 30

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))


/* ── zdrapka ─────────────────────────────────────────────────────────────── */
function Scratch({ gone, onDone, auto, foil }: { gone: boolean; onDone: () => void; auto?: boolean; foil?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const crumbs = useRef<HTMLCanvasElement>(null)
  const finger = useRef<HTMLDivElement>(null)
  const userTook = useRef(false)
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
    if (foil) {
      /* Spec 26: folia w kolorze marki — metaliczny gradient z odblaskiem. */
      const lg = g.createLinearGradient(0, 0, c.width, c.height)
      lg.addColorStop(0, mix(foil, '#FFFFFF', 0.35))
      lg.addColorStop(0.45, foil)
      lg.addColorStop(0.55, mix(foil, '#FFFFFF', 0.5))
      lg.addColorStop(1, mix(foil, '#000000', 0.3))
      g.fillStyle = lg
    } else g.fillStyle = '#C9C7C0'
    g.fillRect(0, 0, c.width, c.height)
    g.strokeStyle = foil ? 'rgba(255,255,255,.16)' : '#B4B2AB'
    g.lineWidth = dpr
    for (let x = -c.height; x < c.width; x += 7 * dpr) {
      g.beginPath()
      g.moveTo(x, 0)
      g.lineTo(x + c.height, c.height)
      g.stroke()
    }
    g.fillStyle = foil ? onColour(foil) : '#14161A'
    g.font = `600 ${Math.round(11 * dpr)}px "NK Instrument Sans", "Instrument Sans", system-ui, sans-serif`
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    const label = 'S C R A T C H   H E R E'
    g.fillText(label, c.width / 2, c.height / 2)
  }, [foil])

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

  /* Zdrapuje sie sama, jesli odwiedzajacy nie zrobi tego pierwszy: slad palca zygzakiem,
     opadajace drobiny, potem licznik serii. Wlasne zdrapanie przerywa animacje. */
  useEffect(() => {
    if (!auto || gone || userTook.current) return
    const c = ref.current
    const k = crumbs.current
    const g = c?.getContext('2d')
    const kg = k?.getContext('2d')
    if (!c || !g || !k || !kg) return
    const r = c.getBoundingClientRect()
    const sx = c.width / Math.max(1, r.width)
    k.width = c.width
    k.height = Math.round(c.height * 1.7)
    const W = c.width
    const H = c.height
    const pts: { x: number; y: number }[] = []
    const rows = 5
    for (let i = 0; i <= rows; i++) {
      const y = H * (0.14 + (0.72 * i) / rows)
      pts.push({ x: W * (i % 2 ? 0.9 : 0.1), y })
    }
    const seg = pts.slice(1).map((q, i) => Math.hypot(q.x - pts[i].x, q.y - pts[i].y))
    const len = seg.reduce((a, b) => a + b, 0)
    const at = (u: number) => {
      let d = u * len
      for (let i = 0; i < seg.length; i++) {
        if (d <= seg[i] || i === seg.length - 1) {
          const f = seg[i] ? Math.min(1, d / seg[i]) : 0
          return { x: pts[i].x + (pts[i + 1].x - pts[i].x) * f, y: pts[i].y + (pts[i + 1].y - pts[i].y) * f }
        }
        d -= seg[i]
      }
      return pts[pts.length - 1]
    }
    type Crumb = { x: number; y: number; vx: number; vy: number; s: number; a: number }
    const bits: Crumb[] = []
    const DUR = 1250
    const t0 = performance.now()
    let prev = at(0)
    let raf = 0
    let done = false
    let doneAt = 0
    const fg = finger.current
    const frame = (now: number) => {
      if (userTook.current) {
        if (fg) fg.style.opacity = '0'
        return
      }
      const u = Math.min(1, (now - t0) / DUR)
      const e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2
      const pos = at(e)
      g.globalCompositeOperation = 'destination-out'
      g.lineCap = 'round'
      g.lineJoin = 'round'
      g.lineWidth = W * 0.22
      g.beginPath()
      g.moveTo(prev.x, prev.y)
      g.lineTo(pos.x + 0.01, pos.y + 0.01)
      g.stroke()
      g.globalCompositeOperation = 'source-over'
      if (u < 1)
        for (let j = 0; j < 3; j++)
          bits.push({ x: pos.x, y: pos.y, vx: (Math.random() - 0.5) * 3 * sx, vy: -Math.random() * 2 * sx, s: (1.5 + Math.random() * 2.5) * sx, a: 1 })
      prev = pos
      kg.clearRect(0, 0, k.width, k.height)
      for (const b of bits) {
        b.vy += 0.35 * sx
        b.x += b.vx
        b.y += b.vy
        b.a -= 0.012
        if (b.a <= 0) continue
        kg.globalAlpha = b.a
        kg.fillStyle = '#A9A79F'
        kg.fillRect(b.x, b.y, b.s, b.s)
      }
      kg.globalAlpha = 1
      if (fg) {
        fg.style.opacity = u < 1 ? '1' : '0'
        fg.style.transform = `translate(${pos.x / sx}px, ${pos.y / sx}px)`
      }
      if (u >= 1 && !done) {
        done = true
        doneAt = now
      }
      if (done && now - doneAt > 380) {
        onDone()
        return
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      kg.clearRect(0, 0, k.width, k.height)
      if (fg) fg.style.opacity = '0'
    }
  }, [auto, gone, onDone])

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
    <>
    <canvas
      ref={ref}
      className={'nk-canvas' + (gone ? ' is-gone' : '')}
      onPointerDown={(e) => {
        userTook.current = true
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
    <canvas ref={crumbs} className="nk-crumbs" aria-hidden="true" />
    <div ref={finger} className="nk-finger" aria-hidden="true" />
    </>
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


/* ── runda 4 (g, h): dowod wynikow z grupa kontrolna, pas integracji ── */
/* WSZYSTKIE liczby i krzywe ponizej to przyklad (znaczek „Example” przy samym rysunku), nie wynik zadnej marki.
   Krzywe: udzial klientow, ktorzy nadal zamawiaja, miesiac 0–6. Bez procentow w tresci. */
const CROWD = 24
const LIFT_APP = [1, 0.82, 0.7, 0.62, 0.56, 0.52, 0.49]
const LIFT_CTRL = [1, 0.74, 0.58, 0.48, 0.41, 0.36, 0.33]
/* zakres niepewnosci maleje z pierwiastkiem z liczebnosci grupy (przyklad, stala dobrana do rysunku) */
const SPREAD = 0.18
/* dzien, w ktorym skonczylo sie opakowanie (ostatni ptaszek przed nastepnym), liczba telefonow na dzien */
const RUNOUT: [number, number][] = [
  [26, 1], [27, 1], [28, 2], [29, 3], [30, 5], [31, 7], [32, 9], [33, 8], [34, 6], [35, 4], [36, 3], [37, 2], [38, 1],
]
const RUN_PEAK = RUNOUT.reduce((a, b) => (b[1] > a[1] ? b : a))[0]

const LX = (i: number) => 40 + i * 50
const LY = (v: number) => 12 + (1 - v) * 150
function curve(vals: readonly number[], d = 0) {
  return vals.map((v, i) => `${i ? 'L' : 'M'}${LX(i)} ${LY(clamp(v + d)).toFixed(1)}`).join(' ')
}
function band(vals: readonly number[], w: number) {
  const top = vals.map((v, i) => `${i ? 'L' : 'M'}${LX(i)} ${LY(clamp(v + (i ? w : 0))).toFixed(1)}`).join(' ')
  const bot = [...vals]
    .map((v, i) => [i, v] as const)
    .reverse()
    .map(([i, v]) => `L${LX(i)} ${LY(clamp(v - (i ? w : 0))).toFixed(1)}`)
    .join(' ')
  return `${top} ${bot} Z`
}

const LINKS = [
  { k: 'Store', n: 'Shopify', d: 'Orders confirm a purchase; rewards arrive as single-use codes.' },
  { k: 'Subscriptions', n: 'Subscription apps', d: 'Cashback can come off the next delivery.' },
  { k: 'Loyalty', n: 'Loyalty apps', d: 'Points can sit beside a programme already running.' },
  { k: 'Email and CRM', n: 'Your email tool', d: 'Reorder reminders go out without any health data.' },
  { k: 'App stores', n: 'App Store · Google Play', d: 'The app is listed under your brand name.' },
] as const

function Evidence({ brand }: { brand: string }) {
  const [held, setHeld] = useState(6)
  const wc = SPREAD / Math.sqrt(held)
  const wa = SPREAD / Math.sqrt(CROWD - held)
  const last = LIFT_APP.length - 1
  const apart = LIFT_APP[last] - wa > LIFT_CTRL[last] + wc

  return (
    <div className="nk-r4" id="evidence">
      <section className="nk-still nk-proof" id="proof" aria-labelledby="nk-prf">
        <div className="nk-panel">
          <div className="nk-caps nk-lab">
            <span className="nk-who">For you</span>
            <span className="nk-labrest">Proof of results</span>
          </div>
          <h2 className="nk-h2" id="nk-prf">
            Reorder lift, measured against customers who never get the app.
          </h2>
          <p className="nk-one">A control group goes without the app, so the gap between the two curves is the app&rsquo;s effect.</p>
          <figure className="nk-desk2 nk-lift">
            <figcaption className="nk-caps nk-deskh">
              <span>{brand} · results panel</span>
              <b className="nk-ex">Example</b>
            </figcaption>
            <div className="nk-crowd" aria-hidden="true">
              {Array.from({ length: CROWD }, (_, i) => (
                <i key={i} className={i >= CROWD - held ? 'is-ctrl' : ''} />
              ))}
            </div>
            <label className="nk-rate" htmlFor="nk-held">
              <span>Customers held out as control, out of 24 in this example</span>
              <output htmlFor="nk-held">
                {held} of {CROWD}
              </output>
            </label>
            <input
              id="nk-held"
              className="nk-slider"
              type="range"
              min={2}
              max={12}
              step={1}
              value={held}
              aria-valuetext={`${held} of ${CROWD} customers held out without the app`}
              onChange={(e) => setHeld(Number(e.currentTarget.value))}
            />
            <svg className="nk-plot" viewBox="0 0 360 206" role="img" aria-labelledby="nk-lift-t">
              <title id="nk-lift-t">
                Example chart: customers still reordering over six months, app group above control group.
              </title>
              <line x1="40" y1="162" x2="340" y2="162" className="nk-axis" />
              <path d={band(LIFT_CTRL, wc)} className="nk-band nk-band-c" />
              <path d={band(LIFT_APP, wa)} className="nk-band nk-band-a" />
              <path d={curve(LIFT_CTRL)} className="nk-cv nk-cv-c" />
              <path d={curve(LIFT_APP)} className="nk-cv nk-cv-a" />
              {LIFT_APP.map((_, i) => (
                <text key={i} x={LX(i)} y="182" className="nk-tick">
                  {i === 0 ? 'Start' : i}
                </text>
              ))}
              <text x="190" y="200" className="nk-tick">
                Month
              </text>
              <text x="40" y="8" className="nk-tick nk-tick-l">
                Still reordering
              </text>
            </svg>
            <div className="nk-key" aria-hidden="true">
              <span className="nk-key-a">With the app</span>
              <span className="nk-key-c">Control group</span>
            </div>
            <p className="nk-cost" aria-live="polite">
              {apart ? (
                <>
                  <b>By month six the two bands no longer overlap.</b> That gap is what the app adds.
                </>
              ) : (
                <>
                  <b>Ranges overlap:</b> too few customers held out to tell.
                </>
              )}
            </p>
          </figure>
          <p className="nk-fine">A bigger control group gives a clearer answer; fewer customers get the app meanwhile. You choose the split.</p>
        </div>
        <div className="nk-phonecol">
          <figure className="nk-desk2 nk-runout">
            <figcaption className="nk-caps nk-deskh">
              <span>Real pack length, from daily ticks</span>
              <b className="nk-ex">Example</b>
            </figcaption>
            <svg className="nk-plot" viewBox="0 0 360 210" role="img" aria-labelledby="nk-run-t">
              <title id="nk-run-t">
                {`Example chart: each dot is one customer's last daily tick before the next pack. The label says ${PACK_DAYS} days; most packs last to day ${RUN_PEAK}.`}
              </title>
              <line x1="16" y1="178" x2="344" y2="178" className="nk-axis" />
              <line x1={RX(PACK_DAYS)} y1="14" x2={RX(PACK_DAYS)} y2="178" className="nk-label-line" />
              <text x={RX(PACK_DAYS) - 6} y="22" className="nk-tick nk-tick-r">
                Label: {PACK_DAYS} days
              </text>
              {RUNOUT.flatMap(([day, n]) =>
                Array.from({ length: n }, (_, k) => (
                  <circle key={`${day}-${k}`} cx={RX(day)} cy={170 - k * 17} r="7" className={day === RUN_PEAK ? 'nk-dot is-peak' : 'nk-dot'} />
                )),
              )}
              {RUNOUT.filter(([d]) => d % 2 === 0).map(([d]) => (
                <text key={d} x={RX(d)} y="198" className="nk-tick">
                  {d}
                </text>
              ))}
            </svg>
            <p className="nk-cost">
              Each dot is one customer&rsquo;s last daily tick before the next pack. In this example most packs last to <b>day {RUN_PEAK}</b>, so the
              reorder reminder is set for day {RUN_PEAK}, from totals across customers.
            </p>
          </figure>
        </div>
      </section>

      <section className="nk-still nk-int" id="integrations" aria-labelledby="nk-intg">
        <div className="nk-panel">
          <div className="nk-caps nk-lab">
            <span className="nk-who">For you</span>
            <span className="nk-labrest">Integrations</span>
          </div>
          <h2 className="nk-h2" id="nk-intg">
            Runs on Shopify; your other tools connect per brand.
          </h2>
          <p className="nk-one">
            Rewards arrive as Shopify codes; subscription, loyalty and email tools are matched to your stack. The app is listed in both
            stores under your brand.
          </p>
        </div>
        <ul className="nk-band5">
          {LINKS.map((l) => (
            <li key={l.k}>
              <span className="nk-caps">{l.k}</span>
              <b>{l.n}</b>
              <p>{l.d}</p>
            </li>
          ))}
        </ul>
        <p className="nk-fine nk-int-fine">
          Which app in each category connects to your store is mapped in the first call.{' '}
          <a className="nk-link" href="#enquiry">
            Ask which apps connect to your store →
          </a>
        </p>
      </section>
    </div>
  )
}
function RX(day: number) {
  return 16 + ((day - 25) / 14) * 328
}

/* ── runda 4 (j): FAQ kupujacego, natywne <details> (klawiatura i bez JS za darmo) ── */
function Faq() {
  return (
    <section className="nk-faq" id="faq" aria-labelledby="nk-faq-h">
      <div className="nk-caps nk-lab">
        <span className="nk-who">For you</span>
        <span className="nk-labrest">Questions</span>
      </div>
      <h2 className="nk-h2" id="nk-faq-h">
        FAQ: six answers you need before the first call.
      </h2>
      <p className="nk-one">Daily use, health data, reward cost, setup, pharmacy purchases, consent.</p>
      <div className="nk-qs">
        {FAQ.map((f) => (
          <details key={f.q} className="nk-q">
            <summary>
              <span>{f.q}</span>
              <i aria-hidden="true" />
            </summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}


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

/* ── spec 13 (k): final „See it with your brand” — kolor marki przemalowuje telefon i akcent sekcji ── */
/* Kolor zostaje na stronie: nie jest polem formularza i nie idzie do /api/lead. */
const BRAND_COLS = [
  { id: 'red', name: 'Signal red', hex: '#D6202B' },
  { id: 'green', name: 'Forest green', hex: '#1F6B4A' },
  { id: 'blue', name: 'Ocean blue', hex: '#1D5FA8' },
  { id: 'plum', name: 'Plum', hex: '#7A2E8C' },
  { id: 'amber', name: 'Amber', hex: '#E8A317' },
  { id: 'teal', name: 'Teal', hex: '#0F7C80' },
] as const
const PHONE_BG: Record<Skin, string> = { paper: '#F7F5F0', night: '#14161A', clay: '#EFE6DA' }

function BrandColour({ value, onPick, group }: { value: string; onPick: (hex: string) => void; group: string }) {
  const preset = BRAND_COLS.find((c) => c.hex.toLowerCase() === value.toLowerCase())
  return (
    <fieldset className="nk-bcol">
      <legend className="nk-caps">Brand colour</legend>
      <div className="nk-bcol-row">
        {BRAND_COLS.map((c) => (
          <label key={c.id} className="nk-bcol-sw" title={c.name}>
            <input
              type="radio"
              name={group}
              value={c.hex}
              aria-label={c.name}
              checked={preset?.id === c.id}
              onChange={() => onPick(c.hex)}
            />
            <i style={{ background: c.hex }} aria-hidden="true" />
          </label>
        ))}
        <label className="nk-bcol-own">
          <input type="color" value={value} aria-label="Your own colour" onChange={(e) => onPick(e.currentTarget.value)} />
          <span>Your own</span>
        </label>
      </div>
    </fieldset>
  )
}

/* Spec 26: jedna notka zamiast nazwy demo na sztywno. Bez wlasnej nazwy — ze to marka zmyslona; z wlasna — ze dane sa przykladowe. */
function DemoNote({ className = 'nk-demo' }: { className?: string }) {
  const { name, own } = useBrand()
  return (
    <p className={className}>
      {own ? `Showing your brand: ${name.trim()} · sample data.` : `${DEMO_BRAND} is a made-up demo brand, not a client.`}
    </p>
  )
}

const PAGE_BG: Record<Skin, string> = { paper: '#F7F5F0', night: '#14161A', clay: '#EFE6DA' }
const HERO_TILE = '#1B1D21' // najjasniejsze tlo pod akcentem w telefonie hero (recenzja 31: 4,45:1 liczone od #111215)
const RING = 30
const HERO_DAY = 9

/* ── spec 26 p1: hero z zywym ekranem aplikacji w marce odwiedzajacego ──
   Ciemny ekran „Today” jak w prawdziwej aplikacji (bez zrzutow z prywatnego repo): naglowek z monogramem i nazwa,
   tarcza 30 dni wokol opakowania, trzy kafelki, karta dnia do zdrapania w kolorze marki. Pod telefonem: nazwa + kolor
   = silnik marki dla calej strony. */
const SKIN_OPTS: { id: Skin; name: string; sw: string }[] = [
  { id: 'paper', name: 'Paper', sw: '#F7F5F0' },
  { id: 'night', name: 'Night', sw: '#14161A' },
  { id: 'clay', name: 'Clay', sw: '#EFE6DA' },
]

export function HeroApp() {
  const { name, colour, brand, own, skin, setName, setColour, setSkin } = useBrand()
  const [done, setDone] = useState(false)
  const [auto, setAuto] = useState(false)
  useEffect(() => {
    if (done) return
    let reduce = false
    try {
      reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    } catch {
      /* bez matchMedia — bez samozdrapki */
    }
    if (reduce || navigator.webdriver) return
    /* Samozdrapka tylko dla kogos, kto zostal na pierwszym ekranie — w trakcie przewijania animacja plotna dawala dlugie klatki (scroll-perf 1440). */
    const id = window.setTimeout(() => {
      if (window.scrollY < 120) setAuto(true)
    }, 3200)
    return () => window.clearTimeout(id)
  }, [done])
  const day = done ? HERO_DAY : HERO_DAY - 1
  const ink = inkOn(colour, HERO_TILE)
  const vars = {
    ['--brand' as string]: colour,
    ['--brand-on' as string]: onColour(colour),
    ['--hi' as string]: ink,
  }
  const R = 44
  return (
    <div className="nk-happ" style={vars}>
      <div className="nk-hphone" aria-hidden="true">
        <div className="nk-hscreen">
          <div className="nk-hhead">
            <span className="nk-hmono">{monogram(brand)}</span>
            <b className="nk-hname">{brand}</b>
            <span className="nk-hpill">Sample data</span>
          </div>
          <div className="nk-hring">
            <svg viewBox="0 0 100 100" aria-hidden="true">
              {Array.from({ length: RING }, (_, i) => {
                const a = (i / RING) * Math.PI * 2 - Math.PI / 2
                const x1 = 50 + Math.cos(a) * (R - 4)
                const y1 = 50 + Math.sin(a) * (R - 4)
                const x2 = 50 + Math.cos(a) * R
                const y2 = 50 + Math.sin(a) * R
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    className={i < day ? 'is-in' : i === day && !done ? 'is-now' : ''}
                  />
                )
              })}
            </svg>
            <div className="nk-hbottle">
              <i />
              <span>{monogram(brand)}</span>
            </div>
            <span className={'nk-hday' + (done ? ' is-up' : '')} key={done ? 'y' : 'n'}>
              {done ? `Day ${HERO_DAY} ticked` : `Day ${HERO_DAY} of ${RING}`}
            </span>
          </div>
          <div className="nk-htiles">
            <span>
              <b key={day}>{day}</b>day streak
            </span>
            <span>
              <b key={day}>{day}</b>ticked
            </span>
            <span>
              <b key={day}>{RING - day}</b>days left
            </span>
          </div>
          <div className="nk-hcard">
            <div className="nk-hcard-in">
              <b>{done ? '✓ Ticked' : 'Card of the day'}</b>
              <small>{done ? 'Next card tomorrow' : 'Taken it? Scratch.'}</small>
            </div>
            <Scratch gone={done} auto={auto} foil={colour} onDone={() => setDone(true)} />
          </div>
          <div className="nk-hnext">
            <span className="nk-hlock" aria-hidden="true" />
            <span>
              <small>Next reward</small>
              <b>Stamp at day {GOAL_DAY}</b>
            </span>
            <i style={{ ['--w' as string]: `${(day / GOAL_DAY) * 100}%` }} />
          </div>
          <div className="nk-htabs">
            <span className="is-on">Today</span>
            <span>Rewards</span>
            <span>Shop</span>
            <span>Account</span>
          </div>
        </div>
      </div>
      <div className="nk-hbrand">
        <button type="button" className="nk-link" onClick={() => setDone(true)} aria-disabled={done || undefined}>
          Reveal without scratching
        </button>
        <p className="nk-fine nk-hstatus" aria-live="polite">
          {done ? `Day ${HERO_DAY} ticked: the streak grew to ${HERO_DAY}.` : ''}
        </p>
        <label className="nk-name">
          <span className="nk-caps">Your brand name</span>
          <input
            type="text"
            value={name}
            maxLength={14}
            placeholder="Type it here"
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setName(e.currentTarget.value)}
          />
        </label>
        <BrandColour value={colour} onPick={setColour} group="nk-hero-colour" />
        <fieldset className="nk-bcol nk-hskin">
          <legend className="nk-caps">Page style</legend>
          <div className="nk-bcol-row">
            {SKIN_OPTS.map((o) => (
              <label key={o.id} className="nk-hskin-o">
                <input type="radio" name="nk-hero-skin" value={o.id} checked={skin === o.id} onChange={() => setSkin(o.id)} />
                <i style={{ background: o.sw }} aria-hidden="true" />
                <span>{o.name}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <p className="nk-fine nk-hcap">
          {own ? `Everything below already follows ${name.trim()}. Nothing is sent.` : 'Everything below follows what you set here. Nothing is sent.'}
        </p>
      </div>
    </div>
  )
}

export function Story() {
  const root = useRef<HTMLDivElement>(null)
  const { colour, name, own, skin } = useBrand()
  const [store, setStore] = useState('')

  useEffect(() => {
    const host = root.current?.closest<HTMLElement>('.nk')
    if (!host) return
    if (skin === 'paper') delete host.dataset.skin
    else host.dataset.skin = skin
  }, [skin])

  /* Silnik marki: kolor odwiedzajacego jest akcentem calej strony i kazdego telefonu (kontrast AA na kazdym tle). */
  useEffect(() => {
    const host = root.current?.closest<HTMLElement>('.nk')
    if (!host) return
    const st = host.style
    st.setProperty('--brand', colour)
    st.setProperty('--brand-on', onColour(colour))
    st.setProperty('--red', inkOn(colour, PAGE_BG[skin]))
    st.setProperty('--bi-p', inkOn(colour, PHONE_BG.paper))
    st.setProperty('--bi-n', inkOn(colour, PHONE_BG.night))
    st.setProperty('--bi-c', inkOn(colour, PHONE_BG.clay))
    host.dataset.brand = ''
  }, [colour, skin])

  /* Lekcja R23 (react.dev useSyncExternalStore: hydratacja zawsze ze stanu serwera): powracajacy gosc z zapisana marka
     widzialby przez chwile nazwe demo. Inline-skrypt w page.tsx chowa nazwy w telefonach (visibility, bez przesuniec);
     odslaniamy je, gdy wyrenderowany stan = zapisany. */
  useEffect(() => {
    let stored = ''
    try {
      stored = (JSON.parse(localStorage.getItem('oc-brand-v1') || '{}') as { name?: string }).name ?? ''
    } catch {
      stored = name
    }
    if (stored === name) document.documentElement.removeAttribute('data-brand-wait')
  }, [name])

  const typed = brandFrom(store)
  const shown = own ? name.trim() : typed

  return (
    <div ref={root}>
      <WhyInterlude />
      <Cockpit />
      <DemoNote className="nk-demo nk-demo-after" />

      <Evidence brand={own ? name.trim() : DEMO_BRAND} />

      <Faq />

      <Finale />

      <section
        className="nk-final nk-final-solo"
        id="enquiry"
        aria-labelledby="nk-ask"
        style={{
          ['--brand' as string]: colour,
          ['--brand-on' as string]: onColour(colour),
          ['--brand-ink' as string]: inkOn(colour, PHONE_BG[skin]),
        }}
      >
        <div className="nk-final-copy">
          <div className="nk-caps nk-lab">
            <span className="nk-brandtag">{shown ? `For ${shown}` : 'Your next step'}</span>
          </div>
          <h2 className="nk-h2" id="nk-ask">
            {shown ? `Build ${shown}’s app.` : 'Build your brand’s app.'}
          </h2>
          <p className="nk-one">Send your store address. The first call covers rewards and setup.</p>
        </div>
        <div className="nk-final-form">
          <Enquiry onStore={setStore} />
        </div>
      </section>
    </div>
  )
}

/* ── spec 28 (R5 p2): wielki final — przewijanie odslania aplikacje odwiedzajacego ──
   Piec chwil jednego poranka klienta: ikona marki na ekranie glownym → powiadomienie → zdrapka w kolorach marki
   (do zdrapania albo „Reveal without scratching”) → dzien 24 i odblokowana pieczatka → kod na kolejne opakowanie,
   tlo przechodzi w kolor marki i plynnie wchodzi formularz („Build {marka}’s app.”). Bez JS i przed hydratacja: chwila 3
   (karta dnia) — najwiecej tresci. Przewijanie zmienia tylko stan liczbowy (setState przy zmianie chwili) i transformy. */
const FZ_N = 5
const FZ_DAY = 24
const FZ_ICONS = ['Mail', 'Maps', 'Photos', 'Music', 'Notes', 'Chat', 'Bank', 'Clock', 'News', 'Shop', 'Books']
function fzMoments(brand: string) {
  return [
    { k: '07:30', h: 'Your icon on their home screen.', p: 'Between the apps they open every morning.' },
    { k: '07:31', h: `A daily reminder from ${brand}.`, p: 'Always the same words: “Your card of the day is ready.”' },
    { k: '07:32', h: 'One scratch after the dose.', p: 'Try it here: scratch the card, or press the button below.' },
    { k: `Day ${FZ_DAY} of 30`, h: `The stamp unlocks on day ${FZ_DAY}.`, p: 'The reward they saw coming from day one.' },
    { k: 'Next order', h: `A next-pack code from ${brand}.`, p: 'Single use, redeemed in your online store.' },
  ]
}

export function Finale() {
  const { colour, brand } = useBrand()
  const root = useRef<HTMLElement>(null)
  const [at, setAt] = useState(2)
  const [done, setDone] = useState(false)
  const atRef = useRef(2)

  useEffect(() => {
    const el = root.current
    if (!el) return
    let raf = 0
    const read = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const run = Math.max(1, r.height - window.innerHeight)
      const p = clamp(-r.top / run)
      const n = Math.min(FZ_N - 1, Math.floor(p * FZ_N))
      if (n !== atRef.current) {
        atRef.current = n
        setAt(n)
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

  /* Kto przewinie dalej bez zdrapania, widzi odsloniety dzien — opowiesc idzie do przodu. */
  useEffect(() => {
    if (at >= 3 && !done) setDone(true)
  }, [at, done])

  const go = (n: number) => {
    const el = root.current
    if (!el) return
    const run = el.offsetHeight - window.innerHeight
    const top = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: top + run * ((n + 0.5) / FZ_N), behavior: 'auto' })
  }

  const moments = fzMoments(brand)
  const ink = inkOn(colour, '#111215')
  const vars = {
    ['--brand' as string]: colour,
    ['--brand-on' as string]: onColour(colour),
    ['--hi' as string]: ink,
  }
  const streak = done ? FZ_DAY : FZ_DAY - 1
  const stamp = done && at >= 3
  const mono = monogram(brand)

  return (
    <section
      ref={root}
      className={'nk-fz' + (at === FZ_N - 1 ? ' is-brand' : '')}
      id="finale"
      aria-labelledby="nk-fz-h"
      data-at={at}
      style={vars}
    >
      <div className="nk-fz-stick">
        <div className="nk-fz-copy">
          <h2 className="nk-caps nk-fz-lab" id="nk-fz-h">
            One morning with {brand}
          </h2>
          <ol className="nk-fz-list">
            {moments.map((m, i) => (
              <li key={i} className={i === at ? 'is-on' : i < at ? 'is-past' : ''} aria-current={i === at ? 'step' : undefined}>
                <span className="nk-caps nk-fz-k">{m.k}</span>
                <b className="nk-fz-h">{m.h}</b>
                <span className="nk-fz-p">{m.p}</span>
              </li>
            ))}
          </ol>
          <div className="nk-fz-dots" role="group" aria-label="Moments">
            {moments.map((m, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Moment ${i + 1}: ${m.h}`}
                aria-pressed={i === at}
                onClick={() => go(i)}
              >
                <i />
              </button>
            ))}
          </div>
          <div className="nk-fz-act">
            <button type="button" className="nk-link" onClick={() => setDone(true)} aria-disabled={done || undefined}>
              Reveal without scratching
            </button>
            <p className="nk-fine nk-fz-status" aria-live="polite">
              {done ? `Day ${FZ_DAY} done. Streak: ${FZ_DAY} days.` : ''}
            </p>
          </div>
        </div>

        <div className="nk-fz-phone" aria-hidden="true">
          <div className="nk-fz-screen">
            {/* ekran glowny */}
            <div className="nk-fz-home">
              <div className="nk-fz-sb">
                <b>7:3{Math.min(at, 2)}</b>
              </div>
              <div className="nk-fz-grid">
                {FZ_ICONS.slice(0, 7).map((l) => (
                  <span key={l} className="nk-fz-ic">
                    <i />
                    <small>{l}</small>
                  </span>
                ))}
                <span className="nk-fz-ic nk-fz-mine">
                  <i>{mono}</i>
                  <small>{brand}</small>
                </span>
                {FZ_ICONS.slice(7).map((l) => (
                  <span key={l} className="nk-fz-ic">
                    <i />
                    <small>{l}</small>
                  </span>
                ))}
              </div>
              <div className="nk-fz-dock">
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className="nk-fz-note">
                <span className="nk-fz-nmono">{mono}</span>
                <span className="nk-fz-ntext">
                  <small>
                    <b>{brand}</b> · now
                  </small>
                  Your card of the day is ready.
                </span>
              </div>
            </div>

            {/* aplikacja */}
            <div className="nk-fz-app">
              <div className="nk-hhead">
                <span className="nk-hmono">{mono}</span>
                <b className="nk-hname">{brand}</b>
                <span className="nk-hpill">Sample data</span>
              </div>
              <div className="nk-htiles nk-fz-tiles">
                <span>
                  <b key={streak}>{streak}</b>day streak
                </span>
                <span>
                  <b>{30 - streak}</b>days left
                </span>
              </div>
              <div className="nk-hcard nk-fz-card">
                <div className="nk-hcard-in">
                  <b>{done ? `✓ Day ${FZ_DAY} ticked` : 'Card of the day'}</b>
                  <small>{done ? 'Next card tomorrow' : 'Taken it? Scratch.'}</small>
                </div>
                <Scratch gone={done} foil={colour} onDone={() => setDone(true)} />
              </div>
              <div className="nk-fz-stamps">
                <small>Stamps · free pack at 3</small>
                <div>
                  {[0, 1, 2].map((i) => (
                    <i key={i} className={i === 0 || (i === 1 && stamp) ? 'is-got' : ''} />
                  ))}
                  <span>{stamp ? '2 of 3' : '1 of 3'}</span>
                </div>
              </div>
              <div className={'nk-fz-code' + (at >= FZ_N - 1 ? ' is-on' : '')}>
                <small>Next-pack code</small>
                <b>{at >= FZ_N - 1 ? `${mono}-NEXT24` : '••••••••'}</b>
                <span className="nk-fz-use">Use in the {brand} store</span>
              </div>
              <div className="nk-htabs">
                <span className={at < FZ_N - 1 ? 'is-on' : ''}>Today</span>
                <span className={at >= FZ_N - 1 ? 'is-on' : ''}>Rewards</span>
                <span>Shop</span>
                <span>Account</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
