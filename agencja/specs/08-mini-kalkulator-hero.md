# 08 — mini-kalkulator w hero `/nawyko` i `/lab/home` (decyzja doradcy J → a, 23.11 13:50)

**Po co:** recenzja dyrektora kreatywnego (08): najbardziej zapamiętywalny element trzech stron to kwota w kalkulatorze.
Hero `/nawyko` i `/lab/home` nie mają żadnej kwoty. Kwota musi pochodzić z liczb odwiedzającego.

**Kształt:** jedno zdanie z dwoma polami w tekście: „Customers reorder every [58] days · repeat revenue a year [480,000]”.
Pod nim pasek jednego cyklu: czarny odcinek = opakowanie 30 dni, kreskowany = dni bez produktu (gap − 30).
Jedna duża czerwona liczba: przychód, gdyby klienci zamawiali, gdy kończy się 30-dniowe opakowanie.
Jedno zdanie pod liczbą + link do `/calculator` (pełny rachunek).

**Model:** ten sam co `/calculator` (`gapValue`): customers × aov = przychód × odstęp / 365, cel = 30 dni.
Wynik = przychód × (odstęp / 30 − 1). Opakowanie 30 dni = przesłanka Nawyko (karta na 30 dni), podana na ekranie wprost.

**Kryteria (bramka):**
1. Zmiana każdego pola zmienia wynik (reguła NN/g z `narzedzia.md`).
2. Odstęp ≤ 30 dni → komunikat „no empty shelf”, bez liczby; poza zakresem → podpowiedź, bez NaN.
3. Wartości startowe podpisane „Example — type your own”; „a ceiling, not a forecast” przy liczbie.
4. Nic nie jest wysyłane ani zapisywane (zero fetch/storage/analytics w komponencie).
5. Bez przesunięć układu: pasek przez `transform: scaleX`, liczba w polu o stałej wysokości. CLS hero ≤ 0,01.
6. Kontrast ≥ 4,5:1 (qa.js), fokus widoczny, pola z etykietami, wynik w `aria-live`.
7. `prefers-reduced-motion`: bez przejść.
8. `copy-voice` OK, czytelnik-kupujący na liście tekstów.
