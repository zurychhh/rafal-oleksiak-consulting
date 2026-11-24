# Spec 16 — R4 przebieg 6 (24.11.2026 03:40)

Dwa strumienie równolegle, jeden push.

## A. Wjazd do Nawyko z `/` + krój bez skoku na `/nawyko` (repo główne, port 3000)

**A1. `/` nie ma żadnego linku do `/nawyko`** (grep `generated.ts`: 0 wystąpień „nawyko”). Główny wyróżnik oferty jest niewidoczny
z jedynej zaindeksowanej strony. Kolejka R4 pkt 2 (Rafał): „na `/` widoczny wjazd do Nawyko nad zgięciem w granicach mechanizmu
ship-design; nagłówka `/` nie ruszasz”.
Zmiana: `scripts/ship-design.mjs` dokłada w `<header>` link `/nawyko` z `data-ship-added="nawyko-link"`, tym samym stylem co
dokładany link do `/tool` (atrament, wersaliki, bez nowego koloru), jeśli nagłówek go nie ma — dokładnie ten sam wzorzec. Potem
`node scripts/ship-design.mjs design/production/claude-design-bundle.html --yes` (przegenerowanie `generated.ts` + prerender).
Kryteria:
- link widoczny nad zgięciem na 390, 768, 1024, 1440 (zrzuty), nic się nie łamie w nagłówku ani nie nakłada (qa.js `/` PASS);
- H1 „You don't pay twice for the same customer.” bez zmian; treść szablonu poza nagłówkiem bez zmian (diff `design-source.snapshot.html`
  pokazuje tylko dodany link);
- `ship-compare.mjs` PASS (elementy `data-ship-added` są zdejmowane), `content-rules --url` PASS; jeśli `content-rules` ma listę
  dokładanych elementów — dopisz `nawyko-link` z samotestem;
- tekst linku przechodzi `copy-voice` i rubrykę (krótko, korzyść albo nazwa produktu; np. „The Nawyko app”); wpis do `teksty-do-akceptacji.md`;
- CLS `/` bez zmian (≤ wartość przed, 390 i 1440).

**A2. Krój na `/nawyko`: `swap` + zapas z dopasowanymi metrykami zamiast `optional`.** Dziś `font-display: optional` (spec 15)
— przy wolnym łączu krój marki może się w ogóle nie pokazać. Zmiana: `@font-face` zapasowy (`local('Arial')`/`local('Helvetica')`/
`local('Liberation Sans')`) z `size-adjust`, `ascent-override`, `descent-override`, `line-gap-override` policzonymi z metryk pliku
Instrument Sans (fontTools / opentype z pliku w `public/fonts`), krój główny z `font-display: swap`.
Kryteria: surowy CLS przy wejściu `/nawyko#enquiry` i `/nawyko` ≤ 0,01 (390 i 1440, 3 próby, także z dławieniem sieci na fonty
— np. opóźnienie odpowiedzi `.woff2` o 1,5 s przez `page.route`); krój marki widoczny po załadowaniu (computed font, zrzut).

## B. `/work/genactiv`: kotwica `#enquiry` 1440 i szlif ruchu (worktree `../wt-ga`, port 3100)

**B1.** Surowy CLS przy wejściu `/work/genactiv#enquiry` na 1440: 0,0967 (390: 0). Znaleźć źródło (`PerformanceObserver` layout-shift
z `sources`), naprawić, cel ≤ 0,01 na 390 i 1440 (3 próby); wejście zwykłe i `#ga-t5` bez pogorszenia.
**B2.** Szlif ruchu: seria zrzutów co 4% toru w Chromium 1440 i 390 (i WebKit `WK_SCENE=1`), znaleźć najwyżej dwie najgorsze
klatki (pusty kadr, nakładanie, telefon „skacze”, tekst poza kadrem) i je poprawić. Bez nowych tekstów, bez nowych bibliotek.
Granice: spec `realizacja-genactiv.md` bez wyjątków.

