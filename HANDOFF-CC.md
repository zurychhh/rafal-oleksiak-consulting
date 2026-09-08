# Zadanie dla Claude Code — wejście nowej strony na produkcję

Ten plik jest kompletnym briefem. Wklej treść sekcji „PROMPT" do Claude Code
w terminalu, w katalogu tego repo. Reszta dokumentu to kontekst dla człowieka.

Stan na 4 września 2026.

---

## Skąd to się wzięło

W sesji Cowork powstała nowa wersja strony głównej i trzy narzędzia. Powodem
było to, że obecna strona jest przegadana i nie widać na niej niszy FMCG ani
ceny. Nowa wersja jest jednym samodzielnym plikiem HTML, przetestowanym
wizualnie na dziewięciu szerokościach.

Wszystko leży w `design/`:

| Plik | Co to jest |
|---|---|
| `design/production/index.html` | nowa strona główna, kompletna, działa z dysku |
| `design/production/api-lead-route.ts` | endpoint `/api/lead` — zod, origin check, Resend, HubSpot |
| `design/production/sheet-email.ts` | dwa maile: sheet dla odwiedzającego, powiadomienie dla Rafała |
| `design/production/lead-hubspot.ts` | upsert kontaktu, ten sam kształt co istniejący `app/lib/hubspot.ts` |
| `design/production/HANDOVER.md` | szczegóły techniczne, czytaj przed portem |
| `design/tools/three-instruments.html` | trzy narzędzia FMCG z wywołaniami AI |
| `design/tools/readiness.html` | pierwsza wersja narzędzia gotowości danych |
| `design/tools/LOOP.md` | rubryka dziennej pętli (kopia; źródłem jest artefakt) |
| `design/CENA-I-LISTA.html` | research cenowy i lista zadań |
| `design/qa.js` | checker Playwright — 9 szerokości, przycięcia, nakładki, kontrast |

Commit z tym wszystkim stoi na gałęzi `tools/daily`, lokalnie, niewypchnięty.

## Co się dzieje codziennie

W chmurze chodzi zaplanowane zadanie „Daily loop — narzędzia i strona". Co rano
bierze jedną z czterech pozycji (trzy narzędzia plus strona), ocenia ją w trzech
wymiarach — AI, użyteczność biznesowa, UX — wprowadza najwyżej dwie zmiany,
sprawdza wynik ponownie, przepuszcza przez QA i zapisuje do artefaktów
roboczych. Dziennik zmian jest wpisany w sam artefakt.

Artefakty robocze (staging):
- narzędzia: https://claude.ai/code/artifact/5bd14496-4c6c-4121-8f09-3c44b11c44d1
- strona: https://claude.ai/code/artifact/8ab87087-0db6-42ae-989f-8ff4ca26b32d

Pętla NIE dotyka repo ani produkcji. Chmura nie ma prawa zapisu do tego
repozytorium — proxy odmawia wstrzyknięcia poświadczeń. Dlatego wypuszczanie
na produkcję dzieje się stąd, z Claude Code, gdzie push działa.

Scheduler zostaje w chmurze. Nie duplikuj go tutaj: lokalny odpaliłby się tylko
przy włączonym Macu, a codzienny automatyczny deploy na żywą stronę bez
przeglądu i tak byłby złym pomysłem.

## Bezpieczeństwo — przed czymkolwiek innym

**To repozytorium jest publiczne.** Sprawdzone: klonuje się anonimowo.
W historii gita leżą jawne sekrety i samo usunięcie ich z plików niczego nie
cofa. Do unieważnienia i wygenerowania od nowa:

1. Google Ads Developer Token — był w `STATUS.md`. Wartość z pliku już usunięta,
   ale w historii i na GitHubie zostaje.
2. Klucz API w `generate-all-notion-assets.sh`, linia 9.
3. Ten sam klucz w `generate-notion-assets-v2.sh`, linia 9.

`.env.example` i `.env.local.example` zawierają same wypełniacze — tam czysto.

---

## PROMPT

Wklej poniższe do Claude Code w katalogu repo.

