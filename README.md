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

### 