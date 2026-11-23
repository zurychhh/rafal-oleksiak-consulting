# Spec 06 — runda 3, przebieg 1 (23.11.2026)

Zakres: kolejka Rafała z 22.11 18:20, punkty 1–5, plus lekcje 1–8 z góry `agencja/STATUS.md`.

Kryteria:
1. Recenzja dyrektora kreatywnego całości (3 wyciąć, 3 wzmocnić) + test 10 s na 390 i 1440 → `recenzje/08-…`.
2. `/nawyko`: przy kółku 120 px / 60 ms każda scena (zdrapka, seria, nagroda, oś, wykres marki, white label) widoczna co najmniej na jednym zrzucie z serii; CLS < 0,05.
3. `/nawyko`: transformacje telefonu bez obrotu i bez 3D przez całą scenę (pomiar).
4. `/lab/home`: druga połowa jako sceny (tylko transform/opacity), finał odsłania „You don't pay twice for the same customer.” + jedno CTA; nagłówek H1 bez zmian; liczby i nazwy klientów jak na `/`.
5. `/calculator`: uchwyt wygląda na ruchomy, podpowiedź gestu znika po ruchu, „pchnięcie” przy wejściu, brak animacji przy `reduce`.
6. Bramki: build, tsc, lint (≤ 1 ostrzeżenie), copy-voice, qa.js (nawyko, lab/home, calculator, tool, stop), content-rules, ship-compare, tool-rules, calculator-model.
