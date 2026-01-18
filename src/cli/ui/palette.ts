/**
 * SuperSpec CLI Visual System
 *
 * Design Direction: "Precision Terminal"
 * Inspired by space mission control panels, precision instruments,
 * and Japanese minimalism with technical precision.
 *
 * Color Philosophy:
 * - Teal as primary: represents precision and professionalism
 * - Amber as accent: draws attention to important elements
 * - Muted grays: clean, non-distracting background text
 */

import chalk from 'chalk';

// ═══════════════════════════════════════════════════════════════════════════════
// COLOR PALETTE
// ═══════════════════════════════════════════════════════════════════════════════

export const PALETTE = {
  // Primary colors - Teal spectrum
  primary: chalk.hex('#14b8a6'),       // Teal-500
  primaryBright: chalk.hex('#2dd4bf'), // Teal-400
  primaryDim: chalk.hex('#0d9488'),    // Teal-600
  primaryMuted: chalk.hex('#115e59'),  // Teal-800

  // Accent - Amber for emphasis
  accent: chalk.hex('#f59e0b'),        // Amber-500
  accentBright: chalk.hex('#fbbf24'),  // Amber-400
  accentDim: chalk.hex('#d97706'),     // Amber-600

  // Secondary - Slate for sophistication
  secondary: chalk.hex('#64748b'),     // Slate-500
  secondaryBright: chalk.hex('#94a3b8'), // Slate-400

  // Status colors - Refined
  success: chalk.hex('#10b981'),       // Emerald-500
  successBright: chalk.hex('#34d399'), // Emerald-400
  warning: chalk.hex('#f59e0b'),       // Amber-500
  error: chalk.hex('#f87171'),         // Red-400
  errorBright: chalk.hex('#fca5a5'),   // Red-300
  info: chalk.hex('#38bdf8'),          // Sky-400

  // Neutral colors - Cool gray spectrum
  white: chalk.hex('#f8fafc'),         // Slate-50
  light: chalk.hex('#e2e8f0'),         // Slate-200
  muted: chalk.hex('#94a3b8'),         // Slate-400
  dim: chalk.hex('#64748b'),           // Slate-500
  subtle: chalk.hex('#475569'),        // Slate-600
  dark: chalk.hex('#334155'),          // Slate-700
  darker: chalk.hex('#1e293b'),        // Slate-800

  // Text styles
  bold: chalk.bold,
  italic: chalk.italic,
  underline: chalk.underline,
  strikethrough: chalk.strikethrough,

  // Legacy aliases for compatibility
  cyan: chalk.hex('#14b8a6'),
  lightGray: chalk.hex('#94a3b8'),
  midGray: chalk.hex('#64748b'),
  darkGray: chalk.hex('#475569'),
};

// ═══════════════════════════════════════════════════════════════════════════════
// ICONS & SYMBOLS
// ═══════════════════════════════════════════════════════════════════════════════

export const ICONS = {
  // Status indicators - Modern geometric
  success: PALETTE.success('◆'),
  error: PALETTE.error('◆'),
  warning: PALETTE.warning('◆'),
  info: PALETTE.info('◆'),
  pending: PALETTE.dim('◇'),

  // Check marks
  check: PALETTE.success('✓'),
  cross: PALETTE.error('✗'),
  dot: PALETTE.primary('•'),

  // Arrows and pointers
  arrowRight: PALETTE.primary('→'),
  arrowLeft: PALETTE.primary('←'),
  arrowUp: PALETTE.primary('↑'),
  arrowDown: PALETTE.primary('↓'),
  pointer: PALETTE.accent('▸'),
  chevron: PALETTE.primary('›'),

  // Document and file
  file: PALETTE.dim('□'),
  fileFilled: PALETTE.primary('■'),
  folder: PALETTE.accent('◫'),
  spec: PALETTE.primary('◈'),

  // Progress and selection
  radioOn: PALETTE.success('◉'),
  radioOff: PALETTE.dim('○'),
  checkboxOn: PALETTE.success('☑'),
  checkboxOff: PALETTE.dim('☐'),

  // Decorative
  star: PALETTE.accent('★'),
  diamond: PALETTE.primary('◆'),
  square: PALETTE.dim('■'),
  circle: PALETTE.dim('●'),

  // Workflow
  play: PALETTE.success('▶'),
  pause: PALETTE.warning('⏸'),
  stop: PALETTE.error('⏹'),
  refresh: PALETTE.info('↻'),

  // Brand
  logo: PALETTE.primary('⬡'),
  logoAlt: PALETTE.accent('⬢'),
};

