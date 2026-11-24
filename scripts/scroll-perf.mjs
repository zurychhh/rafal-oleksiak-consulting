#!/usr/bin/env node
// Plynnosc scen sterowanych przewijaniem (R4 p8): dlugie klatki (LoAF) i najdluzsza interakcja (proxy INP) przy CPU x4.
// Uzycie: node scripts/scroll-perf.mjs <url> [szer=390] [wys=844] [cpu=4]   (PW_CHROMIUM opcjonalnie)
// navigator.webdriver nadpisany (inaczej strona daje uklad statyczny — R14). Tylko localhost / podglad.
// Kod wyjscia 1, gdy najdluzsza interakcja > 200 ms albo klatka > 200 ms.
import { chromium } from 'playwright'

const [, , url, w = '390', h = '844', cpu = '4'] = process.argv
if (!url || /oleksiakconsulting\.com/.test(url)) {
  console.error('podaj URL localhost/podgladu (nie produkcja)')
  process.exit(2)
}
const exe = process.env.PW_CHROMIUM || undefined
const b = await chromium.launch(exe ? { executablePath: exe } : {})
const ctx = await b.newContext({ viewport: { width: +w, height: +h }, hasTouch: false })
await ctx.addInitScript(() => {
  Object.defineProperty(navigator, 'webdriver', { get: () => false })
  window.__perf = { loaf: [], ev: [] }
  try {
    new PerformanceObserver((l) => {
      for (const e of l.getEntries())
        window.__perf.loaf.push({
          t: Math.round(e.startTime), d: Math.round(e.duration), b: Math.round(e.blockingDuration || 0),
          s: (e.scripts || []).map((s) => ({ u: (s.sourceURL || '').split('/').slice(-2).join('/'), i: s.invoker || '', f: s.sourceFunctionName || '', d: Math.round(s.duration), fl: Math.round(s.forcedStyleAndLayoutDuration || 0) })),
        })
    }).observe({ type: 'long-animation-frame', buffered: true })
  } catch {}
  try {
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) window.__perf.ev.push({ n: e.name, d: Math.round(e.duration) })
    }).observe({ type: 'event', durationThreshold: 16, buffered: true })
  } catch {}
})
const p = await ctx.newPage()
const cdp = await ctx.newCDPSession(p)
await p.goto(url, { waitUntil: 'load' })
await p.waitForTimeout(1500)
await cdp.send('Emulation.setCPUThrottlingRate', { rate: +cpu })
const scene = await p.evaluate(() => {
  const s = document.querySelector('.nk-scene, [data-scene], [class*="scene"]')
  const sc = document.querySelector('.nk-scene.is-scroll')
  const wrap = sc ? sc.parentElement : null
  return { found: !!s, scroll: !!sc, track: wrap ? Math.round(wrap.getBoundingClientRect().height) : 0, cls: s ? String(s.className).slice(0, 60) : '' }
})
await p.evaluate(() => { window.__perf.loaf.length = 0; window.__perf.ev.length = 0 })
await p.mouse.move(+w / 2, +h / 2)
const total = await p.evaluate(() => document.documentElement.scrollHeight)
const steps = Math.ceil(total / 120)
for (let i = 0; i < steps; i++) {
  await p.mouse.wheel(0, 120)
  await p.waitForTimeout(50)
}
await p.waitForTimeout(400)
// 3 interakcje w scenach z kontrolkami: wracamy do toru sceny i klikamy/przeciagamy kontrolki.
const inter = []
for (const sel of ['.nk-stepbtn', '.nk-scratch, .nk-card canvas, canvas', 'input, [role="slider"], .nk-link']) {
  try {
    const loc = p.locator(sel).first()
    if (await loc.count()) {
      await loc.scrollIntoViewIfNeeded({ timeout: 1500 }).catch(() => {})
      const bb = await loc.boundingBox()
      if (bb) {
        await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2)
        await p.mouse.down()
        await p.mouse.move(bb.x + bb.width / 2 + 40, bb.y + bb.height / 2 + 10, { steps: 6 })
        await p.mouse.up()
        inter.push(sel.split(',')[0])
        await p.waitForTimeout(500)
      }
    }
  } catch {}
}
const r = await p.evaluate(() => window.__perf)
await b.close()
const L = r.loaf
const sum = L.reduce((a, e) => a + e.b, 0)
const max = L.reduce((a, e) => Math.max(a, e.d), 0)
const maxEv = r.ev.reduce((a, e) => Math.max(a, e.d), 0)
const agg = {}
for (const e of L) for (const s of e.s) { const k = `${s.u} ${s.i} ${s.f}`.trim(); agg[k] = agg[k] || { d: 0, fl: 0, n: 0 }; agg[k].d += s.d; agg[k].fl += s.fl; agg[k].n++ }
const top = Object.entries(agg).sort((a, b) => b[1].d - a[1].d).slice(0, 3)
console.log(`${url} ${w}x${h} cpu=${cpu}x tryb sceny: ${scene.scroll ? 'przewijana (.nk-scene.is-scroll), tor ' + scene.track + ' px' : scene.found ? 'statyczna (' + scene.cls + ')' : 'brak sceny'}; strona ${total} px, ${steps} krokow kolka`)
console.log(`klatki>50ms: ${L.filter((e) => e.d > 50).length}  >100ms: ${L.filter((e) => e.d > 100).length}  najdluzsza: ${max} ms  suma blokady: ${sum} ms  (LoAF ${L.length})`)
console.log(`najdluzsza interakcja: ${maxEv} ms (zdarzen ${r.ev.length}; kontrolki: ${inter.join(' | ') || 'brak'})`)
for (const [k, v] of top) console.log(`  skrypt: ${k} — ${v.d} ms w ${v.n} klatkach, w tym wymuszony uklad ${v.fl} ms`)
process.exit(maxEv > 200 || max > 200 ? 1 : 0)
