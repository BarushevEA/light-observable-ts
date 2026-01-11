# Migration Guide: v2.x → v3.0.0

This is a **breaking change** release. All operator names have been updated for better clarity and RxJS alignment.

---

## Quick Start

### Automated Migration (Recommended)

Use this command to automatically update your codebase:

```bash
find src -name "*.ts" -exec sed -i \
    -e 's/\.stream(/\.of(/g' \
    -e 's/\.refine(/\.and(/g' \
    -e 's/\.then(/\.map(/g' \
    -e 's/\.setOnce(/\.once(/g' \
    -e 's/\.serialize(/\.toJson(/g' \
    -e 's/\.deserialize(/\.fromJson(/g' \
    -e 's/\.switch(/\.choice(/g' \
    -e 's/\.case(/\.or(/g' \
    -e 's/\.pushRefiners(/\.allOf(/g' \
    -e 's/\.pushFilters(/\.allOf(/g' \
    -e 's/\.pushCases(/\.anyOf(/g' \
    -e 's/\.setAscendingSort(/\.ascendingSort(/g' \
    -e 's/\.setDescendingSort(/\.descendingSort(/g' \
    {} \;
```

**Note:** Test your code after migration to ensure correct behavior.

---

## Manual Migration Table

### Pipe Operators (Outbound Transformations)

| v2.x Method | v3.0.0 Method | Description |
|-------------|---------------|-------------|
| `.stream(values)` | `.of(values)` | Emit array elements one by one |
| `.refine(condition)` | `.and(condition)` | Filter values (AND logic) |
| `.then<K>(fn)` | `.map<K>(fn)` | Transform value type |
| `.setOnce()` | `.once()` | Receive one value then unsubscribe |
| `.serialize()` | `.toJson()` | Convert to JSON string |
| `.deserialize<K>()` | `.fromJson<K>()` | Parse from JSON string |
| `.switch()` | `.choice()` | Begin OR-logic branching |
| `.case(condition)` | `.or(condition)` | Add OR condition |
| `.pushRefiners(arr)` | `.allOf(arr)` | Add multiple AND filters |
| `.pushCases(arr)` | `.anyOf(arr)` | Add multiple OR conditions |

### FilterCollection Operators (Inbound Filters)

| v2.x Method | v3.0.0 Method | Description |
|-------------|---------------|-------------|
| `.filter(condition)` | `.and(condition)` | Add inbound filter (AND logic) |
| `.pushFilters(arr)` | `.allOf(arr)` | Add multiple inbound filters |
| `.switch()` | `.choice()` | Begin OR-logic branching |
| `.case(condition)` | `.or(condition)` | Add OR condition |
| `.pushCases(arr)` | `.anyOf(arr)` | Add multiple OR conditions |

### OrderedObservable Operators

| v2.x Method | v3.0.0 Method | Description |
|-------------|---------------|-------------|
| `.setAscendingSort()` | `.ascendingSort()` | Sort subscribers ascending by order |
| `.setDescendingSort()` | `.descendingSort()` | Sort subscribers descending by order |

---

## Migration Examples

### Example 1: Basic Pipe Chain

**Before (v2.x):**
```typescript
observable$
    .pipe()
    .refine(x => x > 0)
    .then(x => x * 2)
    .setOnce()
    .subscribe(result => console.log(result));
```

**After (v3.0.0):**
```typescript
observable$
    .pipe()
    .and(x => x > 0)      // refine → and
    .map(x => x * 2)      // then → map
    .once()               // setOnce → once
    .subscribe(result => console.log(result));
```

---

### Example 2: Batch Emission

**Before (v2.x):**
```typescript
observable$.stream([1, 2, 3, 4, 5]);
```

**After (v3.0.0):**
```typescript
observable$.of([1, 2, 3, 4, 5]);  // stream → of
```

---

### Example 3: JSON Serialization

**Before (v2.x):**
```typescript
const jsonPipe = observable$
    .pipe()
    .serialize()
    .subscribe(jsonString => { /* ... */ });

const objPipe = jsonObservable$
    .pipe()
    .deserialize<MyType>()
    .subscribe(obj => { /* ... */ });
```

**After (v3.0.0):**
```typescript
const jsonPipe = observable$
    .pipe()
    .toJson()             // serialize → toJson
    .subscribe(jsonString => { /* ... */ });

const objPipe = jsonObservable$
    .pipe()
    .fromJson<MyType>()   // deserialize → fromJson
    .subscribe(obj => { /* ... */ });
```

---

### Example 4: OR Logic (Switch/Case)

**Before (v2.x):**
```typescript
observable$
    .pipe()
    .switch()
    .case(x => x === 'red')
    .case(x => x === 'blue')
    .subscribe(color => { /* ... */ });
```

**After (v3.0.0):**
```typescript
observable$
    .pipe()
    .choice()            // switch → choice
    .or(x => x === 'red')   // case → or
    .or(x => x === 'blue')
    .subscribe(color => { /* ... */ });
```

---

### Example 5: Batch Filters

**Before (v2.x):**
```typescript
const filters = [
    (x: Person) => x.age > 18,
    (x: Person) => x.name.length > 0,
    (x: Person) => x.email.includes('@')
];

observable$
    .pipe()
    .pushRefiners(filters)
    .subscribe(person => { /* ... */ });
```

