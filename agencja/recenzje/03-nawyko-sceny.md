# Recenzja 03 — /nawyko, sceny 5–7 i finał (22.11.2026)

Recenzent niezależny (nie budował strony). Badane wyłącznie `http://localhost:3000/nawyko`, Playwright/Chromium,
`navigator.webdriver=false`. Widoki: 1440×900, 390×844 (dotyk, DPR 2, z paskiem cookies i po „Decline”), 360×640,
oraz `prefers-reduced-motion` (1440 i 390). Formularz nie był wysyłany. Zrzuty i skrypty:
`/tmp/claude-0/-home-claude/442e9b8a-b85d-5e6c-b220-1e00cead363f/scratchpad/review/` (katalog tymczasowy, może zniknąć).

## Werdykt w dwóch zdaniach

Akty 5 i 6 są wyraźnie lepsze niż „nagłówek + lista” i same w sobie nie nudzą, ale akt 7 i finał nadal nie dowożą
obietnicy „Your name on it”, a przejścia między aktami to twarde cięcia z podskakującym paskiem postępu.
Do poprawy przed pokazaniem właścicielowi: płynność przejść (FAIL), dostępność z klawiatury (FAIL, w tym niewidoczny
tekst linku „Skip to content”) i pusty akt 7.

## Rubryka

| # | Kryterium | Wynik | Dowód |
|---|---|---|---|
| 1 | Oryginalność (pokaz produktu, nie dokument) | PASS z zastrzeżeniem | Akty 1–6 to pokaz (`d_16.png`, `d_21.png`); akt 7 i `.nk-never` nadal czytają się jak dokument (`d_22.png`, `k_never.png`) |
| 2 | Oferta zrozumiała w 5 s | PASS | `d_first.png`: „A habit app with your logo on it.” + jedno zdanie mechaniki + CTA; telefon zaczyna się dopiero na krawędzi ekranu |
| 3 | Zero kiczu | PASS | Brak ozdobników bez funkcji; jedyny akcent to czerwień znacznika/kropki |
| 4 | Płynność | FAIL | Na granicach aktów lewa kolumna podmienia się bez przejścia (opacity 1, transition 0 s), pasek postępu skacze: 636 → 666 → 769 → 399 px (akt 4→5→6→7, 1440×900) |
| 5 | Brak przesunięć układu | PASS (na styk) | CLS 0,0181 na 1440 (limit 0,02); 0,0020 na 390; 0,0033 na 360. Największe źródła: `.nk-demo`/`.nk-bar` przy zmianie aktu (0,0062 i 0,0017), `.nk-phonecol` przy ładowaniu (0,0015) |
| 6 | Wersja reduced-motion | PASS | `rd_full.png`, `rm_full.png`: bez przypięcia, stan końcowy, oś z suwakiem widoczna. Obejrzane dokładnie do aktu 5 (desktop) i aktu 3 (mobile); akty 6–7 statycznie tylko z pomiaru wysokości sceny (3171 px / 4278 px) |
| 7 | Waga JS ≤ +10% wobec /calculator | PASS | Skrypty (transfer, CDP): /nawyko 148 064 B, /calculator 152 480 B (−2,9%), /tool 177 264 B. Chunk własny strony: 7 796 B wobec 12 212 B kalkulatora |
| 8 | Klawiatura | FAIL | (a) link „Skip to content” po fokusie: tekst rgb(20,22,26) na tle rgb(20,22,26), kontrast 1,00 (`k_skip.png`); (b) suwak i przyciski skór istnieją w DOM tylko w swoim akcie, więc Tab z kroku 04 skacze od razu do formularza; (c) pasek cookies jest ostatni w kolejności Tab, choć zasłania dół ekranu. Sam suwak działa: strzałki 16→22→8, End→30, `aria-valuetext` „Day 16 of 30”, ramka fokusu widoczna (`k_a5_focus.png`) |
| 9 | Brak prawdziwych marek | PASS | W treści tylko „Tovemi” (opisana jako wymyślona) i „Magnesium · 30 capsules”. Nie sprawdzałem w rejestrach, czy „Tovemi” nie jest czyimś znakiem |
| 10 | Liczby oznaczone jako przykład | PASS | „EXAMPLE” przy osi i „ILLUSTRATION · INVENTED DATA” nad wykresem widoczne na 1440, 390 z paskiem cookies (`m_14.png`, `m_17.png`) i 360×640 (`s_09.png`, `s_11.png`). Dłuższe przypisy pod spodem chowają się za paskiem cookies, ale etykiety zostają |
| 11 | K1–K9 | patrz niżej | |
| 12 | Mobile 390×844: każdy akt widoczny | PASS | Z paskiem (`m_00`–`m_21`) i po „Decline” (`md_00`–`md_21`) telefon, nagłówek i element interaktywny mieszczą się w każdym akcie. Z paskiem czwarty wiersz listy (Cashback) w akcie 5 i legenda w akcie 6 dotykają krawędzi paska |

