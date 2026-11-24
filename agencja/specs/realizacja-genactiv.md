# Realizacja GENACTIV — `/work/genactiv` (zlecenie Rafała 23.11.2026 21:00, spec doradcy)

**Słowa Rafała:** „strona realizacji pierwszej aplikacji, czyli GENACTIV; podstrona w kolorystyce tej aplikacji, zrobiona zajebiście
dobrze; efekt wow to mało powiedziane, ma rozwalić mózgi, bo to będzie teraz nasza największa wizytówka tego rozwiązania”.
**Rola strony:** dowód, że to działa naprawdę, na prawdziwej marce — i najmocniejszy wjazd do „Zobacz to z Twoją marką”. Czytelnik:
założyciel albo CMO marki FMCG, telefon, 10 sekund na decyzję „czytam dalej”.

## Granice (twarde, repo jest PUBLICZNE)
- Wyjątek od zasady „bez prawdziwych marek”: obejmuje WYŁĄCZNIE tę trasę. `/nawyko` zostaje na zmyślonej marce Tovemi.
- Wolno: nazwa GENACTIV, kategoria (colostrum, Polska), paleta aplikacji (niżej), mechanika opisana słowami i pokazana w kodzie.
- Nie wolno (do zgody GENACTIV i startu w sklepach): stawki cashbacku i progi, ceny, liczby sprzedaży i klientów, treść lekcji
  i ścieżek, zrzuty prawdziwej aplikacji, logo jako plik graficzny, zdjęcia produktów. Każda liczba w scenach = podpis „Example”.
- Zero twierdzeń zdrowotnych. Zero wyników, których nie zmierzyliśmy: sekcja wyników jest **stanem zablokowanym** z datą
  i metodą („mierzymy przyrost względem grupy kontrolnej, pierwsze wyniki po 90 dniach”), nigdy pusta i nigdy zmyślona.
- Trasa ma `noindex` i nie ma jej w `sitemap.xml`, dopóki Rafał nie zdejmie blokady (warunki: pisemna zgoda GENACTIV na referencję
  + aplikacja w sklepach). Nic nie idzie na produkcję bez Rafała — jak zawsze.

## Wygląd
Świat aplikacji, nie strony konsultingowej: celowo jeden, nocny motyw (wyjątek od Paper/Night, z pełnym kontrastem ≥4,5:1).
Tokeny z aplikacji: tło `#0e0b0c`, powierzchnia `#1d1517`, tekst `#ffffff` / `#c9bfc1`, akcent `#f5333f`, akcent jasny `#ff8a91`,
róże `#ffa9ad` `#f2b8c2` `#ffc3c6`, papier paragonu `#f4f1ee` z tuszem `#2a2526`, ziemia sceny `#4a0f16` → `#1d1012`,
folia zdrapki: gradient `#ffd2d5 → #f5333f → #9e1520 → #ff9aa0 → #c41a26 → #ff6a72 → #7a0f18`, pasek pieczątki `#c41a26 #f5333f #ff8a91`.
Krój: Montserrat jako zamiennik kroju marki (lokalnie, jak inne fonty strony — bez Google Fonts w buildzie). Ruch: sterowany
przewijaniem, natywne CSS tam, gdzie się da; wersja `prefers-reduced-motion` z pełną treścią.

## Opowieść (akty; jeden telefon jest nicią całej strony)
0. **Otwarcie:** czarny ekran, czerwone światło; z pudełka (geometria w CSS 3D, bez zdjęcia produktu) wysuwa się telefon.
   Nagłówek: „GENACTIV turned its box into a daily ritual.” + jedno zdanie: kim jest marka i co to za aplikacja.
