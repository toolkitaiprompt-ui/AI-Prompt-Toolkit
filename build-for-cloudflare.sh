#!/usr/bin/env bash
set -euo pipefail

# Cloudflare Pages build script for artifacts/ai-prompt-toolkit.
# Runs npm install + npm run build in isolation — bypasses pnpm workspace detection.

ARTIFACT_DIR="$(cd "$(dirname "$0")/artifacts/ai-prompt-toolkit" && pwd)"

echo "==> Building from $ARTIFACT_DIR"
cd "$ARTIFACT_DIR"

echo "==> npm install"
npm install --legacy-peer-deps

echo "==> npm run build"
npm run build

echo "==> Build complete. Output: $ARTIFACT_DIR/dist/public"