### K1–K9

| K | Wynik | Dowód |
|---|---|---|
| K1 | PASS z zastrzeżeniem | Nagłówki 5 / 12 / 6 słów. Akt 5 nadal ma pod osią czterowierszową listę nagród (DAY 7 / DAY 24 / DAY 24 / REORDER), która dubluje listę na telefonie; nie jest numerowana i reaguje na dzień, ale wizualnie to wciąż „nagłówek + lista” |
| K2 | PASS z zastrzeżeniem | Telefon widoczny w 7 aktach na obu widokach. Akt 7 pokazuje ten sam ekran serii co akt 3 (dzień 17), więc „nowy ekran” jest tu naciągany |
| K3 | PASS | Strzałki, End i przeciągnięcie myszą (→ dzień 24) zmieniają dzień; telefon „17 day of 30” → „7”, znaczniki ✓ na liście zgodne |
| K4 | PASS | Podpis obecny w każdej szerokości; czerwień tylko na kropce, jej legendzie i liczbie 34 na telefonie. W skórach Night/Clay liczba na telefonie traci czerwień, kropka zostaje (`i_Night_a6.png`, `i_Clay_a6.png`) |
| K5 | PASS | Tło, tekst i linie zmieniają się na całej stronie (hero, scena, never, finał). Kontrast wyliczony dla 158–165 węzłów tekstu w każdej skórze: wszystko ≥ 4,5:1 poza linkiem „Skip to content” (1,00). Pasek cookies zostaje jasny w Night (`i_a7_Night.png`) |
| K6 | PASS częściowo | Reduced-motion sprawdzone (patrz 6). Wariantu bez JS nie testowałem |
| K7 | Nie sprawdzono | Build, tsc, lint, qa.js i content-rules nie były uruchamiane w tej recenzji. Tylko CLS: 0,0181 ≤ 0,02 |
| K8 | PASS w zakresie widocznym | Brak prawdziwych marek, twierdzeń zdrowotnych i losowości w treści. Nowych bibliotek nie weryfikowałem w package.json |
| K9 | PASS częściowo | „[nazwa testowa]” → pasek telefonu „[nazwa testowa]”, kod „[nazwa testowa]-NEXT-K7Q4”, zero żądań sieciowych podczas pisania (`i_final_typed.png`). Kontraktu `/api/lead` nie testowałem (zakaz wysyłki) |

Dodatkowo: brak błędów konsoli na wszystkich widokach, brak znaczników `{{ }}`, brak poziomego przewijania (390 i 360).

## Usterki według wagi

1. **Twarde cięcia między aktami (akty 4→5, 5→6, 6→7; każdy widok).** Lewa kolumna podmienia się w jednej klatce, a
   pasek postępu i przypis o Tovemi skaczą w pionie nawet o 370 px. Poprawka: stała wysokość lewej kolumny (pasek
   przypięty do dołu sceny) i 200–250 ms przenikania treści.
2. **Link „Skip to content” ma niewidoczny tekst (wszystkie skóry).** Po fokusie widać czarny prostokąt bez napisu;
   reguła koloru linków nadpisuje `color:var(--paper)`. Poprawka: podnieść specyficzność (`.nk a.nk-skip`).
3. **Akty 5–7 nieosiągalne Tabem (1440 i mobile z klawiaturą).** Suwak i przyciski skór renderują się tylko w
   aktywnym akcie, a przycisków kroków jest 4, nie 7. Poprawka: dodać przyciski kroków 05–07 (jak 01–04), które
   przewijają do aktu i przenoszą fokus na jego kontrolkę.
4. **Akt 7 jest pusty i nie spełnia nagłówka (1440: ok. 55% lewej kolumny puste; 390: pół ekranu puste po wyborze
   skóry — `i_m_night.png`).** „Your name on it” — a nazwa zostaje TOVEMI; tekst obiecuje „colors, type and wording”,
   zmienia się tylko kolor; telefon pokazuje ekran z aktu 3. Poprawka: przenieść tu pole nazwy marki (patrz „jedna zmiana”).
