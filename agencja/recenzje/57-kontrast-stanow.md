# Recenzja 57 — spec 52 (bramki kontrastu stanów), niezależny subagent qa, sam kod (28.11 ~11:15)

Wynik pierwszy: FAIL (2 punkty do poprawy), progi WCAG i ochrona localhost PASS, `gates.sh` PASS z ryzykiem.
Poprawione w tym przebiegu:
- `reflow-check` miał własną kopię pomiaru bez obsługi gradientu → używa wspólnego `contrast-eval.cjs`
  (tekst na gradiencie/obrazie = „nieznane tło”, INFO; w telefonie finału ~65 takich tekstów — ekran główny na gradiencie).
- Nieprzezroczystość przodków 0,51–0,99 była liczona jak pełna → alfa tekstu mnożona przez efektywną nieprzezroczystość.
- `color(srgb …)` (color-mix) czytany jak 0–255 → kanały 0–1 × 255.
- Pierwszy pasujący `.nk-fz-phone` → wszystkie pasujące.
- Klik zasłoniętej kropki wywracał skrypt (brak linii REFLOW) → FAIL z opisem „nieklikalna”.
- Strony kolorów marki z `reducedMotion: 'reduce'`; skan główny bez zmian (zmiana zmieniłaby zakres starej bramki).
Zostaje (kolejka): tła z rodzeństwa/`::before` i tryby mieszania są poza zasięgiem pomiaru z DOM — „nieznane tło”
wymaga pomiaru z pikseli zrzutu (kolejka N17 pkt 2). `state-contrast` liczy klik skryptem bez sprawdzenia skutku.
Kontrola pozytywna po poprawkach: `.nk-fz-use{color:#6b6b6b}` → FAIL 2,77:1 / 1,04:1. Wynik końcowy: PASS.
