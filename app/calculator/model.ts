/* Model kalkulatora /calculator (v2) — czyste funkcje, bez Reacta.
   Test: node scripts/calculator-model.test.mjs

   Zasada: wynik liczy sie WYLACZNIE z liczb podanych w argumentach. Zadnych
   wartosci domyslnych z rynku, zadnych benchmarkow w srodku wzoru.
   Wzor: zamowien rocznie na klienta = 365 / odstep;
         dodatkowy przychod = klienci × wartosc zamowienia × (365/docelowy − 365/obecny). */

export const YEAR = 365

export type GapInput = {
  customers: number // klienci kupujacy ponownie
  aov: number // srednia wartosc zamowienia
  gapNow: number // dni miedzy zamowieniami dzis
  gapTarget: number // docelowy odstep
}

export type GapField = 'customers' | 'aov' | 'gapNow' | 'gapTarget'

export type GapResult = {
  ok: boolean
  /** ktorego pola brakuje albo ktore jest poza zakresem */
  missing: GapField[]
  ordersNow: number // zamowien na klienta rocznie dzis
  ordersTarget: number
  extraOrders: number // na klienta rocznie
  extraRevenue: number
}

const pos = (v: number | undefined): v is number => typeof v === 'number' && Number.isFinite(v) && v > 0

export function gapValue(i: GapInput): GapResult {
  const missing: GapField[] = []
  if (!pos(i.customers)) missing.push('customers')
  if (!pos(i.aov)) missing.push('aov')
  if (!pos(i.gapNow)) missing.push('gapNow')
  if (!pos(i.gapTarget)) missing.push('gapTarget')
  if (missing.length) return { ok: false, missing, ordersNow: 0, ordersTarget: 0, extraOrders: 0, extraRevenue: 0 }

  // Docelowy odstep nigdy dluzszy niz obecny: kalkulator nie liczy pogorszenia.
  const t1 = Math.min(i.gapTarget, i.gapNow)
  const ordersNow = YEAR / i.gapNow
  const ordersTarget = YEAR / t1
  const extraOrders = ordersTarget - ordersNow
  return { ok: true, missing, ordersNow, ordersTarget, extraOrders, extraRevenue: i.customers * i.aov * extraOrders }
}

/** Dni ponownych zamowien jednego klienta w roku: T, 2T … ≤ 365. Do rysunku osi. */
export function orderDays(gap: number, max = 60): number[] {
  if (!pos(gap)) return []
  const out: number[] = []
  for (let k = 1; k * gap <= YEAR && out.length < max; k++) out.push(k * gap)
  return out
}

/** Zakres suwaka docelowego odstepu: od polowy obecnego do obecnego; nie mniej niz 1 dzien
    i nie mniej niz 7 dni, gdy obecny na to pozwala (os rysuje najwyzej 60 zamowien w roku). */
export function targetRange(gapNow: number): { min: number; max: number } {
  if (!pos(gapNow)) return { min: 1, max: 1 }
  const max = Math.max(1, Math.round(gapNow))
  return { min: Math.max(1, Math.min(max, Math.max(7, Math.ceil(max / 2)))), max }
}

/** Liczba z pola tekstowego: przyjmuje spacje, przecinek i kropke; pusta = undefined. */
export function parseNum(raw: string): number | undefined {
  let s = raw.replace(/[\s\u00a0\u202f_']/g, '')
  if (!s) return undefined
  // "4,000" / "4.000" / "1,250,000": separator przed dokladnie trzema cyframi to tysiace, nie ulamek.
  if (/^[1-9]\d{0,2}([.,]\d{3})+$/.test(s)) s = s.replace(/[.,]/g, '')
  else if (/^[1-9]\d{0,2}(,\d{3})+\.\d+$/.test(s)) s = s.replace(/,/g, '')
  else if (/^[1-9]\d{0,2}(\.\d{3})+,\d+$/.test(s)) s = s.replace(/\./g, '').replace(',', '.')
  else s = s.replace(',', '.')
  if (!/^\d*\.?\d*$/.test(s) || s === '.') return undefined
  const v = Number(s)
  return Number.isFinite(v) ? v : undefined
}
