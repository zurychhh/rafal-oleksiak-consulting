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

## Wykonanie A (24.11.2026)

**(i) Scena.** `Story` → nowy komponent `NeverScene` (`app/nawyko/NawykoClient.tsx`, stała `NEVER` = trzy przełączniki), układ
`nk-still` jak pozostałe sceny: panel marki (`nk-desk2`, nagłówek „{marka} · brand panel · Example” jak w `#exchange`) z trzema
`<button role="switch" aria-checked="false">`, telefon obok (nad panelem na 390) w widoku „Rewards · listed from day 1”, dzień 17 —
nagrody stałe, nic się w nim nie zmienia. Kliknięcie (mysz, dotyk, Space, Enter): gałka jedzie w prawo, drga i wraca;
`aria-checked` zostaje `false` cały czas (przełącznik naprawdę się nie włącza). Zdanie wyjaśnienia w `aria-live="polite"`,
miejsce zarezerwowane (`min-height` 3 linie, 4 linie ≤ 420 px) — wysokość sekcji przed/po kliknięciu: 1165/1165 px (390),
846/846 px (1440). `prefers-reduced-motion`: animacja `none`, treść ta sama. Stary `IntersectionObserver` sceny (`seen`) usunięty —
render serwera = render klienta. Teksty: `agencja/teksty-do-akceptacji.md`, sekcja „R4 przebieg 5”.

**Kotwica — przyczyna inna niż w hipotezie.** Wysokości dzieci `#enquiry`, `.nk-never`, FAQ i stopki z HTML-a serwera (chunki JS
zablokowane, skrypty inline działają) i po hydratacji są **identyczne** na 390 i 1440 (przed i po zmianie). Przesunięcie robi
podmiana kroju: Instrument Sans ma `font-display:swap`, więc ~190 ms po pierwszym malowaniu tekst przechodzi z kroju systemowego
na właściwy, każda sekcja nad kotwicą zmienia wysokość (np. `#how` 4340→4294, `#proof` 1473→1432 na 390), a zakotwiczenie
przewijania przesuwa treść `#enquiry`. Dowód: z zablokowanymi plikami `.woff2` CLS = 0,000 na obu szerokościach.
Rezerwa wysokości na kontenerze nic by tu nie dała (wysokości po hydratacji się nie zmieniają), więc poprawka jest u źródła:
`nawyko.css` deklaruje ten sam plik pod nazwą „NK Instrument Sans” z `font-display:optional`, `.nk` używa tej nazwy, a `page.tsx`
dokłada `preload` pliku latin. Krój jest gotowy przed pierwszym malowaniem albo (bardzo wolne łącze, pierwsza wizyta) zostaje
systemowy do końca tej wizyty — nigdy nie podmienia się w trakcie. Inne trasy bez zmian (`app/fonts.css` nietknięty).

CLS surowy (suma wszystkich `layout-shift`, także bez `hadRecentInput`), `goto('/nawyko#enquiry')`, Chromium, 3 przebiegi, `next start`:

| Szerokość | Przed | Po |
|---|---|---|
| 390×844 | 0,168 / 0,200 / 0,168 | 0,000 / 0,000 / 0,000 |
| 1440×900 | 0,106 / 0,106 / 0,106 | 0,000 / 0,000 / 0,000 |

Ryzyko do obserwacji: przy pierwszej wizycie na wolnym łączu strona może zostać w kroju systemowym (tak działa `optional`);
przy kolejnych plik jest w pamięci podręcznej.
