# Spec 41 — R6' p7: pasek rozdziałów nie zasłania kokpitu, Pharmacy zrównoważona na dużych ekranach, szlif z recenzji 47/48

Przebieg 25.11.2026 14:38. Źródło: STATUS R6'-N6 + nowy błąd znaleziony w tym przebiegu (retro: czego nie widzieliśmy).
NIE RUSZAĆ (RUNDA 6'): hero, „Four steps…”, „Rewards in the app”, finał, zapytanie. Żadna sekcja ani zdanie nie znika, żadnych nowych tekstów.

## A — pasek rozdziałów (ChapterBar) a przypięty kokpit (NOWY BŁĄD)
Odtworzenie: 1280×720, przewiń kółkiem do kokpitu „For you”, potem lekko w górę → pasek rozdziałów (52 px) wjeżdża na górę
i przecina nagłówek kokpitu „Now the same app from your side: what you set, what you see.” w połowie wysokości liter
(`agencja/podglad/r6q7-before-navup-1280x720.png`). Każdy, kto w kokpicie cofnie się o kawałek, widzi ucięty nagłówek.
Żadna bramka tego nie łapała: `focus-obscured` sprawdza fokus, `short-viewport-check` scenę „Four steps”, `cockpit-pin` panele.
Poprawka: gdy przypięty tor kokpitu wypełnia ekran (ten sam warunek co scena: `top <= 1 && bottom >= vh-1`), pasek ustępuje
(jak w scenie na wąskich ekranach — kokpit ma własny rząd zakładek, więc nawigacja w nim nie znika).
Test regresji: `cockpit-pin-check.mjs` — po każdym trybie ruch kółkiem w górę i sprawdzenie, że żaden widoczny pasek
`position:fixed` nie przykrywa nagłówka ani rzędu zakładek kokpitu.

## B — Pharmacy w przypiętym kokpicie na dużych ekranach (recenzja 48 drobne 4)
1920×1080: karty po 602 px, telefon daleko po prawej, środek panelu pusty. Kolumny kart z górną granicą 340 px, cała siatka
wyśrodkowana (`justify-content:center`) — tekst, karty i telefon jednym blokiem. 900–1440 bez zmian w praktyce.

## C — pasek postępu aktywnej zakładki (recenzja 48 drobne 3)
Po kliku pasek startował od ~25 % (cel skoku w głębi odcinka). `--f` liczone od punktu lądowania: `max(0,(f−a)/(1−a))`,
`a = min(seg·0,25,120)/seg` dla zakładek > 0.

## D — Pack rhythm: kropki i licznik kończą razem (recenzja 47 drobne)
Kropki dosypywane w oknie t 0,25→0,8 (było 0,3→0,75); z przejściem opacity kończą ~1,2 s, jak licznik 30→34.

## E — bramki
`brand-prop-webkit` przez `run_expect` (jedna linia `BRANDPROP-WK RESULT PASS|FAIL` + kod wyjścia).

## Kryteria
build · tsc · lint (≤ 1 ostrzeżenie) · `gates.sh http://localhost:PORT /nawyko` PASS (z `cockpit-pin` rozszerzonym o pasek),
test regresji A daje FAIL na starym buildzie · WebKit 390/1440 obejrzany · zrzuty `agencja/podglad/r6q7-*` · recenzent niezależny bez IMPORTANT.

## Po recenzji 49 (I1)
Warunek A liczony z `.nk-ck-head`/`.nk-ck-tabs` przypiętego kokpitu (pasek ustępuje, dopóki któryś leży w pasie 0–96 px),
nie z toru — inaczej pasek wracał na nagłówek w strefie końca toru. Bramka: przypadek `endzone` w `cockpit-pin-check.mjs`
(stary build FAIL, nowy PASS), okna 1920×1080 i 1100×620 w `gates.sh`.
