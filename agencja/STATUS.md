# Agencja — stan strony oleksiakconsulting.com

Ostatni przebieg: 24.11.2026 21:38–22:35 (runda 6', przebieg 1 — `/nawyko`: kokpit „For you” po portfelu (5 zakładek z dotychczasowych sekcji 1:1: ścieżki, apteka, prywatność, dowód, „czego nie robi”), `#integrations` jako „Your store” z 7 silnikami, FAQ jako pytania-chipy; bramka inwentarza sekcji (nagłówki, kroki, zdania, dwie sekcje w tym samym tle) w `gates.sh`; spec 35, recenzja 43). Wcześniej: 24.11.2026 20:38–21:25 (runda 6, przebieg 2 — zbudowany przed cofnięciem R6 i NIE wypuszczony na `agencja/strona` w części `app/nawyko/` (zgodnie z PILNE R6-COFNIĘTE); zachowany do ponownego użycia na gałęzi `agencja/r6p2-odrzucone`; na `agencja/strona` weszły tylko bramki: `webkit-check.py` nie jest już ślepa, `qa.js` zna wzorzec visually-hidden; spec 33 i 34, recenzja 42). Wcześniej: 24.11.2026 19:38–20:35 (runda 6, przebieg 1 — `/nawyko`: hero jako jedyny konfigurator marki (nazwa, kolor, styl strony), przerywnik „why” w kolorze marki z licznikiem dni przypiętym na pełnym ekranie, kokpit mechanik na atramencie (8 zakładek, telefon klienta + ustawienia marki) zamiast 9 starych sekcji; `/work/genactiv`: 140 svh na akt, tekst po ustabilizowaniu telefonu, stały numer aktu ze streszczeniem, naprzemienne układy; spec 31 i 32). Wcześniej: 24.11.2026 18:37–19:20 (runda 5, przebieg 3 cz. 1 — `#paths`, `#pharmacy`, `#privacy` w trzech różnych układach i trzech powierzchniach zamiast „tekst + telefon” w lustrze; monotonia 2: FAIL, lepiej niż 36; spec 30). Wcześniej: 24.11.2026 17:38–18:35 (runda 5, przebieg 2 cz. 2 — trzy sceny „tekst + telefon” od „Cashback” zastąpione jedną sekcją w głębokim atramencie z trzema ekranami aplikacji (bento: portfel cashback, punkty i poziomy, panel marki w pełnym kolorze marki z suwakiem kursu); pierwsza bramka `monotonia` (FAIL — punkt odniesienia); spec 29). Wcześniej: 24.11.2026 16:38–17:30 (runda 5, przebieg 2 — wielki finał `/nawyko` „One morning with {marka}”: przypięta scena pięciu chwil poranka klienta (ikona marki na ekranie głównym → powiadomienie → zdrapka w kolorze marki → dzień 24 i pieczątka → kod na kolejne opakowanie, sekcja przechodzi w kolor marki i w formularz), formularz bez drugiego telefonu; naprawiona ucięta scena „Your brand” z paskiem cookies (390×844, 1100×620, 1280×720 — regres z p1); spec 28). Wcześniej: 24.11.2026 13:38–14:30 (runda 5, przebieg 1 — hero `/nawyko` z żywym ekranem aplikacji w marce odwiedzającego, silnik marki na całą witrynę (`app/lib/brand-engine.ts`), zero nazwy demo po wpisaniu własnej, finał bez dubla, bramki `brand-propagation` Chromium + Safari w `gates.sh`, spec 27). Wcześniej: 24.11.2026 11:38–12:35 (runda 4, przebieg 14 — `/nawyko` scena przypięta na niskim laptopie (1100×620, 1280×720, z paskiem cookies i bez) bez ucięć i zasłonięć, nowa bramka `short-viewport-check`; `/calculator` liczba pojedyncza, obrys fokusu suwaka nie zasłania podpisów, suwak sprawdzony w Safari; `gates.sh` z `GATES_LOGDIR` i wspólnym parsowaniem). Wcześniej: 24.11.2026 10:38–11:35 (runda 4, przebieg 13 — bramka `scroll-perf` z rozgrzewką i medianą 3 przebiegów (koniec fałszywych FAIL), testy samej bramki `clsscroll`/`scroll-perf`, pierwszy pełny pomiar 5 tras narzędzi z poprawką przelewania `/lab/reward` na 390; stała lista kroków `/nawyko` zbudowana i WYCOFANA po recenzji 29). Wcześniej: 24.11.2026 09:38–10:25 (runda 4, przebieg 12 — szlif i bramka: `cls-scroll` w `gates.sh` (CLS przy przewijaniu kółkiem na każdej trasie), teksty w telefonie `/nawyko` bez mikro-przesunięć, fokus po skoku z paska `/work/genactiv` sprawdzony 8/8; zmiana listy kroków i trzy nagłówki wycofane po recenzji i czytelniku). Wcześniej: 24.11.2026 08:38–09:20 (runda 4, przebieg 11 — szlif bez nowych elementów: `/work/genactiv` przewijanie bez przesunięć układu (CLS kółkiem 0,0034 → 0), pasek aktów w kolejności Tab przed sceną i nigdy na pierwszym ekranie; `/nawyko` gałka osi 30 dni na `transform`, nagłówek FAQ od treści; pierwszy pomiar bramek na `/`). Wcześniej: 24.11.2026 07:38–08:20 (runda 4, przebieg 10 — pasek rozdziałów także na `/work/genactiv` (8 rozdziałów z aktów sceny + „Ask about a brand app”), szlif paska `/nawyko` z recenzji 25 (w scenie na komputerze jeden rząd: rozdział + akt + CTA; fokus na sekcji po skoku); `gates.sh` odmawia pomiaru starego serwera). Wcześniej: 24.11.2026 06:38–06:58 (runda 4, przebieg 9 — `/nawyko` pasek rozdziałów jak na stronach produktowych Apple: bieżący rozdział, lista 7 rozdziałów i stały przycisk zapytania, pojawia się przy przewijaniu w górę; `scripts/gates.sh` — wszystkie bramki jednym poleceniem). Wcześniej: 24.11.2026 05:38–06:05 (runda 4, przebieg 8 — `/nawyko` płynniejsza scena: klatki > 50 ms przy przewijaniu na 1440 (CPU 4×) 14 → 0, na 390 3 → 1; nowa bramka `scroll-perf`; obrys fokusu linków w nagłówku `/` nie nachodzi na sąsiedni link (test `focus-ring`); skrypty Playwright same znajdują Chromium; `/work/genactiv` zmierzona — bez zmian, bo nie było czego poprawiać). Wcześniej: 24.11.2026 04:38–05:10 (runda 4, przebieg 7 — `/work/genactiv`: rezerwa pod pasek cookies tylko bez zgody i wejście z `#enquiry` bez skoku naprawdę (0,17 → 0; stary pomiar „0” był ślepy); `/` przy wolnych fontach CLS 1,0 → 0,07; `/nawyko` JSON-LD jako graf z widocznego tekstu + test). Wcześniej: 24.11.2026 03:38–04:30 (runda 4, przebieg 6 — wjazd do Nawyko z nagłówka `/` przez ship-design; `/work/genactiv#enquiry` bez skoku; `webkit-check` naprawdę ogląda scenę `/nawyko` i złapał za mały telefon na 390). Wcześniej: 24.11.2026 02:38–03:35 (runda 4, przebieg 5 — `/nawyko` scena „czego nie robi” z przełącznikami, kotwica `#enquiry` bez skoku (krój); realizacja: Safari pierwszy ekran, zmiana ekranów bez nakładania tekstów; `webkit-check` widzi przypiętą scenę). Wcześniej: 24.11.2026 01:38–02:05 (runda 4, przebieg 4 — wspólna nawigacja + `/tools` (spec 14); realizacja: `Enquiry` w osobnym module, etykieta w kolorze marki, rezerwa cookies, przenikanie ekranów). Wcześniej: 23.11.2026 23:38 – 24.11 00:10 (runda 4, przebieg 3 — `/nawyko` finał (k) z kolorem marki i stała rezerwa sceny; `/work/genactiv` akty 9–10, formularz `work`, nawigacja; R10). Wcześniej: 22:38–23:10 (R4 przebieg 2). Wcześniej: 21:38–22:20 (R4 przebieg 1). Wcześniej: 16:38–17:15 (runda 3, przebieg 6 — nowe narzędzie `/lab/reminder`, zdrapka w wersji bez ruchu na `/nawyko`, R7). Wcześniej przebieg 5 (15:38–16:10), przebieg 4 (14:38–15:00), 3 (13:38–14:05), 2 (13:14–13:30) i 1 (12:45–13:15). Gałąź: `agencja/strona` (od `claude/production` f4594c8).
Wcześniej (równolegle): 24.11.2026 12:38–13:50 (runda 4, przebieg 15 — `/nawyko` na telefonie z paskiem cookies bez ucięć (390×844, 360×740, 375×667), Tab po krokach 01–04 przełącza scenę, etykiety 1100 px w jednym wierszu; `gates.sh` sprawdza niskie okno (`short-1100c/1280c/390c`) i nie odmawia już na dobrym serwerze; `/calculator` obrys fokusu suwaka w skrajnych położeniach). Wcześniej: 24.11.2026 11:38–12:35 (runda 4, przebieg 14 — `/nawyko` scena przypięta na niskim laptopie (1100×620, 1280×720, z paskiem cookies i bez) bez ucięć i zasłonięć, nowa bramka `short-viewport-check`; `/calculator` liczba pojedyncza, obrys fokusu suwaka nie zasłania podpisów, suwak sprawdzony w Safari; `gates.sh` z `GATES_LOGDIR` i wspólnym parsowaniem). Wcześniej: 24.11.2026 10:38–11:35 (runda 4, przebieg 13 — bramka `scroll-perf` z rozgrzewką i medianą 3 przebiegów (koniec fałszywych FAIL), testy samej bramki `clsscroll`/`scroll-perf`, pierwszy pełny pomiar 5 tras narzędzi z poprawką przelewania `/lab/reward` na 390; stała lista kroków `/nawyko` zbudowana i WYCOFANA po recenzji 29). Wcześniej: 24.11.2026 09:38–10:25 (runda 4, przebieg 12 — szlif i bramka: `cls-scroll` w `gates.sh` (CLS przy przewijaniu kółkiem na każdej trasie), teksty w telefonie `/nawyko` bez mikro-przesunięć, fokus po skoku z paska `/work/genactiv` sprawdzony 8/8; zmiana listy kroków i trzy nagłówki wycofane po recenzji i czytelniku). Wcześniej: 24.11.2026 08:38–09:20 (runda 4, przebieg 11 — szlif bez nowych elementów: `/work/genactiv` przewijanie bez przesunięć układu (CLS kółkiem 0,0034 → 0), pasek aktów w kolejności Tab przed sceną i nigdy na pierwszym ekranie; `/nawyko` gałka osi 30 dni na `transform`, nagłówek FAQ od treści; pierwszy pomiar bramek na `/`). Wcześniej: 24.11.2026 07:38–08:20 (runda 4, przebieg 10 — pasek rozdziałów także na `/work/genactiv` (8 rozdziałów z aktów sceny + „Ask about a brand app”), szlif paska `/nawyko` z recenzji 25 (w scenie na komputerze jeden rząd: rozdział + akt + CTA; fokus na sekcji po skoku); `gates.sh` odmawia pomiaru starego serwera). Wcześniej: 24.11.2026 06:38–06:58 (runda 4, przebieg 9 — `/nawyko` pasek rozdziałów jak na stronach produktowych Apple: bieżący rozdział, lista 7 rozdziałów i stały przycisk zapytania, pojawia się przy przewijaniu w górę; `scripts/gates.sh` — wszystkie bramki jednym poleceniem). Wcześniej: 24.11.2026 05:38–06:05 (runda 4, przebieg 8 — `/nawyko` płynniejsza scena: klatki > 50 ms przy przewijaniu na 1440 (CPU 4×) 14 → 0, na 390 3 → 1; nowa bramka `scroll-perf`; obrys fokusu linków w nagłówku `/` nie nachodzi na sąsiedni link (test `focus-ring`); skrypty Playwright same znajdują Chromium; `/work/genactiv` zmierzona — bez zmian, bo nie było czego poprawiać). Wcześniej: 24.11.2026 04:38–05:10 (runda 4, przebieg 7 — `/work/genactiv`: rezerwa pod pasek cookies tylko bez zgody i wejście z `#enquiry` bez skoku naprawdę (0,17 → 0; stary pomiar „0” był ślepy); `/` przy wolnych fontach CLS 1,0 → 0,07; `/nawyko` JSON-LD jako graf z widocznego tekstu + test). Wcześniej: 24.11.2026 03:38–04:30 (runda 4, przebieg 6 — wjazd do Nawyko z nagłówka `/` przez ship-design; `/work/genactiv#enquiry` bez skoku; `webkit-check` naprawdę ogląda scenę `/nawyko` i złapał za mały telefon na 390). Wcześniej: 24.11.2026 02:38–03:35 (runda 4, przebieg 5 — `/nawyko` scena „czego nie robi” z przełącznikami, kotwica `#enquiry` bez skoku (krój); realizacja: Safari pierwszy ekran, zmiana ekranów bez nakładania tekstów; `webkit-check` widzi przypiętą scenę). Wcześniej: 24.11.2026 01:38–02:05 (runda 4, przebieg 4 — wspólna nawigacja + `/tools` (spec 14); realizacja: `Enquiry` w osobnym module, etykieta w kolorze marki, rezerwa cookies, przenikanie ekranów). Wcześniej: 23.11.2026 23:38 – 24.11 00:10 (runda 4, przebieg 3 — `/nawyko` finał (k) z kolorem marki i stała rezerwa sceny; `/work/genactiv` akty 9–10, formularz `work`, nawigacja; R10). Wcześniej: 22:38–23:10 (R4 przebieg 2). Wcześniej: 21:38–22:20 (R4 przebieg 1). Wcześniej: 16:38–17:15 (runda 3, przebieg 6 — nowe narzędzie `/lab/reminder`, zdrapka w wersji bez ruchu na `/nawyko`, R7). Wcześniej przebieg 5 (15:38–16:10), przebieg 4 (14:38–15:00), 3 (13:38–14:05), 2 (13:14–13:30) i 1 (12:45–13:15). Gałąź: `agencja/strona` (od `claude/production` f4594c8).
Na produkcję nic nie poszło — wypuszcza wyłącznie Rafał.

**Stan rundy 3:** przebieg 1 (23.11 12:45–13:15) zrobił punkty 1–5 kolejki z 22.11 18:20; przebieg 2 (13:14–13:30) R3-2 i część R3-1; dalej „Następne”.

**PILNE 0 — ZROBIONE przez doradcę 24.11 ~00:55:** przyczyna potwierdzona w WebKit (telefon 16×403 px na 390, 20×672 na 1440 — Mac Safari też):
`max-width:100%` na `.nk-phone` (element flex z `aspect-ratio` i wysokością) kasuje w WebKit szerokość wynikającą z proporcji. Usunięte;
po poprawce 195×403 (390) i 325×672 (1440), zrzuty obejrzane. Bramka: `scripts/webkit-check.py` (instalacja w nagłówku pliku — pobranie
WebKit z Playwrighta jest tu zablokowane, działa WebKitGTK z apt). Każdy przebieg: uruchom na każdej zmienionej trasie (390 i 1440),
żaden widoczny telefon węższy niż 150 px. Nie poprawiaj tego drugi raz — sprawdź tylko, czy Twoje zmiany tego nie cofnęły.

## PILNE R6-COFNIĘTE (Rafał 24.11.2026 20:55): R6 /nawyko odrzucona — „wyrzuciłeś sedno strony”. CZYTAJ PIERWSZE.
Doradca przywrócił `app/nawyko/` i `app/lib/brand-engine.ts` do stanu 08b1858 (R5 p3 cz. 1). `/work/genactiv` z R6 zostaje
(Rafał: „GenActiv jest ok”). Przebieg, który zaczął się przed 21:00, NIE pushuje swoich zmian w `app/nawyko/` — przed pushem
`git checkout origin/agencja/strona -- app/nawyko app/lib/brand-engine.ts`. `Cockpit.tsx` zostaje w repo do ponownego użycia.

**R6 p2 (20:38–21:25) a cofnięcie:** przebieg wystartował przed 20:55 i zbudował sceny 3–6 starej R6 (dowód na atramencie, „Your store”
z 7 silnikami, pytania-chipy zamiast FAQ, kokpit przełączany przewijaniem). Zgodnie z poleceniem NIC z `app/nawyko/` nie poszło na
`agencja/strona`. Do ponownego użycia w R6' (bez usuwania sekcji!): gałąź `agencja/r6p2-odrzucone` — `Cockpit.tsx` z przypinaniem
i przełączaniem przewijaniem + `cockpit-scroll.css` (spec 34, CLS 0, WebKit PASS), sekcja `Store` i `Questions` w `NawykoClient.tsx`
(spec 33). Pobierać plikami/fragmentami (`git show agencja/r6p2-odrzucone:<plik>`), nie scalać gałęzi.

## RUNDA 6' — TYLKO części „For you” na /nawyko (spec 27 w wersji poprawionej poniżej; reszta spec 27 NIEAKTUALNA)
- NIE RUSZAĆ: hero, „Four steps that bring the customer back” z etapami na telefonie, scena „For your customer · Rewards in the
  app”, finał „One morning with {marka}”, zapytanie. Żadna istniejąca sekcja widoczna dla odwiedzającego nie znika bez słów Rafała.
- Sekcje z etykietą „For you” (panel marki/kurs punktów, ścieżki, apteka, zgody, dowód, „what it never does”) łączą się w JEDEN
  kokpit tuż po „Rewards in the app” (telefon klienta po lewej, panel marki po prawej, `Cockpit.tsx`), z jednym zdaniem-mostem,
  dlaczego teraz widok marki.
- Środkowy konfigurator: jego opcje (styl strony/tło) przechodzą do konfiguratora w hero, środkowy znika (prośba Rafała 19:15).
- Integracja: osobna sekcja, wieloplatformowa (spec 27 scena 4). FAQ: pytania jako chipy z odpowiedzią-wiadomością, FAQPage w DOM.
- Wizualnie podnieść do poziomu finału bez usuwania treści.
- NOWA BRAMKA (stała): inwentarz sekcji — lista sekcji i scen etapów `/nawyko` przed i po kawałku; każda sekcja, która zniknęła,
  = FAIL, chyba że w STATUS jest cytat zgody Rafała. Podgląd dla Rafała dopiero po zielonej bramce.

## RUNDA 5 — ŻYWA STRONA I WIELKI FINAŁ (Rafał 24.11.2026 12:47, przez doradcę). CZYTAJ PIERWSZE, PRZED RUNDĄ 4.
Spec: `agencja/specs/26-r5-zywa-strona.md` (pięć uwag Rafała + kierunek doradcy + kolejność p1–p4 + nowe bramki `brand-propagation`
i `monotonia`). Zasada zmieniona przez Rafała: „istniejąca paleta strony” już nie obowiązuje — strona ma być żywa, prowadzona
kolorem marki odwiedzającego (spec). Zacznij od p1 w najbliższym przebiegu.

**R5 p3 cz. 1 — PATHS / PHARMACY / PRIVACY ZROBIONE (24.11 18:37–19:20, spec 30).** Następny przebieg: sekcje 4–6 „How it works” po scenie (nagrody, „See the day…”, white label — trzy razy „tekst + telefon po prawej” na glinie), histogram i `#integrations` z interakcją, ekran z kodem `…-NEXT-K7Q4` tylko raz przed finałem (monotonia 2, recenzja 38).

**R5 p2 cz. 2 — PORTFEL ZROBIONY (24.11 17:38–18:35, spec 29): Cashback + Points + Your costs = jedna sekcja bento w atramencie.** Następny przebieg: Paths, Pharmacy, Privacy (dziś trzy „tekst + telefon” w lustrze pod rząd) + cztery sceny na glinie pod rząd w „How it works” (bramka `monotonia` 36) + `scroll-perf-390` (patrz R5-N3).

**R5 p2 — CZĘŚĆ „wielki finał” ZROBIONA (24.11 16:38–17:30, spec 28).** Następny przebieg: druga część p2 — przebudowa od „Cashback” w dół na prawdziwe ciemne, interaktywne ekrany w stylu hero i finału (Cashback, Points, Your costs, Learning paths, Pharmacy, Privacy) + pierwsza bramka `monotonia`.

**R5 p1 ZROBIONY (24.11 13:38–14:30, spec 27).** Następny przebieg: **p2** — wielki finał `/nawyko` (przewijanie odsłania ekran główny telefonu z ikoną marki → powiadomienie → zdrapka w kolorach marki + „Reveal without scratching” → seria i odblokowana nagroda → formularz „Build {marka}’s app”) + przebudowa od „Cashback” w dół na ciemne, prawdziwe ekrany jak w hero (część 1). Uwagi recenzji 31 do p2: tekst w telefonach ≥ 10 px; ciemny kolor marki (np. #111111) — pierścień i folia słabo widoczne na ciemnym ekranie (monogram ma już jasny obrys); kategoria produktu w silniku (p3); bramka `monotonia` jeszcze nie istnieje (subagent-krytyk od p2).

## PILNE 0 (Rafał 24.11 00:33, zrzut z iPhone'a: „już to zgłaszałem” + 00:34 „gdzie testy mobile?”) — PRZED WSZYSTKIM INNYM
**Błąd:** na iPhonie (Safari) telefon w scenie przypiętej `/nawyko` zapada się w pionowy czarny pasek (sama ramka, szerokość ≈ 2× padding),
treść ekranu niewidoczna. Chromium tego nie pokazuje, dlatego nasza bramka przepuszcza błąd. Najpewniejsza przyczyna: szerokość
`.nk-phone` wynika tylko z `aspect-ratio` przy `height` w kontenerze flex, a dziecko `.nk-screen` ma `container-type:size` (rozmiar
zawartości = 0) — WebKit liczy szerokość elementu z zawartości. **Poprawka:** jawna szerokość zamiast przenoszenia z proporcji, np.
`--ph: clamp(...)` + `height:var(--ph); width:min(100%, calc(var(--ph) * var(--rw) / var(--rh)))` (z `--rw/--rh` w każdym wariancie,
także 9/13.5), `flex:none`; to samo dla każdego elementu, który ma tylko `height` + `aspect-ratio` (telefony w `/work/genactiv` też).
**Bramka od teraz (stała): testy mobile w silniku Safari.** Playwright WebKit z profilem urządzenia `devices['iPhone 15']` (i jeden Android
w Chromium `devices['Pixel 7']`) na każdej zmienionej trasie: zrzut każdej sceny + test, że szerokość każdego `.nk-phone`/telefonu ≥ 200 px
i że ekran telefonu ma widoczną treść. WebKit instaluj do osobnego katalogu: `PLAYWRIGHT_BROWSERS_PATH=/tmp/pw-webkit npx playwright
install --with-deps webkit` (tą samą wersją Playwrighta, nie ruszając Chromium). Jeśli instalacja jest niemożliwa — napisz to w
„Dla Rafała” wprost, nie ogłaszaj „zrobione”. Lekcja: każda bramka wizualna = Chromium + WebKit (iPhone), bo klienci marek oglądają
na iPhone'ach.

## RUNDA 4 — „NAWYKO MA POKAZAĆ CAŁĄ APLIKACJĘ” (Rafał 23.11.2026 20:46, przez doradcę). CZYTAJ PIERWSZE, PRZED RUNDĄ 3.
**R4 przebieg 0 (doradca, 20:50–21:05):** zrobione sceny (a) cashback, (b) punkty i poziomy, (c) wymiana punktów + panel marki z suwakiem — komponent `Loyalty` w `app/nawyko/NawykoClient.tsx` (sekcje `#cashback`, `#levels`, `#exchange`, układ `nk-still` po scenie przypiętej, przed „What it never does”; telefon dostał widoki 7–9), plus wjazd z nagłówka ≥1200 px (How it works · Cashback · Points · Your costs). Bramka: build, tsc, lint 0 błędów, qa.js 9/9 PASS, copy-voice OK, kontrast ≥4,5 w Paper i Night. Teksty: 14 nowych wierszy w `teksty-do-akceptacji.md`. **Następne:** czytelnik-kupujący na nowych tekstach (nie zrobiony — brak subagenta), na 390 suwak (c) i telefon nie mieszczą się razem w kadrze (rozważ mniejszy telefon przyklejony nad panelem), wpięcie scen (a)–(c) w przypiętą scenę lub jej nawigację `nk-acts` (dziś są osobnymi sekcjami), potem kolejka R4 od (d).

**R4 przebieg 1 (21:38–22:20):** zrobione (d) ścieżki wiedzy z prezentem, (e) apteka/skan pudełka, (f) prywatność — `#paths`, `#pharmacy`, `#privacy`; poprawiona `#exchange` na 390 (telefon i suwak w jednym kadrze). Realizacja: `/work/genactiv` przebieg 1 (akty 0–4). **Następne `/nawyko`:** (g) dowód wyników z grupą kontrolną, (h) pas integracji, (i), (j) FAQ, (k) finał z przemalowaniem; postęp ścieżki (d) także z przewijania. **Następne realizacja:** przebieg 2 speca (akty 5–8), szlif hero 1440 (podpis pod telefonem daleko pod pudełkiem).

**R4 przebieg 2 (22:38–23:10):** zrobione (g) `#proof` dowód z grupą kontrolną (suwak „held out as control”) + rozkład „kiedy opakowanie naprawdę się kończy”, (h) `#integrations` pas pięciu kategorii, (j) `#faq` 6 pytań w `<details>`; w nagłówku ≥1200 px linki Proof i FAQ. Realizacja: akty 5–8 (cashback schody, punkty/poziomy/ścieżka, brak zgody z prawdziwym przyciskiem, oś bramek budowy bez liczb), podpis hero 1440 przy pudełku, plakietki EXAMPLE na ekranach z liczbami. **Następne `/nawyko`:** (k) finał z przemalowaniem; skok układu przy wejściu adresem z kotwicą (np. `/nawyko#proof`: 0,33–1,09 — przyczyna sprzed R4: scena główna renderuje się statycznie z serwera i po hydratacji zmienia wysokość; potrzebna stała rezerwa wysokości sceny, spec 12); na 1440 wykres w `#proof` zaczyna się pod zgięciem (nagłówek w 3 liniach). **Następne realizacja:** przebieg 3 speca (wyniki jako stan zablokowany, finał z formularzem `work`, „Work” w nawigacji).

**R4 przebieg 3 (23:38–00:10):** zrobione (k) finał `#enquiry` „See it with your brand” (wybór koloru marki: 6 próbek + własny; telefon, pasek i plakietka przemalowują się na żywo; kolor nie jest wysyłany), telefon finału widoczny także na ≤ 860 px; stała rezerwa wysokości sceny z serwera (`html[data-nk-pin]` z inline-skryptu) i stała rezerwa pod pasek cookies — skok przy wejściu z kotwicą z 0,32–1,17 do 0–0,15 (spec 13, tabela). Realizacja: akt 9 wyniki jako stan zablokowany, akt 10 finał z kolorem, formularz `Enquiry` (`form="work"`) pod sceną, nagłówek Nawyko · Work · Contact. **Następne `/nawyko`:** dobić kotwice do ≤ 0,05 (`#enquiry` 390: 0,12–0,15; ~0,055 na 1440 bez źródła; `HeroGap`), (i) „czego nie robi” jako scena — dziś trzy zdania, sprawdzić, czy wystarcza; potem kolejka R4 pkt 2 (lifting: wspólna nawigacja, strona „Narzędzia”). **Następne realizacja:** akt 10 — etykieta „YOUR BRAND” też w kolorze odwiedzającego (jak na `/nawyko`); szlif ruchu całej trasy; rozmiar JS trasy (importuje cały `NawykoClient` dla `Enquiry` — wydzielić `Enquiry` do osobnego pliku i zmierzyć); na 390 pasek cookies zasłania podpis pod telefonem w finale.

**R4 przebieg 4 (24.11 01:38–02:05):** zrobione R4 pkt 2 (część): wspólna nawigacja `SiteNav` (Consulting · Nawyko · Tools · Contact) na `/nawyko`, `/calculator`, `/lab/payback|reward|reminder`, `/work/genactiv` + nowa strona `/tools` (5 kart narzędzi, noindex, poza sitemap); stopki linkują do `/tools`. Realizacja: `Enquiry` wydzielone do `app/nawyko/Enquiry.tsx` (JS trasy 158,9 → 145,5 KB), etykieta „Your brand” w kolorze odwiedzającego (kontrast 4,69–19,56:1), stała rezerwa pod pasek cookies, ekrany telefonu przenikają się zamiast gasnąć razem. Bramki: build, tsc, lint 0/1, copy-voice, qa.js PASS (/tools, /nawyko, /calculator, /work/genactiv), content-rules PASS, WebKit 390+1440 PASS na /tools, /nawyko, /work/genactiv. **Następne:** `/tool` jest ślepym zaułkiem (brak linku do `/tools` — źródło to `tool-index.html` innego zadania cyklicznego, decyzja niżej); kotwice `/nawyko#enquiry` 390 do ≤ 0,05; (i) „czego nie robi” jako scena; na `/` wjazd do Nawyko w granicach ship-design; realizacja: szlif ruchu, przenikanie sprawdzić na nagraniu.

**R4 przebieg 5 (24.11 02:38–03:35):** zrobione (i) „What it never does” jako scena (panel marki z trzema przełącznikami, które wracają na „off” z wyjaśnieniem; telefon ze stałą listą nagród) i kotwica `/nawyko#enquiry` 0,17–0,20 → 0 (390) i 0,106 → 0 (1440) — przyczyną była podmiana kroju Instrument Sans (`swap`), nie hydratacja; teraz `font-display:optional` + `preload` (latin i latin-ext) tylko na `/nawyko` (spec 15). Realizacja: w Safari poświata była prostokątem, a pudełko ucięte (`clip-path` z ujemnym `inset` — WebKit tnie do ramki) → ramka `.ga-phone-clip`; ekrany telefonu wjeżdżają od dołu zamiast przenikać (koniec mieszanki dwóch tekstów). `webkit-check.py` ma tryb `WK_SCENE=1` — wcześniej w WebKit oglądał tylko układ statyczny `/work/genactiv` (WebDriver ⇒ `navigator.webdriver`). **Następne:** krój: `swap` + zapas z dopasowanymi metrykami zamiast `optional` (nauka niżej); `/work/genactiv#enquiry` 1440 CLS 0,097; na `/` wjazd do Nawyko w granicach ship-design; `/tools` i `/tool` czekają na decyzje.

**R4 przebieg 6 (24.11 03:38–04:30):** zrobione: `/` ma w nagłówku link „Nawyko reorder app” → `/nawyko` (dokładany przez `ship-design`, `data-ship-added="nawyko-link"`, nagłówek i H1 bez zmian; `content-rules` zasada 11 pilnuje, że jest); `/work/genactiv#enquiry` CLS 0 (stała rezerwa pod pasek cookies na stopce + zapas Montserrat z dopasowanymi metrykami); `webkit-check` w trybie sceny szukał na `/nawyko` złego elementu (`.nk-track` = suwak 30 dni) — poprawiony, od razu znalazł telefon 117 px w rozdziale „For you” na 390 → telefon maleje do 0,78 zamiast 0,6 (152 px). Krój `/nawyko`: `swap` + zapas sprawdzony i ODRZUCONY pomiarem (CLS kotwicy 0,06–0,33 przy wolnych fontach) — zostaje `optional`. **Następne:** po zgodzie pusta rezerwa 112–144 px na dole `/work/genactiv` (rezerwę trzymać tylko bez zgody — atrybut z inline-skryptu); obrys fokusu nowego linku nachodzi na kreskę nagłówka; `/` z dławionymi fontami CLS 1,0 (zrzut prerenderu odsłaniany po fontach — sprzed tej zmiany, do zbadania); `ship-design` domyślnie szuka `chromium-1194` (w chmurze trzeba `PW_CHROMIUM`); kolejka wiedzy pkt 4: schema `SoftwareApplication` dla Nawyko.

**R4 przebieg 7 (24.11 04:38–05:10):** zrobione (spec 17, 18): `/work/genactiv` — rezerwa 112–144 px pod pasek cookies tylko bez zapisanej zgody (po zgodzie telefon na 390 rośnie 433 → 460 px, stopka 144 → 32 px); wejście z `#enquiry` na 1440 miało CLS 0,17/0,10 (pomiar w p6 robiony pod `navigator.webdriver` = układ statyczny) → rezerwa sceny `data-ga-pin` + formularz za układem w obu trybach → 0 na 390/1024/1440, ze zgodą i bez. `/` z fontami opóźnionymi o 2,5 s: CLS 1,0 → 0,07 (390) / 0,04 (1440) — `#dc-root` parkowany w miejscu zrzutu w `DcBoot`. `/nawyko`: JSON-LD jako jeden graf (WebPage, SoftwareApplication z `featureList`, Person `#person` jak na `/`, FAQPage), każdy tekst widoczny — pilnuje nowy `scripts/jsonld-rules.test.mjs`. Nowa bramka `scripts/cls-check.mjs` (zawsze bez flagi webdriver). Bramki: build, tsc, lint 0/1, copy-voice, content-rules, ship-compare, qa.js (/, /nawyko, /work/genactiv) PASS, WebKit 390+1440 (statycznie i scena) PASS na /, /nawyko, /work/genactiv; dwie niezależne recenzje (poprawki wdrożone: `min-height` zamiast `clip`, WebPage.name = H1, test sprawdza też name i system). **Następne:** zostałe 0,07 na `/` przy fontach > 1,5 s (zrzut odsłaniany krojem zapasowym — rozważyć dłuższy limit tylko przy wolnym łączu albo zapas z dopasowanymi metrykami w zrzucie); obrys fokusu linku Nawyko na `/`; `ship-design` szuka `chromium-1194`; kolejka wiedzy pkt 6 (INP scen przewijania).

**R4 przebieg 8 (24.11 05:38–06:05):** spec 19. `/nawyko`: zmienne `--sw`/`--p` ustawiane przy każdym kroku przewijania na korzeniu sceny przeliczały styl całego poddrzewa (telefon z `container-type:size`) — przeniesione na elementy, które ich używają, + `@property … inherits:false` (web.dev „Benchmarking the performance of CSS @property”). CPU 4×: 1440 klatki > 50 ms 14 → 0 (najdłuższa 131 → 0 ms, najdłuższa interakcja 136 → 32 ms), 390 3 → 1. Nowe `scripts/scroll-perf.mjs` (LoAF + Event Timing, wypisuje tryb sceny). Jeden WebSite z `@id` `#website` na każdej stronie + `isPartOf` na `/nawyko`; `jsonld-rules` pilnuje jednego WebSite. `/work/genactiv`: pomiar (1–2 klatki > 50 ms, 0 > 100 ms, interakcje 16 ms) i seria klatek co 4% — bez usterek wartych poprawki, bez zmian w kodzie. `/`: obrys fokusu linków „Nawyko reorder app” / „Check your own gap” obejmował 14 px paddingu i na 320–768 przecinał drugi link → przy `:focus-visible` padding i margin schodzą do 0 (układ bez zmian), test `scripts/focus-ring.test.mjs` (stary build FAIL, nowy OK). `scripts/chromium-exe.cjs`: bramki, prerender i `ship-compare` same biorą najnowszy Chromium z `/opt/pw-browsers` (dotąd na sztywno 1194, w chmurze jest 1243 → bez `PW_CHROMIUM` padały). **Następne:** zostałe 0,07 na `/` przy fontach > 1,5 s; `scroll-perf` na `/work/genactiv` i `/` jako stała bramka; kolejka wiedzy pkt 7 (rozdziały i CTA w długich scenach Apple).

**R4 przebieg 9 (24.11 06:38–06:58):** spec 20. `/nawyko`: `ChapterBar` (`app/nawyko/ChapterBar.tsx`, reguły `.nk .cb*`) — za pierwszym ekranem wraca przy przewijaniu w górę, chowa się w dół, przy formularzu i (< 1100 px) w przypiętej scenie; bieżący rozdział, lista 7 rozdziałów (< 1100) albo linki (≥ 1100), CTA „Ask about Nawyko”; `inert` gdy ukryty, ustępuje fokusowi (2.4.11), Escape. Recenzja 25: 0 blokujących, 3 ważne — wszystkie poprawione (kolejność Tab, pasek zasłaniał nazwę marki na telefonie w scenie 390, `setState` w każdej klatce). Strumień B: `scripts/gates.sh` (budujący w worktree) — wszystkie bramki jednym poleceniem z tabelą PASS/FAIL; wpisany do CLAUDE.md. `/work/genactiv` bez zmian w tym przebiegu (nic nie zmienione w jej plikach; poprzedni pomiar bez usterek). **Następne:** pasek na `/work/genactiv` (akty jako rozdziały) albo przegląd nagłówków scen pod zasadę 8; `scroll-perf` 390 na `/nawyko` ma 1 klatkę 76–86 ms (próg 100) — obserwować; `gates.sh` uruchomić na `/` i `/work/genactiv`.

**R4 przebieg 10 (24.11 07:38–08:20):** spec 21. Strumień A `/nawyko` (`ChapterBar`): D1 w przypiętej scenie na ≥ 1100 px tylko bieżący rozdział + CTA (bez rzędu 7 linków), D2 etykieta „How it works · 04 Reward” z aktu sceny (tylko gdy scena przypięta — recenzja 26 I2), D4 fokus na sekcji po skoku (bez obrysu dla myszy), D5 numer bieżącego rozdziału `--red-s` (4,70 → 7,45:1); na < 1100 px etykieta skraca się wielokropkiem, CTA zostaje w pierwszym rzędzie. Strumień B `/work/genactiv`: `ActBar.tsx` — 8 rozdziałów (The problem · How it works · Cashback · Points and levels · Data and consent · How it was built · Results · Your brand colour) + „Ask about a brand app” → `#enquiry` (fokus na formularz); ukryty na akcie 0, przy formularzu i w scenie < 1100 px (wymuszony na 390 zasłaniał nagłówek aktu — `r4p10-b-390-forced-act4.png`); skoki 8/8 trafiają w akt (recenzja 26). JS trasy łącznie +0,7% (sam chunk trasy +15%). `scroll-margin-bottom` na ostatnich linkach (focus-obscured na 1440 padał już przed zmianą). `gates.sh`: odmowa, gdy serwer nie podaje BUILD_ID z `.next` (R17). Bramki `gates.sh /nawyko /work/genactiv`: 21/21 PASS po ponownym starcie serwera (scroll-perf `/nawyko` 1440 tuż po starcie 103 ms, powtórki 59–67 ms). **Następne:** wersja paska dla telefonu na `/work/genactiv` (decyzja R4p10-A), `/nawyko` scroll-perf 1440 ma znów 2–4 klatki > 50 ms (p8: 0) — sprawdzić, czy to MutationObserver z D2.

**R4 przebieg 11 (24.11 08:38–09:20):** spec 22. Strumień A `/nawyko`: hipoteza „MutationObserver D2 psuje płynność” OBALONA pomiarem (z obserwatorem mediana 2 klatki > 50 ms, bez — 4; długie klatki = render Reacta i zdarzenia przejść CSS przy zmianie aktu sceny, `agencja/specs/22-a-pomiary.md`); gałka dnia na osi 30 dni jedzie `transform` zamiast `left` (CLS kółkiem 390 0,0005 → 0,0001); nagłówek FAQ „FAQ: six answers you need before the first call.” (zasada 8, czytelnik-kupujący); tabela pozostałych nagłówków + werdykty czytelnika `agencja/specs/22-a3-naglowki.md`. Strumień B `/work/genactiv`: `ActBar` przed sceną w DOM (M2), `key` na tekstach zmieniających się w miejscu (CLS kółkiem 1440 0,0008 → 0, 390 0,0034 → 0), pasek ponownie liczy widoczność po zmianie aktu; recenzja 27 W1 (pasek osiągalny Tabem na górze po przewinięciu fokusem, 2/5) → pasek nigdy w pierwszej połowie pierwszego ekranu (powtórka 10/10 × 390 i 1440 OK). `/` zmierzone `gates.sh` pierwszy raz: 2 FAIL (niżej). Bramki po scaleniu, Lead sam na maszynie: `gates.sh /nawyko /work/genactiv` 21/21 PASS (`/nawyko` scroll-perf 1440 51–62 ms, 390 62–76 ms; `/work/genactiv` 0–53 ms); build · tsc · lint 0/1.

**R4 przebieg 12 (24.11 09:38–10:25):** spec 23. Strumień B: `gates.sh` ma bramki `clsscroll-390/1440` (PASS ≤ 0,001, INFO do 0,01, FAIL powyżej; sprawdzone na celowo zepsutej stronie: FAIL 1,49/0,84), `scripts/genactiv-focus-check.mjs` — fokus po skoku z paska `/work/genactiv` trafia w akt z nazwą = nagłówek 8/8 (1440 scena, 390 reduced-motion); kod strony bez zmian. Strumień A `/nawyko`: `key` na trzech tekstach w telefonie (licznik serii, „to go”, „✓ earned”); zmiana listy kroków (`key` na całej liście) WYCOFANA — recenzja 28 pokazała, że CLS 0 był złudzeniem miary (kroki skakały 23–54 px w jednej klatce, a nowe węzły nie liczą się do CLS); trzy nagłówki R4p11-B WYCOFANE — czytelnik-kupujący odrzucił wszystkie trzy (decyzja R4p12-A). A3: hipoteza „render ekranów telefonu przy zmianie aktu” obalona pomiarem (długa klatka jest przed sceną, React 6–15 ms) — bez kodu. Bramki po scaleniu, Lead sam: build · tsc · lint 0/1; `gates.sh /nawyko /work/genactiv` 24/25 PASS + INFO `/nawyko clsscroll-1440` 0,0034; `scroll-perf-390 /nawyko` FAIL 132 ms — przeplatany pomiar A/B ze starym buildem (stary 119–181, nowy 80–144 ms) = szum maszyny, nie regresja.

**R4 przebieg 13 (24.11 10:38–11:35):** spec 24. Strumień B: `scripts/scroll-perf.mjs` — rozgrzewka + `--runs 3`, werdykt z mediany (źródło: Lighthouse „Score variability”), `gates.sh` czyta linię `SCROLLPERF`; `scripts/clsscroll-selftest.sh` i `scripts/scrollperf-selftest.sh` (zepsuta strona FAIL, spokojna PASS); pierwszy `gates.sh` na `/calculator /tools /lab/reward /lab/payback /lab/reminder` → po poprawce `.rw-live` (niewidoczny region `aria-live` rozpychał dokument do 404 px na 390) wszystko PASS (`agencja/specs/24-b-trasy.md`). Strumień A: stała wysokość wierszy kroków (opis we wspólnym slocie) dała CLS 0 i 0 px przesunięć, ale recenzja 29 I1/I2 — opis odklejony od kroku i linki wypadające ze sceny na 1280×720 → wycofane z kodu (`24-a-pomiary.md`). Bramki po scaleniu, Lead sam: build · tsc · lint 0/1; `gates.sh /nawyko /work/genactiv` PASS (clsscroll-1440 `/nawyko` INFO 0,0037 jak przed przebiegiem).

**R4 przebieg 14 (24.11 11:38–12:35):** spec 25. Strumień A: `scripts/short-viewport-check.mjs` (przewija scenę co 2 %, w dół i w górę, sprawdza każdy tekst/przycisk/link: ucięcie przez okno lub scenę, nachodzenie na paski fixed/sticky, `elementFromPoint`) — przed: `/nawyko` FAIL na 1100×620 ±cookies i 1280×720 ±cookies (krok 04 ucięty 19–41 px, „Ask how…” 55 px, „No pointer?…” 99 px), `/work/genactiv` PASS; po: blok `@media (min-width:861px) and (max-height:860px)` w `nawyko.css` — odstępy, nagłówek i telefon liczone z wysokości dostępnej (okno − pasek cookies), liniowo, równe wartościom desktopowym przy 860 px (recenzja 30 W1: pierwsza wersja skakała na progu o 61 px → poprawione, pomiar 861→860: 348→348 px, 60→60 px) → PASS na 7 widokach (1100×620 ±c, 1280×720 ±c, 1366×768, 1440×860+c, 1440×900). Strumień B: `/calculator` „+1 order”, „1 customer”, „1 reorder” (test `scripts/calculator-rules.test.mjs`: stary build FAIL 8, nowy PASS), obrys fokusu suwaka wewnątrz pola (nie przecina „Target gap” ani „Drag to close the gap”), suwak w WebKit: przeciąganie i strzałki zmieniają wynik (`scripts/webkit-slider-check.py`); `gates.sh`: `GATES_LOGDIR`, parsowanie w `scripts/gates-lib.sh` wspólne z selftestami (porty 3197/3198), brak WebKit = wiersz FAIL z poleceniem instalacji. Bramki po scaleniu, Lead sam: build · tsc · lint 0/1 · `gates.sh /nawyko /work/genactiv /calculator` 36/36 PASS (+ INFO `/nawyko clsscroll-1440` 0,0033 jak przed) · po poprawce W1 `gates.sh /nawyko` PASS poza `scroll-perf-390` 115 ms [115,68,136] — ponowny pomiar tym samym buildem 67 ms [91,67,51] PASS (szum maszyny; zmiana CSS działa tylko od 861 px szerokości, na 390 nieaktywna) · `short-viewport-check` 7/7 · `calculator-rules` PASS; recenzja 30: 0 blokujących, 1 ważne (poprawione), 4 drobne (niżej w „Następne”).

**R4 przebieg 15 (24.11 12:38–13:50):** spec 26. Strumień A `/nawyko`: telefon w scenie liczony z wysokości dostępnej (okno − pasek cookies), tryb zwarty także przez zapytanie kontenera sceny; 390×844 z paskiem: link „Ask how…” ucięty 21 px → 0; 360×740 z paskiem 7 elementów do 69 px → 0; Tab na krok 01–04 przewija scenę do tego kroku (`onFocus` tylko przy `:focus-visible`, `auto` przy reduced-motion; `scripts/nawyko-step-focus-check.mjs` stary FAIL, nowy PASS na 1440×900 i 1100×620); etykiety na 1100×620 w jednym wierszu (odstęp liter liniowo z szerokością). Recenzja 31 B1: zapytanie kontenera 720 px mierzyło WNĘTRZE sceny (−36 px paddingu) → tryb zwarty chował treść na 360×740 bez paska; Lead: próg 684 px + telefon malejący liniowo 0,3 px/px poniżej 790 px dostępnej wysokości (390×721–755 link ucięty 4 px → 0). Potem `gates.sh` dał `scroll-perf-390` FAIL 134 ms; przeplatany A/B ze starym buildem (4 pary): z zapytaniem kontenera 79/121/71/129 ms, stary 80/72/67/64 → zapytanie kontenera (`container: size` na przypiętej scenie) WYCOFANE; bez niego 89/85 ms. Wynik końcowy: 390×844 ±c, 360×740, 375×667+c, 390×721/740, 1100×620+c, 1280×720+c, 1440×900 PASS; 360×740+c — link dotyka 2-px paska postępu (było: 7 elementów ucięte do 69 px). Telefon 390×844 bez paska 422 px jak przed. Strumień B: `gates.sh` wiersze `short-1100c/1280c/390c` (SKIP bez sceny, ale na `/nawyko` i `/work/genactiv` FAIL — recenzja 31 W1), `scripts/shortvp-selftest.sh` PASS; `/calculator` suwak `padding:0 6px` — obrys w całości widoczny przy Home/End (390, 1440, `scripts/slider-focus-check.mjs`); brak obrysu w WebKit 390 był błędem testu (okno Xvfb poza kursorem → brak fokusu dokumentu), `webkit-slider-check.py` poprawiony. Lead: `gates.sh` odmawiał na DOBRYM serwerze, gdy BUILD_ID zaczyna się od „-” (grep brał go za opcję) → `grep -qF --`.

**R4 — DRUGI STRUMIEŃ, RÓWNORZĘDNY (Rafał 23.11 21:00): realizacja GENACTIV na `/work/genactiv` — spec `agencja/specs/realizacja-genactiv.md`.**
„Nasza największa wizytówka, ma rozwalić mózgi.” Każdy przebieg: dwóch budujących w osobnych worktree (strumień `/nawyko` z kolejki niżej
i strumień realizacji), jeden push. Wyjątek od zasady „bez prawdziwych marek” obejmuje tylko tę trasę i ma granice opisane w specu.

**Słowa Rafała:** „cały czas brakuje mi ostatnich zmian, Nawyko miało mieć dużo więcej, reszta też do liftingu; strona ma być
osobną agencją cały czas poprawianą; chcę jak najwięcej zrobić w najbliższych godzinach”.
**Diagnoza doradcy:** w ostatnich przebiegach powstawały narzędzia w `/lab`, a `/nawyko` nadal pokazuje aplikację sprzed tygodnia.
Od tego czasu aplikacja dostała całą warstwę lojalności i prywatności, której na stronie nie ma. Narzędzia `/lab` wstrzymane,
dopóki `/nawyko` nie pokaże całej aplikacji. Priorytet jest jeden: **`/nawyko` jako pełna strona produktu dla marki FMCG**.

### Kolejka R4 (w tej kolejności; jedna myśl = jedna scena, w której produkt coś robi; ≤ 12 słów + jedno zdanie)
1. **Nowe sceny `/nawyko` (telefon zostaje nicią strony):**
   (a) cashback, który rośnie z każdym zamówieniem: portfel w telefonie po 1., 2., 3. zakupie, wydawany w aplikacji na następne
       zamówienie albo odejmowany od dostawy subskrypcji (liczby z podpisem „przykład”, bez stawek żadnej prawdziwej marki);
   (b) punkty za codzienny rytuał i poziomy-medale, które nigdy nie spadają;
   (c) wymiana punktów na cashback, a obok telefonu **panel marki**: marka sama ustawia przelicznik i progi; przesuń suwak →
       telefon pokazuje nowy próg (to jest sprzedażowy moment: „Ty sterujesz kosztem programu”);
   (d) ścieżki wiedzy z prezentem na mecie: produkt uzupełniający dołączony do następnego zamówienia (sprzedaż krzyżowa bez reklamy);
   (e) zakup w aptece też się liczy: skan kodu z pudełka (marka widzi klientów offline);
   (f) prywatność od projektu: bez zgody na dane o zdrowiu funkcje są widoczne z przyciskiem „włącz i odblokuj”, dane o zdrowiu
       nigdy nie trafiają do marketingu (to scena dla działu prawnego kupującego);
   (g) dowód wyników: marka mierzy przyrost względem grupy kontrolnej, nie „wierzy na słowo”; rytm zużycia z wielu telefonów
       składa się w wykres „kiedy opakowanie naprawdę się kończy” (przykład);
   (h) integracje jednym pasem: Shopify, aplikacje subskrypcji i lojalności, e-mail/CRM, aplikacja w App Store i Google Play pod
       nazwą marki; white label = jedno przeciągnięcie przemalowuje stronę;
   (i) czego nie robi: nagrody nigdy losowe, zero twierdzeń zdrowotnych, zero reklam i śledzenia — trzy zdania w jednej scenie;
   (j) FAQ kupującego (6 pytań, zwijane): czy klienci będą odhaczać; RODO; ile kosztuje nagroda i kto ustala; ile trwa wdrożenie;
       czy działa z apteką; co jeśli klient nie da zgody;
   (k) finał: „Zobacz to z Twoją marką” — formularz + przemalowanie na logo/kolor odwiedzającego na żywo.
2. **Lifting całości:** wspólna nawigacja na każdej trasie (Konsulting · Nawyko · Narzędzia · Kontakt); strona „Narzędzia”
   zbierająca `/tool` i narzędzia z `/lab` w jednym miejscu; zero ślepych zaułków; na `/` widoczny wjazd do Nawyko nad zgięciem
   w granicach mechanizmu ship-design (nagłówka `/` nie ruszasz — decyzja Rafała).
3. Dopiero potem wracasz do kolejki R3 i narzędzi.

### Tryb pracy R4
- Każdy przebieg kończy się podglądem do obejrzenia: pierwsza linia „Dla Rafała” = **sprawdzony link podglądu** + 1 zdanie, co
  nowego obejrzeć (która scena). Jeden push na przebieg.
- Recenzja jak dotąd: test 10 sekund na 390 i 1440, nagranie przewijania, bramka tekstów, kontrast w obu motywach.
- Repo jest PUBLICZNE: bez danych i stawek GENACTIV, bez nazwy GENACTIV w części o aplikacji; marka pokazowa zmyślona.

## RUNDA 3 — START (Rafał 23.11.2026 12:43): „kolejna tura poprawek strony — każdej z 3. Udowodnij, że się uczysz”. CZYTAJ PIERWSZE.
Zakres: kolejka z 22.11 18:20 niżej (punkty 1–5) — startuje TERAZ, w jej kolejności (najpierw recenzja dyrektora kreatywnego).
Do tego doradca przenosi lekcje z całej agencji (aplikacja, kokpit, wczorajsze uwagi Rafała). Każda ma być zastosowana i SPRAWDZONA:

1. **Test 10 sekund na każdym ekranie** (lekcja z aplikacji 22.11: Rafał znalazł 14 braków, których recenzenci nie złapali, bo
   oceniali kawałki, a nie całą drogę). Niezależny recenzent przechodzi każdą z 3 stron od zera jak właściciel marki FMCG, na
   telefonie 390×844 i desktopie 1440, w realnym tempie przewijania; przy każdej scenie: czy w 10 s wiem, co to jest, co z tego ma
   moja marka i co kliknąć. Każdy „nie” = poprawka przed commitem.
2. **Nagłówek = wniosek, nie etykieta** (lekcja z kokpitu 23.11, 5 pętli przeglądu): każdy nagłówek sceny/sekcji mówi korzyść
   marki („so what”). Tnij co najmniej 30% słów w treści każdej strony bez utraty faktów; zmierz liczbę słów przed i po.
3. **Najpierw odpowiedź, potem założenia** (piramida): kalkulator pokazuje wynik u góry, dużą liczbą, a założenia pod nim.
4. **Każda akcja kończy się czymś odczuwalnym i następnym krokiem** (lekcja z aplikacji): zdrapka na `/nawyko` ma moment sukcesu
   i jasne „co dalej” dla marki; żadna scena nie kończy się pustką; na końcu każdej strony jedno wyraźne CTA.
5. **Kontrast w obu motywach i na każdym tle** (lekcja z kokpitu 23.11: czarna chmurka na czarnym tle). Sprawdź jasny i ciemny,
   każdy tekst ≥ 4,5:1, liczby z narzędzia, nie na oko.
6. **Bramka tekstów** (`agencja/rubryka-tekstow.md`, od 22.11): automat, czytelnik-kupujący, wpis do `teksty-do-akceptacji.md`.
   Bohaterem jest marka klienta, nigdy autor strony; zero „Your name on it, not mine”-podobnych zdań.
7. **Link do podglądu podany i SPRAWDZONY** (lekcja doradcy 23.11: Rafał chce bezpośrednich linków, a wczorajszego linku nie dało
   się zweryfikować): adres podglądu Vercel z `gh api deployments` + `curl -sI` z kodem 200 (albo 401 = ochrona Vercel; wtedy napisz to).
8. **Jeden push na przebieg** (Twoja lekcja: limit buildów Vercel).

**Dowód nauki — wymagany w „Dla Rafała” po tej rundzie:** sekcja „Czego się nauczyliśmy i co zastosowaliśmy”: każda z lekcji 1–8
→ co konkretnie zmieniła na stronie (plik/scena) → jak sprawdzone (liczba, zrzut, wynik testu). Plus liczba słów przed/po na każdej
stronie i lista znalezisk testu 10 sekund (ile było, ile naprawionych). Bez tej sekcji runda nie jest skończona.

## PRIORYTET od Rafała (22.11.2026 09:07, po obejrzeniu strony lokalnie; przekazuje doradca) — przeczytaj przed kolejką

**Słowa Rafała:** `/nawyko` „jest dobrze, ale tylko do początku części *Known in advance. Never random.* Od tej części jest
nudno, statycznie i nikt tego nigdy nie przeczyta”. Kalkulator: „nieczytelne, zajebiście przegadane, bez efektów; kierunek
na samej górze fajny, bo coś się animuje, ale nic z tego nie wynika”, „robiony na kolanie”. Rafał **nie upiera się przy
obecnym układzie strony** i prosi o bardzo krytyczne podejście do całości oraz o stały rozwój kolejnych narzędzi w ramach USP.

**Ocena doradcy (obejrzane zrzuty całych stron) — wiążąca jako kierunek, do podważenia dowodem, nie opinią:**
- Tożsamość (papier, typografia, czerń + jedna czerwień) jest dobra i zostaje: wyróżnia i nie jest kiczem. **Zły jest format,
  nie styl:** wszystko poniżej sceny z telefonem to „nagłówek po lewej + numerowana lista po prawej” — dokument, nie pokaz.
- Zasada dla całej strony od teraz: **jedna myśl = jedna scena, w której produkt coś robi.** Najwyżej ok. 12 słów na scenę
  plus jedno zdanie pod spodem. Każdy akapit, którego nie da się pokazać, wylatuje albo idzie do zwijanego „szczegóły”.

**Stan po przebiegu 3 (22.11):** punkt 1 i punkt 2 zbudowane w pierwszej wersji i po recenzjach (szczegóły w „Dla Rafała”);
następny jest punkt 3 (przegląd układu całej strony, `/lab/a` i `/lab/b`), potem punkt 4.

### Kolejka (zastępuje poprzednią; w tej kolejności)
1. **`/nawyko` od „Known in advance” w dół — przebudowa na sceny, nie poprawki.** Telefon zostaje nicią całej strony
   (nie znika po czwartym kroku). Propozycja scen: (a) nagrody = oś 30 dni, po której jedzie znacznik; nagrody odpalają się
   w swoich dniach, odwiedzający może przeciągnąć dzień; (b) „co dostaje marka” = widok marki: z wielu telefonów składa się
   wykres „którego dnia opakowanie naprawdę się kończy” (to jest sprzedażowy moment — dane o rytmie), bez zmyślonych liczb
   jako faktów, z podpisem „przykład”; (c) white label = jedno przeciągnięcie przemalowuje całą stronę, nie tylko telefon;
   (d) „czego nie robi” = trzy krótkie zdania w jednej scenie, nie kolumny; (e) formularz jako finał sceny, nie osobny blok.
   Do tego wzmocnienie górnej części według punktów „spektakl / moment nagrody” (wejście telefonu z głębi, paralaksa warstw,
   pieczątka z fizyką, zdrapka z fakturą). Recenzent ocenia na NAGRANIU przewijania 390 i 1440; nagrania do `agencja/podglad/`.
2. **Kalkulator — zbudować od nowa, obecnego nie poprawiać.** Diagnoza: dwa kalkulatory, dziewięć pól, sekcja założeń,
   sekcja źródeł, dwa odsyłacze i formularz = raport; animacja u góry nie prowadzi do wniosku; pokrywa się tematem z `/tool`.
   Nowy kształt: **jedno pytanie, jeden ekran, trzy pola** (klienci, wartość zamówienia, dni między zamówieniami), jeden
   suwak, jedna duża liczba, która żyje podczas przeciągania, i wizualizacja roku jednego klienta, z której liczba wynika
   wprost (dni puste znikają → zamówień przybywa). Wynik kończy się jednym krokiem: „wyślij mi ten wynik / porozmawiajmy
   o tych liczbach”. Założenia i źródła: jedna zwijana linia. Drugi scenariusz (drugi zakup) usuń albo zrób z niego
   osobne małe narzędzie później. Relacja z `/tool`: kalkulator = 30 sekund bez danych, `/tool` = dokładny pomiar z eksportu;
   kalkulator na końcu prowadzi do `/tool`. Zanim zbudujesz: krótka specyfikacja + uczciwa odpowiedź, czy to narzędzie w ogóle
   jest potrzebne obok `/tool` (jeśli nie — zaproponuj w „Czeka na Rafała” lepsze pierwsze narzędzie i zbuduj je zamiast).
3. **Krytyczny przegląd układu CAŁEJ strony (wynik: propozycja dla Rafała, nie zmiana produkcji).** Dziś: `/` sprzedaje
   konsulting, a Nawyko, narzędzia i CV wiszą obok bez nawigacji. Zaproponuj strukturę, w której odwiedzający w 5 sekund
   widzi trzy rzeczy: konsulting FMCG, aplikacja Nawyko (główny wyróżnik), narzędzia. Zbuduj **dwa działające warianty
   pierwszego ekranu + nawigacji** jako osobne trasy podglądowe (np. `/lab/a`, `/lab/b`, `noindex`): A = ewolucja obecnego
   stylu, B = odważniejszy, produktowy (aplikacja na pierwszym planie). Rafał wybiera na żywo; nagłówka `/` nie ruszasz.
4. **Stały rozwój narzędzi (decyzja Rafała: na stałe).** Prowadź `agencja/narzedzia.md`: lista pomysłów narzędzi w ramach USP
   (FMCG, powtarzalny zakup), każdy z jednym zdaniem „co odwiedzający wie po 30 sekundach” i „do czego prowadzi”.
   Zasada każdego narzędzia: jeden ekran, jedno pytanie, wynik żywy, zero przegadania, liczby tylko z pól odwiedzającego
   albo ze źródła. Propozycje doradcy na start (do oceny, nie do ślepego wykonania): ile może kosztować nagroda lojalnościowa,
   żeby się spinała; kiedy wysłać przypomnienie o kolejnym opakowaniu; subskrypcja czy zakup jednorazowy — próg opłacalności.
   Po punktach 1–3: jedno nowe narzędzie na cykl kilku przebiegów, w pętli z recenzją.
5. Granice bez zmian: 60 kl./s na telefonie (zmierz), CLS ~0, `prefers-reduced-motion`, zero prawdziwych marek, zero kiczu,
   zero nowych ciężkich bibliotek bez sprawdzenia. **Vercel:** limit wdrożeń konta do ok. 19:10 22.11 — jeden push na przebieg,
   na końcu; adres podglądu wpisz na górze „Dla Rafała”, gdy się zbuduje. W „Dla Rafała” pisz krótko: co obejrzeć i gdzie.

## PRIORYTET od Rafała (22.11.2026 10:55–10:56, po przeklikaniu nowej wersji lokalnie; przekazuje doradca) — NAJNOWSZY, czytaj pierwszy

**Słowa Rafała:** „Nawyko na teraz jest dobre, ale nie jestem pewien, czy rozumiem, co ja proponuję. Dlaczego nie ma obowiązku
zdrapania, tylko można to przeskoczyć scrollem? Imo to byłby efekt (jeżeli nie z obowiązkiem, to przynajmniej minimum sama
animacja bez usera), bo teraz to główny punkt i tego nie widać. Do podkręcenia o jeden poziom czytelności i efekt wow, ale
kierunek dobry. Myślę, czy telefon nie powinien od rozdziału do rozdziału przechodzić z prawej do lewej strony ekranu, żeby
czytelniej odróżnić poszczególne kategorie podstrony.” · „I kalkulator niby też jest dla was OK?” (czyli: nie jest) ·
„Strona główna też ma przejść podobny lifting, ma być z efektem wow.”

### 1. `/nawyko` (kierunek zostaje, trzy poprawki)
a) **Zdrapka nie może dać się przegapić.** Sprawdzone przez doradcę w przeglądarce: przewinięcie o 1500 px mija zdrapkę bez
   śladu. Rozwiązanie (bez blokowania przewijania — to psuje dostępność i irytuje): gdy akt zdrapki wchodzi w kadr, scena
   zatrzymuje się na chwilę przypięcia dłuższego niż inne akty, a karta **zdrapuje się sama** widoczną animacją (ślad palca,
   opadające drobiny, licznik 8 → 9), jeśli odwiedzający nie zrobi tego sam w ok. 1,5 s; własne zdrapanie zawsze ma pierwszeństwo.
   Kto przewija szybko, i tak widzi odsłoniętą kartę i skok licznika. To ma być najmocniejszy moment strony.
b) **„Co ja proponuję” w 5 sekund.** Dziś strona pokazuje mechanikę, ale nie mówi wprost, co marka kupuje. Na pierwszym
   ekranie i przy formularzu jedno zdanie oferty w stylu: aplikacja pod Twoją marką dla klientów, którzy kupują ponownie —
   zbudowana i prowadzona dla Ciebie; Ty dostajesz powód do kolejnego zamówienia i prawdziwy rytm zużycia. Czego NIE
   dopisuj bez Rafała: ceny, statusu „pilot/gotowe”, terminów (to jego decyzje — zostają w „Czeka na Rafała”). Każdy rozdział
   dostaje wyraźną etykietę „dla Twojego klienta” / „dla Ciebie” / „pod Twoją marką”, żeby było jasne, do kogo mówi scena.
