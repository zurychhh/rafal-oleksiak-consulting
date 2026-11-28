# Spec 53 — PILNE TERAZ 2 (Rafał 28.11.2026 11:33): /nawyko

## Pkt 1 — „Reveal without scratching” po zmianie marki (BŁĄD)
Przyczyny (odtworzone w Chromium i WebKit, test `reveal-after-brand` na starym buildzie: 16 × FAIL):
- karta dnia w hero i w finale raz odsłonięta (samozdrapka w hero po 3,2 s, przewinięcie finału do chwili ≥ 3,
  kliknięcie) zostawała odsłonięta na zawsze; po zmianie nazwy/koloru/stylu przycisk był `aria-disabled` i nic nie robił;
- pędzel zdrapki dziedziczył `strokeStyle` prążków folii (alfa .16): na karcie w kolorze marki przeciąganie zdejmowało
  tylko 16 % folii, karta nigdy nie zaliczała się jako zdrapana (próg 42 % przezroczystych pikseli).
Poprawka: zmiana marki (nazwa, kolor, styl) = nowa karta: `done`/`scratched` wraca do false (zmiana stanu w renderze,
`useBrandChanged`), płótno maluje się od nowa z nową folią, bez ponownej samozdrapki w hero; finał odsłania kartę sam
tylko przy zmianie chwili; pędzel z pełnym kryciem.
Kryteria: `node scripts/reveal-after-brand.mjs` i `xvfb-run -a python3 -I scripts/reveal-after-brand-webkit.py` = PASS
(390 i 1440, hero i finał: reveal0, rearm1, drag1, reveal1, rearm2 po samej nazwie, reveal2); kontrola pozytywna na
buildzie sprzed poprawki = FAIL. Oba w `gates.sh` na stałe przy `/nawyko`.

## Pkt 3 — przerywniki rozdziałów (w toku, ten przebieg)
## Pkt 2 — przypięte sceny „Cashback…” i „Any store engine…” (w toku, termin 13:40)
