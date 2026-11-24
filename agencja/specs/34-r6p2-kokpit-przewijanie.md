> Status 21:20: zbudowane, NIE wypuszczone (cofnięcie R6). Kod: `agencja/r6p2-odrzucone` (`Cockpit.tsx`, `cockpit-scroll.css`) — do R6' kokpitu „For you”.

# Spec 34 — R6 przebieg 2 `/nawyko`: kokpit przełączany przewijaniem (24.11.2026 20:40)

Ze specu 27 pkt 2 („Przewijanie przełącza zakładki, klik skacze”). Budujący B (worktree `wt/b`). Tylko `app/nawyko/Cockpit.tsx`
i nowy `app/nawyko/cockpit-scroll.css` (import w Cockpit.tsx) — żadnych zmian w `nawyko.css`, `NawykoClient.tsx`, `page.tsx`.

## Kryteria
1. Na szerokości ≥ 900 px i wysokości ≥ 600 px, bez `prefers-reduced-motion`: `#cockpit` to przypięta scena (zewnętrzny kontener
   ok. 8 × 70 svh, wewnątrz `position: sticky; top:0; height:100svh`), aktywna zakładka = funkcja pozycji przewijania (8 zakładek).
   Wybór zakładki kliknięciem/klawiaturą przewija do jej odcinka (`scrollTo`, `behavior` zgodnie z reduced motion), fokus zostaje
   na zakładce. Pasek postępu (8 kresek) pokazuje odcinek.
2. Poniżej 900 px, przy niskim oknie albo z reduced motion: zachowanie jak dziś (klik/klawiatura, bez przypinania).
3. Przewijanie zmienia tylko stan liczbowy (setState przy zmianie indeksu, rAF, passive listener) — zero przesunięć układu
   (CLS przy przewijaniu 0), mediana najdłuższej klatki nie gorsza niż dziś o > 10%.
4. Safari (WebKitGTK): sticky działa, telefon ≥ 150 px szerokości, brak ucięcia na 1440×900 i 1100×620 z paskiem cookies
   (żaden fokusowalny element sceny pod paskiem).
5. Tablist ARIA bez regresji (strzałki, Home/End, roving tabindex, `aria-selected`).
