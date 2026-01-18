# SuperSpec

> **Spec-Driven Development Framework**

SuperSpec is a unified development framework that combines spec-driven documentation with TDD discipline.

## Core Philosophy

```
Every Scenario becomes a test. Every test traces back to a Scenario.
```

| Principle | Description |
|-----------|-------------|
| **Specs First** | All development has Specs as the single source of truth |
| **TDD Enforced** | Write tests first, watch them fail, then implement |
| **Two-Phase Review** | Spec Compliance Review → Code Quality Review |
| **Evidence First** | Verification over claims |
| **Delta Tracking** | Structured change history |
| **Archive Preservation** | Complete development documentation |

## Unified Workflow

```
/superspec:brainstorm      Progressive design (Explore → Propose → Spec)
        ↓
superspec validate         Validate specifications (CLI command)
        ↓
/superspec:plan            Create TDD implementation plan
        ↓
/superspec:execute         Subagent-driven TDD implementation
        ↓
/superspec:verify          Verify implementation matches specs
        ↓
/superspec:finish-branch   Complete branch (merge/PR)
        ↓
/superspec:archive         Archive changes, apply Delta
```

### Four Phases of Brainstorming

```
+----------------------------------------------------------+
|              /superspec:brainstorm                        |
+----------------------------------------------------------+
|                                                           |
|   Phase 1: EXPLORE                                        |
|   - Free exploration, understand the problem              |
|   - Ask clarifying questions, visualize ideas             |
|                                                           |
|                    | Problem is clear                     |
|                    v                                      |
|                                                           |
|   Phase 2: PROPOSE -> proposal.md                         |
|   - Define Why (problem/opportunity)                      |
|   - Define What Changes (change list)                     |
|   - Define Capabilities (new/modified features)           |
|   - Define Impact (affected areas)                        |
|                                                           |
|                    | Scope is defined                     |
|                    v                                      |
|                                                           |
|   Phase 3: DESIGN -> design.md                            |
|   - Compare 2-3 technical approaches                      |
|   - Select recommended approach with rationale            |
|   - Document trade-offs                                   |
|                                                           |
|                    | Approach is decided                  |
|                    v                                      |
|                                                           |
|   Phase 4: SPEC -> specs/*.md                             |
|   - Define Requirements (System SHALL...)                 |
|   - Define Scenarios (WHEN/THEN -> each becomes a test)   |
|                                                           |
+----------------------------------------------------------+
```

## Quick Start

### Installation

```bash
# Install CLI
npm install -g superspec

# Or install from source
git clone https://github.com/your-org/superspec
cd superspec
npm install
npm run build
npm link
```

### Claude Code Integration

Skills are automatically installed to `~/.claude/skills/` when you run `superspec init`.

### Initialize Project

```bash
superspec init
```

This will create:
```
your-project/
└── superspec/
    ├── project.yaml       # Project configuration
    ├── specs/             # Specifications (source of truth)
    └── changes/           # Change proposals
```

### Basic Usage

```bash
# 1. Start a new change (four-phase brainstorming)
/superspec:brainstorm

# 2. Validate specifications (CLI command)
superspec validate add-feature --strict

# 3. Create implementation plan
/superspec:plan

# 4. Execute plan (subagent-driven TDD)
/superspec:execute

# 5. Verify implementation (CLI command)
superspec verify add-feature

# 6. Complete branch (merge/PR/keep/discard)
/superspec:finish-branch

# 7. Archive changes (CLI command)
superspec archive add-feature --yes
```

## Directory Structure

### Project Structure

```
your-project/
├── superspec/
│   ├── specs/                    # Specifications (source of truth)
│   │   └── [capability]/
│   │       └── spec.md
│   │
│   └── changes/                  # Change proposals
│       ├── [change-id]/          # In progress
│       │   ├── proposal.md       # Why + What
│       │   ├── design.md         # How (technical approach)
│       │   ├── specs/            # Delta Specs
│       │   ├── plan.md           # TDD implementation plan
│       │   └── tasks.md          # Task list
│       │
│       └── archive/              # Completed
│           └── YYYY-MM-DD-[id]/
│
└── src/                          # Actual code
```

