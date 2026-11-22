# 03 — /nawyko: od „Known in advance” w dół na sceny (22.11.2026, przebieg 3)

Źródło: priorytet Rafała 22.11 09:07 (agencja/STATUS.md). Zasada: jedna myśl = jedna scena, w której produkt coś robi;
najwyżej ok. 12 słów nagłówka + jedno zdanie. Telefon jest nicią całej strony.

## Zakres
Przypięta scena rośnie z 4 do 7 aktów (ten sam telefon, lewa kolumna się wymienia):
1–4. bez zmian (potwierdzenie, zdrapka, seria, nagroda).
5. **Nagrody = oś 30 dni.** Znacznik jedzie z przewijaniem, nagrody odpalają się w swoich dniach (dzień 7 darmowa dostawa,
   dzień 24 pieczątka + kod na kolejne opakowanie, cashback przy następnym zamówieniu). Dzień da się przeciągnąć
   (natywny `input type=range` na osi — działa z klawiatury). Telefon pokazuje ten sam dzień. Dni podpisane jako przykład.
6. **Widok marki.** Jeden telefon kończy opakowanie („30 doses, 34 days”) = jedna czerwona kropka; reszta kropek buduje
   rozkład „którego dnia opakowanie naprawdę się kończy” obok dnia z etykiety. Podpis: ilustracja, dane zmyślone.
7. **White label.** Wybór skóry przemalowuje CAŁĄ stronę (zmienne CSS na `.nk[data-skin]`) i telefon.
Poniżej sceny: „czego nie robi” = trzy zdania dużym krojem w jednej sekcji; **finał** = formularz obok telefonu, na którym
pojawia się nazwa wpisywana w polu adresu sklepu (lokalnie, nic nie jest wysyłane przed „Send”).
Usunięte: dwie numerowane listy (Rewards, For the brand), osobny blok White label, trzy kolumny „No…”.

## Kryteria
- K1 Od aktu 5 nie ma układu „nagłówek + numerowana lista”; każdy akt ma ≤ 12 słów nagłówka i ≤ 2 krótkie zdania.
- K2 Telefon widoczny we wszystkich 7 aktach (390×844 i 1440×900), zmienia ekran w każdym akcie.
- K3 Oś: przeciągnięcie i strzałki zmieniają dzień; telefon i lista nagród zgodne z dniem.
- K4 Wykres: żadna liczba nie udaje faktu — podpis „illustration, invented data”; jedyna czerwień = kropka z telefonu.
- K5 Skóra zmienia tło, tekst, linie całej strony; kontrast tekstu ≥ 4,5:1 w każdej skórze.
- K6 Bez JS / reduced-motion / webdriver: wszystkie treści czytelne statycznie (stan końcowy), bez przypięcia.
- K7 Bramki: build, tsc, lint (≤ 1 ostrzeżenie), qa.js PASS na /nawyko i /calculator, content-rules, CLS ≤ 0,02.
- K8 Zero prawdziwych marek, zero twierdzeń zdrowotnych, zero losowości, zero nowych bibliotek.
- K9 Formularz: ten sam kontrakt `/api/lead` (form=nawyko); nazwa na telefonie tylko z pola odwiedzającego.
