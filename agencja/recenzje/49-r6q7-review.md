# Recenzja 49 — R6' p7 (spec 41): pasek rozdziałów a kokpit, Pharmacy, pasek postępu, Pack rhythm

Recenzent niezależny, 25.11.2026. Build produkcyjny http://localhost:3100 (bez restartu i budowania, bez gates.sh i pomiarów wydajności).
Skrypty i zrzuty: `/tmp/rev49/` (`a*.cjs`, `b.cjs`, `c.cjs`, `d*.cjs`, `f.cjs`, `*.png`).

## Werdykt: FAIL (1 × IMPORTANT)

Poprawka A działa w środku przypiętego kokpitu, ale nie na jego końcu: przy wyjściu z kokpitu dołem i lekkim cofnięciu
pasek rozdziałów znów przykrywa nagłówek i rząd zakładek. B, C, E i F są w porządku, D w przybliżeniu.

## IMPORTANT

**I1. Pasek rozdziałów nadal przykrywa nagłówek i zakładki kokpitu w strefie końca toru (po „06 Pack rhythm”).**
Warunek `r.top <= 1 && r.bottom >= vh - 1` sprawdza tor `.nk-cockpit`, a nie przyklejoną scenę. Gdy dół toru zejdzie
poniżej `vh`, scena jeszcze stoi (albo dopiero zaczyna odjeżdżać), a nagłówek i zakładki są w górnych ~130 px.
Pasek wtedy wraca i przecina „Now the same app…”, a przy dalszym cofaniu także rząd zakładek.
Odtworzenie (`/tmp/rev49/a3.cjs`): kółkiem w dół 8 × 40 px za koniec toru, potem 1 × 40 px w górę.
- 1280×720: ckB=640, pasek 0–53, nagłówek 6–40, zakładki 50–106 → przykryte
- 1440×900: ckB=820, nagłówek 13–51 → przykryty (zrzut `/tmp/rev49/a-endzone-1440x900.png`: zamiast nagłówka pasek „YOUR SIDE”, tuż pod nim zakładki)
- 1920×1080: ckB=1000, nagłówek 20–59 → przykryty
- 1100×620: ckB=540, pasek 0–81, nagłówek 2–32, zakładki 40–96 → przykryte

Skan ciągłego przewijania w górę spod kokpitu (`/tmp/rev49/a.cjs`, krok 40 px) pokazuje przykrycie na ostatnich ~180–280 px
toru przed jego dolną krawędzią: 1280: ckB 568–728, 1440: 740–900, 1920: 872–1112, 1100: 468–668. Po zatrzymaniu
w tym miejscu widać ucięty nagłówek, czyli dokładnie błąd ze spec 41 A, tylko na wyjściu zamiast w środku.
Test `covered` w `cockpit-pin-check.mjs` tego nie łapie: sprawdza tylko punkt lądowania po kliknięciu zakładki
(z tego powodu daje fałszywy PASS na ten przypadek).
Propozycja: pasek ustępuje, dopóki `.nk-ck-head` albo `.nk-ck-tabs` zachodzi na pas paska (np. `tabs.bottom > 0 && head.top < wysokość paska`)
albo warunek liczony z przyklejonej sceny zamiast z toru. Do testu dodać przypadek „za koniec toru + 40 px w górę”.

## Sprawdzone, w porządku

- **A, środek kokpitu:** po 1–4 ruchach kółkiem w górę (po 120 px) pasek się nie pokazuje (`data-on` brak) na 1280×720, 1440×900, 1920×1080 i 1100×620 (`a-in-up-1280x720.png`: nagłówek i zakładki czyste).
  Przed kokpitem i za nim pasek wraca po ruchu w górę na wszystkich czterech rozmiarach.
  Scena „Four steps” zachowuje się jak dotąd: na 1280 pasek z aktem („How it works · 01 Purchase”), na 1024 ustępuje.
  Miganie: przy ciągłym przewijaniu przez cały kokpit są dokładnie 2 przełączenia (wyłączenie przy wejściu, włączenie przy wyjściu górą), bez drgań.
  Fokus klawiaturą: 25 × Tab od elementu przed kokpitem na 1440×900, żadnego elementu z fokusem nie zasłania element `fixed`.
