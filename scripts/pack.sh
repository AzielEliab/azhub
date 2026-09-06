#!/usr/bin/env bash
# Build the counted public tarball (excludes the tarball itself).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT
DEST="$ROOT/workers/download-tracker/public"
mkdir -p "$DEST"
mkdir -p "$STAGE/azhub-0.1.0"
tar -C "$ROOT" --exclude='.git' --exclude='.venv' --exclude='node_modules' \
  --exclude='.wrangler' --exclude='__pycache__' --exclude='*.egg-info' \
  --exclude='.pytest_cache' --exclude='workers/download-tracker/public/azhub-0.1.0.tar.gz' \
  --exclude='dist' -cf - . | tar -C "$STAGE/azhub-0.1.0" -xf -
tar -C "$STAGE" -czf "$DEST/azhub-0.1.0.tar.gz" azhub-0.1.0
echo "wrote $DEST/azhub-0.1.0.tar.gz"
