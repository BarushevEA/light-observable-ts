import * as Benchmark from 'benchmark';
import {Observable as ModuleObservable} from '../src/Libraries/Observables';
import {Subject} from 'rxjs';
import {filter, map} from 'rxjs/operators';

// Load browser bundle
(global as any).window = {};
require('../repo/evg_observable.js');
const BrowserObservable = (global as any).window.Observable;

console.log('# Comparison: Module vs Browser Bundle vs RxJS');
console.log('# (Creation excluded from measurements)\n');

// =============================================================================
// 1. Pure emit performance (1 subscriber)
// =============================================================================
{
    const obsModule = new ModuleObservable<number>(0);
    const obsBrowser = new BrowserObservable(0);
    const obsRxJS = new Subject<number>();

    obsModule.subscribe(() => {});
    obsBrowser.subscribe(() => {});
    obsRxJS.subscribe(() => {});

    new Benchmark.Suite()
        .add('Module    - emit 100 values', () => {
            for (let i = 0; i < 100; i++) obsModule.next(i);
        })
        .add('Browser   - emit 100 values', () => {
            for (let i = 0; i < 100; i++) obsBrowser.next(i);
        })
        .add('RxJS      - emit 100 values', () => {
            for (let i = 0; i < 100; i++) obsRxJS.next(i);
        })
        .on('cycle', (event: any) => console.log(String(event.target)))
        .on('complete', function (this: any) {
            console.log(`Fastest is ${this.filter('fastest').map('name')}\n`);
        })
        .run({async: false});
}

// =============================================================================
// 2. Filter and transform (pipe chain)
// =============================================================================
{
    const obsModule = new ModuleObservable<number>(0);
    const obsBrowser = new BrowserObservable(0);
    const obsRxJS = new Subject<number>();

    obsModule.pipe()!
        .refine((v?: number) => v !== undefined && v % 2 === 0)
        .then<string>((v?: number) => `Value: ${v}`)
        .subscribe(() => {});

    obsBrowser.pipe()
        .refine((v: number) => v % 2 === 0)
        .then((v: number) => `Value: ${v}`)
        .subscribe(() => {});

    obsRxJS.pipe(
        filter(v => v % 2 === 0),
        map(v => `Value: ${v}`)
    ).subscribe(() => {});

    new Benchmark.Suite()
        .add('Module    - filter+transform', () => {
            for (let i = 0; i < 100; i++) obsModule.next(i);
        })
        .add('Browser   - filter+transform', () => {
            for (let i = 0; i < 100; i++) obsBrowser.next(i);
        })
        .add('RxJS      - filter+transform', () => {
            for (let i = 0; i < 100; i++) obsRxJS.next(i);
        })
        .on('cycle', (event: any) => console.log(String(event.target)))
        .on('complete', function (this: any) {
            console.log(`Fastest is ${this.filter('fastest').map('name')}\n`);
        })
        .run({async: false});
}

// =============================================================================
// 3. Multiple subscribers scaling (10 / 100 / 1000)
// =============================================================================
[10, 100, 1000].forEach(subscriberCount => {
    const obsModule = new ModuleObservable<number>(0);
    const obsBrowser = new BrowserObservable(0);
    const obsRxJS = new Subject<number>();

    for (let i = 0; i < subscriberCount; i++) {
        obsModule.subscribe(() => {});
        obsBrowser.subscribe(() => {});
        obsRxJS.subscribe(() => {});
    }

    new Benchmark.Suite()
        .add(`Module    - ${subscriberCount} subscribers`, () => {
            obsModule.next(1);
        })
        .add(`Browser   - ${subscriberCount} subscribers`, () => {
            obsBrowser.next(1);
        })
        .add(`RxJS      - ${subscriberCount} subscribers`, () => {
            obsRxJS.next(1);
        })
        .on('cycle', (event: any) => console.log(String(event.target)))
        .on('complete', function (this: any) {
            console.log(`Fastest is ${this.filter('fastest').map('name')}\n`);
        })
        .run({async: false});
});

// =============================================================================
// 4. Large payload (complex objects)
// =============================================================================
interface LargePayload {
    id: number;
    name: string;
    data: number[];
    nested: { a: number; b: string; c: boolean };
}

{
    const defaultPayload: LargePayload = {
        id: 0, name: '', data: [], nested: {a: 0, b: '', c: false}
    };

    const obsModule = new ModuleObservable<LargePayload>(defaultPayload);
    const obsBrowser = new BrowserObservable(defaultPayload);
    const obsRxJS = new Subject<LargePayload>();

    obsModule.subscribe(() => {});
    obsBrowser.subscribe(() => {});
    obsRxJS.subscribe(() => {});

    const payloads: LargePayload[] = [];
    for (let i = 0; i < 100; i++) {
        payloads.push({
            id: i,
            name: `item-${i}`,
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            nested: {a: i, b: `nested-${i}`, c: i % 2 === 0}
        });
    }

    new Benchmark.Suite()
        .add('Module    - large payload', () => {
            for (let i = 0; i < 100; i++) obsModule.next(payloads[i]);
        })
        .add('Browser   - large payload', () => {
            for (let i = 0; i < 100; i++) obsBrowser.next(payloads[i]);
        })
        .add('RxJS      - large payload', () => {
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
    const obsModule = new ModuleObservable<number>(0);
    const obsBrowser = new BrowserObservable(0);
    const obsRxJS = new Subject<number>();

    const listener = () => {};

    new Benchmark.Suite()
        .add('Module    - sub/unsub 100', () => {
            const subs: any[] = [];
            for (let i = 0; i < 100; i++) {
                subs.push(obsModule.subscribe(listener));
            }
            for (const sub of subs) sub?.unsubscribe();
        })
        .add('Browser   - sub/unsub 100', () => {
            const subs: any[] = [];
            for (let i = 0; i < 100; i++) {
                subs.push(obsBrowser.subscribe(listener));
            }
            for (const sub of subs) sub?.unsubscribe();
        })
        .add('RxJS      - sub/unsub 100', () => {
            const subs: any[] = [];
            for (let i = 0; i < 100; i++) {
                subs.push(obsRxJS.subscribe(listener));
            }
            for (const sub of subs) sub.unsubscribe();
        })
        .on('cycle', (event: any) => console.log(String(event.target)))
        .on('complete', function (this: any) {
            console.log(`Fastest is ${this.filter('fastest').map('name')}\n`);
        })
        .run({async: false});
}

console.log('# Benchmark complete');
