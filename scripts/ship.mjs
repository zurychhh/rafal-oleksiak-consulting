#!/usr/bin/env node
/**
 * ship — przenosi design/production/index.html do aplikacji.
 *
 *   npm run ship          podgląd: co się zmieni, nic nie rusza
 *   npm run ship -- --yes przenosi, przepuszcza przez bramkę, commituje
 *
 * Źródłem jest PLIK na dysku. Skrypt nie pobiera niczego z sieci.
 *
 * Zasada: przenosimy mechanicznie, a wszystko, czego nie umiemy przenieść
 * mechanicznie, zatrzymuje przebieg. Bramka po przeniesieniu jest twarda —
 * którykolwiek punkt czerwony i drzewo wraca na stan sprzed, bez pytania.
 * Push nigdy nie dzieje się tutaj.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const SRC = 'design/production/index.html';
const SNAPSHOT = 'app/audit-source.snapshot.html';
const CSS = 'app/audit.css';
const GLOBALS = 'app/globals.css';
const RUNTIME = 'app/audit-runtime.js';
const CLIENT = 'app/AuditClient.tsx';

const YES = process.argv.includes('--yes');

// Znaczniki wyznaczają regiony generowane. Wszystko poza nimi jest pisane
// ręcznie i skrypt tego nie dotyka — tam siedzą bloki resetu i rezerwacja
// miejsca na pasek zgody, których projekt nie zna.
const M = {
  cssStart: '/* >>> ZE ZRODLA — GENEROWANE, NIE EDYTUJ RECZNIE <<< */',
  cssEnd: '/* >>> KONIEC BLOKU ZE ZRODLA <<< */',
  varsStart: '/* >>> ZMIENNE ZE ZRODLA — GENEROWANE <<< */',
  varsEnd: '/* >>> KONIEC ZMIENNYCH ZE ZRODLA <<< */',
  jsStart: '/* >>> ZE ZRODLA — GENEROWANE, NIE EDYTUJ RECZNIE <<< */',
  jsEnd: '/* >>> KONIEC BLOKU ZE ZRODLA <<< */',
  jsxStart: '{/* >>> ZE ZRODLA — GENEROWANE, NIE EDYTUJ RECZNIE <<< */}',
  jsxEnd: '{/* >>> KONIEC BLOKU ZE ZRODLA <<< */}',
};

const sh = (cmd, args) => execFileSync(cmd, args, { encoding: 'utf8' });
const sha = (s) => createHash('sha256').update(s).digest('hex').slice(0, 12);
const die = (msg, code = 1) => { console.error('\n✗ ' + msg + '\n'); process.exit(code); };
const say = (msg) => console.log(msg);

// ─────────────────────────────────────────────── ekstrakcja ze źródła

function extract(html) {
  const style = html.match(/<style>([\s\S]*?)<\/style>/);
  if (!style) die('W źródle nie ma bloku <style>. Nie zgaduję — zatrzymuję się.');

  const css = style[1];
  const root = css.match(/(:root\{[\s\S]*?\n\s*\})/);
  if (!root) die('W <style> nie ma bloku :root ze zmiennymi. Zatrzymuję się.');

  const script = html.match(/<script>\s*\(function\(\)\{([\s\S]*?)\}\)\(\);?\s*<\/script>/);
  if (!script) die('W źródle nie ma skryptu w formie IIFE `(function(){...})()`. Zatrzymuję się.');

  // Ekstraktor szuka znaczników zwykłym dopasowaniem tekstu, nie parserem. Wzmianka
  // o `<body>` w komentarzu w nagłówku dokumentu wygrywa wtedy z prawdziwym otwarciem
  // i markup zostaje ucięty od środka tej wzmianki — a build pada dopiero na JSX,
  // komunikatem, który nie mówi nic o przyczynie. Lepiej zatrzymać się tutaj.
  const opens = (html.match(/<body(?=[\s>])/g) || []).length;
  if (opens !== 1) {
    die(`W źródle jest ${opens} wystąpień otwarcia <body>, a musi być dokładnie jedno.\n`
      + '   Najczęstsza przyczyna: nazwa znacznika wymieniona w komentarzu.\n'
      + '   Zapisz ją opisowo albo encjami — ekstraktor nie odróżnia komentarza od treści.');
  }

  const body = html.match(/<body>([\s\S]*?)<script>/);
  if (!body) die('Nie umiem wyciąć znaczników <body> przed <script>. Zatrzymuję się.');

  return {
    rootVars: root[1].trim(),
    cssRest: css.replace(root[1], '').replace(/^\s*\n/, '').replace(/\s+$/, ''),
    scriptBody: script[1].replace(/^\s*"use strict";\s*\n/, '').replace(/\s+$/, ''),
    markup: body[1].trim(),
  };
}

