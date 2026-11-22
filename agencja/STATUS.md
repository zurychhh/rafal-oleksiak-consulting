# Agencja — stan strony oleksiakconsulting.com

Ostatni przebieg: 22.11.2026, 09:38–10:25 (przebieg 3). Gałąź: `agencja/strona` (od `claude/production` f4594c8).
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

## Uwaga Rafała 22.11 10:42 (doradca poprawił od ręki)
Nagłówek sceny white label „Your name on it, not mine.” Rafał ocenił jako „super głupie i egocentryczne”. Zmienione na
„Your brand. Your colours. Your app.” (`app/nawyko/NawykoClient.tsx`). **Zasada dla wszystkich tekstów strony:** bohaterem
jest marka klienta i jej klient, nigdy autor strony — żadnych „mine / my / I” w nagłówkach scen produktu. Przejrzyj pod tym
kątem całe `/nawyko` i `/calculator` w następnym przebiegu i uruchom bramki (ta zmiana poszła bez builda).

## Dla Rafała

**Co obejrzeć (lokalnie: `git checkout agencja/strona && npm ci && npm run build && npm start`).**

1. **`/nawyko` — od „Known in advance” w dół to teraz sceny, nie listy.** Telefon nie znika po czwartym kroku: przypięta
   scena ma siedem aktów. Akt 5: oś 30 dni — znacznik jedzie z przewijaniem, można go przeciągnąć palcem albo strzałkami,
   nagrody odpalają się w swoich dniach, telefon pokazuje ten sam dzień i kod na kolejne opakowanie. Akt 6: telefon kończy
   opakowanie („30 doses, 34 days”, cztery pominięte dni) i staje się jedną czerwoną kropką, a reszta kropek składa się
   w rozkład „którego dnia opakowanie naprawdę się kończy” obok dnia z etykiety (podpis: ilustracja, zmyślone dane).
   Akt 7: wpisujesz nazwę marki i wybierasz skórę — telefon dostaje tę nazwę (także w kodzie rabatowym), a cała strona
   zmienia kolory. Niżej: „No random rewards. No health claims. No hidden rules.” dużym krojem w jednej scenie i finał —
   formularz obok telefonu, który bierze nazwę z wpisywanego adresu sklepu. Zniknęły obie numerowane listy i trzy kolumny.
2. **`/calculator` — zbudowany od nowa.** Jedno pytanie, jeden ekran, trzy pola, jeden suwak, jedna duża czerwona liczba,
   pod nią skąd się bierze („+1.01 orders × 120 × 4,000 customers”) i ile jest wart jeden dzień. Pasek roku jednego
   klienta: kreski zamówień zsuwają się przy skracaniu odstępu, nowe dochodzą na czerwono. Jeden przycisk odsłania
   formularz, jeden link prowadzi do `/tool`. Cała strona ma ok. 150 słów (było kilka ekranów). Drugi scenariusz, sekcja
   założeń, źródła i punkty odniesienia usunięte; założenia to jedna zwijana linia.

**Dlaczego biznesowo.** Na `/nawyko` moment sprzedażowy („dostajesz prawdziwą datę ponownego zamówienia”) jest teraz
pokazany, a nie opisany, a „Twoja nazwa, nie moja” dzieje się na oczach odwiedzającego. Kalkulator w 30 sekund daje
marce jej własną stawkę i jeden krok do rozmowy; dokładny pomiar zostaje w `/tool`.

**Dowód.**
- Zrzuty `/nawyko`: `agencja/podglad/nawyko3-1440-a5-mid.png`, `-a6-end.png`, `-a7.png`, `-a7-night.png`,
  `-never-night.png` i te same z `nawyko3-390x844-…` (finał z wpisaną nazwą obejrzałem, zrzutu nie zapisuję w repo).
  **Nagrania przewijania nie zrobiłem** (zabrakło czasu); recenzent oceniał serię zrzutów i pomiary, nie film.
- Zrzuty kalkulatora: `agencja/podglad/kalkulator2-1440-a.png`, `kalkulator2-390-a.png` (stan końcowy),
  `kalkulator2-1440-b.png`, `kalkulator2-390-b.png` (sprzed ostatniej poprawki podpisów).
- Bramki lokalnie 22.11 po ostatniej zmianie: build OK · `tsc --noEmit` OK · lint 0 błędów, 1 ostrzeżenie (jak przed) ·
  `qa.js` PASS na `/nawyko` i `/calculator` (po ostatniej zmianie) oraz na `/`, `/tool` (bez klucza AI), `/stop`
  (uruchomione przed dwiema ostatnimi poprawkami, które tych tras nie dotykają) · `content-rules` PASS ·
  `tool-rules` OK · `ship-compare` PASS · `calculator-model.test.mjs` OK. Lighthouse nieuruchamiany.
- Niezależne recenzje: `agencja/recenzje/03-nawyko-sceny.md` — pierwsze podejście: 10 z 12 punktów, niezaliczone
  płynność (skok paska postępu między aktami) i klawiatura (niewidoczny „Skip to content”, akty 5–7 nieosiągalne).
  Poprawione; drugie podejście (`agencja/recenzje/04-kalkulator-v2.md`, część B): pasek stoi w miejscu, link widoczny,
  przesunięcie układu całej strony 0,0098, wpisana nazwa trafia na telefon; klawiatura „częściowo” — po tej uwadze
  dopisałem przeniesienie fokusu do kontrolki aktu (sprawdzone jednym testem dla aktu 7, **bez trzeciej recenzji**).
  Kalkulator: 10 z 11 punktów; niezaliczone „liczba wynika z paska” (pasek liczył pełne zamówienia, liczba ułamki) —
  poprawione (pasek pokazuje „6.3 → 7.3 orders”), dopisane zdanie „A ceiling, not a forecast” i wartość jednego dnia.
  **Tych trzech poprawek kalkulatora recenzent już nie oglądał.**
- Waga: skrypty `/nawyko` 148 kB wobec 152 kB `/calculator` i 177 kB `/tool` (pomiar recenzenta, transfer).
- Podgląd Vercel: wynik tego pusha podaję w wiadomości końcowej; limit wdrożeń konta trwa do ok. 19:10 22.11.

## Czeka na Rafała

**Nowe z przebiegu 3:**

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

1. Punkt 3 priorytetu: krytyczny przegląd układu całej strony + dwa warianty pierwszego ekranu i nawigacji (`/lab/a`,
   `/lab/b`, `noindex`).
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

## Decyzje podjęte samodzielnie (odwracalne)

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
