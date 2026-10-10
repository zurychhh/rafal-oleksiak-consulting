# Brief wdrożeniowy — Oleksiak Consulting

**Design system mieszka w Claude Design**, w projekcie „Oleksiak Consulting"
(`107782f2-7c9d-4950-b48f-4ac5197ccc7f`), a jego źródłem są karty w `design/design-system/`.
Kolory, typografia, ruch, siatka i komponenty są opisane tam i tylko tam — ten plik ich nie
powtarza, żeby nie było dwóch źródeł prawdy.

Tutaj zostaje wyłącznie to, czego karta projektowa nie może powiedzieć: jak ten system wdrażać
w tym repo. Wyjątkiem jest norma czerwieni niżej — to reguła sprawdzana w bramce po każdym
przeniesieniu, więc musi stać tam, gdzie bramka.

## Fonty

Instrument Sans 400 / 500 / 600, licencja OFL, **hostowany lokalnie** — `@font-face`
w `app/fonts.css`, pliki w `public/`, tak samo jak IBM Plex i Archivo. W wyrenderowanym HTML
na wszystkich trasach ma być **zero wystąpień `fonts.googleapis`**; to zasada twarda po
commicie 89c6326 i sprawdzana po każdym deployu. Karty w `design/design-system/` linkują
Google Fonts, bo są podglądem wewnątrz Claude Design — to nie jest wzór dla produkcji.

## Gdzie ląduje kod

Strony z Claude Design (`/`, a z `--route` kolejne, np. `/cv`) przenosi
`node scripts/ship-design.mjs <bundle.html> [--route <nazwa>] --yes` — hostujemy eksport,
nie przepisujemy go; `app/design/generated.ts` i `app/<nazwa>/generated.ts` się nie edytuje.
Narzędzie ma własne źródło `tool-index.html` i własny skrypt
`node scripts/ship-tool.mjs tool-index.html --yes`, który musi pójść **przed** buildem.
`design/production/index.html` + `npm run ship` to archiwum starej „The Audit".

## Czerwień — norma projektu (od v76, 11.10.2026)

Wermilion zastąpił bursztyn. To jest norma, nie jednorazowa decyzja — każda nowa wersja
płótna i każda nowa trasa jej podlega.

**Czerwień znaczy wyłącznie zmierzoną wartość.**

| Token | Użycie | Kontrast |
|---|---|---|
| `#D6202B` | grafika i tekst **od 24 px** | 4,70:1 na papierze `#F7F5F0` |
| `#9E161F` | tekst mniejszy niż 24 px | 7,45:1 na papierze, 6,74:1 na tincie |

`#D6202B` **nigdy jako mały tekst i nigdy na tincie `#EDEAE1`** (4,26:1 — poniżej 4,5).

Zasady:

1. Czerwona jest **wartość, nie zdanie** — „69", nie „The order data says 69".
2. **Jednostka idzie z liczbą** — jeśli jednostka stoi przy wartości, ma ten sam kolor.
3. **Daty nigdy nie są czerwone.**
4. **Dwa pomiary tej samej akcji zostają w jednej linii i tylko rozstrzygający jest
   czerwony** — 45 z etykiety atramentem, 69 z danych czerwienią.
5. **Czerwień nie dotyka** pól formularza, etykiet pól, zgód, checkboxów, przycisków,
   ceny ani paska (przyklejonego paska formularza i paska cookies).
6. **Jedna czerwona płaszczyzna na stronę.**

Sprawdzane po każdym przeniesieniu: skan stylów obliczonych na 1440 i 390 px po przewinięciu
całej strony, z zaznaczonymi checkboksami — zero czerwieni w strefach z punktu 5; kontrast
każdego czerwonego tekstu liczony względem realnie namalowanego tła.

## Zdania o prywatności — weryfikowane w kodzie, nigdy przepisywane

Każde zdanie o tym, co opuszcza przeglądarkę na `/tool` (i na każdej trasie z formularzem),
jest **sprawdzane w kodzie w dniu wdrożenia** — co dokładnie wysyła każde żądanie, kiedy
i w jakiej liczbie — a nie przepisywane z poprzedniej wersji, z briefu ani z płótna.
Dwa razy pod rząd okazało się nieaktualne: „klienci zamieniani na anonimowe numery"
(silnik tego nie robi) i „z mailem jadą tytuły produktów" (most ich nie wysyła).

Sprawdzenie: `grep` na `fetch(` w `tool-index.html`, `public/tool-runtime.js` i mostach,
potem odczyt treści każdego `body` — co trafia do `/api/label` i `/api/lead`. Zdanie stoi
**w miejscu, gdzie dane wychodzą** (np. nad panelami AI, przed pierwszym kliknięciem),
nie na dole strony. Przy zdaniu w kodzie komentarz z datą i tym, co sprawdzono.

## Animacja — trzy warunki dokończenia

Każda animacja w tym systemie musi kończyć się poprawnie na trzy sposoby, bo każdy z nich
realnie występuje:

1. **Stan końcowy jest stanem domyślnym DOM-u.** Animujemy od pustego do domyślnego.
2. **`prefers-reduced-motion`** przeskakuje od razu do stanu końcowego.
3. **`navigator.webdriver`** kończy natychmiast — inaczej `qa.js` łapie ekran w połowie ruchu.

Do tego bezpiecznik dla podglądu linku: jeżeli `IntersectionObserver` nie odpalił animacji
w ciągu sekundy od załadowania, rysunek dopełnia się sam. Renderer karty na LinkedInie nie
ustawia `webdriver`, a to jedyny kanał, z którego przychodzi ruch.

## Dostępność i bramka

Tekst główny minimum 12:1, pozostały 4,5:1, od 24 px 3:1 — liczone skryptem względem realnie
namalowanego tła, nie oceniane na oko. Żaden pojemnik z tekstem nie ma sztywnej wysokości
razem z `overflow:hidden`. Wszystko działa z klawiatury i z czytnikiem ekranu.

```
node scripts/ship-design.mjs <bundle.html> --yes      # albo --route <nazwa>
npm run build
npx tsc --noEmit
npm run lint                      # zero bledow, zasada zapadki
node design/qa.js http://localhost:3000 --scroll       # oraz /stop, /tool, /<nazwa>
node scripts/content-rules.test.mjs --url http://localhost:3000   # --route <nazwa>
node scripts/ship-compare.mjs                          # --route <nazwa>
```

`qa.js` puszczamy **lokalnie** — na produkcji wysyła formularz na każdym z dziewięciu
viewportów. `qa.js` na `/tool` z ustawionym `ANTHROPIC_API_KEY`, inaczej panele AI chowają się
i bramka sprawdza mniejszą stronę niż produkcja. **Push na `claude/production` wdraża
domenę** (Branch Tracking potwierdzony 11.10.2026) — pushujemy dopiero po zielonej bramce,
a domenę sprawdzamy jednym przebiegiem, nie pętlą.

## Kontrakty, które muszą działać

Formularze stron z Claude Design idą do `/api/lead` przez `LeadBridge`: adres sklepu,
e-mail, zgoda na kontakt (`required`) i marketingowa (opcjonalna), obie domyślnie
odznaczone. `/cv`: `form#cv-enquiry`, pole sklepu opcjonalne. `/tool`: `form#tool-enquiry`
z wynikiem w `data-interval`, `data-label-day`, `data-sample-n`, `data-window-days`,
`data-bimodal`, `data-interval-low`, `data-interval-high`; obie zgody opcjonalne, bo wysłanie
analizy to wykonanie prośby, nie kontakt handlowy. CTA do `/tool` jest atramentowe.
