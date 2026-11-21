# Kalkulator „ile daje wyższa powracalność / krótszy odstęp między zakupami” — źródła i model

Data zebrania: 2026-11-21. Autor: agent researchu (zlecenie jednorazowe).

## Najkrócej

1. Kalkulator powinien liczyć **wyłącznie z danych wpisanych przez odwiedzającego**. Publicznych, twardych benchmarków jest mało; żaden nie nadaje się na wartość domyślną. Kilka nadaje się na **podpowiedź ze źródłem** obok pola.
2. Najsolidniejsze liczby: Ipsos/CRN 2023 (55% Amerykanów to regularni użytkownicy suplementów), Recharge 2026 (odpływ subskrybentów według cyklu odnowienia), Recharge 2024 (4,4 zamówienia na subskrybenta rocznie), Narang i Shankar 2019 (użytkownicy aplikacji kupują 33% częściej), Decile 2024 (odsetek ponownych zakupów w 6 miesięcy według kategorii — z zastrzeżeniem o próbie).
3. Słynne „5% retencji = 25–95% zysku” **nie nadaje się do pokazania jako fakt**: to modelowanie Bain z lat 80.–90. dla usług (karty kredytowe, bankowość, ubezpieczenia), bez publicznych danych, a zakres zmieniał się między publikacjami (25–80%, 25–85%, 25–95%).
4. Dla **typowego odstępu między zamówieniami w dniach** nie znalazłem żadnego publicznego źródła pierwotnego. To pole musi wpisać odwiedzający.

## Jak czytać stopień potwierdzenia

Wszystkie strony otwierałem narzędziem, które pobiera stronę i zwraca fragmenty; bezpośrednie pobranie plików PDF (curl) zablokował serwer pośredniczący. Oznaczenia:

- **Potwierdzone na stronie** — liczba i cytat zwrócone z treści pobranej strony wydawcy. Przed publikacją kalkulatora warto każdy cytat kliknąć i zobaczyć w przeglądarce (to 10 minut), bo narzędzie odczytu mogło pominąć kontekst.
- **Potwierdzone pośrednio** — liczba widziana na stronie, która cytuje źródło pierwotne; oryginału nie udało się otworzyć.
- **Niepotwierdzone** — tylko ze snippetu albo z mojej pamięci; nie używać bez sprawdzenia.

Skala wiarygodności: **A** badanie pierwotne z opisaną metodologią (ankieta reprezentatywna, publikacja recenzowana); **B** raport dostawcy narzędzia z własnej bazy, z opisanym oknem i definicją; **C** raport dostawcy bez opisu próby albo mała próba agencji; **D** blog cytujący blog, synteza bez danych.

---

## 1. Benchmarki — tabela źródeł

### 1.1 Odsetek klientów wracających po kolejny zakup

| # | Liczba | Definicja | Próba / metoda | Rok | Wydawca | Ocena | Status |
|---|---|---|---|---|---|---|---|
| 1 | Suplementy 48%, Żywność i napoje 31%, Zdrowie i uroda 25%, Moda 22%, Dom 18% | „Repurchase Rate”, okno 6 miesięcy po zakupie | „próbka klientów Decile”; liczba marek i klientów niepodana | dane 2024, publ. 01.2025 | Decile (platforma danych klienta dla marek D2C) | C | Potwierdzone na stronie (PDF) i niezależnie w MediaPost |
| 2 | Suplementy 43%, Żywność i napoje 25%, Zdrowie i uroda 20%, Moda 18%, Dom 15% | „Retention Rate” (definicja niepodana w odczytanym tekście) | jak wyżej | 2024 | Decile | C | jak wyżej |
| 3 | Suplementy 2,9; Żywność i napoje 2,4; Zdrowie i uroda 2,0; Moda 1,5; Dom 1,4 | „Purchase Frequency” (okres niepodany w odczytanym tekście; prawdopodobnie zamówienia na klienta rocznie — to moje założenie) | jak wyżej | 2024 | Decile | C | jak wyżej |
| 4 | „prawie trzy czwarte klientów detalisty to kupujący jednorazowi” | udział klientów z jednym zakupem | ponad 100 detalistów, 7 branż (moda, domy towarowe, obuwie, zdrowie i uroda, dom, biżuteria, sport), cały rok 2024 | 2025 | Bluecore, „2025 Customer Growth Benchmarks Report” | B/C | Potwierdzone na stronie; liczby per branża tylko na wykresach, nieodczytane |
| 5 | Średnio 18,8% ponownych zakupów; „81% klientów nigdy nie składa drugiego zamówienia”; marki produktów zużywalnych 22–44% | odsetek ponownych zakupów | „ponad 156 000 klientów D2C” | data nieznana | Beauchamp Sullivan & Co., cytowane przez Shopify (aktual. 23.09.2026) | C | **Potwierdzone pośrednio** — strona źródłowa nie otworzyła się |

