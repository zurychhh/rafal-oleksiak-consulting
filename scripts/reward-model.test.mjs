#!/usr/bin/env node
/* Test wzoru narzedzia /lab/reward. Liczby ponizej sa wymyslone wylacznie do sprawdzenia
   arytmetyki — nie sa trescia strony.
   Uruchomienie: node scripts/reward-model.test.mjs  (Node 22.18+) */
import assert from 'node:assert/strict'
import { rewardCeiling, verdict } from '../app/lab/reward/model.ts'

// sufit = marza × dodatkowe zamowienia
let r = rewardCeiling({ aov: 100, margin: 40, extraOrders: 3 })
assert.equal(r.ok, true)
assert.equal(r.ceiling, 120)
assert.equal(r.extraSales, 300)

// ulamki
r = rewardCeiling({ aov: 49.9, margin: 18.5, extraOrders: 1.5 })
assert.ok(Math.abs(r.ceiling - 27.75) < 1e-9)

// stan przykladowy strony
r = rewardCeiling({ aov: 120, margin: 48, extraOrders: 2 })
assert.equal(r.ceiling, 96)

// puste, zerowe, ujemne, nieskonczone: brak wyniku
r = rewardCeiling({ aov: 0, margin: NaN, extraOrders: -1 })
assert.equal(r.ok, false)
assert.deepEqual(r.missing, ['aov', 'margin', 'extraOrders'])
assert.equal(r.ceiling, 0)
r = rewardCeiling({ aov: Infinity, margin: 10, extraOrders: 1 })
assert.equal(r.ok, false)

// marza wyzsza niz zamowienie: blad, nie wynik
r = rewardCeiling({ aov: 50, margin: 60, extraOrders: 2 })
assert.equal(r.ok, false)
assert.equal(r.marginOverAov, true)
// marza rowna zamowieniu: dozwolone
assert.equal(rewardCeiling({ aov: 50, margin: 50, extraOrders: 2 }).ok, true)

// werdykt
assert.deepEqual(verdict(96, 40), { paysOff: true, left: 56 })
assert.deepEqual(verdict(96, 96), { paysOff: true, left: 0 })
assert.deepEqual(verdict(96, 120), { paysOff: false, left: -24 })

console.log('reward-model: OK')
