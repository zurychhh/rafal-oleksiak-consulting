#!/usr/bin/env node
/* Test wzoru narzedzia /lab/payback. Liczby ponizej sa wymyslone wylacznie do sprawdzenia
   arytmetyki — nie sa trescia strony.
   Uruchomienie: node scripts/payback-model.test.mjs  (Node 22.18+) */
import assert from 'node:assert/strict'
import { payback, balanceAfter } from '../app/lab/payback/model.ts'

// stan przykladowy strony: 90 / 36 = 2,5 → zamowienie 3, dzien 2 × 45 = 90
let r = payback({ cac: 90, margin: 36, gap: 45 })
assert.deepEqual(r, { ok: true, missing: [], order: 3, day: 90 })

// dokladny podzial nie przeskakuje na kolejne zamowienie
r = payback({ cac: 120, margin: 40, gap: 30 })
assert.equal(r.order, 3)
assert.equal(r.day, 60)
r = payback({ cac: 0.3, margin: 0.1, gap: 10 })
assert.equal(r.order, 3)

// koszt nizszy niz marza: zwraca sie pierwsze zamowienie, dzien 0
r = payback({ cac: 10, margin: 36, gap: 45 })
assert.equal(r.order, 1)
assert.equal(r.day, 0)

// ulamkowy odstep
r = payback({ cac: 100, margin: 30, gap: 33.5 })
assert.equal(r.order, 4)
assert.equal(r.day, 101) // 3 × 33,5 = 100,5 → 101

// kazde pole zmienia wynik
assert.notEqual(payback({ cac: 200, margin: 36, gap: 45 }).order, 3)
assert.notEqual(payback({ cac: 90, margin: 20, gap: 45 }).order, 3)
assert.notEqual(payback({ cac: 90, margin: 36, gap: 30 }).day, 90)

// puste, zerowe, ujemne, nieskonczone
r = payback({ cac: 0, margin: NaN, gap: -1 })
assert.equal(r.ok, false)
assert.deepEqual(r.missing, ['cac', 'margin', 'gap'])
assert.equal(payback({ cac: Infinity, margin: 1, gap: 1 }).ok, false)

// bilans klienta
assert.equal(balanceAfter(1, 90, 36), -54)
assert.equal(balanceAfter(3, 90, 36), 18)

console.log('payback-model: OK')
