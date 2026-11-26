# Recenzja 50 — R6' p8 (spec 42): pasek rozdziałów × finał, bramka `sticky-fixed`, `css-dropped`

Recenzent niezależny, 26.11.2026. Build na localhost:3000, Chromium (Playwright), `navigator.webdriver=false`,
`cookie-consent=declined`. Skrypty: scratchpad sesji (`fin.cjs`, `end.cjs`, `ck.cjs`, `kb.cjs`, kopia bramki `g/sfc.mjs`
z licznikiem celów i kontrolą pozytywną). Zrzuty: `/tmp/rev50/`.

## Werdykt: FAIL (2 istotne, oba wąskie — poprawka bez zmiany zakresu)

Główna poprawka działa: w przypiętym finale na 390×844 pasek po ruchu w górę już nie wjeżdża (9/9 kroków `on=false`,
nagłówek „One morning with Tovemi” 25–43 px odsłonięty — `/tmp/rev50/390x844-fin2.png`). Na 1440×900 i 1280×720 pasek
w finale wraca normalnie i niczego nie zasłania (nagłówek finału 254 / 174 px — `/tmp/rev50/1440x900-fin2.png`); na 1280
przy końcu toru nagłówek wchodzi w pas 0–96 i pasek ustępuje (fin8). Przed finałem pasek wraca (`*-before.png`), przy
formularzu znika (`atForm`) — bez zmian. Kokpit (1440/1280: `on=false` na całym torze i w strefie końca; 1280 po wyjściu
zakładek z pasa `on=true`) i „Four steps” (1440/1280: kompaktowy pasek z aktem, `/tmp/rev50/1440x900-nk-scene-2.png`;
390: ustępuje w scenie) — bez regresji. Zostają dwie dziury tej samej klasy co I1 z recenzji 49.

## ISTOTNE

**I1. Telefon 390×844, koniec toru finału: pasek wraca na nagłówek bieżącego momentu finału.**
Warunek śledzi tylko `.nk-fz-lab` (17 px wysokości, 25 px od góry). Gdy scena zaczyna odjeżdżać, etykieta wychodzi
z ekranu już po ~45 px, a duży nagłówek momentu `.nk-fz-h` („…Tovemi.”) leży jeszcze w pasie 0–96. Pomiar (`end.cjs`,
wejście za koniec toru, potem 120 px w górę): przesunięcie sceny −60 → pasek `on`, nagłówek 18–74 px (pasek 0–53);
−80 → nagłówek −2–54; zasłonięty do ~−120. Zrzut: `/tmp/rev50/390x844-endtrack-60.png` (widać ucięte „Tovemi.” pod
paskiem). To dokładnie przypadek „scena odjeżdża, pasek wraca na jej nagłówek” z rec. 49 I1, który dla kokpitu uznano
za istotny. Bramka tego nie widzi, bo sprawdza tylko kroki z przypiętą sceną (`coverFn`: `stuck:false` → pomijane,
`scripts/sticky-fixed-check.mjs:31`). Poprawka: w `ChapterBar.tsx:114` zamiast samego `.nk-fz-lab` śledzić
`.nk-fz-copy` (albo `.nk-fz-lab` + `.nk-fz-list li.is-on .nk-fz-h`); w bramce dodać przypadek strefy końca toru
(jak `endzone` w `cockpit-pin`).

