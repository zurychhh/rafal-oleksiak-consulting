# Agencja — stan strony oleksiakconsulting.com

Ostatni przebieg: 21.11.2026, ok. 18:35–19:15 (przebieg 1). Gałąź: `agencja/strona` (od `claude/production` f4594c8).
Na produkcję nic nie poszło — wypuszcza wyłącznie Rafał.

## Dla Rafała

**Co.** Jest pierwsza wersja podstrony **`/nawyko`**: strona produktowa aplikacji z telefonem, który żyje podczas
przewijania. Cztery kroki w przypiętej scenie: potwierdzenie zakupu (skan kodu) → zdrapka dnia, którą naprawdę da się
zdrapać myszą albo palcem (seria rośnie wtedy z 8 na 9) → siatka 30 dni wypełniająca się do 24 → pieczątka 24/30
i kod na kolejne opakowanie. Niżej: nagrody znane z góry, co dostaje marka, przełącznik motywu (white label),
czego aplikacja nie robi, formularz zapytania spięty z istniejącym `/api/lead` (`form: "nawyko"`).
Pokaz jest na zmyślonej marce **Tovemi** — żadnego klienta. Do tego audyt produkcji i źródła pod kalkulator.

**Dlaczego biznesowo.** Do dziś strona nie mówiła o aplikacjach ani słowa (potwierdzone w audycie). Teraz marka FMCG
w pierwszym ekranie widzi, czym jest Nawyko i dla kogo, a po jednym przewinięciu bawi się zdrapką — to jest moment,
który zostaje w pamięci i prowadzi do formularza na tej samej stronie.

**Dowód.**
- Zrzuty: `agencja/podglad/nawyko-1440-przeglad.png` i `nawyko-390-przeglad.png` (cała strona w kadrach),
  `nawyko-1440-zdrapka.png`, `nawyko-1440-seria.png`, `nawyko-1440-nagroda.png`, `nawyko-390-zdrapka.png`,
  `nawyko-390-nagroda.png`, `nawyko-360x640-scena.png`, `nawyko-1440-reduced-motion.png`.
- Bramki (lokalnie, 21.11): build OK · `tsc --noEmit` OK · lint 0 błędów, 1 ostrzeżenie (tyle samo co przed) ·
  `qa.js` PASS na `/nawyko`, `/`, `/tool` (bez klucza AI — panele schowane), `/stop` · `content-rules` PASS ·
  `tool-rules` OK · `ship-compare` PASS. Formularz lokalnie: 503 (brak kluczy — oczekiwane), komunikat z adresem
  e-mail widoczny, zgody domyślnie odznaczone. CLS: 0,024 na 1440, 0,000 na 390. Zero żądań zewnętrznych, zero nowych bibliotek.
- Niezależna recenzja: `agencja/recenzje/01-nawyko.md` (5/10 punktów zaliczonych w pierwszym podejściu;
  poprawione po niej: tekst pod paskiem cookies na małych ekranach, lista nagród na zakładkach, zdrapka ze skutkiem,
  kontrast, fokus, notka o zmyślonej marce na telefonie, drobne treści). **Recenzent nie oglądał wersji po poprawkach** —
  drugie podejście jest pierwszym krokiem następnego przebiegu.
- **Podglądu Vercel NIE MA.** Commit 97db8d3 dostał od Vercela status `failure` z adresem
  `…?upgradeToPro=build-rate-limit` — czyli limit buildów planu, nie błąd kodu (lokalny build przechodzi).
  Stronę da się dziś obejrzeć tylko lokalnie: `git checkout agencja/strona && npm ci && npm run build && npm start` → `/nawyko`.

## Czeka na Rafała

1. **Limit buildów na Vercelu blokuje podgląd.** Vercel odrzucił build gałęzi z powodu limitu planu (odczytane ze
   statusu commita; najnowszy wpis wdrożenia widoczny w API GitHuba ma datę 12.10). Nie wiem, czy limit dotyka też
   produkcji — nie sprawdzałem domeny. Warianty: (a) poczekać na reset limitu i wypchnąć ponownie, (b) wyłączyć
   buildy podglądu dla gałęzi zadań cyklicznych, które pushują co godzinę, (c) plan Pro (wydatek — Twoja decyzja).
   Rekomendacja: (b), bo godzinne pushe innych zadań zjadają limit; do tego czasu pushuję raz na przebieg.
   Bez decyzji: nie obejrzysz `/nawyko` na telefonie bez lokalnego uruchomienia.
2. **Treść `/nawyko` do zatwierdzenia przed produkcją.** Nagłówek: „A habit app with your logo on it.”; CTA „Ask about
   Nawyko”. Zdania, których nie umiem sam potwierdzić w produkcie: „Colors, type, wording and the reward list are
   settings, not a rebuild”, „The customer installs your app”, „Across your customers you see which day a pack is
   actually finished”, opisy czterech nagród (kiedy naliczana darmowa dostawa i cashback). Rekomendacja: przeczytaj
   sekcje „Rewards” i „For the brand” i skreśl, co nie jest prawdą dziś. Bez decyzji strona zostaje na gałęzi.
3. **Status Nawyko w ofercie.** Strona nie mówi, czy to pilotaż, czy gotowy produkt, ani ile kosztuje. Warianty:
   „pilot — szukam dwóch marek”, „dostępne od …”, albo bez statusu jak teraz. Rekomendacja: jedno uczciwe zdanie
   o pilotażu przy formularzu — zmniejsza ryzyko rozczarowania i podnosi jakość zapytań.
