# Spec 11 — /nawyko, runda 4: sceny (d) ścieżki z prezentem, (e) apteka, (f) prywatność

Wzór: komponent `Loyalty` (sekcje `nk-still`: tekst + żyjący telefon). Jedna myśl = jedna scena. Marka pokazowa `DEMO_BRAND`
(albo nazwa wpisana przez odwiedzającego). Treść po angielsku.

## Sceny
- **(d) `#paths`** — „For your customer · Learning paths”. Przycisk „Next lesson” przesuwa postęp 1→5; po 5. lekcji telefon
  pokazuje medal i „Gift added to your next order”; „Start again” wraca do 1. Tytuły lekcji generyczne („Lesson 3 of 5”),
  zero treści o zdrowiu. Korzyść marki: sprzedaż krzyżowa bez reklamy.
- **(e) `#pharmacy`** — „For you · Pharmacy purchases”. Telefon: kod kreskowy (SVG), linia skanera (animacja transform),
  potem „Purchase confirmed · pharmacy”. Przycisk „Scan the box” odtwarza skan. Korzyść: marka widzi klientów offline.
- **(f) `#privacy`** — „For you · Privacy”. Bez zgody funkcje widoczne i zablokowane; w telefonie klikalny przycisk
  „Turn on and unlock” odblokowuje karty. W panelu dwa symetryczne przełączniki stanu. Bez twierdzeń prawnych.
- **Dodatkowo `#exchange` na ≤ 860 px:** mniejszy telefon, żeby suwak i telefon mieściły się razem w 390×844.

## Kryteria akceptacji
1. Nagłówek ≤ 12 słów, korzyść marki w pierwszych słowach, plus jedno zdanie; `copy-voice.test.mjs` zielony.
2. Liczby w telefonie tylko jako przykład (podpis „Example” przy scenie). Zero prawdziwych marek, zero twierdzeń zdrowotnych,
   nagrody stałe (nigdy losowe).
3. Bez JS i w `prefers-reduced-motion` stan domyślny jest kompletny i czytelny (postęp ścieżki, potwierdzony zakup,
   zablokowane funkcje z przyciskiem); ruch tylko `transform`/`opacity`, bez zmian `height`.
4. Wszystkie kontrolki to `<button>` (klawiatura), stan w `aria-pressed`/`aria-live`. Przycisk w telefonie nie siedzi
   w poddrzewie `aria-hidden`.
5. Build, `tsc`, lint (0 błędów, ≤ 1 ostrzeżenie jak przed zmianą), `qa.js /nawyko --scroll` PASS,
   `focus-obscured.test.mjs` PASS.
6. Zrzuty 390×844 i 1440×900 każdej sceny w `agencja/podglad/nawyko-r4-<scena>-<szer>.png`: telefon czytelny,
   nic nie nachodzi na tekst.
7. Nowe teksty dopisane do `agencja/teksty-do-akceptacji.md` (status „nowy”).
