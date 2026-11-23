# Recenzja 14 — mini-kalkulator w hero (`.hg`, `/nawyko`, `/lab/home`)

Recenzent niezależny, 2026-11-23. Źródła: `app/calculator/HeroGap.tsx`, `hero-gap.css`, spec `agencja/specs/08-mini-kalkulator-hero.md`.
Metoda: Playwright, 390×844 i 1440×900, oba adresy, przewijanie kółkiem 120 px / 60 ms od góry do bloku; skrypty i zrzuty w `/tmp/claude-0/rev/` (`hg.js`, `kb.js`, `kb2.js`, `*-block.png`, `kb2-*.png`).

**Werdykt: blok działa poprawnie (rachunek, przypadki brzegowe, brak NaN, CLS 0, kontrast, reduced-motion). Do poprawki przed wydaniem: fokus pod paskiem cookies na 1440, „1 days”, i dublowanie z kartą „Free tools” na `/lab/home`.**

| # | Punkt | Wynik |
|---|---|---|
| 1 | Test 10 sekund | 390: PASS · 1440: PASS z zastrzeżeniem |
| 2 | Każde pole zmienia wynik, przypadki brzegowe, CLS | PASS (jeden błąd tekstu: „1 days”) |
| 3 | Rachunek | PASS |
| 4 | Klawiatura, fokus, pasek cookies | 390: PASS · 1440: FAIL |
| 5 | Kontrast ≥ 4,5:1 | PASS |
| 6 | prefers-reduced-motion | PASS |
| 7 | Liczby jako fakt, prawdziwe marki | PASS |
| 8 | Dublowanie w hero | `/nawyko`: wnosi wartość · `/lab/home`: częściowo zbędny |

## 1. Test 10 sekund (właściciel marki FMCG)
- **390 × 844 (oba adresy):** nagłówek „What the empty shelf costs you”, dwa pola, pod nimi pasek, a pod paskiem duża czerwona kwota +448,000. Kolejność czytania pasuje do pytań: o czym to jest, co z tego mam, gdzie kliknąć. Etykieta „Example — type your own” jest bezpośrednio pod polami, więc da się ją zobaczyć, zanim wzrok trafi na kwotę. Link „Run the full calculator →” jest widoczny nad paskiem cookies (link y=412–432 na /nawyko, pasek od y=766). **PASS.**
- **1440 × 900:** pola są po lewej, kwota po prawej (78 px). Wzrok idzie najpierw na kwotę, a etykieta przykładu (11 px, szara, wersaliki) jest daleko od niej, za polem przychodu. Przez pierwsze sekundy kwota wygląda więc jak obietnica, a nie jak przykład. Pola mają tylko podkreślenie, bez ramki i kursora tekstowego, więc nie wyglądają na pola do wpisania. Jedyne CTA to mały link tekstowy (14 px). Na /nawyko blok zaczyna się na y≈715, czyli kwota i link są na samym dole pierwszego ekranu (link y=867–887). **PASS z zastrzeżeniem.**

## 2. Pola i przypadki brzegowe (identycznie na 4 widokach)
Liczba wierszy z wynikiem `NaN`: 0. Rozmiar bloku przy każdym wpisaniu się nie zmienia: wysokość 312 px (390) i 173 px (1440), pozycja linku też stała. **CLS mierzony PerformanceObserverem podczas 22 kolejnych wpisań: 0.000 na wszystkich czterech widokach.** CLS przy przewijaniu z rozruchu strony: 0.0003 / 0.0055 / 0.0000 / 0.0017 (wszystkie ≤ 0.01). Brak przewijania w poziomie (`scrollWidth − innerWidth = 0`), a liczba 999,999,999,999 mieści się w kolumnie (przepełnienie 0 px).

| Wejście | Wynik | Podpowiedź / podpis |
|---|---|---|
| odstęp 30 | — | „No empty shelf: they already reorder within 30 days.” |
| odstęp 31 | +16,000 | **„1 days without your product”** (błąd gramatyczny) |
| odstęp 365 | +5,360,000 | 335 days |
| odstęp 366 | — | „Days between orders: 365 at most.” |
| odstęp puste / „abc” | — | „Days between orders: type a number.” |
| odstęp „1.5” | — | zaokrąglone do 2, „no empty shelf” (sensownie) |
| odstęp „4,000” | — | „365 at most.” |
| przychód 0 / „abc” / puste | — | „Repeat revenue: type a number above zero.” |
| przychód „4,000” (odstęp 60) | +4,000 | poprawnie odczytane jako 4000 |
| przychód „1.5” (odstęp 60) | +1 | zaokrąglone 1,5 (formalnie poprawne) |
| przychód 999 999 999 999 | +999,999,999,999 | mieści się |
| przychód 1 000 000 000 001 / 20 cyfr | — | „that number is too large.” |

Każde z dwóch pól zmienia wynik (odstęp 58→60: 448k→480k; przychód 480k→4k: wynik 480k→4k). Etykieta przełącza się na „Your numbers”, a po przywróceniu wartości startowych wraca do „Example — type your own”. **PASS.**

