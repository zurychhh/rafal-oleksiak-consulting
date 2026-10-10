# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Read This First

**Produkcja = gałąź `claude/production` (od 26.09.2026), pamięć agentów = `claude/system`; nigdy `main`. `feature/new-site` to historia.** Odpowiadaj po polsku;
kod i treść strony po angielsku.

**Najpierw `git fetch`, potem praca.** Agenci w chmurze pushują na `claude/production`
co godzinę, a ten Mac tego nie widzi. 07.10.2026 lokalna kopia była 13 commitów za
produkcją i miała CLAUDE.md sprzed 26.09 — brief napisany na jej podstawie kazał
pracować w `design/production/index.html` i `npm run ship`, czyli w mechanizmie, którego
`/` już nie używa, a `npx vercel --prod` z tego katalogu nadpisałby v66, prerender
i nowy `/tool`. Przed `ship`, pushem i wdrożeniem: `git log HEAD..origin/claude/production`
musi być puste.

**Repozytorium jest publiczne i ma sekrety w historii.** Zweryfikowane: klonuje się
anonimowo. **Push jest ODBLOKOWANY** — Rafał podjął tę decyzję 13.09.2026 świadomie:
te sekrety są w historii publicznego repo od dawna, więc kolejny push nie zwiększa
ekspozycji ani o krok, a wstrzymywanie publikacji nic nie chroni. Nigdy nie commituj
wartości sekretu, nawet do przykładu. Nadal do unieważnienia, niezależnie od pushy:
Google Ads Developer Token (jawny w historii `STATUS.md` 02.02–05.09.2026, z HEAD usunięty
5.09) oraz klucz Stability AI (jawny w historii `generate-all-notion-assets.sh`
i `generate-notion-assets-v2.sh`, linia 9; z HEAD usunięty 08.10.2026 — skrypty czytają
teraz `STABILITY_API_KEY` ze środowiska). Usunięcie z HEAD nie unieważnia klucza.

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
npm start

# strona główna — eksport Claude Design (patrz „Strona główna" niżej)
node scripts/ship-design.mjs <bundle.html>          # podgląd
node scripts/ship-design.mjs <bundle.html> --yes    # przenosi na `/`

# narzędzie /tool — osobne źródło, osobny skrypt; MUSI pójść przed buildem
node scripts/ship-tool.mjs tool-index.html          # podgląd
node scripts/ship-tool.mjs tool-index.html --yes    # zapisuje trzy pliki
```

**Nie ma frameworka testowego.** Weryfikacja opiera się na trzech narzędziach:

```bash
node design/qa.js http://localhost:3000 --scroll   # 9 szerokości: przycięcia,
                                                   # nakładanie, przewijanie, kontrast
node scripts/ship-compare.mjs                      # style OBLICZONE `/` vs bundle Claude Design
node scripts/content-rules.test.mjs --url http://localhost:3000   # twarde zasady treści
node scripts/hubspot-setup.mjs [--apply]           # właściwości kontaktu (idempotentny)
```

`design/qa.js` przyjmuje ścieżkę pliku albo URL. Chromium bierze z przypiętej ścieżki
(`PW_CHROMIUM` albo `/opt/pw-browsers/...`), a gdy jej nie ma — z lokalnego playwrighta.

**`qa.js` WYSYŁA formularz — na każdym z dziewięciu viewportów** — jeśli na stronie
jest `#mail` (stara „The Audit", `/tool` nie ma). Wpisuje `test@company.com` i klika
przycisk wysyłki, żeby obejrzeć stan końcowy. Strona z Claude Design nie ma `#mail`,
więc na `/` dziś nic nie wysyła — ale zasada niżej obowiązuje dalej.
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
`ship-compare.mjs`, `content-rules.test.mjs --url http://localhost:3000`
i `tool-rules.test.mjs`. Obowiązuje **zasada zapadki**: liczba błędów lintu po etapie
nie może być wyższa niż przed nim. `qa.js` na `/tool` biegnie przy **ustawionym**
`ANTHROPIC_API_KEY` (jest w `.env.local`) — bez niego panele AI chowają się i bramka
sprawdza mniejszą stronę niż produkcja. To wariant z widocznymi panelami wywraca
kontrast i układ, nie pusty.

`ship-compare.mjs` nie jest ozdobą. Build, tsc, lint i `qa.js` przechodziły również
wtedy, gdy nagłówek renderował się Poppinsem zamiast IBM Plex, a separator tysięcy
zmienił się z cienkiej spacji U+2009 na zwykłą. Oba błędy złapało dopiero porównanie
stylów obliczonych. Od v66 porównuje `/` z bundlem Claude Design otwartym z dysku,
element po elemencie (1440 i 390); stara wersja dla „The Audit" to
`scripts/ship-compare-audit.mjs`.