**After (v3.0.0):**
```typescript
const filters = [
    (x: Person) => x.age > 18,
    (x: Person) => x.name.length > 0,
    (x: Person) => x.email.includes('@')
];

observable$
    .pipe()
    .allOf(filters)      // pushRefiners → allOf
    .subscribe(person => { /* ... */ });
```

---

### Example 6: Inbound Filters

**Before (v2.x):**
```typescript
men$.addFilter()
    .filter(person => person.age > 17)
    .filter(person => person.age < 60);
```

**After (v3.0.0):**
```typescript
men$.addFilter()
    .and(person => person.age > 17)    // filter → and
    .and(person => person.age < 60);
```

---

## New Features in v3.0.0

### 1. `in<K,V>()` Operator - Object Iteration

Iterate over object properties and emit `[key, value]` tuples:

```typescript
const stats = {
    users: 1500,
    sessions: 4200,
    errors: 12
};

observable$.in(stats);
// Emits: ['users', 1500], ['sessions', 4200], ['errors', 12]

// Usage with pipe:
observable$
    .pipe()
    .subscribe(([metric, count]) => {
        console.log(`${metric}: ${count}`);
    });

observable$.in(stats);
```

**Use cases:**
- Iterating over configuration objects
- Processing key-value data structures
- Converting objects to streams

---

### 2. `group()` Operator - Multi-Listener Optimization

Optimize performance when multiple listeners need the same pipe transformations:

```typescript
const group = observable$
    .pipe()
    .and(x => x > 0)
    .map(x => x * 2)
    .group();  // Type finalizer - prevents further chaining

// All listeners share single pipe execution
group.add(listener1);
group.add(listener2);
group.add(listener3);

// Performance: 1x pipe execution instead of 3x
```

**Key benefits:**
- **Performance:** Single pipe execution for all listeners (up to 54,000x faster in benchmarks)
- **Type safety:** TypeScript prevents adding operators after `.group()`
- **Convenience:** Fluent API for adding multiple listeners

**Use cases:**
- Multiple UI components listening to same data stream
- Event broadcasting to multiple handlers
- Optimizing high-frequency emissions with many subscribers

---

## Breaking Changes

### API Changes

1. **All 14 operator names changed** - See migration table above
2. **Semantic consistency:** `and()` for AND logic, `or()` for OR logic, `allOf()`/`anyOf()` for batch operations
3. **RxJS alignment:** `map()`, `of()` match RxJS naming for easier migration

### Type Signatures

**No changes** - All type signatures remain the same. Only method names changed.

### Bundle Size

**Increased:** 6.4 kB → 7.2 kB (+12.5%)
- **Reason:** New operators (`in()`, `group()`) add functionality
- **Trade-off:** Still **12.2x smaller** than RxJS (88 kB)

### Performance

**Improved or maintained:**
- Emit performance: +7% faster than v2.x
- Multiple subscribers (10): +10% faster than v2.x
- Still **2-7x faster** than RxJS across all operations

---

## Compatibility

### Requirements

- **Node.js:** 16.x or higher (unchanged from v2.x)
- **TypeScript:** 4.4+ (required for `Object.hasOwn` support)
- **ES Target:** ES2022 or higher (updated from ES2020)

### Supported Environments

- ✅ Node.js 16+
- ✅ Modern browsers (Chrome 94+, Firefox 92+, Safari 15.4+)
- ✅ TypeScript 4.4+
- ⚠️ Legacy browsers: May need polyfill for `Object.hasOwn`

---

## Common Migration Issues

### Issue 1: TypeScript Compilation Errors

**Symptom:**
```
error TS2339: Property 'refine' does not exist on type 'ISetup<T>'
```

**Solution:**
Update method name: `.refine()` → `.and()`

---

### Issue 2: Runtime Errors After Migration

**Symptom:**
```
TypeError: observable$.stream is not a function
```

**Solution:**
Ensure all method names are updated. Run automated migration script again.

---

### Issue 3: Test Failures

**Symptom:**
Tests fail after migration with method not found errors.

**Solution:**
Update test files as well:
```bash
find test -name "*.test.ts" -exec sed -i -e 's/\.refine(/\.and(/g' {} \;
```

---

## Rollback Plan

If you need to rollback to v2.x:

1. **Revert package version:**
   ```bash
   npm install evg_observable@2.x
   ```

2. **Revert code changes:**
   ```bash
   git revert <migration-commit-hash>
   ```

3. **Or use reverse migration script:**
   ```bash
   find src -name "*.ts" -exec sed -i \
       -e 's/\.of(/\.stream(/g' \
       -e 's/\.and(/\.refine(/g' \
       -e 's/\.map(/\.then(/g' \
       -e 's/\.once(/\.setOnce(/g' \
       {} \;
   ```

---

## Need Help?

- **Documentation:** [README.md](./README.md)
- **Issues:** https://github.com/your-repo/issues
- **Examples:** See `test/*.test.ts` for v3.0.0 usage patterns

---

## Changelog Summary

See [CHANGELOG.md](./CHANGELOG.md) for detailed changes.

**Major Changes:**
- 14 operators renamed for consistency and RxJS alignment
- New `in<K,V>()` operator for object iteration
- New `group()` operator for multi-listener optimization
- Performance improvements (+7% emit, +10% multi-subscriber)
- Bundle size increased to 7.2 kB (+12.5%) for new features

**No Breaking Changes:**
- All type signatures preserved
- No behavioral changes to existing operators
- Full backward compatibility in logic (only names changed)
