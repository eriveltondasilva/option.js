#!/usr/bin/env bash
set -euo pipefail

BUMP="${1:-patch}"

git checkout main && git pull origin main --quiet

VERSION=$(npm version "$BUMP" --no-push)
git checkout -b "release/$VERSION"
git push origin HEAD --quiet

gh pr create --fill --base main

echo ""
echo "✅ PR aberto! Após o merge rode: bun run tag"
