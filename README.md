<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/banner.svg">
  <source media="(prefers-color-scheme: light)" srcset=".github/banner.svg">
  <img src=".github/banner.svg" alt="SuperSpec - Spec-Driven Development Framework" width="100%">
</picture>

<br />

[![npm version](https://img.shields.io/npm/v/superspec?color=14b8a6&style=flat-square)](https://www.npmjs.com/package/superspec)
[![License: MIT](https://img.shields.io/badge/License-MIT-14b8a6.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-≥18.0.0-14b8a6?style=flat-square)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-14b8a6?style=flat-square)](https://www.typescriptlang.org/)
[![Claude Code](https://img.shields.io/badge/Claude_Code-Compatible-14b8a6?style=flat-square)](https://claude.ai/claude-code)

<br />

**Every Scenario becomes a test. Every test traces back to a Scenario.**

<br />

[Quick Start](#-quick-start) · [Documentation](#-documentation) · [CLI Reference](#-cli-commands) · [Contributing](#-contributing)

</div>

<br />

## Why SuperSpec?

Most development workflows suffer from **specification drift** — where documentation, tests, and code gradually become misaligned. SuperSpec solves this by establishing specifications as the **single source of truth** and enforcing bidirectional traceability between specs and tests.

<table>
<tr>
<td width="50%">

### ❌ Without SuperSpec

- Specs written once, then forgotten
- Tests don't match requirements
- "It works" without verification
- Changes break unknown features
- Documentation always outdated

</td>
<td width="50%">

### ✅ With SuperSpec

- Specs are living documents
- Every scenario = a test case
- Evidence-based completion
- Impact analysis before changes
- Documentation auto-maintained

</td>
</tr>
</table>

<br />

## ✨ Key Features

<table>
<tr>
<td align="center" width="25%">
<br />
<img src="https://img.icons8.com/fluency/48/document.png" width="36" />
<br /><br />
<strong>Spec-First</strong>
<br />
<sub>Specifications as single source of truth</sub>
<br /><br />
</td>
<td align="center" width="25%">
<br />
<img src="https://img.icons8.com/fluency/48/test-tube.png" width="36" />
<br /><br />
<strong>TDD Enforced</strong>
<br />
<sub>Write tests first, then implement</sub>
<br /><br />
</td>
<td align="center" width="25%">
<br />
<img src="https://img.icons8.com/fluency/48/artificial-intelligence.png" width="36" />
<br /><br />
<strong>AI-Powered</strong>
<br />
<sub>Claude Code skills integration</sub>
<br /><br />
</td>
<td align="center" width="25%">
<br />
<img src="https://img.icons8.com/fluency/48/checked-2.png" width="36" />
<br /><br />
<strong>Verified</strong>
<br />
<sub>Evidence before completion claims</sub>
<br /><br />
</td>
</tr>
</table>

<br />

## 🚀 Quick Start

```bash
# Install globally
npm install -g superspec

# Initialize in your project
cd your-project
superspec init

# Start developing with Claude Code
/superspec:kickoff
```

That's it! SuperSpec will guide you through the entire development workflow.

<br />

## 📖 Documentation

### The Four Iron Rules

| Rule | Principle |
|:-----|:----------|
| **TDD Rule** | No production code without a failing test first |
| **Spec Rule** | Specs are truth. Changes are proposals. |
| **SuperSpec Rule** | Every Scenario becomes a test. Every test traces to a Scenario. |
| **Verification Rule** | No completion claims without fresh verification evidence |

<br />

### Workflow Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│  Choose Your Path                                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  🚀 FAST TRACK (small-medium features)                              │
│     /superspec:kickoff  →  All-in-one: brainstorm + validate + plan │
│                                                                     │
│  📋 FULL WORKFLOW (large features, team review)                     │
│     /superspec:brainstorm  →  Progressive 4-phase design            │
│     superspec validate     →  CLI validation + team review          │
│     /superspec:plan        →  Create TDD implementation plan        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Implementation (both paths)                                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│     /superspec:execute        →  Subagent-driven TDD implementation │
│     /superspec:verify         →  Verify implementation matches specs│
│     /superspec:finish-branch  →  Complete branch (merge/PR)         │
│     /superspec:archive        →  Archive changes, apply delta       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

<br />

### Four-Phase Brainstorming

<details>
<summary><strong>Phase 1: EXPLORE</strong> — Understand the problem</summary>

- Free exploration and discovery
- Ask clarifying questions
- Visualize ideas and constraints
- No commitments yet

</details>

<details>
<summary><strong>Phase 2: PROPOSE</strong> — Define scope → <code>proposal.md</code></summary>

- **Why**: Problem or opportunity statement
- **What Changes**: List of modifications
- **Capabilities**: New or modified features
- **Impact**: Affected areas of the system

</details>

<details>
<summary><strong>Phase 3: DESIGN</strong> — Technical approach → <code>design.md</code></summary>

- Compare 2-3 technical approaches
- Document trade-offs
- Select and justify the recommended approach

</details>

<details>
<summary><strong>Phase 4: SPEC</strong> — Requirements & scenarios → <code>specs/*.md</code></summary>

- Define Requirements (`System SHALL...`)
- Define Scenarios (`WHEN/THEN` — each becomes a test)

</details>

<br />

## 💻 CLI Commands

### Project Management

```bash
superspec init [path]         # Initialize SuperSpec in a project
superspec view                # Dashboard overview
superspec list                # List all changes
superspec list --specs        # List all specifications
superspec show <item>         # Show details of a change or spec
```

### Validation & Verification

```bash
superspec validate <id>           # Validate a specification
superspec validate <id> --strict  # Strict mode (warnings = errors)
superspec verify <id>             # Verify implementation matches specs
superspec verify <id> --verbose   # Show detailed matching info
```

### Archiving

```bash
superspec archive <id>        # Archive completed change
superspec archive <id> --yes  # Skip confirmation
```

<br />

## 🤖 Claude Code Integration

SuperSpec provides skills that integrate seamlessly with [Claude Code](https://claude.ai/claude-code):

| Skill | Description |
|:------|:------------|
| `/superspec:kickoff` | Fast-track: brainstorm → validate → plan in one session |
| `/superspec:brainstorm` | Full workflow with 4-phase progressive design |
| `/superspec:plan` | Create TDD implementation plan |
| `/superspec:execute` | Subagent-driven TDD implementation |
| `/superspec:verify` | Verify implementation matches specifications |
| `/superspec:finish-branch` | Complete branch (merge, PR, or keep) |
| `/superspec:archive` | Archive changes and apply deltas to main specs |

### Additional Skills

| Skill | Description |
|:------|:------------|
| `tdd` | TDD cycle with anti-pattern awareness |
| `git-worktree` | Isolated development with git worktrees |
| `systematic-debugging` | Root cause analysis methodology |
| `code-review` | Two-phase review (spec compliance + quality) |
| `verification-before-completion` | Evidence-based completion claims |

<br />

## 📁 Project Structure

```
your-project/
├── superspec/
│   ├── project.yaml              # Project configuration
│   │
│   ├── specs/                    # 📚 Main specifications (source of truth)
│   │   └── <capability>/
│   │       └── spec.md
│   │
│   └── changes/                  # 📝 Change management
│       ├── <change-id>/          # Active changes
│       │   ├── proposal.md       # Why + What
│       │   ├── design.md         # How (technical approach)
│       │   ├── specs/            # Delta specifications
│       │   ├── plan.md           # TDD implementation plan
│       │   └── tasks.md          # Task tracking
│       │
│       └── archive/              # Completed changes
│           └── YYYY-MM-DD-<id>/
│
└── src/                          # Your application code
```

<br />

## 📝 Spec Format

```markdown
# Feature Name

## Purpose
Brief description of what this feature does and why it exists.

## Requirements

### Requirement: User Authentication
The system SHALL authenticate users with email and password.

#### Scenario: Successful Login
- **WHEN** user submits valid credentials
- **THEN** system grants access and returns session token

#### Scenario: Invalid Credentials
- **WHEN** user submits invalid credentials
- **THEN** system denies access with error message
```

### Spec → Test Mapping

```
Specification                          Test
─────────────────────────────────────────────────────────────────────
#### Scenario: Successful Login    →   test('Successful Login', () => {
- WHEN valid credentials                 const result = login(validCreds);
- THEN grants access                     expect(result.granted).toBe(true);
                                       });
─────────────────────────────────────────────────────────────────────
```

<br />

## 🔄 Two-Phase Review

SuperSpec enforces a two-phase review process:

```
┌────────────────────────────────────────┐
│  Phase 1: Spec Compliance Review       │
│  ──────────────────────────────────    │
│  ✓ Every Requirement implemented?      │
│  ✓ Every Scenario has a test?          │
│  ✓ No extra/missing features?          │
└────────────────────────────────────────┘
                    │
                    ▼ Pass to proceed
┌────────────────────────────────────────┐
│  Phase 2: Code Quality Review          │
│  ──────────────────────────────────    │
│  ✓ Error handling                      │
│  ✓ Type safety                         │
│  ✓ SOLID principles                    │
│  ✓ Test quality                        │
└────────────────────────────────────────┘
```

<br />

## 🛠 Installation

### From npm

```bash
npm install -g superspec
```

### From Source

```bash
git clone https://github.com/HankLiu447/superspec.git
cd superspec
npm install
npm run build
npm link
```

### Requirements

- Node.js ≥ 18.0.0
- npm ≥ 8.0.0
- [Claude Code](https://claude.ai/claude-code) (for AI-powered skills)

<br />

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Run tests (`npm test`)
4. Commit your changes (`git commit -m 'feat: add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

<br />

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<br />

---

<div align="center">

**⬡ SuperSpec** — Spec-Driven Development with TDD Discipline

<br />

[Report Bug](https://github.com/HankLiu447/superspec/issues) · [Request Feature](https://github.com/HankLiu447/superspec/issues) · [Discussions](https://github.com/HankLiu447/superspec/discussions)

<br />

Made with precision by [Hank Liu](https://github.com/HankLiu447)

</div>