5. **Finał na mobile to zwykły formularz.** `.nk-final-phone` ma `display:none` poniżej progu, więc efekt „nazwa
   pojawia się na telefonie” nie istnieje na telefonie odwiedzającego. Poprawka: mały pasek telefonu (sam top bar +
   kod kuponu) nad polem adresu.
6. **Wskazówka w finale ginie (1440).** „Type your store and watch the phone.” to końcówka szarego akapitu; telefon
   stoi 180 px od pola i nie reaguje, dopóki ktoś nie zacznie pisać. Poprawka: placeholder na telefonie „YOUR BRAND”
   z migającym kursorem albo podpis bezpośrednio przy polu.
7. **Nazwa z subdomeny.** „https://shop.a-very-long-brand-name-international.co.uk/pl” → telefon pokazuje „SHOP”.
   Poprawka: pomijać typowe subdomeny (www, shop, store, sklep) i brać etykietę przed końcówką domeny.
8. **Akt 5: lista pod osią dubluje telefon (K1).** Cztery wiersze z drobnym opisem to najbardziej „dokumentowa” część
   aktu; na 390 z paskiem cookies ostatni wiersz i przypis wchodzą pod pasek. Poprawka: zostawić oś i jedno zdanie,
   opisy nagród pokazywać jako etykietę przy znaczniku w chwili odpalenia.
9. **Akt 6 jest tylko do oglądania.** Wykres buduje się z przewijaniem i to działa, ale po zbudowaniu nic nie można
   zrobić, a kropki na 1440 są małe (wykres zajmuje ok. 350×140 px na ekranie 1440×900). Poprawka: powiększyć wykres
   do pełnej szerokości kolumny i podświetlać kolumnę pod kursorem („n packs ended on day X”, z dopiskiem illustration).
10. **CLS 0,0181 przy limicie 0,02 (1440).** Zapas 10%; źródłem są te same skoki `.nk-demo`/`.nk-bar` co w usterce 1.
    Poprawka z punktu 1 usuwa też to ryzyko.
11. **Pasek cookies poza skórą i na końcu kolejności Tab.** W Night zostaje jasny pas na dole; fokus trafia do niego
    dopiero po stopce. Poprawka: przenieść pasek na początek DOM, a tło podpiąć pod zmienne skóry.
12. **Czerwień liczby na telefonie znika w Night/Clay (akt 6).** W Paper „34” i kropka są czerwone i się łączą; w
    pozostałych skórach liczba jest w kolorze tekstu. Poprawka: użyć `var(--red)` także w skórach.

## Czy to nadal znudzi właściciela

- **Akt 5 — nie.** Jedyne miejsce poniżej aktu 4, gdzie odwiedzający coś robi i telefon odpowiada. Słabością jest
  lista pod osią.
- **Akt 6 — raczej nie, ale jest za mały.** Najlepszy pomysł na stronie (jedna czerwona kropka z telefonu staje się
  rozkładem), tylko podany nieśmiało i bez interakcji.
- **Akt 7 — tak.** Nagłówek, jedno zdanie, trzy małe przyciski i pusta kolumna. Zmiana koloru strony robi wrażenie
  przez sekundę, ale nie pokazuje „twojej nazwy”.
- **`.nk-never` — raczej tak.** Trzy duże zdania to nadal typografia do przeczytania, nic się tu nie dzieje.
- **Finał — na desktopie w połowie, na mobile tak.** Nazwa na telefonie jest dobra, ale ukryta za wskazówką, której
  mało kto doczyta, i niedostępna na telefonie.

## Jedna zmiana z największym efektem

Przenieść pole nazwy marki z finału do aktu 7: jedno pole „Type your brand” obok przycisków skór. Wpisana nazwa
zmienia od razu górny pasek telefonu, kod kuponu, napis w lewym górnym rogu strony i słowo w nagłówku hero, a potem
czeka już wpisana w formularzu na dole. Wtedy „Your name on it, not mine” dzieje się dosłownie, pusta kolumna znika,
a finał dostaje gotowy kontekst. Bez nowych bibliotek i bez ozdobników; nazwa zostaje lokalnie do „Send”.

## Czego nie sprawdziłem

Bramki K7 (build, tsc, lint, qa.js, content-rules), wariant bez JS, kontrakt `/api/lead`, prawdziwe urządzenie
(wszystko w emulacji Chromium), Safari/iOS, czytnik ekranu, rejestry znaków towarowych dla „Tovemi”. Płynność
oceniona z pomiaru stanów na granicach aktów i zrzutów, nie z nagrania wideo.
