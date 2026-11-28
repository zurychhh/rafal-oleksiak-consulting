# Spec 46 — R6' p12: /tool bez skoku hero na 1440, pigułka aktu /work/genactiv bez wchodzenia na telefon (28.11.2026)

Wznowienie porzuconego przebiegu 27.11 12:38 (`wip/1238`) + punkt R6'-N9 pkt 1 / R6'-N11 pkt 2.

## A. `/tool` — preload krojów hero (R6'-N11 pkt 0)
- Kryterium: `clsscroll-1440 /tool` = 0 (mediana 3); było 0,0105 w trzech przebiegach (R-1038, R6'-N10, R6'-N11).
- Preload = tylko kroje rysowane przez trasę (bramka `font-preload` zielona): Instrument Sans 400–600 latin, IBM Plex Mono 400.
- Wynik: 0,0105 → 0,000; `clsscroll-390` 0,0025 (INFO, nie FAIL) — `aside.dir` przesuwa się, gdy `tool-runtime.js` wypełnia stronę
  (~265 ms). Recenzja 53: to samo przy zablokowanych fontach → efekt starszy, niezależny od tej zmiany (moja hipoteza „wcześniej
  poniżej zgięcia” była błędna). Do kolejki: rezerwa miejsca / treść z serwera (web.dev „Optimize CLS”).

## B. `css-leak-static` — importy CSS przez `require()` i spoza `app/` (R6'-N11 pkt 3, recenzja 52 b)
- Kryterium: samotest `import-forms` rozpoznaje 6 form importu i NIE dopasowuje `myrequire('./x.css')` (granica słowa, recenzja 53 D3);
  kontrola pozytywna: bez `\brequire` → FAIL (sprawdzone), bez `require\(` → FAIL (recenzent).

## C. `/work/genactiv` — pigułka `.ga-prog` przy wjechanym pasku aktów (R6'-N9 pkt 1)
- Błąd (znaleziony nowym testem `scripts/prog-overlap-check.mjs`, nie oczami): przy przewijaniu w górę pasek `.ga-ab` wjeżdża,
  pigułka zjeżdża o 40 px i na 1100×620 i 1280×720 wchodziła na ramkę telefonu (16 z 90 pozycji, akty z telefonem po lewej).
- Poprawka (≥ 760 px): przy widocznym pasku pigułka zostaje jako „ACT N OF 11” + pasek postępu; tytuł aktu wraca po schowaniu paska
  (pasek pokazuje wtedy rozdział; pigułka jest `aria-hidden`). Nic nie znika z widoku na stałe; < 760 px bez zmian.
- Kryteria: `prog-overlap-check` 0 nachodzeń na 1100×620, 1280×720, 1440×900, 390×844; kontrola pozytywna (recenzent przywrócił
  tytuł stylem → 16 FAIL); wszystkie bramki `/work/genactiv` zielone; nowy test stale w `gates.sh` (1100×620, 1280×720).
