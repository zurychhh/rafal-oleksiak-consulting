# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Read This First

**Praca toczy się na gałęzi `feature/new-site`, nigdy na `main`.** Odpowiadaj po polsku;
kod i treść strony po angielsku.

**Repozytorium jest publiczne i ma sekrety w historii.** Zweryfikowane: klonuje się
anonimowo. **Push jest ODBLOKOWANY** — Rafał podjął tę decyzję 13.09.2026 świadomie:
te sekrety są w historii publicznego repo od dawna, więc kolejny push nie zwiększa
ekspozycji ani o krok, a wstrzymywanie publikacji nic nie chroni. Nigdy nie commituj
wartości sekretu, nawet do przykładu. Nadal do unieważnienia, niezależnie od pushy:
Google Ads Developer Token (jawny w `STATUS.md` w HEAD) oraz klucz API
w `generate-all-notion-assets.sh` i `generate-notion-assets-v2.sh`, linia 9 w obu.

**Duża część projektu została wycięta** (wrzesień 2026, 203 pliki, ~65 900 linii).
LAMA, RADAR, MCC, Stripe, panel admina, Auto-Publish, generowanie PDF i stara strona
główna **już nie istnieją**. Starsze dokumenty w korzeniu repo (`PROJECT_SUMMARY.md`,
`project_information.md`, `LAMA_*.md`, `STRIPE_*.md`, `MCC_ARCHITECTURE.md`) opisują
ten usunięty kod — są archiwum, nie stanem faktycznym.

Aktualny stan i otwarte punkty: **`STATUS.md`**. Brief wdrożeniowy: **`HANDOFF-CC.md`**.

## Build & Development Commands

```bash
npm run dev          # Dev server (Next 16 → Turbopack)
npm run build        # Produkcyjny build
npm run lint         # ESLint 9 flat config — musi dawać ZERO błędów
npm run typecheck    # tsc --noEmit; NIE jest częścią build, uruchamiaj osobno
npm run ship         # przeniesienie strony głównej ze źródła (patrz niżej)
npm start

# narzędzie /tool — osobne źródło, osobny skrypt; MUSI pójść przed buildem
node scripts/ship-tool.mjs tool-index.html          # podgląd
node scripts/ship-tool.mjs tool-index.html --yes    # zapisuje trzy pliki
```

**Nie ma frameworka testowego.** Weryfikacja opiera się na trzech narzędziach:

```bash
node design/qa.js http://localhost:3000 --scroll   # 9 szerokości: przycięcia,
                                                   # nakładanie, przewijanie, kontrast
node scripts/ship-compare.mjs                      # style OBLICZONE vs źródło
node scripts/hubspot-setup.mjs [--apply]           # właściwości kontaktu (idempotentny)
```

`design/qa.js` przyjmuje ścieżkę pliku albo URL. Chromium bierze z przypiętej ścieżki
(`PW_CHROMIUM` albo `/opt/pw-browsers/...`), a gdy jej nie ma — z lokalnego playwrighta.

**`qa.js` WYSYŁA formularz — na każdym z dziewięciu viewportów.** Linie 169–175:
wpisuje `test@company.com` i klika przycisk wysyłki, żeby obejrzeć stan końcowy.
Puszczona na `http://localhost:3000` jest nieszkodliwa, bo limiter poza produkcją
jest wyłączony, a `/api/lead` nie ma dokąd wysłać maila bez klucza Resenda.

**Puszczona na produkcyjnym URL-u generuje dziewięć prawdziwych zgłoszeń:** maile
do właściciela i do „odwiedzającego", zapis kontaktu w HubSpocie i wyczerpanie
godzinnej puli limitera (5/IP), przez co przez następną godzinę nie da się
przetestować formularza naprawdę. **Bramkę puszczamy lokalnie.** Na żywej domenie
tylko wtedy, gdy świadomie godzisz się na te skutki — i wiedząc, że przebieg
zapisuje zawsze te same wartości domyślne, więc niczego w CRM nie dowodzi.

### Bramka po każdym etapie

Build, `tsc --noEmit`, lint z **zerem błędów**, `qa.js` na `/`, `/stop` i `/tool`,
oraz `ship-compare.mjs`. Obowiązuje **zasada zapadki**: liczba błędów lintu po etapie
nie może być wyższa niż przed nim. `qa.js` na `/tool` biegnie przy **ustawionym**
`ANTHROPIC_API_KEY` (jest w `.env.local`) — bez niego panele AI chowają się i bramka
sprawdza mniejszą stronę niż produkcja. To wariant z widocznymi panelami wywraca
kontrast i układ, nie pusty.

