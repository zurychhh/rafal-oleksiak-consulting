#!/usr/bin/env node
import chromiumExeMod from './chromium-exe.cjs'; const { chromiumExe } = chromiumExeMod
// R39 (26.11 p9): /privacy dziedziczyła `html{scroll-behavior:smooth}` z critical.css — po Tab fokus stał już na linku,
// a strona dopiero płynnie przewijała go spod paska cookies (focus-obscured 21 trafień). Każda trasa ma mieć
// wyliczone scroll-behavior = auto na <html> (przewijanie do fokusu natychmiastowe; WCAG 2.4.11, technika C43).
// Użycie: node scripts/scroll-behavior-check.mjs http://localhost:3000 /trasa ...   Tylko localhost. Kod 1 = FAIL.
// Ostatnia linia: SCROLLBEHAVIOR PASS|FAIL trasy=<n>
import { chromium } from 'playwright'
const [base, ...routes] = process.argv.slice(2)
if (!base || !/^http:\/\/(localhost|127\.0\.0\.1)[:/]/.test(base) || !routes.length) { console.error('podaj URL localhost i trasy'); process.exit(2) }
const exe = chromiumExe()
const b = await chromium.launch(exe ? { executablePath: exe } : {})
let bad = 0, n = 0
for (const r of routes) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
  const res = await p.goto(base + r, { waitUntil: 'networkidle' })
  if (!res || res.status() >= 400) { console.log(r, 'status', res && res.status(), 'pominieta'); await p.close(); continue }
  const v = await p.evaluate(() => [getComputedStyle(document.documentElement).scrollBehavior, getComputedStyle(document.body).scrollBehavior])
  n++
  const ok = v[0] === 'auto' && v[1] === 'auto'
  if (!ok) bad++
  console.log(r, 'html=' + v[0], 'body=' + v[1], ok ? 'ok' : 'FAIL')
  await p.close()
}
await b.close()
if (!n) { console.log('SCROLLBEHAVIOR FAIL NIETESTOWANE trasy=0'); process.exit(1) }
console.log(`SCROLLBEHAVIOR ${bad ? 'FAIL' : 'PASS'} trasy=${n}`)
process.exit(bad ? 1 : 0)
