# Recenzja 31 — R4 przebieg 15 (spec 26), niezależna

Zakres: `git diff 100d87e..HEAD -- app scripts` (commity 2821014, 8e2624a, scal fa5f24f). Serwer: http://localhost:3000 (nowy build).
Narzędzia: Playwright Chromium z `navigator.webdriver=false` (jak `cls-check.mjs`), skrypty recenzenta w scratchpadzie (nie w repo).
Płynności nie mierzyłem (równolegle chodziły bramki). Kodu nie zmieniałem.

**Werdykt: jedna rzecz blokująca (tryb zwarty włącza się teraz także BEZ paska cookies na 360×740 i chowa treść), reszta działa.**

## BLOKUJĄCE

**B1. Tryb zwarty sceny włącza się bez paska cookies na oknach 721–756 px wysokości (np. 360×740) i chowa treść, która przedtem była widoczna.**
- Przyczyna: `@container nk-stage (max-height:720px)` mierzy *pole treści* `.nk-stage`, a scena ma `padding: 18px 0 18px`. Na 360×740 bez paska: scena 740 px, pole treści 704 px, więc zapytanie się spełnia. Komentarz w CSS („bez paska próg jest ten sam co dotąd (720/721 px)”) jest nieprawdziwy: rzeczywisty próg to 756/757 px wysokości okna.
- Dowód (pomiar, cookies zaakceptowane, bez paska): 360×740 → `.nk-v3 .nk-rw` `display:none`, telefon 318 px (= 43svh) zamiast 370 px (50svh, dawna reguła). Na 390×760 i wyższych tryb zwarty się nie włącza (`.nk-rw` block).
- Zrzuty: `agencja/podglad/r4p15-rev-360n-80.png`, `r4p15-rev-360n-97.png`: brak zdania „Your curve comes from your own orders. Check your gap for free.”, brak „Type a brand name, pick a style…”, „The name stays in this page. Nothing is sent.”, brak listy nagród w telefonie (Free shipping / Stamp / Next-pack / Cashback). Dla porównania 390×844 bez paska (`r4p15-rev-390n-80.png`, `-97.png`) ma wszystko.
- Spec 26 wprost zabrania chowania treści, a A1 wymaga, żeby widoki bez paska się nie zmieniały. 360×740 to częsty Android.
- Do tego z paskiem 360×740 (`r4p15-rev-360c-*.png`) też chowa te same treści. Przedtem były widoczne, ale ucięte. Zamiana „ucięte” na „schowane” to zmiana zakresu, więc decyzja Rafała, nie budującego.
- Proponowana poprawka (do decyzji Leada): próg zapytania kontenera liczyć z pola treści, czyli `max-height:684px` (720 − 36), albo zdjąć padding z kontenera. Wtedy bez paska zostaje dawne 720/721. Dla przypadku z paskiem trzeba osobno zdecydować, czy chowanie jest dopuszczalne.

## WAŻNE

**W1. Bramka `short-<w>c` daje SKIP, gdy scena zniknie przez regresję.** Kod 2 z komunikatem „brak przypietej sceny (uklad statyczny?)” wypisuje `short-viewport-check.mjs` także wtedy, gdy strona spadnie do układu statycznego (np. zepsuta detekcja, brak `.is-scroll`). Na `/nawyko` i `/work/genactiv`, gdzie scena *musi* być, taka regresja przejdzie jako SKIP. Jak naprawić: lista tras z obowiązkową sceną, na których SKIP zamienia się w FAIL, albo osobna bramka „scena obecna”. Reszta logiki jest poprawna (niżej).

## DROBNE

**D1. Tab na kroku 01 przy 1440×900 nie przewija sceny.** Krok 01 jest już aktywny (`i === step` → wyjście), więc fokus stoi na przycisku przy y=637, gdy scena nie jest jeszcze przypięta. Telefon jest ucięty dolną krawędzią okna (`r4p15-rev-tab-1440-01.png`). Obrys widoczny i niezasłonięty (750–876 px na 900). Klik myszą w 01 przewija do y=1989 (scena przypięta), więc Tab i klik kończą w różnych miejscach. Do rozważenia: przy pierwszym fokusie z klawiatury przewinąć do `actTop(0)`, jeśli scena nie jest przypięta.

**D2. Węższy odstęp liter dotyczy wszystkich 11 etykiet `.nk-lab` ze `.nk-labrest` na stronie, nie tylko sceny.** Przy 1100 px: 1,59 px zamiast 1,92/2,4 px. Przy 1040 px: 1,03 px (ok. 0,09 em przy 12 px, nadal czytelne). Wizualnie spójne, ale przy 1100 px etykiety „who” i „rest” mają teraz ten sam odstęp, a na 1280+ różny (1,92 / 2,4). Bez wpływu na odbiór, tylko odnotowuję.

**D3. Akceptacja cookies w środku sceny na telefonie zmienia rozmiar telefonu** (390: 383 → 422 px), a na 360×740 może przełączyć tryb zwarty. To następuje po kliknięciu, więc CLS tego nie liczy (hadRecentInput). Widoczny skok, ale jednorazowy i wywołany przez użytkownika.

