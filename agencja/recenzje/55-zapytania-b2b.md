# Recenzja 55 — droga do zapytania B2B (`/`, `/nawyko`)

Data: 2026-11-28 · Recenzent niezależny (bez wiedzy o procesie budowy) · build lokalny `localhost:3000`
Persona: Head of e-commerce / CRM w średniej marce suplementów/kosmetyków w UE, wejście z LinkedIn na telefonie, potem laptop.
Zrzuty: `agencja/podglad/r55-*` (390×844 mobile/touch i 1440×900). Żaden formularz nie został wysłany.

**Co działa (nie ruszać):** formularz ma tylko 2 pola + 1 wymaganą zgodę, zgoda marketingowa osobna i niezaznaczona,
nota „This form sends the two fields above…” buduje zaufanie. Na `/` formularz jest na pierwszym ekranie telefonu.
Hero `/nawyko` w 5 s mówi „co” (aplikacja pod Twoją marką), konfigurator marki jest dobrym haczykiem. FAQ trafnie
odpowiada na RODO i losowość nagród.

---

## 1. `/nawyko`: formularz dopiero na samym końcu (~17 ekranów na telefonie)

- **Co widać:** strona ma 15 421 px na telefonie (18,3 ekranu) i 13 112 px na desktopie. Jedyny formularz
  `#nawyko-enquiry` zaczyna się na ~14 570 px. Pierwszy CTA „Ask about Nawyko” jest na ~1,7 ekranu
  (`r55-nawyko-m-0.png`, `r55-nawyko-m-1.png`). Wszystkie pozostałe CTA („Ask which apps connect to your store →”,
  „CONTACT”) przewijają na dół. Sekcje, po których kupujący jest „gotowy” (integracje, FAQ), kończą się bez formularza.
- **Dlaczego kosztuje zapytania:** na telefonie z LinkedIn mało kto przewinie 17 ekranów. Kliknięcie kotwicy
  zrzuca kupującego daleko w dół strony, poza kontekst. Na `/` ta sama osoba ma formularz od razu.
- **Poprawka:** skrócony formularz (URL + e-mail, zgoda rozwija się po fokusie, jak pasek na `/`) zaraz pod hero
  na telefonie i obok hero na desktopie. Drugi formularz po FAQ. Przypięty pasek „Ask about Nawyko” na telefonie,
  gdy hero zniknie z ekranu.
- **[WYKONAWCZE]**

## 2. Zero realnego dowodu na `/nawyko`, a dowód istnieje i nie jest podlinkowany

- **Co widać:** cała strona opiera się na zmyślonej marce Tovemi („made-up demo brand, not a client”, `r55-nawyko-m-1.png`).
  Działa `/work/genactiv` (200, „GENACTIV turns every box into a daily reason to come back”), a `/` pisze
  „GenActiv — IN PRODUCTION” (`r55-home-m-6.png`). Mimo to ani `/nawyko`, ani `/` nie linkują do tego case'u
  (sprawdzone na liście linków obu tras). „Proof of results” jest ukryty jako zakładka 04 w karuzeli
  (`r55-nawyko-d-proof.png`), a na mobilnym spisie treści punktu „Proof” brakuje (01–04, 06).
- **Dlaczego kosztuje zapytania:** sceptyczny kupujący B2B pyta najpierw: „kto już to ma?”. Same makiety
  wyglądają jak koncept, a nie jak produkt.
- **Poprawka:** pasek pod hero i nad formularzem: „Built for a real brand: GenActiv → see the case” z linkiem do
  `/work/genactiv` (używa wyłącznie istniejącej strony i istniejącego stwierdzenia). Dodać „Proof” do mobilnego
  spisu treści. Zakładka 04 jako domyślnie otwarta albo osobna sekcja.
- **[WYKONAWCZE]** za link i kolejność. Każda nowa liczba czy wynik GenActiv to **[DECYZJA RAFAŁA]**.

## 3. Brak odpowiedzi na pytania: „co się stanie po wysłaniu, kto to robi i ile pracy po naszej stronie”

- **Co widać:** przy formularzu `/nawyko` jest tylko „The first call covers rewards and setup” (`r55-nawyko-m-7.png`
  i dalej). Nie ma twarzy, imienia przy formularzu, terminu odpowiedzi ani kroków. FAQ „How long does setup take?”
  odpowiada „depends… mapped in the first call”. Na `/` ta obietnica istnieje („I reply personally within 24 hours,
  with a first observation about your store — not a calendar link”), na `/nawyko` jej brakuje.
- **Dlaczego kosztuje zapytania:** Head of e-commerce zostawia służbowy e-mail, gdy wie, co go czeka
  i ile pracy zrzuci na zespół (IT, prawny, CRM). Brak procesu = ryzyko = odłożenie.
- **Poprawka:** blok „After you send” w 3 krokach, zbudowany z istniejących faktów: (1) osobista odpowiedź
  w 24 h z pierwszą obserwacją o sklepie (tekst z `/`), (2) pierwsza rozmowa: nagrody i integracja,
  (3) aplikacja pod Twoją marką w obu sklepach (fakt z sekcji integracji). Przy formularzu: „Rafał Oleksiak”
  + LinkedIn + CV.
