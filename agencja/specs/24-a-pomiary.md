# Spec 24 A — pomiary (R4 p13, 24.11.2026, worktree `wt/r4p13-a`, port 3101)

Warunki: 2 rdzenie, drugi budujący równolegle (port 3102), `next start` na buildzie produkcyjnym. Pomiary orientacyjne.

## Wybrany wariant: (b) wspólne miejsce na opis pod listą
- Wiersze kroków mają zawsze tę samą wysokość (sam numer + tytuł). Opis bieżącego kroku stoi w jednym miejscu pod listą
  (`.nk-dslot`, `aria-hidden`): wszystkie cztery opisy w jednej komórce siatki (`grid-area:1/1`), widoczny tylko bieżący
  (przenikanie `opacity`, 0,3 s). Wysokość miejsca = najdłuższy opis przy danej szerokości, więc nic pod nim też nie skacze.
- Opisy w wierszach zostają w przyciskach (ukryte wizualnie tylko w trybie przewijanym ≥ 861 px) — nazwa dostępna
  każdego przycisku bez zmian; Tab przez cztery przyciski i `aria-current` bez zmian (sprawdzone Playwright, 1440).
- Bez ponownego montażu (`key`) czegokolwiek (R19.1). Teksty widoczne bez zmian (te same zdania, inne miejsce).
- Tryb statyczny (`is-still`, m.in. reduced-motion) i telefon < 861 px: bez zmian (miejsce `display:none`).

Dlaczego nie (a) stała wysokość każdego wiersza: lista rośnie o ~3 × 54 px; na 1100×800 ostatni opis wchodzi pod pasek
aktów sceny (zrzut `r4p13-a-wariant-a-1100-krok4.png`), na 1440×900 wiersze z pustą przestrzenią wyglądają na rozstrzelone.
(b) mieści się w tej samej wysokości co dziś stan rozwinięty. Zrzuty wariantów: `agencja/podglad/r4p13-a-wariant-{a,b}-{1440,1100}-krok{1..4}.png`
(wstrzyknięty CSS na starym buildzie; w (b) makieta miała stałe 2 linie — wdrożenie liczy wysokość z siatki).

## Kryteria
| | Przed | Po |
|---|---|---|
| `cls-scroll` 1440×900 ×3 | 0,00327 / 0,00326 / 0,00360 → mediana **0,00327** | 0,00000 / 0,00000 / 0,00000 → mediana **0,00000** |
| `cls-scroll` 390×844 | 0,00000 | 0,00000 |
| `steps-stable-check` 1440×900 | FAIL — krok 4: 54,4 px | PASS 0,00 px (1178 klatek) |
| `steps-stable-check` 1100×800 | FAIL — krok 4: 54,4 px | PASS 0,00 px (1102 klatki) |
| `steps-stable-check` 900×700 | — | PASS 0,00 px (1047 klatek) |

`scripts/steps-stable-check.mjs` (nowy): w każdej klatce (rAF) `top` każdego `.nk-step` względem `.nk-steps`, nagłówka
`.nk-h2` względem listy i listy względem `.nk-stage`; kółko 0→1→2→3→(4) i z powrotem, potem klik w przyciski 2,3,4,1.
Kod 1 przy > 1 px. Lista względem sceny jest pomijana tylko w klatkach, w których biegnie animacja wejścia całego bloku
`.nk-in` (transform 18 px po powrocie z aktu 4 do 3 — cały blok jedzie razem, sąsiedzi nie skaczą; istniało przed zmianą).

## Wygląd 390 i reduced-motion
Zrzuty `agencja/podglad/r4p13-a-{przed,po}-390-krok{1..4}.png` i `r4p13-a-{przed,po}-rm-1440-krok{1..4}.png`:
różnica pikseli zero, poza 390 krok 2 w obrębie zdrapki w telefonie (animacja zdrapywania, inna klatka czasu).
Po na desktopie: `r4p13-a-po-{1440,1100}-krok{1..4}.png`.

## Bramki
`npm run build` OK · `tsc --noEmit` 0 · lint 0 błędów / 1 ostrzeżenie (istniejące `getPosts`) ·
`bash scripts/gates.sh http://localhost:3101 /nawyko`: wszystko PASS (clsscroll 390/1440 0,00000; scroll-perf 1440:
klatka 100 ms, interakcja 40 ms; 390: 61 / 32 ms; WebKit 390/1440 PASS).
Uwaga: zrzuty WebKit z bramki pokazują scenę w trybie statycznym (wszystkie opisy w wierszach) — wariant przewijany
z `.nk-dslot` nie był oglądany w WebKit (do sprawdzenia przez Leada na Safari).
