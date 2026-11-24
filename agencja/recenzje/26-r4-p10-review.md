# Recenzja 26 — R4 p10: pasek rozdziałów /nawyko (A) i pasek aktów /work/genactiv (B)

Recenzent niezależny, 2026-11-24. Zakres: `git diff 6f2f524..HEAD -- app/` (commity 976e168, c1777fa). Spec 21.
Metoda: Playwright Chromium, `navigator.webdriver` nadpisane na false + `--disable-blink-features=AutomationControlled`
(scena przypięta aktywna, `ga1440-mode.scroll=true`, `ga390-mode.scroll=true`), zgoda cookies przyjęta, przewijanie
kółkiem (4×450 px w dół, 2×120 px w górę) × 12–14 kroków, 1440×900 i 390×844, wariant reduced motion 390.
Zrzuty: `agencja/podglad/r4p10-rev-*.png`. Skrypty pomiarowe w scratchpadzie, nie w repo.

## Werdykt
B na desktopie działa dobrze i spełnia spec: 8/8 skoków trafia we właściwy akt, fokus i Escape poprawne, kontrast z zapasem.
Dwie rzeczy do poprawy przed scaleniem: na telefonie pasek /work/genactiv w praktyce nigdy się nie pokazuje (problem
ze speca zostaje nierozwiązany dla telefonów), a na /nawyko 390 etykieta aktu zostaje po wyjściu ze sceny i łamie pasek na dwa rzędy.

## BLOCKING
Brak.

## IMPORTANT

### I1. /work/genactiv 390: pasek się nie pojawia w ogóle (tryb przewijania)
Dowód: `ga390-scroll`, 12 kroków w dół i w górę po całej trasie — `data-on=false`, `inert=true` w każdym kroku
(zrzuty `r4p10-rev-ga-390-k00…k11.png`). Przyczyna w kodzie: w scenie `< 1100 px` `blocked = inScene && narrow`,
a cała trasa poza Final to scena; w Final formularz jest na ekranie (`atForm`). Pasek działa na telefonie tylko
w układzie statycznym (reduced motion: `gaRm.on=true`, zrzuty `ga-390-rm*.png`). Spec B5 pozwala ukryć pasek w scenie,
ale wtedy problem ze speca („z połowy, np. Cashback, do zapytania kilka ekranów, bez drogi do aktu”) zostaje
dla większości odwiedzających na telefonie.
Poprawka (wykonanie w zakresie speca, ale zmienia zachowanie B5 — do decyzji Leada): w scenie < 1100 px pokazywać
wariant przy dolnej krawędzi (`top:auto; bottom:calc(var(--consent-h,0px) + 12px)`, jedna pigułka „Ask about an app”
+ przycisk listy otwierającej się w górę) — górne 18 px ekranu telefonu i nazwa marki zostają odsłonięte (lekcja R16).
Sprawdzić zrzutem każdego aktu, że pigułka nie zasłania podpisu „Example screen…” pod telefonem.

### I2. /nawyko 390: nieaktualna etykieta aktu po wyjściu ze sceny, pasek w dwóch rzędach (81 px)
Dowód: `nk390after` — scena już nie przypięta, pasek pokazuje „HOW IT WORKS · 07 YOUR BRANDING”, wysokość 81 px
zamiast 53 px, CTA „Ask about Nawyko” spada do drugiego rzędu i przykrywa górę ekranu telefonu
(`r4p10-rev-nk-390-after-scene.png`; też `nk390` k7: `h=81`). Na 1440 tego nie ma (poza sceną pokazuje się rząd linków).
Przyczyna: `a` liczone, gdy `secs[k] === scene && is-scroll`, bez warunku `pin`; D2 w specu dotyczy sceny przypiętej.
Poprawka: liczyć akt tylko przy `pin` (`if (pin && scene && …)`), a etykietę przycisku zabezpieczyć przed łamaniem
(`.nk .cb-toggle{min-width:0;flex:0 1 auto}` + `white-space:nowrap;overflow:hidden;text-overflow:ellipsis` na etykiecie),
tak jak zrobiono w `.ga-ab-cur`. Kryterium: wysokość paska = 53 px na 390 w każdym kroku.

