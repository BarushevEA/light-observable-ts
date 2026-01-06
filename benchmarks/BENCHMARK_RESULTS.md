# Benchmark Results

Full benchmark output for EVG Observable library.

**Environment:** Node.js 22.17.1, compiled JavaScript (tsc)
**Date:** 2026-01-03

> **Note:** Results vary significantly depending on how TypeScript is executed:
> - **tsx (esbuild):** Generates less optimal code for Observable classes
> - **ts-node / tsc:** Generates more optimal code
>
> For accurate benchmarks, always use compiled JavaScript (`tsc` + `node`).

---

## Comparison: Observable vs RxJS

### Full Results Table

| Test | Observable | RxJS | Advantage |
|------|------------|------|-----------|
| Emit 100 values | **832K** | 134K | **6.2x faster** |
| Filter + transform | **158K** | 79K | **2x faster** |
| 10 subscribers | **5,170K** | 1,916K | **2.7x faster** |
| 100 subscribers | **632K** | 237K | **2.7x faster** |
| 1000 subscribers | **63K** | 19K | **3.4x faster** |
| 10000 subscribers | **5,710** | 2,083 | **2.7x faster** |
| stream(100) 1 sub | **453K** | 105K | **4.3x faster** |
| stream(100) 10 subs | **57K** | 20K | **2.9x faster** |
| stream(100) 100 subs | **6,394** | 2,368 | **2.7x faster** |
| stream(100) 1000 subs | **645** | 226 | **2.9x faster** |
| 5 chained filters | **66K** | 36K | **1.9x faster** |
| Large payload | **440K** | 109K | **4x faster** |
| Subscribe/unsubscribe 1000 | **2,029** | 1,063 | **1.9x faster** |
| switch/case OR-logic | **189K** | 88K | **2.1x faster** |

### Summary

**Observable beats RxJS in every test** with advantages ranging from 1.9x to 6.2x faster.

---

## Raw Benchmark Output

```
# Comparison: Observable vs RxJS
# (Creation excluded from measurements)

Observable - emit 100 values x 831,621 ops/sec ±1.17% (84 runs sampled)
RxJS - emit 100 values x 133,597 ops/sec ±1.31% (87 runs sampled)
Fastest is Observable - emit 100 values

Observable - filter and transform x 157,737 ops/sec ±0.99% (87 runs sampled)
RxJS - filter and transform x 78,904 ops/sec ±0.62% (93 runs sampled)
Fastest is Observable - filter and transform

Observable - 10 subscribers x 5,169,944 ops/sec ±0.94% (91 runs sampled)
RxJS - 10 subscribers x 1,915,637 ops/sec ±0.63% (92 runs sampled)
Fastest is Observable - 10 subscribers

Observable - 100 subscribers x 631,521 ops/sec ±0.59% (90 runs sampled)
RxJS - 100 subscribers x 237,065 ops/sec ±0.55% (92 runs sampled)
Fastest is Observable - 100 subscribers

Observable - 1000 subscribers x 63,270 ops/sec ±0.81% (91 runs sampled)
RxJS - 1000 subscribers x 18,843 ops/sec ±1.00% (86 runs sampled)
Fastest is Observable - 1000 subscribers

Observable - 10000 subscribers x 5,710 ops/sec ±1.84% (85 runs sampled)
RxJS - 10000 subscribers x 2,083 ops/sec ±0.52% (91 runs sampled)
Fastest is Observable - 10000 subscribers

Observable - stream(100) 1 subs x 452,908 ops/sec ±0.78% (90 runs sampled)
RxJS - next(100) 1 subs x 105,287 ops/sec ±1.22% (89 runs sampled)
Fastest is Observable - stream(100) 1 subs

Observable - stream(100) 10 subs x 57,162 ops/sec ±0.58% (92 runs sampled)
RxJS - next(100) 10 subs x 19,548 ops/sec ±0.61% (91 runs sampled)
Fastest is Observable - stream(100) 10 subs

Observable - stream(100) 100 subs x 6,394 ops/sec ±0.68% (91 runs sampled)
RxJS - next(100) 100 subs x 2,368 ops/sec ±0.68% (90 runs sampled)
Fastest is Observable - stream(100) 100 subs

Observable - stream(100) 1000 subs x 645 ops/sec ±0.99% (88 runs sampled)
RxJS - next(100) 1000 subs x 226 ops/sec ±0.93% (82 runs sampled)
Fastest is Observable - stream(100) 1000 subs

Observable - 5 chained filters x 66,457 ops/sec ±0.81% (90 runs sampled)
RxJS - 5 chained filters x 35,841 ops/sec ±0.95% (84 runs sampled)
Fastest is Observable - 5 chained filters

Observable - large payload x 439,664 ops/sec ±0.96% (87 runs sampled)
RxJS - large payload x 109,121 ops/sec ±1.19% (86 runs sampled)
Fastest is Observable - large payload

Observable - subscribe/unsubscribe 1000 x 2,029 ops/sec ±2.07% (87 runs sampled)
RxJS - subscribe/unsubscribe 1000 x 1,063 ops/sec ±2.82% (75 runs sampled)
Fastest is Observable - subscribe/unsubscribe 1000

Observable - switch/case OR-logic x 188,788 ops/sec ±0.43% (92 runs sampled)
RxJS - filter with OR conditions x 87,758 ops/sec ±0.95% (90 runs sampled)
Fastest is Observable - switch/case OR-logic
```

