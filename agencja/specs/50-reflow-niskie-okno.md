# Spec 50 — R6' p16: finał `/nawyko` w niskim oknie, telefony ≥ 150 px, `/work/genactiv` 320, `reflow` w `gates.sh`

Źródło: R6'-N15 pkt 1–5 (wynik bazowy bramki `reflow-check` ze specu 49). WCAG 2.2 SC 1.4.10 Reflow: treść ma działać
w oknie 320 CSS px szerokości i w oknie 256 CSS px wysokości bez przewijania w dwóch kierunkach; 640×360 = 200 % z 1280×720.

## Zmiany
1. **Finał „One morning with …” przy wysokości okna < 600 px** (ten sam próg co `PIN_JS` w `page.tsx`): sekcja nie jest
   przypięta (`height:auto`, `.nk-fz-stick` `position:relative`), telefon ma stałą wysokość; kropki ustawiają chwilę
   (`setAt`) zamiast przewijać (`FZ_LOW` w `Finale`), odczyt przewijania jest wyłączony. Przy szerokości ≥ 560 px telefon
   stoi obok tekstu i mieści się w oknie (`--hh: min(500px, max(320px, 100vh − 32px))`), więc klik kropki zmienia tekst
   i ekran naraz. Powyżej 600 px wysokości nic się nie zmienia (media query). Treść, kolejność i teksty bez zmian.
2. Telefon sceny „Four steps” w trybie statycznym ≤ 860 px: minimum 300 → 320 px wysokości (145 → 155 px szerokości).
3. `/work/genactiv` ≤ 359 px: rząd kolorów zawija się, „Any colour” nie wychodzi poza okno (było do 356 px na 320).
4. Link „Reveal without scratching” zawinięty na ≤ 380 px: podkreślenie pod każdą linią (`text-decoration`), nie pod polem.
5. `reflow-check.mjs` wypisuje `REFLOW PASS/FAIL` i jest stałą bramką każdej trasy w `gates.sh`.

## Kryteria
- `reflow-check /nawyko /work/genactiv`: PASS na 320×568 i 640×360 (kontrola pozytywna = wynik bazowy specu 49 na
  poprzednim buildzie: telefon finału 26 px, `.nk-phone` 145 px, „Any colour” do 356 px).
- 390×844 i 1440×900: finał przypięty jak wcześniej (`sticky-fixed`, CLS, zrzuty); `gates-bg.sh /nawyko /work/genactiv` PASS;
  WebKit 390/1440 PASS; inwentarz sekcji bez zmian; bez nowych tekstów (bramka tekstów nie dotyczy).
- Recenzja niezależna na zrzutach 640×360, 844×390, 320×568, 390×844, 1440×900.

## Wynik
`reflow-check` PASS na `/nawyko` i `/work/genactiv` (przed: telefon finału 26 px, `.nk-phone` 145 px, „Any colour” do 356 px);
telefon finału 159 px (640×360), 173 px (844×390), 242 px (320×568). Recenzja 56: PASS 6/6; drobne a) (start od chwili 3)
poprawione w tym przebiegu — w niskim oknie finał startuje od chwili 1. Przy okazji: kontrast liczby serii (4,26 → ≥ 4,5:1,
`--hi` liczone wobec kafla #1B1D21) i pigułki „Use in the … store” (4,40 → 5,05:1). `gates-bg.sh /nawyko /work/genactiv` PASS.
