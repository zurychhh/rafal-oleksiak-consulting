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
const { contrastIn } = require('./contrast-eval.cjs')
const [base, ...routes] = process.argv.slice(2)
if (!base || !/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(base)) { console.error('tylko http://localhost:<port>'); process.exit(2) }
const SIZES = [[320, 568], [640, 360]]
let fail = 0
async function finaleContrast(p, bad, tag) {
  const dots = await p.$$('.nk-fz-dots button')
  let checked = 0, unknown = 0
  for (let i = 0; i < dots.length; i++) {
    try { await dots[i].scrollIntoViewIfNeeded(); await dots[i].click({ timeout: 3000 }) } catch { bad.add('KONTRAST-FINAL' + tag + ' kropka ' + (i + 1) + ' nieklikalna (zaslonieta?)'); continue }
    await p.waitForTimeout(900)
    const c = await p.evaluate(contrastIn, ['.nk-fz-phone', false]); unknown += c.unknown
    checked += c.n; c.bad.forEach((x) => bad.add('KONTRAST-FINAL' + tag + ' chwila ' + (i + 1) + ' ' + x))
  }
  if (dots.length && !checked) bad.add('KONTRAST-FINAL NIETESTOWANE (0 tekstow)')
  if (dots.length) console.log(`   kontrast telefonu finalu${tag}: ${dots.length} chwil, ${checked} tekstow sprawdzonych, nieznane tlo (INFO) ${unknown}`)
  return dots.length
}
const b = await chromium.launch({ executablePath: chromiumExe() })
for (const route of routes) for (const [w, h] of SIZES) {
  const p = await b.newPage({ viewport: { width: w, height: h }})
  await p.goto(base + route, { waitUntil: 'networkidle' })
  // kontrola pozytywna bramki: REFLOW_SELFTEST_CSS='<css>' wstrzykuje styl (np. slaby kontrast) — wynik musi byc FAIL
  if (process.env.REFLOW_SELFTEST_CSS) await p.addStyleTag({ content: process.env.REFLOW_SELFTEST_CSS })
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
  // spec 51 (R6'-N16 pkt 2): telefon finalu /nawyko po kliku KAZDEJ kropki — qa.js widzi tylko chwile 1.
  // Kontrast kazdego widocznego tekstu w .nk-fz-phone (efektywna nieprzezroczystosc przodkow > 0,5) wobec tla
  // zlozonego z warstw (alfa); prog 4,5:1, 3:1 dla >= 24 px albo >= 18,66 px pogrubionego. Zero sprawdzonych tekstow = FAIL.
  await finaleContrast(p, bad, '')
  console.log(`${bad.size ? 'FAIL' : 'PASS'} reflow ${route} ${w}x${h} problemy=${bad.size} wielokropek(INFO)=${info.size}`)
  ;[...bad].slice(0, 12).forEach((x) => console.log('   ' + x)); if (bad.size) fail++
  await p.close()
}
// spec 51: kolor marki odwiedzajacego jest dowolny (#RRGGBB) — kontrast telefonu finalu dla skrajnych kolorow (640x360)
const COLOURS = (process.env.REFLOW_COLOURS || '#FFE600,#F4F4F4,#111111,#7A7A7A,#00B3FF').split(',')
for (const route of routes) for (const col of COLOURS) {
  const p = await b.newPage({ viewport: { width: 640, height: 360 }, reducedMotion: 'reduce' })
  await p.addInitScript((c) => { try { localStorage.setItem('oc-brand-v1', JSON.stringify({ name: 'Brandx', colour: c })) } catch {} }, col)
  await p.goto(base + route, { waitUntil: 'networkidle' })
  if (process.env.REFLOW_SELFTEST_CSS) await p.addStyleTag({ content: process.env.REFLOW_SELFTEST_CSS })
  const bad = new Set()
  const n = await finaleContrast(p, bad, ' ' + col)
  await p.close(); if (!n) { console.log(`INFO kolor-marki ${route}: brak finalu z kropkami — pominiete`); break }
  console.log(`${bad.size ? 'FAIL' : 'PASS'} kolor-marki ${route} ${col} problemy=${bad.size}`)
  ;[...bad].slice(0, 8).forEach((x) => console.log('   ' + x)); if (bad.size) fail++
}
await b.close(); console.log(fail ? `REFLOW FAIL ${fail}` : 'REFLOW PASS'); process.exit(fail ? 1 : 0)
