# Recenzja 08: dyrektor kreatywny i test 10 sekund (właściciel marki FMCG)

Data: 2026-11-23. Recenzent niezależny, nie widział budowy. Strony lokalne: `/nawyko`, `/lab/home`, `/calculator`.
Metoda: Playwright, widoki 390x844 i 1440x900, przewijanie kółkiem 120 px co 60 ms (normalne tempo), zrzut co 1,5 wysokości ekranu, śledzenie widoczności i przezroczystości nagłówków H2 co 480 px, kontrast liczony z `getComputedStyle` (kolor tekstu złożony z tłem przodka), rozmiary fontów zebrane z całej strony.
Zrzuty: `/tmp/claude-0/rev3/` (np. `_nawyko_390_08.png` pusta scena przejścia, `_nawyko_1440_08.png` i `_nawyko_1440_09.png` samotny telefon, `_nawyko_1440_02.png` zdrapka w trakcie, `_calculator_390_00.png`, arkusze zbiorcze `sheet_n390.png`, `sheet_n1440-0.png`, `sheet_lc390-0.png`, `sheet_lc1440.png`, `sheet_gapm.png`, `sheet_gapd.png`).

## Werdykt w dwóch zdaniach
Trzy strony mówią jednym, spójnym językiem (papierowe tło, czerń, jeden czerwony akcent, groteska z mono-etykietami) i mają dwa naprawdę zapamiętywalne momenty: zdrapkę w telefonie na `/nawyko` i wielką czerwoną liczbę `+483,310` na `/calculator`. Najsłabsze jest środkowe 30% `/nawyko`: po scenie nagród telefon jedzie przez pusty ekran, nagłówek „See the day each pack really runs out.” przy normalnym tempie praktycznie się nie pokazuje, a właściciel marki przez kilka ekranów nie wie, co z tego ma jego firma ani co kliknąć.

## A. Recenzja dyrektora kreatywnego (całość)

**Spójność stylu.** Wysoka. Ta sama paleta, typografia, ramka telefonu i mono-etykiety na wszystkich trzech stronach; czerwień zarezerwowana dla liczb (23, 34, +483,310, 69) – to dobra, konsekwentna decyzja. Rozjazd: `/lab/home` jest gęsty i „redakcyjny” (kafle, tabele), `/nawyko` jest kinowy (przypięte sceny), `/calculator` jest narzędziem. To akceptowalne, ale strona główna powtarza mini-wersję sceny z `/nawyko` („Daily use, tracked in the brand’s own app.” z tymi samymi czterema krokami) – to dubel, nie zwiastun.

**Rytm i tempo ruchu.** Scena „Four steps from purchase to next order.” na 1440 trzyma ten sam nagłówek przez ok. 7 500 px (zrzuty `_nawyko_1440_01`–`_06`: sześć ekranów z identycznym tytułem). Przy normalnym kółku to ok. 4 s ciągłego kręcenia – efekty mają czas zagrać (zdrapka złapana w połowie zdrapywania na `_nawyko_1440_03.png`, siatka serii zapełnia się 14 → 24), więc spowolnienie zadziałało. Ale dla czytelnika B2B to za długo: po trzecim ekranie bez zmiany tytułu wygląda to na zacięcie. Płaski przejazd telefonu (bez obrotu) jest spokojniejszy i lepszy niż obrót – jednak po nim zostaje pustka: na 390 od ok. 8 760 do 11 640 px (ok. 3,4 ekranu) nie ma żadnego widocznego nagłówka, a na 1440 nagłówek „See the day each pack really runs out.” złapałem tylko raz, z przezroczystością 0,36 (`_nawyko_1440_08.png`: telefon „34 days” po lewej, prawa połowa pusta; `_nawyko_1440_09.png`: telefon sam na środku). Ten efekt nie ma czasu się pokazać – odwrotny problem niż w scenie kroków.

