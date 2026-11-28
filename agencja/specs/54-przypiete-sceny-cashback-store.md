# Spec 54 — PILNE TERAZ 2 pkt 2: przypięte sceny „Cashback…” i „Any store engine…” (/nawyko)

Źródło: Rafał 28.11.2026 11:33 (PILNE TERAZ 2 pkt 2), plan w spec 53 pkt 2. Termin dwóch sekcji: 13:40.

## Co
- Wspólny mechanizm `app/nawyko/step-pin.ts` (`useStepPin(n, ids)`) + `step-pin.css`: sekcja = tor (n odcinków + ekran),
  w środku `position: sticky; top: 0`, wysokość ekran minus `--consent-h`. Krok = położenie toru (zwykłe przewijanie, bez
  przechwytywania kółka, bez scroll-snap). Klik kroku = `scrollTo` w głąb odcinka. Próg jak kokpit: ≥ 900 × 600 i bez
  `prefers-reduced-motion`; układ przypięty od pierwszej klatki przez `[data-nk-pin]` (PIN_JS) — tor ma docelową wysokość
  przed hydratacją. Za wysoka scena (pasek cookies, niskie okno) → `zoom` treści do 0,72, liczony dopiero, gdy scena jest
  w promieniu 1,5 ekranu (pomiar = wymuszony układ).
- A `#loyalty` „Cashback grows with every {marka} order.”: trzy kafle obok siebie, krok k odsłania kafel k (kumulatywnie,
  na końcu całe bento — Z-05), licznik „1 of 3”, przyciski-skróty „Cashback wallet · Points and levels · Your points rate”,
  podziałka postępu. Kotwice `#cashback`, `#levels`, `#exchange` (menu strony) przewijają do kroku kafla (recenzja 60 I1).
  Fokus z klawiatury na nieodsłoniętym kaflu przewija do jego kroku.
- B `#integrations` „Any store engine…”: krok = silnik (7), schemat sklep ↔ adapter ↔ aplikacja zmienia się z krokiem,
  licznik „1 of 7” + podziałka; pigułka = skrót; w przypiętej scenie pigułki mają `aria-current="step"` zamiast
  `aria-pressed` (stan zmienia przewijanie, nie użytkownik — recenzja 60 I3, MDN aria-current).
- Pasek rozdziałów ustępuje przypiętym scenom jak kokpitowi (`.nk-sp .nk-sp-pin` w ChapterBar).

## Poza zakresem (świadomie)
- Telefon 390 i < 900 px: bez przypięcia — kafel „Points and levels” 536 px + nagłówek nie mieszczą się z paskiem cookies
  (pomiar 390×844 i 360×740); spec 53 to dopuszcza. Propozycja wersji telefonowej w „Czeka na Rafała”.
- Pozostałe sekcje z listą opcji — kolejny przebieg (termin Rafała dotyczył dwóch nazwanych).

## Kryteria / bramki
`node scripts/step-pin-check.mjs <url>` (nowa, stała w `gates.sh`): przypięcie zgodne z progiem, licznik z przewijania
w każdym kroku, scena nie wystaje nad pasek cookies, wejście kotwicą na kafel = kafel odsłonięty, ostatni krok = całe
bento, poniżej progu wszystko widoczne. Oraz `gates.sh /nawyko` (sticky-fixed, CLS, clsscroll, scroll-perf, WebKit
390/1440, reveal-after-brand, brand-propagation, inventory, copy-voice, content-rules), recenzent niezależny (recenzja 60),
czytelnik-kupujący (2 × FIX → poprawione).
