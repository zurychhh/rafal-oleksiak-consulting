#!/usr/bin/env node
/* ---------------------------------------------------------------------------
   Twarde zasady tresci strony glownej — jako test, nie jako pamiec.

   Strona glowna przychodzi z Claude Design i jest podmieniana cala. Kazda nowa
   wersja moze po cichu przywrocic cos, co Rafal juz raz wycial. Ten test pilnuje
   tego mechanicznie, dla KAZDEJ wersji:

     1. zero „one client at a time" — prawda: dwoch klientow naraz
     2. cena: jedyna kwota to EUR 2,500 net per month, i musi byc na stronie
     3. zadnych procentow; kazda liczba w tresci musi byc na liscie ALLOWED_NUMBERS
        (nowa liczba = swiadoma decyzja, dopisana tu z uzasadnieniem)
     4. zadnej liczby obok nazwy klienta (Allegro, mBank, Accenture, Booksy,
        GenActiv) — wynik klienta bez pomiaru to wymysl
     5. przy Accenture zadnej nazwy sieci ani marki (lista publiczna ponizej
        + prywatna z CONTENT_PRIVATE_DENY albo z pliku .content-deny.local)
     6. stopka: rafal@oleksiakconsulting.com i link do LinkedIna
     7. „Rafał", nie „Rafal"
     8. widoczny link do /tool
     9. zadnej odznaki Claude Design i zadnych zasobow z unpkg / Google Fonts

   Dwie warstwy:
     A. statyczna, zawsze — czyta app/design/generated.ts (to, co pojedzie)
     B. wyrenderowana, z --url — otwiera strone w Chromium i sprawdza tekst,
        ktory runtime faktycznie wstawil (tresc liczona w skrypcie komponentu)

   Uruchomienie:
     node scripts/content-rules.test.mjs
     node scripts/content-rules.test.mjs --url http://localhost:3000
   NIGDY --url na produkcje nie jest potrzebne: test nie wysyla formularza, ale
   bramke puszczamy lokalnie.
   --------------------------------------------------------------------------- */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

export const EMAIL = 'rafal@oleksiakconsulting.com'
export const LINKEDIN = 'https://www.linkedin.com/in/rafa%C5%82-oleksiak-3b322981/'
const CLIENTS = ['Allegro', 'mBank', 'mOkazje', 'Accenture', 'Booksy', 'GenActiv', 'Genactiv']

// Liczby dopuszczone w tresci. Kazda z uzasadnieniem — to jest miejsce, gdzie
// nowa liczba przechodzi przez czlowieka, a nie przez petle.
const ALLOWED_NUMBERS = new Map([
  ['2,500', 'cena: EUR 2,500 net per month'],
  ['45', 'dni zapasu z etykiety — prawdziwe zamowienia jednego sklepu (dane z /tool)'],
  ['69', 'realny odstep do drugiego zamowienia — te same dane'],
  ['70', 'koniec osi dni na wykresie 45/69'],
  ['1', 'poczatek osi dni / numeracja'],
  ['2', 'zakres dni na osi („Days 1–2") — ilustracja na osi 45/69'],
  ['40', 'zakres dni na osi („Days 40–48") — ilustracja; ml w metaforze dawki'],
  ['46', 'zakres dni na osi („Days 46–69") — ilustracja'],
  ['48', 'zakres dni na osi („Days 40–48") — ilustracja'],
  ['24', 'obietnica odpowiedzi w 24 godziny'],
  ['2026', 'data rewizji w stopce'],
  ['01', 'numeracja'], ['02', 'numeracja'], ['03', 'numeracja'], ['04', 'numeracja'],
  ['05', 'numeracja'], ['09', 'miesiac rewizji w stopce (REV 2026-09)'],
  ['20', 'metafora dawki: ml'], ['60', 'metafora dawki: ml'], ['80', 'metafora dawki: ml'],
  ['100', 'metafora dawki: ml'], ['200', 'metafora dawki: ml left'], ['300', 'metafora dawki: ml left'],
  ['400', 'metafora dawki: ml left'], ['500', 'metafora dawki: ml left'], ['0', 'metafora dawki: 0 ml left'],
])

