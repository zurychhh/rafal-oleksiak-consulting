// PILNE 2 pkt 1 (Rafal 28.11.2026, blad z podgladu): „Reveal without scratching” przestawal dzialac po zmianie nazwy,
// koloru albo stylu marki. Test regresji (stala czesc bramki brand-propagation, Chromium; WebKit: reveal-after-brand-webkit.py):
// dla karty w hero i w finale: Reveal → zmiana marki (nazwa + kolor + styl) → karta znow zaslonieta i wymalowana →
// przeciagniecie zdrapuje → Reveal odslania → druga zmiana (sama nazwa, ten sam kolor folii) → karta znow cala → Reveal.
// Uzycie: node scripts/reveal-after-brand.mjs http://localhost:3000   (tylko localhost)
import { chromium } from 'playwright'
import { readFileSync } from 'fs'
import { createRequire } from 'module'
const { chromiumExe } = createRequire(import.meta.url)('./chromium-exe.cjs')
const base = process.argv[2] || 'http://localhost:3000'
if (!/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/.test(base)) { console.error('localhost only'); process.exit(2) }
const check = readFileSync(new URL('./reveal-after-brand.check.js', import.meta.url), 'utf8')
const b = await chromium.launch({ executablePath: chromiumExe() })
let fail = 0
const BTN = { hero: '.nk-hbrand button.nk-link', finale: '.nk-fz-act button.nk-link' }
for (const [w, h] of [[390, 844], [1440, 900]]) {
  for (const which of ['hero', 'finale']) {
    const p = await b.newPage({ viewport: { width: w, height: h } })
    await p.goto(base + '/nawyko', { waitUntil: 'networkidle' })
    await p.evaluate(() => { try { localStorage.removeItem('oc-brand-v1') } catch {} })
    await p.reload({ waitUntil: 'networkidle' })
    const res = []
    const st = () => p.evaluate(`(${check})(${JSON.stringify(which)})`)
    const show = async () => {
      if (which === 'hero') { await p.evaluate(() => window.scrollTo(0, 0)) }
      else { await p.locator('.nk-fz-dots button').nth(2).click() /* chwila 07:32: ekran aplikacji z karta (data-at 2) */ }
      await p.waitForTimeout(500)
    }
    const brand = async (name, colourIdx, skinIdx) => {
      await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(200)
      await p.fill('.nk-hbrand input[type=text]', name)
      if (colourIdx != null) await p.locator('.nk-hbrand input[name="nk-hero-colour"]').nth(colourIdx).check({ force: true })
      if (skinIdx != null) await p.locator('.nk-hbrand input[name="nk-skin"]').nth(skinIdx).check({ force: true })
      await p.waitForTimeout(300)
    }
    // martwy przycisk (aria-disabled po raz odslonietej karcie — blad z 28.11) = FAIL kroku, nie wyjatek
    const reveal = async () => { await show(); try { await p.locator(BTN[which]).click({ timeout: 3000 }) } catch { res.push('click:dead') } await p.waitForTimeout(400) }
        const expect = (label, ok, s) => { res.push(`${label}:${ok ? 'ok' : 'FAIL'}`); if (!ok) { fail++; console.log(`  ${which} ${w} ${label} FAIL ${JSON.stringify(s)}`) } }
    let s
    await reveal(); s = await st(); expect('reveal0', !!s.status && s.gone, s)
    await brand('Acme', 2, 1); await show(); s = await st(); expect('rearm1', !s.status && !s.gone && s.cleared >= 0 && s.cleared < 0.02, s)
    // przeciagniecie palcem/mysza: krotki zygzak przez lewa czesc karty
    s = await st()
    await p.mouse.move(s.x + s.w * 0.15, s.y + s.h * 0.3); await p.mouse.down()
    await p.mouse.move(s.x + s.w * 0.35, s.y + s.h * 0.7, { steps: 6 }); await p.mouse.move(s.x + s.w * 0.2, s.y + s.h * 0.5, { steps: 6 }); await p.mouse.up()
    await p.waitForTimeout(150); s = await st(); expect('drag1', s.cleared > 0.03 && !s.gone, s)
    await reveal(); s = await st(); expect('reveal1', !!s.status && s.gone, s)
    await brand('Acme Labs', null, null); await show(); s = await st(); expect('rearm2', !s.status && !s.gone && s.cleared >= 0 && s.cleared < 0.02, s)
    await reveal(); s = await st(); expect('reveal2', !!s.status && s.gone, s)
    if (res.includes('click:dead')) fail++
    console.log(`REVEAL ${w} ${which} ${res.every((r) => r.endsWith('ok')) ? 'PASS' : 'FAIL'} ${res.join(' ')}`)
    await p.close()
  }
}
await b.close()
console.log(`REVEAL RESULT ${fail ? 'FAIL' : 'PASS'} fails=${fail}`)
process.exit(fail ? 1 : 0)