4. **Nazwa marki pokazowej „Tovemi”.** W wyszukiwarce nie znaleziono firmy ani marki o tej nazwie (16 kandydatów,
   14 odrzuconych — `agencja/research/marka-pokazowa.md`), ale rejestry znaków (EUIPO/UPRP) i domeny nie były
   sprawdzane. Zapas: „Talmivo”. Rekomendacja: zostawić Tovemi; sprawdzenie w TMview zajmie Ci 2 minuty.
5. **Mail potwierdzający po zapytaniu z `/nawyko`** jest ten sam co ze strony głównej („Got it — I reply by hand”).
   Rekomendacja: osobna wersja z jednym zdaniem o Nawyko — zrobię w kawałku (c), jeśli nie masz nic przeciw.
6. **Link do `/nawyko` ze strony głównej** wymaga zmiany w Claude Design albo dokładki w `ship-design` (jak link do
   `/tool`). Rekomendacja: dokładka `data-ship-added` w nagłówku i stopce — nie rusza Twojego nagłówka. Dziś do
   `/nawyko` nie prowadzi żaden link (jest tylko w sitemapie).
7. **Z audytu, decyzje treściowe** (`agencja/audyt.md`): pierwszy ekran `/` nie mówi wprost „co i komu” (propozycja
   jednej linii pod hasłem — hasła nie ruszam); `/privacy` opisuje formularz, którego już nie ma (dokument prawny —
   Twoja zgoda); `/blog` ma stary wygląd i nic do niego nie linkuje — zostawić, przebudować czy zdjąć z sitemapy.

## Następne (kolejka)

1. `/nawyko` — drugie podejście recenzenta na wersji po poprawkach; test dotyku zdrapki w emulacji telefonu;
   CLS 0,05 na 1024 px (opis kroków zwija się po starcie sceny) sprowadzić do ~0; własna karta OG dla `/nawyko`.
2. (b) Kalkulator FMCG — model i źródła gotowe w `agencja/research/kalkulator-zrodla.md`: dwa osobne scenariusze
   liczone tylko z pól odwiedzającego (skrócenie odstępu: ΔP = N × AOV × 365 × (1/T1 − 1/T0); drugi zakup),
   benchmarki wyłącznie jako podpisane podpowiedzi (Recharge 2024/2026, Decile 2024, Narang i Shankar 2019).
   Cytaty przed publikacją trzeba otworzyć ponownie — część źródeł widziana tylko przez narzędzie odczytu.
3. (c) Nawigacja: link do `/nawyko` z `/` i `/tool` (po decyzji 6), mail dla `form=nawyko`.
4. (d) Poprawki techniczne z audytu, które nie są decyzją treściową: usunąć nieużywany `preload` obrazu 186 kB
   z `layout.tsx` (29–51% transferu każdej trasy), `try/catch` + `error.tsx`/`not-found.tsx` dla `/blog` (dziś 500
   przy niedostępnym API), `metadataBase`, wspólna kotwica `#enquiry` na telefonie.

## Lekcje

- **Jeden push na przebieg.** Vercel ma limit buildów; push „na próbę” na początku i drugi z kodem to dwa buildy.
  Dostęp do zapisu sprawdzaj przez `git push --dry-run`.
- Playwright z `node_modules` repo (1.62) nie pasuje do przeglądarki w chmurze. Własne skrypty uruchamiaj spoza repo
  (globalny playwright), a `design/qa.js` z `PW_CHROMIUM=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`.
- Turbopack nie przyjmuje `node_modules` jako symlinku — osobny worktree wymaga własnego `npm ci`.
- `globals.css` daje każdemu `<section>` padding, `overflow-x:hidden` i transform (zabija `position:sticky`).
  Reset przez `.nk :where(section)` — bez `:where` reset nadpisuje własne paddingi sekcji.
- Po `npm run build` trzeba ubić proces `next-server` (nie „next start”), inaczej stary serwer podaje 500 na nowe pliki.
- `qa.js` sprawdza też okna 1440×600 i 1280×520: telefon w scenie potrzebuje minimalnej wysokości (`clamp`), a scena
  przy oknie niższym niż 600 px zostaje w układzie statycznym.
- Szary `#6E6D68` ma na tincie `#EDEAE1` tylko 4,31:1 — na tle sceny używać `#5C5B56`.
- Linki do `/` z tras pisanych ręcznie to zwykłe `<a>` (runtime strony głównej nie znosi nawigacji klienckiej);
  lint wymaga przy nich `eslint-disable-next-line @next/next/no-html-link-for-pages`.
- Subagenci uruchomieni w jednym kroku blokują do końca najdłuższego (~10 min) — budowę zaczynać przed nimi albo
  zlecać im krótsze zadania.

## Decyzje podjęte samodzielnie (odwracalne)

- `/nawyko` jest trasą pisaną ręcznie (React + CSS), nie eksportem Claude Design — żeby dało się ją rozwijać z chmury.
- Scena sterowana postępem przewijania w JS (jeden nasłuch, `requestAnimationFrame`), nie natywnymi CSS scroll-driven
  animations: zdrapka i licznik i tak wymagają stanu w JS, a zachowanie jest identyczne we wszystkich przeglądarkach.
- Czerwień tylko na liczniku serii w scenie (zmierzona wartość); drugi telefon (white label) jej nie używa.
- `/nawyko` dopisane do `sitemap.ts`.
