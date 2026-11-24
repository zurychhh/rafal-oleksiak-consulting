# Kolejka wiedzy agencji (jedna porcja na przebieg)

Każda porcja: źródło (link + data) → jedna konkretna zmiana na stronie albo w regułach → linia w `agencja/postep-uczenia.md`.

## Do przerobienia (w tej kolejności)
0. ~~Nawigacja — etykiety: NN/g „Category Names Suck”~~ (24.11 R4 p6: nazwa produktu + słowo opisu w linku na `/`)
1. ~~Strony produktowe i scrollytelling — przewodnik Chrome „Scrollytelling”~~ (zrobione 23.11, runda 3)
1b. ~~Narzędzia/kalkulatory — NN/g „Calculators and Quizzes: User Expectations” (2024)~~ (zrobione 23.11, runda 3 przebieg 3)
2. ~~B2B lead generation i CRO — formularze: NN/g „Website Forms Usability: Top 10”~~ (zrobione 23.11 przebieg 5: reguła pól i błędów w narzędziach); zostaje: liczba pól formularza zapytania na `/nawyko` i `/calculator` (Baymard)
3. ~~Copywriting sprzedażowy — front-loading (NN/g „Headings Are Pick-Up Lines”, 2015)~~ (zrobione 23.11 przebieg 6: zasada 8 w rubryce tekstów); zostaje: przegląd nagłówków scen `/nawyko` pod zasadę 8
4. ~~Widoczność w odpowiedziach AI — FAQ (23.11 R4 p2) i schema `SoftwareApplication` dla Nawyko~~ (24.11 R4 p7: graf + test `jsonld-rules`); zostaje: `@id` dla WebSite w `SchemaOrg` (dziś dwa węzły WebSite na `/nawyko`)
5. ~~Dostępność — WCAG 2.2: 2.4.11 Focus Not Obscured~~ (zrobione 23.11 przebieg 4) i ~~2.5.7 Dragging Movements~~ (zrobione 23.11 R4 przebieg 1: alternatywa jednym wskaźnikiem)
6. Wydajność — ~~CLS: próg 0,1, okna sesji, wejście z kotwicą (web.dev, 24.11 R4 p3)~~; ~~INP dla scen sterowanych przewijaniem~~ (24.11 R4 p8: web.dev „Benchmarking the performance of CSS @property” → zmienne sceny na elementach + `inherits:false`, bramka `scroll-perf`)
7. ~~Strony produktowe — rozdziały i CTA w trakcie długiej strony~~ (24.11 R4 p9: Smashing „Designing Sticky Menus” → pasek rozdziałów `/nawyko` częściowo przyklejony z CTA); zostaje: to samo dla `/work/genactiv`
9. ~~B2B CRO — ile pól i jaka kolejność w formularzu zapytania~~ (24.11 R4 p10: Baymard „Mark both required and optional fields” → `Enquiry` zgodny: 2 pola, obie zgody oznaczone; reguła 13 w rubryce tekstów dla każdego nowego formularza). Zostaje: kolejność pól (sklep przed e-mailem?) — test dopiero z danymi
11. ~~Wydajność — CLS przy przewijaniu (web.dev „CLS”: `transform` nie przesuwa układu)~~ (24.11 R4 p11: gałka na `transform`, `key` na tekstach; zostaje: `cls-scroll` w `gates.sh`)
12. Copywriting — nagłówki „Etykieta: zdanie” (czytelnik R4 p11: działa tylko ze słowem kupującego) — szukać źródła (NN/g o front-loading w nagłówkach z dwukropkiem)
10. ~~Dostępność — skok do celu w obrębie strony~~ (24.11 R4 p12: `/work/genactiv` 8/8 fokus na akcie z nazwą, `scripts/genactiv-focus-check.mjs`); stare brzmienie:: fokus na celu kotwicy i ogłoszenie czytnikiem (WCAG 2.4.3), dla pasków `/nawyko` i `/work/genactiv`
8. ~~Scroll-driven animations w CSS — wsparcie przeglądarek~~ (24.11 R4 p4: Safari 26.0 obsługuje `animation-timeline`, webkit.org/blog/17333; iOS 18 nie → zawsze `@supports` + statyczny stan końcowy; `webkit-check.py` wypisuje wsparcie). Zostaje: czy przenieść część sceny z JS do CSS

13. Wydajność — wiarygodność pomiaru klatek: ile powtórzeń i jaki percentyl (web.dev/Chrome o LoAF i zmienności pomiarów laboratoryjnych) — do bramki `scroll-perf` (R4-N12)
