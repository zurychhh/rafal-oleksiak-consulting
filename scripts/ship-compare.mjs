#!/usr/bin/env node
/**
 * Porownuje style OBLICZONE przez przegladarke: strona glowna w aplikacji
 * (http://localhost:3000/) kontra bundle Claude Design otwarty z dysku
 * (design/production/claude-design-bundle.html — dokladnie to, co widac
 * w Claude Design, z odznaka i bez naszych poprawek).
 *
 * Po co, skoro jest build, tsc, lint i qa.js: zaden z nich nie zauwazy, ze
 * naglowek renderuje sie Poppinsem z critical.css zamiast Instrument Sans albo
 * ze sekcja dostala 120 px paddingu z globals.css. Style starej strony leza
 * w layoucie i przeciekaja na kazda trase — to porownanie je lapie.
 *
 * Porownanie idzie element po elemencie w kolejnosci dokumentu pod #dc-root,
 * na 1440 i 390, bez przewijania (stan startowy). Oczekiwane roznice tresci
 * („Rafal" → „Rafał", elementy dolozone przez ship-design) sa normalizowane.
 *
 *   node scripts/ship-compare.mjs            # wymaga dzialajacego serwera
 *   SHIP_URL=http://localhost:3001 node scripts/ship-compare.mjs
 *   node scripts/ship-compare.mjs --route cv   # trasa z ship-design --route
 *
 * Stara wersja dla „The Audit" zyje w scripts/ship-compare-audit.mjs.
 */
import { chromium } from 'playwright'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

// --route <nazwa>: ta sama trasa co w ship-design (app/<nazwa>, design/production/<nazwa>-bundle.html).
const ri = process.argv.indexOf('--route')
const ROUTE = ri > 0 ? process.argv[ri + 1] : ''
const BASE = (process.env.SHIP_URL || 'http://localhost:3000/').replace(/\/?$/, '/')
const URL_APP = ROUTE ? BASE + ROUTE : BASE
if (/oleksiakconsulting\.com/.test(URL_APP)) { console.error('Porownanie idzie lokalnie, nie na produkcji.'); process.exit(1) }
const SRC = resolve(ROUTE ? `design/production/${ROUTE}-bundle.html` : 'design/production/claude-design-bundle.html')
if (!existsSync(SRC)) { console.error('Brak zrodla: ' + SRC); process.exit(1) }

const PROPS = ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'textTransform',
  'color', 'backgroundColor', 'marginTop', 'marginBottom', 'paddingTop', 'paddingRight', 'paddingBottom',
  'paddingLeft', 'borderTopWidth', 'borderBottomWidth', 'display', 'position', 'gridTemplateColumns',
  'overflowX', 'transform', 'width', 'height']

async function grab(browser, url, vp) {
  const page = await browser.newPage({ viewport: vp, reducedMotion: 'reduce' })
  await page.addInitScript(() => { try { localStorage.setItem('cookie-consent', 'declined') } catch { /* */ } })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForSelector('#dc-root', { timeout: 20000 })
  await page.waitForTimeout(1500)
  const out = await page.evaluate((props) => {
    const root = document.getElementById('dc-root')
    // Elementy dolozone przez ship-design (link do /tool, brakujace pozycje stopki)
    // nie istnieja w zrodle. Zdejmujemy je (reguly :has w design-reset gasna same), zeby
    // reszta strony porownywala sie 1:1; ich obecnosc pilnuje content-rules.
    root.querySelectorAll('[data-ship-added]').forEach((el) => el.remove())
    const rows = []
    for (const el of root.querySelectorAll('*')) {
      if (el.closest('[data-lead-error]')) continue
      // Kontener runtime'u (.sc-host) nie jest czescia projektu: w bundlu ma
      // height:100% okna i krój domyslny przegladarki, u nas dziedziczy z body.
      // Jesli ktorys potomek dziedziczylby z niego krój albo kolor, roznica
      // wyjdzie na tym potomku — wiec pominiecie nie chowa bledu.
      if (el.parentElement === root && el.classList.contains('sc-host')) continue
      if (el.closest('svg') && el.tagName.toLowerCase() !== 'svg') continue
      const cs = getComputedStyle(el)
      const o = { tag: el.tagName.toLowerCase(), text: '' }
      if (![...el.children].length) o.text = el.textContent.replace(/\s+/g, ' ').trim().replace(/\bRafal\b/g, 'Rafał')
      for (const p of props) o[p] = cs[p]
      // Szerokosc/wysokosc zaokraglamy: subpiksele roznia sie miedzy hostami.
      const r = el.getBoundingClientRect()
      o.width = Math.round(r.width) + 'px'; o.height = Math.round(r.height) + 'px'
      rows.push(o)
    }
    return { rows, scrollHeight: document.documentElement.scrollHeight }
  }, PROPS)
  await page.close()
  return out
}

const pinned = process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const browser = await chromium.launch(existsSync(pinned) ? { executablePath: pinned } : {})
let bad = 0
for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  const [app, src] = await Promise.all([grab(browser, URL_APP, vp), grab(browser, pathToFileURL(SRC).href, vp)])
  const tag = `${vp.width}×${vp.height}`
  const diffs = []
  if (app.rows.length !== src.rows.length) {
    diffs.push(`liczba elementow: aplikacja ${app.rows.length}, zrodlo ${src.rows.length}`)
  }
  const n = Math.min(app.rows.length, src.rows.length)
  for (let i = 0; i < n; i++) {
    const a = app.rows[i], s = src.rows[i]
    if (a.tag !== s.tag) { diffs.push(`#${i} znacznik ${a.tag} ≠ ${s.tag} — drzewo sie rozjechalo, dalej nie porownuje`); break }
    if (a.text !== s.text) diffs.push(`#${i} <${a.tag}> tresc „${a.text.slice(0, 50)}" ≠ „${s.text.slice(0, 50)}"`)
    for (const p of PROPS) if (a[p] !== s[p]) diffs.push(`#${i} <${a.tag}> „${(a.text || '').slice(0, 24)}" ${p}: ${a[p]} ≠ ${s[p]}`)
  }
  if (Math.abs(app.scrollHeight - src.scrollHeight) > 2) diffs.push(`wysokosc strony: ${app.scrollHeight} ≠ ${src.scrollHeight}`)
  if (diffs.length) {
    bad += diffs.length
    console.log(`[${tag}] ${diffs.length} roznic(a):`)
    for (const d of diffs.slice(0, 40)) console.log('  · ' + d)
  } else {
    console.log(`[${tag}] ${n} elementow, style obliczone i tresc zgodne ze zrodlem`)
  }
}
await browser.close()
if (bad) { console.log('\nFAIL — strona w aplikacji rozni sie od zrodla z Claude Design'); process.exitCode = 1 }
else console.log('\nPASS — strona w aplikacji = zrodlo z Claude Design')
