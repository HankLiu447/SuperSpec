import { existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { validateSpec, ValidationResult } from '../../core/validation/spec-validator.js';
import {
  PALETTE,
  ICONS,
  commandHeader,
  sectionHeader,
  createProgressBar,
  startSpinner,
  spinnerSuccess,
  isInteractive,
  selectPrompt,
  displayStats,
} from '../ui/index.js';

interface ValidateOptions {
  all?: boolean;
  strict?: boolean;
  verbose?: boolean;
}

interface NamedValidationResult extends ValidationResult {
  specName: string;
}

export async function validateCommand(id: string | undefined, options: ValidateOptions): Promise<void> {
  const superspecPath = join(process.cwd(), 'superspec');

  if (!existsSync(superspecPath)) {
    console.log(`  ${ICONS.error} ${PALETTE.error('SuperSpec not initialized.')}`);
    console.log(`  ${PALETTE.dim('Run:')} ${PALETTE.accent('superspec init')}`);
    process.exit(1);
  }

  if (options.all) {
    await validateAll(superspecPath, options);
  } else if (id) {
    await validateChange(superspecPath, id, options);
  } else {
    // Interactive mode - let user select a change
    if (isInteractive()) {
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
        console.log(`  ${ICONS.warning} ${PALETTE.warning('No active changes found.')}`);
        console.log(`  ${PALETTE.dim('Use --all to validate all specs.')}`);
        return;
      }

      const choice = await selectPrompt({
        message: 'Select what to validate:',
        choices: [
          { name: `${PALETTE.primary('›')} All specs`, value: '__all__' },
          ...changes.map(c => ({ name: `${PALETTE.primary('›')} ${c}`, value: c })),
        ],
      });

      if (choice === '__all__') {
        await validateAll(superspecPath, options);
      } else {
        await validateChange(superspecPath, choice as string, options);
      }
    } else {
      console.log(`  ${ICONS.error} ${PALETTE.error('Please specify a change ID or use --all')}`);
      process.exit(1);
    }
  }
}

async function validateChange(
  superspecPath: string,
  id: string,
  options: ValidateOptions
): Promise<void> {
  const changePath = join(superspecPath, 'changes', id);
  const specsPath = join(changePath, 'specs');

  if (!existsSync(changePath)) {
    console.log(`  ${ICONS.error} ${PALETTE.error(`Change not found: ${id}`)}`);
    process.exit(1);
  }

  if (!existsSync(specsPath)) {
    console.log(`  ${ICONS.warning} ${PALETTE.warning(`No specs found for change: ${id}`)}`);
    return;
  }

  console.log(commandHeader(`validate ${id}`, 'Validating change specifications'));

  const spinner = startSpinner('Scanning specifications...');
  const results: NamedValidationResult[] = [];
  const entries = readdirSync(specsPath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const specFile = join(specsPath, entry.name, 'spec.md');
      if (existsSync(specFile)) {
        const content = readFileSync(specFile, 'utf-8');
        const result = validateSpec(content, entry.name, true);
        results.push({ ...result, specName: entry.name });
      }
    }
  }

  spinnerSuccess(spinner, `Found ${results.length} specifications`);

  // Display detailed results if verbose
  if (options.verbose) {
    console.log(sectionHeader('Specification Details', '📋'));
    console.log();

    for (const result of results) {
      printDetailedResult(result);
    }
  }

  printSummary(results, options);
}

