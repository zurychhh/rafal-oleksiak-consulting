# USP — jedyne źródło prawdy

Ten plik czytają WSZYSCY agenci jako pierwszy krok każdego przebiegu. Pisze go
wyłącznie Strateg USP (co godzinę). Budujący i recenzent go nie edytują — swoje
uwagi zostawiają w `system/REVIEW.md`, skąd strateg je bierze.

## Obowiązująca wersja

**v3 — 2026-09-26 11:10 UTC (wygrała 3:0 z v2 w rundzie 4, pozycja kontrolowana)**

> Konsultant od marek FMCG i produktów kupowanych ponownie: w darmowym narzędziu
> sprawdzisz, czy klienci wracają później, niż mówi etykieta (w sklepie
> z suplementami 45 dni kontra 69) — płacisz mi za przestawienie na ten rytm
> naraz reklam, maili, subskrypcji i oferty, a nie flow po flow; pierwszy miesiąc
> to audyt i szybkie wygrane, bez minimalnego okresu; tę oś budowałem w Allegro
> z pięcioma data scientistami, w mBanku i w Booksy.

Jedno zdanie dla kupującego (EN, do strony): *The pack says 45 days. Customers
came back at 69. Check your own gap free — pay me, month by month, to re-time
your ads, emails, subscriptions and offers to it together, not one flow at a time.*

Co niesie wersję (z uzasadnień sędziów): (1) liczba 45 vs 69 — founder od razu
pyta „a jaki jest mój numer?”; (2) darmowe sprawdzenie przed płaceniem — zdejmuje
zarzut „płacę 10 500 zł, żeby poznać swoją liczbę”; (3) „naraz, nie flow po flow” —
jedyne, co odróżnia od partnera Klaviyo, któremu founder już płaci; (4) „audyt
i szybkie wygrane, bez minimalnego okresu” — bez tego sędziowie czytają „10 500 zł
za PDF”. Znany słaby punkt: zdanie PL jest przeładowane (wszyscy sędziowie) —
następny atak powinien iść w skrót bez utraty (2)–(4).

## Dowody — tylko zweryfikowane, z pochodzeniem

- Allegro: prowadził dedykowany zespół FMCG/zakupów cyklicznych z pięcioma data
  scientistami budującymi predykcję następnego opakowania per użytkownik.
- mBank: strategia retencji mOkazje na produktach zużywalnych (kawa, detergenty,
  soczewki). Projekt zamknięty.
- Booksy: ta sama arytmetyka po stronie usług cyklicznych.
- Accenture: lifecycle marketing dla marek kosmetycznych i drogeryjnych —
  KLIENT KOŃCOWY POUFNY, nigdy nie nazywać.
- GenActiv: jedyny bieżący klient (stan 2026-09-26); Rafał szuka drugiego.
- Pomiar na prawdziwych danych sklepu z suplementami (anonimowo: „anonymous
  supplement shop”): etykieta 45 dni, realna mediana odkupu 69 dni (n≈1200).
  Źródło: STATUS.md, sekcja „Kalibracja /tool danymi GenActiv”. Z nazwą
  klienta tylko po pisemnej zgodzie.
- /tool — działający przyrząd na oleksiakconsulting.com/tool.

Kontekst rynku (nie dowód o Rafale; do ostrożności w copy, sprawdzone 2026-09-26):
- Klaviyo „expected date of next order” nie uwzględnia kupionego produktu —
  https://help.klaviyo.com/hc/en-us/articles/360020919731
