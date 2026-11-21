# Recenzja 02 — /calculator (kalkulator odstępu między zamówieniami)

Data: 2026-11-21. Recenzent niezależny (nie widział budowy). Badane: `http://localhost:3000/calculator`, Chromium przez Playwright, 1440×900 i 390×844 oraz szerokości 360/768/1024. Formularz nie był wysyłany. Zrzuty i skrypty: `/tmp/claude-0/-home-claude/38d7ec62-114a-5228-9520-f10ad094c484/scratchpad/rev-calc/`.

**Wynik: 10/11 zaliczone.** Niezaliczone: 11 (droga od wyniku do zapytania). Punkty 7 i 9 zaliczone z zastrzeżeniami (usterki 2, 4, 5, 6).

## Rubryka

| # | Kryterium | Ocena | Dowód |
|---|---|---|---|
| 1 | Oryginalność | ZALICZONE | Oś „One customer · one year” (kreska = zamówienie, czarne = dni z produktem, czerwone kreskowanie = pusta paczka) przerysowuje się przy suwaku i pokazuje mechanizm, nie samą liczbę; w 02 siatka 100 klientów. |
| 2 | Oferta w 5 s | ZALICZONE | Pierwszy ekran: „Calculator · reorder gap”, H1 „What is one day between orders worth?”, „Type four numbers from your own store”, jedno CTA; na 390 wszystko mieści się nad zgięciem. Nie mówi wprost „dla marek D2C/FMCG” — wynika z „your own store”. |
| 3 | Zero kiczu | ZALICZONE | Jedna rodzina kroju, atrament + papier, czerwień tylko jako „ran out, not reordered yet”; brak ikon, gradientów i ozdobników. |
| 4 | Płynność interakcji | ZALICZONE | Suwak: strzałki (58→40 po 5× w prawo), Home/End, przeciągnięcie myszą — wynik i oś aktualizują się w tej samej klatce; przejścia 0,16 s. |
| 5 | Brak przesunięć układu | ZALICZONE | CLS 0,003 (1440) i 0,001 (390) łącznie z animacją startową; jedyne źródła to segmenty `.gc-order` wewnątrz osi (animowane `left/width`). |
| 6 | prefers-reduced-motion | ZALICZONE | Przy emulacji `reduce` suwak stoi na 45 przez 2 s od wejścia w kadr; żaden element w `.gc` nie ma aktywnego przejścia ani animacji. |
| 7 | Klawiatura i czytnik | ZALICZONE (z zastrzeżeniami) | Tab: skip-link → nagłówek → CTA → 5 pól → suwak → 3 pola → suwak → źródła → formularz → stopka; wszędzie obrys 2 px; każde pole ma `label` i `aria-describedby`, suwak ma `aria-valuetext`. Kontrast szarego `--dim` #5C5B56 na #F7F5F0 = 6,2:1, `--ink2` = 10,2:1. Zastrzeżenia: usterki 4, 5, 6, 9. |
| 8 | Brak marek klientów | ZALICZONE | Na stronie tylko nazwy źródeł (Recharge, Ipsos/CRN, Narang i Shankar) i własny produkt Nawyko; żadnej marki klienta. |
| 9 | Liczby ze źródłem | ZALICZONE (z zastrzeżeniem) | Wartości startowe mają znacznik „example” i nagłówek „Example numbers — replace them with yours”; 26,5%/7,5%, 55%/74%, 33%/18 mies. zgodne z `kalkulator-zrodla.md` (#11, #17, #8), każda z próbą, datą, linkiem i zdaniem „What it does not say”. Sekcja założeń mówi wprost „It does not promise it”. Zastrzeżenie: usterka 2. |
| 10 | Arytmetyka | ZALICZONE | Trzy własne przypadki zgodne co do jednostki z ręcznym wyliczeniem (niżej). |
| 11 | Droga do zapytania | NIEZALICZONE | Pod wynikiem nie ma żadnego kroku; formularz jest ~3 ekrany niżej (strona ma ~6100 px na desktopie, ~7650 px na telefonie), link „Talk it through” w nagłówku nie jest przyklejony, a przed formularzem stoją dwa kafle wyprowadzające na `/tool` i `/nawyko`. |

### Arytmetyka — przypadki kontrolne (ΔP = N × AOV × 365 × (1/T1 − 1/T0))

| N | AOV | T0 | T1 | Marża | Ręcznie | Strona |
|---|---|---|---|---|---|---|
| 1 000 | 100 | 60 | 45 | 60% | 202 778; marża 121 667; rabat 15,0% | +202,778; +121,667; 15.0% |
| 2 500 | 89,90 | 75 | 50 | — | 546 892; wzrost 50,0%; rabat 33,3% | +546,892; +50.0%; 33.3% |
| 12 000 | 37,5 | 41 | 35 | 40% | 686 760; marża 274 704; rabat 5,9% | +686,760; +274,704; 5.9% |
| 02: C 3 333 | 77 | 10% | 17% | — | 17 964,87; 233 klientów (233,31 w dół) | +17,965; +233 |

Przykład startowy: 4 000 × 120 × 365 × (1/45 − 1/58) = 872 644 — zgodne.

### Pozostałe pomiary

- Przewijanie poziome: brak na 360, 390, 768, 1024, 1440 (scrollWidth = szerokość okna).
- Konsola: zero błędów i wyjątków na wszystkich przebiegach.
- Wartości brzegowe: 0, tekst, puste, `1e5`, `1.2.3` → brak wyniku + komunikat przy polu, nigdzie NaN/Infinity/undefined. Odstęp ≤ dni opakowania → suwak zablokowany, notka „There is no gap to shorten”. Odstęp > 365 → notka „More than a year between orders”.
- Pasek cookies: `position:fixed`, 57 px (desktop) / 78 px (telefon); strona rezerwuje tę wysokość na dole (`--consent-h`), stopka i przycisk „Send” nie są zasłonięte. W trakcie przewijania pasek przykrywa dolny pas treści, jak każdy pasek tego typu.

## Usterki (od najważniejszej)

1. **Brak kroku pod wynikiem (pozyskiwanie zapytań).** Miejsce: `CalculatorClient.tsx`, koniec `.gc-out` w obu kalkulatorach. Odwiedzający dostaje liczbę i nic więcej; formularz jest trzy sekcje niżej. Poprawka: pod `.gc-notes` jedna linia z linkiem do `#enquiry` („Want a second pair of eyes on this number? Talk it through”) oraz — do rozważenia — drugi link „Do not know your gap? Measure it” do `/tool`. Bez przekazywania wpisanych liczb (obietnica prywatności).

2. **Zestawienie „Want to close it? → Nawyko gives customers a reason to reorder on time” tuż pod benchmarkiem „app = 33% more often” sugeruje, że aplikacja skróci odstęp.** Miejsce: `page.tsx`, `.gc-next`, drugi kafel, bezpośrednio pod listą `REFS`. Zastrzeżenie „What it does not say: that an app shortens your gap” stoi trzy linijki wyżej, ale kafel mówi czytelnikowi coś przeciwnego. Poprawka: etykieta „Want to work on it?” i zdanie opisowe zamiast skutkowego, np. „Nawyko is a white-label habit app built around the reorder date” — bez „close” i „on time” jako rezultatu; albo przenieść kafle poniżej osobnej linii, oddzielone od źródeł.

3. **Bardzo duże wyniki rozpychają stronę w poziomie.** Miejsce: `.gc-big` (`white-space:nowrap`, stały `clamp(52px,9.2vw,128px)`). Przy 12-cyfrowych wartościach na 1440 px strona ma 2657 px szerokości; na 360 px próg jest niżej — wynik „+1,454,406,130” (2 000 000 klientów × 400) daje już 376 px. `.gc-facts dd` też pokazuje 27-cyfrowe liczby (zawijają się, ale są bez sensu). Poprawka: skalować krój do liczby znaków (np. `font-size:min(clamp(...), calc(100cqw / (0.62 * znaki)))` albo klasa `is-long` od 10 znaków) i ograniczyć pola: klienci do 9 cyfr, wartość zamówienia do 7 (dziś `maxLength=12` dla wszystkich).

4. **Ułamki są po cichu zaokrąglane, a pole pokazuje co innego niż wzór.** Miejsce: `CalculatorClient.tsx` linie 119–120 i 372. „22.6%” liczy się jako 23%; odstęp „58,5” jako 59; odstęp „0.4” daje komunikat „Needs a number above zero”, choć liczba jest powyżej zera. Poprawka: dla dni i procentów albo przyjmować tylko liczby całkowite z komunikatem „Whole days only”, albo liczyć z wartości dokładnej i zaokrąglać tylko suwak.

5. **Czytnik ekranu nie słyszy, że wartość jest przykładem.** Miejsce: `Field`, `.gc-ex`. Znacznik „example” nie jest powiązany z polem (`aria-describedby` wskazuje tylko podpowiedź), a po zmianie zostaje pusty `span` z `aria-hidden`. Poprawka: nadać znacznikowi `id` i dopisać go do `aria-describedby`, dopóki `example` jest prawdą; pusty `span` nie renderować (zachować miejsce przez `min-width`, żeby nie było przesunięcia).

6. **Komunikaty `aria-live` odzywają się bez działania użytkownika i zbyt często.** Miejsce: `.gc-sr` w obu kalkulatorach. W 01 region wypełnia się 700 ms po załadowaniu i jeszcze raz po animacji startowej — czytnik ogłasza przykładowy wynik, zanim ktokolwiek czegoś dotknął. W 02 nie ma opóźnienia: każdy krok suwaka to nowe ogłoszenie. Poprawka: w 01 ustawiać `live` dopiero po pierwszej interakcji (`userMoved`); w 02 ten sam mechanizm z opóźnieniem 700 ms.

7. **Stan „brak rezerwy” pokazuje wielkie „+0” i trzy martwe kafle.** Miejsce: `.gc-out`, gdy `notes` zawiera `no-slack` (odstęp ≤ dni opakowania). Widać „+0”, „Uplift +0.0%”, „up to 0.0%”, a właściwa informacja („There is no gap to shorten — look at the second order below”) jest drobnym tekstem na dole. Poprawka: w tym stanie zamiast liczby pokazać notkę jako główny komunikat z linkiem do `#second`.

8. **Po wpisaniu złej wartości w 01 oś i suwak zostają aktywne, a w 02 suwak pokazuje starą wartość.** Miejsce: 01 przy pustych „Customers”/„Order value” (suwak rusza osią, wynik pusty — do przyjęcia); 02 przy pustym lub >100% polu udziału: `output` dalej pokazuje „17%”, siatka rysuje 17 „added at the target” od zera. Poprawka: w 02 przy `!r0ok` pokazać „–” i pustą siatkę, jak robi to 01 dla brakującego odstępu.

9. **Kierunek suwaka „Target gap” jest odwrócony względem wartości.** Miejsce: `#gc-t1` (`value = hi + lo − t1`). Strzałka w prawo zmniejsza liczbę dni; `aria-valuetext` to ratuje, ale `aria-valuenow`/min/max dla czytnika rosną, gdy dni maleją, a Home = „dziś”, End = „dzień końca paczki”. Wizualnie etykiety końców („58 · today” / „30 · the day the pack ends”) to tłumaczą. Poprawka minimalna: dopisać w etykiecie ukryty opis „drag right to shorten”; pełna: `aria-valuemin/max/now` ustawione na faktyczne dni.

10. **Nagłówek wyniku wraca na „From the numbers you typed” dopiero po dotknięciu trzech pól, ale znaczniki „example” znikają pojedynczo.** Miejsce: `isExample`. To zachowanie jest ostrożne i poprawne, ale stan mieszany nie jest nazwany: po zmianie jednego pola nagłówek dalej mówi „Example numbers — replace them with yours”. Poprawka: w stanie mieszanym „Partly example numbers — replace the marked fields”.

11. **Pierwszy ekran nie mówi, dla kogo.** Miejsce: `.gc-hero`. „Your own store” sugeruje sklep internetowy, ale nie pada „consumables / supplements / D2C”. Poprawka: jedno słowo w etykiecie nad H1, np. „Calculator · reorder gap · for brands that sell refills”. Propozycja, do wyrzucenia.

12. **Tekst zastępczy w formularzu ma kontrast 3,2:1.** Miejsce: wspólny komponent `Enquiry` (`#nk-store`, `#nk-email`), kolor #8B8A85 na #F7F5F0. To nie kalkulator, ale jest na tej stronie. Poprawka: `--dim` (#5C5B56) dla `::placeholder`.

13. **Oś animuje `left` i `width`.** Miejsce: `.gc-order` w `calculator.css`. Daje drobne wpisy layout-shift (łącznie 0,003) i przelicza układ przy każdym kroku suwaka; przy 80 segmentach (odstęp 1–4 dni) może szarpać na słabszym telefonie. Poprawka: `transform: translateX/scaleX` albo wyłączyć przejście, gdy segmentów jest więcej niż ~30.

14. **Na telefonie jednostki „days” i „%” znikają z pól (≤420 px).** Miejsce: `@media (max-width:420px){.gc-unit{display:none}}`. Pole „Come back for a second order” zostaje z gołym „22”. Poprawka: zostawić jednostkę, a schować znacznik „example” pod polem albo skrócić go do „ex.”.

## Czego nie sprawdzono

- Prawdziwego czytnika ekranu (VoiceOver/NVDA) — tylko atrybuty i kolejność fokusu.
- Firefoksa i Safari (suwak ma osobne reguły `-moz-`; na iOS przeciąganie przy `touch-action:pan-y`).
- Wysyłki formularza (zakaz w zleceniu) i działania linków źródeł (bez wychodzenia na zewnątrz).
- Budowy produkcyjnej — badany był działający serwer lokalny.

## Podejście 2 (po poprawkach)

Data: 2026-11-21. Ten sam recenzent niezależny, build produkcyjny na `http://localhost:3000/calculator`, Chromium przez Playwright: 1440×900, 390×844 oraz 360/768/1024. Formularz nie był wysyłany (zero żądań POST w całym przebiegu). Skrypt, wyniki i zrzuty: `/tmp/claude-0/-home-claude/38d7ec62-114a-5228-9520-f10ad094c484/scratchpad/rev-calc2/` (`t.mjs`, `out.json`).

**Wynik: 11/11 zaliczone**, z zastrzeżeniami przy 9 (nowa usterka N1) i 10 (N2). **13 z 14 usterek naprawionych, 1 częściowo (nr 4).**

| # | Usterka | Stan | Dowód z działającej strony |
|---|---|---|---|
| 1 | Brak kroku pod wynikiem | NAPRAWIONA | Pod wynikiem 01 i 02 przycisk „Talk these numbers through” (`href="#enquiry"`); klik ustawia `#enquiry` 100 px (1440) / 88 px (390) od góry okna. W 01 obok zdanie „Your numbers stay here. The form sends only what you type into it.” |
| 2 | Kafel Nawyko sugeruje skutek | NAPRAWIONA | Tekst: „The app · Nawyko: a habit app with your logo on it. One scratch card a day and rewards known in advance, redeemed on the next order. A separate product — none of the figures above are about it.” Brak „close”, „on time”, brak obietnicy. |
| 3 | Duże liczby rozpychają stronę | NAPRAWIONA | 999 999 999 × 999 999 999, odstęp 365→1: `scrollWidth` = szerokość okna na 360, 390, 768, 1024, 1440; wynik 24 px (telefon) / 60 px (1440), zawija się. „+1,454,406,130”: 34 px na 390, 92 px na 1440, bez przewijania. Pola mają `maxLength=9`. Resztka: N4. |
| 4 | Ułamki po cichu zaokrąglane | CZĘŚCIOWO | Udział „22.6” liczy się dokładnie (+31,680 = 6000×120×4,4%), ale etykieta suwaka i siatka pokazują „23% · today”. Odstęp „58.5” dalej staje się 59 bez komunikatu (dopisano tylko „Whole days.” w podpowiedzi). „0.4” dalej daje „Needs a number above zero”. |
| 5 | „example” niewidoczne dla czytnika | NAPRAWIONA | `aria-describedby` pola wskazuje znacznik „example” i podpowiedź; po zmianie pola wskazuje tylko podpowiedź, znacznik pusty, szerokość 0. |
| 6 | `aria-live` odzywa się samo | NAPRAWIONA | 3,2 s po wejściu w kadr i po animacji startowej oba regiony puste (także przy `reduced-motion`). Po wpisaniu wartości, po ~0,7 s: „Reordering every 45 days instead of 60: 1,013,889 more revenue a year…”. W 02 jedno zdanie po zatrzymaniu suwaka. |
| 7 | Stan „brak rezerwy” z „+0” | NAPRAWIONA | Odstęp 30 / paczka 30 oraz 25 / 30: zamiast liczby duży tekst „Customers already reorder as fast as one order runs out, so there is no gap to shorten. Look at the second order instead.” (link `#second`), zero `.gc-big`, suwak zablokowany. |
| 8 | 02 pokazuje starą wartość przy złym udziale | NAPRAWIONA | Puste, „150”, „abc”: wyjście suwaka „–%”, suwak zablokowany, siatka pusta (0 wypełnionych pól), końce osi puste, wynik „Fill in the three fields”. Treść komunikatu przy polu: N3. |
| 9 | Odwrócony kierunek suwaka | NAPRAWIONA (wariant minimalny) | `aria-describedby` → „Right is a shorter gap.”; `aria-valuetext` „45 days between orders”. `min/max/value` dalej odwrócone względem dni — zgodnie z dopuszczoną poprawką minimalną. |
| 10 | Stan mieszany nienazwany | NAPRAWIONA | Po zmianie jednego pola: „Partly example numbers — replace the rest”; po trzech: „From the numbers you typed”. |
| 11 | Pierwszy ekran nie mówi, dla kogo | NAPRAWIONA | Etykieta: „Calculator · reorder gap · for brands people buy again”. |
| 12 | Kontrast tekstu zastępczego | NAPRAWIONA | `::placeholder` w `#nk-store` i `#nk-email` = rgb(92,91,86) (#5C5B56), 6,2:1 na #F7F5F0. |
| 13 | Oś animuje `left`/`width` | NAPRAWIONA (wariant „wyłącz przy gęstej osi”) | Przy 80 segmentach `.gc-track.is-dense`, `transition: none`. Poniżej 30 segmentów dalej `left, width`. CLS z przewijaniem całej strony: 0,002 (1440), 0,001 (390). |
| 14 | Jednostki znikają na telefonie | NAPRAWIONA | Na 390 „days” i „%” widoczne (`display:block`), znacznik „example” zmniejszony do 54 px; nic się nie nakłada. |

Arytmetyka powtórzona: 5 000 × 100, 60→45 = +1,013,889 (ręcznie 1 013 888,9); 02: 3 333 × 77, 10%→17% = +17,965 i +233. Konsola: zero błędów. Przewijanie poziome: brak na pięciu szerokościach, także w stanach skrajnych.

Zrzuty 1440×900 i 390×844 (01, 02, „Reference points”, formularz): układ równy, nic się nie nakłada ani nie urywa. Pasek cookies widoczny na zrzutach w poprzek treści to artefakt zrzutu elementu (pasek jest `fixed`), nie usterka.

### Cytaty w „Reference points” a `kalkulator-weryfikacja.md`

- **Recharge** — zgodne: 26,5% i 7,5%, „first renewals (cycles 2–3)” (tak jak zalecono), anulowania z inicjatywy subskrybenta, cykle lipiec 2025 – marzec 2026, bez liczby marek. Strona nie powtarza zastrzeżenia Recharge „This is a proxy” — do rozważenia jedno słowo.
- **Ipsos/CRN** — zgodne w całości (55%, 74%, 3 192 dorosłych, 9–14 sierpnia 2023, online).
- **Narang i Shankar** — nagłówek zgodny („one large retailer”, 33%, „than customers without it”, 18 miesięcy, bez „US”). **Zdanie pod spodem mówi więcej, niż potwierdzono** — patrz N1.

### Nowe usterki

- **N1. „One retailer, not a consumables brand, and customers who chose the app themselves” — dwa twierdzenia bez pokrycia w weryfikacji.** Miejsce: `page.tsx`, `REFS[2].p`. Plik weryfikacji nie ustala, co sprzedaje detalista, ani nie cytuje nic o samodzielnym wyborze aplikacji. Poprawka: „One retailer; the sources I opened do not say what it sells. It compares app users with non-users, not the same customers before and after.” — albo sprawdzić oba fakty w pełnym tekście artykułu i dopisać do weryfikacji.
- **N2. Przecinek jako separator tysięcy jest czytany jako ułamek.** Miejsce: `model.ts`, `parseNum`. Wpisanie „4,000” w „Customers who reorder” daje wynik +801 (liczy 4 klientów), bez komunikatu — a sama strona pokazuje wyniki z przecinkiem tysięcy („872,644”). Anglojęzyczny odbiorca wpisze tak liczbę i dostanie wynik tysiąc razy za mały. Poprawka: przecinek, po którym stoją dokładnie trzy cyfry (i każdy wielokrotny), traktować jako separator tysięcy; w polach klientów i dni ułamków nie przyjmować. (Istniało przed poprawkami, w podejściu 1 niezauważone.)
- **N3. Błędny komunikat przy polu udziału w 02.** Miejsce: `Field`, stały tekst „Needs a number above zero.” Dla „150” i dla pustego pola pokazuje się „Needs a number above zero”, choć zero jest tu poprawne, a błąd to wartość powyżej 100. Poprawka: parametr komunikatu, dla udziału „Needs a percentage from 0 to 100.”; dla dni „Needs at least one whole day.” (zamyka też resztę usterki 4).
- **N4. Skrajnie duże liczby łamią się w środku grupy cyfr i pokazują śmieci zmiennoprzecinkowe.** Miejsce: `.gc-big` (`overflow-wrap:anywhere`), `.gc-facts dd`. Na 360 i 1024: „363,999,999,272,000,000,00 / 0”; „One day shorter is worth 999,999,998,000,000,100”. Bez przewijania, ale nieczytelne. Poprawka: `maxLength` 9 dla klientów i 7 dla wartości zamówienia (jak w propozycji z podejścia 1) albo powyżej 1e12 notacja skrócona („364 quintillion” nie ma sensu — raczej komunikat „Check the inputs”).
- **N5. W stanie „brak rezerwy” znika krok do formularza.** Miejsce: `CalculatorClient.tsx`, gałąź `noSlack` — `.gc-after` jest tylko w gałęzi z wynikiem. Poprawka: zostawić przycisk „Talk these numbers through” także pod tym komunikatem. Propozycja, do wyrzucenia.
- **N6. 02 przy udziale 100% pokazuje „+0” i aktywny suwak bez zakresu (min = max = 100).** Miejsce: `SecondOrder`. Odpowiednik usterki 7 w drugim kalkulatorze. Poprawka: zablokować suwak i pokazać zdanie „Every new customer already comes back.”
- **N7 (drobne). Na 390 obrys fokusu pola dotyka znaku „%”/„days”.** Miejsce: `.gc-inp input:focus-visible{outline-offset:4px}` przy `gap:5px` z reguły `max-width:420px`. Poprawka: `outline-offset:2px` na telefonie albo `gap:8px`.

### Czego nie sprawdzono

Prawdziwego czytnika ekranu, Firefoksa i Safari, wysyłki formularza, linków źródeł w przeglądarce (komentarz w `page.tsx` słusznie każe to zrobić przed produkcją).
