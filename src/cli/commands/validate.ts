import { existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { validateSpec, ValidationResult, ValidationIssue } from '../../core/validation/spec-validator.js';
import {
  PALETTE,
  SYMBOLS,
  commandHeader,
  sectionDivider,
  displayKeyValue,
  createProgressBar,
  startSpinner,
  spinnerSuccess,
  spinnerFail,
  isInteractive,
  selectChange,
  selectPrompt,
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
    console.log(PALETTE.error('SuperSpec not initialized. Run: superspec init'));
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
        console.log(PALETTE.warning('No active changes found.'));
        console.log(PALETTE.midGray('Use --all to validate all specs.'));
        return;
      }

      const choice = await selectPrompt({
        message: 'Select what to validate:',
        choices: [
          { name: PALETTE.primary('All specs'), value: '__all__' },
          ...changes.map(c => ({ name: c, value: c })),
        ],
      });

      if (choice === '__all__') {
        await validateAll(superspecPath, options);
      } else {
        await validateChange(superspecPath, choice as string, options);
      }
    } else {
      console.log(PALETTE.error('Please specify a change ID or use --all'));
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
    console.log(PALETTE.error(`Change not found: ${id}`));
    process.exit(1);
  }

  if (!existsSync(specsPath)) {
    console.log(PALETTE.warning(`No specs found for change: ${id}`));
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
    console.log();
    console.log(sectionDivider());
    console.log();
    console.log(`  ${PALETTE.bold(PALETTE.white('📋 Specification Details'))}`);
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
    console.log();
    console.log(sectionDivider());
    console.log();
    console.log(`  ${PALETTE.bold(PALETTE.white('📋 Specification Details'))}`);
    console.log();
    for (const result of results) {
      printDetailedResult(result);
    }
  }

  printSummary(results, options);
}

function printDetailedResult(result: NamedValidationResult): void {
  const status = result.valid
    ? PALETTE.success(SYMBOLS.success)
    : PALETTE.error(SYMBOLS.error);
  console.log(`  ${status} ${PALETTE.primary(result.specName)}`);

  if (result.errors.length > 0) {
    for (const error of result.errors) {
      const line = error.line ? PALETTE.darkGray(` (line ${error.line})`) : '';
      console.log(`    ${PALETTE.error('ERROR')} ${error.message}${line}`);
    }
  }

  if (result.warnings.length > 0) {
    for (const warning of result.warnings) {
      console.log(`    ${PALETTE.warning('WARN')} ${warning.message}`);
    }
  }

  // Stats
  console.log(`    ${PALETTE.midGray(`${result.stats.requirements} requirements, ${result.stats.scenarios} scenarios`)}`);
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

  console.log();
  console.log(sectionDivider());
  console.log();
  console.log(`  ${PALETTE.bold(PALETTE.white('📊 Summary'))}`);
  console.log();

  // Progress bar showing valid specs
  console.log(`  ${PALETTE.midGray('Specs valid:')} ${createProgressBar(validSpecs, results.length, 20)} ${validSpecs}/${results.length}`);
  console.log();

  console.log(`  ${PALETTE.midGray('Specs validated:')}  ${PALETTE.white(String(results.length))}`);
  console.log(`  ${PALETTE.midGray('Requirements:')}     ${PALETTE.cyan(String(totalRequirements))}`);
  console.log(`  ${PALETTE.midGray('Scenarios:')}        ${PALETTE.cyan(String(totalScenarios))}`);
  console.log();

  if (hasErrors) {
    console.log(`  ${PALETTE.error(SYMBOLS.error)} ${PALETTE.error(`${totalErrors} errors`)}`);
  }
  if (hasWarnings) {
    console.log(`  ${PALETTE.warning(SYMBOLS.warning)} ${PALETTE.warning(`${totalWarnings} warnings`)}`);
  }

  console.log();
  console.log(sectionDivider());
  console.log();

  if (hasErrors) {
    console.log(`  ${PALETTE.error(SYMBOLS.error)} ${PALETTE.bold(PALETTE.error('Validation FAILED'))}`);
    console.log(`  ${PALETTE.midGray('Fix errors before proceeding.')}`);
    process.exit(1);
  } else if (failStrict) {
    console.log(`  ${PALETTE.warning(SYMBOLS.warning)} ${PALETTE.bold(PALETTE.warning('Validation FAILED (strict mode)'))}`);
    console.log(`  ${PALETTE.midGray('Fix warnings before proceeding.')}`);
    process.exit(1);
  } else {
    console.log(`  ${PALETTE.success(SYMBOLS.success)} ${PALETTE.bold(PALETTE.success('Validation PASSED'))}`);
  }

  console.log();
}