// Legacy alias
export const SYMBOLS = {
  success: ICONS.check,
  error: ICONS.cross,
  warning: PALETTE.warning('⚠'),
  info: PALETTE.info('ℹ'),
  arrow: ICONS.chevron,
  pointer: ICONS.pointer,
  selected: ICONS.radioOn,
  unselected: ICONS.radioOff,
  checkbox: ICONS.checkboxOn,
  uncheckbox: ICONS.checkboxOff,
  filledBar: PALETTE.success('█'),
  emptyBar: PALETTE.dark('░'),
  spinner: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
  bullet: ICONS.dot,
  dash: PALETTE.dim('─'),
  verticalLine: PALETTE.dim('│'),
  corner: PALETTE.dim('└'),
  tee: PALETTE.dim('├'),
};

// ═══════════════════════════════════════════════════════════════════════════════
// BOX DRAWING CHARACTERS
// ═══════════════════════════════════════════════════════════════════════════════

export const BOX = {
  // Single line (default)
  topLeft: '╭',
  topRight: '╮',
  bottomLeft: '╰',
  bottomRight: '╯',
  horizontal: '─',
  vertical: '│',
  teeLeft: '├',
  teeRight: '┤',
  teeTop: '┬',
  teeBottom: '┴',
  cross: '┼',

  // Double line (for emphasis)
  doubleH: '═',
  doubleV: '║',
  doubleTopLeft: '╔',
  doubleTopRight: '╗',
  doubleBottomLeft: '╚',
  doubleBottomRight: '╝',

  // Heavy line (for headers)
  heavyH: '━',
  heavyV: '┃',
  heavyTopLeft: '┏',
  heavyTopRight: '┓',
  heavyBottomLeft: '┗',
  heavyBottomRight: '┛',

  // Mixed corners
  roundTopLeft: '╭',
  roundTopRight: '╮',
  roundBottomLeft: '╰',
  roundBottomRight: '╯',
};

// ═══════════════════════════════════════════════════════════════════════════════
// DECORATIVE LINES
// ═══════════════════════════════════════════════════════════════════════════════

export const LINES = {
  thin: '─',
  thick: '━',
  double: '═',
  dotted: '┄',
  dashed: '┈',
};

// ═══════════════════════════════════════════════════════════════════════════════
// BANNER - Modern Geometric Design
// ═══════════════════════════════════════════════════════════════════════════════

const BANNER_ART = `
  ╭────────────────────────────────────────────────────────────────────────────────╮
  │                                                                                │
  │   ███████╗██╗   ██╗██████╗ ███████╗██████╗ ███████╗██████╗ ███████╗ ██████╗    │
  │   ██╔════╝██║   ██║██╔══██╗██╔════╝██╔══██╗██╔════╝██╔══██╗██╔════╝██╔════╝    │
  │   ███████╗██║   ██║██████╔╝█████╗  ██████╔╝███████╗██████╔╝█████╗  ██║         │
  │   ╚════██║██║   ██║██╔═══╝ ██╔══╝  ██╔══██╗╚════██║██╔═══╝ ██╔══╝  ██║         │
  │   ███████║╚██████╔╝██║     ███████╗██║  ██║███████║██║     ███████╗╚██████╗    │
  │   ╚══════╝ ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═╝╚══════╝╚═╝     ╚══════╝ ╚═════╝    │
  │                                                                                │
  ╰────────────────────────────────────────────────────────────────────────────────╯
`;

/**
 * Apply teal gradient to banner text
 */
function applyBannerGradient(text: string): string {
  const gradientColors = [
    '#0d9488', // Teal-600
    '#0f766e', // Teal-700
    '#14b8a6', // Teal-500
    '#2dd4bf', // Teal-400
    '#5eead4', // Teal-300
    '#2dd4bf', // Teal-400
    '#14b8a6', // Teal-500
    '#0f766e', // Teal-700
  ];

  const lines = text.split('\n');
  return lines.map((line, lineIndex) => {
    return line.split('').map((char, charIndex) => {
      if (char === ' ' || char === '\n') return char;

      // Box characters get muted color
      if ('╭╮╰╯─│'.includes(char)) {
        return PALETTE.subtle(char);
      }

      // Banner text gets gradient
      const colorIndex = Math.floor((charIndex / Math.max(line.length, 1)) * gradientColors.length);
      const color = gradientColors[Math.min(colorIndex, gradientColors.length - 1)]!;
      return chalk.hex(color)(char);
    }).join('');
  }).join('\n');
}