## Co sprawdziłem i działa

1. **/nawyko z paskiem cookies, 390×844 i 360×740**, 5 pozycji sceny (5/30/55/80/97 %): nic nie wystaje pod pasek ani poza scenę (0 elementów przeciętych dolną krawędzią sceny/paska w każdej pozycji). Link „Ask how your brand gets its own app” w całości nad paskiem (390: `r4p15-rev-390c-97.png`). Scena ma 766 px (844 − 78), telefon 383 px. Etykiety („FOR YOUR CUSTOMER”, „FOR YOU”, „UNDER YOUR BRAND”) stoją przy swoim tekście, wiadomo, do czego należą. CLS przy przewijaniu: 0,0006 (390c), 0 (360c). Zrzuty `r4p15-rev-390c-{5,30,55,80,97}.png`, `r4p15-rev-360c-{5,30,55,80,97}.png`.
   **Bez paska 390×844**: telefon 422 px (jak przed: clamp(300px,50svh,500px)), treść pełna (`r4p15-rev-390n-*.png`). **1440×900**: telefon 700 px, CLS 0,002, bez zmian w wyglądzie (`r4p15-rev-1440n-*.png`).
2. **Tab po krokach 01–04** (1440×900 i 1100×620): po Tab na krok N scena przewija się płynnie i zatrzymuje (1440: 2 → y 3346, 3 → 6489, 4 → 8040; 1100: 2479 / 4644 / 5713). Seria scrollY co 150 ms stabilizuje się po ok. 0,6–0,9 s, bez skakania i bez pętli. `data-act`, `aria-current`, `li.is-on`, opis i telefon pokazują krok N (`r4p15-rev-tab-1100-02.png`, `r4p15-rev-tab-1100-04.png`, `r4p15-rev-tab-1440-04.png`). Obrys `2px solid`, offset 3 px, `:focus-visible`, niezasłonięty (elementFromPoint). Shift+Tab z 04 wraca na 03 (y 6489 / 4644). Klik myszą 01 i 03 działa jak dawniej (bez obrysu, ta sama pozycja dla 03). Przy `prefers-reduced-motion: reduce` scena jest statyczna (bez `.is-scroll`, przewijanie się nie rusza, y=1103), a krok zmienia się przez fokus/klik w trybie ręcznym. Skrypt budującego `nawyko-step-focus-check.mjs` daje PASS na 1440×900 i 1100×620.
3. **1100×620 etykiety**: „FOR YOUR CUSTOMER” i „HOW IT WORKS · MADE-UP BRAND” w jednym wierszu we wszystkich 11 etykietach. `scrollWidth − clientWidth = 0`, prawa krawędź tekstu ≤ kolumna (np. 495 ≤ 523). Przy 1280 i 1440 odstęp bez zmian (1,92/2,4 px). Zrzut `r4p15-rev-tab-1100-02.png`.
4. **/calculator suwak**: Home/End z klawiatury (`:focus-visible`), obrys 2 px w całości widoczny w obu skrajnych położeniach, ok. 4 px przerwy do kciuka, na 390 i 1440 (`r4p15-rev-slider-{390,1440}-{Home,End}.png`). Przeciąganie myszą od środka do 0 %, 50 % i 100 % daje 29 / 44 / 58. Klik 2 px od lewej i prawej krawędzi daje 29 i 58, więc pełny zakres jest osiągalny mimo paddingu 6 px. Tor optycznie krótszy o 6 px z każdej strony, podpisy „29 days” / „58 days · today” nadal pod końcami. Bez widocznej szkody.
5. **gates.sh `short-*`**: pętla 1100×620 / 1280×720 / 390×844 z `--cookies`, logi do `$LOGDIR/<slug>-short-<w>c.log`, `timeout`. `shortvp_verdict`:
   - PASS tylko przy kodzie 0 **i** linii `SVC PASS` (kod 0 bez linii daje FAIL);
   - SKIP tylko przy kodzie 2 **i** komunikacie „brak przypietej sceny” (inny kod 2, np. zły URL, daje FAIL);
   - 124 daje FAIL z limitem czasu;
   - 1 z linią SVC daje FAIL z liczbą problemów i pierwszym `FAIL`;
   - wszystko inne daje FAIL.

   `add` liczy do `ANYFAIL` tylko FAIL, SKIP nie blokuje. Werdykt to ta sama funkcja w `gates.sh` i w selftescie. `set -- $vp` nie psuje tras, bo są w `ROUTES`. Selftest uruchomiony (port 3199): cut = FAIL (69 problemów, link ucięty o 66 px), ok = PASS, noscene = SKIP, `SHORTVP-SELFTEST: PASS`, kod 0. Uwaga: selftest sprawdza tylko funkcję werdyktu, nie samą pętlę w `gates.sh` (wystarczające). Zastrzeżenie w W1.
6. **Nowe teksty**: w diffie `app/` brak zmian tekstów widocznych dla odwiedzającego (tylko CSS, `onFocus` i komentarze).
