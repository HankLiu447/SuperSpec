/**
 * Spec Validation Module
 *
 * Validates spec documents for structure, content, consistency, and completeness.
 */

export interface ValidationIssue {
  type: 'error' | 'warning';
  code: string;
  message: string;
  line?: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  stats: {
    requirements: number;
    scenarios: number;
  };
}

/**
 * Validate a spec document
 */
export function validateSpec(
  content: string,
  name: string,
  isDelta: boolean = false
): ValidationResult {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  const lines = content.split('\n');

  let requirementCount = 0;
  let scenarioCount = 0;
  let currentRequirement: string | null = null;
  let currentScenario: string | null = null;
  let hasWhen = false;
  let hasThen = false;
  let seenRequirements = new Set<string>();
  let seenScenarios = new Set<string>();

  // Check header
  const hasTitle = lines.some(l => l.match(/^# .+/));
  if (!hasTitle && !isDelta) {
    errors.push({
      type: 'error',
      code: 'MISSING_TITLE',
      message: 'Spec must have a title (# header)',
    });
  }

  // Check Purpose section (not required for delta)
  const hasPurpose = content.includes('## Purpose');
  if (!hasPurpose && !isDelta) {
    warnings.push({
      type: 'warning',
      code: 'MISSING_PURPOSE',
      message: 'Spec should have a Purpose section',
    });
  }

  // Parse line by line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? '';
    const lineNum = i + 1;

    // Check for requirement
    const reqMatch = line.match(/^### Requirement: (.+)$/);
    if (reqMatch?.[1]) {
      // Save previous scenario state
      if (currentScenario && !hasWhen) {
        errors.push({
          type: 'error',
          code: 'MISSING_WHEN',
          message: `Scenario "${currentScenario}" is missing WHEN clause`,
        });
      }
      if (currentScenario && !hasThen) {
        errors.push({
          type: 'error',
          code: 'MISSING_THEN',
          message: `Scenario "${currentScenario}" is missing THEN clause`,
        });
      }

      // Check for duplicate requirement
      if (seenRequirements.has(reqMatch[1])) {
        errors.push({
          type: 'error',
          code: 'DUPLICATE_REQUIREMENT',
          message: `Duplicate requirement name: "${reqMatch[1]}"`,
          line: lineNum,
        });
      }

      seenRequirements.add(reqMatch[1]);
      currentRequirement = reqMatch[1];
      currentScenario = null;
      hasWhen = false;
      hasThen = false;
      requirementCount++;
      continue;
    }

    // Check for scenario
    const scenarioMatch = line.match(/^#### Scenario: (.+)$/);
    if (scenarioMatch?.[1]) {
      // Save previous scenario state
      if (currentScenario && !hasWhen) {
        errors.push({
          type: 'error',
          code: 'MISSING_WHEN',
          message: `Scenario "${currentScenario}" is missing WHEN clause`,
        });
      }
      if (currentScenario && !hasThen) {
        errors.push({
          type: 'error',
          code: 'MISSING_THEN',
          message: `Scenario "${currentScenario}" is missing THEN clause`,
        });
      }

      // Check if scenario is under a requirement
      if (!currentRequirement && !isDelta) {
        errors.push({
          type: 'error',
          code: 'ORPHAN_SCENARIO',
          message: `Scenario "${scenarioMatch[1]}" is not under a Requirement`,
          line: lineNum,
        });
      }

      // Check for duplicate scenario
      const scenarioKey = `${currentRequirement}/${scenarioMatch[1]}`;
      if (seenScenarios.has(scenarioKey)) {
        errors.push({
          type: 'error',
          code: 'DUPLICATE_SCENARIO',
          message: `Duplicate scenario name: "${scenarioMatch[1]}" under "${currentRequirement}"`,
          line: lineNum,
        });
      }

      seenScenarios.add(scenarioKey);
      currentScenario = scenarioMatch[1];
      hasWhen = false;
      hasThen = false;
      scenarioCount++;
      continue;
    }

    // Check for WHEN
    if (line.match(/^\s*-\s*\*\*WHEN\*\*/)) {
      if (!currentScenario) {
        errors.push({
          type: 'error',
          code: 'ORPHAN_WHEN',
          message: 'WHEN clause found outside of a Scenario',
          line: lineNum,
        });
      }
      hasWhen = true;
      continue;
    }

    // Check for THEN
    if (line.match(/^\s*-\s*\*\*THEN\*\*/)) {
      if (!currentScenario) {
        errors.push({
          type: 'error',
          code: 'ORPHAN_THEN',
          message: 'THEN clause found outside of a Scenario',
          line: lineNum,
        });
      }
      hasThen = true;
      continue;
    }

    // Check for weak language in requirements
    if (currentRequirement && !currentScenario) {
      if (line.match(/\bshould\b/i) && !line.match(/\bSHOULD\b/)) {
        warnings.push({
          type: 'warning',
          code: 'WEAK_LANGUAGE',
          message: 'Consider using SHALL/MUST for mandatory behavior',
          line: lineNum,
        });
      }
    }
  }

  // Check final scenario
  if (currentScenario && !hasWhen) {
    errors.push({
      type: 'error',
      code: 'MISSING_WHEN',
      message: `Scenario "${currentScenario}" is missing WHEN clause`,
    });
  }
  if (currentScenario && !hasThen) {
    errors.push({
      type: 'error',
      code: 'MISSING_THEN',
      message: `Scenario "${currentScenario}" is missing THEN clause`,
    });
  }

  // Check for requirements without scenarios
  if (!isDelta) {
    // This requires more complex parsing, skip for now
  }

  // Validate delta-specific rules
  if (isDelta) {
    validateDeltaSpec(content, errors, warnings);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    stats: {
      requirements: requirementCount,
      scenarios: scenarioCount,
    },
  };
}

function validateDeltaSpec(
  content: string,
  errors: ValidationIssue[],
  warnings: ValidationIssue[]
): void {
  // Check delta sections
  const hasDeltaSections =
    content.includes('## ADDED') ||
    content.includes('## MODIFIED') ||
    content.includes('## REMOVED') ||
    content.includes('## RENAMED');

  // If has MODIFIED section, warn about exact name matching
  if (content.includes('## MODIFIED')) {
    // Could add validation against main spec here
  }

  // If has REMOVED section, check for reason
  if (content.includes('## REMOVED')) {
    const removedSection = content.match(/## REMOVED Requirements[\s\S]*?(?=## |$)/);
    if (removedSection?.[0] && !removedSection[0].includes('**Reason**')) {
      warnings.push({
        type: 'warning',
        code: 'REMOVED_NO_REASON',
        message: 'REMOVED requirements should include a Reason',
      });
    }
  }
}

/**
 * Validate multiple specs for cross-spec consistency
 */
export function validateSpecSet(
  specs: Map<string, string>
): { valid: boolean; issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];
  const allRequirements = new Map<string, string>();

  for (const [name, content] of specs) {
    // Check for duplicate requirements across specs
    const reqMatches = content.matchAll(/^### Requirement: (.+)$/gm);
    for (const match of reqMatches) {
      if (match[1]) {
        if (allRequirements.has(match[1])) {
          issues.push({
            type: 'error',
            code: 'CROSS_SPEC_DUPLICATE',
            message: `Requirement "${match[1]}" exists in both "${allRequirements.get(match[1])}" and "${name}"`,
          });
        }
        allRequirements.set(match[1], name);
      }
    }
  }

  return {
    valid: issues.filter(i => i.type === 'error').length === 0,
    issues,
  };
}
