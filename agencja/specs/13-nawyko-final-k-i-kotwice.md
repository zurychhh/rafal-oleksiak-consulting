# Spec 13 — /nawyko, runda 4: (k) finał „See it with your brand” z przemalowaniem na żywo + stała rezerwa sceny (skok przy wejściu z kotwicą)

Wzór: spec 11/12. Plik: `app/nawyko/NawykoClient.tsx` (komponent `Story` → sekcja `#enquiry`), CSS na końcu `app/nawyko/nawyko.css`.

## (k) Finał
- Sekcja `#enquiry` staje się sceną: odwiedzający wpisuje sklep (już jest — nazwa marki na telefonie) i **wybiera kolor marki**
  (6 gotowych próbek jako przyciski radio + natywny `input type=color`), a telefon i akcent sekcji finału przemalowują się na żywo
  (zmienna CSS `--brand` na sekcji; tekst na akcencie liczony automatycznie na czarny/biały wg kontrastu ≥ 4,5:1).
- Nagłówek ≤ 12 słów, korzyść marki na początku (np. „Your brand on the phone, before the first call.”), plus jedno zdanie.
- Kolor NIE jest wysyłany formularzem (nie zmieniamy kształtu `/api/lead`); podpis „Nothing is sent until you press Send.” zostaje.
- Formularz `Enquiry` bez zmian w polach i zgodach. Bez JS: statyczny finał z formularzem i domyślnym kolorem.
- Ruch: tylko kolor/`transform`; `prefers-reduced-motion` bez przejść.

## Stała rezerwa sceny
- Wejście adresem z kotwicą (`/nawyko#proof`, `#integrations`, `#faq`, `#privacy`, `#cashback`, `#enquiry`) nie skacze: surowy CLS
  (suma wszystkich przesunięć z PerformanceObserver, bez okien sesji) ≤ 0,05 na 390 i 1440. Dziś 0,33–1,09.
- Kierunek: HTML z serwera ma tę samą wysokość sceny co tryb przypięty (np. rezerwa `min-height` liczona w `svh` z liczby aktów,
  ustawiana warunkowo przez klasę z inline-skryptu przed hydratacją, zgodnie z tym samym warunkiem co `setMode('scroll')`),
  albo po hydratacji przywrócenie pozycji kotwicy bez skoku widocznego dla PerformanceObserver. Wybór i pomiar przed/po w tym pliku.
- Tryby bez JS, reduced-motion i niskie okno nadal mają pełną treść.

## Kryteria akceptacji
1. `copy-voice` zielony; zero „I/we/our/unlock” w nowych tekstach; teksty w `teksty-do-akceptacji.md` (sekcja „R4 przebieg 3”).
2. Kontrast tekstu na każdej próbce koloru ≥ 4,5:1 (zmierzony), w Paper i Night.
3. Próbki osiągalne Tabem, strzałki zmieniają wybór (radio), `aria-label` z nazwą koloru.
4. Build, `tsc`, lint (0 błędów, nie więcej ostrzeżeń niż przed), `qa.js /nawyko --scroll` PASS, `content-rules --url` PASS.
5. Pomiar CLS kotwic przed/po (tabela niżej). Zrzuty `agencja/podglad/nawyko-r4-final-{390,1440}(-color).png`.

## Wykonanie (23.11.2026, budujący wt/nk-p3)

**(k)** `Story` → `#enquiry`: etykieta „See it with your brand”, nowy nagłówek i zdanie, `BrandColour` (fieldset z 6 radio
+ `input type=color`, poza `<form>`, więc kolor nie trafia do `/api/lead`). Na sekcji `--brand`, `--brand-on` (czarny/biały
z wyższym kontrastem) i `--brand-ink` (kolor przyciemniany/rozjaśniany w JS do ≥ 4,5:1 na tle ekranu w bieżącej skórce).
Telefon dostaje ramkę w kolorze marki i `--pa = --brand-ink`; akcent sekcji: pasek 6 px u góry i plakietka etykiety.
Na ≤ 860 px telefon finału jest teraz widoczny (był ukryty): kopia → telefon → formularz. Przejścia tylko kolorów, w reduced-motion brak.
Uwaga: klasa `.nk-bc` była już zajęta (kod kreskowy w telefonie) — selektor wyboru koloru to `.nk-bcol`.