/**
 * Minimal banner for tight spaces
 */
const MINIMAL_BANNER = `
  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  ┃  ⬡  S U P E R S P E C                                      ┃
  ┃     Spec-Driven Development Framework                      ┃
  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
`;

function applyMinimalBannerStyle(text: string): string {
  const lines = text.split('\n');
  return lines.map(line => {
    return line.split('').map(char => {
      if ('┏┓┗┛━┃'.includes(char)) return PALETTE.subtle(char);
      if (char === '⬡') return PALETTE.primary(char);
      if ('SUPERSPEC'.includes(char)) return PALETTE.primaryBright(char);
      return PALETTE.dim(char);
    }).join('');
  }).join('\n');
}

export const BANNER = `${applyBannerGradient(BANNER_ART)}
  ${PALETTE.white('Welcome to')} ${PALETTE.bold(PALETTE.primaryBright('SuperSpec'))}
  ${PALETTE.dim('Spec-Driven Development Framework')}
  ${PALETTE.subtle('─'.repeat(40))}
`;

export const MINI_BANNER = applyMinimalBannerStyle(MINIMAL_BANNER);

export const INLINE_LOGO = `${PALETTE.primary('⬡')} ${PALETTE.bold(PALETTE.primaryBright('SuperSpec'))}`;

// ═══════════════════════════════════════════════════════════════════════════════
// HEADER & SECTION DECORATORS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Command header with modern styling
 */
export function commandHeader(command: string, description?: string): string {
  const width = 64;
  const topLine = PALETTE.subtle(BOX.heavyTopLeft + BOX.heavyH.repeat(width - 2) + BOX.heavyTopRight);
  const bottomLine = PALETTE.subtle(BOX.heavyBottomLeft + BOX.heavyH.repeat(width - 2) + BOX.heavyBottomRight);

  const logo = PALETTE.primary('⬡');
  const cmdText = PALETTE.bold(PALETTE.white(`superspec ${command}`));
  const title = `${PALETTE.subtle(BOX.heavyV)}  ${logo} ${cmdText}`;
  const padding = ' '.repeat(Math.max(0, width - 6 - `superspec ${command}`.length));
  const titleLine = `${title}${padding}${PALETTE.subtle(BOX.heavyV)}`;

  let output = `\n${topLine}\n${titleLine}`;

  if (description) {
    const desc = PALETTE.dim(description);
    const descPadding = ' '.repeat(Math.max(0, width - 4 - description.length));
    output += `\n${PALETTE.subtle(BOX.heavyV)}  ${desc}${descPadding}${PALETTE.subtle(BOX.heavyV)}`;
  }

  output += `\n${bottomLine}\n`;
  return output;
}

/**
 * Section header
 */
export function sectionHeader(title: string, icon?: string): string {
  const iconStr = icon ? `${icon} ` : '';
  return `\n  ${PALETTE.dim('┌─')} ${iconStr}${PALETTE.bold(PALETTE.white(title))}`;
}

/**
 * Section divider
 */
export function sectionDivider(): string {
  return PALETTE.subtle('  ' + '─'.repeat(60));
}

/**
 * Subsection divider (lighter)
 */
export function subsectionDivider(): string {
  return PALETTE.dark('  ' + '┄'.repeat(50));
}

// ═══════════════════════════════════════════════════════════════════════════════
// BOX COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Styled content box
 */
