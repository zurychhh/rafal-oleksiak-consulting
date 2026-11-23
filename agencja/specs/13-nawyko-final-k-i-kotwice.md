# Spec 13 — /nawyko, runda 4: (k) finał „See it with your brand” z przemalowaniem na żywo + stała rezerwa sceny (skok przy wejściu z kotwicą)

Wzór: spec 11/12. Plik: `app/nawyko/NawykoClient.tsx` (komponent `Story` → sekcja `#enquiry`), CSS na końcu `app/nawyko/nawyko.css`.

## (k) Finał
- Sekcja `#enquiry` staje się sceną: odwiedzający wpisuje sklep (już jest — nazwa marki na telefonie) i **wybiera kolor marki**
  (6 gotowych próbek jako przyciski radio + natywny `input type=color`), a telefon i akcent sekcji finału przemalowują się na żywo
  (zmienna CSS `--brand` na sekcji; tekst na akcencie liczony automatycznie na czarny/biały wg kontrastu ≥ 4,5:1).
- Nagłówek ≤ 12 słów, korzyść marki na początku (np. „Your brand on the phone, before the first call.”), plus jedno zdanie.
- Kolor NIE jest wysyłany formularzem (nie zmieniamy kształtu `/api/lead`); podpis „Nothing is sent until you press Send.” zostaje.
- Formularz `Enquiry` bez zmian w polach i zgodach. Bez JS: statyczny finał z formularzem i domyślnym kolorem.
- Ruch: tylko kolor/`transform`; `prefers-reduced-motion` bez przejść.

## Stała rezerwa sceny
- Wejście adresem z kotwicą (`/nawyko#proof`, `#integrations`, `#faq`, `#privacy`, `#cashback`, `#enquiry`) nie skacze: surowy CLS
  (suma wszystkich przesunięć z PerformanceObserver, bez okien sesji) ≤ 0,05 na 390 i 1440. Dziś 0,33–1,09.
- Kierunek: HTML z serwera ma tę samą wysokość sceny co tryb przypięty (np. rezerwa `min-height` liczona w `svh` z liczby aktów,
  ustawiana warunkowo przez klasę z inline-skryptu przed hydratacją, zgodnie z tym samym warunkiem co `setMode('scroll')`),
  albo po hydratacji przywrócenie pozycji kotwicy bez skoku widocznego dla PerformanceObserver. Wybór i pomiar przed/po w tym pliku.
- Tryby bez JS, reduced-motion i niskie okno nadal mają pełną treść.

## Kryteria akceptacji
1. `copy-voice` zielony; zero „I/we/our/unlock” w nowych tekstach; teksty w `teksty-do-akceptacji.md` (sekcja „R4 przebieg 3”).
2. Kontrast tekstu na każdej próbce koloru ≥ 4,5:1 (zmierzony), w Paper i Night.
3. Próbki osiągalne Tabem, strzałki zmieniają wybór (radio), `aria-label` z nazwą koloru.
4. Build, `tsc`, lint (0 błędów, nie więcej ostrzeżeń niż przed), `qa.js /nawyko --scroll` PASS, `content-rules --url` PASS.
5. Pomiar CLS kotwic przed/po (tabela niżej). Zrzuty `agencja/podglad/nawyko-r4-final-{390,1440}(-color).png`.
