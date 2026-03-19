---
name: evg-observable-api
description: |
  EVG Observable library API reference — all classes, methods, pipe operators,
  inbound filters, and their behavior. Use this skill whenever writing tests,
  benchmarks, or examples for this library. Also use when answering questions
  about Observable, OrderedObservable, Collector, Pipe, or FilterCollection
  behavior, even if the user doesn't explicitly mention "API reference".
user-invocable: false
---

# EVG Observable API Reference

This skill provides complete API knowledge for the EVG Observable library.
Use it as the source of truth when writing tests, benchmarks, or usage examples.

## Core Classes

### Observable<T>

Hot observable that emits values to subscribers. Constructor accepts initial value.

```ts
const obs$ = new Observable<string>('initial');
```

| Method | Returns | Behavior |
|--------|---------|----------|
| `.subscribe(listener, errorHandler?)` | ISubscriptionLike | Subscribe listener; optional error handler `(errorData, errorMessage) => void` |
| `.unSubscribe(subscriber)` | void | Unsubscribe specific subscriber |
| `.unsubscribeAll()` | void | Unsubscribe all listeners |
| `.next(value)` | void | Emit value to all subscribers |
| `.of(value[])` | void | Emit array elements one by one (batch emission) |
| `.getValue()` | T | Return last emitted value or initial value |
| `.size()` | number | Current subscriber count |
| `.disable()` | void | Stop emitting to subscribers |
| `.enable()` | void | Resume emitting |
| `.isEnable` | boolean | Read-only emission state |
| `.destroy()` | void | Unsubscribe all and destroy observable |
| `.isDestroyed` | boolean | Read-only destroyed state |
| `.pipe()` | Pipe<T> | Start pipe chain |
| `.addFilter()` | InboundFilter<T> | Start inbound filter chain |

**Observable-to-Observable subscription:**
```ts
source$.pipe().subscribe([target1$, target2$]);
```

### OrderedObservable<T>

Extends Observable. Subscribers have `.order` property (default 0).
Lower order = called first (ascending sort by default).

| Method | Returns | Behavior |
|--------|---------|----------|
| `.ascendingSort()` | boolean | Sort subscribers ascending by order |
| `.descendingSort()` | boolean | Sort subscribers descending by order |

Subscriber has `.order: number` field for setting emission priority.

### Collector

Manages multiple subscriptions for bulk operations.

| Method | Returns | Behavior |
|--------|---------|----------|
| `.collect(...subscribers)` | void | Collect subscribers for management |
| `.unsubscribe(subscriber)` | void | Unsubscribe one from its observable |
| `.unsubscribeAll()` | void | Unsubscribe all from their observables |
| `.destroy()` | void | Unsubscribe all and destroy collector |

## Pipe Operators

Chain from `.pipe()`. Methods return pipe object (chainable) unless noted.

### Filtering

| Operator | Behavior | Auto-Unsubscribe |
|----------|----------|-------------------|
| `.and(condition)` | Pass value only if condition returns true | No |
| `.allOf(conditions[])` | Pass value only if ALL conditions return true | No |
| `.once()` | Pass first value, then auto-unsubscribe | Yes |
| `.unsubscribeBy(condition)` | Pass values while condition is false; auto-unsubscribe on first true | Yes |

**AND logic** — chained `.and()` calls:
```ts
obs$.pipe().and(cond1).and(cond2).subscribe(listener);
// Both cond1 AND cond2 must be true
```

### OR Logic (Switch-Case)

| Operator | Behavior |
|----------|----------|
| `.choice()` | Enter switch-case mode |
| `.or(condition)` | Add OR condition (first true wins) |
| `.anyOf(conditions[])` | Add group of OR conditions |

```ts
obs$.pipe().choice().or(cond1).or(cond2).subscribe(listener);
// First condition that returns true wins
```

### Transformation

| Operator | Behavior |
|----------|----------|
| `.map<K>(transform)` | Transform value to new type K |
| `.toJson()` | Serialize to JSON string |
| `.fromJson<K>()` | Deserialize JSON string to type K |

```ts
obs$.pipe()
    .and(str => str.includes("2"))
    .map<number>(str => str.length)
    .and(num => num > 4)
    .subscribe(listener);
```

### Iteration

| Operator | Behavior |
|----------|----------|
| `.of<K,V>(transform?)` | Iterate array, emit each element |
| `.in<K,V>(transform?)` | Iterate object key-value pairs, emit each value |

```ts
// Object iteration with transform
obs$.pipe().in<string, User>((user) => user.name.toUpperCase()).subscribe(listener);
```

### Multi-Listener Optimization

| Operator | Behavior |
|----------|----------|
| `.group()` | Returns IGroupSubscription. Pipe executes once, result shared with all listeners via `.add()` |

```ts
const group = obs$.pipe().and(x => x > 0).map<number>(x => x * x).group();
group.add(listener1);
group.add(listener2);
group.add(listener3, errorHandler);
// Pipe runs once per emission, not 3 times
```

**`.group()` is a type finalizer** — no further operators can be chained after it.

### Terminal

| Operator | Behavior |
|----------|----------|
| `.subscribe(listener, errorHandler?)` | Subscribe listener to pipe output |
| `.subscribe([obs1$, obs2$])` | Subscribe other observables to pipe output |

## Inbound Filters

Applied before value enters the observable. Chain from `.addFilter()`.

| Operator | Behavior |
|----------|----------|
| `.and(condition)` | AND filter — all must pass |
| `.allOf(conditions[])` | Group AND filters |
| `.choice()` | Enter switch-case mode |
| `.or(condition)` | OR filter — first true wins |
| `.anyOf(conditions[])` | Group OR filters |

```ts
obs$.addFilter().and(validate).and(sanitize);
// Both must return true for value to enter observable

obs$.addFilter().choice().or(isTypeA).or(isTypeB);
// Either condition passing is sufficient
```

## Data Flow

```
Value → Inbound Filters (addFilter/choice) → Observable storage → Pipe chain → Subscribers
```

1. Inbound filters gate what enters the observable
2. Observable stores value and notifies pipe chains
3. Each pipe chain independently filters/transforms
4. Subscribers receive the pipe output

## Error Handling

```ts
const sub = obs$.subscribe(
    (value) => { /* handle value */ },
    (errorData, errorMessage) => { /* handle error */ }
);
```

Group error handling:
```ts
group.add(
    (value) => { if (bad) throw new Error('oops'); },
    (data, err) => console.log('Error:', err.message)
);
```

## Exports

```ts
export { Observable, OrderedObservable, Collector, deleteFromArray, quickDeleteFromArray }
export { ISubscriptionLike, IOrderedSubscriptionLike }
```
