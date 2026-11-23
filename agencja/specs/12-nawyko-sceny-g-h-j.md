# Spec 12 — /nawyko, runda 4: sceny (g) dowód wyników, (h) pas integracji, (j) FAQ kupującego

Wzór: spec 11 (układ `nk-still`, wrapper `nk-r4`). Komponenty `Evidence` (g, h) i `Faq` (j) w `app/nawyko/NawykoClient.tsx`,
CSS na końcu `app/nawyko/nawyko.css`. Marka pokazowa `DEMO_BRAND` (Tovemi) albo nazwa wpisana przez odwiedzającego. Treść po angielsku.
Kolejność: … `#privacy` → `#proof` → `#integrations` → „What it never does” → `#faq` → `#enquiry`. Wjazd z nagłówka ≥1200 px: Proof, FAQ.

## Sceny
- **(g) `#proof`** — „For you · Proof of results”. Panel wyników: 24 kropki-klienci, suwak „Customers held out as control” (2–12 z 24)
  zmienia kropki (pełne = z aplikacją, puste = kontrolna) i szerokość zakresów przy dwóch krzywych „Still reordering” (M0–M6).
  Wynik słowny: zakresy rozdzielone / nakładają się. Obok rysunek „When the pack really runs out”: kropka = ostatni ptaszek jednego
  telefonu, linia „Label: 30 days”, szczyt wyróżniony. Oba rysunki mają znaczek „Example” w nagłówku rysunku. Zero procentów.
- **(h) `#integrations`** — jeden pas pięciu komórek: Shopify, aplikacje subskrypcji, aplikacje lojalności, e-mail/CRM, App Store
  i Google Play. Nazwy platform tylko tekstem, aplikacje subskrypcji/lojalności jako kategoria; podpis: konkretna aplikacja
  ustalana w pierwszej rozmowie (bez twierdzenia gotowych integracji).
- **(j) `#faq`** — 6 pytań w natywnych `<details>/<summary>` (klawiatura, bez JS). Wdrożenie bez terminów i cen.

## Kryteria akceptacji
1. Nagłówek ≤ 12 słów, korzyść marki na początku, plus jedno zdanie; `copy-voice.test.mjs` zielony; zero „I/we/our”, zero „unlock”.
2. Każda liczba i krzywa w (g) ma „Example” przy samym rysunku; żadnego wyniku podanego jako fakt; zero prawdziwych marek.
3. Bez JS i w `prefers-reduced-motion` stan domyślny kompletny (6 z 24 w kontroli, obie krzywe, wykres zużycia, FAQ zwinięte i
   rozwijalne); ruch tylko kolor/`transform` (znak +/− FAQ), bez zmian wysokości poza natywnym `<details>`.
4. Kontrolki: natywny suwak z `aria-valuetext`, `<summary>`; wynik suwaka w `aria-live`; rysunki SVG `role="img"` z `<title>`.
5. Build, `tsc`, lint (0 błędów, 1 ostrzeżenie jak przed zmianą), `qa.js /nawyko --scroll` PASS (9 szerokości, kontrast w Paper),
   `content-rules --url` PASS; Night sprawdzony na zrzutach.
6. Zrzuty `agencja/podglad/nawyko-r4-{proof,integrations,faq}-{390,1440}.png` (+ `-night`, `proof-*-held2` po przesunięciu suwaka,
   `proof-390-runout`).
7. Teksty w `agencja/teksty-do-akceptacji.md` (sekcja „R4 przebieg 2”, status „nowy”).

## Pomiar CLS przy wejściu na kotwice (23.11, poprawki po recenzji 21)
- Kliknięcie linku w nawigacji (1440: Proof, FAQ): **CLS 0,000**.
- Wejście adresem z kotwicą (`/nawyko#proof|#integrations|#faq`), przed i po tym przebiegu bez zmian: 390 → 1,08 / 0,79 / 1,04;
  1440 → 0,33 / 1,09 / 0,37. Te same skoki są na kotwicach sprzed tego przebiegu: `#privacy` 0,46 (390) i 0,28 (1440), `#cashback` 1,0 (390).
- **Przyczyna (sprzed przebiegu):** `Scene` renderuje na serwerze układ statyczny (`mode='still'`, akty jako sekcje `nk-still`)
  i po hydratacji przełącza się na scenę przypiętą (`setMode('scroll')`), co zmienia wysokość wszystkiego nad kotwicą; przeglądarka
  przewinęła już do kotwicy, więc sekcja ucieka z kadru. Źródła z PerformanceObserver: `#more`, `#evidence`, `#privacy`, `.nk-never`.
- **Nie ruszone:** poprawka wymaga stałej rezerwy wysokości sceny przypiętej w HTML z serwera albo zmiany momentu przełączenia trybu —
  dotyka sceny głównej i wszystkich jej trybów (bez JS, reduced-motion, niskie okno). Osobne zadanie z własną bramką.
- Kontrast przypisu `#integrations` (`--dim` na `--tint`, zmierzone obliczone kolory): Paper 5,66:1, Night 6,71:1; link 15,06 / 14,63.
