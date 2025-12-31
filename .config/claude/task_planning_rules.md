# Global Task Planning and Documentation Rules

> **CRITICAL**: These rules apply to ALL projects and ALL chat sessions.

## 📋 Core Principles

### 1. Self-Contained Snapshot Rule (CRITICAL)

**Every implementation_plan_v{N}.md MUST be self-contained:**
- Include COMPLETE content for ALL core sections
- Do NOT rely on previous versions to reconstruct essential information
- Reader and AI get full context from current plan alone
- NO file-hopping required to understand the plan

### 2. Developer-Focused Content (CRITICAL)

**Plans are ONLY for development work:**
- ✅ Code discovery and implementation
- ✅ Unit tests and integration tests
- ✅ Technical acceptance criteria
- ✅ Code examples and patterns
- ❌ QA testing, deployment, monitoring
- ❌ Manual testing procedures
- ❌ Rollout/rollback operations
- ❌ Team coordination and stakeholder communication

**Content Quality:**
- Information must be objective and directly relevant to development
- Avoid repetition - each piece of information mentioned once
- Use bullet points for clarity
- Include code examples where helpful
- No artificial word limits - include ALL necessary information for implementation
- Be concise but complete - developer should understand exactly what to code

### 3. Location and Structure

**All task docs in:** `tmp/{TASK-ID}/` at project root
- Not committed to git (add `tmp/` to `.gitignore`)
- Two files: `start_here.md` (navigation) + `implementation_plan_v{N}.md` (versioned plans)

---

## 📄 File Templates

### Template: start_here.md

```markdown
# {JIRA-ID}: {Task Title}

**Created:** {YYYY-MM-DD}
**Last Updated:** {YYYY-MM-DD}

> 📍 START HERE — Project Documentation Navigation
>
> AI Editing Protocol:
> 1) Read ONLY the current plan linked below.
> 2) The current plan is SELF-CONTAINED. Do NOT fetch older versions to reconstruct essentials.
> 3) Include ALL necessary information for development - code, tests, technical details.
> 4) Focus ONLY on developer work - no QA, deployment, monitoring, or operations.
> 5) Be objective and concise - avoid repetition, include only essential information.

---

## 🎯 Task Summary (2-3 sentences)
{Brief description}

**Current estimate:** {N} working days
**Current scope:** {What's included}
**Status:** {Ready to start / In progress / Completed}

---

## 📚 Current Plan

### ✅ [implementation_plan_v{N}.md](./implementation_plan_v{N}.md)
**CURRENT PLAN (Self‑Contained Snapshot)** — {Version description}
- **Created:** {YYYY-MM-DD}
- **Scope:** {What's included}
- **Excluded:** {What's postponed}
- **Estimate:** {N} working days
- **Change Type:** {Minor | Major}

---

## 📋 Version History

| Version | File | Created | Status | Scope | Estimate | Change Type | Reason |
|---------|------|---------|--------|-------|----------|-------------|--------|
| v{N} | implementation_plan_v{N}.md | {YYYY-MM-DD} | ✅ Current | {scope} | {N} days | {Minor/Major} | {Why this version} |
| v{N-1} | implementation_plan_v{N-1}.md | {YYYY-MM-DD} | 📖 Archived | {scope} | {N} days | {Minor/Major} | {Why changed} |

> Keep last 3–4 versions; move older to archive/

---

## 🔗 Links
- JIRA: [...]
- Design: [...]
- Related: [...]
```

---

### Template: implementation_plan_v{N}.md

