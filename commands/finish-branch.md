---
name: finish-branch
description: Complete development branch with structured options (merge, PR, keep, discard)
---

# /superspec:finish-branch

Use the `finish-branch` skill to complete the development branch.

## Prerequisites

- All tests pass
- `superspec verify [id]` passes
- Final code review approved

## Instructions

1. Read the `skills/finish-branch/SKILL.md` skill file
2. Verify tests pass
3. Determine base branch (main/master)
4. Present four options:
   1. Merge back to base-branch locally
   2. Push and create a Pull Request
   3. Keep the branch as-is
   4. Discard this work
5. Execute chosen option
6. Cleanup worktree if applicable

## Options Summary

| Option | Merge | Push | Keep Worktree | Cleanup Branch |
|--------|-------|------|---------------|----------------|
| 1. Merge locally | ✓ | - | - | ✓ |
| 2. Create PR | - | ✓ | - | Keep for PR |
| 3. Keep as-is | - | - | ✓ | - |
| 4. Discard | - | - | - | ✓ (force) |

## Next Step

After finishing branch:
- Option 1 or 2: `/superspec:archive`
- Option 3: Run `/superspec:finish-branch` again when ready
- Option 4: Consider deleting `superspec/changes/[id]/`
