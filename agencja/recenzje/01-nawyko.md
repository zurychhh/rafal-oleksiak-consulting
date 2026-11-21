# Recenzja 01 — /nawyko (niezależny recenzent, 21.11.2026)

Badane lokalnie (http://localhost:3000/nawyko, serwer deweloperski), Playwright/Chromium, skrypty i zrzuty w /tmp/rec/.
Werdykt ogólny: **nie do publikacji bez poprawek 1–5**. Zaliczone 5 z 10 punktów.

## Tabela

| # | Punkt | Werdykt | Dowód |
|---|---|---|---|
| 1 | Oryginalność, wow bez kiczu | NIEZALICZONE | Kiczu i ozdobników bez funkcji nie ma (pasek 30 dni niesie 24/30; czerwieni na stronie brak). Ale „wow” jest słabe: zdrapanie karty niczego nie zmienia — po zdrapaniu zostaje „Day 9 / Done” i „See you tomorrow.”, a licznik w kroku 3 i tak leci 9→24 niezależnie od tego, czy ktoś zdrapał. Odblokowanie nagrody to statyczny ekran. Zdrapka myszą działa (sprawdzone: klasa `is-gone` po przeciągnięciu). |
| 2 | Oferta w 5 sekund | ZALICZONE | 1440×900 i 390×844: etykieta „white-label app for repeat-purchase brands”, H1, dwa zdania, CTA „Ask about Nawyko” nad zgięciem. Uwaga: H1 „A habit app with your logo on it” nie mówi, że to lojalność/ponowny zakup — to dopiero w ledzie; „dose” w ledzie zawęża do suplementów, a formularz obiecuje też kawę i karmę. |
| 3 | Scena: poprawność | NIEZALICZONE | 360×640: opis kroku 3 i 4 ucięty pod paskiem cookies (dół tekstu y=548/570, pasek od ok. y=562); na ekranie telefonu w kroku 4 lista nagród nachodzi na dolne zakładki („Next-pack discount” na „TODAY STREAK REWARDS”), czwarta nagroda niewidoczna; link „No pointer?” przecięty paskiem. 1440×900: „No pointer? Scratch today's card” przyklejony do paska postępu (pasek y≈634, tekst od 636) i jego pojawienie się przesuwa notkę o marce. Na ≤860 px notka „Tovemi is a fictional brand…” jest ukryta (`.is-scroll .nk-demo{display:none}`). 390×844, 768×1024, 1024×768: bez nakładań. |
| 4 | CLS i przewijanie poziome | ZALICZONE | CLS: 1440 = 0,028; 1024 = 0,050; 390 = 0,0002; 360 = 0,0003; 768 = 0,0001 (próg 0,1). Źródło na desktopie: przełączenie po hydracji ze stanu końcowego na krok 1 (`nk-phonecol`/`nk-scenehead`). Przewijania poziomego brak na 5 szerokościach. |
| 5 | prefers-reduced-motion | ZALICZONE | Scena `is-still`, `position: static`, wysokość 1254 px, wszystkie 4 opisy widoczne, klik w krok 2 przełącza ekran telefonu, „Scratch today's card” działa. |
| 6 | Klawiatura i brak JS | NIEZALICZONE | Kolejność Tab logiczna (23 przystanki), obrys 2 px tuszem. Ale: (a) pola tekstowe formularza mają `outline:0` i tylko pogrubienie dolnej linii 1→2 px; (b) na każdym fokusie dochodzi błękitna poświata `box-shadow rgba(0,191,255,.2) 0 0 0 5px` z globalnych stylów — kolor spoza palety; (c) na ≤860 px przyciski niewidocznych kroków mają `display:none`, więc klawiaturą nie da się przeskoczyć kroku. Bez JS: cała treść czytelna (zrzut 390 i 1440), telefon w stanie końcowym. |
| 7 | Rozmiar | ZALICZONE | Transfer (serwer deweloperski, więc liczby zawyżone względem produkcji): /nawyko JS 145,6 kB, CSS 10,8 kB, fonty 41,8 kB, 15 żądań; / JS 211,7 kB, CSS 7,4 kB, fonty 83,7 kB, 20 żądań. Do potwierdzenia na buildzie produkcyjnym. |
| 8 | Treść | NIEZALICZONE | Prawdziwych marek, losowości, twierdzeń zdrowotnych, procentów i cen brak. Ale: „I reply personally within 24 hours” (dwa razy) — liczba-obietnica bez pokrycia, w dodatku myli się z 24 dniami mechaniki; „Cashback on the next order” jako czwarta nagroda — w opisie produktu są trzy (darmowa dostawa, stempel, zniżka), do potwierdzenia, czy cashback istnieje; „The customer installs your app” i „Colours, type, wording… are settings, not a rebuild” — obietnice do potwierdzenia w produkcie; „You see which day customers actually reach” — to dane o przyjmowaniu dawek, trzeba dopisać, że zbiorczo; „it is oddly satisfying” — ocena zamiast faktu; „Colours” (pisownia brytyjska) przy `locale: en_US`; telefon white label pokazuje „24 days” i „0 to go” bez stempla. |
| 9 | Kontrast | NIEZALICZONE | #6E6D68 na #EDEAE1 = 4,31:1 dla małego tekstu: etykieta sceny (12 px), numery kroków (12 px), notka o marce (13 px), „Done” na karcie (9 px). Motyw night: nic poniżej 4,6. Clay: najsłabsze 4,59 („Done”, 9 px). Tekst 9 px na telefonie jest za mały niezależnie od kontrastu. |
| 10 | Formularz | ZALICZONE | 390×844: odpowiedź 503, komunikat widoczny na y=658–702, pasek cookies od y=766, fokus przeniesiony na komunikat, obie zgody domyślnie odznaczone. Drobiazg: dół przycisku „Send” (772) wchodzi 6 px pod pasek. |

## Poprawki w kolejności ważności

1. **360×640, tekst kroku pod paskiem cookies** — `nawyko.css`, blok `@media (max-width:860px)`: dodać `@media (max-height:700px)` z `.nk-phone{height:min(44svh,470px)}` i `.is-scroll .nk-stepbtn .nk-d{font-size:14px}`; sprawdzić, że dół kroku 4 mieści się nad `--consent-h`.
2. **Lista nagród nachodzi na zakładki telefonu** — `nawyko.css` l. 161–163 (`.nk-rw`): ograniczyć widok kroku 4 do wysokości nad `.nk-tabs` (padding-bottom widoku = 10cqh + odstęp), zmniejszyć `padding` wierszy do 1.2cqh i `.nk-stampwrap` na niskich ekranach.
3. **Zdrapka bez skutku** — `NawykoClient.tsx`, `Phone`: po `scratched` pokazać „Day 9 ✓” i podbić licznik (krok 3 startuje od 9, gdy zdrapane, od 8, gdy nie), tak żeby gest użytkownika był widoczny w serii. To jest brakujące „wow”.
4. **Kontrast 4,31:1** — `nawyko.css` l. 18 i 91: przyciemnić `--dim`/`--pd` na tle #EDEAE1 do ok. #5F5E59 (≥ 5,3:1) albo użyć tuszu dla etykiet 12–13 px; „Done” podnieść z 9 px do min. 11 px.
5. **„within 24 hours”** — `NawykoClient.tsx`, `.nk-note` i stan `done`: usunąć liczbę („I reply personally.”) albo zostawić tylko, jeśli właściciel ją potwierdzi; nie mieszać z 24 dniami.
6. **Notka o zmyślonej marce ukryta na telefonie** — `nawyko.css` l. 223: usunąć `.is-scroll .nk-demo{display:none}` albo przenieść zdanie pod scenę, poza przypięty obszar.
7. **Fokus pól formularza i błękitna poświata** — `nawyko.css` l. 195: zastąpić `outline:0` obrysem `2px solid var(--ink)`; dodać `.nk :focus-visible{box-shadow:none}` (l. 23), żeby zgasić globalny `rgba(0,191,255,.2)`.
8. **„No pointer?” przyklejone do paska postępu** — `nawyko.css` l. 84–86: zarezerwować stałe miejsce (min-height) na `.nk-alt`, żeby nie przesuwało notki, i dać odstęp ≥ 12 px od `.nk-bar`; na 360 przenieść link nad pasek cookies.
9. **Cashback i „installs your app”** — `page.tsx` (`REWARDS`, czwarta pozycja) i `NawykoClient.tsx` (`WhiteLabel`, lista `nk-rw`): zostawić tylko, jeśli to zatwierdzony zakres produktu; inaczej usunąć albo oznaczyć jako opcję.
10. **„Rhythm of use” a dane o dawkach** — `page.tsx`, `BRAND_GETS[1]`: dopisać „in aggregate, never per person” (dane szczególnej kategorii).
11. **Telefon white label: 24 dni bez stempla, „0 to go”** — `NawykoClient.tsx`, `WhiteLabel`: pokazać `step={3}` albo zmienić podpis na „Stamp earned” przy `days >= GOAL_DAY`; próbka „Night” w wciśniętym przycisku jest niewidoczna (ciemna na ciemnym) — dać jasną ramkę.
12. **Język** — `page.tsx`/`NawykoClient.tsx`: „Colours” → „Colors” (albo `locale: en_GB`); wyrzucić „oddly satisfying”; w ledzie „after their dose” → „after using the product”, skoro oferta obejmuje kawę i karmę.

## Czego nie sprawdziłem
- Dotyk na prawdziwym telefonie (zdrapka ma `touch-action:none`, więc palec na karcie nie przewinie strony — do sprawdzenia, czy nie blokuje przewijania na 360 px, gdzie karta zajmuje sporą część ekranu).
- Rozmiar na buildzie produkcyjnym.
- Czy nazwa „Tovemi” jest wolna — opieram się na komentarzu w kodzie.
- Zrzuty kroków 1 i 3 na 1440 i 390 oceniłem z pomiarów, obejrzałem kroki 2 i 4.
