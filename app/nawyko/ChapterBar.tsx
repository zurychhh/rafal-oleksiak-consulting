'use client'

import { useEffect, useRef, useState, type MouseEvent } from 'react'

// Spec 20 (R4 p9): pasek rozdzialow jak lokalna nawigacja stron produktowych Apple.
// Pojawia sie dopiero za pierwszym ekranem, chowa przy przewijaniu w dol i wraca przy przewijaniu w gore
// (Smashing Magazine, „Designing Sticky Menus: UX Guidelines”, 2023 — menu czesciowo przyklejone).
// Mowi, gdzie jestes na stronie dlugiej na kilkanascie ekranow, i daje jeden staly krok: zapytanie.
// position:fixed + transform => zero przesuniec ukladu. Bez JS nie istnieje (stan poczatkowy: ukryty).

export type Chapter = { id: string; label: string }

type Props = {
  chapters: Chapter[]
  /** Element, za ktorym pasek moze sie pojawic (koniec pierwszego ekranu). */
  afterId: string
  /** Kotwica formularza; gdy formularz jest na ekranie, pasek znika. */
  ctaHref: string
  ctaLabel: string
  className?: string
}

const STEP = 8

export function ChapterBar({ chapters, afterId, ctaHref, ctaLabel, className = '' }: Props) {
  const [shown, setShown] = useState(false)
  const [open, setOpen] = useState(false)
  const [cur, setCur] = useState(-1)
  // R4 p10 D1: true, gdy przypieta scena wypelnia ekran (na >= 1100 px pasek pokazuje wtedy tylko rozdzial + CTA)
  const [pinned, setPinned] = useState(false)
  // R4 p10 D2: biezacy akt sceny („04 Reward”) z jej nawigacji .nk-acts — tylko skladanie istniejacych etykiet
  const [act, setAct] = useState('')
  const bar = useRef<HTMLDivElement>(null)
  const openRef = useRef(false)
  const quiet = useRef(0)
  openRef.current = open

  useEffect(() => {
    const after = document.getElementById(afterId)
    const form = document.getElementById(ctaHref.replace(/^#/, ''))
    const secs = chapters.map((c) => document.getElementById(c.id))
    let lastY = window.scrollY
    let want = false
    let raf = 0
    let prevK = -2
    let prevOn: boolean | null = null
    const scene = document.querySelector<HTMLElement>('.nk-scene')
    const narrow = window.matchMedia('(max-width:1099px)')
    // R4 p10 D4: sekcje rozdzialow przyjmuja fokus programowo (bez wejscia w kolejnosc Tab)
    for (const s of secs) {
      if (s && !s.hasAttribute('tabindex')) {
        s.tabIndex = -1
        s.classList.add('cb-target')
      }
    }
    let prevPin: boolean | null = null
    let prevAct: string | null = null

    const tick = () => {
      raf = 0
      const y = window.scrollY
      const vh = window.innerHeight
      const past = after ? after.getBoundingClientRect().bottom < 0 : y > vh
      const fr = form?.getBoundingClientRect()
      const atForm = !!fr && fr.top < vh * 0.6 && fr.bottom > 0
      const d = y - lastY
      // po kliknieciu rozdzialu pasek nie wraca od razu nad naglowek, do ktorego wlasnie skoczylismy
      if (performance.now() < quiet.current) want = false
      else if (d > STEP) want = false
      else if (d < -STEP) want = true
      if (Math.abs(d) > STEP) lastY = y
      // rozdzial: ostatnia sekcja, ktorej gorna krawedz minela 40% wysokosci ekranu
      let k = -1
      for (let i = 0; i < secs.length; i++) {
        const s = secs[i]
        if (s && s.getBoundingClientRect().top < vh * 0.4) k = i
      }
      if (k !== prevK) {
        prevK = k
        setCur(k)
      }
      // R4 p9 recenzja W2: na telefonie przypieta scena zaczyna sie 18 px od gory — pasek zaslanialby nazwe marki
      // na ekranie telefonu. W scenie pasek ustepuje; wraca pod nia.
      let pin = false
      if (scene && scene.classList.contains('is-scroll')) {
        const r = scene.getBoundingClientRect()
        pin = r.top <= 1 && r.bottom >= vh - 1
      }
      if (pin !== prevPin) {
        prevPin = pin
        setPinned(pin)
      }
      let a = ''
      // recenzja 26 I2: akt tylko w przypietej scenie — po wyjsciu z niej etykieta wraca do samego rozdzialu
      if (pin && scene && k >= 0 && secs[k] === scene) {
        const btns = Array.from(scene.querySelectorAll('.nk-acts > *'))
        const j = btns.findIndex((b) => b.hasAttribute('aria-current'))
        if (j >= 0) a = `${String(j + 1).padStart(2, '0')} ${btns[j].textContent ?? ''}`
      }
      if (a !== prevAct) {
        prevAct = a
        setAct(a)
      }
      const inScene = pin && narrow.matches
      const on = past && !atForm && !inScene && (want || openRef.current)
      if (on !== prevOn) {
        prevOn = on
        setShown(on)
        if (!on) setOpen(false)
      }
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    // WCAG 2.2 2.4.11: pasek nie moze zaslaniac elementu z fokusem — gdy fokus laduje pod nim, pasek ustepuje.
    const onFocus = (e: FocusEvent) => {
      const t = e.target as HTMLElement | null
      if (!t || !bar.current || bar.current.contains(t) || typeof t.getBoundingClientRect !== 'function') return
      const h = bar.current.getBoundingClientRect().bottom
      if (t.getBoundingClientRect().top < h + 8) {
        want = false
        prevOn = false
        setShown(false)
        setOpen(false)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    document.addEventListener('focusin', onFocus)
    // akt sceny zmienia sie po jej wlasnym renderze — odczyt po zmianie data-act, nie o klatke za wczesnie
    const mo = scene ? new MutationObserver(onScroll) : null
    mo?.observe(scene as HTMLElement, { attributes: true, attributeFilter: ['data-act', 'class'] })
    tick()
    return () => {
      mo?.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      document.removeEventListener('focusin', onFocus)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [afterId, ctaHref, chapters])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        bar.current?.querySelector<HTMLButtonElement>('.cb-toggle')?.focus()
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

  const jump = (e: MouseEvent<HTMLAnchorElement>) => {
    quiet.current = performance.now() + 800
    setOpen(false)
    setShown(false)
    // R4 p10 D4: klikniety link zaraz staje sie inert — fokus na cel, zeby czytnik ekranu ogloscil sekcje
    const id = e.currentTarget.getAttribute('href')?.slice(1)
    const t = id ? document.getElementById(id) : null
    if (t) {
      if (!t.hasAttribute('tabindex')) {
        t.tabIndex = -1
        t.classList.add('cb-target')
      }
      requestAnimationFrame(() => t.focus({ preventScroll: true }))
    }
  }
  const base = cur >= 0 ? chapters[cur].label : 'Overview'
  const label = act ? `${base} · ${act}` : base
  return (
    <div
      ref={bar}
      className={`cb ${className}`}
      data-on={shown ? '' : undefined}
      data-pin={pinned ? '' : undefined}
      inert={!shown}
    >
      <div className="cb-row">
        <button
          type="button"
          className="cb-toggle"
          aria-expanded={open}
          aria-controls="cb-list"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="cb-kicker">Nawyko</span>
          <span className="cb-cur">{label}</span>
          <span className="cb-chev" aria-hidden="true" />
        </button>
        <a className="cb-name" href="#top" onClick={jump}>
          Nawyko
        </a>
        <nav className="cb-links" aria-label="Chapters">
          {chapters.map((c, i) => (
            <a key={c.id} href={`#${c.id}`} aria-current={i === cur ? 'location' : undefined} onClick={jump}>
              {c.label}
            </a>
          ))}
        </nav>
        <ol className="cb-list" id="cb-list" hidden={!open}>
          {chapters.map((c, i) => (
            <li key={c.id}>
              <a href={`#${c.id}`} aria-current={i === cur ? 'location' : undefined} onClick={jump}>
                <span className="cb-n">{String(i + 1).padStart(2, '0')}</span>
                {c.label}
              </a>
            </li>
          ))}
        </ol>
        <a className="cb-cta" href={ctaHref} onClick={jump}>
          {ctaLabel}
        </a>
      </div>
    </div>
  )
}