// ─────────────────────────────────────────────── HTML → JSX

const ATTR = {
  class: 'className', for: 'htmlFor', novalidate: 'noValidate',
  inputmode: 'inputMode', autocomplete: 'autoComplete', spellcheck: 'spellCheck',
  autocapitalize: 'autoCapitalize', maxlength: 'maxLength', minlength: 'minLength',
  tabindex: 'tabIndex', readonly: 'readOnly', colspan: 'colSpan', rowspan: 'rowSpan',
  crossorigin: 'crossOrigin', srcset: 'srcSet', autofocus: 'autoFocus',
  contenteditable: 'contentEditable',
};
const VOID_EL = new Set(['input', 'br', 'img', 'hr', 'meta', 'link', 'source', 'area', 'col']);
const BOOL_ATTR = new Set(['novalidate', 'checked', 'disabled', 'readonly', 'required', 'autofocus', 'selected', 'multiple']);

// Atrybuty, które React typuje jako number. W HTML wszystko jest tekstem, więc
// `maxlength="140"` przechodziło tu jako string i wywracało `tsc` dopiero
// w bramce — z komunikatem o typie, który nic nie mówi o źródle. Emitujemy je
// jako wyrażenie {140}. Wyłącznie wtedy, gdy wartość faktycznie jest liczbą:
// `size="auto"` czy `rows="{{x}}"` z szablonu ma przejść dalej jako tekst
// i zatrzymać się na czymś, co widać.
const NUM_ATTR = new Set(['maxlength', 'minlength', 'rows', 'cols', 'size', 'span',
  'tabindex', 'colspan', 'rowspan']);

function styleToObject(css) {
  const out = [];
  let custom = false;
  for (const part of css.split(';')) {
    const i = part.indexOf(':');
    if (i < 0) continue;
    const prop = part.slice(0, i).trim();
    const val = part.slice(i + 1).trim();
    if (!prop || !val) continue;
    let key;
    if (prop.startsWith('--')) { key = `'${prop}'`; custom = true; }
    else key = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    out.push(`${key}: '${val.replace(/'/g, "\\'")}'`);
  }
  // Typ CSSProperties nie zna wlasciwosci niestandardowych, wiec `--d` bez
  // rzutowania wywraca typecheck. Rzutujemy tylko tam, gdzie faktycznie sa.
  const obj = `{ ${out.join(', ')} }`;
  return custom ? `${obj} as CSSProperties` : obj;
}

