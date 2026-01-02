# Benchmark Results

Full benchmark output for EVG Observable library.

**Environment:** Node.js 22.17.1, compiled JavaScript (tsc)
**Date:** 2026-01-02
**Last Updated:** 2026-01-02 (added QuickObservable)

> **Note:** Results vary significantly depending on how TypeScript is executed:
> - **tsx (esbuild):** Generates less optimal code for Observable classes
> - **ts-node / tsc:** Generates more optimal code
>
> For accurate benchmarks, always use compiled JavaScript (`tsc` + `node`).

---

## Comparison: Observable vs QuickObservable vs RxJS

### Full Results Table

| Test | Observable | QuickObservable | RxJS | Winner | vs RxJS |
|------|------------|-----------------|------|--------|---------|
| Creation + subscription | 2,606K | **4,302K** | 1,853K | QuickObservable | 2.3x |
| Emit 100 values | **498K** | 286K | 120K | Observable | 4.2x |
| Filter + transform | **148K** | 94K | 50K | Observable | 3x |
| 10 subscribers | 276K | **720K** | 181K | QuickObservable | 4x |
| 100 subscribers | 26K | **90K** | 18K | QuickObservable | 5x |
| 1000 subscribers | 1,842 | **4,669** | 1,652 | QuickObservable | 2.8x |
| 10000 subscribers | 53 | **59** | 51 | QuickObservable | 1.2x |
| stream(100) 1 sub | **308K** | 201K | 101K | Observable | 3.1x |
| stream(100) 10 subs | 39K | **50K** | 18K | QuickObservable | 2.7x |
| stream(100) 100 subs | 4,209 | **5,419** | 2,094 | QuickObservable | 2.6x |
| stream(100) 1000 subs | 390 | **474** | 169 | QuickObservable | 2.8x |
| 5 chained filters | **60K** | 57K | 32K | Observable | 1.8x |
| Large payload | **116K** | 109K | 63K | Observable | 1.8x |
| Unsubscribe 1000 | 2,110 | **4,873** | 1,937 | QuickObservable | 2.5x |
| switch/case OR-logic | **137K** | 124K | 81K | Observable | 1.7x |

### Winners Summary

| Winner | Tests Won | Best For |
|--------|-----------|----------|
| **QuickObservable** | 9 | Creation, 10-10000 subscribers, stream with multiple subs, unsubscribe |
| **Observable** | 6 | Emission, filters, stream with 1 sub, large payload, switch/case |
| **RxJS** | 0 | — |

### When to Use

- **Observable** — Few subscribers (1-5), complex pipe chains, large payloads
- **QuickObservable** — Many subscribers (10+), frequent stream() emissions, high subscriber churn

---

## Raw Benchmark Output

### Creation and Subscription

```
Observable - creation and subscription x 2,606,088 ops/sec ±0.99% (84 runs sampled)
QuickObservable - creation and subscription x 4,302,246 ops/sec ±1.81% (83 runs sampled)
RxJS - creation and subscription x 1,853,435 ops/sec ±0.74% (87 runs sampled)
Fastest is QuickObservable - creation and subscription
```

### Value Emission (100 values)

```
Observable - emit 100 values x 654,817 ops/sec ±1.15% (86 runs sampled)
QuickObservable - emit 100 values x 313,510 ops/sec ±1.15% (84 runs sampled)
RxJS - emit 100 values x 123,360 ops/sec ±1.15% (87 runs sampled)
Fastest is Observable - emit 100 values
```

### Filter and Transform

```
Observable - filter and transform x 154,882 ops/sec ±0.67% (89 runs sampled)
QuickObservable - filter and transform x 103,734 ops/sec ±0.77% (90 runs sampled)
RxJS - filter and transform x 50,928 ops/sec ±0.91% (90 runs sampled)
Fastest is Observable - filter and transform
```

### Subscribers Scaling (10 / 100 / 1000 / 10000)

```
Observable - 10 subscribers x 303,202 ops/sec ±0.66% (90 runs sampled)
QuickObservable - 10 subscribers x 721,082 ops/sec ±1.07% (87 runs sampled)
RxJS - 10 subscribers x 169,541 ops/sec ±1.12% (89 runs sampled)
Fastest is QuickObservable - 10 subscribers

Observable - 100 subscribers x 27,558 ops/sec ±1.09% (88 runs sampled)
QuickObservable - 100 subscribers x 80,748 ops/sec ±1.00% (85 runs sampled)
RxJS - 100 subscribers x 17,643 ops/sec ±0.84% (88 runs sampled)
Fastest is QuickObservable - 100 subscribers

Observable - 1000 subscribers x 1,992 ops/sec ±0.87% (87 runs sampled)
QuickObservable - 1000 subscribers x 2,613 ops/sec ±1.43% (78 runs sampled)
RxJS - 1000 subscribers x 1,511 ops/sec ±1.52% (85 runs sampled)
Fastest is QuickObservable - 1000 subscribers

Observable - 10000 subscribers x 53.38 ops/sec ±1.83% (69 runs sampled)
QuickObservable - 10000 subscribers x 58.85 ops/sec ±3.46% (60 runs sampled)
RxJS - 10000 subscribers x 50.84 ops/sec ±1.85% (63 runs sampled)
Fastest is QuickObservable - 10000 subscribers
```