**I2. Bramka daje fałszywy PASS na scenie bez celów — „Four steps” na 390 nie jest w ogóle testowana.**
`coverFn` pomija tekst w `[aria-hidden="true"]` i `.nk-phone` (`sticky-fixed-check.mjs:39`). Na 390×844 scena
`nk-stage` jest przypięta w 20 krokach, ale ma **0 celów** w pasie w każdym kroku (`/tmp/rev50/sfc-run.txt`, linie
`nk-stage … tgt 0 []`) — wynik „ok”. Kontrola pozytywna (wstrzyknięty `position:fixed` 50 px z tekstem u góry,
`/tmp/rev50/sfc-inj.txt`): finał FAIL 9/9, a `nk-stage[przypieta w 20 krokach]:ok`. Czyli regresja W2 z R4 p9
(pasek na nazwie marki w telefonie sceny na telefonie — powód warunku `inScene`) przeszłaby tę bramkę. Komentarz
„ekran makiety telefonu ma własną bramkę” nie znajduje pokrycia: żaden skrypt z `gates.sh` nie sprawdza `.cb` ×
`.nk-phone` (`cockpit-pin` sprawdza tylko szerokość telefonów i nakładanie się elementów panelu). Poprawka: liczyć też
widoczny tekst makiety (aria-hidden to dekoracja dla czytnika, nie dla oka) albo przynajmniej FAIL/„NIETESTOWANE”, gdy
przypięta scena ma 0 celów; to samo, gdy `stuckSeen=0` lub `sceny=0` na trasie, o której wiadomo, że ma sceny
(dziś `sceny=0` = PASS, np. gdy podmiana `navigator.webdriver` przestanie działać).

## DROBNE

- D1. Pamięć węzłów (`ChapterBar.tsx:113–115`) odświeża się tylko, gdy lista jest pusta albo któryś węzeł odpięty —
  węzeł dodany później (np. warunkowo renderowane zakładki) nie zostanie złapany, dopóki stare są podpięte. Dziś
  wszystkie trzy istnieją od montażu, więc bez skutku. Gdy lista jest pusta, `querySelectorAll` leci w każdej klatce
  (tylko inne trasy — ChapterBar jest dziś tylko na `/nawyko`).
- D2. Zmienna `inCockpit` obejmuje teraz też finał — nazwa myląca (np. `yieldTop`).
- D3. Bramka nie uwzględnia `z-index`: element `fixed` pod sceną liczyłby się jako przykrycie (możliwy fałszywy FAIL;
  dziś nie występuje — 390/1280 PASS, `/tmp/rev50/sfc-run.txt`).
- D4. Na telefonie pasek z CTA „Ask about Nawyko” jest niedostępny przez cały finał (~4200 px, 5 ekranów). Formularz
  stoi bezpośrednio za finałem, Tab z finału przechodzi prosto do pól formularza — nawigacja nie jest zepsuta; tylko
  odnotowuję.

## Sprawdzone bez uwag

- Klawiatura / WCAG 2.4.11 (`kb.cjs`, 390 i 1440, z i bez `prefers-reduced-motion`): Tab przez 5 kropek finału,
  „Reveal without scratching” i dalej do pól formularza — fokus nigdy pod paskiem (`covered:false` we wszystkich 40 krokach).
- `prefers-reduced-motion: reduce`: finał nadal sticky, zachowanie paska identyczne; przejścia paska wyłączone (CSS bez zmian).
- Przesunięcia układu podczas przewijania z ruchem w górę: CLS 0,0027 / 0,0044 / 0,00002 (1440 / 1280 / 390) — pasek
  na `transform`, zmiana go nie dotyka.
- Brak nowej treści widocznej dla odwiedzającego (diff to wyłącznie logika JS + skrypty).
- Klucz zgody w bramce (`cookie-consent`=`declined`) zgodny z `app/components/ui/CookieConsent.tsx:149`.
- `css-dropped` (a1797c8): `depth` rośnie tylko przy podstawieniu definicji, a rekurencja „reszty” usuwa wszystkie
  wystąpienia danego `var()`, więc kończy się zawsze. Deduplikacja identycznych `var()` (ta sama nazwa i zapas) jest
  semantycznie poprawna — w CSS ta sama zmienna na tym samym elemencie ma jedną wartość — i zawęża, a nie poszerza zbiór
  „poprawnych” wariantów. Placeholder `1` poszerza akceptację, ale ścieżka `var()` i tak daje najwyżej INFO, nigdy FAIL,
  więc nie może ukryć FAIL. Samotest: PASS (var6, varrep, dup); pełny przebieg `fail=0 info=9`.
