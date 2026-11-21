#!/usr/bin/env node
/* Test wzorow kalkulatora /calculator. Liczby ponizej sa wymyslone wylacznie do
   sprawdzenia arytmetyki (agencja/research/kalkulator-zrodla.md, 3.2) — nie sa
   trescia strony.  Uruchomienie: node scripts/calculator-model.test.mjs  (Node 22.18+) */
import assert from 'node:assert/strict'
import { gapScenario, secondScenario, orderDays, parseNum } from '../app/calculator/model.ts'

const near = (a, b, eps = 0.5) => assert.ok(Math.abs(a - b) <= eps, `${a} != ${b}`)

// A. skrocenie odstepu
let r = gapScenario({ customers: 1000, aov: 100, gapNow: 60, gapTarget: 45, packDays: 30, marginPct: 60 })
assert.equal(r.ok, true)
near(r.revenueNow, 608333)
near(r.revenueTarget, 811111)
near(r.extraRevenue, 202778)
near(r.upliftPct, 33.33, 0.01)
near(r.breakEvenDiscountRevenue, 25, 0.001)
near(r.breakEvenDiscountMargin, 15, 0.001)
near(r.extraMargin, 121667)
near(r.perDay, 202778 / 15)
assert.equal(r.daysWithout, 30)
near(r.ceilingRevenue, 1000 * 100 * 365 * (1 / 30 - 1 / 60))
assert.deepEqual(r.notes, [])

// puste i zerowe pola: brak wyniku, nigdy dzielenie przez zero
r = gapScenario({ customers: 0, aov: NaN, gapNow: 0, gapTarget: -3 })
assert.equal(r.ok, false)
assert.deepEqual(r.missing, ['customers', 'aov', 'gapNow', 'gapTarget'])
assert.equal(r.extraRevenue, 0)

// docelowy dluzszy niz obecny: zero, nie minus
r = gapScenario({ customers: 10, aov: 10, gapNow: 40, gapTarget: 50 })
assert.equal(r.extraRevenue, 0)
assert.equal(r.perDay, 0)
assert.deepEqual(r.notes, ['no-pack'])
assert.equal(r.ceilingRevenue, null)

// brak rezerwy i zamawianie szybciej niz zuzycie
r = gapScenario({ customers: 10, aov: 10, gapNow: 30, gapTarget: 20, packDays: 30 })
assert.deepEqual(r.notes, ['no-slack', 'below-pack'])
assert.equal(r.daysWithout, 0)
assert.equal(r.ceilingRevenue, null)

// rzadziej niz raz w roku
r = gapScenario({ customers: 10, aov: 10, gapNow: 400, gapTarget: 300, packDays: 90 })
assert.ok(r.notes.includes('rare'))

// B. drugi zakup
let s = secondScenario({ newCustomers: 5000, aov: 100, rateNow: 20, rateTarget: 25, marginPct: 50 })
assert.equal(s.extraCustomers, 250)
near(s.extraRevenue, 25000, 0.001)
near(s.extraMargin, 12500, 0.001)
s = secondScenario({ newCustomers: 333, aov: 10, rateNow: 20, rateTarget: 21 })
assert.equal(s.extraCustomers, 3) // 3,33 w dol
near(s.extraRevenue, 33.3, 0.001) // przychod z pelnej wartosci
s = secondScenario({ newCustomers: 100, aov: 10, rateNow: 30, rateTarget: 20 })
assert.equal(s.extraRevenue, 0)
s = secondScenario({ newCustomers: 100, aov: 10, rateNow: 30, rateTarget: 120 })
assert.equal(s.ok, false)

// os zamowien
assert.deepEqual(orderDays(100), [0, 100, 200, 300])
assert.deepEqual(orderDays(365), [0])
assert.deepEqual(orderDays(0), [])
assert.equal(orderDays(1).length, 80)

// pola tekstowe
assert.equal(parseNum('12 500'), 12500)
assert.equal(parseNum('49,90'), 49.9)
assert.equal(parseNum('4,000'), 4000)
assert.equal(parseNum('4.000'), 4000)
assert.equal(parseNum('1,250,000'), 1250000)
assert.equal(parseNum('1,250.5'), 1250.5)
assert.equal(parseNum('1.250,5'), 1250.5)
assert.equal(parseNum('0.125'), 0.125)
assert.equal(parseNum('22.6'), 22.6)
assert.equal(parseNum('.'), undefined)
assert.equal(parseNum(''), undefined)
assert.equal(parseNum('abc'), undefined)
assert.equal(parseNum('1e9'), undefined)

console.log('calculator-model: OK')
