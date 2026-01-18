/**
 * CLI UI Module
 *
 * Re-exports all UI components for easy importing
 * Design System: "Precision Terminal"
 */

// ═══════════════════════════════════════════════════════════════════════════════
// PALETTE & STYLING
// ═══════════════════════════════════════════════════════════════════════════════

export {
  // Core palette
  PALETTE,
  SYMBOLS,
  ICONS,
  BOX,
  LINES,

  // Banners
  BANNER,
  MINI_BANNER,
  INLINE_LOGO,

  // Progress & Status
  createProgressBar,
  statusBadge,
  statusIndicator,
  phaseIndicator,

  // Headers & Sections
  commandHeader,
  sectionHeader,
  sectionDivider,
  subsectionDivider,

  // Boxes
  styledBox,
  infoCard,

  // Lists
  listItem,
  numberedItem,
  taskItem,

  // Key hints
  keyHint,
  keyHints,
  commandHint,

  // Tables
  tableRow,
  tableHeader,

  // Utility functions
  highlight,
  truncate,
  formatPath,
  formatDate,
  formatSize,

  // Messages
  successMessage,
  errorMessage,
  warningMessage,
  infoMessage,
  tipMessage,

  // Cards
  changeCard,
  specCard,

  // Footers
  quickActions,
  nextSteps,
} from './palette.js';

// ═══════════════════════════════════════════════════════════════════════════════
// INTERACTIVE DETECTION
// ═══════════════════════════════════════════════════════════════════════════════

export {
  isInteractive,
  requireInteractive,
  shouldUseColor,
  type InteractiveOptions,
} from './interactive.js';

// ═══════════════════════════════════════════════════════════════════════════════
// SPINNERS
// ═══════════════════════════════════════════════════════════════════════════════

export {
  startSpinner,
  spinnerSuccess,
  spinnerFail,
  spinnerWarn,
  spinnerInfo,
  withSpinner,
} from './spinner.js';

// ═══════════════════════════════════════════════════════════════════════════════
// PROMPTS
// ═══════════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════════
// DISPLAY HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

export {
  // Basic displays
  displayHeader,
  displaySection,
  displayEmptyLine,
  displayDivider,

  // Boxes
  displayBox,
  displayInfoCard,

  // Tables
  displayTable,
  displayKeyValueTable,

  // Lists
  displayList,
  displayTree,
  displayFileTree,

  // Key-value
  displayKeyValue,
  displayLabeledValue,

  // Progress
  displayProgress,
  displayStatus,

  // Messages
  displaySuccess,
  displayError,
  displayWarning,
  displayInfo,
  displayTip,
  displayNote,

  // Special displays
  displayPhases,
  displayStats,
  displayCommand,
  displayNextSteps,
  displayQuickActions,

  // Validation
  displayValidationItem,
  displayValidationSummary,

  // Cards
  displayChangeCard,
  displaySpecCard,
} from './display.js';
