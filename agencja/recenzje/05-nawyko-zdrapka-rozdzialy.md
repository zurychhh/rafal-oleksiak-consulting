# Recenzja 05: Nawyko, samozdrapka, rozdziały, zmiana strony telefonu

Data: 2026-11-22 · Recenzent niezależny (nie budował) · Strona: http://localhost:3000/nawyko
Dowody: własny skrypt Playwright (1440×900, 390×844, reduced motion, Tab ×45, pomiar ramek i CLS) w /tmp/claude-0/rev/, kafelki klatek z nagrań /tmp/claude-0/cap/n1440-vid i n390-vid.

**Werdykt: prawie gotowe, 8/10 PASS.** Dwie rzeczy do naprawy: przy powrocie telefonu na prawą stronę (1440) przez chwilę zasłania on tekst rozdziału „Under your brand”, a przycisk zastępczy do zdrapania jest praktycznie nieosiągalny z klawiatury.

## Rubryka

1. **Zdrapki nie da się przegapić: PASS.** Przy zwykłym przewijaniu w obu szerokościach karta zdrapuje się sama (ślad palca i drobiny widać na pierwszej klatce 390), potem stoi „Day 9 DONE” i „9 days +1” na czerwono przez większość aktu; akt jest wyraźnie dłuższy od pozostałych.
2. **Oferta jasna w 5 s: PASS.** Nad zgięciem: „A habit app with your logo on it.” i „An app under your brand for customers who buy again — built and run for you.” Wiadomo, co marka kupuje. Nie widać tylko modelu rozliczenia (to uwaga, nie błąd).
3. **Każdy rozdział mówi, do kogo: PASS.** Czarne etykiety „FOR YOUR CUSTOMER” / „FOR YOU” / „UNDER YOUR BRAND” są przy nagłówkach każdego rozdziału, także w wersji statycznej.
4. **Zmiana strony telefonu płynna, bez nachodzenia: FAIL.** Na 1440 przejście w „For you” (telefon po lewej, tekst po prawej) jest czytelne, a pasek aktów (y 788–816) nigdy nie nachodzi na telefon. Przy scrollY≈7200 telefon wraca jednak przez lewą połowę (x 220–816), a tekst „Your brand. Your colours. Your app.” i opis pola są już w pełni widoczne pod nim. Na 390 „zmiana strony” to przesunięcie o ok. 9 px i skala 0,98, czyli praktycznie niewidoczna; nic nie nachodzi, ale efektu też nie ma.
5. **Zero kiczu: PASS.** Monochrom, jeden czerwony akcent „+1”, drobiny krótkie i oszczędne; bez konfetti i bez fajerwerków.
6. **Brak skoków układu i szarpania: PASS.** CLS 0,009 (1440) i 0,001 (390); w klatkach nie widać szarpnięć.
7. **Reduced motion: PASS.** Strona jest statyczna i krótsza (5808 px wobec 10716), sekcje są ułożone pionowo z telefonem obok, wszystkie rozdziały i etykiety są na miejscu. Drobna uwaga: pierwszy telefon pokazuje stan końcowy („Stamp earned”), więc samego momentu zdrapki w tej wersji nie widać.
8. **Klawiatura: FAIL (częściowo).** Tab dochodzi do kroków 01–04 i do wszystkich przycisków nawigacji aktów (CONFIRM…YOUR NAME), dalej do formularza. Przycisk „No pointer? Scratch today’s card” renderuje się jednak dopiero w akcie zdrapki (`hidden={!(step===1 && !scratched)}`), stoi w DOM przed nawigacją aktów (po kliknięciu SCRATCH trzeba cofać się Shift+Tab), a po 1,5 s samozdrapka go chowa. Użytkownik klawiatury praktycznie nie zdąży.
9. **Brak prawdziwych marek, liczby oznaczone: PASS.** Marka Tovemi jest opisana jako „made-up brand”, wykres jako „Illustration · invented data”, a liczby na telefonie to stan demo („DEMO”). Nie znalazłem twierdzeń liczbowych podanych jako fakt.
10. **Błędy konsoli: PASS.** Zero błędów i zero pageerror w 1440, 390 i reduced motion.

## Poprawki (od najważniejszej)

1. **Nachodzenie przy powrocie telefonu (NawykoClient.tsx, logika `ch`/`swung` i stany `.nk-still`/panelu w nawyko.css):** tekst rozdziału „Under your brand” powinien pojawiać się dopiero, gdy telefon jest z powrotem po prawej, np. opóźnić opacity/translate tekstu o czas przejścia albo przesunąć próg powrotu telefonu przed próg pokazania tekstu. Sprawdzić klatkę przy scrollY≈7200 na 1440.
2. **Przycisk zastępczy zdrapki dla klawiatury (NawykoClient.tsx ok. linii 765–830):** wstrzymać samozdrapkę, gdy fokus jest w scenie (`:focus-visible` / `focusin`), a w `go(1)` po dojechaniu ustawić fokus na `.nk-alt button` (tak jak dziś robi to `go(i>=4)` dla kontrolek aktów 5–7). Ewentualnie przenieść `.nk-alt` za nawigację aktów albo pokazywać go stale w akcie zdrapki.
3. **390 px (nawyko.css, reguły mobilne dla rozdziału „For you”):** albo wzmocnić sygnał zmiany rozdziału (np. wyraźniejsze przesunięcie lub skala ok. 0,9, ewentualnie zmiana tła), albo uczciwie uznać, że na telefonie zmianę niesie sama etykieta, i nie obiecywać „zmiany strony”. Przy okazji: baner cookies na 390 zakrywa dolny pas sceny przez cały akt zdrapki.
