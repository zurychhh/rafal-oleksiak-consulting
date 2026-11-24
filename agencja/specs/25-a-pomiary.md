# Spec 25 — strumień A: pomiary (24.11.2026, worktree wt/r4p14-a, port 3101)

Narzędzie: `scripts/short-viewport-check.mjs <url> <W> <H> [--cookies] [--shot=plik.png]` (Playwright/Chromium przez
`chromium-exe.cjs`, `navigator.webdriver` nadpisany jak w `cls-check.mjs` — inaczej oba widoki dają układ statyczny bez
przypiętej sceny). Przewija `.nk-scene.is-scroll` / `.ga-track` co 2% wysokości sceny w dół, potem w górę (w górę wracają
paski `.cb` i `.ga-ab`), 95 pozycji. Na każdej sprawdza każdy widoczny (krycie ≥ 0,5) tekst, przycisk, link i pole w
`.nk-stage` / `.ga-stage`: (1) mieści się w oknie i w scenie (sticky + overflow:hidden), po przycięciu przez własne kontenery
poniżej sceny (treść ekranu makiety telefonu przycięta celowo się nie liczy); (2) nie przecina się z paskiem
`position:fixed|sticky` spoza sceny (pasek cookies, ChapterBar `.cb`, pasek aktów `.ga-ab`) ani z paskiem aktów sceny
`.nk-acts` / `.nk-bar`; (3) `elementFromPoint` w 3 punktach. `--cookies` = brak zgody (`localStorage` bez `cookie-consent`,
pasek pokazuje się po przewinięciu > 200 px); bez flagi = `cookie-consent=accepted`. Kod 1 przy jakimkolwiek problemie.
Ostatnia linia `SVC PASS|FAIL …`, wcześniej lista widzianych pasków (dowód, że skrypt je widzi).

## Wynik (problemy = pary pozycja × element)

| Trasa | Widok | Przed | Po |
|---|---|---|---|
| /nawyko | 1100×620 + cookies | FAIL (299, 14 unikalnych) | PASS |
| /nawyko | 1100×620 | FAIL (127, 8) | PASS |
| /nawyko | 1280×720 + cookies | FAIL (127, 8) | PASS |
| /nawyko | 1280×720 | FAIL (27, 3) | PASS |
| /nawyko | 1440×900 | PASS | PASS |
| /work/genactiv | 1100×620 + cookies | PASS | PASS |
| /work/genactiv | 1100×620 | PASS | PASS |
| /work/genactiv | 1280×720 + cookies | PASS | PASS |
| /work/genactiv | 1280×720 | PASS | PASS |
| /work/genactiv | 1440×900 | PASS | PASS |

Przed — co było nie tak na `/nawyko` (1100×620 + cookies): wiersz 04 („Earn a reward they saw coming”) i jego opis ucięte
o 19–41 px przez dolną krawędź sceny, wiersz 03 pod paskiem aktów `.nk-acts`; w akcie zdrapki „No pointer? Scratch today’s
card” ucięte o 99 px; „Ask how your brand gets its own app” ucięte o 55 px; „Example schedule…” i „Your curve comes from…”
pod paskiem aktów. Na 1280×720 bez cookies to samo w mniejszej skali (krok 04, „No pointer?”, link). Zrzut:
`agencja/podglad/r4p14-a-przed-nawyko-1100x620c.png` (magenta = pierwszy problem).

`/work/genactiv` przechodził już przed zmianą (najniżej: podpis „Recreated screen for illustration.” 539–555 px, pasek
cookies od 564 px na 1100×620) — bez zmian w kodzie tej trasy. Skrypt widział tam pasek cookies i `.ga-ab` (wszystkie 8
etykiet aktów), więc PASS nie wynika z braku pasków.

## Poprawka (tylko CSS, `app/nawyko/nawyko.css`, blok na końcu pliku)

