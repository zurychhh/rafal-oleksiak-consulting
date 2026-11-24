# Spec 15 — runda 4, przebieg 5 (24.11.2026 02:40)

Dwa strumienie, dwa worktree, jeden push. Wzór: spec 13 i 14. Fakty o aplikacji (R9): nagrody stałe i znane z góry, nigdy losowe;
zero twierdzeń zdrowotnych; odhaczenie = tylko „data odhaczona”, nic o objawach/celach; dane o zdrowiu nie trafiają do reklam,
analityki, push ani e-maili; nagrody nie zależą od zgody na push/e-mail; nagrody to jednorazowe kody realizowane online.

## A. `/nawyko` — (i) „What it never does” jako scena + kotwica `#enquiry` na 390
Plik: `app/nawyko/NawykoClient.tsx` (`Story` → `.nk-never`, stała `NEVER`), CSS na końcu `app/nawyko/nawyko.css`.

**(i) Scena, w której produkt coś robi (nie trzy zdania):** panel marki obok małego telefonu (albo nad nim na 390) z trzema
przełącznikami, które marka chciałaby włączyć: „Random prize draw”, „Claim: supports immunity”, „Change the reward after the card
is scratched” (brzmienie do bramki tekstów). Każdy przełącznik jest prawdziwym `<button role="switch" aria-checked="false">`;
kliknięcie pokazuje drgnięcie i przełącznik wraca do „off” z jednym zdaniem, dlaczego aplikacja tego nie zrobi (np. „Rewards are
fixed and shown before the first card.”). Telefon w tym czasie pokazuje stałą nagrodę/kartę bez zmiany. Nagłówek sceny ≤ 12 słów
(np. „Three things your team can’t switch on.”), jedno zdanie pod spodem. Ostatnie zdanie sceny: „The app stores only which days
were ticked.” zostaje.
Kryteria: działa myszą, dotykiem i klawiaturą (Space/Enter), `aria-live="polite"` dla zdania wyjaśnienia; `prefers-reduced-motion`
bez drgnięcia, pełna treść; zero przesunięć układu przy kliknięciu (miejsce na zdanie zarezerwowane); telefon w WebKit ≥ 150 px
szerokości; kontrast ≥ 4,5:1 w Paper i Night; teksty przez `copy-voice` + wpis w `teksty-do-akceptacji.md`.

**Kotwica:** `goto('/nawyko#enquiry')` na 390×844 — surowy CLS ≤ 0,05 (dziś 0,115–0,147; sekcja jedzie 92 px w górę po hydratacji).
Metoda: porównać wysokości dzieci `#enquiry`, `.nk-never`, `Faq` i stopki przed/po hydratacji (HTML z serwera vs po montażu);
rezerwa stała, raz, na kontenerze (lekcja R4 p3). Pomiar przed/po: tabela w tym pliku.

## B. `/work/genactiv` — szlif ruchu po serii zrzutów WebKit
Plik: `app/work/genactiv/GenactivClient.tsx`, `genactiv.css`.
1. Seria zrzutów całej sceny co ~8% przewinięcia w WebKit (silnik Safari, 390 i 1440) i w Chromium — znaleźć 2 najbardziej
   widoczne usterki (pusta klatka, ucięty tekst, nachodzenie, telefon poza kadrem, przeskok) i je poprawić. Opisać przed/po.
2. `prefers-reduced-motion`: cała treść widoczna, bez pustych aktów (zrzut).
3. Bez nowych tekstów poza koniecznymi; granice speca realizacji bez zmian (zero liczb, stawek, logo, zdjęć).

## Bramki (oba)
build, `tsc --noEmit`, lint (0 błędów, ≤ 1 ostrzeżenie), `copy-voice`, `qa.js --scroll` na zmienionej trasie (localhost),
`content-rules --url`, `xvfb-run -a python3 -I scripts/webkit-check.py` 390+1440 na zmienionej trasie, recenzent niezależny.

## Wykonanie A (24.11.2026)

