# Spec 21 — R4 przebieg 10: pasek rozdziałów na `/work/genactiv` + szlif paska `/nawyko` (recenzja 25, D1–D5)

Źródło wzorca: lokalna nawigacja stron produktowych Apple; Smashing Magazine, „Designing Sticky Menus: UX Guidelines”
(V. Friedman, 2023) — menu częściowo przyklejone, małe, z bieżącą sekcją. Spec 20 opisuje wersję `/nawyko`.

## A. `/nawyko` — szlif `ChapterBar` (strumień A, pliki: `app/nawyko/ChapterBar.tsx`, reguły `.nk .cb*`)
1. **D1:** w przypiętej scenie na ≥ 1100 px pasek pokazuje tylko bieżący rozdział + CTA (bez rzędu 7 linków) — jeden rząd
   wersalików zamiast dwóch. Poza sceną bez zmian.
2. **D2:** w scenie `#how` etykieta bieżącego rozdziału mówi też bieżący akt sceny, np. „How it works · 04 Reward”
   (nazwy aktów z istniejącej nawigacji `nk-acts`; żadnego nowego tekstu poza złożeniem istniejących).
3. **D4:** po kliknięciu rozdziału fokus trafia na sekcję docelową (`tabIndex=-1`, `focus({preventScroll:true})`),
   czytnik ekranu ogłasza cel; brak widocznego obrysu na sekcji przy kliknięciu myszą (`:focus-visible`).
4. **D5:** numer bieżącego rozdziału w liście w ciemniejszej czerwieni (`--red-s`), kontrast ≥ 7:1 na papierze.
5. Bez regresji: CLS 0, Tab: przycisk → lista → CTA, Escape, `inert`, WebKit 390/1440 telefon ≥ 150 px.

## B. `/work/genactiv` — pasek aktów (strumień B, pliki tylko w `app/work/genactiv/`)
Problem: trasa to jedna przypięta scena na 11 aktów (~1320 svh) i formularz na końcu; z połowy (np. akt „Cashback”)
do zapytania jest kilka ekranów przewijania, a nie ma żadnej drogi do konkretnego aktu.
1. Osobny komponent w `app/work/genactiv/` (nie modyfikuje `app/nawyko/ChapterBar.tsx` — zmienia go strumień A).
2. Rozdziały = grupy istniejących aktów, etykiety z istniejących kickerów: The problem (1) · How it works (2–4) ·
   Cashback (5) · Points and levels (6) · Consent (7) · How it was built (8) · Results (9) · Your brand (10).
   CTA „Ask about an app” → `#enquiry` (to samo brzmienie co tytuł formularza: „Ask about an app for your brand”).
3. Ukryty na pierwszym ekranie (akt 0) i bez JS; pojawia się przy przewijaniu w górę, chowa w dół; znika, gdy formularz
   jest na ekranie. < 1100 px: bieżący rozdział jako przycisk z listą + CTA; ≥ 1100 px: bieżący rozdział + CTA
   (bez rzędu linków — lekcja D1 z `/nawyko`), lista także rozwijana.
4. Skok do rozdziału w trybie przewijania = `scrollTo` na środek pierwszego aktu grupy (top toru + (i+0,4)/ACTS·span,
   jak istniejące `toBrand`); w układzie statycznym (reduced motion, webdriver, niski ekran) = przewinięcie do
   `section.ga-act-i` i fokus na nim.
5. Na telefonie (390) pasek nie zasłania nazwy marki ani treści ekranu telefonu w scenie (lekcja R16) — sprawdzone zrzutem
   każdego aktu; jeśli zasłania, w scenie < 1100 px pasek się nie pokazuje (jak na `/nawyko`).
6. `inert` gdy ukryty, ustępuje fokusowi (WCAG 2.2 2.4.11), Escape zamyka listę i oddaje fokus, kolejność Tab:
   przycisk → lista → CTA; CLS 0 (fixed + transform); `prefers-reduced-motion` bez przejść; kontrast ≥ 4,5:1 w palecie
   realizacji; setState tylko przy zmianie wartości; JS trasy nie rośnie o więcej niż 10%.
7. Granice speca realizacji bez zmian: żadnych liczb, nowych tekstów o GENACTIV, logo ani zrzutów.

## Bramki
`bash scripts/gates.sh http://localhost:<port> /nawyko /work/genactiv` (wszystko PASS) + build, tsc, lint ≤ 0 błędów/1 ostrzeżenie,
zrzuty Chromium i WebKit 390/1440 z paskiem widocznym w scenie, niezależna recenzja.
