# Spec 47 — R6' p13 (28.11.2026 06:38): płynne zwinięcie pigułki aktu + `gates-bg.sh`

Źródło: kolejka R6'-N12 pkt 1 i 4 (recenzja 53b drobne; urwany przebieg bramek w tle 28.11).

## A. `/work/genactiv` — pigułka „ACT N OF 11 · tytuł” bez skoku szerokości
- Przy wjeździe paska aktów (≥ 760 px) tytuł i kropka zwijają się płynnie (max-width + krycie, 0,28 s, ta sama krzywa co zjazd), nie skokiem.
- Po schowaniu paska tytuł rozwija się tak samo. < 760 px bez zmian.
- `prefers-reduced-motion`: bez przejść (stan końcowy od razu).
- Bez interpolate-size (Chromium only, caniuse) — stała górna granica `max-width: 480px` działa w WebKit.
- Kryteria: `prog-overlap` PASS (1100×620, 1280×720, 1440×900, 390×844), `sticky-fixed` PASS, CLS 0, WebKit 390/1440 PASS,
  zrzut w połowie przejścia pokazuje pigułkę o szerokości pośredniej.

## B. `scripts/gates-bg.sh` — bramki w tle, które przeżywają koniec wywołania powłoki
- `setsid` + pliki `run.pid`, `run.out`, `run.rc`; `--wait <katalog> [s]` drukuje tabelę i kończy się kodem gates.sh,
  kod 3 = nadal trwa, kod 4 = proces zniknął bez `run.rc` (przerwany — nigdy cichy PASS).
- Kryterium: przebieg odpalony w jednym wywołaniu narzędzia kończy się i zapisuje `run.rc` w następnym.
