import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import {
  PALETTE,
  ICONS,
  commandHeader,
  sectionHeader,
  createProgressBar,
  isInteractive,
  selectPrompt,
  displayStats,
  displayCommand,
} from '../ui/index.js';

interface ListOptions {
  specs?: boolean;
  archived?: boolean;
  json?: boolean;
  interactive?: boolean;
}

interface ChangeInfo {
  id: string;
  title?: string;
  status: 'active' | 'archived';
  hasProposal: boolean;
  hasDesign: boolean;
  hasSpecs: boolean;
  hasPlan: boolean;
  taskProgress?: { completed: number; total: number };
  path: string;
}

interface SpecInfo {
  name: string;
  purpose?: string;
  requirementCount: number;
  scenarioCount: number;
  path: string;
}

export async function listCommand(options: ListOptions): Promise<void> {
  const superspecPath = join(process.cwd(), 'superspec');

  if (!existsSync(superspecPath)) {
    console.log(`  ${ICONS.error} ${PALETTE.error('SuperSpec not initialized.')}`);
    console.log(`  ${PALETTE.dim('Run:')} ${PALETTE.accent('superspec init')}`);
    process.exit(1);
  }

  if (options.specs) {
    await listSpecs(superspecPath, options);
  } else {
    await listChanges(superspecPath, options);
  }
}

async function listChanges(superspecPath: string, options: ListOptions): Promise<void> {
  const changesPath = join(superspecPath, 'changes');
  const archivePath = join(changesPath, 'archive');
  const changes: ChangeInfo[] = [];

  // List active changes
  if (existsSync(changesPath)) {
    const entries = readdirSync(changesPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && entry.name !== 'archive') {
        const changePath = join(changesPath, entry.name);
        changes.push(getChangeInfo(entry.name, changePath, 'active'));
      }
    }
  }

  // List archived changes if requested
  if (options.archived && existsSync(archivePath)) {
    const entries = readdirSync(archivePath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const changePath = join(archivePath, entry.name);
        changes.push(getChangeInfo(entry.name, changePath, 'archived'));
      }
    }
  }

  if (options.json) {
    console.log(JSON.stringify(changes, null, 2));
    return;
  }

  // Header
  console.log(commandHeader('list', 'View all changes and their status'));

  // Group by status
  const active = changes.filter(c => c.status === 'active');
  const archived = changes.filter(c => c.status === 'archived');

  if (changes.length === 0) {
    console.log();
    console.log(`  ${PALETTE.dim('No changes found.')}`);
    console.log();
    displayCommand('/superspec:brainstorm', 'Start a new change');
    console.log();
    return;
  }

  // Stats summary
  console.log();
  displayStats([
    { label: 'Active', value: active.length, icon: PALETTE.success('●') },
    { label: 'Archived', value: archived.length, icon: PALETTE.dim('○') },
  ]);

  // Active Changes
  if (active.length > 0) {
    console.log(sectionHeader('Active Changes', '●'));
    console.log();

    for (const change of active) {
      printChangeCard(change);
    }
  }

  // Archived Changes
  if (archived.length > 0 && options.archived) {
    console.log(sectionHeader('Archived Changes', '○'));
    console.log();

    for (const change of archived) {
      printChangeCard(change);
    }
  }

  // Interactive mode - offer to select
  if (isInteractive(options) && active.length > 0) {
    console.log(`  ${PALETTE.subtle('─'.repeat(55))}`);
    console.log();

    const viewChange = await selectPrompt({
      message: 'Select a change to view details:',
      choices: [
        ...active.map(c => ({
          name: `${PALETTE.primary('›')} ${c.id}${c.title ? ` - ${c.title}` : ''}`,
          value: c.id,
        })),
        { name: PALETTE.dim('  (Cancel)'), value: '' },
      ],
    });

    if (viewChange) {
      // Import and run show command
      const { showCommand } = await import('./show.js');
      await showCommand(viewChange, {});
    }
  }

  console.log();
}

function getChangeInfo(id: string, path: string, status: 'active' | 'archived'): ChangeInfo {
  const info: ChangeInfo = {
    id,
    status,
    hasProposal: existsSync(join(path, 'proposal.md')),
    hasDesign: existsSync(join(path, 'design.md')),
    hasSpecs: existsSync(join(path, 'specs')),
    hasPlan: existsSync(join(path, 'plan.md')),
    path,
  };

  // Try to get title from proposal
  if (info.hasProposal) {
    try {
      const content = readFileSync(join(path, 'proposal.md'), 'utf-8');
      const { data } = matter(content);
      if (data['title']) {
        info.title = data['title'] as string;
      }
    } catch {
      // Ignore parsing errors
    }
  }

  // Get task progress
  const tasksPath = join(path, 'tasks.md');
  if (existsSync(tasksPath)) {
    try {
      const content = readFileSync(tasksPath, 'utf-8');
      const total = (content.match(/^- \[[ x]\]/gm) ?? []).length;
      const completed = (content.match(/^- \[x\]/gm) ?? []).length;
      info.taskProgress = { completed, total };
    } catch {
      // Ignore
    }
  }

  return info;
}

