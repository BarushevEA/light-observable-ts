import * as Benchmark from 'benchmark';
import {Observable as LightObservable} from '../src/Libraries/Observables';
import {Subject as ObservableFnsSubject, multicast} from 'observable-fns';

console.log('# Comparison: Observable vs observable-fns');
console.log('# (Lightweight Observable libraries comparison)');
console.log('# observable-fns is based on zen-observable, provides Subject for hot observables\n');

// =============================================================================
// 1. Emit performance matrix: emissions × subscribers
// =============================================================================
const emitCounts = [1, 10, 100, 1000];
const subscriberCounts = [1, 10, 100, 1000, 10000];

console.log('=== EMIT PERFORMANCE MATRIX ===\n');

emitCounts.forEach(emitCount => {
    subscriberCounts.forEach(subscriberCount => {
        const obsLight = new LightObservable<number>(0);
        const obsFns = new ObservableFnsSubject<number>();

        // Add subscribers
        for (let i = 0; i < subscriberCount; i++) {
            obsLight.subscribe(() => {});
            obsFns.subscribe(() => {});
        }

        new Benchmark.Suite()
            .add(`Observable - ${emitCount} emit × ${subscriberCount} subs`, () => {
                for (let i = 0; i < emitCount; i++) obsLight.next(i);
            })
            .add(`observable-fns - ${emitCount} emit × ${subscriberCount} subs`, () => {
                for (let i = 0; i < emitCount; i++) obsFns.next(i);
            })
            .on('cycle', (event: any) => console.log(String(event.target)))
            .on('complete', function (this: any) {
                console.log(`Fastest is ${this.filter('fastest').map('name')}\n`);
            })
            .run({async: false});
    });
});

// =============================================================================
// 2. Filter and transform matrix (pipe chain × subscribers)
// =============================================================================
console.log('=== FILTER & TRANSFORM MATRIX (WITH FORCED EVALUATION) ===\n');

subscriberCounts.forEach(subscriberCount => {
    const obsLight = new LightObservable<number>(0);
    const obsFnsSubject = new ObservableFnsSubject<number>();
    const obsFns = multicast(obsFnsSubject); // CRITICAL: wrap in multicast for hot observable

    const lightPipe = obsLight.pipe()!
        .and((v?: number) => v !== undefined && v % 2 === 0)
        .map<string>((v?: number) => `Value: ${v}`);

    const fnsPipe = obsFns
        .filter(v => v % 2 === 0)
        .map(v => `Value: ${v}`);

    // Add subscribers that FORCE evaluation by using the result
    let lightSum = 0;
    let fnsSum = 0;
    for (let i = 0; i < subscriberCount; i++) {
        lightPipe.subscribe(value => { if (value) lightSum += value.length; });
        fnsPipe.subscribe(value => { if (value) fnsSum += value.length; });
    }

    new Benchmark.Suite()
        .add(`Observable - filter+transform × ${subscriberCount} subs`, () => {
            for (let i = 0; i < 100; i++) obsLight.next(i);
        })
        .add(`observable-fns - filter+transform × ${subscriberCount} subs`, () => {
            for (let i = 0; i < 100; i++) obsFnsSubject.next(i);
        })
        .on('cycle', (event: any) => console.log(String(event.target)))
        .on('complete', function (this: any) {
            console.log(`Fastest is ${this.filter('fastest').map('name')}`);
            console.log(`[Verification: lightSum=${lightSum}, fnsSum=${fnsSum}]\n`);
        })
        .run({async: false});
});

// =============================================================================
// 3. Large payload (complex objects)
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
    const obsFns = new ObservableFnsSubject<LargePayload>();

    obsLight.subscribe(() => {});
    obsFns.subscribe(() => {});

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
        .add('observable-fns - large payload', () => {
            for (let i = 0; i < 100; i++) obsFns.next(payloads[i]);
        })
        .on('cycle', (event: any) => console.log(String(event.target)))
        .on('complete', function (this: any) {
            console.log(`Fastest is ${this.filter('fastest').map('name')}\n`);
        })
        .run({async: false});
}