**(i) Scena.** `Story` → nowy komponent `NeverScene` (`app/nawyko/NawykoClient.tsx`, stała `NEVER` = trzy przełączniki), układ
`nk-still` jak pozostałe sceny: panel marki (`nk-desk2`, nagłówek „{marka} · brand panel · Example” jak w `#exchange`) z trzema
`<button role="switch" aria-checked="false">`, telefon obok (nad panelem na 390) w widoku „Rewards · listed from day 1”, dzień 17 —
nagrody stałe, nic się w nim nie zmienia. Kliknięcie (mysz, dotyk, Space, Enter): gałka jedzie w prawo, drga i wraca;
`aria-checked` zostaje `false` cały czas (przełącznik naprawdę się nie włącza). Zdanie wyjaśnienia w `aria-live="polite"`,
miejsce zarezerwowane (`min-height` 3 linie, 4 linie ≤ 420 px) — wysokość sekcji przed/po kliknięciu: 1165/1165 px (390),
846/846 px (1440). `prefers-reduced-motion`: animacja `none`, treść ta sama. Stary `IntersectionObserver` sceny (`seen`) usunięty —
render serwera = render klienta. Teksty: `agencja/teksty-do-akceptacji.md`, sekcja „R4 przebieg 5”.

**Kotwica — przyczyna inna niż w hipotezie.** Wysokości dzieci `#enquiry`, `.nk-never`, FAQ i stopki z HTML-a serwera (chunki JS
zablokowane, skrypty inline działają) i po hydratacji są **identyczne** na 390 i 1440 (przed i po zmianie). Przesunięcie robi
podmiana kroju: Instrument Sans ma `font-display:swap`, więc ~190 ms po pierwszym malowaniu tekst przechodzi z kroju systemowego
na właściwy, każda sekcja nad kotwicą zmienia wysokość (np. `#how` 4340→4294, `#proof` 1473→1432 na 390), a zakotwiczenie
przewijania przesuwa treść `#enquiry`. Dowód: z zablokowanymi plikami `.woff2` CLS = 0,000 na obu szerokościach.
Rezerwa wysokości na kontenerze nic by tu nie dała (wysokości po hydratacji się nie zmieniają), więc poprawka jest u źródła:
`nawyko.css` deklaruje ten sam plik pod nazwą „NK Instrument Sans” z `font-display:optional`, `.nk` używa tej nazwy, a `page.tsx`
dokłada `preload` pliku latin. Krój jest gotowy przed pierwszym malowaniem albo (bardzo wolne łącze, pierwsza wizyta) zostaje
systemowy do końca tej wizyty — nigdy nie podmienia się w trakcie. Inne trasy bez zmian (`app/fonts.css` nietknięty).

CLS surowy (suma wszystkich `layout-shift`, także bez `hadRecentInput`), `goto('/nawyko#enquiry')`, Chromium, 3 przebiegi, `next start`:

| Szerokość | Przed | Po |
|---|---|---|
| 390×844 | 0,168 / 0,200 / 0,168 | 0,000 / 0,000 / 0,000 |
| 1440×900 | 0,106 / 0,106 / 0,106 | 0,000 / 0,000 / 0,000 |

Ryzyko do obserwacji: przy pierwszej wizycie na wolnym łączu strona może zostać w kroju systemowym (tak działa `optional`);
przy kolejnych plik jest w pamięci podręcznej.

## Wykonanie B (24.11.2026)
Metoda: seria zrzutów przypiętej sceny co 8% jej długości (14 klatek) w Chromium (390×844, 1440×900) i w WebKit
(`webkit-check.py`, 390 → okno 447×806 w WebKitGTK, 1440×862), plus klatki w połowie zmiany ekranu (postęp 1,95 / 7,95 / 9,95).
**Ważne o narzędziu:** WebDriver ustawia `navigator.webdriver`, a trasa w tym stanie pokazuje układ statyczny — dotychczasowy
`webkit-check.py` na `/work/genactiv` NIGDY nie oglądał przypiętej sceny w silniku Safari. Dodany tryb `WK_SCENE=1`: skrypt ukrywa
`navigator.webdriver`, wychodzi i wraca nawigacją kliencką (`WK_AWAY`, domyślnie `/privacy`), scena montuje się w trybie przewijania
i jest fotografowana co 8% toru (`.ga-track` / `.nk-track`); reguła FAIL bez zmian (telefon < 150 px), brak toru = FAIL.

