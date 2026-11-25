#!/usr/bin/env node
// R6' q4 A (spec 38, lekcja R31): bramka deklaracji CSS, ktore przegladarka po cichu odrzuca.
// Dlaczego: `.nk-ck-more{font:600 26px/1 inherit}` — `inherit` nie wolno uzyc wewnatrz skrotu `font`, wiec Chromium
// wyrzucil cala deklaracje (tekst wrocil do kroju i rozmiaru dziedziczonego). Zadna bramka tego nie zlapala, zlapal recenzent.
// Metoda: kazdy plik CSS parsuje postcss; KAZDA deklaracja jest ladowana do Chromium SAMODZIELNIE w neutralnej regule
// `x{prop:value}` (CSSStyleSheet.replaceSync) i musi dac rule.style.length > 0. Tak samo deskryptory @font-face
// (`@font-face{d:v}`), deklaracje klatek (`@keyframes k{0%{d:v}}`) i cale reguly @property. Dodatkowo selektor kazdej
// reguly: lista selektorow z jednym nieznanym elementem (np. `::-moz-range-thumb`) jest w Chromium odrzucana W CALOSCI,
// razem z pozostalymi selektorami z listy — to ten sam rodzaj cichego bledu (FAIL), a regula tylko dla innego silnika = INFO.
// Wlasciwosci niestandardowe (--x) sa zawsze poprawne. Wyjatki swiadome: lista ALLOW ponizej, kazdy z uzasadnieniem -> INFO.
// Deklaracje pod `@supports not (...)` (galaz dla innych silnikow) -> INFO, nie FAIL (w repo na dzis brak takich blokow).
// Zakres: pliki zrodlowe (to, co pisze czlowiek); build Next dodaje tylko prefiksy (autoprefixer) i rozwija `composes`.
// Uzycie: node scripts/css-dropped.mjs [pliki...]   (domyslnie app/**/*.css). Kod 0 = brak FAIL, 1 = FAIL, 2 = blad.
import chromiumExeMod from './chromium-exe.cjs'; const { chromiumExe } = chromiumExeMod
import { createRequire } from 'module'
import fs from 'fs'
import path from 'path'
const require = createRequire(import.meta.url)
const postcss = require('postcss')
const fg = require('fast-glob')
const { chromium } = require('playwright')

// Swiadome wyjatki: deklaracje, ktorych Chromium nie zna, a ktore sa poprawne w swoim kontekscie.
const ALLOW = [
  { test: (d) => d.prop === 'composes' && /\.module\.css$/.test(d.file),
    reason: 'CSS Modules: `composes` rozwija kompilator Next, do przegladarki nie trafia' },
  { test: (d) => /^-moz-/.test(d.prop), reason: 'wlasciwosc tylko dla Gecko (Firefox), Chromium jej nie zna z zalozenia' },
  { test: (d) => /^-ms-/.test(d.prop), reason: 'wlasciwosc tylko dla starego Edge/IE' },
]
// Selektory tylko dla innych silnikow: regula odrzucona w Chromium, ale z zamiarem (INFO), gdy KAZDY selektor listy pasuje.
const OTHER_ENGINE_SEL = /::?-(moz|ms)-[a-z-]+/

const args = process.argv.slice(2)
const files = args.length ? args : fg.sync('app/**/*.css', { dot: false }).sort()
if (!files.length) { console.error('brak plikow CSS'); process.exit(2) }

// --- zbieranie przypadkow testowych ---
const cases = []   // {kind, css, file, line, where, text, supportsNot}
const selCases = [] // {sel, parts, file, line}
const ancestorAt = (n, name) => { for (let p = n.parent; p; p = p.parent) if (p.type === 'atrule' && p.name.toLowerCase() === name) return p; return null }
const supportsNot = (n) => { for (let p = n.parent; p; p = p.parent) if (p.type === 'atrule' && p.name.toLowerCase() === 'supports' && /^\s*not\b/i.test(p.params)) return true; return false }

