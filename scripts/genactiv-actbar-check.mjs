#!/usr/bin/env node
import chromiumExeMod from './chromium-exe.cjs'; const { chromiumExe } = chromiumExeMod
// R4 p11 B (spec 22): pasek aktow na /work/genactiv — kolejnosc Tab, inert przy ukryciu, skoki 8/8, CLS przy przewijaniu
// kolkiem ze zrodlami (layout-shift sources). navigator.webdriver nadpisany (R14: inaczej uklad statyczny).
// Uzycie: node scripts/genactiv-actbar-check.mjs <url> [szer=1440] [wys=900] [tryb=all|cls] [zrzut.png]
// Tylko localhost. Kod wyjscia 1 przy FAIL.
import { chromium } from 'playwright'

const [, , url, w = '1440', h = '900', mode = 'all', shot = ''] = process.argv
if (!url || !/^http:\/\/(localhost|127\.0\.0\.1)[:/]/.test(url)) {
  console.error('podaj URL localhost')
  process.exit(2)
}
const exe = chromiumExe()
const b = await chromium.launch(exe ? { executablePath: exe } : {})
const ctx = await b.newContext({ viewport: { width: +w, height: +h } })
await ctx.addInitScript(() => {
  Object.defineProperty(navigator, 'webdriver', { get: () => false })
  try { localStorage.setItem('cookie-consent', 'accepted') } catch {}
  window.__ls = []
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) {
      if (e.hadRecentInput) continue
      const src = (e.sources || []).map((s) => {
        const n = s.node
        let d = n ? n.nodeName : '?'
        if (n && n.nodeType === 1) {
          d = n.nodeName.toLowerCase() + (n.id ? '#' + n.id : '') + (n.className && typeof n.className === 'string' ? '.' + n.className.trim().split(/\s+/).join('.') : '')
          const par = n.parentElement
          if (par) d += ' < ' + par.nodeName.toLowerCase() + (typeof par.className === 'string' && par.className ? '.' + par.className.trim().split(/\s+/)[0] : '')
        } else if (n && n.parentElement) {
          d = '#text < ' + n.parentElement.nodeName.toLowerCase() + '.' + String(n.parentElement.className).split(/\s+/)[0]
        }
        const r = (x) => `${Math.round(x.x)},${Math.round(x.y)} ${Math.round(x.width)}x${Math.round(x.height)}`
        return { d, from: r(s.previousRect), to: r(s.currentRect) }
      })
      window.__ls.push({ v: e.value, t: Math.round(e.startTime), y: Math.round(scrollY), src })
    }
  }).observe({ type: 'layout-shift', buffered: true })
})
const p = await ctx.newPage()
await p.goto(url, { waitUntil: 'load' })
await p.waitForTimeout(1500)
let fail = 0
const log = (ok, msg) => { if (!ok) fail++; console.log(`${ok ? 'PASS' : 'FAIL'} ${msg}`) }

// --- CLS przy przewijaniu kolkiem (jak scroll-perf.mjs, bez dlawienia) ---
const loadCls = await p.evaluate(() => window.__ls.reduce((a, e) => a + e.v, 0))
await p.evaluate(() => { window.__ls.length = 0 })
await p.mouse.move(+w / 2, +h / 2)
const total = await p.evaluate(() => document.documentElement.scrollHeight)
for (let i = 0; i < Math.ceil(total / 120); i++) {
  await p.mouse.wheel(0, 120)
  await p.waitForTimeout(50)
}
await p.waitForTimeout(500)
const ls = await p.evaluate(() => window.__ls)
const wheelCls = ls.reduce((a, e) => a + e.v, 0)
console.log(`CLS ${w}x${h}: wejscie ${loadCls.toFixed(4)}, przewijanie kolkiem ${wheelCls.toFixed(4)} (${ls.length} przesuniec)`)
for (const e of ls) console.log(`  ${e.v.toFixed(5)} t=${e.t} scrollY=${e.y} ${JSON.stringify(e.src)}`)