Cytaty:
- (1) Decile PDF: „Repurchase Rate: 18%, 22%, 25%, 31%, 48%” z przypisem „*Based on a 6 month post-purchase window”; nota „*Data derived from a sampling of Decile clients.” Przypisanie do kategorii potwierdza MediaPost: „Supplements — 48%”, „Food & Beverage — 31%”, „Health & Beauty — 25%”.
  - https://decile.com/wp-content/uploads/2025/01/Decile-2024-Benchmarking-Guide.pdf
  - https://www.mediapost.com/publications/article/403087/vertical-velocity-how-ecommerce-sectors-fared-in.html
- (4) Bluecore: „this report includes benchmarks from more than 100 retailers across seven different verticals”; „nearly three-quarters of a retailer's customers are one-and-one” (literówka w oryginale). https://www.bluecore.com/?p=11155
- (5) Shopify: „an average 18.8% repeat purchase rate”, „81% of customers never place a second order at all”, „Consumable brands see repeat rates as high as 22% to 44%”. https://www.shopify.com/enterprise/blog/ecommerce-customer-retention (oryginał: https://bsandco.us/blog-post/repeat-purchase-rate-benchmarks — nieotwarty)

Uwaga o rozbieżności: Decile daje dla suplementów 48% w 6 miesięcy, agregatory blogowe „około 29%”. Różnica wynika z definicji (okno, baza klientów, typ marek) — to kolejny powód, żeby nie pokazywać jednej liczby jako „średniej rynkowej”.

### 1.2 Typowy odstęp między zamówieniami

**Brak źródła pierwotnego.** Jedyna tabela „dni między zamówieniami według branży” (Eightx, 27.06.2026: suplementy 30, karma 30, żywność 45, uroda 75 dni) sama przyznaje, że to szacunek: „No single public report publishes a clean vertical-by-vertical table of average days between orders” oraz „best estimates synthesized across the inputs above and Eightx portfolio observations, not single-source figures”. Ocena D — **nie pokazywać**.
https://eightx.co/blog/average-time-between-orders-by-vertical

Pośrednio: Recharge 2024 — „A typical brand's subscribers placed 4.4 orders each over the past year” (mediana marki, lipiec 2023–czerwiec 2024). Nie wolno z tego wyliczać „83 dni odstępu”, bo liczba obejmuje subskrybentów, którzy odeszli w trakcie roku.

### 1.3 Udział przychodu od powracających klientów

| # | Liczba | Definicja | Próba / metoda | Rok | Wydawca | Ocena | Status |
|---|---|---|---|---|---|---|---|
| 6 | Mediana 38,5% przychodu przy 16,8% sesji; środkowe 50% sklepów: 31,3–45,7%; cały zakres 12,8–65,9% | powracający **odwiedzający** według Google Analytics 4 (rozpoznanie po ciasteczku, nie po koncie klienta) | 33 sklepy D2C (klienci agencji), 24,7 mln sesji, 325 177 transakcji | okno 10.2025–09.2026 (strona podaje też 07.2025–06.2026 — niespójność) | Top Growth Marketing (agencja) | C | Potwierdzone na stronie |
| 7 | Suplementy 0,81, Żywność i napoje 0,88 („więcej powracających”); Zdrowie i uroda 1,21, Moda 1,33, Dom 2,48 („więcej nowych”) | stosunek liczby nowych do powracających klientów | próbka klientów Decile, wielkość niepodana | I kw. 2025 | Decile, za MediaPost | C | Potwierdzone pośrednio (MediaPost) |

