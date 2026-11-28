#!/usr/bin/env bash
# Jedna bramka jakosci dla dzialajacego serwera lokalnego (R4 p9 B; lekcje R13-R15: bramki pominiete albo mierzace nie to).
# Uzycie: bash scripts/gates.sh <base-url> <trasa>...   np. bash scripts/gates.sh http://localhost:3000 / /nawyko /work/genactiv
# Tylko localhost / 127.0.0.1 (qa.js wysyla formularze) — inaczej kod 2. Kod 1, gdy jakakolwiek bramka FAIL.
# Logi: $GATES_LOGDIR/<slug>-<bramka>.log. Zmienne: GATES_LOGDIR (katalog logow, domyslnie /tmp/gates; dwaj budujacy
#   rownolegle — kazdy wlasny katalog, R4 p14 B3), PW_CHROMIUM (jak w skryptach), GATES_TIMEOUT (s, domyslnie 240),
# GATES_WK_SCENE=1 wymusza WK_SCENE=1 dla WebKit na kazdej trasie (domyslnie tylko /work/genactiv).
set -u
if [ $# -lt 2 ]; then echo "uzycie: bash scripts/gates.sh <base-url> <trasa>..." >&2; exit 2; fi
BASE="${1%/}"; shift
HOSTPART="${BASE#*://}"; HOSTPART="${HOSTPART%%/*}"; HOST="${HOSTPART%%:*}"
case "$HOST" in localhost|127.0.0.1) ;; *) echo "odmowa: host '$HOST' to nie localhost/127.0.0.1" >&2; exit 2;; esac
cd "$(dirname "$0")/.." || exit 2
LOGDIR="${GATES_LOGDIR:-/tmp/gates}"; mkdir -p "$LOGDIR" || { echo "nie moge utworzyc $LOGDIR" >&2; exit 2; }
# Parsowanie i progi clsscroll / scroll-perf oraz sprawdzenie WebKit — wspolne z selftestami (R4 p14 B3).
. scripts/gates-lib.sh
# R4 p10 (lekcja R17): serwer musi podawac TEN build, ktory jest w .next — stary `next-server` na tym samym porcie
# (pkill -f "next start" go nie zabija) podaje HTML z innym BUILD_ID i 500 na chunki; bramki mierzyly wtedy zepsuta strone.
# R4 p15: BUILD_ID moze zaczynac sie od "-" (np. -lD5f7N2...) — grep -qF -- (inaczej grep czyta go jako opcje i bramka odmawia na dobrym serwerze).
if [ -f .next/BUILD_ID ]; then
  BID="$(cat .next/BUILD_ID)"
  if ! curl -sL --max-time 20 "$BASE${1:-/}" | grep -qF -- "$BID"; then
    echo "odmowa: serwer $BASE nie podaje buildu z .next (BUILD_ID $BID) — zatrzymaj stary next-server i uruchom npm start ponownie" >&2; exit 2
  fi
fi

TMO="${GATES_TIMEOUT:-240}"
ROWS=(); ANYFAIL=0; ROUTES=("$@"); CSSDROPPED_DONE=0

add() { ROWS+=("$1|$2|$3|$4"); [ "$3" = FAIL ] && ANYFAIL=1; }   # trasa|bramka|wynik|uwaga

# run <trasa> <bramka> <log> <polecenie...>  — PASS gdy kod 0, FAIL w innym przypadku (124 = limit czasu)
run() {
  local route="$1" gate="$2" log="$3"; shift 3
  timeout "$TMO" "$@" >"$log" 2>&1; local rc=$?
  if [ $rc -eq 0 ]; then add "$route" "$gate" PASS ""
  elif [ $rc -eq 124 ]; then add "$route" "$gate" FAIL "limit czasu ${TMO}s ($log)"
  else add "$route" "$gate" FAIL "kod $rc ($log)"; fi
  return $rc
}

