#!/usr/bin/env node
import chromiumExeMod from './chromium-exe.cjs'; const { chromiumExe } = chromiumExeMod
// R4 p11 A1: rozbicie dlugich klatek (LoAF > 50 ms) na faze (kolko / interakcja), pozycje przewiniecia,
// czas skryptow vs styl+uklad vs render. Ten sam przebieg co scroll-perf.mjs (kolko 120 px co 50 ms).
// Uzycie: node scripts/loaf-detail.mjs <url> [szer=1440] [wys=900] [cpu=4]   (tylko localhost)
import { chromium } from 'playwright'
const [, , url, w = '1440', h = '900', cpu = '4'] = process.argv
if (!url || !/^http:\/\/(localhost|127\.0\.0\.1)/.test(url)) { console.error('tylko localhost'); process.exit(2) }
const exe = chromiumExe()
const b = await chromium.launch(exe ? { executablePath: exe } : {})
const ctx = await b.newContext({ viewport: { width: +w, height: +h }, hasTouch: false })
await ctx.addInitScript(`window.__NOMO=${process.env.NOMO === '1'}`)
// OLDKNOB=1: galka znow na `left` (stan sprzed R4 p11 A2) — porownanie A/B na tym samym buildzie
if (process.env.OLDKNOB === '1') await ctx.addInitScript(() => document.addEventListener('DOMContentLoaded', () => { const st = document.createElement('style'); st.textContent = '.nk-track{container-type:normal!important}.nk-knob{left:calc(var(--d) / 30 * 100%)!important;transform:none!important;transition:left .12s linear!important}'; document.head.appendChild(st) }))
await ctx.addInitScript(() => {
  Object.defineProperty(navigator, 'webdriver', { get: () => false })
  window.__phase = 'load'
  // NOMO=1: obserwator mutacji na .nk-scene wylaczony (pomiar „przed” bez przebudowy)
  if (window.__NOMO) {
    const o = MutationObserver.prototype.observe
    MutationObserver.prototype.observe = function (t, opt) { if (t && t.classList && t.classList.contains('nk-scene')) return; return o.call(this, t, opt) }
  }
  window.__l = []
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) {
      if (e.duration <= 50) continue
      const scene = document.querySelector('.nk-scene')
      const r = scene && scene.getBoundingClientRect()
      window.__l.push({
        ph: window.__phase, y: Math.round(scrollY), pin: !!r && r.top <= 1 && r.bottom >= innerHeight - 1,
        act: scene ? scene.getAttribute('data-act') : null,
        d: Math.round(e.duration), b: Math.round(e.blockingDuration || 0),
        work: Math.round((e.renderStart || e.startTime) - e.startTime),
        render: Math.round((e.styleAndLayoutStart || 0) - (e.renderStart || 0)),
        sl: Math.round(e.startTime + e.duration - (e.styleAndLayoutStart || e.startTime)),
        s: (e.scripts || []).map((s) => `${s.invoker}|${s.sourceFunctionName}@${(s.sourceURL||'').split('/').pop()}:${s.sourceCharPosition}|${Math.round(s.duration)}ms fl${Math.round(s.forcedStyleAndLayoutDuration || 0)}`),
      })
    }
  }).observe({ type: 'long-animation-frame', buffered: false })
})
const p = await ctx.newPage()
const cdp = await ctx.newCDPSession(p)
await p.goto(url, { waitUntil: 'load' })
await p.waitForTimeout(1500)
await cdp.send('Emulation.setCPUThrottlingRate', { rate: +cpu })
await p.evaluate(() => { window.__l.length = 0; window.__phase = 'wheel' })
await p.mouse.move(+w / 2, +h / 2)
const total = await p.evaluate(() => document.documentElement.scrollHeight)
for (let i = 0; i < Math.ceil(total / 120); i++) { await p.mouse.wheel(0, 120); await p.waitForTimeout(50) }
await p.waitForTimeout(400)
await p.evaluate(() => { window.__phase = 'interact' })
for (const sel of ['.nk-stepbtn', '.nk-scratch, .nk-card canvas, canvas', 'input, [role="slider"], .nk-link']) {
  try {
    const loc = p.locator(sel).first()
    if (await loc.count()) {
      await loc.scrollIntoViewIfNeeded({ timeout: 1500 }).catch(() => {})
      const bb = await loc.boundingBox()
      if (bb) {
        await p.evaluate((s) => { window.__phase = 'interact:' + s }, sel.split(',')[0])
        await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2)
        await p.mouse.down()
        await p.mouse.move(bb.x + bb.width / 2 + 40, bb.y + bb.height / 2 + 10, { steps: 6 })
        await p.mouse.up()
        await p.waitForTimeout(500)
      }
    }
  } catch {}
}
const L = await p.evaluate(() => window.__l)
await b.close()
for (const e of L) console.log(JSON.stringify(e))
console.log(`klatki>50ms: ${L.length} (kolko ${L.filter((e) => e.ph === 'wheel').length}), najdluzsza ${L.reduce((a, e) => Math.max(a, e.d), 0)} ms`)
