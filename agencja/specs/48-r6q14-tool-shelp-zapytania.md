# Spec 48 — R6' p14: `/tool` bez skoku na telefonie, etykieta „Point value”, ocena świeżym okiem pod zapytania B2B

Przebieg 28.11 07:38. Kolejka R6'-N13 pkt 1 i 3 (decyzja R6'q13-A bez odpowiedzi → reguła R44.3).

## A. `/tool` clsscroll-390 0,0025 → 0
Przyczyna (pomiar, nie zgadywanie — R42.2): `#shelp` w HTML serwera ma `hidden` i pusty; `tool-runtime.js` przy starcie wpisuje
`HELP_S` i odsłania akapit (93 px + odstęp siatki) → `aside.dir` (y=825 na 844) zjeżdża pod zgięcie (pomiar JS on/off:
`.src` 105 → 212 px, `aside.dir` 825 → 932).
Zmiana: w źródle `tool-index.html` `#shelp` od razu z treścią `HELP_S` i bez `hidden` (ten sam tekst, który runtime i tak wpisuje;
żadnego nowego słowa), przeniesione `ship-tool.mjs --yes` (tylko `app/tool/body.ts`; `tool.css` i runtime bez zmian).
Kryteria: clsscroll 390 i 1440 = 0 (3×), `gates.sh /tool` PASS, WebKit 390/1440 PASS, bez JS akapit opisuje próbkę, którą widać.

## B. `/nawyko` etykieta nawigacji „Your costs” → „Point value”
Recenzja 55 pkt 4: „Your costs” prowadzi do suwaka kursu punktów, a kupujący czyta to jako cenę usługi. Czytelnik-kupujący
(osobna sesja, sama lista tekstów): werdykt „Point value” (pasuje do nagłówka „You set what each point is worth.”).
Kryteria: copy-voice OK, wpis w `teksty-do-akceptacji.md`, pasek rozdziałów 1100–1239 px nadal w jednym wierszu (`sticky-fixed`
i `gates.sh /nawyko` PASS), WebKit PASS.

## C. Ocena świeżym okiem `/` i `/nawyko` pod zapytania B2B
Niezależny recenzent (osobna sesja, nie widział budowy): `agencja/recenzje/55-zapytania-b2b.md`, zrzuty `agencja/podglad/r55-*`.
Wykonawcze punkty dotykają sekcji „NIE RUSZAĆ” z R6' (hero, zapytanie) albo decyzji Rafała (link do `/work/genactiv`) →
zebrane w jedną decyzję R6'q14-A, nic z nich nie wprowadzone bez zgody.
