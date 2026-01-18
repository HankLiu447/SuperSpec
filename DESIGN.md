# SuperSpec Design Document

> **Spec-Driven Development Framework with TDD Discipline**

## 1. Project Vision

### 1.1 Problem Statement

Modern AI-assisted development needs a structured approach that ensures:
- All development has specifications as the source of truth
- TDD is enforced with RED-GREEN-REFACTOR cycles
- Changes are tracked with structured delta operations
- Complete development history is preserved through archiving

### 1.2 Goals

**SuperSpec = Spec-Driven Documentation + TDD Discipline**

```
+------------------------------------------------------------------+
|                         SuperSpec                                 |
+------------------------------------------------------------------+
|                                                                   |
|   +---------------------------+  +---------------------------+    |
|   |    Documentation System   |  |    Development Process    |    |
|   |                           |  |                           |    |
|   |  - Spec/Change structure  |  |  - TDD cycle              |    |
|   |  - Delta tracking         |  |  - Subagent development   |    |
|   |  - Validation system      |  |  - Two-phase review       |    |
|   |  - Archive mechanism      |  |  - Git Worktree           |    |
|   +---------------------------+  +---------------------------+    |
|                                                                   |
|                         | Unified |                               |
|                         v         v                               |
|   +-------------------------------------------------------+      |
|   |                   Unified Workflow                     |      |
|   |                                                        |      |
|   |   Brainstorm -----------------> Plan -> Execute -> Archive   |
|   |   (Explore->Propose->Design->Spec)  |       |        |      |
|   |         Four-phase design        Tasks   TDD      Archive    |
|   +-------------------------------------------------------+      |
|                                                                   |
+------------------------------------------------------------------+
```

### 1.3 Core Principles

| Principle | Description |
|-----------|-------------|
| **Specs First** | All development has Spec as source of truth |
| **TDD Enforced** | Write tests first, watch them fail, then implement |
| **Two-Phase Review** | Spec Compliance -> Code Quality |
| **Evidence First** | Verification over claims |
| **Delta Tracking** | Structured change history |
| **Archive Preservation** | Complete development documentation |

---

## 2. Architecture

### 2.1 Project Structure

```
SuperSpec/
├── cli/                              # CLI command system
│   ├── index.ts                      # Main entry
│   └── commands/
│       ├── init.ts                   # Initialize project
│       ├── list.ts                   # List changes/specs
│       ├── show.ts                   # Show details
│       ├── validate.ts               # Validate specs
│       ├── archive.ts                # Archive changes
│       └── exec.ts                   # Execute plan
│
├── core/                             # Core business logic
│   ├── parsers/                      # Parsing engines
│   │   ├── markdown-parser.ts
│   │   ├── spec-parser.ts
│   │   ├── change-parser.ts
│   │   └── plan-parser.ts
│   ├── validation/                   # Validation system
│   │   ├── validator.ts
│   │   ├── spec-validator.ts
│   │   ├── change-validator.ts
│   │   └── plan-validator.ts
│   ├── schemas/                      # Zod Schema definitions
│   │   ├── spec.schema.ts
│   │   ├── change.schema.ts
│   │   └── plan.schema.ts
│   ├── archive/                      # Archive system
│   │   ├── archiver.ts
│   │   └── delta-applier.ts
│   └── worktree/                     # Git Worktree management
│       └── worktree-manager.ts
│
├── skills/                           # Skill system
│   │
│   │  # === Design Phase (Four-phase progressive) ===
│   ├── brainstorm/                   # Progressive design
│   │   └── SKILL.md                  # EXPLORE -> PROPOSE -> DESIGN -> SPEC
│   │
│   │  # === Planning Phase ===
│   ├── plan-writing/                 # Plan writing
│   │   └── SKILL.md
│   ├── git-worktree/                 # Git Worktree
│   │   └── SKILL.md
│   │
│   │  # === Implementation Phase ===
│   ├── tdd/                          # TDD
│   │   └── SKILL.md
│   ├── subagent-development/         # Subagent development
│   │   ├── SKILL.md
│   │   ├── implementer-prompt.md
│   │   ├── spec-reviewer-prompt.md
│   │   └── quality-reviewer-prompt.md
│   ├── systematic-debugging/         # Systematic debugging
│   │   └── SKILL.md
│   │
│   │  # === Review Phase ===
│   ├── spec-validation/              # Spec validation
│   │   └── SKILL.md
│   ├── code-review/                  # Code review
│   │   └── SKILL.md
│   │
│   │  # === Completion Phase ===
│   ├── verify/                       # Verify implementation
│   │   └── SKILL.md
│   ├── archive/                      # Archive changes
│   │   └── SKILL.md
│   ├── finish-branch/                # Finish branch
│   │   └── SKILL.md
│   │
│   │  # === Meta Skills ===
│   └── using-superspec/              # Usage guide
│       └── SKILL.md
│
├── commands/                         # Slash commands (user-callable)
│   ├── explore.md
│   ├── propose.md
│   ├── spec.md
│   ├── plan.md
│   ├── execute.md
│   ├── verify.md
│   └── archive.md
│
├── agents/                           # Agent definitions
│   ├── implementer/
│   ├── spec-reviewer/
│   ├── quality-reviewer/
│   └── final-reviewer/
│
├── templates/                        # Document templates
│   ├── proposal.md
│   ├── spec.md
│   ├── design.md
│   ├── plan.md
│   └── tasks.md
│
├── schemas/                          # Workflow Schema
│   └── superspec-workflow/
│       └── schema.yaml
│
├── package.json
├── tsconfig.json
├── README.md
└── LICENSE
```