function htmlToJsx(html) {
  let s = html;
  const unknown = [];

  // komentarze
  s = s.replace(/<!--([\s\S]*?)-->/g, (_, c) => `{/*${c}*/}`);

  s = s.replace(/<([a-zA-Z][a-zA-Z0-9]*)((?:\s+[^<>]*?)?)(\/?)>/g, (full, tag, attrs, selfClosed) => {
    const lower = tag.toLowerCase();
    const isInput = lower === 'input';
    // Radio i checkbox steruje sie przez `checked`, a `value` jest wartoscia
    // wysylana — zamiana jej na defaultValue dziala, ale myli czytelnika.
    const isToggle = isInput && /type\s*=\s*["']?(radio|checkbox)/i.test(attrs);
    let out = '';

    const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
    let m;
    while ((m = re.exec(attrs)) !== null) {
      const rawName = m[1];
      const name = rawName.toLowerCase();
      const value = m[2] ?? m[3] ?? m[4];

      // data-* i aria-* przechodzą bez zmian, tak samo w JSX
      if (name.startsWith('data-') || name.startsWith('aria-')) {
        out += value === undefined ? ` ${rawName}` : ` ${rawName}="${value}"`;
        continue;
      }
      if (name === 'style' && value !== undefined) {
        out += ` style={${styleToObject(value)}}`;
        continue;
      }
      if (name === 'checked') { out += ' defaultChecked'; continue; }
      // Pole niekontrolowane: skrypt czyta i pisze .value bezpośrednio, więc
      // `value` musi zostać wartością początkową, nie sterowaną Reactem.
      if (name === 'value' && isInput && !isToggle) { out += ` defaultValue="${value}"`; continue; }
      if (value === undefined) {
        if (BOOL_ATTR.has(name)) { out += ` ${ATTR[name] ?? name}`; continue; }
        unknown.push(`atrybut bez wartości: ${rawName} w <${tag}>`);
        continue;
      }
      if (NUM_ATTR.has(name) && /^-?\d+$/.test(value)) {
        out += ` ${ATTR[name] ?? name}={${value}}`;
        continue;
      }
      out += ` ${ATTR[name] ?? name}="${value}"`;
    }

    const needsClose = VOID_EL.has(lower) && !selfClosed;
    return `<${tag}${out}${needsClose || selfClosed ? ' /' : ''}>`;
  });

  if (unknown.length) {
    die('Nie umiem przenieść tych fragmentów znaczników:\n   - ' + unknown.join('\n   - ')
      + '\n  Dopisz regułę w scripts/ship.mjs albo przenieś ten kawałek ręcznie.');
  }
  return s;
}

// ─────────────────────────────────────────────── budowa plików

function replaceRegion(file, text, start, end, body, label) {
  const a = text.indexOf(start);
  const b = text.indexOf(end);
  if (a < 0 || b < 0 || b < a) {
    die(`W ${file} brakuje znaczników regionu (${label}). Nie nadpisuję pliku w ciemno.`);
  }
  return text.slice(0, a + start.length) + '\n' + body + '\n' + text.slice(b);
}

function indent(text, pad) {
  return text.split('\n').map((l) => (l.trim() ? pad + l : '')).join('\n');
}

// Generowany region moze potrzebowac `as CSSProperties` (wlasciwosci niestandardowe
// w atrybucie style). Import tego typu siedzi w recznej czesci AuditClient.tsx, wiec
// ship go nie doda ani nie usunie — ale moze zauwazyc rozjazd i powiedziec, co dopisac,
// zamiast zostawiac blad kompilatora albo martwy import wiszacy w lincie.
function checkCssPropsImport(clientText, jsx) {
  const potrzebny = jsx.includes('as CSSProperties');
  const jest = /import\s+type\s*\{[^}]*\bCSSProperties\b[^}]*\}\s*from\s*'react'/.test(clientText);
  if (potrzebny && !jest) {
    die('Znaczniki uzywaja wlasciwosci niestandardowych w style, wiec generowany region\n'
      + `   ma \`as CSSProperties\`, a w ${CLIENT} nie ma importu tego typu.\n`
      + "   Dopisz w czesci recznej:  import type { CSSProperties } from 'react';");
  }
  if (!potrzebny && jest) {
    die(`W ${CLIENT} wisi import CSSProperties, ktorego generowany region juz nie uzywa.\n`
      + '   Usun go z czesci recznej — inaczej lint zglasza nieuzywana nazwe po kazdym shipie.');
  }
}

function build(src) {
  const { rootVars, cssRest, scriptBody, markup } = extract(src);
  const jsx = htmlToJsx(markup);
  checkCssPropsImport(readFileSync(CLIENT, 'utf8'), jsx);

  return {
    globals: replaceRegion(GLOBALS, readFileSync(GLOBALS, 'utf8'),
      M.varsStart, M.varsEnd, rootVars, 'zmienne :root'),
    css: replaceRegion(CSS, readFileSync(CSS, 'utf8'),
      M.cssStart, M.cssEnd, cssRest, 'arkusz'),
    runtime: replaceRegion(RUNTIME, readFileSync(RUNTIME, 'utf8'),
      M.jsStart, M.jsEnd, scriptBody, 'skrypt'),
    client: replaceRegion(CLIENT, readFileSync(CLIENT, 'utf8'),
      M.jsxStart, M.jsxEnd, indent(jsx, '      '), 'znaczniki'),
  };
}

// ─────────────────────────────────────────────── czytelny diff treści

// Tekst widoczny dla człowieka: bez znaczników, bez skryptu i arkusza.
function visibleText(html) {
  const body = (html.match(/<body>([\s\S]*?)<script>/) || [, ''])[1];
  return body
    .replace(/<[^>]+>/g, '\n')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–').replace(/&middot;/g, '·').replace(/&#322;/g, 'ł')
    .split('\n').map((l) => l.replace(/\s+/g, ' ').trim()).filter(Boolean);
}

// Napisy w skrypcie też są treścią — tam siedzą nagłówki wyników i nazwy kroków.
function scriptStrings(html) {
  const m = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!m) return [];
  return [...m[1].matchAll(/"((?:[^"\\]|\\.){12,})"/g)]
    .map((x) => x[1].replace(/\s+/g, ' ').trim())
    .filter((s) => /[a-z]{3}/i.test(s) && !/^[a-z-]+$/i.test(s));
}

