/* Model narzedzia /lab/reward — czysta funkcja, bez Reacta.
   Test: node scripts/reward-model.test.mjs

   Zasada: wynik liczy sie WYLACZNIE z liczb podanych w argumentach (pola odwiedzajacego).
   Wzor: maksymalny koszt nagrod na klienta na rok = marza na zamowieniu × dodatkowe zamowienia.
   Wartosc zamowienia sluzy do kontroli (marza nie moze jej przekroczyc) i do paska „extra sales”. */

export type RewardInput = {
  aov: number // srednia wartosc zamowienia
  margin: number // marza brutto na zamowieniu, w walucie
  extraOrders: number // dodatkowe zamowienia na klienta rocznie (zalozenie odwiedzajacego)
}

export type RewardField = 'aov' | 'margin' | 'extraOrders'

export type RewardResult = {
  ok: boolean
  missing: RewardField[]
  /** marza wyzsza niz wartosc zamowienia */
  marginOverAov: boolean
  extraSales: number // aov × extraOrders
  ceiling: number // margin × extraOrders = najwyzszy koszt nagrod, ktory sie zwraca
}

const pos = (v: number | undefined): v is number => typeof v === 'number' && Number.isFinite(v) && v > 0

export function rewardCeiling(i: RewardInput): RewardResult {
  const missing: RewardField[] = []
  if (!pos(i.aov)) missing.push('aov')
  if (!pos(i.margin)) missing.push('margin')
  if (!pos(i.extraOrders)) missing.push('extraOrders')
  const marginOverAov = !missing.length && i.margin > i.aov
  if (missing.length || marginOverAov) return { ok: false, missing, marginOverAov, extraSales: 0, ceiling: 0 }
  return { ok: true, missing, marginOverAov, extraSales: i.aov * i.extraOrders, ceiling: i.margin * i.extraOrders }
}

/** Czy dany koszt nagrod na klienta rocznie sie zwraca; left > 0 = zostaje, < 0 = brakuje. */
export function verdict(ceiling: number, cost: number): { paysOff: boolean; left: number } {
  const left = ceiling - cost
  return { paysOff: left >= 0, left }
}
