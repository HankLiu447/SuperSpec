---
name: archive
description: Archive completed change by applying delta specs and moving to archive
---

# /superspec:archive

Use the `archive` skill to complete the change lifecycle.

## Prerequisites

- Verification passed: `superspec verify [id]` ✅
- All tests pass
- Code review approved
- Branch ready (merged or PR created)

## Instructions

1. Read the `skills/archive/SKILL.md` skill file
2. Verify ready state
3. Apply deltas to main specs:
   - ADDED → append to spec
   - MODIFIED → replace in spec
   - REMOVED → delete from spec
   - RENAMED → rename in spec
4. Move change to archive directory
5. Validate final state

## Delta Application Order

1. Process RENAMED first (avoid conflicts)
2. Process REMOVED second
3. Process MODIFIED third
4. Process ADDED last

## CLI Command

```bash
superspec archive [change-id]
superspec archive [change-id] --yes        # Non-interactive
superspec archive [change-id] --skip-specs # Tooling-only changes
```

## Archive Structure

```
superspec/changes/archive/YYYY-MM-DD-[id]/
├── proposal.md
├── design.md
├── specs/
├── plan.md
└── tasks.md
```

## Post-Archive

- Main specs updated with delta changes
- Complete history preserved in archive
- Run `superspec validate --strict` to confirm
