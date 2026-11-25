# Recenzja 48 — R6' q6 (spec 40): pierwszy klik zakładki kokpitu, telefon „Pharmacy”, bramka `cockpit-pin`

Recenzent niezależny, 25.11.2026. Zakres: niezacommitowany diff na `agencja/strona` (`app/nawyko/NawykoClient.tsx`,
`app/nawyko/cockpit-scroll.css`, `scripts/gates.sh`, nowy `scripts/cockpit-pin-check.mjs`). Build produkcyjny na :3100
(nie ruszany). Chromium z `scripts/chromium-exe.cjs`, `navigator.webdriver=false` przez `addInitScript` (kokpit przypięty
potwierdzony `data-pin`). Skrypty i zrzuty: `/tmp/rev48/` (`t1.cjs` klik od góry, `t2.cjs` klawiatura/kotwice/kółko/
reduced motion, `t3*.cjs`/`t4.cjs` kółko w trakcie skoku, `t5.cjs` pomiary i zrzuty Pharmacy, `t6.cjs` przegląd szerokości,
`t7.cjs` fokus i układy nieprzypięte). Bez pomiarów wydajności.

## Werdykt

**FAIL — jedno IMPORTANT (część B).** Część A (klik zakładki) działa i jest bezpieczna: 0 błędów w 72 klikach, bez pętli,
kotwice/klawiatura/reduced motion bez zmian; zostają dwa drobne skutki uboczne ponowienia. Część B rozwiązuje szerokość
telefonu (≥ 160 px wszędzie), ale nowa siatka dwukolumnowa **kładzie kartę „Bought online” na nagłówek i podtytuł panelu**
na oknach 900–~1260 px szerokości — tekst, który wcześniej był widoczny, jest teraz zasłonięty. Bramka `cockpit-pin` tego
nie widzi (mierzy tylko szerokość telefonu), więc dała PASS.

## IMPORTANT

**I1. Karta „Bought online” zasłania nagłówek i podtytuł Pharmacy na oknach 900–~1260 px (przypięty kokpit).**
Przyczyna: `.nk-pharmstage` w prawej kolumnie (`minmax(0,1.2fr)`) zostaje trzykolumnowe (`minmax(0,1fr) auto minmax(0,1fr)`
z `nawyko.css:1190`); telefon (`auto`, do 252 px) zjada prawie całą kolumnę, a karty mają `min-width:min(100%,220px)`
i `justify-self:end/start`, więc wylewają się poza scenę — lewa w lewo, na kolumnę z tekstem, prawa w prawo (do 79 px
poza scenę). Pomiar prostokątów linii tekstu pod kartą (`t6.cjs`, świeży kontekst, `/nawyko#pharmacy`, zgoda zapisana):
- zasłonięty h2 „Pharmacy buyers show up in your data…” i/lub „A pack bought offline starts the daily card…”:
  900×600, 960×600, 1020×600 · 900–1140×657 · **900–1260×768** (m.in. 1024×768, 1180×768) · 1280×800 (styk);
- czyste: ≥ 1080×600, ≥ 1200×657, ≥ 1320×768, 1366×657, 1280×720 (10 px odstępu), 1440×900, 1920×1080.
- Zrzuty: `/tmp/rev48/ph-1024x768.png` (karta na „data” i „daily card,”), `ph-900x600.png`, `ph-900x600-bar.png`,
  `ph-1180x768.png`, `ph-1280x800.png`.
- Dodatkowo 900×600 z paskiem cookies: telefon 160 px, w jego nagłówku „TOVE… / SAMPLE DATA” łamie się na dwie linie
  i nachodzi na „BOUGHT IN A PHARMACY?” (`ph-900x600-bar.png`) — próg 150 px przechodzi, czytelność nie.
To łamie regułę spec 40 „żadna sekcja ani zdanie nie znika” w sensie widoczności i kryterium „bez nakładania”.
Propozycja: w przypiętym Pharmacy zdjąć `min-width` kart (`min-width:0`) i dać scenie kolumny z dolną granicą
(np. `minmax(110px,1fr) auto minmax(110px,1fr)`), a telefonowi szerokość z `min(…cqh, …cqw)`, żeby to on się zwężał,
nie karty wychodziły poza scenę; albo poniżej ~1300 px karty pod telefonem w jednym rzędzie. Do bramki dopisać test
nakładania: prostokąty linii tekstu nagłówka/stopki vs prostokąty `.nk-src` i `.nk-phone` (wzór w `t6.cjs`) oraz
okno 1024×768 i 1180×768.

