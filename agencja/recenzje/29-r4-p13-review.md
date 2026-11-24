# R4 p13 — recenzja niezależna (A: wspólne miejsce na opis kroku, B: skrypty)

Zakres: `git diff 433356e..HEAD -- app scripts`, build na localhost:3000, Playwright (Chromium z `scripts/chromium-exe.cjs`, `navigator.webdriver=false`). Zrzuty: `agencja/podglad/r4p13-rev-*.png`.

## Werdykt rubryki
1. Czytelność w 5 s (1440, 1100): **FAIL**. Opis zawsze stoi pod wierszem 04, więc przy krokach 1–3 czyta się jak opis kroku 04. Przykład: krok 02 „A scratch card after each dose…” stoi 14 px pod linią wiersza „Earn a reward they saw coming” i ~170 px od swojego wiersza (`rev-1440-4.png`, porównaj z `a-przed-1440-krok2.png`, gdzie opis jest w wierszu 02). Jedyne powiązanie to pogrubiony kolor aktywnego wiersza; w slocie nie ma numeru, strzałki ani akcentu.
2. Płynność i brak kiczu: **PASS**. Na 1440x900, 1100x800 i 1280x720 zrobiłem po 14 klatek przez akty 0→4. `top` wierszy i nagłówka jest identyczny we wszystkich klatkach, od aktu 0 do aktu 3 (1440: 328.4/397.6/466.8/536.0; wysokość wierszy stała, 69 px). Jedyna różnica to 1,5 px między klatką 0 a 1, bo przyklejony etap jeszcze dosiada. Przy aktach 0–3 widoczny jest jeden opis (`vis=1`), a jego indeks zgadza się z `aria-current`.
3. Ograniczony ruch i 390: **PASS**. Przy ograniczonym ruchu scena ma klasę `is-still`, slot się nie renderuje, a opisy są w wierszach jak dawniej. Przy 390 slot ma `display:none`, wiersz ma 92 px, `scrollWidth=390`.
4. Klawiatura i czytnik: **PASS**. Tab daje obrys 2 px solid na `.nk-stepbtn`, Enter ustawia `aria-current="step"` i właściwy slot. W drzewie dostępności każdy z 4 przycisków ma nazwę „NN tytuł opis”, a slot ma `aria-hidden`. Każdy opis jest czytany dokładnie raz, nic nie ginie.
5. Przelewanie się układu przy 1100–1440: **PASS z uwagą** (pkt I2). Przy 1100x800 i 1440x900 nic nie nachodzi na pasek aktów. Przy 1280x720 z paskiem cookies slot kończy się na 627 px, a etykiety aktów zaczynają ~615 px (`rev-1280-4.png`: opis styka się z paskiem aktów).
6. /lab/reward przy 390: **PASS**. `scrollWidth=390` na /lab/reward i /lab/payback. `.rw-live` (`aria-live=polite`, opacity 0, bez display:none) ma 342 px szerokości i aktualizuje się po strzałce na suwaku (`rev-reward-390.png`).
7. Skrypty: **PASS z uwagami**. Mediana jest poprawna (n nieparzyste i parzyste), `gates.sh` czyta ostatnią linię `SCROLLPERF`, progi 100/200 ms bez zmian. Wyniki selftestów: clsscroll broken 3.39 FAIL / calm 0 PASS; scrollperf broken 252/256 FAIL / calm 0/0 PASS. Oba dają `PASS`.

## Blokujące
Brak.

## Ważne
- **I1 (kryterium 1).** Opis oderwany od swojego wiersza myli krok 1–3 z krokiem 04. To regres czytelności względem starej wersji, w której nie było wątpliwości, do którego kroku należy opis. Tanie poprawki bez przesunięć układu: (a) numer albo tytuł kroku na początku slotu („02 · A scratch card…”); (b) albo opis w wierszu, z miejscem zarezerwowanym w każdym wierszu na najwyższy opis i samym przejściem opacity. Wiersze stają się wtedy wyższe, ale nic się nie przesuwa.
- **I2 (kryterium 5, istniało wcześniej, teraz gorzej).** Slot zawsze rezerwuje wysokość najdłuższego opisu (2 linie, 14+61 px), więc „No pointer? Scratch today's card” i „Ask how … gets its own app” są ~14 px niżej niż przed zmianą (1440: 719→733 px). Przy 1280x720 z paskiem cookies:
  - link „Ask how…” (641–663) nachodzi na linię postępu aktów (647) i jest ucięty przez pasek cookies (`rev-1280-9.png`);
  - zastępnik dla klawiatury i bez wskaźnika `.nk-alt` (683–707) leży poza dolną krawędzią etapu (663, overflow:hidden), więc jest niewidoczny, choć dostaje fokus po kliknięciu kroku 02.

## Drobne
- **M1.** Przy 1100x620 (krótki laptop z paskiem cookies) wiersz 04 i slot wchodzą pod pasek aktów, a opis jest ucięty (`rev-1100s-9.png`). Słabe miejsce istniało już wcześniej, ale warto dodać próg wysokości.
- **M2.** Selftesty kopiują parsowanie i progi z `gates.sh` zamiast wołać tę samą funkcję. Zmiana w `gates.sh` nie zostanie przez nie złapana (dryf).
- **M3.** Wzorzec broken w scrollperf (252 ms) jest daleko od progu, a calm daje 0. Test nie sprawdza tego, po co jest mediana, czyli że jeden odstający przebieg nie wywraca werdyktu (np. 60,300,70 → PASS). Nie ćwiczy też osobno progu interakcji, bo na stronach wzorcowych nie ma kontrolek.
- **M4.** Oba selftesty używają portu 3199, więc nie mogą biec równolegle.
- **M5.** `steps-stable-check.mjs` mierzy tylko pozycję wierszy. Nie wykryje, że slot albo `.nk-alt`/`.nk-next` wychodzą poza etap (I2).
