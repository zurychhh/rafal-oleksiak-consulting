#!/usr/bin/env node
import chromiumExeMod from './chromium-exe.cjs'; const { chromiumExe } = chromiumExeMod
// R6' (Rafał 24.11.2026 20:55: „wyrzuciłeś sedno strony”): inwentarz sekcji /nawyko.
// Zbiera z DOM (także treść ukrytą: zakładki, sr-only) nagłówki h1–h3, etykiety kroków sceny i identyfikatory sekcji
// i porównuje z wzorcem agencja/inwentarz/<trasa>.json. Każdy nagłówek lub krok z wzorca, którego nie ma w DOM = FAIL,
// chyba że agencja/inwentarz/zgody.json ma dla niego cytat zgody Rafała ({ "tekst": "...", "zgoda": "cytat + data" }).
// Identyfikator sekcji może zniknąć (sekcja weszła np. do kokpitu jako zakładka), ale jego nagłówek musi zostać.
// Użycie: node scripts/section-inventory.mjs <url> [--write]   (tylko localhost)
import { chromium } from 'playwright'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
const [, , url, flag] = process.argv
if (!url || !/^http:\/\/(localhost|127\.0\.0\.1)/.test(url)) { console.error('tylko localhost'); process.exit(2) }
const route = new URL(url).pathname.replace(/^\/|\/$/g, '').replace(/\//g, '_') || 'home'
const dir = new URL('../agencja/inwentarz/', import.meta.url)
const file = new URL(route + '.json', dir)
const exe = chromiumExe()
const b = await chromium.launch(exe ? { executablePath: exe } : {})
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.goto(url, { waitUntil: 'load' })
await p.waitForTimeout(1200)
const norm = (s) => s
const got = await p.evaluate(() => {
  const n = (s) => (s || '').replace(/\s+/g, ' ').trim()
  const root = document.querySelector('main') || document.body
  const heads = [...root.querySelectorAll('h1,h2,h3,summary,dt')].map((e) => n(e.textContent)).filter(Boolean)
  const steps = [...root.querySelectorAll('[data-inv-step], .nk-step')].map((e) => n(e.getAttribute('data-inv-step') || e.textContent)).filter(Boolean)
  const ids = [...root.querySelectorAll('section[id]')].map((e) => e.id)
  const text = n(root.textContent)
  return { heads, steps, ids, text }
})
await b.close()
const uniq = (a) => [...new Set(a)]
const now = { heads: uniq(got.heads), steps: uniq(got.steps), ids: uniq(got.ids) }
if (flag === '--write') {
  mkdirSync(dir, { recursive: true })
  writeFileSync(file, JSON.stringify(now, null, 1) + '\n')
  console.log(`zapisano wzorzec ${route}: ${now.heads.length} nagłówków, ${now.steps.length} kroków, ${now.ids.length} sekcji`)
  process.exit(0)
}
if (!existsSync(file)) { console.error(`brak wzorca agencja/inwentarz/${route}.json — uruchom z --write na stanie zatwierdzonym`); process.exit(1) }
const base = JSON.parse(readFileSync(file, 'utf8'))
const zg = existsSync(new URL('zgody.json', dir)) ? JSON.parse(readFileSync(new URL('zgody.json', dir), 'utf8')) : []
const ok = (t) => zg.some((z) => z.tekst === t && /Rafał|Rafal/.test(z.zgoda || ''))
const miss = []
for (const t of [...base.heads, ...base.steps]) if (!got.text.includes(t) && !ok(t)) miss.push(t)
const goneIds = base.ids.filter((i) => !now.ids.includes(i))
console.log(`inwentarz ${route}: nagłówki ${now.heads.length}/${base.heads.length}, kroki ${now.steps.length}/${base.steps.length}, sekcje ${now.ids.length}/${base.ids.length}`)
if (goneIds.length) console.log('INFO sekcje bez własnego id (nagłówek sprawdzany osobno): ' + goneIds.join(', '))
if (miss.length) { console.log('FAIL zniknęło bez zgody Rafała:\n  - ' + miss.join('\n  - ')); process.exit(1) }
console.log('PASS'); void norm
