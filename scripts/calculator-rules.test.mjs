#!/usr/bin/env node
// Zasady tekstu /calculator na warstwie wyrenderowanej (R4 p14 B2, resztka R3-3): dla 1 klienta / 1 zamowienia
// liczba pojedyncza — zadnego "1 orders", "1 customers", "1 reorders" w tekscie widocznym, aria-label,
// aria-valuetext ani w regionie aria-live.
// Uzycie: node scripts/calculator-rules.test.mjs --url http://localhost:3000   (tylko localhost; kod 1 przy bledzie)
// Scenariusze (liczby wymyslone, tylko do testu):
//   A: 1 klient, wartosc 120, odstep 28, cel 26 -> +1 zamowienie na klienta (365/26 - 365/28 = 1,003 -> "1")
//   B: 1 klient, wartosc 120, odstep 200 -> jedno zamowienie dzis na osi roku (aria-label osi)
import chromiumExeMod from './chromium-exe.cjs'; const { chromiumExe } = chromiumExeMod
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { chromium } = require('playwright')

const i = process.argv.indexOf('--url')
const base = (i > 0 ? process.argv[i + 1] : 'http://localhost:3000').replace(/\/$/, '')
const host = new URL(base).hostname
if (!['localhost', '127.0.0.1'].includes(host)) { console.error('tylko localhost / 127.0.0.1'); process.exit(2) }

const BAD = /(^|[^\d.,])1 (orders|customers|reorders|days)\b/g
const exe = chromiumExe()
const b = await chromium.launch(exe ? { executablePath: exe } : {})
const fails = []

async function texts(p) {
  return p.evaluate(() => {
    const root = document.querySelector('section.gc') || document.body
    const out = [['tekst', root.innerText]]
    for (const el of root.querySelectorAll('[aria-label],[aria-valuetext]')) {
      if (el.getAttribute('aria-label')) out.push(['aria-label', el.getAttribute('aria-label')])
      if (el.getAttribute('aria-valuetext')) out.push(['aria-valuetext', el.getAttribute('aria-valuetext')])
    }
    const live = root.querySelector('[aria-live]')
    if (live) out.push(['aria-live', live.textContent])
    return out
  })
}

async function scenario(name, w, h, fields, slider) {
  const p = await b.newPage({ viewport: { width: w, height: h }, reducedMotion: 'reduce' })
  await p.goto(base + '/calculator', { waitUntil: 'networkidle' })
  await p.fill('#gc-c', fields.c)
  await p.fill('#gc-a', fields.a)
  await p.fill('#gc-g', fields.g)
  if (slider) {
    await p.focus('#gc-t')
    await p.keyboard.press('End')
    for (let k = 0; k < slider.left; k++) await p.keyboard.press('ArrowLeft')
  }
  await p.waitForTimeout(1200) // aria-live odswieza sie po 700 ms
  const tv = await p.$eval('#gc-t', (el) => el.value)
  if (slider && Number(tv) !== slider.expect) fails.push(`${name} ${w}: suwak na ${tv}, oczekiwano ${slider.expect}`)
  const why = await p.$eval('.gc-why', (el) => el.textContent.trim())
  console.log(`${name} ${w}: suwak=${tv} | ${why}`)
  for (const [where, t] of await texts(p)) {
    for (const m of (t || '').matchAll(BAD)) {
      const at = m.index + m[1].length
      fails.push(`${name} ${w} [${where}]: "${t.slice(Math.max(0, at - 30), at + 30).replace(/\s+/g, ' ')}"`)
    }
  }
  await p.close()
}

for (const [w, h] of [[390, 844], [1440, 900]]) {
  await scenario('A (+1 zamowienie, 1 klient)', w, h, { c: '1', a: '120', g: '28' }, { left: 2, expect: 26 })
  await scenario('B (1 zamowienie dzis na osi)', w, h, { c: '1', a: '120', g: '200' }, null)
}
await b.close()

if (fails.length) {
  for (const f of fails) console.log('FAIL ' + f)
  console.log(`calculator-rules: FAIL (${fails.length})`)
  process.exit(1)
}
console.log('calculator-rules: PASS')
