/**
 * Prerender strony z Claude Design — czesc scripts/ship-design.mjs.
 *
 * Problem: strona jest szablonem <x-dc>, ktory rysuje dopiero runtime Claude
 * Design + React 18 po hydratacji Nexta. Do tego czasu ekran jest pusty, a bez
 * JS pusty na zawsze (telefon na slabym laczu, podglad linku na LinkedInie,
 * wyszukiwarki, odpowiedzi AI).
 *
 * Rozwiazanie: przy przenoszeniu renderujemy stronę headless DOKLADNIE tym samym
 * runtime'em i tymi samymi plikami, ktore pojada na produkcje (maly serwer HTTP
 * w pamieci, zero sieci), i zapisujemy gotowy DOM. Serwer podaje go od razu,
 * a runtime po starcie przejmuje strone (app/design/DcBoot.tsx).
 *
 * Uklad strony liczy logika komponentu z szerokosci okna (progi w JS, style
 * inline), wiec jeden zrzut nie pasuje do wszystkich szerokosci. Progi znajdujemy
 * sami, bez wiedzy o konkretnej wersji: renderujemy na siatce szerokosci,
 * a tam, gdzie HTML sie zmienia, szukamy granicy bisekcja z dokladnoscia do 1 px.
 * Kazdy przedzial dostaje swoj zrzut, a wlasciwy wybiera media query.
 *
 * Stan zrzutu: gora strony, bez przewijania, `prefers-reduced-motion: reduce`.
 * Przy zredukowanym ruchu komponent nie zaslania tresci pod animacje (wszystko
 * czytelne bez JS), a pierwszy ekran jest identyczny z tym, co runtime rysuje
 * po starcie — sprawdzane zrzutami w bramce. Zegar i strefa sa zamrozone,
 * zeby zrzut byl deterministyczny (ship-design musi byc idempotentny).
 */
import { createServer } from 'node:http'
import { existsSync } from 'node:fs'

const GRID = [320, 360, 390, 420, 480, 560, 640, 700, 740, 760, 768, 800, 860, 900, 960, 1024,
  1100, 1200, 1280, 1366, 1440, 1600, 1728, 1920, 2560]

/** Klasy arkusza pseudo-klas runtime'u (scp0, scp1…) dostaja prefiks, zeby zrzut
    nie kolidowal z arkuszem, ktory runtime zbuduje po przejeciu. */
const renameScp = (s) => s.replace(/\bscp([0-9a-z]+)\b/g, 'dcpre-scp$1')

const MAIL = 'rafal@oleksiakconsulting.com'
const NOSCRIPT_NOTE =
  `<noscript><p style="margin:0;font-size:13px;line-height:1.45;color:#14161A">` +
  `JavaScript is off, so this form cannot send. Write to ` +
  `<a href="mailto:${MAIL}">${MAIL}</a> instead.</p></noscript>`

