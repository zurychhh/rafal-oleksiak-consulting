# Spec 26 — strumień B: wynik (R4 p15, 24.11.2026, worktree `wt/r4p15-b`, port 3102)

## B1. Bramka niskiego okna w `gates.sh`
- `scripts/gates.sh`: na każdej trasie trzy wiersze `short-1100c`, `short-1280c`, `short-390c`
  (`scripts/short-viewport-check.mjs <url> W H --cookies`, logi `$GATES_LOGDIR/<slug>-short-<W>c.log`).
- Werdykt: `shortvp_verdict` w `scripts/gates-lib.sh` (ta sama funkcja w selftescie). SKIP tylko przy kodzie 2 **z** linią
  „brak przypietej sceny”; inny kod 2 (błąd użycia), 124 (limit czasu), brak linii `SVC` → FAIL. Uwaga FAIL zawiera liczbę
  problemów i pierwszy opisany problem.
- Selftest `scripts/shortvp-selftest.sh` (port 3199, wzór `clsscroll-selftest.sh`), 390×844 `--cookies` jak w bramce:

| wzorzec | wynik | oczekiwany |
|---|---|---|
| `cut.html` (link 40 px pod dolną krawędzią przypiętej sceny) | FAIL — 69 problemów, „uciety (dol 66px)” | FAIL |
| `ok.html` (link w środku sceny) | PASS | PASS |
| `noscene.html` (bez sceny) | SKIP | SKIP |

Istniejące selftesty: `clsscroll-selftest.sh` PASS (broken 3,39 / calm 0), `scrollperf-selftest.sh` PASS (broken 254/256 ms, calm 0/0).

`/work/genactiv` na 390×844 z paskiem cookies: **PASS** (95 pozycji, 0 problemów) — strony nie trzeba było ruszać.

## B2. Kalkulator — obrys fokusu suwaka
**(a) skrajne położenia (Chromium).** Nowy pomiar pikselowy `scripts/slider-focus-check.mjs <base> W H [--shot=]`: fokus z
klawiatury, Home/End, w każdym wierszu wysokości kciuka (środek ±14 px) od zewnątrz musi być: obrys → jasna przerwa → kciuk.

| widok | przed (najgorszy wiersz) | po |
|---|---|---|
| 390×844 Home / End | FAIL — obrys zlany z kciukiem (0 px przerwy) | PASS — obrys 2 px, przerwa 4 px |
| 1440×900 Home / End | FAIL — j.w. | PASS — obrys 2 px, przerwa 4 px |

Poprawka (`app/calculator/calculator.css`): `.gc-range{box-sizing:border-box;padding:0 6px;}` — kciuk i tor w polu treści,
obrys (`outline-offset:-2px`, bez zmian, więc nie nachodzi na teksty nad i pod suwakiem — R4p14 B1b) ma 4 px przerwy od kciuka.
Tor krótszy o 6 px z każdej strony; tekst bez zmian. Zrzuty: `agencja/podglad/r4p15-b-slider-before-{390,1440}-{min,max}.png`,
`agencja/podglad/r4p15-b-slider-after-{390,1440}-{min,max}.png`.

**(b) WebKit 390 bez obrysu — przyczyna: uprząż testu, nie strona.** Pomiar w WebKitGTK: po Tab przez `send_keys`
`document.activeElement` = `#gc-t`, ale `document.hasFocus()` = false, `:focus` i `:focus-visible` = false, `outline-style` = none.
Na 1440 ta sama sekwencja daje `hasFocus` true i obrys `solid 2px`. Xvfb bez menedżera okien = fokus okna pod kursorem
(środek ekranu); okno 390 px nie obejmowało kursora. Po ustawieniu okna na środku ekranu (`set_window_rect`) 390 daje
`:focus-visible` true i obrys rysuje się. Strona rysuje obrys w WebKit poprawnie, więc poprawka jest w
`scripts/webkit-slider-check.py` (pozycja okna + nowy warunek: po Tab `hasFocus`, `:focus-visible` i `outline-style != none`,
inaczej FAIL). Wynik: WEBKIT-SLIDER PASS na 390 i 1440 (`focus: hasFocus=True :focus-visible=True outline=solid 2px`).
Zrzuty WebKit po poprawce: `agencja/podglad/r4p15-b-wk-slider-keys-390.png` (obrys widoczny),
`agencja/podglad/r4p15-b-wk-slider-home-390.png` (minimum, obrys z przerwą od kciuka), `-keys-1440.png`, `-drag-{390,1440}.png`.
Przed: `agencja/podglad/r4p14-b-wk-slider-keys-390.png` (bez obrysu — okno bez fokusu).

Uwaga: `webkit-check.py` (bramka `webkit-390`) ustawia okno tak samo jak stary skrypt suwaka — jeśli kiedyś będzie sprawdzał
fokus, ma ten sam problem (dziś go nie sprawdza; nie ruszane).

## B3. `GATES_LOGDIR=/tmp/gates-b bash scripts/gates.sh http://localhost:3102 /calculator /work/genactiv` — WYNIK: PASS

| trasa | bramka | wynik | uwaga |
|---|---|---|---|
| /calculator | qa.js | PASS | |
| /calculator | cls-390 / cls-1440 | PASS / PASS | |
| /calculator | clsscroll-390 / -1440 | PASS / PASS | suma 0 / 0 |
| /calculator | scroll-perf-1440 | PASS | klatka med. 0 ms [0,0,0], interakcja 24 ms [24,56,24] |
| /calculator | scroll-perf-390 | PASS | klatka 0 ms [0,0,0], interakcja 32 ms [32,24,32] |
| /calculator | short-1100c / -1280c / -390c | SKIP / SKIP / SKIP | brak przypiętej sceny |
| /calculator | focus-obscured | PASS | |
| /calculator | jsonld | PASS | |
| /calculator | webkit-390 / -1440 | PASS / PASS | |
| /work/genactiv | qa.js | PASS | |
| /work/genactiv | cls-390 / cls-1440 | PASS / PASS | |
| /work/genactiv | clsscroll-390 / -1440 | PASS / PASS | suma 0 / 0 |
| /work/genactiv | scroll-perf-1440 | PASS | klatka 65 ms [65,0,93], interakcja 32 ms [24,32,32] |
| /work/genactiv | scroll-perf-390 | PASS | klatka 57 ms [57,0,104], interakcja 48 ms [48,32,56] |
| /work/genactiv | short-1100c / -1280c / -390c | PASS / PASS / PASS | 95 pozycji, 0 problemów każdy |
| /work/genactiv | focus-obscured | PASS | |
| /work/genactiv | jsonld | PASS | |
| /work/genactiv | webkit-390 / -1440 | PASS / PASS | |
| (globalnie) | content-rules / copy-voice / focus-ring | PASS / PASS / PASS | |

Pierwszy przebieg miał FAIL `focus-obscured` (kod 126) — mój błąd w edycji `gates.sh` (zjedzona spacja między argumentami);
poprawione, drugi przebieg powyżej. `npx tsc --noEmit` 0; `npm run lint` 0 błędów, 1 ostrzeżenie (tak samo przed zmianą).
