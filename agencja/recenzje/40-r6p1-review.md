# Recenzja 40 — R6 p1 (`/nawyko` hero + why + kokpit, `/work/genactiv` tempo), niezależny recenzent, 24.11.2026 ~20:10

Recenzent oglądał build po scaleniu obu części (Chromium headless, 390×844 i 1440×900, marka „Acme”).

BLOKUJĄCE (zgłoszone):
1. `/work/genactiv` akty nieprzypięte — **NIEPOTWIERDZONE**: tryb automatu (`navigator.webdriver`) wyłącza przypinanie celowo; z wyłączonym znacznikiem `data-ga-pin` jest, tor 13 860 px na 900 px (Lead, `pin.js`).
2. `/work/genactiv` zdrapka od razu odkryta — **NIEPOTWIERDZONE** z tego samego powodu (`.ga-gone` brak u „człowieka”).
3. `/nawyko` licznik „why” biegnie, zanim sekcja jest widoczna (557 / 303 px) — **POTWIERDZONE, POPRAWIONE**: sekcja 230 svh, wnętrze przyklejone na pełny ekran, licznik po torze przypięcia.

WAŻNE:
4. Zakładka Rules — przełączniki nie zmieniają telefonu (wracają i mówią dlaczego, zgodnie ze specem) — do p2: odbicie w telefonie.
5. „1 days of slack” i zdanie przy 30 z 30 — **POPRAWIONE** (liczba pojedyncza, wariant bez zapasu).
6. Kokpit na papierze, nie w języku finału — **POPRAWIONE** (atrament). Dowód, integracje, FAQ — p2.
7. Na 390 pole nazwy marki i oferta poniżej pierwszego ekranu — p2.
8. Kalkulator luki między hero a „why” spoza specu — decyzja R6p1-A.

DROBNE: przykład w „Daily card” nie reaguje na suwak; wersja bez ruchu „Day 30 of 30” przy zdaniu o dniu 31; rząd zakładek na telefonie bez sygnału przewijania (**POPRAWIONE**: wygaszenie krawędzi).

PRZESZŁO: zero nazwy demo po wpisaniu własnej, „Acme” w każdym telefonie; jeden konfigurator; zakładki: strzałki, Home/End, roving tabindex; CLS ≈ 0; telefony 221–230 px na 390; liczby z „Example”; brak prawdziwych marek poza platformami.
