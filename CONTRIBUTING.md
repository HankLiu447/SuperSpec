# Contributing to SuperSpec

Thank you for your interest in contributing to SuperSpec! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Commit Message Format](#commit-message-format)

## Code of Conduct

Please be respectful and constructive in all interactions. We are committed to providing a welcoming and inclusive environment for everyone.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/superspec.git
   cd superspec
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Build the project**:
   ```bash
   npm run build
   ```
5. **Run tests** to ensure everything works:
   ```bash
   npm test
   ```

## Development Workflow

SuperSpec follows its own methodology! We practice what we preach:

### For New Features

```bash
# 1. Create a new branch
git checkout -b feature/your-feature-name

# 2. Use SuperSpec workflow (recommended)
superspec kickoff    # Design your feature with specs

# 3. Implement with TDD
superspec execute    # Follow RED → GREEN → REFACTOR

# 4. Verify implementation
superspec verify     # Ensure specs match tests
```

### For Bug Fixes

1. Create a branch: `git checkout -b fix/issue-description`
2. Write a failing test that reproduces the bug
3. Fix the bug
4. Ensure all tests pass
5. Submit a pull request

## Pull Request Process

1. **Update documentation** if you're changing functionality
2. **Add tests** for new features or bug fixes
3. **Run the full test suite**: `npm test`
4. **Run type checking**: `npm run typecheck`
5. **Run linting**: `npm run lint`
6. **Update CHANGELOG.md** with your changes under "Unreleased"
7. **Create a Pull Request** with a clear description

### PR Title Format

Use conventional commit format:
- `feat: add new validation rule`
- `fix: resolve parsing error for nested scenarios`
- `docs: update installation instructions`
- `test: add tests for CLI commands`
- `refactor: simplify spec parser logic`

## Coding Standards

### TypeScript

- Use TypeScript strict mode (already configured)
- Prefer explicit types over `any`
- Use Zod schemas for runtime validation
- Follow existing code patterns

### File Structure

```
src/
├── cli/          # CLI commands and UI
├── core/         # Core logic (parsers, validators)
└── index.ts      # Main exports
```

### Naming Conventions

- Files: `kebab-case.ts`
- Classes: `PascalCase`
- Functions/variables: `camelCase`
- Constants: `SCREAMING_SNAKE_CASE`

## Testing Requirements

- **All new features** must have corresponding tests
- **Bug fixes** should include a regression test
- **Maintain test coverage** above 80%

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test -- --watch
```

### Test File Location

- Place test files next to the source file
- Use `.test.ts` suffix: `spec-parser.test.ts`

## Commit Message Format

Follow the conventional commits specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(parser): add support for Given/When/Then syntax

fix(validator): handle empty scenario blocks correctly

docs(readme): add installation instructions for Windows

test(cli): add integration tests for validate command
```

### SuperSpec-Specific Format

When implementing specs, use:

```
feat([capability]): [description]

Refs: superspec/changes/[id]/specs/[cap]/spec.md
Requirement: [Name]
Scenario: [Name]
```

## Questions?

- Open an [issue](https://github.com/HankLiu447/superspec/issues) for bugs or feature requests
- Start a [discussion](https://github.com/HankLiu447/superspec/discussions) for questions

Thank you for contributing! 🎉
