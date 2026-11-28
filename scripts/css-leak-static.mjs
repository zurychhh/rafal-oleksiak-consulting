#!/usr/bin/env node
// R40 (statycznie, bez przegladarki): arkusz trasy nie moze miec selektora, ktory pasuje poza ta trasa.
// Dlaczego: Next App Router zostawia zwykly (nie-modulowy) CSS trasy w dokumencie po nawigacji klienckiej, wiec gole
// `html{}`, `body{}`, `h1{}` z privacy/blog/tool/stop zmienialy inne trasy (css-leak-check.mjs lapie to w Chromium;
// ta bramka lapie to samo z samych plikow, przed buildem).
// Regula: kazdy selektor (po podziale listy na przecinkach najwyzszego poziomu, z rozwinietym zagniezdzeniem CSS)
// w zwyklym .css trasy musi zawierac klase albo id (poza :not(...), poza wartosciami atrybutow i napisami) — np.
// `html:has(.x)`, `body:has(#y)`, `.x h1`, `:where(.x) :is(h1,h2)`, `#dc-page section` = OK; `html`, `body`, `:root`,
// `*`, `h1`, `a:hover`, `:focus-visible`, `::selection`, `:is(h1,h2)`, `h1:not(.x)` = FAIL.
// CSS Modules (*.module.css): sprawdzane tylko selektory z :global — `:global(html)`, `:global(h1)` bez lokalnej klasy = FAIL.
// Arkusze globalne (importowane z app/layout.tsx, takze przechodnio przez jego komponenty i @import) sa pomijane z zalozenia.
// Pominiete bloki: @keyframes, @font-face, @page, @property, @counter-style, @font-feature-values.
// Swiadomy wyjatek: komentarz `/* css-leak-ok: <powod> */` w linii poczatku reguly albo jako pierwszy wezel reguly.
// Uzycie: node scripts/css-leak-static.mjs [pliki...]   (domyslnie app/**/*.css bez globalnych)
//         node scripts/css-leak-static.mjs --selftest
// Wynik: linia `CSSLEAKSTATIC PASS ...` i kod 0, albo `CSSLEAKSTATIC FAIL ...` i kod 1 (zero plikow = FAIL NIETESTOWANE); 2 = blad.
import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const require = createRequire(import.meta.url)
const postcss = require('postcss')

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SKIP_AT = /^(-\w+-)?(keyframes|font-face|page|property|counter-style|font-feature-values)$/i
const ESC = /css-leak-ok:\s*(\S[^*]*?)\s*\*\//

