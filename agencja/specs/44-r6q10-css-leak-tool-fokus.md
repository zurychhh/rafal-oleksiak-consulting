# Spec 44 — R6' p10 (27.11.2026 10:38): arkusze tras bez przecieku + fokus na `/tool`

Wznowienie porzuconego przebiegu 26.11 12:38 (znacznik `W-TOKU` bez commitu zamykającego, praca na `wip/1238`).

## Zakres
1. **R40 — arkusze tras nie zmieniają innych tras po nawigacji klienckiej.** Next.js (App Router) nie usuwa arkuszy przy
   przejściu między trasami („this currently does not remove stylesheets as you navigate between routes which can lead to
   conflicts” — https://nextjs.org/docs/app/getting-started/css, sekcja „Ordering and Merging”). Gołe `html{}`, `body{}`,
   `:root{}`, `h1{}`, `section{}` w `privacy.css`, `blog-reset.css`, `stop.css`, `tool-reset.css`, `tool.css` zostawały
   w dokumencie i np. zerowały `scroll-padding-top` na `/work/genactiv` (pasek aktów zasłaniał cel kotwicy).
   Poprawka: zawężenie przez `:has(<znacznik trasy>)`; `tool.css` (generowany) zawężany w `ship-tool.mjs`
   przez `scripts/tool-css-scope.mjs`, żeby kolejna wersja narzędzia nie cofnęła poprawki.
2. **R41 — `/tool` focus-obscured** (z R-1038): Tab na `<summary>` „Show the rows this reading is counted from” na 1440×900
   kończył pod paskiem cookies. Przyczyna z pomiaru: przeglądarka przewija fokus „do najbliższej krawędzi”, pasek
   `position:fixed` 843–900, summary 852–900. Poprawka: `scroll-padding-bottom: calc(var(--consent-h) + 24px)` na
   `html:has(#orders)` (W3C C43, jak `/privacy`).

## Kryteria akceptacji
- `css-leak-check.mjs` PASS na nowym buildzie i FAIL na buildzie sprzed zmian (kontrola pozytywna, ten sam serwer, A/B).
- Zrzuty pełnej strony `/tool`, `/privacy`, `/stop`, `/blog`, `/work/genactiv`, `/nawyko`, `/` przy wejściu bezpośrednim:
  identyczne piksel w piksel z buildem sprzed zmian (390 i 1440).
- `focus-obscured /tool` OK (390, 1440).
- `gates.sh /tool /privacy /blog /stop /work/genactiv` PASS, w tym WebKit 390/1440 i `css-leak`.
- Build, `tsc --noEmit`, lint bez nowych błędów i ostrzeżeń.
- Zero zmian tekstów widocznych dla odwiedzającego.
