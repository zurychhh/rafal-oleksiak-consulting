# Wspolne parsowanie i progi bramek (R4 p14 B3) — zrodluja: scripts/gates.sh, scripts/clsscroll-selftest.sh,
# scripts/scrollperf-selftest.sh. Jedno miejsce na progi, zeby selftest sprawdzal DOKLADNIE to, co liczy bramka.
# Funkcje czytaja log i wypisuja jedna linie na stdout; nie wywoluja exit.

# clsscroll_verdict <log> -> "PASS|INFO|FAIL <suma>" albo "BRAK" (brak linii CLSSCROLL)
# Progi (R4 p12 B1): PASS <= 0,001, INFO 0,001-0,01, FAIL > 0,01.
clsscroll_verdict() {
  local v; v=$(grep -oE '^CLSSCROLL suma=[0-9.]+' "$1" | tail -1 | grep -oE '[0-9.]+$')
  [ -z "$v" ] && { echo "BRAK"; return 0; }
  awk -v v="$v" 'BEGIN { if (v > 0.01) print "FAIL " v; else if (v > 0.001) print "INFO " v; else print "PASS " v }'
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
