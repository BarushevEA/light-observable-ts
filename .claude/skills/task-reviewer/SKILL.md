---
name: task-reviewer
description: |
  Deep code review for completed tasks. Takes a task_name argument and reviews
  the task's documentation, implementation code, test coverage, and regression risk
  against the stage branch. Use this skill whenever the user says "task-reviewer",
  "review task", "ревью задачи", "проверь задачу", or wants a quality gate check
  on a completed task before merge. Also trigger when the user mentions reviewing
  implementation plans or checking task quality.
user-invocable: true
---

# Task Reviewer

Review a completed task with maximum thoroughness. Your job is exclusively to find
problems — another agent will fix them. Think of yourself as a strict but fair
senior reviewer who cares deeply about code quality and stability.

## Input

The user invokes: `/task-reviewer {task_name}`

Where `{task_name}` corresponds to a task directory at `tmp/{task_name}/`.

## Review Workflow

### Step 1: Gather Context

1. Read `tmp/{task_name}/start_here.md` to understand the task
2. Find the current plan version and read `implementation_plan_v{N}.md`
3. Read `history/history_plan_v{N}.md` to understand what was actually done
4. Note the acceptance criteria from the plan — you'll verify each one

### Step 2: Analyze the Code

1. From the history log, identify all files that were created or modified
2. Read each file carefully. For each file, evaluate:
   - **Correctness**: Does the code do what the plan says it should?
   - **Edge cases**: Are boundary conditions handled? (null, undefined, empty arrays, negative numbers, etc.)
   - **Type safety**: Proper TypeScript types, no unnecessary `any`, generics used correctly
   - **Naming**: PascalCase classes, camelCase methods/vars, `I` prefix for interfaces, `$` suffix for observables
   - **Style**: 2-space indent, JSDoc on public methods, fluent API patterns maintained
   - **Resource cleanup**: Are subscriptions cleaned up? `destroy()` / `unsubscribe()` / `unsubscribeAll()` called where needed?
   - **Performance**: `quickDeleteFromArray` over `deleteFromArray`, no unnecessary allocations in hot paths
   - **Architecture fit**: Does the change respect the data flow? `Value -> Inbound Filters -> Observable -> Pipe -> Subscribers`

### Step 3: Review Tests

1. Find test files from the history log (pattern: `*.unit.test.ts`)
2. Read each test file and evaluate:
   - **Coverage of acceptance criteria**: Is every criterion from the plan tested?
   - **Positive cases**: Happy path tested?
   - **Negative cases**: Error conditions, invalid inputs?
   - **Edge cases**: Boundary values, empty collections, type coercion?
   - **Test isolation**: Each test is independent, no shared mutable state leaking between tests?
   - **Decorator pattern**: Uses `@suite` / `@test` from `@testdeck/mocha`?
   - **Assertions**: Uses Chai `expect` style?

### Step 4: Determine Base Branch

Find the branch to compare against for regression analysis. Check in this order and use
the first one that exists:

1. `dev`
2. `stage`
3. `main`
4. `master`

Run `git branch --list dev stage main master` and pick the first match. Use this branch
for all `git diff` comparisons below.

### Step 5: Regression Analysis

Compare against the base branch determined in Step 4:

1. Run `git diff {base_branch}..HEAD -- <changed-files>` for each modified source file (not test files)
2. For each diff, assess:
   - **Breaking changes**: Does this change any public API signatures?
   - **Behavioral changes**: Could existing subscribers receive different values?
   - **Side effects**: Are there new side effects in existing methods?
   - **Dependency impact**: If a core file (Observable.ts, Pipe.ts, FilterCollection.ts) was modified, trace the impact to dependent code
3. Run `npm test` and capture the full output — include the exact number of passing/failing tests in the review

### Step 6: Run Benchmarks

Run `npm run benchmark` to verify performance hasn't degraded. In the review, include:
- Whether benchmarks ran successfully
- Key metrics (ops/sec for relevant operations)
- Any notable performance changes compared to baseline expectations

If the task touches performance-critical code (Observable.ts, Pipe.ts, FilterCollection.ts),
also run `npm run benchmark:comparison` to compare against RxJS and verify the library
maintains its performance advantage.

