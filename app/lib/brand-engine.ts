/* Spec 26 (R5 p1): silnik marki — jeden stan marki odwiedzajacego na cala witryne (/nawyko, /work/genactiv, /tools).
   Nazwa i kolor zostaja w przegladarce (localStorage w try/catch); nigdy nie ida do /api/lead ani do analityki.
   Bez zapisu (prywatne okno, zablokowane dane) strona dziala tak samo, tylko nie pamieta wyboru po przeladowaniu.
   Importowany wylacznie z komponentow 'use client'. */
import { useCallback, useSyncExternalStore } from 'react'

export const DEMO_BRAND = 'Tovemi'
export const DEFAULT_COLOUR = '#D6202B'
const KEY = 'oc-brand-v1'

export type BrandState = { name: string; colour: string }
const DEFAULT: BrandState = { name: '', colour: DEFAULT_COLOUR }

let state: BrandState = DEFAULT
let loaded = false
const subs = new Set<() => void>()

const cleanName = (v: unknown) => (typeof v === 'string' ? [...v].filter((ch) => ch >= ' ' && ch !== '<' && ch !== '>').join('').slice(0, 14) : '')
const cleanColour = (v: unknown) => (typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v) ? v.toUpperCase() : DEFAULT_COLOUR)

function load() {
  if (loaded || typeof window === 'undefined') return
  loaded = true
  try {
    const raw = window.localStorage.getItem(KEY)
    if (raw) {
      const j = JSON.parse(raw) as Partial<BrandState>
      state = { name: cleanName(j.name), colour: cleanColour(j.colour) }
    }
  } catch {
    /* brak dostepu do pamieci — zostaje stan domyslny */
  }
  window.addEventListener('storage', (e) => {
    if (e.key !== KEY) return
    loaded = false
    load()
    subs.forEach((f) => f())
  })
}

function subscribe(f: () => void) {
  load()
  subs.add(f)
  return () => {
    subs.delete(f)
  }
}
const snap = () => {
  load()
  return state
}
const serverSnap = () => DEFAULT

export function setBrand(patch: Partial<BrandState>) {
  const next = {
    name: patch.name !== undefined ? cleanName(patch.name) : state.name,
    colour: patch.colour !== undefined ? cleanColour(patch.colour) : state.colour,
  }
  if (next.name === state.name && next.colour === state.colour) return
  state = next
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* bez zapisu — wybor dziala do przeladowania */
  }
  subs.forEach((f) => f())
}

/** name: to, co wpisal odwiedzajacy ('' = brak); brand: nazwa do pokazania (wpisana albo demo); own: czy wpisal swoja. */
export function useBrand() {
  const s = useSyncExternalStore(subscribe, snap, serverSnap)
  const brand = s.name.trim() || DEMO_BRAND
  return {
    name: s.name,
    colour: s.colour,
    brand,
    own: s.name.trim().length > 0,
    setName: useCallback((v: string) => setBrand({ name: v }), []),
    setColour: useCallback((v: string) => setBrand({ colour: v }), []),
  }
}

/* ── kolor: kontrast AA na kazdym tle ── */
function rgbOf(hex: string): [number, number, number] {
  const h = /^#?([0-9a-f]{6})$/i.exec(hex.trim())?.[1] ?? 'D6202B'
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number]
}
function lum([r, g, b]: [number, number, number]) {
  const f = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}
export function contrast(a: string, b: string) {
  const [x, y] = [lum(rgbOf(a)), lum(rgbOf(b))].sort((m, n) => n - m)
  return (x + 0.05) / (y + 0.05)
}
const hexOf = (c: number[]) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')
/** Tekst na kolorze marki: czarny albo bialy, ktory ma wyzszy kontrast (zawsze >= 4,58:1). */
export function onColour(hex: string) {
  return contrast(hex, '#FFFFFF') >= contrast(hex, '#000000') ? '#FFFFFF' : '#000000'
}
/** Kolor marki jako tekst na tle: przyciemniany (albo rozjasniany na ciemnym), az da >= 4,5:1. */
export function inkOn(hex: string, bg: string) {
  const c = rgbOf(hex)
  const to = lum(rgbOf(bg)) > 0.4 ? 0 : 255
  for (let k = 0; k <= 1.0001; k += 0.04) {
    const m = hexOf(c.map((v) => v + (to - v) * k))
    if (contrast(m, bg) >= 4.5) return m
  }
  return to ? '#FFFFFF' : '#000000'
}
/** Jasniejszy/ciemniejszy odcien do folii zdrapki (metaliczny gradient). */
export function mix(hex: string, to: string, k: number) {
  const a = rgbOf(hex)
  const b = rgbOf(to)
  return hexOf(a.map((v, i) => v + (b[i] - v) * k))
}
export function monogram(name: string) {
  const w = name.trim().split(/\s+/).filter(Boolean)
  const m = w.length > 1 ? w[0][0] + w[1][0] : (w[0] ?? 'T').slice(0, 2)
  return m.toUpperCase()
}
