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
  // recenzja 43 W1: zgubione zdania (nie tylko naglowki) — akapity i punkty list sa czescia inwentarza
  const texts = [...root.querySelectorAll('p, li')].filter((e) => !e.querySelector('p, li')).map((e) => n(e.textContent)).filter((t) => t.length >= 12)
  const text = n(root.textContent)
  // R29 (lekcja R28.2 powtórzona w recenzji 43): dwie kolejne widoczne sekcje najwyższego poziomu o tym samym tle = FAIL
  const top = [...root.querySelectorAll('section')].filter((e) => !e.parentElement.closest('section') && e.offsetHeight > 200)
  const bg = (e) => { const c = getComputedStyle(e); return c.backgroundColor + '|' + c.backgroundImage }
  const same = []
  for (let i = 1; i < top.length; i++) if (bg(top[i]) === bg(top[i - 1]) && !bg(top[i]).startsWith('rgba(0, 0, 0, 0)|none')) same.push((top[i - 1].id || top[i - 1].className) + ' + ' + (top[i].id || top[i].className))
  return { heads, steps, ids, texts, text, same }
})
await b.close()
const uniq = (a) => [...new Set(a)]
const now = { heads: uniq(got.heads), steps: uniq(got.steps), ids: uniq(got.ids), texts: uniq(got.texts) }
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
for (const t of [...base.heads, ...base.steps, ...(base.texts || [])]) if (!got.text.includes(t) && !ok(t)) miss.push(t)
const goneIds = base.ids.filter((i) => !now.ids.includes(i))
console.log(`inwentarz ${route}: nagłówki ${now.heads.length}/${base.heads.length}, kroki ${now.steps.length}/${base.steps.length}, sekcje ${now.ids.length}/${base.ids.length}`)
if (goneIds.length) console.log('INFO sekcje bez własnego id (nagłówek sprawdzany osobno): ' + goneIds.join(', '))
if (got.same.length) { console.log('FAIL dwie kolejne sekcje w tym samym tle: ' + got.same.join('; ')); if (!miss.length) process.exit(1) }
if (miss.length) { console.log('FAIL zniknęło bez zgody Rafała:\n  - ' + miss.join('\n  - ')); process.exit(1) }
console.log('PASS'); void norm
