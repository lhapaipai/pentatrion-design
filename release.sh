#!/usr/bin/env bash
# Walks through the release steps, each one optional/confirmable.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"

confirm() {
  read -rp "$1 [Y/n] " answer
  [[ ! "$answer" =~ ^[nN]$ ]]
}

current_branch=$(git branch --show-current)
if [[ "$current_branch" != "main" ]]; then
  echo "Error: you are on branch '$current_branch', this script must be run from 'main'." >&2
  exit 1
fi

# 1. Bump version + changelog from accumulated changesets
if confirm "Run 'npx changeset version' (bump package.json + CHANGELOG.md)?"; then
  npx changeset version
fi

version=$(grep -m1 '"version"' package.json | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')
echo "Version: $version"

if git rev-parse "v$version" >/dev/null 2>&1 || git ls-remote --exit-code --tags origin "v$version" >/dev/null 2>&1; then
  echo "Error: tag v$version already exists — this version was already released." >&2
  exit 1
fi

# 2. Commit the bump
if confirm "Commit \"chore: release v$version\"?"; then
  git add -A
  git commit -m "chore: release v$version"
fi

# 3. Push the commit
# (the vX.Y.Z tag itself is created by the publish workflow, once the
# release is actually merged and published — see .github/workflows/publish.yml)
if confirm "Push commit?"; then
  git push
fi
