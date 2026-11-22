# Recenzja 04 — /calculator v2 (oraz ponowna kontrola /nawyko)

Data: 2026-11-22. Recenzent niezależny (nie budował). Środowisko: `http://localhost:3000`, Playwright/Chromium headless,
1440×900 oraz 390×844 (isMobile, hasTouch, DPR 2). Formularza nie wysyłano, źródeł nie zmieniano.
Zrzuty i surowe wyniki: `/tmp/claude-0/-home-claude/442e9b8a-b85d-5e6c-b220-1e00cead363f/scratchpad/review2/` (`d.json`, `m.json`, `*.png`).

## Werdykt

**/calculator v2: do wydania po dwóch poprawkach treści/logiki (D1, D2).** Technicznie strona jest czysta: brak NaN, brak
przepełnień, zero żądań innych niż GET, CLS praktycznie zero, klawiatura i reduced-motion działają. Słaby punkt jest
merytoryczny: liczba **nie wynika wprost z paska roku** (pasek liczy całe zamówienia, liczba ułamki), a zastrzeżenie
„wynik to górna granica” jest schowane w zwiniętej sekcji.

**/nawyko: 3 z 3 poprzednich usterek naprawione co do zasady, jedna tylko częściowo** — suwak i pole nazwy są osiągalne
klawiaturą wyłącznie przez Shift+Tab (wstecz), nie przez Tab.

---

## CZĘŚĆ A — /calculator

### Rubryka

| # | Kryterium | Wynik | Dowód (jedna linia) |
|---|---|---|---|
| 1 | Oryginalność | PASS | Pasek „jeden klient, 365 dni” z kreskami zamówień to własny pomysł, nie szablon kalkulatora ROI. |
| 2 | Zrozumiałe w 5 sekund | PASS (z uwagą) | Pytanie → 3 pola → czerwona liczba „Extra revenue a year”; uwaga: nagłówek pyta o „one day”, a liczba pokazuje 8 dni (D3). |
| 3 | Zero kiczu | PASS | Papier, tusz, jedna czerwień tylko na wartości zmierzonej; brak gradientów, ikon, konfetti. |
| 4 | Płynność | PASS | 158–163 klatek podczas przesuwania strzałkami: maks. 17 ms, zero klatek > 34 ms (oba viewporty). |
| 5 | Brak przesunięć układu | PASS | CLS bez wejścia użytkownika: 0,0004 (desktop), 0 (mobile) po ~30 s pisania i przesuwania. |
| 6 | Reduced motion | PASS | `reducedMotion: reduce`: liczba od razu końcowa (4 próbki co 40 ms identyczne), zero aktywnych transition/animation w `.gc`. |
| 7 | Klawiatura | PASS | Tab: skip → logo → Talk it through → 3 pola → suwak → CTA → Measure it → How this is counted → stopka; wszędzie outline 2 px; strzałki/Home/End działają. |
| 8 | Brak prawdziwych marek | PASS | Na stronie tylko „Rafał Oleksiak”, „Oleksiak Consulting”, „Nawyko” (własne). |
| 9 | Żadna liczba jako fakt bez źródła | PASS (warunkowo) | „EXAMPLE — TYPE YOUR OWN” widoczne do pierwszej edycji pola (przesuwanie suwaka go nie zdejmuje); ale po edycji wynik jest górną granicą bez widocznego zastrzeżenia (D2). |
| 10 | Nie przegadane | PASS | 109 słów w `<main>` (w tym ~11 niewidocznych z regionu aria-live), 132 na całej stronie ze stopką. |
| 11 | Liczba widocznie wynika z paska | **FAIL** | Przykład: cel 53–57 dni → pasek „6 → 6 orders”, a liczba +52 995 … +284 971 (5 z 29 pozycji suwaka); 365→183 dni: „1 → 1 orders” przy +99 bln. |

### Co sprawdzono i wynik

- **Arytmetyka (zgodna):** 4 000 × 120 × (365/50 − 365/58) = 483 310 → na ekranie `+483,310`. 12 500 × 89,5 × (365/30 − 365/45) = 4 537 153 → `+4,537,153`. Min. suwaka 29 dni: `+3,020,690` (zgodne).
- **Pola:** „4,000” i „4 000” → 4 000; „0”, „abc”, „999999999”, puste → kreska „—”, podpowiedź słowna („more than zero”, „digits only”, „100,000,000 at most”, „365 at most”, „7 or more”), suwak wyłączony. Nigdzie NaN/Infinity/undefined. `scrollWidth == innerWidth` w każdym stanie.
- **Skrajnie duże wartości:** 100 000 000 × 1 000 000, 365 dni → `+99,453,551,912,568` mieści się (390 px: 340 z 342 px).
- **Sieć:** zero żądań innych niż GET podczas pisania i przesuwania (oba viewporty). **Konsola:** zero błędów.
- **Pierwszy ekran 390×844 bez banera:** pola 251–326, liczba 391–445, suwak 526–566, pasek 594–710, CTA 743–791 — wszystko bez przewijania.
- **Pierwszy ekran 390×844 z banerem cookie: NIE ZWERYFIKOWANE.** Baner nie wyrenderował się w kontekście mobilnym w 4,5 s (na desktopie się pojawia, zajmuje ok. 843–900 px i niczego nie zasłania). Do sprawdzenia ręcznie na telefonie: czy zasłania CTA (743–791) albo pasek.
- **CTA:** `<details>` otwiera formularz (store, email, 2 zgody — żadna domyślnie zaznaczona, Send). Jeden link do `/tool`. „How this is counted” zwinięte.
- **Zrzuty w 3 pozycjach suwaka (29 / 44 / 58 dni):** układ stały, liczba nie zmienia szerokości kontenera, czerwone kreski dochodzą z prawej.