`ship-compare.mjs` nie jest ozdobą. Build, tsc, lint i `qa.js` przechodziły również
wtedy, gdy nagłówek renderował się Poppinsem zamiast IBM Plex, a separator tysięcy
zmienił się z cienkiej spacji U+2009 na zwykłą. Oba błędy złapało dopiero porównanie
stylów obliczonych.

## Architektura

### Stack
Next.js 16 (App Router, React 19, Turbopack) · TypeScript 5.9 strict · CSS Modules
+ Tailwind 4 · Resend · zod. Siedem zależności produkcyjnych, bez bazy danych.

### Trasy

| Trasa | Co to |
|---|---|
| `/` | strona główna — wizytówka, link do `/tool`, pod spodem „The Audit" (dwa ekrany) |
| `/tool` | narzędzie: dni zapasu z etykiety kontra odstęp między zamówieniami |
| `/stop` | wypis, `noindex`; linkuje do niej stopka każdego maila |
| `/privacy` | polityka prywatności |
| `/blog`, `/blog/[slug]` | blog z zewnętrznego backendu na Railway |
| `/api/lead` | zgłoszenie ze strony głównej → mail + HubSpot |
| `/api/label` | dwa panele AI w `/tool` → Claude; klucz nie wychodzi do przeglądarki |
| `/api/stop` | wypis → mail do właściciela |

### Strona główna — trzy pliki i jedna zasada

Strona jest **przenoszona ze źródła**, nie pisana ręcznie:

```
design/production/index.html      ← ŹRÓDŁO. Ktoś inny je podmienia.
        │  npm run ship
        ├─→ app/audit.css          reguły, przeniesione dosłownie
        ├─→ app/globals.css        blok :root ze zmiennymi
        ├─→ app/audit-runtime.js   skrypt, kopia BAJT W BAJT
        └─→ app/AuditClient.tsx    znaczniki przekonwertowane na JSX
```

**Regiony między znacznikami `>>> ZE ZRODLA — GENEROWANE <<<` są nadpisywane przy
każdym `ship`.** Ręczna zmiana w nich zniknie. Wszystko poza znacznikami jest pisane
ręcznie i `ship` tego nie dotyka — tam siedzą bloki resetu i rezerwacja miejsca
na pasek zgody.

Dlaczego `audit-runtime.js` jest plikiem `.js`, a nie `.tsx`: `tsconfig` obejmuje
wyłącznie `.ts` i `.tsx`, a `checkJs` jest wyłączony, więc ten plik omija typecheck.
Dzięki temu skrypt może być kopiowany dosłownie, bez ani jednej adnotacji dopisanej
po to, żeby zadowolić kompilator. Wersja z adnotacjami wymagałaby od `ship` łatania
kilkunastoma regexami po każdym przeniesieniu.

**Skrypt jest celowo imperatywny i ma taki zostać.** Przeszedł QA wizualne na dziewięciu
szerokościach; każde „ładniejsze" przepisanie na stan Reacta unieważnia ten wynik.
Wywołanie idzie do `useEffect` z pustą tablicą zależności, za blokadą `useRef` — bez
niej `reactStrictMode` odpala bootstrap dwukrotnie i w dev widać czternaście kafli
kategorii zamiast siedmiu.

Arkusz **nie jest modułem CSS**: skrypt generuje markup z literalnymi nazwami klas
(`.tick`, `.rank`, `.sname`, `.swhy`), więc zahaszowanie ich rozsypałoby listę kroków.

### `npm run ship`

```bash
npm run ship            # podgląd: co się zmieni w treści, nic nie rusza
npm run ship -- --yes   # przenosi, przepuszcza przez bramkę, commituje
```

Kolejno: czyste drzewo (poza samym źródłem) → czytelny diff treści, nie znaczników →
brama potwierdzenia → przeniesienie → build, tsc, lint, `qa.js` ×2, `ship-compare` →
commit z datą. **Którykolwiek punkt czerwony cofa pliki generowane bez pytania,
nie ruszając źródła.** Push nigdy nie dzieje się automatycznie. Uruchomiony dwa razy
pod rząd bez zmian mówi „nic do przeniesienia" i wychodzi zerem.

`app/audit-source.snapshot.html` to migawka ostatnio przeniesionego źródła — z niej
liczony jest diff treści.

### `/tool` — druga strona przenoszona ze źródła

Narzędzie ma własny plik źródłowy i własny skrypt. Ta sama zasada: nic nie jest
przepisywane ręcznie, bo pętla produkuje jego nowe wersje.

```
tool-index.html                    ← ŹRÓDŁO. Podmieniane z zewnątrz.
        │  node scripts/ship-tool.mjs tool-index.html --yes
        ├─→ app/tool/tool.css       reguły, przeniesione dosłownie
        ├─→ public/tool-runtime.js  skrypt, kopia BAJT W BAJT (public/ jest poza lintem)
        └─→ app/tool/body.ts        znaczniki jako `export const BODY`
```

