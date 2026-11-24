#!/usr/bin/env node
import chromiumExeMod from './chromium-exe.cjs'; const { chromiumExe } = chromiumExeMod
// R4 p14 A1 (spec 25): przypieta scena /nawyko i /work/genactiv na niskim oknie — czy kazdy WIDOCZNY tekst, przycisk
// i link sceny miesci sie w oknie i w scenie (sticky + overflow:hidden) i nie lezy pod paskiem position:fixed|sticky
// (pasek cookies, ChapterBar .cb, pasek aktow .ga-ab) ani pod paskiem aktow sceny (.nk-acts, .nk-bar).
// Przewija scene krokami co 2% jej wysokosci w dol, potem w gore (paski gornych rozdzialow wracaja przy przewijaniu w gore).
// Na kazdej pozycji: prostokat elementu (po przycieciu przez jego wlasne kontenery overflow ponizej sceny — tresc
// telefonu przycieta celowo w ekranie makiety nie liczy sie) musi lezec w oknie i w prostokacie sceny; elementFromPoint
// w 3 punktach + przeciecie prostokatow z paskami.
// navigator.webdriver nadpisany jak w cls-check.mjs (R14: inaczej strony daja uklad statyczny bez przypietej sceny).
// --cookies = brak zgody (pasek cookies widoczny po pierwszym przewinieciu > 200 px); bez = localStorage cookie-consent=accepted.
// Uzycie: node scripts/short-viewport-check.mjs <url> <W> <H> [--cookies] [--shot=plik.png] [--wait=ms]
// Kod 1 przy jakimkolwiek ucieciu lub zasloniecu, 2 przy bledzie uzycia albo braku przypietej sceny. Tylko localhost.
import { chromium } from 'playwright'

const args = process.argv.slice(2)
const flags = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => { const [k, v] = a.slice(2).split('='); return [k, v ?? true] }))
const [url, W = '1440', H = '900'] = args.filter((a) => !a.startsWith('--'))
if (!url || !/^http:\/\/(localhost|127\.0\.0\.1)[:/]/.test(url)) { console.error('podaj URL localhost'); process.exit(2) }
const cookies = !!flags.cookies
const wait = +(flags.wait || 350)
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
await p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto' })

const geo = await p.evaluate(() => {
  const s = document.querySelector('.nk-scene.is-scroll') || document.querySelector('.ga-track')
  if (!s) return null
  const r = s.getBoundingClientRect()
  return { top: r.top + scrollY, h: r.height, sel: s.classList.contains('ga-track') ? '.ga-track' : '.nk-scene' }
})
if (!geo) { console.log(`BLAD ${url} ${W}x${H}: brak przypietej sceny (uklad statyczny?)`); await b.close(); process.exit(2) }

// Pasek cookies pokazuje sie po przewinieciu > 200 px: zejdz i wroc, zanim zaczniesz.
if (cookies) { await p.evaluate(() => scrollTo(0, 400)); await p.waitForTimeout(500) }

