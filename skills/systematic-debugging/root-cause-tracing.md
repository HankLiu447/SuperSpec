# Root Cause Tracing

**Load this reference when:** You need to find the actual source of a bug, not just where it manifests.

## Overview

Trace backwards from symptom to source. The fix belongs at the source, not at the symptom.

**Core principle:** Keep asking "why" until you find where the bad value originated.

## The Tracing Process

```
Symptom
    ↓ "Why is this value wrong?"
Immediate Cause
    ↓ "Why did that happen?"
Intermediate Cause
    ↓ "Why did that happen?"
Root Cause ← FIX HERE
```

## Example Trace

**Symptom:** Test fails with "expected 3, got 0"

```
Level 0 (Symptom):
  result.count is 0, expected 3

Level 1: Why is result.count 0?
  result = await processor.getResults()
  → processor.getResults() returns { count: 0 }

Level 2: Why does getResults() return 0?
  return { count: this.items.length }
  → this.items is empty array

Level 3: Why is this.items empty?
  items are added in processItem()
  → processItem() was never called

Level 4: Why wasn't processItem() called?
  processItem() is called from onData event
  → onData event was never emitted

Level 5 (Root Cause): Why wasn't onData emitted?
  emitter.emit('data', item) uses wrong event name
  → Should be emitter.emit('onData', item)

FIX: Change 'data' to 'onData' at source
```

## Tracing Techniques

### 1. Log Tracing

Add logs at each level to see the data flow:

```typescript
function processItem(item: Item): void {
  console.log('[processItem] called with:', item);

  const transformed = transform(item);
  console.log('[processItem] transformed:', transformed);

  this.items.push(transformed);
  console.log('[processItem] items now:', this.items.length);
}
```

### 2. Debugger Breakpoints

Set breakpoints and step through:

```typescript
function processItem(item: Item): void {
  debugger; // Breakpoint here
  const transformed = transform(item);
  this.items.push(transformed);
}
```

### 3. Stack Trace Analysis

Read stack traces completely:

```
Error: Expected 3 items
    at expect (test.ts:45)
    at runTest (test.ts:30)
    at Processor.getResults (processor.ts:89)
    at Processor.processAll (processor.ts:56)  ← Start here
    at EventEmitter.emit (events.ts:123)
    at DataSource.onData (source.ts:78)       ← Trace to here
```

### 4. Git Bisect

Find which commit introduced the bug:

```bash
git bisect start
git bisect bad HEAD
git bisect good v1.0.0
# Git will binary search for the bad commit
# Run tests at each step
git bisect run npm test
```

### 5. Value Origin Tracking

Track where a value came from:

```typescript
interface TrackedValue<T> {
  value: T;
  origin: string;
  timestamp: number;
}

function track<T>(value: T, origin: string): TrackedValue<T> {
  return { value, origin, timestamp: Date.now() };
}

// Usage
const count = track(items.length, 'processAll:line45');
// Later, when debugging:
console.log('count originated from:', count.origin);
```

## Common Root Cause Categories

### 1. Wrong Event/Callback Name

```typescript
// Symptom: callback never called
emitter.on('onData', callback);  // Listening for 'onData'
emitter.emit('data', value);     // Emitting 'data'
// Root cause: event name mismatch
```

### 2. Incorrect Initialization Order

```typescript
// Symptom: undefined error
class Service {
  config: Config;

  constructor() {
    this.doSetup();        // Uses this.config
    this.config = load();  // But config not set yet
  }
}
// Root cause: initialization order
```

### 3. Async Timing

```typescript
// Symptom: stale data
async function process() {
  const data = await fetch();
  processSync(data);        // Starts processing
  return getResults();      // Returns before processing completes
}
// Root cause: not awaiting async completion
```

### 4. Reference vs Copy

```typescript
// Symptom: unexpected mutation
const original = { count: 0 };
const copy = original;       // Same reference!
copy.count = 5;
console.log(original.count); // 5, not 0
// Root cause: shallow copy instead of deep copy
```

### 5. Scope/Closure Issues

```typescript
// Symptom: all callbacks have same value
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Prints: 3, 3, 3 (not 0, 1, 2)
// Root cause: var instead of let, closure captures reference
```

## The Five Whys

Keep asking "why" until you reach the root:

```
1. Why did the test fail?
   → result.count was 0 instead of 3

2. Why was count 0?
   → items array was empty

3. Why was items array empty?
   → processItem() was never called

4. Why wasn't processItem() called?
   → onData event was never received

5. Why wasn't onData event received?
   → Event name mismatch: 'data' vs 'onData'

ROOT CAUSE: Event name mismatch
FIX: Correct the event name
```

## Where to Fix

**Fix at the source, not the symptom:**

```typescript
// ❌ BAD: Fix at symptom
function getResults() {
  return {
    count: Math.max(this.items.length, 0)  // Masks the real issue
  };
}

// ✅ GOOD: Fix at source
emitter.emit('onData', item);  // Correct event name
```

## Verification

After fixing, verify the trace:

1. **Run the test** - Does it pass?
2. **Trace forward** - Does data flow correctly now?
3. **Check related code** - Same bug pattern elsewhere?
4. **Add regression test** - Prevent recurrence

## Quick Reference

| Technique | When to Use |
|-----------|-------------|
| Log tracing | Quick exploration, see data flow |
| Debugger | Step-by-step examination |
| Stack trace | Find call chain |
| Git bisect | Find introducing commit |
| Value tracking | Track data origin |
| Five Whys | Structure the investigation |

## The Bottom Line

**The symptom tells you there's a problem. The root cause tells you where to fix it.**

Keep tracing upstream until you find where the bad value originated. That's where the fix belongs.
