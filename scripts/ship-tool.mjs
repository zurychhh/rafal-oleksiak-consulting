#!/usr/bin/env node
// scripts/ship-tool.mjs
//
// Przenosi jeden samowystarczalny HTML narzedzia na trase /tool, w duchu
// scripts/ship.mjs: nic nie jest przepisywane recznie, bo petla produkuje nowe
// wersje tego pliku i przeniesienie musi zostac mechaniczne.
//
//   node scripts/ship-tool.mjs tool-index.html          podglad, nic nie zapisuje
//   node scripts/ship-tool.mjs tool-index.html --yes    zapisuje trzy pliki
//
// Rozklad:
//   <style>...</style>   -> app/tool/tool.css          (regula w regule, doslownie)
//   <script>...</script> -> public/tool-runtime.js     (poza tsconfig, bajt w bajt)
//   reszta <body>        -> app/tool/body.ts           (export const BODY)
//
// body.ts, a nie fs.readFileSync w trasie: czytanie pliku z dysku w App Routerze
// bywa nietrasowane na Vercelu, a bundler zawsze widzi import.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..')
const OUT = {
  css: resolve(ROOT, 'app/tool/tool.css'),
  js: resolve(ROOT, 'public/tool-runtime.js'),
  body: resolve(ROOT, 'app/tool/body.ts'),
}

// Kotwice, bez ktorych plik nie jest ta wersja narzedzia, tylko czyms innym.
// three-instruments.html to wersja sprzed konsolidacji — ma przepasc tutaj.
const REQUIRED = ['id="orders"', 'id="plot"', 'id="verdict"', 'id="ai1"', 'id="ai2"', 'demo data']

const die = (msg) => {
  console.error(`\n  ✗ ${msg}\n`)
  process.exit(1)
}

const src = process.argv[2]
const apply = process.argv.includes('--yes')
if (!src) die('Podaj plik zrodlowy: node scripts/ship-tool.mjs tool-index.html [--yes]')

const file = resolve(process.cwd(), src)
if (!existsSync(file)) die(`Nie ma pliku ${file}`)
const html = readFileSync(file, 'utf8')

const missing = REQUIRED.filter((k) => !html.includes(k))
if (missing.length) {
  die(
    `To nie jest zrodlo narzedzia — brakuje: ${missing.join(', ')}.\n` +
      '    Jesli podstawiasz design/tools/three-instruments.html, to jest wersja\n' +
      '    sprzed konsolidacji. Nie przenos jej.',
  )
}

// --- style -----------------------------------------------------------------
const styles = [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)].map((m) => m[1])
if (!styles.length) die('Brak bloku <style> w zrodle.')
const css = styles.join('\n\n').trim() + '\n'

// --- skrypty ---------------------------------------------------------------
// Wszystkie bloki <script> bez atrybutu src, w kolejnosci wystapienia: shim
// stoi pierwszy i musi wykonac sie przed kodem, ktory pyta o window.claude.
const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map(
  (m) => m[1],
)
if (!scripts.length) die('Brak bloku <script> w zrodle.')
const js = scripts.join('\n\n').trim() + '\n'

// --- markup ----------------------------------------------------------------
const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/)
if (!bodyMatch) die('Brak <body> w zrodle.')
let body = bodyMatch[1]
body = body
  .replace(/<script(?![^>]*\bsrc=)[^>]*>[\s\S]*?<\/script>/g, '')
  .replace(/<style>[\s\S]*?<\/style>/g, '')
  .replace(/<link[^>]*>/g, '') // fonty podpina trasa, nie markup
  .trim()

const bodyTs =
  '// GENEROWANE przez scripts/ship-tool.mjs — nie edytuj recznie.\n' +
  `// Zrodlo: ${src}\n` +
  // Bez `eslint-disable-next-line`: nic tu nie protestuje, a pusta dyrektywa
  // sama jest ostrzezeniem („unused eslint-disable directive") i wracalaby
  // przy kazdej nowej wersji narzedzia z petli.
  'export const BODY = ' +
  '`' +
  body.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${') +
  '`\n'

// --- raport ----------------------------------------------------------------
const kb = (s) => (Buffer.byteLength(s, 'utf8') / 1024).toFixed(1) + ' kB'
const prev = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : null)
const delta = (p, next) => {
  const old = prev(p)
  if (old === null) return 'nowy'
  if (old === next) return 'bez zmian'
  return `${kb(old)} → ${kb(next)}`
}

console.log(`\n  Zrodlo: ${src}  (${kb(html)})\n`)
console.log(`    app/tool/tool.css        ${kb(css)}   ${delta(OUT.css, css)}`)
console.log(`    public/tool-runtime.js   ${kb(js)}   ${delta(OUT.js, js)}`)
console.log(`    app/tool/body.ts         ${kb(bodyTs)}   ${delta(OUT.body, bodyTs)}`)

if (prev(OUT.css) === css && prev(OUT.js) === js && prev(OUT.body) === bodyTs) {
  console.log('\n  Nic do przeniesienia.\n')
  process.exit(0)
}

if (!apply) {
  console.log('\n  Podglad. Dopisz --yes, zeby zapisac.\n')
  process.exit(0)
}

mkdirSync(dirname(OUT.css), { recursive: true })
mkdirSync(dirname(OUT.js), { recursive: true })
writeFileSync(OUT.css, css)
writeFileSync(OUT.js, js)
writeFileSync(OUT.body, bodyTs)
console.log('\n  ✓ Zapisane. Teraz bramka: build, tsc, lint, qa.js na /tool.\n')
