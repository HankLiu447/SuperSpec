import { existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import {
  PALETTE,
  SYMBOLS,
  sectionDivider,
  createProgressBar,
  startSpinner,
  spinnerSuccess,
  isInteractive,
  selectPrompt,
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
    console.log(PALETTE.error('SuperSpec not initialized.'));
    console.log(PALETTE.midGray('Run: superspec init'));
    process.exit(1);
  }

  const spinner = startSpinner('Loading project overview...');
  const overview = gatherProjectOverview(superspecPath);
  spinnerSuccess(spinner, 'Project loaded');

  if (options.json) {
    console.log(JSON.stringify(overview, null, 2));
    return;
  }

  // Display dashboard
  console.log();
  console.log(PALETTE.primary('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(`${PALETTE.bold(PALETTE.primary('⬡'))} ${PALETTE.bold(PALETTE.white('SuperSpec Dashboard'))}`);
  console.log(PALETTE.primary('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

  // Stats overview
  console.log();
  console.log(`  ${PALETTE.bold(PALETTE.white('📊 Project Statistics'))}`);
  console.log();

  const statsBox = [
    `${PALETTE.midGray('Main Specs:')}        ${PALETTE.white(String(overview.stats.mainSpecCount).padStart(3))}`,
    `${PALETTE.midGray('Active Changes:')}    ${PALETTE.white(String(overview.stats.activeChangeCount).padStart(3))}`,
    `${PALETTE.midGray('Archived Changes:')}  ${PALETTE.white(String(overview.stats.archivedChangeCount).padStart(3))}`,
    '',
    `${PALETTE.midGray('Total Requirements:')} ${PALETTE.primary(String(overview.stats.totalRequirements).padStart(3))}`,
    `${PALETTE.midGray('Total Scenarios:')}   ${PALETTE.primary(String(overview.stats.totalScenarios).padStart(3))}`,
  ];

  for (const line of statsBox) {
    console.log(`  ${line}`);
  }

  // Active Changes
  if (overview.activeChanges.length > 0) {
    console.log();
    console.log(sectionDivider());
    console.log();
    console.log(`  ${PALETTE.bold(PALETTE.white('🔄 Active Changes'))}`);
    console.log();

    for (const change of overview.activeChanges) {
      const phaseIcon = getPhaseIcon(change.phase);
      const title = change.title ? PALETTE.lightGray(` - ${change.title.slice(0, 35)}${change.title.length > 35 ? '...' : ''}`) : '';
      console.log(`  ${phaseIcon} ${PALETTE.primary(change.id)}${title}`);

      // Progress bar if in execute phase
      if (change.progress && change.progress.total > 0) {
        const { completed, total } = change.progress;
        console.log(`    ${createProgressBar(completed, total, 20)} ${PALETTE.midGray(`${completed}/${total} tasks`)}`);
      }

      // Phase indicator
      const phases = ['proposal', 'design', 'spec', 'plan', 'execute', 'verify'];
      const currentPhaseIndex = phases.indexOf(change.phase);
      const phaseBar = phases.map((p, i) => {
        if (i < currentPhaseIndex) return PALETTE.success('●');
        if (i === currentPhaseIndex) return PALETTE.primary('◉');
        return PALETTE.darkGray('○');
      }).join(' ');
      console.log(`    ${PALETTE.midGray('Phase:')} ${phaseBar}`);
      console.log();
    }
  } else {
    console.log();
    console.log(sectionDivider());
    console.log();
    console.log(`  ${PALETTE.bold(PALETTE.white('🔄 Active Changes'))}`);
    console.log();
    console.log(`  ${PALETTE.midGray('No active changes.')}`);
    console.log(`  ${PALETTE.midGray('Start a new change:')} ${PALETTE.white('/superspec:brainstorm')}`);
    console.log();
  }

  // Main Specs
  if (overview.mainSpecs.length > 0) {
    console.log();
    console.log(sectionDivider());
    console.log();
    console.log(`  ${PALETTE.bold(PALETTE.white('📋 Main Specifications'))}`);
    console.log();

    // Table header
    console.log(`  ${PALETTE.bold('Name'.padEnd(25))} ${PALETTE.bold('Requirements'.padStart(12))} ${PALETTE.bold('Scenarios'.padStart(10))}`);
    console.log(`  ${PALETTE.darkGray('─'.repeat(25))} ${PALETTE.darkGray('─'.repeat(12))} ${PALETTE.darkGray('─'.repeat(10))}`);

    for (const spec of overview.mainSpecs.slice(0, 10)) {
      const name = spec.name.length > 24 ? spec.name.slice(0, 22) + '..' : spec.name.padEnd(25);
      console.log(`  ${PALETTE.primary(name)} ${String(spec.requirementCount).padStart(12)} ${String(spec.scenarioCount).padStart(10)}`);
    }

    if (overview.mainSpecs.length > 10) {
      console.log(`  ${PALETTE.midGray(`... and ${overview.mainSpecs.length - 10} more`)}`);
    }
    console.log();
  }

  // Quick actions
  console.log();
  console.log(sectionDivider());
  console.log();
  console.log(`  ${PALETTE.bold(PALETTE.white('🚀 Quick Actions'))}`);
  console.log();
  console.log(`  ${PALETTE.primary('1.')} ${PALETTE.white('superspec list')}       ${PALETTE.darkGray('- View all changes')}`);
  console.log(`  ${PALETTE.primary('2.')} ${PALETTE.white('superspec list -s')}    ${PALETTE.darkGray('- View all specs')}`);
  console.log(`  ${PALETTE.primary('3.')} ${PALETTE.white('superspec validate')}   ${PALETTE.darkGray('- Validate specs')}`);
  console.log(`  ${PALETTE.primary('4.')} ${PALETTE.white('/superspec:brainstorm')} ${PALETTE.darkGray('- Start new change')}`);
  console.log();

  // Interactive mode - offer navigation
  if (isInteractive() && (overview.activeChanges.length > 0 || overview.mainSpecs.length > 0)) {
    console.log(sectionDivider());
    console.log();

    const choices = [
      { name: `${PALETTE.midGray('→')} View a change`, value: 'change' },
      { name: `${PALETTE.midGray('→')} View a spec`, value: 'spec' },
      { name: `${PALETTE.midGray('→')} Run validation`, value: 'validate' },
      { name: PALETTE.midGray('(Exit)'), value: 'exit' },
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
        choices: [...changeChoices, { name: PALETTE.midGray('(Cancel)'), value: '' }],
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
        choices: [...specChoices, { name: PALETTE.midGray('(Cancel)'), value: '' }],
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
  const hasProposal = existsSync(join(path, 'proposal.md'));
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
    proposal: PALETTE.darkGray('◐'),
    design: PALETTE.darkGray('◑'),
    spec: PALETTE.primary('◐'),
    plan: PALETTE.primary('◑'),
    execute: PALETTE.warning('◉'),
    verify: PALETTE.success('●'),
  };
  return icons[phase] ?? PALETTE.darkGray('○');
}
