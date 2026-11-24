# Spec 15 — runda 4, przebieg 5 (24.11.2026 02:40)

Dwa strumienie, dwa worktree, jeden push. Wzór: spec 13 i 14. Fakty o aplikacji (R9): nagrody stałe i znane z góry, nigdy losowe;
zero twierdzeń zdrowotnych; odhaczenie = tylko „data odhaczona”, nic o objawach/celach; dane o zdrowiu nie trafiają do reklam,
analityki, push ani e-maili; nagrody nie zależą od zgody na push/e-mail; nagrody to jednorazowe kody realizowane online.

## A. `/nawyko` — (i) „What it never does” jako scena + kotwica `#enquiry` na 390
Plik: `app/nawyko/NawykoClient.tsx` (`Story` → `.nk-never`, stała `NEVER`), CSS na końcu `app/nawyko/nawyko.css`.

**(i) Scena, w której produkt coś robi (nie trzy zdania):** panel marki obok małego telefonu (albo nad nim na 390) z trzema
przełącznikami, które marka chciałaby włączyć: „Random prize draw”, „Claim: supports immunity”, „Change the reward after the card
is scratched” (brzmienie do bramki tekstów). Każdy przełącznik jest prawdziwym `<button role="switch" aria-checked="false">`;
kliknięcie pokazuje drgnięcie i przełącznik wraca do „off” z jednym zdaniem, dlaczego aplikacja tego nie zrobi (np. „Rewards are
fixed and shown before the first card.”). Telefon w tym czasie pokazuje stałą nagrodę/kartę bez zmiany. Nagłówek sceny ≤ 12 słów
(np. „Three things your team can’t switch on.”), jedno zdanie pod spodem. Ostatnie zdanie sceny: „The app stores only which days
were ticked.” zostaje.
Kryteria: działa myszą, dotykiem i klawiaturą (Space/Enter), `aria-live="polite"` dla zdania wyjaśnienia; `prefers-reduced-motion`
bez drgnięcia, pełna treść; zero przesunięć układu przy kliknięciu (miejsce na zdanie zarezerwowane); telefon w WebKit ≥ 150 px
szerokości; kontrast ≥ 4,5:1 w Paper i Night; teksty przez `copy-voice` + wpis w `teksty-do-akceptacji.md`.

**Kotwica:** `goto('/nawyko#enquiry')` na 390×844 — surowy CLS ≤ 0,05 (dziś 0,115–0,147; sekcja jedzie 92 px w górę po hydratacji).
Metoda: porównać wysokości dzieci `#enquiry`, `.nk-never`, `Faq` i stopki przed/po hydratacji (HTML z serwera vs po montażu);
rezerwa stała, raz, na kontenerze (lekcja R4 p3). Pomiar przed/po: tabela w tym pliku.

## B. `/work/genactiv` — szlif ruchu po serii zrzutów WebKit
Plik: `app/work/genactiv/GenactivClient.tsx`, `genactiv.css`.
1. Seria zrzutów całej sceny co ~8% przewinięcia w WebKit (silnik Safari, 390 i 1440) i w Chromium — znaleźć 2 najbardziej
   widoczne usterki (pusta klatka, ucięty tekst, nachodzenie, telefon poza kadrem, przeskok) i je poprawić. Opisać przed/po.
2. `prefers-reduced-motion`: cała treść widoczna, bez pustych aktów (zrzut).
3. Bez nowych tekstów poza koniecznymi; granice speca realizacji bez zmian (zero liczb, stawek, logo, zdjęć).

## Bramki (oba)
build, `tsc --noEmit`, lint (0 błędów, ≤ 1 ostrzeżenie), `copy-voice`, `qa.js --scroll` na zmienionej trasie (localhost),
`content-rules --url`, `xvfb-run -a python3 -I scripts/webkit-check.py` 390+1440 na zmienionej trasie, recenzent niezależny.
