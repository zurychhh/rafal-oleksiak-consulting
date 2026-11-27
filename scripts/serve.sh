#!/usr/bin/env bash
# R42: jedyny sposob na (re)start lokalnego serwera do pomiarow. 27.11 `pkill -f "next start"` nie trafil w `next-server`,
# nowy `npm start` padl po cichu na EADDRINUSE, a pojedyncze skrypty pomiarowe (cls-scroll.mjs uruchamiany recznie, poza
# gates.sh, ktory ma kontrole BUILD_ID z R17) mierzyly stary build — 3 falszywe wyniki CLS, jedna bledna poprawka.
# Uzycie: bash scripts/serve.sh [port]   (po `npm run build`). Kod 0 tylko, gdy serwer podaje biezacy .next/BUILD_ID.
PORT="${1:-3000}"
cd "$(dirname "$0")/.." || exit 2
[ -f .next/BUILD_ID ] || { echo "brak .next/BUILD_ID — najpierw npm run build" >&2; exit 2; }
fuser -k "$PORT/tcp" >/dev/null 2>&1; sleep 1
if fuser "$PORT/tcp" >/dev/null 2>&1; then echo "port $PORT nadal zajety" >&2; exit 2; fi
PORT="$PORT" nohup npm start >"/tmp/serve-$PORT.log" 2>&1 &
BID="$(cat .next/BUILD_ID)"
for _ in $(seq 1 60); do
  if curl -s --max-time 5 "http://localhost:$PORT/" | grep -qF -- "$BID"; then echo "SERVE OK port=$PORT build=$BID"; exit 0; fi
  sleep 1
done
echo "SERVE FAIL: serwer na $PORT nie podaje buildu $BID (log /tmp/serve-$PORT.log)" >&2; exit 1
