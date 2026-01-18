import { describe, it, expect } from 'vitest';
import { validateSpec, validateSpecSet } from './spec-validator.js';

describe('validateSpec', () => {
  describe('structure validation', () => {
    it('should pass for valid spec', () => {
      const content = `# User Authentication Specification

## Purpose

Provides secure user authentication.

## Requirements

### Requirement: User Login

The system SHALL authenticate users with valid credentials.

#### Scenario: Valid login accepted
- **WHEN** user provides valid username and password
- **THEN** user is granted access
- **AND** session is created
`;

      const result = validateSpec(content, 'user-auth', false);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.stats.requirements).toBe(1);
      expect(result.stats.scenarios).toBe(1);
    });

    it('should fail when missing title', () => {
      const content = `## Purpose

Some purpose.

## Requirements

### Requirement: Something

The system SHALL do something.

#### Scenario: Test
- **WHEN** something happens
- **THEN** result occurs
`;

      const result = validateSpec(content, 'test', false);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'MISSING_TITLE')).toBe(true);
    });

    it('should warn when missing purpose', () => {
      const content = `# Test Specification

## Requirements

### Requirement: Something

The system SHALL do something.

#### Scenario: Test
- **WHEN** something happens
- **THEN** result occurs
`;

      const result = validateSpec(content, 'test', false);
      expect(result.valid).toBe(true);
      expect(result.warnings.some(w => w.code === 'MISSING_PURPOSE')).toBe(true);
    });
  });

  describe('content validation', () => {
    it('should fail when scenario missing WHEN', () => {
      const content = `# Test Specification

## Requirements

### Requirement: Something

#### Scenario: Missing WHEN
- **THEN** result occurs
`;

      const result = validateSpec(content, 'test', false);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'MISSING_WHEN')).toBe(true);
    });

    it('should fail when scenario missing THEN', () => {
      const content = `# Test Specification

## Requirements

### Requirement: Something

#### Scenario: Missing THEN
- **WHEN** something happens
`;

      const result = validateSpec(content, 'test', false);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'MISSING_THEN')).toBe(true);
    });

    it('should fail on duplicate requirement names', () => {
      const content = `# Test Specification

## Requirements

### Requirement: Duplicate

The system SHALL do something.

#### Scenario: Test 1
- **WHEN** A
- **THEN** B

### Requirement: Duplicate

The system SHALL do something else.

#### Scenario: Test 2
- **WHEN** C
- **THEN** D
`;

      const result = validateSpec(content, 'test', false);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'DUPLICATE_REQUIREMENT')).toBe(true);
    });
  });

  describe('delta spec validation', () => {
    it('should allow delta specs without title', () => {
      const content = `## ADDED Requirements

### Requirement: New Feature

The system SHALL support new feature.

#### Scenario: Feature works
- **WHEN** user activates feature
- **THEN** feature is activated
`;

      const result = validateSpec(content, 'delta', true);
      expect(result.valid).toBe(true);
    });

    it('should warn when REMOVED missing reason', () => {
      const content = `## REMOVED Requirements

### Requirement: Old Feature
`;

      const result = validateSpec(content, 'delta', true);
      expect(result.warnings.some(w => w.code === 'REMOVED_NO_REASON')).toBe(true);
    });
  });
});

describe('validateSpecSet', () => {
  it('should detect cross-spec duplicate requirements', () => {
    const specs = new Map([
      ['auth', `# Auth
## Requirements
### Requirement: User Login
#### Scenario: Test
- **WHEN** A
- **THEN** B
`],
      ['security', `# Security
## Requirements
### Requirement: User Login
#### Scenario: Test
- **WHEN** C
- **THEN** D
`],
    ]);

    const result = validateSpecSet(specs);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === 'CROSS_SPEC_DUPLICATE')).toBe(true);
  });

  it('should pass when no duplicates', () => {
    const specs = new Map([
      ['auth', `# Auth
## Requirements
### Requirement: User Login
#### Scenario: Test
- **WHEN** A
- **THEN** B
`],
      ['security', `# Security
## Requirements
### Requirement: Access Control
#### Scenario: Test
- **WHEN** C
- **THEN** D
`],
    ]);

    const result = validateSpecSet(specs);
    expect(result.valid).toBe(true);
  });
});
