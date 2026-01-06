import * as Benchmark from 'benchmark';

// Setup browser-like environment
(global as any).window = {};
(global as any).self = global;

// Load EVG Observable bundle
require('../repo/evg_observable.js');
const EVGObservable = (global as any).window.Observable;

// Load RxJS UMD bundle (use absolute path to bypass exports restriction)
const rxjsBundle = require('../node_modules/rxjs/dist/bundles/rxjs.umd.min.js');
const RxJSSubject = rxjsBundle.Subject;
const RxJSFilter = rxjsBundle.filter;
const RxJSMap = rxjsBundle.map;

console.log('# Bundle vs Bundle: EVG Observable (6.4 kB) vs RxJS UMD (88 kB)');
console.log('# Both minified for fair comparison\n');

// =============================================================================
// 1. Pure emit performance (1 subscriber)
// =============================================================================
{
    const obsEVG = new EVGObservable(0);
    const obsRxJS = new RxJSSubject();

    obsEVG.subscribe(() => {});
    obsRxJS.subscribe(() => {});

    new Benchmark.Suite()
        .add('EVG Bundle  - emit 100 values', () => {
            for (let i = 0; i < 100; i++) obsEVG.next(i);
        })
        .add('RxJS Bundle - emit 100 values', () => {
            for (let i = 0; i < 100; i++) obsRxJS.next(i);
        })
        .on('cycle', (event: any) => console.log(String(event.target)))
        .on('complete', function (this: any) {
            console.log(`Fastest is ${this.filter('fastest').map('name')}\n`);
        })
        .run({async: false});
}

// =============================================================================
// 2. Filter and transform
// =============================================================================
{
    const obsEVG = new EVGObservable(0);
    const obsRxJS = new RxJSSubject();

    obsEVG.pipe()
        .refine((v: number) => v % 2 === 0)
        .then((v: number) => `Value: ${v}`)
        .subscribe(() => {});

    obsRxJS.pipe(
        RxJSFilter((v: number) => v % 2 === 0),
        RxJSMap((v: number) => `Value: ${v}`)
    ).subscribe(() => {});

    new Benchmark.Suite()
        .add('EVG Bundle  - filter+transform', () => {
            for (let i = 0; i < 100; i++) obsEVG.next(i);
        })
        .add('RxJS Bundle - filter+transform', () => {
            for (let i = 0; i < 100; i++) obsRxJS.next(i);
        })
        .on('cycle', (event: any) => console.log(String(event.target)))
        .on('complete', function (this: any) {
            console.log(`Fastest is ${this.filter('fastest').map('name')}\n`);
        })
        .run({async: false});
}

// =============================================================================
// 3. Multiple subscribers (10 / 100 / 1000)
// =============================================================================
[10, 100, 1000].forEach(subscriberCount => {
    const obsEVG = new EVGObservable(0);
    const obsRxJS = new RxJSSubject();

    for (let i = 0; i < subscriberCount; i++) {
        obsEVG.subscribe(() => {});
        obsRxJS.subscribe(() => {});
    }

    new Benchmark.Suite()
        .add(`EVG Bundle  - ${subscriberCount} subscribers`, () => {
            obsEVG.next(1);
        })
        .add(`RxJS Bundle - ${subscriberCount} subscribers`, () => {
            obsRxJS.next(1);
        })
        .on('cycle', (event: any) => console.log(String(event.target)))
        .on('complete', function (this: any) {
            console.log(`Fastest is ${this.filter('fastest').map('name')}\n`);
        })
        .run({async: false});
});

// =============================================================================
// 4. Large payload
// =============================================================================
{
    const payload = {
        id: 0, name: '', data: [1,2,3,4,5,6,7,8,9,10],
        nested: {a: 0, b: '', c: false}
    };

    const obsEVG = new EVGObservable(payload);
    const obsRxJS = new RxJSSubject();

    obsEVG.subscribe(() => {});
    obsRxJS.subscribe(() => {});

    const payloads: any[] = [];
    for (let i = 0; i < 100; i++) {
        payloads.push({
            id: i, name: `item-${i}`,
            data: [1,2,3,4,5,6,7,8,9,10],
            nested: {a: i, b: `nested-${i}`, c: i % 2 === 0}
        });
    }

    new Benchmark.Suite()
        .add('EVG Bundle  - large payload', () => {
            for (let i = 0; i < 100; i++) obsEVG.next(payloads[i]);
        })
        .add('RxJS Bundle - large payload', () => {
            for (let i = 0; i < 100; i++) obsRxJS.next(payloads[i]);
        })
        .on('cycle', (event: any) => console.log(String(event.target)))
        .on('complete', function (this: any) {
            console.log(`Fastest is ${this.filter('fastest').map('name')}\n`);
        })
        .run({async: false});
}

// =============================================================================
// 5. Subscribe/Unsubscribe churn
// =============================================================================
{
    const obsEVG = new EVGObservable(0);
    const obsRxJS = new RxJSSubject();
    const listener = () => {};

    new Benchmark.Suite()
        .add('EVG Bundle  - sub/unsub 100', () => {
            const subs: any[] = [];
            for (let i = 0; i < 100; i++) subs.push(obsEVG.subscribe(listener));
            for (const sub of subs) sub?.unsubscribe();
        })
        .add('RxJS Bundle - sub/unsub 100', () => {
            const subs: any[] = [];
            for (let i = 0; i < 100; i++) subs.push(obsRxJS.subscribe(listener));
            for (const sub of subs) sub.unsubscribe();
        })
        .on('cycle', (event: any) => console.log(String(event.target)))
        .on('complete', function (this: any) {
            console.log(`Fastest is ${this.filter('fastest').map('name')}\n`);
        })
        .run({async: false});
}

console.log('# Bundle comparison complete');
console.log('# EVG Observable: 6.4 kB | RxJS UMD: 88 kB (13.75x larger)');
