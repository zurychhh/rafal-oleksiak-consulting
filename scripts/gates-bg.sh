#!/usr/bin/env bash
# R6' p13 (R6'-N12 pkt 4): gates.sh na wielu trasach trwa > 10 min (limit jednego wywolania powloki), a `nohup … &`
# 28.11 zniknal bez tabeli podsumowania. Ten skrypt odpala gates.sh w NOWEJ sesji (setsid, bez terminala), zapisuje
# PID, pelne wyjscie i kod wyjscia do plikow, wiec przezywa koniec wywolania narzedzia i wynik da sie odczytac pozniej.
# Uzycie: bash scripts/gates-bg.sh <katalog-logow> <base-url> <trasa>...   → wraca od razu
#         bash scripts/gates-bg.sh --wait <katalog-logow> [sekundy]          → czeka (domyslnie 540 s) i drukuje wynik
# Pliki: <katalog>/run.pid, <katalog>/run.out (tabela gates.sh), <katalog>/run.rc (kod wyjscia, pojawia sie na koncu).
set -u
cd "$(dirname "$0")/.." || exit 2
if [ "${1:-}" = "--wait" ]; then
  D="${2:?katalog}"; T="${3:-540}"
  for _ in $(seq 1 "$T"); do [ -s "$D/run.rc" ] && break; sleep 1; done
  if [ -s "$D/run.rc" ]; then tail -60 "$D/run.out"; echo "GATES-BG rc=$(cat "$D/run.rc")"; exit "$(cat "$D/run.rc")"; fi
  if kill -0 "$(cat "$D/run.pid" 2>/dev/null)" 2>/dev/null; then echo "GATES-BG nadal trwa (pid $(cat "$D/run.pid"))"; exit 3; fi
  echo "GATES-BG: proces zniknal bez run.rc — przebieg przerwany (sprawdz $D/run.out)"; exit 4
fi
D="${1:?katalog}"; shift
mkdir -p "$D" && rm -f "$D/run.rc" "$D/run.out" "$D/run.pid"
# katalog przez zmienna srodowiskowa, nie przez sklejanie tekstu polecenia (recenzja 54: `"` i `$` w nazwie)
GATES_LOGDIR="$D" setsid bash -c 'bash scripts/gates.sh "$@" >"$GATES_LOGDIR/run.out" 2>&1; echo $? >"$GATES_LOGDIR/run.rc"' _ "$@" </dev/null >/dev/null 2>&1 &
echo $! >"$D/run.pid"
echo "GATES-BG start pid $(cat "$D/run.pid") logi $D"
