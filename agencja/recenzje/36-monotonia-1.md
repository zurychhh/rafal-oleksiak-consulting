# Bramka monotonii: /nawyko (Acme, #1F6FEB)

Zrzuty: `agencja/podglad/mono-1440-{0..3}.png`, `mono-390-{0..3}.png`, `mono-1440-fin-{1100,2200,3600}.png`. Układy opisane z 1440; na 390 (sprawdzone pomiarem wysokości sekcji, nie każdy zrzut oglądany osobno) wszystko składa się w jedną kolumnę, więc różnice układu znikają, a pozostaje rytm tonów i treści.

| # | Sekcja | Układ | Ton | Reaguje na odwiedzającego | Werdykt |
|---|---|---|---|---|---|
| 1 | hero `#top` | tekst + telefon obok | papier | nazwa i kolor marki, "Reveal without scratching" | żywe |
| 2 | pasek 30 dni | poziomy pasek kwadratów | papier | brak | neutralne (krótki łącznik) |
| 3 | kalkulator `.hg` | trzy pola + duża liczba | papier | wpisywane liczby | żywe, ale to same liczby |
| 4 | `#how` | tekst + lista kroków + telefon po prawej | glina | marka | nudne (szablon "tekst + telefon") |
| 5 | nagrody (suwak dni) | tekst + suwak + telefon po prawej | glina | suwak dnia | nudne, ten sam układ co 4 |
| 6 | "See the day each pack runs out" | histogram + telefon po prawej | glina | brak | nudne (wykres statyczny, ten sam układ) |
| 7 | "Your brand. Your colours." | pola marki + telefon po prawej | glina | nazwa, kolor, styl | żywe treścią, nudne układem |
| 8 | `#loyalty` | bento: 2 kafle + panel | atrament | 5 przycisków + suwak | żywe |
| 9 | `#paths` | tekst + telefon po prawej | papier | "Next lesson" | nudne |
| 10 | `#pharmacy` | telefon po lewej + tekst | glina | "Scan the box" | średnie (lustro układu 9) |
| 11 | `#privacy` | tekst + telefon po prawej | papier | przełącznik zgody | nudne |
| 12 | `#proof` | dwa wykresy-karty | papier | suwak/"knob" kontrolnej | żywe |
| 13 | `#integrations` | siatka 5 kolumn | glina | tylko link | nudne (nic nie robi) |
| 14 | `#never` | przełączniki + telefon po prawej | papier | 3 przełączniki | żywe treścią, układ jak 11 |
| 15 | `#faq` | akordeon | glina | 6 rozwijanych pytań | neutralne |
| 16 | finał `#finale` (przypięta scena 4500 px) | tekst + telefon, tło atrament -> kolor marki | atrament -> kolor marki | scroll (5 kroków), "Reveal without scratching" | żywe, najmocniejszy moment |
| 17 | `#enquiry` + stopka | tekst + formularz | glina | formularz | spokojne zamknięcie |

## Pary łamiące "żadne dwie kolejne w tym samym układzie" (tekst + telefon po prawej)
- 4-5, 5-6, 6-7 (cztery pod rząd: how, nagrody, kiedy kończy się opakowanie, marka; to ten sam układ i ta sama glina)
- 9-10 (lustro, układ ten sam) i 10-11 (lustro)
- 14-16 (finał też tekst + telefon, choć przedzielony FAQ)
- Poza tym 2-3 (pasek + kalkulator, obie "liczby i skala"; granica, nie złamanie).

## Bramki
- Dwie kolejne sekcje w tym samym układzie: **FAIL** (lista wyżej).
- Sekcja poniżej pierwszego ekranu nic nie robi: **FAIL** dla #integrations (tylko link); #6 histogram statyczny.
- Treść się powtarza: **FAIL**: telefon z ekranem "Stamp earned / ACME-NEXT-K7Q4" i listą nagród pojawia się w #how, w kafelku marki i (kod) w finale; dziesięć telefonów na stronie.
- Finał najmocniejszym momentem: **PASS**: pełny kolor marki i kod "AC-NEXT24" (zrzut mono-1440-fin-3600). Uwaga: po nim cicha, blada forma, a przypięta scena ma ~600 px martwego przewijania na ostatnim kroku; na zrzucie pełnostronicowym widać ogromny pusty atrament.
- Mniej niż trzy tony: **PASS** (papier, glina, atrament, kolor marki = 4). Kolor marki na pełnej powierzchni tylko w finale i panelu #loyalty.
- Dwie sekcje z samych liczb pod rząd: **PASS** (pasek 30 dni to kwadraty, kalkulator to liczby, granica).
- Pierwszy ekran pokazuje aplikację: **PASS** (telefon w hero).

**Werdykt całości: FAIL.** Główna przyczyna: środek strony (4-7 i 9-11) to jeden powtarzany szablon tekst + telefon; #loyalty to jedyny prawdziwy przełom układu między hero a finałem. Rekomendacja: zamienić 6 na układ pełnoszeroki (histogram jako scena), 9-11 przetasować (jeden bento, jeden pełnoszeroki pas koloru marki), zostawić #integrations tylko jeśli zyska interakcję (wybór sklepu podświetla pasujące narzędzia).