Cytaty:
- (6) „returning visitors were 16.8% of sessions but produced 38.5% of revenue”; „Returning share of revenue ranged from 12.8% to 65.9%”. https://topgrowthmarketing.com/dtc-ecommerce-benchmarks/returning-vs-new-customers/
- (7) „Supplements — 0.81 (more returning customers)”, „Food & Beverage — 0.88 (more returning customers)”. https://www.mediapost.com/publications/article/405221/metrics-mashup-how-ecommerce-verticals-performed.html

Dużego, pierwotnego źródła „X% przychodu e-commerce pochodzi od powracających klientów” nie znalazłem. Popularne „powracający to 8% odwiedzających i 41% przychodu” (Adobe) pochodzi z 2012 r. — z mojej pamięci, niepotwierdzone, za stare.

### 1.4 Programy lojalnościowe i aplikacje a częstotliwość zakupów

| # | Liczba | Definicja | Próba / metoda | Rok | Wydawca | Ocena | Status |
|---|---|---|---|---|---|---|---|
| 8 | Użytkownicy aplikacji kupują 33% częściej, 34% więcej sztuk, wydają 37% więcej; zwracają 35% częściej; po odjęciu zwrotów wydają 36% więcej | porównanie klientów, którzy zainstalowali aplikację detalisty, z resztą, 18 miesięcy po uruchomieniu aplikacji | jeden duży detalista w USA (nie produkty zużywalne); publikacja recenzowana | 2019 | Narang i Shankar, „Marketing Science” 38(5), komunikat INFORMS z 03.09.2019 | A (metoda), ale starsze niż 2023 i inna branża | Potwierdzone na stronie komunikatu; wielkość próby nieodczytana |
| 9 | 83,0% właścicieli programów, którzy mierzą zwrot, deklaruje zwrot dodatni; program „generuje 5,2 razy więcej przychodu, niż kosztuje” | **deklaracje** właścicieli programów w ankiecie | 2 600 odpowiedzi (marketing, IT, lojalność) | 01.2025 | Antavo (dostawca platformy lojalnościowej) | C | Potwierdzone na stronie streszczenia; PDF nie otworzył się |
| 10 | „known customers at Shopify retailers make 61% more repeat purchases than unknown customers” | klienci rozpoznani (zalogowani / z kontem) vs nierozpoznani | badanie EY dla Shopify; próby nie odczytałem | brak daty w odczycie | EY / Shopify | C | Potwierdzone pośrednio (blog Shopify) |

Cytaty:
- (8) „retail app users buy 33 percent more frequently”, „they buy 34 percent more items”, „they spend 37 percent more than non-app user customers over 18 months after app launch”. https://www.informs.org/News-Room/INFORMS-Releases/News-Releases/Do-those-Retail-Apps-Increase-Customer-Engagement-and-Sales-in-All-Channels-New-Research-Says-Yes-on-Both-Sales-and-Returns
- (9) „83.0% of program owners who measure ROI reported a positive return on investment.”; „They said that their loyalty program generates 5.2 times more revenue than what it costs.” https://antavo.com/?p=44653

Ograniczenia: (8) to jeden detalista i klienci, którzy sami wybrali aplikację (autorzy korygują to metodą, ale to nie eksperyment); nie dotyczy suplementów ani kosmetyków. (9) to samoocena ludzi, którzy prowadzą programy, w ankiecie dostawcy takich programów — nie pomiar. Żadna z tych liczb nie mówi „aplikacja skróci odstęp o X dni”.

### 1.5 Retencja subskrypcji produktów zużywalnych