c) **Telefon zmienia stronę ekranu między ROZDZIAŁAMI** (nie między aktami — co akt byłoby męczące): jak to działa → telefon
   po prawej; dla marki → przejeżdża na lewo; pod Twoją marką → wraca. Sam przejazd ma być efektem (płynny, z lekką rotacją
   i cieniem), a tło rozdziału lekko się różni. Na telefonie (390) zamiast stron: zmiana pozycji góra/dół albo skali.
d) Jeden poziom czytelności i „wow” więcej: większy telefon, mocniejsze wejście, wyraźniejszy stan „teraz dzieje się to”.
   Nagrania przewijania (Playwright video, 390 i 1440) do `agencja/podglad/` są OBOWIĄZKOWE — w przebiegu 3 ich zabrakło.

### 2. Kalkulator — wersja 2 nadal nie jest dobra (ocena doradcy po przeklikaniu)
- **Nie odpowiada na własne pytanie.** Nagłówek pyta „ile jest wart jeden dzień między zamówieniami”, a wielka liczba pokazuje
  coś innego (łączny przyrost przy suwaku). Bohaterem ma być **wartość jednego dnia** — jedna, solidna liczba.
- **Liczba bez waluty i bez kontekstu** („+1,845,977” czego?). Dodaj wybór waluty albo słowo „w Twojej walucie” przy liczbie.
- **Suwak pozwala na absurd** (58 → 29 dni daje dwukrotność przychodu) — to podważa wiarygodność. Zakres ogranicz do realnego
  (np. do dnia, w którym kończy się opakowanie — wróć do pola „na ile dni starcza opakowanie”; to jest sedno: klient ma
  produkt 30 dni, a zamawia po 58, więc 28 dni półka jest pusta).
