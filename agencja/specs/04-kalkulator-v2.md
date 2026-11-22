# 04 · Kalkulator v2 (/calculator) — od nowa

Data: 22.11.2026 · gałąź `agencja/kalkulator-v2` · zastępuje wersję ze specyfikacji 02.

## Dlaczego
Ocena Rafała wersji pierwszej: nieczytelna, przegadana, bez efektu; animacja u góry ładna, ale nic z niej nie wynika.
Przyczyna: dwa kalkulatory, dziewięć pól, sekcja założeń, sekcja źródeł, dwa odsyłacze i formularz — czyli raport, nie narzędzie.

## Zakres
- Jedno pytanie („What is one day between orders worth?”), jeden ekran, trzy pola: klienci kupujący ponownie,
  średnia wartość zamówienia, dni między zamówieniami. Jeden suwak: docelowy odstęp. Jedna liczba: dodatkowy przychód rocznie.
- Wzór: zamówień rocznie = 365 / odstęp; dodatkowy przychód = klienci × wartość zamówienia × (365/docelowy − 365/obecny).
  Pod liczbą stoi jej wyprowadzenie w jednej linii („+1.01 orders × 120 × 4,000 customers”).
- Rok jednego klienta: dwa paski 365 dni (dziś i cel). Kreska = ponowne zamówienie; przy skracaniu odstępu kreski
  zsuwają się w lewo, a dodane zamówienia wchodzą z prawej na czerwono. Obok licznik „6 → 7 orders”.
- Wartości startowe są przykładem i mają etykietę „Example — type your own”, dopóki odwiedzający nie zmieni pola.
- Jeden krok dalej: przycisk „Talk these numbers through” rozwija w miejscu istniejący formularz (`Enquiry`,
  `form="calculator"`), plus jeden cichy odsyłacz do `/tool` („Measure it — free”).
- Założenia: jedna zwinięta linia „How this is counted” (cztery zdania). Żadnych statystyk zewnętrznych.
- Usunięte: scenariusz drugiego zakupu, sekcja założeń, sekcja punktów odniesienia ze źródłami, odsyłacz do /nawyko w treści,
  pola „na ile dni starcza opakowanie” i „marża”, rabat progowy, wartość jednego dnia.

Poza zakresem: inne podstrony, pliki wspólne, zależności, wdrożenie.

## Kryteria akceptacji
1. Na 390×844 pola, liczba, suwak i pasek roku mieszczą się na pierwszym ekranie bez przewijania; na 360×640 liczba i suwak są widoczne razem; na 1440×900 całość to jeden ekran z dominującą liczbą.
2. Liczba zmienia się płynnie podczas przeciągania (requestAnimationFrame, cyfry o stałej szerokości, zarezerwowana szerokość); pasek roku animuje wyłącznie `transform` i `opacity`, najwyżej 60 kresek. Przy `prefers-reduced-motion` wartości podmieniają się bez animacji.
3. „4,000”, „4 000” i „4.000” znaczą cztery tysiące. Zero, wartość ujemna, pusta albo absurdalna daje cichą podpowiedź pod polami i kreskę zamiast liczby — nigdy NaN ani Infinity.
4. Suwak: od połowy obecnego odstępu (nie mniej niż 7 dni i nie mniej niż 1) do obecnego odstępu. Cel równy obecnemu = 0 i zdanie, które mówi to wprost.
5. Nic wpisanego w pola nie opuszcza strony: komponent nie wywołuje `fetch`, nie zapisuje do pamięci przeglądarki, nie wysyła zdarzeń analitycznych (sprawdzone: zero żądań innych niż GET po wpisaniu wartości). Formularz wysyła tylko własne pola.
6. Klawiatura: pola i suwak obsługiwalne, widoczny fokus, `aria-valuetext` na suwaku, wynik w `aria-live="polite"` z opóźnieniem 0,7 s. Bez JavaScriptu strona pokazuje stan przykładowy jako czytelny tekst.
7. Czerwień tylko jako zmierzona wartość (liczba, skrócone dni, dodane zamówienia). Bez zaokrągleń, gradientów i ikon.
8. Bramki: `npm run build`, `npx tsc --noEmit`, `npx eslint .` (0 błędów, 1 dawne ostrzeżenie), `node scripts/calculator-model.test.mjs`, `design/qa.js … --scroll` = PASS na 9 widokach.

## Znane ograniczenia
- Dopuszczalny obecny odstęp: 7–365 dni (pasek rysuje najwyżej 60 zamówień w roku).
- Pasek pokazuje całe zamówienia mieszczące się w roku, liczba używa średniej (365/odstęp), więc licznik kresek i ułamek w wyprowadzeniu mogą się różnić o część zamówienia; mówi o tym zwinięta linia.
- Wynik to górna granica: zakłada, że każdy klient przechodzi na docelowy odstęp. Strona mówi to w zwiniętej linii, nie przy liczbie.

## Czy to narzędzie jest potrzebne obok /tool?
Tak, ale tylko jako wejście: kalkulator w 30 sekund i bez żadnych danych pokazuje rząd wielkości stawki, a /tool mierzy faktyczny odstęp z eksportu zamówień — to dwa różne progi wysiłku dla tego samego pytania. Jeśli po kilku tygodniach ruchu kalkulator nie będzie przekazywał ludzi do /tool ani do formularza, należy go zwinąć do jednego bloku na stronie /tool zamiast utrzymywać osobną podstronę.
