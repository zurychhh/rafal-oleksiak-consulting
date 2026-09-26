# System agentów — jak to działa

Wszystko chodzi w chmurze jako zadania cykliczne na koncie Rafała. Jedyny wyjątek:
zadania dotykające Claude Design jadą przez Chrome „ROC” na komputerze Rafała
(decyzja Rafała 2026-09-26 — do czasu domknięcia wersji, z której będzie
zadowolony). Pętle GenActiv (LP subskrypcji) są POZA tym systemem.

## Pamięć wspólna i gałęzie (od 2026-09-26 13:50)

- `system/USP.md`, `system/REVIEW.md`, `system/SYSTEM.md` żyją na gałęzi **`claude/system`**
  (Vercel jej nie buduje — `vercel.json`). Każdy agent czyta je stamtąd:
  `https://raw.githubusercontent.com/zurychhh/rafal-oleksiak-consulting/claude/system/system/<plik>`
  (albo `git clone --depth 1 --branch claude/system`). Pisze: strateg (USP.md), recenzent
  i promotor (REVIEW.md) — commit tylko pliku z `system/`, `git pull --rebase`, push na
  `claude/system`.
- Kod produkcji żyje na **`claude/production`** — to jest gałąź produkcyjna Vercela;
  push = wdrożenie domeny. Pushuje wyłącznie promotor po zielonej bramce.
- Dlaczego `claude/…`: zadania cykliczne mogą pushować bez ograniczeń tylko na gałęzie
  z prefiksem `claude/`. `feature/new-site` zostaje jako historia, nie jest już źródłem prawdy.
- Artefakt „Instruments · Staging” (loop-spec) — pamięć pętli narzędzia i łatka.
- Claude Design, projekt 1c71db27-… — strony „Homepage vN …” i „Tool vN …”.

## Cykl (co GODZINĘ, minuty UTC) i role

| minuta | rola                     | co robi |
|--------|--------------------------|---------|
| :05    | Strateg USP              | iteruje rundami (pretendent vs obowiązująca wersja, sędzia parowy), aż nowa wersja WYGRA; brief |
| :15    | Budujący — narzędzie     | pętla /tool w chmurze, łatka w loop-spec |
| :15    | Budujący — Claude Design | jedna mierzona zmiana strony głównej / Tool page |
| :40    | Recenzent całości        | ocenia wszystko wobec USP, wskazuje KANDYDATA |
| :55    | Promotor                 | bramka + push na produkcję tego, co recenzent zatwierdził |

Każdy przebieg każdej roli ma kończyć się postępem. Strateg nie kończy przebiegu bez
zwycięskiej wersji USP (limit bezpieczeństwa 8 rund, potem „blocker” i start od
najmocniejszego pretendenta w następnej godzinie).

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