## Bramki (oba)
build · `tsc --noEmit` · lint ≤ 0 błędów / 1 ostrzeżenie · `copy-voice` · `qa.js --scroll` na zmienionych trasach (localhost) ·
`content-rules --url` · `ship-compare` (A) · `webkit-check.py` 390 i 1440 na zmienionych trasach (`WK_SCENE=1` dla scen) ·
zrzuty obejrzane · niezależny recenzent + czytelnik-kupujący (A1).

## Wykonanie A (24.11.2026)

**A1 — zrobione.** `scripts/ship-design.mjs` dokłada w nagłówku `/` link „The Nawyko app” → `/nawyko`
(`data-ship-added="nawyko-link"`, ten sam styl atramentu co link do `/tool`, bez nowego koloru), tylko gdy nagłówek nie ma
`href="/nawyko"`. Oba dokładane linki stoją w jednym kontenerze `data-ship-added="header-links"` (`flex:none`): na desktopie
po prawej, na telefonie w jednym wierszu pod podpisem. Rozmiar obu linków: `clamp(10px,2.7vw,12px)`, odstęp liter
`clamp(.06em,1.2vw - .3em,.18em)` — od ~445 px w górę bez zmian (12px/.18em), na 390 → 10,5px/1,5px. Nic nie jest ukryte.
H1 i treść szablonu bez zmian: diff `design-source.snapshot.html` = jedna linia nagłówka. `content-rules` ma nową zasadę 11
(tylko `/`: widoczny link do `/nawyko`) z dwoma samotestami (wykrywa brak; nie strzela na profilu `cv`).
Przegląd szerokości 320–1600 co 4 px: oba linki w jednym wierszu, bez wyjścia poza nagłówek, podpis w jednej linii.
Wysokość nagłówka 390: 91 px (wariant z linkami jeden pod drugim dawał 122 px — odrzucony).
Zrzuty: `agencja/podglad/r4p6-home-nav-{chromium,webkit}-{390,768,1024,1440}.png` (WebKit 390 renderuje okno 447 px).
CLS `/` bez zmian: 0,0000 (390 i 1440). Z dławieniem `.woff2` +1,5 s `/` daje 1,0 — tak samo przed zmianą
(odsłonięcie zrzutu prerenderu po fontach; poza zakresem A).

**A2 — nie wdrożone, zostaje `optional`.** `swap` z zapasem o dopasowanych metrykach nie schodzi do ≤ 0,01 przy wejściu
z kotwicą na wolnych fontach (każda zmiana wysokości tekstu nad `#enquiry` przesuwa cały widok). Surowy CLS
(PerformanceObserver, suma, networkidle + 1,5 s, 3 próby, wyniki identyczne we wszystkich próbach):

| wejście | szer. | sieć | `optional` (przed = teraz) | `swap` + zapas fontTools (jedna twarz) | `swap` + zapas per grubość (measureText) |
|---|---|---|---|---|---|
| /nawyko | 390 | normalna | 0 | 0 | 0 |
| /nawyko | 390 | woff2 +1,5 s | 0 | 0 | 0,0023 |
| /nawyko | 1440 | normalna | 0 | 0 | 0 |
| /nawyko | 1440 | woff2 +1,5 s | 0 | 0,0070 | 0,0068 |
| /nawyko#enquiry | 390 | normalna | 0 | 0 | 0 |
| /nawyko#enquiry | 390 | woff2 +1,5 s | 0 | 0,0614 | 0,2464 |
| /nawyko#enquiry | 1440 | normalna | 0 | 0 | 0 |
| /nawyko#enquiry | 1440 | woff2 +1,5 s | 0,0005 | 0,1187 | 0,3271 |

