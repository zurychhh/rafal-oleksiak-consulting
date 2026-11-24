# Recenzja 45 — R6' q3 (/nawyko: hero A + kokpit „Pack rhythm” B)

Recenzent niezależny, 25.11.2026. Serwer localhost:3000, Playwright chromium, 1440×900 i 390×844. Zrzuty: `/tmp/rev/`.
Tryb przypięty kokpitu sprawdzony z `navigator.webdriver=false` (bez tego JS celowo nie przypina).

## Werdykt: PRZECHODZI Z JEDNĄ POPRAWKĄ (1 × IMPORTANT, kilka drobnych)

Nic widocznego nie zginęło: każde zdanie dawnego aktu 6 (`git show df2a28f`) jest w zakładce #rhythm — nagłówek
„See the day each pack really runs out.”, „Each dot: a pack’s real last day, not the label’s.”, „Illustration · invented data”,
trzy pozycje legendy, „Your curve comes from your own orders. Check your gap for free.” oraz telefon marki (34 days,
30 doses ticked, „The label says 30 days. This pack took 34.”, 30 ticked / 4 skipped). Ten sam `BrandPanel` i `Phone step=5`.
Personalizacja: po wpisaniu „Zorbix” zero „Tovemi” w tekście, aria-label, alt i title na obu szerokościach, także w nowej zakładce.
CLS 0 (1440 i 390, łącznie z klikaniem zakładek i przewijaniem toru). Zero błędów JS, zero zduplikowanych id.
Tor przypięty 1440: 6 odcinków, każdy pokazuje właściwą zakładkę, pasek postępu 6 kolumn, zoom 1, treść paneli 224–793 px
w scenie 167–820 px (martwa przestrzeń wyraźnie mniejsza) — `/tmp/rev/1440-pin-0..5.png`.
Deep link `/nawyko#rhythm`: wybrana „06 Pack rhythm” na 1440 i 390 (`1440-pin-deeplink.png`, `390-deeplink-rhythm.png`).
Hero A: kolumna konfiguratora zaczyna się na wysokości góry telefonu (link 200 px, telefon ~197 px), wybrany chip
„Page style” ma jedną ramkę 2 px, fokus osobnym pierścieniem z odstępem (`1440-hero-pinned.png`, `1440-hero-skin-night-focus.png`).
Reduced motion: kokpit nieprzypięty, zakładki działają (`1440-rm-rhythm.png`, `390-rm-rhythm.png`).
Klawiatura: strzałki przechodzą 01→06→01, aktywna zakładka zawsze w rzędzie; Tab z zakładki wchodzi w panel.

## IMPORTANT (przed commitem)

1. **Strzałka „›” na 390 jest malutka (13,3 px Arial zamiast 26 px).** `nawyko.css`: `.nk-ck-more{… font:600 26px/1 inherit;}` —
   `inherit` nie może być rodziną w skrócie `font`, cała deklaracja jest odrzucana. Pomiar: computed `13.3333px Arial`.
   Dowód: `/tmp/rev/390-ck-tabs.png`, `/tmp/rev/390-ck-tabs-after-more.png` (44-px kółko z drobinką w środku).
   Poprawka: `font-weight:600;font-size:26px;line-height:1;font-family:inherit;`.

## Drobne

- Wykres i licznik w #rhythm są teraz statyczne (`t=1`): dawny akt 6 dosypywał kropki i liczył 30→34 przy przewijaniu.
  Tekst kompletny, ale ubyło ruchu. Do rozważenia: animacja wejścia przy pokazaniu zakładki (z wyłączeniem przy reduced motion).
- Martwy kod: `sw` (zawsze 0 przy `ACTS<6`), `swung`/`CH_OF`, reguła `.nk-scene[data-swung][data-act="5"]` w `nawyko.css`.
- Komentarz przy fokusie chipa mówi „akcent marki”, a `--red` to stały czerwony strony (nie `--brand`). Działa, nazwa myląca.
- 390 #rhythm: telefon przed nagłówkiem, więc po kliknięciu zakładki pierwszy ekran nie pokazuje „See the day…”
  (`/tmp/rev/390-ck-click-5.png`). Ten sam wzór co w „What it never does” — sprzed zmiany, ale nowa zakładka go dziedziczy.
- 1440 Privacy: telefon ~315 px, nagłówek „Health data consent · off” łamie się w trzy linie, pod lewą kolumną ~200 px pustki
  (`/tmp/rev/1440-pin-2.png`).
- Deep link na desktopie ląduje na nieprzypiętym kokpicie; pasek cookies zasłania wykres (`1440-pin-deeplink.png`) — działa, nie razi.
- Podwójna plakietka „FOR YOU” (nagłówek kokpitu + panel) — wzór wspólny dla wszystkich paneli.
Liczby (30/33/34, 28–42) opisane jako „Illustration · invented data” — bez zastrzeżeń. Jedyna marka: brak prawdziwych nazw poza GENACTIV.
