---
name: evg-filters
description: |
  Both filter types in EVG Observable — inbound filters (.addFilter()) and
  outbound pipe filters (.pipe().and()). Covers AND logic with .and()/.allOf(),
  OR logic with .choice().or()/.anyOf(), and how both filter types combine on
  the same observable. Use when writing filter logic, validation chains, or
  tests for filtering behavior.
user-invocable: false
---

# EVG Observable Filters

Two independent filter systems. Both support AND and OR logic with the same API shape.

## Data Flow Position

```
Value → [Inbound Filters] → Observable stores value → [Outbound Pipe Filters] → Subscribers
         addFilter()                                    pipe().and()/choice()
```

- **Inbound** (`addFilter`): gates what enters the observable. Rejected values are never stored.
- **Outbound** (`pipe`): gates what reaches specific subscribers. Value is stored regardless.

## Inbound Filters — `.addFilter()`

### AND logic

All conditions must return true:

```ts
const men$ = new Observable<Person>(null);

men$.addFilter()
    .and((person: Person) => !!person)
    .and((person: Person) => person.gender === "MAN");

men$.next(new Person('Alex', 35, 'MAN', 'DOCTOR', 'BLOND'));   // passes → stored
men$.next(new Person('Alice', 30, 'WOMAN', 'DOCTOR', 'BROWN')); // rejected → not stored
men$.next(null);  // rejected
```

Batch AND with `.allOf()`:

```ts
const validationFilters = [
    (person: Person) => !!person,
    (person: Person) => "name" in person,
    (person: Person) => "age" in person,
    (person: Person) => "gender" in person,
];

men$.addFilter()
    .allOf(validationFilters)
    .and(menFilter);
```

### OR logic

First condition that returns true lets the value through:

```ts
observable$.addFilter()
    .choice()
    .or((p: Person) => p.hairColor === "BLACK")
    .or((p: Person) => p.hairColor === "BLOND");

// BLACK or BLOND pass; BROWN rejected
```

Batch OR with `.anyOf()`:

```ts
observable$.addFilter()
    .choice()
    .anyOf([isTypeA, isTypeB, isTypeC]);
```

## Outbound Pipe Filters — `.pipe().and()`

### AND logic

```ts
observable$
    .pipe()
    .and(str => str.length > 3)
    .and(str => str.includes("test"))
    .subscribe(listener);

observable$.next('testing');  // listener receives
observable$.next('te');       // filtered out (length <= 3)
observable$.next('abcdef');   // filtered out (no "test")
```

Batch AND with `.allOf()`:

```ts
observable$.pipe().allOf(filters).subscribe(listener);
```

### OR logic

```ts
observable$
    .pipe()
    .choice()
    .or(blackFilter)
    .or(blondFilter)
    .subscribe(blondAndBlackListener);

// First true condition wins
```

Batch OR with `.anyOf()`:

```ts
observable$.pipe().choice().anyOf([cond1, cond2, cond3]).subscribe(listener);
```

## Both Filter Types on Same Observable

The same observable can have inbound AND outbound filters simultaneously:

```ts
const men$ = new Observable<Person>(null);

// Inbound: only accept valid male persons
men$.addFilter()
    .allOf(validationFilters)
    .and(menFilter);

// Outbound: further filter for specific subscribers
men$.pipe()
    .and(p => p.age >= 18)
    .and(p => p.age < 60)
    .subscribe(manReadyToWork);

// Flow: value → inbound (valid male?) → stored → pipe (working age?) → subscriber
```

## Hub Pattern: Inbound + Outbound Together

```ts
const personal$ = new Observable<Person>(null);
const men$ = new Observable<Person>(null);
const women$ = new Observable<Person>(null);

// Inbound filters on targets
men$.addFilter().allOf(validationFilters).and(menFilter);
women$.addFilter().allOf(validationFilters).and(womenFilter);

// Source outbound pipe → targets
personal$.pipe()
    .and(youngAgeFilter)
    .and(oldAgeFilter)
    .subscribe([men$, women$]);

// Target outbound pipes → listeners
men$.pipe().allOf(validationFilters).subscribe(manReadyToWork);
women$.pipe().allOf(validationFilters).subscribe(womanReadyToWork);

// Separate outbound branch with OR logic
personal$.pipe()
    .choice()
    .or(blackFilter)
    .or(blondFilter)
    .subscribe(blondAndBlackListener);

personal$.of([person1, person2, person3, ...]);
```

## Key Differences Summary

| | Inbound (`addFilter`) | Outbound (`pipe`) |
|---|---|---|
| Applied | Before value stored | After value stored |
| Affects | All subscribers | Only this pipe's subscriber |
| Rejected value | Never enters observable | Stored, just not delivered |
| Extra operators | No (only filter) | Yes (map, once, group, etc.) |
