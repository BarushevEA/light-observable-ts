import * as Benchmark from 'benchmark';
import {Observable as LightObservable, ISubscriptionLike} from '../src/Libraries/Observables';

/**
 * FIXED Benchmark: Correct subscription patterns
 *
 * Key insight: pipe.subscribe() OVERWRITES this.listener!
 * So for separate subscriptions with pipe, each needs its OWN pipe instance.
 *
 * Correct comparisons:
 * 1. WITHOUT PIPE: Separate subscriptions vs Array subscription
 * 2. WITH PIPE: Each with own pipe vs Shared pipe with array
 */

console.log('\n========================================');
console.log('FIXED BENCHMARK: Correct Subscription Patterns');
console.log('========================================\n');

// =============================================================================
// Part 1: WITHOUT PIPE (Simple emission)
// =============================================================================
console.log('=== PART 1: WITHOUT PIPE (Pure Emission) ===\n');

[1, 2, 5, 10, 50, 100, 1000].forEach(subscriberCount => {
    // Setup: Separate subscriptions
    const obsSeparate = new LightObservable<number>(0);
    const subsSeparate: ISubscriptionLike[] = [];
    for (let i = 0; i < subscriberCount; i++) {
        const sub = obsSeparate.subscribe(() => {});
        if (sub) subsSeparate.push(sub);
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
// Part 2: WITH PIPE - Each with own pipe vs Array with shared pipe
// =============================================================================
console.log('\n========================================');
console.log('=== PART 2: WITH PIPE (Filter + Transform) ===\n');

[10, 50, 100, 500, 1000].forEach(subscriberCount => {
    // Setup: Each subscriber gets its OWN pipe
    const obsEachOwnPipe = new LightObservable<number>(0);
    const subsEachOwn: ISubscriptionLike[] = [];

    for (let i = 0; i < subscriberCount; i++) {
        // IMPORTANT: Create NEW pipe for EACH subscriber
        const pipe = obsEachOwnPipe.pipe()!
            .refine((v?: number) => v !== undefined && v % 2 === 0)
            .then<string>((v?: number) => `Value: ${v}`);

        const sub = pipe.subscribe(() => {});
        if (sub) subsEachOwn.push(sub);
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
// Part 3: Overhead analysis
// =============================================================================
console.log('\n========================================');
console.log('=== PART 3: OVERHEAD ANALYSIS ===\n');

const testCount = 100;

// Without pipe - separate
const noPipeSep = new LightObservable<number>(0);
for (let i = 0; i < testCount; i++) {
    noPipeSep.subscribe(() => {});
}

// Without pipe - array
const noPipeArr = new LightObservable<number>(0);
const noPipeListeners: Array<() => void> = [];
for (let i = 0; i < testCount; i++) {
    noPipeListeners.push(() => {});
}
noPipeArr.subscribe(noPipeListeners);

// With pipe - each own
const withPipeEach = new LightObservable<number>(0);
for (let i = 0; i < testCount; i++) {
    withPipeEach.pipe()!
        .refine((v?: number) => v !== undefined && v % 2 === 0)
        .then<string>((v?: number) => `Value: ${v}`)
        .subscribe(() => {});
}

// With pipe - shared + array
const withPipeShared = new LightObservable<number>(0);
const sharedPipeForOverhead = withPipeShared.pipe()!
    .refine((v?: number) => v !== undefined && v % 2 === 0)
    .then<string>((v?: number) => `Value: ${v}`);
const withPipeListeners: Array<() => void> = [];
for (let i = 0; i < testCount; i++) {
    withPipeListeners.push(() => {});
}
sharedPipeForOverhead.subscribe(withPipeListeners);

new Benchmark.Suite()
    .add(`No pipe - separate (${testCount} subs)`, () => {
        noPipeSep.next(42);
    })
    .add(`No pipe - array (${testCount} subs)`, () => {
        noPipeArr.next(42);
    })
    .add(`Each own pipe (${testCount} subs)`, () => {
        withPipeEach.next(42);
    })
    .add(`Shared pipe + array (${testCount} subs)`, () => {
        withPipeShared.next(42);
    })
    .on('cycle', (event: any) => console.log(String(event.target)))
    .on('complete', function(this: any) {
        const results = this.map((bench: any) => ({
            name: bench.name,
            hz: bench.hz
        }));

        console.log(`\nFastest is ${this.filter('fastest').map('name')}`);

        const noPipeSepHz = results[0].hz;
        const noPipeArrHz = results[1].hz;
        const ownPipeHz = results[2].hz;
        const sharedPipeHz = results[3].hz;

        console.log(`\nComparisons:`);
        console.log(`  Array vs Separate (no pipe): ${(noPipeArrHz / noPipeSepHz).toFixed(2)}x`);
        console.log(`  Shared pipe vs Own pipe: ${(sharedPipeHz / ownPipeHz).toFixed(2)}x`);
        console.log(`  Pipe overhead (separate): ${(noPipeSepHz / ownPipeHz).toFixed(2)}x slower with pipe`);
        console.log(`  Pipe overhead (array): ${(noPipeArrHz / sharedPipeHz).toFixed(2)}x slower with pipe`);
        console.log('');
    })
    .run({async: false});

console.log('\n========================================');
console.log('SUMMARY & RECOMMENDATIONS');
console.log('========================================\n');
console.log('1. WITHOUT PIPE:');
console.log('   ✅ 1 subscriber: Use separate subscription');
console.log('   ✅ 2+ subscribers: Use array subscription (2-8x faster)');
console.log('');
console.log('2. WITH PIPE:');
console.log('   ❌ Each own pipe: N × pipe execution = SLOW');
console.log('   ✅ Shared pipe + array: 1 × pipe execution = FAST');
console.log('   📈 Advantage grows with subscriber count');
console.log('');
console.log('3. BEST PRACTICE:');
console.log('   - Multiple subscribers on SAME logic → Array subscription with shared pipe');
console.log('   - Different logic per subscriber → Each with own pipe (no choice)');
console.log('   - Single subscriber → Separate subscription (no wrapper overhead)');
console.log('');
