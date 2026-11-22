# 05 — /nawyko: zdrapka nie do przegapienia, rozdziały, telefon zmienia stronę · /lab/home (przebieg 4, 22.11.2026)

Źródło: uwagi Rafała 22.11 10:55 (STATUS, priorytet NAJNOWSZY), punkty 1a–1d i 3.

## Kryteria akceptacji
1a. Akt zdrapki przypięty dłużej niż pozostałe (waga 1,9 wobec 1). Jeśli odwiedzający nie zdrapie sam w ok. 1,5 s
    od wejścia w akt — karta zdrapuje się sama: ślad palca zygzakiem, opadające drobiny, potem „Day 9 DONE” i licznik
    8 → 9 z czerwonym „+1”. Kto przewija szybko (połowa aktu), dostaje animację od razu. Własne zdrapanie przerywa
    animację. Fokus klawiatury w scenie wstrzymuje samozdrapkę; skok do aktu „Scratch” z nawigacji stawia fokus na
    przycisku zastępczym. Bez blokowania przewijania.
1b. Pierwszy ekran i formularz mówią wprost, co marka kupuje: aplikacja pod jej marką, zbudowana i prowadzona dla niej.
    Każdy rozdział ma etykietę: „For your customer” / „For you” / „Under your brand” (także w układzie statycznym).
    Bez ceny, statusu i terminów.
1c. Telefon przejeżdża na lewo w rozdziale „For you” i wraca w „Under your brand” (desktop), z lekką rotacją; tło
    rozdziału inne. Na ≤860 px: przesunięcie + skala. Tekst nowego rozdziału pojawia się po dojechaniu telefonu.
1d. Telefon większy (do 78svh / 700 px), wejście z głębi (rotateX + skala + przesunięcie).
3.  `/lab/home` (noindex): w 5 s trzy oferty jako sceny — Nawyko (największa waga, marka zmyślona), konsulting,
    narzędzia; nawigacja do `/nawyko`, `/calculator`, `/tool`; nagłówek „You don't pay twice for the same customer.”
    bez zmian; treść konsultingu z obecnej strony. Na 390×844 wszystkie trzy w pierwszym widoku.
Bramki: build, tsc, lint (≤1 ostrzeżenie), copy-voice, content-rules, qa.js na /nawyko, /lab/home, /, /tool, /stop,
/calculator, ship-compare, tool-rules, nagrania przewijania 390 i 1440, niezależny recenzent wyglądu i czytelnik-kupujący.
