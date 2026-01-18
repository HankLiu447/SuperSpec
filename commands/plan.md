---
name: plan
description: Create a TDD implementation plan from validated specs
---

# /superspec:plan

Use the `plan-writing` skill to create a TDD implementation plan.

## Prerequisites

- Proposal approved: `superspec/changes/[id]/proposal.md`
- Design documented: `superspec/changes/[id]/design.md` (required)
- Specs validated: `superspec validate [id] --strict` passes

## Instructions

1. Read the `skills/plan-writing/SKILL.md` skill file
2. Read all specs in `superspec/changes/[id]/specs/`
3. Create TDD plan following Scenario-to-Test mapping
4. Output `plan.md` and `tasks.md`

## Optional: Git Worktree Setup

If isolation is needed, use the `git-worktree` skill to create an isolated workspace:
```
.worktrees/[change-id]/
```

## Output

Creates in `superspec/changes/[change-id]/`:
- `plan.md` - TDD implementation plan
- `tasks.md` - Task checklist

## Next Step

After plan is ready: `/superspec:execute`