**Usterka 1 (tylko Safari/WebKit, pierwszy ekran):** poświata za telefonem była twardym pionowym prostokątem szerokości telefonu,
a pudełko węższe niż w Chromium (przycięte do szerokości telefonu, bez bocznej ścianki). Przyczyna: `clip-path: inset(-100vh -100vw 0
-100vw)` na `.ga-phone-slot` — WebKit przycina clip-path do ramki elementu (wielokąt z punktami poza ramką też, sprawdzone).
Poprawka: slot bez clip-path; telefon w ramce `.ga-phone-clip` (60 px szerszej z każdej strony, 2× wyższej, dolna krawędź = dół
slotu) z `clip-path: inset(0)` w granicach własnej ramki, więc przycięcie jest tylko od dołu, jak było zamierzone; pudełko 2 px
niżej (bez paska telefonu pod pudełkiem przy zaokrągleniu w WebKit). Nie `overflow: hidden` — qa.js liczy to jako przycięcie.
Przed/po: `agencja/podglad/r4p5-ga-hero-wk390-przed-po.png`, `r4p5-ga-hero-wk1440-przed-po.png`; statyczny układ WebKit po:
`r4p5-ga-wk-390-0.png`, `r4p5-ga-wk-1440-0.png`.

**Usterka 2 (oba silniki, każda granica aktów):** nowy ekran wchodził przenikaniem krycia na stary, więc w połowie zmiany teksty
dwóch ekranów nakładały się w nieczytelną mieszankę (np. „Confirm purchase” na „This month 15”, „Build path” na „Health data
consent”). Poprawka: nowy ekran (nieprzezroczysty) wjeżdża od dołu transformem w ostatnich 10% poprzedniego aktu, z cieniem
krawędzi; stary znika dopiero pod pełnym nowym. Zero nakładania tekstów, tylko transform (bez CLS). Plik: `GenactivClient.tsx`
(`fin`/`fout` warstw), `.ga-layer` w `genactiv.css`. Przed/po: `r4p5-ga-zmiana-390-akt1-2-przed-po.png`,
`r4p5-ga-zmiana-390-akt7-8-przed-po.png`; po na 1440: `r4p5-ga-zmiana-1440-akt9-10-po.png`.

Serie po: `r4p5-ga-chromium-390-seria-po.png`, `r4p5-ga-chromium-1440-seria-po.png`, `r4p5-ga-wk-scena-390-seria-po.png`,
`r4p5-ga-wk-scena-1440-seria-po.png`. Interakcja w telefonie po zmianie ramki: foil zdrapki trafiany pod palcem, „Agree and turn on”
przełącza `aria-pressed` (390 i 1440).
**Reduced motion** (Playwright `reducedMotion: 'reduce'`): układ statyczny, 11 aktów, każdy z nagłówkiem (krycie 1) i telefonem
225×460 (390) / 274×560 (1440) z treścią ekranu; zrzut `r4p5-ga-reduced-390.png`.
**Surowy CLS** (Chromium, `networkidle` + 1,5 s, 3 próby, przed = commit 44b1d5c, po = ta zmiana): wejście zwykłe 0 / 0 (390 i 1440);
`#ga-t5` 0 / 0; `#enquiry` 390: 0 / 0; `#enquiry` 1440: 0,0967 / 0,0967 — bez zmian, ale istniejący problem do osobnej poprawki.
Bramki: build OK; `tsc --noEmit` OK; lint 0 błędów / 1 ostrzeżenie (jak przed); copy-voice OK (bez nowych tekstów); qa.js `--scroll`
PASS (9 szerokości); content-rules `--url` PASS; webkit-check 390 i 1440 PASS w trybie statycznym i `WK_SCENE=1`; `noindex, nofollow`
na trasie, 0× `/work` w sitemap.xml.
