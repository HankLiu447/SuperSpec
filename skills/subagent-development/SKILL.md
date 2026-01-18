---
name: superspec:execute
description: |
  Use when executing implementation plans in current session.
  Dispatches fresh subagent per task with two-stage review.
  Spec Reviewer validates against Specs, Quality Reviewer checks code quality.
---

# Subagent-Driven Development

## ⚠️ CRITICAL: Document Updates (Read This First!)

**You MUST maintain TWO separate progress records:**

| Tool | Purpose | When |
|------|---------|------|
| `TodoWrite` | Your internal tracking (ephemeral, lost after session) | At start of execution |
| `tasks.md` file | Persistent user-visible progress (survives sessions) | After EACH task completion |

**TodoWrite is NOT a substitute for updating tasks.md!**

After EVERY task completion, you MUST:
1. ✅ Mark task `[x]` in `superspec/changes/[id]/tasks.md`
2. ✅ Update Status counts at top of `tasks.md`
3. ✅ Update Completion Tracking table at bottom of `tasks.md`

**Self-check:** If you only used TodoWrite without editing tasks.md, you did NOT update progress correctly!

---

## Overview

Execute plan by dispatching fresh subagent per task, with two-stage review:
1. **Spec Compliance Review** - Does implementation match Specs?
2. **Code Quality Review** - Is the code well-written?

**Core principle:** Fresh subagent per task + two-stage review = high quality, fast iteration

**Announce at start:** "I'm using subagent-driven development to execute the plan."

## When to Use

```
Have implementation plan?
    ↓ yes
Tasks mostly independent?
    ↓ yes
Stay in this session?
    ↓ yes
→ Use subagent-development
```

## Prerequisites

- Proposal exists: `superspec/changes/[id]/proposal.md`
- Design exists: `superspec/changes/[id]/design.md` - **Required**
- Specs exist: `superspec/changes/[id]/specs/**/*.md`
- Plan exists: `superspec/changes/[id]/plan.md`
- Tasks exist: `superspec/changes/[id]/tasks.md`
- Specs validated: `superspec validate [id] --strict` passes

## The Process

```
┌────────────────────────────────────────────────────────────────────┐
│                    Per Task Loop                                    │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │ 1. Dispatch Implementer Subagent                            │  │
│   │    - Provide: Full task text + context + Spec reference     │  │
│   │    - Follows TDD: RED → GREEN → REFACTOR                    │  │
│   │    - Self-reviews before handoff                            │  │
│   └──────────────────────────┬──────────────────────────────────┘  │
│                              │                                      │
│                              ▼                                      │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │ 2. Dispatch Spec Reviewer Subagent                          │  │
│   │    - Reads: superspec/changes/[id]/specs/[cap]/spec.md      │  │
│   │    - Reads: Actual implementation code                       │  │
│   │    - Checks:                                                 │  │
│   │      ✓ Every Requirement has implementation                 │  │
│   │      ✓ Every Scenario has test                              │  │
│   │      ✓ No missing features                                   │  │
│   │      ✓ No extra features (not in Spec)                      │  │
│   └──────────────────────────┬──────────────────────────────────┘  │
│                              │                                      │
│                    [Spec Compliant?]                                │
│                    /              \                                 │
│                  No               Yes                               │
│                  │                  │                               │
│                  ▼                  ▼                               │
│   ┌──────────────────────┐   ┌─────────────────────────────────┐  │
│   │ Implementer fixes    │   │ 3. Dispatch Quality Reviewer    │  │
│   │ spec gaps            │   │    - Checks: Error handling,    │  │
│   └──────────┬───────────┘   │      type safety, SOLID, tests  │  │
│              │               │    - Classifies: Critical /      │  │
│              └─→ Re-review   │      Important / Suggestion      │  │
│                              └──────────────┬──────────────────┘  │
│                                             │                      │
│                                   [Quality Approved?]              │
│                                   /              \                 │
│                                 No               Yes               │
│                                 │                  │               │
│                                 ▼                  ▼               │
│                  ┌──────────────────────┐   ┌──────────────────┐  │
│                  │ Implementer fixes    │   │ Mark complete +  │  │
│                  │ quality issues       │   │ UPDATE DOCS!     │  │
│                  └──────────┬───────────┘   └────────┬─────────┘  │
│                             │                        │             │
│                             └─→ Re-review            ▼             │
│                                              Update tasks.md       │
│                                              Update plan.md        │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘

[All tasks complete]
        ↓
┌────────────────────────────────────────────────────────────────────┐
│ Dispatch Final Code Reviewer                                        │
│ - Reviews entire implementation                                     │
│ - Checks cross-task consistency                                     │
│ - Validates all Specs fully implemented                            │
└────────────────────────────────────────────────────────────────────┘
        ↓
Use superspec:finish-branch
```

