# System agentów — jak to działa

Wszystko chodzi w chmurze jako zadania cykliczne na koncie Rafała. Jedyny wyjątek:
zadania dotykające Claude Design jadą przez Chrome „ROC” na komputerze Rafała
(decyzja Rafała 2026-09-26 — do czasu domknięcia wersji, z której będzie
zadowolony). Pętle GenActiv (LP subskrypcji) są POZA tym systemem.

## Pamięć wspólna (w repo, gałąź feature/new-site)

- `system/USP.md` — USP i brief dla budujących. Pisze strateg.
- `system/REVIEW.md` — werdykty po każdym cyklu. Pisze recenzent.
- `system/SYSTEM.md` — ten plik.
- Artefakt „Instruments · Staging” (loop-spec) — pamięć pętli narzędzia i łatka.
- Claude Design, projekt 1c71db27-… — strony „Homepage vN …” i „Tool vN …”.

Odczyt bez uprawnień: https://raw.githubusercontent.com/zurychhh/rafal-oleksiak-consulting/feature/new-site/system/<plik>
Zapis: klon z prawem pusha (mcp__claude-code-remote__add_repo, access "push"),
commit tylko plików z `system/`, push na feature/new-site. UWAGA: feature/new-site
jest gałęzią PRODUKCYJNĄ Vercela — każdy push wdraża domenę. Push samych plików
`system/` jest bezpieczny (kod się nie zmienia), ale nigdy nie pushuj kodu poza
promotorem.

## Cykl (UTC, co 3 godziny) i role

| kiedy (UTC)        | rola                     | co robi |
|--------------------|--------------------------|---------|
| codziennie 02:55   | Strateg USP              | atakuje USP, nowa wersja tylko gdy wygrywa, brief |
| co 3 h, :21        | Budujący — narzędzie     | pętla /tool w chmurze, łatka w loop-spec |
| co 3 h, :51        | Budujący — Claude Design | jedna mierzona zmiana strony głównej / Tool page |
| co 3 h +2h, :11    | Recenzent całości        | ocenia wszystko wobec USP, wskazuje KANDYDATA |
| co 3 h +2h, :41    | Promotor                 | bramka + push na produkcję tego, co recenzent zatwierdził |

## Zasady wspólne

1. Każdy przebieg zaczyna się od przeczytania `system/USP.md` i ostatniego wpisu
   `system/REVIEW.md`.
2. Pusta pętla jest zakazana: każdy przebieg kończy się zmierzonym postępem albo
   nazwanym, konkretnym powodem blokady z propozycją obejścia.
3. Żadnych wymyślonych liczb ani faktów o Rafale. Twarde ramy w USP.md.
4. Produkcja zmienia się WYŁĄCZNIE przez promotora, po zielonej bramce i werdykcie
   recenzenta innym niż REGRESJA.
5. Strona główna: źródło to eksport z Claude Design („Publish as artifact”),
   przenoszony `node scripts/ship-design.mjs <bundle> --yes`. Narzędzie: źródło to
   tool-index.html, przenoszone `node scripts/ship-tool.mjs tool-index.html --yes`.
