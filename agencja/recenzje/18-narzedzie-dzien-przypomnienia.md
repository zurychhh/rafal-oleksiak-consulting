# Recenzja 18: narzędzie „dzień przypomnienia” (/lab/reminder) + /nawyko przy ograniczonym ruchu

Recenzent niezależny, 2026-11-23. Lokalna wersja produkcyjna, Chromium, 390×844 i 1440×900, DPR 1.

| # | Kryterium | Wynik | Dowód |
|---|---|---|---|
| 1 | W 10 s wiem, co to, co daje, co kliknąć | PASS | Pytanie w tytule, odpowiedź „Day 25”, etykieta „EXAMPLE — TYPE YOUR OWN”, trzy pola od razu pod spodem (mobile: pola widoczne bez przewijania). |
| 2 | Odpowiedź poprawna | PASS | 30/3/2 → dzień 25, linia „30 − 3 − 2 = day 25”; 60/5/3 → 52; suwak 26 → „1 day without the product”, 20 → komunikat 5 dni zapasu (zgodny ze specyfikacją). |
| 3 | Kciuk suwaka = cienka linia | PASS | Różnica ≤ 2 px (dz. 25: 263 vs 262; 26: 273 vs 271; 20: 218 vs 217; 60-dniowe: 279 vs 278). |
| 4 | Brak nakładania, ucięć, przewijania w bok | PASS | scrollWidth = szerokość okna w obu rozmiarach; zrzuty czyste. |
| 5 | Klawiatura + widoczny fokus | PASS | Kolejność Tab: skip → logo → 3 pola → suwak → link; fokus suwaka 2 px solid, strzałki działają; baner cookie na /lab/reminder niewidoczny. |
| 6 | Brak marek, faktów, zdrowia, „ja/mój” | PASS (z uwagą) | Narzędzie czyste; ale baner cookie (widoczny na /nawyko) mówi „so I can tell”. |
| 7 | Zero kiczu, papier/czerń/jedna czerwień | PASS | Czerwień tylko przy dniach bez produktu. |
| 8 | /nawyko, reduced motion: karta zakryta i odkrywalna | PASS | Karta „SCRATCH HERE” zakryta; przeciągnięcie wskaźnikiem → „Day 9 DONE”, seria 8→9; przycisk „Scratch today's card” również odkrywa kartę. |

## Poprawki (od najważniejszej)
1. Baner cookie: zamienić „so I can tell…” na formę bezosobową (reguła „bez ja/mój”).
2. Ukryty opis osi czasu dla czytników ekranu jest nieaktualny: po wpisaniu 60 nadal „Day 25. Reminder on day 25…”, po zmianie suwaka pokazał „Day 1”; powinien przeliczać się razem z wykresem (do sprawdzenia w kodzie).
3. Przypadek dostawa + decyzja ≥ opakowanie: linia „= day -2 → day 1” pokazuje ujemny dzień; lepiej „za mało dni: przypomnienie razem z zamówieniem”.
4. Mobile: ścieżka suwaka kończy się ok. 30 px przed końcem osi czasu; wyrównać szerokości, żeby oś nie wyglądała na dłuższą niż zakres.
5. Wprost jedno zdanie, co marka zyskuje (np. mniej dni bez produktu = mniej utraconych ponownych zamówień), bez liczb.

## Czytelnik-kupujący (szef e-commerce marki suplementów, sama lista tekstów) i co zmieniono
- „Day 25” — od czego liczyć? → „day 25 of the pack (day 28 after the order, if opened on arrival)”, etykieta „Send the reminder on day of the pack”.
- „to decide” vs „to order after the reminder” — dwie nazwy jednej rzeczy → wszędzie „to reorder”.
- „Send it with the order: the next pack must ship on day 1.” czytany jako błąd → „Too late for a reminder: delivery and reorder take longer than one pack. Offer a subscription or a two-pack at checkout.”
- „Nie ufam jednej liczbie dla wszystkich” → „One average customer.” przy polach.
- CTA: „How to send it on the right day for every customer →” → „Time it for each customer from the day they open the pack →” (bez obietnicy wyniku).
- Nie przyjęte: „run out” zamiast „days without the product” — „without the product” jest spójne z `/nawyko` i mini-kalkulatorem.

## Poprawki z recenzji wyglądu
- Pkt 2 (opis dla czytników po wpisaniu nowej liczby pokazywał stary dzień): nowe liczby przestawiają suwak na wynik — sprawdzone: po wpisaniu 60 „Day 55. Reminder on day 55…”.
- Pkt 3 (ujemny dzień „= day -2 → day 1”): → „no day left in the pack”.
- Pkt 4 (suwak krótszy od osi na telefonie): zamierzone — oś pokazuje też dni po końcu opakowania; uchwyt stoi nad dniem (≤ 2 px).
- Pkt 1 (baner cookies „so I can tell”): pierwsza osoba w zgodach jest dozwolona (rubryka, zasada 1) — bez zmian.
