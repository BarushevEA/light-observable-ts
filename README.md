[![Socket Badge](https://socket.dev/api/badge/npm/package/evg_observable)](https://socket.dev/npm/package/evg_observable)
<h1 align=center style="color: saddlebrown">
EVG Observable
</h1>
<p align=center>
EVG Observable - is a light library for simple use.
</p>

## Navigation

- [EVG Observable vs RxJS](#evg-observable-vs-rxjs)
- [What is EVG Observable?](#what-is-evg-observable)
- [Installation](#installation)
    - [Node.js](#nodejs)
    - [Browser](#browser)
- [Usage](#usage)
    - [Observable simple usage](#observable-simple-usage)
    - [Browser simple usage](#browser-simple-usage)
    - [Observable pipe usage](#observable-pipe-usage)
        - [pipe().once()](#pipeonce)
        - [pipe().unsubscribeBy()](#pipeunsubscribebycondition)
        - [pipe().and()](#pipeandcondition)
        - [pipe().toJson()](#pipetojson)
        - [pipe().fromJson()](#pipefromjsonk)
        - [pipe().in()](#pipeink-v)
        - [pipe().group()](#pipegroup)
    - [Ordered observable](#ordered-observable)
    - [Collector](#collector)
    - [Advanced Usage Example](#advanced-usage-example)
- [Methods](#methods)
    - [Observable](#observable)
    - [Observable.pipe()](#observablepipe)
    - [Inbound filters](#inbound-filters)
    - [Observable subscriber](#observable-subscriber)
    - [Ordered observable](#ordered-observable-1)
    - [Ordered observable subscriber](#ordered-observable-subscriber)
    - [Collector](#collector-1)
- [License](#license)

## EVG Observable vs RxJS

| Metric | EVG Observable | RxJS |
|--------|----------------|------|
| **Bundle size** | **6.4 kB** | 88 kB |
| **Size advantage** | **13.75x smaller** | - |
| **Operations** | ~40 | 100+ |
| **Performance** | **2-7x faster** | baseline |

### Performance Comparison (Bundle vs Bundle)

Benchmarked with minified bundles on Node.js v22.17.1 (v3.0.0 API, averaged over 3 clean runs):

| Test | EVG Observable | RxJS | Advantage |
|------|----------------|------|-----------|
| Emit 100 values | 1,662K ops/sec | 239K ops/sec | **7.0x faster** |
| Filter + transform | 340K ops/sec | 149K ops/sec | **2.3x faster** |
| 10 subscribers | 9,946K ops/sec | 3,500K ops/sec | **2.8x faster** |
| 100 subscribers | 1,236K ops/sec | 432K ops/sec | **2.9x faster** |
| 1000 subscribers | 124K ops/sec | 41K ops/sec | **3.0x faster** |
| Batch emission - of(100) | 906K ops/sec | 176K ops/sec | **5.1x faster** |
| 5 chained filters | 19K ops/sec | 9K ops/sec | **2.1x faster** |
| Large payload | 879K ops/sec | 184K ops/sec | **4.8x faster** |

<details>
<summary>Previous results (v2.x API, measured in different conditions)</summary>

| Test | EVG Observable | RxJS | Advantage |
|------|----------------|------|-----------|
| Emit 100 values | 1,548K ops/sec | 240K ops/sec | **6.4x faster** |
| Filter + transform | 353K ops/sec | 164K ops/sec | **2.1x faster** |
| 10 subscribers | 9,078K ops/sec | 2,900K ops/sec | **3.1x faster** |
| 100 subscribers | 1,245K ops/sec | 336K ops/sec | **3.7x faster** |
| 1000 subscribers | 122K ops/sec | 33K ops/sec | **3.7x faster** |
| Large payload | 865K ops/sec | 199K ops/sec | **4.3x faster** |

**Note**: v3.0.0 performance is equal or better than v2.x (emit: +7%, 10 subs: +10%). The API redesign with more flexible pipe system maintains excellent performance while providing enhanced functionality.
</details>

### EVG Observable Advantages

- **Dual filtering system** - Inbound (`addFilter`) + Outbound (`pipe`) filters
- **OR-logic in pipes** - `choice().or()` for branching logic
- **OR-logic in inbound filters** - `addFilter().choice().or()`
- **Observable-to-Observable subscription** - Direct subscription without adapters
- **OrderedObservable** - Subscribers with emission order control (not in RxJS)
- **Batch emission** - `.of()` method for array processing and `.in()` for object iteration
- **Multi-listener optimization** - `.group()` operator executes pipe once for N listeners
- **Collector** - Convenient subscription management
- **Clean code organization** - Simple, readable module structure

### When to use RxJS instead

RxJS is better when you need specialized operators like `debounceTime`, `throttleTime`, `switchMap`, `mergeMap`, `combineLatest`, `withLatestFrom`, or schedulers for async control.

**For 80% of reactive programming tasks, EVG Observable provides sufficient functionality with significant performance and size benefits.**

---

## EVG Observable vs Lightweight Competitors

Comparison with lightweight libraries in the same weight category (observable-fns):

| Metric | EVG Observable | observable-fns |
|--------|----------------|----------------|
| **Weekly downloads** | Growing | 67K |
| **Bundle size (minified)** | 6.3 kB | 10.8 kB |
| **Implementation** | Original architecture | zen-observable re-implementation |
| **Dependencies** | 0 | 0 |
| **Architecture** | True hot observables | Cold observables (zen-observable API) |

### Performance Comparison: Emissions

Basic emission performance across different subscriber counts (averaged over 3 clean runs):

| Scenario | EVG Observable | observable-fns | Advantage |
|----------|----------------|----------------|-----------|
| 1 emit × 1 subscriber | 53.8M ops/sec | 36.7M | **1.5x faster** |
| 1 emit × 10 subscribers | 14.3M ops/sec | 6.3M | **2.3x faster** |
| 1 emit × 100 subscribers | 1.70M ops/sec | 733K | **2.3x faster** |
| 1 emit × 1000 subscribers | 176K ops/sec | 73K | **2.4x faster** |
| 1 emit × 10000 subscribers | 16.1K ops/sec | 6.9K | **2.3x faster** |
| 100 emit × 1 subscriber | 1.02M ops/sec | 552K | **1.8x faster** |
| 100 emit × 100 subscribers | 17.5K ops/sec | 7.3K | **2.4x faster** |
| 1000 emit × 1000 subscribers | 179 ops/sec | 75 | **2.4x faster** |
| Large payload (complex objects) | 749K ops/sec | 549K | **1.4x faster** |
| Observable creation | 54.1M ops/sec | 17.2M | **3.1x faster** |

**Key Insights:**
- EVG Observable is consistently **1.4x-3.1x faster** across all emission scenarios
- Performance advantage remains stable from 1 to 10,000 subscribers
- Both libraries scale well for basic emission patterns
- EVG Observable's true hot observable architecture provides better performance for multi-subscriber scenarios

**When to choose EVG Observable:**
- Real-time data broadcasting (WebSocket, server events)
- Multiple active subscribers (2+)
- Performance-critical applications
- Hot observable patterns (subjects, event emitters)

**When to consider observable-fns:**
- Single subscriber scenarios
- Cold observable patterns (HTTP requests, async operations)
- Prefer functional programming style
- Need async filter/map handlers

*Full benchmark results including filter chains and transformations available in [benchmarks/benchmark-readme.md](./benchmarks/benchmark-readme.md)*

---

## What is EVG Observable?

EVG Observable is a robust, lightweight library designed for handling asynchronous events. What sets it apart is its
compact size alongside a wealth of powerful features that facilitate efficient event management. Here are some specific
features that make it stand out from the rest:

1. **Multi-observable subscription**: With EVG Observable, you are not limited to adding only listeners to your
   subscribers. Now, you have the option to add other observables as well.

2. **Multi-subscriber capability**: The library allows you to subscribe any number of subscribers to an observable. This
   works with both listeners and observables.

3. **Extended pipe chain**: The flexibility of EVG Observable extends to pipe chains as well. You can now add any number
   of filters in a pipe chain whereas previously you were limited to just one.

4. **Inbound and outbound filters**: In addition to existing outbound pipes, the library now supports inbound filters as
   well, providing you greater control over your data flow.

5. **Flexible switch-case in pipes**: Whether you are dealing with outbound pipes or inbound filters, a flexible
   switch-case logic has been introduced for better data handling.

## Installation

### Node.js

`EVG Observable` is available on [npm](http://npmjs.org). To install it, type:

    $ npm install evg_observable

### Browser

```html

<script src="https://unpkg.com/evg_observable/repo/evg_observable.js"></script>
```

# Usage

## Observable simple usage

```ts
import {Observable} from "evg_observable";

const observable$ = new Observable('Some typed data (not only string)');

const listener1 = (value: string) => console.log('listener1:', value);
const errorHandler1 = (errorData: any, errorMessage: any) => {
    console.log(`listener1 catch ERROR: data ${errorData}`, errorMessage);
};
const subscriber1 = observable$.subscribe(listener1, errorHandler1);

const listener2 = (value: string) => console.log('listener2:', value);
const subscriber2 = observable$.subscribe(listener2);

console.log(observable$.getValue());
// Print to console - Some typed data (not only string)

observable$.next('Next typed data');
// Print to console - listener1: Next typed data
// Print to console - listener2: Next typed data

// if subscribers are not needed
subscriber1.unsubscribe();
subscriber2.unsubscribe();

// if a observable$ is not needed
observable$.destroy(); // all subscribers have automatically unsubscribed

// also if observable$ needs to be used further, but subscribers are not needed, you can use the observable$.unsubscribeAll() method
```

### Browser simple usage

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="https://unpkg.com/evg_observable/repo/evg_observable.js"></script>
</head>
<body>
<script>
    const observable$ = new Observable('Some typed data (not only string)');

    const listener1 = (value) => console.log('listener1:', value);
    const subscriber1 = observable$.subscribe(listener1);

    const listener2 = (value) => console.log('listener2:', value);
    const subscriber2 = observable$.subscribe(listener2);

    console.log(observable$.getValue());
    // Print to console - Some typed data (not only string)

    observable$.next('Next typed data');
    // Print to console - listener1: Next typed data
    // Print to console - listener2: Next typed data

    // if subscribers are not needed
    subscriber1.unsubscribe();
    subscriber2.unsubscribe();

    // if an observable$ is not needed
    observable$.destroy(); // all subscribers have automatically unsubscribed

    // also if observable$ needs to be used further, but subscribers are not needed, you can use the observable$.unsubscribeAll() method
</script>
</body>
</html>
```

## Observable pipe usage

### pipe().once()

Observable will send a value to the subscriber only once, and the subscriber will unsubscribe.

```ts
import {Observable} from "evg_observable";

const observable$ = new Observable('Some typed data (not only string)');
const listener1 = (value: string) => console.log('listener1:', value);
const listener2 = (value: string) => console.log('listener2:', value);

const subscriber1 = observable$
    .pipe()
    .once()
    .subscribe(listener1);
const subscriber2 = observable$.subscribe(listener2);

console.log(observable$.getValue());
// Print to console - Some typed data (not only string)

observable$.next('Next1 typed data');
// Print to console - listener1: Next1 typed data
// Print to console - listener2: Next1 typed data

observable$.next('Next2 typed data');
// Print to console - listener2: Next2 typed data

// subscriber1 is automatically unsubscribed after first usage
```

### pipe().unsubscribeBy(condition)

Observable will send a value to the subscriber as long as the condition is negative, on the first positive result, the
subscriber will unsubscribe.

```ts
import {Observable} from "evg_observable";

type ISomeData = {
    message: string;
    isNeedUnsubscribe: boolean;
}

const observable$ = new Observable<ISomeData>({message: "some message", isNeedUnsubscribe: false});
const listener1 = (value: ISomeData) => console.log('listener1:', value);
const listener2 = (value: ISomeData) => console.log('listener2:', value);

observable$
    .pipe()
    .unsubscribeBy((data: ISomeData) => data.isNeedUnsubscribe)
    .subscribe(listener1);

observable$
    .subscribe(listener2);

console.log(observable$.getValue());

observable$.next({message: "some message1", isNeedUnsubscribe: false});
observable$.next({message: "some message2", isNeedUnsubscribe: false});
observable$.next({message: "some message3", isNeedUnsubscribe: true});

// logs:
// { message: 'some message', isNeedUnsubscribe: false }
// listener1: { message: 'some message1', isNeedUnsubscribe: false }
// listener2: { message: 'some message1', isNeedUnsubscribe: false }
// listener1: { message: 'some message2', isNeedUnsubscribe: false }
// listener2: { message: 'some message2', isNeedUnsubscribe: false }
// listener2: { message: 'some message3', isNeedUnsubscribe: true }
```

### pipe().and(condition)

Observable will send a value to the listener only if condition returns "true". There is no automatic unsubscription.

### pipe().toJson()

To convert the observable's data to JSON format, you can use the serialize method. This method turns the observer's
input data into a JSON string before sending them to subscribers.
Return Value: An ISetup&lt;string&gt; object.

Usage Example:

```ts
import {Observable} from "evg_observable";
type IPoint = { x: number, y: number };

const rawObject: IPoint = {x: 10, y: 20};
const listener = (data: string) => {
    console.log('Received data:', data); // Received data: {"x":10,"y":20}
};

const observable = new Observable<IPoint>(null);
observable
    .pipe()
    .toJson()
    .subscribe(listener);
observable.next(rawObject);
```

### pipe().fromJson&lt;K&gt;()

The fromJson method is used to convert data received from the observer from a JSON string back into a JavaScript
object.
Return Value: An ISetup&lt;K&gt; object, where K is the type of data resulting from the transformation.

Usage Example:

```ts
import {Observable} from "evg_observable";
type IPoint = { x: number, y: number };

const rawObject: IPoint = {x: 10, y: 20};
const json: string = JSON.stringify(rawObject);
const listener = (data: IPoint) => {
    console.log('Received data.x:', data.x); // Received data.x: 10
    console.log('Received data.y:', data.y); // Received data.y: 20
};

const observable = new Observable<string>("");
observable
    .pipe()
    .fromJson<IPoint>()
    .subscribe(listener);
observable.next(json);
```

## Ordered observable

Ordered observable - differs from Observable in that it allows you to emit messages in a given order. In general, they
are the same.

```ts
import {OrderedObservable} from "evg_observable";

const observable$ = new OrderedObservable('Some typed data (not only string)');
const listener1 = (value: string) => console.log('listener1:', value);
const listener2 = (value: string) => console.log('listener2:', value);
const listener3 = (value: string) => console.log('listener3:', value);
const listener4 = (value: string) => console.log('listener4:', value);
const listener5 = (value: string) => console.log('listener5:', value);

const subscriber1 = observable$.subscribe(listener1);
const subscriber2 = observable$.subscribe(listener2);
const subscriber3 = observable$.subscribe(listener3);
const subscriber4 = observable$.subscribe(listener4);
const subscriber5 = observable$.subscribe(listener5);

observable$.next('SOME DATA');
// Default emission behavior with default order = 0 for all subscribers
// Print to console - listener1: SOME DATA
// Print to console - listener2: SOME DATA
// Print to console - listener3: SOME DATA
// Print to console - listener4: SOME DATA
// Print to console - listener5: SOME DATA

// We can change the default order of emission
subscriber1.order = 50;
subscriber2.order = 40;
subscriber3.order = 30;
subscriber4.order = 20;
subscriber5.order = 10;
observable$.next('SOME DATA');
// Print to console - listener5: SOME DATA
// Print to console - listener4: SOME DATA
// Print to console - listener3: SOME DATA
// Print to console - listener2: SOME DATA
// Print to console - listener1: SOME DATA

// Also we can use observable$.descendingSort() or observable$.ascendingSort()

//Thus, we can control the order in which the data is received by the listeners.
```

## Collector

You can also use the subscriber collector for convenience.

```ts
import {Observable} from "evg_observable";
import {Collector} from "evg_observable";

const collector = new Collector();
const observable$ = new Observable('Some typed data (not only string)');
const listener1 = (value: string) => console.log('listener1:', value);
const listener2 = (value: string) => console.log('listener2:', value);
const listener3 = (value: string) => console.log('listener3:', value);
const listener4 = (value: string) => console.log('listener4:', value);
const listener5 = (value: string) => console.log('listener5:', value);

collector.collect(
    observable$.subscribe(listener1),
    observable$.subscribe(listener2),
    observable$.subscribe(listener3),
    observable$.subscribe(listener4),
    observable$.subscribe(listener5)
);

observable$.next('SOME DATA');
// Default emission behavior with default order = 0 for all subscribers
// Print to console - listener1: SOME DATA
// Print to console - listener2: SOME DATA
// Print to console - listener3: SOME DATA
// Print to console - listener4: SOME DATA
// Print to console - listener5: SOME DATA

// ... some code ...
// ... some code ...
// ... some code ...

collector.destroy();
observable$.next('SOME DATA');
// NOTHING Print to console 

// All subscribers automatically unsubscribes
// Also, if there is a need to use the collector further, instead of destroying it, you can use collector.unsubscribeAll().
// To unsubscribe one subscriber, you can use: collector.unsubscribe(subscriber).
```

### Advanced Usage Example

The following TypeScript example demonstrates how the extended implementation could be used, incorporating all the new
updates:

```typescript
// Import the Observable library
import {Observable} from "evg_observable";

// Constants representing different hair colors
const HAIR = {
    BLOND: "BLOND",
    BLACK: "BLACK",
    BROWN: "BROWN",
}

// Constants for gender
const GENDER = {
    MAN: "MAN",
    WOMAN: "WOMAN"
}

// Constants for different occupations
const MAJOR = {
    DOCTOR: "DOCTOR",
    DRIVER: "DRIVER",
    CHILD: "CHILD",
}

// Definition of the "Person" class
class Person {
    constructor(
        public name: string,
        public age: number,
        public gender: string,
        public major: string,
        public hairColor: string) {

        this.hairColor = hairColor;
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.major = major;
    }
}

// Create Observables for individual person, men and women
const personal$ = new Observable<Person>(null);
const men$ = new Observable<Person>(null)
const women$ = new Observable<Person>(null)

// Define various filters to be used later
const youngAgeFilter = (person: Person) => person.age > 17;
const oldAgeFilter = (person: Person) => person.age < 60;
const menFilter = (person: Person) => person.gender === GENDER.MAN;
const womenFilter = (person: Person) => person.gender === GENDER.WOMAN;
const blondFilter = (person: Person) => person.hairColor === HAIR.BLOND;
const blackFilter = (person: Person) => person.hairColor === HAIR.BLACK;
const personValidationFilters = [
    (person: Person) => !!person,
    (person: Person) => "name" in person,
    (person: Person) => "age" in person,
    (person: Person) => "gender" in person,
    (person: Person) => "major" in person,
    (person: Person) => "hairColor" in person,
];

// Callback function to execute when some man is ready to work
const manReadyToWork = (worker: Person) => {
    console.log("MAN ==> is ready to work:", worker.name, worker.age, worker.major);
};

// Callback function to execute when some woman is ready to work
const womanReadyToWork = (worker: Person) => {
    console.log("WOMAN ==> is ready to work:", worker.name, worker.age, worker.major);
};

// Callback function to execute for people with black or blond hair
const blondAndBlack = (person: Person) => {
    console.log("PERSON ==> only black or blond:", person.name, person.age, person.hairColor);
};

// Apply the filters to men$ and women$
men$.addFilter()
    .allOf(personValidationFilters)
    .and(menFilter);

women$.addFilter()
    .allOf(personValidationFilters)
    .and(womenFilter);

// Subscribe the callback function to the created Observables
men$.pipe()
    .allOf(personValidationFilters)
    .subscribe(manReadyToWork);
women$.pipe()
    .allOf(personValidationFilters)
    .subscribe(womanReadyToWork);

// Stream the list of people by applying the age filters
personal$.pipe()
    .and(youngAgeFilter)
    .and(oldAgeFilter)
    .subscribe([men$, women$]);

// Stream the list of people considering the hair color
personal$.pipe()
    .choice()
    .or(blackFilter)
    .or(blondFilter)
    .subscribe(blondAndBlack);

// Start streaming the list of people
personal$.of([
    new Person('Alex', 35, GENDER.MAN, MAJOR.DOCTOR, HAIR.BLOND),
    new Person('John', 45, GENDER.MAN, MAJOR.DRIVER, HAIR.BLACK),
    new Person('Alice', 30, GENDER.WOMAN, MAJOR.DOCTOR, HAIR.BROWN),
    new Person('Sophia', 36, GENDER.WOMAN, MAJOR.DRIVER, HAIR.BLOND),
    new Person('Matthew', 15, GENDER.MAN, MAJOR.CHILD, HAIR.BROWN),
    new Person('Emily', 17, GENDER.WOMAN, MAJOR.CHILD, HAIR.BLACK),
    new Person('James', 40, GENDER.MAN, MAJOR.DOCTOR, HAIR.BLOND),
    new Person('Emma', 35, GENDER.WOMAN, MAJOR.DRIVER, HAIR.BROWN),
    new Person('Michael', 15, GENDER.MAN, MAJOR.CHILD, HAIR.BLACK),
    new Person('Olivia', 16, GENDER.WOMAN, MAJOR.CHILD, HAIR.BLOND)
]);

// This is the result of handling persons:
// MAN ==> is ready to work: Alex 35 DOCTOR
// PERSON ==> only black or blond: Alex 35 BLOND
// MAN ==> is ready to work: John 45 DRIVER
// PERSON ==> only black or blond: John 45 BLACK
// WOMAN ==> is ready to work: Alice 30 DOCTOR
// WOMAN ==> is ready to work: Sophia 36 DRIVER
// PERSON ==> only black or blond: Sophia 36 BLOND
// PERSON ==> only black or blond: Emily 17 BLACK
// MAN ==> is ready to work: James 40 DOCTOR
// PERSON ==> only black or blond: James 40 BLOND
// WOMAN ==> is ready to work: Emma 35 DRIVER
// PERSON ==> only black or blond: Michael 15 BLACK
// PERSON ==> only black or blond: Olivia 16 BLOND
```

In this example, we are using the Observable Library to handle a list of people, applying various filters to deal with
different scenarios. This flexibility and ability to handle complex, intersecting conditions is what makes EVG
Observable an invaluable tool for managing asynchronous events.
Built with the developer's needs in mind, EVG Observable provides a wealth of capabilities at your disposal, making
event handling a breeze.

Here is an advanced example of the `pipe` usage which introduces a method called `map`. It allows transforming
payload data in the pipe chain by applying a user callback function.

Here is the syntax:

```typescript
import {Observable} from "evg_observable";

const targetObservable$ = new Observable("");
const targetListener = (num: number) => console.log(num);

targetObservable$
    .pipe()
    .and(str => str.includes("2"))      // check if a string contains "2"
    .map<number>(str => str.length)       // transform the string to its length
    .and(num => num > 4)                // filter out the lengths that is greater than 4
    .map<number>(num => num * 2)          // multiply the length by 2
    .once()                             // make sure this action only happens once
    .subscribe(targetListener);            // subscribe the listener to the observable

targetObservable$.of([
    "1",
    "12",
    "123",
    "123",
    "1234",
    "12345",
    "12345",
    "12345",
    "12345",
    "12345",
    "12345",
    "12345",
]);
```

In this example, the observable is first filtered with a condition to check for a string that includes "2". This string,
if it passes the condition, is then transformed into its length via a map invocation. Further, this length is filtered
down to lengths that are greater than 4. The lengths that pass this condition are thus doubled and the resulting
observable is set to be a once-off observable to which a listener is subscribed.

### pipe().in&lt;K, V&gt;()

The `in()` operator iterates over object properties, emitting values (or transformed values) for each key-value pair. This is useful for processing object data streams.

Usage Example:

```typescript
import {Observable} from "evg_observable";

type User = { name: string; age: number };
const users: Record<string, User> = {
    user1: { name: "Alice", age: 30 },
    user2: { name: "Bob", age: 25 },
    user3: { name: "Charlie", age: 35 }
};

const observable$ = new Observable<Record<string, User>>(users);
const listener = (user: User) => console.log('User:', user.name, user.age);

observable$
    .pipe()
    .in<string, User>()  // Iterate over object, emit each value
    .subscribe(listener);

// Output:
// User: Alice 30
// User: Bob 25
// User: Charlie 35
```

You can also transform values during iteration:

```typescript
const upperCaseListener = (name: string) => console.log('Name:', name);

observable$
    .pipe()
    .in<string, User>((user) => user.name.toUpperCase())  // Transform each value
    .subscribe(upperCaseListener);

// Output:
// Name: ALICE
// Name: BOB
// Name: CHARLIE
```

### pipe().group()

The `group()` operator provides multi-listener optimization. When multiple listeners need to receive the same processed value, `group()` executes the pipe chain only once and distributes the result to all listeners.

**Key benefit**: For N listeners, pipe executes 1 time instead of N times.

Usage Example:

```typescript
import {Observable} from "evg_observable";

const observable$ = new Observable<number>(0);

let transformCount = 0;
const expensiveTransform = (x: number) => {
    transformCount++;
    return x * x;  // Simulate expensive operation
};

// Create group subscription
const group = observable$
    .pipe()
    .and((x) => x > 0)                    // Filter
    .map<number>(expensiveTransform)      // Transform (executes once per emission)
    .group();

// Add multiple listeners - they all share the same pipe result
group.add((x) => console.log('Listener 1:', x));
group.add((x) => console.log('Listener 2:', x));
group.add((x) => console.log('Listener 3:', x));

observable$.next(5);  // transformCount = 1 (not 3!)

// Output:
// Listener 1: 25
// Listener 2: 25
// Listener 3: 25
// transformCount = 1
```

With error handling per listener:

```typescript
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

observable$.next(5);   // Both listeners receive
observable$.next(-1);  // Listener 1 throws, listener 2 still receives
```

## Methods

### Observable

| method                     | will return           | description                                                                      |
|:---------------------------|:----------------------|:---------------------------------------------------------------------------------|
| `.subscribe(listener)`     | subscriber            | subscribe listener to observable                                                 |
| `.unSubscribe(subscriber)` | void                  | unsubscribe listener from observable                                             |
| `.unsubscribeAll()`        | void                  | unsubscribe all listeners from the current observable                            |
| `.next(value)`             | void                  | emit data to listeners                                                           |
| `.of(value[])`         | void                  | pass data to listeners in parts of the array                                     |
| `.getValue()`              | value                 | will return the last value sent, or the value that was set during initialization |
| `.size()`                  | number                | will return the current number of subscribers                                    |
| `.disable()`               | void                  | disable emission                                                                 |
| `.enable()`                | void                  | enable emission                                                                  |
| `.isEnable`                | boolean               | read-only field that shows the state of the observer                             |
| `.destroy()`               | void                  | unsubscribe all listeners from the current observable and destroy it             |
| `.isDestroyed`             | boolean               | read-only field that shows the kill state of the observer                        |
| `.pipe()`                  | pipe condition object | returns an object with which you can customize the subscriber's behavior         |

### Observable`.pipe()`

| method                               | will return                            | description                                                                                                                                                                                                             |
|:-------------------------------------|:---------------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `.once()`                         | pipe object                            | observable will send a value to the subscriber only once, and the subscriber will unsubscribe.                                                                                                                          |
| `.unsubscribeBy(*condition)`         | pipe object                            | observable will send a value to the subscriber as long as the condition is negative, on the first positive result, the subscriber will unsubscribe                                                                      |
| `.and(*condition)`                | pipe object                            | observable will send a value to the listener only if condition returns "true", there is no automatic unsubscription                                                                                                     |
| `.allOf(*conditions)`         | pipe object                            | This method allows you to add a group of conditions for filtering data in the pipeline chain.                                                                                                                           |
| `.choice()`                          | SwitchCase object                      | transitions the pipe into switch-case mode. In this mode, only the first condition that returns a positive result is triggered, and all others are ignored. This allows you to handle multiple cases more conveniently. |
| `.or(*condition)`                  | PipeCase object                        | Adds a condition to the chain of cases. The entire chain operates on the principle of "OR". This is different from other pipe methods which, when chained, operate on the principle of "AND".                           |
| `.anyOf(*conditions)`            | PipeCase object                        | This method allows you to add a group of conditions for filtering cases data in the pipeline chain.                                                                                                                     |
| `.map<K>(transform: ICallback<T>)`  | Observable instance with new data type | This method allows transforming payload data in the pipe chain by applying user callback function. `transform` should be a function that takes the current data and returns transformed data of possibly another type.  |
| `.toJson()`                       | pipe object                            | Converts the observers data into a JSON string.                                                                                                                                                                         |
| `.fromJson<K>()`                  | pipe object                            | Converts a JSON string into an object of type K.                                                                                                                                                                        |
| `.of<K, V>(transform?: ICallback<K>)`| pipe object                            | Iterates over array elements. For each element, emits it to subscribers. Optional transform function processes each element before emission.                                                                             |
| `.in<K, V>(transform?: ICallback<V>)`| pipe object                            | Iterates over object key-value pairs. For each key, emits the value to subscribers. Optional transform function processes each value before emission.                                                                   |
| `.group()`                           | IGroupSubscription                     | Creates a group subscription for multi-listener optimization. Pipe chain executes once, result is shared with all listeners added via `.add()`. Type finalizer - no further operators can be chained.                   |
| `.subscribe(listener)`               | subscriber                             | subscribe listener to observable                                                                                                                                                                                        |

_*condition_ - this is a function that should return a value that will affect the behavior of the subscriber

### Inbound filters

| Method                      | Will Return          | Description                                                                                                                                                                       |
|:----------------------------|:---------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `.addFilter()`              | InboundFilter object | Transitions the Observable into the mode of adding inbound filters.                                                                                                               |
| `.and(*condition)`       | InboundFilter object | Part of the filter chain that operates on the principle of "AND". If the condition returns `true`, the filter passes the data along the chain.                                    |
| `.allOf(*conditions)` | InboundFilter object | This method allows you to add a group of conditions for filtering data in the chain.                                                                                              |
| `.choice()`                 | InboundFilter object | Transitions the filter into switch-case mode. In this mode, only the first condition that returns a positive result is triggered, and all others are ignored.                     
| `.or(*condition)`         | InboundFilter object | Adds a condition to the chain of cases that operate on the principle of "OR". This is different from other filter methods which, when chained, operate on the principle of "AND". |
| `.anyOf(*conditions)`   | InboundFilter object | This method allows you to add a group of conditions for filtering cases data in the chain.                                                                                        |

_*condition_ - this is a function that should return a value that will affect the behavior of the subscriber

### Observable subscriber

| method           | will return | description                          |
|:-----------------|:------------|:-------------------------------------|
| `.unsubscribe()` | void        | unsubscribe listener from observable |

### Ordered observable

Has the same methods as Observable.

### Ordered observable subscriber

Has the same methods as subscriber. But there is an "order" field and two new methods.

| field    | type   | description                                                                                                                                                                           |
|:---------|:-------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `.order` | number | Determines the order in which the subscriber is called, the subscriber with the lowest ordinal number is called first, the subscriber with the highest ordinal number is called last. |

| method                 | will return | description                  |
|:-----------------------|:------------|:-----------------------------|
| `.ascendingSort()`  | boolean     | set order by ascending sort  |
| `.descendingSort()` | boolean     | set order by descending sort |

### Collector

| method                      | will return | description                                        |
|:----------------------------|:------------|:---------------------------------------------------|
| `.collect( ...subscribers)` | void        | collects subscribers                               |
| `.unsubscribe(subscriber)`  | void        | unsubscribe a subscriber from it's observable      |
| `.unsubscribeAll()`         | void        | unsubscribe all subscribers from their observables |
| `.destroy()`                | void        | unsubscribe all subscribers and destroy collector  |

## License

MIT
