/**
 * Interactive Prompts
 *
 * Wrappers around @inquirer/prompts for consistent styling
 */

import { select, confirm, input, checkbox } from '@inquirer/prompts';
import { PALETTE, keyHints } from './palette.js';
import { isInteractive } from './interactive.js';

export interface SelectChoice<T> {
  name: string;
  value: T;
  description?: string;
  disabled?: boolean | string;
}

/**
 * Interactive select prompt
 */
export async function selectPrompt<T>(options: {
  message: string;
  choices: SelectChoice<T>[];
  default?: T;
}): Promise<T> {
  console.log();  // Add spacing

  const result = await select({
    message: PALETTE.white(options.message),
    choices: options.choices.map(choice => ({
      name: choice.name,
      value: choice.value,
      description: choice.description ? PALETTE.midGray(choice.description) : undefined,
      disabled: choice.disabled,
    })),
    default: options.default,
  });

  return result;
}

/**
 * Interactive confirm prompt
 */
export async function confirmPrompt(options: {
  message: string;
  default?: boolean;
}): Promise<boolean> {
  console.log();  // Add spacing

  return confirm({
    message: PALETTE.white(options.message),
    default: options.default ?? false,
  });
}

/**
 * Interactive text input prompt
 */
export async function inputPrompt(options: {
  message: string;
  default?: string;
  validate?: (value: string) => boolean | string;
}): Promise<string> {
  console.log();  // Add spacing

  return input({
    message: PALETTE.white(options.message),
    default: options.default,
    validate: options.validate,
  });
}

/**
 * Interactive checkbox (multi-select) prompt
 */
export async function checkboxPrompt<T>(options: {
  message: string;
  choices: SelectChoice<T>[];
  required?: boolean;
}): Promise<T[]> {
  console.log();  // Add spacing

  return checkbox({
    message: PALETTE.white(options.message),
    choices: options.choices.map(choice => ({
      name: choice.name,
      value: choice.value,
      checked: false,
      disabled: choice.disabled,
    })),
    required: options.required,
  });
}

/**
 * Select from a list of changes
 */
export async function selectChange(changes: string[], message?: string): Promise<string> {
  if (changes.length === 0) {
    console.log(PALETTE.warning('No changes found.'));
    console.log(PALETTE.midGray('Start a new change with: /superspec:brainstorm'));
    process.exit(0);
  }

  return selectPrompt({
    message: message ?? 'Select a change:',
    choices: changes.map(id => ({
      name: id,
      value: id,
    })),
  });
}

/**
 * Select from a list of specs
 */
export async function selectSpec(specs: string[], message?: string): Promise<string> {
  if (specs.length === 0) {
    console.log(PALETTE.warning('No specs found.'));
    console.log(PALETTE.midGray('Archive a change to create main specs.'));
    process.exit(0);
  }

  return selectPrompt({
    message: message ?? 'Select a spec:',
    choices: specs.map(name => ({
      name,
      value: name,
    })),
  });
}

/**
 * Select between changes and specs
 */
export async function selectItemType(): Promise<'change' | 'spec'> {
  return selectPrompt({
    message: 'What would you like to view?',
    choices: [
      { name: 'Change', value: 'change' as const, description: 'View an active or archived change' },
      { name: 'Specification', value: 'spec' as const, description: 'View a main specification' },
    ],
  });
}

/**
 * Confirm a potentially dangerous action
 */
export async function confirmDangerous(options: {
  message: string;
  confirmText?: string;
}): Promise<boolean> {
  console.log();
  console.log(PALETTE.warning('⚠ WARNING'));

  return confirm({
    message: PALETTE.warning(options.message),
    default: false,
  });
}
