'use client'
/* Spec 53 pkt 2 (PILNE TERAZ 2, Rafał 28.11.2026 11:33): sekcja z kilkoma opcjami jako przypięta scena odsłaniana przewijaniem.
   Zwykłe przewijanie strony: bez przechwytywania kółka, bez scroll-snap. Sekcja = tor (n odcinków + ekran), w środku
   `position: sticky` (CSS w step-pin.css), krok = położenie toru względem góry ekranu. Kliknięcie kroku = przewinięcie do
   środka jego odcinka (skrót, nie zmiana zachowania). Warunek przypięcia jak kokpit (CK_PIN_Q) + brak navigator.webdriver;
   bez JS, w prefers-reduced-motion, na wąskim albo niskim oknie — sekcja jak dotąd, wszystkie opcje widoczne pod sobą.
   Gdy przypięta scena nie mieści się w oknie (pasek cookies, mała wysokość), treść sceny zmniejsza się `zoom`
   do SP_MIN_ZOOM — ta sama technika co kokpit „For you”. */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

export const SP_PIN_Q = '(min-width:900px) and (min-height:600px) and (prefers-reduced-motion: no-preference)'
/* PILNE TERAZ 3 (doradca 28.11 13:36, Rafał 12:47): telefon i wąskie okno też przypinają. Na < 900 px przypięta jest
   „scena” od licznika kroków w dół (licznik + kafel / schemat), a nagłówek sekcji przewija się normalnie przed nią:
   sticky z ujemnym `top` (= odległość licznika od góry sceny), więc nic nie jest wycinane z DOM (Z-05). Za wysoki kafel →
   `zoom` samej sceny do SP_MIN_ZOOM_N. Niżej niż 560 px — bez przypięcia, wszystko pod sobą. */
export const SP_PIN_NARROW_Q = '(max-width:899.98px) and (min-height:560px) and (prefers-reduced-motion: no-preference)'
const SP_MIN_ZOOM = 0.72
const SP_MIN_ZOOM_N = 0.62
const SP_SEG_N = 0.6 // odcinek na krok na telefonie: 60 % wysokości ekranu
const SP_PAD_N = 10

/* bramka WebKit (WebKitGTK pod automatyzacją ma navigator.webdriver = true): ?pin=1 tylko na localhost włącza przypięcie mimo
   straży webdriver; na każdej innej domenie parametr nic nie zmienia */
export function pinForced() {
  try {
    return /^(localhost|127\.0\.0\.1)$/.test(location.hostname) && new URLSearchParams(location.search).get('pin') === '1'
  } catch {
    return false
  }
}

