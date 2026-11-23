# 09 — Narzędzie „Które zamówienie zwraca koszt nowego klienta” (`/lab/payback`, podgląd)

**Status:** zbudowane w podglądzie `/lab/payback` (23.11.2026, runda 3 przebieg 5), noindex, poza `sitemap.ts`. Publikacja — decyzja Rafała (Q).
Pozycja 4 z `agencja/narzedzia.md`.

## Pytanie
„Which order pays back the cost of a new customer?” — marka FMCG z powtarzalnym zakupem.

## Zasady (jak spec 07)
- Jeden ekran, najpierw duża odpowiedź („Order 3”, „day 90 · orders 45 days apart”), pod nią rachunek i założenia.
- Liczby wyłącznie z pól odwiedzającego; start 90 / 36 / 45 to przykład z etykietą „Example — type your own”.
- Kwoty w walucie, bez procentów i bez danych rynkowych. Nic nie wychodzi ze strony (zero fetch, storage, analityki).
- Każde pole zmienia wynik: koszt i marża — numer zamówienia; odstęp — dzień.
- Użycie „w tył” (NN/g 2024): suwak „A customer who stops after N orders” → bilans klienta (+/−) i drabinka zamówień.
- Jeden krok: link do `/nawyko` z numerem zamówienia („How to get customers to order 3 →”).

## Model (`app/lab/payback/model.ts`, test `scripts/payback-model.test.mjs`)
- `order = ceil(cac / margin)` (z tolerancją 1e-9, żeby 120/40 dawało 3), minimum 1.
- `day = round((order − 1) × gap)`; pierwsze zamówienie = dzień 0.
- `balanceAfter(n) = n × margin − cac`. Puste / ≤0 / nieskończone → brak wyniku.

## Kryteria akceptacji
- [x] build, `tsc`, lint 0 błędów (1 ostrzeżenie jak przed), `copy-voice`, `payback-model` OK.
- [x] `qa.js /lab/payback --scroll` PASS (9 szerokości); `focus-obscured` OK.
- [x] Surowe przesunięcia układu przy 12 edycjach (także błędne wpisy) ≤ 0,13 na 390 i ≤ 0,04 na 1440 — mierzone BEZ wyłączenia `hadRecentInput`.
- [x] Kontrast: numery „nie złożonych” zamówień 5,5:1 (przygaszona tylko komórka).
- [x] Recenzent niezależny + czytelnik-kupujący: `agencja/recenzje/17-narzedzie-zwrot-klienta.md`.
