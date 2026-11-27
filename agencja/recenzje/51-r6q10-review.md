# Recenzja 51 — R6' p10 (27.11.2026, niezależny recenzent-subagent, nie widział budowy)

Zakres: spec 44 (arkusze tras zawężone przez `:has()`, `tool.css` w `html:has(#orders){…}`, `scroll-padding-bottom` na `/tool`).
Metoda: A/B nowy build (3000) vs build sprzed zmian (3001), Playwright Chromium.

- **Specyficzność — OK.** `getComputedStyle` 299 elementów `/tool` (390, 1440): jedyna różnica to zamierzone `scroll-padding-bottom`.
  0 różnic po otwarciu `<details>`, kliknięciu „paste your own export”, hover 12 linków, 40× Tab (obrysy), tryb druku.
  Nieprzetestowane: panele AI `#ai1/#ai2` w stanie jawnym (brak klucza API lokalnie — `display:none` na obu buildach).
- **Nawigacja kliencka — OK.** `/tool` ↔ `/nawyko`, `/stop`, `/blog`, `/privacy`, `/work/genactiv`, `/`: style trasy docelowej
  = wejście bezpośrednie. Na starym buildzie potwierdzony wyciek (`/tool` → `/work/genactiv`: `scroll-padding-top` 0 zamiast 100 px).
- **/stop, /privacy, /blog — OK.** 0 różnic stylów obliczonych przy wejściu bezpośrednim.
- **Fokus pod paskiem cookies — OK.** 150× Tab bez zgody, `elementFromPoint`: nowy build 0; stary 10 (1440, summary „Show the rows…”)
  i 18 (390, „paste your own export”, „open a file”).
- **Drobne:** do zmierzenia paska `--consent-h` jest puste (`scroll-padding-bottom` 24 px, potem 81 px) — test przeszedł.