- **Rysunek roku jest mały i nieczytelny** — ma być główną sceną: widać dni z produktem i dni pustej półki; przeciągasz
  i puste dni znikają. Z tego ma WPROST wynikać liczba.
- **„Nic z tego nie wynika”:** po wyniku musi paść jedno zdanie „co z tym zrobić” i jeden krok — puste dni zamyka się
  przypomnieniem we właściwym dniu, subskrypcją albo aplikacją nawyku (link do `/nawyko`), bez obiecywania efektu liczbą.
- Błędy: tekst dla czytników ekranu pokazuje stare liczby po przesunięciu suwaka; ramka fokusu suwaka nachodzi na podpisy.
- Zanim zbudujesz v3: makieta jednego ekranu i recenzja czytelnika-kupującego NA MAKIECIE („co zrozumiałeś w 10 sekund?”).

### 3. Strona główna `/` — lifting z efektem wow (nowe, decyzja Rafała)
Rafał nie upiera się przy obecnym układzie. `/` jest dziś eksportem Claude Design (mechanizm `ship-design`) — NIE ruszaj go
ani produkcji. Zbuduj nową stronę główną jako trasę podglądową pisaną ręcznie (`/lab/home`, `noindex`), w tym samym języku
scen co `/nawyko`: w 5 sekund widać trzy rzeczy — konsulting FMCG, aplikacja Nawyko (główny wyróżnik), narzędzia — każda
jako scena, w której coś się dzieje, z nawigacją do `/nawyko`, `/calculator`, `/tool`. Treść, cena, dowody i nagłówek
„You don't pay twice for the same customer.” — z obecnej strony (twarde zasady treści z `content-rules` obowiązują; nazwy
klientów i liczby tylko te dozwolone). Dwa warianty pierwszego ekranu, jeśli starczy czasu. Zamiana `/` na nową wersję to
osobna decyzja Rafała po obejrzeniu — wpisz ją do „Czeka na Rafała” razem z tym, co oznacza dla mechanizmu Claude Design.

### Kolejność
1a (zdrapka) → 1b–1d → 3 (strona główna, pierwszy ekran) → 2 (kalkulator v3). Bramka tekstów (`agencja/rubryka-tekstow.md`)
obowiązuje przy każdym punkcie. Jeden push na przebieg.

## Uwaga Rafała 22.11 10:42 (doradca poprawił od ręki)
Nagłówek sceny white label „Your name on it, not mine.” Rafał ocenił jako „super głupie i egocentryczne”. Zmienione na
„Your brand. Your colours. Your app.” (`app/nawyko/NawykoClient.tsx`). **Zasada dla wszystkich tekstów strony:** bohaterem
jest marka klienta i jej klient, nigdy autor strony — żadnych „mine / my / I” w nagłówkach scen produktu. Przejrzyj pod tym
kątem całe `/nawyko` i `/calculator` w następnym przebiegu i uruchom bramki (ta zmiana poszła bez builda).

## KOLEJKA od Rafała (22.11.2026 18:20, po przeklikaniu podglądu) — RUSZA 23.11 12:43 jako runda 3 (sekcja na górze).

Słowa Rafała: „dobrze, teraz pracujemy nad tą częścią”. W tej kolejności:
1. **`/nawyko` — przewijanie za szybkie.** „Scrolle idą za szybko, nie widzę efektów, jak scrolluję w normalnym tempie. Zwolnić.”
   Wydłuż drogę przewijania każdego aktu (więcej wysokości na akt, dłuższe przypięcie), tak żeby przy zwykłym tempie kółka/gładzika
   każdy efekt zdążył się rozegrać i wybrzmieć; sprawdź na nagraniu w realnym tempie, nie w zwolnionym skrypcie.
2. **`/nawyko` — przejazd telefonu.** „Telefon zbyt [gwałtownie] zmienia miejsce, nie ma być takich kątów, bo to inna stylistyka.”
   Usuń rotację/pochylenie; przejazd ma być płaski, spokojny, prostoliniowy, w rytmie reszty strony (stylistyka: papier, typografia,
   precyzja — nie 3D).
3. **Strona główna `/lab/home`.** „Do połowy OK, później znów nudy — tam pracujecie dalej.” Druga połowa na sceny (jak górna).
   **Zakończenie obowiązkowe:** czerwone zdanie końcowe z obecnej strony produkcyjnej ZOSTAJE; na końcu strony przewijanie ma jeszcze raz
   odsłonić tekst „You don't pay twice for the same customer.” (efekt odsłonięcia jako finał).
4. **Kalkulator** — „na teraz niech zostanie”, ale ma być czytelniej, że suwakiem/pokrętłem można kręcić (wyraźna podpowiedź gestu,
   uchwyt, który wygląda na ruchomy, krótka animacja zachęty przy wejściu). v3 odłożona, nie budować teraz.
5. **Recenzja „wizjonera designu”** (prośba Rafała): osobny recenzent w roli dyrektora kreatywnego z czołowego studia produktowego —
   ocenia CAŁOŚĆ (`/nawyko`, `/lab/home`, kalkulator) pod kątem: spójność stylistyki, rytm i tempo ruchu, hierarchia, co jest
   naprawdę zapamiętywalne, co jest przeciętne; ma wskazać 3 rzeczy do wycięcia i 3 do wzmocnienia, z uzasadnieniem. Wynik w
   `agencja/recenzje/` i streszczenie w „Dla Rafała”. Najpierw recenzja, potem poprawki 1–4 z jej uwzględnieniem.
Odłożone do decyzji Rafała (NIE zlecać): prawdziwa aplikacja na stronie + podgląd we własnej marce klienta + deck (3 decyzje).

## Dla Rafała

**Runda 6', przebieg 1 (24.11 21:38–22:35) — sekcje „For you” są teraz jednym kokpitem, nic nie zniknęło.** Hero, „Four steps”, „Rewards in the app”, finał i formularz nietknięte. Po portfelu klienta stoi jeden kokpit w kolorze Twojej marki (pół-ciemny, inny niż portfel): zdanie-most „Now the same app from your side: what you set, what you see.” i 5 zakładek — Learning paths, Pharmacy purchases, Privacy, Proof of results, What it never does — każda to dotychczasowa sekcja 1:1 (te same nagłówki, telefony, suwaki). Linki `/nawyko#pharmacy`, `#proof` itd. otwierają właściwą zakładkę. Integracja: wybierasz silnik sklepu (Shopify gotowy; WooCommerce, Shoper, IdoSell, PrestaShop, Magento / Adobe Commerce, własny — przez adapter, tekstem, bez logo) i schemat sklep ↔ adapter ↔ aplikacja się zmienia. FAQ: pytania jako przyciski, odpowiedź jako wiadomość (pełna lista dalej w kodzie strony dla Google).
**Dowód:** `agencja/podglad/r6q1-lead-{loyalty,cockpit,cockpit-tab3,integrations,faq}-{390,1440}.png`, Safari: `r6q1-wk-*.png`; `gates.sh /nawyko` — wszystko PASS (qa.js, CLS, scroll-perf 78/81 ms, Safari 390/1440, inwentarz, jsonld, brand-propagation), clsscroll-1440 INFO 0,003. Recenzja `agencja/recenzje/43-r6q1-review.md` — 3 ważne uwagi poprawione przed wysyłką (patrz Lekcje R29). Podgląd: https://rafal-oleksiak-consulting-git-agencja-strona-zurychhhs-projects.vercel.app/nawyko
**Dlaczego biznesowo:** strona marki nie jest już sześcioma osobnymi przewinięciami — kupujący widzi „co dostaje klient”, a potem jednym miejscem „co dostajesz Ty”; integracja przestaje sugerować „tylko Shopify” (Shoper i IdoSell trafiają w polski rynek).
**Czego się nauczyliśmy:** bramka inwentarza sprawdzała tylko nagłówki — recenzent złapał 3 zgubione zdania w integracji; teraz bramka sprawdza też zdania i listy oraz dwie kolejne sekcje w tym samym tle.

## Dla Rafała (poprzednie, R6 p2)

**Runda 6, przebieg 2 (24.11 20:38–21:25) — na stronie nic się nie zmienia; Twoje cofnięcie z 20:55 obowiązuje.** Przebieg ruszył przed Twoją decyzją i zbudował resztę starej R6 (dowód na pełną szerokość, sekcja „Your store” z wyborem silnika: Shopify, WooCommerce, Shoper, IdoSell, PrestaShop, Magento / Adobe Commerce, własny sklep; pytania z pierwszej rozmowy jako przyciski z odpowiedzią-wiadomością obok formularza; kokpit, który na komputerze przełącza zakładki samym przewijaniem). Zauważyłem cofnięcie przy próbie wysłania i **nie wypuściłem tego na podgląd** — `/nawyko` na podglądzie to dalej wersja przywrócona przez doradcę. Zbudowane części leżą osobno (gałąź `agencja/r6p2-odrzucone`), żeby runda 6' mogła wziąć z nich integrację wieloplatformową, pytania-chipy i kokpit przewijany — tym razem bez usuwania żadnej Twojej sekcji.
Co weszło na `agencja/strona`: dwie poprawki bramek. (1) **Test Safari był ślepy od przebiegu R6 p1** — po zmianie nazw klas szukał telefonów, których już nie było, i mówił „PASS” przy zerze zmierzonych; teraz zna wszystkie telefony, a zero zmierzonych na `/nawyko` lub `/work/…` to FAIL. (2) Automat układu nie myli już tekstu „tylko dla czytników ekranu” z uciętą treścią.
Dowód (wersja odrzucona, do wglądu): `agencja/podglad/r6p2-lead-{why,proof,store}-{390,1440}.png`, `r6p2-wk-{390,1440}-*.png` (Safari), recenzja `agencja/recenzje/42-r6p2-review.md`; na tamtej wersji `gates.sh /nawyko` 19/19 PASS. Podgląd: https://rafal-oleksiak-consulting-git-agencja-strona-zurychhhs-projects.vercel.app/nawyko (stan przywrócony przez doradcę).
**Dlaczego biznesowo:** nie zgubiliśmy pracy, która odpowiada na Twoje prośby z 19:15 (integracja nie tylko Shopify, FAQ nie nudne), a jednocześnie strona nie traci sedna, które cofnąłeś.
**Czego się nauczyliśmy:** (R28) bramka, która nic nie zmierzyła, nie może mówić PASS; przebieg pobiera stan gałęzi ponownie przed scaleniem i bramkami (cofnięcie z 20:55 wyszło dopiero przy wysyłce o 21:12).

## Dla Rafała (poprzednie, R6 p1)

**Runda 6, przebieg 1 (24.11 19:38–20:35) — `/nawyko` ma nową górę: wszystkie ustawienia marki (nazwa, kolor, styl strony) są w jednym panelu obok telefonu w hero, pod nim pełnoekranowy pas w kolorze Twojej marki z licznikiem „Day 1 → 30, day 31: klient zamawia albo znika”, a potem jeden ciemny „kokpit”: osiem zakładek mechanik (karta dnia, seria i pieczątki, cashback, punkty i poziomy, lekcje, zakupy w aptece, zgody, stałe zasady), po lewej telefon klienta, po prawej suwak albo przełącznik marki, który od razu zmienia telefon. Zastąpił dziewięć dawnych sekcji (cztery kroki, nagrody, portfel, lekcje, apteka, prywatność, „czego nie robi”, środkowy konfigurator). `/work/genactiv`: wolniejsze tempo (1,4 ekranu na akt), tekst wchodzi dopiero po ustawieniu się telefonu, stały licznik „Act N of 11” ze streszczeniem, telefon na przemian po lewej i prawej, akt „The problem” na pełnym kolorze; finał ze zdrapką nietknięty.**
Do obejrzenia: https://rafal-oleksiak-consulting-git-agencja-strona-zurychhhs-projects.vercel.app/nawyko (wpisz nazwę marki w hero, przewiń przez czerwony pas i klikaj zakładki kokpitu) oraz …/work/genactiv. Vercel „success” dla cdf8621 (sprawdzone statusem commita).
1. **Twoje uwagi z 19:15:** personalizacja tylko na górze — zrobione; „skąd nagle nagrody” — odpowiada przerywnik „day 31”; „For you” + „Rewards in the app” w jeden kokpit — zrobione; ujednolicenie wizualne — kokpit na atramencie jak finał, ale dowód, integracje i FAQ są jeszcze na jasnym papierze (przebieg 2).
2. **Niezależny recenzent** znalazł: licznik w czerwonym pasie biegł, zanim pas był widoczny (poprawione: pas stoi przypięty, licznik biegnie na pełnym ekranie); kokpit na jasnym papierze zlewał się z dowodem (poprawione: atrament); błąd „1 days of slack” (poprawione). Jego dwa „blokujące” zarzuty do `/work/genactiv` okazały się skutkiem trybu automatu (strona celowo wyłącza przypinanie dla robotów testowych) — sprawdzone w przeglądarce z wyłączonym znacznikiem automatu: akty przypięte (15,4 ekranu toru), zdrapka zakryta.
3. **Teksty:** czytelnik-kupujący dał 29 propozycji na 42 nowe teksty (`agencja/recenzje/41-r6p1-teksty.md`); wprowadziłem 6 najważniejszych (nagłówek kokpitu bez „Left/Right”, „Miss up to N days and the stamp stays in reach”, zakładki „Lessons / Pharmacy purchases / Fixed rules”); reszta w przebiegu 2.
Dowód: `agencja/podglad/r6p1a-{390,1440}-{hero,why,cockpit-*}.png` (budowa), `r6p1-ink-cockpit-{390,1440}.png`, `r6p1-why-mid-{390,1440}.png` (po poprawkach), `r6p1b-{d,m}-*.png` (`/work/genactiv`, 7 pozycji przewijania + bez ruchu). Safari (WebKit) 390/1440 PASS na obu trasach w `gates.sh`. Bramki na buildzie po scaleniu obu części: build · tsc · lint 0 błędów (1 ostrzeżenie jak przed) · `gates.sh /nawyko /work/genactiv` — wszystkie 33 wiersze PASS (m.in. clsscroll 0,00008/0,00001/0/0, scroll-perf `/nawyko` 66/62 ms, `/work/genactiv` 0/54 ms, webkit, brand-propagation Chromium i Safari); po poprawkach recenzji i tekstów `/nawyko` ponownie (ostatni build): wszystkie 19 wierszy PASS (scroll-perf 1440 92 ms — blisko progu 100, 390 73 ms); zrzuty Safari `agencja/podglad/gates-wk-nawyko-{390,1440}-*.png` z tego buildu obejrzane.
**Dlaczego biznesowo:** decydent dostaje odpowiedzi w kolejności, w jakiej pyta (co to jest → po co → co ustawiam i co z tego mam), a jedna interaktywna scena zastępuje dziewięć sekcji, przy których przestawał czytać.
**Czego się nauczyliśmy:** (R27) recenzent oglądał `/work/genactiv` jako robot i widział wersję awaryjną — od teraz każdy recenzent ogląda stronę z wyłączonym znacznikiem automatu; licznik „sterowany przewijaniem” musi biec, gdy sekcja stoi na ekranie, nie gdy wjeżdża.

## Dla Rafała (poprzednie, R5 p3 cz. 1)

