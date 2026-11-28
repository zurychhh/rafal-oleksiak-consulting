# Recenzja 53 — R6' p12 (28.11.2026), dwie niezależne sesje (nie widziały budowy)

## 53a — `/tool` preload + `css-leak-static` (sonnet)
BLOKUJĄCE: brak. Potwierdzone samodzielnie: oba pliki fontów istnieją; HTML `/tool` ma dokładnie 2 preloady fontów z crossorigin;
oba kroje faktycznie rysowane (document.fonts loaded, h1 = Instrument Sans); preloady nie trafiają na `/`, `/stop`, `/nawyko`;
CLS ładowania 3× na szerokość: 1440×900 = 0,0000, 390×844 = 0,0025 (`aside.dir`); samotest i przebieg `css-leak-static` PASS;
kontrola pozytywna (bez `require\(`) → FAIL.
DROBNE: (1) hipoteza budującego o `aside.dir` („wcześniej poniżej zgięcia”) FAŁSZYWA — przy zablokowanych fontach przesunięcie
identyczne; efekt starszy, z wypełniania przez runtime → poprawione w specu 46, do kolejki. (2) latin-ext Instrument Sans ładuje się
bez preloadu (CLS 0 — bez zmian bez pomiaru). (3) regex bez granicy słowa → POPRAWIONE (`\b`, przypadek w samoteście, kontrola
pozytywna FAIL bez `\b`). (4) liczby w komentarzu page.tsx (323→242 px) niezweryfikowane, efekt potwierdzony CLS = 0.

## 53b — pigułka `.ga-prog` + `prog-overlap-check` (sonnet)
BLOKUJĄCE: brak. Test PASS na 1100×620, 1280×720, 1440×900, 390×844 (90 pozycji, ~525 elementów, 0 nachodzeń); liczy tekst i ramkę
telefonu; kontrola pozytywna (przywrócony tytuł stylem `display:inline !important`) → 16 nachodzeń, jak przed poprawką.
Zrzuty 1100×620 w górę (akty 3, 6, 9, 10): „ACT N OF 11” + postęp, bez osieroconej kropki, pod paskiem, nie nachodzi na tekst.
W dół — jak przed zmianą (kropka + tytuł). < 760 px bez zmian.
DROBNE: odstęp pigułka–telefon ~8 px; szerokość pigułki zmienia się skokiem razem z wjazdem paska (transition tylko na transform).
