import * as Benchmark from 'benchmark';
import { Observable, ISubscriptionLike } from '../src/Libraries/Observables';

/**
 * Benchmark: Subscription Patterns Performance
 *
 * Compares two subscription approaches:
 * 1. Separate subscriptions: N individual subscribe() calls
 * 2. Array subscription: 1 subscribe() call with array of N functions
 *
 * Key difference:
 * - Separate: N SubscribeObject instances, N send() calls per emission
 * - Array: 1 SubscribeObject, 1 send() call wrapping N function calls
 */

// Helper functions for benchmarks
function runBenchmark(name: string, tests: { [key: string]: Function }) {
    console.log(`\n# ${name}`);
    const suite = new Benchmark.Suite();

    Object.entries(tests).forEach(([testName, testFn]) => {
        suite.add(testName, testFn);
    });

    suite
        .on('cycle', (event: any) => {
            console.log(String(event.target));
        })
        .on('complete', function (this: any) {
            console.log(`Fastest is ${this.filter('fastest').map('name')}`);
        })
        .run({async: false});
}

// Benchmark 1: Single emission with different subscriber counts
console.log('\n========================================');
console.log('Subscription Pattern Comparison');
console.log('========================================');

runBenchmark('10 subscribers - 1 emission', {
    'Separate subscriptions (10x subscribe)': () => {
        const obs = new Observable<number>(0);
        const subs: ISubscriptionLike[] = [];

        // Subscribe 10 times
        for (let i = 0; i < 10; i++) {
            const sub = obs.subscribe(() => {});
            if (sub) subs.push(sub);
        }

        // Emit once
        obs.next(42);

        // Cleanup
        for (let i = 0; i < subs.length; i++) {
            subs[i].unsubscribe();
        }
    },
    'Array subscription (1x subscribe with [10])': () => {
        const obs = new Observable<number>(0);

        // Create array of 10 functions
        const listeners = [];
        for (let i = 0; i < 10; i++) {
            listeners.push(() => {});
        }

        // Subscribe once with array
        const sub = obs.subscribe(listeners);

        // Emit once
        obs.next(42);

        // Cleanup
        sub?.unsubscribe();
    }
});

runBenchmark('100 subscribers - 1 emission', {
    'Separate subscriptions (100x subscribe)': () => {
        const obs = new Observable<number>(0);
        const subs: ISubscriptionLike[] = [];

        for (let i = 0; i < 100; i++) {
            const sub = obs.subscribe(() => {});
            if (sub) subs.push(sub);
        }

        obs.next(42);

        for (let i = 0; i < subs.length; i++) {
            subs[i].unsubscribe();
        }
    },
    'Array subscription (1x subscribe with [100])': () => {
        const obs = new Observable<number>(0);

        const listeners = [];
        for (let i = 0; i < 100; i++) {
            listeners.push(() => {});
        }

        const sub = obs.subscribe(listeners);
        obs.next(42);
        sub?.unsubscribe();
    }
});

runBenchmark('1000 subscribers - 1 emission', {
    'Separate subscriptions (1000x subscribe)': () => {
        const obs = new Observable<number>(0);
        const subs: ISubscriptionLike[] = [];

        for (let i = 0; i < 1000; i++) {
            const sub = obs.subscribe(() => {});
            if (sub) subs.push(sub);
        }

        obs.next(42);

        for (let i = 0; i < subs.length; i++) {
            subs[i].unsubscribe();
        }
    },
    'Array subscription (1x subscribe with [1000])': () => {
        const obs = new Observable<number>(0);

        const listeners = [];
        for (let i = 0; i < 1000; i++) {
            listeners.push(() => {});
        }

        const sub = obs.subscribe(listeners);
        obs.next(42);
        sub?.unsubscribe();
    }
});

runBenchmark('10000 subscribers - 1 emission', {
    'Separate subscriptions (10000x subscribe)': () => {
        const obs = new Observable<number>(0);
        const subs: ISubscriptionLike[] = [];

        for (let i = 0; i < 10000; i++) {
            const sub = obs.subscribe(() => {});
            if (sub) subs.push(sub);
        }

        obs.next(42);

        for (let i = 0; i < subs.length; i++) {
            subs[i].unsubscribe();
        }
    },
    'Array subscription (1x subscribe with [10000])': () => {
        const obs = new Observable<number>(0);

        const listeners = [];
        for (let i = 0; i < 10000; i++) {
            listeners.push(() => {});
        }

        const sub = obs.subscribe(listeners);
        obs.next(42);
        sub?.unsubscribe();
    }
});

// Benchmark 2: Multiple emissions (emission overhead)
console.log('\n========================================');
console.log('Multiple Emissions (Emission Overhead Focus)');
console.log('========================================');

