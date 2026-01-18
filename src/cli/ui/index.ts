/**
 * CLI UI Module
 *
 * Re-exports all UI components for easy importing
 */

// Palette and styling
export {
  PALETTE,
  SYMBOLS,
  BOX,
  BANNER,
  MINI_BANNER,
  createProgressBar,
  statusBadge,
  keyHint,
  keyHints,
  commandHeader,
  sectionDivider,
  styledBox,
  statusIndicator,
  listItem,
  numberedItem,
} from './palette.js';

// Interactive detection
export {
  isInteractive,
  requireInteractive,
  shouldUseColor,
  type InteractiveOptions,
} from './interactive.js';

// Spinners
export {
  startSpinner,
  spinnerSuccess,
  spinnerFail,
  spinnerWarn,
  spinnerInfo,
  withSpinner,
} from './spinner.js';

// Prompts
export {
  selectPrompt,
  confirmPrompt,
  inputPrompt,
  checkboxPrompt,
  selectChange,
  selectSpec,
  selectItemType,
  confirmDangerous,
  type SelectChoice,
} from './prompts.js';

// Display helpers
export {
  displayBox,
  displayTable,
  displayHeader,
  displaySection,
  displayList,
  displayTree,
  displayKeyValue,
  displaySuccess,
  displayError,
  displayWarning,
  displayInfo,
} from './display.js';