### 2.2 Project Document Structure (Projects using SuperSpec)

```
your-project/
├── superspec/                        # SuperSpec document root
│   ├── project.yaml                  # Project configuration
│   │
│   ├── specs/                        # Specifications (source of truth)
│   │   ├── [capability-1]/
│   │   │   └── spec.md
│   │   └── [capability-2]/
│   │       └── spec.md
│   │
│   └── changes/                      # Change proposals
│       ├── [change-id]/              # In-progress changes
│       │   ├── proposal.md           # Why + What (Phase 2 output)
│       │   ├── design.md             # How - Technical approach (Phase 3, required)
│       │   ├── specs/                # Delta Specs (Phase 4 output)
│       │   │   └── [capability]/
│       │   │       └── spec.md
│       │   ├── plan.md               # TDD implementation plan
│       │   └── tasks.md              # Task list
│       │
│       └── archive/                  # Completed changes
│           └── YYYY-MM-DD-[change-id]/
│               ├── proposal.md
│               ├── specs/
│               ├── design.md
│               ├── plan.md
│               └── tasks.md
│
├── .worktrees/                       # Git Worktrees (optional location)
│   └── [change-id]/
│
└── src/                              # Actual code
```

---

## 3. Unified Document Formats

### 3.1 Proposal (Change Proposal) - Phase 2 Output

**Focus:** Define only **Why** and **What**, not How (technical approach goes in design.md)

```markdown
# Change: [Brief Description]

## Why
[1-2 sentences explaining problem/opportunity]
- What is the problem?
- Why solve it now?

## What Changes
- [Change item 1]
- [Change item 2]
- [**BREAKING**: Breaking change marker]

## Capabilities
### New Capabilities
- [New feature 1] -> Will create `specs/[name]/spec.md`
- [New feature 2]

### Modified Capabilities
- [Existing feature] -> Needs Delta Spec

## Impact
- Affected specs: [list]
- Affected code: [key files]
- Affected APIs: [endpoints]
- Dependencies: [new/changed dependencies]
```

### 3.2 Design (Technical Design) - Phase 3 Output (Required)

**Focus:** Define **How** - Technical approach and decisions

```markdown
# Design: [Feature Name]

## Context
[Background, current state, constraints]

## Goals / Non-Goals

### Goals
- [What this design achieves]

### Non-Goals
- [What this design explicitly excludes]

## Approaches Considered

### Approach A: [Name]
[Approach description]

**Pros:**
- [Advantage 1]
- [Advantage 2]

**Cons:**
- [Disadvantage 1]
- [Disadvantage 2]

### Approach B: [Name]
[Approach description]

**Pros:**
- [Advantages]

**Cons:**
- [Disadvantages]

## Decision

**Chosen Approach:** [A/B/C]

**Rationale:**
[Why this approach was chosen]

## Trade-offs
[What we're giving up and why it's acceptable]

## Technical Details

### Architecture
[High-level architecture description]

### Key Components
- [Component 1]: [Purpose]
- [Component 2]: [Purpose]

### Data Flow
```
[ASCII data flow diagram]
```

## Risks and Mitigations
| Risk | Mitigation |
|------|------------|
| [Risk 1] | [How to mitigate] |
| [Risk 2] | [How to mitigate] |

## Open Questions
- [Question 1]
- [Question 2]
```

