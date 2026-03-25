#!/bin/bash
# scripts/claude-pr-prep.sh
# Run tests and generate a PR description for the current branch.
#
# Usage:
#   ./scripts/claude-pr-prep.sh          # auto-detect base branch
#   ./scripts/claude-pr-prep.sh dev      # explicit base branch

set -e

# Determine base branch
if [ -n "$1" ]; then
  BASE="$1"
else
  for branch in dev stage main master; do
    if git rev-parse --verify "$branch" >/dev/null 2>&1; then
      BASE="$branch"
      break
    fi
  done
fi

if [ -z "$BASE" ]; then
  echo "Error: no base branch found (tried: dev, stage, main, master)"
  exit 1
fi

CURRENT=$(git branch --show-current)

echo "Preparing branch '$CURRENT' for PR into '$BASE'..."
echo ""

# Run tests
echo "=== Running tests ==="
TEST_OUTPUT=$(npm test 2>&1) || true
echo "$TEST_OUTPUT" | tail -5
echo ""

# Get commit log
COMMITS=$(git log "$BASE".."$CURRENT" --oneline 2>/dev/null)

if [ -z "$COMMITS" ]; then
  echo "No commits between '$CURRENT' and '$BASE'. Nothing to prepare."
  exit 0
fi

# Generate PR description
echo "=== Generating PR description ==="
echo ""

claude -p "Generate a pull request description for the EVG Observable library.

Branch: $CURRENT -> $BASE

Commits:
$COMMITS

Test results (last 5 lines):
$(echo "$TEST_OUTPUT" | tail -5)

Write a PR description in this format:
## Summary
<2-4 bullet points describing what changed and why>

## Changes
<list of key changes grouped by category>

## Test plan
<what was tested, test results summary>

Be concise and specific to this library." \
  --print \
  --max-turns 3
