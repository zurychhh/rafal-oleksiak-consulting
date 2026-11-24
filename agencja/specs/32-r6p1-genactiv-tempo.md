# Spec 32 — R6 p1 `/work/genactiv`: tempo, czytelność, urozmaicony układ (budujący B, 24.11.2026)

Źródło: Rafał (p4 ze specu 26, spec 27 „/work/genactiv”): strona bardzo dobra, ale trudna w czytaniu, przewija się za szybko,
historia ma być jaśniejsza, układ mniej monotonny. Finał zdrapki bez zmian. Granice `realizacja-genactiv.md` bez zmian.

## Kryteria
1. Wolniej: ok. 1,4 wysokości ekranu przewijania na akt.
2. Jedna myśl na ekran; tekst wchodzi dopiero po ustabilizowaniu telefonu.
3. Numer aktu i krótkie streszczenie widoczne cały czas.
4. Różne układy aktów, bez psucia mechaniki przypiętej sceny.
5. Bez zmian: CLS 0 przy przewijaniu (clsscroll), czytelna wersja reduced-motion, klawiatura, Safari (bez max-width:100%
   na telefonie z aspect-ratio+height), telefon ≥ 150 px na 390.

## Zrobione
- `.ga-track` 1320svh → 1540svh (11 × 140svh); rezerwa `[data-ga-pin] .ga-still` tak samo.
- Nagłówek wjeżdża przesunięciem w 2–18% aktu (krycie 1 — zawsze jeden czytelny nagłówek), reszta tekstu (`--late`)
  wygasa w 12–30% aktu; ekran telefonu i zmiana strony kończą się przed początkiem aktu. Zdrapka (3), hero (0) i finał (10) bez opóźnienia.
- Pigułka „Act N of 11 · streszczenie” z paskiem postępu: absolute w scenie, jedna linia, stała wysokość (bez CLS);
  desktop u góry po lewej, telefon nad tekstem (padding sceny 18 → 44 px, `--ph` −26 px). W układzie statycznym ten sam
  wiersz nad kickerem każdego aktu.
- Układy: telefon po prawej / po lewej naprzemiennie (akty 2, 4, 6, 8 — zamiana transformem translateX o szerokość kolumny
  + odstęp, `cqw` kontenera sceny, w ostatnich 15% aktu); akt 1 („The problem”) w pełnym kolorze marki (warstwa `.ga-flood`,
  zmienia się tylko krycie) i wielką czcionką (`.ga-big`, klasa statyczna). Układ statyczny: co drugi akt odwrócony (≥ 1024 px),
  akt 1 na kolorze. Na kolorze bez cienia telefonu (inaczej ciemny prostokąt przycięcia).

## Zostało / ryzyka
- Czytelnik-kupujący dla nowych etykiet (wpis w `teksty-do-akceptacji.md`).
- Akt „wyśrodkowany wielką czcionką” nie powstał osobno: wielka czcionka jest w akcie 1 na pełnym kolorze; środek wymagałby
  zdjęcia telefonu z kadru w jednym akcie — decyzja dla Leada.
- Zrzuty: `agencja/podglad/r6p1b-{m,d}-*.png`.
