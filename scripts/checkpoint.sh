#!/usr/bin/env bash
# Punkt kontrolny przebiegu agencji (R37, 26.11.2026).
# Przebiegi 25.11 15:38 i 16:38 zostawily znacznik W-TOKU i zadnego commitu: sesja w chmurze
# skonczyla sie przed commitem zamykajacym, a cala praca (kod, zrzuty, recenzja) przepadla razem
# z kontenerem. Ten skrypt wypycha BIEZACY stan drzewa roboczego na osobna galaz wip/<znacznik>,
# NIE ruszajac agencja/strona ani historii biezacej galezi.
#
# Uzycie (co ~20 min i przed kazdym dlugim krokiem, np. gates.sh):
#   bash scripts/checkpoint.sh <znacznik> ["opis"]      # np. 1038 "audyt d: blog, metadata"
# Wznowienie w kolejnym przebiegu:
#   git fetch origin 'refs/heads/wip/*:refs/remotes/origin/wip/*'
#   git log origin/wip/<znacznik> -1 --stat   ->   git checkout origin/wip/<znacznik> -- <pliki>
# Zamkniecie: po udanym pushu na agencja/strona usun galaz: git push origin --delete wip/<znacznik>
set -euo pipefail
TAG="${1:?podaj znacznik, np. 1038}"; MSG="${2:-punkt kontrolny}"
case "$TAG" in *[!A-Za-z0-9._-]*) echo "znacznik tylko [A-Za-z0-9._-]" >&2; exit 2;; esac
ROOT="$(git rev-parse --show-toplevel)"; cd "$ROOT"
# Osobny indeks: nie zmieniamy tego, co uzytkownik ma w stage.
TMPIDX="$(mktemp)"; trap 'rm -f "$TMPIDX"' EXIT
cp "$(git rev-parse --git-path index)" "$TMPIDX" 2>/dev/null || true
export GIT_INDEX_FILE="$TMPIDX"
git add -A >/dev/null  # .gitignore pomija node_modules, .next i .env*
# Straz: zadnych plikow sekretow i duzych binariow w punkcie kontrolnym (repo publiczne).
if git diff --cached --name-only HEAD | grep -E '(^|/)\.env|\.pem$|credentials|\.google-ads-token' >/dev/null; then
  echo "odmowa: w zmianach jest plik wygladajacy na sekret" >&2; exit 3
fi
# Straz rozmiaru: plik > 5 MB nie idzie do punktu kontrolnego (zrzuty z bramek maja ~75 KB).
BIG="$(git diff --cached --name-only --diff-filter=AM HEAD | while read -r f; do [ -f "$f" ] && [ "$(stat -c %s "$f")" -gt 5242880 ] && echo "$f"; done || true)"
if [ -n "$BIG" ]; then echo "odmowa: pliki > 5 MB: $BIG" >&2; exit 3; fi
TREE="$(git write-tree)"
PARENT="$(git rev-parse HEAD)"
# Bez force push (zasada agencji): gdy wip/<znacznik> juz istnieje, nowy punkt ma go za rodzica,
# wiec push jest zwyklym przewinieciem do przodu.
PARENTS=(-p "$PARENT")
if git fetch -q origin "refs/heads/wip/$TAG:refs/remotes/origin/wip/$TAG" 2>/dev/null; then
  PARENTS=(-p "$(git rev-parse "refs/remotes/origin/wip/$TAG")" -p "$PARENT")
fi
COMMIT="$(printf '%s\n\nwip %s (%s)\n\nCo-Authored-By: Claude <noreply@anthropic.com>\n' "wip/$TAG: $MSG" "$TAG" "$(TZ=Europe/Warsaw date '+%F %H:%M')" | git commit-tree "$TREE" "${PARENTS[@]}")"
git -c push.negotiate=true push -q origin "$COMMIT:refs/heads/wip/$TAG"
echo "PASS punkt kontrolny wip/$TAG = ${COMMIT:0:7} (rodzic ${PARENT:0:7})"
