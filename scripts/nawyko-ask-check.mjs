// Bramka R6'q14-A (Rafal 28.11.2026 10:37): na /nawyko formularz zapytania zaraz pod hero, trzy kroki „co dalej”
// i zdanie o formie rozliczenia przy KAZDYM formularzu, zgoda przed przyciskiem w kolejnosci Tab, CTA hero → #ask.
// Test regresji: przez 13 przebiegow formularz byl ~17 ekranow nizej na telefonie i nikt tego nie mierzyl.
// Nic nie wysyla. Tylko localhost. Uzycie: node scripts/nawyko-ask-check.mjs http://localhost:3000
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { chromium } = require('playwright')
const base = process.argv[2] || 'http://localhost:3000'
if (!/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/.test(base)) { console.error('Tylko localhost'); process.exit(2) }
const exe = require('./chromium-exe.cjs').chromiumExe()
const browser = await chromium.launch(exe ? { executablePath: exe } : {})
let fail = 0
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fail++ }
for (const [w, h, maxScreens] of [[390, 844, 3.2], [1440, 900, 2]]) {
  const p = await browser.newPage({ viewport: { width: w, height: h } })
  await p.goto(base + '/nawyko', { waitUntil: 'networkidle' })
  const r = await p.evaluate(() => {
    const ask = document.querySelector('#ask'), hero = document.querySelector('#top')
    const field = document.querySelector('#ask input[name=store]')
    const forms = [...document.querySelectorAll('#ask, #enquiry')].map((s) => ({
      id: s.id,
      steps: s.querySelectorAll('.nk-next-list li').length,
      fee: /setup fee plus a monthly fee/i.test(s.textContent || ''),
      li: /linkedin\.com/.test(s.querySelector('.nk-next-list a')?.getAttribute('href') || ''),
      digits: ((s.querySelector('.nk-next-fee')?.textContent || '').match(/\d/g) || []).length,
    }))
    const order = [...document.querySelectorAll('#ask input, #ask button')].map((e) => e.name || e.type)
    return {
      afterHero: !!ask && hero?.nextElementSibling === ask,
      fieldY: field ? field.getBoundingClientRect().top + scrollY : 1e9,
      vh: innerHeight, forms, order,
      heroCta: document.querySelector('#top a.nk-cta')?.getAttribute('href'),
    }
  })
  ok(r.afterHero, `${w}: sekcja #ask zaraz po hero`)
  ok(r.fieldY / r.vh <= maxScreens, `${w}: pierwsze pole na ${(r.fieldY / r.vh).toFixed(2)} ekranu (<= ${maxScreens})`)
  ok(r.forms.length === 2, `${w}: dwa formularze (#ask, #enquiry)`)
  for (const f of r.forms) {
    ok(f.steps === 3 && f.fee && f.li && f.digits === 0, `${w}: #${f.id} trzy kroki, LinkedIn, rozliczenie bez liczby`)
  }
  ok(r.order.indexOf('contact') < r.order.indexOf('submit'), `${w}: zgoda przed przyciskiem w kolejnosci Tab (${r.order.join(' > ')})`)
  ok(r.heroCta === '#ask', `${w}: CTA hero prowadzi do #ask`)
  await p.close()
}
await browser.close()
console.log(fail ? `nawyko-ask: FAIL (${fail})` : 'nawyko-ask: PASS')
process.exit(fail ? 1 : 0)