### 3.3 Spec (Specification Document) - Phase 4 Output

```markdown
# [Capability] Specification

## Purpose
[1-2 sentences explaining feature purpose]

## Requirements

### Requirement: [Requirement Name]
The system SHALL [behavior description]

#### Scenario: [Scenario Name]
- **WHEN** [trigger condition]
- **THEN** [expected result]
- **AND** [additional result] (optional)

### Requirement: [Another Requirement]
The system SHALL [behavior description]

#### Scenario: [Scenario 1]
- **WHEN** ...
- **THEN** ...

#### Scenario: [Scenario 2]
- **WHEN** ...
- **THEN** ...
```

### 3.4 Delta Spec (Change Specification)

```markdown
## ADDED Requirements

### Requirement: [New Feature]
The system SHALL [new behavior description]

#### Scenario: [Scenario]
- **WHEN** ...
- **THEN** ...

## MODIFIED Requirements

### Requirement: [Existing Feature, name must match exactly]
[Complete updated requirement text, including all scenarios]

#### Scenario: [Updated Scenario]
- **WHEN** ...
- **THEN** ...

## REMOVED Requirements

### Requirement: [Removed Feature]
**Reason**: [Removal reason]
**Migration**: [Migration plan]

## RENAMED Requirements
- FROM: `### Requirement: Old Name`
- TO: `### Requirement: New Name`
```

### 3.5 Plan (Implementation Plan)

```markdown
# [Feature] Implementation Plan

> **For Claude:** REQUIRED SKILL: Use superspec:execute to implement this plan.

**Goal:** [One sentence describing goal]

**Architecture:** [2-3 sentence architecture description]

**Tech Stack:** [Key technologies]

**Related Specs:**
- `superspec/changes/[id]/specs/[capability]/spec.md`

---

## Task 1: [Component Name]

**Spec Reference:** `### Requirement: [Requirement Name]`

**Files:**
- Create: `exact/path/to/file.ts`
- Modify: `exact/path/to/existing.ts:123-145`
- Test: `tests/exact/path/to/test.ts`

### Step 1.1: Write failing test (RED)

```typescript
// Corresponds to Scenario: [Scenario Name]
test('[Scenario Description]', async () => {
  // WHEN [trigger condition]
  const result = await action(input);

  // THEN [expected result]
  expect(result).toBe(expected);
});
```

**Run:** `npm test path/to/test.ts -- --grep "[Test Name]"`
**Expected:** FAIL - "[function] is not defined"

### Step 1.2: Implement minimal code (GREEN)

```typescript
export function action(input: Input): Output {
  // Minimal implementation
  return expected;
}
```

**Run:** `npm test path/to/test.ts`
**Expected:** PASS

### Step 1.3: Refactor (if needed)

[Clean up code, keep tests passing]

### Step 1.4: Commit

```bash
git add tests/path/test.ts src/path/file.ts
git commit -m "feat([capability]): implement [scenario]

Refs: superspec/changes/[id]/specs/[capability]/spec.md
Requirement: [Requirement Name]
Scenario: [Scenario Name]"
```

---

## Task 2: [Next Component]

**Spec Reference:** `### Requirement: [Requirement Name]`

[Repeat above structure...]
```

### 3.6 Tasks (Task List)

```markdown
# Implementation Tasks for [Change ID]

## Status
- Total Tasks: X
- Completed: Y
- In Progress: Z
- Pending: W

## 1. [Phase Name]

- [x] 1.1 [Completed task]
- [ ] 1.2 [Pending task]
  - Spec: `### Requirement: [Requirement]` -> `#### Scenario: [Scenario]`
- [ ] 1.3 [Pending task]

## 2. [Next Phase]

