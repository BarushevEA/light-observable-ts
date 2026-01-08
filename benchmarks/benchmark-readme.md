# Benchmarks for light-observable-ts

This project contains a comprehensive set of benchmarks for measuring the performance of the light-observable-ts library, including subscription pattern optimizations and comparisons with competitors.

## Installing Dependencies

Before running the benchmarks, you need to install the dependencies:

```bash
npm install --save-dev benchmark microtime rxjs observable-fns
```

## Running Benchmarks

The following scripts are available in the project to run benchmarks:

```bash
# Main benchmarks
npm run benchmark                    # Core Observable benchmarks
npm run benchmark:comparison         # vs RxJS (heavyweight)
npm run benchmark:competitors        # vs observable-fns (lightweight)

# Subscription Pattern Benchmarks
npm run benchmark:patterns           # Basic subscription patterns
npm run benchmark:patterns-edge      # Edge cases & crossover points
npm run benchmark:patterns-clean     # Single-emission tests
npm run benchmark:patterns-final     # Final corrected implementation
npm run benchmark:patterns-vs-competitors  # Patterns vs RxJS & observable-fns

# Bundle benchmarks
npm run benchmark:bundles            # Minified bundle comparison
npm run benchmark:browser            # Browser bundle tests
```

## Subscription Patterns: Critical Performance Optimization

### Two Subscription Approaches

EVG Observable supports two subscription patterns with **dramatically different performance characteristics**:

#### 1. Separate Subscriptions

```typescript
const obs = new Observable<number>(0);

for (let i = 0; i < 1000; i++) {
    obs.subscribe(() => {});
}
```

**How it works:**
- Creates 1000 `SubscribeObject` instances
- Each emission calls `send()` 1000 times
- Each `send()` has overhead: checks, try-catch, etc.

#### 2. Array Subscription

```typescript
const obs = new Observable<number>(0);

const listeners = [];
for (let i = 0; i < 1000; i++) {
    listeners.push(() => {});
}

obs.subscribe(listeners);  // Single subscription with array
```

**How it works:**
- Creates ONE `SubscribeObject` instance
- `getListener()` wraps array in a single function
- Each emission calls `send()` ONCE
- Monolithic loop inside wrapper → V8 optimizes better

### Performance Comparison: Separate vs Array

| Subscribers | Separate | Array | Ratio | Crossover Point |
|-------------|----------|-------|-------|-----------------|
| 1           | 73M ops/s | 46M | 0.63x | ❌ Separate wins |
| 2           | 40M | 44M | 1.11x | ✅ **Array starts winning** |
| 5           | 21M | 37M | 1.74x | ✅ Array |
| 10          | 12M | 33M | 2.87x | ✅ Array |
| 50          | 2.5M | 14M | 5.59x | ✅ Array |
| 100         | 1.3M | 8.8M | 6.58x | ✅ Array |
| 1000        | 128K | 954K | 7.44x | ✅ Array |

**Crossover point: 2 subscribers**

- **1 subscriber:** Separate is faster (no wrapper overhead)
- **2+ subscribers:** Array is faster and scales better

### With Pipe: The Difference is Even Bigger

⚠️ **CRITICAL:** `pipe.subscribe()` overwrites `this.listener`!

```typescript
// ❌ WRONG: Only last subscriber works!
const pipe = obs.pipe().refine(...).then(...);
for (let i = 0; i < 1000; i++) {
    pipe.subscribe(() => {});  // Overwrites previous listener!
}
```

**Correct approaches:**

#### Option 1: Each with Own Pipe

```typescript
for (let i = 0; i < 1000; i++) {
    // Create NEW pipe for EACH subscriber
    const pipe = obs.pipe()
        .refine(v => v % 2 === 0)
        .then(v => `Value: ${v}`);

    pipe.subscribe(() => {});
}
```

**Performance:** 1000 subscribers = 12.6K ops/sec
- Executes pipe 1000 times per emission
- High overhead from repeated filter/transform

#### Option 2: Shared Pipe + Array Subscription (RECOMMENDED)

```typescript
// Create pipe ONCE
const pipe = obs.pipe()
    .refine(v => v % 2 === 0)
    .then(v => `Value: ${v}`);

// Subscribe with array
const listeners = [];
for (let i = 0; i < 1000; i++) {
    listeners.push(() => {});
}

pipe.subscribe(listeners);
```

**Performance:** 1000 subscribers = 110K ops/sec
- Executes pipe ONCE per emission
- **8.7x faster** than "each own pipe"

### Performance Summary: With Pipe