```markdown
# {JIRA-ID}: Implementation Plan v{N}
## {Task Title} — {Short version label}

**Created:** {YYYY-MM-DD}
**Last Updated:** {YYYY-MM-DD}
**Version:** v{N}
**Status:** {✅ CURRENT / ⚠️ OUTDATED}

> {STATUS BANNER - see below}

---

> Single-Source Snapshot (STRICT):
> - This file MUST be self-contained: include ALL necessary development information.
> - Do NOT rely on previous versions to reconstruct essential information.
> - You MAY include a short "Diff Summary vs v{N-1}" below, but the rest must stand alone.
> - Focus ONLY on developer work: code discovery, implementation, unit tests, integration tests.
> - NO artificial word limits - include everything needed for development.
> - Be objective and concise - avoid repetition.

## Diff Summary vs v{N-1} (3–6 bullets, skip for v1)
- Scope: {added/removed/unchanged}
- Acceptance Criteria: {changes}
- Estimate: {changed/unchanged} ({N} days)
- Risks: {new/removed/unchanged}
- Dependencies: {new/removed/unchanged}

---

## Summary
{Concise technical description of the task}

## Scope (In / Out)
- In (what developer implements):
  - Code discovery
  - Implementation logic
  - Unit tests
  - Integration tests
  - ...
- Out (not developer work):
  - QA testing
  - Deployment
  - Monitoring setup
  - Manual testing procedures
  - ...

## Acceptance Criteria (technical only)
- [ ] Code discovery completed
- [ ] Implementation follows project patterns
- [ ] Unit tests cover success/failure cases
- [ ] Integration tests verify end-to-end flow
- [ ] ...

## Estimate
- {N} working days (development only); breakdown: [...]

## Risks & Mitigations (technical only)
- Risk: ... → Mitigation: ...

## Dependencies (code only)
- Internal packages: ...
- External libraries: ...
- Test dependencies: ...

## Test Plan
- Unit Tests: {test cases with examples}
- Integration Tests: {test scenarios with examples}

## Implementation Details
- Step 1: Discovery (search patterns, exit criteria)
- Step 2: Implementation (code examples)
- Step 3: Unit tests (code examples)
- Step 4: Integration tests (code examples)

## Links
- JIRA: [...]
- Design: [...]
- Related: [...]
```

**Status Banners:**

For CURRENT version:
```markdown
> ✅ **CURRENT DOCUMENT** — Contains the actual implementation plan
>
> 📖 **History:** See [implementation_plan_v{N-1}.md](./implementation_plan_v{N-1}.md)
> 🏠 **Navigation:** See [start_here.md](./start_here.md)
```

For OUTDATED version:
```markdown
> ⚠️ **THIS FILE IS OUTDATED** — Requirements changed on {YYYY-MM-DD}
>
> 📋 **CURRENT PLAN:** See [implementation_plan_v{N+1}.md](./implementation_plan_v{N+1}.md)
> 📖 **Reason:** {Why this version became outdated}
> 🏠 **Navigation:** See [start_here.md](./start_here.md)
```

---

## 🔄 Workflows

### Workflow 1: Initial Task Analysis

**User says:** "Analyze task JIRA-XXX" / "Create plan for JIRA-XXX"

**Actions:**
1. Create folder: `mkdir -p tmp/{JIRA-ID}`
2. Fetch task details from JIRA
3. Create `start_here.md` with current date, brief description, link to v1
4. Create `implementation_plan_v1.md` with Status: ✅ CURRENT, all sections filled
5. Inform user documentation is ready

---

### Workflow 2: Continue Working

**User says:** "Continue task JIRA-XXX" / "Resume JIRA-XXX"