# run_expect <wzorzec linii PASS> <trasa> <bramka> <log> <polecenie...> — PASS tylko gdy kod 0 I jest linia PASS
# (R6' q5 B: webkit-check.py dawal „PASS” z kodem 2; rozbieznosc kodu i linii = FAIL z komunikatem, gates_exec w gates-lib.sh)
run_expect() {
  local re="$1" route="$2" gate="$3" log="$4"; shift 4
  local vd; vd=$(gates_exec "$TMO" "$log" "$re" "$@")
  if [ "$vd" = PASS ]; then add "$route" "$gate" PASS ""
  else add "$route" "$gate" FAIL "${vd#FAIL } ($log)"; fi
}

for route in "${ROUTES[@]}"; do
  case "$route" in /*) ;; *) route="/$route";; esac
  slug="$(echo "${route#/}" | tr -c 'A-Za-z0-9\n' '-' | sed 's/-*$//')"; [ -z "$slug" ] && slug=home
  url="$BASE$route"
  echo ">> $route"
  run "$route" "qa.js" "$LOGDIR/$slug-qa.log" node design/qa.js "$url" --scroll
  # R6' q4 A (spec 38, R31): deklaracje CSS odrzucane po cichu przez Chromium — raz na przebieg (pliki app/**/*.css,
  # nie trasa), wiersz przy pierwszej trasie. Samotest: scripts/css-dropped-selftest.sh.
  if [ "${CSSDROPPED_DONE:-0}" = 0 ]; then
    run_expect '^CSSDROPPED fail=0 ' "$route" "css-dropped" "$LOGDIR/global-css-dropped.log" node scripts/css-dropped.mjs; CSSDROPPED_DONE=1
    # R40 (26.11 12:38): arkusz trasy nie zmienia html/body/section innej trasy po nawigacji klienckiej (Next zostawia
    # CSS poprzedniej trasy w dokumencie; golym html{} z privacy/blog/tool/stop zerowalo scroll-padding-top na /work/genactiv).
    run_expect '^CSSLEAK fail=0 ' "$route" "css-leak" "$LOGDIR/global-css-leak.log" node scripts/css-leak-check.mjs "$BASE"
    # R40 statycznie (bez przegladarki): kazdy selektor zwyklego .css trasy (poza arkuszami z app/layout.tsx) zakotwiczony
    # w klasie/id (html:has(.x), :where(.x) h1); gole html/body/:root/*/h1 = FAIL; :global(h1) w *.module.css = FAIL.
    # Najpierw samotest (wzorce inline: zle i dobre), potem prawdziwe pliki. Wyjatek: /* css-leak-ok: <powod> */ w linii reguly.
    run_expect '^CSSLEAKSTATIC-SELFTEST PASS' "$route" "cssleak-st-test" "$LOGDIR/global-css-leak-static-selftest.log" node scripts/css-leak-static.mjs --selftest
    run_expect '^CSSLEAKSTATIC PASS ' "$route" "cssleak-static" "$LOGDIR/global-css-leak-static.log" node scripts/css-leak-static.mjs
    # R42 (web.dev „Best practices for fonts”): preload fontu w HTML trasy = krój, ktory trasa naprawde rysuje (390 i 1440),
    # na wszystkich trasach przebiegu; najpierw kontrola pozytywna (wstrzykniety nieuzywany preload musi dac FAIL).
    run_expect '^FONTPRELOAD-SELFTEST PASS' "$route" "fontpre-test" "$LOGDIR/global-font-preload-selftest.log" node scripts/font-preload-check.mjs "$BASE" "$route" --selftest
    run_expect '^FONTPRELOAD PASS ' "$route" "font-preload" "$LOGDIR/global-font-preload.log" node scripts/font-preload-check.mjs "$BASE" "${ROUTES[@]}"
  fi
  for vp in "390 844" "1440 900"; do
    set -- $vp; w=$1; h=$2
    run "$route" "cls-$w" "$LOGDIR/$slug-cls-$w.log" node scripts/cls-check.mjs "$url" "$w" "$h"
  done
  # R4 p12 B1: CLS przy przewijaniu kolkiem (suma bez wejscia, ladowanie + przewijanie): PASS <= 0,001, INFO 0,001-0,01, FAIL > 0,01
  # R6' q4 A (R30.3): 3 przebiegi na szerokosc, werdykt z mediany (clsscroll_median z gates-lib.sh), w uwadze wszystkie trzy.
  for vp in "390 844" "1440 900"; do
    set -- $vp; w=$1; h=$2; logs=(); rcs=""
    for n in 1 2 3; do
      log="$LOGDIR/$slug-clsscroll-$w-$n.log"; logs+=("$log")
      timeout "$TMO" node scripts/cls-scroll.mjs "$url" "$w" "$h" >"$log" 2>&1; rcs="$rcs $?"
    done
    vd=$(clsscroll_median "${logs[@]}")
    lp="$LOGDIR/$slug-clsscroll-$w-{1,2,3}.log"
    if [ "$vd" != BRAK ]; then
      read -r lvl med all <<<"$vd"
      add "$route" "clsscroll-$w" "$lvl" "mediana $med [$all] ($lp)"
    else add "$route" "clsscroll-$w" FAIL "kody${rcs}, brak linii CLSSCROLL w 3 przebiegach (124 = limit ${TMO}s) ($lp)"; fi
  done
  # R4 p13 B1: scroll-perf = rozgrzewka + 3 przebiegi, werdykt z median (progi bez zmian 100/200 ms), w uwadze wszystkie wartosci.
  # Metoda: https://github.com/GoogleChrome/lighthouse/blob/main/docs/variability.md (mediana zamiast pojedynczego pomiaru).
  for vp in "1440 900" "390 844"; do
    set -- $vp; w=$1; h=$2; log="$LOGDIR/$slug-scrollperf-$w.log"
    # 4 pelne przebiegi (rozgrzewka + 3) -> limit czasu x4
    timeout "$((TMO * 4))" node scripts/scroll-perf.mjs "$url" "$w" "$h" 4 --runs 3 >"$log" 2>&1; rc=$?
    vd=$(scrollperf_verdict "$log")
    if [ "$vd" != BRAK ]; then
      read -r lvl frame inter fall iall <<<"$vd"
      note="mediana klatki ${frame} ms [${fall}], interakcji ${inter} ms [${iall}]"
      if [ "$lvl" = FAIL ]; then add "$route" "scroll-perf-$w" FAIL "$note ($log)"
      else add "$route" "scroll-perf-$w" PASS "$note"; fi
    elif [ $rc -eq 124 ]; then add "$route" "scroll-perf-$w" FAIL "limit czasu $((TMO * 4))s ($log)"
    elif [ $rc -ne 0 ]; then add "$route" "scroll-perf-$w" FAIL "kod $rc, brak linii SCROLLPERF ($log)"
    else add "$route" "scroll-perf-$w" INFO "wyjscie bez linii SCROLLPERF ($log)"; fi
  done
  # R4 p15 B1: przypieta scena na niskim oknie z paskiem cookies (scripts/short-viewport-check.mjs).
  # Kod 2 = brak przypietej sceny na trasie -> SKIP (nie FAIL), ale na /nawyko i /work/genactiv FAIL (recenzja 31 W1); werdykt: shortvp_verdict z gates-lib.sh (ten sam w selftescie).
  for vp in "1100 620" "1280 720" "390 844"; do
    set -- $vp; w=$1; h=$2; log="$LOGDIR/$slug-short-${w}c.log"
    timeout "$TMO" node scripts/short-viewport-check.mjs "$url" "$w" "$h" --cookies >"$log" 2>&1; rc=$?
    vd=$(shortvp_verdict "$log" "$rc")
    case "$vd" in
      PASS*) add "$route" "short-${w}c" PASS "" ;;
      SKIP*) case "$route" in
               /nawyko|/work/genactiv) add "$route" "short-${w}c" FAIL "brak przypietej sceny na trasie, ktora ja ma (uklad statyczny?) ($log)" ;;
               *) add "$route" "short-${w}c" SKIP "brak przypietej sceny" ;;
             esac ;;
      FAIL*) add "$route" "short-${w}c" FAIL "${vd#FAIL } ($log)" ;;
    esac
  done
  run "$route" "focus-obscured" "$LOGDIR/$slug-focus-obscured.log" node scripts/focus-obscured.test.mjs "$BASE" "$route"
  run "$route" "jsonld" "$LOGDIR/$slug-jsonld.log" node scripts/jsonld-rules.test.mjs "$url"
  # R6' (Rafał 20:55) + R29: inwentarz sekcji (nagłówki, kroki, zdania) wobec wzorca i dwie kolejne sekcje w tym samym tle
  if [ -f "agencja/inwentarz/${slug}.json" ]; then run "$route" "inventory" "$LOGDIR/$slug-inventory.log" node scripts/section-inventory.mjs "$url"; fi
  # R6' p6 (spec 40, recenzja 47): kokpit „For you” — pierwszy klik kazdej zakladki (kolkiem i skokiem od gory, bez zgody
  # cookies) konczy na kliknietej zakladce, a kazdy telefon panelu >= 150 px na laptopowych wysokosciach okna
  if [ "$route" = /nawyko ]; then
    TMO=$((TMO * 5)) run_expect '^COCKPITPIN PASS' "$route" "cockpit-pin" "$LOGDIR/$slug-cockpit-pin.log" \
      node scripts/cockpit-pin-check.mjs "$url" 1366x657 1280x720 1024x768 1440x789 1440x900 900x600 1920x1080 1100x620
    # spec 54 (PILNE 2 pkt 2): przypiete sceny z odslanianiem (#loyalty, #integrations) — krok z przewijania, scena miesci
    # sie nad paskiem cookies, wejscie kotwica na kafel konczy z odslonietym kaflem (recenzja 60 I1)
    TMO=$((TMO * 3)) run_expect '^STEPPIN PASS' "$route" "step-pin" "$LOGDIR/$slug-step-pin.log" \
      node scripts/step-pin-check.mjs "$url" 1440x900 1280x720 1100x620 900x600 1920x1080 390x844
  fi
  # R6' p12 (spec 46): pigulka aktu .ga-prog a telefon i tekst sceny /work/genactiv, w dol i w gore (pasek aktow wjezdza)
  if [ "$route" = /work/genactiv ]; then
    for vp in "1100 620" "1280 720"; do set -- $vp
      TMO=$((TMO * 3)) run_expect '^PROG-OVERLAP PASS' "$route" "prog-overlap-$1" "$LOGDIR/$slug-prog-overlap-$1.log" \
        node scripts/prog-overlap-check.mjs "$1" "$2" "$url"
    done
  fi
  # R6' p8 (regula R36.2, spec 42): kazda przypieta scena trasy × elementy position:fixed po ruchu kolkiem W GORE
  # (regresja: pasek rozdzialow przykrywal naglowek finalu „One morning with …” na 390 i naglowek kokpitu na 1280)
  TMO=$((TMO * 3)) run_expect '^STICKYFIXED PASS' "$route" "sticky-fixed" "$LOGDIR/$slug-sticky-fixed.log" \
    node scripts/sticky-fixed-check.mjs "$url" 1440x900 1280x720 1100x620 390x844
  # R39 (26.11 p9): wyliczone scroll-behavior = auto na <html>/<body> (smooth z critical.css chowal fokus pod paskiem cookies na /privacy i /blog)
  run_expect '^SCROLLBEHAVIOR PASS' "$route" "scroll-behavior" "$LOGDIR/$slug-scroll-behavior.log" \
    node scripts/scroll-behavior-check.mjs "$BASE" "$route"
  # spec 49/50 (WCAG 1.4.10 Reflow): 320x568 i 640x360 — tekst poza oknem, poziomy scroll, telefon < 150 px
  TMO=$((TMO * 3)) run_expect '^REFLOW PASS' "$route" "reflow" "$LOGDIR/$slug-reflow.log" \
    node scripts/reflow-check.mjs "$BASE" "$route"
  # WebKit: 390 (iPhone) i 1440 (Mac Safari), zrzuty do agencja/podglad/gates-wk-<slug>-<szer>
  wkmiss=$(webkit_missing)
  if [ -n "$wkmiss" ]; then
    add "$route" "webkit" FAIL "WebKit niedostepny ($wkmiss) — kawalek nie jest gotowy"
  else
    mkdir -p agencja/podglad
    scene=0; { [ "${GATES_WK_SCENE:-0}" = 1 ] || [ "$route" = /work/genactiv ]; } && scene=1
    for w in 390 1440; do
      WK_W=$w WK_SCENE=$scene run_expect '^PASS: ' "$route" "webkit-$w" "$LOGDIR/$slug-webkit-$w.log" \
        xvfb-run -a python3 -I scripts/webkit-check.py "$url" "agencja/podglad/gates-wk-$slug-$w"
    done
  fi
