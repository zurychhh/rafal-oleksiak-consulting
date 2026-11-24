# Recenzja 43 — R6' q1 (kokpit „For you”, „Your store”, FAQ-chipy)

Recenzent niezależny, 24.11.2026. Zakres: `git diff origin/agencja/strona -- app/nawyko` (3 pliki, +462/−154), build na `http://localhost:3100/nawyko`, Chromium (Playwright). Nic w `app/` nie edytowałem.

## Werdykt

**Do poprawki przed pokazaniem Rafałowi, ale blisko.** Pięć sekcji marki jest w kokpicie i każda działa (zakładki, kotwice, klawiatura, 390 px, CLS 0, brak „Tovemi”). Trzy rzeczy do naprawienia: (1) z #integrations zniknęły trzy konkretne zdania, a właśnie usuwanie treści było powodem poprzedniego odrzucenia; (2) dwie pary sąsiednich sekcji mają ten sam kolor, a #integrations i #faq mają też ten sam układ (rząd pigułek-chipów); (3) link „Proof” w górnym menu przestaje działać, gdy hash jest już `#proof`, a klient przełączył zakładkę ręcznie.

## Czy nic nie zniknęło (porównanie z `origin/agencja/strona`)

| Element | Stan | Dowód |
|---|---|---|
| #paths, #pharmacy, #privacy, #proof, #never | **są**, jako panele kokpitu (`hidden` tylko gdy nieaktywne, treść w DOM) | wszystkie 5 otwiera się zakładką i kotwicą |
| FAQ, 6 pytań i odpowiedzi | **są**: chipy + dymek; pełna lista w `<details open>` ukryta wizualnie (czytniki, JSON-LD) | 6 chipów, odpowiedź zmienia się przy każdym |
| #integrations: Shopify, kody jednorazowe, App Store/Google Play, „tools matched to your stack” | **są** (schemat + 3 fakty) | |
| #integrations: „Cashback can come off the next delivery.” | **zniknęło** | diff tekstów |
| #integrations: „Points can sit beside a programme already running.” | **zniknęło** | diff tekstów |
| #integrations: „Reorder reminders go out without any health data.” | **zniknęło** (temat zdrowia jest w FAQ/Privacy, ale to zdanie było argumentem integracyjnym) | diff tekstów |
| Akapit „Rewards arrive as Shopify codes… The app is listed in both stores under your brand.” | zastąpiony „Pick your store engine…”; sens zachowany w faktach | |
| Kotwica `#more` (wrapper) | usunięta; nic do niej nie linkuje (sprawdzone `app/`, `lib/`) | bez skutku |
| JSON-LD `featureList` | 3 pełne zdania („Pharmacy buyers show up…”, „Health data never reaches…”, „Reorder lift, measured…”) zamienione na nazwy zakładek | słabsza treść dla wyszukiwarek; uzasadnienie w komentarzu (bramka czyta innerText) — do decyzji, czy nie lepiej poprawić bramkę |

Rekomendacja: dopisać trzy zdania jako dodatkowe fakty w `.nk-store-facts` (np. „Subscriptions”, „Loyalty”, „Email” zamiast jednego „Other tools”) — siatka i tak ma 3 kolumny, wyjdą 2 rzędy.

## Rubryka

