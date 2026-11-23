/* Model narzedzia /lab/reminder — czyste funkcje, bez Reacta.
   Test: node scripts/reminder-model.test.mjs

   Zasada: wynik liczy sie WYLACZNIE z liczb podanych w argumentach (pola odwiedzajacego).
   Dzien przypomnienia = dni opakowania − dni dostawy − dni na decyzje, minimum 1
   (tooLate, gdy surowy wynik < 1: kolejne opakowanie musi wyjsc juz pierwszego dnia).
   Dla przypomnienia wyslanego dnia `send`: nowe opakowanie przychodzi dnia send + decide + delivery;
   ostatni dzien starego = packDays. */

export type ReminderInput = {
  pack: number // ile dni starcza jedno opakowanie
  delivery: number // dni od zamowienia do drzwi
  decide: number // dni, ktore klient potrzebuje na zamowienie po przypomnieniu
}

export type ReminderField = 'pack' | 'delivery' | 'decide'

export type ReminderResult = {
  ok: boolean
  missing: ReminderField[]
  day: number // dzien opakowania, w ktorym wyslac przypomnienie (>= 1)
  tooLate: boolean // dostawa + decyzja >= dlugosc opakowania
}

export type SendOutcome = {
  arrives: number // dzien (liczac od poczatku opakowania), w ktorym przychodzi nowe opakowanie
  without: number // dni bez produktu
  left: number // dni zapasu, gdy przychodzi nowe opakowanie
}

const whole = (v: number | undefined): v is number => typeof v === 'number' && Number.isInteger(v) && v > 0

export function reminderDay(i: ReminderInput): ReminderResult {
  const missing: ReminderField[] = []
  if (!whole(i.pack)) missing.push('pack')
  if (!whole(i.delivery)) missing.push('delivery')
  if (!whole(i.decide)) missing.push('decide')
  if (missing.length) return { ok: false, missing, day: 0, tooLate: false }
  const raw = i.pack - i.delivery - i.decide
  return { ok: true, missing, day: Math.max(1, raw), tooLate: raw < 1 }
}

/** Co sie dzieje, gdy przypomnienie wychodzi dnia `send`. */
export function sendOn(send: number, i: ReminderInput): SendOutcome {
  const arrives = send + i.decide + i.delivery
  return { arrives, without: Math.max(0, arrives - i.pack), left: Math.max(0, i.pack - arrives) }
}
