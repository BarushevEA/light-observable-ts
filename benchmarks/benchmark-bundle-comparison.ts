import * as Benchmark from 'benchmark';
import {Observable as TypeScriptObservable} from '../src/Libraries/Observables';
import {Subject} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import * as fs from 'fs';
import * as path from 'path';

// Load and eval the bundle
const bundlePath = path.join(__dirname, '..', 'repo', 'evg_observable.js');
const bundleCode = fs.readFileSync(bundlePath, 'utf8');

// Create a sandbox for bundle evaluation
const bundleExports: any = {};
(function() {
    const window: any = bundleExports;
    eval(bundleCode);
})();

const BundleObservable = bundleExports.Observable;

console.log('# Performance Comparison: Bundle vs TypeScript vs RxJS\n');
console.log('Testing three variants:');
console.log('1. Bundle (minified JavaScript from repo/evg_observable.js)');
console.log('2. TypeScript (compiled on-the-fly via ts-node)');
console.log('3. RxJS (from node_modules)\n');

// =============================================================================
// 1. Observable creation
// =============================================================================
console.log('## 1. Observable Creation\n');

new Benchmark.Suite()
    .add('Bundle - new Observable', () => {
        const obs = new BundleObservable(0);
    })
    .add('TypeScript - new Observable', () => {
        const obs = new TypeScriptObservable(0);
    })
    .add('RxJS - new Subject', () => {
        const obs = new Subject();
    })
    .on('cycle', (event: any) => console.log(String(event.target)))
    .on('complete', function(this: any) {
        console.log(`Fastest is ${this.filter('fastest').map('name')}\n`);
    })
    .run();

// =============================================================================
// 2. Emit 100 values (1 subscriber)
// =============================================================================
console.log('## 2. Emit 100 Values (1 subscriber)\n');

{
    const obsBundle = new BundleObservable(0);
    const obsTypeScript = new TypeScriptObservable(0);
    const obsRxJS = new Subject<number>();

    obsBundle.subscribe(() => {});
    obsTypeScript.subscribe(() => {});
    obsRxJS.subscribe(() => {});

    new Benchmark.Suite()
        .add('Bundle - emit 100 values', () => {
            for (let i = 0; i < 100; i++) obsBundle.next(i);
        })
        .add('TypeScript - emit 100 values', () => {
            for (let i = 0; i < 100; i++) obsTypeScript.next(i);
        })
        .add('RxJS - emit 100 values', () => {
            for (let i = 0; i < 100; i++) obsRxJS.next(i);
        })
        .on('cycle', (event: any) => console.log(String(event.target)))
        .on('complete', function(this: any) {
            console.log(`Fastest is ${this.filter('fastest').map('name')}\n`);
        })
        .run();
}

// =============================================================================
// 3. Filter and transform
// =============================================================================
console.log('## 3. Filter and Transform (pipe chain)\n');

{
    const obsBundle = new BundleObservable(0);
    const obsTypeScript = new TypeScriptObservable(0);
    const obsRxJS = new Subject<number>();

    obsBundle.pipe()
        .and((v: number) => v % 2 === 0)
        .map((v: number) => `Value: ${v}`)
        .subscribe(() => {});

    obsTypeScript.pipe()!
        .and((v?: number) => v !== undefined && v % 2 === 0)
        .map<string>((v?: number) => `Value: ${v}`)
        .subscribe(() => {});

    obsRxJS.pipe(
        filter((v: number) => v % 2 === 0),
        map((v: number) => `Value: ${v}`)
    ).subscribe(() => {});

    new Benchmark.Suite()
        .add('Bundle - filter and transform', () => {
            for (let i = 0; i < 100; i++) obsBundle.next(i);
        })
        .add('TypeScript - filter and transform', () => {
            for (let i = 0; i < 100; i++) obsTypeScript.next(i);
        })
        .add('RxJS - filter and transform', () => {
            for (let i = 0; i < 100; i++) obsRxJS.next(i);
        })
        .on('cycle', (event: any) => console.log(String(event.target)))
        .on('complete', function(this: any) {
            console.log(`Fastest is ${this.filter('fastest').map('name')}\n`);
        })
        .run();
}

// =============================================================================
// 4. Multiple subscribers (10 subscribers)
// =============================================================================
console.log('## 4. Multiple Subscribers (10 subscribers)\n');

