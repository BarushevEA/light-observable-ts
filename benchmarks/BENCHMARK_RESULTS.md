# Benchmark Results

Full benchmark output for EVG Observable library.

**Environment:** Node.js 22.17.1, compiled JavaScript (tsc)
**Date:** 2026-01-06

> **Note:** Results vary significantly depending on how TypeScript is executed:
> - **tsx (esbuild):** Generates less optimal code for Observable classes
> - **ts-node / tsc:** Generates more optimal code
>
> For accurate benchmarks, always use compiled JavaScript (`tsc` + `node`).

---

## Bundle vs Bundle Comparison (Fair Comparison)

Comparing minified bundles: **EVG Observable (6.4 kB)** vs **RxJS UMD (88 kB)**

| Test | EVG Bundle | RxJS Bundle | EVG Advantage |
|------|------------|-------------|---------------|
| Emit 100 values | **1,548K** | 240K | **6.4x faster** |
| Filter + transform | **353K** | 164K | **2.1x faster** |
| 10 subscribers | **9,078K** | 2,900K | **3.1x faster** |
| 100 subscribers | **1,245K** | 336K | **3.7x faster** |
| 1000 subscribers | **122K** | 33K | **3.7x faster** |
| Large payload | **865K** | 199K | **4.3x faster** |
| Subscribe/unsubscribe 100 | **59K** | 17K | **3.4x faster** |

**Summary:** EVG Observable is **2-6x faster** than RxJS and **13.75x smaller** (6.4 kB vs 88 kB).

### Raw Output

```
# Bundle vs Bundle: EVG Observable (6.4 kB) vs RxJS UMD (88 kB)
# Both minified for fair comparison

EVG Bundle  - emit 100 values x 1,548,123 ops/sec ±2.49% (83 runs sampled)
RxJS Bundle - emit 100 values x 240,375 ops/sec ±2.03% (84 runs sampled)
Fastest is EVG Bundle  - emit 100 values

EVG Bundle  - filter+transform x 352,501 ops/sec ±2.06% (85 runs sampled)
RxJS Bundle - filter+transform x 164,362 ops/sec ±2.18% (89 runs sampled)
Fastest is EVG Bundle  - filter+transform

EVG Bundle  - 10 subscribers x 9,078,488 ops/sec ±2.75% (82 runs sampled)
RxJS Bundle - 10 subscribers x 2,900,299 ops/sec ±1.81% (89 runs sampled)
Fastest is EVG Bundle  - 10 subscribers

EVG Bundle  - 100 subscribers x 1,245,014 ops/sec ±1.59% (90 runs sampled)
RxJS Bundle - 100 subscribers x 336,292 ops/sec ±1.31% (91 runs sampled)
Fastest is EVG Bundle  - 100 subscribers

EVG Bundle  - 1000 subscribers x 122,442 ops/sec ±1.87% (89 runs sampled)
RxJS Bundle - 1000 subscribers x 33,178 ops/sec ±1.35% (92 runs sampled)
Fastest is EVG Bundle  - 1000 subscribers

EVG Bundle  - large payload x 865,220 ops/sec ±1.49% (92 runs sampled)
RxJS Bundle - large payload x 199,485 ops/sec ±1.39% (90 runs sampled)
Fastest is EVG Bundle  - large payload

EVG Bundle  - sub/unsub 100 x 58,579 ops/sec ±4.69% (83 runs sampled)
RxJS Bundle - sub/unsub 100 x 17,248 ops/sec ±4.55% (82 runs sampled)
Fastest is EVG Bundle  - sub/unsub 100

# Bundle comparison complete
# EVG Observable: 6.4 kB | RxJS UMD: 88 kB (13.75x larger)
```

---

## Module vs Browser Bundle vs RxJS

Comparing: **EVG Module** vs **EVG Browser Bundle** vs **RxJS Module**