| Subscribers | Each Own Pipe | Shared + Array | Advantage |
|-------------|---------------|----------------|-----------|
| 10          | 2.22M ops/s   | 6.04M          | 2.72x     |
| 50          | 347K          | 2.37M          | 6.82x     |
| 100         | 185K          | 1.31M          | 7.04x     |
| 500         | 34.8K         | 222K           | 6.38x     |
| 1000        | 12.6K         | 110K           | **8.74x** |

## Best Practices

### ✅ Use Array Subscription When:
- 2+ subscribers with same logic
- Broadcasting to multiple listeners
- Performance matters

```typescript
const listeners = [listener1, listener2, listener3];
obs.subscribe(listeners);
```

### ✅ Use Separate Subscriptions When:
- Only 1 subscriber
- Each subscriber needs different pipe/logic

```typescript
obs.subscribe(listener);
```

### 🏆 Optimal Pattern for Multiple Subscribers:

```typescript
// 1. Create Observable
const obs = new Observable<number>(0);

// 2. Create shared pipe (if needed)
const pipe = obs.pipe()
    .refine(v => v % 2 === 0)
    .then(v => `Value: ${v}`);

// 3. Create array of listeners
const listeners = [];
for (let i = 0; i < 1000; i++) {
    listeners.push((value) => {
        // Handle value
    });
}

// 4. Subscribe with array
pipe.subscribe(listeners);

// Result: 7-9x faster than alternatives!
```

## Benchmark Descriptions

### Main Benchmarks (benchmark.ts)

Core Observable functionality tests:
1. **Creating Observable** - Creation speed for Observable and OrderedObservable
2. **Subscribing** - Subscription overhead
3. **Next method** - Emission speed with varying subscriber counts
4. **Stream method** - Batch emission performance
5. **Pipe and filters** - Transformation performance
6. **OrderedObservable** - Ordered emission tests
7. **Collector** - Subscription management

### Subscription Pattern Benchmarks

#### benchmark-subscription-patterns.ts
Basic tests for separate vs array subscriptions without pipe

#### benchmark-patterns-edge-cases.ts
Finds the crossover point (1-50 subscribers)

#### benchmark-patterns-clean.ts
Single-emission tests with and without pipe

#### benchmark-patterns-fixed.ts
**FINAL CORRECTED IMPLEMENTATION** - Shows all proper patterns:
- Without pipe: separate vs array
- With pipe: each own vs shared + array
- Overhead analysis

#### benchmark-patterns-vs-competitors.ts
Comprehensive comparison:
- EVG (separate) vs EVG (array) vs RxJS vs observable-fns
- With and without pipe
- Shows combined library + pattern advantage

### Comparative Benchmarks

#### benchmark-comparison.ts
vs RxJS (heavyweight category):
- Emission speed
- Filter + transform
- Multiple subscribers scaling

#### benchmark-competitors.ts
vs observable-fns (lightweight category):
- Full emission matrix (emissions × subscribers)
- Filter & transform with forced evaluation
- Large payload tests
- Subscription churn

## Latest Results

### EVG Observable vs Competitors

#### Without Pipe (Pure Emission)

| Scenario | EVG Array | RxJS | observable-fns | EVG Advantage |
|----------|-----------|------|----------------|---------------|
| 10 subs  | 34.9M ops/s | 6.2M | 6.8M | **5.6x vs RxJS** |
| 100 subs | 7.18M | 771K | 775K | **9.3x vs RxJS** |
| 1000 subs | 973K | 63K | 69K | **15.4x vs RxJS** |
| 10K subs | 14.6K | 4.4K | 6.9K | **3.3x vs RxJS** |

#### With Pipe (Filter + Transform)

| Scenario | EVG Shared+Array | EVG Own | RxJS | observable-fns |
|----------|------------------|---------|------|----------------|
| 100 subs | **17.1K ops/s** | 3.2K | 2.0K | 2.0K |
| 1000 subs | **1.7K ops/s** | 235 | 182 | 169 |

**EVG Shared pipe + array:**
- **8.6x faster than RxJS** (100 subs)
- **9.4x faster than RxJS** (1000 subs)
- **10.1x faster than observable-fns** (1000 subs)

### Understanding the Performance Gap

#### EVG Observable (True Hot Observable)

```typescript
const obs = new Observable(0);
const pipe = obs.pipe()
    .refine(v => v % 2 === 0)    // Executes ONCE per emission
    .then(v => `Value: ${v}`);   // Executes ONCE per passed value

const listeners = Array(100).fill(() => {});
pipe.subscribe(listeners);

// 10 emissions → 10 filter calls total
for (let i = 0; i < 10; i++) obs.next(i);
```

**Filter execution:** 10 times (1 per emission)
**Result broadcast:** To all 100 subscribers

#### observable-fns (Cold Observable with Multicast)

