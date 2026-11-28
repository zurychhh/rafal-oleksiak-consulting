# Spec 52 — R6' p17: kontrast w każdym stanie (finał `/nawyko` po każdej kropce, skrajne kolory marki), narzędzie `state-contrast`

Źródło: R6'-N16 pkt 2 — `qa.js` mierzy kontrast tylko w stanie po załadowaniu, więc telefon finału widział tylko w chwili 1;
kontrast chwil 2–5 policzono w p16 ręcznie. Silnik marki przyjmuje dowolny `#RRGGBB`, a żadna bramka nie mierzyła kontrastu
dla jasnego (żółty, prawie biały) ani ciemnego koloru marki. WCAG 2.2 SC 1.4.3: 4,5:1, 3:1 dla tekstu dużego.

## Zmiany (tylko bramki, zero zmian na stronie i w tekstach)
1. `scripts/reflow-check.mjs` (stała bramka `reflow` w `gates.sh`): po skanie każdego rozmiaru klika każdą kropkę finału
   i mierzy kontrast każdego widocznego tekstu w `.nk-fz-phone` (tło składane z warstw z alfą, efektywna nieprzezroczystość
   przodków > 0,5). Dodatkowo 640×360 dla kolorów marki `#FFE600,#F4F4F4,#111111,#7A7A7A,#00B3FF` (`REFLOW_COLOURS`).
   Zero sprawdzonych tekstów przy obecnych kropkach = FAIL „NIETESTOWANE”. Kontrola pozytywna: `REFLOW_SELFTEST_CSS`.
2. `scripts/contrast-eval.cjs` — wspólny pomiar do `page.evaluate`; tekst na gradiencie/obrazie = „nieznane tło” (INFO), nie PASS.
3. `scripts/state-contrast.mjs` — każda kontrolka `[role=tab]` i `[aria-pressed]` w `<main>`: klik, kontrast wszystkich
   widocznych tekstów w oknie (390×844, 1440×900, kolor `#FFE600`). Narzędzie ręczne, NIE w `gates.sh`: jeden rozmiar trwa
   2–4 min (przewijanie do przypiętych scen), część kontrolek kokpitu na 1440 niewidoczna poza torem sceny.

## Kryteria
- `reflow-check /nawyko`: PASS, 5 chwil × 128 tekstów na 320×568 i 640×360, PASS dla 5 kolorów marki.
- Kontrola pozytywna: `.nk-fz-use{color:#6b6b6b}` → FAIL (2,77:1 i 1,04:1 w chwilach 3–5) — bramka nie jest ślepa.
- Build, tsc 0, lint 0 błędów / 1 ostrzeżenie (jak przed). Bez zmian w `app/` → WebKit, CLS i inwentarz bez zmian z definicji.

## Wynik
`reflow-check /nawyko /work/genactiv`: REFLOW PASS w 60 s (2 rozmiary + 5 kolorów; po poprawkach z recenzji 57 w 5 chwilach ~60 tekstów zmierzonych i ~65 na gradiencie jako INFO — wcześniejsze „128 zmierzonych” liczyło teksty na gradiencie wobec złego tła). Kontrola pozytywna FAIL jak trzeba.
`state-contrast /nawyko`: PASS 390×844 (26/33 kontrolek, 462 teksty, 77 na gradiencie = INFO), 1440×900 (26/33, 657),
1440 `#FFE600` (8/33 — niestabilne, patrz kolejka). Zrzuty kolorów: `agencja/podglad/r58-col-*.png`.
