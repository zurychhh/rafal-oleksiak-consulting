# Recenzja 27 — R4 przebieg 11 (niezależny recenzent, 24.11.2026)

Zakres: `git diff 3a7983f HEAD -- app/` (3 pliki), spec 22-r4p11. Serwer `localhost:3100`, Chromium z Playwright,
`navigator.webdriver=false` (addInitScript), 390×844 i 1440×900, także `prefers-reduced-motion: reduce`.
Skrypty pomiarowe w katalogu roboczym recenzenta (nie w repo); zrzuty `agencja/podglad/r4p11-rev-*.png`.

**Werdykt: do scalenia, z jednym punktem WAŻNYM do potwierdzenia (wyścig paska na `/work/genactiv`).** Nic blokującego.

## BLOKUJĄCE
Brak.

## WAŻNE
**W1. Pasek aktów bywa dostępny z klawiatury na samej górze strony (akt 0) — wyścig, nie zawsze.**
Scenariusz (390, tryb przewijania): przewinąć głęboko w scenę, potem `body.focus()` i Tab ×8 (fokus na „Skip to content”
przewija stronę z y≈8230 na 0). W 2 z 5 prób kolejne Taby po „Contact” weszły w pasek: `BAR:GENACTIV The problem`,
`BAR:Ask about a brand`, dopiero potem treść aktu; w pierwszej próbie pasek został też widoczny i bez `inert` na y=0
(`{"on":true,"inert":false,"cur":"The problem","y":0}`). W pozostałych próbach (także z odstępem 60–250 ms między Tabami
oraz po `scrollTo(0,0)` i klawiszu Home) pasek był poprawnie ukryty i `inert`. Wniosek: nowy `useEffect([act])` naprawia
skok przez `scrollTo`/Home, ale przy skoku wywołanym fokusem zostaje okno, w którym `want=true` (duże przewinięcie w górę)
i stary akt dają `on=true`; `onFocus` ignoruje cele w samym pasku, więc fokus w pasku go nie chowa.
Dowód: logi w tej recenzji (powyżej), zrzuty `r4p11-rev-ga-390-race-*.png`, `r4p11-rev-ga-390-tab5.png`.
Do potwierdzenia przez Leada jednym przebiegiem ×10; poprawka lokalna w `ActBar` (np. `past` liczony z `scrollY`
względem `.ga-track`, a nie z aktu, albo tick w `focusin` także dla celu w pasku).

## DROBNE
**D1. Na 390 w trybie przewijania pasek praktycznie się nie pokazuje** (w scenie blokuje go reguła spec 21 B5, za sceną
od razu `atForm`). Zmiana kolejności DOM jest więc na telefonie bez skutku, a skoków 8/8 nie dało się wywołać z paska
na 390 (0/8 — „bar off” za sceną). To stan sprzed zmiany, nie regresja; w `reduced-motion` na 390 pasek się pokazuje
(`r4p11-rev-ga-390-rm-bar.png`). Warto świadomie zdecydować, czy na telefonie pasek ma w ogóle istnieć.
**D2. CLS przy przewijaniu kółkiem 1440 na `/nawyko` = 0,0037**, źródło `.nk-step is-on` (nie gałka, nie ten diff).
Na 390 = 0,0003 (było 0,0100 wg recenzji 26 — gałka naprawiona). Poniżej progu 0,05, ale nie „< 0,001”.
**D3. Nagłówek FAQ** „FAQ: six answers you need before the first call.” — czytelny w 5 s (2 linie na 390 i 1440,
6 pytań pod spodem zgadza się z „six”). Drobiazg: kicker obok mówi „Questions”, więc „FAQ:” powtarza go; pierwsze dwa
słowa niosą mniej treści niż „Six answers…”. Do bramki tekstów, nie blokuje. `r4p11-rev-faq-390.png`, `-1440.png`.

## Co sprawdzone i przeszło
- **Gałka dnia `/nawyko`** (transform + `cqw`): w 9 (390) i 11 (1440) pozycjach przewijania środek gałki = lewa krawędź
  toru + dzień/30 × szerokość, różnica **0,0 px**; dzień w `aria-valuetext` zgodny z liczbą na telefonie
  (`r4p11-rev-knob-390-m-1.png`: „11 day of 30” i gałka za 11. kratką). Klawiatura (Home, →, →, PageUp, End, ←):
  1→2→3→6→30→29, różnica 0 px; przeciąganie na 20/50/81 % toru: dni 6–7/16/25, różnica 0 px; to samo w
  `reduced-motion` (`r4p11-rev-knob-*-rm-kbd.png`, `-drag.png`). `container-type:inline-size` nie zmienił szerokości toru
  (342,4 px na 390, 560 px na 1440). CLS przewijania 390: 0,0003; reduced-motion: 0.
- **`/work/genactiv` kolejność DOM**: przy widocznym pasku (1440) pierwszy element paska ma indeks 6, pierwszy element
  aktów 8 — pasek przed treścią. Ukryty pasek ma `inert` (start, po `scrollTo(0,0)`, po Home — 1440 i 390).
- **Skoki do rozdziałów 1440: 8/8** w trybie przewijania i 8/8 w `reduced-motion` (fokus na sekcji aktu).
- **`key` na tekstach**: monitor co klatkę (≈960–1570 klatek na przebieg): nigdy więcej niż jeden `figcaption` ani
  więcej niż jedna liczba w pierścieniu na ekran — brak podwójnego tekstu; zrzuty klatek bez migania
  (`r4p11-rev-ga-{390,1440}-scroll-0..4.png`). CLS przewijania 0,0000 (390 i 1440).
- **Treść**: zero prawdziwych marek w tekście `/nawyko` (marka demo „Tovemi”); w diffie nie doszła żadna liczba.
  Kiczu brak — zmiany są niewidoczne poza nagłówkiem FAQ.