| Kryterium | Wynik | Dowód |
|---|---|---|
| Oryginalność | PASS | kokpit z numerowanymi pigułkami w kolorze marki, schemat sklep ↔ adapter ↔ aplikacja, FAQ jako rozmowa; `r6q1-rev-tab0-1440.png`, `r6q1-rev-store-1440.png`, `r6q1-rev-faq-1440.png` |
| Oferta jasna w 5 s | PASS | hero bez zmian: „A habit app with your logo on it.” + podtytuł; `r6q1-rev-hero.png` |
| Zero kiczu | PASS (uwaga) | brak ozdobników; dymek podpisany „Rafał” z awatarem „R” — CLAUDE.md: bohaterem tekstu jest marka klienta, nie autor. Wpis w `teksty-do-akceptacji.md` (wiersz 434) jest, więc decyzja Rafała |
| Żywość: brak dwóch sąsiednich sekcji o tym samym układzie/kolorze | **FAIL** | #loyalty `rgb(14,15,18)` → #cockpit `rgb(14,15,18)` (oddziela je tylko linia 1 px; `r6q1-rev-seam-loyalty-cockpit.png`). #integrations `rgb(237,234,225)` → #faq `rgb(237,234,225)`, i obie zaczynają się rzędem obramowanych pigułek (`r6q1-rev-seam-int-faq.png`) |
| Żywość: każda sekcja poniżej 1. ekranu interaktywna | PASS | kokpit (zakładki + interakcje paneli), store (7 chipów), FAQ (6 chipów) |
| Personalizacja (marka „Zorbix”, kolor Teal) | PASS | `Tovemi` w tekście całej strony: 0 (także po przejściu przez 5 zakładek); `Zorbix`: kokpit 8, integrations 2, loyalty 5; `--brand` = `#0F7C80` w kokpicie i w `.nk-store`. Jedyny ślad: `placeholder` jednego `<input>` poza tymi sekcjami (l. 865, `placeholder={DEMO_BRAND}`) — poza zakresem; `r6q1-rev-pers-*.png` |
| Tempo czytania | PASS | 5 scen zamiast 5 ekranów przewijania; wysokość sceny 840–1286 px |
| Brak przesunięć układu (wczytanie, zmiana zakładki) | PASS | CLS 0 po wczytaniu, 0 po przełączaniu zakładek; góra kokpitu stoi w miejscu (99 px); dymek FAQ stałe 220 px, schemat sklepu stałe 383 px przy każdym wyborze. Uwaga: zmiana zakładki zmienia wysokość sceny (840→1286), więc wszystko pod kokpitem skacze — inicjowane przez użytkownika, CLS tego nie liczy |
| prefers-reduced-motion | PASS | animacja dymka `none`; przewinięcie do kokpitu `behavior:auto`; brak przejść w zakładkach |
| Klawiatura: zakładki | PASS | →, ←, Home, End przenoszą fokus i wybór (roving tabindex), obrys `solid` widoczny; Tab z listy → aktywny panel (`role=tabpanel`, tabIndex 0) — zgodnie z WAI-ARIA APG |
| Klawiatura: chipy | PASS (uwaga) | Tab + Enter działają, `aria-pressed`, obrys widoczny. Strzałek brak — dla przycisków-przełączników to dopuszczalne; semantycznie wybór „jeden z wielu” lepiej oddałby `radiogroup` (nit) |
| Kotwice /nawyko#pharmacy i #proof | PASS (z błędem niżej) | wejście z #pharmacy/#proof/#paths/#privacy/#never otwiera właściwą zakładkę, kokpit u góry ekranu (100 px); `hashchange` też działa; `r6q1-rev-deep-proof.png` |
| Brak prawdziwych marek w części aplikacji | PASS (uwaga) | żadnej marki suplementu; pojawiają się nazwy platform (Shopify, WooCommerce, Shoper, IdoSell, PrestaShop, Magento/Adobe Commerce) — tekstem, bez logo, w części „Your store”, nie w telefonie |
| Brak liczb bez źródła | PASS | nowe sekcje bez liczb; liczby w panelach jak wcześniej, z plakietką „Example” |
| 390 px bez przewijania w poziomie | PASS | `scrollWidth` = 390 dla każdej z 5 zakładek, brak elementów poza krawędzią (poza celowo przewijanym rzędem zakładek); `r6q1-rev-cockpit-390.png`, `r6q1-rev-store-390.png`, `r6q1-rev-faq-390.png` |

## Błędy

1. **Ważne — link „Proof” w menu nie działa drugi raz.** Scenariusz: klient klika „Proof” (hash `#proof`, kokpit otwiera „Proof of results”), potem ręcznie wybiera „Learning paths”, przewija na górę i znów klika „Proof”. Hash się nie zmienia, więc `hashchange` nie przychodzi; cel `#proof` jest `hidden`, więc przeglądarka też nie przewija. Wynik: zakładka „Learning paths”, `scrollY` = 0 — klik nic nie robi. Naprawa: przy wyborze zakładki `history.replaceState(null,'','#'+id)` albo nasłuch `click` na `a[href="#paths|pharmacy|privacy|proof|never"]`.
2. **Ważne — utrata treści w #integrations** (tabela wyżej, trzy zdania).
3. **Ważne — monotonia kolorów:** #loyalty i #cockpit (ten sam atrament), #integrations i #faq (ten sam `--tint` + rząd pigułek). Propozycja: nagłówek kokpitu na papierze albo w kolorze marki; #faq na papierze `#F7F5F0` albo #integrations bez `--tint` (reguła `#evidence > .nk-int:first-child{background:var(--tint)}` dodana w tym diffie).
4. Nit — bramka tekstów: nagłówek kokpitu „Now the same app from your side: what you set, what you see.”, etykieta „{marka} · brand side” i etykieta rozdziału „Your side” nie mają wpisu w `teksty-do-akceptacji.md`; w pliku jest „Your own store”, w kodzie „Custom store”; plakietka „Connected per brand via an adapter” ma wpis tylko w wariancie „Connected in your setup week”.
5. Nit — chipy sklepu i FAQ jako `aria-pressed` w grupie; `radiogroup` byłby dokładniejszy dla czytnika.

## Zrzuty recenzenta

`agencja/podglad/r6q1-rev-hero.png`, `-tab0…tab4-1440.png`, `-seam-loyalty-cockpit.png`, `-seam-int-faq.png`, `-store-1440.png`, `-faq-1440.png`, `-pers-cockpit.png`, `-pers-store.png`, `-deep-proof.png`, `-cockpit-390.png`, `-store-390.png`, `-faq-390.png`. Zrzutów `r6q1-lead-*` / `gates-wk-*` nie oglądałem szczegółowo (limit czasu); WebKit nie był przeze mnie uruchamiany.