// Sieci i marki kosmetyczno-drogeryjne. Lista jest celowo szeroka i publiczna:
// nie wskazuje, ktora z nich byla klientem. Prawdziwa nazwe (jesli jej tu nie ma)
// dopisz w CONTENT_PRIVATE_DENY albo w .content-deny.local (gitignorowany).
const PUBLIC_DENY = [
  'Rossmann', 'Hebe', 'Super-Pharm', 'Superpharm', 'Douglas', 'Sephora', 'Notino',
  'Drogerie Natura', 'Watsons', 'Boots', 'Superdrug', 'dm-drogerie', 'dm drogerie',
  'Müller', 'Kiko', 'Inglot', "L'Oréal", 'L’Oréal', 'Loreal', 'Estée Lauder', 'Estee Lauder',
  'Unilever', 'Procter', 'P&G', 'Beiersdorf', 'Nivea', 'Henkel', 'Coty', 'Avon', 'Oriflame',
  'Garnier', 'Maybelline', 'Eveline', 'Bielenda', 'Ziaja', 'Pepco', 'Carrefour', 'Auchan', 'Lidl',
  'Biedronka', 'Jeronimo Martins', 'Żabka', 'Zabka', 'Kaufland', 'Tesco',
]
function privateDeny() {
  const out = []
  if (process.env.CONTENT_PRIVATE_DENY) out.push(...process.env.CONTENT_PRIVATE_DENY.split(','))
  const f = path.join(ROOT, '.content-deny.local')
  if (fs.existsSync(f)) out.push(...fs.readFileSync(f, 'utf8').split('\n'))
  return out.map((s) => s.trim()).filter(Boolean)
}

/* ---------- ekstrakcja tresci ze zrodla ---------- */

const decode = (s) => s
  .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&mdash;/g, '—').replace(/&rarr;/g, '→')

/** Tekst widoczny w szablonie: wezly tekstowe + placeholder/aria-label/alt/title. */
export function templateTexts(template) {
  const t = template
    .replace(/<helmet>[\s\S]*?<\/helmet>/g, '')
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/g, '')
  const attrs = [...t.matchAll(/\s(?:placeholder|aria-label|alt|title)="([^"]*)"/g)].map((m) => decode(m[1]))
  // Segmenty = tresc miedzy znacznikami blokowymi, zeby „nazwa + liczba" w jednym
  // akapicie zostaly razem, a sasiednie akapity nie.
  const blocks = t
    .replace(/<\/?(p|div|section|header|footer|main|label|form|button|h[1-6]|li|ul|ol|a)\b[^>]*>/g, '\n')
    .replace(/<[^>]+>/g, ' ')
    .split('\n')
    .map((l) => decode(l).replace(/\{\{[^}]*\}\}/g, ' ').replace(/\s+/g, ' ').trim())
    .filter(Boolean)
  return [...blocks, ...attrs]
}

