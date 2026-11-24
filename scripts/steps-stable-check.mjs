#!/usr/bin/env node
import chromiumExeMod from './chromium-exe.cjs'; const { chromiumExe } = chromiumExeMod
// R4 p13 A1 (lekcja R19): lista krokow /nawyko — pozycja kazdego `.nk-step` i naglowka sceny klatka po klatce.
// CLS nie widzi przesuniecia ukrytego ponownym montazem, wiec mierzymy getBoundingClientRect().top w kazdej klatce (rAF)
// wzgledem kontenera listy (`.nk-steps`), naglowek `.nk-h2` wzgledem listy, a sama lista wzgledem `.nk-stage`
// (to ostatnie pomijane w klatkach, gdy biegnie animacja wejscia calego bloku `.nk-in` — transform, nie przesuniecie sasiadow).
// Przebieg: kolko w dol przez akty 0→1→2→3 (az lista zniknie w akcie 4), potem w gore do aktu 0; potem klik w przyciski
// krokow 1→2→3→4→1 (sciezka myszy/klawiatury, go(i) przewija gladko).
// Kod 1, gdy cokolwiek zmieni `top` o > 1 px (poza klatkami bez listy). Tylko localhost.
// Uzycie: node scripts/steps-stable-check.mjs <url> [szer=1440] [wys=900]
import { chromium } from 'playwright'
const [, , url, w = '1440', h = '900'] = process.argv
if (!url || !/^http:\/\/(localhost|127\.0\.0\.1)/.test(url)) { console.error('tylko localhost'); process.exit(2) }
const exe = chromiumExe()
const b = await chromium.launch(exe ? { executablePath: exe } : {})
const ctx = await b.newContext({ viewport: { width: +w, height: +h } })
await ctx.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => false }))
const p = await ctx.newPage()
await p.goto(url, { waitUntil: 'load' })
await p.waitForTimeout(2000)
await p.evaluate(() => {
  window.__fr = []
  const tick = () => {
    const sc = document.getElementById('how')
    const list = sc && sc.querySelector('.nk-steps')
    const stage = sc && sc.querySelector('.nk-stage')
    if (list && stage) {
      const L = list.getBoundingClientRect().top
      const S = stage.getBoundingClientRect().top
      const h2 = sc.querySelector('.nk-scenehead .nk-h2')
      window.__fr.push({
        act: sc.dataset.act ?? null,
        y: Math.round(scrollY),
        // whole-block entry animation (.nk-in, transform) after the list remounts on act 4→3: list vs stage skipped then
        anim: [...(sc.querySelector('.nk-in')?.getAnimations() ?? [])].some((a) => a.playState === 'running'),
        list: L - S,
        h2: h2 ? h2.getBoundingClientRect().top - L : null,
        steps: [...list.querySelectorAll('.nk-step')].map((e) => e.getBoundingClientRect().top - L),
      })
    }
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
})
const sceneTop = await p.evaluate(() => document.getElementById('how').getBoundingClientRect().top + scrollY)
const sceneH = await p.evaluate(() => document.getElementById('how').offsetHeight)
await p.evaluate((y) => scrollTo(0, y), Math.max(0, sceneTop - +h))
await p.waitForTimeout(500)
await p.mouse.move(+w / 2, +h / 2)
const actOf = () => p.evaluate(() => +(document.getElementById('how').dataset.act ?? -1))
// w dol az do aktu 4 (lista znika), potem w gore do aktu 0 i jeszcze kawalek przed scene
for (let i = 0; i < 400 && (await actOf()) < 4; i++) { await p.mouse.wheel(0, 120); await p.waitForTimeout(60) }
await p.waitForTimeout(600)
for (let i = 0; i < 400 && (await p.evaluate(() => scrollY)) > sceneTop - 200; i++) { await p.mouse.wheel(0, -120); await p.waitForTimeout(60) }
await p.waitForTimeout(600)
// sciezka przyciskow: wejscie w scene, potem klik 2,3,4,1
await p.evaluate((y) => scrollTo(0, y), sceneTop + 10)
await p.waitForTimeout(800)
const mode = await p.evaluate(() => (document.getElementById('how').className.includes('is-scroll') ? 'scroll' : 'still'))
for (const i of [1, 2, 3, 0]) {
  const btn = p.locator('#how .nk-stepbtn').nth(i)
  if (await btn.isVisible()) { await btn.click(); await p.waitForTimeout(1600) }
}
const F = await p.evaluate(() => window.__fr)
await b.close()
if (!F.length) { console.log(`STEPSSTABLE FAIL brak klatek z lista (${w}x${h})`); process.exit(1) }
const base = F.find((f) => !f.anim) ?? F[0]
let worst = { d: 0 }
const acts = new Set()
for (const f of F) {
  acts.add(f.act)
  const cmp = [['lista', f.anim ? null : f.list, base.list], ['naglowek', f.h2, base.h2], ...f.steps.map((v, i) => [`krok ${i + 1}`, v, base.steps[i]])]
  for (const [n, v, b0] of cmp) {
    if (v == null || b0 == null) continue
    const d = Math.abs(v - b0)
    if (d > worst.d) worst = { d, n, act: f.act, y: f.y, from: b0, to: v }
  }
}
const ok = worst.d <= 1
console.log(`${url} ${w}x${h} tryb=${mode}: klatek ${F.length}, akty ${[...acts].join(',')}; wiersze wzgl. listy: ${base.steps.map((v) => Math.round(v)).join('/')}`)
if (worst.d > 0) console.log(`najwieksze przesuniecie: ${worst.n} ${worst.d.toFixed(1)} px (akt ${worst.act}, y=${worst.y}, ${worst.from.toFixed(1)} → ${worst.to.toFixed(1)})`)
console.log(`STEPSSTABLE ${ok ? 'PASS' : 'FAIL'} max=${worst.d.toFixed(2)}px klatek=${F.length}`)
process.exit(ok ? 0 : 1)