for (const file of files) {
  let root
  try { root = postcss.parse(fs.readFileSync(file, 'utf8'), { from: file }) }
  catch (e) { console.error(`BLAD parsowania ${file}: ${e.message}`); process.exit(2) }
  const rel = path.relative(process.cwd(), path.resolve(file))
  root.walkRules((r) => {
    if (ancestorAt(r, 'keyframes') || /keyframes$/i.test(r.parent?.name || '')) return
    // Zagniezdzone reguly z `&` testujemy w kontekscie rodzica (CSS Nesting jest w Chromium natywny).
    let sel = r.selector
    if (r.parent?.type === 'rule') sel = `${r.parent.selector}{${sel}{}}`
    else sel = `${sel}{}`
    selCases.push({ css: sel, raw: r.selector, file: rel, line: r.source?.start?.line ?? 0, nested: r.parent?.type === 'rule' })
  })
  root.walkDecls((d) => {
    const text = `${d.prop}:${d.value}${d.important ? ' !important' : ''}`
    const base = { file: rel, line: d.source?.start?.line ?? 0, prop: d.prop, text, supportsNot: supportsNot(d) }
    const p = d.parent
    if (d.prop.startsWith('--')) return // wlasciwosc niestandardowa: zawsze poprawna skladniowo
    if (p.type === 'atrule' && p.name.toLowerCase() === 'font-face') {
      cases.push({ ...base, kind: 'font-face', where: '@font-face', css: `@font-face{${text}}` })
    } else if (p.type === 'atrule' && p.name.toLowerCase() === 'property') {
      // cala regula @property testowana osobno nizej (deskryptory nie maja CSSStyleDeclaration)
    } else if (p.type === 'rule' && ancestorAt(d, 'keyframes')) {
      cases.push({ ...base, kind: 'keyframe', where: `@keyframes ${ancestorAt(d, 'keyframes').params} ${p.selector}`, css: `@keyframes k{0%{${text}}}` })
    } else if (p.type === 'rule') {
      cases.push({ ...base, kind: 'style', where: p.selector.replace(/\s+/g, ' ').slice(0, 90), css: `x{${text}}` })
    } else {
      cases.push({ ...base, kind: 'style', where: `@${p.name || '?'} (deklaracja poza regula)`, css: `x{${text}}` })
    }
  })
  root.walkAtRules('property', (a) => {
    cases.push({ file: rel, line: a.source?.start?.line ?? 0, prop: '@property', text: a.toString().replace(/\s+/g, ' '),
      kind: 'property', where: `@property ${a.params}`, css: a.toString(), supportsNot: supportsNot(a) })
  })
}

// --- Chromium ---
const exe = chromiumExe()
const b = await chromium.launch(exe ? { executablePath: exe } : {})
const page = await b.newPage()
await page.setContent('<!doctype html><title>css-dropped</title>')
const res = await page.evaluate(({ cases, selCases }) => {
  const sheet = (css) => { const s = new CSSStyleSheet(); try { s.replaceSync(css) } catch (e) { return null } return s }
  const decl = cases.map((c) => {
    const s = sheet(c.css); if (!s || !s.cssRules.length) return false
    const r = s.cssRules[0]
    if (c.kind === 'style' || c.kind === 'font-face') return r.style.length > 0
    if (c.kind === 'keyframe') return !!(r.cssRules && r.cssRules[0] && r.cssRules[0].style.length > 0)
    if (c.kind === 'property') return r.constructor.name === 'CSSPropertyRule'
    return false
  })
  const sel = selCases.map((c) => {
    const s = sheet(c.css); if (!s || !s.cssRules.length) return false
    if (!c.nested) return true
    const r = s.cssRules[0]; return !!(r.cssRules && r.cssRules.length)
  })
  // Dla odrzuconych list selektorow: ktore elementy listy sa nieznane
  const parts = selCases.map((c, i) => sel[i] ? null : c.raw.split(/,(?![^()]*\))/).map((p) => p.trim()).filter((p) => { const s = sheet(`${p}{}`); return !s || !s.cssRules.length }))
  return { decl, sel, parts }
}, { cases, selCases })
await b.close()

let fail = 0, info = 0
const out = []
cases.forEach((c, i) => {
  if (res.decl[i]) return
  const allow = ALLOW.find((a) => a.test(c))
  if (allow) { info++; out.push(`INFO ${c.file}:${c.line}  ${c.where}  { ${c.text} }  — wyjatek: ${allow.reason}`); return }
  if (c.supportsNot) { info++; out.push(`INFO ${c.file}:${c.line}  ${c.where}  { ${c.text} }  — pod @supports not (...), galaz dla innego silnika`); return }
  fail++; out.push(`FAIL ${c.file}:${c.line}  ${c.where}  { ${c.text} }  — Chromium odrzuca te deklaracje (rule.style puste)`)
})
selCases.forEach((c, i) => {
  if (res.sel[i]) return
  const bad = res.parts[i] || []
  const list = c.raw.split(/,(?![^()]*\))/).map((p) => p.trim())
  const short = c.raw.replace(/\s+/g, ' ').slice(0, 120)
  if (bad.length && bad.every((p) => OTHER_ENGINE_SEL.test(p)) && bad.length === list.length) {
    info++; out.push(`INFO ${c.file}:${c.line}  selektor ${short}  — regula tylko dla innego silnika (${bad.join(', ')}), w Chromium pominieta z zamiarem`)
  } else if (bad.length && bad.every((p) => OTHER_ENGINE_SEL.test(p))) {
    fail++; out.push(`FAIL ${c.file}:${c.line}  selektor ${short}  — nieznany w Chromium ${bad.join(', ')} uniewaznia CALA liste, wiec Chromium odrzuca tez: ${list.filter((p) => !bad.includes(p)).join(', ')} (rozdziel na osobne reguly)`)
  } else {
    fail++; out.push(`FAIL ${c.file}:${c.line}  selektor ${short}  — Chromium odrzuca regule (nieznane: ${bad.join(', ') || 'cala lista'})`)
  }
})
for (const l of out) console.log(l)
console.log(`CSSDROPPED fail=${fail} info=${info} deklaracji=${cases.length} regul=${selCases.length} plikow=${files.length}`)
process.exit(fail ? 1 : 0)
