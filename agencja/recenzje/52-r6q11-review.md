# Recenzja 52 — R6' p11 (niezależny subagent, 27.11.2026 ~11:58)

Werdykt pierwszej wersji: a) kontrola BUILD_ID PASS (id w HTML 7 tras i w 404; bez `-L` przekierowanie dałoby fałszywą odmowę),
b) logika „martwy arkusz” PASS (tylko `app/audit.css`; luki teoretyczne: `require('./x.css')`, import CSS spoza `app/`),
c) **FAIL**: preload DM Sans 400 + Poppins 700 na `/stop` nieużywany — `/stop` rysuje wszystko Instrument Sans (`--sans/--mono/--disp`
w `globals.css`), ~22 KB pobierane na darmo, a skok nie zależał od preloadu (blokada obu fontów: CLS bez zmian); reszta c) czysta:
kontrolki ≥ 52 px nad paskiem na 390×844/375×667/1440×900, kolejność Tab bez zasłonięć, pole nie przesuwa się przy pojawieniu paska,
ruch ograniczony zachowany; d) teksty bez zmian PASS; e) zakres PASS.

Poprawki po recenzji: preload zamieniony na `instrument-sans-400-600-latin.woff2` (pomiar: jedyny pobierany font), komentarz R42 poprawiony;
duplikat kontroli BUILD_ID usunięty (taka kontrola już była w `gates.sh` od R17 — patrz lekcja R42.1), zamiast niej `scripts/serve.sh`;
nowa bramka `font-preload` zamienia ten błąd w test (kontrola pozytywna PASS; na 7 trasach 20 preloadów, 0 FAIL).
Ponowna bramka po poprawkach: `gates.sh /stop /privacy` WYNIK PASS, clsscroll /stop 0,00000 na 390 i 1440.
