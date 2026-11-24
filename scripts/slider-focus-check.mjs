#!/usr/bin/env node
import chromiumExeMod from './chromium-exe.cjs'; const { chromiumExe } = chromiumExeMod
// R4 p15 B2a (spec 26): obrys fokusu suwaka /calculator (#gc-t) musi byc w CALOSCI widoczny w obu skrajnych polozeniach.
// Recenzja 30: przy skrajnym polozeniu kciuk (ten sam kolor co obrys) przykrywal/zlewal sie z bocznym bokiem obrysu.
// Metoda (piksele, nie styl): fokus z klawiatury (klik w #gc-g + Tab), Home -> minimum, End -> maksimum; zrzut okolicy
// suwaka, analiza w canvasie. Dla boku przy kciuku (lewy przy Home, prawy przy End)
// w kazdym wierszu w wysokosci kciuka (srodek +-14 px) idac od zewnatrz: ciemny obrys (>= 1 px) -> jasna przerwa (>= 1 px) -> ciemny kciuk.
// Brak przerwy = bok obrysu zlany z kciukiem / zakryty = FAIL. Dodatkowo gorny i dolny bok obrysu: ciemny piksel w pasie
// 4 px przy krawedzi pola, w kolumnie na srodku suwaka (kciuk jest wtedy przy brzegu).
// Uzycie: node scripts/slider-focus-check.mjs <base-url> <W> <H> [--shot=prefiks]   (zrzuty <prefiks>-min.png / -max.png)
// Kod 1 przy FAIL, 2 przy bledzie uzycia. Tylko localhost.
import { chromium } from 'playwright'

const args = process.argv.slice(2)
const flags = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => { const [k, v] = a.slice(2).split('='); return [k, v ?? true] }))
const [base, W = '1440', H = '900'] = args.filter((a) => !a.startsWith('--'))
if (!base || !/^http:\/\/(localhost|127\.0\.0\.1)[:/]/.test(base)) { console.error('podaj URL localhost'); process.exit(2) }
const shot = typeof flags.shot === 'string' ? flags.shot : ''

const exe = chromiumExe()
const b = await chromium.launch(exe ? { executablePath: exe } : {})
const ctx = await b.newContext({ viewport: { width: +W, height: +H }, reducedMotion: 'reduce' })
await ctx.addInitScript(() => { try { localStorage.setItem('cookie-consent', 'accepted') } catch {} })
const p = await ctx.newPage()
await p.goto(base.replace(/\/$/, '') + '/calculator', { waitUntil: 'load' })
await p.waitForTimeout(1200)
await p.locator('#gc-t').scrollIntoViewIfNeeded()
await p.click('#gc-g')
await p.keyboard.press('Tab')
const fails = []
const act = await p.evaluate(() => [document.activeElement?.id, document.activeElement?.matches(':focus-visible')])
if (act[0] !== 'gc-t' || !act[1]) fails.push(`fokus z klawiatury: aktywny #${act[0]}, :focus-visible=${act[1]}`)

const PAD = 10
const measure = async (key, side) => {
  await p.keyboard.press(key)
  await p.waitForTimeout(400)
  const r = await p.evaluate(() => { const x = document.querySelector('#gc-t').getBoundingClientRect(); return { x: x.left, y: x.top, w: x.width, h: x.height } })
  const clip = { x: Math.max(0, r.x - PAD), y: Math.max(0, r.y - PAD), width: r.w + 2 * PAD, height: r.h + 2 * PAD }
  const buf = await p.screenshot({ clip })
  if (shot) await p.screenshot({ path: `${shot}-${side === 'L' ? 'min' : 'max'}.png`, clip: { x: Math.max(0, r.x - 40), y: Math.max(0, r.y - 60), width: Math.min(+W - Math.max(0, r.x - 40), r.w + 80), height: r.h + 120 } })
  return p.evaluate(async ({ b64, r, clip, side }) => {
    const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode()
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height
    const g = c.getContext('2d'); g.drawImage(img, 0, 0)
    const dpr = img.width / clip.width
    const dark = (x, y) => { const d = g.getImageData(Math.round(x * dpr), Math.round(y * dpr), 1, 1).data; return 0.2126 * d[0] + 0.7152 * d[1] + 0.0722 * d[2] < 110 }
    const ox = r.x - clip.x, oy = r.y - clip.y   // lewy-gorny rog pola w zrzucie
    // kazdy wiersz w wysokosci kciuka (srodek +-14 px, kciuk ma 34 px): od zewnatrz obrys -> przerwa -> kciuk/tor
    let worst = null
    for (let dy = -14; dy <= 14; dy++) {
      const row = oy + r.h / 2 + dy
      const seq = []
      for (let i = -8; i <= 70; i++) seq.push(dark(side === 'L' ? ox + i + 0.5 : ox + r.w - i - 0.5, row) ? 'D' : '.')
      const s = seq.join('')
      const m = s.match(/^\.*(D+)(\.+)(D+)/)
      const v = { dy, s, outline: m ? m[1].length : 0, gap: m ? m[2].length : 0 }
      if (!worst || v.gap < worst.gap || (v.gap === worst.gap && v.outline < worst.outline)) worst = v
    }
    const mid = ox + r.w / 2
    let top = false, bot = false
    for (let y = -4; y <= 4; y++) { if (dark(mid, oy + y + 0.5)) top = true; if (dark(mid, oy + r.h + y - 0.5)) bot = true }
    return { ...worst, top, bot }
  }, { b64: buf.toString('base64'), r, clip, side })
}
for (const [key, side] of [['Home', 'L'], ['End', 'R']]) {
  const v = await measure(key, side)
  const val = await p.evaluate(() => { const e = document.querySelector('#gc-t'); return `${e.value} (min ${e.min}, max ${e.max})` })
  const name = side === 'L' ? 'lewy bok przy minimum' : 'prawy bok przy maksimum'
  console.log(`${key}: wartosc ${val}; najgorszy wiersz (srodek${v.dy >= 0 ? '+' : ''}${v.dy}) od zewnatrz: ${v.s.slice(0, 40)}; obrys ${v.outline} px, przerwa ${v.gap} px; gora ${v.top ? 'jest' : 'BRAK'}, dol ${v.bot ? 'jest' : 'BRAK'}`)
  if (!v.outline || !v.gap) fails.push(`${name}: obrys zlany z kciukiem lub zakryty (${v.s.slice(0, 30)})`)
  if (!v.top || !v.bot) fails.push(`${name}: brak gornego/dolnego boku obrysu`)
}
await b.close()
for (const f of fails) console.log('FAIL ' + f)
console.log(`SLIDERFOCUS ${fails.length ? 'FAIL' : 'PASS'} ${W}x${H}`)
process.exit(fails.length ? 1 : 0)