1. **Problem w jednym obrazie:** pierścień 30 dni gaśnie w połowie — klient przestaje brać w połowie opakowania, drugiego zakupu nie ma.
2. **Dowód zakupu z każdego kanału:** skan kodu z pudełka albo paragonu; paragon zostaje w telefonie (prywatność od projektu).
3. **Zdrapka dnia — do zdrapania myszą i palcem** w folii marki (canvas), nie da się jej przewinąć bez interakcji albo animacji.
4. **Miesiąc w jednym przewinięciu:** pierścień 30 dni wypełnia się, 24. dzień — pieczątka spada z drgnięciem.
5. **Cashback, który rośnie:** schody z każdym zamówieniem (kształt i „Example”, bez prawdziwych stawek).
6. **Punkty i poziomy, które nie spadają** + ścieżki wiedzy z medalem i prezentem na mecie (nazwy ścieżek dopiero po zgodzie).
7. **Brak zgody nie zamyka aplikacji:** karty widoczne z „Turn on and unlock”.
8. **Jak to powstało — część, która ma „rozwalić mózg”:** oś czasu od zielonego światła zarządu do wersji gotowej do sklepów,
   zbudowanej przez nasze studio agentów AI z ludzkimi bramkami: przegląd bezpieczeństwa, testy dostępu do danych, RODO art. 9,
   recenzja tekstów, bramka zaangażowania. Liczby tylko te, które policzysz z naszego repo z datą (czas, liczba testów) — źródło
   podaje doradca (pliki w `agencja/dane/realizacja-genactiv.json`, uzupełnia je doradca; do tego czasu sekcja na „Example”).
9. **Wyniki:** stan zablokowany z metodą i datą (patrz granice).
10. **Finał:** „See it with your brand” — przejście do przemalowania z `/nawyko` + formularz `LeadBridge` (form `work`).

## Kryteria (recenzent niezależny, test 10 sekund, 390 i 1440)
W 10 sekund: wiadomo, że to prawdziwa marka, prawdziwa aplikacja i co klient w niej robi. Zero tekstów o autorze („I built…”) —
bohaterem jest marka i jej klient. Każdy akt to rzecz, którą produkt robi, nie akapit. LCP i CLS nie gorsze niż `/nawyko`.
Zdrapka działa z klawiatury („Reveal without scratching”). Bramka tekstów i kontrast jak wszędzie.

## Kolejność pracy
Równolegle do sceny R4 `/nawyko`: osobny budujący w osobnym worktree, scalany do jednego pushu na przebieg.
Przebieg 1: szkielet trasy (`app/work/genactiv/`), tokeny, akty 0–4 z wow (pudełko→telefon, zdrapka, pierścień, pieczątka).
Przebieg 2: akty 5–8. Przebieg 3: wyniki, finał, nawigacja („Work” we wspólnej nawigacji), szlif ruchu. Każdy przebieg: link podglądu
i jedno zdanie dla Rafała, co obejrzeć.

## Przebieg 1 — kryteria i stan (23.11.2026)
Kryteria: trasa `app/work/genactiv/` z `noindex,nofollow`, poza `sitemap.ts`; tokeny ze specu, kontrast ≥ 4,5:1 (qa.js);
Montserrat lokalnie (`public/fonts/montserrat-latin*.woff2`, OFL 1.1, @fontsource-variable/montserrat 5.3.0); akty 0–4 w jednej
przypiętej scenie (postęp z przewijania, rAF, bez transition); tryb statyczny (bez JS / reduced motion / webdriver / okno < 600 px)
z pełną treścią; zdrapka canvas + „Reveal without scratching” + samozdrapka po 1,5 s; każda liczba na ekranie = rysunek
`aria-hidden` z podpisem „Example screen, not a screenshot of the app.”; tymczasowy link „See it with your brand →” do `/nawyko`.
Stan: zbudowane; bramki build, tsc, lint (0 błędów, 1 ostrzeżenie jak przed), copy-voice, qa.js 9/9 PASS, noindex, brak w sitemap.
Otwarte: czytelnik-kupujący nie przeszedł; copy-voice nie widzi tekstów trasy (są w tablicy `COPY`, test czyta tylko JSX);
`content-rules` nie obejmuje tras pisanych ręcznie; przycisk zdrapki w trybie sceny osiągalny klawiaturą tylko w akcie 3.
Poprawki po recenzji 19 i czytelniku 20 (23.11): przycisk zdrapki osiągalny Tabem (`inert` zamiast visibility, fokus przewija
do aktu zdrapki), surowy CLS przy przewinięciu całej strony 0,0003 (390) / 0,0001 (1440), jeden aktywny nagłówek na klatkę,
„Drag to scratch”, pierścień od +1 dnia po zdrapaniu, przytrzymanie pieczątki 0,4 aktu, pudełko wyżej + link pod leadem,
stała rezerwa pod pasek cookies na 390, teksty z listy koordynatora.

