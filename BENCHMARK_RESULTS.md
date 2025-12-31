# Benchmark Results

Full benchmark output for EVG Observable library.

**Environment:** Node.js 22.17.1
**Date:** 2025-12-31
**Last Updated:** 2025-12-31 (after optimization pass)

## Comparison with RxJS

### Core Operations

```
light-observable - creation and subscription x 4,258,000 ops/sec
RxJS - creation and subscription x 3,623,000 ops/sec
Fastest is light-observable - creation and subscription

light-observable - emit 100 values x 1,089,000 ops/sec
RxJS - emit 100 values x 213,000 ops/sec
Fastest is light-observable - emit 100 values

light-observable - filter and transform x 284,000 ops/sec
RxJS - filter and transform x 97,000 ops/sec
Fastest is light-observable - filter and transform
```

### Subscribers Scaling (10 / 100 / 1000 / 10000)

```
light-observable - 10 subscribers x 550,234 ops/sec
RxJS - 10 subscribers x 330,806 ops/sec
Fastest is light-observable - 10 subscribers

light-observable - 100 subscribers x 49,693 ops/sec
RxJS - 100 subscribers x 33,533 ops/sec
Fastest is light-observable - 100 subscribers

light-observable - 1000 subscribers x 3,396 ops/sec
RxJS - 1000 subscribers x 3,102 ops/sec
Fastest is light-observable - 1000 subscribers

light-observable - 10000 subscribers x 103 ops/sec
RxJS - 10000 subscribers x 93 ops/sec
Fastest is light-observable - 10000 subscribers
```

### stream() vs next() Loop

```
light-observable - stream() batch x 579,115 ops/sec
light-observable - next() loop x 621,618 ops/sec
Fastest is light-observable - next() loop
```

### Chained Filters (5 filters)

```
light-observable - 5 chained filters x 108,435 ops/sec
RxJS - 5 chained filters x 60,060 ops/sec
Fastest is light-observable - 5 chained filters
```

### Large Payload (Complex Objects)

```
light-observable - large payload x 212,884 ops/sec
RxJS - large payload x 103,206 ops/sec
Fastest is light-observable - large payload
```

### Mass Unsubscribe (1000 subscribers)

```
light-observable - unsubscribe 1000 x 3,831 ops/sec
RxJS - unsubscribe 1000 x 3,218 ops/sec
Fastest is light-observable - unsubscribe 1000
```

### Switch/Case OR-Logic Filtering

```
light-observable - switch/case OR-logic x 273,227 ops/sec
RxJS - filter with OR conditions x 138,112 ops/sec
Fastest is light-observable - switch/case OR-logic
```

### Summary

| Operation | EVG Observable | RxJS | Advantage |
|-----------|---------------|------|-----------|
| Creation + subscription | 4.26M ops/sec | 3.62M ops/sec | **1.17x faster** |
| Emit 100 values | 1.09M ops/sec | 213K ops/sec | **5.1x faster** |
| Filter + transform | 284K ops/sec | 97K ops/sec | **2.9x faster** |
| 10 subscribers | 550K ops/sec | 331K ops/sec | **1.7x faster** |
| 100 subscribers | 50K ops/sec | 34K ops/sec | **1.5x faster** |
| 1000 subscribers | 3.4K ops/sec | 3.1K ops/sec | **1.1x faster** |
| 10000 subscribers | 103 ops/sec | 93 ops/sec | **1.1x faster** |
| 5 chained filters | 108K ops/sec | 60K ops/sec | **1.8x faster** |
| Large payload | 213K ops/sec | 103K ops/sec | **2.1x faster** |
| Unsubscribe 1000 | 3.8K ops/sec | 3.2K ops/sec | **1.2x faster** |
| switch/case OR-logic | 273K ops/sec | 138K ops/sec | **2.0x faster** |

---

## Main Benchmarks

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

### Utility Functions

```
deleteFromArray - small array x 9,935,128 ops/sec ±2.03% (86 runs sampled)
quickDeleteFromArray - small array x 8,955,522 ops/sec ±1.53% (87 runs sampled)
deleteFromArray - large array x 236,827 ops/sec ±1.10% (92 runs sampled)
quickDeleteFromArray - large array x 234,852 ops/sec ±4.57% (91 runs sampled)
Array.splice - small array x 11,772,374 ops/sec ±1.71% (87 runs sampled)
Array.splice - large array x 229,112 ops/sec ±1.36% (89 runs sampled)
Fastest is Array.splice - small array
```

### Performance at Different Loads

```
Observable - light load (10 operations) x 2,010,178 ops/sec ±1.43% (88 runs sampled)
Observable - medium load (100 operations) x 520,194 ops/sec ±1.32% (90 runs sampled)
Observable - heavy load (1000 operations) x 62,742 ops/sec ±1.39% (91 runs sampled)
Fastest is Observable - light load (10 operations)
```

### deleteFromArray vs quickDeleteFromArray Comparison

```
deleteFromArray - small array (10 elements) x 5,058,816 ops/sec ±1.51% (88 runs sampled)
quickDeleteFromArray - small array (10 elements) x 5,096,976 ops/sec ±1.49% (91 runs sampled)
deleteFromArray - medium array (100 elements) x 1,730,384 ops/sec ±1.40% (89 runs sampled)
quickDeleteFromArray - medium array (100 elements) x 1,660,781 ops/sec ±1.36% (91 runs sampled)
deleteFromArray - large array (10000 elements) x 21,469 ops/sec ±6.81% (87 runs sampled)
quickDeleteFromArray - large array (10000 elements) x 20,787 ops/sec ±9.54% (88 runs sampled)
Fastest is quickDeleteFromArray - small array (10 elements)
```

---

## Optimization Results (2025-12-31)

Performance improvements after optimization pass:

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Emit 100 values | 878K ops/sec | 1.05M ops/sec | **+19%** |
| Medium load (100 ops) | 447K ops/sec | 520K ops/sec | **+16%** |
| Heavy load (1000 ops) | 51.6K ops/sec | 62.7K ops/sec | **+22%** |
| pipe.refine - simple | 2.76M ops/sec | 3.13M ops/sec | **+13%** |
| stream - 10 values | 1.76M ops/sec | 1.97M ops/sec | **+12%** |

### Optimizations Applied

1. Early exit in `Observable.next()` for empty subscriber list
2. Cached `subs.length` in iteration loops
3. Replaced `deleteFromArray` with `quickDeleteFromArray` in OrderedObservable
4. Optimized `Collector.unsubscribeAll()` to avoid double work
5. Merged condition checks in `SubscribeObject.processValue()`
6. Cached `chain.length` in `FilterCollection.processChain()` and `Pipe.processChain()`
7. Replaced `setInterval` polling with `Promise.resolve()` in `Observable.destroy()`

---

## Key Takeaways

1. **EVG Observable is 1.1x-5.1x faster than RxJS** across all tested operations
2. **Emit 100 values is the biggest win** at 5.1x faster than RxJS
3. **Observable creation is extremely fast** at ~55M ops/sec
4. **Advantage decreases with subscriber count**: 1.7x (10 subs) → 1.1x (10000 subs)
5. **Large payloads maintain 2.1x advantage** — no overhead for complex objects
6. **Chained filters (1.8x) and OR-logic (2.0x)** show consistent performance wins
7. **`next()` loop is slightly faster than `stream()`** — method call overhead
8. **Heavy load improved 22%** after optimization (51.6K → 62.7K ops/sec)
