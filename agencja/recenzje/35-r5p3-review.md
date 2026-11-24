# Recenzja R5 P3: sekcja #loyalty (/nawyko, marka Acme)

Dane: Playwright/Chromium, 1440x900 i 390x844, kolory #1F6FEB i #111111, reduced-motion. Formularz nie był wysyłany. Zrzuty: `agencja/podglad/r5p3-rev-{1440,390,dark1440,dark390,rm1440}-{before,after}.png` (część "before" usunięta dla limitu plików).

## BLOKUJĄCE
1. **Tekst poniżej 12 px.** Chipy "EXAMPLE" (3 szt.), "SAMPLE DATA" mają 11 px; na 390 także eyebrow "FOR YOUR CUSTOMER" i "REWARDS IN THE APP". "EXAMPLE" to znacznik, że liczby są przykładowe, więc nie może być najdrobniejszym tekstem w sekcji. Dowód: pomiar computed font-size w `#loyalty`.

## WAŻNE
2. **Ciemna marka (#111111): UI znika.** Panel marki (#111 na tle sekcji #0E0F12) praktycznie zlewa się z tłem, pierścień punktów i sześciokąty B/S (#111 na kaflu #1B1D21) mają kontrast ok. 1,1:1 (wymóg dla grafiki 3:1). Na zrzucie dark1440-after pierścień jest ledwo widoczny, panel to ciemny prostokąt bez znaczenia "to Twoja marka". Tekst (biały na #111) jest OK. Potrzebny jasny obrys/podniesienie koloru marki na ciemnym tle.
3. **Zablokowane poziomy Silver/Gold:** litery S/G i etykiety 3,93:1 (15 px) na #2E3035, poniżej 4,5:1. Stan "jeszcze nie" niesie informację, więc nie jest wyjątkiem.
4. **Kafle nie wyglądają jak ekrany aplikacji.** Reszta strony pokazuje telefon z ramką, paskiem statusu i zakładkami. Tu są płaskie karty WWW: nagłówek "AC Acme" i chip SAMPLE DATA pomagają, ale kontrolki (segment Next order/Next delivery, przyciski) i podpis EXAMPLE są webowe. Kafel portfela ma ok. 80 px martwej przestrzeni między przełącznikiem a podpisem (1440).
5. **Słaby widoczny skutek części kontrolek.** "Next delivery" / "Next order" zmieniają wyłącznie 11-pikselowy podpis ("taken off the subscription delivery"), kwota i pasek bez zmian. "Skip a day" zmienia tylko podpis (pierścień bez zmiany). "Place order" i "Scratch today" działają widocznie (€6->€8, pasek, 240->250, odblokowany Silver).
6. **Suwak:** skutek jest wyraźny (100->200, "€3.00"->"€1.50" i "Worth €2.50"->"€1.25" na kaflu powyżej), ale kaflu z punktami nie widać razem z suwakiem na 390 (kafel jest ok. 600 px wyżej), więc "points screen above changes at once" nie jest widoczne na telefonie. Suwak nie ma aria-label (atrybut null; do sprawdzenia, czy etykieta jest przez for/id).

## DROBNE
7. Ramka fokusu suwaka (1440) dotyka etykiet min/max "50 · richer" / "200 · cheaper" (12 px).
8. Biały tekst na #1F6FEB: 4,63:1 (14 px), zapas minimalny, każdy jaśniejszy kolor marki spadnie poniżej 4,5:1. Sprawdzić, czy kod przełącza kolor tekstu wg luminancji.
9. Reduced-motion: stan końcowy identyczny, nie zauważyłem animacji przy przełączaniu (nie mierzyłem czasów transition). Do potwierdzenia w CSS.

## Rubryka
| Punkt | Wynik | Dowód |
|---|---|---|
| Oferta w 5 s | PASS | nagłówek + kwota €6.00 + "€2 back per order" (ten ostatni w 11 px) |
| Zero kiczu | PASS | stonowane, bez efektów |
| Kafle jak ekrany aplikacji | FAIL (częściowo) | pkt 4 |
| Interaktywność, widoczny skutek | PASS z uwagami | pkt 5, 6 |
| Kontrast tekstu 4,5:1, #1F6FEB | FAIL | S/G 3,93; reszta 4,63+ |
| Kontrast, #111111 | FAIL (UI nietekstowy) | pkt 2; tekst OK |
| Klawiatura: Tab przez 6 kontrolek, fokus | PASS | outline 2 px jasny na każdym; kolejność logiczna |
| Brak przelewania poziomego | PASS | scrollWidth = innerWidth (1440, 390) |
| Przesunięcia układu po kliknięciach | PASS | wysokość sekcji i pozycje przycisków bez zmian |
| prefers-reduced-motion | PASS warunkowo | pkt 9 |
| Tekst >= 12 px | FAIL | pkt 1 |
| "Tovemi" przy Acme | PASS | brak w #loyalty i w całym body.innerText |
