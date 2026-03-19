---
name: evg-pipe-patterns
description: |
  Pipe chain patterns for EVG Observable — auto-unsubscribe with .once() and
  .unsubscribeBy(), data transformation with .map<K>(), JSON serialization
  with .toJson()/.fromJson<K>(), and combining operators in chains. Use when
  writing pipe chains with transforms, auto-unsubscribe logic, or tests for
  pipe operator behavior. For filtering logic (.and/.choice/.or) see evg-filters.
user-invocable: false
---

# Pipe Chain Patterns

For filtering (`.and()`, `.choice().or()`, `.allOf()`, `.anyOf()`) see **evg-filters** skill.
This skill covers transforms, auto-unsubscribe, and serialization.

## Auto-Unsubscribe Patterns

### `.once()` — receive one value then auto-unsubscribe

```ts
const observable$ = new Observable('init');
const listener1 = (value: string) => console.log('listener1:', value);
const listener2 = (value: string) => console.log('listener2:', value);

observable$.pipe().once().subscribe(listener1);
observable$.subscribe(listener2);

observable$.next('first');
// listener1: first    ← receives
// listener2: first    ← receives

observable$.next('second');
// listener2: second   ← only listener2, listener1 auto-unsubscribed
```

### `.unsubscribeBy(condition)` — receive until condition is true

Value that triggers unsubscription is NOT delivered to the listener:

```ts
type ISomeData = { message: string; isNeedUnsubscribe: boolean };

const observable$ = new Observable<ISomeData>({message: "init", isNeedUnsubscribe: false});

observable$
    .pipe()
    .unsubscribeBy((data: ISomeData) => data.isNeedUnsubscribe)
    .subscribe(listener1);

observable$.subscribe(listener2);

observable$.next({message: "msg1", isNeedUnsubscribe: false});
// listener1: msg1  ← receives
// listener2: msg1  ← receives

observable$.next({message: "msg2", isNeedUnsubscribe: true});
// listener2: msg2  ← only listener2, listener1 auto-unsubscribed
```

## Data Transformation with `.map<K>()`

Transform data type mid-chain. After `.map<K>()`, subsequent operators work on type K:

```ts
const observable$ = new Observable("");

observable$
    .pipe()
    .and(str => str.includes("2"))      // filter strings
    .map<number>(str => str.length)      // string → number
    .and(num => num > 4)                 // filter numbers
    .map<number>(num => num * 2)         // transform number
    .once()                              // auto-unsubscribe after first match
    .subscribe(listener);

observable$.of([
    "1",        // filtered: no "2"
    "12",       // filtered: length 2, not > 4
    "123",      // filtered: length 3, not > 4
    "1234",     // filtered: length 4, not > 4
    "12345",    // passes! length 5 > 4, listener gets 10, then unsubscribes
    "12345",    // not delivered — already unsubscribed
]);
```

## JSON Serialization

### `.toJson()` — object to JSON string

```ts
type IPoint = { x: number, y: number };
const observable$ = new Observable<IPoint>(null);

observable$.pipe().toJson().subscribe((json: string) => {
    console.log(json); // '{"x":10,"y":20}'
});

observable$.next({x: 10, y: 20});
```

### `.fromJson<K>()` — JSON string to object

```ts
const observable$ = new Observable<string>("");

observable$.pipe().fromJson<IPoint>().subscribe((point: IPoint) => {
    console.log(point.x, point.y); // 10 20
});

observable$.next('{"x":10,"y":20}');
```

## Combining Operators

Pipe operators can be freely combined in a chain:

```ts
observable$
    .pipe()
    .and(condition)           // filter
    .map<NewType>(transform)  // transform
    .and(newCondition)        // filter on new type
    .once()                   // auto-unsubscribe
    .subscribe(listener);
```

Order matters: `.once()` and `.unsubscribeBy()` should typically come last before `.subscribe()`.
