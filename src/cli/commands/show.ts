import { existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import {
  PALETTE,
  SYMBOLS,
  commandHeader,
  sectionDivider,
  createProgressBar,
  isInteractive,
  selectPrompt,
  selectItemType,
  selectChange,
  selectSpec,
  numberedItem,
} from '../ui/index.js';

interface ShowOptions {
  json?: boolean;
}

interface SpecDetail {
  name: string;
  requirementCount: number;
  scenarioCount: number;
}

interface TaskProgress {
  completed: number;
  total: number;
}

interface ChangeDetails {
  id: string;
  status: 'active' | 'archived';
  path: string;
  hasProposal: boolean;
  hasDesign: boolean;
  hasSpecs: boolean;
  hasPlan: boolean;
  hasTasks: boolean;
  title?: string;
  proposalTitle?: string;
  designDecision?: string;
  specCount?: number;
  taskCount?: number;
  taskProgress?: TaskProgress;
  specs?: SpecDetail[];
}

export async function showCommand(item: string | undefined, options: ShowOptions): Promise<void> {
  const superspecPath = join(process.cwd(), 'superspec');

  if (!existsSync(superspecPath)) {
    console.log(PALETTE.error(`${SYMBOLS.error} SuperSpec not initialized. Run: superspec init`));
    process.exit(1);
  }

  // If no item specified, show interactive selection
  if (!item) {
    if (!isInteractive()) {
      console.log(PALETTE.error(`${SYMBOLS.error} Please specify an item to show, or run in interactive mode.`));
      console.log(PALETTE.midGray('  Usage: superspec show <change-id|spec-name>'));
      process.exit(1);
    }

    // Ask what type to view
    const itemType = await selectItemType();

    if (itemType === 'change') {
      const changes = getChangeList(superspecPath);
      item = await selectChange(changes, 'Select a change to view:');
    } else {
      const specs = getSpecList(superspecPath);
      item = await selectSpec(specs, 'Select a spec to view:');
    }
  }

  // Try to find the item
  const changePath = join(superspecPath, 'changes', item);
  const archivePath = findInArchive(superspecPath, item);
  const specPath = join(superspecPath, 'specs', item, 'spec.md');

  if (existsSync(changePath)) {
    await showChange(item, changePath, 'active', options);
  } else if (archivePath) {
    await showChange(item, archivePath, 'archived', options);
  } else if (existsSync(specPath)) {
    await showSpec(item, specPath, options);
  } else {
    console.log(PALETTE.error(`${SYMBOLS.error} Not found: ${item}`));
    console.log(PALETTE.midGray('  Use "superspec list" to see available items.'));
    process.exit(1);
  }
}

function getChangeList(superspecPath: string): string[] {
  const changes: string[] = [];
  const changesPath = join(superspecPath, 'changes');

  if (existsSync(changesPath)) {
    const entries = readdirSync(changesPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && entry.name !== 'archive') {
        changes.push(entry.name);
      }
    }
  }

  return changes;
}

function getSpecList(superspecPath: string): string[] {
  const specs: string[] = [];
  const specsPath = join(superspecPath, 'specs');

  if (existsSync(specsPath)) {
    const entries = readdirSync(specsPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        specs.push(entry.name);
      }
    }
  }

  return specs;
}

function findInArchive(superspecPath: string, item: string): string | null {
  const archivePath = join(superspecPath, 'changes', 'archive');
  if (!existsSync(archivePath)) return null;

  const entries = readdirSync(archivePath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory() && entry.name.includes(item)) {
      return join(archivePath, entry.name);
    }
  }
  return null;
}

