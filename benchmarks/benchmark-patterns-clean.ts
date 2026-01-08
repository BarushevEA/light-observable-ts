import * as Benchmark from 'benchmark';
import {Observable as LightObservable, ISubscriptionLike} from '../src/Libraries/Observables';

/**
 * CLEAN Benchmark: No loops, no counters in hot path
 *
 * Measures SINGLE emission with different subscriber counts
 * - Without pipe: pure emission overhead
 * - With pipe: shared pipe with separate vs array subscriptions
 */

console.log('\n========================================');
console.log('CLEAN BENCHMARK: Single Emission (No Loops)');
console.log('========================================\n');

// =============================================================================
// Part 1: WITHOUT PIPE
// =============================================================================
console.log('=== WITHOUT PIPE (Pure Emission) ===\n');

[1, 2, 3, 5, 10, 20, 50, 100, 1000].forEach(subscriberCount => {
    // Setup: Separate subscriptions
    const obsSeparate = new LightObservable<number>(0);
    for (let i = 0; i < subscriberCount; i++) {
        obsSeparate.subscribe(() => {});
    }

    // Setup: Array subscription
    const obsArray = new LightObservable<number>(0);
    const listeners: Array<() => void> = [];
    for (let i = 0; i < subscriberCount; i++) {
        listeners.push(() => {});
    }
    obsArray.subscribe(listeners);

    new Benchmark.Suite()
        .add(`Separate - ${subscriberCount} subs`, () => {
            obsSeparate.next(42);
        })
        .add(`Array - ${subscriberCount} subs`, () => {
            obsArray.next(42);
        })
        .on('cycle', (event: any) => console.log(String(event.target)))
        .on('complete', function(this: any) {
            const results = this.map((bench: any) => ({
                name: bench.name,
                hz: bench.hz
            }));

            const separateHz = results[0].hz;
            const arrayHz = results[1].hz;
            const ratio = (arrayHz / separateHz).toFixed(2);
            const faster = arrayHz > separateHz ? 'Array' : 'Separate';

            console.log(`Fastest is ${this.filter('fastest').map('name')}`);
            console.log(`Ratio (Array/Separate): ${ratio}x - ${faster} wins\n`);
        })
        .run({async: false});
});

// =============================================================================
// Part 2: WITH PIPE (Each own pipe vs Shared pipe + array)
// =============================================================================
console.log('\n========================================');
console.log('=== WITH PIPE (Filter + Transform) ===\n');

[10, 50, 100, 500, 1000].forEach(subscriberCount => {
    // Setup: Each subscriber gets its OWN pipe
    const obsEachOwnPipe = new LightObservable<number>(0);

    for (let i = 0; i < subscriberCount; i++) {
        // IMPORTANT: Create NEW pipe for EACH subscriber (pipe.subscribe() overwrites listener!)
        const pipe = obsEachOwnPipe.pipe()!
            .refine((v?: number) => v !== undefined && v % 2 === 0)
            .then<string>((v?: number) => `Value: ${v}`);
        pipe.subscribe(() => {});
    }

    // Setup: Shared pipe with ARRAY subscription
    const obsSharedPipe = new LightObservable<number>(0);
    const sharedPipe = obsSharedPipe.pipe()!
        .refine((v?: number) => v !== undefined && v % 2 === 0)
        .then<string>((v?: number) => `Value: ${v}`);

    const pipeListeners: Array<() => void> = [];
    for (let i = 0; i < subscriberCount; i++) {
        pipeListeners.push(() => {});
    }
    sharedPipe.subscribe(pipeListeners);

    new Benchmark.Suite()
        .add(`Each own pipe - ${subscriberCount} subs`, () => {
            obsEachOwnPipe.next(42);
        })
        .add(`Shared pipe + array - ${subscriberCount} subs`, () => {
            obsSharedPipe.next(42);
        })
        .on('cycle', (event: any) => console.log(String(event.target)))
        .on('complete', function(this: any) {
            const results = this.map((bench: any) => ({
                name: bench.name,
                hz: bench.hz
            }));

            const ownPipeHz = results[0].hz;
            const sharedPipeHz = results[1].hz;
            const ratio = (sharedPipeHz / ownPipeHz).toFixed(2);
            const faster = sharedPipeHz > ownPipeHz ? 'Shared pipe + array' : 'Each own pipe';

            console.log(`Fastest is ${this.filter('fastest').map('name')}`);
            console.log(`Ratio (Shared/Own): ${ratio}x - ${faster} wins\n`);
        })
        .run({async: false});
});

// =============================================================================
// Part 3: WITH PIPE vs WITHOUT PIPE comparison (Array subscription)
// =============================================================================
console.log('\n========================================');
console.log('=== PIPE OVERHEAD (Array subscription) ===\n');

[100, 1000].forEach(subscriberCount => {
    // Without pipe
    const obsNoPipe = new LightObservable<number>(0);
    const listenersNoPipe: Array<() => void> = [];
    for (let i = 0; i < subscriberCount; i++) {
        listenersNoPipe.push(() => {});
    }
    obsNoPipe.subscribe(listenersNoPipe);

    // With pipe
    const obsWithPipe = new LightObservable<number>(0);
    const pipe = obsWithPipe.pipe()!
        .refine((v?: number) => v !== undefined && v % 2 === 0)
        .then<string>((v?: number) => `Value: ${v}`);

    const listenersWithPipe: Array<() => void> = [];
    for (let i = 0; i < subscriberCount; i++) {
        listenersWithPipe.push(() => {});
    }
    pipe.subscribe(listenersWithPipe);

    new Benchmark.Suite()
        .add(`No pipe - ${subscriberCount} subs`, () => {
            obsNoPipe.next(42);
        })
        .add(`With pipe - ${subscriberCount} subs`, () => {
            obsWithPipe.next(42);
        })
        .on('cycle', (event: any) => console.log(String(event.target)))
        .on('complete', function(this: any) {
            const results = this.map((bench: any) => ({
                name: bench.name,
                hz: bench.hz
            }));

            const noPipeHz = results[0].hz;
            const withPipeHz = results[1].hz;
            const overhead = ((1 - withPipeHz / noPipeHz) * 100).toFixed(1);

            console.log(`Fastest is ${this.filter('fastest').map('name')}`);
            console.log(`Pipe overhead: ${overhead}%\n`);
        })
        .run({async: false});
});

console.log('\n========================================');
console.log('SUMMARY');
console.log('========================================\n');
console.log('Expected results:');
console.log('1. WITHOUT PIPE:');
console.log('   - 1 sub: Separate faster (no wrapper)');
console.log('   - 2+ subs: Array faster (fewer send() calls)');
console.log('   - 1000 subs: Array ~7x faster');
console.log('');
console.log('2. WITH PIPE:');
console.log('   - Each own pipe: N × pipe execution = SLOW');
console.log('   - Shared pipe + array: 1 × pipe execution = FAST');
console.log('   - Shared pipe + array should be ~7x faster');
console.log('');
console.log('3. PIPE OVERHEAD:');
console.log('   - Shows cost of pipe execution (refine + then)');
console.log('   - Minimal overhead with array subscription');
console.log('');
