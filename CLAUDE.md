# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Task Planning (CRITICAL)

> **MUST READ** on keywords: "new task", "create plan", "implementation plan", "start task", "continue task", "task status", "what's done".

**Planning rules:** [.config/claude/task_planning_rules_v4.md](.config/claude/task_planning_rules_v4.md)

**Active tasks:** [tmp/active_tasks.md](tmp/active_tasks.md) — read first for context.

### Quick Start

**New task:**
```bash
mkdir -p tmp/{task-name}/history
# Create: start_here.md, implementation_plan_v1.md, history/history_v1.md
# Update: tmp/active_tasks.md
```

**Continue task:**
```
1. Read tmp/active_tasks.md
2. Open tmp/{task-name}/start_here.md
3. Go to current plan v{N}
4. Check history — what's done
5. Update history after each action
```

**Approach didn't work → create new plan version v{N+1}**

---

## Project Overview

EVG Observable is a lightweight, high-performance Observable library for TypeScript/JavaScript designed as an alternative to RxJS. It focuses on simplicity, small bundle size, and efficient event management.

### Design Philosophy

- **Lightweight**: Zero runtime dependencies, minimal bundle size
- **Performance**: Optimized for speed (see benchmarks comparing to RxJS)
- **Simplicity**: Intuitive API without RxJS complexity
- **Flexibility**: Multi-observable subscriptions, extended pipe chains, inbound/outbound filters

### Data Flow

```
Value → Inbound Filters (addFilter/choice) → Observable → Pipe (and/map/toJson/fromJson) → Subscribers
```

1. **Inbound Filters**: Pre-process values before they enter the Observable (`addFilter()`, `choice()`)
2. **Observable**: Stores current value, manages subscriber list
3. **Pipe**: Transforms/filters outgoing values (`and()`, `map<K>()`, `toJson()`, `fromJson<K>()`)
4. **Subscribers**: Receive processed values (can be listeners OR other Observables)

### Key Capabilities

- **Multi-subscriber**: Any number of listeners or Observables can subscribe to a single source
- **Observable-to-Observable subscription**: Observables can subscribe to other Observables, enabling data flow networks
- **Pipelines**: Chainable transformation/filter chains (`pipe().and().map().subscribe()`)
- **Dual filtering**: Inbound (`addFilter`) + Outbound (`pipe`) on same Observable
- **AND/OR logic**: `and()` chains for AND logic, `choice().or()` for OR logic — in both pipes and inbound filters
- **Stream branching**: One source to multiple Observable targets via `subscribe([target1$, target2$])`
- **Batch filters**: `allOf()` / `anyOf()` for filter arrays
- **Parallel pipelines**: Multiple `pipe()` chains from single source with different logic

#### Stream Composition Example

```
source$ ──┬── pipe().and() ──→ subscribe([target1$, target2$])
          │                            │           │
          │                      addFilter()   addFilter()
          │                       + pipe()      + pipe()
          │                            │           │
          │                            ▼           ▼
          │                       listener1   listener2
          │
          └── pipe().choice().or() ──→ listener3
```

## Common Commands

| Command | Purpose |
|---------|---------|
| `npm test` | Run unit tests with coverage |
| `npm run build` | Compile TypeScript for npm publish |
| `npm run bundle` | Build browser IIFE bundle (`repo/evg_observable.js`) |
| `npm run benchmark` | Run performance benchmarks |
| `npm run benchmark:comparison` | Compare performance against RxJS |

**Running a single test file:**
```bash
npx mocha --require ./register.js test/Observable.unit.test.ts
```

## Architecture

### Core Components (`src/Libraries/Observables/`)

- **Observable.ts**: Core data stream class that emits values to subscribers. Manages listener subscriptions, enables/disables emissions, and provides filtering/piping.

- **OrderedObservable.ts**: Extended Observable with ordered emission guarantees. Subscribers have an `order` property (numeric) with ascending/descending sort modes.

- **Pipe.ts**: Chainable transformation pipeline with methods like `once()`, `unsubscribeBy()`, `and()`, `map<K>()`, `tap()`, `throttle()`, `debounce()`, `distinctUntilChanged()`, `toJson()`, `fromJson<K>()`, `group()`, and switch-case branching (`choice().or()`).

- **FilterCollection.ts**: Inbound filter system applied before emitting to subscribers. Supports `addFilter()` chaining with AND logic and `switch()` for OR logic.

- **Collector.ts**: Subscription management utility for bulk operations across multiple subscriptions.

- **Types.ts**: Comprehensive TypeScript interface definitions. Key interfaces: `IObserver<T>`, `ISetup<T>`, `ISubscriptionLike`, `IOrderedSubscriptionLike`, `ICollector`.

### Public API Exports

```typescript
export {Observable, OrderedObservable, Collector, deleteFromArray, quickDeleteFromArray}
export {ISubscriptionLike, IOrderedSubscriptionLike}
```

