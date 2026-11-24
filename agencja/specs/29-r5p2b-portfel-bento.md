# Spec 29 — R5 p2 część 2: portfel jako bento w atramencie (24.11.2026 17:38–18:40)

**Problem (Rafał, uwaga 2 ze specu 26):** od „Cashback” w dół sześć sekcji w tym samym układzie „tekst + telefon obok”, jasne, podobne do siebie ekrany.
**Zakres tego przebiegu:** pierwsze trzy z nich (Cashback, Points and levels, Your costs) → jedna sekcja `#loyalty`. Paths, Pharmacy, Privacy → p3.

## Co
- Pełnoszeroka sekcja w głębokim atramencie (#0E0F12) — trzeci ton powierzchni obok papieru i gliny; nagłówek z nazwą marki w jej kolorze
  („Cashback grows with every {marka} order.”).
- Bento z trzech ekranów aplikacji (ciemne kafle jak w hero): portfel cashback (nagłówek z monogramem, „Sample data”, wielka kwota, pasek 6 zamówień,
  „Place order N”, przełącznik „One-off order / Subscription”), punkty i poziomy (pierścień postępu do następnego poziomu, sześciokątne pieczątki,
  „Scratch today +10”, „Skip a day”), panel marki w pełnym kolorze marki (suwak kursu punktów → wartość punktów klienta i koszt miesiąca obok suwaka).
- Jeden stan: kurs z panelu marki zmienia wartość punktów w kaflu punktów i w notce przy suwaku.
- Kotwice `#cashback`, `#levels`, `#exchange` zostają (pasek rozdziałów, nawigacja).

## Kryteria
- [x] żadna kontrolka bez widocznego skutku (przełącznik zmienia podpis pod kwotą, suwak — liczbę obok siebie)
- [x] tekst ≥ 12 px; kontrast AA tekstu; kolor marki #111111 widoczny (pieczątki i pierścień w `--hi` = `inkOn` od tła kafla, obrys kafla marki)
- [x] 0 × nazwa demo przy własnej marce; brak przelewania 390/1440; bez przesunięć po kliknięciach; reduced-motion bez animacji
- [x] `gates.sh /nawyko /work/genactiv`, WebKit 390/1440, brand-propagation Chromium + Safari
- [x] recenzja niezależna (35), czytelnik tekstów (37), pierwsza bramka `monotonia` (36) jako punkt odniesienia
