# Skąd wziąć dane o interwałach, zanim będą klienci

## 1. Eksport z GenActiv — do zrobienia od razu

W panelu Shopify: **Orders → Export → All orders → CSV for Excel, Numbers, or other
spreadsheet programs**. Zakres dat: wszystko, co jest (minimum dwanaście miesięcy, bo
interwał w kolostrum ma medianę rzędu dwóch miesięcy i przy krótszym oknie zobaczysz
same pierwsze zakupy).

Z pliku potrzebne są cztery kolumny i tylko one:

    Created at · Email · Lineitem name · Lineitem quantity

Zanim wkleisz cokolwiek do narzędzia, **podmień adresy e-mail na numery**. W arkuszu:
posortuj po Email, w nowej kolumnie wpisz 1 i przeciągnij z regułą „taki sam adres =
ten sam numer" (albo `=IF(B2=B1,C1,C1+1)`). Nic się przez to nie psuje — narzędzie parujе
zamówienia po identyfikatorze kupującego, nie po adresie — a z pliku znika dana osobowa,
zanim trafi do przeglądarki. Tytuły produktów zostają, bo to one idą do modelu po
gramaturę; to nie są dane osobowe.

Do panelu „AI · the label" przygotuj osobno: nazwa rodziny produktu i przepisana
**instrukcja producenta z etykiety**, jedna na linię. Dosłownie z opakowania, nie z opisu
marketingowego.

Czego szukamy w wyniku: mediana odstępu między kolejnymi zamówieniami tego samego
kupującego, per rodzina, obok dni zapasu z etykiety. To jest pierwszy prawdziwy wiersz
benchmarku i pierwszy dowód, że narzędzie chodzi po nie-swoich danych.

---

## 2. Korpus publiczny — strona opakowania, za darmo i legalnie

**NIH DSLD** (Dietary Supplement Label Database) — około dwustu tysięcy etykiet
suplementów przez otwarte API, bez klucza:
`https://api.ods.od.nih.gov/dsld/v9/label/{id}`. Zwraca `netContents`, `servingsPerContainer`
oraz `servingSizes` z `minDailyServings`/`maxDailyServings`. Dni zapasu wychodzą z tego
rachunkiem, nie zgadywaniem. Dane rządu USA, domena publiczna. To jest najmocniejsze
darmowe źródło, jakie znalazłem, i nikt w tej kategorii go nie używa.

**leki.pl** — polski odpowiednik dla naszego rynku: EAN w adresie
(`/suplement/{slug}/{EAN}/`), osobne pola na wielkość opakowania i dawkowanie. Przykład
zweryfikowany: witamina D, „30 kaps.", „1 kapsułka raz dziennie" → trzydzieści dni.

**WHO ATC/DDD Index** (`atcddd.fhi.no`) — zdefiniowana dawka dobowa per substancja.
Sztuki w opakowaniu podzielone przez DDD dają dni zapasu dla każdego OTC.

**FEDIAF Nutritional Guidelines** — kcal na kilogram masy ciała psa i kota, czyli gramy
dziennie, czyli dni na worek. Darmowy PDF.

**A.I.S.E. consumer habits survey** — europejskie badanie: ile prań i zmywań na tydzień
w gospodarstwie domowym. Dzieli liczbę dawek w opakowaniu na dni zapasu dla chemii.
Bez rozbicia na Polskę, tylko regiony.

**Tytuły na Amazon.pl i .de** — sprzedawcy suplementów wpisują czas trwania wprost
w nazwę: „180 kapsułek, 2 dziennie, 3 miesiące", po niemiecku „Monatsvorrat". Regex po
tytułach z list kategorii daje tysiące deklaracji producenta o dniach zapasu.

## 3. Korpus publiczny — strona przekonania marki

