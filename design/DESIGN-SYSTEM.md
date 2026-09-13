# Design system — Oleksiak Consulting
Źródło: zatwierdzony wariant **9b Wersja interaktywna** z płótna „Homepage - 5 kierunków".
Ten plik jest wiążący dla wszystkich kolejnych ekranów: `/tool`, `/stop`, blog, PDF, karty
na LinkedIna. Wartości, których tu nie ma, odczytuj z pliku 9b — nie zgaduj.

## Kolor

Tło `#0C0D0C`. Tekst główny `#F2F0EA` — kontrast 17,6:1. Pasmo wygaszone `#16180F`,
używane wyłącznie do „dni, które nie istnieją" w rysunku. Akcent bursztynowy `#E0A72B` —
9,6:1 na tle, jeden na cały ekran.

Reguła akcentu: bursztyn oznacza stratę albo wyjście i nic poza tym. Liczba dni, których
marka nie wykorzystuje, oraz pas z CTA. Nie używamy go do dekoracji, podkreśleń ani
drugiego przycisku. Jeżeli na ekranie są dwie rzeczy bursztynowe, jedna z nich jest błędem.

## Typografia

Instrument Sans, wagi 400 / 500 / 600, licencja OFL, **hostowana lokalnie** — zero żądań do
Google Fonts w wyrenderowanym HTML, to twarda zasada repo po commicie 89c6326.

Role: claim (największy element strony), linia usługi, nazwa bloku, opis, legenda, podpis
techniczny. Dokładne stopnie i interlinia — z pliku 9b, z zachowaniem proporcji między
rolami. Wersaliki z rozstrzeleniem tylko w pasku górnym i w podpisach technicznych.

## Siatka i odstępy

Siatka ósemkowa. Marginesy zewnętrzne 88 px na desktopie. Dwie kolumny: rysunek po lewej,
argumentacja po prawej. Wszystkie bloki stoją na tej samej siatce i tych samych marginesach —
pasek górny, obie kolumny, blok usług i listwa wyjść.

Mobile 390 jest osobną decyzją, nie ściśniętym desktopem. Nad zgięciem (712 px w Safari iOS
z domyślnym paskiem adresu) muszą zmieścić się: claim, linia usługi i wyjście.

## Komponenty

**Siatka dni.** Siedemdziesiąt pól, dziesięć w rzędzie. Jasne = dni z etykiety, bursztynowe =
dni straty, wygaszone = dzień odkupu. Mechanizm jest policzalny palcem — odbiorca nie musi
ufać skali. To jest znak rozpoznawczy marki i wraca wszędzie, gdzie pokazujemy czas.

**Blok pozycji.** Pięć jednakowych białych kropek, cienka kreska, nazwa, jedna linijka opisu.
Kropki zapełniają się bursztynem po najechaniu; na telefonie raz, przy wejściu w kadr.
Ten sam komponent obsługuje usługi i referencje — zmienia się tylko treść.

**Listwa wyjść.** Bursztynowy pas przez całą szerokość: po lewej wezwanie ze strzałką,
wyśrodkowane w pionie, klikalny cały pas, hover przesuwa strzałkę w prawo. Po prawej jedno
pole e-mail z przyciskiem i jedną linijką obietnicy. Pod pasem wąski czarny pas z jednym
zdaniem wyjaśniającym mechanizm. Żadnych ramek udających przycisk.

**Podpis pochodzenia.** Każda liczba na ekranie ma przy sobie informację, skąd pochodzi.
Wzór: „Real orders: an anonymous supplements store, 1,197 first-to-second gaps, 4.8 years.
Your numbers differ — that is what the calculator is for."

## Ruch

Animacja tylko wtedy, gdy niesie narrację. Kanon z 9b: jasne pola wchodzą co 0,05 s przez
2,3 s, potem bursztynowe co 0,075 s, każde urasta do 155% i wraca, całość kończy się około
4,6 s. Jeden przebieg, po wejściu w kadr przy progu 20%, bez pętli.

Trzy warunki obowiązujące każdą animację w tym systemie: stan końcowy jest stanem domyślnym
DOM-u; `prefers-reduced-motion` przeskakuje od razu do stanu końcowego; bramka `design/qa.js`
nie może złapać ekranu w połowie ruchu.

## Copy

Angielski. Zdania krótkie, konkretne, bez przymiotników sprzedażowych. Claim mówi, co robimy,
nie jak bardzo jesteśmy dobrzy. Dowód to rozpiętość, nigdy prestiż: ten sam rachunek
w marketplace z milionami użytkowników i w firmie z jedenastoma osobami. Żadnego linku do
kalendarza i żadnego „book a call" — oferta jest asynchroniczna z projektu.

Zakazane: „unlocking growth", „Our Process" w czterech krokach, karuzela logotypów,
niebieski jako kolor zaufania, monospace w tekście czytanym, kafle z obwódkami.

## Dostępność i kontrola jakości

Tekst główny minimum 12:1, pozostały 4,5:1, od 24 px 3:1 — liczone skryptem względem
realnie namalowanego tła, nie oceniane na oko. Żaden pojemnik z tekstem nie ma sztywnej
wysokości razem z `overflow:hidden`. Wszystko działa z klawiatury i z czytnikiem ekranu.

Przed każdą publikacją: `node design/qa.js <url> --scroll` na dziewięciu szerokościach,
lokalnie, nigdy na produkcji.
