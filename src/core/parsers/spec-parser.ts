/**
 * Spec Parser Module
 *
 * Parses spec documents into structured data.
 */

import matter from 'gray-matter';

export interface Scenario {
  name: string;
  when: string;
  then: string[];
  and: string[];
}

export interface Requirement {
  name: string;
  description: string;
  scenarios: Scenario[];
}

export interface Spec {
  title: string;
  purpose?: string;
  requirements: Requirement[];
  metadata?: Record<string, unknown>;
}

export interface DeltaSpec {
  added: Requirement[];
  modified: Requirement[];
  removed: { name: string; reason?: string; migration?: string }[];
  renamed: { from: string; to: string }[];
}

/**
 * Parse a spec document into structured data
 */
export function parseSpec(content: string): Spec {
  const { data, content: body } = matter(content);
  const lines = body.split('\n');

  const spec: Spec = {
    title: '',
    requirements: [],
    metadata: data,
  };

  let currentRequirement: Requirement | null = null;
  let currentScenario: Scenario | null = null;
  let inDescription = false;
  let descriptionLines: string[] = [];

  for (const line of lines) {
    // Title
    const titleMatch = line.match(/^# (.+)$/);
    if (titleMatch?.[1]) {
      spec.title = titleMatch[1].replace(/\s*Specification\s*$/i, '').trim();
      continue;
    }

    // Purpose
    const purposeMatch = line.match(/^## Purpose\s*$/);
    if (purposeMatch) {
      inDescription = false;
      continue;
    }

    // Requirements section
    if (line.match(/^## Requirements\s*$/)) {
      inDescription = false;
      continue;
    }

    // Requirement
    const reqMatch = line.match(/^### Requirement: (.+)$/);
    if (reqMatch?.[1]) {
      // Save previous
      if (currentRequirement) {
        if (currentScenario) {
          currentRequirement.scenarios.push(currentScenario);
        }
        currentRequirement.description = descriptionLines.join('\n').trim();
        spec.requirements.push(currentRequirement);
      }

      currentRequirement = {
        name: reqMatch[1],
        description: '',
        scenarios: [],
      };
      currentScenario = null;
      inDescription = true;
      descriptionLines = [];
      continue;
    }

    // Scenario
    const scenarioMatch = line.match(/^#### Scenario: (.+)$/);
    if (scenarioMatch?.[1]) {
      // Save previous scenario
      if (currentScenario && currentRequirement) {
        currentRequirement.scenarios.push(currentScenario);
      }
      if (currentRequirement && inDescription) {
        currentRequirement.description = descriptionLines.join('\n').trim();
        inDescription = false;
      }

      currentScenario = {
        name: scenarioMatch[1],
        when: '',
        then: [],
        and: [],
      };
      continue;
    }

    // WHEN
    const whenMatch = line.match(/^\s*-\s*\*\*WHEN\*\*\s*(.+)$/);
    if (whenMatch?.[1] && currentScenario) {
      currentScenario.when = whenMatch[1];
      continue;
    }

    // THEN
    const thenMatch = line.match(/^\s*-\s*\*\*THEN\*\*\s*(.+)$/);
    if (thenMatch?.[1] && currentScenario) {
      currentScenario.then.push(thenMatch[1]);
      continue;
    }

    // AND
    const andMatch = line.match(/^\s*-\s*\*\*AND\*\*\s*(.+)$/);
    if (andMatch?.[1] && currentScenario) {
      currentScenario.and.push(andMatch[1]);
      continue;
    }

    // Description lines
    if (inDescription && line.trim()) {
      descriptionLines.push(line);
    }
  }

  // Don't forget the last ones
  if (currentRequirement) {
    if (currentScenario) {
      currentRequirement.scenarios.push(currentScenario);
    }
    if (inDescription) {
      currentRequirement.description = descriptionLines.join('\n').trim();
    }
    spec.requirements.push(currentRequirement);
  }

  return spec;
}

/**
 * Parse a delta spec document
 */
export function parseDeltaSpec(content: string): DeltaSpec {
  const delta: DeltaSpec = {
    added: [],
    modified: [],
    removed: [],
    renamed: [],
  };

  const lines = content.split('\n');
  let currentSection: 'added' | 'modified' | 'removed' | 'renamed' | null = null;
  let currentRequirement: Requirement | null = null;
  let currentScenario: Scenario | null = null;
  let currentRemoved: { name: string; reason?: string; migration?: string } | null = null;

  // Helper to save current state before section change
  const saveCurrentState = () => {
    if (currentRequirement) {
      if (currentScenario) {
        currentRequirement.scenarios.push(currentScenario);
        currentScenario = null;
      }
      if (currentSection === 'added') {
        delta.added.push(currentRequirement);
      } else if (currentSection === 'modified') {
        delta.modified.push(currentRequirement);
      }
      currentRequirement = null;
    }
    if (currentRemoved) {
      delta.removed.push(currentRemoved);
      currentRemoved = null;
    }
  };

  for (const line of lines) {
    // Section headers - save state before changing section
    if (line.match(/^## ADDED Requirements/i)) {
      saveCurrentState();
      currentSection = 'added';
      continue;
    }
    if (line.match(/^## MODIFIED Requirements/i)) {
      saveCurrentState();
      currentSection = 'modified';
      continue;
    }
    if (line.match(/^## REMOVED Requirements/i)) {
      saveCurrentState();
      currentSection = 'removed';
      continue;
    }
    if (line.match(/^## RENAMED Requirements/i)) {
      saveCurrentState();
      currentSection = 'renamed';
      continue;
    }

    // Requirement
    const reqMatch = line.match(/^### Requirement: (.+)$/);
    if (reqMatch?.[1] && currentSection) {
      // Save previous
      if (currentRequirement && (currentSection === 'added' || currentSection === 'modified')) {
        if (currentScenario) {
          currentRequirement.scenarios.push(currentScenario);
        }
        if (currentSection === 'added') {
          delta.added.push(currentRequirement);
        } else {
          delta.modified.push(currentRequirement);
        }
      }
      if (currentRemoved && currentSection === 'removed') {
        delta.removed.push(currentRemoved);
      }

      if (currentSection === 'removed') {
        currentRemoved = { name: reqMatch[1] };
        currentRequirement = null;
      } else {
        currentRequirement = {
          name: reqMatch[1],
          description: '',
          scenarios: [],
        };
        currentRemoved = null;
      }
      currentScenario = null;
      continue;
    }

    // Reason/Migration for removed
    if (currentSection === 'removed' && currentRemoved) {
      const reasonMatch = line.match(/^\*\*Reason\*\*:\s*(.+)$/);
      if (reasonMatch?.[1]) {
        currentRemoved.reason = reasonMatch[1];
        continue;
      }
      const migrationMatch = line.match(/^\*\*Migration\*\*:\s*(.+)$/);
      if (migrationMatch?.[1]) {
        currentRemoved.migration = migrationMatch[1];
        continue;
      }
    }

    // Renamed
    if (currentSection === 'renamed') {
      const fromMatch = line.match(/^- FROM:.*`### Requirement: (.+)`/);
      const toMatch = line.match(/^- TO:.*`### Requirement: (.+)`/);

      if (fromMatch?.[1]) {
        delta.renamed.push({ from: fromMatch[1], to: '' });
      }
      if (toMatch?.[1] && delta.renamed.length > 0) {
        const last = delta.renamed[delta.renamed.length - 1];
        if (last) {
          last.to = toMatch[1];
        }
      }
      continue;
    }

    // Scenario (for added/modified)
    const scenarioMatch = line.match(/^#### Scenario: (.+)$/);
    if (scenarioMatch?.[1] && currentRequirement) {
      if (currentScenario) {
        currentRequirement.scenarios.push(currentScenario);
      }
      currentScenario = {
        name: scenarioMatch[1],
        when: '',
        then: [],
        and: [],
      };
      continue;
    }

    // WHEN/THEN/AND
    if (currentScenario) {
      const whenMatch = line.match(/^\s*-\s*\*\*WHEN\*\*\s*(.+)$/);
      if (whenMatch?.[1]) {
        currentScenario.when = whenMatch[1];
        continue;
      }
      const thenMatch = line.match(/^\s*-\s*\*\*THEN\*\*\s*(.+)$/);
      if (thenMatch?.[1]) {
        currentScenario.then.push(thenMatch[1]);
        continue;
      }
      const andMatch = line.match(/^\s*-\s*\*\*AND\*\*\s*(.+)$/);
      if (andMatch?.[1]) {
        currentScenario.and.push(andMatch[1]);
        continue;
      }
    }
  }

  // Don't forget the last ones
  if (currentRequirement) {
    if (currentScenario) {
      currentRequirement.scenarios.push(currentScenario);
    }
    if (currentSection === 'added') {
      delta.added.push(currentRequirement);
    } else if (currentSection === 'modified') {
      delta.modified.push(currentRequirement);
    }
  }
  if (currentRemoved && currentSection === 'removed') {
    delta.removed.push(currentRemoved);
  }

  return delta;
}

/**
 * Serialize a spec back to markdown
 */
export function serializeSpec(spec: Spec): string {
  const lines: string[] = [];

  // Title
  lines.push(`# ${spec.title} Specification`);
  lines.push('');

  // Purpose
  if (spec.purpose) {
    lines.push('## Purpose');
    lines.push('');
    lines.push(spec.purpose);
    lines.push('');
  }

  // Requirements
  lines.push('## Requirements');
  lines.push('');

  for (const req of spec.requirements) {
    lines.push(`### Requirement: ${req.name}`);
    lines.push('');
    if (req.description) {
      lines.push(req.description);
      lines.push('');
    }

    for (const scenario of req.scenarios) {
      lines.push(`#### Scenario: ${scenario.name}`);
      lines.push(`- **WHEN** ${scenario.when}`);
      for (const then of scenario.then) {
        lines.push(`- **THEN** ${then}`);
      }
      for (const and of scenario.and) {
        lines.push(`- **AND** ${and}`);
      }
      lines.push('');
    }
  }

  return lines.join('\n');
}
