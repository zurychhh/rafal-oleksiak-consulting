#!/usr/bin/env node
/* Test wzoru narzedzia /lab/reminder. Liczby ponizej sa wymyslone wylacznie do sprawdzenia
   arytmetyki — nie sa trescia strony (poza przykladem 30/3/2 oznaczonym na stronie).
   Uruchomienie: node scripts/reminder-model.test.mjs  (Node 22.18+) */
import assert from 'node:assert/strict'
import { reminderDay, sendOn } from '../app/lab/reminder/model.ts'

const ex = { pack: 30, delivery: 3, decide: 2 }

// stan przykladowy strony: 30 − 3 − 2 = dzien 25
assert.deepEqual(reminderDay(ex), { ok: true, missing: [], day: 25, tooLate: false })

// suwak: dzien 25 → dostawa dnia 30 → 0 dni bez produktu
assert.deepEqual(sendOn(25, ex), { arrives: 30, without: 0, left: 0 })
// dzien 26 → 1 dzien bez produktu
assert.deepEqual(sendOn(26, ex), { arrives: 31, without: 1, left: 0 })
// dzien 20 → 5 dni zapasu
assert.deepEqual(sendOn(20, ex), { arrives: 25, without: 0, left: 5 })
// ostatni dzien opakowania → dni bez = dostawa + decyzja
assert.equal(sendOn(30, ex).without, 5)

// kazde pole zmienia wynik
assert.equal(reminderDay({ ...ex, pack: 60 }).day, 55)
assert.equal(reminderDay({ ...ex, delivery: 7 }).day, 21)
assert.equal(reminderDay({ ...ex, decide: 5 }).day, 22)

// dostawa + decyzja >= opakowanie → dzien 1 i tooLate
let r = reminderDay({ pack: 5, delivery: 3, decide: 2 })
assert.deepEqual(r, { ok: true, missing: [], day: 1, tooLate: true })
r = reminderDay({ pack: 10, delivery: 20, decide: 4 })
assert.equal(r.day, 1)
assert.equal(r.tooLate, true)
// granica: surowy wynik 1 to jeszcze nie „za pozno”
r = reminderDay({ pack: 6, delivery: 3, decide: 2 })
assert.equal(r.day, 1)
assert.equal(r.tooLate, false)

// puste, zerowe, ujemne, ulamkowe, nieliczbowe, nieskonczone → brak wyniku
r = reminderDay({ pack: NaN, delivery: 0, decide: -1 })
assert.equal(r.ok, false)
assert.deepEqual(r.missing, ['pack', 'delivery', 'decide'])
assert.equal(reminderDay({ ...ex, pack: 30.5 }).ok, false)
assert.equal(reminderDay({ ...ex, delivery: Infinity }).ok, false)
assert.equal(reminderDay({ ...ex, decide: Number('abc') }).ok, false)

console.log('reminder-model: OK')
