# Spec 42 — R6' p8: reguła R36.2 na każdej przypiętej scenie (bramka `sticky-fixed`) + nagłówek finału na telefonie

Przebieg 26.11.2026 09:38. Kolejka R6'-N7 pkt 0a, 0 i 2.

## Problem
R36 (25.11): pasek rozdziałów `/nawyko` wjeżdża tylko przy ruchu kółkiem w GÓRĘ, a bramki przewijały w dół — dlatego przez
siedem przebiegów nikt nie widział, że przecina nagłówek przypiętego kokpitu. Reguła R36.2 kazała sprawdzić to samo na
pozostałych przypiętych scenach („Four steps”, `/work/genactiv`, `/`). Test zrobiony był tylko dla kokpitu (`cockpit-pin`).

Nowy test na wszystkich scenach znalazł drugi przypadek: **na 390×844 w przypiętym finale „One morning with {marka}”
pasek rozdziałów („ONE MORNING ⌄ · ASK ABOUT NAWYKO”, 52 px) przykrywa nagłówek finału** (stoi 16 px od góry) przy każdym
cofnięciu kółkiem/palcem — 9 z 9 kroków toru (zrzut obejrzany w przebiegu, nie zachowany; koniec toru: `agencja/podglad/r6q8-before-finale-endtrack-390.png` z recenzji 50).

## Kryteria akceptacji
1. `scripts/sticky-fixed-check.mjs` (nowa stała bramka w `gates.sh`, każda trasa): każda scena `position:sticky` wyższa niż
   pół okna i z torem; przejazd przez tor, na każdym kroku ruch kółkiem w górę o 120 px; FAIL, gdy widoczny element
   `position:fixed` spoza sceny przecina tekst sceny w górnym pasie (do 260 px; bez wnętrza makiety telefonu). Okna 1440×900,
   1280×720, 1100×620, 390×844. Linia wyniku `STICKYFIXED PASS|FAIL` (przez `run_expect`).
2. Test wykrywa błąd na starym buildzie (FAIL 390 finał, 9 trafień) i przechodzi po poprawce (PASS, 148 kroków).
3. `/work/genactiv` i `/` — PASS bez zmian w kodzie (ActBar nie przykrywa sceny; `/` ma jedną scenę na ≥ 1100 px).
4. Poprawka: pasek rozdziałów ustępuje także, gdy nagłówek finału `.nk-fz-lab` leży w pasie 0–96 px (ten sam mechanizm co
   nagłówek/zakładki kokpitu ze spec 41). Węzły trzymane w pamięci zamiast `querySelectorAll` w każdej klatce (hipoteza
   0a: koszt ticku paska).
5. Treść 1:1, inwentarz PASS, reszta `gates.sh /nawyko` PASS (scroll-perf: patrz pkt 0a niżej).
6. `css-dropped` drobne z recenzji 47 (rekurencja `var()`, `1` w `VAR_PLACEHOLDERS`, jedna linia FAIL na selektor) —
   samotest z trzema nowymi przypadkami czerwony przed, zielony po; pełny przebieg bez zmian (fail=0 info=9).

## 0a — scroll-perf `/nawyko` (pomiar, niezmieniony build sprzed poprawki, samotnie, 5 przebiegów)
1440×900: mediana klatki 93 i 97 ms (PASS, próg 100). 390×844: 113 i 106 ms (FAIL) przy rozrzucie 79–194 ms w obrębie
jednego pomiaru. Dzień wcześniej samotnie 78–81 ms na tym samym kodzie → werdykt progu zależy od obciążenia maszyny.

## Po recenzji 50 (FAIL → poprawione)
- I1: pasek śledzi cały blok `.nk-fz-copy` (nie samą etykietę) i na telefonie ustępuje przez pierwsze 120 px odjazdu sceny „Four steps”.
- I2: bramka liczy tekst makiety telefonu, wypisuje liczbę sprawdzonych tekstów i daje FAIL „NIETESTOWANE” przy zerze; sprawdza
  też koniec toru (11 kroków co 40 px, pierwsze 120 px odjazdu) — na odjeździe FAIL tylko dla elementu, który w przypiętej
  scenie ustępował (pasek w trybie `data-pin` na ≥ 1100 px współistnieje ze sceną z założenia).
- Bramka w wersji końcowej znalazła 2 starsze błędy poza zakresem tego przebiegu (R6'-N8 pkt 0): pigułka aktu pod `ActBar`
  `/work/genactiv`; pasek `/nawyko` w dwóch wierszach na 1100 px nad telefonem finału. `/` PASS.
