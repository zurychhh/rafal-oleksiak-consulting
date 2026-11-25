#!/usr/bin/env node
import chromiumExeMod from './chromium-exe.cjs'; const { chromiumExe } = chromiumExeMod
// R6' p6 (spec 40, recenzja 47): kokpit „For you” na /nawyko na laptopowych wysokosciach okna.
// Dla kazdego okna: czy przypiecie zgadza sie z progiem (>= 900 x 600), a potem dla KAZDEJ zakladki w SWIEZYM kontekscie
// (pierwszy klik, bez zapisanej zgody = pasek cookies) — kurs do kokpitu, klik zakladki, koniec przewijania:
//  1) aktywna zakladka = kliknieta (regresja: pierwszy klik „03 Privacy” konczyl na „Pharmacy”),
//  2) kazdy widoczny telefon (.nk-phone) w aktywnym panelu ma >= 150 px szerokosci (regresja: 118 px na 1366x657),
//  3) w panelu Pharmacy bloki nie nachodza na siebie i nie wychodza poza panel (regresja recenzji 48 I1, 900–1260 px).
// navigator.webdriver = false (jak w short-viewport-check.mjs), inaczej kokpit nie jest przypiety.
// Uzycie: node scripts/cockpit-pin-check.mjs <url /nawyko> [WxH ...]   Kod 1 = FAIL, 2 = blad uzycia. Tylko localhost.
import { chromium } from 'playwright'

const args = process.argv.slice(2)
const url = args[0]
if (!url || !/^http:\/\/(localhost|127\.0\.0\.1)[:/]/.test(url)) { console.error('podaj URL localhost'); process.exit(2) }
const vps = (args.slice(1).length ? args.slice(1) : ['1366x657', '1280x720', '1536x730', '1440x789', '1440x900', '1920x1080', '1100x620'])
  .map((s) => s.split('x').map(Number))
const MIN = 150
const exe = chromiumExe()
const b = await chromium.launch(exe ? { executablePath: exe } : {})
let fails = 0
for (const [W, H] of vps) {
  const wantPin = W >= 900 && H >= 600
  const res = []
  for (const mode of ['wheel', 'jump']) for (let i = 0; i < 6; i++) {
    const ctx = await b.newContext({ viewport: { width: W, height: H } })
    await ctx.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false })
      try { localStorage.removeItem('cookie-consent') } catch {}
    })
    const p = await ctx.newPage()
    await p.goto(url, { waitUntil: 'load' })
    await p.waitForTimeout(1200)
    const pinned = await p.evaluate(() => document.querySelector('.nk-cockpit')?.hasAttribute('data-pin'))
    // wheel: dojazd kolkiem do kokpitu (pasek cookies pojawia sie po drodze); jump: klik od gory strony — Playwright
    // przewija do zakladki i klika od razu, pasek cookies wjezdza W TRAKCIE skoku (tak recenzja 47 odtworzyla Privacy→Pharmacy)
    if (mode === 'wheel') {
      const top = await p.evaluate(() => document.querySelector('.nk-cockpit').getBoundingClientRect().top + scrollY)
      for (let y = 0; y < top; y += 600) { await p.mouse.wheel(0, 600); await p.waitForTimeout(25) }
      await p.evaluate((t) => scrollTo(0, t + 2), top)
      await p.waitForTimeout(500)
    }
    const tab = p.locator('.nk-ck-tabs [role="tab"]').nth(i)
    await tab.click()
    await p.waitForTimeout(2200)
    const r = await p.evaluate((MIN) => {
      const tabs = [...document.querySelectorAll('.nk-ck-tabs [role="tab"]')]
      const on = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true')
      const panel = document.getElementById(tabs[on]?.getAttribute('aria-controls') || '') ||
        [...document.querySelectorAll('.nk-ck-stage > section')].find((s) => !s.hidden)
      const phones = panel ? [...panel.querySelectorAll('.nk-phone')].filter((e) => {
        const q = e.getBoundingClientRect(); return q.width > 0 && q.height > 0 && getComputedStyle(e).visibility !== 'hidden'
      }) : []
      const w = phones.map((e) => Math.round(e.getBoundingClientRect().width))
      // recenzja 48 I1: w panelu Pharmacy zaden z blokow (naglowek, podtytul, karty, telefon, przycisk, przyklad) nie nachodzi
      // na inny i kazdy lezy w prostokacie panelu (karty wylewaly sie na naglowek na 900–1260 px)
      const over = []
      if (panel && panel.id === 'pharmacy') {
        const P = panel.getBoundingClientRect()
        const els = [...panel.querySelectorAll('.nk-h2, .nk-one, .nk-src, .nk-phone, .nk-scanbtn, .nk-fine')]
        const rs = els.map((e) => [e, e.getBoundingClientRect()])
        const nm = (e) => e.className.split(' ')[0]
        for (const [e, r] of rs) if (r.left < P.left - 1 || r.right > P.right + 1 || r.top < P.top - 1 || r.bottom > P.bottom + 1) over.push(nm(e) + '>panel')
        for (let a = 0; a < rs.length; a++) for (let c = a + 1; c < rs.length; c++) {
          const [ea, A] = rs[a], [ec, C] = rs[c]
          if (ea.contains(ec) || ec.contains(ea)) continue
          if (Math.min(A.right, C.right) - Math.max(A.left, C.left) > 1 && Math.min(A.bottom, C.bottom) - Math.max(A.top, C.top) > 1) over.push(nm(ea) + 'x' + nm(ec))
        }
      }
      return { on, w, small: w.filter((x) => x < MIN), over }
    }, MIN)
    const ok = r.on === i && r.small.length === 0 && r.over.length === 0 && pinned === wantPin
    if (!ok) fails++
    res.push(`${mode[0]}${i}:${ok ? 'ok' : 'FAIL'}(on=${r.on},phone=${r.w.join('/') || '-'}${r.over.length ? ',over=' + r.over.join('+') : ''})`)
    if (!ok && process.env.CPC_SHOTS) await p.screenshot({ path: `${process.env.CPC_SHOTS}/cpc-${W}x${H}-${mode}-${i}.png` })
    await ctx.close()
  }
  console.log(`${W}x${H} pin=${wantPin ? 'yes' : 'no'} ${res.join(' ')}`)
}
await b.close()
console.log(fails ? `COCKPITPIN FAIL fails=${fails}` : 'COCKPITPIN PASS')
process.exit(fails ? 1 : 0)
