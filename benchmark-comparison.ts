import * as Benchmark from 'benchmark';
import {Observable as LightObservable} from './src/Libraries/Observables';
import {Subject} from 'rxjs';
import {filter, map} from 'rxjs/operators';

// Install RxJS: npm install --save-dev rxjs

console.log('# Comparison of light-observable-ts with RxJS');

// 1. Creation and subscription
const suite1 = new Benchmark.Suite();
suite1
    .add('light-observable - creation and subscription', () => {
        const obs = new LightObservable<number>(0);
        const sub = obs.subscribe((value?: number) => {
        });
        sub?.unsubscribe();
    })
    .add('RxJS - creation and subscription', () => {
        const subject = new Subject<number>();
        const sub = subject.subscribe((value) => {
        });
        sub.unsubscribe();
    })
    .on('cycle', (event: any) => {
        console.log(String(event.target));
    })
    .on('complete', function (this: any) {
        console.log(`Fastest is ${this.filter('fastest').map('name')}`);
    })
    .run({async: false});

// 2. Value emission
const suite2 = new Benchmark.Suite();
suite2
    .add('light-observable - emit 100 values', () => {
        const obs = new LightObservable<number>(0);
        const sub = obs.subscribe((value?: number) => {
        });

        for (let i = 0; i < 100; i++) {
            obs.next(i);
        }

        sub?.unsubscribe();
    })
    .add('RxJS - emit 100 values', () => {
        const subject = new Subject<number>();
        const sub = subject.subscribe((value) => {
        });

        for (let i = 0; i < 100; i++) {
            subject.next(i);
        }

        sub.unsubscribe();
    })
    .on('cycle', (event: any) => {
        console.log(String(event.target));
    })
    .on('complete', function (this: any) {
        console.log(`Fastest is ${this.filter('fastest').map('name')}`);
    })
    .run({async: false});

// 3. Filter and transform
const suite3 = new Benchmark.Suite();
suite3
    .add('light-observable - filter and transform', () => {
        const obs = new LightObservable<number>(0);
        const pipeObj = obs.pipe();
        if (pipeObj) {
            const sub = pipeObj
                .refine((value?: number) => value !== undefined && value % 2 === 0)
                .then<string>((value?: number) => `Value: ${value}`)
                .subscribe((value?: string) => {
                });

            for (let i = 0; i < 100; i++) {
                obs.next(i);
            }

            sub?.unsubscribe();
        }
    })
    .add('RxJS - filter and transform', () => {
        const subject = new Subject<number>();
        const sub = subject.pipe(
            filter(value => value % 2 === 0),
            map(value => `Value: ${value}`)
        ).subscribe((value) => {
        });

        for (let i = 0; i < 100; i++) {
            subject.next(i);
        }

        sub.unsubscribe();
    })
    .on('cycle', (event: any) => {
        console.log(String(event.target));
    })
    .on('complete', function (this: any) {
        console.log(`Fastest is ${this.filter('fastest').map('name')}`);
    })
    .run({async: false});

// 4. Multiple subscribers scaling (10/100/1000/10000)
[10, 100, 1000, 10000].forEach(subscriberCount => {
    const suite = new Benchmark.Suite();
    suite
        .add(`light-observable - ${subscriberCount} subscribers`, () => {
            const obs = new LightObservable<number>(0);
            const subs: any[] = [];

            for (let i = 0; i < subscriberCount; i++) {
                subs.push(obs.subscribe(() => {}));
            }

            obs.next(1);

            for (const sub of subs) sub?.unsubscribe();
        })
        .add(`RxJS - ${subscriberCount} subscribers`, () => {
            const subject = new Subject<number>();
            const subs: any[] = [];

            for (let i = 0; i < subscriberCount; i++) {
                subs.push(subject.subscribe(() => {}));
            }

            subject.next(1);

            for (const sub of subs) sub.unsubscribe();
        })
        .on('cycle', (event: any) => {
            console.log(String(event.target));
        })
        .on('complete', function (this: any) {
            console.log(`Fastest is ${this.filter('fastest').map('name')}`);
        })
        .run({async: false});
});

// 5. stream() batch emission vs loop
const suite5 = new Benchmark.Suite();
const streamValues = Array.from({length: 100}, (_, i) => i);
suite5
    .add('light-observable - stream() batch', () => {
        const obs = new LightObservable<number>(0);
        const sub = obs.subscribe(() => {});

        obs.stream(streamValues);

        sub?.unsubscribe();
    })
    .add('light-observable - next() loop', () => {
        const obs = new LightObservable<number>(0);
        const sub = obs.subscribe(() => {});

        for (let i = 0; i < 100; i++) {
            obs.next(i);
        }

        sub?.unsubscribe();
    })
    .on('cycle', (event: any) => {
        console.log(String(event.target));
    })
    .on('complete', function (this: any) {
        console.log(`Fastest is ${this.filter('fastest').map('name')}`);
    })
    .run({async: false});