> Pracujemy w repo rafal-oleksiak-consulting. Przeczytaj najpierw `HANDOFF-CC.md`
> i `design/production/HANDOVER.md` — tam jest kontekst. Odpowiadaj po polsku,
> kod i treść strony po angielsku.
>
> To repozytorium jest publiczne i ma sekrety w historii. Zanim cokolwiek
> wypchniesz: pokaż mi listę plików z jawnymi kluczami i poczekaj, aż potwierdzę,
> że je unieważniłem. Nigdy nie commituj wartości sekretu, nawet do przykładu.
>
> Pracuj na gałęzi `feature/new-site`, nigdy na main. Po każdym etapie
> `npm run build` i `npm run lint` muszą przechodzić, a `node design/qa.js
> <plik> --scroll` musi dawać PASS dla stron statycznych.
>
> ZADANIA, w tej kolejności:
>
> 1. Zależności: `npm i zod` i `npm i -D @eslint/js typescript-eslint
>    @next/eslint-plugin-next`. Uwaga: instaluje się zod w wersji czwartej,
>    a kod jest już napisany tak, żeby działał na obu — nie „poprawiaj" go.
>
> 2. Port strony. Zawartość `design/production/index.html` ma zastąpić stronę
>    główną: `<style>` do modułu CSS, skrypt do komponentu klienckiego, logika
>    bez żadnych zmian. Nie przepisuj logiki „ładniej" — ona jest przetestowana.
>    Zachowaj JSON-LD i meta z head.
>
> 3. Endpoint i helpery. `design/production/api-lead-route.ts` idzie do
>    `app/api/lead/route.ts`, `sheet-email.ts` i `lead-hubspot.ts` do `app/lib/`.
>    Korzystają z istniejących zmiennych `FROM_EMAIL`, `TO_EMAIL`,
>    `RESEND_API_KEY`, `HUBSPOT_API_KEY` — nie wprowadzaj nowych.
>
> 4. HubSpot: `node scripts/hubspot-setup.mjs` (podgląd), potem z `--apply`.
>    Zakłada dziesięć własnych właściwości kontaktu. Idempotentny.
>
> 5. Wycinanie: `bash scripts/purge-legacy.sh` (podgląd), potem `--apply`.
>    Sto siedemdziesiąt pięć plików: radar, lama, MCC, Stripe, admin,
>    auto-publish. Zerwą się dwa miejsca, skrypt je wypisze: `FinalCTA.tsx`
>    strzela do `/api/lama/audit` (przepnij na `/api/lead`) i `Accelerators.tsx`
>    ma kafel radaru do usunięcia. Potem `npx tsc --noEmit`.
>
> 6. Braki na stronie: `public/og.png` w 1200×630 oraz strona `/stop` z jednym
>    polem na adres, do której linkuje stopka każdego maila. Bez `/stop`
>    obiecujemy coś, czego nie da się wykonać.
>
> 7. Sprawdź, czy w środowisku Production na Vercelu są ustawione wszystkie
>    cztery zmienne. Jeśli ich nie ma, build przejdzie, a każde zgłoszenie
>    po cichu zwróci błąd.
>
> 8. Na koniec zaproponuj mi polecenie „ship", które: pobiera aktualną wersję
>    strony ze staging (artefakt podany w HANDOFF-CC.md), wstawia ją w miejsce
>    strony głównej, uruchamia build, lint i QA, i dopiero potem commituje.
>    Ma być uruchamiane ręcznie, nie z crona.
>
> Po każdym zadaniu pokaż mi diff i poczekaj na zgodę, zanim przejdziesz dalej.

---

## Czego ta strona nadal nie mówi

Cena jest wpisana jako widełki osiem do dwunastu tysięcy netto za jedno zadanie.
Sprawdź, czy nie podcina żadnego obecnego klienta, zanim to pójdzie na żywo.

**Uwaga: wcześniej stało tu, że to „jedna stała `PRICE`, zmiana w jednym
miejscu". To nieprawda — miejsc są cztery.** Pełna lista i procedura zmiany:
`design/production/HANDOVER.md`, sekcja „Cena — cztery miejsca".

Plan na stronie obiecuje cztery obszary, a opisany dowód jest dla jednego.
Albo dosypać, co realnie jest na paid i search, albo zawęzić obietnicę.

W JSON-LD brakuje adresu LinkedIna w polu `sameAs` — jest tam komentarz
w miejscu, gdzie ma wejść.
