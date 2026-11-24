# Recenzja 25 — R4 p9: pasek rozdziałów na /nawyko

Data: 2026-11-24 · recenzent niezależny (nie budował) · build produkcyjny na http://localhost:3000 · Chromium Playwright, `navigator.webdriver=false` (scena przypięta, `data-nk-pin` aktywne) · 390×844 i 1440×900, z zgodą cookie i bez.

**Werdykt:** do wypuszczenia po poprawce dwóch WAŻNYCH (kolejność Tab w rozwijanej liście, zasłanianie górnej części telefonu na 390). Nic blokującego. CLS 0, focus-obscured OK, kontrast z zapasem we wszystkich trzech skórkach. Lekki, ale powtarzalny wzrost długich klatek na telefonie (1 → 3–4).

## Wyniki pomiarów

| Sprawdzenie | Wynik |
|---|---|
| `cls-check` /nawyko 390×844 | PASS, CLS 0.0000 |
| `cls-check` /nawyko 1440×900 | PASS, CLS 0.0000 |
| `cls-check` /nawyko#faq 390×844 | PASS, CLS 0.0000 |
| `focus-obscured.test.mjs` /nawyko | OK |
| `scroll-perf` 1440×900 cpu 4× | klatki >50 ms: **1** (najdłuższa 67 ms), >100 ms: 0 — bazowo 0 |
| `scroll-perf` 390×844 cpu 4× | klatki >50 ms: **4**, potem **3** w drugim przebiegu (najdłuższa 80/79 ms), >100 ms: 0 — bazowo 1 |
| Konsola (3 konteksty) | zero błędów i ostrzeżeń hydratacji; jedno ostrzeżenie o preloadzie CSS (niezwiązane) |
| Stan ukryty | `inert=true`, `aria-hidden="true"`, `visibility:hidden`, transform −101% — potwierdzone na starcie, po przewinięciu w dół i przy formularzu |
| Pokazanie / chowanie | pierwszy ekran: ukryty; przewinięcie w górę za hero: widoczny; w dół: ukryty; przy `#enquiry`: ukryty mimo przewijania w górę |

Zrzuty: `agencja/podglad/r4p9-rev-{390-c,390,1440}-up{8,20,35,50,70,85}.png`, `-enquiry.png`, `r4p9-rev-390-dropdown.png`, `r4p9-rev-{390,1440}-jump-cashback.png`.

## BLOKUJĄCE

Brak.

## WAŻNE

**W1. Przy otwartej liście (<1100 px) Tab przeskakuje listę i idzie najpierw do „Ask about Nawyko”.**
Dowód: fokus na `.cb-toggle` → Enter (lista otwarta, `aria-expanded=true`) → Tab → fokus na `a[href="#enquiry"]` (CTA), a nie na „01 How it works”. Wzrokowo lista leży pod przyciskiem, więc kolejność fokusu nie zgadza się z kolejnością czytania (WCAG 2.4.3). Przyczyna: w DOM `<ol id="cb-list">` stoi po `.cb-cta`.
Poprawka: przenieść `<ol className="cb-list">` bezpośrednio za `<button className="cb-toggle">` (lista i tak jest w osobnym wierszu: wystarczy `flex-wrap:wrap` na `.cb-row` i `order`/`flex-basis:100%` na liście albo zostawić listę poza `.cb-row`, a CTA wyjąć za nią z `order:-1`). Najprościej: kolejność DOM toggle → lista → CTA, a CTA wizualnie w pierwszym wierszu przez `display:grid` z nazwanymi obszarami. Escape działa poprawnie: zamyka i wraca fokusem na przycisk.

