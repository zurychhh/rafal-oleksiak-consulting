# Spec 14 — Lifting R4 pkt 2: wspólna nawigacja na każdej trasie + strona „Tools”

Źródło: kolejka R4 pkt 2 w `agencja/STATUS.md` („wspólna nawigacja: Konsulting · Nawyko · Narzędzia · Kontakt; strona
zbierająca `/tool` i narzędzia z `/lab`; zero ślepych zaułków”). `/` (eksport Claude Design) i jego nagłówka NIE ruszamy.

## Zakres
1. **`SiteNav`** — jeden komponent serwerowy (np. `app/components/SiteNav.tsx` + CSS), zwykłe `<a>` (nie `<Link>`:
   runtime `/` nie znosi nawigacji klienckiej). Pozycje: Consulting (`/`), Nawyko (`/nawyko`), Tools (`/tools`),
   Contact (kotwica formularza tej strony, gdy jest; inaczej formularz `/nawyko#enquiry`). `aria-current="page"` na
   bieżącej. Na: `/nawyko`, `/work/genactiv`, `/calculator`, `/tools`, `/lab/payback`, `/lab/reward`, `/lab/reminder`
   (`/lab/home` ma własny nagłówek-wariant — zostaje). Linki wewnątrz strony `/nawyko` (How it works · Cashback · …)
   zostają jako drugi poziom ≥ 1200 px. Work (`/work/genactiv`) NIE trafia do wspólnej nawigacji (trasa noindex, decyzja
   Rafała o linkowaniu czeka).
2. **`/tools`** — jedna strona, nagłówek = wniosek dla marki FMCG (≤ 12 słów) + jedno zdanie; karta na każde narzędzie:
   `/tool` (dokładny pomiar z eksportu), `/calculator`, `/lab/payback`, `/lab/reward`, `/lab/reminder`. Karta: nazwa,
   „co wiesz po 30 sekundach” (z `agencja/narzedzia.md`), czas/dane potrzebne, jeden link. Na końcu jedno CTA (Nawyko
   albo kontakt). `noindex` i poza sitemap, dopóki Rafał nie zdecyduje (wpis „Czeka na Rafała”).
3. **Zero ślepych zaułków:** stopka każdej trasy z (1) ma link do `/tools`.

## Kryteria
- Bez przepełnienia w poziomie 320–1440; nawigacja mieści się w jednym wierszu na 390 (albo czytelny skrót), osiągalna Tabem,
  focus widoczny; CLS nagłówka 0.
- Build, `tsc`, lint (0 błędów, ostrzeżeń nie więcej), `qa.js --scroll` PASS na `/nawyko`, `/calculator`, `/tools`;
  `content-rules --url` PASS; `copy-voice` zielony (dopisać `app/tools` do zakresu, jeśli trzeba).
- WebKit: `scripts/webkit-check.py` na `/tools` i `/nawyko` w 390 i 1440 PASS, zrzuty obejrzane.
- Teksty w `agencja/teksty-do-akceptacji.md` (sekcja „R4 przebieg 4 — nawigacja i Tools”).

## Wykonanie (24.11.2026, gałąź wt/r4p4-nav)
- `app/components/SiteNav.tsx` + `site-nav.css`: komponent serwerowy, zwykłe `<a>`, `aria-current="page"` (kreska w czerwieni
  strony; na /work/genactiv w `--accent-hi`). Przyjmuje klasę nagłówka strony (`nk-top nk-caps` / `ga-top`), więc wygląd
  zostaje. Contact = `#enquiry` na /nawyko, /calculator, /work/genactiv; gdzie indziej `/nawyko#enquiry`. Drugi poziom /nawyko
  (How it works…FAQ) jako `children`, od 1200 px pod kreską. Poniżej 600 px nazwisko znika (Consulting prowadzi na `/`),
  cztery pozycje w jednym wierszu. Work nie jest w nawigacji (current={null} na /work/genactiv).
- Wymienione nagłówki: /nawyko, /calculator, /lab/payback, /lab/reward, /lab/reminder, /work/genactiv (tylko page.tsx).
  Stopki tych tras + /tools mają link Tools. /lab/home bez zmian.
- `/tools` (`app/tools/page.tsx`, `tools.css`): H1 + zdanie, 5 kart (nazwa, pytanie, co wiesz po 30 s, „You need”, jeden link),
  finał z CTA do /nawyko. `robots: noindex, nofollow`, brak w `app/sitemap.ts` — **czeka na Rafała** (indeksować /tools?).
- `scripts/copy-voice.test.mjs`: zakres + `app/tools`.
- Pomiary: przepełnienie poziome 0 px (390, 1440; Chromium); wysokość nagłówka 65 px (390) / 66 px (1440) / 125 px na
  /nawyko ≥ 1200 (drugi poziom z CSS od pierwszej klatki, bez JS → CLS 0). Bramki: build OK, tsc 0, lint 0 błędów /
  1 ostrzeżenie (jak przed), copy-voice OK, qa.js --scroll PASS na /tools, /nawyko, /calculator (9 szerokości),
  content-rules --url PASS, webkit-check PASS /tools i /nawyko w 390 i 1440 (WebKitWebDriver doinstalowany: `apt-get install webkit2gtk-driver`).
- Zrzuty: `agencja/podglad/r4p4-tools-{390,1440}.png`, `r4p4-tools-wk-{390,1440}.png`, `r4p4-nav-nawyko-{390,1440}.png`.
- Nie zrobione: czytelnik-kupujący (osobny subagent) dla nowych tekstów — do zlecenia przez Leada.
