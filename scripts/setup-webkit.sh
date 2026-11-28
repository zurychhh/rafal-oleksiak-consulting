#!/usr/bin/env bash
# R45.4: jedno polecenie instalacji WebKit (silnik Safari) w swiezym kontenerze. 28.11 instalacja bez `apt-get update`
# padla po cichu w tle (lekcja R33.3 powtorzona, bo polecenie w kolejce STATUS nie mialo `update`) i bramki WebKit daly FAIL.
# Uzycie: bash scripts/setup-webkit.sh   → kod 0 tylko, gdy WebKitWebDriver, xvfb-run i selenium sa dostepne.
set -u
if ! command -v WebKitWebDriver >/dev/null 2>&1 || ! command -v xvfb-run >/dev/null 2>&1; then
  apt-get update >/tmp/setup-webkit-apt.log 2>&1 && apt-get install -y webkit2gtk-driver xvfb >>/tmp/setup-webkit-apt.log 2>&1
fi
python3 -c "import selenium" 2>/dev/null || pip install --break-system-packages selenium >/tmp/setup-webkit-pip.log 2>&1
if command -v WebKitWebDriver >/dev/null 2>&1 && command -v xvfb-run >/dev/null 2>&1 && python3 -c "import selenium" 2>/dev/null; then
  echo "SETUP-WEBKIT OK"; exit 0
fi
echo "SETUP-WEBKIT FAIL (logi /tmp/setup-webkit-*.log)" >&2; exit 1
