/**
 * SuperSpec - Unified Spec-Driven Development Framework
 *
 * Core Principle:
 * Every Scenario becomes a test, every test traces to a Scenario.
 *
 * @module superspec
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Core exports
export { validateSpec, validateSpecSet } from './core/validation/spec-validator.js';
export type { ValidationResult, ValidationIssue } from './core/validation/spec-validator.js';

export { parseSpec, parseDeltaSpec, serializeSpec } from './core/parsers/spec-parser.js';
export type { Spec, DeltaSpec, Requirement, Scenario } from './core/parsers/spec-parser.js';

export { loadProjectConfig, getDefaultConfig, serializeConfig } from './core/config/project-config.js';
export type { ProjectConfig } from './core/config/project-config.js';

/**
 * SuperSpec version - read from package.json
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf-8'));
export const VERSION: string = packageJson.version;

/**
 * Core principles (Iron Laws)
 */
export const IRON_LAWS = {
  TDD: 'NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST',
  SPECS: 'SPECS ARE TRUTH. CHANGES ARE PROPOSALS.',
  SUPERSPEC: 'EVERY SCENARIO BECOMES A TEST. EVERY TEST TRACES TO A SCENARIO.',
} as const;

/**
 * Workflow phases
 */
export const WORKFLOW_PHASES = [
  'brainstorm',
  'plan',
  'execute',
  'verify',
  'archive',
] as const;

/**
 * Brainstorm sub-phases
 */
export const BRAINSTORM_PHASES = [
  'explore',
  'propose',
  'design',
  'spec',
] as const;
