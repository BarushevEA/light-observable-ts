#!/bin/bash
# scripts/claude-full-check.sh
# Full pre-PR pipeline: review code, then prepare PR description.
# Runs claude-review-files.sh first, then claude-pr-prep.sh.
#
# Usage:
#   ./scripts/claude-full-check.sh          # auto-detect base branch
#   ./scripts/claude-full-check.sh dev      # explicit base branch

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BASE="${1:-}"

echo "========================================="
echo "  Step 1/2: Code Review"
echo "========================================="
echo ""

"$SCRIPT_DIR/claude-review-files.sh" $BASE

echo ""
echo "========================================="
echo "  Step 2/2: PR Preparation"
echo "========================================="
echo ""

"$SCRIPT_DIR/claude-pr-prep.sh" $BASE

echo ""
echo "========================================="
echo "  Done. Review the output above."
echo "========================================="
