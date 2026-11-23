# Recenzja 16: ponowne sprawdzenie mini-kalkulatora `.hg` i zdania pod liczbą na `/lab/reward`

Recenzent niezależny (nie budował), 2026-11-23. Lokalny serwer :3000, Playwright, widoki 390×844 i 1440×900, przewijanie kółkiem 120 px co 60 ms.
Skrypty i zrzuty: `/tmp/claude-0/rev2/` (`hg.js`, `kb.js`, `rw.js`, `hg_*.png`, `rw-*.png`). Źródła: `app/calculator/HeroGap.tsx`, `hero-gap.css`, `app/lab/reward/RewardClient.tsx`.

**Werdykt: wszystkie 5 punktów z recenzji 14 jest naprawionych, a rachunek się zgadza. Został jeden przypadek brzegowy z fokusem i paskiem cookies (pkt 1b). Zdanie na `/lab/reward` jest poprawne i reaguje na pola; proponuję drobną zmianę słowa „it”.**

## A. `.hg` na `/nawyko` i `/lab/home` (4 widoki, wyniki identyczne)

| # | Punkt | Wynik | Liczby |
|---|---|---|---|
| 1a | Fokus a pasek cookies, gdy pasek jest widoczny | PASS | Pasek od y=843 (1440) / 766 (390). Fokus na polach kończy się najniżej na y=738 (1440 /nawyko), 303 (1440 /lab/home), 369 (390 /nawyko), 291 (390 /lab/home). Pierścień 2 px solid. CSS: `scroll-margin-bottom: calc(var(--consent-h) + 24px)` |
| 1b | Fokus Tabem od góry strony (pasek jeszcze ukryty) | PASS z ryzykiem | Pola lądują na 804–852 (1440 /lab/home) i 741–796 (390 /nawyko), gdy pasek jest niewidoczny. Pasek pojawia się chwilę później (przy linku już jest, od 843 / 766). Jeśli wyskoczy, gdy fokus jest na polu, zasłoni 9 px pola (1440) albo 30 px (390). Poprawka: przewijanie zawsze z marginesem na pasek, także gdy jest ukryty, albo pokazanie paska od razu |
| 2 | „1 days” | PASS | odstęp 31 / opakowanie 30 → „1 day without your product”; 61/60 → „1 day” |
| 3 | Etykieta przykładu przy dużej liczbie i w aria-live | PASS | Etykieta stoi 6 px nad liczbą, przesunięcie w poziomie 0 px (x=778 na 1440, 20–24 na 390). aria-live: „Example: plus 448,000 a year…”, po edycji „Your numbers: …” |
| 4 | Czy pola wyglądają na edytowalne | PASS | Wypełnienie #EDEAE1 na tle #F7F5F0, podkreślenie 1 px #14161A, kursor tekstowy, 63–137 × 40–49 px. Drobiazg: na 1440 pierścień fokusu (offset 3 px) nachodzi na etykietę „Revenue from reorders a year” (zrzut `hg_nawyko-1440.png`) |
| 5 | Pole „Pack lasts” zamiast stałego 30 | PASS | Jest, z walidacją (1–365) i podpisem „60-day pack” |
| 6 | Rachunek: przychód × (odstęp/opakowanie − 1) | PASS | 480 000 × (58/30−1) = 448 000 ✔ · 120 000 × (90/60−1) = 60 000 ✔ · 100 000 × (61/60−1) = 1 666,67 → +1,667 ✔ · 480 000 × (31/30−1) = 16 000 ✔ |
| 7 | Odstęp ≤ opakowanie → „No gap” | PASS | 30/30 i 45/60: liczba „—”, podpis „No gap”, aria-live: „No gap: customers reorder before the pack runs out.” |
| 8 | CLS w czasie pisania | PASS | 0.0000 na 4 widokach (18 wpisań na widok) |

## B. `/lab/reward`: zdanie pod dużą liczbą (390 i 1440, wyniki identyczne)

| # | Punkt | Wynik | Liczby |
|---|---|---|---|
| 9 | Zdanie zmienia się po zmianie „Average order value” | PASS | 120 → „80% off one order of 120” · 200 → „48%” · 96 → „100%” · 80 → „more than one whole order of 80” · pole puste → „—” i zdanie zastępcze |
| 10 | Każde pole zmienia widoczny wynik | PASS | marża 30 → 60 / 50% · dodatkowe zamówienia 3 → 90 / 75% · wartość zamówienia zmienia tylko zdanie (tak ma być, bo sufit = marża × zamówienia) |
| 11 | Rachunek: sufit / wartość zamówienia | PASS | 96/120 = 80% ✔ · 96/200 = 48% ✔ · 90/120 = 75% ✔ · 60/120 = 50% ✔ |
| 12 | Właściciel marki FMCG, 10 s: jasne i wiarygodne? | PASS z uwagą | „80% off one order” przelicza abstrakcyjne 96 na coś, co właściciel zna (rabat), i to działa. Słabe miejsce: „below it” może znaczyć „poniżej 96” albo „poniżej 80%”. Nie wiadomo też od razu, że 80% to próg opłacalności, a nie rekomendacja |

**Proponowane brzmienie (opcjonalne):** „That is the same as 80% off one order of 120 once a year. Pick one fixed reward that costs less, and announce it up front.”
