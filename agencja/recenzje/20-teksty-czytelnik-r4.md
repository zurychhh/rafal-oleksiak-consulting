# Czytelnik-kupujący, runda 4: /nawyko (sceny d, e, f) i /work/genactiv

Rola: założyciel lub CMO marki suplementów, czyta na telefonie, nie zna autora. Czytałem samą listę tekstów, bez strony. Rubryka: `agencja/rubryka-tekstow.md`.

## Najważniejsze
1. **/work/genactiv mówi w czasie przeszłym o czymś, co jest pilotem.** „GENACTIV turned…”, „gives its customers an app” czytam tak: aplikacja jest w sklepach i klienci jej używają. Według reguł repo nawyko trwa pilot (sklep deweloperski, testy na iPhonie Rafała). To łamie zasadę 7. Do tego podpis „Example screen, not a screenshot of the app” każe mi wątpić, czy aplikacja w ogóle istnieje.
2. **Nazwa prawdziwej marki w publicznej treści wymaga zgody.** Potrzebna jest zgoda GENACTIV i bramka publikacji (sekcja 10). Zdanie „Customers stop halfway through the pack… the second order does not come” brzmi jak dane GENACTIV ujawnione publicznie i stawia markę w złym świetle. Liczby „15 of 30 days” i „Day 24 stamp” stoją obok nazwy klienta. `content-rules` zabrania liczb przy nazwie klienta, więc trzeba sprawdzić, czy profil trasy na to pozwala.
3. **Skan kodu z pudełka nie potwierdza zakupu ani apteki.** Kod EAN jest taki sam na każdym opakowaniu. Teksty „The barcode on the box confirms the purchase” i „Purchase confirmed · pharmacy” obiecują więcej, niż skan daje. Kupujący z FMCG wyłapie to od razu.
4. **Słowo zakazane:** „unlock” w „Turn on and unlock” (scena f, zasada 4). Innych słów z listy i pierwszej osoby nie znalazłem.
5. **Ścieżki nauki (scena d):** nie wiem, czy produkt to dziś robi (zasada 7, do sprawdzenia w specyfikacji). Lekcje o suplemencie to ryzyko twierdzeń zdrowotnych poza zatwierdzonymi oświadczeniami UE. „Joins the customer’s next order” nie zgadza się z mechaniką: nagrody to jednorazowe kody Shopify, nie automatyczne dodanie produktu do zamówienia.

## A) /nawyko

### (d) Ścieżki nauki
| Tekst | Werdykt | Propozycja |
|---|---|---|
| „For you” | pusty: nie mówi, co jest w scenie | „Second product” albo „Cross-sell” |
| „Learning paths” | OK | — |
| H „Cross-selling without ads: short lessons end with a gift.” | żargon na początku i kontrast dla efektu („without ads”); „gift” nie mówi, co dostaje klient | „Five short lessons end with a second product.” |
| „When a path is done, a matching product joins the customer’s next order.” | obietnica bez pokrycia: nagrody to kody do sklepu, nie automatyczny dodatek do zamówienia | „After the last lesson, the customer gets a code for a matching product.” |
| „Next lesson” / „Start again” | OK | — |
| Podpis „…You choose the lessons and the gift.” | niejasne: „you” to marka czy klient? | „The brand picks the lessons and the gift.” |
| Telefon: „Learning path”, „Lesson n of 5”, „✓ done / now / next”, „Gift at the finish” | OK | — |
| „Gift added to your next order” | obietnica bez pokrycia, jak wyżej | „Gift code ready for your next order” |
| „A matching product from {Brand}” | OK | — |
| Treść lekcji (poza listą) | ryzyko twierdzeń zdrowotnych | dopisać w scenie: lekcje tylko z zatwierdzonymi oświadczeniami UE (do potwierdzenia u prawnika) |

### (e) Zakupy w aptece
| Tekst | Werdykt | Propozycja |
|---|---|---|
| „Pharmacy purchases” | OK | — |
| H „Pharmacy buyers become visible when they scan the box.” | niejasne: „visible” dla kogo i gdzie? | „Pharmacy buyers appear in your data after one scan.” |
| „…starts the daily card like an online order and shows up in your reports.” | „reports”: czy produkt ma raporty dla marki? Do sprawdzenia (zasada 7) | jeśli raportów nie ma: „A pack bought offline starts the daily card, like an online order.” |
| „Scan the box” | OK | — |
| „Purchase confirmed · pharmacy” (podpis i telefon) | obietnica bez pokrycia: kod z pudełka nie mówi, gdzie kupiono | „Pack registered · bought offline” (aptekę rozpozna dopiero paragon) |
| „Scanning the barcode…” | OK | — |
| „The barcode on the box confirms the purchase.” | obietnica bez pokrycia: EAN jest wspólny dla wszystkich opakowań | „The barcode registers the pack; a receipt confirms the purchase.” |
| „Bought in a pharmacy?”, „Scan the box.”, „The daily card starts today.” | OK | — |

