# Spec 26 — R4 przebieg 15 (24.11.2026 12:38): `/nawyko` na telefonie z paskiem cookies, Tab po krokach sceny; bramka niskiego okna w `gates.sh`, fokus suwaka kalkulatora

Źródło: `agencja/STATUS.md` → „Następne” R4-N14 (1)–(5), recenzja 30 (drobne), lekcje R20–R21, kolejka wiedzy pkt 14.
Decyzje R4p12-A/B, R4p10-A, R4p4-A/B nadal czekają — NIE budujemy niczego, co od nich zależy (nagłówki, CTA przypięte na
telefonie `/work/genactiv`, `/tool`). Bez nowych ani zmienionych tekstów widocznych dla odwiedzającego — każdy zmieniony tekst:
stop i zgłoś Leadowi. Zakaz chowania treści (schowanie = zmiana zakresu, decyzja Rafała). Zakaz `key` na kontenerach (R19.1).

Zasady dla dwóch budujących (R19.3): `node_modules` przez `cp -al` (nie `ln -s`), serwer zabijany tylko po porcie
(`fuser -k <port>/tcp`), nigdy `pkill -f next`. Każdy budujący: `GATES_LOGDIR=/tmp/gates-<a|b>`.

## Strumień A — `/nawyko` (worktree `wt/r4p15-a`, port 3101). Pliki: `app/nawyko/*` (TSX/CSS). NIE `scripts/gates.sh`.
A1. **390×844 z paskiem cookies** — recenzja 30: link „Ask how your brand gets its own app” ucięty o 21 px przy ok. 84 % sceny.
    Pomiar przed: `node scripts/short-viewport-check.mjs http://localhost:3101/nawyko 390 844 --cookies` (i bez `--cookies`,
    oraz 360×740 ±cookies, 375×667 ±cookies — mały iPhone SE). Poprawka w CSS tak, by wszystkie 6 widoków dało PASS, a
    1100×620 ±c, 1280×720 ±c, 1366×768, 1440×860+c, 1440×900 nadal PASS. Wygląd 390×844 bez paska i 1440×900 bez zmian
    (zrzuty przed/po, oględziny). Każdy nowy próg `max-height`/`max-width` zmierzony 1 px po obu stronach (R21) — bez skoku.
A2. **Tab po krokach 01–04 sceny „How it works”** — recenzja 30: fokus na kroku „04” nie przełącza aktywnego kroku (opis i telefon
    zostają na 01). Kryterium (WCAG 2.4.3 kolejność fokusu, 2.4.7 widoczny fokus, 2.4.11 fokus niezasłonięty): gdy fokus z
    klawiatury trafia na element kroku N (lub w nim), strona przewija się do pozycji sceny, w której krok N jest aktywny
    (ta sama funkcja mapowania przewijanie → krok, której używa scena; `behavior` `auto` przy `prefers-reduced-motion`),
    opis i telefon pokazują krok N, obrys fokusu widoczny i niezasłonięty. Mysz/dotyk: bez zmian. Najpierw ustal w kodzie,
    czym są kroki (przyciski? linki? tekst?) i jak dziś działa Tab — zapisz w raporcie. Test: skrypt
    `scripts/nawyko-step-focus-check.mjs <url> <W> <H>` (Playwright, flaga webdriver nadpisana jak w `cls-check.mjs`): Tab do
    każdego kroku 01–04 → sprawdź aktywny krok i opis; kod 1 przy błędzie. Uruchom na starym buildzie (oczekiwany FAIL) i nowym
    (PASS) na 1440×900 i 1100×620 (na 390 scena może nie mieć listy kroków — zapisz, co jest).
A3. **1100×620**: etykiety „FOR YOUR CUSTOMER” i „HOW IT WORKS · MADE-UP BRAND” łamią się na dwa wiersze — jeden wiersz
    (mniejszy `letter-spacing`/rozmiar w bloku niskiego okna albo `white-space:nowrap` + sprawdzenie, że nic nie wystaje;
    tekst bez zmian). Zrzut przed/po.
A4. `GATES_LOGDIR=/tmp/gates-a bash scripts/gates.sh http://localhost:3101 /nawyko` — PASS (scroll-perf zaszumiony: zapisz
    wartości i przy FAIL powtórz). Zrzut WebKit sceny `/nawyko` 390 (gates robi) obejrzany. Wyniki: `agencja/specs/26-a-pomiary.md`.

## Strumień B — bramki i `/calculator` (worktree `wt/r4p15-b`, port 3102). Pliki: `scripts/*`, `app/calculator/*`. NIE `app/nawyko/*`.
B1. **`short-viewport-check` w `gates.sh`** (R4-N14 (5)): dla trasy, na której jest przypięta scena (wykryj tak jak skrypt — kod 2
    „brak sceny” = wiersz SKIP, nie FAIL), uruchom widoki 1100×620 --cookies, 1280×720 --cookies, 390×844 --cookies; wiersze
    `short-1100c`, `short-1280c`, `short-390c`. Logi do `GATES_LOGDIR`. Selftest `scripts/shortvp-selftest.sh` (port 3199):
    strona-wzorzec z przypiętą sceną, w której element jest ucięty → FAIL; poprawna → PASS (wzór: `clsscroll-selftest.sh`).
    Selftesty istniejące dalej PASS. Uruchom `gates.sh` na `/work/genactiv` (scena) i `/calculator` (bez sceny → SKIP):
    jeśli `/work/genactiv` 390c da FAIL — NIE poprawiaj strony, zapisz wynik (Lead zdecyduje).
B2. **Kalkulator — obrys fokusu suwaka** (recenzja 30 drobne): (a) przy skrajnym położeniu suwaka kciuk zakrywa jeden bok obrysu
    fokusu — obrys ma być w całości widoczny w obu skrajnych położeniach (390 i 1440, Chromium); (b) zrzut WebKit 390 po
    strzałkach (`agencja/podglad/r4p14-b-wk-slider-keys-390.png`) nie pokazuje obrysu — ustal, czy WebKit nie daje
    `:focus-visible` po `element.send_keys`, czy obrys naprawdę nie rysuje się; jeśli nie rysuje się — popraw (np. obrys na
    kontenerze przez `:focus-within`/`:has(:focus-visible)` zamiast na samym `input`), zrzut WebKit po poprawce.
    Zrzuty przed/po `agencja/podglad/r4p15-b-*.png`. Tekst bez zmian.
B3. `GATES_LOGDIR=/tmp/gates-b bash scripts/gates.sh http://localhost:3102 /calculator /work/genactiv` — tabela do
    `agencja/specs/26-b-wynik.md`.

## Wspólne
Commit w worktree z opisem; bez pushu. Raport końcowy (krótko): zmienione pliki, tabela przed/po, ścieżki zrzutów (w tym WebKit),
co nie wyszło. Lead scala, mierzy sam i zleca niezależną recenzję.
