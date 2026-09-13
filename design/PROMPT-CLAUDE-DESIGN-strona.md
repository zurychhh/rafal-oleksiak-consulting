# Prompt do Claude Design — 5 kierunków strony głównej (wersja po 5 pętlach)

Wklej wszystko poniżej linii do Claude Design. Jeden run = jedno płótno z pięcioma kierunkami.

---

Projektujesz stronę główną dla jednoosobowej firmy konsultingowej. Jeden ekran, jedna teza,
jedna grafika, jedno CTA. Chcę pięciu **rozbieżnych** kierunków, nie pięciu odcieni jednego.
Treść strony po angielsku, rozmawiamy po polsku.

## Kto i dla kogo — fakty, nie zgaduj

Rafał Oleksiak. Konsulting e-commerce FMCG end to end: paid, search łącznie z odpowiedziami AI,
storefront, CRM, subskrypcja, lojalność. Warszawa. Ma miejsce dokładnie na jednego klienta.

Kupujący: założyciel albo head of growth marki DTC robiącej mniej więcej 1–30 mln EUR online.
Firma 6–40 osób. Wchodzi z feedu LinkedIna, w 60–75% z telefonu, daje stronie 10–40 sekund
między dwiema innymi rzeczami. Nie szuka konsultanta.

Pytanie, które ma naprawdę w głowie, brzmi **„w co to się zamieni"** — nie „czy on jest dobry".
Widział już, jak agencja albo senior produkuje audyt, deck i pół roku bez przychodu. Tego się boi
bardziej niż przepalonego budżetu.

Czego nie traktujesz jako atutu: piętnastu lat stażu, Accenture, logotypów korporacji. Dla tego
kupującego to czyta się jako wolno, drogo, komitet, warsztat odkrywczy. Jeżeli już używasz
przeszłości, to jako **rozpiętość** (marketplace z milionami użytkowników i firma z jedenastoma
osobami), nigdy jako prestiż.

## Jedyny majątek, jaki ta strona ma

Druga liczba: **dzień, który sugeruje etykieta opakowania, kontra dzień, w którym klient naprawdę
wraca po to samo.** Na realnych danych anonimowego sklepu z suplementami — 4,8 roku zamówień,
1 197 przerw między pierwszym a drugim zakupem — etykieta mówi 45 dni, kupujący wraca w 69.
Dwadzieścia cztery dni, przez które reklamy, strona i mailing mówią do pełnej szafki.

Ta rozbieżność jest tezą strony. Każdy z pięciu kierunków ma ją postawić inaczej — innym zdaniem,
inną formą, innym trybem wejścia w rozmowę. Nie pięć razy to samo zdanie w pięciu scenografiach.

Oferta, gdyby była potrzebna na ekranie: dwa–trzy tygodnie, stała cena 8–12 tys. zł net ustalona
z góry, bez retainera i bez płatnego discovery. Żadnego linku do kalendarza — „wskoczmy na calla"
to nazwana alergia tego kupującego.

## Reguła rozbieżności — najważniejsza rzecz w tym briefie

Każdy kierunek musi mieć własne trzy rzeczy, nierozmienne między kierunkami:

1. **Inny claim.** Pięć różnych zdań, nie pięć parafraz jednego. Jeżeli dwa claimy da się zamienić
   miejscami i nic się nie stanie, to jest jeden kierunek, nie dwa.
2. **Inny mechanizm wizualny.** Nie inny kolor i nie inny krój — inny sposób, w jaki ekran niesie
   informację. Skala, sekwencja, nieobecność, materiał, pomiar — to są różne mechanizmy.
   Odcienie beżu to nie są.
3. **Inny tryb CTA.** Pięć różnych sposobów, w jakie founder zostawia po sobie ślad. Formularz
   z adresem, wejście do narzędzia, zabranie czegoś ze sobą bez podawania adresu, odpowiedź na
   jedno pytanie, coś piątego, czego nie podpowiadam.

Test jednego kadru: każdy kierunek musi być rozpoznawalny ze zrzutu bez tekstu. Jeżeli po zdjęciu
liter zostaje pięć podobnych jasnych prostokątów — zacznij od nowa.

Test jednego zdania: opisz każdy kierunek jednym zdaniem, którego **nie da się** zastosować do
pozostałych czterech. Wpisz to zdanie w notatkę przy artboardzie. Jeżeli nie umiesz go napisać,
kierunek nie istnieje.

## Czym w tym projekcie jest „grafika"

Rysujesz w HTML/CSS/SVG, więc fotografii stockowej ani obrazu z generatora tu nie ma i dobrze.
Grafika ma **nieść daną**, nie dekorować przestrzeni: 45 kontra 69, sześć kategorii z sześcioma
różnymi zegarami, przerwa między dwoma punktami w czasie. Ma być własnością tej marki — taka,
którą da się powtórzyć na karcie do LinkedIna, w PDF i w mailu, i wciąż będzie rozpoznawalna.

