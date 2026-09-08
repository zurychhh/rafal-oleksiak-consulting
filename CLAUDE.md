# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Read This First

**Praca toczy się na gałęzi `feature/new-site`, nigdy na `main`.** Odpowiadaj po polsku;
kod i treść strony po angielsku.

**Repozytorium jest publiczne i ma sekrety w historii.** Zweryfikowane: klonuje się
anonimowo. Push jest wstrzymany do czasu rotacji. Nigdy nie commituj wartości sekretu,
nawet do przykładu. Do unieważnienia: Google Ads Developer Token (jawny w `STATUS.md`
w HEAD) oraz klucz API w `generate-all-notion-assets.sh` i `generate-notion-assets-v2.sh`,
linia 9 w obu.

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
npm run ship         # przeniesienie strony ze źródła (patrz niżej)
npm start
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

### Bramka po każdym etapie

Build, `tsc --noEmit`, lint z **zerem błędów**, `qa.js` na `/` i `/stop`, oraz
`ship-compare.mjs`. Obowiązuje **zasada zapadki**: liczba błędów lintu po etapie nie
może być wyższa niż przed nim.

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
| `/` | strona główna „The Audit" — narzędzie FMCG, dwa ekrany |
| `/stop` | wypis, `noindex`; linkuje do niej stopka każdego maila |
| `/privacy` | polityka prywatności |
| `/blog`, `/blog/[slug]` | blog z zewnętrznego backendu na Railway |
| `/api/lead` | zgłoszenie ze strony głównej → mail + HubSpot |
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
| Śledzenie | `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_GOOGLE_ADS_ID`, `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL`, `NEXT_PUBLIC_GOOGLE_ADS_CALENDLY_LABEL` |
| Opcjonalne | `NEXT_PUBLIC_SITE_URL`, `LEAD_MAX_PER_HOUR` |

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
