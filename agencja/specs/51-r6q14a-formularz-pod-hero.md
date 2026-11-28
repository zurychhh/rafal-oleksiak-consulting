# Spec 51 — R6'q14-A: formularz pod hero `/nawyko`, trzy kroki „co dalej”, forma rozliczenia

Decyzja Rafała 28.11.2026 10:37 (przez doradcę): „zgoda na te 3, startuj”. Punkt (4) — link do `/work/genactiv` — nadal czeka na GENACTIV: żadnego linku.

## Zakres
1. Sekcja `#ask` zaraz po hero (`QuickAsk` w `NawykoClient.tsx`): adres sklepu + e-mail + zgoda kontaktowa (to samo brzmienie co `Enquiry`), wysyłka `QuickEnquiry` → `/api/lead`, `form: "nawyko"`, `source.page = /nawyko#ask`. Bez zgody marketingowej (krótki formularz; Baymard: liczba pól ważniejsza niż liczba kroków).
2. `NextSteps` (w `Enquiry.tsx`) przy `#ask` i przy istniejącym `#enquiry` (to on jest „drugim po FAQ” — nie dublujemy): 1) You send your store address. 2) Within 24 hours, Rafał Oleksiak (LinkedIn) replies to you personally. 3) First call: your store and how often your customers reorder.
3. Zdanie o rozliczeniu przy obu: „One setup fee plus a monthly fee. You get your quote after the first call.” (zatwierdzony sens; brzmienie „You get…” z bramki tekstów). Zero liczb.
4. Silnik marki: etykieta `#ask` „For {marka}”, akcent (pasek, numery kroków) w kolorze marki.
5. CTA hero „Ask about Nawyko” → `#ask`. Pasek rozdziałów i nawigacja zostają przy `#enquiry` (do przodu).
6. Recenzja: „(required)” także przy polach dolnego `Enquiry` (rubryka tekstów pkt 13), zgoda przed przyciskiem w kolejności Tab.

## Kryteria (bramka `scripts/nawyko-ask-check.mjs`)
- `#ask` jest następnym rodzeństwem `#top`; pierwsze pole ≤ 3,2 ekranu na 390×844 (było ~17), ≤ 2 na 1440×900.
- Oba formularze: 3 kroki, link LinkedIn, zdanie o rozliczeniu bez cyfr.
- Kolejność Tab: store > email > contact > submit. CTA hero → `#ask`.
- build, tsc, lint (0 błędów, ostrzeżeń nie więcej), `gates.sh` na `/nawyko`, `/`, `/work/genactiv`, `/calculator` (wspólny `Enquiry`), WebKit 390/1440, copy-voice, content-rules.
