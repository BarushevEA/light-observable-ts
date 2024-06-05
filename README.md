[![Socket Badge](https://socket.dev/api/badge/npm/package/evg_observable)](https://socket.dev/npm/package/evg_observable)
<h1 align=center style="color: saddlebrown">
EVG Observable
</h1>
<p align=center>
EVG Observable - is a light library for simple use.
</p>

## Navigation

- [What is EVG Observable?](#what-is-evg-observable)
- [Installation](#installation)
    - [Node.js](#nodejs)
    - [Browser](#browser)
- [Usage](#usage)
    - [Observable simple usage](#observable-simple-usage)
    - [Browser simple usage](#browser-simple-usage)
    - [Observable pipe usage](#observable-pipe-usage)
    - [Ordered observable](#ordered-observable)
    - [Collector](#collector)
    - [Advanced Usage Example](#advanced-usage-example)
- [Methods](#methods)
    - [Observable](#observable)
    - [Observable.pipe()](#observablepipe)
    - [Observable subscriber](#observable-subscriber)
    - [Ordered observable](#ordered-observable-1)
    - [Ordered observable subscriber](#ordered-observable-subscriber)
    - [Collector](#collector-1)
- [License](#license)

## What is EVG Observable?

EVG Observable is a robust, lightweight library designed for handling asynchronous events. What sets it apart is its compact size alongside a wealth of powerful features that facilitate efficient event management. Here are some specific features that make it stand out from the rest:

1. **Multi-observable subscription**: With EVG Observable, you are not limited to adding only listeners to your subscribers. Now, you have the option to add other observables as well.

2. **Multi-subscriber capability**: The library allows you to subscribe any number of subscribers to an observable. This works with both listeners and observables.

3. **Extended pipe chain**: The flexibility of EVG Observable extends to pipe chains as well. You can now add any number of filters in a pipe chain whereas previously you were limited to just one.

4. **Inbound and outbound filters**: In addition to existing outbound pipes, the library now supports inbound filters as well, providing you greater control over your data flow.

5. **Flexible switch-case in pipes**: Whether you are dealing with outbound pipes or inbound filters, a flexible switch-case logic has been introduced for better data handling.

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
import {Observable} from "evg_observable/src/outLib/Observable";

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

    // if a observable$ is not needed
    observable$.destroy(); // all subscribers have automatically unsubscribed

    // also if observable$ needs to be used further, but subscribers are not needed, you can use the observable$.unsubscribeAll() method
</script>
</body>
</html>
```

## Observable pipe usage

### pipe().setOnce()

Observable will send a value to the subscriber only once, and the subscriber will unsubscribe.

```ts
import {Observable} from "evg_observable/src/outLib/Observable";

const observable$ = new Observable('Some typed data (not only string)');
const listener1 = (value: string) => console.log('listener1:', value);
const listener2 = (value: string) => console.log('listener2:', value);

const subscriber1 = observable$
    .pipe()
    .setOnce()
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

### pipe().unsubscribeByNegative(condition)

Observable will send a value to the subscriber as long as the condition is positive, on the first negative result, the
subscriber will unsubscribe.

```ts
import {Observable} from "evg_observable/src/outLib/Observable";

const observable$ = new Observable('Some typed data (not only string)');
const listener1 = (value: string) => console.log('listener1:', value);
const listener2 = (value: string) => console.log('listener2:', value);
let isPositive = true;

const subscriber1 = observable$
    .pipe()
    .unsubscribeByNegative(() => isPositive)
    .subscribe(listener1);
const subscriber2 = observable$.subscribe(listener2);

console.log(observable$.getValue());
// Print to console - Some typed data (not only string)

observable$.next('Next1 typed data');
// Print to console - listener1: Next1 typed data
// Print to console - listener2: Next1 typed data

observable$.next('Next2 typed data');
// Print to console - listener1: Next2 typed data
// Print to console - listener2: Next2 typed data

isPositive = false;
observable$.next('Next3 typed data');
// Print to console - listener2: Next3 typed data

// subscriber1 is automatically unsubscribed when negative condition
```

### pipe().unsubscribeByPositive(condition)

Observable will send a value to the subscriber as long as the condition is negative, on the first positive result, the
subscriber will unsubscribe.

```ts
import {Observable} from "evg_observable/src/outLib/Observable";

const observable$ = new Observable('Some typed data (not only string)');
const listener1 = (value: string) => console.log('listener1:', value);
const listener2 = (value: string) => console.log('listener2:', value);
let isPositive = false;

const subscriber1 = observable$
    .pipe()
    .unsubscribeByPositive(() => isPositive)
    .subscribe(listener1);
const subscriber2 = observable$.subscribe(listener2);

console.log(observable$.getValue());
// Print to console - Some typed data (not only string)

observable$.next('Next1 typed data');
// Print to console - listener1: Next1 typed data
// Print to console - listener2: Next1 typed data

observable$.next('Next2 typed data');
// Print to console - listener1: Next2 typed data
// Print to console - listener2: Next2 typed data

isPositive = true;
observable$.next('Next3 typed data');
// Print to console - listener2: Next3 typed data

// subscriber1 is automatically unsubscribed when positive condition
```

### pipe().emitByNegative(condition)

Observable will send a value to the listener only if condition returns "false". There is no automatic unsubscription.

### pipe().emitByPositive(condition)

Observable will send a value to the listener only if condition returns "true". There is no automatic unsubscription.

### pipe().emitMatch(condition)

Observable will send a value to the subscriber only if the return value of the condition matches the data being sent. In
this case, there is no automatic unsubscription.

```ts
import {Observable} from "evg_observable/src/outLib/Observable";

const observable$ = new Observable('Some typed data (not only string)');
const listener1 = (value: string) => console.log('listener1:', value);
const listener2 = (value: string) => console.log('listener2:', value);
const TARGET_DATA = 'TARGET_DATA';

const subscriber1 = observable$
    .pipe()
    .emitMatch(() => TARGET_DATA)
    .subscribe(listener1);
const subscriber2 = observable$.subscribe(listener2);

console.log(observable$.getValue());
// Print to console - Some typed data (not only string)

observable$.next('Next1 typed data');
// Print to console - listener2: Next1 typed data

observable$.next('Next2 typed data');
// Print to console - listener2: Next2 typed data

observable$.next(TARGET_DATA);
// Print to console - listener1: TARGET_DATA
// Print to console - listener2: TARGET_DATA

observable$.next('Next4 typed data');
// Print to console - listener2: Next4 typed data

observable$.next(TARGET_DATA);
// Print to console - listener1: TARGET_DATA
// Print to console - listener2: TARGET_DATA
```

## Ordered observable

Ordered observable - differs from Observable in that it allows you to emit messages in a given order. In general, they
are the same.

```ts
import {OrderedObservable} from "evg_observable/src/outLib/OrderedObservable";

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

// Also we can use observable$.setDescendingSort() or observable$.setAscendingSort()

//Thus, we can control the order in which the data is received by the listeners.
```

## Collector

You can also use the subscriber collector for convenience.

```ts
import {Observable} from "evg_observable/src/outLib/Observable";
import {Collector} from "evg_observable/src/outLib/Collector";

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

The following TypeScript example demonstrates how the extended implementation could be used, incorporating all the new updates:

```typescript
// Import the Observable library
import {Observable} from "evg_observable/src/outLib/Observable";

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
    .filter(menFilter);

women$.addFilter()
    .filter(womenFilter);

// Subscribe the callback function to the created Observables
men$.subscribe(manReadyToWork);
women$.subscribe(womanReadyToWork);

// Stream the list of people by applying the age filters
personal$.pipe()
    .emitByPositive(youngAgeFilter)
    .emitByPositive(oldAgeFilter)
    .subscribe([men$, women$]);

// Stream the list of people considering the hair color
personal$.pipe()
    .switch()
    .case(blackFilter)
    .case(blondFilter)
    .subscribe(blondAndBlack);

// Start streaming the list of people
personal$.stream([
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
In this example, we are using the Observable Library to handle a list of people, applying various filters to deal with different scenarios. This flexibility and ability to handle complex, intersecting conditions is what makes EVG Observable an invaluable tool for managing asynchronous events.
Built with the developer's needs in mind, EVG Observable provides a wealth of capabilities at your disposal, making event handling a breeze.

## Methods

### Observable

| method                     | will return | description |
|:---------------------------| :--- | :--- |
| `.subscribe(listener)`     | subscriber | subscribe listener to observable |
| `.unSubscribe(subscriber)` | void | unsubscribe listener from observable |
| `.unsubscribeAll()`        | void | unsubscribe all listeners from the current observable |
| `.next(value)`             | void | emit data to listeners |
| `.stream(value[])`         | void | pass data to listeners in parts of the array |
| `.getValue()`              | value | will return the last value sent, or the value that was set during initialization |
| `.size()`                  | number | will return the current number of subscribers |
| `.disable()`               | void | disable emission |
| `.enable()`                | void | enable emission |
| `.isEnable`                | boolean | read-only field that shows the state of the observer |
| `.destroy()`               | void | unsubscribe all listeners from the current observable and destroy it |
| `.isDestroyed`             | boolean | read-only field that shows the kill state of the observer |
| `.pipe()`                  | pipe condition object | returns an object with which you can customize the subscriber's behavior |

### Observable`.pipe()`

| method | will return | description |
| :--- | :--- | :--- |
| `.setOnce()` | pipe subscribe object | observable will send a value to the subscriber only once, and the subscriber will unsubscribe. |
| `.unsubscribeByNegative(*condition)` | pipe subscribe object | observable will send a value to the subscriber as long as the condition is positive, on the first negative result, the subscriber will unsubscribe |
| `.unsubscribeByPositive(*condition)` | pipe subscribe object | observable will send a value to the subscriber as long as the condition is negative, on the first positive result, the subscriber will unsubscribe |
| `.emitByNegative(*condition)` | pipe subscribe object | observable will send a value to the listener only if condition returns "false", there is no automatic unsubscription |
| `.emitByPositive(*condition)` | pipe subscribe object | observable will send a value to the listener only if condition returns "true", there is no automatic unsubscription |
| `.emitMatch(*condition)` | pipe subscribe object | observable will send a value to the subscriber only if the return value of the condition matches the data being sent, in this case, there is no automatic unsubscription |
| `.subscribe(listener)` | subscriber | subscribe listener to observable |

_*condition_ - this is a function that should return a value that will affect the behavior of the subscriber

### Observable subscriber

| method | will return | description |
| :--- | :--- | :--- |
| `.unsubscribe()` | void | unsubscribe listener from observable |

### Ordered observable

Has the same methods as Observable.

### Ordered observable subscriber

Has the same methods as subscriber. But there is an "order" field and two new methods.

| field | type | description |
| :--- | :--- | :--- |
| `.order` | number | Determines the order in which the subscriber is called, the subscriber with the lowest ordinal number is called first, the subscriber with the highest ordinal number is called last. |


| method | will return | description                  |
| :--- | :--- |:-----------------------------|
| `.setAscendingSort()` | boolean | set order by ascending sort  |
| `.setDescendingSort()` | boolean | set order by descending sort |

### Collector

| method | will return | description |
| :--- | :--- | :--- |
| `.collect( ...subscribers)` | void | collects subscribers |
| `.unsubscribe(subscriber)` | void | unsubscribe a subscriber from it's observable |
| `.unsubscribeAll()` | void | unsubscribe all subscribers from their observables |
| `.destroy()` | void | unsubscribe all subscribers and destroy collector|

## License

MIT