## Przebieg 2 — kryteria i stan (23.11.2026)
Kryteria: akty 5–8 w tej samej przypiętej scenie (ACTS = 9, tor 1080svh = 9 × 120svh, postęp z przewijania, rAF, zmiany
rozmiaru tylko przez transform); telefon zostaje nicią; tryb statyczny z pełną treścią wszystkich 9 aktów; każdy ekran podpisany
(podpis zmienia się z aktem, jedna linia, jedzie z telefonem transformem). Akt 5: schody cashbacku bez wartości, plakietka
„Example” na ekranie + podpis „Example screen. Bar heights are illustrative.”. Akt 6: poziom (Example), pasek punktów, „Path 1 /
Lesson 1–3” (neutralne), medal i prezent na mecie — bez nazw i treści ścieżek. Akt 7: zgoda na dane zdrowotne wyłączona → karty
widoczne i zablokowane, przycisk „Agree and turn on” („Turn on and unlock” ze specu łamie zasadę 4 rubryki — „unlock” blokuje
automat copy-voice, R8); „Order rewards · on” w obu stanach (zgoda nie warunkuje nagród). Akt 8: oś etapów bez żadnych liczb:
zielone światło marki → przegląd bezpieczeństwa → testy dostępu do danych → RODO art. 9 („ticked on date”) → recenzja tekstów →
bramka zaangażowania → store-ready build (bez daty, bez twierdzenia o sklepach). Liczby (czas, testy) dołoży doradca po
utworzeniu `agencja/dane/realizacja-genactiv.json`. Hero 1440: podpis pod telefonem jedzie w górę razem z telefonem (był ~100 px
pod pudełkiem).
Stan: zbudowane; build, tsc, lint (0 błędów, 1 ostrzeżenie jak przed), copy-voice OK (sprawdzone, że czyta nowe literały),
qa.js --scroll PASS (9 szerokości), noindex, brak /work w sitemap.xml; surowy CLS przy przewinięciu całej strony 0,0034 (390)
/ 0,0007 (1440). Zrzuty: `agencja/podglad/genactiv-p2-*.png`.
Otwarte: czytelnik-kupujący dla nowych tekstów (osobny subagent) jeszcze nie przeszedł; liczby aktu 8 czekają na plik doradcy.
Poprawki po recenzji i czytelniku 22 (23.11): plakietka EXAMPLE na obu ekranach „This month” i podpis „Example screen. Numbers
are placeholders.” przy każdym ekranie z liczbami (akty 1, 4, 5, 6); „Agree and turn on” to prawdziwy `<button aria-pressed>`
przełączający makietę, osiągalny Tabem w scenie (fokus przewija do aktu 7) i w trybie statycznym (sprawdzone: 4. Tab, Enter →
pressed=true); usunięty wiersz „Order rewards · on”; 6 przepisań z recenzji 22, oś aktu 8 bez „store-ready”; kontrast: tekst
„Medal and gift at the finish” bez przyciemnienia (było 3,22:1 przy krycie 0,35, teraz biały na #1d1517), nieaktywne kroki osi
#c9bfc1 na #0e0b0c = 10,92:1. Bramki: build, tsc, lint 0 błędów (1 ostrzeżenie jak przed), copy-voice OK, qa.js PASS, noindex,
brak w sitemap, CLS 0,0026 (390) / 0,0006 (1440).

## Przebieg 3 — kryteria (23.11.2026, 23:45)
Akty 9–10 w tej samej przypiętej scenie (ACTS = 11; tor dalej 120svh na akt; zmiany rozmiaru tylko transformem; tryb statyczny z pełną
treścią wszystkich aktów). Akt 9 „Wyniki”: **stan zablokowany**, nie pusty i nie zmyślony — kłódka/szary wykres-szkielet bez wartości,
metoda słowami („Reorder lift is measured against a control group that never gets the app.”), kiedy pierwsze wyniki („First read
90 days after launch.” — bez daty startu, bo start w sklepach nie jest ogłoszony), zero liczb. Akt 10 „Finał”: „See it with your brand”
— telefon przemalowuje się z palety GENACTIV na kolor wybrany przez odwiedzającego (próbki + `input type=color`, kontrast tekstu
liczony), link „See the full product page →” do `/nawyko`, i formularz zapytania przez istniejący `Enquiry` z
`app/nawyko/NawykoClient.tsx` z `form="work"`, `page="/work/genactiv"` (ten sam kształt `/api/lead`; `[a-z]+` przechodzi zod),
ostylowany w palecie realizacji (kontrast ≥ 4,5:1). Nawigacja: na `/work/genactiv` nagłówek z linkami Nawyko · Work (bieżąca) · Contact (#enquiry);
link do `/work/genactiv` z `/nawyko` NIE jest dodawany (publiczny link do prawdziwej marki przed zgodą GENACTIV — decyzja Rafała,
wpis w „Czeka na Rafała”); `/` bez zmian. Trasa dalej `noindex`, poza sitemap.
Stan: zbudowane (ACTS = 11, tor 1320svh). Akt 9: ekran „Results · Locked” ze szkieletem wykresu bez wartości, metoda i „90 days after
launch” tylko w tekście, bez daty startu. Akt 10: próbki-radio (5) + `input type=color`, telefon przechodzi z czerwieni GENACTIV
do wybranego koloru w pierwszych 40% aktu; tekst na kolorze biały albo czarny według liczonego kontrastu (minimum ok. 4,58:1);
fokus próbek przewija scenę do aktu 10. Formularz `Enquiry` (form `work`, page `/work/genactiv`) stoi w trybie przewijania tuż pod
sceną (`#enquiry`; w przypiętej scenie nie mieści się na 390), w trybie statycznym w akcie 10; style `nk-*` w genactiv.css pod `.ga`;
link „See the full product page →” pod formularzem. Nagłówek: Nawyko · Work (aria-current) · Contact (#enquiry). Bramki: build,
tsc, lint 0 błędów / 1 ostrzeżenie (jak przed), copy-voice OK (widzi nowe literały: „unlock” w H2 aktu 10 → czerwony), qa.js
--scroll PASS (9 szerokości), noindex, 0× /work w sitemap.xml; CLS przy przewinięciu całej strony 0,0031 (390) / 0,0007 (1440);
błąd wysyłki bez Resend: „That did not go through. Write to rafal@… instead.” z fokusem. Zrzuty `agencja/podglad/genactiv-p3-*.png`.
Otwarte: czytelnik-kupujący dla tekstów przebiegu 3; `Enquiry` ma swoje teksty w 1. osobie („I reply personally…”, zgoda
marketingowa) — wspólny komponent, nie zmieniany; trasa importuje cały moduł NawykoClient (rozmiar JS do sprawdzenia).

## Przebieg 4 (24.11.2026 01:45) — zakres
1. Wydzielić `Enquiry` (i to, czego wymaga, np. wybór koloru) z `app/nawyko/NawykoClient.tsx` do osobnego pliku
   (`app/nawyko/Enquiry.tsx`); obie trasy importują z niego. Zmierzyć JS trasy `/work/genactiv` i `/nawyko` przed i po
   (suma chunków ładowanych przez stronę, z buildu albo z sieci w Playwright) — wynik w tabeli niżej.
2. Akt 10: etykieta „YOUR BRAND” w kolorze odwiedzającego (jak na `/nawyko`), kontrast ≥ 4,5:1 zmierzony.
3. 390: pasek cookies nie zasłania podpisu pod telefonem w finale (rezerwa stała, raz, na kontenerze — lekcja z R4 p3).
4. Jedna najbardziej widoczna usterka ruchu trasy po obejrzeniu serii zrzutów 390/1440 (Chromium + WebKit).
Bramki jak w specu wyżej + `scripts/webkit-check.py` w 390 i 1440 na `/work/genactiv` i `/nawyko`.