const CSSISH = /^(#[0-9a-f]{3,8}|[\d.\s-]+(px|%|vh|vw|fr|ms|em|rem|deg|ch|s)?(\s|$)|.*(minmax|repeat\(|cubic-bezier|translate|scale[XY]?\(|clamp\(|calc\(|rgba?\(|:\s*\d|;)).*$/i
/** Napisy w logice komponentu, ktore wygladaja na proze (nie na CSS ani kod). */
export function scriptTexts(script) {
  const body = script.slice(script.indexOf('>') + 1)
  const out = []
  for (const m of body.matchAll(/'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\$]|\\.)*)`/g)) {
    const raw = m[1] ?? m[2] ?? m[3]
    const s = raw.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16))).replace(/\\(.)/g, '$1')
    if (!/[A-Za-z]{2,}/.test(s)) {
      // czyste liczby/kody w cudzyslowie tez sa trescia, jesli to nie CSS
      if (/^\d/.test(s) && !CSSISH.test(s)) out.push(s)
      continue
    }
    if (CSSISH.test(s)) continue
    if (/^[a-z][a-zA-Z0-9]*$/.test(s) && !CLIENTS.includes(s)) continue // identyfikatory, nazwy zdarzen (ale nie „mBank")
    if (/^\(?(max|min)-width|^\[data-|^input\[|^#|^\.|^[a-z-]+\s*\(/.test(s)) continue // selektory, media
    out.push(s)
  }
  return out
}

/* ---------- zasady ---------- */

const numberTokens = (s) => (s.match(/\d+(?:[.,]\d+)*/g) || [])

/**
 * @param segments  tablica napisow (kazdy = jeden blok tresci)
 * @param extra     { hrefs: string[], footer: string, raw: string }
 */
export function checkSegments(segments, { hrefs = [], footer = '', raw = '' } = {}) {
  const fail = []
  const all = segments.join('\n')
  const deny = [...PUBLIC_DENY, ...privateDeny()]

  // 1
  if (/\bone client at a time\b/i.test(all) || /\b(a|one|single) client\b[^.]{0,20}\bat a time/i.test(all)) {
    fail.push(['1 dwoch klientow', 'jest „one client at a time" — prawda: dwoch klientow naraz'])
  }
  for (const s of segments) {
    const m = s.match(/\b(\w+) clients? at a time\b/i)
    if (m && !/^two$/i.test(m[1])) fail.push(['1 dwoch klientow', `„${m[0]}" — ma byc „Two clients at a time"`])
  }
  // 1b. Tylko JEDEN biezacy klient (GenActiv) — stan 26.09.2026. „One of the two"
  //     sugerowalo drugiego biezacego klienta, a Rafal drugiego dopiero szuka.
  if (/\bone of the two\b/i.test(all)) fail.push(['1 dwoch klientow', '„One of the two" — jest tylko jeden biezacy klient (stan 26.09.2026)'])
  // 2
  if (!/EUR 2,500 net per month/.test(all)) fail.push(['2 cena', 'brak „EUR 2,500 net per month"'])
  for (const s of segments) {
    const re = /(?:€|EUR|PLN|zł|USD|\$|£)\s?\d[\d,.\s]*|\d[\d,.\s]*\s?(?:€|EUR|PLN|zł|USD|\$|£|tys)/gi
    for (const m of s.matchAll(re)) {
      if (!/^EUR 2,500$/.test(m[0].trim())) fail.push(['2 cena', `kwota inna niz EUR 2,500: „${m[0].trim()}" w „${s.slice(0, 90)}"`])
    }
  }
  // 3
  for (const s of segments) {
    if (/\d\s?%|\bper ?cent\b/i.test(s)) fail.push(['3 liczby', `procent w tresci: „${s.slice(0, 100)}"`])
    for (const n of numberTokens(s)) {
      if (!ALLOWED_NUMBERS.has(n)) fail.push(['3 liczby', `liczba ${n} spoza listy ALLOWED_NUMBERS: „${s.slice(0, 100)}"`])
    }
    if (/\d\s?(x|×)\b|\b\d+\s?(k|m)\b(?!l)/i.test(s)) fail.push(['3 liczby', `mnoznik/skrot liczby: „${s.slice(0, 100)}"`])
  }
  // 4
  for (const s of segments) {
    for (const c of CLIENTS) {
      if (s.includes(c) && /\d/.test(s.replace(/#[0-9a-f]{3,8}/gi, ''))) {
        fail.push(['4 klient + liczba', `${c} stoi przy liczbie: „${s.slice(0, 110)}"`])
      }
    }
  }
  // 5
  for (const d of deny) {
    const re = new RegExp('(^|[^\\p{L}])' + d.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '($|[^\\p{L}])', 'iu')
    if (re.test(all)) fail.push(['5 Accenture', `nazwa sieci/marki „${d}" w tresci — przy pracy przez Accenture nie wolno jej podawac`])
  }
  // 6
  if (!footer.includes(EMAIL)) fail.push(['6 stopka', `brak ${EMAIL} w stopce`])
  if (!footer.includes(LINKEDIN)) fail.push(['6 stopka', `brak linku ${LINKEDIN} w stopce`])
  // 7
  for (const s of segments) if (/\brafal\b(?!@)/i.test(s)) fail.push(['7 Rafał', `„Rafal" bez ł: „${s.slice(0, 80)}"`])
  // 8
  if (!hrefs.includes('/tool')) fail.push(['8 /tool', 'brak linku do /tool'])
  // 9
  if (/__claude_design_branding|Made with Claude Design/.test(raw)) fail.push(['9 zrodlo', 'odznaka Claude Design w tresci'])
  if (/unpkg\.com\/|fonts\.googleapis\.com|fonts\.gstatic\.com/.test(raw.replace(/"https:\/\/unpkg\.com[^"]*":/g, ''))) {
    fail.push(['9 zrodlo', 'odwolanie do unpkg albo Google Fonts poza mapa zasobow'])
  }
  return fail
}

export function checkStatic({ template, script }) {
  const footer = (template.match(/<footer\b[\s\S]*?<\/footer>/) || [''])[0]
  const hrefs = [...template.matchAll(/\bhref="([^"]*)"/g)].map((m) => m[1])
  const segments = [...templateTexts(template), ...scriptTexts(script)]
  return checkSegments(segments, { hrefs, footer: decode(footer), raw: template + script })
}

export function formatFailures(fail) {
  return fail.map(([rule, msg]) => `  FAIL  [${rule}] ${msg}`).join('\n')
}

/* ---------- warstwa B: wyrenderowana strona ---------- */

async function checkRendered(url) {
  const { chromium } = await import('playwright')
  const pinned = process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
  const browser = await chromium.launch(fs.existsSync(pinned) ? { executablePath: pinned } : {})
  const fail = []
  const external = new Set()
  for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport: vp })
    page.on('request', (r) => {
      const u = new URL(r.url())
      if (/unpkg\.com|fonts\.googleapis\.com|fonts\.gstatic\.com/.test(u.host)) external.add(u.href)
    })
    await page.addInitScript(() => { try { localStorage.setItem('cookie-consent', 'declined') } catch { /* */ } })
    await page.goto(url, { waitUntil: 'networkidle' })
    await page.waitForSelector('#dc-root', { timeout: 15000 })
    // Przewijamy cala strone, zeby runtime przeszedl przez stany zalezne od scrolla.
    await page.evaluate(async () => {
      const h = () => document.documentElement.scrollHeight
      for (let y = 0; y < h(); y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)) }
      window.scrollTo(0, 0)
    })
    await page.waitForTimeout(600)
    const got = await page.evaluate(() => {
      const root = document.getElementById('dc-root')
      const BLOCK = /^(P|DIV|SECTION|HEADER|FOOTER|MAIN|LABEL|FORM|BUTTON|H[1-6]|LI|A|SPAN)$/
      const segs = []
      root.querySelectorAll('*').forEach((el) => {
        if (!BLOCK.test(el.tagName)) return
        // segment = element, ktorego dzieci sa juz tylko tekstem albo inline'em
        const kids = [...el.children]
        if (kids.some((k) => /^(P|DIV|SECTION|HEADER|FOOTER|MAIN|FORM|H[1-6]|LI)$/.test(k.tagName))) return
        const t = el.textContent.replace(/\s+/g, ' ').trim()
        if (t) segs.push(t)
      })
      root.querySelectorAll('input[placeholder],[aria-label]').forEach((el) => {
        const t = el.getAttribute('placeholder') || el.getAttribute('aria-label'); if (t) segs.push(t)
      })
      // Wiersze z nazwa klienta: caly wiersz jako jeden segment (nazwa, status, opis).
      const CL = ['Allegro', 'mBank', 'Accenture', 'Booksy', 'GenActiv']
      root.querySelectorAll('*').forEach((el) => {
        if (el.children.length) return
        if (!CL.some((c) => el.textContent.includes(c))) return
        let row = el
        for (let i = 0; i < 3 && row.parentElement && row.parentElement.textContent.length < 400; i++) row = row.parentElement
        segs.push(row.textContent.replace(/\s+/g, ' ').trim())
      })
      const footer = [...root.querySelectorAll('footer')].map((f) => f.innerHTML).join('\n')
      const tool = [...root.querySelectorAll('a[href="/tool"]')].some((a) => a.offsetParent !== null)
      return { segs, footer, tool, hrefs: [...root.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')), raw: document.body.innerText }
    })
    const f = checkSegments(got.segs, { hrefs: got.tool ? got.hrefs : got.hrefs.filter((h) => h !== '/tool'), footer: got.footer.replace(/&amp;/g, '&'), raw: got.raw })
    for (const x of f) fail.push([x[0], `${vp.width}px: ${x[1]}`])
    await page.close()
  }
  await browser.close()
  for (const u of external) fail.push(['9 zrodlo', 'zadanie do zewnetrznego CDN: ' + u])
  return fail
}

/* ---------- CLI ---------- */

async function main() {
  const genPath = path.join(ROOT, 'app/design/generated.ts')
  if (!fs.existsSync(genPath)) { console.log('FAIL  brak app/design/generated.ts — najpierw scripts/ship-design.mjs --yes'); process.exit(1) }
  const src = fs.readFileSync(genPath, 'utf8')
  const json = src.slice(src.indexOf('export const DC = ') + 'export const DC = '.length, src.lastIndexOf(' as const'))
  const DC = JSON.parse(json)

  // 0. Samotest: kazda zasada musi strzelic na znanym naruszeniu. Bez tego
  //    zepsuty regex dawalby wieczny PASS.
  console.log('0. samotest zasad')
  const good = { hrefs: ['/tool'], footer: `${EMAIL} ${LINKEDIN}`, raw: '' }
  const base = ['EUR 2,500 net per month.', 'Two clients at a time.']
  const probes = [
    ['1 dwoch klientow', ['One client at a time.']],
    ['1 dwoch klientow', ['Current client. One of the two.']],
    ['2 cena', ['EUR 3,000 net per month.']],
    ['3 liczby', ['Revenue up 37% in a quarter.']],
    ['3 liczby', ['We shipped 1,197 orders.']],
    ['4 klient + liczba', ['GenActiv grew 3 times.']],
    ['5 Accenture', ['Accenture work for Rossmann.']],
    ['7 Rafał', ['Rafal Oleksiak']],
  ]
  let selfFail = 0
  for (const [rule, segs] of probes) {
    if (!checkSegments([...base, ...segs], good).some(([r]) => r === rule)) {
      selfFail++; console.log(`  FAIL  zasada [${rule}] nie wykryla: ${segs[0]}`)
    }
  }
  if (!checkSegments(base, { ...good, footer: '' }).some(([r]) => r === '6 stopka')) { selfFail++; console.log('  FAIL  [6 stopka] nie wykryla braku') }
  if (!checkSegments(base, { ...good, hrefs: [] }).some(([r]) => r === '8 /tool')) { selfFail++; console.log('  FAIL  [8 /tool] nie wykryla braku') }
  if (checkSegments(base, good).length) { selfFail++; console.log('  FAIL  czysta tresc zglasza naruszenia') }
  console.log(selfFail ? '' : '  PASS')

  console.log('A. tresc zrodla (app/design/generated.ts)')
  const a = checkStatic({ template: DC.template, script: DC.script })
  if (a.length) console.log(formatFailures(a)); else console.log('  PASS')

  let b = []
  const i = process.argv.indexOf('--url')
  if (i > 0) {
    const url = process.argv[i + 1]
    if (/oleksiakconsulting\.com/.test(url)) { console.log('Nie na produkcji. Bramka idzie lokalnie.'); process.exit(1) }
    console.log(`B. tresc wyrenderowana (${url}, 1440 i 390)`)
    b = await checkRendered(url)
    if (b.length) console.log(formatFailures(b)); else console.log('  PASS')
  } else {
    console.log('B. pominieta — dopisz --url http://localhost:3000')
  }
  const n = a.length + b.length + selfFail
  console.log(n ? `\nFAIL — ${n} naruszen(ia)` : '\nPASS — zasady tresci dotrzymane')
  process.exitCode = n ? 1 : 0
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main()
