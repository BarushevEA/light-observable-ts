# Benchmarks for light-observable-ts

This project contains a set of benchmarks for measuring the performance of the light-observable-ts library. The benchmarks are divided into several categories to test different aspects of the library.

## Installing Dependencies

Before running the benchmarks, you need to install the dependencies:

```bash
npm install --save-dev benchmark microtime
```

To run comparative benchmarks with RxJS, you also need to install:

```bash
npm install --save-dev rxjs
```

## Running Benchmarks

The following scripts are available in the project to run benchmarks:

```bash
# Run the main benchmarks
npm run benchmark

# Run comparative benchmarks with RxJS
npm run benchmark:comparison
```

## Benchmark Description

### Main Benchmarks (benchmark.ts)

1. **Creating Observable** - measures the speed of creating Observable and OrderedObservable instances.
2. **Subscribing to Observable** - measures the speed of subscribing to Observable with different numbers of subscribers.
3. **Next method** - measures the speed of emitting values with different numbers of subscribers.
4. **Stream method** - measures the speed of streaming arrays of values.
5. **Pipe and filters** - measures the performance of various pipe and filtering operations.
6. **OrderedObservable** - measures the performance of operations with ordered observables.
7. **Collector** - measures the performance of operations with the subscription collector.
8. **Utility functions** - compares the performance of various utility functions.
9. **Performance comparison at different loads** - measures performance at various load levels.

### Comparative Benchmarks (benchmark-comparison.ts)

Compares the performance of light-observable-ts with RxJS in the following scenarios:

1. **Creation and subscription** - compares the speed of creation and subscription.
2. **Value emission** - compares the speed of emitting 100 values.
3. **Filtering and transformation** - compares the speed of filtering and transforming values.

## Interpreting Results

After running the benchmarks, you will see the results in the console. For each test, the following will be shown:

- Test name
- Operations per second (ops/sec)
- Measurement error (±)
- Number of runs (runs sampled)
- Fastest variant (Fastest is)

Example output:

```
# Creating Observable
new Observable x 1,234,567 ops/sec ±1.23% (98 runs sampled)
new OrderedObservable x 987,654 ops/sec ±2.34% (95 runs sampled)
Fastest is new Observable
```

## Adding New Benchmarks

To add new benchmarks, you can use the `runBenchmark` function from the benchmark.ts file:

```typescript
runBenchmark('Benchmark name', {
  'Test 1': () => {
    // Test 1 code
  },
  'Test 2': () => {
    // Test 2 code
  }
});
```

## Optimization Tips

Based on the benchmark results, you can identify bottlenecks in the library's performance and suggest optimizations.
