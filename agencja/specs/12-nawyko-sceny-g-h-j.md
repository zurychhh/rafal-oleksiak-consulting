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
