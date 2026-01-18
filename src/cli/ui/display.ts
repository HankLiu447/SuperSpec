/**
 * Display Utilities
 *
 * Enhanced display components for the SuperSpec CLI
 * Follows the "Precision Terminal" design language
 */

import {
  PALETTE,
  BOX,
  SYMBOLS,
  ICONS,
  sectionHeader,
  createProgressBar,
  statusIndicator,
  formatPath,
} from './palette.js';

// ═══════════════════════════════════════════════════════════════════════════════
// BASIC DISPLAY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Display a header with decoration
 */
export function displayHeader(title: string, subtitle?: string): void {
  console.log();
  console.log(`  ${ICONS.logo} ${PALETTE.bold(PALETTE.white(title))}`);
  if (subtitle) {
    console.log(`     ${PALETTE.dim(subtitle)}`);
  }
  console.log(`  ${PALETTE.subtle('─'.repeat(55))}`);
}

/**
 * Display a section header
 */
export function displaySection(title: string, icon?: string): void {
  console.log(sectionHeader(title, icon));
}

/**
 * Display an empty line
 */
export function displayEmptyLine(): void {
  console.log();
}

/**
 * Display a divider line
 */
export function displayDivider(style: 'normal' | 'light' | 'heavy' = 'normal'): void {
  const chars = {
    normal: '─',
    light: '┄',
    heavy: '━',
  };
  console.log(`  ${PALETTE.subtle(chars[style].repeat(55))}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// BOX COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Display a box around content
 */
export function displayBox(lines: string[], options?: {
  title?: string;
  width?: number;
  padding?: number;
  style?: 'default' | 'accent' | 'success' | 'warning' | 'error';
}): void {
  const width = options?.width ?? 60;
  const padding = options?.padding ?? 1;
  const style = options?.style ?? 'default';
  const padStr = ' '.repeat(padding);

  const colorFn = {
    default: PALETTE.subtle,
    accent: PALETTE.accent,
    success: PALETTE.success,
    warning: PALETTE.warning,
    error: PALETTE.error,
  }[style];

  // Top border
  if (options?.title) {
    const icon = style === 'success' ? ICONS.success :
      style === 'error' ? ICONS.error :
        style === 'warning' ? ICONS.warning :
          style === 'accent' ? PALETTE.accent('◆') :
            PALETTE.primary('◆');
    const titlePart = ` ${icon} ${PALETTE.bold(PALETTE.white(options.title))} `;
    const titleLen = options.title.length + 5;
    const remainingWidth = width - titleLen - 2;
    const leftLen = Math.floor(remainingWidth / 2);
    const rightLen = remainingWidth - leftLen;
    console.log(
      colorFn(BOX.topLeft + BOX.horizontal.repeat(leftLen)) +
      titlePart +
      colorFn(BOX.horizontal.repeat(rightLen) + BOX.topRight)
    );
  } else {
    console.log(colorFn(BOX.topLeft + BOX.horizontal.repeat(width - 2) + BOX.topRight));
  }

  // Content lines
  for (const line of lines) {
    const contentWidth = width - 2 - (padding * 2);
    // Strip ANSI for length calculation
    const visibleLength = line.replace(/\x1b\[[0-9;]*m/g, '').length;
    const padAmount = Math.max(0, contentWidth - visibleLength);
    console.log(colorFn(BOX.vertical) + padStr + line + ' '.repeat(padAmount) + padStr + colorFn(BOX.vertical));
  }

  // Bottom border
  console.log(colorFn(BOX.bottomLeft + BOX.horizontal.repeat(width - 2) + BOX.bottomRight));
}

/**
 * Display an info card (inline key-value with icon)
 */
export function displayInfoCard(label: string, value: string, icon?: string): void {
  const iconStr = icon ? `${icon} ` : '';
  console.log(`  ${PALETTE.subtle('│')} ${iconStr}${PALETTE.dim(label + ':')} ${PALETTE.white(value)}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// TABLE COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Display a styled table
 */
export function displayTable(
  headers: string[],
  rows: string[][],
  options?: {
    columnWidths?: number[];
    indent?: number;
  }
): void {
  const indent = ' '.repeat(options?.indent ?? 2);
  const widths = options?.columnWidths ?? headers.map((h, i) => {
    const maxContent = Math.max(
      h.replace(/\x1b\[[0-9;]*m/g, '').length,
      ...rows.map(r => (r[i] ?? '').replace(/\x1b\[[0-9;]*m/g, '').length)
    );
    return Math.min(maxContent + 2, 35);
  });

  // Header
  const headerRow = headers.map((h, i) => {
    const w = widths[i] ?? 15;
    return PALETTE.bold(PALETTE.dim(h.padEnd(w)));
  }).join(PALETTE.dark(' │ '));
  console.log(`${indent}${headerRow}`);

  // Separator
  const separator = widths.map(w => PALETTE.dark('─'.repeat(w))).join(PALETTE.dark('─┼─'));
  console.log(`${indent}${separator}`);

  // Rows
  for (const row of rows) {
    const formattedRow = row.map((cell, i) => {
      const w = widths[i] ?? 15;
      const visibleLength = (cell ?? '').replace(/\x1b\[[0-9;]*m/g, '').length;
      const padAmount = Math.max(0, w - visibleLength);
      return (cell ?? '') + ' '.repeat(padAmount);
    }).join(PALETTE.dark(' │ '));
    console.log(`${indent}${formattedRow}`);
  }
}

/**
 * Display a simple key-value table
 */
export function displayKeyValueTable(entries: Array<{ key: string; value: string }>, options?: {
  indent?: number;
  keyWidth?: number;
}): void {
  const indent = ' '.repeat(options?.indent ?? 2);
  const keyWidth = options?.keyWidth ?? 20;

  for (const { key, value } of entries) {
    console.log(`${indent}${PALETTE.dim(key.padEnd(keyWidth))} ${value}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// LIST COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Display a list with bullets
 */
export function displayList(items: string[], options?: {
  indent?: number;
  icon?: string;
  style?: 'default' | 'numbered' | 'checkbox';
}): void {
  const indent = ' '.repeat(options?.indent ?? 2);
  const style = options?.style ?? 'default';

  items.forEach((item, i) => {
    let prefix: string;
    if (style === 'numbered') {
      prefix = PALETTE.accent(`${i + 1}.`);
    } else if (style === 'checkbox') {
      prefix = PALETTE.dim('☐');
    } else {
      prefix = options?.icon ?? PALETTE.primary('›');
    }
    console.log(`${indent}${prefix} ${item}`);
  });
}

/**
 * Display a tree structure
 */
export function displayTree(
  items: Array<{ name: string; icon?: string; children?: Array<{ name: string; icon?: string }> }>,
  options?: { indent?: number }
): void {
  const indent = ' '.repeat(options?.indent ?? 2);

  for (let i = 0; i < items.length; i++) {
    const item = items[i]!;
    const isLast = i === items.length - 1;
    const connector = isLast ? PALETTE.dim('╰─') : PALETTE.dim('├─');
    const itemIcon = item.icon ?? PALETTE.primary('◆');

    console.log(`${indent}${connector} ${itemIcon} ${PALETTE.white(item.name)}`);

    if (item.children && item.children.length > 0) {
      const childIndent = indent + (isLast ? '   ' : PALETTE.dim('│') + '  ');

      for (let j = 0; j < item.children.length; j++) {
        const child = item.children[j]!;
        const childIsLast = j === item.children.length - 1;
        const childConnector = childIsLast ? PALETTE.dark('╰─') : PALETTE.dark('├─');
        const childIcon = child.icon ?? PALETTE.dim('○');

        console.log(`${childIndent}${childConnector} ${childIcon} ${PALETTE.muted(child.name)}`);
      }
    }
  }
}

/**
 * Display a file tree with path formatting
 */
export function displayFileTree(
  files: Array<{ path: string; status?: 'added' | 'modified' | 'removed' | 'unchanged' }>,
  options?: { indent?: number }
): void {
  const indent = ' '.repeat(options?.indent ?? 2);

  files.forEach((file, i) => {
    const isLast = i === files.length - 1;
    const connector = isLast ? PALETTE.dim('╰─') : PALETTE.dim('├─');

    let icon: string;
    let pathStyle: (s: string) => string;

    switch (file.status) {
      case 'added':
        icon = PALETTE.success('+');
        pathStyle = PALETTE.success;
        break;
      case 'modified':
        icon = PALETTE.warning('~');
        pathStyle = PALETTE.warning;
        break;
      case 'removed':
        icon = PALETTE.error('-');
        pathStyle = PALETTE.error;
        break;
      default:
        icon = PALETTE.dim('○');
        pathStyle = (s: string) => formatPath(s);
    }

    console.log(`${indent}${connector} ${icon} ${pathStyle(file.path)}`);
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// KEY-VALUE DISPLAY
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Display a key-value pair
 */
export function displayKeyValue(key: string, value: string, options?: {
  keyWidth?: number;
  indent?: number;
}): void {
  const keyWidth = options?.keyWidth ?? 15;
  const indent = ' '.repeat(options?.indent ?? 2);
  console.log(`${indent}${PALETTE.dim(key.padEnd(keyWidth))} ${value}`);
}

/**
 * Display a labeled value with icon
 */
export function displayLabeledValue(label: string, value: string, icon?: string): void {
  const iconStr = icon ? `${icon} ` : '  ';
  console.log(`${iconStr}${PALETTE.dim(label + ':')} ${PALETTE.white(value)}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROGRESS DISPLAY
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Display a progress bar with label
 */
export function displayProgress(label: string, current: number, total: number, options?: {
  width?: number;
  showCount?: boolean;
}): void {
  const bar = createProgressBar(current, total, {
    width: options?.width ?? 25,
    showCount: options?.showCount ?? true,
  });
  console.log(`  ${PALETTE.dim(label.padEnd(15))} ${bar}`);
}

/**
 * Display a status line with indicator
 */
export function displayStatus(
  label: string,
  status: 'success' | 'warning' | 'error' | 'info' | 'pending' | 'active'
): void {
  const indicator = statusIndicator(status);
  const statusLabels: Record<string, string> = {
    success: PALETTE.success('passed'),
    warning: PALETTE.warning('warning'),
    error: PALETTE.error('failed'),
    info: PALETTE.info('info'),
    pending: PALETTE.dim('pending'),
    active: PALETTE.primaryBright('active'),
  };
  console.log(`  ${indicator} ${PALETTE.white(label)} ${PALETTE.dim('─')} ${statusLabels[status]}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// MESSAGE DISPLAY
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Display success message
 */
export function displaySuccess(message: string): void {
  console.log();
  console.log(`  ${ICONS.success} ${PALETTE.success(message)}`);
}

/**
 * Display error message
 */
export function displayError(message: string): void {
  console.log();
  console.log(`  ${ICONS.error} ${PALETTE.error(message)}`);
}

/**
 * Display warning message
 */
export function displayWarning(message: string): void {
  console.log();
  console.log(`  ${ICONS.warning} ${PALETTE.warning(message)}`);
}

/**
 * Display info message
 */
export function displayInfo(message: string): void {
  console.log();
  console.log(`  ${ICONS.info} ${PALETTE.info(message)}`);
}

/**
 * Display a tip/hint message
 */
export function displayTip(message: string): void {
  console.log(`  ${PALETTE.accent('💡')} ${PALETTE.dim(message)}`);
}

/**
 * Display a note message
 */
export function displayNote(message: string): void {
  console.log(`  ${PALETTE.dim('Note:')} ${PALETTE.muted(message)}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPECIAL DISPLAYS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Display a workflow phase indicator
 */
export function displayPhases(
  phases: string[],
  currentPhase: number,
  options?: { indent?: number }
): void {
  const indent = ' '.repeat(options?.indent ?? 2);

  const phaseDisplay = phases.map((phase, i) => {
    const num = i + 1;
    if (num < currentPhase) {
      return `${PALETTE.success('●')} ${PALETTE.dim(phase)}`;
    } else if (num === currentPhase) {
      return `${PALETTE.accent('●')} ${PALETTE.white(phase)}`;
    } else {
      return `${PALETTE.dark('○')} ${PALETTE.dark(phase)}`;
    }
  }).join(PALETTE.dim(' → '));

  console.log(`${indent}${phaseDisplay}`);
}

/**
 * Display a summary statistics block
 */
export function displayStats(stats: Array<{ label: string; value: string | number; icon?: string }>): void {
  const statsLine = stats.map(s => {
    const icon = s.icon ?? '';
    const iconStr = icon ? `${icon} ` : '';
    return `${iconStr}${PALETTE.dim(s.label + ':')} ${PALETTE.white(String(s.value))}`;
  }).join(PALETTE.dark('  │  '));

  console.log(`  ${statsLine}`);
}

/**
 * Display a command suggestion
 */
export function displayCommand(cmd: string, description?: string): void {
  const desc = description ? PALETTE.dim(` ─ ${description}`) : '';
  console.log(`  ${PALETTE.primary('›')} ${PALETTE.accent(cmd)}${desc}`);
}

/**
 * Display next steps
 */
export function displayNextSteps(steps: string[]): void {
  console.log(sectionHeader('Next Steps', '→'));
  console.log();
  steps.forEach((step, i) => {
    console.log(`  ${PALETTE.accent(`${i + 1}.`)} ${step}`);
  });
}

/**
 * Display quick actions
 */
export function displayQuickActions(actions: Array<{ cmd: string; desc: string }>): void {
  console.log(sectionHeader('Quick Actions', '🚀'));
  console.log();
  actions.forEach((action, i) => {
    console.log(`  ${PALETTE.accent(`${i + 1}.`)} ${PALETTE.white(action.cmd)} ${PALETTE.dim('─ ' + action.desc)}`);
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// VALIDATION RESULT DISPLAY
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Display a validation result item
 */
export function displayValidationItem(
  name: string,
  valid: boolean,
  errors?: string[],
  warnings?: string[]
): void {
  const icon = valid ? ICONS.success : ICONS.error;
  const nameStyle = valid ? PALETTE.primaryBright : PALETTE.error;

  console.log(`  ${icon} ${nameStyle(name)}`);

  if (errors && errors.length > 0) {
    errors.forEach(err => {
      console.log(`    ${PALETTE.error('ERROR')} ${PALETTE.muted(err)}`);
    });
  }

  if (warnings && warnings.length > 0) {
    warnings.forEach(warn => {
      console.log(`    ${PALETTE.warning('WARN')} ${PALETTE.muted(warn)}`);
    });
  }
}

/**
 * Display validation summary
 */
export function displayValidationSummary(passed: number, total: number, hasErrors: boolean): void {
  console.log();
  const bar = createProgressBar(passed, total, { width: 25 });
  console.log(`  ${PALETTE.dim('Validation:')} ${bar} ${passed}/${total}`);
  console.log();

  if (hasErrors) {
    console.log(`  ${ICONS.error} ${PALETTE.bold(PALETTE.error('Validation FAILED'))}`);
  } else {
    console.log(`  ${ICONS.success} ${PALETTE.bold(PALETTE.success('Validation PASSED'))}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CARD DISPLAYS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Display a change card (for list command)
 */
export function displayChangeCard(options: {
  id: string;
  title?: string;
  status: 'active' | 'draft' | 'completed' | 'archived';
  phase?: string;
  progress?: { current: number; total: number };
  specs?: number;
}): void {
  const { id, title, status, phase, progress, specs } = options;

  const statusIcon = statusIndicator(
    status === 'active' ? 'active' :
      status === 'draft' ? 'pending' :
        status === 'completed' ? 'success' : 'info'
  );

  console.log(`  ${PALETTE.subtle('┌─')} ${statusIcon} ${PALETTE.bold(PALETTE.white(id))}`);

  if (title && title !== id) {
    console.log(`  ${PALETTE.subtle('│')}   ${PALETTE.dim(title)}`);
  }

  if (phase) {
    console.log(`  ${PALETTE.subtle('│')}   ${PALETTE.dim('Phase:')} ${PALETTE.accent(phase)}`);
  }

  if (progress) {
    const bar = createProgressBar(progress.current, progress.total, { width: 15 });
    console.log(`  ${PALETTE.subtle('│')}   ${bar}`);
  }

  if (specs !== undefined) {
    console.log(`  ${PALETTE.subtle('│')}   ${PALETTE.dim('Specs:')} ${PALETTE.white(String(specs))}`);
  }

  console.log(`  ${PALETTE.subtle('└─')}`);
}

/**
 * Display a spec card (for list command)
 */
export function displaySpecCard(options: {
  name: string;
  path?: string;
  requirements?: number;
  scenarios?: number;
}): void {
  const { name, path, requirements, scenarios } = options;

  console.log(`  ${PALETTE.subtle('┌─')} ${ICONS.spec} ${PALETTE.bold(PALETTE.primaryBright(name))}`);

  if (path) {
    console.log(`  ${PALETTE.subtle('│')}   ${formatPath(path)}`);
  }

  const stats: string[] = [];
  if (requirements !== undefined) stats.push(`${requirements} requirements`);
  if (scenarios !== undefined) stats.push(`${scenarios} scenarios`);

  if (stats.length > 0) {
    console.log(`  ${PALETTE.subtle('│')}   ${PALETTE.dim(stats.join(' · '))}`);
  }

  console.log(`  ${PALETTE.subtle('└─')}`);
}
