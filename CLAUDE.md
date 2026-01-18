# SuperSpec

SuperSpec is a spec-driven development framework combining TDD discipline with structured documentation.

## Core Philosophy

```
Every Scenario becomes a test. Every test traces back to a Scenario.
```

## Four Iron Rules

1. **TDD Rule**: NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST
2. **Spec Rule**: SPECS ARE TRUTH. CHANGES ARE PROPOSALS.
3. **SuperSpec Rule**: EVERY SCENARIO BECOMES A TEST. EVERY TEST TRACES TO A SCENARIO.
4. **Verification Rule**: NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE

## Unified Workflow

```
FAST TRACK (small-medium features):
/superspec:kickoff      →  All-in-one: brainstorm + validate + plan

FULL WORKFLOW (large features, team review):
/superspec:brainstorm   →  Progressive design (Explore → Propose → Spec)
        ↓
superspec validate      →  Validate specs (CLI) + team review
        ↓
/superspec:plan         →  Create TDD implementation plan

THEN CONTINUE (both paths):
/superspec:execute      →  Subagent-driven TDD implementation
        ↓
/superspec:verify       →  Verify implementation matches specs
        ↓
/superspec:finish-branch → Complete branch (merge/PR)
        ↓
/superspec:archive      →  Archive changes, apply Delta
```

### Four-Phase Brainstorming

1. **EXPLORE** - Free exploration, clarify the problem
2. **PROPOSE** - Define Why + What → `proposal.md`
3. **DESIGN** - Technical solution design → `design.md` (required)
4. **SPEC** - Define Requirements + Scenarios → `specs/*.md`

### Implementation Flow (execute)

- Use TDD: RED → GREEN → REFACTOR
- Each Scenario maps to a test case
- Two-stage review: Spec Compliance → Code Quality

## Directory Structure

```
superspec/
├── specs/                    # Main specifications (archived changes)
│   └── [capability]/
│       └── spec.md
│
└── changes/                  # Change management
    ├── [change-id]/          # In-progress changes
    │   ├── proposal.md       # Phase 2: Why + What
    │   ├── design.md         # Phase 3: How (required)
    │   ├── specs/            # Phase 4: Delta specs
    │   ├── plan.md           # Implementation plan
    │   └── tasks.md          # Task list
    │
    └── archive/              # Completed changes
        └── YYYY-MM-DD-[id]/
```

## Skill System

### Design Phase
- `/superspec:kickoff` - **Fast track**: idea to plan in one session
- `/superspec:brainstorm` - **Full workflow**: four-phase progressive design

### Planning Phase
- `/superspec:plan` - Create TDD implementation plan
- `git-worktree` - Git Worktree management

### Implementation Phase
- `/superspec:execute` - Execute plan (subagent-driven, default)
- `executing-plans` - Batch execution with checkpoints (alternative)
- `dispatching-parallel-agents` - For 2+ independent parallel tasks
- `tdd` - TDD cycle (with testing-anti-patterns.md)
- `systematic-debugging` - Systematic debugging

### Quality & Discipline Phase
- `verification-before-completion` - Evidence before claims
- `receiving-code-review` - Handle review feedback professionally

### Review Phase
- `code-review` - Code review (with code-reviewer.md template)
- `spec-validation` - Specification validation

### Completion Phase
- `/superspec:verify` - Verify Spec-Test correspondence
- `/superspec:finish-branch` - Complete branch (merge/PR/keep/discard)
- `/superspec:archive` - Archive changes

## CLI Commands

```bash
# Initialize
superspec init [path]

# Query
superspec list                 # List changes
superspec list --specs         # List specifications
superspec show [item]          # Show details

# Validate & Verify
superspec validate [id]        # Validate specification
superspec validate [id] --strict
superspec verify [id]          # Verify implementation
superspec verify [id] --verbose

# Archive
superspec archive [id]         # Archive change
superspec archive [id] --yes   # Non-interactive
```

## Development Guidelines

### Git Branches
- Use git worktree for isolated development
- Branch naming: `feature/[change-id]`

### Commit Format
```
feat([capability]): [description]

Refs: superspec/changes/[id]/specs/[cap]/spec.md
Requirement: [Name]
Scenario: [Name]
```

### Code Review
1. Spec Compliance Review - Does it meet the specification?
2. Code Quality Review - Code quality check

## Project Settings

### Worktree Directory
Use `.worktrees/` as worktree directory (added to .gitignore)

### Tech Stack
- TypeScript
- Vitest (testing)
- Commander (CLI)
- Zod (Schema validation)
