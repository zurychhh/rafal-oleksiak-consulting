#!/usr/bin/env bash
# R4 p13 B2: test regresji bramki clsscroll (scripts/cls-scroll.mjs + progi z gates.sh).
# Stawia na 127.0.0.1:3197 (SELFTEST_PORT) (python3 -m http.server z katalogu tymczasowego) dwie strony-wzorce:
#   broken.html — element w widoku zmienia wysokosc przy kazdym przewinieciu (overflow-anchor wylaczony) -> oczekiwany FAIL (> 0,01)
#   calm.html   — ta sama dlugosc, nic sie nie zmienia                                                 -> oczekiwany PASS (<= 0,001)
# Kod 0 tylko gdy oba werdykty zgodne z oczekiwaniem. Uzycie: bash scripts/clsscroll-selftest.sh
set -u
cd "$(dirname "$0")/.." || exit 2
PORT="${SELFTEST_PORT:-3197}"   # R4 p14 B3: kazdy selftest na innym porcie (3197 clsscroll, 3198 scroll-perf)
. scripts/gates-lib.sh
TMP="$(mktemp -d)"
cleanup() { [ -n "${SRV:-}" ] && kill "$SRV" 2>/dev/null; rm -rf "$TMP"; }
trap cleanup EXIT

FILL=''; for i in $(seq 1 40); do FILL="$FILL<p>Paragraph $i of the pattern page, long enough to make the page scroll.</p>"; done
cat >"$TMP/broken.html" <<EOF
<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<style>html,body{overflow-anchor:none;margin:0;font:16px/1.6 sans-serif}#bar{position:sticky;top:0;background:#eee;height:60px}
p{margin:0 16px 24px}</style></head><body><div id="bar">bar</div>$FILL
<script>let big=false;addEventListener('scroll',()=>{big=!big;document.getElementById('bar').style.height=big?'180px':'60px'},{passive:true})</script>
</body></html>
EOF
cat >"$TMP/calm.html" <<EOF
<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<style>body{margin:0;font:16px/1.6 sans-serif}#bar{position:sticky;top:0;background:#eee;height:60px}p{margin:0 16px 24px}</style>
</head><body><div id="bar">bar</div>$FILL</body></html>
EOF

python3 -m http.server "$PORT" --bind 127.0.0.1 --directory "$TMP" >/dev/null 2>&1 &
SRV=$!
for _ in $(seq 1 50); do curl -s -o /dev/null "http://127.0.0.1:$PORT/calm.html" && break; sleep 0.2; done

verdict() {  # TA SAMA funkcja co gates.sh (clsscroll-<w>): clsscroll_verdict z scripts/gates-lib.sh
  local log="$TMP/$1.log"
  node scripts/cls-scroll.mjs "http://127.0.0.1:$PORT/$1.html" 390 844 >"$log" 2>&1
  clsscroll_verdict "$log"
}
ok=0
b=$(verdict broken); c=$(verdict calm)
echo "broken.html: $b (oczekiwany FAIL)"; [ "${b%% *}" = FAIL ] || ok=1
echo "calm.html:   $c (oczekiwany PASS)"; [ "${c%% *}" = PASS ] || ok=1
# R6' q4 A (R30.3): werdykt z mediany 3 przebiegow (clsscroll_median, ta sama funkcja co gates.sh) — jeden skok nie przewaza.
printf 'CLSSCROLL suma=0.0000\n' >"$TMP/m1.log"; printf 'CLSSCROLL suma=0.0500\n' >"$TMP/m2.log"; printf 'CLSSCROLL suma=0.0004\n' >"$TMP/m3.log"
printf 'nic\n' >"$TMP/m4.log"; printf 'CLSSCROLL suma=0.0200\n' >"$TMP/m5.log"; printf 'CLSSCROLL suma=0.0300\n' >"$TMP/m6.log"
m=$(clsscroll_median "$TMP/m1.log" "$TMP/m2.log" "$TMP/m3.log")
echo "mediana (0, 0.05, 0.0004): $m (oczekiwany PASS 0.0004 0.0000,0.0500,0.0004)"; [ "$m" = "PASS 0.0004 0.0000,0.0500,0.0004" ] || ok=1
m=$(clsscroll_median "$TMP/m5.log" "$TMP/m4.log" "$TMP/m6.log")
echo "mediana (0.02, brak, 0.03): $m (oczekiwany FAIL 0.0300 0.0200,brak,0.0300)"; [ "$m" = "FAIL 0.0300 0.0200,brak,0.0300" ] || ok=1
m=$(clsscroll_median "$TMP/m4.log" "$TMP/m4.log" "$TMP/m4.log")
echo "mediana (brak x3): $m (oczekiwany BRAK)"; [ "$m" = BRAK ] || ok=1
[ $ok -eq 0 ] && echo "CLSSCROLL-SELFTEST: PASS" || echo "CLSSCROLL-SELFTEST: FAIL"
exit $ok
