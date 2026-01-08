import * as Benchmark from 'benchmark';
import {Observable as LightObservable} from '../src/Libraries/Observables';

/**
 * Edge Cases Benchmark: Where is the crossover point?
 *
 * Tests with very small subscriber counts (1-10) to find
 * where array subscription becomes beneficial over separate subscriptions.
 */

console.log('\n========================================');
console.log('EDGE CASES: Small Subscriber Counts');
console.log('========================================\n');

// Test with 1, 2, 3, 5, 10 subscribers
[1, 2, 3, 5, 10, 20, 50].forEach(subscriberCount => {
    const evgSeparate = new LightObservable<number>(0);
    const evgArray = new LightObservable<number>(0);

    // EVG - Separate subscriptions
    for (let i = 0; i < subscriberCount; i++) {
        evgSeparate.subscribe(() => {});
    }

    // EVG - Array subscription
    const evgListeners = [];
    for (let i = 0; i < subscriberCount; i++) {
        evgListeners.push(() => {});
    }
    evgArray.subscribe(evgListeners);

    new Benchmark.Suite()
        .add(`Separate - ${subscriberCount} sub(s)`, () => {
            evgSeparate.next(42);
        })
        .add(`Array - ${subscriberCount} sub(s)`, () => {
            evgArray.next(42);
        })
        .on('cycle', (event: any) => console.log(String(event.target)))
        .on('complete', function (this: any) {
            const fastest = this.filter('fastest').map('name');
            const results = this.map((bench: any) => ({
                name: bench.name,
                hz: bench.hz
            }));

            const separateHz = results[0].hz;
            const arrayHz = results[1].hz;
            const ratio = (arrayHz / separateHz).toFixed(2);

            console.log(`Fastest is ${fastest}`);
            console.log(`Ratio (Array/Separate): ${ratio}x\n`);
        })
        .run({async: false});
});

console.log('========================================');
console.log('Analysis');
console.log('========================================\n');
console.log('Expected behavior:');
console.log('1. For 1 subscriber: Separate should be slightly faster (no wrapper overhead)');
console.log('2. Crossover point: Where array becomes faster (due to reduced send() calls)');
console.log('3. For many subscribers: Array should be significantly faster\n');
