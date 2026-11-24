# Recenzja 23 — runda 4, przebieg 5 (spec 15), 24.11.2026

Recenzent niezależny. Build `BUILD_EXIT=0`, `next start -p 3103` (localhost), Chromium 1243 + WebKitGTK (`webkit-check.py`).

## Werdykt
Brak defektów blokujących. Jeden ważny defekt (regresja kroju przez `font-display:optional`) i jedno ważne ryzyko do decyzji.

## Rubryka

| # | Kryterium | Wynik | Dowód |
|---|---|---|---|
| 1 | Oryginalność | PASS | Panel marki z przełącznikami, które wracają do „off” i mówią dlaczego, to scena „produkt odmawia”, nie lista. `r4p5-rev-never-390.png`, `-1440.png` |
| 2 | Oferta w 5 s | PASS | Nagłówek 9 słów „Prize draws, health claims and reward changes stay off.” + jedno zdanie instrukcji |
| 3 | Zero kiczu | PASS | Monochrom, gałka drga 0,6 s, bez ikon i konfetti; GA: wjazd ekranu od dołu, bez przenikania |
| 4 | Płynność (seria 390/1440) | PASS | 15 klatek na trasę i szerokość (Chromium, tryb sceny), 0 long tasks; klatki w połowie zmiany aktu 1→2 i 7→8: zero nakładania tekstów |
| 5 | CLS surowy (suma wszystkich wpisów, 3 przebiegi) | PASS | `/nawyko#enquiry`, `/nawyko`, `/work/genactiv` × 390 i 1440: 0 / 0 / 0 wszędzie; wysokość sekcji przed/po kliknięciu 1165/1165 (390), 846/846 (1440) |
| 6 | prefers-reduced-motion | PASS | /nawyko: `animation-name: none`, treść pełna (`r4p5-rev-never-390-rm.png`); /work/genactiv: statyczny układ, 11 telefonów 225×460 z treścią, 0 nagłówków z kryciem < 1 (`r4p5-rev-ga-rm-390.png`) |
| 7 | JS /nawyko ≤ +10% | PASS | Transfer skryptów 161,4 kB w 10 plikach (CDP `encodedDataLength`) vs ~157 kB = +2,8% |
| 8 | Klawiatura | PASS | Tab trafia w 3 przełączniki, `role=switch`, Space i Enter działają, `aria-checked` zostaje `false`, zdanie w `aria-live` się zmienia, `:focus-visible` z obrysem 2 px |
| 9 | Safari (WebKit) | PASS | `webkit-check` 390 i 1440 PASS na obu trasach, `WK_SCENE=1` na /work/genactiv 390 i 1440 PASS; poświata okrągła, pudełko pełnej szerokości (`r4p5-rev-ga-wk-hero-390.png`) |
| 10 | Brak prawdziwych marek w części aplikacji | PASS | /nawyko: marka demo „Tovemi”, zero GENACTIV w `app/nawyko` poza komentarzami; GENACTIV tylko na /work/genactiv |
| 11 | Liczby bez źródła | PASS | Nowa scena: „17 day of 30”, „day 24” to mechanika demo w telefonie z etykietą DEMO/Example; nowe liczby w tekstach brak |
| 12 | Plik fontu | PASS | `public/fonts/instrument-sans-400-600-latin.woff2` (29 904 B) i `-latin-ext.woff2` (11 092 B) istnieją, oba ładowane z 200 |
| 13 | Krój zapasowy / mignięcie | FAIL | patrz niżej |

## Ważne

**W1. „ł” w „Rafał” renderuje się krojem systemowym przy każdej pierwszej wizycie (regresja).**
`app/nawyko/nawyko.css`, drugi `@font-face "NK Instrument Sans"` (latin-ext) + `app/nawyko/page.tsx` (preload tylko pliku latin).
Plik latin-ext jest odkrywany dopiero po layoucie (~200 ms nawet lokalnie), więc przy `optional` nie zdąża i nie jest już
podmieniany. CDP `CSS.getPlatformFontsForNode`, zimny start lokalnie: `.sn-brand` = Instrument Sans ×13 + **Inter SemiBold ×1**
(Ł), stopka: Inter ×2. Zrzut `r4p5-rev-rafal-glyph.png`. Przed zmianą (`swap`) znak dociągał się po chwili.
Poprawka: dołożyć `preload` także dla `instrument-sans-400-600-latin-ext.woff2` (11 kB) albo dla tej trasy zadeklarować jeden
`@font-face` bez podziału na podzbiory.

**W2. Ryzyko `optional` przy pierwszej wizycie na wolnym łączu — do decyzji.**
Opóźnienie fontu o 300 ms albo „slow 4G” (150 ms RTT, 1,6 Mb/s): cała strona zostaje w kroju systemowym do końca wizyty
(h1, nagłówek sceny, stopka = Inter/SF), CLS 0. `r4p5-rev-font-slow-390.png`. Ruch z reklam na telefonie to właśnie pierwsza
wizyta. Wariant: zostawić `swap`, ale dodać metrycznie dopasowany krój zapasowy (`@font-face` z `local()` + `size-adjust`,
`ascent-override`, `descent-override`) — CLS przy podmianie bliski 0, a krój marki zawsze dochodzi. Obecne rozwiązanie
jest poprawne technicznie; to wybór między „zero skoku” a „zawsze nasz krój”.

## Drobne

- `.nk-cta` (przycisk „Send”, `<button>`) nie ma `font:inherit` — renderuje się Arialem (istniało wcześniej). Dodać `font-family:inherit` w `.nk-cta`.
- Ponowne kliknięcie tego samego przełącznika nie zmienia tekstu w `#nk-nv-why`, więc czytnik ekranu nie ogłosi go drugi raz.
- Telefon w scenie na 390 ma pustą dolną połowę (4 wiersze nagród) — scena wygląda na niedokończoną w tej szerokości.
- `→` (U+2192) i `✓` są poza `unicode-range` obu plików i zawsze idą krojem systemowym (stan sprzed zmiany).

## Zrzuty
`agencja/podglad/r4p5-rev-never-390.png`, `r4p5-rev-never-1440.png`, `r4p5-rev-never-390-rm.png`, `r4p5-rev-never-mid-390.png`,
`r4p5-rev-font-slow-390.png`, `r4p5-rev-rafal-glyph.png`, `r4p5-rev-ga-rm-390.png`, `r4p5-rev-ga-wk-hero-390.png`.
