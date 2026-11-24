#!/usr/bin/env node
import chromiumExeMod from './chromium-exe.cjs'; const { chromiumExe } = chromiumExeMod
// Pomiar CLS jak u prawdziwego odwiedzajacego (R4 p7, lekcja R14). Strony agencji pod navigator.webdriver zostaja
// w ukladzie statycznym — pomiar bez nadpisania tej flagi widzi inna strone (tak przeszlo 0,17 na /work/genactiv#enquiry).
// Uzycie: PW_CHROMIUM=... node scripts/cls-check.mjs <url> [szer=390] [wys=844] [zgoda=0|1] [opoznienie_fontow_ms=0] [prog=0.05]
// Kod wyjscia 1, gdy CLS > prog. Tylko localhost / podglad — nigdy produkcja.
import { chromium } from 'playwright'

const [, , url, w = '390', h = '844', consent = '0', delay = '0', limit = '0.05'] = process.argv
if (!url || /oleksiakconsulting\.com/.test(url)) {
  console.error('podaj URL localhost/podgladu (nie produkcja)')
  process.exit(2)
}
const exe = chromiumExe()
const b = await chromium.launch(exe ? { executablePath: exe } : {})
const ctx = await b.newContext({ viewport: { width: +w, height: +h } })
await ctx.addInitScript((c) => {
  Object.defineProperty(navigator, 'webdriver', { get: () => false })
  if (c === '1') localStorage.setItem('cookie-consent', 'accepted')
  window.__cls = 0
  window.__src = []
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) {
      if (e.hadRecentInput) continue
      window.__cls += e.value
      window.__src.push([+e.value.toFixed(3), Math.round(e.startTime), ...(e.sources || []).slice(0, 2).map((s) => s.node && (s.node.id || s.node.className || s.node.nodeName))])
    }
  }).observe({ type: 'layout-shift', buffered: true })
}, consent)
if (+delay) await ctx.route(/\.woff2?(\?|$)/, async (r) => { await new Promise((s) => setTimeout(s, +delay)); await r.continue() })
const p = await ctx.newPage()
await p.goto(url, { waitUntil: 'load' })
await p.waitForTimeout(+delay + 2500)
const cls = await p.evaluate(() => window.__cls)
const src = await p.evaluate(() => window.__src)
await b.close()
const ok = cls <= +limit
console.log(`${ok ? 'PASS' : 'FAIL'} CLS ${cls.toFixed(4)} ${url} ${w}x${h} zgoda=${consent} fonty+${delay}ms ${JSON.stringify(src).slice(0, 300)}`)
process.exit(ok ? 0 : 1)
