// Spec 28: zrzuty pieciu chwil finalu /nawyko (+ stan po finale). Tylko localhost / podglad.
import chromiumExeMod from './chromium-exe.cjs'; const { chromiumExe } = chromiumExeMod
import { chromium } from 'playwright'
const [,, url, out, ...vps] = process.argv
if (!url || /oleksiakconsulting\.com/.test(url)) { console.error('localhost/podglad, nie produkcja'); process.exit(2) }
const exe = chromiumExe()
const b = await chromium.launch(exe ? { executablePath: exe } : {})
for (const vp of vps) {
  const [w,h] = vp.split('x').map(Number)
  const p = await b.newPage({ viewport: { width: w, height: h } })
  const errs = []; p.on('console', m => { if (m.type()==='error') errs.push(m.text()) }); p.on('pageerror', e=>errs.push(String(e)))
  await p.goto(url, { waitUntil: 'networkidle' })
  if (process.env.BRAND) { await p.fill('.nk-hbrand input[type=text]', process.env.BRAND); await p.locator('.nk-hbrand input[aria-label="Ocean blue"]').check({force:true}) }
  const el = await p.$('#finale'); const top = await el.evaluate(e => e.getBoundingClientRect().top + scrollY); const H = await el.evaluate(e => e.offsetHeight)
  for (let i=0;i<5;i++){ await p.evaluate(y=>scrollTo(0,y), top + (H-h)*((i+0.5)/5)); await p.waitForTimeout(900)
    const info = await p.evaluate(()=>{const ph=document.querySelector('.nk-fz-phone').getBoundingClientRect(); return {at:document.querySelector('#finale').dataset.at, pw:Math.round(ph.width), ph:Math.round(ph.height), pb:Math.round(ph.bottom), ih:innerHeight}})
    console.log(vp, i, JSON.stringify(info))
    await p.screenshot({ path: `${out}-${vp}-${i}.png` }) }
  await p.evaluate(y=>scrollTo(0,y), top + H - h + 300); await p.waitForTimeout(600); await p.screenshot({ path: `${out}-${vp}-5.png` })
  console.log('errors', errs.slice(0,3))
  await p.close()
}
await b.close()
