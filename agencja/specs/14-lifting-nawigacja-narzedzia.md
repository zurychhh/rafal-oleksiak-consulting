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
