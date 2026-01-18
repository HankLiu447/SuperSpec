/**
 * Project Configuration Module
 *
 * Handles loading and managing project configuration.
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';

// Configuration schema
const ProjectConfigSchema = z.object({
  version: z.number().default(1),
  project: z.object({
    name: z.string(),
  }),
  workflow: z.object({
    require_design: z.boolean().default(true),
    require_validation: z.boolean().default(true),
    strict_mode: z.boolean().default(false),
  }).default({}),
  git: z.object({
    worktree_dir: z.string().default('.worktrees'),
    branch_prefix: z.string().default('feature/'),
  }).default({}),
  test: z.object({
    command: z.string().default('npm test'),
    coverage: z.boolean().default(false),
  }).default({}),
});

export type ProjectConfig = z.infer<typeof ProjectConfigSchema>;

/**
 * Load project configuration from superspec/project.yaml
 */
export function loadProjectConfig(projectPath: string = process.cwd()): ProjectConfig | null {
  const configPath = join(projectPath, 'superspec', 'project.yaml');

  if (!existsSync(configPath)) {
    return null;
  }

  try {
    const content = readFileSync(configPath, 'utf-8');
    const raw = parseYaml(content);
    return ProjectConfigSchema.parse(raw);
  } catch (err) {
    console.error('Error loading project configuration:', err);
    return null;
  }
}

/**
 * Get default configuration
 */
export function getDefaultConfig(projectName: string = 'my-project'): ProjectConfig {
  return ProjectConfigSchema.parse({
    version: 1,
    project: { name: projectName },
  });
}

/**
 * Serialize configuration to YAML
 */
export function serializeConfig(config: ProjectConfig): string {
  const lines = [
    '# SuperSpec Project Configuration',
    `version: ${config.version}`,
    '',
    '# Project settings',
    'project:',
    `  name: ${config.project.name}`,
    '',
    '# Workflow settings',
    'workflow:',
    `  require_design: ${config.workflow.require_design}`,
    `  require_validation: ${config.workflow.require_validation}`,
    `  strict_mode: ${config.workflow.strict_mode}`,
    '',
    '# Git settings',
    'git:',
    `  worktree_dir: ${config.git.worktree_dir}`,
    `  branch_prefix: ${config.git.branch_prefix}`,
    '',
    '# Test settings',
    'test:',
    `  command: ${config.test.command}`,
    `  coverage: ${config.test.coverage}`,
  ];

  return lines.join('\n') + '\n';
}
