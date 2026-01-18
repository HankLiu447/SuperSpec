/**
 * SuperSpec Color Palette
 *
 * Consistent color scheme for CLI output
 */

import chalk from 'chalk';

export const PALETTE = {
  // Primary colors
  primary: chalk.hex('#6366f1'),      // Indigo
  secondary: chalk.hex('#8b5cf6'),    // Purple
  accent: chalk.hex('#06b6d4'),       // Cyan
  cyan: chalk.hex('#06b6d4'),         // Cyan (alias)

  // Status colors
  success: chalk.hex('#22c55e'),      // Green
  warning: chalk.hex('#eab308'),      // Yellow
  error: chalk.hex('#ef4444'),        // Red
  info: chalk.hex('#3b82f6'),         // Blue

  // Neutral colors
  white: chalk.hex('#f4f4f5'),        // Light white
  lightGray: chalk.hex('#a1a1aa'),    // Light gray
  midGray: chalk.hex('#71717a'),      // Mid gray
  darkGray: chalk.hex('#3f3f46'),     // Dark gray
  dim: chalk.dim,

  // Text styles
  bold: chalk.bold,
  italic: chalk.italic,
  underline: chalk.underline,
};

/**
 * Symbols used throughout the CLI
 */
export const SYMBOLS = {
  // Status indicators
  success: PALETTE.success('✓'),
  error: PALETTE.error('✗'),
  warning: PALETTE.warning('⚠'),
  info: PALETTE.info('ℹ'),

  // Navigation
  arrow: PALETTE.primary('›'),
  pointer: PALETTE.white('❯'),

  // Selection
  selected: PALETTE.success('◉'),
  unselected: PALETTE.midGray('○'),
  checkbox: PALETTE.success('☑'),
  uncheckbox: PALETTE.midGray('☐'),

  // Progress
  filledBar: PALETTE.success('█'),
  emptyBar: PALETTE.darkGray('░'),
  spinner: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],

  // Decorative
  bullet: PALETTE.midGray('•'),
  dash: PALETTE.midGray('─'),
  verticalLine: PALETTE.midGray('│'),
  corner: PALETTE.midGray('└'),
  tee: PALETTE.midGray('├'),
};

/**
 * Box drawing characters for tables and boxes
 */
export const BOX = {
  topLeft: '┌',
  topRight: '┐',
  bottomLeft: '└',
  bottomRight: '┘',
  horizontal: '─',
  vertical: '│',
  teeLeft: '├',
  teeRight: '┤',
  teeTop: '┬',
  teeBottom: '┴',
  cross: '┼',
  doubleLine: '═',
};

/**
 * Gradient colors for the banner (Indigo → Purple → Cyan)
 */
const GRADIENT_COLORS = [
  '#6366f1', // Indigo
  '#7c5cf6', // Indigo-Purple
  '#8b5cf6', // Purple
  '#a855f7', // Purple-Violet
  '#c084fc', // Violet
  '#d946ef', // Fuchsia
  '#ec4899', // Pink
  '#f472b6', // Pink-light
  '#06b6d4', // Cyan
  '#22d3ee', // Cyan-light
];

/**
 * Apply horizontal gradient to text
 */
function gradientLine(text: string, colors: string[]): string {
  const chars = text.split('');
  const colorCount = colors.length;

  return chars.map((char, i) => {
    if (char === ' ') return char;
    const colorIndex = Math.floor((i / text.length) * colorCount);
    const color = colors[Math.min(colorIndex, colorCount - 1)]!;
    return chalk.hex(color)(char);
  }).join('');
}

/**
 * Apply vertical + horizontal gradient to multiple lines
 */
function gradientBanner(lines: string[]): string {
  // Vertical gradient colors (top to bottom)
  const verticalGradient = [
    ['#818cf8', '#a78bfa', '#c084fc', '#e879f9', '#f472b6', '#fb7185', '#22d3ee', '#2dd4bf', '#34d399', '#4ade80'],
    ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#06b6d4', '#14b8a6', '#10b981', '#22c55e'],
    ['#4f46e5', '#7c3aed', '#9333ea', '#c026d3', '#db2777', '#e11d48', '#0891b2', '#0d9488', '#059669', '#16a34a'],
    ['#4338ca', '#6d28d9', '#7e22ce', '#a21caf', '#be185d', '#be123c', '#0e7490', '#0f766e', '#047857', '#15803d'],
    ['#3730a3', '#5b21b6', '#6b21a8', '#86198f', '#9d174d', '#9f1239', '#155e75', '#115e59', '#065f46', '#166534'],
  ];

  return lines.map((line, lineIndex) => {
    const colors = verticalGradient[lineIndex] ?? verticalGradient[0]!;
    return gradientLine(line, colors);
  }).join('\n');
}