**W2. Na 390 px pasek zasłania górne ~35 px przypiętego telefonu, w tym nagłówek aplikacji z nazwą marki.**
Dowód: przy każdym położeniu w scenie `.nk-phone` ma `top 18`, pasek `bottom 53` (`r4p9-rev-390-up20.png`; w `r4p9-rev-390-up50.png` widać już tylko „REWARD UNLOCKED”, linia „TOVEMI · DEMO” jest pod paskiem). To jest akurat ten element, który ma sprzedać „aplikację pod Twoją marką”. Na 1440 problem nie występuje (scena ma margines, telefon zaczyna się ~80 px pod paskiem, `r4p9-rev-1440-up35.png`).
Poprawka (do wyboru, od najprostszej): (a) na <1100 px nie pokazywać paska, dopóki przypięta scena `#how` zajmuje ekran — scena ma własną nawigację aktów i pasek postępu, więc orientacja nie ginie; w `tick`: `const inScene = vw<1100 && how.top<=0 && how.bottom>vh` i `on = past && !atForm && !inScene && ...`; (b) albo dodać na `.nk-stage` górny odstęp równy wysokości paska tylko na wąskich ekranach na stałe (bez przełączania w locie, żeby nie wywołać przesunięcia), np. `@media (max-width:1099px){.nk-stage{padding-top:54px}}`, jeśli wysokość sceny na to pozwala.

**W3. Długie klatki na telefonie wzrosły z 1 do 3–4 (dwa przebiegi), na 1440 z 0 do 1.**
Dowód: `scroll-perf` 390: 4, potem 3 klatki >50 ms, czas w `chunks/82f86bbf1a6afe9a.js MessagePort.onmessage` (to harmonogram React DOM, chunk nie zawiera kodu paska — `cb-toggle` jest w `b26ee819a97c3c9a.js`), 36 ms / 23 ms. Nie da się z tego jednoznacznie przypisać winy paskowi bez buildu z wyłączonym paskiem, ale nowy kod robi w każdej klatce przewijania: 9× `getBoundingClientRect` (7 sekcji + hero + formularz) oraz trzy `setState` (`setCur`, `setShown`, `setOpen`). Przy niezmienionej wartości React zwykle odpuszcza render, ale nie zawsze (pierwsza aktualizacja po zmianie kolejki renderuje komponent jeszcze raz), a odczyty geometrii w tej samej klatce, w której scena pisze style, mogą wymuszać układ (w pierwszym przebiegu 1440: „wymuszony układ 13 ms”).
Poprawka: trzymać `cur`/`shown` w refach i wołać `setState` tylko przy zmianie (`if (k !== curRef.current) { curRef.current = k; setCur(k) }`, tak samo `shown`, `setOpen(false)` tylko gdy `openRef.current`); zamiast pętli `getBoundingClientRect` po sekcjach użyć `IntersectionObserver` (spy z `rootMargin:'0px 0px -60% 0px'`, hero i formularz też przez IO), a w `scroll` liczyć wyłącznie kierunek z `scrollY`. Potem powtórzyć `scroll-perf` 390 trzy razy i porównać z bazą 1.

## DROBNE

**D1. Na 1440 dwa rzędy nawigacji naraz w scenie.** Pasek (Nawyko · How it works · Cashback · Points · Your costs · Privacy · Proof · FAQ) i dolna nawigacja aktów sceny (Purchase · Daily card · Streak · Reward · Reward calendar · Pack rhythm · Your branding) są widoczne jednocześnie, oba wersalikami z rozstrzeleniem (`r4p9-rev-1440-up35.png`). Dla właściciela marki FMCG w 5 sekund: górny pasek czyta się jako „spis treści strony + przycisk zapytania” — pomaga; 14 etykiet tym samym krojem to jednak szum. Kiczu brak (brak cieni, gradientów, animacji poza krótkim wjazdem). Poprawka: w scenie dawać paskowi tylko nazwę bieżącego rozdziału + CTA (ukryć `.cb-links` poza `aria-current` przy `inScene`), albo zostawić i obserwować w nagraniach sesji.

