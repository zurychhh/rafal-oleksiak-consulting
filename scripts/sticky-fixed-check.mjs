#!/usr/bin/env node
import chromiumExeMod from './chromium-exe.cjs'; const { chromiumExe } = chromiumExeMod
// R6' p8 (reguła R36.2, spec 42): element position:fixed × przypięta scena po ruchu kółkiem W GÓRĘ — na każdej trasie.
// R36: pasek rozdziałów /nawyko wjeżdża tylko przy ruchu w górę i przecinał nagłówek przypiętego kokpitu; bramki przewijały
// wyłącznie w dół. Ten test uogólnia cockpit-pin na każdą przypiętą scenę (position:sticky wyższy niż pół okna):
// przejazd kółkiem przez tor sceny, na każdym kroku ruch w górę o 120 px, i sprawdzenie, czy jakikolwiek widoczny
// element position:fixed spoza sceny przykrywa tekst sceny przy jej górnej krawędzi (nagłówki, nazwy aktów, zakładki).
// Zgoda cookies zapisana (dolny pasek to osobna bramka: short-viewport-check). navigator.webdriver = false (R14).
// Użycie: node scripts/sticky-fixed-check.mjs <url> [WxH ...]   Kod 1 = FAIL, 2 = błąd użycia. Tylko localhost.
// Ostatnia linia: STICKYFIXED PASS|FAIL kroki=<n> trafienia=<n>
import { chromium } from 'playwright'

const args = process.argv.slice(2)
const url = args[0]
if (!url || !/^http:\/\/(localhost|127\.0\.0\.1)[:/]/.test(url)) { console.error('podaj URL localhost'); process.exit(2) }
const vps = (args.slice(1).length ? args.slice(1) : ['1440x900', '1280x720', '1100x620', '390x844'])
  .map((s) => s.split('x').map(Number))
const exe = chromiumExe()
const b = await chromium.launch(exe ? { executablePath: exe } : {})
let steps = 0, hitsAll = 0

// W przeglądarce: lista przypiętych scen (sticky, wyższe niż pół okna) z ich torem (rodzic) w px dokumentu
const scenesFn = () => {
  const out = []
  document.querySelectorAll('body *').forEach((e, i) => {
    const cs = getComputedStyle(e)
    if (cs.position !== 'sticky') return
    const r = e.getBoundingClientRect()
    if (r.height < innerHeight * 0.5) return
    const par = e.parentElement.getBoundingClientRect()
    if (par.height < r.height + 100) return // brak toru = nic się nie przypina
    e.setAttribute('data-sfc', String(i))
    out.push({ id: String(i), name: (e.className.toString().split(' ')[0] || e.tagName), top: par.top + scrollY, bottom: par.bottom + scrollY })
  })
  return out
}
// W przeglądarce: czy scena jest przypięta, a jeśli tak — które elementy fixed przykrywają tekst przy jej górze
const coverFn = (id) => {
  const s = document.querySelector(`[data-sfc="${id}"]`)
  const cs = getComputedStyle(s)
  const r = s.getBoundingClientRect()
  const stuckTop = parseFloat(cs.top) || 0
  // przypieta (top == wartosc sticky) albo odjezdzajaca w gore przy koncu toru (recenzja 50 I1: tam pasek wracal na tekst)
  const stuck = Math.abs(r.top - stuckTop) <= 3
  // tylko pierwsze 120 px odjazdu: dalej to zwykly ruch tresci pod paskiem, nie przypieta scena
  const leaving = r.top < stuckTop - 3 && r.top > stuckTop - 120 && r.bottom > 0
  if (!stuck && !leaving) return { stuck: false, hits: [], n: 0 }
  const band = Math.min(innerHeight * 0.35, 260)
  const tgt = []
  const tw = document.createTreeWalker(s, NodeFilter.SHOW_TEXT)
  while (tw.nextNode()) {
    const n = tw.currentNode
    if (!n.textContent.trim()) continue
    const el = n.parentElement
    const ecs = getComputedStyle(el)
    if (ecs.visibility === 'hidden' || +ecs.opacity === 0) continue
    // recenzja 50 I2: tekst makiety telefonu tez (pasek na nazwie marki w telefonie sceny = dawny blad W2); bez .sr-only/[hidden]
    if (el.closest('.sr-only, [hidden]')) continue
    const rg = document.createRange(); rg.selectNodeContents(n)
    for (const q of rg.getClientRects()) {
      if (q.width < 2 || q.height < 2 || q.bottom <= 0 || q.top > band) continue
      tgt.push({ q, t: n.textContent.trim().slice(0, 40) })
    }
  }
  const hits = [], vis = []
  for (const e of document.querySelectorAll('body *')) {
    if (s.contains(e) || e.contains(s)) continue
    const fcs = getComputedStyle(e)
    if (fcs.position !== 'fixed' || fcs.visibility === 'hidden' || fcs.display === 'none' || +fcs.opacity < 0.05) continue
    if (fcs.pointerEvents === 'none' && (fcs.backgroundColor === 'rgba(0, 0, 0, 0)' || fcs.backgroundColor === 'transparent') && !e.textContent.trim()) continue
    const q = e.getBoundingClientRect()
    if (q.width < 2 || q.height < 2 || q.bottom <= 0 || q.top >= innerHeight) continue
    vis.push(e.className.toString().split(' ')[0] || e.tagName)
    for (const { q: T, t } of tgt) {
      const ox = Math.min(q.right, T.right) - Math.max(q.left, T.left)
      const oy = Math.min(q.bottom, T.bottom) - Math.max(q.top, T.top)
      if (ox > 1 && oy > 1) { hits.push({ name: e.className.toString().split(' ')[0] || e.tagName, s: `${stuck ? 'P' : 'O'}:${e.className.toString().split(' ')[0] || e.tagName}@${Math.round(q.bottom)}×"${t}"` }); break }
    }
  }
  return { stuck, hits, n: tgt.length, vis }
}

