/* Model kalkulatora /calculator — czyste funkcje, bez Reacta.
   Wzory i przypadki brzegowe: agencja/research/kalkulator-zrodla.md, sekcja 3.
   Test: node scripts/calculator-model.test.mjs

   Zasada: wynik liczy sie WYLACZNIE z liczb podanych w argumentach. Zadnych
   wartosci domyslnych z rynku, zadnych benchmarkow w srodku wzoru. */

export const YEAR = 365

export type GapInput = {
  customers: number // N — klienci kupujacy ponownie
  aov: number // srednia wartosc zamowienia
  gapNow: number // T0 — dni miedzy zamowieniami dzis
  gapTarget: number // T1 — docelowy odstep
  packDays?: number // D — na ile dni starcza jedno zamowienie
  marginPct?: number // m — marza brutto w %
}

export type GapNote = 'no-slack' | 'below-pack' | 'rare' | 'no-pack'

export type GapResult = {
  ok: boolean
  /** ktorego pola brakuje albo ktore jest poza zakresem */
  missing: Array<'customers' | 'aov' | 'gapNow' | 'gapTarget'>
  ordersNow: number // zamowien na klienta rocznie dzis
  ordersTarget: number
  revenueNow: number
  revenueTarget: number
  extraRevenue: number
  upliftPct: number // T0/T1 - 1, w %
  extraMargin: number | null
  /** ile jest wart jeden dzien krotszego odstepu, srednio na odcinku T0→T1 */
  perDay: number
  /** rabat na ponowne zamowienie, przy ktorym przychod sie nie zmienia, w % */
  breakEvenDiscountRevenue: number
  /** jak wyzej, ale dla marzy; null bez marzy */
  breakEvenDiscountMargin: number | null
  /** dni miedzy zamowieniami bez produktu: T0 - D; null bez D */
  daysWithout: number | null
  /** gorna granica: klient zamawia w dniu, w ktorym konczy opakowanie */
  ceilingRevenue: number | null
  notes: GapNote[]
}

const pos = (v: number | undefined): v is number => typeof v === 'number' && Number.isFinite(v) && v > 0

export function gapScenario(i: GapInput): GapResult {
  const missing: GapResult['missing'] = []
  if (!pos(i.customers)) missing.push('customers')
  if (!pos(i.aov)) missing.push('aov')
  if (!pos(i.gapNow)) missing.push('gapNow')
  if (!pos(i.gapTarget)) missing.push('gapTarget')

  const empty: GapResult = {
    ok: false,
    missing,
    ordersNow: 0,
    ordersTarget: 0,
    revenueNow: 0,
    revenueTarget: 0,
    extraRevenue: 0,
    upliftPct: 0,
    extraMargin: null,
    perDay: 0,
    breakEvenDiscountRevenue: 0,
    breakEvenDiscountMargin: null,
    daysWithout: null,
    ceilingRevenue: null,
    notes: [],
  }
  if (missing.length) return empty

  const { customers: n, aov, gapNow: t0 } = i
  // Docelowy odstep nigdy dluzszy niz obecny: kalkulator nie liczy pogorszenia.
  const t1 = Math.min(i.gapTarget, t0)
  const d = pos(i.packDays) ? i.packDays : null
  const m = pos(i.marginPct) ? Math.min(i.marginPct, 100) / 100 : null

  const ordersNow = YEAR / t0
  const ordersTarget = YEAR / t1
  const revenueNow = n * aov * ordersNow
  const revenueTarget = n * aov * ordersTarget
  const extraRevenue = revenueTarget - revenueNow
  const cut = t0 - t1

  const notes: GapNote[] = []
  if (d === null) notes.push('no-pack')
  else {
    if (t0 <= d) notes.push('no-slack')
    if (t1 < d) notes.push('below-pack')
  }
  if (t0 > YEAR) notes.push('rare')

  return {
    ok: true,
    missing,
    ordersNow,
    ordersTarget,
    revenueNow,
    revenueTarget,
    extraRevenue,
    upliftPct: (t0 / t1 - 1) * 100,
    extraMargin: m === null ? null : extraRevenue * m,
    perDay: cut > 0 ? extraRevenue / cut : 0,
    breakEvenDiscountRevenue: (1 - t1 / t0) * 100,
    breakEvenDiscountMargin: m === null ? null : m * (1 - t1 / t0) * 100,
    daysWithout: d === null ? null : Math.max(0, t0 - d),
    ceilingRevenue: d === null || d >= t0 ? null : n * aov * YEAR * (1 / d - 1 / t0),
    notes,
  }
}

export type SecondInput = {
  newCustomers: number // C — nowi klienci rocznie
  aov: number
  rateNow: number // r0 w %
  rateTarget: number // r1 w %
  marginPct?: number
}

export type SecondResult = {
  ok: boolean
  missing: Array<'newCustomers' | 'aov' | 'rateNow' | 'rateTarget'>
  extraCustomers: number // zaokraglone w dol do wyswietlenia
  extraRevenue: number // liczone z pelnej wartosci; tylko drugie zamowienie
  extraMargin: number | null
}

const pct = (v: number | undefined): v is number => typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 100

export function secondScenario(i: SecondInput): SecondResult {
  const missing: SecondResult['missing'] = []
  if (!pos(i.newCustomers)) missing.push('newCustomers')
  if (!pos(i.aov)) missing.push('aov')
  if (!pct(i.rateNow)) missing.push('rateNow')
  if (!pct(i.rateTarget)) missing.push('rateTarget')
  if (missing.length) return { ok: false, missing, extraCustomers: 0, extraRevenue: 0, extraMargin: null }

  const gain = Math.max(0, i.rateTarget - i.rateNow) / 100
  const exact = i.newCustomers * gain
  const extraRevenue = exact * i.aov
  const m = pos(i.marginPct) ? Math.min(i.marginPct, 100) / 100 : null
  return {
    ok: true,
    missing,
    extraCustomers: Math.floor(exact + 1e-9),
    extraRevenue,
    extraMargin: m === null ? null : extraRevenue * m,
  }
}

/** Dni zamowien jednego klienta w roku: 0, T, 2T … < 365. Do rysunku osi. */
export function orderDays(gap: number, max = 80): number[] {
  if (!pos(gap)) return []
  const out: number[] = []
  for (let k = 0; k * gap < YEAR && out.length < max; k++) out.push(k * gap)
  return out
}

/** Liczba z pola tekstowego: przyjmuje spacje, przecinek i kropke; pusta = undefined. */
export function parseNum(raw: string): number | undefined {
  let s = raw.replace(/[\s\u00a0_']/g, '')
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