## Step 1: Setup

```markdown
1. Read plan file: superspec/changes/[id]/plan.md
2. Extract ALL tasks with full text and context
3. Note Spec references for each task
4. Create TodoWrite with all tasks
```

## Step 2: Per Task - Implementer

### Dispatch Prompt

```markdown
You are implementing a specific task from a plan.

**Task:** [Full task text from plan]

**Spec Reference:**
- Requirement: [Name from plan]
- Scenario: [Name from plan]
- File: superspec/changes/[id]/specs/[cap]/spec.md

**Context:**
[Any additional context needed]

## CRITICAL: TDD is MANDATORY

You MUST follow TDD strictly. This is NON-NEGOTIABLE.

**The Iron Law:** NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST

**TDD Cycle (follow exactly):**

1. **RED - Write failing test first**
   - Write test based on Scenario
   - Run test: `npm test -- --grep "[Scenario Name]"`
   - **CAPTURE THE OUTPUT** - you must show this later
   - Test MUST fail (not error, FAIL)

2. **GREEN - Write minimal code**
   - Implement ONLY what's needed to pass
   - Run test again
   - **CAPTURE THE OUTPUT** - you must show this later
   - Test MUST pass

3. **REFACTOR - Clean up (if needed)**
   - Keep tests green
   - Don't add features not in Spec

4. **COMMIT with Spec reference**

**Commit format:**
```
feat([capability]): [description]

Refs: superspec/changes/[id]/specs/[cap]/spec.md
Requirement: [Name]
Scenario: [Name]
```

## MANDATORY Report Format

When done, you MUST report in this exact format:

```
## TDD Evidence

### RED Phase (Test First)
**Test written:**
[Show the test code]

**Test run output (MUST FAIL):**
```
[Paste actual test output showing FAILURE]
```

### GREEN Phase (Implementation)
**Implementation:**
[Show the implementation code]

**Test run output (MUST PASS):**
```
[Paste actual test output showing PASS]
```

### Commit
**Commit SHA:** [sha]
**Message:** [commit message with Spec reference]

### Files Changed
- [list of files]
```

**WARNING:** If you cannot show failing test output BEFORE implementation,
you did NOT follow TDD. You must delete code and start over.

Ask questions if anything is unclear BEFORE starting.
```

### If Implementer Asks Questions

- Answer clearly and completely
- Provide additional context if needed
- Don't rush into implementation

### Verify TDD Evidence

**Before dispatching Spec Reviewer, verify:**
- [ ] Implementer showed failing test output (RED phase)
- [ ] Implementer showed passing test output (GREEN phase)
- [ ] Failing test output came BEFORE implementation
- [ ] Test failed for correct reason (missing function, not typo)

**If TDD evidence is missing:**
- Do NOT proceed to Spec Review
- Implementer must restart with proper TDD

## Step 3: Per Task - Spec Reviewer

### Dispatch Prompt

```markdown
You are reviewing code for SPEC COMPLIANCE and TDD DISCIPLINE.
Do NOT review code quality - that's a separate review.

## CRITICAL: Do Not Trust the Implementer's Report

The implementer may have:
- Skipped TDD and written tests after code
- Claimed TDD compliance without evidence
- Missed requirements or added extra features

**YOU MUST verify everything independently by reading actual code.**

**DO NOT:**
- Take their word for what they implemented
- Trust claims about TDD compliance without evidence
- Accept "I followed TDD" without seeing failing test output

**DO:**
- Read the actual test code
- Read the actual implementation code
- Compare to Spec line by line
- Verify TDD evidence exists

## What to Review

**Spec File:** superspec/changes/[id]/specs/[cap]/spec.md

**Task Completed:**
- Requirement: [Name]
- Scenario: [Name]

**Implementer's Report:**
[Paste implementer's report here]

**Code to Review:**
[Git diff or file paths]

## Review Checklist

### 1. TDD Compliance (CRITICAL)

**Did implementer follow TDD?**
- [ ] Report shows failing test output (RED phase)
- [ ] Report shows passing test output (GREEN phase)
- [ ] Failing output appeared BEFORE implementation
- [ ] Test failed for correct reason (missing function, not typo/error)

**If TDD evidence is missing or incomplete:**
- Verdict is ❌ NEEDS WORK
- Implementer MUST restart with proper TDD
- Do NOT accept "I followed TDD" without proof

### 2. Requirement Coverage
- Does implementation match the Requirement description?
- Are all SHALL/MUST statements implemented?

### 3. Scenario Coverage
- Is there a test for this Scenario?
- Does the test cover WHEN condition?
- Does the test verify THEN result?
- Does the test verify AND conditions (if any)?

### 4. No Missing Features
- Are all aspects of the Scenario tested?
- Any edge cases in the Scenario not covered?

### 5. No Extra Features
- Is there any code NOT required by the Spec?
- Any "nice to have" additions not in Spec?

**Output Format:**
```
## Spec Compliance Review