**Runda 5, przebieg 3 cz. 1 (24.11 18:37–19:20) — trzy sekcje pod portfelem przestały być kopiami siebie: „Learning paths” to teraz pas pięciu lekcji do klikania z metą w kolorze Twojej marki, „Pharmacy purchases” zajmuje cały ekran w kolorze Twojej marki z telefonem na środku i skanem pudełka, a „Privacy” to wielkie zdanie na atramencie z przełącznikiem zgody, który od razu pokazuje, co aplikacja zapisuje (sama data odhaczenia) i czego nigdy nie wysyła (reklamy, analityka, powiadomienia).**
Do obejrzenia (Vercel „success” dla df74cb8, sprawdzone statusem commita): https://rafal-oleksiak-consulting-git-agencja-strona-zurychhhs-projects.vercel.app/nawyko — kliknij „Learning paths” w pasku rozdziałów, przewiń trzy sekcje, kliknij lekcję, „Scan the box” i „With consent”. Sprawdź też bardzo ciemny kolor marki (#111111): sekcja prywatności przechodzi wtedy na jasne tło, żeby nie było dwóch czarnych bloków pod rząd.
1. **Twoja uwaga 5 (nudny układ):** odcinek od portfela w dół ma teraz pięć różnych układów i trzy tony powierzchni pod rząd (atrament → papier → kolor marki → atrament → papier). Niezależny krytyk: ten fragment naprawiony.
2. **Bramka `monotonia` całej strony: nadal FAIL**, ale z krótszą listą: zostały trzy sceny „tekst + telefon po prawej” na glinie pod rząd zaraz po scenie „How it works” (nagrody, „See the day…”, white label), histogram i pas integracji, które na nic nie reagują, oraz ekran z kodem nagrody powtarzany w trzech miejscach. To następny przebieg.
3. **Teksty:** czytelnik-kupujący przepisał 5 nowych (m.in. „A date. Nothing else.” → „Tick date only.”, bo aplikacja trzyma też konto i zakupy; „Order synced” → „Added automatically”). 7 pozycji w `agencja/teksty-do-akceptacji.md`.
Dowód: Chromium `agencja/podglad/r5p3c-{paths,pharmacy,privacy}-{1440,390}.png`, po kliknięciach `r5p3c-paths-done-*`, `r5p3c-privacy-on-*`, po poprawkach `r5p3c-v2-*` (demo i Acme #111111, skan przed/w trakcie/po); Safari (WebKit) w bramce `webkit-390/1440` PASS i osobno trzy nowe sekcje `r5p3c-wk-{paths,pharmacy,privacy}-{390,1440}.png` (telefony 213 i 250 px, bez przelewania); recenzja `agencja/recenzje/38-r5p3c-review.md` (0 blokujących, 3 ważne — wszystkie poprawione), teksty `39-r5p3c-teksty.md`. Bramki: build · tsc · lint 0 błędów (1 ostrzeżenie jak przed) · tabela `gates.sh /nawyko` (przepisana z wyniku):
```
/nawyko qa.js PASS · cls-390/1440 PASS · clsscroll-390 PASS 0.00008 · clsscroll-1440 INFO 0.00406 · scroll-perf-390 PASS 90 ms [93,84,90]
/nawyko scroll-perf-1440 FAIL mediana 114 ms [98,114,143] · short-1100c/1280c/390c PASS · focus-obscured PASS · jsonld PASS · webkit-390/1440 PASS
content-rules, copy-voice, focus-ring, brand-propagation, brand-prop-webkit PASS
```
**Płynność 1440 — nie ogłaszam „gotowe”:** A/B przeplatany ze starym buildem (7abbc02) na tej samej maszynie: stara 109 i 97 ms, nowa 100 i 114 ms (wcześniej nowa 103 i 92) — oba buildy krążą wokół progu 100 ms, różnicy nie widać; 390 przeszło (90 ms, w poprzednim przebiegu FAIL 119). Problem jest zastany, nie z tego przebiegu.
**Dlaczego biznesowo:** środek długiej strony to miejsce, gdzie decydent przestaje czytać; trzy sekcje w trzech różnych kolorach i układach trzymają uwagę, a każda pokazuje jedno konkretne „co dostaje moja marka” (drugi produkt, klienci z aptek w danych, zgodność z danymi zdrowotnymi).
**Czego się nauczyliśmy:** (R26) nowa klasa `.nk-scan` zderzyła się z istniejącą klasą promienia skanera w telefonie (przycisk rozciągnął się na całą szerokość i zakrył nagłówek) — reguła R24.2 sprawdzała tylko część nowych nazw; teraz pętla `grep` po wszystkich nowych klasach przed buildem.

## Dla Rafała (poprzednie, R5 p2 cz. 2)

**Runda 5, przebieg 2 cz. 2 (24.11 17:38–18:35) — na `/nawyko` trzy podobne sceny „tekst + jasny telefon” (Cashback, Points, Your costs) zastąpiła jedna ciemna sekcja z trzema ekranami Twojej aplikacji, w które się klika: portfel cashback rośnie przy każdym „Place order”, punkty i pieczątki poziomów przy „Scratch today”, a panel marki w pełnym kolorze marki ma suwak, który od razu zmienia wartość punktów klienta.**
Do obejrzenia (Vercel „success” dla 7abbc02, sprawdzone statusem commita): https://rafal-oleksiak-consulting-git-agencja-strona-zurychhhs-projects.vercel.app/nawyko —, wpisz markę i kolor w pierwszym ekranie, kliknij „Cashback” w pasku rozdziałów. Sprawdź też ciemny kolor marki (#111111) — pieczątki i pierścień zostają widoczne.
1. **Twoja uwaga 2 (od „Cashback” w dół), pierwsza połowa:** nowa powierzchnia (głęboki atrament) między jasnymi sekcjami, nagłówek „Cashback grows with every {marka} order.” z nazwą w kolorze marki, układ bento zamiast trzeciego z rzędu „tekst + telefon”. Każda kontrolka ma widoczny skutek obok siebie.
2. **Pierwsza bramka `monotonia` (krytyk-subagent, cała strona): FAIL** — to punkt odniesienia na kolejne przebiegi. Nowa sekcja przeszła; łamią rytm: cztery sceny w „How it works” na glinie pod rząd w tym samym układzie, Paths → Pharmacy → Privacy (ten sam układ w lustrze), histogram „See the day each pack runs out” bez interakcji, `#integrations` bez interakcji, ekran „Stamp earned” powtarza się w trzech miejscach. Finał jako najmocniejszy moment, cztery tony powierzchni i telefon w pierwszym ekranie — PASS.
3. **Teksty:** czytelnik-kupujący przepisał 6 z nich (m.in. „You set what the programme costs.” obiecywało za dużo → „You set what each point is worth.”; „Three screens” było nieprawdą, bo trzeci to panel marki). 6 pozycji w `agencja/teksty-do-akceptacji.md`.
Dowód: Chromium `agencja/podglad/r5p3-wallet-{1440,390}-{a,b}.png` (przed / po kliknięciach), Safari (WebKit) `r5p3-wk-wallet-{390,1440}-{0,1,2}.png` (0 × „Tovemi”, brak przelewania), recenzja `agencja/recenzje/35-r5p3-review.md` (1 blokująca: tekst 11 px → 12 px; ważne: ciemny kolor marki, kontrast zablokowanych poziomów, słabo widoczny skutek przełącznika i suwaka na telefonie — wszystkie poprawione), monotonia `36-monotonia-1.md` + `mono-*.png`, teksty `37-r5p3-teksty.md`. Bramki: build · tsc · lint 0 błędów (1 ostrzeżenie jak przed) · tabela `gates.sh /nawyko /work/genactiv` (przepisana, nie z pamięci):
```
/nawyko qa.js PASS · cls-390/1440 PASS · clsscroll-390 PASS 0.00008 · clsscroll-1440 INFO 0.00343 · scroll-perf-1440 PASS 96 ms
/nawyko scroll-perf-390 FAIL mediana 119 ms [150,105,119] · short-1100c/1280c/390c PASS · focus-obscured PASS · jsonld PASS · webkit-390/1440 PASS
/work/genactiv — wszystkie 14 PASS · content-rules, copy-voice, focus-ring, brand-propagation, brand-prop-webkit PASS
```
**Nie ogłaszam „gotowe” dla płynności na telefonie:** `scroll-perf-390 /nawyko` FAIL. A/B przeplatany ze starym buildem (R24) na tej samej maszynie: stara wersja 113 i 93 ms (też ponad progiem 100), nowa 124 i 122 ms — maszyna była dziś głośniejsza niż w poprzednich przebiegach (stara wersja miała wtedy 80 ms), ale nowa wygląda na ok. 15 ms gorszą. Skrypt w długich klatkach to ≤ 18 ms, reszta to rysowanie — kandydaci: przycinanie sześciokątów (`clip-path`), pierścień SVG. Pierwsza rzecz następnego przebiegu.
**Dlaczego biznesowo:** decydent ma najpierw zobaczyć, co jego klient robi w aplikacji (zamówienie → portfel, zdrapka → poziom), a zaraz obok — ile go to kosztuje i że to on ustawia kurs. Trzy takie same sekcje pod rząd usypiały; jedna żywa sekcja w innym kolorze przyciąga wzrok w środku długiej strony.
**Czego się nauczyliśmy:** (R25) bramka monotonii oceniana na całej stronie widzi to, czego nie widzą recenzje pojedynczej sekcji — cztery sceny pod rząd w tym samym układzie stały od rundy 4 i nikt ich nie zgłosił.

## Dla Rafała (poprzednie, R5 p2)

**Runda 5, przebieg 2 (24.11 16:38–17:30) — `/nawyko` kończy się teraz wielkim finałem: jeden poranek Twojego klienta w Twojej aplikacji, odsłaniany przewijaniem, z kartą do zdrapania w Twoim kolorze, a na końcu cała sekcja zmienia się w kolor Twojej marki i przechodzi w formularz „Build {marka}’s app.”.**
Do obejrzenia (Vercel „success” dla 2567f53, sprawdzone statusem commita): https://rafal-oleksiak-consulting-git-agencja-strona-zurychhhs-projects.vercel.app/nawyko — wpisz nazwę marki i kolor w pierwszym ekranie, potem przewiń na sam dół (albo kliknij „One morning” w pasku rozdziałów).
1. **Pięć chwil (Twoja uwaga 4):** 07:30 ikona Twojej marki na ekranie głównym telefonu między zwykłymi aplikacjami → 07:31 powiadomienie „Your card of the day is ready.” → 07:32 aplikacja otwiera się z ikony, karta dnia do zdrapania palcem/myszą w kolorze marki (albo „Reveal without scratching”) → dzień 24: seria 23 → 24, druga pieczątka się zapala → kod na kolejne opakowanie gotowy, zakładka Rewards, cała sekcja w kolorze marki → formularz. Kropki 1–5 przenoszą do każdej chwili (też z klawiatury).
2. **Po finale nic się nie powtarza:** formularz stoi sam, bez drugiego telefonu.
3. **Naprawiony błąd z poprzedniego przebiegu:** na iPhonie bez akceptacji cookies scena „Your brand” ucinała style, notkę i link (wybór koloru dodany w p1 wydłużył panel o ok. 120 px) — to samo na niskich laptopach. Teraz panel jest zwarty (kolory w jednym rzędzie), nic nie znika. Poprzedni raport podał „wszystko PASS” — to był błąd raportu (lekcja R24).
Dowód: zrzuty `agencja/podglad/r5p2-final-1440-chwile.png`, `r5p2-final-390-chwile.png` (z marką Acme), `r5p2-final-360-1440.png`; Safari (WebKit): `r5p2-wk-final-{390,1440}-{0..4}.png` (5 chwil, telefon 211/310 px, nazwa marki w aplikacji), `r5p2-wk-nawyko-{390,1440}-*.png`, `r5p2-wk-brandprop-*.png`; recenzja niezależna `agencja/recenzje/33-r5p2-review.md` + `r5p2-rev-*.png` (5 uwag — wszystkie poprawione: kontrast komunikatu i przycisku na kolorze marki, pustka między napisem a telefonem na 1440, 2–3 px przelewania w telefonie); teksty: czytelnik-kupujący `agencja/recenzje/32-r5p2-teksty.md` (4 przepisane), 9 nowych tekstów czeka w `agencja/teksty-do-akceptacji.md`. Bramki (pełna tabela: `agencja/recenzje/34-r5p2-bramki.md`): build · tsc · lint 0 błędów (1 ostrzeżenie jak przed) · `gates.sh /nawyko /work/genactiv` — wszystko PASS, w tym płynność `/nawyko` 1440 (mediana 78 i 85 ms w dwóch pomiarach; było na granicy 100), poza `short-1100c/1280c` na `/nawyko`, które były czerwone już przed tym przebiegiem i po poprawce przeszły osobnym uruchomieniem (0 problemów; qa.js 9 szerokości PASS po ostatniej poprawce). Zostaje: najmniejszy Android 360×740 z paskiem cookies — link „Ask how…” w scenie ucięty o 4 px (poza stałą bramką; było 7 elementów).
**Dlaczego biznesowo:** decydent zapamiętuje stronę po jej szczycie i końcu (NN/g „Peak–End Rule”) — teraz końcem jest chwila, w której jego klient odbiera nagrodę w aplikacji jego marki, i zaraz potem prośba o rozmowę w jego kolorze.
**Czego się nauczyliśmy:** (R24) raport dla Rafała przepisujemy z tabeli `gates.sh`, nigdy z pamięci; nowa klasa CSS = najpierw sprawdzenie, czy nazwa już istnieje; animacja „otwierania” bez skali na elementach z płótnem.

## Dla Rafała (poprzednie, R5 p1)

**Runda 5, przebieg 1 (24.11 13:38–14:30) — pierwszy ekran Nawyko pokazuje teraz żywą aplikację w marce odwiedzającego: wpisujesz nazwę i wybierasz kolor, a każdy telefon na stronie (13), akcent strony, finał i realizacja GENACTIV („See it with your brand”) zmieniają się na Twoją markę. Nazwa demo „Tovemi” znika całkowicie, a zdublowana personalizacja na końcu jest usunięta.**
Do obejrzenia (Vercel „success” dla 14854d7, sprawdzone statusem commita): https://rafal-oleksiak-consulting-git-agencja-strona-zurychhhs-projects.vercel.app/nawyko Wpisz nazwę swojej marki pod telefonem w pierwszym ekranie, wybierz kolor, zdrap kartę palcem/myszą (albo poczekaj 3 s — zdrapie się sama), potem przewiń całą stronę i wejdź na `/work/genactiv` — wybór jest zapamiętany.
1. **Hero (Twoja uwaga 6):** ciemny ekran „Today” jak w prawdziwej aplikacji: logo-monogram i nazwa marki, „Sample data”, tarcza 30 dni wokół opakowania, seria / odhaczone / dni do końca, karta dnia ze zdrapką w kolorze marki (metaliczna folia), „Next reward”, dolne zakładki Today · Rewards · Shop · Account. Pod nim jedno zdanie oferty i „Ask about Nawyko” — najpierw emocja, potem rozum.
2. **Silnik marki (uwaga 1):** jeden wybór na całą witrynę, zapamiętany w przeglądarce, nic nie jest wysyłane. Każdy pasek aplikacji w telefonach jest w Twoim kolorze, nazwa w każdym telefonie, w notkach („Showing your brand: Acme · sample data.”) i w finale („Build Acme’s app.”). Powracający gość nie widzi mignięcia nazwy demo.
3. **Finał (uwaga 3):** usunięty drugi wybór koloru i nagłówek „Your customers' daily app, in your brand colour.”. Wielki finał ze zdrapką i odsłanianiem to następny przebieg (p2).
Dowód: zrzuty `agencja/podglad/r5p1-hero-{390x844,1024x768,1280x720,1440}.png`, `r5p1-hero-1440-acme.png`; Safari (WebKit) `r5p1-wk-brandprop-{390,1440}.png`, `gates-wk-brandprop-*.png`, `gates-wk-{nawyko,work-genactiv}-{390,1440}-*.png`; recenzja niezależna `r5p1-rev-*.png` (0 blokujących, 5 ważnych — poprawione: kolejność pod telefonem na 390, tekst i CTA na 1280×720 nad zgięciem, kontrast ciemnych kolorów 4,45 → ≥ 4,5, „Reveal” z komunikatem dla czytnika ekranu, mignięcie nazwy); bramki: build · tsc · lint 0 błędów (1 ostrzeżenie jak przed) · `gates.sh /nawyko /work/genactiv`: wszystko PASS (qa.js 9 szerokości, CLS, clsscroll, focus, JSON-LD, Safari 390/1440, content-rules, copy-voice, focus-ring, **brand-propagation Chromium i Safari**) **poza jednym: płynność przewijania `/nawyko` na 1440 przy 4× zwolnionym procesorze jest na granicy** — przeplatany pomiar ze starą wersją: stara 61–93 ms, nowa 69–139 ms (próg 100). Usunąłem dwie podejrzane przyczyny (pulsowanie i samozdrapka w trakcie przewijania) — poprawa częściowa; przyczyny jeszcze nie znalazłem. Na telefonie 390 PASS. To pierwsza rzecz następnego przebiegu; na zwykłym komputerze nie powinno być tego widać, ale nie ogłaszam „gotowe”.
**Dlaczego biznesowo:** decydent marki widzi swoją aplikację w pierwszej sekundzie, zanim przeczyta pierwsze zdanie — to sprzedaje emocjonalnie to, co reszta strony udowadnia liczbami; personalizacja na całej stronie zamienia pokaz w „to już jest moja aplikacja”.
**Czego się nauczyliśmy:** (R23) personalizacja zapisana w przeglądarce musi być sprawdzona także przy POWROCIE gościa — React zawsze rysuje najpierw stan serwera, więc bez osłony przez ułamek sekundy wraca nazwa demo; teraz jest osłona i automat, który to łapie.

## Dla Rafała (poprzednie, cd.)
**Runda 4, przebieg 15 (24.11 12:38–13:50) — `/nawyko` na iPhonie z paskiem cookies nie ucina już niczego w scenie „How it works” (także mały iPhone SE i wąskie Androidy), a na komputerze klawisz Tab po krokach 01–04 pokazuje właściwy krok w telefonie.**
Do obejrzenia (Vercel „success” dla 11016dd, sprawdzone statusem commita): https://rafal-oleksiak-consulting-git-agencja-strona-zurychhhs-projects.vercel.app/nawyko → `/nawyko` na iPhonie bez akceptowania cookies, przewiń scenę do końca (link „Ask how your brand gets its own app” cały); na komputerze kliknij nad sceną i Tabem przejdź po krokach.
1. **Telefon z paskiem cookies:** dotąd scena liczyła się z całego ekranu, a pasek cookies zabierał jej dół — na 390×844 link do zapytania był ucięty o 21 px, na 360×740 siedem elementów do 69 px. Teraz scena liczy się z miejsca nad paskiem. Na iPhonie bez paska wygląd bez zmian.
2. **Klawiatura:** kroki 01–04 były przyciskami, ale Tab nie przełączał sceny (opis i telefon stały na 01). Teraz fokus przewija scenę do kroku; myszą bez zmian.
3. **Recenzent złapał, że pierwsza wersja chowała treść** na 360×740 nawet bez paska, a pomiar płynności pokazał, że ten sam mechanizm spowalniał scenę na telefonie — wycofany przed commitem; zamiast chować, telefon lekko maleje (o 15 px na 740 px wysokości). Zostało: na najmniejszym Androidzie 360×740 z paskiem cookies link dotyka cienkiej (2 px) kreski postępu — było 7 uciętych elementów.
4. **Bramki:** automat niskiego okna działa teraz przy każdym pomiarze (`gates.sh`), a sama bramka miała błąd — odmawiała pracy na poprawnym serwerze, gdy identyfikator buildu zaczynał się od „-”; naprawione.
Dowody: `agencja/podglad/r4p15-a-przed-390x844c.png` / `r4p15-a-390x844c-84-po.png`, `r4p15-a-przed-360x740c.png`, `r4p15-lead-{360x740,390x844,360x740c}-80.png`, Tab: `r4p15-a-{przed,po}-step-1440x900-krok{1..4}.png`, kalkulator `r4p15-b-slider-{before,after}-*.png`, Safari (WebKit): `r4p15-a-webkit-nawyko-390-*.png`, `r4p15-b-wk-slider-keys-390.png`, `gates-wk-nawyko-{390,1440}-*.png`; recenzja `agencja/recenzje/31-r4-p15-review.md`; pomiary `agencja/specs/26-a-pomiary.md`, `26-b-wynik.md`.
**Dlaczego biznesowo:** dział marketingu marki pierwszy raz otwiera link na telefonie, zanim zaakceptuje cookies — urwany przycisk zapytania w najważniejszej scenie to utracone zapytanie.
**Czego się nauczyliśmy:** (R22) zapytanie kontenera mierzy wnętrze elementu bez paddingu (W3C CSS Containment 3) — próg przepisany z okna był o 36 px za wysoki; a ten sam mechanizm na przewijanej scenie spowalniał klatki, więc każda taka zmiana przechodzi pomiar płynności A/B ze starą wersją.

## Dla Rafała (poprzednie)

**Runda 4, przebieg 14 (24.11 11:38–12:35) — `/nawyko` działa teraz na niskim laptopie: na ekranie 13" (np. 1280×720 albo okno nie na pełny ekran) z paskiem cookies nic w przypiętej scenie nie jest ucięte ani schowane pod paskiem. Kalkulator mówi poprawnie „1 order”, a obrys klawiatury nie przecina już podpisów.**
Do obejrzenia (Vercel „success” dla 0923ca6, sprawdzone statusem commita): https://rafal-oleksiak-consulting-git-agencja-strona-zurychhhs-projects.vercel.app/nawyko → `/nawyko` w oknie przeglądarki zmniejszonym do ok. 1280×720, przewiń scenę „How it works”; potem `/calculator`, Tab do suwaka.
1. **Niski laptop:** wcześniej na 1100×620 i 1280×720 krok 04 i jego opis były ucięte o 19–41 px, a link „Ask how your brand gets its own app” o 55 px — dział marketingu na 13-calowym laptopie widział urwaną scenę. Teraz odstępy, nagłówek i telefon dopasowują się do wysokości okna; na 1440×900 i na telefonie wygląd bez zmian. Pilnuje tego nowy automat, który sprawdza 95 pozycji sceny na 7 rozmiarach ekranu.
2. **Kalkulator:** „+1 orders × … × 1 customers” → „+1 order … 1 customer”; obrys fokusu suwaka rysuje się w środku pola zamiast przez tekst; suwak sprawdzony w silniku Safari (palcem/myszą i strzałkami).
3. **Recenzent złapał skok** przy przejściu przez próg wysokości okna (nagłówek i lista kroków zmieniały rozmiar o 61 px) — poprawione przed commitem, zmierzone: 0 px.
Dowody: `agencja/podglad/r4p14-a-przed-nawyko-1100x620c.png` (przed) i `r4p14-a-po-nawyko-1100x620c-*.png`, `r4p14-lead-1280x720-po-w1.png`, Safari: `r4p14-a-webkit-nawyko-1100x620c.png`, `r4p14-b-wk-slider-*.png`, `gates-wk-{nawyko,work-genactiv,calculator}-{390,1440}-*.png`; recenzja `agencja/recenzje/30-r4-p14-review.md`; pomiary `agencja/specs/25-a-pomiary.md`, `25-b-wynik.md`.
**Czego się nauczyliśmy:** (R21) każda scena przypięta ma działać na niskim laptopie z paskiem cookies — wcześniej sprawdzaliśmy tylko 390 i 1440×900, a niski ekran to typowy laptop kupującego; od teraz to automat w każdej zmianie sceny.

**Runda 4, przebieg 13 (24.11 10:38–11:35) — przebieg narzędzi jakości, na stronie prawie nic nowego do oglądania: bramka płynności przestała dawać fałszywe alarmy, pięć stron z narzędziami przeszło pełną kontrolę (z Safari) po raz pierwszy, a jedną poprawkę Nawyko cofnęliśmy, bo pogarszała czytelność.**
Do obejrzenia (Vercel „success” dla 5f90846, sprawdzone statusem commita): https://rafal-oleksiak-consulting-git-agencja-strona-zurychhhs-projects.vercel.app/lab/reward na iPhonie — strona nie przesuwa się już w bok.
1. **Płynność mierzona uczciwie:** dotąd jeden pomiar decydował o „FAIL”, a ten sam kod raz przechodził, raz nie. Teraz rozgrzewka + 3 pomiary i mediana (metoda z dokumentacji Lighthouse Google). Bramka ma też własne testy: na celowo zepsutej stronie musi dać FAIL.
2. **Narzędzia (`/calculator`, `/tools`, `/lab/reward`, `/lab/payback`, `/lab/reminder`):** pełna bramka pierwszy raz, w tym Safari 390 i 1440. Jedyny błąd: na telefonie `/lab/reward` dało się przesunąć w bok (ukryty komunikat dla czytnika ekranu wystawał poza ekran) — poprawione, tekst bez zmian.
3. **Cofnięte:** lista czterech kroków na `/nawyko` nie przesuwała się już ani o piksel, ale opis kroku stał pod ostatnim krokiem i czytał się jak jego opis; na laptopie 1280 px z paskiem cookies link wypadał poza ekran. Drgnięcie, które usuwała, jest ok. 30× poniżej progu Google — nie warto płacić za nie czytelnością.
Dowody: recenzja `agencja/recenzje/29-r4-p13-review.md` (0 blokujących, 2 ważne → wycofanie) i `r4p13-rev-*.png`; WebKit (silnik Safari) `agencja/podglad/gates-wk-{calculator,tools,lab-reward,lab-payback,lab-reminder,nawyko,work-genactiv}-{390,1440}-*.png`, scena `/nawyko` w Safari `r4p13-lead-wk-nawyko-{1100,1440}-*.png`; tabela tras `agencja/specs/24-b-trasy.md`. Bramki: build · tsc · lint 0/1 · `gates.sh /nawyko /work/genactiv` PASS.
**Dlaczego biznesowo:** narzędzia są magnesem na zapytania od marek — a marka ogląda je na iPhonie; strona, która ucieka w bok, wygląda na niedokończoną. Bramka bez fałszywych alarmów to mniej czasu na gonienie szumu, więcej na to, co widzi klient.
**Czego się nauczyliśmy:** (R20) poprawka, która wygrywa w pomiarze, może przegrać w czytaniu — kryterium każdej poprawki układu obejmuje teraz „czy wiadomo, do czego należy ten tekst” i najmniejszy laptop z paskiem cookies (1280×720).

**Runda 4, przebieg 12 (24.11 09:38–10:25) — przebieg kontroli jakości, mało widocznych zmian: bramka łapie teraz drgania układu podczas przewijania na każdej stronie, a dwie poprawki, które wyglądały dobrze w liczbach, odrzuciliśmy, bo pogarszały to, co widzi klient.**
Do obejrzenia (Vercel „success” dla 39d1125, sprawdzone statusem commita): https://rafal-oleksiak-consulting-git-agencja-strona-zurychhhs-projects.vercel.app/nawyko —, scena „How it works”: liczniki w telefonie („days”, „to go”, „✓ earned”) zmieniają się bez przesuwania się na boki.
1. **Bramka:** każda trasa jest teraz mierzona także podczas przewijania kółkiem (wcześniej tylko przy wejściu). `/work/genactiv` 0, `/nawyko` 0 na telefonie i 0,0034 na komputerze (dużo poniżej progu Google 0,1; źródło: rozwijający się opis kroku — zostawiony, bo jest animowany).
2. **Odrzucone przed commitem:** (a) „naprawa” listy kroków dawała w pomiarze 0, ale recenzent klatka po klatce zobaczył, że kroki skaczą o 23–54 px — cofnięte; (b) trzy nowe nagłówki z poprzedniego przebiegu nie przeszły czytelnika-kupującego (np. „budget” sugeruje limit wydatków, którego suwak nie ustawia) — zostały stare, propozycje czytelnika w „Czeka na Rafała”.
3. **`/work/genactiv`:** skok z paska rozdziałów stawia fokus i czytnik ekranu na nagłówku aktu — sprawdzone 8/8, nic do poprawy.
Dowody: recenzja `agencja/recenzje/28-r4-p12-review.md` (0 blokujących, 1 ważne — przyjęte) i zrzuty `agencja/podglad/r4p12-rev-*.png`; fokus `r4p12-b-fokus-{390,1440}.png`; WebKit (silnik Safari) `gates-wk-nawyko-{390,1440}-*.png`, `gates-wk-work-genactiv-{390,1440}-*.png` — PASS; pomiary `agencja/specs/23-a-pomiary.md`.
**Dlaczego biznesowo:** strona, która drga przy przewijaniu, wygląda na tanią robotę — a kupujący aplikację ocenia po niej, jak będzie działać jego aplikacja. Bramka, której nie da się „oszukać” liczbą, chroni tę ocenę w każdym następnym przebiegu.

**Runda 4, przebieg 11 (24.11 08:38–09:20) — przebieg szlifu: realizacja GENACTIV przewija się bez żadnego drgnięcia układu, a pasek rozdziałów nie wchodzi już w drogę na pierwszym ekranie; na Nawyko nagłówek FAQ mówi od pierwszego słowa, co jest niżej.**
Do obejrzenia (Vercel „success” dla f865a57, sprawdzone statusem commita): https://rafal-oleksiak-consulting-git-agencja-strona-zurychhhs-projects.vercel.app/work/genactiv (przewiń kółkiem przez akty 4–6: podpis pod telefonem i licznik w pierścieniu zmieniają się bez przesuwania sąsiedniego tekstu) oraz `/nawyko#faq`.
1. **`/work/genactiv`:** przesunięcia układu przy przewijaniu 0,0034 → 0 (źródło: wyśrodkowany podpis i licznik zmieniające szerokość). Pasek rozdziałów jest pierwszy w kolejności klawisza Tab po nawigacji, a na samej górze strony nigdy się nie pokazuje (recenzent złapał go tam w 2 z 5 prób — poprawione, 20/20 prób OK).
2. **`/nawyko`:** znacznik dnia na osi 30 dni jedzie płynniej (bez przeliczania układu); „FAQ: six answers you need before the first call.” zamiast „Six answers a brand needs…”. Pomiar obalił naszą hipotezę z poprzedniego przebiegu — pasek nie spowalnia sceny; prawdziwy koszt jest w przeliczaniu sceny przy zmianie kroku (następny przebieg).
3. **Strona główna `/`** zmierzona pełną bramką pierwszy raz — dwie rzeczy czerwone, opis w „Czeka na Rafała”.
Dowody: WebKit (silnik Safari) `agencja/podglad/gates-wk-work-genactiv-{390,1440}-*.png`, `gates-wk-nawyko-{390,1440}-*.png`, `gates-wk-home-*.png`; Chromium `r4p11-a-{przed,po}-{390,1440}.png`, `r4p11-b-{390,1440}.png`, `r4p11-lead-ga-1440-bar.png`; recenzja `agencja/recenzje/27-r4-p11-review.md` (0 blokujących, 1 ważne — poprawione) i `r4p11-rev-*.png`. Bramki `gates.sh /nawyko /work/genactiv` 21/21 PASS.
**Dlaczego biznesowo:** drgający tekst i pasek, który łapie klawiaturę, to drobiazgi, po których dział IT kupującego ocenia jakość wykonania aplikacji — realizacja jest naszą wizytówką.
**Czego się nauczyliśmy:** (R18) mierzymy przed naprawą — poprzedni przebieg wskazał winowajcę „na oko” i pomiar to obalił; tekst, który zmienia się w miejscu, dostaje nowy węzeł (`key`), a ruch po osi tylko `transform` (web.dev „CLS”).

**Runda 4, przebieg 10 (24.11 07:38–08:20) — realizacja GENACTIV ma teraz ten sam pasek co Nawyko: z każdego aktu jedno kliknięcie do zapytania i do każdego rozdziału; na Nawyko pasek w scenie z telefonem jest spokojniejszy (jeden rząd zamiast dwóch).**
Do obejrzenia (podgląd gałęzi, link stały — Vercel buduje go po każdym pushu): https://rafal-oleksiak-consulting-git-agencja-strona-zurychhhs-projects.vercel.app/work/genactiv — na komputerze przewiń do „Cashback”, potem lekko w górę, kliknij nazwę rozdziału i wybierz „Results”; oraz `/nawyko` w scenie z telefonem: pasek mówi teraz, który krok aplikacji oglądasz („How it works · 04 Reward”).
1. **`/work/genactiv`:** 8 rozdziałów z aktów sceny i przycisk „Ask about a brand app”. Na telefonie pasek nie pokazuje się w scenie (zasłaniał nagłówek aktu) — telefonowa wersja czeka na Twoją decyzję niżej.
2. **`/nawyko`:** poprawki z recenzji poprzedniego przebiegu — jeden rząd w scenie, akt w etykiecie, po kliknięciu rozdziału czytnik ekranu ogłasza cel, ciemniejsza czerwień numeru (kontrast 7,45:1).
3. **Teksty:** czytelnik-kupujący odrzucił „Ask about an app” (brzmi jak aplikacja do pobrania) i samo „Consent” — są „Ask about a brand app” i „Data and consent”.
Dowody: Chromium `agencja/podglad/r4p10-lead-ga-1440-bar.png`, `r4p10-lead-nk-390-after-scene.png`, `r4p10-b-*.png`, `r4p10-a-*.png`; WebKit (silnik Safari) `gates-wk-work-genactiv-{390,1440}-*.png`, `gates-wk-nawyko-{390,1440}-*.png`, `r4p10-a-wk-1440-scene.png`; recenzja `agencja/recenzje/26-r4-p10-review.md` (0 blokujących, 2 ważne — obie poprawione albo przekazane Tobie). Bramki `gates.sh /nawyko /work/genactiv` 21/21 PASS; build · tsc · lint 0/1 · copy-voice OK.
**Dlaczego biznesowo:** realizacja to nasza największa wizytówka i ma 11 ekranów; kupujący przekonany w połowie nie musi przewijać do formularza.
**Czego się nauczyliśmy:** (R17) bramki mierzyły stary serwer — pierwsze puszczenie po poprawkach dało 9 fałszywych FAIL; teraz `gates.sh` odmawia pomiaru, gdy serwer nie podaje tego samego buildu. Z sieci (Baymard): oznaczać i pola wymagane, i opcjonalne — formularz już spełnia, reguła dopisana dla nowych formularzy.

**Runda 4, przebieg 9 (24.11 06:38–06:58) — na `/nawyko` z każdego miejsca długiej strony jest jedno dotknięcie do zapytania i do każdego rozdziału: przy przewijaniu w górę wysuwa się cienki pasek z bieżącym rozdziałem i przyciskiem „Ask about Nawyko”.**
Do obejrzenia (Vercel „success” dla commita c52f644, sprawdzone przez status commita po pushu): https://rafal-oleksiak-consulting-git-agencja-strona-zurychhhs-projects.vercel.app/nawyko, przewiń za „Cashback”, potem lekko w górę; na iPhonie dotknij nazwy rozdziału (lista 7 rozdziałów).
1. **Jak u Apple:** strony produktowe Apple mają lokalny pasek z nazwą produktu, rozdziałami i przyciskiem kupna. U nas: pojawia się dopiero za pierwszym ekranem i tylko przy przewijaniu w górę (gdy ktoś szuka drogi), znika przy formularzu i — na telefonie — w scenie z telefonem, żeby nie zasłaniać ekranu aplikacji. Zero przesunięć strony.
2. **Recenzent złapał 3 ważne rzeczy, wszystkie poprawione przed commitem:** pasek zasłaniał nazwę marki na ekranie telefonu (390), klawisz Tab przeskakiwał listę rozdziałów, pasek odświeżał się przy każdej klatce przewijania.
3. **Bramki jednym poleceniem:** `scripts/gates.sh` puszcza wszystkie 12 kontroli (w tym Safari 390 i 1440 oraz płynność przy spowolnionym procesorze) i kończy się tabelą — koniec z pomijaniem bramki, która „przecież przeszła ostatnio”.
Dowody: Chromium `agencja/podglad/r4p9-cb-b-{390,1440}-*.png`, WebKit (silnik Safari) `r4p9-wk-cb-390-menu.png`, `r4p9-wk-cb-1440.png`, `gates-wk-nawyko-{390,1440}-*.png`; recenzja `agencja/recenzje/25-r4-p9-review.md` i zrzuty `r4p9-rev-*.png`. Bramki (`gates.sh /nawyko`): qa.js · CLS 390/1440 · scroll-perf 390/1440 · focus-obscured · jsonld · WebKit 390/1440 · content-rules · copy-voice · focus-ring — wszystkie PASS; build · tsc · lint 0/1.
**Dlaczego biznesowo:** strona ma kilkanaście ekranów; kupujący, który przekonał się w połowie (np. przy „Your costs”), nie musi szukać formularza — to klasyczna przyczyna utraconych zapytań na długich stronach produktowych.
**Czego się nauczyliśmy:** (R16) element przyklejony do ekranu trzeba sprawdzić na tle każdej przypiętej sceny i każdej szerokości — na komputerze było idealnie, na telefonie zasłaniał nazwę marki; nie przewidziałem tego, złapał niezależny recenzent. Z sieci (Smashing Magazine „Designing Sticky Menus: UX Guidelines”): menu częściowo przyklejone, małe, z bieżącą sekcją.

**Runda 4, przebieg 8 (24.11 05:38–06:05) — przewijanie `/nawyko` jest płynne także na słabszym sprzęcie: na komputerze z procesorem spowolnionym 4× zacięcia spadły z 14 do 0, a klik w zdrapkę reaguje 4× szybciej.**
Do obejrzenia (Vercel „success” dla commita 160d5d4, sprawdzone przez status commita po pushu): https://rafal-oleksiak-consulting-git-agencja-strona-zurychhhs-projects.vercel.app/nawyko — `/nawyko` przewinięte przez całą scenę z telefonem (na Macu w Safari i na iPhonie) oraz na `/` naciśnij Tab: ramka wokół „Nawyko reorder app” obejmuje sam napis, nie wchodzi już na link pod spodem.
1. **`/nawyko`:** przy każdym ruchu kółkiem przeglądarka przeliczała wygląd całego telefonu, bo dwie liczby sterujące animacją stały na samej górze sceny. Przeniesione tam, gdzie są używane — wygląd identyczny (zrzuty przed/po), a najdłuższe zacięcie na komputerze 131 ms → brak zacięć powyżej 50 ms; telefon 390: 3 → 1. Google liczy płynność reakcji (INP) do oceny strony.
2. **`/work/genactiv`:** zmierzona tak samo i przejrzana klatka po klatce co 4% przewijania — jest płynna (żadnego zacięcia > 100 ms, kliknięcia 16 ms), więc nic nie zmienialiśmy; uczciwiej niż poprawiać szum.
3. **`/` (bez zmian w treści i wyglądzie — porównanie ze źródłem PASS):** ramka fokusu z klawiatury na linkach w nagłówku przecinała drugi link na telefonie — poprawione, pilnuje tego nowy test.
4. **Dane dla wyszukiwarek:** strona ma jeden opis witryny z identyfikatorem, a `/nawyko` jest do niego podpięta (jedna spójna całość dla Google i odpowiedzi AI).
Dowody: `agencja/podglad/r4p8-nk-perf-{przed,po}-{1,2,3}.png`, `r4p8-home-focus-*-{390,1440}.png`, WebKit (silnik Safari): `r4p8-wk-scene-nawyko-{390,1440}-{5,10}.png`, `r4p8-wk-nawyko-*-0.png`, `r4p8-wk-home-*-0.png`. Bramki: build · tsc · lint 0/1 · copy-voice · content-rules · ship-compare · jsonld-rules · focus-obscured · focus-ring · qa.js PASS (`/`, `/stop`, `/tool`, `/nawyko`, `/work/genactiv`) · CLS 0 (`/`, `/nawyko`, 390 i 1440, tryb przewijania) · WebKit 390+1440 PASS na `/` i `/nawyko` (statycznie i scena; telefon 195/250/325 px). Niezależna recenzja: 0 blokujących, 0 ważnych.
**Dlaczego biznesowo:** właściciel marki ogląda pokaz na zwykłym laptopie albo telefonie, nie na naszym serwerze — zacinająca się scena wygląda jak tani szablon, płynna jak produkt. To też sygnał jakości dla Google.

**Runda 4, przebieg 7 (24.11 04:38–05:10) — mniej skakania strony: realizacja GENACTIV, strona główna i Nawyko ładują się bez przesunięć, także u kogoś z wolnym internetem.**
Do obejrzenia: podgląd gałęzi `agencja/strona` (adres niżej, „Podgląd”) — `/work/genactiv#enquiry` na komputerze (formularz od razu na miejscu, bez podskoku) i `/work/genactiv` na iPhonie po zaakceptowaniu cookies (telefon większy, bez pustego pasa na dole).
1. **`/work/genactiv`:** pusta rezerwa pod pasek cookies znika, gdy ktoś już raz kliknął zgodę. Wejście linkiem prosto do formularza na komputerze przesuwało stronę (0,17 — powyżej progu Google 0,1); nasz wcześniejszy pomiar pokazywał 0, bo patrzył na wersję dla robotów. Teraz 0 na telefonie i komputerze.
2. **`/` (Twoja strona z Claude Design, bez zmian w treści i wyglądzie — porównanie ze źródłem PASS):** przy wolno ładujących się fontach cała strona podskakiwała o ekran (wynik 1,0); teraz 0,07.
3. **`/nawyko` dla wyszukiwarek i odpowiedzi AI:** opis produktu, lista funkcji i 6 pytań FAQ w danych strukturalnych, słowo w słowo z tym, co widać na stronie, i połączone z Twoją osobą z `/`. Bez ceny i ocen, bo ich na stronie nie ma.
Dowody: `agencja/podglad/r4p7-ga-enquiry-*.png`, `r4p7-ga-{bez-zgody,zgoda}-*.png`, WebKit (silnik Safari): `r4p7-wk-scene-work-genactiv-390-13.png`, `r4p7-wk-scene-nawyko-390-5.png`, `r4p7-wk-home-*.png`.

**Runda 4, przebieg 6 (24.11 03:38–04:30) — strona główna po raz pierwszy prowadzi do Nawyko: w nagłówku `/` jest link „Nawyko reorder app”, widoczny bez przewijania na telefonie i komputerze.**
Do obejrzenia (Vercel „success” dla commita d895563, sprawdzone przez status commita po pushu): https://rafal-oleksiak-consulting-git-agencja-strona-zurychhhs-projects.vercel.app/ (prawy górny róg na komputerze, pod podpisem na telefonie) oraz https://rafal-oleksiak-consulting-git-agencja-strona-zurychhhs-projects.vercel.app/nawyko na iPhonie, przewinięte do rozdziału „For you” (telefon jest teraz większy i czytelny obok wykresu).
1. **`/`:** link dokłada mechanizm `ship-design` (ten sam, który dokłada link do narzędzia) — nagłówek „You don't pay twice for the same customer.” i reszta strony z Claude Design bez zmian; porównanie ze źródłem PASS. Czytelnik-kupujący odrzucił pierwszą wersję „The Nawyko app” („obcy wyraz, nie mówi, co dostaje marka, brzmi jak aplikacja do pobrania dla mnie”) → „Nawyko reorder app”.
2. **`/nawyko` na iPhonie:** nasza bramka Safari przez dwa przebiegi nie oglądała przypiętej sceny `/nawyko` (szukała złego elementu). Po poprawce od razu pokazała, że w rozdziale „For you” telefon kurczył się do 117 px — poprawione na 152 px, tekst i wykres mieszczą się nad paskiem cookies.
3. **`/work/genactiv`:** wejście linkiem do formularza (`#enquiry`) nie skacze już na komputerze ani na wolnym łączu (skok 0,06 → 0).
4. **Dowód:** WebKit (silnik Safari) `agencja/podglad/r4p6-final-home-wk-{390,1440}-0.png`, `r4p6-final-nk-wk-{390,1440}-10.png`, `r4p6-final-ga-wk-{390,1440}-12.png`; Chromium `r4p6-final-home-nav-{390,768}.png`, `r4p6-home-nav-*`; recenzja `agencja/recenzje/24-r4-p6-review.md` (0 blokujących). Bramki po scaleniu i poprawkach: build · tsc · lint 0/1 · copy-voice · qa.js PASS (`/`, `/stop`, `/nawyko`, `/work/genactiv`) · content-rules PASS · ship-compare PASS · WebKit 390+1440 PASS na `/`, `/nawyko` (scena), `/work/genactiv` (scena) · brak przewijania w poziomie 320–1024.
**Dlaczego biznesowo:** `/` to jedyna strona, którą widzi Google i większość wejść — do dziś nie było z niej żadnej drogi do głównego wyróżnika oferty. Teraz właściciel marki z wyszukiwarki jednym kliknięciem trafia na pokaz aplikacji.
**Czego się nauczyliśmy:** (R13) bramka, która mówi PASS, może patrzeć w złe miejsce — tryb sceny musi sprawdzać, że oglądany tor ma długość sceny. Moja zmiana tekstu linku po pomiarze budującego dała przewijanie w poziomie na 320–360 px, którego qa.js nie zgłosił — każda zmiana tekstu w nagłówku = ponowny przegląd szerokości 320–430. Z sieci (NN/g „Category Names Suck”): wymyślona nazwa w nawigacji nie daje „zapachu informacji” — zawsze nazwa + zwykłe słowo opisu.


**Runda 4, przebieg 5 (24.11 02:38–03:35) — na `/nawyko` dział prawny marki może sam spróbować włączyć losowanie nagród albo oświadczenie zdrowotne i zobaczyć, że aplikacja na to nie pozwala; realizacja GENACTIV wygląda w Safari tak samo jak w Chrome.**
Do obejrzenia: https://rafal-oleksiak-consulting-git-agencja-strona-zurychhhs-projects.vercel.app/nawyko — przewiń za „Proof”/„Integrations” do „What it never does” i kliknij przełącznik; https://rafal-oleksiak-consulting-git-agencja-strona-zurychhhs-projects.vercel.app/work/genactiv na iPhonie (pierwszy ekran: okrągła poświata, pełne pudełko; przewijanie: ekrany telefonu wjeżdżają od dołu). Stan podglądu: Vercel „success” dla commita 7ce9297 (sprawdzone przez status commita po pushu).
1. **`/nawyko`:** „Nothing a regulator or customer could hold against your brand.” — panel marki z trzema przełącznikami (Random prize draw · Add a health claim to a card · Swap the reward after scratching); każdy drga i wraca na „off” z jednym zdaniem dlaczego; telefon obok pokazuje stałą listę nagród. Pod spodem: „Each tick stores only the date. Health data never reaches ads, analytics, push or email.” Czytelnik-kupujący zmienił 5 tekstów przed commitem, m.in. usunął frazę „supports immunity” (na stronie o suplementach czyta się na zrzucie jak oświadczenie zdrowotne samej strony).
2. **Link z kotwicą** (np. `/nawyko#enquiry` z maila) nie ucieka już spod oczu: skok 0,17–0,20 → 0 na telefonie, 0,106 → 0 na komputerze. Przyczyną był krój pisma podmieniany po ~0,2 s.
3. **Realizacja GENACTIV w Safari:** dwa błędy, których Chrome nie pokazywał — poświata jako twardy prostokąt i ucięte pudełko na pierwszym ekranie — poprawione; między aktami teksty dwóch ekranów już się nie mieszają.
4. **Dowód:** WebKit (silnik Safari) `agencja/podglad/r4p5-final-nk-wk-{390,1440}-{0,5}.png`, `r4p5-final-ga-wk-{390,1440}-{0,5}.png`, przed/po `r4p5-ga-hero-wk{390,1440}-przed-po.png`, `r4p5-ga-zmiana-390-akt{1-2,7-8}-przed-po.png`; Chromium `r4p5-final-never-{390,1440}.png`; recenzja `agencja/recenzje/23-r4-p5-review.md` (0 blokujących; poprawione: litera „ł” w krojach zapasowych, krój przycisku Send, zarezerwowane miejsce na zdanie). Bramki po scaleniu i poprawkach: build · tsc · lint 0/1 · copy-voice · qa.js PASS (`/nawyko`, `/work/genactiv`) · content-rules PASS · WebKit 390+1440 PASS na obu trasach (także scena przypięta) · CLS kotwicy `#enquiry` 0,000.
**Dlaczego biznesowo:** kupujący po stronie marki boi się trzech rzeczy: reklamacji klientów, urzędu i działu prawnego. Scena pozwala mu to sprawdzić własnym kliknięciem zamiast czytać obietnicę — i to jest powód, żeby wysłać zapytanie. Realizacja to wizytówka oglądana głównie na iPhonach, więc błąd tylko w Safari był błędem dla większości oglądających.
**Czego się nauczyliśmy:** (R12) przez kilka minut mierzyliśmy starą wersję strony, bo stary serwer dalej trzymał port — pomiar przed każdym odczytem sprawdza teraz, czy serwer podaje świeży build. Z sieci: Chrome „Visually Stable Font Fallbacks” — następny krok to krój zapasowy z dopasowanymi metrykami, żeby krój marki zawsze się ładował bez skoku.



**Runda 4, przebieg 4 (24.11 01:38–02:05) — strona ma wspólną nawigację (Consulting · Nawyko · Tools · Contact) i nową stronę `/tools`, która zbiera pięć kalkulatorów w jednym miejscu.**
Do obejrzenia: https://rafal-oleksiak-consulting-git-agencja-strona-zurychhhs-projects.vercel.app/tools (pięć kart: pytanie, co wiesz po wyniku, jakie dane potrzebne) i https://rafal-oleksiak-consulting-git-agencja-strona-zurychhhs-projects.vercel.app/work/genactiv przewinięte do końca (plakietka „Your brand” zmienia kolor razem z telefonem). Vercel „success” dla commita 7ce9297 (sprawdzone przez status commita po pushu)
1. **Nawigacja:** te same cztery pozycje na każdej trasie poza `/` (jej nagłówek to Claude Design — nie ruszany) i `/tool`; na 390 mieści się w jednym wierszu; bieżąca strona podkreślona czerwienią; Contact prowadzi do formularza tej strony.
2. **`/tools`:** „Reorder questions, answered from your own numbers.” Recenzent złapał fałszywe zdanie „Nothing you type is sent” (narzędzie `/tool` wysyła tytuły produktów do AI po kliknięciu) — poprawione przed commitem na zgodne z prawdą.
3. **Realizacja GENACTIV:** lżejsza o 8% JS; telefon nie robi już pustej klatki między aktami.
4. **Dowód:** zrzuty WebKit (silnik Safari) `agencja/podglad/r4p4-tools-wk-*.png`, `r4p4-ga-wk-{390,1440}.png`; Chromium `r4p4-tools-{390,1440}.png`, `r4p4-nav-nawyko-{390,1440}.png`, `r4p4-ga-final-{390,1440}.png`. Bramka WebKit sprawdza teraz także rozmiar Maca (1440) i kończy się błędem, gdy telefon jest węższy niż 150 px.
**Dlaczego biznesowo:** właściciel marki, który wszedł na jedno narzędzie, widzi resztę oferty jednym kliknięciem — mniej ślepych zaułków = więcej dróg do zapytania.


**Runda 4, przebieg 3 (23.11 23:38 – 24.11 00:10) — obie strony mają już finał: odwiedzający wybiera kolor swojej marki i widzi telefon przemalowany na żywo, a pod spodem jest formularz zapytania.**
Do obejrzenia: https://rafal-oleksiak-consulting-git-agencja-strona-zurychhhs-projects.vercel.app/nawyko#enquiry (wpisz nazwę sklepu i kliknij inną próbkę koloru) oraz https://rafal-oleksiak-consulting-git-agencja-strona-zurychhhs-projects.vercel.app/work/genactiv przewinięte do końca sceny (wyniki jako „Locked”, potem wybór koloru i formularz). Vercel „success” dla commita 7ce9297 (sprawdzone przez status commita po pushu)
1. **`/nawyko`:** „Your customers' daily app, in your brand colour.” — 6 próbek + dowolny kolor; ramka i akcent telefonu, pasek sekcji i plakietka zmieniają kolor, tekst sam dobiera czarny/biały (kontrast zmierzony ≥ 4,5:1 na każdej próbce, jasny i ciemny motyw). Kolor zostaje na stronie, formularz wysyła tylko swoje pola. Wejście linkiem z kotwicą (np. `/nawyko#faq`) nie „ucieka” już spod kursora: skok 0,32–1,17 → 0–0,15.
2. **`/work/genactiv`:** akt 9 „Success means more reorders than customers without the app.” — szary wykres bez wartości, „Locked · no data yet”, metoda: grupa kontrolna, pierwszy odczyt 90 dni po uruchomieniu; zero liczb. Akt 10: ten sam wybór koloru na telefonie GENACTIV, formularz „Ask about an app for your brand” (trafia do `/api/lead` jako `work`), link do `/nawyko`. W nagłówku Nawyko · Work · Contact. Linku do realizacji z `/nawyko` i `/` NIE dodaliśmy (decyzja niżej).
3. **Dlaczego biznesowo:** finał zamienia ciekawość w zapytanie w chwili najwyższego zaangażowania — właściciel marki widzi „swoją” aplikację, zanim napisze. Na realizacji sekcja wyników mówi uczciwie, jak będzie mierzony efekt, zamiast pustego miejsca albo zmyślonej liczby.
4. **Dowód:** zrzuty `agencja/podglad/nawyko-r4-final-{390,1440}(-color|-night).png`, `genactiv-p3-{9-results,10-final,10-final-color}-{390,1440}.png`, `genactiv-p3-lead-{9,10}-{390,1440}.png`, `genactiv-p3-static-{9,10}-390.png`; tabela skoków przy kotwicach w `agencja/specs/13-nawyko-final-k-i-kotwice.md`. Recenzja niezależna: 0 błędów blokujących, 3 ważne uwagi (akt 9 sprawdzony potem zrzutem; pasek cookies na 390 zasłania podpis — w kolejce; etykieta aktu 10 nie zmienia koloru — w kolejce). Czytelnik-kupujący: 8 uwag, 7 tekstów przepisanych przed commitem („before the first call”, „after launch”, żargon „lift/locked”, różne nazwy kolorów na dwóch stronach).
   Bramki po scaleniu i poprawkach: build OK · `tsc` OK · lint 0 błędów, 1 ostrzeżenie (jak przed) · `copy-voice` OK (z nową regułą R10) · `qa.js --scroll` PASS na `/`, `/stop`, `/tool`, `/nawyko`, `/work/genactiv` · `content-rules` PASS · `ship-compare` PASS · `tool-rules` OK · `noindex, nofollow` na `/work/genactiv`, 0 wpisów `/work` w sitemap · CLS całej `/work/genactiv` 0,0031 (390) / 0,0007 (1440).
5. **Czego się nauczyliśmy:** czytelnik drugi raz z rzędu złapał zdanie zdradzające status projektu („store-ready”, teraz „90 days after launch”) — powtórzona lekcja stała się testem: automat tekstów odrzuca słowa o starcie/pilocie/gotowości do sklepów (R10) i od razu znalazł dwa stare „before launch” (poprawione). Ze spisu skoków: jeden z dwóch powodów był nasz własny wcześniejszy fix (rezerwa pod pasek cookies dodawana do każdej sekcji osobno).


**Runda 4, przebieg 2 (23.11, 22:38–23:10) — `/nawyko` odpowiada na trzy ostatnie pytania kupującego (dowód, integracje, FAQ), a realizacja GENACTIV ma akty 5–8.**
Do obejrzenia: https://rafal-oleksiak-consulting-git-agencja-strona-zurychhhs-projects.vercel.app/nawyko#proof (przesuń suwak „Customers held out as control”), potem `#integrations` i `#faq`; oraz `/work/genactiv` przewinięte za zdrapkę (akty 5–8). Stan linku — Vercel „success” dla commita 7ce9297 (sprawdzone przez status commita po pushu).
1. **`/nawyko` (Tovemi, zmyślona):** „Reorder lift, measured against customers who never get the app.” — suwak dzieli 24 klientów na grupę z aplikacją i kontrolną, dwie krzywe z zakresami, obok rozkład „Real pack length, from daily ticks” (oba z plakietką EXAMPLE, bez procentów). „Runs on Shopify; your other tools connect per brand.” — pas: Shopify, aplikacje subskrypcji, lojalności, e-mail/CRM, App Store · Google Play, z linkiem „Ask which apps connect to your store →”. FAQ: 6 pytań (codzienne odhaczanie, dane o zdrowiu, koszt nagrody, czas wdrożenia — bez terminów i cen, apteka, brak zgody).
2. **`/work/genactiv`:** „Cashback grows with every repeat order.” (schody bez wartości), punkty i poziomy z medalem i prezentem na mecie ścieżki (nazwy lekcji jako placeholdery), „Consent off: every card stays visible.” z działającym przyciskiem „Agree and turn on”, „Every build passes security, data and copy checks.” — oś bramek do „Store release only after the brand signs off”, zero liczb i bez twierdzenia, że aplikacja jest w sklepach.
3. **Dlaczego biznesowo:** kupujący po stronie marki pyta „skąd wiem, że to działa”, „czy to się wepnie w mój sklep” i „co z RODO” — strona odpowiada na to przed pierwszą rozmową, więc zapytanie przychodzi od kogoś, kto już przeszedł te obiekcje. Na realizacji: dowód, że za aplikacją stoją bramki jakości, nie tylko efekt.
4. **Dowód:** zrzuty `agencja/podglad/nawyko-r4-{proof,integrations,faq}-{390,1440}(-night).png`, `nawyko-r4-proof-*-held2.png`, `genactiv-p2-{0-hero,4-month,5-cashback,6-levels,7-consent,8-build}-{390,1440}.png`, `genactiv-p2-7-consent-kb-1440.png`; recenzja niezależna `agencja/recenzje/21-r4-p2-review.md` (3 ważne + 4 mniejsze; poprawione: EXAMPLE na liczbach GENACTIV, przycisk zgody z klawiatury, kontrast 3,22 → biały tekst, teksty, link z pasa; nie poprawione: skok przy wejściu z kotwicą — zmierzony, przyczyna w specu 12); czytelnik `22-teksty-czytelnik-r4-p2.md` (16 tekstów przepisanych przed commitem).
   Bramki po scaleniu: build OK · `tsc` OK · lint 0 błędów, 1 ostrzeżenie (jak przed) · `copy-voice` OK · `qa.js` PASS na `/`, `/stop`, `/tool`, `/nawyko`, `/work/genactiv` · `content-rules` PASS · `ship-compare` PASS · `tool-rules` OK · `noindex, nofollow` na `/work/genactiv`, 0 wpisów `/work` w sitemap · surowy CLS `/work/genactiv` 0,0026 (390) / 0,0006 (1440).
5. **Czego się nauczyliśmy:** czytelnik złapał dwa zdania, które były fałszem wobec mechaniki aplikacji (FAQ sugerował, że marka widzi odhaczenia pojedynczego klienta; „nagrody za zamówienie nigdy nie czekają na zgodę” — niepotwierdzone) oraz „store-ready build”, który zdradzał status pilota. Nowa reguła R9 niżej. Z sieci: Google wycofał wyniki rozszerzone FAQ — FAQ zostaje jako widoczny tekst w HTML (sprawdzone: odpowiedzi są w HTML z serwera).


**Runda 4, przebieg 1 (23.11, 21:38–22:20) — `/nawyko` pokazuje trzy kolejne funkcje aplikacji, a realizacja GENACTIV ma pierwszą wersję z pudełkiem, zdrapką i pieczątką.**
Do obejrzenia: https://rafal-oleksiak-consulting-git-agencja-strona-zurychhhs-projects.vercel.app/work/genactiv (nowe, noindex, poza sitemap) i `/nawyko` od sceny „Exchange” w dół (stan wdrożenia — ostatnia wiadomość przebiegu).
1. **`/work/genactiv`, akty 0–4, nocny motyw w kolorach aplikacji, krój Montserrat (lokalnie, licencja OFL):** z czerwonego pudełka
   (CSS 3D, nazwa marki tekstem, bez logo i zdjęć) wysuwa się telefon; H1 „GENACTIV turns every box into a daily reason to come back.”;
   pierścień 30 dni gaśnie w połowie („The risk: the habit fades halfway through the pack.”); skan pudełka albo paragonu („The receipt
   photo stays on the phone.”); zdrapka w folii marki do zdrapania palcem/myszą (albo sama po 1,5 s; przycisk dla klawiatury);
   pierścień wypełnia się z przewijaniem i 24. dnia spada pieczątka. Wszystkie ekrany podpisane „Recreated screen for illustration.”
   Bez stawek, cen, liczb sprzedaży, treści lekcji, zrzutów prawdziwej aplikacji i twierdzeń zdrowotnych. Na końcu „See it with your brand →”.
2. **`/nawyko`, trzy nowe sceny (marka Tovemi, zmyślona):** „A second product, earned in five short lessons.” (przycisk przesuwa
   ścieżkę, na mecie medal i kod prezentu na następne zamówienie); „Pharmacy buyers show up in your data after one scan.” (telefon
   skanuje kod pudełka); „Health data never reaches your marketing.” (bez zgody karta i seria są widoczne, ale zablokowane; przycisk
   „Agree and turn on” w telefonie działa). Na telefonie scena „Exchange” mieści suwak panelu marki i telefon w jednym kadrze.
3. **Dlaczego biznesowo:** sceny d–f odpowiadają na trzy pytania kupującego, których strona nie zadawała: dodatkowa sprzedaż bez reklamy,
   klienci z apteki, dział prawny. Realizacja GENACTIV to jedyny dowód „to działa na prawdziwej marce” — szkielet stoi, akty 5–10 w kolejnych przebiegach.
4. **Dowód:** zrzuty `agencja/podglad/genactiv-p1-{0-open,0b-out,1-problem,2-proof,3-scratch,4-month,5-end}-{390,1440}.png`,
   `nawyko-r4-{paths,pharmacy,privacy,exchange}-{390,1440}.png` (+ `-click-`, `-bar-390`), recenzja niezależna
   `agencja/recenzje/19-r4-sceny-d-f-i-genactiv-p1.md` (8 poprawek — wszystkie zrobione; m.in. skoki układu na `/work/genactiv` 0,225 → 0,0003 (390)
   i 0,068 → 0,0001 (1440), zdrapka osiągalna Tabem), czytelnik-kupujący `20-teksty-czytelnik-r4.md` (ok. 20 tekstów przepisanych przed commitem).
   Bramki po ostatniej zmianie: build OK · `tsc` OK · lint 0 błędów, 1 ostrzeżenie (jak przed) · `copy-voice` OK (nowa wersja, R8) ·
   `qa.js` PASS na `/`, `/stop`, `/tool`, `/nawyko`, `/work/genactiv`, `/lab/home` · `content-rules` PASS · `ship-compare` PASS ·
   `focus-obscured` OK · `tool-rules` OK · `noindex, nofollow` na `/work/genactiv`, 0 wpisów `/work` w sitemap.
5. **Czego się nauczyliśmy:** automat tekstów był ślepy na teksty trzymane w tablicach (cała realizacja GENACTIV przeszła „OK” bez czytania).
   Teraz czyta też takie teksty i od razu znalazł dwa stare „unlock” na `/nawyko` i `/lab/home` — poprawione (R8). Z sieci: WCAG 2.2 2.5.7.

**Runda 3, przebieg 6 (23.11, 16:38–17:15) — trzecie narzędzie: „którego dnia wysłać przypomnienie o kolejnym opakowaniu”, i zdrapka widoczna także dla osób z wyłączonymi animacjami.**
Do obejrzenia: `/lab/reminder` (nowe, noindex) — wpisz swoje trzy liczby i przesuń suwak.
1. **`/lab/reminder`: „Which day should the reorder reminder go out?”** Trzy pola odwiedzającego: na ile dni starcza opakowanie,
   ile trwa dostawa, ile dni klient zwleka z zamówieniem po przypomnieniu. U góry jedna odpowiedź „Day 25” (przykład 30 / 3 / 2,
   podpisany „Example — type your own”), pod nią rachunek „… = day 25 of the pack (day 28 after the order, if opened on arrival)”
   i „Too early: the customer still has plenty at home. Too late: days without the product.” Suwak „If the reminder goes out on
   day N” rysuje jedno opakowanie: czarne dni z produktem, czerwone kreskowane dni bez produktu, kreska przypomnienia i dostawy.
   Jedyny krok: „Time it for each customer from the day they open the pack →” do `/nawyko`.
   Biznesowo: to pytanie, które marka zadaje przy każdej automatyzacji maili; odpowiedź „jeden dzień dla średniego klienta”
   sama pokazuje swoją granicę — każdy klient otwiera opakowanie kiedy indziej, a Nawyko zna ten dzień, bo klient codziennie zdrapuje kartę.
2. **`/nawyko` bez animacji (ustawienie systemu „ogranicz ruch”):** dotąd od razu pokazywał nagrodę, więc najważniejszy moment strony
   znikał. Teraz karta jest zakryta i odwiedzający zdrapuje ją sam (palcem, myszą albo przyciskiem). Wersja z animacjami bez zmian.
3. **Dowód:** zrzuty `agencja/podglad/reminder-390.png`, `reminder-1440.png`, `reminder-slider-390.png`, `reminder-slider-1440.png`,
   `nawyko-reduce-scratch-390.png`, `nawyko-reduce-scratch-1440.png` (na dwóch ostatnich widać pasek cookies — karta jest nad nim).
   Recenzja niezależna (8/8 PASS) + czytelnik-kupujący i lista poprawek: `agencja/recenzje/18-narzedzie-dzien-przypomnienia.md`.
   Spec `agencja/specs/10-narzedzie-dzien-przypomnienia.md`. Bramki: build OK · `tsc` OK · lint 0 błędów, 1 ostrzeżenie (jak przed) ·
   `copy-voice` OK · `reminder-model`, `payback-model`, `reward-model`, `calculator-model`, `tool-rules` OK · `qa.js` PASS na `/`, `/stop`,
   `/tool`, `/nawyko`, `/lab/reminder` · `content-rules` PASS · `ship-compare` PASS · `focus-obscured` OK (`/lab/reminder`, `/nawyko`, `/lab/payback`) ·
   surowe przesunięcia układu (R6) przy 12 edycjach: `/lab/reminder` 0,0058 (390) / 0,0020 (1440); mini-kalkulator w hero `/nawyko` 0,0022 / 0,0083 — poprzedni „0,0000” był ślepy, teraz zmierzony surowo.
   Podgląd: https://rafal-oleksiak-consulting-git-agencja-strona-zurychhhs-projects.vercel.app/lab/reminder (stan wdrożenia w ostatniej wiadomości przebiegu).
4. **Teksty:** 6 nowych wierszy w `agencja/teksty-do-akceptacji.md` (`/lab/reminder`); czytelnik-kupujący zmienił 5 z nich przed commitem.
5. **Czego się nauczyliśmy:** każdy wynik będący dniem musi mówić, od czego jest liczony (R7) — złapał to tylko czytelnik-kupujący, nie recenzenci.
   Z sieci: pierwsze słowa nagłówka niosą treść (NN/g) → nowa zasada 8 w rubryce tekstów.


**Runda 3, przebieg 5 (23.11, 15:38–16:10) — drugie narzędzie: „które zamówienie zwraca koszt nowego klienta”, i koniec skaczącego układu przy wpisywaniu.**
Do obejrzenia: `/lab/payback` (nowe, noindex) i `/lab/reward` (wpisz kilka liczb na telefonie).
1. **Nowe narzędzie `/lab/payback`: „Which order pays back the cost of a new customer?”** Trzy pola z liczbami odwiedzającego: koszt
   pozyskania klienta, marża na zamówieniu (kwota), średni odstęp między zamówieniami. U góry jedna odpowiedź: „Order 3 · day 90”
   (przykład 90 / 36 / 45, podpisany „Example — type your own”), pod nią rachunek „90 to win ÷ 36 margin per order = 2.5 → order 3”
   i jedno zdanie: każdy klient, który odejdzie przed tym zamówieniem, kosztuje. Suwak „A customer who stops after N orders” pokazuje
   bilans takiego klienta (−18 · not paid back / +18 · paid back) i drabinkę zamówień. Jedyny krok: „How to get customers to order 3 →” do `/nawyko`.
   Biznesowo: to pierwsze pytanie dyrektora marketingu o retencję („ile zamówień muszę utrzymać, żeby reklama się zwróciła”),
   a odpowiedź — konkretny numer zamówienia i dzień — prowadzi prosto do Nawyko (nawyk przed końcem pierwszego opakowania).
2. **Skoki układu przy wpisywaniu usunięte w `/lab/payback` i `/lab/reward`.** Recenzent znalazł, że nasz pomiar „CLS 0” był ślepy
   (przeglądarka pomija przesunięcia tuż po wpisaniu). Zmierzone surowo na 12 edycjach: `/lab/reward` 0,149 → 0,029 (telefon).
3. **Dowód:** zrzuty `agencja/podglad/payback-390.png`, `payback-1440.png`, `payback-390-own.png`, `payback-1440-own.png`,
   `reward-r3e-390.png`, `reward-r3e-1440.png`. Recenzja niezależna + czytelnik-kupujący `agencja/recenzje/17-narzedzie-zwrot-klienta.md`
   (4 poprawki wyglądu i 7 tekstów przepisanych przed commitem). Spec `agencja/specs/09-narzedzie-zwrot-klienta.md`.
   Bramki: build OK · `tsc` OK · lint 0 błędów, 1 ostrzeżenie (jak przed) · `copy-voice` OK · `payback-model`, `reward-model`,
   `calculator-model`, `tool-rules` OK · `qa.js` PASS na `/`, `/stop`, `/tool`, `/lab/payback` (i `/lab/reward`, `/nawyko`) · `content-rules` PASS ·
   `ship-compare` PASS · `focus-obscured` OK (`/lab/payback`, `/lab/reward`, `/nawyko`, `/calculator`).
   Podgląd: https://rafal-oleksiak-consulting-git-agencja-strona-zurychhhs-projects.vercel.app/lab/payback (stan wdrożenia w ostatniej wiadomości przebiegu).
4. **Teksty:** 6 nowych wierszy w `agencja/teksty-do-akceptacji.md` (`/lab/payback`).
5. **Czego się nauczyliśmy:** liczba, która wygląda na dowód, może być ślepa — od dziś skoki układu mierzymy surowo przy każdej edycji (R6).


**Runda 3, przebieg 4 (23.11, 14:38–15:00) — kwota pieniędzy w pierwszym ekranie `/nawyko` i `/lab/home` (decyzja J), liczona z liczb odwiedzającego.**
Do obejrzenia: `/nawyko` i `/lab/home` tuż pod pierwszym ekranem (blok „What the gap between packs costs you”) oraz `/lab/reward` (zdanie pod wielką liczbą).
1. **Mini-kalkulator w hero.** Trzy krótkie pola w jednym rzędzie: co ile dni klienci zamawiają ponownie, na ile dni starcza
   opakowanie, przychód z ponownych zamówień rocznie. Pasek jednego cyklu: czarne = opakowanie, czerwone kreskowane = dni bez
   produktu. Duża czerwona liczba: dodatkowy przychód rocznie, gdyby każdy klient zamawiał, gdy kończy się opakowanie
   (przykład: 58 dni, opakowanie 30, 480,000 → +448,000), podpis „Example — type your own” tuż nad liczbą i „Upper limit”.
   Ten sam wzór co `/calculator` (funkcja `gapValue`); pod spodem link do pełnego kalkulatora. Nic nie jest wysyłane.
   Biznesowo: odwiedzający w kilka sekund widzi koszt pustych dni we WŁASNEJ walucie, a cała strona Nawyko odpowiada, jak je zamknąć.
2. **`/lab/reward`: wartość zamówienia zmienia teraz widoczny wynik** (reguła: każde pole zmienia wynik). Pod liczbą: „Same as 80% off
   one order of 120, once a year. Pick one fixed reward that costs less and announce it up front.” — marka od razu widzi, jaki rabat
   na kolejne opakowanie się spina.
3. **Fokus klawiatury nie chowa się już pod paskiem cookies** na żadnej stronie pisanej ręcznie. Nowy automat
   `scripts/focus-obscured.test.mjs` od razu znalazł starszy błąd na `/calculator` (390: przycisk „Talk these numbers through” pod paskiem) — naprawiony.
4. **Słowa:** hero `/nawyko` urósł o blok narzędzia (ok. +45 słów, w tym etykiety pól) — świadomie, bo to decyzja J; −30% w treści nadal czeka na decyzję N.
5. **Dowód:** zrzuty `agencja/podglad/hg-r3d-nawyko-390.png`, `hg-r3d-nawyko-1440.png`, `hg-r3d-labhome-390.png`, `hg-r3d-labhome-1440.png`,
   `reward-r3d-390.png`, `reward-r3d-1440.png`. Recenzja niezależna `agencja/recenzje/14-mini-kalkulator-hero.md` (5 poprawek → wszystkie
   zrobione, potwierdzone drugim podejściem w `16-weryfikacja-r3d.md`: rachunek sprawdzony na 4 przypadkach, CLS przy wpisywaniu 0,0000);
   czytelnik-kupujący `15-teksty-mini-kalkulator.md` (5 tekstów przepisanych, m.in. „empty shelf” → „gap between packs”, dodane pole opakowania).
   Bramki po ostatniej zmianie: build OK · `tsc` OK · lint 0 błędów, 1 ostrzeżenie (jak przed) · `copy-voice` OK · `calculator-model`,
   `reward-model`, `tool-rules` OK · `qa.js` PASS na `/`, `/nawyko`, `/lab/home`, `/lab/reward`, `/calculator`, `/tool`, `/stop` ·
   `content-rules` PASS · `ship-compare` PASS · `focus-obscured` OK (4 trasy × 2 szerokości) · CLS hero: 0,0002 (390) / 0,0073 (1440) na `/nawyko`.
   Podgląd: https://rafal-oleksiak-consulting-git-agencja-strona-zurychhhs-projects.vercel.app/nawyko (i `/lab/home`, `/lab/reward`); stan wdrożenia w ostatniej wiadomości przebiegu.

**Runda 3, przebieg 3 (23.11, 13:38–14:05) — nowe narzędzie „ile może kosztować nagroda” i spokojniejszy przejazd telefonu na `/nawyko`.**
Do obejrzenia: `/lab/reward` (nowe, noindex) i `/nawyko` w rozdziałach „For you” → „Under your brand”, na telefonie i na desktopie.
1. **Nowe narzędzie `/lab/reward`: „What can a loyalty reward cost and still pay off?”** Trzy pola z liczbami odwiedzającego
   (wartość zamówienia, marża na zamówieniu w walucie, ile dodatkowych zamówień rocznie daje nagroda — jego założenie),
   u góry jedna duża liczba: próg opłacalności nagrody na klienta rocznie (marża × dodatkowe zamówienia). Suwak „Try a reward
   cost” mówi od razu „Pays off · 48 margin left” albo na czerwono „Doesn't pay off”. Jeden krok dalej: `/nawyko`.
   Żadnej liczby rynkowej; wartości startowe oznaczone „Example — type your own”. Biznesowo: odpowiada na pierwsze pytanie
   marki o program lojalnościowy („ile mogę na to wydać”) i prowadzi do Nawyko jako stałej, znanej z góry nagrody.
   Lista kolejnych narzędzi: `agencja/narzedzia.md` (3 pomysły do Twojej oceny).
2. **`/nawyko` — przejazd telefonu na telefonie (390) też sterowany przewijaniem**, nie zegarem (wcześniej tylko desktop).
   Przejazd jest dłuższy i symetryczny (łagodny start i koniec): jeden ruch kółka przesuwa telefon o ok. 25–30% drogi (było ~60%).
   Usunięte ukryte wygładzenie 0,18 s, przez które telefon „spóźniał się” za tekstem. Tekst rozdziału wchodzi już pod koniec
   przejazdu, więc nie ma pustej połowy ekranu. **Zmierzone:** nakładanie tekstu i telefonu 0 px² (390 i 1440, po dwa przejazdy kółkiem 120 px / 60 ms).
   Scena white label dostała odrobinę więcej przewijania (waga 1,1 → 1,3).
3. **`/nawyko` krócej:** 389 → 374 słowa widocznej treści poza makietami telefonów (−4%; metoda: tekst bez telefonów, wykresu i stopki).
   Uczciwie: cel −30% nie jest osiągnięty — czytelnik-kupujący cofnął dwa skróty, bo gubiły korzyść marki („You get a reason
   for the next order”) i to, kto skanuje. Większa redukcja wymaga wycięcia całych elementów (decyzja N niżej).
4. **Dowód:** `agencja/podglad/reward-r3c-390.png`, `reward-r3c-1440.png`, `nawyko-r3c-390-przejazd.mp4`, `nawyko-r3c-1440-przejazd.mp4`
   (realne tempo kółka). Recenzja niezależna: `agencja/recenzje/12-narzedzie-nagroda-i-przejazd-390.md` — 14/14 PASS; z 4 uwag
   poprawione 3 (komunikat przy marży większej niż zamówienie, ułamki na suwaku, pusta połowa ekranu), 1 czeka na Ciebie (M).
   Teksty: `13-teksty-czytelnik-nagroda.md` — 16 uwag, 15 wprowadzonych, 1 to warunek (narzędzie nic nie wysyła — sprawdzone w kodzie).
   Bramki: build OK · `tsc` OK · lint 0 błędów, 1 ostrzeżenie (jak przed) · `copy-voice` OK · `reward-model` OK · `calculator-model` OK ·
   `tool-rules` OK · `qa.js` PASS na `/nawyko`, `/lab/reward`, `/calculator`, `/lab/home` · `content-rules` PASS · `ship-compare` PASS.
   CLS w tym przebiegu niemierzony (zmiany tylko w transformacjach).
   Podgląd: stały adres gałęzi https://rafal-oleksiak-consulting-git-agencja-strona-zurychhhs-projects.vercel.app/lab/reward
   (i `/nawyko`); stan wdrożenia — w ostatniej wiadomości przebiegu.

**Runda 3, przebieg 2 (23.11, 13:14–13:30) — `/nawyko`: telefon i tekst jadą razem z przewijaniem, nic się nie nakłada; dwa przyciski w środku sceny.**
1. **Przejazd telefonu między rozdziałami sterowany przewijaniem, nie zegarem** (reguła R2): telefon przejeżdża na lewo przez
   pierwsze 30% aktu „For you” i wraca przez pierwsze 30% aktu „Under your brand”; tekst aktu wchodzi dopiero po przejeździe.
   Wcześniej (przejazd 1,1 s na zegarze) przy zwykłym tempie kółka telefon zasłaniał nagłówek „Your brand. Your colours.”
   (widać na zrzucie z przebiegu 1, „Kalmio” to przykład dowolnej wpisanej nazwy). **Zmierzone:** 60 próbek przy kółku 120 px / 60 ms przez akty 5–7 na 1440 —
   nakładanie tekstu i telefonu **0 px²**; nagłówki „Every reward…”, „See the day…”, „Your brand…” w pełni widoczne (krycie > 0,9).
   Wykres marki dosypuje kropki dopiero, gdy tekst jest już widoczny.
2. **Przycisk w środku sceny** (test 10 s: kroki 01–04 przez ~6 ekranów bez CTA): po zdrapce pod krokami pojawia się
   „Ask how your brand gets its own app”, a w scenie white label — z wpisaną nazwą: „Ask how **Kalmio** gets its own app”
   (tekst po czytelniku-kupującym: pierwsza wersja „Ask about Nawyko for your brand” stawiała w centrum nasz produkt, nie markę).
   Na telefonie (390) tylko w scenie white label — pod krokami brakuje miejsca.
3. Dowód: `agencja/podglad/nawyko-r3b-1440-przewijanie.mp4`, `nawyko-r3b-390-przewijanie.mp4` (realne tempo),
   `nawyko-r3b-1440-white-label.png`, `nawyko-r3b-1440-marka.png`. Bramki: build OK · `tsc` OK · lint 0 błędów, 1 ostrzeżenie ·
   `copy-voice` OK · `qa.js` PASS (`/nawyko`, `/lab/home`, `/calculator`) · `content-rules` PASS · `ship-compare` PASS ·
   CLS 0,0006 (390) / 0,0089 (1440). Podgląd: link „Vercel” przy commicie tego przebiegu (stały adres gałęzi niżej, w bloku przebiegu 1).

**Runda 3, przebieg 1 (wcześniejszy blok):**


**Runda 3, przebieg 1 (23.11, 12:45–13:15): zrobione wszystkie 5 punktów Twojej kolejki z 22.11 18:20.** Lokalnie:
`git checkout agencja/strona && npm ci && npm run build && npm start` → `/nawyko`, `/lab/home`, `/calculator`.
Podgląd Vercel: link „Vercel” przy commicie tego przebiegu na GitHubie (gałąź `agencja/strona`, zakładka Commits → zielony znaczek), albo stały adres gałęzi
https://rafal-oleksiak-consulting-git-agencja-strona-zurychhhs-projects.vercel.app/nawyko (i `/lab/home`, `/calculator`; może wymagać logowania do Vercela).
**Lekcja 7 — uczciwie:** z chmury nie da się go sprawdzić `curl` (proxy tej sesji blokuje domeny vercel.app — 403 po stronie proxy),
a API GitHuba nie zwraca wdrożeń dla tej gałęzi; stan wdrożenia sprawdzony przez status commita (wynik w ostatniej wiadomości przebiegu).

1. **Recenzja dyrektora kreatywnego** (`agencja/recenzje/08-dyrektor-kreatywny-test-10s.md`), streszczenie: trzy strony są
   w jednym stylu; najmocniejsze momenty to zdrapka i wielka liczba w kalkulatorze. **Wyciąć:** pusty przejazd telefonu
   w środku `/nawyko` (ok. 3 ekrany bez tekstu) → naprawione; dubel czterech kroków na `/lab/home` („Daily use, tracked…”)
   → do Twojej decyzji (I); małą nawigację scen z nazwami roboczymi → zostawiona dla klawiatury, ale z nazwami dla kupującego.
   **Wzmocnić:** zdrapkę zdaniem o korzyści marki → zrobione; kwotę pieniędzy jak w kalkulatorze także w hero `/nawyko`
   i `/lab/home` → do decyzji (J), bo wymaga liczby ze źródła; scenę „Your brand. Your colours.” wyżej, z przyciskiem → Następne.
2. **`/nawyko` wolniej:** scena 900vh → 1600vh (1400vh na telefonie), akt „For you” dłuższy (waga 1 → 1,5). Przy zwykłym
   kółku (120 px co 60 ms) każda scena zdąży się rozegrać — w tym wykres marki, którego wcześniej przy normalnym tempie nie było widać.
3. **Przejazd telefonu płaski:** bez obrotu, bez wychylenia 3D przy wejściu, bez wahnięcia; spokojny przesuw 1,1 s.
   Zmierzone: 320 próbek transformacji — zero obrotu i zero macierzy 3D.
4. **`/lab/home` — druga połowa na sceny:** luka 45 → 69 rośnie z przewijaniem, warunki, historia współpracy (wiersze wjeżdżają
   po kolei, słowo w słowo z `/`), narzędzia (puste dni się kurczą), a na końcu przypięty **finał: przewijanie odsłania
   słowo po słowie czerwone „You don't pay twice for the same customer.”** i pod nim jeden przycisk. Pod H1 jedno zdanie
   z trzema ofertami (było tylko „Consulting…”). „69” w karcie konsultingu po ok. 1 s (było ~3 s).
5. **Kalkulator — widać, że suwakiem się kręci:** uchwyt w kształcie pigułki z rowkami i strzałkami, gruby tor,
   podpowiedź „← Drag to close the gap”, która znika po pierwszym ruchu, i trzykrotne „pchnięcie” uchwytu przy wejściu
   w kadr (bez zmiany liczb; wyłączone przy ograniczonym ruchu). v3 nie budowana.

**Czego się nauczyliśmy i co zastosowaliśmy (dowód nauki, lekcje 1–8 z góry pliku):**
1. Test 10 s → recenzent przeszedł 3 strony × 2 ekrany od zera jak właściciel marki: **8 znalezisk; naprawione 6**
   (pusta scena marki, nagłówek-etykieta kroków, brak korzyści przy zdrapce, hero `/lab/home` bez trzech ofert, dwa
   przyciski na końcu `/lab/home`, kontrast podpowiedzi „Tovemi” 1,41:1 → ok. 6:1), **2 czekają na Ciebie** (I, J).
   Weryfikacja poprawek niezależnym recenzentem: `agencja/recenzje/10-weryfikacja-runda3.md` + moje zrzuty przy realnym tempie.
2. Nagłówek = wniosek, −30% słów → nagłówki przepisane na korzyść marki (lista w `teksty-do-akceptacji.md`, runda 3).
   **Słowa (widoczny tekst strony, liczone skryptem):** `/nawyko` 1226 → 721 (−41%, ale uczciwie: ok. −15% to krótsze
   teksty, reszta to tekst ukrytych ekranów w nieruchomych telefonach, które teraz rysują tylko widoczny ekran);
   `/lab/home` druga połowa ok. 258 → 203 (−21%; bez wierszy historii, których nie wolno zmieniać, −32%);
   `/calculator` 116 (bez zmian — już po skróceniu w v2). **Cel 30% w samej treści nie jest osiągnięty na `/nawyko`** — Następne.
3. Najpierw odpowiedź → kalkulator już ma wynik u góry wielką liczbą, założenia pod nią (sprawdzone na zrzucie `kalk-r3-390-suwak.png`).
4. Akcja kończy się następnym krokiem → `/lab/home` kończy się jednym przyciskiem; `/nawyko` i `/calculator` już miały jeden (potwierdzone w recenzji 08).
5. Kontrast w obu motywach → `qa.js` na 9 szerokościach bez błędów kontrastu na wszystkich 3 stronach; podpowiedź pola marki poprawiona z 1,41:1.
6. Bramka tekstów → automat `copy-voice` OK, dwa czytania czytelnika-kupującego (`09-…`, `11-…`): 16 tekstów do poprawy, wszystkie
   poprawione (jeden zostawiony świadomie: „dose” — Twoja decyzja 7); wpisy w `teksty-do-akceptacji.md`.
7. Link do podglądu → podany wyżej; `curl` z chmury zablokowany przez proxy (403 proxy, nie Vercela) — sprawdzam status commita w API.
8. Jeden push na przebieg → jeden push, na końcu.

**Dowód.** Nagrania przewijania w realnym tempie: `agencja/podglad/nawyko-r3-390-przewijanie.mp4`, `nawyko-r3-1440-przewijanie.mp4`.
Zrzuty: `labhome-r3-1440-final.png` (finał), `labhome-r3-390-hero.png`, `labhome3-{m,d}-{consulting,terms,proof,tools,finale-mid}.png`
(robione przed ostatnim skrótem tekstu), `kalk-r3-390-suwak.png`, `kalk-r3-1440-suwak.png`.
Bramki po ostatniej zmianie: build OK · `tsc` OK · lint 0 błędów, 1 ostrzeżenie (jak przed) · `copy-voice` OK · `qa.js` PASS na
`/nawyko`, `/lab/home`, `/calculator`, `/tool`, `/stop` · `content-rules` PASS · `ship-compare` PASS · `tool-rules` OK ·
`calculator-model` OK. CLS przy pełnym przewinięciu `/nawyko`: 0,0007 (390), 0,0104 (1440); `/lab/home`: 0,0005 / 0,0063.


**Przebieg 5 (22.11, jednorazowy: „jeszcze jeden set poprawek”).** Punkty 1a–1d były już zbudowane w przebiegu 4 (opis
niżej), więc ten przebieg je domknął po drugiej recenzji, głównie na telefonie (390):
- **Rozdział „For you” na telefonie:** telefon maleje do ok. 60% i odjeżdża w lewo, a tekst z wykresem marki podjeżdża
  do góry — wykres mieści się cały (wcześniej był ucięty u dołu ekranu). Pierwsza wersja tej zmiany robiła skoki
  układu (CLS 0,26); teraz idzie samymi transformacjami, CLS 0,0003 na 390 i 0,012 na 1440.
- **Oś nagród na telefonie:** zostaje oś dni + jedno zdanie; lista nagród pod osią (dublowała telefon i wychodziła
  poza kadr) jest na telefonie ukryta. Na desktopie bez zmian.
- **Klawiatura i zdrapka:** wybór „Scratch” w nawigacji scen przewozi na początek aktu, stawia fokus na przycisku
  „Scratch today's card” i wyłącza samozdrapkę, dopóki jesteś w tym akcie (sprawdzone testem w świeżej karcie).
- **Nagrania (oceniaj ruch):** `agencja/podglad/nawyko5-390-scena.mp4` (po poprawkach), `agencja/podglad/nawyko5-1440-scena.mp4`
  (scena od wejścia do końca, ok. 20 s; postój przy zdrapce, żeby było widać samozdrapanie). Zrzuty:
  `nawyko5-390-zdrapka.png` (karta w trakcie samozdrapania: ślad palca, drobiny), `nawyko5-390-nagrody.png`, `nawyko5-390-for-you.png`.
- Bramki po ostatniej zmianie: build OK · `tsc` OK · lint 0 błędów, 1 ostrzeżenie (jak przed) · `copy-voice` OK ·
  `qa.js` PASS na `/nawyko` · `content-rules` PASS. Recenzja: `agencja/recenzje/07-nawyko-podejscie-2.md` (powrót
  telefonu na 1440 — PASS; CLS na 390 i klawiatura — FAIL, oba poprawione po recenzji i zmierzone przeze mnie, bez
  trzeciego podejścia recenzenta). Teksty w tym przebiegu bez zmian (czytelnik niepotrzebny); 20 pozycji z przebiegu 4
  nadal czeka w `agencja/teksty-do-akceptacji.md`. Strony głównej i kalkulatora nie ruszałem.


**Przebieg 4 (22.11, po Twoich uwagach z 10:55): zrobione 1a–1d na `/nawyko` i pierwsza wersja nowej strony głównej
`/lab/home`. Kalkulator v3 — następny przebieg.** Lokalnie: `git checkout agencja/strona && npm ci && npm run build && npm start`.

1. **`/nawyko` — zdrapki nie da się przegapić.** Akt zdrapki jest przypięty prawie dwa razy dłużej niż inne. Jeśli
   nie zdrapiesz sam w ok. 1,5 s, karta zdrapuje się sama: kółko palca jedzie zygzakiem, sypią się drobiny, wychodzi
   „Day 9 · DONE”, a licznik skacze 8 → 9 z czerwonym „+1”. Twoje własne zdrapanie zawsze wygrywa. Przewijania nic
   nie blokuje — kto leci szybko, i tak widzi odsłoniętą kartę i skok licznika.
2. **Co proponujesz — w pierwszym zdaniu:** „An app under your brand that gives customers a reason to reorder — built
   and run for you.” To samo przy formularzu. Każdy rozdział ma czarną etykietę: **For your customer / For you / Under
   your brand**.
3. **Telefon zmienia stronę między rozdziałami:** w „For you” (widok marki, wykres) przejeżdża na lewo z lekkim
   wychyleniem, a tło rozdziału ciemnieje o ton; w „Under your brand” wraca na prawo. Tekst nowego rozdziału
   pojawia się dopiero, gdy telefon dojedzie. Na telefonie (390): przesunięcie w bok i zmniejszenie.
4. **Większy telefon, wejście z głębi** (wychylony w tył, mniejszy, prostuje się przy wejściu sceny).
5. **Teksty po czytelniku-kupującym:** trzy nagłówki przepisane, bo był „pusty” albo „żenujący” — m.in. „One phone
   is a habit. All of them are your reorder date.” → „See the day each pack really runs out.” Wszystkie nowe
   i zmienione teksty: `agencja/teksty-do-akceptacji.md` (**20 pozycji czeka na Twoje „tak/nie”**).
6. **`/lab/home` — propozycja nowej strony głównej (noindex, `/` nietknięte).** Twój nagłówek bez zmian, pod nim trzy
   karty, w których coś się dzieje: Nawyko (najszersza, telefon Tovemi liczy serię do 24 i wypełnia siatkę),
   konsulting (pasek „label 45” i czerwony „orders 69” — liczby z obecnej strony), narzędzia (puste dni między
   etykietą a zamówieniem znikają). Na 390×844 wszystkie trzy mieszczą się w pierwszym widoku. Niżej: przypięta scena
   Nawyko (dzień 1 → 24, kroki i nagrody zapalają się w swoich dniach), konsulting z ceną i historią współpracy słowo
   w słowo z `/`, narzędzia, zapytanie (bez nowego formularza — linki do `/nawyko#enquiry` i `/#enquiry`).

**Dlaczego biznesowo.** Zdrapka to moment, w którym marka rozumie produkt — teraz zobaczy go każdy, nie tylko ten,
kto się zatrzyma. Etykiety i zdanie oferty odpowiadają na „co ja proponuję” zanim padnie pytanie. `/lab/home` pokazuje,
jak strona może w 5 sekund sprzedawać trzy rzeczy zamiast jednej.

**Dowód.**
- Nagrania przewijania: `agencja/podglad/nawyko4-1440-przewijanie.mp4`, `agencja/podglad/nawyko4-390-przewijanie.mp4`.
- Zrzuty: `agencja/podglad/nawyko4-1440-scratch-b.png` (karta zdrapana, „+1”), `-scratch-c.png`, `-act4.png`, `-act5.png`
  (telefon po lewej, rozdział „For you”), `-final.png`, `nawyko4-390-scratch-b.png`;
  `agencja/podglad/labhome-1440-pierwszy-ekran.png`, `labhome-390-pierwszy-ekran.png`, `labhome-1440-nawyko.png`, `labhome-390-nawyko.png`.
- Bramki lokalnie po ostatniej zmianie: build OK · `tsc` OK · lint 0 błędów, 1 ostrzeżenie (jak przed) · `copy-voice` OK ·
  `qa.js` PASS na `/nawyko`, `/lab/home`, `/`, `/tool`, `/stop`, `/calculator` · `content-rules` PASS · `ship-compare` PASS ·
  `tool-rules` OK. Lighthouse nieuruchamiany.
- Recenzje niezależne: `agencja/recenzje/05-nawyko-zdrapka-rozdzialy.md` (8/10; niezaliczone: telefon wracający na prawo
  na chwilę zasłaniał tekst, przycisk zastępczy zdrapki nieosiągalny z klawiatury — oba poprawione, **bez drugiego
  podejścia recenzenta**); `agencja/recenzje/06-lab-home.md` (8/9; niezaliczone: na 390 narzędzia pod linią zgięcia —
  poprawione i sprawdzone zrzutem); teksty: `05-teksty-czytelnik.md`, `06-teksty-lab-home.md` (poprawki wprowadzone,
  bez drugiego czytania).
- Podgląd Vercel (commit 2195214, wdrożenie „success”): https://rafal-oleksiak-consulting-owws7jxvk-zurychhhs-projects.vercel.app/nawyko i `/lab/home` (może wymagać logowania do Vercela).

## Czeka na Rafała

- **R6'q1-A — nazwy zakładek kokpitu i teksty integracji (czytelnik-kupujący).** Kupujący uznał „Proof of results” za ryzykowne (brzmi jak efekt zdrowotny) i „Learning paths” za mylące; „Connected per brand via an adapter” brzmi jak nieznany koszt. Propozycje: „Reorder results (control group)”, „Lessons you approve”, „Adapter built for your store; scope and timing before start”. Rekomendacja: zmienić dwie nazwy zakładek (tekst, bez ruszania treści). Bez decyzji zostaje obecne brzmienie.
- **R6'q1-B — podpis dymka FAQ „Rafał”.** Kupujący: sam podpis nic nie mówi. Rekomendacja: „Rafał · builds the app”. Bez decyzji zostaje „Rafał”.
- **R6'q1-C — JSON-LD `featureList`:** trzy pełne zdania (apteka, dane zdrowotne, pomiar) zastąpiono nazwami zakładek, bo bramka jsonld liczy tylko widoczny tekst, a zakładki są ukryte. Rekomendacja: zostawić (zgodność z widocznym tekstem jest ważniejsza dla Google). 

**R6p2-B (nowe) — „Shopify is ready today” w przyszłej sekcji integracji.** Spec rundy 6 mówi „Shopify gotowy; pozostałe podłączamy w tygodniu wdrożenia”; niezależny recenzent pyta, czy to prawda dla sklepów produkcyjnych, a nie tylko sklepu pilota. Rekomendacja: potwierdź jednym słowem albo piszemy „Shopify first; every other engine is connected in your setup week”. Bez decyzji w R6' piszemy wersję ostrożną.

**R6p1-A (nowe) — kalkulator luki („What the gap between packs costs you”) zaraz pod hero `/nawyko`.** Spec rundy 6 go nie wymienia, a recenzent uznał go za dodatkową sekcję między hero a przerywnikiem „why”. Warianty: (a) zostaje, bo daje liczbę dla marki przy pierwszym ekranie; (b) wchłonąć do przerywnika „day 31” jako jedną liczbę; (c) przenieść do „Dowodu”. Rekomendacja: (b) — jedna myśl na ekran, pełny kalkulator i tak jest pod `/calculator`. Bez decyzji w przebiegu 2 robimy (b) z linkiem do `/calculator`.
**R6p1-B (nowe) — numer aktu na `/work/genactiv`: „Act N of 11” czy „Part N of 11”.** Czytelnik-kupujący woli „Part” (zwykłe słowo, nie teatr). Rekomendacja: „Part”. Bez decyzji zostaje „Act”.

**R5p1-A (nowe) — nazwa i kolor marki pamiętane w przeglądarce odwiedzającego.** Silnik marki zapisuje wpisaną nazwę i kolor w pamięci przeglądarki (nie w cookies, nic nie idzie na serwer ani do analityki), żeby `/work/genactiv` i powrót na stronę pokazywały tę samą markę. Warianty: zostawić (rekomendacja — to nie dane osobowe i nie śledzenie, więc nie wymaga zgody cookies; jedno zdanie w polityce prywatności „preferencje wyglądu zapisywane lokalnie” warto dopisać przy najbliższej zmianie polityki), albo pamiętać tylko w obrębie jednej karty. Bez decyzji: zostaje jak jest.
**R5p1-B (nowe) — nagłówek finału „Build {marka}’s app.” czy „Get {marka}’s app.”.** Czytelnik-kupujący zauważył, że „Build” może sugerować, że marka buduje sama; „Get” mówi, że dostaje gotową. Rekomendacja: „Get” (oferta to „zbudowana i prowadzona dla Ciebie”). Bez decyzji: zostaje „Build” ze specu doradcy.


- **(R4p12-A) Trzy nagłówki `/nawyko` — zastępuje R4p11-B.** Propozycje z p11 nie przeszły czytelnika-kupującego, więc nic nie zmieniliśmy. Jego nowe wersje: „Your customers tick each dose; your store earns the next-pack reorder.” (jak działa), „Your brand sets the cashback rate and reward thresholds with one slider.” (koszt programu), „Your brand's own app, on Shopify, linked to subscriptions and CRM.” (integracje). Rekomendacja: zgoda na drugą i trzecią (mówią, co marka dostaje, i pierwszy raz wprost „własna aplikacja”); pierwszą zostawić starą („tick each dose” brzmi jak obowiązek klienta). Brak decyzji = zostają obecne nagłówki.
- **(R4p12-B) Czytelnik po trzech nagłówkach: „nie wiem, że kupuję aplikację pod własną marką, ani ile kosztuje Nawyko”.** Cena i model współpracy to Twoja decyzja — nie dopisujemy. Rekomendacja: jedno zdanie oferty z formą rozliczenia (np. „wdrożenie + miesięcznie”), bez kwoty, przy formularzu — podaj formę, a wstawimy. Brak decyzji = bez zmian.

- **(R4p11-A) `/` — dwie czerwone bramki przy pierwszym pełnym pomiarze (strona bez zmian od wielu przebiegów).** (1) Płynność na 1440 przy spowolnionym procesorze: najdłuższa klatka 104–133 ms (próg 100); (2) fokus klawiatury ląduje pod przypiętym paskiem w 7 miejscach (na 390 cztery pola formularza, na 1440 „Accept/Decline/Privacy” paska cookies). `/` to eksport Claude Design, którego agencja nie przepisuje. Rekomendacja: zgoda, by agencja poprawiła (2) w warstwie pisanej ręcznie (`design-reset.css`/`DcBoot`: `scroll-padding` pod paskiem), bez dotykania projektu; (1) przekazać pętli Claude Design. Brak decyzji = zostaje jak na produkcji.
- **(R4p11-B) Nagłówki `/nawyko` pod zasadę „pierwsze dwa słowa niosą treść”.** Zmieniony tylko FAQ. Czytelnik-kupujący proponuje jeszcze m.in. „Reorders: four steps that bring customers back for the next pack.”, „Programme cost: you set the budget.”, „Built on Shopify; other tools connect per brand.”; odrzucił „Off-limits features…” i „Compliance by design…” (brzmi jak gwarancja zgodności) — pełna tabela `agencja/specs/22-a3-naglowki.md`. Rekomendacja: zgoda na trzy powyższe; H1 bez zmian. Brak decyzji = wprowadzamy je w następnym przebiegu tylko po bramce tekstów (to szlif treści w zatwierdzonym zakresie).

- **(R4p10-A) Pasek realizacji GENACTIV na telefonie.** Dziś na telefonie pasek w scenie się nie pokazuje (u góry zasłaniał nagłówek aktu), a scena to prawie cała strona — więc na iPhonie droga do formularza to nadal przewijanie. Warianty: (1) mały przycisk „Ask about a brand app” przypięty do dolnej krawędzi w scenie, bez listy rozdziałów; (2) zostawić. Rekomendacja: (1), zrobimy w następnym przebiegu po Twojej zgodzie — to nowy element na ekranie. Brak decyzji = zostaje jak jest.
- **(R4p10-B) „Ask about Nawyko” w pasku `/nawyko`.** Czytelnik-kupujący woli „Ask about a brand app” także tu (samo „Nawyko” to obca nazwa). Rekomendacja: zostawić „Ask about Nawyko” — strona jest o produkcie, a nazwa obok wersalikiem „NAWYKO” buduje markę; zmienić, jeśli wolisz jedno brzmienie na obu trasach. Brak decyzji = zostaje.

- **(R4p6-A) Link do Nawyko na `/` idzie na produkcję razem z resztą gałęzi i zmienia `scripts/ship-design.mjs`.** Zadanie cykliczne „Promotor/Claude Design”, które przenosi nowe wersje `/`, od scalenia też będzie dokładać ten link (to ten sam skrypt). Rekomendacja: zaakceptować przy wypuszczaniu podglądu; jeśli wolisz link w samym projekcie Claude Design, wpisz go tam, a skrypt sam przestanie go dokładać. Brak decyzji = link czeka w podglądzie.
- **(R4p6-B) Tekst linku: „Nawyko reorder app”.** Alternatywy czytelnika: „Repeat-purchase app”, „Habit-based loyalty”. Rekomendacja: zostawić — nazwa produktu buduje markę, słowo „reorder” mówi, po co klikać. Brak decyzji = zostaje.


- **(R4p5) Ostatnie zdanie sceny „czego nie robi”** mówi teraz „Health data never reaches ads, analytics, push or email.” — to ten sam fakt, który stoi już w scenie prywatności i FAQ (z mechaniki aplikacji). Rekomendacja: zostawić; to najmocniejsze zdanie dla działu prawnego. Brak decyzji = zostaje.
- **Przypomnienie:** decyzje R4p4-A (`/tools` w Google) i R4p4-B (link z `/tool` do `/tools`) nadal otwarte — `/tool` pozostaje jedyną trasą bez drogi do reszty narzędzi.

- **(R4p4-A) `/tools` w Google i w sitemapie?** Strona jest dziś `noindex`. Rekomendacja: zaindeksować po Twoim obejrzeniu — to naturalna strona wejścia z wyszukiwarki i z odpowiedzi AI na pytania o powracalność. Brak decyzji = strona działa tylko z nawigacji.
- **(R4p4-B) Link z `/tool` do `/tools` i wspólna nawigacja na `/tool`.** `/tool` jest dziś jedyną trasą bez drogi do pozostałych narzędzi, ale jego źródło (`tool-index.html`) prowadzi osobne zadanie cykliczne, którego agencja nie dotyka. Rekomendacja: zgoda na jeden link „All tools” w źródle `tool-index.html` (przez to zadanie albo przez agencję jednorazowo). Brak decyzji = ślepy zaułek zostaje.


- **(R4-P3) Czy podlinkować realizację GENACTIV z `/nawyko` (i później z `/`)?** Dziś `/work/genactiv` ma noindex i nie prowadzi do niej żaden link — widać ją tylko z adresu. Link z publicznej strony to w praktyce publiczna referencja prawdziwej marki. Rekomendacja: dodać „Work” w nagłówku `/nawyko` dopiero po pisemnej zgodzie GENACTIV (ten sam warunek co zdjęcie noindex); do tego czasu bez linku.
- **(R4-P3) Formularz na `/work/genactiv` mówi w pierwszej osobie („I reply personally”, zgoda „Occasional email from me…”)** — to wspólny formularz z `/nawyko`, brzmienie zgód jest Twoim tekstem prawnym. Rekomendacja: zostawić (odpowiadasz osobiście, to prawda i atut); zmienić tylko, jeśli realizacja ma mówić głosem „studia”.

- **(R4-P2) Czy nagrody za zakup działają bez zgody na dane o zdrowiu?** Dziś wiadomo tylko, że karta dnia i seria są bez tej zgody zablokowane, a żadna nagroda nie zależy od zgody na push i e-mail. Strona (FAQ 6 na `/nawyko`, akt 7 na `/work/genactiv`) mówi tylko to drugie. Rekomendacja: jeśli w aplikacji nagrody za zakup (np. darmowa dostawa, cashback) działają bez tej zgody, dopisać to jednym zdaniem — to mocny argument dla działu prawnego; do potwierdzenia przez Ciebie, nie zgadujemy.
- **(R4-P2) Oś budowy na `/work/genactiv` bez liczb.** Akt 8 pokazuje same bramki (bezpieczeństwo, testy dostępu do danych, RODO art. 9, teksty, nagrody), bo `agencja/dane/realizacja-genactiv.json` nie istnieje. Rekomendacja: dostarczyć (Ty albo doradca) 2–3 liczby z datą — np. czas od zielonego światła i liczbę testów — wtedy akt zyska „wow” z dowodem; bez nich zostaje uczciwie bez liczb.


**Nowe z rundy 4, przebieg 1:**

R4-A. **Jak mówić o stanie aplikacji GENACTIV na `/work/genactiv`?** Czytelnik-kupujący czytał pierwszą wersję („GENACTIV turned its box…”)
   jako aplikację już w sklepach. Przepisaliśmy na opis produktu bez czasu przeszłego i bez słowa „pilot” (status to Twoja decyzja).
   Rekomendacja: po zgodzie GENACTIV dopisać uczciwy stan w jednej linii (np. „Private pilot since <miesiąc>”) i — jeśli się zgodzą — jedno zdanie
   osoby z GENACTIV z imieniem i rolą; to najmocniejszy możliwy dowód bez liczb. Bez decyzji trasa zostaje w podglądzie (i tak noindex).
R4-B. **Ścieżki wiedzy (scena d): prezent jako kod.** Napisaliśmy „a gift code adds a matching product to the next order”, bo nagrody w aplikacji
   to jednorazowe kody. Potwierdź, że tak ma działać prezent na mecie ścieżki (Twoja kolejka mówiła „dołączony do następnego zamówienia”).
R4-C. **„Turn on and unlock” → „Agree and turn on”.** Twoje brzmienie z kolejki łamało zasadę 4 rubryki (słowo „unlock”). Rekomendacja: zostawić nowe.
R4-D. **JSON-LD `/nawyko` wymienia Genactiv w historii konsultingu** (opis Organization: „Fifteen years at Allegro, mBank, Booksy and Genactiv”).
   To historia współpracy, nie część o aplikacji — rekomendacja: zostawić; zmienić tylko, jeśli zasada „bez prawdziwych marek” ma obejmować też kod strony.

**Decyzje doradcy 23.11 13:50 (Rafał: „bądź samodzielny, angażuj mnie tylko tam, gdzie potrzebna jest moja decyzja”):**
I → (a) scena zostaje: Rafał ocenił górną połowę `/lab/home` jako dobrą; nie wycinamy tego, co zatwierdził.
J → (a) mini-kalkulator w hero `/nawyko` i `/lab/home`: odwiedzający wpisuje jedną liczbę, kwota liczona tym samym modelem co `/calculator`; zero liczb bez źródła. Buduj w następnym przebiegu.
**Nowe z przebiegu 6 rundy 3:**

Q (rozszerzone). **Trzy narzędzia (`/lab/reward`, `/lab/payback`, `/lab/reminder`) — wypuścić razem jako „narzędzia dla marek”?**
   Wszystkie są gotowe w podglądzie (noindex) i linkują do siebie w stopce. Rekomendacja bez zmian: (a) wypuścić razem z linkami
   z `/nawyko` i `/calculator` — trzy krótkie pytania marki (ile może kosztować nagroda, które zamówienie zwraca klienta, którego dnia
   przypomnieć) prowadzą do tej samej odpowiedzi: Nawyko. Bez decyzji zostają w podglądzie.

**Nowe z przebiegu 5 rundy 3:**

Q. **`/lab/payback` i `/lab/reward` — razem jako „narzędzia dla marek” czy osobno?** Oba są gotowe w podglądzie (noindex). Warianty:
   (a) wypuścić oba pod `/tools/payback` i `/tools/reward-cost` z linkami z `/nawyko` i `/calculator`, (b) wypuszczać po jednym po Twoim
   obejrzeniu, (c) zostawić w podglądzie. Rekomendacja: (a) — dwa krótkie pytania marki (ile mogę wydać na nagrodę, które zamówienie
   zwraca klienta) prowadzą do tej samej odpowiedzi: Nawyko. Adresy to propozycja, do wyrzucenia. Bez decyzji zostają w podglądzie.

**Nowe z przebiegu 4 rundy 3:**

O. **`/lab/home`: mini-kalkulator stoi pod kartą „Free tools”, która ma podobny pasek i link do kalkulatora.** Recenzent: częściowy dubel.
   Warianty: (a) zostawić oba, (b) w karcie „Free tools” zostawić tylko link do `/tool`, bo kalkulator jest tuż niżej, (c) bez mini-kalkulatora na `/lab/home`.
   Rekomendacja: (b) — mniej powtórzeń, nic nie znika (link do kalkulatora jest w bloku). To zmiana tego, co widzi klient, więc czeka na Ciebie.
P. **Czerwona liczba przy zysku.** Czytelnik: czerwony może czytać się jak strata. Na stronie czerwień = „zmierzona wartość” (zasada stylu,
   jak +483,310 w kalkulatorze). Rekomendacja: zostawić czerwień (spójność całej strony); zmiana koloru = zmiana palety, Twoja decyzja.

**Nowe z przebiegu 3 rundy 3:**

M. **`/lab/reward` — adres i wypuszczenie.** Narzędzie jest gotowe w podglądzie (noindex, poza sitemapą). Warianty: (a) wypuścić
   jako `/reward-calculator` z linkiem z `/nawyko` i `/calculator`, (b) zostawić w podglądzie do Twojej oceny, (c) wyrzucić.
   Rekomendacja: (a) po Twoim obejrzeniu — to najkrótsza droga od „ile mogę wydać na lojalność” do Nawyko. Na telefonie link
   do `/nawyko` jest tuż pod pierwszym ekranem (przy pasku cookies — niżej); dodatkowy link wyżej to zmiana układu — powiedz, jeśli chcesz.
N. **`/nawyko` −30% słów wymaga wycięcia elementów, nie skracania zdań.** Kandydaci: drugi akapit hero, lista nagród pod osią
   na desktopie (dubluje telefon), druga nota „Tovemi is a made-up demo brand” (stoi w scenie i pod nią). Rekomendacja: wyciąć
   listę nagród na desktopie i drugą notę (ok. −35 słów), hero zostawić. Bez decyzji zostaje jak jest.

**Nowe z rundy 3:**

L. **Scena „Your brand. Your colours. Your app.” wcześniej?** Recenzent: najmocniejszy moment sprzedażowy stoi na ~85%
   strony. Warianty: (a) zostaje na końcu sceny (opowieść: klient → marka → Twoja marka), (b) przenieść zaraz po zdrapce.
   Rekomendacja: (a) + przycisk z nazwą marki, który dodałem — zmiana kolejności to zmiana kierunku, więc czeka na Ciebie.

I. **`/lab/home`: wyciąć scenę „Daily use, tracked in the brand's own app.”?** Recenzent: to słabszy dubel czterech kroków
   z `/nawyko`. Warianty: (a) zostawić (górna połowa jest „OK” według Ciebie), (b) zastąpić kaflem z linkiem do `/nawyko`.
   Rekomendacja: (b) — strona główna ma sprzedać trzy rzeczy, a pokaz aplikacji robi `/nawyko` lepiej. Bez decyzji zostaje (a).
J. **Kwota pieniędzy w hero `/nawyko` i `/lab/home`** (jak „+483,310” w kalkulatorze — najbardziej zapamiętywalny element).
   Liczba musi być ze źródła albo z danych odwiedzającego. Warianty: (a) mini-kalkulator w hero (odwiedzający wpisuje jedną
   liczbę), (b) przykład z podpisem „example”, (c) bez kwoty. Rekomendacja: (a). Bez decyzji — bez kwoty.
K. **GenActiv w historii współpracy na `/lab/home`** (słowo w słowo z obecnej `/`). Recenzent zwrócił uwagę, że dane
   GenActiv są poufne w projekcie aplikacji. Na produkcji ta linia już jest. Rekomendacja: potwierdź, że nazwa może zostać.

**Z przebiegu 4:**

F. **Zamiana `/` na `/lab/home`.** `/` to dziś eksport Claude Design (mechanizm `ship-design`, prerender, `ship-compare`).
   Zamiana oznacza: `/` staje się trasą pisaną ręcznie, pętla Claude Design przestaje przenosić stronę główną, a
   `content-rules` trzeba rozszerzyć o liczby 24, 30 i 70 (dziś dozwolone tylko na podstronach). Warianty: (a) zamiana po
   Twojej akceptacji, (b) `/lab/home` zostaje szkicem dla Claude Design, (c) dopracować i wrócić. Rekomendacja: obejrzyj
   `/lab/home` i powiedz, czy kierunek jest dobry; do zamiany potrzebny jeszcze drugi wariant pierwszego ekranu.
G. **„Built and run for you”** w pierwszym zdaniu `/nawyko` obiecuje, że aplikację prowadzisz Ty, nie marka. Wziąłem to
   z Twojego opisu oferty. Rekomendacja: potwierdź jednym słowem albo zmień na „built for you”.
H. **Karta zdrapuje się sama po 1,5 s.** To decyzja kompromisowa (bez obowiązku zdrapania, ale z animacją). Jeśli wolisz
   dłużej czekać na palec odwiedzającego — 2,5 s; krócej — 1 s.

**Z przebiegu 3:**

A. **Dni nagród na osi (`/nawyko`, akt 5).** Wpisałem przykład: darmowa dostawa w dniu 7, pieczątka i kod na kolejne
   opakowanie w dniu 24, cashback przy następnym zamówieniu — z podpisem „Example” i zdaniem, że dni ustawia marka.
   Dzień 7 jest ode mnie (propozycja, do wyrzucenia). Warianty: zostawić / podać prawdziwe dni z pilotażu / oś bez dni
   poza 24. Rekomendacja: podaj prawdziwe progi, jeśli wolno je pokazać. Bez decyzji zostaje przykład.
B. **„Pack finished — 30 doses, 34 days” na telefonie (akt 6).** To ekran, którego aplikacja może dziś nie mieć;
   pokazuje, skąd marka bierze rytm zużycia. Warianty: zostawić jako ilustrację / zastąpić ekranem, który istnieje.
   Rekomendacja: potwierdź jednym słowem, czy aplikacja liczy dni do końca opakowania; jeśli nie — zmienię ekran.
C. **Wpisywana nazwa marki (akt 7 i finał).** Odwiedzający wpisuje dowolną nazwę i widzi ją na telefonie; nic nie jest
   wysyłane ani zapisywane. Ryzyko: ktoś wpisze cudzą markę i zrobi zrzut. Rekomendacja: zostawić — to najmocniejszy
   moment strony, a nazwa pochodzi od odwiedzającego, nie od nas.
D. **Kalkulator pokazuje górną granicę.** Wynik zakłada, że każdy powracający klient skróci odstęp; pod liczbą stoi
   „A ceiling, not a forecast”. Warianty: zostawić / dodać drugie pole „jaka część klientów się przesunie”.
   Rekomendacja: zostawić trzy pola (prostota), bo zdanie jest widoczne. Punkty 2–4 poniżej (stara wersja
   kalkulatora) są nieaktualne poza nazwą adresu i pytaniem, czy zapytanie ma nieść liczby.
E. **Zdanie „Colors, type and wording are settings” zniknęło**, a „The customer installs your app” też — nowy akt 7
   mówi tylko „Type a brand name and pick a skin”. Punkt 6 poniżej dotyczy już tylko cashbacku i darmowej dostawy.

**Wcześniejsze (nadal otwarte):**

1. **Limit buildów na Vercelu blokuje podgląd** (bez zmian od przebiegu 1). Warianty: (a) poczekać na reset limitu,
   (b) wyłączyć buildy podglądu dla gałęzi zadań, które pushują co godzinę, (c) plan Pro (wydatek). Rekomendacja: (b).
   Bez decyzji oglądasz stronę tylko lokalnie: `git checkout agencja/strona && npm ci && npm run build && npm start`.
2. **Kalkulator — treść do zatwierdzenia przed produkcją.** Nagłówek „What is one day between orders worth?”, przycisk
   „Talk these numbers through”. Liczby startowe (4 000 klientów, zamówienie 120, odstęp 58 dni, opakowanie 30 dni,
   6 000 nowych klientów, 22% wraca) są zmyślone i podpisane „example”. Warianty: zostawić przykład (strona żyje od
   pierwszej sekundy) albo puste pola (zero ryzyka, że ktoś weźmie przykład za normę rynkową). Rekomendacja: zostawić
   przykład z podpisem. Bez decyzji kalkulator zostaje na gałęzi.
3. **Czy zapytanie z kalkulatora ma nieść wpisane liczby?** Dziś nie niesie nic — strona obiecuje „nothing is sent”
   i to jest prawda w kodzie. Warianty: (a) tak zostaje — mocny argument zaufania, ale dostajesz zapytanie bez kontekstu;
   (b) pole wyboru „dołącz moje liczby do zapytania”, domyślnie odznaczone. Rekomendacja: (b) w następnym kroku —
   lepsza jakość rozmowy bez łamania obietnicy. Wymaga dopisania pól do `/api/lead` i maila.
4. **Nazwa i adres: `/calculator`.** Propozycja ode mnie, do wyrzucenia: alternatywy `/reorder-calculator` (lepsze dla
   wyszukiwarki) albo `/gap`. Rekomendacja: `/reorder-calculator` przed pierwszym wypuszczeniem, bo adresu potem się nie zmienia.
5. **Linki do `/nawyko` i `/calculator` ze strony głównej i z `/tool`** wymagają zmiany w Claude Design albo dokładki
   w `ship-design` (jak link do `/tool`). Rekomendacja: dokładka `data-ship-added` w nagłówku i stopce — nie rusza
   Twojego nagłówka. Dziś obie podstrony linkują do siebie nawzajem, ale z `/` nie prowadzi do nich nic poza sitemapą.
6. **Treść `/nawyko` do zatwierdzenia przed produkcją** (bez zmian): „Colors, type, wording and the reward list are
   settings, not a rebuild”, „The customer installs your app”, opis cashbacku i darmowej dostawy. Recenzent drugi raz
   wskazał cashback i „installs your app” jako niepotwierdzone. Rekomendacja: przeczytaj sekcje „Rewards”
   i „For the brand” i skreśl, co nie jest prawdą dziś.
7. **Słowo „dose” na `/nawyko`.** Strona mówi „after their dose”, a jednocześnie wymienia kawę, karmę i kosmetyki.
   Warianty: zostawić (suplementy są głównym adresatem) albo „after using the product”. Rekomendacja: „after their
   daily use” w ledzie, „dose” tylko na ekranie telefonu z suplementem. Bez decyzji zostaje „dose”.
8. **„I reply personally within 24 hours.”** Usunąłem „within 24 hours” z potwierdzenia formularza na `/nawyko`
   i `/calculator`, bo to obietnica, której nie umiem potwierdzić. Jeśli jej dotrzymujesz — jedno słowo i przywracam.
9. **Status Nawyko w ofercie** (pilotaż / gotowy produkt / cena) — bez zmian; rekomendacja: jedno uczciwe zdanie
   o pilotażu przy formularzu.
10. **Nazwa marki pokazowej „Tovemi”** — bez zmian; rejestry znaków (EUIPO/UPRP) niesprawdzone, zapas „Talmivo”.
11. **Mail potwierdzający po zapytaniu z `/nawyko` i `/calculator`** jest ten sam co ze strony głównej. Rekomendacja:
    osobne zdanie dla każdego formularza — zrobię przy nawigacji, jeśli nie masz nic przeciw.
12. **Z audytu, decyzje treściowe** (`agencja/audyt.md`): pierwszy ekran `/` nie mówi wprost „co i komu” (hasła nie
    ruszam); `/privacy` opisuje formularz, którego już nie ma; `/blog` ma stary wygląd i nic do niego nie linkuje.

## Następne (kolejka)

R6'-N1 (po R6' p1). (1) Środkowy konfigurator (krok 6 „Your branding” w scenie) → opcje stylu do konfiguratora w hero, środkowy znika (prośba Rafała 19:15) — z inwentarzem; (2) kokpit „wizualnie do poziomu finału”: przypinanie i przełączanie przewijaniem z `agencja/r6p2-odrzucone` (`Cockpit.tsx`/`cockpit-scroll.css`, 5 × 45 svh, klik = skok) — tylko na ≥ 900 px; (3) bez JS widać tylko pierwszą zakładkę — rozważyć wszystkie panele widoczne do hydratacji; (4) recenzja 43 drobne: chipy FAQ jako `radiogroup`; ukryte `<summary>` czytane drugi raz; martwe reguły `.nk-band5`, `.nk-q`; (5) decyzje R6'q1-A/B; (6) bramka „dwie sekcje w tym samym tle” nie widzi tła na opakowaniach `div` (np. `.nk-r4`) — rozszerzyć.

