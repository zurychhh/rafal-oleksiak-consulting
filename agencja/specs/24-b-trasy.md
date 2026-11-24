# Spec 24 — Strumień B: bramki na trasach narzędzi (R4 p13)

Pomiar w worktree `wt/r4p13-b`, port 3102, 24.11.2026. Maszyna 2 rdzenie współdzielona z drugim budującym — liczby wydajności
orientacyjne; ostateczny pomiar robi Lead po scaleniu.

## B1 — `scroll-perf` z medianą
`scripts/scroll-perf.mjs`: przebieg rozgrzewkowy (nieliczony: zimny start przeglądarki, kompilacja JS, cache) + `--runs N`
(domyślnie 3), każdy w świeżym kontekście; werdykt z MEDIANY najdłuższej klatki (LoAF) i MEDIANY najdłuższej interakcji.
Ostatnia linia do parsowania: `SCROLLPERF klatka_med=<ms> interakcja_med=<ms> klatki=<a,b,c> interakcje=<d,e,f>`.
`gates.sh` tylko czyta tę linię; progi bez zmian (klatka > 100 ms albo interakcja > 200 ms = FAIL), w uwadze tabeli mediana
i wszystkie trzy wartości; limit czasu dla scroll-perf ×4 (cztery przebiegi).

Źródło metody (sprawdzone 24.11.2026):
- Lighthouse, „Score Variability”: „use aggregate values like the median, 90th percentile, or even min/max instead of single test
  results”; „The median Lighthouse score of 5 runs is twice as stable as 1 run”; główne źródło zmienności lokalnie to
  „client resource contention” — https://github.com/GoogleChrome/lighthouse/blob/main/docs/variability.md
- web.dev, dane laboratoryjne a terenowe: https://web.dev/articles/lab-and-field-data-differences
- LoAF: https://developer.chrome.com/docs/web-platform/long-animation-frames

Przykład z tego przebiegu, jak mediana tłumi pojedynczy skok: `/tools` 1440 klatki `[0,0,53]` → mediana 0; selftest „calm”
klatki `[80,0,0]` → mediana 0.

## B2 — testy regresji bramek
- `bash scripts/clsscroll-selftest.sh` → broken FAIL 3.39094, calm PASS 0.00000 → **PASS** (kod 0).
- `bash scripts/scrollperf-selftest.sh` → broken FAIL (klatki 253,261,253; interakcje 256,280,256), calm PASS (klatki 80,0,0;
  interakcje 0,0,0) → **PASS** (kod 0).
Strony-wzorce w katalogu tymczasowym, `python3 -m http.server` na 127.0.0.1:3199 (`SELFTEST_PORT` nadpisuje).

## B3 — `bash scripts/gates.sh http://localhost:3102 /calculator /tools /lab/reward /lab/payback /lab/reminder`

### Przebieg 1 (przed poprawką)
| Trasa | PASS | FAIL | Przyczyna FAIL |
|---|---|---|---|
| /calculator | 9 | 1 | webkit: `/usr/bin/WebKitWebDriver` nie był zainstalowany w kontenerze (środowisko, nie strona) |
| /tools | 9 | 1 | webkit: jw. |
| /lab/reward | 8 | 2 | webkit: jw.; **qa.js: [390×844] HORIZONTAL SCROLL** — dokument 404 px |
| /lab/payback | 9 | 1 | webkit: jw. |
| /lab/reminder | 9 | 1 | webkit: jw. |

WebKit doinstalowany poleceniem z nagłówka `scripts/webkit-check.py` (`apt-get install -y webkit2gtk-driver`; xvfb i selenium
już były).

Przyczyna FAIL qa.js na `/lab/reward`: niewidoczny region `aria-live` `.rw-live` (`opacity:0`, `position:absolute`) miał
`white-space:nowrap; overflow:visible` — dłuższy komunikat wychodził 14 px poza 390 px i poszerzał dokument. Ta sama reguła
(`app/lab/reward/reward.css`, importowana też przez `/lab/payback` i `/lab/reminder`) na `/lab/payback` wystawała 16 px, ale bez
przewijania dokumentu. Pierwsza próba (`overflow:hidden`) zamieniła błąd na `CLIPPED rw-live` w qa.js (reward 39 px, payback 16 px),
więc poprawka ostateczna: `right:0; white-space:normal` — tekst zawija się w szerokości kolumny, jak w istniejącym wyjątku `.rm .rw-live`
dla `/lab/reminder`. Bez zmiany tekstu, bez nowego elementu; region pozostaje niewidoczny i czytany przez czytnik ekranu.

### Przebieg 2 (po poprawce, ten sam build co commit) — WYNIK: PASS
| Trasa | PASS | FAIL | scroll-perf 1440 / 390 (mediana klatki, interakcji; [3 przebiegi]) |
|---|---|---|---|
| /calculator | 11 | 0 | 0 ms [0,0,0], 40 ms [40,24,40] / 0 ms [0,0,0], 24 ms [24,24,16] |
| /tools | 11 | 0 | 0 ms [0,0,53], 0 ms [0,0,0] / 0 ms [0,0,0], 0 ms [24,0,0] |
| /lab/reward | 11 | 0 | 0 ms [0,0,0], 16 ms [16,16,16] / 0 ms [0,0,0], 24 ms [24,16,24] |
| /lab/payback | 11 | 0 | 0 ms [0,0,0], 16 ms [16,16,16] / 0 ms [0,0,0], 24 ms [24,24,24] |
| /lab/reminder | 11 | 0 | 0 ms [0,0,0], 24 ms [24,16,32] / 0 ms [0,0,0], 24 ms [24,16,24] |
| (globalnie) | 3 | 0 | content-rules, copy-voice, focus-ring |

CLS 390/1440 i clsscroll 390/1440 = 0 na wszystkich trasach. WebKit 390/1440: brak telefonu < 150 px; zrzuty
`agencja/podglad/gates-wk-{calculator,tools,lab-*}-{390,1440}-*.png` obejrzane wyrywkowo (reward 390, calculator 1440, tools 390) —
układ poprawny, bez przycięć.

### Do „Następne”
- Brak otwartych FAIL na tych trasach. Kontener: WebKitWebDriver nie jest preinstalowany — przy nowym kontenerze bramka webkit
  da FAIL „WebKit niedostępny”, dopóki nie pójdzie `apt-get install -y webkit2gtk-driver`.
- `gates.sh` pisze logi globalne (`/tmp/gates/global-*.log`) do wspólnego katalogu — dwóch budujących równolegle nadpisuje sobie
  te pliki (tabela jest poprawna, logi mogą być z drugiego przebiegu). Propozycja: `GATES_LOGDIR`.