**Hierarchia.** Hero `/nawyko` czytelne (H1 + dwa przyciski + pasek 30 dni z wyróżnionym dniem 24 – świetny, cichy znak graficzny). Na 1440 tekst pomocniczy jest za mały: na stronie jest 38 elementów z fontem 8–10 px (etykiety, nawigacja kroków, podpisy w telefonie), plus wiele 11–12 px. Na monitorze opisy kroków wyglądają jak przypis. Na `/lab/home` H1 „You don’t pay twice for the same customer.” jest mocny, ale pod nim nie ma głównego przycisku – są trzy równorzędne linki tekstowe w kaflach.

**Co jest naprawdę zapamiętywalne.** (1) Zdrapka „Taken it? Scratch the card.” z „Day 9 DONE” – fizyczny gest, którego nikt inny nie pokazuje. (2) `+483,310` na `/calculator` – jedna liczba, którą właściciel marki przeniesie do prezentacji zarządu. (3) „The label says 45 days. The order data says 69.” na `/lab/home` (1440) – najlepsze zdanie całego serwisu. (4) Przełącznik marki PAPER / NIGHT / CLAY z polem nazwy.

**Co jest przeciętne.** Nagłówki-etykiety („Four steps from purchase to next order.”, „Consulting for brands built on repeat orders.”, „Reorder gap and its cost, from store data.”), siedmioelementowa nawigacja kroków z wewnętrznymi nazwami („BRAND VIEW”, „YOUR NAME”), sekcja „No random rewards. No health claims. No hidden rules.” – potrzebna, ale wizualnie płaska.

### 3 rzeczy do WYCIĘCIA
1. **`/nawyko`, przejazd telefonu po „Every reward is listed from day one.” aż do „Your brand. Your colours. Your app.”** (390: ok. 8 760–11 640 px; 1440: ok. 10 680–13 900 px) – trzy ekrany samotnego telefonu bez tekstu; skrócić do najwyżej jednego ekranu albo wyciąć, a „34 days / 30 doses ticked” przenieść jako ilustrację do sceny z kalkulatorem.
2. **`/lab/home`, sekcja „Daily use, tracked in the brand’s own app.”** – powtarza cztery kroki z `/nawyko` w gorszej wersji; zostawić jeden kafel z telefonem i przyciskiem „See it work” prowadzącym do `/nawyko`.
3. **`/nawyko` (1440), dolna nawigacja kroków „CONFIRM · SCRATCH · STREAK · REWARD · REWARDS BY DAY · BRAND VIEW · YOUR NAME”** – 7 pozycji, 9–10 px, wewnętrzne nazwy roboczych scen; konkuruje z treścią i nic nie mówi kupującemu. Zostawić sam pasek postępu.

### 3 rzeczy do WZMOCNIENIA
1. **`/nawyko`, scena kroku 02 „Scratch one card a day”** – to jest znak rozpoznawczy produktu; dopisać obok jedno zdanie korzyści dla marki (np. „Codzienny powód, by otworzyć aplikację z Twoim logo”) i zatrzymać na niej najdłużej, kosztem kroków 01 i 04.
2. **`/calculator`, liczba `+483,310`** – przenieść ten mechanizm (jedna liczba przychodu z rytmu zakupów) do hero `/nawyko` i `/lab/home`; teraz pierwsza strona nie pokazuje pieniędzy wcale.
3. **`/nawyko`, „Your brand. Your colours. Your app.”** – najbardziej sprzedażowy moment („to będzie moja aplikacja”) jest dopiero na ok. 85% strony, a pole nazwy ma placeholder „Tovemi” o kontraście 1,41:1, więc wygląda na wyłączone. Przenieść wyżej (zaraz po krokach) i wstawić widoczną, edytowalną wartość.

## B. Test 10 sekund (właściciel marki FMCG)

Kolumny: (1) wiem, co to jest / (2) wiem, co dostaje moja marka / (3) wiem, co kliknąć.

