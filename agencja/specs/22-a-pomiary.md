# Spec 22 strumień A — pomiary (R4 p11, 24.11.2026, `wt/r4p11-a`)

Maszyna 2 rdzenie, równolegle budował strumień B (WebKit, load 2,3–3,6) — każda liczba to 3 przebiegi.

## A1 — długie klatki 1440, CPU ×4: przyczyna NIE w obserwatorze D2
Narzędzie: `scripts/loaf-detail.mjs` (nowe; LoAF > 50 ms z fazą, pozycją, aktem sceny i skryptami; `NOMO=1` wyłącza
`MutationObserver` na `.nk-scene` bez przebudowy).

| Wariant (ten sam build) | klatki > 50 ms (3 przebiegi) | mediana | najdłuższa |
|---|---|---|---|
| z obserwatorem D2 (stan) | 1 / 3 / 2 | 2 | 54 / 62 / 75 ms |
| bez obserwatora (`NOMO=1`) | 4 / 5 / 2 | 4 | 59 / 71 / 85 ms |
| `scroll-perf.mjs` (stan, przed zmianą CSS) | 2 / 4 / 3 | 3 | 70 / 63 / 95 ms |

Obserwator nie pojawia się w atrybucji LoAF ani razu. Długie klatki wypadają przy zmianie aktu sceny (y ≈ 5640 akt 2,
12600 akt 6): render Reacta (`MessagePort.onmessage`, 17–31 ms), delegowane przez Reacta zdarzenia `transitionrun/start/end`
na dokumencie (9–20 ms) i rAF z wymuszonym układem (24 ms, raz); część klatek nie ma żadnego skryptu (praca wątku przy
obciążonej maszynie). **Kod `ChapterBar` bez zmian.** Trop na następny przebieg: koszt renderu sceny przy zmianie aktu
(ile przejść CSS startuje naraz; React słucha zdarzeń `transition*` na korzeniu, każde zdarzenie to przejście drzewa).
Ostateczny pomiar — Lead po scaleniu, sam na maszynie.

## A2 — CLS przy przewijaniu kółkiem 390×844
Narzędzie: `scripts/cls-scroll.mjs` (nowe; `layout-shift` + `sources`, prostokąty przed/po, `navigator.webdriver` nadpisany).

| | CLS (3×) | źródła |
|---|---|---|
| przed | 0,0005 / 0,0005 / 0,0005 | ~33 przesunięcia `.nk-axis .nk-track > i.nk-knob` (+ `::before`) — gałka dnia jechała przez `left` (przejście `left .12s`); 3 teksty w telefonie |
| po | 0,0001 / 0,0001 / 0,0001 | tylko 3 teksty w telefonie: `.nk-v1 .nk-mini.is-up > span` (0,00005), `.nk-v2 .nk-goal > span` (0,00001), `.nk-v4 .nk-rwd li.is-got > span` (0,00006) — zmiana szerokości wyrównanego do prawej tekstu |

Poprawka: `.nk-knob` jedzie `transform: translateX(calc(var(--d) / 30 * 100cqw))`, `.nk-track` ma `container-type:inline-size`
(`app/nawyko/nawyko.css`). Wygląd bez zmian (zrzuty `agencja/podglad/r4p11-a-{przed,po}-{390,1440}.png`).
Wartości 0,0100 z recenzji 26 nie odtworzono tym przebiegiem (krok 120 px co 50 ms) — inna metoda/obciążenie; przy obu
pomiarach < 0,001 po poprawce. Teksty w telefonie zostawione (wymagałyby stałej szerokości liczb — zmiana wyglądu).
A/B płynności 390 dla poprawki (`OLDKNOB=1`, przeplatane): stara 2/2/0 klatek > 50 ms, nowa 1/1/1 — bez różnicy ponad szum.
