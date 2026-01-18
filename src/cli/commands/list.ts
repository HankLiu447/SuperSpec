import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import {
  PALETTE,
  SYMBOLS,
  commandHeader,
  sectionDivider,
  createProgressBar,
  statusBadge,
  statusIndicator,
  isInteractive,
  selectPrompt,
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
    console.log(PALETTE.error(`${SYMBOLS.error} SuperSpec not initialized.`));
    console.log(PALETTE.midGray('  Run: superspec init'));
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
    console.log(PALETTE.midGray('  No changes found.'));
    console.log();
    console.log(`  ${PALETTE.midGray('Get started:')} ${PALETTE.white('/superspec:brainstorm')}`);
    console.log();
    return;
  }

  // Stats summary
  console.log();
  console.log(`  ${PALETTE.bold(PALETTE.white('📊 Summary'))}  ${PALETTE.primary(String(active.length))} active  ${PALETTE.midGray('·')}  ${PALETTE.midGray(String(archived.length))} archived`);

  if (active.length > 0) {
    console.log();
    console.log(sectionDivider());
    console.log();
    console.log(`  ${PALETTE.bold(PALETTE.success('● Active Changes'))}`);
    console.log();
    for (const change of active) {
      printChangeCard(change);
    }
  }

  if (archived.length > 0 && options.archived) {
    console.log();
    console.log(sectionDivider());
    console.log();
    console.log(`  ${PALETTE.bold(PALETTE.midGray('○ Archived Changes'))}`);
    console.log();
    for (const change of archived) {
      printChangeCard(change);
    }
  }

  // Interactive mode - offer to select
  if (isInteractive(options) && active.length > 0) {
    console.log(sectionDivider());
    console.log();

    const viewChange = await selectPrompt({
      message: 'Select a change to view details:',
      choices: [
        ...active.map(c => ({
          name: `${PALETTE.primary('›')} ${c.id}${c.title ? ` - ${c.title}` : ''}`,
          value: c.id,
        })),
        { name: PALETTE.midGray('  (Cancel)'), value: '' },
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
  // Status icon and docs indicators
  const docs = [
    change.hasProposal ? PALETTE.success('P') : PALETTE.darkGray('P'),
    change.hasDesign ? PALETTE.success('D') : PALETTE.darkGray('D'),
    change.hasSpecs ? PALETTE.success('S') : PALETTE.darkGray('S'),
    change.hasPlan ? PALETTE.success('L') : PALETTE.darkGray('L'),
  ].join('');

  // Title line
  const title = change.title
    ? PALETTE.lightGray(change.title.length > 40 ? change.title.slice(0, 37) + '...' : change.title)
    : '';
  const statusIcon = change.status === 'archived'
    ? PALETTE.midGray('○')
    : PALETTE.success('●');

  // Box style card
  console.log(`  ${PALETTE.primary('┌─')} ${statusIcon} ${PALETTE.bold(PALETTE.white(change.id))}`);
  if (title) {
    console.log(`  ${PALETTE.primary('│')}  ${title}`);
  }
  console.log(`  ${PALETTE.primary('│')}  ${PALETTE.midGray('Docs:')} [${docs}]  ${PALETTE.darkGray('P=Proposal D=Design S=Specs L=Plan')}`);

  // Progress bar if has tasks
  if (change.taskProgress && change.taskProgress.total > 0) {
    const { completed, total } = change.taskProgress;
    console.log(`  ${PALETTE.primary('│')}  ${PALETTE.midGray('Progress:')} ${createProgressBar(completed, total, 15)}`);
  }

  console.log(`  ${PALETTE.primary('└─')}`);
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
    console.log(PALETTE.midGray('  No specs found.'));
    console.log();
    console.log(`  ${PALETTE.midGray('Tip:')} Archive a change to create main specs.`);
    console.log();
    return;
  }

  // Stats
  const totalReqs = specs.reduce((sum, s) => sum + s.requirementCount, 0);
  const totalScenarios = specs.reduce((sum, s) => sum + s.scenarioCount, 0);

  console.log();
  console.log(`  ${PALETTE.bold(PALETTE.white('📊 Summary'))}  ${PALETTE.primary(String(specs.length))} specs  ${PALETTE.midGray('·')}  ${PALETTE.cyan(String(totalReqs))} requirements  ${PALETTE.midGray('·')}  ${PALETTE.cyan(String(totalScenarios))} scenarios`);
  console.log();
  console.log(sectionDivider());
  console.log();

  for (const spec of specs) {
    const purpose = spec.purpose
      ? PALETTE.midGray(spec.purpose.length > 50 ? spec.purpose.slice(0, 47) + '...' : spec.purpose)
      : '';

    console.log(`  ${PALETTE.primary('┌─')} ${PALETTE.bold(PALETTE.cyan(spec.name))}`);
    if (purpose) {
      console.log(`  ${PALETTE.primary('│')}  ${purpose}`);
    }
    console.log(`  ${PALETTE.primary('│')}  ${PALETTE.success(String(spec.requirementCount))} requirements  ${PALETTE.midGray('·')}  ${PALETTE.info(String(spec.scenarioCount))} scenarios`);
    console.log(`  ${PALETTE.primary('└─')}`);
    console.log();
  }

  // Interactive selection
  if (isInteractive(options) && specs.length > 0) {
    console.log(sectionDivider());
    console.log();

    const viewSpec = await selectPrompt({
      message: 'Select a spec to view details:',
      choices: [
        ...specs.map(s => ({
          name: `${PALETTE.primary('›')} ${s.name} (${s.requirementCount} req)`,
          value: s.name,
        })),
        { name: PALETTE.midGray('  (Cancel)'), value: '' },
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
