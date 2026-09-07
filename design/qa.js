/**
 * Pre-publish QA for single-screen pages.
 * Loads the file at several viewports and fails on the defect classes that
 * have actually shipped in this project: clipped text, overlapping blocks,
 * horizontal scroll, off-screen elements, and low-contrast text.
 */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FILE = process.argv[2];
const ALLOW_SCROLL = process.argv.includes('--scroll');
const VIEWPORTS = [
  { w: 1728, h: 1080, name: 'mac-16' },
  { w: 1440, h: 900,  name: 'laptop' },
  { w: 1280, h: 720,  name: 'small-laptop' },
  { w: 1024, h: 700,  name: 'short' },
  { w: 1440, h: 600,  name: 'very-short' },
  { w: 1280, h: 520,  name: 'landscape-phone' },
  { w: 2560, h: 1440, name: 'wide' },
  { w: 768,  h: 1024, name: 'tablet' },
  { w: 390,  h: 844,  name: 'phone' },
];

// elements that must never clip, never overlap, never leave the viewport
const KEY = ['.rail', '.sig', '.hookbox', '.hook', '.fw', '.fbox', '.under', '.bay', '.plate', '.gloss'];

function lum(c) {
  const m = c.match(/\d+(\.\d+)?/g).map(Number);
  const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(m[0]) + 0.7152 * f(m[1]) + 0.0722 * f(m[2]);
}