**Build nie potrzebuje Google Fonts.** Wszystkie fonty (IBM Plex, Archivo, Poppins,
DM Sans) są w `app/fonts.css` + `public/fonts/`; `next/font/google` usunięty z layoutu,
bo pobierał pliki w czasie buildu i build padał tam, gdzie `fonts.googleapis.com` jest
zablokowany (chmura, zadania cykliczne). Nie wracaj do `next/font/google`.

## Architektura

### Stack
Next.js 16 (App Router, React 19, Turbopack) · TypeScript 5.9 strict · CSS Modules
+ Tailwind 4 · Resend · zod. Siedem zależności produkcyjnych, bez bazy danych.

### Trasy

| Trasa | Co to |
|---|---|
| `/` | strona główna — eksport Claude Design (v66), formularz → `/api/lead`, link do `/tool` |
| `/tool` | narzędzie: dni zapasu z etykiety kontra odstęp między zamówieniami |
| `/stop` | wypis, `noindex`; linkuje do niej stopka każdego maila |
| `/privacy` | polityka prywatności |
| `/blog`, `/blog/[slug]` | blog z zewnętrznego backendu na Railway |
| `/api/lead` | zgłoszenie ze strony głównej → mail + HubSpot |
| `/api/label` | dwa panele AI w `/tool` → Claude; klucz nie wychodzi do przeglądarki |
| `/api/stop` | wypis → mail do właściciela |

### Strona główna — eksport Claude Design, hostowany, nie przepisywany

**Od v66 (wrzesień 2026) `/` to strona z Claude Design i przenosi ją
`scripts/ship-design.mjs`.** `npm run ship` / `scripts/ship.mjs` („The Audit" z
`design/production/index.html`) zostaje w repo jako archiwum i droga powrotu, ale
`app/page.tsx` nie importuje już `AuditClient`, więc jego przebieg nie zmienia `/`.

```
design/production/claude-design-bundle.html   ← ŹRÓDŁO: plik z Claude Design
        │                                        („Publish as artifact", samorozpakowujący bundle)
        │  node scripts/ship-design.mjs <bundle.html> --yes
        ├─→ app/design/generated.ts           szablon <x-dc>, logika text/x-dc, mapa zasobów
        ├─→ app/design-source.snapshot.html   czytelna migawka — z niej diff treści
        └─→ public/dc/<hash>.js|woff2         runtime Claude Design, React 18 UMD, fonty
```

**Dlaczego hostowanie, a nie przepisanie na JSX.** Strona jest szablonem reaktywnym
(`<x-dc>`, `<sc-for>`, `<sc-if>`, `{{…}}`) renderowanym przez runtime Claude Design
+ React 18, a jej sensem są animacje zależne od scrolla, liczone w logice komponentu.
Każda ręczna konwersja to nowy kod do QA przy każdej wersji. Tu przenosimy **te same
bajty, które chodzą w Claude Design**: `ship-design` rozpakowuje bundle bez przeglądarki
(base64 + gzip), zapisuje assety pod nazwą z hasha treści i przemapowuje URL-e unpkg na
lokalne pliki przez `window.__resources` — ten sam mechanizm, którego używa sam bundle.
Zero żądań do unpkg i Google Fonts; `/dc/*` ma `Cache-Control: immutable`.

**Kolejna wersja z Claude Design — jedno polecenie:**

```bash
node scripts/ship-design.mjs ~/Downloads/<eksport>.html          # podgląd + diff treści + test treści
node scripts/ship-design.mjs ~/Downloads/<eksport>.html --yes    # kopiuje do design/production, zapisuje
# potem bramka: build, tsc, lint, npm start, qa.js ×3, ship-compare, content-rules --url
```

Podgląd nic nie zapisuje. Test treści idzie **przed** zapisem — czerwony zatrzymuje
przebieg i nic nie jest zapisywane. Drugi przebieg bez zmian: „Nic do przeniesienia", kod 0.
Skrypt nie commituje i nie pushuje. Zatrzymuje się głośno na wszystkim, czego nie zna:
nieznany typ assetu, cokolwiek w `<head>` poza meta i runtime'em, treść poza `<x-dc>`,
zasoby z zewnętrznych hostów, brak `<footer>`, brak formularza URL + e-mail + zgoda,
zgoda domyślnie zaznaczona.