function printChangeCard(change: ChangeInfo): void {
  // Status icon
  const statusIcon = change.status === 'archived'
    ? PALETTE.dim('○')
    : PALETTE.success('●');

  // Document indicators
  const docs = [
    change.hasProposal ? PALETTE.success('P') : PALETTE.dark('P'),
    change.hasDesign ? PALETTE.success('D') : PALETTE.dark('D'),
    change.hasSpecs ? PALETTE.success('S') : PALETTE.dark('S'),
    change.hasPlan ? PALETTE.success('L') : PALETTE.dark('L'),
  ].join('');

  // Title
  const title = change.title
    ? PALETTE.dim(change.title.length > 40 ? change.title.slice(0, 37) + '…' : change.title)
    : '';

  // Card layout
  console.log(`  ${PALETTE.subtle('┌─')} ${statusIcon} ${PALETTE.bold(PALETTE.white(change.id))}`);

  if (title) {
    console.log(`  ${PALETTE.subtle('│')}   ${title}`);
  }

  console.log(`  ${PALETTE.subtle('│')}   ${PALETTE.dim('Docs:')} [${docs}]  ${PALETTE.dark('P=Proposal D=Design S=Specs L=Plan')}`);

  // Progress bar if has tasks
  if (change.taskProgress && change.taskProgress.total > 0) {
    const { completed, total } = change.taskProgress;
    const bar = createProgressBar(completed, total, { width: 15 });
    console.log(`  ${PALETTE.subtle('│')}   ${PALETTE.dim('Progress:')} ${bar}`);
  }

  console.log(`  ${PALETTE.subtle('└─')}`);
  console.log();
}

async function listSpecs(superspecPath: string, options: ListOptions): Promise<void> {
  const specsPath = join(superspecPath, 'specs');
  const specs: SpecInfo[] = [];

  if (existsSync(specsPath)) {
    const entries = readdirSync(specsPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const specPath = join(specsPath, entry.name, 'spec.md');
        if (existsSync(specPath)) {
          specs.push(getSpecInfo(entry.name, specPath));
        }
      }
    }
  }

  if (options.json) {
    console.log(JSON.stringify(specs, null, 2));
    return;
  }

  // Header
  console.log(commandHeader('list --specs', 'View all main specifications'));

  if (specs.length === 0) {
    console.log();
    console.log(`  ${PALETTE.dim('No specs found.')}`);
    console.log();
    console.log(`  ${PALETTE.accent('💡')} ${PALETTE.dim('Archive a change to create main specs.')}`);
    console.log();
    return;
  }

  // Stats
  const totalReqs = specs.reduce((sum, s) => sum + s.requirementCount, 0);
  const totalScenarios = specs.reduce((sum, s) => sum + s.scenarioCount, 0);

  console.log();
  displayStats([
    { label: 'Specs', value: specs.length, icon: ICONS.spec },
    { label: 'Requirements', value: totalReqs, icon: PALETTE.primary('◆') },
    { label: 'Scenarios', value: totalScenarios, icon: PALETTE.accent('◆') },
  ]);

  console.log(sectionHeader('Specifications'));
  console.log();

  for (const spec of specs) {
    const purpose = spec.purpose
      ? PALETTE.dim(spec.purpose.length > 50 ? spec.purpose.slice(0, 47) + '…' : spec.purpose)
      : '';

    console.log(`  ${PALETTE.subtle('┌─')} ${ICONS.spec} ${PALETTE.bold(PALETTE.primaryBright(spec.name))}`);

    if (purpose) {
      console.log(`  ${PALETTE.subtle('│')}   ${purpose}`);
    }

    console.log(`  ${PALETTE.subtle('│')}   ${PALETTE.success(String(spec.requirementCount))} requirements  ${PALETTE.dim('·')}  ${PALETTE.info(String(spec.scenarioCount))} scenarios`);
    console.log(`  ${PALETTE.subtle('└─')}`);
    console.log();
  }

  // Interactive selection
  if (isInteractive(options) && specs.length > 0) {
    console.log(`  ${PALETTE.subtle('─'.repeat(55))}`);
    console.log();

    const viewSpec = await selectPrompt({
      message: 'Select a spec to view details:',
      choices: [
        ...specs.map(s => ({
          name: `${PALETTE.primary('›')} ${s.name} (${s.requirementCount} req)`,
          value: s.name,
        })),
        { name: PALETTE.dim('  (Cancel)'), value: '' },
      ],
    });

    if (viewSpec) {
      const { showCommand } = await import('./show.js');
      await showCommand(viewSpec, {});
    }
  }

  console.log();
}

function getSpecInfo(name: string, path: string): SpecInfo {
  const info: SpecInfo = {
    name,
    requirementCount: 0,
    scenarioCount: 0,
    path,
  };

  try {
    const content = readFileSync(path, 'utf-8');

    // Count requirements and scenarios
    info.requirementCount = (content.match(/^### Requirement:/gm) ?? []).length;
    info.scenarioCount = (content.match(/^#### Scenario:/gm) ?? []).length;

    // Get purpose
    const purposeMatch = content.match(/## Purpose\s*\n\s*(.+)/);
    if (purposeMatch?.[1]) {
      info.purpose = purposeMatch[1].trim();
    }
  } catch {
    // Ignore parsing errors
  }

  return info;
}
