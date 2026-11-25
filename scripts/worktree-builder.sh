#!/usr/bin/env bash
# Worktree dla budujacego (lekcja R31.3 powtorzona w R32: symlink node_modules lamie Turbopack —
# "Symlink node_modules is invalid, it points out of the filesystem root"). Twarde linki: szybko, bez 800 MB kopii.
# Uzycie: bash scripts/worktree-builder.sh <katalog> <galaz>   np. bash scripts/worktree-builder.sh /home/claude/wt-a wip/q5a
set -eu
[ $# -eq 2 ] || { echo "uzycie: bash scripts/worktree-builder.sh <katalog> <galaz>" >&2; exit 2; }
cd "$(dirname "$0")/.."
[ -d node_modules ] || { echo "najpierw npm ci w $(pwd)" >&2; exit 2; }
git worktree add -q -b "$2" "$1" HEAD
cp -al node_modules "$1/node_modules"
[ ! -L "$1/node_modules" ] && echo "OK: $1 ($2), node_modules jako twarde linki"