| # | Liczba | Definicja | Próba / metoda | Rok | Wydawca | Ocena | Status |
|---|---|---|---|---|---|---|---|
| 11 | Odpływ przy pierwszym odnowieniu (cykle 2–3) / dojrzały (cykl 6+): Żywność i napoje 28,2% / 6,4%; Zwierzęta 27,8% / 6,5%; Zdrowie i wellness 26,5% / 7,5%; Uroda i pielęgnacja 26,3% / 8,5%; Dom 23,4% / 12,3% | „active churn” — rezygnacja z inicjatywy subskrybenta, jako odsetek w danym cyklu odnowienia | marki na platformie Recharge (wydawca podaje ponad 20 000 marek), cykle od 07.2025 do 03.2026, tylko cykle rozstrzygnięte | publ. 10.07.2026, aktual. 24.08.2026 | Recharge | B | Potwierdzone na stronie |
| 12 | Cała platforma: cykl 2 — 24,1%; cykl 3 — 27,1%; cykl 4 — 16,6%; cykl 5 — 12,4%; cykl 6 — 10,1%; cykl 12 — 5,4%; cykl 13+ — 2,4% | jak wyżej | jak wyżej | 2026 | Recharge | B | Potwierdzone na stronie |
| 13 | „About 61% of all voluntary cancellations happen at the first two renewals”; „roughly 72% land within the first four” | rozkład rezygnacji w czasie | jak wyżej | 2026 | Recharge | B | Potwierdzone na stronie |
| 14 | 4,4 zamówienia na subskrybenta w roku (mediana marki), +15% rok do roku; 19% subskrybentów w kategorii Zdrowie i wellness pominęło co najmniej jedno zamówienie; ok. 15% wraca po rezygnacji | mediana marki w branży; bez mody; bez marek, które dołączyły w trakcie okresu | marki Recharge, 07.2023–06.2024 | publ. 17.09.2024 | Recharge, „Subscriber Trends & Insights” | B | Potwierdzone na stronie raportu i w komunikacie prasowym |
| 15 | „Across 20,000 brands on Recharge, subscribers placed nearly 3x more orders than one-time shoppers” | subskrybenci vs kupujący jednorazowo | okres niepodany na stronie | 2026 | Recharge, „Subscription Trend Report 2026” | C (brak okna i definicji) | Potwierdzone na stronie |
| 16 | „nearly 40 percent of e-commerce subscribers have canceled”; „More than one-third … cancel in less than three months, and over half cancel within six” | ankieta konsumencka | 5 093 respondentów w USA, w tym 607 subskrybentów; 8–12.11.2017 | publ. 09.02.2018 | McKinsey | A (metoda), ale dane z 2017 | Potwierdzone na stronie |

Adresy:
- (11–13) https://getrecharge.com/?p=27190
- (14) https://getrecharge.com/?p=24734 oraz https://prnewswire.com/news-releases/recharge-subscriber-trends-insights-report-highlights-the-growing-value-of-subscribers-to-ecommerce-brands-302250623.html
- (15) https://getrecharge.com/reports/subscription-trend-report-2026/
- (16) https://www.mckinsey.com/industries/retail/our-insights/thinking-inside-the-subscription-box-new-research-on-ecommerce-consumers

### 1.6 Regularność stosowania suplementów (zachowanie konsumenckie, bez twierdzeń zdrowotnych)

| # | Liczba | Definicja | Próba / metoda | Rok | Wydawca | Ocena | Status |
|---|---|---|---|---|---|---|---|
| 17 | 74% dorosłych Amerykanów deklaruje stosowanie suplementów; **55% deklaruje, że są regularnymi użytkownikami** | samoopis: regularnie / okazjonalnie / sezonowo | Ipsos, ankieta online, 3 192 dorosłych (2 328 użytkowników, 864 nieużytkowników), 9–14.08.2023, błąd ±2,1 pkt | publ. 13.10.2023 | Ipsos dla Council for Responsible Nutrition (CRN, organizacja branżowa producentów) | A | Potwierdzone na stronie Ipsos |
| 18 | 75% stosuje suplementy | jak wyżej | Ipsos, 3 194 dorosłych (2 332 użytkowników), 7–12.08.2024, ±2,1 pkt | publ. 29.10.2024 | CRN | A | Potwierdzone na stronie CRN |
| 19 | „76% Amerykanów stosuje suplementy codziennie” | nagłówek prasowy | ankieta producenta NOW Foods; próba i daty niepodane | publ. 29.01.2026 | NutraIngredients | D | Potwierdzone na stronie, ale bez metodologii — **nie używać** |

Cytaty:
- (17) „about three-quarters of Americans (74%) say they are dietary or nutritional supplement users”; „Just over half of Americans (55%) report being regular supplement users.” https://www.ipsos.com/en-us/nine-ten-dietary-or-nutritional-supplement-users-agree-dietary-supplements-are-essential
- (18) „three-quarters of Americans continue to use dietary supplements” https://crnusa.org/newsroom/crn-survey-shows-consistent-supplement-usage-increase-specialty-product-use-over-time

Ograniczenia: USA, samoopis (nie pomiar zużycia opakowania), zamawiający to organizacja branżowa. Z (17) wynika tylko tyle: wśród użytkowników około jedna czwarta sama określa się jako nieregularna (74% − 55% = 19 pkt z 74, czyli ok. 26% użytkowników) — to moje przeliczenie, nie cytat. **Twardych danych o tym, ile dni z opakowania klient faktycznie wykorzystuje, nie znalazłem.**