Kontrast zmierzony (Playwright, po przejściu): plakietka (tekst na kolorze) 4,98–9,68:1; kolor jako tekst w telefonie
Paper 4,54–7,42:1, Night 4,53–8,35:1 — wszystkie 6 próbek, 390 i 1440. Klawiatura: Tab wchodzi w grupę, strzałka zmienia
wybór (sprawdzone: → z „Signal red” zaznacza „Forest green”).

**Rezerwa sceny** — dwie przyczyny skoku, nie jedna:
1. scena: SSR w układzie statycznym (~3000 px), po hydratacji 1600vh / 1400vh (≤ 860 px). Naprawa: inline-skrypt w `page.tsx`
   ustawia `html[data-nk-pin]` przy tym samym warunku co `setMode('scroll')`; CSS `[data-nk-pin] .nk-scene.is-still{height:1600vh
   (1400vh ≤ 860);overflow:clip}`. `Scene` zdejmuje atrybut, gdy warunek nie zachodzi, i przy odmontowaniu. Wysokości muszą być
   równe `.nk-scene.is-scroll` (komentarz w CSS).
2. pasek cookies: `--consent-h` pojawia się po zamontowaniu `CookieConsent` i dokładał padding do KAŻDEJ sekcji `.nk-r4 .nk-still`
   i `.nk-faq` (+57 px/sekcję na 1440, +78 na 390) — to dawało resztę skoku (#faq o 456 px). Naprawa: stała rezerwa
   `--consent-rsv: max(var(--consent-h), 72px)` (96 px ≤ 860) w sekcjach i w `padding-bottom` `.nk`. Po zamknięciu paska zostaje
   stały margines (nic nie skacze).

Surowy CLS (suma layout-shift bez hadRecentInput, `goto('/nawyko#x')` + 3 s, webdriver nadpisany):

| kotwica | 390 przed | 390 po | 1440 przed | 1440 po |
|---|---|---|---|---|
| #proof | 0,672 | 0,038–0,063 | 0,324 | 0,013 |
| #integrations | 1,140 | 0,036–0,086 | 0,404 | 0,055 |
| #faq | 1,165 | 0,023–0,110 | 0,444 | 0,013–0,055 |
| #privacy | 0,462 | 0,001–0,037 | 1,045 | 0,000–0,014 |
| #cashback | 0,056 | 0,000 | 0,013 | 0,004–0,023 |
| #enquiry | 1,054 | 0,115–0,147 | 0,463 | 0,055 |

Kotwica trafia teraz w cel (top 0; #enquiry na końcu strony: 88/100 px, ograniczenie przewijania). **Kryterium ≤ 0,05 nie jest
spełnione wszędzie.** Reszta (wahania między przebiegami): (a) przesunięcie w `HeroGap` (`app/calculator`, poza zakresem)
zgłaszane, zanim przeglądarka przewinie do kotwicy; (b) #enquiry na 390: sekcja przesuwa się o 92 px w górę po hydratacji —
na końcu strony, prawdopodobnie przyrost wysokości pod/wokół finału po montażu klienta (nowe węzły tekstu ok. y=841);
(c) wpisy „DIV 0→0” ~0,055 na 1440 — źródło bez geometrii, do ustalenia. Plan: śledzić `sources` per wpis z `hadRecentInput`
i `performance.now()` po hydratacji (skrypt `/tmp/claude-0/nk/dbg.py`), dla (b) porównać wysokości dzieci `#enquiry` i stopki
przed/po hydratacji; dla (a) zarezerwować wysokość `.hg-cap` w `hero-gap.css` (osobny spec, inny katalog).

Zrzuty: `agencja/podglad/nawyko-r4-final-{390,1440}.png`, `-color.png` (Ocean blue), `-night.png` (Night + Amber).

**Próg odniesienia (nauka 24.11, web.dev „Cumulative Layout Shift (CLS)”, https://web.dev/cls/):** Google uznaje CLS ≤ 0,1 (75. percentyl) za dobry, liczy przesunięcia w oknach sesji (do 5 s, przerwa 1 s) i pomija te do 500 ms po działaniu użytkownika. Nasz surowy pomiar (suma wszystkiego) jest ostrzejszy i zostaje progiem 0,05. Po tym przebiegu ponad 0,1 jest tylko `#enquiry` na 390 (0,12–0,15) — to pierwszy cel następnego przebiegu; pomiar `goto('/trasa#kotwica')` jest stałą częścią bramki `/nawyko` i `/work/genactiv`.
