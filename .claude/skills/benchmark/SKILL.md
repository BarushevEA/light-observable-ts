---
name: benchmark
description: |
  Run EVG Observable benchmarks — core performance, RxJS comparison,
  competitor comparison, subscription patterns, and bundle benchmarks.
  Use when the user wants to run benchmarks, check performance, or
  compare against RxJS/observable-fns.
argument-hint: <type> (core | comparison | competitors | patterns | bundles | all)
disable-model-invocation: true
---

# Run EVG Observable Benchmarks

## Parameters

- `$1` — benchmark type (default: `core` if not provided)

## Available Benchmark Types

| Type | Command | What it measures |
|------|---------|------------------|
| `core` | `npm run benchmark` | Observable creation, subscription, next(), pipes, OrderedObservable, Collector, load tests |
| `comparison` | `npm run benchmark:comparison` | EVG Observable vs RxJS (emit, filter+transform, multi-subscriber, batch, chained filters, large payloads) |
| `competitors` | `npm run benchmark:competitors` | EVG Observable vs observable-fns (emit matrix, filter matrix, large payloads, subscription churn) |
| `patterns` | `npm run benchmark:patterns-clean` | Subscription patterns — separate vs array at various subscriber counts |
| `bundles` | `npm run benchmark:bundles` | Bundle size and performance comparisons |
| `all` | Run all above sequentially | Full benchmark suite |

## Steps

1. Determine which benchmark to run from `$1` (default: `core`)
2. If `$1` is `all`, run each benchmark sequentially in this order: core → comparison → competitors → patterns → bundles
3. Run the benchmark command via `npm run benchmark:<type>`
4. Wait for completion — benchmarks take 1-5 minutes depending on type
5. Report results summary: ops/sec for key tests, fastest indicator, any regressions vs known baselines

## Interpreting Results

Each benchmark suite outputs Benchmark.js cycle results:
```
Observable - emit 100 values x 1,662,000 ops/sec ±1.23% (92 runs sampled)
```

Key metrics to highlight:
- **ops/sec** — higher is better
- **±percentage** — measurement variance, should be < 5%
- **Fastest is** — winner in each suite

## Known Performance Baselines (v3.0.0)

Use these to detect regressions:

| Test | Expected ops/sec |
|------|------------------|
| Emit 100 values | ~1,662K |
| Filter + transform | ~340K |
| 10 subscribers | ~9,946K |
| 100 subscribers | ~1,236K |
| 1000 subscribers | ~124K |
| Batch of(100) | ~906K |
| Observable creation | ~122M |

If any result drops below 80% of baseline, flag as potential regression.

## After Running

- If running `comparison` or `competitors`, format results as a comparison table
- If a regression is detected, suggest investigating recent changes
- Results are printed to console only — not saved to file unless the user asks
