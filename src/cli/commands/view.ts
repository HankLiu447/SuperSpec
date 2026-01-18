import { existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import {
  PALETTE,
  ICONS,
  BOX,
  sectionHeader,
  createProgressBar,
  startSpinner,
  spinnerSuccess,
  isInteractive,
  selectPrompt,
  displayCommand,
  displayStats,
} from '../ui/index.js';

interface ViewOptions {
  json?: boolean;
}

interface ProjectOverview {
  initialized: boolean;
  activeChanges: ChangeOverview[];
  archivedChanges: number;
  mainSpecs: SpecOverview[];
  stats: {
    totalRequirements: number;
    totalScenarios: number;
    activeChangeCount: number;
    archivedChangeCount: number;
    mainSpecCount: number;
  };
}

interface ChangeOverview {
  id: string;
  title?: string;
  phase: 'proposal' | 'design' | 'spec' | 'plan' | 'execute' | 'verify';
  progress?: { completed: number; total: number };
  specCount: number;
}

interface SpecOverview {
  name: string;
  requirementCount: number;
  scenarioCount: number;
}

export async function viewCommand(options: ViewOptions): Promise<void> {
  const superspecPath = join(process.cwd(), 'superspec');

  if (!existsSync(superspecPath)) {
    console.log(`  ${ICONS.error} ${PALETTE.error('SuperSpec not initialized.')}`);
    console.log(`  ${PALETTE.dim('Run:')} ${PALETTE.accent('superspec init')}`);
    process.exit(1);
  }

  const spinner = startSpinner('Loading project overview...');
  const overview = gatherProjectOverview(superspecPath);
  spinnerSuccess(spinner, 'Project loaded');

  if (options.json) {
    console.log(JSON.stringify(overview, null, 2));
    return;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // DASHBOARD HEADER
  // ═══════════════════════════════════════════════════════════════════════════

  console.log();
  console.log(`  ${PALETTE.subtle(BOX.heavyTopLeft + BOX.heavyH.repeat(58) + BOX.heavyTopRight)}`);
  console.log(`  ${PALETTE.subtle(BOX.heavyV)}  ${PALETTE.primary('⬡')} ${PALETTE.bold(PALETTE.white('SuperSpec Dashboard'))}${' '.repeat(36)}${PALETTE.subtle(BOX.heavyV)}`);
  console.log(`  ${PALETTE.subtle(BOX.heavyBottomLeft + BOX.heavyH.repeat(58) + BOX.heavyBottomRight)}`);

  // ═══════════════════════════════════════════════════════════════════════════
  // PROJECT STATISTICS
  // ═══════════════════════════════════════════════════════════════════════════

  console.log(sectionHeader('Project Statistics', '📊'));
  console.log();
  displayStats([
    { label: 'Main Specs', value: overview.stats.mainSpecCount },
    { label: 'Active', value: overview.stats.activeChangeCount },
    { label: 'Archived', value: overview.stats.archivedChangeCount },
  ]);
  console.log();
  displayStats([
    { label: 'Requirements', value: overview.stats.totalRequirements, icon: PALETTE.primary('◆') },
    { label: 'Scenarios', value: overview.stats.totalScenarios, icon: PALETTE.accent('◆') },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // ACTIVE CHANGES
  // ═══════════════════════════════════════════════════════════════════════════

  console.log(sectionHeader('Active Changes', '🔄'));
  console.log();

  if (overview.activeChanges.length > 0) {
    for (const change of overview.activeChanges) {
      const phaseIcon = getPhaseIcon(change.phase);
      const title = change.title
        ? PALETTE.dim(` - ${change.title.slice(0, 35)}${change.title.length > 35 ? '…' : ''}`)
        : '';

      console.log(`  ${PALETTE.subtle('┌─')} ${phaseIcon} ${PALETTE.bold(PALETTE.white(change.id))}${title}`);

      // Progress bar if in execute phase
      if (change.progress && change.progress.total > 0) {
        const { completed, total } = change.progress;
        const bar = createProgressBar(completed, total, { width: 18, showCount: true });
        console.log(`  ${PALETTE.subtle('│')}   ${bar}`);
      }

      // Phase indicator
      const phases = ['proposal', 'design', 'spec', 'plan', 'execute', 'verify'];
      const currentPhaseIndex = phases.indexOf(change.phase);
      const phaseBar = phases.map((p, i) => {
        if (i < currentPhaseIndex) return PALETTE.success('●');
        if (i === currentPhaseIndex) return PALETTE.accent('●');
        return PALETTE.dark('○');
      }).join(' ');
      console.log(`  ${PALETTE.subtle('│')}   ${PALETTE.dim('Phase:')} ${phaseBar}`);
      console.log(`  ${PALETTE.subtle('└─')}`);
      console.log();
    }
  } else {
    console.log(`  ${PALETTE.dim('No active changes.')}`);
    console.log();
    displayCommand('/superspec:brainstorm', 'Start a new change');
    console.log();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MAIN SPECIFICATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  if (overview.mainSpecs.length > 0) {
    console.log(sectionHeader('Main Specifications', '📋'));
    console.log();

    // Table header
    console.log(`  ${PALETTE.bold(PALETTE.dim('Name'.padEnd(28)))} ${PALETTE.bold(PALETTE.dim('Reqs'.padStart(8)))} ${PALETTE.bold(PALETTE.dim('Scenarios'.padStart(10)))}`);
    console.log(`  ${PALETTE.dark('─'.repeat(28))} ${PALETTE.dark('─'.repeat(8))} ${PALETTE.dark('─'.repeat(10))}`);

    for (const spec of overview.mainSpecs.slice(0, 8)) {
      const name = spec.name.length > 27
        ? spec.name.slice(0, 25) + '…'
        : spec.name;
      console.log(`  ${PALETTE.primaryBright(name.padEnd(28))} ${PALETTE.white(String(spec.requirementCount).padStart(8))} ${PALETTE.white(String(spec.scenarioCount).padStart(10))}`);
    }

    if (overview.mainSpecs.length > 8) {
      console.log(`  ${PALETTE.dim(`... and ${overview.mainSpecs.length - 8} more`)}`);
    }
    console.log();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // QUICK ACTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  console.log(sectionHeader('Quick Actions', '🚀'));
  console.log();
  displayCommand('superspec list', 'View all changes');
  displayCommand('superspec list -s', 'View all specs');
  displayCommand('superspec validate', 'Validate specs');
  displayCommand('/superspec:brainstorm', 'Start new change');
  console.log();

  // ═══════════════════════════════════════════════════════════════════════════
  // INTERACTIVE NAVIGATION
  // ═══════════════════════════════════════════════════════════════════════════

  if (isInteractive() && (overview.activeChanges.length > 0 || overview.mainSpecs.length > 0)) {
    console.log(`  ${PALETTE.subtle('─'.repeat(55))}`);
    console.log();

    const choices = [
      { name: `${PALETTE.primary('›')} View a change`, value: 'change' },
      { name: `${PALETTE.primary('›')} View a spec`, value: 'spec' },
      { name: `${PALETTE.primary('›')} Run validation`, value: 'validate' },
      { name: PALETTE.dim('  (Exit)'), value: 'exit' },
    ];

    const action = await selectPrompt({
      message: 'What would you like to do?',
      choices,
    });

    if (action === 'change' && overview.activeChanges.length > 0) {
      const { showCommand } = await import('./show.js');
      const changeChoices = overview.activeChanges.map(c => ({
        name: `${c.id}${c.title ? ` - ${c.title}` : ''}`,
        value: c.id,
      }));
      const selectedChange = await selectPrompt({
        message: 'Select a change:',
        choices: [...changeChoices, { name: PALETTE.dim('(Cancel)'), value: '' }],
      });
      if (selectedChange) {
        await showCommand(selectedChange as string, {});
      }
    } else if (action === 'spec' && overview.mainSpecs.length > 0) {
      const { showCommand } = await import('./show.js');
      const specChoices = overview.mainSpecs.map(s => ({
        name: `${s.name} (${s.requirementCount} requirements)`,
        value: s.name,
      }));
      const selectedSpec = await selectPrompt({
        message: 'Select a spec:',
        choices: [...specChoices, { name: PALETTE.dim('(Cancel)'), value: '' }],
      });
      if (selectedSpec) {
        await showCommand(selectedSpec as string, {});
      }
    } else if (action === 'validate') {
      const { validateCommand } = await import('./validate.js');
      await validateCommand(undefined, { all: true });
    }
  }
}

function gatherProjectOverview(superspecPath: string): ProjectOverview {
  const overview: ProjectOverview = {
    initialized: true,
    activeChanges: [],
    archivedChanges: 0,
    mainSpecs: [],
    stats: {
      totalRequirements: 0,
      totalScenarios: 0,
      activeChangeCount: 0,
      archivedChangeCount: 0,
      mainSpecCount: 0,
    },
  };

  // Gather active changes
  const changesPath = join(superspecPath, 'changes');
  if (existsSync(changesPath)) {
    const entries = readdirSync(changesPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && entry.name !== 'archive') {
        const changePath = join(changesPath, entry.name);
        overview.activeChanges.push(getChangeOverview(entry.name, changePath));
      }
    }
  }

  // Count archived changes
  const archivePath = join(changesPath, 'archive');
  if (existsSync(archivePath)) {
    const entries = readdirSync(archivePath, { withFileTypes: true });
    overview.archivedChanges = entries.filter(e => e.isDirectory()).length;
  }

  // Gather main specs
  const specsPath = join(superspecPath, 'specs');
  if (existsSync(specsPath)) {
    const entries = readdirSync(specsPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const specFile = join(specsPath, entry.name, 'spec.md');
        if (existsSync(specFile)) {
          overview.mainSpecs.push(getSpecOverview(entry.name, specFile));
        }
      }
    }
  }

  // Calculate stats
  overview.stats.activeChangeCount = overview.activeChanges.length;
  overview.stats.archivedChangeCount = overview.archivedChanges;
  overview.stats.mainSpecCount = overview.mainSpecs.length;
  overview.stats.totalRequirements = overview.mainSpecs.reduce((sum, s) => sum + s.requirementCount, 0);
  overview.stats.totalScenarios = overview.mainSpecs.reduce((sum, s) => sum + s.scenarioCount, 0);

  return overview;
}

function getChangeOverview(id: string, path: string): ChangeOverview {
  const overview: ChangeOverview = {
    id,
    phase: 'proposal',
    specCount: 0,
  };

  // Get title from proposal
  const proposalPath = join(path, 'proposal.md');
  if (existsSync(proposalPath)) {
    try {
      const content = readFileSync(proposalPath, 'utf-8');
      const { data } = matter(content);
      overview.title = data['title'] as string;
    } catch { /* ignore */ }
  }

  // Determine phase
  const hasDesign = existsSync(join(path, 'design.md'));
  const hasSpecs = existsSync(join(path, 'specs'));
  const hasPlan = existsSync(join(path, 'plan.md'));
  const hasTasks = existsSync(join(path, 'tasks.md'));

  if (hasTasks) {
    const content = readFileSync(join(path, 'tasks.md'), 'utf-8');
    const total = (content.match(/^- \[[ x]\]/gm) ?? []).length;
    const completed = (content.match(/^- \[x\]/gm) ?? []).length;
    overview.progress = { completed, total };

    if (completed === total && total > 0) {
      overview.phase = 'verify';
    } else {
      overview.phase = 'execute';
    }
  } else if (hasPlan) {
    overview.phase = 'plan';
  } else if (hasSpecs) {
    overview.phase = 'spec';
  } else if (hasDesign) {
    overview.phase = 'design';
  } else {
    overview.phase = 'proposal';
  }

  // Count specs
  const specsPath = join(path, 'specs');
  if (existsSync(specsPath)) {
    const entries = readdirSync(specsPath, { withFileTypes: true });
    overview.specCount = entries.filter(e => e.isDirectory()).length;
  }

  return overview;
}

function getSpecOverview(name: string, path: string): SpecOverview {
  const overview: SpecOverview = {
    name,
    requirementCount: 0,
    scenarioCount: 0,
  };

  try {
    const content = readFileSync(path, 'utf-8');
    overview.requirementCount = (content.match(/^### Requirement:/gm) ?? []).length;
    overview.scenarioCount = (content.match(/^#### Scenario:/gm) ?? []).length;
  } catch { /* ignore */ }

  return overview;
}

function getPhaseIcon(phase: ChangeOverview['phase']): string {
  const icons: Record<string, string> = {
    proposal: PALETTE.dark('◐'),
    design: PALETTE.dim('◑'),
    spec: PALETTE.primary('◐'),
    plan: PALETTE.primaryBright('◑'),
    execute: PALETTE.accent('◉'),
    verify: PALETTE.success('●'),
  };
  return icons[phase] ?? PALETTE.dark('○');
}
