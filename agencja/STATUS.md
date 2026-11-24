# Agencja — stan strony oleksiakconsulting.com

Ostatni przebieg: 24.11.2026 07:38–08:20 (runda 4, przebieg 10 — pasek rozdziałów także na `/work/genactiv` (8 rozdziałów z aktów sceny + „Ask about a brand app”), szlif paska `/nawyko` z recenzji 25 (w scenie na komputerze jeden rząd: rozdział + akt + CTA; fokus na sekcji po skoku); `gates.sh` odmawia pomiaru starego serwera). Wcześniej: 24.11.2026 06:38–06:58 (runda 4, przebieg 9 — `/nawyko` pasek rozdziałów jak na stronach produktowych Apple: bieżący rozdział, lista 7 rozdziałów i stały przycisk zapytania, pojawia się przy przewijaniu w górę; `scripts/gates.sh` — wszystkie bramki jednym poleceniem). Wcześniej: 24.11.2026 05:38–06:05 (runda 4, przebieg 8 — `/nawyko` płynniejsza scena: klatki > 50 ms przy przewijaniu na 1440 (CPU 4×) 14 → 0, na 390 3 → 1; nowa bramka `scroll-perf`; obrys fokusu linków w nagłówku `/` nie nachodzi na sąsiedni link (test `focus-ring`); skrypty Playwright same znajdują Chromium; `/work/genactiv` zmierzona — bez zmian, bo nie było czego poprawiać). Wcześniej: 24.11.2026 04:38–05:10 (runda 4, przebieg 7 — `/work/genactiv`: rezerwa pod pasek cookies tylko bez zgody i wejście z `#enquiry` bez skoku naprawdę (0,17 → 0; stary pomiar „0” był ślepy); `/` przy wolnych fontach CLS 1,0 → 0,07; `/nawyko` JSON-LD jako graf z widocznego tekstu + test). Wcześniej: 24.11.2026 03:38–04:30 (runda 4, przebieg 6 — wjazd do Nawyko z nagłówka `/` przez ship-design; `/work/genactiv#enquiry` bez skoku; `webkit-check` naprawdę ogląda scenę `/nawyko` i złapał za mały telefon na 390). Wcześniej: 24.11.2026 02:38–03:35 (runda 4, przebieg 5 — `/nawyko` scena „czego nie robi” z przełącznikami, kotwica `#enquiry` bez skoku (krój); realizacja: Safari pierwszy ekran, zmiana ekranów bez nakładania tekstów; `webkit-check` widzi przypiętą scenę). Wcześniej: 24.11.2026 01:38–02:05 (runda 4, przebieg 4 — wspólna nawigacja + `/tools` (spec 14); realizacja: `Enquiry` w osobnym module, etykieta w kolorze marki, rezerwa cookies, przenikanie ekranów). Wcześniej: 23.11.2026 23:38 – 24.11 00:10 (runda 4, przebieg 3 — `/nawyko` finał (k) z kolorem marki i stała rezerwa sceny; `/work/genactiv` akty 9–10, formularz `work`, nawigacja; R10). Wcześniej: 22:38–23:10 (R4 przebieg 2). Wcześniej: 21:38–22:20 (R4 przebieg 1). Wcześniej: 16:38–17:15 (runda 3, przebieg 6 — nowe narzędzie `/lab/reminder`, zdrapka w wersji bez ruchu na `/nawyko`, R7). Wcześniej przebieg 5 (15:38–16:10), przebieg 4 (14:38–15:00), 3 (13:38–14:05), 2 (13:14–13:30) i 1 (12:45–13:15). Gałąź: `agencja/strona` (od `claude/production` f4594c8).
Na produkcję nic nie poszło — wypuszcza wyłącznie Rafał.

**Stan rundy 3:** przebieg 1 (23.11 12:45–13:15) zrobił punkty 1–5 kolejki z 22.11 18:20; przebieg 2 (13:14–13:30) R3-2 i część R3-1; dalej „Następne”.

**PILNE 0 — ZROBIONE przez doradcę 24.11 ~00:55:** przyczyna potwierdzona w WebKit (telefon 16×403 px na 390, 20×672 na 1440 — Mac Safari też):
`max-width:100%` na `.nk-phone` (element flex z `aspect-ratio` i wysokością) kasuje w WebKit szerokość wynikającą z proporcji. Usunięte;
po poprawce 195×403 (390) i 325×672 (1440), zrzuty obejrzane. Bramka: `scripts/webkit-check.py` (instalacja w nagłówku pliku — pobranie
WebKit z Playwrighta jest tu zablokowane, działa WebKitGTK z apt). Każdy przebieg: uruchom na każdej zmienionej trasie (390 i 1440),
żaden widoczny telefon węższy niż 150 px. Nie poprawiaj tego drugi raz — sprawdź tylko, czy Twoje zmiany tego nie cofnęły.

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
