# Recenzja 01 — /nawyko, podejście 2 (niezależny recenzent, 21.11.2026)

Badane lokalnie: http://localhost:3100/nawyko, Playwright/Chromium. Skrypt, wyniki (`out.json`) i zrzuty:
`/tmp/claude-0/-home-claude/38d7ec62-114a-5228-9520-f10ad094c484/scratchpad/rev-nawyko/`.
Uwaga metodyczna: strona pod `navigator.webdriver` zostaje w układzie statycznym, więc w testach nadpisałem
`navigator.webdriver` na `false` — inaczej przypięta scena w ogóle by się nie uruchomiła.

Werdykt: **9 z 10 punktów rubryki zaliczone; do publikacji po poprawkach 1–3** (1 to jedna linijka).

## Rubryka

| # | Punkt | Werdykt | Dowód |
|---|---|---|---|
| 1 | Oryginalność | ZALICZONE | Zdrapka ma teraz skutek: po zdrapaniu (mysz i dotyk) karta pokazuje „Day 9 / Done”, seria rośnie 8 → 9, podpowiedź zmienia się na „Ticked. See you tomorrow.” |
| 2 | Oferta w 5 sekund | ZALICZONE | Pierwszy ekran bez zmian względem podejścia 1 (etykieta, H1, lead, CTA nad zgięciem); nadal „after their dose” w ledzie zawęża do suplementów. |
| 3 | Zero kiczu | ZALICZONE | Jedna paleta, brak ozdobników bez funkcji; błękitna poświata fokusu zniknęła z całego `.nk` (zostaje tylko w pasku cookies, poza zakresem strony). |
| 4 | Płynność | ZALICZONE (pośrednio) | Brak błędów konsoli i przeskoków na 8 pozycjach sceny; klatek na sekundę nie mierzyłem. |
| 5 | Brak przesunięć układu | ZALICZONE wg progu 0,1 — ale usterka z podejścia 1 NIE jest naprawiona | CLS: 390 = 0,0002; 768 = 0,0002; 360 = 0; **1024 = 0,059 (było 0,050); 1440 = 0,033 (było 0,028)**. |
| 6 | Reduced-motion | ZALICZONE | Scena `is-still`, `.nk-stage` `position: static`, wysokość 874 px, 4 opisy widoczne (54/78/78/78 px), klik w krok 2 przełącza ekran telefonu, 0 działających animacji. |
| 7 | Klawiatura | ZALICZONE (desktop) | 1440: 26 przystanków w logicznej kolejności, wszędzie obrys 2 px, pola formularza też; Enter na kroku 03 przewija scenę do „Build the streak”. Zastrzeżenie dla telefonu niżej (usterka 6). |
| 8 | Brak prawdziwych marek | ZALICZONE | W kodzie i na ekranach tylko „Tovemi”, „Magnesium · 30 capsules”, kod `TOVEMI-NEXT-K7Q4`; notka o zmyślonej marce widoczna. |
| 9 | Liczby bez źródła, zdrowie, losowość | NIEZALICZONE | Twierdzeń zdrowotnych i losowości brak („Never random”, „No health claims”). Została obietnica „I reply personally within 24 hours.” w stanie po wysłaniu (`NawykoClient.tsx` l. 533) — w notce pod formularzem usunięta, tu nie. |
| 10 | Rozmiar JS (informacyjnie) | — | Transfer JS trasy: 142,3 kB w 9 plikach (było 145,6 kB); nie sprawdzałem, czy serwer na 3100 to build produkcyjny. |

## Test dotyku (emulacja iPhone 13, 390×664, zdarzenia dotyku przez CDP)

- Przed: „Streak 8 days”, „One card a day. Drag across it.”. Po zygzaku palcem po `.nk-canvas`: **„Streak 9 days”**, płótno `is-gone`, „Ticked. See you tomorrow.”.
- Przeciąganie po płótnie **nie przewija strony**: scrollY 1385 → 1385 (ruch w dużej części pionowy).
- Palec zaczyna poza płótnem (tekst kroku): strona się przewija, 1385 → 1610. Palec zaczyna na telefonie, ale poza kartą (zakładki): też się przewija, 1610 → 1775.
- Karta zajmuje 150×84 px, więc nie blokuje przewijania ekranu.
- Ograniczenie: to dotyk syntetyczny w Chromium, nie prawdziwy iPhone/Safari.

## CLS — skąd się bierze

