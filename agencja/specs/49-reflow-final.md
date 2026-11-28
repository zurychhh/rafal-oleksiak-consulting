# Spec 49 — reflow (WCAG 2.2 SC 1.4.10) na /nawyko i /work/genactiv (R6' p15, 28.11.2026)

Źródło: W3C „Understanding SC 1.4.10 Reflow” (https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) — treść czytelna
bez przewijania w dwóch kierunkach przy 320 px szerokości (= 400 % z 1280) i 256 px wysokości dla treści poziomej;
punkt 14 kolejki wiedzy („sprawdzić /nawyko przy 200 % na 1280×720 i 400 %”) czekał od 24.11.

Kawałek (tylko CSS, bez zmiany treści finału — strefa „nie ruszać” dotyczy treści, to poprawka błędu układu):
- 320 px: kolumna finału „One morning with …” (`.nk-fz-stick` grid `1fr`) rozpychała się nierozdzielnym linkiem
  „Reveal without scratching” — podtytuł chwili i link ucięte na prawej krawędzi. Teraz `minmax(0,1fr)`, `min-width:0`,
  link zawija się ≤ 380 px. Powyżej 380 px i 860 px reguły nie działają (media queries).
Kryteria: tekst w `.nk-fz-stick` nie wychodzi poza okno na 320/360/390; 390/768/1440 bez zmian; fokus linku widoczny.
Nowa bramka `scripts/reflow-check.mjs` (320×568, 640×360): poziomy scroll, tekst poza oknem także pod `overflow:hidden`
przodka, telefon < 150 px; rząd w kontenerze `overflow-x:auto` i wielokropek = INFO.

Wynik bazowy bramki po poprawce (do kolejki, nie naprawione w tym przebiegu):
- `/nawyko` 640×360: telefon finału 26 px szerokości (scena przypięta 500svh, `--hh` = 100svh − pasek cookies − 250 px);
  320×568: telefon finału 108 px w części toru, telefon `.nk-phone` 145 px. Naprawa wymaga trybu bez przypięcia dla niskich
  okien (JS `Finale`: kropki ustawiają chwilę zamiast przewijać) — za duże na koniec przebiegu.
- `/work/genactiv` 320×568: napis „Any colour” wychodzi do 356 px.
Recenzja niezależna (sonnet, osobna sesja): PASS; uwaga kosmetyczna — podkreślenie zawiniętego linku na 320 jest pod
całym polem (border-bottom), nie pod każdą linią.