// 6. Chained filters (multiple refine)
const suite6 = new Benchmark.Suite();
suite6
    .add('light-observable - 5 chained filters', () => {
        const obs = new LightObservable<number>(0);
        const pipeObj = obs.pipe();
        if (pipeObj) {
            const sub = pipeObj
                .refine(v => v !== undefined && v > 0)
                .refine(v => v !== undefined && v < 1000)
                .refine(v => v !== undefined && v % 2 === 0)
                .refine(v => v !== undefined && v % 5 === 0)
                .refine(v => v !== undefined && v !== 500)
                .subscribe(() => {});

            for (let i = 0; i < 100; i++) {
                obs.next(i * 10);
            }

            sub?.unsubscribe();
        }
    })
    .add('RxJS - 5 chained filters', () => {
        const subject = new Subject<number>();
        const sub = subject.pipe(
            filter(v => v > 0),
            filter(v => v < 1000),
            filter(v => v % 2 === 0),
            filter(v => v % 5 === 0),
            filter(v => v !== 500)
        ).subscribe(() => {});

        for (let i = 0; i < 100; i++) {
            subject.next(i * 10);
        }

        sub.unsubscribe();
    })
    .on('cycle', (event: any) => {
        console.log(String(event.target));
    })
    .on('complete', function (this: any) {
        console.log(`Fastest is ${this.filter('fastest').map('name')}`);
    })
    .run({async: false});

// 7. Large payload (complex objects)
interface LargePayload {
    id: number;
    name: string;
    data: number[];
    nested: { a: number; b: string; c: boolean };
}

const suite7 = new Benchmark.Suite();
suite7
    .add('light-observable - large payload', () => {
        const obs = new LightObservable<LargePayload>({
            id: 0, name: '', data: [], nested: {a: 0, b: '', c: false}
        });
        const sub = obs.subscribe(() => {});

        for (let i = 0; i < 100; i++) {
            obs.next({
                id: i,
                name: `item-${i}`,
                data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                nested: {a: i, b: `nested-${i}`, c: i % 2 === 0}
            });
        }

        sub?.unsubscribe();
    })
    .add('RxJS - large payload', () => {
        const subject = new Subject<LargePayload>();
        const sub = subject.subscribe(() => {});

        for (let i = 0; i < 100; i++) {
            subject.next({
                id: i,
                name: `item-${i}`,
                data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                nested: {a: i, b: `nested-${i}`, c: i % 2 === 0}
            });
        }

        sub.unsubscribe();
    })
    .on('cycle', (event: any) => {
        console.log(String(event.target));
    })
    .on('complete', function (this: any) {
        console.log(`Fastest is ${this.filter('fastest').map('name')}`);
    })
    .run({async: false});

// 8. Unsubscribe performance (mass unsubscribe)
const suite8 = new Benchmark.Suite();
suite8
    .add('light-observable - unsubscribe 1000', () => {
        const obs = new LightObservable<number>(0);
        const subs: any[] = [];

        for (let i = 0; i < 1000; i++) {
            subs.push(obs.subscribe(() => {}));
        }

        for (const sub of subs) sub?.unsubscribe();
    })
    .add('RxJS - unsubscribe 1000', () => {
        const subject = new Subject<number>();
        const subs: any[] = [];

        for (let i = 0; i < 1000; i++) {
            subs.push(subject.subscribe(() => {}));
        }

        for (const sub of subs) sub.unsubscribe();
    })
    .on('cycle', (event: any) => {
        console.log(String(event.target));
    })
    .on('complete', function (this: any) {
        console.log(`Fastest is ${this.filter('fastest').map('name')}`);
    })
    .run({async: false});

// 9. Switch/case OR-logic filtering
const suite9 = new Benchmark.Suite();
suite9
    .add('light-observable - switch/case OR-logic', () => {
        const obs = new LightObservable<number>(0);
        obs.addFilter()
            .switch()
            .case(v => v === 10)
            .case(v => v === 20)
            .case(v => v === 30);

        const sub = obs.subscribe(() => {});

        for (let i = 0; i < 100; i++) {
            obs.next(i * 10);
        }

        sub?.unsubscribe();
    })
    .add('RxJS - filter with OR conditions', () => {
        const subject = new Subject<number>();
        const sub = subject.pipe(
            filter(v => v === 10 || v === 20 || v === 30)
        ).subscribe(() => {});

        for (let i = 0; i < 100; i++) {
            subject.next(i * 10);
        }

        sub.unsubscribe();
    })
    .on('cycle', (event: any) => {
        console.log(String(event.target));
    })
    .on('complete', function (this: any) {
        console.log(`Fastest is ${this.filter('fastest').map('name')}`);
    })
    .run({async: false});