1. **`div.nk-scenehead` i `div.nk-phonecol` skaczą o 28–29 px w górę** (1024: 0,018; 1440: 0,011), raz, ok. 1,5 s po załadowaniu. Najbardziej prawdopodobna przyczyna (nie potwierdzona wyłączeniem paska): pasek cookies ustawia `--consent-h` po czasie, `.is-scroll .nk-stage` ma `height: calc(100svh - var(--consent-h))` i `align-items:center`, więc zawartość przesuwa się o połowę wysokości paska (56 px / 2).
2. **`div.nk-scenehead` przesuwa się o 3–4 px przy każdej zmianie kroku** (ok. 0,002 każde, 5–6 razy na przejście): opisy kroków mają 2 albo 3 linie, kolumna jest wyśrodkowana w pionie, więc cały blok (z nagłówkiem H2 i paskiem postępu `.nk-bar i`) pływa. Na zrzutach 1440: H2 na y=155 w kroku 1 i y=143 w kroku 2.
3. Przy hydracji (t≈200–240 ms) przełączenie `is-still` → `is-scroll`: `div.nk-phonecol`, `div.nk-phone`, `ol.nk-steps` (0,002–0,003), w większości poza ekranem.

## Stan usterek z podejścia 1

Naprawione: tekst kroku pod paskiem cookies na 360 (opis kończy się na y≈408, pasek od 562); lista nagród nachodząca na zakładki; zdrapka bez skutku; notka o marce na telefonie (etykieta „shown on a made-up brand” przy 390); fokus pól i błękitna poświata; „rhythm of use” („Across your customers”); telefon white label (17 dni zamiast 24 bez stempla); „Colours”, „oddly satisfying”.
Częściowo: „within 24 hours” (zostało w stanie po wysłaniu); „No pointer?” (miejsce zarezerwowane, ale nadal ok. 4 px pod paskiem postępu na 1440).
Nienaprawione: CLS na desktopie; przyciski kroków niedostępne z klawiatury na ≤860 px; „Cashback” i „installs your app” nadal czekają na potwierdzenie właściciela; „dose” w ledzie.

## Usterki do poprawy (od najważniejszej)

1. **„within 24 hours”** — `NawykoClient.tsx` l. 533: zmienić na „I reply personally.” (jak w notce l. 563–566).
2. **Skok sceny o 28 px po pojawieniu się paska cookies** — `nawyko.css` l. 68–70: w `.is-scroll .nk-stage` dać `align-items:start` z `padding-top` liczonym od góry (np. `clamp(48px,12vh,140px)`), żeby zmiana `--consent-h` skracała scenę od dołu, a nie przesuwała treści; potwierdzić pomiarem na 1024.
3. **Blok kroków pływa o 3–12 px przy zmianie kroku** — `nawyko.css` l. 71–82: to samo `align-items:start` rozwiązuje sprawę dla `.nk-scenehead`; dodatkowo `min-height` na `.nk-steps` równe wysokości przy najdłuższym opisie (3 linie), żeby pasek postępu i notka stały w miejscu.
4. **„No pointer?” przyklejone do paska postępu (1440, krok 2)** — `nawyko.css` l. 85–87: odstęp między `.nk-bar` a `.nk-alt` to ok. 4 px mimo `margin-top:16px`; ustawić `.nk-alt{margin-top:20px;line-height:22px}` i sprawdzić na zrzucie.
5. **360×640, krok 4: telefon nie pokazuje listy nagród** (tylko stempel i kod), a opis obok mówi „The list of rewards was on screen from day one” — `nawyko.css` blok `@media (max-width:860px) and (max-height:720px)` (l. 241+): zamiast ukrywać `.nk-rw`, zostawić dwa–trzy wiersze mniejszą czcionką albo ukryć kupon.
6. **Telefon, klawiatura: z czterech przycisków kroków w kolejności Tab jest tylko aktywny** — `nawyko.css` blok `@media (max-width:860px)` (l. 219+): nieaktywne kroki chować wizualnie (klasa typu „visually hidden”), nie przez `display:none`.
7. **390: przycisk „Send” po fokusie z klawiatury jest przykryty paskiem cookies** — `nawyko.css`, `.nk-form` / `.nk-cta`: dodać `scroll-margin-bottom: calc(var(--consent-h,0px) + 16px)`.
8. **„Cashback on next order” i „The customer installs your app”** — `page.tsx` (`REWARDS[3]`), `NawykoClient.tsx` l. 263–266 i 458–459: decyzja właściciela, czy to zatwierdzony zakres; do tego czasu oznaczyć cashback jako opcję.
9. **„dose” w ledzie, kroku 2 i opisie meta** — `page.tsx` l. 8 i 93, `NawykoClient.tsx` l. 17: „after using the product”, jeśli oferta ma obejmować też kawę i karmę.

## Czego nie sprawdziłem

- Kontrastu po zmianach (w podejściu 1 było 4,31:1) — nie mierzyłem ponownie.
- Prawdziwego telefonu i Safari; klatek na sekundę; formularza (zgodnie z poleceniem nie wysyłałem).
- Obejrzałem zrzuty: 1440 w krokach 1, 2, 4; 390 w krokach 2, 4; 360 w kroku 4; stan po zdrapaniu dotykiem. Pozostałe pozycje i szerokości 768/1024 oceniłem z pomiarów. Zrzutu reduced-motion nie oglądałem, tylko pomiary.
- Przyczyna skoku o 28 px to wniosek z kodu i liczb, nie test z wyłączonym paskiem.
