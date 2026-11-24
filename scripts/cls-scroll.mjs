#!/usr/bin/env node
import chromiumExeMod from './chromium-exe.cjs'; const { chromiumExe } = chromiumExeMod
// R4 p11 A2: CLS przy przewijaniu kolkiem z przypisaniem zrodel (element, prostokat przed/po, pozycja przewiniecia).
// navigator.webdriver nadpisany jak w cls-check.mjs (lekcja R14). Tylko localhost.
// Uzycie: node scripts/cls-scroll.mjs <url> [szer=390] [wys=844] [krok=120] [przerwa_ms=50]
import { chromium } from 'playwright'
const [, , url, w = '390', h = '844', step = '120', gap = '50'] = process.argv
if (!url || !/^http:\/\/(localhost|127\.0\.0\.1)/.test(url)) { console.error('tylko localhost'); process.exit(2) }
const exe = chromiumExe()
const b = await chromium.launch(exe ? { executablePath: exe } : {})
const ctx = await b.newContext({ viewport: { width: +w, height: +h } })
await ctx.addInitScript(() => {
  Object.defineProperty(navigator, 'webdriver', { get: () => false })
  window.__ls = []
  const path = (n) => {
    const out = []
    for (let e = n; e && e.nodeType === 1 && out.length < 4; e = e.parentElement)
      out.unshift(e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : ''))
    return n && n.nodeType === 3 ? out.join(' > ') + ' > #text' : out.join(' > ')
  }
  const rc = (r) => r && [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)].join(',')
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) {
      window.__ls.push({ v: +e.value.toFixed(5), in: e.hadRecentInput, t: Math.round(e.startTime), y: Math.round(scrollY),
        src: (e.sources || []).map((s) => ({ n: s.node ? path(s.node.nodeType === 3 ? s.node.parentElement : s.node) + (s.node.nodeType === 3 ? ' (#text)' : '') : '(usuniety)', from: rc(s.previousRect), to: rc(s.currentRect) })) })
    }
  }).observe({ type: 'layout-shift', buffered: true })
})
const p = await ctx.newPage()
await p.goto(url, { waitUntil: 'load' })
await p.waitForTimeout(2500)
const atLoad = await p.evaluate(() => window.__ls.length)
await p.mouse.move(+w / 2, +h / 2)
const total = await p.evaluate(() => document.documentElement.scrollHeight)
for (let i = 0; i < Math.ceil(total / +step); i++) { await p.mouse.wheel(0, +step); await p.waitForTimeout(+gap) }
await p.waitForTimeout(800)
const L = await p.evaluate(() => window.__ls)
await b.close()
const cnt = L.filter((e) => !e.in)
const sum = (a) => a.reduce((s, e) => s + e.v, 0)
console.log(`${url} ${w}x${h}: CLS (bez wejscia) ${sum(cnt).toFixed(4)} — przy ladowaniu ${sum(cnt.slice(0, atLoad)).toFixed(4)}, przy przewijaniu ${sum(cnt.slice(atLoad)).toFixed(4)}; wpisow ${L.length}`)
for (const e of L) console.log(JSON.stringify(e))
