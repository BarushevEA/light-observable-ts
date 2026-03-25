# Automation Scripts

Scripts for automated code review and PR preparation using Claude Code in headless mode.

## Prerequisites

- Claude Code CLI installed (`npm install -g @anthropic-ai/claude-code`)
- Authenticated Claude session (API key or OAuth)
- Git repository with at least one base branch (`dev`, `stage`, `main`, or `master`)

## Scripts

### claude-review-files.sh

Code review of current branch changes against a base branch.

**What it checks:**
- Correctness and edge cases
- TypeScript type safety
- Naming conventions (PascalCase, camelCase, `I` prefix, `$` suffix)
- Code style (2-space indent, JSDoc)
- Resource cleanup (destroy/unsubscribe)
- Regression risk

**When to use:** After finishing implementation, before creating a PR. Helps catch problems early.

```bash
./scripts/claude-review-files.sh          # auto-detect base branch
./scripts/claude-review-files.sh dev      # review against dev
```

---

### claude-pr-prep.sh

Runs tests and generates a PR description from commit history and test results.

**What it does:**
1. Runs `npm test` and captures results
2. Collects commit log between current and base branch
3. Generates a structured PR description (Summary, Changes, Test plan)

**When to use:** When the branch is ready for PR and you need a description.

```bash
./scripts/claude-pr-prep.sh              # auto-detect base branch
./scripts/claude-pr-prep.sh dev          # prepare PR against dev
```

---

### claude-full-check.sh

Full pre-PR pipeline: runs review first, then PR preparation.

**What it does:**
1. Runs `claude-review-files.sh` — review code for issues
2. Runs `claude-pr-prep.sh` — run tests and generate PR description

**When to use:** Complete quality check before creating a PR. One command instead of two.

```bash
./scripts/claude-full-check.sh           # auto-detect base branch
./scripts/claude-full-check.sh dev       # full check against dev
```

## Base Branch Detection

All scripts auto-detect the base branch in this order: `dev` → `stage` → `main` → `master`. The first existing branch is used. You can override by passing the branch name as an argument.
