#!/usr/bin/env node
import chromiumExeMod from './chromium-exe.cjs'; const { chromiumExe } = chromiumExeMod
// Spec 26 A2: Tab po krokach 01–04 przypietej sceny „How it works” na /nawyko (WCAG 2.4.3, 2.4.7, 2.4.11).
// Klawiatura (Tab) od gory strony do pierwszego przycisku kroku, potem Tab po krokach. Po kazdym kroku N:
// scena aktywna na kroku N (data-act, aria-current, li.is-on), opis kroku N widoczny (krycie >= 0,9, wysokosc > 0),
// fokus na przycisku kroku N, :focus-visible z obrysem, obrys w oknie i niezasloniety (elementFromPoint w 4 rogach
// obrysu + srodek; pasek cookies i paski fixed sie licza).
// navigator.webdriver nadpisany jak w cls-check.mjs (R14: inaczej uklad statyczny bez przypietej sceny).
// Uzycie: node scripts/nawyko-step-focus-check.mjs <url> [W=1440] [H=900] [--cookies] [--shot=prefix]
// Kod 1 przy bledzie, 2 przy bledzie uzycia albo braku przypietej sceny / listy krokow. Tylko localhost.
import { chromium } from 'playwright'

const args = process.argv.slice(2)
const flags = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => { const [k, v] = a.slice(2).split('='); return [k, v ?? true] }))
const [url, W = '1440', H = '900'] = args.filter((a) => !a.startsWith('--'))
if (!url || !/^http:\/\/(localhost|127\.0\.0\.1)[:/]/.test(url)) { console.error('podaj URL localhost'); process.exit(2) }
const cookies = !!flags.cookies
const shot = typeof flags.shot === 'string' ? flags.shot : ''

const exe = chromiumExe()
const b = await chromium.launch(exe ? { executablePath: exe } : {})
const ctx = await b.newContext({ viewport: { width: +W, height: +H } })
await ctx.addInitScript((cookies) => {
  Object.defineProperty(navigator, 'webdriver', { get: () => false })
  try { if (cookies) localStorage.removeItem('cookie-consent'); else localStorage.setItem('cookie-consent', 'accepted') } catch {}
}, cookies)
const p = await ctx.newPage()
await p.goto(url, { waitUntil: 'load' })
await p.waitForTimeout(1500)
const ok0 = await p.evaluate(() => !!document.querySelector('.nk-scene.is-scroll .nk-stepbtn'))
if (!ok0) { console.log(`BLAD ${url} ${W}x${H}: brak przypietej sceny z lista krokow`); await b.close(); process.exit(2) }
const visibleSteps = await p.evaluate(() => [...document.querySelectorAll('.nk-scene .nk-stepbtn')].filter((e) => e.getClientRects().length).length)

// Tab od poczatku dokumentu do pierwszego przycisku kroku
await p.mouse.click(1, 1)
await p.evaluate(() => { document.activeElement?.blur?.() })
let first = false
for (let i = 0; i < 120; i++) {
  await p.keyboard.press('Tab')
  if (await p.evaluate(() => !!document.activeElement?.matches('.nk-stepbtn'))) { first = true; break }
}
if (!first) { console.log(`FAIL ${W}x${H}: Tab nie dochodzi do przycisku kroku`); await b.close(); process.exit(1) }

