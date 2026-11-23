# Recenzja 12 — `/lab/reward` i przejazd „For you” / „Under your brand” (390)

Recenzent niezależny, 2026-11-23, localhost:3000, Chromium z `/opt/pw-browsers`, `navigator.webdriver=false`,
przewijanie realnym kółkiem (`mouse.wheel(0,120)` co 60–80 ms). Zrzuty: `/tmp/claude-0/rev/*.png`.

## Wynik

| # | Punkt | Wynik | Dowód |
|---|---|---|---|
| 1 | Test 10 sekund | PASS | 390: na pierwszym ekranie pytanie, odpowiedź „96 in your currency”, wzór „48 margin × 2 extra orders”, zalecenie „Set one fixed reward below this…” i pola do wpisania. Link do `/nawyko` jest dopiero pod suwakiem, poza pierwszym ekranem (a-m-top.png); na 1440 wszystko jest na jednym ekranie (a-d-top.png). |
| 2 | Najpierw odpowiedź | PASS | Duża liczba 96 stoi nad etykietą „Example — type your own” i polami, na obu szerokościach. |
| 3 | Wynik reaguje na zmiany | PASS | „4,000” i „4 000” liczą się jako 4000 (extra sales 8,000); „48,5” daje 48.5 i 97. Puste pole daje „—” i `aria-invalid` na `#rw-a`. Marża 200 przy zamówieniu 120 daje komunikat „Margin: no more than the order value.” i `aria-invalid` na obu polach. Suwak zmienia pasek, `aria-valuetext` i werdykt (End → „Doesn’t pay off · 96 short”). Region `aria-live` aktualizuje się z opóźnieniem (sprawdzone po 2,5 s). Uwagi niżej. |
| 4 | Żadnej liczby jako faktu | PASS | Wartości startowe stoją pod etykietą „Example — type your own”, a po edycji zmienia się ona na „Your numbers”. „Extra orders” ma dopisek „your assumption”, waluta to „in your currency”. Nie ma żadnych statystyk rynkowych. |
| 5 | Klawiatura | PASS | Kolejność Tab: skip link → logo → `#rw-a` → `#rw-m` → `#rw-x` → `#rw-c`. Każdy element ma `outline: 2px solid rgb(20,22,26)` (b-focus-*.png). 5 wciśnięć ArrowRight przesuwa suwak z 50 na 55, End na 200. |
| 6 | Kontrast ≥ 4,5:1 | PASS | „Tool · 30 seconds” #5C5B56 na #F7F5F0 daje 6.25. „Try a reward cost” #5C5B56 na #EDEAE1 daje 5.66. „Extra sales” #3A3C40 na #EDEAE1 daje 9.19. Wzór #3A3C40 na #F7F5F0 daje 10.14. |
| 7 | Bez kiczu, spójne z `/calculator` | PASS | Ten sam układ dwóch kolumn, nadkreślenie „■ TOOL · 30 SECONDS”, czarna etykieta „Example — type your own”, pola z podkreśleniem, beżowa ramka z suwakiem (porównanie d-calc.png z a-d-top.png). |
| 8 | Jeden następny krok | PASS | Jedno wezwanie do działania, „See a fixed, known-in-advance reward in an app under your brand →” (`/nawyko`). Poza nim jest tylko stopka. |
| 9 | Bez prawdziwych marek | PASS | Na `/lab/reward` nie pada żadna nazwa marki. Na `/nawyko` jest „Tovemi” z oznaczeniem „made-up demo brand”. |
| 10 | `reducedMotion: reduce` | PASS | Całość jest czytelna i statyczna, CTA widoczne po przewinięciu (d-rm-top.png, d-rm-cta.png). Jedynym elementem z opacity < 0.9 jest ukryty region `.rw-live`. |
| 11 | Telefon nie zasłania tekstu | PASS | W ~60 pomiarach (w dół i w górę) prostokąt `.nk-phone` ani razu nie przeciął `.nk-h2` ani `.nk-one`. Najmniejszy odstęp to ~47 px (dół telefonu 271, nagłówek 318). |
| 12 | Płynnie, bez rotacji | PASS | Transformacja to wyłącznie `matrix(s,0,0,s,tx,0)`: skala od 1 do 0.6 i przesunięcie do −89 px, bez obrotu. Przejazd zajmuje 5 ruchów kółka (`--sw`: 0 → .11 → .38 → .69 → .93 → 1), czyli najwięcej ok. 0,31 drogi na jeden ruch, dodatkowo wygładzone przejściem CSS. Powrót w „Under your brand” jest symetryczny. |
| 13 | Wykres w kadrze | PASS | `.nk-chart` ma [24,408 → 366,620] w kadrze 390×844. W najniższym momencie przejazdu dół jest na 803, czyli nad paskiem cookies (n-down-03.png). |
| 14 | Cofanie kółkiem w górę | PASS | Po powrocie do aktu 4 i 1,2 s ustalania: telefon `matrix(1,0,0,1,0,0)` w [93,18,297,440], nagłówek „Every reward…” z opacity 1, identycznie jak na wejściu. W trakcie jazdy telefon nadąża z opóźnieniem przejścia (n-up-end.png: chwilowe przenikanie ekranów), potem dochodzi do właściwego stanu. |

## FAIL

Brak, wszystkie 14 punktów PASS.

## Uwagi (nie blokują, propozycje)

1. **Marża większa od zamówienia.** Pod liczbą pojawia się „Fill in the three fields to see it.”, choć wszystkie trzy pola są wypełnione. Poprawny komunikat stoi niżej, przy polach. Propozycja: przy błędzie zakresu podmienić zdanie pod liczbą na treść tego błędu, np. „Margin can’t be higher than the order value.”. Tekst idzie przez bramkę tekstów.
2. **Suwak liczy w procentach progu (0–200), więc strzałka zmienia koszt o 0,96 i pokazują się ułamki („52.8”, „43.2 left”).** Propozycja: krok w jednostkach waluty (1 albo zaokrąglenie do pełnej liczby) albo zaokrąglanie wyświetlanego kosztu do pełnych jednostek.
3. **Wezwanie do działania na 390 jest poza pierwszym ekranem**, a przed decyzją o cookies przykrywa je pasek zgody. Do rozważenia: krótki link pod zdaniem „Set one fixed reward…”. To zmiana zakresu, więc decyduje Rafał.
4. **Pusty ekran w trakcie przejazdu na `/nawyko`.** Przez ok. 4–5 ruchów kółka (ok. 500 px) widać sam telefon, a pod nim pustą połowę ekranu, bo tekst aktu wchodzi dopiero po przejeździe (n-down-02.png, n-down-06.png). Ruch jest spokojny, ale na telefonie wygląda to jak „nic się nie dzieje”. Propozycja: zacząć `inK` wcześniej, np. `(local - SW_LEN*0.6)` zamiast `(local - SW_LEN - 0.08)` w `app/nawyko/NawykoClient.tsx` (ok. linia 782), żeby nagłówek wjeżdżał razem z końcówką przejazdu. Albo skrócić `SW_LEN`, dbając, by jeden ruch kółka nie przekroczył ok. 0,35 drogi.