## Testing

Test pattern uses decorator-based classes:
```typescript
@suite
class ObservableUnitTest {
    @test 'test description'() {
        expect(value).to.be.equal(expected);
    }
}
```

### Test Failure Policy (CRITICAL)

When a test fails and reveals a potential bug in the library:
1. **DO NOT** silently change/remove the test to make it pass
2. **ASK THE USER**: "Test revealed a problem: [description]. Should I fix the library or is this expected behavior?"
3. Only proceed after user confirms the action

## Pipe Methods (Critical Differences)

### Auto-Unsubscribe Behavior

| Method | Behavior | Auto-Unsubscribe |
|--------|----------|------------------|
| `once()` | Receive one value then unsubscribe | Yes (after first value) |
| `unsubscribeBy(condition)` | Receive values until condition is true | Yes (when condition returns true) |
| `and(condition)` | Filter values, only pass when true | No |

### AND vs OR Logic

**AND logic** (chained methods):
```typescript
.pipe().and(cond1).and(cond2)  // Both must be true
.addFilter().and(cond1).and(cond2)  // Both must be true
```

**OR logic** (switch-case):
```typescript
.pipe().choice().or(cond1).or(cond2)  // First true wins
.addFilter().choice().or(cond1).or(cond2)  // First true wins
```

### Data Transformation with `map<K>()`

Transform data type in pipe chain:
```typescript
observable$
    .pipe()
    .and(str => str.includes("2"))  // filter strings
    .map<number>(str => str.length)   // transform to number
    .and(num => num > 4)            // filter numbers
    .subscribe(listener);
```

### Side Effects with `tap(fn)`

Execute a function without modifying the value:
```typescript
observable$
    .pipe()
    .tap(value => console.log('debug:', value))  // side effect, value unchanged
    .and(value => value > 0)
    .subscribe(listener);
```

### Rate Limiting: `throttle(ms)` and `debounce(ms)`

```typescript
// Throttle: leading-edge, first value passes, drops within interval
observable$.pipe().throttle(300).subscribe(listener);

// Debounce: trailing-edge, emits after ms of silence
observable$.pipe().debounce(300).subscribe(listener);
```

### Suppressing Duplicates with `distinctUntilChanged(comparator?)`

```typescript
// Default: strict equality (===)
observable$.pipe().distinctUntilChanged().subscribe(listener);
// 1, 1, 2, 2, 3 → 1, 2, 3

// Custom comparator for objects
observable$.pipe()
    .distinctUntilChanged((prev, curr) => prev.id === curr.id)
    .subscribe(listener);
```

### Batch Emission with `of()`

Send array elements one by one:
```typescript
observable$.of([item1, item2, item3]);
// Equivalent to: next(item1); next(item2); next(item3);
```

### JSON Serialization

```typescript
// Object → JSON string
observable$.pipe().toJson().subscribe(jsonListener);

// JSON string → Object
observable$.pipe().fromJson<MyType>().subscribe(objectListener);
```

### Error Handling

Subscribe with error handler as second argument:
```typescript
const subscriber = observable$.subscribe(
    (value) => console.log(value),           // listener
    (errorData, errorMessage) => {           // error handler
        console.log('Error:', errorData, errorMessage);
    }
);
```

### Emission Control

```typescript
observable$.disable();      // Stop emitting to subscribers
observable$.enable();       // Resume emitting
console.log(observable$.isEnable);  // Check state

observable$.getValue();     // Get current/last value
observable$.size();         // Get subscriber count
```

## Performance (vs RxJS)

Bundle comparison (v3.0.0 API, minified bundles, clean benchmarks):

| Operation | EVG Observable | RxJS | Advantage |
|-----------|----------------|------|-----------|
| Emit 100 values | 1,662K ops/sec | 239K ops/sec | **7.0x faster** |
| Filter + transform | 340K ops/sec | 149K ops/sec | **2.3x faster** |
| 10 subscribers | 9,946K ops/sec | 3,500K ops/sec | **2.8x faster** |
| 100 subscribers | 1,236K ops/sec | 432K ops/sec | **2.9x faster** |
| 1000 subscribers | 124K ops/sec | 41K ops/sec | **3.0x faster** |
| Batch of(100) | 906K ops/sec | 176K ops/sec | **5.1x faster** |
| 5 chained filters | 19K ops/sec | 9K ops/sec | **2.1x faster** |
| Large payload | 879K ops/sec | 184K ops/sec | **4.8x faster** |

**Key metrics:** Observable creation ~122M ops/sec, bundle size 8.0 kB (11x smaller than RxJS).

See `BENCHMARK_BUNDLE_RESULTS.md` for full details.

## Tech Stack

