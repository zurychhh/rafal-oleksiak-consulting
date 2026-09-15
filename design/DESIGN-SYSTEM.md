# Brief wdrożeniowy — Oleksiak Consulting

**Design system mieszka w Claude Design**, w projekcie „Oleksiak Consulting"
(`107782f2-7c9d-4950-b48f-4ac5197ccc7f`), a jego źródłem są karty w `design/design-system/`.
Kolory, typografia, ruch, siatka i komponenty są opisane tam i tylko tam — ten plik ich nie
powtarza, żeby nie było dwóch źródeł prawdy.

Tutaj zostaje wyłącznie to, czego karta projektowa nie może powiedzieć: jak ten system wdrażać
w tym repo.

## Fonty

Instrument Sans 400 / 500 / 600, licencja OFL, **hostowany lokalnie** — `@font-face`
w `app/fonts.css`, pliki w `public/`, tak samo jak IBM Plex i Archivo. W wyrenderowanym HTML
na wszystkich trasach ma być **zero wystąpień `fonts.googleapis`**; to zasada twarda po
commicie 89c6326 i sprawdzana po każdym deployu. Karty w `design/design-system/` linkują
Google Fonts, bo są podglądem wewnątrz Claude Design — to nie jest wzór dla produkcji.

## Gdzie ląduje kod

Strona główna jest przenoszona ze źródła: zmieniasz `design/production/index.html`, potem
`npm run ship -- --yes`. Regiony między znacznikami `>>> ZE ZRODLA — GENEROWANE <<<` są
nadpisywane przy każdym shipie — plików w `app/` nie edytuje się ręcznie. Narzędzie ma własne
źródło `tool-index.html` i własny skrypt `node scripts/ship-tool.mjs tool-index.html --yes`,
który musi pójść **przed** buildem.

Zmienne koloru idą do bloku `:root` w `app/globals.css` przez ship. Skrypt strony to
`app/audit-runtime.js` — plik `.js`, kopiowany bajt w bajt, celowo imperatywny, poza
typecheckiem. Animacji nie przepisujemy na stan Reacta.

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
npm run ship -- --yes
npm run build
npx tsc --noEmit
npm run lint                      # zero bledow, zasada zapadki
node scripts/ship-compare.mjs
node design/qa.js http://localhost:3000 --scroll
node design/qa.js http://localhost:3000/stop --scroll
node design/qa.js http://localhost:3000/tool --scroll
```

`qa.js` puszczamy **lokalnie** — na produkcji wysyła formularz na każdym z dziewięciu
viewportów. `qa.js` na `/tool` z ustawionym `ANTHROPIC_API_KEY`, inaczej panele AI chowają się
i bramka sprawdza mniejszą stronę niż produkcja. Push nie wdraża; wdrożenie to
`npx vercel@latest --prod`, a domenę sprawdzamy jednym przebiegiem, nie pętlą.

## Kontrakty, które muszą działać

Formularz w listwie wyjść idzie do `/api/lead` — adres plus opcjonalna jedna linia
wiadomości, mail do właściciela i zapis w HubSpocie. Bursztynowe CTA linkuje do `/tool`.
Narzędzie kończy się formularzem z osobnym checkboxem zgody na kontakt, domyślnie
odznaczonym — to wymaga dołożenia pola zgody i źródła do kontraktu `/api/lead`.