runBenchmark('100 subscribers - 10 emissions', {
    'Separate subscriptions': () => {
        const obs = new Observable<number>(0);
        const subs: ISubscriptionLike[] = [];

        for (let i = 0; i < 100; i++) {
            const sub = obs.subscribe(() => {});
            if (sub) subs.push(sub);
        }

        // 10 emissions
        for (let i = 0; i < 10; i++) {
            obs.next(i);
        }

        for (let i = 0; i < subs.length; i++) {
            subs[i].unsubscribe();
        }
    },
    'Array subscription': () => {
        const obs = new Observable<number>(0);

        const listeners = [];
        for (let i = 0; i < 100; i++) {
            listeners.push(() => {});
        }

        const sub = obs.subscribe(listeners);

        // 10 emissions
        for (let i = 0; i < 10; i++) {
            obs.next(i);
        }

        sub?.unsubscribe();
    }
});

runBenchmark('1000 subscribers - 10 emissions', {
    'Separate subscriptions': () => {
        const obs = new Observable<number>(0);
        const subs: ISubscriptionLike[] = [];

        for (let i = 0; i < 1000; i++) {
            const sub = obs.subscribe(() => {});
            if (sub) subs.push(sub);
        }

        for (let i = 0; i < 10; i++) {
            obs.next(i);
        }

        for (let i = 0; i < subs.length; i++) {
            subs[i].unsubscribe();
        }
    },
    'Array subscription': () => {
        const obs = new Observable<number>(0);

        const listeners = [];
        for (let i = 0; i < 1000; i++) {
            listeners.push(() => {});
        }

        const sub = obs.subscribe(listeners);

        for (let i = 0; i < 10; i++) {
            obs.next(i);
        }

        sub?.unsubscribe();
    }
});

runBenchmark('100 subscribers - 100 emissions', {
    'Separate subscriptions': () => {
        const obs = new Observable<number>(0);
        const subs: ISubscriptionLike[] = [];

        for (let i = 0; i < 100; i++) {
            const sub = obs.subscribe(() => {});
            if (sub) subs.push(sub);
        }

        for (let i = 0; i < 100; i++) {
            obs.next(i);
        }

        for (let i = 0; i < subs.length; i++) {
            subs[i].unsubscribe();
        }
    },
    'Array subscription': () => {
        const obs = new Observable<number>(0);

        const listeners = [];
        for (let i = 0; i < 100; i++) {
            listeners.push(() => {});
        }

        const sub = obs.subscribe(listeners);

        for (let i = 0; i < 100; i++) {
            obs.next(i);
        }

        sub?.unsubscribe();
    }
});

// Benchmark 3: With actual work in listeners (forced evaluation)
console.log('\n========================================');
console.log('With Forced Evaluation (Accumulator Pattern)');
console.log('========================================');

runBenchmark('1000 subscribers - 10 emissions - with work', {
    'Separate subscriptions': () => {
        const obs = new Observable<number>(0);
        const subs: ISubscriptionLike[] = [];
        let sum = 0;

        for (let i = 0; i < 1000; i++) {
            const sub = obs.subscribe((value?: number) => {
                sum += (value || 0);
            });
            if (sub) subs.push(sub);
        }

        for (let i = 0; i < 10; i++) {
            obs.next(i);
        }

        for (let i = 0; i < subs.length; i++) {
            subs[i].unsubscribe();
        }
    },
    'Array subscription': () => {
        const obs = new Observable<number>(0);
        const listeners = [];
        let sum = 0;

        for (let i = 0; i < 1000; i++) {
            listeners.push((value?: number) => {
                sum += (value || 0);
            });
        }

        const sub = obs.subscribe(listeners);

        for (let i = 0; i < 10; i++) {
            obs.next(i);
        }

        sub?.unsubscribe();
    }
});

// Benchmark 4: Only emission cost (pre-setup)
console.log('\n========================================');
console.log('Pure Emission Cost (Setup Excluded)');
console.log('========================================');

runBenchmark('1000 subscribers - emission only', {
    'Separate subscriptions - next() only': () => {
        const obs = new Observable<number>(0);
        const subs: ISubscriptionLike[] = [];

        // Setup (not measured in detail, but included)
        for (let i = 0; i < 1000; i++) {
            const sub = obs.subscribe(() => {});
            if (sub) subs.push(sub);
        }

        return {
            fn: () => obs.next(42),
            teardown: () => {
                for (let i = 0; i < subs.length; i++) {
                    subs[i].unsubscribe();
                }
            }
        };
    },
    'Array subscription - next() only': () => {
        const obs = new Observable<number>(0);

        const listeners = [];
        for (let i = 0; i < 1000; i++) {
            listeners.push(() => {});
        }

        const sub = obs.subscribe(listeners);

        return {
            fn: () => obs.next(42),
            teardown: () => sub?.unsubscribe()
        };
    }
});

console.log('\n========================================');
console.log('Benchmark Complete');
console.log('========================================');
