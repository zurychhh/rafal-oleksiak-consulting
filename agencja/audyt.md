# Audyt strony oleksiakconsulting.com — build lokalny gałęzi `claude/production`

Data: 2026-11-21. Commit: `f4594c8`. Build: `npm run build` + `npm start` na `localhost:3100`, bez `.env.local` (brak kluczy to stan oczekiwany). Narzędzie: Playwright/Chromium headless, widoki 390×844 i 1440×900, DPR 1. Żadne żądanie nie poszło do domeny produkcyjnej; wszystkie żądania poza `localhost` były blokowane i liczone.

Zastrzeżenia do liczb: pomiar na localhost, bez dławienia sieci i CPU, jedno przejście na trasę i widok. LCP i „czas do nagłówka" pokazują więc kolejność i proporcje, nie czasy z prawdziwej sieci (te są **niezmierzone**). Rozmiary to bajty przesłane (po kompresji), z `request.sizes()`.

## 5 najważniejszych wniosków

1. **`/blog` nie ma żadnego zabezpieczenia przed awarią backendu i wygląda jak inna firma.** Gdy API bloga nie odpowiada (lokalnie: brak `BLOG_API_URL`), trasa zwraca 500 z gołym „Application error" — bez nagłówka, bez linku powrotu. Gdy działa, jest to stara ciemna strona (#2D3142, Poppins, fiolet) z linkiem „Contact" do nieistniejącej kotwicy `/#contact`. Do `/blog` nie prowadzi żaden link ze strony, choć jest w sitemapie.
2. **Na każdej trasie pobiera się nieużywany obraz 186 kB** (`/images/rafal-oleksiak.png`, `preload` z `layout.tsx`). To 29–51% całego transferu trasy; żadna trasa nie ma ani jednego `<img>`. Konsola zgłasza to ostrzeżeniem na wszystkich sześciu trasach.
3. **W 5 sekund widać problem i cenę, ale nie widać wprost, co Rafał robi i dla kogo.** Pierwszy ekran to hasło „You don't pay twice for the same customer.", „45 vs 69", formularz i „EUR 2,500 net per month". Zdanie z ofertą („E-commerce for brands whose customers come back…") na telefonie zaczyna się dopiero na samym dole pierwszego ekranu (y≈800 z 844), a słowo „FMCG" nie pada na pierwszym ekranie wcale. Formularz jest za to od razu pod ręką (telefon: y=337; desktop: prawa kolumna).
4. **O aplikacjach i produktach własnych na stronie nie ma nic.** Jedyne ślady to zdanie „I build the tools myself — calculators, counters, progress bars" i samo `/tool`. Brak sekcji, listy, linku czy wzmianki o jakimkolwiek własnym produkcie (potwierdzone na pełnym tekście `/`, 948 słów, oraz `/cv`).
5. **Podstawy techniczne są dobre.** Zero żądań do zewnętrznych hostów na wszystkich trasach, zero niewyrenderowanych `{{ }}`, brak poziomego przewijania na 390, CLS ≤ 0,03 wszędzie (na `/` 0), formularz i narzędzie działają, błąd 503 daje czytelny komunikat z adresem e-mail, focus z klawiatury jest widoczny. Braki są w spójności (blog, 404, metadane `/tool` i `/privacy`) i w semantyce (`/` ma jeden `h1` i zero `h2`/`h3`).

## Tabela pomiarów

Każda komórka: 390 / 1440, jeśli wartości się różnią.

