// R6'-N9 pkt 1 (28.11, R6' p12): pigulka aktu `.ga-prog` na /work/genactiv a tekst i ramka telefonu sceny, w dol i w gore
// (w gore pasek aktow `.ga-ab` wjezdza, pigulka zjezdza o 40 px). Licznik sprawdzonych elementow; zero = NIETESTOWANE.
// Uzycie: node scripts/prog-overlap-check.mjs <szer> <wys> [url]. Kod 1 przy nachodzeniu. Pierwszy przebieg: 1100x620 i 1280x720
// po 16 nachodzen na ramke telefonu (tylko przy przewijaniu w gore), 1440x900: 0.
import chromiumExeMod from './chromium-exe.cjs'; const { chromiumExe } = chromiumExeMod
import { chromium } from 'playwright'
if (process.argv[4] && !/^http:\/\/(localhost|127\.0\.0\.1)[:/]/.test(process.argv[4])) { console.error('tylko localhost'); process.exit(2) }
const [W,H]=[+process.argv[2]||1100,+process.argv[3]||620]
const exe = chromiumExe(); const b = await chromium.launch(exe ? { executablePath: exe } : {}); const ctx = await b.newContext({ viewport: { width: W, height: H } }); await ctx.addInitScript(() => { Object.defineProperty(navigator, 'webdriver', { get: () => false }); try { localStorage.setItem('cookie-consent', 'declined') } catch {} }); const p = await ctx.newPage()
await p.goto(process.argv[4] || 'http://localhost:3000/work/genactiv'); await p.waitForTimeout(1200)
const tr = await p.evaluate(() => { const t = document.querySelector('.ga-track').getBoundingClientRect(); return [t.top + scrollY, t.height] })
let bad = 0, checked = 0, n = 0
for (const dir of ['down','up']) {
  const steps = 44
  for (let i = 0; i <= steps; i++) {
    const f = dir === 'down' ? i/steps : 1 - i/steps
    const y = Math.round(tr[0] + f * (tr[1] - H))
    await p.mouse.wheel(0, 0); await p.evaluate(y => window.scrollTo(0, y), y)
    if (dir==='up') await p.mouse.wheel(0, -40)
    await p.waitForTimeout(420)
    const r = await p.evaluate(() => {
      const pg = document.querySelector('.ga-prog'); if (!pg) return null
      const a = pg.getBoundingClientRect(); const txt = pg.textContent.trim()
      const hits = []; let c = 0
      const inter = (b) => !(b.right <= a.left || b.left >= a.right || b.bottom <= a.top || b.top >= a.bottom) && b.width > 0 && b.height > 0
      const stage = document.querySelector('.ga-stage')
      for (const el of stage.querySelectorAll('h1,h2,h3,p,li,.ga-phone,.ga-scr-h,.ga-sub')) {
        if (pg.contains(el)) continue; const cs = getComputedStyle(el); if (cs.visibility==='hidden' || +cs.opacity < 0.2) continue
        // pomin rodzicow o zerowej przezroczystosci
        let e = el, op = 1; while (e && e !== stage) { op *= +getComputedStyle(e).opacity; e = e.parentElement } if (op < 0.2) continue
        c++; const b = el.getBoundingClientRect(); if (inter(b)) hits.push(el.className || el.nodeName)
      }
      return { txt: txt.slice(0, 50), rect: [a.left, a.top, a.right, a.bottom].map(Math.round), hits, c }
    })
    if (!r) continue; n++; checked += r.c
    if (r.hits.length) { bad++; if (bad <= 3) { console.log(dir, f.toFixed(2), r.txt, r.rect, 'NACHODZI:', r.hits.join(' | ')); await p.screenshot({ path: `/home/claude/roc/agencja/podglad/r6q12-prog-${W}x${H}-${dir}-${Math.round(f*100)}.png` }) } }
  }
}
console.log(`PROG ${W}x${H} pozycji=${n} sprawdzonych=${checked} nachodzen=${bad}`)
await b.close()
console.log(checked === 0 ? 'PROG-OVERLAP FAIL NIETESTOWANE' : bad ? 'PROG-OVERLAP FAIL' : 'PROG-OVERLAP PASS')
process.exit(checked && !bad ? 0 : 1)
