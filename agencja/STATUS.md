# Agencja — stan strony oleksiakconsulting.com

Ostatni przebieg: 21.11.2026, 19:38–20:10 (przebieg 2). Gałąź: `agencja/strona` (od `claude/production` f4594c8).
Na produkcję nic nie poszło — wypuszcza wyłącznie Rafał.

## PRIORYTET od Rafała (22.11.2026 09:01, przekazuje doradca) — przeczytaj przed kolejką

Rafał obejrzał zrzuty `/nawyko` i powtórzył wymaganie: **strona ma mieć efekt wow.** Ocena doradcy po obejrzeniu zrzutów:
obecna wersja jest czysta, spójna i bez kiczu, ale za grzeczna — to elegancka strona informacyjna, nie pokaz na poziomie
stron produktowych Apple. Najbliższe przebiegi robią WYŁĄCZNIE to, dopóki niezależny recenzent nie da „wow: tak”:

1. **Scena z telefonem jako spektakl, nie ilustracja.** Telefon większy i bliżej (wejście z głębi / skali przy pierwszym
   przewinięciu), warstwy z paralaksą (tło, telefon, elementy wylatujące z ekranu: karta, pieczątka, kod nagrody),
   płynne przejścia między krokami zamiast podmiany treści, światło/cień reagujące na przewijanie. Ruch ma nieść znaczenie
   (każdy efekt pokazuje mechanikę produktu), nie ozdabiać.
2. **Moment nagrody.** Dzień 24: siatka dopełnia się, pieczątka „wbija się” z fizyką (sprężystość, krótki akcent),
   kod nagrody odsłania się jak karta. To ma być chwila, którą odwiedzający zapamięta. Zdrapka: faktura, opór, drobiny
   znikającej warstwy, natychmiastowa reakcja licznika serii.
3. **Pierwszy ekran.** Hasło i pasek 30 dni zostają, ale wejście ma żyć: sekwencja pojawiania, pasek wypełniający się
   w rytmie, telefon zapowiedziany już w pierwszym ekranie.
4. **White label na żywo.** Przełączenie motywu marki ma być efektowne (przemalowanie całej sceny w ruchu), bo to jest
   sprzedażowy argument „Twoje logo”.
5. Granice bez zmian: płynność 60 kl./s na telefonie (zmierz), CLS ~0, `prefers-reduced-motion`, brak nowych ciężkich
   bibliotek bez sprawdzenia licencji i wagi, paleta i typografia strony, zero prawdziwych marek, zero kiczu.
   Recenzent ocenia na NAGRANIU przewijania (Playwright video) na 390 i 1440, nie na zrzutach; nagrania zapisuj do
   `agencja/podglad/` (krótkie, skompresowane), żeby Rafał mógł je obejrzeć bez uruchamiania strony.
6. **Vercel:** limit wdrożeń konta („retry in 24 hours” od 21.11 19:10). Jeden push na przebieg, na końcu. Gdy podgląd
   się zbuduje, wpisz jego adres na samej górze bloku „Dla Rafała”.
7. `/calculator` nie rozwijaj, dopóki punkt 1–4 nie przejdzie recenzji; Rafał go jeszcze nie oglądał.

## Dla Rafała

**Co.** Jest nowa podstrona **`/calculator`** — kalkulator „ile jest wart jeden dzień między zamówieniami”.
Odwiedzający wpisuje cztery liczby ze swojego sklepu (klienci kupujący ponownie, średnia wartość zamówienia, dni między
zamówieniami, na ile dni starcza opakowanie) i przesuwa suwak docelowego odstępu. Na rysunku „jeden klient, jeden rok”
widzi kreski zamówień, czarne paski dni z produktem i czerwono kreskowane dni, w których produkt się skończył, a zamówienia
jeszcze nie ma — przy przesuwaniu suwaka czerwień się kurczy, zamówień w roku przybywa, a wielka liczba pod spodem rośnie.
Do tego: ile jest wart jeden dzień, jaki rabat na ponowne zamówienie jeszcze się opłaca, górna granica. Drugi, mniejszy
kalkulator: ilu więcej nowych klientów na stu wraca po drugi zakup (siatka 100 kratek). Niżej założenia, trzy sprawdzone
punkty odniesienia ze źródłem i zdaniem „czego ta liczba nie mówi”, przejścia do `/tool` i `/nawyko`, formularz.
Liczby startowe są wyraźnie oznaczone jako przykład; nic z kalkulatora nie jest nigdzie wysyłane.

Na `/nawyko`: drugie podejście recenzenta (9 z 10 punktów), zdrapka sprawdzona dotykiem w emulacji iPhone’a (seria rośnie
z 8 na 9, strona się przy tym nie przewija), scena przestała podskakiwać po pojawieniu się paska cookies, usunięte
„within 24 hours” z potwierdzenia formularza (nie umiem tego potwierdzić — patrz decyzja 8).

Na całej stronie: z każdej trasy zniknęło pobieranie nieużywanego zdjęcia 186 kB (z audytu) — każda podstrona jest
lżejsza o ok. 180 kB.

**Dlaczego biznesowo.** Kalkulator to pierwszy na stronie powód, żeby marka FMCG zostawiła zapytanie, zanim cokolwiek
kupi: sama wylicza sobie stawkę (ile kosztuje ją każdy pusty dzień), a pod wynikiem ma przycisk do rozmowy. Jednocześnie
uczy języka, którym sprzedajesz — odstęp, dni zapasu, drugi zakup — i naturalnie prowadzi do narzędzia i do Nawyko.

