#!/usr/bin/env node
import chromiumExeMod from './chromium-exe.cjs'; const { chromiumExe } = chromiumExeMod
// Spec 54 (PILNE 2 pkt 2): przypiete sceny z odslanianiem przewijaniem (.nk-sp na /nawyko: #loyalty, #integrations).
// Dla kazdego okna (bez zapisanej zgody = pasek cookies) i kazdej sceny:
//  1) przypiecie zgadza sie z progiem (>= 900 x 600) — ponizej sekcja bez przypiecia i wszystkie kafle widoczne,
//  2) przewiniecie do srodka odcinka k daje licznik „k+1 of n” (krok z polozenia, bez przechwytywania przewijania),
//  3) przypieta scena nie wystaje poza ekran minus pasek cookies (scrollHeight <= clientHeight + 1),
//  4) recenzja 60 I1: wejscie kotwica na kafel (np. /nawyko#levels z menu) konczy z tym kaflem odslonietym (opacity > .9),
//  5) w ostatnim kroku sceny #loyalty wszystkie kafle odsloniete (nic nie znika — Z-05).
// navigator.webdriver = false (jak cockpit-pin-check), inaczej sceny nie sa przypiete.
// Uzycie: node scripts/step-pin-check.mjs <url /nawyko> [WxH ...]   Kod 1 = FAIL, 2 = blad uzycia. Tylko localhost.
import { chromium } from 'playwright'

const args = process.argv.slice(2)
const url = args[0]
if (!url || !/^http:\/\/(localhost|127\.0\.0\.1)[:/]/.test(url)) { console.error('podaj URL localhost'); process.exit(2) }
const vps = (args.slice(1).length ? args.slice(1) : ['1440x900', '1280x720', '1100x620', '900x600', '1920x1080', '390x844'])
  .map((s) => s.split('x').map(Number))
const SCENES = [{ id: 'loyalty', n: 3, anchors: ['cashback', 'levels', 'exchange'] }, { id: 'integrations', n: 7, anchors: [] }]
const exe = chromiumExe()
const b = await chromium.launch(exe ? { executablePath: exe } : {})
let fails = 0, checks = 0
const bad = (m) => { fails++; console.log('  FAIL ' + m) }
for (const [W, H] of vps) {
  // PILNE TERAZ 3 (28.11 13:36): telefon i waskie okno tez przypinaja (< 900 px, wysokosc >= 560) — data-pin="narrow"
  const wantPin = (W >= 900 && H >= 600) || (W < 900 && H >= 560)
  const narrow = W < 900
  const ctx = await b.newContext({ viewport: { width: W, height: H } })
  await ctx.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false })
    try { localStorage.removeItem('cookie-consent') } catch {}
  })
  const p = await ctx.newPage()
  await p.goto(url, { waitUntil: 'load' })
  await p.waitForTimeout(1500)
  for (const sc of SCENES) {
    const info = await p.evaluate((id) => { const e = document.getElementById(id); const r = e.getBoundingClientRect(); return { top: r.top + scrollY, h: r.height, pin: e.hasAttribute('data-pin') } }, sc.id)
    checks++
    if (info.pin !== wantPin) { bad(`${W}x${H} #${sc.id} przypiecie=${info.pin}, oczekiwane ${wantPin}`); continue }
    if (!wantPin) {
      const hid = await p.evaluate((id) => [...document.querySelectorAll(`#${id} [data-sp-step]`)].filter((e) => +getComputedStyle(e).opacity < 0.9).length, sc.id)
      checks++; if (hid) bad(`${W}x${H} #${sc.id} bez przypiecia, a ${hid} krokow niewidocznych`)
      continue
    }
    // geometria toru: desktop — scena od gory sekcji, odcinek (h - H) / n; telefon — scena przypina sie przy r.top = --sp-top - odstep
    if (narrow) { await p.evaluate((id) => document.getElementById(id).scrollIntoView(), sc.id); await p.waitForTimeout(700) }
    const g = await p.evaluate(([id, n, narrow]) => {
      const s = document.getElementById(id); const pin = s.querySelector('.nk-sp-pin'); const r = s.getBoundingClientRect()
      if (!narrow) return { y0: r.top + scrollY, seg: (r.height - innerHeight) / n }
      const pad = pin.getBoundingClientRect().top - r.top
      const t0 = parseFloat(s.style.getPropertyValue('--sp-top')) - pad
      return { y0: r.top + scrollY - t0, seg: (r.height - pad - pin.getBoundingClientRect().height) / n }
    }, [sc.id, sc.n, narrow])
    for (let k = 0; k < sc.n; k++) {
      await p.evaluate((y) => scrollTo(0, y), Math.round(g.y0 + (k + 0.5) * g.seg))
      await p.waitForTimeout(650)
      const r = await p.evaluate((id) => {
        const s = document.getElementById(id); const pin = s.querySelector('.nk-sp-pin')
        const c = s.querySelector('.nk-sp-count')?.textContent?.trim() ?? ''
        const tiles = [...s.querySelectorAll('.nk-tile')]
        const hidden = tiles.filter((e) => +getComputedStyle(e).opacity < 0.9).length
        const ch = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--consent-h')) || 0
        const a = s.querySelector('[data-sp-anchor]')?.getBoundingClientRect(); const e = s.querySelector('[data-sp-end]')?.getBoundingClientRect()
        // telefon: od licznika do konca kafla/schematu w oknie nad paskiem cookies
        const nOver = a && e ? Math.max(-a.top, e.bottom - (innerHeight - ch)) : 99
        return { c, over: s.dataset.pin === 'narrow' ? nOver : pin.scrollHeight - pin.clientHeight, hidden, tiles: tiles.length }
      }, sc.id)
      checks += 2
      if (!r.c.startsWith(`${k + 1} of ${sc.n}`)) bad(`${W}x${H} #${sc.id} krok ${k}: licznik „${r.c}”`)
      if (r.over > 1) bad(`${W}x${H} #${sc.id} krok ${k}: scena wystaje o ${Math.round(r.over)} px`)
      if (sc.id === 'loyalty' && !narrow && k === sc.n - 1) { checks++; if (r.hidden) bad(`${W}x${H} #loyalty ostatni krok: ${r.hidden} kafli niewidocznych`) }
      // telefon: kafle w jednej komorce — widoczny dokladnie jeden (biezacy)
      if (sc.id === 'loyalty' && narrow) { checks++; if (r.tiles - r.hidden !== 1) bad(`${W}x${H} #loyalty krok ${k}: widocznych kafli ${r.tiles - r.hidden}, oczekiwany 1`) }
    }
    for (const a of sc.anchors) {
      const q = await ctx.newPage()
      await q.goto(url + '#' + a, { waitUntil: 'load' })
      await q.waitForTimeout(1800)
      const o = await q.evaluate((a) => { const e = document.getElementById(a); const r = e.getBoundingClientRect(); return { op: +getComputedStyle(e).opacity, vis: r.top < innerHeight && r.bottom > 0 } }, a)
      checks++
      if (o.op < 0.9 || !o.vis) bad(`${W}x${H} wejscie #${a}: opacity ${o.op}, w oknie ${o.vis}`)
      await q.close()
    }
  }
  console.log(`${W}x${H} pin=${wantPin} ok`)
  await ctx.close()
}
await b.close()
console.log(`STEPPIN ${fails ? 'FAIL' : 'PASS'} sprawdzen=${checks} bledow=${fails}`)
process.exit(fails ? 1 : 0)