- **[WYKONAWCZE]**. Konkretny czas wdrożenia i liczba godzin po stronie marki to **[DECYZJA RAFAŁA]**.

## 4. Model kosztów niewidoczny, a etykieta „Your costs” wprowadza w błąd

- **Co widać:** w podmenu desktopu jest „YOUR COSTS” (`r55-nawyko-d-0.png`), ale kotwica `#exchange` prowadzi
  do suwaka kursu punktów („Points for €1 of cashback”), a nie do kosztu usługi. Nigdzie nie pada, jak się płaci:
  czy jest opłata wdrożeniowa, abonament, kto płaci za konta w sklepach z aplikacjami i ile kosztują nagrody.
  Tymczasem `/` i `/tool` pokazują „EUR 2,500 net per month”, co dotyczy konsultingu, a nie Nawyko.
  Kupujący może to wziąć za cenę aplikacji albo uznać, że cenę ukryto.
- **Dlaczego kosztuje zapytania:** brak choćby kształtu ceny odsiewa budżetowo ostrożnych. Z kolei mylące
  „Your costs” podważa wiarygodność, gdy kupujący kliknie po cenę i zobaczy suwak punktów.
- **Poprawka:** zmienić etykietę na „Reward costs” / „What rewards cost you” **[WYKONAWCZE]**. Dodać jedno zdanie
  o kształcie ceny Nawyko (np. „setup + monthly fee, quoted after the first call”, bez kwot) i rozdzielić je od
  retainera konsultingowego **[DECYZJA RAFAŁA]**.

## 5. `/` gubi kupującego Nawyko i kończy formularz ceną bez kontekstu (telefon)

- **Co widać:** pierwszy ekran telefonu: H1 → formularz → „EUR 2,500 net per month.” tuż pod SEND
  (`r55-home-m-0.png`). Treść „No setup fee. No minimum term. The first month is an as-is audit…”, która tłumaczy
  tę kwotę, na desktopie stoi nad formularzem (`r55-home-d-0.png`), a na telefonie dopiero poniżej. Nawyko to
  tylko mały link w nagłówku. Na dole strony telefonu stopka (e-mail, LinkedIn) stoi **przed** ostatnim formularzem
  (`r55-home-m-6.png`), więc formularz wygląda jak dopisany po końcu strony. Do tego `/nawyko` → „Check your gap for free”
  → `/tool` kończy się ofertą retainera konsultingowego, czyli zmienia ofertę w połowie ścieżki.
- **Dlaczego kosztuje zapytania:** kwota bez zawartości na pierwszym ekranie odstrasza, zanim padnie wartość.
  Osoba z kampanii o aplikacji nie widzi jej na `/`.
- **Poprawka:** na telefonie przenieść 3 linie „No setup fee / No minimum term / first month = audit” nad cenę
  wewnątrz formularza (jak w dolnym formularzu). Formularz końcowy przed stopką. **[WYKONAWCZE]**.
  Mocniejsza karta Nawyko na `/` i decyzja, czy `/tool` z wejścia Nawyko ma pokazywać ofertę konsultingową,
  to **[DECYZJA RAFAŁA]**. H1 zostaje (stała decyzja).

## 6. Przeładowanie funkcjami i ozdobniki zasłaniają główną mechanikę

- **Co widać:** `/nawyko` pokazuje kolejno cashback-portfel, punkty i poziomy (Bronze/Silver/Gold), kurs punktów,
  ścieżki lekcji z prezentem, zakup w aptece, ekran zgody, symulację ekranu głównego telefonu z ikonami
  „Mail, Maps, Bank…” i 5 „momentów” (`r55-nawyko-m-7.png`, `r55-nawyko-d-7.png`). Mechanika z oferty
  (potwierdź zakup → zdrapka → pieczątka 24/30 → kod na kolejne opakowanie) ginie po 3. ekranie. Na desktopie
  pod czerwoną sekcją zostaje pusty beżowy pas (`r55-nawyko-d-7.png`, dół). Na `/` metafora etykiety leku
  („INDICATION”, „100 ML… 20 ML”, „PRIOR BATCHES”, „LOT 45/69 · REV 2026-09”, `r55-home-d-0.png`, `r55-home-m-6.png`)
  ociera się o kicz i dla marki suplementów brzmi jak sugestia leczniczego charakteru.
- **Dlaczego kosztuje zapytania:** im więcej funkcji, tym bardziej wygląda to na duży i drogi projekt IT
  oraz na grywalizację w stylu loterii, czyli dokładnie to, czego chce uniknąć kupujący z regulowanej kategorii.
- **Poprawka:** zwinąć cashback, punkty i lekcje w jeden blok z zakładkami „Optional modules” umieszczony po
  integracjach i FAQ, bez usuwania treści. Usunąć pusty pas. **[WYKONAWCZE]**. Usunięcie modułów
  albo metafory etykiety leku to **[DECYZJA RAFAŁA]**.
