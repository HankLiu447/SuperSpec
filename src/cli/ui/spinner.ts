/**
 * Spinner Utilities
 *
 * Loading indicators and progress feedback
 */

import ora, { type Ora } from 'ora';
import { PALETTE } from './palette.js';

export interface SpinnerOptions {
  text?: string;
  color?: 'gray' | 'blue' | 'green' | 'yellow' | 'red';
}

/**
 * Create and start a spinner
 */
export function startSpinner(text: string, options?: SpinnerOptions): Ora {
  return ora({
    text,
    color: options?.color ?? 'gray',
    spinner: {
      interval: 80,
      frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
    }
  }).start();
}

/**
 * Stop spinner with success message
 */
export function spinnerSuccess(spinner: Ora, text: string): void {
  spinner.stopAndPersist({
    symbol: PALETTE.success('✓'),
    text: PALETTE.white(text)
  });
}

/**
 * Stop spinner with failure message
 */
export function spinnerFail(spinner: Ora, text: string): void {
  spinner.stopAndPersist({
    symbol: PALETTE.error('✗'),
    text: PALETTE.error(text)
  });
}

/**
 * Stop spinner with warning message
 */
export function spinnerWarn(spinner: Ora, text: string): void {
  spinner.stopAndPersist({
    symbol: PALETTE.warning('⚠'),
    text: PALETTE.warning(text)
  });
}

/**
 * Stop spinner with info message
 */
export function spinnerInfo(spinner: Ora, text: string): void {
  spinner.stopAndPersist({
    symbol: PALETTE.info('ℹ'),
    text: PALETTE.lightGray(text)
  });
}

/**
 * Run an async operation with a spinner
 */
export async function withSpinner<T>(
  text: string,
  operation: () => Promise<T>,
  options?: {
    successText?: string;
    failText?: string;
  }
): Promise<T> {
  const spinner = startSpinner(text);

  try {
    const result = await operation();
    spinnerSuccess(spinner, options?.successText ?? text);
    return result;
  } catch (error) {
    spinnerFail(spinner, options?.failText ?? `Failed: ${text}`);
    throw error;
  }
}