### TDD Discipline
[✅ TDD FOLLOWED / ❌ TDD NOT FOLLOWED]
- Failing test evidence: [✅ Present / ❌ Missing]
- Passing test evidence: [✅ Present / ❌ Missing]
- Correct order (test before code): [✅ Yes / ❌ No / ⚠️ Cannot verify]

### Requirement: [Name]
[✅ COMPLIANT / ❌ NOT COMPLIANT]

### Scenario: [Name]
- Test exists: [✅/❌]
- WHEN covered: [✅/❌]
- THEN verified: [✅/❌]
- AND verified: [✅/❌ or N/A]

### Issues Found
1. [Issue description] - [Missing/Extra/Incorrect/TDD violation]

### Verdict
[✅ SPEC COMPLIANT / ❌ NEEDS WORK]

If not compliant, list specific fixes needed.
If TDD not followed, implementer must DELETE code and restart.
```
```

### If Spec Review Fails

1. **If TDD not followed:**
   - Implementer MUST delete implementation code
   - Implementer restarts with proper TDD (test first, show evidence)
   - This is NON-NEGOTIABLE

2. **If Spec gaps found:**
   - Implementer fixes issues
   - Spec Reviewer reviews again

3. Repeat until compliant
4. **Do NOT proceed to Quality Review until Spec Review passes**

## Step 4: Per Task - Quality Reviewer

### Dispatch Prompt

```markdown
You are reviewing code for QUALITY only.
Spec compliance has already been verified.

**Files to Review:**
[Git diff or file paths]

**Review Areas:**

1. **Error Handling**
   - Are errors caught appropriately?
   - Are error messages helpful?
   - No swallowed errors?

2. **Type Safety**
   - Proper TypeScript types?
   - No `any` without justification?
   - Null/undefined handled?

3. **Code Quality**
   - SOLID principles followed?
   - No code duplication?
   - Clear naming?
   - Appropriate abstraction level?

4. **Test Quality**
   - Tests are focused (one thing)?
   - Tests are readable?
   - No testing implementation details?
   - Mocks used appropriately?

**Issue Classification:**
- **Critical**: Must fix before proceeding
- **Important**: Should fix, impacts maintainability
- **Suggestion**: Nice to have, optional

**Output Format:**
```
## Code Quality Review

### Strengths
- [Good things about the code]

### Issues

