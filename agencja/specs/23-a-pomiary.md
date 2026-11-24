# Spec 23 A — pomiary (R4 p12, 24.11.2026, worktree `wt/r4p12-a`, port 3101)

Warunki: dwóch budujących na 2 rdzeniach, każdy pomiar ×3, mediana. `next start` na buildzie produkcyjnym.
Uwaga środowiskowa: Turbopack odmawia builda z `node_modules` jako dowiązaniem poza katalog projektu
(„Symlink node_modules is invalid, it points out of the filesystem root”). W tym worktree dowiązanie zastąpiono
kopią z twardymi linkami (`cp -al /home/claude/roc/node_modules`) — bez instalacji, bez dodatkowego miejsca na dysku.

## A1 — CLS przy przewijaniu kółkiem (`scripts/cls-scroll.mjs`, krok 120 px co 50 ms)

| Szerokość | Przed (3 przebiegi) | Mediana przed | Po (3 przebiegi) | Mediana po |
|---|---|---|---|---|
| 390×844 | 0,0001 / 0,0001 / 0,0001 (3 wpisy) | 0,0001 | 0,0000 / 0,0000 / 0,0000 (0 wpisów) | **0,0000** |
| 1440×900 | 0,0032 / 0,0032 / 0,0035 (23–24 wpisy) | 0,0032 | 0,0000 / 0,0000 / 0,0000 (0 wpisów) | **0,0000** |

Źródła przed (przebieg 1, suma udziałów):
- 1440: rozwijany opis kroku w scenie — `li.nk-step.is-on` 0,0016, pozostałe `li.nk-step` 0,0006, tekst `.nk-d > span` 0,0004,
  `p.nk-alt` 0,0003, `p.nk-next` 0,0002. Przyczyna: `grid-template-rows 0fr→1fr` i `padding-top:8px` przełączane przy zmianie
  aktu przesuwały kolejne kroki i akapity pod listą.
- 390: `.nk-mini.is-up > span` (dopisane „+1”), `.nk-goal > span` („N to go”), `.nk-rwd li.is-got > span` („day 7” → „✓ earned”) —
  tekst wyrównany do prawej zmieniał szerokość, więc lewa krawędź się przesuwała.

Zmiana (`app/nawyko/NawykoClient.tsx`, `nawyko.css`):
- trzy teksty w telefonie dostają nowy węzeł (`key`) przy zmianie treści — nowy węzeł nie jest przesunięciem;
- w trybie przewijanym lista kroków + akapity pod nią są w `Fragment key={step}`: przy zmianie aktu montują się od nowa
  w stanie końcowym. Opis aktywnego kroku wchodzi animacją tylko `opacity`+`transform` (`nk-din`, 0,45 s; wyłączona przy
  `prefers-reduced-motion`). Fokus: jeśli był na przycisku kroku, po przemontowaniu wraca na przycisk aktywnego kroku (`preventScroll`).
  Tryb statyczny (`is-still`) bez zmian.
- Różnica w wyglądzie: tylko w trakcie zmiany aktu na desktopie — wcześniej opis „rozwijał się” wysokością, teraz lista
  od razu ma docelowy układ, a opis wjeżdża przezroczystością. Stany spoczynkowe identyczne.

Kryterium spec (mediana < 0,001 na 390 i 1440): **spełnione**.

## A3 — koszt renderu przy zmianie aktu (`scripts/loaf-detail.mjs`, 1440, CPU 4×)

| | Przebieg 1 | Przebieg 2 | Przebieg 3 | Mediana klatek > 50 ms (kółko) |
|---|---|---|---|---|
| Przed | 1 (69 ms, y=240) | 2 (65 ms y=240; 51 ms interakcja) | 1 (74 ms, y=240) | 1 |
| Po (cisza na CPU) | 2 (59 ms y=240; 68 ms interakcja) | 1 (89 ms, y=240) | 1 (59 ms, y=360) | 1 |

Pierwsza seria „po” przy obciążeniu load 3,5 (build drugiego budującego) dała 4–5 klatek kółka, część z pustą listą skryptów
(czysty brak CPU) — odrzucona, powtórzona w ciszy.

**Werdykt A3: hipoteza upada.** Jedyna długa klatka kółka jest przy y≈240, przed przypięciem sceny (akt 0), a skrypt Reacta
w niej to 6–15 ms (`MessagePort.onmessage` = scheduler). Przy zmianach aktów (sceny przypiętej) długich klatek nie ma
ani przed, ani po. `React.memo` dla ekranów telefonu — bez kodu.

## Bramka (`bash scripts/gates.sh http://localhost:3101 /nawyko`)
Przebieg 1: FAIL `scroll-perf-1440` (101 ms) oraz `content-rules`/`focus-ring` — serwer 3101 został w trakcie ubity z zewnątrz
(ERR_CONNECTION_REFUSED na `/`). Przebieg 2 (po restarcie): wszystko PASS poza `scroll-perf-390` (154 ms, 1 klatka);
`scroll-perf-390` powtórzony sam: PASS (65 ms, interakcja 32 ms). `scroll-perf-1440` w przebiegu 2: PASS (75 ms).
`npm run build` OK, `tsc --noEmit` 0, lint 0 błędów / 1 ostrzeżenie (istniejące, `getPosts`), copy-voice OK, `jsonld-rules` PASS.

## Zrzuty
`agencja/podglad/r4p12-a-przed-{1440,390}-{exchange,integrations}.png` i `r4p12-a-po-…` (te same pozycje, nagłówki A2).
`r4p12-a-po-{1440,390}-scena-*.png` — scena po zmianie. Zrzutów „przed” sceny w tych samych pozycjach brak: pierwszy skrypt
zrzutów celował w pozycje kółka, które nie trafiały w scenę (usunięte), a stary build był już nadpisany.

## Po recenzji 28 (Lead, 24.11 10:10) — A1 lista kroków WYCOFANA, A2 WYCOFANE
- Recenzja 28 (WAŻNE): CLS 0 na 1440 był tylko efektem miary — przy `key` na całej liście kroki pod aktywnym przeskakują
  w jednej klatce (54 px i 23 px), ale nowe węzły nie liczą się do CLS (web.dev „CLS”: przesunięcie = zmiana pozycji
  ISTNIEJĄCEGO elementu). Oko widzi skok, więc to pogorszenie. Cofnięte: `Fragment key`, `nk-din`, przywracanie fokusu.
  Zostały `key` na trzech tekstach w telefonie (tekst wymieniany w miejscu, sąsiedzi się nie ruszają). Stan po scaleniu:
  clsscroll 390 0,00000, 1440 0,00338 (INFO, źródło `.nk-step is-on` jak przed — rozwinięcie opisu jest animowane).
- A2: czytelnik-kupujący odrzucił wszystkie trzy nagłówki („budget” sugeruje limit, którego suwak nie ustawia; „Built on”
  nic nie niesie; „Reorders: four steps” — bohaterem są kroki). Przywrócone stare brzmienia; jego propozycje w „Czeka na Rafała”.
- scroll-perf 390 po scaleniu 85–146 ms; przeplatany pomiar A/B ze starym buildem (582834f, ten sam kod `/nawyko` bez kluczy):
  stary 181/119/161 ms, nowy 144/98/80 ms → brak regresji, szum maszyny (2 rdzenie).
