# Spec 18 — R4 przebieg 7: JSON-LD z widocznego tekstu, CLS mierzony jak u człowieka

**A. `/nawyko` JSON-LD (kolejka wiedzy pkt 4).** Jeden `@graph`: WebPage (name = H1, description = lead), SoftwareApplication
(`featureList` = nagłówki scen, `operatingSystem` iOS/Android = widoczne App Store · Google Play, provider → `#person` z `/`),
Person `https://oleksiakconsulting.com/#person`, FAQPage z tych samych stałych co widoczne FAQ (`app/nawyko/content.ts`).
Bez `offers`/`aggregateRating` — na stronie nie ma ceny ani ocen (Google nie pokaże wyniku rozszerzonego; świadomie).
Kryteria: `node scripts/jsonld-rules.test.mjs http://localhost:3000/nawyko` PASS; test łapie zmianę jednego słowa (recenzja: FAIL).

**B. `/work/genactiv` (strumień 2, spec 17 + poprawka).** Rezerwa pod pasek cookies tylko bez zapisanej zgody (spec 17).
Wejście z `#enquiry` na 1440 miało CLS 0,17 (bez zgody) / 0,10 (ze zgodą) — wcześniejszy pomiar „0” był zrobiony pod
`navigator.webdriver`, czyli na układzie statycznym. Poprawka: `data-ga-pin` z inline-skryptu (warunek = tryb przewijania),
`.ga-still{min-height:1320svh}` (= `.ga-track`), formularz `Final` za układem w obu trybach. Kryteria: `scripts/cls-check.mjs`
≤ 0,05 na 390 i 1440, ze zgodą i bez; reduced motion: 11 aktów + formularz; bez JS nic nie ucięte (min-height, nie clip).

**C. `/` przy wolnych fontach (Następne z p6).** CLS 1,0: `#dc-root` malowany pod zrzutem (top 5378 px na 390), przy przejęciu
skakał o cały ekran. `DcBoot` parkuje `#dc-root` niewidoczny w miejscu zrzutu na czas czekania. Kryteria: fonty +2,5 s
CLS ≤ 0,1 (jest 0,07 / 0,04; reszta = zrzut przełamany krojem zapasowym po limicie 1,5 s — sprzed zmiany), szybkie fonty 0,
wpisany e-mail przechodzi, animacje przewijania żyją, `qa.js` / `ship-compare` / `content-rules` PASS.
