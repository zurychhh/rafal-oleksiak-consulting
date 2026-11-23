# Narzędzia w ramach USP (FMCG, powtarzalny zakup)

Zasada cyklu: jedno pytanie, jeden ekran, liczby wyłącznie z pól odwiedzającego, wynik w 30 s, jeden krok dalej.
Bohaterem jest marka odwiedzającego. Kolejność = proponowana kolejność budowy (propozycja, decyzja Rafała).

| # | Pytanie narzędzia | Co odwiedzający wie po 30 s | Do czego prowadzi | Status |
|---|---|---|---|---|
| 1 | What can a loyalty reward cost and still pay off? | Najwyższy roczny koszt nagród na klienta, przy którym nagroda się zwraca (marża × dodatkowe zamówienia), i czy jego pomysł na nagrodę się mieści. | `/nawyko` — stała, znana z góry nagroda w aplikacji pod jego marką | **zbudowane w podglądzie `/lab/reward`** (spec 07) |
| 2 | What is one day between orders worth? | Ile rocznie daje skrócenie odstępu między zamówieniami. | `/tool` (dokładny odstęp z jego zamówień) | na gałęzi `agencja/strona` (podgląd), jeszcze nie na produkcji: `/calculator` |
| 3 | Does the pack run out before the customer reorders? | Ile dni zapasu daje opakowanie kontra odstęp między zamówieniami; czy klient „ma dziurę”. | `/tool` i `/nawyko` (przypomnienie w dniu, gdy kończy się opakowanie) | na produkcji: `/tool` |
| 4 | How many customers reach a second order? | Ilu z jego nowych klientów musi wrócić, żeby pozyskanie się zwróciło (koszt pozyskania ÷ marża na zamówieniu = liczba zamówień do zwrotu). | `/nawyko` (nawyk po pierwszym opakowaniu) | **zbudowane w podglądzie `/lab/payback`** (spec 09); wynik to numer i dzień zamówienia |
| 5 | What does a stamp card at day 24 of 30 cost you? | Koszt kartki z pieczątką na klienta przy jego cenie opakowania i dniu nagrody, w porównaniu z marżą z kolejnego opakowania. | `/nawyko` (mechanika dni i pieczątki) | pomysł |
| 7 | Which day should the reorder reminder go out? | Dzień opakowania (i dzień od zamówienia), w którym wysłać przypomnienie: długość opakowania − dostawa − czas na zamówienie; suwak pokazuje dni bez produktu albo zapas przy innym dniu. | `/nawyko` — aplikacja zna dzień opakowania każdego klienta (codzienne zdrapanie) | **zbudowane w podglądzie `/lab/reminder`** (spec 10) |
| 6 | Free shipping or a discount on the next pack — which costs less? | Który z dwóch znanych z góry bonusów jest tańszy przy jego koszcie wysyłki, cenie i marży. | `/nawyko` (nagrody do wyboru marki) | pomysł |

Uwagi:
- Narzędzia 4–6 to propozycje do wyrzucenia; żadne nie wymaga danych rynkowych ani procentów (wszystko w walucie i sztukach).
- Każde nowe narzędzie: spec w `agencja/specs/`, model jako czysta funkcja z testem w `scripts/`, bramka tekstów (`agencja/rubryka-tekstow.md`).
- **Reguła (23.11, źródło: NN/g „Calculators and Quizzes: User Expectations”, T. Kohler, 22.03.2024,
  https://www.nngroup.com/articles/calculator-expectations/):** wynik zawsze bez podawania kontaktu; każde narzędzie
  obsługuje też użycie „w tył” (odwiedzający ustawia wynik, który chce, i widzi, co musiałoby być prawdą) — w `/lab/reward`
  robi to suwak kosztu nagrody; każde wpisane pole musi zmieniać wynik (pola, które nic nie zmieniają, wylatują).
  Uwaga: w `/lab/reward` wartość zamówienia wpływa tylko na pasek przychodu i kontrolę marży — do sprawdzenia przy następnej rundzie.
- **Reguła (23.11 przebieg 5, źródło: NN/g „Website Forms Usability: Top 10 Recommendations”, K. Whitenton, 01.05.2016,
  https://www.nngroup.com/articles/web-form-design/):** „Explain any input or formatting requirements” i „Erroneous input should be
  preserved… accompanied by a specific explanation”. W narzędziach: wymóg formatu w etykiecie pola („amount, not %”, „Average days”),
  komunikat błędu nazywa pole i poprawkę („Cost to win a customer: digits only.”), błędny wpis zostaje w polu. Sprawdzone w `/lab/payback`
  i `/lab/reward`: spełnione; pole odstępu dostało „Average”, bo bez tego nie wiadomo, czy chodzi o jednego klienta czy o średnią.