Przekształcenia w `ship-design` (raportowane liczbowo): uuid → `/dc/…`; usunięcie
odznaki „Made with Claude Design"; „Rafal" → „Rafał" (tylko wielka litera — adresy
`rafal@…` i URL-e zostają); e-mail, LinkedIn i link do `/tool` dokładane minimalnie
do stopki, **jeśli ich brak**; link do `/tool` w nagłówku (tekst z istniejącego linku),
jeśli nagłówek go nie ma — w v66 był ~2 ekrany niżej na desktopie i ~4 na telefonie.

**Prerender pierwszego ekranu (`scripts/design-prerender.mjs`, część `ship-design`).**
Runtime rysuje stronę dopiero po hydratacji — bez tego ekran był pusty ~0,5 s lokalnie
i ~3,4 s na wolnym 4G, a bez JS pusty na zawsze. `ship-design` renderuje więc stronę
headless (Chromium z `/opt/pw-browsers`, serwer w pamięci z tymi samymi plikami `/dc/*`,
zamrożony zegar → deterministycznie), **sam znajduje progi szerokości** z logiki
komponentu (siatka + bisekcja do 1 px; v66: 760, 768, 901, 1024, 1200) i zapisuje
zrzut DOM dla każdego przedziału do `generated.ts`. Serwer podaje zrzut od razu;
media query wybiera właściwy. Zrzut jest w stanie `prefers-reduced-motion`, więc bez
JS cała treść jest czytelna. Formularze zrzutu nie wysyłają (bez JS: notka z adresem
e-mail). `DcBoot` zdejmuje zrzut w tej samej klatce, w której runtime narysował tę samą
treść, i przenosi wpisane wartości. Rodziny fontów w zrzucie mają prefiks `dcpre `, a mały
skrypt trzyma zrzut niewidoczny do załadowania fontów (max 1,5 s) — bez tego tekst łamał
się krojem zapasowym i przeskakiwał (CLS ~0,05). Szablon `<x-dc>` jedzie w bezwładnym
`<template id="dc-src">`, a `DcBoot` składa z niego `<x-dc>` przed startem runtime'u.
Pomiar 26.09: CLS 0 na pięciu szerokościach; nagłówek widoczny po ~1,2 s na wolnym 4G
(było ~3,4 s). Jedyna różnica pikseli przed/po przejęciu to zamierzona animacja
projektu (linie tuż nad dolną krawędzią ekranu chowają się i wjeżdżają przy przewijaniu).

**Elementy dokładane przez `ship-design` mają `data-ship-added`** (link do `/tool`
w nagłówku, brakujące pozycje stopki); `ship-compare` zdejmuje je przed porównaniem
ze źródłem, a ich obecność pilnuje `content-rules`.

**Pisane ręcznie, `ship-design` ich nie dotyka:**

- `app/page.tsx` — metadata, OG, Person JSON-LD, `preload` runtime'u i fontów,
  osadzenie szablonu w `<div id="dc-page">` przez `dangerouslySetInnerHTML`.
- `app/design/DcBoot.tsx` — ustawia `window.__resources` i dokłada `<script>` runtime'u
  po hydratacji. Runtime nie umie się odmontować (React 18 root, listenery, style
  z `<helmet>` w `<head>`), więc wyjście z `/` przez nawigację kliencką i powrót na `/`
  w tym samym dokumencie kończą się pełnym przeładowaniem.