export function styledBox(title: string, content: string[], options: {
  width?: number;
  style?: 'default' | 'accent' | 'success' | 'warning' | 'error';
} = {}): string {
  const { width = 60, style = 'default' } = options;

  const colorFn = {
    default: PALETTE.subtle,
    accent: PALETTE.accent,
    success: PALETTE.success,
    warning: PALETTE.warning,
    error: PALETTE.error,
  }[style];

  const top = colorFn(BOX.topLeft + BOX.horizontal.repeat(width - 2) + BOX.topRight);
  const bottom = colorFn(BOX.bottomLeft + BOX.horizontal.repeat(width - 2) + BOX.bottomRight);

  const titleIcon = style === 'accent' ? PALETTE.accent('◆') :
    style === 'success' ? PALETTE.success('◆') :
      style === 'warning' ? PALETTE.warning('◆') :
        style === 'error' ? PALETTE.error('◆') :
          PALETTE.primary('◆');

  const titleText = ` ${titleIcon} ${PALETTE.bold(PALETTE.white(title))}`;
  const titlePad = ' '.repeat(Math.max(0, width - 5 - title.length));
  const titleLine = `${colorFn(BOX.vertical)}${titleText}${titlePad}${colorFn(BOX.vertical)}`;

  const divider = colorFn(BOX.teeLeft + BOX.horizontal.repeat(width - 2) + BOX.teeRight);

  const lines = content.map(line => {
    // Strip ANSI codes for length calculation
    const visibleLength = line.replace(/\x1b\[[0-9;]*m/g, '').length;
    const pad = ' '.repeat(Math.max(0, width - 4 - visibleLength));
    return `${colorFn(BOX.vertical)}  ${line}${pad}${colorFn(BOX.vertical)}`;
  });

  return [top, titleLine, divider, ...lines, bottom].join('\n');
}

/**
 * Info card (compact box for single info)
 */
export function infoCard(label: string, value: string, icon?: string): string {
  const iconStr = icon ? `${icon} ` : '';
  return `  ${PALETTE.subtle('│')} ${iconStr}${PALETTE.dim(label + ':')} ${PALETTE.white(value)}`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROGRESS & STATUS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Modern progress bar
 */
export function createProgressBar(
  current: number,
  total: number,
  options: {
    width?: number;
    showPercent?: boolean;
    showCount?: boolean;
    style?: 'default' | 'minimal' | 'detailed';
  } = {}
): string {
  const { width = 20, showPercent = true, showCount = false, style = 'default' } = options;

  if (total === 0) {
    return PALETTE.dim(`[${'░'.repeat(width)}]`) + (showPercent ? PALETTE.dim(' 0%') : '');
  }

  const percentage = Math.min(current / total, 1);
  const filled = Math.round(percentage * width);
  const empty = width - filled;

  // Different fill styles
  const fillChar = style === 'minimal' ? '─' : '█';
  const emptyChar = style === 'minimal' ? '┄' : '░';

  // Color based on percentage
  const fillColor = percentage >= 1 ? PALETTE.success :
    percentage >= 0.7 ? PALETTE.primaryBright :
      percentage >= 0.3 ? PALETTE.primary :
        PALETTE.accent;

  const filledBar = fillColor(fillChar.repeat(filled));
  const emptyBar = PALETTE.dark(emptyChar.repeat(empty));

  let result = `[${filledBar}${emptyBar}]`;

  if (showPercent) {
    const pct = Math.round(percentage * 100);
    const pctColor = percentage >= 1 ? PALETTE.success : PALETTE.white;
    result += ` ${pctColor(`${pct}%`)}`;
  }

  if (showCount) {
    result += PALETTE.dim(` (${current}/${total})`);
  }

  return result;
}

/**
 * Status indicator with label
 */
export function statusIndicator(status: 'success' | 'warning' | 'error' | 'info' | 'pending' | 'active'): string {
  const indicators: Record<string, string> = {
    success: PALETTE.success('◆'),
    warning: PALETTE.warning('◆'),
    error: PALETTE.error('◆'),
    info: PALETTE.info('◆'),
    pending: PALETTE.dim('◇'),
    active: PALETTE.primaryBright('◆'),
  };
  return indicators[status] || PALETTE.dim('◇');
}

/**
 * Status badge with text
 */
export function statusBadge(status: 'active' | 'draft' | 'completed' | 'archived' | 'error'): string {
  const badges: Record<string, string> = {
    active: `${PALETTE.success('◆')} ${PALETTE.success('active')}`,
    draft: `${PALETTE.accent('◇')} ${PALETTE.accent('draft')}`,
    completed: `${PALETTE.info('◆')} ${PALETTE.info('completed')}`,
    archived: `${PALETTE.dim('◆')} ${PALETTE.dim('archived')}`,
    error: `${PALETTE.error('◆')} ${PALETTE.error('error')}`,
  };
  return badges[status] || `${PALETTE.accent('◇')} ${PALETTE.accent('draft')}`;
}

/**
 * Phase indicator for workflow
 */
export function phaseIndicator(current: number, total: number, labels?: string[]): string {
  const phases = [];
  for (let i = 1; i <= total; i++) {
    const label = labels?.[i - 1] ?? `Phase ${i}`;
    if (i < current) {
      phases.push(`${PALETTE.success('●')} ${PALETTE.dim(label)}`);
    } else if (i === current) {
      phases.push(`${PALETTE.accent('●')} ${PALETTE.white(label)}`);
    } else {
      phases.push(`${PALETTE.dark('○')} ${PALETTE.dark(label)}`);
    }
  }
  return phases.join(PALETTE.dim(' → '));
}

// ═══════════════════════════════════════════════════════════════════════════════
// LIST ITEMS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Styled list item
 */
export function listItem(text: string, options: {
  indent?: number;
  icon?: string;
  style?: 'default' | 'dim' | 'highlight';
} = {}): string {
  const { indent = 0, icon, style = 'default' } = options;
  const indentStr = '  '.repeat(indent);
  const iconStr = icon ?? PALETTE.primary('›');

  const textFn = style === 'dim' ? PALETTE.dim :
    style === 'highlight' ? PALETTE.white :
      (t: string) => t;

  return `${indentStr}${iconStr} ${textFn(text)}`;
}

/**
 * Numbered list item
 */
export function numberedItem(num: number, text: string, options: {
  indent?: number;
  style?: 'default' | 'dim' | 'highlight';
} = {}): string {
  const { indent = 0, style = 'default' } = options;
  const indentStr = '  '.repeat(indent);
  const numStr = PALETTE.accent(`${num}.`);

  const textFn = style === 'dim' ? PALETTE.dim :
    style === 'highlight' ? PALETTE.white :
      (t: string) => t;

  return `${indentStr}${numStr} ${textFn(text)}`;
}

/**
 * Task item (checkbox style)
 */
export function taskItem(text: string, done: boolean, options: {
  indent?: number;
} = {}): string {
  const { indent = 0 } = options;
  const indentStr = '  '.repeat(indent);
  const icon = done ? PALETTE.success('☑') : PALETTE.dim('☐');
  const textStyle = done ? PALETTE.dim : PALETTE.white;

  return `${indentStr}${icon} ${textStyle(text)}`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// KEY HINTS & HELP
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Keyboard shortcut hint
 */
export function keyHint(keys: string, action: string): string {
  return `${PALETTE.primary(keys)} ${PALETTE.dim(action)}`;
}

/**
 * Multiple key hints
 */
export function keyHints(hints: Array<[string, string]>): string {
  return hints.map(([keys, action]) => keyHint(keys, action)).join(PALETTE.dark(' · '));
}

/**
 * Command hint
 */
export function commandHint(cmd: string, desc?: string): string {
  const descStr = desc ? PALETTE.dim(` - ${desc}`) : '';
  return `  ${PALETTE.primary('›')} ${PALETTE.accent(cmd)}${descStr}`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TABLES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Simple table row
 */
export function tableRow(columns: string[], widths: number[]): string {
  return columns.map((col, i) => {
    const width = widths[i] ?? 20;
    const visibleLength = col.replace(/\x1b\[[0-9;]*m/g, '').length;
    const pad = ' '.repeat(Math.max(0, width - visibleLength));
    return col + pad;
  }).join(PALETTE.dark(' │ '));
}

/**
 * Table header
 */
export function tableHeader(columns: string[], widths: number[]): string {
  const header = columns.map((col, i) => {
    const width = widths[i] ?? 20;
    return PALETTE.bold(PALETTE.dim(col.padEnd(width)));
  }).join(PALETTE.dark(' │ '));

  const divider = widths.map(w => PALETTE.dark('─'.repeat(w))).join(PALETTE.dark('─┼─'));

  return `${header}\n${divider}`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Highlight text within a string
 */
export function highlight(text: string, term: string): string {
  if (!term) return text;
  const regex = new RegExp(`(${term})`, 'gi');
  return text.replace(regex, PALETTE.accent('$1'));
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + PALETTE.dim('…');
}

/**
 * Format a path
 */
export function formatPath(path: string): string {
  const parts = path.split('/');
  if (parts.length <= 2) return PALETTE.dim(path);

  const filename = parts.pop()!;
  const dir = parts.join('/');
  return `${PALETTE.dark(dir + '/')}${PALETTE.white(filename)}`;
}

/**
 * Format a date
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return PALETTE.dim(d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }));
}

/**
 * Format file size
 */
export function formatSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MESSAGE HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Success message
 */
export function successMessage(text: string): string {
  return `  ${ICONS.success} ${PALETTE.success(text)}`;
}

/**
 * Error message
 */
export function errorMessage(text: string): string {
  return `  ${ICONS.error} ${PALETTE.error(text)}`;
}

/**
 * Warning message
 */
export function warningMessage(text: string): string {
  return `  ${ICONS.warning} ${PALETTE.warning(text)}`;
}

/**
 * Info message
 */
export function infoMessage(text: string): string {
  return `  ${ICONS.info} ${PALETTE.info(text)}`;
}

/**
 * Tip/hint message
 */
export function tipMessage(text: string): string {
  return `  ${PALETTE.accent('💡')} ${PALETTE.dim(text)}`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CARDS (for list/show commands)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Change card for list view
 */
export function changeCard(options: {
  id: string;
  title?: string;
  status: 'active' | 'draft' | 'completed' | 'archived';
  phase?: string;
  progress?: { current: number; total: number };
  specs?: number;
}): string {
  const { id, title, status, phase, progress, specs } = options;

  const statusIcon = statusIndicator(status === 'active' ? 'active' :
    status === 'draft' ? 'pending' :
      status === 'completed' ? 'success' : 'info');

  const lines: string[] = [];

  // Header
  lines.push(`  ${PALETTE.subtle('┌─')} ${statusIcon} ${PALETTE.bold(PALETTE.white(id))}`);

  // Title (if different from id)
  if (title && title !== id) {
    lines.push(`  ${PALETTE.subtle('│')}   ${PALETTE.dim(title)}`);
  }

  // Phase
  if (phase) {
    lines.push(`  ${PALETTE.subtle('│')}   ${PALETTE.dim('Phase:')} ${PALETTE.accent(phase)}`);
  }

  // Progress
  if (progress) {
    const bar = createProgressBar(progress.current, progress.total, { width: 15 });
    lines.push(`  ${PALETTE.subtle('│')}   ${bar}`);
  }

  // Specs count
  if (specs !== undefined) {
    lines.push(`  ${PALETTE.subtle('│')}   ${PALETTE.dim('Specs:')} ${PALETTE.white(String(specs))}`);
  }

  // Footer
  lines.push(`  ${PALETTE.subtle('└─')}`);

  return lines.join('\n');
}

/**
 * Spec card for list view
 */
export function specCard(options: {
  name: string;
  path?: string;
  requirements?: number;
  scenarios?: number;
}): string {
  const { name, path, requirements, scenarios } = options;

  const lines: string[] = [];

  lines.push(`  ${PALETTE.subtle('┌─')} ${ICONS.spec} ${PALETTE.bold(PALETTE.primaryBright(name))}`);

  if (path) {
    lines.push(`  ${PALETTE.subtle('│')}   ${formatPath(path)}`);
  }

  const stats: string[] = [];
  if (requirements !== undefined) stats.push(`${requirements} requirements`);
  if (scenarios !== undefined) stats.push(`${scenarios} scenarios`);

  if (stats.length > 0) {
    lines.push(`  ${PALETTE.subtle('│')}   ${PALETTE.dim(stats.join(' · '))}`);
  }

  lines.push(`  ${PALETTE.subtle('└─')}`);

  return lines.join('\n');
}

// ═══════════════════════════════════════════════════════════════════════════════
// FOOTER & ACTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Quick actions footer
 */
export function quickActions(actions: Array<{ cmd: string; desc: string }>): string {
  const lines = [
    '',
    sectionHeader('Quick Actions', '🚀'),
    '',
  ];

  actions.forEach((action, i) => {
    lines.push(numberedItem(i + 1, `${PALETTE.white(action.cmd)} ${PALETTE.dim('- ' + action.desc)}`));
  });

  return lines.join('\n');
}

/**
 * Next steps suggestion
 */
export function nextSteps(steps: string[]): string {
  const lines = [
    '',
    sectionHeader('Next Steps', '→'),
    '',
  ];

  steps.forEach(step => {
    lines.push(listItem(step, { icon: PALETTE.accent('→') }));
  });

  return lines.join('\n');
}
