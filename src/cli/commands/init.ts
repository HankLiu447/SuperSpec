import { existsSync, mkdirSync, writeFileSync, symlinkSync, readlinkSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { homedir } from 'os';
import {
  PALETTE,
  BANNER,
  SYMBOLS,
  startSpinner,
  spinnerSuccess,
  spinnerFail,
  confirmPrompt,
  displaySuccess,
  displaySection,
  displayTree,
  sectionDivider,
  numberedItem,
} from '../ui/index.js';

// Get the SuperSpec package root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SUPERSPEC_ROOT = resolve(__dirname, '..', '..', '..');
const SKILLS_SOURCE = join(SUPERSPEC_ROOT, 'skills');

// Skill mappings: global name -> source directory
const SKILL_MAPPINGS: Record<string, string> = {
  // Core SuperSpec workflow
  'superspec:brainstorm': 'brainstorm',
  'superspec:plan': 'plan-writing',
  'superspec:execute': 'subagent-development',
  'superspec:verify': 'verify',
  'superspec:archive': 'archive',
  'superspec:finish-branch': 'finish-branch',
  // Development skills
  'tdd': 'tdd',
  'git-worktree': 'git-worktree',
  'systematic-debugging': 'systematic-debugging',
  'code-review': 'code-review',
  // Quality & discipline skills
  'verification-before-completion': 'verification-before-completion',
  'receiving-code-review': 'receiving-code-review',
  // Execution skills
  'dispatching-parallel-agents': 'dispatching-parallel-agents',
  'executing-plans': 'executing-plans',
  // Other skills
  'spec-validation': 'spec-validation',
  'using-superspec': 'using-superspec',
};

interface InitOptions {
  force?: boolean;
}

/**
 * Install SuperSpec skills to global Claude Code skills directory
 */
async function installGlobalSkills(): Promise<{ installed: string[]; skipped: string[]; failed: string[] }> {
  const globalSkillsDir = join(homedir(), '.claude', 'skills');
  const result = { installed: [] as string[], skipped: [] as string[], failed: [] as string[] };

  // Create global skills directory if it doesn't exist
  if (!existsSync(globalSkillsDir)) {
    mkdirSync(globalSkillsDir, { recursive: true });
  }

  // Check if skills source exists
  if (!existsSync(SKILLS_SOURCE)) {
    console.log(PALETTE.warning(`${SYMBOLS.warning} Skills directory not found at ${SKILLS_SOURCE}`));
    return result;
  }

  // Install each skill
  for (const [globalName, sourceName] of Object.entries(SKILL_MAPPINGS)) {
    const sourcePath = join(SKILLS_SOURCE, sourceName);
    const targetPath = join(globalSkillsDir, globalName);

    try {
      // Skip if source doesn't exist
      if (!existsSync(sourcePath)) {
        result.skipped.push(globalName);
        continue;
      }

      // Check if already linked correctly
      if (existsSync(targetPath)) {
        try {
          const existingLink = readlinkSync(targetPath);
          if (existingLink === sourcePath) {
            result.skipped.push(globalName);
            continue;
          }
        } catch {
          // Not a symlink, skip
          result.skipped.push(globalName);
          continue;
        }
      }

      // Create symlink
      symlinkSync(sourcePath, targetPath);
      result.installed.push(globalName);
    } catch (error) {
      result.failed.push(globalName);
    }
  }

  return result;
}

export async function initCommand(path: string, options: InitOptions): Promise<void> {
  const projectPath = resolve(path);
  const superspecPath = join(projectPath, 'superspec');

  // Display banner
  console.log(BANNER);

  // Check if already initialized
  if (existsSync(superspecPath) && !options.force) {
    console.log(PALETTE.warning(`${SYMBOLS.warning} SuperSpec already initialized in this directory.`));
    console.log();

    const proceed = await confirmPrompt({
      message: 'Reinitialize? This will overwrite existing configuration.',
      default: false,
    });

    if (!proceed) {
      console.log(PALETTE.midGray('Initialization cancelled.'));
      return;
    }
  }

  // Start initialization
  console.log();
  const spinner = startSpinner('Creating SuperSpec structure...');

  try {
    // Create directory structure
    const directories = [
      'superspec',
      'superspec/specs',
      'superspec/changes',
      'superspec/changes/archive',
    ];

    for (const dir of directories) {
      const dirPath = join(projectPath, dir);
      if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true });
      }
    }

    // Create .gitkeep files
    const gitkeeps = [
      'superspec/specs/.gitkeep',
      'superspec/changes/.gitkeep',
      'superspec/changes/archive/.gitkeep',
    ];

    for (const gitkeep of gitkeeps) {
      const gitkeepPath = join(projectPath, gitkeep);
      if (!existsSync(gitkeepPath)) {
        writeFileSync(gitkeepPath, '');
      }
    }

    // Create project config
    const configPath = join(superspecPath, 'project.yaml');
    const projectName = path === '.' ? 'my-project' : path;
    const config = `# SuperSpec Project Configuration
version: 1

# Project settings
project:
  name: ${projectName}

# Workflow settings
workflow:
  require_design: true
  require_validation: true
  strict_mode: false

# Git settings
git:
  worktree_dir: .worktrees
  branch_prefix: feature/

# Test settings
test:
  command: npm test
  coverage: false
`;
    writeFileSync(configPath, config);

    spinnerSuccess(spinner, 'SuperSpec structure created');

    // Install global skills for Claude Code
    const skillsInstalled = await installGlobalSkills();

    // Display success message
    console.log();
    console.log(`${PALETTE.success(SYMBOLS.success)} ${PALETTE.bold(PALETTE.success('Initialization complete!'))}`);

    // Display structure
    console.log();
    console.log(sectionDivider());
    displaySection('Directory Structure');
    console.log();
    displayTree([
      {
        name: PALETTE.primary('superspec/'),
        children: [
          `${PALETTE.cyan('specs/')}           ${PALETTE.midGray('<- Main specifications')}`,
          `${PALETTE.cyan('changes/')}         ${PALETTE.midGray('<- Active changes')}`,
          `${PALETTE.cyan('  +-- archive/')}    ${PALETTE.midGray('<- Completed changes')}`,
          `${PALETTE.white('project.yaml')}     ${PALETTE.midGray('<- Configuration')}`,
        ]
      }
    ]);

    // Display skills installation result
    console.log();
    console.log(sectionDivider());
    displaySection('Claude Code Skills');
    console.log();
    if (skillsInstalled.installed.length > 0) {
      console.log(`  ${PALETTE.success(SYMBOLS.success)} Installed: ${skillsInstalled.installed.join(', ')}`);
    }
    if (skillsInstalled.skipped.length > 0) {
      console.log(`  ${PALETTE.midGray(SYMBOLS.info)} Already installed: ${skillsInstalled.skipped.length} skills`);
    }
    if (skillsInstalled.failed.length > 0) {
      console.log(`  ${PALETTE.warning(SYMBOLS.warning)} Failed: ${skillsInstalled.failed.join(', ')}`);
    }
    console.log();
    console.log(PALETTE.midGray(`  Skills installed to: ~/.claude/skills/`));

    // Next steps
    console.log();
    console.log(sectionDivider());
    displaySection('🚀 Next Steps');
    console.log();
    console.log(numberedItem(1, `Start a new change with ${PALETTE.bold(PALETTE.white('/superspec:brainstorm'))}`));
    console.log(numberedItem(2, `Or run ${PALETTE.white('superspec view')} to see the dashboard`));
    console.log();
    console.log(PALETTE.midGray('  Tip: Use Claude Code to brainstorm and design your changes!'));
    console.log();

  } catch (error) {
    spinnerFail(spinner, 'Failed to initialize SuperSpec');
    throw error;
  }
}
