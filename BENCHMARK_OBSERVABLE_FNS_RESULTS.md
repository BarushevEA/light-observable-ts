# Benchmark Results: EVG Observable vs observable-fns

Date: 2026-01-10

## Methodology

Performance comparison of two lightweight Observable libraries:

1. **EVG Observable** - True hot observables with original architecture
2. **observable-fns** - Based on zen-observable, provides Subject for hot observables

Benchmarked on Node.js v22.17.1, results averaged over 3 clean runs (no background processes).

## Test Results

### 1. Observable Creation

| Library | Ops/sec | Relative Performance |
|---------|---------|---------------------|
| EVG Observable | 54,138,000 | **baseline** |
| observable-fns | 17,226,000 | 3.1x slower |

**Winner: EVG Observable** (3.1x faster)

### 2. Single Emission Performance Matrix

#### 1 Emission × Multiple Subscribers

| Subscribers | EVG Observable | observable-fns | Advantage |
|-------------|----------------|----------------|-----------|
| 1 | 53,802,000 ops/sec | 36,757,000 | **1.5x faster** |
| 10 | 14,318,000 ops/sec | 6,283,000 | **2.3x faster** |
| 100 | 1,700,000 ops/sec | 733,000 | **2.3x faster** |
| 1,000 | 176,000 ops/sec | 73,000 | **2.4x faster** |
| 10,000 | 16,100 ops/sec | 6,900 | **2.3x faster** |

**Winner: EVG Observable** (consistent 1.5-2.4x advantage)

#### 10 Emissions × Multiple Subscribers

| Subscribers | EVG Observable | observable-fns | Advantage |
|-------------|----------------|----------------|-----------|
| 1 | 9,881,000 ops/sec | 5,568,000 | **1.8x faster** |
| 10 | 1,651,000 ops/sec | 677,000 | **2.4x faster** |
| 100 | 176,000 ops/sec | 75,000 | **2.3x faster** |
| 1,000 | 17,800 ops/sec | 7,400 | **2.4x faster** |
| 10,000 | 1,600 ops/sec | 700 | **2.3x faster** |

**Winner: EVG Observable** (consistent 1.8-2.4x advantage)

#### 100 Emissions × Multiple Subscribers

| Subscribers | EVG Observable | observable-fns | Advantage |
|-------------|----------------|----------------|-----------|
| 1 | 1,022,000 ops/sec | 552,000 | **1.9x faster** |
| 10 | 169,000 ops/sec | 69,000 | **2.4x faster** |
| 100 | 17,500 ops/sec | 7,300 | **2.4x faster** |
| 1,000 | 1,770 ops/sec | 730 | **2.4x faster** |
| 10,000 | 166 ops/sec | 65 | **2.6x faster** |

**Winner: EVG Observable** (consistent 1.9-2.6x advantage)

#### 1000 Emissions × Multiple Subscribers

| Subscribers | EVG Observable | observable-fns | Advantage |
|-------------|----------------|----------------|-----------|
| 1 | 98,400 ops/sec | 54,400 | **1.8x faster** |
| 10 | 16,900 ops/sec | 7,000 | **2.4x faster** |
| 100 | 1,750 ops/sec | 730 | **2.4x faster** |
| 1,000 | 179 ops/sec | 75 | **2.4x faster** |
| 10,000 | 15.8 ops/sec | 6.1 | **2.6x faster** |

**Winner: EVG Observable** (consistent 1.8-2.6x advantage)

### 3. Filter & Transform (pipe chain with 100 emissions)

| Subscribers | EVG Observable | observable-fns | Advantage |
|-------------|----------------|----------------|-----------|
| 1 | 292,000 ops/sec | 127,000 | **2.3x faster** |
| 10 | 275,000 ops/sec | 18,700 | **14.7x faster** |
| 100 | 280,000 ops/sec | 1,880 | **149x faster** |
| 1,000 | 273,000 ops/sec | 143 | **1,909x faster** |
| 10,000 | 277,000 ops/sec | 13.7 | **20,219x faster** |

**Winner: EVG Observable** (dramatic advantage at higher subscriber counts)

**Analysis:** EVG Observable's pipe architecture is extremely efficient with multiple subscribers. observable-fns creates separate pipe chains per subscriber, causing exponential slowdown.