// =============================================================================
// 4. Subscribe/Unsubscribe churn (1000 cycles)
// =============================================================================
{
    const obsLight = new LightObservable<number>(0);
    const obsFns = new ObservableFnsSubject<number>();

    const listener = () => {};

    new Benchmark.Suite()
        .add('Observable - subscribe/unsubscribe 1000', () => {
            const subs: any[] = [];
            for (let i = 0; i < 1000; i++) {
                subs.push(obsLight.subscribe(listener));
            }
            for (const sub of subs) sub?.unsubscribe();
        })
        .add('observable-fns - subscribe/unsubscribe 1000', () => {
            const subs: any[] = [];
            for (let i = 0; i < 1000; i++) {
                subs.push(obsFns.subscribe(listener));
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
// 5. Chained filters matrix (5 filters × subscribers)
// =============================================================================
console.log('=== 5 CHAINED FILTERS MATRIX (WITH FORCED EVALUATION) ===\n');

subscriberCounts.forEach(subscriberCount => {
    const obsLight = new LightObservable<number>(0);
    const obsFnsSubject = new ObservableFnsSubject<number>();
    const obsFns = multicast(obsFnsSubject); // CRITICAL: wrap in multicast for hot observable

    const lightPipe = obsLight.pipe()!
        .and(v => v !== undefined && v > 0)
        .and(v => v !== undefined && v < 1000)
        .and(v => v !== undefined && v % 2 === 0)
        .and(v => v !== undefined && v % 5 === 0)
        .and(v => v !== undefined && v !== 500);

    const fnsPipe = obsFns
        .filter(v => v > 0)
        .filter(v => v < 1000)
        .filter(v => v % 2 === 0)
        .filter(v => v % 5 === 0)
        .filter(v => v !== 500);

    // Add subscribers that FORCE evaluation by using the result
    let lightSum = 0;
    let fnsSum = 0;
    for (let i = 0; i < subscriberCount; i++) {
        lightPipe.subscribe(value => { if (value !== undefined) lightSum += value; });
        fnsPipe.subscribe(value => { if (value !== undefined) fnsSum += value; });
    }

    new Benchmark.Suite()
        .add(`Observable - 5 filters × ${subscriberCount} subs`, () => {
            for (let i = 0; i < 100; i++) obsLight.next(i * 10);
        })
        .add(`observable-fns - 5 filters × ${subscriberCount} subs`, () => {
            for (let i = 0; i < 100; i++) obsFnsSubject.next(i * 10);
        })
        .on('cycle', (event: any) => console.log(String(event.target)))
        .on('complete', function (this: any) {
            console.log(`Fastest is ${this.filter('fastest').map('name')}`);
            console.log(`[Verification: lightSum=${lightSum}, fnsSum=${fnsSum}]\n`);
        })
        .run({async: false});
});

// =============================================================================
// 6. Observable creation speed
// =============================================================================
{
    new Benchmark.Suite()
        .add('Observable - creation', () => {
            new LightObservable<number>(0);
        })
        .add('observable-fns - Subject creation', () => {
            new ObservableFnsSubject<number>();
        })
        .on('cycle', (event: any) => console.log(String(event.target)))
        .on('complete', function (this: any) {
            console.log(`Fastest is ${this.filter('fastest').map('name')}\n`);
        })
        .run({async: false});
}

console.log('\n=== Benchmark Complete ===');
console.log('Emissions matrix: 4 emit counts × 5 subscriber counts = 20 scenarios');
console.log('Filter & transform matrix: 5 subscriber counts = 5 scenarios');
console.log('5 chained filters matrix: 5 subscriber counts = 5 scenarios');
console.log('Total: 30 + 3 other = 33 benchmark scenarios');
console.log('observable-fns is based on zen-observable, provides Subject for fair comparison');