**Dowód.**
- Zrzuty kalkulatora: `agencja/podglad/kalkulator-1440-pierwszy-ekran.png`, `kalkulator-1440-odstep.png`,
  `kalkulator-1440-drugi-zakup.png`, `kalkulator-1440-wlasne-liczby.png`, `kalkulator-1440-cala.png` i te same dla `390`
  (plus `kalkulator-360-wlasne-liczby.png`, `kalkulator-390-wielkie.png` — skrajnie duże liczby).
- Zrzuty `/nawyko` po poprawce sceny: `nawyko-1440-zdrapka.png`, `nawyko-1440-nagroda.png`, `nawyko-1024-nagroda.png`.
- Bramki (lokalnie, 21.11, po ostatniej zmianie): build OK · `tsc --noEmit` OK · lint 0 błędów, 1 ostrzeżenie (tyle samo
  co przed) · `qa.js` PASS na `/calculator`, `/nawyko`, `/`, `/tool` (bez klucza AI — panele schowane), `/stop` ·
  `content-rules` PASS · `tool-rules` OK · `ship-compare` PASS · test wzorów `scripts/calculator-model.test.mjs` OK.
  Formularz lokalnie: 503 (brak kluczy — oczekiwane). Przesunięcie układu (CLS): kalkulator 0,002 (pomiar recenzenta);
  `/nawyko` 0,016 na 1024 (było 0,059) i 0,010 na 1440 (było 0,033). JS trasy `/calculator` o ok. 3% większy niż `/nawyko`
  i mniejszy niż `/tool` (pomiar transferu, nie Lighthouse — Lighthouse w tym przebiegu nie uruchamiałem).
- Niezależne recenzje: `agencja/recenzje/02-kalkulator.md` — pierwsze podejście 10/11 (brak kroku pod wynikiem),
  po poprawkach **11/11**, 13 z 14 usterek naprawionych; z siedmiu nowych uwag drugiego podejścia poprawione wszystkie
  poza jedną kosmetyczną (ułamek dnia w polu odstępu zaokrągla się do pełnych dni — jest to napisane przy polu).
  **Tej ostatniej rundy poprawek recenzent już nie oglądał**; przeszły bramki i mój przegląd zrzutów.
  `agencja/recenzje/01-nawyko-podejscie-2.md` — 9/10.
- Źródła trzech liczb na stronie otwarte ponownie 21.11 (`agencja/research/kalkulator-weryfikacja.md`): Recharge
  i Ipsos potwierdzone; badanie o aplikacjach (Marketing Science 2019) potwierdzone częściowo, więc z tekstu wypadło
  „w USA” i opis branży. Narzędzie odczytu zwraca tylko fragmenty stron — przed produkcją kliknij trzy linki sam (5 minut).
- Podgląd Vercel: status buildu da się odczytać dopiero po pushu, a pushuję raz na przebieg (limit buildów), więc
  wynik tego pusha jest w wiadomości końcowej przebiegu i trafi tu na początku następnego. Poprzedni push (97db8d3)
  dostał od Vercela `failure` z powodu limitu buildów planu.

## Czeka na Rafała

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

1. (c) Nawigacja i oferta aplikacji w strukturze strony — po decyzji 5: dokładka w `ship-design`, wspólny nagłówek
   `/nawyko` ↔ `/calculator` ↔ `/tool`, maile dla `form=nawyko` i `form=calculator`.
2. Kalkulator, druga iteracja: pole wyboru „dołącz liczby” (po decyzji 3), własna karta OG dla `/calculator` i `/nawyko`,
   wydzielenie formularza `Enquiry` do osobnego pliku (dziś `/calculator` ładuje też kod sceny Nawyko), Lighthouse.
3. `/nawyko`, reszta z recenzji 2: lista nagród w kroku 4 na 360×640 (dziś ukryta), kolejność Tab na telefonie
   (widoczny tylko aktywny krok), drobne pływanie bloku kroków (3–4 px przy zmianie kroku).
4. (d) Z audytu: `try/catch` + `error.tsx`/`not-found.tsx` dla `/blog` (dziś 500 przy niedostępnym API), `metadataBase`,
   usunięcie `preconnect`/`dns-prefetch` do hostów, do których nic nie idzie (najpierw potwierdzić pomiarem).
5. Potem pętla: ocena (AI/SEO, użyteczność biznesowa, UX, wow bez kiczu) → najwyżej dwie poprawki → ponowne sprawdzenie.

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

## Decyzje podjęte samodzielnie (odwracalne)

- `/nawyko` jest trasą pisaną ręcznie (React + CSS), nie eksportem Claude Design — żeby dało się ją rozwijać z chmury.
- Scena sterowana postępem przewijania w JS (jeden nasłuch, `requestAnimationFrame`), nie natywnymi CSS scroll-driven
  animations: zdrapka i licznik i tak wymagają stanu w JS, a zachowanie jest identyczne we wszystkich przeglądarkach.
- Czerwień tylko na liczniku serii w scenie (zmierzona wartość); drugi telefon (white label) jej nie używa.
- `/nawyko` dopisane do `sitemap.ts`.
- `/calculator` pisany ręcznie na stylach `/nawyko`; zero nowych bibliotek; wynik liczony tylko w przeglądarce.
- Wartości startowe kalkulatora to oznaczony przykład, nie puste pola (decyzja 2 czeka na potwierdzenie).
- Suwak odstępu jest odwrócony (w prawo = krótszy odstęp = więcej przychodu), z opisem kierunku dla czytnika.
- Usunięty `preload` nieużywanego zdjęcia 186 kB z `app/layout.tsx` (poprawka techniczna z audytu, P1-3).
- Scena `/nawyko` na desktopie przypięta od góry zamiast wyśrodkowana (mniej przesunięć układu).
