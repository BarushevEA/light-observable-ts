---
name: evg-group-and-iteration
description: |
  Group subscription and iteration operators for EVG Observable — .group() for
  multi-listener optimization, .in<K,V>() for object iteration, .of<K,V>() for
  array iteration in pipes. Use when writing tests or code involving group
  subscriptions, object/array iteration in pipe chains, or performance optimization
  with shared pipe execution.
user-invocable: false
---

# Group Subscription & Iteration Operators

## `.group()` — Multi-Listener Optimization

When multiple listeners need the same pipe output, `.group()` executes the pipe
chain **once** and distributes the result to all listeners.

**Without group**: N listeners = N pipe executions.
**With group**: N listeners = 1 pipe execution.

### Basic Usage

```ts
const observable$ = new Observable<number>(0);

let transformCount = 0;
const expensiveTransform = (x: number) => {
    transformCount++;
    return x * x;
};

const group = observable$
    .pipe()
    .and((x) => x > 0)
    .map<number>(expensiveTransform)
    .group();

group.add((x) => console.log('Listener 1:', x));
group.add((x) => console.log('Listener 2:', x));
group.add((x) => console.log('Listener 3:', x));

observable$.next(5);
// Listener 1: 25
// Listener 2: 25
// Listener 3: 25
// transformCount = 1 (NOT 3!)
```

### Group with Error Handling

Each listener in a group can have its own error handler:

```ts
const group = observable$.pipe().group();

group.add(
    (x) => {
        if (x < 0) throw new Error('Negative value');
        console.log('Listener 1:', x);
    },
    (data, err) => console.log('Error in listener 1:', err.message)
);

group.add(
    (x) => console.log('Listener 2:', x)
);

observable$.next(5);   // Both listeners receive 5
observable$.next(-1);  // Listener 1 throws → error handler called; Listener 2 still receives -1
```

### Important: `.group()` is a Type Finalizer

No further pipe operators can be chained after `.group()`.
Only `.add(listener, errorHandler?)` is available.

```ts
// Correct
observable$.pipe().and(cond).map<number>(fn).group();

// Wrong — cannot chain after group()
// observable$.pipe().group().and(cond);  ← NOT possible
```

## `.in<K, V>()` — Object Iteration

Iterates over object properties, emitting each value to subscribers.

### Basic — emit values

```ts
type User = { name: string; age: number };
const users: Record<string, User> = {
    user1: { name: "Alice", age: 30 },
    user2: { name: "Bob", age: 25 },
    user3: { name: "Charlie", age: 35 }
};

const observable$ = new Observable<Record<string, User>>(users);

observable$
    .pipe()
    .in<string, User>()
    .subscribe(listener);

// Output (one emission per key-value pair):
// User: Alice 30
// User: Bob 25
// User: Charlie 35
```

### With Transform — emit transformed values

```ts
observable$
    .pipe()
    .in<string, User>((user) => user.name.toUpperCase())
    .subscribe(nameListener);

// Output:
// Name: ALICE
// Name: BOB
// Name: CHARLIE
```

## `.of<K, V>()` — Array Iteration in Pipe

Similar to `.in()` but for arrays. Iterates array elements in the pipe chain.

```ts
observable$
    .pipe()
    .of<number, string>((item) => item.toString())
    .subscribe(listener);
```

Note: This is the pipe operator `.of()`, different from `Observable.of()` which is a
top-level method for batch emission.

## Combining with Other Operators

Iteration and group operators combine with standard pipe operators:

```ts
// Object iteration + filter + transform + group
observable$
    .pipe()
    .in<string, User>()
    .and(user => user.age >= 18)
    .map<string>(user => user.name)
    .group();
```