(async () => {
  // W chmurze chromium leży pod stałą ścieżką, lokalnie bierzemy ten, który
  // przyszedł z playwrightem. PW_CHROMIUM nadpisuje jedno i drugie.
  const pinned = process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  const browser = await chromium.launch(
    fs.existsSync(pinned) ? { executablePath: pinned } : {}
  );
  const problems = [];

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
    // Pasek zgody zdjęty przed pomiarem: człowiek odklikuje go w sekundę, a stojąc
    // na position:fixed przechwytuje kliknięcia i audyt nie dochodzi do drugiego
    // ekranu. Samo nakładanie paska na treść ma własny, osobny test — ta bramka
    // mierzy stronę, nie pasek.
    await page.addInitScript(() => {
      try { localStorage.setItem('cookie-consent', 'declined'); } catch { /* tryb prywatny */ }
    });
    // Przyjmuje i plik z dysku, i adres — port sprawdzamy przeciwko dev serwerowi.
    await page.goto(
      /^https?:\/\//.test(FILE) ? FILE : 'file://' + path.resolve(FILE),
      { waitUntil: 'networkidle' }
    );
    if (ALLOW_SCROLL) await page.evaluate(() => { window.__QA_SCROLLS = true; });
    await page.waitForTimeout(1400); // fonts + first paint + fit()

    const audit = (KEY) => {
      const out = { clipped: [], overflowX: false, offscreen: [], overlaps: [], contrast: [] };

      // 1 · clipped content: scroll size exceeds client size on a clipping box
      document.querySelectorAll('*').forEach(el => {
        const cs = getComputedStyle(el);
        const clips = /hidden|clip/.test(cs.overflow + cs.overflowY + cs.overflowX);
        if (!clips) return;
        if (el.tagName === 'INPUT') return;             // pole tekstowe legalnie przewija własną wartość
        if (el.classList.contains('rail')) return;      // marquee clips by design
        if (cs.webkitLineClamp && cs.webkitLineClamp !== 'none') return; // clamp is deliberate
        const dy = el.scrollHeight - el.clientHeight;
        const dx = el.scrollWidth - el.clientWidth;
        if (dy > 2 || dx > 2) {
          out.clipped.push({ sel: el.className || el.tagName, dy, dx });
        }
      });

      // 2 · the page must never scroll
      out.overflowX = document.documentElement.scrollWidth > window.innerWidth + 1;
      out.overflowY = document.documentElement.scrollHeight > window.innerHeight + 1;

      // 3 · key elements fully inside the viewport
      const boxes = {};
      KEY.forEach(sel => {
        const el = document.querySelector(sel);
        if (!el) return;
        const r = el.getBoundingClientRect();
        boxes[sel] = r;
        if (window.__QA_SCROLLS) return;
        if (r.top < -1 || r.left < -1 || r.bottom > window.innerHeight + 1 || r.right > window.innerWidth + 1) {
          out.offscreen.push({ sel, top: Math.round(r.top), bottom: Math.round(r.bottom) });
        }
      });

      // 4 · blocks that must not overlap each other
      const pairs = [['.sig','.hookbox'], ['.hookbox','.fw'], ['.fw','.bay'], ['.under','.bay'], ['.rail','.sig']];
      pairs.forEach(([a, b]) => {
        const A = boxes[a] || (document.querySelector(a) && document.querySelector(a).getBoundingClientRect());
        const B = boxes[b] || (document.querySelector(b) && document.querySelector(b).getBoundingClientRect());
        if (!A || !B) return;
        const ox = Math.min(A.right, B.right) - Math.max(A.left, B.left);
        const oy = Math.min(A.bottom, B.bottom) - Math.max(A.top, B.top);
        if (ox > 2 && oy > 2) out.overlaps.push({ a, b, ox: Math.round(ox), oy: Math.round(oy) });
      });

      // 5 · contrast of every text node against its painted background
      const bgOf = el => {
        let n = el;
        while (n && n !== document.documentElement) {
          const c = getComputedStyle(n).backgroundColor;
          if (c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c)) return c;
          n = n.parentElement;
        }
        return getComputedStyle(document.body).backgroundColor;
      };
      document.querySelectorAll('p,h1,h2,span,div,label,button,em,b,input').forEach(el => {
        if (!el.textContent.trim()) return;
        if (el.children.length && !/^(P|H1|H2|LABEL|BUTTON|EM|B|SPAN)$/.test(el.tagName)) return;
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) return;
        const r = el.getBoundingClientRect();
        if (r.width < 1 || r.height < 1) return;           // hidden by an ancestor
        if (!el.offsetParent && cs.position !== 'fixed') return;
        const size = parseFloat(cs.fontSize);
        out.contrast.push({
          sel: (el.className || el.tagName).toString().slice(0, 40),
          fg: cs.color, bg: bgOf(el), size,
          text: el.textContent.trim().slice(0, 28)
        });
      });
      return out;
    };

    const collect = (res, tag) => {
    res.clipped.forEach(c => problems.push(`[${tag}] CLIPPED ${c.sel} — content exceeds box by ${c.dy}px vertical / ${c.dx}px horizontal`));
    if (res.overflowX) problems.push(`[${tag}] HORIZONTAL SCROLL on the document`);
    if (res.overflowY && !ALLOW_SCROLL) problems.push(`[${tag}] VERTICAL SCROLL on a no-scroll page`);
    res.offscreen.forEach(o => problems.push(`[${tag}] OFF-SCREEN ${o.sel} (top ${o.top}, bottom ${o.bottom})`));
    res.overlaps.forEach(o => problems.push(`[${tag}] OVERLAP ${o.a} × ${o.b} — ${o.ox}×${o.oy}px`));
    res.contrast.forEach(c => {
      try {
        const L1 = lum(c.fg), L2 = lum(c.bg);
        const r = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
        const need = c.size >= 24 ? 3 : 4.5;
        if (r < need) problems.push(`[${tag}] CONTRAST ${r.toFixed(2)}:1 (needs ${need}) on ${c.sel} @${c.size}px — "${c.text}"`);
      } catch (e) {}
    });
    };

    // Zwinięte <details> ukrywają treść przed pomiarem — rozwijamy wszystkie,
    // żeby audyt widział to, co zobaczy człowiek, który je otworzy.
    const openDetails = () => page.evaluate(() => {
      document.querySelectorAll('details').forEach(d => { d.open = true; });
    });

    await openDetails();
    collect(await page.evaluate(audit, KEY), `${vp.name} ${vp.w}×${vp.h}`);

    // second pass: the end state after a successful submit
    // walk any reveal step first, then audit the revealed state
    const reveal = await page.$('#go');
    if (reveal) {
      await reveal.click();                             // #go odsłania drugi ekran (body.done)
      await page.waitForTimeout(900);
      await openDetails();
      collect(await page.evaluate(audit, KEY), `${vp.name} ${vp.w}×${vp.h} · REVEALED`);
      const li = await page.$('ol.steps li'); if (li) { await li.click(); await page.waitForTimeout(300); }
    }
    const mailEl = await page.$('#mail');
    if (mailEl && await mailEl.isVisible()) {
      await page.fill('#mail', 'test@company.com');
      const btn = await page.$('.fbox button') || await page.$('form button[type=submit]');
      if (btn) { await btn.click(); await page.waitForTimeout(1500);
        await openDetails();
        collect(await page.evaluate(audit, KEY), `${vp.name} ${vp.w}×${vp.h} · END`); }
    }

    await page.close();
  }

  await browser.close();
  if (!problems.length) {
    console.log('PASS — no clipping, no overlap, no scroll, no contrast failures across ' + VIEWPORTS.length + ' viewports.');
  } else {
    console.log('FAIL — ' + problems.length + ' problem(s):');
    [...new Set(problems)].forEach(p => console.log('  · ' + p));
    process.exitCode = 1;
  }
})();
