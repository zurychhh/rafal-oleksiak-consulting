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
  'body', '.wrap',
  '.top', '.brand', '.clients', '.cl', '.cl b', '.cl i', '.clm',
  '.mid', '.band', '.grid', '.grid i', '.c1', '.c2', '.c3',
  '.legend', '.legend .amb', '.legend .soft', '.origin',
  '.say', '.claim', '.lead', '.svcs', '.svc', '.hair', '.dots', '.dots i',
  '.sname', '.sdesc',
  '.exit', '.go', '.gotxt', '.goarr', '.exit form', '.fbox', '.fbox input',
  '.fbox button', '.fine', '.ai',
  'p', 'h1',
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
    // Kafle z wymyslonymi interwalami zniknely; jedyna liczba w tym bloku pochodzi
    // teraz od odwiedzajacego, wiec nie ma tu czego porownywac tresciowo.
    //
    // Biale znaki zwijamy: w zrodle dluga etykieta jest zawinieta na dwie linie,
    // a JSX zdejmuje wciecia. To roznica FORMATOWANIA pliku, nie tresci — na
    // ekranie obie wersje sa identyczne, bo przegladarka i tak zwija spacje.
    // Porownywanie surowego textContent porownywaloby sposob zapisu zrodla.
    const txt = (sel) => [...document.querySelectorAll(sel)]
      .map((e) => e.textContent.replace(/\s+/g, ' ').trim()).join('|');
    out.__klienci = txt('.cl b');
    out.__legenda = txt('.legend span');
    out.__uslugi = txt('.sname');
    // Siatka kalendarza: 70 pol, 45 jasnych, 24 bursztynowe, ostatnie wygaszone.
    // Liczby sa trescia projektu, nie dekoracja — sprawdzamy je po klasach.
    out.__siatka = ['c1', 'c2', 'c3']
      .map((c) => c + ':' + document.querySelectorAll('.grid i.' + c).length).join('|');
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