async function validateAll(superspecPath: string, options: ValidateOptions): Promise<void> {
  console.log(commandHeader('validate --all', 'Validating all specifications'));

  const spinner = startSpinner('Scanning all specifications...');
  const results: NamedValidationResult[] = [];

  // Validate main specs
  const mainSpecsPath = join(superspecPath, 'specs');
  if (existsSync(mainSpecsPath)) {
    const entries = readdirSync(mainSpecsPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const specFile = join(mainSpecsPath, entry.name, 'spec.md');
        if (existsSync(specFile)) {
          const content = readFileSync(specFile, 'utf-8');
          const result = validateSpec(content, entry.name, false);
          results.push({ ...result, specName: entry.name });
        }
      }
    }
  }

  // Validate active changes
  const changesPath = join(superspecPath, 'changes');
  if (existsSync(changesPath)) {
    const changeEntries = readdirSync(changesPath, { withFileTypes: true });
    for (const changeEntry of changeEntries) {
      if (changeEntry.isDirectory() && changeEntry.name !== 'archive') {
        const specsPath = join(changesPath, changeEntry.name, 'specs');
        if (existsSync(specsPath)) {
          const specEntries = readdirSync(specsPath, { withFileTypes: true });
          for (const specEntry of specEntries) {
            if (specEntry.isDirectory()) {
              const specFile = join(specsPath, specEntry.name, 'spec.md');
              if (existsSync(specFile)) {
                const content = readFileSync(specFile, 'utf-8');
                const specName = `${changeEntry.name}/${specEntry.name}`;
                const result = validateSpec(content, specName, true);
                results.push({ ...result, specName });
              }
            }
          }
        }
      }
    }
  }

  spinnerSuccess(spinner, `Scanned ${results.length} specifications`);

  if (options.verbose) {
    console.log(sectionHeader('Specification Details', '📋'));
    console.log();

    for (const result of results) {
      printDetailedResult(result);
    }
  }

  printSummary(results, options);
}

function printDetailedResult(result: NamedValidationResult): void {
  const icon = result.valid ? ICONS.success : ICONS.error;
  const nameStyle = result.valid ? PALETTE.primaryBright : PALETTE.error;

  console.log(`  ${icon} ${nameStyle(result.specName)}`);

  if (result.errors.length > 0) {
    for (const error of result.errors) {
      const line = error.line ? PALETTE.dark(` (line ${error.line})`) : '';
      console.log(`    ${PALETTE.error('ERROR')} ${PALETTE.muted(error.message)}${line}`);
    }
  }

  if (result.warnings.length > 0) {
    for (const warning of result.warnings) {
      console.log(`    ${PALETTE.warning('WARN')} ${PALETTE.muted(warning.message)}`);
    }
  }

  // Stats
  console.log(`    ${PALETTE.dim(`${result.stats.requirements} requirements, ${result.stats.scenarios} scenarios`)}`);
  console.log();
}

function printSummary(results: NamedValidationResult[], options: ValidateOptions): void {
  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
  const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);
  const totalRequirements = results.reduce((sum, r) => sum + r.stats.requirements, 0);
  const totalScenarios = results.reduce((sum, r) => sum + r.stats.scenarios, 0);
  const validSpecs = results.filter(r => r.valid).length;

  const hasErrors = totalErrors > 0;
  const hasWarnings = totalWarnings > 0;
  const failStrict = options.strict && hasWarnings;

  console.log(sectionHeader('Summary', '📊'));
  console.log();

  // Progress bar showing valid specs
  const bar = createProgressBar(validSpecs, results.length, { width: 25 });
  console.log(`  ${PALETTE.dim('Validation:')} ${bar} ${validSpecs}/${results.length}`);
  console.log();

  displayStats([
    { label: 'Specs', value: results.length },
    { label: 'Requirements', value: totalRequirements },
    { label: 'Scenarios', value: totalScenarios },
  ]);
  console.log();

  if (hasErrors) {
    console.log(`  ${ICONS.error} ${PALETTE.error(`${totalErrors} errors`)}`);
  }
  if (hasWarnings) {
    console.log(`  ${ICONS.warning} ${PALETTE.warning(`${totalWarnings} warnings`)}`);
  }

  console.log();
  console.log(`  ${PALETTE.subtle('─'.repeat(50))}`);
  console.log();

  if (hasErrors) {
    console.log(`  ${ICONS.error} ${PALETTE.bold(PALETTE.error('Validation FAILED'))}`);
    console.log(`  ${PALETTE.dim('Fix errors before proceeding.')}`);
    process.exit(1);
  } else if (failStrict) {
    console.log(`  ${ICONS.warning} ${PALETTE.bold(PALETTE.warning('Validation FAILED (strict mode)'))}`);
    console.log(`  ${PALETTE.dim('Fix warnings before proceeding.')}`);
    process.exit(1);
  } else {
    console.log(`  ${ICONS.success} ${PALETTE.bold(PALETTE.success('Validation PASSED'))}`);
  }

  console.log();
}