**Kolejność jest wymuszona: `ship-tool.mjs --yes` musi pójść przed buildem.**
`app/tool/page.tsx` importuje `./tool.css` i `./body`; bez przeniesienia build pada
na brakującym module, co wygląda na błąd w kodzie, a jest brakiem przeniesienia.

`body.ts`, a nie `fs.readFileSync` w trasie: czytanie pliku z dysku w App Routerze
bywa nietrasowane na Vercelu, a import bundler widzi zawsze.

**`app/tool/page.tsx` i `app/tool/tool-reset.css` są pisane ręcznie i `ship-tool`
ich nie dotyka.** W resecie siedzą dwie rzeczy, bez których trasa wygląda źle,
a obie pochodzą ze stylów starej strony, nie z narzędzia:

1. `critical.css` daje `html{overflow-x:hidden;max-width:100vw}` — na stronie
   wysokiej na 2200 px robi z `<html>` kontener przycinający. To samo lekarstwo
   co w `stop.css` i `privacy.css`.
2. `globals.css` daje **każdemu** `<section>` `padding:clamp(48px,8vw+1rem,120px)`
   w pionie plus `overflow-x:hidden` i `transform:translateZ(0)`. Karta narzędzia
   jest `<section>`, więc dostawała 242 px powietrza na 1440 px. `qa.js` tego nie
   zgłasza — nadmiarowy padding to ani przycięcie, ani nakładanie, ani kontrast.
   Transform kasujemy osobno: element z transformem jest blokiem zawierającym dla
   `position:fixed`.

Oba panele AI (`#ai1`, `#ai2`) **chowają się same**, gdy `GET /api/label` zwróci 503.
Bramka na `/tool` musi więc biec przy **ustawionym** kluczu — inaczej sprawdza
mniejszą stronę niż produkcja i przepuszcza błędy w panelach. Tak właśnie przeszedł
niezauważony kontrast 4.45:1 na nagłówkach obu paneli.

Archivo (`--disp` w narzędziu) jest hostowany lokalnie w `app/fonts.css`, tak samo
jak IBM Plex. Deklaracja `@font-face` sama nic nie pobiera — plik leci dopiero przy
użyciu rodziny, a używa jej tylko `/tool`.

### `/api/lead` — wzorzec dla nowych endpointów

1. Origin check liczony **z żądania** (`origin.host === host`), nie ze stałej w env —
   działa tak samo na produkcji, na deployu preview i na localhoście.
2. Limiter w pamięci; **nieaktywny poza produkcją** (`NODE_ENV !== 'production'`),
   próg z `LEAD_MAX_PER_HOUR`, domyślnie 5. Poza produkcją musi być wyłączony, bo
   bramka wizualna puszcza dziewięć viewportów z jednego adresu i przy aktywnym
   limicie połowa kończyłaby w innym stanie niż reszta.
3. Walidacja zodem. `category` ma `regex(/^[^\r\n]*$/)`, bo trafia do nagłówka Subject.
4. **Klient Resend powstaje dopiero w `POST`, po walidacji.** W zakresie modułu
   `new Resend(undefined)` rzuca przy ładowaniu trasy i cała warstwa kodów statusu
   nigdy się nie wykonuje — brak konfiguracji wygląda wtedy jak 500 z HTML-em, także
   dla żądań, które powinny dostać 403 albo 422. Brak klucza → `503 not_configured`.
5. Mail do odwiedzającego blokuje żądanie; powiadomienie właściciela i HubSpot to
   księgowość i nigdy nie mogą przerwać dostawy.

W `/api/stop` jest odwrotnie: mail do właściciela **jest** zapisem wypisu, więc jego
błąd przerywa żądanie.

### Blog — cienka warstwa nad zewnętrznym backendem

Żadne dane bloga nie leżą tutaj. `lib/blog/blog-api.ts` woła Railway przez `BLOG_API_URL`.

**`filterPosts()` jest krytyczne, nie ozdobne.** Wspólny backend wcześniej wpychał
polskie treści prawnicze do tego najemcy. Wszystkie trzy publiczne funkcje filtrują po
`agent_id` plus test on/off-topic, domyślnie odrzucając. Jeśli wpisy znikną z bloga,
podejrzewaj najpierw ten filtr, nie API.

### Zgoda i śledzenie

Kolejność w `layout.tsx` jest wymogiem poprawności, nie stylu: `ConsentMode` ustawia
domyślne `denied` dla EOG i musi wykonać się przed jakimkolwiek tagiem.

