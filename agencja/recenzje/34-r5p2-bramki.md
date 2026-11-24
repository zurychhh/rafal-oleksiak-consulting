# Bramki R5 p2 (24.11.2026) — tabela z gates.sh (build przed dwiema ostatnimi poprawkami CSS) + powtórki po nich

```
=== PODSUMOWANIE ===
TRASA            BRAMKA             WYNIK UWAGA
/nawyko          qa.js              FAIL  kod 1 (/tmp/gates3/nawyko-qa.log)
/nawyko          cls-390            PASS  
/nawyko          cls-1440           PASS  
/nawyko          clsscroll-390      PASS  suma 0.00008 (/tmp/gates3/nawyko-clsscroll-390.log)
/nawyko          clsscroll-1440     INFO  suma 0.00343 (/tmp/gates3/nawyko-clsscroll-1440.log)
/nawyko          scroll-perf-1440   PASS  mediana klatki 78 ms [106,75,78], interakcji 56 ms [56,48,96]
/nawyko          scroll-perf-390    PASS  mediana klatki 83 ms [94,65,83], interakcji 32 ms [32,40,32]
/nawyko          short-1100c        FAIL  problemow 23 (unikalnych 5); dol 86% (scrollY 9878) (x10): p.nk-fine "The name stays in this page. Nothing is sent." — nachodzi na pasek aktow (/tmp/gates3/nawyko-short-1100c.log)
/nawyko          short-1280c        FAIL  problemow 1 (unikalnych 1); gora 84% (scrollY 10862) (x1): a.nk-link "Ask how your brand gets its own app" — nachodzi na pasek aktow .nk-acts (/tmp/gates3/nawyko-short-1280c.log)
/nawyko          short-390c         PASS  
/nawyko          focus-obscured     PASS  
/nawyko          jsonld             PASS  
/nawyko          webkit-390         PASS  
/nawyko          webkit-1440        PASS  
/work/genactiv   qa.js              PASS  
/work/genactiv   cls-390            PASS  
/work/genactiv   cls-1440           PASS  
/work/genactiv   clsscroll-390      PASS  suma 0.00000 (/tmp/gates3/work-genactiv-clsscroll-390.log)
/work/genactiv   clsscroll-1440     PASS  suma 0.00000 (/tmp/gates3/work-genactiv-clsscroll-1440.log)
/work/genactiv   scroll-perf-1440   PASS  mediana klatki 50 ms [50,0,74], interakcji 24 ms [24,24,24]
/work/genactiv   scroll-perf-390    PASS  mediana klatki 54 ms [62,0,54], interakcji 32 ms [40,32,32]
/work/genactiv   short-1100c        PASS  
/work/genactiv   short-1280c        PASS  
/work/genactiv   short-390c         PASS  
/work/genactiv   focus-obscured     PASS  
/work/genactiv   jsonld             PASS  
/work/genactiv   webkit-390         PASS  
/work/genactiv   webkit-1440        PASS  
(globalnie)      content-rules      PASS  
(globalnie)      copy-voice         PASS  
(globalnie)      focus-ring         PASS  
(globalnie)      brand-propagation  PASS  
(globalnie)      brand-prop-webkit  PASS  
WYNIK: FAIL
```

Po ostatnich poprawkach (kontrast na kolorze marki, kolumny 1440, margines zakładek, zwarty panel także przy max-height 760): qa.js /nawyko 9 szerokości PASS; short-viewport 1100×620c, 1280×720c, 390×844c PASS (0 problemów), 360×740c FAIL 11 (link 4 px, poza stałą bramką); WebKit webkit-check 390/1440 PASS; finale-webkit 390/1440 PASS; brand-propagation-webkit PASS; scroll-perf /nawyko 1440 mediana 85 ms PASS; lint 0 błędów (1 ostrzeżenie jak przed); tsc OK; copy-voice OK; content-rules PASS.

Stan zastany (A/B na buildzie e30bdd9, przed tym przebiegiem): short-1100c 23 problemy, short-1280c 1, short-390c 77 — regres z R5 p1, nie z tego przebiegu.
