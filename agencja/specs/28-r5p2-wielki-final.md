# Spec 28 — R5 p2: wielki finał `/nawyko` „One morning with {marka}” (24.11.2026, przebieg 16:38)

Źródło: spec 26 (uwaga Rafała 4 — „zakończenie ma być najmocniejsze”, wzór: koniec `/work/genactiv`; kierunek „Wielki finał”).
Zasada z sieci: NN/g „The Peak–End Rule” (https://www.nngroup.com/articles/peak-end-rule/) — doświadczenie oceniamy po szczycie
i po końcu, więc szczyt (odblokowana nagroda) i koniec (prośba o rozmowę w kolorze marki) stoją obok siebie.

## Zakres
Nowa sekcja `#finale` (komponent `Finale` w `NawykoClient.tsx`) między FAQ a formularzem; ekran przypięty, pięć chwil jednego poranka
klienta sterowanych przewijaniem; formularz `#enquiry` bez drugiego telefonu (po finale nic się nie powtarza).

## Kryteria
1. Pięć chwil: (0) ikona marki na ekranie głównym telefonu między zwykłymi aplikacjami (bez prawdziwych marek), (1) powiadomienie
   „Your card of the day is ready.” z monogramem marki, (2) aplikacja otwiera się z ikony: karta dnia — zdrapka w kolorze marki do zdrapania
   palcem/myszą + „Reveal without scratching”, (3) dzień 24: seria 23 → 24, druga pieczątka odblokowana, (4) kod na kolejne opakowanie
   gotowy, zakładka Rewards, cała sekcja w kolorze marki → formularz „Build {marka}’s app.”.
2. Przewinięcie dalej bez zdrapania odsłania kartę (historia idzie do przodu); kropki 1–5 to przyciski (klawiatura) przewijające do chwili.
3. Nazwa i kolor z silnika marki w każdym miejscu (`.nk-hhead`/`.nk-hmono` — bramka `brand-propagation` obejmuje finał).
4. Telefon: jawna szerokość z wysokości (PILNE 0), ≥ 150 px w WebKit 390 i 1440; tekst w telefonie ≥ 10 px.
5. Przewijanie zmienia tylko numer chwili (setState przy zmianie) — żadnego stanu na każdą klatkę; `scroll-perf` nie gorszy niż przed.
6. `prefers-reduced-motion`: bez przejść i animacji, ta sama treść. Bez JS: chwila 2 (karta dnia).
7. Teksty przez bramkę: copy-voice, czytelnik-kupujący (`agencja/recenzje/32-r5p2-teksty.md`), wpis w `teksty-do-akceptacji.md`.

## Poza zakresem (następne)
Przebudowa sekcji od „Cashback” w dół na prawdziwe ciemne ekrany (część 1 p2 — kolejny przebieg), bramka `monotonia`, kategoria produktu.
