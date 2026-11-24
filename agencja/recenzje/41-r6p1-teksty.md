# 41 — czytelnik-kupujący: R6 przebieg 1 (/nawyko spec 31, /work/genactiv spec 32)

Rola: dyrektor e-commerce marki suplementów, widzi same teksty, bez strony. Rubryka: `agencja/rubryka-tekstow.md` (z „Odrzucone i dlaczego”).
Data: 24.11.2026. {marka} = nazwa marki odwiedzającego.

Wynik: 42 wiersze, 13 KEEP, 29 REWRITE. Najpoważniejsze: nagłówek kokpitu „Left/Right” (bez strony nic nie znaczy), „slack” (żargon),
„a level they do not want to lose” (sprzeczne z „Levels never drop” i brzmi jak granie na lęku przed stratą), „A missed day does not wipe
the streak” (do sprawdzenia, czy to prawda w produkcie: znana mechanika to pieczątka za 24 z 30 dni, a nie seria odporna na przerwy).

| Trasa | Tekst | Werdykt | Propozycja | Dlaczego |
|---|---|---|---|---|
| /nawyko | Page style · Paper / Night / Clay | REWRITE | Style · Light / Dark / Warm | „Page style” sugeruje wygląd strony, nie mojej aplikacji; „Paper/Clay” to język projektanta, nie wiem, co dostanę. |
| /nawyko | Everything below already follows {marka}. Nothing is sent. / Everything below follows what you set here. Nothing is sent. | REWRITE | Every screen below now shows {marka}. Nothing is sent. / Every screen below shows what you set here. Nothing is sent. | „follows” jest mgliste; „shows” mówi, co widzę. Brzmienie zgodne z zaakceptowanym wcześniej „Every phone below now shows your brand”. |
| /nawyko | Day N of 30 / Day 31 | KEEP | — | Konkret, liczba na początku. |
| /nawyko | A pack lasts 30 days. On day 31, {marka}’s customer reorders or quietly disappears. | REWRITE | Day 31: the 30-day pack is empty. {marka}’s customer reorders, or drifts away. | „A pack lasts 30 days” twierdzi coś o MOJEJ marce, co nie musi być prawdą; zasada 8: zacząć od „Day 31”. |
| /nawyko | How it works · Left: what {marka}’s customers see. Right: what {marka} sets. (390 px: Above / Below) | REWRITE | Nagłówek: Each reward: the customer’s screen and {marka}’s settings. Etykiety przy panelach zamiast „Left/Right/Above/Below”: Customer’s screen · {marka}’s settings | „Left/Right” nie przechodzi testu bez kontekstu i zmienia się między szerokościami; etykieta ma być na samym panelu. |
| /nawyko | Zakładki: Daily card · Streak & stamps · Cashback · Points & levels · Paths · Pharmacy receipt · Consents · Rules | REWRITE | Daily card · Streak & stamps · Cashback · Points & levels · Lessons · Pharmacy purchases · Reminders · Fixed rules | „Paths” i „Rules” nic nie mówią; „Consents” to język prawnika; „Pharmacy receipt” to narzędzie, a korzyść to zakupy w aptece. |
| /nawyko | The customer feels · {marka} sets | REWRITE | Customer sees · {marka} sets | „feels” to obietnica emocji, której nie da się sprawdzić; „sees” jest symetryczne i prawdziwe. |
| /nawyko | One small, satisfying moment after each dose. | REWRITE | One card to scratch after each dose. | „small, satisfying” to przymiotniki; czynność jest konkretna. |
| /nawyko | Free shipping on day N | KEEP | — | Jasne. |
| /nawyko | Example: 30 visits to {marka} per pack instead of one. | REWRITE | Example: 30 app opens per pack, not one visit at checkout. | „visits” — do sklepu? do aplikacji? Kupujący myśli „30 wizyt w sklepie” i nie wierzy. |
| /nawyko | Ekran: Today · day 18 · ✓ Ticked · Next card tomorrow · N cards to free shipping | KEEP | — | Czytelne. |
| /nawyko | Ekran: Free shipping waiting in the shop | REWRITE | Free shipping code ready for the next order | „waiting in the shop” — gdzie, jak odebrać? Kod jednorazowy to prawda produktu. |
| /nawyko | A missed day does not wipe the streak, so one bad day is not the end. | REWRITE | Missed days are allowed: the stamp needs N of 30, not all 30. | Do sprawdzenia, czy seria naprawdę nie zeruje się; pewna mechanika to pieczątka za N z 30 dni. „one bad day is not the end” — ton pocieszania, nie doradcy. |
| /nawyko | Stamp after days N | REWRITE | Stamp after N of 30 days | Szyk łamany, nie czyta się. |
| /nawyko | Example: N days of slack built into every pack. | REWRITE | Example: a customer can miss N days and still get the stamp. | „slack” = żargon, kupujący nie zrozumie w 5 s. |
| /nawyko | Ekran: Stamp after N of 30 days · Ticked so far | KEEP | — | Jasne. |
| /nawyko | Ekran: N days of slack: a missed day keeps the stamp in reach. | REWRITE | You can miss N days. The stamp stays in reach. | „slack” po raz drugi, tym razem na ekranie klienta końcowego. |
| /nawyko | Money waiting in the wallet that only works in your shop. | REWRITE | Cashback the customer can spend only at {marka}’s shop. | „your” niejednoznaczne (klient? marka?); bohater = {marka}. |
| /nawyko | Cashback per order €N | KEEP | — | Konkret. |
| /nawyko | Example: €N goes back into {marka}’s next orders, not to a marketplace. | REWRITE | Example: €N per order, spendable only on the next {marka} order. | Kontrast „X, not Y” dla efektu (zasada 2); marketplace to wtrącony wróg. |
| /nawyko | Ekran: Wallet · After 3 orders · €N back per order · Use on the next order · Online shop only | REWRITE | Wallet · Balance after 3 orders · €N back per order · Use on the next order · Online shop only | „After 3 orders” samo w sobie brzmi jak warunek (portfel dopiero po 3 zamówieniach?). |
| /nawyko | Progress they can see, a level they do not want to lose. | REWRITE | Points for every ticked day. Levels never drop. | Sprzeczne z mechaniką (poziom się nie traci) i gra lękiem przed stratą — przy suplementach źle się czyta. |
| /nawyko | Points per ticked day N · Example: N points in a full pack. | KEEP | — | Konkret; ewentualnie „a full 30-day pack”. |
| /nawyko | Ekran: Bronze/Silver/Gold · {poziom} level reached | KEEP | — | Jasne. |
| /nawyko | Short lessons on how to take and store the product, in your voice. | REWRITE | Short lessons from {marka} on using and storing the product. | „your voice” — czyim? Bohater = {marka}. |
| /nawyko | Lessons in the path N | REWRITE | Lessons: N | „path” to wewnętrzna nazwa. |
| /nawyko | Example: N reasons to open the app in the first week. | REWRITE | Example: one lesson a day for the first N days. | „reasons to open” to język marketera o kliencie; czynność jest jaśniejsza. |
| /nawyko | Ekran: How to use {marka} · Lesson N · One short lesson a day. | KEEP | — | Jasne. |
| /nawyko | Bought at a pharmacy? The streak still counts. | REWRITE | Pharmacy purchases count: the customer scans the receipt. | Zasada 8: treść na początku, nie pytanie. |
| /nawyko | Accept pharmacy receipts · Example: only online orders count. | KEEP | — | Jasne, dwa stany symetryczne. |
| /nawyko | Example: purchases outside the shop become visible to you. | REWRITE | Example: {marka} sees pharmacy purchases: product and date, never the photo. | „visible” — co dokładnie widzę? Przy danych z paragonu trzeba powiedzieć zakres (zdjęcie nie opuszcza telefonu). |
| /nawyko | Ekran: Scan the receipt · The photo stays on this phone | KEEP | — | Jasne i prawdziwe. |
| /nawyko | Asked once, plainly. A no changes nothing. | REWRITE | Reminders are optional. Rewards stay the same either way. | „A no” — niezgrabne, trzeba przeczytać dwa razy. |
| /nawyko | Ask for daily reminders · Fixed: rewards never depend on push or e-mail consent. · Ekran: Rewards · Same either way · Saying no costs the customer nothing. | KEEP | — | Jasne, zgodne z produktem. |
| /nawyko | Trust: what the card promises is what they get. | REWRITE | Every reward is set before the card is scratched. | „Trust:” to slogan; zdanie po nim mgliste. |
| /nawyko | Random prize draws / Health claims on cards / Swap a reward after scratching · Stays off · Locked for every brand. | KEEP | — | Jasne; żadnej treści oświadczenia zdrowotnego (zgodne z „Odrzucone” 24.11). |
| /nawyko | Fixed: 0 random draws, 0 health claims. | REWRITE | Always off: random draws and health claims. | „0 … 0” brzmi jak statystyka, nie reguła. |
| /work/genactiv | Act N of 11 · <streszczenie> | REWRITE | Part N of 11 · <streszczenie> | „Act” — teatr; kupujący czyta to jako manierę autora. |
| /work/genactiv | The box becomes a daily habit · The problem: the habit fades · Proof of purchase · One card a day · Rewards known in advance · Cashback that grows · Points and levels · How success is measured | KEEP | — | Krótkie, konkretne, zrozumiałe bez strony. |
| /work/genactiv | Consent, never a condition | REWRITE | Rewards without push consent | Kontrast „X, never Y” dla efektu; propozycja mówi wprost, co to znaczy. |
| /work/genactiv | How it was built | REWRITE | Setup: Shopify and the app | Autor w centrum; kupujący chce wiedzieć, co trzeba podłączyć. (Shopify jest faktem z projektu.) |
| /work/genactiv | Your brand colour | REWRITE | The same app in your brand colour | W studium przypadku GENACTIV nagłe „your” myli (czyj kolor?). |

## Uwagi poza tabelą
- Do weryfikacji przez Leada przed przyjęciem: czy w produkcie seria faktycznie nie zeruje się po pominiętym dniu (tekst Streak & stamps). Jeśli zeruje — mój zamiennik o pieczątce N z 30 jest bezpieczny.
- Po przepisaniu: druga runda czytelnika na zmienionych pozycjach (rubryka: „przepisać i sprawdzić ponownie”).
