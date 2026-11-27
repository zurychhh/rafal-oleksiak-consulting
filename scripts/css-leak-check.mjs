// R40: arkusz trasy nie moze zmieniac innej trasy po nawigacji klienckiej (Next App Router zostawia CSS poprzedniej trasy
// w dokumencie). Dla kazdej trasy-zrodla: wejscie, nawigacja kliencka (next/link przez router) na trasy docelowe,
// porownanie stylow html/body/section z wejsciem bezposrednim. Uzycie: node scripts/css-leak-check.mjs <base> [zrodlo...]
import chromiumExeMod from './chromium-exe.cjs'; const { chromiumExe } = chromiumExeMod
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const [base, ...src] = process.argv.slice(2);
if (!base) { console.error('usage: css-leak-check.mjs <base> [route...]'); process.exit(2); }
const sources = src.length ? src : ['/privacy', '/blog', '/tool', '/stop', '/design'];
const targets = ['/', '/nawyko', '/work/genactiv', '/calculator'];
const PROPS = ['overflow-x', 'max-width', 'scroll-behavior', 'scroll-padding-top', 'scroll-padding-bottom', 'background-color', 'color', 'font-family', 'font-size', 'margin-top'];
const SECT = ['padding-top', 'transform', 'overflow-x', 'max-width', 'font-family'];
const snap = (p) => p.evaluate(([P, S]) => {
  const pick = (el, L) => { const c = getComputedStyle(el); return Object.fromEntries(L.map((k) => [k, c.getPropertyValue(k)])); };
  return { html: pick(document.documentElement, P), body: pick(document.body, P),
    sections: [...document.querySelectorAll('section')].slice(0, 12).map((s) => pick(s, S)) };
}, [PROPS, SECT]);
const b = await chromium.launch(chromiumExe() ? { executablePath: chromiumExe() } : {});
let bad = 0;
for (const t of targets) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(base + t, { waitUntil: 'networkidle' }); await p.waitForTimeout(300);
  const ref = JSON.stringify(await snap(p)); await p.close();
  for (const s of sources) {
    const q = await b.newPage({ viewport: { width: 1440, height: 900 } });
    const r = await q.goto(base + s, { waitUntil: 'networkidle' });
    if (!r || r.status() >= 400) { console.log(`SKIP ${s} (status ${r && r.status()})`); await q.close(); continue; }
    // nawigacja kliencka przez wstrzykniety link obslugiwany przez router Next (klik na <a> z next/link)
    const ok = await q.evaluate((href) => {
      const a = [...document.querySelectorAll('a[href]')].find((x) => new URL(x.href).pathname === href);
      if (a) { a.click(); return 'link'; }
      const n = window.next && window.next.router; if (n && n.push) { n.push(href); return 'router'; }
      return null;
    }, t);
    if (!ok) { console.log(`SKIP ${s} -> ${t} (brak linku i routera)`); await q.close(); continue; }
    await q.waitForURL((u) => new URL(u).pathname === t, { timeout: 15000 }).catch(() => {});
    await q.waitForLoadState('networkidle'); await q.waitForTimeout(600);
    const full = await q.evaluate(() => performance.getEntriesByType('navigation').length && location.pathname);
    const got = JSON.stringify(await snap(q));
    if (got !== ref) {
      const a = JSON.parse(ref), g = JSON.parse(got); const d = [];
      for (const k of ['html', 'body']) for (const pr of PROPS) if (a[k][pr] !== g[k][pr]) d.push(`${k} ${pr}: ${a[k][pr]} -> ${g[k][pr]}`);
      (g.sections || []).forEach((x, i) => { for (const pr of SECT) if (a.sections[i] && a.sections[i][pr] !== x[pr]) d.push(`section[${i}] ${pr}: ${a.sections[i][pr]} -> ${x[pr]}`); });
      console.error(`LEAK ${s} -> ${t} (${ok}): ${d.slice(0, 6).join('; ')}`); bad++;
    } else console.log(`ok ${s} -> ${t} (${ok}, ${full})`);
    await q.close();
  }
}
await b.close();
if (bad) { console.error(`CSSLEAK fail=${bad}`); process.exit(1); }
console.log('CSSLEAK fail=0 PASS');
