# Implementer Subagent Prompt Template

Use this template when dispatching an implementer subagent.

```
Task tool (general-purpose):
  description: "Implement Task N: [task name]"
  prompt: |
    You are implementing Task N: [task name]

    ## Task Description

    [FULL TEXT of task from plan - paste it here, don't make subagent read file]

    ## Spec Reference

    - Requirement: [Name from plan]
    - Scenario: [Name from plan]
    - File: superspec/changes/[id]/specs/[cap]/spec.md

    ## Context

    [Scene-setting: where this fits, dependencies, architectural context]

    ## Before You Begin

    If you have questions about:
    - The requirements or acceptance criteria
    - The approach or implementation strategy
    - Dependencies or assumptions
    - Anything unclear in the task description

    **Ask them now.** Raise any concerns before starting work.

    ## CRITICAL: TDD is MANDATORY

    You MUST follow TDD strictly. This is NON-NEGOTIABLE.

    **The Iron Law:** NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST

    ## Your Job

    Once you're clear on requirements:

    1. **RED - Write failing test first**
       - Write test based on Scenario
       - Run test command
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

    Work from: [directory]

    **While you work:** If you encounter something unexpected or unclear, **ask questions**.
    It's always OK to pause and clarify. Don't guess or make assumptions.

    ## Before Reporting Back: Self-Review

    Review your work with fresh eyes. Ask yourself:

    **Completeness:**
    - Did I fully implement everything in the Spec?
    - Did I miss any requirements?
    - Are there edge cases I didn't handle?

    **TDD Discipline:**
    - Did I write the test FIRST?
    - Did I see it FAIL before implementing?
    - Can I show the failing output?

    **Quality:**
    - Is this my best work?
    - Are names clear and accurate?
    - Is the code clean and maintainable?

    **Discipline:**
    - Did I avoid overbuilding (YAGNI)?
    - Did I only build what was requested?
    - Did I follow existing patterns in the codebase?

    If you find issues during self-review, fix them now before reporting.

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
    **Message:**
    feat([capability]): [description]

    Refs: superspec/changes/[id]/specs/[cap]/spec.md
    Requirement: [Name]
    Scenario: [Name]

    ### Files Changed
    - [list of files]

    ### Self-Review Findings
    - [any issues found and fixed]

    ### Questions/Concerns
    - [any remaining questions]
    ```

    **WARNING:** If you cannot show failing test output BEFORE implementation,
    you did NOT follow TDD. You must delete code and start over.
```

## Placeholder Reference

| Placeholder | Description |
|-------------|-------------|
| `[task name]` | Name of the task from plan |
| `[FULL TEXT]` | Complete task text from plan.md |
| `[Name from plan]` | Requirement/Scenario name |
| `[id]` | Change ID |
| `[cap]` | Capability name |
| `[directory]` | Working directory (worktree path) |
