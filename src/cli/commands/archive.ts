import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync, renameSync, copyFileSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import {
  PALETTE,
  SYMBOLS,
  commandHeader,
  sectionDivider,
  startSpinner,
  spinnerSuccess,
  spinnerFail,
  isInteractive,
  selectChange,
  confirmDangerous,
} from '../ui/index.js';

interface ArchiveOptions {
  yes?: boolean;
  skipSpecs?: boolean;
}

interface DeltaOperation {
  type: 'added' | 'modified' | 'removed' | 'renamed';
  requirement: string;
  content?: string;
  reason?: string;
  fromName?: string;
  toName?: string;
}

export async function archiveCommand(id: string | undefined, options: ArchiveOptions): Promise<void> {
  const superspecPath = join(process.cwd(), 'superspec');

  if (!existsSync(superspecPath)) {
    console.log(PALETTE.error('SuperSpec not initialized. Run: superspec init'));
    process.exit(1);
  }

  // Interactive mode if no ID provided
  if (!id) {
    if (!isInteractive()) {
      console.log(PALETTE.error('Please specify a change ID to archive.'));
      process.exit(1);
    }

    const changesPath = join(superspecPath, 'changes');
    const changes: string[] = [];

    if (existsSync(changesPath)) {
      const entries = readdirSync(changesPath, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory() && entry.name !== 'archive') {
          changes.push(entry.name);
        }
      }
    }

    if (changes.length === 0) {
      console.log(PALETTE.warning('No active changes found.'));
      return;
    }

    id = await selectChange(changes, 'Select a change to archive:');
  }

  const changePath = join(superspecPath, 'changes', id);

  if (!existsSync(changePath)) {
    console.log(PALETTE.error(`Change not found: ${id}`));
    process.exit(1);
  }

  console.log(commandHeader(`archive ${id}`, 'Archive completed change'));

  // Check prerequisites
  const checkSpinner = startSpinner('Checking prerequisites...');
  const checks = checkPrerequisites(changePath);

  if (!checks.valid) {
    spinnerFail(checkSpinner, 'Prerequisites not met');
    console.log();
    console.log(sectionDivider());
    console.log();
    console.log(`  ${PALETTE.bold(PALETTE.white('❌ Issues Found'))}`);
    console.log();
    for (const issue of checks.issues) {
      console.log(`  ${PALETTE.error(SYMBOLS.error)} ${issue}`);
    }
    console.log();
    process.exit(1);
  }

  spinnerSuccess(checkSpinner, 'All prerequisites met');

  // Show what will happen
  console.log();
  console.log(sectionDivider());
  console.log();
  console.log(`  ${PALETTE.bold(PALETTE.white('📦 Archive Actions'))}`);
  console.log();

  const actions: string[] = [];
  if (!options.skipSpecs) {
    actions.push('Apply delta specs to main specifications');
  }
  actions.push(`Move ${id} to archive/`);

  for (let i = 0; i < actions.length; i++) {
    console.log(`  ${PALETTE.primary(`${i + 1}.`)} ${actions[i]}`);
  }
  console.log();

  // Confirm
  if (!options.yes) {
    console.log(PALETTE.warning('This action will modify your main specifications.'));
    const confirmed = await confirmDangerous({
      message: 'Proceed with archive?',
    });

    if (!confirmed) {
      console.log();
      console.log(PALETTE.midGray('Archive cancelled.'));
      return;
    }
  }

  console.log();

  try {
    // Apply deltas
    if (!options.skipSpecs) {
      await applyDeltas(superspecPath, changePath);
    }

    // Move to archive
    await moveToArchive(superspecPath, changePath, id);

    console.log();
    console.log(sectionDivider());
    console.log();
    console.log(`  ${PALETTE.success(SYMBOLS.success)} ${PALETTE.bold(PALETTE.success('Archive complete!'))}`);
    console.log();
    console.log(sectionDivider());
    console.log();
    console.log(`  ${PALETTE.bold(PALETTE.white('🚀 Next Steps'))}`);
    console.log();
    console.log(`  ${PALETTE.primary('1.')} Run validation: ${PALETTE.white('superspec validate --all')}`);
    console.log(`  ${PALETTE.primary('2.')} Verify main specs are updated correctly`);
    console.log();
  } catch (err) {
    console.log();
    console.log(`  ${PALETTE.error(SYMBOLS.error)} ${PALETTE.bold(PALETTE.error('Archive failed'))}`);
    console.log(`  ${PALETTE.error(err instanceof Error ? err.message : String(err))}`);
    process.exit(1);
  }
}