// --- pomocnicze ---
function stripNot(s) { // usuwa zawartosc :not(...) z zachowaniem nawiasow zrownowazonych
  let out = '', i = 0
  while (i < s.length) {
    const m = /^:not\(/i.exec(s.slice(i))
    if (m) {
      let d = 1, j = i + m[0].length
      while (j < s.length && d > 0) { if (s[j] === '(') d++; else if (s[j] === ')') d--; j++ }
      out += ':not()'; i = j; continue
    }
    out += s[i++]
  }
  return out
}
export function anchored(sel) {
  let s = sel.replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, '""').replace(/\[[^\]]*\]/g, '[]')
  s = stripNot(s)
  return /(^|[^\\])[.#]-?[_a-zA-Z\u00A0-\uFFFF\\]/.test(s)
}
function unwrapGlobal(sel) { // :global(x) -> x ; `:global .x` -> `.x` ; :local(x) -> x
  let out = '', i = 0
  while (i < sel.length) {
    const m = /^:(global|local)\(/.exec(sel.slice(i))
    if (m) {
      let d = 1, j = i + m[0].length
      while (j < sel.length && d > 0) { if (sel[j] === '(') d++; else if (sel[j] === ')') d--; j++ }
      out += sel.slice(i + m[0].length, j - 1); i = j; continue
    }
    const b = /^:(global|local)(?![\w-(])\s*/.exec(sel.slice(i))
    if (b) { i += b[0].length; continue }
    out += sel[i++]
  }
  return out.trim()
}
function combine(parent, child) {
  return child.includes('&') ? child.replace(/&/g, `:is(${parent})`) : `${parent} ${child}`
}
function resolved(rule) { // pelne selektory po rozwinieciu zagniezdzenia CSS
  let p = rule.parent
  while (p && p.type !== 'rule' && p.type !== 'root') p = p.parent
  if (!p || p.type !== 'rule') return rule.selectors.map((c) => ({ child: c, full: c }))
  const parents = resolved(p).map((x) => x.full)
  const out = []
  for (const c of rule.selectors) for (const ps of parents) out.push({ child: c, full: combine(ps, c) })
  return out
}
function skipped(node) {
  for (let p = node.parent; p; p = p.parent) if (p.type === 'atrule' && SKIP_AT.test(p.name)) return true
  return false
}

// --- sprawdzenie jednego arkusza ---
export function checkCss(css, file) {
  const isModule = /\.module\.css$/.test(file)
  const lines = css.split('\n')
  const root = postcss.parse(css, { from: file })
  const res = { file, rules: 0, selectors: 0, offenders: [], escapes: [] }
  root.walkRules((rule) => {
    if (skipped(rule)) return
    res.rules++
    const line = rule.source?.start?.line ?? 0
    let esc = ESC.exec(lines[line - 1] || '')
    const first = rule.nodes && rule.nodes[0]
    if (!esc && first && first.type === 'comment') esc = ESC.exec(`/*${first.text}*/`)
    const seen = new Map()
    for (const { child, full } of resolved(rule)) {
      if (!seen.has(child)) { seen.set(child, true); res.selectors++ }
      if (isModule) {
        if (!/:global\b/.test(full)) continue
        if (!anchored(unwrapGlobal(full))) seen.set(child, false)
      } else if (!anchored(full)) seen.set(child, false)
    }
    for (const [child, ok] of seen) {
      if (ok) continue
      if (esc) res.escapes.push({ line, selector: child, reason: esc[1] })
      else res.offenders.push({ line, selector: child.replace(/\s+/g, ' ') })
    }
  })
  return res
}

// --- zbior arkuszy globalnych: przechodnio z app/layout.tsx ---
export function globalCssSet() {
  const seen = new Set(), css = new Set()
  const exts = ['', '.tsx', '.ts', '.jsx', '.js', '.mjs', '/index.tsx', '/index.ts', '/index.jsx', '/index.js']
  const resolveSpec = (from, spec) => {
    let base
    if (spec.startsWith('@/')) base = path.join(ROOT, spec.slice(2))
    else if (spec.startsWith('.')) base = path.resolve(path.dirname(from), spec)
    else return null
    for (const e of exts) { const f = base + e; if (fs.existsSync(f) && fs.statSync(f).isFile()) return f }
    return null
  }
  const visit = (f) => {
    if (seen.has(f)) return; seen.add(f)
    const src = fs.readFileSync(f, 'utf8')
    if (f.endsWith('.css')) {
      if (!f.endsWith('.module.css')) css.add(path.relative(ROOT, f))
      for (const m of src.matchAll(/@import\s+(?:url\()?\s*['"]([^'"]+)['"]/g)) { const r = resolveSpec(f, m[1].startsWith('.') ? m[1] : './' + m[1]); if (r) visit(r) }
      return
    }
    const re = /(?:import|export)\s+(?:[^'"]*?\sfrom\s+)?['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)|require\(\s*['"]([^'"]+)['"]\s*\)/g
    for (const m of src.matchAll(re)) { const r = resolveSpec(f, m[1] || m[2] || m[3]); if (r) visit(r) }
  }
  const layout = path.join(ROOT, 'app/layout.tsx')
  if (!fs.existsSync(layout)) throw new Error('brak app/layout.tsx')
  visit(layout)
  return css
}
function walkCss(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) { if (e.name !== 'node_modules') walkCss(p, out) }
    else if (e.name.endsWith('.css')) out.push(p)
  }
  return out
}

// `import './x.css'`, `import s from './x.module.css'`, `import('./x.css')`, `require('./x.css')`, `@import url('./x.css')`
export const IMPORT_CSS_RE = /(?:@import\s+(?:url\()?|\bimport\s+(?:[^'";]*?\sfrom\s+)?|\bimport\(\s*|\brequire\(\s*)['"]([^'"]+\.css)['"]/g
const SRC_DIRS = ['app', 'lib', 'components', 'src']
// arkusze importowane przez jakikolwiek plik app/ (`import './x.css'`, `import s from './x.module.css'`, `@import`); reszta = martwe
function importedCss() {
  const out = new Set()
  const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name)
    if (e.isDirectory()) { if (e.name !== 'node_modules') walk(p); continue }
    if (!/\.(tsx?|jsx?|mjs|css)$/.test(e.name)) continue
    for (const m of fs.readFileSync(p, 'utf8').matchAll(IMPORT_CSS_RE)) {
      const s = m[1]; const f = s.startsWith('@/') ? path.join(ROOT, s.slice(2)) : path.resolve(path.dirname(p), s)
      out.add(path.relative(ROOT, f))
    }
  } }
  // R43 (recenzja 52 b): importy CSS siedza tez poza app/ (lib/, components/) — skanujemy kazdy katalog zrodel
  for (const d of SRC_DIRS) if (fs.existsSync(path.join(ROOT, d))) walk(path.join(ROOT, d))
  return out
}

function report(results, imported) {
  let files = 0, sels = 0, fail = 0, esc = 0
  for (const r of results) {
    const dead = imported && !imported.has(path.relative(ROOT, path.resolve(r.file)))
    // Arkusz martwy (nikt go nie importuje, np. app/audit.css po v66) nie trafia do dokumentu, wiec nie moze przeciekac.
    // Gdy wroci (ship.mjs dopisze import), automatycznie wchodzi do liczenia — bez zmiany skryptu.
    files++; sels += r.selectors; esc += r.escapes.length; if (!dead) fail += r.offenders.length
    const tag = dead ? ' MARTWY(nikt nie importuje; offenders nie licza sie do FAIL)' : ''
    console.log(`FILE ${r.file}${tag} rules=${r.rules} selectors=${r.selectors} offenders=${r.offenders.length} escapes=${r.escapes.length}`)
    for (const o of r.offenders) console.log(`  ${dead ? 'martwy' : 'FAIL'} ${r.file}:${o.line}  ${o.selector}`)
    for (const e of r.escapes) console.log(`  ESCAPE ${r.file}:${e.line}  ${e.selector}  — ${e.reason}`)
  }
  return { files, sels, fail, esc }
}

// --- samotest: wzorce inline ---
function selftest() {
  const cases = [
    // [nazwa, plik, css, oczekiwana liczba offenders, oczekiwana liczba escapes]
    ['bare-globals', 'bad.css', 'html{scroll-padding-top:0}\nbody{margin:0}\n:root{--a:1}\n*{box-sizing:border-box}\nh1,.x h2{font:inherit}\na:hover{color:red}\n:focus-visible{outline:0}\n:is(h1,h2){color:red}\nh1:not(.x){color:red}\n[href=".pdf"]{color:red}', 10, 0],
    ['media-nesting', 'badnest.css', '@media (max-width:600px){@supports (display:grid){@layer x{section{padding:0}}}}\nbody{ h1{color:red} }', 3, 0],
    ['anchored', 'ok.css', '/* body{} w komentarzu */\nhtml:has(.x){overflow:visible}\nbody:has(#y){margin:0}\n.x h1{color:red}\n:where(.x) :is(h1,h2){color:red}\n#dc-page section{padding:0}\n:root:has(#orders){--a:1}\nhtml:has(#orders){ body{margin:0} h1{color:red} &:focus-within{color:blue} @media (max-width:9px){ a{color:red} } }\n.c{content:"h1{}"}\n@keyframes k{from{opacity:0}to{opacity:1}}\n@font-face{font-family:X;src:url(x.woff2)}', 0, 0],
    ['escape', 'esc.css', 'html{color-scheme:light} /* css-leak-ok: swiadomy reset calego dokumentu */\nbody{margin:0}', 1, 1],
    ['module-bad', 'm.module.css', ':global(html){overflow:hidden}\n:global(h1){color:red}\n:global body{margin:0}', 3, 0],
    ['compound', 'cmp.css', 'button.ga-x{border:0}\nbutton.ga-x.done{color:red}\na#top{color:red}\nbutton\\.x{color:red}', 1, 0],
    ['module-ok', 'mok.module.css', '.wrap :global(h1){color:red}\n:global(.dark) .a{color:red}\nhtml:global(.no-js) .b{color:red}\n.a{color:red}\nh1 .a{color:red}', 0, 0],
  ]
  let ok = true
  for (const [name, file, css, expOff, expEsc] of cases) {
    const r = checkCss(css, file)
    const pass = r.offenders.length === expOff && r.escapes.length === expEsc
    console.log(`${pass ? 'ok  ' : 'BAD '} ${name}: offenders=${r.offenders.length} (oczekiwane ${expOff}) escapes=${r.escapes.length} (oczekiwane ${expEsc})`)
    if (!pass) { ok = false; for (const o of r.offenders) console.log(`      ${o.line}: ${o.selector}`) }
  }
  // zbior globalny musi zawierac arkusze z layoutu (na prawdziwym repo)
  try {
    const g = globalCssSet()
    const need = ['app/globals.css', 'app/critical.css', 'app/fonts.css'].filter((f) => fs.existsSync(path.join(ROOT, f)))
    const miss = need.filter((f) => !g.has(f))
    console.log(`${miss.length ? 'BAD ' : 'ok  '} global-set: ${[...g].join(', ')}${miss.length ? ` (brak: ${miss.join(', ')})` : ''}`)
    if (miss.length) ok = false
  } catch (e) { console.log(`BAD  global-set: ${e.message}`); ok = false }
  // R42: `import styles from './blog.module.css'` to tez import — arkusz nie moze wyjsc na martwy (fałszywe PASS)
  try {
    const imp = importedCss()
    const need = ['app/blog/blog.module.css', 'app/stop/stop.css'].filter((f) => fs.existsSync(path.join(ROOT, f)))
    const miss = need.filter((f) => !imp.has(f))
    console.log(`${miss.length ? 'BAD ' : 'ok  '} imported-set: ${need.join(', ')}${miss.length ? ` (uznane za martwe: ${miss.join(', ')})` : ''}`)
    if (miss.length) ok = false
  } catch (e) { console.log(`BAD  imported-set: ${e.message}`); ok = false }
  // R43: kazda forma importu CSS jest rozpoznana (inaczej arkusz wychodzi na martwy i jego przecieki nie licza sie do FAIL)
  {
    const src = `import './a.css'\nimport s from "./b.module.css"\nconst c = require('./c.css')\nimport('./d.css')\n@import url('./e.css');\n@import "./f.css";\nmyrequire('./x.css')`
    const got = [...src.matchAll(IMPORT_CSS_RE)].map((m) => m[1]).join(',')
    const exp = './a.css,./b.module.css,./c.css,./d.css,./e.css,./f.css'
    // granica slowa (recenzja 53 D3): `myrequire('./x.css')` nie jest importem
    console.log(`${got === exp ? 'ok  ' : 'BAD '} import-forms: ${got}${got === exp ? '' : ` (oczekiwane ${exp})`}`)
    if (got !== exp) ok = false
  }
  console.log(`CSSLEAKSTATIC-SELFTEST ${ok ? 'PASS' : 'FAIL'}`)
  process.exit(ok ? 0 : 1)
}

// --- main ---
try {
  const args = process.argv.slice(2)
  if (args.includes('--selftest')) selftest()
  let files
  if (args.length) files = args.map((f) => path.resolve(f))
  else {
    const glob = globalCssSet()
    console.log(`GLOBAL (pominiete) ${[...glob].sort().join(' ')}`)
    files = walkCss(path.join(ROOT, 'app')).filter((f) => !glob.has(path.relative(ROOT, f))).sort()
  }
  const results = files.map((f) => {
    const rel = path.relative(process.cwd(), f)
    return checkCss(fs.readFileSync(f, 'utf8'), rel && !rel.startsWith('..') ? rel : f)
  })
  const { files: nf, sels, fail, esc } = report(results, args.length ? null : importedCss())
  console.log(`TOTAL files=${nf} selectors=${sels} offenders=${fail} escapes=${esc}`)
  if (nf === 0 || sels === 0) { console.log(`CSSLEAKSTATIC FAIL NIETESTOWANE files=${nf} selectors=${sels}`); process.exit(1) }
  console.log(`CSSLEAKSTATIC ${fail ? 'FAIL' : 'PASS'} fail=${fail} files=${nf} selectors=${sels} escapes=${esc}`)
  process.exit(fail ? 1 : 0)
} catch (e) { console.error('blad:', e.stack || e.message); console.log('CSSLEAKSTATIC FAIL blad'); process.exit(2) }