#### Critical
1. [Issue] - [Why it's critical] - [Suggested fix]

#### Important
1. [Issue] - [Impact] - [Suggested fix]

#### Suggestions
1. [Suggestion] - [Benefit]

### Verdict
[✅ APPROVED / ❌ NEEDS WORK]

If needs work, list required fixes (Critical + Important).
```
```

### If Quality Review Fails

1. Implementer (same subagent) fixes Critical and Important issues
2. Quality Reviewer reviews again
3. Repeat until approved
4. Suggestions are optional

## Step 5: Mark Complete and Update Documents

**⚠️ CRITICAL: Always update documents after completing each task!**

**REMINDER:** `TodoWrite` is for YOUR internal tracking only. It does NOT update the actual `tasks.md` file!
You MUST edit `tasks.md` directly using file editing tools.

After both reviews pass, perform these updates:

### 5.1 Update tasks.md

Open `superspec/changes/[id]/tasks.md` and mark the completed task:

```markdown
## Before
- [ ] 1.1 Implement user authentication
  - Spec: `### Requirement: User Auth` → `#### Scenario: Valid login`

## After
- [x] 1.1 Implement user authentication ✓ (completed YYYY-MM-DD)
  - Spec: `### Requirement: User Auth` → `#### Scenario: Valid login`
```

### 5.2 Update tasks.md Status Section

Update the status counts at the top of tasks.md:

```markdown
## Status
- Total Tasks: 10
- Completed: 3      ← Increment this
- In Progress: 1    ← Update as needed
- Pending: 6        ← Decrement this
```

### 5.3 Update plan.md Progress (Optional but Recommended)

Add progress markers to `superspec/changes/[id]/plan.md`:

```markdown
## Task 1: User Authentication ✅ COMPLETE

**Spec Reference:** `### Requirement: User Auth`
**Completed:** YYYY-MM-DD
**Commits:** abc1234, def5678

[... task details ...]
```

### 5.4 Phase Completion

When all tasks in a phase/section are complete:

1. Add phase completion marker to plan.md:
   ```markdown
   ## Phase 1: Core Foundation ✅ COMPLETE (YYYY-MM-DD)
   ```

2. Update tasks.md with phase summary:
   ```markdown
   ## 1. Core Foundation ✅ COMPLETE

   - [x] 1.1 Task one ✓
   - [x] 1.2 Task two ✓
   - [x] 1.3 Task three ✓

   **Phase completed:** YYYY-MM-DD
   **Total commits:** 5
   ```

3. Announce phase completion:
   ```
   "Phase 1: Core Foundation is complete.

   Updated documents:
   - tasks.md: All Phase 1 tasks marked complete
   - plan.md: Phase 1 marked as COMPLETE

   Moving to Phase 2..."
   ```

### 5.5 Update Completion Tracking Table

**CRITICAL: Update the Completion Tracking table at the bottom of tasks.md!**

This table provides a summary view of progress across all phases:

```markdown
## Completion Tracking

| Phase | Tasks | Completed | Status |
|-------|-------|-----------|--------|
| Phase 1 | 3 | 2 | IN_PROGRESS |    ← Update Completed count
| Phase 2 | 6 | 0 | PENDING |
| Phase 3 | 5 | 0 | PENDING |
| **Total** | **14** | **2** | **14%** |  ← Update Total and percentage
```

**After completing each task:**
1. Increment the "Completed" count for the current phase
2. Update the phase "Status" (PENDING → IN_PROGRESS → COMPLETE)
3. Update the "Total" row's "Completed" count
4. Recalculate and update the percentage

**Phase Status values:**
- `PENDING` - No tasks started
- `IN_PROGRESS` - At least one task completed, not all done
- `COMPLETE` - All tasks in phase completed

### 5.6 Document Update Checklist

Before proceeding to next task, verify:

- [ ] tasks.md: Task marked `[x]` with completion date
- [ ] tasks.md: Status counts updated (top section)
- [ ] tasks.md: Completion Tracking table updated (bottom section)
- [ ] plan.md: Task marked with ✅ COMPLETE (optional)
- [ ] If phase complete: Phase marked as complete in both files
- [ ] Announced completion status to user

**Never proceed to next task without updating documents!**

## Step 6: Final Review

After ALL tasks complete:

### Dispatch Final Reviewer

```markdown
You are performing a FINAL CODE REVIEW of the entire implementation.

**Change:** [change-id]

**Specs:**
- superspec/changes/[id]/specs/[cap1]/spec.md
- superspec/changes/[id]/specs/[cap2]/spec.md

**All Commits:**
[Git log since branch start]

**Review Focus:**

1. **Cross-Task Consistency**
   - Do components work together?
   - Any conflicting implementations?
   - Shared code extracted appropriately?

2. **Complete Spec Coverage**
   - Every Requirement implemented?
   - Every Scenario tested?
   - No gaps between tasks?

3. **Integration**
   - Components integrate correctly?
   - No orphaned code?
   - APIs consistent?

4. **Documentation**
   - Code comments where needed?
   - API documentation?
   - README updates?

**Output Format:**
```
## Final Code Review

### Overall Assessment
[Summary of implementation quality]

### Spec Coverage
- Requirement 1: [✅/❌]
- Requirement 2: [✅/❌]
...

### Cross-Cutting Issues
1. [Issue if any]

### Verdict
[✅ READY TO MERGE / ❌ NEEDS WORK]
```
```

## Red Flags - NEVER Do

| Don't | Why |
|-------|-----|
| **Skip TDD** | **Tests-after prove nothing. No failing test = delete code** |
| **Accept "I followed TDD" without evidence** | **Implementer must show failing test output** |
| **Proceed without TDD evidence** | **No RED phase output = TDD not followed** |
| Skip reviews | Quality gates exist for a reason |
| Proceed with unfixed issues | Compounds into bigger problems |
| Multiple parallel implementers | Will conflict |
| Make subagent read plan file | Provide full text instead |
| Skip context | Subagent needs to understand where task fits |
| Ignore questions | Answer before letting them proceed |
| Accept "close enough" | Spec reviewer found issues = not done |
| Skip re-review | Reviewer found issues = verify fix |
| Quality review before spec | Wrong order - spec compliance first |
| Move to next task with open issues | Complete current task first |
| **Skip document updates** | **User loses track of progress, tasks.md becomes stale** |
| **Forget to update tasks.md** | **Progress invisible, duplicate work risk** |
| **Only use TodoWrite without editing tasks.md** | **TodoWrite is ephemeral! tasks.md is the persistent record** |
| **Skip Completion Tracking table** | **Summary progress tracking lost, % completion wrong** |
| **Skip phase completion markers** | **Milestone visibility lost** |

## Example Flow

```
You: I'm using Subagent-Driven Development for add-2fa change.

[Read plan: superspec/changes/add-2fa/plan.md]
[Extract 5 tasks with full text and Spec references]
[Create TodoWrite with all tasks]

--- Task 1: 2FA Setup - Generate QR Code ---

[Dispatch Implementer with Task 1 + Spec reference]

Implementer: Implementing now using TDD...
- Wrote test for Scenario: Generate setup QR code
- Test failed as expected (function not defined)
- Implemented generate2FASetup()
- Test passes
- Committed with Spec reference

[Dispatch Spec Reviewer]

Spec Reviewer:
## Spec Compliance Review
### Requirement: 2FA Setup - ✅ COMPLIANT
### Scenario: Generate setup QR code
- Test exists: ✅
- WHEN (user requests setup): ✅
- THEN (generates secret): ✅
- AND (displays QR): ✅
- AND (displays manual code): ✅
### Verdict: ✅ SPEC COMPLIANT

[Dispatch Quality Reviewer]

Quality Reviewer:
## Code Quality Review
### Strengths
- Clean TDD implementation
- Good error handling
### Issues
#### Important
1. Consider validating userId input
### Verdict: ✅ APPROVED

[Mark Task 1 complete + UPDATE DOCUMENTS]

You: Task 1 complete. Updating documents...

**Updated tasks.md:**
- [x] 1.1 2FA Setup - Generate QR Code ✓ (2024-01-18)

**Updated tasks.md Status:**
- Completed: 1
- In Progress: 0
- Pending: 4

**Updated Completion Tracking table:**
| Phase | Tasks | Completed | Status |
|-------|-------|-----------|--------|
| Phase 1 | 5 | 1 | IN_PROGRESS |
| **Total** | **5** | **1** | **20%** |

**Updated plan.md:**
## Task 1: 2FA Setup - Generate QR Code ✅ COMPLETE

--- Task 2: 2FA Setup - Verify Code ---
[Continue pattern...]

--- After All Tasks ---

[Dispatch Final Reviewer]

Final Reviewer:
## Final Code Review
### Spec Coverage: All requirements implemented ✅
### Cross-Cutting: No issues
### Verdict: ✅ READY TO MERGE

[Use superspec:finish-branch]
```

## Completion

After final review passes:

### Final Document Updates

1. **Update tasks.md** - All tasks should be marked `[x]`:
   ```markdown
   ## Status
   - Total Tasks: 5
   - Completed: 5 ✅
   - In Progress: 0
   - Pending: 0

   ## All Tasks Complete!
   ```

2. **Update plan.md** - Mark all phases complete:
   ```markdown
   # [Feature] Implementation Plan ✅ COMPLETE

   **Completed:** YYYY-MM-DD
   **Total commits:** N
   ```

3. **Announce completion:**

**"All tasks complete. Final review approved.**

**Documents updated:**
- `tasks.md`: All tasks marked complete (5/5)
- `plan.md`: Plan marked as COMPLETE

**Next step:** `/superspec:verify` then `/superspec:archive`"

## Related References

**Prompt templates (for customization):**
- `implementer-prompt.md` - Full implementer subagent prompt template
- `spec-reviewer-prompt.md` - Full spec reviewer subagent prompt template
- `code-quality-reviewer-prompt.md` - Full quality reviewer prompt template

**Supporting skills:**
- `verification-before-completion` - Evidence before claims
- `dispatching-parallel-agents` - For independent parallel tasks
- `executing-plans` - Alternative: batch execution with checkpoints

## Integration

### Required Workflow Skills

- **superspec:plan** - Creates the plan this skill executes
- **superspec:verify** - Verifies Spec-Test correspondence after completion
- **superspec:finish-branch** - Complete development after all tasks

### Subagents MUST Use

- **tdd** - Subagents follow TDD for EVERY task. This is MANDATORY.

### TDD Iron Law

```
NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST
```

If implementer cannot show failing test output BEFORE implementation:
1. Implementation is REJECTED
2. Code must be DELETED
3. Implementer restarts with proper TDD

This is NON-NEGOTIABLE. TDD discipline is the foundation of quality.
