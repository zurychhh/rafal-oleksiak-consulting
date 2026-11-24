# Spec 20 — R4 przebieg 9: pasek rozdziałów `/nawyko` + jedna bramka `scripts/gates.sh`

## A. Pasek rozdziałów (lokalna nawigacja jak na stronach produktowych Apple)
Problem: `/nawyko` ma ~25 000 px (1440). Poniżej 1200 px nie ma żadnej nawigacji po rozdziałach, a droga do formularza
z połowy strony to przewijanie kilkunastu ekranów. Źródło: Smashing Magazine, „Designing Sticky Menus: UX Guidelines”
(V. Friedman, 2023) — menu częściowo przyklejone (wraca przy przewijaniu w górę), małe, z bieżącą sekcją.
Kryteria:
1. Ukryty na pierwszym ekranie i bez JS; za pierwszym ekranem pojawia się przy przewijaniu w górę, chowa w dół.
2. Pokazuje bieżący rozdział (7: How it works · Cashback · Points · Your costs · Privacy · Proof · FAQ); < 1100 px lista
   rozwijana, ≥ 1100 px linki w wierszu + nazwa „Nawyko”; zawsze CTA „Ask about Nawyko” → `#enquiry`.
3. Znika, gdy formularz jest na ekranie, i na < 1100 px w przypiętej scenie (zasłaniałby nazwę marki na telefonie).
4. Ukryty = `inert`; fokus pod paskiem → pasek ustępuje (WCAG 2.2 2.4.11); Escape zamyka listę i oddaje fokus;
   kolejność Tab: przycisk → lista → CTA.
5. CLS 0 (fixed + transform), `prefers-reduced-motion` bez przejść, kontrast ≥ 4,5:1, stan React tylko przy zmianie.
6. WebKit 390 i 1440: pasek widoczny po przewinięciu w górę, lista rozwija się, telefon ≥ 150 px.

## B. `scripts/gates.sh <base> <trasa>...`
Jedno polecenie uruchamia wszystkie bramki na lokalnym serwerze (qa.js, cls-check 390/1440, scroll-perf 390/1440 z progiem
klatka ≤ 100 ms i interakcja ≤ 200 ms, focus-obscured, jsonld, WebKit 390/1440, content-rules, copy-voice, focus-ring,
ship-compare gdy `/`); odmawia dla hosta innego niż localhost (qa.js wysyła formularz). Powód: R13–R15 — bramki pomijane
albo mierzące złe miejsce.
