#!/usr/bin/env bash
# R6' q4 A (spec 38): test regresji bramki css-dropped (scripts/css-dropped.mjs).
# Wzorce w katalogu tymczasowym:
#   broken.css — `.nk-ck-more{font:600 26px/1 inherit}` (prawdziwy blad z /nawyko)        -> oczekiwany kod 1
#   fixed.css  — ta sama regula rozpisana na longhandy, plus @font-face, @keyframes, @property,
#                @media/@supports/@container/@layer, !important, --zmienna i regula tylko dla Firefoksa -> oczekiwany kod 0
#   kfbad.css  — odrzucona deklaracja w klatce @keyframes                                   -> oczekiwany kod 1
#   ffbad.css  — odrzucony deskryptor @font-face                                            -> oczekiwany kod 1
#   selbad.css — lista selektorow z ::-moz- obok zwyklego selektora (Chromium odrzuca cala)  -> oczekiwany kod 1
#   mqbad.css  — @media z cecha bez jednostki (caly blok martwy, recenzja 46)                -> oczekiwany kod 1
# R6' q5 B (spec 39, recenzja 46 Drobne 3):
#   isbad.css / wherebad.css — pseudoelement ::-moz- w :is()/:where() (Chromium po cichu go wyrzuca) -> kod 1
#   isok.css   — :is() z pseudoklasa Firefoksa (:-moz-focusring) obok zwyklego selektora (zamierzone) -> kod 0
#   global.module.css — :global(x), `:global .x`, :local(x) w CSS Modules (odwijane, bez falszywego FAIL) -> kod 0
#   global.css — ten sam :global(x) w ZWYKLYM pliku .css (to nie jest CSS) -> kod 1
#   varok.css  — font:600 26px/1 var(--f) z --f zdefiniowanym jako rodzina krojow -> kod 0, bez INFO
#   varinfo.css — font:600 26px/1 var(--f) bez definicji --f (podstawienia 0/#000 niepoprawne) -> kod 0 + linia INFO z var()
#   varfb.css  — font:600 26px/1 var(--g, inherit) (zapas niepoprawny w skrocie) -> kod 0 + linia INFO z var()
#   varbad.css — var() w deklaracji niepoprawnej juz przy parsowaniu (`color:var(--x) !importantt`) -> kod 1
# Uzycie: bash scripts/css-dropped-selftest.sh
set -u
cd "$(dirname "$0")/.." || exit 2
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT

printf '%s\n' '.nk-ck-more{font:600 26px/1 inherit;color:red}' >"$TMP/broken.css"
cat >"$TMP/fixed.css" <<'EOF'
@property --p{syntax:'<number>';inherits:false;initial-value:1;}
@font-face{font-family:"X";src:url(/x.woff2) format("woff2");font-display:swap;unicode-range:U+0000-00FF}
@keyframes k{from{opacity:0;transform:translateY(4px)}to{opacity:1}}
@layer base{.a{--x:inherit;color:var(--x) !important}}
@media (max-width:600px){@supports (display:grid){.nk-ck-more{font-weight:600;font-size:26px;line-height:1;font-family:inherit}}}
@container (max-width:130px){.b{display:none}}
.r::-moz-range-thumb{width:20px}
.c{&:hover{color:blue}}
EOF
printf '%s\n' '@keyframes k{0%{opacity:0;transform:translateY(4 px)}}' >"$TMP/kfbad.css"
printf '%s\n' '@font-face{font-family:"X";font-display:sometimes}' >"$TMP/ffbad.css"
printf '%s\n' '.a,.r::-moz-range-thumb{animation:none}' >"$TMP/selbad.css"
printf '%s\n' '@media (max-width:860){.a{color:red}}' >"$TMP/mqbad.css"
printf '%s\n' '.a:is(.b,::-moz-range-thumb){color:red}' >"$TMP/isbad.css"
printf '%s\n' '.a :where(p, ::-moz-selection){color:red}' >"$TMP/wherebad.css"
printf '%s\n' '.a:is(.b,:-moz-focusring){outline:0}' >"$TMP/isok.css"
printf '%s\n' ':global(.dark) .a{color:red}' '.b :global(.c:hover){color:blue}' ':global .d{color:red}' ':local(.e) .f{color:red}' >"$TMP/global.module.css"
printf '%s\n' ':global(.dark) .a{color:red}' >"$TMP/global.css"
printf '%s\n' ':root{--f:"Inter",sans-serif}' '.a{font:600 26px/1 var(--f)}' >"$TMP/varok.css"
printf '%s\n' '.a{font:600 26px/1 var(--f)}' >"$TMP/varinfo.css"
printf '%s\n' '.a{font:600 26px/1 var(--g, inherit)}' >"$TMP/varfb.css"
printf '%s\n' '.a{color:var(--x) !importantt}' >"$TMP/varbad.css"

ok=0
check() {  # check <plik> <oczekiwany kod>
  node scripts/css-dropped.mjs "$TMP/$1" >"$TMP/$1.log" 2>&1; local rc=$?
  echo "$1: kod $rc (oczekiwany $2) — $(grep -E '^CSSDROPPED' "$TMP/$1.log")"
  [ "$rc" -eq "$2" ] || { ok=1; sed 's/^/    /' "$TMP/$1.log"; }
}
check broken.css 1
check fixed.css 0
check kfbad.css 1
check ffbad.css 1
check mqbad.css 1
check selbad.css 1
check isbad.css 1
check wherebad.css 1
check isok.css 0
check global.module.css 0
check global.css 1
check varok.css 0
check varinfo.css 0
check varfb.css 0
check varbad.css 1
grep -q '^INFO .*var(--f).*z var()' "$TMP/varinfo.css.log" || { echo "varinfo.css: brak linii INFO dla var()"; ok=1; }
grep -q '^INFO .*var(--g, inherit).*z var()' "$TMP/varfb.css.log" || { echo "varfb.css: brak linii INFO dla var()"; ok=1; }
grep -q '^INFO' "$TMP/varok.css.log" && { echo "varok.css: nieoczekiwane INFO"; ok=1; }
grep -q '^FAIL .*pseudoelement' "$TMP/isbad.css.log" || { echo "isbad.css: brak komunikatu o pseudoelemencie"; ok=1; }
grep -q 'font:600 26px/1 inherit' "$TMP/broken.css.log" || { echo "broken.css: brak tekstu deklaracji w raporcie"; ok=1; }
[ $ok -eq 0 ] && echo "CSS-DROPPED-SELFTEST: PASS" || echo "CSS-DROPPED-SELFTEST: FAIL"
exit $ok
