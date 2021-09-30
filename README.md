<h1 align=center style="color: saddlebrown">
EVG Observable
</h1>
<p align=center>
EVG Observable - is a light library for simple use.
</p>

## What is EVG Observable?

EVG Observable - is a small library for serving asynchronous events.

## Installation

### Node.js

`EVG Observable` is available on [npm](http://npmjs.org). To install it, type:

    $ npm install evg_observable

# Usage

### tsconfig.json

recommended value of the "strict" field in the configuration

```json
{
  "compilerOptions": {
    "strict": false
  }
}
```

## Observable simple usage

```ts
import {Observable} from "evg_observable/src/outLib/Observable";

const observable$ = new Observable('Some typed data (not only string)');
const listener1 = (value: string) => console.log('listener1:', value);
const listener2 = (value: string) => console.log('listener2:', value);
const subscriber1 = observable$.subscribe(listener1);
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

## Methods

### Observable

| method | will return | description |
| :--- | :--- | :--- |
| `.subscribe(listener)` | subscriber | subscribe listener to observable |
| `.unSubscribe(subscriber)` | void | unsubscribe listener from observable |
| `.unsubscribeAll()` | void | unsubscribe all listeners from the current observable |
| `.next(value)` | void | emit data to listeners |
| `.getValue()` | value | will return the last value sent, or the value that was set during initialization |
| `.size()` | number | will return the current number of subscribers |
| `.disable()`| void | disable emission |
| `.enable()`| void | enable emission |
| `.isEnable` | boolean | read-only field that shows the state of the observer |
| `.destroy()` | void | unsubscribe all listeners from the current observable and destroy it |
| `.isDestroyed` | boolean | read-only field that shows the kill state of the observer |
| `.pipe()` | pipe condition object | returns an object with which you can customize the subscriber's behavior |

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

## License

MIT