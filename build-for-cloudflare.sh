#!/usr/bin/env bash
set -euo pipefail

# Cloudflare Pages compatibility build. The app source lives at the repository
# root, while some existing Pages projects publish artifacts/ai-prompt-toolkit.
# Build once at the root and make the validated output available at both paths.

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
ARTIFACT_DIR="$REPO_ROOT/artifacts/ai-prompt-toolkit"

printf '==> Installing dependencies in %s\n' "$REPO_ROOT"
cd "$REPO_ROOT"
npm ci --legacy-peer-deps

printf '==> Building app and validating sitemap.xml\n'
npm run build

printf '==> Copying output to compatibility directory\n'
rm -rf "$ARTIFACT_DIR/dist/public"
mkdir -p "$ARTIFACT_DIR/dist"
cp -R "$REPO_ROOT/dist/public" "$ARTIFACT_DIR/dist/public"

printf '==> Root output: %s\n' "$REPO_ROOT/dist/public"
printf '==> Compatibility output: %s\n' "$ARTIFACT_DIR/dist/public"
