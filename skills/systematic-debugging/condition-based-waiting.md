# Condition-Based Waiting

**Load this reference when:** Tests have race conditions, flaky failures, or use arbitrary timeouts/delays.

## Overview

Replace arbitrary `setTimeout`/`sleep` with condition-based waiting that polls until a condition is true.

**Core principle:** Wait for the condition you actually need, not an arbitrary time that "should be enough."

## The Problem with Timeouts

```typescript
// ❌ BAD: Arbitrary timeout
await new Promise(r => setTimeout(r, 1000));
expect(result).toBe(expected);

// Problems:
// - Flaky: 1000ms might not be enough
// - Slow: Wastes time when faster
// - Unclear: What are we waiting for?
```

## The Solution: Condition-Based Waiting

```typescript
// ✅ GOOD: Wait for actual condition
await waitFor(() => result === expected);
expect(result).toBe(expected);

// Benefits:
// - Reliable: Waits until actually ready
// - Fast: Returns as soon as condition met
// - Clear: Documents what we're waiting for
```

## Implementation

### Basic waitFor

```typescript
async function waitFor(
  condition: () => boolean | Promise<boolean>,
  options: {
    timeout?: number;
    interval?: number;
    message?: string;
  } = {}
): Promise<void> {
  const { timeout = 5000, interval = 50, message = 'Condition not met' } = options;
  const start = Date.now();

  while (Date.now() - start < timeout) {
    if (await condition()) {
      return;
    }
    await new Promise(r => setTimeout(r, interval));
  }

  throw new Error(`Timeout: ${message} (waited ${timeout}ms)`);
}
```

### Usage Examples

**Waiting for value:**
```typescript
let value: string | undefined;
someAsyncOperation().then(v => { value = v; });

await waitFor(() => value !== undefined, {
  message: 'Expected value to be set'
});

expect(value).toBe('expected');
```

**Waiting for array length:**
```typescript
const items: string[] = [];
startProducing(items);

await waitFor(() => items.length >= 3, {
  message: 'Expected at least 3 items'
});

expect(items.length).toBeGreaterThanOrEqual(3);
```

**Waiting for state change:**
```typescript
const state = { status: 'pending' };
startProcess(state);

await waitFor(() => state.status === 'complete', {
  message: 'Expected status to be complete'
});

expect(state.status).toBe('complete');
```

## Common Patterns

### Wait for Event

```typescript
async function waitForEvent<T>(
  emitter: EventEmitter,
  eventName: string,
  timeout = 5000
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout waiting for event: ${eventName}`));
    }, timeout);

    emitter.once(eventName, (data: T) => {
      clearTimeout(timer);
      resolve(data);
    });
  });
}

// Usage
const result = await waitForEvent(process, 'complete');
```

### Wait for Callback Count

```typescript
function createCallbackTracker() {
  let count = 0;
  return {
    callback: () => { count++; },
    waitForCalls: (n: number, timeout = 5000) =>
      waitFor(() => count >= n, {
        timeout,
        message: `Expected ${n} calls, got ${count}`
      }),
    getCount: () => count
  };
}

// Usage
const tracker = createCallbackTracker();
registerCallback(tracker.callback);
await tracker.waitForCalls(3);
```

### Wait for DOM Element

```typescript
async function waitForElement(
  selector: string,
  timeout = 5000
): Promise<Element> {
  let element: Element | null = null;

  await waitFor(() => {
    element = document.querySelector(selector);
    return element !== null;
  }, {
    timeout,
    message: `Element not found: ${selector}`
  });

  return element!;
}
```

## When to Use What

| Situation | Use |
|-----------|-----|
| Waiting for async value | `waitFor(() => value !== undefined)` |
| Waiting for state change | `waitFor(() => state === expected)` |
| Waiting for event | `waitForEvent(emitter, 'eventName')` |
| Waiting for callback | `callbackTracker.waitForCalls(n)` |
| DOM updates | `waitForElement(selector)` |
| Animation complete | `waitFor(() => !isAnimating)` |

## Anti-Patterns

### Fixed Delays

```typescript
// ❌ BAD
await sleep(1000);
expect(value).toBe(expected);

// ✅ GOOD
await waitFor(() => value === expected);
```

### Timeout Instead of Condition

```typescript
// ❌ BAD: Guessing how long
const timeout = 2000; // "should be enough"
await Promise.race([
  operation(),
  sleep(timeout).then(() => { throw new Error('timeout'); })
]);

// ✅ GOOD: Wait for actual completion
await waitFor(() => operationComplete);
```

### Nested Timeouts

```typescript
// ❌ BAD: Multiple arbitrary waits
await sleep(100);
await step1();
await sleep(200);
await step2();
await sleep(300);

// ✅ GOOD: Wait for each step's condition
await waitFor(() => step1Ready);
await step1();
await waitFor(() => step2Ready);
await step2();
```

## Integration with Testing Frameworks

### Vitest/Jest

```typescript
import { waitFor } from '@testing-library/dom'; // or custom implementation

test('async operation completes', async () => {
  const result = startOperation();

  await waitFor(() => {
    expect(result.status).toBe('complete');
  });
});
```

### Custom Matchers

```typescript
expect.extend({
  async toEventuallyBe(received: () => any, expected: any, timeout = 5000) {
    try {
      await waitFor(() => received() === expected, { timeout });
      return { pass: true, message: () => '' };
    } catch {
      return {
        pass: false,
        message: () => `Expected ${received()} to eventually be ${expected}`
      };
    }
  }
});

// Usage
await expect(() => value).toEventuallyBe('expected');
```

## Debugging Tips

**When condition never becomes true:**
1. Add logging inside condition function
2. Check if condition is being evaluated
3. Verify the value being checked is actually changing
4. Increase timeout temporarily to see if it's just slow

```typescript
await waitFor(() => {
  console.log('Checking condition, value is:', value);
  return value === expected;
}, { timeout: 30000 }); // Temporarily long for debugging
```

## The Bottom Line

**Never use arbitrary timeouts in tests.**

Wait for the condition you actually need. Your tests will be:
- More reliable (no flaky failures)
- Faster (no unnecessary waiting)
- Clearer (documents what you're waiting for)
