#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { listCommand } from './commands/list.js';
import { showCommand } from './commands/show.js';
import { validateCommand } from './commands/validate.js';
import { archiveCommand } from './commands/archive.js';
import { verifyCommand } from './commands/verify.js';
import { viewCommand } from './commands/view.js';
import { PALETTE, MINI_BANNER } from './ui/index.js';

const program = new Command();

program
  .name('superspec')
  .description('SuperSpec - Unified spec-driven development framework')
  .version('0.1.0');

// View command (dashboard - default when no command)
program
  .command('view')
  .description('Show project dashboard overview')
  .option('--json', 'Output as JSON')
  .action(viewCommand);

// Init command
program
  .command('init')
  .description('Initialize SuperSpec in a project')
  .argument('[path]', 'Project path', '.')
  .option('--force', 'Overwrite existing configuration')
  .action(initCommand);

// List command
program
  .command('list')
  .alias('ls')
  .description('List changes or specs')
  .option('-s, --specs', 'List main specs instead of changes')
  .option('-a, --archived', 'Include archived changes')
  .option('--json', 'Output as JSON')
  .option('-i, --interactive', 'Force interactive mode')
  .action(listCommand);

// Show command
program
  .command('show')
  .description('Show details of a change or spec')
  .argument('[item]', 'Change ID or spec name (interactive if omitted)')
  .option('--json', 'Output as JSON')
  .action(showCommand);

// Validate command
program
  .command('validate')
  .description('Validate specs for correctness')
  .argument('[id]', 'Change ID to validate (interactive if omitted)')
  .option('--all', 'Validate all specs')
  .option('--strict', 'Fail on warnings')
  .option('-v, --verbose', 'Show detailed output')
  .action(validateCommand);

// Verify command
program
  .command('verify')
  .description('Verify implementation matches specs')
  .argument('[id]', 'Change ID to verify (interactive if omitted)')
  .option('--strict', 'Fail on extra code/tests')
  .option('-v, --verbose', 'Show detailed matching')
  .action(verifyCommand);

// Archive command
program
  .command('archive')
  .description('Archive a completed change')
  .argument('[id]', 'Change ID to archive (interactive if omitted)')
  .option('-y, --yes', 'Non-interactive mode (skip confirmations)')
  .option('--skip-specs', 'Skip spec updates (tooling-only changes)')
  .action(archiveCommand);

// Default action - show dashboard
program.action(async () => {
  await viewCommand({});
});

// Error handling
program.exitOverride();

try {
  await program.parseAsync(process.argv);
} catch (err) {
  if (err instanceof Error && 'code' in err && err.code === 'commander.help') {
    process.exit(0);
  }
  console.error(PALETTE.error('Error:'), err instanceof Error ? err.message : err);
  process.exit(1);
}
