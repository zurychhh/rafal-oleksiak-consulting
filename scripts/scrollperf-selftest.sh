#!/usr/bin/env bash
# R4 p13 B2: test regresji bramki scroll-perf (scripts/scroll-perf.mjs --runs 3 + progi z gates.sh: klatka 100 ms, interakcja 200 ms).
# Stawia na 127.0.0.1:3198 (SELFTEST_PORT) (python3 -m http.server z katalogu tymczasowego) dwie strony-wzorce:
#   broken.html — handler `scroll` z petla zajeta przez 250 ms -> oczekiwany FAIL
#   calm.html   — ta sama strona bez handlera                  -> oczekiwany PASS
# Kod 0 tylko gdy oba werdykty zgodne z oczekiwaniem. Uzycie: bash scripts/scrollperf-selftest.sh
set -u
cd "$(dirname "$0")/.." || exit 2
PORT="${SELFTEST_PORT:-3198}"   # R4 p14 B3: kazdy selftest na innym porcie (3197 clsscroll, 3198 scroll-perf)
. scripts/gates-lib.sh
TMP="$(mktemp -d)"
cleanup() { [ -n "${SRV:-}" ] && kill "$SRV" 2>/dev/null; rm -rf "$TMP"; }
trap cleanup EXIT

FILL=''; for i in $(seq 1 30); do FILL="$FILL<p>Paragraph $i of the pattern page, long enough to make the page scroll.</p>"; done
HEAD='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>body{margin:0;font:16px/1.6 sans-serif}p{margin:0 16px 24px}</style></head><body>'
printf '%s%s%s' "$HEAD" "$FILL" "<script>let last=0;addEventListener('scroll',()=>{const n=performance.now();if(n-last<300)return;last=n;const t=n+250;while(performance.now()<t){}},{passive:true})</script></body></html>" >"$TMP/broken.html"
printf '%s%s%s' "$HEAD" "$FILL" "</body></html>" >"$TMP/calm.html"

python3 -m http.server "$PORT" --bind 127.0.0.1 --directory "$TMP" >/dev/null 2>&1 &
SRV=$!
for _ in $(seq 1 50); do curl -s -o /dev/null "http://127.0.0.1:$PORT/calm.html" && break; sleep 0.2; done

verdict() {  # parsowanie i progi z gates-lib.sh (scroll-perf-<w>)
  local log="$TMP/$1.log"
  node scripts/scroll-perf.mjs "http://127.0.0.1:$PORT/$1.html" 390 844 4 --runs 3 >"$log" 2>&1
  local vd; vd=$(scrollperf_verdict "$log")   # TA SAMA funkcja co gates.sh (scripts/gates-lib.sh)
  [ "$vd" = BRAK ] && { echo BRAK; return; }
  set -- $vd; echo "$1 klatka_med=$2 interakcja_med=$3 klatki=$4 interakcje=$5"
}
ok=0
b=$(verdict broken); c=$(verdict calm)
echo "broken.html: $b (oczekiwany FAIL)"; [ "${b%% *}" = FAIL ] || ok=1
echo "calm.html:   $c (oczekiwany PASS)"; [ "${c%% *}" = PASS ] || ok=1
[ $ok -eq 0 ] && echo "SCROLLPERF-SELFTEST: PASS" || echo "SCROLLPERF-SELFTEST: FAIL"
exit $ok