| Test | Module | Browser Bundle | RxJS | Bundle vs Module |
|------|--------|----------------|------|------------------|
| Emit 100 values | 1,341K | **1,677K** | 230K | **+25%** |
| Filter + transform | 315K | **324K** | 146K | **+3%** |
| 10 subscribers | 8,770K | **9,719K** | 3,546K | **+11%** |
| 100 subscribers | 1,059K | **1,223K** | 425K | **+15%** |
| 1000 subscribers | 105K | **116K** | 40K | **+10%** |
| Large payload | 779K | **854K** | 185K | **+10%** |
| Subscribe/unsubscribe 100 | 52K | **58K** | 17K | **+12%** |

**Conclusion:** Minified browser bundle is **3-25% faster** than module version due to optimization during minification.

### Raw Output

```
# Comparison: Module vs Browser Bundle vs RxJS
# (Creation excluded from measurements)

Module    - emit 100 values x 1,340,566 ops/sec ±1.64% (88 runs sampled)
Browser   - emit 100 values x 1,676,699 ops/sec ±1.21% (91 runs sampled)
RxJS      - emit 100 values x 230,170 ops/sec ±1.71% (86 runs sampled)
Fastest is Browser   - emit 100 values

Module    - filter+transform x 314,695 ops/sec ±2.02% (79 runs sampled)
Browser   - filter+transform x 323,693 ops/sec ±1.64% (86 runs sampled)
RxJS      - filter+transform x 146,499 ops/sec ±2.22% (85 runs sampled)
Fastest is Browser   - filter+transform,Module    - filter+transform

Module    - 10 subscribers x 8,770,146 ops/sec ±1.41% (90 runs sampled)
Browser   - 10 subscribers x 9,718,707 ops/sec ±1.67% (88 runs sampled)
RxJS      - 10 subscribers x 3,546,289 ops/sec ±1.33% (90 runs sampled)
Fastest is Browser   - 10 subscribers

Module    - 100 subscribers x 1,059,255 ops/sec ±1.63% (90 runs sampled)
Browser   - 100 subscribers x 1,222,650 ops/sec ±1.41% (91 runs sampled)
RxJS      - 100 subscribers x 424,543 ops/sec ±1.61% (86 runs sampled)
Fastest is Browser   - 100 subscribers

Module    - 1000 subscribers x 105,209 ops/sec ±2.01% (86 runs sampled)
Browser   - 1000 subscribers x 115,728 ops/sec ±2.38% (84 runs sampled)
RxJS      - 1000 subscribers x 40,232 ops/sec ±2.28% (84 runs sampled)
Fastest is Browser   - 1000 subscribers

Module    - large payload x 778,616 ops/sec ±1.37% (88 runs sampled)
Browser   - large payload x 854,356 ops/sec ±1.24% (89 runs sampled)
RxJS      - large payload x 185,024 ops/sec ±1.17% (90 runs sampled)
Fastest is Browser   - large payload

Module    - sub/unsub 100 x 52,085 ops/sec ±4.54% (85 runs sampled)
Browser   - sub/unsub 100 x 58,222 ops/sec ±3.79% (89 runs sampled)
RxJS      - sub/unsub 100 x 16,927 ops/sec ±5.03% (80 runs sampled)
Fastest is Browser   - sub/unsub 100
```

---

## Comparison: Observable Module vs RxJS Module

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

### Raw Output

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

1. **Bundle vs Bundle:** EVG Observable is **2-6x faster** and **13.75x smaller** than RxJS
2. **Browser bundle is faster:** Minification provides **3-25% performance boost** over module
3. **Emit 100 values is the biggest win** at 6.4x faster than RxJS (bundle comparison)
4. **Large payload handling** is 4.3x faster than RxJS
5. **Consistent 3-4x advantage** across subscriber counts (10-1000)
6. **Size comparison:** EVG 6.4 kB vs RxJS 88 kB
7. **Always benchmark with compiled JS** — tsx/esbuild gives misleading results
