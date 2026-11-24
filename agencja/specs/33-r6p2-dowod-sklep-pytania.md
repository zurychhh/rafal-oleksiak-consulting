> Status 21:20: zbudowane, NIE wypuszczone (cofnięcie R6 przez Rafała 20:55). Kod: gałąź `agencja/r6p2-odrzucone`. Do R6' bierzemy tylko integrację i pytania-chipy, bez usuwania sekcji.

# Spec 33 — R6 przebieg 2 `/nawyko`: dowód, „Twój sklep”, pytania zamiast FAQ (24.11.2026 20:40)

Wycinek specu 27, sceny 3, 4 i 6 + decyzja domyślna R6p1-A (b). Budujący A (worktree `wt/a`).
Kolejność strony po zmianie: hero → `#why` → `#cockpit` → `#proof` → `#store` → `#finale` → `#enquiry` (z pytaniami).

## Kryteria
1. **`#proof` — jeden pełnoszerokościowy moment na atramencie** (nie kolumna tekst + wykres): jedno zdanie-myśl, jeden wykres
   (krzywa z aplikacją vs grupa kontrolna, istniejący suwak grupy kontrolnej zostaje jako jedyna kontrolka), podpis „Example”.
   Drugi wykres (kropki końca opakowania) wypada z `#proof` (zostaje dostępny pod `/calculator`/`/tool` — link jednym słowem nie jest wymagany).
   Zero dodatkowych akapitów poza jednym zdaniem + wynikiem `aria-live`.
2. **`#store` — „Your store” osobna, krótka, wizualna, na papierze (oddech)**: schemat sklep odwiedzającego ↔ adapter ↔ aplikacja
   {marki} (nazwa i kolor z silnika marki). Silniki tekstem, bez logo: Shopify, WooCommerce, Shoper, IdoSell, PrestaShop,
   Magento / Adobe Commerce, własny sklep przez API i webhooki; zakupy w aptece i drogerii przez paragon. Interakcja: wybór silnika
   (radiogroup / przyciski aria-pressed) zmienia podpis adaptera i stan („Ready” tylko Shopify; reszta „Connected in your setup week”).
   Zdanie uczciwe: Shopify gotowy, pozostałe podłączamy w tygodniu wdrożenia. Kody jednorazowe w sklepie marki, dane zostają u marki.
   Zastępuje `#integrations` (pasek 5 kart usunięty).
3. **Pytania zamiast FAQ** w `#enquiry`: obok formularza 5–6 chipów (przyciski) z pytaniami z `FAQ` (content.ts), klik → odpowiedź
   wjeżdża jak wiadomość (dymek, podpis „Rafał”), bez akordeonu, bez `<details>`. Pełna treść wszystkich odpowiedzi zostaje w DOM
   (ukryte wizualnie, ale dostępne, np. nieaktywne dymki z `hidden=until-found` albo lista sr-only) i w FAQPage JSON-LD (bez zmian).
   Sekcja `#faq` usunięta. `aria-live="polite"` na dymku. Reduced motion: bez wjazdu.
4. **HeroGap** (kalkulator luki pod hero) usunięty z `/nawyko` (decyzja domyślna R6p1-A b); w `#why` jedna linia-link
   „Work out your own gap → /calculator”. Komponent zostaje w `app/calculator/`.
5. Rozdziały (ChapterBar `CHAPTERS` i SiteNav w `page.tsx`): Your app · Why · How it works · Proof · Your store · One morning · Ask.
   Żadnych linków do usuniętych id (`#faq`, `#integrations`, `#evidence`).
6. Kontrast AA w każdym kolorze marki (użyj `inkOn`/`onColour` z silnika), każdy telefon ≥ 150 px (WebKit), CLS 0, brak nazwy demo po
   wpisaniu własnej (bramka `brand-propagation`), martwy CSS usunięty.
7. Teksty: angielskie, krótkie, bohaterem marka klienta; `node scripts/copy-voice.test.mjs` PASS; nowe teksty dopisane do
   `agencja/teksty-do-akceptacji.md`. Żadnych liczb bez źródła (przykłady oznaczone „Example”).
