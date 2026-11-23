# Narzędzia w ramach USP (FMCG, powtarzalny zakup)

Zasada cyklu: jedno pytanie, jeden ekran, liczby wyłącznie z pól odwiedzającego, wynik w 30 s, jeden krok dalej.
Bohaterem jest marka odwiedzającego. Kolejność = proponowana kolejność budowy (propozycja, decyzja Rafała).

| # | Pytanie narzędzia | Co odwiedzający wie po 30 s | Do czego prowadzi | Status |
|---|---|---|---|---|
| 1 | What can a loyalty reward cost and still pay off? | Najwyższy roczny koszt nagród na klienta, przy którym nagroda się zwraca (marża × dodatkowe zamówienia), i czy jego pomysł na nagrodę się mieści. | `/nawyko` — stała, znana z góry nagroda w aplikacji pod jego marką | **zbudowane w podglądzie `/lab/reward`** (spec 07) |
| 2 | What is one day between orders worth? | Ile rocznie daje skrócenie odstępu między zamówieniami. | `/tool` (dokładny odstęp z jego zamówień) | na gałęzi `agencja/strona` (podgląd), jeszcze nie na produkcji: `/calculator` |
| 3 | Does the pack run out before the customer reorders? | Ile dni zapasu daje opakowanie kontra odstęp między zamówieniami; czy klient „ma dziurę”. | `/tool` i `/nawyko` (przypomnienie w dniu, gdy kończy się opakowanie) | na produkcji: `/tool` |
| 4 | How many customers reach a second order? | Ilu z jego nowych klientów musi wrócić, żeby pozyskanie się zwróciło (koszt pozyskania ÷ marża na zamówieniu = liczba zamówień do zwrotu). | `/nawyko` (nawyk po pierwszym opakowaniu) | pomysł |
| 5 | What does a stamp card at day 24 of 30 cost you? | Koszt kartki z pieczątką na klienta przy jego cenie opakowania i dniu nagrody, w porównaniu z marżą z kolejnego opakowania. | `/nawyko` (mechanika dni i pieczątki) | pomysł |
| 6 | Free shipping or a discount on the next pack — which costs less? | Który z dwóch znanych z góry bonusów jest tańszy przy jego koszcie wysyłki, cenie i marży. | `/nawyko` (nagrody do wyboru marki) | pomysł |

Uwagi:
- Narzędzia 4–6 to propozycje do wyrzucenia; żadne nie wymaga danych rynkowych ani procentów (wszystko w walucie i sztukach).
- Każde nowe narzędzie: spec w `agencja/specs/`, model jako czysta funkcja z testem w `scripts/`, bramka tekstów (`agencja/rubryka-tekstow.md`).
- **Reguła (23.11, źródło: NN/g „Calculators and Quizzes: User Expectations”, T. Kohler, 22.03.2024,
  https://www.nngroup.com/articles/calculator-expectations/):** wynik zawsze bez podawania kontaktu; każde narzędzie
  obsługuje też użycie „w tył” (odwiedzający ustawia wynik, który chce, i widzi, co musiałoby być prawdą) — w `/lab/reward`
  robi to suwak kosztu nagrody; każde wpisane pole musi zmieniać wynik (pola, które nic nie zmieniają, wylatują).
  Uwaga: w `/lab/reward` wartość zamówienia wpływa tylko na pasek przychodu i kontrolę marży — do sprawdzenia przy następnej rundzie.
