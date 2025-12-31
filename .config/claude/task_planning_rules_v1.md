# Global Task Planning and Documentation Rules v1

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

### 3. History Tracking (NEW - CRITICAL)

**Every plan MUST have accompanying history log:**
- History logs track ACTUAL implementation progress
- **TODO Progress section** at the top provides high-level task status
- **Implementation Log** tracks every logical action (create/modify/fix)
- Update history IMMEDIATELY after completing each logical action
- Provides audit trail for post-mortem analysis
- Shows time spent, bugs found, deviations from plan
- Enables visibility into real vs planned progress

### 4. Location and Structure

**All task docs in:** `tmp/{TASK-ID}/` at project root
- Not committed to git (add `tmp/` to `.gitignore`)
- Files:
  - `start_here.md` (navigation)
  - `implementation_plan_v{N}.md` (versioned plans - WHAT to do)
  - `history/` folder (implementation logs - WHAT was done)
    - `history_plan_v{N}.md` (execution log for each plan version)

**Directory structure:**
```
tmp/{TASK-ID}/
├── start_here.md                       # Navigation hub
├── implementation_plan_v1.md           # Plan v1 (WHAT to do)
├── implementation_plan_v2.md           # Plan v2 (WHAT to do)
├── implementation_plan_v3.md           # Plan v3 (WHAT to do)
└── history/
    ├── history_plan_v1.md              # Execution log for v1
    ├── history_plan_v2.md              # Execution log for v2
    └── history_plan_v3.md              # Execution log for v3
```

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
> 6) Update history log IMMEDIATELY after each logical action (create/modify/fix).

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
- **History Log:** [history/history_plan_v{N}.md](./history/history_plan_v{N}.md)

---

## 📋 Version History

| Version | File | History | Created | Status | Scope | Estimate | Change Type | Reason |
|---------|------|---------|---------|--------|-------|----------|-------------|--------|
| v{N} | implementation_plan_v{N}.md | history/history_plan_v{N}.md | {YYYY-MM-DD} | ✅ Current | {scope} | {N} days | {Minor/Major} | {Why this version} |
| v{N-1} | implementation_plan_v{N-1}.md | history/history_plan_v{N-1}.md | {YYYY-MM-DD} | 📖 Archived | {scope} | {N} days | {Minor/Major} | {Why changed} |

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

**History Log:** [history/history_plan_v{N}.md](./history/history_plan_v{N}.md)

> {STATUS BANNER - see below}

---

> Single-Source Snapshot (STRICT):
> - This file MUST be self-contained: include ALL necessary development information.
> - Do NOT rely on previous versions to reconstruct essential information.
> - You MAY include a short "Diff Summary vs v{N-1}" below, but the rest must stand alone.
> - Focus ONLY on developer work: code discovery, implementation, unit tests, integration tests.
> - NO artificial word limits - include everything needed for development.
> - Be objective and concise - avoid repetition.
> - Update history log IMMEDIATELY after each logical action.

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

## History Tracking (CRITICAL)

**MANDATORY: Update history log AFTER EACH logical block of work:**

**What is a "logical block" (завершённая единица работы):**
- ✅ File created with initial implementation
- ✅ Struct/interface defined (with all its fields)
- ✅ Function/method implemented (complete and working)
- ✅ Test written (complete test case)
- ✅ Bug fixed (problem identified and resolved)
- ✅ Refactoring completed (code improved and working)

