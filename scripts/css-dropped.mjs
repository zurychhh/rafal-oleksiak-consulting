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
// R6' q5 B (spec 39, recenzja 46 Drobne 3): (a) wartosci z var() — Chromium przyjmuje KAZDA deklaracje z var() przy
// parsowaniu (sprawdza dopiero przy obliczaniu), wiec bez podstawienia bramka byla slepa. Teraz: var(--x, zapas) -> zapas,
// var(--x) -> kazda definicja --x z badanych plikow albo zastepczo `0` / `#000`; jesli ZADNE podstawienie nie daje
// poprawnej deklaracji -> INFO (nie FAIL: --x moze ustawiac JS albo styl inline). (b) :is()/:where() to listy
// „wybaczajace”: Chromium po cichu wyrzuca z nich niepoprawny argument i zostawia regule — pseudoelement (::-moz-..., ::x)
// w :is/:where nigdy nie pasuje w zadnym silniku (Selectors 4: pseudoelementy niedozwolone w :is) -> FAIL.
// (c) :global(x) / :local(x) / `:global .x` w *.module.css odwijane przed sprawdzeniem (skladnia CSS Modules, nie CSS).
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

// --- pomocnicze: nawiasy zrownowazone ---
// fnArgs(str, name) -> [{start, end, inner}] dla kazdego wystapienia `name(` ... `)` (end = indeks za `)`).
function fnCalls(str, re) {
  const out = []; let m; re.lastIndex = 0
  while ((m = re.exec(str))) {
    let depth = 1, i = m.index + m[0].length
    for (; i < str.length && depth; i++) { if (str[i] === '(') depth++; else if (str[i] === ')') depth-- }
    out.push({ start: m.index, end: i, open: m.index + m[0].length, inner: str.slice(m.index + m[0].length, i - 1), name: m[1] })
    re.lastIndex = i
  }
  return out
}
// splitTop(str) -> argumenty rozdzielone przecinkami na poziomie 0
function splitTop(str) {
  const out = []; let depth = 0, cur = ''
  for (const ch of str) {
    if (ch === '(' || ch === '[') depth++; else if (ch === ')' || ch === ']') depth--
    if (ch === ',' && depth === 0) { out.push(cur); cur = '' } else cur += ch
  }
  out.push(cur); return out.map((x) => x.trim())
}
// (c) CSS Modules: :global(x) / :local(x) -> x, `:global .x` / `:local .x` -> `.x`
function unwrapModules(sel) {
  let prev
  do {
    prev = sel
    const calls = fnCalls(sel, /:(global|local)\(/g)
    for (const c of calls.reverse()) sel = sel.slice(0, c.start) + c.inner + sel.slice(c.end)
  } while (sel !== prev)
  return sel.replace(/:(global|local)(?![\w(-])\s*/g, '').trim()
}
// (b) pseudoelementy wewnatrz :is()/:where() (takze zagniezdzonych)
function pseudoInForgiving(sel) {
  const bad = []
  for (const c of fnCalls(sel, /:(is|where)\(/g)) {
    for (const a of splitTop(c.inner)) if (/::[a-z-]/i.test(a) || /:-(moz|ms)-[a-z-]*(placeholder|selection)\b/i.test(a)) bad.push(`:${c.name}(… ${a} …)`)
  }
  return bad
}
// (a) var(): warianty wartosci po podstawieniu. defs = Map(--x -> [wartosci]).
const VAR_PLACEHOLDERS = ['0', '#000', '1']
const MAX_VARIANTS = 48
// Licznik `depth` rosnie TYLKO przy podstawianiu definicji zmiennej (zagniezdzenie var() w wartosci zmiennej),
// nie przy przechodzeniu do kolejnego var() w tej samej wartosci. Liczba wariantow ograniczona MAX_VARIANTS
// (opcje: zapas, definicje, zastepcze — w tej kolejnosci, wiec pierwszy wariant uzywa definicji); po przekroczeniu
// limitu moze zabraknac poprawnego wariantu -> INFO (nie FAIL).
function varVariants(value, defs, depth = 0) {
  const calls = fnCalls(value, /\bvar\(/gi)
  if (!calls.length) return [value]
  if (depth > 4) return []
  const c = calls[0]
  const args = splitTop(c.inner)
  const name = args[0]
  const fb = c.inner.includes(',') ? c.inner.slice(c.inner.indexOf(',') + 1).trim() : null
  let opts = []
  if (fb !== null) opts.push(fb)
  for (const d of defs.get(name) || []) opts.push(d)
  opts.push(...VAR_PLACEHOLDERS)
  opts = [...new Set(opts)]
  const out = new Set()
  for (const o of opts) {
    for (const sub of varVariants(o, defs, depth + 1)) {
      // `sub` nie zawiera juz var(); reszta wartosci to ten sam poziom zagniezdzenia
      // identyczne wywolania var() (ta sama nazwa i zapas) dostaja to samo podstawienie — bez tego n powtorzen
      // tej samej zmiennej daje wykladnicza liczbe wariantow i limit odcina poprawny
      let next = ''; let pos = 0
      for (const k of calls) if (k.inner === c.inner) { next += value.slice(pos, k.start) + sub; pos = k.end }
      next += value.slice(pos)
      for (const rest of varVariants(next, defs, depth)) {
        out.add(rest); if (out.size >= MAX_VARIANTS) return [...out]
      }
    }
  }
  return [...out]
}

const args = process.argv.slice(2)
const files = args.length ? args : fg.sync('app/**/*.css', { dot: false }).sort()
if (!files.length) { console.error('brak plikow CSS'); process.exit(2) }

// --- zbieranie przypadkow testowych ---
const cases = []   // {kind, css, file, line, where, text, supportsNot}
const mediaCases = [] // {file, line, params} — @media; kazdy nawias-cecha musi dac matches albo not-matches
const selCases = [] // {sel, parts, file, line}
const ancestorAt = (n, name) => { for (let p = n.parent; p; p = p.parent) if (p.type === 'atrule' && p.name.toLowerCase() === name) return p; return null }
const supportsNot = (n) => { for (let p = n.parent; p; p = p.parent) if (p.type === 'atrule' && p.name.toLowerCase() === 'supports' && /^\s*not\b/i.test(p.params)) return true; return false }

// Pierwszy przebieg: definicje wlasciwosci niestandardowych (--x: wartosc) ze wszystkich badanych plikow — do podstawien var().
const roots = []
const defs = new Map()
for (const file of files) {
  let root
  try { root = postcss.parse(fs.readFileSync(file, 'utf8'), { from: file }) }
  catch (e) { console.error(`BLAD parsowania ${file}: ${e.message}`); process.exit(2) }
  roots.push([file, root])
  root.walkDecls(/^--/, (d) => { const v = d.value.trim(); if (!v) return; if (!defs.has(d.prop)) defs.set(d.prop, []); const a = defs.get(d.prop); if (!a.includes(v) && a.length < 12) a.push(v) })
}

for (const [file, root] of roots) {
  const rel = path.relative(process.cwd(), path.resolve(file))
  const isModule = /\.module\.css$/.test(file)
  root.walkRules((r) => {
    if (ancestorAt(r, 'keyframes') || /keyframes$/i.test(r.parent?.name || '')) return
    // Zagniezdzone reguly z `&` testujemy w kontekscie rodzica (CSS Nesting jest w Chromium natywny).
    const fix = (x) => (isModule ? unwrapModules(x) : x)
    const raw = fix(r.selector)
    let sel = raw
    if (r.parent?.type === 'rule') sel = `${fix(r.parent.selector)}{${sel}{}}`
    else sel = `${sel}{}`
    selCases.push({ css: sel, raw, file: rel, line: r.source?.start?.line ?? 0, nested: r.parent?.type === 'rule', forgivingBad: pseudoInForgiving(raw) })
  })
  root.walkDecls((d) => {
    const imp = d.important ? ' !important' : ''
    const text = `${d.prop}:${d.value}${imp}`
    // (a) var(): warianty po podstawieniu; deklaracja jest poprawna, gdy KTORYKOLWIEK wariant jest poprawny.
    const hasVar = /\bvar\(/i.test(d.value)
    const variants = hasVar ? varVariants(d.value, defs).map((v) => `${d.prop}:${v}${imp}`) : null
    const base = { file: rel, line: d.source?.start?.line ?? 0, prop: d.prop, text, supportsNot: supportsNot(d), variants }
    const p = d.parent
    if (d.prop.startsWith('--')) return // wlasciwosc niestandardowa: zawsze poprawna skladniowo
    if (p.type === 'atrule' && p.name.toLowerCase() === 'font-face') {
      cases.push({ ...base, kind: 'font-face', where: '@font-face', wrap: ['@font-face{', '}'], css: `@font-face{${text}}` })
    } else if (p.type === 'atrule' && p.name.toLowerCase() === 'property') {
      // cala regula @property testowana osobno nizej (deskryptory nie maja CSSStyleDeclaration)
    } else if (p.type === 'rule' && ancestorAt(d, 'keyframes')) {
      cases.push({ ...base, kind: 'keyframe', where: `@keyframes ${ancestorAt(d, 'keyframes').params} ${p.selector}`, wrap: ['@keyframes k{0%{', '}}'], css: `@keyframes k{0%{${text}}}` })
    } else if (p.type === 'rule') {
      cases.push({ ...base, kind: 'style', where: p.selector.replace(/\s+/g, ' ').slice(0, 90), wrap: ['x{', '}'], css: `x{${text}}` })
    } else {
      cases.push({ ...base, kind: 'style', where: `@${p.name || '?'} (deklaracja poza regula)`, wrap: ['x{', '}'], css: `x{${text}}` })
    }
  })
  root.walkAtRules('property', (a) => {
    cases.push({ file: rel, line: a.source?.start?.line ?? 0, prop: '@property', text: a.toString().replace(/\s+/g, ' '),
      kind: 'property', where: `@property ${a.params}`, css: a.toString(), supportsNot: supportsNot(a) })
  })
  // R6' q4 (recenzja 46, nauka: Media Queries 3 §3.1 — zle sformulowane zapytanie = "not all", caly blok martwy po cichu)
  root.walkAtRules('media', (a) => {
    mediaCases.push({ file: rel, line: a.source?.start?.line ?? 0, params: a.params })
  })
}

// --- Chromium ---
const exe = chromiumExe()
const b = await chromium.launch(exe ? { executablePath: exe } : {})
const page = await b.newPage()
await page.setContent('<!doctype html><title>css-dropped</title>')
const res = await page.evaluate(({ cases, selCases, mediaCases }) => {
  const sheet = (css) => { const s = new CSSStyleSheet(); try { s.replaceSync(css) } catch (e) { return null } return s }
  const ok1 = (c, css) => {
    const s = sheet(css); if (!s || !s.cssRules.length) return false
    const r = s.cssRules[0]
    if (c.kind === 'style' || c.kind === 'font-face') return r.style.length > 0
    if (c.kind === 'keyframe') return !!(r.cssRules && r.cssRules[0] && r.cssRules[0].style.length > 0)
    if (c.kind === 'property') return r.constructor.name === 'CSSPropertyRule'
    return false
  }
  // true / false / 'var' (z var(): zaden wariant po podstawieniu nie jest poprawny — INFO, nie FAIL)
  const decl = cases.map((c) => {
    if (!ok1(c, c.css)) return false
    if (!c.variants || !c.wrap) return true
    const hit = c.variants.find((v) => ok1(c, c.wrap[0] + v + c.wrap[1]))
    return hit ? true : 'var'
  })
  const sel = selCases.map((c) => {
    const s = sheet(c.css); if (!s || !s.cssRules.length) return false
    if (!c.nested) return true
    const r = s.cssRules[0]; return !!(r.cssRules && r.cssRules.length)
  })
  // Dla odrzuconych list selektorow: ktore elementy listy sa nieznane
  const parts = selCases.map((c, i) => sel[i] ? null : c.raw.split(/,(?![^()]*\))/).map((p) => p.trim()).filter((p) => { const s = sheet(`${p}{}`); return !s || !s.cssRules.length }))
  const media = mediaCases.map((c) => {
    // MQ4: nieznana/zla cecha = <general-enclosed> = "unknown" -> ani (f), ani not (f) nie pasuje
    const leaves = c.params.match(/\([^()]*\)/g) || []
    return leaves.every((f) => window.matchMedia(f).matches !== window.matchMedia(`not ${f}`).matches)
  })
  return { decl, sel, parts, media }
}, { cases, selCases, mediaCases })
await b.close()

let fail = 0, info = 0
const out = []
cases.forEach((c, i) => {
  if (res.decl[i] === true) return
  if (res.decl[i] === 'var') {
    info++; out.push(`INFO ${c.file}:${c.line}  ${c.where}  { ${c.text} }  — z var(): zadne podstawienie (zapas, definicje z plikow, ${VAR_PLACEHOLDERS.join(' / ')}) nie daje poprawnej deklaracji; sprawdz, czy wartosc zmiennej pasuje do ${c.prop}`); return
  }
  const allow = ALLOW.find((a) => a.test(c))
  if (allow) { info++; out.push(`INFO ${c.file}:${c.line}  ${c.where}  { ${c.text} }  — wyjatek: ${allow.reason}`); return }
  if (c.supportsNot) { info++; out.push(`INFO ${c.file}:${c.line}  ${c.where}  { ${c.text} }  — pod @supports not (...), galaz dla innego silnika`); return }
  fail++; out.push(`FAIL ${c.file}:${c.line}  ${c.where}  { ${c.text} }  — Chromium odrzuca te deklaracje (rule.style puste)`)
})
selCases.forEach((c, i) => {
  if (c.forgivingBad.length) {
    // jedna linia na selektor: gdy Chromium odrzuca tez cala regule, dopisujemy to do tej samej linii
    const whole = res.sel[i] ? '' : '; ponadto Chromium odrzuca CALA regule (nieznane: ' + ((res.parts[i] || []).join(', ') || 'cala lista') + ')'
    fail++; out.push(`FAIL ${c.file}:${c.line}  selektor ${c.raw.replace(/\s+/g, ' ').slice(0, 120)}  — pseudoelement w liscie „wybaczajacej” ${c.forgivingBad.join('; ')}: Chromium po cichu wyrzuca ten argument (regula zostaje bez niego), a pseudoelementy w :is/:where nie pasuja w zadnym silniku (rozdziel na osobna regule)${whole}`)
    return
  }
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
mediaCases.forEach((c, i) => {
  if (res.media[i]) return
  fail++; out.push(`FAIL ${c.file}:${c.line}  @media ${c.params}  — cecha nieznana dla Chromium (np. liczba bez jednostki) = "unknown"; caly blok nigdy nie dziala`)
})
for (const l of out) console.log(l)
console.log(`CSSDROPPED fail=${fail} info=${info} deklaracji=${cases.length} regul=${selCases.length} plikow=${files.length}`)
process.exit(fail ? 1 : 0)
