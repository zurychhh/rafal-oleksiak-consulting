# Recenzja 19 — R4 /nawyko (#paths, #pharmacy, #privacy, #exchange) + /work/genactiv przebieg 1

Recenzent niezależny, 23.11.2026, localhost:3000, Playwright (webdriver=false), 390×844 i 1440×900, DPR 1.
Zrzuty: `agencja/podglad/rec19-*.png` (arkusze: `rec19-sheet-gen390.png`, `rec19-sheet-gen1440a/b.png`,
`rec19-sheet-naw390.png`, `rec19-sheet-kb-rm.png`), dane: `rec19-res.json`, `rec19-res2.json`.

## Pomiary
- Błędy konsoli: 0 na obu trasach, obu szerokościach.
- Poziomy overflow: brak (scrollWidth = clientWidth: 390/390, 1440/1440).
- CLS (suma surowych layout-shift, pełne przewinięcie, buffered): /nawyko 390 = 0,0005; /nawyko 1440 = 0,010;
  **/work/genactiv 390 = 0,225** (drugi pomiar 0,093 — jedna zmiana przy y≈400: `.ga-phone` 422→280 px, `.ga-glow`,
  `figcaption`, `.ga-home-row` 0→689); /work/genactiv 1440 = 0,068.
- Reduced motion: /work/genactiv — pełna treść wszystkich aktów 0–4 w statycznym stosie (h1, 4×h2, „Reveal without scratching”,
  podpisy „Example screen…”, CTA). /nawyko — cztery sceny mają pełny tekst (403–428 znaków każda) przy obu szerokościach.
