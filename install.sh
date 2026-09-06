#!/usr/bin/env bash
# AZHub one-click install. Counted download via this project's Worker.
# Usage: curl -fsSL https://azhub-download-tracker.vibelock.workers.dev/install.sh | bash
set -euo pipefail

HOST="${AZHUB_HOST:-https://azhub-download-tracker.vibelock.workers.dev}"
ASSET="${AZHUB_ASSET:-azhub-0.1.0.tar.gz}"
WORKDIR="${AZHUB_HOME:-$HOME/azhub}"

mkdir -p "$WORKDIR"
cd "$WORKDIR"

echo "Downloading counted tarball from ${HOST}/download (User-Agent Mozilla/5.0)…"
curl -fsSL -A 'Mozilla/5.0' "${HOST}/download?asset=${ASSET}" -o "${ASSET}"

tar -xzf "${ASSET}"
DIR="$(find . -maxdepth 1 -type d -name 'azhub-*' | head -n 1)"
if [ -n "${DIR}" ]; then
  cd "${DIR}"
fi

python3 -m venv .venv
# shellcheck disable=SC1091
. .venv/bin/activate
python -m pip install -U pip
python -m pip install -e .

echo
echo "Installed AZHub."
echo "Run: azhub ui"
echo "Then open http://127.0.0.1:8880 (loopback only)"
echo "SPACE / Blank Key — never AZInterface. Author: Aziel Eliab."