for (const subscriberCount of [10, 100, 1000]) {
    const obsBundle = new BundleObservable(0);
    const obsTypeScript = new TypeScriptObservable(0);
    const obsRxJS = new Subject<number>();

    for (let i = 0; i < subscriberCount; i++) {
        obsBundle.subscribe(() => {});
        obsTypeScript.subscribe(() => {});
        obsRxJS.subscribe(() => {});
    }

    new Benchmark.Suite()
        .add(`Bundle - ${subscriberCount} subs`, () => {
            obsBundle.next(1);
        })
        .add(`TypeScript - ${subscriberCount} subs`, () => {
            obsTypeScript.next(1);
        })
        .add(`RxJS - ${subscriberCount} subs`, () => {
            obsRxJS.next(1);
        })
        .on('cycle', (event: any) => console.log(String(event.target)))
        .on('complete', function(this: any) {
            console.log(`Fastest is ${this.filter('fastest').map('name')}\n`);
        })
        .run();
}

// =============================================================================
// 5. Batch emission - of/stream (100 values)
// =============================================================================
console.log('## 5. Batch Emission - of() 100 values\n');

{
    const obsBundle = new BundleObservable(0);
    const obsTypeScript = new TypeScriptObservable(0);
    const obsRxJS = new Subject<number>();

    obsBundle.subscribe(() => {});
    obsTypeScript.subscribe(() => {});
    obsRxJS.subscribe(() => {});

    const values = Array.from({length: 100}, (_, i) => i);

    new Benchmark.Suite()
        .add('Bundle - of(100)', () => {
            obsBundle.of(values);
        })
        .add('TypeScript - of(100)', () => {
            obsTypeScript.of(values);
        })
        .add('RxJS - next(100)', () => {
            for (let i = 0; i < 100; i++) obsRxJS.next(i);
        })
        .on('cycle', (event: any) => console.log(String(event.target)))
        .on('complete', function(this: any) {
            console.log(`Fastest is ${this.filter('fastest').map('name')}\n`);
        })
        .run();
}

// =============================================================================
// 6. 5 Chained filters
// =============================================================================
console.log('## 6. Five Chained Filters\n');

{
    const obsBundle = new BundleObservable(0);
    const obsTypeScript = new TypeScriptObservable(0);
    const obsRxJS = new Subject<number>();

    obsBundle.pipe()
        .and((v: number) => v > 0)
        .and((v: number) => v < 1000)
        .and((v: number) => v % 2 === 0)
        .and((v: number) => v % 5 === 0)
        .and((v: number) => v !== 500)
        .subscribe(() => {});

    obsTypeScript.pipe()!
        .and((v?: number) => v !== undefined && v > 0)
        .and((v?: number) => v !== undefined && v < 1000)
        .and((v?: number) => v !== undefined && v % 2 === 0)
        .and((v?: number) => v !== undefined && v % 5 === 0)
        .and((v?: number) => v !== undefined && v !== 500)
        .subscribe(() => {});

    obsRxJS.pipe(
        filter((v: number) => v > 0),
        filter((v: number) => v < 1000),
        filter((v: number) => v % 2 === 0),
        filter((v: number) => v % 5 === 0),
        filter((v: number) => v !== 500)
    ).subscribe(() => {});

    new Benchmark.Suite()
        .add('Bundle - 5 chained filters', () => {
            for (let i = 0; i < 1000; i++) obsBundle.next(i);
        })
        .add('TypeScript - 5 chained filters', () => {
            for (let i = 0; i < 1000; i++) obsTypeScript.next(i);
        })
        .add('RxJS - 5 chained filters', () => {
            for (let i = 0; i < 1000; i++) obsRxJS.next(i);
        })
        .on('cycle', (event: any) => console.log(String(event.target)))
        .on('complete', function(this: any) {
            console.log(`Fastest is ${this.filter('fastest').map('name')}\n`);
        })
        .run();
}

// =============================================================================
// 7. Large payload
// =============================================================================
console.log('## 7. Large Payload (complex objects)\n');

{
    const obsBundle = new BundleObservable({});
    const obsTypeScript = new TypeScriptObservable({});
    const obsRxJS = new Subject<any>();

    obsBundle.subscribe(() => {});
    obsTypeScript.subscribe(() => {});
    obsRxJS.subscribe(() => {});

    const largePayload = {
        id: 123,
        name: 'Test Object',
        nested: { a: 1, b: 2, c: 3, d: 4, e: 5 },
        array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    };

    new Benchmark.Suite()
        .add('Bundle - large payload', () => {
            for (let i = 0; i < 100; i++) obsBundle.next(largePayload);
        })
        .add('TypeScript - large payload', () => {
            for (let i = 0; i < 100; i++) obsTypeScript.next(largePayload);
        })
        .add('RxJS - large payload', () => {
            for (let i = 0; i < 100; i++) obsRxJS.next(largePayload);
        })
        .on('cycle', (event: any) => console.log(String(event.target)))
        .on('complete', function(this: any) {
            console.log(`Fastest is ${this.filter('fastest').map('name')}\n`);
        })
        .run();
}

console.log('# Benchmark Complete!');