const scanAt = (sceneSel) => {
  const stage = document.querySelector(sceneSel === '.ga-track' ? '.ga-stage' : '.nk-stage')
  const vw = innerWidth, vh = innerHeight
  const label = (e) => {
    const t = (e.getAttribute('aria-label') || e.textContent || e.value || '').replace(/\s+/g, ' ').trim().slice(0, 50)
    const c = typeof e.className === 'string' && e.className ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : ''
    return `${e.tagName.toLowerCase()}${c} "${t}"`
  }
  const isect = (a, b) => ({ l: Math.max(a.l, b.l), t: Math.max(a.t, b.t), r: Math.min(a.r, b.r), b: Math.min(a.b, b.b) })
  const empty = (r) => r.r - r.l < 1 || r.b - r.t < 1
  const R = (x) => ({ l: x.left, t: x.top, r: x.right, b: x.bottom })
  // paski: kazdy widoczny element fixed/sticky poza scena + pasek aktow sceny /nawyko
  const bars = []
  for (const e of document.body.querySelectorAll('*')) {
    if (stage.contains(e) || e.contains(stage)) continue
    const cs = getComputedStyle(e)
    if (cs.position !== 'fixed' && cs.position !== 'sticky') continue
    if (cs.visibility !== 'visible' || cs.display === 'none' || +cs.opacity < 0.05) continue
    const r = isect(R(e.getBoundingClientRect()), { l: 0, t: 0, r: vw, b: vh })
    if (empty(r)) continue
    bars.push({ e, r, name: label(e).slice(0, 40) })
  }
  for (const e of stage.querySelectorAll('.nk-acts, .nk-bar')) {
    const r = R(e.getBoundingClientRect())
    if (!empty(r) && getComputedStyle(e).display !== 'none') bars.push({ e, r, name: e.classList.contains('nk-acts') ? 'pasek aktow .nk-acts' : 'pasek postepu .nk-bar', inner: true })
  }
  const stageR = isect(R(stage.getBoundingClientRect()), { l: 0, t: 0, r: vw, b: vh })
  const probs = []
  let checked = 0
  const cands = [...stage.querySelectorAll('*')].filter((e) =>
    /^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(e.tagName) ||
    [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()))
  for (const e of cands) {
    if (e.closest('[aria-hidden="true"]')) continue
    const cs = getComputedStyle(e)
    if (cs.visibility !== 'visible' || cs.display === 'none') continue
    let op = 1, clip = R(e.getBoundingClientRect())
    if (empty(clip)) continue
    // krycie skumulowane i przyciecie przez wlasne kontenery overflow ponizej sceny
    for (let a = e; a && a !== stage; a = a.parentElement) {
      const s = getComputedStyle(a)
      op *= +s.opacity
      if (s.display === 'none') { op = 0; break }
      if (a !== e && s.overflow !== 'visible' && s.overflowX !== 'visible') clip = isect(clip, R(a.getBoundingClientRect()))
    }
    if (op < 0.5 || empty(clip)) continue
    checked++
    const inBar = bars.find((x) => x.e.contains(e))
    // 1) w oknie i w scenie (scena przycina overflow:hidden)
    const lim = isect({ l: 0, t: 0, r: vw, b: vh }, stageR)
    const cut = []
    if (clip.t < lim.t - 1) cut.push(`gora ${Math.round(lim.t - clip.t)}px`)
    if (clip.b > lim.b + 1) cut.push(`dol ${Math.round(clip.b - lim.b)}px`)
    if (clip.l < lim.l - 1) cut.push(`lewo ${Math.round(lim.l - clip.l)}px`)
    if (clip.r > lim.r + 1) cut.push(`prawo ${Math.round(clip.r - lim.r)}px`)
    if (cut.length) { probs.push({ el: label(e), why: 'uciety (' + cut.join(', ') + ')', rect: clip }); continue }
    // 2) przeciecie z paskami
    let hit = null
    for (const x of bars) {
      if (x === inBar || x.e.contains(e)) continue
      if (inBar && x.inner) continue // przyciski aktow i pasek postepu to jeden pasek
      const o = isect(clip, x.r)
      if (!empty(o)) { hit = `nachodzi na ${x.name} (${Math.round(o.r - o.l)}x${Math.round(o.b - o.t)}px)`; break }
    }
    // 3) elementFromPoint w 3 punktach (lewa-gora, srodek, prawa-dol, 2 px do wewnatrz)
    if (!hit) {
      const pts = [[clip.l + 2, clip.t + 2], [(clip.l + clip.r) / 2, (clip.t + clip.b) / 2], [clip.r - 2, clip.b - 2]]
      for (const [x, y] of pts) {
        const h = document.elementFromPoint(x, y)
        if (!h || e.contains(h) || h.contains(e)) continue
        for (let a = h; a && !a.contains(e); a = a.parentElement) {
          const pos = getComputedStyle(a).position
          if (pos === 'fixed' || pos === 'sticky' || a.matches('.nk-acts, .nk-bar')) { hit = `zasloniety w (${Math.round(x)},${Math.round(y)}) przez ${label(a).slice(0, 40)}`; break }
        }
        if (hit) break
      }
    }
    if (hit) probs.push({ el: label(e), why: hit, rect: clip })
  }
  return { probs, bars: bars.map((x) => x.name), checked }
}

const range = Math.max(1, geo.h - +H)
const N = Math.ceil(range / (geo.h * 0.02))
const positions = []
for (let i = 0; i <= N; i++) positions.push({ dir: 'dol', y: Math.round(geo.top + Math.min(range, i * geo.h * 0.02)) })
for (let i = N - 1; i >= 0; i--) positions.push({ dir: 'gora', y: Math.round(geo.top + Math.min(range, i * geo.h * 0.02) + geo.h * 0.005) })

let fail = 0, shotDone = false
const seen = new Map()
const barsSeen = new Set()
let checkedSum = 0
for (const pos of positions) {
  await p.evaluate((y) => scrollTo(0, y), pos.y)
  await p.waitForTimeout(wait)
  const r = await p.evaluate(scanAt, geo.sel)
  r.bars.forEach((x) => barsSeen.add(x))
  checkedSum += r.checked
  for (const pr of r.probs) {
    fail++
    const pct = (((pos.y - geo.top) / geo.h) * 100).toFixed(0)
    const key = pr.el + '|' + pr.why.replace(/\d+/g, '#')
    if (!seen.has(key)) seen.set(key, { ...pr, first: `${pos.dir} ${pct}% (scrollY ${pos.y})`, n: 0 })
    seen.get(key).n++
    if (shot && !shotDone) {
      shotDone = true
      await p.evaluate((rc) => {
        const d = document.createElement('div')
        d.id = '__svc'
        Object.assign(d.style, { position: 'fixed', left: rc.l + 'px', top: rc.t + 'px', width: rc.r - rc.l + 'px', height: rc.b - rc.t + 'px', outline: '3px solid magenta', zIndex: 99999, pointerEvents: 'none' })
        document.body.appendChild(d)
      }, pr.rect)
      await p.screenshot({ path: shot })
      await p.evaluate(() => document.getElementById('__svc')?.remove())
    }
  }
}
await b.close()
for (const v of seen.values()) console.log(`FAIL ${v.first} (x${v.n}): ${v.el} — ${v.why}`)
const verdict = fail ? 'FAIL' : 'PASS'
console.log(`paski widziane: ${[...barsSeen].join(' | ') || 'brak'}; sprawdzen elementow: ${checkedSum}`)
console.log(`SVC ${verdict} ${url} ${W}x${H}${cookies ? ' +cookies' : ''}: pozycji ${positions.length}, problemow ${fail} (unikalnych ${seen.size})${shotDone ? ', zrzut ' + shot : ''}`)
process.exit(fail ? 1 : 0)
