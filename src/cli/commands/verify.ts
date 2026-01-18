import { existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { glob } from 'glob';
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
} from '../ui/index.js';

interface VerifyOptions {
  strict?: boolean;
  verbose?: boolean;
}

interface Requirement {
  name: string;
  scenarios: Scenario[];
}

interface Scenario {
  name: string;
  when: string;
  then: string[];
  testMatch?: TestMatch;
}

interface TestMatch {
  file: string;
  line: number;
  name: string;
  confidence: 'high' | 'medium' | 'low';
}

interface VerifyResult {
  requirements: Requirement[];
  coverage: {
    requirements: number;
    requirementsTotal: number;
    scenarios: number;
    scenariosTotal: number;
  };
  issues: {
    missingTests: Scenario[];
    extraTests: TestMatch[];
  };
  verdict: 'pass' | 'fail';
}

export async function verifyCommand(id: string | undefined, options: VerifyOptions): Promise<void> {
  const superspecPath = join(process.cwd(), 'superspec');

  if (!existsSync(superspecPath)) {
    console.log(PALETTE.error('SuperSpec not initialized. Run: superspec init'));
    process.exit(1);
  }

  // Interactive mode if no ID provided
  if (!id) {
    if (!isInteractive()) {
      console.log(PALETTE.error('Please specify a change ID to verify.'));
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

    id = await selectChange(changes, 'Select a change to verify:');
  }

  const changePath = join(superspecPath, 'changes', id);
  const specsPath = join(changePath, 'specs');

  if (!existsSync(changePath)) {
    console.log(PALETTE.error(`Change not found: ${id}`));
    process.exit(1);
  }

  if (!existsSync(specsPath)) {
    console.log(PALETTE.error(`No specs found for change: ${id}`));
    process.exit(1);
  }

  console.log(commandHeader(`verify ${id}`, 'Implementation verification'));

  // Parse specs
  const specSpinner = startSpinner('Parsing specifications...');
  const requirements = await parseSpecs(specsPath);
  spinnerSuccess(specSpinner, `Found ${requirements.length} requirements`);

  // Find test files
  const testSpinner = startSpinner('Scanning test files...');
  const testFiles = await findTestFiles();
  spinnerSuccess(testSpinner, `Found ${testFiles.length} test files`);

  // Match scenarios to tests
  const matchSpinner = startSpinner('Matching scenarios to tests...');
  const result = await matchScenariosToTests(requirements, testFiles, options);
  spinnerSuccess(matchSpinner, 'Analysis complete');

  console.log();

  // Print report
  printVerifyReport(result, options);

  if (result.verdict === 'fail') {
    process.exit(1);
  }
}

async function parseSpecs(specsPath: string): Promise<Requirement[]> {
  const requirements: Requirement[] = [];
  const entries = readdirSync(specsPath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const specFile = join(specsPath, entry.name, 'spec.md');
      if (existsSync(specFile)) {
        const content = readFileSync(specFile, 'utf-8');
        requirements.push(...parseSpecContent(content));
      }
    }
  }

  return requirements;
}

