# Recenzja 33 — niezależny recenzent, wielki finał `/nawyko` (R5 p2, 24.11.2026)

Osobny subagent (Sonnet), nie widział budowy; Playwright 390×844, 1280×720, 1440×900, z marką „Acme” i bez, Amber, reduced-motion.
Zrzuty: `agencja/podglad/r5p2-rev-*.png`.

FAIL → poprawione przed commitem:
1. Komunikat „Day 24 done…” w kolorze `--dim` z przezroczystością — na niebieskim 1,3:1, na Amber 3:1 → kolor napisów, bez przezroczystości.
2. „Reveal without scratching” po odsłonięciu z przezroczystością .55 (2,5–3:1) → pełny kontrast.
3. 1440/1280: ok. 450 px pustki między napisami a telefonem → kolumny razem, środek strony (`minmax(0,600px) auto`, `justify-content:center`).
4. `.nk-fz-screen` przelewał 2–3 px w poziomie (dolne zakładki z ujemnym marginesem 6,9cqw przy paddingu 6cqw) → margines = padding (qa.js na 1024×700 też to złapał).
5. Napisy na kolorze marki z przezroczystością .8 (4,8:1 na niebieskim) → bez przezroczystości.

PASS: najmocniejszy moment strony (pełny ekran, na końcu cała sekcja w kolorze marki i płynne przejście w „Build Acme’s app.”), napisy
zgodne ze stanem telefonu, typografia spójna, 0 × nazwa demo po wpisaniu własnej, zdrapka myszą i przycisk działają, Tab do kropek
i przycisku, widoczny fokus na ciemnym i na kolorze marki, Enter na kropce przewija do chwili, telefon 310/265/221 px, tekst w telefonie
≥ 10 px, reduced-motion kompletne, brak twierdzeń zdrowotnych i prawdziwych marek.
