# Recenzja 56 — spec 50, finał /nawyko w niskim oknie (niezależna, localhost:3000, bez webdriver)
Werdykt: PASS (zero FAIL; 4 drobne uwagi). Zrzuty: agencja/podglad/r57-rev-*.png, skrypty /tmp/claude-0/rev/a.mjs, b.mjs.
1 PASS. 640x360 / 844x390 / 568x320: telefon stoi obok tekstu (159 / 173 / 155 px szer.), sekcja static (relative), kropki 1-5 zmieniają tekst
  ("07:30 … Next order") i ekran telefonu (5 różnych skrótów obrazu telefonu na każdym rozmiarze). Po przewinięciu do sekcji telefon cały w oknie
  (640x360: 328 px, 844x390: 358 px); brak tekstu poza oknem i scrollWidth = szerokość okna na każdym kroku. "Reveal without scratching" → "Day 24 done. Streak: 24 days.".
  320x568: kolumna (tekst, potem telefon 242x500), 5 kropek zmienia ekran, link zawinięty do 2 linii z podkreśleniem pod każdą, brak hscrolla.
2 PASS. 390x844 i 1440x900: sticky, data-at przy 2/20/40/55/70/90/99 % toru = 0,1,2,2,3,4,4 (identycznie na obu), stickTop=0, brak hscrolla.
3 PASS. 640x360: Tab → Moment 1 → 2 → 3, Enter ustawia at=2 (tekst się zmienia), fokus zostaje na kropce, obwódka widoczna (zrzut kbd); kolejny Tab+Enter → at=3.
4 PASS. /work/genactiv 320x568: "Any colour" x 54-126, rząd zawinięty do 2 linii (16-304), czytelny. 390x844: jedna linia (284-356), bez zmian.
5 PASS. 1000: 900 (sticky, at=3) → 500 (relative, sekcja 564 px, telefon obok tekstu, kropka 1 → at=0) → 900 (sticky, at=0, potem scroll 30 %=1, 90 %=4). Bez zepsutego stanu, bez hscrolla.
6 PASS. Żadna treść nie zniknęła: 5 chwil, kropki, link, status, telefon — wszystko jest w niskim oknie; zmiana jest tylko w układzie.
Drobne (nie blokują):
a) W niskim oknie finał startuje na chwili 3 ("07:32 One scratch…"), bo stan początkowy at=2 a odczyt scrolla jest wyłączony; odwiedzający zaczyna od środka historii zamiast od 07:30. Propozycja: przy low.matches ustawić at=0 przy montowaniu (po hydratacji, bez CLS).
b) 640x360: sekcja 424 px > okno 360 px, więc telefon i nagłówek mieszczą się razem dopiero po przewinięciu o ok. 40 px; po kliknięciu kropki Playwrighta strona sama przewinęła, ale prawdziwy klik nie przewija — OK.
c) 568x320: telefon ma 320 px = cała wysokość okna; z paskiem cookies (do czasu decyzji) jego dół jest zasłonięty, a po decyzji mieści się co do piksela (bottom ≈ 320). Minimalnie, bez zapasu.
d) 320x568: po kliknięciu kropki zmiana ekranu telefonu jest poniżej tekstu (telefon pod kropkami, w oknie widać tylko jego górę); tekst zmienia się w oknie. Zgodne ze specem (kolumna).
Uwaga metody: wartość 'declined' w oc-consent nie ukryła paska cookies (baner widoczny na zrzutach) — nie wpływa na wyniki.
