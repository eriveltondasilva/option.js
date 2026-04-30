#!/usr/bin/env bash
set -euo pipefail

git checkout main && git pull origin main --quiet
git push origin --tags

echo "✅ Tag publicada! O GitHub Actions irá publicar no NPM."
