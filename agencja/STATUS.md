# Agencja — stan strony oleksiakconsulting.com

Ostatni przebieg: 22.11.2026, 15:26–15:45 (przebieg 5, jednorazowy na Twoje polecenie: 1a–1d). Przed nim przebieg 4 (14:55–15:30). Gałąź: `agencja/strona` (od `claude/production` f4594c8).
Na produkcję nic nie poszło — wypuszcza wyłącznie Rafał.

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

## KOLEJKA od Rafała (22.11.2026 18:20, po przeklikaniu podglądu) — NAJNOWSZA, czytaj pierwszą. Nie startować bez słowa Rafała (mało limitu).

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

**Nowe z przebiegu 4:**

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

0. **Kalkulator v3** (priorytet NAJNOWSZY, pkt 2): makieta jednego ekranu → czytelnik-kupujący na makiecie → budowa.
   Bohater = wartość jednego dnia z walutą; suwak ograniczony do dnia końca opakowania; rok klienta jako główna scena.
0b. `/nawyko`: zrobione w przebiegu 5 (powrót telefonu, klawiatura, rozdział na 390). Zostało: na 390 nawigacja aktów
   jest ukryta (Tab prowadzi przez kroki 01–04, ale nie do aktów 5–7 bez przewijania); wersja `prefers-reduced-motion`
   nie pokazuje zdrapki (pierwszy telefon od razu na nagrodzie).
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
