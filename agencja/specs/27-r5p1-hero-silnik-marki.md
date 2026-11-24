# Spec 27 — R5 p1: hero z żywym ekranem aplikacji + silnik marki (24.11.2026 13:38–14:30)

Źródło: spec 26 (uwagi Rafała 1, 3, 6; kolejność p1). Zakres: `/nawyko` hero, wycieki nazwy demo, dubel w finale, silnik marki
wspólny z `/work/genactiv`, bramka `brand-propagation`.

## Kryteria (wszystkie sprawdzone)
1. Pierwszy ekran 390×844, 1280×720 i 1440×900 pokazuje ekran aplikacji (ciemny „Today”: monogram + nazwa, „Sample data”,
   tarcza 30 dni wokół opakowania, 3 kafelki, karta dnia do zdrapania w kolorze marki, „Next reward”, dolne zakładki).
2. Silnik marki `app/lib/brand-engine.ts`: jeden stan (nazwa, kolor) w `localStorage` (`oc-brand-v1`, try/catch), `useSyncExternalStore`;
   wpis w hero albo w scenie white label zmienia każdy telefon, akcent strony (`--red`), finał i akt „Your brand” na `/work/genactiv`.
   Kolor nie trafia do formularza ani analityki.
3. Zero nazwy demo w widocznym tekście po wpisaniu własnej (`Phone.brand` jest teraz wymagane — kompilator łapie każde wywołanie bez marki).
4. Finał bez zdublowanej personalizacji: bez wyboru koloru i bez „Your customers' daily app, in your brand colour.”; nagłówek
   „Build {marka}’s app.” / „Build your brand’s app.”.
5. Powracający gość z zapisaną marką nie widzi mignięcia nazwy demo (R22).
6. Bramki: build · tsc · lint (0 błędów) · `gates.sh /nawyko /work/genactiv` z nowymi `brand-propagation` (Chromium) i
   `brand-prop-webkit` (Safari, z samotestem: bez marki MUSI być FAIL).

## Poza zakresem (p2–p4)
Kategoria produktu w silniku (jednostki, przykładowe nagrody), wielki finał ze zdrapką i odsłanianiem, przebudowa sekcji od „Cashback”
w dół na prawdziwe ekrany, powierzchnie przeplatane, tempo `/work/genactiv`, bramka `monotonia`.
