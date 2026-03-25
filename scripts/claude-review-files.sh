#!/bin/bash
# scripts/claude-review-files.sh
# Review current branch changes against base branch using Claude headless mode.
# Checks: correctness, types, naming, resource cleanup, regression risk.
#
# Usage:
#   ./scripts/claude-review-files.sh          # auto-detect base branch
#   ./scripts/claude-review-files.sh dev      # explicit base branch

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
DIFF=$(git diff "$BASE"..."$CURRENT" 2>/dev/null)

if [ -z "$DIFF" ]; then
  echo "No changes between '$CURRENT' and '$BASE'. Nothing to review."
  exit 0
fi

echo "Reviewing branch '$CURRENT' against '$BASE'..."
echo ""

claude -p "You are reviewing a code diff for the EVG Observable library.

Base branch: $BASE
Current branch: $CURRENT

Here is the diff:

$DIFF

Review this diff. For each changed file evaluate:
- **Correctness**: Does the code do what it should?
- **Edge cases**: Boundary conditions handled? (null, undefined, empty arrays)
- **Type safety**: Proper TypeScript types, no unnecessary \`any\`
- **Naming**: PascalCase classes, camelCase methods, \`I\` prefix for interfaces, \`\$\` suffix for observables
- **Style**: 2-space indent, JSDoc on public methods
- **Resource cleanup**: Are subscriptions cleaned up? destroy()/unsubscribe() where needed?
- **Regression risk**: Could this break existing behavior?

Output a table of issues found with severity (critical/major/minor), file, line, and description.
If no issues found, say so. Be specific and concise." \
  --print \
  --max-turns 5