- **B, Pharmacy:** 900×600, 1024×768, 1280×720, 1366×657, 1440×900, 1920×1080 i 2560×1440 bez nakładania bloków i bez wyjścia poza panel.
  Karty mają 214–340 px i nie łamią się. Na 1920 blok 438–1482 px jest wyśrodkowany (po 350 px z każdej strony), telefon blisko kart (zrzuty `b-*.png`).
- **C, pasek postępu:** po kliknięciu zakładek 02, 03, 05 i 06 `--f` = 0,000, potem rośnie monotonicznie przy przewijaniu kółkiem w dół (0,196 → 0,986), bez skoków wstecz.
- **E:** w `cockpit-pin-check.mjs` logika „covered” jest poprawna dla stanu, który mierzy: pomija elementy wewnątrz kokpitu i ukryte (visibility, display, opacity, poza ekranem); próg przecięcia wynosi > 1 px.
  Pasek cookies na dole nie daje fałszywego FAIL. Uruchomienie na 1280×720 daje PASS.
  `brand-propagation-webkit.py`: linia `RESULT` drukuje się po `finally`; przy wyjątku jej brak, więc `run_expect` daje FAIL, i tak ma być.
  `gates.sh`: `run_expect '^BRANDPROP-WK RESULT PASS'` jest poprawny.
- **F:** diff nie zmienia żadnego tekstu ani sekcji. 390×844: kokpit nieprzypięty, pasek działa jak dotąd, brak poziomego przewijania (scrollWidth 390).
  Zmiany CSS i ChapterBar działają tylko przy `[data-pin]`.

## Drobne

1. **D:** kropki dochodzą do kompletu ok. 1,0 s po kliknięciu (z przejściem opacity), a licznik pokazuje 33 przy 1,04 s i 34 dopiero przy ok. 1,33 s.
   Kończą „mniej więcej razem”, z różnicą ~0,3 s. Spec mówi o ~1,2 s dla obu. Przy prefers-reduced-motion stan końcowy jest od razu (74 kropki, 34).
2. **C:** przy naturalnym przewijaniu w dół z poprzedniej zakładki pasek nowej zakładki stoi na 0 przez pierwsze ~120 px odcinka (0,000 → 0,048), bo strefa `a` dotyczy też wejścia kółkiem, nie tylko skoku.
3. **A, wyjście górą:** przy ckT ≈ 1–50 px pasek wjeżdża nad nagłówek przesuwający się w dół. Trwa to ~50 px przewijania; przejściowe i akceptowalne.
4. **B, 2560×1440:** kompozycja jest wyśrodkowana, ale mała względem panelu (dużo czerwonej pustki nad i pod blokiem). Nie jest błędem specu.
5. `gates.sh` wywołuje `cockpit-pin` bez 1920×1080 i 1100×620, choć oba są w domyślnej liście skryptu.

## Poza zakresem

- Po kliknięciu „06 Pack rhythm” panel wchodzi z pełnym wykresem w półprzezroczystości, potem kropki gasną (~0,25 s) i dosypują się od nowa (`/tmp/rev49/d-60.png`, log `d.cjs`).
  Nie wynika z tego diffu (zmienione jest tylko okno 0,25→0,8). Warto sprawdzić, czy przed zmianą było tak samo.

## Dopisek Leada (po recenzji, przed commitem)
I1 poprawione: warunek w `ChapterBar.tsx` liczony z `.nk-ck-head`/`.nk-ck-tabs` przypiętego kokpitu (pasek ustępuje, dopóki
któryś z nich leży w pasie 0–96 px), nie z toru. `/tmp/rev49/a3.cjs` na nowym buildzie: 1280/1440/1920/1100 — `on=false`,
`cov=false`. Test regresji: `cockpit-pin-check.mjs` przypadek `endzone` (za koniec toru + 200 px, potem 14 × 40 px w górę,
na każdym kroku test przykrycia) — na buildzie sprzed poprawki I1: `endzone:FAIL(k0..k3: cb@53)`, na nowym PASS;
w `gates.sh` dodane okna 1920×1080 i 1100×620. Drobne D (kropki ~1,0 s vs licznik ~1,33 s) i C (pasek stoi na 0 przez
pierwsze ~120 px odcinka — świadomie, punkt lądowania = start) zostają do „Następne”.
