# Wdrożenie — The Audit

Poprawiona wersja handoveru. Pierwsza była pisana jak dla pustego projektu i
w kilku miejscach była po prostu błędna — Vercel, Resend i HubSpot już działają,
a nazwy zmiennych środowiskowych, których użyłem, nie istnieją w twoim kodzie.

---

## Co już masz i czego nie ruszamy

Resend jest skonfigurowany i realnie wysyła — `app/api/send-email/route.ts`,
`app/api/lama/audit/route.ts` (ten drugi wysyła nawet załącznik, więc wzorzec
jest sprawdzony). HubSpot chodzi przez `HUBSPOT_API_KEY` i helper
`app/lib/hubspot.ts`. Domena stoi na Vercelu. Zmienne to `FROM_EMAIL`,
`TO_EMAIL`, `RESEND_API_KEY`, `HUBSPOT_API_KEY` — nowy endpoint korzysta
dokładnie z nich i nie wprowadza żadnej nowej.

Jedyna zależność do doinstalowania to **zod** (dla lintu dodatkowo
`@eslint/js typescript-eslint @next/eslint-plugin-next`). Nie ma go w `package.json`, a to
jest ta sama luka, którą zgłaszałem w pierwszym review: żaden z twoich
trzydziestu jeden endpointów nie waliduje wejścia. Nowy waliduje.

```
npm i zod
npm i -D @eslint/js typescript-eslint @next/eslint-plugin-next
```

Uwaga z audytu kodu: `npm i zod` instaluje dziś **wersję 4**, w której
`z.record()` wymaga dwóch argumentów. Kod jest już napisany w formie działającej
na obu wersjach — nie „poprawiaj" tego z powrotem.

---

## Pliki

| Plik z paczki | Trafia do |
|---|---|
| `index.html` | źródło strony głównej |
| `api-lead-route.ts` | `app/api/lead/route.ts` |
| `sheet-email.ts` | `app/lib/sheet-email.ts` |
| `lead-hubspot.ts` | `app/lib/lead-hubspot.ts` |

`lead-hubspot.ts` trzyma dokładnie ten sam kształt co istniejący
`app/lib/hubspot.ts` — ta sama zmienna, ten sam typ zwracany — żeby nie robić
drugiej konwencji obok pierwszej.

`index.html` jest kompletną stroną i działa otwarty z dysku. Do Nexta:
`<style>` do modułu CSS, skrypt do komponentu klienckiego, logika bez zmian.

---

## HubSpot — skryptem, nie ręcznie

```
node scripts/hubspot-setup.mjs          # podgląd
node scripts/hubspot-setup.mjs --apply  # tworzy
```

Dziesięć własnych właściwości kontaktu. Skrypt jest idempotentny, czyta klucz
z `.env.local` i nigdzie go nie wypisuje. Potrzebuje na tokenie uprawnienia
`crm.schemas.contacts.write`.

Dwa pola robią całą kwalifikację. `lead_intent` dzieli skrzynkę na „chcę plik"
i „odezwij się w sprawie współpracy". `knows_own_interval` mówi, czy odwiedzający
potrafił odczytać własny interwał odkupu z danych — kto potrafił, jest zupełnie
innym rozmówcą niż kto nie potrafił, i to jest lepszy predyktor niż wielkość
sklepu.

## Na stronie — dwie rzeczy do dołożenia

`og.png` w rozmiarze 1200×630 — bez tego link na LinkedInie wygląda martwo,
a LinkedIn to twój jedyny działający kanał.

Strona `/stop` — wypis, do którego linkuje stopka każdego maila. Wystarczy jedno
pole, ale musi istnieć, skoro to obiecujesz.

Opcjonalnie: `"sameAs": ["https://www.linkedin.com/in/..."]` w JSON-LD. Usunąłem
placeholder, bo poszedłby na produkcję. W pliku jest komentarz w tym miejscu.

---

## Rotacja tokena — nadal nierobione

W commitowanym `STATUS.md`, linie ~70 i ~505, leży Google Ads Developer Token.
Zgłaszałem to w pierwszym review i to się nie zmieniło.

Wygeneruj nowy w Google Ads API Center, unieważnij stary, usuń wartość z pliku.
Jeśli repo było kiedykolwiek publiczne, historię też trzeba wyczyścić — ale
rotacja jest ważniejsza i wystarczy sama, jeśli historii nie ruszasz.

---

## Co zmienił przegląd pięcioma pętlami

