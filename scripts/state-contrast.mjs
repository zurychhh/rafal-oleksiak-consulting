#!/usr/bin/env node
// spec 51 (R48): kontrast tekstu w KAZDYM stanie interaktywnym, nie tylko w stanie startowym. qa.js mierzy strone po
// zaladowaniu, wiec zakladki kokpitu, chwile finalu i przelaczniki (aria-pressed) poza stanem 1 byly niezmierzone.
// Dla kazdej kontrolki [role=tab] i [aria-pressed] w <main> (max 60): przewin do niej, kliknij, odczekaj, zmierz kontrast
// wszystkich widocznych tekstow w oknie (scripts/contrast-eval.cjs). Rozmiary 390x844 i 1440x900, kolor domyslny i skrajne
// kolory marki (silnik marki przyjmuje dowolny #RRGGBB). Zero sprawdzonych tekstow przy kontrolkach = FAIL „NIETESTOWANE”.
// Uzycie: node scripts/state-contrast.mjs http://localhost:3000 /nawyko [/inne]   (tylko localhost)
// Kontrola pozytywna: STATE_SELFTEST_CSS='<css>' wstrzykuje styl — wynik musi byc FAIL.
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { chromium } = require('playwright')
const { chromiumExe } = require('./chromium-exe.cjs')
const { contrastIn } = require('./contrast-eval.cjs')
const [base, ...routes] = process.argv.slice(2)
if (!base || !/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(base)) { console.error('tylko http://localhost:<port>'); process.exit(2) }
const SIZES = (process.env.STATE_SIZES || '390x844,1440x900').split(',').map((x) => x.split('x').map(Number))
const RUNS = [...SIZES.map(([w, h]) => [w, h, '']), ...(process.env.STATE_COLOURS ?? '#FFE600').split(',').filter(Boolean).map((c) => [1440, 900, c])]
let fail = 0
const b = await chromium.launch({ executablePath: chromiumExe() })
for (const route of routes) for (const [w, h, col] of RUNS) {
  const p = await b.newPage({ viewport: { width: w, height: h }, reducedMotion: 'reduce' })
  // zgoda zapisana z gory: pasek cookies nie przykrywa mierzonych tekstow (jego kontrast mierzy qa.js)
  await p.addInitScript((c) => { try { if (c) localStorage.setItem('oc-brand-v1', JSON.stringify({ name: 'Brandx', colour: c })) } catch {} }, col)
  await p.goto(base + route, { waitUntil: 'networkidle' })
  if (process.env.STATE_SELFTEST_CSS) await p.addStyleTag({ content: process.env.STATE_SELFTEST_CSS })
  const ctl = await p.$$('main [role="tab"], main [aria-pressed]')
  const bad = new Set(); let n = 0, unknown = 0, clicked = 0, viaJs = 0
  for (const c of ctl.slice(0, 60)) {
    if (!(await c.isVisible().catch(() => false))) { await c.scrollIntoViewIfNeeded().catch(() => {}); if (!(await c.isVisible().catch(() => false))) continue }
    const label = ((await c.getAttribute('aria-label')) || (await c.innerText().catch(() => ''))).trim().slice(0, 30)
    try { await c.scrollIntoViewIfNeeded(); await c.click({ timeout: 1500 }); clicked++ } catch { await c.evaluate((el) => el.click()).catch(() => {}); clicked++; viaJs++ }
    await p.waitForTimeout(500)
    const r = await p.evaluate(contrastIn, ['main', true])
    n += r.n; unknown += r.unknown; r.bad.forEach((x) => bad.add(`po kliku "${label}": ${x}`))
  }
  if (clicked && !n) bad.add('NIETESTOWANE (0 tekstow po klikach)')
  const tag = `${route} ${w}x${h}${col ? ' ' + col : ''}`
  console.log(`${bad.size ? 'FAIL' : 'PASS'} state-contrast ${tag} kontrolki=${clicked}/${ctl.length} (zasloniete, klik skryptem=${viaJs}) teksty=${n} nieznane-tlo(INFO)=${unknown} problemy=${bad.size}`)
  ;[...bad].slice(0, 15).forEach((x) => console.log('   ' + x)); if (bad.size) fail++
  await p.close()
}
await b.close(); console.log(fail ? `STATE-CONTRAST FAIL ${fail}` : 'STATE-CONTRAST PASS'); process.exit(fail ? 1 : 0)
