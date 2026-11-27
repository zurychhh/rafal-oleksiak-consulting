# Spec 43 — R6' p9: bramka `sticky-fixed` zielona na `/work/genactiv` i `/nawyko` (+ `/privacy` równolegle)

Źródło: kolejka R6'-N8 pkt 0 (dwa starsze błędy znalezione przez bramkę `sticky-fixed`, przebieg 26.11 09:38) i R-1038 pkt 1.

## Zakres
- `/work/genactiv`: pigułka „Act N of 11 · …” (`.ga-prog`, absolute w przypiętej scenie) wystawała spod paska aktów `.ga-ab` (fixed, 53 px)
  na 1440/1280/1100 w każdym kroku; na 390 pasek wracał na górę odjeżdżającej sceny przy końcu toru.
- `/nawyko`: pasek rozdziałów `.cb` na 1100–1159 px w dwóch wierszach (81 px), CTA „Ask about Nawyko” na telefonie finału.
- `/privacy` (budujący równoległy, worktree): clsscroll 390/1440 i focus-obscured.

## Rozwiązanie
- Pigułka NIE znika (ukrycie = zmiana zakresu): gdy pasek widoczny, zjeżdża transformem pod pasek (`body:has(.ga-ab[data-on]) .ga-prog`,
  40 px desktop / 56 px telefon, 11 px odstępu), ta sama krzywa co pasek, bez przejścia przy „ogranicz ruch”. Transform = CLS 0.
- `ActBar`: na < 1100 px pasek ustępuje także przez pierwsze 120 px odjazdu sceny (wzór ChapterBar, spec 42).
- `.cb` 1100–1239 px: padding 28 px, odstępy 12/14 px → jeden wiersz 53 px.
- `/privacy`: preload Poppins 700 + DM Sans 400/400-ext/700; `scroll-behavior:auto` (dziedziczone `smooth` z `critical.css` sprawiało,
  że fokus stał już na linku, a strona dopiero przewijała go spod paska cookies) + `scroll-padding-bottom: var(--consent-h)+24px` (WCAG C43).

## Kryteria akceptacji
1. `sticky-fixed-check.mjs` PASS na `/work/genactiv` i `/nawyko` (4 szerokości, licznik tekstów > 0).
2. `gates.sh /nawyko /work/genactiv /privacy` bez nowych FAIL względem poprzedniego przebiegu; WebKit 390/1440 PASS.
3. Zrzut: pigułka pod paskiem na 1440, pasek `/nawyko` jednym wierszem na 1100.
4. Zero zmian tekstów widocznych dla odwiedzającego.
