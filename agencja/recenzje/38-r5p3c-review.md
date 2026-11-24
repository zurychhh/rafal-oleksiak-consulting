# Recenzja 38 — R5 p3 cz. 1: `#paths`, `#pharmacy`, `#privacy` (niezależny subagent, 24.11.2026 ok. 18:50)

Zrzuty: `agencja/podglad/r5p3c-rev-*.png`. Marka „Acme” w #111111 i #FFE14D, 1440×900 i 390×844, klawiatura, reduced-motion.

BLOKUJĄCE: brak.
WAŻNE (wszystkie poprawione w tym przebiegu):
1. „Scan the box” pokazywał wynik przed kliknięciem (telefon „registered”, karta „Box scanned”) → stan początkowy = przed skanem („Not scanned yet”), skan → „Scanning…” → „Box scanned”. Zrzuty `r5p3c-v2-pharmacy-*`.
2. Ciemny kolor marki (#111111): `#pharmacy` i `#privacy` zlewały się w dwa czarne bloki → przy kontraście koloru z #0E0F12 < 2 `#privacy` przechodzi na glinę (`data-dark`). Zrzut `r5p3c-v2-privacy-acme111-1440.png`.
3. `#privacy` na 1440×900: przełącznik pod zgięciem → wielkie zdanie max 92 px, rząd wyrównany do góry; przełącznik na y≈600. Zrzut `r5p3c-v2-privacy-demo-1440.png`.
DROBNE: lekcja 5 „Locked”, choć klikalna → „Later” (poprawione); „HEALTH DATA CONSENT · OFF” łamie się na 390 (stary ekran telefonu — zostaje); kolor marki na całej sekcji także w `#pharmacy` — finał nadal najmocniejszy.

Rubryka: oryginalność, 5 s, zero kiczu, interaktywność, personalizacja (0 × „Tovemi” poza placeholderem pola), brak przesunięć przy klikaniu, reduced-motion, klawiatura i fokus, kontrast AA (0 błędów przy #111 i #FFE14D), liczby/marki — PASS. Żywość: PASS przy domyślnym kolorze, przy ciemnym FAIL → poprawione (pkt 2).

## Monotonia 2 (cała `/nawyko`, 1440 i 390): FAIL, lepiej niż 36
Naprawione: 9–11 (Paths/Pharmacy/Privacy) — odcinek od portfela ma teraz 5 różnych układów i 3 tony (atrament → papier → kolor marki → atrament → papier).
Zostaje: (a) sekcje 4–6 (nagrody, „See the day…”, white label) — trzy razy „tekst + telefon po prawej” na glinie; (b) histogram „See the day…” i `#integrations` bez interakcji; (c) telefon z listą nagród i kodem `…-NEXT-K7Q4` w sekcjach 4, 6 i 13, kod wraca w finale. Finał — najmocniejszy (PASS).