Sklepy na Shopify wystawiają swoje plany subskrypcyjne publicznie, ale **nie** w
`/products.json` — dopiero w Ajax Product API: `/products/{handle}.js` niesie
`selling_plan_groups` i `selling_plan_allocations`, a w `selling_plan.options` stoi
interwał („Delivery every: 2 weeks"). Ścieżka: `/sitemap_products_1.xml` → po kolei `.js`.
To jest własna deklaracja marki o tym, jak szybko jej produkt się zużywa.

Amazon Subscribe & Save pokazuje częstotliwość per ASIN, ale bez publicznego API,
a scraping łamie ich regulamin — zostawiamy.

## 4. Rzecz, którą da się opublikować bez jednego klienta

Zestaw punktu 2 z punktem 3 i masz wynik: **co mówi etykieta kontra co marka sama
ustawiła w subskrypcji**. Etykiety wychodzą na dwadzieścia jeden albo czterdzieści pięć
dni, a domyślne interwały gromadzą się na trzydziestu — bo rozliczenie jest miesięczne,
nie dlatego, że tak schodzi produkt. Trzysta kart produktowych w jednej kategorii to
weekend roboty i zero cudzych danych.

Ostrzeżenie, żeby tego nie zmarnować: **to nie jest treść na LinkedIn** — bez zasięgów
nie dotrze nigdzie. To jest przedmiot do zacytowania w wiadomości bezpośredniej:
„przejrzałem trzysta kart w twojej kategorii; twoja subskrypcja stoi na trzydziestu
dniach, a twoja własna etykieta mówi dwadzieścia jeden — oto twój wiersz, wrzuć swój
eksport i zobaczysz, która liczba jest prawdziwa". W publikacji agregaty, nazwa marki
wyłącznie w wiadomości do tej marki.

## 5. Jak zbierać interwały dalej

**Wkładka kontrybucyjna w narzędziu.** Po policzeniu lokalnie narzędzie proponuje
„porównaj się z medianą kategorii" w zamian za wysłanie agregatu: kategoria z zamkniętej
listy, dni zapasu z etykiety, mediana odstępu, kwartyle, liczba par powtórzeń, udział
niepowracających, plus solony skrót domeny sklepu do deduplikacji. Nic więcej — żadnych
SKU, cen, dat ani pola tekstowego, bo wolny tekst wynosi nazwy marek. Wiersze poniżej
trzydziestu par powtórzeń odrzucane. Agregacja dzieje się w przeglądarce, więc to, co
wychodzi, nie jest daną osobową i nie potrzebuje zgody podmiotu danych — ale **pokaż
sprzedawcy dokładny JSON z przyciskiem kopiuj, zanim cokolwiek wyśle**. Ten podgląd jest
mechanizmem konwersji, nie formalnością.

**Barter z agencjami.** Agencje nie chcą danych, chcą czegoś fakturowalnego i czegoś, co
ładnie wygląda na przeglądzie kwartalnym. Oferta: jednostronicowy raport pod ich marką
dla każdego klienta — interwał klienta kontra mediana kategorii, z dwiema wycenionymi
akcjami. Dwie agencje, które już znasz, po pięć sklepów, w zamian agregaty. To ma
najwyższy sufit ze wszystkiego tutaj. Dostawcy aplikacji subskrypcyjnych odczytają cię
jako konkurencję — dwie rozmowy, nie dwadzieścia.

**Klauzula w umowie, od następnego zlecenia.** „Konsultant może zachować i wykorzystywać
zagregowane, zanonimizowane statystyki wyprowadzone z danych Klienta", z progiem
agregacji podanym liczbą, kasowaniem surowych danych po trzydziestu dniach, zakazem
re-identyfikacji, zakazem publikacji przypisywalnej Klientowi i prawem Klienta do
wycofania się. Postaw to jako jawny punkt z odwzajemnieniem (darmowe coroczne odświeżenie
benchmarku) — schowana ginie przy negocjacji, jawna i wzajemna przechodzi.

## 6. Płatne, gdyby kiedyś było warto

**PEX PharmaSequence** to polski panel sprzedaży aptecznej i jako jedyny realnie niesie
sztuki opakowań, nie samą wartość, w tygodniowej granulacji. Jednorazowy wyciąg dla jednej
kategorii to niskie pięć cyfr w złotych. IQVIA, NielsenIQ i GfK to subskrypcje roczne za
sześć cyfr — poza zasięgiem i bez sensu na tym etapie.

## Kolejność, bez owijania

Najpierw eksport GenActiv, bo to jeden popołudniowy ruch i zamienia narzędzie
z nieprzetestowanego w policzone na prawdziwym sklepie. Potem weekend na zestawienie
etykiet z domyślnymi interwałami w jednej kategorii — suplementy, bo masz w nich
referencję. Wkładka kontrybucyjna w tym samym tygodniu, żeby żadna rozmowa się nie
zmarnowała. Klauzula do następnej umowy, zanim będzie negocjowana. Realny korpus po
sześciu miesiącach: kilkanaście do dwudziestu kilku sklepów w jednej kategorii — wąsko,
ale publikowalnie, czego szeroki i cienki nie byłby.