### 4. Five Chained Filters (100 emissions)

| Subscribers | EVG Observable | observable-fns | Advantage |
|-------------|----------------|----------------|-----------|
| 1 | 119,000 ops/sec | 71,300 | **1.7x faster** |
| 10 | 116,400 ops/sec | 7,280 | **16.0x faster** |
| 100 | 113,500 ops/sec | 709 | **160x faster** |
| 1,000 | 112,400 ops/sec | 57.6 | **1,951x faster** |
| 10,000 | 114,100 ops/sec | 2.1 | **54,333x faster** |

**Winner: EVG Observable** (exponential advantage at higher subscriber counts)

**Analysis:** Complex pipe chains show EVG Observable's architectural superiority. The advantage grows exponentially with subscriber count.

### 5. Large Payload (complex objects, 100 emissions)

| Library | Ops/sec | Relative Performance |
|---------|---------|---------------------|
| EVG Observable | 749,000 | **baseline** |
| observable-fns | 549,000 | 1.4x slower |

**Winner: EVG Observable** (1.4x faster)

### 6. Subscribe/Unsubscribe Churn (1000 cycles)

| Library | Ops/sec | Relative Performance |
|---------|---------|---------------------|
| EVG Observable | 4,406 | **~equal** |
| observable-fns | 4,537 | ~equal |

**Winner: Tie** (within margin of error)

**Analysis:** Both libraries have similar overhead for subscription management.

## Summary

### Key Findings

1. **Simple Emissions (1 subscriber)**: EVG Observable is **1.5-1.9x faster**
   - Consistent advantage across all emission counts
   - Both scale linearly

2. **Multiple Subscribers (10-10,000)**: EVG Observable is **2.3-2.6x faster**
   - Advantage increases slightly with subscriber count
   - EVG's true hot observable architecture shines

3. **Pipe Operations**: EVG Observable has **dramatic advantage**
   - 1 subscriber: 1.7-2.3x faster
   - 10 subscribers: 14.7-16.0x faster
   - 100 subscribers: 149-160x faster
   - 1,000 subscribers: 1,900-1,950x faster
   - 10,000 subscribers: 20,000-54,000x faster

4. **Observable Creation**: EVG Observable is **3.1x faster**
   - Lower instantiation overhead

5. **Large Payloads**: EVG Observable is **1.4x faster**
   - Efficient data passing

### Architectural Insights

**EVG Observable's advantages:**
- True hot observable architecture (single pipe chain for all subscribers)
- Efficient subscription management for multi-subscriber scenarios
- Optimized pipe operations that don't duplicate work
- Lower memory overhead per subscriber

**observable-fns characteristics:**
- Based on zen-observable (cold observables)
- Each subscriber creates separate pipe chain
- Good for single-subscriber patterns
- Struggles with multi-subscriber pipe operations

### Recommendations

**Choose EVG Observable when:**
- You have multiple subscribers (most real-world scenarios)
- Using pipe operators (filter, map, etc.)
- Performance is critical
- Real-time broadcasting (WebSocket, SSE, event emitters)
- Need hot observable semantics

**Choose observable-fns when:**
- You need zen-observable API compatibility
- Single subscriber patterns
- Cold observable semantics required

### Performance Summary Table

| Operation Type | Typical Advantage | Best Case | Worst Case |
|----------------|-------------------|-----------|------------|
| Simple emission | 1.5-2.4x | 2.6x | 1.5x |
| Pipe (1 sub) | 1.7-2.3x | 2.3x | 1.7x |
| Pipe (10+ subs) | 15-20,000x | 54,333x | 14.7x |
| Creation | 3.1x | 3.1x | 3.1x |
| Large payloads | 1.4x | 1.4x | 1.4x |
| Sub/Unsub | ~equal | - | - |

## Technical Details

- **Node.js**: v22.17.1
- **Benchmark.js**: Standard settings
- **Runs**: 3 clean benchmark runs, averaged
- **Per-test samples**: 70-94 runs per scenario
- **Margin of Error**: ±1.2% - ±2.9% (typical)
- **Total scenarios**: 33 benchmark scenarios
- **Verification**: All pipe operations include result verification to ensure correct behavior