function checkPrerequisites(changePath: string): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  // Check required files
  if (!existsSync(join(changePath, 'proposal.md'))) {
    issues.push('Missing proposal.md');
  }
  if (!existsSync(join(changePath, 'design.md'))) {
    issues.push('Missing design.md');
  }
  if (!existsSync(join(changePath, 'specs'))) {
    issues.push('Missing specs/ directory');
  }

  // Check tasks completion (if tasks.md exists)
  const tasksPath = join(changePath, 'tasks.md');
  if (existsSync(tasksPath)) {
    const content = readFileSync(tasksPath, 'utf-8');
    const incomplete = (content.match(/^- \[ \]/gm) ?? []).length;
    if (incomplete > 0) {
      issues.push(`${incomplete} incomplete tasks in tasks.md`);
    }
  }

  return { valid: issues.length === 0, issues };
}

async function applyDeltas(superspecPath: string, changePath: string): Promise<void> {
  const specsPath = join(changePath, 'specs');
  const mainSpecsPath = join(superspecPath, 'specs');

  if (!existsSync(specsPath)) {
    return;
  }

  const spinner = startSpinner('Applying delta specs...');

  const entries = readdirSync(specsPath, { withFileTypes: true });
  let appliedCount = 0;

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const deltaSpecPath = join(specsPath, entry.name, 'spec.md');
      if (existsSync(deltaSpecPath)) {
        const content = readFileSync(deltaSpecPath, 'utf-8');
        const operations = parseDeltaOperations(content);

        if (operations.length > 0) {
          await applyDeltaToMainSpec(mainSpecsPath, entry.name, operations, content);
          appliedCount++;
        } else {
          // No delta markers - this is a new spec, copy as-is
          const targetDir = join(mainSpecsPath, entry.name);
          const targetPath = join(targetDir, 'spec.md');

          if (!existsSync(targetDir)) {
            mkdirSync(targetDir, { recursive: true });
          }
          copyFileSync(deltaSpecPath, targetPath);
          appliedCount++;
        }
      }
    }
  }

  spinnerSuccess(spinner, `Applied ${appliedCount} specifications`);
}

