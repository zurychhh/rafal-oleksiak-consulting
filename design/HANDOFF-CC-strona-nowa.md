# Handoff nowej strony głównej do Claude Code

Źródło projektu: płótno Claude Design „Homepage - 5 kierunków", wariant **9b Wersja
interaktywna** (runda 9). Handoff robimy przez Export → Handoff to Claude Code →
Send to local coding agent, żeby CC dostał żywe źródło, a nie zrzut ekranu.
Wszystko poniżej linii wklej do Claude Code razem z tym, co przyjdzie z handoffu.

---

Gałąź `feature/new-site`, nigdy `main`. Odpowiadaj po polsku, treść strony po angielsku.
Przeczytaj najpierw `CLAUDE.md` i `STATUS.md` — ten projekt ma nietypowe konwencje
i handoff z Claude Design ich nie zna.

## Skąd bierzesz projekt — trzy drogi, w tej kolejności

**1. Handoff z Claude Design (najlepszy).** W Claude Design: Export → Handoff to Claude Code →
Send to local coding agent. Claude Code dostaje wtedy żywe źródło płótna i kontynuuje pracę,
zamiast odtwarzać ją ze zrzutu ekranu.

**2. Plik w repo (pewny fallback, zgodny z tym, co już tu robiliśmy).** Wyeksportuj wariant
9b jako standalone HTML albo zip i połóż go w `design/kierunki/9b-interaktywna.dc.html`.
Tak samo leżą tam A-Instrument, B-Broadsheet i C-Shelf z poprzedniej rundy. Potem po prostu
przeczytaj ten plik z dysku — nie potrzebujesz do tego żadnego połączenia.

**3. Czego NIE użyjesz.** `DesignSync` i skill `/design-sync` to co innego: służą do
utrzymywania biblioteki komponentów w projekcie typu *design system*, głównie w kierunku
lokalne repo → Claude Design. Nie pobierzesz nimi tego płótna. `/design-sync` przyda się
dopiero wtedy, gdy zatwierdzony wariant zamienimy w system do ponownego użycia — to osobne
zadanie, nie to.

## Co dostajesz i czego z tego NIE bierzesz

Dostajesz artboardy w formacie płótna projektowego: desktop 1440 i telefon 390.
**Czytaj z nich dokładne wartości** — kolory, skalę typografii, wagi, odstępy, wysokości
pasków — i nie zaokrąglaj. Nie bierzesz dosłownie: sztywnej szerokości 1440 (strona jest
płynna) ani struktury plików, którą zaproponuje handoff. Nie tworzysz nowych komponentów
Reacta i nie zakładasz katalogu na komponenty.

## Specyfikacja zatwierdzonego ekranu (9b) — stan docelowy

Jeden ekran, ciemny, treść po angielsku. Od góry:

**Pasek górny.** Po lewej `OLEKSIAK CONSULTING` (wersaliki, rozstrzelone). Po prawej cztery
nazwy klientów, każda z jedną linijką pod spodem: Allegro — CRM 0.5% → 12% of revenue;
mBank mOkazje — Retention on consumables; Genactiv — Colostrum, category leader;
Booksy — The pack is an appointment. Na telefonie nazwy zwijają się do jednej linii
rozdzielonej kropkami, bez opisów.

**Kolumna lewa.** Siatka siedemdziesięciu pól, dziesięć w rzędzie: czterdzieści pięć jasnych,
dwadzieścia cztery bursztynowe, ostatnie wygaszone. Pod nią trzy linie legendy — „45 days the
label sells for", „24 days of ads to a full cupboard" (bursztynowa), „Day 69: the reorder
lands" — a niżej, mniejszym stopniem, podpis pochodzenia danych: „Real orders: an anonymous
supplements store, 1,197 first-to-second gaps, 4.8 years. Your numbers differ — that is what
the calculator is for."

**Kolumna prawa.** Claim „Your second order, on time.", pod nim linia usługi „I find the day
each pack really runs out, then move ads, emails and subscriptions onto it.", a pod nią cztery
usługi w siatce dwa na dwa. Każda usługa: pięć jednakowych kropek, cienka kreska, nazwa,
jedna linijka opisu. Kropki są białe i zapełniają się bursztynem po najechaniu na usługę
(na telefonie raz, przy wejściu bloku w kadr).

**Listwa wyjść.** Bursztynowy pas przez całą szerokość: po lewej `Calculate your reorder day`
ze strzałką, wyśrodkowane w pionie, klikalny jest cały pas i prowadzi do `/tool`; hover
przesuwa strzałkę w prawo. Po prawej pole `Leave your email` z przyciskiem `Send`, pod nim
„One reply, written by me. No sequence, no call." Środek napisu, środek pola i środek
przycisku na jednej osi. Pod pasem czarny wąski pas z linią o AI: „AI reads your pack labels
and catalogue, works out days of supply per SKU, and compares it with your real gap between
orders."