### 1.7 Polska

Gemius „E-commerce w Polsce 2025”: „nearly 78% of internet users (~30 million people) shop online”; kosmetyki i perfumy kupuje online 65% kupujących (za Przelewy24, 26.09.2025; wielkość próby nieodczytana). To tło rynkowe, nie dane o powracalności. Polskich publicznych benchmarków odsetka ponownych zakupów ani odstępu między zamówieniami nie znalazłem w tym przebiegu.
https://www.przelewy24.pl/en/news/ecommerce-2025-zakupy-online-trendy-polscy-konsumenci

---

## 2. Liczby, których NIE wolno pokazać jako faktu

### 2.1 „Wzrost retencji o 5% podnosi zysk o 25–95%”

Faktyczne pochodzenie (prześledzone w źródłach):

| Rok | Publikacja | Co faktycznie napisano | Status |
|---|---|---|---|
| 1990 | Reichheld i Sasser, „Zero Defections: Quality Comes to Services”, Harvard Business Review, 01.09.1990 | Streszczenie na stronie Bain: „Companies can boost profits by almost 100% by retaining just 5% more of their customers.” Jedyny nazwany przykład: MBNA (karty kredytowe). Zakres „25–85%” w dziewięciu branżach usługowych znam z pamięci — **niepotwierdzone** na otwartej stronie. | Potwierdzone na stronie (streszczenie) |
| 1990 | Reichheld i Kenny, „The hidden advantages of customer retention”, Journal of Retail Banking 12(4) | „a five-point improvement in customer retention can lead to profit swings of 25% to 80%”, pomiar w „over two dozen service businesses” | Potwierdzone (podgląd artykułu) |
| 2000 | Reichheld i Schefter, „E-Loyalty: Your Secret Weapon on the Web”, Harvard Business Review, 01.07.2000 | „By retaining a mere 5% more customers, e-companies can boost profits by 25–95%” — pierwsze wystąpienie zakresu 25–95%; na otwartej stronie bez wskazania badania ani branż | Potwierdzone na stronie Bain (zajawka; pełny tekst płatny) |
| 2001–2003 | Reichheld, „Prescription for cutting costs” (Bain) | „In financial services, for example, a 5% increase in customer retention produces more than a 25% increase in profit.” | Potwierdzone (PDF) |

Adresy: https://www.bain.com/insights/zero-defections-quality-comes-to-services-harvard-business-review-hbr/ · https://go.gale.com/ps/anonymous?id=GALE%7CA9295626 · https://bain.com/insights/e-loyalty-your-secret-weapon-on-the-web · https://media.bain.com/Images/MM_Loyalty_prescription_cutting_costs.pdf

Ograniczenia:
1. To analizy klientów firmy doradczej z lat 80.–90., bez opublikowanych danych ani metody możliwej do odtworzenia.
2. Branże: usługi o długich relacjach (karty kredytowe, depozyty, ubezpieczenia, serwis aut). Nie handel internetowy, nie produkty zużywalne.
3. „5%” to pięć **punktów procentowych** wskaźnika odejść (np. z 10% do 5% rocznie, czyli o połowę mniej odejść), a „zysk” to wartość bieżąca klienta w całym okresie relacji, nie zysk roczny firmy.
4. Sam autor podawał różne zakresy (25–80, 25–85, 25–95, „ponad 25”, „prawie 100”).

Wniosek: nie pokazywać. Jeśli strona chce się do tego odnieść, to wyłącznie jako ciekawostka z pełnym opisem ograniczeń.

Lepsza alternatywa akademicka (też z ograniczeniami): Gupta, Lehmann i Stuart, „Valuing Customers”, Journal of Marketing Research 2004 — „improving customer retention by 1% is likely to improve customer and firm value by 3-7%”; „margin elasticity is about 1 and acquisition elasticity is only 0.02-0.3”. Pięć firm (Capital One, Amazon, Ameritrade, eBay, E*Trade), dane z przełomu wieków, dotyczy **wartości firmy**, nie zysku ani przychodu. Ocena A co do metody, ale nie do przeniesienia wprost na markę suplementów. https://business.columbia.edu/sites/default/files-efs/pubfiles/534/Valuing_Customers--JMR_2003.pdf

