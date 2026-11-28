#!/usr/bin/env node
// spec 49 (WCAG 2.2 SC 1.4.10 Reflow): 320×568 (= 400 % z 1280) i 640×360 (= 200 % z 1280×720).
// Przewija cala trase; FAIL, gdy: poziomy scroll dokumentu, tekst poza oknem (TAKZE gdy przodek ma overflow:hidden —
// pierwsza wersja tej kontroli liczyla to jako „OK” i byla slepa na ucieta kolumne finalu /nawyko), widoczny telefon
// (.nk-*phone, .ga-phone) wezszy niz 150 px. Rzad w przewijanym kontenerze (overflow-x:auto, np. zakladki kokpitu) nie liczy sie. Ucinanie z wielokropkiem (text-overflow:ellipsis) = INFO, nie FAIL.
// Uzycie: node scripts/reflow-check.mjs http://localhost:3000 /nawyko [/inne]   (tylko localhost)
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { chromium } = require('playwright')
const { chromiumExe } = require('./chromium-exe.cjs')
const [base, ...routes] = process.argv.slice(2)
if (!base || !/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(base)) { console.error('tylko http://localhost:<port>'); process.exit(2) }
const SIZES = [[320, 568], [640, 360]]
let fail = 0
const b = await chromium.launch({ executablePath: chromiumExe() })
for (const route of routes) for (const [w, h] of SIZES) {
  const p = await b.newPage({ viewport: { width: w, height: h } })
  await p.goto(base + route, { waitUntil: 'networkidle' })
  const H = await p.evaluate(() => document.documentElement.scrollHeight)
  const bad = new Set(), info = new Set(); let sw = 0
  for (let y = 0; y < H; y += Math.round(h * 0.6)) {
    await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(100)
    const r = await p.evaluate(() => {
      const W = innerWidth, out = [], inf = []
      const vis = (el) => { const s = getComputedStyle(el); return s.visibility !== 'hidden' && +s.opacity > 0 }
      for (const el of document.querySelectorAll('body *')) {
        if (!vis(el) || el.closest('[hidden],.sr-only,.visually-hidden')) continue
        const r = el.getBoundingClientRect(); if (!r.width || r.bottom < 0 || r.top > innerHeight || r.left < -2000) continue
        if (/phone/.test(String(el.className)) && /^(nk|ga)-/.test(String(el.className)) && r.width < 150 && r.height > 40) out.push('PHONE<150 ' + el.className + ' w' + Math.round(r.width))
        const txt = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()); if (!txt) continue
        const s = getComputedStyle(el); const name = el.tagName + '.' + String(el.className).slice(0, 28) + ' "' + el.textContent.trim().slice(0, 28) + '"'
        const inScroller = (() => { for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) if (/auto|scroll/.test(getComputedStyle(a).overflowX)) return true; return false })()
        if ((r.right > W + 1 || r.left < -1) && !inScroller) out.push('POZA-OKNEM ' + name + ' R' + Math.round(r.right))
        else if (el.scrollWidth > el.clientWidth + 2 && s.overflowX !== 'visible' && !/auto|scroll/.test(s.overflowX)) (s.textOverflow === 'ellipsis' ? inf : out).push('UCIETE ' + name)
      }
      return { out, inf, sw: document.documentElement.scrollWidth }
    })
    sw = Math.max(sw, r.sw); r.out.forEach((x) => bad.add(x)); r.inf.forEach((x) => info.add(x))
  }
  if (sw > w) bad.add('POZIOMY-SCROLL ' + sw)
  console.log(`${bad.size ? 'FAIL' : 'PASS'} reflow ${route} ${w}x${h} problemy=${bad.size} wielokropek(INFO)=${info.size}`)
  ;[...bad].slice(0, 12).forEach((x) => console.log('   ' + x)); if (bad.size) fail++
  await p.close()
}
await b.close(); console.log(fail ? `REFLOW FAIL ${fail}` : 'REFLOW PASS'); process.exit(fail ? 1 : 0)