### Spec Format

```markdown
# [Capability] Specification

## Purpose
[Feature purpose]

## Requirements

### Requirement: [Requirement Name]
The system SHALL [behavior description]

#### Scenario: [Scenario Name]
- **WHEN** [trigger condition]
- **THEN** [expected result]
```

### Spec-Test Mapping

```
Spec Scenario                     TDD Test
===============================================================
#### Scenario: Valid login    ->  test('Valid login', () => {
- WHEN valid credentials            const result = login(valid);
- THEN grants access                expect(result.granted).toBe(true);
                                  });
===============================================================
```

## CLI Commands

```bash
# Initialize
superspec init [path]              # Initialize project

# Query
superspec list                     # List changes
superspec list --specs             # List specifications
superspec show [item]              # Show details

# Validate
superspec validate [id]            # Validate specification
superspec validate [id] --strict   # Strict mode

# Verify
superspec verify [id]              # Verify implementation matches specs
superspec verify [id] --strict     # Fail on extra code/tests
superspec verify [id] --verbose    # Show detailed matching

# Archive
superspec archive [id]             # Archive change
superspec archive [id] --yes       # Non-interactive mode
```

## Slash Commands (AI Assistant)

| Command | Description |
|---------|-------------|
| `/superspec:brainstorm` | Progressive design (Explore → Propose → Spec) |
| `/superspec:plan` | Create TDD implementation plan |
| `/superspec:execute` | Subagent-driven execution |
| `/superspec:verify` | Verify implementation matches specs |
| `/superspec:finish-branch` | Complete branch (merge/PR/keep/discard) |
| `/superspec:archive` | Archive changes |

## Skill System

### Design Phase
- `superspec:brainstorm` - Progressive design (Explore → Propose → Spec)

### Planning Phase
- `superspec:plan` - Create TDD plan
- `git-worktree` - Git Worktree management

### Implementation Phase
- `tdd` - TDD cycle (with `testing-anti-patterns.md` reference)
- `superspec:execute` - Subagent-driven development (default)
- `executing-plans` - Batch execution with checkpoints (alternative)
- `dispatching-parallel-agents` - For 2+ independent parallel tasks
- `systematic-debugging` - Systematic debugging (with support files)

### Quality & Discipline Phase
- `verification-before-completion` - Evidence before completion claims
- `receiving-code-review` - Handle code review feedback professionally

### Review Phase
- `spec-validation` - Specification validation
- `code-review` - Code review (with `code-reviewer.md` template)

### Completion Phase
- `superspec:verify` - Verify implementation
- `superspec:finish-branch` - Complete branch (merge/PR/keep/discard)
- `superspec:archive` - Archive changes

## Two-Phase Review

```
+------------------------------------------+
| Stage 1: Spec Compliance Review          |
| - Read Spec files                        |
| - Check each Requirement is implemented  |
| - Check each Scenario has a test         |
| - Check no extra/missing features        |
+------------------------------------------+
                    |
              [After passing]
                    v
+------------------------------------------+
| Stage 2: Code Quality Review             |
| - Error handling                         |
| - Type safety                            |
| - SOLID principles                       |
| - Test quality                           |
+------------------------------------------+
```

## Iron Rules

### TDD Rule
```
No production code without a failing test first
```

### Spec Rule
```
Specs are the source of truth. Changes are proposals.
```

### SuperSpec Rule
```
Every Scenario becomes a test. Every test traces back to a Scenario.
```

### Verification Rule
```
No completion claims without fresh verification evidence
```
"It should work" is not evidence. Run the test. Show the output. Then claim completion.

## License

MIT License

---

**SuperSpec** - Spec-Driven + TDD Discipline = Traceable High-Quality Development