### Usterki (A)

- **D1 (wysoka) — liczba nie wynika z paska.** Pasek liczy całe zamówienia w roku (floor), liczba — średnią z ułamkami. W 5 z 29 pozycji przykładu pasek mówi „bez zmiany”, a liczba rośnie do 285 tys. Poprawka: pokazać na pasku ułamek (np. podpis „6.3 → 6.9 orders a year” albo częściowa kreska na końcu roku) albo liczyć liczbę z tych samych całych zamówień.
- **D2 (wysoka) — górna granica podana jak wynik.** „It assumes every repeat customer shifts… real results are a fraction of this” jest tylko w zwiniętym „How this is counted”. Po wpisaniu własnych liczb etykieta zmienia się na „Your numbers” i +3 mln wygląda jak prognoza. Poprawka: jedno widoczne zdanie pod liczbą („If every repeat customer moved to this gap — the ceiling, not a forecast”).
- **D3 (średnia) — pytanie i odpowiedź się rozmijają.** H1: „What is one day between orders worth?”, a ekran nie pokazuje wartości jednego dnia, tylko wybranych N dni. Poprawka: dodać „≈ X per day shorter” przy „−8” albo zmienić H1.
- **D4 (niska) — „1 orders”.** Liczba pojedyncza: „Today 1 orders”, „1 → 1 orders”. Poprawka: `order`/`orders` zależnie od liczby.
- **D5 (niska) — obrys fokusu suwaka nachodzi na podpisy końców** („29 days”, „58 days · today”) — widać na obu viewportach. Poprawka: `outline-offset` mniejszy albo `margin-top` podpisów +6 px.
- **D6 (niska) — przy odstępie 7 dni suwak jest wyłączony, a tekst mówi „Drag left.”** Poprawka: osobny komunikat („7 days is the shortest gap this counts”).
- Kosmetyka: brak jednostki przy liczbie (wyjaśnienie „currency is whatever you typed” tylko w zwiniętej sekcji) — akceptowalne, do decyzji.

---

## CZĘŚĆ B — /nawyko (1440×900, ponowna kontrola trzech usterek)

| # | Poprzednia usterka | Wynik | Dowód |
|---|---|---|---|
| 1 | Niewidoczny tekst skip-linku na fokusie | **PASS** | Na fokusie: kolor `rgb(247,245,240)` na tle `rgb(20,22,26)` (kontrast ok. 16:1), pozycja 8,8, 146×45 px. |
| 2 | Akty 5–7 nieosiągalne klawiaturą | **CZĘŚCIOWO** | `nav.nk-acts` ma 7 przycisków; klik i Enter na „Rewards by day”, „Brand view”, „Your name” przełącza akt (aria-current, właściwy panel, scrollY 4733 / 5607 / 6482). Ale **Tab do przodu nie prowadzi do suwaka ani pola nazwy** — idzie do kolejnych przycisków, potem do formularza poniżej, co przewija stronę i zmienia akt. Suwak osiągalny tylko Shift+Tab ×5 (potwierdzone, akt się nie zmienia); pole nazwy Shift+Tab ×10 (wywnioskowane z kolejności, nie domknięte w teście). |
| 3 | Pasek postępu/notatki skaczą między aktami | **PASS** | `.nk-bar` top = 827 px, `nav.nk-acts` top = 788,1 px — identyczne w aktach 1–7. |
| + | Pole „Brand name” przemianowuje telefon | **PASS** | Po wpisaniu „[nazwa testowa]”: widoczny „[nazwa testowa]” w scenie telefonu, wszystkie kody kuponów `[nazwa testowa]-NEXT-K7Q4`. |
| + | CLS przy przewinięciu całej strony | **PASS** | CLS = 0,0098 (51 drobnych przesunięć, największe 0,001; wysokość strony 9608 px). Konsola: zero błędów. |

### Usterka (B)

- **D7 (średnia) — kolejność fokusu w scenie jest odwrócona.** Panel aktu stoi w DOM przed `nav.nk-acts`, więc po wybraniu aktu trzeba cofać się Shift+Tab; Tab do przodu wyprowadza ze sceny i zmienia akt. Poprawka: w `go(i)` przenieść fokus na pierwszą kontrolkę (albo nagłówek z `tabIndex=-1`) nowego panelu, albo umieścić `nav` w DOM przed panelem.

---

## Ograniczenia tej recenzji

- Budżet 5 minut; przekroczono limit ok. 12 wywołań narzędzi o kilka (dodatkowy przebieg na baner mobilny i suwak aktu 5).
- Nie zweryfikowano: pierwszy ekran mobilny z banerem cookie; przeciąganie suwaka palcem (testowano klawiaturą); prawdziwe urządzenie; Safari/Firefox.
- Płynność mierzona w headless Chromium na serwerze deweloperskim — to dolna granica wiarygodności, nie pomiar na telefonie.
