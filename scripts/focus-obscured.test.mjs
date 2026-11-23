// WCAG 2.2 SC 2.4.11 Focus Not Obscured (Minimum): no Tab stop may sit fully under the fixed cookie bar.
// Usage: PW_CHROMIUM=... node scripts/focus-obscured.test.mjs http://localhost:3000 /nawyko /lab/home ...
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require(require('node:child_process').execSync('npm root -g').toString().trim() + '/playwright')); }
const [base, ...routes] = process.argv.slice(2);
if (!base || !routes.length) { console.error('usage: focus-obscured.test.mjs <base> <route>...'); process.exit(2); }
const b = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
let bad = 0;
for (const [w, h] of [[390, 844], [1440, 900]]) for (const r of routes) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto(base + r, { waitUntil: 'networkidle' });
  await p.waitForTimeout(500);
  for (let i = 0; i < 80; i++) {
    await p.keyboard.press('Tab');
    const o = await p.evaluate(() => {
      const e = document.activeElement; if (!e || e === document.body) return null;
      const bar = [...document.querySelectorAll('body *')].find((n) => { const s = getComputedStyle(n); return s.position === 'fixed' && n.getBoundingClientRect().bottom >= innerHeight - 1 && n.getBoundingClientRect().height > 30 && n.getBoundingClientRect().height < innerHeight / 2; });
      if (!bar || bar.contains(e)) return null;
      const t = bar.getBoundingClientRect().top, rc = e.getBoundingClientRect();
      return rc.height && rc.top >= t ? (e.textContent || e.getAttribute('aria-label') || e.tagName).trim().slice(0, 40) : null;
    });
    if (o) { console.error(`${w} ${r}: focus hidden under fixed bar: "${o}"`); bad++; }
  }
  await p.close();
}
await b.close();
if (bad) { console.error(`focus-obscured: ${bad} hidden focus stop(s)`); process.exit(1); }
console.log('focus-obscured: OK');
