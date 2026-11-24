# Recenzja 30 — R4 p14 (spec 25): /nawyko niskie okno + /calculator

Recenzent niezależny, 2026-11-24. Build na http://localhost:3000, diff `d5f89bc..HEAD -- app/`.
Narzędzia: Playwright (Chromium z `scripts/chromium-exe.cjs`, `navigator.webdriver` nadpisany jak w `cls-check.mjs`),
`scripts/short-viewport-check.mjs`, własne pomiary geometrii, zrzuty obejrzane ręcznie.

## Wynik w skrócie
Zmiana robi to, co miała: na 1100×620 z paskiem cookies, 1280×720, 1366×768 i 1440×860 każdy opis kroku stoi pod swoim
krokiem, nic nie jest ucięte ani zasłonięte (short-viewport-check: PASS, 95 pozycji, 0 problemów na każdym rozmiarze),
telefon ma 212–325 px szerokości. Kalkulator: liczba pojedyncza i obrys fokusu działają. **Brak znalezisk blokujących.**
Jedno ważne: skok układu na progu `max-height:860px`.

## BLOKUJĄCE
Brak.

## WAŻNE
1. **Skok układu przy przejściu przez próg 860 px wysokości.** Zmiana rozmiaru okna 1440×861 → 1440×860 (pozycja 50% sceny,
   bez paska cookies): nagłówek sceny 60 → 55,9 px, blok kroków 348 → 287 px wysokości (−61 px, padding kroku 18 → ~10 px),
   telefon zaczyna się 17 px wyżej (77 → 60). Z paskiem cookies skok większy (nagłówek 60 → 52 px). Przyczyna: wartości
   w zapytaniu to `min(stała, avh × współczynnik)`, a przy avh = 860 współczynniki dają dużo mniej niż stałe sprzed progu
   (np. 860 × 0,012 = 10,3 px wobec 18 px). Druga strona tej samej usterki: zapytanie patrzy na wysokość okna, a skalowanie
   na wysokość dostępną, więc 1440×900 z paskiem cookies (avh 843) dostaje pełne odstępy, a 1440×860 bez paska (avh 860)
   — ściśnięte. Propozycja: współczynniki dobrane tak, by przy avh ≈ 860 dawały wartości desktopowe (ciągłość), albo próg
   oparty na tej samej wielkości co skalowanie. Dowód: pomiar w raporcie niżej; zrzuty
   `agencja/podglad/r4p14-rev-nawyko-1440x860-70.png` (w zapytaniu) vs `agencja/podglad/r4p14-rev-nawyko-1440x900-50.png` (poza).
   Uwaga: w praktyce widać to tylko przy przeciąganiu okna przez dokładnie ten próg albo przy zgodzie na cookies na
   oknie 861–917 px — dlatego WAŻNE, nie blokujące.

## DROBNE
2. **Etykieta „FOR YOUR CUSTOMER” i „HOW IT WORKS · MADE-UP BRAND” łamią się na dwa wiersze na 1100×620.** Czytelne,
   ale czarny klocek na dwie linie wygląda ciężko obok nagłówka. Prawdopodobnie istniało przed zmianą (diff nie dotyka
   `.nk-lab`). `agencja/podglad/r4p14-rev-nawyko-1100x620-10.png`.
3. **Kalkulator, skrajne położenie suwaka:** przy `Home`/`End` kciuk (34 px) przykrywa lewy/prawy odcinek obrysu fokusu.
   Obrys nadal widoczny na pozostałych trzech bokach, tekstu nie zasłania — zgodnie z komentarzem w CSS.
   `agencja/podglad/r4p14-rev-calc-focus-home-1440.png`.
4. **Fokus klawiatury na kroku nie przełącza aktywnego kroku** (Tab na „04” zostawia podświetlony opis „01” i telefon
   na kroku 01). Nie wynika z tej zmiany; czytelność na tym nie cierpi, ale opis przy fokusie należy do innego kroku niż
   obrys. `agencja/podglad/r4p14-rev-tab-1100x620-3.png`.
5. **Poza zakresem, istniało wcześniej:** `short-viewport-check` na 390×844 z paskiem cookies zgłasza ucięcie linku
   „Ask how your brand gets its own app” o 21 px przy 84% sceny. Zapytanie ma `min-width:861px`, więc ta zmiana tego
   nie dotyka — do osobnego zadania.

## Sprawdzone i bez uwag
- **/nawyko, przewijanie 10/30/50/70/90%** na 1100×620 (+cookies), 1280×720, 1366×768 (+cookies), 1440×860 (+cookies):
  aktywny opis zawsze bezpośrednio pod tytułem kroku (np. 1100×620 krok 04: tytuł 373 px, opis 403–457 px, pasek aktów
  od 514 px, pasek cookies od 563 px). Telefon: 212×439 (1100×620), 272×562 (1280×720), 284×587 (1366×768),
  325×671 (1440×860) — wszystko ≥ 150 px. Nagłówek 36,6 / 46,8 / 46,2 / 52,2 px, czytelny. Brak kiczu, brak nowych
  efektów. `agencja/podglad/r4p14-rev-nawyko-1100x620-10.png`, `-50.png`, `-90.png`, `r4p14-rev-nawyko-1280x720-30.png`.
- **1440×900 i 390×844 bez zmian:** oba poza zapytaniem (`min-width:861px and max-height:860px`), więc reguły ich nie
  dotyczą; pomiary 1440×900 (nagłówek 60 px, telefon 339×700, kroki 73/128 px) zgodne z 1440×861, a zrzut
  `agencja/podglad/r4p14-rev-nawyko-1440x900-50.png` zgodny z `gates-wk-nawyko-1440-*.png`.
- **Klawiatura na 1100×620 z paskiem cookies:** Tab przez 4 kroki i 7 przycisków aktów — każdy fokus w oknie,
  nad paskiem cookies (top 563), `elementFromPoint` trafia w sam element, 0 zasłonięć.
- **/calculator 390 i 1440:** fokus z klawiatury na suwaku — `outline: 2px solid`, `offset -2px`, widoczny wewnątrz pola
  48 px, nie nachodzi na „Target gap”, wartość ani „Drag to close the gap” (`agencja/podglad/r4p14-rev-calc-focus-390.png`).
  Dla 1 klienta: „+1.31 orders × 120 × 1 customer” (liczba pojedyncza; ułamek zostaje w mnogiej — poprawnie);
  aria-label wykresu roku bez zmian w logice. Pozostałe teksty bez zmian (diff dotyka tylko tych dwóch miejsc).

## Pomiar skoku na progu (1440, pozycja 50% sceny, bez cookies)
| okno | nagłówek | góra nagłówka | blok kroków (wys.) | góra telefonu |
|---|---|---|---|---|
| 1440×861 | 60 px | 122 | 348 | 77 |
| 1440×860 | 55,9 px | 100 | 287 | 60 |
| 1440×859 | 55,8 px | 100 | 287 | 60 |
