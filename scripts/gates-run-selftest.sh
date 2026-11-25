#!/usr/bin/env bash
# R6' q5 B (spec 39, recenzja 46 Drobne 4): test regresji werdyktu bramek z kodu wyjscia I linii PASS
# (gates_exec / gates_result z scripts/gates-lib.sh — ta sama funkcja, ktorej uzywa run_expect w gates.sh dla
# webkit-390/1440 i css-dropped). Falszywe polecenia zamiast prawdziwych skryptow:
#   „PASS + exit 2”   -> FAIL z komunikatem o rozbieznosci (przypadek webkit-check.py przy 390)
#   „exit 0 bez PASS” -> FAIL (bramka nic nie orzekla)
#   „PASS + exit 0”   -> PASS
#   „FAIL + exit 1”   -> FAIL
#   limit czasu       -> FAIL limit czasu
# Uzycie: bash scripts/gates-run-selftest.sh   (kod 0 tylko gdy wszystkie werdykty zgodne z oczekiwaniem)
set -u
cd "$(dirname "$0")/.." || exit 2
. scripts/gates-lib.sh
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
RE='^PASS: '

ok=0
check() {  # check <nazwa> <oczekiwany prefiks werdyktu> <limit s> <polecenie bash>
  local vd; vd=$(gates_exec "$3" "$TMP/$1.log" "$RE" bash -c "$4")
  if [ "${vd#"$2"}" != "$vd" ]; then echo "$1: OK — $vd"
  else echo "$1: ZLE — oczekiwano '$2…', jest '$vd'"; ok=1; fi
}
check pass-exit2   "FAIL rozbieznosc" 10 'echo "viewport [447, 806]"; echo "PASS: no visible phone narrower than 150 px"; exit 2'
check exit0-nopass "FAIL kod 0, ale brak linii PASS" 10 'echo "viewport [447, 806]"; exit 0'
check pass-exit0   "PASS" 10 'echo "PASS: no visible phone narrower than 150 px"; exit 0'
check fail-exit1   "FAIL kod 1" 10 'echo "FAIL: phone narrower than 150 px: [[16, 403]]"; exit 1'
check timeout      "FAIL limit czasu" 1 'echo "PASS: early"; sleep 5'
# PASS w srodku linii (np. „selftest PASS”) nie wystarcza — wzorzec jest kotwiczony na poczatku linii
check pass-midline "FAIL kod 0, ale brak linii PASS" 10 'echo "note: PASS: not a result line"; exit 0'
[ $ok -eq 0 ] && echo "GATES-RUN-SELFTEST: PASS" || echo "GATES-RUN-SELFTEST: FAIL"
exit $ok
