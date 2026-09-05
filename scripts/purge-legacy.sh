#!/usr/bin/env bash
#
# Wycina radar, lamę, MCC i Stripe — zgodnie z ustaleniem, że zostaje
# strona główna i blog. To jest ~46 600 linii kodu w 150+ plikach.
#
#   bash scripts/purge-legacy.sh          # tylko pokazuje
#   bash scripts/purge-legacy.sh --apply  # kasuje
#
# Nic nie robi na siłę: przed usunięciem zakłada gałąź i commit,
# żeby dało się wrócić jednym `git checkout`.

set -euo pipefail
APPLY=${1:-}

TARGETS=(
  app/radar app/api/radar lib/radar
  app/api/lama app/lib/lama lib/lama
  app/mcc app/api/mcc lib/mcc
  app/api/stripe lib/stripe.ts app/audit-success
  app/api/auto-publish-trial app/auto-publish
  app/api/pdf-generator app/api/auth
  app/admin
  # Stara strona główna. Po porcie The Audit nic jej nie importuje:
  # app/components/sections/* wchodzi wyłącznie przez HomeClient.tsx,
  # a HomeClient.tsx nie jest już importowany znikąd.
  app/HomeClient.tsx app/components/sections
)

echo "── do usunięcia ──────────────────────────────────────────"
TOTAL=0
for t in "${TARGETS[@]}"; do
  if [ -e "$t" ]; then
    n=$(find "$t" -type f 2>/dev/null | wc -l | tr -d ' ')
    TOTAL=$((TOTAL + n))
    printf "  %-32s %5s plików\n" "$t" "$n"
  fi
done
echo "  razem: $TOTAL plików"

echo
echo "── zostanie po tym zerwane ───────────────────────────────"
# Te pliki zostają, ale odwołują się do usuwanego kodu — wymagają ręcznej ręki.
grep -rn "api/lama\|api/radar\|api/mcc\|api/stripe\|from '@/lib/stripe'\|id: 'radar'" \
  app/components app/page.tsx app/layout.tsx app/privacy 2>/dev/null | sed 's/^/  /' || echo "  (nic)"

if [ "$APPLY" != "--apply" ]; then
  echo
  echo "To był podgląd. Uruchom: bash scripts/purge-legacy.sh --apply"
  exit 0
fi

echo
BRANCH="purge-legacy-$(date +%Y%m%d-%H%M)"
git checkout -b "$BRANCH"
git add -A && git commit -m "checkpoint before purge" --allow-empty -q
echo "Punkt powrotu: gałąź $BRANCH, poprzedni stan w ostatnim commicie."

for t in "${TARGETS[@]}"; do
  [ -e "$t" ] && git rm -rq "$t" && echo "  usunięte $t"
done

echo
echo "Zostało do ręcznego dokończenia:"
# FinalCTA.tsx i Accelerators.tsx nie są już osobnym zadaniem — leżą w
# app/components/sections, które ta lista kasuje w całości razem z HomeClient.
echo "  1. app/privacy/page.tsx                    — wzmianki o usuniętych usługach"
echo "  2. package.json                            — stripe, zbędne SDK do odinstalowania"
echo "  3. app/components/ui/                      — zostaje osierocone poza CookieConsent;"
echo "     Logo/HeroCTA/FinalSuccessScreen szły tylko do usuwanych stron"
echo
echo "CookieConsent NIE jest tu do decyzji: renderował się wyłącznie w HomeClient,"
echo "więc port go odpiął. Wraca do layoutu w zadaniu 6, przestylowany na paletę"
echo "nowej strony. Ten skrypt go nie usuwa (app/components/ui nie jest na liście)."
echo
echo "Potem: npx tsc --noEmit  (pokaże resztę)"
