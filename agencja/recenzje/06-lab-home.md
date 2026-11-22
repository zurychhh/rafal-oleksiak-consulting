# Recenzja 06 — /lab/home (propozycja nowej strony głównej)

Recenzent niezależny, 2026-11-22. Sprawdzone: kod `app/lab/home/HomeLab.tsx`, `home.css`; własne pomiary Playwright (1440×900 i 390×844, z ruchem i z `prefers-reduced-motion`), zrzuty w `/tmp/claude-0/rev2/`.

**Werdykt: prawie gotowe. 8 z 9 PASS. Jedyny FAIL: na telefonie trzecia oferta (darmowe narzędzia) jest pod linią zgięcia.**

| # | Kryterium | Wynik | Dowód |
|---|---|---|---|
| 1 | Trzy oferty czytelne w 5 s (1440 i 390) | **FAIL (390)** / PASS (1440) | Na 1440 wszystkie trzy karty mieszczą się w 301–681 px. Na 390 karta narzędzi zaczyna się na 852 px przy ekranie 844 px, więc w pierwszym widoku widać tylko Nawyko i konsulting (narzędzia są jedynie w menu). |
| 2 | Nawyko ma największą wagę | PASS | Karta Nawyko jest pierwsza, ma 555 px szerokości wobec 370 px pozostałych, tło w kolorze i telefon. To też pierwsza pełna sekcja pod hero (scena przewijania). |
| 3 | Oryginalność i efekt „wow” bez kiczu, ruch ma cel | PASS | Każdy ruch coś tłumaczy: seria w aplikacji rośnie do pieczątki w dniu 24, czerwony pasek zamówień przegania datę z etykiety (45 → 69), puste dni między opakowaniami znikają. Paleta jest powściągliwa, bez dekoracji. |
| 4 | Płynnie, bez skoków układu (CLS) | PASS | CLS po pełnym przewinięciu: 0,0062 na desktopie, 0,0047 na telefonie (próg „dobrze” to 0,1). |
| 5 | Wersja statyczna przy ograniczonym ruchu | PASS | Przy `reduce` wszystkie sceny pokazują stan końcowy (dzień 24 z pieczątką, 69 dni, skrócona luka), CLS 0,0002. Drobiazg: na 390 nadal jest mikroprzesunięcie 0,0037 w osi konsultingu. |
| 6 | Klawiatura: skip link, wszystkie linki, widoczny focus | PASS | Pierwszy Tab pokazuje „Skip to content” w rogu (8,8 px) z obrysem 2 px. Wszystkie 22 linki są osiągalne tabulatorem i każdy ma obrys 2 px. |
| 7 | Żadna prawdziwa marka jako użytkownik aplikacji; liczby z obecnej strony albo opisane | PASS | W aplikacji jest tylko fikcyjne „Tovemi”. Prawdziwe marki występują wyłącznie w historii współpracy, tak jak na obecnej stronie. „EUR 2,500 net per month” jest na obecnej stronie. 45/69 mają podpis „a real supplement shop, anonymised”; samych liczb nie znalazłem w kodzie obecnej strony. |
| 8 | Brak błędów w konsoli | PASS | 0 błędów i 0 ostrzeżeń w 4 przebiegach (desktop i telefon, z ruchem i bez). |
| 9 | Brak poziomego przewijania, nic nie jest ucięte ani nie nachodzi | PASS | `scrollWidth` = `clientWidth` (1440/1440 i 390/390). Poza ekranem jest tylko schowany skip link, zgodnie z zamiarem. Drobiazgi wizualne w poprawce 2. |

**Poza tą rubryką (nie sprawdzałem):** zanim strona trafi na `/`, musi przejść `content-rules.test.mjs`. Strona używa liczb 45, 69, 70, 24 i 30, a test przepuszcza tylko liczby z listy `ALLOWED_NUMBERS`. Musi też przejść bramkę tekstów (`agencja/rubryka-tekstow.md`). Ta recenzja dotyczy wyglądu i nie zastępuje recenzji tekstu.

## Poprawki (od najważniejszej)

1. **Telefon: wciągnąć narzędzia nad linię zgięcia.** Przy ≤760 px trzeba zyskać około 120 px, żeby nagłówek karty narzędzi wypadał najpóźniej na ~730 px. Sposoby: mniejszy H1 i lead, mniejsze odstępy w hero, niższa karta Nawyko (mniejszy telefon) i ciaśniejsza oś w konsultingu. Inna droga: na telefonie dwie dolne karty jako zwarty pasek z jedną linijką i ruchomym elementem. Bez tego kryterium „trzy rzeczy w 5 sekund” nie jest spełnione dla większości ruchu.
2. **Dopracować wnętrze telefonu.** W dużym telefonie (scena Nawyko, 1440) liczba „8” i słowo „days” są daleko od siebie, przez co licznik się rozpada. W małym telefonie na 390 napisy „STAMP” i „EARNED” sklejają się w „STAMP EARNED” bez odstępu. Trzeba wyrównać `.lh-count` do linii bazowej z małym odstępem i dać `.lh-pstamp` minimalny `gap`.
3. **Karta narzędzi na desktopie: domknąć scenę liczbą.** Pod paskiem zostaje dużo pustego miejsca, a scena nie mówi, ile dni ubyło. Licznik malejący 24 → 4 dni (tak jak 69 w konsultingu) dałby jej puentę i wyrównał wagę z kartą konsultingu. Warto też pokazać „69” w konsultingu wcześniej: dziś liczba pojawia się dopiero po około 3 s.
