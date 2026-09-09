# Daily loop — the three instruments

Pamięć tej pętli. Każde uruchomienie startuje w pustej sesji i czyta wyłącznie ten
plik. Wszystko, co ma przetrwać do jutra, musi tu wylądować.

Plik roboczy: `design/tools/three-instruments.html` (jeden plik, bez zależności).
Gałąź: `tools/daily`. Opublikowany artefakt jest produkcją i pętla go NIE dotyka.

## Rotacja

Jedno narzędzie dziennie, po numerze dnia w roku modulo 3:

- 0 → 01 Readiness (drabina + wyciąganie gramatury z tytułów)
- 1 → 02 Empty Calendar (krzywa wygasania + pisanie czterech wysyłek)
- 2 → 03 How Long It Lasts (blister + odczyt tempa z wypowiedzi kupującego)

Jedno narzędzie na raz. Trzy płytkie przejścia są gorsze niż jedno głębokie.

## Rubryka — w tej kolejności ważności

0. **Zakres — nadrzędne.** Nisza to RYNEK (FMCG, wszystko co się kupuje
   ponownie), nie dyscyplina. Cały lejek: jakość ruchu płatnego, SEO wraz z
   odpowiedziami AI, konwersja onsite (standalone, Shopify, WooCommerce),
   kanały własne (CRM, automation, e-mail, push), zakupy cykliczne, lojalność.
   Retencja jest ważna, bo kategoria jest powtarzalna — ale nie jest całą
   ofertą. Zdanie zawężające Rafała do retencji jest błędem do cofnięcia.
   Pytanie kontrolne: czym według foundera ten człowiek się zajmuje.
0b. **RTB i USP — nadrzędne, na równi z zakresem.** Trzy przyrządy nie są
   ilustracją tekstu na stronie. Są dowodem oferty i przewagą: Rafał buduje je
   sam i szybko, AI vibe codingiem, i tego klient nie dostanie od agencji ani
   od konkurenta w FMCG. Każdy przyrząd musi spełniać trzy warunki naraz:
   (a) działa na danych, które klient ma pod ręką, w minutę, bez wdrożenia;
   (b) odpowiada na pytanie specyficzne dla FMCG, którego generyczne narzędzie
   marketingowe nie zadaje; (c) da się z niego wyjść na „zbuduję ci takie na
   twoich danych", i ta ścieżka ma być widoczna. Pytania kontrolne do
   ewaluatora-foundera, oba obowiązkowe: czy widział coś takiego u kogokolwiek
   innego, ORAZ czy chciałby mieć taką rzecz u siebie. Odpowiedź „ładny
   kalkulator", „demo" albo „widziałem podobne" to wynik zerowy.
1. **Szew AI.** Czy prompt zwraca to, co trzeba, na wejściach z listy niżej?
   Czy błędy są obsłużone kodem, a nie treścią komunikatu? Czy strona ma sens,
   gdy `claude.use("sample")` zwróci null?
2. **Prawdziwość.** Żadnej liczby, której nie da się obronić. Wszystko, co
   narzędzie twierdzi o sklepie, pochodzi z wejścia użytkownika albo z AI —
   nigdy z założenia wpisanego na sztywno.
3. **Mniej słów.** Każde zdanie, które da się skrócić bez straty, jest do
   skrócenia. Strona rosnąca o akapit dziennie to porażka pętli, nie sukces.
4. **Czytelność bez czytania.** Czy stan widać z kształtu i koloru, zanim
   ktokolwiek przeczyta zdanie?
5. **Dostępność i układ.** QA musi przechodzić na dziewięciu szerokościach.

## Wejścia testowe — stałe, nie zmieniaj ich bez wpisu w dzienniku

**01 · wyciąganie gramatury.** Prompt dostaje te tytuły i musi zwrócić units,
unit, perDay, days dla co najmniej czterech z sześciu:

    Colostrum Premium 40% IgG 120 kaps.
    Odżywka białkowa WPC 80 — 2270 g, wanilia
    Krem nawilżający na dzień 50 ml
    Kapsułki do prania Universal 60 szt.
    Karma sucha dla psa dorosłego 12 kg, średnie rasy
    Zestaw prezentowy — świeca zapachowa

Ostatni jest pułapką: to nie jest produkt, który się zużywa w cyklu. Poprawna
odpowiedź to null z notatką, nie zmyślona liczba dni.

**02 · cztery wysyłki.** Dla `colostrum sachets`, pack 30, dni 15/23/30/37.
Każda wiadomość musi odwoływać się do miejsca w opakowaniu. Zero rabatów, zero
wykrzykników, temat do ośmiu słów. Wysyłka, która mogłaby stać w dowolnej
kategorii, jest błędem.

**03 · odczyt tempa.** Cztery wypowiedzi, pack 60 sztuk, domyślnie 2 dziennie:

    "I'm 82 kg and I train five times a week"      → tempo rośnie, uzasadnione
    "mam labradora, 32 kg"                          → przelicza na wagę psa
    "biorę raz dziennie, rano"                      → 1/dzień, 60 dni
    "nie wiem, jak się to bierze"                   → zostaje 2, mówi wprost

## Zasady jednego przebiegu

- Maksymalnie **dwie zmiany**: jedna w szwie AI, jedna gdzie indziej.
- Zmiana bez uzasadnienia w kategoriach rubryki nie wchodzi.
- `node qa.js ../tools/three-instruments.html --scroll` musi przejść. Nie
  przechodzi → cofnij zmianę, nie obchodź QA.
- Nigdy nie usuwaj działającej funkcji, żeby uprościć. Upraszczaj słowa.
- Nie powtarzaj pomysłu odrzuconego w dzienniku.
- **Przyrządy są RTB, nie ozdobą.** Każda zmiana ma powiększać dystans do
  tego, co klient może dostać gdzie indziej. Zmiana czyniąca przyrząd bardziej
  generycznym — takim, jaki każda agencja mogłaby wkleić u siebie — jest
  błędem do cofnięcia, nawet jeśli podnosi UX.
- **Bodziec dla ewaluatora-foundera MUSI zawierać szwy AI.** Panele AI chowają
  się same, gdy strona nie ma `window.claude`, więc tekst wyciągnięty z
  przeglądarki nie zawiera ani jednego z trzech szwów — a to znaczy, że każda
  dotychczasowa ocena biznesowa przyrządów jest oceną samych kalkulatorów, i że
  reguły RTB/USP nie da się w ogóle zmierzyć, bo RTB siedzi dokładnie w tych
  szwach. Zanim zmierzysz cokolwiek innego: dołóż do bodźca statyczny tekst
  każdego panelu AI plus jedną realną odpowiedź modelu z wejść testowych, w tym
  samym formacie przed i po. Wyniki sprzed tej poprawki traktuj jako dotyczące
  kalkulatorów, nie przyrządów.
- **Ścieżka od przyrządu do zlecenia musi istnieć i być widoczna** na obu
  plikach: przyrząd pokazuje, że te rzeczy powstają szybko i na zamówienie,
  strona odwołuje się do nich jako do dowodu, a nie tylko je opisuje. Brak tej
  ścieżki traktuj jak usterkę, nie jak brakujący dodatek.

## Dziennik

Najnowszy wpis na górze. Format: data, narzędzie, ocena wejść testowych przed
i po, co zmienione, co odrzucone i dlaczego.

---
