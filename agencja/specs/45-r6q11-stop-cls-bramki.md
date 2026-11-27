# Spec 45 — R6' p11: /stop bez skoku przy pasku cookies, statyczna css-leak, font-preload, serve.sh (27.11.2026 11:38)

Kolejka: R6'-N10 pkt 0 i pkt 4. Pliki: `app/stop/stop.css`, `app/stop/page.tsx`, `scripts/css-leak-static.mjs` (nowy),
`scripts/font-preload-check.mjs` (nowy), `scripts/serve.sh` (nowy), `scripts/gates.sh`. Tekstów widocznych dla odwiedzającego nie zmieniamy.

## Kryteria
1. `/stop` clsscroll 390 i 1440 ≤ 0,001 (było 0,019 na 390): kolumna nie skraca się o `--consent-h`; fokus nad paskiem (`scroll-padding-bottom`).
2. Żadna kontrolka `/stop` (pole, „Remove me”, link do polityki) pod paskiem cookies przy pierwszym widoku na 390×844, 375×667, 1440×900.
3. `prefers-reduced-motion` na `/stop` nie wyłącza przejść na innych trasach po nawigacji klienckiej (`.stopwrap *`, nie `*`).
4. `css-leak-static`: samotest (złe i dobre wzorce, zbiór globalny, zbiór importowany) PASS; prawdziwe pliki PASS; arkusz, którego nikt
   nie importuje (`app/audit.css`), raportowany jako MARTWY i nie liczy się do FAIL; kontrola pozytywna na starym `stop.css` = FAIL.
5. `font-preload`: każdy preload fontu w HTML trasy to krój, który trasa rysuje (390 i 1440); kontrola pozytywna (wstrzyknięty preload) = FAIL.
6. `serve.sh`: restart serwera z kodem 0 tylko, gdy serwer podaje bieżący `.next/BUILD_ID`.
7. `gates.sh /stop /privacy` PASS (w tym WebKit 390/1440), tsc 0, lint bez nowych ostrzeżeń (1 → 1).
