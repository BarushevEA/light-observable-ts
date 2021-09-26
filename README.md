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
(tsconfig.json {"strict": false})

## Observable simple usage

```ts
import {Observable} from "evg_observable/src/outLib/Observables/Observable";

const observable$ = new Observable('Some typed data (not only string)');
const listener1 = (value: string) => console.log('listener1:',value);
const listener2 = (value: string) => console.log('listener2:',value);
const subscriber1 = observable$.subscribe(listener1);
const subscriber2 = observable$.subscribe(listener2);

console.log(observable$.getValue());
// Print to console - Some typed data (not only string)

observable$.next('Next typed data')
// Print to console - listener1: Next typed data
// Print to console - listener2: Next typed data

// if subscribers are not needed
subscriber1.unsubscribe();
subscriber2.unsubscribe();

// if a observable$ is not needed
observable$.destroy(); // all subscribers have automatically unsubscribed
```

## Observable pipe usage
### pipe().setOnce()

Observable will send a value to the subscriber only once, and the subscriber will unsubscribe.

```ts
import {Observable} from "evg_observable/src/outLib/Observables/Observable";

const observable$ = new Observable('Some typed data (not only string)');
const listener1 = (value: string) => console.log('listener1:',value);
const listener2 = (value: string) => console.log('listener2:',value);

const subscriber1 = observable$
    .pipe()
    .setOnce()
    .subscribe(listener1);
const subscriber2 = observable$.subscribe(listener2);

console.log(observable$.getValue());
// Print to console - Some typed data (not only string)

observable$.next('Next1 typed data')
// Print to console - listener1: Next1 typed data
// Print to console - listener2: Next1 typed data

observable$.next('Next2 typed data')
// Print to console - listener2: Next2 typed data

// subscriber1 is automatically unsubscribed after first usage
```
### pipe().unsubscribeByNegative(condition)

Observable will send a value to the subscriber as long as the condition is positive, on the first negative result, the subscriber will unsubscribe.
```ts
import {Observable} from "evg_observable/src/outLib/Observables/Observable";

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

observable$.next('Next1 typed data')
// Print to console - listener1: Next1 typed data
// Print to console - listener2: Next1 typed data

observable$.next('Next2 typed data')
// Print to console - listener1: Next2 typed data
// Print to console - listener2: Next2 typed data

isPositive = false;
observable$.next('Next3 typed data')
// Print to console - listener2: Next3 typed data

// subscriber1 is automatically unsubscribed when negative condition
```
### pipe().unsubscribeByPositive(condition)
Observable will send a value to the subscriber as long as the condition is negative, on the first positive result, the subscriber will unsubscribe.
```ts
import {Observable} from "evg_observable/src/outLib/Observables/Observable";

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

observable$.next('Next1 typed data')
// Print to console - listener1: Next1 typed data
// Print to console - listener2: Next1 typed data

observable$.next('Next2 typed data')
// Print to console - listener1: Next2 typed data
// Print to console - listener2: Next2 typed data

isPositive = true;
observable$.next('Next3 typed data')
// Print to console - listener2: Next3 typed data

// subscriber1 is automatically unsubscribed when positive condition
```
### pipe().emitMatch(condition)
Observable will send a value to the subscriber only if the return value of the condition matches the data being sent. In this case, there is no automatic unsubscription.
```ts
import {Observable} from "evg_observable/src/outLib/Observables/Observable";

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
Ordered observable - differs from Observable in that it allows you to emit messages in a given order. In general, they are the same.
```ts

```