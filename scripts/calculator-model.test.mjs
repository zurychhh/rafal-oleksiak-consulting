#!/usr/bin/env node
/* Test wzorow kalkulatora /calculator (v2). Liczby ponizej sa wymyslone wylacznie do
   sprawdzenia arytmetyki — nie sa trescia strony.
   Uruchomienie: node scripts/calculator-model.test.mjs  (Node 22.18+) */
import assert from 'node:assert/strict'
import { gapValue, orderDays, targetRange, parseNum } from '../app/calculator/model.ts'

const near = (a, b, eps = 0.5) => assert.ok(Math.abs(a - b) <= eps, `${a} != ${b}`)

// skrocenie odstepu: 365/45 − 365/60 zamowien wiecej na klienta
let r = gapValue({ customers: 1000, aov: 100, gapNow: 60, gapTarget: 45 })
assert.equal(r.ok, true)
near(r.ordersNow, 6.0833, 0.001)
near(r.ordersTarget, 8.1111, 0.001)
near(r.extraOrders, 2.0278, 0.001)
near(r.extraRevenue, 202778)
// wynik = dodatkowe zamowienia × wartosc × klienci (to zdanie stoi pod liczba na stronie)
near(r.extraRevenue, r.extraOrders * 100 * 1000, 1e-6)

// stan przykladowy strony
r = gapValue({ customers: 4000, aov: 120, gapNow: 58, gapTarget: 50 })
near(r.extraRevenue, 4000 * 120 * (365 / 50 - 365 / 58), 1e-6)

// puste i zerowe pola: brak wyniku, nigdy dzielenie przez zero
r = gapValue({ customers: 0, aov: NaN, gapNow: 0, gapTarget: -3 })
assert.equal(r.ok, false)
assert.deepEqual(r.missing, ['customers', 'aov', 'gapNow', 'gapTarget'])
assert.equal(r.extraRevenue, 0)
r = gapValue({ customers: Infinity, aov: 10, gapNow: 30, gapTarget: 20 })
assert.equal(r.ok, false)

// docelowy rowny albo dluzszy niz obecny: zero, nie minus
r = gapValue({ customers: 10, aov: 10, gapNow: 40, gapTarget: 40 })
assert.equal(r.extraRevenue, 0)
r = gapValue({ customers: 10, aov: 10, gapNow: 40, gapTarget: 50 })
assert.equal(r.extraRevenue, 0)
assert.equal(r.extraOrders, 0)

// os zamowien: ponowne zamowienia w dniach T, 2T … ≤ 365
assert.deepEqual(orderDays(100), [100, 200, 300])
assert.deepEqual(orderDays(365), [365])
assert.deepEqual(orderDays(400), [])
assert.deepEqual(orderDays(0), [])
assert.equal(orderDays(58).length, 6)
assert.equal(orderDays(50).length, 7)
assert.equal(orderDays(1).length, 60)

// zakres suwaka
assert.deepEqual(targetRange(58), { min: 29, max: 58 })
assert.deepEqual(targetRange(10), { min: 7, max: 10 })
assert.deepEqual(targetRange(7), { min: 7, max: 7 })
assert.deepEqual(targetRange(3), { min: 3, max: 3 })
assert.deepEqual(targetRange(0), { min: 1, max: 1 })
assert.ok(orderDays(targetRange(365).min).length <= 60)
assert.ok(orderDays(targetRange(7).min).length <= 60)

// pola tekstowe
assert.equal(parseNum('12 500'), 12500)
assert.equal(parseNum('4 000'), 4000)
assert.equal(parseNum('49,90'), 49.9)
assert.equal(parseNum('4,000'), 4000)
assert.equal(parseNum('4.000'), 4000)
assert.equal(parseNum('1,250,000'), 1250000)
assert.equal(parseNum('1,250.5'), 1250.5)
assert.equal(parseNum('1.250,5'), 1250.5)
assert.equal(parseNum('0.125'), 0.125)
assert.equal(parseNum('22.6'), 22.6)
assert.equal(parseNum('-5'), undefined)
assert.equal(parseNum('.'), undefined)
assert.equal(parseNum(''), undefined)
assert.equal(parseNum('abc'), undefined)
assert.equal(parseNum('1e9'), undefined)

console.log('calculator-model: OK')
