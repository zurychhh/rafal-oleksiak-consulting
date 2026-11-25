# Wspolne parsowanie i progi bramek (R4 p14 B3) — zrodluja: scripts/gates.sh, scripts/clsscroll-selftest.sh,
# scripts/scrollperf-selftest.sh. Jedno miejsce na progi, zeby selftest sprawdzal DOKLADNIE to, co liczy bramka.
# Funkcje czytaja log i wypisuja jedna linie na stdout; nie wywoluja exit.

# clsscroll_verdict <log> -> "PASS|INFO|FAIL <suma>" albo "BRAK" (brak linii CLSSCROLL)
# Progi (R4 p12 B1): PASS <= 0,001, INFO 0,001-0,01, FAIL > 0,01.
clsscroll_verdict() {
  local v; v=$(grep -oE '^CLSSCROLL suma=[0-9.]+' "$1" | tail -1 | grep -oE '[0-9.]+$')
  [ -z "$v" ] && { echo "BRAK"; return 0; }
  clsscroll_level "$v"
}

# clsscroll_level <suma> -> "PASS|INFO|FAIL <suma>" — jedno miejsce na progi clsscroll.
clsscroll_level() {
  awk -v v="$1" 'BEGIN { if (v > 0.01) print "FAIL " v; else if (v > 0.001) print "INFO " v; else print "PASS " v }'
}

# clsscroll_median <log>... -> "PASS|INFO|FAIL <mediana> <v1,v2,v3>" albo "BRAK" (zaden log bez linii CLSSCROLL).
# R6' q4 A (regula R30.3): pojedynczy przebieg dawal skoki CLS nie do powtorzenia — gates.sh puszcza 3 przebiegi,
# werdykt z mediany (progi bez zmian), w uwadze wszystkie wartosci; przebieg bez linii CLSSCROLL wpisany jako "brak".
# Przy parzystej liczbie wartosci (jeden przebieg bez wyniku) bierzemy wyzsza ze srodkowych — ostrozniej.
clsscroll_median() {
  local f v vals=() all=""
  for f in "$@"; do
    v=$(grep -oE '^CLSSCROLL suma=[0-9.]+' "$f" 2>/dev/null | tail -1 | grep -oE '[0-9.]+$')
    if [ -n "$v" ]; then vals+=("$v"); all="$all,$v"; else all="$all,brak"; fi
  done
  [ ${#vals[@]} -eq 0 ] && { echo "BRAK"; return 0; }
  local med; med=$(printf '%s\n' "${vals[@]}" | sort -g | awk '{a[NR]=$1} END { print a[int(NR/2)+1] }')
  echo "$(clsscroll_level "$med") ${all#,}"
}

# scrollperf_verdict <log> -> "PASS|FAIL <klatka_med> <interakcja_med> <klatki> <interakcje>" albo "BRAK"
# Progi (R4 p13 B1): FAIL gdy mediana klatki > 100 ms albo mediana interakcji > 200 ms.
scrollperf_verdict() {
  local line f i fa ia
  line=$(grep -E '^SCROLLPERF ' "$1" | tail -1)
  f=$(echo "$line" | grep -oE 'klatka_med=[0-9]+' | grep -oE '[0-9]+')
  i=$(echo "$line" | grep -oE 'interakcja_med=[0-9]+' | grep -oE '[0-9]+')
  fa=$(echo "$line" | grep -oE 'klatki=[0-9,]+' | cut -d= -f2)
  ia=$(echo "$line" | grep -oE 'interakcje=[0-9,]+' | cut -d= -f2)
  { [ -z "$f" ] || [ -z "$i" ]; } && { echo "BRAK"; return 0; }
  if [ "$f" -gt 100 ] || [ "$i" -gt 200 ]; then echo "FAIL $f $i ${fa:--} ${ia:--}"; else echo "PASS $f $i ${fa:--} ${ia:--}"; fi
}

# webkit_missing -> pusty wynik, gdy WebKit jest gotowy; inaczej opis braku z poleceniem instalacji.
webkit_missing() {
  local miss=()
  [ -x /usr/bin/WebKitWebDriver ] || miss+=("WebKitWebDriver")
  command -v xvfb-run >/dev/null 2>&1 || miss+=("xvfb-run")
  python3 -I -c 'import selenium' >/dev/null 2>&1 || miss+=("selenium (python)")
  [ ${#miss[@]} -eq 0 ] && return 0
  local list; list=$(printf '%s, ' "${miss[@]}"); list=${list%, }
  echo "brak: $list — zainstaluj: apt-get update && apt-get install -y webkit2gtk-driver xvfb && pip install --break-system-packages selenium"
}

# shortvp_verdict <log> <kod wyjscia> -> "PASS", "SKIP" albo "FAIL <uwaga>" (R4 p15 B1, scripts/short-viewport-check.mjs).
# SKIP tylko przy kodzie 2 Z linia „brak przypietej sceny” (inny kod 2 = blad uzycia -> FAIL). 124 = limit czasu.
shortvp_verdict() {
  local log="$1" rc="$2" line
  line=$(grep -E '^SVC (PASS|FAIL) ' "$log" | tail -1)
  if [ "$rc" -eq 0 ] && [ "${line#SVC PASS}" != "$line" ]; then echo "PASS"; return 0; fi
  if [ "$rc" -eq 2 ] && grep -q 'brak przypietej sceny' "$log"; then echo "SKIP"; return 0; fi
  if [ "$rc" -eq 124 ]; then echo "FAIL limit czasu"; return 0; fi
  if [ "$rc" -eq 1 ] && [ -n "$line" ]; then
    echo "FAIL $(echo "$line" | grep -oE 'problemow [0-9]+ \(unikalnych [0-9]+\)'); $(grep -m1 -E '^FAIL ' "$log" | cut -c6-120 | tr '|' '/')"; return 0
  fi
  echo "FAIL kod $rc, brak linii SVC"
}

# gates_result <kod> <log> <wzorzec ERE linii PASS> -> "PASS" albo "FAIL <uwaga>" (R6' q5 B, spec 39; recenzja 46 Drobne 4).
# PASS tylko gdy kod 0 I w logu jest linia PASS. Kod 0 bez linii = bramka nic nie orzekla; linia PASS z kodem != 0 =
# rozbieznosc (np. webkit-check.py przy 390: „PASS” i kod 2) — oba FAIL z czytelnym komunikatem, nigdy cichy PASS.
gates_result() {
  local rc="$1" log="$2" re="$3" has=0
  grep -qE -- "$re" "$log" 2>/dev/null && has=1
  if [ "$rc" -eq 0 ] && [ $has -eq 1 ]; then echo "PASS"; return 0; fi
  if [ "$rc" -eq 124 ]; then echo "FAIL limit czasu"; return 0; fi
  if [ "$rc" -eq 0 ]; then echo "FAIL kod 0, ale brak linii PASS — bramka nic nie orzekla"; return 0; fi
  if [ $has -eq 1 ]; then echo "FAIL rozbieznosc: linia PASS, ale kod $rc — wynik niewiarygodny, sprawdz log"; return 0; fi
  echo "FAIL kod $rc"
}

# gates_exec <limit s> <log> <wzorzec linii PASS> <polecenie...> -> werdykt gates_result (wspolne z gates-run-selftest.sh)
gates_exec() {
  local tmo="$1" log="$2" re="$3"; shift 3
  timeout "$tmo" "$@" >"$log" 2>&1; local rc=$?
  gates_result "$rc" "$log" "$re"
}
