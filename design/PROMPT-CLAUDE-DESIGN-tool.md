# Prompt do Claude Design — `/tool`, narzędzie jako opowieść

Nowe płótno, nowa rozmowa. Wklej najpierw `design/DESIGN-SYSTEM.md`, potem wszystko
poniżej linii.

---

Projektujesz drugą stronę tej samej marki: narzędzie pod `oleksiakconsulting.com/tool`.
System wizualny masz w pliku, który właśnie wkleiłem, i jest zamrożony — kolory, Instrument
Sans, siatka dni, reguła jednego bursztynu, zasady ruchu. Nie szukasz nowego świata.
Rozmawiamy po polsku, treść ekranu po angielsku.

## Co to narzędzie robi dzisiaj

Trzy kroki, w tej kolejności. Użytkownik wkleja fragment eksportu zamówień — data, klient,
tytuł produktu, sztuki, cena. AI czyta z tytułów **wielkość opakowania** i nic więcej: nigdy
dawki, nigdy dni. Potem użytkownik wkleja treść z etykiety, czyli zalecenia producenta, i AI
czyta z niej **dawkę** — to jedyne miejsce, z którego dawka może pochodzić. Z tych dwóch
rzeczy wychodzi dzień z etykiety, a z eksportu realny odstęp między zamówieniami: pierwszy
odkup i rytm ustalony. Różnica tych dwóch liczb jest całym produktem.

Silnik i te dwa panele AI zostają. Przeprojektowujesz choreografię, nie matematykę.

## Kto wchodzi i po co

Ten sam kupujący co na stronie głównej: założyciel albo head of growth marki DTC robiącej
1–30 mln EUR, wchodzi prosto z bursztynowego pasa, obiecano mu, że policzy własny cykl
w pięć minut. Jest sceptyczny wobec darmowych audytów, bo widział, jak produkują ogólniki.
Ma pod ręką panel sklepu i potrafi wkleić eksport, ale zrobi to tylko wtedy, gdy pierwszy
ekran będzie wyglądał na wart tych pięciu minut.

## Zasada naczelna

Ekran odsłania się za czynem, nie za przewinięciem. Nic nie jest widoczne, zanim nie zostanie
zasłużone. Jedno pytanie naraz. Każdy krok AI pokazuje, **co przeczytał** — wypisane wprost,
do sprawdzenia wzrokiem — bo jedyne, co buduje tu zaufanie, to jawność odczytu. Czarna
skrzynka, która wypluwa wynik, zabija całą sprzedaż, która ma się wydarzyć potem.

## Akty, które ma opowiedzieć

Otwarcie z jednym pytaniem i jednym polem, reszta ekranu pusta. Odczyt opakowań pokazany
jako lista tego, co maszyna zrozumiała, z możliwością poprawienia. Dopiero teraz pojawia się
drugie pole, na etykietę. Odczyt dawek, znowu jawny, z cytatem ze słów producenta. Potem
rysunek: ta sama siatka dni co na stronie głównej, ale tym razem na **jego** liczbach, z luką
zapełniającą się na oczach. Na końcu rozkład per SKU, odsłaniany wiersz po wierszu, najszersze
luki na górze.

Zamknięcie: użytkownik wysyła sobie wynik na maila. Pole adresu, osobny checkbox zgody na
kontakt — domyślnie odznaczony, nigdy wstępnie zaznaczony, z własnym zdaniem wyjaśniającym,
po co i jak często, oraz odnośnikiem do polityki prywatności. Wysłanie wyniku i zgoda na
kontakt to dwie różne decyzje i mają wyglądać jak dwie różne decyzje.

## Czego nie robimy

Żadnych spinnerów bez tekstu — jeśli AI czyta, ekran mówi, co czyta. Żadnych pasków postępu
z fikcyjnymi procentami. Żadnego bramkowania wyniku adresem: liczby widzi bez podawania maila,
mail jest po to, żeby je sobie zabrać. Żadnego linku do kalendarza. Żadnej karuzeli i żadnego
modala.

Stany brzegowe są częścią opowieści, nie błędem: puste wklejenie, trzy linijki zamiast trzystu,
eksport bez wielkości opakowań w tytułach, kategoria, w której nic się nie powtarza. Zaprojektuj
je, nie zostawiaj na potem.

## Co ma wyjść

Jedno płótno, **pięć kierunków choreografii** — różnią się dramaturgią, nie stylem: czym jest
pierwszy ekran, w jakiej kolejności odsłaniają się akty, co użytkownik robi rękami, gdzie pada
moment zaskoczenia. Każdy kierunek pokazany jako sekwencja stanów, nie jako jeden obrazek:
minimum otwarcie, stan po pierwszym odczycie, moment rysunku i zamknięcie z formularzem.
Desktop 1440 i telefon 390 osobno.

Pod każdym kierunkiem, prozą: na czym polega chwyt w jednym zdaniu · w której sekundzie
founder rozumie, po co wkleił eksport · gdzie ten kierunek pęknie · koszt wdrożenia
w statycznym HTML w dniach · co zobaczy ktoś, kto ma brzydkie dane.

Zrób szósty, zabij najsłabszy, pokaż pięć i zarekomenduj jeden — uzasadniając zachowaniem
tego kupującego, nie własnym gustem.

## Bramki

Zero kolizji między elementami. Kontrast jak w systemie, liczony, nie oceniany. Każda
animacja: stan końcowy jest stanem domyślnym, `prefers-reduced-motion` przeskakuje do końca,
jeden przebieg bez pętli. Wszystko działa z klawiatury. Na telefonie każdy akt mieści się nad
zgięciem albo jawnie zaprasza do przewinięcia.
