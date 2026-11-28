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
const SP_MIN_ZOOM = 0.72

export function useStepPin(n: number) {
  const sec = useRef<HTMLElement | null>(null)
  const pin = useRef<HTMLDivElement | null>(null)
  const prog = useRef<HTMLDivElement | null>(null)
  const [pinned, setPinned] = useState(false)
  const [step, setStep] = useState(0)
  const [vw, setVw] = useState(0)
  const at = useRef(0)
  const isPin = useRef(false)

  const seg = () => {
    const s = sec.current
    if (!s) return null
    const r = s.getBoundingClientRect()
    return { r, seg: Math.max(1, (r.height - window.innerHeight) / n) }
  }

  useEffect(() => {
    let mq: MediaQueryList | null = null
    try {
      mq = window.matchMedia(SP_PIN_Q)
    } catch {
      /* bez matchMedia — sekcja bez przypięcia */
    }
    let raf = 0
    const tick = () => {
      raf = 0
      if (!isPin.current) return
      const t = seg()
      if (!t) return
      const pos = Math.min(n - 0.0001, Math.max(0, -t.r.top / t.seg))
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
      const p = !!mq?.matches && !navigator.webdriver
      isPin.current = p
      setPinned(p)
      on()
    }
    const fit = () => {
      setVw(window.innerWidth * 10000 + window.innerHeight)
      on()
    }
    sync()
    fit()
    mq?.addEventListener('change', sync)
    window.addEventListener('resize', fit)
    window.addEventListener('scroll', on, { passive: true })
    // pasek cookies zmienia --consent-h (wysokość sceny) bez zdarzenia resize
    const mo = new MutationObserver(fit)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] })
    return () => {
      mq?.removeEventListener('change', sync)
      window.removeEventListener('resize', fit)
      window.removeEventListener('scroll', on)
      mo.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [n])

  /* dopasowanie: przypięta scena nie może wystawać poza ekran (minus pasek cookies) */
  useLayoutEffect(() => {
    const el = pin.current?.querySelector<HTMLElement>('[data-sp-fit]')
    const box = pin.current
    if (!el || !box) return
    el.style.zoom = ''
    if (!pinned) return
    let z = 1
    for (let k = 0; k < 3 && box.scrollHeight > box.clientHeight + 1; k++) {
      z = Math.max(SP_MIN_ZOOM, Math.floor(z * (box.clientHeight / box.scrollHeight) * 98) / 100)
      el.style.zoom = String(z)
    }
  }, [pinned, vw])

  /* skrót: przewinięcie do kroku i (głąb odcinka, żeby zaokrąglenie nie wróciło do poprzedniego) */
  const go = useCallback(
    (i: number) => {
      const t = seg()
      if (!t || !isPin.current) return false
      const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const y = window.scrollY + t.r.top + (i + 0.35) * t.seg
      window.scrollTo({ top: Math.round(y), behavior: still ? 'auto' : 'smooth' })
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
      if (Number.isFinite(k) && k > at.current) go(k)
    },
    [go],
  )

  return { sec, pin, prog, pinned, step: pinned ? step : n - 1, go, onFocusCapture }
}
