import { existsSync, mkdirSync, writeFileSync, symlinkSync, readlinkSync, readFileSync } from 'fs';
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
  'superspec:kickoff': 'kickoff',
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

// CLAUDE.md managed block markers
const CLAUDE_MD_START = '<!-- SUPERSPEC:START -->';
const CLAUDE_MD_END = '<!-- SUPERSPEC:END -->';

// CLAUDE.md managed content
const CLAUDE_MD_CONTENT = `${CLAUDE_MD_START}
# SuperSpec Instructions

This project uses SuperSpec for spec-driven development with TDD discipline.

## Quick Reference

| Command | Description |
|---------|-------------|
| \`/superspec:kickoff\` | **Fast track**: brainstorm + validate + plan in one session |
| \`/superspec:brainstorm\` | **Full workflow**: progressive design (Explore → Propose → Spec) |
| \`superspec validate [id]\` | Validate specifications (CLI) |
| \`/superspec:plan\` | Create TDD implementation plan (after brainstorm) |
| \`/superspec:execute\` | Execute with subagent-driven TDD |
| \`/superspec:verify\` | Verify implementation matches specs |
| \`/superspec:finish-branch\` | Complete branch (merge/PR) |
| \`/superspec:archive\` | Archive changes |

## Four Iron Rules

1. **TDD Rule**: No production code without a failing test first
2. **Spec Rule**: Specs are truth. Changes are proposals.
3. **SuperSpec Rule**: Every Scenario becomes a test. Every test traces to a Scenario.
4. **Verification Rule**: No completion claims without fresh verification evidence

## Workflow

\`\`\`
Fast track:   /superspec:kickoff → execute → verify → finish-branch → archive
Full workflow: brainstorm → validate → plan → execute → verify → finish-branch → archive
\`\`\`

Use \`/superspec:kickoff\` for quick features or \`/superspec:brainstorm\` for larger changes.

Keep this managed block so \`superspec init\` can refresh the instructions.
${CLAUDE_MD_END}`;

/**
 * Update CLAUDE.md with SuperSpec managed block
 * - If no CLAUDE.md exists, create it
 * - If CLAUDE.md exists without markers, prepend the block
 * - If CLAUDE.md exists with markers, replace only the marked section
 */
function updateClaudeMd(projectPath: string): { action: 'created' | 'updated' | 'unchanged' } {
  const claudeMdPath = join(projectPath, 'CLAUDE.md');

  if (!existsSync(claudeMdPath)) {
    // Create new CLAUDE.md
    writeFileSync(claudeMdPath, CLAUDE_MD_CONTENT + '\n');
    return { action: 'created' };
  }

  const existingContent = readFileSync(claudeMdPath, 'utf-8');

  // Check if markers exist
  const startIndex = existingContent.indexOf(CLAUDE_MD_START);
  const endIndex = existingContent.indexOf(CLAUDE_MD_END);

  if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    // Replace existing managed block
    const before = existingContent.substring(0, startIndex);
    const after = existingContent.substring(endIndex + CLAUDE_MD_END.length);
    const newContent = before + CLAUDE_MD_CONTENT + after;

    if (newContent === existingContent) {
      return { action: 'unchanged' };
    }

    writeFileSync(claudeMdPath, newContent);
    return { action: 'updated' };
  }

  // No markers found, prepend the block
  const newContent = CLAUDE_MD_CONTENT + '\n\n' + existingContent;
  writeFileSync(claudeMdPath, newContent);
  return { action: 'updated' };
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

    // Update CLAUDE.md
    const claudeMdResult = updateClaudeMd(projectPath);

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

    // Display CLAUDE.md update result
    console.log();
    console.log(sectionDivider());
    displaySection('CLAUDE.md');
    console.log();
    if (claudeMdResult.action === 'created') {
      console.log(`  ${PALETTE.success(SYMBOLS.success)} Created CLAUDE.md with SuperSpec instructions`);
    } else if (claudeMdResult.action === 'updated') {
      console.log(`  ${PALETTE.success(SYMBOLS.success)} Updated SuperSpec block in CLAUDE.md`);
    } else {
      console.log(`  ${PALETTE.midGray(SYMBOLS.info)} CLAUDE.md already up to date`);
    }
    console.log();
    console.log(PALETTE.midGray(`  Managed block: <!-- SUPERSPEC:START --> ... <!-- SUPERSPEC:END -->`));
    console.log(PALETTE.midGray(`  Your custom content outside this block is preserved.`));

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
