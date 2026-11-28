# Recenzja 60 — przypięte sceny Cashback i Store engine (spec 54), recenzent niezależny + czytelnik-kupujący

## Recenzent (osobna sesja, nie widziała budowy) — werdykt FAIL → poprawione
1–4, 6–8 PASS (czytelność w 5 s, bez kiczu, odsłanianie krok po kroku, brak ucięć nad paskiem cookies, brak pętli
renderu i wycieków, SSR spójny, treść 1:1, brak nowych liczb).
Poprawki:
1. **I1 (blokujące):** linki menu „Points” (#levels) i „Point value” (#exchange) lądowały na niewidocznym kaflu →
   `useStepPin(n, ids)` przewija do kroku kafla przy starcie i `hashchange`; test w `step-pin-check` (wejście kotwicą).
2. `justify-content: center` liczył tylko dolną połowę nadmiaru → `safe center` (z zapasem `center`).
3. Pigułki silników zmieniały `aria-pressed` przy samym przewijaniu → w przypiętej scenie `aria-current="step"`.
4. `aria-live` na liczniku odzywał się przy każdym kroku → usunięty (stan niosą `aria-current` przycisków).
5. Teksty przez bramkę tekstów → czytelnik niżej.
6. Pasek rozdziałów schowany przez tor obu scen — tak samo jak przy kokpicie (zasada od spec 41); do wiadomości Rafała.

## Czytelnik-kupujący
„Point value” FIX (nie mówi, że to panel marki) → „Your points rate”. Etykieta nawigacji „Rewards, step by step” FIX
(generyczna) → „Cashback and points, step by step”. „1 of 3” / „1 of 7” OK.