### (f) Prywatność
| Tekst | Werdykt | Propozycja |
|---|---|---|
| „Privacy” | OK | — |
| H „Health data never reaches your marketing.” | OK; mocna obietnica, ale pokrywa ją reguła produktu (żadnych danych o dawkach w analityce, push ani logach) | — |
| „Without consent, features stay visible and locked, with one button to turn them on.” | „features” jest puste: nie wiem, które | „Without consent, the daily card and streak stay visible but locked.” |
| „Without consent” / „With consent” | OK, dwie symetryczne etykiety | — |
| „Features locked.” | puste | „Daily card and streak locked.” |
| „Features on. A tick is stored as a date, never sent to ads, analytics or push messages.” | OK | — |
| „Health data · off/on” | słowo straszy klienta; nie widać, że to zgoda | „Health data consent · off/on” |
| „Visible. Locked until you agree.” / „Everything is on.” | OK | — |
| „Daily card”, „Streak”, „Pack rhythm”, „locked / ✓ on” | „Pack rhythm” jest niejasne | „Pack refill reminder”, jeśli to ta funkcja |
| „Turn on and unlock” | **ZAKAZANE: „unlock”** | „Agree and turn on” |
| „A tick records the date only.” | OK | — |

## B) /work/genactiv
| Tekst | Werdykt | Propozycja |
|---|---|---|
| „GENACTIV · Polish colostrum brand” | OK | — |
| H1 „GENACTIV turned its box into a daily ritual.” | obietnica bez pokrycia (przeszłość przy pilocie); „ritual” to przymiotnik zamiast konkretu; nie mówi o zysku marki | „GENACTIV is piloting an app that brings customers back for refills.” |
| „GENACTIV… gives its customers an app: …” | czas teraźniejszy sugeruje wydanie | „GENACTIV is testing an app with its customers: confirm the purchase, scratch one card a day, collect rewards known in advance.” |
| „The problem” / „Customers stop halfway through the pack.” / „…the second order does not come.” | twierdzenie o danych prawdziwej marki bez źródła; poufne i stawia markę źle | „The risk” / „Daily habits fade before the pack runs out.” / „When the habit fades, the reorder often does too.” (hipoteza o kategorii, nie o GENACTIV) |
| „Purchase proof from any shop.” | „any” to obietnica bez pokrycia | „Proof of purchase from a box or a receipt.” |
| „…The receipt stays on the phone.” | nieprecyzyjne: pola paragonu wychodzą z telefonu, zdjęcie nie | „The receipt photo stays on the phone.” |
| „One card a day, after the daily dose.” | OK | — |
| „The foil is in GENACTIV colours. Scratch it with a finger or a mouse.” | OK | — |
| „Reveal without scratching” / „Card revealed” | OK | — |
| „Rewards are set before day one.” + opis pierścienia i pieczątki | OK | — |
| „Example screen, not a screenshot of the app.” | kontrast „X, not Y”; podważa cały dowód | „Recreated screen. The app is in a private pilot.” |
| „Next order none” | niejasne | „Next-order reward: not yet” |
| Telefon: „Today's card”, „Rewards”, „This month”, „Confirm purchase”, „Stays on this phone”, „Day ticked”, „One step closer to the stamp” | OK | — |
| „15 of 30 days”, „Day 24 stamp” | liczby obok nazwy klienta: sprawdzić profil `content-rules` | zostawić, jeśli profil trasy na to pozwala |
| „See it with your brand →” | OK, lekko ogólne | „See this app in your brand colours →” |

## Pytanie dodatkowe: czy po pierwszym ekranie wiem, że to prawdziwa marka i aplikacja?
**Nie do końca.** Widzę nazwę marki i kategorię, ale:
- /nawyko pokazuje zmyśloną markę, więc „Polish colostrum brand” też może wyglądać na wymyśloną;
- nic nie mówi, że aplikacja działa u prawdziwych klientów, a podpis „Example screen, not a screenshot” mówi raczej, że nie;
- H1 nie mówi, co marka FMCG z tego ma (powtórne zamówienie). Mówi o „rytuale”.

**Co by mnie przekonało (bez liczb):**
1. Zdanie założyciela lub osoby z GENACTIV z imieniem, nazwiskiem i rolą, za ich zgodą: dlaczego to wdrożyli.
2. Logo i link do sklepu GENACTIV jako dowód, że marka istnieje (za zgodą).
3. Uczciwy stan: „Private pilot since <miesiąc> · iOS and Android”, data zamiast wyniku.
4. Prawdziwy zrzut z aplikacji testowej zamiast odtworzonego ekranu.
5. Jedno zdanie o koszcie wdrożenia po stronie marki: działa na ich sklepie Shopify, bez zespołu IT.
6. H1, który mówi o celu biznesowym: refill albo drugie zamówienie.