### 2.2 Pozostałe liczby do odrzucenia

| Liczba | Dlaczego odpada |
|---|---|
| „Pozyskanie klienta kosztuje 5 razy więcej niż utrzymanie” | Brak źródła pierwotnego; krąży między blogami (np. Rivo cytuje własny inny wpis). |
| „60–70% szans sprzedaży obecnemu klientowi vs 5–20% nowemu” | Pochodzi z książki „Marketing Metrics” bez danych (z pamięci); Yotpo linkuje do Epsilon, Rivo do siebie. |
| „Średni odsetek ponownych zakupów w e-commerce to 28,2%” | Rivo → Opensend → dalej; brak próby i okna. |
| „Suplementy ok. 29%, uroda ok. 25,9%, karma 30–40%” | MobiLoud: mieszanka Bluecore i Opensend, bez okna i próby; Bluecore nie obejmuje marek suplementów. |
| „Powracający klienci wydają 67% więcej” | Bain/Mainspring z 2000 r., odzież; cytowane przez blogi bez daty. |
| „Po drugim zakupie szansa na trzeci rośnie o 95%” (Bluecore) | Sformułowanie niejasne (o 95% względem czego?), detaliści wielobranżowi. |
| „Retencja w handlu 63%” | Yotpo → Exploding Topics; brak definicji. |
| „Program lojalnościowy daje 5,2 razy więcej przychodu, niż kosztuje” | Deklaracje właścicieli programów w ankiecie dostawcy; nie pomiar. Co najwyżej z opisem „deklaracja”. |
| Tabela odstępów Eightx (30 / 45 / 75 dni) | Autor sam pisze, że to synteza i szacunek. |
| „76% Amerykanów bierze suplementy codziennie” | Ankieta producenta bez podanej próby. |
| Shopify „średnia retencja e-commerce ok. 38%” | Shopify → Sprinklr → dalej; nie sprawdzono pochodzenia. |

Uwaga na marginesie: Eightx powołuje się na „analizę 156 110 marek D2C”, a Beauchamp Sullivan na „ponad 156 000 klientów D2C”. Zbieżność liczb przy różnych jednostkach jest podejrzana — kolejny powód, żeby nie używać żadnej z nich bez otwarcia oryginału.

---

## 3. Model kalkulatora — tylko dane odwiedzającego

### 3.1 Pola wejściowe

| Symbol | Pole | Definicja do pokazania przy polu |
|---|---|---|
| N | Liczba klientów kupujących ponownie | Klienci, którzy w ostatnich 12 miesiącach złożyli co najmniej dwa zamówienia |
| AOV | Średnia wartość zamówienia (zł, netto) | Przychód / liczba zamówień |
| T0 | Obecny średni odstęp między zamówieniami (dni) | Średnia liczba dni między kolejnymi zamówieniami tego samego klienta |
| T1 | Docelowy odstęp (dni) | Suwak od D do T0 |
| D | Na ile dni starcza opakowanie | Liczba porcji / porcje dziennie × liczba opakowań w typowym zamówieniu |
| m | Marża brutto (%) | Opcjonalne; bez niej pokazujemy tylko przychód |
| C | Nowi klienci rocznie | Klienci z pierwszym zamówieniem w ostatnich 12 miesiącach |
| r0, r1 | Obecny i docelowy odsetek nowych klientów z drugim zakupem (%) | W oknie wybranym przez odwiedzającego (np. 6 miesięcy) |
| k | Liczba kolejnych zamówień po drugim (opcjonalne) | Domyślnie 0 = liczymy tylko drugie zamówienie |
| d | Rabat użyty do skrócenia odstępu (%) | Opcjonalne |
| K | Roczny koszt działania (zł) | Opcjonalne |

### 3.2 Wzory

**A. Skrócenie odstępu**

- Przychód roczny od klientów powracających: `P0 = N × AOV × 365 / T0`
- Po skróceniu: `P1 = N × AOV × 365 / T1`
- Dodatkowy przychód: `ΔP = N × AOV × 365 × (1/T1 − 1/T0)`
- Wzrost względny: `T0/T1 − 1` (nie zależy od N ani AOV — dobry do pokazania jako pierwszy wynik)
- Dodatkowa marża: `ΔM = ΔP × m − K`
- Pokrycie zapasem: `D / T0` — jaka część dni między zamówieniami jest pokryta produktem; „dni bez produktu” = `T0 − D`
- Górna granica (klient zamawia dokładnie wtedy, gdy kończy opakowanie): `T1 = D`, czyli maksymalny wzrost `T0/D − 1`

