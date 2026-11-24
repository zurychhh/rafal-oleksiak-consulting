#!/usr/bin/env node
// Obrys fokusu linkow w naglowku `/` nie moze nachodzic na sasiedni link ani wychodzic poza ekran (R4 p8).
// Dlaczego: linki dokladane przez ship-design maja padding 14px (cel dotyku), wiec obrys rysowal sie 16 px od tekstu,
// na 390 przecinal drugi link, na 1440 dotykal gornej krawedzi. qa.js tego nie widzi (fokus nie jest stanem spoczynku).
// Uzycie: node scripts/focus-ring.test.mjs http://localhost:3000   (tylko localhost)
import chromiumExeMod from './chromium-exe.cjs'; const { chromiumExe } = chromiumExeMod
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { chromium } = require('playwright')

const base = process.argv[2] || 'http://localhost:3000'
if (/oleksiakconsulting\.com/.test(base)) { console.error('tylko localhost'); process.exit(2) }
const exe = chromiumExe()
const b = await chromium.launch(exe ? { executablePath: exe } : {})
const fails = []
for (const [w, h] of [[320, 700], [390, 844], [768, 1024], [1440, 900]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } })
  await p.goto(base + '/', { waitUntil: 'networkidle' })
  await p.waitForTimeout(1200)
  const links = await p.$$eval('header a[data-ship-added]', (as) => as.map((a) => a.dataset.shipAdded))
  if (!links.length) fails.push(`${w}: brak linkow data-ship-added w naglowku`)
  for (const id of links) {
    const a = p.locator(`header a[data-ship-added="${id}"]`).first()
    await a.focus(); await p.keyboard.press('Shift+Tab'); await p.keyboard.press('Tab')
    const r = await p.evaluate((id) => {
      const el = document.activeElement
      if (!el || el.dataset.shipAdded !== id) return { err: 'fokus nie na linku' }
      const cs = getComputedStyle(el), bb = el.getBoundingClientRect()
      const o = parseFloat(cs.outlineOffset) + parseFloat(cs.outlineWidth)
      const ring = { l: bb.left - o, t: bb.top - o, r: bb.right + o, b: bb.bottom + o }
      const hits = [...document.querySelectorAll('header a')].filter((x) => x !== el).map((x) => {
        const q = x.getBoundingClientRect(); const range = document.createRange(); range.selectNodeContents(x)
        const t = range.getBoundingClientRect() // sam tekst, bez paddingu
        return (t.left < ring.r && t.right > ring.l && t.top < ring.b && t.bottom > ring.t) ? x.textContent.trim() : null
      }).filter(Boolean)
      return { hits, outTop: ring.t < 0, style: cs.outlineStyle }
    }, id)
    if (r.err) fails.push(`${w} ${id}: ${r.err}`)
    else {
      if (r.style === 'none') fails.push(`${w} ${id}: brak obrysu`)
      if (r.hits.length) fails.push(`${w} ${id}: obrys nachodzi na ${r.hits.join(', ')}`)
      if (r.outTop) fails.push(`${w} ${id}: obrys poza gorna krawedzia ekranu`)
    }
  }
  await p.close()
}
await b.close()
if (fails.length) { console.log('FAIL focus-ring\n' + fails.join('\n')); process.exit(1) }
console.log('focus-ring: OK (naglowek /, 320/390/768/1440)')
