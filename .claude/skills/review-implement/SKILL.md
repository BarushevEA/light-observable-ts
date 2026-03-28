---
name: review-implement
description: |
  Apply review fixes for a completed task. Takes a task_name argument, finds the
  latest code review in tmp/{task_name}/claude_review/, reads the issues, and
  fixes them in the codebase. Use this skill whenever the user says "review-implement",
  "примени ревью", "исправь замечания", "fix review", or wants to apply fixes from
  a code review. Also trigger when the user mentions a task review file and asks
  to fix or apply the findings.
user-invocable: true
---

# Review Implement

Read the latest code review for a task and fix every actionable issue. If an issue
is already fixed or not valid, explain why instead of making changes.

## Input

The user invokes: `/review-implement {task_name}`

Where `{task_name}` corresponds to a task directory at `tmp/{task_name}/`.

## Workflow

### Step 1: Find the Review

1. Check that `tmp/{task_name}/` exists. If not — tell the user the task was not found.
2. Check that `tmp/{task_name}/claude_review/` exists. If not — tell the user:
   **"Задача `{task_name}` ещё не проходила ревью."** and stop.
3. Inside `claude_review/`, find the latest review file by version number
   (e.g., `review_V2.md` is newer than `review_V1.md`). Use glob pattern
   `review_V*.md` and pick the highest number.
4. Read the review file completely.

### Step 2: Understand the Task Context

1. Read `tmp/{task_name}/start_here.md` — get the task summary and current plan version.
2. Read the current `implementation_plan_v{N}.md` — understand what was implemented.
3. Read the history log `history/history_plan_v{N}.md` — see what was actually done.

This context is essential — you need to understand the intent behind the code to
judge whether review issues are valid and to fix them correctly.

### Step 3: Classify Each Issue

For every issue in the review (Critical, Major, Minor), determine its status:

| Status | Meaning | Action |
|--------|---------|--------|
| **Actionable** | Issue is valid and not yet fixed | Fix it |
| **Already Fixed** | Code already addresses the concern | Report as resolved |
| **Not Valid** | Issue is based on misunderstanding or is not applicable | Explain why |
| **Out of Scope** | Fix would require changes beyond this task's scope | Report and skip |

### Step 4: Fix Actionable Issues

For each actionable issue:

1. Read the relevant source file(s) mentioned in the review.
2. Apply the fix using the Edit tool — minimal, targeted changes.
3. If the fix touches types or logic, run `npx tsc --noEmit` to verify compilation.

Important: do NOT use `npm run build` — it deletes source files as part of
publish prep. Use `npx tsc --noEmit` for compilation checks.

After all fixes are applied, run `npm test` to verify nothing broke.

### Step 5: Report

Output a summary table:

```
## Результат применения ревью: {task_name}

**Ревью:** claude_review/review_V{N}.md
**Вердикт ревью:** {verdict from review}

| # | Issue | Severity | Status | Action Taken |
|---|-------|----------|--------|--------------|
| 1 | {description} | {severity} | ✅ Fixed / ⏭ Already Fixed / ❌ Not Valid / 🔄 Out of Scope | {what was done or why skipped} |

**Tests:** {N} passing, {N} failing
```

If all tests pass and all issues are resolved, the task is ready.

## Rules

- Never silently skip an issue — every issue from the review must appear in the report.
- Prefer minimal fixes — don't refactor surrounding code while fixing a review issue.
- If fixing one issue would break another, explain the conflict and ask the user.
- Always verify with `npm test` after applying fixes.
- Communicate in Russian — the user prefers Russian for all interaction.
