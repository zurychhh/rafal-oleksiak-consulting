#!/usr/bin/env node
import chromiumExeMod from './chromium-exe.cjs'; const { chromiumExe } = chromiumExeMod
// JSON-LD = widoczny tekst (kolejka wiedzy pkt 4, R4 p7). Znacznik, ktory mowi cos, czego strona nie pokazuje,
// jest ryzykiem (wytyczne Google: dane strukturalne musza odpowiadac tresci widocznej dla uzytkownika).
// Uzycie: node scripts/jsonld-rules.test.mjs http://localhost:3000/nawyko
// Sprawdza: kazdy blok ld+json parsuje sie; description, featureList, pytania i odpowiedzi FAQ wystepuja
// slowo w slowo w widocznym tekscie (po rozwinieciu <details>); osoba ma @id kanoniczny z `/`; brak offers/
// aggregateRating/review (na stronie nie ma ceny ani ocen — nie zmyslamy).
import { chromium } from 'playwright'

const url = process.argv[2]
if (!url) {
  console.error('podaj URL, np. http://localhost:3000/nawyko')
  process.exit(2)
}
if (/oleksiakconsulting\.com/.test(url)) {
  console.error('tylko localhost / podglad — nie produkcja')
  process.exit(2)
}

const exe = chromiumExe()
const browser = await chromium.launch(exe ? { executablePath: exe } : {})
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(url, { waitUntil: 'networkidle' })
const { blocks, text } = await page.evaluate(() => {
  document.querySelectorAll('details').forEach((d) => (d.open = true))
  const blocks = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent)
  return { blocks, text: document.body.innerText }
})
await browser.close()

const norm = (s) => s.replace(/\s+/g, ' ').replace(/[’‘]/g, "'").trim().toLowerCase() // innerText oddaje text-transform (np. NAWYKO w nawigacji)
const visible = norm(text)
const fails = []
const check = (label, s) => {
  if (typeof s !== 'string' || !s) return
  if (!visible.includes(norm(s))) fails.push(`${label} niewidoczny: "${s.slice(0, 90)}"`)
}

let nodes = []
for (const b of blocks) {
  try {
    const j = JSON.parse(b)
    nodes = nodes.concat(j['@graph'] || [j])
  } catch (e) {
    fails.push('ld+json nie parsuje sie: ' + e.message)
  }
}
if (!nodes.length) fails.push('brak JSON-LD')
const sites = nodes.filter((n) => n['@type'] === 'WebSite')
if (sites.length > 1) fails.push(`${sites.length} wezly WebSite (ma byc jeden)`)
if (sites.some((n) => !n['@id'])) fails.push('WebSite bez @id')

for (const n of nodes) {
  const t = n['@type']
  if (t === 'SoftwareApplication' || t === 'Product') {
    check(`${t}.name`, n.name)
    // system = sklep widoczny na stronie (iOS -> App Store, Android -> Google Play); inny system bez pokrycia = FAIL
    const STORE = { iOS: 'App Store', Android: 'Google Play' }
    for (const os of String(n.operatingSystem || '').split(/,\s*/).filter(Boolean)) {
      if (!STORE[os]) fails.push(`${t}.operatingSystem "${os}" bez widocznego sklepu na stronie`)
      else check(`${t}.operatingSystem ${os}`, STORE[os])
    }
    check(`${t}.description`, n.description)
    for (const f of n.featureList || []) check(`${t}.featureList`, f)
    for (const k of ['offers', 'aggregateRating', 'review'])
      if (n[k]) fails.push(`${t}.${k}: na stronie nie ma ceny/ocen — usun`)
  }
  if (t === 'WebPage') {
    check('WebPage.name', n.name)
    check('WebPage.description', n.description)
  }
  if (t === 'FAQPage') {
    for (const q of n.mainEntity || []) {
      check('FAQ pytanie', q.name)
      check('FAQ odpowiedz', q.acceptedAnswer && q.acceptedAnswer.text)
    }
  }
  if (t === 'Person' && n['@id'] !== 'https://oleksiakconsulting.com/#person')
    fails.push('Person bez kanonicznego @id https://oleksiakconsulting.com/#person')
}

const checked = nodes.map((n) => n['@type']).join(', ')
if (fails.length) {
  console.log(`FAIL ${url} (${checked})`)
  for (const f of fails) console.log('  - ' + f)
  process.exit(1)
}
console.log(`PASS ${url} — ${nodes.length} wezly (${checked}), caly tekst znacznika widoczny na stronie`)
