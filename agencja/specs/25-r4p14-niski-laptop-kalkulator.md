# Spec 25 — R4 przebieg 14 (24.11.2026 11:38): sceny na niskim laptopie, kalkulator — resztki R3-3, `GATES_LOGDIR`

Źródło: `agencja/STATUS.md` → „Następne” R4-N13 (2)–(3), recenzja 29 M1 (1100×620), lekcja R20 (widoki 1280×720 i 1100×620
z paskiem cookies w każdej zmianie układu), kolejka R3-3. Decyzje R4p12-A/B, R4p10-A, R4p4-A/B nadal czekają — NIE budujemy
niczego, co od nich zależy (nagłówki, CTA przypięte na telefonie, `/tool`). Bez nowych tekstów widocznych dla odwiedzającego,
z wyjątkiem B1 (poprawna liczba pojedyncza) — każdy inny zmieniony tekst: stop i zgłoś Leadowi.

Zasady dla dwóch budujących (R19.3): `node_modules` przez `cp -al` (nie `ln -s`), serwer zabijany tylko po porcie
(`fuser -k <port>/tcp`), nigdy `pkill -f next`. Każdy budujący ustawia `GATES_LOGDIR` na własny katalog, gdy już istnieje (B3).

## Strumień A — sceny `/nawyko` i `/work/genactiv` na niskim laptopie (worktree `wt/r4p14-a`, port 3101)
Problem (recenzja 29 M1, `rev-1100s-9.png`): przy 1100×620 z paskiem cookies wiersz 04 listy kroków i jego opis wchodzą pod pasek
aktów i są ucięte; na 1280×720 z paskiem cookies dolne linki sceny bywają blisko krawędzi. Niski laptop (13", powiększenie 125%,
okno nie na pełny ekran) to typowy ekran działu marketingu marki.
A1. Pomiar przed: skrypt `scripts/short-viewport-check.mjs <url> <W> <H> [--cookies]` — przewija przypiętą scenę krokami (co 2%
    wysokości sceny), na każdej pozycji sprawdza każdy WIDOCZNY tekst/przycisk/link w kontenerze sceny (`.nk-pin`/scena
    `/work/genactiv` — znajdź selektory w kodzie): czy jego prostokąt mieści się w oknie i nie jest zasłonięty przez element
    `position:fixed|sticky` (pasek aktów, pasek cookies, `ChapterBar`) — `elementFromPoint` w 3 punktach. Kod 1 przy jakimkolwiek
    ucięciu lub zasłonięciu; wypisuje pozycję, element, przyczynę. Zrzut pierwszego problemu do `agencja/podglad/r4p14-a-*.png`.
    Uruchom na `/nawyko` i `/work/genactiv` dla 1100×620, 1280×720 (obie z paskiem cookies i bez), 1440×900 — tabela przed w
    `agencja/specs/25-a-pomiary.md`.
A2. Poprawka w CSS (preferowane zapytania `@media (max-height: …)` / jednostki `dvh` / zmniejszenie odstępów i telefonu przy niskim
    oknie) tak, żeby A1 dawał PASS na wszystkich 5 widokach obu tras. Wygląd na 1440×900 i 390×844 bez zmian (zrzuty przed/po,
    porównanie pikseli albo oględziny — zapisz wynik). Zakaz: chowanie treści (reguła agencji — schowanie = zmiana zakresu),
    zmiana tekstów, `key` na kontenerach (R19.1). Reguła R20: na zrzutach po zmianie wiadomo, do czego należy każdy tekst.
A3. `bash scripts/gates.sh http://localhost:3101 /nawyko /work/genactiv` — PASS (scroll-perf zaszumiony: zapisz wartości).
    WebKit: `xvfb-run -a python3 -I scripts/webkit-check.py` w 390 i 1440 (gates robi), dodatkowo jeden zrzut WebKit 1100×620
    sceny `/nawyko` obejrzany.

## Strumień B — `/calculator` resztki R3-3 i bramki (worktree `wt/r4p14-b`, port 3102)
B1. Sprawdź i popraw (każdy punkt: zrzut przed/po albo test): (a) „1 orders”/„1 customers” — liczba pojedyncza dla 1 we wszystkich
    tekstach z liczbą w `CalculatorClient.tsx` (to jedyna dozwolona zmiana tekstu; poza tym brzmienie bez zmian);
    (b) obrys fokusu suwaka nachodzi na podpisy (zrzut fokusu z klawiatury 390 i 1440) — obrys nie może zasłaniać tekstu;
    (c) pierwszy ekran 390×844 z paskiem cookies: duża liczba wyniku widoczna nad paskiem (jeśli nie — rezerwa jak na
    `/work/genactiv`, bez zmiany treści); (d) suwak w WebKit (Safari): przeciągnięcie i klawiatura zmieniają wynik
    (`webkit-check.py` albo osobny skrypt Selenium) — zapisz wynik.
B2. Testy: `scripts/calculator-rules.test.mjs` (warstwa wyrenderowana z `--url`): dla 1 klienta/1 zamówienia brak „1 orders”,
    „1 customers”; kod 1 przy błędzie. Uruchom na starym (oczekiwany FAIL, jeśli błąd był) i nowym buildzie.
B3. `gates.sh`: zmienna `GATES_LOGDIR` (domyślnie `/tmp/gates`), selftesty (`clsscroll-selftest.sh`, `scrollperf-selftest.sh`)
    na różnych portach i wołające parsowanie z `gates.sh` (wydziel funkcję do `scripts/gates-lib.sh` i źródłuj w obu), gdy brak
    `WebKitWebDriver` — wiersz FAIL z poleceniem instalacji (`apt-get update && apt-get install -y webkit2gtk-driver xvfb`) zamiast
    niejasnego błędu. Selftesty muszą dalej przechodzić. Dopisz `GATES_LOGDIR` do nagłówka `gates.sh` (nie do CLAUDE.md).
B4. `bash scripts/gates.sh http://localhost:3102 /calculator` — PASS; tabela do `agencja/specs/25-b-wynik.md`.

## Wspólne
Commit w worktree z opisem; bez pushu. Raport końcowy: zmienione pliki, tabela przed/po, ścieżki zrzutów (w tym WebKit),
co nie wyszło. Lead scala, mierzy sam i zleca niezależną recenzję.
