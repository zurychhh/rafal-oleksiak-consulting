# Spec 19 — R4 przebieg 8: płynność scen przewijania (INP / długie klatki) i szlif ruchu realizacji

Kolejka wiedzy pkt 6: „INP dla scen sterowanych przewijaniem (long tasks w `scroll` + rAF)”. Klient marki ogląda na
średnim telefonie, nie na naszym serwerze — mierzymy z dławieniem CPU 4× (Chromium, CDP `Emulation.setCPUThrottlingRate`).

**Pomiar (obie trasy, ten sam skrypt `scripts/scroll-perf.mjs`, nowy):** Chromium, 390×844 i 1440×900, `navigator.webdriver`
nadpisany (inaczej układ statyczny — R14), CPU 4×. Przewinięcie całej strony krokami `mouse.wheel` (≈ 120 px co 50 ms),
potem 3 interakcje (klik/drag) w scenach z kontrolkami. Zbiera `PerformanceObserver` `long-animation-frame` (LoAF, `buffered`)
i `event` (durationThreshold 16) → wypisuje: liczba klatek > 50 ms i > 100 ms, najdłuższa klatka, suma czasu blokady,
top 3 skrypty z `scripts[].sourceURL/invoker` (atrybucja), najdłuższa interakcja (proxy INP). Kod wyjścia 1, gdy najdłuższa
interakcja > 200 ms albo klatka > 200 ms. Wynik wypisuje tryb sceny (R13/R14: bramka mówi, CO zmierzyła).

**A. `/nawyko`:** pomiar przed → najwyżej dwie poprawki największego źródła (np. odczyt układu po zapisie stylu w obsłudze
przewijania, praca w `scroll` zamiast w jednym rAF, przeliczanie wszystkich aktów zamiast aktywnego) → pomiar po.
Kryteria: liczba klatek > 50 ms przy przewijaniu na 390 (4×) mniejsza o ≥ 30% albo uzasadnienie liczbami, czemu nie da się;
najdłuższa interakcja ≤ 200 ms; wygląd bez zmian (zrzuty przed/po w 3 pozycjach); CLS `scripts/cls-check.mjs` bez pogorszenia.
Dodatkowo (kolejka wiedzy pkt 4, reszta): jeden węzeł WebSite z `@id` na `/nawyko` (dziś dwa) — `jsonld-rules` PASS.

**B. `/work/genactiv`:** ten sam pomiar przed/po i te same kryteria. Plus szlif ruchu: seria zrzutów co 4% toru sceny na
390 i 1440 (Chromium, tryb sceny) — znajdź najwyżej dwie usterki ruchu widoczne w klatkach (puste klatki, nakładające się
teksty, element przeskakujący zamiast przejeżdżać, telefon ucięty) i popraw; dowód przed/po.

**Wspólne:** reduced motion bez zmian; brak nowych zależności; bramki z `agencja/STATUS.md` (build, tsc, lint 0 błędów /
nie więcej ostrzeżeń, copy-voice, content-rules, qa.js lokalnie, WebKit 390+1440 — uruchamia Lead po scaleniu).