function parseSpecContent(content: string): Requirement[] {
  const requirements: Requirement[] = [];
  const lines = content.split('\n');

  let currentReq: Requirement | null = null;
  let currentScenario: Scenario | null = null;

  for (const line of lines) {
    // Match requirement
    const reqMatch = line.match(/^### Requirement: (.+)$/);
    if (reqMatch?.[1]) {
      if (currentReq) {
        if (currentScenario) {
          currentReq.scenarios.push(currentScenario);
        }
        requirements.push(currentReq);
      }
      currentReq = { name: reqMatch[1], scenarios: [] };
      currentScenario = null;
      continue;
    }

    // Match scenario
    const scenarioMatch = line.match(/^#### Scenario: (.+)$/);
    if (scenarioMatch?.[1] && currentReq) {
      if (currentScenario) {
        currentReq.scenarios.push(currentScenario);
      }
      currentScenario = { name: scenarioMatch[1], when: '', then: [] };
      continue;
    }

    // Match WHEN
    const whenMatch = line.match(/^\s*-\s*\*\*WHEN\*\*\s*(.+)$/);
    if (whenMatch?.[1] && currentScenario) {
      currentScenario.when = whenMatch[1];
      continue;
    }

    // Match THEN
    const thenMatch = line.match(/^\s*-\s*\*\*THEN\*\*\s*(.+)$/);
    if (thenMatch?.[1] && currentScenario) {
      currentScenario.then.push(thenMatch[1]);
      continue;
    }

    // Match AND
    const andMatch = line.match(/^\s*-\s*\*\*AND\*\*\s*(.+)$/);
    if (andMatch?.[1] && currentScenario) {
      currentScenario.then.push(andMatch[1]);
    }
  }

  // Don't forget the last ones
  if (currentReq) {
    if (currentScenario) {
      currentReq.scenarios.push(currentScenario);
    }
    requirements.push(currentReq);
  }

  return requirements;
}

async function findTestFiles(): Promise<string[]> {
  const patterns = [
    '**/*.test.ts',
    '**/*.test.js',
    '**/*.spec.ts',
    '**/*.spec.js',
    '**/test/**/*.ts',
    '**/test/**/*.js',
    '**/tests/**/*.ts',
    '**/tests/**/*.js',
  ];

  const files: string[] = [];
  for (const pattern of patterns) {
    const matches = await glob(pattern, {
      ignore: ['node_modules/**', 'dist/**'],
    });
    files.push(...matches);
  }

  return [...new Set(files)];
}

async function matchScenariosToTests(
  requirements: Requirement[],
  testFiles: string[],
  options: VerifyOptions
): Promise<VerifyResult> {
  const allTests: TestMatch[] = [];

  // Parse test files to find test names
  for (const file of testFiles) {
    if (existsSync(file)) {
      const content = readFileSync(file, 'utf-8');
      const lines = content.split('\n');

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Match test/it/describe patterns
        const testMatch = line?.match(/(?:test|it|describe)\s*\(\s*['"`]([^'"`]+)['"`]/);
        if (testMatch?.[1]) {
          allTests.push({
            file,
            line: i + 1,
            name: testMatch[1],
            confidence: 'high',
          });
        }
      }
    }
  }

  // Match scenarios to tests
  const missingTests: Scenario[] = [];
  let matchedScenarios = 0;

  for (const req of requirements) {
    for (const scenario of req.scenarios) {
      const match = findMatchingTest(scenario.name, allTests);
      if (match) {
        scenario.testMatch = match;
        matchedScenarios++;
      } else {
        missingTests.push(scenario);
      }
    }
  }

  // Find extra tests (not matching any scenario)
  const matchedTestNames = new Set(
    requirements
      .flatMap(r => r.scenarios)
      .filter(s => s.testMatch)
      .map(s => s.testMatch!.name)
  );

  const extraTests = options.strict
    ? allTests.filter(t => !matchedTestNames.has(t.name))
    : [];

  const totalScenarios = requirements.reduce((sum, r) => sum + r.scenarios.length, 0);
  const reqsWithCoverage = requirements.filter(r =>
    r.scenarios.every(s => s.testMatch)
  ).length;

  return {
    requirements,
    coverage: {
      requirements: reqsWithCoverage,
      requirementsTotal: requirements.length,
      scenarios: matchedScenarios,
      scenariosTotal: totalScenarios,
    },
    issues: {
      missingTests,
      extraTests,
    },
    verdict: missingTests.length === 0 ? 'pass' : 'fail',
  };
}

function findMatchingTest(scenarioName: string, tests: TestMatch[]): TestMatch | undefined {
  // Normalize names for comparison
  const normalized = scenarioName.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const words = normalized.split(' ').filter(w => w.length > 2);

  let bestMatch: TestMatch | undefined;
  let bestScore = 0;

  for (const test of tests) {
    const testNormalized = test.name.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

    // Exact match
    if (testNormalized === normalized) {
      return { ...test, confidence: 'high' };
    }

    // Word matching score
    const testWords = testNormalized.split(' ').filter(w => w.length > 2);
    const matchingWords = words.filter(w => testWords.includes(w));
    const score = matchingWords.length / Math.max(words.length, testWords.length);

    if (score > bestScore && score >= 0.5) {
      bestScore = score;
      bestMatch = {
        ...test,
        confidence: score >= 0.8 ? 'high' : score >= 0.6 ? 'medium' : 'low',
      };
    }
  }

  return bestMatch;
}

function printVerifyReport(result: VerifyResult, options: VerifyOptions): void {
  // Coverage summary
  console.log();
  console.log(sectionDivider());
  console.log();
  console.log(`  ${PALETTE.bold(PALETTE.white('📊 Coverage Summary'))}`);
  console.log();

  const reqPercent = result.coverage.requirementsTotal > 0
    ? Math.round((result.coverage.requirements / result.coverage.requirementsTotal) * 100)
    : 0;
  const scenarioPercent = result.coverage.scenariosTotal > 0
    ? Math.round((result.coverage.scenarios / result.coverage.scenariosTotal) * 100)
    : 0;

  console.log(`  ${PALETTE.midGray('Requirements:')} ${createProgressBar(result.coverage.requirements, result.coverage.requirementsTotal, 20)} ${result.coverage.requirements}/${result.coverage.requirementsTotal} ${PALETTE.midGray(`(${reqPercent}%)`)}`);
  console.log(`  ${PALETTE.midGray('Scenarios:   ')} ${createProgressBar(result.coverage.scenarios, result.coverage.scenariosTotal, 20)} ${result.coverage.scenarios}/${result.coverage.scenariosTotal} ${PALETTE.midGray(`(${scenarioPercent}%)`)}`);

  // Requirement coverage detail
  if (options.verbose) {
    console.log();
    console.log(sectionDivider());
    console.log();
    console.log(`  ${PALETTE.bold(PALETTE.white('📋 Requirement Coverage'))}`);
    console.log();

    for (const req of result.requirements) {
      const allCovered = req.scenarios.every(s => s.testMatch);
      const icon = allCovered
        ? PALETTE.success(SYMBOLS.success)
        : PALETTE.error(SYMBOLS.error);
      console.log(`  ${icon} ${PALETTE.primary(req.name)}`);

      for (const scenario of req.scenarios) {
        const sIcon = scenario.testMatch
          ? PALETTE.success('  ' + SYMBOLS.success)
          : PALETTE.error('  ' + SYMBOLS.error);

        if (scenario.testMatch) {
          const confidence = scenario.testMatch.confidence === 'high'
            ? ''
            : PALETTE.warning(` [${scenario.testMatch.confidence}]`);
          console.log(`  ${sIcon} ${scenario.name}${confidence}`);
          console.log(`      ${PALETTE.darkGray('→')} ${PALETTE.midGray(`${scenario.testMatch.file}:${scenario.testMatch.line}`)}`);
        } else {
          console.log(`  ${sIcon} ${scenario.name} ${PALETTE.error('(no test found)')}`);
        }
      }
      console.log();
    }
  }

  // Issues
  if (result.issues.missingTests.length > 0) {
    console.log();
    console.log(sectionDivider());
    console.log();
    console.log(`  ${PALETTE.bold(PALETTE.white('⚠️  Missing Tests'))}`);
    console.log();
    for (const scenario of result.issues.missingTests) {
      console.log(`  ${PALETTE.error(SYMBOLS.error)} ${scenario.name}`);
    }
  }

  if (result.issues.extraTests.length > 0) {
    console.log();
    console.log(sectionDivider());
    console.log();
    console.log(`  ${PALETTE.bold(PALETTE.white('📝 Extra Tests (not in Specs)'))}`);
    console.log();
    const displayCount = Math.min(result.issues.extraTests.length, 10);
    for (const test of result.issues.extraTests.slice(0, displayCount)) {
      console.log(`  ${PALETTE.warning(SYMBOLS.warning)} ${test.name}`);
      console.log(`    ${PALETTE.midGray(`${test.file}:${test.line}`)}`);
    }
    if (result.issues.extraTests.length > 10) {
      console.log(`  ${PALETTE.midGray(`... and ${result.issues.extraTests.length - 10} more`)}`);
    }
  }

  // Verdict
  console.log();
  console.log(sectionDivider());
  console.log();

  if (result.verdict === 'pass') {
    console.log(`  ${PALETTE.success(SYMBOLS.success)} ${PALETTE.bold(PALETTE.success('READY TO ARCHIVE'))}`);
    console.log();
    console.log(`  ${PALETTE.midGray('Next:')} ${PALETTE.white('superspec archive <change-id>')}`);
  } else {
    console.log(`  ${PALETTE.error(SYMBOLS.error)} ${PALETTE.bold(PALETTE.error('NEEDS WORK'))}`);
    console.log();
    console.log(`  ${PALETTE.midGray('Write tests for missing scenarios before archiving.')}`);
  }

  console.log();
}