async function showChange(
  id: string,
  path: string,
  status: 'active' | 'archived',
  options: ShowOptions
): Promise<void> {
  const details = gatherChangeDetails(id, path, status);

  if (options.json) {
    console.log(JSON.stringify(details, null, 2));
    return;
  }

  // Header
  console.log(commandHeader(`show ${id}`, details.title || 'Change details'));

  // Status badge
  console.log();
  const statusIcon = status === 'archived'
    ? `${PALETTE.midGray('○')} ${PALETTE.midGray('archived')}`
    : `${PALETTE.success('●')} ${PALETTE.success('active')}`;
  console.log(`  ${PALETTE.bold(PALETTE.white('Status'))}   ${statusIcon}`);
  console.log(`  ${PALETTE.bold(PALETTE.white('Path'))}     ${PALETTE.midGray(path)}`);

  // Documents section with nice boxes
  console.log();
  console.log(sectionDivider());
  console.log();
  console.log(`  ${PALETTE.bold(PALETTE.white('📄 Documents'))}`);
  console.log();

  printDocBox('Proposal', details.hasProposal, details.proposalTitle, 'P');
  printDocBox('Design', details.hasDesign, details.designDecision, 'D');
  printDocBox('Specs', details.hasSpecs, details.specCount ? `${details.specCount} capabilities` : undefined, 'S');
  printDocBox('Plan', details.hasPlan, details.taskCount ? `${details.taskCount} tasks` : undefined, 'L');
  printDocBox('Tasks', details.hasTasks, details.taskProgress
    ? `${details.taskProgress.completed}/${details.taskProgress.total} complete`
    : undefined, 'T');

  // Task progress bar
  if (details.taskProgress && details.taskProgress.total > 0) {
    console.log();
    console.log(sectionDivider());
    console.log();
    console.log(`  ${PALETTE.bold(PALETTE.white('📊 Progress'))}`);
    console.log();
    console.log(`  ${createProgressBar(details.taskProgress.completed, details.taskProgress.total, 35)}`);
  }

  // Specs list
  if (details.specs && details.specs.length > 0) {
    console.log();
    console.log(sectionDivider());
    console.log();
    console.log(`  ${PALETTE.bold(PALETTE.white('📋 Specifications'))}`);
    console.log();
    for (const spec of details.specs) {
      console.log(`  ${PALETTE.primary('›')} ${PALETTE.cyan(spec.name)} ${PALETTE.midGray(`(${spec.requirementCount} req, ${spec.scenarioCount} scenarios)`)}`);
    }
  }

  // Next actions
  if (status === 'active') {
    console.log();
    console.log(sectionDivider());
    console.log();
    console.log(`  ${PALETTE.bold(PALETTE.white('🎯 Next Actions'))}`);
    console.log();

    if (!details.hasProposal || !details.hasDesign || !details.hasSpecs) {
      console.log(`  ${PALETTE.primary('›')} Continue design: ${PALETTE.white('/superspec:brainstorm')}`);
    } else if (!details.hasPlan) {
      console.log(`  ${PALETTE.primary('›')} Create plan: ${PALETTE.white('/superspec:plan')}`);
    } else if (details.taskProgress && details.taskProgress.completed < details.taskProgress.total) {
      console.log(`  ${PALETTE.primary('›')} Execute plan: ${PALETTE.white('/superspec:execute')}`);
    } else {
      console.log(`  ${PALETTE.primary('›')} Verify: ${PALETTE.white(`superspec verify ${id}`)}`);
      console.log(`  ${PALETTE.primary('›')} Archive: ${PALETTE.white(`superspec archive ${id}`)}`);
    }
  }

  console.log();
}

function printDocBox(label: string, exists: boolean, detail?: string, letter?: string): void {
  const icon = exists ? PALETTE.success('✓') : PALETTE.darkGray('○');
  const letterBadge = letter
    ? (exists ? PALETTE.success(`[${letter}]`) : PALETTE.darkGray(`[${letter}]`))
    : '';
  const detailStr = detail ? PALETTE.midGray(` - ${detail}`) : '';

  console.log(`  ${icon} ${letterBadge} ${PALETTE.white(label)}${detailStr}`);
}

