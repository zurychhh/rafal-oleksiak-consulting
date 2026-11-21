# 02 — Kalkulator odstępu między zamówieniami (`/calculator`)

Data: 21.11.2026 (przebieg 2). Źródła i model: `agencja/research/kalkulator-zrodla.md`, weryfikacja cytatów: `agencja/research/kalkulator-weryfikacja.md`.

## Po co
Magnes na zapytania dla marek, których klienci kupują ponownie: odwiedzający wpisuje własne liczby i widzi, ile w roku jest wart krótszy
odstęp między zamówieniami. Strona prowadzi dalej do `/tool` (pomiar odstępu), `/nawyko` (aplikacja) i formularza.

## Zakres
- Trasa `/calculator`, pisana ręcznie na stylach `/nawyko` (klasy `nk-`) + własne `gc-`; wpis w sitemapie; link w stopce `/nawyko`.
- Scenariusz 01 „krótszy odstęp”: N, AOV, T0, opcjonalnie D i marża; suwak T1 od T0 do D. Rysunek „jeden klient, jeden rok”:
  kreska = zamówienie, czarny pasek = dni z produktem, czerwone kreskowanie = dni bez produktu.
- Scenariusz 02 „drugi zakup”: C, AOV, r0, suwak r1; siatka 100 klientów. Liczone ostrożnie (jedno dodatkowe zamówienie).
- Sekcje „What the number assumes” i „Reference points” (trzy benchmarki z wydawcą, rokiem, próbą i zdaniem „czego to nie mówi”).
- Formularz: wspólny komponent `Enquiry` z `form: "calculator"`; liczby z kalkulatora NIE są wysyłane.

## Kryteria akceptacji
1. Wynik liczy się wyłącznie z pól na ekranie; wzory w `app/calculator/model.ts`, test `node scripts/calculator-model.test.mjs` zielony.
2. Wartości startowe są oznaczone „example” przy każdym polu i w nagłówku wyniku, dopóki odwiedzający ich nie zmieni.
3. Żadna liczba rynkowa nie wchodzi do wzoru; benchmarki tylko jako opisane punkty odniesienia z linkiem.
4. Żadnej obietnicy skutku (kalkulator wycenia zmianę, nie obiecuje jej) i żadnej prawdziwej marki klienta.
5. Brak NaN/Infinity i brak przewijania poziomego dla pustych, zerowych, tekstowych i skrajnie dużych wartości (360–2560 px).
6. Animacja startowa suwaka raz, nigdy po dotknięciu i nigdy przy `prefers-reduced-motion`; CLS < 0,01.
7. Klawiatura: wszystkie pola, oba suwaki i linki osiągalne, widoczny fokus; czytnik dostaje jedno zdanie wyniku po zatrzymaniu zmian.
8. Bramki: build, tsc, lint (bez nowych ostrzeżeń), `qa.js` na `/calculator`, `/nawyko`, `/`, `/tool`, `/stop`, `content-rules`, `tool-rules`, `ship-compare`.
9. Niezależna recenzja 11 punktów zaliczona po poprawkach (`agencja/recenzje/02-kalkulator.md`).

## Poza zakresem (kolejka)
Łączenie scenariuszy, rabat jako pole, koszt działania, eksport wyniku, wysyłka liczb w zapytaniu (decyzja Rafała), własna karta OG.