**D2. Rozdział „How it works” trwa pół strony.** Scena `#how` ma 11 816 px z 25 133 px strony (390), więc od 8% do 50% przewinięcia pasek stale mówi „How it works”. Zgodne z treścią, ale scroll-spy mniej orientuje tam, gdzie strona jest najdłuższa. Poprawka (opcjonalna): w scenie pokazywać „How it works · 04 Reward” z aktu sceny.

**D3. Tab z ostatniego elementu paska wyrzuca na początek strony.** Kolejność: `.cb-toggle` → `.cb-cta` → przycisk w hero (strona przewinęła się z y=22 143 do y=92). Wynika z położenia paska w DOM przed `<main>` (tak samo robi Apple). Pasek jest dostępny z klawiatury praktycznie tylko po Shift+Tab od góry, więc skutek mały. Poprawka: zostawić; ewentualnie opisać w notatce dostępności.

**D4. Po kliknięciu rozdziału fokus zostaje na `<body>`.** Kliknięty link natychmiast staje się `inert`, więc `document.activeElement` = body (sprawdzone dla Cashback i FAQ). Przeglądarka przenosi punkt startu nawigacji sekwencyjnej na cel kotwicy, więc Tab powinien pójść dalej w sekcji, ale czytnik ekranu nie ogłosi celu. Poprawka: w `jump` po skoku `requestAnimationFrame(() => target.focus({preventScroll:true}))` z `tabIndex={-1}` na sekcjach rozdziałów.

**D5. Czerwony numer bieżącego rozdziału w liście: 4,70:1** (paper, `#D6202B` na `#F7F5F0`, 11 px). Przechodzi 4,5:1, ale z minimalnym zapasem przy bardzo małym kroju. Poprawka: użyć `--red-s` (`#9E161F`) dla `.cb-n` w stanie bieżącym.

**D6. `aria-hidden` razem z `inert`** — nadmiarowe (inert już wyłącza z drzewa dostępności), nieszkodliwe. `inert={!shown}` w React 19 renderuje się poprawnie (`element.inert === true` zmierzone). Etykieta „Overview” przy `cur=-1` jest w praktyce niewidoczna (pasek nie pokazuje się nad hero) — można uprościć.

## Kontrast (zmierzony w przeglądarce dla paper, policzony z tokenów dla night i clay)

| Tekst | paper | night | clay |
|---|---|---|---|
| bieżący rozdział, nazwa, CTA (ink / paper na ink) | 16,62 | 15,89 | 12,88 |
| pozostałe linki i numery (`--dim`) | 6,25 | 7,29 | 6,25 |
| numer bieżący (`--red`) | 4,70 | 6,56 | 5,29 |

Skórka night ustawia się przez wybór „Night” w akcie „Your branding” (`host.dataset.skin` w `NawykoClient.tsx:1786`); pasek leży w `.nk`, więc dziedziczy tokeny. Wszystko ≥ 4,5:1.

## Co działa dobrze

Zero przesunięć układu (fixed + transform), poprawne `inert` w stanie ukrytym, chowanie przy formularzu, wyciszenie 800 ms po skoku (po skoku w górę do Cashback i w dół do FAQ pasek nie wrócił nad nagłówek przez 2,5 s pomiaru; nagłówek sekcji na `top 0`), CTA prowadzi do `#enquiry` (formularz 88/100 px od góry), Escape zamyka listę i oddaje fokus przyciskowi, sprzątanie listenerów w obu efektach poprawne, brak ostrzeżeń w konsoli. Pasek nie nachodzi na baner cookie ani na dolną nawigację aktów sceny.

## Decyzje do podjęcia

1. **W2 — wariant (a) czy (b)?** Rekomendacja: (a) chować pasek w przypiętej scenie na <1100 px; prostsze i bez ryzyka CLS. Bez decyzji telefon z nazwą marki pozostaje przycięty na każdym telefonie.
2. **D1 — uprościć pasek w scenie na desktopie?** Rekomendacja: tak, tylko bieżący rozdział + CTA. Bez decyzji zostaje dwupoziomowa nawigacja widoczna naraz.
