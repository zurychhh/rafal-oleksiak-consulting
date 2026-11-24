# Spec 36 — R6' p2 `/nawyko`: jeden konfigurator (hero) + kokpit przewijany na desktopie (24.11.2026 22:40)

Źródło: Rafał 24.11.2026 19:15 (spec 27): „personalizacja w połowie strony dubluje górę — wszystkie opcje (tło itd.) na górę”;
RUNDA 6' w `agencja/STATUS.md`: „Środkowy konfigurator: jego opcje (styl strony/tło) przechodzą do konfiguratora w hero, środkowy znika”;
„Wizualnie podnieść [kokpit] do poziomu finału bez usuwania treści”. Kolejka R6'-N1 pkt 1–3.

NIE RUSZAĆ: hero poza panelem konfiguratora, „Four steps…” akty 1–6, `Loyalty`, finał „One morning with {marka}”, `Enquiry`,
`#integrations`, `#faq`. Żadna inna sekcja nie znika.

## A — jeden konfigurator (budujący A, worktree `wt/a`)
Zakres: `Scene` (akt 7 „Your branding”, `SkinPanel` w scenie), panel konfiguratora w `HeroApp`, reguły CSS z nimi związane,
`page.tsx` (lista rozdziałów/JSON-LD, jeśli wymienia akt), `agencja/inwentarz/zgody.json`.
1. Konfigurator w hero ma trzy grupy: nazwa marki, kolor, **styl strony (Paper / Night / Clay)** — ta sama logika `skin`, którą dziś
   ustawia `SkinPanel`; wybór w hero zmienia stronę tak samo jak dziś wybór w akcie 7 (stan `skin` podniesiony tak, by hero go ustawiał).
   Grupa stylu jako `radiogroup` z etykietą, obsługa klawiaturą (strzałki), widoczny fokus, cel dotyku ≥ 44 px na 390.
2. Akt 7 „Your branding” znika ze sceny (ACTS 7 → 6, nazwy aktów, nawigacja aktów, pasek rozdziałów, wersja bez ruchu, wersja < 900 px).
   Żaden inny akt nie zmienia treści. Długość toru sceny skraca się o jeden akt.
3. Inwentarz: każdy nagłówek/zdanie/krok aktu 7, który znika, ma wpis w `agencja/inwentarz/zgody.json` z cytatem:
   „Rafał 24.11.2026 19:15 (spec 27): personalizacja w połowie strony dubluje górę — wszystkie opcje (tło itd.) na górę”.
   Zdania, które dalej mają sens, przenieść do hero (np. podpis „everything below follows your brand”), nie kasować.
4. Bramka: na stronie dokładnie jeden element z kontrolką nazwy marki (`input` nazwy) i jedna grupa stylu.

## B — kokpit przewijany na desktopie (budujący B, worktree `wt/b`)
Zakres: funkcja `BrandCockpit` w `NawykoClient.tsx` (tylko ona), nowy plik `app/nawyko/cockpit-scroll.css` (import w `NawykoClient.tsx`
albo `page.tsx`), wzór z `origin/agencja/r6p2-odrzucone:app/nawyko/Cockpit.tsx` i `cockpit-scroll.css` (pobierać `git show`, nie scalać).
1. ≥ 900 px szerokości i wysokość ≥ 600 px, bez `prefers-reduced-motion`: kokpit przypięty (`position:sticky`), tor 5 × 45 svh,
   zakładka aktywna wynika z pozycji przewijania; widoczny pasek postępu toru; klik zakładki = płynny skok do jej odcinka toru
   (NN/g „Scrolljacking 101”: krótko, z postępem, klik = skok). Klawiatura (strzałki/Home/End w tablist) też przewija do odcinka.
2. < 900 px, niskie okno albo reduced motion: dzisiejsze zachowanie (zakładki na klik, bez przypinania).
3. Bez JS (przed hydratacją) widać wszystkie pięć paneli jeden pod drugim (nie tylko pierwszy) — atrybut `hidden` dopiero po hydratacji.
4. Kotwice `/nawyko#paths|#pharmacy|#privacy|#proof|#never` dalej aktywują właściwą zakładkę (na desktopie: przewinięcie do jej odcinka).
5. CLS 0 przy wejściu i przy przewijaniu (`cls-scroll`), `scroll-perf` ≤ 100 ms, WebKit 390/1440 PASS, `short-viewport-check` 1100×620 i 1280×720.
6. Wygląd na poziomie finału: kokpit wypełnia ekran, telefon klienta i panel marki bez pustej dolnej połowy na 1440 (recenzja 42).

## Bramki całości
build · `tsc --noEmit` · lint 0 błędów (≤ 1 ostrzeżenie) · `bash scripts/gates.sh http://localhost:<port> /nawyko` (w tym
`section-inventory`, webkit, brand-propagation, clsscroll, scroll-perf) · zrzuty 390/1440 (hero z grupą stylu, kokpit w 3 pozycjach toru)
· WebKit obejrzany · recenzent niezależny · czytelnik-kupujący na nowych tekstach.