R6'-N0 (po R6 p2). Najpierw RUNDA 6' (sekcja na górze) z bramką inwentarza sekcji. Do wzięcia z `agencja/r6p2-odrzucone`: `Cockpit.tsx` + `cockpit-scroll.css` (przypięty kokpit przełączany przewijaniem; tor 8 × 45 svh — NN/g „Scrolljacking 101”: krótko, z postępem, klik = skok), sekcja `Store` (7 silników, schemat sklep ↔ adapter ↔ aplikacja), `Questions` (chipy + dymek, pełne odpowiedzi sr-only, FAQPage bez zmian). Uwagi recenzji 42, które dotyczą zachowanych sekcji: zakładki kokpitu na 390 bez wyraźnego sygnału przewijania; pusta dolna połowa telefonu kokpitu na 1440; dwie mechaniki pieczątki (hero „Stamp at day 24” vs finał „free pack at 3, 2 of 3”) — do wyjaśnienia; na telefonie zdanie oferty pod pierwszym ekranem. Liczba „ekrany przypiętego toru” jako bramka tempa.

R6-N1 (po R6 p1). (1) **R6 p2 wg specu 27:** dowód jako jeden pełnoszerokościowy moment w kolorze/atramencie, „Twój sklep” (Shopify gotowy; WooCommerce, Shoper, IdoSell, PrestaShop, Magento, własne API — tekstem, bez logo), pytania z pierwszej rozmowy jako chipy obok formularza (FAQPage w JSON-LD zostaje), pasek rozdziałów wg specu; (2) kalkulator luki pod hero wg decyzji R6p1-A; (3) przełączanie zakładek kokpitu przewijaniem (przypięta scena, Safari, CLS 0, `short-viewport-check`); (4) teksty z recenzji 41 (23 niewprowadzone, m.in. „Page style” → „Style · Light/Dark/Warm”, „The customer feels” → „Customer sees”, streszczenia aktów `/work/genactiv`); sprawdzić w prawdziwej aplikacji, czy seria naprawdę nie zeruje się po pominiętym dniu, zanim zostanie jakiekolwiek zdanie o „slack”; (5) recenzja 40 drobne: przykład w „Daily card” nie reaguje na suwak; pusta dolna połowa telefonów kokpitu na 1440 i pusta prawa trzecia część panelu; ActBar `/work/genactiv` chwilowo zakrywa pigułkę aktu na desktopie; wersja bez ruchu przerywnika pokazuje „Day 30 of 30” przy zdaniu o dniu 31; (6) bramka `monotonia` rozszerzona wg specu 27 (jeden konfigurator, każda zakładka z działającą kontrolką, zero jasnych telefonów, FAQ nie akordeon) jako skrypt, nie tylko krytyk.