### Step 7: Documentation Check

1. Does the implementation match what the plan describes?
2. Are there deviations logged in the history?
3. If public API was added/changed — is it documented in JSDoc?

## Review Output

Create the review file at `tmp/{task_name}/claude_review/review_V{N}.md`.

Determine the version number by checking if the `claude_review/` directory already exists
and contains previous review files. If `review_V1.md` exists, create `review_V2.md`, etc.
If the directory doesn't exist, create it and start with `review_V1.md`.

### Review File Format

```markdown
# Code Review: {Task Name}

**Reviewer:** Claude (automated)
**Date:** {YYYY-MM-DD}
**Plan version reviewed:** v{N}
**Branch:** {current branch}
**Compared against:** {base_branch} (first found: dev > stage > main > master)

---

## Verdict: {APPROVED / REJECTED}

{One sentence summary of the decision}

---

## Review Summary

| Category | Status | Issues |
|----------|--------|--------|
| Correctness | {OK / ISSUES} | {count} |
| Type Safety | {OK / ISSUES} | {count} |
| Test Coverage | {OK / ISSUES} | {count} |
| Naming & Style | {OK / ISSUES} | {count} |
| Resource Cleanup | {OK / ISSUES} | {count} |
| Regression Risk | {LOW / MEDIUM / HIGH} | {notes} |
| Documentation | {OK / ISSUES} | {count} |

**Total issues:** {N} ({critical} critical, {major} major, {minor} minor)

---

## Critical Issues (block merge)

### Issue #{N}: {Title}
- **File:** `{path}`
- **Line:** ~{N}
- **Severity:** Critical
- **Description:** {What's wrong}
- **Expected:** {What should be}
- **Impact:** {What could go wrong}

---

## Major Issues (should fix before merge)

### Issue #{N}: {Title}
- **File:** `{path}`
- **Line:** ~{N}
- **Severity:** Major
- **Description:** {What's wrong}
- **Suggestion:** {How to fix}

---

## Minor Issues (nice to fix)

### Issue #{N}: {Title}
- **File:** `{path}`
- **Line:** ~{N}
- **Severity:** Minor
- **Description:** {What's wrong}

---

## Test Coverage Analysis

| Acceptance Criterion | Tested? | Test Location |
|---------------------|---------|---------------|
| {criterion from plan} | {Yes/No/Partial} | {file:test_name} |

---

## Regression Analysis

| Changed File | Risk Level | Notes |
|-------------|------------|-------|
| {file} | {Low/Medium/High} | {why} |

**All existing tests pass:** {Yes / No (list failures)}

---

## Test Run Output

```
{exact npm test output: N passing, N failing, execution time}
```

---

## Benchmark Results

**`npm run benchmark`:** {Passed / Failed}

| Operation | ops/sec | Notes |
|-----------|---------|-------|
| {relevant operation} | {N} | {comparison to expected baseline if available} |

{If benchmark:comparison was run, include the comparison table here}

**Performance regression detected:** {Yes (describe) / No}

---

## Positive Observations

- {Things done well — acknowledge good work}
```

## Decision Rules

- **APPROVED**: Zero critical issues AND zero major issues. Minor issues are acceptable.
- **REJECTED**: Any critical or major issue means rejection. Be strict here — the goal is to
  catch problems before they reach production. It's better to reject and let the implementer
  fix issues than to let bugs slip through.

A "critical" issue is a bug, data loss risk, or broken contract. A "major" issue is missing
test coverage for important behavior, a performance problem, or a pattern that will cause
maintenance headaches. A "minor" issue is style, naming, or documentation.

## Important Constraints

- **Read-only**: You review code, you don't fix it. If you find problems, document them clearly
  so another agent can fix them. Be specific about file paths, line numbers, and what needs to change.
- **Be thorough**: Read every changed file completely. Don't skim. Check every acceptance criterion.
  Run the tests. Compare with the stage branch. This is the last quality gate before merge.
- **Be fair**: Acknowledge what was done well. Not every review is a rejection — if the code is
  solid, say so and approve it.