Rodziny, które wchodzą w grę: rysunek techniczny i skala pomiarowa; system typograficzny, w którym
sama liczba jest ilustracją; forma generatywna sterowana danymi (siatka, rytm, faza, przesunięcie).
Wolno wyjść poza tę trójkę, jeśli masz coś lepszego — ale powiedz, dlaczego.

Czego nie ma: ludzi przy szklanym stole, abstrakcyjnych gradientowych kul, ikon z biblioteki,
wykresu słupkowego udającego ilustrację, ani niczego, co wygląda jak render produktu z Midjourney.

## Zakazy, nazwane po imieniu

Hero z gradientem i hasłem o wzroście. Trzy kolumny z ikonkami. Karuzela logotypów. Sekcja
„Our Process" w czterech krokach. Timeline „About us". Niebieski jako kolor zaufania. Playfair
Display i Cormorant jako skrót do słowa „editorial" — to jest dziś ten sam szablon co gradient,
tylko droższy w druku. Modale, karuzele, pętle autoplay, liczniki odliczające.

Osobno: poprzednia wersja tej strony przewróciła się w drugą stronę i tego też nie powtarzaj —
gęste ramki 1 px, kafle z obwódką, monospace w tekście czytanym, ekran, który wygląda jak terminal
albo arkusz. Ma oddychać.

## Co jest już zamrożone i nie podlega projektowaniu

To nie jest design system — tego jeszcze nie ma i powstanie dopiero z wybranego kierunku.
To są ograniczenia wdrożeniowe, które musisz znać teraz, żeby nie zaprojektować czegoś,
czego nie da się zbudować:

Strona stoi na statycznym Next.js i jest przenoszona ze źródła HTML, więc wszystko, co
narysujesz, musi dać się wyrazić w HTML, CSS i SVG. Zero bibliotek komponentów.

Fonty są hostowane lokalnie i **żadne żądanie do Google Fonts nie wychodzi na produkcji** —
to twarda zasada tego projektu. W makiecie możesz linkować cokolwiek, ale przy każdym
kierunku napisz, jakiego kroju użyłeś i czy da się go legalnie zhostować u siebie. Maksymalnie
jedna nowa rodzina na kierunek; w repo są już IBM Plex i Archivo i jeżeli któryś kierunek
obroni się na nich, to jest przewaga, nie ograniczenie.

Kolory, skalę typograficzną i odstępy dobierasz per kierunek i podajesz **konkretnymi
wartościami** w notatce, nie przymiotnikami. Z wybranego kierunku zbuduję potem system —
dlatego wartości mają być decyzjami, a nie przypadkiem.

## Twarde ramy

Słowa: maksymalnie dwadzieścia pięć widocznych słów w pierwszym ekranie i maksymalnie dziewięćdziesiąt
na całej stronie. Policz je i podaj obie liczby przy każdym kierunku.

Napięcie, które masz rozwiązać, a nie obejść: enigmatyczność kontra sprzedaż. Jeżeli po dziesięciu
sekundach odbiorca nie wie, co ta firma robi i komu pomaga, kierunek jest zły — i wtedy błąd leży
w claimie, nie w limicie słów. Nie proś mnie o więcej miejsca, napisz lepsze zdanie.

Każdy kierunek dostarczasz w dwóch artboardach: desktop 1440 i telefon 390. Telefon nie jest
ściśniętym desktopem — to większość ruchu, więc projektujesz go jako osobną decyzję w tym samym
świecie wizualnym.

Kontrast tekstu głównego minimum 12:1, każdego innego tekstu minimum 4,5:1, a od 24 px minimum 3:1.
Żaden pojemnik z tekstem nie ma sztywnej wysokości razem z overflow hidden. Strona ma działać
z klawiatury i z czytnikiem ekranu. Animacja tylko wtedy, gdy niesie narrację — jeśli jej nie
niesie, wytnij ją sam, zanim ja o to poproszę.

## Co ma wyjść

Jedno płótno, pięć kierunków obok siebie, każdy z nazwą własną (nie „Wariant 1"). Pod każdym
notatka, prozą, sześć rzeczy:

idea przewodnia w jednym zdaniu z testu wyżej · mechanizm, czyli co dokładnie niesie informację ·
ton copy z jednym przykładowym zdaniem hero dosłownie · ryzyko, czyli w którym miejscu ten kierunek
pęknie · koszt wdrożenia w statycznym Next.js liczony w dniach · kto to pochwali.

To ostatnie jest testem, nie ozdobą: jeżeli jedyni ludzie, którzy to pochwalą, to inni marketerzy
w komentarzach, kierunek jest zły i masz to napisać wprost przy nim.

## Brama, zanim mi to pokażesz

Zrób sześć kierunków, oceń je sam, zabij najsłabszy i pokaż pięć. Napisz jednym zdaniem, który
zginął i dlaczego.

Na koniec rekomendujesz jeden kierunek i uzasadniasz wybór zachowaniem tego konkretnego kupującego,
nie własnym gustem. Jeżeli twoja rekomendacja jest inna niż ta, którą uznasz za najodważniejszą —
powiedz to i nazwij różnicę. „Wszystkie są dobre" nie jest odpowiedzią.