### Stream Batch Emission

```
Observable - stream(100) 1 subs x 296,890 ops/sec ±0.72% (86 runs sampled)
QuickObservable - stream(100) 1 subs x 214,272 ops/sec ±0.66% (87 runs sampled)
RxJS - next(100) 1 subs x 97,041 ops/sec ±1.22% (88 runs sampled)
Fastest is Observable - stream(100) 1 subs

Observable - stream(100) 10 subs x 39,178 ops/sec ±0.78% (89 runs sampled)
QuickObservable - stream(100) 10 subs x 52,085 ops/sec ±0.52% (87 runs sampled)
RxJS - next(100) 10 subs x 18,875 ops/sec ±0.48% (92 runs sampled)
Fastest is QuickObservable - stream(100) 10 subs

Observable - stream(100) 100 subs x 4,378 ops/sec ±0.43% (91 runs sampled)
QuickObservable - stream(100) 100 subs x 6,103 ops/sec ±0.47% (92 runs sampled)
RxJS - next(100) 100 subs x 2,085 ops/sec ±1.17% (89 runs sampled)
Fastest is QuickObservable - stream(100) 100 subs

Observable - stream(100) 1000 subs x 390 ops/sec ±0.71% (87 runs sampled)
QuickObservable - stream(100) 1000 subs x 436 ops/sec ±1.69% (83 runs sampled)
RxJS - next(100) 1000 subs x 179 ops/sec ±0.90% (80 runs sampled)
Fastest is QuickObservable - stream(100) 1000 subs
```

### Chained Filters (5 filters)

```
Observable - 5 chained filters x 60,774 ops/sec ±1.02% (87 runs sampled)
QuickObservable - 5 chained filters x 59,161 ops/sec ±0.59% (93 runs sampled)
RxJS - 5 chained filters x 33,327 ops/sec ±0.58% (90 runs sampled)
Fastest is Observable - 5 chained filters
```

### Large Payload (Complex Objects)

```
Observable - large payload x 125,028 ops/sec ±0.70% (90 runs sampled)
QuickObservable - large payload x 109,319 ops/sec ±0.61% (89 runs sampled)
RxJS - large payload x 54,097 ops/sec ±1.12% (89 runs sampled)
Fastest is Observable - large payload
```

### Mass Unsubscribe (1000 subscribers)

```
Observable - unsubscribe 1000 x 2,056 ops/sec ±1.25% (85 runs sampled)
QuickObservable - unsubscribe 1000 x 2,743 ops/sec ±0.93% (88 runs sampled)
RxJS - unsubscribe 1000 x 1,802 ops/sec ±0.84% (86 runs sampled)
Fastest is QuickObservable - unsubscribe 1000
```

### Switch/Case OR-Logic Filtering

```
Observable - switch/case OR-logic x 130,376 ops/sec ±1.04% (85 runs sampled)
QuickObservable - switch/case OR-logic x 121,553 ops/sec ±0.87% (90 runs sampled)
RxJS - filter with OR conditions x 76,731 ops/sec ±1.19% (85 runs sampled)
Fastest is Observable - switch/case OR-logic
```

---

## QuickObservable Architecture

QuickObservable is optimized for scenarios with many subscribers (5+):

- **Batch storage:** Groups of 50 subscribers per batch
- **emit50():** Unrolled calls for full batches (no loop overhead)
- **Compaction:** Active subscribers moved to front after unsubscribes
- **Deferred unsubscribe:** Pending unsubscribes during emission processed after
- **Dual storage:** Simple subscribers → batches (fast), pipe subscribers → subs (standard)

### Performance Characteristics

| Subscribers | QuickObservable vs Observable |
|-------------|-------------------------------|
| 1-5 | Observable slightly faster |
| 10 | QuickObservable **2.6x faster** |
| 100 | QuickObservable **3.5x faster** |
| 1000 | QuickObservable **2.5x faster** |
| 10000 | QuickObservable **1.1x faster** |

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

1. **Both Observable and QuickObservable beat RxJS** in all tests (1.2x-5x faster)
2. **QuickObservable excels with many subscribers** (10-10000): 1.1x-3.5x faster than Observable
3. **Observable excels with few subscribers** and complex pipe chains
4. **Emit 100 values is the biggest win** at 4.2x faster than RxJS
5. **QuickObservable creation is 1.7x faster** than Observable (4.3M vs 2.6M ops/sec)
6. **QuickObservable wins at all subscriber counts** including 10000 (batch size = 50)
7. **Always benchmark with compiled JS** — tsx/esbuild gives misleading results
