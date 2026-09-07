#!/usr/bin/env node
/**
 * Porównuje style OBLICZONE przez przeglądarkę: strona w aplikacji
 * (http://localhost:3000) kontra źródło otwarte z dysku.
 *
 * Po co, skoro jest build, tsc, lint i qa.js: żaden z nich nie zauważa, że
 * nagłówek renderuje się innym krojem albo że separator tysięcy zmienił się
 * z cienkiej spacji na zwykłą. Oba te błędy realnie wydarzyły się przy porcie
 * i oba złapało dopiero to porównanie.
 *
 *   node scripts/ship-compare.mjs            # wymaga działającego dev servera
 */
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const URL_APP = process.env.SHIP_URL || 'http://localhost:3000';
const SRC = resolve('design/production/index.html');
if (!existsSync(SRC)) { console.error('Brak źródła: ' + SRC); process.exit(1); }

const PROPS = ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'color',
  'backgroundColor', 'margin', 'padding', 'letterSpacing', 'textTransform',
  'borderWidth', 'display', 'gridTemplateColumns', 'position'];

const FIRST = ['body', '.hook', '.sub', '.lab', '.wm', '.dq', '.daybox input', '.go',
  '.step1', '.cats button', '.s1', 'p', 'h1'];

const SECOND = ['.leakline', '.crow', '.cval', '.n', '.crow.out .cval', 'ol.steps li',
  '.rank', '.sname', '.stag', '.smeta', '.swhy', '.tick', '.card', '.rtb h3', '.cov',
  '.covbar i', '.askline', '.fbox input', '.fbox button', '.bar', '.shell', '.rail',
  '.priceline', '.gapline', '.peryear'];

async function grab(browser, url, { reveal, width, height }) {
  const page = await browser.newPage({ viewport: { width, height } });
  // Pasek zgody zdejmujemy: nie ma go w źródle, a stojąc na position:fixed
  // przechwytuje kliknięcia. Jego nakładanie na treść ma osobny test.
  await page.addInitScript(() => {
    try { localStorage.setItem('cookie-consent', 'declined'); } catch { /* tryb prywatny */ }
  });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  if (reveal) { await page.click('#go'); await page.waitForTimeout(1200); }

  const data = await page.evaluate(([sels, props, reveal]) => {
    const out = {};
    if (reveal) {
      out.__kroki = document.querySelectorAll('ol.steps li').length;
      for (const id of ['leakline', 'cov', 'permo', 'peryear']) {
        out['__' + id] = (document.getElementById(id) || {}).textContent || null;
      }
    }
    for (const s of sels) {
      const el = document.querySelector(s);
      if (!el) { out[s] = null; continue; }
      const cs = getComputedStyle(el);
      const o = {};
      for (const p of props) o[p] = cs[p];
      out[s] = o;
    }
    return out;
  }, [reveal ? SECOND : FIRST, PROPS, !!reveal]);

  await page.close();
  return data;
}

const browser = await chromium.launch();
let diffs = 0;

for (const [width, height] of [[1440, 900], [390, 844]]) {
  for (const reveal of [false, true]) {
    const opts = { reveal, width, height };
    const A = await grab(browser, 'file://' + SRC, opts);
    const B = await grab(browser, URL_APP, opts);
    const tag = `${width}${reveal ? ' odsloniety' : ' startowy'}`;

    for (const k of Object.keys(A)) {
      if (k.startsWith('__')) {
        if (A[k] !== B[k]) { console.log(`[${tag}] ${k}\n   zrodlo: ${A[k]}\n   apka:   ${B[k]}`); diffs++; }
        continue;
      }
      if (!A[k] || !B[k]) {
        if (!!A[k] !== !!B[k]) { console.log(`[${tag}] BRAK ELEMENTU ${k} (zrodlo=${!!A[k]} apka=${!!B[k]})`); diffs++; }
        continue;
      }
      for (const p of PROPS) {
        if (A[k][p] !== B[k][p]) {
          console.log(`[${tag}] ${k} · ${p}\n   zrodlo: ${A[k][p]}\n   apka:   ${B[k][p]}`);
          diffs++;
        }
      }
    }
  }
}

await browser.close();
console.log(diffs === 0 ? 'ZERO ROZNIC (style obliczone, oba ekrany, 1440 i 390)' : `ROZNIC: ${diffs}`);
process.exit(diffs === 0 ? 0 : 1);