R5-N4 (po R5 p3 cz. 1). (1) **Sekcje 4–6 po scenie „How it works”** (nagrody z suwakiem, „See the day each pack runs out”, white label) — trzy razy „tekst + telefon po prawej” na glinie; każda w innym układzie (np. histogram jako pełnoszeroki interaktywny pas dni, white label jako przejęcie w kolorze marki); (2) `#integrations` z interakcją; (3) ekran z kodem `…-NEXT-K7Q4` tylko raz przed finałem (dziś sekcje nagród, white label, `#never` i finał); (4) `scroll-perf-1440 /nawyko` wokół progu w obu buildach (A/B: stara 97–109, nowa 92–114) — `loaf-detail.mjs` na najdłuższej klatce; (5) drobne z recenzji 38: „HEALTH DATA CONSENT · OFF” łamie się na 390; (6) pozostałe z R5-N3/N2.

R5-N3 (po R5 p2 cz. 2). (0) **NAJPIERW `scroll-perf-390 /nawyko`** (nowa 119–124 ms, stara 93–113 ms w A/B dziś): zmierzyć z wyłączonym `clip-path` sześciokątów i bez pierścienia SVG (`scripts/loaf-detail.mjs`), A/B ×3 przeplatane; (1) **p3 wg bramki `monotonia` 36:** Paths / Pharmacy / Privacy — każda w innym układzie (np. poziomy pas lekcji, pełnoekranowe przejęcie w kolorze marki przy skanie pudełka, przełącznik zgody jako wielkie zdanie typograficzne); cztery sceny „How it works” na glinie — histogram dni do końca opakowania jako pełnoszeroki, interaktywny pas; `#integrations` z interakcją; ekran „Stamp earned” tylko raz przed finałem; (2) recenzja 35 drobne (martwa przestrzeń w kaflu portfela na 1440); (3) pozostałe z R5-N2 (360×740+c link „Ask how…”, skracana nazwa marki w finale na 360, kategoria produktu w silniku marki).

