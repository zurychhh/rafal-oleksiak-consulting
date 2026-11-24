# Spec 26 — RUNDA 5: żywa, w pełni spersonalizowana strona z wielkim finałem (Rafał 24.11.2026 12:47, przez doradcę)

Rafał ocenił `/nawyko` na komputerze: „jest już naprawdę nieźle”, ale zgłosił pięć rzeczy. Doradca dołożył własną krytykę całości
(oznaczone „doradca”). Ta runda ma pierwszeństwo przed wszystkim poza PILNE.

## Uwagi Rafała (wiążące)
1. **Personalizacja za słaba** w scenie „Under your brand · White label — Your brand. Your colours. Your app.” Do mocnego podkręcenia.
   **Błąd:** nazwa demo „Tovemi” jest w kilku miejscach na sztywno w tekście, a ma się zmieniać tak, jak odwiedzający zmienia nazwę
   (m.in. `DEMO_BRAND` w notkach „… is a made-up demo brand” w `NawykoClient.tsx` ok. linii 1108 i 1797, domyślne `brand = DEMO_BRAND`
   w `Phone` — każde wywołanie bez `brand` to wyciek; osobne stany nazwy w `Scene` i w `Story`).
2. **Wszystko od „For your customer · Cashback — Cashback grows with every order.” w dół do przebudowy:** osobne sekcje i ekrany,
   zero interaktywności, ekrany miały być PRAWDZIWE (jak w aplikacji), a są bardzo podobne do wcześniejszych.
