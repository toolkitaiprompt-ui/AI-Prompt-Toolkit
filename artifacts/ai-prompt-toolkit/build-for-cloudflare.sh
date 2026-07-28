#!/usr/bin/env bash
set -euo pipefail

# Compatibility wrapper for Cloudflare Pages projects that have
# Root directory set to: artifacts/ai-prompt-toolkit
# The real app lives at the repository root, so this script builds the
# root app and copies the final static output back into this directory.

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

printf '==> Cloudflare wrapper directory: %s\n' "$SCRIPT_DIR"
printf '==> Real app directory: %s\n' "$REPO_ROOT"

cd "$REPO_ROOT"

printf '==> Installing root dependencies\n'
npm install --legacy-peer-deps

printf '==> Building root app\n'
npm run build

printf '==> Copying output to Cloudflare root dist/public\n'
rm -rf "$SCRIPT_DIR/dist/public"
mkdir -p "$SCRIPT_DIR/dist"
cp -R "$REPO_ROOT/dist/public" "$SCRIPT_DIR/dist/public"

printf '==> Build complete. Cloudflare output: %s\n' "$SCRIPT_DIR/dist/public"