done

echo ">> globalnie"
run "(globalnie)" "content-rules" "$LOGDIR/global-content-rules.log" node scripts/content-rules.test.mjs --url "$BASE"
run "(globalnie)" "copy-voice" "$LOGDIR/global-copy-voice.log" node scripts/copy-voice.test.mjs
run "(globalnie)" "focus-ring" "$LOGDIR/global-focus-ring.log" node scripts/focus-ring.test.mjs "$BASE"
# Spec 26 (R5): silnik marki — nazwa i kolor odwiedzajacego w kazdym telefonie /nawyko, w finale i na /work/genactiv.
for r in "${ROUTES[@]}"; do
  if [ "$r" = /nawyko ] || [ "$r" = /work/genactiv ]; then
    run "(globalnie)" "brand-propagation" "$LOGDIR/global-brandprop.log" node scripts/brand-propagation.mjs "$BASE"
    run_expect '^BRANDPROP-WK RESULT PASS' "(globalnie)" "brand-prop-webkit" "$LOGDIR/global-brandprop-wk.log" xvfb-run -a python3 -I scripts/brand-propagation-webkit.py "$BASE" "agencja/podglad/gates-wk-brandprop"
    # PILNE 2 pkt 1 (Rafal 28.11.2026): po kazdej zmianie marki „Reveal” odslania karte, a zdrapka reaguje na przeciaganie.
    if [ "$r" = /nawyko ] || printf '%s\n' "${ROUTES[@]}" | grep -qx /nawyko; then
      run_expect '^REVEAL RESULT PASS' "(globalnie)" "reveal-after-brand" "$LOGDIR/global-reveal.log" node scripts/reveal-after-brand.mjs "$BASE"
      run_expect '^REVEAL-WK RESULT PASS' "(globalnie)" "reveal-after-brand-webkit" "$LOGDIR/global-reveal-wk.log" xvfb-run -a python3 -I scripts/reveal-after-brand-webkit.py "$BASE"
    fi
    break
  fi
done
for r in "${ROUTES[@]}"; do
  if [ "$r" = / ]; then SHIP_URL="$BASE" run "(globalnie)" "ship-compare" "$LOGDIR/global-ship-compare.log" node scripts/ship-compare.mjs; break; fi
done

echo; echo "=== PODSUMOWANIE ==="
printf '%-16s %-18s %-5s %s\n' TRASA BRAMKA WYNIK UWAGA
for r in "${ROWS[@]}"; do IFS='|' read -r a b c d <<<"$r"; printf '%-16s %-18s %-5s %s\n' "$a" "$b" "$c" "$d"; done
if [ $ANYFAIL -ne 0 ]; then echo "WYNIK: FAIL"; exit 1; fi
echo "WYNIK: PASS"; exit 0
