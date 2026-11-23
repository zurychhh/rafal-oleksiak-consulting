# Weryfikacja niezależna, runda 3 (2026-11-23)

Środowisko: http://localhost:3000, Playwright globalny, `chromium.launch()` bez opcji, `navigator.webdriver=false` przez addInitScript, viewporty 390x844 i 1440x900, przewijanie kółkiem 120 px co 60 ms. Skrypt: `/tmp/claude-0/ver3/v.js`, surowe wyniki: `/tmp/claude-0/ver3/{n,c,l}.json`, zrzuty: `/tmp/claude-0/ver3/*.png`.

## Wynik w skrócie

| # | Twierdzenie | Wynik |
|---|---|---|
| 1 | Scena „See the day each pack really runs out.” widoczna przy przewijaniu | **NIEPOTWIERDZONE** (390: nagłówek tak; 1440: nagłówek nie w próbkowanym oknie; kropki: nie znaleziono) |
| 2 | Telefon bez obrotu | **PASS** |
| 3 | Kontrast placeholdera „Tovemi” ≥ 4,5:1 | **FAIL** (pola nie ma w DOM po hydratacji) |
| 4 | Suwak kalkulatora: podpowiedź, animacja, reduced motion | **PASS** (wygląd kciuka tylko na zrzucie) |
| 5 | /lab/home: finał z jednym CTA, lead z trzema ofertami | **PASS z uwagą** (finał: dowód z innerText; ryzyko braku spacji) |
| 6 | Brak poziomego przewijania i błędów konsoli | **PASS** |

## Szczegóły

**1. Scena kropek na /nawyko.** Nagłówek `h2#nk-brand.nk-h2` jest w HTML z serwera, ale po hydratacji nie da się go znaleźć przy załadowaniu strony; pojawia się dopiero w trakcie przewijania (sekcja `.nk-scenehead`: 390 → top 8858 px, wysokość 434 px; 1440 → top 10281 px, wysokość 615 px). Próbki co ~200 px (krycie liczone jako iloczyn opacity przodków):
- 390: y=8400 → 0; 8640 → 0; 8880 → 0; 9000 → 0,24; **9240 → 0,92**. Nagłówek osiąga ≥0,9.
- 1440: y=10200 → 0; 10440 → 0; 10680 → 0; **10800 → 0,36** (koniec okna próbkowania; nagłówek stoi sticky na top 143 px). W próbkowanym oknie krycie ≥0,9 nie wystąpiło.
- Wykres kropek: w `.nk-scenehead` 0 elementów `circle`/`[class*=dot]` przy obu szerokościach. Wykres najpewniej leży w innym kontenerze niż nagłówek, więc mój selektor go nie objął. **Nierozstrzygnięte, nie FAIL.** Zrzut po przewinięciu do sceny: `/tmp/claude-0/ver3/nawyko-scene-390.png`, `/tmp/claude-0/ver3/nawyko-scene-1440.png`.
- Do rozstrzygnięcia: próbkować dalej za sekcją (cały sticky/pin) i podać selektor wykresu.

**2. Brak obrotu telefonu.** Przez całą stronę, przy każdym kroku kółka: 153 (390) i 167 (1440) próbek transformacji `.nk-phone`/`.nk-swing`/`.nk-phonecol` innych niż `none`. Wszystkie to `matrix(s,0,0,s,tx,ty)`: b=c=0, zero `matrix3d`, `rotate: none`. Przykłady: `matrix(0.937339,0,0,0.937339,0,43.86)`, `nk-phonecol matrix(1,0,0,1,-10.9,0)`. Tylko skala i przesunięcie. `.nk-swing` przez cały czas ma `transform: none`.

**3. Kontrast „Tovemi”.** W HTML z serwera jest `<input maxLength="14" placeholder="Tovemi">`, ale po hydratacji w DOM są tylko `#nk-store` („yourstore.com”), `#nk-email` i dwa checkboxy, przy obu szerokościach i po przewinięciu całej strony. Kontrastu nie dało się policzyć, bo pola nie ma. Użytkownik go nie zobaczy. Możliwa przyczyna: rozjazd SSR/klient albo renderowanie warunkowe. To samo zjawisko może tłumaczyć, czemu nagłówek z punktu 1 nie istnieje przy załadowaniu.

**4. /calculator.** Przed interakcją: `.gc-gesture` „Drag to close the gap” ma opacity 1 (342x18 px na 390, 704x18 px na 1440), animacja `gc-arrow` w stanie `running`, kursor suwaka `ew-resize`. Po przeciągnięciu myszą (wartość 50 → 38): opacity podpowiedzi 0, `getAnimations()` pusta. Przy `reducedMotion: 'reduce'`: zero działających animacji, `.gc-arrow` ma animation-name `none`. Zrzuty: `calc-before-390.png`, `calc-after-390.png` (oraz 1440). Kciuk `::-webkit-slider-thumb` ma przezroczyste tło (widoczny kciuk to najpewniej osobny element), więc wygląd „do przeciągania” oceniam tylko na zrzucie, nie liczbowo.

**5. /lab/home.** Lead pod H1: „Keep customers reordering: an app under your brand, consulting, free tools.” Wymienia wszystkie trzy oferty. Na 390: top 193 px, bottom 248 px (w pierwszym ekranie 844 px), 17 px, rgb(58,60,64), opacity 1. Na 1440: 276–340 px, 20 px. Finał: `section.lh-fin` to ostatnia sekcja strony, a jej innerText to tylko zdanie finału plus jeden tekst CTA „ASK HOW TO BRING CUSTOMERS BACK SOONER”, czyli jedno CTA. **Uwaga:** innerText finału to „Youdon'tpaytwiceforthesamecustomer.”, bez spacji. Słowa są najpewniej osobnymi spanami i odstępy mogą się nie renderować. Trzeba to obejrzeć na zrzucie: `/tmp/claude-0/ver3/lab-end-390.png`, `lab-end-1440.png`. Czytniki ekranu i kopiowanie tekstu też dostaną zlepione słowa.

**6. Poziome przewijanie i konsola.** scrollWidth = clientWidth na wszystkich 3 stronach przy obu szerokościach (390/390, 1440/1440). Zero błędów konsoli i `pageerror` na /nawyko, /calculator i /lab/home.

## Ograniczenia
Limit 8 wywołań: zrzutów nie obejrzałem, więc wygląd (kciuk, spacje w finale, kropki) zostaje do sprawdzenia na zrzutach z podanych ścieżek.