/**
 * ASCII art banner for SuperSpec with gradient
 */
const bannerLines = [
  ' ███████  ██    ██  ██████   ██████  ██████   ███████  ██████   ██████   █████',
  ' ██       ██    ██  ██   ██  ██      ██   ██  ██       ██   ██  ██      ██     ',
  ' ███████  ██    ██  ██████   █████   ██████   ███████  ██████   █████   ██     ',
  '      ██  ██    ██  ██       ██      ██   ██       ██  ██       ██      ██     ',
  ' ███████   ██████   ██       ██████  ██   ██  ███████  ██       ██████   █████',
];

export const BANNER = `
${gradientBanner(bannerLines)}

${PALETTE.white('Welcome to')} ${PALETTE.bold(PALETTE.primary('SuperSpec'))}${PALETTE.white('!')}
${PALETTE.midGray('Spec-Driven Development Framework')}
`;

/**
 * Shorter banner for inline use
 */
export const MINI_BANNER = PALETTE.bold(PALETTE.primary('SuperSpec'));

/**
 * Command header with decorative line
 */
export function commandHeader(command: string, description?: string): string {
  const line = PALETTE.primary('━'.repeat(60));
  const title = `${PALETTE.bold(PALETTE.primary('⬡'))} ${PALETTE.bold(PALETTE.white(`superspec ${command}`))}`;
  const desc = description ? `\n${PALETTE.midGray(description)}` : '';
  return `\n${line}\n${title}${desc}\n${line}`;
}

/**
 * Section divider
 */
export function sectionDivider(): string {
  return PALETTE.darkGray('─'.repeat(60));
}

/**
 * Styled box for important content
 */
export function styledBox(title: string, content: string[]): string {
  const width = 58;
  const top = PALETTE.primary('╭' + '─'.repeat(width) + '╮');
  const bottom = PALETTE.primary('╰' + '─'.repeat(width) + '╯');
  const titleLine = PALETTE.primary('│') + ' ' + PALETTE.bold(PALETTE.white(title.padEnd(width - 1))) + PALETTE.primary('│');
  const divider = PALETTE.primary('├' + '─'.repeat(width) + '┤');

  const lines = content.map(line => {
    const paddedLine = line.slice(0, width - 2).padEnd(width - 2);
    return PALETTE.primary('│') + ' ' + paddedLine + ' ' + PALETTE.primary('│');
  });

  return [top, titleLine, divider, ...lines, bottom].join('\n');
}

/**
 * Status indicator with icon
 */
export function statusIndicator(status: 'success' | 'warning' | 'error' | 'info' | 'pending'): string {
  const indicators = {
    success: PALETTE.success('●'),
    warning: PALETTE.warning('●'),
    error: PALETTE.error('●'),
    info: PALETTE.info('●'),
    pending: PALETTE.darkGray('○'),
  };
  return indicators[status];
}

/**
 * Fancy list item
 */
export function listItem(text: string, indent: number = 0): string {
  const indentStr = '  '.repeat(indent);
  return `${indentStr}${PALETTE.primary('›')} ${text}`;
}

/**
 * Numbered list item
 */
export function numberedItem(num: number, text: string, indent: number = 0): string {
  const indentStr = '  '.repeat(indent);
  return `${indentStr}${PALETTE.primary(`${num}.`)} ${text}`;
}

/**
 * Helper to create a progress bar
 */
export function createProgressBar(
  current: number,
  total: number,
  width: number = 20
): string {
  if (total === 0) return PALETTE.midGray('[' + '░'.repeat(width) + ']');

  const percentage = Math.min(current / total, 1);
  const filled = Math.round(percentage * width);
  const empty = width - filled;

  const filledBar = PALETTE.success('█'.repeat(filled));
  const emptyBar = PALETTE.darkGray('░'.repeat(empty));
  const percent = PALETTE.white(`${Math.round(percentage * 100)}%`);

  return `[${filledBar}${emptyBar}] ${percent}`;
}

/**
 * Helper to create a status badge
 */
export function statusBadge(status: 'active' | 'draft' | 'completed' | 'archived'): string {
  const badges = {
    active: PALETTE.success('● active'),
    draft: PALETTE.warning('○ draft'),
    completed: PALETTE.info('✓ completed'),
    archived: PALETTE.midGray('◌ archived'),
  };
  return badges[status];
}

/**
 * Format a key hint (e.g., "↑/↓ to move")
 */
export function keyHint(keys: string, action: string): string {
  return `${PALETTE.primary(keys)} ${PALETTE.midGray(action)}`;
}

/**
 * Format key hints for interactive prompts
 */
export function keyHints(hints: Array<[string, string]>): string {
  return hints.map(([keys, action]) => keyHint(keys, action)).join(PALETTE.midGray(' · '));
}
