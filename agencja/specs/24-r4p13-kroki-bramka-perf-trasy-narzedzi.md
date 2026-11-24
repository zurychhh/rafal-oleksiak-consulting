# Spec 24 — R4 przebieg 13 (24.11.2026 10:38): stabilna lista kroków `/nawyko`, wiarygodny `scroll-perf`, bramki na trasach narzędzi

Źródło: `agencja/STATUS.md` → „Następne” R4-N12 (1)–(3); kolejka wiedzy pkt 13. Decyzje R4p12-A/B, R4p10-A, R4p4-A/B nadal
czekają — NIE budujemy niczego, co od nich zależy (nagłówki, CTA przypięte na telefonie, `/tool`). Bez nowych tekstów widocznych dla
odwiedzającego (bramka tekstów nie jest potrzebna; jeśli jednak tekst się zmieni — stop i zgłoś Leadowi).

Maszyna ma 2 rdzenie: pomiary wydajności w worktree są orientacyjne; ostateczny pomiar robi Lead sam po scaleniu.
Zasady dla dwóch budujących (R19.3): `node_modules` przez `cp -al` (nie `ln -s`), serwer zabijany tylko po porcie
(`fuser -k <port>/tcp`), nigdy `pkill -f next`.

## Strumień A — `/nawyko` lista kroków (worktree `wt/r4p13-a`, gałąź `wt/r4p13-a`, port 3101)
A1. **Lista czterech kroków w scenie „How it works” na ≥ 1100 px przestaje przesuwać sąsiadów przy zmianie kroku.**
    Dziś `.nk-step.is-on .nk-d` rozwija opis (`grid-template-rows 0fr → 1fr`) i kroki pod nim zjeżdżają (CLS przewijania 1440 ≈ 0,0034,
    recenzja 28: kroki skaczą 23–54 px). Hipoteza (niepotwierdzona): rozwiązanie wymaga, żeby żaden wiersz nie zmieniał wysokości.
    Warianty do sprawdzenia NA ZRZUTACH przed wyborem: (a) stała wysokość każdego wiersza — opisy nieaktywnych zajmują miejsce,
    ale są niewidoczne (`visibility`/`opacity`), (b) jeden wspólny slot opisu pod listą o stałej wysokości (= najdłuższy opis przy
    danej szerokości, np. wszystkie opisy w jednej komórce siatki `grid-area:1/1` nałożone na siebie, widoczny tylko bieżący),
    (c) inny pomysł z uzasadnieniem. Wybierz ten, który wygląda najlepiej (zrzuty wariantów 1440 i 1100 do `agencja/podglad/r4p13-a-wariant-*.png`).
    Zakaz (R19.1): ponowny montaż (`key`) na kontenerze z sąsiadami.
    **Kryteria:** (1) `node scripts/cls-scroll.mjs http://localhost:3101/nawyko 1440 900` ×3 — suma ≤ 0,001 w medianie (przed/po w notatce
    `agencja/specs/24-a-pomiary.md`); (2) skrypt klatka po klatce: pozycja `getBoundingClientRect().top` każdego `.nk-step` i nagłówka sceny
    przy zmianie kroku 1→2→3→4 i z powrotem — żaden nie zmienia `top` o > 1 px względem kontenera listy (nie tylko miara CLS);
    zapisz go jako `scripts/steps-stable-check.mjs` (kod 1 przy przesunięciu); (3) 390 i reduced-motion bez zmian w wyglądzie
    (zrzuty przed/po; na < 1100 px w scenie widać tylko bieżący krok — nie psuć); (4) klawiatura: Tab przez cztery przyciski kroków
    działa jak dziś, `aria-current` bez zmian; (5) `bash scripts/gates.sh http://localhost:3101 /nawyko` — wszystko PASS
    (scroll-perf może być zaszumiony — zapisz wartości, nie poprawiaj go).

## Strumień B — bramki (worktree `wt/r4p13-b`, gałąź `wt/r4p13-b`, port 3102)
B1. **`scroll-perf` w `gates.sh` wiarygodny.** Dziś jedna najdłuższa klatka z jednego przebiegu (FAIL 119–181 ms na niezmienionym kodzie).
    Zmiana: rozgrzewka (jedno przewinięcie nieliczone po starcie przeglądarki/strony) + 3 przebiegi, werdykt z MEDIANY najdłuższej klatki
    i mediany najdłuższej interakcji (progi bez zmian: 100 ms / 200 ms); w uwadze tabeli wszystkie trzy wartości. Najlepiej w samym
    `scripts/scroll-perf.mjs` (opcja `--runs 3`, linia wyniku do sparsowania), `gates.sh` tylko czyta. Źródło metody znajdź w sieci
    (web.dev / Chrome dev docs o zmienności pomiarów laboratoryjnych, LoAF) i wpisz link do komentarza w skrypcie i do notatki.
B2. **Test regresji `clsscroll` w repo:** `scripts/clsscroll-selftest.sh` — stawia na localhost (port 3199, `python3 -m http.server`
    z katalogu tymczasowego) stronę-wzorzec z elementem zmieniającym wysokość przy przewijaniu i stronę spokojną; oczekuje FAIL
    (> 0,01) dla pierwszej i PASS (≤ 0,001) dla drugiej z parsowania tak jak `gates.sh`. Kod 0 tylko gdy oba wyniki zgodne z oczekiwaniem.
    Analogicznie `scripts/scrollperf-selftest.sh`: strona z celowo długim zadaniem w `scroll` (np. pętla 250 ms) → FAIL, spokojna → PASS.
B3. **Bramki na trasach narzędzi, których `gates.sh` jeszcze nie mierzył:** zbuduj worktree i uruchom
    `bash scripts/gates.sh http://localhost:3102 /calculator /tools /lab/reward /lab/payback /lab/reminder` (WebKit 390/1440 w środku).
    Wynik — tabela w `agencja/specs/24-b-trasy.md` z każdym FAIL opisanym (przyczyna, zrzut WebKit obejrzany). Poprawiasz najwyżej
    DWA FAIL-e, tylko gdy przyczyna jest techniczna (układ, fokus, kontrast, CLS, telefon < 150 px), bez zmiany tekstu i bez nowego
    elementu na ekranie; reszta jako lista do „Następne”. `/tool` nie ruszać (źródło innego zadania).

## Bramki obu strumieni
`npm run build`, `npx tsc --noEmit`, `npm run lint` (0 błędów, ostrzeżeń ≤ 1), `gates.sh` na zmienionych trasach (WebKit 390/1440),
zrzuty obejrzane. Commit na własnej gałęzi worktree (stopka `Co-Authored-By: Claude <noreply@anthropic.com>`), BEZ pushu.
Nie ruszać: `/`, `data/genactiv/`, `tool-index.html`, `app/tool/`, ustawień Vercela, testów treści.