Metryki Instrument Sans (fontTools, `instrument-sans-400-600-latin.woff2`): upm 1000, ascent 970, descent 250, lineGap 0, oś
wght 400–700. Zapas Arial/Liberation: size-adjust 103,17% (średnia szerokość liter) albo 100%/96,75% dla 400/600
(measureText całego tekstu strony); DejaVu osobno. `app/nawyko/nawyko.css` przywrócony bez zmian.
Ryzyko z spec 15 zostaje: na bardzo wolnym łączu przy pierwszej wizycie krój marki może się nie pokazać.
## Wykonanie B (24.11.2026)
**B1 — przyczyny (dwie, obie przy końcu strony, gdzie stoi `#enquiry`).** (1) Pasek cookies: przy wejściu z kotwicą
`scrollY > 200`, więc `CookieConsent` pokazuje się od razu i dokleja `<html>` `padding-bottom` = wysokość paska (57 px na 1440,
78 px na 390). Na 1440 przewinięcie do `#enquiry` dobija do dna strony (scrollY 7497 = max), strona rośnie o 57 px, a Chromium
w trakcie ładowania ponownie przewija do kotwicy — treść skacze o 57 px (ślad: scrollY 7497→7553, góra `#enquiry` 179→122 px).
(2) Podmiana kroju Montserrat (`swap`): na 390 akapit `.ga-sub` w akcie 10 zawija się o linię inaczej → `section.ga-act-10`
przesuwa się (źródło z `PerformanceObserver` `sources`).
**Poprawka (tylko `app/work/genactiv/genactiv.css`):** `html:has(.ga){padding-bottom:0 !important}` i stała rezerwa pod pasek
w stopce od pierwszej klatki (`.ga-foot` dół +72 px; ≤ 759 px + `--ga-reserve` 112 px) — wysokość strony nie zmienia się, gdy pasek
wjeżdża; pasek leży na rezerwie (zrzuty `agencja/podglad/r4p6-ga-stopka-390-po.png`, `-1440-po.png`). Plus zapasowy krój
„Montserrat Fallback” (`local(Arial/Helvetica/Liberation Sans)`) z `size-adjust` 113 % / 110,5 % (wagi ≤ 550 / ≥ 551),
`ascent/descent/line-gap-override` z metryk pliku (fontTools), dostrojony tak, by wysokości akapitów z zapasem = z Montserrat
(0 różnic na 390, 414, 430, 768, 1024, 1280, 1440; po 1 akapicie na 360 i 375). Komponent `CookieConsent` i inne trasy nietknięte.
**Surowy CLS** (Chromium, `networkidle` + 1,5 s, 3 próby; przed = b8c1f1d na świeżym buildzie, po = ta zmiana). Wartości 0,0967
na świeżym buildzie nie odtworzyłem (zależy od tego, czy pasek wejdzie przed zdarzeniem `load`); mechanizm widać w śladzie wyżej.
| Wejście | 390 przed → po | 1440 przed → po |
|---|---|---|
| `#enquiry` | 0 / 0 / 0 → 0 / 0 / 0 | 0 / 0 / 0 → 0 / 0 / 0 |
| `#enquiry`, plik `.woff2` opóźniony 300/600/1500 ms | 0,0624 → 0 | 0,0010 → 0,0005 |
| zwykłe | 0 → 0 | 0 → 0 (opóźniony font 0,0001 → 0,0001) |
| `#ga-t5` | 0 → 0 (opóźniony 0,0001 → 0) | 0 → 0 (opóźniony 0,0005 → 0,0005) |

**B2 — szlif ruchu.** Seria co 4% toru `.ga-track` (26 klatek) w Chromium 1440×900 i 390×844 (`navigator.webdriver` ukryty, scena
w trybie przewijania), każda klatka obejrzana: `agencja/podglad/r4p6-ga-seria-1440-a.png`, `-1440-b.png`, `-390-a.png`, `-390-b.png`.
Żadna klatka nie spełnia kryterium usterki (pusty kadr, nakładanie tekstów, skok telefonu, tekst poza kadrem, przycięte pudełko):
zmiany ekranów to wjazd nowego ekranu od dołu (poprawka p5), telefon stoi w tym samym miejscu we wszystkich aktach. **Ruchu nie
zmieniałem** — poprawka bez usterki byłaby zmianą dla zmiany. Reduced motion: kod ruchu nietknięty, `qa.js` PASS.
**Bramki:** build OK; `tsc --noEmit` OK; lint 0 błędów / 1 ostrzeżenie (jak przed); copy-voice OK (bez nowych tekstów); qa.js `--scroll`
PASS (9 szerokości); content-rules `--url` PASS (z `PW_CHROMIUM`, domyślna ścieżka 1194 nie istnieje); webkit-check `WK_SCENE=1` 390
i 1440 PASS.
