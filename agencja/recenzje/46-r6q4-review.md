# Recenzja 46 — R6' q4 (spec 38): animacja „Pack rhythm", szlif kokpitu, bramka css-dropped

Recenzent niezależny, 25.11.2026. Zakres: `git diff cb47e40..HEAD` + niezacommitowane `app/globals.css`, `app/calculator/calculator.css`.
Build produkcyjny na :3000 (nie ruszany). Zrzuty: `/tmp/rev46/`. Skrypty pomiarowe: `/tmp/rev46/t1.cjs`, `t2.cjs`, `t3.cjs`.

## Werdykt

**PASS — bez IMPORTANT.** Można commitować. Trzy drobne do rozważenia w następnym przebiegu (najważniejsze: licznik 30→34 na 390 kończy się, zanim telefon jest na ekranie).

## IMPORTANT

Brak.

## Co sprawdzone (dowody)

1. **Animacja `#rhythm`** (pomiar co ~250 ms: liczba kropek `.is-in` / 74, licznik w telefonie):
   - 1440 przypięty (navigator.webdriver=false, `data-pin` obecne), klik zakładki: 31 → 34 po ~250 ms, kropki 1 → 38 (500 ms) → 74 (800 ms). Ten sam przebieg przy dojściu do odcinka przez przewijanie kółkiem i przy strzałce z klawiatury. Zrzut w połowie: `1440-rhythm-mid.png`, koniec: `1440-rhythm-end.png`.
   - 390: klik zakładki i wjazd wykresu na ekran przy przewijaniu — ten sam przebieg (`390-rhythm.png`).
   - reduced motion 1440 i 390: 16 ms po kliknięciu 74/74, licznik 34. Bez JS: 74/74, 34 (`390-nojs-rhythm.png`).
   - Głęboki link `/nawyko#rhythm` (1440): zakładka 06 wybrana, stan końcowy, wykres na ekranie (`1440-deeplink.png`).
   - CLS (PerformanceObserver layout-shift) podczas klików zakładek i przewijania: 0 na 1440 i 390. Jedyne przesunięcie 0,0079 (`nk-lessons|nk-pathhead|nk-fine|nk-rail`) padło przy pierwszym `scrollIntoView` do kokpitu, przed klikami — nie z tej zmiany.
2. **390, nagłówek przed telefonem:** `#rhythm` nagłówek y=445, telefon y=934; „What it never does" nagłówek y=83, telefon y=692 (`390-never.png`).
3. **1440 Privacy:** „Health data consent · off" w jednej linii (wysokość 13,7 px = 1 × line-height), telefon 325×560 w prawej kolumnie na całą wysokość, pustka pod lewą kolumną zniknęła (`1440-privacy.png`). Najmniejszy tekst w telefonie 8,85 px (etykiety dolnego paska), nagłówek 9,46 px.
4. **Nic nie usunięte:** diff `app/nawyko` usuwa tylko `CH_OF`, `sw`, `smooth`, `swung/lastCh`, `swStyle`, `data-ch`, `data-swung`, `@property --sw` i reguły `[data-ch="1"]`/`[data-swung]`. Żaden węzeł tekstowy JSX ani sekcja nie znika. „Four steps": przewinięte w 11 pozycjach na 1440 i 390 — akty 0→4 po kolei, telefon i tekst w stałym miejscu, transformacja tożsamościowa (`how-1440-*.png`, `how-390-*.png`). CLS przy przewijaniu sceny: 1440 0,0034, 390 0.
5. **Personalizacja:** „Zorbix" w konfiguratorze → 16 (1440) / 15 (390) wystąpień, „Tovemi" zero w tekście, `aria-label`, `alt`, `title` i tytule dokumentu (po przejściu przez całą stronę i wszystkie zakładki).
6. **Klawiatura:** strzałki przełączają zakładki i przenoszą fokus; obrys fokusu 3 px solid, jasny na ciemnym tle kokpitu (`1440-kbd.png`). Strzałka na „Pack rhythm" odpala animację.
7. **Bramki:** `css-dropped-selftest.sh` PASS (5/5), `clsscroll-selftest.sh` PASS (w tym 3 przypadki mediany). `css-dropped.mjs` na repo: fail=0, info=9 (reguły `::-moz-` dla Firefoksa), 8383 deklaracji, 21 plików. Łapie `font:600 26px/1 inherit` także w regule zagnieżdżonej w `@media` (sprawdzone na wzorcu). `.module.css` jest w zakresie (`app/**/*.css` obejmuje `blog.module.css`).
8. **/calculator, 390, reduced motion:** brak animacji (`getAnimations()` puste, `.gc-arrow` animation-name none). Bez reduced motion wymuszone `.is-nudge` daje `gc-arrow` — reguła działa. Poprawka (rozdzielenie listy z `::-moz-range-thumb`) jest słuszna: stara lista była w Chromium odrzucana w całości, więc reduced motion nie wyłączało tam strzałki.
9. **WebKit:** 390 (okno WebKitGTK raportuje 447 px) i 1440 — PASS, najwęższy widoczny telefon 195 px (`wk-strip.png`, `wk1440-grid.png`). Skrypt przy 390 kończy się kodem 2 mimo linii PASS (prawdopodobnie zamykanie xvfb/sterownika) — warto sprawdzić, czy `gates.sh` traktuje to jako FAIL.

`globals.css`: zmieniony `line-height` jest w `.hero-headline`, której nie używa żaden znacznik (tylko `globals.css` i `critical.css`) — zmiana bez skutku wizualnego, poza zakresem spec, ale nieszkodliwa.

Rubryka: oryginalność i żywość — animacja wnosi ruch w statyczny dotąd panel, bez kiczu (kropki dosypywane, bez fajerwerków). Marka demo „Tovemi" opisana jako wymyślona; GENACTIV nie występuje na `/nawyko`. Nowych liczb w treści brak (34/30 z istniejących stałych, wykres oznaczony „Illustration · invented data").

## Drobne

1. **Licznik 30→34 na 390 jest niewidoczny.** Animację startuje wjazd wykresu (35% na ekranie), a telefon stoi ~490 px pod wykresem; licznik kończy się po ~250 ms (ease na 0,45 z 1,2 s), więc gdy telefon wjedzie, pokazuje już 34. Na 1440 licznik też kończy się, zanim kropki zaczną się dosypywać — całość trwa realnie ~0,9 s, nie 1,2 s. Propozycja: osobny wyzwalacz licznika na widoczność telefonu albo licznik rozłożony na cały czas.
2. **Privacy 1440:** w telefonie ~200 px pustego ekranu między „Streak" a przyciskiem „Agree and turn on" (`1440-privacy.png`); etykiety paska 8,85 px — na granicy czytelności.
3. **Dziury `css-dropped.mjs` (fałszywie negatywne):** nie sprawdza warunków `@media`/`@container`/`@supports` — `@media (max-width:860){…}` (bez jednostki) przechodzi, a Chromium traktuje go jako `not all` i cały blok jest martwy; wartości z `var()` zawsze przechodzą (`font:600 26px/1 var(--f)`); `:is(.b,::-moz-…)` przechodzi; poza zakresem CSS spoza `app/` i style inline w TSX. Fałszywie pozytywne: `:global(...)` w `.module.css` dałoby FAIL (dziś nieużywane). Najtańsza poprawka pierwszej dziury: `matchMedia(params).media !== 'not all'` dla każdego `@media`.
4. `webkit-check.py` przy 390: kod wyjścia 2 mimo „PASS" — do sprawdzenia w `gates.sh`.
