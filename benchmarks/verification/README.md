# Verification Tests

This directory contains verification tests that prove the architectural differences between EVG Observable and observable-fns.

## Purpose

These tests were created to verify the unexpected benchmark results showing 100x-40000x performance differences in filter scenarios. They demonstrate that observable-fns executes filters **N times for N subscribers** (N×N pattern), while EVG Observable executes filters **once per emission** (1×N pattern).

## Test Files

### test-count-executions.ts

**Purpose:** Count exact number of filter/map executions

**What it tests:**
- EVG Observable: 100 subscribers + 10 emissions → **10 filter calls, 5 map calls**
- observable-fns: 100 subscribers + 10 emissions → **1000 filter calls, 500 map calls**

**Run:**
```bash
npx ts-node benchmarks/verification/test-count-executions.ts
```

**Expected output:**
```
=== ПОДСЧЕТ ВЫЗОВОВ FILTER ===

--- EVG Observable ---
100 подписчиков, 10 emissions:
  Filter executions: 10
  Map executions: 5
  Expected: 10 filter, 5 map (половина проходит фильтр)

--- observable-fns (multicast) ---
100 подписчиков, 10 emissions:
  Filter executions: 1000
  Map executions: 500
  Expected if sharing: 10 filter, 5 map
  Expected if per-subscriber: 1000 filter, 500 map

⚠️  ПРОБЛЕМА: Filter вызывается 100 раз на подписчика!
  Это 100x больше чем нужно для горячего observable!
```

### test-observable-fns.ts

**Purpose:** Test different multicast patterns with observable-fns

**What it tests:**
- TEST 1: `Subject + filter` without multicast → filters don't execute at all
- TEST 2: `multicast(subject).filter()` → filter called **N times** (once per subscriber)
- TEST 3: `multicast` applied after filter → doesn't work

**Run:**
```bash
npx ts-node benchmarks/verification/test-observable-fns.ts
```

**Key finding:** Only TEST 2 pattern works, but creates N execution chains.

### test-observable-fns-2.ts

**Purpose:** Test pipe() usage patterns

**What it tests:**
- TEST 4: `subject.pipe(filter, map)` then `multicast()` → doesn't work
- TEST 5: `subject.pipe(filter, map)` with direct subscriptions → async execution, N×N pattern

**Run:**
```bash
npx ts-node benchmarks/verification/test-observable-fns-2.ts
```

**Key finding:** Direct subscription to `subject.pipe()` works but executes filters independently for each subscriber.

## Conclusion

These tests prove that the 100x-40000x performance differences in benchmark results are **real and accurate**. They reflect a fundamental architectural difference:

- **EVG Observable:** True hot observables - transformations execute once, results broadcast to all subscribers
- **observable-fns:** Cold observables with multicast wrapper - each subscriber creates its own transformation chain

This is **not a bug** in observable-fns - it's how zen-observable's cold observable architecture works by design.

## References

- Main benchmarks: `../benchmark-competitors.ts`
- Results documentation: `../benchmark-readme.md`
- Task history: `../../tmp/benchmark-competitors/history/history_plan_v1.md`