**Wysokość.** Strona jest płynna: listwa wyjść siada na dole pierwszego ekranu, a treść nad
nią rozkłada się równomiernie. Nie odwzorowuj pustej czarnej przestrzeni z artboardu — ona
wynika ze stałej wysokości makiety, nie z projektu.

**Animacja — wartości z makiety.** Jasne pola wchodzą co 0,05 s przez pierwsze 2,3 s. Potem
bursztynowe, co 0,075 s, każde w momencie pojawienia się urasta do 155% i wraca do swojej
wielkości. Całość kończy się w okolicach 4,6 s. Jeden przebieg, po wejściu w kadr przy progu
20%, bez pętli.

## Gdzie to ma wylądować

Zmieniasz **wyłącznie `design/production/index.html`**, a potem przenosisz przez
`npm run ship -- --yes`. Regiony między znacznikami `>>> ZE ZRODLA — GENEROWANE <<<`
są nadpisywane przy każdym shipie — nie edytuj plików w `app/` ręcznie.

## Twarde zasady tego repo

**Fonty hostowane lokalnie.** Kierunek stoi na Instrument Sans 400/500/600 (OFL).
Dodaj `@font-face` w `app/fonts.css` tak samo jak IBM Plex i Archivo, pliki do `public/`.
**Zero żądań do `fonts.googleapis`** w wyrenderowanym HTML na wszystkich trasach —
to jest twarda zasada po commicie 89c6326 i sprawdzasz ją po deployu.

**Zmienne koloru** idą do bloku `:root` w `app/globals.css` przez ship: tło `#0C0D0C`,
tekst `#F2F0EA`, wygaszone pasmo `#16180F`, akcent bursztynowy `#E0A72B`.

**Skrypt strony** to `app/audit-runtime.js` — plik `.js`, kopiowany bajt w bajt, celowo
imperatywny, poza typecheckiem. Animacja kalendarza idzie tam albo w czysty CSS.
Nie przepisuj tego na stan Reacta.

## Animacja — trzy warunki, które muszą być spełnione

Kalendarz zapełnia się po wejściu w kadr: jasne pola dzień po dniu, potem bursztynowe,
każde bursztynowe na moment się powiększa i wraca. Jeden przebieg, bez pętli.

1. **Stan końcowy jest stanem domyślnym DOM-u.** Animujesz od pustego do domyślnego,
   nie odwrotnie. Dzięki temu każdy zrzut po zakończeniu — i podgląd linku — pokazuje
   poprawną siatkę.
2. **`prefers-reduced-motion`** przeskakuje od razu do stanu końcowego.
3. **`design/qa.js` robi zrzuty na dziewięciu szerokościach.** Upewnij się, że bramka
   nie łapie strony w połowie animacji i nie zgłasza z tego powodu fałszywego kontrastu.
   Jeśli łapie — dodaj warunek natychmiastowego dokończenia, nie wyłączaj animacji na stałe.

Kropki przy usługach: pięć białych kropek, zapełniają się bursztynem po najechaniu,
a na telefonie raz, przy wejściu bloku w kadr.

## Kontrakty, które muszą dalej działać

Formularz e-mail w listwie wyjść dalej idzie do `/api/lead` — adres plus opcjonalna
jedna linia wiadomości, mail do właściciela i zapis w HubSpocie bez zmian.
Bursztynowe CTA linkuje do `/tool`. `/stop` bez zmian.

## Bramka

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

`qa.js` puszczaj **lokalnie** — na produkcji wysyła formularz na każdym z dziewięciu
viewportów. `qa.js` na `/tool` z ustawionym `ANTHROPIC_API_KEY`, inaczej panele AI
chowają się i bramka sprawdza mniejszą stronę niż produkcja.

Po deployu na żywej domenie: formularz end-to-end wartościami odróżnialnymi od poprzednich
testów, potwierdzony odczytem z HubSpota; `/tool` nadal 200; zero `fonts.googleapis`
w HTML na wszystkich trasach; animacja kończy się poprawnie na telefonie.

Którykolwiek punkt czerwony — cofasz drzewo i mówisz, co nie przeszło. Jeden commit,
opis po polsku, push, deploy.

Na koniec krótko prozą: co się zmieniło na stronie, jak rozwiązałeś fonty, gdzie usiadła
animacja, wynik każdego punktu bramki i liczba widocznych słów przed i po.
