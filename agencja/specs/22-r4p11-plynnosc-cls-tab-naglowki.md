# Spec 22 — R4 przebieg 11 (24.11.2026 08:38): płynność `/nawyko`, źródła CLS, kolejność Tab `/work/genactiv`, nagłówki pod zasadę 8

Źródło kolejki: `agencja/STATUS.md` → „Następne” R4-N10 i recenzja 26 (M2, M3). Decyzja R4p10-A (CTA przypięte na telefonie)
nadal czeka na Rafała — NIE budujemy go w tym przebiegu (nowy element na ekranie = zmiana zakresu).

## Strumień A — `/nawyko` (worktree `wt/r4p11-a`)
A1. **Płynność 1440 wróciła do 2–4 klatek > 50 ms** (p8: 0). Hipoteza: `MutationObserver` z D2 (`ChapterBar` czyta akt sceny).
    Kryteria: pomiar `scripts/scroll-perf.mjs <url> 1440 900 4` ×3 przed i po; po zmianie najdłuższa klatka < 100 ms we wszystkich
    i liczba klatek > 50 ms nie większa niż przed (mediana); zachowanie D2 bez zmian (etykieta „How it works · 04 Reward” tylko
    w przypiętej scenie). Jeśli przyczyna nie jest w D2 — zapisać, co zmierzone, i nie zmieniać kodu na ślepo.
A2. **CLS przy przewijaniu kółkiem 390 = 0,0100** (recenzja 26 M3). Przypisać źródła (element, wartość) — skrypt z `PerformanceObserver`
    `layout-shift` + `sources`. Jeśli źródło w kodzie trasy i poprawka jest lokalna — poprawić do < 0,001; jeśli nie — zapisać źródło.
A3. **Nagłówki scen pod zasadę 8 rubryki** (pierwsze dwa słowa niosą treść): tabela obecnych nagłówków H2/H3 `/nawyko` → propozycja
    tylko tam, gdzie pierwsze dwa słowa nie niosą treści. W tym przebiegu BEZ zmiany kodu — tabela trafia do czytelnika-kupującego.

## Strumień B — `/work/genactiv` (worktree `wt/r4p11-b`)
B1. **Pasek aktów jest ostatni w DOM** (M2): renderować pasek przed `.ga-track`/`.ga-still`, tak by Tab z treści pierwszego ekranu
    doszedł do paska przed treścią aktów (gdy pasek widoczny). Kryteria: kolejność Tab sprawdzona skryptem; `inert` przy ukryciu
    bez zmian; CLS bez zmian; skoki 8/8 nadal trafiają w akt.
B2. **CLS 0,0008 (1440) / 0,0030 (390) przy przewijaniu kółkiem** (M3): przypisać źródła; lokalna poprawka, jeśli źródło w kodzie trasy.
B3. **`gates.sh` na `/`** (pierwszy raz): wynik tabeli; FAIL na `/` przy niezmienionym `/` = zapis do STATUS, bez zmian w `/`
    (strona główna to mechanizm ship-design).

## Bramki obu strumieni
`npm run build`, `npx tsc --noEmit`, `npm run lint` (0 błędów, ostrzeżeń ≤ 1), `bash scripts/gates.sh http://localhost:<port> <trasa>`
(zawiera WebKit 390/1440), zrzuty przed/po w `agencja/podglad/r4p11-{a,b}-*.png`. Niezależny recenzent po scaleniu.
Pomiary wydajności przy dwóch budujących na 2 rdzeniach są zaszumione — ×3, mediana; ostateczny pomiar Lead po scaleniu, sam.