## MINOR

### M1. /work/genactiv: CTA paska nie przenosi fokusu do formularza
Dowód: po kliknięciu „Ask about an app” w akcie 5 (1440) `#enquiry` jest na 116 px, ale `document.activeElement = BODY`
(`r4p10-rev-ga-1440-cta.png`). Skoki do rozdziałów przenoszą fokus (D4/B6), CTA nie — czytnik ekranu nie ogłasza celu.
Poprawka: w `onClick` CTA po `hide()` `requestAnimationFrame(() => document.getElementById('enquiry')?.focus({preventScroll:true}))`
z `tabIndex=-1` i tą samą regułą `:focus:not(:focus-visible){outline:none}`.

### M2. /work/genactiv: pasek jest ostatni w DOM
Dowód: Tab z CTA paska idzie do „Home”, „Tools” (`tabSeq`), a z treści strony do paska dochodzi się dopiero po całej
stronie, choć pasek wizualnie stoi na górze. Wymóg „przycisk → lista → CTA” jest spełniony.
Poprawka: renderować `{bar}` przed `.ga-track` / `.ga-still` (pozycja `fixed` nie zmienia układu, CLS bez zmian).

### M3. CLS nie jest równe 0
Zmierzone przy przewijaniu kółkiem: ga1440 0,0008; ga390 0,0030; nk1440 0,0034; nk390 0,0100. Wszystko daleko pod
progiem 0,05 bramki, ale spec mówi „CLS 0”. Nie przypisałem źródła do paska (pasek jest `fixed` + `transform`).
Poprawka: `node scripts/cls-check.mjs` ze źródłami przesunięć dla obu tras; jeśli źródło to scena, odnotować jako stan sprzed p10.

## Sprawdzone, bez uwag
- **Skoki /work/genactiv 1440, 8/8 poprawne:** The problem→ga-t1, How it works→ga-t2 („Step 1 · Proof of purchase”),
  Cashback→ga-t5, Points and levels→ga-t6, Consent→ga-t7, How it was built→ga-t8, Results→ga-t9, Your brand→ga-t10;
  w każdym widoczny jeden właściwy akt, fokus na `.ga-copy-in` danego aktu (top 135 px, pod paskiem, pasek schowany),
  etykieta paska zgodna (`r4p10-rev-ga-1440-jump0…7.png`). Skok z klawiatury (Enter na „07 Results”) → fokus ga-t9.
- **Klawiatura:** Tab przycisk → 8 linków → CTA; Escape zamyka listę (`aria-expanded=false`) i oddaje fokus przyciskowi.
  `inert` przy ukryciu potwierdzony w każdym kroku.
- **Reduced motion:** `transition-duration: 0s`, układ statyczny, skok do Cashback → fokus `section.ga-act-5` na 88 px (pod 53 px paska).
- **Kontrast** (zmierzony z kolorów obliczonych): GENACTIV #ff8a91 na #1d1517 7,93:1; CTA #0e0b0c na #ff8a91 8,67:1;
  linki #c9bfc1 na #1d1517 9,99:1; biały 17,9:1; /nawyko numer bieżący #9E161F na #F7F5F0 7,45:1 (D5 spełnione, było 4,70:1).
- **/nawyko 1440 w scenie (D1, D2):** jeden rząd „NAWYKO · HOW IT WORKS · 04 REWARD” + CTA, akt zgodny z nawigacją sceny
  w krokach 0–8 (`r4p10-rev-nk-1440-k04.png`); poza sceną rząd 7 linków. Nie zasłania nagłówków ani ekranu telefonu.
- **/nawyko D4:** skok „Privacy” → fokus `#privacy`, bez obrysu przy kliknięciu myszą.
- **Oko właściciela marki:** pasek GA w palecie realizacji, spokojny, bez kiczu; oferta czytelna w sekundę („Ask about an app”
  na pigułce). Żadnych nowych liczb ani tekstów o GENACTIV poza nazwą w kickerze paska (nazwa strony, nie twierdzenie).
  W części aplikacji /nawyko tylko zmyślona marka Tovemi z podpisem „made-up demo brand”.