const check = (n) => {
  const sc = document.querySelector('.nk-scene')
  const btns = [...sc.querySelectorAll('.nk-stepbtn')]
  const a = document.activeElement
  const out = { n, act: sc.dataset.act, focusIdx: btns.indexOf(a), errs: [] }
  if (out.focusIdx !== n) out.errs.push(`fokus na kroku ${out.focusIdx + 1}, nie ${n + 1}`)
  if (sc.dataset.act !== String(n)) out.errs.push(`scena na akcie ${+sc.dataset.act + 1}`)
  const bt = btns[n]
  if (bt.getAttribute('aria-current') !== 'step') out.errs.push('brak aria-current=step')
  if (!bt.closest('li').classList.contains('is-on')) out.errs.push('li bez is-on')
  const d = bt.querySelector('.nk-d')
  const dr = d.getBoundingClientRect()
  out.desc = (d.textContent || '').trim().slice(0, 40)
  if (+getComputedStyle(d).opacity < 0.9 || dr.height < 8) out.errs.push(`opis niewidoczny (krycie ${getComputedStyle(d).opacity}, wys. ${Math.round(dr.height)})`)
  if (!a.matches(':focus-visible')) out.errs.push('brak :focus-visible')
  const cs = getComputedStyle(a)
  if (cs.outlineStyle === 'none' || parseFloat(cs.outlineWidth) < 1) out.errs.push('brak obrysu')
  const off = parseFloat(cs.outlineOffset) + parseFloat(cs.outlineWidth)
  const r = a.getBoundingClientRect()
  const o = { l: r.left - off, t: r.top - off, r: r.right + off, b: r.bottom + off }
  const stage = sc.querySelector('.nk-stage').getBoundingClientRect()
  if (o.t < Math.max(0, stage.top) - 0.5 || o.b > Math.min(innerHeight, stage.bottom) + 0.5 || o.l < -0.5 || o.r > innerWidth + 0.5)
    out.errs.push(`obrys poza oknem/scena (${Math.round(o.t)}..${Math.round(o.b)}, scena ${Math.round(stage.top)}..${Math.round(stage.bottom)})`)
  const pts = [[o.l + 1, o.t + 1], [o.r - 1, o.t + 1], [o.l + 1, o.b - 1], [o.r - 1, o.b - 1], [(o.l + o.r) / 2, (o.t + o.b) / 2]]
  for (const [x, y] of pts) {
    const h = document.elementFromPoint(Math.min(innerWidth - 1, Math.max(0, x)), Math.min(innerHeight - 1, Math.max(0, y)))
    if (!h) continue
    for (let e = h; e && e !== document.body; e = e.parentElement) {
      if (e.contains(a)) break
      const pos = getComputedStyle(e).position
      if (pos === 'fixed' || pos === 'sticky') { out.errs.push(`obrys zasloniety w (${Math.round(x)},${Math.round(y)}) przez ${e.tagName.toLowerCase()}.${String(e.className).split(' ')[0]}`); break }
    }
  }
  out.focusRect = `${Math.round(o.t)}..${Math.round(o.b)}`
  return out
}

let fail = 0
// Na telefonie (<= 860 px) lista pokazuje tylko aktywny krok (pozostale display:none) — sprawdzamy tylko krok 01
// i zapisujemy, dokad idzie nastepny Tab.
const N = Math.min(4, visibleSteps)
for (let n = 0; n < N; n++) {
  if (n > 0) {
    await p.keyboard.press('Tab')
  }
  await p.waitForTimeout(1600)
  const r = await p.evaluate(check, n)
  if (shot) await p.screenshot({ path: `${shot}-${W}x${H}${cookies ? 'c' : ''}-krok${n + 1}.png` })
  if (r.errs.length) fail++
  console.log(`${r.errs.length ? 'FAIL' : 'ok  '} krok 0${n + 1}: akt sceny ${+r.act + 1}, fokus ${r.focusIdx + 1}, obrys ${r.focusRect}, opis "${r.desc}"${r.errs.length ? ' — ' + r.errs.join('; ') : ''}`)
  if (r.focusIdx !== n) break
}
if (N < 4) {
  await p.keyboard.press('Tab')
  const nx = await p.evaluate(() => { const a = document.activeElement; return `${a.tagName.toLowerCase()}.${String(a.className).split(' ')[0]} "${(a.textContent || '').trim().slice(0, 40)}"` })
  console.log(`info: widoczny ${N} przycisk kroku (uklad telefonu); nastepny Tab -> ${nx}`)
}
await b.close()
console.log(`STEPFOCUS ${fail ? 'FAIL' : 'PASS'} ${url} ${W}x${H}${cookies ? ' +cookies' : ''}: widocznych przyciskow krokow ${visibleSteps}`)
process.exit(fail ? 1 : 0)
