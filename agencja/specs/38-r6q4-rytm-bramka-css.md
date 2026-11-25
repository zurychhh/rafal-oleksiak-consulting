# Spec 38 — R6' p4: animacja „Pack rhythm”, szlif kokpitu, bramka odrzuconych deklaracji CSS

Przebieg 25.11.2026 10:38. Źródło: STATUS R6'-N3 (0)–(2), recenzja 45 (drobne). Zakres: tylko `/nawyko` (kokpit) i bramki.
NIE RUSZAĆ: hero, „Four steps…”, „Rewards in the app”, finał, zapytanie (RUNDA 6'). Żadna sekcja ani zdanie nie znika.

## A — bramka R31 (test regresji błędu złapanego tylko przez recenzenta)
- `scripts/css-dropped.mjs`: dla każdego arkusza z `app/**/*.css` (po buildzie — arkusze serwowane na trasie, plus surowe pliki)
  porównuje deklaracje źródłowe z tym, co przeglądarka zachowała (Chromium CSSOM: `rule.style.length` / `cssText` vs liczba
  deklaracji w źródle). Każda odrzucona deklaracja = FAIL z plikiem, selektorem i tekstem deklaracji.
- Samotest: plik-wzorzec z `font:600 26px/1 inherit` → FAIL; z poprawną deklaracją → PASS.
- Znane świadome wyjątki (np. prefiksy `-webkit-`, `@supports` dla innych silników) tylko z listy z uzasadnieniem.
- Dopisane do `gates.sh` jako `css-dropped`.
- `clsscroll` w `gates.sh`: 3 przebiegi, wynik = mediana, w logu wszystkie trzy (reguła R30.3).

## B — kokpit `/nawyko`
1. `#rhythm`: animacja wejścia przy pokazaniu zakładki (kropki dosypywane, licznik 30→34), ok. 1,2 s, raz na pokazanie;
   `prefers-reduced-motion` i bez JS → stan końcowy od razu. Bez CLS (stałe wymiary).
2. Martwy kod: `sw`, `swung`/`CH_OF`, `swStyle`, reguła `.nk-scene[data-swung][data-act="5"]` — usunąć, jeśli nic nie używa.
3. 390: w `#rhythm` (i analogicznie „What it never does”) nagłówek przed telefonem w kolejności wizualnej.
4. 1440 Privacy: nagłówek telefonu „Health data consent · off” bez łamania na trzy linie, mniej pustki pod lewą kolumną.

## Kryteria
build · tsc · lint (≤ 1 ostrzeżenie) · `gates.sh http://localhost:PORT /nawyko` wszystko PASS (z nowym `css-dropped`),
inwentarz PASS, WebKit 390/1440 obejrzany, recenzent niezależny bez IMPORTANT.
