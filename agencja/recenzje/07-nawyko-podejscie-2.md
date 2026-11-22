# Recenzja 07: Nawyko, podejście 2 (po poprawkach z recenzji 05)

Data: 2026-11-22 · Recenzent niezależny (nie budował) · Strona: http://localhost:3000/nawyko
Dowody: własny skrypt Playwright `/tmp/claude-0/rev3/r.js` (1440×900 i 390×844, przegląd całej sceny co 0,4 wysokości ekranu z próbkami 60/250/600 ms po każdym przewinięciu, pomiar przecięć telefonu z widocznym tekstem, CLS, czasy klatek, test Tab). Wyniki: `/tmp/claude-0/rev3/o1440.json`, `o390.json`, zrzuty w `/tmp/claude-0/rev3/fr/`. Źródło przeczytane: `app/nawyko/NawykoClient.tsx`, `nawyko.css` (bez zmian).

**Werdykt: punkt 4 naprawiony, punkt 8 nadal niepotwierdzony, a poprawka na 390 wprowadziła nowy problem: przesunięcia układu (CLS 0,26, wcześniej 0,001).**

Zastrzeżenie: w tym podejściu nie oglądałem klatek z nagrań ani zrzutów (limit wywołań). Werdykty A i C opierają się na pomiarach geometrii, nie na ocenie wzrokowej.

## Wyniki

**A. Punkt 4: PASS (pomiar).**
- 1440: w żadnej z próbek (także 60 i 250 ms po wejściu w akty 5–6, czyli w trakcie powrotu) telefon nie przecina widocznego tekstu (0 przecięć). W akcie 5 telefon stoi po lewej (x 217–555), wykres po prawej (x 756–1316). W akcie 6 telefon wraca na prawo (x 885–1223).
- 390: zmiana rozdziału jest teraz wyraźna. W „For you” telefon maleje z 422 do 250 px wysokości i przesuwa się w lewo (x 93→45). Wykres marki mieści się w całości (y 468–594 przy ekranie 844) i nie nachodzi na telefon.
- Zastrzeżenie: próbkowałem co 360 px przewinięcia, więc pojedyncza klatka między próbkami mogła umknąć.

**B. Punkt 8: NIEROZSTRZYGNIĘTE / częściowy FAIL.**
- 1440: Tab dochodzi do „Scratch” w nawigacji aktów po 11 naciśnięciach, a Enter przenosi do aktu 1. Fokus zostaje jednak na przycisku nawigacji, a przycisk zastępczy jest ukryty (`altVisible:false` po 1,5 s i po 5,5 s).
- Przyczyna jest prawdopodobnie taka: mój skrypt przewinął wcześniej całą scenę, karta zdrapała się sama, a stan `scratched` nie wraca do początku. Wtedy `hidden={!(step===1 && !scratched)}` (l. 827) ukrywa przycisk i `focus()` z l. 799 nie ma czego złapać. Samo zachowanie jest logiczne (karta już zdrapana), ale nie sprawdziłem świeżego przypadku: wstrzymania samozdrapki przy fokusie.
- 390: w 80 naciśnięciach Tab nie trafiłem na przycisk „Scratch” w nawigacji. Nawigacja jest tu albo niedostępna z klawiatury, albo ma inną etykietę. Trzeba to sprawdzić.

**C. Nowe ucięcia lub nachodzenia: PASS (pomiar).**
- Nigdzie tekst nie nachodzi na telefon ani na pasek aktów.
- Jedyne elementy „poza ekranem” to treść naturalnie pod zgięciem przed sceną (akt 0) i treść „Your brand…”, która wyjeżdża w górę po przewinięciu za scenę. To nie są ucięcia.

**D. Błędy konsoli: PASS.** Zero błędów konsoli i zero pageerror w 1440 i 390.

**E. Płynność: PASS na 1440, FAIL na 390.**
- Czasy klatek przy przewijaniu kółkiem: 0 klatek powyżej 50 ms, maksimum 17 ms w obu szerokościach.
- CLS: 0,013 na 1440, ale 0,257 na 390 (w recenzji 05 było 0,001), czyli powyżej progu „dobrze” wynoszącego 0,1.
- Najpewniejsza przyczyna to nowa reguła `.is-scroll .nk-phone{transition:height .9s}` z wysokością `min(30svh,250px)` w `data-ch="1"` (nawyko.css ok. l. 472–473). Animowana wysokość przesuwa sąsiednie elementy w każdej klatce.

## Poprawki (od najważniejszej)

1. **CLS na 390 (nawyko.css, blok „przebieg 5”):** zamiast animować `height` telefonu, skalować go transformacją, np. `.nk-scene.is-scroll[data-ch="1"] .nk-phonecol{transform:translateX(-26%) scale(.6);transform-origin:top left}` z `transition:transform`. Miejsce na wykres zarezerwować stałym układem, a nie zmianą wysokości. Po zmianie zmierzyć CLS ponownie (cel: poniżej 0,1).
2. **Klawiatura (NawykoClient.tsx, `go()` ok. l. 786–800 i `.nk-alt` l. 827):**
   - Jeśli karta jest już zdrapana, `go(1)` powinno ustawić fokus na czymś widocznym w scenie (np. na nagłówku aktu z `tabIndex=-1`), żeby fokus nie wisiał na nawigacji bez śladu zmiany.
   - Na 390 sprawdzić, czy przyciski `nav.nk-acts` są osiągalne Tabem (nie `display:none` ani `tabIndex=-1`).
   - Potem powtórzyć test B w świeżej karcie, bez wcześniejszego przewijania.
