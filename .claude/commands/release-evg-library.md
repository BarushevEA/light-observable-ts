---
name: release-evg-library
description: Full release workflow — test, bump version, create publish branch, build, clean, npm publish, return to master
---

# Release EVG Observable Library

## Arguments

Version bump type from: $ARGUMENTS

- `patch` (default if empty) — 3.0.1 → 3.0.2
- `minor` — 3.0.1 → 3.1.0
- `major` — 3.0.1 → 4.0.0

Usage: `/release-evg-library patch` or `/release-evg-library minor`

## Pre-flight Checks

Before anything else, verify:

1. **On master branch**: `git branch --show-current` must be `master`
2. **Clean working tree**: `git status --porcelain` must be empty
3. **All changes committed and pushed**: no uncommitted or unpushed changes

If any check fails — STOP and report the issue. Do not proceed.

## Release Steps

### Step 1: Run tests

```bash
npm test
```

If tests fail — STOP. Do not proceed with release.

### Step 2: Bump version

Based on $ARGUMENTS (default: `patch`):

```bash
npm version <patch|minor|major> --no-git-tag-version
```

Read the new version from package.json after bump.

### Step 3: Commit version bump to master

```bash
git add package.json package-lock.json
git commit -m "Bump version to <new-version>"
```

### Step 4: Create and switch to publish branch

Branch naming follows existing convention: `publish-<major>.<minor>.<build>`

Where build is the patch number from the version. Example: version 3.1.2 → branch `publish-3.1.2`

```bash
git checkout -b publish-<version>
```

### Step 5: Build

```bash
npm run build
```

This runs `tsc --declaration` (CJS), then `build:esm` (esbuild ESM), then the `remove` script which cleans source files.

### Step 6: Verify clean package

#### 6a. Verify package.json fields

Read `package.json` and confirm these fields are present and correct:

| Field | Expected value |
|-------|---------------|
| `"main"` | `"src/outLib/index.js"` |
| `"module"` | `"src/outLib-esm/index.mjs"` |
| `"types"` | `"src/outLib/index.d.ts"` |
| `"exports"` | Conditional exports with `"import"` and `"require"` subpaths, each with `"types"` and `"default"` |

If any field is missing or incorrect — STOP and fix before publishing.

#### 6b. Verify packed files

```bash
npm pack --dry-run
```

Confirm:
- `src/outLib/index.js` and `src/outLib/index.d.ts` are included (CJS + types)
- `src/outLib-esm/index.mjs` is included (ESM)
- No dev files are included (tests, benchmarks, .claude/, etc. should be excluded by .npmignore)

### Step 7: Publish

```bash
npm publish
```

Wait for confirmation that publish succeeded.

### Step 8: Return to master

```bash
git checkout master
```

### Step 9: Push both branches

Push master (contains version bump in package.json) and the new publish branch:

```bash
git push origin master
git push origin publish-<version>
```

## Summary

After completion, report:
- New version number
- Publish branch name
- npm publish status
- Current branch (should be master)