- [ ] 2.1 [Task]
- [ ] 2.2 [Task]
```

---

## 4. Unified Workflow

### 4.1 Complete Workflow Diagram

```
+-------------------------------------------------------------------------+
|                        SuperSpec Complete Workflow                       |
+-------------------------------------------------------------------------+
|                                                                          |
|  +===================================================================+  |
|  | Phase 1: Exploration and Proposal                                  |  |
|  +===================================================================+  |
|  |                                                                    |  |
|  |   /superspec:brainstorm (EXPLORE phase)                           |  |
|  |        |                                                          |  |
|  |        v                                                          |  |
|  |   +-------------+    +-------------+    +-------------+          |  |
|  |   |  Explore    | -> |   Clarify   | -> |  Evaluate   |          |  |
|  |   |   Ideas     |    | Requirements|    |  Approaches |          |  |
|  |   +-------------+    +-------------+    +-------------+          |  |
|  |        |                                                          |  |
|  |        v                                                          |  |
|  |   /superspec:brainstorm (PROPOSE phase)                           |  |
|  |        |                                                          |  |
|  |        v                                                          |  |
|  |   +---------------------------------------------+                 |  |
|  |   | superspec/changes/[id]/proposal.md          |                 |  |
|  |   |                                             |                 |  |
|  |   | - Why: Problem/Opportunity                  |                 |  |
|  |   | - What Changes: Change list                 |                 |  |
|  |   | - Capabilities: New/modified features       |                 |  |
|  |   | - Impact: Affected areas                    |                 |  |
|  |   +---------------------------------------------+                 |  |
|  |                                                                    |  |
|  +===================================================================+  |
|                                    |                                     |
|                                    v                                     |
|  +===================================================================+  |
|  | Phase 2: Specification Definition                                  |  |
|  +===================================================================+  |
|  |                                                                    |  |
|  |   /superspec:brainstorm (DESIGN + SPEC phases)                    |  |
|  |        |                                                          |  |
|  |        v                                                          |  |
|  |   +---------------------------------------------+                 |  |
|  |   | superspec/changes/[id]/design.md            |                 |  |
|  |   | superspec/changes/[id]/specs/[cap]/spec.md  |                 |  |
|  |   +---------------------------------------------+                 |  |
|  |        |                                                          |  |
|  |        v                                                          |  |
|  |   superspec validate [id] --strict                                |  |
|  |        |                                                          |  |
|  |        v                                                          |  |
|  |   [Validation passed?] --No--> [Fix specs] --> [Re-validate]      |  |
|  |        |                                                          |  |
|  |       Yes                                                         |  |
|  |        |                                                          |  |
|  +========|==========================================================+  |
|           |                                                              |
|           v                                                              |
|  +===================================================================+  |
|  | Phase 3: Planning and Preparation                                  |  |
|  +===================================================================+  |
|  |                                                                    |  |
|  |   /superspec:plan                                                 |  |
|  |        |                                                          |  |
|  |        +--> Create Git Worktree (isolated environment)            |  |
|  |        |    +-> .worktrees/[id]/                                  |  |
|  |        |                                                          |  |
|  |        v                                                          |  |
|  |   +---------------------------------------------+                 |  |
|  |   | superspec/changes/[id]/plan.md              |                 |  |
|  |   | superspec/changes/[id]/tasks.md             |                 |  |
|  |   +---------------------------------------------+                 |  |
|  |                                                                    |  |
|  +===================================================================+  |
|                                    |                                     |
|                                    v                                     |
|  +===================================================================+  |
|  | Phase 4: TDD Implementation (Subagent-Driven)                      |  |
|  +===================================================================+  |
|  |                                                                    |  |
|  |   /superspec:execute                                              |  |
|  |        |                                                          |  |
|  |        v                                                          |  |
|  |   +-------------------------------------------------------------+ |  |
|  |   |                    Per Task Loop                             | |  |
|  |   |  +-------------+                                             | |  |
|  |   |  | Implementer |--> TDD cycle (RED -> GREEN -> REFACTOR)     | |  |
|  |   |  |  Subagent   |                                             | |  |
|  |   |  +------+------+                                             | |  |
|  |   |         |                                                     | |  |
|  |   |         v                                                     | |  |
|  |   |  +-------------+                                             | |  |
|  |   |  |    Spec     |--> Verify implementation against Spec       | |  |
|  |   |  |  Reviewer   |                                             | |  |
|  |   |  +------+------+                                             | |  |
|  |   |         |                                                     | |  |
|  |   |    [Passed?]--No--> [Fix] --> [Re-review]                    | |  |
|  |   |         |                                                     | |  |
|  |   |        Yes                                                    | |  |
|  |   |         |                                                     | |  |
|  |   |         v                                                     | |  |
|  |   |  +-------------+                                             | |  |
|  |   |  |   Quality   |--> Code quality review                      | |  |
|  |   |  |  Reviewer   |                                             | |  |
|  |   |  +------+------+                                             | |  |
|  |   |         |                                                     | |  |
|  |   |    [Passed?]--No--> [Fix] --> [Re-review]                    | |  |
|  |   |         |                                                     | |  |
|  |   |        Yes                                                    | |  |
|  |   |         |                                                     | |  |
|  |   |         v                                                     | |  |
|  |   |    [Mark task complete] --> [Next task or done]              | |  |
|  |   |                                                               | |  |
|  |   +-------------------------------------------------------------+ |  |
|  |                                                                    |  |
|  +===================================================================+  |
|                                    |                                     |
|                                    v                                     |
|  +===================================================================+  |
|  | Phase 5: Verification and Completion                               |  |
|  +===================================================================+  |
|  |                                                                    |  |
|  |   /superspec:verify                                               |  |
|  |        |                                                          |  |
|  |        +--> Verify all Spec Scenarios have corresponding tests    |  |
|  |        +--> Verify all tests pass                                 |  |
|  |        +--> Final code review                                     |  |
|  |        |                                                          |  |
|  |        v                                                          |  |
|  |   /superspec:archive                                              |  |
|  |        |                                                          |  |
|  |        +--> Apply Delta to main specs                             |  |
|  |        |    +-> superspec/specs/[cap]/spec.md updated             |  |
|  |        |                                                          |  |
|  |        +--> Move changes to archive                               |  |
|  |        |    +-> superspec/changes/archive/YYYY-MM-DD-[id]/        |  |
|  |        |                                                          |  |
|  |        +--> Complete branch (merge/PR/keep/discard)               |  |
|  |                                                                    |  |
|  +===================================================================+  |
|                                                                          |
+-------------------------------------------------------------------------+
```

### 4.2 Workflow Phase Description

| Phase | Command | Skill | Output |
|-------|---------|-------|--------|
| **Design (Four-phase)** | `/superspec:brainstorm` | `brainstorm` | `proposal.md` + `design.md` + `specs/**/*.md` |
| **Validate Specs** | `superspec validate` | `spec-validation` | Validation report |
| **Plan** | `/superspec:plan` | `plan-writing`, `git-worktree` | `plan.md`, `tasks.md`, worktree |
| **Execute** | `/superspec:execute` | `subagent-development`, `tdd` | Actual code |
| **Verify Implementation** | `/superspec:verify` | `verify` | Verification report |
| **Archive** | `/superspec:archive` | `archive`, `finish-branch` | Archived documents |

---

## 5. Unified Commands and Skill System

### 5.1 CLI Commands

```bash
# Initialize
superspec init [path]              # Initialize project
superspec update [path]            # Update command files

