---
name: evg-observable-composition
description: |
  Observable composition patterns — Observable-to-Observable subscription,
  stream branching, merge (subscribe one observable to multiple sources),
  batch emission with .of(), multi-target subscription, and data flow networks.
  Use when writing tests or code involving multiple connected observables,
  stream merging, stream splitting, or batch processing.
user-invocable: false
---

# Observable Composition Patterns

## Observable-to-Observable Subscription

Observables can subscribe to other observables directly, creating data flow networks:

```ts
const source$ = new Observable<Person>(null);
const men$ = new Observable<Person>(null);
const women$ = new Observable<Person>(null);

// source$ pipes to both men$ and women$
source$.pipe()
    .and(youngAgeFilter)
    .and(oldAgeFilter)
    .subscribe([men$, women$]);

// When source$ emits, value flows through pipe, then into men$ and women$
// Each target's inbound filters decide whether to accept
```

## Merge — Subscribe to Multiple Sources

One observable can subscribe to multiple sources natively — no special `merge` operator needed.
Each subscription returns its own subscriber, giving individual unsubscribe control.

```ts
const clicks$ = new Observable<string>(null);
const keyboard$ = new Observable<string>(null);
const network$ = new Observable<string>(null);
const allEvents$ = new Observable<string>(null);

// allEvents$ receives values from all three sources
const sub1 = clicks$.subscribe(allEvents$);
const sub2 = keyboard$.subscribe(allEvents$);
const sub3 = network$.subscribe(allEvents$);

const listener = (value: string) => console.log('Event:', value);
allEvents$.subscribe(listener);

clicks$.next('click:button');     // Event: click:button
keyboard$.next('key:Enter');      // Event: key:Enter
network$.next('response:200');    // Event: response:200
```

### Lifecycle advantage — individual unsubscribe per source

Unlike RxJS `merge()` which returns a single subscription for all sources,
here each source connection is a separate subscriber:

```ts
// Stop listening to network events, keep clicks and keyboard
sub3.unsubscribe();

network$.next('response:404');    // allEvents$ does NOT receive this
clicks$.next('click:submit');     // Event: click:submit  ← still works
keyboard$.next('key:Escape');     // Event: key:Escape    ← still works

// Later, stop listening to clicks too
sub1.unsubscribe();

// Or unsubscribe all at once via Collector
const collector = new Collector();
collector.collect(sub1, sub2, sub3);
collector.destroy(); // all source connections removed
```

### Merge with pipe filters on sources

Each source can have its own pipe chain before reaching the merged observable:

```ts
const merged$ = new Observable<number>(null);

source1$.pipe().and(x => x > 0).subscribe(merged$);
source2$.pipe().map<number>(x => x * 2).subscribe(merged$);

// source1$ values are filtered (only positive), source2$ values are doubled
```

## Stream Branching

One source can feed multiple independent pipe chains with different logic:

```ts
const source$ = new Observable<Person>(null);

// Branch 1: AND logic — working-age filter
source$.pipe()
    .and(p => p.age > 17)
    .and(p => p.age < 60)
    .subscribe([men$, women$]);

// Branch 2: OR logic — hair color filter
source$.pipe()
    .choice()
    .or(p => p.hairColor === "BLACK")
    .or(p => p.hairColor === "BLOND")
    .subscribe(blondAndBlackListener);

// Same source$, two completely independent pipe chains
// Each emission goes through BOTH chains independently
```

## Batch Emission with `.of()`

Emit array elements one by one. Each element triggers the full subscriber chain:

```ts
const observable$ = new Observable<Person>(null);

observable$.of([
    new Person('Alex', 35, 'MAN', 'DOCTOR', 'BLOND'),
    new Person('John', 45, 'MAN', 'DRIVER', 'BLACK'),
    new Person('Alice', 30, 'WOMAN', 'DOCTOR', 'BROWN'),
]);
// Equivalent to:
// observable$.next(alex);
// observable$.next(john);
// observable$.next(alice);
```

## Complete Data Flow Network Example

```
personal$ ──┬── pipe(age filters) ──→ subscribe([men$, women$])
             │                               │          │
             │                          addFilter   addFilter
             │                          (valid+man) (valid+woman)
             │                               │          │
             │                          pipe(work)  pipe(work)
             │                               │          │
             │                               ▼          ▼
             │                          manWorker   womanWorker
             │
             └── pipe(choice/or hair) ──→ blondAndBlackListener
```

```ts
const personal$ = new Observable<Person>(null);
const men$ = new Observable<Person>(null);
const women$ = new Observable<Person>(null);

// Inbound filters on targets
men$.addFilter().allOf(validationFilters).and(menFilter);
women$.addFilter().allOf(validationFilters).and(womenFilter);

// Pipe chains on targets
men$.pipe().allOf(validationFilters).subscribe(manReadyToWork);
women$.pipe().allOf(validationFilters).subscribe(womanReadyToWork);

// Source → targets (AND logic)
personal$.pipe().and(youngAgeFilter).and(oldAgeFilter).subscribe([men$, women$]);

// Source → listener (OR logic)
personal$.pipe().choice().or(blackFilter).or(blondFilter).subscribe(blondAndBlack);

// Batch emit all persons
personal$.of([alex, john, alice, sophia, matthew, emily, james, emma, michael, olivia]);
```

Result for the full person list:
```
MAN ==> is ready to work: Alex 35 DOCTOR
PERSON ==> only black or blond: Alex 35 BLOND
MAN ==> is ready to work: John 45 DRIVER
PERSON ==> only black or blond: John 45 BLACK
WOMAN ==> is ready to work: Alice 30 DOCTOR
WOMAN ==> is ready to work: Sophia 36 DRIVER
PERSON ==> only black or blond: Sophia 36 BLOND
PERSON ==> only black or blond: Emily 17 BLACK
MAN ==> is ready to work: James 40 DOCTOR
PERSON ==> only black or blond: James 40 BLOND
WOMAN ==> is ready to work: Emma 35 DRIVER
PERSON ==> only black or blond: Michael 15 BLACK
PERSON ==> only black or blond: Olivia 16 BLOND
```

Note: Matthew (15, MAN) and Emily (17, WOMAN) are filtered by age in the work branch,
but Emily and Michael/Olivia still appear in the hair color branch (no age filter there).

## Lifecycle Management

```ts
// Unsubscribe specific subscriber
subscriber.unsubscribe();

// Unsubscribe all from observable but keep it alive
observable$.unsubscribeAll();

// Destroy observable and auto-unsubscribe all
observable$.destroy();

// Use Collector for bulk management
const collector = new Collector();
collector.collect(sub1, sub2, sub3);
collector.destroy(); // unsubscribes all
```
