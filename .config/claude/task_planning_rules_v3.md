# Task Planning Rules v3 (Lightweight)

> Adapted version for small projects without JIRA.

---

## When to Create New Plan Version v{N+1}

| Trigger | Action |
|---------|--------|
| Code **REVERTED** | → Create v{N+1} |
| **Library/approach** change | → Create v{N+1} |
| **Architectural** change | → Create v{N+1} |
| Approach **didn't work** | → Create v{N+1} |

**DO NOT use "phases" inside one plan** — each new approach = new version.

---

## Folder Structure

```
tmp/
├── active_tasks.md               # Active tasks index (read first!)
└── {task-name}/
    ├── start_here.md             # Navigation + status
    ├── implementation_plan_v1.md # Plan v1
    ├── implementation_plan_v2.md # Plan v2 (if needed)
    └── history/
        ├── history_v1.md         # Execution log v1
        └── history_v2.md         # Execution log v2
```

**Task name**: meaningful, e.g. `optimize-array-deletion`, `add-throttle-operator`.

**IMPORTANT:** When creating/completing a task — update `tmp/active_tasks.md`!

---

## Templates

### start_here.md

```markdown
# {Task Name}

**Created:** {YYYY-MM-DD}
**Status:** {In Progress / Completed}

---

## Goal (1-2 sentences)
{What needs to be done}

---

## Current Plan

### ✅ [implementation_plan_v{N}.md](./implementation_plan_v{N}.md)
- **Approach:** {Brief description}
- **Estimate:** {N} hours
- **History:** [history/history_v{N}.md](./history/history_v{N}.md)

---

## Version History

| Version | Approach | Status | Reason for change |
|---------|----------|--------|-------------------|
| v2 | {approach} | ✅ Current | — |
| v1 | {approach} | ❌ Rejected | {why didn't work} |
```

---

### implementation_plan_v{N}.md

```markdown
# {Task Name}: Plan v{N}

**Created:** {YYYY-MM-DD}
**Status:** {✅ CURRENT / ❌ REJECTED}
**History:** [history/history_v{N}.md](./history/history_v{N}.md)

---

## Approach
{Description of what and how}

## Why This Approach
{Rationale for choice}

## Steps
1. {Step 1}
2. {Step 2}
3. {Step 3}

## Success Criteria
- [ ] {Criterion 1}
- [ ] {Criterion 2}

## Estimate
{N} hours

## Risks
- {Risk}: {Mitigation}

## Code/Examples (if needed)
```typescript
// Implementation example
```
```

**Banner for REJECTED version:**
```markdown
> ❌ **REJECTED** — {reason}
>
> ➡️ **Current plan:** [implementation_plan_v{N+1}.md](./implementation_plan_v{N+1}.md)
```

---

### history/history_v{N}.md

```markdown
# History: Plan v{N}

**Plan:** [../implementation_plan_v{N}.md](../implementation_plan_v{N}.md)
**Started:** {YYYY-MM-DD HH:MM}
**Completed:** {YYYY-MM-DD HH:MM}
**Result:** {✅ Success / ❌ Rejected}
**Time spent:** {N} hours

---

## Execution Log

| Time | Action | File | Description |
|------|--------|------|-------------|
| {HH:MM} | create | src/file.ts | Created file with implementation |
| {HH:MM} | modify | src/file.ts | Added method X |
| {HH:MM} | test | — | Ran benchmark: +15% |
| {HH:MM} | fix | src/file.ts | Fixed bug Y |

---

## Benchmark Results (if applicable)

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| ops/sec | 1M | 1.5M | +50% |

---

## Problems and Solutions

### Problem 1: {description}
- **Cause:** {why it occurred}
- **Solution:** {what was done}

---

## Conclusions

- ✅ What worked: ...
- ❌ What didn't work: ...
- 💡 For future: ...
```

---

## Workflow

### New Task

```
1. mkdir -p tmp/{task-name}/history
2. Create start_here.md
3. Create implementation_plan_v1.md
4. Create history/history_v1.md (empty log)
5. Update tmp/active_tasks.md — add task
6. Start work
```

### Continue Task

```
1. Read tmp/active_tasks.md — list of active tasks
2. Open tmp/{task-name}/start_here.md
3. Go to current plan
4. Check history — what's already done
5. Continue work
6. Update history after each logical action
```

### Complete Task

```
1. Finalize history — results, conclusions
2. Update tmp/active_tasks.md — move to "Completed"
```

### Approach Didn't Work

```
1. In history_v{N}.md record result and rejection reason
2. In implementation_plan_v{N}.md add banner ❌ REJECTED
3. Create implementation_plan_v{N+1}.md with new approach
4. Create history/history_v{N+1}.md
5. Update start_here.md — new current version
```

---

## What to Log in History

**Log:**
- ✅ File created/modified
- ✅ Test written/passed
- ✅ Benchmark run (with result)
- ✅ Bug found/fixed
- ✅ Decision made (with rationale)

**DO NOT log:**
- ❌ Every line of code
- ❌ Intermediate debugging states
- ❌ Obvious actions

---

## Example: Optimizing deleteFromArray

```
tmp/optimize-array-deletion/
├── start_here.md
├── implementation_plan_v1.md  # Approach: Map instead of Array
├── implementation_plan_v2.md  # Approach: index caching
├── implementation_plan_v3.md  # Approach: quickDeleteFromArray ✅
└── history/
    ├── history_v1.md          # Result: -5%, rejected
    ├── history_v2.md          # Result: overhead, rejected
    └── history_v3.md          # Result: +15%, accepted
```

**start_here.md** shows:
- v1: Map → rejected (worse performance)
- v2: Caching → rejected (overhead > benefit)
- v3: quickDeleteFromArray → ✅ current (+15% on large arrays)

---

**Version:** 3.0
**Created:** 2025-12-31
**Based on:** task_planning_rules_v2.md
**Changes:**
- Removed JIRA references
- Removed QA/deployment/monitoring sections
- Simplified templates
- Added practical example
- Added active_tasks.md index