# Query
superspec list                     # List changes
superspec list --specs             # List specs
superspec show [item]              # Show details
superspec show [item] --json       # JSON output

# Validate
superspec validate [item]          # Validate spec
superspec validate [item] --strict # Strict mode
superspec validate --all           # Validate all

# Execute
superspec exec [change-id]         # Execute plan (CLI mode)

# Archive
superspec archive [change-id]      # Archive change
superspec archive [change-id] --yes # Non-interactive mode
```

### 5.2 Slash Commands (AI Assistant)

| Command | Corresponding Skill | Description |
|---------|---------------------|-------------|
| `/superspec:brainstorm` | `brainstorm` | Progressive design (Four phases: EXPLORE -> PROPOSE -> DESIGN -> SPEC) |
| `/superspec:plan` | `plan-writing` | Create TDD implementation plan |
| `/superspec:execute` | `subagent-development` | Subagent-driven execution |
| `/superspec:verify` | `verify` | Verify implementation matches specs |
| `/superspec:archive` | `archive` | Archive changes |

### 5.3 Skill List

#### Design Phase (Four-phase Progressive)

| Skill | Description |
|-------|-------------|
| `brainstorm` | Progressive design flow, outputs proposal.md + design.md + specs/*.md |

#### Planning Phase

| Skill | Description |
|-------|-------------|
| `plan-writing` | Create implementation plan (based on Spec, TDD structure) |
| `git-worktree` | Git Worktree management |

#### Implementation Phase

| Skill | Description |
|-------|-------------|
| `tdd` | TDD cycle (RED -> GREEN -> REFACTOR) |
| `subagent-development` | Subagent-driven development + two-phase review |
| `systematic-debugging` | Systematic debugging |

#### Review Phase

| Skill | Description |
|-------|-------------|
| `spec-validation` | Validate spec completeness and format |
| `code-review` | Code review (two-phase) |

#### Completion Phase

| Skill | Description |
|-------|-------------|
| `verify` | Verify implementation matches specs |
| `archive` | Archive changes, apply Delta |
| `finish-branch` | Complete branch (merge/PR) |

#### Meta Skills

| Skill | Description |
|-------|-------------|
| `using-superspec` | Usage guide |

---

## 6. Validation and Review Mechanism

### 6.1 Spec Validation

```typescript
// Validation rules
interface SpecValidationRules {
  // Structure validation
  hasPurpose: boolean;           // Must have Purpose section
  hasRequirements: boolean;      // Must have Requirements section