for (const [W, H] of vps) {
  const ctx = await b.newContext({ viewport: { width: W, height: H } })
  await ctx.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false })
    try { localStorage.setItem('cookie-consent', 'declined') } catch {}
  })
  const p = await ctx.newPage()
  await p.goto(url, { waitUntil: 'load' })
  await p.waitForTimeout(1200)
  const scenes = await p.evaluate(scenesFn)
  const res = []
  for (const sc of scenes) {
    const hits = []; let stuckSeen = 0, tested = 0; const coexist = new Set()
    const stride = Math.max(200, Math.round(H * 0.45))
    // tor co ~0,45 okna + koniec toru co 40 px (scena odjezdza w gore — recenzja 50 I1, jak endzone w cockpit-pin)
    const ys = []
    for (let y = sc.top - 40; y < sc.bottom - H; y += stride) ys.push(y)
    for (let k = 0; k <= 10; k++) ys.push(Math.round(sc.bottom - H - 160 + k * 40))
    for (const y of ys) {
      await p.evaluate((yy) => scrollTo(0, yy), y + 160)
      await p.waitForTimeout(250)
      await p.mouse.move(W / 2, H / 2)
      await p.mouse.wheel(0, -120)
      await p.waitForTimeout(700)
      const r = await p.evaluate(coverFn, sc.id)
      steps++
      if (r.stuck) { stuckSeen++; r.vis.forEach((v) => coexist.add(v)) }
      tested += r.n
      // odjazd sceny: FAIL tylko dla elementu, ktory w przypietej scenie USTEPOWAL (wraca za wczesnie — recenzja 49/50 I1);
      // element obecny przez cala przypieta scene (pasek w trybie data-pin na >= 1100 px) przy odjezdzie to zwykly ruch tresci
      const bad = r.hits.filter((h) => r.stuck || !coexist.has(h.name))
      if (bad.length) {
        hits.push(`y${y}:${bad.map((h) => h.s).join('+')}`)
        if (process.env.SFC_SHOTS) await p.screenshot({ path: `${process.env.SFC_SHOTS}/sfc-${W}x${H}-${sc.name}-${y}.png` })
      }
    }
    // recenzja 50 I2: przypieta scena bez ani jednego sprawdzonego tekstu = NIETESTOWANE (FAIL), nie ciche „ok”
    if (stuckSeen === 0 || tested === 0) hits.push(`NIETESTOWANE(przypieta=${stuckSeen},teksty=${tested})`)
    hitsAll += hits.length
    res.push(`${sc.name}[przypieta w ${stuckSeen} krokach, ${tested} tekstow]:${hits.length ? 'FAIL(' + hits.slice(0, 4).join(' | ') + (hits.length > 4 ? ` …+${hits.length - 4}` : '') + ')' : 'ok'}`)
  }
  console.log(`${W}x${H} sceny=${scenes.length} ${res.join(' ') || '(brak przypietych scen)'}`)
  await ctx.close()
}
await b.close()
console.log(`STICKYFIXED ${hitsAll ? 'FAIL' : 'PASS'} kroki=${steps} trafienia=${hitsAll}`)
process.exit(hitsAll ? 1 : 0)
