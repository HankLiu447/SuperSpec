---
name: verify
description: Verify that implementation matches specifications before archiving
---

# /superspec:verify

Use the `verify` skill to check implementation against specs.

## Prerequisites

- All tasks in plan complete
- All tests pass
- Final code review approved

## Instructions

1. Read the `skills/verify/SKILL.md` skill file
2. Load all specs from `superspec/changes/[id]/specs/`
3. Extract Requirements and Scenarios
4. Match each Scenario to a test
5. Check for extra code/tests not in specs
6. Generate verification report

## Verification Checklist

- [ ] Every Requirement has implementation
- [ ] Every Scenario has corresponding test
- [ ] Tests cover WHEN conditions
- [ ] Tests verify THEN results
- [ ] No features outside of Specs

## CLI Command

```bash
superspec verify [change-id]
superspec verify [change-id] --strict  # Fail on extras
superspec verify [change-id] --verbose # Show matching details
```

## Output

Verification report showing:
- Requirements coverage: X/X
- Scenarios coverage: Y/Y
- Issues found (if any)
- Verdict: READY TO ARCHIVE / NEEDS WORK

## Next Step

After verification passes: `/superspec:archive`