### `/nawyko` 390x844
| Pozycja / scena | 1 | 2 | 3 |
|---|---|---|---|
| 0 px hero „A habit app with your logo on it.” | tak | tak („a reason to reorder — built and run for you”) | tak (ASK ABOUT NAWYKO) |
| ~1 300 px „01 Confirm the pack” | tak | **nie** | **nie** |
| ~2 600–4 000 px „02 Scratch one card a day” | tak | **nie** | **nie** (jedyny link: „Scratch today’s card” – demo, nie decyzja) |
| ~5 300 px „03 Build the streak” | tak | **nie** | **nie** |
| ~6 600 px „04 Unlock a reward they saw coming” | tak | częściowo | **nie** |
| ~7 900 px „Every reward is listed from day one.” | tak | częściowo | **nie** |
| ~8 760–11 640 px przejazd telefonu (34 days → Stamp earned) | **nie** | **nie** | **nie** |
| ~9 240 px „See the day each pack really runs out.” | **nie** (nagłówek ledwo widoczny) | **nie** | tak, jeśli zdąży: „Check your own gap today — free” |
| ~10 500–11 900 px „Your brand. Your colours. Your app.” | tak | tak | **nie** (brak przycisku kontaktu) |
| ~12 100 px „No random rewards. No health claims. No hidden rules.” | tak | tak (bezpieczeństwo) | **nie** |
| koniec: „Would this fit your product?” + formularz | tak | tak | tak (SEND) |

### `/nawyko` 1440x900
| Pozycja / scena | 1 | 2 | 3 |
|---|---|---|---|
| 0 px hero | tak | tak | tak |
| ~1 400–8 600 px „Four steps from purchase to next order.” (6 ekranów) | tak | **nie** (tag „FOR YOUR CUSTOMER”, brak korzyści marki) | **nie** (brak CTA przez ok. 7 000 px) |
| ~9 200–10 000 px „Every reward is listed from day one.” | tak | częściowo | **nie** |
| ~10 700–13 900 px telefon sam (`_nawyko_1440_08/09.png`) | **nie** | **nie** | **nie** |
| ~14 000 px „Your brand. Your colours. Your app.” | tak | tak | **nie** |
| ~15 500 px „Would this fit your product?” | tak | tak | tak |

### `/lab/home`
| Widok / pozycja | 1 | 2 | 3 |
|---|---|---|---|
| 390, 0 px „You don’t pay twice for the same customer.” | **nie** (aplikacja czy konsulting? – trzy oferty naraz) | **nie** | **nie** (brak głównego przycisku; tylko linki w kaflach) |
| 390, ~1 300 px „Daily use, tracked in the brand’s own app.” | tak | częściowo | tak |
| 390, ~2 600 px „Consulting for brands built on repeat orders.” | tak | tak (EUR 2,500/mies.) | tak |
| 390, ~4 000 px „Reorder gap and its cost, from store data.” | tak | **nie** | tak |
| 390, koniec „Start with the app or a store review.” | tak | częściowo | **nie jednoznacznie**: dwa równorzędne przyciski |
| 1440, 0 px hero z trzema kaflami | tak | częściowo | **nie** (trzy linki tekstowe, żaden nie jest główny) |
| 1440, „Consulting…” + „The label says 45 days. The order data says 69.” | tak | tak | tak |
| 1440, koniec | tak | częściowo | **nie jednoznacznie** (dwa przyciski) |

### `/calculator` (390 i 1440)
| Scena | 1 | 2 | 3 |
|---|---|---|---|
| „What is one day between orders worth?” + `+483,310` | tak | tak | tak („Talk these numbers through”, „Measure it — free”) |
Najlepsza strona w teście 10 sekund. Na 390 wynik `+483,310` jest poniżej pól – w pierwszym ekranie widać go, ale suwak „Target gap” jest już przy dolnej krawędzi (`_calculator_390_00.png`).

