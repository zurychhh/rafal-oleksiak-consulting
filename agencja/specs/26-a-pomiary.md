# Spec 26 — strumień A: pomiary (24.11.2026, worktree wt/r4p15-a, port 3101)

Stan „przed” = build z HEAD 100d87e; „po” = build z poprawkami. Wszystkie pomiary lokalne (Chromium z `chromium-exe.cjs`).

## A1 — `short-viewport-check` /nawyko

| Widok | Przed | Po |
|---|---|---|
| 390×844 | PASS | PASS |
| 390×844 +cookies | **FAIL** 11 (link „Ask how your brand gets its own app” ucięty o 21 px, 84 % sceny) | PASS |
| 360×740 | PASS | PASS |
| 360×740 +cookies | **FAIL** 79 / 7 unikalnych (do 69 px: link, „The name stays…”, Paper/Night/Clay, „Check your gap for free”) | PASS |
| 375×667 | PASS | PASS |
| 375×667 +cookies | PASS | PASS |
| 1100×620 / +cookies | PASS / PASS | PASS / PASS |
| 1280×720 / +cookies | PASS / PASS | PASS / PASS |
| 1366×768 | PASS | PASS |
| 1440×860 +cookies | PASS | PASS |
| 1440×900 | PASS | PASS |

Przyczyna: przypięta scena ma wysokość okna minus pasek cookies (78 px na telefonie), a telefon (50svh) i tryb zwarty
(`@media (max-height:720px)`) liczyły się z samego okna. Poprawka (`nawyko.css`, koniec pliku, „R4 p15 A1”):
1. telefon w scenie = `clamp(300px, (100svh − --consent-h) × .5, 500px)` — liniowo, bez progu; bez paska = 50svh jak dotąd;
2. tryb zwarty także przez `@container nk-stage (max-height:720px)` na `.nk-stage` (size container, tylko ≤ 860 px szerokości).
   Bez paska scena = okno, więc próg jest ten sam co dotąd.

Progi zmierzone 1 px po obu stronach (R21): 390×720 PASS / 390×721 PASS (istniejący próg, bez paska);
390×798 +cookies (scena 720) PASS / 390×799 +cookies (scena 721) PASS. Uwaga: przełączenie trybu zwartego jest skokiem
z natury (te same reguły co istniejący próg 720 — chowanie zdania pod nagłówkiem, mniejszy telefon); nowy próg go nie
wprowadza, tylko uruchamia go też przy pasku cookies.

Wygląd bez zmian (porównanie prostokątów wszystkich widocznych elementów sceny w 5 pozycjach, z regułami p15 i po ich
usunięciu przez CSSOM w tej samej stronie): 390×844 i 1440×900 — 0 różnic poza paskiem postępu (różni się o ułamek
przewinięcia) i pozycją 20 % (akt zdrapki: stan animacji zależny od czasu, liczba elementów 295/294). 390×844 +cookies:
zmieniona cała scena (zamierzone). Zrzuty `agencja/podglad/r4p15-a-{390x844,1440x900,390x844c}-84-{przed,po}.png`.

## A2 — Tab po krokach 01–04

Co to są kroki: `<li class="nk-step"><button class="nk-stepbtn" onClick={go(i)}>` — przyciski. Klik przewija stronę do
aktu (`go`), ale fokus z klawiatury nic nie robił: przypięta scena jest już w oknie, więc przeglądarka nie przewija,
a krok aktywny wynika wyłącznie z pozycji przewijania. Poprawka (`NawykoClient.tsx`): `actTop(i)` — ta sama funkcja
mapowania akt → pozycja co `go` (wydzielona), i `onFocus` na przycisku kroku: tylko gdy `:focus-visible` (klawiatura;
klik myszą i dotyk bez zmian), `scrollTo(actTop(i))`, `behavior: auto` przy `prefers-reduced-motion` (w praktyce scena
przy reduced motion jest statyczna, ale warunek jest). Fokus nie jest przenoszony; samozdrapka i tak czeka, gdy fokus
z klawiatury jest w scenie.

Skrypt `scripts/nawyko-step-focus-check.mjs <url> <W> <H> [--cookies] [--shot=prefix]`:

| Widok | Przed | Po |
|---|---|---|
| 1440×900 | **FAIL** — kroki 02–04: scena zostaje na akcie 1, opis kroku niewidoczny (krycie 0) | PASS — akt = krok, opis widoczny, obrys w oknie i niezasłonięty |
| 1100×620 | **FAIL** (jak wyżej) | PASS |
| 390×844 | PASS (sprawdzalny tylko krok 01) | PASS (bez zmian) |

Na 390 lista pokazuje tylko aktywny krok (pozostałe `display:none`), więc Tab z kroku 01 idzie do kontrolek telefonu
(`button.nk-sw "1st order"`) — kroki 02–04 nie są osiągalne Tabem; na telefonie zostaje nawigacja przewijaniem.
Zrzuty: `agencja/podglad/r4p15-a-{przed,po}-step-{1440x900,1100x620}-krok{1..4}.png`, `...-390x844-krok1.png`.

## A3 — etykieta 1100×620

Przed: „FOR YOUR CUSTOMER” 42 px i „HOW IT WORKS · MADE-UP BRAND” 35 px wysokości (po 2 wiersze), kolumna 455 px,
etykieta w jednym wierszu potrzebuje 465 px. Po: odstęp liter `clamp(1px, .926vw − 8.6px, .16em/.2em)` (liniowo, bez
progu): 1100×620 / +c / 1100×900 / 1024×700 — 24 px i 17 px (jeden wiersz); 1280 i 1440 — szerokości 179/267 px jak
przed (bez zmian). Poniżej ok. 1037 px (np. 861) zawija się jak dotąd — bez `nowrap`, nic nie wystaje.
Zrzuty `agencja/podglad/r4p15-a-{przed,po}-1100x620c-labels.png`.

## A4 — gates (`GATES_LOGDIR=/tmp/gates-a bash scripts/gates.sh http://localhost:3101 /nawyko`)

qa.js, cls-390, cls-1440, clsscroll-390 (0,00000), focus-obscured, jsonld, webkit-390, webkit-1440, content-rules,
copy-voice, focus-ring — PASS; clsscroll-1440 INFO 0,00353; scroll-perf-1440 PASS 65 ms [77,65,0];
**scroll-perf-390 FAIL 135 ms [139,82,135]** (próg 100). Powtórki tym samym buildem: 81 ms [81,70,124] PASS,
122 ms [122,169,107] FAIL; load average 2,5–3,5 (drugi budujący na 3102). Historia: p14 na tej trasie stary build
119–181 ms vs nowy 80–144 ms = szum. Zmiana p15 nie dotyka JS przewijania; CSS na 390 dodaje size container na
przypiętej scenie (zapytanie kontenera nie jest przeliczane przy przewijaniu, wysokość sceny stała) — bez A/B ze starym
buildem nie wykluczam tego pomiarem. Do sprawdzenia przez Leada na spokojnej maszynie.

tsc PASS; lint 0 błędów, 1 ostrzeżenie (to samo co przed: `getPosts` w kodzie bloga).
WebKit 390 obejrzany: `agencja/podglad/r4p15-a-webkit-nawyko-390-{1,3,5}.png` (kopie `gates-wk-nawyko-390-*`).
