'use client'

import { memo, useEffect, useRef, useState } from 'react'

// Spec 21 B (R4 p10): pasek aktow na /work/genactiv — wzor z app/nawyko/ChapterBar.tsx (spec 20), osobny komponent.
// Rozdzialy = grupy istniejacych aktow sceny, etykiety z istniejacych kickerow. Ukryty na pierwszym ekranie (akt 0) i bez JS,
// wraca przy przewijaniu w gore, chowa w dol, znika przy formularzu. position:fixed + transform => zero przesuniec ukladu.

const CHAPTERS: { label: string; from: number; to: number }[] = [
  { label: 'The problem', from: 1, to: 1 },
  { label: 'How it works', from: 2, to: 4 },
  { label: 'Cashback', from: 5, to: 5 },
  { label: 'Points and levels', from: 6, to: 6 },
  { label: 'Data and consent', from: 7, to: 7 },
  { label: 'How it was built', from: 8, to: 8 },
  { label: 'Results', from: 9, to: 9 },
  { label: 'Your brand colour', from: 10, to: 10 },
]
const chapterOf = (a: number) => CHAPTERS.findIndex((c) => a >= c.from && a <= c.to)

type Props = {
  /** Biezacy akt sceny w trybie przewijania; null = uklad statyczny (akt liczony z polozenia sekcji .ga-act-i). */
  act: number | null
  /** Skok do aktu (scrollTo w scenie albo przewiniecie do sekcji i fokus w ukladzie statycznym). */
  onJump: (act: number) => void
}

const STEP = 8

function ActBarImpl({ act, onJump }: Props) {
  const [shown, setShown] = useState(false)
  const [open, setOpen] = useState(false)
  const [stillAct, setStillAct] = useState(0)
  const bar = useRef<HTMLDivElement>(null)
  const openRef = useRef(false)
  const actRef = useRef(act)
  const quiet = useRef(0)
  const tickRef = useRef<() => void>(() => {})
  openRef.current = open
  actRef.current = act

  useEffect(() => {
    const form = document.getElementById('enquiry')
    let lastY = window.scrollY
    let want = false
    let raf = 0
    let prevA = -1
    let prevOn: boolean | null = null
    const narrow = window.matchMedia('(max-width:1099px)')

    const tick = () => {
      raf = 0
      const y = window.scrollY
      const vh = window.innerHeight
      let a = actRef.current
      let inScene = false
      if (a === null) {
        // uklad statyczny: ostatnia sekcja aktu, ktorej gorna krawedz minela 40% wysokosci ekranu
        a = 0
        for (let i = 1; i < 11; i++) {
          const s = document.querySelector('.ga-act-' + i)
          if (s && s.getBoundingClientRect().top < vh * 0.4) a = i
        }
        if (a !== prevA) {
          prevA = a
          setStillAct(a)
        }
      } else {
        const t = document.querySelector('.ga-track')?.getBoundingClientRect()
        inScene = !!t && t.top <= 1 && t.bottom >= vh - 1
      }
      const s0 = document.querySelector('.ga-act-0')
      const past = actRef.current === null ? !!s0 && s0.getBoundingClientRect().bottom < 0 : a >= 1
      const fr = form?.getBoundingClientRect()
      const atForm = !!fr && fr.top < vh * 0.6 && fr.bottom > 0
      const d = y - lastY
      if (performance.now() < quiet.current) want = false
      else if (d > STEP) want = false
      else if (d < -STEP) want = true
      if (Math.abs(d) > STEP) lastY = y
      // lekcja R16: na telefonie przypieta scena zaczyna sie 18 px od gory — pasek zaslanialby kicker i tytul aktu.
      // W scenie < 1100 px pasek ustepuje (spec 21 B5).
      const blocked = inScene && narrow.matches
      const on = past && !atForm && !blocked && (want || openRef.current)
      if (on !== prevOn) {
        prevOn = on
        setShown(on)
        if (!on) setOpen(false)
      }
    }
    tickRef.current = tick
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    // WCAG 2.2 2.4.11: gdy fokus laduje pod paskiem, pasek ustepuje.
    const onFocus = (e: FocusEvent) => {
      const t = e.target as HTMLElement | null
      if (!t || !bar.current || bar.current.contains(t) || typeof t.getBoundingClientRect !== 'function') return
      const h = bar.current.getBoundingClientRect().bottom
      if (prevOn && t.getBoundingClientRect().top < h + 8) {
        want = false
        prevOn = false
        setShown(false)
        setOpen(false)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    document.addEventListener('focusin', onFocus)
    tick()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      document.removeEventListener('focusin', onFocus)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        bar.current?.querySelector<HTMLButtonElement>('.ga-ab-toggle')?.focus()
      }
    }
    const onDown = (e: PointerEvent) => {
      if (bar.current && !bar.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  const hide = () => {
    quiet.current = performance.now() + 800
    setOpen(false)
    setShown(false)
  }
  const cur = chapterOf(act ?? stillAct)
  const label = CHAPTERS[Math.max(0, cur)].label
  return (
    <div ref={bar} className="ga-ab" data-on={shown ? '' : undefined} inert={!shown}>
      <nav className="ga-ab-row" aria-label="Chapters">
        <button
          type="button"
          className="ga-ab-toggle"
          aria-expanded={open}
          aria-controls="ga-ab-list"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="ga-ab-kicker">GENACTIV</span>
          <span className="ga-ab-cur">{label}</span>
          <span className="ga-ab-chev" aria-hidden="true" />
        </button>
        <ol className="ga-ab-list" id="ga-ab-list" hidden={!open}>
          {CHAPTERS.map((c, i) => (
            <li key={c.label}>
              <a
                href={'#ga-t' + c.from}
                aria-current={i === cur ? 'location' : undefined}
                onClick={(e) => {
                  e.preventDefault()
                  hide()
                  onJump(c.from)
                }}
              >
                <span className="ga-ab-n">{String(i + 1).padStart(2, '0')}</span>
                {c.label}
              </a>
            </li>
          ))}
        </ol>
        <a
          className="ga-ab-cta"
          href="#enquiry"
          onClick={() => {
            hide()
            // recenzja 26 M1: fokus na formularz po skoku (czytnik ekranu oglasza cel, Tab idzie dalej od formularza)
            requestAnimationFrame(() => {
              const t = document.getElementById('enquiry')
              if (t) {
                t.tabIndex = -1
                t.focus({ preventScroll: true })
              }
            })
          }}
        >
          Ask about a brand app
        </a>
      </nav>
    </div>
  )
}

/** Renderuje sie tylko przy zmianie aktu (nie przy kazdej klatce postepu sceny). */
export const ActBar = memo(ActBarImpl)