Z rabatem d:
- `ΔP = N × 365 × (AOV × (1 − d) / T1 − AOV / T0)`
- Rabat, przy którym przychód się nie zmienia: `d* = 1 − T1/T0`
- Rabat, przy którym marża się nie zmienia: `d* = m × (1 − T1/T0)` (przy marży liczonej od ceny przed rabatem)

Przykład do testów (liczby wymyślone wyłącznie do sprawdzenia wzoru, nie do pokazania): N = 1000, AOV = 100, T0 = 60, T1 = 45 → P0 = 608 333, P1 = 811 111, ΔP = 202 778, wzrost 33,3%; d* dla przychodu = 25%; przy m = 60% d* dla marży = 15%.

**B. Więcej klientów z drugim zakupem**

- Dodatkowi klienci z drugim zakupem: `ΔK = C × (r1 − r0)`
- Dodatkowy przychód, wariant ostrożny (tylko drugie zamówienie): `ΔP = C × (r1 − r0) × AOV`
- Wariant rozszerzony: `ΔP = C × (r1 − r0) × AOV × (1 + k)`
- Dodatkowa marża: `ΔP × m − K`

**C. Łączenie A i B**

Nie sumować wprost. Jeśli oba naraz: `N' = N + C × (r1 − r0)`, potem `P1 = N' × AOV × 365 / T1`. W wersji pierwszej kalkulatora polecam dwa osobne wyniki i zdanie „to dwa różne scenariusze, nie dodawaj ich”.

### 3.3 Przypadki brzegowe

| Sytuacja | Zachowanie |
|---|---|
| T0 ≤ 0, T1 ≤ 0, puste pola | Brak wyniku, komunikat przy polu; nigdy dzielenie przez zero |
| T1 ≥ T0 | Wynik zero lub ujemny; komunikat „docelowy odstęp musi być krótszy od obecnego” |
| T1 < D | Ostrzeżenie: klient kupowałby szybciej, niż zużywa — to robienie zapasów, nie trwały przychód; ograniczyć suwak do D |
| T0 ≤ D | Brak rezerwy: klienci już kupują tak szybko, jak zużywają (albo kupują dla kilku osób); kalkulator kieruje do scenariusza B |
| T0 > 365 | Mniej niż jedno zamówienie rocznie — definicja „klienta powracającego” przestaje pasować; ostrzeżenie |
| D nieznane | Scenariusz A działa bez D, ale bez górnej granicy; pokazać to wprost |
| r0, r1 poza 0–100 albo r1 < r0 | Walidacja |
| C×(r1−r0) niecałkowite | Zaokrąglać w dół przy wyświetlaniu liczby klientów, przychód liczyć z pełnej wartości |
| Zamówienia wielopakowe | D = dni na jedno zamówienie, nie na jedno opakowanie — dopisać w podpowiedzi |
| Subskrypcje | Odstęp jest ustawiony z góry; scenariusz A dotyczy klientów bez subskrypcji. Pole wyboru „odejmij subskrybentów z N” |
| Rabat d ≥ m | Marża ujemna na dodatkowych zamówieniach — wynik na czerwono |
| Bardzo duże wartości | Formatować z odstępami tysięcy; bez notacji naukowej |

### 3.4 Założenia, które trzeba napisać pod wynikiem

1. Wzór zakłada stan ustalony: wszyscy z N kupują przez cały rok w podanym rytmie; nie uwzględnia odejść w trakcie roku. Wynik to **górne oszacowanie**.
2. Scenariusz B pokazuje wartość rocznej kohorty nowych klientów, a nie przychód roku kalendarzowego (drugie zamówienia klientów z końca roku wpadną w następny).
3. AOV pozostaje bez zmian (chyba że wpisano rabat).
4. Kalkulator nie mówi, **czy** dany odstęp da się osiągnąć — tylko ile jest wart, jeśli się uda. Żaden publiczny benchmark nie pozwala uczciwie obiecać konkretnego skrócenia.