```typescript
const subject = new ObservableFnsSubject();
const multicasted = multicast(subject);
const pipeline = multicasted
    .filter(v => v % 2 === 0)    // Creates NEW cold observable
    .map(v => `Value: ${v}`);    // Creates ANOTHER cold observable

// Each subscriber creates its own execution chain
for (let i = 0; i < 100; i++) {
    pipeline.subscribe(() => {});
}

// 10 emissions → 1000 filter calls (100 per emission!)
for (let i = 0; i < 10; i++) subject.next(i);
```

**Filter execution:** 1000 times (100 per emission)
**Ratio:** 100x more computation

With 1000 subscribers: **1000x more computation**
With 10000 subscribers: **10000x more computation** → explains 22160x-39946x slowdown

## Architectural Differences

| Feature | EVG Observable | observable-fns | RxJS |
|---------|----------------|----------------|------|
| **Type** | True Hot Observable | Cold with Multicast | Hot/Cold hybrid |
| **Pipe execution** | Once per emission | N times (N subs) | Once per emission |
| **Overhead** | Minimal | High with filters | Moderate |
| **Scaling** | Linear | Exponential | Linear |
| **Best for** | Multi-subscriber patterns | Single subscriber | Complex compositions |

## Use Case Recommendations

### ✅ Choose EVG Observable for:
- Real-time data broadcasting (WebSocket, events)
- **ANY scenario with 2+ active subscribers**
- Filter chains with multiple consumers
- Performance-critical applications
- Production-ready reactive patterns
- **Recommended for 99% of use cases**

### Pattern Selection:
- **2+ subscribers, same logic** → Array subscription with shared pipe (**best performance**)
- **1 subscriber** → Separate subscription (slightly faster)
- **Different logic per subscriber** → Each with own pipe (no choice)

### ⚠️ Consider observable-fns only for:
- Single subscriber scenarios (competitive performance)
- Functional programming style preference
- **NOT recommended for multiple subscribers with filters**

## Key Performance Metrics

| Operation | Performance |
|-----------|-------------|
| new Observable | 73M ops/sec |
| new OrderedObservable | 13M ops/sec |
| next() - no subscribers | 49M ops/sec |
| next() - 1 subscriber | 73M ops/sec |
| next() - 10 subscribers (array) | 33M ops/sec |
| next() - 100 subscribers (array) | 8.8M ops/sec |
| next() - 1000 subscribers (array) | 954K ops/sec |
| Pipe + array (100 subs) | 1.3M ops/sec |
| Pipe + array (1000 subs) | 110K ops/sec |

## Adding New Benchmarks

Use the `runBenchmark` helper function:

```typescript
import * as Benchmark from 'benchmark';
import {Observable} from '../src/Libraries/Observables';

function runBenchmark(name: string, tests: { [key: string]: Function }) {
    console.log(`\n# ${name}`);
    const suite = new Benchmark.Suite();

    Object.entries(tests).forEach(([testName, testFn]) => {
        suite.add(testName, testFn);
    });

    suite
        .on('cycle', (event: any) => console.log(String(event.target)))
        .on('complete', function (this: any) {
            console.log(`Fastest is ${this.filter('fastest').map('name')}`);
        })
        .run({async: false});
}

runBenchmark('My Benchmark', {
    'Test 1': () => {
        // Test code
    },
    'Test 2': () => {
        // Test code
    }
});
```

## Important Notes

### ⚠️ Compilation Matters

Results vary significantly based on how TypeScript is executed:
- **tsx (esbuild):** Generates less optimal code
- **ts-node / tsc:** Generates more optimal code

**For accurate benchmarks, always use compiled JavaScript:**
```bash
tsc && node dist/benchmark.js
```

### ⚠️ Subscription Pattern Pitfall

**CRITICAL BUG TO AVOID:**

```typescript
// ❌ WRONG: Only last subscriber works!
const pipe = obs.pipe().refine(...).then(...);
for (let i = 0; i < N; i++) {
    pipe.subscribe(() => {});  // Overwrites listener!
}

// ✅ CORRECT: Each gets own pipe
for (let i = 0; i < N; i++) {
    const pipe = obs.pipe().refine(...).then(...);
    pipe.subscribe(() => {});
}

// 🏆 BEST: Shared pipe + array
const pipe = obs.pipe().refine(...).then(...);
const listeners = [...N functions...];
pipe.subscribe(listeners);
```

See `BENCHMARK_FIXES.md` for detailed explanation of this issue.

## See Also

- `BENCHMARK_RESULTS.md` - Detailed results for main benchmarks
- `BENCHMARK_FIXES.md` - Critical bug fixes and explanations
- `../README.md` - Library documentation and usage examples
