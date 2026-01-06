import * as Benchmark from 'benchmark';
import {Observable as LightObservable} from '../src/Libraries/Observables';
import {Subject} from 'rxjs';
import {filter, map} from 'rxjs/operators';

console.log('# Comparison: Observable vs RxJS');
console.log('# (Creation excluded from measurements)\n');

// =============================================================================
// 1. Pure emit performance (1 subscriber)
// =============================================================================
{
    const obsLight = new LightObservable<number>(0);
    const obsRxJS = new Subject<number>();

    obsLight.subscribe(() => {});
    obsRxJS.subscribe(() => {});

    new Benchmark.Suite()
        .add('Observable - emit 100 values', () => {
            for (let i = 0; i < 100; i++) obsLight.next(i);
        })
        .add('RxJS - emit 100 values', () => {
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
    const obsLight = new LightObservable<number>(0);
    const obsRxJS = new Subject<number>();

    obsLight.pipe()!
        .refine((v?: number) => v !== undefined && v % 2 === 0)
        .then<string>((v?: number) => `Value: ${v}`)
        .subscribe(() => {});

    obsRxJS.pipe(
        filter(v => v % 2 === 0),
        map(v => `Value: ${v}`)
    ).subscribe(() => {});

    new Benchmark.Suite()
        .add('Observable - filter and transform', () => {
            for (let i = 0; i < 100; i++) obsLight.next(i);
        })
        .add('RxJS - filter and transform', () => {
            for (let i = 0; i < 100; i++) obsRxJS.next(i);
        })
        .on('cycle', (event: any) => console.log(String(event.target)))
        .on('complete', function (this: any) {
            console.log(`Fastest is ${this.filter('fastest').map('name')}\n`);
        })
        .run({async: false});
}

// =============================================================================
// 3. Multiple subscribers scaling (10 / 100 / 1000 / 10000)
// =============================================================================
[10, 100, 1000, 10000].forEach(subscriberCount => {
    const obsLight = new LightObservable<number>(0);
    const obsRxJS = new Subject<number>();

    for (let i = 0; i < subscriberCount; i++) {
        obsLight.subscribe(() => {});
        obsRxJS.subscribe(() => {});
    }

    new Benchmark.Suite()
        .add(`Observable - ${subscriberCount} subscribers`, () => {
            obsLight.next(1);
        })
        .add(`RxJS - ${subscriberCount} subscribers`, () => {
            obsRxJS.next(1);
        })
        .on('cycle', (event: any) => console.log(String(event.target)))
        .on('complete', function (this: any) {
            console.log(`Fastest is ${this.filter('fastest').map('name')}\n`);
        })
        .run({async: false});
});

// =============================================================================
// 4. stream() batch emission
// =============================================================================
const streamValues = Array.from({length: 100}, (_, i) => i);

[1, 10, 100, 1000].forEach(subscriberCount => {
    const obsLight = new LightObservable<number>(0);
    const obsRxJS = new Subject<number>();

    for (let i = 0; i < subscriberCount; i++) {
        obsLight.subscribe(() => {});
        obsRxJS.subscribe(() => {});
    }

    new Benchmark.Suite()
        .add(`Observable - stream(100) ${subscriberCount} subs`, () => {
            obsLight.stream(streamValues);
        })
        .add(`RxJS - next(100) ${subscriberCount} subs`, () => {
            for (let i = 0; i < 100; i++) obsRxJS.next(i);
        })
        .on('cycle', (event: any) => console.log(String(event.target)))
        .on('complete', function (this: any) {
            console.log(`Fastest is ${this.filter('fastest').map('name')}\n`);
        })
        .run({async: false});
});

// =============================================================================
// 5. Chained filters (5 filters)
// =============================================================================
{
    const obsLight = new LightObservable<number>(0);
    const obsRxJS = new Subject<number>();

    obsLight.pipe()!
        .refine(v => v !== undefined && v > 0)
        .refine(v => v !== undefined && v < 1000)
        .refine(v => v !== undefined && v % 2 === 0)
        .refine(v => v !== undefined && v % 5 === 0)
        .refine(v => v !== undefined && v !== 500)
        .subscribe(() => {});

    obsRxJS.pipe(
        filter(v => v > 0),
        filter(v => v < 1000),
        filter(v => v % 2 === 0),
        filter(v => v % 5 === 0),
        filter(v => v !== 500)
    ).subscribe(() => {});

    new Benchmark.Suite()
        .add('Observable - 5 chained filters', () => {
            for (let i = 0; i < 100; i++) obsLight.next(i * 10);
        })
        .add('RxJS - 5 chained filters', () => {
            for (let i = 0; i < 100; i++) obsRxJS.next(i * 10);
        })
        .on('cycle', (event: any) => console.log(String(event.target)))
        .on('complete', function (this: any) {
            console.log(`Fastest is ${this.filter('fastest').map('name')}\n`);
        })
        .run({async: false});
}

// =============================================================================
// 6. Large payload (complex objects)
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

    const obsLight = new LightObservable<LargePayload>(defaultPayload);
    const obsRxJS = new Subject<LargePayload>();

    obsLight.subscribe(() => {});
    obsRxJS.subscribe(() => {});

    // Pre-create payloads
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
        .add('Observable - large payload', () => {
            for (let i = 0; i < 100; i++) obsLight.next(payloads[i]);
        })
        .add('RxJS - large payload', () => {
            for (let i = 0; i < 100; i++) obsRxJS.next(payloads[i]);
        })
        .on('cycle', (event: any) => console.log(String(event.target)))
        .on('complete', function (this: any) {
            console.log(`Fastest is ${this.filter('fastest').map('name')}\n`);
        })
        .run({async: false});
}

// =============================================================================
// 7. Subscribe/Unsubscribe churn (1000 cycles)
// =============================================================================
{
    const obsLight = new LightObservable<number>(0);
    const obsRxJS = new Subject<number>();

    const listener = () => {};

    new Benchmark.Suite()
        .add('Observable - subscribe/unsubscribe 1000', () => {
            const subs: any[] = [];
            for (let i = 0; i < 1000; i++) {
                subs.push(obsLight.subscribe(listener));
            }
            for (const sub of subs) sub?.unsubscribe();
        })
        .add('RxJS - subscribe/unsubscribe 1000', () => {
            const subs: any[] = [];
            for (let i = 0; i < 1000; i++) {
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

// =============================================================================
// 8. Switch/case OR-logic filtering
// =============================================================================
{
    const obsLight = new LightObservable<number>(0);
    const obsRxJS = new Subject<number>();

    obsLight.addFilter()
        .switch()
        .case(v => v === 10)
        .case(v => v === 20)
        .case(v => v === 30);
    obsLight.subscribe(() => {});

    obsRxJS.pipe(
        filter(v => v === 10 || v === 20 || v === 30)
    ).subscribe(() => {});

    new Benchmark.Suite()
        .add('Observable - switch/case OR-logic', () => {
            for (let i = 0; i < 100; i++) obsLight.next(i * 10);
        })
        .add('RxJS - filter with OR conditions', () => {
            for (let i = 0; i < 100; i++) obsRxJS.next(i * 10);
        })
        .on('cycle', (event: any) => console.log(String(event.target)))
        .on('complete', function (this: any) {
            console.log(`Fastest is ${this.filter('fastest').map('name')}\n`);
        })
        .run({async: false});
}