### 3.5 Które pola mogą mieć podpowiedź ze źródłem

Podpowiedź = mały tekst pod polem, z nazwą wydawcy, rokiem, definicją i linkiem. Pole zostaje **puste**, dopóki odwiedzający czegoś nie wpisze.

| Pole | Podpowiedź | Źródło | Zastrzeżenie do pokazania |
|---|---|---|---|
| r0 (drugi zakup) | „W próbce klientów Decile w 2024 r. w ciągu 6 miesięcy ponownie kupowało: suplementy 48%, żywność i napoje 31%, zdrowie i uroda 25%” | Decile 2024 (#1) | próbka klientów jednego dostawcy, wielkość niepodana, rynek głównie USA |
| r0 (kontekst) | „W danych Bluecore za 2024 r. prawie trzy czwarte klientów detalistów kupiło tylko raz” | Bluecore 2025 (#4) | detaliści wielobranżowi, nie marki suplementów |
| Pole wyboru „subskrypcje” | „Na platformie Recharge przy pierwszym odnowieniu rezygnuje ok. 26–28% subskrybentów w kategoriach zdrowie, uroda, żywność, zwierzęta; po szóstym cyklu ok. 6–9%” | Recharge 2026 (#11) | dane jednej platformy, rezygnacje dobrowolne |
| k (kolejne zamówienia) | „Mediana marki na Recharge: 4,4 zamówienia na subskrybenta rocznie” | Recharge 2024 (#14) | dotyczy subskrybentów, nie wszystkich klientów |
| Sekcja „dlaczego odstęp bywa dłuższy niż opakowanie” | „55% dorosłych Amerykanów określa się jako regularni użytkownicy suplementów, przy 74% stosujących w ogóle” | Ipsos/CRN 2023 (#17) | USA, samoopis; nie mierzy zużycia opakowania |
| Sekcja „aplikacja” | „W badaniu jednego detalisty w USA użytkownicy aplikacji kupowali 33% częściej przez 18 miesięcy od jej uruchomienia” | Narang i Shankar 2019 (#8) | jeden detalista, inna branża, klienci sami wybrali aplikację |
| T0, T1, D, N, AOV, m, C | **Bez podpowiedzi liczbowej** | — | brak wiarygodnego źródła; D odwiedzający bierze z etykiety własnego produktu |

---

## 4. Czego nie udało się zrobić

- https://bsandco.us/blog-post/repeat-purchase-rate-benchmarks — strona nie otworzyła się (prośba o dostęp wygasła); liczby znam tylko z cytatu u Shopify.
- https://antavo.com/wp-content/uploads/2025/01/Global_Customer_Loyalty_Report_2025_by_Antavo.pdf — błąd po stronie serwisu; liczby ze strony streszczenia.
- Pobranie plików PDF bezpośrednio (Decile, Bain, Columbia) zablokował serwer pośredniczący (odpowiedź 403); treść odczytana narzędziem do stron, bez własnego wglądu w układ tabel. Przypisanie liczb Decile do kategorii potwierdziłem drugim źródłem (MediaPost).
- Pełny tekst artykułów Harvard Business Review z 1990 i 2000 r. jest płatny — widziałem tylko zajawki na stronie Bain.
- Pełne raporty Recharge (2024, 2026) i Bluecore są za formularzem; liczby per branża z wykresów nieodczytane.
- Nie znalazłem: pierwotnego źródła dni między zamówieniami według kategorii; dużego źródła udziału przychodu od powracających **klientów** (nie odwiedzających); polskich danych o powracalności; pomiaru faktycznego zużycia opakowania suplementu.

## 5. Co by rozstrzygnęło niepewności

1. Otwarcie w przeglądarce PDF Decile 2024 i sprawdzenie definicji „Retention Rate” i „Purchase Frequency” (5 minut).
2. Pobranie pełnego raportu Recharge 2026 (formularz z adresem e-mail — wymaga decyzji właściciela strony) dla liczb per branża.
3. Zapytanie do Decile o wielkość próby — to kontakt z zewnętrzną firmą, wymaga zgody założyciela.
4. Własne dane: jeśli konsultant ma zanonimizowane dane klientów, jedna własna tabela „odstęp vs dni zapasu” byłaby mocniejsza niż wszystkie powyższe benchmarki — ale to decyzja o danych klientów, poza zakresem tego zlecenia.
