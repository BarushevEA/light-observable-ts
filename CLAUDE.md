# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EVG Observable is a lightweight, high-performance Observable library for TypeScript/JavaScript designed as an alternative to RxJS. It focuses on simplicity, small bundle size, and efficient event management.

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

## Key Patterns

- **Resource cleanup**: Always use `destroy()`, `unsubscribeAll()`, or `unsubscribe()` for lifecycle management
- **Performance utilities**: Prefer `quickDeleteFromArray` over `deleteFromArray` for optimized array removal
- **Type safety**: Strict TypeScript mode enabled; maintain comprehensive interface usage
