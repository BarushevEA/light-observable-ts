import * as Benchmark from 'benchmark';
import {Observable as ModuleObservable} from '../src/Libraries/Observables';
import {Subject} from 'rxjs';
import {filter, map} from 'rxjs/operators';

// Load browser bundle (IIFE)
(global as any).window = {};
require('../repo/evg_observable.js');
const BrowserObservable = (global as any).window.Observable;

// Load ESM bundle via true dynamic import (bypass ts-node CJS transform)
import * as path from 'path';
const esmPath = path.resolve(__dirname, '../src/outLib-esm/index.mjs');
const dynamicImport = new Function('path', 'return import(path)') as (path: string) => Promise<any>;

async function loadESM() {
    const esm = await dynamicImport(esmPath);
    return esm;
}

async function run() {
    const esm = await loadESM();
    const ESMObservable = esm.Observable;

    // Sanity check: verify ESM bundle exports work
    console.log('# ESM Bundle Sanity Check');
    const checks = [
        ['Observable', typeof esm.Observable === 'function'],
        ['OrderedObservable', typeof esm.OrderedObservable === 'function'],
        ['Collector', typeof esm.Collector === 'function'],
        ['deleteFromArray', typeof esm.deleteFromArray === 'function'],
        ['quickDeleteFromArray', typeof esm.quickDeleteFromArray === 'function'],
    ];
    let allOK = true;
    for (const [name, ok] of checks) {
        console.log(`  ${ok ? '✓' : '✗'} ${name}: ${ok ? 'OK' : 'MISSING'}`);
        if (!ok) allOK = false;
    }
    if (!allOK) {
        console.log('\n✗ ESM bundle is broken — aborting benchmarks');
        process.exit(1);
    }

    // Functional check: subscribe, emit, receive
    const testObs = new ESMObservable(0);
    let received = 0;
    testObs.subscribe((v: number) => { received = v; });
    testObs.next(42);
    console.log(`  ${received === 42 ? '✓' : '✗'} emit/subscribe: ${received === 42 ? 'OK' : 'FAIL (got ' + received + ')'}`);

    // Functional check: pipe + and + map
    const testObs2 = new ESMObservable('');
    let mapped = 0;
    testObs2.pipe()
        .and((s: string) => s.length > 2)
        .map((s: string) => s.length)
        .subscribe((v: number) => { mapped = v; });
    testObs2.next('hi');
    testObs2.next('hello');
    console.log(`  ${mapped === 5 ? '✓' : '✗'} pipe+and+map: ${mapped === 5 ? 'OK' : 'FAIL (got ' + mapped + ')'}`);

    // Functional check: destroy
    const testObs3 = new ESMObservable(0);
    testObs3.subscribe(() => {});
    testObs3.destroy();
    console.log(`  ${testObs3.isDestroyed ? '✓' : '✗'} destroy: ${testObs3.isDestroyed ? 'OK' : 'FAIL'}`);

    if (received !== 42 || mapped !== 5 || !testObs3.isDestroyed) {
        console.log('\n✗ ESM bundle functional checks failed — aborting benchmarks');
        process.exit(1);
    }
    console.log('\n✓ All checks passed\n');

    console.log('# Comparison: Module vs IIFE Bundle vs ESM Bundle vs RxJS');
    console.log('# (Creation excluded from measurements)\n');

    // =========================================================================
    // 1. Pure emit performance (1 subscriber)
    // =========================================================================
    {
        const obsModule = new ModuleObservable<number>(0);
        const obsBrowser = new BrowserObservable(0);
        const obsESM = new ESMObservable(0);
        const obsRxJS = new Subject<number>();

        obsModule.subscribe(() => {});
        obsBrowser.subscribe(() => {});
        obsESM.subscribe(() => {});
        obsRxJS.subscribe(() => {});

        new Benchmark.Suite()
            .add('Module    - emit 100 values', () => {
                for (let i = 0; i < 100; i++) obsModule.next(i);
            })
            .add('IIFE      - emit 100 values', () => {
                for (let i = 0; i < 100; i++) obsBrowser.next(i);
            })
            .add('ESM       - emit 100 values', () => {
                for (let i = 0; i < 100; i++) obsESM.next(i);
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

    // =========================================================================
    // 2. Filter and transform (pipe chain)
    // =========================================================================
    {
        const obsModule = new ModuleObservable<number>(0);
        const obsBrowser = new BrowserObservable(0);
        const obsESM = new ESMObservable(0);
        const obsRxJS = new Subject<number>();

        obsModule.pipe()!
            .and((v?: number) => v !== undefined && v % 2 === 0)
            .map<string>((v?: number) => `Value: ${v}`)
            .subscribe(() => {});

        obsBrowser.pipe()
            .and((v: number) => v % 2 === 0)
            .map((v: number) => `Value: ${v}`)
            .subscribe(() => {});

        obsESM.pipe()
            .and((v: number) => v % 2 === 0)
            .map((v: number) => `Value: ${v}`)
            .subscribe(() => {});

        obsRxJS.pipe(
            filter(v => v % 2 === 0),
            map(v => `Value: ${v}`)
        ).subscribe(() => {});

        new Benchmark.Suite()
            .add('Module    - filter+transform', () => {
                for (let i = 0; i < 100; i++) obsModule.next(i);
            })
            .add('IIFE      - filter+transform', () => {
                for (let i = 0; i < 100; i++) obsBrowser.next(i);
            })
            .add('ESM       - filter+transform', () => {
                for (let i = 0; i < 100; i++) obsESM.next(i);
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

    // =========================================================================
    // 3. Multiple subscribers scaling
    // =========================================================================
    [10, 100, 1000].forEach(subscriberCount => {
        const obsModule = new ModuleObservable<number>(0);
        const obsBrowser = new BrowserObservable(0);
        const obsESM = new ESMObservable(0);
        const obsRxJS = new Subject<number>();

        for (let i = 0; i < subscriberCount; i++) {
            obsModule.subscribe(() => {});
            obsBrowser.subscribe(() => {});
            obsESM.subscribe(() => {});
            obsRxJS.subscribe(() => {});
        }

        new Benchmark.Suite()
            .add(`Module    - ${subscriberCount} subscribers`, () => {
                obsModule.next(1);
            })
            .add(`IIFE      - ${subscriberCount} subscribers`, () => {
                obsBrowser.next(1);
            })
            .add(`ESM       - ${subscriberCount} subscribers`, () => {
                obsESM.next(1);
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

    // =========================================================================
    // 4. Large payload
    // =========================================================================
    {
        interface LargePayload {
            id: number;
            name: string;
            data: number[];
            nested: { a: number; b: string; c: boolean };
        }

        const defaultPayload: LargePayload = {
            id: 0, name: '', data: [], nested: {a: 0, b: '', c: false}
        };

        const obsModule = new ModuleObservable<LargePayload>(defaultPayload);
        const obsBrowser = new BrowserObservable(defaultPayload);
        const obsESM = new ESMObservable(defaultPayload);
        const obsRxJS = new Subject<LargePayload>();

        obsModule.subscribe(() => {});
        obsBrowser.subscribe(() => {});
        obsESM.subscribe(() => {});
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
            .add('IIFE      - large payload', () => {
                for (let i = 0; i < 100; i++) obsBrowser.next(payloads[i]);
            })
            .add('ESM       - large payload', () => {
                for (let i = 0; i < 100; i++) obsESM.next(payloads[i]);
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

    // =========================================================================
    // 5. Subscribe/Unsubscribe churn
    // =========================================================================
    {
        const obsModule = new ModuleObservable<number>(0);
        const obsBrowser = new BrowserObservable(0);
        const obsESM = new ESMObservable(0);
        const obsRxJS = new Subject<number>();

        const listener = () => {};

        new Benchmark.Suite()
            .add('Module    - sub/unsub 100', () => {
                const subs: any[] = [];
                for (let i = 0; i < 100; i++) subs.push(obsModule.subscribe(listener));
                for (const sub of subs) sub?.unsubscribe();
            })
            .add('IIFE      - sub/unsub 100', () => {
                const subs: any[] = [];
                for (let i = 0; i < 100; i++) subs.push(obsBrowser.subscribe(listener));
                for (const sub of subs) sub?.unsubscribe();
            })
            .add('ESM       - sub/unsub 100', () => {
                const subs: any[] = [];
                for (let i = 0; i < 100; i++) subs.push(obsESM.subscribe(listener));
                for (const sub of subs) sub?.unsubscribe();
            })
            .add('RxJS      - sub/unsub 100', () => {
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

    console.log('# Benchmark complete');
}

run().catch(err => {
    console.error('Benchmark failed:', err);
    process.exit(1);
});