if (mode === 'all') {
  // --- kolejnosc DOM / Tab ---
  await p.evaluate(() => scrollTo(0, 0))
  await p.waitForTimeout(300)
  const order = await p.evaluate(() => {
    const bar = document.querySelector('.ga-ab')
    const scene = document.querySelector('.ga-track, .ga-still')
    return {
      barBeforeScene: !!bar && !!scene && !!(bar.compareDocumentPosition(scene) & Node.DOCUMENT_POSITION_FOLLOWING),
      inertAtTop: !!bar && bar.inert === true,
      scrollMode: !!document.querySelector('.ga-track'),
    }
  })
  log(order.barBeforeScene, `pasek .ga-ab przed ${order.scrollMode ? '.ga-track' : '.ga-still'} w DOM`)
  log(order.inertAtTop, 'pasek inert na akcie 0 (ukryty)')

  // pasek widoczny: zejdz do aktu 2, potem lekko w gore (pasek wraca przy przewijaniu w gore)
  const goAct = async (a) => {
    await p.evaluate((a) => {
      const t = document.querySelector('.ga-track')
      if (t) {
        const r = t.getBoundingClientRect()
        scrollTo(0, scrollY + r.top + ((a + 0.5) / 11) * (r.height - innerHeight))
      } else document.querySelector('.ga-act-' + a)?.scrollIntoView()
    }, a)
    await p.waitForTimeout(250)
    await p.mouse.wheel(0, -60)
    await p.waitForTimeout(400)
  }
  const narrow = +w < 1100
  // < 1100 px w scenie pasek ustepuje — sprawdzamy go za scena (nad formularzem jest ukryty), wiec na waskim ekranie
  // test kolejnosci Tab robimy w akcie 1 na szerokim; tu tylko ze inert zgadza sie z widocznoscia.
  await goAct(2)
  const st = await p.evaluate(() => {
    const bar = document.querySelector('.ga-ab')
    return { on: bar.hasAttribute('data-on'), inert: bar.inert }
  })
  log(st.on === !st.inert, `inert zgodny z widocznoscia w akcie 2 (on=${st.on}, inert=${st.inert})`)
  if (!narrow) {
    log(st.on, 'pasek widoczny w akcie 2 po przewinieciu w gore (1440)')
    // (a) kolejnosc sekwencyjna: elementy osiagalne Tabem (bez inert/hidden) w kolejnosci dokumentu
    const tabbables = await p.evaluate(() =>
      [...document.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])')]
        .filter((e) => !e.closest('[inert]') && !e.closest('[hidden]') && e.getClientRects().length && e.tabIndex >= 0)
        .map((e) => (e.closest('.ga-ab') ? 'PASEK' : e.closest('.ga-track, .ga-still') ? 'AKT' : e.closest('#enquiry') ? 'FORM' : 'NAW')),
    )
    const comp = tabbables.filter((x, i) => x !== tabbables[i - 1])
    console.log('  kolejnosc Tab (grupy): ' + comp.join(' → '))
    const fb = tabbables.indexOf('PASEK')
    const fa = tabbables.indexOf('AKT')
    log(fb !== -1 && fb < fa, 'Tab: pasek przed trescia aktow (kolejnosc dokumentu)')
    // (b) Shift+Tab z punktu startu nawigacji w tresci aktu (klik w pusty obszar sceny) trafia w pasek
    const pt = await p.evaluate(() => {
      const r = document.querySelector('.ga-stage').getBoundingClientRect()
      return { x: r.left + 8, y: r.top + r.height * 0.6 }
    })
    await p.mouse.click(pt.x, pt.y)
    await p.keyboard.press('Shift+Tab')
    const back = await p.evaluate(() => {
      const a = document.activeElement
      return (a.closest('.ga-ab') ? 'PASEK:' : a.closest('.ga-track') ? 'AKT:' : 'INNE:') + (a.textContent || '').trim().slice(0, 30)
    })
    console.log('  Shift+Tab z tresci aktu 2: ' + back)
    log(back.startsWith('PASEK:'), 'Shift+Tab z tresci aktu trafia w pasek (bezposrednio przed scena)')
    if (shot) {
      await p.evaluate(() => document.querySelector('.ga-ab-toggle')?.focus())
      await p.waitForTimeout(300)
      await p.screenshot({ path: shot })
    }
    // --- skoki 8/8 ---
    const chapters = [1, 2, 5, 6, 7, 8, 9, 10]
    let ok = 0
    for (let i = 0; i < chapters.length; i++) {
      await goAct(i % 2 ? 3 : 6)
      await p.evaluate(() => {
        const bar = document.querySelector('.ga-ab')
        if (!bar.hasAttribute('data-on')) throw new Error('pasek ukryty')
      }).catch(() => {})
      await p.click('.ga-ab-toggle')
      await p.waitForTimeout(150)
      await p.click(`.ga-ab-list li:nth-child(${i + 1}) a`)
      await p.waitForTimeout(700)
      const r = await p.evaluate(() => {
        const vis = [...document.querySelectorAll('.ga-copy-in')].find((e) => getComputedStyle(e).opacity === '1')
        const id = vis?.getAttribute('aria-labelledby') || ''
        const fid = document.activeElement?.getAttribute('aria-labelledby') || ''
        return { id, fid }
      })
      const want = 'ga-t' + chapters[i]
      const hit = r.id === want && r.fid === want
      if (hit) ok++
      else console.log(`  skok ${i + 1}: chcialem ${want}, widoczny ${r.id}, fokus ${r.fid}`)
    }
    log(ok === 8, `skoki z paska ${ok}/8 trafiaja w akt (widoczny + fokus)`)
  } else if (shot) {
    // waski ekran: pasek widoczny za scena (nad formularzem jeszcze nie), fokus na przycisku
    await p.evaluate(() => {
      const f = document.getElementById('enquiry')
      scrollTo(0, scrollY + f.getBoundingClientRect().top - innerHeight * 0.8)
    })
    await p.waitForTimeout(300)
    await p.mouse.wheel(0, -60)
    await p.waitForTimeout(500)
    const on = await p.evaluate(() => document.querySelector('.ga-ab').hasAttribute('data-on'))
    log(on, 'pasek widoczny za scena (390)')
    await p.evaluate(() => document.querySelector('.ga-ab-toggle')?.focus())
    await p.waitForTimeout(300)
    await p.screenshot({ path: shot })
  }
}
await b.close()
process.exit(fail ? 1 : 0)