## Drobne

1. **Ponowienie w `stop` zjada pierwszy ruch kółka w trakcie skoku.** Klik „06”, po 250 ms jedno pociągnięcie kółkiem
   w górę → pierwszy `scrollend` przychodzi z blokadą jeszcze aktywną, `stop` robi natychmiastowy skok z powrotem na
   odcinek 06 (`t4.cjs`: `wheels=1 … final pos 5.25`, `wheels=4` kończy na 3.03 — dopiero kolejne ruchy działają;
   `t2.cjs` scenariusz B: drugi `scrollTo auto` 350 ms po kliku). `stop` ignoruje `l.until` i nie rozróżnia przerwania
   przez użytkownika. Skutek łagodny (ląduje tam, gdzie kliknął), ale spec mówił „przewijanie kółkiem bez zmian”.
   Naprawa: zdjąć blokadę na `wheel`/`touchstart`/`keydown` (strzałki/PgDn) i ponawiać tylko, gdy `|scrollY − cel| < seg`.
2. **Ponowienie odpala się na „starym” `scrollend` i ucina płynny skok.** Przy kliku tuż po przewinięciu (Playwright
   przewija zakładkę do widoku; u ludzi: klik w trakcie bezwładności trackpada) `scrollend` poprzedniego przewinięcia
   przychodzi w trakcie animacji → skok kończy się natychmiast (`t1.cjs`: 5/6 klików od góry ma drugi `scrollTo auto`
   z tym samym celem, także przy zapisanej zgodzie). Wynik poprawny, tylko bez animacji. Tę samą poprawkę co w 1.
   Uwaga: sam cel „w głębi odcinka” wystarcza — z wyłączonym `scrollend` (symulacja starszego Safari, `NOEND=1 t1.cjs`)
   wszystkie 18 klików na 1440×900/1366×657/900×600 kończy się na klikniętej zakładce.
3. **Pasek postępu aktywnej zakładki startuje od ~25 %** po kliku/kotwicy (`--f` = 0,25 zamiast ~0), bo cel to
   +min(25 % seg, 120 px). Po zmianie geometrii przez pasek cookies `--f` bywa nieaktualne (06: `f=0.249` przy pozycji 5.129),
   bo `tick` nie biegnie bez zdarzenia `scroll`. Kosmetyka.
4. Karta „Bought in a pharmacy” na 1280×720 i 900×600 łamie się w 3–4 linie z sierotą „A” (`ph-1280x720.png`);
   na 1920×1080 panel ma dużo pustej czerwieni wokół małych kart — poprawne, ale mniej zrównoważone niż na 1440.
5. Bramka nie sprawdza nakładania ani przycięcia (patrz I1) i nie ma okna 1024×768; ścieżka bez `scrollend` i przerwanie
   kółkiem też nie są pokryte.

## Co sprawdzone (dowody)

1. **Klik zakładki (A).** `t1.cjs`, świeży kontekst, bez `cookie-consent`, 1440×900 / 1366×657 / 900×600, klik każdej
   zakładki od góry strony: **18/18 ok**, pasek cookies wjeżdża (`--consent-h: 57px`), pozycje 0,002 / 1,22 / 2,20 / 3,17 /
   4,15 / 5,13 (1440). Z zapisaną zgodą (1440, 1366): 12/12 ok, pozycje i,25. Bez `scrollend`: 18/18 ok.
   - Pętla: niemożliwa — ponowienie wywołuje `scrollToSeg(i,false)`, które zeruje `lock`, więc kolejny `stop` tylko woła `on()`.
     W logach maks. jeden `scrollTo auto` po kliku.
   - Klawiatura (`t2.cjs` C): 5× → szybko (120 ms) kończy na 06 (5,249), → z 06 zawija na 01, End → 06, ← → 05; fokus na zakładce.
   - Kotwice `#paths/#pharmacy/#privacy/#rhythm`: aktywna = kotwica, pozycje 0,002/1,249/2,25/5,249, hash zostaje.
   - Klik myszą po ustaniu przewijania (A): jeden `scrollTo smooth`, bez ponowienia, zakładki 3/5/0/2 ok.
   - Zakładka 0: cel +1 px bez zmian; ostatnia (06): cel 5,25 seg, mieści się w torze.
   - Reduced motion: kokpit nieprzypięty, klik 03 → `scrollIntoView`, `stop` nie ponawia (strażnik `isPin`).
   - Kółko w trakcie skoku: drobne 1.
