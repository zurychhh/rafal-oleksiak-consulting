# Spec 40 — R6' p6: pierwszy klik zakładki kokpitu trafia w nią, telefon „Pharmacy” czytelny na laptopach

Przebieg 25.11.2026 12:38. Źródło: STATUS R6'-N5 (0)(a)(b), recenzja 47 („Poza zakresem, wysoka waga” + pkt 4).
NIE RUSZAĆ (RUNDA 6'): hero, „Four steps…”, „Rewards in the app”, finał, zapytanie. Żadna sekcja ani zdanie nie znika, żadnych nowych tekstów.

## A — klik zakładki w przypiętym kokpicie (`NawykoClient.tsx`, `BrandCockpit`)
Błąd: pierwszy klik „03 Privacy” bez zapisanej zgody kończy na „Pharmacy”. Pasek cookies wjeżdża w trakcie płynnego skoku,
`--consent-h` zmienia wysokość sceny, cel `top + i*seg + 1` ląduje 1 px przed odcinkiem, `tick` daje `floor(1,96)`.
1. Cel skoku w głębi odcinka: `top + i*seg + min(seg*0,25, 120)` (zakładka 0 bez zmian, +1 px).
2. ~~Ponowienie przy `scrollend`~~ — zbudowane i WYCOFANE po recenzji 48 (drobne 1–2: zjadało pierwszy ruch kółka i ucinało
   płynny skok na „starym” `scrollend`); sam cel w głębi odcinka daje 18/18 także bez `scrollend` (starsze Safari).
3. Bez zmian: kotwice `/nawyko#privacy`, klawiatura, przewijanie kółkiem, telefon (< 900 px), „ogranicz ruch”.

## B — telefon „Pharmacy purchases” w przypiętym kokpicie (`cockpit-scroll.css`)
Błąd: nagłówek nad telefonem zjada wysokość sceny — telefon 118 px na 1366×657, 91 px z paskiem cookies, 132 px na 1440×789.
Poprawka układu zamiast podnoszenia progu przypięcia (próg 760 px odpinałby kokpit na najczęstszym laptopie 1366×768,
a w układzie odpiętym klik zakładki podmienia panel poniżej ekranu — sprawdzone zrzutem, odrzucone):
nagłówek, karty „Bought online / in a pharmacy” obok siebie i „Scan the box” w lewej kolumnie, telefon na całą wysokość
sceny po prawej (scena kart `display:contents`; pierwsza wersja z kartami przy telefonie — recenzja 48 I1: karty wchodziły
na nagłówek na 900–1260 px). W wąskim ekranie telefonu (≤ 175 px) „Sample data” w jednym wierszu.
Ten sam tekst i te same elementy, inna siatka tylko w przypiętym kokpicie.

## C — bramka `cockpit-pin` (nowa, stała, `scripts/cockpit-pin-check.mjs`, w `gates.sh` dla `/nawyko`)
Okna 1366×657, 1280×720, 1440×789, 1440×900, 900×600; każda zakładka w świeżym kontekście bez zgody cookies, dwa tryby:
dojazd kółkiem i klik od góry strony (pasek cookies wjeżdża w trakcie skoku). PASS: aktywna = kliknięta i każdy widoczny
telefon panelu ≥ 150 px, a w panelu Pharmacy bloki nie nachodzą na siebie ani nie wychodzą poza panel (okno 1024×768 dodane po recenzji 48). Test regresji sprawdzony na starym buildzie: FAIL 5/6 skoków (zakładka o jedną za wcześnie)
i Pharmacy 91/132 px; na nowym PASS.

## Kryteria
build · tsc · lint (≤ 1 ostrzeżenie) · `gates.sh http://localhost:PORT /nawyko` PASS (z `cockpit-pin`, inwentarzem, css-dropped),
WebKit 390/1440 obejrzany, zrzuty `agencja/podglad/r6q6-*`, recenzent niezależny bez IMPORTANT.
