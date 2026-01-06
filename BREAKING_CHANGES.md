# Breaking Changes - Performance Optimizations Branch

## Version 2.15.0 (feature/performance-optimizations)

### Internal Field Renaming

**Affected field:** `value` renamed to `_value`

The internal field storing the current observable value has been renamed from `value` to `_value` to follow TypeScript conventions for protected/private members.

**Before:**
```typescript
export class Observable<T> {
    constructor(private value: T) {}
}
```

**After:**
```typescript
export class Observable<T> {
    protected _value: T;
    constructor(value: T) {
        this._value = value;
    }
}
```

**Migration:**
- If you were extending `Observable` and accessing `this.value`, change to `this._value`
- Use the public `getValue()` method for reading the current value (recommended)

### Visibility Changes

The following fields changed from `private` to `protected` to enable better inheritance:

| Field | Before | After |
|-------|--------|-------|
| `enabled` | private | protected |
| `filters` | private | protected |
| `_value` (formerly `value`) | private | protected |

**Impact:** This is not a breaking change for most users, but allows subclasses to access these fields.

### Recommended Migration Path

Instead of accessing internal fields directly, use the public API:

```typescript
// Instead of:
// @ts-ignore
const val = observable._value;

// Use:
const val = observable.getValue();

// Instead of:
// @ts-ignore
const count = observable.subs.length;

// Use:
const count = observable.size();
```

### New Behavior

1. **`destroy()` now uses `Promise.resolve()`** instead of `setInterval()` for async cleanup when called during emission
2. **`unsubscribeAll()` is now safe to call during `next()`** - uses deferred cleanup mechanism
3. **Early exit optimization** - `next()` returns immediately if there are no subscribers

These behavioral changes improve performance and memory management but should not require code changes.
