# 17 — `/lab/payback`: recenzja niezależna i czytelnik-kupujący (23.11.2026, przebieg 5)

## Recenzent (osobna sesja, Playwright 390×844 i 1440×900)
Zaliczone: test 10 s, wynik na górze, rachunek (90/36/45 → zamówienie 3, dzień 90; 200/36/45 → 6, 225; 30/36 → 1; 1000/7/60 → 143, dzień 8 520;
„36,5” czytane jako 36.5; suwak = N × marża − koszt), każde pole zmienia wynik, klawiatura, reduced motion, zero marek i liczb rynkowych.
Niezaliczone → poprawione:
1. **Skoki układu przy wpisywaniu 0,13–0,16 na edycję (390).** Pomiar CLS dawał 0, bo przeglądarka pomija przesunięcia do 0,5 s po
   wpisaniu (`hadRecentInput`). Poprawka: stała wysokość linii rachunku i porady, podpis dnia w osobnej linii, rezerwa przy błędzie.
   Po: suma surowych przesunięć z 12 edycji 0,13 (390) / 0,03 (1440) — zostają drobne przesunięcia komórek drabinki przy zmianie ich liczby.
2. **Kontrast numerów zamówień „nie złożonych” 1,48:1** (opacity na całym elemencie) → przygaszona tylko komórka, numer #5c5b56.
3. **Legenda tłumaczyła 1 z 3 stanów** → „Outline = ordered, not paid back · black = paid back · faint = never ordered”.
4. „Earns 0” → „Breaks even”.
5. Pasek cookies na 390 zasłania link na pierwszym ekranie (jak w `/lab/reward`) — bez zmian, link jest niżej po przewinięciu; fokus odsłonięty (`focus-obscured` OK).

## Czytelnik-kupujący (sama lista tekstów)
Przepisane po uwagach: wynik „day 90 after the first” → „day 90 · orders 45 days apart”; rachunek pokazuje zaokrąglenie
(„90 to win ÷ 36 margin per order = 2.5 → order 3”); „Every reorder after it is profit” → „Each reorder adds margin.” (marża ≠ zysk);
status „Loses 18 / Earns 16” → „−18 · not paid back / +16 · paid back”; link „See how a daily habit gets customers to that order” →
„How to get customers to order 3 →”; pole „Average days between a customer’s orders”; tytuł bez „(preview)”.
Uwaga „16 kontra 18 się nie zgadza” wynikała z listy (dwa różne scenariusze w jednym punkcie), nie z rachunku — recenzent potwierdził rachunek.
Zostaje bez waluty przy liczbach (jak `/lab/reward`, „in your currency” przy wyniku w `/lab/reward`; tu waluta wynika z pól) — do drugiego czytelnika.
