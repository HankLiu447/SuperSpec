---
name: execute
description: Execute the implementation plan using subagent-driven development with TDD
---

# /superspec:execute

Use the `subagent-development` skill to execute the plan with Phase Protocol.

## Prerequisites

- Plan exists: `superspec/changes/[id]/plan.md`
- Tasks exist: `superspec/changes/[id]/tasks.md`
- Specs validated: `superspec validate [id] --strict` passes

## Instructions

### 1. Read Required Skills

```
FIRST: Read skills/phase-protocol/SKILL.md
THEN:  Read skills/subagent-development/SKILL.md
```

### 2. Follow Phase Entry Protocol (CRITICAL!)

**Before starting any phase, execute Entry Protocol:**

1. Read `phase-protocol` skill (refresh context)
2. Read `tasks.md` (get task list)
3. **CREATE TODO IMMEDIATELY** ← Before reading other docs!
4. Gate: Verify TODO completeness
5. Read plan.md, design.md, specs/*.md
6. Gate: Output key understanding
7. Begin implementation

### 3. For Each Task in Current Phase

- Dispatch Implementer (follows TDD)
- Dispatch Spec Reviewer (checks compliance)
- Dispatch Quality Reviewer (checks code quality)
- Mark task complete when both reviews pass

### 4. Follow Phase Exit Protocol

**After completing all tasks in a phase:**

1. Update tasks.md
2. Git commit
3. **Re-read `phase-protocol` skill** ← Prevents context drift!
4. Create next phase TODO → Loop back to Entry Protocol

### 5. After All Phases Complete

Dispatch Final Reviewer

## Key Skills Used

- `phase-protocol` - Prevents context drift during long sessions
- `subagent-development` - Main execution skill
- `tdd` - RED → GREEN → REFACTOR cycle
- `code-review` - Two-stage review process
- `systematic-debugging` - When issues arise

## Why Phase Protocol Matters

```
Problem:  Long sessions cause AI to forget tasks (context drift)
Solution:
  - Create TODO early (survives compression)
  - Force re-read skill at phase boundaries
  - Gate verification ensures nothing skipped
```

## Next Step

After all tasks complete: `/superspec:verify`