function gatherChangeDetails(id: string, path: string, status: 'active' | 'archived'): ChangeDetails {
  const details: ChangeDetails = {
    id,
    status,
    path,
    hasProposal: existsSync(join(path, 'proposal.md')),
    hasDesign: existsSync(join(path, 'design.md')),
    hasSpecs: existsSync(join(path, 'specs')),
    hasPlan: existsSync(join(path, 'plan.md')),
    hasTasks: existsSync(join(path, 'tasks.md')),
  };

  // Get proposal info
  if (details.hasProposal) {
    try {
      const content = readFileSync(join(path, 'proposal.md'), 'utf-8');
      const { data } = matter(content);
      details.title = data['title'] as string | undefined;
      details.proposalTitle = data['title'] as string | undefined;
    } catch { /* ignore */ }
  }

  // Get design info
  if (details.hasDesign) {
    try {
      const content = readFileSync(join(path, 'design.md'), 'utf-8');
      const match = content.match(/## Decision\s*\n\s*(.+)/);
      if (match?.[1]) {
        details.designDecision = match[1].trim().slice(0, 50);
      }
    } catch { /* ignore */ }
  }

  // Get specs info
  if (details.hasSpecs) {
    const specsPath = join(path, 'specs');
    const specs: SpecDetail[] = [];
    const entries = readdirSync(specsPath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const specFile = join(specsPath, entry.name, 'spec.md');
        if (existsSync(specFile)) {
          const content = readFileSync(specFile, 'utf-8');
          specs.push({
            name: entry.name,
            requirementCount: (content.match(/^### Requirement:/gm) ?? []).length,
            scenarioCount: (content.match(/^#### Scenario:/gm) ?? []).length,
          });
        }
      }
    }

    details.specs = specs;
    details.specCount = specs.length;
  }

  // Get plan info
  if (details.hasPlan) {
    try {
      const content = readFileSync(join(path, 'plan.md'), 'utf-8');
      details.taskCount = (content.match(/^### Task \d+/gm) ?? []).length;
    } catch { /* ignore */ }
  }

  // Get task progress
  if (details.hasTasks) {
    try {
      const content = readFileSync(join(path, 'tasks.md'), 'utf-8');
      const total = (content.match(/^- \[[ x]\]/gm) ?? []).length;
      const completed = (content.match(/^- \[x\]/gm) ?? []).length;
      details.taskProgress = { completed, total };
    } catch { /* ignore */ }
  }

  return details;
}

async function showSpec(name: string, path: string, options: ShowOptions): Promise<void> {
  const content = readFileSync(path, 'utf-8');
  const requirements = content.match(/^### Requirement: (.+)$/gm) ?? [];
  const scenarios = content.match(/^#### Scenario: (.+)$/gm) ?? [];
  const purposeMatch = content.match(/## Purpose\s*\n\s*(.+)/);

  const details = {
    name,
    purpose: purposeMatch?.[1]?.trim(),
    requirementCount: requirements.length,
    scenarioCount: scenarios.length,
    requirements: requirements.map(r => r.replace('### Requirement: ', '')),
    path,
  };

  if (options.json) {
    console.log(JSON.stringify(details, null, 2));
    return;
  }

  // Header
  console.log(commandHeader(`show ${name}`, 'Specification details'));

  // Purpose
  if (details.purpose) {
    console.log();
    console.log(`  ${PALETTE.bold(PALETTE.white('📝 Purpose'))}`);
    console.log();
    console.log(`  ${PALETTE.lightGray(details.purpose)}`);
  }

  // Stats
  console.log();
  console.log(sectionDivider());
  console.log();
  console.log(`  ${PALETTE.bold(PALETTE.white('📊 Statistics'))}`);
  console.log();
  console.log(`  ${PALETTE.cyan(String(details.requirementCount))} requirements  ${PALETTE.midGray('·')}  ${PALETTE.info(String(details.scenarioCount))} scenarios`);

  // Requirements list
  console.log();
  console.log(sectionDivider());
  console.log();
  console.log(`  ${PALETTE.bold(PALETTE.white('📋 Requirements'))}`);
  console.log();
  for (let i = 0; i < details.requirements.length; i++) {
    console.log(numberedItem(i + 1, details.requirements[i]!));
  }

  // Path
  console.log();
  console.log(sectionDivider());
  console.log();
  console.log(`  ${PALETTE.midGray('Path:')} ${PALETTE.darkGray(path)}`);
  console.log();
}