| Trasa | HTTP | Nagłówek h1 widoczny (ms) | LCP (ms) | CLS po wczytaniu i przewinięciu | JS (kB) | CSS (kB) | HTML (kB) | Fonty (kB) | Razem (kB) / żądań | Błędy konsoli | Ostrzeżenia | 4xx/5xx | Hosty zewn. | `{{ }}` | Poziomy scroll na 390 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `/` | 200 | 402 / 479 | 252 / 208 | 0 / 0,0044 | 205,6 | 6,4 | 151,5 | 82,0 | 631,4 / 20 | 0 | 1 (nieużyty preload) | 0 | 0 | 0 | brak (390=390) |
| `/tool` | 200 | 347 / 354 | 144 / 172 | 0,0038 / 0,0105 | 172,2 | 10,7 | 11,8 | 51,0 | 431,7 / 18 | 1 (503 `/api/label`, oczekiwane bez klucza) | 1 | 1 (`/api/label` 503) | 0 | 0 | brak |
| `/cv` | 200 | 194 / 158 | 120 / 76 | 0 / 0 | 205,6 | 6,4 | 34,3 | 82,0 | 514,3 / 20 | 0 | 1 | 0 | 0 | 0 | brak |
| `/blog` | **500** | brak h1 | 172 / 188 (ekran błędu) | 0 | 139,8 | 7,0 | 7,2 | 0 | 340,0 / 13 | 2 (500 + wyjątek Server Components) | 3 | 1 (`/blog` 500) | 0 | 0 | brak |
| `/privacy` | 200 | 205 / 129 | 124 / 76 | 0,0297 / 0,0155 | 209,2 | 6,5 | 7,2 | 114,6 | 598,5 / 29 | 0 | 1 | 0 | 0 | 0 | brak |
| `/stop` | 200 | 174 / 167 | 88 / 80 | 0,0190 / 0,0029 | 137,2 | 6,5 | 5,8 | 29,9 | 365,5 / 14 | 0 | 1 | 0 | 0 | 0 | brak |

Dodatkowo zmierzone:

- W kolumnie „Razem" na każdej trasie siedzi 186,0 kB obrazu `rafal-oleksiak.png`, którego nic nie używa.
- HTML `/` przed kompresją: 2 324 490 bajtów (`curl`), po kompresji 151,5 kB. Zawiera zrzuty pierwszego ekranu dla kilku szerokości i szablon.
- Wysokość dokumentu `/`: 5234 px (390) i 6166 px (1440). Elementów DOM po starcie: 753 (390) i 1734 (1440).
- `/blog` z lokalną atrapą API (drugi serwer na porcie 3101, tylko do zrzutu): 200, tytuł „Blog — Oleksiak Consulting", tło `rgb(45, 49, 66)`, `h1` Poppins 36 px biały. Wpisy z atrapy odrzucił filtr tematyczny, więc widać stan „Coming soon". Wyglądu listy wpisów i pojedynczego wpisu **nie zmierzono**.
- LCP i czasy na wolnej sieci, Lighthouse, czytnik ekranu: **niezmierzone**.

### Metadane na trasę

| Trasa | title | description | canonical | og:title / og:image / og:url | JSON-LD | robots |
|---|---|---|---|---|---|---|
| `/` | „FMCG ecommerce, end to end · Oleksiak Consulting" | jest | `https://oleksiakconsulting.com/` | własny tytuł („You don't pay twice…") / `og.png` / poprawny | Organization, ProfessionalService, WebSite, Person | index, follow |
| `/tool` | „What the pack says, against what your buyers do" (bez nazwy marki) | jest | **względny** — w buildzie rozwiązał się do `http://localhost:3100/tool` (brak `metadataBase`) | własny / **brak og:image** / **`/tool` względny** | Organization, ProfessionalService, WebSite | index, follow |
| `/cv` | „Rafał Oleksiak — CV" | jest | `https://oleksiakconsulting.com/cv` | własny / `og.png` / poprawny | + Person | index, follow |
| `/blog` | „Blog — Oleksiak Consulting" (z atrapą API) | jest | **brak** | **dziedziczone ze strony głównej** (tytuł i url `/`) | niezmierzone | niezmierzone |
| `/privacy` | „Privacy Policy — Oleksiak Consulting" | jest | **brak** | **dziedziczone ze strony głównej** (og:url = strona główna) | Organization, ProfessionalService, WebSite | index, follow |
| `/stop` | „Stop writing to me · Oleksiak Consulting" | jest | `https://oleksiakconsulting.com/stop` | dziedziczone ze strony głównej | jw. | noindex, nofollow |

