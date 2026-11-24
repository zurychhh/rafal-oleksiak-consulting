# Spec 25 — Strumień B: wynik (`/calculator`, bramki) — 24.11.2026

Worktree `wt/r4p14-b`, serwer `localhost:3102` (`npm run build && PORT=3102 npm start`), Chromium z `scripts/chromium-exe.cjs`,
WebKit przez WebKitGTK + Selenium.

## B1 — przed / po

| Punkt | Przed (stary build) | Po | Dowód |
|---|---|---|---|
| (a) liczba pojedyncza | „+1 orders × 120 × 1 customers”; `aria-label` osi: „1 reorders today” | „+1 order × 120 × 1 customer”; „1 reorder today”. Forma pojedyncza tylko dla dokładnie „1” po sformatowaniu („+1.01 orders”, „4,000 customers”, „1.0 orders a year” bez zmian) | `calculator-rules.test.mjs`: przed FAIL (8), po PASS |
| (b) obrys fokusu suwaka | `outline-offset:4px` na polu 48 px: obrys przecina „Target gap”, „50 days −8” i „← Drag to close the gap” (390 i 1440) | `outline-offset:-2px`: obrys wewnątrz pola suwaka; przecięcia z tekstem: 0 (390 i 1440); WebKit 1440 rysuje go tak samo | `r4p14-b-przed-focus-{390,1440}.png`, `r4p14-b-po-focus-{390,1440}.png`, `r4p14-b-wk-focus-1440.png` |
| (c) wynik nad paskiem cookies 390×844 | już było dobrze: pasek pojawia się po przewinięciu > 200 px; po powrocie na górę liczba 400–454 px, pasek od 766 px; przy y=260 liczba 140–194 px | bez zmian (rezerwa niepotrzebna, nic nie zmieniano) | `r4p14-b-{przed,po}-cookies-390-y0.png`, `-y260.png` |
| (d) suwak w WebKit | nie mierzony | przeciąganie 50→38 (390) / 50→39 (1440), liczba się zmienia; Tab z „Days between orders” daje fokus na suwak, 3× strzałka w lewo → 35 / 36, liczba się zmienia: PASS | `scripts/webkit-slider-check.py`; `r4p14-b-wk-slider-{drag,keys}-{390,1440}.png` |

## B2 — `scripts/calculator-rules.test.mjs`
Warstwa wyrenderowana (`--url`, tylko localhost). Scenariusze: A — 1 klient, 120, odstęp 28, cel 26 (+1,003 zamówienia → „1”),
B — 1 klient, odstęp 200 (jedno zamówienie dziś na osi). Szuka „1 orders|customers|reorders|days” w tekście, `aria-label`,
`aria-valuetext` i `aria-live`, 390 i 1440. Stary build: **FAIL (8)**; nowy: **PASS**.

## B3 — `gates.sh`
- `GATES_LOGDIR` (domyślnie `/tmp/gates`), opisany w nagłówku `gates.sh`.
- `scripts/gates-lib.sh`: `clsscroll_verdict`, `scrollperf_verdict`, `webkit_missing` — źródłowane w `gates.sh` i obu selftestach,
  więc selftest sprawdza dokładnie progi bramki.
- Porty selftestów: `clsscroll-selftest.sh` 3197, `scrollperf-selftest.sh` 3198 (`SELFTEST_PORT` nadal działa). Puszczone
  równolegle: oba PASS (clsscroll: broken 3,26 FAIL / calm 0 PASS; scroll-perf: broken klatka 255 ms FAIL / calm 0 PASS).
- Brak WebKit: wiersz FAIL „WebKit niedostepny (brak: WebKitWebDriver, xvfb-run, … — zainstaluj: apt-get update && apt-get install
  -y webkit2gtk-driver xvfb && pip install --break-system-packages selenium)”. Sprawdzone przez wywołanie `webkit_missing` z pustym PATH.

## B4 — `GATES_LOGDIR=/tmp/gates-b bash scripts/gates.sh http://localhost:3102 /calculator`

| Bramka | Wynik | Uwaga |
|---|---|---|
| qa.js | PASS | |
| cls-390 / cls-1440 | PASS / PASS | |
| clsscroll-390 / -1440 | PASS / PASS | suma 0,00000 / 0,00000 |
| scroll-perf-1440 | PASS | mediana klatki 0 ms [0,0,0], interakcji 40 ms [40,40,48] |
| scroll-perf-390 | PASS | mediana klatki 0 ms [0,0,0], interakcji 24 ms [32,24,24] |
| focus-obscured | PASS | |
| jsonld | PASS | |
| webkit-390 / webkit-1440 | PASS / PASS | zrzuty `gates-wk-calculator-*` |
| content-rules, copy-voice, focus-ring | PASS | |
| **WYNIK** | **PASS** | |

Też: `tsc --noEmit` 0 błędów, `node scripts/copy-voice.test.mjs` OK.

## Uwagi
- Zrzut klawiatury WebKit 390 (`r4p14-b-wk-slider-keys-390.png`) nie pokazuje obrysu, choć fokus jest na suwaku; na 1440
  `:focus-visible` pasuje i obrys jest narysowany (`r4p14-b-wk-focus-1440.png`). Nie wyjaśnione — do sprawdzenia na iPhonie.
- „1.0 orders a year” (odstęp 365) zostaje w liczbie mnogiej — ułamek dziesiętny, poprawne po angielsku.