### Lista ustaleń „nie” (z poprawką)
1. **`/nawyko`, oba widoki, przejazd telefonu po „Every reward…”** – pustka przez ok. 3 ekrany, nagłówek „See the day each pack really runs out.” widoczny przez ułamek przewinięcia (opacity 0,36 w jedynej próbce na 1440, na 390 żadna próbka co 480 px go nie złapała). Poprawka: tekst sceny widoczny od wejścia telefonu, przejazd ≤ 1 ekran.
2. **`/nawyko`, oba widoki, sceny 01–04** – brak korzyści dla marki i brak CTA przez ok. 7 000 px. Poprawka: pod każdym krokiem jedna linia „Co ma z tego marka” (np. 01 → „wiesz, kto kupił i kiedy”; 03 → „widzisz realny rytm użycia”; 04 → „klient wraca po kod do Twojego sklepu”) oraz przyklejony mały przycisk „Ask about Nawyko” w nagłówku, widoczny także w scenie.
3. **`/nawyko`, „Your brand. Your colours. Your app.”** – brak CTA po najmocniejszym momencie. Poprawka: przycisk „Chcę to w swoich kolorach” prowadzący do formularza.
4. **`/lab/home` 390 i 1440, hero** – nie wiadomo, co jest ofertą główną i co kliknąć. Poprawka: jeden główny przycisk pod H1 (np. „Zobacz aplikację” → `/nawyko`) i podtytuł, który mówi, co dostaje marka (więcej zamówień od tych samych klientów).
5. **`/lab/home`, „Reorder gap and its cost, from store data.”** – brak korzyści. Poprawka: „Zobacz, ile tracisz na każdym dniu przerwy między zamówieniami”.
6. **Wszystkie strony, 390** – pasek zgody na cookies zajmuje ok. 10% ekranu przez całą scenę i zasłania pasek postępu scen. Poprawka: mniejszy pasek albo ukrycie po pierwszym przewinięciu (to nie wycina treści – baner wraca w stopce). Uwaga: decyzja zgodności, do potwierdzenia.

### Nagłówki będące etykietą, nie korzyścią
- `/nawyko`: „Four steps from purchase to next order.”; „Your brand. Your colours. Your app.” (częściowo); „A habit app with your logo on it.” (opis, nie korzyść – ratuje go lead).
- `/lab/home`: „Daily use, tracked in the brand’s own app.”; „Consulting for brands built on repeat orders.”; „Reorder gap and its cost, from store data.”; „Measure the gap between orders.”; „A branded app for daily product use.”
- Wzór dobrego nagłówka-korzyści już jest: „What is one day between orders worth?” i „The label says 45 days. The order data says 69.”

### Kontrast (< 4,5:1)
- `/nawyko`, pole „BRAND NAME”, placeholder „Tovemi”: **1,41:1** (oba widoki).
- Pozostały tekst zwykły na wszystkich trzech stronach mierzony przez `getComputedStyle` z tłem przodka: brak wartości < 4,5:1. Ograniczenie: pominięte elementy na tłach-obrazach/gradientach.
- `/lab/home` „Skip to content” 1,00:1 – to link ukryty do momentu fokusu, nie błąd, ale warto sprawdzić, że po fokusie zmienia kolor.
- Osobny problem czytelności (nie kontrast): 38 elementów 8–10 px na `/nawyko`.

### Koniec strony – jeden jasny CTA?
- `/nawyko`: tak (formularz „Would this fit your product?” + SEND).
- `/calculator`: tak („Talk these numbers through”), z drugorzędnym „Measure it — free”.
- `/lab/home`: **nie jednoznacznie** – „Start with the app or a store review.” daje dwa równorzędne czarne przyciski („Ask about Nawyko”, „Send an enquiry”). Wybrać jeden główny, drugi jako link tekstowy.

### Sceny kończące się pustką
- `/nawyko` 390: ok. 8 760–11 640 px (`_nawyko_390_07.png`, `_nawyko_390_08.png`: telefon w górnej części, 60% ekranu puste).
- `/nawyko` 1440: ok. 10 680–13 900 px (`_nawyko_1440_08.png`: prawa połowa pusta; `_nawyko_1440_09.png`: sam telefon na środku).

### Do sprawdzenia poza designem (ryzyko)
- `/lab/home` (390, sekcja „Record of work”): „GenActiv — In production — Current client. Colostrum, Shopify: strategy and build.” Zasady projektu Nawyko traktują dane biznesowe GENACTIV jako poufne. Przed publikacją potrzebna wyraźna zgoda klienta na wymienienie nazwy i zakresu – decyzja założyciela.
