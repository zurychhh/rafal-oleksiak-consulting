# REVIEW — Homepage v7 Dosage — 2026-09-21, 21:10 CEST (19:10 UTC)

Strona oceniana: **Homepage v7 Dosage** (projekt „Oleksiak homepage redesign", 16 stron).

**UWAGA NADRZĘDNA: od poprzedniej recenzji (20:10) nic nie powstało.** Lista stron w projekcie wciąż ma 16 pozycji, a trzy najświeższe (v7 Dosage, v7 Dark, v5) mają znacznik „Edited 1h ago", czyli edycję sprzed poprzedniej recenzji. Żaden build run nie odpalił. Ta recenzja jest więc powtórnym oglądem tej samej strony — i potwierdza, że dziura konwersyjna na telefonie stoi otwarta od ponad godziny.

---

## NAJWAŻNIEJSZA ZMIANA — jedno zdanie

**Wstaw na pierwszy ekran przy 390 px pole „Your store URL" + przycisk SEND z linią „I reply personally within 24 hours" i zwiń stopkowy formularz do jednej kolumny — dziś na telefonie przez pierwsze dwa ekrany nie ma w co kliknąć, a formularz na dole jest rozjechany na prawe 40% szerokości.**

Dlaczego wciąż ta, a nie inna: to jedyna wada, która kasuje całe zadanie strony (wpisany adres sklepu), a nie tylko je osłabia. Ruch z LinkedIna to w większości telefon. Cena, zakończenie i dowód to poprawki do strony, do której telefoniczny odwiedzający i tak nie dojdzie.

---

## KOREKTA POPRZEDNIEJ RECENZJI — DWÓCH RZECZY NIE RÓB

Poprzedni werdykt zawierał dwa błędne rozpoznania. Nie marnuj na nie runu.

1. **Arytmetyka miernika jest poprawna, miernik nie kłamie.** Sprawdzone przez cały przewijak: wypełnione pola = ml, które zostały, i liczba zgadza się z podpisem w każdym momencie (4 czarne → „400 ML LEFT", 3 → „300 ML LEFT", 2 → „200 ML LEFT", 0 → „0 ML LEFT"), tak samo na desktopie (szyna lewa) i na telefonie (pasek górny). Poprzednia recenzja porównywała odczyty z różnych pozycji przewijania i wyciągnęła z tego sprzeczność, której nie ma. Punkt „napraw arytmetykę miernika" jest do skasowania z kolejki.
2. **Prawa kolumna pola znaczników wypełnia się.** Nie zostaje pusta — wypełnia się równolegle z lewą, a dopiero w klatce finałowej zostaje wyzerowana do zera znaczników przy podpisie „Came back on their own day". To jest zamierzony obraz problemu, nie defekt renderowania. Problem z tym zakończeniem jest inny i opisany w punkcie 6 i 7 niżej.

---

## ODPOWIEDZI NA OSIEM PYTAŃ

### 1. Pięć sekund dla obcego — wie, co ten człowiek sprzedaje i czego się od niego chce?

**Desktop: tak. Telefon (390 px): nie — i to jest ta sama odpowiedź co godzinę temu.**

Desktop: nagłówek „You don't pay twice for the same customer.", podtytuł o e-commerce dla marek z powracającym klientem, a po prawej ramka ENQUIRY FORM z polem „yourstore.com", polem e-mail, czarnym SEND i linią „I reply personally within 24 hours, with a first observation about your store — not a calendar link." Kategoria jasna, prośba jasna, obietnica odpowiedzi jasna. To działa.

390 px: nagłówek, podtytuł i natychmiast „COMPOSITION — FIVE PARTS, IN ORDER". Zero pola, zero przycisku, zero paska sticky. Formularz pojawia się dopiero po sekcji INTERVAL, dwa ekrany niżej. Po pięciu sekundach na telefonie nie ma czego dotknąć.

### 2. Linia, którą mógł napisać tylko ktoś z piętnastoma latami w kategoriach powtarzalnego zakupu?

**Tak. Cztery, i to jest cały majątek tej strony.**

- **„45 on the label, 69 in the data"** (INTERVAL — 70 DAYS). Rozjazd między cyklem deklarowanym na etykiecie a realnym cyklem odkupu. Nikt bez danych kategorii tego nie napisze.
- **„The measurement window set to the category's own cycle rather than a default seven or thirty days"** (PART 01). Zdanie o atrybucji, które zna każdy, kto policzył kategorię z cyklem 69 dni w narzędziu domyślnie ustawionym na 30.
- **„Anyone already inside an owned-channel flow suppressed from paid so the same person is not bought twice"** (PART 03). To jest dokładnie ten mechanizm, który nagłówek obiecuje — i rzadko kto go pokazuje.
- **„Lapsed segments separated from never-returned"** (PART 03). Rozróżnienie, którego nie robi się z prezentacji, tylko z bazy.

Marnotrawstwo: te cztery linie leżą pod hoverem i nie widać ich z poziomu skanowania strony.

### 3. Czy strona pozwala rozpoznać własną sytuację, zanim coś zaproponuje?

**Nie — kolejność jest nadal odwrócona.** Nagłówek nazywa koszt w języku czytelnika, ale zaraz po nim idzie prośba (formularz) i oferta (pięć kart). Jedyny moment realnego rozpoznania — „45 on the label, 69 in the data" — przychodzi **po** liście usług i mówi o abstrakcyjnej kategorii, nie o sklepie czytelnika. Nigdzie nie pada zdanie w rodzaju „jeśli twoja kategoria ma cykl 60 dni, a płacisz za ten sam koszyk co 30 — to jest twój rachunek".

Do zrobienia: INTERVAL nad COMPOSITION, albo jedna linia rozpoznania pod podtytułem hero.

### 4. Sekcja dowodowa: dowód czy ściana logotypów?

**Ściana logotypów z jednym przypisem.** „PREPARED AT: Allegro / Accenture / mBank / Booksy / GenActiv" — pięć wordmarków w rzędzie, każdy z numerkiem 1–5, ale przypis istnieje tylko do 1, 3 i 4: „At Allegro I worked with a data science team on predicting a customer's next purchase. At mBank I built a retention programme around consumables. Booksy was the same problem on the service side." Numerki 2 (Accenture) i 5 (GenActiv) prowadzą donikąd — to widoczny brak, nie subtelność.

Na całej stronie nie ma ani jednego wyniku, ani jednej liczby z projektu, ani ram czasowych, ani zdania klienta. Trzy zdania przypisu to wszystko, co jest dowodem — i one są dobre, tylko jest ich za mało i są wielkości drobnego druku.

### 5. Cena: widoczna i rozbrajająca, czy zakopana?

**Treść rozbrajająca, miejsce najgorsze z możliwych.** Blok FEE: „EUR 2,500 net per month. No setup fee. No minimum term. One client at a time. The first month is an as-is audit and the quick wins that come out of it." Napisane dokładnie tak, jak trzeba.

Stoi jako **ostatni blok treści na stronie**, pod formularzem finałowym, obok INSTRUMENTS, nad stopką. Cena ma zdejmować lęk przed nieznanym rachunkiem *zanim* ktoś wpisze adres sklepu; postawiona za prośbą nie robi nic. Do rozstrzygnięcia osobno: EUR na stronie z przełącznikiem PL, kierowanej do polskich sklepów.

### 6. Czy ruch niesie znaczenie, czy to dekoracja?

**Hover na COMPOSITION — niesie, i to jest najlepsza rzecz na tej stronie. Nie ruszać.** Najechanie na kartę 03 przełącza pasek „DIRECTIONS FOR USE" na PART 03 z trzema konkretnymi zdaniami i jednocześnie podświetla na 70-dniowym wykresie dni 40–48 z podpisem „Days 40–48 — owned channels take the order". Karta 05 rozsypuje słupki na nieregularne i podpisuje „Seven customers, seven different days". To jest argument postawiony interfejsem, a nie ozdoba.

**Miernik dawki — spójny, ale pusty znaczeniowo.** Liczby się zgadzają (patrz korekta wyżej), tylko nic nie znaczą dla czytelnika: wszystkie pięć kart ma identyczne „100 ML", więc miernik na karcie nie niesie żadnej informacji, a odliczanie 500 → 0 przy przewijaniu to metafora butelki, której strona nigdzie nie wyjaśnia. Nie kłamie — jest szumem.

**Pole znaczników (BATCH RECORD) — dekoracja kosztem dwóch ekranów.** Wypełnia się, po czym w klatce finałowej lewa kolumna jest pełna („Bought again, and paid for again"), a prawa wyzerowana („Came back on their own day"). Obraz jest czytelny dopiero, gdy animacja przejedzie do końca; w stanie spoczynku to dwie siatki pustych kwadracików bez podpisu, bo podpisy są jasnoszare na bieli. Zużywa dwa ekrany na powiedzenie jednej rzeczy i zostawia pod sobą półtora ekranu bieli.

### 7. Co jest zepsute — patrz lista niżej.

### 8. Jedna najbardziej wartościowa zmiana — patrz sekcja na górze.

Krótko: konwersja na 390 px, bo to jedyna wada, która kasuje zadanie strony zamiast je osłabiać. Wszystko inne (cena nad formularzem, dowód, rozpoznanie) poprawia stronę, do której telefoniczny odwiedzający nie dochodzi.

---

## CO JEST ZEPSUTE

1. **390 px — pierwszy ekran bez konwersji.** Brak pola, brak przycisku, brak paska sticky. Pierwszy formularz dopiero po sekcji INTERVAL.
2. **390 px — brak dolnego paska sticky**, który na desktopie towarzyszy całej stronie („Reply in 24 hours… / Your store URL / SEND").
3. **390 px — formularz finałowy rozjechany.** Pola „Your store URL", „Your email" i przycisk SEND dociśnięte do prawych ~40% szerokości, checkbox zgody osierocony w osobnym wierszu przy lewej krawędzi, między nimi pusta kolumna. To siatka desktopowa, która się nie zwinęła. **Stoi niezmieniona od poprzedniej recenzji.**
4. **Podpisy pola znaczników nieczytelne** — „Bought again, and paid for again" i „Came back on their own day" to jasna szarość na bieli; stają się czytelne dopiero po przejechaniu animacji. Stan, który działa wyłącznie po animacji.
5. **Półtora ekranu pustej bieli** pod siatką znaczników, na desktopie i na telefonie.
6. **Przypisy 2 (Accenture) i 5 (GenActiv) bez treści** — numerek przy logotypie, do którego nic nie prowadzi.
7. **Placeholder „PHOTO" w dwóch miejscach** (ramka ENQUIRY FORM w hero i blok stopkowy). Cała teza strony to jeden konkretny człowiek, a jego zdjęcie to pusta ramka. Dwa razy.
8. **„Rafal" zamiast „Rafał"** w całym tekście, łącznie z linią „RAFAL OLEKSIAK WROTE".
9. **Wszystkie pięć kart pokazuje identyczne „100 ML"** — miernik na karcie nie niesie informacji.
10. **Nazwa strony bez tagu TRESC/EFEKT** — żadna ze stron v7 go nie ma, więc toru nie da się odróżnić po nazwie. Zgłoszone poprzednio, niezrobione.
11. **Zakończenie przed formularzem to obraz porażki bez odwrócenia** — ostatnia rzecz, którą czytelnik widzi przed prośbą, to „nikt nie wrócił sam" plus kryptyczne „ONE MORE DOSE — NOTHING DISPENSED". Diagnoza bez puenty.

---

## KOLEJKA DLA NASTĘPNEGO RUNU (po zmianie nr 1)

2. FEE nad formularz finałowy, albo linia „EUR 2 500 / miesiąc, jeden klient naraz" do hero pod podtytułem.
3. Wypuścić treść PART 02–05 do widoku bez hovera (akordeon / tap na telefonie) — tam leży cały dowód piętnastu lat.
4. INTERVAL („45 on the label, 69 in the data") nad COMPOSITION.
5. Pole znaczników: dociemnić podpisy do czytelnego kontrastu, skrócić sekcję o połowę, skasować półtora ekranu bieli — albo wrócić do zakończenia z v5-B (trzy podpisane liczby).
6. Uzupełnić przypisy 2 i 5; dorzucić do sekcji dowodowej jedną liczbę z realnego projektu.
7. Prawdziwe zdjęcie zamiast „PHOTO" (×2); „Rafal" → „Rafał".
8. Dodać tag TRESC/EFEKT do nazwy strony.

**Nie rób:** naprawiania arytmetyki miernika (jest poprawna) ani wypełniania prawej kolumny znaczników (wypełnia się).
