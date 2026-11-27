# Rubryka tekstów strony (bramka; wprowadzona 22.11.2026 po uwadze Rafała)

**Skąd:** nagłówek „Your name on it, not mine.” przeszedł budowę, dwie recenzje i przegląd doradcy, a Rafał w sekundę ocenił go
jako „super głupie i egocentryczne”. Powód: recenzje sprawdzały formę (kicz, płynność, dostępność, źródła liczb), a nikt nie
czytał tekstów oczami kupującego. Ta rubryka to naprawia. Niespełniony punkt = tekst do przepisania przed commitem.

## Zasady (każdy nagłówek, podtytuł, przycisk, etykieta i komunikat)
1. **Bohaterem jest marka klienta i jej klient, nigdy autor strony.** Żadnego „I / me / my / mine / we / our” w nagłówkach,
   podtytułach i przyciskach scen produktu i narzędzi. Pierwsza osoba tylko tam, gdzie mówi człowiek do człowieka:
   formularz, zgody, stopka, potwierdzenie wysyłki.
2. **Jasność przed błyskotliwością.** Nagłówek mówi, co odwiedzający dostaje albo co widzi. Żadnych gier słów, kontrastów
   dla efektu („X, not Y”), żartów ani haseł, których nie da się powiedzieć klientowi na głos w rozmowie bez zażenowania.
3. **Test bez kontekstu.** Każdy nagłówek musi być zrozumiały sam, wyrwany ze strony. Jeśli wymaga sceny obok, jest za słaby.
4. **Konkret zamiast przymiotnika.** Liczba, dzień, czynność, rzecz na ekranie. Żadnych „seamless, powerful, effortless,
   unlock, supercharge, game-changing” i podobnych.
5. **Jedna myśl.** Nagłówek do ok. 8 słów; scena do ok. 12 słów plus jedno zdanie.
6. **Ton: rzeczowy doradca, nie sprzedawca i nie kumpel.** Bez wykrzykników, bez emoji, bez przechwałek o autorze.
8. **Pierwsze dwa słowa niosą treść** (źródło: NN/g, H. Loranger, „Headings Are Pick-Up Lines”, 09.08.2015,
   https://www.nngroup.com/articles/headings-pickup-lines/: „Moving the keywords to the front makes the heading more scannable”,
   „Don't count on people reading the end of sentences”). Nagłówek, wynik i porada zaczynają się od słowa, które mówi, o co chodzi
   („Too early: …”, „Day 25 of the pack”), nie od wstępu („Earlier, …”, „If you…”). Dwa przeciwne stany — dwie symetryczne etykiety.
7. **Prawda.** Nic, czego produkt dziś nie robi; nic o zdrowiu poza zatwierdzonymi oświadczeniami; żadnych liczb bez źródła.
9. **Stan awarii = co się stało + jedno działanie + wyjście** (źródło: NN/g, „Error-Message Guidelines”,
   https://www.nngroup.com/articles/error-message-guidelines/ — komunikat ma być czytelny dla człowieka, opisywać problem
   precyzyjnie i dawać konstruktywną radę). Bez żargonu („did not load”, „error 500”), stan po stronie strony, nie winy
   odwiedzającego; zawsze link wyjścia (np. „Home page”). Wzór: `/blog` przy awarii backendu (26.11).

## Jak to sprawdzamy (trzy warstwy, wszystkie obowiązkowe)
- **Automat:** `node scripts/copy-voice.test.mjs` — pierwsza osoba i zakazane słowa w nagłówkach, podtytułach i przyciskach
  tras pisanych ręcznie. Czerwony = brak commita.
- **Czytelnik-kupujący (osobny subagent, który nie widział budowy):** dostaje SAMĄ listę tekstów, bez strony, w roli
  założyciela marki FMCG, który widzi stronę pierwszy raz. Przy każdym tekście jedna ocena: w porządku / niejasne /
  żenujące / egocentryczne / puste, z jednym zdaniem dlaczego. Cokolwiek poza „w porządku” = przepisać i sprawdzić ponownie.
  Wynik do `agencja/recenzje/`.
- **Rafał:** plik `agencja/teksty-do-akceptacji.md` — wszystkie nagłówki, podtytuły i przyciski każdej trasy w jednej
  tabeli (trasa · miejsce · tekst · status: nowy / zmieniony / zaakceptowany). Aktualizowany w każdym przebiegu, który
  rusza teksty; w „Dla Rafała” jedno zdanie: ile nowych tekstów czeka. Odrzucony tekst trafia do sekcji „Odrzucone
  i dlaczego” na dole tego pliku — to jest pamięć gustu Rafała; czytaj ją przed pisaniem nowych tekstów.

## Odrzucone i dlaczego (pamięć gustu)
- 24.11 „Stored — Nothing yet.” / „A date. Nothing else.” (`/nawyko` Privacy) — czytelnik: „yet” zapowiada zapis później, „Nothing else” jest fałszywe w szerokim odczycie (aplikacja ma konto i zakupy). Przy danych zdrowotnych bez „yet” i bez absolutów bez zakresu. Zamiast: „Nothing.” / „Tick date only.”
- 24.11 „The Nawyko app” (link w nagłówku `/`) — czytelnik-kupujący: „obcy wyraz, nie mówi, co dostaje marka, brzmi jak aplikacja do pobrania dla mnie”. Zamiast: „Nawyko reorder app”. Nazwa własna w nawigacji zawsze z jednym zwykłym słowem opisu (NN/g „Category Names Suck”).
- 24.11 „Claim: supports immunity” (przełącznik zakazanej funkcji na `/nawyko`) — na stronie o suplementach treść oświadczenia zdrowotnego, nawet jako zakazany przykład, na zrzucie czyta się jak oświadczenie samej strony. Zamiast: „Add a health claim to a card”. Nigdy nie cytujemy treści oświadczeń zdrowotnych.
- 22.11 „Your name on it, not mine.” — egocentryczne i przemądrzałe; autor strony w roli bohatera. Zamiast: „Your brand. Your colours. Your app.”
- 22.11 kalkulator w pierwszej wersji — „zajebiście przegadane”: raport zamiast narzędzia. Zasada 5.
- 22.11 `/nawyko` poniżej sceny w pierwszej wersji — „nudno, statycznie, nikt tego nie przeczyta”: listy zamiast scen.

**13. Formularz: oznacz i wymagane, i opcjonalne (24.11 R4 p10).** Każde pole i każda zgoda ma przy etykiecie „(required)” albo „(optional)” — nie samą gwiazdkę i nie tylko jedno z dwóch. Źródło: Baymard Institute, „Mark both required and optional fields” (https://baymard.com/blog/required-optional-form-fields). `Enquiry` spełnia (stan 24.11).
