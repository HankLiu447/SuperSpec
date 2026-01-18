/**
 * Interactive Detection Utilities
 *
 * Determines if the CLI is running in an interactive environment
 */

export interface InteractiveOptions {
  interactive?: boolean;
}

/**
 * Check if the current environment is interactive
 */
export function isInteractive(options?: boolean | InteractiveOptions): boolean {
  // Explicit option override
  if (typeof options === 'boolean') {
    return options;
  }
  if (options?.interactive !== undefined) {
    return options.interactive;
  }

  // Environment variable override
  if (process.env['SUPERSPEC_INTERACTIVE'] === '0') {
    return false;
  }
  if (process.env['SUPERSPEC_INTERACTIVE'] === '1') {
    return true;
  }

  // CI environment detection
  if (process.env['CI']) {
    return false;
  }
  if (process.env['CONTINUOUS_INTEGRATION']) {
    return false;
  }

  // No color often means non-interactive
  if (process.env['NO_COLOR']) {
    return false;
  }

  // Check if stdin is a TTY
  return !!process.stdin.isTTY;
}

/**
 * Ensure interactive mode or exit with error
 */
export function requireInteractive(message: string = 'This command requires interactive mode'): void {
  if (!isInteractive()) {
    console.error(`Error: ${message}`);
    console.error('Run with explicit arguments or in a terminal with TTY support.');
    process.exit(1);
  }
}

/**
 * Check if colors should be enabled
 */
export function shouldUseColor(): boolean {
  if (process.env['NO_COLOR']) {
    return false;
  }
  if (process.env['FORCE_COLOR']) {
    return true;
  }
  return !!process.stdout.isTTY;
}
