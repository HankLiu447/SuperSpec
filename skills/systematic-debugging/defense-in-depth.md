# Defense in Depth Debugging

**Load this reference when:** Debugging complex issues that span multiple components or layers.

## Overview

Layer multiple defensive checks throughout the system to catch issues at multiple points.

**Core principle:** Each layer validates its inputs and outputs independently. Failure at any layer provides diagnostic information.

## The Pattern

```
┌─────────────────────────────────────────────────────────────────┐
│                    Defense in Depth                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Layer 1: Input Validation                                       │
│   └─→ Validate data at entry point                               │
│                                                                   │
│   Layer 2: Component Boundaries                                   │
│   └─→ Validate at each component interface                       │
│                                                                   │
│   Layer 3: State Transitions                                      │
│   └─→ Validate state changes are valid                           │
│                                                                   │
│   Layer 4: Output Validation                                      │
│   └─→ Validate results before returning                          │
│                                                                   │
│   Layer 5: Integration Points                                     │
│   └─→ Validate at external system boundaries                     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Layer 1: Input Validation

Validate all inputs at entry points:

```typescript
function processOrder(order: unknown): Result {
  // Validate input structure
  if (!isValidOrder(order)) {
    throw new ValidationError('Invalid order structure', { received: order });
  }

  // Validate business rules
  if (order.items.length === 0) {
    throw new ValidationError('Order must have at least one item');
  }

  // Now safe to process
  return doProcess(order);
}
```

**Key checks:**
- Type validation (is it the right shape?)
- Required fields (are all necessary fields present?)
- Business rules (does it make sense?)

## Layer 2: Component Boundaries

Validate at each component interface:

```typescript
class OrderService {
  constructor(private inventory: InventoryService) {
    // Validate dependency
    if (!inventory) {
      throw new Error('OrderService requires InventoryService');
    }
  }

  async placeOrder(order: Order): Promise<OrderResult> {
    // Validate input to this component
    this.validateOrder(order);

    // Call dependency
    const availability = await this.inventory.checkAvailability(order.items);

    // Validate output from dependency
    this.validateAvailability(availability);

    return this.process(order, availability);
  }
}
```

**Key checks:**
- Dependencies are valid
- Inputs meet component's requirements
- Outputs from dependencies are valid

## Layer 3: State Transitions

Validate state changes are valid:

```typescript
class OrderStateMachine {
  private validTransitions: Map<State, State[]> = new Map([
    ['pending', ['confirmed', 'cancelled']],
    ['confirmed', ['processing', 'cancelled']],
    ['processing', ['shipped', 'failed']],
    ['shipped', ['delivered', 'returned']],
  ]);

  transition(from: State, to: State): void {
    const allowed = this.validTransitions.get(from) || [];

    if (!allowed.includes(to)) {
      throw new StateError(
        `Invalid transition: ${from} -> ${to}`,
        { allowed, attempted: to }
      );
    }

    this.state = to;
  }
}
```

**Key checks:**
- Transition is valid from current state
- All preconditions met
- State remains consistent

## Layer 4: Output Validation

Validate results before returning:

```typescript
function calculateTotal(items: Item[]): Money {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  // Validate output
  if (total < 0) {
    throw new CalculationError('Total cannot be negative', { items, total });
  }

  if (!Number.isFinite(total)) {
    throw new CalculationError('Total is not a valid number', { items, total });
  }

  return { amount: total, currency: 'USD' };
}
```

**Key checks:**
- Result is valid type
- Result meets business constraints
- No unexpected values (NaN, Infinity, null)

## Layer 5: Integration Points

Validate at external system boundaries:

```typescript
async function fetchFromExternalAPI(id: string): Promise<ExternalData> {
  // Log outgoing request
  console.log('Requesting:', { id, timestamp: Date.now() });

  const response = await fetch(`/api/external/${id}`);

  // Validate response status
  if (!response.ok) {
    throw new ExternalError(`API returned ${response.status}`, {
      id,
      status: response.status,
      body: await response.text()
    });
  }

  const data = await response.json();

  // Log and validate response
  console.log('Received:', { id, data, timestamp: Date.now() });

  if (!isValidExternalData(data)) {
    throw new ExternalError('Invalid response structure', { id, data });
  }

  return data;
}
```

**Key checks:**
- Request is well-formed
- Response status is expected
- Response structure is valid
- Timing/performance is acceptable

## Diagnostic Information

Each validation should provide diagnostic information:

```typescript
class ValidationError extends Error {
  constructor(
    message: string,
    public readonly context: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Usage
throw new ValidationError('Invalid order total', {
  expected: 'positive number',
  received: total,
  items: items,
  calculation: 'sum of item prices'
});
```

**Include:**
- What was expected
- What was received
- Context for debugging
- How to reproduce

## Debugging with Defense in Depth

When an issue occurs:

1. **Check which layer failed** - Error message tells you which validation caught it
2. **Examine the context** - Diagnostic info shows what went wrong
3. **Trace upstream** - If Layer 3 failed, check Layers 1-2 for the source
4. **Add more checks** - If issue slipped through, add validation at appropriate layer

```
Issue: Order total is negative

Layer 4 caught it: "Total cannot be negative"
Context: { items: [...], total: -50 }

Trace upstream:
- Layer 3: State was valid
- Layer 2: Items came from inventory correctly
- Layer 1: Input validation missed negative prices

Fix: Add price validation at Layer 1
```

## Quick Reference

| Layer | What to Validate | When |
|-------|-----------------|------|
| **1. Input** | Structure, types, business rules | At entry points |
| **2. Component** | Dependencies, inputs, outputs | At interfaces |
| **3. State** | Transitions, preconditions | On state changes |
| **4. Output** | Result validity, constraints | Before returning |
| **5. Integration** | Request/response, structure | At external boundaries |

## The Bottom Line

**Every layer validates independently.**

When something fails:
- You know exactly which layer caught it
- You have diagnostic information
- You can trace the issue upstream

Defense in depth makes debugging systematic, not guesswork.