**Zmyślone pasma odkupu zniknęły.** To był najcięższy zarzut: strona liczyła
kwotę z liczby, której nikt nie zmierzył, a potem przyznawała się do tego
w stopce — czyli sama kasowała własny nagłówek. Teraz jest puste pole
„dni między pierwszym a drugim zamówieniem" z instrukcją, jak to odczytać
z własnych zamówień w dwie minuty. Zostawione puste, strona mówi wprost:
nie znasz tej liczby, większość marek nie zna, i to jest właśnie ustalenie.
W sumie nie ma ani jednej mojej cyfry.

**FMCG jest teraz widoczne przed pierwszym kliknięciem.** Wcześniej nisza
siedziała wyłącznie w danych — w etykietach kategorii i w JSON-LD, czyli tam,
gdzie człowiek nie zagląda. Nagłówek mówi o opakowaniu, nie o kliencie, lead
wymienia kategorie z nazwy, CTA brzmi „Run the FMCG audit", a nagłówek RTB
nazywa niszę zamiast pytać „why me".

**Kolejność dowodów przestawiona** na Allegro → mBank/mOkazje → Genactiv →
Booksy. Genactiv wyszedł przed Booksy, bo to twoja bieżąca robota w kategorii,
którą founder może dziś sprawdzić. Booksy zostało oznaczone jako wyjątek —
nieoznaczone, stojące w środku listy, rozmywało wątek FMCG dokładnie tam, gdzie
czytelnik buduje przekonanie.

**Twoje nazwisko jest w treści**, nie tylko w structured data. Sceptyczny
founder sprawdza człowieka, zanim napisze.

## Czego strona nadal nie mówi

**Nie ma ceny ani kształtu współpracy.** W teście na founderze to wyszło jako
największy pojedynczy powód, dla którego zainteresowany człowiek i tak nie pisze:
odpowiedź zobowiązuje go do rozmowy z nieznanym progiem. Dopisałem trzy zdania
o tym, jak to działa — sheet, jedna odpowiedź, wycenione zadanie bez retainera —
ale **kwoty nie wymyśliłem i nie wymyślę**. Wstaw widełki albo choć „stała cena
ustalana z góry, zwykle X–Y", i to jest zmiana o największej dźwigni na tej
stronie.

**RTB mówi wyłącznie o retencji**, a plan obiecuje też paid i search. Albo
dosypujesz, co masz, albo zawężasz obietnicę do tego, co obronisz.

---

## Atrybucja

Strona łapie `utm_*` i referrer przy wejściu i wysyła je do HubSpota jako first
touch. Brakuje dwóch rzeczy po twojej stronie: osobnych kampanii UTM w linkach
na LinkedInie, żeby odróżnić ruch z posta o narzędziu od zwykłego ruchu
z profilu, oraz pytania „co sprawiło, że się odzywasz" zadanego na rozmowie
i zapisanego dosłownie.

Za rok jedyne pytanie, które będzie się liczyło, brzmi: czy ten jeden klient
przyszedł przez tę stronę, czy przez LinkedIna mimo niej.

---

## Reszta strony

Zgodnie z ustaleniem: wszystko poza blogiem wylatuje. Blog zostaje na `/blog`
i wreszcie wchodzi do `sitemap.ts` — dziś sitemapa ma tylko `/` i `/privacy`,
więc wszystkie wpisy są dla Google niewidoczne.

Lint jest już naprawiony — `eslint.config.mjs` w formacie flat i `"lint": "eslint ."`
zamiast usuniętego `next lint`. Zostaje otwarte: `HomeClient.tsx` wyłączony
z typecheck i `tailwind.config.ts` z paletą, której nie używa żadna linijka —
`#7B2CBF` wpisany na sztywno w 109 miejscach.

## Wycinanie

```
bash scripts/purge-legacy.sh          # podgląd
bash scripts/purge-legacy.sh --apply  # kasuje
```

175 plików, około 46 600 linii: radar, lama, MCC, Stripe, admin, auto-publish.
Skrypt najpierw zakłada gałąź i commit-checkpoint, dopiero potem usuwa przez
`git rm` — powrót jednym `git checkout`.

Dwa miejsca zostają i się zerwą, skrypt je wypisuje: `FinalCTA.tsx` strzela do
`/api/lama/audit` (do przepięcia na `/api/lead`) i `Accelerators.tsx` ma kafel
radaru. Po wszystkim `npx tsc --noEmit` pokaże resztę.
