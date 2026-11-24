#!/usr/bin/env bash
# R4 p15 B1: test regresji bramki short-<w>c (scripts/short-viewport-check.mjs + shortvp_verdict z gates-lib.sh).
# Stawia na 127.0.0.1:3199 (SELFTEST_PORT) (python3 -m http.server z katalogu tymczasowego) trzy strony-wzorce:
#   cut.html     — przypieta scena (.nk-scene.is-scroll > .nk-stage sticky, overflow:hidden), link lezy 40 px pod dolna
#                  krawedzia sceny -> oczekiwany FAIL
#   ok.html      — ta sama scena, link w srodku sceny -> oczekiwany PASS
#   noscene.html — strona bez przypietej sceny -> oczekiwany SKIP (kod 2 skryptu)
# Widok jak w gates.sh: 390x844 --cookies. Kod 0 tylko gdy wszystkie trzy werdykty zgodne z oczekiwaniem.
# Uzycie: bash scripts/shortvp-selftest.sh
set -u
cd "$(dirname "$0")/.." || exit 2
PORT="${SELFTEST_PORT:-3199}"   # porty selftestow: 3197 clsscroll, 3198 scroll-perf, 3199 short-viewport
. scripts/gates-lib.sh
TMP="$(mktemp -d)"
cleanup() { [ -n "${SRV:-}" ] && kill "$SRV" 2>/dev/null; rm -rf "$TMP"; }
trap cleanup EXIT

FILL=''; for i in $(seq 1 30); do FILL="$FILL<p>Paragraph $i of the pattern page, long enough to make the page scroll.</p>"; done
HEAD='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">'
scene() {  # scene <top linku w scenie>
  printf '%s' "$HEAD"
  printf '<style>body{margin:0;font:16px/1.6 sans-serif}p{margin:0 16px 24px}'
  printf '.nk-scene{height:300vh;position:relative}.nk-stage{position:sticky;top:0;height:100vh;overflow:hidden;background:#eef}'
  printf '.nk-stage h2{margin:0;padding:24px 16px}.nk-stage a{position:absolute;left:16px;top:%s;display:block}</style></head>' "$1"
  printf '<body>%s<section class="nk-scene is-scroll"><div class="nk-stage"><h2>Pattern scene</h2>' "$FILL"
  printf '<a href="#x">Pattern link in the scene</a></div></section>%s</body></html>\n' "$FILL"
}
scene 'calc(100% + 40px)' >"$TMP/cut.html"
scene '40%' >"$TMP/ok.html"
printf '%s</head><body>%s</body></html>\n' "$HEAD" "$FILL" >"$TMP/noscene.html"

python3 -m http.server "$PORT" --bind 127.0.0.1 --directory "$TMP" >/dev/null 2>&1 &
SRV=$!
for _ in $(seq 1 50); do curl -s -o /dev/null "http://127.0.0.1:$PORT/ok.html" && break; sleep 0.2; done

verdict() {  # TA SAMA funkcja co gates.sh (short-<w>c): shortvp_verdict z scripts/gates-lib.sh
  local log="$TMP/$1.log"
  node scripts/short-viewport-check.mjs "http://127.0.0.1:$PORT/$1.html" 390 844 --cookies --wait=100 >"$log" 2>&1
  shortvp_verdict "$log" $?
}
ok=0
a=$(verdict cut); b=$(verdict ok); c=$(verdict noscene)
echo "cut.html:     $a (oczekiwany FAIL)"; [ "${a%% *}" = FAIL ] || ok=1
echo "ok.html:      $b (oczekiwany PASS)"; [ "$b" = PASS ] || ok=1
echo "noscene.html: $c (oczekiwany SKIP)"; [ "$c" = SKIP ] || ok=1
[ $ok -eq 0 ] && echo "SHORTVP-SELFTEST: PASS" || echo "SHORTVP-SELFTEST: FAIL"
exit $ok