export async function prerender({ template, script, runtime, resources, assets }) {
  const { chromium } = await import('playwright')

  // ── serwer w pamieci: strona testowa + pliki /dc/* dokladnie te, ktore pojada
  const page0 =
    '<!doctype html><html><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<script>window.__resources=' + JSON.stringify(resources).replace(/</g, '\\u003c') + '</script>' +
    '</head><body><x-dc>' + template + '</x-dc>' + script +
    '<script src="' + runtime + '"></script></body></html>'
  const byUrl = new Map(Object.values(assets).map((a) => [a.url, a]))
  const server = createServer((req, res) => {
    const path = (req.url || '/').split('?')[0]
    if (path === '/') { res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); res.end(page0); return }
    const a = byUrl.get(path)
    if (!a) { res.writeHead(404); res.end(); return }
    res.writeHead(200, { 'content-type': a.mime }); res.end(a.bytes)
  })
  await new Promise((r) => server.listen(0, '127.0.0.1', r))
  const base = `http://127.0.0.1:${server.address().port}/`

  const pinned = process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
  const browser = await chromium.launch(existsSync(pinned) ? { executablePath: pinned } : {})
  try {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: 'reduce',
      locale: 'en-GB',
      timezoneId: 'UTC',
    })
    const page = await ctx.newPage()
    const external = []
    page.on('request', (r) => { if (!r.url().startsWith(base)) external.push(r.url()) })
    await page.clock.setFixedTime(new Date('2026-01-01T09:00:00Z'))
    await page.goto(base, { waitUntil: 'networkidle' })
    await page.waitForSelector('#dc-root', { timeout: 20000 })
    await page.waitForTimeout(800)
    if (external.length) throw new Error('Prerender siegnal poza serwer lokalny: ' + external.join(', '))

    const snap = async (w) => {
      await page.setViewportSize({ width: w, height: 900 })
      // tick() komponentu chodzi co 100 ms i na resize; dajemy mu kilka obrotow
      await page.waitForTimeout(350)
      return page.evaluate(() => {
        const root = document.getElementById('dc-root')
        return root.innerHTML.replace(/\s+data-dc-tpl="[^"]*"/g, '')
      })
    }

    // ── siatka + bisekcja granic
    const cache = new Map()
    const at = async (w) => { if (!cache.has(w)) cache.set(w, await snap(w)); return cache.get(w) }
    for (const w of GRID) await at(w)
    const edges = [] // pierwsza szerokosc nowego przedzialu
    for (let i = 1; i < GRID.length; i++) {
      let lo = GRID[i - 1], hi = GRID[i]
      if ((await at(lo)) === (await at(hi))) continue
      // wewnatrz moze byc kilka granic — szukamy ich po kolei od lewej
      while (lo < hi) {
        let a = lo, b = hi
        const left = await at(lo)
        while (b - a > 1) {
          const m = (a + b) >> 1
          if ((await at(m)) === left) a = m; else b = m
        }
        edges.push(b)
        lo = b
        if ((await at(lo)) === (await at(hi))) break
      }
    }
    // Przedzialy [min, max] i ich HTML; identyczny HTML dzieli jeden element.
    const starts = [0, ...edges]
    const ranges = starts.map((min, i) => ({ min, max: i + 1 < starts.length ? starts[i + 1] - 1 : null }))
    const htmls = []
    const buckets = []
    for (const r of ranges) {
      const html = await at(Math.max(r.min, GRID[0]))
      let k = htmls.indexOf(html)
      if (k < 0) { htmls.push(html); k = htmls.length - 1; buckets.push({ html, ranges: [] }) }
      buckets[k].ranges.push(r)
    }

    // ── arkusze: wszystko, co runtime wstawil do <head> (helmet, fonty, baza,
    //    pseudo-klasy). Czytane z CSSOM, bo pseudo-klasy ida przez insertRule.
    const css = await page.evaluate(() => {
      const out = []
      for (const el of document.head.querySelectorAll('style')) {
        try { for (const r of el.sheet.cssRules) out.push(r.cssText) } catch { /* obcy arkusz */ }
      }
      return out.join('\n')
    })

    // ── obrobka zrzutu: formularze widoczne, ale bez JS nie wysylaja niczego
    //    (GET na "/" wrzucilby e-mail do adresu); przed przejeciem LeadBridge je pomija.
    const finish = (html) => renameScp(html)
      .replace(/<form\b([^>]*)>/g, (m, attrs) => '<form' + attrs.replace(/\s(action|method)="[^"]*"/g, '') + ' action="javascript:void(0)">')
      .replace(/<\/form>/g, NOSCRIPT_NOTE + '</form>')

    // Fonty w tym arkuszu ship-design zamienia na data: URI (patrz tam) — zrzut
    // ma kroj od pierwszego malowania, bez przelamania po dociagnieciu fontu.
    // Rodziny z @font-face zrzutu dostaja prefiks. Ta sama nazwa bywa zadeklarowana
    // takze w arkuszach serwisu (app/fonts.css ma wlasne „Instrument Sans" pod innym
    // adresem): document.fonts.load() czekalby wtedy na oba komplety plikow.
    // Z prefiksem zrzut czeka tylko na swoje fonty (te z preloadu w <head>).
    const fams = [...new Set([...css.matchAll(/@font-face\s*\{[^}]*font-family:\s*"?([^";]+)"?/g)].map((m) => m[1].trim()))]
    const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const prefixFams = (t) => fams.reduce((acc, f) => acc
      .replace(new RegExp('(["\']|&quot;)' + esc(f) + '\\1', 'g'), (m, q) => q + 'dcpre ' + f + q), t)

    return {
      css: prefixFams(renameScp(css)),
      buckets: buckets.map((b) => ({ ranges: b.ranges, html: prefixFams(finish(b.html)) })),
      edges,
    }
  } finally {
    await browser.close()
    server.close()
  }
}
