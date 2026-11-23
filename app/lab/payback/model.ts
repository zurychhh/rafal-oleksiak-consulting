/* Model narzedzia /lab/payback — czysta funkcja, bez Reacta.
   Test: node scripts/payback-model.test.mjs

   Zasada: wynik liczy sie WYLACZNIE z liczb podanych w argumentach (pola odwiedzajacego).
   Wzor: zamowienie, ktore zwraca koszt pozyskania = ceil(koszt pozyskania / marza na zamowieniu).
   Dzien zwrotu = (numer zamowienia − 1) × odstep miedzy zamowieniami (pierwsze zamowienie = dzien 0). */

export type PaybackInput = {
  cac: number // koszt pozyskania jednego klienta, w walucie
  margin: number // marza brutto na zamowieniu, w walucie
  gap: number // dni miedzy zamowieniami
}

export type PaybackField = 'cac' | 'margin' | 'gap'

export type PaybackResult = {
  ok: boolean
  missing: PaybackField[]
  order: number // numer zamowienia, na ktorym klient przestaje kosztowac
  day: number // dzien tego zamowienia, liczac od pierwszego
}

const pos = (v: number | undefined): v is number => typeof v === 'number' && Number.isFinite(v) && v > 0

export function payback(i: PaybackInput): PaybackResult {
  const missing: PaybackField[] = []
  if (!pos(i.cac)) missing.push('cac')
  if (!pos(i.margin)) missing.push('margin')
  if (!pos(i.gap)) missing.push('gap')
  if (missing.length) return { ok: false, missing, order: 0, day: 0 }
  // drobna tolerancja: 120 / 40 = 3 a nie 3.0000000001
  const order = Math.max(1, Math.ceil(i.cac / i.margin - 1e-9))
  return { ok: true, missing, order, day: Math.round((order - 1) * i.gap) }
}

/** Wynik na kliencie, ktory zlozyl n zamowien: n × marza − koszt pozyskania. */
export function balanceAfter(n: number, cac: number, margin: number): number {
  return n * margin - cac
}