2. **Pharmacy (B)** (`t5.cjs`, zrzuty `/tmp/rev48/ph-<W>x<H>[-bar].png`): telefon 1366×657 221 px (z paskiem 193),
   1280×720 247 (219), 1440×900 252 (252), 1920×1080 252 (252), 900×600 187 (160). Najmniejsza czcionka w telefonie
   9 px (8,95 px na 900×600 z paskiem) — próg ~9 px spełniony. Brak przycięcia przez panel (`scrollHeight = clientHeight`,
   `zoom` 1). Nakładanie: I1. Fokus „Scan the box” z klawiatury: obrys 3 px biały, offset 4 px, wyraźny na czerwieni
   (`focus-scan-1366x657.png`); Enter skanuje (`scanned-1366x657.png`).
   Układy nieprzypięte bez zmian: wszystkie nowe reguły są pod `.nk-cockpit[data-pin]` w bloku `@media (min-width:900px)
   and (min-height:600px) and (prefers-reduced-motion:no-preference)`; 390×844 → `pin=false`, telefon 213 px; 1440×900
   pod webdriverem → `pin=false`, układ wyśrodkowany jak dotąd (`unpinned-390x844.png`, `unpinned-1440x900-wd.png`).
   Tekst w JSX nietknięty (diff TSX to tylko `scrollToSeg`/`stop`).
3. **Bramka `cockpit-pin`.**
   - Werdykt w `gates.sh` przez `run_expect '^COCKPITPIN PASS'` → `gates_exec`/`gates_result`: PASS tylko przy kodzie 0
     **i** linii PASS. Skrypt: `exit(fails?1:0)` i linia PASS/FAIL na końcu; błąd użycia → 2. Spójne.
   - `TMO=$((TMO * 3)) run_expect …` — w bashu przypisanie przed wywołaniem funkcji działa tylko na czas wywołania
     (sprawdzone: `in=3 after=1`). Czas: 2 okna = 1 min 49 s → 5 okien ≈ 4,5 min wobec limitu 720 s (zapas ~2,6×).
   - Regresja: na tym buildzie PASS (1366×657, 900×600: 24/24 ok). Starego buildu nie uruchamiałem (nie wolno było
     restartować serwera). Rozumowanie: tryb `jump` odtwarza dokładnie scenariusz recenzji 47 (klik od góry, pasek
     wjeżdża w trakcie skoku), stary cel `+1 px` kończył na i−0,04 → `on = i−1` → FAIL dla i ≥ 1 (5/6), a telefon
     Pharmacy 91/118/132 px < 150 → FAIL. Twierdzenie budującego jest spójne z mechanizmem — wiarygodne, niezweryfikowane.
   - Ryzyko niestabilności: niskie (stałe oczekiwania 1,2 s/2,2 s, ale cel 25 % w głąb odcinka daje zapas; 0 rozrzutu
     w moich przebiegach). Luka: brak testu nakładania (I1), brak 1024×768.
4. **Inne.** `eslint` na `NawykoClient.tsx`: 0 błędów. `stop` w efekcie `[]` łapie `scrollToSeg` z pierwszego renderu —
   bezpieczne, bo używa wyłącznie refów (`track`, `lock`). `gates.sh` zmienia się tylko o nowy krok dla `/nawyko`.

## Dopisek Leada (25.11 14:05) — co zrobione z uwagami przed commitem
- I1: karty przeniesione do lewej kolumny (obok siebie, nad „Scan the box”), scena kart `display:contents`, telefon w prawej kolumnie na całą wysokość panelu; „Sample data” w jednym wierszu w ekranie ≤ 175 px. Sprawdzone bramką `cockpit-pin` (nowy test nakładania bloków Pharmacy i wyjścia poza panel) na 900×600, 1024×768, 1180×768, 1366×657, 1440×900, 1920×1080 — PASS; zrzuty `agencja/podglad/r6q6-ck-*`. Ponowna recenzja niezależna nie była uruchomiona (limit czasu przebiegu) — do potwierdzenia w następnym przebiegu.
- Drobne 1–2: ponowienie przy `scrollend` usunięte (sam cel w głębi odcinka wystarcza, jak pokazał test bez `scrollend`).
- Drobne 3–4: do „Następne” (R6'-N6). Drobne 5: bramka ma teraz test nakładania i okno 1024×768.