R5-N2 (po R5 p2). (1) **Druga część p2:** od „Cashback” w dół — prawdziwe ciemne ekrany w stylu hero/finału, każdy reaguje (przeciągnij/dotknij), żadne dwie kolejne sekcje w tym samym układzie (spec 26 „Rytm układu”); (2) bramka `monotonia` (subagent-krytyk na zrzutach 1440/390 listy sekcji) — pierwsze uruchomienie przed (1) jako punkt odniesienia, z punktem „finał = szczyt + koniec”; (3) 360×740 z paskiem cookies: link „Ask how…” w scenie ucięty o 4 px + dotyka paska postępu (stare); (4) finał: nazwa marki w nagłówku aplikacji na 360 px skracana „Ac…” przez odznakę „Sample data” — rozważyć mniejszą odznakę w wąskim telefonie; (5) kategoria produktu w silniku marki (p3); (6) recenzja 31 drobne (tekst w starych telefonach ≥ 10 px, ciemne kolory marki na ciemnym ekranie).

R5-N1 (po R5 p1). (0) **NAJPIERW: `scroll-perf-1440 /nawyko` na granicy po hero** (A/B przeplatany: stara 61–93 ms, nowa 69–139 ms; nie pulsowanie, nie samozdrapka, nie poświata — sprawdzone; kandydaci: duży cień `.nk-hphone`, warstwa SVG tarczy, przeliczenie stylu po `--red` na `.nk`; narzędzie `scripts/loaf-detail.mjs`). (1) **p2:** wielki finał `/nawyko` + przebudowa od „Cashback” w dół na prawdziwe ciemne ekrany w stylu hero (spec 26); (2) bramka `monotonia` (subagent-krytyk na liście sekcji ze zrzutami 1440/390) — pierwsze uruchomienie przed p2 jako punkt odniesienia; (3) recenzja 31 drobne: tekst w telefonach `/nawyko` ≥ 10 px (stare telefony), ciemne kolory marki na ciemnym ekranie (pierścień, folia — jasny obrys przy luminancji < 0,03), długa nazwa marki skalowana zamiast łamania; (4) kategoria produktu w silniku marki (p3); (5) z R4-N14: 390 z paskiem cookies — link „Ask how…” ucięty przy 84 % sceny.
**Najpierw RUNDA 5 (sekcja na górze, spec `26-r5-zywa-strona.md`, p1) — dopisana przez doradcę w trakcie p15, p15 jej nie ruszał.** R4-N15 (po p15, po rundzie 5). (1) **360 px szerokości: w telefonie sceny ostatni wiersz nagród („Cashback on next order”) nachodzi na dolny pasek zakładek** (`r4p15-lead-360x740-80.png`; najpewniej już przed p15 — telefon 164 px szerokości łamie wiersz na dwa; hipoteza) — `short-viewport-check` celowo nie sprawdza treści ekranu makiety; dopisać tryb „wnętrze telefonu” i poprawić. (2) Recenzja 31 D1: Tab na krok 01 nie przypina sceny (mysz przewija dalej, do y≈1989) — ujednolicić. (3) `scroll-perf-390 /nawyko` po wycofaniu zapytania kontenera 89/85 ms wobec 64–80 ms starego buildu — powtórzyć A/B ×5 (hipoteza: `calc` z `max()` w `--ph` albo szum); 360×740+c link dotyka `.nk-bar` (2 px). (4) Kolejka wiedzy pkt 14: `/nawyko` przy powiększeniu 200 % na 1280×720 (okno 640×360). (5) `webkit-check.py` ustawia okno jak dawny skrypt suwaka (Xvfb: fokus tylko pod kursorem) — przenieść okno na środek, zanim bramka zacznie sprawdzać fokus. (6) Decyzje R4p12-A/B, R4p10-A, R4p4-A/B.

R4-N14 (po p14). Z recenzji 30 (wszystkie sprzed tego przebiegu): (1) **390×844 z paskiem cookies — link „Ask how your brand gets its own app” ucięty o 21 px przy 84 % sceny** (pierwszy do poprawy; `short-viewport-check` na 390 ±cookies jako kryterium); (2) Tab na kroku „04” nie przełącza aktywnego kroku sceny (opis i telefon zostają na 01) — sprawdzić, czy fokus ma przewijać do kroku (WCAG 2.4.3, 2.4.7); (3) na 1100×620 etykiety „FOR YOUR CUSTOMER” i „HOW IT WORKS · MADE-UP BRAND” łamią się na dwa wiersze; (4) kalkulator: przy skrajnym położeniu suwaka kciuk zakrywa jeden bok obrysu fokusu; obrys fokusu niewidoczny na zrzucie WebKit 390 po strzałkach (`r4p14-b-wk-slider-keys-390.png`) — sprawdzić. (5) `short-viewport-check` dopisać do `gates.sh` (1100×620+c, 1280×720+c) dla tras ze sceną przypiętą. (6) Decyzje R4p12-A/B, R4p10-A, R4p4-A/B.

R4-N13 (po p13). (1) Lista kroków `/nawyko`: jeśli w ogóle wracać (CLS 0,0037 to szlif), to wariant z miejscem w każdym wierszu i samym zanikaniem — kryteria: `steps-stable-check` PASS, recenzent „opis przy swoim kroku”, 1280×720 z paskiem cookies i 1100×620 bez wypadania linków (recenzja 29, drobne: 1100×620 problem już dziś). (2) `gates.sh`: zmienna `GATES_LOGDIR` (dwóch budujących nadpisuje `/tmp/gates/`); selftesty powinny wołać parsowanie z `gates.sh`, nie kopię; różne porty selftestów. (3) Kontener bywa bez `WebKitWebDriver` — `gates.sh` mógłby sam podać polecenie instalacji. (4) Decyzje R4p12-A/B, R4p10-A, R4p4-A/B.

R4-N12 (po p12). (1) `scroll-perf` daje FAIL na niezmienionym kodzie (390: 119–181 ms przy tym samym buildzie) — bramka mierzy jedną najdłuższą klatkę z jednego przebiegu; hipoteza: potrzebna mediana z 3 przebiegów i rozgrzewka po starcie serwera — najpierw zmierzyć rozrzut ×10 na stałym buildzie. (2) Lista kroków `/nawyko` na 1440 (0,0034): jedyna uczciwa droga to stała wysokość wiersza kroku (opisy nieaktywne niewidoczne, ale z miejscem) — sprawdzić na makiecie, czy przerwy między krokami nie psują wyglądu; weryfikacja klatka po klatce, nie samą miarą CLS (R19). (3) Test regresji `clsscroll` jako plik w repo (`scripts/clsscroll-selftest.sh` ze stroną-wzorcem). (4) Decyzje R4p12-A, R4p10-A.

R4-N11 (po p11). `/nawyko`: koszt renderu sceny przy zmianie aktu (React 17–31 ms + zdarzenia przejść CSS obsługiwane przez Reacta na dokumencie) — pomiar `scripts/loaf-detail.mjs`, kandydat: `memo` ekranów telefonu, które się nie zmieniają; 3 teksty w telefonie wyrównane do prawej dające mikro-CLS (`.nk-mini.is-up > span`, `.nk-goal > span`, `.nk-rwd li.is-got > span`) i `.nk-step` na 1440 (0,0037, recenzja 27 D2) — `key` jak na `/work/genactiv`; nagłówki R4p11-B (czytelnik: „Reorders: …”, „Programme cost: you set the budget.”, „Built on Shopify; …”; nie: „unlocked”, „Compliance by design”); `scripts/cls-scroll.mjs` dopisać do `gates.sh` (CLS przy przewijaniu kółkiem, nie tylko przy wejściu); na 390 pasek `/work/genactiv` prawie nigdy nie widoczny (recenzja 27 D1 — zależy od decyzji R4p10-A).

R4-N10 (po p10). Po decyzji R4p10-A: CTA przypięte do dołu w scenie `/work/genactiv` < 1100 px; `/nawyko` scroll-perf 1440: 2–4 klatki > 50 ms (p8: 0) — zmierzyć z wyłączonym MutationObserverem D2; recenzja 26 M2 (ActBar ostatni w DOM — Tab dochodzi na końcu) i M3 (CLS 0,0008–0,010 na `/work/genactiv`, źródło nieznane); `gates.sh` na `/`; przegląd nagłówków scen `/nawyko` pod zasadę 8.

R4-N9 (po p9). Pasek rozdziałów na `/work/genactiv` (akty sceny jako rozdziały + CTA) — najpierw spec; `gates.sh` na `/` i `/work/genactiv`; przegląd nagłówków scen `/nawyko` pod zasadę 8; recenzja 25 DROBNE (dwa rzędy wersalików na 1440 w scenie — rozważyć w scenie sam bieżący rozdział + CTA; fokus po skoku do rozdziału).

R4-N (po p8). `/` przy fontach > 1,5 s CLS 0,07 (zrzut odsłaniany krojem zapasowym); `scroll-perf` jako stała bramka na `/work/genactiv` i `/` (dopisać do CLAUDE.md przy okazji); kolejka wiedzy pkt 7; `/tools` i `/tool` czekają na decyzje R4p4-A/B.
R3-0. ZROBIONE w przebiegu 4 (trzy pola zamiast jednego — czytelnik odrzucił stałe 30 dni opakowania). Dalej: brzegowy przypadek — pasek cookies pojawia się, gdy pole ma już fokus (9–30 px nachodzenia, recenzja 16); `focus-obscured` dopisać do bramki w CLAUDE.md (zmiana dokumentu — przy okazji).
R3-7. ZROBIONE w przebiegu 6: `/lab/reminder` (narzędzie 7, spec 10). Dalej przy nim: przegląd nagłówków scen `/nawyko` pod zasadę 8 rubryki (pierwsze słowa niosą treść); w `/lab/reminder` drugi czytelnik po poprawkach. ZROBIONE w przebiegu 5: `/lab/payback` (narzędzie 4). Dalej: narzędzie 6 (darmowa dostawa czy rabat na kolejne opakowanie) albo przypomnienie o kolejnym opakowaniu; drugi czytelnik na `/lab/payback` (waluta przy liczbach); link z `/lab/reward` do `/lab/payback` po decyzji Q.
R3-1. (przebieg 3: zrobione −4%, dalej tylko przez wycięcie — decyzja N) `/nawyko`: −30% słów w samej treści (dziś ok. −15%): hero w `page.tsx` (drugi akapit), panele nagród i zapytania.
      Mierzyć tekst POZA makietami telefonów (nowa metoda). CTA w środku sceny — zrobione w przebiegu 2;
      przesunięcie sceny „Your brand” wyżej = zmiana kolejności opowieści → najpierw pokazać Rafałowi (decyzja L poniżej).
R3-2. ZROBIONE w przebiegu 3 (390 też według przewijania, 0 px²). ~~Treść sceny według pozycji przewijania~~ — zrobione w przebiegu 2 (desktop). Na telefonie (390) przejazd
      wciąż na zegarze (zmiana skali/pozycji) — przepiąć tak samo i zmierzyć nakładanie.
R3-3. Kalkulator: pasek cookies na pierwszym ekranie 390; uchwyt w Safari/Firefox (sprawdzić); sprawdzić, czy „pchnięcie” nie rozprasza.
R3-4. ZROBIONE (przebieg 3 narzędzie, przebieg 4 pole, przebieg 5 skoki układu 0,149 → 0,029). Zostało w `/lab/reward`: tryb ciemny (strony `.nk` nie mają ciemnego motywu — sprawdzić, czy mają mieć).
R3-6. (przebieg 6: mini-kalkulator hero zmierzony surowo — 0,0022 / 0,0083, OK) Pomiar na `/nawyko` po zmianie przejazdu (390, 1440) i kl./s na telefonie — SUROWE przesunięcia (R6), także w mini-kalkulatorze hero (przebieg 4 podał „0,0000” ślepą miarą).
R3-5. Recenzja: druga runda testu 10 s na całej drodze po R3-1.

0. **Kalkulator v3** (priorytet NAJNOWSZY, pkt 2): makieta jednego ekranu → czytelnik-kupujący na makiecie → budowa.
   Bohater = wartość jednego dnia z walutą; suwak ograniczony do dnia końca opakowania; rok klienta jako główna scena.
0b. `/nawyko`: zrobione w przebiegu 5 (powrót telefonu, klawiatura, rozdział na 390). Zostało: na 390 nawigacja aktów
   jest ukryta (Tab prowadzi przez kroki 01–04, ale nie do aktów 5–7 bez przewijania). ZROBIONE w przebiegu 6: wersja `prefers-reduced-motion`
   pokazuje zakrytą zdrapkę do zdrapania (bez samozdrapki).
0c. `/lab/home`: drugi wariant pierwszego ekranu (odważniejszy, aplikacja na pierwszym planie); w dużym telefonie
   „8” i „days” daleko od siebie; karta narzędzi na desktopie pusta pod paskiem; „69” pojawia się dopiero po ~3 s.
1. Punkt 3 priorytetu (starszy): przegląd układu całej strony — częściowo zrobiony przez `/lab/home`.
2. `/nawyko`, reszta z recenzji 03: nagranie przewijania 390 i 1440 do `agencja/podglad/`; telefon z nazwą także
   w finale na telefonie (dziś ukryty poniżej 860 px); akt 6 większy, z odczytem dnia po najechaniu; lista pod osią
   w akcie 5 dubluje telefon (zostawić oś + jedno zdanie); pasek cookies poza skórą; górna część (wejście telefonu
   z głębi, paralaksa warstw) — nietknięta w tym przebiegu; pomiar kl./s na telefonie.
3. Kalkulator: trzecie spojrzenie recenzenta na ostatnie poprawki; pierwszy ekran 390×844 z paskiem cookies; „1 orders”;
   obrys fokusu suwaka nachodzi na podpisy; komunikat przy odstępie 7 dni; Safari/Firefox.
4. Punkt 4 priorytetu: `agencja/narzedzia.md` i pierwsze nowe narzędzie.
5. Z audytu (d): `/blog` bez `try/catch`, `metadataBase`, zbędne `preconnect`.

## Lekcje

