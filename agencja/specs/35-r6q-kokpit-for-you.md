# Spec 35 — R6' `/nawyko`: jeden kokpit „For you” po portfelu (24.11.2026)

Polecenie Rafała (runda R6'): widoki marki („For you”) zebrane w JEDEN kokpit zaraz po sekcji `#loyalty` („For your customer · Rewards in the app”).
Budujący A (worktree `wt/a`). Zakres: `app/nawyko/NawykoClient.tsx`, `nawyko.css`, `page.tsx` (lista rozdziałów), ten spec.
Poza zakresem (nie ruszać): hero, `Scene`, `Loyalty`, `Faq`, znaczniki `#integrations`, `Finale`, `Enquiry`, stary `Cockpit.tsx` (nie montowany).

## Kryteria
1. Kolejność: `#loyalty` → `#cockpit` → `#evidence` (tylko `#integrations`, bez zmian znaczników) → `#faq` → `#finale` → `#enquiry`.
2. `#cockpit` ma pięć zakładek: Learning paths (`#paths`), Pharmacy purchases (`#pharmacy`), Privacy (`#privacy`), Proof of results (`#proof`),
   What it never does (`#never`). Każdy panel to dotychczasowa treść sekcji 1:1 (te same nagłówki, zdania, przełączniki, suwak, telefony);
   zmienia się tylko opakowanie (`role="tabpanel"`, `hidden` dla nieaktywnych — treść zostaje w DOM).
3. Tablist zgodny z WAI-ARIA APG (automatyczna aktywacja): `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`,
   roving tabindex, strzałki lewo/prawo, Home/End. Panel `aria-labelledby` = jego zakładka, `tabIndex=0`.
4. Zdanie-pomost nad zakładkami (≤ 14 słów, podmiot = marka, bez oświadczeń zdrowotnych i liczb):
   „Now the same app from your side: what you set, what you see.”
5. Kotwice: wejście na `/nawyko#paths|#pharmacy|#privacy|#proof|#never` (i `hashchange`) aktywuje zakładkę i przewija do `#cockpit`
   (`behavior` zgodnie z `prefers-reduced-motion`). Pasek rozdziałów: wpisy Privacy i Proof zastąpione jednym `#cockpit`.
6. Wygląd: głęboki atrament `#0E0F12` jak `.nk-wallet`, kolor marki z silnika marki (`--brand`, `--brand-on`, `--hi`); panele jako
   karty z własną powierzchnią (papier / kolor marki / atrament). Na 390 px zakładki to przewijany poziomo rząd pigułek z wygaszeniem krawędzi
   (znika na końcu rzędu). Zmiana wysokości tylko po kliknięciu (CLS z wejścia użytkownika wyłączony). Reduced motion: bez animacji.
7. Bramki: `tsc` 0 błędów, lint nie gorszy niż przed zmianą (1 ostrzeżenie), `section-inventory` PASS, `gates.sh` bez nowych FAIL
   względem stanu sprzed zmiany, zrzuty 390×844 i 1440×900 dwóch zakładek w `agencja/podglad/r6q1-cockpit-*.png`.
