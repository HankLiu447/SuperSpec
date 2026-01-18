# [Feature] Implementation Plan

> **For Claude:** REQUIRED SKILL: Use superspec:execute to implement this plan.

**Goal:** [One sentence describing what this builds]

**Architecture:** [2-3 sentences about approach]

**Tech Stack:** [Key technologies/libraries]

**Related Documents:**
- Design: `superspec/changes/[id]/design.md`
- Specs: `superspec/changes/[id]/specs/[capability]/spec.md`

---

## Task 1: [Component/Feature Name]

**Spec Reference:** `### Requirement: [Name]`

**Files:**
- Create: `exact/path/to/new-file.ts`
- Modify: `exact/path/to/existing.ts:123-145`
- Test: `tests/exact/path/to/test.ts`

### Step 1.1: Write failing test (RED)

**Scenario:** `#### Scenario: [Name]`

```typescript
// WHEN [condition from Scenario]
// THEN [result from Scenario]
test('[Scenario Name]', async () => {
  // WHEN
  const result = await action(input);

  // THEN
  expect(result).toEqual(expected);
});
```

**Run:** `npm test -- --grep "[Scenario Name]"`
**Expected:** FAIL - "[function] is not defined"

### Step 1.2: Implement minimal code (GREEN)

```typescript
export async function action(input: Input): Promise<Output> {
  // Minimal implementation to pass test
  return expected;
}
```

**Run:** `npm test -- --grep "[Scenario Name]"`
**Expected:** PASS

### Step 1.3: Refactor (if needed)

[Clean up code while keeping tests green]

### Step 1.4: Commit

```bash
git add tests/path/test.ts src/path/file.ts
git commit -m "feat([capability]): implement [scenario]

Refs: superspec/changes/[id]/specs/[capability]/spec.md
Requirement: [Name]
Scenario: [Name]"
```

---

## Task 2: [Next Component]

**Spec Reference:** `### Requirement: [Name]`

[Repeat structure...]
