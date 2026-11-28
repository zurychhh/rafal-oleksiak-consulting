# Spec 53 — PILNE TERAZ 2 (Rafał 28.11.2026 11:33): /nawyko

## Pkt 1 — „Reveal without scratching” po zmianie marki (BŁĄD)
Przyczyny (odtworzone w Chromium i WebKit, test `reveal-after-brand` na starym buildzie: 16 × FAIL):
- karta dnia w hero i w finale raz odsłonięta (samozdrapka w hero po 3,2 s, przewinięcie finału do chwili ≥ 3,
  kliknięcie) zostawała odsłonięta na zawsze; po zmianie nazwy/koloru/stylu przycisk był `aria-disabled` i nic nie robił;
- pędzel zdrapki dziedziczył `strokeStyle` prążków folii (alfa .16): na karcie w kolorze marki przeciąganie zdejmowało
  tylko 16 % folii, karta nigdy nie zaliczała się jako zdrapana (próg 42 % przezroczystych pikseli).
Poprawka: zmiana marki (nazwa, kolor, styl) = nowa karta: `done`/`scratched` wraca do false (zmiana stanu w renderze,
`useBrandChanged`), płótno maluje się od nowa z nową folią, bez ponownej samozdrapki w hero; finał odsłania kartę sam
tylko przy zmianie chwili; pędzel z pełnym kryciem.
Kryteria: `node scripts/reveal-after-brand.mjs` i `xvfb-run -a python3 -I scripts/reveal-after-brand-webkit.py` = PASS
(390 i 1440, hero i finał: reveal0, rearm1, drag1, reveal1, rearm2 po samej nazwie, reveal2); kontrola pozytywna na
buildzie sprzed poprawki = FAIL. Oba w `gates.sh` na stałe przy `/nawyko`.

## Pkt 3 — przerywniki rozdziałów (zrobione w przebiegu 11:38)
Osiem przerywników `Interlude` (`NK_CHAPTERS` w `content.ts`) przed każdą sekcją widoczną w trybie przewijania:
01 Start here (formularz pod hero) · 02 How it works · 03 Rewards · 04 Your side · 05 Store engine · 06 FAQ · 07 One morning ·
08 Next step. Każdy: „NN / 08” i podziałka rozdziałów w kolorze marki, nazwa (ta sama w pasku rozdziałów — pasek bierze
`NK_CHAPTERS` bez „Next step”, bo prowadzi tam przycisk paska), „Why now” + jedno zdanie z nazwą marki odwiedzającego.
Wejście przez CSS scroll-driven (`view()`) tylko przy wsparciu i bez ograniczenia ruchu. Kolejność sekcji bez zmian;
dało się ją wytłumaczyć, więc bez propozycji nowej kolejności. Oś nagród („Every reward is listed from day one.”) w trybie
statycznym należy do rozdziału 02 (w trybie przewijania to akt sceny).
Teksty: copy-voice OK, czytelnik-kupujący (8 × FIX w pierwszej wersji → przepisane według jego zastrzeżeń: kolejność
tłumaczona w każdym zdaniu, bez absolutów „whatever it runs on”, „Why here” → „Why now”), wpis w teksty-do-akceptacji.

## Pkt 2 — przypięte sceny (NASTĘPNY PRZEBIEG; termin Rafała 13:40 dla dwóch sekcji)
Wzór techniczny: `cockpit-scroll.css` + `[data-pin]` ustawiany JS-em (warunek jak `CK_PIN_Q` + brak `navigator.webdriver`),
rezerwa wysokości przed hydratacją jak `PIN_JS` (inaczej CLS przy wejściu z kotwicą).
A. **„Cashback grows with every {marka} order.”** (`Loyalty`, `#loyalty`, trzy kafle bento: Cashback wallet → Points and
   levels → You set what each point is worth). Tor = 3 × 60svh + ekran; w środku `position: sticky; top: 0`, wysokość
   ekran minus `--consent-h`. Krok k odsłania kafel k (kumulatywnie: na końcu widać całe bento, nic nie znika — Z-05),
   licznik „1 of 3” + podziałka jak `.nk-ck-prog`, nazwy kroków jako przyciski-skróty (klik = `scrollTo` środka odcinka,
   jak `go()` w finale). Telefon 390: przypięty jeden kafel naraz (bieżący) z podpisem i licznikiem, bez ucięć na 390×844
   i 360×740 z paskiem cookies; jeśli kafel nie mieści się — bez przypięcia (jak niskie okno). Bez przypięcia: reduced-motion,
   wysokość < 600 px, webdriver, bez JS — dzisiejsze bento 1:1.
B. **„Any store engine: pick yours, from Shopify to a custom build.”** (`Evidence` → `StoreMap`): kroki = silniki z listy
   (wybór silnika przewijaniem, klik pigułki = skrót) i na końcu schemat sklep ↔ adapter ↔ aplikacja; te same warunki.
Bramki na każdej scenie: `sticky-fixed`, CLS 390/1440, clsscroll, `scroll-perf` ≤ 100 ms, WebKit 390/1440, `reflow`,
`short-viewport`, `section-inventory` (nic nie znika), `reveal-after-brand`, `brand-propagation`, recenzent niezależny.
Zasada z nauki (The Pudding „Scrollytelling: sticky”, https://pudding.cool/process/scrollytelling-sticky/): podpisy kroków
to prawdziwe bloki tekstu w przepływie dokumentu, które przewijają się obok przypiętej grafiki (`position: sticky`), a nie
treść podmieniana skryptem — czytnik ekranu i klawiatura dostają wszystkie kroki po kolei, bez JS widać wszystko, a krok
aktywny wyznacza położenie podpisu (IntersectionObserver / `getBoundingClientRect`), nie przechwytywanie przewijania.
