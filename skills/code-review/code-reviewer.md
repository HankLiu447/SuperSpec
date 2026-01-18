# Code Reviewer Subagent Template

Use this template when dispatching a code reviewer subagent.

```
Task tool (general-purpose):
  description: "Code review for {DESCRIPTION}"
  prompt: |
    You are performing a code review.

    ## What Was Implemented

    {WHAT_WAS_IMPLEMENTED}

    ## Requirements/Plan

    {PLAN_OR_REQUIREMENTS}

    ## Code to Review

    Base: {BASE_SHA}
    Head: {HEAD_SHA}

    Run: `git diff {BASE_SHA}..{HEAD_SHA}` to see changes

    ## Review Focus

    ### 1. Requirements Match
    - Does implementation match requirements?
    - Any missing functionality?
    - Any extra functionality not requested?

    ### 2. Code Quality
    - Clear, descriptive naming?
    - Appropriate abstraction level?
    - No code duplication?
    - SOLID principles followed?

    ### 3. Error Handling
    - Errors caught appropriately?
    - Error messages helpful?
    - No swallowed errors?

    ### 4. Type Safety
    - Proper TypeScript types?
    - No unnecessary `any`?
    - Null/undefined handled?

    ### 5. Test Quality
    - Tests exist for new code?
    - Tests are focused and readable?
    - Not testing implementation details?

    ### 6. Security (if applicable)
    - Input validation?
    - No injection vulnerabilities?
    - Sensitive data handled correctly?

    ## Issue Classification

    **Critical:** Must fix - security, data corruption, crashes
    **Important:** Should fix - maintainability, patterns, naming
    **Minor:** Nice to have - style, minor improvements

    ## Output Format

    ```
    ## Code Review: {DESCRIPTION}

    ### Summary
    [1-2 sentence overview]

    ### Strengths
    - [Good aspects of the code]

    ### Issues

    #### Critical
    1. [Issue] - [File:Line] - [Fix]

    #### Important
    1. [Issue] - [File:Line] - [Fix]

    #### Minor
    1. [Issue] - [File:Line] - [Fix]

    ### Assessment
    [✅ Ready to proceed / ⚠️ Address critical issues first / ❌ Major rework needed]
    ```
```

## Placeholder Reference

| Placeholder | Description |
|-------------|-------------|
| `{WHAT_WAS_IMPLEMENTED}` | Summary of what was built |
| `{PLAN_OR_REQUIREMENTS}` | The requirements or plan being implemented |
| `{BASE_SHA}` | Git SHA of starting commit |
| `{HEAD_SHA}` | Git SHA of ending commit |
| `{DESCRIPTION}` | Brief description of what's being reviewed |

## Usage Example

```typescript
Task({
  description: "Code review for user authentication",
  prompt: `
    You are performing a code review.

    ## What Was Implemented
    User authentication with JWT tokens, including login, logout, and token refresh.

    ## Requirements/Plan
    From: superspec/changes/add-auth/plan.md Task 1

    ## Code to Review
    Base: a7981ec
    Head: 3df7661

    Run: git diff a7981ec..3df7661 to see changes

    [Rest of template...]
  `
});
```

## When to Request Review

| Situation | Action |
|-----------|--------|
| After each task in subagent-driven development | Mandatory |
| After completing major feature | Mandatory |
| Before merge to main | Mandatory |
| When stuck (fresh perspective) | Optional |
| Before refactoring | Optional |
| After fixing complex bug | Optional |

## Handling Review Results

### If Critical Issues Found

1. Fix all critical issues immediately
2. Request re-review
3. Do not proceed until cleared

### If Important Issues Found

1. Fix important issues before proceeding
2. May proceed if time-critical with tracking

### If Only Minor Issues

1. Fix if quick
2. May proceed and address later
3. Track in backlog if deferred