export function useStepPin(n: number, ids: readonly string[] = []) {
  const sec = useRef<HTMLElement | null>(null)
  const pin = useRef<HTMLDivElement | null>(null)
  const prog = useRef<HTMLDivElement | null>(null)
  const [pinned, setPinned] = useState(false)
  const [narrow, setNarrow] = useState(false)
  // telefon: odległość licznika od góry sceny (ujemny sticky top), wysokość sceny, długość odcinka — z dopasowania
  const geo = useRef({ top: 0, ph: 0, seg: 1 })
  const isNarrow = useRef(false)
  const pendHash = useRef(-1) // telefon: kotwica na krok czeka na dopasowanie (geometria toru znana dopiero po nim)
  const [step, setStep] = useState(0)
  const [vw, setVw] = useState(0)
  // dopasowanie (odczyt scrollHeight = wymuszony uklad calej strony) dopiero, gdy scena jest blisko ekranu — inaczej obie
  // sceny mierzyly sie zaraz po hydratacji, w pierwszej klatce przewijania (loaf-detail: 150 ms, uklad 138 ms)
  const [near, setNear] = useState(false)
  const at = useRef(0)
  const isPin = useRef(false)

  /* r = prostokąt sekcji, seg = odcinek na krok, t0 = położenie r.top, przy którym scena się przypina (desktop 0, telefon ujemne) */
  const seg = () => {
    const s = sec.current
    if (!s) return null
    const r = s.getBoundingClientRect()
    if (isNarrow.current) return { r, seg: geo.current.seg, t0: geo.current.top }
    return { r, seg: Math.max(1, (r.height - window.innerHeight) / n), t0: 0 }
  }
  const yOf = (t: { r: DOMRect; seg: number; t0: number }, k: number) => Math.round(window.scrollY + t.r.top - t.t0 + (k + 0.35) * t.seg)

  useEffect(() => {
    let mq: MediaQueryList | null = null
    let mqn: MediaQueryList | null = null
    try {
      mq = window.matchMedia(SP_PIN_Q)
      mqn = window.matchMedia(SP_PIN_NARROW_Q)
    } catch {
      /* bez matchMedia — sekcja bez przypięcia */
    }
    let raf = 0
    const tick = () => {
      raf = 0
      if (!isPin.current) return
      const t = seg()
      if (!t) return
      const pos = Math.min(n - 0.0001, Math.max(0, (t.t0 - t.r.top) / t.seg))
      const i = Math.floor(pos)
      prog.current?.style.setProperty('--f', (pos - i).toFixed(3))
      if (i !== at.current) {
        at.current = i
        setStep(i)
      }
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const sync = () => {
      const ok = !navigator.webdriver || pinForced()
      const w = !!mq?.matches && ok
      const nn = !w && !!mqn?.matches && ok
      isPin.current = w || nn
      isNarrow.current = nn
      setPinned(w || nn)
      setNarrow(nn)
      on()
    }
    const fit = () => {
      setVw((v) => v + 1) // licznik: pasek cookies zmienia wysokosc sceny przy tym samym oknie
      on()
    }
    // recenzja 60 I1: kotwica na krok (np. /nawyko#levels z menu) — przewiń do jego odcinka, inaczej cel jest jeszcze nieodsłonięty
    const toHash = () => {
      const k = ids.indexOf(decodeURIComponent(window.location.hash.slice(1)))
      if (k < 0 || !isPin.current) return
      if (isNarrow.current && !geo.current.ph) {
        pendHash.current = k
        return
      }
      requestAnimationFrame(() => {
        const t = seg()
        if (t) window.scrollTo({ top: yOf(t, k), behavior: 'auto' })
      })
    }
    let io: IntersectionObserver | null = null
    if (sec.current && 'IntersectionObserver' in window) {
      io = new IntersectionObserver((es) => setNear(es.some((e) => e.isIntersecting)), { rootMargin: '150% 0px' })
      io.observe(sec.current)
    } else setNear(true)
    sync()
    fit()
    toHash()
    window.addEventListener('hashchange', toHash)
    mq?.addEventListener('change', sync)
    mqn?.addEventListener('change', sync)
    window.addEventListener('resize', fit)
    window.addEventListener('scroll', on, { passive: true })
    // pasek cookies zmienia --consent-h (wysokość sceny) bez zdarzenia resize
    // tylko gdy zmienila sie wysokosc paska — styl <html> zmienia sie tez przy przewijaniu (zmienne innych scen),
    // a kazde ponowne dopasowanie to wymuszony uklad (scroll-perf 124 ms w pierwszej wersji)
    let consent = ''
    const mo = new MutationObserver(() => {
      const c = document.documentElement.style.getPropertyValue('--consent-h')
      if (c === consent) return
      consent = c
      fit()
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] })
    return () => {
      mq?.removeEventListener('change', sync)
      mqn?.removeEventListener('change', sync)
      window.removeEventListener('resize', fit)
      window.removeEventListener('hashchange', toHash)
      window.removeEventListener('scroll', on)
      mo.disconnect()
      io?.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [n, ids])

  /* dopasowanie: przypięta scena nie może wystawać poza ekran (minus pasek cookies) */
  useLayoutEffect(() => {
    const el = pin.current?.querySelector<HTMLElement>('[data-sp-fit]')
    const box = pin.current
    const s = sec.current
    if (!el || !box || !s) return
    const zn = box.querySelector<HTMLElement>('[data-sp-zoom]')
    if (!pinned || !narrow) {
      if (zn) zn.style.zoom = ''
      s.style.removeProperty('--sp-top')
      s.style.removeProperty('--sp-h')
    }
    if (!pinned) {
      el.style.zoom = ''
      return
    }
    if (!near) return
    if (narrow) {
      /* telefon: scena od licznika [data-sp-anchor] do końca [data-sp-end] musi się zmieścić w oknie minus pasek cookies */
      el.style.zoom = ''
      const a = box.querySelector<HTMLElement>('[data-sp-anchor]')
      const end = box.querySelector<HTMLElement>('[data-sp-end]')
      if (!a || !end || !zn) return
      zn.style.zoom = ''
      const consent = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--consent-h')) || 0
      const vis = window.innerHeight - consent
      const b0 = box.getBoundingClientRect().top
      const aTop = a.getBoundingClientRect().top - b0
      const zTop = zn.getBoundingClientRect().top - b0
      const eBot = end.getBoundingClientRect().bottom - b0
      let z = 1
      if (eBot - aTop > vis - 2 * SP_PAD_N) {
        z = Math.max(SP_MIN_ZOOM_N, Math.floor(((vis - 2 * SP_PAD_N - (zTop - aTop)) / Math.max(1, eBot - zTop)) * 100) / 100)
        zn.style.zoom = String(z)
      }
      const ph = box.getBoundingClientRect().height
      const pad = box.getBoundingClientRect().top - s.getBoundingClientRect().top // odstęp sceny od góry sekcji (padding)
      const top = -Math.round(aTop - SP_PAD_N)
      const sg = Math.round(window.innerHeight * SP_SEG_N)
      // scena przypina się, gdy r.top sekcji = top - pad; sekcja = pad + scena + n odcinków
      geo.current = { top: top - pad, ph, seg: sg }
      s.style.setProperty('--sp-top', top + 'px')
      s.style.setProperty('--sp-h', Math.round(pad + ph + n * sg) + 'px')
      if (pendHash.current >= 0) {
        const k = pendHash.current
        pendHash.current = -1
        requestAnimationFrame(() => {
          const r = s.getBoundingClientRect()
          window.scrollTo({ top: Math.round(window.scrollY + r.top - (top - pad) + (k + 0.35) * sg), behavior: 'auto' })
        })
      }
      return
    }
    el.style.zoom = ''
    let z = 1
    for (let k = 0; k < 3 && box.scrollHeight > box.clientHeight + 1; k++) {
      z = Math.max(SP_MIN_ZOOM, Math.floor(z * (box.clientHeight / box.scrollHeight) * 98) / 100)
      el.style.zoom = String(z)
    }
  }, [pinned, narrow, vw, near, n])

  /* skrót: przewinięcie do kroku i (głąb odcinka, żeby zaokrąglenie nie wróciło do poprzedniego) */
  const go = useCallback(
    (i: number) => {
      const t = seg()
      if (!t || !isPin.current) return false
      const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      window.scrollTo({ top: yOf(t, i), behavior: still ? 'auto' : 'smooth' })
      return true
    },
    [n],
  )

  /* fokus z klawiatury na kroku, który jeszcze nie jest odsłonięty — przewiń do niego (krok k = element [data-sp-step=k]) */
  const onFocusCapture = useCallback(
    (e: React.FocusEvent) => {
      if (!isPin.current) return
      const host = (e.target as HTMLElement).closest<HTMLElement>('[data-sp-step]')
      if (!host) return
      const k = Number(host.dataset.spStep)
      if (Number.isFinite(k) && (k > at.current || (isNarrow.current && k < at.current))) go(k)
    },
    [go],
  )

  return { sec, pin, prog, pinned, narrow: pinned && narrow, step: pinned ? step : n - 1, go, onFocusCapture }
}
