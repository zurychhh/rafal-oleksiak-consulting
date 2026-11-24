# Recenzja 28 — R4 p12 (diff 582834f..HEAD, app + scripts)

Recenzent niezależny, 24.11.2026. Serwer produkcyjny http://localhost:3000 (nie przebudowywany), Chromium Playwright,
`navigator.webdriver` = false, 390×844 i 1440×900, ruch pełny i `prefers-reduced-motion: reduce`.
Zrzuty: `agencja/podglad/r4p12-rev-*.png` (8 pozycji × 2 szerokości przy pełnym ruchu, 4 × 2 przy reduce, 3 klatki przejścia aktu na szerokość).

## BLOKUJĄCE

Brak.

## WAŻNE

1. **1440: lista kroków nadal skacze przy zmianie aktu. CLS spadł do 0, bo zmieniła się metoda pomiaru, a nie dlatego, że zniknął ruch.**
   Pomiar klatka po klatce (requestAnimationFrame, przewijanie kółkiem po 60 px) przy przejściu z aktu 0 do 1: pozycje `top` czterech `li.nk-step`
   zmieniają się w JEDNEJ klatce z `328,456,529,602` na `328,402,506,579`. Krok 2 podskakuje o 54 px, kroki 3 i 4 o 23 px, bez żadnej animacji.
   Wcześniej to samo przesunięcie szło przejściem `grid-template-rows` (0,0037 CLS). Teraz cała lista montuje się od nowa (`key`), więc
   Layout Instability API nie liczy tego jako przesunięcia, a oko nadal widzi skok. Spec A1 wymaga też: „Wygląd bez zmian”.
   Dowód: zapis klatek w tej recenzji i `r4p12-rev-1440-trans-0.png` (opis kroku 2 w trakcie wejścia, kroki 3 i 4 już na nowym miejscu).
   Na 390 problem nie występuje, bo widać tylko aktywny krok.
   Propozycja: stała wysokość każdego `li` (miejsce na opis zarezerwowane we wszystkich krokach, nieaktywne opisy tylko `opacity: 0`).
   Wtedy nic się nie przesuwa, a CLS wynosi 0 bez remontowania.

## DROBNE

1. **390, przypięta scena: nowego nagłówka „Reorders: four steps…” nie widać.** Reguła `.is-scroll .nk-scenehead .nk-h2{display:none}`
   (nawyko.css:248) istniała przed tym diffem. W scenie użytkownik widzi tylko etykietę „For your customer” i jeden krok
   (`r4p12-rev-390-full-0.png`, `getBoundingClientRect().top` nagłówka = 0, wysokość 0). Test 10 sekund na telefonie opiera się więc na etykiecie
   i kroku. Odpowiedź na „co to jest” jest słaba, a zmiana nagłówka na telefonie nic tu nie daje. Do decyzji Leada, poza zakresem p12.
   Pod sceną zostaje też ok. 230 px pustego miejsca (y 600–830).
2. **Fokus wędruje razem z aktem.** Fokus stał na przycisku kroku 1, a strona była przewijana kółkiem. Po zmianie aktu efekt przenosi fokus
   na przycisk `aria-current` kroku 2 i widać pierścień (`r4p12-rev-1440-trans-0.png`). Fokus nie trafia na `body`, czyli wynik jest akceptowalny,
   ale pierścień przeskakuje bez działania z klawiatury. Hipoteza z kodu, niesprawdzona: po przewinięciu do aktu ≥ 4 lista się odmontowuje
   (`step < 4`), więc fokus spadnie na `body`.
3. **Przywracanie fokusu sprawdzone tylko w Chromium.** Kod zależy od kolejności `blur` i efektu przy usunięciu węzła, a WebKit może ją obsłużyć inaczej.
   Warto dodać krok do `webkit-check`.
4. **Przenikanie ekranów telefonu w połowie przejścia.** Dwa teksty nakładają się na siebie („Scan the box to start.” na „Taken it? Scratch the card.”,
   `r4p12-rev-1440-trans-0.png`). To istniało przed diffem i trwa ułamek sekundy. Odnotowuję tylko jako uwagę.
5. **Bramka `clsscroll` łapie tylko widoczne przesunięcia.** Moja pierwsza sztuczna strona (element rosnący przy scrollu ponad widokiem) dała 0,00000,
   bo przesuwała treść poza oknem. Tak działa CLS, ale opis testu regresji warto doprecyzować. Strona z elementem `sticky` dała 0,0105, a parser
   z gates.sh zwrócił FAIL. W repo nie znalazłem zapisu testu regresji wymaganego w spec B1 (brak notatki `23-b-*`).
