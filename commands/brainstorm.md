---
name: brainstorm
description: Start a structured brainstorming session for a new change using four phases (EXPLORE → PROPOSE → DESIGN → SPEC)
---

# /superspec:brainstorm

Use the `brainstorm` skill to guide a structured design process.

## Instructions

1. Read the `skills/brainstorm/SKILL.md` skill file
2. Follow the four-phase process:
   - **EXPLORE**: Gather context, clarify requirements
   - **PROPOSE**: Define Why + What → output `proposal.md`
   - **DESIGN**: Technical approach → output `design.md` (required)
   - **SPEC**: Requirements + Scenarios → output `specs/*.md`
3. Validate specs when complete: `superspec validate [id] --strict`

## Output

Creates in `superspec/changes/[change-id]/`:
- `proposal.md` - Why and What
- `design.md` - How (required)
- `specs/[capability]/spec.md` - Detailed specifications

## Next Step

After brainstorm completes: `/superspec:plan`