- `robots.txt`: 200, `Allow: /`, `Disallow: /api/` i `/_next/`, wskazuje sitemapę. Blokada `/_next/` odcina robotom CSS i JS potrzebne do wyrenderowania strony.
- `sitemap.xml`: 200, pięć adresów (`/`, `/tool`, `/blog`, `/privacy`, `/cv`); `/stop` słusznie pominięty. Przy buildzie bez API bloga w logu jest „blog API unavailable, shipping base URLs only".
- `/llms.txt`: 404.
- Nieistniejący adres: 404, domyślny ekran Next („This page could not be found."), jedyny link na stronie to „Privacy" z paska cookies.

## Znaleziska

### P1

**P1-1. `/blog` wywraca się na 500 bez żadnej osłony.**
Dowód: `agencja/podglad/audyt-blog-1440-1.png`; odpowiedź 500, tekst „Application error: a server-side exception has occurred", w logu serwera `Failed to parse URL from undefined/public/posts…`. W `app/blog/page.tsx` `getPosts()` nie ma `try/catch`, w `app/` nie ma żadnego `error.tsx` ani `not-found.tsx`. Lokalnie przyczyną jest brak zmiennej, ale ten sam ekran zobaczy odwiedzający przy każdej awarii lub przerwie backendu na Railway. Sitemapa (`app/sitemap.ts`) ten przypadek już obsługuje, strona nie.
Poprawka: `try/catch` wokół `getPosts`/`getPost` ze stanem „Coming soon" albo krótką informacją i linkiem na `/`; dodać `app/error.tsx` i `app/not-found.tsx` w stylu strony głównej.

**P1-2. `/blog` ma stary wygląd i martwy link kontaktowy.**
Dowód: `agencja/podglad/audyt-blog-1440-mock.png`; tło `rgb(45, 49, 66)`, `h1` Poppins 36 px, akcent fioletowy (#7B2CBF / #9D4EDD w `blog.module.css`) — przy papierowym #F7F5F0, Instrument Sans i czerwieni #D6202B na reszcie tras. Nawigacja bloga ma „Contact" → `/#contact`; na `/` nie ma elementu `id="contact"` (zmierzone: `false` na obu szerokościach), więc link kończy na górze strony. Stopka „All rights reserved", bez adresu e-mail i LinkedIna, które mają pozostałe trasy.
Poprawka: przepisać `blog.module.css` na tokeny z sekcji „Tokeny wizualne", link „Contact" skierować na `/#enquiry` (z uwagą z P2-3), stopkę ujednolicić. Jeśli blog ma zostać pusty, decyzja o jego miejscu w sitemapie należy do założyciela — nie proponuję ukrywania.

**P1-3. Nieużywany obraz 186 kB pobierany z wysokim priorytetem na każdej trasie.**
Dowód: 185 975 bajtów typu image na każdej z sześciu tras przy zerze elementów `<img>`; ostrzeżenie konsoli „was preloaded using link preload but not used" na każdej trasie. Źródło: `<link rel="preload" href="/images/rafal-oleksiak.png" fetchPriority="high">` w `app/layout.tsx`. Udział w transferze: 29% na `/`, 43% na `/tool`, 51% na `/stop`. Na telefonie konkuruje o łącze z fontami, na które czeka pierwszy ekran.
Poprawka: usunąć ten `preload` z `layout.tsx` (i przy okazji `preconnect` do cdnjs oraz `dns-prefetch` do calendly i googleadservices — w pomiarze nie poszło tam żadne żądanie).

**P1-4. Pierwszy ekran nie mówi wprost, co jest sprzedawane i komu.**
Dowód: `agencja/podglad/audyt-home-390-1.png`, `audyt-home-1440-1.png`. Nad zgięciem na telefonie: „Rafał Oleksiak · Consultant", hasło, „The label says 45 days. The order data says 69.", formularz, cena. Zdanie opisujące usługę zaczyna się na y≈800 z 844 px. Na desktopie jest widoczne, ale mówi o „brands whose customers come back" i o budowaniu narzędzi; „FMCG" pojawia się dopiero niżej. Osoba, która nie zna kontekstu, widzi cenę 2 500 EUR miesięcznie, zanim dowie się, za co. To ocena ekspercka, nie pomiar.
Poprawka (propozycja treści, do decyzji założyciela): jedna linia pod hasłem albo w nadtytule, np. kto + co + dla kogo („Retention and repeat-purchase consulting for FMCG e-commerce brands"), na telefonie przed formularzem.

### P2

**P2-1. Komunikat błędu wysyłki chowa się pod paskiem cookies na telefonie.**
Dowód: `agencja/podglad/audyt-home-390-form503.png` — po 503 widać „That did not go through. Write to", reszta (adres e-mail) jest pod paskiem zgody. Pasek pojawia się po przewinięciu o 200 px, czyli dokładnie wtedy, gdy ktoś zjeżdża do przycisku Send.
Poprawka: po błędzie przewinąć komunikat w widok (`scrollIntoView({block:'center'})`) albo wstawić go nad przyciskiem Send.

**P2-2. Walidacja formularza jest wyłącznie natywna, bez własnych komunikatów.**
Zmierzone na `#enquiry` (1440) i `#enquiry-phone` (390): pusty formularz → brak żądania, focus na polu URL, dymek przeglądarki „Please fill out this field."; zły e-mail → focus na polu e-mail; brak zgody → focus na checkboxie, „Please check this box if you want to proceed."; komplet → `POST /api/lead` 503 `{"error":"not_configured"}` i komunikat `role="alert"`: „That did not go through. Write to rafal@oleksiakconsulting.com instead.". Wartości pól zostają, przycisk wraca do stanu wyjściowego. Słabe punkty: dymki są w języku przeglądarki, nie strony; pole „Your store URL" ma `type="text"`, więc przyjmuje dowolny tekst; po błędzie focus ląduje na `body`, a nie na komunikacie.
Poprawka: własne krótkie komunikaty pod polami (`aria-describedby`, `aria-invalid`), focus na komunikat błędu. Do rozważenia, nie blokuje.

**P2-3. Link „Send me your store" z `/tool` prowadzi do `/#enquiry`, a tej kotwicy nie ma na telefonie.**
Zmierzone: na 390 element `#enquiry` nie istnieje (formularz nazywa się `#enquiry-phone`), `scrollY` po wejściu = 0. Szkoda jest mała, bo formularz na telefonie i tak jest na pierwszym ekranie (y=337), ale `/tool` nie ma własnego formularza w stanie bez wyniku — po całej lekturze użytkownik jest odsyłany na inną stronę.
Poprawka: jedno wspólne `id` (albo dodatkowy pusty element `id="enquiry"` przed formularzem telefonu). Po wklejeniu własnych danych pojawia się przycisk „Send me the analysis" — tej ścieżki wysyłki nie testowałem (**niezmierzone**).

**P2-4. Strona główna nie ma struktury nagłówków ani nawigacji.**
Zmierzone na `/`: `h1`: 1, `h2`: 0, `h3`: 0, `nav`: 0, `main`: 2, brak linku „skip to content". Tytuły sekcji („If this is your store", „Composition", „One date, four channels", „Prior batches") to zwykłe `div`/`span`. Czytnik ekranu i roboty dostają jedną płaską stronę.
Poprawka: w źródle Claude Design oznaczyć tytuły sekcji jako `h2`, tytuły pięciu kart jako `h3`; jeden `main`.

**P2-5. Metadane `/tool`, `/privacy`, `/blog` są niepełne.**
Dowód: tabela metadanych. `/tool`: kanoniczny i `og:url` względne (brak `metadataBase` w `layout.tsx`, więc zależą od hosta buildu), brak `og:image` (własny `openGraph` nadpisuje obraz z layoutu), tytuł bez nazwy marki. `/privacy` i `/blog`: brak kanonicznego, `og:title` i `og:url` strony głównej.
Poprawka: `metadataBase: new URL('https://oleksiakconsulting.com')` w layoucie; w `/tool` dodać `images`; w `/privacy` i `/blog` własny `alternates.canonical` i `openGraph`.

**P2-6. Ekran 404 jest ślepą uliczką.**
Dowód: `agencja/podglad/audyt-404-390-1.png` — domyślny czarno-biały ekran Next, jedyny link to „Privacy" z paska cookies.
Poprawka: `app/not-found.tsx` z linkiem na `/` i `/tool`.

**P2-7. Z `/privacy` i `/stop` słabo się wraca, a do `/blog` i z `/blog` nie ma drogi w ramach nowej strony.**
Zmierzone linki: `/tool` → `/` (nagłówek i stopka) — dobrze; `/cv` → `/` — dobrze; `/privacy` → `/` tylko na dole („← Back to homepage"), bez nagłówka; `/stop` → tylko `/privacy`, napis „Oleksiak Consulting" nie jest linkiem; `/` → `/tool`, `/cv`, `/privacy` (CV i Privacy tylko w stopce); nigdzie nie ma linku do `/blog`.
Poprawka: wspólny cienki nagłówek (nazwisko jako link na `/`) na `/privacy` i `/stop`.

**P2-8. Treść `/privacy` opisuje formularz, którego już nie ma.**
Dowód: tekst sekcji 2: „we collect … the category you pick, how long a pack lasts… We do not collect your name and we do not collect your company's website address." — a formularz na `/` ma wymagane pole „Your store URL" i wysyła `storeUrl` (zmierzone w treści żądania). Polityka podaje też numer telefonu, którego nie ma nigdzie indziej. To dokument prawny: zmiana wymaga zgody założyciela.
Poprawka: zaktualizować sekcję 2 do faktycznie zbieranych pól (adres sklepu, e-mail, zgody z brzmieniem, źródło wejścia).

### P3

**P3-1. Dwa różne adresy kontaktowe.** `/stop` po błędzie pisze „Write to hello@oleksiakconsulting.com", reszta strony używa `rafal@oleksiakconsulting.com` (`app/stop/StopClient.tsx`). Poprawka: jeden adres.

**P3-2. Focus na `/` jest widoczny, ale cienki.** Zmierzone: obrys 1 px `rgb(20, 22, 26)` na `/` i `/cv`, 2 px na `/tool`. Kolejność Tab na desktopie: link w nagłówku → przycisk „Check your own gap" (y=505) → pola formularza (y=362–683), czyli wstecz względem układu. Zrzut: brak w repo (limit plików). Poprawka: 2 px jak w `/tool`.

**P3-3. Kontrast tekstu pomocniczego jest na granicy.** Policzone z kolorów obliczonych: szary `#6E6D68` na `#F7F5F0` = 4,76:1 (używany m.in. w 12 px), czerwony `#D6202B` na tym samym tle = 4,70:1. Oba przechodzą próg 4,5:1 z małym zapasem. Tusz `#14161A` = 16,6:1.

**P3-4. `robots.txt` blokuje `/_next/`.** Roboty renderujące stronę nie pobiorą CSS ani JS. Poprawka: usunąć tę linię, zostawić `Disallow: /api/`.

**P3-5. `/tool` bez klucza pokazuje sekcję „04 — Read the labels for me · Off on this copy".** To stan zablokowany z wyjaśnieniem, nie ukrycie; na produkcji z kluczem wygląda inaczej — wariantu z kluczem nie testowałem (**niezmierzone**).

**P3-6. Nazewnictwo i stopki różnią się między trasami.** Nagłówek: „Rafał Oleksiak · Consultant" (`/`, `/cv`, `/tool` 1440), „Rafał Oleksiak" (`/tool` 390), „Oleksiak Consulting" (`/stop`, blog). CTA do narzędzia ma trzy brzmienia: „Check your own gap — free", „Count your own interval", „Count your own interval — free".

**P3-7. JS 137–209 kB na trasę przy stronach w większości statycznych.** `/stop` (jedno pole) pobiera 137 kB JS, `/privacy` (sam tekst) 209 kB JS i 115 kB fontów w 29 żądaniach. Nie boli w pomiarze lokalnym; wpływ na wolnej sieci **niezmierzony**.

## Co działa (sprawdzone)

- **Narzędzie `/tool`**: od wejścia liczy sklep przykładowy (5699 zamówień, 4 rodziny; wynik 45 dni z etykiety vs 69 z zamówień). Po przełączeniu na „paste your own export" i wstawieniu syntetycznego eksportu (1052 zamówienia, 300 klientów, odstępy losowe 40–61 dni) pokazało „1052 orders · 1 family", medianę 51 dni, zakres 50–53, 452 odstępy i cztery ustawienia kanałów — zgodne z danymi wejściowymi. Śmieciowy tekst → „I read 2 lines and found no order in them." i powrót do sklepu przykładowego. Zrzut: `agencja/podglad/audyt-tool-1440-paste.png`. Uwaga metodyczna: wartość wstawiłem skryptem (`value` + zdarzenie `input`); wpisywanie przez Playwright `fill()` nie doszło do skutku w 30 s, przyczyny nie ustaliłem — prawdziwe wklejenie ze schowka i wybór pliku są **niezmierzone**.
- **Formularz na `/`**: opis w P2-2; treść żądania zawiera e-mail, adres sklepu, obie zgody, dosłowne brzmienie zgód, nazwę formularza i stronę źródłową.
- **`/stop`**: wysyłka → 503 → „That did not go through. Write to hello@… and I will remove you by hand."
- **Bez JavaScriptu** `/` pokazuje pełną treść ze zrzutu (5753 znaki tekstu, wysokość 5324 px na 390).
- **Pasek cookies**: na długich stronach pojawia się po przewinięciu o 200 px, na krótkich po 1,5 s; przed zgodą zero żądań do Google.
- **Ścieżka do kontaktu**: formularz na pierwszym ekranie (obie szerokości), drugi na końcu strony, pasek z polem URL po przewinięciu, e-mail i LinkedIn w stopce `/`, `/cv`, `/tool`.

## Tokeny wizualne (style obliczone na `/`, 1440 px)

Kolory tła (wg powierzchni):

| Rola | Wartość |
|---|---|
| Tło strony („papier") | `rgb(247, 245, 240)` = `#F7F5F0` |
| Tło wyróżnionej karty | `rgb(237, 234, 225)` = `#EDEAE1` |
| Słupki i wypełnienia neutralne | `rgb(201, 199, 192)` = `#C9C7C0` |
| Przycisk główny, znaczniki („tusz") | `rgb(20, 22, 26)` = `#14161A` |
| Akcent (słupki „luki", kreska pod nagłówkiem) | `rgb(214, 32, 43)` = `#D6202B` |
| Słupki ciemnoszare | `rgb(110, 109, 104)` = `#6E6D68` |
| Linie pomocnicze jasne | `rgb(220, 218, 210)` = `#DCDAD2` |

Kolory tekstu (wg liczby znaków):

| Rola | Wartość |
|---|---|
| Tekst główny | `#14161A` |
| Tekst pomocniczy, etykiety | `#6E6D68` |
| Tekst drugiego planu | `rgb(58, 60, 64)` = `#3A3C40` |
| Akcent w tekście („69", numeracja) | `#D6202B` oraz ciemniejszy `rgb(158, 22, 31)` = `#9E161F` |
| Tekst na przycisku | `#FFFFFF` |

Obramowania: prawie wyłącznie 1 px `#14161A`; pomocnicze `#DCDAD2` i `#C9C7C0`. Zero zaokrągleń i cieni w widocznych elementach (oceniane wzrokowo na zrzutach).

Kroje: `"Instrument Sans", system-ui, sans-serif` (wagi 400, 600, 700 — jedyny krój tekstu); `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` w śladowej ilości. `/tool` używa innego kroju nagłówków (Archivo wg `app/fonts.css`; na zrzucie wygląda spójnie), blog — Poppins i DM Sans.

Rozmiary:

| Element | Rozmiar / interlinia / waga / odstęp liter |
|---|---|
| `h1` (jedyny nagłówek semantyczny) | 74,88 px / 70,39 px / 600 / −2,62 px |
| Podtytuł („The label says…") | wartości obliczone **niezmierzone** (element nie jest nagłówkiem) |
| Tytuł bloku | 21 px / 29,4 px / 600 / −0,21 px |
| Tytuł karty | 17 px / 20,4 px / 600 / −0,255 px |
| Lead | 20 px / 27 px / 400 oraz 18 px / 28,8 px / 400 |
| Tekst podstawowy | 15 px / 21,75–23,25 px / 400 |
| Tekst drobny | 13 px / 18,85 px / 400 i 12,5 px / 18,75 px / 400 |
| Etykiety wersalikami | 12 px / 600–700 / odstęp liter 1,68–2,64 px |

## Zrzuty (25 plików, każdy < 400 KB, razem ok. 1,6 MB)

Wszystkie w `agencja/podglad/`, wzór `audyt-<trasa>-<szerokość>-<n>.png`; `1` = pierwszy ekran, `full` = cała strona pomniejszona (390 → 75%, 1440 → 50%), `s1`–`s4` = kolejne pozycje przewijania `/`.

- `/`: `audyt-home-390-1`, `audyt-home-390-full`, `audyt-home-390-form503`, `audyt-home-1440-1`, `audyt-home-1440-s1`…`s4`, `audyt-home-1440-full`
- `/tool`: `audyt-tool-390-1`, `audyt-tool-390-full`, `audyt-tool-1440-1`, `audyt-tool-1440-full`, `audyt-tool-1440-paste`
- `/cv`: `audyt-cv-390-1`, `audyt-cv-390-full`, `audyt-cv-1440-1`, `audyt-cv-1440-full`
- `/blog`: `audyt-blog-1440-1` (500), `audyt-blog-1440-mock` (z atrapą API)
- `/privacy`: `audyt-privacy-390-1`, `audyt-privacy-1440-full`
- `/stop`: `audyt-stop-390-1`, `audyt-stop-1440-1`
- 404: `audyt-404-390-1`

Pominięte z powodu limitu plików: pierwszy ekran 1440 dla `/privacy`, 390 dla `/blog`, pozycje przewijania `/` na 390 (są w zrzucie całej strony).