// LCS na tablicach napisów — bez zależności zewnętrznych.
function diffBlocks(a, b) {
  const n = a.length, m = b.length;
  const d = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      d[i][j] = a[i] === b[j] ? d[i + 1][j + 1] + 1 : Math.max(d[i + 1][j], d[i][j + 1]);
  const added = [], removed = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) { i++; j++; }
    else if (d[i + 1][j] >= d[i][j + 1]) removed.push(a[i++]);
    else added.push(b[j++]);
  }
  while (i < n) removed.push(a[i++]);
  while (j < m) added.push(b[j++]);
  return { added, removed };
}

const words = (arr) => arr.join(' ').split(/\s+/).filter(Boolean).length;
const clip = (s, n = 96) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

function report(oldHtml, newHtml) {
  const oldB = [...visibleText(oldHtml), ...scriptStrings(oldHtml)];
  const newB = [...visibleText(newHtml), ...scriptStrings(newHtml)];
  const { added, removed } = diffBlocks(oldB, newB);
  const dw = words(newB) - words(oldB);

  say('\n── zmiana treści ────────────────────────────────────────────');
  if (!added.length && !removed.length) {
    say('  Treść bez zmian. Różnice są wyłącznie w znacznikach lub arkuszu.');
  } else {
    if (removed.length) {
      say(`\n  ZNIKNĘŁO (${removed.length}):`);
      removed.slice(0, 25).forEach((l) => say('    − ' + clip(l)));
      if (removed.length > 25) say(`    … i jeszcze ${removed.length - 25}`);
    }
    if (added.length) {
      say(`\n  DOSZŁO (${added.length}):`);
      added.slice(0, 25).forEach((l) => say('    + ' + clip(l)));
      if (added.length > 25) say(`    … i jeszcze ${added.length - 25}`);
    }
  }
  say(`\n  Słów: ${words(oldB)} → ${words(newB)}  (${dw >= 0 ? '+' : ''}${dw})`);
  say('──────────────────────────────────────────────────────────────');
}

// ─────────────────────────────────────────────── bramka

function gate() {
  const steps = [
    ['build', 'npm', ['run', 'build']],
    ['tsc', 'npx', ['tsc', '--noEmit']],
    ['lint', 'npm', ['run', 'lint']],
  ];
  for (const [name, cmd, args] of steps) {
    process.stdout.write(`  ${name.padEnd(6)} … `);
    try {
      const out = execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
      // lint kończy się zerem także przy samych ostrzeżeniach — błędy muszą być zerem
      if (name === 'lint') {
        const m = out.match(/(\d+) error/);
        if (m && Number(m[1]) > 0) { say('CZERWONE — ' + m[1] + ' błędów'); return false; }
      }
      say('ok');
    } catch (e) {
      say('CZERWONE');
      const txt = ((e.stdout || '') + (e.stderr || '')).trim();
      say(txt.split('\n').slice(-18).map((l) => '    ' + l).join('\n'));
      return false;
    }
  }
  return true;
}

function visualGate() {
  say('  qa+style … (dev server)');
  let dev;
  try {
    dev = execFileSync('bash', ['-c',
      'RESEND_API_KEY= npm run dev > /tmp/ship-dev.log 2>&1 & echo $!'],
      { encoding: 'utf8' }).trim();
    execFileSync('bash', ['-c',
      'for i in $(seq 1 40); do curl -sf -o /dev/null http://localhost:3000 && exit 0; sleep 1; done; exit 1']);

    for (const [label, args] of [
      ['ekran startowy i odsłonięty', ['design/qa.js', 'http://localhost:3000', '--scroll']],
      ['/stop', ['design/qa.js', 'http://localhost:3000/stop', '--scroll']],
    ]) {
      const out = execFileSync('node', args, { encoding: 'utf8' });
      if (!/^PASS/m.test(out)) { say(`    qa.js CZERWONE (${label}):\n${out}`); return false; }
      say(`    qa.js PASS — ${label}`);
    }

    const cmp = execFileSync('node', ['scripts/ship-compare.mjs'], { encoding: 'utf8' });
    say(cmp.trim().split('\n').map((l) => '    ' + l).join('\n'));
    if (!/ZERO ROZNIC/.test(cmp)) return false;
    return true;
  } catch (e) {
    say('    CZERWONE: ' + ((e.stdout || '') + (e.stderr || e.message)).trim().split('\n').slice(-12).join('\n'));
    return false;
  } finally {
    try { execFileSync('bash', ['-c', 'pkill -f "next dev" || true']); } catch { /* już nie żyje */ }
  }
}

// ─────────────────────────────────────────────── przebieg