- noindex: `<meta name="robots" content="noindex, nofollow">` na /work/genactiv.
- Klawiatura /nawyko: Next lesson, Scan the box, Without/With consent, suwak kursu (input), Cashback, Levels — wszystkie w kolejności
  Tab, fokus widoczny (outline 2px #14161a), Enter działa (zmiana treści, `aria-pressed=true` na przełączniku zgody).
- Klawiatura /work/genactiv (1440): kolejność Tab = Skip → logo → „See it with your brand →” → stopka.
  **„Reveal without scratching” jest nieosiągalny Tabem** (warstwa aktu ma `visibility:hidden`, GenactivClient.tsx:503/521),
  więc wymóg specu „zdrapka działa z klawiatury” nie jest spełniony w trybie przypiętym.
- Marki: tekst widoczny /nawyko bez GENACTIV. W HTML /nawyko jest „Genactiv” w JSON-LD (Organization.description:
  „Fifteen years at Allegro, mBank, Booksy and Genactiv”) — wspólny schemat strony, niewidoczny, ale to prawdziwa marka w kodzie /nawyko.

## Rubryka
1. Oryginalność — PASS. Pudełko w CSS 3D, z którego wyjeżdża telefon, i pierścień gasnący w połowie to własny język, nie szablon.
   /nawyko: jedna makieta telefonu przez sceny, spójna z resztą strony.
2. Czytelność oferty w 5 s — PASS (/nawyko: nagłówek-korzyść każdej sceny: „Cross-selling without ads…”, „Pharmacy buyers become
   visible…”, „Health data never reaches your marketing.”, „You set what the programme costs.”). /work/genactiv: PASS — h1 + zdanie
   mówią: prawdziwa marka, aplikacja, co robi klient.
3. Zero kiczu — PASS. Poświata pod pudełkiem i linia skanera mają funkcję (światło sceny, akcja skanu). Jedna uwaga: na 1440
   hero pierwszy ekran to w 60% pusta czerń z pudełkiem przy dolnej krawędzi.
4. Płynność / brak nakładania telefonu na tekst — PASS z uwagą. Telefon nigdzie nie wchodzi na tekst (1440: kolumny; 390: tekst nad
   telefonem). Uwaga: w przejściach między aktami oba nagłówki są jednocześnie prawie przezroczyste (zrzut gen-1440-04, gen-390-04:
   „Purchase proof…” w ~15% krycia) — przez ~0,5 ekranu przewijania nie ma czego czytać.
5. Brak przesunięć układu — **FAIL** na /work/genactiv 390 (0,093–0,225; telefon przesuwany layoutem, nie transformem). /nawyko PASS.
6. prefers-reduced-motion — PASS (pełna treść, zrzut `rec19-gen-rm-1440-full.png`).
7. Klawiatura — /nawyko PASS; **/work/genactiv FAIL** (przycisk „Reveal without scratching” poza kolejnością Tab).
8. Brak prawdziwych marek w /nawyko — PASS dla treści widocznej (Tovemi DEMO). Ryzyko: „Genactiv” w JSON-LD (patrz wyżej).
9. Liczby z podpisem — PASS. /nawyko: „Lesson 4 of 5”, „100 / 50 / 200”, „€3.00” mają ramkę EXAMPLE lub makietę „TOVEMI DEMO”.
   /work/genactiv: 15, 17, 18, 30 of 30, Day 24 — każdy ekran z „Example screen, not a screenshot of the app.”
10. Granice specu GENACTIV — PASS: brak stawek, cen, liczb sprzedaży, zdjęć produktu i logo-pliku (napis tekstem), brak zrzutów
    prawdziwej aplikacji, brak twierdzeń zdrowotnych („after the daily dose” jest neutralne), noindex obecny.
11. Test 10 sekund — /nawyko 390/1440 PASS (co to, co z tego marka, przycisk sceny). /work/genactiv 1440: wiem co to i kto; „co kliknąć”
    słabo — jedyne CTA na samym końcu, pierwszy ekran bez linku. 390: jw.; dodatkowo baner cookies zasłania dolne ~12% każdego
    ekranu, a podpis „Example screen…” ląduje tuż nad nim. Wynik: PASS warunkowy (brak CTA w pierwszym ekranie).
12. „Rozwala mózg”? — Jeszcze nie. Jest ładne i spójne, ale akt 0 to statyczne ujęcie (telefon wysuwa się, nic więcej), zdrapka
    nie zachęca do zdrapania (brak kursora/podpowiedzi „drag to scratch”), a pieczątka 24 dnia w trybie przewijania mija w ułamku
    sekundy. Brakuje jednego momentu „to jest prawdziwe” — np. żywej zdrapki, która po zdrapaniu pokazuje nagrodę znaną z góry
    i od razu podbija pierścień o 1 dzień (przyczyna → skutek w jednym kadrze).

## Lista poprawek (wg wagi)
1. `app/work/genactiv/GenactivClient.tsx:503,521` — nie używać `visibility:hidden` dla warstwy z przyciskiem; zostawić `opacity`,
   dodać `inert` tylko gdy warstwa nieaktywna ORAZ dać przyciskowi `onFocus` → przewinięcie do aktu 2 (albo przenieść przycisk poza
   warstwy). Kryterium: Tab z góry strony dochodzi do „Reveal without scratching”, Enter odsłania kartę.
2. `genactiv.css` `.ga-phone` / `.ga-glow` / `figcaption` — animować pozycję telefonu `transform: translateY()` zamiast top/height/
   marginesu; zarezerwować wysokość `.ga-home-row` (390). Kryterium: CLS ≤ 0,01 na 390 i 1440 (jak /nawyko).
3. Przejścia aktów (GenactivClient, funkcja `vis(i)`) — skrócić strefę crossfade albo przesunąć wejście nowego tekstu, by w każdej
   klatce jeden nagłówek miał krycie ≥ 0,9.
4. Zdrapka (akt 2) — podpowiedź ruchu na folii („Drag to scratch”) + kursor; po odsłonięciu pierścień w akcie 3 rusza od +1 dnia
   (jeden związek przyczynowy widoczny dla oka). To główna dźwignia punktu 12.
5. Pieczątka dnia 24 — dać jej przytrzymanie (~0,4 ekranu przewijania bez zmian), żeby drgnięcie było widać, a nie tylko przeleciało.
6. Pierwszy ekran /work/genactiv 1440 — podnieść pudełko (dziś przy dolnej krawędzi, góra pusta) i dodać drugorzędny link
   „See it with your brand →” w nagłówku albo pod leadem (dziś jedyne CTA na końcu).
7. JSON-LD wspólnego schematu (Organization.description z „Genactiv”) — na /nawyko usunąć/zastąpić, jeśli zasada „zero prawdziwych
   marek w /nawyko” obejmuje kod strony; decyzja do Rafała.
8. 390 — baner cookies przykrywa podpis „Example screen…” i dolne CTA scen (/nawyko #paths „Next lesson”, #pharmacy „Scan the box”
   przy scrollIntoView); zarezerwować `--consent-h` także w tych scenach.
