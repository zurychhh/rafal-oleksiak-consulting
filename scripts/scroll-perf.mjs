#!/usr/bin/env node
import chromiumExeMod from './chromium-exe.cjs'; const { chromiumExe } = chromiumExeMod
// Plynnosc scen sterowanych przewijaniem (R4 p8): dlugie klatki (LoAF) i najdluzsza interakcja (proxy INP) przy CPU x4.
// Uzycie: node scripts/scroll-perf.mjs <url> [szer=390] [wys=844] [cpu=4] [--runs N]   (PW_CHROMIUM opcjonalnie)
// navigator.webdriver nadpisany (inaczej strona daje uklad statyczny — R14). Tylko localhost / podglad.
//
// R4 p13 B1: jeden przebieg dawal FAIL 119-181 ms na niezmienionym kodzie (szum wspoldzielonej maszyny 2 rdzenie).
// Teraz: rozgrzewka (pelny przebieg nieliczony: zimny start przegladarki, kompilacja JS, cache HTTP) + N przebiegow
// (domyslnie 3), kazdy w swiezym kontekscie; werdykt z MEDIANY najdluzszej klatki i MEDIANY najdluzszej interakcji.
// Metoda za dokumentacja Lighthouse o zmiennosci pomiarow laboratoryjnych: „use aggregate values like the median ...
// instead of single test results”, „The median ... of 5 runs is twice as stable as 1 run”, zrodlo zmiennosci m.in.
// „client resource contention” — https://github.com/GoogleChrome/lighthouse/blob/main/docs/variability.md
// (tez: https://web.dev/articles/lab-and-field-data-differences). LoAF: https://developer.chrome.com/docs/web-platform/long-animation-frames
// Ostatnia linia (do sparsowania w gates.sh):
//   SCROLLPERF klatka_med=<ms> interakcja_med=<ms> klatki=<a,b,c> interakcje=<d,e,f>
// Kod wyjscia 1, gdy mediana interakcji > 200 ms albo mediana klatki > 200 ms (progi bramki 100/200 ms sa w gates.sh).
import { chromium } from 'playwright'

const args = process.argv.slice(2)
let runs = 3
const ri = args.indexOf('--runs')
if (ri >= 0) { runs = Math.max(1, parseInt(args[ri + 1], 10) || 3); args.splice(ri, 2) }
const [url, w = '390', h = '844', cpu = '4'] = args
if (!url || /oleksiakconsulting\.com/.test(url)) {
  console.error('podaj URL localhost/podgladu (nie produkcja)')
  process.exit(2)
}
const exe = chromiumExe()
const b = await chromium.launch(exe ? { executablePath: exe } : {})

async function measure() {
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
  await ctx.close()
  const L = r.loaf
  const agg = {}
  for (const e of L) for (const s of e.s) { const k = `${s.u} ${s.i} ${s.f}`.trim(); agg[k] = agg[k] || { d: 0, fl: 0, n: 0 }; agg[k].d += s.d; agg[k].fl += s.fl; agg[k].n++ }
  return {
    scene, total, steps, inter, L,
    sum: L.reduce((a, e) => a + e.b, 0),
    max: L.reduce((a, e) => Math.max(a, e.d), 0),
    maxEv: r.ev.reduce((a, e) => Math.max(a, e.d), 0),
    nEv: r.ev.length,
    top: Object.entries(agg).sort((a, b) => b[1].d - a[1].d).slice(0, 3),
  }
}

const warm = await measure()
console.log(`rozgrzewka (nieliczona): najdluzsza klatka ${warm.max} ms, interakcja ${warm.maxEv} ms`)
const res = []
for (let i = 0; i < runs; i++) {
  const m = await measure()
  res.push(m)
  if (i === 0) console.log(`${url} ${w}x${h} cpu=${cpu}x tryb sceny: ${m.scene.scroll ? 'przewijana (.nk-scene.is-scroll), tor ' + m.scene.track + ' px' : m.scene.found ? 'statyczna (' + m.scene.cls + ')' : 'brak sceny'}; strona ${m.total} px, ${m.steps} krokow kolka`)
  console.log(`przebieg ${i + 1}/${runs}: klatki>50ms: ${m.L.filter((e) => e.d > 50).length}  >100ms: ${m.L.filter((e) => e.d > 100).length}  klatka ${m.max} ms  suma blokady: ${m.sum} ms  (LoAF ${m.L.length}); interakcja ${m.maxEv} ms (zdarzen ${m.nEv}; kontrolki: ${m.inter.join(' | ') || 'brak'})`)
  for (const [k, v] of m.top) console.log(`  skrypt: ${k} — ${v.d} ms w ${v.n} klatkach, w tym wymuszony uklad ${v.fl} ms`)
}
await b.close()
const median = (a) => { const s = [...a].sort((x, y) => x - y); const n = s.length; return n % 2 ? s[(n - 1) / 2] : Math.round((s[n / 2 - 1] + s[n / 2]) / 2) }
const frames = res.map((m) => m.max)
const inters = res.map((m) => m.maxEv)
const fMed = median(frames)
const iMed = median(inters)
console.log(`mediana z ${runs}: najdluzsza: ${fMed} ms; najdluzsza interakcja: ${iMed} ms`)
console.log(`SCROLLPERF klatka_med=${fMed} interakcja_med=${iMed} klatki=${frames.join(',')} interakcje=${inters.join(',')}`)
process.exit(iMed > 200 || fMed > 200 ? 1 : 0)
