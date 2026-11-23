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
