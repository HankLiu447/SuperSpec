---
name: execute
description: Execute the implementation plan using subagent-driven development with TDD
---

# /superspec:execute

Use the `subagent-development` skill to execute the plan.

## Prerequisites

- Plan exists: `superspec/changes/[id]/plan.md`
- Tasks exist: `superspec/changes/[id]/tasks.md`
- Specs validated: `superspec validate [id] --strict` passes

## Instructions

1. Read the `skills/subagent-development/SKILL.md` skill file
2. For each task in `tasks.md`:
   - Dispatch Implementer (follows TDD)
   - Dispatch Spec Reviewer (checks compliance)
   - Dispatch Quality Reviewer (checks code quality)
   - Mark task complete when both reviews pass
3. After all tasks: Dispatch Final Reviewer

## Key Skills Used

- `tdd` - RED → GREEN → REFACTOR cycle
- `code-review` - Two-stage review process
- `systematic-debugging` - When issues arise

## Two-Stage Review

1. **Spec Compliance Review**
   - Every Requirement implemented?
   - Every Scenario has test?
   - No missing/extra features?

2. **Code Quality Review**
   - Error handling
   - Type safety
   - SOLID principles
   - Test quality

## Next Step

After all tasks complete: `/superspec:verify`
