// Bramka brand-propagation (spec 26, R5): odwiedzajacy wpisuje nazwe i wybiera kolor w hero /nawyko →
// 0 × nazwa demo w widocznym tekscie, nazwa w kazdym telefonie i w finale, pasek kazdego telefonu w wybranym kolorze;
// po przeladowaniu i na /work/genactiv ten sam stan (localStorage). Tylko localhost. WebKit: scripts/brand-propagation-webkit.py.
// Uzycie: node scripts/brand-propagation.mjs http://localhost:3000
import { chromium } from 'playwright'
import { readFileSync } from 'fs'
import { createRequire } from 'module'
const { chromiumExe } = createRequire(import.meta.url)('./chromium-exe.cjs')
const base = process.argv[2] || 'http://localhost:3000'
if (!/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/.test(base)) { console.error('localhost only'); process.exit(2) }
const check = readFileSync(new URL('./brand-propagation.check.js', import.meta.url), 'utf8')
const NAME = 'Acme', LABEL = 'Ocean blue', RGB = 'rgb(29, 95, 168)'
const b = await chromium.launch({ executablePath: chromiumExe() })
let fail = 0
for (const [w, h] of [[390, 844], [1440, 900]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } })
  await p.goto(base + '/nawyko', { waitUntil: 'networkidle' })
  await p.fill('.nk-hbrand input[type=text]', NAME)
  await p.locator(`.nk-hbrand input[aria-label="${LABEL}"]`).check({ force: true })
  await p.waitForTimeout(300)
  for (const [label, url] of [['typed', null], ['reload', base + '/nawyko'], ['genactiv', base + '/work/genactiv']]) {
    if (url) { await p.goto(url, { waitUntil: 'networkidle' }); await p.waitForTimeout(600) }
    const r = await p.evaluate(`(${check})(${JSON.stringify(NAME)}, ${JSON.stringify(RGB)})`)
    const ok = r.bad.length === 0
    if (!ok) fail++
    console.log(`BRANDPROP ${w} ${label} ${ok ? 'PASS' : 'FAIL'} phones=${r.bars} fills=${r.fills} demo=${r.demo}${ok ? '' : ' ' + JSON.stringify(r.bad.slice(0, 6))}`)
  }
  await p.close()
}
await b.close()
process.exit(fail ? 1 : 0)
