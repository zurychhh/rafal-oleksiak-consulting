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

// Kierunek C jest jednym ekranem: nie ma drugiego widoku ani przycisku, ktory
// by go odslanial, wiec przebieg "odsloniety" i jego lista selektorow znikly.
// Inwentarz nie zostal skrocony — obejmuje kazdy blok nowej strony, zeby
// porownanie dalej mialo czego pilnowac.
const SELECTORS = [
  'body', '.wrap', '.top', '.top .mark', '.tag',
  '.hero', '.hcell', '.hook', '.hook em', '.sub', '.door', '.door b',
  '.shelf', '.packs', '.pk', '.pk b', '.pk i', '.pn', '.note',
  '.band', '.bars', '.brow', '.track', '.f50', '.f78', '.d', '.d.on', '.claim', '.claim em',
  '.record', '.rec', '.rec b', '.rec span', '.rec.now b',
  '.terms', '.terms h2', '.tp', '.write', '.fbox', '.fbox input', '.fbox button',
  '.msg', '.fine',
  'p', 'h1', 'h2',
];

async function grab(browser, url, { width, height }) {
  const page = await browser.newPage({ viewport: { width, height } });
  // Pasek zgody zdejmujemy: nie ma go w źródle, a stojąc na position:fixed
  // przechwytuje kliknięcia. Jego nakładanie na treść ma osobny test.
  await page.addInitScript(() => {
    try { localStorage.setItem('cookie-consent', 'declined'); } catch { /* tryb prywatny */ }
  });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const data = await page.evaluate(([sels, props]) => {
    const out = {};
    // Tresc, nie tylko styl: liczby na kafelkach i dni na paskach sa wpisane
    // w zrodle i to wlasnie one rozjezdzaja sie przy recznym przepisywaniu.
    out.__zegary = [...document.querySelectorAll('.pk b')].map((e) => e.textContent).join('|');
    out.__dni = [...document.querySelectorAll('.d')].map((e) => e.textContent).join('|');
    out.__referencje = [...document.querySelectorAll('.rec b')].map((e) => e.textContent).join('|');
    for (const s of sels) {
      const el = document.querySelector(s);
      if (!el) { out[s] = null; continue; }
      const cs = getComputedStyle(el);
      const o = {};
      for (const p of props) o[p] = cs[p];
      out[s] = o;
    }
    return out;
  }, [SELECTORS, PROPS]);

  await page.close();
  return data;
}

const browser = await chromium.launch();
let diffs = 0;

for (const [width, height] of [[1440, 900], [1080, 900], [390, 844]]) {
  {
    const opts = { width, height };
    const A = await grab(browser, 'file://' + SRC, opts);
    const B = await grab(browser, URL_APP, opts);
    const tag = `${width}`;

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
console.log(diffs === 0 ? 'ZERO ROZNIC (style obliczone i tresc, 1440, 1080 i 390)' : `ROZNIC: ${diffs}`);
process.exit(diffs === 0 ? 0 : 1);
