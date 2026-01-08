# Benchmark Fixes - 2026-01-09

## Critical Bug Found and Fixed

### The Problem

**`pipe.subscribe()` overwrites `this.listener`!**

When multiple separate subscriptions are made to the same pipe:
```typescript
const pipe = obs.pipe().refine(...).then(...);
for (let i = 0; i < 1000; i++) {
    pipe.subscribe(() => {});  // Each call OVERWRITES the previous listener!
}
// Result: Only the LAST subscriber receives values!
```

This caused incorrect benchmark results where "separate subscriptions with pipe" appeared fast because they actually had only 1 subscriber instead of N.

### The Fix

For separate subscriptions with pipe, **each subscriber must create its OWN pipe instance**:
```typescript
for (let i = 0; i < 1000; i++) {
    // Create NEW pipe for EACH subscriber
    const pipe = obs.pipe().refine(...).then(...);
    pipe.subscribe(() => {});
}
// Result: All 1000 subscribers correctly receive values
```

For array subscription, use **shared pipe with array**:
```typescript
const pipe = obs.pipe().refine(...).then(...);
const listeners = [];
for (let i = 0; i < 1000; i++) {
    listeners.push(() => {});
}
pipe.subscribe(listeners);  // All listeners share ONE pipe
// Result: Pipe executes ONCE, all 1000 listeners get the result
```

## Files Fixed

### ✅ Fixed Files

1. **benchmark-patterns-clean.ts**
   - Changed: "Separate pipe" → "Each own pipe"
   - Fixed: Now creates NEW pipe for each subscriber
   - Result: Correctly shows shared pipe + array is ~7x faster

2. **benchmark-patterns-vs-competitors.ts**
   - Changed: "EVG (separate)" → "EVG (each own pipe)"
   - Changed: "EVG (array)" → "EVG (shared pipe + array)"
   - Fixed: Both EVG variants now correctly implemented
   - Result: Fair comparison against RxJS and observable-fns

3. **benchmark-patterns-fixed.ts**
   - Created as the CORRECT reference implementation
   - Shows all proper patterns
   - Includes overhead analysis

### ✅ Already Correct Files

- **benchmark-subscription-patterns.ts** - No pipe usage, already correct
- **benchmark-patterns-edge-cases.ts** - No pipe usage, already correct

### 🗑️ Removed Files

- **benchmark-patterns-correct.ts** - Intermediate attempt with errors, removed

## Correct Benchmark Results

### Without Pipe:
- **1 subscriber:** Separate faster (0.63x) - no wrapper overhead
- **2+ subscribers:** Array faster (1.1x - 7.8x) - fewer send() calls
- **Crossover point:** 2 subscribers

### With Pipe:
- **Each own pipe:** Slow (N × pipe execution)
- **Shared pipe + array:** Fast (1 × pipe execution)
- **Advantage:** 2.7x - 8.7x faster for shared pipe + array

## Usage Recommendations

### ✅ Use Array Subscription When:
- 2+ subscribers
- Same logic for all subscribers
- Want to maximize performance

### ✅ Use Separate Subscriptions When:
- 1 subscriber only
- Each subscriber needs different pipe/logic

### 🏆 Best Pattern for Multiple Subscribers:
```typescript
const obs = new Observable<number>(0);

// Create shared pipe
const pipe = obs.pipe()
    .refine(v => v % 2 === 0)
    .then(v => `Value: ${v}`);

// Subscribe with array
const listeners = [];
for (let i = 0; i < 1000; i++) {
    listeners.push((value) => console.log(value));
}
pipe.subscribe(listeners);

// Result: 1 pipe execution → 1000 listeners = FAST!
```

## NPM Scripts

Updated package.json with new benchmark scripts:

```bash
npm run benchmark:patterns              # Original patterns benchmark
npm run benchmark:patterns-edge         # Edge cases (crossover point)
npm run benchmark:patterns-clean        # Clean single-emission tests
npm run benchmark:patterns-final        # FINAL correct implementation
npm run benchmark:patterns-vs-competitors  # vs RxJS & observable-fns
```

## Key Takeaway

**Always create a NEW pipe instance for each separate subscriber, OR use shared pipe with array subscription.**

The "shared pipe with multiple separate subscriptions" pattern is **broken** because `subscribe()` overwrites the listener.