- **R29 (24.11 R6' p1):** (1) Bramka inwentarza z samymi nagłówkami przepuściła zgubienie 3 zdań w `#integrations` (zamiana listy LINKS na chipy) — przy zakazie „nic nie znika” liczą się zdania, nie sekcje: bramka porównuje teraz też `p`/`li` (≥ 12 znaków) z wzorcem zbudowanym ze stanu zatwierdzonego (osobny build `origin/agencja/strona`). (2) R28.2 powtórzone (dwie ciemne sekcje obok siebie złapał znowu recenzent) → zgodnie z zasadą „lekcja powtórzona = test”: inwentarz FAIL-uje dwie kolejne sekcje najwyższego poziomu w tym samym tle; `inventory` w `gates.sh`. (3) qa.js czyta kontrast z `background-color` — tło gradientem zawsze z `background-color` zapasowym (inaczej fałszywe 1,05:1). (4) Scroll-perf przy dwóch równoległych buildach daje FAIL z obciążenia — mierzyć po zatrzymaniu budujących.
- **R28 (24.11 R6 p2):** (1) `webkit-check.py` od R6 p1 mierzył zero telefonów (selektor `.nk-phone,.ga-phone`, a przebudowa dała `.nk-hphone/.nk-kp-phone/.nk-fz-phone`) i mówił PASS — przegapiliśmy to w p1, bo PASS nie mówi, ILE zmierzył. Złapane w p2 przy czytaniu logu. **Reguła → test:** każda bramka wypisuje liczbę zmierzonych obiektów, a zero na trasie, która je ma, = FAIL (wdrożone w `webkit-check.py`); przy zmianie nazw klas — grep po skryptach bramek. (2) Tempo przewijania (ekrany toru na jedną myśl) nie jest mierzone żadną bramką — złapał je dopiero recenzent; NN/g „Scrolljacking 101” (https://www.nngroup.com/articles/scrolljacking-101/): przejęte przewijanie ma być krótkie, z widocznym postępem i możliwością przeskoczenia → kokpit 8 × 45 svh z paskiem postępu i klikiem w zakładkę; liczba „ekrany toru” do bramki (R6-N2 pkt 8). (3) `qa.js` brał wzorzec „visually hidden” (1×1 + `clip-path:inset(50%)`) za przyciętą treść — wyjątek tylko dla dokładnie tego wzorca, bramka nie obniżona. (5) Przebieg pobrał gałąź tylko na starcie; doradca o 20:58 cofnął R6, a my scalaliśmy i bramkowaliśmy odrzuconą wersję do 21:12. **Reguła:** `git fetch` + `git log HEAD..origin/agencja/strona` przed scaleniem budujących i przed bramkami; nowy commit doradcy = przeczytaj STATUS ponownie, zanim pójdziesz dalej. (4) Dwóch budujących w rozłącznych plikach (A: `NawykoClient/page/css`, B: `Cockpit.tsx` + nowy `cockpit-scroll.css`) — scalenie bez konfliktu, drugi raz z rzędu: powtarzać. Turbopack nie przyjmuje `node_modules` jako dowiązania do innego katalogu — w worktree `cp -al`.

- **R27 (24.11 R6 p1):** (1) niezależny recenzent zgłosił dwa „blokujące” błędy `/work/genactiv` (akty nieprzypięte, zdrapka od razu odkryta), które były wersją awaryjną dla automatów (`PIN_JS`/`navigator.webdriver` wyłącza przypinanie) — recenzja oglądała inną stronę niż klient. **Reguła (rubryka recenzji):** recenzent i nasze zrzuty „jak klient” uruchamiają Chromium z `--disable-blink-features=AutomationControlled` + `navigator.webdriver=false` (do zrobienia w p2: `scripts/human-view.mjs`), a wersję awaryjną sprawdzamy osobno. (2) Przerywnik „why” przeszedł WSZYSTKIE bramki (CLS 0, płynność, WebKit), a nie działał w sensie: licznik 1 → 30 dobiegał do końca, zanim sekcja była cała na ekranie — bramki mierzą stabilność, nie znaczenie. **Reguła:** każdy element sterowany przewijaniem = zrzut w połowie jego toru (np. `r6p1-why-mid-*`) i pytanie „czy w tej chwili widać zmianę”. (3) Dwóch budujących równolegle w osobnych worktree + scalenie: jeden konflikt (dziennik tekstów), zero w kodzie, bo podział plików był rozłączny — powtarzać.

- **R26 (24.11 R5 p3 cz. 1):** (1) nowa klasa `.nk-scan` zderzyła się z istniejącą (promień skanera w telefonie, `position:absolute`) — przycisk zakrył nagłówek; R24.2 była stosowana wybiórczo. **Reguła → skrypt w kroku budowy:** przed pierwszym buildem pętla po WSZYSTKICH nowych klasach: `git show HEAD:<css> | grep -c "\.<klasa>\b"` musi dać 0. (2) recenzent złapał stan „po” pokazany przed kliknięciem (skan) — sekcja demonstracyjna zaczyna w stanie „przed”, chyba że brak JS; **reguła rubryki:** kontrolka, której skutek jest już widoczny przed użyciem, to FAIL interaktywności. (3) ciemny kolor marki potrafi zrównać pełnoekranową sekcję marki z atramentem — każda powierzchnia „w kolorze marki” sąsiadująca z atramentem potrzebuje progu kontrastu (`contrast(kolor, #0E0F12) < 2` → sąsiad na glinie). (4) czytelnik: przy danych zdrowotnych bez „yet” i bez absolutów („Nothing else”) — dopisane do rubryki tekstów jako odrzucone. Źródło porcji wiedzy: NN/g „Cards: UI-Component Definition” (Laubheimer, 2016-11-06) — karty do przeglądania różnorodnych rzeczy, do sekwencji podobnych elementów lista; **zmiana:** pięć lekcji to `<ol>` z paskiem postępu (sekwencja), nie bento; cała karta lekcji jest jednym przyciskiem z kontrastowym tłem jako sygnałem klikalności.
- **R25 (24.11 R5 p2 cz. 2):** (1) cztery sceny w „How it works” w tym samym układzie na tym samym tle stały pod rząd od rundy 4 — nie zauważyliśmy, bo każda recenzja oceniała zmienioną sekcję, nigdy sekwencję. **Reguła → bramka:** `monotonia` (krytyk-subagent na całej stronie, raport `agencja/recenzje/NN-monotonia-*.md`) po każdym przebiegu rundy 5, wynik w „Dla Rafała”. (2) tekst tylko dla czytnika ekranu (`clip` 1×1 px) `qa.js` liczy jako przycięcie (36 FAIL) — **reguła:** opis dla czytnika na rodzicu (`role="img"` + `aria-label`), nie ukryty `<span>`. (3) zmiana nagłówka `h2` na `/nawyko` = zmiana `FEATURES` w `content.ts` (JSON-LD musi być widocznym tekstem) — złapała bramka `jsonld`. (4) `pkill -f "next start"` nie zabija `next-server`; zrzuty poszły ze starego serwera bez CSS — **reguła:** `pgrep -f next-server | xargs kill`, potem `curl … | grep <nowy tekst>` przed zrzutami. (5) R24.2 zadziałało: `grep` przed nową klasą złapał zderzenie `.nk-wal`. Źródło porcji wiedzy: LogRocket „Bento grids UX” (2025-01-24) — słabe (samouczek Figmy); jedyna reguła: mikrointerakcje przy kaflach — u nas każda kontrolka zmienia coś obok siebie.
- **R24 (24.11 R5 p2):** (1) p1 napisał Rafałowi „wszystko PASS poza płynnością”, a `short-390c/1100c/1280c` były czerwone — scena „Your brand” ucięta na iPhonie z paskiem cookies; nie zauważyliśmy, bo raport pisano z pamięci, a bramka niskiego okna nie była w tabeli „Dla Rafała”. **Reguła → test:** blok „Dowód” zawiera wklejoną tabelę `PODSUMOWANIE` z `gates.sh` (każdy FAIL nazwany); przed pracą — A/B tej samej bramki na starym buildzie (`git worktree` + kopia `.next`), żeby odróżnić regres od stanu zastanego. (2) nowa klasa `.nk-wl` zderzyła się z istniejącą klasą siatki sceny i rozjechała desktop — **reguła:** przed nową klasą `grep -n "\.<nazwa>\b"` w CSS trasy. (3) „otwieranie” aplikacji przez `transform:scale` na rodzicu płótna zdrapki dało płótno w rozdzielczości 18 % (getBoundingClientRect liczy z transformacją) — **reguła:** odsłanianie elementów z `<canvas>` przez `clip-path`/`opacity`, nigdy skalą. Źródło do finału: NN/g „The Peak–End Rule”.
- **R23 (24.11 R5 p1):** silnik marki przechodził bramkę „wpisz → sprawdź”, ale recenzent zobaczył, że POWRACAJĄCY gość przez chwilę widzi nazwę demo — React hydratuje zawsze ze stanu serwera (`getServerSnapshot`), a stan z `localStorage` przychodzi klatkę później. Nie zauważyliśmy, bo bramka sprawdzała stan po załadowaniu, nie pierwsze klatki. **Reguła → test:** każda personalizacja z pamięci przeglądarki = osłona inline-skryptem przed pierwszym malowaniem (`visibility`, bez przesunięć) + pomiar klatka po klatce od nawigacji (0 klatek z nazwą demo). Druga: `inkOn` liczony od tła ekranu, a tekst stał na jaśniejszym kafelku (4,45:1) — **kontrast liczymy od tła, na którym tekst faktycznie stoi.** Źródło: react.dev `useSyncExternalStore` („getServerSnapshot … used during hydration”), tkdodo.eu „Avoiding Hydration Mismatches with useSyncExternalStore”.
- **R22 (24.11 R4 p15):** (1) budujący przepisał próg okna `max-height:720px` na zapytanie kontenera `max-height:720px` — kontener mierzy wnętrze (bez paddingu 18+18 px), więc realny próg wzrósł do okna 756 px i tryb zwarty chował treść na 360×740 bez paska; jego pomiar „1 px po obu stronach” zrobiono w jednostkach sceny, nie okna. Złapał recenzent. **Reguła:** próg kontenera = próg okna − padding kontenera; pomiar progu zawsze w wymiarach OKNA (± 1 px) i z paskiem cookies, i bez. (2) `gates.sh` odmawiał na dobrym serwerze, bo BUILD_ID „-lD5…” grep wziął za opcję — każde `grep` z wartością z zewnątrz: `grep -F --`. (3) Na telefonie wolimy zmniejszyć element liniowo niż schować treść progiem. (4) `container-type:size` na przypiętym, przewijanym elemencie kosztuje klatki — przeplatany A/B 4 pary pokazał 79–129 vs 64–80 ms; każde nowe zapytanie kontenera w scenie = `scroll-perf` A/B ze starym buildem przed commitem.

- **R21 (24.11 R4 p14):** scena przypięta była ucięta na każdym niskim laptopie (1100×620, 1280×720 z paskiem cookies), a 13 przebiegów tego nie zauważyło — bramki i recenzje mierzyły 390 i 1440×900, czyli wysokie okna; usterkę złapał dopiero recenzent R20 przy okazji. Druga: poprawka „skaluj od zera” (`min(stała, avh × k)`) dała skok o 61 px na progu `max-height` — złapał recenzent. **Reguła → test:** każda zmiana sceny przypiętej = `scripts/short-viewport-check.mjs` na 1100×620 i 1280×720 z paskiem cookies i bez (kod 1 = nie gotowe); każde zapytanie o rozmiar = pomiar 1 px po obu stronach progu (wartości ciągłe). Źródło: W3C „Understanding SC 1.4.10 Reflow” — treść ma działać przy małej wysokości okna (256 px dla treści przewijanej poziomo), a powiększenie 200 % na laptopie 1280×720 daje okno 640×360; strona przy < 601 px wysokości przechodzi w układ statyczny — zgodne.

- **R20 (24.11 R4 p13):** stała wysokość listy dała CLS 0 i 0 px przesunięć, ale opis odkleił się od swojego kroku (czytał się jak opis kroku 04), a slot zepchnął linki poza scenę na 1280×720 — nie zauważyliśmy, bo spec mierzył tylko ruch, nie przynależność tekstu, i nie wymieniał niskiego laptopa. **Reguła (rubryka recenzji):** każda zmiana układu = (a) „czy wiadomo, do czego należy każdy tekst” na zrzucie i (b) widoki 1280×720 i 1100×620 z paskiem cookies. Zysk poniżej 1/10 progu Google nie usprawiedliwia utraty czytelności. Druga: pomiar wydajności z jednego przebiegu to szum — mediana z 3 po rozgrzewce (Lighthouse „Score variability”), bramka z własnym testem.

- **R19 (24.11 R4 p12):** (1) „naprawa” CLS przez `key` na całej liście dała 0 w mierze, a oko widziało skok 23–54 px — CLS liczy tylko ISTNIEJĄCE elementy (web.dev „CLS”), więc nowy węzeł ukrywa przesunięcie przed miarą. **Reguła:** poprawka CLS przez ponowny montaż (`key`) dozwolona tylko dla tekstu wymienianego w miejscu, nigdy dla kontenera z sąsiadami; każda poprawka CLS = pomiar pozycji sąsiadów klatka po klatce (recenzent). Nie zauważyłem tego, bo spec kazał mierzyć tylko liczbą. (2) Nagłówki zaproponowane przez czytelnika w p11 odrzucił czytelnik w p12 — propozycja czytelnika to nie zatwierdzony tekst; **reguła:** każdy tekst przed wejściem na stronę przechodzi czytelnika w swoim brzmieniu końcowym, także ten „rekomendowany” w STATUS. (3) Builder B ubił serwer buildera A (`pkill -f next-server` bez portu), a Turbopack nie buduje z `node_modules` jako dowiązaniem — w spec dla dwóch budujących: `cp -al` zamiast `ln -s` i zabijanie tylko po porcie (`fuser -k <port>/tcp`).

- **R18 (24.11 R4 p11):** (1) poprzedni przebieg zapisał przyczynę spadku płynności „na oko” (obserwator D2) — pomiar w tym przebiegu ją obalił; **reguła:** w „Następne” przyczyna bez pomiaru ma dopisek „hipoteza”, a budujący najpierw mierzy z wyłączonym podejrzanym. (2) Mikro-CLS przy przewijaniu nie łapała żadna bramka, bo `cls-check` mierzy wejście, nie przewijanie (źródła: wyśrodkowany tekst zmieniający szerokość, gałka na `left`) → nowe `scripts/cls-scroll.mjs`; do `gates.sh` w następnym przebiegu. Z sieci (web.dev „Cumulative Layout Shift”): zmiany `transform` nie są przesunięciami układu → ruch elementów sterowanych przewijaniem tylko przez `transform`. (3) Przewinięcie wywołane fokusem omija logikę „pasek tylko przy przewijaniu w górę” — stan widoczności nie może zależeć od stanu sceny liczonego w innym rAF; twardy warunek pozycji (pierwszy ekran = nigdy).

- **R17 (24.11 R4 p10):** bramka mierzy tylko serwer z TYM buildem — `pkill -f "next start"` nie zabija `next-server`, nowy serwer nie wstaje (port zajęty), a stary podaje 500 na chunki; `gates.sh` sprawdza BUILD_ID (test regresji: fałszywy BUILD_ID → kod 2). Etykiety nawigacji czyta czytelnik-kupujący osobno od sceny — kicker działający przy nagłówku („Consent”) bywa pusty w samym pasku.

- **R16 (24.11 R4 p9):** każdy nowy element `position:fixed` = sprawdzenie na tle każdej przypiętej sceny na 390 i 1440 (pasek zasłaniał nazwę marki na telefonie w scenie, na 1440 nie). Kolejność w DOM = kolejność Tab: lista rozwijana stoi w DOM zaraz po swoim przycisku, a wygląd ustawia `order`. Stan Reacta w nasłuchu przewijania tylko przy zmianie wartości.
- **Reguła z R13–R15 (powtórzonej lekcji):** bramki puszczamy jednym poleceniem `bash scripts/gates.sh <localhost> <trasy>` — nie z pamięci.

- **R15 (test, R4 p8): wydajność sceny mierzymy z dławieniem CPU 4×, nie na szybkim serwerze.** Bez dławienia `/nawyko` wyglądała
  płynnie; przy 4× na 1440 dawała 14 klatek > 50 ms (do 131 ms). Nie zauważyliśmy, bo żadna bramka nie mierzyła płynności, a recenzje
  oglądały zrzuty. Przyczyna: zmienna CSS ustawiana przy każdym przewinięciu na korzeniu dużego poddrzewa. **Reguła → test:** zmienne
  sterowane przewijaniem ustawiamy na elemencie, który ich używa, i rejestrujemy `@property … inherits:false`; `scripts/scroll-perf.mjs`
  (wynik podaje tryb sceny) na każdej zmienionej trasie ze sceną — kod 1 przy klatce lub interakcji > 200 ms.
- R4 p8: kryterium „−30% długich klatek” było złe dla trasy, która ma ich 1–2 (`/work/genactiv`) — budujący słusznie nic nie zmienił.
  Kryteria wydajności pisać jako próg bezwzględny (np. 0 klatek > 100 ms przy 4×), nie jako procent poprawy.
- R4 p8: obrys fokusu linków z dużym paddingiem (cel dotyku) przecinał sąsiedni link — qa.js tego nie widzi, bo fokus nie jest stanem
  spoczynku. Nowy test `focus-ring` (stary build FAIL na 320/390/768). Skrypty miały na sztywno ścieżkę Chromium sprzed aktualizacji
  obrazu — wspólny `scripts/chromium-exe.cjs`.
- **R14 (R4 p7):** pomiar CLS pod `navigator.webdriver` mierzy układ statyczny, nie stronę odwiedzającego — tak przez przebieg przeszło
  0,17 na `/work/genactiv#enquiry`, ogłoszone jako 0. Ta sama przyczyna co R13 (bramka patrzyła na nie to). **Reguła → test:**
  CLS tylko przez `scripts/cls-check.mjs` (nadpisuje flagę, opcje: zgoda, opóźnienie fontów, próg; kod wyjścia 1). Każda liczba
  „0” w raporcie podaje tryb sceny, w którym ją zmierzono.
- R4 p7: dane strukturalne = widoczny tekst — test `jsonld-rules` porównuje z `innerText` (małe litery, bo `text-transform`).
  Stała importowana z pliku `'use client'` do komponentu serwerowego jest referencją, nie wartością — wspólne teksty w osobnym module.

- **R13 (test, runda 4 przebieg 6): bramka z trybem sceny musi udowodnić, że ogląda scenę.** `webkit-check.py WK_SCENE=1` na `/nawyko` brał `.nk-track` — to suwak 30 dni, nie przypięta scena — więc „PASS (także scena przypięta)” z przebiegu 5 dotyczył tylko `/work/genactiv`. Nie zauważyliśmy, bo wynik nie wypisywał rozmiaru toru względem ekranu. Poprawka: selektor `.nk-scene.is-scroll`; po niej bramka od razu złapała telefon 117 px. Przy powtórce: FAIL, gdy tor < 3 wysokości okna.
- Lead zmienił tekst linku PO pomiarze szerokości budującego → przewijanie w poziomie na 320–360 px (qa.js nie zgłosił). Każda zmiana tekstu w elemencie `flex:none` = ponowny przegląd 320–430 co kilka px (skrypt `scrollWidth`). Rozwiązanie trwałe: kontenery dokładane przez `ship-design` mogą się zawijać (`flex:0 1 auto;min-width:0`).
- Hipoteza z sieci (zapas fontu z dopasowanymi metrykami) obalona pomiarem na naszej stronie: przy wejściu z kotwicą każda różnica wysokości tekstu nad celem przesuwa widok. Naukę z sieci wdrażamy dopiero po pomiarze — dobrze, że kryterium było liczbą.


- **R12 (test, runda 4 przebieg 5): pomiar tylko na świeżym serwerze.** Po przebudowie `pkill -f "next start"` nie trafił (proces nazywa się `next-server`), nowy serwer nie wstał (port zajęty), a my mierzyliśmy stary build: fałszywe CLS 0,078 i „min-height 0” dla reguły, która była w CSS. Nie zauważyliśmy, bo log serwera nie był czytany. Zmiana: przed pomiarem `pkill -f next-server` + sprawdzenie `Ready` w logu; każdy skrypt pomiaru zaczyna od porównania `.next/BUILD_ID` z `buildId` w `__NEXT_DATA__`/nagłówku strony.
- Narzędzie kłamało przez trzy przebiegi: `webkit-check.py` na `/work/genactiv` oglądał tylko układ statyczny (WebDriver ⇒ `navigator.webdriver` ⇒ strona bez przewijania). Lekcja: każda bramka musi pokazać, CO zobaczyła (tryb sceny wypisany w wyniku), a nie tylko PASS. Dodany `WK_SCENE=1`; brak toru sceny = FAIL.
- Czytelnik-kupujący: negatywny przykład oświadczenia zdrowotnego („supports immunity”) na stronie o suplementach sam działa jak oświadczenie. Do rubryki tekstów: nawet jako zakazany przykład nie cytujemy treści oświadczeń zdrowotnych.

- **R11 (test, runda 4 przebieg 4): obietnica prywatności na stronie zbiorczej musi być prawdziwa dla KAŻDEGO narzędzia.** Budujący napisał „Nothing you type is sent”, sprawdziwszy cztery z pięciu narzędzi; recenzent znalazł `fetch('/api/label')` w `/tool`. Nie zauważyliśmy, bo bramka tekstów ocenia jasność, nie prawdziwość wobec kodu. Zmiana: w zleceniu recenzenta stały punkt „każde zdanie o danych/prywatności → grep wywołań sieci w kodzie trasy”; przy powtórce — automat w `copy-voice` (zdania „never sent/nothing is sent” tylko na trasach bez `fetch`).
- Środowisko: budujący startujący równolegle z `apt-get install webkit2gtk-driver` nie miał jeszcze sterownika WebKit — instalację kończyć PRZED startem budujących, a bramkę WebKit dla ich tras uruchamia Lead po scaleniu (tak zrobiono: PASS).

- **R10 (test, runda 4 przebieg 3): słowa zdradzające status projektu (launch, pilot, store-ready, beta, coming soon) blokuje automat `copy-voice`, z samotestem.**
  Czytelnik-kupujący drugi przebieg z rzędu złapał zdanie o statusie („store-ready build” w p2, „first read 90 days after launch” w p3), bo budujący piszą o metodzie i przy okazji o harmonogramie. Lekcja powtórzona → test: pierwsze uruchomienie znalazło 2 stare „before launch” (FAQ `/nawyko`, akt 5 realizacji), poprawione na „before the programme starts”.
- Spec pisany z pamięci zamiast z kodu podał złą wysokość sceny (780vh; prawdziwa 1600vh/1400vh) — budujący to wyłapał pomiarem. Liczby w specu (wysokości, progi) brać z `grep` w kodzie, nie z poprzednich opisów.
- Poprzednia „poprawka” (rezerwa pod pasek cookies jako padding każdej sekcji) sama była źródłem skoku przy kotwicach (+57–78 px na sekcję). Rezerwy robić raz, na kontenerze, i stałe od pierwszej klatki (`max(var(--consent-h), 72px)`).
- Cykl: dwóch budujących równolegle 6–16 min, recenzent + czytelnik równolegle ~2,5 min, poprawki tekstów samodzielnie zamiast `SendMessage` (szybciej przy samych literałach). Konflikt znów tylko w `teksty-do-akceptacji.md` — skrypt „obie strony”.

- **R9 (reguła, runda 4 przebieg 2): każde zdanie o tym, co aplikacja robi z danymi, zgodą albo nagrodami, sprawdzamy z mechaniką aplikacji, zanim trafi na stronę — a czego nie umiemy potwierdzić, nie piszemy, tylko wpisujemy do „Czeka na Rafała”.**
  Druga z rzędu runda, w której czytelnik-kupujący (nie budujący i nie recenzent wyglądu) złapał fałsz wobec mechaniki (R4 p1: kod z pudełka ≠ miejsce zakupu; R4 p2: „marka widzi rytm” sugerowało odhaczenia pojedynczego klienta, „order rewards never wait for consent” niepotwierdzone, „store-ready” zdradzał status). Lekcja powtórzona → reguła: brief dla budującego zawiera „prawdę o aplikacji” (ten sam akapit co dla czytelnika), a czytelnik idzie w tym samym kroku co recenzent, nie po nim.
- Brief z dwoma budującymi + recenzent i czytelnik równolegle + `SendMessage` z poprawkami: cały cykl 22:40–23:00 (20 min), szybciej niż w p1 (25 min). Konflikt znów tylko w `teksty-do-akceptacji.md` — scalanie skryptem (obie strony konfliktu).
- Skok układu przy wejściu adresem z kotwicą to inny pomiar niż przewijanie — recenzent go złapał, ciągłe przewijanie dawało ~0. Do bramki: mierzyć też `goto('/trasa#kotwica')`.


- **R8 (reguła, runda 4 przebieg 1): każda bramka musi udowodnić, że łapie podłożony błąd na tym kształcie kodu, na który ją puszczamy.**
  `copy-voice` czytał tylko tekst wprost w JSX; teksty realizacji GENACTIV siedzą w tablicy `COPY`, więc „OK” nic nie znaczyło (drugi raz po R6
  ślepa miara wyglądała na dowód). Teraz automat czyta też zdania w literałach, ma samotest z podłożonym „unlock” i „We built…”, a pierwsze
  uruchomienie znalazło 2 stare „unlock” na `/nawyko` i `/lab/home`. Przy nowej trasie: najpierw sprawdź, czy bramka ją w ogóle widzi.
- Tekst o funkcji produktu sprawdzaj z regułami aplikacji, nie tylko z rubryką: czytelnik złapał, że kod z pudełka nie dowodzi miejsca zakupu
  („Purchase confirmed · pharmacy” → „Pack registered · bought offline”), a nagrody to kody, nie produkt dodany do zamówienia.
- Dwóch budujących w worktree + recenzent i czytelnik w jednym kroku, potem `SendMessage` z listą poprawek do tych samych budujących
  (mają kontekst): cały cykl ~25 min. Konflikty tylko w `teksty-do-akceptacji.md` — rozwiązywane skryptem (obie sekcje dopisywane).
- React ponownie używa tego samego `<div>` przy przejściu ze statycznej wersji do sceny i to liczy się jako przesunięcie układu — klucze
  `key="still"` / `key="track"` (CLS 0,225 → 0,0003 na `/work/genactiv`).
- Chromium w tej chmurze: `/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`; skrypty Playwright puszczać spoza repo (w repo `require('playwright')` szuka innej wersji).

- **R7 (reguła, przebieg 6): każda liczba-dzień w narzędziu mówi, od czego jest liczona** („day 25 of the pack”, „day 28 after the
  order”). Budujący i recenzent wyglądu dali 8/8 PASS; dopiero czytelnik-kupujący zapytał „dzień od czego?” — bez tego wyniku nie
  da się wpisać do automatyzacji maili. Spec narzędzia ma sekcję „punkt zero” dla odbiorcy, nie tylko model.
- Subagent budujący w worktree równolegle z drugim subagentem w repo głównym (dwa w jednym kroku): ~9 min blokady na dwie niezależne
  części, zero konfliktów (różne pliki, cherry-pick). Opłaca się, gdy obie części mają rozłączne pliki i osobne porty.
- Suwak nad osią czasu musi mieć tę samą skalę co oś (środek uchwytu = dzień na osi): `margin-left: calc(dzień1% − ½ uchwytu)`,
  `width: calc((N−1)% + uchwyt)`. Recenzja zmierzyła różnicę ≤ 2 px.
- Stan „co jeśli” (suwak) po zmianie danych wraca do wyniku — inaczej opis dla czytników mówi o starym dniu.


- **R6 (reguła, przebieg 5): skoki układu przy wpisywaniu mierzymy surowo** — suma wszystkich wpisów `layout-shift` (także z
  `hadRecentInput`) na serii edycji, w tym błędnych wpisów. CLS z definicji pomija przesunięcia do 0,5 s po wpisaniu, więc „CLS 0
  przy wpisywaniu” z przebiegu 4 nic nie dowodził. Wynik każdego narzędzia: zmienne linie mają stałą wysokość (`min-height`), podpisy
  pod liczbą w osobnej linii, puste stany zajmują tyle miejsca co pełne. Liczba w raporcie = miara + to, czego ta miara nie widzi.
- Czytelnikowi-kupującemu dawać jeden spójny scenariusz liczb na listę; dwa scenariusze w jednym punkcie wyglądają na błąd rachunku.

- **R5 (reguła, przebieg 4): znalezisko recenzenta w jednym bloku → test całej strony, nie łatka bloku.** Ukryty fokus pod paskiem
  cookies w nowym bloku zamieniony w `scripts/focus-obscured.test.mjs`; test od razu znalazł starszy błąd na `/calculator`, którego
  `qa.js` i trzy rundy recenzji nie widziały. Bramka każdego kawałka: `focus-obscured` na trasach pisanych ręcznie.
- Czytelnik-kupujący łapie słowa, które w FMCG znaczą co innego („empty shelf” = brak w sklepie, nie u klienta) — każde narzędzie
  ma przejść czytelnika zanim trafi do recenzji wyglądu; stałe założenie w rachunku (30 dni) obniża zaufanie bardziej niż dodatkowe pole.

- **R4 (reguła, przebieg 3): wygładzanie `transition` na elemencie sterowanym przewijaniem to ukryty zegar** — łamie R2
  (telefon spóźniał się za tekstem: 1 142–35 603 px² nakładania). Elementy sterowane przewijaniem: `transition:none`, płynność
  z długości drogi i krzywej (smoothstep). Test: `ov.js` 0 px² + skok `--sw` na jeden ruch kółka ≤ 0,3.
- Twierdzenia podagenta o stanie produkcji („/calculator na produkcji”) sprawdzać w STATUS przed zapisem — był błąd.
- Czytelnik-kupujący łapie skróty, które gubią korzyść marki — cięcie słów bez czytelnika daje gorszy tekst; −30% trzeba
  planować jako wycinanie elementów, nie ścinanie zdań.
- Źródło (NN/g, Kohler 2024): narzędzie daje wynik bez kontaktu, obsługuje użycie „w tył”, każde pole zmienia wynik → reguła w `narzedzia.md`.

- **R3 (reguła, przebieg 2): ruch, który zmienia układ (przejazd, zamiana stron), też sterować przewijaniem** — mieszanie
  przewijania (tekst) z zegarem (telefon) dało nakładanie się przy zwykłym tempie. Test: skrypt `ov.js` (nakładanie tekstu
  i telefonu w px² przy kółku 120 px / 60 ms) — ma dawać 0.
- Przycisk ma mówić o marce odwiedzającego, nie o naszym produkcie: „Ask how <marka> gets its own app” > „Ask about Nawyko”.
- Źródło (Unbounce, O. Gardner, 2013, aktual. 2023): na długiej stronie kilka CTA dzielących opowieść na rozdziały, CTA po
  zbudowaniu argumentu — zastosowane jako przycisk po zdrapce i po white label; jedyna liczba w tekście (41%) to jeden test
  strony cenowej, więc nie traktujemy jej jako normy.

- **R1 (reguła, runda 3): recenzent i nagrania przewijają realnym kółkiem — 120 px co 60 ms.** Przebiegi 3–5 oglądały
  sceny skryptem z dużym krokiem/zwolnieniem, więc nikt z nas nie zauważył, że przy normalnym tempie efekty się nie
  rozgrywają — zauważył Rafał. Wpisane do każdego zlecenia recenzji.
- **R2 (reguła, źródło: Chrome „Scrollytelling”, 23.11): treść sceny wchodzi według pozycji przewijania, nigdy według zegara.**
  Opóźnienie 1 s na panelu „For you” dawało pustą scenę przy szybszym przewijaniu (test 10 s to złapał).
- Liczenie słów `innerText` łapie tekst ukrytych ekranów makiet — liczyć tylko widoczne (albo usunąć ukryte ekrany
  z nieruchomych makiet, jak teraz). Raportować osobno „krótszy tekst” i „mniej ukrytego DOM”.
- Recenzent z limitem wywołań przeoczył, że pole marki istnieje tylko w akcie 6 (warunkowy render) i uznał to za błąd SSR —
  w zleceniu podawać, które elementy są warunkowe.
- Subagent-budujący i recenzent w jednym kroku: ~4 min blokady przy limitach 12–14 min w zleceniu — limity działają.

- **Jeden push na przebieg.** Vercel ma limit buildów; push „na próbę” na początku i drugi z kodem to dwa buildy.
  Dostęp do zapisu sprawdzaj przez `git push --dry-run`.
- Playwright z `node_modules` repo (1.62) nie pasuje do przeglądarki w chmurze. Własne skrypty uruchamiaj spoza repo
  (globalny playwright), a `design/qa.js` z `PW_CHROMIUM=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`.
- Turbopack nie przyjmuje `node_modules` jako symlinku — osobny worktree wymaga własnego `npm ci`.
- `globals.css` daje każdemu `<section>` padding, `overflow-x:hidden` i transform (zabija `position:sticky`).
  Reset przez `.nk :where(section)` — bez `:where` reset nadpisuje własne paddingi sekcji.
- Po `npm run build` trzeba ubić proces `next-server` (nie „next start”), inaczej stary serwer podaje 500 na nowe pliki.
- `qa.js` sprawdza też okna 1440×600 i 1280×520: telefon w scenie potrzebuje minimalnej wysokości (`clamp`), a scena
  przy oknie niższym niż 600 px zostaje w układzie statycznym.
- Szary `#6E6D68` ma na tincie `#EDEAE1` tylko 4,31:1 — na tle sceny używać `#5C5B56`.
- Linki do `/` z tras pisanych ręcznie to zwykłe `<a>` (runtime strony głównej nie znosi nawigacji klienckiej);
  lint wymaga przy nich `eslint-disable-next-line @next/next/no-html-link-for-pages`.
- Subagenci uruchomieni w jednym kroku blokują do końca najdłuższego (~10 min) — budowę zaczynać przed nimi albo
  zlecać im krótsze zadania.
- `.nk p{margin:0}` ma wyższą specyficzność niż pojedyncza klasa: margines na `<p>` wymaga `.nk .klasa` albo `!important`.
- `qa.js` zgłasza jako „CLIPPED” klasyczny ukryty tekst dla czytników (1 px + overflow). Opis dla `aria-describedby`
  dawać w elemencie `hidden`, a region `aria-live` bez przycinania (opacity 0, pozycja absolutna).
- Strona pod `navigator.webdriver` zostaje statyczna — w testach sceny trzeba nadpisać tę flagę, inaczej scena się nie przypina.
- Recenzent i weryfikator źródeł w jednym kroku z budową gotową wcześniej: ~4 min blokady; drugie podejście recenzenta
  po poprawkach to kolejne ~3,5 min i znajduje rzeczy, których pierwsze nie widziało (przecinek tysięcy czytany jako ułamek).
- Pola liczbowe: „4,000” to cztery tysiące, nie cztery — separator przed dokładnie trzema cyframi traktować jako tysiące.

- `cmd && export X && (...) &` wysyła w tło CAŁĄ listę razem z `export` — zmienna nie trafia do dalszych poleceń.
  `PW_CHROMIUM` ustawiać w osobnej linii przed bramkami.
- Równoległy budujący w osobnym worktree (`git worktree add`, własny `npm ci`, własny port, zabijanie serwera po porcie,
  nie `pkill -f next-server`) działa: ~7 min na kalkulator, w tym czasie recenzent oglądał `/nawyko` na porcie 3000.
  Przeniesienie: `git checkout <gałąź> -- <ścieżki>`.
- Recenzent z limitem „8 minut” potrzebował 15 (zawieszony skrypt). Dawać twardy limit czasu na skrypt (60 s) i liczbę
  wywołań — drugi recenzent z takim limitem zmieścił się w 5 minutach.
- Elementy wstawiane na czas aktu (panel) nie mogą wypychać paska postępu: wszystko, co stałe, przypinać absolutnie
  do sceny. Kontrolki aktu istnieją w DOM tylko w swoim akcie — po skoku z nawigacji scen trzeba przenieść fokus.
- Reguła `.nk a{color:inherit}` bije pojedynczą klasę linku — kolor linku ustawiać przez `.nk a.klasa`.
- Podpis „to przykład” musi być przy samym rysunku (etykieta w rogu), nie w przypisie pod nim: przypis na telefonie
  chowa się pod paskiem cookies.

- Przebieg 4: Agent bez parametru „w tle” blokuje do końca — kolejność, która zadziałała: najpierw własna budowa
  i nagrania, potem jednym krokiem budujący w worktree + recenzent + czytelnik (blokada ~8 min), potem poprawki.
- Nagranie Playwright przy kroku 6% wysokości ekranu na stronie ~10 000 px nie mieści się w 5 min; krok 9–16% + ffmpeg
  do mp4 (1440 przeskalowane do 960) daje 0,5–1 MB na nagranie. Konwertować dopiero po zamknięciu kontekstu.
- Element z `transform` staje się blokiem zawierającym dla `position:absolute` dzieci — paski sceny przeniesione
  ze `.nk-scenehead` do `.nk-stage`, zanim kolumny zaczęły jeździć.

- Przebieg 5: zmiana `height` elementu w przypiętej scenie = CLS (0,26), nawet gdy wygląda płynnie. Zmniejszać przez
  `transform: scale` i odzyskiwać miejsce `translateY` sąsiada — treść poniżej krawędzi sceny i tak jest w DOM.
- Przebieg 5: skok z nawigacji do 60% aktu zdrapki od razu przekraczał próg samozdrapki (45%) — przy celach
  przewijania liczyć się z progami animacji.
- `content-rules --url` potrzebuje `PW_CHROMIUM` w tym samym poleceniu (inaczej szuka nieistniejącej przeglądarki).

## Decyzje podjęte samodzielnie (odwracalne)

- Przebieg 4: akty sceny mają wagi (zdrapka 1,9, white label 1,1), scena 900vh; samozdrapka po 1,5 s albo od razu
  po połowie aktu; `/lab/home` dopisany do zakresu `copy-voice` już wcześniej (`app/lab`), nie ma go w sitemapie.

- `/nawyko` jest trasą pisaną ręcznie (React + CSS), nie eksportem Claude Design — żeby dało się ją rozwijać z chmury.
- Scena sterowana postępem przewijania w JS (jeden nasłuch, `requestAnimationFrame`), nie natywnymi CSS scroll-driven
  animations: zdrapka i licznik i tak wymagają stanu w JS, a zachowanie jest identyczne we wszystkich przeglądarkach.
- Czerwień tylko jako zmierzona wartość: licznik na telefonie, znacznik dnia na osi, kropka „ten telefon” na wykresie.
- `/nawyko` dopisane do `sitemap.ts`.
- `/calculator` pisany ręcznie na stylach `/nawyko`; zero nowych bibliotek; wynik liczony tylko w przeglądarce.
- Wartości startowe kalkulatora to oznaczony przykład, nie puste pola (decyzja 2 czeka na potwierdzenie).
- Suwak odstępu jest odwrócony (w prawo = krótszy odstęp = więcej przychodu), z opisem kierunku dla czytnika.
- Usunięty `preload` nieużywanego zdjęcia 186 kB z `app/layout.tsx` (poprawka techniczna z audytu, P1-3).
- Scena `/nawyko` na desktopie przypięta od góry zamiast wyśrodkowana (mniej przesunięć układu).
- Przebieg 3: scena `/nawyko` ma 7 aktów (780vh); akt 7 pokazuje ekran nagrody z nazwą marki zamiast siatki serii;
  skóry to zmienne CSS na `.nk[data-skin]`; nota o zmyślonej marce stoi pod sceną na każdej szerokości.
- Przebieg 3: kalkulator ograniczony do odstępu 7–365 dni, suwak od połowy obecnego odstępu; przycisk rozmowy to
  `<details>` (działa bez JS). Stary model (`gapScenario`, `secondScenario`) usunięty razem z drugim scenariuszem.
