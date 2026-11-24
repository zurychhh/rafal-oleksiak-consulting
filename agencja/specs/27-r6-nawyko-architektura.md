# Spec 27 — RUNDA 6: finalna architektura `/nawyko` (Rafał 24.11.2026 19:15, synteza doradcy) + `/work/genactiv` równolegle

Rafał: „jest już dużo lepiej”, „najładniejszy jest wielki finał”. Jego uwagi (wiążące): sekcje „For you” to dalej ściana tekstu
ze zrzutami — zagregować albo usunąć; nie wiadomo, dlaczego nagle pojawia się „For your customer · Rewards in the app”;
personalizacja w połowie strony dubluje górę — wszystkie opcje (tło itd.) na górę; potrzebny storytelling, przerywniki między
sekcjami, lepsza architektura informacji; „For you” połączyć z „Rewards in the app” w jeden super kokpit mechanik, pod nim finał;
integracja ważna jako osobna sekcja, ale NIE tylko Shopify (Woo i inne silniki); FAQ „super bardzo nudne”; reszta strony ma
dorównać finałowi — ujednolicić wizualnie całość.

## Zasada (doradca)
Strona odpowiada decydentowi marki na cztery pytania, w tej kolejności, i nic poza tym: (1) co to jest i czy to moje,
(2) co mój klient poczuje każdego dnia, (3) co ja ustawiam i co z tego mam, (4) czy zadziała z moim sklepem i czy jest bezpieczne.
Potem finał pokazuje całość w jeden poranek i od razu zapytanie. Każda sekcja, która nie odpowiada na żadne z tych pytań,
wypada albo wchodzi do kokpitu. Język wizualny finału (atrament, nasycony kolor marki na całą szerokość, ciemny prawdziwy
ekran aplikacji, folia) staje się językiem całej strony; papier tylko jako oddech dla czytania.

## Finalny układ (7 scen zamiast ok. 13)
0. **Hero — Twoja aplikacja.** Żywy telefon + CAŁA personalizacja w jednym panelu: nazwa, kolor, styl/tło (paper/night/clay),
   kategoria. Podpis: wszystko niżej jest już marki odwiedzającego. **Usuń** środkowy konfigurator (`nk-wl` / „Type your brand
   name, pick a colour and a style”) — niżej strona tylko podąża za wyborem z góry.
1. **Przerywnik A — dlaczego.** Pełna szerokość w kolorze marki, jedno zdanie problemu sterowane przewijaniem: licznik dni
   zapasu 1 → 30, w dniu 31 klient albo zamawia, albo znika. To odpowiada, „skąd nagle nagrody”: niżej jest odpowiedź na ten dzień.
2. **Kokpit mechanik** (zastępuje: „Four steps”, „Rewards in the app”, portfel/cashback, punkty i poziomy, kurs punktów,
   ścieżki, apteka/paragony, zgody, „What it never does”). Przypięta scena, układ dzielony: **lewo — telefon klienta**
   (ciemny, prawdziwy ekran), **prawo — panel {marki}**. Nad nimi zakładki mechanik: Karta dnia · Seria i pieczątki · Cashback ·
   Punkty i poziomy · Ścieżki · Paragon z apteki · Zgody · Zasady (losowanie, twierdzenie zdrowotne, zamiana nagrody — zablokowane
   na stałe, przełącznik wraca i mówi dlaczego). Przewijanie przełącza zakładki, klik skacze. Każda zakładka: jedno zdanie, co
   czuje klient; jedno, co marka ustawia (suwak/przełącznik działa i zmienia telefon); jedna liczba dla marki („example” albo
   ze źródłem). Nagłówek-most: „Po lewej to, co widzi klient {marki}. Po prawej to, co ustawiasz i co z tego masz.”
3. **Przerywnik B — dowód.** Jeden pełnoszerokościowy moment: wzrost ponownych zakupów mierzony wobec grupy bez aplikacji
   (istniejący wykres i kropki), jedna myśl, zero dodatkowego tekstu.
4. **Twój sklep (integracja, osobna, krótka, wizualna).** Schemat: sklep odwiedzającego ↔ adapter ↔ aplikacja {marki}. Silniki:
   Shopify, WooCommerce, Shoper, IdoSell, PrestaShop, Magento / Adobe Commerce oraz własny sklep przez API i webhooki; zakupy
   w aptece i drogerii przez paragon. Kody jednorazowe w sklepie marki, dane zostają u marki. Uczciwie: „Shopify gotowy;
   pozostałe podłączamy w tygodniu wdrożenia” (nazwy silników tekstem, bez logo).
5. **Wielki finał „One morning with {marka}”** — bez zmian w treści, to wzór dla całej strony.
6. **Zapytanie „Build {marka}'s app” + pytania z pierwszej rozmowy** zamiast FAQ: 5–6 pytań jako chipy obok formularza, klik →
   odpowiedź wjeżdża jak wiadomość od Rafała (1–2 zdania, bez akordeonu). Pełna treść pytań i odpowiedzi zostaje w DOM
   i w danych strukturalnych FAQPage (widoczność w wyszukiwarce i w odpowiedziach AI).
- Pasek pod nawigacją: Twoja aplikacja · Kokpit · Dowód · Twój sklep · Jeden poranek · Zapytaj.

## Wizualnie
Jeden styl telefonu (ciemny, prawdziwy) na całej stronie — zero starych jasnych telefonów. Przeplot powierzchni: atrament
(scena produktu) → kolor marki (przerywnik) → papier (oddech) → atrament. Ta sama typografia, rytm odstępów i krzywe ruchu co
w finale. Kontrast AA w każdym kolorze marki.

## Bramki
Dotychczasowe + `monotonia` rozszerzona: FAIL, gdy na stronie jest więcej niż jeden konfigurator marki, gdy kokpit ma
zakładkę bez działającego elementu po prawej, gdy zostaje jasny telefon starego typu, gdy FAQ jest akordeonem.

## `/work/genactiv` (p4 ze specu 26) — RÓWNOLEGLE, Rafał prosi o tę wersję dziś
Drugi budujący w osobnym worktree w tym samym przebiegu: wolniejsze tempo (ok. 1,4 wysokości ekranu na akt), jedna myśl na
ekran, podpisy po ustabilizowaniu telefonu, numer aktu i streszczenie widoczne cały czas, urozmaicony układ aktów; finał
zdrapki bez zmian (Rafał: „super”). Granice specu realizacji bez zmian.

## Kolejność
- Przebieg 1 (19:37): GENACTIV p4 (budujący B) + `/nawyko` sceny 0–2 (hero z pełną personalizacją, przerywnik A, kokpit; usunięcie
  zastąpionych sekcji) (budujący A).
- Przebieg 2: sceny 3–6, ujednolicenie wizualne, pytania zamiast FAQ, pełne bramki. Podgląd dla Rafała po każdym przebiegu.