## 3. Rachunek: przychód × (odstęp/30 − 1)
- 480 000 × (58/30 − 1) = 448 000 → na ekranie +448,000 ✔
- 100 000 × (45/30 − 1) = 50 000 → na ekranie +50,000 ✔
- 100 000 × (90/30 − 1) = 200 000 → na ekranie +200,000 ✔
- dodatkowo: 480 000 × (31/30 − 1) = 16 000 ✔; 480 000 × (365/30 − 1) = 5 360 000 ✔; 480 000 × (60/30 − 1) = 480 000 ✔.
**PASS.**

## 4. Klawiatura
Tab z elementu poprzedzającego („See it work” / „Price one day between orders”) przechodzi kolejno: pole odstępu → pole przychodu → link. Pierścień fokusu ma 2 px, kolor #14161A i odstęp 3 px (widoczny na zrzucie `kb2-_nawyko-1440.png`). Oba pola mają etykiety `<label>`.
- **390: PASS.** Żaden element nie wchodzi pod pasek (na /lab/home pola są na y=402–442, link na 651–671, a pasek od 766).
- **1440: FAIL.** Pasek cookies (wysokość 57 px, od y=843) pojawia się dopiero po pierwszym przewinięciu. Przeglądarka przewija element z fokusem tylko do dolnej krawędzi okna. Na `/lab/home` pola z fokusem lądują na y=847–896, czyli całe pod paskiem. Na `/nawyko` link ląduje na y=867–887, również pod paskiem. Brakuje `scroll-padding-bottom` (albo `scroll-margin-bottom` na `.hg`) równego wysokości paska.

## 5. Kontrast (getComputedStyle, tło #F7F5F0)
Nagłówek 16.62 · etykiety pól, „days”, **„Example — type your own” (11 px) 6.25** · wartości pól 16.62 · „30-day pack” 6.25 · **czerwony podpis „28 days without your product” (#9E161F, 600) 7.45** · **kwota #D6202B 4.70** (tekst duży, granica 3:1, a i tak powyżej 4,5) · „a year in your currency…” 10.14 · link 16.62.
Czerwony kreskowany pasek nie zawiera tekstu (`aria-hidden`). Element graficzny ma kolor #D6202B na tle, czyli 4.70, powyżej progu 3:1. **PASS.**

## 6. prefers-reduced-motion
Bez ustawienia `.hg-gap` ma transition 0.35s. Przy `reducedMotion: 'reduce'` liczba elementów `.hg` z niezerowym transition albo animacją wynosi 0 na wszystkich czterech widokach. **PASS.**

## 7. Liczby i marki
Wartości startowe są oznaczone „Example — type your own”, a przy kwocie stoi „A ceiling, not a forecast.” Liczba 30 dni jest podana na ekranie jako założenie („30-day pack”). W bloku nie ma żadnej liczby rynkowej podanej jako fakt ani żadnej marki. Drobna uwaga: komunikat `aria-live` („Plus 448,000 a year…”) nie mówi, że to przykład, więc czytnik ekranu podaje kwotę bez tego zastrzeżenia. Poza blokiem, na makiecie telefonu, jest nazwa „TOVEMI” (z kodu `HomeLab.tsx` / `NawykoClient.tsx`). Nie sprawdzałem, czy taka marka istnieje, bo to poza zakresem tej recenzji. **PASS.**

## 8. Dublowanie
- **/nawyko:** w hero nie ma żadnej innej kwoty. Blok dokłada odpowiedź na pytanie „ile to dla mnie znaczy” i łączy się z paskiem „One pack, 30 days” tuż nad nim. **Wnosi wartość.**
- **/lab/home:** tuż nad blokiem jest karta „Free tools” z tym samym paskiem („Pack in use / Days without the product”) i linkiem „Price one day between orders” do tego samego `/calculator`. W rezultacie są dwa paski i dwa linki do tego samego miejsca, jeden pod drugim (zrzut `lh1440-block.png`). Mini-kalkulator wnosi własną kwotę, ale pasek w karcie jest teraz zbędny. **Częściowo zbędny.**

## Poprawki (ranking)
1. **Fokus pod paskiem cookies na 1440.** Dodać `scroll-padding-bottom` na `html`, równy wysokości paska cookies (≈ 60 px na desktopie, 80 px na telefonie, a najlepiej zmienna CSS ustawiana przez baner), albo `scroll-margin-bottom` na `.hg input, .hg a`.
2. **„1 days” → „1 day”.** Liczba pojedyncza w `.hg-cap`, gdy `empty === 1`.
3. **Etykieta przykładu przy kwocie na desktopie.** Przenieść „Example — type your own” nad kwotę albo dopisać „Example:” w `.hg-why`, gdy `!own`. Dopisać „example” także do komunikatu `aria-live`.
4. **/lab/home: usunąć dublowanie.** Zostawić jeden pasek i jeden link do `/calculator`: albo karta „Free tools” traci pasek i link „Price one day…”, bo mini-kalkulator je zastępuje, albo karta odsyła do bloku. Zmiana dotyczy zawartości widocznej dla klienta, więc decyzja należy do założyciela.
5. **Pola mają wyglądać na edytowalne.** Delikatne tło albo ramka, ikona edycji albo kursor tekstowy przy pierwszym widoku. Na 1440 można dodać wyraźniejsze CTA zamiast samego linku 14 px.
