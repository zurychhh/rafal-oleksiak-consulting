# 10 — Narzędzie „Którego dnia wysłać przypomnienie o kolejnym opakowaniu” (`/lab/reminder`, podgląd)

**Status:** zbudowane w podglądzie (23.11.2026, runda 3 przebieg 6), noindex, poza `sitemap.ts`. Publikacja — decyzja Rafała (razem z Q).
Pozycja 7 w `agencja/narzedzia.md` (z „Następne” R3-7: „przypomnienie o kolejnym opakowaniu”).

## Pytanie
„Which day should the reorder reminder go out?” — marka FMCG z powtarzalnym zakupem (suplement, kosmetyk, karma).

## Dlaczego to narzędzie
Przypomnienie wysłane za wcześnie jest ignorowane (klient ma jeszcze pół opakowania), za późno — klient ma dni bez produktu
i może kupić u konkurencji. Dzień zależy wyłącznie od trzech liczb marki. Prowadzi do Nawyko: aplikacja wie, którego dnia
opakowania jest każdy klient (codzienne zdrapanie), więc przypomnienie może wyjść we właściwy dzień dla każdego z osobna.

## Zasady (jak spec 07 i 09)
- Jeden ekran, najpierw duża odpowiedź („Day 25”), pod nią jedno zdanie rachunku: „30-day pack − 3 days delivery − 2 days to decide = day 25”.
- Trzy pola, wszystkie od odwiedzającego, start 30 / 3 / 2 z etykietą „Example — type your own” przy liczbie:
  1. Days one pack lasts (servings ÷ daily dose),
  2. Days from order to doorstep,
  3. Days a customer takes to order after the reminder.
- Zero procentów, zero danych rynkowych, zero obietnic efektu. Nic nie wychodzi ze strony (zero fetch, storage, analityki).
- Każde pole zmienia wynik.
- Użycie „w tył” (NN/g 2024): suwak „If the reminder goes out on day N” → oś jednego opakowania (dni 1…N_pack) i wynik:
  „X days without the product” (za późno, czerwone kreskowane jak w mini-kalkulatorze `/nawyko`) albo „X days of product left when the new pack lands” (za wcześnie / OK).
- Jeden krok: link do `/nawyko` („How <brand> sends it on the right day for every customer →” albo prościej, bez nazwy marki).
- Wygląd: style `.nk` + `reward.css` jak `/lab/payback` (papier, czerń, jedna czerwień); żadnej nowej biblioteki.
- R6: stała wysokość zmiennych linii, surowe przesunięcia układu przy 12 edycjach ≤ 0,05 (390 i 1440), mierzone bez wyłączania `hadRecentInput`.
- Przypadki brzegowe: dostawa + decyzja ≥ długość opakowania → „Send it with the order: the next pack must ship on day 1” (wynik dzień 1, komunikat); pola puste / ≤0 / nieliczbowe → komunikat nazywający pole, wpis zostaje.

## Model (`app/lab/reminder/model.ts`, test `scripts/reminder-model.test.mjs`)
- `day = packDays − delivery − decide`, minimum 1 (flaga `tooLate` gdy surowe < 1).
- Dla suwaka `send`: `arrives = send + decide + delivery` (dzień opakowania, w którym przychodzi nowe). Ostatnia dawka starego = dzień `packDays`.
  Dni bez produktu = `max(0, arrives − packDays)`; dni zapasu przy dostawie = `max(0, packDays − arrives)`.
  Przykład 30/3/2: wysyłka dnia 25 → dostawa dnia 30 → 0 dni bez produktu (wynik); dnia 26 → 1 dzień bez; dnia 20 → 5 dni zapasu. Test na te przypadki + brzegi.

## Kryteria akceptacji
- [x] build, `tsc`, lint 0 błędów (ostrzeżeń nie więcej niż przed), `copy-voice`, `reminder-model` OK.
- [x] `qa.js /lab/reminder --scroll` PASS (9 szerokości); `focus-obscured` OK; `content-rules` bez zmian.
- [x] Surowe przesunięcia układu przy 12 edycjach ≤ 0,05.
- [x] Kontrast każdego tekstu ≥ 4,5:1 (liczby z narzędzia).
- [x] Recenzent niezależny + czytelnik-kupujący: `agencja/recenzje/18-narzedzie-dzien-przypomnienia.md`.

Wyniki: build/tsc OK, lint 0 błędów (1 ostrzeżenie jak przed), `copy-voice` i `reminder-model` OK, `qa.js` PASS (9 szerokości),
`focus-obscured` OK; surowe przesunięcia przy 12 edycjach: 390 = 0,0058, 1440 = 0,0020 (budujący przed poprawką wysokości miał 0,97).
Po recenzji: suwak na tej samej skali co oś (różnica ≤ 2 px), dzień zero zdefiniowany („day 25 of the pack (day 28 after the order…)”),
jedna nazwa „to reorder”, ujemny dzień zastąpiony zdaniem, nowe liczby przestawiają suwak na wynik (czytnik ekranu już nie mówi starego dnia).
