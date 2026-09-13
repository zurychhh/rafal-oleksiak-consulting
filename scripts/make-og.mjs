#!/usr/bin/env node
/**
 * make-og — renderuje design/og-card.html do public/og.png.
 *
 *   npm run og
 *
 * Po co skrypt, skoro to jeden obrazek: karta podgladu linku starzeje sie razem
 * ze strona. Poprzedni og.png byl zrzutem layoutu, ktorego juz nie ma, i sprzedawal
 * na LinkedInie coś, czego odwiedzajacy po kliknieciu nie znajdowal. Generowana
 * z kodu odtwarza sie jedna komenda przy kazdej zmianie projektu.
 *
 * 1200x630 przy deviceScaleFactor 2 daje 2400x1260 — LinkedIn i Slack skaluja
 * w dol, wiec dwukrotnosc jest po to, zeby kratka nie rozmyla sie na ekranach
 * o duzej gestosci.
 */
import { chromium } from 'playwright';
import { existsSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = resolve(ROOT, 'design/og-card.html');
const OUT = resolve(ROOT, 'public/og.png');

const W = 1200;
const H = 630;
const SCALE = 2;

if (!existsSync(SRC)) {
  console.error(`\n✗ Brak zrodla karty: ${SRC}\n`);
  process.exit(1);
}

// Ta sama przypieta sciezka co w design/qa.js: w chmurze chromium lezy pod stala
// sciezka, lokalnie bierzemy ten, ktory przyszedl z playwrightem.
const pinned = process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch(existsSync(pinned) ? { executablePath: pinned } : {});

const page = await browser.newPage({
  viewport: { width: W, height: H },
  deviceScaleFactor: SCALE,
});

await page.goto('file://' + SRC, { waitUntil: 'networkidle' });

// font-display:block w karcie trzyma tekst niewidoczny do czasu zaladowania kroju,
// ale zrzut i tak nie moze polecieć wczesniej — inaczej PNG wyszedlby pusty w miejscu
// claimu. Czekamy jawnie i sprawdzamy, czy krój faktycznie jest.
await page.evaluate(() => document.fonts.ready);
const ok = await page.evaluate(() => document.fonts.check('500 58px "Instrument Sans"'));
if (!ok) {
  await browser.close();
  console.error('\n✗ Instrument Sans nie zaladowal sie z public/fonts. Zrzut bylby'
    + ' zrobiony zastepczym krojem — przerywam, zeby nie podmienic karty po cichu.\n');
  process.exit(1);
}

await page.screenshot({ path: OUT, type: 'png' });
await browser.close();

const { width, height } = await import('node:child_process').then(async () => {
  // Naglowek PNG: szerokosc i wysokosc to big-endian uint32 na bajtach 16..23.
  const { readFileSync } = await import('node:fs');
  const b = readFileSync(OUT);
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
});

const bytes = statSync(OUT).size;
const kb = (bytes / 1024).toFixed(1);

console.log(`\n  design/og-card.html  →  public/og.png`);
console.log(`    wymiary: ${width}x${height}  (viewport ${W}x${H} @${SCALE})`);
console.log(`    waga:    ${kb} kB`);

let bad = false;
if (width !== W * SCALE || height !== H * SCALE) {
  console.error(`\n  ✗ Oczekiwane ${W * SCALE}x${H * SCALE}.`);
  bad = true;
}
if (bytes >= 1024 * 1024) {
  console.error(`\n  ✗ Plik przekracza 1 MB — czesc klientow go wtedy nie pobierze.`);
  bad = true;
}
if (bad) process.exit(1);
console.log('\n  ✓ Gotowe.\n');