`@media (min-width:861px) and (max-height:860px)` — poza nim zostają 1440×900 i każdy telefon (≤ 860 px szerokości), więc
ich wygląd nie może się zmienić (reguły w ogóle się tam nie stosują). W środku, z wysokości dostępnej
`--avh = 100svh − --consent-h`:
- górny odstęp sceny stały 60 px (był `9vh` = 56 px przy 620) — przy przewijaniu w górę wraca ChapterBar `.cb` (53 px)
  i przy mniejszym odstępie przykrywał etykietę rozdziału (skrypt to złapał w pierwszej próbie);
- nagłówek sceny `min(dotychczasowy, 6,5% avh)`, odstęp etykieta→nagłówek, lista kroków, odstępy przycisków kroków
  (`1,2% avh`, max 18 px), `.nk-alt`, `.nk-next`, `.nk-one` skalowane z wysokością;
- pasek aktów 6 px niżej (`bottom` 26→20, pasek postępu 14→10), telefon `min(dotychczasowy, avh − 124 px)`.
Bez chowania treści, bez zmian tekstów, bez `key`. Opis zostaje pod swoim krokiem (R20): na zrzutach po zmianie opis kroku
02/03/04 stoi bezpośrednio pod tytułem kroku, między liniami podziału tego wiersza.

## Bramki

`bash scripts/gates.sh http://localhost:3101 /nawyko /work/genactiv` → **WYNIK: PASS** (logi w `/tmp/gates/` — gates.sh
jeszcze nie czyta `GATES_LOGDIR`, to strumień B).
- scroll-perf (zaszumiony, mediana z 3): /nawyko 1440 klatka 55 ms [55,0,69], interakcja 48 ms; 390 klatka 63 ms
  [56,102,63], interakcja 40 ms; /work/genactiv 1440 klatka 0 ms [80,0,0], interakcja 24 ms; 390 klatka 0 ms [0,0,79],
  interakcja 32 ms.
- clsscroll-1440 /nawyko: INFO 0,00315 (znany stan sprzed zmiany, R4-N12: 0,0034; 1440×900 poza zapytaniem).
- WebKit 390/1440 obu tras: PASS. Dodatkowo WebKit 1100×620 sceny `/nawyko` (`WK_W=1100 WK_H=658 WK_SCENE=1`, okno 658 =
  widok 620; przy `WK_H=620` widok ma 582 px < 600 i strona słusznie daje układ statyczny): PASS, telefon 212×439, zrzut
  `agencja/podglad/r4p14-a-webkit-nawyko-1100x620c.png` obejrzany — krok 03 z opisem, krok 04, link nad paskiem aktów,
  pasek cookies niczego nie przykrywa. `webkit-check.py` dostał zmienną `WK_H` (jedna linia, domyślnie jak dotąd).

## Zrzuty

- `agencja/podglad/r4p14-a-przed-nawyko-1100x620c.png` — przed, krok 03/04 pod paskiem aktów
- `agencja/podglad/r4p14-a-po-nawyko-1100x620c-0.25.png` — po, akt zdrapki, „No pointer?” nad paskiem aktów
- `agencja/podglad/r4p14-a-po-nawyko-1100x620c-0.45.png` — po, krok 04 z opisem i link
- `agencja/podglad/r4p14-a-po-nawyko-1100x620c-0.62.png` — po, panel nagród (akt 5)
- `agencja/podglad/r4p14-a-po-nawyko-1280x720c-0.32.png` — po, 1280×720 z cookies
- `agencja/podglad/r4p14-a-webkit-nawyko-1100x620c.png` — WebKit po

## Czego nie sprawdzono

- Porównania pikseli 1440×900 i 390×844 przed/po nie robiłem — opieram się na zakresie zapytania (reguły tam nie działają)
  i na PASS qa.js / CLS / WebKit w gates. Recenzent może to potwierdzić zrzutem.
- Wysokości między 861 a 900 px i szerokości 861–1099 przy niskim oknie nie były mierzone osobno (zapytanie je obejmuje).
- Czytelność nagłówka 36 px przy 1100×620 to ocena na oko, nie czytelnik.