- Replenit (https://replen.it/) sprzedaje predykcję wyczerpania per klient i produkt
  z pojemności opakowania → NIE wolno pisać, że „nikt nie mierzy” rozjazdu etykieta
  vs odkup. Wyróżnikiem jest „naraz we wszystkich kanałach” + ślad Allegro/mBank/Booksy.

## Twarde ramy (nie do zmiany przez żadnego agenta)

- Nisza to RYNEK (FMCG i wszystko kupowane ponownie), nie dyscyplina. Retencja
  to część oferty, nie oferta.
- Cena: 10 500 zł netto / EUR 2,500 net miesięcznie, bez opłaty wstępnej, bez
  minimalnego okresu; pierwszy miesiąc to audyt as-is i szybkie wygrane.
- Pojemność: DWÓCH klientów naraz. „One client at a time” jest nieprawdą.
  Bieżący klient jest jeden (GenActiv) — nie pisać „one of the two”.
- Zero wymyślonych liczb, procentów, wyników klientów, opinii.
- Leady przychodzą z LinkedIna; Rafał nie obsługuje zimnych leadów.

## Brief dla budujących (max 3 punkty, nadpisywany przez stratega)

1. **Pierwszy ekran = rozjazd + darmowe sprawdzenie.** W pierwszym widoku (390
   i 1440 px) stoją obie liczby „pack says 45 days / customers came back at 69”
   podpisane „anonymous supplement shop” (bez nazwy klienta, produktu i liczby
   zamówień przy nim) oraz link „Check your own gap free” → /tool. Zastępuje
   wymyślony pasek „50 vs 78” (STATUS.md: PILNE). Recenzent: oba numery
   i link do /tool widoczne bez przewijania; „78”/„50”/„1 240” znikają ze strony;
   45 i 69 dopisane do ALLOWED_NUMBERS w content-rules z uzasadnieniem.
2. **Jedna oś, cztery kanały naraz.** Jedna sekcja (zamiast osobnych sekcji per
   kanał) pokazuje jedną skalę dni, na której ten sam zmierzony dzień ustawia:
   wykluczenie/powrót w reklamach, maila, interwał subskrypcji i ofertę na karcie
   produktu. Tekst zawiera wprost „together, not one flow at a time”. Recenzent:
   4 kanały na jednej skali; żadna sekcja nie mogłaby stać u partnera Klaviyo.
3. **Ścieżka /tool → rozmowa z odwróceniem ryzyka.** Wynik w /tool kończy się CTA
   do formularza („send me your gap”), a przy formularzu na `/` stoi: „First month:
   as-is audit and quick wins. EUR 2,500 net per month, no minimum term.”
   Recenzent: klik z wyniku /tool prowadzi do formularza; zdanie o pierwszym
   miesiącu i braku minimalnego okresu jest przy każdym CTA.

LUKA W DOWODACH: (a) paid — brak jakiegokolwiek dowodu, a v3 obiecuje przestawienie
reklam; (b) brak wyniku w złotówkach po przestawieniu rytmu (zarzut konkurenta:
„jeden pomiar to anegdota”). Nie wymyślać — decyzja Rafała, czy i co może podać.

## Odrzucone kierunki (nie wracać bez nowego dowodu)

- „Zegar wyczerpania” pokazujący kupującemu datę — obalony (definicja produktu,
  artefakt eee304eb).
- Samo narzędzie jako całe USP — za mało (decyzja Rafała, 2026-09-26).
- v0 „cały lejek — paid, SEO z AI, onsite, owned… narzędzia w dni, a nie
  kwartały” + „You don't pay twice for the same customer” — przegrała 0:3;
  czytana jako „agencja od wszystkiego”, hasło EN niezrozumiałe, „dni nie
  kwartały” i „pomiar, którego nikt nie ma” nie do obrony (vibe coding to
  standard 2026; Replenit). 2026-09-26.
- v1 bez darmowego sprawdzenia i bez odwrócenia ryzyka — przegrała 0:3 z v2
  („płacę 10 500 zł, żeby w ogóle poznać swoją liczbę”).
- Pretendent R3 bez „szybkich wygranych” i „month by month” — przegrał 1:2
  („pierwszy miesiąc to sam audyt = 10 500 zł za PDF”). „Naraz” z niego przeżyło.

## Dziennik stratega

Najnowszy na górze. Format: data · wersja · co zaatakowano · wynik porównania
parami (która wygrała, ile razy na ile, z odwróconą kolejnością) · co zmieniono
w briefie · co odrzucono i dlaczego.

- 2026-09-26 11:43 UTC · meta-agent · v3 przeniesiona ręcznie z Projektu do repo
  (strateg nie miał prawa pusha); dopisane fakty od Rafała: mBank zamknięty,
  GenActiv jedynym bieżącym klientem.
- 2026-09-26 11:10 UTC · v0 → v3 · zarzuty: founder — „najcenniejszy wniosek
  mam z darmowego narzędzia w 5 minut, za co 10 500 zł/mies.?”; konkurent —
  „zakres skopiuję jutro; jeden pomiar to anegdota bez złotówek”; sceptyk —
  „Replenit już sprzedaje ten pomiar; »dni nie kwartały« to standard”.
  Rundy: R1 pretendent (45 vs 69 + Allegro/mBank/Booksy) vs v0 3:0 [A,B,B] → v1;
  R2 (+darmowe sprawdzenie, audyt i szybkie wygrane, month by month) vs v1 3:0
  [B,A,B] → v2; R3 (krótszy, „naraz, nie flow po flow”, bez szybkich wygranych)
  vs v2 1:2 — zbiło „10 500 zł za PDF”; R4 (v2 + „naraz, nie flow po flow”)
  vs v2 3:0 [B,A,B] → v3. Brief: nowy — pierwszy ekran 45/69 zamiast
  wymyślonego 50/78, jedna oś czterech kanałów, ścieżka /tool → formularz
  z odwróceniem ryzyka; luki: paid, wynik w zł.
- 2026-09-26 · v0 · wersja startowa ustawiona przez meta-agenta z dokumentacji
  projektu; jeszcze nie atakowana.
