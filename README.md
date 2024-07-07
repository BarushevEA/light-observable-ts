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
    - [Inbound filters](#inbound-filters)
    - [Observable subscriber](#observable-subscriber)
    - [Ordered observable](#ordered-observable-1)
    - [Ordered observable subscriber](#ordered-observable-subscriber)
    - [Collector](#collector-1)
- [License](#license)

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

    // if an observable$ is not needed
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

### pipe().unsubscribeBy(condition)

Observable will send a value to the subscriber as long as the condition is negative, on the first positive result, the
subscriber will unsubscribe.

```ts
import {Observable} from "evg_observable/src/outLib/Observable";

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

### pipe().refine(condition)

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

### pipe().serialize()

To convert the observable's data to JSON format, you can use the serialize method. This method turns the observer's
input data into a JSON string before sending them to subscribers.
Return Value: An ISetup&lt;string&gt; object.

Usage Example:

```ts
import {Observable} from "evg_observable/src/outLib/Observable";
type IPoint = { x: number, y: number };

const rawObject: IPoint = {x: 10, y: 20};
const listener = (data: string) => {
    console.log('Received data:', data); // Received data: {"x":10,"y":20}
};

const observable = new Observable<IPoint>(null);
observable
    .pipe()
    .serialize()
    .subscribe(listener);
observable.next(rawObject);
```

### pipe().deserialize&lt;K&gt;()

The deserialize method is used to convert data received from the observer from a JSON string back into a JavaScript
object.
Return Value: An ISetup&lt;K&gt; object, where K is the type of data resulting from the transformation.

Usage Example:

```ts
import {Observable} from "evg_observable/src/outLib/Observable";
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
    .deserialize<IPoint>()
    .subscribe(listener);
observable.next(json);
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

The following TypeScript example demonstrates how the extended implementation could be used, incorporating all the new
updates:

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
    .pushFilters(personValidationFilters)
    .filter(menFilter);

women$.addFilter()
    .pushFilters(personValidationFilters)
    .filter(womenFilter);

// Subscribe the callback function to the created Observables
men$.pipe()
    .pushRefiners(personValidationFilters)
    .subscribe(manReadyToWork);
women$.pipe()
    .pushRefiners(personValidationFilters)
    .subscribe(womanReadyToWork);

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

In this example, we are using the Observable Library to handle a list of people, applying various filters to deal with
different scenarios. This flexibility and ability to handle complex, intersecting conditions is what makes EVG
Observable an invaluable tool for managing asynchronous events.
Built with the developer's needs in mind, EVG Observable provides a wealth of capabilities at your disposal, making
event handling a breeze.

Here is an advanced example of the `pipe` usage which introduces a new method called `then`. It allows transforming
payload data in the pipe chain by applying a user callback function.

Here is the syntax:

```typescript
const targetObservable$ = new Observable("");
const targetListener = (num: number) => console.log(num);

targetObservable$
    .pipe()
    .refine(str => str.includes("2"))      // check if a string contains "2"
    .then<number>(str => str.length)       // transform the string to its length
    .refine(num => num > 4)                // filter out the lengths that is greater than 4
    .then<number>(num => num * 2)          // multiply the length by 2
    .setOnce()                             // make sure this action only happens once
    .subscribe(targetListener);            // subscribe the listener to the observable

targetObservable$.stream([
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

In this example, the observable is first refined with a condition to check for a string that includes "2". This string,
if it passes the condition, is then transformed into its length via a then invocation. Further, this length is filtered
down to lengths that are greater than 4. The lengths that pass this condition are thus doubled and the resulting
observable is set to be a once-off observable to which a listener is subscribed. `

## Methods

### Observable

| method                     | will return           | description                                                                      |
|:---------------------------|:----------------------|:---------------------------------------------------------------------------------|
| `.subscribe(listener)`     | subscriber            | subscribe listener to observable                                                 |
| `.unSubscribe(subscriber)` | void                  | unsubscribe listener from observable                                             |
| `.unsubscribeAll()`        | void                  | unsubscribe all listeners from the current observable                            |
| `.next(value)`             | void                  | emit data to listeners                                                           |
| `.stream(value[])`         | void                  | pass data to listeners in parts of the array                                     |
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
| `.setOnce()`                         | pipe object                            | observable will send a value to the subscriber only once, and the subscriber will unsubscribe.                                                                                                                          |
| `.unsubscribeByNegative(*condition)` | pipe object                            | observable will send a value to the subscriber as long as the condition is positive, on the first negative result, the subscriber will unsubscribe                                                                      |
| `.unsubscribeByPositive(*condition)` | pipe object                            | observable will send a value to the subscriber as long as the condition is negative, on the first positive result, the subscriber will unsubscribe                                                                      |
| `.unsubscribeBy(*condition)`         | pipe object                            | observable will send a value to the subscriber as long as the condition is negative, on the first positive result, the subscriber will unsubscribe                                                                      |
| `.emitByNegative(*condition)`        | pipe object                            | observable will send a value to the listener only if condition returns "false", there is no automatic unsubscription                                                                                                    |
| `.emitByPositive(*condition)`        | pipe object                            | observable will send a value to the listener only if condition returns "true", there is no automatic unsubscription                                                                                                     |
| `.refine(*condition)`                | pipe object                            | observable will send a value to the listener only if condition returns "true", there is no automatic unsubscription                                                                                                     |
| `.pushRefiners(*conditions)`         | pipe object                            | This method allows you to add a group of conditions for filtering data in the pipeline chain.                                                                                                                           |
| `.emitMatch(*condition)`             | pipe object                            | observable will send a value to the subscriber only if the return value of the condition matches the data being sent, in this case, there is no automatic unsubscription                                                |
| `.switch()`                          | SwitchCase object                      | transitions the pipe into switch-case mode. In this mode, only the first condition that returns a positive result is triggered, and all others are ignored. This allows you to handle multiple cases more conveniently. |
| `.case(*condition)`                  | PipeCase object                        | Adds a condition to the chain of cases. The entire chain operates on the principle of "OR". This is different from other pipe methods which, when chained, operate on the principle of "AND".                           |
| `.pushCases(*conditions)`            | PipeCase object                        | This method allows you to add a group of conditions for filtering cases data in the pipeline chain.                                                                                                                     |
| `.then<K>(condition: ICallback<T>)`  | Observable instance with new data type | This method allows transforming payload data in the pipe chain by applying user callback function. `condition` should be a function that takes the current data and returns transformed data of possibly another type.  |
| `.serialize()`                       | pipe object                            | Converts the observers data into a JSON string.                                                                                                                                                                         |
| `.deserialize<K>()`                  | pipe object                            | Converts a JSON string into an object of type K.                                                                                                                                                                        |
| `.subscribe(listener)`               | subscriber                             | subscribe listener to observable                                                                                                                                                                                        |

_*condition_ - this is a function that should return a value that will affect the behavior of the subscriber

### Inbound filters

| Method                      | Will Return          | Description                                                                                                                                                                       |
|:----------------------------|:---------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `.addFilter()`              | InboundFilter object | Transitions the Observable into the mode of adding inbound filters.                                                                                                               |
| `.filter(*condition)`       | InboundFilter object | Part of the filter chain that operates on the principle of "AND". If the condition returns `true`, the filter passes the data along the chain.                                    |
| `.pushFilters(*conditions)` | InboundFilter object | This method allows you to add a group of conditions for filtering data in the chain.                                                                                              |
| `.switch()`                 | InboundFilter object | Transitions the filter into switch-case mode. In this mode, only the first condition that returns a positive result is triggered, and all others are ignored.                     
| `.case(*condition)`         | InboundFilter object | Adds a condition to the chain of cases that operate on the principle of "OR". This is different from other filter methods which, when chained, operate on the principle of "AND". |
| `.pushCases(*conditions)`   | InboundFilter object | This method allows you to add a group of conditions for filtering cases data in the chain.                                                                                        |

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
| `.setAscendingSort()`  | boolean     | set order by ascending sort  |
| `.setDescendingSort()` | boolean     | set order by descending sort |

### Collector

| method                      | will return | description                                        |
|:----------------------------|:------------|:---------------------------------------------------|
| `.collect( ...subscribers)` | void        | collects subscribers                               |
| `.unsubscribe(subscriber)`  | void        | unsubscribe a subscriber from it's observable      |
| `.unsubscribeAll()`         | void        | unsubscribe all subscribers from their observables |
| `.destroy()`                | void        | unsubscribe all subscribers and destroy collector  |

## License

MIT
