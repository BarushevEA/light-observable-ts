# Benchmark Results

Full benchmark output for EVG Observable library.

**Environment:** Node.js 22.17.1
**Date:** 2025-12-31

## Comparison with RxJS

```
# Comparison of light-observable-ts with RxJS
light-observable - creation and subscription x 4,191,157 ops/sec ±1.56% (89 runs sampled)
RxJS - creation and subscription x 2,843,063 ops/sec ±2.57% (86 runs sampled)
Fastest is light-observable - creation and subscription

light-observable - emit 100 values x 878,156 ops/sec ±2.30% (86 runs sampled)
RxJS - emit 100 values x 203,347 ops/sec ±2.58% (84 runs sampled)
Fastest is light-observable - emit 100 values

light-observable - filter and transform x 291,440 ops/sec ±2.07% (91 runs sampled)
RxJS - filter and transform x 82,348 ops/sec ±2.32% (86 runs sampled)
Fastest is light-observable - filter and transform
```

### Summary

| Operation | EVG Observable | RxJS | Advantage |
|-----------|---------------|------|-----------|
| Creation + subscription | 4.2M ops/sec | 2.8M ops/sec | **1.5x faster** |
| Emit 100 values | 878K ops/sec | 203K ops/sec | **4.3x faster** |
| Filter + transform | 291K ops/sec | 82K ops/sec | **3.5x faster** |

---

## Main Benchmarks

### Creating Observable

```
new Observable x 53,723,704 ops/sec ±2.13% (86 runs sampled)
new OrderedObservable x 13,671,445 ops/sec ±1.66% (89 runs sampled)
Fastest is new Observable
```

### Subscribing to Observable

```
subscribe - one subscriber x 3,729,816 ops/sec ±2.24% (85 runs sampled)
subscribe - 10 subscribers x 553,561 ops/sec ±2.34% (84 runs sampled)
Fastest is subscribe - one subscriber
```

### Next Method

```
next - no subscribers x 49,962,398 ops/sec ±2.18% (83 runs sampled)
next - one subscriber x 3,646,867 ops/sec ±1.28% (86 runs sampled)
next - 10 subscribers x 493,588 ops/sec ±1.43% (87 runs sampled)
next - 100 subscribers x 48,617 ops/sec ±1.27% (90 runs sampled)
Fastest is next - no subscribers
```

### Stream Method

```
stream - 10 values, 1 subscriber x 1,759,274 ops/sec ±1.41% (92 runs sampled)
stream - 100 values, 1 subscriber x 455,072 ops/sec ±1.46% (89 runs sampled)
stream - 10 values, 10 subscribers x 309,699 ops/sec ±1.44% (90 runs sampled)
Fastest is stream - 10 values, 1 subscriber
```

### Pipe and Filters

```
pipe.setOnce x 2,280,776 ops/sec ±2.11% (88 runs sampled)
pipe.refine - simple condition x 2,757,186 ops/sec ±2.04% (85 runs sampled)
pipe.refine - complex condition x 2,277,599 ops/sec ±1.26% (90 runs sampled)
pipe.then - transformation x 2,625,404 ops/sec ±1.76% (91 runs sampled)
addFilter - simple filter x 2,984,560 ops/sec ±1.63% (89 runs sampled)
Fastest is addFilter - simple filter
```

### OrderedObservable

```
OrderedObservable - subscription and sorting x 546,563 ops/sec ±2.55% (83 runs sampled)
OrderedObservable - changing sort order x 743,095 ops/sec ±1.69% (88 runs sampled)
Fastest is OrderedObservable - changing sort order
```

### Collector

```
Collector - collection and unsubscription x 1,178,214 ops/sec ±1.46% (88 runs sampled)
Collector - individual unsubscription x 933,788 ops/sec ±1.24% (90 runs sampled)
Fastest is Collector - collection and unsubscription
```

### Utility Functions

```
deleteFromArray - small array x 9,554,925 ops/sec ±1.70% (87 runs sampled)
quickDeleteFromArray - small array x 8,804,966 ops/sec ±2.12% (88 runs sampled)
deleteFromArray - large array x 223,034 ops/sec ±2.12% (83 runs sampled)
quickDeleteFromArray - large array x 225,780 ops/sec ±1.64% (87 runs sampled)
Array.splice - small array x 11,855,149 ops/sec ±1.13% (89 runs sampled)
Array.splice - large array x 231,211 ops/sec ±1.02% (91 runs sampled)
Fastest is Array.splice - small array
```

### Performance at Different Loads

```
Observable - light load (10 operations) x 1,980,847 ops/sec ±1.62% (86 runs sampled)
Observable - medium load (100 operations) x 446,675 ops/sec ±1.74% (93 runs sampled)
Observable - heavy load (1000 operations) x 51,574 ops/sec ±1.99% (85 runs sampled)
Fastest is Observable - light load (10 operations)
```

### deleteFromArray vs quickDeleteFromArray Comparison

```
deleteFromArray - small array (10 elements) x 4,930,621 ops/sec ±1.65% (87 runs sampled)
quickDeleteFromArray - small array (10 elements) x 5,015,440 ops/sec ±1.71% (90 runs sampled)
deleteFromArray - medium array (100 elements) x 1,621,797 ops/sec ±2.33% (86 runs sampled)
quickDeleteFromArray - medium array (100 elements) x 1,713,927 ops/sec ±1.44% (90 runs sampled)
deleteFromArray - large array (10000 elements) x 20,206 ops/sec ±6.50% (84 runs sampled)
quickDeleteFromArray - large array (10000 elements) x 20,326 ops/sec ±7.40% (86 runs sampled)
Fastest is quickDeleteFromArray - small array (10 elements)
```

---

## Key Takeaways

1. **EVG Observable is 1.5x-4.3x faster than RxJS** in common operations
2. **Observable creation is extremely fast** at ~54M ops/sec
3. **Performance scales linearly** with subscriber count (expected behavior)
4. **`quickDeleteFromArray` is slightly faster** than `deleteFromArray` on small/medium arrays
5. **`addFilter()` is the fastest** pipe/filter operation at ~3M ops/sec