**Actions:**
1. Read `tmp/{JIRA-ID}/start_here.md` for context and current version
2. Read ONLY current `implementation_plan_v{N}.md` (it's self-contained)
3. Continue work based on current plan

**DO NOT:** Read all versions sequentially or skip start_here.md

---

### Workflow 3: Requirements Changed

**User says:** "Requirements changed" / "Let's update the plan"

**Actions:**
1. Read current `implementation_plan_v{N}.md`
2. Update v{N} header: Status: ⚠️ OUTDATED, add reason and link to v{N+1}
3. Create `implementation_plan_v{N+1}.md` with:
   - Status: ✅ CURRENT
   - Diff Summary showing changes
   - ALL sections complete (self-contained)
4. Update `start_here.md`: change current plan link, add v{N+1} to version table

---

### Workflow 4: Context Lost (New Chat)

**User says:** "What's the status of JIRA-XXX?" / "Continue JIRA-XXX"

**Actions:**
1. Check if `tmp/{JIRA-ID}/` exists
2. If exists: Read `start_here.md`, identify current version, read current plan, summarize to user
3. If NOT exists: Offer to create documentation

---

## ❌ Anti-Patterns (NEVER DO THIS)

### Don't rely on previous versions
```markdown
# ❌ WRONG
## Scope
See v1 for scope details.

# ✅ CORRECT
## Scope
- In: Feature A, Feature B, Feature C
- Out: Performance optimization, Mobile support
```

### Don't include non-development work
```markdown
# ❌ WRONG: Including QA, deployment, monitoring
## Scope
- In:
  - Implementation
  - Unit tests
  - QA testing checklist
  - Deployment to DEV/STAGE/PROD
  - Monitoring setup
  - Manual testing procedures

# ✅ CORRECT: Only development work
## Scope
- In (developer work):
  - Code discovery and implementation
  - Unit tests (success, failure, edge cases)
  - Integration tests (end-to-end flow)
- Out (not developer work):
  - QA testing
  - Deployment
  - Monitoring setup
  - Manual testing procedures
```

### Don't repeat information
```markdown
# ❌ WRONG: Repetitive content
## Implementation Details
Step 1: Find StackCommerce integration code
Step 2: Add tag setting logic
Step 3: Write tests

## Test Plan
- Unit tests for tag setting
- Integration tests for tag setting

## Acceptance Criteria
- [ ] Tags set correctly
- [ ] Tests written for tag setting

# ✅ CORRECT: Each detail mentioned once
## Implementation Details
Step 1: Discovery - find StackCommerce code (search patterns: grep -r "stackcommerce")
Step 2: Implementation - add idempotent tag setting (code example)
Step 3: Unit tests - TestSetTagsSuccess, TestSetTagsIdempotency (code examples)
Step 4: Integration tests - TestFullFlow with DB verification (code example)

## Acceptance Criteria
- [ ] Code discovery completed with documented location
- [ ] Implementation follows idempotency pattern
- [ ] Unit tests cover success + failure + edge cases
- [ ] Integration tests verify DB persistence
```

### Don't create files outside tmp/{TASK-ID}/
```bash
# ❌ WRONG
/tmp/implementation_analysis.md
docs/plan.md

# ✅ CORRECT
tmp/PROJ-123/start_here.md
tmp/PROJ-123/implementation_plan_v1.md
```

### Don't use arbitrary file names
```bash
# ❌ WRONG
current_plan.md, my_plan.md, CURRENT_PLAN.md

# ✅ CORRECT
start_here.md, implementation_plan_v1.md, implementation_plan_v2.md
```

---

## ✅ Commitments

**I WILL:**
- ✅ Create task folder first: `tmp/{TASK-ID}`
- ✅ Make plans self-contained (no relying on previous versions)
- ✅ Focus ONLY on developer work (code + tests)
- ✅ Include ALL necessary information for implementation (no word limits)
- ✅ Be objective and concise - avoid repetition
- ✅ Include code examples where helpful
- ✅ Always read start_here.md first when continuing
- ✅ Mark old versions OUTDATED before creating new ones
- ✅ Add "Diff Summary" (when v2+)
- ✅ Use ISO 8601 dates (YYYY-MM-DD)

**I WILL NOT:**
- ❌ Cut core sections or reference previous versions
- ❌ Include QA testing, deployment, monitoring, or operations work
- ❌ Add repetitive information (mention each detail once)
- ❌ Add verbose paragraphs (use bullets and code examples)
- ❌ Impose artificial word limits (include everything needed for development)
- ❌ Skip reading start_here.md
- ❌ Forget dates in headers
- ❌ Omit AI Editing Protocol from start_here.md

---

## 🔄 Quick Reference

**Create new task docs:**
```
1. mkdir tmp/{TASK-ID}
2. Create start_here.md (with date)
3. Create implementation_plan_v1.md (self-contained, developer-focused, ALL necessary info)
```

**Continue existing task:**
```
1. Read tmp/{TASK-ID}/start_here.md
2. Find current version (v{N})
3. Read implementation_plan_v{N}.md
4. Continue work
```

**Update requirements:**
```
1. Mark v{N} as OUTDATED (date + reason)
2. Create v{N+1} with CURRENT status (self-contained)
3. Update start_here.md (date + version table)
```

---

**Version:** 3.0
**Created:** 2025-10-16
**Last Updated:** 2025-10-17
**Changelog:**
- v3.0 (2025-10-17): Removed artificial word limits, refocused on developer work only (code + tests), emphasized objective and concise content without repetition
- v2.0 (2025-10-16): Added self-contained snapshot rule and token cost control
- v1.0: Initial version

**Location:** Global rules apply to ALL projects and ALL chat sessions.