```
<head>  ConsentMode → preconnect → IBM Plex → SchemaOrg
<body>  GTMNoScript → {children} → GTMScript → GoogleAnalytics → WebVitals
        → ScrollTracker → CookieConsent
```

`CookieConsent` renderuje się w layoucie, nie na stronie — bez niego Consent Mode stoi
na `denied` i nie ma jak zgody udzielić na żadnej trasie. Banner **rezerwuje własną
wysokość** przez `--consent-h` ustawiane na `<html>`; stojąc na `position:fixed`
przykrywał przycisk „Run the audit". Reguła rezerwująca musi stać **na końcu**
`audit.css`, bo oryginalne `.s1{min-height:100dvh}` ma tę samą specyficzność
i o wyniku decyduje kolejność.

W shimie gtag musi zostać `arguments`, nie rest params: gtag rozpoznaje komendy po tym,
że do `dataLayer` trafił obiekt `Arguments`. Zwykła tablica jest ignorowana i zgoda
nigdy się nie aktualizuje. Dotyczy `CookieConsent.tsx` i `ConsentMode.tsx`.

## Zmienne środowiskowe

| Serwis | Zmienne |
|---|---|
| Resend | `RESEND_API_KEY`, `FROM_EMAIL`, `TO_EMAIL` |
| HubSpot | `HUBSPOT_API_KEY` ← *nie* `HUBSPOT_ACCESS_TOKEN` |
| Blog | `BLOG_API_URL` / `NEXT_PUBLIC_BLOG_API_URL`, `NEXT_PUBLIC_BLOG_AGENT_ID` |
| Claude (`/api/label`) | `ANTHROPIC_API_KEY` — ustawiony w Production i Preview. Bez niego trasa daje 503 `sampling_disabled`, a `/tool` chowa oba panele i działa dalej. Uwaga na pułapkę: sonda `GET` sprawdza **obecność klucza, nie saldo konta**, więc klucz przy pustym koncie daje widoczne panele i błąd przy każdym kliknięciu. |
| Śledzenie | `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_GOOGLE_ADS_ID`, `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL`, `NEXT_PUBLIC_GOOGLE_ADS_CALENDLY_LABEL` |
| Opcjonalne | `NEXT_PUBLIC_SITE_URL`, `LEAD_MAX_PER_HOUR`, `LABEL_MAX_PER_HOUR`, `ANTHROPIC_MODEL` |

`.env.example` jest nieaktualny — opisuje wycięty kod.

## Wzorce

### ESLint: dwa pliki konfiguracji, czytany jest jeden
`eslint.config.mjs` (flat, ESLint 9) jest wiążący. `.eslintrc.json` to pozostałość —
Next 16 usunął `next lint` i już go nie czyta. `no-undef` jest wyłączone dla plików TS
(kompilator sprawdza to lepiej); `app/audit-runtime.js` ma zawężony wyjątek na `no-var`
i `no-empty` oraz jawnie zadeklarowane globale przeglądarki.

### tsconfig
Wyklucza `node_modules`, `api` (stara funkcja Vercela, gitignorowana) i `design`
(przechowalnia — jej pliki importują ze swoich przyszłych lokalizacji).

### Ograniczenia Vercela
Bez wewnętrznych `fetch('/api/...')` — importuj funkcję wprost. Trasy używające
Node API deklarują `runtime = 'nodejs'` i `dynamic = 'force-dynamic'`.

### Alias
`@/*` wskazuje na korzeń repo. Istnieją dwa katalogi `lib/`: `lib/` (blog) i `app/lib/`
(analityka, stałe, helpery `/api/lead`). To nie jest hierarchia.

## `design/` — przechowalnia

`design/production/index.html` to źródło strony głównej. `design/tools/` to trzy
narzędzia FMCG. `design/qa.js` to checker Playwright.

Codzienna pętla usprawniająca chodzi **w chmurze**, pisze do artefaktów roboczych
i nie dotyka repo ani produkcji — chmura nie ma prawa zapisu do tego repozytorium.
Nie odtwarzaj tego harmonogramu lokalnie. Wypuszczanie na produkcję dzieje się ręcznie,
przez `npm run ship`.

## Dokumentacja

**STATUS.md** — stan bieżący i blokery (czytaj to jako pierwsze) ·
**CLAUDE.md** — ten plik · **ROADMAP.md** — zadania i decyzje ·
**HANDOFF-CC.md** — brief wdrożeniowy. Pozostałe pliki `.md` w korzeniu to archiwum
wyciętego kodu. Aktualizuj dokumenty po zakończeniu zadania.

## Język

Dokumentacja po polsku dla kontekstu biznesowego, angielski dla kodu i komentarzy.
Treść strony po angielsku.