- **Language**: TypeScript (strict mode), target ESNext, module CommonJS
- **Testing**: Mocha + `@testdeck/mocha` (decorator-based) + Chai + NYC (coverage)
- **Build**: `tsc --declaration` → `src/outLib/` (npm publish prep — strips comments to reduce package size)
- **Browser bundle**: `npm run bundle` → `repo/evg_observable.js` (esbuild, IIFE, minified, 8.0 kB)
- **Bundler**: esbuild (entry: `src/browser-entry.ts` → IIFE bundle exposing Observable, OrderedObservable, Collector on `window`)
- **Package manager**: npm
- **No linter/formatter** configured (no ESLint, no Prettier, no .editorconfig)

## Conventions

### Naming

| Element | Convention | Example |
|---------|-----------|---------|
| Classes | PascalCase | `Observable`, `Pipe`, `FilterCollection` |
| Interfaces/Types | `I` + PascalCase | `IObserver<T>`, `ISetup<T>`, `ISubscriptionLike` |
| Functions/Methods | camelCase | `deleteFromArray()`, `addFilter()`, `getValue()` |
| Variables | camelCase | `errorCounter`, `subscriptionLike` |
| Observable instances | camelCase + `$` suffix | `observable$`, `source$` |
| Test fixtures | UPPER_SNAKE_CASE | `OBSERVABLE$`, `COLLECTOR` |

### File Organization

- Source files: **PascalCase** (`Observable.ts`, `FilterCollection.ts`, `FunctionLibs.ts`)
- Test files: `{ClassName}.unit.test.ts`
- Types: all in single `Types.ts` file (~800 lines)
- Public API: re-exported through `src/Libraries/Observables/index.ts`

### Code Style

- 2-space indentation
- Named exports (`export class ...`, `export function ...`)
- Fluent API / method chaining (`.and()`, `.or()`, `.map()`, `.tap()`, `.subscribe()`)
- JSDoc comments (`/** @template @param @return */`) on public methods
- Type composition via intersection (`&`) over inheritance for interfaces
- Protected members for extensibility (`OrderedObservable extends Observable<T>`)
- Strict mode in src, non-strict in tests (for decorator flexibility)

## Key Patterns

- **Resource cleanup**: Always use `destroy()`, `unsubscribeAll()`, or `unsubscribe()` for lifecycle management
- **Performance utilities**: Prefer `quickDeleteFromArray` over `deleteFromArray` for optimized array removal

## Multi-Agent Patterns

### Pattern: Parallel Feature Development

**Use when**: Implementing independent features simultaneously (e.g., new pipe operators)

**Setup**:
```bash
git branch feature-a && git branch feature-b
git worktree add ../light-observable-ts-feature-a feature-a
git worktree add ../light-observable-ts-feature-b feature-b
```

**Agents**:
1. Main worktree: Coordination, merge, conflict resolution
2. Feature-a worktree: First feature (implementation + tests)
3. Feature-b worktree: Second feature (implementation + tests)

**Workflow**:
1. Create branches and worktrees
2. Launch Claude in each worktree with independent task
3. Wait for both agents to complete
4. **Copy contents of feature branch tmp/ into main branch tmp/ before removing worktrees**
5. Merge branches, resolve conflicts, run tests
6. Remove worktrees and delete branches

### Pattern: Implementation + Review

**Use when**: Want quality assurance on generated code

**Workflow**:
1. First agent implements feature
2. Second agent reviews and suggests improvements
3. First agent applies feedback
4. Repeat until approved

### Cleanup
```bash
git worktree remove ../light-observable-ts-feature-a
git worktree remove ../light-observable-ts-feature-b
git branch -d feature-a feature-b
```

## Automated Workflows

### GitHub Actions

| Workflow | File | Trigger | Description |
|----------|------|---------|-------------|
| Claude Code | `.github/workflows/claude.yml` | `@claude` in PR/issue comments | Interactive — responds to mentions, applies fixes, answers questions |
| Claude PR Review | `.github/workflows/claude-review.yml` | PR opened/updated | Automatic — reviews every PR for quality, bugs, performance, bundle size |

Both use `CLAUDE_CODE_OAUTH_TOKEN` secret (OAuth, no API costs).

### Automation Scripts

Scripts in `scripts/` use Claude headless mode (`claude -p`). See `scripts/README.md` for details.

| Script | Mode | Purpose |
|--------|------|---------|
| `claude-review-files.sh` | read-only | Review diff against base branch |
| `claude-pr-prep.sh` | read-only | Run tests + generate PR description |
| `claude-full-check.sh` | read-only | Review → PR prep pipeline |

### Headless Mode Reference

```bash
claude -p "prompt" --print --max-turns 5       # read-only, text output
claude -p "prompt" --output-format json         # machine-parseable output
claude -p "prompt" --max-turns 10               # write mode (can edit files)
```

## API Reference

See [README.md](README.md) for full API documentation, usage examples, and method reference.
