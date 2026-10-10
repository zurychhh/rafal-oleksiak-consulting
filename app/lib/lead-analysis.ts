// app/lib/lead-analysis.ts
//
// Wynik z /tool w mailach. Jedna zasada: mail nie moze byc pewniejszy niz ekran.
// Mediana jako jedna liczba tylko przy probie >= 30 i bez dwoch szczytow;
// w kazdym innym przypadku zakres albo wprost "za malo, zeby to byla liczba".
// Te same slowa ida do tematu, do tresci i do maila wlasciciela — zeby zadne
// miejsce nie zgubilo zastrzezenia, ktore pokazal ekran.

import type { Lead } from '@/app/api/lead/route'

export const MIN_SAMPLE = 30
/** Okno krotsze niz to nie pokaze dluzszych odstepow (cenzurowanie prawostronne). */
const WINDOW_FLOOR = 180

export type Verdict = 'confident' | 'small' | 'bimodal' | 'partial'

export interface Analysis {
  interval?: number
  labelDay?: number
  /** liczba "settled gaps" (odstepow 2->3+), z ktorych silnik /tool liczy mediane */
  sampleN?: number
  windowDays?: number
  bimodal: boolean
  low?: number
  high?: number
  verdict: Verdict
  /** dzien realny minus dzien z etykiety; tylko przy 'confident' */
  gap?: number
  /** okno za krotkie wzgledem max(180, 3 x odstep, 3 x etykieta) */
  shortWindow: boolean
}

/** null, gdy zgloszenie nie niesie wyniku (strona glowna, stary klient). */
export function analysisOf(lead: Lead): Analysis | null {
  const { interval, labelDay, sampleN, windowDays } = lead
  if (interval == null && labelDay == null) return null
  const bimodal = lead.bimodal === true

  let verdict: Verdict
  if (interval == null || sampleN == null) verdict = 'partial'
  else if (sampleN < MIN_SAMPLE) verdict = 'small'
  else if (bimodal) verdict = 'bimodal'
  else verdict = 'confident'

  const need = Math.max(WINDOW_FLOOR, 3 * (interval ?? 0), 3 * (labelDay ?? 0))
  return {
    interval, labelDay, sampleN, windowDays, bimodal,
    low: lead.intervalLow, high: lead.intervalHigh,
    verdict,
    gap: verdict === 'confident' && interval != null && labelDay != null ? interval - labelDay : undefined,
    shortWindow: windowDays != null && windowDays < need,
  }
}

const range = (a: Analysis) => (a.low != null && a.high != null ? `${a.low}–${a.high}` : null)

/** Temat maila do odwiedzajacego. Same liczby — zero tekstu od klienta. */
export function subjectFor(a: Analysis): string {
  const label = a.labelDay != null ? `${a.labelDay} on the label` : null
  if (a.verdict === 'confident') {
    return label
      ? `Your reorder gap: ${label}, ${a.interval} in the data`
      : `Your reorder interval: ${a.interval} days in your data`
  }
  const why = a.verdict === 'bimodal'
    ? 'two different return rhythms'
    : 'too few repeat customers for one number'
  return label ? `Your reorder data: ${label}, ${why}` : `Your reorder data: ${why}`
}

/** Krotka metka do tematu i naglowka maila wlasciciela. */
export function ownerTag(a: Analysis): string {
  const parts: string[] = []
  if (a.labelDay != null) parts.push(`label ${a.labelDay}`)
  if (a.verdict === 'confident') parts.push(`data ${a.interval}`)
  else if (range(a)) parts.push(`data ${range(a)}`)
  if (a.sampleN != null) parts.push(`n=${a.sampleN}`)
  if (a.verdict === 'small') parts.push('small sample')
  if (a.verdict === 'bimodal') parts.push('two peaks')
  if (a.shortWindow) parts.push('short window')
  return parts.join(' · ')
}

/** Zdania wspolne dla ekranu i maila. Jedno miejsce, jedno brzmienie. */
export const WORDING = {
  // n = "settled gaps" z ekranu /tool — tak silnik mierzy probe dla mediany.
  small: (n: number) =>
    `The median rests on ${n} settled ${n === 1 ? 'gap' : 'gaps'} between orders. ` +
    `Below ${MIN_SAMPLE}, a single number would look more certain than it is.`,
  bimodal: (n?: number) =>
    `${n != null ? `Across ${n} settled gaps, the` : 'The'} gaps between orders ` +
    'cluster around two different points, so a single median would describe neither group.',
  partial: 'The tool did not get far enough to measure the gap between orders, so there is no number for it here.',
  range: (lo: number, hi: number) => `The middle half of the gaps fall between day ${lo} and day ${hi}.`,
  noRange: 'So I am not giving you one number.',
  shortWindow: (d: number) => `Your file covers ${d} days — gaps longer than that can't show up yet.`,
  gap: (g: number) =>
    g > 0 ? `${g} days after the label says the pack runs out`
      : g < 0 ? `${-g} days before the label says the pack runs out`
        : 'on the day the label says the pack runs out',
  source: 'These numbers were calculated in your browser, from your file. Only the numbers reached me — not the file.',
}
