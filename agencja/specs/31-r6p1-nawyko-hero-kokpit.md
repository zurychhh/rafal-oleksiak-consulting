# Spec 31 — R6 przebieg 1 `/nawyko`: hero z całą personalizacją, przerywnik „why”, kokpit mechanik (24.11.2026)

Wycinek spec 27, sceny 0–2. Budujący A (worktree `wt/a`). Evidence, FAQ, wielki finał i formularz bez zmian (przebieg 2).

## Kryteria
1. Jeden konfigurator marki na stronie — w hero: nazwa, kolor, styl strony (Paper/Night/Clay). Podpis: wszystko niżej już
   podąża za marką. Środkowy konfigurator (`SkinPanel`, `#nk-wl`) usunięty. Kategoria: silnik marki jej nie ma — pominięta.
2. Styl strony żyje w silniku marki (`app/lib/brand-engine.ts`, pole `skin`, localStorage w try/catch), nie w `Story`.
3. Przerywnik `#why`: pełna szerokość w kolorze marki (tekst `onColour`), licznik „Day 1 of 30” → „Day 31” sterowany
   przewijaniem, jedno zdanie. Bez JS / reduced motion: stan statyczny „Day 30 of 30” + zdanie. Licznik o stałej szerokości (bez CLS).
4. Kokpit `#cockpit` zastępuje Scene („Four steps”/„Rewards in the app”), Loyalty, MoreScenes, NeverScene. Zakładki: Daily card ·
   Streak & stamps · Cashback · Points & levels · Paths · Pharmacy receipt · Consents · Rules. Lewo: ciemny telefon w marce
   (`.nk-hhead`, `.nk-hmono` jak w hero). Prawo: zdanie klienta, kontrolka marki (suwak/przełącznik zmienia telefon), liczba
   „Example:”/„Fixed:”. Rules: trzy przełączniki zawsze `aria-checked=false`, wracają i mówią dlaczego.
5. Tablist ARIA: strzałki, Home/End, `aria-selected`, roving tabindex, `tabpanel` z `aria-labelledby`.
6. 390 px: zakładki przewijane poziomo, telefon nad panelem, telefon z jawną szerokością 230 px (≥150, bez max-width:100% na aspect-ratio).
7. Martwy kod i CSS usunięte; SiteNav i ChapterBar bez linków do usuniętych id.

## Zrobione
- Wszystkie kryteria 1–7. Nowy plik `app/nawyko/Cockpit.tsx` (WhyInterlude + Cockpit). `NawykoClient.tsx` 2317 → ~760 linii,
  `nawyko.css` 1277 → ~840 linii (automatyczne wycięcie reguł, których klasy/id nie występują w kodzie, + nowe style).
- Prefiks kokpitu `nk-kp-*` (`nk-ck` był już klasą checkboxa w formularzu — kolizja złapana na zrzucie).
- `page.tsx`: rozdziały Your app · Why · How it works · Proof · Integrations · FAQ · One morning · Enquiry; usunięty `PIN_JS`
  (rezerwa wysokości starej przypiętej sceny).
- Bramka `short-viewport-check.mjs` dostosowana: przypiętą sceną `/nawyko` jest teraz final `.nk-fz` (scena `.nk-fz-stick`);
  sprawdza to samo (zasłanianie fokusowalnych elementów sceny na niskim oknie z cookies), tylko na scenie, która istnieje.
- Nazwy w nagłówkach `#why` i kokpitu ukryte przy `data-brand-wait` (zero mignięcia nazwy demo).

## Zostało
- Przełączanie zakładek przewijaniem (przypięta scena) — tylko klik/klawiatura w tym przebiegu.
- Czytelnik-kupujący (osobny subagent) dla nowych tekstów — nie uruchomiony (budujący nie ma narzędzia do subagentów); teksty w
  `agencja/teksty-do-akceptacji.md`, copy-voice OK.
- Kategoria w hero (brak w silniku marki).
- Na 390 px nagłówek mówi „Above/Below” zamiast „Left/Right” (dwa warianty w DOM, przełączane CSS).
