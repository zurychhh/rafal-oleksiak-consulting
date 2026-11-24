# Spec 37 — R6' przebieg 3: hero bez skoku, szósta zakładka kokpitu (25.11.2026 00:xx)

Źródło: STATUS „R6'-N2” (recenzja 44 + doradca 22:50).

## A — hero (`nawyko.css`)
- `.nk-happ` ≥ 1101 px: siatka z jawną kolumną konfiguratora (`auto 216px`) zamiast flex `flex-end` — telefon nie może stać sam przy prawej krawędzi, gdy kolumna jeszcze nie dotarła (hipoteza skoku 0,064: 1007 → 763 px = 216 + 28).
- Kolumna konfiguratora zaczyna się na wysokości telefonu (1440: y 338 → 197).
- Wybrany chip „Page style”: jedna obwódka 2 px; fokus klawiatury osobnym obrysem.
- Kryteria: 5 × clsscroll-1440 < 0,01; zrzuty 390/1440 bez ucięć; gates.sh PASS.

## B — kokpit „For you”
- Akt 6 sceny „Pack rhythm” (rozdział „For you”, „See the day each pack really runs out.”) → szósta zakładka kokpitu `#rhythm`, treść 1:1 (prośba doradcy 22:50). Scena „Four steps” (akty klienta 1–5) bez zmian treści.
- Panele na 1440 wyśrodkowane w pionie, telefony ≤ 370 px — bez pustych dolnych połów.
- 390: rząd zakładek z zanikaniem krawędzi, widoczną połową następnej zakładki i przyciskiem „›” (klawiatura).
- Kryteria: inwentarz PASS (żadne zdanie nie znika), no-JS 6 paneli, link `#rhythm` otwiera zakładkę, gates.sh PASS.
