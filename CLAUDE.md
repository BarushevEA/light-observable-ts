# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Task Planning (CRITICAL)

> **MUST READ** on keywords: "new task", "create plan", "implementation plan", "start task", "continue task", "task status", "what's done".

**Planning rules:** [.config/claude/task_planning_rules_v3.md](.config/claude/task_planning_rules_v3.md)

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
Value → Inbound Filters (addFilter/switch-case) → Observable → Pipe (refine/then/serialize) → Subscribers
```

1. **Inbound Filters**: Pre-process values before they enter the Observable (`addFilter()`, `switch()`)
2. **Observable**: Stores current value, manages subscriber list
3. **Pipe**: Transforms/filters outgoing values (`refine()`, `then<K>()`, `serialize()`)
4. **Subscribers**: Receive processed values (can be listeners OR other Observables)

### Key Capability: Observable-to-Observable Subscription

Observables can subscribe to other Observables, enabling data flow networks:

```typescript
const source$ = new Observable<string>('');
const target$ = new Observable<string>('');

// target$ receives all emissions from source$
source$.subscribe(target$);

// With filtering via pipe
source$.pipe().refine(condition).subscribe([target1$, target2$]);
```

### Complex Stream Composition

Library supports sophisticated reactive patterns with stream branching and multiple filter layers:

```
source$ ──┬── pipe().refine() ──→ subscribe([target1$, target2$])
          │                            │           │
          │                      addFilter()   addFilter()
          │                       + pipe()      + pipe()
          │                            │           │
          │                            ▼           ▼
          │                       listener1   listener2
          │
          └── pipe().switch().case() ──→ listener3
```

Key capabilities:
- **Stream branching**: One source to multiple Observable targets
- **Dual filtering**: Inbound (`addFilter`) + Outbound (`pipe`) on same Observable
- **Batch filters**: `pushFilters()` / `pushRefiners()` for filter arrays
- **Parallel pipelines**: Multiple `pipe()` chains from single source with different logic

## Common Commands

| Command | Purpose |
|---------|---------|
| `npm test` | Run unit tests with Mocha + NYC coverage |
| `npm run build` | Compile TypeScript to `src/outLib/` |
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

- **Pipe.ts**: Chainable transformation pipeline with methods like `setOnce()`, `unsubscribeBy()`, `refine()`, `then<K>()`, `serialize()`, `deserialize()`, and switch-case branching.

- **FilterCollection.ts**: Inbound filter system applied before emitting to subscribers. Supports `addFilter()` chaining with AND logic and `switch()` for OR logic.

- **Collector.ts**: Subscription management utility for bulk operations across multiple subscriptions.

- **Types.ts**: Comprehensive TypeScript interface definitions (800+ lines). Key interfaces: `IObserver<T>`, `ISetup<T>`, `ISubscriptionLike`, `IOrderedSubscriptionLike`, `ICollector`.

### Public API Exports

```typescript
export {Observable, OrderedObservable, Collector, deleteFromArray, quickDeleteFromArray}
export {ISubscriptionLike, IOrderedSubscriptionLike}
```

## Testing

- **Framework**: Mocha with `@testdeck/mocha` class decorators
- **Assertions**: Chai
- **Test location**: `test/*.unit.test.ts`
- **Coverage**: NYC with HTML reports to `./coverage`

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
| `setOnce()` | Receive one value then unsubscribe | Yes (after first value) |
| `unsubscribeBy(condition)` | Receive values until condition is true | Yes (when condition returns true) |
| `refine(condition)` | Filter values, only pass when true | No |

### AND vs OR Logic

**AND logic** (chained methods):
```typescript
.pipe().refine(cond1).refine(cond2)  // Both must be true
.addFilter().filter(cond1).filter(cond2)  // Both must be true
```

**OR logic** (switch-case):
```typescript
.pipe().switch().case(cond1).case(cond2)  // First true wins
.addFilter().switch().case(cond1).case(cond2)  // First true wins
```

### Data Transformation with `then<K>()`

Transform data type in pipe chain:
```typescript
observable$
    .pipe()
    .refine(str => str.includes("2"))  // filter strings
    .then<number>(str => str.length)   // transform to number
    .refine(num => num > 4)            // filter numbers
    .subscribe(listener);
```

### Batch Emission with `stream()`

Send array elements one by one:
```typescript
observable$.stream([item1, item2, item3]);
// Equivalent to: next(item1); next(item2); next(item3);
```

### JSON Serialization

```typescript
// Object → JSON string
observable$.pipe().serialize().subscribe(jsonListener);

// JSON string → Object
observable$.pipe().deserialize<MyType>().subscribe(objectListener);
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

| Operation | EVG Observable | RxJS | Advantage |
|-----------|---------------|------|-----------|
| Creation + subscription | 4.2M ops/sec | 2.8M ops/sec | **1.5x faster** |
| Emit 100 values | 878K ops/sec | 203K ops/sec | **4.3x faster** |
| Filter + transform | 291K ops/sec | 82K ops/sec | **3.5x faster** |

Key metrics: Observable creation ~54M ops/sec, `next()` with 1 subscriber ~3.6M ops/sec.

See `BENCHMARK_RESULTS.md` for full details.

## Key Patterns

- **Resource cleanup**: Always use `destroy()`, `unsubscribeAll()`, or `unsubscribe()` for lifecycle management
- **Performance utilities**: Prefer `quickDeleteFromArray` over `deleteFromArray` for optimized array removal
- **Type safety**: Strict TypeScript mode enabled; maintain comprehensive interface usage
