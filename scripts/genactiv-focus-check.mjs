#!/usr/bin/env node
import chromiumExeMod from './chromium-exe.cjs'; const { chromiumExe } = chromiumExeMod
// R4 p12 B2 (spec 23, WCAG 2.4.3): where does focus land after choosing each of the 8 chapters from the act bar on
// /work/genactiv? Per chapter: document.activeElement must be the act target (aria-labelledby = ga-t<first act>),
// its accessible name (CDP accessibility tree) non-empty, no visible focus ring for a mouse click (:focus-visible false,
// outline none) and the target heading inside the viewport. navigator.webdriver overridden (R14: else static layout).
// Usage: node scripts/genactiv-focus-check.mjs <url> [w=1440] [h=900] [motion=full|reduce] [shot.png] [shotChapter=1..8]
// Localhost only. Exit 1 on FAIL.
import { chromium } from 'playwright'

const [, , url, w = '1440', h = '900', motion = 'full', shot = '', shotCh = '4'] = process.argv
if (!url || !/^http:\/\/(localhost|127\.0\.0\.1)[:/]/.test(url)) {
  console.error('podaj URL localhost')
  process.exit(2)
}
const CH = [1, 2, 5, 6, 7, 8, 9, 10] // first act of each chapter (ActBar CHAPTERS.from)
const exe = chromiumExe()
const b = await chromium.launch(exe ? { executablePath: exe } : {})
const ctx = await b.newContext({ viewport: { width: +w, height: +h }, reducedMotion: motion === 'reduce' ? 'reduce' : 'no-preference' })
await ctx.addInitScript(() => {
  Object.defineProperty(navigator, 'webdriver', { get: () => false })
  try { localStorage.setItem('cookie-consent', 'accepted') } catch {}
})
const p = await ctx.newPage()
const cdp = await ctx.newCDPSession(p)
await p.goto(url, { waitUntil: 'load' })
await p.waitForTimeout(1500)
const scene = await p.evaluate(() => !!document.querySelector('.ga-track'))
console.log(`${url} ${w}x${h} motion=${motion}: tryb ${scene ? 'scena (przewijanie)' : 'statyczny'}`)

// Show the bar: go to a given act, then scroll up a little (the bar returns on scroll up).
// Static layout below 1100 px: the bar is also hidden near the form, so stay mid-page.
const showBar = async (a) => {
  await p.evaluate((a) => {
    const t = document.querySelector('.ga-track')
    if (t) {
      const r = t.getBoundingClientRect()
      scrollTo(0, scrollY + r.top + ((a + 0.5) / 11) * (r.height - innerHeight))
    } else document.querySelector('.ga-act-' + a)?.scrollIntoView()
  }, a)
  await p.waitForTimeout(250)
  await p.mouse.move(+w / 2, +h / 2)
  await p.mouse.wheel(0, -60)
  await p.waitForTimeout(450)
  return p.evaluate(() => document.querySelector('.ga-ab')?.hasAttribute('data-on'))
}

let ok = 0
for (let i = 0; i < CH.length; i++) {
  const want = 'ga-t' + CH[i]
  let on = await showBar(i % 2 ? 3 : 6)
  if (!on) on = await showBar(i % 2 ? 4 : 7)
  if (!on) { console.log(`FAIL rozdzial ${i + 1}: pasek niewidoczny`); continue }
  await p.click('.ga-ab-toggle')
  await p.waitForTimeout(150)
  await p.click(`.ga-ab-list li:nth-child(${i + 1}) a`)
  await p.waitForTimeout(800)
  const r = await p.evaluate(() => {
    const a = document.activeElement
    const lid = a?.getAttribute('aria-labelledby') || ''
    const head = lid ? document.getElementById(lid) : null
    const hr = head?.getBoundingClientRect()
    return {
      tag: a ? a.tagName.toLowerCase() + (a.className && typeof a.className === 'string' ? '.' + a.className.split(/\s+/)[0] : '') : 'null',
      lid,
      tabindex: a?.getAttribute('tabindex'),
      inBar: !!a?.closest('.ga-ab'),
      fv: !!a?.matches(':focus-visible'),
      outline: a ? getComputedStyle(a).outlineStyle : '',
      headIn: !!hr && hr.top >= 0 && hr.bottom <= innerHeight && hr.height > 0,
    }
  })
  const { result } = await cdp.send('Runtime.evaluate', { expression: 'document.activeElement' })
  let name = '', role = ''
  try {
    const { nodes } = await cdp.send('Accessibility.getPartialAXTree', { objectId: result.objectId, fetchRelatives: false })
    name = nodes[0]?.name?.value || ''
    role = nodes[0]?.role?.value || ''
  } catch {}
  const hit = r.lid === want && r.tabindex === '-1' && !r.inBar && name.trim() !== '' && !r.fv && r.outline === 'none' && r.headIn
  if (hit) ok++
  console.log(`${hit ? 'PASS' : 'FAIL'} rozdzial ${i + 1} (${want}): fokus ${r.tag}[aria-labelledby=${r.lid || '-'}] tabindex=${r.tabindex} rola=${role} nazwa="${name.slice(0, 60)}" focus-visible=${r.fv} outline=${r.outline} naglowek w oknie=${r.headIn}`)
  if (shot && i + 1 === +shotCh) await p.screenshot({ path: shot })
}
console.log(`${ok === CH.length ? 'PASS' : 'FAIL'} fokus po skoku z paska: ${ok}/${CH.length}`)
await b.close()
process.exit(ok === CH.length ? 0 : 1)
