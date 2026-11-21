# Kawałek 01 — podstrona `/nawyko` z pokazem na telefonie sterowanym przewijaniem

Data: 21.11.2026 · gałąź `agencja/strona` · trasa pisana ręcznie (nie eksport Claude Design).

## Cel biznesowy
Pierwsze miejsce na stronie, które sprzedaje własną aplikację: marka FMCG ma w 5 sekund
zrozumieć, co to jest (aplikacja nawykowo-lojalnościowa pod jej logo), zobaczyć ją w działaniu
i zostawić zapytanie.

## Zakres
- `app/nawyko/page.tsx` (metadata, JSON-LD), `NawykoClient.tsx` (scena), `nawyko.css`.
- Pokaz na zmyślonej marce „Tovemi” (sprawdzenie nazwy: `agencja/research/marka-pokazowa.md`).
- Przypięta scena, 4 kroki: potwierdzenie zakupu → zdrapka dnia (do zdrapania palcem/myszą) →
  seria dni (siatka 30 dni) → pieczątka po 24 z 30 dni i kod na kolejne opakowanie.
- Sekcje: nagrody znane z góry, co dostaje marka, white label (przełącznik motywu), czego
  aplikacja nie robi, formularz zapytania → istniejące `/api/lead` (`form: "nawyko"`).
- Wpis w `sitemap.ts`. Strony głównej nie zmieniamy (link z `/` to kawałek c).

## Kryteria akceptacji
1. Build, `tsc --noEmit`, lint bez nowych błędów i ostrzeżeń; `qa.js` PASS na `/nawyko` (localhost).
2. W 5 sekund na pierwszym ekranie (390 i 1440): czym jest Nawyko i dla kogo + droga do zapytania.
3. Scena działa myszą, palcem i z klawiatury (kroki są przyciskami; zdrapka ma przycisk zastępczy).
4. `prefers-reduced-motion` i `navigator.webdriver`: brak przypięcia i ruchu, cała treść czytelna.
5. Bez JS treść kroków jest w HTML (stan końcowy = stan domyślny DOM).
6. Zero prawdziwych marek klientów; zero procentów, cen i liczb bez źródła (24 i 30 pochodzą
   z opisu mechaniki; liczby na ekranie telefonu są podpisane jako pokaz na zmyślonej marce).
7. Zero losowych nagród i twierdzeń zdrowotnych w treści.
8. Paleta i krój strony głównej (papier #F7F5F0, tusz #14161A, Instrument Sans, linie 1 px);
   czerwień tylko jako zmierzona wartość (licznik serii), jedna czerwona płaszczyzna.
9. Zero żądań do zewnętrznych hostów; brak nowej biblioteki; CLS < 0,05; brak poziomego przewijania na 390.
10. Formularz: obie zgody domyślnie odznaczone, kontaktowa wymagana, stan „wysłane” dopiero po 2xx,
    czytelny błąd z adresem e-mail.