6. **„Genactiv” w HTML `/nawyko`.** Słowo stoi w Organization JSON-LD całej witryny („Fifteen years at Allegro, mBank, Booksy and Genactiv.”).
   Nie pochodzi z tego diffu i jest historią zawodową, a nie klientem strony. Zgłaszam tylko, żeby Lead świadomie to potwierdził.

## Co sprawdzone i przeszło

- **CLS przy przewijaniu kółkiem**: `node scripts/cls-scroll.mjs http://localhost:3000/nawyko 1440 900` → `CLSSCROLL suma=0.00000`
  (ładowanie 0, przewijanie 0, 0 wpisów). Na 390 844 wynik ten sam: 0.00000, 0 wpisów.
- **Wejście opisu (`nk-din`)**: krzywa przezroczystości klatka po klatce 0,00 → 0,13 → 0,27 → … → 1,00 w ok. 20 klatkach, bez migotania i bez powrotu
  do starego stanu. Na 390 opis wchodzi tak samo, a pozycja kroku stoi w miejscu (`top` 493 przez cały czas).
- **Nakładanie**: lista kroków i telefon nie przecinają się w żadnej z 16 pozycji (`listPhoneOverlap=false`).
- **Szerokość telefonu**: 390 → 204 px, a minimum to 159 px w akcie 5 (`r4p12-rev-390-full-6.png`), czyli ≥ 150 px. Na 1440 → 339 px.
- **Czytelność sceny**: 1440 `r4p12-rev-1440-full-1.png` i `-4.png` — nagłówek, 4 kroki, aktywny z opisem, telefon zgodny z krokiem, link
  „Ask how your brand gets its own app”. Na 390 aktywny krok jest czytelny (`-0`, `-3`).
- **Klawiatura** (Enter/Space; `document.activeElement` po ok. 2,2 s):
  - 1440, pełny ruch: Tab → `nk-stepbtn[cur]` 01. Tab → 02. Tab → 03. Enter → `nk-stepbtn[cur]` 03 (akt 2, po remoncie fokus wrócił na przycisk).
    Shift+Tab → 02. Space → `button.nk-link` „Scratch today’s card” (celowo, akt zdrapki). Ani razu `body`.
  - 1440, reduce: Enter na 03 → `nk-stepbtn[cur]` 03, Space na 02 → `[cur]` 02, Enter na 04 → `[cur]` 04.
  - 390, pełny ruch i reduce: Enter i Space → `nk-stepbtn[cur]` 01. Ani razu `body`.
- **prefers-reduced-motion: reduce**: tryb `is-still`, wszystkie 4 kroki z opisami widoczne naraz, animacja `nk-din` działa tylko pod `.is-scroll`
  (`r4p12-rev-390-rm-0.png`, `r4p12-rev-1440-rm-0.png`).
- **gates.sh (diff)**: parser `^CLSSCROLL suma=[0-9.]+` pasuje do `toFixed(5)`. Linia jest drukowana ostatnia. Progi w awk sprawdzone na granicach:
  0,00100 → PASS, 0,00101 → INFO, 0,01000 → INFO, 0,01001 → FAIL, zgodnie ze spec B1. Kod 124 → FAIL „limit czasu”. Brak linii → FAIL z kodem.
  FAIL ustawia `ANYFAIL`, więc skrypt kończy się kodem 1. Test na zepsutej stronie (localhost:3199, element `sticky` rosnący przy scrollu):
  suma 0,0105 → FAIL. Uwaga bez wpływu na wynik: `set -- $vp` nadpisuje argumenty pozycyjne, ale `$1` nie jest później używane.
- **Nagłówki A2**: „Reorders: four steps that bring customers back for the next pack.”, „Programme cost: you set the budget.”,
  „Built on Shopify; other tools connect per brand.” Bez nazw marek, bez liczb do udowodnienia („four” to liczba kroków), bez twierdzeń
  zdrowotnych. Zsynchronizowane w `content.ts` (FEATURES). `node scripts/copy-voice.test.mjs` → OK.
- **Nazwy marek w treści `/nawyko`**: jedyna marka w scenie to wymyślona „Tovemi” z dopiskiem „made-up demo brand, not a client”.
  „Genactiv” tylko w JSON-LD witryny (DROBNE 6).

## Reakcja Leada (24.11 10:10)
WAŻNE (skok listy kroków ukryty przed miarą CLS) — przyjęte: zmiana listy kroków cofnięta przed commitem. Test regresji B1
(brak zapisu) — dowód w raporcie B (strona z BUILD_ID na 127.0.0.1:3199: FAIL 1,49 / 0,84) i w tej recenzji (FAIL 0,0105);
skrypt testu do dopisania jako plik w następnym przebiegu. „Genactiv” w JSON-LD witryny: historia zawodowa Rafała na `/`, poza zakresem.
