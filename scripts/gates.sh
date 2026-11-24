#!/usr/bin/env bash
# Jedna bramka jakosci dla dzialajacego serwera lokalnego (R4 p9 B; lekcje R13-R15: bramki pominiete albo mierzace nie to).
# Uzycie: bash scripts/gates.sh <base-url> <trasa>...   np. bash scripts/gates.sh http://localhost:3000 / /nawyko /work/genactiv
# Tylko localhost / 127.0.0.1 (qa.js wysyla formularze) — inaczej kod 2. Kod 1, gdy jakakolwiek bramka FAIL.
# Logi: /tmp/gates/<slug>-<bramka>.log. Zmienne: PW_CHROMIUM (jak w skryptach), GATES_TIMEOUT (s, domyslnie 240),
# GATES_WK_SCENE=1 wymusza WK_SCENE=1 dla WebKit na kazdej trasie (domyslnie tylko /work/genactiv).
set -u
if [ $# -lt 2 ]; then echo "uzycie: bash scripts/gates.sh <base-url> <trasa>..." >&2; exit 2; fi
BASE="${1%/}"; shift
HOSTPART="${BASE#*://}"; HOSTPART="${HOSTPART%%/*}"; HOST="${HOSTPART%%:*}"
case "$HOST" in localhost|127.0.0.1) ;; *) echo "odmowa: host '$HOST' to nie localhost/127.0.0.1" >&2; exit 2;; esac
cd "$(dirname "$0")/.." || exit 2
LOGDIR=/tmp/gates; mkdir -p "$LOGDIR"
# R4 p10 (lekcja R17): serwer musi podawac TEN build, ktory jest w .next — stary `next-server` na tym samym porcie
# (pkill -f "next start" go nie zabija) podaje HTML z innym BUILD_ID i 500 na chunki; bramki mierzyly wtedy zepsuta strone.
if [ -f .next/BUILD_ID ]; then
  BID="$(cat .next/BUILD_ID)"
  if ! curl -s --max-time 20 "$BASE${1:-/}" | grep -q "$BID"; then
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
  for vp in "1440 900" "390 844"; do
    set -- $vp; w=$1; h=$2; log="$LOGDIR/$slug-scrollperf-$w.log"
    timeout "$TMO" node scripts/scroll-perf.mjs "$url" "$w" "$h" 4 >"$log" 2>&1; rc=$?
    frame=$(grep -oE 'najdluzsza: [0-9]+' "$log" | head -1 | grep -oE '[0-9]+')
    inter=$(grep -oE 'najdluzsza interakcja: [0-9]+' "$log" | head -1 | grep -oE '[0-9]+')
    if [ -n "$frame" ] && [ -n "$inter" ]; then
      if [ "$frame" -gt 100 ] || [ "$inter" -gt 200 ]; then add "$route" "scroll-perf-$w" FAIL "klatka ${frame} ms, interakcja ${inter} ms ($log)"
      else add "$route" "scroll-perf-$w" PASS "klatka ${frame} ms, interakcja ${inter} ms"; fi
    elif [ $rc -eq 124 ]; then add "$route" "scroll-perf-$w" FAIL "limit czasu ${TMO}s ($log)"
    elif [ $rc -ne 0 ]; then add "$route" "scroll-perf-$w" FAIL "kod $rc, brak liczb ($log)"
    else add "$route" "scroll-perf-$w" INFO "wyjscie bez liczb do sparsowania ($log)"; fi
  done
  run "$route" "focus-obscured" "$LOGDIR/$slug-focus-obscured.log" node scripts/focus-obscured.test.mjs "$BASE" "$route"
  run "$route" "jsonld" "$LOGDIR/$slug-jsonld.log" node scripts/jsonld-rules.test.mjs "$url"
  # WebKit: 390 (iPhone) i 1440 (Mac Safari), zrzuty do agencja/podglad/gates-wk-<slug>-<szer>
  if ! command -v xvfb-run >/dev/null 2>&1 || [ ! -x /usr/bin/WebKitWebDriver ]; then
    add "$route" "webkit" FAIL "WebKit niedostepny — kawalek nie jest gotowy"
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
for r in "${ROUTES[@]}"; do
  if [ "$r" = / ]; then SHIP_URL="$BASE" run "(globalnie)" "ship-compare" "$LOGDIR/global-ship-compare.log" node scripts/ship-compare.mjs; break; fi
done

echo; echo "=== PODSUMOWANIE ==="
printf '%-16s %-18s %-5s %s\n' TRASA BRAMKA WYNIK UWAGA
for r in "${ROWS[@]}"; do IFS='|' read -r a b c d <<<"$r"; printf '%-16s %-18s %-5s %s\n' "$a" "$b" "$c" "$d"; done
if [ $ANYFAIL -ne 0 ]; then echo "WYNIK: FAIL"; exit 1; fi
echo "WYNIK: PASS"; exit 0
