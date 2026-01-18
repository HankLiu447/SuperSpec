/**
 * Display Utilities
 *
 * Helpers for formatted output
 */

import { PALETTE, BOX, SYMBOLS } from './palette.js';

/**
 * Display a header with decoration
 */
export function displayHeader(title: string, subtitle?: string): void {
  console.log();
  console.log(PALETTE.bold(PALETTE.white(title)));
  if (subtitle) {
    console.log(PALETTE.midGray(subtitle));
  }
  console.log(PALETTE.darkGray('─'.repeat(50)));
}

/**
 * Display a section header
 */
export function displaySection(title: string): void {
  console.log();
  console.log(PALETTE.bold(PALETTE.primary(title)));
}

/**
 * Display a box around content
 */
export function displayBox(lines: string[], options?: {
  title?: string;
  width?: number;
  padding?: number;
}): void {
  const width = options?.width ?? 60;
  const padding = options?.padding ?? 1;
  const padStr = ' '.repeat(padding);

  // Top border
  if (options?.title) {
    const titlePart = ` ${options.title} `;
    const remainingWidth = width - titlePart.length - 2;
    const leftLen = Math.floor(remainingWidth / 2);
    const rightLen = remainingWidth - leftLen;
    console.log(
      PALETTE.midGray(BOX.topLeft + BOX.horizontal.repeat(leftLen)) +
      PALETTE.white(titlePart) +
      PALETTE.midGray(BOX.horizontal.repeat(rightLen) + BOX.topRight)
    );
  } else {
    console.log(PALETTE.midGray(BOX.topLeft + BOX.horizontal.repeat(width - 2) + BOX.topRight));
  }

  // Content lines
  for (const line of lines) {
    const contentWidth = width - 2 - (padding * 2);
    const paddedLine = line.slice(0, contentWidth).padEnd(contentWidth);
    console.log(PALETTE.midGray(BOX.vertical) + padStr + paddedLine + padStr + PALETTE.midGray(BOX.vertical));
  }

  // Bottom border
  console.log(PALETTE.midGray(BOX.bottomLeft + BOX.horizontal.repeat(width - 2) + BOX.bottomRight));
}

/**
 * Display a simple table
 */
export function displayTable(
  headers: string[],
  rows: string[][],
  options?: { columnWidths?: number[] }
): void {
  const widths = options?.columnWidths ?? headers.map((h, i) => {
    const maxContent = Math.max(h.length, ...rows.map(r => (r[i] ?? '').length));
    return Math.min(maxContent + 2, 30);
  });

  // Header
  const headerRow = headers.map((h, i) => PALETTE.bold(h.padEnd(widths[i] ?? 10))).join(' ');
  console.log(headerRow);

  // Separator
  console.log(widths.map(w => PALETTE.darkGray('─'.repeat(w))).join(' '));

  // Rows
  for (const row of rows) {
    const formattedRow = row.map((cell, i) => (cell ?? '').padEnd(widths[i] ?? 10)).join(' ');
    console.log(formattedRow);
  }
}

/**
 * Display a list with bullets
 */
export function displayList(items: string[], options?: { indent?: number }): void {
  const indent = ' '.repeat(options?.indent ?? 2);
  for (const item of items) {
    console.log(`${indent}${SYMBOLS.bullet} ${item}`);
  }
}

/**
 * Display a tree structure
 */
export function displayTree(items: Array<{ name: string; children?: string[] }>, options?: { indent?: number }): void {
  const indent = ' '.repeat(options?.indent ?? 0);

  for (let i = 0; i < items.length; i++) {
    const item = items[i]!;
    const isLast = i === items.length - 1;
    const prefix = isLast ? SYMBOLS.corner : SYMBOLS.tee;

    console.log(`${indent}${PALETTE.midGray(prefix)} ${item.name}`);

    if (item.children && item.children.length > 0) {
      const childIndent = indent + (isLast ? '  ' : `${SYMBOLS.verticalLine} `);
      for (let j = 0; j < item.children.length; j++) {
        const child = item.children[j]!;
        const childIsLast = j === item.children.length - 1;
        const childPrefix = childIsLast ? SYMBOLS.corner : SYMBOLS.tee;
        console.log(`${childIndent}${PALETTE.midGray(childPrefix)} ${PALETTE.lightGray(child)}`);
      }
    }
  }
}

/**
 * Display a key-value pair
 */
export function displayKeyValue(key: string, value: string, options?: { keyWidth?: number }): void {
  const keyWidth = options?.keyWidth ?? 15;
  console.log(`${PALETTE.midGray(key.padEnd(keyWidth))} ${value}`);
}

/**
 * Display success message
 */
export function displaySuccess(message: string): void {
  console.log();
  console.log(`${SYMBOLS.success} ${PALETTE.success(message)}`);
}

/**
 * Display error message
 */
export function displayError(message: string): void {
  console.log();
  console.log(`${SYMBOLS.error} ${PALETTE.error(message)}`);
}

/**
 * Display warning message
 */
export function displayWarning(message: string): void {
  console.log();
  console.log(`${SYMBOLS.warning} ${PALETTE.warning(message)}`);
}

/**
 * Display info message
 */
export function displayInfo(message: string): void {
  console.log();
  console.log(`${SYMBOLS.info} ${PALETTE.info(message)}`);
}
