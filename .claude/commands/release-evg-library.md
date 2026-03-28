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

1. **Clean working tree**: `git status --porcelain` must be empty
2. **All changes committed and pushed**: no uncommitted or unpushed changes
3. **Branch check**: `git branch --show-current` — must be either `master` or a release branch (e.g., `build_*`, `release_*`)

If checks 1-2 fail — STOP and report the issue. Do not proceed.

## Release Steps

### Step 1: Run tests

```bash
npm test
```

If tests fail — STOP. Do not proceed with release.

### Step 2: Bump version (if needed)

Based on $ARGUMENTS (default: `patch`):

```bash
npm version <patch|minor|major> --no-git-tag-version
```

Read the new version from package.json after bump. If the version has already been bumped (user confirms), skip this step.

### Step 3: Commit version bump

If version was bumped in Step 2:

```bash
git add package.json package-lock.json
git commit -m "Bump version to <new-version>"
```

### Step 4: Create and switch to publish branch

Branch naming follows existing convention: `publish-<major>.<minor>.<build>`

Where build is the patch number from the version. Example: version 3.1.2 → branch `publish-3.1.2`

- **If on `master`**: create and switch to publish branch:
  ```bash
  git checkout -b publish-<version>
  ```
- **If already on a release branch** (not `master`): skip this step, publish from the current branch.

### Step 5: Build

```bash
npm run build
```

This runs `tsc --declaration` and then the `remove` script which cleans source files.

### Step 6: Post-build cleanup

Remove files that are not needed in the publish branch:

```bash
rm -f src/browser-entry.ts
```

### Step 7: Verify clean package

Check what will be published:

```bash
npm pack --dry-run
```

The package must contain ONLY these top-level entries:
- `repo/` — with only `evg_observable.js` inside
- `src/` — with only `outLib/` inside
- `LICENSE`
- `MIGRATION.md`
- `README.md`
- `package.json`

If any extra files appear (`.claudeignore`, `scripts/`, `*.old.js`, etc.) — update `.npmignore` to exclude them and re-verify.

### Step 8: Publish

```bash
npm publish
```

Wait for confirmation that publish succeeded.

### Step 9: Return to master

```bash
git checkout master
```

### Step 10: Push both branches

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