function parseDeltaOperations(content: string): DeltaOperation[] {
  const operations: DeltaOperation[] = [];
  const lines = content.split('\n');

  let currentSection: 'added' | 'modified' | 'removed' | 'renamed' | null = null;
  let currentReq = '';
  let currentContent: string[] = [];

  for (const line of lines) {
    // Detect section headers
    if (line.match(/^## ADDED Requirements/i)) {
      currentSection = 'added';
      continue;
    }
    if (line.match(/^## MODIFIED Requirements/i)) {
      currentSection = 'modified';
      continue;
    }
    if (line.match(/^## REMOVED Requirements/i)) {
      currentSection = 'removed';
      continue;
    }
    if (line.match(/^## RENAMED Requirements/i)) {
      currentSection = 'renamed';
      continue;
    }

    // Detect new requirement
    const reqMatch = line.match(/^### Requirement: (.+)$/);
    if (reqMatch?.[1] && currentSection) {
      // Save previous if exists
      if (currentReq) {
        operations.push({
          type: currentSection,
          requirement: currentReq,
          content: currentContent.join('\n'),
        });
      }
      currentReq = reqMatch[1];
      currentContent = [line];
      continue;
    }

    // Detect renamed format
    if (currentSection === 'renamed') {
      const fromMatch = line.match(/^- FROM:.*`### Requirement: (.+)`/);
      const toMatch = line.match(/^- TO:.*`### Requirement: (.+)`/);
      if (fromMatch?.[1]) {
        currentReq = fromMatch[1];
      }
      if (toMatch?.[1] && currentReq) {
        operations.push({
          type: 'renamed',
          requirement: currentReq,
          fromName: currentReq,
          toName: toMatch[1],
        });
        currentReq = '';
      }
      continue;
    }

    // Collect content
    if (currentReq && currentSection) {
      currentContent.push(line);
    }
  }

  // Don't forget last one
  if (currentReq && currentSection) {
    operations.push({
      type: currentSection,
      requirement: currentReq,
      content: currentContent.join('\n'),
    });
  }

  return operations;
}

async function applyDeltaToMainSpec(
  mainSpecsPath: string,
  capability: string,
  operations: DeltaOperation[],
  fullContent: string
): Promise<void> {
  const mainSpecDir = join(mainSpecsPath, capability);
  const mainSpecPath = join(mainSpecDir, 'spec.md');

  // Create directory if needed
  if (!existsSync(mainSpecDir)) {
    mkdirSync(mainSpecDir, { recursive: true });
  }

  let mainContent = '';
  if (existsSync(mainSpecPath)) {
    mainContent = readFileSync(mainSpecPath, 'utf-8');
  }

  // Sort operations: RENAMED → REMOVED → MODIFIED → ADDED
  const sorted = [...operations].sort((a, b) => {
    const order = { renamed: 0, removed: 1, modified: 2, added: 3 };
    return order[a.type] - order[b.type];
  });

  for (const op of sorted) {
    switch (op.type) {
      case 'renamed':
        if (op.fromName && op.toName) {
          mainContent = mainContent.replace(
            `### Requirement: ${op.fromName}`,
            `### Requirement: ${op.toName}`
          );
          console.log(`  ${PALETTE.cyan('→')} Renamed: ${op.fromName} → ${op.toName}`);
        }
        break;

      case 'removed':
        // Remove the requirement section
        const removePattern = new RegExp(
          `### Requirement: ${escapeRegex(op.requirement)}[\\s\\S]*?(?=### Requirement:|$)`,
          'g'
        );
        mainContent = mainContent.replace(removePattern, '');
        console.log(`  ${PALETTE.error('−')} Removed: ${op.requirement}`);
        break;

      case 'modified':
        // Replace existing requirement
        if (op.content) {
          const modifyPattern = new RegExp(
            `### Requirement: ${escapeRegex(op.requirement)}[\\s\\S]*?(?=### Requirement:|$)`,
            'g'
          );
          mainContent = mainContent.replace(modifyPattern, op.content.trim() + '\n\n');
          console.log(`  ${PALETTE.warning('~')} Modified: ${op.requirement}`);
        }
        break;

      case 'added':
        // Append to end of requirements section
        if (op.content) {
          mainContent = mainContent.trimEnd() + '\n\n' + op.content.trim() + '\n';
          console.log(`  ${PALETTE.success('+')} Added: ${op.requirement}`);
        }
        break;
    }
  }

  // Write updated spec
  writeFileSync(mainSpecPath, mainContent.trim() + '\n');
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function moveToArchive(
  superspecPath: string,
  changePath: string,
  id: string
): Promise<void> {
  const date = new Date().toISOString().split('T')[0];
  const archiveId = `${date}-${id}`;
  const archivePath = join(superspecPath, 'changes', 'archive', archiveId);

  const spinner = startSpinner(`Moving to archive/${archiveId}...`);

  // Create archive directory
  mkdirSync(archivePath, { recursive: true });

  // Move all files
  const entries = readdirSync(changePath, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = join(changePath, entry.name);
    const destPath = join(archivePath, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }

  // Remove original
  rmSync(changePath, { recursive: true });

  spinnerSuccess(spinner, `Archived to ${archiveId}`);
}

function copyDirSync(src: string, dest: string): void {
  mkdirSync(dest, { recursive: true });
  const entries = readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}
