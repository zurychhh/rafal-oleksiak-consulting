# Spec 30 — R5 p3 (cz. 1): Paths / Pharmacy / Privacy w trzech różnych układach (24.11.2026)

Źródło: bramka `monotonia` 36 — sekcje 9–11 to „tekst + telefon” w lustrze, dwie oceniane „nudne”.

## Kryteria
1. Trzy różne układy i trzy powierzchnie: `#paths` papier, poziomy pas pięciu lekcji + karta mety (bez telefonu);
   `#pharmacy` cała sekcja w kolorze marki, telefon na środku, karty „Bought online” / „Bought in a pharmacy”, przycisk pod telefonem;
   `#privacy` atrament, wielkie zdanie (h2 bez zmian), pod nim przełącznik · zapis danych („Stored” / „Never sent to”) · telefon.
2. Każda sekcja reaguje: lekcje klikalne (pas postępu w kolorze marki), skan zmienia telefon i kartę, przełącznik zgody zmienia telefon i zapis.
3. Stan początkowy `#pharmacy` = przed skanem (recenzja 38: wynik przed kliknięciem przeczył przyciskowi).
4. Ciemny kolor marki (kontrast z #0E0F12 < 2): `#privacy` na glinie, żeby nie było dwóch czarnych bloków pod rząd.
5. Nagłówki h2 bez zmian (JSON-LD `FEATURES`), id sekcji bez zmian (pasek rozdziałów).
6. Bramki: `gates.sh /nawyko` (w tym WebKit 390/1440, brand-propagation), lint bez nowych ostrzeżeń, czytelnik-kupujący, recenzja niezależna.