if (!existsSync(SRC)) die(`Nie ma źródła: ${SRC}`);

const src = readFileSync(SRC, 'utf8');
const hadSnapshot = existsSync(SNAPSHOT);
const snapshot = hadSnapshot ? readFileSync(SNAPSHOT, 'utf8') : '';

// 1 · czyste drzewo — poza samym źródłem, bo to ono ma się zmieniać.
// Gdyby strażnik obejmował także SRC, narzędzia nie dałoby się użyć: ktoś
// podmienia stronę w tym pliku i od razu odpala ship. Wszystko inne musi być
// czyste, żeby automatyczne cofnięcie nie zabrało cudzej niezapisanej pracy.
const WORKING = [SRC, SNAPSHOT];
const dirty = sh('git', ['status', '--porcelain']).trim().split('\n').filter(Boolean)
  .filter((l) => !WORKING.some((f) => l.endsWith(' ' + f) || l.endsWith('/' + f)));
if (dirty.length) {
  die('Drzewo robocze nie jest czyste poza źródłem. Zacommituj albo odłóż zmiany:\n'
    + dirty.slice(0, 15).map((l) => '   ' + l).join('\n'));
}

// 2 · czy jest co przenosić
const next = build(src);
const same =
  src === snapshot &&
  next.globals === readFileSync(GLOBALS, 'utf8') &&
  next.css === readFileSync(CSS, 'utf8') &&
  next.runtime === readFileSync(RUNTIME, 'utf8') &&
  next.client === readFileSync(CLIENT, 'utf8');

if (same) {
  say(`\n  Nic do przeniesienia. Źródło (${sha(src)}) jest już w aplikacji.\n`);
  process.exit(0);
}

say(`\n  Źródło:   ${SRC}  (${sha(src)})`);
say(`  W aplikacji: ${snapshot ? sha(snapshot) : '— brak migawki, pierwszy przebieg'}`);
report(snapshot || src, src);

// 3 · brama potwierdzenia
if (!YES) {
  say('\n  To był podgląd. Nic nie ruszone.');
  say('  Aby przenieść:  npm run ship -- --yes\n');
  process.exit(0);
}

// 4 · przeniesienie
say('\n── przenoszę ────────────────────────────────────────────────');
writeFileSync(GLOBALS, next.globals);
writeFileSync(CSS, next.css);
writeFileSync(RUNTIME, next.runtime);
writeFileSync(CLIENT, next.client);
writeFileSync(SNAPSHOT, src);
say('  zapisane: globals.css, audit.css, audit-runtime.js, AuditClient.tsx, migawka');

// 5 · bramka; cokolwiek czerwone → powrót bez pytania
say('\n── bramka ───────────────────────────────────────────────────');
const green = gate() && visualGate();

if (!green) {
  say('\n  Bramka czerwona. Cofam pliki generowane na stan sprzed przeniesienia.');
  // Wyłącznie to, co ship zapisał. NIE źródło: mogło być niezacommitowane,
  // a `git checkout -- .` skasowałby czyjąś nową wersję strony bez ostrzeżenia.
  sh('git', ['checkout', '--', GLOBALS, CSS, RUNTIME, CLIENT]);
  if (hadSnapshot) sh('git', ['checkout', '--', SNAPSHOT]);
  else sh('git', ['clean', '-fq', '--', SNAPSHOT]);
  say('  Źródło zostało nietknięte — twoja wersja strony jest bezpieczna.');
  die('Nic nie zostało przeniesione. Powyżej jest powód.');
}

// 6 · commit; push nigdy
const stamp = new Date().toISOString().slice(0, 10);
// Tylko pliki, ktorymi ship zarzadza. `-A` zgarnalby rownolegle zmiany
// w innych plikach do commitu opisanego jako przeniesienie tresci.
sh('git', ['add', '--', GLOBALS, CSS, RUNTIME, CLIENT, SNAPSHOT, SRC]);
sh('git', ['commit', '-q', '-m',
  `content: przeniesienie strony glownej ze zrodla (${stamp})\n\n`
  + `Zrodlo: ${SRC} (${sha(src)})\n`
  + `Bramka: build, tsc, lint bez bledow, qa.js PASS na / i /stop,\n`
  + `style obliczone bez roznic wobec zrodla.\n\n`
  + `Przeniesione przez scripts/ship.mjs. Push nie jest robiony automatycznie.`]);

say('\n  Zielone. Commit zrobiony:');
say('    ' + sh('git', ['log', '--oneline', '-1']).trim());
say('\n  Push NIE zostal wykonany. Zrob go recznie, gdy uznasz za stosowne.\n');
