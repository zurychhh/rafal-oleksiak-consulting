# Recenzja 47 — R6' q5 (spec 39): licznik „Pack rhythm", Privacy bez pustki, etykiety paska, bramki

Recenzent niezależny, 25.11.2026. Zakres: `git diff 75a312c..HEAD -- app scripts` (commity f4ab9f0, 824e657, merge 063300b).
Build produkcyjny na :3000 (nie ruszany, bez buildu i bez gates.sh). Zrzuty i skrypty pomiarowe: `/tmp/rev47/`
(`t1.cjs` licznik/CLS/Privacy, `t1b.cjs` reduced motion/bez JS/kółko, `t3*.cjs` etykiety paska, `t4*.cjs` pierwszy klik).
Pomiary w Chromium z `navigator.webdriver=false` (kokpit przypięty na ≥900 px potwierdzony `data-pin`).

## Werdykt

**PASS — bez IMPORTANT w zakresie zmiany.** Można commitować i scalać. Wszystkie trzy punkty A działają zgodnie ze spec,
bramki B nie dają fałszywego PASS, samotesty przechodzą. Jest jedna rzecz o wysokiej wadze, ale **sprzed tej zmiany i poza
diffem** (wąski telefon Pharmacy na niskich laptopach, niżej „Poza zakresem") — do następnego przebiegu, nie blokuje.

## IMPORTANT

Brak (w zakresie diffu).

### Poza zakresem, wysoka waga (istniało przed zmianą)

**Telefon „Pharmacy purchases" w przypiętym kokpicie jest za wąski na typowych laptopach.** Szerokość telefonu:
1440×900 → 193 px, 1440×789 → 160, 1536×730 → 141, 1280×720 → 140, **1366×657 → 118 px** (najczęstszy viewport laptopa
1366×768 z paskami przeglądarki), 1100×620 → 107, 900×600 → 89. Poniżej progu 150 px, który sama bramka WebKit uznaje za
FAIL — bramka go nie widzi, bo mierzy tylko 390×844 i 1440×900 i pod WebDriverem kokpit nie jest przypięty. Na 1366×657
nagłówek w telefonie nachodzi na siebie („TOV… SAMPLE DATA" na „BOUGHT IN A PHARMACY?"), etykiety paska 6,3 px
(`/tmp/rev47/1366x657-pharmacy.png`). Diff tego nie spowodował (rozmiar telefonu Pharmacy nietknięty); nowa reguła
`@container (max-width:140px)` w `app/nawyko/nawyko.css:1366` tylko zamieniła nachodzenie etykiet na ich skalowanie —
to poprawa, ale 5,6–7,7 px jest nieczytelne. Propozycja na następny przebieg: (a) najtaniej — podnieść `min-height` w
`CK_PIN_Q` (`app/nawyko/NawykoClient.tsx:1913`) z 600 do ok. 700–720 px, wtedy niskie okna dostają układ nieprzypięty
(telefony ~213 px), albo (b) w `@media (max-height:760px)` w `cockpit-scroll.css` dać telefonowi Pharmacy minimalną
wysokość (`--ckp:max(310px,…)`) kosztem kart po bokach/podtytułu; plus dopisać do `gates.sh` pomiar przypiętego kokpitu
na 1366×657 z progiem 150 px.

## Co sprawdzone (dowody)

1. **Licznik 30→34 (`#rhythm`).**
   - 390 (nieprzypięty): klik zakładki 06, potem przewijanie kółkiem po 60 px. Telefon poza ekranem → 34; telefon wchodzi
     (7 % widoczny) → 30 (uzbrojony, bez startu); przy 48 % widoczności start: 30 → 31 (340 ms) → 32 (680) → 33 (850) →
     34 (1190 ms). Animacja jest widoczna w całości, gdy telefon jest na ekranie. Zjazd z ekranu i powrót → zagrana ponownie
     (raz na pokazanie). Zrzut `390-rhythm-phone.png`.
   - 1440 przypięty: klik zakładki — 30 (0–209 ms), 31 (312), 32 (694), 33 (1002), 34 (1208 ms); kropki 1 → 38 → 74/74
     od tej samej chwili. To samo przy wjeździe w odcinek kółkiem i przy strzałce z klawiatury (fokus zostaje na zakładce).
     `1440-rhythm-mid.png`, `1440-rhythm-end.png`.
   - Reduced motion (390 i 1440): 20 ms po kliknięciu 34 i 74/74, także po przewinięciu do telefonu. Bez JS: 34 i 74/74.
   - CLS (PerformanceObserver layout-shift) w trakcie animacji i przewijania: 0,0000 na 390 i 1440.
   - Czytniki ekranu: licznik nie ma `aria-live`, a cały `.nk-phone` ma `aria-hidden="true"` — nie jest ogłaszany co klatkę.
   - Logika: `took` (`NawykoClient.tsx:366–370`) = 30 + min(3, ⌊4t⌋), 34 dopiero przy t = 1 — zgodnie ze spec.
2. **Privacy 1440.** Telefon 296×510 (było 325×560: −9 %, ≥150 px i w granicy 10 % ze spec). Odstęp „Streak" → przycisk
   20 px (było ~200 px). Przycisk 237×44, wygląda jak zwykły przycisk aplikacji pod treścią. „Health data consent · off"
   w jednej linii (wysokość 13 px = 1 × line-height 13,05 px przy 9 px). `1440-privacy.png`, `1440-privacy-phone.png`.
   Pod przyciskiem zostaje 145 px ciemnego ekranu do paska (drobne 1).
3. **Etykiety dolnego paska.** 390: 10,00 px we wszystkich telefonach kokpitu, 1 linia, bez nakładania (odstępy 16 px).
   1440: 10,00 px, Pharmacy 193 px (odstępy 10 px), Privacy 296 px (36 px), Never/Rhythm 215 px (16 px) — bez łamania
   i przycięcia. Niskie okna: patrz „Poza zakresem" (1280×720: 7,70 px, 1100×620: 5,58 px, 900×600: 4,39 px; bez nakładania).
4. **Pierwszy klik „03 Privacy" kończy na „Pharmacy" — odtworzone 3/3** (1440×900, świeży kontekst). Przewinięcie kończy
   się na pozycji 1,96 odcinka zamiast 2,00. Przyczyna: **baner zgody cookies**. Pojawia się przy pierwszym przewinięciu
   strony (`CookieConsent.tsx:79`) i ustawia `--consent-h: 57px`, co skraca `.nk-ck-pin` (`height:calc(100svh - var(--consent-h))`,
   `cockpit-scroll.css:10`) z 900 na 843 px, więc odcinek toru rośnie z 405 na 415 px. `scrollToSeg`
   (`NawykoClient.tsx:1961–1966`) liczy cel `top + i·seg + 1` ze starej geometrii (seg 405), a `scrollend` (`stop`) zdejmuje
   blokadę `lock`, więc `tick` bierze `floor(1,96)` = Pharmacy. Dowód: z zapisaną zgodą (`cookie-consent` w localStorage)
   pierwszy klik kończy na 2,00 → Privacy (`t4c.cjs`). Głęboki link `/nawyko#privacy` działa w obu przypadkach.
   **Było przed zmianą:** diff nie dotyka `pick`/`scrollToSeg`/`track`/`tick` ani `.nk-ck-pin` (jedyna zmiana w
   `cockpit-scroll.css` to `--ckp` telefonu Privacy). Realny użytkownik trafia na to rzadko (żeby kliknąć zakładkę, zwykle
   najpierw przewija, a baner pokazuje się wtedy wcześniej) — dotyka głównie automatów i nawigacji klawiaturą. Drobne 2.
5. **Nic nie usunięte.** W diffie `app/` nie zmienia się żaden węzeł tekstowy JSX ani sekcja; zmiany TSX to tylko wzór
   `took`, rozdzielenie zegarów (`useEntrance`, `partInView`, `stillMotion`) i propsy `t`. CSS: marginesy/rozmiary, żadnego
   `display:none`/`hidden`. Nowych tekstów brak.
6. **Skrypty.**
   - `gates-lib.sh` `gates_result`: PASS tylko przy kodzie 0 **i** linii PASS (kotwica `^`); rozbieżność, brak linii,
     limit czasu → FAIL z komunikatem. `gates.sh` używa `run_expect` dla css-dropped (`^CSSDROPPED fail=0 `) i webkit-390/1440
     (`^PASS: `); `TMO` i `add` zdefiniowane. `bash scripts/gates-run-selftest.sh` → PASS (6/6, z „PASS + kod 2" → FAIL).
   - `webkit-check.py`: jedno wyjście przez `finish()` z `os._exit`, błąd `drv.quit()` → WARN. Uruchomiony raz osobno na 390:
     **kod 0 i linia PASS** (wcześniej kod 2). Przyczyny nie nazwano wprost (komentarz mówi o sprzątaniu selenium) — ale
     skoro `gates.sh` i tak wymaga zgodności kodu z linią, nawrót da głośny FAIL, nie cichy PASS.
   - `css-dropped.mjs`: `bash scripts/css-dropped-selftest.sh` → PASS (15/15). Na repo: fail=0, info=9, 8393 deklaracji,
     21 plików, 1,9 s; zero INFO z `var()`. Własne próby: `:is(.a,::before)` → FAIL; łańcuch `--f:var(--g)` → poprawnie
     bez INFO. Fałszywego PASS nie znalazłem; fałszywe INFO opisane w drobnych 4.
7. **Rubryka.** Czytelność dobra, ruch oszczędny (kropki + cyfry, bez fajerwerków). Klawiatura: strzałki przełączają
   zakładki i przenoszą fokus. Na `/nawyko` widoczna tylko wymyślona marka „Tovemi"; „Genactiv" występuje 2× w HTML
   wyłącznie w JSON-LD Organization z `app/layout.tsx` (lista pracodawców całej strony, poza diffem, niewidoczne).
   Nowych liczb brak (30/34 to istniejące stałe, wykres opisany „Illustration · invented data").

## Drobne

1. **Privacy 1440: pustka przeniosła się pod przycisk.** Między „Agree and turn on" a paskiem zostaje 145 px (28 % wysokości
   telefonu). Wygląda naturalnie (treść u góry, pasek u dołu jak w aplikacji), spec spełniona; jeśli ma być ciaśniej,
   można zejść z `--ckp` do ~460 px albo podnieść `.nk-lock li` padding — bez nowych tekstów.
2. **Pierwszy klik zakładki tuż po załadowaniu (opis w pkt 4).** Poprawka w `NawykoClient.tsx:1965`: celować w środek
   początku odcinka zamiast w +1 px, np. `t.top + i * t.seg + Math.min(t.seg * 0.25, 120)` — odporne na zmianę wysokości
   paska zgody; albo w `stop` (scrollend) przy aktywnym `lock` i `i !== l.i` ponowić `scrollToSeg(l.i, false)`.
3. **1440: licznik i kropki startują razem, ale nie kończą razem.** Kropki są pełne po ~0,6–0,7 s, licznik dochodzi do 34
   po 1,2 s, więc przez pół sekundy wykres jest gotowy, a telefon pokazuje 31–33 (`1440-rhythm-mid.png`). Spec mówi
   „licznik rozłożony na cały czas animacji kropek" — można skrócić zegar licznika do faktycznego czasu kropek albo
   rozciągnąć dosypywanie kropek na pełne 1,2 s.
4. **`css-dropped.mjs` — fałszywe INFO (nie FAIL):** (a) wartość z ≥ 6 wywołaniami `var()` zawsze daje INFO, nawet gdy
   wszystkie zmienne są zdefiniowane (`box-shadow` z 6 zmiennymi, `/tmp/rev47/css/many.css`) — `varVariants` zwiększa
   `depth` także przy rekurencji po kolejnych `var()` w tej samej wartości (`rest`), więc przekracza limit 4; licznik
   głębokości powinien rosnąć tylko przy podstawianiu definicji. (b) `repeat(var(--n),1fr)` bez definicji `--n` → INFO,
   bo zastępcze `0`/`#000` są tu niepoprawne; dodać `1` do `VAR_PLACEHOLDERS`. Dziś w repo zero takich INFO.
5. **Nagłówek kokpitu na 1440 pod paskiem nawigacji** („Now the same app from your side…" przycięty u góry przy przypiętej
   scenie, `1440-privacy.png`) — tak samo w zrzucie q4 (`agencja/podglad/r6q4b-privacy-1440.png`), sprzed zmiany.
6. `css-dropped.mjs`: selektor z pseudoelementem w `:is()`, który Chromium dodatkowo odrzuca w całości, dostałby dwie
   linie FAIL (z `forgivingBad` i z `res.sel`) — kosmetyka raportu.
