// R42: kazdy <link rel="preload" as="font"> na trasie musi wskazywac krój, ktory strona naprawde rysuje.
// 27.11 /stop dostal preload DM Sans + Poppins, a rysuje wszystko Instrument Sans (zmierzone na starym serwerze);
// zlapal to dopiero recenzent. Zrodlo: web.dev „Best practices for fonts” (https://web.dev/articles/font-best-practices):
// preload tylko krytycznych fontow uzywanych na stronie, nieuzyty preload zabiera pasmo i nic nie skraca.
// Metoda: FontFace ze statusem 'loaded' (status zmienia sie dopiero, gdy krój jest potrzebny do rysowania — sam preload go
// nie zmienia) dopasowane po rodzinie/wadze/zakresie do regul @font-face, z nich URL-e; preload spoza tej listy = FAIL.
// Uzycie: node scripts/font-preload-check.mjs <base-url> <trasa>...   (tylko localhost)
import { chromium } from 'playwright'
import chromiumExeMod from './chromium-exe.cjs'
const { chromiumExe } = chromiumExeMod
const argv = process.argv.slice(2)
const SELF = argv.includes('--selftest')   // kontrola pozytywna: wstrzykniety preload nieuzywanego kroju na pierwszej trasie MUSI dac FAIL
const [base, ...routes] = argv.filter(a => a !== '--selftest')
if (!base || !/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/.test(base)) { console.log('FONTPRELOAD FAIL odmowa: tylko localhost'); process.exit(2) }
const b = await chromium.launch({ executablePath: chromiumExe() })
let fail = 0, checked = 0
for (const vp of [[390, 844], [1440, 900]]) for (const r of routes) {
  const p = await b.newPage({ viewport: { width: vp[0], height: vp[1] } })
  if (SELF) await p.route(u => new URL(u).pathname === r, async (route) => {
    const res = await route.fetch(); const body = (await res.text()).replace('</head>', '<link rel="preload" as="font" type="font/woff2" crossorigin="" href="/fonts/poppins-600-latin.woff2"/></head>')
    await route.fulfill({ response: res, body })
  })
  const resp = await p.goto(base.replace(/\/$/, '') + r, { waitUntil: 'networkidle' })
  // Tylko preloady z HTML-a serwera: Next przy prefetchu linku (np. do /) dokleja do <head> preloady TAMTEJ trasy —
  // to przygotowanie nastepnej strony, nie preload tej (pierwszy przebieg 27.11 dal przez to 8 falszywych FAIL).
  const html = await resp.text()
  const serverPre = [...html.matchAll(/<link[^>]*rel="preload"[^>]*>/g)].map(m => m[0]).filter(t => /as="font"/.test(t)).map(t => new URL(t.match(/href="([^"]+)"/)[1], base).pathname)
  await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(f => setTimeout(f, 40)) } scrollTo(0, 0); await document.fonts.ready })
  const res = await p.evaluate(() => {
    const abs = (u) => new URL(u, location.href).pathname
    const rules = []
    const walk = (list) => { for (const ru of list) { if (ru instanceof CSSFontFaceRule) rules.push(ru); else if (ru.cssRules) walk(ru.cssRules) } }
    for (const s of document.styleSheets) { try { walk(s.cssRules) } catch {} }
    const norm = (f) => f.replace(/["']/g, '').trim()
    const used = new Set()
    for (const ff of document.fonts) {
      if (ff.status !== 'loaded') continue
      for (const ru of rules) {
        const st = ru.style
        if (norm(st.getPropertyValue('font-family')) !== norm(ff.family)) continue
        if ((st.getPropertyValue('unicode-range') || 'U+0-10FFFF').replace(/\s/g, '').toLowerCase() !== (ff.unicodeRange || 'U+0-10FFFF').replace(/\s/g, '').toLowerCase()) continue
        const w = st.getPropertyValue('font-weight') || '400'
        if (w.replace(/\s+/g, ' ') !== String(ff.weight).replace(/\s+/g, ' ')) continue
        for (const m of st.getPropertyValue('src').matchAll(/url\(["']?([^"')]+)["']?\)/g)) used.add(abs(m[1]))
      }
    }
    return { used: [...used] }
  })
  for (const u of serverPre) {
    checked++
    const ok = res.used.includes(u)
    if (!ok) fail++
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${r} ${vp[0]}: preload ${u}${ok ? '' : ` — strona go nie rysuje (rysuje: ${res.used.join(', ') || 'brak'})`}`)
  }
  await p.close()
}
await b.close()
if (SELF) { const ok = fail === 2 * routes.length; console.log(`FONTPRELOAD-SELFTEST ${ok ? 'PASS' : 'FAIL'} wykryte=${fail} oczekiwane=${2 * routes.length}`); process.exit(ok ? 0 : 1) }
console.log(`FONTPRELOAD ${fail ? 'FAIL' : 'PASS'} fail=${fail} preloadow=${checked} tras=${routes.length}`)
process.exit(fail ? 1 : 0)