  // Requirement validation
  requirementHasScenario: boolean;  // Each requirement has at least one Scenario
  scenarioFormat: boolean;          // Scenario uses #### format
  scenarioHasWhenThen: boolean;     // Scenario has WHEN/THEN

  // Delta validation
  deltaOperationValid: boolean;     // ADDED/MODIFIED/REMOVED/RENAMED
  modifiedHasFullContent: boolean;  // MODIFIED includes full content
  removedHasReason: boolean;        // REMOVED has reason and migration
}
```

### 6.2 Two-Phase Code Review

```
+--------------------------------------------------------+
|                   Two-Phase Review Flow                 |
+--------------------------------------------------------+
|                                                         |
|   +--------------------------------------------------+ |
|   | Stage 1: Spec Compliance Review                   | |
|   +--------------------------------------------------+ |
|   |                                                   | |
|   |  Reviewer reads:                                  | |
|   |  - superspec/changes/[id]/specs/[cap]/spec.md    | |
|   |  - Actual code                                    | |
|   |                                                   | |
|   |  Checks:                                          | |
|   |  - Each Requirement has corresponding impl       | |
|   |  - Each Scenario has corresponding test          | |
|   |  - No extra features (not in Spec)               | |
|   |  - No missing features                           | |
|   |                                                   | |
|   |  Result: PASS / NEEDS FIX                        | |
|   +--------------------------------------------------+ |
|                          |                              |
|                     [After passing]                     |
|                          |                              |
|                          v                              |
|   +--------------------------------------------------+ |
|   | Stage 2: Code Quality Review                      | |
|   +--------------------------------------------------+ |
|   |                                                   | |
|   |  Checks:                                          | |
|   |  - Error handling                                | |
|   |  - Type safety                                   | |
|   |  - SOLID principles                              | |
|   |  - Test quality                                  | |
|   |  - Code style                                    | |
|   |  - Documentation completeness                    | |
|   |                                                   | |
|   |  Issue categories:                               | |
|   |  - Critical: Must fix                            | |
|   |  - Important: Should fix                         | |
|   |  - Suggestion: Optional improvement              | |
|   |                                                   | |
|   |  Result: PASS / NEEDS FIX                        | |
|   +--------------------------------------------------+ |
|                                                         |
+--------------------------------------------------------+
```

### 6.3 Spec-Test Correspondence Validation

```
Spec Scenario                        Test Case
===============================================================
#### Scenario: Valid login       ->  test('Valid login', () => {
- WHEN valid credentials              // WHEN
- THEN grants access                  const result = login(valid);
                                      // THEN
                                      expect(result.granted).toBe(true);
                                    });