- `app/design/LeadBridge.tsx` — formularze → `/api/lead`. Nasłuch `submit` na
  `document` w fazie capture (przed Reactem 18 runtime'u, który słucha na `#dc-root`):
  zatrzymuje zdarzenie, wysyła `{email, storeUrl, consentContact, consentMarketing,
  consentText, form, source: {utm…, referrer, page}}` w kształcie `LeadSchema`
  (kontakt = checkbox `required`, marketing = drugi; brzmienie z etykiet; `form`
  oczyszczony do `[a-z]+`, bo tylko to przepuszcza zod), i **dopiero po 2xx**
  wypuszcza do komponentu syntetyczny `submit` — jego własny handler pokazuje stan
  „Enquiry received". Błąd → czytelny komunikat w formularzu z adresem e-mail,
  stan się nie zmienia. Po 2xx `generate_lead` + `form_submission_lead` przez bufor
  zgody (`analytics.trackLeadSubmitted`); `user_data.email` tylko gdy gtag.js jest
  załadowany, czyli po zgodzie. Formularz z samym polem URL (wąski pasek na desktopie)
  przekazuje adres do najbliższego pełnego formularza i stawia kursor w polu e-mail.
  Działa dla każdej wersji o tym kształcie formularza — bez łatania logiki komponentu.
- `app/design/design-reset.css` — reset po starej stronie, zawężony do `#dc-page`
  (i `html/body:has(#dc-page)`): ukrycie surowego `<x-dc>` przed bootem;
  `overflow-x:hidden` z `critical.css` na html/body (z runtime'owym `height:100%`
  body stawał się kontenerem przewijania, `window.scrollY` stał na zerze i **wszystkie
  animacje scrolla były martwe**); padding/transform/overflow na `<section>`
  z `globals.css`; Poppins na `h1` z `critical.css`; niebieski focus.

**Twarde zasady treści** pilnuje `scripts/content-rules.test.mjs` (samotest, warstwa
statyczna na `generated.ts`, warstwa wyrenderowana z `--url`): zero „one client at a time";
jedyna kwota EUR 2,500 net per month; zero procentów; każda liczba z listy
`ALLOWED_NUMBERS` (nowa liczba = świadomy wpis z uzasadnieniem); żadnej liczby obok
nazwy klienta; żadnej nazwy sieci/marki przy Accenture (lista publiczna + prywatna
z `CONTENT_PRIVATE_DENY` albo gitignorowanego `.content-deny.local` — prawdziwej nazwy
nie wpisujemy do publicznego repo); stopka z `rafal@oleksiakconsulting.com` i LinkedInem;
„Rafał"; widoczny link do `/tool`; brak odznaki i zasobów z unpkg/Google Fonts.

`qa.js` pomija dziecko siatki z `grid-template-rows: 0fr` — to zwinięta szuflada paska
formularza na telefonie (e-mail i zgoda rozwijają się po fokusie), nie przycięcie.
Źródło z Claude Design dawało ten sam wynik.

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

`design/production/claude-design-bundle.html` to źródło strony głównej
(`design/production/index.html` — archiwum „The Audit"). `design/tools/` to trzy
narzędzia FMCG. `design/qa.js` to checker Playwright.

## Wdrażanie na produkcję — CZYTAJ, ZANIM POWIESZ, ŻE COŚ JEST NA ŻYWO

**`claude/production` jest gałęzią PRODUKCYJNĄ Vercela — potwierdzone 11.10.2026.**
API: `link.productionBranch` = `claude/production`; pusty commit `dbd9247` dał wdrożenie
`target=production`, a alias `oleksiakconsulting.com` wskazał na nie. **Każdy push na
`claude/production` wdraża domenę.** (Do 10.10 Branch Tracking wskazywał `feature/new-site`,
a push na `claude/production` dawał tylko Preview — stąd ręczne `vercel --prod` 08–10.10.)
Praca ręczna idzie na osobną gałąź (`promote/…`, tylko Preview). Przed pushem:
`git log HEAD..origin/claude/production` musi być puste.

Weryfikacja wdrożenia bez CLI: `https://api.github.com/repos/zurychhh/rafal-oleksiak-consulting/commits/<sha>/status`
(kontekst „Vercel", `success`). **Nie odpytuj domeny w pętli co kilkanaście sekund** —
13.09 takie odpytywanie wywołało automatyczną mitygację Vercela i dziesięciominutowe
wyzwanie na adresie IP. Klient bez JS dostaje wtedy 403 z `x-vercel-mitigated: challenge`;
to nie znaczy, że strona jest zepsuta. Attack Mode jest wyłączony i ma taki zostać.
`npx vercel@latest --prod --yes` nadal działa jako ręczne obejście (globalne `vercel`
41.x jest za stare).

## System agentów i promocja

Opis: `system/SYSTEM.md` na gałęzi `claude/system`. W skrócie — wszystko w chmurze, cykl co godzinę:
Strateg USP (`system/USP.md`) → budujący narzędzie (łatka w `loop-spec`
artefaktu „Instruments · Staging”, tylko `tool-index.html`) i budujący w Claude Design
(przez Chrome „ROC” na Macu Rafała) → Recenzent całości (`system/REVIEW.md`, wskazuje
KANDYDATA jako artefakt „Publish as artifact”) → Promotor (bramka + push na produkcję).
Promotor chodzi w chmurze; **nie zostawiaj niezacommitowanej pracy na `claude/production`**
i nie pushuj tam kodu ręcznie — idzie prosto na domenę.

## Dokumentacja

**STATUS.md** — stan bieżący i blokery (czytaj to jako pierwsze) ·
**CLAUDE.md** — ten plik · **ROADMAP.md** — zadania i decyzje ·
**HANDOFF-CC.md** — brief wdrożeniowy. Pozostałe pliki `.md` w korzeniu to archiwum
wyciętego kodu. Aktualizuj dokumenty po zakończeniu zadania.

## Język

Dokumentacja po polsku dla kontekstu biznesowego, angielski dla kodu i komentarzy.
Treść strony po angielsku.
