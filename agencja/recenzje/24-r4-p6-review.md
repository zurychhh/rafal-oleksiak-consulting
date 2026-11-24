# Recenzja 24 — R4 przebieg 6 (spec 16), niezależny recenzent

Zakres: `git diff b8c1f1d..HEAD -- scripts app` — (A) link „The Nawyko app” w nagłówku `/` (ship-design → `generated.ts`, zasada 11 w content-rules); (B) `/work/genactiv`: stała rezerwa pod pasek cookies w stopce + zapasowy krój „Montserrat Fallback”.
Sprawdzone na `localhost:3000` (Chromium 1243 + WebKitGTK), 24.11.2026. Zrzuty: `/tmp/claude-0/rev24/`.

## Rubryka

| Punkt | Wynik | Dowód |
|---|---|---|
| Oferta czytelna w 5 s, `/` 390×844 | PASS | Nagłówek 91 px, oba linki w jednym wierszu (y 49), H1 od y 99, formularz i cena nad zgięciem. Link atramentem, ta sama waga co `/tool` — nie konkuruje z H1 ani z SEND. |
| Oferta czytelna w 5 s, `/` 1440×900 | PASS | Nagłówek 52 px, linki po prawej (x 934 i 1089), reszta pierwszego ekranu bez zmian. |
| Zero kiczu | PASS | Bez nowego koloru, ikony, ruchu; wersaliki + podkreślenie jak istniejący link. |
| Brak przesunięć układu | PASS | Surowy CLS `/` = 0 (390, 1440, z i bez reduced motion); `/work/genactiv#enquiry` = 0 (390, 1440, z paskiem i po zgodzie). |
| Klawiatura | PASS | Pierwszy Tab → „The Nawyko app”, drugi → `/tool`; obrys 1 px atramentu widoczny (zrzut `home-390-focus.png`). |
| prefers-reduced-motion | PASS | Te same pozycje i CLS 0 przy `reduce`; zmiana nie dotyka ruchu. |
| Silnik Safari | PASS | `webkit-check.py` 390 (okno 447) i 1440: PASS, nagłówek w jednym wierszu, nic się nie nakłada (`wk390-0.png`, `wk1440-0.png`). |
| Brak prawdziwych marek w części aplikacji | PASS dla diffu | Diff nie dodaje żadnej marki. Uwaga niżej (drobne, sprzed zmiany). |
| Liczby bez źródła | PASS | Diff nie dodaje liczb w treści. |
| Dół `/work/genactiv`, z paskiem | PASS | Pasek leży na rezerwie, nie przykrywa linków stopki (390: linki y ~691, pasek od ~767; 1440: linki y 779, pasek od ~843). |
| Dół `/work/genactiv`, po zgodzie | PASS z uwagą | Pusta ciemna przestrzeń pod linkami: 144 px na 390, 112 px na 1440. Ciemne na ciemnym, czyta się jak margines końca strony, nie jak dziura — ale na 390 jest wyraźnie za duża. |

## Blokujące
Brak.

## Ważne
1. **„The Nawyko app” nie mówi, czym jest Nawyko.** Kupujący na `/` nie zna nazwy; link konkuruje w nagłówku z „Check your own gap — free”, który mówi korzyść. Jak naprawić: puścić tekst przez czytelnika-kupującego (bramka tekstów, osobna od tej recenzji); jeśli nie przejdzie — krótki dopisek korzyści w tym samym linku (np. nazwa + 2–3 słowa o powracających klientach), bez nowego elementu.

## Drobne
1. **Rezerwa po zgodzie za duża na 390** (112 px rezerwy przy pasku 78 px, łącznie 144 px pustego dołu; na 1440 72 px przy pasku 57 px). Jak naprawić: rezerwę liczyć tylko przy braku zgody — mały skrypt inline w `<head>` trasy ustawia atrybut na `<html>` z `localStorage['cookie-consent']` przed pierwszą klatką (bez CLS), a CSS daje rezerwę tylko `html:not([data-consent])`; albo przynajmniej zrównać rezerwę z wysokością paska (~80 / ~60 px).
2. **Obrys fokusu linku w nagłówku** (padding 14 px / margin −14 px) zachodzi na kreski podpisu i czerwoną linię pod nagłówkiem. Widoczny i działa, ale brudzi. Jak naprawić: `outline-offset` ujemny albo mniejszy pionowy padding tylko dla `:focus-visible`.
3. **Linki nagłówka na 390 mają 10,5 px** (wersaliki, odstęp 1,5 px). Czytelne, ale na granicy. Jak naprawić: przy kolejnej wersji nagłówka rozważyć 11 px i krótszy tekst zamiast mniejszego kroju.
4. **Sprzed zmiany, poza diffem:** JSON-LD w layoucie i szablon `/` wymieniają „Genactiv” (lista pracodawców), więc nazwa pada też w źródle `/nawyko`. Nie wizualnie w części aplikacji, ale warto, by właściciel świadomie to potwierdził. Jak naprawić: jeśli zasada „GENACTIV tylko na /work/genactiv” ma objąć też dane strukturalne — zawęzić JSON-LD per trasa.