**What is NOT a logical block (don't log these):**
- ❌ Each line of code while writing a function
- ❌ Each field while defining a struct
- ❌ Each step while debugging (log only when bug is FIXED)
- ❌ Intermediate states during refactoring

**Update procedure:**
1. Complete logical block of work (file/struct/function/test/fix is DONE)
2. IMMEDIATELY open `history/history_plan_v{N}.md`
3. Add ONE row describing what was completed
4. Continue with next logical block

**Examples:**

✅ **CORRECT** - Log completed units:
```
| 01.11.2025 14:30 | создание | internal/module/models.go | User struct | Создана структура User с полями ID, Name, Email, CreatedAt |
| 01.11.2025 15:00 | создание | internal/module/service.go | CreateUser() | Метод создания пользователя с валидацией и сохранением в БД |
| 01.11.2025 16:00 | исправление | cmd/workers/main.go | Database init | БАГ: изменена БД с CoursesDB на MainDB (1 строка) |
```

❌ **WRONG** - Too granular:
```
| 01.11.2025 14:00 | создание | internal/module/models.go | User struct | Написано название структуры |
| 01.11.2025 14:05 | создание | internal/module/models.go | User struct | Добавлено поле ID |
| 01.11.2025 14:10 | создание | internal/module/models.go | User struct | Добавлено поле Name |
| 01.11.2025 14:15 | создание | internal/module/models.go | User struct | Добавлено поле Email |
```

**DO NOT:**
- ❌ Log each line while writing code
- ❌ Log intermediate debugging steps (only final fix)
- ❌ Batch multiple DIFFERENT things into one entry
- ❌ Wait until end of day to update history

## Acceptance Criteria (technical only)
- [ ] Code discovery completed
- [ ] Implementation follows project patterns
- [ ] Unit tests cover success/failure cases
- [ ] Integration tests verify end-to-end flow
- [ ] **History log updated after EACH logical block (function/method/struct/file/fix)**
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
> 📊 **History:** [history/history_plan_v{N}.md](./history/history_plan_v{N}.md)
> 📖 **Previous:** [implementation_plan_v{N-1}.md](./implementation_plan_v{N-1}.md)
> 🏠 **Navigation:** [start_here.md](./start_here.md)
```

For OUTDATED version:
```markdown
> ⚠️ **THIS FILE IS OUTDATED** — Requirements changed on {YYYY-MM-DD}
>
> 📋 **CURRENT PLAN:** [implementation_plan_v{N+1}.md](./implementation_plan_v{N+1}.md)
> 📊 **History:** [history/history_plan_v{N}.md](./history/history_plan_v{N}.md)
> 📖 **Reason:** {Why this version became outdated}
> 🏠 **Navigation:** [start_here.md](./start_here.md)
```

---

### Template: history/history_plan_v{N}.md (NEW)

```markdown
# History Log: Implementation Plan v{N}
# {JIRA-ID}: {Task Title}

**Plan:** [../implementation_plan_v{N}.md](../implementation_plan_v{N}.md)
**Started:** {YYYY-MM-DD HH:MM}
**Completed:** {YYYY-MM-DD HH:MM} (for completed tasks)
**Status:** {In Progress / ✅ Completed / ⚠️ Completed with bugs}
**Actual Time:** {X} hours/minutes (for completed tasks)

---

## 📋 TODO Progress

> **Update Rule:** Mark task as ✅ Completed IMMEDIATELY when finished, add time and notes

| # | Task | Status | Time | Notes |
|---|------|--------|------|-------|
| 1 | Discovery: {task name} | ✅ Completed | HH:MM-HH:MM | {Brief notes} |
| 2 | Implementation: {task name} | 🔄 In Progress | HH:MM-... | {Current status} |
| 3 | Testing: {task name} | ⏳ Pending | - | - |
| 4 | Bug fix: {task name} | ✅ Completed | HH:MM-HH:MM | {What was fixed} |

**Progress:** {X}/{Y} tasks completed ({Z}%)

---

## Implementation Log

> **Update Rule:** Add entry IMMEDIATELY after completing each logical action:
> - File created
> - Function/method implemented
> - Test written
> - Bug fixed
> - Refactoring completed

| Дата/Время | Операция | Файл (от корня проекта) | Компонент | Описание |
|------------|----------|-------------------------|-----------|----------|
| {DD.MM.YYYY HH:MM} | создание | internal/module/file.go | FunctionName() | Краткое описание что сделано |
| {DD.MM.YYYY HH:MM} | изменение | internal/module/file.go | FunctionName() | Что изменено и почему |
| {DD.MM.YYYY HH:MM} | исправление | internal/module/file.go | FunctionName() | БАГ: описание проблемы и фикса |
| {DD.MM.YYYY HH:MM} | создание | internal/module/file_test.go | TestFunctionName() | Тест для success case |
| {DD.MM.YYYY HH:MM} | создание | internal/module/file_test.go | TestFunctionNameError() | Тест для error case |

---

## Summary

**Total time spent:** {X} hours
**Files created:** {N}
**Files modified:** {N}
**Tests added:** {N}
**Bugs found:** {N}
**Bugs fixed:** {N}

---

## Bugs & Issues

### Bug #{N}: {Short description}
- **Discovered:** {DD.MM.YYYY HH:MM}
- **Severity:** {Critical / High / Medium / Low}
- **Root Cause:** {Technical explanation}
- **Fix Applied:** {DD.MM.YYYY HH:MM}
- **Fix Description:** {What was done}
- **Related Log Entries:** Row #{X}, #{Y}

---

## Deviations from Plan

| Planned | Actual | Reason | Impact |
|---------|--------|--------|--------|
| Use database X | Used database Y | Database X not available in worker context | +2 hours debugging |
| 3 days estimate | 3.5 days actual | 3 bugs found during testing | +10 hours debugging |

---

## Lessons Learned

- ✅ What worked well: ...
- ❌ What went wrong: ...
- 💡 What to do differently next time: ...
```

**Example History Entry:**

```markdown
## 📋 TODO Progress

| # | Task | Status | Time | Notes |
|---|------|--------|------|-------|
| 1 | Discovery: Find quiz storage | ✅ Completed | 14:00-14:15 | Found in internal/quiz/funnel/storage |
| 2 | Create Temporal workflow | ✅ Completed | 14:15-15:00 | QuizClusterWorkflow.Execute() |
| 3 | Create mapper for Symonenko API | ✅ Completed | 15:00-15:45 | QuizToSymonenkoMapper.Map() |
| 4 | Write unit tests for mapper | ✅ Completed | 15:45-16:45 | 3 tests: success, error, edge cases |
| 5 | Fix database connection bug | ✅ Completed | 17:00-17:30 | БАГ #1: CoursesDB → MainDB |
| 6 | Fix mapper key bug | ✅ Completed | 18:30-19:00 | БАГ #2: questionID → questionKey |
| 7 | Fix Temporal serialization bug | ✅ Completed | 23:00-02:15 | БАГ #3: Added custom UnmarshalJSON |
| 8 | Write serialization tests | ✅ Completed | 02:15-02:30 | Round-trip test |

**Progress:** 8/8 tasks completed (100%)

---

## Implementation Log

| Дата/Время | Операция | Файл (от корня проекта) | Компонент | Описание |
|------------|----------|-------------------------|-----------|----------|
| 29.10.2025 14:00 | создание | internal/quiz/funnel/temporal/workflows/workflow.go | QuizClusterWorkflow.Execute() | Temporal workflow для вызова Symonenko API, обработка quiz_result_id |
| 29.10.2025 15:30 | создание | internal/quiz/funnel/temporal/models/mapper.go | QuizToSymonenkoMapper.Map() | Маппер quiz data → Symonenko payload с обработкой ft* полей |
| 29.10.2025 16:45 | создание | internal/quiz/funnel/temporal/models/mapper_test.go | TestQuizToSymonenkoMapper_Map() | Unit тесты для маппера: success case, known question IDs |
| 31.10.2025 17:15 | исправление | cmd/workers/courses/main.go | Database init | БАГ #1: CoursesDB → MainDB (quiz results not found), изменена одна строка |
| 31.10.2025 18:45 | исправление | internal/quiz/funnel/temporal/models/mapper.go | Map() | БАГ #2: используем questionKey вместо questionID как ключ в map |
| 31.10.2025 23:30 | исправление | internal/quiz/funnel/temporal/models/models.go | SymonenkoRequest | БАГ #3 (попытка #1): изменен JSON tag json:"-" → json:"questions" (НЕ ПОМОГЛО) |
| 01.11.2025 02:15 | создание | internal/quiz/funnel/temporal/models/mapper.go | UnmarshalJSON() | БАГ #3 (попытка #2): добавлен custom UnmarshalJSON для Temporal serialization (УСПЕХ) |
| 01.11.2025 02:30 | создание | internal/quiz/funnel/temporal/models/mapper_test.go | TestSymonenkoRequest_RoundTrip() | Тест на round-trip serialization (marshal → unmarshal) |
```

---

## 🔄 Workflows

### Workflow 1: Initial Task Analysis

**User says:** "Analyze task JIRA-XXX" / "Create plan for JIRA-XXX"

**Actions:**
1. Create folder structure:
   ```bash
   mkdir -p tmp/{JIRA-ID}/history
   ```
2. Fetch task details from JIRA
3. Create `start_here.md` with current date, brief description, link to v1 and history
4. Create `implementation_plan_v1.md` with Status: ✅ CURRENT, link to history, all sections filled
5. Create `history/history_plan_v1.md` with:
   - Header with plan link and started timestamp
   - TODO Progress section with initial tasks from plan (all ⏳ Pending)
   - Empty Implementation Log table (ready for entries)
   - Empty Summary, Bugs, Deviations, Lessons sections
6. Inform user documentation is ready

---

### Workflow 2: Continue Working

**User says:** "Continue task JIRA-XXX" / "Resume JIRA-XXX"

**Actions:**
1. Read `tmp/{JIRA-ID}/start_here.md` for context and current version
2. Read ONLY current `implementation_plan_v{N}.md` (it's self-contained)
3. Read current `history/history_plan_v{N}.md` to see:
   - TODO Progress - which tasks are completed, which are pending
   - Implementation Log - detailed history of what was done
   - Bugs & Issues - known problems
4. Continue work based on current plan and TODO Progress
5. **CRITICAL:** After EACH logical action (file created, function implemented, test written, bug fixed):
   - Open `history/history_plan_v{N}.md`
   - Update TODO Progress if task completed
   - Add new row to Implementation Log table
   - Include: timestamp, operation type, file path from project root, component, description

**DO NOT:**
- Read all versions sequentially or skip start_here.md
- Forget to update TODO Progress and history after completing an action
- Batch history updates - update IMMEDIATELY after each action

---

### Workflow 3: Requirements Changed

**User says:** "Requirements changed" / "Let's update the plan"

**Actions:**
1. Read current `implementation_plan_v{N}.md`
2. Update current history log `history/history_plan_v{N}.md`:
   - Set Status: "Completed" or "Completed with bugs"
   - Fill Summary section with totals
   - Document any bugs found
   - Document deviations from plan
3. Update v{N} header: Status: ⚠️ OUTDATED, add reason and link to v{N+1}
4. Create `implementation_plan_v{N+1}.md` with:
   - Status: ✅ CURRENT
   - Link to new history file
   - Diff Summary showing changes
   - ALL sections complete (self-contained)
5. Create `history/history_plan_v{N+1}.md` with empty log ready for new entries
6. Update `start_here.md`: change current plan link, add v{N+1} to version table with history link

---

### Workflow 4: Context Lost (New Chat)

**User says:** "What's the status of JIRA-XXX?" / "Continue JIRA-XXX"

**Actions:**
1. Check if `tmp/{JIRA-ID}/` exists
2. If exists:
   - Read `start_here.md`, identify current version
   - Read current plan
   - Read current history log to see:
     - TODO Progress: X/Y tasks completed (Z%)
     - Implementation Log: what was actually done
     - Bugs & Issues: known problems
   - Summarize to user:
     - Plan overview
     - TODO Progress (tasks completed vs pending)
     - Time spent
     - Current status (what's next)
3. If NOT exists: Offer to create documentation

---

### Workflow 5: After Each Logical Action (NEW - CRITICAL)

**Triggers:** Just completed:
- File created
- Function/method implemented
- Test written
- Bug fixed
- Refactoring completed
- Task from TODO list completed
- Any other discrete unit of work

**Actions:**
1. Open `history/history_plan_v{N}.md`
2. **Update TODO Progress:**
   - Mark completed task as ✅ Completed
   - Add completion time (HH:MM-HH:MM)
   - Add brief notes if relevant
   - Update progress counter
3. **Add to Implementation Log:**
   ```
   | {DD.MM.YYYY HH:MM} | {операция} | {путь/от/корня/проекта.go} | {Component/Function} | {Краткое описание} |
   ```
4. If it's a bug fix, also add entry to "Bugs & Issues" section
5. **DO NOT** wait to batch updates - update IMMEDIATELY

**Example:**
```markdown
# Just completed a task from TODO list
→ Immediately update TODO Progress:
| 2 | Create Temporal activity for Amplitude | ✅ Completed | 06:15-06:18 | Added SendClusterToAmplitudeActivity |
→ Update progress counter:
**Progress:** 2/10 tasks completed (20%)

# Just created a new function
→ Immediately add to Implementation Log:
| 01.11.2025 14:30 | создание | internal/payments/service/subscription.go | CreateSubscription() | Создание subscription с валидацией user_id и plan_id |

# Just fixed a bug
→ Immediately add to Implementation Log:
| 01.11.2025 16:45 | исправление | internal/payments/service/subscription.go | CreateSubscription() | БАГ: добавлена проверка на nil user, fix для panic |
→ Also update TODO if it was a planned task:
| 9 | Fix nil user panic bug | ✅ Completed | 16:40-16:45 | Added nil check in CreateSubscription |
```

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

### Don't batch history updates (NEW)
```markdown
# ❌ WRONG: Batching multiple actions into one entry
| 01.11.2025 14:00 | создание | internal/module/*.go | Multiple files | Created service, handler, tests |

# ✅ CORRECT: One entry per logical action
| 01.11.2025 14:00 | создание | internal/module/service.go | Service.Create() | Создание service с бизнес-логикой |
| 01.11.2025 14:15 | создание | internal/module/handler.go | Handler.CreateEndpoint() | HTTP handler для create endpoint |
| 01.11.2025 14:30 | создание | internal/module/service_test.go | TestService_Create() | Unit тест для success case |
```

### Don't skip history updates
```markdown
# ❌ WRONG: Implementing multiple features without updating history
(works for 2 hours, implements 5 functions, then updates history once)

# ✅ CORRECT: Update after EACH logical action
(implements function → updates history → implements next function → updates history → ...)
```

### Don't create files outside tmp/{TASK-ID}/
```bash
# ❌ WRONG
/tmp/implementation_analysis.md
docs/plan.md
tmp/history.md  # Wrong location!

# ✅ CORRECT
tmp/PROJ-123/start_here.md
tmp/PROJ-123/implementation_plan_v1.md
tmp/PROJ-123/history/history_plan_v1.md  # Correct location!
```

### Don't use arbitrary file names
```bash
# ❌ WRONG
current_plan.md, my_plan.md, CURRENT_PLAN.md
execution_log.md, work_log.md

# ✅ CORRECT
start_here.md
implementation_plan_v1.md, implementation_plan_v2.md
history/history_plan_v1.md, history/history_plan_v2.md
```

### Don't use relative paths in history (NEW)
```markdown
# ❌ WRONG: Relative or unclear paths
| 01.11.2025 14:00 | создание | mapper.go | Map() | ... |
| 01.11.2025 14:15 | создание | ../../internal/quiz/mapper.go | Map() | ... |

# ✅ CORRECT: Always full path from project root
| 01.11.2025 14:00 | создание | internal/quiz/funnel/temporal/models/mapper.go | QuizToSymonenkoMapper.Map() | ... |
| 01.11.2025 14:15 | создание | cmd/workers/courses/main.go | main() | ... |
```

---

## ✅ Commitments

**I WILL:**
- ✅ Create task folder with history subfolder: `tmp/{TASK-ID}/history/`
- ✅ Make plans self-contained (no relying on previous versions)
- ✅ Focus ONLY on developer work (code + tests)
- ✅ Include ALL necessary information for implementation (no word limits)
- ✅ Be objective and concise - avoid repetition
- ✅ Include code examples where helpful
- ✅ Always read start_here.md first when continuing
- ✅ Mark old versions OUTDATED before creating new ones
- ✅ Add "Diff Summary" (when v2+)
- ✅ Use ISO 8601 dates (YYYY-MM-DD)
- ✅ **Create history log for each plan version**
- ✅ **Update history IMMEDIATELY after each logical action**
- ✅ **Use full paths from project root in history**
- ✅ **Document bugs, deviations, and lessons learned**

**I WILL NOT:**
- ❌ Cut core sections or reference previous versions
- ❌ Include QA testing, deployment, monitoring, or operations work
- ❌ Add repetitive information (mention each detail once)
- ❌ Add verbose paragraphs (use bullets and code examples)
- ❌ Impose artificial word limits (include everything needed for development)
- ❌ Skip reading start_here.md
- ❌ Forget dates in headers
- ❌ Omit AI Editing Protocol from start_here.md
- ❌ **Forget to create history log for new plan version**
- ❌ **Batch history updates - must update after EACH action**
- ❌ **Use relative paths in history log**
- ❌ **Skip documenting bugs or deviations from plan**

---

## 🔄 Quick Reference

**Create new task docs:**
```
1. mkdir -p tmp/{TASK-ID}/history
2. Create start_here.md (with date and history link)
3. Create implementation_plan_v1.md (self-contained, developer-focused, ALL necessary info, history link)
4. Create history/history_plan_v1.md (empty log ready for entries)
```

**Continue existing task:**
```
1. Read tmp/{TASK-ID}/start_here.md
2. Find current version (v{N})
3. Read implementation_plan_v{N}.md
4. Check history/history_plan_v{N}.md to see what's already done
5. Continue work
6. Update history IMMEDIATELY after each action
```

**Update requirements:**
```
1. Finalize current history log (summary, bugs, deviations)
2. Mark v{N} as OUTDATED (date + reason)
3. Create v{N+1} with CURRENT status (self-contained) + history link
4. Create history/history_plan_v{N+1}.md (empty log)
5. Update start_here.md (date + version table with history links)
```

**After completing any logical action:**
```
1. Open history/history_plan_v{N}.md
2. Add row to Implementation Log table:
   - Current timestamp
   - Operation type (создание/изменение/исправление)
   - Full file path from project root
   - Component/function name
   - Brief description
3. If it's a bug fix, also add to "Bugs & Issues" section
```

---

## 📊 Benefits of History Tracking

### Visibility
- See exact time spent on each part of implementation
- Track when bugs were discovered and fixed
- Understand deviations from original plan

### Accountability
- Clear audit trail of all work done
- Evidence for time estimates in future planning
- Documentation for post-mortem analysis

### Learning
- Identify patterns in bugs and issues
- Improve estimation accuracy
- Share lessons learned with team

### Example: PRMV-13183 Case Study

**Without history tracking:**
- Plan says "✅ Completed"
- No visibility into 10-hour debugging session
- No record of 3 critical bugs found
- Can't learn from mistakes

**With history tracking:**
- Clear record: 29.10 implementation → 31.10-01.11 debugging (10 hours)
- All 3 bugs documented with timestamps
- Deviations table shows: planned 3 days → actual 3.5 days
- Lessons learned: "Need round-trip tests for custom JSON serialization"

---

**Version:** 1.0
**Created:** 2025-11-01
**Based on:** task_planning_rules.md v3.0
**Changelog:**
- v1.0 (2025-11-01): Added history tracking system with immediate update requirement, full file paths from project root, bug documentation, deviation tracking, and lessons learned

**Location:** Global rules apply to ALL projects and ALL chat sessions.