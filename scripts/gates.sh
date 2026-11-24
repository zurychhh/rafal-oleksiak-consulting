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
  if ! curl -s --max-time 20 "$BASE${1:-/}" | grep -qF -- "$BID"; then
    echo "odmowa: serwer $BASE nie podaje buildu z .next (BUILD_ID $BID) — zatrzymaj stary next-server i uruchom npm start ponownie" >&2; exit 2
  fi
fi

TMO="${GATES_TIMEOUT:-240}"
ROWS=(); ANYFAIL=0; ROUTES=("$@")

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

for route in "${ROUTES[@]}"; do
  case "$route" in /*) ;; *) route="/$route";; esac
  slug="$(echo "${route#/}" | tr -c 'A-Za-z0-9\n' '-' | sed 's/-*$//')"; [ -z "$slug" ] && slug=home
  url="$BASE$route"
  echo ">> $route"
  run "$route" "qa.js" "$LOGDIR/$slug-qa.log" node design/qa.js "$url" --scroll
  for vp in "390 844" "1440 900"; do
    set -- $vp; w=$1; h=$2
    run "$route" "cls-$w" "$LOGDIR/$slug-cls-$w.log" node scripts/cls-check.mjs "$url" "$w" "$h"
  done
  # R4 p12 B1: CLS przy przewijaniu kolkiem (suma bez wejscia, ladowanie + przewijanie): PASS <= 0,001, INFO 0,001-0,01, FAIL > 0,01
  for vp in "390 844" "1440 900"; do
    set -- $vp; w=$1; h=$2; log="$LOGDIR/$slug-clsscroll-$w.log"
    timeout "$TMO" node scripts/cls-scroll.mjs "$url" "$w" "$h" >"$log" 2>&1; rc=$?
    vd=$(clsscroll_verdict "$log")
    if [ "$vd" != BRAK ]; then
      add "$route" "clsscroll-$w" "${vd%% *}" "suma ${vd#* } ($log)"
    elif [ $rc -eq 124 ]; then add "$route" "clsscroll-$w" FAIL "limit czasu ${TMO}s ($log)"
    else add "$route" "clsscroll-$w" FAIL "kod $rc, brak linii CLSSCROLL ($log)"; fi
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
  # WebKit: 390 (iPhone) i 1440 (Mac Safari), zrzuty do agencja/podglad/gates-wk-<slug>-<szer>
  wkmiss=$(webkit_missing)
  if [ -n "$wkmiss" ]; then
    add "$route" "webkit" FAIL "WebKit niedostepny ($wkmiss) — kawalek nie jest gotowy"
  else
    mkdir -p agencja/podglad
    scene=0; { [ "${GATES_WK_SCENE:-0}" = 1 ] || [ "$route" = /work/genactiv ]; } && scene=1
    for w in 390 1440; do
      WK_W=$w WK_SCENE=$scene run "$route" "webkit-$w" "$LOGDIR/$slug-webkit-$w.log" \
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
    run "(globalnie)" "brand-prop-webkit" "$LOGDIR/global-brandprop-wk.log" xvfb-run -a python3 -I scripts/brand-propagation-webkit.py "$BASE" "agencja/podglad/gates-wk-brandprop"
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