3. **Na końcu zdublowana personalizacja** („Your customers' daily app, in your brand colour.”, ok. linii 1823) — usunąć.
4. **Zakończenie ma być najmocniejsze — wielki finał**, ze scrollowaniem, które coś odsłania. Wzór, który Rafał nazwał „super”: koniec
   `/work/genactiv` — „Step 2 · Card of the day”, zdrapka w kolorach marki do zdrapania palcem/myszą, „Reveal without scratching”,
   „See it with your brand: pick a colour”.
5. **Cała strona zbyt NUDNA kolorystycznie i układem** — ożywić. `/work/genactiv`: wstępnie bardzo dobra, ale trochę nieczytelna,
   scroll za szybki (treść ma się pojawiać spokojniej), czytelniejsza historia, bardziej urozmaicony, mniej monotonny układ.

## Kierunek (doradca — synteza, nie lista łatek)
Dlaczego jest nudno: (a) jedna powierzchnia — beż + czerń + jedna czerwień — wygląda jak dokument, nie produkt; (b) każda sekcja ma ten
sam szkielet: etykieta-chip, nagłówek, akapit, telefon obok; (c) ekrany są jasne, statyczne i prostsze niż prawdziwa aplikacja, więc
strona obiecuje mniej, niż produkt daje; (d) personalizacja jest jednym polem, a nie silnikiem całej strony.
Zasada: **strona jest pokazem produktu prowadzonym marką odwiedzającego.** Odwiedzający raz wpisuje nazwę i wybiera kolor (i kategorię),
a od tej chwili cała strona jest jego aplikacją.

- **Silnik marki** (jeden stan na całą witrynę, `localStorage` w try/catch, ten sam na `/nawyko`, `/work/genactiv` „See it with your
  brand” i `/tools`): nazwa, kolor, kategoria (suplement / kawa / karma dla zwierząt / pielęgnacja — zmienia jednostkę: kapsułki,
  filiżanki, miski, aplikacje; przykładowy produkt; przykładowe nagrody), monogram logo z inicjałów. Steruje: każdym telefonem, ikoną
  aplikacji na ekranie głównym telefonu, powiadomieniem („{marka}: your card of the day is ready”), folią zdrapki, akcentem całej
  strony (zmienna CSS), nagłówkami tam, gdzie to naturalne („Cashback grows with every {marka} order”). Bez własnej nazwy — demo
  z jasną notką; z własną nazwą — notka „Showing your brand: {marka} · sample data”, zero śladu nazwy demo.
- **Prawdziwe ekrany** (opis prawdziwej aplikacji od doradcy; zrzutów aplikacji nie wolno wnosić do tego publicznego repo):
  ciemny tryb z akcentem marki; nagłówek z nazwą/logo marki, odznaką „SAMPLE DATA” i ikoną konta; ekran „Today”: butelka produktu
  w środku promienistej tarczy dni, pigułka „1 DAY TICKED”, trzy kafelki „day streak / ticked / days left”, karta „Next reward: stamp”
  z kłódką i linkiem „See rewards”, karta potwierdzenia dnia z sześciokątnym znaczkiem ✓ („Day 1 ticked · Streak: 1 day in a row ·
  Next card tomorrow”), karta „Bought in a pharmacy? Add the receipt by day 24”; ekran „Rewards”: nagłówek „Your rewards · known
  in advance”, karty z kłódką (free shipping, stamp per pack „24 of 30 days”, weekly medals), karta „Next reward” z medalem i paskiem
  postępu „0 of 7 days”, karta „Paths” z dwoma przyciskami, rząd sześciokątnych pieczątek z celem „free pack”; dolna nawigacja
  Today · Rewards · Shop · Account. Teksty po angielsku, dane przykładowe, nigdy GENACTIV.
  Każdy ekran od „Cashback” w dół reaguje: przeciągnij, dotknij, przewiń — i widać skutek w aplikacji.
- **Rytm układu:** żadne dwie kolejne sekcje w tym samym układzie; najwyżej dwie sekcje „tekst + telefon obok” na stronę. Do użycia:
  pełnoekranowe przejęcie w kolorze marki, przypięty telefon ze zmieniającymi się podpisami, siatka żywych mini-ekranów (bento),
  poziomy pas dni, wielkie zdanie typograficzne, licznik.
- **Kolor:** powierzchnie przeplatane: papier → głęboki atrament → nasycony kolor marki na całą szerokość → papier; podpis Nawyko =
  folia zdrapki (metaliczny, opalizujący gradient) jako motyw powracający w kluczowych momentach. Kontrast AA w każdym kolorze marki
  (istniejące `inkOn` / `contrast`).
- **Wielki finał `/nawyko`:** ostatnia scena przed zapytaniem — przewijanie odsłania pełną aplikację odwiedzającego: ekran główny
  telefonu z ikoną jego marki → powiadomienie → zdrapka w jego kolorach do zdrapania (i „Reveal without scratching”) → seria dni
  i odblokowana nagroda → płynne przejście w formularz zapytania z jego nazwą w nagłówku („Build {marka}'s app”). Po finale nic się
  nie powtarza.
- **`/work/genactiv`:** wolniejsze tempo — każdy akt dłużej przypięty (ok. 1,4 wysokości ekranu na akt), jedna myśl na ekran,
  podpisy wchodzą po ustabilizowaniu telefonu, numer aktu i krótkie streszczenie historii widoczne cały czas; urozmaicony układ aktów.
  Granice specu realizacji bez zmian.

## Kolejność (przebiegi)
- **p1:** silnik marki + usunięcie wycieków nazwy demo + usunięcie dubla na końcu + test `brand-propagation` zielony.
- **p2:** wielki finał `/nawyko` (zdrapka i odsłanianie) + przebudowa od „Cashback” w dół na prawdziwe, interaktywne ekrany (część 1).
- **p3:** reszta sekcji w dół, rytm układu, paleta na `/nawyko`, `/tools` i w nawigacji.
- **p4:** `/work/genactiv` tempo i układ. Podgląd dla Rafała po każdym przebiegu, który zmienia coś widocznego.

## Bramki nowe (stałe, dopisane do `scripts/gates.sh`)
- `brand-propagation`: Chromium i WebKit — wpisz „Acme”, wybierz kolor → w widocznym tekście 0 × nazwa demo, „Acme” w każdym
  telefonie i w finale, akcent każdego telefonu = wybrany kolor; po przeładowaniu i na `/work/genactiv` ten sam stan.
- `monotonia` (niezależny krytyk-subagent, sama lista sekcji ze zrzutami 1440 i 390): FAIL, gdy dwie kolejne sekcje mają ten sam
  układ, gdy sekcja poniżej pierwszego ekranu nie reaguje na nic, gdy treść się powtarza, gdy finał nie jest najmocniejszym momentem,
  gdy strona ma mniej niż trzy tony powierzchni. Werdykt „nudne / żywe” z uzasadnieniem przy każdej sekcji.
- Dotychczasowe bramki (WebKit 390/1440, CLS, wydajność, dostępność, `prefers-reduced-motion`, teksty) bez zmian.
