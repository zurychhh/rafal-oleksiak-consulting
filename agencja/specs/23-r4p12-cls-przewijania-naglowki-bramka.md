# Spec 23 — R4 przebieg 12 (24.11.2026 09:38): CLS przewijania do zera, nagłówki pod zasadę 8, `cls-scroll` w bramce, fokus po skoku

Źródło kolejki: `agencja/STATUS.md` → „Następne” R4-N11, „Czeka na Rafała” R4p11-B (brak decyzji = wprowadzamy po bramce tekstów),
kolejka wiedzy pkt 10. Decyzja R4p10-A (CTA przypięte na telefonie) nadal czeka — NIE budujemy.

## Strumień A — `/nawyko` (worktree `wt/r4p12-a`, port 3101)
A1. **Mikro-CLS przy przewijaniu kółkiem → < 0,001 na 390 i 1440.** Źródła z recenzji 27 D2 i p11: `.nk-step is-on` (1440, 0,0037),
    trzy teksty wyrównane do prawej w telefonie (`.nk-mini.is-up > span`, `.nk-goal > span`, `.nk-rwd li.is-got > span`).
    Metoda jak na `/work/genactiv` (p11): tekst zmieniający się w miejscu dostaje nowy węzeł (`key`) albo ruch tylko przez `transform`
    / stała szerokość (`tabular-nums`, `min-width` w `ch`). Kryterium: `node scripts/cls-scroll.mjs <url> <w> <h>` ×3 na 390×844 i 1440×900,
    suma bez wejścia < 0,001 w medianie; przed/po w spec-notatce. Wygląd bez zmian (zrzuty przed/po w tych samych pozycjach).
A2. **Trzy nagłówki (R4p11-B, czytelnik-kupujący p11):**
    `how` → „Reorders: four steps that bring customers back for the next pack.”;
    `nk-xch` → „Programme cost: you set the budget.”;
    `nk-intg` → „Built on Shopify; other tools connect per brand.”.
    H1 i pozostałe bez zmian. Bramka tekstów: `node scripts/copy-voice.test.mjs` PASS, wpis do `agencja/teksty-do-akceptacji.md`
    (stary → nowy, data, „R4p11-B, brak decyzji = wprowadzone”); jeśli tekst nagłówka występuje w JSON-LD/`page.tsx` metadata — zsynchronizować
    i `scripts/jsonld-rules.test.mjs` PASS. Czytelnika-kupującego na liście uruchamia Lead.
A3. **Koszt renderu przy zmianie aktu (hipoteza: ekrany telefonu renderują się wszystkie przy każdej zmianie aktu).** Najpierw pomiar
    `scripts/loaf-detail.mjs` (×3, 1440, CPU 4×) — ile ms skryptu w długich klatkach przypada na render Reacta. Dopiero gdy pomiar
    potwierdzi: `React.memo` dla ekranów, których propsy się nie zmieniają (stabilne propsy/callbacki). Kryterium: `scroll-perf` 1440 ×3 —
    mediana liczby klatek > 50 ms nie większa niż przed, najdłuższa < 100 ms; zachowanie sceny bez zmian. Jeśli hipoteza upada — zapis, bez kodu.

## Strumień B — bramka i `/work/genactiv` (worktree `wt/r4p12-b`, port 3102)
B1. **`cls-scroll` w `scripts/gates.sh`** jako bramka `clsscroll-390` i `clsscroll-1440` na każdej trasie: FAIL gdy suma bez wejścia > 0,01,
    INFO z wartością gdy 0,001–0,01, PASS ≤ 0,001; skrypt musi wypisać jedną linię do sparsowania (dopisać, jeśli brak). Test regresji bramki:
    na sztucznie zepsutej stronie (np. lokalny plik HTML z elementem zmieniającym wysokość przy scrollu, serwowany z localhost) bramka daje FAIL.
    Dopisać do CLAUDE.md (sekcja „Jedno polecenie”) jednym słowem w liście.
B2. **Fokus po skoku z paska aktów `/work/genactiv` (WCAG 2.4.3, kolejka wiedzy pkt 10).** Sprawdzić skryptem, gdzie ląduje fokus po wyborze
    aktu z listy i czy czytnik ma co ogłosić (cel z `tabindex="-1"` i dostępną nazwą = nagłówek aktu). Jeśli fokus zostaje w pasku albo
    na `body` — przenieść na cel bez obrysu dla myszy (jak `/nawyko` D4) i z `preventScroll`. Kryterium: skrypt 8/8 aktów: `document.activeElement`
    = cel aktu, nazwa dostępna niepusta; skoki 8/8 nadal trafiają w akt (`scripts/genactiv-actbar-check.mjs`), CLS bez zmian.
    Źródło do zapisu w `postep-uczenia.md` podaje Lead.
B3. `gates.sh /work/genactiv /nawyko` z nowymi bramkami — wynik w tabeli (bez poprawiania `/nawyko`, to strumień A).

## Bramki obu strumieni
`npm run build`, `npx tsc --noEmit`, `npm run lint` (0 błędów, ostrzeżeń ≤ 1), `bash scripts/gates.sh http://localhost:<port> <trasa>`
(WebKit 390/1440 w środku), zrzuty przed/po w `agencja/podglad/r4p12-{a,b}-*.png`. Niezależny recenzent po scaleniu.
Pomiary wydajności przy dwóch budujących na 2 rdzeniach są zaszumione — ×3, mediana; ostateczny pomiar Lead po scaleniu, sam.
Nie ruszać: `/`, `data/genactiv/`, `tool-index.html`, ustawień, testów treści (poza dopisaniem bramki w `gates.sh`).