---

## Main Benchmarks (Observable Only)

### Creating Observable

```
new Observable x 54,714,771 ops/sec ±2.15% (86 runs sampled)
new OrderedObservable x 13,254,598 ops/sec ±1.55% (89 runs sampled)
Fastest is new Observable
```

### Subscribing to Observable

```
subscribe - one subscriber x 3,855,200 ops/sec ±1.39% (87 runs sampled)
subscribe - 10 subscribers x 571,443 ops/sec ±1.41% (91 runs sampled)
Fastest is subscribe - one subscriber
```

### Next Method

```
next - no subscribers x 48,863,478 ops/sec ±2.34% (83 runs sampled)
next - one subscriber x 3,795,573 ops/sec ±2.08% (85 runs sampled)
next - 10 subscribers x 444,449 ops/sec ±2.18% (84 runs sampled)
next - 100 subscribers x 50,930 ops/sec ±1.81% (89 runs sampled)
Fastest is next - no subscribers
```

### Stream Method

```
stream - 10 values, 1 subscriber x 1,965,104 ops/sec ±1.23% (93 runs sampled)
stream - 100 values, 1 subscriber x 473,500 ops/sec ±1.88% (86 runs sampled)
stream - 10 values, 10 subscribers x 331,632 ops/sec ±2.01% (88 runs sampled)
Fastest is stream - 10 values, 1 subscriber
```

### Pipe and Filters

```
pipe.setOnce x 2,488,286 ops/sec ±1.31% (90 runs sampled)
pipe.refine - simple condition x 3,125,406 ops/sec ±1.07% (93 runs sampled)
pipe.refine - complex condition x 2,391,150 ops/sec ±2.57% (86 runs sampled)
pipe.then - transformation x 2,736,938 ops/sec ±1.73% (87 runs sampled)
addFilter - simple filter x 2,922,837 ops/sec ±1.53% (89 runs sampled)
Fastest is pipe.refine - simple condition
```

### OrderedObservable

```
OrderedObservable - subscription and sorting x 614,517 ops/sec ±1.55% (89 runs sampled)
OrderedObservable - changing sort order x 770,279 ops/sec ±1.35% (89 runs sampled)
Fastest is OrderedObservable - changing sort order
```

### Collector

```
Collector - collection and unsubscription x 1,171,345 ops/sec ±1.74% (90 runs sampled)
Collector - individual unsubscription x 890,264 ops/sec ±1.77% (90 runs sampled)
Fastest is Collector - collection and unsubscription
```

---

## Key Takeaways

1. **Observable beats RxJS** in all tests (1.9x-6.2x faster)
2. **Emit 100 values is the biggest win** at 6.2x faster than RxJS
3. **Large payload handling** is 4x faster than RxJS
4. **Consistent 2.7x advantage** across subscriber counts (10-10000)
5. **1000 subscribers** shows 3.4x advantage — best scaling point
6. **Always benchmark with compiled JS** — tsx/esbuild gives misleading results
