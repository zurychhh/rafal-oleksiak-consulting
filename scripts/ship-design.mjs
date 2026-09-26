#!/usr/bin/env node
/**
 * ship-design — przenosi eksport Claude Design („Publish as artifact",
 * samorozpakowujacy bundle HTML) na trase `/`.
 *
 *   node scripts/ship-design.mjs <bundle.html>          podglad, nic nie zapisuje
 *   node scripts/ship-design.mjs <bundle.html> --yes    przenosi
 *   node scripts/ship-design.mjs --yes                  przenosi to, co juz lezy w
 *                                                       design/production/claude-design-bundle.html
 *
 * PODEJSCIE: nie przepisujemy strony, tylko HOSTUJEMY ja tak, jak dziala w Claude
 * Design — szablon <x-dc> + logika text/x-dc + runtime Claude Design + React 18 UMD.
 * Bundle jest rozpakowywany deterministycznie (bez przegladarki), kazdy asset
 * trafia do public/dc/ pod nazwa z hasha tresci, a URL-e unpkg sa przemapowane
 * na lokalne pliki przez window.__resources (ten sam mechanizm, ktorego uzywa
 * sam bundle). Zero zadan do unpkg i do Google Fonts.
 *
 * Wyjscie (w calosci GENEROWANE — reczna zmiana zniknie przy nastepnym przebiegu):
 *   design/production/claude-design-bundle.html   zrodlo, kopia podanego pliku
 *   app/design/generated.ts                        szablon, skrypt, mapa zasobow
 *   app/design-source.snapshot.html                czytelna migawka (diff tresci)
 *   public/dc/<hash>.<ext>                         runtime, React, ReactDOM, fonty
 *
 * Pisane RECZNIE i nietykane przez ten skrypt: app/page.tsx (metadata, JSON-LD),
 * app/design/DcBoot.tsx (ladowanie runtime'u), app/design/LeadBridge.tsx
 * (formularz → /api/lead), app/design/design-reset.css (reset po starej stronie).
 *
 * Przeksztalcenia (kazde liczone i raportowane):
 *   1. uuid assetow → /dc/<hash>.<ext>
 *   2. usuniecie odznaki „Made with Claude Design"
 *   3. „Rafal" → „Rafał" w tresci (adresy e-mail i URL-e nietkniete)
 *   4. stopka: e-mail i LinkedIn dokladane minimalnie, jesli ich brak
 *   5. link do /tool dokladany minimalnie do stopki, jesli go brak
 * Test tresci (scripts/content-rules.test.mjs) idzie PRZED zapisem: czerwony →
 * nic nie jest zapisywane, ani pliki generowane, ani kopia zrodla.
 *
 * Idempotentny: drugi przebieg bez zmian mowi „Nic do przeniesienia" i wychodzi 0.
 * Nie commituje i nie pushuje. Bramka (build, tsc, lint, qa.js, ship-compare)
 * idzie osobno — patrz CLAUDE.md.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, unlinkSync, copyFileSync } from 'node:fs'
import { resolve, dirname, relative } from 'node:path'
import { gunzipSync } from 'node:zlib'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { checkStatic, formatFailures } from './content-rules.test.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const P = {
  source: resolve(ROOT, 'design/production/claude-design-bundle.html'),
  generated: resolve(ROOT, 'app/design/generated.ts'),
  snapshot: resolve(ROOT, 'app/design-source.snapshot.html'),
  assets: resolve(ROOT, 'public/dc'),
}
const PUBLIC_PREFIX = '/dc/'

const args = process.argv.slice(2)
const YES = args.includes('--yes')
const input = args.find((a) => !a.startsWith('--'))

const die = (msg) => { console.error('\n  ✗ ' + msg + '\n'); process.exit(1) }
const say = (msg) => console.log(msg)
const sha = (buf) => createHash('sha256').update(buf).digest('hex').slice(0, 16)
const kb = (n) => (n / 1024).toFixed(1) + ' kB'

// ───────────────────────────────────────────── 1. wczytanie bundla

const bundlePath = input ? resolve(process.cwd(), input) : P.source
if (!existsSync(bundlePath)) die('Nie ma pliku ' + bundlePath)
const bundle = readFileSync(bundlePath, 'utf8')

function island(type) {
  const re = new RegExp('<script type="' + type.replace(/\//g, '\\/') + '">([\\s\\S]*?)</script>')
  const m = bundle.match(re)
  return m ? m[1] : null
}
const manifestRaw = island('__bundler/manifest')
const templateRaw = island('__bundler/template')
const extRaw = island('__bundler/ext_resources')
if (!manifestRaw || !templateRaw) {
  die('To nie jest bundle Claude Design — brak <script type="__bundler/manifest"> albo __bundler/template.')
}
const pageOrder = JSON.parse(island('__bundler/page_order') || '[]')
if (pageOrder.length) die('Bundle zawiera zagniezdzone strony (iframe). Tego ksztaltu nie przenosimy — zatrzymuje sie.')

const manifest = JSON.parse(manifestRaw)
let template = JSON.parse(templateRaw)
const ext = extRaw ? JSON.parse(extRaw) : []

// ───────────────────────────────────────────── 2. assety → public/dc

const EXT_BY_MIME = {
  'application/javascript': 'js', 'text/javascript': 'js',
  'font/woff2': 'woff2', 'font/woff': 'woff', 'font/ttf': 'ttf', 'font/otf': 'otf',
  'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/svg+xml': 'svg',
  'image/gif': 'gif', 'image/avif': 'avif', 'text/css': 'css',
}
const assets = {} // uuid → { file, url, bytes, mime }
for (const [uuid, entry] of Object.entries(manifest)) {
  let bytes = Buffer.from(entry.data, 'base64')
  if (entry.compressed) bytes = gunzipSync(bytes)
  const mime = String(entry.mime || '').split(';')[0].trim().toLowerCase()
  const extn = EXT_BY_MIME[mime]
  if (!extn) die(`Asset ${uuid} ma nieznany typ „${entry.mime}". Nie zgaduje rozszerzenia — zatrzymuje sie.`)
  const file = sha(bytes) + '.' + extn
  assets[uuid] = { file, url: PUBLIC_PREFIX + file, bytes, mime }
}

// Mapa URL CDN → lokalny plik. Runtime Claude Design pyta o nia (window.__resources)
// zanim siegnie do unpkg; bez wpisu poszedlby do sieci.
const resources = {}
for (const { id, uuid } of ext) {
  if (!assets[uuid]) die(`ext_resources wskazuje na ${uuid}, ktorego nie ma w manifescie.`)
  resources[id] = assets[uuid].url
}

// ───────────────────────────────────────────── 3. rozklad szablonu

const count = {}
const bump = (k, n = 1) => { count[k] = (count[k] || 0) + n }

for (const [uuid, a] of Object.entries(assets)) {
  const parts = template.split(uuid)
  if (parts.length > 1) bump('uuid → /dc', parts.length - 1)
  template = parts.join(a.url)
}
// Po podstawieniu nie moze zostac zaden uuid-ksztaltny odnosnik.
const leftover = template.match(/["'(]([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})["')]/)
if (leftover) die('W szablonie zostal odnosnik do assetu spoza manifestu: ' + leftover[1])

const head = (template.match(/<head[^>]*>([\s\S]*?)<\/head>/i) || [])[1]
if (head == null) die('Szablon bez <head>.')
const runtimeTags = [...head.matchAll(/<script\b[^>]*\bsrc="([^"]+)"[^>]*><\/script>/g)].map((m) => m[1])
if (runtimeTags.length !== 1 || !runtimeTags[0].startsWith(PUBLIC_PREFIX)) {
  die('Oczekiwalem dokladnie jednego skryptu runtime\'u Claude Design w <head>, jest: ' + JSON.stringify(runtimeTags))
}
const runtimeUrl = runtimeTags[0]
// Wszystko inne w <head> poza meta charset/viewport i runtime'em to cos, czego ten
// skrypt nie zna. Nie gubimy tego po cichu.
const headRest = head
  .replace(/<meta\s+charset[^>]*>/i, '')
  .replace(/<meta\s+name="viewport"[^>]*>/i, '')
  .replace(/<script\b[^>]*\bsrc="[^"]+"[^>]*><\/script>/, '')
  .replace(/<title>[\s\S]*?<\/title>/i, '')
  .trim()
if (headRest) die('W <head> szablonu jest cos nieznanego — przenies recznie albo rozszerz skrypt:\n' + headRest.slice(0, 400))

const body = (template.match(/<body[^>]*>([\s\S]*)<\/body>/i) || [])[1]
if (body == null) die('Szablon bez <body>.')
const open = body.match(/<x-dc(?:\s[^>]*)?>/)
const close = body.lastIndexOf('</x-dc>')
if (!open || close < 0) die('W <body> nie ma bloku <x-dc>. To nie jest komponent Claude Design.')
let dcTemplate = body.slice(open.index + open[0].length, close)
let rest = body.slice(close + '</x-dc>'.length)
const beforeDc = body.slice(0, open.index).trim()
if (beforeDc) die('Przed <x-dc> jest tresc, ktorej nie znam: ' + beforeDc.slice(0, 200))

const scriptM = rest.match(/<script type="text\/x-dc"[^>]*\bdata-dc-script\b[^>]*>[\s\S]*?<\/script>/)
if (!scriptM) die('Brak <script type="text/x-dc" data-dc-script> — logika komponentu nie istnieje.')
let dcScript = scriptM[0]
rest = rest.replace(scriptM[0], '')
// Odznaka Claude Design: <div id="__claude_design_branding">…</div> na samym koncu.
const brand = rest.match(/<div id="__claude_design_branding">[\s\S]*<\/div>/)
if (brand) { rest = rest.replace(brand[0], ''); bump('odznaka Claude Design usunieta') }
if (rest.trim()) die('Za <x-dc> jest tresc, ktorej nie znam:\n' + rest.trim().slice(0, 400))
if (/<\/script/i.test(dcScript.slice(dcScript.indexOf('>') + 1, -'</script>'.length))) {
  die('Skrypt x-dc zawiera literal </script — nie da sie go bezpiecznie osadzic.')
}

// ───────────────────────────────────────────── 4. przeksztalcenia tresci

// „Rafal" → „Rafał". Tylko wielka litera: adresy (rafal@…) i URL-e (rafa%C5%82)
// sa pisane malymi i zostaja nietkniete. (?![@.%\w]) chroni przed doklejonym
// adresem albo identyfikatorem.
const RAFAL = /\bRafal(?![@.%\w])/g
for (const [name, get, set] of [
  ['szablon', () => dcTemplate, (v) => { dcTemplate = v }],
  ['skrypt', () => dcScript, (v) => { dcScript = v }],
]) {
  const n = (get().match(RAFAL) || []).length
  if (n) { set(get().replace(RAFAL, 'Rafał')); bump(`„Rafal" → „Rafał" (${name})`, n) }
}

// Stopka: e-mail i LinkedIn. Dokladamy minimalnie tylko to, czego brak.
const EMAIL = 'rafal@oleksiakconsulting.com'
const LINKEDIN = 'https://www.linkedin.com/in/rafa%C5%82-oleksiak-3b322981/'
const footerM = dcTemplate.match(/<footer\b[^>]*>[\s\S]*?<\/footer>/)
if (!footerM) die('W szablonie nie ma <footer>. Nie wymyslam stopki — dodaj ja w Claude Design.')
let footer = footerM[0]
const LINK_STYLE = 'color:inherit;display:inline-flex;align-items:center;min-height:44px'
const addToFooter = (html, label) => {
  footer = footer.replace(/<\/footer>$/, `<span style="display:flex;flex-wrap:wrap;gap:0 18px">${html}</span></footer>`)
  bump(label)
}
if (!footer.includes('mailto:' + EMAIL)) addToFooter(`<a href="mailto:${EMAIL}" style="${LINK_STYLE}">${EMAIL}</a>`, 'stopka: dolozony e-mail')
if (!footer.includes(LINKEDIN)) addToFooter(`<a href="${LINKEDIN}" style="${LINK_STYLE}">Rafał Oleksiak on LinkedIn</a>`, 'stopka: dolozony LinkedIn')
if (!/href="\/tool"/.test(dcTemplate) && !footer.includes('href="/tool"')) {
  addToFooter(`<a href="/tool" style="${LINK_STYLE}">Count your own interval</a>`, 'dolozony link do /tool')
}
dcTemplate = dcTemplate.replace(footerM[0], footer)

// Nic poza naszym originem nie moze byc ladowane przez szablon.
const external = dcTemplate.match(/(?:src=|url\(|@import\s)["']?(https?:)?\/\/[^"')\s]+/i)
if (external) die('Szablon laduje cos z zewnatrz: ' + external[0] + ' — przenies to do public/dc albo usun w zrodle.')

// Kontrakt formularza, na ktorym stoi app/design/LeadBridge.tsx: przynajmniej
// jeden formularz z polem adresu sklepu, e-mailem i checkboxem zgody.
const forms = [...dcTemplate.matchAll(/<form\b[\s\S]*?<\/form>/g)].map((m) => m[0])
const full = forms.filter((f) => /inputmode="url"/.test(f) && /type="email"/.test(f) && /type="checkbox"/.test(f))
if (!full.length) die('Zaden formularz nie ma ksztaltu URL + e-mail + zgoda. LeadBridge nie bedzie mial czego wysylac.')
const precheckedConsent = forms.some((f) => /type="checkbox"[^>]*\bchecked\b/.test(f))
if (precheckedConsent) die('Checkbox zgody jest domyslnie zaznaczony. Zgoda musi byc domyslnie pusta.')
const urlOnly = forms.filter((f) => /inputmode="url"/.test(f) && !/type="email"/.test(f)).length

// ───────────────────────────────────────────── 5. test tresci (przed zapisem)

const failures = checkStatic({ template: dcTemplate, script: dcScript })

// ───────────────────────────────────────────── 6. wyjscie

const fonts = Object.values(assets).filter((a) => a.mime.startsWith('font/')).map((a) => a.url)
const DC = {
  runtime: runtimeUrl,
  resources,
  preload: {
    scripts: [runtimeUrl, ...Object.values(resources)],
    fonts,
  },
  template: dcTemplate,
  script: dcScript,
}
const generated =
  '// GENEROWANE przez scripts/ship-design.mjs — nie edytuj recznie.\n' +
  '// Zrodlo: design/production/claude-design-bundle.html\n' +
  'export const DC = ' + JSON.stringify(DC, null, 2) + ' as const\n'

// Migawka: czytelny, diffowalny odpowiednik bundla (bez base64). Z niej liczony
// jest diff tresci w podgladzie nastepnego przebiegu.
const snapshot =
  '<!-- GENEROWANE przez scripts/ship-design.mjs — migawka ostatnio przeniesionego zrodla -->\n' +
  '<x-dc>' + dcTemplate + '</x-dc>\n' + dcScript + '\n'

const wanted = Object.fromEntries(Object.values(assets).map((a) => [a.file, a.bytes]))
const current = existsSync(P.assets) ? readdirSync(P.assets) : []
const toWrite = Object.keys(wanted).filter((f) => !current.includes(f))
const toRemove = current.filter((f) => !(f in wanted))

// ─── raport
const visible = (html) => html
  .replace(/<helmet>[\s\S]*?<\/helmet>/g, '')
  .replace(/<(script|style)\b[\s\S]*?<\/\1>/g, '')
  .replace(/<[^>]+>/g, '\n')
  .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')
  .split('\n').map((l) => l.trim()).filter(Boolean)
const scriptStrings = (js) => [...js.matchAll(/'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"/g)]
  .map((m) => m[1] ?? m[2]).filter((s) => /[A-Za-z]{3,}\s+[A-Za-z]/.test(s))
const lines = (snap) => {
  const t = snap.match(/<x-dc>([\s\S]*)<\/x-dc>/)
  const s = snap.slice(snap.lastIndexOf('</x-dc>'))
  return new Set([...visible(t ? t[1] : ''), ...scriptStrings(s)])
}
const oldSnap = existsSync(P.snapshot) ? readFileSync(P.snapshot, 'utf8') : ''
const before = lines(oldSnap), after = lines(snapshot)
const gone = [...before].filter((l) => !after.has(l))
const added = [...after].filter((l) => !before.has(l))

say(`\n  Zrodlo: ${relative(ROOT, bundlePath)}  (${kb(Buffer.byteLength(bundle))})`)
say(`  Assety: ${Object.keys(assets).length} → public/dc/  (nowe: ${toWrite.length}, do usuniecia: ${toRemove.length})`)
for (const a of Object.values(assets)) say(`    ${a.url.padEnd(34)} ${a.mime.padEnd(24)} ${kb(a.bytes.length)}`)
say(`  Zasoby CDN przemapowane: ${Object.keys(resources).length}`)
for (const [k, v] of Object.entries(resources)) say(`    ${k} → ${v}`)
say('  Przeksztalcenia:')
for (const [k, v] of Object.entries(count)) say(`    ${k}: ${v}`)
say(`  Formularze: ${forms.length} (pelne URL+e-mail+zgoda: ${full.length}, tylko URL: ${urlOnly} — LeadBridge przekierowuje je do pelnego)`)
if (oldSnap) {
  say(`  Tresc wzgledem ostatniej migawki: -${gone.length} / +${added.length} linii`)
  for (const l of gone.slice(0, 40)) say('    - ' + l.slice(0, 110))
  for (const l of added.slice(0, 40)) say('    + ' + l.slice(0, 110))
} else {
  say('  Brak poprzedniej migawki — pierwszy przebieg.')
}

if (failures.length) {
  say('\n  Test tresci: CZERWONY')
  say(formatFailures(failures))
  die('Zrodlo lamie zasady tresci. Popraw w Claude Design (albo swiadomie dopisz wyjatek w scripts/content-rules.test.mjs) i przenies ponownie.')
}
say('  Test tresci: PASS')

const prev = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : null)
const sourceSame = existsSync(P.source) && readFileSync(P.source, 'utf8') === bundle
if (prev(P.generated) === generated && prev(P.snapshot) === snapshot && !toWrite.length && !toRemove.length && sourceSame) {
  say('\n  Nic do przeniesienia.\n')
  process.exit(0)
}
if (!YES) {
  say('\n  Podglad. Dopisz --yes, zeby zapisac.\n')
  process.exit(0)
}

mkdirSync(dirname(P.generated), { recursive: true })
mkdirSync(P.assets, { recursive: true })
mkdirSync(dirname(P.source), { recursive: true })
if (!sourceSame) copyFileSync(bundlePath, P.source)
for (const f of toWrite) writeFileSync(resolve(P.assets, f), wanted[f])
for (const f of toRemove) unlinkSync(resolve(P.assets, f))
writeFileSync(P.generated, generated)
writeFileSync(P.snapshot, snapshot)
say('\n  ✓ Zapisane. Teraz bramka (CLAUDE.md → „Strona glowna"): build, tsc, lint,')
say('    qa.js na / /stop /tool, content-rules --url, ship-compare.\n')
