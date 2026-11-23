# 07 — Narzędzie „Ile może kosztować nagroda” (`/lab/reward`, podgląd)

**Status:** zbudowane w podglądzie `/lab/reward` (23.11.2026), noindex, poza `sitemap.ts`. Publikacja i link z innych tras — decyzja Rafała.

## Pytanie
„How much can a loyalty reward cost and still pay for itself?” — dla marki FMCG z powtarzalnym zakupem.

## Zasady
- Jeden ekran, jedno pytanie, wynik żywy: najpierw duża liczba, potem założenia.
- Liczby wyłącznie z pól odwiedzającego. Wartości startowe (120 / 48 / 2) to przykład z etykietą „Example — type your own”, po edycji „Your numbers”.
- Bez procentów: marża w walucie. Waluta: „in your currency” przy liczbie, separator tysięcy przecinek („4,000” = cztery tysiące, `parseNum` z `/calculator`).
- Cała strona < ~120 słów widocznego tekstu poza liczbami. Zero „I/my/we”; bohaterem jest marka odwiedzającego.
- Jeden krok: link do `/nawyko`. Bez formularza.
- Nic nie wychodzi ze strony: zero fetch, storage, analityki w kliencie.

## Model (`app/lab/reward/model.ts`, test `scripts/reward-model.test.mjs`)
- `ceiling = margin × extraOrders` — najwyższy roczny koszt nagród na klienta, przy którym nagroda się zwraca.
- `extraSales = aov × extraOrders` (tylko pasek).
- Puste / ≤ 0 / nieskończone pole → brak wyniku. Marża > wartość zamówienia → komunikat, brak wyniku.
- `verdict(ceiling, cost)` → pays off, gdy `cost ≤ ceiling`; różnica „left” / „short”.

## Ekran
1. Pytanie (h1) → liczba (sufit) + „in your currency” → „{marża} margin × {zamówienia} extra orders” → jedno zdanie, co zrobić.
2. Trzy pola (order value, gross margin per order, extra orders per customer a year + „your assumption”).
3. Suwak „Try a reward cost” (0–200% sufitu, pozycja, nie dana) → status „Pays off · X left” / „Doesn’t pay off · X short” (czerwień tylko w tym stanie) i trzy paski: extra sales, margin from extra orders, reward cost (z kreską sufitu).
4. Link do `/nawyko`.

## Kryteria akceptacji
- [x] `npm run build`, `npx tsc --noEmit` czyste; lint 0 błędów (1 ostrzeżenie, istniejące, poza zakresem).
- [x] `node scripts/copy-voice.test.mjs` OK; `node scripts/reward-model.test.mjs` OK.
- [x] `design/qa.js … /lab/reward --scroll` PASS na 9 szerokościach (bez `--scroll` stopka daje przewijanie na 4 niskich widokach — tak samo jak `/calculator`).
- [x] 390×844: pytanie, liczba, pola, suwak i link w pierwszym ekranie; stopka poniżej.
- [x] `robots: noindex, nofollow`; trasy brak w `sitemap.ts`.
- [x] Etykiety pól (`<label htmlFor>`), wynik w `aria-live="polite"` (opacity 0 + absolute, nie 1 px), `aria-valuetext` suwaka, `prefers-reduced-motion` wyłącza przejście pasków.
- [ ] Czytelnik-kupujący (osobny subagent) na liście tekstów — do zrobienia przed commitem.
- [ ] Wpis w `agencja/teksty-do-akceptacji.md` — do zrobienia przed commitem.

Zrzuty: `agencja/podglad/reward-390.png`, `agencja/podglad/reward-1440.png`.
