# 17 — R4 p7 B: /work/genactiv — rezerwa pod pasek cookies tylko bez zgody
Problem: stała rezerwa (stopka +72 px, <759 px `--ga-reserve:112px` w scenie, `--ph` i stopce) zostaje także, gdy zgoda już zapisana (localStorage `cookie-consent`) i pasek się nie pokaże.
Zmiana: inline `<script>` w page.tsx (try/catch, wzór PIN_JS z /nawyko) przed malowaniem ustawia `data-ga-consent-pending` na `<html>`, gdy `cookie-consent` jest null albo localStorage rzuca. CSS: rezerwa tylko pod `html[data-ga-consent-pending]`, inaczej 0 (zwykły padding stopki). Atrybutu nie zdejmujemy po kliknięciu w trakcie wizyty.
Kryteria akceptacji:
1. Bez zgody (390 i 1440): rezerwa obecna jak dotąd, pasek nie zasłania treści, CLS ≈ 0 przy wejściu na #enquiry.
2. Ze zgodą: padding-bottom stopki = zwykły (bez rezerwy), telefon w scenie na 390 wyższy niż w stanie 1, CLS ≈ 0 na #enquiry.
3. HTML z serwera identyczny niezależnie od zgody; brak błędów hydratacji; `html:has(.ga){padding-bottom:0 !important}` bez zmian.
4. Bramki: build, tsc, lint (0 błędów, ostrzeżeń ≤ 1), copy-voice, design/qa.js, webkit-check (też WK_SCENE=1), telefon ≥ 150 px.
