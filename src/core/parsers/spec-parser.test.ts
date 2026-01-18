import { describe, it, expect } from 'vitest';
import { parseSpec, parseDeltaSpec, serializeSpec } from './spec-parser.js';

describe('parseSpec', () => {
  it('should parse a complete spec', () => {
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

#### Scenario: Invalid login rejected
- **WHEN** user provides invalid password
- **THEN** login is rejected
- **AND** error message is shown

### Requirement: Session Management

The system SHALL manage user sessions securely.

#### Scenario: Session expires
- **WHEN** session timeout is reached
- **THEN** user is logged out
`;

    const spec = parseSpec(content);

    expect(spec.title).toBe('User Authentication');
    expect(spec.requirements).toHaveLength(2);

    const loginReq = spec.requirements[0]!;
    expect(loginReq.name).toBe('User Login');
    expect(loginReq.scenarios).toHaveLength(2);

    const validLogin = loginReq.scenarios[0]!;
    expect(validLogin.name).toBe('Valid login accepted');
    expect(validLogin.when).toBe('user provides valid username and password');
    expect(validLogin.then).toContain('user is granted access');
    expect(validLogin.and).toContain('session is created');

    const sessionReq = spec.requirements[1]!;
    expect(sessionReq.name).toBe('Session Management');
    expect(sessionReq.scenarios).toHaveLength(1);
  });

  it('should parse spec with frontmatter', () => {
    const content = `---
version: 1
capability: auth
---
# Auth Specification

## Requirements

### Requirement: Test

#### Scenario: Test scenario
- **WHEN** something
- **THEN** result
`;

    const spec = parseSpec(content);

    expect(spec.title).toBe('Auth');
    expect(spec.metadata).toEqual({ version: 1, capability: 'auth' });
  });
});

describe('parseDeltaSpec', () => {
  it('should parse ADDED requirements', () => {
    const content = `## ADDED Requirements

### Requirement: New Feature

The system SHALL support new feature.

#### Scenario: Feature works
- **WHEN** user activates feature
- **THEN** feature is activated
`;

    const delta = parseDeltaSpec(content);

    expect(delta.added).toHaveLength(1);
    expect(delta.added[0]!.name).toBe('New Feature');
    expect(delta.added[0]!.scenarios).toHaveLength(1);
  });

  it('should parse MODIFIED requirements', () => {
    const content = `## MODIFIED Requirements

### Requirement: Existing Feature

The system SHALL support updated behavior.

#### Scenario: Updated behavior
- **WHEN** user uses feature
- **THEN** new behavior occurs
`;

    const delta = parseDeltaSpec(content);

    expect(delta.modified).toHaveLength(1);
    expect(delta.modified[0]!.name).toBe('Existing Feature');
  });

  it('should parse REMOVED requirements', () => {
    const content = `## REMOVED Requirements

### Requirement: Old Feature
**Reason**: No longer needed
**Migration**: Use new feature instead
`;

    const delta = parseDeltaSpec(content);

    expect(delta.removed).toHaveLength(1);
    expect(delta.removed[0]!.name).toBe('Old Feature');
    expect(delta.removed[0]!.reason).toBe('No longer needed');
    expect(delta.removed[0]!.migration).toBe('Use new feature instead');
  });

  it('should parse RENAMED requirements', () => {
    const content = `## RENAMED Requirements

- FROM: \`### Requirement: Old Name\`
- TO: \`### Requirement: New Name\`
`;

    const delta = parseDeltaSpec(content);

    expect(delta.renamed).toHaveLength(1);
    expect(delta.renamed[0]!.from).toBe('Old Name');
    expect(delta.renamed[0]!.to).toBe('New Name');
  });

  it('should parse mixed delta operations', () => {
    const content = `## ADDED Requirements

### Requirement: Feature A

#### Scenario: A works
- **WHEN** A
- **THEN** B

## MODIFIED Requirements

### Requirement: Feature B

#### Scenario: B updated
- **WHEN** C
- **THEN** D

## REMOVED Requirements

### Requirement: Feature C
**Reason**: Deprecated

## RENAMED Requirements

- FROM: \`### Requirement: Feature D\`
- TO: \`### Requirement: Feature E\`
`;

    const delta = parseDeltaSpec(content);

    expect(delta.added).toHaveLength(1);
    expect(delta.modified).toHaveLength(1);
    expect(delta.removed).toHaveLength(1);
    expect(delta.renamed).toHaveLength(1);
  });
});

describe('serializeSpec', () => {
  it('should serialize spec back to markdown', () => {
    const spec = {
      title: 'Test',
      purpose: 'Testing purposes',
      requirements: [
        {
          name: 'Test Requirement',
          description: 'The system SHALL test.',
          scenarios: [
            {
              name: 'Test scenario',
              when: 'testing',
              then: ['result'],
              and: ['additional'],
            },
          ],
        },
      ],
    };

    const markdown = serializeSpec(spec);

    expect(markdown).toContain('# Test Specification');
    expect(markdown).toContain('## Purpose');
    expect(markdown).toContain('Testing purposes');
    expect(markdown).toContain('### Requirement: Test Requirement');
    expect(markdown).toContain('#### Scenario: Test scenario');
    expect(markdown).toContain('- **WHEN** testing');
    expect(markdown).toContain('- **THEN** result');
    expect(markdown).toContain('- **AND** additional');
  });
});