===============================================================
#### Scenario: Invalid password  ->  test('Invalid password', () => {
- WHEN invalid password               // WHEN
- THEN denies access                  const result = login(invalid);
                                      // THEN
                                      expect(result.granted).toBe(false);
                                    });
===============================================================
```

**Validation Rules:**
1. Each Scenario must have a corresponding test
2. Test name should correspond to Scenario name
3. Test's WHEN/THEN should correspond to Scenario's conditions/results

---

## 7. Technical Implementation

### 7.1 Tech Stack

| Component | Technology |
|-----------|------------|
| **Language** | TypeScript |
| **Runtime** | Node.js >= 18 |
| **CLI Framework** | Commander |
| **Validation** | Zod |
| **YAML Parsing** | yaml |
| **Testing** | Vitest |
| **UI** | chalk, ora, inquirer |

### 7.2 Core Modules

#### 7.2.1 Parsing Engine

```typescript
// Parse Spec documents
class SpecParser {
  parseSpec(content: string): Spec;
  parseRequirements(content: string): Requirement[];
  parseScenarios(content: string): Scenario[];
}

// Parse Change documents
class ChangeParser {
  parseChange(content: string): Change;
  parseDeltas(dir: string): Delta[];
}

// Parse Plan documents
class PlanParser {
  parsePlan(content: string): Plan;
  parseTasks(content: string): Task[];
  parseSteps(content: string): Step[];
}
```

#### 7.2.2 Validation System

```typescript
// Zod Schema
const SpecSchema = z.object({
  name: z.string(),
  purpose: z.string().min(10),
  requirements: z.array(RequirementSchema).min(1),
});

const RequirementSchema = z.object({
  name: z.string(),
  description: z.string(),
  scenarios: z.array(ScenarioSchema).min(1),
});

const ScenarioSchema = z.object({
  name: z.string(),
  when: z.string(),
  then: z.string(),
  and: z.array(z.string()).optional(),
});

// Validator
class Validator {
  validateSpec(spec: Spec): ValidationReport;
  validateChange(change: Change): ValidationReport;
  validatePlan(plan: Plan): ValidationReport;
}
```

#### 7.2.3 Archive System

```typescript
class Archiver {
  // Archive change
  archiveChange(changeId: string): ArchiveResult;

  // Apply Delta to main specs
  applyDeltas(changeId: string): ApplyResult;

  // Move to archive directory
  moveToArchive(changeId: string): void;
}

class DeltaApplier {
  // Apply ADDED
  applyAdded(spec: Spec, delta: AddedDelta): Spec;

  // Apply MODIFIED
  applyModified(spec: Spec, delta: ModifiedDelta): Spec;

  // Apply REMOVED
  applyRemoved(spec: Spec, delta: RemovedDelta): Spec;

  // Apply RENAMED
  applyRenamed(spec: Spec, delta: RenamedDelta): Spec;
}
```

---

## 8. Expected Benefits

### 8.1 Development Process Improvements

| Improvement | Description |
|-------------|-------------|
| **Spec-based Documentation** | All development has Spec as reference, traceable |
| **Complete History** | Changes archived, know "why" and "when" changed |
| **Quality Assurance** | TDD + Spec validation + two-phase review |
| **Development Efficiency** | Subagent parallel development |
| **Auditability** | Requirements + Scenarios + Tests correspondence |

### 8.2 Validation Layers

```
+--------------------------------------------------------+
|                    Validation Layer Pyramid             |
+--------------------------------------------------------+
|                                                         |
|                    +-------------+                      |
|                    | Final Review|  <- Overall impl     |
|                    +------+------+                      |
|                           |                             |
|              +------------+------------+                |
|              |                         |                |
|       +------+------+          +------+------+         |
|       | Code Quality|          |Spec Compliance|        |
|       |   Review    |          |    Review    |         |
|       +------+------+          +------+------+         |
|              |                         |                |
|              +------------+------------+                |
|                           |                             |
|                    +------+------+                      |
|                    |  TDD Tests  |  <- RED-GREEN-REFACTOR|
|                    +------+------+                      |
|                           |                             |
|                    +------+------+                      |
|                    |Spec Validation|  <- Zod Schema    |
|                    +-------------+                      |
|                                                         |
+--------------------------------------------------------+
```

---

## 9. License

MIT License
