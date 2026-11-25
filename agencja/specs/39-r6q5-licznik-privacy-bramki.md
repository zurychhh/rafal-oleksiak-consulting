# Spec 39 — R6' p5: licznik „Pack rhythm” widoczny na telefonie, panel Privacy bez pustki, szczelniejsze bramki

Przebieg 25.11.2026 11:38. Źródło: STATUS R6'-N4 (1)–(3), recenzja 46 (drobne 1–4).
NIE RUSZAĆ (RUNDA 6'): hero, „Four steps…”, „Rewards in the app”, finał, zapytanie. Żadna sekcja ani zdanie nie znika, żadnych nowych tekstów.

## A — kokpit `/nawyko` (budujący A, `wip/q5a`)
1. `#rhythm` — licznik 30→34 w telefonie marki ma osobny wyzwalacz: start, gdy telefon jest ≥ 35 % na ekranie
   (IntersectionObserver na telefonie), a nie wtedy, gdy wykres wjeżdża. Licznik rozłożony na cały czas animacji kropek
   (ok. 1,2 s, liniowo albo ease-out, ostatnia wartość 34 dopiero na końcu). Raz na pokazanie zakładki.
   Na ≥ 900 px (przypięty kokpit, telefon i wykres widoczne razem) kropki i licznik idą razem.
   `prefers-reduced-motion` i bez JS → stan końcowy 34 od razu. Bez CLS (stała szerokość cyfr: tabular-nums).
2. Panel Privacy na 1440 — w telefonie ok. 200 px pustego ekranu między „Streak” a „Agree and turn on”: bez nowych tekstów
   zmniejszyć pustkę (np. przycisk zgody jako arkusz przyklejony do treści, a nie do dołu, albo wyższe istniejące elementy).
   Telefon nie węższy niż 150 px, nie mniejszy niż dziś o więcej niż 10 %.
3. Etykiety dolnego paska w telefonach kokpitu ≥ 10 px (dziś 8,85 px) — bez łamania etykiet na 1440 i 390.

## B — bramki (budujący B, `wip/q5b`)
1. `webkit-check.py` na 390 kończy się kodem 2 mimo linii PASS: znaleźć przyczynę (sprzątanie sterownika/xvfb?),
   naprawić tak, by kod wyjścia = wynik; `gates.sh` ma brać wynik z kodu wyjścia i dodatkowo FAIL, gdy brak linii PASS.
   Samotest: przypadek „PASS + kod 2” → gates FAIL z czytelnym komunikatem, nie cichy PASS.
2. `css-dropped.mjs`: (a) wartości z `var()` — sprawdzić z podstawieniem wartości zastępczej / sprawdzeniem składni
   po podstawieniu `0`/`initial` tam, gdzie się da; przynajmniej łapać oczywiste przypadki jak `font:600 26px/1 var(--f)`
   z `inherit`-podobną konstrukcją nie da się — wtedy INFO, nie cisza; (b) `:is(...::-moz-...)`/`:where(...)` z pseudoelementem
   innego silnika = FAIL (cała lista martwa w Chromium); (c) `:global(...)` w `.module.css` nie daje fałszywego FAIL
   (odwinąć przed sprawdzeniem). Każdy przypadek jako wzorzec w `css-dropped-selftest.sh`.

## Kryteria
build · tsc · lint (≤ 1 ostrzeżenie) · `gates.sh http://localhost:PORT /nawyko /calculator` PASS (z inwentarzem i css-dropped),
samotesty bramek PASS, WebKit 390/1440 obejrzany, zrzuty `agencja/podglad/r6q5-*`, recenzent niezależny bez IMPORTANT.
