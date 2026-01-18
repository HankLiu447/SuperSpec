# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial public release preparation
- LICENSE file (MIT)
- CONTRIBUTING.md guidelines
- GitHub Actions CI/CD workflow
- ESLint and Prettier configuration

## [0.1.0] - 2024-01-18

### Added
- **Core Framework**
  - Spec-driven development workflow
  - Four-phase brainstorming: Explore → Propose → Design → Spec
  - TDD implementation cycle: RED → GREEN → REFACTOR

- **CLI Commands**
  - `superspec init` - Initialize SuperSpec in a project
  - `superspec list` - List changes and specifications
  - `superspec show` - Show details of a change or spec
  - `superspec validate` - Validate specifications
  - `superspec verify` - Verify implementation matches specs
  - `superspec archive` - Archive completed changes

- **Specification System**
  - Markdown-based specification format
  - Requirement and Scenario definitions
  - Given/When/Then syntax support
  - Spec validation with strict mode

- **Skills System**
  - `/superspec:kickoff` - Fast track brainstorming
  - `/superspec:brainstorm` - Full workflow brainstorming
  - `/superspec:plan` - Create implementation plans
  - `/superspec:execute` - Subagent-driven TDD implementation
  - `/superspec:verify` - Verify spec-test correspondence
  - `/superspec:finish-branch` - Complete branch workflow
  - `/superspec:archive` - Archive changes

- **Documentation**
  - Comprehensive README
  - Detailed DESIGN.md
  - CLAUDE.md project instructions

[Unreleased]: https://github.com/HankLiu447/superspec/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/HankLiu447/superspec/releases/tag/v0.1.0
